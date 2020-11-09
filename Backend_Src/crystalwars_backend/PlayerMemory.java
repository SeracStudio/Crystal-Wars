
package crystalwars_backend;

public class PlayerMemory {
    public boolean canSummon;
    public int damageHealed;
    public int damageTaken;
    public int selfDamageTaken;
    public int manaSpent;
    public int discardedCards;
    public int graveyardCards;
    public Card lastPeekedCard;
    public Card lastDrawnCard;
    public Card lastTributedCard;
    
    public PlayerMemory(){
        reset();
    }
    
    public void reset(){
        canSummon = true;
        damageHealed = 0;
        damageTaken = 0;
        selfDamageTaken = 0;
        manaSpent = 0;
        discardedCards = 0;
        graveyardCards = 0;
        lastPeekedCard = null;
        lastDrawnCard = null;
        lastTributedCard = null;
    }
    
    public void add(PlayerMemory ps){
        this.damageHealed += ps.damageHealed;
        this.damageTaken += ps.damageTaken;
        this.selfDamageTaken += ps.selfDamageTaken;
        this.manaSpent += ps.manaSpent;
        this.discardedCards += ps.discardedCards;
        this.graveyardCards += ps.graveyardCards;
    }
}
