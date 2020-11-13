package crystalwars_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@SpringBootApplication
@EnableWebSocket
public class LaunchServer implements WebSocketConfigurer{

	public static void main(String[] args) {
		SpringApplication.run(LaunchServer.class, args);
	}
	

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry.addHandler(gameHandler(), "/crystalwars");
	}

	@Bean
	public CrystalServer gameHandler() {
		return new CrystalServer();
	}
}
