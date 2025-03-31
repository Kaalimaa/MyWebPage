const socket = io("https://moninpeliserver.onrender.com"); // Vaihda tämä Renderin URL:ksi!

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 400;

let players = {};

// Päivitä pelaajat palvelimelta
socket.on("currentPlayers", (serverPlayers) => {
    players = serverPlayers;
});

socket.on("newPlayer", (data) => {
    players[data.id] = data.pos;
});

socket.on("updatePlayers", (serverPlayers) => {
    players = serverPlayers;
});

socket.on("removePlayer", (id) => {
    delete players[id];
});

// Piirrä peli
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let id in players) {
        let player = players[id];
        ctx.fillStyle = "white";
        ctx.fillRect(player.x, player.y, 20, 20);
    }

    requestAnimationFrame(draw);
}

// Lähetä pelaajan liikkeet
document.addEventListener("keydown", (event) => {
    const speed = 5;
    let myPlayer = players[socket.id] || { x: 300, y: 200 };

    if (event.key === "ArrowUp") myPlayer.y -= speed;
    if (event.key === "ArrowDown") myPlayer.y += speed;
    if (event.key === "ArrowLeft") myPlayer.x -= speed;
    if (event.key === "ArrowRight") myPlayer.x += speed;

    players[socket.id] = myPlayer;
    socket.emit("move", myPlayer);
});

draw();
