package crystalwars_backend;

import java.util.ArrayList;

public abstract class BaseEffect {

    public Card SOURCE;
    public final EffectOn EFFECT_ON;
    public final Target TARGET;
    public final ArrayList<BaseCondition> SELECT_CONDITIONS;
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

    public boolean checkConditions() {
        hasActivated = false;
        if (!CONDITIONS.stream().noneMatch((cond) -> (!cond.check()))) {
            return false;
        }
        hasActivated = true;
        return true;
    }

    public abstract void setResolvedTarget(Object target);

    public abstract void activate();

    public int getModifier() {
        int modifier = 0;
        modifier = MODIFIERS.stream().map((mod) -> mod.getModifier()).reduce(modifier, Integer::sum);
        return modifier;
    }
}

abstract class PlayerTargetEffect extends BaseEffect {

    public Player solvedTarget;

    public PlayerTargetEffect(EffectOn effectOn, Target target) {
        super(effectOn, target);
    }

    @Override
    public void setResolvedTarget(Object target) {
        solvedTarget = (Player) target;
    }
}

abstract class CardTargetEffect extends BaseEffect {

    public Card solvedTarget;

    public CardTargetEffect(EffectOn effectOn, Target target) {
        super(effectOn, target);
    }

    @Override
    public void setResolvedTarget(Object target) {
        solvedTarget = (Card) target;
    }
}
