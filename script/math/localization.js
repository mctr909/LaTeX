///<reference path="../MathJax.js"/>

class LOCAL {
	constructor() {
		this.locale = "en";
		this.directory = "[MathJax]/localization";
		this.strings = {
			ast: { menuTitle: "asturianu" },
			bg: { menuTitle: "\u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438" },
			bcc: { menuTitle: "\u0628\u0644\u0648\u0686\u06CC" },
			br: { menuTitle: "brezhoneg" },
			ca: { menuTitle: "catal\u00E0" },
			cdo: { menuTitle: "M\u00ECng-d\u0115\u0324ng-ng\u1E73\u0304" },
			cs: { menuTitle: "\u010De\u0161tina" },
			da: { menuTitle: "dansk" },
			de: { menuTitle: "Deutsch" },
			diq: { menuTitle: "Zazaki" },
			en: {
				menuTitle: "English",
				isLoaded: true
			},
			eo: { menuTitle: "Esperanto" },
			es: { menuTitle: "espa\u00F1ol" },
			fa: { menuTitle: "\u0641\u0627\u0631\u0633\u06CC" },
			fi: { menuTitle: "suomi" },
			fr: { menuTitle: "fran\u00E7ais" },
			gl: { menuTitle: "galego" },
			he: { menuTitle: "\u05E2\u05D1\u05E8\u05D9\u05EA" },
			ia: { menuTitle: "interlingua" },
			it: { menuTitle: "italiano" },
			ja: { menuTitle: "\u65E5\u672C\u8A9E" },
			kn: { menuTitle: "\u0C95\u0CA8\u0CCD\u0CA8\u0CA1" },
			ko: { menuTitle: "\uD55C\uAD6D\uC5B4" },
			lb: { menuTitle: "L\u00EBtzebuergesch" },
			lki: { menuTitle: "\u0644\u06D5\u06A9\u06CC" },
			lt: { menuTitle: "lietuvi\u0173" },
			mk: { menuTitle: "\u043C\u0430\u043A\u0435\u0434\u043E\u043D\u0441\u043A\u0438" },
			nl: { menuTitle: "Nederlands" },
			oc: { menuTitle: "occitan" },
			pl: { menuTitle: "polski" },
			pt: { menuTitle: "portugus\u00EA" },
			"pt-br": {
				menuTitle: "portugu\u00EAs do Brasil"
			},
			ru: { menuTitle: "\u0440\u0443\u0441\u0441\u043A\u0438\u0439" },
			sco: { menuTitle: "Scots" },
			scn: { menuTitle: "sicilianu" },
			sl: { menuTitle: "sloven\u0161\u010Dina" },
			sv: { menuTitle: "svenska" },
			tr: { menuTitle: "T\u00FCrk\u00E7e" },
			uk: { menuTitle: "\u0443\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430" },
			vi: { menuTitle: "Ti\u1EBFng Vi\u1EC7t" },
			"zh-hans": { menuTitle: "\u4E2D\u6587\uFF08\u7B80\u4F53\uFF09" }
		};
		this.pattern = /%(\d+|\{\d+\}|\{[a-z]+:\%\d+(?:\|(?:%\{\d+\}|%.|[^\}])*)+\}|.)/g;
		this.markdownPattern = /(%.)|(\*{1,3})((?:%.|.)+?)\2|(`+)((?:%.|.)+?)\4|\[((?:%.|.)+?)\]\(([^\s\)]+)\)/;
	}

	SPLIT(strA, strB) {
		if ("axb".split(/(x)/).length === 3) {
			return strA.split(strB);
		} else {
			var ret = [], b, idx = 0;
			strB.lastIndex = 0;
			while ((b = strB.exec(strA))) {
				ret.push(strA.substr(idx, b.index - idx));
				ret.push.apply(ret, b.slice(1));
				idx = b.index + b[0].length;
			}
			ret.push(strA.substr(idx));
			return ret;
		}
	}

	_(pb, pa) {
		if (MathJax.Object.isArray(pa)) {
			return this.processSnippet(pb, pa);
		}
		var ph = this.lookupPhrase(pb, pa);
		var arg = [].slice.call(arguments, 2);
		return this.processString(ph, arg);
	}

	processString(l, p, g) {
		var j, e, o = MathJax.Object.isArray;
		for (j = 0, e = p.length; j < e; j++) {
			if (g && o(p[j])) {
				p[j] = this.processSnippet(g, p[j]);
			}
		}
		var f = this.SPLIT(l, this.pattern);
		for (j = 1, e = f.length; j < e; j += 2) {
			var q = f[j].charAt(0);
			if (q >= "0" && q <= "9") {
				f[j] = p[f[j] - 1];
				if (typeof f[j] === "number") {
					f[j] = this.number(f[j]);
				}
			} else {
				if (q === "{") {
					q = f[j].substr(1);
					if (q >= "0" && q <= "9") {
						f[j] = p[f[j].substr(1, f[j].length - 2) - 1];
						if (typeof f[j] === "number") {
							f[j] = this.number(f[j]);
						}
					} else {
						var k = f[j].match(/^\{([a-z]+):%(\d+)\|(.*)\}$/);
						if (k) {
							if (k[1] === "plural") {
								var d = p[k[2] - 1];
								if (typeof d === "undefined") {
									f[j] = "???";
								} else {
									d = this.plural(d) - 1;
									var h = k[3].replace(/(^|[^%])(%%)*%\|/g, "$1$2%\uEFEF").split(/\|/);
									if (d >= 0 && d < h.length) {
										f[j] = this.processString(h[d].replace(/\uEFEF/g, "|"), p, g);
									} else {
										f[j] = "???";
									}
								}
							} else {
								f[j] = "%" + f[j];
							}
						}
					}
				}
			}
			if (f[j] == null) {
				f[j] = "???";
			}
		}
		if (!g) {
			return f.join("");
		}
		var a = [], b = "";
		for (j = 0; j < e; j++) {
			b += f[j]; j++;
			if (j < e) {
				if (o(f[j])) {
					a.push(b);
					a = a.concat(f[j]);
					b = "";
				} else {
					b += f[j];
				}
			}
		}
		if (b !== "") {
			a.push(b)
		}
		return a;
	}

	processSnippet(g, e) {
		var c = [];
		for (var d = 0, b = e.length; d < b; d++) {
			if (MathJax.Object.isArray(e[d])) {
				var f = e[d];
				if (typeof f[1] === "string") {
					var h = f[0];
					if (!MathJax.Object.isArray(h)) {
						h = [g, h];
					}
					var a = this.lookupPhrase(h, f[1]);
					c = c.concat(this.processMarkdown(a, f.slice(2), g));
				} else {
					if (MathJax.Object.isArray(f[1])) {
						c = c.concat(this.processSnippet.apply(this, f));
					} else {
						if (f.length >= 3) {
							c.push([f[0], f[1], this.processSnippet(g, f[2])]);
						} else {
							c.push(e[d]);
						}
					}
				}
			} else {
				c.push(e[d]);
			}
		}
		return c;
	}

	processMarkdown(b, h, d) {
		var j = [], e;
		var c = b.split(this.markdownPattern);
		var g = c[0];
		for (var f = 1, a = c.length; f < a; f += 8) {
			if (c[f + 1]) {
				e = this.processString(c[f + 2], h, d);
				if (!MathJax.Object.isArray(e)) {
					e = [e];
				}
				e = [["b", "i", "i"][c[f + 1].length - 1], {}, e];
				if (c[f + 1].length === 3) { e = ["b", {}, e] }
			} else {
				if (c[f + 3]) {
					e = this.processString(c[f + 4].replace(/^\s/, "").replace(/\s$/, ""), h, d);
					if (!MathJax.Object.isArray(e)) { e = [e] }
					e = ["code", {}, e];
				} else {
					if (c[f + 5]) {
						e = this.processString(c[f + 5], h, d);
						if (!MathJax.Object.isArray(e)) { e = [e] }
						e = ["a", { href: this.processString(c[f + 6], h), target: "_blank" }, e];
					} else {
						g += c[f];
						e = null;
					}
				}
			}
			if (e) {
				j = this.concatString(j, g, h, d);
				j.push(e);
				g = "";
			}
			if (c[f + 7] !== "") { g += c[f + 7] }
		}
		j = this.concatString(j, g, h, d);
		return j;
	}

	concatString(a, c, b, d) {
		if (c != "") {
			c = this.processString(c, b, d);
			if (!MathJax.Object.isArray(c)) { c = [c] }
			a = a.concat(c);
		}
		return a;
	}

	lookupPhrase(f, a, d) {
		if (!d) { d = "_" }
		if (MathJax.Object.isArray(f)) {
			d = (f[0] || "_");
			f = (f[1] || "");
		}
		var c = this.loadDomain(d);
		if (c) { MathJax.Hub.RestartAfter(c) }
		var b = this.strings[this.locale];
		if (b) {
			if (b.domains && d in b.domains) {
				var e = b.domains[d];
				if (e.strings && f in e.strings) { a = e.strings[f] }
			}
		}
		return a;
	}

	loadFile(b, d, e) {
		e = MathJax.Callback(e);
		b = (d.file || b);
		if (!b.match(/\.js$/)) { b += ".js" }
		if (!b.match(/^([a-z]+:|\[MathJax\])/)) {
			var a = (this.strings[this.locale].directory || this.directory + "/" + this.locale || "[MathJax]/localization/" + this.locale);
			b = a + "/" + b;
		}
		var c = MathJax.Ajax.Require(b, function () {
			d.isLoaded = true;
			return e();
		});
		return (c.called ? null : c);
	}

	loadDomain(c, e) {
		var b, a = this.strings[this.locale];
		if (a) {
			if (!a.isLoaded) {
				b = this.loadFile(this.locale, a);
				if (b) {
					return new QUEUE(b, ["loadDomain", this, c]).Push(e || {});
				}
			}
			if (a.domains && c in a.domains) {
				var d = a.domains[c];
				if (!d.isLoaded) {
					b = this.loadFile(c, d);
					if (b) {
						return new QUEUE(b).Push(e);
					}
				}
			}
		}
		return MathJax.Callback(e)();
	}

	Try(a) {
		a = MathJax.Callback(a);
		a.autoReset = true;
		try { a() }
		catch (b) {
			if (!b.restart) { throw b }
			MathJax.Callback.After(["Try", this, a], b.restart);
		}
	}

	resetLocale(a) {
		if (!a) {
			return;
		}
		a = a.toLowerCase();
		while (!this.strings[a]) {
			var c = a.lastIndexOf("-");
			if (c === -1) {
				return;
			}
			a = a.substring(0, c);
		}
		var b = this.strings[a].remap;
		this.locale = b ? b : a;
	}

	setLocale(a) {
		this.resetLocale(a);
		if (MathJax.Menu) { this.loadDomain("MathMenu") }
	}

	addTranslation(b, e, c) {
		var d = this.strings[b], a = false;
		if (!d) {
			d = this.strings[b] = {};
			a = true;
		}
		if (!d.domains) { d.domains = {} }
		if (e) {
			if (!d.domains[e]) { d.domains[e] = {} }
			d = d.domains[e];
		}
		MathJax.Hub.Insert(d, c);
		if (a && MathJax.Menu.menu) { MathJax.Menu.CreateLocaleMenu() }
	}

	setCSS(b) {
		var a = this.strings[this.locale];
		if (a) {
			if (a.fontFamily) {
				b.style.fontFamily = a.fontFamily;
			}
			if (a.fontDirection) {
				b.style.direction = a.fontDirection;
				if (a.fontDirection === "rtl") { b.style.textAlign = "right" }
			}
		}
		return b;
	}

	fontFamily() {
		var a = this.strings[this.locale];
		return (a ? a.fontFamily : null);
	}

	fontDirection() {
		var a = this.strings[this.locale];
		return (a ? a.fontDirection : null);
	}

	plural(b) {
		var a = this.strings[this.locale];
		if (a && a.plural) {
			return a.plural(b);
		}
		if (b == 1) {
			return 1;
		}
		return 2;
	}

	number(b) {
		var a = this.strings[this.locale];
		if (a && a.number) {
			return a.number(b);
		}
		return b;
	}
}
