class Player {

	constructor(controller, connector) {
		this.h = PLAYER_SIZE_PX;
		this.w = PLAYER_SIZE_PX;

		this.cH = this.h/2;
		this.cW = this.w/2;

		this.y = winH/2-this.h/2;
		this.x = winW/2-this.w/2;

		this.dx = 0.5;
		this.dy = 0.2;

		this.color = "green";
		this.speed = PLAYER_SPEED_PX;

		this.ammo = 10;
		this.maxAmmo = 10;

		this.accumulationQuantity = 0;
		this.isAccumulation = false;
		this.tickValue = 0;

		this.controller = controller;
		this.connector = connector;

		let onDown = (e) => {
			if(this.ammo > 0 && !this.isAccumulation) {
				this.accumulationQuantity += 1;
				this.ammo -= 1;
				this.isAccumulation = true;
				this.tickValue = 0;
			}
		}

		this.controller.mouse.addDownListener(onDown);

		let onUp = (e) => {
			this.isAccumulation = false;
			this.shot();
		}

		this.controller.mouse.addUpListener(onUp);


		let onDownKey = (e) => {
			if(e.code == "Space") {
				onDown();
			}
		}

		this.controller.keyboard.addDownListener(onDownKey);

		let onUpKey = (e) => {
			if(e.code == "Space") {
				onUp();
			}
		}

		this.controller.keyboard.addUpListener(onUpKey);
	}

	shot() {
		if (this.accumulationQuantity < 1) return;

		let mouse = this.controller.mouse;

		let x = this.centerX();
		let y = this.centerY();

		let deltaXY = getDeltaXY(mouse.x, mouse.y, x, y, BULLET_SPEED_PX);

		let b = new Bullet(x, y, deltaXY.dx, deltaXY.dy, this.accumulationQuantity)
		bullets.push(new Bullet(x-b.cW, y-b.cH, deltaXY.dx, deltaXY.dy, this.accumulationQuantity));

		let data = {};
		data.x = x/winW;
		data.y = y/winH;
		data.route = getRoute(mouse.x, mouse.y, x, y);
		data.damage = this.accumulationQuantity;

		this.connector.send(commandBody("shot", data));
		this.accumulationQuantity = 0;
	}

	centerX() {
		return this.x + this.cW;
	}

	centerY() {
		return this.y + this.cH;
	}

	sync() {
		let p = {};
		p.player = nickname;
		p.x = this.x/winW;
		p.y = this.y/winH;

		this.connector.send(commandBody("move", p));
	}

	update() {
		this.tickValue += 0.05;
		if (this.tickValue > 0.99) {
			if (this.isAccumulation) {
				if(this.ammo > 0) {
					this.accumulationQuantity += 1;
					this.ammo -= 1;
				}
			} else {
				if(this.ammo < this.maxAmmo) {
					this.ammo += 1;
				}
			}
			this.tickValue = 0;
		}

		let mouse = this.controller.mouse;

    	let deltaXY = getDeltaXY(mouse.x, mouse.y, this.centerX(), this.centerY(), this.speed);

    	if (deltaXY.over) {
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

		ctx.fillStyle = "purple";
        ctx.fillRect(this.x+this.w+2, this.y, 3, this.h*(this.ammo/this.maxAmmo));
	}
}