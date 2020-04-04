var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var winH = 500;
var winW = 500;
var UPDATE_MILLIS = 20;
var FONT_NAME = "Arial";

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

	update(client) {
		let mouse = client.mouse;

        let xr = mouse.x - (this.x + this.cW);
        let yr = mouse.y - (this.y + this.cH);
        let g = Math.sqrt(Math.pow(xr, 2)+Math.pow(yr, 2));

        if(g<5) return;
        let k = this.speed/g;

	    this.dx = k*xr;
	    this.dy = k*yr;

		this.x = this.x + this.dx;
		this.y = this.y + this.dy;

		moveIfOutside(this);
	}

	render(ctx) {
		ctx.fillStyle = this.color;
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
var bullets = [];
var bulletSpeed = 10;
var client = new Client();

setInterval(render, UPDATE_MILLIS);

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

	player.update(client);
	player.render(ctx);
	renderBullets();
}

function renderBullets() {
	for(let i = 0; i<bullets.length; i++) {
		let b = bullets[i];
		b.update();
		b.render(ctx);
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