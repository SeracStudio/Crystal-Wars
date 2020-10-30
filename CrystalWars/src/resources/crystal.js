class Crystal{
    constructor(health){
        this.health = health;
        this.mana;
        
    }

    damage(points){
        this.health -= points;
    }

    heal(points){
        this.health += points;
    }

    addMana(points){
        this.mana += points;
    }

    removeMana(points{
        this.mana -= points;
    })
}
