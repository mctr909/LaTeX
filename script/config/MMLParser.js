function MML_PARSER(mml) {
	mml.mbase = MathJax.Object.Subclass({
		type: "base",
		isToken: false,
		defaults: { mathbackground: mml.INHERIT, mathcolor: mml.INHERIT, dir: mml.INHERIT },
		noInherit: {},
		noInheritAttribute: { texClass: true },
		getRemoved: {},
		linebreakContainer: false,
		Init: function () {
			this.data = [];
			if (this.inferRow && !(arguments.length === 1 && arguments[0].inferred)) {
				this.Append(mml.mrow().With({ inferred: true, notParent: true }));
			}
			this.Append.apply(this, arguments);
		},
		With: function (e) {
			for (var f in e) {
				if (e.hasOwnProperty(f)) {
					this[f] = e[f];
				}
			}
			return this;
		},
		Append: function () {
			if (this.inferRow && this.data.length) {
				this.data[0].Append.apply(this.data[0], arguments);
			} else {
				for (var f = 0, e = arguments.length; f < e; f++) {
					this.SetData(this.data.length, arguments[f]);
				}
			}
		},
		SetData: function (e, f) {
			if (f != null) {
				if (!(f instanceof mml.mbase)) {
					f = (this.isToken || this.isChars ? mml.chars(f) : mml.mtext(f));
				}
				f.parent = this;
				f.setInherit(this.inheritFromMe ? this : this.inherit);
			}
			this.data[e] = f;
		},
		Parent: function () {
			var e = this.parent;
			while (e && e.notParent) { e = e.parent }
			return e;
		},
		Get: function (f, k, l) {
			if (!l) {
				if (this[f] != null) { return this[f] }
				if (this.attr && this.attr[f] != null) { return this.attr[f] }
			}
			var g = this.Parent();
			if (g && g["adjustChild_" + f] != null) {
				return (g["adjustChild_" + f])(this.childPosition(), k);
			}
			var j = this.inherit;
			var e = j;
			while (j) {
				var i = j[f];
				if (i == null && j.attr) { i = j.attr[f] }
				if (j.removedStyles && j.getRemoved[f] && i == null) {
					i = j.removedStyles[j.getRemoved[f]];
				}
				if (i != null && j.noInheritAttribute && !j.noInheritAttribute[f]) {
					var h = j.noInherit[this.type]; if (!(h && h[f])) { return i }
				}
				e = j;
				j = j.inherit;
			}
			if (!k) {
				if (this.defaults[f] === mml.AUTO) {
					return this.autoDefault(f);
				}
				if (this.defaults[f] !== mml.INHERIT && this.defaults[f] != null) {
					return this.defaults[f];
				}
				if (e) {
					return e.defaults[f];
				}
			}
			return null;
		},
		hasValue: function (e) {
			return (this.Get(e, true) != null);
		},
		getValues: function () {
			var f = {};
			for (var g = 0, e = arguments.length; g < e; g++) {
				f[arguments[g]] = this.Get(arguments[g]);
			}
			return f;
		},
		adjustChild_scriptlevel: function (_f, e) { return this.Get("scriptlevel", e) },
		adjustChild_displaystyle: function (_f, e) { return this.Get("displaystyle", e) },
		adjustChild_texprimestyle: function (_f, e) { return this.Get("texprimestyle", e) },
		childPosition: function () {
			var h = this, g = h.parent;
			while (g.notParent) { h = g; g = h.parent }
			for (var f = 0, e = g.data.length; f < e; f++) {
				if (g.data[f] === h) { return f }
			}
			return null;
		},
		setInherit: function (g) {
			if (g !== this.inherit && this.inherit == null) {
				this.inherit = g;
				for (var f = 0, e = this.data.length; f < e; f++) {
					if (this.data[f] && this.data[f].setInherit) {
						this.data[f].setInherit(g);
					}
				}
			}
		},
		setTeXclass: function (e) {
			this.getPrevClass(e);
			return (typeof (this.texClass) !== "undefined" ? this : e);
		},
		getPrevClass: function (e) {
			if (e) {
				this.prevClass = e.Get("texClass");
				this.prevLevel = e.Get("scriptlevel");
			}
		},
		updateTeXclass: function (e) {
			if (e) {
				this.prevClass = e.prevClass;
				delete e.prevClass;
				this.prevLevel = e.prevLevel;
				delete e.prevLevel;
				this.texClass = e.Get("texClass");
			}
		},
		texSpacing: function () {
			var f = (this.prevClass != null ? this.prevClass : mml.TEXCLASS.NONE);
			var e = (this.Get("texClass") || mml.TEXCLASS.ORD);
			if (f === mml.TEXCLASS.NONE || e === mml.TEXCLASS.NONE) { return "" }
			if (f === mml.TEXCLASS.VCENTER) { f = mml.TEXCLASS.ORD }
			if (e === mml.TEXCLASS.VCENTER) { e = mml.TEXCLASS.ORD }
			var g = this.TEXSPACE[f][e];
			if ((this.prevLevel > 0 || this.Get("scriptlevel") > 0) && g >= 0) { return "" }
			return this.TEXSPACELENGTH[Math.abs(g)];
		},
		TEXSPACELENGTH: ["", mml.LENGTH.THINMATHSPACE, mml.LENGTH.MEDIUMMATHSPACE, mml.LENGTH.THICKMATHSPACE],
		TEXSPACE: [
			[0, -1, 2, 3, 0, 0, 0, 1],
			[-1, -1, 0, 3, 0, 0, 0, 1],
			[2, 2, 0, 0, 2, 0, 0, 2],
			[3, 3, 0, 0, 3, 0, 0, 3],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, -1, 2, 3, 0, 0, 0, 1],
			[1, 1, 0, 1, 1, 1, 1, 1],
			[1, -1, 2, 3, 1, 0, 1, 1]
		],
		autoDefault: function (_e) { return "" },
		isSpacelike: function () { return false },
		isEmbellished: function () { return false },
		Core: function () { return this },
		CoreMO: function () { return this },
		childIndex: function (g) {
			if (g == null) { return }
			for (var f = 0, e = this.data.length; f < e; f++) {
				if (g === this.data[f]) { return f }
			}
		},
		CoreIndex: function () {
			return (this.inferRow ? this.data[0] || this : this).childIndex(this.Core());
		},
		hasNewline: function () {
			if (this.isEmbellished()) {
				return this.CoreMO().hasNewline();
			}
			if (this.isToken || this.linebreakContainer) { return false }
			for (var f = 0, e = this.data.length; f < e; f++) {
				if (this.data[f] && this.data[f].hasNewline()) { return true }
			}
			return false;
		},
		array: function () {
			if (this.inferred) {
				return this.data;
			} else {
				return [this];
			}
		},
		toString: function () {
			return this.type + "(" + this.data.join(",") + ")";
		},
		getAnnotation: function () { return null }
	}, {
		childrenSpacelike: function () {
			for (var f = 0, e = this.data.length; f < e; f++) {
				if (!this.data[f].isSpacelike()) { return false }
			}
			return true;
		},
		childEmbellished: function () {
			return (this.data[0] && this.data[0].isEmbellished());
		},
		childCore: function () {
			return (this.inferRow && this.data[0] ? this.data[0].Core() : this.data[0]);
		},
		childCoreMO: function () {
			return (this.data[0] ? this.data[0].CoreMO() : null);
		},
		setChildTeXclass: function (e) {
			if (this.data[0]) {
				e = this.data[0].setTeXclass(e);
				this.updateTeXclass(this.data[0]);
			}
			return e;
		},
		setBaseTeXclasses: function (g) {
			this.getPrevClass(g);
			this.texClass = null;
			if (this.data[0]) {
				if (this.isEmbellished() || this.data[0].isa(mml.mi)) {
					g = this.data[0].setTeXclass(g);
					this.updateTeXclass(this.Core());
				} else {
					this.data[0].setTeXclass();
					g = this;
				}
			} else {
				g = this;
			}
			for (var f = 1, e = this.data.length; f < e; f++) {
				if (this.data[f]) {
					this.data[f].setTeXclass();
				}
			}
			return g;
		},
		setSeparateTeXclasses: function (g) {
			this.getPrevClass(g);
			for (var f = 0, e = this.data.length; f < e; f++) {
				if (this.data[f]) {
					this.data[f].setTeXclass();
				}
			}
			if (this.isEmbellished()) {
				this.updateTeXclass(this.Core());
			}
			return this;
		}
	});
	mml.mi = mml.mbase.Subclass({
		type: "mi",
		isToken: true,
		texClass: mml.TEXCLASS.ORD,
		defaults: {
			mathvariant: mml.AUTO,
			mathsize: mml.INHERIT,
			mathbackground: mml.INHERIT,
			mathcolor: mml.INHERIT,
			dir: mml.INHERIT
		},
		autoDefault: function (f) {
			if (f === "mathvariant") {
				var e = (this.data[0] || "").toString();
				return (e.length === 1 || (e.length === 2 && e.charCodeAt(0) >= 55296 && e.charCodeAt(0) < 56320)
					? mml.VARIANT.ITALIC : mml.VARIANT.NORMAL
				);
			}
			return "";
		},
		setTeXclass: function (f) {
			this.getPrevClass(f);
			var e = this.data.join("");
			if (e.length > 1 && e.match(/^[a-z][a-z0-9]*$/i) && this.texClass === mml.TEXCLASS.ORD) {
				this.texClass = mml.TEXCLASS.OP;
				this.autoOP = true;
			}
			return this;
		}
	});
	mml.mn = mml.mbase.Subclass({
		type: "mn",
		isToken: true,
		texClass: mml.TEXCLASS.ORD,
		defaults: { mathvariant: mml.INHERIT, mathsize: mml.INHERIT, mathbackground: mml.INHERIT, mathcolor: mml.INHERIT, dir: mml.INHERIT }
	});
	mml.mo = mml.mbase.Subclass({
		type: "mo",
		isToken: true,
		defaults: {
			mathvariant: mml.INHERIT,
			mathsize: mml.INHERIT,
			mathbackground: mml.INHERIT,
			mathcolor: mml.INHERIT,
			dir: mml.INHERIT,
			form: mml.AUTO,
			fence: mml.AUTO,
			separator: mml.AUTO,
			lspace: mml.AUTO,
			rspace: mml.AUTO,
			stretchy: mml.AUTO,
			symmetric: mml.AUTO,
			maxsize: mml.AUTO,
			minsize: mml.AUTO,
			largeop: mml.AUTO,
			movablelimits: mml.AUTO,
			accent: mml.AUTO,
			linebreak: mml.LINEBREAK.AUTO,
			lineleading: mml.INHERIT,
			linebreakstyle: mml.AUTO,
			linebreakmultchar: mml.INHERIT,
			indentalign: mml.INHERIT,
			indentshift: mml.INHERIT,
			indenttarget: mml.INHERIT,
			indentalignfirst: mml.INHERIT,
			indentshiftfirst: mml.INHERIT,
			indentalignlast: mml.INHERIT,
			indentshiftlast: mml.INHERIT,
			texClass: mml.AUTO
		},
		defaultDef: {
			form: mml.FORM.INFIX,
			fence: false,
			separator: false,
			lspace: mml.LENGTH.THICKMATHSPACE,
			rspace: mml.LENGTH.THICKMATHSPACE,
			stretchy: false,
			symmetric: false,
			maxsize: mml.SIZE.INFINITY,
			minsize: "0em",
			largeop: false,
			movablelimits: false,
			accent: false,
			linebreak: mml.LINEBREAK.AUTO,
			lineleading: "1ex",
			linebreakstyle: "before",
			indentalign: mml.INDENTALIGN.AUTO,
			indentshift: "0",
			indenttarget: "",
			indentalignfirst: mml.INDENTALIGN.INDENTALIGN,
			indentshiftfirst: mml.INDENTSHIFT.INDENTSHIFT,
			indentalignlast: mml.INDENTALIGN.INDENTALIGN,
			indentshiftlast: mml.INDENTSHIFT.INDENTSHIFT,
			texClass: mml.TEXCLASS.REL
		},
		SPACE_ATTR: { lspace: 1, rspace: 2, form: 4 },
		useMMLspacing: 7,
		autoDefault: function (g, n) {
			var l = this.def;
			if (!l) {
				if (g === "form") {
					this.useMMLspacing &= ~this.SPACE_ATTR.form;
					return this.getForm();
				}
				var k = this.data.join("");
				var f = [this.Get("form"), mml.FORM.INFIX, mml.FORM.POSTFIX, mml.FORM.PREFIX];
				for (var h = 0, e = f.length; h < e; h++) {
					var j = this.OPTABLE[f[h]][k];
					if (j) {
						l = this.makeDef(j);
						break;
					}
				}
				if (!l) { l = this.CheckRange(k) }
				if (!l && n) {
					l = {};
				} else {
					if (!l) {
						l = MathJax.Hub.Insert({}, this.defaultDef)
					}
					if (this.parent) {
						this.def = l;
					} else {
						l = MathJax.Hub.Insert({}, l);
					}
					l.form = f[0];
				}
			}
			this.useMMLspacing &= ~(this.SPACE_ATTR[g] || 0);
			if (l[g] != null) {
				return l[g];
			} else {
				if (!n) { return this.defaultDef[g] }
			}
			return "";
		},
		CheckRange: function (j) {
			var k = j.charCodeAt(0);
			if (k >= 55296 && k < 56320) {
				k = (((k - 55296) << 10) + (j.charCodeAt(1) - 56320)) + 65536;
			}
			for (var g = 0, e = this.RANGES.length; g < e && this.RANGES[g][0] <= k; g++) {
				if (k <= this.RANGES[g][1]) {
					if (this.RANGES[g][3]) {
						var f = mml.optableDir + "/" + this.RANGES[g][3] + ".js";
						this.RANGES[g][3] = null; MathJax.Hub.RestartAfter(MathJax.Ajax.Require(f));
					}
					var h = mml.TEXCLASSNAMES[this.RANGES[g][2]];
					h = this.OPTABLE.infix[j] = mml.mo.OPTYPES[h === "BIN" ? "BIN3" : h];
					return this.makeDef(h);
				}
			}
			return null;
		},
		makeDef: function (f) {
			if (f[2] == null) {
				f[2] = this.defaultDef.texClass;
			}
			if (!f[3]) { f[3] = {} }
			var e = MathJax.Hub.Insert({}, f[3]);
			e.lspace = this.SPACE[f[0]];
			e.rspace = this.SPACE[f[1]];
			e.texClass = f[2];
			if (e.texClass === mml.TEXCLASS.REL && (this.movablelimits || this.data.join("").match(/^[a-z]+$/i))) {
				e.texClass = mml.TEXCLASS.OP;
			}
			return e;
		},
		getForm: function () {
			var e = this, g = this.parent, f = this.Parent();
			while (f && f.isEmbellished()) {
				e = g;
				g = f.parent;
				f = f.Parent();
			}
			if (g && g.type === "mrow" && g.NonSpaceLength() !== 1) {
				if (g.FirstNonSpace() === e) {
					return mml.FORM.PREFIX;
				}
				if (g.LastNonSpace() === e) {
					return mml.FORM.POSTFIX;
				}
			}
			return mml.FORM.INFIX;
		},
		isEmbellished: function () { return true },
		hasNewline: function () { return (this.Get("linebreak") === mml.LINEBREAK.NEWLINE) },
		CoreParent: function () {
			var e = this;
			while (e && e.isEmbellished() && e.CoreMO() === this && !e.isa(mml.math)) {
				e = e.Parent();
			}
			return e;
		},
		CoreText: function (e) {
			if (!e) { return "" }
			if (e.isEmbellished()) {
				return e.CoreMO().data.join("");
			}
			while ((((e.isa(mml.mrow) || e.isa(mml.TeXAtom) || e.isa(mml.mstyle) || e.isa(mml.mphantom)) && e.data.length === 1) || e.isa(mml.munderover)) && e.data[0]) {
				e = e.data[0];
			}
			if (!e.isToken) {
				return "";
			} else {
				return e.data.join("");
			}
		},
		remapChars: {
			"*": "\u2217",
			'"': "\u2033",
			"\u00B0": "\u2218",
			"\u00B2": "2",
			"\u00B3": "3",
			"\u00B4": "\u2032",
			"\u00B9": "1"
		},
		remap: function (f, e) {
			f = f.replace(/-/g, "\u2212");
			if (e) {
				f = f.replace(/'/g, "\u2032").replace(/`/g, "\u2035");
				if (f.length === 1) {
					f = e[f] || f;
				}
			}
			return f;
		},
		setTeXclass: function (f) {
			var e = this.getValues("form", "lspace", "rspace", "fence");
			if (this.useMMLspacing) {
				this.texClass = mml.TEXCLASS.NONE;
				return this;
			}
			if (e.fence && !this.texClass) {
				if (e.form === mml.FORM.PREFIX) {
					this.texClass = mml.TEXCLASS.OPEN;
				}
				if (e.form === mml.FORM.POSTFIX) {
					this.texClass = mml.TEXCLASS.CLOSE;
				}
			}
			this.texClass = this.Get("texClass");
			if (this.data.join("") === "\u2061") {
				if (f) {
					f.texClass = mml.TEXCLASS.OP;
					f.fnOP = true;
				}
				this.texClass = this.prevClass = mml.TEXCLASS.NONE;
				return f;
			}
			return this.adjustTeXclass(f);
		},
		adjustTeXclass: function (f) {
			if (this.texClass === mml.TEXCLASS.NONE) { return f }
			if (f) {
				if (f.autoOP && (this.texClass === mml.TEXCLASS.BIN || this.texClass === mml.TEXCLASS.REL)) {
					f.texClass = mml.TEXCLASS.ORD;
				}
				this.prevClass = f.texClass || mml.TEXCLASS.ORD;
				this.prevLevel = f.Get("scriptlevel");
			} else {
				this.prevClass = mml.TEXCLASS.NONE;
			}
			if (this.texClass === mml.TEXCLASS.BIN && (this.prevClass === mml.TEXCLASS.NONE || this.prevClass === mml.TEXCLASS.BIN || this.prevClass === mml.TEXCLASS.OP || this.prevClass === mml.TEXCLASS.REL || this.prevClass === mml.TEXCLASS.OPEN || this.prevClass === mml.TEXCLASS.PUNCT)) {
				this.texClass = mml.TEXCLASS.ORD;
			} else {
				if (this.prevClass === mml.TEXCLASS.BIN && (this.texClass === mml.TEXCLASS.REL || this.texClass === mml.TEXCLASS.CLOSE || this.texClass === mml.TEXCLASS.PUNCT)) {
					f.texClass = this.prevClass = mml.TEXCLASS.ORD;
				} else {
					if (this.texClass === mml.TEXCLASS.BIN) {
						var g = this, e = this.parent;
						while (e && e.parent && e.isEmbellished() && (e.data.length === 1 || (e.type !== "mrow" && e.Core() === g))) {
							g = e;
							e = e.parent;
						}
						if (e.data[e.data.length - 1] === g) {
							this.texClass = mml.TEXCLASS.ORD;
						}
					}
				}
			}
			return this;
		}
	});
	mml.mtext = mml.mbase.Subclass({
		type: "mtext",
		isToken: true,
		isSpacelike: function () { return true },
		texClass: mml.TEXCLASS.ORD,
		defaults: { mathvariant: mml.INHERIT, mathsize: mml.INHERIT, mathbackground: mml.INHERIT, mathcolor: mml.INHERIT, dir: mml.INHERIT }
	});
	mml.mspace = mml.mbase.Subclass({
		type: "mspace",
		isToken: true,
		isSpacelike: function () { return true },
		defaults: {
			mathbackground: mml.INHERIT,
			mathcolor: mml.INHERIT,
			width: "0em",
			height: "0ex",
			depth: "0ex",
			linebreak: mml.LINEBREAK.AUTO
		},
		hasDimAttr: function () {
			return (this.hasValue("width") || this.hasValue("height") || this.hasValue("depth"));
		},
		hasNewline: function () {
			return (!this.hasDimAttr() && this.Get("linebreak") === mml.LINEBREAK.NEWLINE);
		}
	});
	mml.ms = mml.mbase.Subclass({
		type: "ms",
		isToken: true,
		texClass: mml.TEXCLASS.ORD,
		defaults: {
			mathvariant: mml.INHERIT,
			mathsize: mml.INHERIT,
			mathbackground: mml.INHERIT,
			mathcolor: mml.INHERIT,
			dir: mml.INHERIT,
			lquote: '"',
			rquote: '"'
		}
	});
	mml.mglyph = mml.mbase.Subclass({
		type: "mglyph",
		isToken: true,
		texClass: mml.TEXCLASS.ORD,
		defaults: { mathbackground: mml.INHERIT, mathcolor: mml.INHERIT, alt: "", src: "", width: mml.AUTO, height: mml.AUTO, valign: "0em" }
	});
	mml.mrow = mml.mbase.Subclass({
		type: "mrow",
		isSpacelike: mml.mbase.childrenSpacelike,
		inferred: false,
		notParent: false,
		isEmbellished: function () {
			var f = false;
			for (var g = 0, e = this.data.length; g < e; g++) {
				if (this.data[g] == null) { continue }
				if (this.data[g].isEmbellished()) {
					if (f) { return false }
					f = true;
					this.core = g;
				} else {
					if (!this.data[g].isSpacelike()) {
						return false;
					}
				}
			}
			return f;
		},
		NonSpaceLength: function () {
			var g = 0;
			for (var f = 0, e = this.data.length; f < e; f++) {
				if (this.data[f] && !this.data[f].isSpacelike()) { g++ }
			}
			return g;
		},
		FirstNonSpace: function () {
			for (var f = 0, e = this.data.length; f < e; f++) {
				if (this.data[f] && !this.data[f].isSpacelike()) { return this.data[f] }
			}
			return null;
		},
		LastNonSpace: function () {
			for (var e = this.data.length - 1; e >= 0; e--) {
				if (this.data[0] && !this.data[e].isSpacelike()) { return this.data[e] }
			}
			return null;
		},
		Core: function () {
			if (!(this.isEmbellished()) || typeof (this.core) === "undefined") { return this }
			return this.data[this.core];
		},
		CoreMO: function () {
			if (!(this.isEmbellished()) || typeof (this.core) === "undefined") { return this }
			return this.data[this.core].CoreMO();
		},
		toString: function () {
			if (this.inferred) {
				return "[" + this.data.join(",") + "]";
			}
			return this.SUPER(arguments).toString.call(this);
		},
		setTeXclass: function (g) {
			var f, e = this.data.length;
			if ((this.open || this.close) && (!g || !g.fnOP)) {
				this.getPrevClass(g);
				g = null;
				for (f = 0; f < e; f++) {
					if (this.data[f]) {
						g = this.data[f].setTeXclass(g);
					}
				}
				if (!this.hasOwnProperty("texClass")) {
					this.texClass = mml.TEXCLASS.INNER;
				}
				return this;
			} else {
				for (f = 0; f < e; f++) {
					if (this.data[f]) {
						g = this.data[f].setTeXclass(g);
					}
				}
				if (this.data[0]) {
					this.updateTeXclass(this.data[0]);
				}
				return g;
			}
		},
		getAnnotation: function (e) {
			if (this.data.length != 1) { return null }
			return this.data[0].getAnnotation(e);
		}
	});
	mml.mfrac = mml.mbase.Subclass({
		type: "mfrac",
		num: 0,
		den: 1,
		linebreakContainer: true,
		isEmbellished: mml.mbase.childEmbellished,
		Core: mml.mbase.childCore,
		CoreMO: mml.mbase.childCoreMO,
		defaults: {
			mathbackground: mml.INHERIT,
			mathcolor: mml.INHERIT,
			linethickness: mml.LINETHICKNESS.MEDIUM,
			numalign: mml.ALIGN.CENTER,
			denomalign: mml.ALIGN.CENTER,
			bevelled: false
		},
		adjustChild_displaystyle: function (_e) {
			return false;
		},
		adjustChild_scriptlevel: function (_f) {
			var e = this.Get("scriptlevel");
			if (!this.Get("displaystyle") || e > 0) {
				e++;
			}
			return e;
		},
		adjustChild_texprimestyle: function (e) {
			if (e == this.den) { return true }
			return this.Get("texprimestyle");
		},
		setTeXclass: mml.mbase.setSeparateTeXclasses
	});
	mml.msqrt = mml.mbase.Subclass({
		type: "msqrt",
		inferRow: true,
		linebreakContainer: true,
		texClass: mml.TEXCLASS.ORD,
		setTeXclass: mml.mbase.setSeparateTeXclasses,
		adjustChild_texprimestyle: function (_e) { return true }
	});
	mml.mroot = mml.mbase.Subclass({
		type: "mroot",
		linebreakContainer: true,
		texClass: mml.TEXCLASS.ORD,
		adjustChild_displaystyle: function (e) { if (e === 1) { return false } return this.Get("displaystyle") },
		adjustChild_scriptlevel: function (f) { var e = this.Get("scriptlevel"); if (f === 1) { e += 2 } return e },
		adjustChild_texprimestyle: function (e) { if (e === 0) { return true } return this.Get("texprimestyle") },
		setTeXclass: mml.mbase.setSeparateTeXclasses
	});
	mml.mstyle = mml.mbase.Subclass({
		type: "mstyle",
		isSpacelike: mml.mbase.childrenSpacelike,
		isEmbellished: mml.mbase.childEmbellished,
		Core: mml.mbase.childCore,
		CoreMO: mml.mbase.childCoreMO,
		inferRow: true,
		defaults: {
			scriptlevel: mml.INHERIT,
			displaystyle: mml.INHERIT,
			scriptsizemultiplier: Math.sqrt(1 / 2),
			scriptminsize: "8pt",
			mathbackground: mml.INHERIT,
			mathcolor: mml.INHERIT,
			dir: mml.INHERIT,
			infixlinebreakstyle: mml.LINEBREAKSTYLE.BEFORE,
			decimalseparator: "."
		},
		adjustChild_scriptlevel: function (_g) {
			var f = this.scriptlevel;
			if (f == null) {
				f = this.Get("scriptlevel");
			} else {
				if (String(f).match(/^ *[-+]/)) {
					var e = this.Get("scriptlevel", null, true);
					f = e + parseInt(f);
				}
			}
			return f;
		},
		inheritFromMe: true,
		noInherit: {
			mpadded: { width: true, height: true, depth: true, lspace: true, voffset: true },
			mtable: { width: true, height: true, depth: true, align: true }
		},
		getRemoved: { fontfamily: "fontFamily", fontweight: "fontWeight", fontstyle: "fontStyle", fontsize: "fontSize" },
		setTeXclass: mml.mbase.setChildTeXclass
	});
	mml.merror = mml.mbase.Subclass({
		type: "merror",
		inferRow: true,
		linebreakContainer: true,
		texClass: mml.TEXCLASS.ORD
	});
	mml.mpadded = mml.mbase.Subclass({
		type: "mpadded",
		inferRow: true,
		isSpacelike: mml.mbase.childrenSpacelike,
		isEmbellished: mml.mbase.childEmbellished,
		Core: mml.mbase.childCore,
		CoreMO: mml.mbase.childCoreMO,
		defaults: {
			mathbackground: mml.INHERIT, mathcolor: mml.INHERIT, width: "", height: "", depth: "", lspace: 0, voffset: 0
		},
		setTeXclass: mml.mbase.setChildTeXclass
	});
	mml.mphantom = mml.mbase.Subclass({
		type: "mphantom",
		texClass: mml.TEXCLASS.ORD,
		inferRow: true,
		isSpacelike: mml.mbase.childrenSpacelike,
		isEmbellished: mml.mbase.childEmbellished,
		Core: mml.mbase.childCore,
		CoreMO: mml.mbase.childCoreMO,
		setTeXclass: mml.mbase.setChildTeXclass
	});
	mml.mfenced = mml.mbase.Subclass({
		type: "mfenced",
		defaults: { mathbackground: mml.INHERIT, mathcolor: mml.INHERIT, open: "(", close: ")", separators: "," },
		addFakeNodes: function () {
			var f = this.getValues("open", "close", "separators");
			f.open = f.open.replace(/[ \t\n\r]/g, "");
			f.close = f.close.replace(/[ \t\n\r]/g, "");
			f.separators = f.separators.replace(/[ \t\n\r]/g, "");
			if (f.open !== "") {
				this.SetData("open", mml.mo(f.open).With({ fence: true, form: mml.FORM.PREFIX, texClass: mml.TEXCLASS.OPEN }));
				this.data.open.useMMLspacing = 0;
			}
			if (f.separators !== "") {
				while (f.separators.length < this.data.length) {
					f.separators += f.separators.charAt(f.separators.length - 1);
				}
				for (var g = 1, e = this.data.length; g < e; g++) {
					if (this.data[g]) {
						this.SetData("sep" + g, mml.mo(f.separators.charAt(g - 1)).With({ separator: true }));
						this.data["sep" + g].useMMLspacing = 0;
					}
				}
			}
			if (f.close !== "") {
				this.SetData("close", mml.mo(f.close).With({ fence: true, form: mml.FORM.POSTFIX, texClass: mml.TEXCLASS.CLOSE }));
				this.data.close.useMMLspacing = 0;
			}
		},
		texClass: mml.TEXCLASS.OPEN,
		setTeXclass: function (g) {
			this.addFakeNodes();
			this.getPrevClass(g);
			if (this.data.open) {
				g = this.data.open.setTeXclass(g);
			}
			if (this.data[0]) {
				g = this.data[0].setTeXclass(g);
			}
			for (var f = 1, e = this.data.length; f < e; f++) {
				if (this.data["sep" + f]) {
					g = this.data["sep" + f].setTeXclass(g);
				}
				if (this.data[f]) {
					g = this.data[f].setTeXclass(g);
				}
			}
			if (this.data.close) {
				g = this.data.close.setTeXclass(g);
			}
			this.updateTeXclass(this.data.open);
			this.texClass = mml.TEXCLASS.INNER;
			return g;
		}
	});
	mml.menclose = mml.mbase.Subclass({
		type: "menclose",
		inferRow: true,
		linebreakContainer: true,
		defaults: { mathbackground: mml.INHERIT, mathcolor: mml.INHERIT, notation: mml.NOTATION.LONGDIV, texClass: mml.TEXCLASS.ORD },
		setTeXclass: mml.mbase.setSeparateTeXclasses
	});
	mml.msubsup = mml.mbase.Subclass({
		type: "msubsup",
		base: 0,
		sub: 1,
		sup: 2,
		isEmbellished: mml.mbase.childEmbellished,
		Core: mml.mbase.childCore,
		CoreMO: mml.mbase.childCoreMO,
		defaults: { mathbackground: mml.INHERIT, mathcolor: mml.INHERIT, subscriptshift: "", superscriptshift: "", texClass: mml.AUTO },
		autoDefault: function (e) {
			if (e === "texClass") {
				return (this.isEmbellished() ? this.CoreMO().Get(e) : mml.TEXCLASS.ORD);
			}
			return 0;
		},
		adjustChild_displaystyle: function (e) { if (e > 0) { return false } return this.Get("displaystyle") },
		adjustChild_scriptlevel: function (f) { var e = this.Get("scriptlevel"); if (f > 0) { e++ } return e },
		adjustChild_texprimestyle: function (e) { if (e === this.sub) { return true } return this.Get("texprimestyle") },
		setTeXclass: mml.mbase.setBaseTeXclasses
	});
	mml.msub = mml.msubsup.Subclass({ type: "msub" });
	mml.msup = mml.msubsup.Subclass({ type: "msup", sub: 2, sup: 1 });
	mml.mmultiscripts = mml.msubsup.Subclass({
		type: "mmultiscripts",
		adjustChild_texprimestyle: function (e) {
			if (e % 2 === 1) { return true }
			return this.Get("texprimestyle");
		}
	});
	mml.mprescripts = mml.mbase.Subclass({ type: "mprescripts" });
	mml.none = mml.mbase.Subclass({ type: "none" });
	mml.munderover = mml.mbase.Subclass({
		type: "munderover",
		base: 0,
		under: 1,
		over: 2,
		sub: 1,
		sup: 2,
		ACCENTS: ["", "accentunder", "accent"],
		linebreakContainer: true,
		isEmbellished: mml.mbase.childEmbellished,
		Core: mml.mbase.childCore,
		CoreMO: mml.mbase.childCoreMO,
		defaults: {
			mathbackground: mml.INHERIT,
			mathcolor: mml.INHERIT,
			accent: mml.AUTO,
			accentunder: mml.AUTO,
			align: mml.ALIGN.CENTER,
			texClass: mml.AUTO,
			subscriptshift: "",
			superscriptshift: ""
		},
		autoDefault: function (e) {
			if (e === "texClass") {
				return (this.isEmbellished() ? this.CoreMO().Get(e) : mml.TEXCLASS.ORD);
			}
			if (e === "accent" && this.data[this.over]) {
				return this.data[this.over].CoreMO().Get("accent");
			}
			if (e === "accentunder" && this.data[this.under]) {
				return this.data[this.under].CoreMO().Get("accent");
			}
			return false;
		},
		adjustChild_displaystyle: function (e) { if (e > 0) { return false } return this.Get("displaystyle") },
		adjustChild_scriptlevel: function (g) {
			var f = this.Get("scriptlevel");
			var e = (this.data[this.base] && !this.Get("displaystyle") && this.data[this.base].CoreMO().Get("movablelimits"));
			if (g == this.under && (e || !this.Get("accentunder"))) { f++ }
			if (g == this.over && (e || !this.Get("accent"))) { f++ }
			return f;
		},
		adjustChild_texprimestyle: function (e) {
			if (e === this.base && this.data[this.over]) { return true }
			return this.Get("texprimestyle");
		},
		setTeXclass: mml.mbase.setBaseTeXclasses
	});
	mml.munder = mml.munderover.Subclass({ type: "munder" });
	mml.mover = mml.munderover.Subclass({ type: "mover", over: 1, under: 2, sup: 1, sub: 2, ACCENTS: ["", "accent", "accentunder"] });
	mml.mtable = mml.mbase.Subclass({
		type: "mtable",
		defaults: {
			mathbackground: mml.INHERIT,
			mathcolor: mml.INHERIT,
			align: mml.ALIGN.AXIS,
			rowalign: mml.ALIGN.BASELINE,
			columnalign: mml.ALIGN.CENTER,
			groupalign: "{left}",
			alignmentscope: true,
			columnwidth: mml.WIDTH.AUTO,
			width: mml.WIDTH.AUTO,
			rowspacing: "1ex",
			columnspacing: ".8em",
			rowlines: mml.LINES.NONE,
			columnlines: mml.LINES.NONE,
			frame: mml.LINES.NONE,
			framespacing: "0.4em 0.5ex",
			equalrows: false,
			equalcolumns: false,
			displaystyle: false,
			side: mml.SIDE.RIGHT,
			minlabelspacing: "0.8em",
			texClass: mml.TEXCLASS.ORD,
			useHeight: 1
		},
		adjustChild_displaystyle: function () {
			return (this.displaystyle != null ? this.displaystyle : this.defaults.displaystyle);
		},
		inheritFromMe: true,
		noInherit: {
			mover: { align: true },
			munder: { align: true },
			munderover: { align: true },
			mtable: {
				align: true,
				rowalign: true,
				columnalign: true,
				groupalign: true,
				alignmentscope: true,
				columnwidth: true,
				width: true,
				rowspacing: true,
				columnspacing: true,
				rowlines: true,
				columnlines: true,
				frame: true,
				framespacing: true,
				equalrows: true,
				equalcolumns: true,
				displaystyle: true,
				side: true,
				minlabelspacing: true,
				texClass: true,
				useHeight: 1
			}
		},
		linebreakContainer: true,
		Append: function () {
			for (var f = 0, e = arguments.length; f < e; f++) {
				if (!((arguments[f] instanceof mml.mtr) || (arguments[f] instanceof mml.mlabeledtr))) {
					arguments[f] = mml.mtr(arguments[f]);
				}
			}
			this.SUPER(arguments).Append.apply(this, arguments);
		},
		setTeXclass: mml.mbase.setSeparateTeXclasses
	});
	mml.mtr = mml.mbase.Subclass({
		type: "mtr",
		defaults: { mathbackground: mml.INHERIT, mathcolor: mml.INHERIT, rowalign: mml.INHERIT, columnalign: mml.INHERIT, groupalign: mml.INHERIT },
		inheritFromMe: true,
		noInherit: {
			mrow: { rowalign: true, columnalign: true, groupalign: true },
			mtable: { rowalign: true, columnalign: true, groupalign: true }
		},
		linebreakContainer: true,
		Append: function () {
			for (var f = 0, e = arguments.length; f < e; f++) {
				if (!(arguments[f] instanceof mml.mtd)) {
					arguments[f] = mml.mtd(arguments[f]);
				}
			}
			this.SUPER(arguments).Append.apply(this, arguments);
		},
		setTeXclass: mml.mbase.setSeparateTeXclasses
	});
	mml.mtd = mml.mbase.Subclass({
		type: "mtd",
		inferRow: true,
		linebreakContainer: true,
		isEmbellished: mml.mbase.childEmbellished,
		Core: mml.mbase.childCore,
		CoreMO: mml.mbase.childCoreMO,
		defaults: {
			mathbackground: mml.INHERIT,
			mathcolor: mml.INHERIT,
			rowspan: 1,
			columnspan: 1,
			rowalign: mml.INHERIT,
			columnalign: mml.INHERIT,
			groupalign: mml.INHERIT
		},
		setTeXclass: mml.mbase.setSeparateTeXclasses
	});
	mml.maligngroup = mml.mbase.Subclass({
		type: "maligngroup",
		isSpacelike: function () { return true },
		defaults: {
			mathbackground: mml.INHERIT,
			mathcolor: mml.INHERIT,
			groupalign: mml.INHERIT
		},
		inheritFromMe: true,
		noInherit: {
			mrow: { groupalign: true },
			mtable: { groupalign: true }
		}
	});
	mml.malignmark = mml.mbase.Subclass({
		type: "malignmark",
		defaults: { mathbackground: mml.INHERIT, mathcolor: mml.INHERIT, edge: mml.SIDE.LEFT },
		isSpacelike: function () { return true }
	});
	mml.mlabeledtr = mml.mtr.Subclass({ type: "mlabeledtr" });
	mml.maction = mml.mbase.Subclass({
		type: "maction",
		defaults: { mathbackground: mml.INHERIT, mathcolor: mml.INHERIT, actiontype: mml.ACTIONTYPE.TOGGLE, selection: 1 },
		selected: function () { return this.data[this.Get("selection") - 1] || mml.NULL },
		isEmbellished: function () { return this.selected().isEmbellished() },
		isSpacelike: function () { return this.selected().isSpacelike() },
		Core: function () { return this.selected().Core() },
		CoreMO: function () { return this.selected().CoreMO() },
		setTeXclass: function (f) {
			if (this.Get("actiontype") === mml.ACTIONTYPE.TOOLTIP && this.data[1]) {
				this.data[1].setTeXclass();
			}
			var e = this.selected();
			f = e.setTeXclass(f);
			this.updateTeXclass(e);
			return f;
		}
	});
	mml.semantics = mml.mbase.Subclass({
		type: "semantics",
		notParent: true,
		isEmbellished: mml.mbase.childEmbellished,
		Core: mml.mbase.childCore,
		CoreMO: mml.mbase.childCoreMO,
		defaults: { definitionURL: null, encoding: null },
		setTeXclass: mml.mbase.setChildTeXclass,
		getAnnotation: function (g) {
			var l = MathJax.Hub.config.MathMenu.semanticsAnnotations[g];
			if (l) {
				for (var h = 0, e = this.data.length; h < e; h++) {
					var k = this.data[h].Get("encoding");
					if (k) {
						for (var f = 0, o = l.length; f < o; f++) {
							if (l[f] === k) {
								return this.data[h];
							}
						}
					}
				}
			}
			return null;
		}
	});
	mml.annotation = mml.mbase.Subclass({
		type: "annotation",
		isChars: true,
		linebreakContainer: true,
		defaults: { definitionURL: null, encoding: null, cd: "mathmlkeys", name: "", src: null }
	});

	mml["annotation-xml"] = mml.mbase.Subclass({
		type: "annotation-xml",
		linebreakContainer: true,
		defaults: { definitionURL: null, encoding: null, cd: "mathmlkeys", name: "", src: null }
	});

	mml.math = mml.mstyle.Subclass({
		type: "math",
		defaults: {
			mathvariant: mml.VARIANT.NORMAL,
			mathsize: mml.SIZE.NORMAL,
			mathcolor: "",
			mathbackground: mml.COLOR.TRANSPARENT,
			dir: "ltr",
			scriptlevel: 0,
			displaystyle: mml.AUTO,
			display: "inline",
			maxwidth: "",
			overflow: mml.OVERFLOW.LINEBREAK,
			altimg: "",
			"altimg-width": "",
			"altimg-height": "",
			"altimg-valign": "",
			alttext: "",
			cdgroup: "",
			scriptsizemultiplier: Math.sqrt(1 / 2),
			scriptminsize: "8px",
			infixlinebreakstyle: mml.LINEBREAKSTYLE.BEFORE,
			lineleading: "1ex",
			indentshift: "auto",
			indentalign: mml.INDENTALIGN.AUTO,
			indentalignfirst: mml.INDENTALIGN.INDENTALIGN,
			indentshiftfirst: mml.INDENTSHIFT.INDENTSHIFT,
			indentalignlast: mml.INDENTALIGN.INDENTALIGN,
			indentshiftlast: mml.INDENTSHIFT.INDENTSHIFT,
			decimalseparator: ".",
			texprimestyle: false
		},
		autoDefault: function (e) {
			if (e === "displaystyle") {
				return this.Get("display") === "block";
			}
			return "";
		},
		linebreakContainer: true,
		setTeXclass: mml.mbase.setChildTeXclass,
		getAnnotation: function (e) {
			if (this.data.length != 1) { return null }
			return this.data[0].getAnnotation(e);
		}
	});
	mml.chars = mml.mbase.Subclass({
		type: "chars",
		Append: function () { this.data.push.apply(this.data, arguments) },
		value: function () { return this.data.join("") },
		toString: function () { return this.data.join("") }
	});
	mml.entity = mml.mbase.Subclass({
		type: "entity",
		Append: function () {
			this.data.push.apply(this.data, arguments);
		},
		value: function () {
			if (this.data[0].substr(0, 2) === "#x") {
				return parseInt(this.data[0].substr(2), 16);
			} else {
				if (this.data[0].substr(0, 1) === "#") {
					return parseInt(this.data[0].substr(1));
				} else {
					return 0;
				}
			}
		},
		toString: function () {
			var e = this.value();
			if (e <= 65535) {
				return String.fromCharCode(e);
			}
			e -= 65536;
			return String.fromCharCode((e >> 10) + 55296) + String.fromCharCode((e & 1023) + 56320);
		}
	});
	mml.xml = mml.mbase.Subclass({
		type: "xml",
		Init: function () {
			this.div = document.createElement("div");
			return this.SUPER(arguments).Init.apply(this, arguments);
		},
		Append: function () {
			for (var f = 0, e = arguments.length; f < e; f++) {
				var g = this.Import(arguments[f]);
				this.data.push(g);
				this.div.appendChild(g);
			}
		},
		Import: function (j) {
			if (document.importNode) {
				return document.importNode(j, true);
			}
			var f, g, e;
			if (j.nodeType === 1) {
				f = document.createElement(j.nodeName);
				for (g = 0, e = j.attributes.length; g < e; g++) {
					var h = j.attributes[g];
					if (h.specified && h.nodeValue != null && h.nodeValue != "") {
						f.setAttribute(h.nodeName, h.nodeValue);
					}
					if (h.nodeName === "style") {
						f.style.cssText = h.nodeValue;
					}
				}
				if (j.className) {
					f.className = j.className;
				}
			} else {
				if (j.nodeType === 3 || j.nodeType === 4) {
					f = document.createTextNode(j.nodeValue);
				} else {
					if (j.nodeType === 8) {
						f = document.createComment(j.nodeValue);
					} else {
						return document.createTextNode("");
					}
				}
			}
			for (g = 0, e = j.childNodes.length; g < e; g++) {
				f.appendChild(this.Import(j.childNodes[g]));
			}
			return f;
		},
		value: function () { return this.div },
		toString: function () { return this.div.innerHTML }
	});
	mml.TeXAtom = mml.mbase.Subclass({
		type: "texatom",
		linebreakContainer: true,
		inferRow: true,
		notParent: true,
		texClass: mml.TEXCLASS.ORD,
		Core: mml.mbase.childCore,
		CoreMO: mml.mbase.childCoreMO,
		isEmbellished: mml.mbase.childEmbellished,
		setTeXclass: function (e) {
			this.data[0].setTeXclass();
			return this.adjustTeXclass(e);
		},
		adjustTeXclass: mml.mo.prototype.adjustTeXclass
	});
	mml.NULL = mml.mbase().With({ type: "null" });

	var b = mml.TEXCLASS;
	const d = {
		ORD: [0, 0, b.ORD],
		ORD11: [1, 1, b.ORD],
		ORD21: [2, 1, b.ORD],
		ORD02: [0, 2, b.ORD],
		ORD55: [5, 5, b.ORD],
		OP: [1, 2, b.OP, { largeop: true, movablelimits: true, symmetric: true }],
		OPFIXED: [1, 2, b.OP, { largeop: true, movablelimits: true }],
		INTEGRAL: [0, 1, b.OP, { largeop: true, symmetric: true }],
		INTEGRAL2: [1, 2, b.OP, { largeop: true, symmetric: true }],
		BIN3: [3, 3, b.BIN],
		BIN4: [4, 4, b.BIN],
		BIN01: [0, 1, b.BIN],
		BIN5: [5, 5, b.BIN],
		TALLBIN: [4, 4, b.BIN, { stretchy: true }],
		BINOP: [4, 4, b.BIN, { largeop: true, movablelimits: true }],
		REL: [5, 5, b.REL],
		REL1: [1, 1, b.REL, { stretchy: true }],
		REL4: [4, 4, b.REL],
		RELSTRETCH: [5, 5, b.REL, { stretchy: true }],
		RELACCENT: [5, 5, b.REL, { accent: true }],
		WIDEREL: [5, 5, b.REL, { accent: true, stretchy: true }],
		OPEN: [0, 0, b.OPEN, { fence: true, stretchy: true, symmetric: true }],
		CLOSE: [0, 0, b.CLOSE, { fence: true, stretchy: true, symmetric: true }],
		INNER: [0, 0, b.INNER],
		PUNCT: [0, 3, b.PUNCT],
		ACCENT: [0, 0, b.ORD, { accent: true }],
		WIDEACCENT: [0, 0, b.ORD, { accent: true, stretchy: true }]
	};
	mml.mo.Augment({
		SPACE: ["0em", "0.1111em", "0.1667em", "0.2222em", "0.2667em", "0.3333em"],
		RANGES: [
			[32, 127, b.REL, "BasicLatin"],
			[160, 255, b.ORD, "Latin1Supplement"],
			[256, 383, b.ORD],
			[384, 591, b.ORD],
			[688, 767, b.ORD, "SpacingModLetters"],
			[768, 879, b.ORD, "CombDiacritMarks"],
			[880, 1023, b.ORD, "GreekAndCoptic"],
			[7680, 7935, b.ORD],
			[8192, 8303, b.PUNCT, "GeneralPunctuation"],
			[8304, 8351, b.ORD],
			[8352, 8399, b.ORD],
			[8400, 8447, b.ORD, "CombDiactForSymbols"],
			[8448, 8527, b.ORD, "LetterlikeSymbols"],
			[8528, 8591, b.ORD],
			[8592, 8703, b.REL, "Arrows"],
			[8704, 8959, b.BIN, "MathOperators"],
			[8960, 9215, b.ORD, "MiscTechnical"],
			[9312, 9471, b.ORD],
			[9472, 9631, b.ORD],
			[9632, 9727, b.ORD, "GeometricShapes"],
			[9984, 10175, b.ORD, "Dingbats"],
			[10176, 10223, b.ORD, "MiscMathSymbolsA"],
			[10224, 10239, b.REL, "SupplementalArrowsA"],
			[10496, 10623, b.REL, "SupplementalArrowsB"],
			[10624, 10751, b.ORD, "MiscMathSymbolsB"],
			[10752, 11007, b.BIN, "SuppMathOperators"],
			[11008, 11263, b.ORD, "MiscSymbolsAndArrows"],
			[119808, 120831, b.ORD]
		],
		OPTABLE: {
			prefix: {
				"\u2200": d.ORD21,
				"\u2202": d.ORD21,
				"\u2203": d.ORD21,
				"\u2207": d.ORD21,
				"\u220F": d.OP,
				"\u2210": d.OP,
				"\u2211": d.OP,
				"\u2212": d.BIN01,
				"\u2213": d.BIN01,
				"\u221A": [1, 1, b.ORD, { stretchy: true }],
				"\u2220": d.ORD,
				"\u222B": d.INTEGRAL,
				"\u222E": d.INTEGRAL,
				"\u22C0": d.OP,
				"\u22C1": d.OP,
				"\u22C2": d.OP,
				"\u22C3": d.OP,
				"\u2308": d.OPEN,
				"\u230A": d.OPEN,
				"\u27E8": d.OPEN,
				"\u27EE": d.OPEN,
				"\u2A00": d.OP,
				"\u2A01": d.OP,
				"\u2A02": d.OP,
				"\u2A04": d.OP,
				"\u2A06": d.OP,
				"\u00AC": d.ORD21,
				"\u00B1": d.BIN01,
				"(": d.OPEN,
				"+": d.BIN01,
				"-": d.BIN01,
				"[": d.OPEN,
				"{": d.OPEN,
				"|": d.OPEN
			},
			postfix: { "!": [1, 0, b.CLOSE], "&": d.ORD, "\u2032": d.ORD02, "\u203E": d.WIDEACCENT, "\u2309": d.CLOSE, "\u230B": d.CLOSE, "\u23DE": d.WIDEACCENT, "\u23DF": d.WIDEACCENT, "\u266D": d.ORD02, "\u266E": d.ORD02, "\u266F": d.ORD02, "\u27E9": d.CLOSE, "\u27EF": d.CLOSE, "\u02C6": d.WIDEACCENT, "\u02C7": d.WIDEACCENT, "\u02C9": d.WIDEACCENT, "\u02CA": d.ACCENT, "\u02CB": d.ACCENT, "\u02D8": d.ACCENT, "\u02D9": d.ACCENT, "\u02DC": d.WIDEACCENT, "\u0302": d.WIDEACCENT, "\u00A8": d.ACCENT, "\u00AF": d.WIDEACCENT, ")": d.CLOSE, "]": d.CLOSE, "^": d.WIDEACCENT, _: d.WIDEACCENT, "`": d.ACCENT, "|": d.CLOSE, "}": d.CLOSE, "~": d.WIDEACCENT }, infix: { "": d.ORD, "%": [3, 3, b.ORD], "\u2022": d.BIN4, "\u2026": d.INNER, "\u2044": d.TALLBIN, "\u2061": d.ORD, "\u2062": d.ORD, "\u2063": [0, 0, b.ORD, { linebreakstyle: "after", separator: true }], "\u2064": d.ORD, "\u2190": d.WIDEREL, "\u2191": d.RELSTRETCH, "\u2192": d.WIDEREL, "\u2193": d.RELSTRETCH, "\u2194": d.WIDEREL, "\u2195": d.RELSTRETCH, "\u2196": d.RELSTRETCH, "\u2197": d.RELSTRETCH, "\u2198": d.RELSTRETCH, "\u2199": d.RELSTRETCH, "\u21A6": d.WIDEREL, "\u21A9": d.WIDEREL, "\u21AA": d.WIDEREL, "\u21BC": d.WIDEREL, "\u21BD": d.WIDEREL, "\u21C0": d.WIDEREL, "\u21C1": d.WIDEREL, "\u21CC": d.WIDEREL, "\u21D0": d.WIDEREL, "\u21D1": d.RELSTRETCH, "\u21D2": d.WIDEREL, "\u21D3": d.RELSTRETCH, "\u21D4": d.WIDEREL, "\u21D5": d.RELSTRETCH, "\u2208": d.REL, "\u2209": d.REL, "\u220B": d.REL, "\u2212": d.BIN4, "\u2213": d.BIN4, "\u2215": d.TALLBIN, "\u2216": d.BIN4, "\u2217": d.BIN4, "\u2218": d.BIN4, "\u2219": d.BIN4, "\u221D": d.REL, "\u2223": d.REL, "\u2225": d.REL, "\u2227": d.BIN4, "\u2228": d.BIN4, "\u2229": d.BIN4, "\u222A": d.BIN4, "\u223C": d.REL, "\u2240": d.BIN4, "\u2243": d.REL, "\u2245": d.REL, "\u2248": d.REL, "\u224D": d.REL, "\u2250": d.REL, "\u2260": d.REL, "\u2261": d.REL, "\u2264": d.REL, "\u2265": d.REL, "\u226A": d.REL, "\u226B": d.REL, "\u227A": d.REL, "\u227B": d.REL, "\u2282": d.REL, "\u2283": d.REL, "\u2286": d.REL, "\u2287": d.REL, "\u228E": d.BIN4, "\u2291": d.REL, "\u2292": d.REL, "\u2293": d.BIN4, "\u2294": d.BIN4, "\u2295": d.BIN4, "\u2296": d.BIN4, "\u2297": d.BIN4, "\u2298": d.BIN4, "\u2299": d.BIN4, "\u22A2": d.REL, "\u22A3": d.REL, "\u22A4": d.ORD55, "\u22A5": d.REL, "\u22A8": d.REL, "\u22C4": d.BIN4, "\u22C5": d.BIN4, "\u22C6": d.BIN4, "\u22C8": d.REL, "\u22EE": d.ORD55, "\u22EF": d.INNER, "\u22F1": [5, 5, b.INNER], "\u25B3": d.BIN4, "\u25B5": d.BIN4, "\u25B9": d.BIN4, "\u25BD": d.BIN4, "\u25BF": d.BIN4, "\u25C3": d.BIN4, "\u2758": d.REL, "\u27F5": d.WIDEREL, "\u27F6": d.WIDEREL, "\u27F7": d.WIDEREL, "\u27F8": d.WIDEREL, "\u27F9": d.WIDEREL, "\u27FA": d.WIDEREL, "\u27FC": d.WIDEREL, "\u2A2F": d.BIN4, "\u2A3F": d.BIN4, "\u2AAF": d.REL, "\u2AB0": d.REL, "\u00B1": d.BIN4, "\u00B7": d.BIN4, "\u00D7": d.BIN4, "\u00F7": d.BIN4, "*": d.BIN3, "+": d.BIN4, ",": [0, 3, b.PUNCT, { linebreakstyle: "after", separator: true }], "-": d.BIN4, ".": [3, 3, b.ORD], "/": d.ORD11, ":": [1, 2, b.REL], ";": [0, 3, b.PUNCT, { linebreakstyle: "after", separator: true }], "<": d.REL, "=": d.REL, ">": d.REL, "?": [1, 1, b.CLOSE], "\\": d.ORD, "^": d.ORD11, _: d.ORD11, "|": [2, 2, b.ORD, { fence: true, stretchy: true, symmetric: true }], "#": d.ORD, "$": d.ORD, "\u002E": [0, 3, b.PUNCT, { separator: true }], "\u02B9": d.ORD, "\u0300": d.ACCENT, "\u0301": d.ACCENT, "\u0303": d.WIDEACCENT, "\u0304": d.ACCENT, "\u0306": d.ACCENT, "\u0307": d.ACCENT, "\u0308": d.ACCENT, "\u030C": d.ACCENT, "\u0332": d.WIDEACCENT, "\u0338": d.REL4, "\u2015": [0, 0, b.ORD, { stretchy: true }], "\u2017": [0, 0, b.ORD, { stretchy: true }], "\u2020": d.BIN3, "\u2021": d.BIN3, "\u20D7": d.ACCENT, "\u2111": d.ORD, "\u2113": d.ORD, "\u2118": d.ORD, "\u211C": d.ORD, "\u2205": d.ORD, "\u221E": d.ORD, "\u2305": d.BIN3, "\u2306": d.BIN3, "\u2322": d.REL4, "\u2323": d.REL4, "\u2329": d.OPEN, "\u232A": d.CLOSE, "\u23AA": d.ORD, "\u23AF": [0, 0, b.ORD, { stretchy: true }], "\u23B0": d.OPEN, "\u23B1": d.CLOSE, "\u2500": d.ORD, "\u25EF": d.BIN3, "\u2660": d.ORD, "\u2661": d.ORD, "\u2662": d.ORD, "\u2663": d.ORD, "\u3008": d.OPEN, "\u3009": d.CLOSE, "\uFE37": d.WIDEACCENT, "\uFE38": d.WIDEACCENT }
		}
	}, {
		OPTYPES: d
	});

	var c = mml.mo.prototype.OPTABLE;
	c.infix["^"] = d.WIDEREL;
	c.infix._ = d.WIDEREL;
	c.prefix["\u2223"] = d.OPEN;
	c.prefix["\u2225"] = d.OPEN;
	c.postfix["\u2223"] = d.CLOSE;
	c.postfix["\u2225"] = d.CLOSE;

	MathJax.ElementJax.mml.loadComplete("jax.js");
}
