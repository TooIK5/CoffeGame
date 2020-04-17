var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var SCREEN_SIZE_PX = 500;
var winH = SCREEN_SIZE_PX;
var winW = SCREEN_SIZE_PX;

var PLAYER_SIZE_PERCENT = 0.05;
var PLAYER_SIZE_PX = SCREEN_SIZE_PX*PLAYER_SIZE_PERCENT;
var PLAYER_SPEED_PERCENT = 0.005;
var PLAYER_SPEED_PX = SCREEN_SIZE_PX*PLAYER_SPEED_PERCENT;

var BULLET_SIZE_PERCENT = 0.01;
var BULLET_SIZE_PX = SCREEN_SIZE_PX*BULLET_SIZE_PERCENT;
var BULLET_SPEED_PERCENT = 0.02;
var BULLET_SPEED_PX = SCREEN_SIZE_PX*BULLET_SPEED_PERCENT;

var GAME_LOOP_MILLIS = 14;

function startGame() {
	prepareObjects();
	initListeners();
	setInterval(gameLoop, GAME_LOOP_MILLIS);

	let onconnected = function() {
		this.connector.send(commandBody("rename", nickname));
	};

	let onmessage = function(data) {
		handleReponse(data);
	};

	connector.connect(onconnected, onmessage);
}

function prepareObjects() {
	connector = new SocketConnector(host, port, isOfflineTest);

	controller = new Controller();
	bullets = [];
	player = new Player(controller, connector);

	allPlayers = [];
}

function initListeners() {
	document.getElementById("canvas").addEventListener("mousemove", function(event) { 
		controller.mouse.onMove(event); 
	});

	document.getElementById("canvas").addEventListener("click", function(event) {
		controller.mouse.onClick(event);
	});

	document.getElementById("canvas").addEventListener("mousedown", function(event) {
		controller.mouse.onDown(event);
	});

	document.getElementById("canvas").addEventListener("mouseup", function(event) {
		controller.mouse.onUp(event);
	});

	document.addEventListener("keydown", function(event) {
		controller.keyboard.onDown(event);
	});

	document.addEventListener("keyup", function(event) {
		controller.keyboard.onUp(event);
	});
}

function gameLoop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	player.update();
	player.sync();
	player.render(ctx);

	renderBullets();
	renderAllPlayers();
}

function handleReponse(data) {
	let response = JSON.parse(data);

	//console.log(data);

	if (response.type == "state") {
		allPlayers = response.data.players;
	}

	if (response.type == "shot") {
		let bulletData = response.data;
		let x = bulletData.x*winW;
		let y = bulletData.y*winH;
		let route = bulletData.route;
		let damage = bulletData.damage;
		let deltaXY = getDelta_XY_ByRoute(route, BULLET_SPEED_PX);

		let b = new Bullet(x, y, deltaXY.dx, deltaXY.dy, damage);
		b.color = "blue";

		bullets.push(b);
	}
}

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

		//if (p.player == nickname) { continue; }//TODO

		ctx.fillStyle = "red";
		let x = p.x*winW;
		let y = p.y*winH;
		ctx.fillText(p.name, x, y);
        ctx.fillRect(x, y, PLAYER_SIZE_PX, PLAYER_SIZE_PX)
	}
}