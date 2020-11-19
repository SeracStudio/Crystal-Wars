package crystalwars_backend;

import java.io.Serializable;

public abstract class BaseModifier implements Serializable {

	public final Target TARGET;
	public final Mode MODE;

	public BaseModifier(Target target, Mode mode) {
		TARGET = target;
		MODE = mode;
	}

	public abstract void setSolvedTarget(Object target);

	public abstract int getModifier();
}

abstract class PlayerTargetModifier extends BaseModifier {

	public Player solvedTarget;

	public PlayerTargetModifier(Target target, Mode mode) {
		super(target, mode);
	}

	@Override
	public void setSolvedTarget(Object target) {
		solvedTarget = (Player) target;
	}
}

abstract class CardTargetModifier extends BaseModifier {

	public Card solvedTarget;

	public CardTargetModifier(Target target, Mode mode) {
		super(target, mode);
	}

	@Override
	public void setSolvedTarget(Object target) {
		solvedTarget = (Card) target;
	}
}
