package crystalwars_backend;

import java.io.IOException;
import java.security.SecureRandom;
import java.util.Collection;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Exchanger;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
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
	private final AtomicInteger NUM_PLAYERS = new AtomicInteger();
	private final AtomicInteger READY_PLAYERS = new AtomicInteger();
	private final Map<Integer, Player> PLAYERS = new ConcurrentHashMap<>();
	private Player turnPlayer, waitPlayer;
	private final CrystalRegister REGISTER;

	// Card solving variables
	private AtomicBoolean solvingCard = new AtomicBoolean();
	private AtomicBoolean solvingSelect = new AtomicBoolean();
	private final ExecutorService POOL = Executors.newCachedThreadPool();
	private final Exchanger<Card> SELECTOR = new Exchanger<Card>();
	private BaseEffect selectingEffect;

	public CrystalRoom() {
		REGISTER = new CrystalRegister(this);

		do {
			ROOM_ID = generateRoomID();
		} while (CrystalServer.SERVER.ROOMS.containsKey(ROOM_ID));

		System.out.println("Room created: " + ROOM_ID);
	}

	private String generateRoomID() {
		String roomID = "";
		for (int i = 0; i < 6; i++) {
			roomID += (char) (new SecureRandom().nextInt('z' - 'a') + 'a');
		}

		roomID = "AAAAAA";
		return roomID.toUpperCase();
	}

	public boolean addPlayer(Player player, String deck) {
		if (NUM_PLAYERS.getAndIncrement() >= MAX_PLAYERS) {
			return false;
		}

		PLAYERS.put(player.ID, player);
		player.ROOM_ID = ROOM_ID;
		player.ROOM = this;
		player.REGISTER = REGISTER;
		PLAYERS.get(player.ID)._deck.addCards(CardPool.DATA.pullDeck(deck));

		System.out.println(player.ID + " has joined room " + ROOM_ID);

		return true;
	}

	public void playerReady(Player player) {
		if (!PLAYERS.containsValue(player))
			return;

		if (READY_PLAYERS.getAndIncrement() >= MAX_PLAYERS - 1)
			startGame();
	}

	public Collection<Player> getPlayers() {
		return PLAYERS.values();
	}

	public void startGame() {
		System.out.println("Starting game at room: " + ROOM_ID);

		turnPlayer = (Player) getPlayers().toArray()[0];
		waitPlayer = (Player) getPlayers().toArray()[1];

		solveCardTargets(turnPlayer, waitPlayer);
		solveCardTargets(waitPlayer, turnPlayer);

		turnPlayer._deck.shuffle();
		waitPlayer._deck.shuffle();

		// chooseStartingPlayer();

		turnPlayer.draw(3);
		waitPlayer.draw(3);
	}

	public void chooseStartingPlayer() {
		int firstPlayer = new SecureRandom().nextInt(2);
		if (firstPlayer == 1) {
			Player auxPlayer = turnPlayer;
			turnPlayer = waitPlayer;
			waitPlayer = auxPlayer;
		}
		REGISTER.register(turnPlayer.ID, "FIRST", String.valueOf(turnPlayer.ID));
	}

	public void buildAndSendUpdateMsg() {
		ObjectNode updateMsg = mapper.createObjectNode();
		CrystalRegister.Register reg = REGISTER.getRegister();

		updateMsg.put("event", "UPDATE");
		updateMsg.put("id", reg.playerID);
		updateMsg.put("order", reg.order);
		updateMsg.put("update", reg.update);
		updateMsg.put("data", reg.data);

		if (!updateMsg.toString().isBlank())
			this.broadcast(updateMsg.toString());
	}

	public void broadcast(String message) {
		for (Player player : getPlayers()) {
			try {
				player.SESSION.sendMessage(new TextMessage(message.toString()));
			} catch (Throwable ex) {
				System.err.println("Exception sending message to player " + player.SESSION.getId());
				ex.printStackTrace(System.err);
			}
		}
	}

	public void switchTurn(Player player) {
		if (player != turnPlayer)
			return;

		activateEffectsOn(EffectOn.TURN_END, CardSite.FIELD, turnPlayer);
		activateEffectsOn(EffectOn.TURN_END_GRAVEYARD, CardSite.GRAVEYARD, turnPlayer);

		turnPlayer.GAME_STATE.add(turnPlayer.TURN_STATE);
		turnPlayer.TURN_STATE.reset();
		waitPlayer.GAME_STATE.add(waitPlayer.TURN_STATE);
		waitPlayer.TURN_STATE.reset();

		turnPlayer.REGISTER.register(turnPlayer.ID, "END TURN", String.valueOf(turnPlayer.ID));

		Player auxPlayer = turnPlayer;
		turnPlayer = waitPlayer;
		waitPlayer = auxPlayer;

		turnPlayer.draw(1);

		activateEffectsOn(EffectOn.TURN_START, CardSite.FIELD, turnPlayer);
	}

	public boolean play(Player player, String cardID) {
		if (player != turnPlayer || solvingCard.getAndSet(true)) {
			solvingCard.set(false);
			return false;
		}

		CardCollection ID = CardCollection.get(Integer.parseInt(cardID));
		if (!player._hand.contains(ID)) {
			solvingCard.set(false);
			return false;
		}

		for (BaseEffect prePlay : player._hand.checkCard(ID).effects) {
			if (prePlay.checkConditions() && prePlay.EFFECT_ON == EffectOn.PRE_PLAY)
				prePlay.activate();
		}

		for (BaseCondition playCond : player._hand.checkCard(ID).PLAY_CONDITIONS) {
			if (!playCond.check()) {
				solvingCard.set(false);
				return false;
			}
		}

		if (player._hand.checkCard(ID).CARD_TYPE == CardType.SUMMONING && !player.TURN_STATE.canSummon) {
			solvingCard.set(false);
			return false;
		}

		Card playedCard = player._hand.getCard(ID);
		player.REGISTER.register(player.ID, "PLAY", cardID);
		player.removeMana(playedCard.cost);

		if (playedCard.CARD_TYPE == CardType.SUMMONING) {
			player._field.addCard(playedCard);
			player.REGISTER.register(player.ID, "SUMMON", String.valueOf(playedCard.ID.ID));
		}

		activateEffectsOn(EffectOn.PLAY, playedCard);

		activateEffectsOn(EffectOn.PLAYER_ANY, CardSite.FIELD, turnPlayer);
		activateEffectsOn(EffectOn.ENEMY_ANY, CardSite.FIELD, waitPlayer);
		switch (playedCard.CARD_TYPE) {
		case MANA:
			activateEffectsOn(EffectOn.PLAYER_MANA, CardSite.FIELD, turnPlayer);
			activateEffectsOn(EffectOn.ENEMY_MANA, CardSite.FIELD, waitPlayer);
			break;
		case SPELL:
			activateEffectsOn(EffectOn.PLAYER_SPELL, CardSite.FIELD, turnPlayer);
			activateEffectsOn(EffectOn.ENEMY_SPELL, CardSite.FIELD, waitPlayer);
			break;
		case SUMMONING:
			activateEffectsOn(EffectOn.PLAYER_SUMMONING, CardSite.FIELD, turnPlayer);
			activateEffectsOn(EffectOn.ENEMY_SUMMONING, CardSite.FIELD, waitPlayer);
			break;
		}

		solvingCard.set(false);
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
		Card selectedCard = selectingEffect.validateSelect(card);
		if (selectedCard == null)
			return false;
		
		player.REGISTER.register(player.ID, "SELECT", cardID);
		try {
			SELECTOR.exchange(selectedCard);
		} catch (InterruptedException e) {
			System.err.println("Excepcion en SELECT");
			e.printStackTrace();
		}

		return true;
	}

	public void activateEffectsOn(EffectOn effectOn, CardSite site, Player player) {
		for (Card card : site.solve(player).GROUP) {
			for (BaseEffect effect : card.effects) {
				selectingEffect = effect;
				if (effect.checkConditions() && effect.EFFECT_ON == effectOn) {
					if (effect.TARGET == Target.SELECT) {
						POOL.execute(() -> {
							selectingEffect = effect;
							notifySelect(player);
							solvingSelect.set(true);
							try {						
								effect.setSolvedTarget(SELECTOR.exchange(null));
							} catch (InterruptedException e) {
								System.err.println("Excepcion en SELECT");
								e.printStackTrace();
							}
							
							effect.activate();
							solvingSelect.set(false);
						});
					}else {
						effect.activate();
					}
				}
			}
		}
	}

	public void activateEffectsOn(EffectOn effectOn, Card card) {
		for (BaseEffect effect : card.effects) {
			
			if (effect.checkConditions() && effect.EFFECT_ON == EffectOn.PLAY) {
				if (effect.TARGET == Target.SELECT) {
					POOL.execute(() -> {
						selectingEffect = effect;
						notifySelect(card.owner);
						solvingSelect.set(true);
						try {
							effect.setSolvedTarget(SELECTOR.exchange(null));
						} catch (InterruptedException e) {
							System.err.println("Excepcion en SELECT");
							e.printStackTrace();
						}
						
						effect.activate();
						solvingSelect.set(false);
					});
				}else {
					effect.activate();
				}
			}
		}
	}

	public void solveCardTargets(Player self, Player enemy) {
		self.ENEMY = enemy;
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
