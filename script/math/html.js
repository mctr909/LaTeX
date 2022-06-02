///<reference path="cookie.js"/>

class Html {
	constructor() {
		this.Cookie = new COOKIE();
	}

	Element(d, f, e) {
		var g = document.createElement(d), h;
		if (f) {
			if (f.hasOwnProperty("style")) {
				var c = f.style;
				f.style = {};
				for (h in c) {
					if (c.hasOwnProperty(h)) {
						f.style[h.replace(/-([a-z])/g, this.ucMatch)] = c[h];
					}
				}
			}
			MathJax.Hub.Insert(g, f);
			for (h in f) {
				if (h === "role" || h.substr(0, 5) === "aria-") {
					g.setAttribute(h, f[h]);
				}
			}
		}
		if (e) {
			if (!MathJax.Object.isArray(e)) {
				e = [e];
			}
			for (var b = 0, a = e.length; b < a; b++) {
				if (MathJax.Object.isArray(e[b])) {
					g.appendChild(this.Element(e[b][0], e[b][1], e[b][2]));
				} else {
					if (d === "script") {
						this.setScript(g, e[b]);
					} else {
						g.appendChild(document.createTextNode(e[b]));
					}
				}
			}
		}
		return g;
	}

	ucMatch(a, b) {
		return b.toUpperCase();
	}

	addElement(b, a, d, c) {
		return b.appendChild(this.Element(a, d, c));
	}

	TextNode(a) {
		return document.createTextNode(a);
	}

	addText(a, b) {
		return a.appendChild(this.TextNode(b));
	}

	setScript(a, b) {
		if (this.setScriptBug) {
			a.text = b;
		} else {
			while (a.firstChild) {
				a.removeChild(a.firstChild);
			}
			this.addText(a, b);
		}
	}

	getScript(a) {
		var b = (a.text === "" ? a.innerHTML : a.text);
		return b.replace(/^\s+/, "").replace(/\s+$/, "");
	}
}
