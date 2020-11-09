package crystalwars_backend;

import java.security.SecureRandom;
import java.util.logging.Level;
import java.util.logging.Logger;

public class Player {

    //Data
    public final String NAME;
    public final int MAX_HEALTH, MAX_MANA;
    public final PlayerMemory TURN_STATE;
    public final PlayerMemory GAME_STATE;
    public Player ENEMY;

    //State
    public int health, mana;
    public CardGroup _deck;
    public CardGroup _hand;
    public CardGroup _graveyard;
    public CardGroup _field;

    public Player(int maxHealth, int maxMana, String name) {
        NAME = name;
        MAX_HEALTH = maxHealth;
        MAX_MANA = maxMana;
        TURN_STATE = new PlayerMemory();
        GAME_STATE = new PlayerMemory();

        health = MAX_HEALTH;
        mana = 0;

        _deck = new CardGroup(this);
        _hand = new CardGroup(this);
        _graveyard = new CardGroup(this);
        _field = new CardGroup(this);
    }

    public void heal(int amount) {
        if (health + amount > MAX_HEALTH) {
            amount = MAX_HEALTH - health;
        }

        health += amount;
        TURN_STATE.damageHealed += amount;

        trace("Salud + " + amount + "(" + health + ")");
    }

    public void damage(int amount, Player source) {
        health -= amount;
        TURN_STATE.damageTaken += amount;
        if (source == this) {
            TURN_STATE.selfDamageTaken += amount;
        }

        trace("Salud - " + amount + "(" + health + ")");
    }

    public void addMana(int amount) {
        mana += amount;
        if (mana > MAX_MANA) {
            mana = MAX_MANA;
        }

        trace("Mana + " + amount + "(" + mana + ")");
    }

    public void removeMana(int amount) {
        mana -= amount;
        if (mana < 0) {
            mana = 0;
        }

        TURN_STATE.manaSpent += amount;
        trace("Mana - " + amount + "(" + mana + ")");
    }

    public void draw(int nCards) {
        _hand.addCards(_deck.getCards(nCards));

        trace("Roba " + nCards + " cartas");
    }

    public void draw(CardCollection ID) {
        _hand.addCard(_deck.getCard(ID));

        trace("Roba " + ID);
    }

    public void draw(CardType type) {
        _hand.addCard(_deck.getRandomTypeCard(type));
        trace("Roba 1 carta de " + type);
    }

    public void play(CardCollection ID, CardSite SITE) {
        CardGroup site = SITE.solve(this);

        if (site.contains(ID)) {
            site.checkCard(ID).activateEffectsOn(EffectOn.PRE_PLAY);

            if (site.checkCard(ID).cost <= mana) {
                Card playedCard = site.getCard(ID);
                mana -= playedCard.cost;
                TURN_STATE.manaSpent += playedCard.cost;
                trace("ha jugado " + ID + ". Mana - " + playedCard.cost + "(" + mana + ")");
                playedCard.activateEffectsOn(EffectOn.PLAY);

                if (playedCard.CARD_TYPE == CardType.SUMMONING && TURN_STATE.canSummon) {
                    _field.addCard(playedCard);
                }
            }
        }
    }

    public void destroy(Card card) {
        _field.GROUP.remove(card);
        _graveyard.addCard(card);
    }

    public void discard(Card card) {
        _hand.GROUP.remove(card);
        _graveyard.addCard(card);
    }

    public void trace(String trace) {
        System.out.println(NAME + ": " + trace);
    }

    public void playTurn(){
        try {
            Thread.sleep(new SecureRandom().nextInt(1000) + 500);
        } catch (InterruptedException ex) {
            Logger.getLogger(Player.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}
