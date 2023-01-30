import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { SocketContext } from "../context/socket";

const Chat = () => {
  const socket = useContext(SocketContext);
  const [userName, setUserName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [createDate, setCreateDate] = useState("");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const { userName, roomId } = location.state;

    setUserName(userName);

    socket.emit("joinRoom", { userName, roomId });

    socket.once(
      "roomData",
      ({ roomId, roomName, capacity, createDate, users }) => {
        setRoomId(roomId);
        setRoomName(roomName);
        setCapacity(capacity);
        setCreateDate(createDate);
        setUsers(users);

        socket.on("roomData", ({ users }) => {
          setUsers(users);
        });
      }
    );

    socket.on("message", ({ userName, text }) => {
      setMessages((prev) => [...prev, `${userName} : ${text}`]);
    });

    return () => {
      socket.emit("leaveRoom");
      socket.off("roomData");
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    if (message) {
      socket.emit("sendMessage", { message });
      setMessage("");
    }
  };

  return (
    <>
      <p>닉네임: {userName}</p>
      <p>채팅방: {roomName}</p>
      <p>채팅방id: {roomId}</p>
      <p>개설일: {createDate}</p>
      <p>
        인원: {users.length} / {capacity}
      </p>
      <p>현재 채팅방에 있는 사람</p>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user.userName}</li>
        ))}
      </ul>
      <p>채팅하기</p>
      <div>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="button" onClick={sendMessage}>
        전송
      </button>
    </>
  );
};

export default Chat;
