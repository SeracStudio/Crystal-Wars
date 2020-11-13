package crystalwars_backend;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class CrystalServer extends TextWebSocketHandler{

	public final static CrystalServer SERVER = new CrystalServer();
	private static final String PLAYER_ATTRIBUTE = "PLAYER";
	private ObjectMapper mapper = new ObjectMapper();

	public final Map<String, CrystalRoom> ROOMS = new ConcurrentHashMap<>();
	private final Map<Integer, Player> PLAYERS = new ConcurrentHashMap<>();
	private AtomicInteger playerId = new AtomicInteger(0);

	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		Player player = new Player(playerId.incrementAndGet(), session, 15, 5);
		session.getAttributes().put(PLAYER_ATTRIBUTE, player);

		ObjectNode msg = mapper.createObjectNode();
		msg.put("event", "CONNECT");
		msg.put("id", player.ID);
		player.SESSION.sendMessage(new TextMessage(msg.toString()));

		PLAYERS.put(player.ID, player);
	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		Player player = (Player) session.getAttributes().get(PLAYER_ATTRIBUTE);
		PLAYERS.remove(player.ID);
	}

	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		try {
			JsonNode node;
			ObjectNode msg;
			Player player;
			synchronized (SERVER) {
				node = mapper.readTree(message.getPayload());
				msg = mapper.createObjectNode();
				player = (Player) session.getAttributes().get(PLAYER_ATTRIBUTE);
			}

			switch (node.get("event").asText()) {

			case "CREATE":
				CrystalRoom newRoom = new CrystalRoom();
				ROOMS.put(newRoom.ROOM_ID, newRoom);
				newRoom.addPlayer(player, node.get("deck").asText());
				msg.put("event", "CREATE");
				msg.put("room", newRoom.ROOM_ID);
				player.SESSION.sendMessage(new TextMessage(msg.toString()));
				break;

			case "JOIN":
				String roomID = node.get("room").asText();
				msg.put("event", "JOIN");
				if (!ROOMS.containsKey(roomID)) {
					msg.put("room", "ERROR");
				} else {
					CrystalRoom room = ROOMS.get(roomID);
					if (!room.addPlayer(player, node.get("deck").asText())) {
						msg.put("room", "FILLED");
					} else {
						msg.put("room", room.ROOM_ID);
					}
				}
				player.SESSION.sendMessage(new TextMessage(msg.toString()));
				break;

			case "READY":
				ROOMS.get(node.get("room").asText()).playerReady();
				break;
				
			case "PLAY":
				msg.put("event", "PLAY");
				if(!ROOMS.get(player.ROOM_ID).play(player, node.get("id").asText())) {			
					msg.put("id", "ERROR");		
				}else {
					msg.put("id", node.get("id").asText());
				}
				player.SESSION.sendMessage(new TextMessage(msg.toString()));
				break;

			case "SELECT":
				msg.put("event", "SELECT");
				if(!ROOMS.get(player.ROOM_ID).select(player, node.get("id").asText())) {
					msg.put("id", "ERROR");
				}else {
					msg.put("id", node.get("id").asText());
				}
				player.SESSION.sendMessage(new TextMessage(msg.toString()));
				break;

			case "END TURN":
				ROOMS.get(player.ROOM_ID).switchTurn(player);
				break;
				
			default:
				break;
			}

		} catch (Exception e) {
			System.err.println("Exception processing message " + message.getPayload());
			e.printStackTrace(System.err);
		}
	}

}
