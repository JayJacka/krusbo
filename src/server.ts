import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import {FetchSongPlaylist,RandomSong} from "./utils/randomSong";
import { TrackDetail } from "./app/songguessr/type";
import { randomUUID } from "node:crypto";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

let songList: TrackDetail[] = [];
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

// In-memory session store
const sessionStore = new Map();

const onlineUsers = new Set();

app.prepare().then(() => {
	const httpServer = createServer(handler);
	const io = new Server(httpServer);

	io.use((socket, next) => {
		const sessionID = socket.handshake.auth.sessionID;
		if (sessionID && sessionStore.has(sessionID)) {
			const session = sessionStore.get(sessionID);
			socket.sessionID = sessionID;
			socket.userID = session.userID;
		} else {
			const newSessionID = randomUUID();
			const newUserID = randomUUID();
			sessionStore.set(newSessionID, { userID: newUserID });
			socket.sessionID = newSessionID;
			socket.userID = newUserID;
		}
		next();
	});

  io.on("connection", (socket) => {
    socket.emit("your id", socket.id);
    socket.on("send message", body => {
      io.emit("message", body)
    })

    socket.on("start game", async (body) => {
      songList = await FetchSongPlaylist(body);
      const {song, choices} = RandomSong(songList);

      io.emit("game started")
      io.emit("song", song)
      io.emit("choices", choices)
    })

    socket.on("send time target", (body) => {
      io.emit("time target", body)
    })

    socket.on("send song", () => {
      const {song, choices} = RandomSong(songList);
      io.emit("song", song)
      io.emit("choices", choices)
    })
  })
	io.on("connection", (socket) => {
		onlineUsers.add(socket.userID);
		io.emit("onlineUsers", Array.from(onlineUsers));

		socket.emit("session", {
			sessionID: socket.sessionID,
			userID: socket.userID,
		});

		socket.on("send message", (arg) => {
			io.emit("message", arg);
		});

		socket.on(
			"private message",
			(arg: { content: string; to: string; from: string }) => {
				socket.to(arg.to).emit("private message", arg);
			},
		);

		socket.on("disconnect", () => {
			onlineUsers.delete(socket.userID);
			io.emit("onlineUsers", Array.from(onlineUsers));
		});
	});

	httpServer.once("error", (err) => {
		console.error(err);
		process.exit(1);
	});

	httpServer.listen(port, () => {
		console.log(`> Ready on http://${hostname}:${port}`);
	});
});
