package crystalwars_backend;

import java.security.SecureRandom;
import java.util.Collection;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Exchanger;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.logging.Level;
import java.util.logging.Logger;

public class CrystalRoom {

    private final String ROOM_ID;
    private final int MAX_PLAYERS = 2;
    private final AtomicInteger NUM_PLAYERS;
    private Player turnPlayer, waitPlayer;
    private final Map<String, Player> PLAYERS = new ConcurrentHashMap<>();

    //SCHEDULER
    private final ExecutorService POOL = Executors.newCachedThreadPool();
    private final Exchanger<Card> SELECTOR = new Exchanger();
    private final Exchanger<Boolean> TURN = new Exchanger<>();

    public CrystalRoom() {
        this.NUM_PLAYERS = new AtomicInteger();

        ROOM_ID = generateRoomID();
        System.out.println(ROOM_ID);
    }

    private String generateRoomID() {
        String roomID = "";
        for (int i = 0; i < 6; i++) {
            roomID += (char) (new SecureRandom().nextInt('z' - 'a') + 'a');
        }

        return roomID.toUpperCase();
    }

    public void addPlayer(Player player) {
        int count = NUM_PLAYERS.getAndIncrement();
        if (count >= MAX_PLAYERS) {
            NUM_PLAYERS.getAndDecrement();
            return;
        }

        PLAYERS.put(player.NAME, player);
        if (count == MAX_PLAYERS - 1) {
            startGame();
        }
    }

    public Collection<Player> getPlayers() {
        return PLAYERS.values();
    }

    public void startGame() {
        System.out.println("COMENZAMOS " + getPlayers().size());

        turnPlayer = (Player) getPlayers().toArray()[0];
        waitPlayer = (Player) getPlayers().toArray()[1];

        solveCardTargets(turnPlayer, waitPlayer);
        solveCardTargets(waitPlayer, turnPlayer);

        dealInitialHands();

        turn();
    }

    public void turn() {
        POOL.execute(() -> {
            turnPlayer.playTurn();
            System.out.println(turnPlayer.NAME + " ACABE.");
            try {
                TURN.exchange(true);
            } catch (InterruptedException ex) {
                Logger.getLogger(CrystalRoom.class.getName()).log(Level.SEVERE, null, ex);
            }
        });

        try {
            TURN.exchange(false);
        } catch (InterruptedException ex) {
            Logger.getLogger(CrystalRoom.class.getName()).log(Level.SEVERE, null, ex);
        }

        switchTurn();
    }

    public void chooseStartingPlayer() {
        int firstPlayer = new SecureRandom().nextInt(2);
        if (firstPlayer == 1) {
            Player auxPlayer = turnPlayer;
            turnPlayer = waitPlayer;
            waitPlayer = auxPlayer;
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

        turn();
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

}
