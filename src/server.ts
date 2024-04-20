import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { FetchSongPlaylist, RandomSong } from "./utils/randomSong";
import { TrackDetail } from "./app/songguessr/type";
import { ParsingRooms } from "./utils/parsingRoomDetail";
import { randomUUID } from "node:crypto";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

let songList: TrackDetail[] = [];
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();
let allUsers = new Map<string, string[]>();
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
    
    socket.on("join room", (room) => {
      if (!allUsers.has(room)) {
        allUsers.set(room, []);
      }
  
      const usersInRoom = allUsers.get(room)!;
      if (usersInRoom.includes(socket.id)) {
          return;
      }
      usersInRoom.push(socket.id);
      socket.join(room);
      
      const rooms = ParsingRooms(allUsers);
      socket.emit("all rooms", rooms);
    })

    socket.on('leave room', (room: string) => {
      if (allUsers.has(room)) {
          const usersInRoom = allUsers.get(room)!;
          const index = usersInRoom.indexOf(socket.id);
          if (index !== -1) {
              usersInRoom.splice(index, 1);
          }
      }
    });

    socket.on('create room', (roomName: string) => {
      // Check if the room already exists
      if (!io.sockets.adapter.rooms.has(roomName)) {
          // Create the room
          socket.join(roomName);
          console.log(`Room "${roomName}" created`);
          allUsers.set(roomName, [socket.id]);

          const rooms = ParsingRooms(allUsers);
          socket.emit("all rooms", rooms);
          io.emit('room created', roomName);
      } else {
          console.log(`Room "${roomName}" already exists`);
          // Optionally, send an error message to the client
          socket.emit('error', 'Room already exists');
      }
  });

    socket.on("get rooms", () => {
      const rooms = ParsingRooms(allUsers);
      socket.emit("all rooms", rooms);
    })

    socket.on("send group message", ({room, message}) => {
      io.to(room).emit("message", message)
    })

    socket.on("get users in room", (room) => {
      allUsers.get(room) || []
    })

		socket.on("start game", async (playlist, room) => {
			songList = await FetchSongPlaylist(playlist);
			const { song, choices } = RandomSong(songList);

			io.to(room).emit("game started");
			io.to(room).emit("song", song);
			io.to(room).emit("choices", choices);
		});

		socket.on("send time target", (targetTime, room) => {
			io.to(room).emit("time target", targetTime);
		});

		socket.on("send song", (room) => {
			const { song, choices } = RandomSong(songList);
			io.to(room).emit("song", song);
			io.to(room).emit("choices", choices);
		});

		socket.on(
			"send group message", 
			(content:string, room:string) => {
				const message = {
					content: content,
					from: socket.id,
					room: room,
					id: randomUUID(),
				};
				console.log(message)
				io.to(room).emit("group message", message);
			},
		);

		onlineUsers.add(socket.userID);
		io.emit("onlineUsers", Array.from(onlineUsers));
		socket.join(socket.userID);
		socket.emit("session", {
			sessionID: socket.sessionID,
			userID: socket.userID,
		});

		socket.on(
			"private message",
			(arg: { content: string; to: string; from: string }) => {
				const message = {
					content: arg.content,
					from: socket.userID,
					to: arg.to,
					id: randomUUID(),
				};
				io.emit("private message", message);
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
