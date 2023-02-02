import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { SocketContext } from "../context/socket";
import Container from "../component/Container";
import Intro from "../component/Intro";
import Box from "../component/Box";
import ChatBox from "../component/ChatBox";
import { Message, AdminMessage, MyMessage } from "../component/Message";
import Wrapper from "../component/Wrapper";
import ChatInput from "../component/ChatInput";
import SendBtn from "../component/SendBtn";
import User from "../component/User";

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
      setMessages((prev) => [...prev, { userName, text }]);
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
      <Container>
        <Box>닉네임: {userName}</Box>
        <Wrapper>
          <Intro>{roomName}</Intro>
          <span style={{ fontSize: "12px" }}>개설일: {createDate}</span>
        </Wrapper>
        <ChatBox>
          <div style={{ padding: "5px 15px 0 15px" }}>
            {messages.map((item, index) => (
              <div style={{ margin: "15px 0" }} key={index}>
                {item.userName === "admin" ? (
                  <AdminMessage text={item.text} />
                ) : item.userName === userName ? (
                  <MyMessage text={item.text} />
                ) : (
                  <Message userName={item.userName} text={item.text} />
                )}
              </div>
            ))}
          </div>
          <div style={{ background: "#ffffff" }}>
            <Wrapper>
              <ChatInput
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <SendBtn type="button" onClick={sendMessage}>
                전송
              </SendBtn>
            </Wrapper>
          </div>
        </ChatBox>
        <Wrapper>
          <Intro>현재 채팅방에 있는 사람</Intro>
          <span>
            {users.length} / {capacity}
          </span>
        </Wrapper>
        {users.map((user, index) => (
          <User key={index}>{user.userName}</User>
        ))}
      </Container>
    </>
  );
};

export default Chat;
