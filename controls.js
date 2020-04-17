class Controller {
	constructor() {
		this.mouse = new Mouse();
		this.keyboard = new Keyboard();
	}
}

class Keyboard {
	constructor() {
		this.downListeners = [];
		this.upListeners = [];
	}

	addDownListener(l) {
		this.downListeners.push(l);
	}

	addUpListener(l) {
		this.upListeners.push(l);
	}

	onDown(e) {
		for(let i = 0; i<this.downListeners.length; i++) {
			this.downListeners[i](e);
		}
	}

	onUp(e) {
		for(let i = 0; i<this.upListeners.length; i++) {
			this.upListeners[i](e);
		}
	}
}

class Mouse {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.clickListeners = [];
		this.downListeners = [];
		this.upListeners = [];
	}

	addClickListener(l) {
		this.clickListeners.push(l);
	}

	addDownListener(l) {
		this.downListeners.push(l);
	}

	addUpListener(l) {
		this.upListeners.push(l);
	}

	onMove(e) {
		this.x = e.offsetX;
		this.y = e.offsetY;
	}

	onClick(e) {
		for(let i = 0; i<this.clickListeners.length; i++) {
			this.clickListeners[i](e);
		}
	}

	onDown(e) {
		for(let i = 0; i<this.downListeners.length; i++) {
			this.downListeners[i](e);
		}
	}

	onUp(e) {
		for(let i = 0; i<this.upListeners.length; i++) {
			this.upListeners[i](e);
		}
	}
}