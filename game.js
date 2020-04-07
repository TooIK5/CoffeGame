var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var winH = 500;
var winW = 500;
var UPDATE_MILLIS = 20;
var FONT_NAME = "Arial";
var nickname = "Andrey";


class SocketConnector {
	constructor(host, port){
		this.host = host;
		this.port = port;
	}

	connect(onmessage) {
		this.mockConnect(onmessage);
		return;//TODO

	    let address = "ws://"+this.host+":"+this.port;
	    console.log("Connecting... "+ address);

        this.socket = new WebSocket(address);

        this.socket.onopen = () => {
          console.log("Соединение установлено.");

          this.socket.send("Привет");
        };

        this.socket.onclose = function(event) {
          if (event.wasClean) {
           console.log('Соединение закрыто чисто');
          } else {
            console.log('Обрыв соединения'); // например, "убит" процесс сервера
          }
          console.log('Код: ' + event.code + ' причина: ' + event.reason);
        };

        this.socket.onmessage = function(event) {
          console.log("Получены данные " + event.data);
          onmessage(event.data);
        };

        this.socket.onerror = function(error) {
          console.log("Ошибка " + error.message);
        };
	}

	send(message) {
		this.mockSend(message);
		return;//TODO
		
		this.socket.send(message);
	}

	mockConnect(onmessage) {
		this.players = [];
		this.bullets = [];

		for(let i = 0; i<4; i++) {
		   let p = {};
		   p.player = "A"+i;
		   p.x = 0.1*i;
		   p.y = 0.1*i;
		   this.players.push(p);
	    }
	

		let cicle = (e)=> {
			for(let i = 0; i<this.players.length; i++) {
		       let p = this.players[i];
		       p.x = p.x+0.0001*(i+1);
		       p.y = p.y+0.0002*(i+1);
	        }

	        var obj = {};
	        obj.players = this.players;
	        

			var dat = JSON.stringify(this.players);
			onmessage(dat);
		}

		setInterval(cicle, 30);
	}

	mockSend(message) {
		//console.log(message);
	}
}

class Bullet {
	constructor(x, y, dx, dy){
		this.h = 5;
		this.w = 5;

		this.cH = this.h/2;
		this.cW = this.w/2;

		this.y = y;
		this.x = x;

		this.dx = dx;
		this.dy = dy;

		this.color = "red";
	}

	update() {
		this.x = this.x + this.dx;
		this.y = this.y + this.dy;

		this.removeIfOutside();
	}

	render(ctx) {
		ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.h, this.w);
	}

	removeIfOutside() {
		let p = this;

		if(p.x > winW+20 || p.y > winH+20 || p.x < -p.w-20 || p.y < -p.h-20) {
			console.log(1);
			const index = bullets.indexOf(this);
            if (index > -1) {
              bullets.splice(index, 1);
            }
		}
	}
}

class Player {
	constructor() {
		this.h = 25;
		this.w = 25;

		this.cH = this.h/2;
		this.cW = this.w/2;

		this.y = winH/2-this.h/2;
		this.x = winW/2-this.w/2;

		this.dx = 0.5;
		this.dy = 0.2;

		this.color = "green";

		this.speed = 5;
	}

	sync(connector) {
		let p = {};
		p.player = nickname;
		p.x = this.x/winW;
		p.y = this.y/winH;

		let data = JSON.stringify(p);
		connector.send(data);
	}

	update(client) {
		let mouse = client.mouse;

        let xCenter = mouse.x - (this.x + this.cW);
        let yCenter = mouse.y - (this.y + this.cH);
        let rangeToMouse = Math.sqrt(Math.pow(xCenter, 2)+Math.pow(yCenter, 2));

        if(rangeToMouse<this.speed) return;
        let k = this.speed/rangeToMouse;

	    this.dx = k*xCenter;
	    this.dy = k*yCenter;

		this.x = this.x + this.dx;
		this.y = this.y + this.dy;
	}

	render(ctx) {
		ctx.fillStyle = this.color;
		ctx.fillText(nickname, this.x, this.y);
        ctx.fillRect(this.x, this.y, this.h, this.w);
	}
}

class Client {
	constructor() {
		this.mouse = new Mouse();
	}
}

class Mouse {
	constructor() {
		this.px = 0;
		this.py = 0;

		this.x = 0;
		this.y = 0;

		this.dx = 0;
		this.dy = 0;
	}

	update(e) {
		this.px = this.x;
		this.py = this.y;

		this.x= e.clientX;
		this.y = e.clientY;

		this.dx = this.px-this.x;
		this.dy = this.py-this.y;
	}
}

var player = new Player();
let allPlayers = [];

var bullets = [];
var bulletSpeed = 10;
var client = new Client();

setInterval(render, UPDATE_MILLIS);

var connector = new SocketConnector("172.20.10.2", "3333");

var onmessage = function(data) {
    allPlayers = JSON.parse(data);
};

connector.connect(onmessage);

document.getElementById("canvas").addEventListener("mousemove", function(event) { 
	client.mouse.update(event); 
});

document.getElementById("canvas").addEventListener("click", function(event) {
	let x = player.x+player.cW;
	let y = player.y+player.cH;

    let xr = event.clientX - x;
    let yr = event.clientY - y;
    let g = Math.sqrt(Math.pow(xr, 2)+Math.pow(yr, 2));
    let k = bulletSpeed/g;

	let dx = k*xr;
	let dy = k*yr;
	bullets.push(new Bullet(x, y, dx, dy));
});

function render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.sync(connector);
	player.update(client);
	player.render(ctx);
	renderBullets();
	renderAllPlayers();
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

		if (p.player == nickname) { continue; }//TODO

		ctx.fillStyle = "red";
		let x = p.x*winW;
		let y = p.y*winH;
		ctx.fillText(p.player, x, y);
        ctx.fillRect(x, y, 25, 25)
	}
}

function moveIfOutside(p) {
	if(p.x > winW+20) {
		p.x = -p.w-20;
	}

	if(p.y > winH+20) {
		p.y = -p.h-20;
	}

	if(p.x < -p.w-20) {
		p.x = winW+20;
	}

	if(p.y < -p.h-20) {
		p.y = winH+20;
	}
}