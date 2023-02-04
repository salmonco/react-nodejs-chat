const express = require("express");
const app = express();

const PORT = process.env.PORT || 5000;

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

const router = require("./router");
app.use(router);

const uuid4 = require("uuid4");

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  getUsers,
} = require("./user.js");
const { addRoom, removeRoom, getRoom, getRooms } = require("./room.js");

io.on("connection", (socket) => {
  console.log("connection");

  socket.on("enterLobby", () => {
    let remove = [];
    getRooms().forEach((room) => {
      if (!getUsersInRoom(room.roomId).length) {
        remove.push(room.roomId);
      }
    });
    remove.forEach((roomId) => removeRoom(roomId));

    const rooms = getRooms();
    const cntArr = rooms.map((room) => getUsersInRoom(room.roomId).length);

    socket.emit("roomList", { rooms, cntArr });
  });

  socket.on("addRoom", ({ roomName, capacity }) => {
    const room = addRoom({
      roomId: uuid4(),
      roomName,
      capacity,
      createDate: new Date().toLocaleString(),
    });
    // console.log("addRoom", room);
    if (room) {
      socket.emit("roomId", { roomId: room.roomId });
    }
  });

  socket.on("joinRoom", ({ userName, roomId }) => {
    const user = addUser({ userId: socket.id, userName, roomId });
    const room = getRoom(roomId);
    // console.log("joinRoom", user, room);
    if (user && room) {
      socket.join(roomId);

      socket.emit("message", {
        userName: "admin",
        text: `${userName}님, ${room.roomName}방에 오신것을 환영합니다.`,
      });

      socket.broadcast.to(roomId).emit("message", {
        userName: "admin",
        text: `${userName}님이 들어왔습니다.`,
      });
      // console.log("getUsersInRoom(roomId)", getUsersInRoom(roomId));
      io.to(roomId).emit("roomData", {
        roomId,
        roomName: room.roomName,
        capacity: room.capacity,
        createDate: room.createDate,
        users: getUsersInRoom(roomId),
      });
    }
  });

  socket.on("sendMessage", ({ message }) => {
    const user = getUser(socket.id);
    // console.log("sendMessage", user);
    if (user) {
      io.to(user.roomId).emit("message", {
        userName: user.userName,
        text: message,
      });
    }
  });

  const leaveRoomHandler = () => {
    console.log("leave");
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.roomId).emit("message", {
        userName: "admin",
        text: `${user.userName}님이 나갔습니다.`,
      });

      io.to(user.roomId).emit("roomData", {
        users: getUsersInRoom(user.roomId),
      });
    }
  };

  socket.on("leaveRoom", leaveRoomHandler);
  socket.on("disconnect", leaveRoomHandler);
});

server.listen(PORT, () => {
  console.log("listening on %d", PORT);
});
