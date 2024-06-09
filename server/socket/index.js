const express = require("express");
const { Server } = require("socket.io");
const http = require("http");

const app = express();

/* socket connection */
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("connect USer", socket.id);

  //disconnect
  io.on("disconnect", (socket) => {
    console.log("disconnect USer", socket.id);
  });
});
/* socket running at  http://localhost:3333/ */

module.exports = {
  app,
  server,
};
