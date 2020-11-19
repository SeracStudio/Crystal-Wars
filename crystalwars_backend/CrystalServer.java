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

public class CrystalServer extends TextWebSocketHandler {

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
		System.out.println("Player " + player.ID + " has connected. Online Players: " + PLAYERS.size());
	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		Player player;
		synchronized (SERVER) {
			player = (Player) session.getAttributes().get(PLAYER_ATTRIBUTE);
		}

		if (!ROOMS.containsKey(player.ROOM_ID))
			return;
		ROOMS.get(player.ROOM_ID).declareWinner(player);
		ROOMS.remove(player.ROOM_ID);

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

			case "LEAVE":
				PLAYERS.remove(player.ID);
				System.out.println("Player " + player.ID + " has disconnected. Online Players: " + PLAYERS.size());
				if (!ROOMS.containsKey(player.ROOM_ID) || player.ENEMY == null)
					break;
				ROOMS.get(player.ROOM_ID).declareWinner(player);
				ROOMS.remove(player.ROOM_ID);
				break;

			case "CREATE":
				System.out.println(node.get("mode").asText());
				CrystalRoom newRoom = new CrystalRoom(node.get("mode").asText().equals("FAST"));
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
					CrystalRoom joinRoom = ROOMS.get(roomID);
					if (!joinRoom.addPlayer(player, node.get("deck").asText())) {
						msg.put("room", "FILLED");
					} else {
						msg.put("room", joinRoom.ROOM_ID);
						if (joinRoom.fastMode) {
							msg.put("mode", "FAST");
						} else {
							msg.put("mode", "NORMAL");
						}
					}
				}
				player.SESSION.sendMessage(new TextMessage(msg.toString()));
				break;

			case "READY":
				String readyRoom = node.get("room").asText();
				if (ROOMS.containsKey(readyRoom)) {
					ROOMS.get(readyRoom).playerReady(player);
				}
				break;

			case "PLAY":
				ROOMS.get(player.ROOM_ID).play(player, node.get("id").asText());
				break;

			case "SELECT":
				ROOMS.get(player.ROOM_ID).select(player, node.get("id").asText());
				break;

			case "END TURN":
				ROOMS.get(player.ROOM_ID).switchTurn(player);
				break;

			case "CRYSTAL BUTTON":
				ROOMS.get(player.ROOM_ID).activateCrystalButton(player);
				break;

			default:
				System.out.println(node.get("event").toString());
				break;
			}

		} catch (Exception e) {
			System.err.println("Exception processing message " + message.getPayload());
			e.printStackTrace(System.err);
		}
	}

}
