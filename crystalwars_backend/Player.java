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
	public boolean hasUsedCrystalButton;

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

		_deck = new CardGroup(this, CardSite.DECK, 17);
		_hand = new CardGroup(this, CardSite.HAND, 6);
		_graveyard = new CardGroup(this, CardSite.GRAVEYARD, 17);
		_field = new CardGroup(this, CardSite.FIELD, 2);
	}

	public void heal(int amount) {
		if (health + amount > MAX_HEALTH) {
			amount = MAX_HEALTH - health;
		}
		health += amount;

		TURN_STATE.healed += amount;
		REGISTER.register(ID, "HEALTH", String.valueOf(health));
	}

	public void damage(int amount, Player source) {
		health -= amount;

		if (source == this) {
			TURN_STATE.selfDamageTaken += amount;
		}

		TURN_STATE.damageTaken += amount;
		REGISTER.register(ID, "HEALTH", String.valueOf(health));

		if (health <= 0) {
			ROOM.declareWinner(this);
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
		ArrayList<Card> drawnCards = _deck.getCards(nCards);
		_hand.addCards(drawnCards);

		if(drawnCards.isEmpty()) {
			return;
		}
		
		TURN_STATE.lastDrawnCard = drawnCards.get(drawnCards.size() - 1);

		for (Card card : drawnCards) {
			REGISTER.register(ID, "DRAW", String.valueOf(card.ID.ID));
		}		

		if(_deck.GROUP.isEmpty())
			REGISTER.register(this.ID, "DECK EMPTY", String.valueOf(this.ID));
		
		_hand.limitTest(Compare.GREATER);
	}

	public void draw(CardCollection ID) {
		Card drawnCard = _deck.getCard(ID);
		_hand.addCard(drawnCard);

		if(drawnCard == null) {
			return;
		}
		
		TURN_STATE.lastDrawnCard = drawnCard;
		REGISTER.register(this.ID, "DRAW", String.valueOf(drawnCard.ID.ID));
		
		if(_deck.GROUP.isEmpty())
			REGISTER.register(this.ID, "DECK EMPTY", String.valueOf(this.ID));
		
		_hand.limitTest(Compare.GREATER);
	}

	public void draw(CardType type) {
		Card drawnCard = _deck.getRandomTypeCard(type);
		_hand.addCard(drawnCard);

		if(drawnCard == null) {
			return;
		}
		
		TURN_STATE.lastDrawnCard = drawnCard;
		REGISTER.register(ID, "DRAW", String.valueOf(drawnCard.ID.ID));
		
		if(_deck.GROUP.isEmpty())
			REGISTER.register(this.ID, "DECK EMPTY", String.valueOf(this.ID));
		
		_hand.limitTest(Compare.GREATER);
	}

	public void destroy(Card card) {
		_field.GROUP.remove(card);
		_graveyard.addCard(card);

		TURN_STATE.lastDestroyedCard = card;
		
		REGISTER.register(ID, "DESTROY", String.valueOf(card.ID.ID));
		ROOM.activateEffectsOn(EffectOn.DESTROY, card);
	}

	public void discard(Card card) {
		_hand.GROUP.remove(card);
		_graveyard.addCard(card);

		TURN_STATE.discardedCards++;
		
		REGISTER.register(ID, "DISCARD", String.valueOf(card.ID.ID));
		ROOM.activateEffectsOn(EffectOn.DISCARD, card);
	}
	
	public void deal() {
		draw(CardType.MANA);
		draw(CardType.MANA);
		draw(CardType.SPELL);
		draw(CardType.SUMMONING);
	}
}
