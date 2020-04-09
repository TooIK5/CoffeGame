class Player {

	constructor(controller, bullets) {
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

		this.bullets = bullets;
		this.controller = controller;

		let onClick = (e) => {
			this.shot(e);
		}

		this.controller.mouse.addClickListener(onClick);
	}

	shot(e) {
		let x = this.centerX();
		let y = this.centerY();

		let deltaXY = getDeltaXY(e.clientX, e.clientY, x, y, BULLET_SPEED);
		this.bullets.push(new Bullet(x, y, deltaXY.dx, deltaXY.dy));
	}

	centerX() {
		return this.x + this.cW;
	}

	centerY() {
		return this.y + this.cH;
	}

	sync(connector) {
		let p = {};
		p.player = nickname;
		p.x = this.x/winW;
		p.y = this.y/winH;

		let data = JSON.stringify(p);
		connector.send(data);
	}

	update() {
		let mouse = this.controller.mouse;

    	let deltaXY = getDeltaXY(mouse.x, mouse.y, this.centerX(), this.centerY(), this.speed);

    	if (deltaXY.range < this.speed) {
    		this.dx = 0;
	    	this.dy = 0;
    	} else {
    		this.dx = deltaXY.dx;
	    	this.dy = deltaXY.dy;
    	}

		this.x = this.x + this.dx;
		this.y = this.y + this.dy;
	}

	render(ctx) {
		ctx.fillStyle = this.color;
		ctx.fillText(nickname, this.x, this.y);
        ctx.fillRect(this.x, this.y, this.h, this.w);
	}
}