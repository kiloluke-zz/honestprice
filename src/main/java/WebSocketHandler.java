import com.fasterxml.jackson.databind.ObjectMapper;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;

import java.io.IOException;
import java.util.ArrayList;

@WebSocket
public class WebSocketHandler {

    private Session session;

    @OnWebSocketConnect
    public void onConnect(Session user) throws Exception {
        user.setIdleTimeout(0);
        session = user;
    }

    @OnWebSocketClose
    public void onClose(Session user, int statusCode, String reason) {
    }

    @OnWebSocketMessage
    public void onMessage(Session user, String message) {
        final ObjectMapper mapper = new ObjectMapper();
        ArrayList<String> itemList;
        message = message.substring(1, message.length() - 1);
        try {
            itemList = mapper.readValue(message.replace("\\", ""), ArrayList.class);
            Helper.getInstance().session = user;
            Helper.getInstance().amazonSearch(itemList);
            Helper.getInstance().setTotalPrice(0);

        } catch (IOException e) {
            e.printStackTrace();
            Helper.getInstance().sendHeadingBack("Error. Request was not parsed properly");
        }
        session.close();
    }


}

