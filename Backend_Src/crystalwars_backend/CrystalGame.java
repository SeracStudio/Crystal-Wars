package crystalwars_backend;

import java.util.Random;

public class CrystalGame {

    Player turnPlayer, waitPlayer;

    public void loadPlayers(Player player1, Player player2) {
        player1.ENEMY = player2;
        player2.ENEMY = player1;

        turnPlayer = player1;
        waitPlayer = player2;

        solveCardTargets(turnPlayer, waitPlayer);
        solveCardTargets(waitPlayer, turnPlayer);
    }

    public void solveCardTargets(Player self, Player enemy) {
        for (Card card : self._deck.GROUP) {
            card.owner = self;
            //Play Conditions
            for (BaseCondition bCond : card.PLAY_CONDITIONS) {
                switch (bCond.TARGET) {
                    case PLAYER:
                        bCond.setResolvedTarget(self);
                        break;
                    case ENEMY:
                        bCond.setResolvedTarget(enemy);
                        break;
                }
            }
            //Effects Target
            for (BaseEffect effect : card.effects) {
                switch (effect.TARGET) {
                    case PLAYER:
                        effect.setResolvedTarget(self);
                        break;
                    case ENEMY:
                        effect.setResolvedTarget(enemy);
                        break;
                    case SELF:
                        effect.setResolvedTarget(card);
                        break;
                }
                //Conditions Target
                for (BaseCondition cond : effect.CONDITIONS) {
                    switch (cond.TARGET) {
                        case PLAYER:
                            cond.setResolvedTarget(self);
                            break;
                        case ENEMY:
                            cond.setResolvedTarget(enemy);
                            break;
                        case SELF:
                            cond.setResolvedTarget(card);
                            break;
                    }
                }
                //Modifiers Target
                for (BaseModifier mod : effect.MODIFIERS) {
                    switch (mod.TARGET) {
                        case PLAYER:
                            mod.setResolvedTarget(self);
                            break;
                        case ENEMY:
                            mod.setResolvedTarget(enemy);
                            break;
                        case SELF:
                            mod.setResolvedTarget(card);
                            break;
                    }
                }
            }
        }
    }

    public void startGame() {
        chooseStartingPlayer();
        dealInitialHands();
    }

    public void chooseStartingPlayer() {
        int firstPlayer = new Random().nextInt(2) + 1;
        if (firstPlayer == 2) {
            switchTurn();
        }
    }

    public void dealInitialHands() {
        turnPlayer._deck.shuffle();
        waitPlayer._deck.shuffle();

        turnPlayer.draw(3);
        waitPlayer.draw(4);
    }

    public void switchTurn() {
        Player auxPlayer = turnPlayer;
        turnPlayer = waitPlayer;
        waitPlayer = auxPlayer;

        turnPlayer.GAME_STATE.add(turnPlayer.TURN_STATE);
        turnPlayer.TURN_STATE.reset();

        waitPlayer.GAME_STATE.add(waitPlayer.TURN_STATE);
        waitPlayer.TURN_STATE.reset();
    }

    public void turnStartEvent() {
        turnPlayer.draw(1);
        activateSummoningsOn(EffectOn.TURN_START, turnPlayer);
    }

    public void turnEndEvent() {
        activateSummoningsOn(EffectOn.TURN_END, turnPlayer);
    }

    public void activateSummoningsOn(EffectOn effectOn, Player player) {
        for (Card card : player._field.GROUP) {
            card.activateEffectsOn(effectOn);
        }
    }

    public void resolveCardPlay(Card playedCard) {
        playedCard.activateEffectsOn(EffectOn.PLAY);
        activateSummoningsOn(EffectOn.PLAYER_ANY, turnPlayer);
        activateSummoningsOn(EffectOn.ENEMY_ANY, waitPlayer);
    }
}
