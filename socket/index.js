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

  //when disconnect
  socket.on("disconnect", () => {
    console.log(`a user disconnected!`);
    removeUser(socket.id);
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
    const member = payload.conversation.member
    member.forEach((u) => {
      const user = getUser(u._id)
      user && socket.to(user.socketId).emit("onMessage", payload);
    })
  });

  socket.on("onConversationLeave", (payload) => {
    socket.leave(payload.conversationId);
    // console.log(socket.rooms);
    io.to(payload.conversationId).emit("userLeave");
  });

  //check user online
  socket.on("getOnlineGroupUsers", (payload) => {
    const onlineUsers = users.map((user) => user.userId);
    io.to(payload.id).emit("onlineGroupUsersReceived", {onlineUsers});
  });

  socket.on("getOnlineUsers", (payload) => {
    const result = getUser(payload.idUser);
    socket.emit("onlineUsersReceived", {result: result ? true : false});
  });

  //check user is typing
  socket.on("onTypingStart", (payload) => {
    io.to(payload.conversationId).emit("onTypingStart", payload);
  });

  socket.on("onTypingStop", (payload) => {
    io.to(payload.conversationId).emit("onTypingStop", payload);
  });

  // update seen message
  socket.on("updateSeenMessage", (payload) => {
    io.to(payload.conversationId).emit("onUpdateSeenMessage", payload);
  });

  // delete message
  socket.on("onMessageDelete", (payload) => {
    const conversationId = payload.conversationId._id ? payload.conversationId._id : payload.conversationId
    io.to(conversationId).emit("deleteMessage", payload);
  });

  // delete member
  socket.on("deleteMember", (payload) => {
    io.to(payload.groupId).emit("onDeleteMember", payload);
  });

  // transferOwner
  socket.on("transferOwner", (payload) => {
    io.to(payload.groupId).emit("onTransferOwner", payload);
  });

  // user leave group
  socket.on("userLeaveGroup", (payload) => {
    io.to(payload.groupId).emit("onUserLeaveGroup", payload);
  });

  // remove group
  socket.on("removeGroup", (payload) => {
    io.to(payload.groupId).emit("onRemoveGroup", payload);
  });

  // add user on group
  socket.on("addUserOnGroup", (payload) => {
    io.to(payload.groupId).emit("onAddUserOnGroup", payload);
  });

  // get online friends
  socket.on("getOnlineFriends", (payload) => {
    const list = users.filter((u) => payload.friends.includes(u.userId))
    socket.emit("getOnlineFriends", list?.map((i)=> i.userId));
  });

  // remove friends
  socket.on("onFriendRemoved", (payload) => {
    const user = getUser(payload.id)
    if(user)
      socket.to(user.socketId).emit("onFriendRemoved", payload.user);
  });

  // onFriendRequestCancelled
  socket.on("onFriendRequestCancelled", (payload) => {
    const user = getUser(payload.receiver._id)
    if(user) socket.to(user.socketId).emit("onFriendRequestCancelled", payload);
  });

  //onFriendRequestAccepted
  socket.on("onFriendRequestAccepted", (payload) => {
    const user = getUser(payload.sender._id)
    if(user) socket.to(user.socketId).emit("onFriendRequestAccepted", payload);
  });

  // onFriendRequestRejected
  socket.on("onFriendRequestRejected", (payload) => {
    const user = getUser(payload.sender._id)
    if(user) socket.to(user.socketId).emit("onFriendRequestRejected", payload);
  });

  // onFriendRequestRejected
  socket.on("onFriendRequestReceived", (payload) => {
    const user = getUser(payload.receiverId)
    if(user) socket.to(user.socketId).emit("onFriendRequestReceived");
  });

  // addMemberToConversation
  socket.on("addMemberToConversation", (payload) => {
    io.emit("addMemberToConversation", payload);
  });

  // memberLeaveGroup
  socket.on("memberLeaveGroup", (payload) => {
    io.to(payload.conversationId).emit("memberLeaveGroup", payload);
  });

  // updateGroupDetails
  socket.on("updateGroupDetails", (payload) => {
    payload.conversation.member.map((u) => {
      const user = getUser(u._id)
      user && socket.to(user.socketId).emit("updateGroupDetails", payload.conversation)
    })
  });
});

server.listen(process.env.PORT || 4000, () => {
  console.log(`server is running on port ${process.env.PORT || 4000}`);
});
