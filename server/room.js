/* room : { roomId, roomName, capacity, createDate } */
let rooms = [];

const addRoom = ({ roomId, roomName, capacity, createDate }) => {
  const room = { roomId, roomName, capacity, createDate };

  rooms.push(room);

  return room;
};

const removeRoom = (roomId) => {
  const room = rooms.find((room) => room.roomId === roomId);

  rooms.splice(rooms.indexOf(room), 1);

  return room;
};

const getRoom = (roomId) => rooms.find((room) => room.roomId === roomId);

const getRooms = () => rooms;

module.exports = { addRoom, removeRoom, getRoom, getRooms };
