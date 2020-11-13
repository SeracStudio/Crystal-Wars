package crystalwars_backend;

import java.util.ArrayList;

import org.springframework.web.socket.WebSocketSession;

public class Player {

	// Session Data
	public final WebSocketSession SESSION;
	public final int ID;
	public String ROOM_ID;
	public CrystalRoom ROOM;
	public CrystalRegister REGISTER;

	// Game Data
	public final int MAX_HEALTH, MAX_MANA;
	public final PlayerState TURN_STATE;
	public final PlayerState GAME_STATE;
	public Player ENEMY;

	// Game State
	public int health, mana;
	public CardGroup _deck;
	public CardGroup _hand;
	public CardGroup _graveyard;
	public CardGroup _field;

	public Player(int ID, WebSocketSession SESSION, int maxHealth, int maxMana) {
		this.ID = ID;
		this.SESSION = SESSION;
		MAX_HEALTH = maxHealth;
		MAX_MANA = maxMana;
		TURN_STATE = new PlayerState();
		GAME_STATE = new PlayerState();

		health = MAX_HEALTH;
		mana = 0;

		_deck = new CardGroup(17);
		_hand = new CardGroup(6);
		_graveyard = new CardGroup(17);
		_field = new CardGroup(2);
	}

	public void heal(int amount) {
		if (health + amount > MAX_HEALTH) {
			amount = MAX_HEALTH - health;
		}
		health += amount;

		TURN_STATE.healed += amount;
		REGISTER.register(ID, "HEALTH", "+" + amount);
	}

	public void damage(int amount, Player source) {
		health -= amount;

		if (source == this) {
			TURN_STATE.selfDamageTaken += amount;
		}

		TURN_STATE.damageTaken += amount;
		REGISTER.register(ID, "HEALTH", "-" + amount);

		if (health <= 0) {
			REGISTER.register(ENEMY.ID, "WINNER", String.valueOf(ENEMY.ID));
		}
	}

	public void addMana(int amount) {
		if (mana + amount > MAX_MANA) {
			amount = MAX_MANA - mana;
		}
		mana += amount;

		REGISTER.register(ID, "MANA", "+" + amount);
	}

	public void removeMana(int amount) {
		if (mana - amount < 0) {
			amount = mana;
		}
		mana -= amount;

		TURN_STATE.manaSpent += amount;

		if (amount != 0) {
			REGISTER.register(ID, "MANA", "-" + amount);
		}
	}

	public void draw(int nCards) {
		if (_deck.GROUP.isEmpty()) {
			_deck.addCards(_graveyard.getAllCards());
			REGISTER.register(ID, "DECK RESET", String.valueOf(ID));
		}

		ArrayList<Card> drawnCards = _deck.getCards(nCards);
		_hand.addCards(drawnCards);

		TURN_STATE.lastDrawnCard = drawnCards.get(drawnCards.size() - 1);

		String register = "";
		for (Card card : drawnCards) {
			register += card.ID.ID + " ";
		}
		REGISTER.register(ID, "DRAW", register);
	}

	public void draw(CardCollection ID) {
		Card drawnCard = _deck.getCard(ID);
		_hand.addCard(drawnCard);

		TURN_STATE.lastDrawnCard = drawnCard;
		REGISTER.register(this.ID, "DRAW", String.valueOf(drawnCard.ID.ID));
	}

	public void draw(CardType type) {
		Card drawnCard = _deck.getRandomTypeCard(type);
		_hand.addCard(drawnCard);

		TURN_STATE.lastDrawnCard = drawnCard;
		REGISTER.register(ID, "DRAW", String.valueOf(drawnCard.ID.ID));
	}

	public void destroy(Card card) {
		_field.GROUP.remove(card);
		_graveyard.addCard(card);

		REGISTER.register(ID, "DESTROY", String.valueOf(card.ID.ID));
		ROOM.activateEffectsOn(EffectOn.DESTROY, card);
	}

	public void discard(Card card) {
		_hand.GROUP.remove(card);
		_graveyard.addCard(card);

		REGISTER.register(ID, "DISCARD", String.valueOf(card.ID.ID));
		ROOM.activateEffectsOn(EffectOn.DISCARD, card);
	}

}
