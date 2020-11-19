package crystalwars_backend;

import java.io.IOException;
import java.security.SecureRandom;
import java.util.ArrayList;
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
	public final boolean fastMode;
	private final int MAX_PLAYERS = 2;
	private final AtomicInteger NUM_PLAYERS = new AtomicInteger();
	private final AtomicInteger READY_PLAYERS = new AtomicInteger();
	private final Map<Integer, Player> PLAYERS = new ConcurrentHashMap<>();
	private Player turnPlayer, waitPlayer;
	private final CrystalRegister REGISTER;

	// Card solving variables
	private AtomicBoolean isGameOver = new AtomicBoolean();
	private AtomicBoolean solvingCard = new AtomicBoolean();
	private AtomicBoolean solvingSelect = new AtomicBoolean();
	private final ExecutorService POOL = Executors.newCachedThreadPool();
	private final Exchanger<Card> SELECTOR = new Exchanger<Card>();
	private BaseEffect selectingEffect;

	public CrystalRoom(boolean fastMode) {
		this.fastMode = fastMode;
		System.out.println(fastMode);

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
		System.out.println(deck);

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

		chooseStartingPlayer();

		turnPlayer.deal();
		waitPlayer.deal();
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

		this.broadcast(updateMsg.toString());
	}

	public void buildAndSendErrorMsg(Player target, String cause) {
		ObjectNode errorMsg = mapper.createObjectNode();
		errorMsg.put("event", "ERROR");
		errorMsg.put("cause", cause);

		try {
			target.SESSION.sendMessage(new TextMessage(errorMsg.toString()));
		} catch (IOException e) {
			System.err.println("Exception sending message to player " + target.SESSION.getId());
			e.printStackTrace();
		}
	}

	public void broadcast(String message) {
		for (Player player : getPlayers()) {
			try {
				player.SESSION.sendMessage(new TextMessage(message.toString()));
			} catch (Throwable ex) {
				System.err.println("Exception sending message to player " + player.SESSION.getId());
				PLAYERS.remove(player);
			}
		}
	}

	public void switchTurn(Player player) {
		POOL.execute(() -> {
			if (player != turnPlayer || solvingSelect.get())
				return;

			activateEffectsOn(EffectOn.TURN_END, CardSite.FIELD, turnPlayer);
			activateEffectsOn(EffectOn.TURN_END_GRAVEYARD, CardSite.GRAVEYARD, turnPlayer);

			turnPlayer.GAME_STATE.add(turnPlayer.TURN_STATE);
			turnPlayer.TURN_STATE.reset();

			turnPlayer.REGISTER.register(turnPlayer.ID, "END TURN", String.valueOf(turnPlayer.ID));

			Player auxPlayer = turnPlayer;
			turnPlayer = waitPlayer;
			waitPlayer = auxPlayer;

			if (turnPlayer._deck.GROUP.isEmpty()) {
				turnPlayer._deck.addCards(turnPlayer._graveyard.getAllCards());
				turnPlayer._deck.shuffle();
				REGISTER.register(turnPlayer.ID, "DECK RESET", String.valueOf(turnPlayer.ID));
			}

			if (fastMode) {
				turnPlayer.draw(2);
			} else {
				turnPlayer.draw(1);
			}

			activateEffectsOn(EffectOn.TURN_START, CardSite.FIELD, turnPlayer);
		});
	}

	public void play(Player player, String cardID) {
		POOL.execute(() -> {
			if (player != turnPlayer || solvingCard.getAndSet(true)) {
				buildAndSendErrorMsg(player, "NOT TURN");
				return;
			}

			CardCollection ID = CardCollection.get(Integer.parseInt(cardID));
			if (!player._hand.contains(ID)) {
				solvingCard.set(false);
				buildAndSendErrorMsg(player, "NOT IN HAND");
				return;
			}

			for (BaseEffect prePlay : player._hand.checkCard(ID).effects) {
				if (prePlay.EFFECT_ON == EffectOn.PRE_PLAY) {
					if (prePlay.checkConditions() && prePlay.EFFECT_ON == EffectOn.PRE_PLAY)
						prePlay.activate();
				}
			}

			for (BaseCondition playCond : player._hand.checkCard(ID).PLAY_CONDITIONS) {
				if (!playCond.check()) {
					solvingCard.set(false);
					buildAndSendErrorMsg(player, "CANT PLAY");
					return;
				}
			}

			if (player._hand.checkCard(ID).CARD_TYPE == CardType.SUMMONING && !player.TURN_STATE.canSummon) {
				solvingCard.set(false);
				buildAndSendErrorMsg(player, "CANT PLAY");
				return;
			}

			Card playedCard = player._hand.getCard(ID);

			if (playedCard.CARD_TYPE == CardType.SUMMONING) {
				player._field.addCard(playedCard);
				player.REGISTER.register(player.ID, "SUMMON", String.valueOf(playedCard.ID.ID));
			} else {
				player._graveyard.addCard(playedCard);
				player.REGISTER.register(player.ID, "PLAY", cardID);
			}

			player.removeMana(playedCard.cost);

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

		});
	}

	public void notifySelect(Player player, String id, String cause) {
		ObjectNode msg = mapper.createObjectNode();
		msg.put("event", "SELECT NOTIFY");
		msg.put("id", id);
		msg.put("cause", cause);
		try {
			player.SESSION.sendMessage(new TextMessage(msg.toString()));
		} catch (IOException e) {
			System.err.println("Excepcion en SELECT NOTIFY");
			e.printStackTrace();
		}
	}

	public void select(Player player, String cardID) {
		POOL.execute(() -> {
			if (player != turnPlayer || !solvingSelect.get()) {
				return;
			}

			CardCollection card = CardCollection.get(Integer.parseInt(cardID));
			Card selectedCard = selectingEffect.validateSelect(card);
			if (selectedCard == null) {
				buildAndSendErrorMsg(player, "SELECT NOT VALID");
				return;
			}

			player.REGISTER.register(player.ID, "SELECT", cardID);
			try {
				SELECTOR.exchange(selectedCard);
			} catch (InterruptedException e) {
				System.err.println("Excepcion en SELECT");
				e.printStackTrace();
			}
		});
	}

	public void activateEffectsOn(EffectOn effectOn, CardSite site, Player player) {
		ArrayList<Card> group = new ArrayList<>(site.solve(player).GROUP);
		for (Card card : group) {
			activateEffectsOn(effectOn, card);
		}
	}

	public void activateEffectsOn(EffectOn effectOn, Card card) {
		for (BaseEffect effect : card.effects) {
			if (effect.EFFECT_ON == effectOn) {
				if (effect.checkConditions()) {
					if (effect.TARGET == Target.SELECT) {
						selectingEffect = effect;
						notifySelect(card.owner, String.valueOf(card.ID.ID), selectingEffect.selectNotification);
						solvingSelect.set(true);
						try {
							effect.setSolvedTarget(SELECTOR.exchange(null));
						} catch (InterruptedException e) {
							System.err.println("Excepcion en SELECT");
							e.printStackTrace();
						}

						effect.activate();
						solvingSelect.set(false);
					} else {
						effect.activate();
					}
				}
			}
		}
	}

	public void forceRemoveFrom(Player player, CardSite site) {
		if (player != turnPlayer)
			return;

		BaseEffect remove = null;
		switch (site) {
		case FIELD:
			remove = new Tribute(EffectOn.PLAY, Target.SELECT);
			remove.SELECT_CONDITIONS.get(0).setSolvedTarget(player);
			notifySelect(player, "0", "FIELD FULL");
			break;
		case HAND:
			remove = new Discard(EffectOn.PLAY, Target.SELECT);
			remove.SELECT_CONDITIONS.get(0).setSolvedTarget(player);
			notifySelect(player, "0", "HAND FULL");
			break;
		}

		selectingEffect = remove;
		solvingSelect.set(true);
		try {
			remove.setSolvedTarget(SELECTOR.exchange(null));
		} catch (InterruptedException e) {
			System.err.println("Excepcion en SELECT");
			e.printStackTrace();
		}

		remove.activate();
		solvingSelect.set(false);
	}

	public void activateCrystalButton(Player player) {
		POOL.execute(() -> {
			if(player != turnPlayer) {
				buildAndSendErrorMsg(player, "CRYSTAL TURN");
				return;
			}
			
			if (!fastMode || player.hasUsedCrystalButton) {
				buildAndSendErrorMsg(player, "CRYSTAL BUTTON");
				return;
			}
			
			REGISTER.register(player.ID, "CRYSTAL BUTTON", "");

			player.hasUsedCrystalButton = true;
			player.addMana(5);
			player.draw(3);
		});
	}

	public void declareWinner(Player disconnectedPlayer) {
		if(isGameOver.getAndSet(true)) {
			return;
		}
		
		Player winner = disconnectedPlayer.ENEMY;
		REGISTER.register(winner.ID, "WINNER", String.valueOf(winner.ID));
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
