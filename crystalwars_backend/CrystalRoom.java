package crystalwars_backend;

import java.io.IOException;
import java.security.SecureRandom;
import java.util.Collection;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Exchanger;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.web.socket.TextMessage;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class CrystalRoom {

	ObjectMapper mapper = new ObjectMapper();
	public String ROOM_ID;
	private final int MAX_PLAYERS = 2;
	private final AtomicInteger NUM_PLAYERS;
	private Player turnPlayer, waitPlayer;
	private final Map<Integer, Player> PLAYERS = new ConcurrentHashMap<>();

	// Selection
	private AtomicBoolean solvingCard = new AtomicBoolean();
	private AtomicBoolean solvingSelect = new AtomicBoolean();
	private final Exchanger<Card> SELECTOR = new Exchanger<Card>();
	private BaseEffect currentEffect;

	public CrystalRoom() {
		this.NUM_PLAYERS = new AtomicInteger();
		do {
			ROOM_ID = generateRoomID();
		} while (CrystalServer.SERVER.ROOMS.containsKey(ROOM_ID));
		System.out.println(ROOM_ID);
	}

	private String generateRoomID() {
		String roomID = "";
		for (int i = 0; i < 6; i++) {
			roomID += (char) (new SecureRandom().nextInt('z' - 'a') + 'a');
		}

		return roomID.toUpperCase();
	}

	public boolean addPlayer(Player player, String deck) {
		int count = NUM_PLAYERS.getAndIncrement();
		if (count >= MAX_PLAYERS) {
			NUM_PLAYERS.getAndDecrement();
			return false;
		}

		PLAYERS.put(player.ID, player);
		PLAYERS.get(player.ID)._deck.addCards(CardPool.DATA.pullDeck(deck));

		return true;
	}
	
	public Collection<Player> getPlayers() {
		return PLAYERS.values();
	}

	public void startGame() {
		turnPlayer = (Player) getPlayers().toArray()[0];
		waitPlayer = (Player) getPlayers().toArray()[1];

		solveCardTargets(turnPlayer, waitPlayer);
		solveCardTargets(waitPlayer, turnPlayer);

		turnPlayer._deck.shuffle();
		waitPlayer._deck.shuffle();

		turnPlayer.draw(3);
		waitPlayer.draw(4);
		
		//buildAndSendUpdateMsg();
	}
	
	public void buildAndSendUpdateMsg() {
		ObjectNode json = mapper.createObjectNode();
		ArrayNode updateArray = mapper.createArrayNode();
		
		for(PlayerRegister.Register reg : turnPlayer.REGISTER.getRegister()) {
			ObjectNode update = mapper.createObjectNode();
			update.put("id", turnPlayer.ID);
			update.put("update", reg.update);
			update.put("data", reg.data);
			updateArray.addPOJO(update);
		}
		turnPlayer.REGISTER.clear();
		
		for(PlayerRegister.Register reg : waitPlayer.REGISTER.getRegister()) {
			ObjectNode update = mapper.createObjectNode();
			update.put("id", waitPlayer.ID);
			update.put("update", reg.update);
			update.put("data", reg.data);
			updateArray.addPOJO(update);
		}
		waitPlayer.REGISTER.clear();
		
		json.put("event", "UPDATE");
		json.putPOJO("updates", updateArray);

		this.broadcast(json.toString());
	}
	
	public void broadcast(String message) {
		for (Player player : getPlayers()) {
			try {
				player.SESSION.sendMessage(new TextMessage(message.toString()));
			} catch (Throwable ex) {
				System.err.println("Execption sending message to player " + player.SESSION.getId());
				ex.printStackTrace(System.err);
				PLAYERS.remove(Integer.parseInt(player.SESSION.getId()));
			}
		}
	}	
	
	public void chooseStartingPlayer() {
		int firstPlayer = new SecureRandom().nextInt(2);
		if (firstPlayer == 1) {
			Player auxPlayer = turnPlayer;
			turnPlayer = waitPlayer;
			waitPlayer = auxPlayer;
		}
	}

	public void switchTurn(Player player) {
		if(player != turnPlayer)
			return;
		
		activateEffectOn(EffectOn.TURN_END, CardSite.FIELD, turnPlayer);
		activateEffectOn(EffectOn.TURN_END_GRAVEYARD, CardSite.GRAVEYARD, turnPlayer);
		
		Player auxPlayer = turnPlayer;
		turnPlayer = waitPlayer;
		waitPlayer = auxPlayer;
		
		activateEffectOn(EffectOn.TURN_START, CardSite.FIELD, turnPlayer);
		
		turnPlayer.draw(1);
		
		//buildAndSendUpdateMsg();
	}
	
	public boolean play(Player player, String cardID) {
		if (player != turnPlayer || !solvingCard.getAndSet(true)) {
			return false;
		}

		CardCollection ID = CardCollection.get(Integer.parseInt(cardID));
		if (!player._hand.contains(ID))
			return false;

		for (BaseEffect prePlay : player._hand.checkCard(ID).effects) {
			if (prePlay.checkConditions() && prePlay.EFFECT_ON == EffectOn.PRE_PLAY)
				prePlay.activate();
		}

		for (BaseCondition playCond : player._hand.checkCard(ID).PLAY_CONDITIONS) {
			if (!playCond.check()) {
				return false;
			}
		}

		Card playedCard = player._hand.getCard(ID);

		if (playedCard.CARD_TYPE == CardType.SUMMONING) {
			player._field.addCard(playedCard);
			player.REGISTER.register("SUMMON", String.valueOf(playedCard.ID.ID));
		}

		for (BaseEffect effect : playedCard.effects) {
			currentEffect = effect;
			if (effect.checkConditions() && effect.EFFECT_ON == EffectOn.PLAY) {
				if (effect.TARGET == Target.SELECT) {
					try {					
						notifySelect(player);
						solvingSelect.set(true);
						effect.setSolvedTarget(SELECTOR.exchange(null));
					} catch (InterruptedException e) {
						System.err.println("Excepcion en SELECT");
						e.printStackTrace();
					}
				}

				effect.activate();
				solvingSelect.set(false);
			}
		}

		activateEffectOn(EffectOn.PLAYER_ANY, CardSite.FIELD, turnPlayer);
		activateEffectOn(EffectOn.ENEMY_ANY, CardSite.FIELD, waitPlayer);
		switch (playedCard.CARD_TYPE) {
		case MANA:
			activateEffectOn(EffectOn.PLAYER_MANA, CardSite.FIELD, turnPlayer);
			activateEffectOn(EffectOn.ENEMY_MANA, CardSite.FIELD, waitPlayer);
			break;
		case SPELL:
			activateEffectOn(EffectOn.PLAYER_SPELL, CardSite.FIELD, turnPlayer);
			activateEffectOn(EffectOn.ENEMY_SPELL, CardSite.FIELD, waitPlayer);
			break;
		case SUMMONING:
			activateEffectOn(EffectOn.PLAYER_SUMMONING, CardSite.FIELD, turnPlayer);
			activateEffectOn(EffectOn.ENEMY_SUMMONING, CardSite.FIELD, waitPlayer);
			break;
		}

		solvingCard.set(false);
		buildAndSendUpdateMsg();
		return true;
	}

	public void notifySelect(Player player) {
		ObjectNode msg = mapper.createObjectNode();
		msg.put("event", "SELECT NOTIFY");
		try {
			player.SESSION.sendMessage(new TextMessage(msg.toString()));
		} catch (IOException e) {
			System.err.println("Excepcion en SELECT NOTIFY");
			e.printStackTrace();
		}
	}
	
	public boolean select(Player player, String cardID) {
		if (player != turnPlayer || !solvingSelect.get()) {
			return false;
		}
		
		CardCollection card = CardCollection.get(Integer.parseInt(cardID));
		Card selectedCard = currentEffect.validateSelect(card);
		if (selectedCard == null)
			return false;

		try {
			SELECTOR.exchange(selectedCard);
		} catch (InterruptedException e) {
			System.err.println("Excepcion en SELECT");
			e.printStackTrace();
		}
		
		return true;
	}

	public void activateEffectOn(EffectOn effectOn, CardSite site, Player player) {
		for (Card card : site.solve(player).GROUP) {
			for (BaseEffect effect : card.effects) {
				currentEffect = effect;
				if (effect.checkConditions() && effect.EFFECT_ON == effectOn) {
					if (effect.TARGET == Target.SELECT) {
						try {
							notifySelect(player);
							solvingSelect.set(true);
							effect.setSolvedTarget(SELECTOR.exchange(null));
						} catch (InterruptedException e) {
							System.err.println("Excepcion en SELECT");
							e.printStackTrace();
						}
					}

					effect.activate();
					solvingSelect.set(false);
				}
			}
		}
		
		buildAndSendUpdateMsg();
	}

	public void solveCardTargets(Player self, Player enemy) {
		for (Card card : self._deck.GROUP) {
			card.owner = self;
			// Play Conditions
			for (BaseCondition bCond : card.PLAY_CONDITIONS) {
				switch (bCond.TARGET) {
				case PLAYER:
					bCond.setSolvedTarget(self);
					break;
				case ENEMY:
					bCond.setSolvedTarget(enemy);
					break;
				}
			}
			// Effects Target
			for (BaseEffect effect : card.effects) {
				switch (effect.TARGET) {
				case PLAYER:
					effect.setSolvedTarget(self);
					break;
				case ENEMY:
					effect.setSolvedTarget(enemy);
					break;
				case SELF:
					effect.setSolvedTarget(card);
					break;
				}
				// Select Conditions Target
				for (BaseCondition cond : effect.SELECT_CONDITIONS) {
					switch (cond.TARGET) {
					case PLAYER:
						cond.setSolvedTarget(self);
						break;
					case ENEMY:
						cond.setSolvedTarget(enemy);
						break;
					case SELF:
						cond.setSolvedTarget(card);
						break;
					}
				}
				// Conditions Target
				for (BaseCondition cond : effect.CONDITIONS) {
					switch (cond.TARGET) {
					case PLAYER:
						cond.setSolvedTarget(self);
						break;
					case ENEMY:
						cond.setSolvedTarget(enemy);
						break;
					case SELF:
						cond.setSolvedTarget(card);
						break;
					}
				}
				// Modifiers Target
				for (BaseModifier mod : effect.MODIFIERS) {
					switch (mod.TARGET) {
					case PLAYER:
						mod.setSolvedTarget(self);
						break;
					case ENEMY:
						mod.setSolvedTarget(enemy);
						break;
					case SELF:
						mod.setSolvedTarget(card);
						break;
					}
				}
			}
		}
	}
}
