const { getFirestore } = require("firebase-admin/firestore");
const uuid4 = require("uuid4");

const db = getFirestore();
const chatsRef = db.collection("chat");
const usersRef = db.collection("user");
const roomsRef = db.collection("room");
/* chat : { userName, text, date, roomId } */
/* user : { userId, userName, roomId } */
/* room : { roomId, roomName, capacity, createDate } */

const getChatsInRoom = async (roomId) => {
  const chats = [];
  const chatsSnapshot = await chatsRef.get();

  chatsSnapshot.docs.forEach((chatRef) => {
    if (chatRef.data().roomId === roomId) {
      chats.push(chatRef.data());
    }
  });

  return chats;
};

const getUsersInRoom = async (roomId) => {
  const users = [];
  const usersSnapshot = await usersRef.get();

  usersSnapshot.docs.forEach((userRef) => {
    if (userRef.data().roomId === roomId) {
      users.push(userRef.data());
    }
  });

  return users;
};

const eventHandler = (io, socket) => {
  console.log("connection");

  socket.on("enterLobby", async () => {
    try {
      const rooms = [];
      const cntArr = [];
      const roomsSnapshot = await roomsRef.get();

      for (let roomRef of roomsSnapshot.docs) {
        const { roomId } = roomRef.data();
        const users = await getUsersInRoom(roomId);

        if (!users.length) {
          // 방 인원수가 0이 되면 방과 방에 속한 유저들 제거
          roomRef.ref.delete();
          const usersSnapshot = await usersRef
            .where("roomId", "==", roomId)
            .get();
          usersSnapshot.docs.forEach((userRef) => userRef.ref.delete());
        } else {
          rooms.push(roomRef.data());
          cntArr.push(users.length);
        }
      }

      socket.emit("roomList", { rooms, cntArr });
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("addRoom", async ({ roomName, capacity }) => {
    try {
      const uniqueRoomId = uuid4();

      await roomsRef.add({
        roomId: uniqueRoomId,
        roomName,
        capacity,
        createDate: new Date().toLocaleString(),
      });

      socket.emit("roomId", { roomId: uniqueRoomId });
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("joinRoom", async ({ userName, roomId }) => {
    try {
      await usersRef.add({ userId: socket.id, userName, roomId });

      const roomSnapshot = await roomsRef.where("roomId", "==", roomId).get();
      const roomRef = roomSnapshot.docs[0];
      const { roomName, capacity, createDate } = roomRef.data();

      socket.join(roomId);

      const welcomeMsg = {
        userName: "admin",
        text: `${userName}님, ${roomName}방에 오신것을 환영합니다.`,
        date: new Date().toISOString(),
        roomId,
      };
      const joinMsg = {
        userName: "admin",
        text: `${userName}님이 들어왔습니다.`,
        date: new Date().toISOString(),
        roomId,
      };

      // await chatsRef.add(welcomeMsg);
      await chatsRef.add(joinMsg);

      socket.emit("message", welcomeMsg);
      socket.broadcast.to(roomId).emit("message", joinMsg);

      io.to(roomId).emit("roomData", {
        roomId,
        roomName,
        capacity,
        createDate,
        chats: await getChatsInRoom(roomId),
        users: await getUsersInRoom(roomId),
      });
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("sendMessage", async ({ message }) => {
    try {
      const userSnapshot = await usersRef
        .where("userId", "==", socket.id)
        .get();
      const userRef = userSnapshot.docs[0];
      const { roomId, userName } = userRef.data();
      const msg = {
        userName,
        text: message,
        date: new Date().toISOString(),
        roomId,
      };

      await chatsRef.add(msg);

      io.to(roomId).emit("message", msg);
    } catch (e) {
      console.log(e);
    }
  });

  const leaveRoomHandler = async () => {
    try {
      console.log("leave");

      const userSnapshot = await usersRef
        .where("userId", "==", socket.id)
        .get();
      const userRef = userSnapshot.docs[0];

      if (userRef) {
        const { roomId, userName } = userRef.data();

        userSnapshot.forEach((doc) => {
          doc.ref.delete();
        });

        const leaveMsg = {
          userName: "admin",
          text: `${userName}님이 나갔습니다.`,
          date: new Date().toISOString(),
          roomId,
        };

        await chatsRef.add(leaveMsg);

        io.to(roomId).emit("message", leaveMsg);

        io.to(roomId).emit("roomData", {
          users: await getUsersInRoom(roomId),
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  socket.on("leaveRoom", leaveRoomHandler);
  socket.on("disconnect", leaveRoomHandler);
};

module.exports = eventHandler;
