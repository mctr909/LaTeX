function AMSmath() {
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
			HandleOperatorName: function (j) {
				var i = (this.GetStar() ? "" : "\\nolimits\\SkipLimits");
				var k = this.trimSpaces(this.GetArgument(j));
				k = k.replace(/\*/g, "\\text{*}").replace(/-/g, "\\text{-}");
				this.string = "\\mathop{\\rm " + k + "}" + i + " " + this.string.slice(this.i);
				this.i = 0;
			},
			SkipLimits: function (_j) {
				var l = this.GetNext(), k = this.i;
				if (l === "\\" && ++this.i && this.GetCS() !== "limits") { this.i = k }
			},
			HandleShove: function (j, i) {
				var k = this.stack.Top();
				if (k.type !== "multline" || k.data.length) {
					tex.Error(["CommandAtTheBeginingOfLine", "%1 must come at the beginning of the line", j]);
				}
				k.data.shove = i;
			},
			CFrac: function (l) {
				var i = this.trimSpaces(this.GetBrackets(l, "")),
					k = this.GetArgument(l),
					m = this.GetArgument(l);
				var j = mml.mfrac(
					tex.Parse("\\strut\\textstyle{" + k + "}", this.stack.env).mml(),
					tex.Parse("\\strut\\textstyle{" + m + "}", this.stack.env).mml()
				);
				i = ({ l: mml.ALIGN.LEFT, r: mml.ALIGN.RIGHT, "": "" })[i];
				if (i == null) {
					tex.Error(["IllegalAlign", "Illegal alignment specified in %1", l]);
				}
				if (i) { j.numalign = j.denomalign = i }
				this.Push(j);
			},
			Genfrac: function (j, l, q, n, i) {
				if (l == null) { l = this.GetDelimiterArg(j) }
				if (q == null) { q = this.GetDelimiterArg(j) }
				if (n == null) { n = this.GetArgument(j) }
				if (i == null) { i = this.trimSpaces(this.GetArgument(j)) }
				var m = this.ParseArg(j);
				var p = this.ParseArg(j);
				var k = mml.mfrac(m, p);
				if (n !== "") { k.linethickness = n }
				if (l || q) {
					k = tex.fixedFence(l, k.With({ texWithDelims: true }), q);
				}
				if (i !== "") {
					var o = (["D", "T", "S", "SS"])[i];
					if (o == null) {
						tex.Error(["BadMathStyleFor", "Bad math style for %1", j]);
					}
					k = mml.mstyle(k);
					if (o === "D") {
						k.displaystyle = true;
						k.scriptlevel = 0;
					} else {
						k.displaystyle = false;
						k.scriptlevel = i - 1;
					}
				}
				this.Push(k);
			},
			Multline: function (j, i) {
				this.Push(j);
				this.checkEqnEnv();
				return stackItem.multline(i, this.stack).With({
					arraydef: {
						displaystyle: true,
						rowspacing: ".5em",
						width: tex.config.MultLineWidth,
						columnwidth: "100%",
						side: tex.config.TagSide,
						minlabelspacing: tex.config.TagIndent
					}
				});
			},
			AMSarray: function (k, j, i, m, l) {
				this.Push(k); if (i) { this.checkEqnEnv() }
				m = m.replace(/[^clr]/g, "").split("").join(" ");
				m = m.replace(/l/g, "left").replace(/r/g, "right").replace(/c/g, "center");
				return stackItem.AMSarray(k.name, j, i, this.stack).With({
					arraydef: {
						displaystyle: true,
						rowspacing: ".5em",
						columnalign: m,
						columnspacing: (l || "1em"),
						rowspacing: "3pt",
						side: tex.config.TagSide,
						minlabelspacing: tex.config.TagIndent
					}
				});
			},
			AlignedAMSArray: function (i) {
				var j = this.GetBrackets("\\begin{" + i.name + "}");
				return this.setArrayAlign(this.AMSarray.apply(this, arguments), j);
			},
			AlignAt: function (l, j, i) {
				var q, k, p = "", o = [];
				if (!i) {
					k = this.GetBrackets("\\begin{" + l.name + "}");
				}
				q = this.GetArgument("\\begin{" + l.name + "}");
				if (q.match(/[^0-9]/)) {
					tex.Error(["PositiveIntegerArg", "Argument to %1 must me a positive integer", "\\begin{" + l.name + "}"]);
				}
				while (q > 0) {
					p += "rl";
					o.push("0em 0em");
					q--;
				}
				o = o.join(" ");
				if (i) { return this.AMSarray(l, j, i, p, o) }
				var m = this.AMSarray(l, j, i, p, o);
				return this.setArrayAlign(m, k);
			},
			EquationBegin: function (i, j) {
				this.checkEqnEnv();
				this.stack.global.forcetag = (j && a.autoNumber !== "none");
				return i;
			},
			EquationStar: function (_i, j) {
				this.stack.global.tagged = true;
				return j;
			},
			checkEqnEnv: function () {
				if (this.stack.global.eqnenv) {
					tex.Error(["ErroneousNestingEq", "Erroneous nesting of equation structures"]);
				}
				this.stack.global.eqnenv = true;
			},
			MultiIntegral: function (j, m) {
				var l = this.GetNext();
				if (l === "\\") {
					var k = this.i;
					l = this.GetArgument(j);
					this.i = k;
					if (l === "\\limits") {
						if (j === "\\idotsint") {
							m = "\\!\\!\\mathop{\\,\\," + m + "}";
						} else {
							m = "\\!\\!\\!\\mathop{\\,\\,\\," + m + "}";
						}
					}
				}
				this.string = m + " " + this.string.slice(this.i);
				this.i = 0;
			},
			xArrow: function (k, o, n, i) {
				var m = { width: "+" + (n + i) + "mu", lspace: n + "mu" };
				var p = this.GetBrackets(k), q = this.ParseArg(k);
				var s = mml.mo(mml.chars(String.fromCharCode(o))).With({ stretchy: true, texClass: mml.TEXCLASS.REL });
				var j = mml.munderover(s);
				j.SetData(j.over, mml.mpadded(q).With(m).With({ voffset: ".15em" }));
				if (p) {
					p = tex.Parse(p, this.stack.env).mml();
					j.SetData(j.under, mml.mpadded(p).With(m).With({ voffset: "-.24em" }));
				}
				this.Push(j.With({ subsupOK: true }));
			},
			GetDelimiterArg: function (i) {
				var j = this.trimSpaces(this.GetArgument(i));
				if (j == "") { return null }
				if (j in d.delimiter) { return j }
				tex.Error(["MissingOrUnrecognizedDelim", "Missing or unrecognized delimiter for %1", i]);
			},
			GetStar: function () {
				var i = (this.GetNext() === "*");
				if (i) { this.i++ }
				return i;
			}
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
			g.refs = [];
			g.refUpdate = false;
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

function AMSsymbols() {
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
				dotplus: "2214",
				ltimes: "22C9",
				smallsetminus: "2216",
				rtimes: "22CA",
				Cap: "22D2",
				doublecap: "22D2",
				leftthreetimes: "22CB",
				Cup: "22D3",
				doublecup: "22D3",
				rightthreetimes: "22CC",
				barwedge: "22BC",
				curlywedge: "22CF",
				veebar: "22BB",
				curlyvee: "22CE",
				doublebarwedge: "2A5E",
				boxminus: "229F",
				circleddash: "229D",
				boxtimes: "22A0",
				circledast: "229B",
				boxdot: "22A1",
				circledcirc: "229A",
				boxplus: "229E",
				centerdot: ["22C5", { variantForm: true }],
				divideontimes: "22C7",
				intercal: "22BA",
				leqq: "2266",
				geqq: "2267",
				leqslant: "2A7D",
				geqslant: "2A7E",
				eqslantless: "2A95",
				eqslantgtr: "2A96",
				lesssim: "2272",
				gtrsim: "2273",
				lessapprox: "2A85",
				gtrapprox: "2A86",
				approxeq: "224A",
				lessdot: "22D6",
				gtrdot: "22D7",
				lll: "22D8",
				llless: "22D8",
				ggg: "22D9",
				gggtr: "22D9",
				lessgtr: "2276",
				gtrless: "2277",
				lesseqgtr: "22DA",
				gtreqless: "22DB",
				lesseqqgtr: "2A8B",
				gtreqqless: "2A8C",
				doteqdot: "2251",
				Doteq: "2251",
				eqcirc: "2256",
				risingdotseq: "2253",
				circeq: "2257",
				fallingdotseq: "2252",
				triangleq: "225C",
				backsim: "223D",
				thicksim: ["223C", { variantForm: true }],
				backsimeq: "22CD",
				thickapprox: ["2248", { variantForm: true }],
				subseteqq: "2AC5",
				supseteqq: "2AC6",
				Subset: "22D0",
				Supset: "22D1",
				sqsubset: "228F",
				sqsupset: "2290",
				preccurlyeq: "227C",
				succcurlyeq: "227D",
				curlyeqprec: "22DE",
				curlyeqsucc: "22DF",
				precsim: "227E",
				succsim: "227F",
				precapprox: "2AB7",
				succapprox: "2AB8",
				vartriangleleft: "22B2",
				lhd: "22B2",
				vartriangleright: "22B3",
				rhd: "22B3",
				trianglelefteq: "22B4",
				unlhd: "22B4",
				trianglerighteq: "22B5",
				unrhd: "22B5",
				vDash: "22A8",
				Vdash: "22A9",
				Vvdash: "22AA",
				smallsmile: ["2323", { variantForm: true }],
				shortmid: ["2223", { variantForm: true }],
				smallfrown: ["2322", { variantForm: true }],
				shortparallel: ["2225", { variantForm: true }],
				bumpeq: "224F",
				between: "226C",
				Bumpeq: "224E",
				pitchfork: "22D4",
				varpropto: "221D",
				backepsilon: "220D",
				blacktriangleleft: "25C2",
				blacktriangleright: "25B8",
				therefore: "2234",
				because: "2235",
				eqsim: "2242",
				vartriangle: ["25B3", { variantForm: true }],
				Join: "22C8",
				nless: "226E",
				ngtr: "226F",
				nleq: "2270",
				ngeq: "2271",
				nleqslant: ["2A87", { variantForm: true }],
				ngeqslant: ["2A88", { variantForm: true }],
				nleqq: ["2270", { variantForm: true }],
				ngeqq: ["2271", { variantForm: true }],
				lneq: "2A87",
				gneq: "2A88",
				lneqq: "2268",
				gneqq: "2269",
				lvertneqq: ["2268", { variantForm: true }],
				gvertneqq: ["2269", { variantForm: true }],
				lnsim: "22E6",
				gnsim: "22E7",
				lnapprox: "2A89",
				gnapprox: "2A8A",
				nprec: "2280",
				nsucc: "2281",
				npreceq: ["22E0", { variantForm: true }],
				nsucceq: ["22E1", { variantForm: true }],
				precneqq: "2AB5",
				succneqq: "2AB6",
				precnsim: "22E8",
				succnsim: "22E9",
				precnapprox: "2AB9",
				succnapprox: "2ABA",
				nsim: "2241",
				ncong: "2246",
				nshortmid: ["2224", { variantForm: true }],
				nshortparallel: ["2226", { variantForm: true }],
				nmid: "2224",
				nparallel: "2226",
				nvdash: "22AC",
				nvDash: "22AD",
				nVdash: "22AE",
				nVDash: "22AF",
				ntriangleleft: "22EA",
				ntriangleright: "22EB",
				ntrianglelefteq: "22EC",
				ntrianglerighteq: "22ED",
				nsubseteq: "2288",
				nsupseteq: "2289",
				nsubseteqq: ["2288", { variantForm: true }],
				nsupseteqq: ["2289", { variantForm: true }],
				subsetneq: "228A",
				supsetneq: "228B",
				varsubsetneq: ["228A", { variantForm: true }],
				varsupsetneq: ["228B", { variantForm: true }],
				subsetneqq: "2ACB",
				supsetneqq: "2ACC",
				varsubsetneqq: ["2ACB", { variantForm: true }],
				varsupsetneqq: ["2ACC", { variantForm: true }],
				leftleftarrows: "21C7",
				rightrightarrows: "21C9",
				leftrightarrows: "21C6",
				rightleftarrows: "21C4",
				Lleftarrow: "21DA",
				Rrightarrow: "21DB",
				twoheadleftarrow: "219E",
				twoheadrightarrow: "21A0",
				leftarrowtail: "21A2",
				rightarrowtail: "21A3",
				looparrowleft: "21AB",
				looparrowright: "21AC",
				leftrightharpoons: "21CB",
				rightleftharpoons: ["21CC", { variantForm: true }],
				curvearrowleft: "21B6",
				curvearrowright: "21B7",
				circlearrowleft: "21BA",
				circlearrowright: "21BB",
				Lsh: "21B0",
				Rsh: "21B1",
				upuparrows: "21C8",
				downdownarrows: "21CA",
				upharpoonleft: "21BF",
				upharpoonright: "21BE",
				downharpoonleft: "21C3",
				restriction: "21BE",
				multimap: "22B8",
				downharpoonright: "21C2",
				leftrightsquigarrow: "21AD",
				rightsquigarrow: "21DD",
				leadsto: "21DD",
				dashrightarrow: "21E2",
				dashleftarrow: "21E0",
				nleftarrow: "219A",
				nrightarrow: "219B",
				nLeftarrow: "21CD",
				nRightarrow: "21CF",
				nleftrightarrow: "21AE",
				nLeftrightarrow: "21CE"
			},
			delimiter: {
				"\\ulcorner": "231C",
				"\\urcorner": "231D",
				"\\llcorner": "231E",
				"\\lrcorner": "231F"
			},
			macros: {
				implies: ["Macro", "\\;\\Longrightarrow\\;"],
				impliedby: ["Macro", "\\;\\Longleftarrow\\;"]
			}
		}, null, true);
		var c = a.mo.OPTYPES.REL;
		MathJax.Hub.Insert(a.mo.prototype, {
			OPTABLE: {
				infix: {
					"\u2322": c,
					"\u2323": c,
					"\u25B3": c,
					"\uE006": c,
					"\uE007": c,
					"\uE00C": c,
					"\uE00D": c,
					"\uE00E": c,
					"\uE00F": c,
					"\uE010": c,
					"\uE011": c,
					"\uE016": c,
					"\uE017": c,
					"\uE018": c,
					"\uE019": c,
					"\uE01A": c,
					"\uE01B": c,
					"\uE04B": c,
					"\uE04F": c
				}
			}
		});
		MathJax.Hub.Startup.signal.Post("TeX AMSsymbols Ready");
	});
	MathJax.Ajax.loadComplete("[MathJax]/extensions/TeX/AMSsymbols.js");
}
