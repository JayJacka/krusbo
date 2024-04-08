import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import RandomSong from "./utils/randomSong";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();
// eslint-disable-next-line @typescript-eslint/no-floating-promises
app.prepare().then(async() => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const httpServer = createServer(handler);
  const io = new Server(httpServer);
  io.on("connection", socket => {
    socket.emit("your id", socket.id);
    socket.on("send message", body => {
      io.emit("message", body)
    })

    socket.on("start game", body => {
      io.emit("game started", body)
    })

    socket.on("send time target", body => {
      io.emit("time target", body)
    })

    socket.on("send song", async () => {
      const {song, choices} = await RandomSong();
      io.emit("song", song)
      io.emit("choices", choices)
    })
  })

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});