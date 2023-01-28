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

const { addUser, removeUser, getUser, getUsersInRoom } = require("./user.js");

io.on("connection", (socket) => {
  console.log("connection");

  socket.on("join", ({ name, room }) => {
    console.log(name, room);

    const user = addUser({ id: socket.id, name, room });

    if (user) {
      socket.join(user.room);

      socket.emit("message", {
        user: "admin",
        text: `${user.name}님, ${user.room}에 오신것을 환영합니다.`,
      });

      socket.broadcast.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} 님이 입장하였습니다.`,
      });

      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });

  socket.on("sendMessage", (message) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: message });
  });

  socket.on("disconnect", () => {
    console.log("disconnect");

    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name}님이 퇴장하였습니다.`,
      });

      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

server.listen(PORT, () => {
  console.log("listening on %d", PORT);
});
