///<reference path="../MathJax.js"/>

class STARTUP {
	constructor() {
		this.script = "";
		this.queue = MathJax.Callback.Queue();
		this.signal = MathJax.Callback.Signal("Startup");
		this.params = {};
	}

	Config() {
		this.queue.Push(["Post", this.signal, "Begin Config"]);
		if (MathJax.AuthorConfig && MathJax.AuthorConfig.root) {
			MathJax.Ajax.config.root = MathJax.AuthorConfig.root;
		}
		if (this.params.locale) {
			MathJax.Localization.resetLocale(this.params.locale);
			MathJax.Hub.config.menuSettings.locale = this.params.locale;
		}
		if (this.params.config) {
			var c = this.params.config.split(/,/);
			for (var b = 0, a = c.length; b < a; b++) {
				if (!c[b].match(/\.js$/)) { c[b] += ".js" }
				this.queue.Push(["Require", MathJax.Ajax, this.URL("config", c[b])]);
			}
		}
		this.queue.Push(["Config", MathJax.Hub, MathJax.AuthorConfig]);
		if (this.script.match(/\S/)) {
			this.queue.Push(this.script + ";\n1;");
		}
		this.queue.Push(
			["ConfigDelay", this],
			["ConfigBlocks", this],
			[function (d) {
				return d.loadArray(MathJax.Hub.config.config, "config", null, true);
			}, this],
			["Post", this.signal, "End Config"]
		);
	}

	ConfigDelay() {
		var a = this.params.delayStartupUntil || MathJax.Hub.config.delayStartupUntil;
		if (a === "onload") {
			return this.onload;
		}
		if (a === "configured") {
			return MathJax.Hub.Configured;
		}
		return a;
	}

	ConfigBlocks() {
		var c = document.getElementsByTagName("script");
		var b = MathJax.Callback.Queue();
		for (var d = 0, a = c.length; d < a; d++) {
			var e = String(c[d].type).replace(/ /g, "");
			if (e.match(/^text\/x-mathjax-config(;.*)?$/) && !e.match(/;executed=true/)) {
				c[d].type += ";executed=true";
				b.Push(c[d].innerHTML + ";\n1;");
			}
		}
		return b.Push(function () {
			MathJax.Ajax.config.root = MathJax.Hub.config.root;
		});
	}

	Cookie() {
		return this.queue.Push(
			["Post", this.signal, "Begin Cookie"],
			["Get", MathJax.HTML.Cookie, "menu", MathJax.Hub.config.menuSettings],
			[function (e) {
				var d = e.menuSettings;
				if (d.locale) {
					MathJax.Localization.resetLocale(d.locale);
				}
				var g = e.menuSettings.renderer, b = e.jax;
				if (g) {
					var c = "output/" + g; b.sort();
					for (var f = 0, a = b.length; f < a; f++) {
						if (b[f].substr(0, 7) === "output/") { break }
					}
					if (f == a - 1) { b.pop() }
					else {
						while (f < a) {
							if (b[f] === c) {
								b.splice(f, 1);
								break;
							}
							f++;
						}
					}
					b.unshift(c);
				}
				if (d.CHTMLpreview != null) {
					if (d.FastPreview == null) {
						d.FastPreview = d.CHTMLpreview;
					}
					delete d.CHTMLpreview;
				}
				if (d.FastPreview && !MathJax.Extension["fast-preview"]) {
					MathJax.Hub.config.extensions.push("fast-preview.js");
				}
				if (e.menuSettings.assistiveMML && !MathJax.Extension.AssistiveMML) {
					MathJax.Hub.config.extensions.push("AssistiveMML.js");
				}
			}, MathJax.Hub.config],
			["Post", this.signal, "End Cookie"]
		);
	}

	Styles() {
		return this.queue.Push(
			["Post", this.signal, "Begin Styles"],
			["loadArray", this, MathJax.Hub.config.styleSheets, "config"],
			["Styles", MathJax.Ajax, MathJax.Hub.config.styles],
			["Post", this.signal, "End Styles"]
		);
	}

	Jax() {
		var f = MathJax.Hub.config, c = MathJax.Hub.outputJax;
		for (var g = 0, b = f.jax.length, d = 0; g < b; g++) {
			var e = f.jax[g].substr(7);
			if (f.jax[g].substr(0, 7) === "output/" && c.order[e] == null) { c.order[e] = d; d++ }
		}
		var a = MathJax.Callback.Queue();
		return a.Push(
			["Post", this.signal, "Begin Jax"],
			["loadArray", this, f.jax, "jax", "config.js"],
			["Post", this.signal, "End Jax"]
		);
	}

	Extensions() {
		var a = MathJax.Callback.Queue();
		return a.Push(
			["Post", this.signal, "Begin Extensions"],
			["loadArray", this, MathJax.Hub.config.extensions, "extensions"],
			["Post", this.signal, "End Extensions"]
		);
	}

	Message() {
		MathJax.Message.Init(true);
	}

	Menu() {
		var b = MathJax.Hub.config.menuSettings, a = MathJax.Hub.outputJax, d;
		for (var c in a) {
			if (a.hasOwnProperty(c)) {
				if (a[c].length) {
					d = a[c];
					break;
				}
			}
		}
		if (d && d.length) {
			if (b.renderer && b.renderer !== d[0].id) {
				d.unshift(MathJax.OutputJax[b.renderer]);
			}
			b.renderer = d[0].id;
		}
	}

	Hash() {
		if (MathJax.Hub.config.positionToHash && document.location.hash && document.body && document.body.scrollIntoView) {
			var d = document.location.hash.substr(1);
			var f = document.getElementById(d);
			if (!f) {
				var c = document.getElementsByTagName("a");
				for (var e = 0, b = c.length; e < b; e++) {
					if (c[e].name === d) {
						f = c[e];
						break;
					}
				}
			}
			if (f) {
				while (!f.scrollIntoView) { f = f.parentNode }
				f = this.HashCheck(f);
				if (f && f.scrollIntoView) {
					setTimeout(function () { f.scrollIntoView(true); }, 1);
				}
			}
		}
	}

	HashCheck(b) {
		var a = MathJax.Hub.getJaxFor(b);
		if (a && MathJax.OutputJax[a.outputJax].hashCheck) {
			b = MathJax.OutputJax[a.outputJax].hashCheck(b);
		}
		return b;
	}

	MenuZoom() {
		if (MathJax.Hub.config.showMathMenu) {
			if (!MathJax.Extension.MathMenu) {
				setTimeout(function () {
					MathJax.Callback.Queue(
						["Require", MathJax.Ajax, "[MathJax]/extensions/MathMenu.js", {}],
						["loadDomain", MathJax.Localization, "MathMenu"]
					);
				}, 1000);
			} else {
				setTimeout(MathJax.Callback(["loadDomain", MathJax.Localization, "MathMenu"]), 1000);
			}
			if (!MathJax.Extension.MathZoom) {
				setTimeout(MathJax.Callback(["Require", MathJax.Ajax, "[MathJax]/extensions/MathZoom.js", {}]), 2000);
			}
		}
	}

	onLoad() {
		var a = this.onload = MathJax.Callback(function () {
			MathJax.Hub.Startup.signal.Post("onLoad");
		});
		if (document.body && document.readyState) {
			if (MathJax.Hub.Browser.isMSIE) {
				if (document.readyState === "complete") {
					return [a];
				}
			} else {
				if (document.readyState !== "loading") {
					return [a];
				}
			}
		}
		if (window.addEventListener) {
			window.addEventListener("load", a, false);
			if (!this.params.noDOMContentEvent) {
				window.addEventListener("DOMContentLoaded", a, false);
			}
		} else {
			if (window.attachEvent) {
				window.attachEvent("onload", a);
			} else {
				window.onload = a;
			}
		}
		return a;
	}

	Typeset(a, b) {
		if (MathJax.Hub.config.skipStartupTypeset) {
			return function () { };
		}
		return this.queue.Push(
			["Post", this.signal, "Begin Typeset"],
			["Typeset", MathJax.Hub, a, b],
			["Post", this.signal, "End Typeset"]
		);
	}

	URL(b, a) {
		if (!a.match(/^([a-z]+:\/\/|\[|\/)/)) {
			a = "[MathJax]/" + b + "/" + a;
		}
		return a;
	}

	loadArray(b, f, c, a) {
		if (b) {
			if (!MathJax.Object.isArray(b)) { b = [b] }
			if (b.length) {
				var h = MathJax.Callback.Queue(), j = {}, e;
				for (var g = 0, d = b.length; g < d; g++) {
					e = this.URL(f, b[g]);
					if (c) { e += "/" + c }
					if (a) {
						h.Push(["Require", MathJax.Ajax, e, j]);
					} else {
						h.Push(MathJax.Ajax.Require(e, j));
					}
				}
				return h.Push({});
			}
		}
		return null;
	}
}
