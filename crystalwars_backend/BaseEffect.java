package crystalwars_backend;

import java.io.Serializable;
import java.util.ArrayList;

public abstract class BaseEffect implements Serializable {

	public Card SOURCE;
	public final EffectOn EFFECT_ON;
	public final Target TARGET;
	public final ArrayList<CardPresentOn> SELECT_CONDITIONS;
	public final ArrayList<BaseCondition> CONDITIONS;
	public final ArrayList<BaseModifier> MODIFIERS;
	public boolean hasActivated;

	public BaseEffect(EffectOn effectOn, Target target) {
		EFFECT_ON = effectOn;
		TARGET = target;
		SELECT_CONDITIONS = new ArrayList<>();
		CONDITIONS = new ArrayList<>();
		MODIFIERS = new ArrayList<>();
	}

	public abstract void setSolvedTarget(Object target);

	public void activate() {
		if (EFFECT_ON != EffectOn.PRE_PLAY && EFFECT_ON != EffectOn.PLAY)
			SOURCE.owner.REGISTER.register(SOURCE.owner.ID, "EFFECT", String.valueOf(SOURCE.ID.ID));
	}

	public boolean checkConditions() {
		hasActivated = false;
		if (!CONDITIONS.stream().noneMatch((cond) -> (!cond.check()))) {
			return hasActivated;
		}
		return hasActivated = true;
	}

	public int getModifier() {
		int modifier = 0;
		modifier = MODIFIERS.stream().map((mod) -> mod.getModifier()).reduce(modifier, Integer::sum);
		return modifier;
	}

	public Card validateSelect(CardCollection ID) {
		for (CardPresentOn cond : SELECT_CONDITIONS) {
			cond.ID = ID;
			if (cond.check())
				return cond.get();
		}
		return null;
	}
}

abstract class PlayerTargetEffect extends BaseEffect {

	public Player solvedTarget;

	public PlayerTargetEffect(EffectOn effectOn, Target target) {
		super(effectOn, target);
	}

	@Override
	public void setSolvedTarget(Object target) {
		solvedTarget = (Player) target;
	}
}

abstract class CardTargetEffect extends BaseEffect {

	public Card solvedTarget;

	public CardTargetEffect(EffectOn effectOn, Target target) {
		super(effectOn, target);
	}

	@Override
	public void setSolvedTarget(Object target) {
		solvedTarget = (Card) target;
	}
}
