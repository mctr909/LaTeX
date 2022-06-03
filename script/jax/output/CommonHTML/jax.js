(function (ajax, hub, htmlJax, htmlCmn) {
	var mml;
	var m, b, d;
	var e = 1, q = 0.1, k = 0.025, a = 0.025;
	var styleList = {
		".mjx-chtml": {
			display: "inline-block",
			"line-height": 0,
			"text-indent": 0,
			"text-align": "left",
			"text-transform": "none",
			"font-style": "normal",
			"font-weight": "normal",
			"font-size": "100%",
			"font-size-adjust": "none",
			"letter-spacing": "normal",
			"word-wrap": "normal",
			"word-spacing": "normal",
			"white-space": "nowrap",
			"float": "none",
			direction: "ltr",
			"max-width": "none",
			"max-height": "none",
			"min-width": 0,
			"min-height": 0,
			border: 0,
			margin: 0,
			padding: "1px 0"
		},
		".MJXc-display": {
			display: "block",
			"text-align": "center",
			margin: "1em 0",
			padding: 0
		},
		".mjx-chtml[tabindex]:focus, body :focus .mjx-chtml[tabindex]": {
			display: "inline-table"
		},
		".mjx-full-width": {
			"text-align": "center",
			display: "table-cell!important",
			width: "10000em"
		},
		".mjx-math": {
			display: "inline-block",
			"border-collapse": "separate",
			"border-spacing": 0,
		},
		".mjx-math *": {
			display: "inline-block",
			"-webkit-box-sizing": "content-box!important",
			"-moz-box-sizing": "content-box!important",
			"box-sizing": "content-box!important",
			"text-align": "left"
		},
		".mjx-numerator": {
			display: "block",
			"text-align": "center"
		},
		".mjx-denominator": {
			display: "block",
			"text-align": "center"
		},
		".MJXc-stacked": {
			height: 0,
			position: "relative"
		},
		".MJXc-stacked > *": {
			position: "absolute"
		},
		".MJXc-bevelled > *": {
			display: "inline-block"
		},
		".mjx-stack": {
			display: "inline-block"
		},
		".mjx-op": {
			display: "block"
		},
		".mjx-under": {
			display: "table-cell"
		},
		".mjx-over": {
			display: "block"
		},
		".mjx-over > *": {
			"padding-left": "0px!important",
			"padding-right": "0px!important"
		},
		".mjx-under > *": {
			"padding-left": "0px!important",
			"padding-right": "0px!important"
		},
		".mjx-stack > .mjx-sup": {
			display: "block"
		},
		".mjx-stack > .mjx-sub": {
			display: "block"
		},
		".mjx-prestack > .mjx-presup": {
			display: "block"
		},
		".mjx-prestack > .mjx-presub": {
			display: "block"
		},
		".mjx-delim-h > .mjx-char": {
			display: "inline-block"
		},
		".mjx-surd": { "vertical-align": "top" },
		".mjx-mphantom *": { visibility: "hidden" },
		".mjx-merror": {
			"background-color": "#FFFF88",
			color: "#CC0000",
			border: "1px solid #CC0000",
			padding: "2px 3px",
			"font-style": "normal",
			"font-size": "90%"
		},
		".mjx-annotation-xml": { "line-height": "normal" },
		".mjx-menclose > svg": { fill: "none", stroke: "currentColor" },
		".mjx-mtr": { display: "table-row" },
		".mjx-mlabeledtr": { display: "table-row" },
		".mjx-mtd": { display: "table-cell", "text-align": "center" },
		".mjx-label": { display: "table-row" },
		".mjx-box": { display: "inline-block" },
		".mjx-block": { display: "block" },
		".mjx-span": { display: "inline" },
		".mjx-char": {
			display: "block",
			"white-space": "pre"
		},
		".mjx-itable": { display: "inline-table", width: "auto" },
		".mjx-row": { display: "table-row" },
		".mjx-cell": { display: "table-cell" },
		".mjx-table": { display: "table", width: "100%" },
		".mjx-line": { display: "block", height: 0 },
		".mjx-strut": { width: 0, "padding-top": e + "em" },
		".mjx-vsize": { width: 0 },
		".MJXc-space1": { "margin-left": ".167em" },
		".MJXc-space2": { "margin-left": ".222em" },
		".MJXc-space3": { "margin-left": ".278em" },
		".mjx-chartest": {
			display: "block",
			visibility: "hidden",
			position: "absolute",
			top: 0,
			"line-height": "normal",
			"font-size": "500%"
		},
		".mjx-chartest .mjx-char": { display: "inline" },
		".mjx-chartest .mjx-box": { "padding-top": "1000px" },
		".MJXc-processing": {
			visibility: "hidden",
			position: "fixed",
			width: 0,
			height: 0,
			overflow: "hidden"
		},
		".MJXc-processed": { display: "none" },
		".mjx-test": {
			display: "block",
			"font-style": "normal",
			"font-weight": "normal",
			"font-size": "100%",
			"font-size-adjust": "none",
			"text-indent": 0,
			"text-transform": "none",
			"letter-spacing": "normal",
			"word-spacing": "normal",
			overflow: "hidden",
			height: "1px"
		},
		".mjx-ex-box-test": {
			position: "absolute",
			width: "1px",
			height: "60ex"
		},
		".mjx-line-box-test": { display: "table!important" },
		".mjx-line-box-test span": {
			display: "table-cell!important",
			width: "10000em!important",
			"min-width": 0,
			"max-width": "none",
			padding: 0,
			border: 0,
			margin: 0
		},
		"#MathJax_CHTML_Tooltip": {
			"background-color": "InfoBackground",
			color: "InfoText",
			border: "1px solid black",
			"box-shadow": "2px 2px 5px #AAAAAA",
			"-webkit-box-shadow": "2px 2px 5px #AAAAAA",
			"-moz-box-shadow": "2px 2px 5px #AAAAAA",
			"-khtml-box-shadow": "2px 2px 5px #AAAAAA",
			padding: "3px 4px",
			"z-index": 401,
			position: "absolute",
			left: 0,
			top: 0,
			width: "auto",
			height: "auto",
			display: "none"
		}
	};
	var n = 1000000;
	var line = {}, hubConfig = MathJax.Hub.config;

	htmlCmn.Augment({
		settings: hub.config.menuSettings,
		config: { styles: styleList },
		defaultEmDelay: 100,
		defaultEmTimeout: 1000,
		HTMLElement: htmlJax.Element,
		ucMatch: htmlJax.ucMatch,
		setScript: htmlJax.setScript,
		ID: 0,
		idPostfix: "",
		pxPerInch: 96,
		em: 16,
		maxStretchyParts: 1000,
		removeStyles: ["fontSize", "fontFamily", "fontWeight", "fontStyle", "fontVariant", "font"],

		MATHSPACE: {
			veryverythinmathspace: 1 / 18,
			verythinmathspace: 2 / 18,
			thinmathspace: 3 / 18,
			mediummathspace: 4 / 18,
			thickmathspace: 5 / 18,
			verythickmathspace: 6 / 18,
			veryverythickmathspace: 7 / 18,
			negativeveryverythinmathspace: -1 / 18,
			negativeverythinmathspace: -2 / 18,
			negativethinmathspace: -3 / 18,
			negativemediummathspace: -4 / 18,
			negativethickmathspace: -5 / 18,
			negativeverythickmathspace: -6 / 18,
			negativeveryverythickmathspace: -7 / 18,
			thin: 0.04,
			medium: 0.06,
			thick: 0.1,
			infinity: n
		},
		SPACECLASS: {
			thinmathspace: "MJXc-space1",
			mediummathspace: "MJXc-space2",
			thickmathspace: "MJXc-space3"
		},
		FONTDEF: {},
		TEXDEF: {
			x_height: 0.442,
			quad: 1,
			num1: 0.676508,
			num2: 0.393732,
			num3: 0.44373,
			denom1: 0.685951,
			denom2: 0.344841,
			sup1: 0.412892,
			sup2: 0.362892,
			sup3: 0.288888,
			sub1: 0.15,
			sub2: 0.247217,
			sup_drop: 0.386108,
			sub_drop: 0.05,
			delim1: 2.39,
			delim2: 1,
			axis_height: 0.25,
			rule_thickness: 0.06,
			big_op_spacing1: 0.111111,
			big_op_spacing2: 0.166666,
			big_op_spacing3: 0.2,
			big_op_spacing4: 0.45,
			big_op_spacing5: 0.1,
			surd_height: 0.075,
			scriptspace: 0.05,
			nulldelimiterspace: 0.12,
			delimiterfactor: 901,
			delimitershortfall: 0.3,
			min_rule_thickness: 1.25
		},
		charList: {
			"char": function (u, t, x, v, r) {
				var s = u.font;
				if (v.className && s.className !== v.className) {
					this.flushText(t, v);
				}
				if (!v.a) {
					v.a = s.centerline / 1000;
				}
				if (v.a > (x.a || 0)) { x.a = v.a }
				var w = s[u.n];
				v.text += w.c;
				v.className = s.className;
				if (x.h < w[0] + k) {
					x.t = x.h = w[0] + k
				}
				if (x.d < w[1] + a) {
					x.b = x.d = w[1] + a;
				}
				if (x.l > x.w + w[3]) { x.l = x.w + w[3] }
				if (x.r < x.w + w[4]) { x.r = x.w + w[4] }
				x.w += w[2] * (u.rscale || 1);
				if (r == 1 && s.skew && s.skew[u.n]) { x.skew = s.skew[u.n] }
				if (w[5].rfix) {
					this.flushText(t, v).style.marginRight = htmlCmn.Em(w[5].rfix / 1000);
				}
			},
			space: function (s, r, u, t) {
				if (s.w) {
					if (t.text === "") {
						t.className = s.font.className;
					}
					this.flushText(r, t).style.marginRight = htmlCmn.Em(s.w);
					u.w += s.w;
				}
			},
			unknown: function (s, r, v, t) {
				(this["char"])(s, r, v, t, 0);
				var u = s.font[s.n];
				if (u[5].a) {
					t.a = u[5].a;
					if (v.a == null || t.a > v.a) { v.a = t.a }
				}
				r = this.flushText(r, t, s.style);
				r.style.width = htmlCmn.Em(u[2]);
			},
			flushText: function (s, t, r) {
				s = htmlCmn.addElement(s, "mjx-charbox", {
					className: t.className,
					style: r
				}, [t.text]);
				if (t.a) {
					s.style.paddingBottom = htmlCmn.Em(t.a)
				}
				t.text = "";
				t.className = null;
				t.a = 0;
				t.flushed = true;
				return s;
			}
		},

		Config: function () {
			if (!this.require) { this.require = [] }
			this.SUPER(arguments).Config.call(this);
			var r = this.settings;
			if (r.scale) { this.config.scale = r.scale }
			this.require.push(this.fontDir + "/TeX/fontdata.js");
			this.require.push(MathJax.OutputJax.extensionDir + "/MathEvents.js");
			line = this.config.linebreaks;
		},
		Startup: function () {
			m = MathJax.Extension.MathEvents.Event;
			b = MathJax.Extension.MathEvents.Touch;
			d = MathJax.Extension.MathEvents.Hover;
			this.ContextMenu = m.ContextMenu;
			this.Mousedown = m.AltContextMenu;
			this.Mouseover = d.Mouseover;
			this.Mouseout = d.Mouseout;
			this.Mousemove = d.Mousemove;
			var r = htmlCmn.addElement(document.body, "mjx-block", { style: { display: "block", width: "5in" } });
			this.pxPerInch = r.offsetWidth / 5; r.parentNode.removeChild(r);
			this.TestSpan = htmlCmn.Element("mjx-test", { style: { left: "1em" } }, [["mjx-ex-box-test"]]);
			this.linebreakSpan = htmlJax.Element("span", { className: "mjx-line-box-test" }, [["span"]]);
			return ajax.Styles(this.config.styles, ["InitializeCHTML", this]);
		},
		InitializeCHTML: function () {
			this.getDefaultExEm();
			if (this.defaultEm) { return }
			var r = MathJax.Callback();
			ajax.timer.start(ajax, function (s) {
				if (s.time(r)) {
					hub.signal.Post(["CommonHTML Jax - no default em size"]);
					return;
				}
				htmlCmn.getDefaultExEm();
				if (htmlCmn.defaultEm) {
					r();
				} else {
					setTimeout(s, s.delay);
				}
			}, this.defaultEmDelay, this.defaultEmTimeout);
			return r;
		},
		getDefaultExEm: function () {
			document.body.appendChild(this.TestSpan);
			document.body.appendChild(this.linebreakSpan);
			this.defaultEm = this.getFontSize(this.TestSpan);
			this.defaultEx = this.TestSpan.firstChild.offsetHeight / 60;
			this.defaultWidth = this.linebreakSpan.firstChild.offsetWidth;
			document.body.removeChild(this.linebreakSpan);
			document.body.removeChild(this.TestSpan);
		},
		getFontSize: (window.getComputedStyle ? function (s) {
			var r = window.getComputedStyle(s);
			return parseFloat(r.fontSize);
		} : function (r) { return r.style.pixelLeft }),
		getMaxWidth: (window.getComputedStyle ? function (s) {
			var r = window.getComputedStyle(s);
			if (r.maxWidth !== "none") { return parseFloat(r.maxWidth) }
			return 0;
		} : function (s) {
			var r = s.currentStyle.maxWidth;
			if (r !== "none") {
				if (r.match(/\d*px/)) { return parseFloat(r) }
				var t = s.style.left;
				s.style.left = r;
				r = s.style.pixelLeft;
				s.style.left = t;
				return r;
			}
			return 0;
		}),
		loadFont: function (r) {
			hub.RestartAfter(ajax.Require(this.fontDir + "/" + r))
		},
		fontLoaded: function (r) {
			if (!r.match(/-|fontdata/)) { r += "-Regular" }
			if (!r.match(/\.js$/)) { r += ".js" }
			new QUEUE(
				["Post", hub.Startup.signal, ["CommonHTML - font data loaded", r]],
				["loadComplete", ajax, this.fontDir + "/" + r]
			);
		},
		Element: function (r, t, s) {
			if (r.substr(0, 4) === "mjx-") {
				if (!t) { t = {} }
				if (t.isMathJax == null) { t.isMathJax = true }
				if (t.className) {
					t.className = r + " " + t.className;
				} else {
					t.className = r;
				}
				r = "span";
			}
			return this.HTMLElement(r, t, s);
		},
		addElement: function (t, r, u, s) {
			return t.appendChild(this.Element(r, u, s));
		},
		getNode: function (v, u) {
			var s = RegExp("\\b" + u + "\\b");
			while (v) {
				for (var t = 0, r = v.childNodes.length; t < r; t++) {
					var w = v.childNodes[t];
					if (s.test(w.className)) { return w }
				}
				v = (v.firstChild && (v.firstChild.id || "") === "" ? v.firstChild : null);
			}
			return null;
		},
		preTranslate: function (v) {
			var u = v.jax[this.id], E, A = u.length, H, y, B, F, D, s, G, r;
			var x = 100000, w = false, C = 0, t = line.automatic, z = line.width;
			if (t) {
				w = !!z.match(/^\s*(\d+(\.\d*)?%\s*)?container\s*$/);
				if (w) {
					z = z.replace(/\s*container\s*/, "");
				} else {
					x = this.defaultWidth;
				}
				if (z === "") { z = "100%" }
			}
			for (E = 0; E < A; E++) {
				H = u[E];
				if (!H.parentNode) { continue }
				y = H.previousSibling;
				if (y && y.className && String(y.className).substr(0, 9) === "mjx-chtml") { y.parentNode.removeChild(y) }
				if (H.MathJax.preview) { H.MathJax.preview.style.display = "none" }
				s = H.MathJax.elementJax;
				if (!s) { continue }
				s.CHTML = {
					display: (s.root.Get("display") === "block"),
					preview: (s.CHTML || {}).preview
				};
				B = htmlCmn.Element("mjx-chtml", {
					id: s.inputID + "-Frame",
					className: "MathJax_CHTML",
					isMathJax: true,
					jaxID: this.id,
					oncontextmenu: m.Menu,
					onmousedown: m.Mousedown,
					onmouseover: m.Mouseover,
					onmouseout: m.Mouseout,
					onmousemove: m.Mousemove,
					onclick: m.Click,
					ondblclick: m.DblClick,
					onkeydown: m.Keydown,
					tabIndex: hub.getTabOrder(s)
				});
				if (s.CHTML.display) {
					var I = htmlCmn.Element("mjx-chtml", {
						className: "MJXc-display",
						isMathJax: false
					});
					I.appendChild(B);
					B = I;
				}
				if (hub.Browser.noContextMenu) {
					B.ontouchstart = b.start;
					B.ontouchend = b.end;
				}
				B.className += " MJXc-processing";
				H.parentNode.insertBefore(B, H);
				H.parentNode.insertBefore(this.linebreakSpan.cloneNode(true), H);
				H.parentNode.insertBefore(this.TestSpan.cloneNode(true), H);
			}
			for (E = 0; E < A; E++) {
				H = u[E];
				if (!H.parentNode) { continue }
				F = H.previousSibling;
				s = H.MathJax.elementJax;
				if (!s) { continue }
				r = htmlCmn.getFontSize(F);
				G = F.firstChild.offsetHeight / 60;
				C = Math.max(0, F.previousSibling.firstChild.offsetWidth - 2);
				if (G === 0 || G === "NaN") {
					G = this.defaultEx;
					C = this.defaultWidth;
				}
				if (w) { x = C }
				scale = (this.config.matchFontHeight ? G / this.TEX.x_height / r : 1);
				scale = Math.floor(Math.max(this.config.minScaleAdjust / 100, scale) * this.config.scale);
				s.CHTML.scale = scale / 100;
				s.CHTML.fontSize = scale + "%";
				s.CHTML.outerEm = r;
				s.CHTML.em = this.em = r * scale / 100;
				s.CHTML.ex = G;
				s.CHTML.cwidth = C / this.em;
				s.CHTML.lineWidth = (t ? this.length2em(z, x / this.em, 1) : x);
			}
			for (E = 0; E < A; E++) {
				H = u[E];
				if (!H.parentNode) { continue }
				F = H.previousSibling;
				D = F.previousSibling;
				s = H.MathJax.elementJax;
				if (!s) { continue }
				D.parentNode.removeChild(D);
				F.parentNode.removeChild(F);
				if (H.MathJax.preview) { H.MathJax.preview.style.display = "" }
			}
			v.CHTMLeqn = v.CHTMLlast = 0;
			v.CHTMLi = -1;
			v.CHTMLchunk = this.config.EqnChunk;
			v.CHTMLdelay = false;
		},
		Translate: function (s, w) {
			if (!s.parentNode) { return }
			if (w.CHTMLdelay) {
				w.CHTMLdelay = false;
				hub.RestartAfter(MathJax.Callback.Delay(this.config.EqnChunkDelay));
			}
			var r = s.MathJax.elementJax, v = r.root, u = document.getElementById(r.inputID + "-Frame");
			if (!u) { return }
			this.getMetrics(r);
			if (this.scale !== 1) {
				u.style.fontSize = r.CHTML.fontSize;
			}
			this.initCHTML(v, u);
			this.savePreview(s);
			this.CHTMLnode = u;
			try {
				v.setTeXclass(); v.toCommonHTML(u)
			} catch (t) {
				while (u.firstChild) { u.removeChild(u.firstChild) }
				delete this.CHTMLnode;
				this.restorePreview(s);
				throw t;
			}
			delete this.CHTMLnode;
			this.restorePreview(s);
			if (r.CHTML.display) { u = u.parentNode }
			u.className = u.className.replace(/ [^ ]+$/, "");
			u.className += " MJXc-processed";
			if (s.MathJax.preview) {
				r.CHTML.preview = s.MathJax.preview;
				delete s.MathJax.preview
			}
			w.CHTMLeqn += (w.i - w.CHTMLi);
			w.CHTMLi = w.i;
			if (w.CHTMLeqn >= w.CHTMLlast + w.CHTMLchunk) {
				this.postTranslate(w);
				w.CHTMLchunk = Math.floor(w.CHTMLchunk * this.config.EqnChunkFactor);
				w.CHTMLdelay = true;
			}
		},
		initCHTML: function (s, r) { },
		savePreview: function (r) {
			var s = r.MathJax.preview;
			if (s && s.parentNode) {
				r.MathJax.tmpPreview = document.createElement("span");
				s.parentNode.replaceChild(r.MathJax.tmpPreview, s);
			}
		},
		restorePreview: function (r) {
			var s = r.MathJax.tmpPreview;
			if (s) {
				s.parentNode.replaceChild(r.MathJax.preview, s);
				delete r.MathJax.tmpPreview;
			}
		},
		getMetrics: function (r) {
			var s = r.CHTML;
			this.jax = r;
			this.em = s.em;
			this.outerEm = s.outerEm;
			this.scale = s.scale;
			this.cwidth = s.cwidth;
			this.linebreakWidth = s.lineWidth;
		},
		postTranslate: function (w) {
			var s = w.jax[this.id];
			for (var u = w.CHTMLlast, r = w.CHTMLeqn; u < r; u++) {
				var t = s[u];
				if (t && t.MathJax.elementJax) {
					t.previousSibling.className = t.previousSibling.className.replace(/ [^ ]+$/, "");
					var v = t.MathJax.elementJax.CHTML;
					if (v.preview) {
						v.preview.innerHTML = "";
						v.preview.style.display = "none";
						t.MathJax.preview = v.preview;
						delete v.preview;
					}
				}
			}
			w.CHTMLlast = w.CHTMLeqn;
		},
		getJaxFromMath: function (r) {
			if (r.parentNode.className.match(/MJXc-display/)) { r = r.parentNode }
			do { r = r.nextSibling }
			while (r && r.nodeName.toLowerCase() !== "script");
			return hub.getJaxFor(r);
		},
		getHoverSpan: function (r, s) {
			return r.root.CHTMLnodeElement();
		},
		getHoverBBox: function (r, u, v) {
			var w = r.root.CHTML, t = r.CHTML.outerEm;
			var s = { w: w.w * t, h: w.h * t, d: w.d * t };
			if (w.width) { s.width = w.width }
			return s;
		},
		Zoom: function (t, A, z, r, x) {
			this.getMetrics(t);
			var u = htmlCmn.addElement(A, "mjx-chtml", {
				style: { "font-size": Math.floor(htmlCmn.scale * 100) + "%" },
				isMathJax: false
			});
			htmlCmn.CHTMLnode = u;
			this.idPostfix = "-zoom";
			t.root.toCommonHTML(u);
			this.idPostfix = "";
			var s = u.style, B = t.root.CHTML;
			if (B.t > B.h) { s.marginTop = htmlCmn.Em(B.t - B.h) }
			if (B.b > B.d) { s.marginBottom = htmlCmn.Em(B.b - B.d) }
			if (B.l < 0) { s.paddingLeft = htmlCmn.Em(-B.l) }
			if (B.r > B.w) { s.marginRight = htmlCmn.Em(B.r - B.w) }
			s.position = "absolute";
			var y = u.offsetWidth,
				w = u.offsetHeight,
				C = z.firstChild.offsetHeight,
				v = z.firstChild.offsetWidth;
			u.style.position = "";
			return {
				Y: -m.getBBox(A).h,
				mW: v,
				mH: C,
				zW: y,
				zH: w
			};
		},
		Remove: function (r) {
			var s = document.getElementById(r.inputID + "-Frame");
			if (s && r.CHTML.display) { s = s.parentNode }
			if (s) { s.parentNode.removeChild(s) }
			delete r.CHTML;
		},
		GetID: function () {
			this.ID++;
			return this.ID;
		},
		unicodeChar: function (r) {
			if (r < 65535) {
				return String.fromCharCode(r);
			}
			r -= 65536;
			return String.fromCharCode((r >> 10) + 55296) + String.fromCharCode((r & 1023) + 56320);
		},
		getUnicode: function (r) {
			var s = r.text.charCodeAt(r.i);
			r.i++;
			if (s >= 55296 && s < 56319) {
				s = (((s - 55296) << 10) + (r.text.charCodeAt(r.i) - 56320)) + 65536;
				r.i++;
			}
			return s;
		},
		getCharList: function (v, u) {
			var t, A, y = [], s = v.cache, D = u;
			if (s[u]) { return s[u] }
			if (u > 65535 && this.FONTDATA.RemapPlane1) {
				var z = this.FONTDATA.RemapPlane1(u, v);
				u = z.n;
				v = z.variant;
			}
			var r = this.FONTDATA.RANGES, C = this.FONTDATA.VARIANT;
			if (u >= r[0].low && u <= r[r.length - 1].high) {
				for (t = 0, A = r.length; t < A; t++) {
					if (r[t].name === "alpha" && v.noLowerCase) { continue }
					var x = v["offset" + r[t].offset];
					if (x && u >= r[t].low && u <= r[t].high) {
						if (r[t].remap && r[t].remap[u]) {
							u = x + r[t].remap[u];
						} else {
							u = u - r[t].low + x;
							if (r[t].add) { u += r[t].add }
						}
						if (v["variant" + r[t].offset]) {
							v = C[v["variant" + r[t].offset]];
						}
						break;
					}
				}
			}
			if (v.remap && v.remap[u]) {
				u = v.remap[u];
				if (v.remap.variant) {
					v = C[v.remap.variant];
				}
			} else {
				if (this.FONTDATA.REMAP[u] && !v.noRemap) {
					u = this.FONTDATA.REMAP[u];
				}
			}
			if (MathJax.Object.isArray(u)) {
				v = C[u[1]];
				u = u[0];
			}
			if (typeof (u) === "string") {
				var w = {
					text: u,
					i: 0,
					length: u.length
				};
				while (w.i < w.length) {
					u = this.getUnicode(w);
					var B = this.getCharList(v, u);
					if (B) { y.push.apply(y, B) }
				}
			} else {
				if (v.cache[u]) {
					y = v.cache[u]
				} else {
					v.cache[u] = y = [this.lookupChar(v, u)];
				}
			}
			s[D] = y;
			return y;
		},
		lookupChar: function (u, x) {
			var w = u;
			while (u) {
				for (var t = 0, r = u.fonts.length; t < r; t++) {
					var s = this.FONTDATA.FONTS[u.fonts[t]];
					if (typeof (s) === "string") { this.loadFont(s) }
					var v = s[x];
					if (v) {
						if (v.length === 5) { v[5] = {} }
						if (v.c == null) {
							v[0] /= 1000;
							v[1] /= 1000;
							v[2] /= 1000;
							v[3] /= 1000;
							v[4] /= 1000;
							v.c = this.unicodeChar(x)
						}
						if (v[5].space) {
							return {
								type: "space",
								w: v[2],
								font: s
							}
						}
						return { type: "char", font: s, n: x };
					} else {
						if (s.Extra) {
							this.findBlock(s, x);
						}
					}
				}
				u = this.FONTDATA.VARIANT[u.chain];
			}
			return this.unknownChar(w, x);
		},
		findBlock: function (t, x) {
			var s = t.Extra, u = t.file, w;
			for (var v = 0, r = s.length; v < r; v++) {
				if (typeof (s[v]) === "number") {
					if (x === s[v]) {
						w = u;
						break;
					}
				} else {
					if (x < s[v][0]) { return }
					if (x <= s[v][1]) {
						w = u;
						break;
					}
				}
			}
			if (w) {
				delete t.Extra;
				this.loadFont(u);
			}
		},
		unknownChar: function (r, u) {
			hub.signal.Post(["CommonHTML Jax - unknown char", u, r]);
			var t = "";
			if (r.bold) { t += "B" }
			if (r.italic) { t += "I" }
			var s = this.FONTDATA.UNKNOWN[t || "R"];
			if (!s[u]) { this.getUnknownChar(s, u) }
			return { type: "unknown", n: u, font: s };
		},
		getUnknownChar: function (s, u) {
			var t = this.unicodeChar(u);
			var r = this.getHDW(t, s.className);
			s[u] = [0.8, 0.2, r.w, 0, r.w, {
				a: Math.max(0, (r.h - r.d) / 2),
				h: r.h,
				d: r.d
			}];
			s[u].c = t;
		},
		styledText: function (s, v) {
			hub.signal.Post(["CommonHTML Jax - styled text", v, s]);
			var t = s.style;
			var w = "_" + (t["font-family"] || s.className || "");
			if (t["font-weight"]) {
				w += "_" + t["font-weight"];
			}
			if (t["font-style"]) {
				w += "_" + t["font-style"];
			}
			if (!this.STYLEDTEXT) {
				this.STYLEDTEXT = {};
			}
			if (!this.STYLEDTEXT[w]) {
				this.STYLEDTEXT[w] = { className: s.className || "" };
			}
			var u = this.STYLEDTEXT[w];
			if (!u["_" + v]) {
				var r = this.getHDW(v, s.className || "", t);
				u["_" + v] = [0.8, 0.2, r.w, 0, r.w, {
					a: Math.max(0, (r.h - r.d) / 2),
					h: r.h,
					d: r.d
				}];
				u["_" + v].c = v;
			}
			return {
				type: "unknown",
				n: "_" + v,
				font: u,
				style: t,
				rscale: s.rscale
			};
		},
		getHDW: function (A, t, E) {
			var s = htmlCmn.addElement(
				htmlCmn.CHTMLnode,
				"mjx-chartest",
				{ className: t },
				[["mjx-char", { style: E }, [A]]]
			);
			var r = htmlCmn.addElement(
				htmlCmn.CHTMLnode,
				"mjx-chartest",
				{ className: t },
				[["mjx-char", { style: E }, [A, ["mjx-box"]]]]
			);
			s.firstChild.style.fontSize = r.firstChild.style.fontSize = "";
			var u = 5 * htmlCmn.em;
			var D = s.offsetHeight, B = r.offsetHeight, v = s.offsetWidth;
			htmlCmn.CHTMLnode.removeChild(s);
			htmlCmn.CHTMLnode.removeChild(r);
			if (B === 0) {
				u = 5 * htmlCmn.defaultEm;
				var z = document.body.appendChild(document.createElement("div"));
				z.appendChild(s);
				z.appendChild(r);
				D = s.offsetHeight, B = r.offsetHeight, v = s.offsetWidth;
				document.body.removeChild(z);
			}
			var y = (B - 1000) / u, C = v / u, x = D / u - y;
			return { h: x, d: y, w: C };
		},
		addCharList: function (u, w, x) {
			var v = { text: "", className: null, a: 0 };
			for (var s = 0, r = w.length; s < r; s++) {
				var t = w[s];
				if (this.charList[t.type]) {
					(this.charList[t.type])(t, u, x, v, r);
				}
			}
			if (v.text !== "") {
				if (u.childNodes.length) {
					this.charList.flushText(u, v)
				} else {
					htmlJax.addText(u, v.text);
					if (u.className) {
						u.className += " " + v.className;
					} else {
						u.className = v.className;
					}
				}
			}
			x.b = (v.flushed ? 0 : x.a);
		},
		handleText: function (t, w, s, v) {
			if (t.childNodes.length === 0) {
				htmlCmn.addElement(t, "mjx-char");
				v = htmlCmn.BBOX.empty(v);
			}
			if (typeof (s) === "string") {
				s = this.FONTDATA.VARIANT[s];
			}
			if (!s) {
				s = this.FONTDATA.VARIANT[mml.VARIANT.NORMAL];
			}
			var r = { text: w, i: 0, length: w.length }, u = [];
			if (s.style && r.length) {
				u.push(this.styledText(s, w));
			} else {
				while (r.i < r.length) {
					var x = this.getUnicode(r);
					u.push.apply(u, this.getCharList(s, x));
				}
			}
			if (u.length) { this.addCharList(t.firstChild, u, v) }
			v.clean();
			if (v.d < 0) { v.D = v.d; v.d = 0 }
			if (v.h - v.a) {
				t.firstChild.style[v.h - v.a < 0 ? "marginTop" : "paddingTop"] = this.EmRounded(v.h - v.a);
			}
			if (v.d > -v.b) {
				t.firstChild.style.paddingBottom = this.EmRounded(v.d + v.b);
			}
			return v;
		},
		createDelimiter: function (w, r, t, z, u) {
			if (!r) {
				var A = this.BBOX.zero();
				A.w = A.r = this.TEX.nulldelimiterspace;
				htmlCmn.addElement(w, "mjx-box", { style: { width: A.w } });
				return A;
			}
			if (!(t instanceof Array)) {
				t = [t, t];
			}
			var y = t[1];
			t = t[0];
			var s = { alias: r };
			while (s.alias) {
				r = s.alias;
				s = this.FONTDATA.DELIMITERS[r];
				if (!s) {
					s = { HW: [0, this.FONTDATA.VARIANT[mml.VARIANT.NORMAL]] };
				}
			}
			if (s.load) {
				hub.RestartAfter(ajax.Require(this.fontDir + "/TeX/fontdata-" + s.load + ".js"));
			}
			for (var x = 0, v = s.HW.length; x < v; x++) {
				if (s.HW[x][0] >= t - 0.01 || (x == v - 1 && !s.stretch)) {
					if (s.HW[x][3]) {
						r = s.HW[x][3];
					}
					A = this.createChar(w, [r, s.HW[x][1]], (s.HW[x][2] || 1), u);
					A.offset = 0.6 * A.w;
					if (z) {
						A.scale = z.scale;
						z.rscale = z.rscale;
					}
					return A;
				}
			}
			if (!s.stretch) { return A }
			return this["extendDelimiter" + s.dir](w, y, s.stretch, z, u);
		},
		extendDelimiterV: function (D, w, O, v, B) {
			D = htmlCmn.addElement(D, "mjx-delim-v");
			var M = htmlCmn.Element("span");
			var A, z, N, u, G, s, E, x, F = 1, L;
			G = this.createChar(M, (O.top || O.ext), 1, B);
			A = M.removeChild(M.firstChild);
			s = this.createChar(M, (O.bot || O.ext), 1, B);
			z = M.removeChild(M.firstChild);
			E = x = htmlCmn.BBOX.zero();
			var I = G.h + G.d + s.h + s.d - q;
			D.appendChild(A);
			if (O.mid) {
				E = this.createChar(M, O.mid, 1, B);
				N = M.removeChild(M.firstChild);
				I += E.h + E.d;
				F = 2;
			}
			if (O.min && w < I * O.min) {
				w = I * O.min;
			}
			if (w > I) {
				x = this.createChar(M, O.ext, 1, B);
				u = M.removeChild(M.firstChild);
				var K = x.h + x.d, t = K - q;
				var C = Math.min(Math.ceil((w - I) / (F * t)), this.maxStretchyParts);
				if (O.fullExtenders) {
					w = C * F * t + I;
				} else {
					t = (w - I) / (F * C);
				}
				L = x.d + x.a - K / 2;
				u.style.margin = u.style.padding = "";
				u.style.lineHeight = htmlCmn.Em(t);
				u.style.marginBottom = htmlCmn.Em(L - q / 2 / F);
				u.style.marginTop = htmlCmn.Em(-L - q / 2 / F);
				var J = u.textContent, y = "\n" + J;
				while (--C > 0) { J += y }
				u.textContent = J;
				D.appendChild(u);
				if (O.mid) {
					D.appendChild(N);
					D.appendChild(u.cloneNode(true));
				}
			} else {
				L = (w - I - q) / F;
				A.style.marginBottom = htmlCmn.Em(L + parseFloat(A.style.marginBottom || "0"));
				if (O.mid) { D.appendChild(N) }
				z.style.marginTop = htmlCmn.Em(L + parseFloat(z.style.marginTop || "0"));
			}
			D.appendChild(z);
			var r = htmlCmn.BBOX({
				w: Math.max(G.w, x.w, s.w, E.w),
				l: Math.min(G.l, x.l, s.l, E.l),
				r: Math.max(G.r, x.r, s.r, E.r),
				h: w - s.d,
				d: s.d,
				t: w - s.d,
				b: s.d
			});
			r.offset = 0.5 * r.w;
			if (v) {
				r.scale = v.scale;
				r.rscale = v.rscale;
			}
			return r;
		},
		extendDelimiterH: function (E, r, O, u, C) {
			E = htmlCmn.addElement(E, "mjx-delim-h");
			var M = htmlCmn.Element("span");
			var s, L, N, t, J, B, v, F, y, G = 1;
			B = this.createChar(M, (O.left || O.rep), 1, C);
			s = M.removeChild(M.firstChild);
			v = this.createChar(M, (O.right || O.rep), 1, C);
			L = M.removeChild(M.firstChild);
			y = this.createChar(M, O.rep, 1, C);
			t = M.removeChild(M.firstChild);
			s.style.marginLeft = htmlCmn.Em(-B.l);
			L.style.marginRight = htmlCmn.Em(v.r - v.w);
			E.appendChild(s);
			var P = htmlCmn.BBOX.zero();
			P.h = Math.max(B.h, v.h, y.h);
			P.d = Math.max(B.D || B.d, v.D || v.d, y.D || y.d);
			var x = (B.r - B.l) + (v.r - v.l) - q;
			if (O.mid) {
				F = this.createChar(M, O.mid, 1, C);
				N = M.removeChild(M.firstChild);
				N.style.marginleft = htmlCmn.Em(-F.l);
				N.style.marginRight = htmlCmn.Em(F.r - F.w);
				x += F.r - F.l + q;
				G = 2;
				if (F.h > P.h) { P.h = F.h }
				if (F.d > P.d) { P.d = F.d }
			}
			if (O.min && r < x * O.min) { r = x * O.min }
			P.w = P.r = r;
			if (r > x) {
				var A = y.r - y.l, I = A - q;
				var D = Math.min(Math.ceil((r - x) / (G * I)), this.maxStretchyParts);
				if (O.fullExtenders) {
					r = D * G * I + x;
				} else {
					I = (r - x) / (G * D);
				}
				var K = (A - I + q / G) / 2;
				t.style.marginLeft = htmlCmn.Em(-y.l - K);
				t.style.marginRight = htmlCmn.Em(y.r - y.w + K);
				t.style.letterSpacing = htmlCmn.Em(-(y.w - I));
				s.style.marginRight = htmlCmn.Em(B.r - B.w);
				L.style.marginleft = htmlCmn.Em(-v.l);
				var H = t.textContent, z = H;
				while (--D > 0) { H += z }
				t.textContent = H; E.appendChild(t);
				if (O.mid) {
					E.appendChild(N);
					J = E.appendChild(t.cloneNode(true));
				}
			} else {
				K = (r - x - q / G) / 2;
				s.style.marginRight = htmlCmn.Em(B.r - B.w + K);
				if (O.mid) { E.appendChild(N) }
				L.style.marginLeft = htmlCmn.Em(-v.l + K);
			}
			E.appendChild(L);
			this.adjustHeights([s, t, N, J, L], [B, y, F, y, v], P);
			if (u) {
				P.scale = u.scale;
				P.rscale = u.rscale;
			}
			return P;
		},
		adjustHeights: function (s, v, w) {
			var t = w.h, x = w.d;
			if (w.d < 0) {
				x = -w.d;
				w.D = w.d;
				w.d = 0;
			}
			for (var u = 0, r = s.length; u < r; u++) {
				if (s[u]) {
					s[u].style.paddingTop = htmlCmn.Em(t - v[u].a);
					s[u].style.paddingBottom = htmlCmn.Em(x + v[u].a);
					s[u].style.marginTop = s[u].style.marginBottom = 0;
				}
			}
		},
		createChar: function (t, x, v, s) {
			var A = "", w = {
				fonts: [x[1]],
				noRemap: true,
				cache: {}
			};
			if (s && s === mml.VARIANT.BOLD && this.FONTDATA.FONTS[x[1] + "-Bold"]) {
				w.fonts = [x[1] + "-Bold", x[1]];
			}
			if (typeof (x[1]) !== "string") { w = x[1] }
			if (x[0] instanceof Array) {
				for (var y = 0, u = x[0].length; y < u; y++) {
					A += String.fromCharCode(x[0][y]);
				}
			} else {
				A = String.fromCharCode(x[0]);
			}
			if (x[4]) { v *= x[4] }
			var z = this.handleText(t, A, w), r = t.firstChild.style;
			if (v !== 1) { r.fontSize = this.Percent(v) }
			if (x[2]) {
				r.paddingLeft = this.Em(x[2]);
				z.w += x[2];
				z.r += x[2];
			}
			if (x[3]) {
				r.verticalAlign = this.Em(x[3]);
				z.h += x[3];
				if (z.h < 0) { z.h = 0 }
			}
			if (x[5]) {
				r.marginTop = this.Em(x[5]);
				z.h += x[5];
				z.t += x[5];
			}
			if (x[6]) {
				r.marginBottom = this.Em(x[6]);
				z.d += x[6];
				z.b += x[6];
			}
			return z;
		},
		length2em: function (v, t, w) {
			if (typeof (v) !== "string") {
				v = v.toString();
			}
			if (v === "") { return "" }
			if (v === mml.SIZE.NORMAL) { return 1 }
			if (v === mml.SIZE.BIG) { return 2 }
			if (v === mml.SIZE.SMALL) { return 0.71 }
			if (this.MATHSPACE[v]) { return this.MATHSPACE[v] }
			var s = v.match(/^\s*([-+]?(?:\.\d+|\d+(?:\.\d*)?))?(pt|em|ex|mu|px|pc|in|mm|cm|%)?/);
			var r = parseFloat(s[1] || "1"), u = s[2];
			if (t == null) { t = 1 }
			if (!w) { w = 1 }
			w = 1 / this.em / w;
			if (u === "em") { return r }
			if (u === "ex") { return r * this.TEX.x_height }
			if (u === "%") { return r / 100 * t }
			if (u === "px") { return r * w }
			if (u === "pt") { return r / 10 }
			if (u === "pc") { return r * 1.2 }
			w *= this.pxPerInch;
			if (u === "in") { return r * w }
			if (u === "cm") { return r * w / 2.54 }
			if (u === "mm") { return r * w / 25.4 }
			if (u === "mu") { return r / 18 }
			return r * t;
		},
		thickness2em: function (r, s) {
			var t = htmlCmn.TEX.rule_thickness / (s || 1);
			if (r === mml.LINETHICKNESS.MEDIUM) { return t }
			if (r === mml.LINETHICKNESS.THIN) { return 0.67 * t }
			if (r === mml.LINETHICKNESS.THICK) { return 1.67 * t }
			return this.length2em(r, t, s);
		},
		Em: function (r) {
			if (Math.abs(r) < 0.001) { return "0" }
			return (r.toFixed(3).replace(/\.?0+$/, "")) + "em";
		},
		EmRounded: function (r) {
			r = (Math.round(r * htmlCmn.em) + 0.05) / htmlCmn.em;
			if (Math.abs(r) < 0.0006) { return "0em" }
			return r.toFixed(3).replace(/\.?0+$/, "") + "em";
		},
		unEm: function (r) {
			return parseFloat(r);
		},
		Px: function (r, s) {
			r *= this.em;
			if (s && r < s) { r = s }
			if (Math.abs(r) < 0.1) { return "0" }
			return r.toFixed(1).replace(/\.0$/, "") + "px";
		},
		Percent: function (r) {
			return (100 * r).toFixed(1).replace(/\.?0+$/, "") + "%";
		},
		Transform: function (u, s, r) {
			var t = u.style;
			t.transform = t.WebkitTransform = t.MozTransform = t["-ms-transform"] = s;
			if (r) {
				t.transformOrigin = t.WebkitTransformOrigin = t.MozTransformOrigin = t["-ms-transform-origin"] = r;
			}
		},
		arrayEntry: function (r, s) {
			return r[Math.max(0, Math.min(s, r.length - 1))]
		}
	});

	htmlCmn.BBOX = MathJax.Object.Subclass({
		Init: function (r) {
			for (var s in r) {
				if (r.hasOwnProperty(s)) { this[s] = r[s] }
			}
		},
		clean: function () {
			if (this.h === -n) { this.h = 0 }
			if (this.d === -n) { this.d = 0 }
			if (this.l === n) { this.l = 0 }
			if (this.r === -n) { this.r = 0 }
			if (this.t === -n) { this.t = 0 }
			if (this.b === -n) { this.b = 0 }
			if (this.D && this.d > 0) { delete this.D }
		},
		rescale: function (r) {
			this.w *= r;
			this.h *= r;
			this.d *= r;
			this.l *= r;
			this.r *= r;
			this.t *= r;
			this.b *= r;
			if (this.L) { this.L *= r }
			if (this.R) { this.R *= r }
			if (this.D) { this.D *= r }
		},
		combine: function (s, r, t) {
			s.X = r;
			s.Y = t;
			scale = s.rscale;
			if (r + scale * s.r > this.r) {
				this.r = r + scale * s.r;
			}
			if (r + scale * s.l < this.l) {
				this.l = r + scale * s.l;
			}
			if (r + scale * (s.w + (s.L || 0) + (s.R || 0)) > this.w) {
				this.w = r + scale * (s.w + (s.L || 0) + (s.R || 0));
			}
			if (t + scale * s.h > this.h) {
				this.h = t + scale * s.h;
			}
			if (s.D && (this.D == null || scale * s.D - t > this.D) && scale * s.D > this.d) {
				this.D = scale * s.D - t;
			} else {
				if (s.D == null && this.D) { delete this.D }
			}
			if (scale * s.d - t > this.d) { this.d = scale * s.d - t }
			if (t + scale * s.t > this.t) { this.t = t + scale * s.t }
			if (scale * s.b - t > this.b) { this.b = scale * s.b - t }
		},
		append: function (s) {
			scale = s.rscale;
			var r = this.w;
			if (r + scale * s.r > this.r) { this.r = r + scale * s.r }
			if (r + scale * s.l < this.l) { this.l = r + scale * s.l }
			this.w += scale * (s.w + (s.L || 0) + (s.R || 0));
			if (scale * s.h > this.h) { this.h = scale * s.h }
			if (s.D && (this.D == null || scale * s.D > this.D) && scale * s.D > this.d) {
				this.D = scale * s.D;
			} else {
				if (s.D == null && this.D) { delete this.D }
			}
			if (scale * s.d > this.d) { this.d = scale * s.d }
			if (scale * s.t > this.t) { this.t = scale * s.t }
			if (scale * s.b > this.b) { this.b = scale * s.b }
		},
		updateFrom: function (r) {
			this.h = r.h;
			this.d = r.d;
			this.w = r.w;
			this.r = r.r;
			this.l = r.l;
			this.t = r.t;
			this.b = r.b;
			if (r.pwidth) { this.pwidth = r.pwidth }
			if (r.D) {
				this.D = r.D;
			} else {
				delete this.D;
			}
		},
		adjust: function (s, r, u, t) {
			this[r] += htmlCmn.length2em(s, 1, this.scale);
			if (t == null) {
				if (this[r] > this[u]) { this[u] = this[r] }
			} else {
				if (this[u] < t) { this[u] = t }
			}
		}
	}, {
		zero: function () {
			return htmlCmn.BBOX({ h: 0, d: 0, w: 0, l: 0, r: 0, t: 0, b: 0, scale: 1, rscale: 1 });
		},
		empty: function (r) {
			if (!r) { r = htmlCmn.BBOX.zero() }
			r.h = r.d = r.r = r.t = r.b = -n; r.w = 0;
			r.l = n; delete r.pwidth;
			return r;
		},
		styleAdjust: [
			["borderTopWidth", "h", "t"],
			["borderRightWidth", "w", "r"],
			["borderBottomWidth", "d", "b"],
			["borderLeftWidth", "w", "l", 0],
			["paddingTop", "h", "t"],
			["paddingRight", "w", "r"],
			["paddingBottom", "d", "b"],
			["paddingLeft", "w", "l", 0],
		]
	});

	MathJax.Hub.Register.StartupHook("mml Jax Ready", function () {
		mml = MathJax.ElementJax.mml;
		mml.mbase.Augment({
			toCommonHTML: function (s, r) {
				return this.CHTMLdefaultNode(s, r);
			},
			CHTMLmultiline: function () {
				mml.mbase.CHTMLautoloadFile("multiline");
			},
			CHTMLdefaultNode: function (u, s) {
				if (!s) { s = {} }
				u = this.CHTMLcreateNode(u);
				this.CHTML = htmlCmn.BBOX.empty();
				this.CHTMLhandleStyle(u);
				if (this.isToken) { this.CHTMLgetVariant() }
				this.CHTMLhandleScale(u);
				var r = Math.max((s.minChildren || 0), this.data.length);
				for (var t = 0; t < r; t++) { this.CHTMLaddChild(u, t, s) }
				if (!s.noBBox) { this.CHTML.clean() }
				this.CHTMLhandleSpace(u);
				this.CHTMLhandleBBox(u);
				this.CHTMLhandleColor(u);
				return u;
			},
			CHTMLaddChild: function (w, s, r) {
				var y = this.data[s], v;
				var t = r.childNodes;
				if (t instanceof Array) { t = t[s] || "span" }
				if (y) {
					if (t) { w = htmlCmn.addElement(w, t) }
					v = y.toCommonHTML(w, r.childOptions);
					if (t && y.CHTML.rscale !== 1) {
						w.style.fontSize = w.firstChild.style.fontSize;
						w.firstChild.style.fontSize = ""
					}
					if (!r.noBBox) {
						var x = this.CHTML, u = y.CHTML;
						x.append(u);
						if (u.ic) {
							x.ic = u.ic;
						} else {
							delete x.ic;
						}
						if (u.skew) { x.skew = u.skew }
						if (u.pwidth) { x.pwidth = u.pwidth }
					}
				} else {
					if (r.forceChild) { v = htmlCmn.addElement(w, (t || "mjx-box")) }
				}
				return v;
			},
			CHTMLchildNode: function (s, r) {
				s = s.childNodes[r];
				if (s.nodeName.toLowerCase() === "a") { s = s.firstChild }
				return s;
			},
			CHTMLcoreNode: function (r) {
				if (this.inferRow && this.data[0]) {
					return this.data[0].CHTMLcoreNode(r.firstChild);
				}
				return this.CHTMLchildNode(r, this.CoreIndex());
			},
			CHTMLstretchChildV: function (u, t, x) {
				var v = this.data[u];
				if (v) {
					var y = this.CHTML, s = v.CHTML;
					if (s.stretch || (s.stretch == null && v.CHTMLcanStretch("Vertical", t, x))) {
						var r = s.w;
						s = v.CHTMLstretchV(t, x);
						y.w += s.w - r;
						if (y.w > y.r) { y.r = y.w }
						if (s.h > y.h) { y.h = s.h }
						if (s.d > y.d) { y.d = s.d }
						if (s.t > y.t) { y.t = s.t }
						if (s.b > y.b) { y.b = s.b }
					}
				}
			},
			CHTMLstretchChildH: function (u, r, v) {
				var x = this.data[u];
				if (x) {
					var y = this.CHTML, t = x.CHTML;
					if (t.stretch || (t.stretch == null && x.CHTMLcanStretch("Horizontal", r))) {
						var s = t.w;
						t = x.CHTMLstretchH(this.CHTMLchildNode(v, u), r);
						y.w += t.w - s;
						if (y.w > y.r) { y.r = y.w }
						if (t.h > y.h) { y.h = t.h }
						if (t.d > y.d) { y.d = t.d }
						if (t.t > y.t) { y.t = t.t }
						if (t.b > y.b) { y.b = t.b }
					}
				}
			},
			CHTMLcanStretch: function (v, t, u) {
				var s = false;
				if (this.isEmbellished()) {
					var r = this.Core();
					if (r && r !== this) {
						s = r.CHTMLcanStretch(v, t, u);
					}
				}
				this.CHTML.stretch = s;
				return s;
			},
			CHTMLstretchV: function (r, s) {
				this.CHTML.updateFrom(this.Core().CHTMLstretchV(r, s));
				return this.CHTML;
			},
			CHTMLstretchH: function (s, r) {
				this.CHTML.updateFrom(this.CHTMLstretchCoreH(s, r));
				return this.CHTML;
			},
			CHTMLstretchCoreH: function (s, r) {
				return this.Core().CHTMLstretchH(this.CHTMLcoreNode(s), r);
			},
			CHTMLcreateNode: function (r) {
				if (!this.CHTML) { this.CHTML = {} }
				this.CHTML = htmlCmn.BBOX.zero();
				if (this.href) {
					r = htmlCmn.addElement(r, "a", { href: this.href, isMathJax: true });
				}
				if (!this.CHTMLnodeID) { this.CHTMLnodeID = htmlCmn.GetID() }
				var s = (this.id || "MJXc-Node-" + this.CHTMLnodeID) + htmlCmn.idPostfix;
				return this.CHTMLhandleAttributes(htmlCmn.addElement(r, "mjx-" + this.type, { id: s }));
			},
			CHTMLnodeElement: function () {
				if (!this.CHTMLnodeID) { return null }
				return document.getElementById((this.id || "MJXc-Node-" + this.CHTMLnodeID) + htmlCmn.idPostfix);
			},
			CHTMLlength2em: function (s, r) {
				return htmlCmn.length2em(s, r, this.CHTML.scale);
			},
			CHTMLhandleAttributes: function (u) {
				if (this["class"]) {
					if (u.className) {
						u.className += " " + this["class"];
					} else {
						u.className = this["class"];
					}
				}
				if (this.attrNames) {
					var y = this.attrNames, t = mml.nocopyAttributes, x = hub.config.ignoreMMLattributes;
					var v = (this.type === "mstyle" ? mml.math.prototype.defaults : this.defaults);
					for (var s = 0, r = y.length; s < r; s++) {
						var w = y[s];
						if (x[w] == false || (!t[w] && !x[w] && v[w] == null && typeof (u[w]) === "undefined")) {
							u.setAttribute(w, this.attr[w]);
						}
					}
				}
				return u;
			},
			CHTMLhandleScale: function (u) {
				var w = 1, t = this.parent, v = (t ? t.CHTML.scale : 1);
				var r = this.getValues("scriptlevel", "fontsize");
				r.mathsize = this.Get("mathsize", null, !this.isToken);
				if (r.scriptlevel !== 0) {
					if (r.scriptlevel > 2) { r.scriptlevel = 2 }
					w = Math.pow(this.Get("scriptsizemultiplier"), r.scriptlevel);
					r.scriptminsize = htmlCmn.length2em(this.Get("scriptminsize"), 0.8, 1);
					if (w < r.scriptminsize) { w = r.scriptminsize }
				}
				if (this.removedStyles && this.removedStyles.fontSize && !r.fontsize) {
					r.fontsize = this.removedStyles.fontSize;
				}
				if (r.fontsize && !this.mathsize) { r.mathsize = r.fontsize }
				if (r.mathsize !== 1) { w *= htmlCmn.length2em(r.mathsize, 1, 1) }
				var s = this.CHTMLvariant;
				if (s && s.style && s.style["font-family"]) { w *= (htmlCmn.config.scale / 100) / htmlCmn.scale }
				this.CHTML.scale = w;
				v = this.CHTML.rscale = w / v;
				if (Math.abs(v - 1) < 0.001) { v = 1 }
				if (u && v !== 1) { u.style.fontSize = htmlCmn.Percent(v) }
				return w;
			},
			CHTMLhandleStyle: function (u) {
				if (!this.style) { return }
				var t = u.style;
				t.cssText = this.style;
				this.removedStyles = {};
				for (var s = 0, r = htmlCmn.removeStyles.length; s < r; s++) {
					var v = htmlCmn.removeStyles[s];
					if (t[v]) {
						this.removedStyles[v] = t[v];
						t[v] = "";
					}
				}
			},
			CHTMLhandleBBox: function (v) {
				var s = this.CHTML, u = v.style;
				if (this.data.length === 1 && (this.data[0].CHTML || {}).pwidth) {
					s.pwidth = this.data[0].CHTML.pwidth;
					s.mwidth = this.data[0].CHTML.mwidth;
					u.width = "100%"
				} else {
					if (s.pwidth) {
						s.mwidth = htmlCmn.Em(s.w);
						u.width = "100%"
					} else {
						if (s.w < 0) {
							u.width = "0px";
							u.marginRight = htmlCmn.Em(s.w);
						}
					}
				}
				if (!this.style) { return }
				for (var t = 0, r = htmlCmn.BBOX.styleAdjust.length; t < r; t++) {
					var w = htmlCmn.BBOX.styleAdjust[t];
					if (w && u[w[0]]) {
						s.adjust(u[w[0]], w[1], w[2], w[3]);
					}
				}
			},
			CHTMLhandleColor: function (r) {
				if (this.mathcolor) {
					r.style.color = this.mathcolor;
				} else {
					if (this.color) { r.style.color = this.color }
				}
				if (this.mathbackground) {
					r.style.backgroundColor = this.mathbackground;
				} else {
					if (this.background) { r.style.backgroundColor = this.background }
				}
			},
			CHTMLhandleSpace: function (r) {
				if (!this.useMMLspacing) {
					var s = this.texSpacing();
					if (s !== "") {
						this.CHTML.L = this.CHTMLlength2em(s);
						r.className += " " + htmlCmn.SPACECLASS[s];
					}
				}
			},
			CHTMLhandleText: function (s, t, r) {
				if (s.firstChild && !this.CHTML) { this.CHTML = htmlCmn.BBOX.empty() }
				this.CHTML = htmlCmn.handleText(s, t, r, this.CHTML);
			},
			CHTMLgetVariant: function () {
				var r = this.getValues("mathvariant", "fontfamily", "fontweight", "fontstyle"), t;
				r.hasVariant = this.Get("mathvariant", true);
				if (this.removedStyles) {
					t = this.removedStyles;
					if (t.fontFamily) { r.family = t.fontFamily }
					if (t.fontWeight) { r.weight = t.fontWeight }
					if (t.fontStyle) { r.style = t.fontStyle }
				}
				if (!r.hasVariant) {
					if (r.fontfamily) { r.family = r.fontfamily }
					if (r.fontweight) { r.weight = r.fontweight }
					if (r.fontstyle) { r.style = r.fontstyle }
				}
				if (r.weight && r.weight.match(/^\d+$/)) {
					r.weight = (parseInt(r.weight) > 600 ? "bold" : "normal");
				}
				var s = r.mathvariant;
				if (this.variantForm) { s = "-TeX-variant" }
				if (r.family && !r.hasVariant) {
					if (!r.weight && r.mathvariant.match(/bold/)) { r.weight = "bold" }
					if (!r.style && r.mathvariant.match(/italic/)) { r.style = "italic" }
					this.CHTMLvariant = {
						fonts: [],
						noRemap: true,
						cache: {},
						style: {
							"font-family": r.family,
							"font-weight": r.weight || "normal",
							"font-style": r.style || "normal"
						}
					};
					return;
				}
				if (r.weight === "bold") {
					s = {
						normal: mml.VARIANT.BOLD,
						italic: mml.VARIANT.BOLDITALIC,
						fraktur: mml.VARIANT.BOLDFRAKTUR,
						script: mml.VARIANT.BOLDSCRIPT,
						"sans-serif": mml.VARIANT.BOLDSANSSERIF,
						"sans-serif-italic": mml.VARIANT.SANSSERIFBOLDITALIC
					}[s] || s;
				} else {
					if (r.weight === "normal") {
						s = {
							bold: mml.VARIANT.normal,
							"bold-italic": mml.VARIANT.ITALIC,
							"bold-fraktur": mml.VARIANT.FRAKTUR,
							"bold-script": mml.VARIANT.SCRIPT,
							"bold-sans-serif": mml.VARIANT.SANSSERIF,
							"sans-serif-bold-italic": mml.VARIANT.SANSSERIFITALIC
						}[s] || s;
					}
				}
				if (r.style === "italic") {
					s = {
						normal: mml.VARIANT.ITALIC,
						bold: mml.VARIANT.BOLDITALIC,
						"sans-serif": mml.VARIANT.SANSSERIFITALIC,
						"bold-sans-serif": mml.VARIANT.SANSSERIFBOLDITALIC
					}[s] || s;
				} else {
					if (r.style === "normal") {
						s = {
							italic: mml.VARIANT.NORMAL,
							"bold-italic": mml.VARIANT.BOLD,
							"sans-serif-italic": mml.VARIANT.SANSSERIF,
							"sans-serif-bold-italic": mml.VARIANT.BOLDSANSSERIF
						}[s] || s;
					}
				}
				this.CHTMLvariant = htmlCmn.FONTDATA.VARIANT[s] || htmlCmn.FONTDATA.VARIANT[mml.VARIANT.NORMAL];
			},
			CHTMLbboxFor: function (r) {
				if (this.data[r] && this.data[r].CHTML) {
					return this.data[r].CHTML;
				}
				return htmlCmn.BBOX.zero();
			},
			CHTMLdrawBBox: function (s, t) {
				if (!t) { t = this.CHTML }
				var r = htmlCmn.Element(
					"mjx-box", {
						style: {
							opacity: 0.25,
							"margin-left": htmlCmn.Em(-(t.w + (t.R || 0)))
						}
				}, [
					["mjx-box", {
						style: {
							height: htmlCmn.Em(t.h),
							width: htmlCmn.Em(t.w),
							"background-color": "red"
						}
					}],
					["mjx-box", {
						style: {
							height: htmlCmn.Em(t.d),
							width: htmlCmn.Em(t.w),
							"margin-left": htmlCmn.Em(-t.w),
							"vertical-align": htmlCmn.Em(-t.d),
							"background-color": "green"
						}
					}]
				]
				);
				if (s.nextSibling) {
					s.parentNode.insertBefore(r, s.nextSibling);
				} else {
					s.parentNode.appendChild(r);
				}
			},
			CHTMLnotEmpty: function (r) {
				while (r && r.data.length < 2 && (r.type === "mrow" || r.type === "texatom")) {
					r = r.data[0];
				}
				return !!r;
			}
		}, {
			CHTMLautoload: function () {
				var r = htmlCmn.autoloadDir + "/" + this.type + ".js"; hub.RestartAfter(ajax.Require(r));
			},
			CHTMLautoloadFile: function (r) {
				var s = htmlCmn.autoloadDir + "/" + r + ".js";
				hub.RestartAfter(ajax.Require(s));
			},
			CHTMLstretchV: function (r, s) {
				this.Core().CHTMLstretchV(r, s);
				this.toCommonHTML(this.CHTMLnodeElement(), { stretch: true });
				return this.CHTML;
			},
			CHTMLstretchH: function (s, r) {
				this.CHTMLstretchCoreH(s, r);
				this.toCommonHTML(s, { stretch: true });
				return this.CHTML;
			}
		});
		mml.chars.Augment({
			toCommonHTML: function (s, r) {
				if (r == null) { r = {} }
				var t = this.toString();
				if (r.remap) { t = r.remap(t, r.remapchars) }
				this.CHTMLhandleText(s, t, r.variant || this.parent.CHTMLvariant);
			}
		});
		mml.entity.Augment({
			toCommonHTML: function (s, r) {
				if (r == null) { r = {} }
				var t = this.toString();
				if (r.remapchars) { t = r.remap(t, r.remapchars) }
				this.CHTMLhandleText(s, t, r.variant || this.parent.CHTMLvariant);
			}
		});
		mml.math.Augment({
			toCommonHTML: function (w) {
				w = this.CHTMLdefaultNode(w);
				if (this.CHTML.w < 0) {
					w.parentNode.style.width = "0px";
					w.parentNode.style.marginRight = htmlCmn.Em(this.CHTML.w);
				}
				var u = this.Get("alttext");
				if (u && !w.getAttribute("aria-label")) { w.setAttribute("aria-label", u) }
				if (this.CHTML.pwidth) {
					w.parentNode.style.minWidth = this.CHTML.mwidth || htmlCmn.Em(this.CHTML.w);
					w.parentNode.className = "mjx-full-width " + w.parentNode.className;
					w.style.width = this.CHTML.pwidth;
				} else {
					if (!this.isMultiline && this.Get("display") === "block") {
						var t = this.getValues("indentalignfirst", "indentshiftfirst", "indentalign", "indentshift");
						if (t.indentalignfirst !== mml.INDENTALIGN.INDENTALIGN) {
							t.indentalign = t.indentalignfirst;
						}
						if (t.indentalign === mml.INDENTALIGN.AUTO) { t.indentalign = hubConfig.displayAlign }
						if (t.indentshiftfirst !== mml.INDENTSHIFT.INDENTSHIFT) { t.indentshift = t.indentshiftfirst }
						if (t.indentshift === "auto") { t.indentshift = "0" }
						var s = this.CHTMLlength2em(t.indentshift, htmlCmn.cwidth);
						if (hubConfig.displayIndent !== "0") {
							var r = this.CHTMLlength2em(hubConfig.displayIndent, htmlCmn.cwidth);
							s += (t.indentalign === mml.INDENTALIGN.RIGHT ? -r : r);
						}
						var v = w.parentNode.parentNode.style;
						w.parentNode.style.textAlign = v.textAlign = t.indentalign;
						if (s) {
							s *= htmlCmn.em / htmlCmn.outerEm;
							hub.Insert(v, ({
								left: { marginLeft: htmlCmn.Em(s) },
								right: { marginRight: htmlCmn.Em(-s) },
								center: { marginLeft: htmlCmn.Em(s), marginRight: htmlCmn.Em(-s) }
							})[t.indentalign]);
						}
					}
				}
				return w;
			}
		});
		mml.mi.Augment({
			toCommonHTML: function (r) {
				r = this.CHTMLdefaultNode(r);
				var t = this.CHTML, s = this.data.join("");
				if (t.skew != null && s.length !== 1) { delete t.skew }
				if (t.r > t.w && s.length === 1 && !this.CHTMLvariant.noIC) {
					t.ic = t.r - t.w;
					t.w = t.r;
					r.lastChild.style.paddingRight = htmlCmn.Em(t.ic);
				}
				return r;
			}
		});
		mml.mn.Augment({
			CHTMLremapMinus: function (r) {
				return r.replace(/^-/, "\u2212");
			},
			toCommonHTML: function (r) {
				r = this.CHTMLdefaultNode(r, {
					childOptions: { remap: this.CHTMLremapMinus }
				});
				var t = this.CHTML, s = this.data.join("");
				if (t.skew != null && s.length !== 1) { delete t.skew }
				if (t.r > t.w && s.length === 1 && !this.CHTMLvariant.noIC) {
					t.ic = t.r - t.w;
					t.w = t.r;
					r.lastChild.style.paddingRight = htmlCmn.Em(t.ic);
				}
				return r;
			}
		});
		mml.mo.Augment({
			toCommonHTML: function (u) {
				u = this.CHTMLcreateNode(u);
				this.CHTMLhandleStyle(u);
				this.CHTMLgetVariant();
				this.CHTMLhandleScale(u);
				htmlCmn.BBOX.empty(this.CHTML);
				var s = this.getValues("displaystyle", "largeop");
				s.variant = this.CHTMLvariant;
				s.text = this.data.join("");
				if (s.text == "") {
					if (this.fence) {
						u.style.width = htmlCmn.Em(htmlCmn.TEX.nulldelimiterspace);
					}
				} else {
					this.CHTMLadjustAccent(s);
					this.CHTMLadjustVariant(s);
					for (var t = 0, r = this.data.length; t < r; t++) {
						this.CHTMLaddChild(u, t, {
							childOptions: { variant: s.mathvariant, remap: this.remap, remapchars: s.remapchars }
						});
					}
					if (s.text.length !== 1) {
						delete this.CHTML.skew;
					} else {
						if (this.CHTML.w === 0 && this.CHTML.l < 0) {
							this.CHTMLfixCombiningChar(u);
						}
					}
					if (s.largeop) { this.CHTMLcenterOp(u) }
				}
				this.CHTML.clean();
				this.CHTMLhandleBBox(u);
				this.CHTMLhandleSpace(u);
				this.CHTMLhandleColor(u);
				return u;
			},
			CHTMLhandleSpace: function (u) {
				if (this.useMMLspacing) {
					var s = this.getValues("scriptlevel", "lspace", "rspace");
					s.lspace = Math.max(0, this.CHTMLlength2em(s.lspace));
					s.rspace = Math.max(0, this.CHTMLlength2em(s.rspace));
					if (s.scriptlevel > 0) {
						if (!this.hasValue("lspace")) { s.lspace = 0.15 }
						if (!this.hasValue("rspace")) { s.rspace = 0.15 }
					}
					var r = this, t = this.Parent();
					while (t && t.isEmbellished() && t.Core() === r) {
						r = t;
						t = t.Parent();
						u = r.CHTMLnodeElement();
					}
					if (s.lspace) { u.style.paddingLeft = htmlCmn.Em(s.lspace) }
					if (s.rspace) { u.style.paddingRight = htmlCmn.Em(s.rspace) }
					this.CHTML.L = s.lspace;
					this.CHTML.R = s.rspace;
				} else {
					this.SUPER(arguments).CHTMLhandleSpace.apply(this, arguments);
				}
			},
			CHTMLadjustAccent: function (t) {
				var s = this.CoreParent();
				t.parent = s;
				if (t.text.length === 1 && s && s.isa(mml.munderover) && this.CoreText(s.data[s.base]).length === 1) {
					var u = s.data[s.over], r = s.data[s.under];
					if (u && this === u.CoreMO() && s.Get("accent")) {
						t.remapchars = htmlCmn.FONTDATA.REMAPACCENT;
					} else {
						if (r && this === r.CoreMO() && s.Get("accentunder")) {
							t.remapchars = htmlCmn.FONTDATA.REMAPACCENTUNDER;
						}
					}
				}
			},
			CHTMLadjustVariant: function (s) {
				var r = s.parent, t = (r && r.isa(mml.msubsup) && this !== r.data[r.base]);
				if (s.largeop) {
					s.mathvariant = (s.displaystyle ? "-largeOp" : "-smallOp");
				}
				if (t) {
					s.remapchars = this.remapChars;
					if (s.text.match(/['`"\u00B4\u2032-\u2037\u2057]/)) {
						s.mathvariant = "-TeX-variant";
					}
				}
			},
			CHTMLfixCombiningChar: function (r) {
				r = r.firstChild;
				var s = htmlCmn.Element("mjx-box", { style: { width: ".25em", "margin-left": "-.25em" } });
				r.insertBefore(s, r.firstChild);
			},
			CHTMLcenterOp: function (r) {
				var t = this.CHTML;
				var s = (t.h - t.d) / 2 - htmlCmn.TEX.axis_height;
				if (Math.abs(s) > 0.001) {
					r.style.verticalAlign = htmlCmn.Em(-s);
				}
				t.h -= s;
				t.d += s;
				if (t.r > t.w) {
					t.ic = t.r - t.w;
					t.w = t.r;
					r.style.paddingRight = htmlCmn.Em(t.ic);
				}
			},
			CHTMLcanStretch: function (v, t, u) {
				if (!this.Get("stretchy")) { return false }
				var w = this.data.join("");
				if (w.length !== 1) { return false }
				var s = { text: w };
				this.CHTMLadjustAccent(s);
				if (s.remapchars) { w = s.remapchars[w] || w }
				w = htmlCmn.FONTDATA.DELIMITERS[w.charCodeAt(0)];
				var r = (w && w.dir === v.substr(0, 1));
				if (r) {
					r = (this.CHTML.h !== t || this.CHTML.d !== u || !!this.Get("minsize", true) || !!this.Get("maxsize", true));
					if (r) {
						this.CHTML.stretch = true;
					}
				}
				return r;
			},
			CHTMLstretchV: function (u, x) {
				var v = this.CHTMLnodeElement(), w = this.CHTML;
				var s = this.getValues("symmetric", "maxsize", "minsize");
				var t, r = htmlCmn.TEX.axis_height;
				if (s.symmetric) {
					t = 2 * Math.max(u - r, x + r);
				} else {
					t = u + x;
				}
				s.maxsize = this.CHTMLlength2em(s.maxsize, w.h + w.d);
				s.minsize = this.CHTMLlength2em(s.minsize, w.h + w.d);
				t = Math.max(s.minsize, Math.min(s.maxsize, t));
				if (t !== w.sH) {
					if (t != s.minsize) {
						t = [Math.max(t * htmlCmn.TEX.delimiterfactor / 1000, t - htmlCmn.TEX.delimitershortfall), t];
					}
					while (v.firstChild) {
						v.removeChild(v.firstChild);
					}
					this.CHTML = w = htmlCmn.createDelimiter(v, this.data.join("").charCodeAt(0), t, w);
					w.sH = (t instanceof Array ? t[1] : t);
					if (s.symmetric) {
						t = (w.h + w.d) / 2 + r;
					} else {
						t = (w.h + w.d) * u / (u + x);
					}
					t -= w.h;
					if (Math.abs(t) > 0.05) {
						v.style.verticalAlign = htmlCmn.Em(t);
						w.h += t;
						w.d -= t;
						w.t += t;
						w.b -= t;
					}
				}
				return this.CHTML;
			},
			CHTMLstretchH: function (t, r) {
				var u = this.CHTML;
				var s = this.getValues("maxsize", "minsize", "mathvariant", "fontweight");
				if ((s.fontweight === "bold" || (this.removedStyles || {}).fontWeight === "bold" || parseInt(s.fontweight) >= 600) && !this.Get("mathvariant", true)) {
					s.mathvariant = mml.VARIANT.BOLD;
				}
				s.maxsize = this.CHTMLlength2em(s.maxsize, u.w);
				s.minsize = this.CHTMLlength2em(s.minsize, u.w);
				r = Math.max(s.minsize, Math.min(s.maxsize, r));
				if (r !== u.sW) {
					while (t.firstChild) { t.removeChild(t.firstChild) }
					this.CHTML = u = htmlCmn.createDelimiter(t, this.data.join("").charCodeAt(0), r, u, s.mathvariant);
					u.sW = r;
				}
				return this.CHTML;
			}
		});
		mml.mtext.Augment({
			CHTMLgetVariant: function () {
				if (htmlCmn.config.mtextFontInherit || this.Parent().type === "merror") {
					var t = (htmlCmn.config.scale / 100) / htmlCmn.scale;
					var s = {
						cache: {},
						fonts: [],
						className: "MJXc-font-inherit",
						rscale: t,
						style: { "font-size": htmlCmn.Percent(t) }
					};
					var r = this.Get("mathvariant");
					if (r.match(/bold/)) {
						s.style["font-weight"] = "bold";
					}
					if (r.match(/italic|-tex-mathit/)) {
						s.style["font-style"] = "italic";
					}
					if (r === "monospace") {
						s.className += " MJXc-monospace-font";
					}
					if (r === "double-struck") {
						s.className += " MJXc-double-struck-font";
					}
					if (r.match(/fraktur/)) {
						s.className += " MJXc-fraktur-font";
					}
					if (r.match(/sans-serif/)) {
						s.className += " MJXc-sans-serif-font";
					}
					if (r.match(/script/)) {
						s.className += " MJXc-script-font";
					}
					this.CHTMLvariant = s;
				} else {
					this.SUPER(arguments).CHTMLgetVariant.call(this);
				}
			}
		});
		mml.merror.Augment({
			toCommonHTML: function (r) {
				r = this.CHTMLdefaultNode(r);
				var s = this.CHTML;
				s.rescale(0.9);
				s.h += 3 / htmlCmn.em;
				if (s.h > s.t) { s.t = s.h }
				s.d += 3 / htmlCmn.em;
				if (s.d > s.b) { s.b = s.d }
				s.w += 8 / htmlCmn.em;
				s.r = s.w;
				s.l = 0;
				return r;
			}
		});
		mml.mspace.Augment({
			toCommonHTML: function (u) {
				u = this.CHTMLcreateNode(u);
				this.CHTMLhandleStyle(u);
				this.CHTMLhandleScale(u);
				var s = this.getValues("height", "depth", "width");
				var r = this.CHTMLlength2em(s.width), t = this.CHTMLlength2em(s.height), x = this.CHTMLlength2em(s.depth);
				var v = this.CHTML;
				v.w = v.r = r;
				v.h = v.t = t;
				v.d = v.b = x;
				v.l = 0;
				if (r < 0) {
					u.style.marginRight = htmlCmn.Em(r);
					r = 0;
				}
				u.style.width = htmlCmn.Em(r);
				u.style.height = htmlCmn.Em(Math.max(0, t + x));
				if (x) {
					u.style.verticalAlign = htmlCmn.Em(-x);
				}
				this.CHTMLhandleBBox(u);
				this.CHTMLhandleColor(u);
				return u;
			}
		});
		mml.mpadded.Augment({
			toCommonHTML: function (s, E) {
				var r;
				if (E && E.stretch) {
					s = s.firstChild;
					r = s.firstChild;
				} else {
					s = this.CHTMLdefaultNode(s, { childNodes: "mjx-box", forceChild: true });
					r = s.firstChild;
					s = htmlCmn.addElement(s, "mjx-block");
					s.appendChild(r);
					htmlCmn.addElement(s, "mjx-strut");
				}
				var v = this.CHTMLbboxFor(0);
				var C = this.getValues("width", "height", "depth", "lspace", "voffset");
				var A = 0, z = 0, B = v.w, t = v.h, u = v.d;
				r.style.width = 0;
				r.style.margin = htmlCmn.Em(-t) + " 0 " + htmlCmn.Em(-u);
				if (C.width !== "") {
					B = this.CHTMLdimen(C.width, "w", B, 0);
				}
				if (C.height !== "") {
					t = this.CHTMLdimen(C.height, "h", t, 0);
				}
				if (C.depth !== "") {
					u = this.CHTMLdimen(C.depth, "d", u, 0);
				}
				if (C.voffset !== "") {
					z = this.CHTMLdimen(C.voffset);
					if (z) {
						r.style.position = "relative";
						r.style.top = htmlCmn.Em(-z);
					}
				}
				if (C.lspace !== "") {
					A = this.CHTMLdimen(C.lspace);
					if (A) {
						r.style.position = "relative";
						r.style.left = htmlCmn.Em(A);
					}
				}
				s.style.width = 0;
				s.style.marginTop = htmlCmn.Em(t - e);
				s.style.padding = "0 " + htmlCmn.Em(B) + " " + htmlCmn.Em(u) + " 0";
				var D = htmlCmn.BBOX({
					w: B,
					h: t,
					d: u,
					l: 0,
					r: B,
					t: t,
					b: u,
					scale: this.CHTML.scale,
					rscale: this.CHTML.rscale
				});
				D.combine(v, A, z);
				D.w = B;
				D.h = t;
				D.d = u;
				this.CHTML = D;
				return s.parentNode;
			},
			CHTMLstretchV: mml.mbase.CHTMLstretchV,
			CHTMLstretchH: mml.mbase.CHTMLstretchH,
			CHTMLdimen: function (v, x, w, r) {
				if (r == null) { r = -n }
				v = String(v);
				var s = v.match(/width|height|depth/);
				var t = (s ? this.CHTML[s[0].charAt(0)] : (x ? this.CHTML[x] : 0));
				var u = (this.CHTMLlength2em(v, t) || 0);
				if (v.match(/^[-+]/) && w != null) { u += w }
				if (r != null) { u = Math.max(r, u) }
				return u;
			}
		});
		mml.munderover.Augment({
			toCommonHTML: function (v, F) {
				var D = this.getValues("displaystyle", "accent", "accentunder", "align");
				var t = this.data[this.base];
				if (!D.displaystyle && t != null && (t.movablelimits || t.CoreMO().Get("movablelimits"))) {
					return mml.msubsup.prototype.toCommonHTML.call(this, v, s);
				}
				var A, y, r = [], s = false;
				if (F && F.stretch) {
					if (this.data[this.base]) {
						t = htmlCmn.getNode(v, "mjx-op");
					}
					if (this.data[this.under]) {
						A = htmlCmn.getNode(v, "mjx-under");
					}
					if (this.data[this.over]) {
						y = htmlCmn.getNode(v, "mjx-over");
					}
					r[0] = t;
					r[1] = A || y;
					r[2] = y;
					s = true;
				} else {
					var x = ["mjx-op", "mjx-under", "mjx-over"];
					if (this.over === 1) { x[1] = x[2] }
					v = this.CHTMLdefaultNode(v, {
						childNodes: x,
						noBBox: true,
						forceChild: true,
						minChildren: 2
					});
					r[0] = t = v.removeChild(v.firstChild);
					r[1] = A = y = v.removeChild(v.firstChild);
					if (v.firstChild) {
						r[2] = y = v.removeChild(v.firstChild);
					}
				}
				var w = [], u = this.CHTMLgetBBoxes(w, r, D);
				var E = w[this.base], B = this.CHTML;
				B.w = u;
				B.h = E.h;
				B.d = E.d;
				var z = t, C = 0;
				if (E.ic) { C = 1.3 * E.ic + 0.05 }
				if (this.data[this.over]) {
					z = this.CHTMLaddOverscript(y, w, D, C, t, s);
				}
				if (this.data[this.under]) {
					this.CHTMLaddUnderscript(A, w, D, C, v, z, s);
				} else {
					if (!s) { v.appendChild(z) }
				}
				this.CHTMLplaceBoxes(t, A, y, D, w);
				return v;
			},
			CHTMLgetBBoxes: function (z, v, u) {
				var x, s = this.data.length, y, t = -n, r = t;
				for (x = 0; x < s; x++) {
					z[x] = this.CHTMLbboxFor(x);
					z[x].x = z[x].y = 0;
					if (this.data[x]) {
						z[x].stretch = this.data[x].CHTMLcanStretch("Horizontal");
					}
					y = (x === this.base ? 1 : z[x].rscale);
					if (x !== this.base) {
						delete z[x].L; delete z[x].R;
					}
					r = Math.max(r, y * (z[x].w + (z[x].L || 0) + (z[x].R || 0)));
					if (!z[x].stretch && r > t) { t = r }
				}
				if (t === -n) { t = r }
				for (x = 0; x < s; x++) {
					if (z[x].stretch) {
						y = (x === this.base ? 1 : z[x].rscale);
						z[x] = this.data[x].CHTMLstretchH(v[x].firstChild, t / y);
						z[x].x = z[x].y = 0;
						r = Math.max(r, y * (z[x].w + (z[x].L || 0) + (z[x].R || 0)));
					}
				}
				if (!z[this.base]) { z[this.base] = htmlCmn.BBOX.empty() }
				return r;
			},
			CHTMLaddOverscript: function (A, y, E, D, s, r) {
				var C = this.CHTML;
				var x, w, v = htmlCmn.TEX.big_op_spacing5, u;
				var z = y[this.over], F = y[this.base], t = z.rscale;
				if (!r) {
					var B = htmlCmn.Element("mjx-stack");
					B.appendChild(A);
					B.appendChild(s);
				}
				if (z.D) { z.d = z.D }
				if (z.d < 0) {
					A.firstChild.style.verticalAlign = "top";
					A.style.height = htmlCmn.Em(z.h + z.d);
				}
				z.x = 0;
				if (E.accent) {
					if (z.w < 0.001) {
						z.x += (z.r - z.l) / 2;
					}
					u = htmlCmn.TEX.rule_thickness;
					v = 0;
					if (F.skew) {
						z.x += t * F.skew;
						C.skew = t * F.skew;
						if (z.x + t * z.w > C.w) {
							C.skew += (C.w - (z.x + t * z.w)) / 2;
						}
					}
				} else {
					x = htmlCmn.TEX.big_op_spacing1;
					w = htmlCmn.TEX.big_op_spacing3;
					u = Math.max(x, w - Math.max(0, t * z.d));
				}
				z.x += D / 2;
				z.y = C.h + u + v + t * z.d;
				if (u) {
					A.style.paddingBottom = htmlCmn.Em(u / t);
				}
				if (v) {
					A.style.paddingTop = htmlCmn.Em(v / t);
				}
				return B;
			},
			CHTMLaddUnderscript: function (A, y, D, C, s, z, r) {
				var B = this.CHTML;
				var x, w, v = htmlCmn.TEX.big_op_spacing5, u;
				var E = y[this.under], t = E.rscale;
				if (!r) {
					htmlCmn.addElement(s, "mjx-itable", {}, [["mjx-row", {}, [["mjx-cell"]]], ["mjx-row"]]);
					s.firstChild.firstChild.firstChild.appendChild(z);
					s.firstChild.lastChild.appendChild(A);
				}
				if (E.D) { E.d = E.D }
				if (E.d < 0) {
					A.firstChild.style.verticalAlign = "top";
					s.firstChild.style.marginBottom = htmlCmn.Em(E.d);
				}
				if (D.accentunder) {
					u = 2 * htmlCmn.TEX.rule_thickness;
					v = 0;
				} else {
					x = htmlCmn.TEX.big_op_spacing2;
					w = htmlCmn.TEX.big_op_spacing4;
					u = Math.max(x, w - t * E.h);
				}
				E.x = -C / 2;
				E.y = -(B.d + u + v + t * E.h);
				if (u) {
					A.style.paddingTop = htmlCmn.Em(u / t);
				}
				if (v) {
					A.style.paddingBottom = htmlCmn.Em(v / t);
				}
			},
			CHTMLplaceBoxes: function (r, A, z, D, y) {
				var s = this.CHTML.w, x, u = y.length, v;
				var C = htmlCmn.BBOX.zero();
				C.scale = this.CHTML.scale;
				C.rscale = this.CHTML.rscale;
				y[this.base].x = y[this.base].y = 0;
				var E = n;
				for (x = 0; x < u; x++) {
					v = (x === this.base ? 1 : y[x].rscale);
					var B = v * (y[x].w + (y[x].L || 0) + (y[x].R || 0));
					y[x].x += {
						left: 0,
						center: (s - B) / 2,
						right: s - B
					}[D.align];
					if (y[x].x < E) { E = y[x].x }
				}
				for (x = 0; x < u; x++) {
					if (this.data[x]) {
						v = (x === this.base ? 1 : y[x].rscale);
						if (y[x].x - E) {
							var t = (x === this.base ? r : x === this.over ? z : A);
							t.style.paddingLeft = htmlCmn.Em((y[x].x - E) / v);
						}
						C.combine(y[x], y[x].x - E, y[x].y);
					}
				}
				this.CHTML = C;
			},
			CHTMLstretchV: mml.mbase.CHTMLstretchV,
			CHTMLstretchH: mml.mbase.CHTMLstretchH,
			CHTMLchildNode: function (t, s) {
				var r = ["mjx-op", "mjx-under", "mjx-over"];
				if (this.over === 1) { r[1] = r[2] }
				return htmlCmn.getNode(t, r[s]);
			}
		});
		mml.msubsup.Augment({
			toCommonHTML: function (S, C) {
				var A = this.getValues("displaystyle", "subscriptshift", "superscriptshift", "texprimestyle");
				var D, H, z;
				if (C && C.stretch) {
					if (this.data[this.base]) { D = htmlCmn.getNode(S, "mjx-base") }
					if (this.data[this.sub]) { H = htmlCmn.getNode(S, "mjx-sub") }
					if (this.data[this.sup]) { z = htmlCmn.getNode(S, "mjx-sup") }
					E = htmlCmn.getNode(S, "mjx-stack");
				} else {
					var K = ["mjx-base", "mjx-sub", "mjx-sup"];
					if (this.sup === 1) { K[1] = K[2] }
					S = this.CHTMLdefaultNode(S, {
						childNodes: K,
						noBBox: true,
						forceChild: true,
						minChildren: 3
					});
					D = S.childNodes[this.base];
					H = S.childNodes[this.sub];
					z = S.childNodes[this.sup];
					if (!this.CHTMLnotEmpty(this.data[this.sub])) {
						S.removeChild(H);
						H = null;
					}
					if (!this.CHTMLnotEmpty(this.data[this.sup])) {
						S.removeChild(z);
						z = null;
					}
					if (S.childNodes.length === 3) {
						var E = htmlCmn.addElement(S, "mjx-stack");
						E.appendChild(z);
						E.appendChild(H);
					}
				}
				var F = [], G = htmlCmn.BBOX.empty(this.CHTML);
				for (var V = 0, T = this.data.length; V < T; V++) {
					F[V] = this.CHTMLbboxFor(V);
				}
				var y = F[this.base] || htmlCmn.BBOX.empty(), P = F[this.sub], W = F[this.sup];
				var B = (H ? P.rscale : 1), w = (z ? W.rscale : 1);
				G.combine(y, 0, 0);
				var X = htmlCmn.TEX.x_height, N = htmlCmn.TEX.scriptspace;
				var Q = htmlCmn.TEX.sup_drop * w, O = htmlCmn.TEX.sub_drop * B;
				var L = y.h - Q, J = y.d + O, Y = 0, R;
				if (y.ic) {
					G.w -= y.ic;
					D.style.marginRight = htmlCmn.Em(-y.ic);
					Y = 1.3 * y.ic + 0.05;
				}
				var U = this.data[this.base];
				if (U) {
					if ((U.type === "mrow" || U.type === "mstyle") && U.data.length === 1) { U = U.data[0] }
					if (U.type === "mi" || U.type === "mo") {
						if (U.data.join("").length === 1 && y.rscale === 1 && !y.sH && !U.Get("largeop")) { L = J = 0 }
					}
				}
				A.subscriptshift = (A.subscriptshift === "" ? 0 : this.CHTMLlength2em(A.subscriptshift));
				A.superscriptshift = (A.superscriptshift === "" ? 0 : this.CHTMLlength2em(A.superscriptshift));
				var I = G.w; if (H) { P.w += N }
				if (z) { W.w += N }
				if (!z) {
					if (H) {
						J = Math.max(J, htmlCmn.TEX.sub1, B * P.h - (4 / 5) * X, A.subscriptshift);
						H.style.verticalAlign = htmlCmn.Em(-J / B);
						H.style.paddingRight = htmlCmn.Em(N / B);
						G.combine(P, I, -J);
					}
				} else {
					if (!H) {
						R = htmlCmn.TEX[(A.displaystyle ? "sup1" : (A.texprimestyle ? "sup3" : "sup2"))];
						L = Math.max(L, R, w * W.d + (1 / 4) * X, A.superscriptshift);
						z.style.verticalAlign = htmlCmn.Em(L / w);
						z.style.paddingLeft = htmlCmn.Em(Y / w);
						z.style.paddingRight = htmlCmn.Em(N / w);
						G.combine(W, I + Y, L);
					} else {
						J = Math.max(J, htmlCmn.TEX.sub2);
						var M = htmlCmn.TEX.rule_thickness;
						if ((L - w * W.d) - (B * P.h - J) < 3 * M) {
							J = 3 * M - L + w * W.d + B * P.h;
							Q = (4 / 5) * X - (L - w * W.d);
							if (Q > 0) { L += Q; J -= Q }
						}
						L = Math.max(L, A.superscriptshift);
						J = Math.max(J, A.subscriptshift);
						H.style.paddingRight = htmlCmn.Em(N / B);
						z.style.paddingBottom = htmlCmn.Em(L / w + J / B - W.d - P.h / B * w);
						z.style.paddingLeft = htmlCmn.Em(Y / w);
						z.style.paddingRight = htmlCmn.Em(N / w);
						E.style.verticalAlign = htmlCmn.Em(-J);
						G.combine(W, I + Y, L);
						G.combine(P, I, -J);
					}
				}
				G.clean();
				return S;
			},
			CHTMLstretchV: mml.mbase.CHTMLstretchV,
			CHTMLstretchH: mml.mbase.CHTMLstretchH,
			CHTMLchildNode: function (t, s) {
				var r = ["mjx-base", "mjx-sub", "mjx-sup"];
				if (this.over === 1) { r[1] = r[2] }
				return htmlCmn.getNode(t, r[s]);
			}
		});
		mml.mfrac.Augment({
			toCommonHTML: function (M) {
				M = this.CHTMLdefaultNode(M, {
					childNodes: ["mjx-numerator", "mjx-denominator"],
					childOptions: { autowidth: true },
					forceChild: true,
					noBBox: true,
					minChildren: 2
				});
				var w = this.getValues("linethickness", "displaystyle", "numalign", "denomalign", "bevelled");
				var N = w.displaystyle;
				var C = M.firstChild, s = M.lastChild;
				var x = htmlCmn.addElement(M, "mjx-box");
				x.appendChild(C);
				x.appendChild(s);
				M.appendChild(x);
				if (w.numalign !== "center") {
					C.style.textAlign = w.numalign;
				}
				if (w.denomalign !== "center") {
					s.style.textAlign = w.denomalign;
				}
				var O = this.CHTMLbboxFor(0), A = this.CHTMLbboxFor(1), B = htmlCmn.BBOX.empty(this.CHTML), E = O.rscale, y = A.rscale; w.linethickness = Math.max(0, htmlCmn.thickness2em(w.linethickness || "0", B.scale));
				var L = htmlCmn.TEX.min_rule_thickness / htmlCmn.em, S = htmlCmn.TEX.axis_height;
				var I = w.linethickness, K, J, G, F;
				if (w.bevelled) {
					x.className += " MJXc-bevelled";
					var R = (N ? 0.4 : 0.15);
					var D = Math.max(E * (O.h + O.d), y * (A.h + A.d)) + 2 * R;
					var Q = htmlCmn.Element("mjx-bevel");
					x.insertBefore(Q, s);
					var r = htmlCmn.createDelimiter(Q, 47, D);
					G = E * (O.d - O.h) / 2 + S + R;
					F = y * (A.d - A.h) / 2 + S - R;
					if (G) { C.style.verticalAlign = htmlCmn.Em(G / E) }
					if (F) { s.style.verticalAlign = htmlCmn.Em(F / y) }
					Q.style.marginLeft = Q.style.marginRight = htmlCmn.Em(-R / 2);
					B.combine(O, 0, G);
					B.combine(r, E * O.w - R / 2, 0);
					B.combine(A, E * O.w + r.w - R, F);
					B.clean();
				} else {
					x.className += " MJXc-stacked";
					if (N) {
						G = htmlCmn.TEX.num1; F = htmlCmn.TEX.denom1;
					} else {
						G = (I === 0 ? htmlCmn.TEX.num3 : htmlCmn.TEX.num2);
						F = htmlCmn.TEX.denom2;
					}
					if (I === 0) {
						K = Math.max((N ? 7 : 3) * htmlCmn.TEX.rule_thickness, 2 * L);
						J = (G - O.d * E) - (A.h * y - F);
						if (J < K) {
							G += (K - J) / 2;
							F += (K - J) / 2;
						}
					} else {
						K = Math.max((N ? 2 : 0) * L + I, I / 2 + 1.5 * L);
						I = Math.max(I, L);
						J = (G - O.d * E) - (S + I / 2);
						if (J < K) {
							G += (K - J);
						}
						J = (S - I / 2) - (A.h * y - F);
						if (J < K) { F += (K - J) }
						O.L = O.R = A.L = A.R = 0.1;
						var z = htmlCmn.addElement(x, "mjx-line", {
							style: { "border-bottom": htmlCmn.Px(I * B.scale, 1) + " solid", top: htmlCmn.Em(-I / 2 - S) }
						});
					}
					B.combine(O, 0, G);
					B.combine(A, 0, -F);
					B.clean();
					x.style.width = htmlCmn.Em(B.w);
					C.style.width = htmlCmn.Em(B.w / E);
					s.style.width = htmlCmn.Em(B.w / y);
					if (z) { z.style.width = x.style.width }
					C.style.top = htmlCmn.Em(-B.h / E);
					s.style.bottom = htmlCmn.Em(-B.d / y);
					htmlCmn.addElement(M, "mjx-vsize", {
						style: { height: htmlCmn.Em(B.h + B.d), verticalAlign: htmlCmn.Em(-B.d) }
					});
				}
				if (!this.texWithDelims && !this.useMMLspacing) {
					var P = htmlCmn.TEX.nulldelimiterspace;
					x.style.padding = "0 " + htmlCmn.Em(P);
					B.l += P;
					B.r += P;
					B.w += 2 * P;
				}
				return M;
			},
			CHTMLcanStretch: function (r) { return false }
		});
		mml.msqrt.Augment({
			toCommonHTML: function (v) {
				v = this.CHTMLdefaultNode(v, {
					childNodes: ["mjx-box", "mjx-root"],
					forceChild: true,
					noBBox: true
				});
				var u = v.firstChild || htmlCmn.Element("mjx-box");
				var D = htmlCmn.addElement(v, "mjx-box");
				D.appendChild(u);
				var E = this.CHTMLbboxFor(0), B = htmlCmn.BBOX.empty(this.CHTML);
				var F = htmlCmn.TEX.rule_thickness, w = htmlCmn.TEX.surd_height, s = F, r, C;
				if (this.Get("displaystyle")) {
					s = htmlCmn.TEX.x_height;
				}
				r = F + s / 4;
				C = E.h + E.d + r + F;
				var y = htmlCmn.Element("mjx-surd");
				D.insertBefore(y, u);
				var z = htmlCmn.createDelimiter(y, 8730, [C - 0.04, C]);
				if (z.h + z.d > C) { r = ((z.h + z.d) - (C - F)) / 2 }
				C = E.h + r + F;
				var A = this.CHTMLaddRoot(v, z, z.h + z.d - C);
				u.style.paddingTop = htmlCmn.Em(r);
				u.style.borderTop = htmlCmn.Px(w * E.scale, 1) + " solid";
				D.style.paddingTop = htmlCmn.Em(2 * F - w);
				E.h += r + 2 * F;
				B.combine(z, A, C - z.h);
				B.combine(E, A + z.w, 0);
				B.clean();
				return v;
			},
			CHTMLaddRoot: function () { return 0 }
		});
		mml.mroot.Augment({
			toCommonHTML: mml.msqrt.prototype.toCommonHTML,
			CHTMLaddRoot: function (z, t, u) {
				if (!this.data[1]) { return }
				var y = this.CHTML, A = this.data[1].CHTML, v = z.firstChild;
				var r = A.rscale;
				var s = this.CHTMLrootHeight(A, t, r) - u;
				var x = Math.min(A.w, A.r);
				var B = Math.max(x, t.offset / r);
				if (s) {
					v.style.verticalAlign = htmlCmn.Em(s / r);
				}
				if (B > x) {
					v.firstChild.style.paddingLeft = htmlCmn.Em(B - x);
				}
				B -= t.offset / r;
				v.style.width = htmlCmn.Em(B);
				y.combine(A, 0, s);
				return B * r;
			},
			CHTMLrootHeight: function (t, r, s) {
				return 0.45 * (r.h + r.d - 0.9) + r.offset + Math.max(0, t.d - 0.075);
			}
		});
		mml.mfenced.Augment({
			toCommonHTML: function (u) {
				u = this.CHTMLcreateNode(u);
				this.CHTMLhandleStyle(u);
				this.CHTMLhandleScale(u);
				this.CHTMLaddChild(u, "open", {});
				for (var t = 0, r = this.data.length; t < r; t++) {
					this.CHTMLaddChild(u, "sep" + t, {});
					this.CHTMLaddChild(u, t, {});
				}
				this.CHTMLaddChild(u, "close", {});
				var s = this.CHTML.h, v = this.CHTML.d;
				this.CHTMLstretchChildV("open", s, v);
				for (t = 0, r = this.data.length; t < r; t++) {
					this.CHTMLstretchChildV("sep" + t, s, v);
					this.CHTMLstretchChildV(t, s, v);
				}
				this.CHTMLstretchChildV("close", s, v);
				this.CHTMLhandleSpace(u);
				this.CHTMLhandleBBox(u);
				this.CHTMLhandleColor(u);
				return u;
			}
		});
		mml.mrow.Augment({
			toCommonHTML: function (v, s) {
				s = s || {};
				v = this.CHTMLdefaultNode(v);
				var y = this.CHTML, u = y.h, w = y.d, x;
				for (var t = 0, r = this.data.length; t < r; t++) {
					this.CHTMLstretchChildV(t, u, w);
					if (this.data[t] && this.data[t].CHTML && this.data[t].CHTML.w < 0) { x = true }
				}
				if (this.CHTMLlineBreaks()) {
					this.CHTMLmultiline(v);
					if (s.autowidth) { v.style.width = "" }
				} else {
					if (x && y.w) {
						v.style.width = htmlCmn.Em(Math.max(0, y.w));
					}
					if (y.w < 0) { v.style.marginRight = htmlCmn.Em(y.w) }
				}
				return v;
			},
			CHTMLlineBreaks: function () {
				if (!this.parent.linebreakContainer) { return false }
				return (line.automatic && this.CHTML.w > htmlCmn.linebreakWidth) || this.hasNewline();
			},
			CHTMLstretchV: function (r, s) {
				this.CHTMLstretchChildV(this.CoreIndex(), r, s); return this.CHTML;
			},
			CHTMLstretchH: function (s, r) {
				this.CHTMLstretchChildH(this.CoreIndex(), r, s); return this.CHTML;
			}
		});
		mml.mstyle.Augment({
			toCommonHTML: function (r) {
				r = this.CHTMLdefaultNode(r);
				if (this.scriptlevel && this.data[0]) {
					this.CHTML.rescale(this.data[0].CHTML.rscale);
				}
				return r;
			}
		});
		mml.TeXAtom.Augment({
			toCommonHTML: function (w, u) {
				if (!u || !u.stretch) {
					w = this.CHTMLdefaultNode(w);
				}
				if (this.texClass === mml.TEXCLASS.VCENTER) {
					var r = htmlCmn.TEX.axis_height, t = this.CHTML;
					var s = r - (t.h + t.d) / 2 + t.d;
					if (Math.abs(s) > 0.001) {
						w.style.verticalAlign = htmlCmn.Em(s);
						t.h += s;
						t.t += s;
						t.d -= s;
						t.b -= s;
					}
				}
				return w;
			},
			CHTMLstretchV: function (r, s) {
				this.CHTML.updateFrom(this.Core().CHTMLstretchV(r, s));
				this.toCommonHTML(this.CHTMLnodeElement(), { stretch: true });
				return this.CHTML;
			},
			CHTMLstretchH: function (s, r) {
				this.CHTML.updateFrom(this.CHTMLstretchCoreH(s, r));
				this.toCommonHTML(s, { stretch: true });
				return this.CHTML;
			}
		});
		mml.semantics.Augment({
			toCommonHTML: function (r) {
				r = this.CHTMLcreateNode(r);
				if (this.data[0]) {
					this.data[0].toCommonHTML(r);
					this.CHTML.updateFrom(this.data[0].CHTML);
					this.CHTMLhandleBBox(r);
				}
				return r;
			}
		});
		mml.annotation.Augment({
			toCommonHTML: function (r) {
				return this.CHTMLcreateNode(r);
			}
		});
		mml["annotation-xml"].Augment({ toCommonHTML: mml.mbase.CHTMLautoload });
		mml.ms.Augment({ toCommonHTML: mml.mbase.CHTMLautoload });
		mml.mglyph.Augment({ toCommonHTML: mml.mbase.CHTMLautoload });
		mml.menclose.Augment({ toCommonHTML: mml.mbase.CHTMLautoload });
		mml.maction.Augment({ toCommonHTML: mml.mbase.CHTMLautoload });
		mml.mmultiscripts.Augment({ toCommonHTML: mml.mbase.CHTMLautoload });
		mml.mtable.Augment({ toCommonHTML: mml.mbase.CHTMLautoload });
		MathJax.Hub.Register.StartupHook("onLoad", function () {
			setTimeout(MathJax.Callback(["loadComplete", htmlCmn, "jax.js"]), 0);
		})
	});

	MathJax.Hub.Register.StartupHook("End Cookie", function () {
		if (hub.config.menuSettings.zoom !== "None") {
			ajax.Require("[MathJax]/extensions/MathZoom.js");
		}
	});
})(MathJax.Ajax, MathJax.Hub, MathJax.HTML, MathJax.OutputJax.CommonHTML);
