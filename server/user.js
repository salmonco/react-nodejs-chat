/* user : { userId, userName, roomId } */
let users = [];

const addUser = ({ userId, userName, roomId }) => {
  const user = { userId, userName, roomId };

  users.push(user);

  return user;
};

const removeUser = (userId) => {
  const user = users.find((user) => user.userId === userId);

  users.splice(users.indexOf(user), 1);

  return user;
};

const getUser = (userId) => users.find((user) => user.userId === userId);

const getUsersInRoom = (roomId) =>
  users.filter((user) => user.roomId === roomId);

const getUsers = () => users;

module.exports = { addUser, removeUser, getUser, getUsersInRoom, getUsers };
