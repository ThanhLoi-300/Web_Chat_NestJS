const socketIO = require("socket.io");
const http = require("http");
const express = require("express");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

require("dotenv").config({
  path: "./.env",
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world from socket server!");
});

let users = [];

const addUser = (userId, socketId) => {
  const existingUser = users.find((user) => user.userId === userId);
  if (!existingUser) users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (receiverId) => {
  return users.find((u) => u.userId === receiverId);
};

io.on("connection", (socket) => {
  // when connect
  console.log(`a user is connected`);

  // take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("connected", {});
    io.emit("getUsers", users);
  });

  socket.on("onConversationJoin", (payload) => {
    socket.join(payload.conversationId);
    // console.log(socket.rooms);
    io.to(payload.conversationId).emit("userJoin");
  });

  socket.on("conversation.create", (payload) => {
    const currentUser = getUser(payload.idUser);

    payload.conversation.member.forEach((user) => {
      if (user._id !== currentUser.userId) {
        const targetUser = users.find((u) => u.userId === user._id);
        if (targetUser) {
          socket.to(targetUser.socketId).emit("onConversation", payload.conversation);
        }
      }
    });
  });

  socket.on("message.create", (payload) => {
    io.to(payload.conversation._id).emit("onMessage", payload);
  });

  socket.on("onConversationLeave", (payload) => {
    socket.leave(payload.conversationId);
    // console.log(socket.rooms);
    io.to(payload.conversationId).emit("userLeave");
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log(`a user disconnected!`);
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

server.listen(process.env.PORT || 4000, () => {
  console.log(`server is running on port ${process.env.PORT || 4000}`);
});
