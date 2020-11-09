package crystalwars_backend;

public abstract class BaseModifier {

    public final Target TARGET;
    public Player solvedTarget;

    public final Mode MODE;

    public BaseModifier(Target target, Mode mode) {
        TARGET = target;
        MODE = mode;
    }

    public abstract void setResolvedTarget(Object target);

    public abstract int getModifier();
}

abstract class PlayerTargetModifier extends BaseModifier {

    public Player solvedTarget;

    public PlayerTargetModifier(Target target, Mode mode) {
        super(target, mode);
    }

    @Override
    public void setResolvedTarget(Object target) {
        solvedTarget = (Player) target;
    }

    @Override
    public abstract int getModifier();
}

abstract class CardTargetModifier extends BaseModifier {

    public Card solvedTarget;

    public CardTargetModifier(Target target, Mode mode) {
        super(target, mode);
    }

    @Override
    public void setResolvedTarget(Object target) {
        solvedTarget = (Card) target;
    }

    @Override
    public abstract int getModifier();

}
