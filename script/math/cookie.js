class COOKIE {
	constructor() {
		this.prefix = "mjx";
		this.expires = 365;
	}

	Set(a, e) {
		var d = [];
		if (e) {
			for (var g in e) {
				if (e.hasOwnProperty(g)) {
					d.push(g + ":" + e[g].toString().replace(/&/g, "&&"));
				}
			}
		}
		var b = this.prefix + "." + a + "=" + escape(d.join("&;"));
		if (this.expires) {
			var f = new Date();
			f.setDate(f.getDate() + this.expires);
			b += "; expires=" + f.toGMTString();
		}
		try {
			document.cookie = b + "; path=/";
		} catch (c) { }
	}

	Get(a, d) {
		if (!d) { d = {} }
		var g = new RegExp("(?:^|;\\s*)" + this.prefix + "\\." + a + "=([^;]*)(?:;|$)");
		var f;
		try {
			f = g.exec(document.cookie);
		} catch (c) { }
		if (f && f[1] !== "") {
			var j = unescape(f[1]).split("&;");
			for (var e = 0, b = j.length; e < b; e++) {
				f = j[e].match(/([^:]+):(.*)/);
				var h = f[2].replace(/&&/g, "&");
				if (h === "true") {
					h = true;
				} else {
					if (h === "false") {
						h = false;
					} else {
						if (h.match(/^-?(\d+(\.\d+)?|\.\d+)$/)) { h = parseFloat(h) }
					}
				}
				d[f[1]] = h;
			}
		}
		return d;
	}
}
