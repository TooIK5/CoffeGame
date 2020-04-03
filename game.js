
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var titles = ['HTML', 'Git', 'BPO', 'Android', 'Web'];

var h = 700;
var w = 800;
var UPDATE_MILLIS = 20;
var FONT_NAME = "Arial";

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

var client = new Client();
var models = createModels(titles);

setInterval(render, UPDATE_MILLIS);

document.getElementById("canvas").addEventListener("mousemove", function(event) { 
	client.mouse.update(event); 
});

function render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for(let i = 0; i<models.length; i++) {
		models[i].update(client);
		models[i].render(ctx);
	}
}