package crystalwars_backend;

import java.util.Random;

class Damage extends PlayerTargetEffect {

	private final int BASE_AMOUNT;

	public Damage(EffectOn effectOn, Target target, int amount) {
		super(effectOn, target);
		this.BASE_AMOUNT = amount;
	}

	@Override
	public void activate() {
		super.activate();
		solvedTarget.damage(BASE_AMOUNT + getModifier(), SOURCE.owner);
	}
}

class Heal extends PlayerTargetEffect {

	private final int BASE_AMOUNT;

	public Heal(EffectOn effectOn, Target target, int amount) {
		super(effectOn, target);
		this.BASE_AMOUNT = amount;
	}

	@Override
	public void activate() {
		super.activate();
		solvedTarget.heal(BASE_AMOUNT + getModifier());
	}
}

class AddMana extends PlayerTargetEffect {

	private final int BASE_AMOUNT;

	public AddMana(EffectOn effectOn, Target target, int amount) {
		super(effectOn, target);
		this.BASE_AMOUNT = amount;
	}

	@Override
	public void activate() {
		super.activate();
		solvedTarget.addMana(BASE_AMOUNT + getModifier());
	}
}

class RemoveMana extends PlayerTargetEffect {

	private final int BASE_AMOUNT;

	public RemoveMana(EffectOn effectOn, Target target, int amount) {
		super(effectOn, target);
		this.BASE_AMOUNT = amount;
	}

	@Override
	public void activate() {
		super.activate();
		solvedTarget.removeMana(BASE_AMOUNT + getModifier());
	}
}

class Draw extends PlayerTargetEffect {

	private final int BASE_AMOUNT;

	public Draw(EffectOn effectOn, Target target, int amount) {
		super(effectOn, target);
		this.BASE_AMOUNT = amount;
	}

	@Override
	public void activate() {
		super.activate();
		solvedTarget.draw(BASE_AMOUNT + getModifier());
	}
}

class DrawSpecific extends PlayerTargetEffect {

	private final CardCollection CARD;

	public DrawSpecific(EffectOn effectOn, Target target, CardCollection card) {
		super(effectOn, target);
		this.CARD = card;
	}

	@Override
	public void activate() {
		super.activate();
		solvedTarget.draw(CARD);
	}
}

class DrawType extends PlayerTargetEffect {

	private final CardType TYPE;

	public DrawType(EffectOn effectOn, Target target, CardType type) {
		super(effectOn, target);
		this.TYPE = type;
	}

	@Override
	public void activate() {
		super.activate();
		solvedTarget.draw(TYPE);
	}
}

class Peek extends PlayerTargetEffect {

	public Peek(EffectOn effectOn, Target target) {
		super(effectOn, target);
	}

	@Override
	public void activate() {
		super.activate();
		int nHandCards = solvedTarget._hand.GROUP.size();
		if (nHandCards == 0) {
			return;
		}
		int randomCardNumber = new Random().nextInt(nHandCards);

		solvedTarget.ENEMY.TURN_STATE.lastPeekedCard = solvedTarget._hand.GROUP.get(randomCardNumber);
		SOURCE.owner.REGISTER.register(SOURCE.owner.ID, "PEEK",
				String.valueOf(solvedTarget.ENEMY.TURN_STATE.lastPeekedCard.ID.ID));
	}
}

class MoveCard extends PlayerTargetEffect {

	private final CardCollection CARD;
	private final CardSite FROM;
	private CardGroup solvedFrom;
	private final CardSite TO;
	private CardGroup solvedTo;

	public MoveCard(EffectOn effectOn, Target target, CardCollection card, CardSite from, CardSite to) {
		super(effectOn, target);
		CARD = card;
		FROM = from;
		TO = to;
	}

	@Override
	public void activate() {
		super.activate();
		solvedFrom = FROM.solve(solvedTarget);
		solvedTo = TO.solve(solvedTarget);
		Card movedCard = solvedFrom.getCard(CARD);

		if (movedCard == null)
			return;

		solvedTo.addCard(movedCard);
		SOURCE.owner.REGISTER.register(SOURCE.owner.ID, "MOVE " + FROM + " " + TO, String.valueOf(movedCard.ID.ID));
	}
}

class Summon extends PlayerTargetEffect {

	private final CardSite FROM;
	private final CardCollection ID;

	public Summon(EffectOn effectOn, Target target, CardCollection id, CardSite from) {
		super(effectOn, target);
		ID = id;
		FROM = from;
	}

	@Override
	public void activate() {
		super.activate();
		if (FROM.solve(solvedTarget).contains(ID)) {
			Card summonedCard = FROM.solve(solvedTarget).getCard(ID);
			solvedTarget._field.addCard(summonedCard);
			SOURCE.owner.REGISTER.register(SOURCE.owner.ID, "SUMMON", String.valueOf(summonedCard.ID.ID));
		}
	}
}

class BlockSummon extends PlayerTargetEffect {

	public BlockSummon(EffectOn effectOn, Target target) {
		super(effectOn, target);
	}

	@Override
	public void activate() {
		super.activate();
		solvedTarget.TURN_STATE.canSummon = false;
	}
}

class Destroy extends CardTargetEffect {

	public Destroy(EffectOn effectOn, Target target) {
		super(effectOn, target);
		SELECT_CONDITIONS.add(new CardPresentOn(Target.ENEMY, CardCollection.SELECT, CardSite.FIELD));
		selectNotification = "Destruye una invocación enemiga.";
	}

	@Override
	public void activate() {
		super.activate();
		Player targetPlayer = solvedTarget.owner;
		targetPlayer.destroy(solvedTarget);
	}
}

class Tribute extends CardTargetEffect {

	public Tribute(EffectOn effectOn, Target target) {
		super(effectOn, target);
		SELECT_CONDITIONS.add(new CardPresentOn(Target.PLAYER, CardCollection.SELECT, CardSite.FIELD));
		selectNotification = "Destruye una invocación aliada.";
	}

	@Override
	public void activate() {
		super.activate();
		Player targetPlayer = solvedTarget.owner;
		targetPlayer.destroy(solvedTarget);
	}
}

class Discard extends CardTargetEffect {

	public Discard(EffectOn effectOn, Target target) {
		super(effectOn, target);
		SELECT_CONDITIONS.add(new CardPresentOn(Target.PLAYER, CardCollection.SELECT, CardSite.HAND));
		selectNotification = "Descarta 1 carta.";
	}

	@Override
	public void activate() {
		super.activate();

		if (TARGET == Target.AUTO) {
			int nHandCards = SOURCE.owner.ENEMY._hand.GROUP.size();
			if (nHandCards == 0) {
				return;
			}
			int randomCardNumber = new Random().nextInt(nHandCards);
			SOURCE.owner.ENEMY.discard(SOURCE.owner.ENEMY._hand.GROUP.get(randomCardNumber));
		} else {
			Player targetPlayer = solvedTarget.owner;
			targetPlayer.discard(solvedTarget);
		}
	}
}

class CostChange extends CardTargetEffect {

	private final int BASE_AMOUNT;

	public CostChange(EffectOn effectOn, Target target, int amount) {
		super(effectOn, target);
		this.BASE_AMOUNT = amount;
	}

	@Override
	public void activate() {
		super.activate();
		solvedTarget.cost = BASE_AMOUNT + getModifier();
		if (solvedTarget.cost < 0) {
			solvedTarget.cost = 0;
		}
	}
}
