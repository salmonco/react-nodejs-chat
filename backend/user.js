// user : { id, name, room }
let users = []; // [{ id, name, room }, { id, name, room }]

const addUser = ({ id, name, room }) => {
  const user = { id, name, room };

  users.push(user);

  return user;
};

const removeUser = (id) => {
  const user = users.find((user) => user.id === id);

  users.splice(users.indexOf(user), 1);

  return user;
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
