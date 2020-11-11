package crystalwars_backend;

import java.util.ArrayList;
import java.util.Collections;

public class CardGroup {

	public final int MAX_CARDS;
	public final ArrayList<Card> GROUP;

	public CardGroup(int maxCards) {
		MAX_CARDS = maxCards;
		GROUP = new ArrayList<>();
	}

	public void addCard(Card card) {
		if (card == null || GROUP.size() == MAX_CARDS) {
			return;
		}
		GROUP.add(card);
	}

	public void addCards(ArrayList<Card> cards) {
		if (cards.isEmpty()) {
			return;
		}
		GROUP.addAll(cards);
	}

	public void removeCard(Card card) {
		GROUP.remove(card);
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

	public ArrayList<Card> getAllCards() {
		ArrayList<Card> drawnCards = new ArrayList<>();

		for (int i = 0; i < GROUP.size(); i++) {
			drawnCards.add(GROUP.remove(GROUP.size() - 1));
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

	public Card getRandomTypeCard(CardType TYPE) {
		for (Card card : GROUP) {
			if (card.CARD_TYPE == TYPE) {
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

	public boolean contains(CardCollection ID) {
		return GROUP.stream().anyMatch((card) -> (card.ID == ID));
	}

	public void shuffle() {
		Collections.shuffle(GROUP);
	}
}
