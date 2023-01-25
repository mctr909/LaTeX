/// <reference path="Math.js" />

class LineInfo {
    /** @type{vec} */
    posA;
    /** @type{vec} */
    posB;
	width = 1;
    isDot = false;
	isArrow = false;
	color = Drawer.BLACK;
	/**
	 * @param {number} ax
	 * @param {number} ay
	 * @param {number} bx
	 * @param {number} by
	 * @param {number} width
	 * @param {number[]} color
	 * @param {boolean} isDot
	 * @param {boolean} isArrow
	 */
	constructor(ax, ay, bx, by, width=1, color=Drawer.BLACK, isDot=false, isArrow=false) {
		this.posA = new vec(ax, ay);
		this.posB = new vec(bx, by);
		this.width = width;
		this.color = color;
		this.isDot = isDot;
		this.isArrow = isArrow;
	}
	/**
	 * @param {Drawer} drawer 
	 */
	draw(drawer) {
		if (this.isArrow) {
			if (this.isDot) {
				drawer.drawArrowD(this.posA, this.posB, this.color, this.width);
			} else {
				drawer.drawArrow(this.posA, this.posB, this.color, this.width);
			}
		} else {
			if (this.isDot) {
				drawer.drawLineD(this.posA, this.posB, this.color, this.width);
			} else {
				drawer.drawLine(this.posA, this.posB, this.color, this.width);
			}
		}
	}
}

class Drawer {
	static #FONT_NAME = "Cambria Math";
	static FRAME_RATE = 60;

	static BLACK = [0, 0, 0];
	static GRAY = [167, 167, 167];
	static WHITE = [211, 255, 255];
	static RED = [255, 0, 0];
	static GREEN = [0, 167, 0];
	static BLUE = [0, 0, 255];
	static ORANGE = [231, 147, 0];
	static PURPLE = [191, 0, 255];

	/** @type {number} */
	static CursorDiv = 2;

	/** @type {CanvasRenderingContext2D} */
	#ctx;
	/** @type {HTMLCanvasElement} */
	#element;
	#offset = new vec();
	cursor = new vec();
	isDrag = false;

	/** @param {vec} offset */
	set Offset(offset) { this.#offset = offset; }
	get Offset() { return this.#offset; }
	get Width() { return this.#element.width; }
	get Height() { return this.#element.height; }

	/**
	 * @param {string} canvasId
	 * @param {number} width
	 * @param {number} height
	 */
	constructor(canvasId, width, height) {
		this.#element = document.getElementById(canvasId);
		this.#element.width = width;
		this.#element.height = height;

		let self = this;
		this.#element.addEventListener("mousemove", function(ev) {
			self.#roundCursor(ev.offsetX, ev.offsetY);
		});
		this.#element.addEventListener("touchmove", function(ev) {
			ev.preventDefault();
			let rect = self.#element.getBoundingClientRect();
			let x = ev.changedTouches[0].pageX - rect.left;
			let y = ev.changedTouches[0].pageY - rect.top;
			self.#roundCursor(x, y);
		});
		this.#element.addEventListener("mousedown", function(ev) {
			if (0 == ev.button) {
				self.isDrag = true;
			}
		});
		this.#element.addEventListener("touchstart", function(ev) {
			ev.preventDefault();
			self.isDrag = true;
		});
		this.#element.addEventListener("mouseup", function(ev) {
			if (0 == ev.button) {
				self.isDrag = false;
			}
		});
		this.#element.addEventListener("touchend", function(ev) {
			ev.preventDefault();
			self.isDrag = false;
		});

		this.#ctx = this.#element.getContext("2d");
		this.#ctx.scale(1, 1);

		window.requestNextAnimationFrame = (function () {
			var originalWebkitRequestAnimationFrame = undefined;
			var wrapper = undefined;
			var callback = undefined;
			var self = this;

			// Workaround for Chrome 10 bug where Chrome
			// does not pass the time to the animation function
			if (window.webkitRequestAnimationFrame) {
				// Define the wrapper
				wrapper = function (time) {
					if (time === undefined) {
						time = +new Date();
					}
					self.callback(time);
				};

				// Make the switch
				originalWebkitRequestAnimationFrame = window.webkitRequestAnimationFrame;
				window.webkitRequestAnimationFrame = function (callback, element) {
					self.callback = callback;
					// Browser calls the wrapper and wrapper calls the callback
					originalWebkitRequestAnimationFrame(wrapper, element);
				}
			}

			return window.requestAnimationFrame    ||
				window.webkitRequestAnimationFrame ||
				window.oRequestAnimationFrame      ||
				window.msRequestAnimationFrame     ||
				function (callback, element) {
					var start, finish;
					window.setTimeout( function () {
						start = +new Date();
						callback(start);
						finish = +new Date();
						self.timeout = 1000 / Drawer.FRAME_RATE - (finish - start);
					}, self.timeout);
				}
			;
		})();
	}

	/**
	 * @param {vec} a
	 * @param {vec} b
	 * @param {[number, number, number]} color
	 * @param {number} width
	 * @param {number} alpha
	 */
	drawLine(a, b, color = [0,0,0], width = 1, alpha=1) {
		this.#ctx.beginPath();
		this.#drawLine(a, b, color, width, alpha);
		this.#ctx.setLineDash([]);
		this.#ctx.stroke();
	}

	/**
	 * @param {vec} a
	 * @param {vec} b
	 * @param {[number, number, number]} color
	 * @param {number} width
	 * @param {number} alpha
	 */
	drawLineD(a, b, color = [0,0,0], width = 1, alpha=1) {
		this.#ctx.beginPath();
		this.#drawLine(a, b, color, width, alpha);
		this.#ctx.setLineDash([2, 2]);
		this.#ctx.stroke();
	}

	/**
	 * @param {Array<vec>} points
	 * @param {[number, number, number]} color
	 * @param {number} width
	 * @param {number} alpha
	 */
	drawPolyline(points, color = [0,0,0], width = 1, alpha=1) {
		this.#ctx.beginPath();
		this.#ctx.moveTo(this.#offset.X + points[0].X, this.#offset.Y - points[0].Y);
		for (let i=1; i<points.length; i++) {
			this.#ctx.lineTo(this.#offset.X + points[i].X, this.#offset.Y - points[i].Y);
		}
		this.#ctx.lineWidth = width;
		this.#ctx.strokeStyle = "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + alpha + ")";
		this.#ctx.setLineDash([]);
		this.#ctx.stroke();
	}

	/**
	 * @param {Array<vec>} points
	 * @param {[number, number, number]} color
	 * @param {number} width
	 * @param {number} alpha
	 */
	drawPolylineD(points, color = [0,0,0], width = 1, alpha=1) {
		this.#ctx.beginPath();
		this.#ctx.moveTo(this.#offset.X + points[0].X, this.#offset.Y - points[0].Y);
		for (let i=1; i<points.length; i++) {
			this.#ctx.lineTo(this.#offset.X + points[i].X, this.#offset.Y - points[i].Y);
		}
		this.#ctx.lineWidth = width;
		this.#ctx.strokeStyle = "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + alpha + ")";
		this.#ctx.setLineDash([2, 2]);
		this.#ctx.stroke();
	}

	/**
	 * @param {vec} a
	 * @param {vec} b
	 * @param {[number, number, number]} color
	 * @param {number} width
	 * @param {number} alpha
	 */
	drawArrow(a, b, color = [0,0,0], width = 1, alpha = 1) {
		this.#ctx.beginPath();
		this.#drawLine(a, b, color, width, alpha);
		this.#ctx.setLineDash([]);
		this.#ctx.stroke();
		this.#fillArrow(a, b, color, alpha);
	}

	/**
	 * @param {vec} a
	 * @param {vec} b
	 * @param {[number, number, number]} color
	 * @param {number} width
	 * @param {number} alpha
	 */
	drawArrowD(a, b, color = [0,0,0], width = 1, alpha = 1) {
		this.#ctx.beginPath();
		this.#drawLine(a, b, color, width, alpha);
		this.#ctx.setLineDash([width, width]);
		this.#ctx.stroke();
		this.#fillArrow(a, b, color, alpha);
	}

	/**
	 * @param {vec} center
	 * @param {number} radius
	 * @param {[number, number, number]} color
	 * @param {number} width
	 */
	drawCircle(center, radius, color = [0,0,0], width = 1) {
		this.#ctx.beginPath();
		this.#ctx.arc(
			this.#offset.X + center.X,
			this.#offset.Y - center.Y,
			radius,
			0 * Math.PI / 180,
			360 * Math.PI / 180,
			false
		);
		this.#ctx.strokeStyle = "rgba(" + color[0] + "," + color[1] + "," + color[2] + ",0.8)" ;
		this.#ctx.lineWidth = width;
		this.#ctx.setLineDash([]);
		this.#ctx.stroke();
	}

	/**
	 * @param {vec} center
	 * @param {number} radius
	 * @param {number} begin
	 * @param {number} elapse
	 * @param {[number, number, number]} color
	 * @param {number} width
	 */
	drawArc(center, radius, begin = 0, elapse = 2 * Math.PI, color = [0,0,0], width = 1) {
		this.#ctx.beginPath();
		this.#ctx.arc(
			this.#offset.X + center.X,
			this.#offset.Y - center.Y,
			radius,
			-begin,
			-elapse,
			true
		);
		this.#ctx.strokeStyle = "rgba(" + color[0] + "," + color[1] + "," + color[2] + ",0.8)" ;
		this.#ctx.lineWidth = width;
		this.#ctx.setLineDash([]);
		this.#ctx.stroke();
	}

	/**
	 * @param {vec} center
	 * @param {number} radius
	 * @param {[number, number, number]} color
	 * @param {number} width
	 */
	drawCircleD(center, radius, color = [0,0,0], width = 1) {
		this.#ctx.beginPath();
		this.#ctx.arc(
			this.#offset.X + center.X,
			this.#offset.Y - center.Y,
			radius,
			0 * Math.PI / 180,
			360 * Math.PI / 180,
			false
		);
		this.#ctx.strokeStyle = "rgba(" + color[0] + "," + color[1] + "," + color[2] + ",0.8)" ;
		this.#ctx.lineWidth = width;
		this.#ctx.setLineDash([2, 2]);
		this.#ctx.stroke();
	}

	/**
	 * @param {vec} center
	 * @param {number} radius
	 * @param {[number, number, number]} color
	 * @param {number} alpha
	 */
	fillCircle(center, radius, color = [0,0,0], alpha=1) {
		this.#ctx.beginPath();
		this.#ctx.arc(
			this.#offset.X + center.X,
			this.#offset.Y - center.Y,
			radius,
			0 * Math.PI / 180,
			360 * Math.PI / 180,
			false
		);
		this.#ctx.fillStyle = "rgba(" + color[0] + "," + color[1] + "," + color[2] + ", " + alpha + ")" ;
		this.#ctx.fill();
	}

	/**
	 * @param {Array<vec>} points
	 * @param {vec} ofs
	 * @param {[number, number, number]} color
	 * @param {number} alpha
	 */
	fillPolygon(points, ofs = new vec(), color = [0,0,0], alpha=0.66) {
		this.#ctx.beginPath();
		this.#ctx.moveTo(ofs.X + points[0].X, ofs.Y - points[0].Y);
		for (let i=1; i<points.length; i++) {
			this.#ctx.lineTo(ofs.X + points[i].X, ofs.Y - points[i].Y);
		}
		this.#ctx.fillStyle = "rgba(" + color[0] + "," + color[1] + "," + color[2] + ", " + alpha + ")";
		this.#ctx.fill();
	}

	/**
	 * @param {vec} p
	 * @param {string} value
	 * @param {number} size
	 * @param {[number, number, number]} color
	 */
	drawString(p, value, size = 11, color = [0,0,0]) {
		this.#ctx.font = size + "px " + Drawer.#FONT_NAME;
		this.#ctx.fillStyle = "rgba(" + color[0] + "," + color[1] + "," + color[2] + ",1)" ;
		let px = this.#offset.X + p.X;
		let py = this.#offset.Y - p.Y;
		let lines = value.split("\n");
		for(let i=0; i<lines.length; i++) {
			this.#ctx.fillText(lines[i], px, py);
			py += size;
		}
	}

	/**
	 * @param {vec} p
	 * @param {string} value
	 * @param {number} size
	 * @param {[number, number, number]} color
	 */
	drawStringC(p, value, size = 11, color = [0,0,0]) {
		this.#ctx.font = size + "px " + Drawer.#FONT_NAME;
		this.#ctx.fillStyle = "rgba(" + color[0] + "," + color[1] + "," + color[2] + ",1)" ;
		let lines = value.split("\n");
		let px = this.#offset.X + p.X;
		let py = this.#offset.Y - p.Y + size / 2;
		for(let i=0; i<lines.length; i++) {
			let met = this.#ctx.measureText(lines[i]);
			this.#ctx.fillText(lines[i], px - met.width / 2, py);
			py += size;
		}
	}

	/**
	 * @param {string} value
	 * @param {number} size
	 * @return {number}
	 */
	getTextWidth(value, size = 11) {
		this.#ctx.font = size + "px " + Drawer.#FONT_NAME;
		return this.#ctx.measureText(value).width;
	}

	clear() {
		var w = this.#element.width;
		var h = this.#element.height;
		this.#ctx.clearRect(0, 0, w, h);
	}

	/**
	 * @param {number} value (between -1 and 1)
	 * @returns {[number, number, number]}
	 */
	static ToHue(value) {
		if (1 < value) value = 1;
		if (value < -1) value = -1;
		value = 2 * value / (value*value+1);
		value = parseInt(1023*(value/2+0.5));

		let r, g, b;
		if(value < 256) {
			r = 0;
			g = value;
			b = 255;
		} else if(value < 512) {
			value -= 256;
			r = 0;
			g = 255;
			b = 255-value;
		} else if(value < 768) {
			value -= 512;
			r = value;
			g = 255;
			b = 0;
		} else {
			value -= 768;
			r = 255;
			g = 255 - value;
			b = 0;
		}
		return [r, g, b];
	}

	/**
	 * @param {vec} a
	 * @param {vec} b
	 * @param {[number, number, number]} color
	 * @param {number} width
	 * @param {number} alpha
	 */
	#drawLine(a, b, color, width, alpha=1) {
		let x1 = this.#offset.X + a.X;
		let y1 = this.#offset.Y - a.Y;
		let x2 = this.#offset.X + b.X;
		let y2 = this.#offset.Y - b.Y;
		this.#ctx.strokeStyle = "rgba(" + color[0] + "," + color[1] + "," + color[2] + ", " + alpha + ")" ;
		this.#ctx.lineWidth = width;
		this.#ctx.moveTo(x1, y1);
		this.#ctx.lineTo(x2, y2);
	}

	/**
	 * @param {vec} a
	 * @param {vec} b
	 * @param {[number, number, number]} color
	 * @param {number} alpha
	 */
	#fillArrow(a, b, color, alpha=1) {
		const SIZE = 15;
		let polygon = [
			new vec(0, 0),
			new vec(-1, 0.33),
			new vec(-1, -0.33),
			new vec(0, 0)
		];
		let th = Math.atan2(b.Y - a.Y, b.X - a.X);
		for (let i=0; i<polygon.length; i++) {
			let x = polygon[i].X;
			let y = polygon[i].Y;
			polygon[i].X = SIZE * (x*Math.cos(th) - y*Math.sin(th)) + b.X;
			polygon[i].Y = SIZE * (x*Math.sin(th) + y*Math.cos(th)) + b.Y;
		}
		this.fillPolygon(polygon, this.#offset, color, alpha);
	}

	/**
	 * @param {number} x
	 * @param {number} y
	 */
	#roundCursor(x, y) {
		this.cursor.X = parseInt(x / Drawer.CursorDiv + Math.sign(x) * 0.5) * Drawer.CursorDiv - this.#offset.X;
		this.cursor.Y = this.#offset.Y - parseInt(y / Drawer.CursorDiv + Math.sign(x) * 0.5) * Drawer.CursorDiv;
	}
}
