package crystalwars_backend;

import java.util.ArrayList;
import java.util.Collections;

public class CardGroup {

    private final Player OWNER;
    public final ArrayList<Card> GROUP;

    public CardGroup(Player owner) {
        OWNER = owner;
        GROUP = new ArrayList<>();
    }

    public void addCard(Card card) {
        if (card == null) {
            return;
        }
        GROUP.add(card);
    }

    public void removeCard(Card card) {
        GROUP.remove(card);
    }

    public void addCards(ArrayList<Card> cards) {
        if (cards.isEmpty()) {
            return;
        }
        GROUP.addAll(cards);
    }

    public ArrayList<Card> getCards(int nCards) {
        ArrayList<Card> drawnCards = new ArrayList<>();

        for (int i = 0; i < nCards; i++) {
            if (!GROUP.isEmpty()) {
                drawnCards.add(GROUP.remove(GROUP.size() - 1));
            }
        }

        return drawnCards;
    }

    public Card getCard(CardCollection ID) {
        for (Card card : GROUP) {
            if (card.ID == ID) {
                GROUP.remove(card);
                return card;
            }
        }

        return null;
    }

    public Card checkCard(CardCollection ID) {
        for (Card card : GROUP) {
            if (card.ID == ID) {
                return card;
            }
        }

        return null;
    }

    public Card getRandomTypeCard(CardType TYPE) {
        for (Card card : GROUP) {
            if (card.CARD_TYPE == TYPE) {
                GROUP.remove(card);
                return card;
            }
        }

        return null;
    }

    public boolean contains(CardCollection ID) {
        return GROUP.stream().anyMatch((card) -> (card.ID == ID));
    }

    public void shuffle() {
        Collections.shuffle(GROUP);
    }

}
