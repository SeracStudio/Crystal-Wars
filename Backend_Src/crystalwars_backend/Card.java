package crystalwars_backend;

import java.util.ArrayList;

public class Card {

    public Player owner;

    public final CardCollection ID;
    public final CardType CARD_TYPE;
    public int cost;

    public final ArrayList<BaseCondition> PLAY_CONDITIONS;
    public ArrayList<BaseEffect> effects;

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

    public void activateEffectsOn(EffectOn effectOn) {
        for (BaseEffect effect : effects) {
            if (effect.EFFECT_ON == effectOn) {
                effect.activate();
            }
        }
    }
}
