import React, { useState } from "react";
import { Link } from "react-router-dom";

const Join = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  return (
    <div>
      <div>
        <h1>채팅방</h1>
        <div>
          <input
            placeholder="이름"
            type="text"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <input
            placeholder="채팅방"
            type="text"
            onChange={(e) => setRoom(e.target.value)}
          />
        </div>
        <Link
          to="/chat"
          state={{ name, room }}
          onClick={(e) => (!name || !room ? e.preventDefault() : null)}
        >
          <button type="button">가입</button>
        </Link>
      </div>
    </div>
  );
};

export default Join;
