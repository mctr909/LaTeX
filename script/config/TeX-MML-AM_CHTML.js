///<reference path="../MathJax.js"/>
///<reference path="TeXParser.js"/>

MathJax.Ajax.Preloading(
	"[MathJax]/jax/input/TeX/config.js",
	"[MathJax]/jax/input/MathML/config.js",
	"[MathJax]/jax/input/AsciiMath/config.js",
	"[MathJax]/jax/output/CommonHTML/config.js",
	"[MathJax]/jax/output/PreviewHTML/config.js",
	"[MathJax]/extensions/tex2jax.js",
	"[MathJax]/extensions/mml2jax.js",
	"[MathJax]/extensions/asciimath2jax.js",
	"[MathJax]/extensions/MathEvents.js",
	"[MathJax]/extensions/MathZoom.js",
	"[MathJax]/extensions/MathMenu.js",
	"[MathJax]/jax/element/mml/jax.js",
	"[MathJax]/extensions/toMathML.js",
	"[MathJax]/extensions/TeX/noErrors.js",
	"[MathJax]/extensions/TeX/noUndefined.js",
	"[MathJax]/jax/input/TeX/jax.js",
	"[MathJax]/extensions/TeX/AMSmath.js",
	"[MathJax]/extensions/TeX/AMSsymbols.js",
	"[MathJax]/jax/input/MathML/jax.js",
	"[MathJax]/jax/input/AsciiMath/jax.js",
	"[MathJax]/jax/output/PreviewHTML/jax.js",
	"[MathJax]/extensions/fast-preview.js",
	"[MathJax]/extensions/AssistiveMML.js",
	"[MathJax]/extensions/a11y/accessibility-menu.js"
);

class TeX {
	constructor() {
		this.id = "TeX";
		this.version = "2.7.1";
		this.directory = MathJax.InputJax.directory + "/TeX";
		this.extensionDir = MathJax.InputJax.extensionDir + "/TeX";
		this.config = {
			TagSide: "right",
			TagIndent: "0.8em",
			MultLineWidth: "85%",
			equationNumbers: {
				autoNumber: "none",
				formatNumber: function (a) { return a },
				formatTag: function (a) {
					return "(" + a + ")";
				},
				formatID: function (a) {
					return "mjx-eqn-" + String(a).replace(/[:"'<>&]/g, "");
				},
				formatURL: function (b, a) { return a + "#" + escape(b) },
				useLabelIds: true
			}
		};
	}
	resetEquationNumbers() { }
}

class CommonHTML {
	constructor() {
		this.id = "CommonHTML";
		this.version = "2.7.1";
		this.directory = MathJax.OutputJax.directory + "/CommonHTML";
		this.extensionDir = MathJax.OutputJax.extensionDir + "/CommonHTML";
		this.autoloadDir = MathJax.OutputJax.directory + "/CommonHTML/autoload";
		this.fontDir = MathJax.OutputJax.directory + "/CommonHTML/fonts";
		this.webfontDir = MathJax.OutputJax.fontDir + "/HTML-CSS";
		this.config = {
			matchFontHeight: true,
			scale: 100,
			minScaleAdjust: 50,
			mtextFontInherit: false,
			undefinedFamily: "STIXGeneral,'Cambria Math','Arial Unicode MS',serif",
			EqnChunk: (MathJax.Hub.Browser.isMobile ? 20 : 100),
			EqnChunkFactor: 1.5,
			EqnChunkDelay: 100,
			linebreaks: {
				automatic: false,
				width: "container"
			}
		};
	}
}

class PreviewHTML {
	constructor() {
		this.id = "PreviewHTML";
		this.version = "2.7.1";
		this.directory = MathJax.OutputJax.directory + "/PreviewHTML";
		this.extensionDir = MathJax.OutputJax.extensionDir + "/PreviewHTML";
		this.noFastPreview = true;
		this.config = {
			scale: 100,
			minScaleAdjust: 50,
			mtextFontInherit: false,
			linebreaks: {
				automatic: false,
				width: "container"
			}
		};
	}
}

class Tex2Jax {
	constructor() {
		this.version = "2.7.1";
		this.config = {
			inlineMath: [["\\(", "\\)"]],
			displayMath: [["$$", "$$"], ["\\[", "\\]"]],
			balanceBraces: true,
			skipTags: ["script", "noscript", "style", "textarea", "pre", "code", "annotation", "annotation-xml"],
			ignoreClass: "tex2jax_ignore",
			processClass: "tex2jax_process",
			processEscapes: false,
			processEnvironments: true,
			processRefs: true,
			preview: "TeX"
		};
		this.ignoreTags = {
			br: (MathJax.Hub.Browser.isMSIE && document.documentMode < 9 ? "\n" : " "),
			wbr: "", "#comment": ""
		};
	}

	PreProcess(a) {
		if (!this.configured) {
			this.config = MathJax.Hub.CombineConfig("tex2jax", this.config);
			if (this.config.Augment) {
				MathJax.Hub.Insert(this, this.config.Augment);
			}
			if (typeof (this.config.previewTeX) !== "undefined" && !this.config.previewTeX) {
				this.config.preview = "none";
			}
			this.configured = true;
		}
		if (typeof (a) === "string") {
			a = document.getElementById(a);
		}
		if (!a) { a = document.body }
		if (this.createPatterns()) {
			this.scanElement(a, a.nextSibling);
		}
	}

	createPatterns() {
		var d = [], e = [], c, a, b = this.config;
		this.match = {};
		for (c = 0, a = b.inlineMath.length; c < a; c++) {
			d.push(this.patternQuote(b.inlineMath[c][0]));
			this.match[b.inlineMath[c][0]] = {
				mode: "",
				end: b.inlineMath[c][1],
				pattern: this.endPattern(b.inlineMath[c][1])
			}
		}
		for (c = 0, a = b.displayMath.length; c < a; c++) {
			d.push(this.patternQuote(b.displayMath[c][0]));
			this.match[b.displayMath[c][0]] = {
				mode: "; mode=display",
				end: b.displayMath[c][1],
				pattern: this.endPattern(b.displayMath[c][1])
			}
		}
		if (d.length) {
			e.push(d.sort(this.sortLength).join("|"));
		}
		if (b.processEnvironments) {
			e.push("\\\\begin\\{([^}]*)\\}");
		}
		if (b.processEscapes) { e.push("\\\\*\\\\\\$") }
		if (b.processRefs) { e.push("\\\\(eq)?ref\\{[^}]*\\}") }
		this.start = new RegExp(e.join("|"), "g");
		this.skipTags = new RegExp("^(" + b.skipTags.join("|") + ")$", "i");
		var f = [];
		if (MathJax.Hub.config.preRemoveClass) {
			f.push(MathJax.Hub.config.preRemoveClass);
		}
		if (b.ignoreClass) { f.push(b.ignoreClass) }
		this.ignoreClass = (f.length ? new RegExp("(^| )(" + f.join("|") + ")( |$)") : /^$/);
		this.processClass = new RegExp("(^| )(" + b.processClass + ")( |$)");
		return (e.length > 0);
	}

	patternQuote(a) {
		return a.replace(/([\^$(){}+*?\-|\[\]\:\\])/g, "\\$1");
	}

	endPattern(a) {
		return new RegExp(this.patternQuote(a) + "|\\\\.|[{}]", "g");
	}

	sortLength(d, c) {
		if (d.length !== c.length) {
			return c.length - d.length;
		}
		return (d == c ? 0 : (d < c ? -1 : 1));
	}

	scanElement(c, b, g) {
		var a, e, d, f;
		while (c && c != b) {
			if (c.nodeName.toLowerCase() === "#text") {
				if (!g) { c = this.scanText(c) }
			} else {
				a = (typeof (c.className) === "undefined" ? "" : c.className);
				e = (typeof (c.tagName) === "undefined" ? "" : c.tagName);
				if (typeof (a) !== "string") {
					a = String(a);
				}
				f = this.processClass.exec(a);
				if (c.firstChild && !a.match(/(^| )MathJax/) && (f || !this.skipTags.exec(e))) {
					d = (g || this.ignoreClass.exec(a)) && !f;
					this.scanElement(c.firstChild, b, d);
				}
			}
			if (c) { c = c.nextSibling }
		}
	}

	scanText(b) {
		if (b.nodeValue.replace(/\s+/, "") == "") { return b }
		var a, c;
		this.search = { start: true };
		this.pattern = this.start;
		while (b) {
			this.pattern.lastIndex = 0;
			while (b && b.nodeName.toLowerCase() === "#text" && (a = this.pattern.exec(b.nodeValue))) {
				if (this.search.start) {
					b = this.startMatch(a, b);
				} else {
					b = this.endMatch(a, b);
				}
			}
			if (this.search.matched) {
				b = this.encloseMath(b);
			}
			if (b) {
				do { c = b; b = b.nextSibling }
				while (b && this.ignoreTags[b.nodeName.toLowerCase()] != null);
				if (!b || b.nodeName !== "#text") {
					return (this.search.close ? this.prevEndMatch() : c);
				}
			}
		}
		return b;
	}

	startMatch(a, b) {
		var f = this.match[a[0]];
		if (f != null) {
			this.search = {
				end: f.end,
				mode: f.mode,
				pcount: 0,
				open: b,
				olen: a[0].length,
				opos: this.pattern.lastIndex - a[0].length
			};
			this.switchPattern(f.pattern);
		} else {
			if (a[0].substr(0, 6) === "\\begin") {
				this.search = {
					end: "\\end{" + a[1] + "}",
					mode: "; mode=display",
					pcount: 0,
					open: b,
					olen: 0,
					opos: this.pattern.lastIndex - a[0].length,
					isBeginEnd: true
				};
				this.switchPattern(this.endPattern(this.search.end));
			} else {
				if (a[0].substr(0, 4) === "\\ref" || a[0].substr(0, 6) === "\\eqref") {
					this.search = {
						mode: "",
						end: "",
						open: b,
						pcount: 0,
						olen: 0,
						opos: this.pattern.lastIndex - a[0].length
					};
					return this.endMatch([""], b);
				} else {
					var d = a[0].substr(0, a[0].length - 1), g, c;
					if (d.length % 2 === 0) {
						c = [d.replace(/\\\\/g, "\\")];
						g = 1;
					} else {
						c = [d.substr(1).replace(/\\\\/g, "\\"), "$"];
						g = 0;
					}
					c = MathJax.HTML.Element("span", null, c);
					var e = MathJax.HTML.TextNode(b.nodeValue.substr(0, a.index));
					b.nodeValue = b.nodeValue.substr(a.index + a[0].length - g);
					b.parentNode.insertBefore(c, b);
					b.parentNode.insertBefore(e, c);
					this.pattern.lastIndex = g;
				}
			}
		}
		return b;
	}

	endMatch(a, c) {
		var b = this.search;
		if (a[0] == b.end) {
			if (!b.close || b.pcount === 0) {
				b.close = c;
				b.cpos = this.pattern.lastIndex;
				b.clen = (b.isBeginEnd ? 0 : a[0].length);
			}
			if (b.pcount === 0) {
				b.matched = true;
				c = this.encloseMath(c);
				this.switchPattern(this.start);
			}
		} else {
			if (a[0] === "{") { b.pcount++ }
			else { if (a[0] === "}" && b.pcount) { b.pcount-- } }
		}
		return c;
	}

	prevEndMatch() {
		this.search.matched = true;
		var a = this.encloseMath(this.search.close);
		this.switchPattern(this.start);
		return a;
	}

	switchPattern(a) {
		a.lastIndex = this.pattern.lastIndex;
		this.pattern = a;
		this.search.start = (a === this.start);
	}

	encloseMath(_b) {
		var a = this.search, g = a.close, f, d, c;
		if (a.cpos === g.length) { g = g.nextSibling }
		else { g = g.splitText(a.cpos) }
		if (!g) {
			f = g = MathJax.HTML.addText(a.close.parentNode, "");
		}
		a.close = g;
		d = (a.opos ? a.open.splitText(a.opos) : a.open);
		while ((c = d.nextSibling) && c !== g) {
			if (c.nodeValue !== null) {
				if (c.nodeName === "#comment") {
					d.nodeValue += c.nodeValue.replace(/^\[CDATA\[((.|\n|\r)*)\]\]$/, "$1");
				} else {
					d.nodeValue += c.nodeValue;
				}
			} else {
				var h = this.ignoreTags[c.nodeName.toLowerCase()];
				d.nodeValue += (h == null ? " " : h);
			}
			d.parentNode.removeChild(c);
		}
		var e = d.nodeValue.substr(a.olen, d.nodeValue.length - a.olen - a.clen);
		d.parentNode.removeChild(d);
		if (this.config.preview !== "none") {
			this.createPreview(a.mode, e);
		}
		d = this.createMathTag(a.mode, e);
		this.search = {};
		this.pattern.lastIndex = 0;
		if (f) { f.parentNode.removeChild(f) }
		return d;
	}

	insertNode(b) {
		var a = this.search;
		a.close.parentNode.insertBefore(b, a.close);
	}

	createPreview(_d, a) {
		var b = MathJax.Hub.config.preRemoveClass;
		var c = this.config.preview;
		if (c === "none") {
			return;
		}
		if ((this.search.close.previousSibling || {}).className === b) {
			return;
		}
		if (c === "TeX") { c = [this.filterPreview(a)] }
		if (c) {
			c = MathJax.HTML.Element("span", { className: b }, c);
			this.insertNode(c);
		}
	}

	createMathTag(c, b) {
		var a = document.createElement("script");
		a.type = "math/tex" + c;
		MathJax.HTML.setScript(a, b);
		this.insertNode(a);
		return a;
	}

	filterPreview(a) { return a }
}

class MML2Jax {
	constructor() {
		this.version = "2.7.1";
		this.config = { preview: "mathml" };
		this.MMLnamespace = "http://www.w3.org/1998/Math/MathML";
	}

	PreProcess(e) {
		if (!this.configured) {
			this.config = MathJax.Hub.CombineConfig("mml2jax", this.config);
			if (this.config.Augment) {
				MathJax.Hub.Insert(this, this.config.Augment);
			}
			this.InitBrowser();
			this.configured = true;
		}
		if (typeof (e) === "string") {
			e = document.getElementById(e);
		}
		if (!e) { e = document.body }
		var h = [];
		this.PushMathElements(h, e, "math");
		this.PushMathElements(h, e, "math", this.MMLnamespace);
		var d, b;
		if (typeof (document.namespaces) !== "undefined") {
			try {
				for (d = 0, b = document.namespaces.length; d < b; d++) {
					var f = document.namespaces[d];
					if (f.urn === this.MMLnamespace) {
						this.PushMathElements(h, e, f.name + ":math");
					}
				}
			} catch (g) { }
		} else {
			var c = document.getElementsByTagName("html")[0];
			if (c) {
				for (d = 0, b = c.attributes.length; d < b; d++) {
					var a = c.attributes[d];
					if (a.nodeName.substr(0, 6) === "xmlns:" && a.nodeValue === this.MMLnamespace) {
						this.PushMathElements(h, e, a.nodeName.substr(6) + ":math");
					}
				}
			}
		}
		this.ProcessMathArray(h);
	}

	PushMathElements(f, d, a, c) {
		var h, g = MathJax.Hub.config.preRemoveClass;
		if (c) {
			if (!d.getElementsByTagNameNS) {
				return;
			}
			h = d.getElementsByTagNameNS(c, a);
		} else {
			h = d.getElementsByTagName(a);
		}
		for (var e = 0, b = h.length; e < b; e++) {
			var j = h[e].parentNode;
			if (j && j.className !== g && !j.isMathJax && !h[e].prefix === !c) { f.push(h[e]) }
		}
	}

	ProcessMathArray(c) {
		var b, a = c.length;
		if (a) {
			if (this.MathTagBug) {
				for (b = 0; b < a; b++) {
					if (c[b].nodeName === "MATH") {
						this.ProcessMathFlattened(c[b]);
					} else {
						this.ProcessMath(c[b]);
					}
				}
			} else {
				for (b = 0; b < a; b++) {
					this.ProcessMath(c[b]);
				}
			}
		}
	}

	ProcessMath(e) {
		var d = e.parentNode;
		if (!d || d.className === MathJax.Hub.config.preRemoveClass) {
			return;
		}
		var a = document.createElement("script");
		a.type = "math/mml";
		d.insertBefore(a, e);
		if (this.AttributeBug) {
			var b = this.OuterHTML(e);
			if (this.CleanupHTML) {
				b = b.replace(/<\?import .*?>/i, "").replace(/<\?xml:namespace .*?\/>/i, "");
				b = b.replace(/&nbsp;/g, "&#xA0;");
			}
			MathJax.HTML.setScript(a, b);
			d.removeChild(e);
		} else {
			var c = MathJax.HTML.Element("span");
			c.appendChild(e);
			MathJax.HTML.setScript(a, c.innerHTML);
		}
		if (this.config.preview !== "none") {
			this.createPreview(e, a);
		}
	}

	ProcessMathFlattened(f) {
		var d = f.parentNode;
		if (!d || d.className === MathJax.Hub.config.preRemoveClass) {
			return;
		}
		var b = document.createElement("script");
		b.type = "math/mml";
		d.insertBefore(b, f);
		var c = "", e, a = f;
		while (f && f.nodeName !== "/MATH") {
			e = f;
			f = f.nextSibling;
			c += this.NodeHTML(e);
			e.parentNode.removeChild(e);
		}
		if (f && f.nodeName === "/MATH") {
			f.parentNode.removeChild(f);
		}
		b.text = c + "</math>";
		if (this.config.preview !== "none") {
			this.createPreview(a, b);
		}
	}

	NodeHTML(e) {
		var c, b, a;
		if (e.nodeName === "#text") {
			c = this.quoteHTML(e.nodeValue);
		} else {
			if (e.nodeName === "#comment") {
				c = "<!--" + e.nodeValue + "-->";
			} else {
				c = "<" + e.nodeName.toLowerCase();
				for (b = 0, a = e.attributes.length; b < a; b++) {
					var d = e.attributes[b];
					if (d.specified && d.nodeName.substr(0, 10) !== "_moz-math-") {
						c += " " + d.nodeName.toLowerCase().replace(/xmlns:xmlns/, "xmlns") + "=";
						var f = d.nodeValue;
						if (f == null && d.nodeName === "style" && e.style) {
							f = e.style.cssText;
						}
						c += '"' + this.quoteHTML(f) + '"';
					}
				}
				c += ">";
				if (e.outerHTML != null && e.outerHTML.match(/(.<\/[A-Z]+>|\/>)$/)) {
					for (b = 0, a = e.childNodes.length; b < a; b++) {
						c += this.OuterHTML(e.childNodes[b]);
					}
					c += "</" + e.nodeName.toLowerCase() + ">";
				}
			}
		}
		return c;
	}

	OuterHTML(d) {
		if (d.nodeName.charAt(0) === "#") {
			return this.NodeHTML(d);
		}
		if (!this.AttributeBug) {
			return d.outerHTML;
		}
		var c = this.NodeHTML(d);
		for (var b = 0, a = d.childNodes.length; b < a; b++) {
			c += this.OuterHTML(d.childNodes[b]);
		}
		c += "</" + d.nodeName.toLowerCase() + ">";
		return c;
	}

	quoteHTML(a) {
		if (a == null) { a = "" }
		return a
			.replace(/&/g, "&#x26;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/\"/g, "&quot;");
	}

	createPreview(g, f) {
		var e = this.config.preview;
		if (e === "none") {
			return;
		}
		var i = false;
		var c = MathJax.Hub.config.preRemoveClass;
		if ((f.previousSibling || {}).className === c) {
			return;
		}
		if (e === "mathml") {
			i = true;
			if (this.MathTagBug) {
				e = "alttext";
			} else {
				e = g.cloneNode(true);
			}
		}
		if (e === "alttext" || e === "altimg") {
			i = true;
			var d = this.filterPreview(g.getAttribute("alttext"));
			if (e === "alttext") {
				if (d != null) {
					e = MathJax.HTML.TextNode(d);
				} else {
					e = null;
				}
			} else {
				var a = g.getAttribute("altimg");
				if (a != null) {
					var b = {
						width: g.getAttribute("altimg-width"),
						height: g.getAttribute("altimg-height")
					};
					e = MathJax.HTML.Element("img", { src: a, alt: d, style: b });
				} else {
					e = null;
				}
			}
		}
		if (e) {
			var h;
			if (i) {
				h = MathJax.HTML.Element("span", { className: c });
				h.appendChild(e);
			} else {
				h = MathJax.HTML.Element("span", { className: c }, e);
			}
			f.parentNode.insertBefore(h, f);
		}
	}

	filterPreview(a) {
		return a;
	}

	InitBrowser() {
		var b = MathJax.HTML.Element("span", {
			id: "<",
			className: "mathjax",
			innerHTML: "<math><mi>x</mi><mspace /></math>"
		});
		var a = b.outerHTML || "";
		this.AttributeBug = a !== "" && !(a.match(/id="&lt;"/) && a.match(/class="mathjax"/) && a.match(/<\/math>/));
		this.MathTagBug = b.childNodes.length > 1;
		this.CleanupHTML = MathJax.Hub.Browser.isMSIE;
	}
}

class Ascii2Jax {
	constructor() {
		this.version = "2.7.1";
		this.config = {
			delimiters: [["`", "`"]],
			skipTags: [
				"script",
				"noscript",
				"style",
				"textarea",
				"pre",
				"code",
				"annotation",
				"annotation-xml"
			],
			ignoreClass: "asciimath2jax_ignore",
			processClass: "asciimath2jax_process",
			preview: "AsciiMath"
		};
		this.ignoreTags = {
			br: (MathJax.Hub.Browser.isMSIE && document.documentMode < 9 ? "\n" : " "),
			wbr: "",
			"#comment": ""
		};
	}

	PreProcess(a) {
		if (!this.configured) {
			this.config = MathJax.Hub.CombineConfig("asciimath2jax", this.config);
			if (this.config.Augment) {
				MathJax.Hub.Insert(this, this.config.Augment);
			}
			this.configured = true;
		}
		if (typeof (a) === "string") {
			a = document.getElementById(a);
		}
		if (!a) { a = document.body }
		if (this.createPatterns()) { this.scanElement(a, a.nextSibling) }
	}

	createPatterns() {
		var d = [], c, a, b = this.config;
		this.match = {};
		if (b.delimiters.length === 0) { return false }
		for (c = 0, a = b.delimiters.length; c < a; c++) { d.push(this.patternQuote(b.delimiters[c][0])); this.match[b.delimiters[c][0]] = { mode: "", end: b.delimiters[c][1], pattern: this.endPattern(b.delimiters[c][1]) } } this.start = new RegExp(d.sort(this.sortLength).join("|"), "g"); this.skipTags = new RegExp("^(" + b.skipTags.join("|") + ")$", "i"); var e = []; if (MathJax.Hub.config.preRemoveClass) { e.push(MathJax.Hub.config.preRemoveClass) } if (b.ignoreClass) { e.push(b.ignoreClass) } this.ignoreClass = (e.length ? new RegExp("(^| )(" + e.join("|") + ")( |$)") : /^$/); this.processClass = new RegExp("(^| )(" + b.processClass + ")( |$)"); return true
	}

	patternQuote(a) {
		return a.replace(/([\^$(){}+*?\-|\[\]\:\\])/g, "\\$1");
	}

	endPattern(a) {
		return new RegExp(this.patternQuote(a) + "|\\\\.", "g");
	}

	sortLength(d, c) {
		if (d.length !== c.length) { return c.length - d.length }
		return (d == c ? 0 : (d < c ? -1 : 1));
	}

	scanElement(c, b, g) {
		var a, e, d, f;
		while (c && c != b) {
			if (c.nodeName.toLowerCase() === "#text") {
				if (!g) { c = this.scanText(c) }
			} else {
				a = (typeof (c.className) === "undefined" ? "" : c.className);
				e = (typeof (c.tagName) === "undefined" ? "" : c.tagName);
				if (typeof (a) !== "string") { a = String(a) }
				f = this.processClass.exec(a);
				if (c.firstChild && !a.match(/(^| )MathJax/) && (f || !this.skipTags.exec(e))) {
					d = (g || this.ignoreClass.exec(a)) && !f;
					this.scanElement(c.firstChild, b, d);
				}
			} if (c) { c = c.nextSibling }
		}
	}

	scanText(b) {
		if (b.nodeValue.replace(/\s+/, "") == "") { return b } var a, c; this.search = { start: true }; this.pattern = this.start; while (b) { this.pattern.lastIndex = 0; while (b && b.nodeName.toLowerCase() === "#text" && (a = this.pattern.exec(b.nodeValue))) { if (this.search.start) { b = this.startMatch(a, b) } else { b = this.endMatch(a, b) } } if (this.search.matched) { b = this.encloseMath(b) } if (b) { do { c = b; b = b.nextSibling } while (b && this.ignoreTags[b.nodeName.toLowerCase()] != null); if (!b || b.nodeName !== "#text") { return c } } } return b
	}

	startMatch(a, b) {
		var c = this.match[a[0]]; if (c != null) { this.search = { end: c.end, mode: c.mode, open: b, olen: a[0].length, opos: this.pattern.lastIndex - a[0].length }; this.switchPattern(c.pattern) } return b
	}

	endMatch(a, b) {
		if (a[0] == this.search.end) { this.search.close = b; this.search.cpos = this.pattern.lastIndex; this.search.clen = (this.search.isBeginEnd ? 0 : a[0].length); this.search.matched = true; b = this.encloseMath(b); this.switchPattern(this.start) } return b
	}

	switchPattern(a) {
		a.lastIndex = this.pattern.lastIndex;
		this.pattern = a;
		this.search.start = (a === this.start);
	}

	encloseMath(_b) {
		var a = this.search, g = a.close, f, d, c; if (a.cpos === g.length) { g = g.nextSibling } else { g = g.splitText(a.cpos) } if (!g) { f = g = MathJax.HTML.addText(a.close.parentNode, "") } a.close = g; d = (a.opos ? a.open.splitText(a.opos) : a.open); while ((c = d.nextSibling) && c !== g) { if (c.nodeValue !== null) { if (c.nodeName === "#comment") { d.nodeValue += c.nodeValue.replace(/^\[CDATA\[((.|\n|\r)*)\]\]$/, "$1") } else { d.nodeValue += d.nextSibling.nodeValue } } else { var h = this.ignoreTags[c.nodeName.toLowerCase()]; d.nodeValue += (h == null ? " " : h) } d.parentNode.removeChild(c) } var e = d.nodeValue.substr(a.olen, d.nodeValue.length - a.olen - a.clen); d.parentNode.removeChild(d); if (this.config.preview !== "none") { this.createPreview(a.mode, e) } d = this.createMathTag(a.mode, e); this.search = {}; this.pattern.lastIndex = 0; if (f) { f.parentNode.removeChild(f) } return d
	}

	insertNode(b) {
		var a = this.search;
		a.close.parentNode.insertBefore(b, a.close);
	}

	createPreview(_d, a) {
		var b = MathJax.Hub.config.preRemoveClass; var c = this.config.preview; if (c === "none") { return } if ((this.search.close.previousSibling || {}).className === b) { return } if (c === "AsciiMath") { c = [this.filterPreview(a)] } if (c) { c = MathJax.HTML.Element("span", { className: b }, c); this.insertNode(c) }
	}

	createMathTag(c, a) {
		var b = document.createElement("script");
		b.type = "math/asciimath" + c; MathJax.HTML.setScript(b, a);
		this.insertNode(b);
		return b;
	}

	filterPreview(a) { return a }
}

{
	MathJax.InputJax.TeX = MathJax.InputJax(new TeX());
	MathJax.InputJax.TeX.Register("math/tex");
	MathJax.InputJax.TeX.loadComplete("config.js");
}
{
	MathJax.InputJax.MathML = MathJax.InputJax({
		id: "MathML",
		version: "2.7.1",
		directory: MathJax.InputJax.directory + "/MathML",
		extensionDir: MathJax.InputJax.extensionDir + "/MathML",
		entityDir: MathJax.InputJax.directory + "/MathML/entities",
		config: { useMathMLspacing: false }
	});
	MathJax.InputJax.MathML.Register("math/mml");
	MathJax.InputJax.MathML.loadComplete("config.js");
}
{
	MathJax.OutputJax.CommonHTML = MathJax.OutputJax(new CommonHTML());
	if (!MathJax.Hub.config.delayJaxRegistration) {
		MathJax.OutputJax.CommonHTML.Register("jax/mml");
	}
	MathJax.OutputJax.CommonHTML.loadComplete("config.js");
}
{
	MathJax.OutputJax.PreviewHTML = MathJax.OutputJax(new PreviewHTML());
	if (!MathJax.Hub.config.delayJaxRegistration) {
		MathJax.OutputJax.PreviewHTML.Register("jax/mml");
	}
	MathJax.OutputJax.PreviewHTML.loadComplete("config.js");
}
{
	MathJax.InputJax.AsciiMath = MathJax.InputJax({
		id: "AsciiMath",
		version: "2.7.1",
		directory: MathJax.InputJax.directory + "/AsciiMath",
		extensionDir: MathJax.InputJax.extensionDir + "/AsciiMath",
		config: {
			fixphi: true,
			useMathMLspacing: true,
			displaystyle: true,
			decimalsign: "."
		}
	});
	MathJax.InputJax.AsciiMath.Register("math/asciimath");
	MathJax.InputJax.AsciiMath.loadComplete("config.js");
}

MathJax.Extension.tex2jax = new Tex2Jax();
MathJax.Hub.Register.PreProcessor(["PreProcess", MathJax.Extension.tex2jax]);
MathJax.Ajax.loadComplete("[MathJax]/extensions/tex2jax.js");
MathJax.Extension.mml2jax = new MML2Jax();
MathJax.Hub.Register.PreProcessor(["PreProcess", MathJax.Extension.mml2jax], 5);
MathJax.Ajax.loadComplete("[MathJax]/extensions/mml2jax.js");
MathJax.Extension.asciimath2jax = new Ascii2Jax();
MathJax.Hub.Register.PreProcessor(["PreProcess", MathJax.Extension.asciimath2jax]);
MathJax.Ajax.loadComplete("[MathJax]/extensions/asciimath2jax.js");

(function (hub, html, ajax, cb, loc, ojax, ijax) {
	var version = "2.7.1";
	var ext = MathJax.Extension;
	var ev = ext.MathEvents = { version: version };
	var menu = hub.config.menuSettings;
	var o = {
		hover: 500,
		frame: { x: 3.5, y: 5, bwidth: 1, bcolor: "#A6D", hwidth: "15px", hcolor: "#83A" },
		button: { x: -6, y: -3, wx: -2 },
		fadeinInc: 0.2,
		fadeoutInc: 0.05,
		fadeDelay: 50,
		fadeoutStart: 400,
		fadeoutDelay: 15 * 1000,
		styles: {
			".MathJax_Hover_Frame": {
				"border-radius": ".25em",
				"-webkit-border-radius": ".25em",
				"-moz-border-radius": ".25em",
				"-khtml-border-radius": ".25em",
				"box-shadow": "0px 0px 15px #83A",
				"-webkit-box-shadow": "0px 0px 15px #83A",
				"-moz-box-shadow": "0px 0px 15px #83A",
				"-khtml-box-shadow": "0px 0px 15px #83A",
				border: "1px solid #A6D ! important",
				display: "inline-block",
				position: "absolute"
			},
			".MathJax_Menu_Button .MathJax_Hover_Arrow": {
				position: "absolute",
				cursor: "pointer",
				display: "inline-block",
				border: "2px solid #AAA",
				"border-radius": "4px",
				"-webkit-border-radius": "4px",
				"-moz-border-radius": "4px",
				"-khtml-border-radius": "4px",
				"font-family": "'Courier New',Courier",
				"font-size": "9px",
				color: "#F0F0F0"
			},
			".MathJax_Menu_Button .MathJax_Hover_Arrow span": {
				display: "block",
				"background-color": "#AAA",
				border: "1px solid",
				"border-radius": "3px",
				"line-height": 0, padding: "4px"
			},
			".MathJax_Hover_Arrow:hover": {
				color: "white!important",
				border: "2px solid #CCC!important"
			},
			".MathJax_Hover_Arrow:hover span": { "background-color": "#CCC!important" }
		}
	};
	var n = ev.Event = {
		LEFTBUTTON: 0,
		RIGHTBUTTON: 2,
		MENUKEY: "altKey",
		KEY: { RETURN: 13, ESCAPE: 27, SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 },
		Mousedown: function (q) { return n.Handler(q, "Mousedown", this) },
		Mouseup: function (q) { return n.Handler(q, "Mouseup", this) },
		Mousemove: function (q) { return n.Handler(q, "Mousemove", this) },
		Mouseover: function (q) { return n.Handler(q, "Mouseover", this) },
		Mouseout: function (q) { return n.Handler(q, "Mouseout", this) },
		Click: function (q) { return n.Handler(q, "Click", this) },
		DblClick: function (q) { return n.Handler(q, "DblClick", this) },
		Menu: function (q) { return n.Handler(q, "ContextMenu", this) },
		Handler: function (t, r, s) { if (ajax.loadingMathMenu) { return n.False(t) } var q = ojax[s.jaxID]; if (!t) { t = window.event } t.isContextMenu = (r === "ContextMenu"); if (q[r]) { return q[r](t, s) } if (ext.MathZoom) { return ext.MathZoom.HandleEvent(t, r, s) } },
		False: function (q) { if (!q) { q = window.event } if (q) { if (q.preventDefault) { q.preventDefault() } else { q.returnValue = false } if (q.stopPropagation) { q.stopPropagation() } q.cancelBubble = true } return false },
		Keydown: function (r, _q) { if (!r) { r = window.event } if (r.keyCode === n.KEY.SPACE) { n.ContextMenu(r, this) } },
		ContextMenu: function (t, E, w) { var B = ojax[E.jaxID], v = B.getJaxFromMath(E); var F = (B.config.showMathMenu != null ? B : hub).config.showMathMenu; if (!F || (menu.context !== "MathJax" && !w)) { return } if (ev.msieEventBug) { t = window.event || t } n.ClearSelection(); f.ClearHoverTimer(); if (v.hover) { if (v.hover.remove) { clearTimeout(v.hover.remove); delete v.hover.remove } v.hover.nofade = true } var u = MathJax.Menu; var G, D; if (u) { if (u.loadingDomain) { return n.False(t) } G = loc.loadDomain("MathMenu"); if (!G) { u.jax = v; var r = u.menu.Find("Show Math As").submenu; r.items[0].name = v.sourceMenuTitle; r.items[0].format = (v.sourceMenuFormat || "MathML"); r.items[1].name = ijax[v.inputJax].sourceMenuTitle; r.items[5].disabled = !ijax[v.inputJax].annotationEncoding; var A = r.items[2]; A.disabled = true; var q = A.submenu.items; annotationList = MathJax.Hub.Config.semanticsAnnotations; for (var z = 0, y = q.length; z < y; z++) { var s = q[z].name[1]; if (v.root && v.root.getAnnotation(s) !== null) { A.disabled = false; q[z].hidden = false } else { q[z].hidden = true } } var x = u.menu.Find("Math Settings", "MathPlayer"); x.hidden = !(v.outputJax === "NativeMML" && hub.Browser.hasMathPlayer); return u.menu.Post(t) } u.loadingDomain = true; D = function () { delete u.loadingDomain } } else { if (ajax.loadingMathMenu) { return n.False(t) } ajax.loadingMathMenu = true; G = ajax.Require("[MathJax]/extensions/MathMenu.js"); D = function () { delete ajax.loadingMathMenu; if (!MathJax.Menu) { MathJax.Menu = {} } } } var C = { pageX: t.pageX, pageY: t.pageY, clientX: t.clientX, clientY: t.clientY }; new QUEUE(G, D, ["ContextMenu", n, C, E, w]); return n.False(t) },
		AltContextMenu: function (s, r) { var t = ojax[r.jaxID]; var q = (t.config.showMathMenu != null ? t : hub).config.showMathMenu; if (q) { q = (t.config.showMathMenuMSIE != null ? t : hub).config.showMathMenuMSIE; if (menu.context === "MathJax" && !menu.mpContext && q) { if (!ev.noContextMenuBug || s.button !== n.RIGHTBUTTON) { return } } else { if (!s[n.MENUKEY] || s.button !== n.LEFTBUTTON) { return } } return t.ContextMenu(s, r, true) } },
		ClearSelection: function () { if (ev.safariContextMenuBug) { setTimeout("window.getSelection().empty()", 0) } if (document.selection) { setTimeout("document.selection.empty()", 0) } },
		getBBox: function (s) {
			s.appendChild(ev.topImg);
			var r = ev.topImg.offsetTop, t = s.offsetHeight - r, q = s.offsetWidth;
			s.removeChild(ev.topImg);
			return { w: q, h: r, d: t };
		}
	};
	var f = ev.Hover = {
		Mouseover: function (s, r) { if (menu.discoverable || menu.zoom === "Hover") { var u = s.fromElement || s.relatedTarget, t = s.toElement || s.target; if (u && t && (hub.isMathJaxNode(u) !== hub.isMathJaxNode(t) || hub.getJaxFor(u) !== hub.getJaxFor(t))) { var q = this.getJaxFromMath(r); if (q.hover) { f.ReHover(q) } else { f.HoverTimer(q, r) } return n.False(s) } } },
		Mouseout: function (s, r) { if (menu.discoverable || menu.zoom === "Hover") { var u = s.fromElement || s.relatedTarget, t = s.toElement || s.target; if (u && t && (hub.isMathJaxNode(u) !== hub.isMathJaxNode(t) || hub.getJaxFor(u) !== hub.getJaxFor(t))) { var q = this.getJaxFromMath(r); if (q.hover) { f.UnHover(q) } else { f.ClearHoverTimer() } return n.False(s) } } },
		Mousemove: function (s, r) { if (menu.discoverable || menu.zoom === "Hover") { var q = this.getJaxFromMath(r); if (q.hover) { return } if (f.lastX == s.clientX && f.lastY == s.clientY) { return } f.lastX = s.clientX; f.lastY = s.clientY; f.HoverTimer(q, r); return n.False(s) } },
		HoverTimer: function (q, r) { this.ClearHoverTimer(); this.hoverTimer = setTimeout(cb(["Hover", this, q, r]), o.hover) },
		ClearHoverTimer: function () { if (this.hoverTimer) { clearTimeout(this.hoverTimer); delete this.hoverTimer } },
		Hover: function (q, u) { if (ext.MathZoom && ext.MathZoom.Hover({}, u)) { return } var t = ojax[q.outputJax], v = t.getHoverSpan(q, u), y = t.getHoverBBox(q, v, u), w = (t.config.showMathMenu != null ? t : hub).config.showMathMenu; var A = o.frame.x, z = o.frame.y, x = o.frame.bwidth; if (ev.msieBorderWidthBug) { x = 0 } q.hover = { opacity: 0, id: q.inputID + "-Hover" }; var r = html.Element("span", { id: q.hover.id, isMathJax: true, style: { display: "inline-block", width: 0, height: 0, position: "relative" } }, [["span", { className: "MathJax_Hover_Frame", isMathJax: true, style: { display: "inline-block", position: "absolute", top: this.Px(-y.h - z - x - (y.y || 0)), left: this.Px(-A - x + (y.x || 0)), width: this.Px(y.w + 2 * A), height: this.Px(y.h + y.d + 2 * z), opacity: 0, filter: "alpha(opacity=0)" } }]]); var s = html.Element("span", { isMathJax: true, id: q.hover.id + "Menu", className: "MathJax_Menu_Button", style: { display: "inline-block", "z-index": 1, width: 0, height: 0, position: "relative" } }, [["span", { className: "MathJax_Hover_Arrow", isMathJax: true, math: u, onclick: this.HoverMenu, jax: t.id, style: { left: this.Px(y.w + A + x + (y.x || 0) + o.button.x), top: this.Px(-y.h - z - x - (y.y || 0) - o.button.y), opacity: 0, filter: "alpha(opacity=0)" } }, [["span", { isMathJax: true }, "\u25BC"]]]]); if (y.width) { r.style.width = s.style.width = y.width; r.style.marginRight = s.style.marginRight = "-" + y.width; r.firstChild.style.width = y.width; s.firstChild.style.left = ""; s.firstChild.style.right = this.Px(o.button.wx) } v.parentNode.insertBefore(r, v); if (w) { v.parentNode.insertBefore(s, v) } if (v.style) { v.style.position = "relative" } this.ReHover(q) },
		ReHover: function (q) { if (q.hover.remove) { clearTimeout(q.hover.remove) } q.hover.remove = setTimeout(cb(["UnHover", this, q]), o.fadeoutDelay); this.HoverFadeTimer(q, o.fadeinInc) }, UnHover: function (q) { if (!q.hover.nofade) { this.HoverFadeTimer(q, -o.fadeoutInc, o.fadeoutStart) } },
		HoverFade: function (q) { delete q.hover.timer; q.hover.opacity = Math.max(0, Math.min(1, q.hover.opacity + q.hover.inc)); q.hover.opacity = Math.floor(1000 * q.hover.opacity) / 1000; var s = document.getElementById(q.hover.id), r = document.getElementById(q.hover.id + "Menu"); s.firstChild.style.opacity = q.hover.opacity; s.firstChild.style.filter = "alpha(opacity=" + Math.floor(100 * q.hover.opacity) + ")"; if (r) { r.firstChild.style.opacity = q.hover.opacity; r.firstChild.style.filter = s.style.filter } if (q.hover.opacity === 1) { return } if (q.hover.opacity > 0) { this.HoverFadeTimer(q, q.hover.inc); return } s.parentNode.removeChild(s); if (r) { r.parentNode.removeChild(r) } if (q.hover.remove) { clearTimeout(q.hover.remove) } delete q.hover },
		HoverFadeTimer: function (q, s, r) { q.hover.inc = s; if (!q.hover.timer) { q.hover.timer = setTimeout(cb(["HoverFade", this, q]), (r || o.fadeDelay)) } },
		HoverMenu: function (q) { if (!q) { q = window.event } return ojax[this.jax].ContextMenu(q, this.math, true) },
		ClearHover: function (q) { if (q.hover.remove) { clearTimeout(q.hover.remove) } if (q.hover.timer) { clearTimeout(q.hover.timer) } f.ClearHoverTimer(); delete q.hover },
		Px: function (q) { if (Math.abs(q) < 0.006) { return "0px" } return q.toFixed(2).replace(/\.?0+$/, "") + "px" },
		getImages: function () { if (menu.discoverable) { var q = new Image(); q.src = o.button.src } }
	};
	var a = ev.Touch = {
		last: 0,
		delay: 500,
		start: function (r) { var q = new Date().getTime(); var s = (q - a.last < a.delay && a.up); a.last = q; a.up = false; if (s) { a.timeout = setTimeout(a.menu, a.delay, r, this); r.preventDefault() } },
		end: function (r) { var q = new Date().getTime(); a.up = (q - a.last < a.delay); if (a.timeout) { clearTimeout(a.timeout); delete a.timeout; a.last = 0; a.up = false; r.preventDefault(); return n.Handler((r.touches[0] || r.touch), "DblClick", this) } },
		menu: function (r, q) { delete a.timeout; a.last = 0; a.up = false; return n.Handler((r.touches[0] || r.touch), "ContextMenu", q) }
	};
	hub.Browser.Select({
		MSIE: function (q) { var s = (document.documentMode || 0); var r = q.versionAtLeast("8.0"); ev.msieBorderWidthBug = (document.compatMode === "BackCompat"); ev.msieEventBug = q.isIE9; ev.msieAlignBug = (!r || s < 8); if (s < 9) { n.LEFTBUTTON = 1 } },
		Safari: function (_q) { ev.safariContextMenuBug = true },
		Opera: function (_q) { ev.operaPositionBug = true },
		Konqueror: function (_q) { ev.noContextMenuBug = true }
	});
	ev.topImg = (ev.msieAlignBug ? html.Element("img", { style: { width: 0, height: 0, position: "relative" }, src: "about:blank" }) : html.Element("span", { style: { width: 0, height: 0, display: "inline-block" } }));
	if (ev.operaPositionBug) { ev.topImg.style.border = "1px solid" }
	ev.config = o = hub.CombineConfig("MathEvents", o);
	var e = function () {
		var q = o.styles[".MathJax_Hover_Frame"];
		q.border = o.frame.bwidth + "px solid " + o.frame.bcolor + " ! important";
		q["box-shadow"] = q["-webkit-box-shadow"] = q["-moz-box-shadow"] = q["-khtml-box-shadow"] = "0px 0px " + o.frame.hwidth + " " + o.frame.hcolor;
	};
	new QUEUE(
		hub.Register.StartupHook("End Config", {}),
		[e],
		["getImages", f],
		["Styles", ajax, o.styles],
		["Post", hub.Startup.signal, "MathEvents Ready"],
		["loadComplete", ajax, "[MathJax]/extensions/MathEvents.js"]
	);
})(MathJax.Hub, MathJax.HTML, MathJax.Ajax, MathJax.Callback, MathJax.Localization, MathJax.OutputJax, MathJax.InputJax);

ZOOM_MENU(MathJax.Hub, MathJax.HTML, MathJax.Ajax, MathJax.OutputJax["HTML-CSS"], MathJax.OutputJax.NativeMML);

MATH_MENU(MathJax.Hub, MathJax.HTML, MathJax.Ajax, MathJax.Callback, MathJax.OutputJax);

MathJax.ElementJax.mml = MathJax.ElementJax(
	{ mimeType: "jax/mml" },
	{
		id: "mml",
		version: "2.7.1",
		directory: MathJax.ElementJax.directory + "/mml",
		extensionDir: MathJax.ElementJax.extensionDir + "/mml",
		optableDir: MathJax.ElementJax.directory + "/mml/optable"
	}
);

MathJax.ElementJax.mml.Augment({
	Init: function () {
		if (arguments.length === 1 && arguments[0].type === "math") {
			this.root = arguments[0];
		} else {
			this.root = MathJax.ElementJax.mml.math.apply(this, arguments);
		}
		if (this.root.attr && this.root.attr.mode) {
			if (!this.root.display && this.root.attr.mode === "display") {
				this.root.display = "block";
				this.root.attrNames.push("display");
			}
			delete this.root.attr.mode;
			for (var b = 0, a = this.root.attrNames.length; b < a; b++) {
				if (this.root.attrNames[b] === "mode") {
					this.root.attrNames.splice(b, 1);
					break;
				}
			}
		}
	}
}, {
	INHERIT: "_inherit_",
	AUTO: "_auto_",
	SIZE: { INFINITY: "infinity", SMALL: "small", NORMAL: "normal", BIG: "big" },
	COLOR: { TRANSPARENT: "transparent" },
	VARIANT: {
		NORMAL: "normal",
		BOLD: "bold",
		ITALIC: "italic",
		BOLDITALIC: "bold-italic",
		DOUBLESTRUCK: "double-struck",
		FRAKTUR: "fraktur",
		BOLDFRAKTUR: "bold-fraktur",
		SCRIPT: "script",
		BOLDSCRIPT: "bold-script",
		SANSSERIF: "sans-serif",
		BOLDSANSSERIF: "bold-sans-serif",
		SANSSERIFITALIC: "sans-serif-italic",
		SANSSERIFBOLDITALIC: "sans-serif-bold-italic",
		MONOSPACE: "monospace",
		INITIAL: "inital",
		TAILED: "tailed",
		LOOPED: "looped",
		STRETCHED: "stretched",
		CALIGRAPHIC: "-tex-caligraphic",
		OLDSTYLE: "-tex-oldstyle"
	},
	FORM: { PREFIX: "prefix", INFIX: "infix", POSTFIX: "postfix" },
	LINEBREAK: { AUTO: "auto", NEWLINE: "newline", NOBREAK: "nobreak", GOODBREAK: "goodbreak", BADBREAK: "badbreak" },
	LINEBREAKSTYLE: { BEFORE: "before", AFTER: "after", DUPLICATE: "duplicate", INFIXLINBREAKSTYLE: "infixlinebreakstyle" },
	INDENTALIGN: { LEFT: "left", CENTER: "center", RIGHT: "right", AUTO: "auto", ID: "id", INDENTALIGN: "indentalign" },
	INDENTSHIFT: { INDENTSHIFT: "indentshift" },
	LINETHICKNESS: { THIN: "thin", MEDIUM: "medium", THICK: "thick" },
	NOTATION: {
		LONGDIV: "longdiv",
		ACTUARIAL: "actuarial",
		RADICAL: "radical",
		BOX: "box",
		ROUNDEDBOX: "roundedbox",
		CIRCLE: "circle",
		LEFT: "left",
		RIGHT: "right",
		TOP: "top",
		BOTTOM: "bottom",
		UPDIAGONALSTRIKE: "updiagonalstrike",
		DOWNDIAGONALSTRIKE: "downdiagonalstrike",
		UPDIAGONALARROW: "updiagonalarrow",
		VERTICALSTRIKE: "verticalstrike",
		HORIZONTALSTRIKE: "horizontalstrike",
		PHASORANGLE: "phasorangle",
		MADRUWB: "madruwb"
	},
	ALIGN: { TOP: "top", BOTTOM: "bottom", CENTER: "center", BASELINE: "baseline", AXIS: "axis", LEFT: "left", RIGHT: "right" },
	LINES: { NONE: "none", SOLID: "solid", DASHED: "dashed" },
	SIDE: { LEFT: "left", RIGHT: "right", LEFTOVERLAP: "leftoverlap", RIGHTOVERLAP: "rightoverlap" },
	WIDTH: { AUTO: "auto", FIT: "fit" },
	ACTIONTYPE: { TOGGLE: "toggle", STATUSLINE: "statusline", TOOLTIP: "tooltip", INPUT: "input" },
	LENGTH: {
		VERYVERYTHINMATHSPACE: "veryverythinmathspace",
		VERYTHINMATHSPACE: "verythinmathspace",
		THINMATHSPACE: "thinmathspace",
		MEDIUMMATHSPACE: "mediummathspace",
		THICKMATHSPACE: "thickmathspace",
		VERYTHICKMATHSPACE: "verythickmathspace",
		VERYVERYTHICKMATHSPACE: "veryverythickmathspace",
		NEGATIVEVERYVERYTHINMATHSPACE: "negativeveryverythinmathspace",
		NEGATIVEVERYTHINMATHSPACE: "negativeverythinmathspace",
		NEGATIVETHINMATHSPACE: "negativethinmathspace",
		NEGATIVEMEDIUMMATHSPACE: "negativemediummathspace",
		NEGATIVETHICKMATHSPACE: "negativethickmathspace",
		NEGATIVEVERYTHICKMATHSPACE: "negativeverythickmathspace",
		NEGATIVEVERYVERYTHICKMATHSPACE: "negativeveryverythickmathspace"
	},
	OVERFLOW: { LINBREAK: "linebreak", SCROLL: "scroll", ELIDE: "elide", TRUNCATE: "truncate", SCALE: "scale" },
	UNIT: { EM: "em", EX: "ex", PX: "px", IN: "in", CM: "cm", MM: "mm", PT: "pt", PC: "pc" },
	TEXCLASS: { ORD: 0, OP: 1, BIN: 2, REL: 3, OPEN: 4, CLOSE: 5, PUNCT: 6, INNER: 7, VCENTER: 8, NONE: -1 },
	TEXCLASSNAMES: ["ORD", "OP", "BIN", "REL", "OPEN", "CLOSE", "PUNCT", "INNER", "VCENTER"],
	skipAttributes: { texClass: true, useHeight: true, texprimestyle: true },
	copyAttributes: {
		displaystyle: 1,
		scriptlevel: 1,
		open: 1,
		close: 1,
		form: 1,
		actiontype: 1,
		fontfamily: true,
		fontsize: true,
		fontweight: true,
		fontstyle: true,
		color: true,
		background: true,
		id: true,
		"class": 1,
		href: true,
		style: true
	},
	copyAttributeNames: ["displaystyle", "scriptlevel", "open", "close", "form", "actiontype", "fontfamily", "fontsize", "fontweight", "fontstyle", "color", "background", "id", "class", "href", "style"],
	nocopyAttributes: {
		fontfamily: true,
		fontsize: true,
		fontweight: true,
		fontstyle: true,
		color: true,
		background: true,
		id: true,
		"class": true,
		href: true,
		style: true,
		xmlns: true
	},
	Error: function (d, e) {
		var c = this.merror(d), b = MathJax.Localization.fontDirection(), a = MathJax.Localization.fontFamily();
		if (e) { c = c.With(e) }
		if (b || a) {
			c = this.mstyle(c);
			if (b) { c.dir = b }
			if (a) { c.style.fontFamily = "font-family: " + a }
		}
		return c;
	}
});

MML_PARSER(MathJax.ElementJax.mml);

if (false){
	MathJax.Hub.Register.LoadHook("[MathJax]/jax/element/mml/jax.js", function () {
		var c = "2.7.1";
		var a = MathJax.ElementJax.mml, b = MathJax.Hub.config.menuSettings;
		a.mbase.Augment({
			toMathMLvariants: {
				"-tex-caligraphic": a.VARIANT.SCRIPT,
				"-tex-caligraphic-bold": a.VARIANT.BOLDSCRIPT,
				"-tex-oldstyle": a.VARIANT.NORMAL,
				"-tex-oldstyle-bold": a.VARIANT.BOLD,
				"-tex-mathit": a.VARIANT.ITALIC
			},
			toMathML: function (l) {
				var h = (this.inferred && this.parent.inferRow);
				if (l == null) { l = "" }
				var f = this.type, e = this.toMathMLattributes();
				if (f === "mspace") {
					return l + "<" + f + e + " />";
				}
				var k = [], j = (this.isToken ? "" : l + (h ? "" : "  "));
				for (var g = 0, d = this.data.length; g < d; g++) {
					if (this.data[g]) {
						k.push(this.data[g].toMathML(j));
					} else {
						if (!this.isToken && !this.isChars) {
							k.push(j + "<mrow />");
						}
					}
				}
				if (this.isToken || this.isChars) {
					return l + "<" + f + e + ">" + k.join("") + "</" + f + ">";
				}
				if (h) { return k.join("\n") }
				if (k.length === 0 || (k.length === 1 && k[0] === "")) {
					return l + "<" + f + e + " />";
				}
				return l + "<" + f + e + ">\n" + k.join("\n") + "\n" + l + "</" + f + ">";
			},
			toMathMLattributes: function () {
				var j = (this.type === "mstyle" ? a.math.prototype.defaults : this.defaults);
				var h = (this.attrNames || a.copyAttributeNames), g = a.skipAttributes, l = a.copyAttributes;
				var e = [];
				if (this.type === "math" && (!this.attr || !this.attr.xmlns)) {
					e.push('xmlns="http://www.w3.org/1998/Math/MathML"');
				}
				if (!this.attrNames) {
					for (var k in j) {
						if (!g[k] && !l[k] && j.hasOwnProperty(k)) {
							if (this[k] != null && this[k] !== j[k]) {
								if (this.Get(k, null, 1) !== this[k]) {
									e.push(k + '="' + this.toMathMLattribute(this[k]) + '"');
								}
							}
						}
					}
				}
				for (var f = 0, d = h.length; f < d; f++) {
					if (l[h[f]] === 1 && !j.hasOwnProperty(h[f])) { continue }
					value = (this.attr || {})[h[f]];
					if (value == null) { value = this[h[f]] }
					if (value != null) {
						e.push(h[f] + '="' + this.toMathMLquote(value) + '"');
					}
				}
				this.toMathMLclass(e);
				if (e.length) {
					return " " + e.join(" ");
				} else {
					return "";
				}
			},
			toMathMLclass: function (d) {
				var f = [];
				if (this["class"]) {
					f.push(this["class"]);
				}
				if (this.isa(a.TeXAtom) && b.texHints) {
					var e = ["ORD", "OP", "BIN", "REL", "OPEN", "CLOSE", "PUNCT", "INNER", "VCENTER"][this.texClass];
					if (e) {
						f.push("MJX-TeXAtom-" + e);
						if (e === "OP" && !this.movablelimits) {
							f.push("MJX-fixedlimits");
						}
					}
				}
				if (this.mathvariant && this.toMathMLvariants[this.mathvariant]) {
					f.push("MJX" + this.mathvariant);
				}
				if (this.variantForm) {
					f.push("MJX-variant");
				}
				if (f.length) {
					d.unshift('class="' + f.join(" ") + '"');
				}
			},
			toMathMLattribute: function (d) {
				if (typeof (d) === "string" && d.replace(/ /g, "").match(/^(([-+])?(\d+(\.\d*)?|\.\d+))mu$/)) {
					return (RegExp.$2 || "") + ((1 / 18) * RegExp.$3).toFixed(3).replace(/\.?0+$/, "") + "em";
				} else {
					if (this.toMathMLvariants[d]) {
						return this.toMathMLvariants[d];
					}
				}
				return this.toMathMLquote(d);
			},
			toMathMLquote: function (f) {
				f = String(f).split("");
				for (var g = 0, d = f.length; g < d; g++) {
					var k = f[g].charCodeAt(0);
					if (k <= 55295 || 57344 <= k) {
						if (k > 126 || (k < 32 && k !== 10 && k !== 13 && k !== 9)) {
							f[g] = "&#x" + k.toString(16).toUpperCase() + ";";
						} else {
							var j = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[f[g]];
							if (j) { f[g] = j }
						}
					} else {
						if (g + 1 < d) {
							var h = f[g + 1].charCodeAt(0);
							var e = (((k - 55296) << 10) + (h - 56320) + 65536);
							f[g] = "&#x" + e.toString(16).toUpperCase() + ";";
							f[g + 1] = "";
							g++;
						} else {
							f[g] = "";
						}
					}
				}
				return f.join("");
			}
		});
		a.math.Augment({
			toMathML: function (d, e) {
				var g;
				if (d == null) { d = "" }
				if (e && e.originalText && b.semantics) {
					g = MathJax.InputJax[e.inputJax].annotationEncoding;
				}
				var n = (this.data[0] && this.data[0].data.length > 1);
				var p = this.type, k = this.toMathMLattributes();
				var j = [], o = d + (g ? "  " + (n ? "  " : "") : "") + "  ";
				for (var h = 0, f = this.data.length; h < f; h++) {
					if (this.data[h]) {
						j.push(this.data[h].toMathML(o));
					} else {
						j.push(o + "<mrow />");
					}
				}
				if (j.length === 0 || (j.length === 1 && j[0] === "")) {
					if (!g) { return "<" + p + k + " />"; }
					j.push(o + "<mrow />");
				}
				if (g) {
					if (n) {
						j.unshift(d + "    <mrow>");
						j.push(d + "    </mrow>");
					}
					j.unshift(d + "  <semantics>");
					var l = e.originalText.replace(/[&<>]/g, function (i) { return { ">": "&gt;", "<": "&lt;", "&": "&amp;" }[i] });
					j.push(d + '    <annotation encoding="' + g + '">' + l + "</annotation>");
					j.push(d + "  </semantics>");
				}
				return d + "<" + p + k + ">\n" + j.join("\n") + "\n" + d + "</" + p + ">";
			}
		});
		a.msubsup.Augment({
			toMathML: function (j) {
				var f = this.type;
				if (this.data[this.sup] == null) { f = "msub" }
				if (this.data[this.sub] == null) { f = "msup" }
				var e = this.toMathMLattributes();
				delete this.data[0].inferred;
				var h = [];
				for (var g = 0, d = this.data.length; g < d; g++) {
					if (this.data[g]) {
						h.push(this.data[g].toMathML(j + "  "));
					}
				}
				return j + "<" + f + e + ">\n" + h.join("\n") + "\n" + j + "</" + f + ">";
			}
		});
		a.munderover.Augment({
			toMathML: function (k) {
				var f = this.type;
				var j = this.data[this.base];
				if (j && j.isa(a.TeXAtom) && j.movablelimits && !j.Get("displaystyle")) {
					type = "msubsup";
					if (this.data[this.under] == null) { f = "msup" }
					if (this.data[this.over] == null) { f = "msub" }
				} else {
					if (this.data[this.under] == null) { f = "mover" }
					if (this.data[this.over] == null) { f = "munder" }
				}
				var e = this.toMathMLattributes();
				delete this.data[0].inferred;
				var h = [];
				for (var g = 0, d = this.data.length; g < d; g++) {
					if (this.data[g]) {
						h.push(this.data[g].toMathML(k + "  "));
					}
				}
				return k + "<" + f + e + ">\n" + h.join("\n") + "\n" + k + "</" + f + ">";
			}
		});
		a.TeXAtom.Augment({
			toMathML: function (e) {
				var d = this.toMathMLattributes();
				if (!d && this.data[0].data.length === 1) {
					return e.substr(2) + this.data[0].toMathML(e);
				}
				return e + "<mrow" + d + ">\n" + this.data[0].toMathML(e + "  ") + "\n" + e + "</mrow>";
			}
		});
		a.chars.Augment({
			toMathML: function (d) {
				return (d || "") + this.toMathMLquote(this.toString());
			}
		});
		a.entity.Augment({
			toMathML: function (d) {
				return (d || "") + "&" + this.data[0] + ";<!-- " + this.toString() + " -->";
			}
		});
		a.xml.Augment({
			toMathML: function (d) {
				return (d || "") + this.toString();
			}
		});

		MathJax.Hub.Register.StartupHook("TeX mathchoice Ready", function () {
			a.TeXmathchoice.Augment({
				toMathML: function (d) {
					return this.Core().toMathML(d);
				}
			});
		});
		MathJax.Hub.Startup.signal.Post("toMathML Ready");
	});
	MathJax.Ajax.loadComplete("[MathJax]/extensions/toMathML.js");
}
if (false){
	(function (b, e) {
		var d = "2.7.1";
		var a = b.CombineConfig("TeX.noErrors", {
			disabled: false,
			multiLine: true,
			inlineDelimiters: ["", ""],
			style: { "font-size": "90%", "text-align": "left", color: "black", padding: "1px 3px", border: "1px solid" }
		});
		var c = "\u00A0";
		MathJax.Extension["TeX/noErrors"] = { version: d, config: a };
		b.Register.StartupHook("TeX Jax Ready", function () {
			var f = MathJax.InputJax.TeX.formatError;
			MathJax.InputJax.TeX.Augment({
				formatError: function (j, i, k, g) {
					if (a.disabled) {
						return f.apply(this, arguments);
					}
					var h = j.message.replace(/\n.*/, "");
					b.signal.Post(["TeX Jax - parse error", h, i, k, g]);
					var m = a.inlineDelimiters;
					var l = (k || a.multiLine);
					if (!k) {
						i = m[0] + i + m[1];
					}
					if (l) {
						i = i.replace(/ /g, c);
					} else {
						i = i.replace(/\n/g, " ");
					}
					return MathJax.ElementJax.mml.merror(i).With({
						isError: true,
						multiLine: l
					});
				}
			});
		});
		b.Register.StartupHook("HTML-CSS Jax Config", function () {
			b.Config({
				"HTML-CSS": {
					styles: {
						".MathJax .noError": b.Insert({ "vertical-align": (b.Browser.isMSIE && a.multiLine ? "-2px" : "") }, a.style)
					}
				}
			});
		});
		b.Register.StartupHook("HTML-CSS Jax Ready", function () {
			var g = MathJax.ElementJax.mml;
			var h = MathJax.OutputJax["HTML-CSS"];
			var f = g.math.prototype.toHTML, i = g.merror.prototype.toHTML;
			g.math.Augment({
				toHTML: function (j, _k) {
					var l = this.data[0];
					if (l && l.data[0] && l.data[0].isError) {
						j.style.fontSize = "";
						j = this.HTMLcreateSpan(j);
						j.bbox = l.data[0].toHTML(j).bbox;
					} else {
						j = f.apply(this, arguments);
					}
					return j;
				}
			});
			g.merror.Augment({
				toHTML: function (p) {
					if (!this.isError) {
						return i.apply(this, arguments);
					}
					p = this.HTMLcreateSpan(p);
					p.className = "noError";
					if (this.multiLine) {
						p.style.display = "inline-block";
					}
					var r = this.data[0].data[0].data.join("").split(/\n/);
					for (var o = 0, l = r.length; o < l; o++) {
						h.addText(p, r[o]);
						if (o !== l - 1) {
							h.addElement(p, "br", { isMathJax: true });
						}
					}
					var q = h.getHD(p.parentNode), k = h.getW(p.parentNode);
					if (l > 1) {
						var n = (q.h + q.d) / 2, j = h.TeX.x_height / 2;
						p.parentNode.style.verticalAlign = h.Em(q.d + (j - n));
						q.h = j + n;
						q.d = n - j;
					}
					p.bbox = { h: q.h, d: q.d, w: k, lw: 0, rw: k };
					return p;
				}
			});
		});
		b.Register.StartupHook("SVG Jax Config", function () {
			b.Config({
				SVG: {
					styles: {
						".MathJax_SVG .noError": b.Insert({ "vertical-align": (b.Browser.isMSIE && a.multiLine ? "-2px" : "") }, a.style)
					}
				}
			});
		});
		b.Register.StartupHook("SVG Jax Ready", function () {
			var g = MathJax.ElementJax.mml;
			var f = g.math.prototype.toSVG, h = g.merror.prototype.toSVG;
			g.math.Augment({
				toSVG: function (i, _j) {
					var k = this.data[0];
					if (k && k.data[0] && k.data[0].isError) {
						i = k.data[0].toSVG(i);
					} else {
						i = f.apply(this, arguments);
					}
					return i;
				}
			});
			g.merror.Augment({
				toSVG: function (n) {
					if (!this.isError || this.Parent().type !== "math") {
						return h.apply(this, arguments);
					}
					n = e.addElement(n, "span", { className: "noError", isMathJax: true });
					if (this.multiLine) {
						n.style.display = "inline-block";
					}
					var o = this.data[0].data[0].data.join("").split(/\n/);
					for (var l = 0, j = o.length; l < j; l++) {
						e.addText(n, o[l]);
						if (l !== j - 1) {
							e.addElement(n, "br", { isMathJax: true });
						}
					}
					if (j > 1) {
						var k = n.offsetHeight / 2;
						n.style.verticalAlign = (-k + (k / j)) + "px";
					}
					return n;
				}
			});
		});
		b.Register.StartupHook("NativeMML Jax Ready", function () {
			var h = MathJax.ElementJax.mml;
			var g = MathJax.Extension["TeX/noErrors"].config;
			var f = h.math.prototype.toNativeMML, i = h.merror.prototype.toNativeMML;
			h.math.Augment({
				toNativeMML: function (j) {
					var k = this.data[0];
					if (k && k.data[0] && k.data[0].isError) {
						j = k.data[0].toNativeMML(j);
					} else {
						j = f.apply(this, arguments);
					}
					return j;
				}
			});
			h.merror.Augment({
				toNativeMML: function (n) {
					if (!this.isError) {
						return i.apply(this, arguments);
					}
					n = n.appendChild(document.createElement("span"));
					var o = this.data[0].data[0].data.join("").split(/\n/);
					for (var l = 0, k = o.length; l < k; l++) {
						n.appendChild(document.createTextNode(o[l]));
						if (l !== k - 1) {
							n.appendChild(document.createElement("br"));
						}
					}
					if (this.multiLine) {
						n.style.display = "inline-block";
						if (k > 1) {
							n.style.verticalAlign = "middle";
						}
					}
					for (var p in g.style) {
						if (g.style.hasOwnProperty(p)) {
							var j = p.replace(/-./g, function (m) {
								return m.charAt(1).toUpperCase()
							});
							n.style[j] = g.style[p];
						}
					}
					return n;
				}
			});
		});
		b.Register.StartupHook("PreviewHTML Jax Config", function () {
			b.Config({
				PreviewHTML: {
					styles: { ".MathJax_PHTML .noError": b.Insert({ "vertical-align": (b.Browser.isMSIE && a.multiLine ? "-2px" : "") }, a.style) }
				}
			});
		});
		b.Register.StartupHook("PreviewHTML Jax Ready", function () {
			var f = MathJax.ElementJax.mml;
			var h = MathJax.HTML;
			var g = f.merror.prototype.toPreviewHTML;
			f.merror.Augment({
				toPreviewHTML: function (l) {
					if (!this.isError) {
						return g.apply(this, arguments);
					}
					l = this.PHTMLcreateSpan(l);
					l.className = "noError";
					if (this.multiLine) {
						l.style.display = "inline-block";
					}
					var n = this.data[0].data[0].data.join("").split(/\n/);
					for (var k = 0, j = n.length; k < j; k++) {
						h.addText(l, n[k]);
						if (k !== j - 1) {
							h.addElement(l, "br", { isMathJax: true });
						}
					}
					return l;
				}
			});
		});
		b.Register.StartupHook("CommonHTML Jax Config", function () {
			b.Config({
				CommonHTML: {
					styles: { ".mjx-chtml .mjx-noError": b.Insert({ "line-height": 1.2, "vertical-align": (b.Browser.isMSIE && a.multiLine ? "-2px" : "") }, a.style) }
				}
			});
		});
		b.Register.StartupHook("CommonHTML Jax Ready", function () {
			var f = MathJax.ElementJax.mml;
			var g = MathJax.OutputJax.CommonHTML;
			var i = MathJax.HTML;
			var h = f.merror.prototype.toCommonHTML;
			f.merror.Augment({
				toCommonHTML: function (n) {
					if (!this.isError) {
						return h.apply(this, arguments);
					}
					n = g.addElement(n, "mjx-noError");
					var p = this.data[0].data[0].data.join("").split(/\n/);
					for (var k = 0, j = p.length; k < j; k++) {
						i.addText(n, p[k]);
						if (k !== j - 1) {
							g.addElement(n, "br", { isMathJax: true });
						}
					}
					var o = this.CHTML = g.BBOX.zero();
					o.w = (n.offsetWidth) / g.em;
					if (j > 1) {
						var l = 1.2 * j / 2;
						o.h = l + 0.25;
						o.d = l - 0.25;
						n.style.verticalAlign = g.Em(0.45 - l);
					} else {
						o.h = 1;
						o.d = 0.2 + 2 / g.em;
					}
					return n;
				}
			});
		});
		b.Startup.signal.Post("TeX noErrors Ready");
	})(MathJax.Hub, MathJax.HTML);
	MathJax.Ajax.loadComplete("[MathJax]/extensions/TeX/noErrors.js");
}
if (false){
	MathJax.Extension["TeX/noUndefined"] = {
		version: "2.7.1",
		config: MathJax.Hub.CombineConfig("TeX.noUndefined", { disabled: false, attributes: { mathcolor: "red" } })
	};
	MathJax.Hub.Register.StartupHook("TeX Jax Ready", function () {
		var b = MathJax.Extension["TeX/noUndefined"].config;
		var a = MathJax.ElementJax.mml;
		var c = MathJax.InputJax.TeX.Parse.prototype.csUndefined;
		MathJax.InputJax.TeX.Parse.Augment({
			csUndefined: function (d) {
				if (b.disabled) {
					return c.apply(this, arguments);
				}
				MathJax.Hub.signal.Post(["TeX Jax - undefined control sequence", d]);
				this.Push(a.mtext(d).With(b.attributes));
			}
		});
		MathJax.Hub.Startup.signal.Post("TeX noUndefined Ready");
	});
	MathJax.Ajax.loadComplete("[MathJax]/extensions/TeX/noUndefined.js");
}

TEX_PARSER(MathJax.InputJax.TeX, MathJax.Hub, MathJax.Ajax);

if (true){
	MathJax.Extension["TeX/AMSmath"] = {
		version: "2.7.1",
		number: 0,
		startNumber: 0,
		IDs: {},
		eqIDs: {},
		labels: {},
		eqlabels: {},
		refs: []
	};
	MathJax.Hub.Register.StartupHook("TeX Jax Ready", function () {
		var mml = MathJax.ElementJax.mml;
		var tex = MathJax.InputJax.TeX;
		var g = MathJax.Extension["TeX/AMSmath"];
		var d = tex.Definitions;
		var stackItem = tex.Stack.Item;
		var a = tex.config.equationNumbers;
		var c = function (k) {
			var n = [];
			for (var l = 0, j = k.length; l < j; l++) {
				n[l] = tex.Parse.prototype.Em(k[l]);
			}
			return n.join(" ");
		};
		var e = (document.getElementsByTagName("base").length === 0) ? "" : String(document.location).replace(/#.*$/, "");
		d.Add({
			mathchar0mo: { iiiint: ["2A0C", { texClass: mml.TEXCLASS.OP }] },
			macros: {
				mathring: ["Accent", "2DA"],
				nobreakspace: "Tilde",
				negmedspace: ["Spacer", mml.LENGTH.NEGATIVEMEDIUMMATHSPACE],
				negthickspace: ["Spacer", mml.LENGTH.NEGATIVETHICKMATHSPACE],
				idotsint: ["MultiIntegral", "\\int\\cdots\\int"],
				dddot: ["Accent", "20DB"],
				ddddot: ["Accent", "20DC"],
				sideset: ["Macro", "\\mathop{\\mathop{\\rlap{\\phantom{#3}}}\\nolimits#1\\!\\mathop{#3}\\nolimits#2}", 3],
				boxed: ["Macro", "\\fbox{$\\displaystyle{#1}$}", 1],
				tag: "HandleTag",
				notag: "HandleNoTag",
				label: "HandleLabel",
				ref: "HandleRef",
				eqref: ["HandleRef", true],
				substack: ["Macro", "\\begin{subarray}{c}#1\\end{subarray}", 1],
				injlim: ["NamedOp", "inj&thinsp;lim"],
				projlim: ["NamedOp", "proj&thinsp;lim"],
				varliminf: ["Macro", "\\mathop{\\underline{\\mmlToken{mi}{lim}}}"],
				varlimsup: ["Macro", "\\mathop{\\overline{\\mmlToken{mi}{lim}}}"],
				varinjlim: ["Macro", "\\mathop{\\underrightarrow{\\mmlToken{mi}{lim}}}"],
				varprojlim: ["Macro", "\\mathop{\\underleftarrow{\\mmlToken{mi}{lim}}}"],
				DeclareMathOperator: "HandleDeclareOp",
				operatorname: "HandleOperatorName",
				SkipLimits: "SkipLimits",
				genfrac: "Genfrac",
				frac: ["Genfrac", "", "", "", ""],
				tfrac: ["Genfrac", "", "", "", 1],
				dfrac: ["Genfrac", "", "", "", 0],
				binom: ["Genfrac", "(", ")", "0", ""],
				tbinom: ["Genfrac", "(", ")", "0", 1],
				dbinom: ["Genfrac", "(", ")", "0", 0],
				cfrac: "CFrac",
				shoveleft: ["HandleShove", mml.ALIGN.LEFT],
				shoveright: ["HandleShove", mml.ALIGN.RIGHT],
				xrightarrow: ["xArrow", 8594, 5, 6],
				xleftarrow: ["xArrow", 8592, 7, 3]
			},
			environment: {
				align: ["AMSarray", null, true, true, "rlrlrlrlrlrl", c([0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0])],
				"align*": ["AMSarray", null, false, true, "rlrlrlrlrlrl", c([0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0])],
				multline: ["Multline", null, true],
				"multline*": ["Multline", null, false],
				split: ["AMSarray", null, false, false, "rl", c([0])],
				gather: ["AMSarray", null, true, true, "c"],
				"gather*": ["AMSarray", null, false, true, "c"],
				alignat: ["AlignAt", null, true, true],
				"alignat*": ["AlignAt", null, false, true],
				alignedat: ["AlignAt", null, false, false],
				aligned: ["AlignedAMSArray", null, null, null, "rlrlrlrlrlrl", c([0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0]), ".5em", "D"],
				gathered: ["AlignedAMSArray", null, null, null, "c", null, ".5em", "D"],
				subarray: ["Array", null, null, null, null, c([0]), "0.1em", "S", 1],
				smallmatrix: ["Array", null, null, null, "c", c([1 / 3]), ".2em", "S", 1],
				equation: ["EquationBegin", "Equation", true], "equation*": ["EquationBegin", "EquationStar", false],
				eqnarray: ["AMSarray", null, true, true, "rcl", "0 " + mml.LENGTH.THICKMATHSPACE, ".5em"],
				"eqnarray*": ["AMSarray", null, false, true, "rcl", "0 " + mml.LENGTH.THICKMATHSPACE, ".5em"]
			},
			delimiter: {
				"\\lvert": ["007C", { texClass: mml.TEXCLASS.OPEN }],
				"\\rvert": ["007C", { texClass: mml.TEXCLASS.CLOSE }],
				"\\lVert": ["2016", { texClass: mml.TEXCLASS.OPEN }],
				"\\rVert": ["2016", { texClass: mml.TEXCLASS.CLOSE }]
			}
		}, null, true);
		tex.Parse.Augment({
			HandleTag: function (k) {
				var m = this.GetStar();
				var j = this.trimSpaces(this.GetArgument(k)), i = j;
				if (!m) { j = a.formatTag(j) }
				var l = this.stack.global;
				l.tagID = i;
				if (l.notags) {
					tex.Error(["CommandNotAllowedInEnv", "%1 not allowed in %2 environment", k, l.notags]);
				}
				if (l.tag) {
					tex.Error(["MultipleCommand", "Multiple %1", k]);
				}
				l.tag = mml.mtd.apply(mml, this.InternalMath(j)).With({ id: a.formatID(i) });
			},
			HandleNoTag: function (_i) {
				if (this.stack.global.tag) {
					delete this.stack.global.tag;
				}
				this.stack.global.notag = true;
			},
			HandleLabel: function (j) {
				var k = this.stack.global, i = this.GetArgument(j);
				if (i === "") { return }
				if (!g.refUpdate) {
					if (k.label) {
						tex.Error(["MultipleCommand", "Multiple %1", j]);
					}
					k.label = i;
					if (g.labels[i] || g.eqlabels[i]) {
						tex.Error(["MultipleLabel", "Label '%1' multiply defined", i]);
					}
					g.eqlabels[i] = { tag: "???", id: "" };
				}
			},
			HandleRef: function (k, m) {
				var j = this.GetArgument(k);
				var l = g.labels[j] || g.eqlabels[j];
				if (!l) {
					l = { tag: "???", id: "" };
					g.badref = !g.refUpdate;
				}
				var i = l.tag; if (m) { i = a.formatTag(i) }
				this.Push(mml.mrow.apply(mml, this.InternalMath(i)).With({ href: a.formatURL(l.id, e), "class": "MathJax_ref" }));
			},
			HandleDeclareOp: function (j) {
				var i = (this.GetStar() ? "" : "\\nolimits\\SkipLimits");
				var k = this.trimSpaces(this.GetArgument(j));
				if (k.charAt(0) == "\\") { k = k.substr(1) }
				var l = this.GetArgument(j);
				l = l.replace(/\*/g, "\\text{*}").replace(/-/g, "\\text{-}");
				tex.Definitions.macros[k] = ["Macro", "\\mathop{\\rm " + l + "}" + i]
			},
			HandleOperatorName: function (j) { var i = (this.GetStar() ? "" : "\\nolimits\\SkipLimits"); var k = this.trimSpaces(this.GetArgument(j)); k = k.replace(/\*/g, "\\text{*}").replace(/-/g, "\\text{-}"); this.string = "\\mathop{\\rm " + k + "}" + i + " " + this.string.slice(this.i); this.i = 0 },
			SkipLimits: function (_j) { var l = this.GetNext(), k = this.i; if (l === "\\" && ++this.i && this.GetCS() !== "limits") { this.i = k } },
			HandleShove: function (j, i) { var k = this.stack.Top(); if (k.type !== "multline" || k.data.length) { tex.Error(["CommandAtTheBeginingOfLine", "%1 must come at the beginning of the line", j]) } k.data.shove = i },
			CFrac: function (l) { var i = this.trimSpaces(this.GetBrackets(l, "")), k = this.GetArgument(l), m = this.GetArgument(l); var j = mml.mfrac(tex.Parse("\\strut\\textstyle{" + k + "}", this.stack.env).mml(), tex.Parse("\\strut\\textstyle{" + m + "}", this.stack.env).mml()); i = ({ l: mml.ALIGN.LEFT, r: mml.ALIGN.RIGHT, "": "" })[i]; if (i == null) { tex.Error(["IllegalAlign", "Illegal alignment specified in %1", l]) } if (i) { j.numalign = j.denomalign = i } this.Push(j) },
			Genfrac: function (j, l, q, n, i) { if (l == null) { l = this.GetDelimiterArg(j) } if (q == null) { q = this.GetDelimiterArg(j) } if (n == null) { n = this.GetArgument(j) } if (i == null) { i = this.trimSpaces(this.GetArgument(j)) } var m = this.ParseArg(j); var p = this.ParseArg(j); var k = mml.mfrac(m, p); if (n !== "") { k.linethickness = n } if (l || q) { k = tex.fixedFence(l, k.With({ texWithDelims: true }), q) } if (i !== "") { var o = (["D", "T", "S", "SS"])[i]; if (o == null) { tex.Error(["BadMathStyleFor", "Bad math style for %1", j]) } k = mml.mstyle(k); if (o === "D") { k.displaystyle = true; k.scriptlevel = 0 } else { k.displaystyle = false; k.scriptlevel = i - 1 } } this.Push(k) },
			Multline: function (j, i) { this.Push(j); this.checkEqnEnv(); return stackItem.multline(i, this.stack).With({ arraydef: { displaystyle: true, rowspacing: ".5em", width: tex.config.MultLineWidth, columnwidth: "100%", side: tex.config.TagSide, minlabelspacing: tex.config.TagIndent } }) },
			AMSarray: function (k, j, i, m, l) { this.Push(k); if (i) { this.checkEqnEnv() } m = m.replace(/[^clr]/g, "").split("").join(" "); m = m.replace(/l/g, "left").replace(/r/g, "right").replace(/c/g, "center"); return stackItem.AMSarray(k.name, j, i, this.stack).With({ arraydef: { displaystyle: true, rowspacing: ".5em", columnalign: m, columnspacing: (l || "1em"), rowspacing: "3pt", side: tex.config.TagSide, minlabelspacing: tex.config.TagIndent } }) },
			AlignedAMSArray: function (i) { var j = this.GetBrackets("\\begin{" + i.name + "}"); return this.setArrayAlign(this.AMSarray.apply(this, arguments), j) },
			AlignAt: function (l, j, i) { var q, k, p = "", o = []; if (!i) { k = this.GetBrackets("\\begin{" + l.name + "}") } q = this.GetArgument("\\begin{" + l.name + "}"); if (q.match(/[^0-9]/)) { tex.Error(["PositiveIntegerArg", "Argument to %1 must me a positive integer", "\\begin{" + l.name + "}"]) } while (q > 0) { p += "rl"; o.push("0em 0em"); q-- } o = o.join(" "); if (i) { return this.AMSarray(l, j, i, p, o) } var m = this.AMSarray(l, j, i, p, o); return this.setArrayAlign(m, k) },
			EquationBegin: function (i, j) { this.checkEqnEnv(); this.stack.global.forcetag = (j && a.autoNumber !== "none"); return i },
			EquationStar: function (_i, j) { this.stack.global.tagged = true; return j },
			checkEqnEnv: function () { if (this.stack.global.eqnenv) { tex.Error(["ErroneousNestingEq", "Erroneous nesting of equation structures"]) } this.stack.global.eqnenv = true },
			MultiIntegral: function (j, m) { var l = this.GetNext(); if (l === "\\") { var k = this.i; l = this.GetArgument(j); this.i = k; if (l === "\\limits") { if (j === "\\idotsint") { m = "\\!\\!\\mathop{\\,\\," + m + "}" } else { m = "\\!\\!\\!\\mathop{\\,\\,\\," + m + "}" } } } this.string = m + " " + this.string.slice(this.i); this.i = 0 },
			xArrow: function (k, o, n, i) { var m = { width: "+" + (n + i) + "mu", lspace: n + "mu" }; var p = this.GetBrackets(k), q = this.ParseArg(k); var s = mml.mo(mml.chars(String.fromCharCode(o))).With({ stretchy: true, texClass: mml.TEXCLASS.REL }); var j = mml.munderover(s); j.SetData(j.over, mml.mpadded(q).With(m).With({ voffset: ".15em" })); if (p) { p = tex.Parse(p, this.stack.env).mml(); j.SetData(j.under, mml.mpadded(p).With(m).With({ voffset: "-.24em" })) } this.Push(j.With({ subsupOK: true })) },
			GetDelimiterArg: function (i) { var j = this.trimSpaces(this.GetArgument(i)); if (j == "") { return null } if (j in d.delimiter) { return j } tex.Error(["MissingOrUnrecognizedDelim", "Missing or unrecognized delimiter for %1", i]) },
			GetStar: function () { var i = (this.GetNext() === "*"); if (i) { this.i++ } return i }
		});
		stackItem.Augment({
			autoTag: function () {
				var j = this.global;
				if (!j.notag) {
					g.number++;
					j.tagID = a.formatNumber(g.number.toString());
					var i = tex.Parse("\\text{" + a.formatTag(j.tagID) + "}", {}).mml();
					j.tag = mml.mtd(i).With({ id: a.formatID(j.tagID) });
				}
			},
			getTag: function () {
				var m = this.global, k = m.tag;
				m.tagged = true;
				if (m.label) {
					if (a.useLabelIds) {
						k.id = a.formatID(m.label);
					}
					g.eqlabels[m.label] = { tag: m.tagID, id: k.id };
				}
				if (document.getElementById(k.id) || g.IDs[k.id] || g.eqIDs[k.id]) {
					var l = 0, j;
					do {
						l++;
						j = k.id + "_" + l;
					}
					while (document.getElementById(j) || g.IDs[j] || g.eqIDs[j]);
					k.id = j;
					if (m.label) { g.eqlabels[m.label].id = j }
				}
				g.eqIDs[k.id] = 1;
				this.clearTag();
				return k;
			},
			clearTag: function () {
				var i = this.global;
				delete i.tag;
				delete i.tagID;
				delete i.label;
			},
			fixInitialMO: function (l) {
				for (var k = 0, j = l.length; k < j; k++) {
					if (l[k] && (l[k].type !== "mspace" && (l[k].type !== "texatom" || (l[k].data[0] && l[k].data[0].data.length)))) {
						if (l[k].isEmbellished()) {
							l.unshift(mml.mi());
						}
						break;
					}
				}
			}
		});
		stackItem.multline = stackItem.array.Subclass({
			type: "multline",
			Init: function (j, i) {
				this.SUPER(arguments).Init.apply(this);
				this.numbered = (j && a.autoNumber !== "none");
				this.save = { notag: i.global.notag };
				i.global.tagged = !j && !i.global.forcetag;
			},
			EndEntry: function () {
				if (this.table.length) { this.fixInitialMO(this.data) }
				var i = mml.mtd.apply(mml, this.data);
				if (this.data.shove) { i.columnalign = this.data.shove }
				this.row.push(i);
				this.data = [];
			},
			EndRow: function () {
				if (this.row.length != 1) {
					tex.Error(["MultlineRowsOneCol", "The rows within the %1 environment must have exactly one column", "multline"]);
				}
				this.table.push(this.row);
				this.row = [];
			},
			EndTable: function () {
				this.SUPER(arguments).EndTable.call(this);
				if (this.table.length) {
					var k = this.table.length - 1, n, l = -1;
					if (!this.table[0][0].columnalign) {
						this.table[0][0].columnalign = mml.ALIGN.LEFT;
					}
					if (!this.table[k][0].columnalign) {
						this.table[k][0].columnalign = mml.ALIGN.RIGHT;
					}
					if (!this.global.tag && this.numbered) { this.autoTag() }
					if (this.global.tag && !this.global.notags) {
						l = (this.arraydef.side === "left" ? 0 : this.table.length - 1);
						this.table[l] = [this.getTag()].concat(this.table[l]);
					}
					for (n = 0, k = this.table.length; n < k; n++) {
						var j = (n === l ? mml.mlabeledtr : mml.mtr);
						this.table[n] = j.apply(mml, this.table[n]);
					}
				}
				this.global.notag = this.save.notag;
			}
		});
		stackItem.AMSarray = stackItem.array.Subclass({
			type: "AMSarray",
			Init: function (l, k, j, i) {
				this.SUPER(arguments).Init.apply(this);
				this.numbered = (k && a.autoNumber !== "none");
				this.save = { notags: i.global.notags, notag: i.global.notag };
				i.global.notags = (j ? null : l);
				i.global.tagged = !k && !i.global.forcetag;
			},
			EndEntry: function () {
				if (this.row.length) { this.fixInitialMO(this.data) }
				this.row.push(mml.mtd.apply(mml, this.data));
				this.data = [];
			},
			EndRow: function () {
				var i = mml.mtr;
				if (!this.global.tag && this.numbered) {
					this.autoTag();
				}
				if (this.global.tag && !this.global.notags) {
					this.row = [this.getTag()].concat(this.row);
					i = mml.mlabeledtr;
				} else {
					this.clearTag();
				}
				if (this.numbered) {
					delete this.global.notag;
				}
				this.table.push(i.apply(mml, this.row));
				this.row = [];
			},
			EndTable: function () {
				this.SUPER(arguments).EndTable.call(this);
				this.global.notags = this.save.notags;
				this.global.notag = this.save.notag;
			}
		});
		stackItem.start.Augment({
			oldCheckItem: stackItem.start.prototype.checkItem,
			checkItem: function (k) {
				if (k.type === "stop") {
					var i = this.mmlData(), j = this.global;
					if (g.display && !j.tag && !j.tagged && !j.isInner && (a.autoNumber === "all" || j.forcetag)) {
						this.autoTag();
					}
					if (j.tag) {
						var m = [this.getTag(), mml.mtd(i)];
						var l = { side: tex.config.TagSide, minlabelspacing: tex.config.TagIndent, displaystyle: "inherit" };
						i = mml.mtable(mml.mlabeledtr.apply(mml, m)).With(l);
					}
					return stackItem.mml(i);
				}
				return this.oldCheckItem.call(this, k);
			}
		});
		tex.prefilterHooks.Add(function (i) {
			g.display = i.display;
			g.number = g.startNumber;
			g.eqlabels = {};
			g.eqIDs = {};
			g.badref = false;
			if (g.refUpdate) {
				g.number = i.script.MathJax.startNumber;
			}
		});
		tex.postfilterHooks.Add(function (i) {
			i.script.MathJax.startNumber = g.startNumber;
			g.startNumber = g.number;
			MathJax.Hub.Insert(g.IDs, g.eqIDs);
			MathJax.Hub.Insert(g.labels, g.eqlabels);
			if (g.badref && !i.math.texError) { g.refs.push(i.script) }
		}, 100);
		MathJax.Hub.Register.MessageHook("Begin Math Input", function () {
			g.refs = []; g.refUpdate = false
		});
		MathJax.Hub.Register.MessageHook("End Math Input", function (_l) {
			if (g.refs.length) {
				g.refUpdate = true;
				for (var k = 0, j = g.refs.length; k < j; k++) {
					g.refs[k].MathJax.state = MathJax.ElementJax.STATE.UPDATE;
				}
				return MathJax.Hub.processInput({ scripts: g.refs, start: new Date().getTime(), i: 0, j: 0, jax: {}, jaxIDs: [] });
			}
			return null;
		});
		tex.resetEquationNumbers = function (j, i) {
			g.startNumber = (j || 0);
			if (!i) {
				g.labels = {};
				g.IDs = {};
			}
		};
		MathJax.Hub.Startup.signal.Post("TeX AMSmath Ready");
	});
	MathJax.Ajax.loadComplete("[MathJax]/extensions/TeX/AMSmath.js");
}
if (false){
	MathJax.Extension["TeX/AMSsymbols"] = { version: "2.7.1" };
	MathJax.Hub.Register.StartupHook("TeX Jax Ready", function () {
		var a = MathJax.ElementJax.mml, b = MathJax.InputJax.TeX.Definitions;
		b.Add({
			mathchar0mi: {
				digamma: "03DD",
				varkappa: "03F0",
				varGamma: ["0393", { mathvariant: a.VARIANT.ITALIC }],
				varDelta: ["0394", { mathvariant: a.VARIANT.ITALIC }],
				varTheta: ["0398", { mathvariant: a.VARIANT.ITALIC }],
				varLambda: ["039B", { mathvariant: a.VARIANT.ITALIC }],
				varXi: ["039E", { mathvariant: a.VARIANT.ITALIC }],
				varPi: ["03A0", { mathvariant: a.VARIANT.ITALIC }],
				varSigma: ["03A3", { mathvariant: a.VARIANT.ITALIC }],
				varUpsilon: ["03A5", { mathvariant: a.VARIANT.ITALIC }],
				varPhi: ["03A6", { mathvariant: a.VARIANT.ITALIC }],
				varPsi: ["03A8", { mathvariant: a.VARIANT.ITALIC }],
				varOmega: ["03A9", { mathvariant: a.VARIANT.ITALIC }],
				beth: "2136",
				gimel: "2137",
				daleth: "2138",
				backprime: ["2035", { variantForm: true }],
				hslash: "210F",
				varnothing: ["2205", { variantForm: true }],
				blacktriangle: "25B4",
				triangledown: ["25BD", { variantForm: true }],
				blacktriangledown: "25BE",
				square: "25FB",
				Box: "25FB",
				blacksquare: "25FC",
				lozenge: "25CA",
				Diamond: "25CA",
				blacklozenge: "29EB",
				circledS: ["24C8", { mathvariant: a.VARIANT.NORMAL }],
				bigstar: "2605",
				sphericalangle: "2222",
				measuredangle: "2221",
				nexists: "2204",
				complement: "2201",
				mho: "2127",
				eth: ["00F0", { mathvariant: a.VARIANT.NORMAL }],
				Finv: "2132",
				diagup: "2571",
				Game: "2141",
				diagdown: "2572",
				Bbbk: ["006B", { mathvariant: a.VARIANT.DOUBLESTRUCK }],
				yen: "00A5",
				circledR: "00AE",
				checkmark: "2713",
				maltese: "2720"
			},
			mathchar0mo: {
				dotplus: "2214", ltimes: "22C9", smallsetminus: "2216", rtimes: "22CA", Cap: "22D2", doublecap: "22D2", leftthreetimes: "22CB", Cup: "22D3", doublecup: "22D3", rightthreetimes: "22CC", barwedge: "22BC", curlywedge: "22CF", veebar: "22BB", curlyvee: "22CE", doublebarwedge: "2A5E", boxminus: "229F", circleddash: "229D", boxtimes: "22A0", circledast: "229B", boxdot: "22A1", circledcirc: "229A", boxplus: "229E", centerdot: ["22C5", { variantForm: true }], divideontimes: "22C7", intercal: "22BA", leqq: "2266", geqq: "2267", leqslant: "2A7D", geqslant: "2A7E", eqslantless: "2A95", eqslantgtr: "2A96", lesssim: "2272", gtrsim: "2273", lessapprox: "2A85", gtrapprox: "2A86", approxeq: "224A", lessdot: "22D6", gtrdot: "22D7", lll: "22D8", llless: "22D8", ggg: "22D9", gggtr: "22D9", lessgtr: "2276", gtrless: "2277", lesseqgtr: "22DA", gtreqless: "22DB", lesseqqgtr: "2A8B", gtreqqless: "2A8C", doteqdot: "2251", Doteq: "2251", eqcirc: "2256", risingdotseq: "2253", circeq: "2257", fallingdotseq: "2252", triangleq: "225C", backsim: "223D", thicksim: ["223C", { variantForm: true }], backsimeq: "22CD", thickapprox: ["2248", { variantForm: true }], subseteqq: "2AC5", supseteqq: "2AC6", Subset: "22D0", Supset: "22D1", sqsubset: "228F", sqsupset: "2290", preccurlyeq: "227C", succcurlyeq: "227D", curlyeqprec: "22DE", curlyeqsucc: "22DF", precsim: "227E", succsim: "227F", precapprox: "2AB7", succapprox: "2AB8", vartriangleleft: "22B2", lhd: "22B2", vartriangleright: "22B3", rhd: "22B3", trianglelefteq: "22B4", unlhd: "22B4", trianglerighteq: "22B5", unrhd: "22B5", vDash: "22A8", Vdash: "22A9", Vvdash: "22AA", smallsmile: ["2323", { variantForm: true }], shortmid: ["2223", { variantForm: true }], smallfrown: ["2322", { variantForm: true }], shortparallel: ["2225", { variantForm: true }], bumpeq: "224F", between: "226C", Bumpeq: "224E", pitchfork: "22D4", varpropto: "221D", backepsilon: "220D", blacktriangleleft: "25C2", blacktriangleright: "25B8", therefore: "2234", because: "2235", eqsim: "2242", vartriangle: ["25B3", { variantForm: true }], Join: "22C8", nless: "226E", ngtr: "226F", nleq: "2270", ngeq: "2271", nleqslant: ["2A87", { variantForm: true }], ngeqslant: ["2A88", { variantForm: true }], nleqq: ["2270", { variantForm: true }], ngeqq: ["2271", { variantForm: true }], lneq: "2A87", gneq: "2A88", lneqq: "2268", gneqq: "2269", lvertneqq: ["2268", { variantForm: true }], gvertneqq: ["2269", { variantForm: true }], lnsim: "22E6", gnsim: "22E7", lnapprox: "2A89", gnapprox: "2A8A", nprec: "2280", nsucc: "2281", npreceq: ["22E0", { variantForm: true }], nsucceq: ["22E1", { variantForm: true }], precneqq: "2AB5", succneqq: "2AB6", precnsim: "22E8", succnsim: "22E9", precnapprox: "2AB9", succnapprox: "2ABA", nsim: "2241", ncong: "2246", nshortmid: ["2224", { variantForm: true }], nshortparallel: ["2226", { variantForm: true }], nmid: "2224", nparallel: "2226", nvdash: "22AC", nvDash: "22AD", nVdash: "22AE", nVDash: "22AF", ntriangleleft: "22EA", ntriangleright: "22EB", ntrianglelefteq: "22EC", ntrianglerighteq: "22ED", nsubseteq: "2288", nsupseteq: "2289", nsubseteqq: ["2288", { variantForm: true }], nsupseteqq: ["2289", { variantForm: true }], subsetneq: "228A", supsetneq: "228B", varsubsetneq: ["228A", { variantForm: true }], varsupsetneq: ["228B", { variantForm: true }], subsetneqq: "2ACB", supsetneqq: "2ACC", varsubsetneqq: ["2ACB", { variantForm: true }], varsupsetneqq: ["2ACC", { variantForm: true }], leftleftarrows: "21C7", rightrightarrows: "21C9", leftrightarrows: "21C6", rightleftarrows: "21C4", Lleftarrow: "21DA", Rrightarrow: "21DB", twoheadleftarrow: "219E", twoheadrightarrow: "21A0", leftarrowtail: "21A2", rightarrowtail: "21A3", looparrowleft: "21AB", looparrowright: "21AC", leftrightharpoons: "21CB", rightleftharpoons: ["21CC", { variantForm: true }], curvearrowleft: "21B6", curvearrowright: "21B7", circlearrowleft: "21BA", circlearrowright: "21BB", Lsh: "21B0", Rsh: "21B1", upuparrows: "21C8", downdownarrows: "21CA", upharpoonleft: "21BF", upharpoonright: "21BE", downharpoonleft: "21C3", restriction: "21BE", multimap: "22B8", downharpoonright: "21C2", leftrightsquigarrow: "21AD", rightsquigarrow: "21DD", leadsto: "21DD", dashrightarrow: "21E2", dashleftarrow: "21E0", nleftarrow: "219A", nrightarrow: "219B", nLeftarrow: "21CD", nRightarrow: "21CF", nleftrightarrow: "21AE", nLeftrightarrow: "21CE"
			},
			delimiter: {
				"\\ulcorner": "231C", "\\urcorner": "231D", "\\llcorner": "231E", "\\lrcorner": "231F"
			},
			macros: {
				implies: ["Macro", "\\;\\Longrightarrow\\;"],
				impliedby: ["Macro", "\\;\\Longleftarrow\\;"]
			}
		}, null, true);
		var c = a.mo.OPTYPES.REL;
		MathJax.Hub.Insert(a.mo.prototype, {
			OPTABLE: {
				infix: { "\u2322": c, "\u2323": c, "\u25B3": c, "\uE006": c, "\uE007": c, "\uE00C": c, "\uE00D": c, "\uE00E": c, "\uE00F": c, "\uE010": c, "\uE011": c, "\uE016": c, "\uE017": c, "\uE018": c, "\uE019": c, "\uE01A": c, "\uE01B": c, "\uE04B": c, "\uE04F": c }
			}
		});
		MathJax.Hub.Startup.signal.Post("TeX AMSsymbols Ready");
	});
	MathJax.Ajax.loadComplete("[MathJax]/extensions/TeX/AMSsymbols.js");
}

ASCII_PARSER(MathJax.InputJax.AsciiMath);

PREVIEW_HTML(MathJax.Ajax, MathJax.Hub, MathJax.HTML, MathJax.OutputJax.PreviewHTML);
//FAST_PREVIEW(MathJax.Hub, MathJax.HTML, MathJax.Hub.Browser);
//MML(MathJax.InputJax.MathML, MathJax.Hub.Browser);
//ASSISTIVE_MML(MathJax.Ajax, MathJax.Callback, MathJax.Hub, MathJax.HTML);

!function (a, b) {
	var c, d, e = a.config.menuSettings;
	var f = Function.prototype.bind ? function (a, b) { return a.bind(b) } : function (a, b) {
		return function () { a.apply(b, arguments); }
	};
	var g = Object.keys || function (a) {
		var b = [];
		for (var c in a) a.hasOwnProperty(c) && b.push(c);
		return b;
	};
	var h = MathJax.Ajax.config.path;
	h.a11y || (h.a11y = a.config.root + "/extensions/a11y");
	var i = b["accessibility-menu"] = {
		version: "1.2.0",
		prefix: "",
		default: {},
		modules: [],
		MakeOption: function (a) {
			return i.prefix + a
		},
		GetOption: function (a) { return e[i.MakeOption(a)] },
		AddDefaults: function () { for (var a, b = g(i.default), c = 0; a = b[c]; c++) { var d = i.MakeOption(a); void 0 === e[d] && (e[d] = i.default[a]) } },
		AddMenu: function () { for (var a, b = Array(this.modules.length), e = 0; a = this.modules[e]; e++)b[e] = a.placeHolder; var f = d.FindId("Accessibility"); if (f) b.unshift(c.RULE()), f.submenu.items.push.apply(f.submenu.items, b); else { var g = (d.FindId("Settings", "Renderer") || {}).submenu; g && (b.unshift(c.RULE()), b.unshift(g.items.pop()), b.unshift(g.items.pop())), b.unshift("Accessibility"); var f = c.SUBMENU.apply(c.SUBMENU, b), h = d.IndexOfId("Locale"); h ? d.items.splice(h, 0, f) : d.items.push(c.RULE(), f) } },
		Register: function (a) { i.default[a.option] = !1, i.modules.push(a) },
		Startup: function () { c = MathJax.Menu.ITEM, d = MathJax.Menu.menu; for (var a, b = 0; a = this.modules[b]; b++)a.CreateMenu(); this.AddMenu() },
		LoadExtensions: function () { for (var b = [], c = 0; module = this.modules[c]; c++)e[module.option] && b.push(module.module); return b.length ? a.Startup.loadArray(b) : null }
	};
	var j = MathJax.Extension.ModuleLoader = MathJax.Object.Subclass({
		option: "",
		name: ["", ""],
		module: "",
		placeHolder: null,
		submenu: !1,
		extension: null,
		Init: function (a, b, c, d, e) { this.option = a, this.name = [b.replace(/ /g, ""), b], this.module = c, this.extension = d, this.submenu = e || !1 },
		CreateMenu: function () { var a = f(this.Load, this); this.submenu ? this.placeHolder = c.SUBMENU(this.name, c.CHECKBOX(["Activate", "Activate"], i.MakeOption(this.option), { action: a }), c.RULE(), c.COMMAND(["OptionsWhenActive", "(Options when Active)"], null, { disabled: !0 })) : this.placeHolder = c.CHECKBOX(this.name, i.MakeOption(this.option), { action: a }) },
		Load: function () { a.Queue(["Require", MathJax.Ajax, this.module, ["Enable", this]]) },
		Enable: function (_a) { var b = MathJax.Extension[this.extension]; b && (b.Enable(!0, !0), MathJax.Menu.saveCookie()) }
	});
	i.Register(j("collapsible", "Collapsible Math", "[a11y]/collapsible.js", "collapsible"));
	i.Register(j("autocollapse", "Auto Collapse", "[a11y]/auto-collapse.js", "auto-collapse"));
	i.Register(j("explorer", "Explorer", "[a11y]/explorer.js", "explorer", !0));
	i.AddDefaults(), a.Register.StartupHook("End Extensions", function () {
		a.Register.StartupHook("MathMenu Ready", function () {
			i.Startup(), a.Startup.signal.Post("Accessibility Menu Ready");
		}, 5);
	}, 5);
	new QUEUE(["LoadExtensions", i], ["loadComplete", MathJax.Ajax, "[a11y]/accessibility-menu.js"]);
}(MathJax.Hub, MathJax.Extension);

MathJax.Ajax.loadComplete("[MathJax]/config/TeX-MML-AM_CHTML.js");
