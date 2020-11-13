package crystalwars_backend;

import java.util.ArrayList;
import java.util.concurrent.atomic.AtomicInteger;

public class CrystalRegister {

	private final CrystalRoom ROOM;
	private AtomicInteger order;
	private  Register register;
	private final ArrayList<Register> TOTAL_REGISTER;

	class Register {
		public String playerID;
		public String order;
		public String update;
		public String data;

		Register(String playerID, String order, String update, String data) {
			this.playerID = playerID;
			this.order = order;
			this.update = update;
			this.data = data;
		}

		@Override
		public String toString() {
			return "[" + ROOM.ROOM_ID + ": " + order + "] -> Player " + playerID + " -> " + update + ": " + data;
		}
	}

	public CrystalRegister(CrystalRoom room) {
		ROOM = room;
		order = new AtomicInteger();
		TOTAL_REGISTER = new ArrayList<>();
	}

	public void register(int playerID, String update, String data) {
		String regPlayerId = String.valueOf(playerID);
		String regOrder = String.valueOf(order.getAndIncrement());
		register = new Register(regPlayerId, regOrder, update, data);
		System.out.println(register);
		
		TOTAL_REGISTER.add(register);

		ROOM.buildAndSendUpdateMsg();
	}

	public Register getRegister() {
		return register;
	}
}
