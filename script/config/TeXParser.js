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

function TEX_PARSER(tex, hub, ajax) {
	const h = "\u00A0";
	var mml;
	var isArray = MathJax.Object.isArray;

	var texBase = {
		type: "base",
		endError: ["ExtraOpenMissingClose", "Extra open brace or missing close brace"],
		closeError: ["ExtraCloseMissingOpen", "Extra close brace or missing open brace"],
		rightError: ["MissingLeftExtraRight", "Missing \\left or extra \\right"],
		Init: function () {
			if (this.isOpen) {
				this.env = {};
			}
			this.data = [];
			this.Push.apply(this, arguments);
		},
		Push: function () {
			this.data.push.apply(this.data, arguments);
			if (0 < this.data.length) {
				let a = 1;
			}
		},
		Pop: function () {
			return this.data.pop();
		},
		mmlData: function (m, n) {
			if (m == null) { m = true }
			if (this.data.length === 1 && !n) {
				return this.data[0];
			}
			return mml.mrow.apply(mml, this.data).With((m ? { inferred: true } : {}));
		},
		checkItem: function (m) {
			if (m.type === "over" && this.isOpen) {
				m.num = this.mmlData(false);
				this.data = [];
			}
			if (m.type === "cell" && this.isOpen) {
				if (m.linebreak) { return false }
				tex.Error(["Misplaced", "Misplaced %1", m.name]);
			}
			if (m.isClose && this[m.type + "Error"]) {
				tex.Error(this[m.type + "Error"]);
			}
			if (!m.isNotStack) { return true }
			this.Push(m.data[0]);
			return false;
		},
		With: function (m) {
			for (var n in m) {
				if (m.hasOwnProperty(n)) { this[n] = m[n] }
			}
			return this;
		},
		toString: function () {
			return this.type + "[" + this.data.join("; ") + "]";
		}
	};
	var texStack = MathJax.Object.Subclass({
		Init: function (n, m) {
			this.global = { isInner: m };
			this.data = [
				base.start(this.global)
			];
			if (n) { this.data[0].env = n }
			this.env = this.data[0].env;
		},
		Push: function () {
			var o, n, p, q;
			for (o = 0, n = arguments.length; o < n; o++) {
				p = arguments[o];
				if (!p) { continue }
				if (p instanceof mml.mbase) {
					p = base.mml(p);
				}
				p.global = this.global;
				q = (this.data.length ? this.Top().checkItem(p) : true);
				if (q instanceof Array) {
					this.Pop();
					this.Push.apply(this, q);
				} else {
					if (q instanceof base) {
						this.Pop();
						this.Push(q);
					} else {
						if (q) {
							this.data.push(p);
							if (p.env) {
								if (p.copyEnv !== false) {
									for (var r in this.env) {
										if (this.env.hasOwnProperty(r)) {
											p.env[r] = this.env[r];
										}
									}
								}
								this.env = p.env;
							} else {
								p.env = this.env;
							}
						}
					}
				}
			}
		},
		Pop: function () {
			var m = this.data.pop();
			if (!m.isOpen) { delete m.env }
			this.env = (this.data.length ? this.Top().env : {});
			return m
		},
		Top: function (m) {
			if (m == null) { m = 1 }
			if (this.data.length < m) { return null }
			return this.data[this.data.length - m];
		},
		Prev: function (m) {
			var n = this.Top();
			if (m) {
				return n.data[n.data.length - 1];
			} else {
				return n.Pop();
			}
		},
		toString: function () {
			return "stack[\n  " + this.data.join("\n  ") + "\n]"
		}
	});
	var base = texStack.Item = MathJax.Object.Subclass(texBase);
	base.start = base.Subclass({
		type: "start",
		isOpen: true,
		Init: function (m) {
			this.SUPER(arguments).Init.call(this);
			this.global = m;
		},
		checkItem: function (m) {
			if (m.type === "stop") {
				return base.mml(this.mmlData());
			}
			return this.SUPER(arguments).checkItem.call(this, m);
		}
	});
	base.stop = base.Subclass({
		type: "stop",
		isClose: true
	});
	base.open = base.Subclass({
		type: "open",
		isOpen: true,
		stopError: ["ExtraOpenMissingClose", "Extra open brace or missing close brace"],
		checkItem: function (n) {
			if (n.type === "close") {
				var m = this.mmlData();
				return base.mml(mml.TeXAtom(m));
			}
			return this.SUPER(arguments).checkItem.call(this, n);
		}
	});
	base.close = base.Subclass({
		type: "close",
		isClose: true
	});
	base.prime = base.Subclass({
		type: "prime",
		checkItem: function (m) {
			if (this.data[0].type !== "msubsup") {
				return [mml.msup(this.data[0], this.data[1]), m];
			}
			this.data[0].SetData(this.data[0].sup, this.data[1]);
			return [this.data[0], m];
		}
	});
	base.subsup = base.Subclass({
		type: "subsup",
		stopError: ["MissingScript", "Missing superscript or subscript argument"],
		supError: ["MissingOpenForSup", "Missing open brace for superscript"],
		subError: ["MissingOpenForSub", "Missing open brace for subscript"],
		checkItem: function (m) {
			if (m.type === "open" || m.type === "left") { return true }
			if (m.type === "mml") {
				if (this.primes) {
					if (this.position !== 2) {
						this.data[0].SetData(2, this.primes);
					} else {
						m.data[0] = mml.mrow(this.primes.With({ variantForm: true }), m.data[0]);
					}
				}
				this.data[0].SetData(this.position, m.data[0]);
				if (this.movesupsub != null) {
					this.data[0].movesupsub = this.movesupsub;
				}
				return base.mml(this.data[0]);
			}
			if (this.SUPER(arguments).checkItem.call(this, m)) {
				tex.Error(this[["", "subError", "supError"][this.position]]);
			}
		},
		Pop: function () { }
	});
	base.over = base.Subclass({
		type: "over",
		isClose: true,
		name: "\\over",
		checkItem: function (o, _m) {
			if (o.type === "over") {
				tex.Error(["AmbiguousUseOf", "Ambiguous use of %1", o.name]);
			}
			if (o.isClose) {
				var n = mml.mfrac(this.num, this.mmlData(false));
				if (this.thickness != null) {
					n.linethickness = this.thickness;
				}
				if (this.open || this.close) {
					n.texWithDelims = true;
					n = tex.fixedFence(this.open, n, this.close);
				}
				return [base.mml(n), o];
			}
			return this.SUPER(arguments).checkItem.call(this, o);
		},
		toString: function () {
			return "over[" + this.num + " / " + this.data.join("; ") + "]";
		}
	});
	base.left = base.Subclass({
		type: "left",
		isOpen: true,
		delim: "(",
		stopError: ["ExtraLeftMissingRight", "Extra \\left or missing \\right"],
		checkItem: function (m) {
			if (m.type === "right") {
				return base.mml(tex.fenced(this.delim, this.mmlData(), m.delim));
			}
			return this.SUPER(arguments).checkItem.call(this, m);
		}
	});
	base.right = base.Subclass({
		type: "right",
		isClose: true,
		delim: ")"
	});
	base.begin = base.Subclass({
		type: "begin",
		isOpen: true,
		checkItem: function (m) {
			if (m.type === "end") {
				if (m.name !== this.name) {
					tex.Error(["EnvBadEnd", "\\begin{%1} ended with \\end{%2}", this.name, m.name]);
				}
				if (!this.end) {
					return base.mml(this.mmlData());
				}
				return this.parse[this.end].call(this.parse, this, this.data);
			}
			if (m.type === "stop") {
				tex.Error(["EnvMissingEnd", "Missing \\end{%1}", this.name]);
			}
			return this.SUPER(arguments).checkItem.call(this, m);
		}
	});
	base.end = base.Subclass({
		type: "end",
		isClose: true
	});
	base.style = base.Subclass({
		type: "style",
		checkItem: function (n) {
			if (!n.isClose) {
				return this.SUPER(arguments).checkItem.call(this, n);
			}
			var m = mml.mstyle.apply(mml, this.data).With(this.styles);
			return [base.mml(m), n];
		}
	});
	base.position = base.Subclass({
		type: "position",
		checkItem: function (n) {
			if (n.isClose) {
				tex.Error(["MissingBoxFor", "Missing box for %1", this.name]);
			}
			if (n.isNotStack) {
				var m = n.mmlData();
				switch (this.move) {
					case "vertical":
						m = mml.mpadded(m).With({
							height: this.dh,
							depth: this.dd,
							voffset: this.dh
						});
						return [base.mml(m)];
					case "horizontal":
						return [base.mml(this.left), n, base.mml(this.right)];
				}
			}
			return this.SUPER(arguments).checkItem.call(this, n);
		}
	});
	base.array = base.Subclass({
		type: "array",
		isOpen: true,
		copyEnv: false,
		arraydef: {},
		Init: function () {
			this.table = [];
			this.row = [];
			this.frame = [];
			this.hfill = [];
			this.SUPER(arguments).Init.apply(this, arguments);
		},
		checkItem: function (n) {
			if (n.isClose && n.type !== "over") {
				if (n.isEntry) {
					this.EndEntry();
					this.clearEnv();
					return false;
				}
				if (n.isCR) {
					this.EndEntry();
					this.EndRow();
					this.clearEnv();
					return false;
				}
				this.EndTable();
				this.clearEnv();
				var o = this.arraydef.scriptlevel;
				delete this.arraydef.scriptlevel;
				var m = mml.mtable.apply(mml, this.table).With(this.arraydef);
				if (this.frame.length === 4) {
					m.frame = (this.frame.dashed ? "dashed" : "solid");
				} else {
					if (this.frame.length) {
						m.hasFrame = true;
						if (this.arraydef.rowlines) {
							this.arraydef.rowlines = this.arraydef.rowlines.replace(/none( none)+$/, "none");
						}
						m = mml.menclose(m).With({ notation: this.frame.join(" "), isFrame: true });
						if ((this.arraydef.columnlines || "none") != "none" || (this.arraydef.rowlines || "none") != "none") {
							m.padding = 0;
						}
					}
				}
				if (o) {
					m = mml.mstyle(m).With({ scriptlevel: o });
				}
				if (this.open || this.close) {
					m = tex.fenced(this.open, m, this.close);
				}
				m = base.mml(m);
				if (this.requireClose) {
					if (n.type === "close") { return m }
					tex.Error(["MissingCloseBrace", "Missing close brace"]);
				}
				return [m, n];
			}
			return this.SUPER(arguments).checkItem.call(this, n);
		},
		EndEntry: function () {
			var m = mml.mtd.apply(mml, this.data);
			if (this.hfill.length) {
				if (this.hfill[0] === 0) {
					m.columnalign = "right";
				}
				if (this.hfill[this.hfill.length - 1] === this.data.length) {
					m.columnalign = (m.columnalign ? "center" : "left");
				}
			}
			this.row.push(m);
			this.data = [];
			this.hfill = [];
		},
		EndRow: function () {
			var m = mml.mtr;
			if (this.isNumbered && this.row.length === 3) {
				this.row.unshift(this.row.pop());
				m = mml.mlabeledtr;
			}
			this.table.push(m.apply(mml, this.row));
			this.row = [];
		},
		EndTable: function () {
			if (this.data.length || this.row.length) {
				this.EndEntry(); this.EndRow();
			}
			this.checkLines();
		},
		checkLines: function () {
			if (this.arraydef.rowlines) {
				var m = this.arraydef.rowlines.split(/ /);
				if (m.length === this.table.length) {
					this.frame.push("bottom");
					m.pop();
					this.arraydef.rowlines = m.join(" ");
				} else {
					if (m.length < this.table.length - 1) {
						this.arraydef.rowlines += " none";
					}
				}
			}
			if (this.rowspacing) {
				var n = this.arraydef.rowspacing.split(/ /);
				while (n.length < this.table.length) {
					n.push(this.rowspacing + "em");
				}
				this.arraydef.rowspacing = n.join(" ");
			}
		},
		clearEnv: function () {
			for (var m in this.env) {
				if (this.env.hasOwnProperty(m)) {
					delete this.env[m];
				}
			}
		}
	});
	base.cell = base.Subclass({
		type: "cell",
		isClose: true
	});
	base.mml = base.Subclass({
		type: "mml",
		isNotStack: true,
		Add: function () {
			this.data.push.apply(this.data, arguments);
			return this;
		}
	});
	base.fn = base.Subclass({
		type: "fn",
		checkItem: function (n) {
			if (this.data[0]) {
				if (n.isOpen) { return true }
				if (n.type !== "fn") {
					if (n.type !== "mml" || !n.data[0]) {
						return [this.data[0], n];
					}
					if (n.data[0].isa(mml.mspace)) {
						return [this.data[0], n];
					}
					var m = n.data[0];
					if (m.isEmbellished()) {
						m = m.CoreMO();
					}
					if ([0, 0, 1, 1, 0, 1, 1, 0, 0, 0][m.Get("texClass")]) {
						return [this.data[0], n];
					}
				}
				return [
					this.data[0],
					mml.mo(mml.entity("#x2061")).With({ texClass: mml.TEXCLASS.NONE }),
					n
				];
			}
			return this.SUPER(arguments).checkItem.apply(this, arguments);
		}
	});
	base.not = base.Subclass({
		type: "not",
		checkItem: function (n) {
			var m, o; if (n.type === "open" || n.type === "left") { return true }
			if (n.type === "mml" && n.data[0].type.match(/^(mo|mi|mtext)$/)) {
				m = n.data[0], o = m.data.join("");
				if (o.length === 1 && !m.movesupsub) {
					o = base.not.remap[o.charCodeAt(0)];
					if (o) {
						m.SetData(0, mml.chars(String.fromCharCode(o)));
					} else {
						m.Append(mml.chars("\u0338"));
					}
					return n;
				}
			}
			m = mml.mpadded(mml.mtext("\u29F8")).With({ width: 0 });
			m = mml.TeXAtom(m).With({ texClass: mml.TEXCLASS.REL });
			return [m, n];
		}
	});
	base.not.remap = {
		8592: 8602,
		8594: 8603,
		8596: 8622,
		8656: 8653,
		8658: 8655,
		8660: 8654,
		8712: 8713,
		8715: 8716,
		8739: 8740,
		8741: 8742,
		8764: 8769,
		126: 8769,
		8771: 8772,
		8773: 8775,
		8776: 8777,
		8781: 8813,
		61: 8800,
		8801: 8802,
		60: 8814,
		62: 8815,
		8804: 8816,
		8805: 8817,
		8818: 8820,
		8819: 8821,
		8822: 8824,
		8823: 8825,
		8826: 8832,
		8827: 8833,
		8834: 8836,
		8835: 8837,
		8838: 8840,
		8839: 8841,
		8866: 8876,
		8872: 8877,
		8873: 8878,
		8875: 8879,
		8828: 8928,
		8829: 8929,
		8849: 8930,
		8850: 8931,
		8882: 8938,
		8883: 8939,
		8884: 8940,
		8885: 8941,
		8707: 8708
	};
	base.dots = base.Subclass({
		type: "dots",
		checkItem: function (n) {
			if (n.type === "open" || n.type === "left") { return true }
			var o = this.ldots;
			if (n.type === "mml" && n.data[0].isEmbellished()) {
				var m = n.data[0].CoreMO().Get("texClass");
				if (m === mml.TEXCLASS.BIN || m === mml.TEXCLASS.REL) { o = this.cdots }
			}
			return [o, n];
		}
	});

	var k = function (m) {
		return MathJax.Localization._.apply(MathJax.Localization, [["TeX", m]].concat([].slice.call(arguments, 1)));
	};
	var g = {
		Add: function (m, p, o) {
			if (!p) { p = this }
			for (var n in m) {
				if (m.hasOwnProperty(n)) {
					if (typeof m[n] === "object" && !isArray(m[n]) && (typeof p[n] === "object" || typeof p[n] === "function")) {
						this.Add(m[n], p[n], m[n], o);
					} else {
						if (!p[n] || !p[n].isUser || !o) { p[n] = m[n] }
					}
				}
			}
			return p;
		}
	};
	function parseList() {
		return {
			letter: /[a-z]/i,
			digit: /[0-9.]/,
			number: /^(?:[0-9]+(?:\{,\}[0-9]{3})*(?:\.[0-9]*)*|\.[0-9]+)/,
			special: {
				"\\": "ControlSequence",
				"{": "Open", "}": "Close",
				"~": "Tilde",
				"^": "Superscript",
				_: "Subscript",
				" ": "Space",
				"\t": "Space",
				"\r": "Space",
				"\n": "Space",
				"'": "Prime",
				"%": "Comment",
				"&": "Entry",
				"#": "Hash",
				"\u00A0": "Space",
				"\u2019": "Prime"
			},
			remap: { "-": "2212", "*": "2217", "`": "2018" },
			mathchar0mi: {
				alpha: "03B1",
				beta: "03B2",
				gamma: "03B3",
				delta: "03B4",
				epsilon: "03F5",
				zeta: "03B6",
				eta: "03B7",
				theta: "03B8",
				iota: "03B9",
				kappa: "03BA",
				lambda: "03BB",
				mu: "03BC",
				nu: "03BD",
				xi: "03BE",
				omicron: "03BF",
				pi: "03C0",
				rho: "03C1",
				sigma: "03C3",
				tau: "03C4",
				upsilon: "03C5",
				phi: "03D5",
				chi: "03C7",
				psi: "03C8",
				omega: "03C9",
				varepsilon: "03B5",
				vartheta: "03D1",
				varpi: "03D6",
				varrho: "03F1",
				varsigma: "03C2",
				varphi: "03C6",
				S: ["00A7", { mathvariant: mml.VARIANT.NORMAL }],
				aleph: ["2135", { mathvariant: mml.VARIANT.NORMAL }],
				hbar: ["210F", { variantForm: true }],
				imath: "0131",
				jmath: "0237",
				ell: "2113",
				wp: ["2118", { mathvariant: mml.VARIANT.NORMAL }],
				Re: ["211C", { mathvariant: mml.VARIANT.NORMAL }],
				Im: ["2111", { mathvariant: mml.VARIANT.NORMAL }],
				partial: ["2202", { mathvariant: mml.VARIANT.NORMAL }],
				infty: ["221E", { mathvariant: mml.VARIANT.NORMAL }],
				prime: ["2032", { mathvariant: mml.VARIANT.NORMAL, variantForm: true }],
				emptyset: ["2205", { mathvariant: mml.VARIANT.NORMAL }],
				nabla: ["2207", { mathvariant: mml.VARIANT.NORMAL }],
				top: ["22A4", { mathvariant: mml.VARIANT.NORMAL }],
				bot: ["22A5", { mathvariant: mml.VARIANT.NORMAL }],
				angle: ["2220", { mathvariant: mml.VARIANT.NORMAL }],
				triangle: ["25B3", { mathvariant: mml.VARIANT.NORMAL }],
				backslash: ["2216", { mathvariant: mml.VARIANT.NORMAL, variantForm: true }],
				forall: ["2200", { mathvariant: mml.VARIANT.NORMAL }],
				exists: ["2203", { mathvariant: mml.VARIANT.NORMAL }],
				neg: ["00AC", { mathvariant: mml.VARIANT.NORMAL }],
				lnot: ["00AC", { mathvariant: mml.VARIANT.NORMAL }],
				flat: ["266D", { mathvariant: mml.VARIANT.NORMAL }],
				natural: ["266E", { mathvariant: mml.VARIANT.NORMAL }],
				sharp: ["266F", { mathvariant: mml.VARIANT.NORMAL }],
				clubsuit: ["2663", { mathvariant: mml.VARIANT.NORMAL }],
				diamondsuit: ["2662", { mathvariant: mml.VARIANT.NORMAL }],
				heartsuit: ["2661", { mathvariant: mml.VARIANT.NORMAL }],
				spadesuit: ["2660", { mathvariant: mml.VARIANT.NORMAL }]
			},
			mathchar0mo: {
				surd: "221A", coprod: ["2210", { texClass: mml.TEXCLASS.OP, movesupsub: true }],
				bigvee: ["22C1", { texClass: mml.TEXCLASS.OP, movesupsub: true }],
				bigwedge: ["22C0", { texClass: mml.TEXCLASS.OP, movesupsub: true }],
				biguplus: ["2A04", { texClass: mml.TEXCLASS.OP, movesupsub: true }],
				bigcap: ["22C2", { texClass: mml.TEXCLASS.OP, movesupsub: true }],
				bigcup: ["22C3", { texClass: mml.TEXCLASS.OP, movesupsub: true }],
				"int": ["222B", { texClass: mml.TEXCLASS.OP }],
				intop: ["222B", { texClass: mml.TEXCLASS.OP, movesupsub: true, movablelimits: true }],
				iint: ["222C", { texClass: mml.TEXCLASS.OP }],
				iiint: ["222D", { texClass: mml.TEXCLASS.OP }],
				prod: ["220F", { texClass: mml.TEXCLASS.OP, movesupsub: true }],
				sum: ["2211", { texClass: mml.TEXCLASS.OP, movesupsub: true }],
				bigotimes: ["2A02", { texClass: mml.TEXCLASS.OP, movesupsub: true }],
				bigoplus: ["2A01", { texClass: mml.TEXCLASS.OP, movesupsub: true }],
				bigodot: ["2A00", { texClass: mml.TEXCLASS.OP, movesupsub: true }],
				oint: ["222E", { texClass: mml.TEXCLASS.OP }],
				bigsqcup: ["2A06", { texClass: mml.TEXCLASS.OP, movesupsub: true }],
				smallint: ["222B", { largeop: false }],
				triangleleft: "25C3",
				triangleright: "25B9",
				bigtriangleup: "25B3",
				bigtriangledown: "25BD",
				wedge: "2227",
				land: "2227",
				vee: "2228",
				lor: "2228",
				cap: "2229",
				cup: "222A",
				ddagger: "2021",
				dagger: "2020",
				sqcap: "2293",
				sqcup: "2294",
				uplus: "228E",
				amalg: "2A3F",
				diamond: "22C4",
				bullet: "2219",
				wr: "2240",
				div: "00F7",
				odot: ["2299", { largeop: false }],
				oslash: ["2298", { largeop: false }],
				otimes: ["2297", { largeop: false }],
				ominus: ["2296", { largeop: false }],
				oplus: ["2295", { largeop: false }],
				mp: "2213",
				pm: "00B1",
				circ: "2218",
				bigcirc: "25EF",
				setminus: ["2216", { variantForm: true }],
				cdot: "22C5",
				ast: "2217",
				times: "00D7",
				star: "22C6",
				propto: "221D",
				sqsubseteq: "2291",
				sqsupseteq: "2292",
				parallel: "2225",
				mid: "2223",
				dashv: "22A3",
				vdash: "22A2",
				leq: "2264",
				le: "2264",
				geq: "2265",
				ge: "2265",
				lt: "003C",
				gt: "003E",
				succ: "227B",
				prec: "227A",
				approx: "2248",
				succeq: "2AB0",
				preceq: "2AAF",
				supset: "2283",
				subset: "2282",
				supseteq: "2287",
				subseteq: "2286",
				"in": "2208",
				ni: "220B",
				notin: "2209",
				owns: "220B",
				gg: "226B",
				ll: "226A",
				sim: "223C",
				simeq: "2243",
				perp: "22A5",
				equiv: "2261",
				asymp: "224D",
				smile: "2323",
				frown: "2322",
				ne: "2260",
				neq: "2260",
				cong: "2245",
				doteq: "2250",
				bowtie: "22C8",
				models: "22A8",
				notChar: "29F8",
				Leftrightarrow: "21D4",
				Leftarrow: "21D0",
				Rightarrow: "21D2",
				leftrightarrow: "2194",
				leftarrow: "2190",
				gets: "2190",
				rightarrow: "2192",
				to: "2192",
				mapsto: "21A6",
				leftharpoonup: "21BC",
				leftharpoondown: "21BD",
				rightharpoonup: "21C0",
				rightharpoondown: "21C1",
				nearrow: "2197",
				searrow: "2198",
				nwarrow: "2196",
				swarrow: "2199",
				rightleftharpoons: "21CC",
				hookrightarrow: "21AA",
				hookleftarrow: "21A9",
				longleftarrow: "27F5",
				Longleftarrow: "27F8",
				longrightarrow: "27F6",
				Longrightarrow: "27F9",
				Longleftrightarrow: "27FA",
				longleftrightarrow: "27F7",
				longmapsto: "27FC",
				ldots: "2026",
				cdots: "22EF",
				vdots: "22EE",
				ddots: "22F1",
				dotsc: "2026",
				dotsb: "22EF",
				dotsm: "22EF",
				dotsi: "22EF",
				dotso: "2026",
				ldotp: ["002E", { texClass: mml.TEXCLASS.PUNCT }],
				cdotp: ["22C5", { texClass: mml.TEXCLASS.PUNCT }],
				colon: ["003A", { texClass: mml.TEXCLASS.PUNCT }]
			},
			mathchar7: {
				Gamma: "0393",
				Delta: "0394",
				Theta: "0398",
				Lambda: "039B",
				Xi: "039E",
				Pi: "03A0",
				Sigma: "03A3",
				Upsilon: "03A5",
				Phi: "03A6",
				Psi: "03A8",
				Omega: "03A9",
				_: "005F",
				"#": "0023",
				"$": "0024",
				"%": "0025",
				"&": "0026",
				And: "0026"
			},
			delimiter: {
				"(": "(",
				")": ")",
				"[": "[",
				"]": "]",
				"<": "27E8",
				">": "27E9",
				"\\lt": "27E8",
				"\\gt": "27E9",
				"/": "/",
				"|": ["|", { texClass: mml.TEXCLASS.ORD }],
				".": "",
				"\\\\": "\\",
				"\\lmoustache": "23B0",
				"\\rmoustache": "23B1",
				"\\lgroup": "27EE",
				"\\rgroup": "27EF",
				"\\arrowvert": "23D0",
				"\\Arrowvert": "2016",
				"\\bracevert": "23AA",
				"\\Vert": ["2016", { texClass: mml.TEXCLASS.ORD }],
				"\\|": ["2016", { texClass: mml.TEXCLASS.ORD }],
				"\\vert": ["|", { texClass: mml.TEXCLASS.ORD }],
				"\\uparrow": "2191",
				"\\downarrow": "2193",
				"\\updownarrow": "2195",
				"\\Uparrow": "21D1",
				"\\Downarrow": "21D3",
				"\\Updownarrow": "21D5",
				"\\backslash": "\\",
				"\\rangle": "27E9",
				"\\langle": "27E8",
				"\\rbrace": "}",
				"\\lbrace": "{",
				"\\}": "}",
				"\\{": "{",
				"\\rceil": "2309",
				"\\lceil": "2308",
				"\\rfloor": "230B",
				"\\lfloor": "230A",
				"\\lbrack": "[",
				"\\rbrack": "]"
			},
			macros: {
				displaystyle: ["SetStyle", "D", true, 0],
				textstyle: ["SetStyle", "T", false, 0],
				scriptstyle: ["SetStyle", "S", false, 1],
				scriptscriptstyle: ["SetStyle", "SS", false, 2],
				rm: ["SetFont", mml.VARIANT.NORMAL],
				mit: ["SetFont", mml.VARIANT.ITALIC],
				oldstyle: ["SetFont", mml.VARIANT.OLDSTYLE],
				cal: ["SetFont", mml.VARIANT.CALIGRAPHIC],
				it: ["SetFont", "-tex-mathit"],
				bf: ["SetFont", mml.VARIANT.BOLD],
				bbFont: ["SetFont", mml.VARIANT.DOUBLESTRUCK],
				scr: ["SetFont", mml.VARIANT.SCRIPT],
				frak: ["SetFont", mml.VARIANT.FRAKTUR],
				sf: ["SetFont", mml.VARIANT.SANSSERIF],
				tt: ["SetFont", mml.VARIANT.MONOSPACE],
				tiny: ["SetSize", 0.5],
				Tiny: ["SetSize", 0.6],
				scriptsize: ["SetSize", 0.7],
				small: ["SetSize", 0.85],
				normalsize: ["SetSize", 1],
				large: ["SetSize", 1.2],
				Large: ["SetSize", 1.44],
				LARGE: ["SetSize", 1.73],
				huge: ["SetSize", 2.07],
				Huge: ["SetSize", 2.49],
				arcsin: ["NamedFn"],
				arccos: ["NamedFn"],
				arctan: ["NamedFn"],
				arg: ["NamedFn"],
				cos: ["NamedFn"],
				cosh: ["NamedFn"],
				cot: ["NamedFn"],
				coth: ["NamedFn"],
				csc: ["NamedFn"],
				deg: ["NamedFn"],
				det: "NamedOp",
				dim: ["NamedFn"],
				exp: ["NamedFn"],
				gcd: "NamedOp",
				hom: ["NamedFn"],
				inf: "NamedOp",
				ker: ["NamedFn"],
				lg: ["NamedFn"],
				lim: "NamedOp",
				liminf: ["NamedOp", "lim&thinsp;inf"],
				limsup: ["NamedOp", "lim&thinsp;sup"],
				ln: ["NamedFn"],
				log: ["NamedFn"],
				max: "NamedOp",
				min: "NamedOp",
				Pr: "NamedOp",
				sec: ["NamedFn"],
				sin: ["NamedFn"],
				sinh: ["NamedFn"],
				sup: "NamedOp",
				tan: ["NamedFn"],
				tanh: ["NamedFn"],
				limits: ["Limits", 1],
				nolimits: ["Limits", 0],
				overline: ["UnderOver", "00AF", null, 1],
				underline: ["UnderOver", "005F"],
				overbrace: ["UnderOver", "23DE", 1],
				underbrace: ["UnderOver", "23DF", 1],
				overparen: ["UnderOver", "23DC"],
				underparen: ["UnderOver", "23DD"],
				overrightarrow: ["UnderOver", "2192"],
				underrightarrow: ["UnderOver", "2192"],
				overleftarrow: ["UnderOver", "2190"],
				underleftarrow: ["UnderOver", "2190"],
				overleftrightarrow: ["UnderOver", "2194"],
				underleftrightarrow: ["UnderOver", "2194"],
				overset: "Overset",
				underset: "Underset",
				stackrel: ["Macro", "\\mathrel{\\mathop{#2}\\limits^{#1}}", 2],
				over: "Over",
				overwithdelims: "Over",
				atop: "Over",
				atopwithdelims: "Over",
				above: "Over",
				abovewithdelims: "Over",
				brace: ["Over", "{", "}"],
				brack: ["Over", "[", "]"],
				choose: ["Over", "(", ")"],
				frac: "Frac",
				sqrt: "Sqrt",
				root: "Root",
				uproot: ["MoveRoot", "upRoot"],
				leftroot: ["MoveRoot", "leftRoot"],
				left: "LeftRight",
				right: "LeftRight",
				middle: "Middle",
				llap: "Lap",
				rlap: "Lap",
				raise: "RaiseLower",
				lower: "RaiseLower",
				moveleft: "MoveLeftRight",
				moveright: "MoveLeftRight",
				",": ["Spacer", mml.LENGTH.THINMATHSPACE],
				":": ["Spacer", mml.LENGTH.MEDIUMMATHSPACE],
				">": ["Spacer", mml.LENGTH.MEDIUMMATHSPACE],
				";": ["Spacer", mml.LENGTH.THICKMATHSPACE],
				"!": ["Spacer", mml.LENGTH.NEGATIVETHINMATHSPACE],
				enspace: ["Spacer", ".5em"],
				quad: ["Spacer", "1em"],
				qquad: ["Spacer", "2em"],
				thinspace: ["Spacer", mml.LENGTH.THINMATHSPACE],
				negthinspace: ["Spacer", mml.LENGTH.NEGATIVETHINMATHSPACE],
				hskip: "Hskip",
				hspace: "Hskip",
				kern: "Hskip",
				mskip: "Hskip",
				mspace: "Hskip",
				mkern: "Hskip",
				Rule: ["Rule"],
				Space: ["Rule", "blank"],
				big: ["MakeBig", mml.TEXCLASS.ORD, 0.85],
				Big: ["MakeBig", mml.TEXCLASS.ORD, 1.15],
				bigg: ["MakeBig", mml.TEXCLASS.ORD, 1.45],
				Bigg: ["MakeBig", mml.TEXCLASS.ORD, 1.75],
				bigl: ["MakeBig", mml.TEXCLASS.OPEN, 0.85],
				Bigl: ["MakeBig", mml.TEXCLASS.OPEN, 1.15],
				biggl: ["MakeBig", mml.TEXCLASS.OPEN, 1.45],
				Biggl: ["MakeBig", mml.TEXCLASS.OPEN, 1.75],
				bigr: ["MakeBig", mml.TEXCLASS.CLOSE, 0.85],
				Bigr: ["MakeBig", mml.TEXCLASS.CLOSE, 1.15],
				biggr: ["MakeBig", mml.TEXCLASS.CLOSE, 1.45],
				Biggr: ["MakeBig", mml.TEXCLASS.CLOSE, 1.75],
				bigm: ["MakeBig", mml.TEXCLASS.REL, 0.85],
				Bigm: ["MakeBig", mml.TEXCLASS.REL, 1.15],
				biggm: ["MakeBig", mml.TEXCLASS.REL, 1.45],
				Biggm: ["MakeBig", mml.TEXCLASS.REL, 1.75],
				mathord: ["TeXAtom", mml.TEXCLASS.ORD],
				mathop: ["TeXAtom", mml.TEXCLASS.OP],
				mathopen: ["TeXAtom", mml.TEXCLASS.OPEN],
				mathclose: ["TeXAtom", mml.TEXCLASS.CLOSE],
				mathbin: ["TeXAtom", mml.TEXCLASS.BIN],
				mathrel: ["TeXAtom", mml.TEXCLASS.REL],
				mathpunct: ["TeXAtom", mml.TEXCLASS.PUNCT],
				mathinner: ["TeXAtom", mml.TEXCLASS.INNER],
				vcenter: ["TeXAtom", mml.TEXCLASS.VCENTER],
				mathchoice: ["Extension", "mathchoice"],
				buildrel: "BuildRel",
				hbox: ["HBox", 0],
				text: "HBox",
				mbox: ["HBox", 0],
				fbox: "FBox",
				strut: "Strut",
				mathstrut: ["Macro", "\\vphantom{(}"],
				phantom: "Phantom",
				vphantom: ["Phantom", 1, 0],
				hphantom: ["Phantom", 0, 1],
				smash: "Smash",
				acute: ["Accent", "00B4"],
				grave: ["Accent", "0060"],
				ddot: ["Accent", "00A8"],
				tilde: ["Accent", "007E"],
				bar: ["Accent", "00AF"],
				breve: ["Accent", "02D8"],
				check: ["Accent", "02C7"],
				hat: ["Accent", "005E"],
				vec: ["Accent", "2192"],
				dot: ["Accent", "02D9"],
				widetilde: ["Accent", "007E", 1],
				widehat: ["Accent", "005E", 1],
				matrix: "Matrix",
				array: "Matrix",
				pmatrix: ["Matrix", "(", ")"],
				cases: ["Matrix", "{", "", "left left", null, ".1em", null, true],
				eqalign: ["Matrix", null, null, "right left", mml.LENGTH.THICKMATHSPACE, ".5em", "D"],
				displaylines: ["Matrix", null, null, "center", null, ".5em", "D"],
				cr: "Cr",
				"\\": "CrLaTeX",
				newline: "Cr",
				hline: ["HLine", "solid"],
				hdashline: ["HLine", "dashed"],
				eqalignno: ["Matrix", null, null, "right left", mml.LENGTH.THICKMATHSPACE, ".5em", "D", null, "right"],
				leqalignno: ["Matrix", null, null, "right left", mml.LENGTH.THICKMATHSPACE, ".5em", "D", null, "left"],
				hfill: "HFill",
				hfil: "HFill",
				hfilll: "HFill",
				bmod: ["Macro", '\\mmlToken{mo}[lspace="thickmathspace" rspace="thickmathspace"]{mod}'],
				pmod: ["Macro", "\\pod{\\mmlToken{mi}{mod}\\kern 6mu #1}", 1],
				mod: ["Macro", "\\mathchoice{\\kern18mu}{\\kern12mu}{\\kern12mu}{\\kern12mu}\\mmlToken{mi}{mod}\\,\\,#1", 1],
				pod: ["Macro", "\\mathchoice{\\kern18mu}{\\kern8mu}{\\kern8mu}{\\kern8mu}(#1)", 1],
				iff: ["Macro", "\\;\\Longleftrightarrow\\;"],
				skew: ["Macro", "{{#2{#3\\mkern#1mu}\\mkern-#1mu}{}}", 3],
				mathcal: ["Macro", "{\\cal #1}", 1],
				mathscr: ["Macro", "{\\scr #1}", 1],
				mathrm: ["Macro", "{\\rm #1}", 1],
				mathbf: ["Macro", "{\\bf #1}", 1],
				mathbb: ["Macro", "{\\bbFont #1}", 1],
				Bbb: ["Macro", "{\\bbFont #1}", 1],
				mathit: ["Macro", "{\\it #1}", 1],
				mathfrak: ["Macro", "{\\frak #1}", 1],
				mathsf: ["Macro", "{\\sf #1}", 1],
				mathtt: ["Macro", "{\\tt #1}", 1],
				textrm: ["Macro", "\\mathord{\\rm\\text{#1}}", 1],
				textit: ["Macro", "\\mathord{\\it\\text{#1}}", 1],
				textbf: ["Macro", "\\mathord{\\bf\\text{#1}}", 1],
				textsf: ["Macro", "\\mathord{\\sf\\text{#1}}", 1],
				texttt: ["Macro", "\\mathord{\\tt\\text{#1}}", 1],
				pmb: ["Macro", "\\rlap{#1}\\kern1px{#1}", 1],
				TeX: ["Macro", "T\\kern-.14em\\lower.5ex{E}\\kern-.115em X"],
				LaTeX: ["Macro", "L\\kern-.325em\\raise.21em{\\scriptstyle{A}}\\kern-.17em\\TeX"],
				" ": ["Macro", "\\text{ }"],
				not: "Not",
				dots: "Dots",
				space: "Tilde",
				"\u00A0": "Tilde",
				begin: "BeginEnd",
				end: "BeginEnd",
				newcommand: ["Extension", "newcommand"],
				renewcommand: ["Extension", "newcommand"],
				newenvironment: ["Extension", "newcommand"],
				renewenvironment: ["Extension", "newcommand"],
				def: ["Extension", "newcommand"],
				let: ["Extension", "newcommand"],
				verb: ["Extension", "verb"],
				boldsymbol: ["Extension", "boldsymbol"],
				tag: ["Extension", "AMSmath"],
				notag: ["Extension", "AMSmath"],
				label: ["Extension", "AMSmath"],
				ref: ["Extension", "AMSmath"],
				eqref: ["Extension", "AMSmath"],
				nonumber: ["Macro", "\\notag"],
				unicode: ["Extension", "unicode"],
				color: "Color",
				href: ["Extension", "HTML"],
				"class": ["Extension", "HTML"],
				style: ["Extension", "HTML"],
				cssId: ["Extension", "HTML"],
				bbox: ["Extension", "bbox"],
				mmlToken: "MmlToken",
				require: "Require"
			},
			environment: {
				array: ["AlignedArray"],
				matrix: ["Array", null, null, null, "c"],
				pmatrix: ["Array", null, "(", ")", "c"],
				bmatrix: ["Array", null, "[", "]", "c"],
				Bmatrix: ["Array", null, "\\{", "\\}", "c"],
				vmatrix: ["Array", null, "\\vert", "\\vert", "c"],
				Vmatrix: ["Array", null, "\\Vert", "\\Vert", "c"],
				cases: ["Array", null, "\\{", ".", "ll", null, ".2em", "T"],
				equation: [null, "Equation"],
				"equation*": [null, "Equation"],
				eqnarray: ["ExtensionEnv", null, "AMSmath"],
				"eqnarray*": ["ExtensionEnv", null, "AMSmath"],
				align: ["ExtensionEnv", null, "AMSmath"],
				"align*": ["ExtensionEnv", null, "AMSmath"],
				aligned: ["ExtensionEnv", null, "AMSmath"],
				multline: ["ExtensionEnv", null, "AMSmath"],
				"multline*": ["ExtensionEnv", null, "AMSmath"],
				split: ["ExtensionEnv", null, "AMSmath"],
				gather: ["ExtensionEnv", null, "AMSmath"],
				"gather*": ["ExtensionEnv", null, "AMSmath"],
				gathered: ["ExtensionEnv", null, "AMSmath"],
				alignat: ["ExtensionEnv", null, "AMSmath"],
				"alignat*": ["ExtensionEnv", null, "AMSmath"],
				alignedat: ["ExtensionEnv", null, "AMSmath"]
			}, p_height: 1.2 / 0.85
		};
	};
	var parser = MathJax.Object.Subclass({
		PRIME: "\u2032",
		SMARTQUOTE: "\u2019",
		MmlTokenAllow: {
			fontfamily: 1,
			fontsize: 1,
			fontweight: 1,
			fontstyle: 1,
			color: 1,
			background: 1,
			id: 1,
			"class": 1,
			href: 1,
			style: 1
		},
		emPerInch: 7.2,
		pxPerInch: 72,

		Init: function (n, o) {
			this.string = n;
			this.i = 0;
			this.macroCount = 0;
			var m;
			if (o) {
				m = {};
				for (var p in o) {
					if (o.hasOwnProperty(p)) {
						m[p] = o[p];
					}
				}
			}
			this.stack = tex.Stack(m, !!o);
			this.Parse();
			this.Push(base.stop());
		},
		Parse: function () {
			var o, m;
			while (this.i < this.string.length) {
				o = this.string.charAt(this.i++);
				m = o.charCodeAt(0);
				if (m >= 55296 && m < 56320) {
					o += this.string.charAt(this.i++);
				}
				if (g.special[o]) {
					this[g.special[o]](o);
				} else {
					if (g.letter.test(o)) {
						this.Variable(o);
					} else {
						if (g.digit.test(o)) {
							this.Number(o);
						} else {
							this.Other(o);
						}
					}
				}
			}
		},
		Push: function () {
			this.stack.Push.apply(this.stack, arguments)
		},
		Variable: function (n) {
			var m = {};
			if (this.stack.env.font) {
				m.mathvariant = this.stack.env.font;
			}
			this.Push(this.mmlToken(mml.mi(mml.chars(n)).With(m)));
		},
		Number: function (p) {
			var m, o = this.string.slice(this.i - 1).match(g.number);
			if (o) {
				m = mml.mn(o[0].replace(/[{}]/g, ""));
				this.i += o[0].length - 1;
			} else {
				m = mml.mo(mml.chars(p));
			}
			if (this.stack.env.font) {
				m.mathvariant = this.stack.env.font;
			}
			this.Push(this.mmlToken(m));
		},
		Other: function (o) {
			var n, m;
			if (this.stack.env.font) {
				n = { mathvariant: this.stack.env.font };
			}
			if (g.remap[o]) {
				o = g.remap[o];
				if (isArray(o)) {
					n = o[1]; o = o[0];
				}
				m = mml.mo(mml.entity("#x" + o)).With(n);
			} else {
				m = mml.mo(o).With(n);
			}
			if (m.autoDefault("stretchy", true)) {
				m.stretchy = false;
			}
			if (m.autoDefault("texClass", true) == "") {
				m = mml.TeXAtom(m);
			}
			this.Push(this.mmlToken(m))
		},

		mml: function () {
			if (this.stack.Top().type !== "mml") { return null }
			return this.stack.Top().data[0]
		},
		mmlToken: function (m) {
			return m;
		},
		ControlSequence: function (p) {
			var m = this.GetCS(), o = this.csFindMacro(m);
			if (o) {
				if (!isArray(o)) { o = [o] }
				var n = o[0];
				if (!(n instanceof Function)) { n = this[n] }
				n.apply(this, [p + m].concat(o.slice(1)));
			} else {
				if (g.mathchar0mi[m]) {
					this.csMathchar0mi(m, g.mathchar0mi[m]);
				} else {
					if (g.mathchar0mo[m]) {
						this.csMathchar0mo(m, g.mathchar0mo[m]);
					} else {
						if (g.mathchar7[m]) {
							this.csMathchar7(m, g.mathchar7[m]);
						} else {
							if (g.delimiter["\\" + m] != null) {
								this.csDelimiter(m, g.delimiter["\\" + m]);
							} else {
								this.csUndefined(p + m);
							}
						}
					}
				}
			}
		},
		csFindMacro: function (m) {
			return g.macros[m];
		},
		csMathchar0mi: function (_m, o) {
			var n = { mathvariant: mml.VARIANT.ITALIC };
			if (isArray(o)) { n = o[1]; o = o[0] }
			this.Push(this.mmlToken(mml.mi(mml.entity("#x" + o)).With(n)));
		},
		csMathchar0mo: function (_m, o) {
			var n = { stretchy: false };
			if (isArray(o)) {
				n = o[1];
				n.stretchy = false;
				o = o[0];
			}
			this.Push(this.mmlToken(mml.mo(mml.entity("#x" + o)).With(n)));
		},
		csMathchar7: function (_m, o) {
			var n = { mathvariant: mml.VARIANT.NORMAL };
			if (isArray(o)) {
				n = o[1];
				o = o[0];
			}
			if (this.stack.env.font) {
				n.mathvariant = this.stack.env.font;
			}
			this.Push(this.mmlToken(mml.mi(mml.entity("#x" + o)).With(n)));
		},
		csDelimiter: function (_m, o) {
			var n = {};
			if (isArray(o)) {
				n = o[1];
				o = o[0];
			}
			if (o.length === 4) {
				o = mml.entity("#x" + o);
			} else {
				o = mml.chars(o);
			}
			this.Push(this.mmlToken(mml.mo(o).With({ fence: false, stretchy: false }).With(n)));
		},
		csUndefined: function (m) {
			tex.Error(["UndefinedControlSequence", "Undefined control sequence %1", m]);
		},
		Open: function (_m) {
			this.Push(base.open());
		},
		Close: function (_m) {
			this.Push(base.close());
		},
		Tilde: function (_m) {
			this.Push(mml.mtext(mml.chars(h)));
		},
		Space: function (_m) { },
		Superscript: function (_r) {
			if (this.GetNext().match(/\d/)) {
				this.string = this.string.substr(0, this.i + 1) + " " + this.string.substr(this.i + 1);
			}
			var q, o, p = this.stack.Top();
			if (p.type === "prime") {
				o = p.data[0];
				q = p.data[1];
				this.stack.Pop();
			} else {
				o = this.stack.Prev();
				if (!o) {
					o = mml.mi("");
				}
			}
			if (o.isEmbellishedWrapper) {
				o = o.data[0].data[0];
			}
			var n = o.movesupsub, m = o.sup;
			if ((o.type === "msubsup" && o.data[o.sup]) || (o.type === "munderover" && o.data[o.over] && !o.subsupOK)) {
				tex.Error(["DoubleExponent", "Double exponent: use braces to clarify"]);
			}
			if (o.type !== "msubsup") {
				if (n) {
					if (o.type !== "munderover" || o.data[o.over]) {
						if (o.movablelimits && o.isa(mml.mi)) {
							o = this.mi2mo(o);
						}
						o = mml.munderover(o, null, null).With({ movesupsub: true });
					}
					m = o.over;
				} else {
					o = mml.msubsup(o, null, null);
					m = o.sup;
				}
			}
			this.Push(base.subsup(o).With({ position: m, primes: q, movesupsub: n }));
		},
		Subscript: function (_r) {
			if (this.GetNext().match(/\d/)) {
				this.string = this.string.substr(0, this.i + 1) + " " + this.string.substr(this.i + 1);
			}
			var q, o, p = this.stack.Top();
			if (p.type === "prime") {
				o = p.data[0];
				q = p.data[1];
				this.stack.Pop();
			} else {
				o = this.stack.Prev();
				if (!o) {
					o = mml.mi("");
				}
			}
			if (o.isEmbellishedWrapper) {
				o = o.data[0].data[0];
			}
			var n = o.movesupsub, m = o.sub;
			if ((o.type === "msubsup" && o.data[o.sub]) || (o.type === "munderover" && o.data[o.under] && !o.subsupOK)) {
				tex.Error(["DoubleSubscripts", "Double subscripts: use braces to clarify"]);
			}
			if (o.type !== "msubsup") {
				if (n) {
					if (o.type !== "munderover" || o.data[o.under]) {
						if (o.movablelimits && o.isa(mml.mi)) {
							o = this.mi2mo(o);
						}
						o = mml.munderover(o, null, null).With({ movesupsub: true });
					}
					m = o.under;
				} else {
					o = mml.msubsup(o, null, null);
					m = o.sub;
				}
			}
			this.Push(base.subsup(o).With({ position: m, primes: q, movesupsub: n }));
		},
		Prime: function (o) {
			var n = this.stack.Prev();
			if (!n) {
				n = mml.mi();
			}
			if (n.type === "msubsup" && n.data[n.sup]) {
				tex.Error(["DoubleExponentPrime", "Prime causes double exponent: use braces to clarify"]);
			}
			var m = "";
			this.i--;
			do {
				m += this.PRIME;
				this.i++, o = this.GetNext();
			} while (o === "'" || o === this.SMARTQUOTE);
			m = ["", "\u2032", "\u2033", "\u2034", "\u2057"][m.length] || m;
			this.Push(base.prime(n, this.mmlToken(mml.mo(m))));
		},
		mi2mo: function (m) {
			var n = mml.mo();
			n.Append.apply(n, m.data);
			var o; for (o in n.defaults) {
				if (n.defaults.hasOwnProperty(o) && m[o] != null) {
					n[o] = m[o];
				}
			}
			for (o in mml.copyAttributes) {
				if (mml.copyAttributes.hasOwnProperty(o) && m[o] != null) { n[o] = m[o] }
			}
			n.lspace = n.rspace = "0";
			n.useMMLspacing &= ~(n.SPACE_ATTR.lspace | n.SPACE_ATTR.rspace);
			return n;
		},
		Comment: function (_m) {
			while (this.i < this.string.length && this.string.charAt(this.i) != "\n") { this.i++ }
		},
		Hash: function (_m) {
			tex.Error(["CantUseHash1", "You can't use 'macro parameter character #' in math mode"])
		},
		SetFont: function (_n, m) {
			this.stack.env.font = m;
		},
		SetStyle: function (_n, m, o, p) {
			this.stack.env.style = m;
			this.stack.env.level = p;
			this.Push(base.style().With({ styles: { displaystyle: o, scriptlevel: p } }))
		},
		SetSize: function (_m, n) {
			this.stack.env.size = n;
			this.Push(base.style().With({ styles: { mathsize: n + "em" } }));
		},
		Color: function (o) {
			var n = this.GetArgument(o);
			var m = this.stack.env.color;
			this.stack.env.color = n;
			var p = this.ParseArg(o);
			if (m) {
				this.stack.env.color;
			} else {
				delete this.stack.env.color;
			}
			this.Push(mml.mstyle(p).With({ mathcolor: n }));
		},
		Spacer: function (_m, n) {
			this.Push(mml.mspace().With({ width: n, mathsize: mml.SIZE.NORMAL, scriptlevel: 0 }));
		},
		LeftRight: function (m) {
			this.Push(base[m.substr(1)]().With({ delim: this.GetDelimiter(m) }));
		},
		Middle: function (m) {
			var n = this.GetDelimiter(m);
			this.Push(mml.TeXAtom().With({ texClass: mml.TEXCLASS.CLOSE }));
			if (this.stack.Top().type !== "left") {
				tex.Error(["MisplacedMiddle", "%1 must be within \\left and \\right", m]);
			}
			this.Push(mml.mo(n).With({ stretchy: true }));
			this.Push(mml.TeXAtom().With({ texClass: mml.TEXCLASS.OPEN }));
		},
		NamedFn: function (n, o) {
			if (!o) { o = n.substr(1) }
			var m = mml.mi(o).With({ texClass: mml.TEXCLASS.OP });
			this.Push(base.fn(this.mmlToken(m)));
		},
		NamedOp: function (n, o) {
			if (!o) { o = n.substr(1) }
			o = o.replace(/&thinsp;/, "\u2006");
			var m = mml.mo(o).With({ movablelimits: true, movesupsub: true, form: mml.FORM.PREFIX, texClass: mml.TEXCLASS.OP });
			m.useMMLspacing &= ~m.SPACE_ATTR.form;
			this.Push(this.mmlToken(m));
		},
		Limits: function (n, m) {
			var p = this.stack.Prev("nopop");
			if (!p || (p.Get("texClass") !== mml.TEXCLASS.OP && p.movesupsub == null)) {
				tex.Error(["MisplacedLimits", "%1 is allowed only on operators", n]);
			}
			var o = this.stack.Top();
			if (p.type === "munderover" && !m) {
				p = o.data[o.data.length - 1] = mml.msubsup.apply(mml.subsup, p.data);
			} else {
				if (p.type === "msubsup" && m) {
					p = o.data[o.data.length - 1] = mml.munderover.apply(mml.underover, p.data);
				}
			}
			p.movesupsub = (m ? true : false);
			p.Core().movablelimits = false;
			if (p.movablelimits) {
				p.movablelimits = false;
			}
		},
		Over: function (o, n, p) {
			var m = base.over().With({ name: o });
			if (n || p) {
				m.open = n; m.close = p;
			} else {
				if (o.match(/withdelims$/)) {
					m.open = this.GetDelimiter(o);
					m.close = this.GetDelimiter(o);
				}
			}
			if (o.match(/^\\above/)) {
				m.thickness = this.GetDimen(o);
			} else {
				if (o.match(/^\\atop/) || n || p) { m.thickness = 0 }
			}
			this.Push(m);
		},
		Frac: function (n) {
			var m = this.ParseArg(n);
			var o = this.ParseArg(n);
			this.Push(mml.mfrac(m, o));
		},
		Sqrt: function (p) {
			var q = this.GetBrackets(p), m = this.GetArgument(p);
			if (m === "\\frac") {
				m += "{" + this.GetArgument(m) + "}{" + this.GetArgument(m) + "}";
			}
			var o = tex.Parse(m, this.stack.env).mml();
			if (!q) {
				o = mml.msqrt.apply(mml, o.array());
			} else {
				o = mml.mroot(o, this.parseRoot(q));
			}
			this.Push(o);
		},
		Root: function (o) {
			var p = this.GetUpTo(o, "\\of");
			var m = this.ParseArg(o);
			this.Push(mml.mroot(m, this.parseRoot(p)));
		},
		parseRoot: function (r) {
			var o = this.stack.env, m = o.inRoot;
			o.inRoot = true;
			var q = tex.Parse(r, o);
			r = q.mml();
			var p = q.stack.global;
			if (p.leftRoot || p.upRoot) {
				r = mml.mpadded(r);
				if (p.leftRoot) { r.width = p.leftRoot }
				if (p.upRoot) { r.voffset = p.upRoot; r.height = p.upRoot }
			}
			o.inRoot = m;
			return r;
		},
		MoveRoot: function (m, p) {
			if (!this.stack.env.inRoot) {
				tex.Error(["MisplacedMoveRoot", "%1 can appear only within a root", m]);
			}
			if (this.stack.global[p]) {
				tex.Error(["MultipleMoveRoot", "Multiple use of %1", m]);
			}
			var o = this.GetArgument(m);
			if (!o.match(/-?[0-9]+/)) {
				tex.Error(["IntegerArg", "The argument to %1 must be an integer", m]);
			}
			o = (o / 15) + "em";
			if (o.substr(0, 1) !== "-") { o = "+" + o }
			this.stack.global[p] = o;
		},
		Accent: function (o, m, s) {
			var r = this.ParseArg(o);
			var q = { accent: true };
			if (this.stack.env.font) {
				q.mathvariant = this.stack.env.font;
			}
			var n = this.mmlToken(mml.mo(mml.entity("#x" + m)).With(q));
			n.stretchy = (s ? true : false);
			var p = (r.isEmbellished() ? r.CoreMO() : r);
			if (p.isa(mml.mo)) { p.movablelimits = false }
			this.Push(mml.TeXAtom(mml.munderover(r, null, n).With({ accent: true })));
		},
		UnderOver: function (o, s, m, q) {
			var r = { o: "over", u: "under" }[o.charAt(1)];
			var p = this.ParseArg(o);
			if (p.Get("movablelimits")) { p.movablelimits = false }
			if (p.isa(mml.munderover) && p.isEmbellished()) {
				p.Core().With({ lspace: 0, rspace: 0 });
				p = mml.mrow(mml.mo().With({ rspace: 0 }), p);
			}
			var n = mml.munderover(p, null, null);
			n.SetData(n[r], this.mmlToken(mml.mo(mml.entity("#x" + s)).With({ stretchy: true, accent: !q })));
			if (m) {
				n = mml.TeXAtom(n).With({ texClass: mml.TEXCLASS.OP, movesupsub: true });
			}
			this.Push(n.With({ subsupOK: true }));
		},
		Overset: function (m) {
			var o = this.ParseArg(m), n = this.ParseArg(m);
			if (n.movablelimits) { n.movablelimits = false }
			this.Push(mml.mover(n, o));
		},
		Underset: function (m) {
			var o = this.ParseArg(m), n = this.ParseArg(m);
			if (n.movablelimits) { n.movablelimits = false }
			this.Push(mml.munder(n, o));
		},
		TeXAtom: function (p, r) {
			var q = { texClass: r }, o;
			if (r == mml.TEXCLASS.OP) {
				q.movesupsub = q.movablelimits = true;
				var m = this.GetArgument(p);
				var n = m.match(/^\s*\\rm\s+([a-zA-Z0-9 ]+)$/);
				if (n) {
					q.mathvariant = mml.VARIANT.NORMAL;
					o = base.fn(this.mmlToken(mml.mi(n[1]).With(q)));
				} else {
					o = base.fn(mml.TeXAtom(tex.Parse(m, this.stack.env).mml()).With(q));
				}
			} else {
				o = mml.TeXAtom(this.ParseArg(p)).With(q);
			}
			this.Push(o);
		},
		MmlToken: function (o) {
			var p = this.GetArgument(o);
			var m = this.GetBrackets(o, "").replace(/^\s+/, "");
			var s = this.GetArgument(o);
			var r = { attrNames: [] };
			var n;
			if (!mml[p] || !mml[p].prototype.isToken) {
				tex.Error(["NotMathMLToken", "%1 is not a token element", p]);
			}
			while (m !== "") {
				n = m.match(/^([a-z]+)\s*=\s*('[^']*'|"[^"]*"|[^ ,]*)\s*,?\s*/i);
				if (!n) {
					tex.Error(["InvalidMathMLAttr", "Invalid MathML attribute: %1", m]);
				}
				if (mml[p].prototype.defaults[n[1]] == null && !this.MmlTokenAllow[n[1]]) {
					tex.Error(["UnknownAttrForElement", "%1 is not a recognized attribute for %2", n[1], p]);
				}
				var q = this.MmlFilterAttribute(n[1], n[2].replace(/^(['"])(.*)\1$/, "$2"));
				if (q) {
					if (q.toLowerCase() === "true") {
						q = true;
					} else {
						if (q.toLowerCase() === "false") {
							q = false;
						}
					}
					r[n[1]] = q;
					r.attrNames.push(n[1]);
				}
				m = m.substr(n[0].length);
			}
			this.Push(this.mmlToken(mml[p](s).With(r)));
		},
		MmlFilterAttribute: function (_m, n) {
			return n;
		},
		Strut: function (_m) {
			this.Push(mml.mpadded(mml.mrow()).With({ height: "8.6pt", depth: "3pt", width: 0 }));
		},
		Phantom: function (n, m, o) {
			var p = mml.mphantom(this.ParseArg(n));
			if (m || o) {
				p = mml.mpadded(p);
				if (o) { p.height = p.depth = 0 }
				if (m) { p.width = 0 }
			}
			this.Push(mml.TeXAtom(p));
		},
		Smash: function (o) {
			var n = this.trimSpaces(this.GetBrackets(o, ""));
			var m = mml.mpadded(this.ParseArg(o));
			switch (n) {
				case "b": m.depth = 0; break;
				case "t": m.height = 0; break;
				default: m.height = m.depth = 0;
			}
			this.Push(mml.TeXAtom(m));
		},
		Lap: function (n) {
			var m = mml.mpadded(this.ParseArg(n)).With({ width: 0 });
			if (n === "\\llap") { m.lspace = "-1width" }
			this.Push(mml.TeXAtom(m));
		},
		RaiseLower: function (m) {
			var n = this.GetDimen(m);
			var o = base.position().With({ name: m, move: "vertical" });
			if (n.charAt(0) === "-") {
				n = n.slice(1);
				m = { raise: "\\lower", lower: "\\raise" }[m.substr(1)];
			}
			if (m === "\\lower") {
				o.dh = "-" + n;
				o.dd = "+" + n;
			} else {
				o.dh = "+" + n;
				o.dd = "-" + n;
			}
			this.Push(o);
		},
		MoveLeftRight: function (m) {
			var p = this.GetDimen(m);
			var o = (p.charAt(0) === "-" ? p.slice(1) : "-" + p);
			if (m === "\\moveleft") {
				var n = p;
				p = o;
				o = n;
			}
			this.Push(base.position().With({
				name: m,
				move: "horizontal",
				left: mml.mspace().With({
					width: p,
					mathsize: mml.SIZE.NORMAL
				}),
				right: mml.mspace().With({ width: o, mathsize: mml.SIZE.NORMAL })
			}));
		},
		Hskip: function (m) {
			this.Push(mml.mspace().With({ width: this.GetDimen(m), mathsize: mml.SIZE.NORMAL }));
		},
		Rule: function (o, q) {
			var m = this.GetDimen(o), p = this.GetDimen(o), s = this.GetDimen(o);
			var n, r = { width: m, height: p, depth: s };
			if (q !== "blank") {
				if (parseFloat(m) && parseFloat(p) + parseFloat(s)) {
					r.mathbackground = (this.stack.env.color || "black");
				}
				n = mml.mpadded(mml.mrow()).With(r);
			} else {
				n = mml.mspace().With(r);
			}
			this.Push(n);
		},
		MakeBig: function (m, p, n) {
			n *= g.p_height;
			n = String(n).replace(/(\.\d\d\d).+/, "$1") + "em";
			var o = this.GetDelimiter(m, true);
			this.Push(mml.TeXAtom(mml.mo(o).With({
				minsize: n,
				maxsize: n,
				fence: true,
				stretchy: true,
				symmetric: true
			})).With({ texClass: p }));
		},
		BuildRel: function (m) {
			var n = this.ParseUpTo(m, "\\over");
			var o = this.ParseArg(m);
			this.Push(mml.TeXAtom(mml.munderover(o, null, n)).With({ texClass: mml.TEXCLASS.REL }));
		},
		HBox: function (m, n) {
			this.Push.apply(this, this.InternalMath(this.GetArgument(m), n));
		},
		FBox: function (m) {
			this.Push(mml.menclose.apply(mml, this.InternalMath(this.GetArgument(m))).With({ notation: "box" }));
		},
		Not: function (_m) {
			this.Push(base.not());
		},
		Dots: function (_m) {
			this.Push(base.dots().With({
				ldots: this.mmlToken(mml.mo(mml.entity("#x2026")).With({ stretchy: false })),
				cdots: this.mmlToken(mml.mo(mml.entity("#x22EF")).With({ stretchy: false }))
			}));
		},
		Require: function (m) {
			var n = this.GetArgument(m).replace(/.*\//, "").replace(/[^a-z0-9_.-]/ig, "");
			this.Extension(null, n);
		},
		Extension: function (m, n, o) {
			if (m && !typeof (m) === "string") { m = m.name }
			n = tex.extensionDir + "/" + n;
			if (!n.match(/\.js$/)) { n += ".js" }
			if (!ajax.loaded[ajax.fileURL(n)]) {
				if (m != null) {
					delete g[o || "macros"][m.replace(/^\\/, "")];
				}
				hub.RestartAfter(ajax.Require(n));
			}
		},
		Macro: function (o, r, q, s) {
			if (q) {
				var n = [];
				if (s != null) {
					var m = this.GetBrackets(o);
					n.push(m == null ? s : m);
				}
				for (var p = n.length; p < q; p++) {
					n.push(this.GetArgument(o));
				}
				r = this.SubstituteArgs(n, r);
			}
			this.string = this.AddArgs(r, this.string.slice(this.i));
			this.i = 0;
			if (++this.macroCount > tex.config.MAXMACROS) {
				tex.Error(["MaxMacroSub1", "MathJax maximum macro substitution count exceeded; is there a recursive macro call?"]);
			}
		},
		Matrix: function (n, p, v, r, u, o, m, w, t) {
			var s = this.GetNext();
			if (s === "") {
				tex.Error(["MissingArgFor", "Missing argument for %1", n]);
			}
			if (s === "{") {
				this.i++;
			} else {
				this.string = s + "}" + this.string.slice(this.i + 1);
				this.i = 0;
			}
			var q = base.array().With({
				requireClose: true,
				arraydef: { rowspacing: (o || "4pt"), columnspacing: (u || "1em") }
			});
			if (w) { q.isCases = true }
			if (t) {
				q.isNumbered = true;
				q.arraydef.side = t;
			}
			if (p || v) {
				q.open = p;
				q.close = v;
			}
			if (m === "D") { q.arraydef.displaystyle = true }
			if (r != null) { q.arraydef.columnalign = r }
			this.Push(q);
		},
		Entry: function (p) {
			this.Push(base.cell().With({ isEntry: true, name: p }));
			if (this.stack.Top().isCases) {
				var o = this.string;
				var s = 0, q = this.i, n = o.length;
				while (q < n) {
					var t = o.charAt(q);
					if (t === "{") {
						s++;
						q++;
					} else {
						if (t === "}") {
							if (s === 0) {
								n = 0;
							} else {
								s--;
								q++;
							}
						} else {
							if (t === "&" && s === 0) {
								tex.Error(["ExtraAlignTab", "Extra alignment tab in \\cases text"]);
							} else {
								if (t === "\\") {
									if (o.substr(q).match(/^((\\cr)[^a-zA-Z]|\\\\)/)) {
										n = 0;
									} else {
										q += 2;
									}
								} else {
									q++;
								}
							}
						}
					}
				}
				var r = o.substr(this.i, q - this.i);
				if (!r.match(/^\s*\\text[^a-zA-Z]/)) {
					this.Push.apply(this, this.InternalMath(r, 0));
					this.i = q;
				}
			}
		},
		Cr: function (m) {
			this.Push(base.cell().With({ isCR: true, name: m }));
		},
		CrLaTeX: function (m) {
			var q;
			if (this.string.charAt(this.i) === "[") {
				q = this.GetBrackets(m, "").replace(/ /g, "").replace(/,/, ".");
				if (q && !this.matchDimen(q)) {
					tex.Error(["BracketMustBeDimension", "Bracket argument to %1 must be a dimension", m]);
				}
			}
			this.Push(base.cell().With({ isCR: true, name: m, linebreak: true }));
			var p = this.stack.Top();
			if (p.isa(base.array)) {
				if (q && p.arraydef.rowspacing) {
					var o = p.arraydef.rowspacing.split(/ /);
					if (!p.rowspacing) {
						p.rowspacing = this.dimen2em(o[0]);
					}
					while (o.length < p.table.length) {
						o.push(this.Em(p.rowspacing));
					}
					o[p.table.length - 1] = this.Em(Math.max(0, p.rowspacing + this.dimen2em(q)));
					p.arraydef.rowspacing = o.join(" ");
				}
			} else {
				if (q) {
					this.Push(mml.mspace().With({ depth: q }));
				}
				this.Push(mml.mspace().With({ linebreak: mml.LINEBREAK.NEWLINE }));
			}
		},
		matchDimen: function (m) {
			return m.match(/^(-?(?:\.\d+|\d+(?:\.\d*)?))(px|pt|em|ex|mu|pc|in|mm|cm)$/);
		},
		dimen2em: function (q) {
			var o = this.matchDimen(q);
			var n = parseFloat(o[1] || "1"), p = o[2];
			if (p === "em") { return n }
			if (p === "ex") { return n * 0.43 }
			if (p === "pt") { return n / 10 }
			if (p === "pc") { return n * 1.2 }
			if (p === "px") { return n * this.emPerInch / this.pxPerInch }
			if (p === "in") { return n * this.emPerInch }
			if (p === "cm") { return n * this.emPerInch / 2.54 }
			if (p === "mm") { return n * this.emPerInch / 25.4 }
			if (p === "mu") { return n / 18 }
			return 0;
		},
		Em: function (n) {
			if (Math.abs(n) < 0.0006) { return "0em" }
			return n.toFixed(3).replace(/\.?0+$/, "") + "em";
		},
		HLine: function (n, o) {
			if (o == null) { o = "solid" }
			var p = this.stack.Top();
			if (!p.isa(base.array) || p.data.length) {
				tex.Error(["Misplaced", "Misplaced %1", n]);
			}
			if (p.table.length == 0) {
				p.frame.push("top");
			} else {
				var m = (p.arraydef.rowlines ? p.arraydef.rowlines.split(/ /) : []);
				while (m.length < p.table.length) { m.push("none") }
				m[p.table.length - 1] = o;
				p.arraydef.rowlines = m.join(" ");
			}
		},
		HFill: function (m) {
			var n = this.stack.Top();
			if (n.isa(base.array)) {
				n.hfill.push(n.data.length);
			} else {
				tex.Error(["UnsupportedHFill", "Unsupported use of %1", m]);
			}
		},
		BeginEnd: function (o) {
			var p = this.GetArgument(o), r = false;
			if (p.match(/^\\end\\/)) { r = true; p = p.substr(5) }
			if (p.match(/\\/i)) {
				tex.Error(["InvalidEnv", "Invalid environment name '%1'", p]);
			}
			var q = this.envFindName(p);
			if (!q) {
				tex.Error(["UnknownEnv", "Unknown environment '%1'", p]);
			}
			if (!isArray(q)) { q = [q] }
			var m = (isArray(q[1]) ? q[1][0] : q[1]);
			var n = base.begin().With({ name: p, end: m, parse: this });
			if (o === "\\end") {
				if (!r && isArray(q[1]) && this[q[1][1]]) {
					n = this[q[1][1]].apply(this, [n].concat(q.slice(2)));
				} else {
					n = base.end().With({ name: p });
				}
			} else {
				if (++this.macroCount > tex.config.MAXMACROS) {
					tex.Error(["MaxMacroSub2", "MathJax maximum substitution count exceeded; is there a recursive latex environment?"]);
				}
				if (q[0] && this[q[0]]) {
					n = this[q[0]].apply(this, [n].concat(q.slice(2)));
				}
			}
			this.Push(n);
		},
		envFindName: function (m) {
			return g.environment[m];
		},
		Equation: function (_m, n) {
			return n;
		},
		ExtensionEnv: function (n, m) {
			this.Extension(n.name, m, "environment");
		},
		Array: function (n, p, u, s, t, o, m, q) {
			if (!s) { s = this.GetArgument("\\begin{" + n.name + "}") }
			var v = ("c" + s).replace(/[^clr|:]/g, "").replace(/[^|:]([|:])+/g, "$1");
			s = s.replace(/[^clr]/g, "").split("").join(" ");
			s = s.replace(/l/g, "left").replace(/r/g, "right").replace(/c/g, "center");
			var r = base.array().With({
				arraydef: { columnalign: s, columnspacing: (t || "1em"), rowspacing: (o || "4pt") }
			});
			if (v.match(/[|:]/)) {
				if (v.charAt(0).match(/[|:]/)) {
					r.frame.push("left");
					r.frame.dashed = v.charAt(0) === ":";
				}
				if (v.charAt(v.length - 1).match(/[|:]/)) {
					r.frame.push("right");
				}
				v = v.substr(1, v.length - 2);
				r.arraydef.columnlines = v.split("")
					.join(" ")
					.replace(/[^|: ]/g, "none")
					.replace(/\|/g, "solid")
					.replace(/:/g, "dashed");
			}
			if (p) { r.open = this.convertDelimiter(p) }
			if (u) { r.close = this.convertDelimiter(u) }
			if (m === "D") {
				r.arraydef.displaystyle = true;
			} else {
				if (m) { r.arraydef.displaystyle = false }
			}
			if (m === "S") { r.arraydef.scriptlevel = 1 }
			if (q) { r.arraydef.useHeight = false }
			this.Push(n);
			return r;
		},
		AlignedArray: function (m) {
			var n = this.GetBrackets("\\begin{" + m.name + "}");
			return this.setArrayAlign(this.Array.apply(this, arguments), n);
		},
		setArrayAlign: function (n, m) {
			m = this.trimSpaces(m || "");
			if (m === "t") {
				n.arraydef.align = "baseline 1";
			} else {
				if (m === "b") {
					n.arraydef.align = "baseline -1";
				} else {
					if (m === "c") {
						n.arraydef.align = "center";
					} else {
						if (m) {
							n.arraydef.align = m;
						}
					}
				}
			}
			return n;
		},
		convertDelimiter: function (m) {
			if (m) { m = g.delimiter[m] }
			if (m == null) { return null }
			if (isArray(m)) { m = m[0] }
			if (m.length === 4) {
				m = String.fromCharCode(parseInt(m, 16));
			}
			return m;
		},
		trimSpaces: function (n) {
			if (typeof (n) != "string") { return n }
			var m = n.replace(/^\s+|\s+$/g, "");
			if (m.match(/\\$/) && n.match(/ $/)) { m += " " }
			return m;
		},
		nextIsSpace: function () {
			return this.string.charAt(this.i).match(/\s/);
		},
		GetNext: function () {
			while (this.nextIsSpace()) { this.i++ }
			return this.string.charAt(this.i);
		},
		GetCS: function () {
			var m = this.string.slice(this.i).match(/^([a-z]+|.) ?/i);
			if (m) {
				this.i += m[1].length;
				return m[1];
			} else {
				this.i++;
				return " ";
			}
		},
		GetArgument: function (n, o) {
			switch (this.GetNext()) {
				case "":
					if (!o) {
						tex.Error(["MissingArgFor", "Missing argument for %1", n]);
					}
					return null;
				case "}":
					if (!o) {
						tex.Error(["ExtraCloseMissingOpen", "Extra close brace or missing open brace"]);
					}
					return null;
				case "\\":
					this.i++;
					return "\\" + this.GetCS();
				case "{":
					var m = ++this.i, p = 1;
					while (this.i < this.string.length) {
						switch (this.string.charAt(this.i++)) {
							case "\\": this.i++; break;
							case "{": p++; break;
							case "}":
								if (--p == 0) {
									return this.string.slice(m, this.i - 1);
								}
								break;
						}
					}
					tex.Error(["MissingCloseBrace", "Missing close brace"]);
					break;
			}
			return this.string.charAt(this.i++);
		},
		GetBrackets: function (n, p) {
			if (this.GetNext() != "[") { return p }
			var m = ++this.i, o = 0;
			while (this.i < this.string.length) {
				switch (this.string.charAt(this.i++)) {
					case "{": o++; break;
					case "\\": this.i++; break;
					case "}":
						if (o-- <= 0) {
							tex.Error(["ExtraCloseLooking", "Extra close brace while looking for %1", "']'"]);
						}
						break;
					case "]":
						if (o == 0) {
							return this.string.slice(m, this.i - 1);
						}
						break;
				}
			}
			tex.Error(["MissingCloseBracket", "Couldn't find closing ']' for argument to %1", n]);
		},
		GetDelimiter: function (m, n) {
			while (this.nextIsSpace()) { this.i++ }
			var o = this.string.charAt(this.i);
			this.i++;
			if (this.i <= this.string.length) {
				if (o == "\\") {
					o += this.GetCS(m);
				} else {
					if (o === "{" && n) {
						this.i--;
						o = this.GetArgument(m);
					}
				}
				if (g.delimiter[o] != null) {
					return this.convertDelimiter(o);
				}
			}
			tex.Error(["MissingOrUnrecognizedDelim", "Missing or unrecognized delimiter for %1", m]);
		},
		GetDimen: function (n) {
			var o;
			if (this.nextIsSpace()) { this.i++ }
			if (this.string.charAt(this.i) == "{") {
				o = this.GetArgument(n);
				if (o.match(/^\s*([-+]?([.,]\d+|\d+([.,]\d*)?))\s*(pt|em|ex|mu|px|mm|cm|in|pc)\s*$/)) {
					return o.replace(/ /g, "").replace(/,/, ".");
				}
			} else {
				o = this.string.slice(this.i);
				var m = o.match(/^\s*(([-+]?([.,]\d+|\d+([.,]\d*)?))\s*(pt|em|ex|mu|px|mm|cm|in|pc)) ?/);
				if (m) {
					this.i += m[0].length;
					return m[1].replace(/ /g, "").replace(/,/, ".");
				}
			}
			tex.Error(["MissingDimOrUnits", "Missing dimension or its units for %1", n]);
		},
		GetUpTo: function (o, p) {
			while (this.nextIsSpace()) { this.i++ }
			var n = this.i, m, r, q = 0;
			while (this.i < this.string.length) {
				m = this.i;
				r = this.string.charAt(this.i++);
				switch (r) {
					case "\\":
						r += this.GetCS();
						break;
					case "{":
						q++;
						break;
					case "}":
						if (q == 0) {
							tex.Error(["ExtraCloseLooking", "Extra close brace while looking for %1", p]);
						}
						q--;
						break;
				}
				if (q == 0 && r == p) {
					return this.string.slice(n, m);
				}
			}
			tex.Error(["TokenNotFoundForCommand", "Couldn't find %1 for %2", p, o]);
		},
		ParseArg: function (m) {
			return tex.Parse(this.GetArgument(m), this.stack.env).mml();
		},
		ParseUpTo: function (m, n) {
			return tex.Parse(this.GetUpTo(m, n), this.stack.env).mml();
		},
		InternalMath: function (v, m) {
			var o = (this.stack.env.font ? { mathvariant: this.stack.env.font } : {});
			var n = [], r = 0, q = 0, u, s = "", p = 0;
			if (v.match(/\\?[${}\\]|\\\(|\\(eq)?ref\s*\{/)) {
				while (r < v.length) {
					u = v.charAt(r++);
					if (u === "$") {
						if (s === "$" && p === 0) {
							n.push(mml.TeXAtom(tex.Parse(v.slice(q, r - 1), {}).mml()));
							s = "";
							q = r;
						} else {
							if (s === "") {
								if (q < r - 1) {
									n.push(this.InternalText(v.slice(q, r - 1), o));
								}
								s = "$";
								q = r;
							}
						}
					} else {
						if (u === "{" && s !== "") {
							p++;
						} else {
							if (u === "}") {
								if (s === "}" && p === 0) {
									n.push(mml.TeXAtom(tex.Parse(v.slice(q, r), {}).mml().With(o)));
									s = "";
									q = r;
								} else {
									if (s !== "") {
										if (p) { p-- }
									}
								}
							} else {
								if (u === "\\") {
									if (s === "" && v.substr(r).match(/^(eq)?ref\s*\{/)) {
										var t = RegExp["$&"].length;
										if (q < r - 1) {
											n.push(this.InternalText(v.slice(q, r - 1), o));
										}
										s = "}";
										q = r - 1;
										r += t;
									} else {
										u = v.charAt(r++);
										if (u === "(" && s === "") {
											if (q < r - 2) {
												n.push(this.InternalText(v.slice(q, r - 2), o));
											}
											s = ")";
											q = r;
										} else {
											if (u === ")" && s === ")" && p === 0) {
												n.push(mml.TeXAtom(tex.Parse(v.slice(q, r - 2), {}).mml()));
												s = "";
												q = r;
											} else {
												if (u.match(/[${}\\]/) && s === "") {
													r--;
													v = v.substr(0, r - 1) + v.substr(r);
												}
											}
										}
									}
								}
							}
						}
					}
				}
				if (s !== "") {
					tex.Error(["MathNotTerminated", "Math not terminated in text box"]);
				}
			}
			if (q < v.length) {
				n.push(this.InternalText(v.slice(q), o));
			}
			if (m != null) {
				n = [mml.mstyle.apply(mml, n).With({ displaystyle: false, scriptlevel: m })];
			} else {
				if (n.length > 1) { n = [mml.mrow.apply(mml, n)] }
			}
			return n;
		},
		InternalText: function (n, m) {
			n = n.replace(/^\s+/, h).replace(/\s+$/, h);
			return mml.mtext(mml.chars(n)).With(m);
		},
		SubstituteArgs: function (n, m) {
			var q = "";
			var p = "";
			var r;
			var o = 0;
			while (o < m.length) {
				r = m.charAt(o++);
				if (r === "\\") {
					q += r + m.charAt(o++);
				} else {
					if (r === "#") {
						r = m.charAt(o++);
						if (r === "#") {
							q += r;
						} else {
							if (!r.match(/[1-9]/) || r > n.length) {
								tex.Error(["IllegalMacroParam", "Illegal macro parameter reference"]);
							}
							p = this.AddArgs(this.AddArgs(p, q), n[r - 1]);
							q = "";
						}
					} else {
						q += r;
					}
				}
			}
			return this.AddArgs(p, q);
		},
		AddArgs: function (n, m) {
			if (m.match(/^[a-z]/i) && n.match(/(^|[^\\])(\\\\)*\\[a-z]+$/i)) { n += " " }
			if (n.length + m.length > tex.config.MAXBUFFER) {
				tex.Error(["MaxBufferSize", "MathJax internal buffer size exceeded; is there a recursive macro call?"]);
			}
			return n + m;
		}
	});
	var startUp = function () {
		mml = MathJax.ElementJax.mml;
		hub.Insert(g, parseList());
		if (this.config.Macros) {
			var m = this.config.Macros;
			for (var n in m) {
				if (m.hasOwnProperty(n)) {
					if (typeof (m[n]) === "string") {
						g.macros[n] = ["Macro", m[n]];
					} else {
						g.macros[n] = ["Macro"].concat(m[n]);
					}
					g.macros[n].isUser = true;
				}
			}
		}
	};
	tex.Augment({
		Stack: texStack,
		Parse: parser,
		Definitions: g,
		Startup: startUp,
		config: {
			MAXMACROS: 10000,
			MAXBUFFER: 5 * 1024
		},
		sourceMenuTitle: ["TeXCommands", "TeX Commands"],
		annotationEncoding: "application/x-tex",
		prefilterHooks: new HOOKS(true),
		postfilterHooks: new HOOKS(true),
		Config: function () {
			this.SUPER(arguments).Config.apply(this, arguments);
			if (this.config.equationNumbers.autoNumber !== "none") {
				if (!this.config.extensions) {
					this.config.extensions = [];
				}
				this.config.extensions.push("AMSmath.js");
			}
		},
		Translate: function (m) {
			var n, o = false, q = MathJax.HTML.getScript(m);
			var s = (m.type.replace(/\n/g, " ").match(/(;|\s|\n)mode\s*=\s*display(;|\s|\n|$)/) != null);
			var r = { math: q, display: s, script: m };
			var t = this.prefilterHooks.Execute(r);
			if (t) { return t }
			q = r.math;
			try {
				n = tex.Parse(q).mml();
			} catch (p) {
				if (!p.texError) { throw p }
				n = this.formatError(p, q, s, m);
				o = true;
			}
			if (n.isa(mml.mtable) && n.displaystyle === "inherit") {
				n.displaystyle = s;
			}
			if (n.inferred) {
				n = mml.apply(MathJax.ElementJax, n.data);
			} else {
				n = mml(n);
			}
			if (s) { n.root.display = "block" }
			if (o) { n.texError = true }
			r.math = n;
			return this.postfilterHooks.Execute(r) || r.math;
		},
		prefilterMath: function (n, _o, _m) { return n },
		postfilterMath: function (n, _o, _m) { this.combineRelations(n.root); return n },
		formatError: function (p, o, q, m) {
			var n = p.message.replace(/\n.*/, "");
			hub.signal.Post(["TeX Jax - parse error", n, o, q, m]);
			return mml.Error(n);
		},
		Error: function (m) {
			if (isArray(m)) { m = k.apply(k, m) }
			throw hub.Insert(Error(m), { texError: true });
		},
		Macro: function (m, _n, _o) {
			g.macros[m] = ["Macro"].concat([].slice.call(arguments, 1));
			g.macros[m].isUser = true;
		},
		fenced: function (o, n, p) {
			var m = mml.mrow().With({ open: o, close: p, texClass: mml.TEXCLASS.INNER });
			m.Append(mml.mo(o).With({
				fence: true,
				stretchy: true,
				symmetric: true,
				texClass: mml.TEXCLASS.OPEN
			}), n, mml.mo(p).With({
				fence: true,
				stretchy: true,
				symmetric: true,
				texClass: mml.TEXCLASS.CLOSE
			}));
			return m;
		},
		fixedFence: function (o, n, p) {
			var m = mml.mrow().With({
				open: o,
				close: p,
				texClass: mml.TEXCLASS.ORD
			});
			if (o) {
				m.Append(this.mathPalette(o, "l"));
			}
			if (n.type === "mrow") {
				m.Append.apply(m, n.data);
			} else {
				m.Append(n);
			}
			if (p) {
				m.Append(this.mathPalette(p, "r"));
			}
			return m;
		},
		mathPalette: function (p, n) {
			if (p === "{" || p === "}") { p = "\\" + p }
			var o = "{\\bigg" + n + " " + p + "}", m = "{\\big" + n + " " + p + "}";
			return tex.Parse("\\mathchoice" + o + m + m + m, {}).mml();
		},
		combineRelations: function (q) {
			var r, n, p, o;
			for (r = 0, n = q.data.length; r < n; r++) {
				if (q.data[r]) {
					if (q.isa(mml.mrow)) {
						while (r + 1 < n &&
							(p = q.data[r]) &&
							(o = q.data[r + 1]) &&
							p.isa(mml.mo) &&
							o.isa(mml.mo) &&
							p.Get("texClass") === mml.TEXCLASS.REL &&
							o.Get("texClass") === mml.TEXCLASS.REL
						) {
							if (p.variantForm == o.variantForm &&
								p.Get("mathvariant") == o.Get("mathvariant") &&
								p.style == o.style && p["class"] == o["class"] &&
								!p.id && !o.id
							) {
								p.Append.apply(p, o.data);
								q.data.splice(r + 1, 1);
								n--;
							} else {
								p.rspace = o.lspace = "0pt";
								r++;
							}
						}
					}
					if (!q.data[r].isToken) {
						this.combineRelations(q.data[r]);
					}
				}
			}
		}
	});
	tex.prefilterHooks.Add(function (m) {
		m.math = tex.prefilterMath(m.math, m.display, m.script);
	});
	tex.postfilterHooks.Add(function (m) {
		m.math = tex.postfilterMath(m.math, m.display, m.script);
	});
	tex.loadComplete("jax.js");
}
