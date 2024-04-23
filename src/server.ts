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
let usersScore = new Map<string, Map<string, number>>();
let usersData = new Map<string, Map<string, [string, string]>>();

// In-memory session store
const sessionStore = new Map();

const onlineUsers = new Set();

const usersNames = new Map();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);

  io.use((socket, next) => {
    const { name } = socket.handshake.query;

    const sessionID = socket.handshake.auth.sessionID;
    if (sessionID && sessionStore.has(sessionID)) {
      const session = sessionStore.get(sessionID);
      usersNames.set(session.userID, name);
      socket.sessionID = sessionID;
      socket.userID = session.userID;
    } else {
      const newSessionID = randomUUID();
      const newUserID = randomUUID();
      usersNames.set(newUserID, name);
      sessionStore.set(newSessionID, { userID: newUserID });
      socket.sessionID = newSessionID;
      socket.userID = newUserID;
    }
    next();
  });

  io.on("connection", (socket) => {
    const { name } = socket.handshake.query;
    console.log(`User ${name} connected`);

    socket.emit("your id", socket.id);
    socket.on("send message", (body) => {
      io.emit("message", body);
    });

    socket.on("join room", (room: string, userId: string) => {
      if (!allUsers.has(room)) {
        allUsers.set(room, []);
      }

      const usersInRoom = allUsers.get(room)!;
      if (usersInRoom.includes(userId)) {
        return;
      }
      usersInRoom.push(userId);
      socket.join(room);

      const rooms = ParsingRooms(allUsers);
      socket.emit("all rooms", rooms);
    });

    socket.on("leave room", (room: string, userId: string) => {
      if (allUsers.has(room)) {
        const usersInRoom = allUsers.get(room)!;
        const index = usersInRoom.indexOf(userId);
        if (index !== -1) {
          usersInRoom.splice(index, 1);
        }
      }
    });

    socket.on("create room", (roomName: string, userId: string) => {
      // Check if the room already exists
      if (!io.sockets.adapter.rooms.has(roomName)) {
        // Create the room
        socket.join(roomName);
        console.log(`Room "${roomName}" created`);
        allUsers.set(roomName, [userId]);

        const rooms = ParsingRooms(allUsers);
        socket.emit("all rooms", rooms);
        io.emit("room created", roomName);
      } else {
        console.log(`Room "${roomName}" already exists`);
        // Optionally, send an error message to the client
        socket.emit("error", "Room already exists");
      }
    });

    socket.on("get rooms", () => {
      const rooms = ParsingRooms(allUsers);
      socket.emit("all rooms", rooms);
    });

    socket.on("get users in room", (room) => {
      allUsers.get(room) || [];
    });

    socket.on("get room", (roomName: string) => {
      const users = allUsers.get(roomName) || [];
      io.to(roomName).emit("room users", users);
    });

    socket.on("get score", (roomName: string) => {
      console.log("Get Score receive");
      const room = allUsers.get(roomName) || [];
      if (!usersScore.get(roomName)) {
        const newMap = new Map<string, number>();
        usersScore.set(roomName, newMap);
      }
      const userScoreInRoom = usersScore.get(roomName)!;
      room.map((userId) => {
        let userScore = userScoreInRoom.get(userId);
        if (!userScore) {
          userScoreInRoom.set(userId, 0);
          userScore = 0;
        }
        return {
          userId: userId,
          score: userScore,
        };
      });
      type Users = {
        userId: string;
        score: number;
      }[];
      let users: Users = [];
      for (const [key, value] of usersScore.get(roomName)!) {
        users.push({
          userId: key,
          score: value,
        });
      }
      io.to(roomName).emit("users scores", users);
    });

    socket.on(
      "change score",
      (roomName: string, userId: string, score: number) => {
        console.log(userId, score);
        const room = allUsers.get(roomName) || [];
        if (!usersScore.get(roomName)) {
          const newMap = new Map<string, number>();
          usersScore.set(roomName, newMap);
        }
        if (!usersScore.get(roomName)!.get(userId)) {
          usersScore.get(roomName)!.set(userId, 0 + score);
        } else {
          usersScore.get(roomName)!.set(userId, score);
        }
        type Users = {
          userId: string;
          score: number;
        }[];
        let users: Users = [];
        for (const [key, value] of usersScore.get(roomName)!) {
          users.push({
            userId: key,
            score: value,
          });
        }
        io.to(roomName).emit("users scores", users);
      },
    );

    socket.on("get user data", (roomName: string) => {
      //   console.log("Get data receive");
      const room = allUsers.get(roomName) || [];
      if (!usersData.get(roomName)) {
        const newMap = new Map<string, [string, string]>();
        usersData.set(roomName, newMap);
      }
      const userDataInRoom = usersData.get(roomName)!;
      room.map((userId) => {
        let userData = userDataInRoom.get(userId);
        if (!userData) {
          userDataInRoom.set(userId, [
            userId,
            "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20120%20120%22%20fill%3D%22none%22%20shape-rendering%3D%22auto%22%20width%3D%22128%22%20height%3D%22128%22%3E%3Cmetadata%20xmlns%3Ardf%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%20xmlns%3Axsi%3D%22http%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema-instance%22%20xmlns%3Adc%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%22%20xmlns%3Adcterms%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F%22%3E%3Crdf%3ARDF%3E%3Crdf%3ADescription%3E%3Cdc%3Atitle%3EBottts%3C%2Fdc%3Atitle%3E%3Cdc%3Acreator%3EPablo%20Stanley%3C%2Fdc%3Acreator%3E%3Cdc%3Asource%20xsi%3Atype%3D%22dcterms%3AURI%22%3Ehttps%3A%2F%2Fbottts.com%2F%3C%2Fdc%3Asource%3E%3Cdcterms%3Alicense%20xsi%3Atype%3D%22dcterms%3AURI%22%3Ehttps%3A%2F%2Fbottts.com%2F%3C%2Fdcterms%3Alicense%3E%3Cdc%3Arights%3ERemix%20of%20%E2%80%9EBottts%E2%80%9D%20(https%3A%2F%2Fbottts.com%2F)%20by%20%E2%80%9EPablo%20Stanley%E2%80%9D%2C%20licensed%20under%20%E2%80%9EFree%20for%20personal%20and%20commercial%20use%E2%80%9D%20(https%3A%2F%2Fbottts.com%2F)%3C%2Fdc%3Arights%3E%3C%2Frdf%3ADescription%3E%3C%2Frdf%3ARDF%3E%3C%2Fmetadata%3E%3Cmask%20id%3D%22viewboxMask%22%3E%3Crect%20width%3D%22120%22%20height%3D%22120%22%20rx%3D%220%22%20ry%3D%220%22%20x%3D%220%22%20y%3D%220%22%20fill%3D%22%23fff%22%20%2F%3E%3C%2Fmask%3E%3Cg%20mask%3D%22url(%23viewboxMask)%22%3E%3Crect%20fill%3D%22%235e35b1%22%20width%3D%22120%22%20height%3D%22120%22%20x%3D%220%22%20y%3D%220%22%20%2F%3E%3Cg%20transform%3D%22translate(22%2068)%22%3E%3Cg%20fill%3D%22%23000%22%20fill-opacity%3D%22.6%22%3E%3Crect%20x%3D%2212%22%20y%3D%2212%22%20width%3D%224%22%20height%3D%228%22%20rx%3D%222%22%2F%3E%3Crect%20x%3D%2236%22%20y%3D%2212%22%20width%3D%224%22%20height%3D%228%22%20rx%3D%222%22%2F%3E%3Crect%20x%3D%2224%22%20y%3D%2212%22%20width%3D%224%22%20height%3D%228%22%20rx%3D%222%22%2F%3E%3Crect%20x%3D%2248%22%20y%3D%2212%22%20width%3D%224%22%20height%3D%228%22%20rx%3D%222%22%2F%3E%3Crect%20x%3D%2260%22%20y%3D%2212%22%20width%3D%224%22%20height%3D%228%22%20rx%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(8%2020)%22%3E%3Cpath%20d%3D%22M28%2044a20%2020%200%200%200%2019.9-18h41.52a5%205%200%201%200%200-4H47.9A20%2020%200%201%200%2028%2044Z%22%20fill%3D%22%23000%22%20fill-opacity%3D%22.2%22%2F%3E%3Ccircle%20cx%3D%2294%22%20cy%3D%2224%22%20r%3D%222%22%20fill%3D%22%23fff%22%2F%3E%3Ccircle%20cx%3D%2228%22%20cy%3D%2224%22%20r%3D%2216%22%20fill%3D%22%23000%22%20fill-opacity%3D%22.6%22%2F%3E%3Ccircle%20cx%3D%2234%22%20cy%3D%2216%22%20r%3D%223%22%20fill%3D%22%23fff%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E",
          ]);
          userData = [
            userId,
            "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20120%20120%22%20fill%3D%22none%22%20shape-rendering%3D%22auto%22%20width%3D%22128%22%20height%3D%22128%22%3E%3Cmetadata%20xmlns%3Ardf%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%20xmlns%3Axsi%3D%22http%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema-instance%22%20xmlns%3Adc%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%22%20xmlns%3Adcterms%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F%22%3E%3Crdf%3ARDF%3E%3Crdf%3ADescription%3E%3Cdc%3Atitle%3EBottts%3C%2Fdc%3Atitle%3E%3Cdc%3Acreator%3EPablo%20Stanley%3C%2Fdc%3Acreator%3E%3Cdc%3Asource%20xsi%3Atype%3D%22dcterms%3AURI%22%3Ehttps%3A%2F%2Fbottts.com%2F%3C%2Fdc%3Asource%3E%3Cdcterms%3Alicense%20xsi%3Atype%3D%22dcterms%3AURI%22%3Ehttps%3A%2F%2Fbottts.com%2F%3C%2Fdcterms%3Alicense%3E%3Cdc%3Arights%3ERemix%20of%20%E2%80%9EBottts%E2%80%9D%20(https%3A%2F%2Fbottts.com%2F)%20by%20%E2%80%9EPablo%20Stanley%E2%80%9D%2C%20licensed%20under%20%E2%80%9EFree%20for%20personal%20and%20commercial%20use%E2%80%9D%20(https%3A%2F%2Fbottts.com%2F)%3C%2Fdc%3Arights%3E%3C%2Frdf%3ADescription%3E%3C%2Frdf%3ARDF%3E%3C%2Fmetadata%3E%3Cmask%20id%3D%22viewboxMask%22%3E%3Crect%20width%3D%22120%22%20height%3D%22120%22%20rx%3D%220%22%20ry%3D%220%22%20x%3D%220%22%20y%3D%220%22%20fill%3D%22%23fff%22%20%2F%3E%3C%2Fmask%3E%3Cg%20mask%3D%22url(%23viewboxMask)%22%3E%3Crect%20fill%3D%22%235e35b1%22%20width%3D%22120%22%20height%3D%22120%22%20x%3D%220%22%20y%3D%220%22%20%2F%3E%3Cg%20transform%3D%22translate(22%2068)%22%3E%3Cg%20fill%3D%22%23000%22%20fill-opacity%3D%22.6%22%3E%3Crect%20x%3D%2212%22%20y%3D%2212%22%20width%3D%224%22%20height%3D%228%22%20rx%3D%222%22%2F%3E%3Crect%20x%3D%2236%22%20y%3D%2212%22%20width%3D%224%22%20height%3D%228%22%20rx%3D%222%22%2F%3E%3Crect%20x%3D%2224%22%20y%3D%2212%22%20width%3D%224%22%20height%3D%228%22%20rx%3D%222%22%2F%3E%3Crect%20x%3D%2248%22%20y%3D%2212%22%20width%3D%224%22%20height%3D%228%22%20rx%3D%222%22%2F%3E%3Crect%20x%3D%2260%22%20y%3D%2212%22%20width%3D%224%22%20height%3D%228%22%20rx%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(8%2020)%22%3E%3Cpath%20d%3D%22M28%2044a20%2020%200%200%200%2019.9-18h41.52a5%205%200%201%200%200-4H47.9A20%2020%200%201%200%2028%2044Z%22%20fill%3D%22%23000%22%20fill-opacity%3D%22.2%22%2F%3E%3Ccircle%20cx%3D%2294%22%20cy%3D%2224%22%20r%3D%222%22%20fill%3D%22%23fff%22%2F%3E%3Ccircle%20cx%3D%2228%22%20cy%3D%2224%22%20r%3D%2216%22%20fill%3D%22%23000%22%20fill-opacity%3D%22.6%22%2F%3E%3Ccircle%20cx%3D%2234%22%20cy%3D%2216%22%20r%3D%223%22%20fill%3D%22%23fff%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E",
          ];
        }
        return {
          userId: userId,
          name: userData[0],
          image: userData[1],
        };
      });
      type Users = {
        userId: string;
        name: string;
        image: string;
      }[];
      let users: Users = [];
      for (const [key, value] of usersData.get(roomName)!) {
        users.push({
          userId: key,
          name: value[0],
          image: value[1],
        });
      }
      io.to(roomName).emit("users datas", users);
    });

    socket.on(
      "set user data",
      (roomName: string, userId: string, name: string, image: string) => {
        console.log("Set user Image receive", userId, name, image.slice(0, 10));
        if (!usersData.get(roomName)) {
          const newMap = new Map<string, [string, string]>();
          usersData.set(roomName, newMap);
        }
        usersData.get(roomName)!.set(userId, [name, image]);
        const room = allUsers.get(roomName) || [];
        const userDataInRoom = usersData.get(roomName)!;
        room.map((uid) => {
          let userData = userDataInRoom.get(uid);
          if (!userData) {
            userDataInRoom.set(userId, [
              userId,
              "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20120%20120%22%20fill%3D%22none%22%20shape-rendering%3D%22auto%22%20width%3D%22128%22%20height%3D%22128%22%3E%3Cmetadata%20xmlns%3Ardf%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%20xmlns%3Axsi%3D%22http%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema-instance%22%20xmlns%3Adc%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%22%20xmlns%3Adcterms%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F%22%3E%3Crdf%3ARDF%3E%3Crdf%3ADescription%3E%3Cdc%3Atitle%3EBottts%3C%2Fdc%3Atitle%3E%3Cdc%3Acreator%3EPablo%20Stanley%3C%2Fdc%3Acreator%3E%3Cdc%3Asource%20xsi%3Atype%3D%22dcterms%3AURI%22%3Ehttps%3A%2F%2Fbottts.com%2F%3C%2Fdc%3Asource%3E%3Cdcterms%3Alicense%20xsi%3Atype%3D%22dcterms%3AURI%22%3Ehttps%3A%2F%2Fbottts.com%2F%3C%2Fdcterms%3Alicense%3E%3Cdc%3Arights%3ERemix%20of%20%E2%80%9EBottts%E2%80%9D%20(https%3A%2F%2Fbottts.com%2F)%20by%20%E2%80%9EPablo%20Stanley%E2%80%9D%2C%20licensed%20under%20%E2%80%9EFree%20for%20personal%20and%20commercial%20use%E2%80%9D%20(https%3A%2F%2Fbottts.com%2F)%3C%2Fdc%3Arights%3E%3C%2Frdf%3ADescription%3E%3C%2Frdf%3ARDF%3E%3C%2Fmetadata%3E%3Cmask%20id%3D%22viewboxMask%22%3E%3Crect%20width%3D%22120%22%20height%3D%22120%22%20rx%3D%220%22%20ry%3D%220%22%20x%3D%220%22%20y%3D%220%22%20fill%3D%22%23fff%22%20%2F%3E%3C%2Fmask%3E%3Cg%20mask%3D%22url(%23viewboxMask)%22%3E%3Crect%20fill%3D%22%235e35b1%22%20width%3D%22120%22%20height%3D%22120%22%20x%3D%220%22%20y%3D%220%22%20%2F%3E%3Cg%20transform%3D%22translate(22%2068)%22%3E%3Cg%20fill%3D%22%23000%22%20fill-opacity%3D%22.6%22%3E%3Crect%20x%3D%2212%22%20y%3D%2212%22%20width%3D%224%22%20height%3D%228%22%20rx%3D%222%22%2F%3E%3Crect%20x%3D%2236%22%20y%3D%2212%22%20width%3D%224%22%20height%3D%228%22%20rx%3D%222%22%2F%3E%3Crect%20x%3D%2224%22%20y%3D%2212%22%20width%3D%224%22%20height%3D%228%22%20rx%3D%222%22%2F%3E%3Crect%20x%3D%2248%22%20y%3D%2212%22%20width%3D%224%22%20height%3D%228%22%20rx%3D%222%22%2F%3E%3Crect%20x%3D%2260%22%20y%3D%2212%22%20width%3D%224%22%20height%3D%228%22%20rx%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(8%2020)%22%3E%3Cpath%20d%3D%22M28%2044a20%2020%200%200%200%2019.9-18h41.52a5%205%200%201%200%200-4H47.9A20%2020%200%201%200%2028%2044Z%22%20fill%3D%22%23000%22%20fill-opacity%3D%22.2%22%2F%3E%3Ccircle%20cx%3D%2294%22%20cy%3D%2224%22%20r%3D%222%22%20fill%3D%22%23fff%22%2F%3E%3Ccircle%20cx%3D%2228%22%20cy%3D%2224%22%20r%3D%2216%22%20fill%3D%22%23000%22%20fill-opacity%3D%22.6%22%2F%3E%3Ccircle%20cx%3D%2234%22%20cy%3D%2216%22%20r%3D%223%22%20fill%3D%22%23fff%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E",
            ]);
            userData = [
              userId,
              "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20120%20120%22%20fill%3D%22none%22%20shape-rendering%3D%22auto%22%20width%3D%22128%22%20height%3D%22128%22%3E%3Cmetadata%20xmlns%3Ardf%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%20xmlns%3Axsi%3D%22http%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema-instance%22%20xmlns%3Adc%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%22%20xmlns%3Adcterms%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F%22%3E%3Crdf%3ARDF%3E%3Crdf%3ADescription%3E%3Cdc%3Atitle%3EBottts%3C%2Fdc%3Atitle%3E%3Cdc%3Acreator%3EPablo%20Stanley%3C%2Fdc%3Acreator%3E%3Cdc%3Asource%20xsi%3Atype%3D%22dcterms%3AURI%22%3Ehttps%3A%2F%2Fbottts.com%2F%3C%2Fdc%3Asource%3E%3Cdcterms%3Alicense%20xsi%3Atype%3D%22dcterms%3AURI%22%3Ehttps%3A%2F%2Fbottts.com%2F%3C%2Fdcterms%3Alicense%3E%3Cdc%3Arights%3ERemix%20of%20%E2%80%9EBottts%E2%80%9D%20(https%3A%2F%2Fbottts.com%2F)%20by%20%E2%80%9EPablo%20Stanley%E2%80%9D%2C%20licensed%20under%20%E2%80%9EFree%20for%20personal%20and%20commercial%20use%E2%80%9D%20(https%3A%2F%2Fbottts.com%2F)%3C%2Fdc%3Arights%3E%3C%2Frdf%3ADescription%3E%3C%2Frdf%3ARDF%3E%3C%2Fmetadata%3E%3Cmask%20id%3D%22viewboxMask%22%3E%3Crect%20width%3D%22120%22%20height%3D%22120%22%20rx%3D%220%22%20ry%3D%220%22%20x%3D%220%22%20y%3D%220%22%20fill%3D%22%23fff%22%20%2F%3E%3C%2Fmask%3E%3Cg%20mask%3D%22url(%23viewboxMask)%22%3E%3Crect%20fill%3D%22%235e35b1%22%20width%3D%22120%22%20height%3D%22120%22%20x%3D%220%22%20y%3D%220%22%20%2F%3E%3Cg%20transform%3D%22translate(22%2068)%22%3E%3Cg%20fill%3D%22%23000%22%20fill-opacity%3D%22.6%22%3E%3Crect%20x%3D%2212%22%20y%3D%2212%22%20width%3D%224%22%20height%3D%228%22%20rx%3D%222%22%2F%3E%3Crect%20x%3D%2236%22%20y%3D%2212%22%20width%3D%224%22%20height%3D%228%22%20rx%3D%222%22%2F%3E%3Crect%20x%3D%2224%22%20y%3D%2212%22%20width%3D%224%22%20height%3D%228%22%20rx%3D%222%22%2F%3E%3Crect%20x%3D%2248%22%20y%3D%2212%22%20width%3D%224%22%20height%3D%228%22%20rx%3D%222%22%2F%3E%3Crect%20x%3D%2260%22%20y%3D%2212%22%20width%3D%224%22%20height%3D%228%22%20rx%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(8%2020)%22%3E%3Cpath%20d%3D%22M28%2044a20%2020%200%200%200%2019.9-18h41.52a5%205%200%201%200%200-4H47.9A20%2020%200%201%200%2028%2044Z%22%20fill%3D%22%23000%22%20fill-opacity%3D%22.2%22%2F%3E%3Ccircle%20cx%3D%2294%22%20cy%3D%2224%22%20r%3D%222%22%20fill%3D%22%23fff%22%2F%3E%3Ccircle%20cx%3D%2228%22%20cy%3D%2224%22%20r%3D%2216%22%20fill%3D%22%23000%22%20fill-opacity%3D%22.6%22%2F%3E%3Ccircle%20cx%3D%2234%22%20cy%3D%2216%22%20r%3D%223%22%20fill%3D%22%23fff%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E",
            ];
          }
          console.log(uid, userData);
          return {
            userId: uid,
            name: userData[0],
            image: userData[1],
          };
        });

        type Users = {
          userId: string;
          name: string;
          image: string;
        }[];
        let users: Users = [];
        for (const [key, value] of usersData.get(roomName)!) {
          users.push({
            userId: key,
            name: value[0],
            image: value[1],
          });
        }
        io.to(roomName).emit("users datas", users);
      },
    );

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
      (avatar: string, username: string, content: string, room: string) => {
        const message = {
          content: content,
          from: {
            username: username,
            avatar: avatar,
          },
          room: room,
          id: randomUUID(),
        };
        console.log(message);
        io.to(room).emit("group message", message);
      },
    );

    onlineUsers.add(socket.userID);
    io.emit("onlineUsers", {
      users: Array.from(onlineUsers),
      names: Array.from(usersNames),
    });
    socket.join(socket.userID);
    socket.emit("session", {
      name: name,
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
