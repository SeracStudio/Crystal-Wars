package crystalwars_backend;

import java.util.Random;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.logging.Level;
import java.util.logging.Logger;

public class CrystalWars_Backend {

    public static void main(String[] args) {
        //TEST CARD BUILDS
        Card c1 = new Card(CardCollection.ORBE_DE_MANA_AGUA, CardType.MANA, 0);
        c1.addEffect(new AddMana(EffectOn.PLAY, Target.PLAYER, 1));

        Card c2 = new Card(CardCollection.PAREJA_DE_ORBES_AGUA, CardType.MANA, 0);
        c2.addEffect(new AddMana(EffectOn.PLAY, Target.PLAYER, 2));

        Card c3 = new Card(CardCollection.MANANTIAL_DE_LA_VIDA, CardType.SPELL, 0);
        CostChange c3_e1 = new CostChange(EffectOn.PRE_PLAY, Target.SELF, 0);
        c3_e1.MODIFIERS.add(new OnCurrent(Target.PLAYER, CurrentState.MANA, Mode.ADD));
        Heal c3_e2 = new Heal(EffectOn.PLAY, Target.PLAYER, 0);
        c3_e2.MODIFIERS.add(new OnCardCost(Target.SELF, Mode.ADD));
        c3.addEffect(c3_e1);
        c3.addEffect(c3_e2);

        Card c4 = new Card(CardCollection.CALIZ_DE_CORAL, CardType.SPELL, 1);
        c4.addEffect(new Heal(EffectOn.PLAY, Target.PLAYER, 1));
        Heal c4_e2 = new Heal(EffectOn.PLAY, Target.PLAYER, 1);
        c4_e2.CONDITIONS.add(new CardPresentOn(Target.PLAYER, CardCollection.PLUVIAM, CardSite.FIELD));
        c4.addEffect(c4_e2);

        Card c5 = new Card(CardCollection.RESACA, CardType.SPELL, 1);
        Damage c5_e1 = new Damage(EffectOn.PLAY, Target.ENEMY, 0);
        c5_e1.MODIFIERS.add(new OnMemory(MemorySpan.TURN, Target.PLAYER, MemoryState.HEALED, Mode.ADD));
        c5.addEffect(c5_e1);

        Card c6 = new Card(CardCollection.PUPILO_DE_LAS_MAREAS, CardType.SUMMONING, 1);
        c6.addEffect(new Heal(EffectOn.PLAYER_SPELL, Target.PLAYER, 1));

        Card c7 = new Card(CardCollection.OSTRA_POTENCIADORA, CardType.SUMMONING, 1);
        c7.addEffect(new AddMana(EffectOn.PLAYER_MANA, Target.PLAYER, 1));

        Card c8 = new Card(CardCollection.ORACULO_DEL_OCEANO, CardType.SUMMONING, 2);
        c8.addEffect(new Peek(EffectOn.TURN_START, Target.ENEMY));
        Damage c8_e1 = new Damage(EffectOn.TURN_START, Target.ENEMY, 0);
        c8_e1.MODIFIERS.add(new LastPeekedCardCost(MemorySpan.TURN, Target.PLAYER, Mode.ADD));
        c8.addEffect(c8_e1);

        Card c9 = new Card(CardCollection.GEISER, CardType.SUMMONING, 2);
        c9.addEffect(new Damage(EffectOn.PLAY, Target.ENEMY, 2));
        c9.addEffect(new Damage(EffectOn.PLAY, Target.PLAYER, 1));
        c9.addEffect(new Damage(EffectOn.PLAYER_SUMMONING, Target.ENEMY, 2));
        c9.addEffect(new Damage(EffectOn.PLAYER_SUMMONING, Target.PLAYER, 1));
        c9.addEffect(new Damage(EffectOn.ENEMY_SUMMONING, Target.ENEMY, 2));
        c9.addEffect(new Damage(EffectOn.ENEMY_SUMMONING, Target.PLAYER, 1));

        Card c10 = new Card(CardCollection.PLUVIAM, CardType.SUMMONING, 3);
        c10.addEffect(new Heal(EffectOn.TURN_END, Target.PLAYER, 1));
        Damage c10_e1 = new Damage(EffectOn.TURN_END, Target.ENEMY, 0);
        c10_e1.MODIFIERS.add(new OnMemory(MemorySpan.TURN, Target.PLAYER, MemoryState.MANA_SPENT, Mode.ADD));
        c10.addEffect(c10_e1);

        Card c11 = new Card(CardCollection.ORBE_DE_MANA_FUEGO, CardType.MANA, 0);
        c11.addEffect(new AddMana(EffectOn.PLAY, Target.PLAYER, 1));

        Card c12 = new Card(CardCollection.PAREJA_DE_ORBES_FUEGO, CardType.MANA, 0);
        c12.addEffect(new AddMana(EffectOn.PLAY, Target.PLAYER, 2));

        Card c13 = new Card(CardCollection.CALDERO_DE_LAVA, CardType.SPELL, 1);
        c13.addEffect(new Damage(EffectOn.PLAY, Target.PLAYER, 2));
        Destroy c13_e1 = new Destroy(EffectOn.PLAY, Target.SELECT);
        //c13_e1.SELECT_CONDITIONS.add(new CardPresentOn(Target.ENEMY, CardCollection.SELECT, CardSite.FIELD));
        c13.addEffect(c13_e1);

        Card c14 = new Card(CardCollection.GLIFO_FUEGOSCURO, CardType.SPELL, 1);
        c14.addEffect(new Damage(EffectOn.PLAY, Target.PLAYER, 1));
        c14.addEffect(new Draw(EffectOn.PLAY, Target.PLAYER, 2));

        Card c15 = new Card(CardCollection.BUSCALLAMAS, CardType.SUMMONING, 1);
        c15.addEffect(new DrawType(EffectOn.TURN_START, Target.PLAYER, CardType.MANA));

        Card c16 = new Card(CardCollection.BASILISCO_DURMIENTE, CardType.SUMMONING, 1);
        c16.addEffect(new Damage(EffectOn.TURN_START, Target.PLAYER, 1));
        c16.addEffect(new AddMana(EffectOn.TURN_START, Target.PLAYER, 1));

        Card c17 = new Card(CardCollection.PUERTAS_DEL_TARTARO, CardType.SPELL, 2);
        c17.addEffect(new Damage(EffectOn.PLAY, Target.PLAYER, 2));
        c17.addEffect(new Summon(EffectOn.PLAY, Target.PLAYER, CardCollection.LEVIORES, CardSite.HAND));

        Card c18 = new Card(CardCollection.CABALLERO_LEAL, CardType.SUMMONING, 2);
        c18.addEffect(new Damage(EffectOn.PLAY, Target.ENEMY, 2));
        c18.addEffect(new Damage(EffectOn.PLAY, Target.PLAYER, 1));
        c18.addEffect(new MoveCard(EffectOn.TURN_END, Target.PLAYER, CardCollection.CABALLERO_LEAL, CardSite.FIELD, CardSite.HAND));

        Card c19 = new Card(CardCollection.IGNIS, CardType.SUMMONING, 2);
        CostChange c19_e1 = new CostChange(EffectOn.PRE_PLAY, Target.SELF, 0);
        c19_e1.MODIFIERS.add(new OnMemory(MemorySpan.TURN, Target.PLAYER, MemoryState.SELF_DAMAGE_TAKEN, Mode.SUBTRACT));
        Damage c19_e2 = new Damage(EffectOn.TURN_END, Target.ENEMY, 0);
        c19_e2.MODIFIERS.add(new OnMemory(MemorySpan.TURN, Target.PLAYER, MemoryState.SELF_DAMAGE_TAKEN, Mode.ADD));
        c19.addEffect(c19_e2);

        Card c20 = new Card(CardCollection.LEVIORES, CardType.SUMMONING, 3);
        c20.addEffect(new Damage(EffectOn.TURN_START, Target.ENEMY, 1));
        c20.addEffect(new Damage(EffectOn.TURN_START, Target.PLAYER, 1));
        Damage c20_e1 = new Damage(EffectOn.TURN_END, Target.ENEMY, 0);
        c20_e1.CONDITIONS.add(new StaticPlayerCompare(Target.PLAYER, CurrentState.HEALTH, Compare.EQUALS, 1));
        c20_e1.MODIFIERS.add(new OnMemory(MemorySpan.GAME, Target.PLAYER, MemoryState.SELF_DAMAGE_TAKEN, Mode.ADD));
        c20.addEffect(c20_e1);

        Card c21 = new Card(CardCollection.ORBE_DE_MANA_VIENTO, CardType.MANA, 0);
        c21.addEffect(new AddMana(EffectOn.PLAY, Target.PLAYER, 1));

        Card c22 = new Card(CardCollection.PAREJA_DE_ORBES_VIENTO, CardType.MANA, 0);
        c22.addEffect(new AddMana(EffectOn.PLAY, Target.PLAYER, 2));

        Card c23 = new Card(CardCollection.KUMO, CardType.SUMMONING, 0);
        c23.addEffect(new Draw(EffectOn.DISCARD, Target.PLAYER, 1));

        Card c24 = new Card(CardCollection.SORA_EL_ALADO, CardType.SUMMONING, 0);
        Draw c24_e1 = new Draw(EffectOn.TURN_END_GRAVEYARD, Target.PLAYER, -1);
        c24_e1.MODIFIERS.add(new OnMemory(MemorySpan.TURN, Target.PLAYER, MemoryState.DISCARDED_CARDS, Mode.ADD));
        c24.addEffect(c24_e1);
        c24.addEffect(new MoveCard(EffectOn.TURN_END_GRAVEYARD, Target.PLAYER, CardCollection.SORA_EL_ALADO, CardSite.GRAVEYARD, CardSite.HAND));

        Card c25 = new Card(CardCollection.SILBATO_CEFIRO, CardType.SPELL, 1);
        c25.PLAY_CONDITIONS.add(new StaticPlayerCompare(Target.PLAYER, CurrentState.CARDS_ON_HAND, Compare.GREATER, 0));
        Discard c25_e1 = new Discard(EffectOn.PLAY, Target.SELECT);
        //c25_e1.SELECT_CONDITIONS.add(new CardPresentOn(Target.PLAYER, CardCollection.SELECT, CardSite.HAND));
        DrawSpecific c25_e2 = new DrawSpecific(EffectOn.PLAY, Target.PLAYER, CardCollection.CAELI);
        c25_e2.CONDITIONS.add(new EffectChain(Target.PLAYER, c25_e1, true));
        c25.addEffect(c25_e1);
        c25.addEffect(c25_e2);

        Card c26 = new Card(CardCollection.APUESTA_DEL_VIENTO, CardType.SPELL, 1);
        c26.addEffect(new Draw(EffectOn.PLAY, Target.PLAYER, 1));
        Damage c26_e1 = new Damage(EffectOn.PLAY, Target.ENEMY, 1);
        c26_e1.CONDITIONS.add(new LastCardDrawnType(Target.PLAYER, CardType.SUMMONING));
        Discard c26_e2 = new Discard(EffectOn.PLAY, Target.SELECT);
        c26_e2.CONDITIONS.add(new LastCardDrawnType(Target.PLAYER, CardType.MANA));
        //c26_e2.SELECT_CONDITIONS.add(new CardPresentOn(Target.PLAYER, CardCollection.SELECT, CardSite.HAND));
        Discard c26_e3 = new Discard(EffectOn.PLAY, Target.SELECT);
        c26_e3.CONDITIONS.add(new LastCardDrawnType(Target.PLAYER, CardType.SPELL));
        c26_e3.SELECT_CONDITIONS.add(new CardPresentOn(Target.PLAYER, CardCollection.SELECT, CardSite.HAND));
        c26.addEffect(c26_e1);
        c26.addEffect(c26_e2);
        c26.addEffect(c26_e3);

        Card c27 = new Card(CardCollection.PERIPLO_EFIMERO, CardType.SPELL, 1);
        c27.PLAY_CONDITIONS.add(new StaticPlayerCompare(Target.PLAYER, CurrentState.CARDS_ON_HAND, Compare.GREATER, 1));
        Discard c27_e1 = new Discard(EffectOn.PLAY, Target.SELECT);
        //c27_e1.SELECT_CONDITIONS.add(new CardPresentOn(Target.PLAYER, CardCollection.SELECT, CardSite.HAND));
        Discard c27_e2 = new Discard(EffectOn.PLAY, Target.SELECT);
        //c27_e2.SELECT_CONDITIONS.add(new CardPresentOn(Target.PLAYER, CardCollection.SELECT, CardSite.HAND));
        c27.addEffect(new Draw(EffectOn.PLAY, Target.PLAYER, 2));

        Card c28 = new Card(CardCollection.TROTABRISAS, CardType.SUMMONING, 1);
        Discard c28_e1 = new Discard(EffectOn.TURN_START, Target.SELECT);
        //c28_e1.SELECT_CONDITIONS.add(new CardPresentOn(Target.PLAYER, CardCollection.SELECT, CardSite.HAND));
        c28_e1.CONDITIONS.add(new StaticPlayerCompare(Target.PLAYER, CurrentState.CARDS_ON_HAND, Compare.GREATER, 0));
        DrawType c28_e2 = new DrawType(EffectOn.TURN_START, Target.PLAYER, CardType.MANA);
        c28_e2.CONDITIONS.add(new EffectChain(Target.PLAYER, c28_e1, true));
        c28.addEffect(c28_e1);
        c28.addEffect(c28_e2);

        Card c29 = new Card(CardCollection.NOTOS, CardType.SUMMONING, 2);
        Discard c29_e1 = new Discard(EffectOn.TURN_START, Target.SELECT);
        c29_e1.CONDITIONS.add(new StaticPlayerCompare(Target.PLAYER, CurrentState.CARDS_ON_HAND, Compare.GREATER, 1));
        //c29_e1.SELECT_CONDITIONS.add(new CardPresentOn(Target.PLAYER, CardCollection.SELECT, CardSite.HAND));
        Discard c29_e2 = new Discard(EffectOn.TURN_START, Target.SELECT);
        c29_e2.CONDITIONS.add(new EffectChain(Target.PLAYER, c29_e2, true));
        //c29_e2.SELECT_CONDITIONS.add(new CardPresentOn(Target.PLAYER, CardCollection.SELECT, CardSite.HAND));
        Draw c29_e3 = new Draw(EffectOn.TURN_END, Target.PLAYER, 2);
        c29_e3.CONDITIONS.add(new CardPresentOn(Target.PLAYER, CardCollection.CAELI, CardSite.FIELD));
        Damage c29_e4 = new Damage(EffectOn.TURN_END, Target.ENEMY, 2);
        c29_e4.CONDITIONS.add(new EffectChain(Target.PLAYER, c29_e3, false));
        c29.addEffect(c29_e1);
        c29.addEffect(c29_e2);
        c29.addEffect(c29_e3);
        c29.addEffect(c29_e4);

        Card c30 = new Card(CardCollection.CAELI, CardType.SUMMONING, 3);
        c30.addEffect(new Draw(EffectOn.PLAY, Target.PLAYER, 1));
        Damage c30_e1 = new Damage(EffectOn.TURN_END, Target.ENEMY, 0);
        c30_e1.MODIFIERS.add(new OnMemory(MemorySpan.TURN, Target.PLAYER, MemoryState.DISCARDED_CARDS, Mode.ADD));
        c30.addEffect(c30_e1);

        Card c31 = new Card(CardCollection.ORBE_DE_MANA_TIERRA, CardType.MANA, 0);
        c31.addEffect(new AddMana(EffectOn.PLAY, Target.PLAYER, 1));

        Card c32 = new Card(CardCollection.PAREJA_DE_ORBES_TIERRA, CardType.MANA, 0);
        c32.addEffect(new AddMana(EffectOn.PLAY, Target.PLAYER, 2));

        Card c33 = new Card(CardCollection.GARGOLA_CALIZA, CardType.SUMMONING, 0);
        c33.addEffect(new DrawType(EffectOn.DESTROY, Target.PLAYER, CardType.SUMMONING));

        Card c34 = new Card(CardCollection.BACULO_PETREO, CardType.SPELL, 1);
        c34.PLAY_CONDITIONS.add(new StaticPlayerCompare(Target.PLAYER, CurrentState.SUMMONINGS, Compare.GREATER, 0));
        c34.PLAY_CONDITIONS.add(new StaticPlayerCompare(Target.ENEMY, CurrentState.SUMMONINGS, Compare.GREATER, 0));
        Tribute c34_e1 = new Tribute(EffectOn.PLAY, Target.SELECT);
        //c34_e1.SELECT_CONDITIONS.add(new CardPresentOn(Target.PLAYER, CardCollection.SELECT, CardSite.FIELD));
        Destroy c34_e2 = new Destroy(EffectOn.PLAY, Target.SELECT);
        //c34_e2.SELECT_CONDITIONS.add(new CardPresentOn(Target.ENEMY, CardCollection.SELECT, CardSite.FIELD));

        Card c35 = new Card(CardCollection.DESTRUCCION_DE_PANGEA, CardType.SPELL, 1);
        c35.PLAY_CONDITIONS.add(new StaticPlayerCompare(Target.PLAYER, CurrentState.SUMMONINGS, Compare.GREATER, 0));
        Tribute c35_e1 = new Tribute(EffectOn.PLAY, Target.SELECT);
        //c35_e1.SELECT_CONDITIONS.add(new CardPresentOn(Target.PLAYER, CardCollection.SELECT, CardSite.FIELD));
        AddMana c35_e2 = new AddMana(EffectOn.PLAY, Target.PLAYER, 0);
        c35_e2.MODIFIERS.add(new LastTributedCardCost(MemorySpan.TURN, Target.PLAYER, Mode.ADD));
        c35.addEffect(c35_e1);

        Card c36 = new Card(CardCollection.CHAMAN_DE_LA_MONTAÑA, CardType.SUMMONING, 1);
        c36.addEffect(new Heal(EffectOn.DESTROY, Target.PLAYER, 2));
        AddMana c36_e1 = new AddMana(EffectOn.DESTROY, Target.PLAYER, 1);
        c36_e1.CONDITIONS.add(new CardPresentOn(Target.PLAYER, CardCollection.DOTON, CardSite.FIELD));
        c36.addEffect(c36_e1);

        Card c37 = new Card(CardCollection.BATALLON_MERCENARIO, CardType.SUMMONING, 1);
        c37.addEffect(new Damage(EffectOn.DESTROY, Target.ENEMY, 2));

        Card c38 = new Card(CardCollection.FOSA_TECTONICA, CardType.SPELL, 2);
        c38.PLAY_CONDITIONS.add(new StaticPlayerCompare(Target.PLAYER, CurrentState.SUMMONINGS, Compare.GREATER, 0));
        Tribute c38_e1 = new Tribute(EffectOn.PLAY, Target.SELECT);
        //c38_e1.SELECT_CONDITIONS.add(new CardPresentOn(Target.PLAYER, CardCollection.SELECT, CardSite.FIELD));
        c38.addEffect(new Summon(EffectOn.PLAY, Target.PLAYER, CardCollection.DOTON, CardSite.HAND));

        Card c39 = new Card(CardCollection.GORE_EL_TORTURADOR, CardType.SUMMONING, 2);
        c39.addEffect(new Damage(EffectOn.DESTROY, Target.ENEMY, 3));
        c39.addEffect(new MoveCard(EffectOn.TURN_END_GRAVEYARD, Target.PLAYER, CardCollection.GORE_EL_TORTURADOR, CardSite.GRAVEYARD, CardSite.HAND));

        Card c40 = new Card(CardCollection.DOTON, CardType.SUMMONING, 3);
        Tribute c40_e1 = new Tribute(EffectOn.TURN_END, Target.SELECT);
        c40_e1.CONDITIONS.add(new StaticPlayerCompare(Target.PLAYER, CurrentState.SUMMONINGS, Compare.EQUALS, 2));
        //c40_e1.SELECT_CONDITIONS.add(new CardPresentOn(Target.PLAYER, CardCollection.SELECT, CardSite.FIELD));
        Damage c40_e2 = new Damage(EffectOn.TURN_END, Target.ENEMY, 0);
        c40_e2.MODIFIERS.add(new OnMemory(MemorySpan.TURN, Target.PLAYER, MemoryState.GRAVEYARD_CARDS, Mode.ADD));
        c40.addEffect(c40_e1);
        c40.addEffect(c40_e2);

        Card c41 = new Card(CardCollection.WAIN_EL_COPERO, CardType.SUMMONING, 0);
        AddMana c41_e1 = new AddMana(EffectOn.TURN_START, Target.PLAYER, 1);
        c41_e1.CONDITIONS.add(new StaticPlayerCompare(Target.PLAYER, CurrentState.MANA, Compare.EQUALS, 0));
        c41.addEffect(c41_e1);

        Card c42 = new Card(CardCollection.EQUILIBRAR_LA_BALANZA, CardType.SPELL, 1);
        c42.addEffect(new Draw(EffectOn.PLAY, Target.PLAYER, 1));
        Draw c42_e1 = new Draw(EffectOn.PLAY, Target.PLAYER, 1);
        c42_e1.CONDITIONS.add(new DynamicPlayerCompare(Target.ENEMY, CurrentState.SUMMONINGS, Compare.GREATER, Target.PLAYER));
        c42.addEffect(c42_e1);

        Card c43 = new Card(CardCollection.ELECCION_DE_DIOS, CardType.SPELL, 1);
        Discard c43_e1 = new Discard(EffectOn.PLAY, Target.SELECT);
        //c43_e1.SELECT_CONDITIONS.add(new CardPresentOn(Target.ENEMY, CardCollection.SELECT, CardSite.HAND));
        c43.addEffect(c43_e1);

        Card c44 = new Card(CardCollection.JOKY_EL_BUFON, CardType.SUMMONING, 1);
        c44.addEffect(new Peek(EffectOn.TURN_START, Target.ENEMY));

        Card c45 = new Card(CardCollection.BLOQUEO_CELESTIAL, CardType.SPELL, 2);
        c45.addEffect(new Block(EffectOn.PLAY, Target.ENEMY));

        Card c46 = new Card(CardCollection.PRECEPTO_DE_ARKE, CardType.SPELL, 2);
        Destroy c46_e1 = new Destroy(EffectOn.PLAY, Target.SELECT);
        c46_e1.CONDITIONS.add(new StaticPlayerCompare(Target.ENEMY, CurrentState.SUMMONINGS, Compare.GREATER, 0));
        //c46_e1.SELECT_CONDITIONS.add(new CardPresentOn(Target.PLAYER, CardCollection.SELECT, CardSite.FIELD));
        //c46_e1.SELECT_CONDITIONS.add(new CardPresentOn(Target.ENEMY, CardCollection.SELECT, CardSite.FIELD));
        c46.addEffect(c46_e1);

        Card c47 = new Card(CardCollection.SACRIFICIO_DIVINO, CardType.SPELL, 2);
        c47.PLAY_CONDITIONS.add(new StaticPlayerCompare(Target.PLAYER, CurrentState.SUMMONINGS, Compare.GREATER, 0));
        Tribute c47_e1 = new Tribute(EffectOn.PLAY, Target.SELECT);
        //c47_e1.SELECT_CONDITIONS.add(new CardPresentOn(Target.PLAYER, CardCollection.SELECT, CardSite.HAND));
        Damage c47_e2 = new Damage(EffectOn.PLAY, Target.ENEMY, 0);
        c47_e2.MODIFIERS.add(new LastTributedCardCost(MemorySpan.TURN, Target.PLAYER, Mode.ADD));
        c47.addEffect(c47_e1);
        c47.addEffect(c47_e2);

        Card c48 = new Card(CardCollection.MIRADA_ETERNA, CardType.SUMMONING, 2);
        c48.addEffect(new RemoveMana(EffectOn.TURN_START, Target.ENEMY, 1));

        /*
        *
        *
        *
         */
        Player p1 = new Player(15, 5, "Julio");
        Player p2 = new Player(15, 5, "Daniel");

        p1._deck.addCard(c2);
        p1._deck.addCard(c2);
        p1._deck.addCard(c3);

        CrystalGame cryGame = new CrystalGame();

        cryGame.loadPlayers(p1, p2);
        cryGame.startGame();

        p1.health -= 5;

        p1.play(CardCollection.PAREJA_DE_ORBES_AGUA, CardSite.HAND);
        p1.play(CardCollection.PAREJA_DE_ORBES_AGUA, CardSite.HAND);
        p1.play(CardCollection.MANANTIAL_DE_LA_VIDA, CardSite.HAND);

        System.out.println("Julio: " + p1.health);
        System.out.println("Daniel: " + p2.health);

        ExecutorService pool = Executors.newCachedThreadPool();

        CrystalRoom r1 = new CrystalRoom();

        for (int i = 0; i < 100; i++) {
            Player p = new Player(15, 5, String.valueOf(i));

            pool.execute(() -> {
                try {
                    Thread.sleep(new Random().nextInt(10000));
                } catch (InterruptedException ex) {
                    Logger.getLogger(CrystalWars_Backend.class.getName()).log(Level.SEVERE, null, ex);
                }
                r1.addPlayer(p);
            });
        }

        CrystalRoom r2 = new CrystalRoom();

        for (int i = 100; i < 200; i++) {
            Player p = new Player(15, 5, String.valueOf(i));

            pool.execute(() -> {
                try {
                    Thread.sleep(new Random().nextInt(10000));
                } catch (InterruptedException ex) {
                    Logger.getLogger(CrystalWars_Backend.class.getName()).log(Level.SEVERE, null, ex);
                }
                r2.addPlayer(p);
            });
        }
        
        CrystalRoom r3 = new CrystalRoom();

        for (int i = 200; i < 300; i++) {
            Player p = new Player(15, 5, String.valueOf(i));

            pool.execute(() -> {
                try {
                    Thread.sleep(new Random().nextInt(10000));
                } catch (InterruptedException ex) {
                    Logger.getLogger(CrystalWars_Backend.class.getName()).log(Level.SEVERE, null, ex);
                }
                r3.addPlayer(p);
            });
        }
    }
}
