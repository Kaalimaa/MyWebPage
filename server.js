const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"]
  }
});

app.use(cors());

let players = {};

// When a player connects
io.on("connection", (socket) => {
  console.log(`Player connected: ${socket.id}`);

  // Assign a random starting position for the player
  players[socket.id] = { x: Math.random() * 500, y: Math.random() * 500 };

  // Send existing players to the new player
  socket.emit("currentPlayers", players);

  // Notify other players about the new player
  socket.broadcast.emit("newPlayer", { id: socket.id, pos: players[socket.id] });

  // Listen for movement events
  socket.on("move", (data) => {
    if (players[socket.id]) {
      players[socket.id] = data;
      io.emit("updatePlayers", players);
    }
  });

  // When a player disconnects
  socket.on("disconnect", () => {
    console.log(`Player disconnected: ${socket.id}`);
    delete players[socket.id];
    io.emit("removePlayer", socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
