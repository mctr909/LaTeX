class vec {
	X = 0.0;
	Y = 0.0;
	Z = 0.0;

	static zero = new vec();
	static unitX = new vec(1,0,0);
	static unitY = new vec(0,1,0);
	static unitZ = new vec(0,0,1);
	static unitXr = new vec(-1,0,0);
	static unitYr = new vec(0,-1,0);
	static unitZr = new vec(0,0,-1);

	get abs() { return Math.sqrt(this.X * this.X + this.Y * this.Y + this.Z * this.Z); }
	get arg() { return Math.atan2(this.Y, this.X); }
	get azimuth() { return Math.atan2(this.Z, this.X); }
	get altitude() { return Math.atan2(this.Y, Math.sqrt(this.X * this.X + this.Z * this.Z)); }

	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {number} z
	 */
	constructor(x=0, y=0, z=0) {
		this.X = x;
		this.Y = y;
		this.Z = z;
	}

	/**
	 * @param {vec} returnValue
	 */
	copy(returnValue) {
		returnValue.X = this.X;
		returnValue.Y = this.Y;
		returnValue.Z = this.Z;
	}

	/**
	 * @param {vec} returnValue
	 * @param {number} scale
	 */
	normalize(returnValue, scale = 1) {
		let inv = Math.sqrt(this.X*this.X + this.Y*this.Y + this.Z*this.Z);
		if (0 == inv) {
			returnValue.X = 0;
			returnValue.Y = 0;
			returnValue.Z = 0;
		} else {
			inv = scale / inv;
			returnValue.X = inv * this.X;
			returnValue.Y = inv * this.Y;
			returnValue.Z = inv * this.Z;
		}
	}

	/**
	 * @param {number} scale
	 * @param {vec} returnValue
	 */
	scale(scale, returnValue) {
		if (undefined == returnValue) {
			return new vec(
				scale * this.X,
				scale * this.Y,
				scale * this.Z
			);
		} else {
			returnValue.X = scale * this.X;
			returnValue.Y = scale * this.Y;
			returnValue.Z = scale * this.Z;
		}
	}

	/**
	 * @param {vec} v
	 * @return {number}
	 */
	dot(v) {
		return (this.X*v.X + this.Y*v.Y + this.Z*v.Z);
	}

	/**
	 * @param {vec} v
	 * @param {vec} returnValue
	 */
	cross(v, returnValue) {
		returnValue.X = this.Y * v.Z - this.Z * v.Y;
		returnValue.Y = this.Z * v.X - this.X * v.Z;
		returnValue.Z = this.X * v.Y - this.Y * v.X;
	}

	/**
	 * @param {vec} dv
	 * @param {vec} returnValue
	 */
	rotXY(dv, returnValue) {
		returnValue.X = this.X * dv.X - this.Y * dv.Y;
		returnValue.Y = this.X * dv.Y + this.Y * dv.X;
	}

	/**
	 * @param {vec} dv
	 * @param {vec} returnValue
	 */
	rotAzimuth(dv, returnValue) {
		returnValue.X = this.X * dv.X - this.Z * dv.Z;
		returnValue.Z = this.X * dv.Z + this.Z * dv.X;
	}

	/**
	 * @param {vec} v
	 * @param {vec} returnValue
	 */
	add(v, returnValue) {
		returnValue.X = this.X + v.X;
		returnValue.Y = this.Y + v.Y;
		returnValue.Z = this.Z + v.Z;
	}

	/**
	 * @param {vec} v
	 * @param {vec} returnValue
	 */
	sub(v, returnValue) {
		returnValue.X = this.X - v.X;
		returnValue.Y = this.Y - v.Y;
		returnValue.Z = this.Z - v.Z;
	}
}

/**
 * @param {vec} v
 * @param {number} focalLength 
 * @returns {vec}
 */
function to2d(v, focalLength=40) {
	var py = v.Y * 0.2 + 50;
	var pz = v.Z - 100;
	var w = focalLength / (focalLength + py);
	return new vec(v.X * w, pz * w + py * w, 0);
}

/**
 * @param {number} y
 * @param {number} z
 * @returns {number}
 */
function toAlpha(y, z) {
	let uy = 0.7 - 0.3 * y / UNIT;
	let uz = 0.8 + 0.2 * z / UNIT;
	let a = uy * uz;
	if (a < 0.05) {
		a = 0.05;
	}
	return a;
}

/**
 * @param {vec} a 
 * @param {vec} b 
 * @returns {number}
 */
function distance(a, b) {
	let sx = b.X - a.X;
	let sy = b.Y - a.Y;
	let sz = b.Z - a.Z;
	return Math.sqrt(sx*sx + sy*sy + sz*sz);
}

/**
 * @param {vec} p
 * @param {vec} a
 * @param {vec} b
 * @param {vec} returnValue
 * @param {number} beginLimit
 * @param {number} endLimit
 * @return {number}
 */
function nearPointOnLine(p, a, b, returnValue, beginLimit=true, endLimit=true) {
	var abx = b.X - a.X;
	var aby = b.Y - a.Y;
	var abz = b.Z - a.Z;
	var apx = p.X - a.X;
	var apy = p.Y - a.Y;
	var apz = p.Z - a.Z;
	var r = (apx*abx + apy*aby + apz*abz) / (abx*abx + aby*aby + abz*abz);
	if (beginLimit && r <= 0) {
		returnValue.X = a.X;
		returnValue.Y = a.Y;
		returnValue.Z = a.Z;
		return  r;
	}
	if (endLimit && 1 <= r) {
		returnValue.X = b.X;
		returnValue.Y = b.Y;
		returnValue.Z = b.Z;
		return r;
	}
	returnValue.X = abx*r + a.X;
	returnValue.Y = aby*r + a.Y;
	returnValue.Z = abz*r + a.Z;
	return r;
}

/**
 * @param {vec} o
 * @param {vec} a
 * @param {vec} b
 * @param {number} scale
 * @param {vec} returnValue
 */
function midPos(a, b, scale, returnValue) {
	returnValue.X = a.X + (b.X - a.X) * scale;
	returnValue.Y = a.Y + (b.Y - a.Y) * scale;
	returnValue.Z = a.Z + (b.Z - a.Z) * scale;
}

/**
 * @param {vec} o
 * @param {vec} a
 * @param {vec} b
 * @param {vec} returnValue
 */
function divLine(o, a, b, returnValue) {
	var oax = a.X - o.X;
	var oay = a.Y - o.Y;
	var oaz = a.Z - o.Z;
	var obx = b.X - o.X;
	var oby = b.Y - o.Y;
	var obz = b.Z - o.Z;
	var oar = Math.sqrt(oax*oax + oay*oay + oaz*oaz);
	var obr = Math.sqrt(obx*obx + oby*oby + obz*obz);
	returnValue.X = (oax / oar + obx / obr) + o.X;
	returnValue.Y = (oay / oar + oby / obr) + o.Y;
	returnValue.Z = (oaz / oar + obz / obr) + o.Z;
}

/**
 * @param {vec} o
 * @param {vec} a
 * @param {vec} b
 * @param {vec} returnValue
 */
function crossedDivLine(o, a, b, returnValue) {
	var oax = a.X - o.X;
	var oay = a.Y - o.Y;
	var oaz = a.Z - o.Z;
	var obx = b.X - o.X;
	var oby = b.Y - o.Y;
	var obz = b.Z - o.Z;
	var oar = Math.sqrt(oax*oax + oay*oay + oaz*oaz);
	var obr = Math.sqrt(obx*obx + oby*oby + obz*obz);
	returnValue.X = (obr * oax + oar * obx) / (oar + obr) + o.X;
	returnValue.Y = (obr * oay + oar * oby) / (oar + obr) + o.Y;
	returnValue.Z = (obr * oaz + oar * obz) / (oar + obr) + o.Z;
}

/**
 * @param {number} value 
 * @param {string} unit 
 * @returns {string} 
 */
function toFrac(value, unit="", dispOne=true) {
	if (0 == value) {
		if (dispOne && unit != "") {
			return "0" + unit;
		} else {
			return "0";
		}
	}
	if (0 == value - parseInt(value)) {
		if (dispOne) {
			return value + unit;
		} else {
			return (1 == value ? "" : -1 == value ? "-" : value) + unit;
		}
	}
	let sign = Math.sign(value);
	for (let m=1; m<256;m++) {
		for(let c=0; c<1000; c++) {
			let diff = c / m - value * sign;
			if (0 == diff) {
				if ("" != unit) {
					if (c == 1) {
						return ((sign == 1 ? "" : "-") + unit + "/") + m;
					} else {
						return (c * sign) + unit + "/" + m;
					}
				} else {
					return (c * sign) + "/" + m + unit;
				}
			}
		}
	}
	return parseInt(value * 1000) / 1000 + unit;
}

/**
 * @param {vec} returnVal
 * @param {vec} v
 * @param {number} digit
 * @param {number} scale
 * @param {vec} offset
 */
function roundVec(returnVal, v, digit, scale, offset) {
	var f = Math.pow(10, digit);
	var x = v.X - offset.X;
	var y = v.Y - offset.Y;
	var z = v.Z - offset.Z;
	returnVal.X = parseInt(x / scale * f + Math.sign(x) * 0.5) / f * scale + offset.X;
	returnVal.Y = parseInt(y / scale * f + Math.sign(y) * 0.5) / f * scale + offset.Y;
	returnVal.Z = parseInt(z / scale * f + Math.sign(z) * 0.5) / f * scale + offset.Z;
}

/**
 * @param {number} value
 * @param {number} scale
 * @param {number} digit
 * @returns
 */
function round1d(value, scale=1, digit=2) {
	var f = Math.pow(10, digit);
	return parseInt(value * scale * f + Math.sign(value) * 0.5) / f;
}

/**
 * @param {vec} value
 * @param {number} scale
 * @param {number} digit
 * @returns
 */
function round2d(value, scale=1, digit=2) {
	var f = Math.pow(10, digit);
	return (parseInt(value.X * scale * f + Math.sign(value.X) * 0.5) / f) + ", "
		+ (parseInt(value.Y * scale * f + Math.sign(value.Y) * 0.5) / f);
}

/**
 * @param {vec} value
 * @param {number} scale
 * @param {number} digit
 * @returns
 */
function round3d(value, scale=1, digit=2) {
	var f = Math.pow(10, digit);
	return (parseInt(value.X * scale * f + Math.sign(value.X) * 0.5) / f) + ", "
		+ (parseInt(value.Y * scale * f + Math.sign(value.Y) * 0.5) / f) + ", "
		+ (parseInt(value.Z * scale * f + Math.sign(value.Z) * 0.5) / f)
	;
}
