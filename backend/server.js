const express = require("express");
const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

app.use(express.static("../frontend/build"));

io.on("connection", (socket) => {
  console.log("소켓 커넥션 발생");

  socket.on("message", (message) => {
    console.log(message);

    io.emit("message", message);
  });
});

server.listen(5000, () => {
  console.log("listening on 5000");
});

app.get("*", (req, res) => {
  res.sendFile("index.html");
});
