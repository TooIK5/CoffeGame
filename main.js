var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var winH = 500;
var winW = 500;
var GAME_LOOP_MILLIS = 20;
var BULLET_SPEED = 10;
var FONT_NAME = "Arial";
var nickname = "Andrey";

var controller = new Controller();
var bullets = [];
var player = new Player(controller, bullets);

let allPlayers = [];

setInterval(gameLoop, GAME_LOOP_MILLIS);

function gameLoop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.sync(connector);
	player.update();
	player.render(ctx);

	renderBullets();
	renderAllPlayers();
}

var connector = new SocketConnector("172.20.10.2", "3333", true); //TODO true for isMock param

var onmessage = function(data) {
    allPlayers = JSON.parse(data);
};

connector.connect(onmessage);

document.getElementById("canvas").addEventListener("mousemove", function(event) { 
	controller.mouse.onMove(event); 
});

document.getElementById("canvas").addEventListener("click", function(event) {
	controller.mouse.onClick(event);
});

function renderBullets() {
	for(let i = 0; i<bullets.length; i++) {
		let b = bullets[i];
		b.update();
		b.render(ctx);
	}
}

function renderAllPlayers() {
	for(let i = 0; i<allPlayers.length; i++) {
		let p = allPlayers[i];

		if (p.player == nickname) { continue; }//TODO

		ctx.fillStyle = "red";
		let x = p.x*winW;
		let y = p.y*winH;
		ctx.fillText(p.player, x, y);
        ctx.fillRect(x, y, 25, 25)
	}
}