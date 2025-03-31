const socket = io("https://webpage-1-h5bj.onrender.com"); 

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 400;

let players = {}; // Kaikki pelaajat tallennetaan tähän
let myId = null;  // Oma ID tallennetaan tähän

// Kun palvelin kertoo nykyiset pelaajat
socket.on("currentPlayers", (serverPlayers) => {
    players = serverPlayers;
});

// Kun uusi pelaaja liittyy
socket.on("newPlayer", (data) => {
    players[data.id] = data.pos;
});

// Kun pelaajien sijaintia päivitetään
socket.on("updatePlayers", (serverPlayers) => {
    players = serverPlayers;
});

// Kun joku poistuu pelistä
socket.on("removePlayer", (id) => {
    delete players[id];
});

// Piirretään peli
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let id in players) {
        let player = players[id];
        ctx.fillStyle = (id === socket.id) ? "blue" : "red"; // Oma hahmo on sininen, muut punaisia
        ctx.fillRect(player.x, player.y, 20, 20);
    }

    requestAnimationFrame(draw);
}

// Pelaajan liikkuminen
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
