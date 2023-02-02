import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/socket";
import Container from "../component/Container";
import Intro from "../component/Intro";
import NameInput from "../component/NameInput";
import Box from "../component/Box";
import Item from "../component/Item";
import RoomInput from "../component/RoomInput";

const Join = () => {
  const socket = useContext(SocketContext);
  const [userName, setUserName] = useState("");
  const [roomList, setRoomList] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [capacity, setCapacity] = useState("8");
  const [cntArr, setCntArr] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit("enterLobby");

    socket.on("roomList", ({ rooms, cntArr }) => {
      setRoomList(rooms);
      setCntArr(cntArr);
    });

    return () => socket.off("roomList");
  }, []);

  const addRoom = () => {
    socket.emit("addRoom", { roomName, capacity });

    socket.on("roomId", ({ roomId }) => {
      navigate("/chat", {
        state: { userName, roomId },
      });
    });
  };

  const joinRoom = (roomId) => {
    navigate("/chat", {
      state: { userName, roomId },
    });
  };

  return (
    <>
      <Container>
        <NameInput
          placeholder="닉네임을 입력해주세요."
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          maxLength="15"
        />
        <Intro>채팅방 목록</Intro>
        <Box>
          {!roomList.length ? (
            <p style={{ textAlign: "center" }}>개설된 채팅방이 없습니다.</p>
          ) : (
            roomList.map((room, index) => (
              <Item
                key={index}
                onClick={(e) =>
                  !userName || cntArr[index] >= room.capacity
                    ? e.preventDefault()
                    : joinRoom(room.roomId)
                }
              >
                <p style={{ margin: "0 0 6px 0", fontWeight: "bold" }}>
                  {room.roomName}
                </p>
                <span>{room.createDate}</span>
                <span style={{ float: "right" }}>
                  {cntArr[index]} / {room.capacity}
                </span>
              </Item>
            ))
          )}
        </Box>
        <Intro>방 개설하기</Intro>
        <Box>
          <RoomInput
            placeholder="채팅방 이름을 입력해주세요."
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            maxLength="30"
          />
          <div style={{ float: "right" }}>
            <select
              style={{ marginRight: "10px" }}
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            >
              <option value="2">2명</option>
              <option value="4">4명</option>
              <option value="6">6명</option>
              <option value="8">8명</option>
            </select>
            <button
              type="button"
              onClick={(e) =>
                !userName || !roomName ? e.preventDefault() : addRoom()
              }
            >
              입장
            </button>
          </div>
        </Box>
      </Container>
    </>
  );
};

export default Join;
