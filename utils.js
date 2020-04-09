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

function getDeltaXY(targetX, targetY, currentX, currentY, speed) {
	let result = {};

	let xRange = targetX - currentX;
    let yRange = targetY - currentY;
    let range = absoluteRange(xRange, yRange);

    let k = speed/range;

    result.range = range;
	result.dx = k*xRange;
	result.dy = k*yRange;

	return result;
}