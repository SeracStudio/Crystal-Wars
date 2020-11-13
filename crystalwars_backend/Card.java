package crystalwars_backend;

import java.io.Serializable;
import java.util.ArrayList;

public class Card implements Serializable {

	public Player owner;

	public final CardCollection ID;
	public final CardType CARD_TYPE;
	public int cost;

	public final ArrayList<BaseCondition> PLAY_CONDITIONS;
	public final ArrayList<BaseEffect> effects;

	public Card(CardCollection id, CardType cardType, int cost) {
		this.ID = id;
		this.CARD_TYPE = cardType;
		this.cost = cost;

		effects = new ArrayList<>();
		PLAY_CONDITIONS = new ArrayList<>();
		PLAY_CONDITIONS.add(new StaticPlayerCompare(Target.PLAYER, CurrentState.MANA, Compare.GREATER_OR_EQUALS, cost));
	}

	public boolean isPlayable() {
		if (!PLAY_CONDITIONS.stream().noneMatch((cond) -> (!cond.check()))) {
			return false;
		}
		return true;
	}

	public void addEffect(BaseEffect newEffect) {
		newEffect.SOURCE = this;
		effects.add(newEffect);
	}

	public ArrayList<BaseEffect> getEffectsOn(EffectOn effectOn) {
		ArrayList<BaseEffect> effectsOn = new ArrayList<>();
		for (BaseEffect effect : effects) {
			if (effect.EFFECT_ON == effectOn) {
				effectsOn.add(effect);
			}
		}
		return effectsOn;
	}
}
