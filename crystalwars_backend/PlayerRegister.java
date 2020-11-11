package crystalwars_backend;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.springframework.remoting.soap.SoapFaultException;

public class PlayerRegister {

	private final Player OWNER;
	private final ArrayList<Register> REGISTER;
	
	class Register{
		public String update;
		public String data;
		
		Register(String event, String def){
			this.update = event;
			this.data = def;
		}
	}
	
	public PlayerRegister(Player player) {
		OWNER = player;
		REGISTER = new ArrayList<>();
	}
	
	public void register(String event, String def) {
		REGISTER.add(new Register(event, def));
		System.out.println(OWNER.ID + " " + event + " " + def);
	}
	
	public void clear() {
		REGISTER.clear();
	}
	
	public ArrayList<Register> getRegister() {
		return REGISTER;
	}
}
