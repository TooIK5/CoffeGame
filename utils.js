function moveIfOutside(p) {
	if (p.x > winW+20) {
		p.x = -p.w-20;
	}

	if (p.y > winH+20) {
		p.y = -p.h-20;
	}

	if (p.x < -p.w-20) {
		p.x = winW+20;
	}

	if (p.y < -p.h-20) {
		p.y = winH+20;
	}
}

function removeIfOutside(p, array) {
	if (p.x > winW+20 || p.y > winH+20 || p.x < -p.w-20 || p.y < -p.h-20) {
		const index = array.indexOf(p);
        if (index > -1) {
            array.splice(index, 1);
        }
	}
}

function absoluteRange(xRange, yRange) {
	return Math.sqrt(Math.pow(xRange, 2)+Math.pow(yRange, 2));
}

function getRoute(targetX, targetY, currentX, currentY) {
	let xRange = targetX - currentX;
    let yRange = targetY - currentY;

    return Math.atan2(yRange, xRange);
}

function getDeltaXY(targetX, targetY, currentX, currentY, speed) {
	let result = {};

	let xRange = targetX - currentX;
    let yRange = targetY - currentY;
    
    let r = getRoute(targetX, targetY, currentX, currentY);

    result.dx = Math.cos(r) * speed;
	result.dy = Math.sin(r) * speed;

    result.over = Math.abs(xRange) < Math.abs(result.dx) || Math.abs(yRange) < Math.abs(result.dy);

	return result;
}

function getDelta_XY_ByRoute(route, speed) {
	let result = {};

	result.dx = Math.cos(route) * speed;
	result.dy = Math.sin(route) * speed;

	return result;
}

function commandBody(type, data) {
	let body = {};
	body.type = type;
	body.data = data;

	return JSON.stringify(body);
}