const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const config = require("config");
const morgan = require("morgan");
const cors = require("cors");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const connect = require("./utils/connect");
const logger = require("./utils/logger");
const routes = require("./routes");
const deserializeUser = require("./middlewares/deserializeUser");
const { version } = require("../package.json");

const port = config.get("port");

const app = express();

const http = require("http");

const { Server } = require("socket.io");

app.use(
  cors({
    credentials: true,
    origin: config.get("origin"),
  })
);

app.use(cookieParser());

app.use(deserializeUser);

app.use(morgan("dev"));

app.use(express.json({ limit: "2mb" }));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: config.get("origin"),
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.broadcast.emit("connected", {
    success: true,
    message: "server is up and running",
  });
  console.log("User connected: ", socket.id);
  app.set("socket", socket);
});

server.listen(port, async () => {
  logger.info(`App v${version} running at ${config.get("socketHost")}:${port}`);
  await connect();

  routes(app);
});
