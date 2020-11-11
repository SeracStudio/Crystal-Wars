package crystalwars_backend;

import java.util.ArrayList;

import org.springframework.web.socket.WebSocketSession;

public class Player {

	// Session Data
	public final WebSocketSession SESSION;
	public final int ID;
	public String ROOM_ID;

	// Game Data
	public final int MAX_HEALTH, MAX_MANA;
	public final PlayerState TURN_STATE;
	public final PlayerState GAME_STATE;
	public final PlayerRegister REGISTER;
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
		REGISTER = new PlayerRegister(this);

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
		REGISTER.register("HEALTH", "+" + amount);
	}

	public void damage(int amount, Player source) {
		health -= amount;

		TURN_STATE.damageTaken += amount;
		if (source == this) {
			TURN_STATE.selfDamageTaken += amount;
		}
		REGISTER.register("HEALTH", "-" + amount);
	}

	public void addMana(int amount) {
		mana += amount;
		if (mana > MAX_MANA) {
			mana = MAX_MANA;
		}

		REGISTER.register("MANA", "+" + amount);
	}

	public void removeMana(int amount) {
		mana -= amount;
		if (mana < 0) {
			mana = 0;
		}

		TURN_STATE.manaSpent += amount;
		REGISTER.register("MANA", "-"+amount);
	}

	public void draw(int nCards) {
		if(_deck.GROUP.isEmpty()) {
			_deck.addCards(_graveyard.getAllCards());
			REGISTER.register("DECK RESET", "");
		}
		
		ArrayList<Card> drawnCards = _deck.getCards(nCards);
		_hand.addCards(drawnCards);

		TURN_STATE.lastDrawnCard = drawnCards.get(drawnCards.size() - 1);
		
		String register = "";
		for(Card card : drawnCards) {
			register += card.ID.ID + " ";
		}
		REGISTER.register("DRAW", register);
	}

	public void draw(CardCollection ID) {
		Card drawnCard = _deck.getCard(ID);
		_hand.addCard(drawnCard);

		TURN_STATE.lastDrawnCard = drawnCard;
		REGISTER.register("DRAW", String.valueOf(drawnCard.ID.ID));
	}

	public void draw(CardType type) {
		Card drawnCard = _deck.getRandomTypeCard(type);
		_hand.addCard(drawnCard);

		TURN_STATE.lastDrawnCard = drawnCard;
		REGISTER.register("DRAW", String.valueOf(drawnCard.ID.ID));
	}

	public void destroy(Card card) {
		_field.GROUP.remove(card);
		_graveyard.addCard(card);
		
		REGISTER.register("DESTROY", String.valueOf(card.ID.ID));
	}

	public void discard(Card card) {
		_hand.GROUP.remove(card);
		_graveyard.addCard(card);
		
		REGISTER.register("DISCARD", String.valueOf(card.ID.ID));
	}
	
}
