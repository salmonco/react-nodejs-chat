import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("localhost:5000");

const Chat = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    socket.on("message", (message) => {
      setChatList((prev) => [...prev, message]);
    });
  }, []);

  const sendMessage = () => {
    socket.emit("message", `${name} : ${message}`);
    setMessage("");
  };

  return (
    <>
      <span>이름: </span>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div>
        <p>채팅하기</p>
        <ul>
          {chatList.map((chat, index) => (
            <li key={index}>{chat}</li>
          ))}
        </ul>
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>전송</button>
    </>
  );
};

export default Chat;
