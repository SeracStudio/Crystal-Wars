package crystalwars_backend;

public class PlayerState{
	
    public boolean canSummon;
    public int healed;
    public int damageTaken;
    public int selfDamageTaken;
    public int manaSpent;
    public int discardedCards;
    public int graveyardCards;
    public Card lastPeekedCard;
    public Card lastDrawnCard;
    public Card lastDestroyedCard;
    
    public PlayerState(){
        reset();
    }
    
    public void reset(){
        canSummon = true;
        healed = 0;
        damageTaken = 0;
        selfDamageTaken = 0;
        manaSpent = 0;
        discardedCards = 0;
        graveyardCards = 0;
        lastPeekedCard = null;
        lastDrawnCard = null;
        lastDestroyedCard = null;
    }
    
    public void add(PlayerState ps){
        this.healed += ps.healed;
        this.damageTaken += ps.damageTaken;
        this.selfDamageTaken += ps.selfDamageTaken;
        this.manaSpent += ps.manaSpent;
        this.discardedCards += ps.discardedCards;
        this.graveyardCards += ps.graveyardCards;
    }
}
