package crystalwars_backend;

import java.io.Serializable;

public abstract class BaseCondition implements Serializable{

    protected final Target TARGET;
    protected Player solvedTarget;

    public BaseCondition(Target target) {
        this.TARGET = target;
    }

    public void setSolvedTarget(Object target) {
        solvedTarget = (Player) target;
    }

    public abstract boolean check();
}
