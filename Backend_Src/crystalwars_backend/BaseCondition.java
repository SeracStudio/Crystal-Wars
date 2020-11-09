package crystalwars_backend;

public abstract class BaseCondition {

    public final Target TARGET;
    public Player solvedTarget;

    public BaseCondition(Target target) {
        this.TARGET = target;
    }

    public void setResolvedTarget(Object target) {
        solvedTarget = (Player) target;
    }

    public abstract boolean check();
}
