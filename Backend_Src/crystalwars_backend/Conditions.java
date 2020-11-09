package crystalwars_backend;

class CardPresentOn extends BaseCondition {

    public final CardCollection ID;
    private final CardSite SITE;
    private CardGroup solvedSite;

    public CardPresentOn(Target target, CardCollection id, CardSite site) {
        super(target);
        ID = id;
        SITE = site;
    }
    
    @Override
    public boolean check() {
        solvedSite = SITE.solve(solvedTarget);
        return solvedSite.GROUP.stream().anyMatch((c) -> (c.ID == ID));
    }
}

class StaticPlayerCompare extends BaseCondition {

    private final CurrentState STATE;
    private final Compare COMPARE;
    private final int AMOUNT;

    public StaticPlayerCompare(Target target, CurrentState state, Compare compare, int amount) {
        super(target);
        AMOUNT = amount;
        STATE = state;
        COMPARE = compare;
    }

    @Override
    public boolean check() {
        return COMPARE.compare(STATE.solve(solvedTarget), AMOUNT);
    }
}

class DynamicPlayerCompare extends BaseCondition {

    private final CurrentState STATE;
    private final Compare COMPARE;
    private final Target OTHER;
    private Player solvedOther;

    public DynamicPlayerCompare(Target target, CurrentState state, Compare compare, Target other) {
        super(target);
        STATE = state;
        COMPARE = compare;
        OTHER = other;
    }

    @Override
    public void setResolvedTarget(Object target) {
        super.setResolvedTarget(target);
        if (OTHER == TARGET) {
            solvedOther = solvedTarget;
        } else {
            solvedOther = solvedTarget.ENEMY;
        }
    }

    @Override
    public boolean check() {
        return COMPARE.compare(STATE.solve(solvedTarget), STATE.solve(solvedOther));
    }
}

class EffectChain extends BaseCondition {

    private final BaseEffect EFFECT;
    private final boolean CHAINED;

    public EffectChain(Target target, BaseEffect effect, boolean chained) {
        super(target);
        EFFECT = effect;
        CHAINED = chained;
    }

    @Override
    public boolean check() {
        return EFFECT.hasActivated == CHAINED;
    }
}

class LastCardDrawnType extends BaseCondition {

    private final CardType CARD_TYPE;

    public LastCardDrawnType(Target target, CardType type) {
        super(target);
        CARD_TYPE = type;
    }

    @Override
    public boolean check() {
        return solvedTarget.TURN_STATE.lastDrawnCard.CARD_TYPE == CARD_TYPE;
    }
}
