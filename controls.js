class Controller {
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
		this.clickListeners = [];
	}

	addClickListener(l) {
		this.clickListeners.push(l);
	}

	onMove(e) {
		this.px = this.x;
		this.py = this.y;

		this.x= e.clientX;
		this.y = e.clientY;

		this.dx = this.px-this.x;
		this.dy = this.py-this.y;
	}

	onClick(e) {
		for(let i = 0; i<this.clickListeners.length; i++) {
			this.clickListeners[i](e);
		}
	}
}