(function(o, f, m, a) {
    var d;
    var g = MathJax.Object.isArray;
    var e, q, h;
    var k = 1
      , l = 0.1
      , j = 0.025
      , b = 0.025;
    var p = {
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
            "border-spacing": 0
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
        ".mjx-surd": {
            "vertical-align": "top"
        },
        ".mjx-mphantom *": {
            visibility: "hidden"
        },
        ".mjx-merror": {
            "background-color": "#FFFF88",
            color: "#CC0000",
            border: "1px solid #CC0000",
            padding: "2px 3px",
            "font-style": "normal",
            "font-size": "90%"
        },
        ".mjx-annotation-xml": {
            "line-height": "normal"
        },
        ".mjx-menclose > svg": {
            fill: "none",
            stroke: "currentColor"
        },
        ".mjx-mtr": {
            display: "table-row"
        },
        ".mjx-mlabeledtr": {
            display: "table-row"
        },
        ".mjx-mtd": {
            display: "table-cell",
            "text-align": "center"
        },
        ".mjx-label": {
            display: "table-row"
        },
        ".mjx-box": {
            display: "inline-block"
        },
        ".mjx-block": {
            display: "block"
        },
        ".mjx-span": {
            display: "inline"
        },
        ".mjx-char": {
            display: "block",
            "white-space": "pre"
        },
        ".mjx-itable": {
            display: "inline-table",
            width: "auto"
        },
        ".mjx-row": {
            display: "table-row"
        },
        ".mjx-cell": {
            display: "table-cell"
        },
        ".mjx-table": {
            display: "table",
            width: "100%"
        },
        ".mjx-line": {
            display: "block",
            height: 0
        },
        ".mjx-strut": {
            width: 0,
            "padding-top": k + "em"
        },
        ".mjx-vsize": {
            width: 0
        },
        ".MJXc-space1": {
            "margin-left": ".167em"
        },
        ".MJXc-space2": {
            "margin-left": ".222em"
        },
        ".MJXc-space3": {
            "margin-left": ".278em"
        },
        ".mjx-chartest": {
            display: "block",
            visibility: "hidden",
            position: "absolute",
            top: 0,
            "line-height": "normal",
            "font-size": "500%"
        },
        ".mjx-chartest .mjx-char": {
            display: "inline"
        },
        ".mjx-chartest .mjx-box": {
            "padding-top": "1000px"
        },
        ".MJXc-processing": {
            visibility: "hidden",
            position: "fixed",
            width: 0,
            height: 0,
            overflow: "hidden"
        },
        ".MJXc-processed": {
            display: "none"
        },
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
            overflow: "hidden",
            width: "1px",
            height: "60ex"
        },
        ".mjx-line-box-test": {
            display: "table!important"
        },
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
    var i = 1000000;
    var n = 5;
    var c = {}
      , r = MathJax.Hub.config;
    a.__Augment({
        settings: f.config.menuSettings,
        config: {
            styles: p
        },
        Config: function() {
            if (!this.require) {
                this.require = []
            }
            this.__SUPER(arguments).Config.call(this);
            var s = this.settings;
            if (s.scale) {
                this.config.scale = s.scale
            }
            this.require.push(this.fontDir + "/TeX/fontdata.js");
            this.require.push(MathJax.OutputJax.extensionDir + "/MathEvents.js");
            c = this.config.linebreaks
        },
        Startup: function() {
            e = MathJax.Extension.MathEvents.Event;
            q = MathJax.Extension.MathEvents.Touch;
            h = MathJax.Extension.MathEvents.Hover;
            this.ContextMenu = e.ContextMenu;
            this.Mousedown = e.AltContextMenu;
            this.Mouseover = h.Mouseover;
            this.Mouseout = h.Mouseout;
            this.Mousemove = h.Mousemove;
            var s = a.addElement(document.body, "mjx-block", {
                style: {
                    display: "block",
                    width: "5in"
                }
            });
            this.pxPerInch = s.offsetWidth / 5;
            s.parentNode.removeChild(s);
            this.TestSpan = a.Element("mjx-test", {
                style: {
                    left: "1em"
                }
            }, [["mjx-ex-box-test"]]);
            this.linebreakSpan = m.ElementSpan({
                className: "mjx-line-box-test"
            }, [["span"]]);
            return o.Styles(this.config.styles, ["InitializeCHTML", this])
        },
        InitializeCHTML: function() {
            this.getDefaultExEm();
            if (this.defaultEm) {
                return
            }
            var s = CallbackUtil.Create();
            o.timer.start(o, function(t) {
                if (t.time(s)) {
                    f.signal.Post(["CommonHTML Jax - no default em size"]);
                    return
                }
                a.getDefaultExEm();
                if (a.defaultEm) {
                    s()
                } else {
                    setTimeout(t, t.delay)
                }
            }, this.defaultEmDelay, this.defaultEmTimeout);
            return s
        },
        defaultEmDelay: 100,
        defaultEmTimeout: 1000,
        getDefaultExEm: function() {
            document.body.appendChild(this.TestSpan);
            document.body.appendChild(this.linebreakSpan);
            this.defaultEm = this.getFontSize(this.TestSpan);
            this.defaultEx = this.TestSpan.firstChild.offsetHeight / 60;
            this.defaultWidth = this.linebreakSpan.firstChild.offsetWidth;
            document.body.removeChild(this.linebreakSpan);
            document.body.removeChild(this.TestSpan)
        },
        getFontSize: (window.getComputedStyle ? function(t) {
            var s = window.getComputedStyle(t);
            return parseFloat(s.fontSize)
        }
        : function(s) {
            return s.style.pixelLeft
        }
        ),
        getMaxWidth: (window.getComputedStyle ? function(t) {
            var s = window.getComputedStyle(t);
            if (s.maxWidth !== "none") {
                return parseFloat(s.maxWidth)
            }
            return 0
        }
        : function(t) {
            var s = t.currentStyle.maxWidth;
            if (s !== "none") {
                if (s.match(/\d*px/)) {
                    return parseFloat(s)
                }
                var u = t.style.left;
                t.style.left = s;
                s = t.style.pixelLeft;
                t.style.left = u;
                return s
            }
            return 0
        }
        ),
        loadFont: function(s) {
            f.RestartAfter(o.Require(this.fontDir + "/" + s))
        },
        fontLoaded: function(s) {
            if (!s.match(/-|fontdata/)) {
                s += "-Regular"
            }
            if (!s.match(/\.js$/)) {
                s += ".js"
            }
            CallbackUtil.Queue(["Post", f.Startup.signal, ["CommonHTML - font data loaded", s]], ["loadComplete", o, this.fontDir + "/" + s])
        },
        Element: function(s, u, t) {
            if (s.substr(0, 4) === "mjx-") {
                if (!u) {
                    u = {}
                }
                if (u.isMathJax == null) {
                    u.isMathJax = true
                }
                if (u.className) {
                    u.className = s + " " + u.className
                } else {
                    u.className = s
                }
                s = "span"
            }
            return this.HTMLElement(s, u, t)
        },
        addElement: function(u, s, v, t) {
            return u.appendChild(this.Element(s, v, t))
        },
        HTMLElement: m.Element,
        ucMatch: m.ucMatch,
        setScript: m.setScript,
        getNode: function(x, w) {
            var u = RegExp("\\b" + w + "\\b");
            var t = [];
            while (x) {
                for (var v = 0, s = x.childNodes.length; v < s; v++) {
                    var y = x.childNodes[v];
                    if (y) {
                        if (u.test(y.className)) {
                            return y
                        }
                        if (y.id === "") {
                            t.push(y)
                        }
                    }
                }
                x = t.shift()
            }
            return null
        },
        preTranslate: function(w) {
            var v = w.jax[this.id], F, B = v.length, I, z, C, G, E, t, H, s, J;
            var y = 100000
              , x = false
              , D = 0
              , u = c.automatic
              , A = c.width;
            if (u) {
                x = !!A.match(/^\s*(\d+(\.\d*)?%\s*)?container\s*$/);
                if (x) {
                    A = A.replace(/\s*container\s*/, "")
                } else {
                    y = this.defaultWidth
                }
                if (A === "") {
                    A = "100%"
                }
            }
            for (F = 0; F < B; F++) {
                I = v[F];
                if (!I.parentNode) {
                    continue
                }
                z = I.previousSibling;
                if (z && z.className && String(z.className).substr(0, 9) === "mjx-chtml") {
                    z.parentNode.removeChild(z)
                }
                if (I.MathJax.preview) {
                    I.MathJax.preview.style.display = "none"
                }
                t = I.MathJax.elementJax;
                if (!t) {
                    continue
                }
                t.CHTML = {
                    display: (t.root.Get("display") === "block"),
                    preview: (t.CHTML || {}).preview
                };
                C = a.Element("mjx-chtml", {
                    id: t.inputID + "-Frame",
                    className: "MathJax_CHTML",
                    isMathJax: true,
                    jaxID: this.id,
                    oncontextmenu: e.Menu,
                    onmousedown: e.Mousedown,
                    onmouseover: e.Mouseover,
                    onmouseout: e.Mouseout,
                    onmousemove: e.Mousemove,
                    onclick: e.Click,
                    ondblclick: e.DblClick,
                    onkeydown: e.Keydown,
                    tabIndex: f.getTabOrder(t)
                });
                if (t.CHTML.display) {
                    var K = a.Element("mjx-chtml", {
                        className: "MJXc-display",
                        isMathJax: false
                    });
                    K.appendChild(C);
                    C = K
                }
                if (f.Browser.noContextMenu) {
                    C.ontouchstart = q.start;
                    C.ontouchend = q.end
                }
                C.className += " MJXc-processing";
                I.parentNode.insertBefore(C, I);
                I.parentNode.insertBefore(this.linebreakSpan.cloneNode(true), I);
                I.parentNode.insertBefore(this.TestSpan.cloneNode(true), I)
            }
            for (F = 0; F < B; F++) {
                I = v[F];
                if (!I.parentNode) {
                    continue
                }
                G = I.previousSibling;
                t = I.MathJax.elementJax;
                if (!t) {
                    continue
                }
                s = a.getFontSize(G);
                H = G.firstChild.offsetHeight / 60;
                D = Math.max(0, G.previousSibling.firstChild.offsetWidth - 2);
                if (H === 0 || H === "NaN") {
                    H = this.defaultEx;
                    D = this.defaultWidth
                }
                if (x) {
                    y = D
                }
                J = (this.config.matchFontHeight ? H / this.TEX.x_height / s : 1);
                J = Math.floor(Math.max(this.config.minScaleAdjust / 100, J) * this.config.scale);
                t.CHTML.scale = J / 100;
                t.CHTML.fontSize = J + "%";
                t.CHTML.outerEm = s;
                t.CHTML.em = this.em = s * J / 100;
                t.CHTML.ex = H;
                t.CHTML.cwidth = D / this.em;
                t.CHTML.lineWidth = (u ? this.length2em(A, y / this.em, 1) : y)
            }
            for (F = 0; F < B; F++) {
                I = v[F];
                if (!I.parentNode) {
                    continue
                }
                G = I.previousSibling;
                E = G.previousSibling;
                t = I.MathJax.elementJax;
                if (!t) {
                    continue
                }
                E.parentNode.removeChild(E);
                G.parentNode.removeChild(G);
                if (I.MathJax.preview) {
                    I.MathJax.preview.style.display = ""
                }
            }
            w.CHTMLeqn = w.CHTMLlast = 0;
            w.CHTMLi = -1;
            w.CHTMLchunk = this.config.EqnChunk;
            w.CHTMLdelay = false
        },
        Translate: function(t, x) {
            if (!t.parentNode) {
                return
            }
            if (x.CHTMLdelay) {
                x.CHTMLdelay = false;
                f.RestartAfter(CallbackUtil.Delay(this.config.EqnChunkDelay))
            }
            var s = t.MathJax.elementJax
              , w = s.root
              , v = document.getElementById(s.inputID + "-Frame");
            if (!v) {
                return
            }
            this.getMetrics(s);
            if (this.scale !== 1) {
                v.style.fontSize = s.CHTML.fontSize
            }
            this.initCHTML(w, v);
            this.savePreview(t);
            this.CHTMLnode = v;
            try {
                w.setTeXclass();
                w.toCommonHTML(v)
            } catch (u) {
                while (v.firstChild) {
                    v.removeChild(v.firstChild)
                }
                delete this.CHTMLnode;
                this.restorePreview(t);
                throw u
            }
            delete this.CHTMLnode;
            this.restorePreview(t);
            if (s.CHTML.display) {
                v = v.parentNode
            }
            v.className = v.className.replace(/ [^ ]+$/, "");
            v.className += " MJXc-processed";
            if (t.MathJax.preview) {
                s.CHTML.preview = t.MathJax.preview;
                delete t.MathJax.preview
            }
            x.CHTMLeqn += (x.i - x.CHTMLi);
            x.CHTMLi = x.i;
            if (x.CHTMLeqn >= x.CHTMLlast + x.CHTMLchunk) {
                this.postTranslate(x);
                x.CHTMLchunk = Math.floor(x.CHTMLchunk * this.config.EqnChunkFactor);
                x.CHTMLdelay = true
            }
        },
        initCHTML: function(t, s) {},
        savePreview: function(s) {
            var t = s.MathJax.preview;
            if (t && t.parentNode) {
                s.MathJax.tmpPreview = document.createElement("span");
                t.parentNode.replaceChild(s.MathJax.tmpPreview, t)
            }
        },
        restorePreview: function(s) {
            var t = s.MathJax.tmpPreview;
            if (t) {
                t.parentNode.replaceChild(s.MathJax.preview, t);
                delete s.MathJax.tmpPreview
            }
        },
        getMetrics: function(s) {
            var t = s.CHTML;
            this.jax = s;
            this.em = t.em;
            this.outerEm = t.outerEm;
            this.scale = t.scale;
            this.cwidth = t.cwidth;
            this.linebreakWidth = t.lineWidth
        },
        postTranslate: function(x) {
            var t = x.jax[this.id];
            for (var v = x.CHTMLlast, s = x.CHTMLeqn; v < s; v++) {
                var u = t[v];
                if (u && u.MathJax.elementJax) {
                    u.previousSibling.className = u.previousSibling.className.replace(/ [^ ]+$/, "");
                    var w = u.MathJax.elementJax.CHTML;
                    if (w.preview) {
                        w.preview.innerHTML = "";
                        w.preview.style.display = "none";
                        u.MathJax.preview = w.preview;
                        delete w.preview
                    }
                }
            }
            x.CHTMLlast = x.CHTMLeqn
        },
        getJaxFromMath: function(s) {
            if (s.parentNode.className.match(/MJXc-display/)) {
                s = s.parentNode
            }
            do {
                s = s.nextSibling
            } while (s && s.nodeName.toLowerCase() !== "script");
            return f.getJaxFor(s)
        },
        getHoverSpan: function(s, t) {
            return s.root.CHTMLnodeElement()
        },
        getHoverBBox: function(s, v, w) {
            var x = s.root.CHTML
              , u = s.CHTML.outerEm;
            var t = {
                w: x.w * u,
                h: x.h * u,
                d: x.d * u
            };
            if (x.width) {
                t.width = x.width
            }
            return t
        },
        Zoom: function(u, B, A, s, y) {
            this.getMetrics(u);
            var v = a.addElement(B, "mjx-chtml", {
                style: {
                    "font-size": Math.floor(a.scale * 100) + "%"
                },
                isMathJax: false
            });
            a.CHTMLnode = v;
            this.idPostfix = "-zoom";
            u.root.toCommonHTML(v);
            this.idPostfix = "";
            var t = v.style
              , C = u.root.CHTML;
            if (C.t > C.h) {
                t.marginTop = a.Em(C.t - C.h)
            }
            if (C.b > C.d) {
                t.marginBottom = a.Em(C.b - C.d)
            }
            if (C.l < 0) {
                t.paddingLeft = a.Em(-C.l)
            }
            if (C.r > C.w) {
                t.marginRight = a.Em(C.r - C.w)
            }
            t.position = "absolute";
            var z = v.offsetWidth
              , x = v.offsetHeight
              , D = A.firstChild.offsetHeight
              , w = A.firstChild.offsetWidth;
            v.style.position = "";
            return {
                Y: -e.getBBox(B).h,
                mW: w,
                mH: D,
                zW: z,
                zH: x
            }
        },
        Remove: function(s) {
            var t = document.getElementById(s.inputID + "-Frame");
            if (t && s.CHTML.display) {
                t = t.parentNode
            }
            if (t) {
                t.parentNode.removeChild(t)
            }
            delete s.CHTML
        },
        ID: 0,
        idPostfix: "",
        GetID: function() {
            this.ID++;
            return this.ID
        },
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
            infinity: i
        },
        SPACECLASS: {
            thinmathspace: "MJXc-space1",
            mediummathspace: "MJXc-space2",
            thickmathspace: "MJXc-space3"
        },
        pxPerInch: 96,
        em: 16,
        maxStretchyParts: 1000,
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
        unicodeChar: function(s) {
            if (s < 65535) {
                return String.fromCharCode(s)
            }
            s -= 65536;
            return String.fromCharCode((s >> 10) + 55296) + String.fromCharCode((s & 1023) + 56320)
        },
        getUnicode: function(s) {
            var t = s.text.charCodeAt(s.i);
            s.i++;
            if (t >= 55296 && t < 56319) {
                t = (((t - 55296) << 10) + (s.text.charCodeAt(s.i) - 56320)) + 65536;
                s.i++
            }
            return t
        },
        getCharList: function(w, v) {
            var u, z, s = w.cache, B = v;
            if (s[v]) {
                return s[v]
            }
            if (v > 65535 && this.FONTDATA.RemapPlane1) {
                var y = this.FONTDATA.RemapPlane1(v, w);
                v = y.n;
                w = y.variant
            }
            var t = this.FONTDATA.RANGES
              , A = this.FONTDATA.VARIANT;
            if (v >= t[0].low && v <= t[t.length - 1].high) {
                for (u = 0,
                z = t.length; u < z; u++) {
                    if (t[u].name === "alpha" && w.noLowerCase) {
                        continue
                    }
                    var x = w["offset" + t[u].offset];
                    if (x && v >= t[u].low && v <= t[u].high) {
                        if (t[u].remap && t[u].remap[v]) {
                            v = x + t[u].remap[v]
                        } else {
                            v = v - t[u].low + x;
                            if (t[u].add) {
                                v += t[u].add
                            }
                        }
                        if (w["variant" + t[u].offset]) {
                            w = A[w["variant" + t[u].offset]]
                        }
                        break
                    }
                }
            }
            s[B] = this.remapChar(w, v, 0);
            return s[B]
        },
        remapChar: function(t, y, w) {
            var v = []
              , x = this.FONTDATA.VARIANT;
            if (t.remap && t.remap[y]) {
                y = t.remap[y];
                if (t.remap.variant) {
                    t = x[t.remap.variant]
                }
            } else {
                if (this.FONTDATA.REMAP[y] && !t.noRemap) {
                    y = this.FONTDATA.REMAP[y]
                }
            }
            if (g(y)) {
                if (y[2]) {
                    w = n
                }
                t = x[y[1]];
                y = y[0]
            }
            if (typeof (y) === "string") {
                var s = {
                    text: y,
                    i: 0,
                    length: y.length
                };
                while (s.i < s.length) {
                    y = this.getUnicode(s);
                    var u = this.getCharList(t, y);
                    if (u) {
                        v.push.apply(v, u)
                    }
                }
            } else {
                if (t.cache[y]) {
                    v = t.cache[y]
                } else {
                    t.cache[y] = v = this.lookupChar(t, y, w)
                }
            }
            return v
        },
        lookupChar: function(v, z, x) {
            var y = v;
            while (v) {
                for (var u = 0, s = v.fonts.length; u < s; u++) {
                    var t = this.FONTDATA.FONTS[v.fonts[u]];
                    if (typeof (t) === "string") {
                        this.loadFont(t)
                    }
                    var w = t[z];
                    if (w) {
                        this.fixChar(w, z);
                        if (w[5].space) {
                            return [{
                                type: "space",
                                w: w[2],
                                font: t
                            }]
                        }
                        return [{
                            type: "char",
                            font: t,
                            n: z
                        }]
                    } else {
                        if (t.Extra) {
                            this.findBlock(t, z)
                        }
                    }
                }
                v = this.FONTDATA.VARIANT[v.chain];
                if (v && v.remap && v.remap[z] && x++ < n) {
                    return this.remapChar(v, z, x)
                }
            }
            return [this.unknownChar(y, z)]
        },
        fixChar: function(s, t) {
            if (s.length === 5) {
                s[5] = {}
            }
            if (s.c == null) {
                s[0] /= 1000;
                s[1] /= 1000;
                s[2] /= 1000;
                s[3] /= 1000;
                s[4] /= 1000;
                s.c = this.unicodeChar(t)
            }
            return s
        },
        findBlock: function(u, y) {
            var t = u.Extra, v = u.file, x;
            for (var w = 0, s = t.length; w < s; w++) {
                if (typeof (t[w]) === "number") {
                    if (y === t[w]) {
                        x = v;
                        break
                    }
                } else {
                    if (y < t[w][0]) {
                        return
                    }
                    if (y <= t[w][1]) {
                        x = v;
                        break
                    }
                }
            }
            if (x) {
                delete u.Extra;
                this.loadFont(v)
            }
        },
        unknownChar: function(s, v) {
            f.signal.Post(["CommonHTML Jax - unknown char", v, s]);
            var u = "";
            if (s.bold) {
                u += "B"
            }
            if (s.italic) {
                u += "I"
            }
            var t = this.FONTDATA.UNKNOWN[u || "R"];
            if (!t[v]) {
                this.getUnknownChar(t, v)
            }
            return {
                type: "unknown",
                n: v,
                font: t
            }
        },
        getUnknownChar: function(t, v) {
            var u = this.unicodeChar(v);
            var s = this.getHDW(u, t.className);
            t[v] = [0.8, 0.2, s.w, 0, s.w, {
                a: Math.max(0, (s.h - s.d) / 2),
                h: s.h,
                d: s.d
            }];
            t[v].c = u
        },
        styledText: function(t, w) {
            f.signal.Post(["CommonHTML Jax - styled text", w, t]);
            var u = t.style;
            var x = "_" + (u["font-family"] || t.className || "");
            if (u["font-weight"]) {
                x += "_" + u["font-weight"]
            }
            if (u["font-style"]) {
                x += "_" + u["font-style"]
            }
            if (!this.STYLEDTEXT) {
                this.STYLEDTEXT = {}
            }
            if (!this.STYLEDTEXT[x]) {
                this.STYLEDTEXT[x] = {
                    className: t.className || ""
                }
            }
            var v = this.STYLEDTEXT[x];
            if (!v["_" + w]) {
                var s = this.getHDW(w, t.className || "", u);
                v["_" + w] = [0.8, 0.2, s.w, 0, s.w, {
                    a: Math.max(0, (s.h - s.d) / 2),
                    h: s.h,
                    d: s.d
                }];
                v["_" + w].c = w
            }
            return {
                type: "unknown",
                n: "_" + w,
                font: v,
                style: u,
                rscale: t.rscale
            }
        },
        getHDW: function(B, u, F) {
            var t = a.addElement(a.CHTMLnode, "mjx-chartest", {
                className: u
            }, [["mjx-char", {
                style: F
            }, [B]]]);
            var s = a.addElement(a.CHTMLnode, "mjx-chartest", {
                className: u
            }, [["mjx-char", {
                style: F
            }, [B, ["mjx-box"]]]]);
            t.firstChild.style.fontSize = s.firstChild.style.fontSize = "";
            var v = 5 * a.em;
            var E = t.offsetHeight
              , C = s.offsetHeight
              , x = t.offsetWidth;
            a.CHTMLnode.removeChild(t);
            a.CHTMLnode.removeChild(s);
            if (C === 0) {
                v = 5 * a.defaultEm;
                var A = document.body.appendChild(document.createElement("div"));
                A.appendChild(t);
                A.appendChild(s);
                E = t.offsetHeight,
                C = s.offsetHeight,
                x = t.offsetWidth;
                document.body.removeChild(A)
            }
            var z = (C - 1000) / v
              , D = x / v
              , y = E / v - z;
            return {
                h: y,
                d: z,
                w: D
            }
        },
        addCharList: function(v, x, y) {
            var w = {
                text: "",
                className: null,
                a: 0
            };
            for (var t = 0, s = x.length; t < s; t++) {
                var u = x[t];
                if (this.charList[u.type]) {
                    (this.charList[u.type])(u, v, y, w, s)
                }
            }
            if (w.text !== "") {
                if (v.childNodes.length) {
                    this.charList.flushText(v, w)
                } else {
                    m.addText(v, w.text);
                    if (v.className) {
                        v.className += " " + w.className
                    } else {
                        v.className = w.className
                    }
                }
            }
            y.b = (w.flushed ? 0 : y.a)
        },
        charList: {
            "char": function(D, x, B, u, y) {
                var w = D.font
                  , A = (w.remapCombining || {})[D.n];
                if (w.className === u.className) {
                    A = null
                } else {
                    if (u.className || (A && u.text !== "")) {
                        this.flushText(x, u)
                    }
                }
                if (!u.a) {
                    u.a = w.centerline / 1000
                }
                if (u.a > (B.a || 0)) {
                    B.a = u.a
                }
                u.className = w.className;
                var t = w[D.n];
                if (A) {
                    var v = w;
                    if (g(A)) {
                        v = a.FONTDATA.FONTS[A[1]];
                        A = A[0];
                        if (typeof (v) === "string") {
                            a.loadFont(v)
                        }
                    }
                    if (v[D.n]) {
                        a.fixChar(v[D.n], D.n)
                    }
                    t = a.fixChar(v[A], A);
                    u.className = v.className
                }
                u.text += t.c;
                if (B.h < t[0] + j) {
                    B.t = B.h = t[0] + j
                }
                if (B.d < t[1] + b) {
                    B.b = B.d = t[1] + b
                }
                if (B.l > B.w + t[3]) {
                    B.l = B.w + t[3]
                }
                if (B.r < B.w + t[4]) {
                    B.r = B.w + t[4]
                }
                B.w += t[2] * (D.rscale || 1);
                if (y == 1 && w.skew && w.skew[D.n]) {
                    B.skew = w.skew[D.n]
                }
                if (t[5] && t[5].rfix) {
                    this.flushText(x, u).style.marginRight = a.Em(t[5].rfix / 1000)
                }
                if (A) {
                    var z = this.flushText(x, u);
                    var s = (v[D.n] || w[D.n])[4] - (t[4] - t[2]);
                    z.style.marginLeft = a.Em(-t[2] - s);
                    if (s < 0) {
                        z.style.marginRight = a.Em(-s)
                    }
                }
            },
            space: function(t, s, v, u) {
                if (t.w) {
                    if (u.text === "") {
                        u.className = t.font.className
                    }
                    this.flushText(s, u).style.marginRight = a.Em(t.w);
                    v.w += t.w
                }
            },
            unknown: function(t, s, w, u) {
                (this["char"])(t, s, w, u, 0);
                var v = t.font[t.n];
                if (v[5].a) {
                    u.a = v[5].a;
                    if (w.a == null || u.a > w.a) {
                        w.a = u.a
                    }
                }
                s = this.flushText(s, u, t.style);
                if (v[2] < 3) {
                    s.style.width = a.Em(v[2])
                }
            },
            flushText: function(t, u, s) {
                t = a.addElement(t, "mjx-charbox", {
                    className: u.className,
                    style: s
                }, [u.text]);
                if (u.a) {
                    t.style.paddingBottom = a.Em(u.a)
                }
                u.text = "";
                u.className = null;
                u.a = 0;
                u.flushed = true;
                return t
            }
        },
        handleText: function(u, x, t, w) {
            if (u.childNodes.length === 0) {
                a.addElement(u, "mjx-char");
                w = a.BBOX.empty(w)
            }
            if (typeof (t) === "string") {
                t = this.FONTDATA.VARIANT[t]
            }
            if (!t) {
                t = this.FONTDATA.VARIANT[d.VARIANT.NORMAL]
            }
            var s = {
                text: x,
                i: 0,
                length: x.length
            }
              , v = [];
            if (t.style && s.length) {
                v.push(this.styledText(t, x))
            } else {
                while (s.i < s.length) {
                    var y = this.getUnicode(s);
                    v.push.apply(v, this.getCharList(t, y))
                }
            }
            if (v.length) {
                this.addCharList(u.firstChild, v, w)
            }
            w.clean();
            if (w.d < 0) {
                w.D = w.d;
                w.d = 0
            }
            if (w.h - w.a) {
                u.firstChild.style[w.h - w.a < 0 ? "marginTop" : "paddingTop"] = this.EmRounded(w.h - w.a)
            }
            if (w.d > -w.b) {
                u.firstChild.style.paddingBottom = this.EmRounded(w.d + w.b)
            }
            return w
        },
        createDelimiter: function(x, s, u, A, v) {
            if (!s) {
                var B = this.BBOX.zero();
                B.w = B.r = this.TEX.nulldelimiterspace;
                a.addElement(x, "mjx-box", {
                    style: {
                        width: B.w
                    }
                });
                return B
            }
            if (!(u instanceof Array)) {
                u = [u, u]
            }
            var z = u[1];
            u = u[0];
            var t = {
                alias: s
            };
            while (t.alias) {
                s = t.alias;
                t = this.FONTDATA.DELIMITERS[s];
                if (!t) {
                    t = {
                        HW: [0, this.FONTDATA.VARIANT[d.VARIANT.NORMAL]]
                    }
                }
            }
            if (t.load) {
                f.RestartAfter(o.Require(this.fontDir + "/TeX/fontdata-" + t.load + ".js"))
            }
            for (var y = 0, w = t.HW.length; y < w; y++) {
                if (t.HW[y][0] >= u - 0.01 || (y == w - 1 && !t.stretch)) {
                    if (t.HW[y][3]) {
                        s = t.HW[y][3]
                    }
                    B = this.createChar(x, [s, t.HW[y][1]], (t.HW[y][2] || 1), v);
                    B.offset = 0.6 * B.w;
                    if (A) {
                        B.scale = A.scale;
                        A.rscale = A.rscale
                    }
                    return B
                }
            }
            if (!t.stretch) {
                return B
            }
            return this["extendDelimiter" + t.dir](x, z, t.stretch, A, v)
        },
        extendDelimiterV: function(E, x, P, w, C) {
            E = a.addElement(E, "mjx-delim-v");
            var N = a.Element("span");
            var B, A, O, v, I, t, F, y, G = 1, M;
            I = this.createChar(N, (P.top || P.ext), 1, C);
            B = N.removeChild(N.firstChild);
            t = this.createChar(N, (P.bot || P.ext), 1, C);
            A = N.removeChild(N.firstChild);
            F = y = a.BBOX.zero();
            var J = I.h + I.d + t.h + t.d - l;
            E.appendChild(B);
            if (P.mid) {
                F = this.createChar(N, P.mid, 1, C);
                O = N.removeChild(N.firstChild);
                J += F.h + F.d;
                G = 2
            }
            if (P.min && x < J * P.min) {
                x = J * P.min
            }
            if (x > J) {
                y = this.createChar(N, P.ext, 1, C);
                v = N.removeChild(N.firstChild);
                var L = y.h + y.d
                  , u = L - l;
                var D = Math.min(Math.ceil((x - J) / (G * u)), this.maxStretchyParts);
                if (P.fullExtenders) {
                    x = D * G * u + J
                } else {
                    u = (x - J) / (G * D)
                }
                M = y.d + y.a - L / 2;
                v.style.margin = v.style.padding = "";
                v.style.lineHeight = a.Em(u);
                v.style.marginBottom = a.Em(M - l / 2 / G);
                v.style.marginTop = a.Em(-M - l / 2 / G);
                var K = v.textContent
                  , z = "\n" + K;
                while (--D > 0) {
                    K += z
                }
                v.textContent = K;
                E.appendChild(v);
                if (P.mid) {
                    E.appendChild(O);
                    E.appendChild(v.cloneNode(true))
                }
            } else {
                M = (x - J - l) / G;
                B.style.marginBottom = a.Em(M + parseFloat(B.style.marginBottom || "0"));
                if (P.mid) {
                    E.appendChild(O)
                }
                A.style.marginTop = a.Em(M + parseFloat(A.style.marginTop || "0"))
            }
            E.appendChild(A);
            var s = a.BBOX({
                w: Math.max(I.w, y.w, t.w, F.w),
                l: Math.min(I.l, y.l, t.l, F.l),
                r: Math.max(I.r, y.r, t.r, F.r),
                h: x - t.d,
                d: t.d,
                t: x - t.d,
                b: t.d
            });
            s.offset = 0.5 * s.w;
            if (w) {
                s.scale = w.scale;
                s.rscale = w.rscale
            }
            return s
        },
        extendDelimiterH: function(F, s, P, v, D) {
            F = a.addElement(F, "mjx-delim-h");
            var N = a.Element("span");
            var t, M, O, u, K, C, x, G, z, H = 1;
            C = this.createChar(N, (P.left || P.rep), 1, D);
            t = N.removeChild(N.firstChild);
            x = this.createChar(N, (P.right || P.rep), 1, D);
            M = N.removeChild(N.firstChild);
            z = this.createChar(N, P.rep, 1, D);
            u = N.removeChild(N.firstChild);
            t.style.marginLeft = a.Em(-C.l);
            M.style.marginRight = a.Em(x.r - x.w);
            F.appendChild(t);
            var Q = a.BBOX.zero();
            Q.h = Math.max(C.h, x.h, z.h);
            Q.d = Math.max(C.D || C.d, x.D || x.d, z.D || z.d);
            var y = (C.r - C.l) + (x.r - x.l) - l;
            if (P.mid) {
                G = this.createChar(N, P.mid, 1, D);
                O = N.removeChild(N.firstChild);
                O.style.marginleft = a.Em(-G.l);
                O.style.marginRight = a.Em(G.r - G.w);
                y += G.r - G.l + l;
                H = 2;
                if (G.h > Q.h) {
                    Q.h = G.h
                }
                if (G.d > Q.d) {
                    Q.d = G.d
                }
            }
            if (P.min && s < y * P.min) {
                s = y * P.min
            }
            Q.w = Q.r = s;
            if (s > y) {
                var B = z.r - z.l
                  , J = B - l;
                var E = Math.min(Math.ceil((s - y) / (H * J)), this.maxStretchyParts);
                if (P.fullExtenders) {
                    s = E * H * J + y
                } else {
                    J = (s - y) / (H * E)
                }
                var L = (B - J + l / H) / 2;
                u.style.marginLeft = a.Em(-z.l - L);
                u.style.marginRight = a.Em(z.r - z.w + L);
                u.style.letterSpacing = a.Em(-(z.w - J));
                t.style.marginRight = a.Em(C.r - C.w);
                M.style.marginleft = a.Em(-x.l);
                var I = u.textContent
                  , A = I;
                while (--E > 0) {
                    I += A
                }
                u.textContent = I;
                F.appendChild(u);
                if (P.mid) {
                    F.appendChild(O);
                    K = F.appendChild(u.cloneNode(true))
                }
            } else {
                L = (s - y - l / H) / 2;
                t.style.marginRight = a.Em(C.r - C.w + L);
                if (P.mid) {
                    F.appendChild(O)
                }
                M.style.marginLeft = a.Em(-x.l + L)
            }
            F.appendChild(M);
            this.adjustHeights([t, u, O, K, M], [C, z, G, z, x], Q);
            if (v) {
                Q.scale = v.scale;
                Q.rscale = v.rscale
            }
            return Q
        },
        adjustHeights: function(t, w, x) {
            var u = x.h
              , y = x.d;
            if (x.d < 0) {
                y = -x.d;
                x.D = x.d;
                x.d = 0
            }
            for (var v = 0, s = t.length; v < s; v++) {
                if (t[v]) {
                    t[v].style.paddingTop = a.Em(u - w[v].a);
                    t[v].style.paddingBottom = a.Em(y + w[v].a);
                    t[v].style.marginTop = t[v].style.marginBottom = 0
                }
            }
        },
        createChar: function(u, y, w, t) {
            var B = ""
              , x = {
                fonts: [y[1]],
                noRemap: true,
                cache: {}
            };
            if (t && t === d.VARIANT.BOLD && this.FONTDATA.FONTS[y[1] + "-Bold"]) {
                x.fonts = [y[1] + "-Bold", y[1]]
            }
            if (typeof (y[1]) !== "string") {
                x = y[1]
            }
            if (y[0]instanceof Array) {
                for (var z = 0, v = y[0].length; z < v; z++) {
                    B += String.fromCharCode(y[0][z])
                }
            } else {
                B = String.fromCharCode(y[0])
            }
            if (y[4]) {
                w *= y[4]
            }
            var A = this.handleText(u, B, x)
              , s = u.firstChild.style;
            if (w !== 1) {
                s.fontSize = this.Percent(w)
            }
            if (y[2]) {
                s.paddingLeft = this.Em(y[2]);
                A.w += y[2];
                A.r += y[2]
            }
            if (y[3]) {
                s.verticalAlign = this.Em(y[3]);
                A.h += y[3];
                if (A.h < 0) {
                    A.h = 0
                }
            }
            if (y[5]) {
                s.marginTop = this.Em(y[5]);
                A.h += y[5];
                A.t += y[5]
            }
            if (y[6]) {
                s.marginBottom = this.Em(y[6]);
                A.d += y[6];
                A.b += y[6]
            }
            return A
        },
        length2em: function(w, u, x) {
            if (typeof (w) !== "string") {
                w = w.toString()
            }
            if (w === "") {
                return ""
            }
            if (w === d.SIZE.NORMAL) {
                return 1
            }
            if (w === d.SIZE.BIG) {
                return 2
            }
            if (w === d.SIZE.SMALL) {
                return 0.71
            }
            if (this.MATHSPACE[w]) {
                return this.MATHSPACE[w]
            }
            var t = w.match(/^\s*([-+]?(?:\.\d+|\d+(?:\.\d*)?))?(pt|em|ex|mu|px|pc|in|mm|cm|%)?/);
            var s = parseFloat(t[1] || "1")
              , v = t[2];
            if (u == null) {
                u = 1
            }
            if (!x) {
                x = 1
            }
            x = 1 / this.em / x;
            if (v === "em") {
                return s
            }
            if (v === "ex") {
                return s * this.TEX.x_height
            }
            if (v === "%") {
                return s / 100 * u
            }
            if (v === "px") {
                return s * x
            }
            if (v === "pt") {
                return s / 10
            }
            if (v === "pc") {
                return s * 1.2
            }
            x *= this.pxPerInch;
            if (v === "in") {
                return s * x
            }
            if (v === "cm") {
                return s * x / 2.54
            }
            if (v === "mm") {
                return s * x / 25.4
            }
            if (v === "mu") {
                return s / 18
            }
            return s * u
        },
        thickness2em: function(s, t) {
            var u = a.TEX.rule_thickness / (t || 1);
            if (s === d.LINETHICKNESS.MEDIUM) {
                return u
            }
            if (s === d.LINETHICKNESS.THIN) {
                return 0.67 * u
            }
            if (s === d.LINETHICKNESS.THICK) {
                return 1.67 * u
            }
            return this.length2em(s, u, t)
        },
        Em: function(s) {
            if (Math.abs(s) < 0.001) {
                return "0"
            }
            return (s.toFixed(3).replace(/\.?0+$/, "")) + "em"
        },
        EmRounded: function(s) {
            s = (Math.round(s * a.em) + 0.05) / a.em;
            if (Math.abs(s) < 0.0006) {
                return "0em"
            }
            return s.toFixed(3).replace(/\.?0+$/, "") + "em"
        },
        unEm: function(s) {
            return parseFloat(s)
        },
        Px: function(s, t) {
            s *= this.em;
            if (t && s < t) {
                s = t
            }
            if (Math.abs(s) < 0.1) {
                return "0"
            }
            return s.toFixed(1).replace(/\.0$/, "") + "px"
        },
        Percent: function(s) {
            return (100 * s).toFixed(1).replace(/\.?0+$/, "") + "%"
        },
        Transform: function(v, t, s) {
            var u = v.style;
            u.transform = u.WebkitTransform = u.MozTransform = u["-ms-transform"] = t;
            if (s) {
                u.transformOrigin = u.WebkitTransformOrigin = u.MozTransformOrigin = u["-ms-transform-origin"] = s
            }
        },
        arrayEntry: function(s, t) {
            return s[Math.max(0, Math.min(t, s.length - 1))]
        },
        removeStyles: ["fontSize", "fontFamily", "fontWeight", "fontStyle", "fontVariant", "font"]
    });
    a.BBOX = MathJax.Object.__Subclass({
        __Init: function(s) {
            for (var t in s) {
                if (s.hasOwnProperty(t)) {
                    this[t] = s[t]
                }
            }
        },
        clean: function() {
            if (this.h === -i) {
                this.h = 0
            }
            if (this.d === -i) {
                this.d = 0
            }
            if (this.l === i) {
                this.l = 0
            }
            if (this.r === -i) {
                this.r = 0
            }
            if (this.t === -i) {
                this.t = 0
            }
            if (this.b === -i) {
                this.b = 0
            }
            if (this.D && this.d > 0) {
                delete this.D
            }
        },
        rescale: function(s) {
            this.w *= s;
            this.h *= s;
            this.d *= s;
            this.l *= s;
            this.r *= s;
            this.t *= s;
            this.b *= s;
            if (this.L) {
                this.L *= s
            }
            if (this.R) {
                this.R *= s
            }
            if (this.D) {
                this.D *= s
            }
        },
        combine: function(t, s, v) {
            t.X = s;
            t.Y = v;
            var u = t.rscale;
            if (s + u * t.r > this.r) {
                this.r = s + u * t.r
            }
            if (s + u * t.l < this.l) {
                this.l = s + u * t.l
            }
            if (s + u * (t.w + (t.L || 0) + (t.R || 0)) > this.w) {
                this.w = s + u * (t.w + (t.L || 0) + (t.R || 0))
            }
            if (v + u * t.h > this.h) {
                this.h = v + u * t.h
            }
            if (t.D && (this.D == null || u * t.D - v > this.D) && u * t.D > this.d) {
                this.D = u * t.D - v
            } else {
                if (t.D == null && this.D) {
                    delete this.D
                }
            }
            if (u * t.d - v > this.d) {
                this.d = u * t.d - v
            }
            if (v + u * t.t > this.t) {
                this.t = v + u * t.t
            }
            if (u * t.b - v > this.b) {
                this.b = u * t.b - v
            }
        },
        append: function(t) {
            var u = t.rscale;
            var s = this.w;
            if (s + u * t.r > this.r) {
                this.r = s + u * t.r
            }
            if (s + u * t.l < this.l) {
                this.l = s + u * t.l
            }
            this.w += u * (t.w + (t.L || 0) + (t.R || 0));
            if (u * t.h > this.h) {
                this.h = u * t.h
            }
            if (t.D && (this.D == null || u * t.D > this.D) && u * t.D > this.d) {
                this.D = u * t.D
            } else {
                if (t.D == null && this.D) {
                    delete this.D
                }
            }
            if (u * t.d > this.d) {
                this.d = u * t.d
            }
            if (u * t.t > this.t) {
                this.t = u * t.t
            }
            if (u * t.b > this.b) {
                this.b = u * t.b
            }
        },
        updateFrom: function(s) {
            this.h = s.h;
            this.d = s.d;
            this.w = s.w;
            this.r = s.r;
            this.l = s.l;
            this.t = s.t;
            this.b = s.b;
            if (s.pwidth) {
                this.pwidth = s.pwidth
            }
            if (s.D) {
                this.D = s.D
            } else {
                delete this.D
            }
        },
        adjust: function(t, s, v, u) {
            this[s] += a.length2em(t, 1, this.scale);
            if (u == null) {
                if (this[s] > this[v]) {
                    this[v] = this[s]
                }
            } else {
                if (this[v] < u) {
                    this[v] = u
                }
            }
        }
    }, {
        zero: function() {
            return a.BBOX({
                h: 0,
                d: 0,
                w: 0,
                l: 0,
                r: 0,
                t: 0,
                b: 0,
                scale: 1,
                rscale: 1
            })
        },
        empty: function(s) {
            if (!s) {
                s = a.BBOX.zero()
            }
            s.h = s.d = s.r = s.t = s.b = -i;
            s.w = 0;
            s.l = i;
            delete s.pwidth;
            return s
        },
        styleAdjust: [["borderTopWidth", "h", "t"], ["borderRightWidth", "w", "r"], ["borderBottomWidth", "d", "b"], ["borderLeftWidth", "w", "l", 0], ["paddingTop", "h", "t"], ["paddingRight", "w", "r"], ["paddingBottom", "d", "b"], ["paddingLeft", "w", "l", 0], ]
    });
    MathJax.Hub.Register.StartupHook("mml Jax Ready", function() {
        d = MathJax.ElementJax.mml;
        d.mbase.__Augment({
            toCommonHTML: function(t, s) {
                return this.CHTMLdefaultNode(t, s)
            },
            CHTMLmultiline: function() {
                d.mbase.CHTMLautoloadFile("multiline")
            },
            CHTMLdefaultNode: function(v, t) {
                if (!t) {
                    t = {}
                }
                v = this.CHTMLcreateNode(v);
                this.CHTML = a.BBOX.empty();
                this.CHTMLhandleStyle(v);
                if (this.isToken) {
                    this.CHTMLgetVariant()
                }
                this.CHTMLhandleScale(v);
                var s = Math.max((t.minChildren || 0), this.data.length);
                for (var u = 0; u < s; u++) {
                    this.CHTMLaddChild(v, u, t)
                }
                if (!t.noBBox) {
                    this.CHTML.clean()
                }
                this.CHTMLhandleSpace(v);
                this.CHTMLhandleBBox(v);
                this.CHTMLhandleColor(v);
                return v
            },
            CHTMLaddChild: function(x, t, s) {
                var z = this.data[t], w;
                var u = s.childNodes;
                if (u instanceof Array) {
                    u = u[t] || "span"
                }
                if (z) {
                    if (u) {
                        x = a.addElement(x, u)
                    }
                    w = z.toCommonHTML(x, s.childOptions);
                    if (u && z.CHTML.rscale !== 1) {
                        x.style.fontSize = x.firstChild.style.fontSize;
                        x.firstChild.style.fontSize = ""
                    }
                    if (!s.noBBox) {
                        var y = this.CHTML
                          , v = z.CHTML;
                        y.append(v);
                        if (this.data.length === 1) {
                            if (v.ic) {
                                y.ic = v.ic
                            }
                            if (v.skew) {
                                y.skew = v.skew
                            }
                        } else {
                            delete y.ic;
                            delete y.skew
                        }
                        if (v.pwidth) {
                            y.pwidth = v.pwidth
                        }
                    }
                } else {
                    if (s.forceChild) {
                        w = a.addElement(x, (u || "mjx-box"))
                    }
                }
                return w
            },
            CHTMLchildNode: function(t, s) {
                t = t.childNodes[s];
                if (t.nodeName.toLowerCase() === "a") {
                    t = t.firstChild
                }
                return t
            },
            CHTMLcoreNode: function(s) {
                if (this.inferRow && this.data[0]) {
                    return this.data[0].CHTMLcoreNode(s.firstChild)
                }
                return this.CHTMLchildNode(s, this.CoreIndex())
            },
            CHTMLstretchChildV: function(v, u, y) {
                var x = this.data[v];
                if (x) {
                    var z = this.CHTML
                      , t = x.CHTML;
                    if (t.stretch || (t.stretch == null && x.CHTMLcanStretch("Vertical", u, y))) {
                        var s = t.w;
                        t = x.CHTMLstretchV(u, y);
                        z.w += t.w - s;
                        if (z.w > z.r) {
                            z.r = z.w
                        }
                        if (t.h > z.h) {
                            z.h = t.h
                        }
                        if (t.d > z.d) {
                            z.d = t.d
                        }
                        if (t.t > z.t) {
                            z.t = t.t
                        }
                        if (t.b > z.b) {
                            z.b = t.b
                        }
                    }
                }
            },
            CHTMLstretchChildH: function(v, s, x) {
                var y = this.data[v];
                if (y) {
                    var z = this.CHTML
                      , u = y.CHTML;
                    if (u.stretch || (u.stretch == null && y.CHTMLcanStretch("Horizontal", s))) {
                        var t = u.w;
                        u = y.CHTMLstretchH(this.CHTMLchildNode(x, v), s);
                        z.w += u.w - t;
                        if (z.w > z.r) {
                            z.r = z.w
                        }
                        if (u.h > z.h) {
                            z.h = u.h
                        }
                        if (u.d > z.d) {
                            z.d = u.d
                        }
                        if (u.t > z.t) {
                            z.t = u.t
                        }
                        if (u.b > z.b) {
                            z.b = u.b
                        }
                    }
                }
            },
            CHTMLupdateFrom: function(s) {
                this.CHTML.updateFrom(s);
                if (this.inferRow) {
                    this.data[0].CHTML.updateFrom(s)
                }
            },
            CHTMLcanStretch: function(w, u, v) {
                var t = false;
                if (this.isEmbellished()) {
                    var s = this.Core();
                    if (s && s !== this) {
                        t = s.CHTMLcanStretch(w, u, v)
                    }
                }
                this.CHTML.stretch = t;
                return t
            },
            CHTMLstretchV: function(s, t) {
                this.CHTMLupdateFrom(this.Core().CHTMLstretchV(s, t));
                return this.CHTML
            },
            CHTMLstretchH: function(t, s) {
                this.CHTMLupdateFrom(this.CHTMLstretchCoreH(t, s));
                return this.CHTML
            },
            CHTMLstretchCoreH: function(t, s) {
                return this.Core().CHTMLstretchH(this.CHTMLcoreNode(t), s)
            },
            CHTMLcreateNode: function(s) {
                if (!this.CHTML) {
                    this.CHTML = {}
                }
                this.CHTML = a.BBOX.zero();
                if (this.href) {
                    s = a.addElement(s, "a", {
                        href: this.href,
                        isMathJax: true
                    })
                }
                if (!this.CHTMLnodeID) {
                    this.CHTMLnodeID = a.GetID()
                }
                var t = (this.id || "MJXc-Node-" + this.CHTMLnodeID) + a.idPostfix;
                return this.CHTMLhandleAttributes(a.addElement(s, "mjx-" + this.type, {
                    id: t
                }))
            },
            CHTMLnodeElement: function() {
                if (!this.CHTMLnodeID) {
                    return null
                }
                return document.getElementById((this.id || "MJXc-Node-" + this.CHTMLnodeID) + a.idPostfix)
            },
            CHTMLlength2em: function(t, s) {
                return a.length2em(t, s, this.CHTML.scale)
            },
            CHTMLhandleAttributes: function(v) {
                if (this["class"]) {
                    if (v.className) {
                        v.className += " " + this["class"]
                    } else {
                        v.className = this["class"]
                    }
                }
                if (this.attrNames) {
                    var z = this.attrNames
                      , u = d.nocopyAttributes
                      , y = f.config.ignoreMMLattributes;
                    var w = (this.type === "mstyle" ? d.math.prototype.defaults : this.defaults);
                    for (var t = 0, s = z.length; t < s; t++) {
                        var x = z[t];
                        if (y[x] == false || (!u[x] && !y[x] && w[x] == null && typeof (v[x]) === "undefined")) {
                            v.setAttribute(x, this.attr[x])
                        }
                    }
                }
                return v
            },
            CHTMLhandleScale: function(v) {
                var x = 1
                  , u = this.parent
                  , w = (u ? u.CHTML.scale : 1);
                var s = this.getValues("scriptlevel", "fontsize");
                s.mathsize = this.Get("mathsize", null, !this.isToken);
                if (s.scriptlevel !== 0) {
                    if (s.scriptlevel > 2) {
                        s.scriptlevel = 2
                    }
                    x = Math.pow(this.Get("scriptsizemultiplier"), s.scriptlevel);
                    s.scriptminsize = a.length2em(this.Get("scriptminsize"), 0.8, 1);
                    if (x < s.scriptminsize) {
                        x = s.scriptminsize
                    }
                }
                if (this.removedStyles && this.removedStyles.fontSize && !s.fontsize) {
                    s.fontsize = this.removedStyles.fontSize
                }
                if (s.fontsize && !this.mathsize) {
                    s.mathsize = s.fontsize
                }
                if (s.mathsize !== 1) {
                    x *= a.length2em(s.mathsize, 1, 1)
                }
                var t = this.CHTMLvariant;
                if (t && t.style && t.style["font-family"]) {
                    x *= (a.config.scale / 100) / a.scale
                }
                this.CHTML.scale = x;
                w = this.CHTML.rscale = x / w;
                if (Math.abs(w - 1) < 0.001) {
                    w = 1
                }
                if (v && w !== 1) {
                    v.style.fontSize = a.Percent(w)
                }
                return x
            },
            CHTMLhandleStyle: function(v) {
                if (!this.style) {
                    return
                }
                var u = v.style;
                u.cssText = this.style;
                this.removedStyles = {};
                for (var t = 0, s = a.removeStyles.length; t < s; t++) {
                    var w = a.removeStyles[t];
                    if (u[w]) {
                        this.removedStyles[w] = u[w];
                        u[w] = ""
                    }
                }
            },
            CHTMLhandleBBox: function(w) {
                var t = this.CHTML
                  , v = w.style;
                if (this.data.length === 1 && (this.data[0].CHTML || {}).pwidth) {
                    t.pwidth = this.data[0].CHTML.pwidth;
                    t.mwidth = this.data[0].CHTML.mwidth;
                    v.width = "100%"
                } else {
                    if (t.pwidth) {
                        t.mwidth = a.Em(t.w);
                        v.width = "100%"
                    } else {
                        if (t.w < 0) {
                            v.width = "0px";
                            v.marginRight = a.Em(t.w)
                        }
                    }
                }
                if (!this.style) {
                    return
                }
                for (var u = 0, s = a.BBOX.styleAdjust.length; u < s; u++) {
                    var x = a.BBOX.styleAdjust[u];
                    if (x && v[x[0]]) {
                        t.adjust(v[x[0]], x[1], x[2], x[3])
                    }
                }
            },
            CHTMLhandleColor: function(s) {
                if (this.mathcolor) {
                    s.style.color = this.mathcolor
                } else {
                    if (this.color) {
                        s.style.color = this.color
                    }
                }
                if (this.mathbackground) {
                    s.style.backgroundColor = this.mathbackground
                } else {
                    if (this.background) {
                        s.style.backgroundColor = this.background
                    }
                }
            },
            CHTMLhandleSpace: function(s) {
                if (!this.useMMLspacing) {
                    var t = this.texSpacing();
                    if (t !== "") {
                        this.CHTML.L = this.CHTMLlength2em(t);
                        s.className += " " + a.SPACECLASS[t]
                    }
                }
            },
            CHTMLhandleText: function(t, u, s) {
                if (t.firstChild && !this.CHTML) {
                    this.CHTML = a.BBOX.empty()
                }
                this.CHTML = a.handleText(t, u, s, this.CHTML)
            },
            CHTMLgetVariant: function() {
                var s = this.getValues("mathvariant", "fontfamily", "fontweight", "fontstyle"), u;
                s.hasVariant = this.Get("mathvariant", true);
                if (this.removedStyles) {
                    u = this.removedStyles;
                    if (u.fontFamily) {
                        s.family = u.fontFamily
                    }
                    if (u.fontWeight) {
                        s.weight = u.fontWeight
                    }
                    if (u.fontStyle) {
                        s.style = u.fontStyle
                    }
                }
                if (!s.hasVariant) {
                    if (s.fontfamily) {
                        s.family = s.fontfamily
                    }
                    if (s.fontweight) {
                        s.weight = s.fontweight
                    }
                    if (s.fontstyle) {
                        s.style = s.fontstyle
                    }
                }
                if (s.weight && s.weight.match(/^\d+$/)) {
                    s.weight = (parseInt(s.weight) > 600 ? "bold" : "normal")
                }
                var t = s.mathvariant;
                if (this.variantForm) {
                    t = "-TeX-variant"
                }
                if (s.family && !s.hasVariant) {
                    if (!s.weight && s.mathvariant.match(/bold/)) {
                        s.weight = "bold"
                    }
                    if (!s.style && s.mathvariant.match(/italic/)) {
                        s.style = "italic"
                    }
                    this.CHTMLvariant = {
                        fonts: [],
                        noRemap: true,
                        cache: {},
                        style: {
                            "font-family": s.family,
                            "font-weight": s.weight || "normal",
                            "font-style": s.style || "normal"
                        }
                    };
                    return
                }
                if (s.weight === "bold") {
                    t = {
                        normal: d.VARIANT.BOLD,
                        italic: d.VARIANT.BOLDITALIC,
                        fraktur: d.VARIANT.BOLDFRAKTUR,
                        script: d.VARIANT.BOLDSCRIPT,
                        "sans-serif": d.VARIANT.BOLDSANSSERIF,
                        "sans-serif-italic": d.VARIANT.SANSSERIFBOLDITALIC
                    }[t] || t
                } else {
                    if (s.weight === "normal") {
                        t = {
                            bold: d.VARIANT.normal,
                            "bold-italic": d.VARIANT.ITALIC,
                            "bold-fraktur": d.VARIANT.FRAKTUR,
                            "bold-script": d.VARIANT.SCRIPT,
                            "bold-sans-serif": d.VARIANT.SANSSERIF,
                            "sans-serif-bold-italic": d.VARIANT.SANSSERIFITALIC
                        }[t] || t
                    }
                }
                if (s.style === "italic") {
                    t = {
                        normal: d.VARIANT.ITALIC,
                        bold: d.VARIANT.BOLDITALIC,
                        "sans-serif": d.VARIANT.SANSSERIFITALIC,
                        "bold-sans-serif": d.VARIANT.SANSSERIFBOLDITALIC
                    }[t] || t
                } else {
                    if (s.style === "normal") {
                        t = {
                            italic: d.VARIANT.NORMAL,
                            "bold-italic": d.VARIANT.BOLD,
                            "sans-serif-italic": d.VARIANT.SANSSERIF,
                            "sans-serif-bold-italic": d.VARIANT.BOLDSANSSERIF
                        }[t] || t
                    }
                }
                this.CHTMLvariant = a.FONTDATA.VARIANT[t] || a.FONTDATA.VARIANT[d.VARIANT.NORMAL]
            },
            CHTMLbboxFor: function(s) {
                if (this.data[s] && this.data[s].CHTML) {
                    return this.data[s].CHTML
                }
                return a.BBOX.zero()
            },
            CHTMLdrawBBox: function(t, u) {
                if (!u) {
                    u = this.CHTML
                }
                var s = a.Element("mjx-box", {
                    style: {
                        opacity: 0.25,
                        "margin-left": a.Em(-(u.w + (u.R || 0)))
                    }
                }, [["mjx-box", {
                    style: {
                        height: a.Em(u.h),
                        width: a.Em(u.w),
                        "background-color": "red"
                    }
                }], ["mjx-box", {
                    style: {
                        height: a.Em(u.d),
                        width: a.Em(u.w),
                        "margin-left": a.Em(-u.w),
                        "vertical-align": a.Em(-u.d),
                        "background-color": "green"
                    }
                }]]);
                if (t.nextSibling) {
                    t.parentNode.insertBefore(s, t.nextSibling)
                } else {
                    t.parentNode.appendChild(s)
                }
            },
            CHTMLnotEmpty: function(s) {
                while (s && s.data.length < 2 && (s.type === "mrow" || s.type === "texatom")) {
                    s = s.data[0]
                }
                return !!s
            }
        }, {
            CHTMLautoload: function() {
                var s = a.autoloadDir + "/" + this.type + ".js";
                f.RestartAfter(o.Require(s))
            },
            CHTMLautoloadFile: function(s) {
                var t = a.autoloadDir + "/" + s + ".js";
                f.RestartAfter(o.Require(t))
            },
            CHTMLstretchV: function(s, t) {
                this.Core().CHTMLstretchV(s, t);
                this.toCommonHTML(this.CHTMLnodeElement(), {
                    stretch: true
                });
                return this.CHTML
            },
            CHTMLstretchH: function(t, s) {
                this.CHTMLupdateFrom(this.CHTMLstretchCoreH(t, s));
                this.toCommonHTML(t, {
                    stretch: true
                });
                return this.CHTML
            }
        });
        d.chars.__Augment({
            toCommonHTML: function(t, s) {
                if (s == null) {
                    s = {}
                }
                var u = this.toString();
                if (s.remap) {
                    u = s.remap(u, s.remapchars)
                }
                this.CHTMLhandleText(t, u, s.variant || this.parent.CHTMLvariant)
            }
        });
        d.entity.__Augment({
            toCommonHTML: function(t, s) {
                if (s == null) {
                    s = {}
                }
                var u = this.toString();
                if (s.remapchars) {
                    u = s.remap(u, s.remapchars)
                }
                this.CHTMLhandleText(t, u, s.variant || this.parent.CHTMLvariant)
            }
        });
        d.math.__Augment({
            toCommonHTML: function(x) {
                x = this.CHTMLdefaultNode(x);
                if (this.CHTML.w < 0) {
                    x.parentNode.style.width = "0px";
                    x.parentNode.style.marginRight = a.Em(this.CHTML.w)
                }
                var v = this.Get("alttext");
                if (v && !x.getAttribute("aria-label")) {
                    x.setAttribute("aria-label", v)
                }
                if (this.CHTML.pwidth) {
                    x.parentNode.style.minWidth = this.CHTML.mwidth || a.Em(this.CHTML.w);
                    x.parentNode.className = "mjx-full-width " + x.parentNode.className;
                    x.style.width = this.CHTML.pwidth
                } else {
                    if (!this.isMultiline && this.Get("display") === "block") {
                        var u = this.getValues("indentalignfirst", "indentshiftfirst", "indentalign", "indentshift");
                        if (u.indentalignfirst !== d.INDENTALIGN.INDENTALIGN) {
                            u.indentalign = u.indentalignfirst
                        }
                        if (u.indentalign === d.INDENTALIGN.AUTO) {
                            u.indentalign = r.displayAlign
                        }
                        if (u.indentshiftfirst !== d.INDENTSHIFT.INDENTSHIFT) {
                            u.indentshift = u.indentshiftfirst
                        }
                        if (u.indentshift === "auto") {
                            u.indentshift = "0"
                        }
                        var t = this.CHTMLlength2em(u.indentshift, a.cwidth);
                        if (r.displayIndent !== "0") {
                            var s = this.CHTMLlength2em(r.displayIndent, a.cwidth);
                            t += (u.indentalign === d.INDENTALIGN.RIGHT ? -s : s)
                        }
                        var w = x.parentNode.parentNode.style;
                        x.parentNode.style.textAlign = w.textAlign = u.indentalign;
                        if (t) {
                            t *= a.em / a.outerEm;
                            f.Insert(w, ({
                                left: {
                                    marginLeft: a.Em(t)
                                },
                                right: {
                                    marginRight: a.Em(-t)
                                },
                                center: {
                                    marginLeft: a.Em(t),
                                    marginRight: a.Em(-t)
                                }
                            })[u.indentalign])
                        }
                    }
                }
                return x
            }
        });
        d.mi.__Augment({
            toCommonHTML: function(s) {
                s = this.CHTMLdefaultNode(s);
                var u = this.CHTML
                  , t = this.data.join("");
                if (u.skew != null && t.length !== 1) {
                    delete u.skew
                }
                if (u.r > u.w && t.length === 1 && !this.CHTMLvariant.noIC) {
                    u.ic = u.r - u.w;
                    u.w = u.r;
                    s.lastChild.style.paddingRight = a.Em(u.ic)
                }
                return s
            }
        });
        d.mn.__Augment({
            CHTMLremapMinus: function(s) {
                return s.replace(/^-/, "\u2212")
            },
            toCommonHTML: function(s) {
                s = this.CHTMLdefaultNode(s, {
                    childOptions: {
                        remap: this.CHTMLremapMinus
                    }
                });
                var u = this.CHTML
                  , t = this.data.join("");
                if (u.skew != null && t.length !== 1) {
                    delete u.skew
                }
                if (u.r > u.w && t.length === 1 && !this.CHTMLvariant.noIC) {
                    u.ic = u.r - u.w;
                    u.w = u.r;
                    s.lastChild.style.paddingRight = a.Em(u.ic)
                }
                return s
            }
        });
        d.mo.__Augment({
            toCommonHTML: function(v) {
                v = this.CHTMLcreateNode(v);
                this.CHTMLhandleStyle(v);
                this.CHTMLgetVariant();
                this.CHTMLhandleScale(v);
                a.BBOX.empty(this.CHTML);
                var t = this.getValues("displaystyle", "largeop");
                t.variant = this.CHTMLvariant;
                t.text = this.data.join("");
                if (t.text == "") {
                    if (this.fence) {
                        v.style.width = a.Em(a.TEX.nulldelimiterspace)
                    }
                } else {
                    this.CHTMLadjustAccent(t);
                    this.CHTMLadjustVariant(t);
                    for (var u = 0, s = this.data.length; u < s; u++) {
                        this.CHTMLaddChild(v, u, {
                            childOptions: {
                                variant: t.mathvariant,
                                remap: this.remap,
                                remapchars: t.remapchars
                            }
                        })
                    }
                    if (t.text.length !== 1) {
                        delete this.CHTML.skew
                    } else {
                        if (this.CHTML.w === 0 && this.CHTML.l < 0) {
                            this.CHTMLfixCombiningChar(v)
                        }
                    }
                    if (t.largeop) {
                        this.CHTMLcenterOp(v)
                    }
                }
                this.CHTML.clean();
                this.CHTMLhandleBBox(v);
                this.CHTMLhandleSpace(v);
                this.CHTMLhandleColor(v);
                return v
            },
            CHTMLhandleSpace: function(v) {
                if (this.useMMLspacing) {
                    var t = this.getValues("scriptlevel", "lspace", "rspace");
                    t.lspace = Math.max(0, this.CHTMLlength2em(t.lspace));
                    t.rspace = Math.max(0, this.CHTMLlength2em(t.rspace));
                    if (t.scriptlevel > 0) {
                        if (!this.hasValue("lspace")) {
                            t.lspace = 0.15
                        }
                        if (!this.hasValue("rspace")) {
                            t.rspace = 0.15
                        }
                    }
                    var s = this
                      , u = this.Parent();
                    while (u && u.isEmbellished() && u.Core() === s) {
                        s = u;
                        u = u.Parent();
                        v = s.CHTMLnodeElement()
                    }
                    if (t.lspace) {
                        v.style.paddingLeft = a.Em(t.lspace)
                    }
                    if (t.rspace) {
                        v.style.paddingRight = a.Em(t.rspace)
                    }
                    this.CHTML.L = t.lspace;
                    this.CHTML.R = t.rspace
                } else {
                    this.__SUPER(arguments).CHTMLhandleSpace.apply(this, arguments)
                }
            },
            CHTMLadjustAccent: function(u) {
                var t = this.CoreParent();
                u.parent = t;
                if (u.text.length === 1 && t && t.isa(d.munderover)) {
                    var v = t.data[t.over]
                      , s = t.data[t.under];
                    if (v && this === v.CoreMO() && t.Get("accent")) {
                        u.remapchars = a.FONTDATA.REMAPACCENT
                    } else {
                        if (s && this === s.CoreMO() && t.Get("accentunder")) {
                            u.remapchars = a.FONTDATA.REMAPACCENTUNDER
                        }
                    }
                }
            },
            CHTMLadjustVariant: function(t) {
                var s = t.parent
                  , u = (s && s.isa(d.msubsup) && this !== s.data[s.base]);
                if (t.largeop) {
                    t.mathvariant = (t.displaystyle ? "-largeOp" : "-smallOp")
                }
                if (u) {
                    t.remapchars = this.remapChars;
                    if (t.text.match(/['`"\u00B4\u2032-\u2037\u2057]/)) {
                        t.mathvariant = "-TeX-variant"
                    }
                }
            },
            CHTMLfixCombiningChar: function(s) {
                s = s.firstChild;
                var t = a.Element("mjx-box", {
                    style: {
                        width: ".25em",
                        "margin-left": "-.25em"
                    }
                });
                s.insertBefore(t, s.firstChild)
            },
            CHTMLcenterOp: function(s) {
                var u = this.CHTML;
                var t = (u.h - u.d) / 2 - a.TEX.axis_height;
                if (Math.abs(t) > 0.001) {
                    s.style.verticalAlign = a.Em(-t)
                }
                u.h -= t;
                u.d += t;
                if (u.r > u.w) {
                    u.ic = u.r - u.w;
                    u.w = u.r;
                    s.style.paddingRight = a.Em(u.ic)
                }
            },
            CHTMLcanStretch: function(w, u, v) {
                if (!this.Get("stretchy")) {
                    return false
                }
                var x = this.data.join("");
                if (x.length !== 1) {
                    return false
                }
                var t = {
                    text: x
                };
                this.CHTMLadjustAccent(t);
                if (t.remapchars) {
                    x = t.remapchars[x] || x
                }
                x = a.FONTDATA.DELIMITERS[x.charCodeAt(0)];
                var s = (x && x.dir === w.substr(0, 1));
                if (s) {
                    s = (this.CHTML.h !== u || this.CHTML.d !== v || !!this.Get("minsize", true) || !!this.Get("maxsize", true));
                    if (s) {
                        this.CHTML.stretch = true
                    }
                }
                return s
            },
            CHTMLstretchV: function(v, y) {
                var w = this.CHTMLnodeElement()
                  , x = this.CHTML;
                var t = this.getValues("symmetric", "maxsize", "minsize");
                var u, s = a.TEX.axis_height;
                if (t.symmetric) {
                    u = 2 * Math.max(v - s, y + s)
                } else {
                    u = v + y
                }
                t.maxsize = this.CHTMLlength2em(t.maxsize, x.h + x.d);
                t.minsize = this.CHTMLlength2em(t.minsize, x.h + x.d);
                u = Math.max(t.minsize, Math.min(t.maxsize, u));
                if (u !== x.sH) {
                    if (u != t.minsize) {
                        u = [Math.max(u * a.TEX.delimiterfactor / 1000, u - a.TEX.delimitershortfall), u]
                    }
                    while (w.firstChild) {
                        w.removeChild(w.firstChild)
                    }
                    this.CHTML = x = a.createDelimiter(w, this.data.join("").charCodeAt(0), u, x);
                    x.sH = (u instanceof Array ? u[1] : u);
                    if (t.symmetric) {
                        u = (x.h + x.d) / 2 + s
                    } else {
                        u = (x.h + x.d) * v / (v + y)
                    }
                    u -= x.h;
                    if (Math.abs(u) > 0.05) {
                        w.style.verticalAlign = a.Em(u);
                        x.h += u;
                        x.d -= u;
                        x.t += u;
                        x.b -= u
                    }
                }
                return this.CHTML
            },
            CHTMLstretchH: function(u, s) {
                var v = this.CHTML;
                var t = this.getValues("maxsize", "minsize", "mathvariant", "fontweight");
                if ((t.fontweight === "bold" || (this.removedStyles || {}).fontWeight === "bold" || parseInt(t.fontweight) >= 600) && !this.Get("mathvariant", true)) {
                    t.mathvariant = d.VARIANT.BOLD
                }
                t.maxsize = this.CHTMLlength2em(t.maxsize, v.w);
                t.minsize = this.CHTMLlength2em(t.minsize, v.w);
                s = Math.max(t.minsize, Math.min(t.maxsize, s));
                if (s !== v.sW) {
                    while (u.firstChild) {
                        u.removeChild(u.firstChild)
                    }
                    this.CHTML = v = a.createDelimiter(u, this.data.join("").charCodeAt(0), s, v, t.mathvariant);
                    v.sW = s
                }
                return this.CHTML
            }
        });
        d.mtext.__Augment({
            CHTMLgetVariant: function() {
                if (a.config.mtextFontInherit || this.Parent().type === "merror") {
                    var u = (a.config.scale / 100) / a.scale;
                    var t = {
                        cache: {},
                        fonts: [],
                        className: "MJXc-font-inherit",
                        rscale: u,
                        style: {
                            "font-size": a.Percent(u)
                        }
                    };
                    var s = this.Get("mathvariant");
                    if (s.match(/bold/)) {
                        t.style["font-weight"] = "bold"
                    }
                    if (s.match(/italic|-tex-mathit/)) {
                        t.style["font-style"] = "italic"
                    }
                    if (s === "monospace") {
                        t.className += " MJXc-monospace-font"
                    }
                    if (s === "double-struck") {
                        t.className += " MJXc-double-struck-font"
                    }
                    if (s.match(/fraktur/)) {
                        t.className += " MJXc-fraktur-font"
                    }
                    if (s.match(/sans-serif/)) {
                        t.className += " MJXc-sans-serif-font"
                    }
                    if (s.match(/script/)) {
                        t.className += " MJXc-script-font"
                    }
                    this.CHTMLvariant = t
                } else {
                    this.__SUPER(arguments).CHTMLgetVariant.call(this)
                }
            }
        });
        d.merror.__Augment({
            toCommonHTML: function(s) {
                s = this.CHTMLdefaultNode(s);
                var t = this.CHTML;
                t.rescale(0.9);
                t.h += 3 / a.em;
                if (t.h > t.t) {
                    t.t = t.h
                }
                t.d += 3 / a.em;
                if (t.d > t.b) {
                    t.b = t.d
                }
                t.w += 8 / a.em;
                t.r = t.w;
                t.l = 0;
                return s
            }
        });
        d.mspace.__Augment({
            toCommonHTML: function(v) {
                v = this.CHTMLcreateNode(v);
                this.CHTMLhandleStyle(v);
                this.CHTMLhandleScale(v);
                var t = this.getValues("height", "depth", "width");
                var s = this.CHTMLlength2em(t.width)
                  , u = this.CHTMLlength2em(t.height)
                  , y = this.CHTMLlength2em(t.depth);
                var x = this.CHTML;
                x.w = x.r = s;
                x.h = x.t = u;
                x.d = x.b = y;
                x.l = 0;
                if (s < 0) {
                    v.style.marginRight = a.Em(s);
                    s = 0
                }
                v.style.width = a.Em(s);
                v.style.height = a.Em(Math.max(0, u + y));
                if (y) {
                    v.style.verticalAlign = a.Em(-y)
                }
                this.CHTMLhandleBBox(v);
                this.CHTMLhandleColor(v);
                return v
            }
        });
        d.mpadded.__Augment({
            toCommonHTML: function(t, F) {
                var s;
                if (F && F.stretch) {
                    t = t.firstChild;
                    s = t.firstChild
                } else {
                    t = this.CHTMLdefaultNode(t, {
                        childNodes: "mjx-box",
                        forceChild: true
                    });
                    s = t.firstChild;
                    t = a.addElement(t, "mjx-block");
                    t.appendChild(s);
                    a.addElement(t, "mjx-strut")
                }
                var z = this.CHTMLbboxFor(0);
                var D = this.getValues("width", "height", "depth", "lspace", "voffset");
                var B = 0
                  , A = 0
                  , C = z.w
                  , u = z.h
                  , v = z.d;
                s.style.width = 0;
                s.style.margin = a.Em(-u) + " 0 " + a.Em(-v);
                if (D.width !== "") {
                    C = this.CHTMLdimen(D.width, "w", C, 0)
                }
                if (D.height !== "") {
                    u = this.CHTMLdimen(D.height, "h", u, 0)
                }
                if (D.depth !== "") {
                    v = this.CHTMLdimen(D.depth, "d", v, 0)
                }
                if (D.voffset !== "") {
                    A = this.CHTMLdimen(D.voffset);
                    if (A) {
                        s.style.position = "relative";
                        s.style.top = a.Em(-A)
                    }
                }
                if (D.lspace !== "") {
                    B = this.CHTMLdimen(D.lspace);
                    if (B) {
                        s.style.position = "relative";
                        s.style.left = a.Em(B)
                    }
                }
                t.style.width = 0;
                t.style.marginTop = a.Em(u - k);
                t.style.padding = "0 " + a.Em(C) + " " + a.Em(v) + " 0";
                var E = a.BBOX({
                    w: C,
                    h: u,
                    d: v,
                    l: 0,
                    r: C,
                    t: u,
                    b: v,
                    scale: this.CHTML.scale,
                    rscale: this.CHTML.rscale
                });
                E.combine(z, B, A);
                E.w = C;
                E.h = u;
                E.d = v;
                this.CHTML = E;
                return t.parentNode
            },
            CHTMLstretchV: d.mbase.CHTMLstretchV,
            CHTMLstretchH: d.mbase.CHTMLstretchH,
            CHTMLdimen: function(w, y, x, s) {
                if (s == null) {
                    s = -i
                }
                w = String(w);
                var t = w.match(/width|height|depth/);
                var u = (t ? this.CHTML[t[0].charAt(0)] : (y ? this.CHTML[y] : 0));
                var v = (this.CHTMLlength2em(w, u) || 0);
                if (w.match(/^[-+]/) && x != null) {
                    v += x
                }
                if (s != null) {
                    v = Math.max(s, v)
                }
                return v
            }
        });
        d.munderover.__Augment({
            toCommonHTML: function(w, G) {
                var E = this.getValues("displaystyle", "accent", "accentunder", "align");
                var u = this.data[this.base];
                if (!E.displaystyle && u != null && (u.movablelimits || u.CoreMO().Get("movablelimits"))) {
                    return d.msubsup.prototype.toCommonHTML.call(this, w, t)
                }
                var B, z, s = [], t = false;
                if (G && G.stretch) {
                    if (this.data[this.base]) {
                        u = a.getNode(w, "mjx-op")
                    }
                    if (this.data[this.under]) {
                        B = a.getNode(w, "mjx-under")
                    }
                    if (this.data[this.over]) {
                        z = a.getNode(w, "mjx-over")
                    }
                    s[0] = u;
                    s[1] = B || z;
                    s[2] = z;
                    t = true
                } else {
                    var y = ["mjx-op", "mjx-under", "mjx-over"];
                    if (this.over === 1) {
                        y[1] = y[2]
                    }
                    w = this.CHTMLdefaultNode(w, {
                        childNodes: y,
                        noBBox: true,
                        forceChild: true,
                        minChildren: 2
                    });
                    s[0] = u = w.removeChild(w.firstChild);
                    s[1] = B = z = w.removeChild(w.firstChild);
                    if (w.firstChild) {
                        s[2] = z = w.removeChild(w.firstChild)
                    }
                }
                var x = []
                  , v = this.CHTMLgetBBoxes(x, s, E);
                var F = x[this.base]
                  , C = this.CHTML;
                C.w = v;
                C.h = F.h;
                C.d = F.d;
                if (F.h < 0.35) {
                    u.style.marginTop = a.Em(F.h - 0.35)
                }
                if (E.accent && F.h < a.TEX.x_height) {
                    C.h += a.TEX.x_height - F.h;
                    u.style.marginTop = a.Em(a.TEX.x_height - Math.max(F.h, 0.35));
                    F.h = a.TEX.x_height
                }
                var A = u
                  , D = 0;
                if (F.ic) {
                    D = 1.3 * F.ic + 0.05
                }
                if (this.data[this.over]) {
                    A = this.CHTMLaddOverscript(z, x, E, D, u, t)
                }
                if (this.data[this.under]) {
                    this.CHTMLaddUnderscript(B, x, E, D, w, A, t)
                } else {
                    if (!t) {
                        w.appendChild(A)
                    }
                }
                this.CHTMLplaceBoxes(u, B, z, E, x);
                return w
            },
            CHTMLgetBBoxes: function(A, x, v) {
                var y, t = this.data.length, z, u = -i, s = u;
                for (y = 0; y < t; y++) {
                    A[y] = this.CHTMLbboxFor(y);
                    A[y].x = A[y].y = 0;
                    if (this.data[y]) {
                        A[y].stretch = this.data[y].CHTMLcanStretch("Horizontal")
                    }
                    z = (y === this.base ? 1 : A[y].rscale);
                    if (y !== this.base) {
                        delete A[y].L;
                        delete A[y].R
                    }
                    s = Math.max(s, z * (A[y].w + (A[y].L || 0) + (A[y].R || 0)));
                    if (!A[y].stretch && s > u) {
                        u = s
                    }
                }
                if (u === -i) {
                    u = s
                }
                for (y = 0; y < t; y++) {
                    if (A[y].stretch) {
                        z = (y === this.base ? 1 : A[y].rscale);
                        A[y] = this.data[y].CHTMLstretchH(x[y].firstChild, u / z);
                        A[y].x = A[y].y = 0;
                        s = Math.max(s, z * (A[y].w + (A[y].L || 0) + (A[y].R || 0)))
                    }
                }
                if (!A[this.base]) {
                    A[this.base] = a.BBOX.empty()
                }
                return s
            },
            CHTMLaddOverscript: function(B, z, F, E, t, s) {
                var D = this.CHTML;
                var y, x, w = a.TEX.big_op_spacing5, v;
                var A = z[this.over]
                  , G = z[this.base]
                  , u = A.rscale;
                if (!s) {
                    var C = a.Element("mjx-stack");
                    C.appendChild(B);
                    C.appendChild(t)
                }
                if (A.D) {
                    A.d = A.D
                }
                if (A.d < 0) {
                    B.firstChild.style.verticalAlign = "top";
                    B.style.height = a.Em(A.h + A.d)
                }
                A.x = 0;
                if (F.accent) {
                    if (A.w < 0.001) {
                        A.x += (A.r - A.l) / 2
                    }
                    v = a.TEX.rule_thickness;
                    w = 0;
                    if (G.skew) {
                        A.x += u * G.skew;
                        D.skew = u * G.skew;
                        if (A.x + u * A.w > D.w) {
                            D.skew += (D.w - (A.x + u * A.w)) / 2
                        }
                    }
                } else {
                    y = a.TEX.big_op_spacing1;
                    x = a.TEX.big_op_spacing3;
                    v = Math.max(y, x - Math.max(0, u * A.d))
                }
                A.x += E / 2;
                A.y = D.h + v + w + u * A.d;
                if (v) {
                    B.style.paddingBottom = a.Em(v / u)
                }
                if (w) {
                    B.style.paddingTop = a.Em(w / u)
                }
                return C
            },
            CHTMLaddUnderscript: function(B, z, E, D, t, A, s) {
                var C = this.CHTML;
                var y, x, w = a.TEX.big_op_spacing5, v;
                var F = z[this.under]
                  , u = F.rscale;
                if (!s) {
                    a.addElement(t, "mjx-itable", {}, [["mjx-row", {}, [["mjx-cell"]]], ["mjx-row"]]);
                    t.firstChild.firstChild.firstChild.appendChild(A);
                    t.firstChild.lastChild.appendChild(B)
                }
                if (F.D) {
                    F.d = F.D
                }
                if (F.d < 0) {
                    B.firstChild.style.verticalAlign = "top";
                    t.firstChild.style.marginBottom = a.Em(F.d)
                }
                if (E.accentunder) {
                    v = 2 * a.TEX.rule_thickness;
                    w = 0
                } else {
                    y = a.TEX.big_op_spacing2;
                    x = a.TEX.big_op_spacing4;
                    v = Math.max(y, x - u * F.h)
                }
                F.x = -D / 2;
                F.y = -(C.d + v + w + u * F.h);
                if (v) {
                    B.style.paddingTop = a.Em(v / u)
                }
                if (w) {
                    B.style.paddingBottom = a.Em(w / u)
                }
            },
            CHTMLplaceBoxes: function(s, B, A, E, z) {
                var t = this.CHTML.w, y, v = z.length, x;
                var D = a.BBOX.zero();
                D.scale = this.CHTML.scale;
                D.rscale = this.CHTML.rscale;
                z[this.base].x = z[this.base].y = 0;
                var F = i;
                for (y = 0; y < v; y++) {
                    x = (y === this.base ? 1 : z[y].rscale);
                    var C = x * (z[y].w + (z[y].L || 0) + (z[y].R || 0));
                    z[y].x += {
                        left: 0,
                        center: (t - C) / 2,
                        right: t - C
                    }[E.align];
                    if (z[y].x < F) {
                        F = z[y].x
                    }
                }
                for (y = 0; y < v; y++) {
                    if (this.data[y]) {
                        x = (y === this.base ? 1 : z[y].rscale);
                        if (z[y].x - F) {
                            var u = (y === this.base ? s : y === this.over ? A : B);
                            u.style.paddingLeft = a.Em((z[y].x - F) / x)
                        }
                        D.combine(z[y], z[y].x - F, z[y].y)
                    }
                }
                this.CHTML = D
            },
            CHTMLstretchV: d.mbase.CHTMLstretchV,
            CHTMLstretchH: d.mbase.CHTMLstretchH,
            CHTMLchildNode: function(u, t) {
                var s = ["mjx-op", "mjx-under", "mjx-over"];
                if (this.over === 1) {
                    s[1] = s[2]
                }
                return a.getNode(u, s[t])
            }
        });
        d.msubsup.__Augment({
            toCommonHTML: function(S, C) {
                var A = this.getValues("displaystyle", "subscriptshift", "superscriptshift", "texprimestyle");
                var D, H, z;
                if (C && C.stretch) {
                    if (this.data[this.base]) {
                        D = a.getNode(S, "mjx-base")
                    }
                    if (this.data[this.sub]) {
                        H = a.getNode(S, "mjx-sub")
                    }
                    if (this.data[this.sup]) {
                        z = a.getNode(S, "mjx-sup")
                    }
                    E = a.getNode(S, "mjx-stack")
                } else {
                    var K = ["mjx-base", "mjx-sub", "mjx-sup"];
                    if (this.sup === 1) {
                        K[1] = K[2]
                    }
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
                        H = null
                    }
                    if (!this.CHTMLnotEmpty(this.data[this.sup])) {
                        S.removeChild(z);
                        z = null
                    }
                    if (S.childNodes.length === 3) {
                        var E = a.addElement(S, "mjx-stack");
                        E.appendChild(z);
                        E.appendChild(H)
                    }
                }
                var F = []
                  , G = a.BBOX.empty(this.CHTML);
                for (var V = 0, T = this.data.length; V < T; V++) {
                    F[V] = this.CHTMLbboxFor(V)
                }
                var y = F[this.base] || a.BBOX.empty()
                  , P = F[this.sub]
                  , W = F[this.sup];
                var B = (H ? P.rscale : 1)
                  , w = (z ? W.rscale : 1);
                G.combine(y, 0, 0);
                var X = a.TEX.x_height
                  , N = a.TEX.scriptspace;
                var Q = a.TEX.sup_drop * w
                  , O = a.TEX.sub_drop * B;
                var L = y.h - Q, J = y.d + O, Y = 0, R;
                if (y.ic) {
                    G.w -= y.ic;
                    D.style.marginRight = a.Em(-y.ic);
                    Y = 1.3 * y.ic + 0.05
                }
                var U = this.data[this.base];
                if (U) {
                    if ((U.type === "mrow" || U.type === "mstyle") && U.data.length === 1) {
                        U = U.data[0]
                    }
                    if (U.type === "mi" || U.type === "mo") {
                        if (U.data.join("").length === 1 && y.rscale === 1 && !y.sH && !U.Get("largeop")) {
                            L = J = 0
                        }
                    }
                }
                A.subscriptshift = (A.subscriptshift === "" ? 0 : this.CHTMLlength2em(A.subscriptshift));
                A.superscriptshift = (A.superscriptshift === "" ? 0 : this.CHTMLlength2em(A.superscriptshift));
                var I = G.w;
                if (H) {
                    P.w += N
                }
                if (z) {
                    W.w += N
                }
                if (!z) {
                    if (H) {
                        J = Math.max(J, a.TEX.sub1, B * P.h - (4 / 5) * X, A.subscriptshift);
                        H.style.verticalAlign = a.Em(-J / B);
                        H.style.paddingRight = a.Em(N / B);
                        G.combine(P, I, -J)
                    }
                } else {
                    if (!H) {
                        R = a.TEX[(A.displaystyle ? "sup1" : (A.texprimestyle ? "sup3" : "sup2"))];
                        L = Math.max(L, R, w * W.d + (1 / 4) * X, A.superscriptshift);
                        z.style.verticalAlign = a.Em(L / w);
                        z.style.paddingLeft = a.Em(Y / w);
                        z.style.paddingRight = a.Em(N / w);
                        G.combine(W, I + Y, L)
                    } else {
                        J = Math.max(J, a.TEX.sub2);
                        var M = a.TEX.rule_thickness;
                        if ((L - w * W.d) - (B * P.h - J) < 3 * M) {
                            J = 3 * M - L + w * W.d + B * P.h;
                            Q = (4 / 5) * X - (L - w * W.d);
                            if (Q > 0) {
                                L += Q;
                                J -= Q
                            }
                        }
                        L = Math.max(L, A.superscriptshift);
                        J = Math.max(J, A.subscriptshift);
                        H.style.paddingRight = a.Em(N / B);
                        z.style.paddingBottom = a.Em(L / w + J / B - W.d - P.h / B * w);
                        z.style.paddingLeft = a.Em(Y / w);
                        z.style.paddingRight = a.Em(N / w);
                        E.style.verticalAlign = a.Em(-J);
                        G.combine(W, I + Y, L);
                        G.combine(P, I, -J)
                    }
                }
                G.clean();
                return S
            },
            CHTMLstretchV: d.mbase.CHTMLstretchV,
            CHTMLstretchH: d.mbase.CHTMLstretchH,
            CHTMLchildNode: function(u, t) {
                var s = ["mjx-base", "mjx-sub", "mjx-sup"];
                if (this.over === 1) {
                    s[1] = s[2]
                }
                return a.getNode(u, s[t])
            }
        });
        d.mfrac.__Augment({
            toCommonHTML: function(N) {
                N = this.CHTMLdefaultNode(N, {
                    childNodes: ["mjx-numerator", "mjx-denominator"],
                    childOptions: {
                        autowidth: true
                    },
                    forceChild: true,
                    noBBox: true,
                    minChildren: 2
                });
                var x = this.getValues("linethickness", "displaystyle", "numalign", "denomalign", "bevelled");
                var O = x.displaystyle;
                var D = N.firstChild
                  , w = N.lastChild;
                var y = a.addElement(N, "mjx-box");
                y.appendChild(D);
                y.appendChild(w);
                N.appendChild(y);
                if (x.numalign !== "center") {
                    D.style.textAlign = x.numalign
                }
                if (x.denomalign !== "center") {
                    w.style.textAlign = x.denomalign
                }
                var P = this.CHTMLbboxFor(0)
                  , B = this.CHTMLbboxFor(1)
                  , C = a.BBOX.empty(this.CHTML)
                  , F = P.rscale
                  , z = B.rscale;
                x.linethickness = Math.max(0, a.thickness2em(x.linethickness || "0", C.scale));
                var M = a.TEX.min_rule_thickness / a.em
                  , T = a.TEX.axis_height;
                var J = x.linethickness, L, K, I, G;
                if (x.bevelled) {
                    y.className += " MJXc-bevelled";
                    var S = (O ? 0.4 : 0.15);
                    var E = Math.max(F * (P.h + P.d), z * (B.h + B.d)) + 2 * S;
                    var R = a.Element("mjx-bevel");
                    y.insertBefore(R, w);
                    var s = a.createDelimiter(R, 47, E);
                    I = F * (P.d - P.h) / 2 + T + S;
                    G = z * (B.d - B.h) / 2 + T - S;
                    if (I) {
                        D.style.verticalAlign = a.Em(I / F)
                    }
                    if (G) {
                        w.style.verticalAlign = a.Em(G / z)
                    }
                    R.style.marginLeft = R.style.marginRight = a.Em(-S / 2);
                    C.combine(P, 0, I);
                    C.combine(s, F * P.w - S / 2, 0);
                    C.combine(B, F * P.w + s.w - S, G);
                    C.clean()
                } else {
                    y.className += " MJXc-stacked";
                    if (O) {
                        I = a.TEX.num1;
                        G = a.TEX.denom1
                    } else {
                        I = (J === 0 ? a.TEX.num3 : a.TEX.num2);
                        G = a.TEX.denom2
                    }
                    if (J === 0) {
                        L = Math.max((O ? 7 : 3) * a.TEX.rule_thickness, 2 * M);
                        K = (I - P.d * F) - (B.h * z - G);
                        if (K < L) {
                            I += (L - K) / 2;
                            G += (L - K) / 2
                        }
                    } else {
                        L = Math.max((O ? 2 : 0) * M + J, J / 2 + 1.5 * M);
                        J = Math.max(J, M);
                        K = (I - P.d * F) - (T + J / 2);
                        if (K < L) {
                            I += (L - K)
                        }
                        K = (T - J / 2) - (B.h * z - G);
                        if (K < L) {
                            G += (L - K)
                        }
                        P.L = P.R = B.L = B.R = 0.1;
                        var A = a.addElement(y, "mjx-line", {
                            style: {
                                "border-bottom": a.Px(J * C.scale, 1) + " solid",
                                top: a.Em(-J / 2 - T)
                            }
                        })
                    }
                    C.combine(P, 0, I);
                    C.combine(B, 0, -G);
                    C.clean();
                    y.style.width = a.Em(C.w);
                    D.style.width = a.Em(C.w / F);
                    w.style.width = a.Em(C.w / z);
                    if (A) {
                        A.style.width = y.style.width
                    }
                    D.style.top = a.Em(-C.h / F);
                    w.style.bottom = a.Em(-C.d / z);
                    a.addElement(N, "mjx-vsize", {
                        style: {
                            height: a.Em(C.h + C.d),
                            verticalAlign: a.Em(-C.d)
                        }
                    })
                }
                if (!this.texWithDelims) {
                    var Q = a.TEX.nulldelimiterspace;
                    y.style.padding = "0 " + a.Em(Q);
                    C.l += Q;
                    C.r += Q;
                    C.w += 2 * Q
                }
                return N
            },
            CHTMLcanStretch: function(s) {
                return false
            }
        });
        d.msqrt.__Augment({
            toCommonHTML: function(w) {
                w = this.CHTMLdefaultNode(w, {
                    childNodes: ["mjx-box", "mjx-root"],
                    forceChild: true,
                    noBBox: true
                });
                var v = w.firstChild || a.Element("mjx-box");
                var E = a.addElement(w, "mjx-box");
                E.appendChild(v);
                var F = this.CHTMLbboxFor(0)
                  , C = a.BBOX.empty(this.CHTML);
                var G = a.TEX.rule_thickness, y = a.TEX.surd_height, u = G, s, D;
                if (this.Get("displaystyle")) {
                    u = a.TEX.x_height
                }
                s = G + u / 4;
                D = F.h + F.d + s + G;
                var z = a.Element("mjx-surd");
                E.insertBefore(z, v);
                var A = a.createDelimiter(z, 8730, [D - 0.04, D]);
                if (A.h + A.d > D) {
                    s = ((A.h + A.d) - (D - G)) / 2
                }
                D = F.h + s + G;
                var B = this.CHTMLaddRoot(w, A, A.h + A.d - D);
                v.style.paddingTop = a.Em(s);
                v.style.borderTop = a.Px(y * F.scale, 1) + " solid";
                E.style.paddingTop = a.Em(2 * G - y);
                F.h += s + 2 * G;
                C.combine(A, B, D - A.h);
                C.combine(F, B + A.w, 0);
                C.clean();
                return w
            },
            CHTMLaddRoot: function() {
                return 0
            }
        });
        d.mroot.__Augment({
            toCommonHTML: d.msqrt.prototype.toCommonHTML,
            CHTMLaddRoot: function(A, u, v) {
                if (!this.data[1]) {
                    return
                }
                var z = this.CHTML
                  , B = this.data[1].CHTML
                  , x = A.firstChild;
                var s = B.rscale;
                var t = this.CHTMLrootHeight(B, u, s) - v;
                var y = Math.min(B.w, B.r);
                var C = Math.max(y, u.offset / s);
                if (t) {
                    x.style.verticalAlign = a.Em(t / s)
                }
                if (C > y) {
                    x.firstChild.style.paddingLeft = a.Em(C - y)
                }
                C -= u.offset / s;
                x.style.width = a.Em(C);
                z.combine(B, 0, t);
                return C * s
            },
            CHTMLrootHeight: function(u, s, t) {
                return 0.45 * (s.h + s.d - 0.9) + s.offset + Math.max(0, u.d - 0.075)
            }
        });
        d.mfenced.__Augment({
            toCommonHTML: function(v) {
                v = this.CHTMLcreateNode(v);
                this.CHTMLhandleStyle(v);
                this.CHTMLhandleScale(v);
                this.CHTMLaddChild(v, "open", {});
                for (var u = 0, s = this.data.length; u < s; u++) {
                    this.CHTMLaddChild(v, "sep" + u, {});
                    this.CHTMLaddChild(v, u, {})
                }
                this.CHTMLaddChild(v, "close", {});
                var t = this.CHTML.h
                  , w = this.CHTML.d;
                this.CHTMLstretchChildV("open", t, w);
                for (u = 0,
                s = this.data.length; u < s; u++) {
                    this.CHTMLstretchChildV("sep" + u, t, w);
                    this.CHTMLstretchChildV(u, t, w)
                }
                this.CHTMLstretchChildV("close", t, w);
                this.CHTMLhandleSpace(v);
                this.CHTMLhandleBBox(v);
                this.CHTMLhandleColor(v);
                return v
            }
        });
        d.mrow.__Augment({
            toCommonHTML: function(w, t) {
                t = t || {};
                w = this.CHTMLdefaultNode(w);
                var z = this.CHTML, v = z.h, x = z.d, y;
                for (var u = 0, s = this.data.length; u < s; u++) {
                    this.CHTMLstretchChildV(u, v, x);
                    if (this.data[u] && this.data[u].CHTML && this.data[u].CHTML.w < 0) {
                        y = true
                    }
                }
                if (this.CHTMLlineBreaks()) {
                    this.CHTMLmultiline(w);
                    if (t.autowidth) {
                        w.style.width = ""
                    }
                } else {
                    if (y && z.w) {
                        w.style.width = a.Em(Math.max(0, z.w))
                    }
                    if (z.w < 0) {
                        w.style.marginRight = a.Em(z.w)
                    }
                }
                return w
            },
            CHTMLlineBreaks: function() {
                if (!this.parent.linebreakContainer) {
                    return false
                }
                return (c.automatic && this.CHTML.w > a.linebreakWidth) || this.hasNewline()
            },
            CHTMLstretchV: function(s, t) {
                this.CHTMLstretchChildV(this.CoreIndex(), s, t);
                return this.CHTML
            },
            CHTMLstretchH: function(t, s) {
                this.CHTMLstretchChildH(this.CoreIndex(), s, t);
                return this.CHTML
            }
        });
        d.mstyle.__Augment({
            toCommonHTML: function(s) {
                s = this.CHTMLdefaultNode(s);
                if (this.scriptlevel && this.data[0]) {
                    this.CHTML.rescale(this.data[0].CHTML.rscale)
                }
                return s
            }
        });
        d.TeXAtom.__Augment({
            toCommonHTML: function(x, w) {
                if (!w || !w.stretch) {
                    x = this.CHTMLdefaultNode(x)
                }
                if (this.texClass === d.TEXCLASS.VCENTER) {
                    var s = a.TEX.axis_height
                      , u = this.CHTML;
                    var t = s - (u.h + u.d) / 2 + u.d;
                    if (Math.abs(t) > 0.001) {
                        x.style.verticalAlign = a.Em(t);
                        u.h += t;
                        u.t += t;
                        u.d -= t;
                        u.b -= t
                    }
                }
                return x
            },
            CHTMLstretchV: function(s, t) {
                this.CHTMLupdateFrom(this.Core().CHTMLstretchV(s, t));
                this.toCommonHTML(this.CHTMLnodeElement(), {
                    stretch: true
                });
                return this.CHTML
            },
            CHTMLstretchH: function(t, s) {
                this.CHTMLupdateFrom(this.CHTMLstretchCoreH(t, s));
                this.toCommonHTML(t, {
                    stretch: true
                });
                return this.CHTML
            }
        });
        d.semantics.__Augment({
            toCommonHTML: function(s) {
                s = this.CHTMLcreateNode(s);
                if (this.data[0]) {
                    this.data[0].toCommonHTML(s);
                    this.CHTMLupdateFrom(this.data[0].CHTML);
                    this.CHTMLhandleBBox(s)
                }
                return s
            }
        });
        d.annotation.__Augment({
            toCommonHTML: function(s) {
                return this.CHTMLcreateNode(s)
            }
        });
        d["annotation-xml"].__Augment({
            toCommonHTML: d.mbase.CHTMLautoload
        });
        d.ms.__Augment({
            toCommonHTML: d.mbase.CHTMLautoload
        });
        d.mglyph.__Augment({
            toCommonHTML: d.mbase.CHTMLautoload
        });
        d.menclose.__Augment({
            toCommonHTML: d.mbase.CHTMLautoload
        });
        d.maction.__Augment({
            toCommonHTML: d.mbase.CHTMLautoload
        });
        d.mmultiscripts.__Augment({
            toCommonHTML: d.mbase.CHTMLautoload
        });
        d.mtable.__Augment({
            toCommonHTML: d.mbase.CHTMLautoload
        });
        MathJax.Hub.Register.StartupHook("onLoad", function() {
            setTimeout(CallbackUtil.Create(["loadComplete", a, "jax.js"]), 0)
        })
    });
    MathJax.Hub.Register.StartupHook("End Cookie", function() {
        if (f.config.menuSettings.zoom !== "None") {
            o.Require("[MathJax]/extensions/MathZoom.js")
        }
    })
}
)(MathJax.Ajax, MathJax.Hub, MathJax.HTML, MathJax.OutputJax.CommonHTML);
