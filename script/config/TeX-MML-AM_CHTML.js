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

if (true) {
	MathJax.InputJax.TeX = MathJax.InputJax(new TeX());
	MathJax.InputJax.TeX.Register("math/tex");
	MathJax.InputJax.TeX.loadComplete("config.js");
}
if (true) {
	MathJax.OutputJax.CommonHTML = MathJax.OutputJax(new CommonHTML());
	if (!MathJax.Hub.config.delayJaxRegistration) {
		MathJax.OutputJax.CommonHTML.Register("jax/mml");
	}
	MathJax.OutputJax.CommonHTML.loadComplete("config.js");
}

MathJax.Extension.tex2jax = new Tex2Jax();
MathJax.Hub.Register.PreProcessor(["PreProcess", MathJax.Extension.tex2jax]);
MathJax.Ajax.loadComplete("[MathJax]/extensions/tex2jax.js");
MathJax.Extension.mml2jax = new MML2Jax();
MathJax.Hub.Register.PreProcessor(["PreProcess", MathJax.Extension.mml2jax], 5);
MathJax.Ajax.loadComplete("[MathJax]/extensions/mml2jax.js");

MENU(MathJax.Hub, MathJax.HTML, MathJax.Ajax, MathJax.Callback, MathJax.Localization, MathJax.OutputJax, MathJax.InputJax);

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
	SIZE: {
		INFINITY: "infinity",
		SMALL: "small",
		NORMAL: "normal",
		BIG: "big"
	},
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
	FORM: {
		PREFIX: "prefix",
		INFIX: "infix",
		POSTFIX: "postfix"
	},
	LINEBREAK: {
		AUTO: "auto",
		NEWLINE: "newline",
		NOBREAK: "nobreak",
		GOODBREAK: "goodbreak",
		BADBREAK: "badbreak"
	},
	LINEBREAKSTYLE: {
		BEFORE: "before",
		AFTER: "after",
		DUPLICATE: "duplicate",
		INFIXLINBREAKSTYLE: "infixlinebreakstyle"
	},
	INDENTALIGN: {
		LEFT: "left",
		CENTER: "center",
		RIGHT: "right",
		AUTO: "auto",
		ID: "id",
		INDENTALIGN: "indentalign"
	},
	INDENTSHIFT: { INDENTSHIFT: "indentshift" },
	LINETHICKNESS: {
		THIN: "thin",
		MEDIUM: "medium",
		THICK: "thick"
	},
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
	ALIGN: {
		TOP: "top",
		BOTTOM: "bottom",
		CENTER: "center",
		BASELINE: "baseline",
		AXIS: "axis",
		LEFT: "left",
		RIGHT: "right"
	},
	LINES: {
		NONE: "none",
		SOLID: "solid",
		DASHED: "dashed"
	},
	SIDE: {
		LEFT: "left",
		RIGHT: "right",
		LEFTOVERLAP: "leftoverlap",
		RIGHTOVERLAP: "rightoverlap"
	},
	WIDTH: { AUTO: "auto", FIT: "fit" },
	ACTIONTYPE: {
		TOGGLE: "toggle",
		STATUSLINE: "statusline",
		TOOLTIP: "tooltip",
		INPUT: "input"
	},
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
	OVERFLOW: {
		LINBREAK: "linebreak",
		SCROLL: "scroll",
		ELIDE: "elide",
		TRUNCATE: "truncate",
		SCALE: "scale"
	},
	UNIT: {
		EM: "em",
		EX: "ex",
		PX: "px",
		IN: "in",
		CM: "cm",
		MM: "mm",
		PT: "pt",
		PC: "pc"
	},
	TEXCLASS: {
		ORD: 0,
		OP: 1,
		BIN: 2,
		REL: 3,
		OPEN: 4,
		CLOSE: 5,
		PUNCT: 6,
		INNER: 7,
		VCENTER: 8,
		NONE: -1
	},
	TEXCLASSNAMES: [
		"ORD",
		"OP",
		"BIN",
		"REL",
		"OPEN",
		"CLOSE",
		"PUNCT",
		"INNER",
		"VCENTER"
	],
	skipAttributes: {
		texClass: true,
		useHeight: true,
		texprimestyle: true
	},
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
	copyAttributeNames: [
		"displaystyle",
		"scriptlevel",
		"open",
		"close",
		"form",
		"actiontype",
		"fontfamily",
		"fontsize",
		"fontweight",
		"fontstyle",
		"color",
		"background",
		"id",
		"class",
		"href",
		"style"
	],
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
		var c = this.merror(d),
			b = MathJax.Localization.fontDirection(),
			a = MathJax.Localization.fontFamily();
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

TEX_PARSER(MathJax.InputJax.TeX, MathJax.Hub, MathJax.Ajax);

AMSmath();

MathJax.Ajax.loadComplete("[MathJax]/config/TeX-MML-AM_CHTML.js");
