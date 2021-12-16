const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const port = 8080;

io.on("connection", (socket) => {
  socket.emit("receive:personal_id", socket.id);
  socket.on("joining_you", (data) => {
    console.log("joining_you", data);
    socket.to(data.enemyclientId).emit("being_joined", data);
  });

  socket.on("i_won", (enemyClientId) => {
    socket.to(enemyClientId).emit("i_won");
  });
  socket.on("i_lost", (enemyClientId) => {
    socket.to(enemyClientId).emit("i_lost");
  });
  socket.on("send:update_of_my_state", (data) => {
    console.log(data);
    socket
      .to(data.enemyclientId)
      .emit("receive:updated_enemy_state", data.payload);
  });
});

server.listen(port, () => {
  console.log("listening on localhost:8080");
});
