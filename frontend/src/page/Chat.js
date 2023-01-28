import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";

let socket;

const Chat = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const { name, room } = location.state;

    setRoom(room);
    setName(name);

    socket = io(ENDPOINT);

    socket.emit("join", { name, room });

    socket.on("message", ({ user, text }) => {
      setMessages((prev) => [...prev, `${user} : ${text}`]);
    });

    // 다른 사람이 방에 들어와야 그때서야 반영되는 문제가 있음
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });

    return () => socket.disconnect();
  }, []);

  const sendMessage = () => {
    if (message) {
      socket.emit("sendMessage", message);
      setMessage("");
    }
  };

  return (
    <>
      <p>이름: {name}</p>
      <p>채팅방: {room}</p>
      <p>현재 채팅방에 있는 사람</p>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user.name}</li>
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
