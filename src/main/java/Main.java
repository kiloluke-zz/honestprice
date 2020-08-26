import static spark.Spark.*;

public class Main {
    public static void main(String[] args) {
        ProcessBuilder process = new ProcessBuilder();
        Integer port;
        if (process.environment().get("PORT") != null) {
            port = Integer.parseInt(process.environment().get("PORT"));
        } else {
            port = 4567;
        }

        port(port);

        Helper helper = Helper.getInstance();
        staticFileLocation("/public");
        webSocket("/main", WebSocketHandler.class);
        get("/", (req, res) -> helper.renderContent("public/index.html"));
        get("/contact", (req, res) -> helper.renderContent("public/contact.html"));

    }

}
