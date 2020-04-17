class Bullet {
	constructor(x, y, dx, dy, damage) {
		this.damage = damage;

		this.h = BULLET_SIZE_PX*(1+damage/2.9);
		this.w = BULLET_SIZE_PX*(1+damage/2.9);

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

		removeIfOutside(this, bullets);
	}

	render(ctx) {
		ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.h, this.w);
	}
}