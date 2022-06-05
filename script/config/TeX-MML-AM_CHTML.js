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

MathJax.InputJax.TeX = MathJax.InputJax(new TeX());
MathJax.InputJax.TeX.Register("math/tex");
MathJax.InputJax.TeX.loadComplete("config.js");
MathJax.OutputJax.CommonHTML = MathJax.OutputJax(new CommonHTML());
if (!MathJax.Hub.config.delayJaxRegistration) {
	MathJax.OutputJax.CommonHTML.Register("jax/mml");
}
MathJax.OutputJax.CommonHTML.loadComplete("config.js");
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
