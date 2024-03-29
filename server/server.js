const express = require("express");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

const server = () => {
  const app = express();
  const PORT = process.env.PORT || 5000;
  const server = require("http").createServer(app);
  const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  // app.use(
  //   express.urlencoded({
  //     extended: true,
  //   })
  // );
  // app.use(express.json());

  // app.use("/", require("./routes"));

  io.on("connection", (socket) => {
    require("./routes/chat")(io, socket);
  });

  server.listen(PORT, () => {
    console.log("listening on %d", PORT);
  });

  app.get("/", () => {
    res.send("hello world");
  });
};

server();
