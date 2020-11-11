package crystalwars_backend;

import java.security.SecureRandom;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class LaunchServer {

	public static void main(String[] args) {

		// CrystalRoom cr1 = new CrystalRoom();

		ExecutorService pool = Executors.newCachedThreadPool();

		for (int i = 0; i < 1; i++) {

			CrystalRoom cr1 = new CrystalRoom();
			Player p = new Player(0, null, 15, 5);
			String myDeck = "1 6 4";

			Player p2 = new Player(1, null, 15, 5);
			String myDeck2 = "11 11 11 12 12 12 13 14 15 16 17 18 19 20";

			cr1.addPlayer(p, myDeck);
			cr1.addPlayer(p2, myDeck2);

			cr1.startGame();

			p.health -= 5;

		/*	cr1.play(p, String.valueOf(CardCollection.PAREJA_DE_ORBES_AGUA.ID));
			cr1.play(p, String.valueOf(CardCollection.PAREJA_DE_ORBES_AGUA.ID));
			cr1.play(p, String.valueOf(p._hand.GROUP.get(0).ID.ID));
			*/
			cr1.play(p, String.valueOf(p._hand.GROUP.get(0).ID.ID));
			cr1.play(p, String.valueOf(p._hand.GROUP.get(0).ID.ID));
			cr1.play(p, String.valueOf(p._hand.GROUP.get(0).ID.ID));
			
			
			/*
			 * try { Thread.sleep(300); } catch (InterruptedException e) { // TODO
			 * Auto-generated catch block e.printStackTrace(); }
			 */
		}
	}
}
