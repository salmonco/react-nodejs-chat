import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/socket";

const Join = () => {
  const socket = useContext(SocketContext);
  const [userName, setUserName] = useState("");
  const [roomList, setRoomList] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [capacity, setCapacity] = useState("8");
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit("enterLobby");

    socket.on("roomList", (rooms) => {
      setRoomList(rooms);
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

  // 현재 인원수 고려해야 함
  const joinRoom = (roomId) => {
    navigate("/chat", {
      state: { userName, roomId },
    });
  };

  return (
    <div>
      <div>
        <div>
          <input
            placeholder="닉네임을 입력해주세요."
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <p>채팅방 목록</p>
        <ul>
          {roomList.map((room, index) => (
            <li
              key={index}
              onClick={(e) =>
                !userName ? e.preventDefault() : joinRoom(room.roomId)
              }
            >
              {room.roomName} / {room.createDate} / {room.capacity}
            </li>
          ))}
        </ul>
        <div>
          <input
            placeholder="채팅방 이름을 입력해주세요."
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <select
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
      </div>
    </div>
  );
};

export default Join;
