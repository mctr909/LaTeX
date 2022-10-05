///<reference path="../MathJax.js"/>

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

MathJax.Hub.Config({
    extensions: ['[a11y]/accessibility-menu.js']
});

MathJax.InputJax.TeX = MathJax.InputJax({
    id: "TeX",
    version: "2.7.2",
    directory: MathJax.InputJax.directory + "/TeX",
    extensionDir: MathJax.InputJax.extensionDir + "/TeX",
    config: {
        TagSide: "right",
        TagIndent: "0.8em",
        MultLineWidth: "85%",
        equationNumbers: {
            autoNumber: "none",
            formatNumber: function (a) {
                return a
            },
            formatTag: function (a) {
                return "(" + a + ")"
            },
            formatID: function (a) {
                return "mjx-eqn-" + String(a).replace(/[:"'<>&]/g, "")
            },
            formatURL: function (b, a) {
                return a + "#" + escape(b)
            },
            useLabelIds: true
        }
    },
    resetEquationNumbers: function () { }
});
MathJax.InputJax.TeX.Register("math/tex");
MathJax.InputJax.TeX.loadComplete("config.js");

MathJax.InputJax.MathML = MathJax.InputJax({
    id: "MathML",
    version: "2.7.2",
    directory: MathJax.InputJax.directory + "/MathML",
    extensionDir: MathJax.InputJax.extensionDir + "/MathML",
    entityDir: MathJax.InputJax.directory + "/MathML/entities",
    config: {
        useMathMLspacing: false
    }
});
MathJax.InputJax.MathML.Register("math/mml");
MathJax.InputJax.MathML.loadComplete("config.js");

MathJax.InputJax.AsciiMath = MathJax.InputJax({
    id: "AsciiMath",
    version: "2.7.2",
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

MathJax.OutputJax.CommonHTML = MathJax.OutputJax({
    id: "CommonHTML",
    version: "2.7.2",
    directory: MathJax.OutputJax.directory + "/CommonHTML",
    extensionDir: MathJax.OutputJax.extensionDir + "/CommonHTML",
    autoloadDir: MathJax.OutputJax.directory + "/CommonHTML/autoload",
    fontDir: MathJax.OutputJax.directory + "/CommonHTML/fonts",
    webfontDir: MathJax.OutputJax.fontDir + "/HTML-CSS",
    config: {
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
    }
});
if (!MathJax.Hub.config.delayJaxRegistration) {
    MathJax.OutputJax.CommonHTML.Register("jax/mml")
}
MathJax.OutputJax.CommonHTML.loadComplete("config.js");

MathJax.OutputJax.PreviewHTML = MathJax.OutputJax({
    id: "PreviewHTML",
    version: "2.7.2",
    directory: MathJax.OutputJax.directory + "/PreviewHTML",
    extensionDir: MathJax.OutputJax.extensionDir + "/PreviewHTML",
    noFastPreview: true,
    config: {
        scale: 100,
        minScaleAdjust: 50,
        mtextFontInherit: false,
        linebreaks: {
            automatic: false,
            width: "container"
        }
    }
});
if (!MathJax.Hub.config.delayJaxRegistration) {
    MathJax.OutputJax.PreviewHTML.Register("jax/mml")
}
MathJax.OutputJax.PreviewHTML.loadComplete("config.js");

class Tex2Jax {
    constructor() {
        this.version = "2.7.2";
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
            wbr: "",
            "#comment": ""
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
        if (!a) {
            a = document.body;
        }
        if (this.createPatterns()) {
            this.scanElement(a, a.nextSibling);
        }
    }
    createPatterns() {
        var d = [], e = [], c, a, b = this.config;
        this.match = {};
        for (c = 0,
            a = b.inlineMath.length; c < a; c++) {
            d.push(this.patternQuote(b.inlineMath[c][0]));
            this.match[b.inlineMath[c][0]] = {
                mode: "",
                end: b.inlineMath[c][1],
                pattern: this.endPattern(b.inlineMath[c][1])
            }
        }
        for (c = 0,
            a = b.displayMath.length; c < a; c++) {
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
        if (b.processEscapes) {
            e.push("\\\\*\\\\\\$");
        }
        if (b.processRefs) {
            e.push("\\\\(eq)?ref\\{[^}]*\\}");
        }
        this.start = new RegExp(e.join("|"), "g");
        this.skipTags = new RegExp("^(" + b.skipTags.join("|") + ")$", "i");
        var f = [];
        if (MathJax.Hub.config.preRemoveClass) {
            f.push(MathJax.Hub.config.preRemoveClass);
        }
        if (b.ignoreClass) {
            f.push(b.ignoreClass);
        }
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
                if (!g) {
                    c = this.scanText(c);
                }
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
            if (c) {
                c = c.nextSibling;
            }
        }
    }
    scanText(b) {
        if (b.nodeValue.replace(/\s+/, "") == "") {
            return b;
        }
        var a, c;
        this.search = {
            start: true
        };
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
                do {
                    c = b;
                    b = b.nextSibling;
                } while (b && this.ignoreTags[b.nodeName.toLowerCase()] != null);
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
            if (a[0] === "{") {
                b.pcount++;
            } else {
                if (a[0] === "}" && b.pcount) {
                    b.pcount--;
                }
            }
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
    encloseMath(b) {
        var a = this.search, g = a.close, f, d, c;
        if (a.cpos === g.length) {
            g = g.nextSibling;
        } else {
            g = g.splitText(a.cpos);
        }
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
        if (f) {
            f.parentNode.removeChild(f);
        }
        return d;
    }
    insertNode(b) {
        var a = this.search;
        a.close.parentNode.insertBefore(b, a.close);
    }
    createPreview(d, a) {
        var b = MathJax.Hub.config.preRemoveClass;
        var c = this.config.preview;
        if (c === "none") {
            return;
        }
        if ((this.search.close.previousSibling || {}).className === b) {
            return;
        }
        if (c === "TeX") {
            c = [this.filterPreview(a)];
        }
        if (c) {
            c = MathJax.HTML.Element("span", {
                className: b
            }, c);
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
    filterPreview(a) {
        return a;
    }
}
class Mml2Jax {
    constructor() {
        this.version = "2.7.2";
        this.config = {
            preview: "mathml"
        };
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
        if (!e) {
            e = document.body;
        }
        var h = [];
        this.PushMathElements(h, e, "math");
        this.PushMathElements(h, e, "math", this.MMLnamespace);
        var d, b;
        if (typeof (document.namespaces) !== "undefined") {
            try {
                for (d = 0,
                    b = document.namespaces.length; d < b; d++) {
                    var f = document.namespaces[d];
                    if (f.urn === this.MMLnamespace) {
                        this.PushMathElements(h, e, f.name + ":math");
                    }
                }
            } catch (g) { }
        } else {
            var c = document.getElementsByTagName("html")[0];
            if (c) {
                for (d = 0,
                    b = c.attributes.length; d < b; d++) {
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
            if (j && j.className !== g && !j.isMathJax && !h[e].prefix === !c) {
                f.push(h[e]);
            }
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
                for (b = 0,
                    a = e.attributes.length; b < a; b++) {
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
                    for (b = 0,
                        a = e.childNodes.length; b < a; b++) {
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
        if (a == null) {
            a = "";
        }
        return a.replace(/&/g, "&#x26;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
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
                    e = MathJax.HTML.Element("img", {
                        src: a,
                        alt: d,
                        style: b
                    });
                } else {
                    e = null;
                }
            }
        }
        if (e) {
            var h;
            if (i) {
                h = MathJax.HTML.Element("span", {
                    className: c
                });
                h.appendChild(e);
            } else {
                h = MathJax.HTML.Element("span", {
                    className: c
                }, e);
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
class Asciimath2Jax {
    constructor() {
        this.version = "2.7.2";
        this.config = {
            delimiters: [["`", "`"]],
            skipTags: ["script", "noscript", "style", "textarea", "pre", "code", "annotation", "annotation-xml"],
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
        if (!a) {
            a = document.body;
        }
        if (this.createPatterns()) {
            this.scanElement(a, a.nextSibling);
        }
    }
    createPatterns() {
        var d = [], c, a, b = this.config;
        this.match = {};
        if (b.delimiters.length === 0) {
            return false;
        }
        for (c = 0,
            a = b.delimiters.length; c < a; c++) {
            d.push(this.patternQuote(b.delimiters[c][0]));
            this.match[b.delimiters[c][0]] = {
                mode: "",
                end: b.delimiters[c][1],
                pattern: this.endPattern(b.delimiters[c][1])
            };
        }
        this.start = new RegExp(d.sort(this.sortLength).join("|"), "g");
        this.skipTags = new RegExp("^(" + b.skipTags.join("|") + ")$", "i");
        var e = [];
        if (MathJax.Hub.config.preRemoveClass) {
            e.push(MathJax.Hub.config.preRemoveClass);
        }
        if (b.ignoreClass) {
            e.push(b.ignoreClass);
        }
        this.ignoreClass = (e.length ? new RegExp("(^| )(" + e.join("|") + ")( |$)") : /^$/);
        this.processClass = new RegExp("(^| )(" + b.processClass + ")( |$)");
        return true;
    }
    patternQuote(a) {
        return a.replace(/([\^$(){}+*?\-|\[\]\:\\])/g, "\\$1");
    }
    endPattern(a) {
        return new RegExp(this.patternQuote(a) + "|\\\\.", "g");
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
                if (!g) {
                    c = this.scanText(c);
                }
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
            if (c) {
                c = c.nextSibling;
            }
        }
    }
    scanText(b) {
        if (b.nodeValue.replace(/\s+/, "") == "") {
            return b;
        }
        var a, c;
        this.search = {
            start: true
        };
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
                do {
                    c = b;
                    b = b.nextSibling;
                } while (b && this.ignoreTags[b.nodeName.toLowerCase()] != null);
                if (!b || b.nodeName !== "#text") {
                    return c;
                }
            }
        }
        return b;
    }
    startMatch(a, b) {
        var c = this.match[a[0]];
        if (c != null) {
            this.search = {
                end: c.end,
                mode: c.mode,
                open: b,
                olen: a[0].length,
                opos: this.pattern.lastIndex - a[0].length
            };
            this.switchPattern(c.pattern);
        }
        return b;
    }
    endMatch(a, b) {
        if (a[0] == this.search.end) {
            this.search.close = b;
            this.search.cpos = this.pattern.lastIndex;
            this.search.clen = (this.search.isBeginEnd ? 0 : a[0].length);
            this.search.matched = true;
            b = this.encloseMath(b);
            this.switchPattern(this.start);
        }
        return b;
    }
    switchPattern(a) {
        a.lastIndex = this.pattern.lastIndex;
        this.pattern = a;
        this.search.start = (a === this.start);
    }
    encloseMath(b) {
        var a = this.search, g = a.close, f, d, c;
        if (a.cpos === g.length) {
            g = g.nextSibling;
        } else {
            g = g.splitText(a.cpos);
        }
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
                    d.nodeValue += d.nextSibling.nodeValue;
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
        if (f) {
            f.parentNode.removeChild(f);
        }
        return d;
    }
    insertNode(b) {
        var a = this.search;
        a.close.parentNode.insertBefore(b, a.close);
    }
    createPreview(d, a) {
        var b = MathJax.Hub.config.preRemoveClass;
        var c = this.config.preview;
        if (c === "none") {
            return;
        }
        if ((this.search.close.previousSibling || {}).className === b) {
            return;
        }
        if (c === "AsciiMath") {
            c = [this.filterPreview(a)];
        }
        if (c) {
            c = MathJax.HTML.Element("span", {
                className: b
            }, c);
            this.insertNode(c);
        }
    }
    createMathTag(c, a) {
        var b = document.createElement("script");
        b.type = "math/asciimath" + c;
        MathJax.HTML.setScript(b, a);
        this.insertNode(b);
        return b;
    }
    filterPreview(a) {
        return a;
    }
}
MathJax.Extension.tex2jax = new Tex2Jax();
MathJax.Extension.mml2jax = new Mml2Jax();
MathJax.Extension.asciimath2jax = new Asciimath2Jax();
MathJax.Hub.Register.PreProcessor(["PreProcess", MathJax.Extension.tex2jax]);
MathJax.Ajax.loadComplete("[MathJax]/extensions/tex2jax.js");
MathJax.Hub.Register.PreProcessor(["PreProcess", MathJax.Extension.mml2jax], 5);
MathJax.Ajax.loadComplete("[MathJax]/extensions/mml2jax.js");
MathJax.Hub.Register.PreProcessor(["PreProcess", MathJax.Extension.asciimath2jax]);
MathJax.Ajax.loadComplete("[MathJax]/extensions/asciimath2jax.js");

var __eventHandle = MathJax.Extension.MathEvents = {
    version: "2.7.2",
    safariContextMenuBug: false,
    operaPositionBug: false,
    /** @type{HTMLSpanElement} */
    topImg: null,
    /** @type{Events} */
    Event: null,
    /** @type{Hover} */
    Hover: null,
    /** @type{Touch} */
    Touch: null
};
var __menuSettings = MathJax.Hub.config.menuSettings;
var __menuStyle = {
    hover: 500,
    frame: {
        x: 3.5,
        y: 5,
        bwidth: 1,
        bcolor: "#A6D",
        hwidth: "15px",
        hcolor: "#83A"
    },
    button: {
        x: -6,
        y: -3,
        wx: -2
    },
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
            "line-height": 0,
            padding: "4px"
        },
        ".MathJax_Hover_Arrow:hover": {
            color: "white!important",
            border: "2px solid #CCC!important"
        },
        ".MathJax_Hover_Arrow:hover span": {
            "background-color": "#CCC!important"
        }
    }
};
var __zoomMenuConfig = MathJax.Hub.CombineConfig("MathZoom", {
    styles: {
        "#MathJax_Zoom": {
            position: "absolute",
            "background-color": "#F0F0F0",
            overflow: "auto",
            display: "block",
            "z-index": 301,
            padding: ".5em",
            border: "1px solid black",
            margin: 0,
            "font-weight": "normal",
            "font-style": "normal",
            "text-align": "left",
            "text-indent": 0,
            "text-transform": "none",
            "line-height": "normal",
            "letter-spacing": "normal",
            "word-spacing": "normal",
            "word-wrap": "normal",
            "white-space": "nowrap",
            "float": "none",
            "-webkit-box-sizing": "content-box",
            "-moz-box-sizing": "content-box",
            "box-sizing": "content-box",
            "box-shadow": "5px 5px 15px #AAAAAA",
            "-webkit-box-shadow": "5px 5px 15px #AAAAAA",
            "-moz-box-shadow": "5px 5px 15px #AAAAAA",
            "-khtml-box-shadow": "5px 5px 15px #AAAAAA",
            filter: "progid:DXImageTransform.Microsoft.dropshadow(OffX=2, OffY=2, Color='gray', Positive='true')"
        },
        "#MathJax_ZoomOverlay": {
            position: "absolute",
            left: 0,
            top: 0,
            "z-index": 300,
            display: "inline-block",
            width: "100%",
            height: "100%",
            border: 0,
            padding: 0,
            margin: 0,
            "background-color": "white",
            opacity: 0,
            filter: "alpha(opacity=0)"
        },
        "#MathJax_ZoomFrame": {
            position: "relative",
            display: "inline-block",
            height: 0,
            width: 0
        },
        "#MathJax_ZoomEventTrap": {
            position: "absolute",
            left: 0,
            top: 0,
            "z-index": 302,
            display: "inline-block",
            border: 0,
            padding: 0,
            margin: 0,
            "background-color": "white",
            opacity: 0,
            filter: "alpha(opacity=0)"
        }
    }
});

class Events {
    /** @type{Events} */
    static INSTANCE = null;
    static LEFTBUTTON = 0;
    static RIGHTBUTTON = 2;
    static MENUKEY = "altKey";
    static KEY = {
        RETURN: 13,
        ESCAPE: 27,
        SPACE: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40
    };
    static GetInstance(pHub, pLocal, pAjax, pInJax, pOutJax) {
        if (null == Events.INSTANCE) {
            Events.INSTANCE = new Events(pHub, pLocal, pAjax, pInJax, pOutJax);
        }
        return Events.INSTANCE;
    }
    constructor(pHub, pLocal, pAjax, pInJax, pOutJax) {
        /** @type{Hub} */
        this.hub = pHub;
        /** @type{Localization} */
        this.local = pLocal;
        /** @type{Ajax} */
        this.ajax = pAjax;
        /** @type{InputJax} */
        this.inJax = pInJax;
        /** @type{OutputJax} */
        this.outJax = pOutJax;
    }
    Mousedown(q) {
        return Events.INSTANCE.Handler(q, "Mousedown", this);
    }
    Mouseup(q) {
        return Events.INSTANCE.Handler(q, "Mouseup", this);
    }
    Mousemove(q) {
        return Events.INSTANCE.Handler(q, "Mousemove", this);
    }
    Mouseover(q) {
        return Events.INSTANCE.Handler(q, "Mouseover", this);
    }
    Mouseout(q) {
        return Events.INSTANCE.Handler(q, "Mouseout", this);
    }
    Click(q) {
        return Events.INSTANCE.Handler(q, "Click", this);
    }
    DblClick(q) {
        return Events.INSTANCE.Handler(q, "DblClick", this);
    }
    Menu(q) {
        return Events.INSTANCE.Handler(q, "ContextMenu", this);
    }
    Handler(t, r, s) {
        if (this.ajax.loadingMathMenu) {
            return Events.INSTANCE.False(t);
        }
        var q = this.outJax[s.jaxID];
        if (!t) {
            t = window.event;
        }
        t.isContextMenu = (r === "ContextMenu");
        if (q[r]) {
            return q[r](t, s);
        }
        if (MathJax.Extension.MathZoom) {
            return MathJax.Extension.MathZoom.HandleEvent(t, r, s);
        }
    }
    False(q) {
        if (!q) {
            q = window.event;
        }
        if (q) {
            if (q.preventDefault) {
                q.preventDefault();
            } else {
                q.returnValue = false;
            }
            if (q.stopPropagation) {
                q.stopPropagation();
            }
            q.cancelBubble = true;
        }
        return false;
    }
    Keydown(r, q) {
        if (!r) {
            r = window.event;
        }
        if (r.keyCode === Event.KEY.SPACE) {
            Events.INSTANCE.ContextMenu(r, this);
        }
    }
    ContextMenu(t, E, w) {
        var B = Events.INSTANCE.outJax[E.jaxID], v = B.getJaxFromMath(E);
        var F = (B.config.showMathMenu != null ? B : Events.INSTANCE.hub).config.showMathMenu;
        if (!F || (__menuSettings.context !== "MathJax" && !w)) {
            return;
        }
        Events.INSTANCE.ClearSelection();
        Hover.INSTANCE.ClearHoverTimer();
        if (v.hover) {
            if (v.hover.remove) {
                clearTimeout(v.hover.remove);
                delete v.hover.remove;
            }
            v.hover.nofade = true;
        }
        var u = MathJax.Menu;
        var G, D;
        if (u) {
            if (u.loadingDomain) {
                return Events.INSTANCE.False(t);
            }
            G = Events.INSTANCE.local.loadDomain("MathMenu");
            if (!G) {
                u.jax = v;
                var r = u.menu.Find("Show Math As").submenu;
                r.items[0].name = v.sourceMenuTitle;
                r.items[0].format = (v.sourceMenuFormat || "MathML");
                r.items[1].name = Events.INSTANCE.inJax[v.inputJax].sourceMenuTitle;
                r.items[5].disabled = !Events.INSTANCE.inJax[v.inputJax].annotationEncoding;
                var A = r.items[2];
                A.disabled = true;
                var q = A.submenu.items;
                for (var z = 0, y = q.length; z < y; z++) {
                    var s = q[z].name[1];
                    if (v.root && v.root.getAnnotation(s) !== null) {
                        A.disabled = false;
                        q[z].hidden = false;
                    } else {
                        q[z].hidden = true;
                    }
                }
                var x = u.menu.Find("Math Settings", "MathPlayer");
                x.hidden = !(v.outputJax === "NativeMML" && this.hub.Browser.hasMathPlayer);
                return u.menu.Post(t);
            }
            u.loadingDomain = true;
            D = function () {
                delete u.loadingDomain;
            }
        } else {
            if (this.ajax.loadingMathMenu) {
                return Events.INSTANCE.False(t);
            }
            this.ajax.loadingMathMenu = true;
            G = this.ajax.Require("[MathJax]/extensions/MathMenu.js");
            D = function () {
                delete this.ajax.loadingMathMenu;
                if (!MathJax.Menu) {
                    MathJax.Menu = {};
                }
            }
        }
        var C = {
            pageX: t.pageX,
            pageY: t.pageY,
            clientX: t.clientX,
            clientY: t.clientY
        };
        CallbackUtil.Queue(G, D, ["ContextMenu", Events.INSTANCE, C, E, w]);
        return Events.INSTANCE.False(t);
    }
    AltContextMenu(s, r) {
        var t = Events.INSTANCE.outJax[r.jaxID];
        var q = (t.config.showMathMenu != null ? t : Events.INSTANCE.hub).config.showMathMenu;
        if (q) {
            q = (t.config.showMathMenuMSIE != null ? t : Events.INSTANCE.hub).config.showMathMenuMSIE;
            if (__menuSettings.context === "MathJax" && !__menuSettings.mpContext && q) {
                if (s.button !== Event.RIGHTBUTTON) {
                    return;
                }
            } else {
                if (!s[Event.MENUKEY] || s.button !== Event.LEFTBUTTON) {
                    return;
                }
            }
            return t.ContextMenu(s, r, true);
        }
    }
    ClearSelection() {
        if (__eventHandle.safariContextMenuBug) {
            setTimeout("window.getSelection().empty()", 0);
        }
        if (document.selection) {
            setTimeout("document.selection.empty()", 0);
        }
    }
    getBBox(s) {
        s.appendChild(__eventHandle.topImg);
        var r = __eventHandle.topImg.offsetTop
            , t = s.offsetHeight - r
            , q = s.offsetWidth;
        s.removeChild(__eventHandle.topImg);
        return {
            w: q,
            h: r,
            d: t
        };
    }
}
class Hover {
    /** @type{Hover} */
    static INSTANCE = null;
    static GetInstance(pHub, pOutJax, pHtml, pCallback) {
        if (null == Hover.INSTANCE) {
            Hover.INSTANCE = new Hover(pHub, pOutJax, pHtml, pCallback);
        }
        return Hover.INSTANCE;
    }
    constructor(pHub, pOutJax, pHtml, pCallback) {
        /** @type{Hub} */
        this.hub = pHub;
        /** @type{OutputJax} */
        this.outJax = pOutJax;
        /** @type{HTML} */
        this.html = pHtml;
        this.callback = pCallback;
    }
    Mouseover(s, r) {
        if (__menuSettings.discoverable || __menuSettings.zoom === "Hover") {
            var u = s.fromElement || s.relatedTarget
                , t = s.toElement || s.target;
            if (u && t && (
                Hover.INSTANCE.hub.isMathJaxNode(u) !== Hover.INSTANCE.hub.isMathJaxNode(t) ||
                Hover.INSTANCE.hub.getJaxFor(u) !== Hover.INSTANCE.hub.getJaxFor(t)
            )) {
                var q = this.getJaxFromMath(r);
                if (q.hover) {
                    Hover.INSTANCE.ReHover(q)
                } else {
                    Hover.INSTANCE.HoverTimer(q, r)
                }
                return Events.INSTANCE.False(s)
            }
        }
    }
    Mouseout(s, r) {
        if (__menuSettings.discoverable || __menuSettings.zoom === "Hover") {
            var u = s.fromElement || s.relatedTarget
                , t = s.toElement || s.target;
            if (u && t && (
                Hover.INSTANCE.hub.isMathJaxNode(u) !== Hover.INSTANCE.hub.isMathJaxNode(t) ||
                Hover.INSTANCE.hub.getJaxFor(u) !== Hover.INSTANCE.hub.getJaxFor(t)
            )) {
                var q = this.getJaxFromMath(r);
                if (q.hover) {
                    Hover.INSTANCE.UnHover(q)
                } else {
                    Hover.INSTANCE.ClearHoverTimer()
                }
                return Events.INSTANCE.False(s)
            }
        }
    }
    Mousemove(s, r) {
        if (__menuSettings.discoverable || __menuSettings.zoom === "Hover") {
            var q = this.getJaxFromMath(r);
            if (q.hover) {
                return
            }
            if (Hover.INSTANCE.lastX == s.clientX && Hover.INSTANCE.lastY == s.clientY) {
                return
            }
            Hover.INSTANCE.lastX = s.clientX;
            Hover.INSTANCE.lastY = s.clientY;
            Hover.INSTANCE.HoverTimer(q, r);
            return Events.INSTANCE.False(s)
        }
    }
    HoverTimer(q, r) {
        this.ClearHoverTimer();
        this.hoverTimer = setTimeout(Hover.INSTANCE.callback(["Hover", this, q, r]), __menuStyle.hover)
    }
    ClearHoverTimer() {
        if (this.hoverTimer) {
            clearTimeout(this.hoverTimer);
            delete this.hoverTimer
        }
    }
    Hover(q, u) {
        if (MathJax.Extension.MathZoom && MathJax.Extension.MathZoom.Hover({}, u)) {
            return;
        }
        var t = Hover.INSTANCE.outJax[q.outputJax]
            , v = t.getHoverSpan(q, u)
            , y = t.getHoverBBox(q, v, u)
            , w = (t.config.showMathMenu != null ? t : Hover.INSTANCE.hub).config.showMathMenu;
        var A = __menuStyle.frame.x
            , z = __menuStyle.frame.y
            , x = __menuStyle.frame.bwidth;
        q.hover = {
            opacity: 0,
            id: q.inputID + "-Hover"
        };
        var r = Hover.INSTANCE.html.Element("span", {
            id: q.hover.id,
            isMathJax: true,
            style: {
                display: "inline-block",
                width: 0,
                height: 0,
                position: "relative"
            }
        }, [["span", {
            className: "MathJax_Hover_Frame",
            isMathJax: true,
            style: {
                display: "inline-block",
                position: "absolute",
                top: this.Px(-y.h - z - x - (y.y || 0)),
                left: this.Px(-A - x + (y.x || 0)),
                width: this.Px(y.w + 2 * A),
                height: this.Px(y.h + y.d + 2 * z),
                opacity: 0,
                filter: "alpha(opacity=0)"
            }
        }]]);
        var s = Hover.INSTANCE.html.Element("span", {
            isMathJax: true,
            id: q.hover.id + "Menu",
            className: "MathJax_Menu_Button",
            style: {
                display: "inline-block",
                "z-index": 1,
                width: 0,
                height: 0,
                position: "relative"
            }
        }, [["span", {
            className: "MathJax_Hover_Arrow",
            isMathJax: true,
            math: u,
            onclick: this.HoverMenu,
            jax: t.id,
            style: {
                left: this.Px(y.w + A + x + (y.x || 0) + __menuStyle.button.x),
                top: this.Px(-y.h - z - x - (y.y || 0) - __menuStyle.button.y),
                opacity: 0,
                filter: "alpha(opacity=0)"
            }
        }, [["span", {
            isMathJax: true
        }, "\u25BC"]]]]);
        if (y.width) {
            r.style.width = s.style.width = y.width;
            r.style.marginRight = s.style.marginRight = "-" + y.width;
            r.firstChild.style.width = y.width;
            s.firstChild.style.left = "";
            s.firstChild.style.right = this.Px(__menuStyle.button.wx)
        }
        v.parentNode.insertBefore(r, v);
        if (w) {
            v.parentNode.insertBefore(s, v)
        }
        if (v.style) {
            v.style.position = "relative"
        }
        this.ReHover(q)
    }
    ReHover(q) {
        if (q.hover.remove) {
            clearTimeout(q.hover.remove);
        }
        q.hover.remove = setTimeout(Hover.INSTANCE.callback(["UnHover", this, q]), __menuStyle.fadeoutDelay);
        this.HoverFadeTimer(q, __menuStyle.fadeinInc);
    }
    UnHover(q) {
        if (!q.hover.nofade) {
            this.HoverFadeTimer(q, -__menuStyle.fadeoutInc, __menuStyle.fadeoutStart);
        }
    }
    HoverFade(q) {
        delete q.hover.timer;
        q.hover.opacity = Math.max(0, Math.min(1, q.hover.opacity + q.hover.inc));
        q.hover.opacity = Math.floor(1000 * q.hover.opacity) / 1000;
        var s = document.getElementById(q.hover.id)
            , r = document.getElementById(q.hover.id + "Menu");
        s.firstChild.style.opacity = q.hover.opacity;
        s.firstChild.style.filter = "alpha(opacity=" + Math.floor(100 * q.hover.opacity) + ")";
        if (r) {
            r.firstChild.style.opacity = q.hover.opacity;
            r.firstChild.style.filter = s.style.filter;
        }
        if (q.hover.opacity === 1) {
            return;
        }
        if (q.hover.opacity > 0) {
            this.HoverFadeTimer(q, q.hover.inc);
            return;
        }
        s.parentNode.removeChild(s);
        if (r) {
            r.parentNode.removeChild(r);
        }
        if (q.hover.remove) {
            clearTimeout(q.hover.remove);
        }
        delete q.hover;
    }
    HoverFadeTimer(q, s, r) {
        q.hover.inc = s;
        if (!q.hover.timer) {
            q.hover.timer = setTimeout(Hover.INSTANCE.callback(["HoverFade", this, q]), (r || __menuStyle.fadeDelay));
        }
    }
    HoverMenu(q) {
        if (!q) {
            q = window.event;
        }
        return Hover.INSTANCE.outJax[this.jax].ContextMenu(q, this.math, true);
    }
    ClearHover(q) {
        if (q.hover.remove) {
            clearTimeout(q.hover.remove);
        }
        if (q.hover.timer) {
            clearTimeout(q.hover.timer);
        }
        Hover.INSTANCE.ClearHoverTimer();
        delete q.hover;
    }
    Px(q) {
        if (Math.abs(q) < 0.006) {
            return "0px";
        }
        return q.toFixed(2).replace(/\.?0+$/, "") + "px";
    }
    getImages() {
        if (__menuSettings.discoverable) {
            var q = new Image();
            q.src = __menuStyle.button.src;
        }
    }
}
class Touch {
    /** @type{Touch} */
    static INSTANCE = null;
    static last = 0;
    static delay = 500;
    static GetInstance() {
        if (null == Hover.INSTANCE) {
            Touch.INSTANCE = new Touch();
        }
        return Touch.INSTANCE;
    }
    constructor() {
        this.timeout = 0;
        this.up = false;
    }
    start(r) {
        var q = new Date().getTime();
        var s = (q - Touch.last < Touch.delay && Touch.INSTANCE.up);
        Touch.last = q;
        Touch.INSTANCE.up = false;
        if (s) {
            Touch.INSTANCE.timeout = setTimeout(Touch.INSTANCE.menu, Touch.delay, r, this);
            r.preventDefault()
        }
    }
    end(r) {
        var q = new Date().getTime();
        Touch.INSTANCE.up = (q - Touch.last < Touch.delay);
        if (INSTANCE.timeout) {
            clearTimeout(Touch.INSTANCE.timeout);
            delete Touch.INSTANCE.timeout;
            Touch.last = 0;
            Touch.INSTANCE.up = false;
            r.preventDefault();
            return Events.INSTANCE.Handler((r.touches[0] || r.touch), "DblClick", this)
        }
    }
    menu(r, q) {
        delete Touch.INSTANCE.timeout;
        Touch.last = 0;
        Touch.INSTANCE.up = false;
        return Events.INSTANCE.Handler((r.touches[0] || r.touch), "ContextMenu", q)
    }
}
class MathZoom {
    /** @type{MathZoom} */
    static INSTANCE = null;
    /**
     * @param {Hub} pHub
     * @param {HTML} pHtml
     * @returns {MathZoom}
     */
    static GetInstance(pHub, pHtml) {
        if (null == MathZoom.INSTANCE) {
            MathZoom.INSTANCE = new MathZoom(pHub, pHtml);
        }
        return MathZoom.INSTANCE;
    }
    constructor(pHub, pHtml) {
        this.version = "2.7.2";
        this.scrollSize = 11;
        /** @type{Hub} */
        this.hub = pHub;
        /** @type{HTML} */
        this.html = pHtml;
        /** @type{MenuSettings} */
        this.settings = pHub.config.menuSettings;
        /** @type{HTMLSpanElement} */
        this.topImg = null;
        this.operaPositionBug = false;
        this.operaRefreshBug = false;
    }
    HandleEvent(n, l, m) {
        if (MathZoom.INSTANCE.settings.CTRL && !n.ctrlKey) {
            return true;
        }
        if (MathZoom.INSTANCE.settings.ALT && !n.altKey) {
            return true;
        }
        if (MathZoom.INSTANCE.settings.CMD && !n.metaKey) {
            return true;
        }
        if (MathZoom.INSTANCE.settings.Shift && !n.shiftKey) {
            return true;
        }
        if (!MathZoom.INSTANCE[l]) {
            return true;
        }
        return MathZoom.INSTANCE[l](n, m);
    }
    Click(m, l) {
        if (this.settings.zoom === "Click") {
            return this.Zoom(m, l);
        }
    }
    DblClick(m, l) {
        if (this.settings.zoom === "Double-Click" || this.settings.zoom === "DoubleClick") {
            return this.Zoom(m, l);
        }
    }
    Hover(m, l) {
        if (this.settings.zoom === "Hover") {
            this.Zoom(m, l);
            return true;
        }
        return false;
    }
    Zoom(o, u) {
        this.Remove();
        __eventHandle.Hover.ClearHoverTimer();
        __eventHandle.Event.ClearSelection();
        var s = MathJax.OutputJax[u.jaxID];
        var p = s.getJaxFromMath(u);
        if (p.hover) {
            __eventHandle.Hover.UnHover(p);
        }
        var q = this.findContainer(u);
        var l = Math.floor(0.85 * q.clientWidth)
            , t = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
        if (this.getOverflow(q) !== "visible") {
            t = Math.min(q.clientHeight, t);
        }
        t = Math.floor(0.85 * t);
        var n = MathZoom.INSTANCE.html.Element("span", {
            id: "MathJax_ZoomFrame"
        }, [["span", {
            id: "MathJax_ZoomOverlay",
            onmousedown: this.Remove
        }], ["span", {
            id: "MathJax_Zoom",
            onclick: this.Remove,
            style: {
                visibility: "hidden",
                fontSize: this.settings.zscale
            }
        }, [["span", {
            style: {
                display: "inline-block",
                "white-space": "nowrap"
            }
        }]]]]);
        var z = n.lastChild
            , w = z.firstChild
            , r = n.firstChild;
        u.parentNode.insertBefore(n, u);
        u.parentNode.insertBefore(u, n);
        if (w.addEventListener) {
            w.addEventListener("mousedown", this.Remove, true);
        }
        var m = z.offsetWidth || z.clientWidth;
        l -= m;
        t -= m;
        z.style.maxWidth = l + "px";
        z.style.maxHeight = t + "px";
        if (this.msieTrapEventBug) {
            var y = MathZoom.INSTANCE.html.Element("span", {
                id: "MathJax_ZoomEventTrap",
                onmousedown: this.Remove
            });
            n.insertBefore(y, z);
        }
        if (this.msieZIndexBug) {
            var v = MathZoom.INSTANCE.html.addElement(document.body, "img", {
                src: "about:blank",
                id: "MathJax_ZoomTracker",
                width: 0,
                height: 0,
                style: {
                    width: 0,
                    height: 0,
                    position: "relative"
                }
            });
            n.style.position = "relative";
            n.style.zIndex = __zoomMenuConfig.styles["#MathJax_ZoomOverlay"]["z-index"];
            n = v;
        }
        var x = s.Zoom(p, w, u, l, t);
        if (this.msiePositionBug) {
            if (this.msieSizeBug) {
                z.style.height = x.zH + "px";
                z.style.width = x.zW + "px";
            }
            if (z.offsetHeight > t) {
                z.style.height = t + "px";
                z.style.width = (x.zW + this.scrollSize) + "px";
            }
            if (z.offsetWidth > l) {
                z.style.width = l + "px";
                z.style.height = (x.zH + this.scrollSize) + "px";
            }
        }
        if (this.operaPositionBug) {
            z.style.width = Math.min(l, x.zW) + "px";
        }
        if (z.offsetWidth > m && z.offsetWidth - m < l && z.offsetHeight - m < t) {
            z.style.overflow = "visible";
        }
        this.Position(z, x);
        if (this.msieTrapEventBug) {
            y.style.height = z.clientHeight + "px";
            y.style.width = z.clientWidth + "px";
            y.style.left = (parseFloat(z.style.left) + z.clientLeft) + "px";
            y.style.top = (parseFloat(z.style.top) + z.clientTop) + "px";
        }
        z.style.visibility = "";
        if (this.settings.zoom === "Hover") {
            r.onmouseover = this.Remove;
        }
        if (window.addEventListener) {
            addEventListener("resize", this.Resize, false);
        } else {
            if (window.attachEvent) {
                attachEvent("onresize", this.Resize);
            } else {
                this.onresize = window.onresize;
                window.onresize = this.Resize;
            }
        }
        MathZoom.INSTANCE.hub.signal.Post(["math zoomed", p]);
        return __eventHandle.Event.False(o);
    }
    Position(p, r) {
        p.style.display = "none";
        var q = this.Resize()
            , m = q.x
            , s = q.y
            , l = r.mW;
        p.style.display = "";
        var o = -l - Math.floor((p.offsetWidth - l) / 2)
            , n = r.Y;
        p.style.left = Math.max(o, 10 - m) + "px";
        p.style.top = Math.max(n, 10 - s) + "px";
        if (!MathZoom.INSTANCE.msiePositionBug) {
            MathZoom.INSTANCE.SetWH();
        }
    }
    Resize(m) {
        if (MathZoom.INSTANCE.onresize) {
            MathZoom.INSTANCE.onresize(m);
        }
        var q = document.getElementById("MathJax_ZoomFrame")
            , l = document.getElementById("MathJax_ZoomOverlay");
        var o = MathZoom.INSTANCE.getXY(q)
            , n = MathZoom.INSTANCE.findContainer(q);
        if (MathZoom.INSTANCE.getOverflow(n) !== "visible") {
            l.scroll_parent = n;
            var p = MathZoom.INSTANCE.getXY(n);
            o.x -= p.x;
            o.y -= p.y;
            p = MathZoom.INSTANCE.getBorder(n);
            o.x -= p.x;
            o.y -= p.y
        }
        l.style.left = (-o.x) + "px";
        l.style.top = (-o.y) + "px";
        if (MathZoom.INSTANCE.msiePositionBug) {
            setTimeout(MathZoom.INSTANCE.SetWH, 0);
        } else {
            MathZoom.INSTANCE.SetWH();
        }
        return o;
    }
    SetWH() {
        var l = document.getElementById("MathJax_ZoomOverlay");
        if (!l) {
            return;
        }
        l.style.display = "none";
        var m = l.scroll_parent || document.documentElement || document.body;
        l.style.width = m.scrollWidth + "px";
        l.style.height = Math.max(m.clientHeight, m.scrollHeight) + "px";
        l.style.display = "";
    }
    findContainer(l) {
        l = l.parentNode;
        while (l.parentNode && l !== document.body && MathZoom.INSTANCE.getOverflow(l) === "visible") {
            l = l.parentNode;
        }
        return l;
    }
    getOverflow(l) {
        if (window.getComputedStyle) {
            return getComputedStyle(l).overflow;
        } else {
            return (l.currentStyle || { overflow: "visible" }).overflow;
        }
    }
    getBorder(o) {
        var m = {
            thin: 1,
            medium: 2,
            thick: 3
        };
        var n = (window.getComputedStyle ? getComputedStyle(o) : (o.currentStyle || {
            borderLeftWidth: 0,
            borderTopWidth: 0
        }));
        var l = n.borderLeftWidth, p = n.borderTopWidth;
        if (m[l]) {
            l = m[l];
        } else {
            l = parseInt(l);
        }
        if (m[p]) {
            p = m[p];
        } else {
            p = parseInt(p);
        }
        return { x: l, y: p };
    }
    getXY(o) {
        var l = 0, n = 0, m;
        m = o;
        while (m.offsetParent) {
            l += m.offsetLeft;
            m = m.offsetParent;
        }
        if (MathZoom.INSTANCE.operaPositionBug) {
            o.style.border = "1px solid";
        }
        m = o;
        while (m.offsetParent) {
            n += m.offsetTop;
            m = m.offsetParent;
        }
        if (MathZoom.INSTANCE.operaPositionBug) {
            o.style.border = "";
        }
        return { x: l, y: n };
    }
    Remove(n) {
        var p = document.getElementById("MathJax_ZoomFrame");
        if (p) {
            var o = MathJax.OutputJax[p.previousSibling.jaxID];
            var l = o.getJaxFromMath(p.previousSibling);
            MathZoom.INSTANCE.hub.signal.Post(["math unzoomed", l]);
            p.parentNode.removeChild(p);
            p = document.getElementById("MathJax_ZoomTracker");
            if (p) {
                p.parentNode.removeChild(p);
            }
            if (MathZoom.INSTANCE.operaRefreshBug) {
                var m = MathZoom.INSTANCE.html.addElement(document.body, "div", {
                    style: {
                        position: "fixed",
                        left: 0,
                        top: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "white",
                        opacity: 0
                    },
                    id: "MathJax_OperaDiv"
                });
                document.body.removeChild(m);
            }
            if (window.removeEventListener) {
                removeEventListener("resize", MathZoom.INSTANCE.Resize, false);
            } else {
                if (window.detachEvent) {
                    detachEvent("onresize", MathZoom.INSTANCE.Resize);
                } else {
                    window.onresize = MathZoom.INSTANCE.onresize;
                    delete MathZoom.INSTANCE.onresize;
                }
            }
        }
        return __eventHandle.Event.False(n);
    }
}
(function (pHub, pHtml, pAjax, pCallback, pLoc, pOutJax, pInJax) {
    __eventHandle.Event = Events.GetInstance(pHub, pLoc, pAjax, pInJax, pOutJax);
    __eventHandle.Hover = Hover.GetInstance(pHub, pOutJax, pHtml, pCallback);
    __eventHandle.Touch = Touch.GetInstance();
    pHub.Browser.Select({
        Safari: function (q) {
            __eventHandle.safariContextMenuBug = true;
        },
        Opera: function (q) {
            __eventHandle.operaPositionBug = true;
        }
    });
    __eventHandle.topImg = (pHtml.Element("span", {
        style: { width: 0, height: 0, display: "inline-block" }
    }));
    if (__eventHandle.operaPositionBug) {
        __eventHandle.topImg.style.border = "1px solid";
    }
    __menuStyle = pHub.CombineConfig("MathEvents", __menuStyle);
    var funcStyle = function () {
        var q = __menuStyle.styles[".MathJax_Hover_Frame"];
        q.border = __menuStyle.frame.bwidth + "px solid " + __menuStyle.frame.bcolor + " ! important";
        q["box-shadow"]
            = q["-webkit-box-shadow"]
            = q["-moz-box-shadow"]
            = q["-khtml-box-shadow"]
            = "0px 0px " + __menuStyle.frame.hwidth + " " + __menuStyle.frame.hcolor;
    };
    CallbackUtil.Queue(
        pHub.Register.StartupHook("End Config", {}),
        [funcStyle],
        ["getImages", Hover.INSTANCE],
        ["Styles", pAjax, __menuStyle.styles],
        ["Post", pHub.Startup.signal, "MathEvents Ready"],
        ["loadComplete", pAjax, "[MathJax]/extensions/MathEvents.js"]
    );

    var mathZoom = MathJax.Extension.MathZoom = MathZoom.GetInstance(pHub, pHtml);
    pHub.Browser.Select({
        Opera: function (l) {
            mathZoom.operaPositionBug = true;
            mathZoom.operaRefreshBug = true;
        }
    });
    mathZoom.topImg = pHtml.Element("span", {
        style: {
            width: 0,
            height: 0,
            display: "inline-block"
        }
    });
    if (mathZoom.operaPositionBug) {
        mathZoom.topImg.style.border = "1px solid";
    }
    CallbackUtil.Queue(
        ["StartupHook", MathJax.Hub.Register, "Begin Styles", {}], 
        ["Styles", pAjax, __zoomMenuConfig.styles], 
        ["Post", pHub.Startup.signal, "MathZoom Ready"], 
        ["loadComplete", pAjax, "[MathJax]/extensions/MathZoom.js"]
    );
}
)(MathJax.Hub, MathJax.HTML, MathJax.Ajax, MathJax.Callback, MathJax.Localization, MathJax.OutputJax, MathJax.InputJax);

(function (f, o, q, e, r) {
    var p = "2.7.2";
    var d = CallbackUtil.Signal("menu");
    MathJax.Extension.MathMenu = {
        version: p,
        signal: d
    };
    var t = function (u) {
        return MathJax.Localization._.apply(MathJax.Localization, [["MathMenu", u]].concat([].slice.call(arguments, 1)))
    };
    var i = MathJax.Object.isArray;
    var a = f.Browser.isPC
        , l = f.Browser.isMSIE
        , m = ((document.documentMode || 0) > 8);
    var j = (a ? null : "5px");
    var s = f.CombineConfig("MathMenu", {
        delay: 150,
        showRenderer: true,
        showMathPlayer: true,
        showFontMenu: false,
        showContext: false,
        showDiscoverable: false,
        showLocale: true,
        showLocaleURL: false,
        semanticsAnnotations: {
            TeX: ["TeX", "LaTeX", "application/x-tex"],
            StarMath: ["StarMath 5.0"],
            Maple: ["Maple"],
            ContentMathML: ["MathML-Content", "application/mathml-content+xml"],
            OpenMath: ["OpenMath"]
        },
        windowSettings: {
            status: "no",
            toolbar: "no",
            locationbar: "no",
            menubar: "no",
            directories: "no",
            personalbar: "no",
            resizable: "yes",
            scrollbars: "yes",
            width: 400,
            height: 300,
            left: Math.round((screen.width - 400) / 2),
            top: Math.round((screen.height - 300) / 3)
        },
        styles: {
            "#MathJax_About": {
                position: "fixed",
                left: "50%",
                width: "auto",
                "text-align": "center",
                border: "3px outset",
                padding: "1em 2em",
                "background-color": "#DDDDDD",
                color: "black",
                cursor: "default",
                "font-family": "message-box",
                "font-size": "120%",
                "font-style": "normal",
                "text-indent": 0,
                "text-transform": "none",
                "line-height": "normal",
                "letter-spacing": "normal",
                "word-spacing": "normal",
                "word-wrap": "normal",
                "white-space": "nowrap",
                "float": "none",
                "z-index": 201,
                "border-radius": "15px",
                "-webkit-border-radius": "15px",
                "-moz-border-radius": "15px",
                "-khtml-border-radius": "15px",
                "box-shadow": "0px 10px 20px #808080",
                "-webkit-box-shadow": "0px 10px 20px #808080",
                "-moz-box-shadow": "0px 10px 20px #808080",
                "-khtml-box-shadow": "0px 10px 20px #808080",
                filter: "progid:DXImageTransform.Microsoft.dropshadow(OffX=2, OffY=2, Color='gray', Positive='true')"
            },
            "#MathJax_About.MathJax_MousePost": {
                outline: "none"
            },
            ".MathJax_Menu": {
                position: "absolute",
                "background-color": "white",
                color: "black",
                width: "auto",
                padding: (a ? "2px" : "5px 0px"),
                border: "1px solid #CCCCCC",
                margin: 0,
                cursor: "default",
                font: "menu",
                "text-align": "left",
                "text-indent": 0,
                "text-transform": "none",
                "line-height": "normal",
                "letter-spacing": "normal",
                "word-spacing": "normal",
                "word-wrap": "normal",
                "white-space": "nowrap",
                "float": "none",
                "z-index": 201,
                "border-radius": j,
                "-webkit-border-radius": j,
                "-moz-border-radius": j,
                "-khtml-border-radius": j,
                "box-shadow": "0px 10px 20px #808080",
                "-webkit-box-shadow": "0px 10px 20px #808080",
                "-moz-box-shadow": "0px 10px 20px #808080",
                "-khtml-box-shadow": "0px 10px 20px #808080",
                filter: "progid:DXImageTransform.Microsoft.dropshadow(OffX=2, OffY=2, Color='gray', Positive='true')"
            },
            ".MathJax_MenuItem": {
                padding: (a ? "2px 2em" : "1px 2em"),
                background: "transparent"
            },
            ".MathJax_MenuArrow": {
                position: "absolute",
                right: ".5em",
                "padding-top": ".25em",
                color: "#666666",
                "font-family": (l ? "'Arial unicode MS'" : null),
                "font-size": ".75em"
            },
            ".MathJax_MenuActive .MathJax_MenuArrow": {
                color: "white"
            },
            ".MathJax_MenuArrow.RTL": {
                left: ".5em",
                right: "auto"
            },
            ".MathJax_MenuCheck": {
                position: "absolute",
                left: ".7em",
                "font-family": (l ? "'Arial unicode MS'" : null)
            },
            ".MathJax_MenuCheck.RTL": {
                right: ".7em",
                left: "auto"
            },
            ".MathJax_MenuRadioCheck": {
                position: "absolute",
                left: (a ? "1em" : ".7em")
            },
            ".MathJax_MenuRadioCheck.RTL": {
                right: (a ? "1em" : ".7em"),
                left: "auto"
            },
            ".MathJax_MenuLabel": {
                padding: (a ? "2px 2em 4px 1.33em" : "1px 2em 3px 1.33em"),
                "font-style": "italic"
            },
            ".MathJax_MenuRule": {
                "border-top": (a ? "1px solid #CCCCCC" : "1px solid #DDDDDD"),
                margin: (a ? "4px 1px 0px" : "4px 3px")
            },
            ".MathJax_MenuDisabled": {
                color: "GrayText"
            },
            ".MathJax_MenuActive": {
                "background-color": (a ? "Highlight" : "#606872"),
                color: (a ? "HighlightText" : "white")
            },
            ".MathJax_MenuDisabled:focus, .MathJax_MenuLabel:focus": {
                "background-color": "#E8E8E8"
            },
            ".MathJax_ContextMenu:focus": {
                outline: "none"
            },
            ".MathJax_ContextMenu .MathJax_MenuItem:focus": {
                outline: "none"
            },
            "#MathJax_AboutClose": {
                top: ".2em",
                right: ".2em"
            },
            ".MathJax_Menu .MathJax_MenuClose": {
                top: "-10px",
                left: "-10px"
            },
            ".MathJax_MenuClose": {
                position: "absolute",
                cursor: "pointer",
                display: "inline-block",
                border: "2px solid #AAA",
                "border-radius": "18px",
                "-webkit-border-radius": "18px",
                "-moz-border-radius": "18px",
                "-khtml-border-radius": "18px",
                "font-family": "'Courier New',Courier",
                "font-size": "24px",
                color: "#F0F0F0"
            },
            ".MathJax_MenuClose span": {
                display: "block",
                "background-color": "#AAA",
                border: "1.5px solid",
                "border-radius": "18px",
                "-webkit-border-radius": "18px",
                "-moz-border-radius": "18px",
                "-khtml-border-radius": "18px",
                "line-height": 0,
                padding: "8px 0 6px"
            },
            ".MathJax_MenuClose:hover": {
                color: "white!important",
                border: "2px solid #CCC!important"
            },
            ".MathJax_MenuClose:hover span": {
                "background-color": "#CCC!important"
            },
            ".MathJax_MenuClose:hover:focus": {
                outline: "none"
            }
        }
    });
    var n, k, b;
    f.Register.StartupHook("MathEvents Ready", function () {
        n = MathJax.Extension.MathEvents.Event.False;
        k = MathJax.Extension.MathEvents.Hover;
        b = MathJax.Extension.MathEvents.Event.KEY
    });
    var h = MathJax.Object.Subclass({
        Keydown: function (u, v) {
            switch (u.keyCode) {
                case b.ESCAPE:
                    this.Remove(u, v);
                    break;
                case b.RIGHT:
                    this.Right(u, v);
                    break;
                case b.LEFT:
                    this.Left(u, v);
                    break;
                case b.UP:
                    this.Up(u, v);
                    break;
                case b.DOWN:
                    this.Down(u, v);
                    break;
                case b.RETURN:
                case b.SPACE:
                    this.Space(u, v);
                    break;
                default:
                    return;
                    break
            }
            return n(u)
        },
        Escape: function (u, v) { },
        Right: function (u, v) { },
        Left: function (u, v) { },
        Up: function (u, v) { },
        Down: function (u, v) { },
        Space: function (u, v) { }
    }, {});
    var g = MathJax.Menu = h.Subclass({
        version: p,
        items: [],
        posted: false,
        title: null,
        margin: 5,
        Init: function (u) {
            this.items = [].slice.call(arguments, 0)
        },
        With: function (u) {
            if (u) {
                f.Insert(this, u)
            }
            return this
        },
        Post: function (M, E, B) {
            if (!M) {
                M = window.event || {}
            }
            var I = document.getElementById("MathJax_MenuFrame");
            if (!I) {
                I = g.Background(this);
                delete c.lastItem;
                delete c.lastMenu;
                delete g.skipUp;
                d.Post(["post", g.jax]);
                g.isRTL = (MathJax.Localization.fontDirection() === "rtl")
            }
            var v = o.Element("div", {
                onmouseup: g.Mouseup,
                ondblclick: n,
                ondragstart: n,
                onselectstart: n,
                oncontextmenu: n,
                menuItem: this,
                className: "MathJax_Menu",
                onkeydown: g.Keydown,
                role: "menu"
            });
            if (M.type === "contextmenu" || M.type === "mouseover") {
                v.className += " MathJax_ContextMenu"
            }
            if (!B) {
                MathJax.Localization.setCSS(v)
            }
            for (var N = 0, K = this.items.length; N < K; N++) {
                this.items[N].Create(v)
            }
            if (g.isMobile) {
                o.addElement(v, "span", {
                    className: "MathJax_MenuClose",
                    menu: E,
                    ontouchstart: g.Close,
                    ontouchend: n,
                    onmousedown: g.Close,
                    onmouseup: n
                }, [["span", {}, "\u00D7"]])
            }
            I.appendChild(v);
            this.posted = true;
            if (v.offsetWidth) {
                v.style.width = (v.offsetWidth + 2) + "px"
            }
            var H = M.pageX
                , F = M.pageY;
            var u = document.body.getBoundingClientRect();
            var C = (window.getComputedStyle ? window.getComputedStyle(document.body) : {
                marginLeft: "0px"
            });
            var A = u.right - Math.min(0, u.left) + parseFloat(C.marginLeft);
            if (!H && !F && "clientX" in M) {
                H = M.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                F = M.clientY + document.body.scrollTop + document.documentElement.scrollTop
            }
            if (!E) {
                var L = g.CurrentNode() || M.target;
                if ((M.type === "keydown" || (!H && !F)) && L) {
                    var P = window.pageXOffset || document.documentElement.scrollLeft;
                    var O = window.pageYOffset || document.documentElement.scrollTop;
                    var w = L.getBoundingClientRect();
                    H = (w.right + w.left) / 2 + P;
                    F = (w.bottom + w.top) / 2 + O
                }
                if (H + v.offsetWidth > A - this.margin) {
                    H = A - v.offsetWidth - this.margin
                }
                if (g.isMobile) {
                    H = Math.max(5, H - Math.floor(v.offsetWidth / 2));
                    F -= 20
                }
                g.skipUp = M.isContextMenu
            } else {
                var z = "left"
                    , J = E.offsetWidth;
                H = (g.isMobile ? 30 : J - 2);
                F = 0;
                while (E && E !== I) {
                    H += E.offsetLeft;
                    F += E.offsetTop;
                    E = E.parentNode
                }
                if (!g.isMobile) {
                    if ((g.isRTL && H - J - v.offsetWidth > this.margin) || (!g.isRTL && H + v.offsetWidth > A - this.margin)) {
                        z = "right";
                        H = Math.max(this.margin, H - J - v.offsetWidth + 6)
                    }
                }
                if (!a) {
                    v.style["borderRadiusTop" + z] = 0;
                    v.style["WebkitBorderRadiusTop" + z] = 0;
                    v.style["MozBorderRadiusTop" + z] = 0;
                    v.style["KhtmlBorderRadiusTop" + z] = 0
                }
            }
            v.style.left = H + "px";
            v.style.top = F + "px";
            if (document.selection && document.selection.empty) {
                document.selection.empty()
            }
            var G = window.pageXOffset || document.documentElement.scrollLeft;
            var D = window.pageYOffset || document.documentElement.scrollTop;
            g.Focus(v);
            if (M.type === "keydown") {
                g.skipMouseoverFromKey = true;
                setTimeout(function () {
                    delete g.skipMouseoverFromKey
                }, s.delay)
            }
            window.scrollTo(G, D);
            return n(M)
        },
        Remove: function (u, v) {
            d.Post(["unpost", g.jax]);
            var w = document.getElementById("MathJax_MenuFrame");
            if (w) {
                w.parentNode.removeChild(w);
                if (this.msieFixedPositionBug) {
                    detachEvent("onresize", g.Resize)
                }
            }
            if (g.jax.hover) {
                delete g.jax.hover.nofade;
                k.UnHover(g.jax)
            }
            g.Unfocus(v);
            if (u.type === "mousedown") {
                g.CurrentNode().blur()
            }
            return n(u)
        },
        Find: function (u) {
            return this.FindN(1, u, [].slice.call(arguments, 1))
        },
        FindId: function (u) {
            return this.FindN(0, u, [].slice.call(arguments, 1))
        },
        FindN: function (y, v, x) {
            for (var w = 0, u = this.items.length; w < u; w++) {
                if (this.items[w].name[y] === v) {
                    if (x.length) {
                        if (!this.items[w].submenu) {
                            return null
                        }
                        return this.items[w].submenu.FindN(y, x[0], x.slice(1))
                    }
                    return this.items[w]
                }
            }
            return null
        },
        IndexOf: function (u) {
            return this.IndexOfN(1, u)
        },
        IndexOfId: function (u) {
            return this.IndexOfN(0, u)
        },
        IndexOfN: function (x, v) {
            for (var w = 0, u = this.items.length; w < u; w++) {
                if (this.items[w].name[x] === v) {
                    return w
                }
            }
            return null
        },
        Right: function (u, v) {
            g.Right(u, v)
        },
        Left: function (u, v) {
            g.Left(u, v)
        },
        Up: function (v, w) {
            var u = w.lastChild;
            u.menuItem.Activate(v, u)
        },
        Down: function (v, w) {
            var u = w.firstChild;
            u.menuItem.Activate(v, u)
        },
        Space: function (u, v) {
            this.Remove(u, v)
        }
    }, {
        config: s,
        Remove: function (u) {
            return g.Event(u, this, "Remove")
        },
        Mouseover: function (u) {
            return g.Event(u, this, "Mouseover")
        },
        Mouseout: function (u) {
            return g.Event(u, this, "Mouseout")
        },
        Mousedown: function (u) {
            return g.Event(u, this, "Mousedown")
        },
        Mouseup: function (u) {
            return g.Event(u, this, "Mouseup")
        },
        Keydown: function (u) {
            return g.Event(u, this, "Keydown")
        },
        Touchstart: function (u) {
            return g.Event(u, this, "Touchstart")
        },
        Touchend: function (u) {
            return g.Event(u, this, "Touchend")
        },
        Close: function (u) {
            return g.Event(u, this.menu || this.parentNode, (this.menu ? "Touchend" : "Remove"))
        },
        Event: function (w, y, u, x) {
            if (g.skipMouseover && u === "Mouseover" && !x) {
                return n(w)
            }
            if (g.skipMouseoverFromKey && u === "Mouseover") {
                delete g.skipMouseoverFromKey;
                return n(w)
            }
            if (g.skipUp) {
                if (u.match(/Mouseup|Touchend/)) {
                    delete g.skipUp;
                    return n(w)
                }
                if (u === "Touchstart" || (u === "Mousedown" && !g.skipMousedown)) {
                    delete g.skipUp
                }
            }
            if (!w) {
                w = window.event
            }
            var v = y.menuItem;
            if (v && v[u]) {
                return v[u](w, y)
            }
            return null
        },
        BGSTYLE: {
            position: "absolute",
            left: 0,
            top: 0,
            "z-index": 200,
            width: "100%",
            height: "100%",
            border: 0,
            padding: 0,
            margin: 0
        },
        Background: function (v) {
            var w = o.addElement(document.body, "div", {
                style: this.BGSTYLE,
                id: "MathJax_MenuFrame"
            }, [["div", {
                style: this.BGSTYLE,
                menuItem: v,
                onmousedown: this.Remove
            }]]);
            var u = w.firstChild;
            if (g.msieBackgroundBug) {
                u.style.backgroundColor = "white";
                u.style.filter = "alpha(opacity=0)"
            }
            if (g.msieFixedPositionBug) {
                w.width = w.height = 0;
                this.Resize();
                attachEvent("onresize", this.Resize)
            } else {
                u.style.position = "fixed"
            }
            return w
        },
        Resize: function () {
            setTimeout(g.SetWH, 0)
        },
        SetWH: function () {
            var u = document.getElementById("MathJax_MenuFrame");
            if (u) {
                u = u.firstChild;
                u.style.width = u.style.height = "1px";
                u.style.width = document.body.scrollWidth + "px";
                u.style.height = document.body.scrollHeight + "px"
            }
        },
        posted: false,
        active: null,
        GetNode: function (u) {
            var v = document.getElementById(u.inputID + "-Frame");
            return v.isMathJax ? v : v.firstChild
        },
        CurrentNode: function () {
            return g.GetNode(g.jax)
        },
        AllNodes: function () {
            var v = MathJax.Hub.getAllJax();
            var w = [];
            for (var x = 0, u; u = v[x]; x++) {
                w.push(g.GetNode(u))
            }
            return w
        },
        ActiveNode: function () {
            return g.active
        },
        FocusNode: function (u) {
            g.active = u;
            u.focus()
        },
        Focus: function (u) {
            !g.posted ? g.Activate(u) : g.ActiveNode().tabIndex = -1;
            u.tabIndex = 0;
            g.FocusNode(u)
        },
        Activate: function (u, v) {
            g.UnsetTabIndex();
            g.posted = true
        },
        Unfocus: function () {
            g.ActiveNode().tabIndex = -1;
            g.SetTabIndex();
            g.FocusNode(g.CurrentNode());
            g.posted = false
        },
        MoveHorizontal: function (y, z, w) {
            if (!y.shiftKey) {
                return
            }
            var v = g.AllNodes();
            var u = v.length;
            if (u === 0) {
                return
            }
            var x = v[g.Mod(w(g.IndexOf(v, g.CurrentNode())), u)];
            if (x === g.CurrentNode()) {
                return
            }
            g.menu.Remove(y, z);
            g.jax = MathJax.Hub.getJaxFor(x);
            g.FocusNode(x);
            g.menu.Post(null)
        },
        Right: function (u, v) {
            g.MoveHorizontal(u, v, function (w) {
                return w + 1
            })
        },
        Left: function (u, v) {
            g.MoveHorizontal(u, v, function (w) {
                return w - 1
            })
        },
        UnsetTabIndex: function () {
            var v = g.AllNodes();
            for (var w = 0, u; u = v[w]; w++) {
                if (u.tabIndex > 0) {
                    u.oldTabIndex = u.tabIndex
                }
                u.tabIndex = -1
            }
        },
        SetTabIndex: function () {
            var v = g.AllNodes();
            for (var w = 0, u; u = v[w]; w++) {
                if (u.oldTabIndex !== undefined) {
                    u.tabIndex = u.oldTabIndex;
                    delete u.oldTabIndex
                } else {
                    u.tabIndex = f.getTabOrder(u)
                }
            }
        },
        Mod: function (u, v) {
            return ((u % v) + v) % v
        },
        IndexOf: (Array.prototype.indexOf ? function (u, v, w) {
            return u.indexOf(v, w)
        }
            : function (u, x, y) {
                for (var w = (y || 0), v = u.length; w < v; w++) {
                    if (x === u[w]) {
                        return w
                    }
                }
                return -1
            }
        ),
        saveCookie: function () {
            o.Cookie.Set("menu", this.cookie)
        },
        getCookie: function () {
            this.cookie = o.Cookie.Get("menu")
        }
    });
    MathJax.Menu.NAV = h;
    var c = g.ITEM = h.Subclass({
        name: "",
        node: null,
        menu: null,
        Attributes: function (u) {
            return f.Insert({
                onmouseup: g.Mouseup,
                ondragstart: n,
                onselectstart: n,
                onselectend: n,
                ontouchstart: g.Touchstart,
                ontouchend: g.Touchend,
                className: "MathJax_MenuItem",
                role: this.role,
                menuItem: this
            }, u)
        },
        Create: function (w) {
            if (!this.hidden) {
                var v = this.Attributes();
                var u = this.Label(v, w);
                o.addElement(w, "div", v, u)
            }
        },
        Name: function () {
            return t(this.name[0], this.name[1])
        },
        Mouseover: function (u, v) {
            if (v.parentNode === g.ActiveNode().parentNode) {
                this.Deactivate(g.ActiveNode())
            }
            this.Activate(u, v)
        },
        Mouseout: function (u, v) {
            this.Deactivate(v)
        },
        Mouseup: function (u, v) {
            return this.Remove(u, v)
        },
        DeactivateSubmenus: function (z) {
            var y = document.getElementById("MathJax_MenuFrame").childNodes
                , v = c.GetMenuNode(z).childNodes;
            for (var w = 0, u = v.length; w < u; w++) {
                var x = v[w].menuItem;
                if (x && x.submenu && x.submenu.posted && x !== z.menuItem) {
                    x.Deactivate(v[w])
                }
            }
            this.RemoveSubmenus(z, y)
        },
        RemoveSubmenus: function (w, v) {
            v = v || document.getElementById("MathJax_MenuFrame").childNodes;
            var u = v.length - 1;
            while (u >= 0 && c.GetMenuNode(w).menuItem !== v[u].menuItem) {
                v[u].menuItem.posted = false;
                v[u].parentNode.removeChild(v[u]);
                u--
            }
        },
        Touchstart: function (u, v) {
            return this.TouchEvent(u, v, "Mousedown")
        },
        Touchend: function (u, v) {
            return this.TouchEvent(u, v, "Mouseup")
        },
        TouchEvent: function (v, w, u) {
            if (this !== c.lastItem) {
                if (c.lastMenu) {
                    g.Event(v, c.lastMenu, "Mouseout")
                }
                g.Event(v, w, "Mouseover", true);
                c.lastItem = this;
                c.lastMenu = w
            }
            if (this.nativeTouch) {
                return null
            }
            g.Event(v, w, u);
            return false
        },
        Remove: function (u, v) {
            v = v.parentNode.menuItem;
            return v.Remove(u, v)
        },
        With: function (u) {
            if (u) {
                f.Insert(this, u)
            }
            return this
        },
        isRTL: function () {
            return g.isRTL
        },
        rtlClass: function () {
            return (this.isRTL() ? " RTL" : "")
        }
    }, {
        GetMenuNode: function (u) {
            return u.parentNode
        }
    });
    g.ENTRY = g.ITEM.Subclass({
        role: "menuitem",
        Attributes: function (u) {
            u = f.Insert({
                onmouseover: g.Mouseover,
                onmouseout: g.Mouseout,
                onmousedown: g.Mousedown,
                onkeydown: g.Keydown,
                "aria-disabled": !!this.disabled
            }, u);
            u = this.SUPER(arguments).Attributes.call(this, u);
            if (this.disabled) {
                u.className += " MathJax_MenuDisabled"
            }
            return u
        },
        MoveVertical: function (u, E, w) {
            var x = c.GetMenuNode(E);
            var D = [];
            for (var z = 0, C = x.menuItem.items, y; y = C[z]; z++) {
                if (!y.hidden) {
                    D.push(y)
                }
            }
            var B = g.IndexOf(D, this);
            if (B === -1) {
                return
            }
            var A = D.length;
            var v = x.childNodes;
            do {
                B = g.Mod(w(B), A)
            } while (D[B].hidden || !v[B].role || v[B].role === "separator");
            this.Deactivate(E);
            D[B].Activate(u, v[B])
        },
        Up: function (v, u) {
            this.MoveVertical(v, u, function (w) {
                return w - 1
            })
        },
        Down: function (v, u) {
            this.MoveVertical(v, u, function (w) {
                return w + 1
            })
        },
        Right: function (v, u) {
            this.MoveHorizontal(v, u, g.Right, !this.isRTL())
        },
        Left: function (v, u) {
            this.MoveHorizontal(v, u, g.Left, this.isRTL())
        },
        MoveHorizontal: function (A, z, u, B) {
            var x = c.GetMenuNode(z);
            if (x.menuItem === g.menu && A.shiftKey) {
                u(A, z)
            }
            if (B) {
                return
            }
            if (x.menuItem !== g.menu) {
                this.Deactivate(z)
            }
            var v = x.previousSibling.childNodes;
            var y = v.length;
            while (y--) {
                var w = v[y];
                if (w.menuItem.submenu && w.menuItem.submenu === x.menuItem) {
                    g.Focus(w);
                    break
                }
            }
            this.RemoveSubmenus(z)
        },
        Space: function (u, v) {
            this.Mouseup(u, v)
        },
        Activate: function (u, v) {
            this.Deactivate(v);
            if (!this.disabled) {
                v.className += " MathJax_MenuActive"
            }
            this.DeactivateSubmenus(v);
            g.Focus(v)
        },
        Deactivate: function (u) {
            u.className = u.className.replace(/ MathJax_MenuActive/, "")
        }
    });
    g.ITEM.COMMAND = g.ENTRY.Subclass({
        action: function () { },
        Init: function (u, w, v) {
            if (!i(u)) {
                u = [u, u]
            }
            this.name = u;
            this.action = w;
            this.With(v)
        },
        Label: function (u, v) {
            return [this.Name()]
        },
        Mouseup: function (u, v) {
            if (!this.disabled) {
                this.Remove(u, v);
                d.Post(["command", this]);
                this.action.call(this, u)
            }
            return n(u)
        }
    });
    g.ITEM.SUBMENU = g.ENTRY.Subclass({
        submenu: null,
        marker: "\u25BA",
        markerRTL: "\u25C4",
        Attributes: function (u) {
            u = f.Insert({
                "aria-haspopup": "true"
            }, u);
            u = this.SUPER(arguments).Attributes.call(this, u);
            return u
        },
        Init: function (u, w) {
            if (!i(u)) {
                u = [u, u]
            }
            this.name = u;
            var v = 1;
            if (!(w instanceof g.ITEM)) {
                this.With(w),
                    v++
            }
            this.submenu = g.apply(g, [].slice.call(arguments, v))
        },
        Label: function (u, v) {
            this.submenu.posted = false;
            return [this.Name() + " ", ["span", {
                className: "MathJax_MenuArrow" + this.rtlClass()
            }, [this.isRTL() ? this.markerRTL : this.marker]]]
        },
        Timer: function (u, v) {
            this.ClearTimer();
            u = {
                type: u.type,
                clientX: u.clientX,
                clientY: u.clientY
            };
            this.timer = setTimeout(e(["Mouseup", this, u, v]), s.delay)
        },
        ClearTimer: function () {
            if (this.timer) {
                clearTimeout(this.timer)
            }
        },
        Touchend: function (v, x) {
            var w = this.submenu.posted;
            var u = this.SUPER(arguments).Touchend.apply(this, arguments);
            if (w) {
                this.Deactivate(x);
                delete c.lastItem;
                delete c.lastMenu
            }
            return u
        },
        Mouseout: function (u, v) {
            if (!this.submenu.posted) {
                this.Deactivate(v)
            }
            this.ClearTimer()
        },
        Mouseover: function (u, v) {
            this.Activate(u, v)
        },
        Mouseup: function (u, v) {
            if (!this.disabled) {
                if (!this.submenu.posted) {
                    this.ClearTimer();
                    this.submenu.Post(u, v, this.ltr);
                    g.Focus(v)
                } else {
                    this.DeactivateSubmenus(v)
                }
            }
            return n(u)
        },
        Activate: function (u, v) {
            if (!this.disabled) {
                this.Deactivate(v);
                v.className += " MathJax_MenuActive"
            }
            if (!this.submenu.posted) {
                this.DeactivateSubmenus(v);
                if (!g.isMobile) {
                    this.Timer(u, v)
                }
            }
            g.Focus(v)
        },
        MoveVertical: function (w, v, u) {
            this.ClearTimer();
            this.SUPER(arguments).MoveVertical.apply(this, arguments)
        },
        MoveHorizontal: function (w, y, v, x) {
            if (!x) {
                this.SUPER(arguments).MoveHorizontal.apply(this, arguments);
                return
            }
            if (this.disabled) {
                return
            }
            if (!this.submenu.posted) {
                this.Activate(w, y);
                return
            }
            var u = c.GetMenuNode(y).nextSibling.childNodes;
            if (u.length > 0) {
                this.submenu.items[0].Activate(w, u[0])
            }
        }
    });
    g.ITEM.RADIO = g.ENTRY.Subclass({
        variable: null,
        marker: (a ? "\u25CF" : "\u2713"),
        role: "menuitemradio",
        Attributes: function (v) {
            var u = s.settings[this.variable] === this.value ? "true" : "false";
            v = f.Insert({
                "aria-checked": u
            }, v);
            v = this.SUPER(arguments).Attributes.call(this, v);
            return v
        },
        Init: function (v, u, w) {
            if (!i(v)) {
                v = [v, v]
            }
            this.name = v;
            this.variable = u;
            this.With(w);
            if (this.value == null) {
                this.value = this.name[0]
            }
        },
        Label: function (v, w) {
            var u = {
                className: "MathJax_MenuRadioCheck" + this.rtlClass()
            };
            if (s.settings[this.variable] !== this.value) {
                u = {
                    style: {
                        display: "none"
                    }
                }
            }
            return [["span", u, [this.marker]], " " + this.Name()]
        },
        Mouseup: function (x, y) {
            if (!this.disabled) {
                var z = y.parentNode.childNodes;
                for (var v = 0, u = z.length; v < u; v++) {
                    var w = z[v].menuItem;
                    if (w && w.variable === this.variable) {
                        z[v].firstChild.style.display = "none"
                    }
                }
                y.firstChild.display = "";
                s.settings[this.variable] = this.value;
                g.cookie[this.variable] = s.settings[this.variable];
                g.saveCookie();
                d.Post(["radio button", this])
            }
            this.Remove(x, y);
            if (this.action && !this.disabled) {
                this.action.call(g, this)
            }
            return n(x)
        }
    });
    g.ITEM.CHECKBOX = g.ENTRY.Subclass({
        variable: null,
        marker: "\u2713",
        role: "menuitemcheckbox",
        Attributes: function (v) {
            var u = s.settings[this.variable] ? "true" : "false";
            v = f.Insert({
                "aria-checked": u
            }, v);
            v = this.SUPER(arguments).Attributes.call(this, v);
            return v
        },
        Init: function (v, u, w) {
            if (!i(v)) {
                v = [v, v]
            }
            this.name = v;
            this.variable = u;
            this.With(w)
        },
        Label: function (v, w) {
            var u = {
                className: "MathJax_MenuCheck" + this.rtlClass()
            };
            if (!s.settings[this.variable]) {
                u = {
                    style: {
                        display: "none"
                    }
                }
            }
            return [["span", u, [this.marker]], " " + this.Name()]
        },
        Mouseup: function (u, v) {
            if (!this.disabled) {
                v.firstChild.display = (s.settings[this.variable] ? "none" : "");
                s.settings[this.variable] = !s.settings[this.variable];
                g.cookie[this.variable] = s.settings[this.variable];
                g.saveCookie();
                d.Post(["checkbox", this])
            }
            this.Remove(u, v);
            if (this.action && !this.disabled) {
                this.action.call(g, this)
            }
            return n(u)
        }
    });
    g.ITEM.LABEL = g.ENTRY.Subclass({
        role: "menuitem",
        Init: function (u, v) {
            if (!i(u)) {
                u = [u, u]
            }
            this.name = u;
            this.With(v)
        },
        Label: function (u, v) {
            u.className += " MathJax_MenuLabel";
            return [this.Name()]
        },
        Activate: function (u, v) {
            this.Deactivate(v);
            g.Focus(v)
        },
        Mouseup: function (u, v) { }
    });
    g.ITEM.RULE = g.ITEM.Subclass({
        role: "separator",
        Attributes: function (u) {
            u = f.Insert({
                "aria-orientation": "vertical"
            }, u);
            u = this.SUPER(arguments).Attributes.call(this, u);
            return u
        },
        Label: function (u, v) {
            u.className += " MathJax_MenuRule";
            return null
        }
    });
    g.About = function (y) {
        var v = g.About.GetFont();
        var A = g.About.GetFormat();
        var u = ["MathJax.js v" + MathJax.fileversion, ["br"]];
        u.push(["div", {
            style: {
                "border-top": "groove 2px",
                margin: ".25em 0"
            }
        }]);
        g.About.GetJax(u, MathJax.InputJax, ["InputJax", "%1 Input Jax v%2"]);
        g.About.GetJax(u, MathJax.OutputJax, ["OutputJax", "%1 Output Jax v%2"]);
        g.About.GetJax(u, MathJax.ElementJax, ["ElementJax", "%1 Element Jax v%2"]);
        u.push(["div", {
            style: {
                "border-top": "groove 2px",
                margin: ".25em 0"
            }
        }]);
        g.About.GetJax(u, MathJax.Extension, ["Extension", "%1 Extension v%2"], true);
        u.push(["div", {
            style: {
                "border-top": "groove 2px",
                margin: ".25em 0"
            }
        }], ["center", {}, [f.Browser + " v" + f.Browser.version + (A ? " \u2014 " + t(A.replace(/ /g, ""), A) : "")]]);
        g.About.div = g.Background(g.About);
        var x = o.addElement(g.About.div, "div", {
            id: "MathJax_About",
            tabIndex: 0,
            onkeydown: g.About.Keydown
        }, [["b", {
            style: {
                fontSize: "120%"
            }
        }, ["MathJax"]], " v" + MathJax.version, ["br"], t(v.replace(/ /g, ""), "using " + v), ["br"], ["br"], ["span", {
            style: {
                display: "inline-block",
                "text-align": "left",
                "font-size": "80%",
                "max-height": "20em",
                overflow: "auto",
                "background-color": "#E4E4E4",
                padding: ".4em .6em",
                border: "1px inset"
            },
            tabIndex: 0
        }, u], ["br"], ["br"], ["a", {
            href: "http://www.mathjax.org/"
        }, ["www.mathjax.org"]], ["span", {
            className: "MathJax_MenuClose",
            id: "MathJax_AboutClose",
            onclick: g.About.Remove,
            onkeydown: g.About.Keydown,
            tabIndex: 0,
            role: "button",
            "aria-label": t("CloseAboutDialog", "Close about MathJax dialog")
        }, [["span", {}, "\u00D7"]]]]);
        if (y.type === "mouseup") {
            x.className += " MathJax_MousePost"
        }
        x.focus();
        MathJax.Localization.setCSS(x);
        var z = (document.documentElement || {});
        var w = window.innerHeight || z.clientHeight || z.scrollHeight || 0;
        if (g.prototype.msieAboutBug) {
            x.style.width = "20em";
            x.style.position = "absolute";
            x.style.left = Math.floor((document.documentElement.scrollWidth - x.offsetWidth) / 2) + "px";
            x.style.top = (Math.floor((w - x.offsetHeight) / 3) + document.body.scrollTop) + "px"
        } else {
            x.style.marginLeft = Math.floor(-x.offsetWidth / 2) + "px";
            x.style.top = Math.floor((w - x.offsetHeight) / 3) + "px"
        }
    };
    g.About.Remove = function (u) {
        if (g.About.div) {
            document.body.removeChild(g.About.div);
            delete g.About.div
        }
    };
    g.About.Keydown = function (u) {
        if (u.keyCode === b.ESCAPE || (this.id === "MathJax_AboutClose" && (u.keyCode === b.SPACE || u.keyCode === b.RETURN))) {
            g.About.Remove(u);
            g.CurrentNode().focus();
            n(u)
        }
    };
    g.About.GetJax = function (v, A, y, x) {
        var z = [];
        for (var B in A) {
            if (A.hasOwnProperty(B) && A[B]) {
                if ((x && A[B].version) || (A[B].isa && A[B].isa(A))) {
                    z.push(t(y[0], y[1], (A[B].id || B), A[B].version))
                }
            }
        }
        z.sort();
        for (var w = 0, u = z.length; w < u; w++) {
            v.push(z[w], ["br"])
        }
        return v
    };
    g.About.GetFont = function () {
        var u = MathJax.Hub.outputJax["jax/mml"][0] || {};
        var v = {
            SVG: "web SVG",
            CommonHTML: "web TeX",
            "HTML-CSS": (u.imgFonts ? "image" : (u.webFonts ? "web" : "local") + " " + u.fontInUse)
        }[u.id] || "generic";
        return v + " fonts"
    };
    g.About.GetFormat = function () {
        var u = MathJax.Hub.outputJax["jax/mml"][0] || {};
        if (u.id !== "HTML-CSS" || !u.webFonts || u.imgFonts) {
            return
        }
        return u.allowWebFonts.replace(/otf/, "woff or otf") + " fonts"
    };
    g.Help = function (u) {
        q.Require("[MathJax]/extensions/HelpDialog.js", function () {
            MathJax.Extension.Help.Dialog({
                type: u.type
            })
        })
    };
    g.ShowSource = function (y) {
        if (!y) {
            y = window.event
        }
        var x = {
            screenX: y.screenX,
            screenY: y.screenY
        };
        if (!g.jax) {
            return
        }
        if (this.format === "MathML") {
            var v = MathJax.ElementJax.mml;
            if (v && typeof (v.mbase.prototype.toMathML) !== "undefined") {
                try {
                    g.ShowSource.Text(g.jax.root.toMathML("", g.jax), y)
                } catch (w) {
                    if (!w.restart) {
                        throw w
                    }
                    e.After([this, g.ShowSource, x], w.restart)
                }
            } else {
                if (!q.loadingToMathML) {
                    q.loadingToMathML = true;
                    g.ShowSource.Window(y);
                    CallbackUtil.Queue(q.Require("[MathJax]/extensions/toMathML.js"), function () {
                        delete q.loadingToMathML;
                        if (!v.mbase.prototype.toMathML) {
                            v.mbase.prototype.toMathML = function () { }
                        }
                    }, [this, g.ShowSource, x]);
                    return
                }
            }
        } else {
            if (this.format === "Error") {
                g.ShowSource.Text(g.jax.errorText, y)
            } else {
                if (s.semanticsAnnotations[this.format]) {
                    var u = g.jax.root.getAnnotation(this.format);
                    if (u.data[0]) {
                        g.ShowSource.Text(u.data[0].toString())
                    }
                } else {
                    if (g.jax.originalText == null) {
                        alert(t("NoOriginalForm", "No original form available"));
                        return
                    }
                    g.ShowSource.Text(g.jax.originalText, y)
                }
            }
        }
    };
    g.ShowSource.Window = function (v) {
        if (!g.ShowSource.w) {
            var w = []
                , u = s.windowSettings;
            for (var x in u) {
                if (u.hasOwnProperty(x)) {
                    w.push(x + "=" + u[x])
                }
            }
            g.ShowSource.w = window.open("", "_blank", w.join(","))
        }
        return g.ShowSource.w
    };
    g.ShowSource.Text = function (z, x) {
        var u = g.ShowSource.Window(x);
        delete g.ShowSource.w;
        z = z.replace(/^\s*/, "").replace(/\s*$/, "");
        z = z.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        var y = t("EqSource", "MathJax Equation Source");
        if (g.isMobile) {
            u.document.open();
            u.document.write("<html><head><meta name='viewport' content='width=device-width, initial-scale=1.0' /><title>" + y + "</title></head><body style='font-size:85%'>");
            u.document.write("<pre>" + z + "</pre>");
            u.document.write("<hr><input type='button' value='" + t("Close", "Close") + "' onclick='window.close()' />");
            u.document.write("</body></html>");
            u.document.close()
        } else {
            u.document.open();
            u.document.write("<html><head><title>" + y + "</title></head><body style='font-size:85%'>");
            u.document.write("<table><tr><td><pre>" + z + "</pre></td></tr></table>");
            u.document.write("</body></html>");
            u.document.close();
            var v = u.document.body.firstChild;
            setTimeout(function () {
                var B = (u.outerHeight - u.innerHeight) || 30, A = (u.outerWidth - u.innerWidth) || 30, w, E;
                A = Math.max(140, Math.min(Math.floor(0.5 * screen.width), v.offsetWidth + A + 25));
                B = Math.max(40, Math.min(Math.floor(0.5 * screen.height), v.offsetHeight + B + 25));
                if (g.prototype.msieHeightBug) {
                    B += 35
                }
                u.resizeTo(A, B);
                var D;
                try {
                    D = x.screenX
                } catch (C) { }
                if (x && D != null) {
                    w = Math.max(0, Math.min(x.screenX - Math.floor(A / 2), screen.width - A - 20));
                    E = Math.max(0, Math.min(x.screenY - Math.floor(B / 2), screen.height - B - 20));
                    u.moveTo(w, E)
                }
            }, 50)
        }
    };
    g.Scale = function () {
        var z = ["CommonHTML", "HTML-CSS", "SVG", "NativeMML", "PreviewHTML"], u = z.length, y = 100, w, v;
        for (w = 0; w < u; w++) {
            v = r[z[w]];
            if (v) {
                y = v.config.scale;
                break
            }
        }
        var x = prompt(t("ScaleMath", "Scale all mathematics (compared to surrounding text) by"), y + "%");
        if (x) {
            if (x.match(/^\s*\d+(\.\d*)?\s*%?\s*$/)) {
                x = parseFloat(x);
                if (x) {
                    if (x !== y) {
                        for (w = 0; w < u; w++) {
                            v = r[z[w]];
                            if (v) {
                                v.config.scale = x
                            }
                        }
                        g.cookie.scale = f.config.scale = x;
                        g.saveCookie();
                        CallbackUtil.Queue(["Rerender", f])
                    }
                } else {
                    alert(t("NonZeroScale", "The scale should not be zero"))
                }
            } else {
                alert(t("PercentScale", "The scale should be a percentage (e.g., 120%%)"))
            }
        }
    };
    g.Zoom = function () {
        if (!MathJax.Extension.MathZoom) {
            q.Require("[MathJax]/extensions/MathZoom.js")
        }
    };
    g.Renderer = function () {
        var v = f.outputJax["jax/mml"];
        if (v[0] !== s.settings.renderer) {
            var y = f.Browser, x, u = g.Renderer.Messages, w;
            switch (s.settings.renderer) {
                case "NativeMML":
                    if (!s.settings.warnedMML) {
                        if (y.isChrome && y.version.substr(0, 3) !== "24.") {
                            x = u.MML.WebKit
                        } else {
                            if (y.isSafari && !y.versionAtLeast("5.0")) {
                                x = u.MML.WebKit
                            } else {
                                if (y.isMSIE) {
                                    if (!y.hasMathPlayer) {
                                        x = u.MML.MSIE
                                    }
                                } else {
                                    if (y.isEdge) {
                                        x = u.MML.WebKit
                                    } else {
                                        x = u.MML[y]
                                    }
                                }
                            }
                        }
                        w = "warnedMML"
                    }
                    break;
                case "SVG":
                    if (!s.settings.warnedSVG) {
                        if (y.isMSIE && !m) {
                            x = u.SVG.MSIE
                        }
                    }
                    break
            }
            if (x) {
                x = t(x[0], x[1]);
                x += "\n\n";
                x += t("SwitchAnyway", "Switch the renderer anyway?\n\n(Press OK to switch, CANCEL to continue with the current renderer)");
                g.cookie.renderer = v[0].id;
                g.saveCookie();
                if (!confirm(x)) {
                    g.cookie.renderer = s.settings.renderer = o.Cookie.Get("menu").renderer;
                    g.saveCookie();
                    return
                }
                if (w) {
                    g.cookie.warned = s.settings.warned = true
                }
                g.cookie.renderer = s.settings.renderer;
                g.saveCookie()
            }
            CallbackUtil.Queue(["setRenderer", f, s.settings.renderer, "jax/mml"], ["Rerender", f])
        }
    };
    g.Renderer.Messages = {
        MML: {
            WebKit: ["WebkitNativeMMLWarning", "Your browser doesn't seem to support MathML natively, so switching to MathML output may cause the mathematics on the page to become unreadable."],
            MSIE: ["MSIENativeMMLWarning", "Internet Explorer requires the MathPlayer plugin in order to process MathML output."],
            Opera: ["OperaNativeMMLWarning", "Opera's support for MathML is limited, so switching to MathML output may cause some expressions to render poorly."],
            Safari: ["SafariNativeMMLWarning", "Your browser's native MathML does not implement all the features used by MathJax, so some expressions may not render properly."],
            Firefox: ["FirefoxNativeMMLWarning", "Your browser's native MathML does not implement all the features used by MathJax, so some expressions may not render properly."]
        },
        SVG: {
            MSIE: ["MSIESVGWarning", "SVG is not implemented in Internet Explorer prior to IE9 or when it is emulating IE8 or below. Switching to SVG output will cause the mathematics to not display properly."]
        }
    };
    g.AssistiveMML = function (w, u) {
        var v = MathJax.Extension.AssistiveMML;
        if (!v) {
            if (!u) {
                q.Require("[MathJax]/extensions/AssistiveMML.js", ["AssistiveMML", g, w, true])
            }
            return
        }
        MathJax.Hub.Queue([(s.settings.assistiveMML ? "Add" : "Remove") + "AssistiveMathML", v])
    };
    g.Font = function () {
        var u = r["HTML-CSS"];
        if (!u) {
            return
        }
        document.location.reload()
    };
    g.Locale = function () {
        MathJax.Localization.setLocale(s.settings.locale);
        MathJax.Hub.Queue(["Reprocess", MathJax.Hub])
    };
    g.LoadLocale = function () {
        var u = prompt(t("LoadURL", "Load translation data from this URL:"));
        if (u) {
            if (!u.match(/\.js$/)) {
                alert(t("BadURL", "The URL should be for a javascript file that defines MathJax translation data.  Javascript file names should end with '.js'"))
            }
            q.Require(u, function (v) {
                if (v != q.STATUS.OK) {
                    alert(t("BadData", "Failed to load translation data from %1", u))
                }
            })
        }
    };
    g.MPEvents = function (w) {
        var v = s.settings.discoverable
            , u = g.MPEvents.Messages;
        if (!m) {
            if (s.settings.mpMouse && !confirm(t.apply(t, u.IE8warning))) {
                delete g.cookie.mpContext;
                delete s.settings.mpContext;
                delete g.cookie.mpMouse;
                delete s.settings.mpMouse;
                g.saveCookie();
                return
            }
            s.settings.mpContext = s.settings.mpMouse;
            g.cookie.mpContext = g.cookie.mpMouse = s.settings.mpMouse;
            g.saveCookie();
            MathJax.Hub.Queue(["Rerender", MathJax.Hub])
        } else {
            if (!v && w.name[1] === "Menu Events" && s.settings.mpContext) {
                alert(t.apply(t, u.IE9warning))
            }
        }
    };
    g.MPEvents.Messages = {
        IE8warning: ["IE8warning", "This will disable the MathJax menu and zoom features, but you can Alt-Click on an expression to obtain the MathJax menu instead.\n\nReally change the MathPlayer settings?"],
        IE9warning: ["IE9warning", "The MathJax contextual menu will be disabled, but you can Alt-Click on an expression to obtain the MathJax menu instead."]
    };
    f.Browser.Select({
        MSIE: function (u) {
            var v = (document.compatMode === "BackCompat");
            var w = u.versionAtLeast("8.0") && document.documentMode > 7;
            g.Augment({
                margin: 20,
                msieBackgroundBug: ((document.documentMode || 0) < 9),
                msieFixedPositionBug: (v || !w),
                msieAboutBug: v,
                msieHeightBug: ((document.documentMode || 0) < 9)
            });
            if (m) {
                delete s.styles["#MathJax_About"].filter;
                delete s.styles[".MathJax_Menu"].filter
            }
        },
        Firefox: function (u) {
            g.skipMouseover = u.isMobile && u.versionAtLeast("6.0");
            g.skipMousedown = u.isMobile
        }
    });
    g.isMobile = f.Browser.isMobile;
    g.noContextMenu = f.Browser.noContextMenu;
    g.CreateLocaleMenu = function () {
        if (!g.menu) {
            return
        }
        var z = g.menu.Find("Language").submenu
            , w = z.items;
        var v = []
            , B = MathJax.Localization.strings;
        for (var A in B) {
            if (B.hasOwnProperty(A)) {
                v.push(A)
            }
        }
        v = v.sort();
        z.items = [];
        for (var x = 0, u = v.length; x < u; x++) {
            var y = B[v[x]].menuTitle;
            if (y) {
                y += " (" + v[x] + ")"
            } else {
                y = v[x]
            }
            z.items.push(c.RADIO([v[x], y], "locale", {
                action: g.Locale
            }))
        }
        z.items.push(w[w.length - 2], w[w.length - 1])
    };
    g.CreateAnnotationMenu = function () {
        if (!g.menu) {
            return
        }
        var w = g.menu.Find("Show Math As", "Annotation").submenu;
        var v = s.semanticsAnnotations;
        for (var u in v) {
            if (v.hasOwnProperty(u)) {
                w.items.push(c.COMMAND([u, u], g.ShowSource, {
                    hidden: true,
                    nativeTouch: true,
                    format: u
                }))
            }
        }
    };
    f.Register.StartupHook("End Config", function () {
        s.settings = f.config.menuSettings;
        if (typeof (s.settings.showRenderer) !== "undefined") {
            s.showRenderer = s.settings.showRenderer
        }
        if (typeof (s.settings.showFontMenu) !== "undefined") {
            s.showFontMenu = s.settings.showFontMenu
        }
        if (typeof (s.settings.showContext) !== "undefined") {
            s.showContext = s.settings.showContext
        }
        g.getCookie();
        g.menu = g(c.SUBMENU(["Show", "Show Math As"],
            c.COMMAND(["MathMLcode", "MathML Code"], g.ShowSource, {
                nativeTouch: true,
                format: "MathML"
            }), c.COMMAND(["Original", "Original Form"], g.ShowSource, {
                nativeTouch: true
            }), c.SUBMENU(["Annotation", "Annotation"], {
                disabled: true
            }), c.RULE(), c.CHECKBOX(["texHints", "Show TeX hints in MathML"], "texHints"), c.CHECKBOX(["semantics", "Add original form as annotation"], "semantics")), c.RULE(), c.SUBMENU(["Settings", "Math Settings"], c.SUBMENU(["ZoomTrigger", "Zoom Trigger"], c.RADIO(["Hover", "Hover"], "zoom", {
                action: g.Zoom
            }), c.RADIO(["Click", "Click"], "zoom", {
                action: g.Zoom
            }), c.RADIO(["DoubleClick", "Double-Click"], "zoom", {
                action: g.Zoom
            }), c.RADIO(["NoZoom", "No Zoom"], "zoom", {
                value: "None"
            }), c.RULE(), c.LABEL(["TriggerRequires", "Trigger Requires:"]), c.CHECKBOX((f.Browser.isMac ? ["Option", "Option"] : ["Alt", "Alt"]), "ALT"), c.CHECKBOX(["Command", "Command"], "CMD", {
                hidden: !f.Browser.isMac
            }), c.CHECKBOX(["Control", "Control"], "CTRL", {
                hidden: f.Browser.isMac
            }), c.CHECKBOX(["Shift", "Shift"], "Shift")), c.SUBMENU(["ZoomFactor", "Zoom Factor"], c.RADIO("125%", "zscale"), c.RADIO("133%", "zscale"), c.RADIO("150%", "zscale"), c.RADIO("175%", "zscale"), c.RADIO("200%", "zscale"), c.RADIO("250%", "zscale"), c.RADIO("300%", "zscale"), c.RADIO("400%", "zscale")), c.RULE(), c.SUBMENU(["Renderer", "Math Renderer"], {
                hidden: !s.showRenderer
            }, c.RADIO(["HTML-CSS", "HTML-CSS"], "renderer", {
                action: g.Renderer
            }), c.RADIO(["CommonHTML", "Common HTML"], "renderer", {
                action: g.Renderer,
                value: "CommonHTML"
            }), c.RADIO(["PreviewHTML", "Preview HTML"], "renderer", {
                action: g.Renderer,
                value: "PreviewHTML"
            }), c.RADIO(["MathML", "MathML"], "renderer", {
                action: g.Renderer,
                value: "NativeMML"
            }), c.RADIO(["SVG", "SVG"], "renderer", {
                action: g.Renderer
            }), c.RADIO(["PlainSource", "Plain Source"], "renderer", {
                action: g.Renderer,
                value: "PlainSource"
            }), c.RULE(), c.CHECKBOX(["FastPreview", "Fast Preview"], "FastPreview")), c.SUBMENU("MathPlayer", {
                hidden: !f.Browser.isMSIE || !s.showMathPlayer,
                disabled: !f.Browser.hasMathPlayer
            }, c.LABEL(["MPHandles", "Let MathPlayer Handle:"]), c.CHECKBOX(["MenuEvents", "Menu Events"], "mpContext", {
                action: g.MPEvents,
                hidden: !m
            }), c.CHECKBOX(["MouseEvents", "Mouse Events"], "mpMouse", {
                action: g.MPEvents,
                hidden: !m
            }), c.CHECKBOX(["MenuAndMouse", "Mouse and Menu Events"], "mpMouse", {
                action: g.MPEvents,
                hidden: m
            })), c.SUBMENU(["FontPrefs", "Font Preference"], {
                hidden: !s.showFontMenu
            }, c.LABEL(["ForHTMLCSS", "For HTML-CSS:"]), c.RADIO(["Auto", "Auto"], "font", {
                action: g.Font
            }), c.RULE(), c.RADIO(["TeXLocal", "TeX (local)"], "font", {
                action: g.Font
            }), c.RADIO(["TeXWeb", "TeX (web)"], "font", {
                action: g.Font
            }), c.RADIO(["TeXImage", "TeX (image)"], "font", {
                action: g.Font
            }), c.RULE(), c.RADIO(["STIXLocal", "STIX (local)"], "font", {
                action: g.Font
            }), c.RADIO(["STIXWeb", "STIX (web)"], "font", {
                action: g.Font
            }), c.RULE(), c.RADIO(["AsanaMathWeb", "Asana Math (web)"], "font", {
                action: g.Font
            }), c.RADIO(["GyrePagellaWeb", "Gyre Pagella (web)"], "font", {
                action: g.Font
            }), c.RADIO(["GyreTermesWeb", "Gyre Termes (web)"], "font", {
                action: g.Font
            }), c.RADIO(["LatinModernWeb", "Latin Modern (web)"], "font", {
                action: g.Font
            }), c.RADIO(["NeoEulerWeb", "Neo Euler (web)"], "font", {
                action: g.Font
            })), c.SUBMENU(["ContextMenu", "Contextual Menu"], {
                hidden: !s.showContext
            }, c.RADIO(["MathJax", "MathJax"], "context"), c.RADIO(["Browser", "Browser"], "context")), c.COMMAND(["Scale", "Scale All Math ..."], g.Scale), c.RULE().With({
                hidden: !s.showDiscoverable,
                name: ["", "discover_rule"]
            }), c.CHECKBOX(["Discoverable", "Highlight on Hover"], "discoverable", {
                hidden: !s.showDiscoverable
            })), c.SUBMENU(["Accessibility", "Accessibility"], c.CHECKBOX(["AssistiveMML", "Assistive MathML"], "assistiveMML", {
                action: g.AssistiveMML
            }), c.CHECKBOX(["InTabOrder", "Include in Tab Order"], "inTabOrder")), c.SUBMENU(["Locale", "Language"], {
                hidden: !s.showLocale,
                ltr: true
            }, c.RADIO("en", "locale", {
                action: g.Locale
            }), c.RULE().With({
                hidden: !s.showLocaleURL,
                name: ["", "localURL_rule"]
            }), c.COMMAND(["LoadLocale", "Load from URL ..."], g.LoadLocale, {
                hidden: !s.showLocaleURL
            })), c.RULE(), c.COMMAND(["About", "About MathJax"], g.About), c.COMMAND(["Help", "MathJax Help"], g.Help));
        if (g.isMobile) {
            (function () {
                var v = s.settings;
                var u = g.menu.Find("Math Settings", "Zoom Trigger").submenu;
                u.items[0].disabled = u.items[1].disabled = true;
                if (v.zoom === "Hover" || v.zoom == "Click") {
                    v.zoom = "None"
                }
                u.items = u.items.slice(0, 4);
                if (navigator.appVersion.match(/[ (]Android[) ]/)) {
                    g.ITEM.SUBMENU.Augment({
                        marker: "\u00BB"
                    })
                }
            }
            )()
        }
        g.CreateLocaleMenu();
        g.CreateAnnotationMenu()
    });
    g.showRenderer = function (u) {
        g.cookie.showRenderer = s.showRenderer = u;
        g.saveCookie();
        g.menu.Find("Math Settings", "Math Renderer").hidden = !u
    };
    g.showMathPlayer = function (u) {
        g.cookie.showMathPlayer = s.showMathPlayer = u;
        g.saveCookie();
        g.menu.Find("Math Settings", "MathPlayer").hidden = !u
    };
    g.showFontMenu = function (u) {
        g.cookie.showFontMenu = s.showFontMenu = u;
        g.saveCookie();
        g.menu.Find("Math Settings", "Font Preference").hidden = !u
    };
    g.showContext = function (u) {
        g.cookie.showContext = s.showContext = u;
        g.saveCookie();
        g.menu.Find("Math Settings", "Contextual Menu").hidden = !u
    };
    g.showDiscoverable = function (u) {
        g.cookie.showDiscoverable = s.showDiscoverable = u;
        g.saveCookie();
        g.menu.Find("Math Settings", "Highlight on Hover").hidden = !u;
        g.menu.Find("Math Settings", "discover_rule").hidden = !u
    };
    g.showLocale = function (u) {
        g.cookie.showLocale = s.showLocale = u;
        g.saveCookie();
        g.menu.Find("Language").hidden = !u
    };
    MathJax.Hub.Register.StartupHook("HTML-CSS Jax Ready", function () {
        if (!MathJax.OutputJax["HTML-CSS"].config.imageFont) {
            g.menu.Find("Math Settings", "Font Preference", "TeX (image)").disabled = true
        }
    });
    CallbackUtil.Queue(
        f.Register.StartupHook("End Config", {}),
        ["Styles", q, s.styles],
        ["Post", f.Startup.signal, "MathMenu Ready"],
        ["loadComplete", q, "[MathJax]/extensions/MathMenu.js"]
    );
}
)(MathJax.Hub, MathJax.HTML, MathJax.Ajax, CallbackUtil.Create, MathJax.OutputJax);

MathJax.ElementJax.mml = MathJax.ElementJax({
    mimeType: "jax/mml"
}, {
    id: "mml",
    version: "2.7.2",
    directory: MathJax.ElementJax.directory + "/mml",
    extensionDir: MathJax.ElementJax.extensionDir + "/mml",
    optableDir: MathJax.ElementJax.directory + "/mml/optable"
});
MathJax.ElementJax.mml.Augment({
    Init: function () {
        if (arguments.length === 1 && arguments[0].type === "math") {
            this.root = arguments[0]
        } else {
            this.root = MathJax.ElementJax.mml.math.apply(this, arguments)
        }
        if (this.root.attr && this.root.attr.mode) {
            if (!this.root.display && this.root.attr.mode === "display") {
                this.root.display = "block";
                this.root.attrNames.push("display")
            }
            delete this.root.attr.mode;
            for (var b = 0, a = this.root.attrNames.length; b < a; b++) {
                if (this.root.attrNames[b] === "mode") {
                    this.root.attrNames.splice(b, 1);
                    break
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
    COLOR: {
        TRANSPARENT: "transparent"
    },
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
    INDENTSHIFT: {
        INDENTSHIFT: "indentshift"
    },
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
    WIDTH: {
        AUTO: "auto",
        FIT: "fit"
    },
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
    TEXCLASSNAMES: ["ORD", "OP", "BIN", "REL", "OPEN", "CLOSE", "PUNCT", "INNER", "VCENTER"],
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
        var c = this.merror(d)
            , b = MathJax.Localization.fontDirection()
            , a = MathJax.Localization.fontFamily();
        if (e) {
            c = c.With(e)
        }
        if (b || a) {
            c = this.mstyle(c);
            if (b) {
                c.dir = b
            }
            if (a) {
                c.style.fontFamily = "font-family: " + a
            }
        }
        return c
    }
});
(function (a) {
    a.mbase = MathJax.Object.Subclass({
        type: "base",
        isToken: false,
        defaults: {
            mathbackground: a.INHERIT,
            mathcolor: a.INHERIT,
            dir: a.INHERIT
        },
        noInherit: {},
        noInheritAttribute: {
            texClass: true
        },
        getRemoved: {},
        linebreakContainer: false,
        Init: function () {
            this.data = [];
            if (this.inferRow && !(arguments.length === 1 && arguments[0].inferred)) {
                this.Append(a.mrow().With({
                    inferred: true,
                    notParent: true
                }))
            }
            this.Append.apply(this, arguments)
        },
        With: function (e) {
            for (var f in e) {
                if (e.hasOwnProperty(f)) {
                    this[f] = e[f]
                }
            }
            return this
        },
        Append: function () {
            if (this.inferRow && this.data.length) {
                this.data[0].Append.apply(this.data[0], arguments)
            } else {
                for (var f = 0, e = arguments.length; f < e; f++) {
                    this.SetData(this.data.length, arguments[f])
                }
            }
        },
        SetData: function (e, f) {
            if (f != null) {
                if (!(f instanceof a.mbase)) {
                    f = (this.isToken || this.isChars ? a.chars(f) : a.mtext(f))
                }
                f.parent = this;
                f.setInherit(this.inheritFromMe ? this : this.inherit)
            }
            this.data[e] = f
        },
        Parent: function () {
            var e = this.parent;
            while (e && e.notParent) {
                e = e.parent
            }
            return e
        },
        Get: function (f, k, l) {
            if (!l) {
                if (this[f] != null) {
                    return this[f]
                }
                if (this.attr && this.attr[f] != null) {
                    return this.attr[f]
                }
            }
            var g = this.Parent();
            if (g && g["adjustChild_" + f] != null) {
                return (g["adjustChild_" + f])(this.childPosition(), k)
            }
            var j = this.inherit;
            var e = j;
            while (j) {
                var i = j[f];
                if (i == null && j.attr) {
                    i = j.attr[f]
                }
                if (j.removedStyles && j.getRemoved[f] && i == null) {
                    i = j.removedStyles[j.getRemoved[f]]
                }
                if (i != null && j.noInheritAttribute && !j.noInheritAttribute[f]) {
                    var h = j.noInherit[this.type];
                    if (!(h && h[f])) {
                        return i
                    }
                }
                e = j;
                j = j.inherit
            }
            if (!k) {
                if (this.defaults[f] === a.AUTO) {
                    return this.autoDefault(f)
                }
                if (this.defaults[f] !== a.INHERIT && this.defaults[f] != null) {
                    return this.defaults[f]
                }
                if (e) {
                    return e.defaults[f]
                }
            }
            return null
        },
        hasValue: function (e) {
            return (this.Get(e, true) != null)
        },
        getValues: function () {
            var f = {};
            for (var g = 0, e = arguments.length; g < e; g++) {
                f[arguments[g]] = this.Get(arguments[g])
            }
            return f
        },
        adjustChild_scriptlevel: function (f, e) {
            return this.Get("scriptlevel", e)
        },
        adjustChild_displaystyle: function (f, e) {
            return this.Get("displaystyle", e)
        },
        adjustChild_texprimestyle: function (f, e) {
            return this.Get("texprimestyle", e)
        },
        childPosition: function () {
            var h = this
                , g = h.parent;
            while (g.notParent) {
                h = g;
                g = h.parent
            }
            for (var f = 0, e = g.data.length; f < e; f++) {
                if (g.data[f] === h) {
                    return f
                }
            }
            return null
        },
        setInherit: function (g) {
            if (g !== this.inherit && this.inherit == null) {
                this.inherit = g;
                for (var f = 0, e = this.data.length; f < e; f++) {
                    if (this.data[f] && this.data[f].setInherit) {
                        this.data[f].setInherit(g)
                    }
                }
            }
        },
        setTeXclass: function (e) {
            this.getPrevClass(e);
            return (typeof (this.texClass) !== "undefined" ? this : e)
        },
        getPrevClass: function (e) {
            if (e) {
                this.prevClass = e.Get("texClass");
                this.prevLevel = e.Get("scriptlevel")
            }
        },
        updateTeXclass: function (e) {
            if (e) {
                this.prevClass = e.prevClass;
                delete e.prevClass;
                this.prevLevel = e.prevLevel;
                delete e.prevLevel;
                this.texClass = e.Get("texClass")
            }
        },
        texSpacing: function () {
            var f = (this.prevClass != null ? this.prevClass : a.TEXCLASS.NONE);
            var e = (this.Get("texClass") || a.TEXCLASS.ORD);
            if (f === a.TEXCLASS.NONE || e === a.TEXCLASS.NONE) {
                return ""
            }
            if (f === a.TEXCLASS.VCENTER) {
                f = a.TEXCLASS.ORD
            }
            if (e === a.TEXCLASS.VCENTER) {
                e = a.TEXCLASS.ORD
            }
            var g = this.TEXSPACE[f][e];
            if ((this.prevLevel > 0 || this.Get("scriptlevel") > 0) && g >= 0) {
                return ""
            }
            return this.TEXSPACELENGTH[Math.abs(g)]
        },
        TEXSPACELENGTH: ["", a.LENGTH.THINMATHSPACE, a.LENGTH.MEDIUMMATHSPACE, a.LENGTH.THICKMATHSPACE],
        TEXSPACE: [[0, -1, 2, 3, 0, 0, 0, 1], [-1, -1, 0, 3, 0, 0, 0, 1], [2, 2, 0, 0, 2, 0, 0, 2], [3, 3, 0, 0, 3, 0, 0, 3], [0, 0, 0, 0, 0, 0, 0, 0], [0, -1, 2, 3, 0, 0, 0, 1], [1, 1, 0, 1, 1, 1, 1, 1], [1, -1, 2, 3, 1, 0, 1, 1]],
        autoDefault: function (e) {
            return ""
        },
        isSpacelike: function () {
            return false
        },
        isEmbellished: function () {
            return false
        },
        Core: function () {
            return this
        },
        CoreMO: function () {
            return this
        },
        childIndex: function (g) {
            if (g == null) {
                return
            }
            for (var f = 0, e = this.data.length; f < e; f++) {
                if (g === this.data[f]) {
                    return f
                }
            }
        },
        CoreIndex: function () {
            return (this.inferRow ? this.data[0] || this : this).childIndex(this.Core())
        },
        hasNewline: function () {
            if (this.isEmbellished()) {
                return this.CoreMO().hasNewline()
            }
            if (this.isToken || this.linebreakContainer) {
                return false
            }
            for (var f = 0, e = this.data.length; f < e; f++) {
                if (this.data[f] && this.data[f].hasNewline()) {
                    return true
                }
            }
            return false
        },
        array: function () {
            if (this.inferred) {
                return this.data
            } else {
                return [this]
            }
        },
        toString: function () {
            return this.type + "(" + this.data.join(",") + ")"
        },
        getAnnotation: function () {
            return null
        }
    }, {
        childrenSpacelike: function () {
            for (var f = 0, e = this.data.length; f < e; f++) {
                if (!this.data[f].isSpacelike()) {
                    return false
                }
            }
            return true
        },
        childEmbellished: function () {
            return (this.data[0] && this.data[0].isEmbellished())
        },
        childCore: function () {
            return (this.inferRow && this.data[0] ? this.data[0].Core() : this.data[0])
        },
        childCoreMO: function () {
            return (this.data[0] ? this.data[0].CoreMO() : null)
        },
        setChildTeXclass: function (e) {
            if (this.data[0]) {
                e = this.data[0].setTeXclass(e);
                this.updateTeXclass(this.data[0])
            }
            return e
        },
        setBaseTeXclasses: function (g) {
            this.getPrevClass(g);
            this.texClass = null;
            if (this.data[0]) {
                if (this.isEmbellished() || this.data[0].isa(a.mi)) {
                    g = this.data[0].setTeXclass(g);
                    this.updateTeXclass(this.Core())
                } else {
                    this.data[0].setTeXclass();
                    g = this
                }
            } else {
                g = this
            }
            for (var f = 1, e = this.data.length; f < e; f++) {
                if (this.data[f]) {
                    this.data[f].setTeXclass()
                }
            }
            return g
        },
        setSeparateTeXclasses: function (g) {
            this.getPrevClass(g);
            for (var f = 0, e = this.data.length; f < e; f++) {
                if (this.data[f]) {
                    this.data[f].setTeXclass()
                }
            }
            if (this.isEmbellished()) {
                this.updateTeXclass(this.Core())
            }
            return this
        }
    });
    a.mi = a.mbase.Subclass({
        type: "mi",
        isToken: true,
        texClass: a.TEXCLASS.ORD,
        defaults: {
            mathvariant: a.AUTO,
            mathsize: a.INHERIT,
            mathbackground: a.INHERIT,
            mathcolor: a.INHERIT,
            dir: a.INHERIT
        },
        autoDefault: function (f) {
            if (f === "mathvariant") {
                var e = (this.data[0] || "").toString();
                return (e.length === 1 || (e.length === 2 && e.charCodeAt(0) >= 55296 && e.charCodeAt(0) < 56320) ? a.VARIANT.ITALIC : a.VARIANT.NORMAL)
            }
            return ""
        },
        setTeXclass: function (f) {
            this.getPrevClass(f);
            var e = this.data.join("");
            if (e.length > 1 && e.match(/^[a-z][a-z0-9]*$/i) && this.texClass === a.TEXCLASS.ORD) {
                this.texClass = a.TEXCLASS.OP;
                this.autoOP = true
            }
            return this
        }
    });
    a.mn = a.mbase.Subclass({
        type: "mn",
        isToken: true,
        texClass: a.TEXCLASS.ORD,
        defaults: {
            mathvariant: a.INHERIT,
            mathsize: a.INHERIT,
            mathbackground: a.INHERIT,
            mathcolor: a.INHERIT,
            dir: a.INHERIT
        }
    });
    a.mo = a.mbase.Subclass({
        type: "mo",
        isToken: true,
        defaults: {
            mathvariant: a.INHERIT,
            mathsize: a.INHERIT,
            mathbackground: a.INHERIT,
            mathcolor: a.INHERIT,
            dir: a.INHERIT,
            form: a.AUTO,
            fence: a.AUTO,
            separator: a.AUTO,
            lspace: a.AUTO,
            rspace: a.AUTO,
            stretchy: a.AUTO,
            symmetric: a.AUTO,
            maxsize: a.AUTO,
            minsize: a.AUTO,
            largeop: a.AUTO,
            movablelimits: a.AUTO,
            accent: a.AUTO,
            linebreak: a.LINEBREAK.AUTO,
            lineleading: a.INHERIT,
            linebreakstyle: a.AUTO,
            linebreakmultchar: a.INHERIT,
            indentalign: a.INHERIT,
            indentshift: a.INHERIT,
            indenttarget: a.INHERIT,
            indentalignfirst: a.INHERIT,
            indentshiftfirst: a.INHERIT,
            indentalignlast: a.INHERIT,
            indentshiftlast: a.INHERIT,
            texClass: a.AUTO
        },
        defaultDef: {
            form: a.FORM.INFIX,
            fence: false,
            separator: false,
            lspace: a.LENGTH.THICKMATHSPACE,
            rspace: a.LENGTH.THICKMATHSPACE,
            stretchy: false,
            symmetric: false,
            maxsize: a.SIZE.INFINITY,
            minsize: "0em",
            largeop: false,
            movablelimits: false,
            accent: false,
            linebreak: a.LINEBREAK.AUTO,
            lineleading: "1ex",
            linebreakstyle: "before",
            indentalign: a.INDENTALIGN.AUTO,
            indentshift: "0",
            indenttarget: "",
            indentalignfirst: a.INDENTALIGN.INDENTALIGN,
            indentshiftfirst: a.INDENTSHIFT.INDENTSHIFT,
            indentalignlast: a.INDENTALIGN.INDENTALIGN,
            indentshiftlast: a.INDENTSHIFT.INDENTSHIFT,
            texClass: a.TEXCLASS.REL
        },
        SPACE_ATTR: {
            lspace: 1,
            rspace: 2,
            form: 4
        },
        useMMLspacing: 7,
        autoDefault: function (g, n) {
            var l = this.def;
            if (!l) {
                if (g === "form") {
                    this.useMMLspacing &= ~this.SPACE_ATTR.form;
                    return this.getForm()
                }
                var k = this.data.join("");
                var f = [this.Get("form"), a.FORM.INFIX, a.FORM.POSTFIX, a.FORM.PREFIX];
                for (var h = 0, e = f.length; h < e; h++) {
                    var j = this.OPTABLE[f[h]][k];
                    if (j) {
                        l = this.makeDef(j);
                        break
                    }
                }
                if (!l) {
                    l = this.CheckRange(k)
                }
                if (!l && n) {
                    l = {}
                } else {
                    if (!l) {
                        l = MathJax.Hub.Insert({}, this.defaultDef)
                    }
                    if (this.parent) {
                        this.def = l
                    } else {
                        l = MathJax.Hub.Insert({}, l)
                    }
                    l.form = f[0]
                }
            }
            this.useMMLspacing &= ~(this.SPACE_ATTR[g] || 0);
            if (l[g] != null) {
                return l[g]
            } else {
                if (!n) {
                    return this.defaultDef[g]
                }
            }
            return ""
        },
        CheckRange: function (j) {
            var k = j.charCodeAt(0);
            if (k >= 55296 && k < 56320) {
                k = (((k - 55296) << 10) + (j.charCodeAt(1) - 56320)) + 65536
            }
            for (var g = 0, e = this.RANGES.length; g < e && this.RANGES[g][0] <= k; g++) {
                if (k <= this.RANGES[g][1]) {
                    if (this.RANGES[g][3]) {
                        var f = a.optableDir + "/" + this.RANGES[g][3] + ".js";
                        this.RANGES[g][3] = null;
                        MathJax.Hub.RestartAfter(MathJax.Ajax.Require(f))
                    }
                    var h = a.TEXCLASSNAMES[this.RANGES[g][2]];
                    h = this.OPTABLE.infix[j] = a.mo.OPTYPES[h === "BIN" ? "BIN3" : h];
                    return this.makeDef(h)
                }
            }
            return null
        },
        makeDef: function (f) {
            if (f[2] == null) {
                f[2] = this.defaultDef.texClass
            }
            if (!f[3]) {
                f[3] = {}
            }
            var e = MathJax.Hub.Insert({}, f[3]);
            e.lspace = this.SPACE[f[0]];
            e.rspace = this.SPACE[f[1]];
            e.texClass = f[2];
            if (e.texClass === a.TEXCLASS.REL && (this.movablelimits || this.data.join("").match(/^[a-z]+$/i))) {
                e.texClass = a.TEXCLASS.OP
            }
            return e
        },
        getForm: function () {
            var e = this
                , g = this.parent
                , f = this.Parent();
            while (f && f.isEmbellished()) {
                e = g;
                g = f.parent;
                f = f.Parent()
            }
            if (g && g.type === "mrow" && g.NonSpaceLength() !== 1) {
                if (g.FirstNonSpace() === e) {
                    return a.FORM.PREFIX
                }
                if (g.LastNonSpace() === e) {
                    return a.FORM.POSTFIX
                }
            }
            return a.FORM.INFIX
        },
        isEmbellished: function () {
            return true
        },
        hasNewline: function () {
            return (this.Get("linebreak") === a.LINEBREAK.NEWLINE)
        },
        CoreParent: function () {
            var e = this;
            while (e && e.isEmbellished() && e.CoreMO() === this && !e.isa(a.math)) {
                e = e.Parent()
            }
            return e
        },
        CoreText: function (e) {
            if (!e) {
                return ""
            }
            if (e.isEmbellished()) {
                return e.CoreMO().data.join("")
            }
            while ((((e.isa(a.mrow) || e.isa(a.TeXAtom) || e.isa(a.mstyle) || e.isa(a.mphantom)) && e.data.length === 1) || e.isa(a.munderover)) && e.data[0]) {
                e = e.data[0]
            }
            if (!e.isToken) {
                return ""
            } else {
                return e.data.join("")
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
                    f = e[f] || f
                }
            }
            return f
        },
        setTeXclass: function (f) {
            var e = this.getValues("form", "lspace", "rspace", "fence");
            if (this.useMMLspacing) {
                this.texClass = a.TEXCLASS.NONE;
                return this
            }
            if (e.fence && !this.texClass) {
                if (e.form === a.FORM.PREFIX) {
                    this.texClass = a.TEXCLASS.OPEN
                }
                if (e.form === a.FORM.POSTFIX) {
                    this.texClass = a.TEXCLASS.CLOSE
                }
            }
            this.texClass = this.Get("texClass");
            if (this.data.join("") === "\u2061") {
                if (f) {
                    f.texClass = a.TEXCLASS.OP;
                    f.fnOP = true
                }
                this.texClass = this.prevClass = a.TEXCLASS.NONE;
                return f
            }
            return this.adjustTeXclass(f)
        },
        adjustTeXclass: function (f) {
            if (this.texClass === a.TEXCLASS.NONE) {
                return f
            }
            if (f) {
                if (f.autoOP && (this.texClass === a.TEXCLASS.BIN || this.texClass === a.TEXCLASS.REL)) {
                    f.texClass = a.TEXCLASS.ORD
                }
                this.prevClass = f.texClass || a.TEXCLASS.ORD;
                this.prevLevel = f.Get("scriptlevel")
            } else {
                this.prevClass = a.TEXCLASS.NONE
            }
            if (this.texClass === a.TEXCLASS.BIN && (this.prevClass === a.TEXCLASS.NONE || this.prevClass === a.TEXCLASS.BIN || this.prevClass === a.TEXCLASS.OP || this.prevClass === a.TEXCLASS.REL || this.prevClass === a.TEXCLASS.OPEN || this.prevClass === a.TEXCLASS.PUNCT)) {
                this.texClass = a.TEXCLASS.ORD
            } else {
                if (this.prevClass === a.TEXCLASS.BIN && (this.texClass === a.TEXCLASS.REL || this.texClass === a.TEXCLASS.CLOSE || this.texClass === a.TEXCLASS.PUNCT)) {
                    f.texClass = this.prevClass = a.TEXCLASS.ORD
                } else {
                    if (this.texClass === a.TEXCLASS.BIN) {
                        var g = this
                            , e = this.parent;
                        while (e && e.parent && e.isEmbellished() && (e.data.length === 1 || (e.type !== "mrow" && e.Core() === g))) {
                            g = e;
                            e = e.parent
                        }
                        if (e.data[e.data.length - 1] === g) {
                            this.texClass = a.TEXCLASS.ORD
                        }
                    }
                }
            }
            return this
        }
    });
    a.mtext = a.mbase.Subclass({
        type: "mtext",
        isToken: true,
        isSpacelike: function () {
            return true
        },
        texClass: a.TEXCLASS.ORD,
        defaults: {
            mathvariant: a.INHERIT,
            mathsize: a.INHERIT,
            mathbackground: a.INHERIT,
            mathcolor: a.INHERIT,
            dir: a.INHERIT
        }
    });
    a.mspace = a.mbase.Subclass({
        type: "mspace",
        isToken: true,
        isSpacelike: function () {
            return true
        },
        defaults: {
            mathbackground: a.INHERIT,
            mathcolor: a.INHERIT,
            width: "0em",
            height: "0ex",
            depth: "0ex",
            linebreak: a.LINEBREAK.AUTO
        },
        hasDimAttr: function () {
            return (this.hasValue("width") || this.hasValue("height") || this.hasValue("depth"))
        },
        hasNewline: function () {
            return (!this.hasDimAttr() && this.Get("linebreak") === a.LINEBREAK.NEWLINE)
        }
    });
    a.ms = a.mbase.Subclass({
        type: "ms",
        isToken: true,
        texClass: a.TEXCLASS.ORD,
        defaults: {
            mathvariant: a.INHERIT,
            mathsize: a.INHERIT,
            mathbackground: a.INHERIT,
            mathcolor: a.INHERIT,
            dir: a.INHERIT,
            lquote: '"',
            rquote: '"'
        }
    });
    a.mglyph = a.mbase.Subclass({
        type: "mglyph",
        isToken: true,
        texClass: a.TEXCLASS.ORD,
        defaults: {
            mathbackground: a.INHERIT,
            mathcolor: a.INHERIT,
            alt: "",
            src: "",
            width: a.AUTO,
            height: a.AUTO,
            valign: "0em"
        }
    });
    a.mrow = a.mbase.Subclass({
        type: "mrow",
        isSpacelike: a.mbase.childrenSpacelike,
        inferred: false,
        notParent: false,
        isEmbellished: function () {
            var f = false;
            for (var g = 0, e = this.data.length; g < e; g++) {
                if (this.data[g] == null) {
                    continue
                }
                if (this.data[g].isEmbellished()) {
                    if (f) {
                        return false
                    }
                    f = true;
                    this.core = g
                } else {
                    if (!this.data[g].isSpacelike()) {
                        return false
                    }
                }
            }
            return f
        },
        NonSpaceLength: function () {
            var g = 0;
            for (var f = 0, e = this.data.length; f < e; f++) {
                if (this.data[f] && !this.data[f].isSpacelike()) {
                    g++
                }
            }
            return g
        },
        FirstNonSpace: function () {
            for (var f = 0, e = this.data.length; f < e; f++) {
                if (this.data[f] && !this.data[f].isSpacelike()) {
                    return this.data[f]
                }
            }
            return null
        },
        LastNonSpace: function () {
            for (var e = this.data.length - 1; e >= 0; e--) {
                if (this.data[0] && !this.data[e].isSpacelike()) {
                    return this.data[e]
                }
            }
            return null
        },
        Core: function () {
            if (!(this.isEmbellished()) || typeof (this.core) === "undefined") {
                return this
            }
            return this.data[this.core]
        },
        CoreMO: function () {
            if (!(this.isEmbellished()) || typeof (this.core) === "undefined") {
                return this
            }
            return this.data[this.core].CoreMO()
        },
        toString: function () {
            if (this.inferred) {
                return "[" + this.data.join(",") + "]"
            }
            return this.SUPER(arguments).toString.call(this)
        },
        setTeXclass: function (g) {
            var f, e = this.data.length;
            if ((this.open || this.close) && (!g || !g.fnOP)) {
                this.getPrevClass(g);
                g = null;
                for (f = 0; f < e; f++) {
                    if (this.data[f]) {
                        g = this.data[f].setTeXclass(g)
                    }
                }
                if (!this.hasOwnProperty("texClass")) {
                    this.texClass = a.TEXCLASS.INNER
                }
                return this
            } else {
                for (f = 0; f < e; f++) {
                    if (this.data[f]) {
                        g = this.data[f].setTeXclass(g)
                    }
                }
                if (this.data[0]) {
                    this.updateTeXclass(this.data[0])
                }
                return g
            }
        },
        getAnnotation: function (e) {
            if (this.data.length != 1) {
                return null
            }
            return this.data[0].getAnnotation(e)
        }
    });
    a.mfrac = a.mbase.Subclass({
        type: "mfrac",
        num: 0,
        den: 1,
        linebreakContainer: true,
        isEmbellished: a.mbase.childEmbellished,
        Core: a.mbase.childCore,
        CoreMO: a.mbase.childCoreMO,
        defaults: {
            mathbackground: a.INHERIT,
            mathcolor: a.INHERIT,
            linethickness: a.LINETHICKNESS.MEDIUM,
            numalign: a.ALIGN.CENTER,
            denomalign: a.ALIGN.CENTER,
            bevelled: false
        },
        adjustChild_displaystyle: function (e) {
            return false
        },
        adjustChild_scriptlevel: function (f) {
            var e = this.Get("scriptlevel");
            if (!this.Get("displaystyle") || e > 0) {
                e++
            }
            return e
        },
        adjustChild_texprimestyle: function (e) {
            if (e == this.den) {
                return true
            }
            return this.Get("texprimestyle")
        },
        setTeXclass: a.mbase.setSeparateTeXclasses
    });
    a.msqrt = a.mbase.Subclass({
        type: "msqrt",
        inferRow: true,
        linebreakContainer: true,
        texClass: a.TEXCLASS.ORD,
        setTeXclass: a.mbase.setSeparateTeXclasses,
        adjustChild_texprimestyle: function (e) {
            return true
        }
    });
    a.mroot = a.mbase.Subclass({
        type: "mroot",
        linebreakContainer: true,
        texClass: a.TEXCLASS.ORD,
        adjustChild_displaystyle: function (e) {
            if (e === 1) {
                return false
            }
            return this.Get("displaystyle")
        },
        adjustChild_scriptlevel: function (f) {
            var e = this.Get("scriptlevel");
            if (f === 1) {
                e += 2
            }
            return e
        },
        adjustChild_texprimestyle: function (e) {
            if (e === 0) {
                return true
            }
            return this.Get("texprimestyle")
        },
        setTeXclass: a.mbase.setSeparateTeXclasses
    });
    a.mstyle = a.mbase.Subclass({
        type: "mstyle",
        isSpacelike: a.mbase.childrenSpacelike,
        isEmbellished: a.mbase.childEmbellished,
        Core: a.mbase.childCore,
        CoreMO: a.mbase.childCoreMO,
        inferRow: true,
        defaults: {
            scriptlevel: a.INHERIT,
            displaystyle: a.INHERIT,
            scriptsizemultiplier: Math.sqrt(1 / 2),
            scriptminsize: "8pt",
            mathbackground: a.INHERIT,
            mathcolor: a.INHERIT,
            dir: a.INHERIT,
            infixlinebreakstyle: a.LINEBREAKSTYLE.BEFORE,
            decimalseparator: "."
        },
        adjustChild_scriptlevel: function (g) {
            var f = this.scriptlevel;
            if (f == null) {
                f = this.Get("scriptlevel")
            } else {
                if (String(f).match(/^ *[-+]/)) {
                    var e = this.Get("scriptlevel", null, true);
                    f = e + parseInt(f)
                }
            }
            return f
        },
        inheritFromMe: true,
        noInherit: {
            mpadded: {
                width: true,
                height: true,
                depth: true,
                lspace: true,
                voffset: true
            },
            mtable: {
                width: true,
                height: true,
                depth: true,
                align: true
            }
        },
        getRemoved: {
            fontfamily: "fontFamily",
            fontweight: "fontWeight",
            fontstyle: "fontStyle",
            fontsize: "fontSize"
        },
        setTeXclass: a.mbase.setChildTeXclass
    });
    a.merror = a.mbase.Subclass({
        type: "merror",
        inferRow: true,
        linebreakContainer: true,
        texClass: a.TEXCLASS.ORD
    });
    a.mpadded = a.mbase.Subclass({
        type: "mpadded",
        inferRow: true,
        isSpacelike: a.mbase.childrenSpacelike,
        isEmbellished: a.mbase.childEmbellished,
        Core: a.mbase.childCore,
        CoreMO: a.mbase.childCoreMO,
        defaults: {
            mathbackground: a.INHERIT,
            mathcolor: a.INHERIT,
            width: "",
            height: "",
            depth: "",
            lspace: 0,
            voffset: 0
        },
        setTeXclass: a.mbase.setChildTeXclass
    });
    a.mphantom = a.mbase.Subclass({
        type: "mphantom",
        texClass: a.TEXCLASS.ORD,
        inferRow: true,
        isSpacelike: a.mbase.childrenSpacelike,
        isEmbellished: a.mbase.childEmbellished,
        Core: a.mbase.childCore,
        CoreMO: a.mbase.childCoreMO,
        setTeXclass: a.mbase.setChildTeXclass
    });
    a.mfenced = a.mbase.Subclass({
        type: "mfenced",
        defaults: {
            mathbackground: a.INHERIT,
            mathcolor: a.INHERIT,
            open: "(",
            close: ")",
            separators: ","
        },
        addFakeNodes: function () {
            var f = this.getValues("open", "close", "separators");
            f.open = f.open.replace(/[ \t\n\r]/g, "");
            f.close = f.close.replace(/[ \t\n\r]/g, "");
            f.separators = f.separators.replace(/[ \t\n\r]/g, "");
            if (f.open !== "") {
                this.SetData("open", a.mo(f.open).With({
                    fence: true,
                    form: a.FORM.PREFIX,
                    texClass: a.TEXCLASS.OPEN
                }));
                this.data.open.useMMLspacing = 0
            }
            if (f.separators !== "") {
                while (f.separators.length < this.data.length) {
                    f.separators += f.separators.charAt(f.separators.length - 1)
                }
                for (var g = 1, e = this.data.length; g < e; g++) {
                    if (this.data[g]) {
                        this.SetData("sep" + g, a.mo(f.separators.charAt(g - 1)).With({
                            separator: true
                        }));
                        this.data["sep" + g].useMMLspacing = 0
                    }
                }
            }
            if (f.close !== "") {
                this.SetData("close", a.mo(f.close).With({
                    fence: true,
                    form: a.FORM.POSTFIX,
                    texClass: a.TEXCLASS.CLOSE
                }));
                this.data.close.useMMLspacing = 0
            }
        },
        texClass: a.TEXCLASS.OPEN,
        setTeXclass: function (g) {
            this.addFakeNodes();
            this.getPrevClass(g);
            if (this.data.open) {
                g = this.data.open.setTeXclass(g)
            }
            if (this.data[0]) {
                g = this.data[0].setTeXclass(g)
            }
            for (var f = 1, e = this.data.length; f < e; f++) {
                if (this.data["sep" + f]) {
                    g = this.data["sep" + f].setTeXclass(g)
                }
                if (this.data[f]) {
                    g = this.data[f].setTeXclass(g)
                }
            }
            if (this.data.close) {
                g = this.data.close.setTeXclass(g)
            }
            this.updateTeXclass(this.data.open);
            this.texClass = a.TEXCLASS.INNER;
            return g
        }
    });
    a.menclose = a.mbase.Subclass({
        type: "menclose",
        inferRow: true,
        linebreakContainer: true,
        defaults: {
            mathbackground: a.INHERIT,
            mathcolor: a.INHERIT,
            notation: a.NOTATION.LONGDIV,
            texClass: a.TEXCLASS.ORD
        },
        setTeXclass: a.mbase.setSeparateTeXclasses
    });
    a.msubsup = a.mbase.Subclass({
        type: "msubsup",
        base: 0,
        sub: 1,
        sup: 2,
        isEmbellished: a.mbase.childEmbellished,
        Core: a.mbase.childCore,
        CoreMO: a.mbase.childCoreMO,
        defaults: {
            mathbackground: a.INHERIT,
            mathcolor: a.INHERIT,
            subscriptshift: "",
            superscriptshift: "",
            texClass: a.AUTO
        },
        autoDefault: function (e) {
            if (e === "texClass") {
                return (this.isEmbellished() ? this.CoreMO().Get(e) : a.TEXCLASS.ORD)
            }
            return 0
        },
        adjustChild_displaystyle: function (e) {
            if (e > 0) {
                return false
            }
            return this.Get("displaystyle")
        },
        adjustChild_scriptlevel: function (f) {
            var e = this.Get("scriptlevel");
            if (f > 0) {
                e++
            }
            return e
        },
        adjustChild_texprimestyle: function (e) {
            if (e === this.sub) {
                return true
            }
            return this.Get("texprimestyle")
        },
        setTeXclass: a.mbase.setBaseTeXclasses
    });
    a.msub = a.msubsup.Subclass({
        type: "msub"
    });
    a.msup = a.msubsup.Subclass({
        type: "msup",
        sub: 2,
        sup: 1
    });
    a.mmultiscripts = a.msubsup.Subclass({
        type: "mmultiscripts",
        adjustChild_texprimestyle: function (e) {
            if (e % 2 === 1) {
                return true
            }
            return this.Get("texprimestyle")
        }
    });
    a.mprescripts = a.mbase.Subclass({
        type: "mprescripts"
    });
    a.none = a.mbase.Subclass({
        type: "none"
    });
    a.munderover = a.mbase.Subclass({
        type: "munderover",
        base: 0,
        under: 1,
        over: 2,
        sub: 1,
        sup: 2,
        ACCENTS: ["", "accentunder", "accent"],
        linebreakContainer: true,
        isEmbellished: a.mbase.childEmbellished,
        Core: a.mbase.childCore,
        CoreMO: a.mbase.childCoreMO,
        defaults: {
            mathbackground: a.INHERIT,
            mathcolor: a.INHERIT,
            accent: a.AUTO,
            accentunder: a.AUTO,
            align: a.ALIGN.CENTER,
            texClass: a.AUTO,
            subscriptshift: "",
            superscriptshift: ""
        },
        autoDefault: function (e) {
            if (e === "texClass") {
                return (this.isEmbellished() ? this.CoreMO().Get(e) : a.TEXCLASS.ORD)
            }
            if (e === "accent" && this.data[this.over]) {
                return this.data[this.over].CoreMO().Get("accent")
            }
            if (e === "accentunder" && this.data[this.under]) {
                return this.data[this.under].CoreMO().Get("accent")
            }
            return false
        },
        adjustChild_displaystyle: function (e) {
            if (e > 0) {
                return false
            }
            return this.Get("displaystyle")
        },
        adjustChild_scriptlevel: function (g) {
            var f = this.Get("scriptlevel");
            var e = (this.data[this.base] && !this.Get("displaystyle") && this.data[this.base].CoreMO().Get("movablelimits"));
            if (g == this.under && (e || !this.Get("accentunder"))) {
                f++
            }
            if (g == this.over && (e || !this.Get("accent"))) {
                f++
            }
            return f
        },
        adjustChild_texprimestyle: function (e) {
            if (e === this.base && this.data[this.over]) {
                return true
            }
            return this.Get("texprimestyle")
        },
        setTeXclass: a.mbase.setBaseTeXclasses
    });
    a.munder = a.munderover.Subclass({
        type: "munder"
    });
    a.mover = a.munderover.Subclass({
        type: "mover",
        over: 1,
        under: 2,
        sup: 1,
        sub: 2,
        ACCENTS: ["", "accent", "accentunder"]
    });
    a.mtable = a.mbase.Subclass({
        type: "mtable",
        defaults: {
            mathbackground: a.INHERIT,
            mathcolor: a.INHERIT,
            align: a.ALIGN.AXIS,
            rowalign: a.ALIGN.BASELINE,
            columnalign: a.ALIGN.CENTER,
            groupalign: "{left}",
            alignmentscope: true,
            columnwidth: a.WIDTH.AUTO,
            width: a.WIDTH.AUTO,
            rowspacing: "1ex",
            columnspacing: ".8em",
            rowlines: a.LINES.NONE,
            columnlines: a.LINES.NONE,
            frame: a.LINES.NONE,
            framespacing: "0.4em 0.5ex",
            equalrows: false,
            equalcolumns: false,
            displaystyle: false,
            side: a.SIDE.RIGHT,
            minlabelspacing: "0.8em",
            texClass: a.TEXCLASS.ORD,
            useHeight: 1
        },
        adjustChild_displaystyle: function () {
            return (this.displaystyle != null ? this.displaystyle : this.defaults.displaystyle)
        },
        inheritFromMe: true,
        noInherit: {
            mover: {
                align: true
            },
            munder: {
                align: true
            },
            munderover: {
                align: true
            },
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
                if (!((arguments[f] instanceof a.mtr) || (arguments[f] instanceof a.mlabeledtr))) {
                    arguments[f] = a.mtr(arguments[f])
                }
            }
            this.SUPER(arguments).Append.apply(this, arguments)
        },
        setTeXclass: a.mbase.setSeparateTeXclasses
    });
    a.mtr = a.mbase.Subclass({
        type: "mtr",
        defaults: {
            mathbackground: a.INHERIT,
            mathcolor: a.INHERIT,
            rowalign: a.INHERIT,
            columnalign: a.INHERIT,
            groupalign: a.INHERIT
        },
        inheritFromMe: true,
        noInherit: {
            mrow: {
                rowalign: true,
                columnalign: true,
                groupalign: true
            },
            mtable: {
                rowalign: true,
                columnalign: true,
                groupalign: true
            }
        },
        linebreakContainer: true,
        Append: function () {
            for (var f = 0, e = arguments.length; f < e; f++) {
                if (!(arguments[f] instanceof a.mtd)) {
                    arguments[f] = a.mtd(arguments[f])
                }
            }
            this.SUPER(arguments).Append.apply(this, arguments)
        },
        setTeXclass: a.mbase.setSeparateTeXclasses
    });
    a.mtd = a.mbase.Subclass({
        type: "mtd",
        inferRow: true,
        linebreakContainer: true,
        isEmbellished: a.mbase.childEmbellished,
        Core: a.mbase.childCore,
        CoreMO: a.mbase.childCoreMO,
        defaults: {
            mathbackground: a.INHERIT,
            mathcolor: a.INHERIT,
            rowspan: 1,
            columnspan: 1,
            rowalign: a.INHERIT,
            columnalign: a.INHERIT,
            groupalign: a.INHERIT
        },
        setTeXclass: a.mbase.setSeparateTeXclasses
    });
    a.maligngroup = a.mbase.Subclass({
        type: "maligngroup",
        isSpacelike: function () {
            return true
        },
        defaults: {
            mathbackground: a.INHERIT,
            mathcolor: a.INHERIT,
            groupalign: a.INHERIT
        },
        inheritFromMe: true,
        noInherit: {
            mrow: {
                groupalign: true
            },
            mtable: {
                groupalign: true
            }
        }
    });
    a.malignmark = a.mbase.Subclass({
        type: "malignmark",
        defaults: {
            mathbackground: a.INHERIT,
            mathcolor: a.INHERIT,
            edge: a.SIDE.LEFT
        },
        isSpacelike: function () {
            return true
        }
    });
    a.mlabeledtr = a.mtr.Subclass({
        type: "mlabeledtr"
    });
    a.maction = a.mbase.Subclass({
        type: "maction",
        defaults: {
            mathbackground: a.INHERIT,
            mathcolor: a.INHERIT,
            actiontype: a.ACTIONTYPE.TOGGLE,
            selection: 1
        },
        selected: function () {
            return this.data[this.Get("selection") - 1] || a.NULL
        },
        isEmbellished: function () {
            return this.selected().isEmbellished()
        },
        isSpacelike: function () {
            return this.selected().isSpacelike()
        },
        Core: function () {
            return this.selected().Core()
        },
        CoreMO: function () {
            return this.selected().CoreMO()
        },
        setTeXclass: function (f) {
            if (this.Get("actiontype") === a.ACTIONTYPE.TOOLTIP && this.data[1]) {
                this.data[1].setTeXclass()
            }
            var e = this.selected();
            f = e.setTeXclass(f);
            this.updateTeXclass(e);
            return f
        }
    });
    a.semantics = a.mbase.Subclass({
        type: "semantics",
        notParent: true,
        isEmbellished: a.mbase.childEmbellished,
        Core: a.mbase.childCore,
        CoreMO: a.mbase.childCoreMO,
        defaults: {
            definitionURL: null,
            encoding: null
        },
        setTeXclass: a.mbase.setChildTeXclass,
        getAnnotation: function (g) {
            var l = MathJax.Hub.config.MathMenu.semanticsAnnotations[g];
            if (l) {
                for (var h = 0, e = this.data.length; h < e; h++) {
                    var k = this.data[h].Get("encoding");
                    if (k) {
                        for (var f = 0, o = l.length; f < o; f++) {
                            if (l[f] === k) {
                                return this.data[h]
                            }
                        }
                    }
                }
            }
            return null
        }
    });
    a.annotation = a.mbase.Subclass({
        type: "annotation",
        isChars: true,
        linebreakContainer: true,
        defaults: {
            definitionURL: null,
            encoding: null,
            cd: "mathmlkeys",
            name: "",
            src: null
        }
    });
    a["annotation-xml"] = a.mbase.Subclass({
        type: "annotation-xml",
        linebreakContainer: true,
        defaults: {
            definitionURL: null,
            encoding: null,
            cd: "mathmlkeys",
            name: "",
            src: null
        }
    });
    a.math = a.mstyle.Subclass({
        type: "math",
        defaults: {
            mathvariant: a.VARIANT.NORMAL,
            mathsize: a.SIZE.NORMAL,
            mathcolor: "",
            mathbackground: a.COLOR.TRANSPARENT,
            dir: "ltr",
            scriptlevel: 0,
            displaystyle: a.AUTO,
            display: "inline",
            maxwidth: "",
            overflow: a.OVERFLOW.LINEBREAK,
            altimg: "",
            "altimg-width": "",
            "altimg-height": "",
            "altimg-valign": "",
            alttext: "",
            cdgroup: "",
            scriptsizemultiplier: Math.sqrt(1 / 2),
            scriptminsize: "8px",
            infixlinebreakstyle: a.LINEBREAKSTYLE.BEFORE,
            lineleading: "1ex",
            indentshift: "auto",
            indentalign: a.INDENTALIGN.AUTO,
            indentalignfirst: a.INDENTALIGN.INDENTALIGN,
            indentshiftfirst: a.INDENTSHIFT.INDENTSHIFT,
            indentalignlast: a.INDENTALIGN.INDENTALIGN,
            indentshiftlast: a.INDENTSHIFT.INDENTSHIFT,
            decimalseparator: ".",
            texprimestyle: false
        },
        autoDefault: function (e) {
            if (e === "displaystyle") {
                return this.Get("display") === "block"
            }
            return ""
        },
        linebreakContainer: true,
        setTeXclass: a.mbase.setChildTeXclass,
        getAnnotation: function (e) {
            if (this.data.length != 1) {
                return null
            }
            return this.data[0].getAnnotation(e)
        }
    });
    a.chars = a.mbase.Subclass({
        type: "chars",
        Append: function () {
            this.data.push.apply(this.data, arguments)
        },
        value: function () {
            return this.data.join("")
        },
        toString: function () {
            return this.data.join("")
        }
    });
    a.entity = a.mbase.Subclass({
        type: "entity",
        Append: function () {
            this.data.push.apply(this.data, arguments)
        },
        value: function () {
            if (this.data[0].substr(0, 2) === "#x") {
                return parseInt(this.data[0].substr(2), 16)
            } else {
                if (this.data[0].substr(0, 1) === "#") {
                    return parseInt(this.data[0].substr(1))
                } else {
                    return 0
                }
            }
        },
        toString: function () {
            var e = this.value();
            if (e <= 65535) {
                return String.fromCharCode(e)
            }
            e -= 65536;
            return String.fromCharCode((e >> 10) + 55296) + String.fromCharCode((e & 1023) + 56320)
        }
    });
    a.xml = a.mbase.Subclass({
        type: "xml",
        Init: function () {
            this.div = document.createElement("div");
            return this.SUPER(arguments).Init.apply(this, arguments)
        },
        Append: function () {
            for (var f = 0, e = arguments.length; f < e; f++) {
                var g = this.Import(arguments[f]);
                this.data.push(g);
                this.div.appendChild(g)
            }
        },
        Import: function (j) {
            if (document.importNode) {
                return document.importNode(j, true)
            }
            var f, g, e;
            if (j.nodeType === 1) {
                f = document.createElement(j.nodeName);
                for (g = 0,
                    e = j.attributes.length; g < e; g++) {
                    var h = j.attributes[g];
                    if (h.specified && h.nodeValue != null && h.nodeValue != "") {
                        f.setAttribute(h.nodeName, h.nodeValue)
                    }
                    if (h.nodeName === "style") {
                        f.style.cssText = h.nodeValue
                    }
                }
                if (j.className) {
                    f.className = j.className
                }
            } else {
                if (j.nodeType === 3 || j.nodeType === 4) {
                    f = document.createTextNode(j.nodeValue)
                } else {
                    if (j.nodeType === 8) {
                        f = document.createComment(j.nodeValue)
                    } else {
                        return document.createTextNode("")
                    }
                }
            }
            for (g = 0,
                e = j.childNodes.length; g < e; g++) {
                f.appendChild(this.Import(j.childNodes[g]))
            }
            return f
        },
        value: function () {
            return this.div
        },
        toString: function () {
            return this.div.innerHTML
        }
    });
    a.TeXAtom = a.mbase.Subclass({
        type: "texatom",
        linebreakContainer: true,
        inferRow: true,
        notParent: true,
        texClass: a.TEXCLASS.ORD,
        Core: a.mbase.childCore,
        CoreMO: a.mbase.childCoreMO,
        isEmbellished: a.mbase.childEmbellished,
        setTeXclass: function (e) {
            this.data[0].setTeXclass();
            return this.adjustTeXclass(e)
        },
        adjustTeXclass: a.mo.prototype.adjustTeXclass
    });
    a.NULL = a.mbase().With({
        type: "null"
    });
    var b = a.TEXCLASS;
    var d = {
        ORD: [0, 0, b.ORD],
        ORD11: [1, 1, b.ORD],
        ORD21: [2, 1, b.ORD],
        ORD02: [0, 2, b.ORD],
        ORD55: [5, 5, b.ORD],
        OP: [1, 2, b.OP, {
            largeop: true,
            movablelimits: true,
            symmetric: true
        }],
        OPFIXED: [1, 2, b.OP, {
            largeop: true,
            movablelimits: true
        }],
        INTEGRAL: [0, 1, b.OP, {
            largeop: true,
            symmetric: true
        }],
        INTEGRAL2: [1, 2, b.OP, {
            largeop: true,
            symmetric: true
        }],
        BIN3: [3, 3, b.BIN],
        BIN4: [4, 4, b.BIN],
        BIN01: [0, 1, b.BIN],
        BIN5: [5, 5, b.BIN],
        TALLBIN: [4, 4, b.BIN, {
            stretchy: true
        }],
        BINOP: [4, 4, b.BIN, {
            largeop: true,
            movablelimits: true
        }],
        REL: [5, 5, b.REL],
        REL1: [1, 1, b.REL, {
            stretchy: true
        }],
        REL4: [4, 4, b.REL],
        RELSTRETCH: [5, 5, b.REL, {
            stretchy: true
        }],
        RELACCENT: [5, 5, b.REL, {
            accent: true
        }],
        WIDEREL: [5, 5, b.REL, {
            accent: true,
            stretchy: true
        }],
        OPEN: [0, 0, b.OPEN, {
            fence: true,
            stretchy: true,
            symmetric: true
        }],
        CLOSE: [0, 0, b.CLOSE, {
            fence: true,
            stretchy: true,
            symmetric: true
        }],
        INNER: [0, 0, b.INNER],
        PUNCT: [0, 3, b.PUNCT],
        ACCENT: [0, 0, b.ORD, {
            accent: true
        }],
        WIDEACCENT: [0, 0, b.ORD, {
            accent: true,
            stretchy: true
        }]
    };
    a.mo.Augment({
        SPACE: ["0em", "0.1111em", "0.1667em", "0.2222em", "0.2667em", "0.3333em"],
        RANGES: [[32, 127, b.REL, "BasicLatin"], [160, 255, b.ORD, "Latin1Supplement"], [256, 383, b.ORD], [384, 591, b.ORD], [688, 767, b.ORD, "SpacingModLetters"], [768, 879, b.ORD, "CombDiacritMarks"], [880, 1023, b.ORD, "GreekAndCoptic"], [7680, 7935, b.ORD], [8192, 8303, b.PUNCT, "GeneralPunctuation"], [8304, 8351, b.ORD], [8352, 8399, b.ORD], [8400, 8447, b.ORD, "CombDiactForSymbols"], [8448, 8527, b.ORD, "LetterlikeSymbols"], [8528, 8591, b.ORD], [8592, 8703, b.REL, "Arrows"], [8704, 8959, b.BIN, "MathOperators"], [8960, 9215, b.ORD, "MiscTechnical"], [9312, 9471, b.ORD], [9472, 9631, b.ORD], [9632, 9727, b.ORD, "GeometricShapes"], [9984, 10175, b.ORD, "Dingbats"], [10176, 10223, b.ORD, "MiscMathSymbolsA"], [10224, 10239, b.REL, "SupplementalArrowsA"], [10496, 10623, b.REL, "SupplementalArrowsB"], [10624, 10751, b.ORD, "MiscMathSymbolsB"], [10752, 11007, b.BIN, "SuppMathOperators"], [11008, 11263, b.ORD, "MiscSymbolsAndArrows"], [119808, 120831, b.ORD]],
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
                "\u221A": [1, 1, b.ORD, {
                    stretchy: true
                }],
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
            postfix: {
                "!": [1, 0, b.CLOSE],
                "&": d.ORD,
                "\u2032": d.ORD02,
                "\u203E": d.WIDEACCENT,
                "\u2309": d.CLOSE,
                "\u230B": d.CLOSE,
                "\u23DE": d.WIDEACCENT,
                "\u23DF": d.WIDEACCENT,
                "\u266D": d.ORD02,
                "\u266E": d.ORD02,
                "\u266F": d.ORD02,
                "\u27E9": d.CLOSE,
                "\u27EF": d.CLOSE,
                "\u02C6": d.WIDEACCENT,
                "\u02C7": d.WIDEACCENT,
                "\u02C9": d.WIDEACCENT,
                "\u02CA": d.ACCENT,
                "\u02CB": d.ACCENT,
                "\u02D8": d.ACCENT,
                "\u02D9": d.ACCENT,
                "\u02DC": d.WIDEACCENT,
                "\u0302": d.WIDEACCENT,
                "\u00A8": d.ACCENT,
                "\u00AF": d.WIDEACCENT,
                ")": d.CLOSE,
                "]": d.CLOSE,
                "^": d.WIDEACCENT,
                _: d.WIDEACCENT,
                "`": d.ACCENT,
                "|": d.CLOSE,
                "}": d.CLOSE,
                "~": d.WIDEACCENT
            },
            infix: {
                "": d.ORD,
                "%": [3, 3, b.ORD],
                "\u2022": d.BIN4,
                "\u2026": d.INNER,
                "\u2044": d.TALLBIN,
                "\u2061": d.ORD,
                "\u2062": d.ORD,
                "\u2063": [0, 0, b.ORD, {
                    linebreakstyle: "after",
                    separator: true
                }],
                "\u2064": d.ORD,
                "\u2190": d.WIDEREL,
                "\u2191": d.RELSTRETCH,
                "\u2192": d.WIDEREL,
                "\u2193": d.RELSTRETCH,
                "\u2194": d.WIDEREL,
                "\u2195": d.RELSTRETCH,
                "\u2196": d.RELSTRETCH,
                "\u2197": d.RELSTRETCH,
                "\u2198": d.RELSTRETCH,
                "\u2199": d.RELSTRETCH,
                "\u21A6": d.WIDEREL,
                "\u21A9": d.WIDEREL,
                "\u21AA": d.WIDEREL,
                "\u21BC": d.WIDEREL,
                "\u21BD": d.WIDEREL,
                "\u21C0": d.WIDEREL,
                "\u21C1": d.WIDEREL,
                "\u21CC": d.WIDEREL,
                "\u21D0": d.WIDEREL,
                "\u21D1": d.RELSTRETCH,
                "\u21D2": d.WIDEREL,
                "\u21D3": d.RELSTRETCH,
                "\u21D4": d.WIDEREL,
                "\u21D5": d.RELSTRETCH,
                "\u2208": d.REL,
                "\u2209": d.REL,
                "\u220B": d.REL,
                "\u2212": d.BIN4,
                "\u2213": d.BIN4,
                "\u2215": d.TALLBIN,
                "\u2216": d.BIN4,
                "\u2217": d.BIN4,
                "\u2218": d.BIN4,
                "\u2219": d.BIN4,
                "\u221D": d.REL,
                "\u2223": d.REL,
                "\u2225": d.REL,
                "\u2227": d.BIN4,
                "\u2228": d.BIN4,
                "\u2229": d.BIN4,
                "\u222A": d.BIN4,
                "\u223C": d.REL,
                "\u2240": d.BIN4,
                "\u2243": d.REL,
                "\u2245": d.REL,
                "\u2248": d.REL,
                "\u224D": d.REL,
                "\u2250": d.REL,
                "\u2260": d.REL,
                "\u2261": d.REL,
                "\u2264": d.REL,
                "\u2265": d.REL,
                "\u226A": d.REL,
                "\u226B": d.REL,
                "\u227A": d.REL,
                "\u227B": d.REL,
                "\u2282": d.REL,
                "\u2283": d.REL,
                "\u2286": d.REL,
                "\u2287": d.REL,
                "\u228E": d.BIN4,
                "\u2291": d.REL,
                "\u2292": d.REL,
                "\u2293": d.BIN4,
                "\u2294": d.BIN4,
                "\u2295": d.BIN4,
                "\u2296": d.BIN4,
                "\u2297": d.BIN4,
                "\u2298": d.BIN4,
                "\u2299": d.BIN4,
                "\u22A2": d.REL,
                "\u22A3": d.REL,
                "\u22A4": d.ORD55,
                "\u22A5": d.REL,
                "\u22A8": d.REL,
                "\u22C4": d.BIN4,
                "\u22C5": d.BIN4,
                "\u22C6": d.BIN4,
                "\u22C8": d.REL,
                "\u22EE": d.ORD55,
                "\u22EF": d.INNER,
                "\u22F1": [5, 5, b.INNER],
                "\u25B3": d.BIN4,
                "\u25B5": d.BIN4,
                "\u25B9": d.BIN4,
                "\u25BD": d.BIN4,
                "\u25BF": d.BIN4,
                "\u25C3": d.BIN4,
                "\u2758": d.REL,
                "\u27F5": d.WIDEREL,
                "\u27F6": d.WIDEREL,
                "\u27F7": d.WIDEREL,
                "\u27F8": d.WIDEREL,
                "\u27F9": d.WIDEREL,
                "\u27FA": d.WIDEREL,
                "\u27FC": d.WIDEREL,
                "\u2A2F": d.BIN4,
                "\u2A3F": d.BIN4,
                "\u2AAF": d.REL,
                "\u2AB0": d.REL,
                "\u00B1": d.BIN4,
                "\u00B7": d.BIN4,
                "\u00D7": d.BIN4,
                "\u00F7": d.BIN4,
                "*": d.BIN3,
                "+": d.BIN4,
                ",": [0, 3, b.PUNCT, {
                    linebreakstyle: "after",
                    separator: true
                }],
                "-": d.BIN4,
                ".": [3, 3, b.ORD],
                "/": d.ORD11,
                ":": [1, 2, b.REL],
                ";": [0, 3, b.PUNCT, {
                    linebreakstyle: "after",
                    separator: true
                }],
                "<": d.REL,
                "=": d.REL,
                ">": d.REL,
                "?": [1, 1, b.CLOSE],
                "\\": d.ORD,
                "^": d.ORD11,
                _: d.ORD11,
                "|": [2, 2, b.ORD, {
                    fence: true,
                    stretchy: true,
                    symmetric: true
                }],
                "#": d.ORD,
                "$": d.ORD,
                "\u002E": [0, 3, b.PUNCT, {
                    separator: true
                }],
                "\u02B9": d.ORD,
                "\u0300": d.ACCENT,
                "\u0301": d.ACCENT,
                "\u0303": d.WIDEACCENT,
                "\u0304": d.ACCENT,
                "\u0306": d.ACCENT,
                "\u0307": d.ACCENT,
                "\u0308": d.ACCENT,
                "\u030C": d.ACCENT,
                "\u0332": d.WIDEACCENT,
                "\u0338": d.REL4,
                "\u2015": [0, 0, b.ORD, {
                    stretchy: true
                }],
                "\u2017": [0, 0, b.ORD, {
                    stretchy: true
                }],
                "\u2020": d.BIN3,
                "\u2021": d.BIN3,
                "\u20D7": d.ACCENT,
                "\u2111": d.ORD,
                "\u2113": d.ORD,
                "\u2118": d.ORD,
                "\u211C": d.ORD,
                "\u2205": d.ORD,
                "\u221E": d.ORD,
                "\u2305": d.BIN3,
                "\u2306": d.BIN3,
                "\u2322": d.REL4,
                "\u2323": d.REL4,
                "\u2329": d.OPEN,
                "\u232A": d.CLOSE,
                "\u23AA": d.ORD,
                "\u23AF": [0, 0, b.ORD, {
                    stretchy: true
                }],
                "\u23B0": d.OPEN,
                "\u23B1": d.CLOSE,
                "\u2500": d.ORD,
                "\u25EF": d.BIN3,
                "\u2660": d.ORD,
                "\u2661": d.ORD,
                "\u2662": d.ORD,
                "\u2663": d.ORD,
                "\u3008": d.OPEN,
                "\u3009": d.CLOSE,
                "\uFE37": d.WIDEACCENT,
                "\uFE38": d.WIDEACCENT
            }
        }
    }, {
        OPTYPES: d
    });
    var c = a.mo.prototype.OPTABLE;
    c.infix["^"] = d.WIDEREL;
    c.infix._ = d.WIDEREL;
    c.prefix["\u2223"] = d.OPEN;
    c.prefix["\u2225"] = d.OPEN;
    c.postfix["\u2223"] = d.CLOSE;
    c.postfix["\u2225"] = d.CLOSE
}
)(MathJax.ElementJax.mml);
MathJax.ElementJax.mml.loadComplete("jax.js");

(function (d, c, j) {
    var i, h = "\u00A0";
    var k = function (m) {
        return MathJax.Localization._.apply(MathJax.Localization, [["TeX", m]].concat([].slice.call(arguments, 1)))
    };
    var f = MathJax.Object.isArray;
    var e = MathJax.Object.Subclass({
        Init: function (n, m) {
            this.global = {
                isInner: m
            };
            this.data = [b.start(this.global)];
            if (n) {
                this.data[0].env = n
            }
            this.env = this.data[0].env
        },
        Push: function () {
            var o, n, p, q;
            for (o = 0,
                n = arguments.length; o < n; o++) {
                p = arguments[o];
                if (!p) {
                    continue
                }
                if (p instanceof i.mbase) {
                    p = b.mml(p)
                }
                p.global = this.global;
                q = (this.data.length ? this.Top().checkItem(p) : true);
                if (q instanceof Array) {
                    this.Pop();
                    this.Push.apply(this, q)
                } else {
                    if (q instanceof b) {
                        this.Pop();
                        this.Push(q)
                    } else {
                        if (q) {
                            this.data.push(p);
                            if (p.env) {
                                if (p.copyEnv !== false) {
                                    for (var r in this.env) {
                                        if (this.env.hasOwnProperty(r)) {
                                            p.env[r] = this.env[r]
                                        }
                                    }
                                }
                                this.env = p.env
                            } else {
                                p.env = this.env
                            }
                        }
                    }
                }
            }
        },
        Pop: function () {
            var m = this.data.pop();
            if (!m.isOpen) {
                delete m.env
            }
            this.env = (this.data.length ? this.Top().env : {});
            return m
        },
        Top: function (m) {
            if (m == null) {
                m = 1
            }
            if (this.data.length < m) {
                return null
            }
            return this.data[this.data.length - m]
        },
        Prev: function (m) {
            var n = this.Top();
            if (m) {
                return n.data[n.data.length - 1]
            } else {
                return n.Pop()
            }
        },
        toString: function () {
            return "stack[\n  " + this.data.join("\n  ") + "\n]"
        }
    });
    var b = e.Item = MathJax.Object.Subclass({
        type: "base",
        endError: ["ExtraOpenMissingClose", "Extra open brace or missing close brace"],
        closeError: ["ExtraCloseMissingOpen", "Extra close brace or missing open brace"],
        rightError: ["MissingLeftExtraRight", "Missing \\left or extra \\right"],
        Init: function () {
            if (this.isOpen) {
                this.env = {}
            }
            this.data = [];
            this.Push.apply(this, arguments)
        },
        Push: function () {
            this.data.push.apply(this.data, arguments)
        },
        Pop: function () {
            return this.data.pop()
        },
        mmlData: function (m, n) {
            if (m == null) {
                m = true
            }
            if (this.data.length === 1 && !n) {
                return this.data[0]
            }
            return i.mrow.apply(i, this.data).With((m ? {
                inferred: true
            } : {}))
        },
        checkItem: function (m) {
            if (m.type === "over" && this.isOpen) {
                m.num = this.mmlData(false);
                this.data = []
            }
            if (m.type === "cell" && this.isOpen) {
                if (m.linebreak) {
                    return false
                }
                d.Error(["Misplaced", "Misplaced %1", m.name])
            }
            if (m.isClose && this[m.type + "Error"]) {
                d.Error(this[m.type + "Error"])
            }
            if (!m.isNotStack) {
                return true
            }
            this.Push(m.data[0]);
            return false
        },
        With: function (m) {
            for (var n in m) {
                if (m.hasOwnProperty(n)) {
                    this[n] = m[n]
                }
            }
            return this
        },
        toString: function () {
            return this.type + "[" + this.data.join("; ") + "]"
        }
    });
    b.start = b.Subclass({
        type: "start",
        isOpen: true,
        Init: function (m) {
            this.SUPER(arguments).Init.call(this);
            this.global = m
        },
        checkItem: function (m) {
            if (m.type === "stop") {
                return b.mml(this.mmlData())
            }
            return this.SUPER(arguments).checkItem.call(this, m)
        }
    });
    b.stop = b.Subclass({
        type: "stop",
        isClose: true
    });
    b.open = b.Subclass({
        type: "open",
        isOpen: true,
        stopError: ["ExtraOpenMissingClose", "Extra open brace or missing close brace"],
        checkItem: function (n) {
            if (n.type === "close") {
                var m = this.mmlData();
                return b.mml(i.TeXAtom(m))
            }
            return this.SUPER(arguments).checkItem.call(this, n)
        }
    });
    b.close = b.Subclass({
        type: "close",
        isClose: true
    });
    b.prime = b.Subclass({
        type: "prime",
        checkItem: function (m) {
            if (this.data[0].type !== "msubsup") {
                return [i.msup(this.data[0], this.data[1]), m]
            }
            this.data[0].SetData(this.data[0].sup, this.data[1]);
            return [this.data[0], m]
        }
    });
    b.subsup = b.Subclass({
        type: "subsup",
        stopError: ["MissingScript", "Missing superscript or subscript argument"],
        supError: ["MissingOpenForSup", "Missing open brace for superscript"],
        subError: ["MissingOpenForSub", "Missing open brace for subscript"],
        checkItem: function (m) {
            if (m.type === "open" || m.type === "left") {
                return true
            }
            if (m.type === "mml") {
                if (this.primes) {
                    if (this.position !== 2) {
                        this.data[0].SetData(2, this.primes)
                    } else {
                        m.data[0] = i.mrow(this.primes.With({
                            variantForm: true
                        }), m.data[0])
                    }
                }
                this.data[0].SetData(this.position, m.data[0]);
                if (this.movesupsub != null) {
                    this.data[0].movesupsub = this.movesupsub
                }
                return b.mml(this.data[0])
            }
            if (this.SUPER(arguments).checkItem.call(this, m)) {
                d.Error(this[["", "subError", "supError"][this.position]])
            }
        },
        Pop: function () { }
    });
    b.over = b.Subclass({
        type: "over",
        isClose: true,
        name: "\\over",
        checkItem: function (o, m) {
            if (o.type === "over") {
                d.Error(["AmbiguousUseOf", "Ambiguous use of %1", o.name])
            }
            if (o.isClose) {
                var n = i.mfrac(this.num, this.mmlData(false));
                if (this.thickness != null) {
                    n.linethickness = this.thickness
                }
                if (this.open || this.close) {
                    n.texWithDelims = true;
                    n = d.fixedFence(this.open, n, this.close)
                }
                return [b.mml(n), o]
            }
            return this.SUPER(arguments).checkItem.call(this, o)
        },
        toString: function () {
            return "over[" + this.num + " / " + this.data.join("; ") + "]"
        }
    });
    b.left = b.Subclass({
        type: "left",
        isOpen: true,
        delim: "(",
        stopError: ["ExtraLeftMissingRight", "Extra \\left or missing \\right"],
        checkItem: function (m) {
            if (m.type === "right") {
                return b.mml(d.fenced(this.delim, this.mmlData(), m.delim))
            }
            return this.SUPER(arguments).checkItem.call(this, m)
        }
    });
    b.right = b.Subclass({
        type: "right",
        isClose: true,
        delim: ")"
    });
    b.begin = b.Subclass({
        type: "begin",
        isOpen: true,
        checkItem: function (m) {
            if (m.type === "end") {
                if (m.name !== this.name) {
                    d.Error(["EnvBadEnd", "\\begin{%1} ended with \\end{%2}", this.name, m.name])
                }
                if (!this.end) {
                    return b.mml(this.mmlData())
                }
                return this.parse[this.end].call(this.parse, this, this.data)
            }
            if (m.type === "stop") {
                d.Error(["EnvMissingEnd", "Missing \\end{%1}", this.name])
            }
            return this.SUPER(arguments).checkItem.call(this, m)
        }
    });
    b.end = b.Subclass({
        type: "end",
        isClose: true
    });
    b.style = b.Subclass({
        type: "style",
        checkItem: function (n) {
            if (!n.isClose) {
                return this.SUPER(arguments).checkItem.call(this, n)
            }
            var m = i.mstyle.apply(i, this.data).With(this.styles);
            return [b.mml(m), n]
        }
    });
    b.position = b.Subclass({
        type: "position",
        checkItem: function (n) {
            if (n.isClose) {
                d.Error(["MissingBoxFor", "Missing box for %1", this.name])
            }
            if (n.isNotStack) {
                var m = n.mmlData();
                switch (this.move) {
                    case "vertical":
                        m = i.mpadded(m).With({
                            height: this.dh,
                            depth: this.dd,
                            voffset: this.dh
                        });
                        return [b.mml(m)];
                    case "horizontal":
                        return [b.mml(this.left), n, b.mml(this.right)]
                }
            }
            return this.SUPER(arguments).checkItem.call(this, n)
        }
    });
    b.array = b.Subclass({
        type: "array",
        isOpen: true,
        copyEnv: false,
        arraydef: {},
        Init: function () {
            this.table = [];
            this.row = [];
            this.frame = [];
            this.hfill = [];
            this.SUPER(arguments).Init.apply(this, arguments)
        },
        checkItem: function (n) {
            if (n.isClose && n.type !== "over") {
                if (n.isEntry) {
                    this.EndEntry();
                    this.clearEnv();
                    return false
                }
                if (n.isCR) {
                    this.EndEntry();
                    this.EndRow();
                    this.clearEnv();
                    return false
                }
                this.EndTable();
                this.clearEnv();
                var o = this.arraydef.scriptlevel;
                delete this.arraydef.scriptlevel;
                var m = i.mtable.apply(i, this.table).With(this.arraydef);
                if (this.frame.length === 4) {
                    m.frame = (this.frame.dashed ? "dashed" : "solid")
                } else {
                    if (this.frame.length) {
                        m.hasFrame = true;
                        if (this.arraydef.rowlines) {
                            this.arraydef.rowlines = this.arraydef.rowlines.replace(/none( none)+$/, "none")
                        }
                        m = i.menclose(m).With({
                            notation: this.frame.join(" "),
                            isFrame: true
                        });
                        if ((this.arraydef.columnlines || "none") != "none" || (this.arraydef.rowlines || "none") != "none") {
                            m.padding = 0
                        }
                    }
                }
                if (o) {
                    m = i.mstyle(m).With({
                        scriptlevel: o
                    })
                }
                if (this.open || this.close) {
                    m = d.fenced(this.open, m, this.close)
                }
                m = b.mml(m);
                if (this.requireClose) {
                    if (n.type === "close") {
                        return m
                    }
                    d.Error(["MissingCloseBrace", "Missing close brace"])
                }
                return [m, n]
            }
            return this.SUPER(arguments).checkItem.call(this, n)
        },
        EndEntry: function () {
            var m = i.mtd.apply(i, this.data);
            if (this.hfill.length) {
                if (this.hfill[0] === 0) {
                    m.columnalign = "right"
                }
                if (this.hfill[this.hfill.length - 1] === this.data.length) {
                    m.columnalign = (m.columnalign ? "center" : "left")
                }
            }
            this.row.push(m);
            this.data = [];
            this.hfill = []
        },
        EndRow: function () {
            var m = i.mtr;
            if (this.isNumbered && this.row.length === 3) {
                this.row.unshift(this.row.pop());
                m = i.mlabeledtr
            }
            this.table.push(m.apply(i, this.row));
            this.row = []
        },
        EndTable: function () {
            if (this.data.length || this.row.length) {
                this.EndEntry();
                this.EndRow()
            }
            this.checkLines()
        },
        checkLines: function () {
            if (this.arraydef.rowlines) {
                var m = this.arraydef.rowlines.split(/ /);
                if (m.length === this.table.length) {
                    this.frame.push("bottom");
                    m.pop();
                    this.arraydef.rowlines = m.join(" ")
                } else {
                    if (m.length < this.table.length - 1) {
                        this.arraydef.rowlines += " none"
                    }
                }
            }
            if (this.rowspacing) {
                var n = this.arraydef.rowspacing.split(/ /);
                while (n.length < this.table.length) {
                    n.push(this.rowspacing + "em")
                }
                this.arraydef.rowspacing = n.join(" ")
            }
        },
        clearEnv: function () {
            for (var m in this.env) {
                if (this.env.hasOwnProperty(m)) {
                    delete this.env[m]
                }
            }
        }
    });
    b.cell = b.Subclass({
        type: "cell",
        isClose: true
    });
    b.mml = b.Subclass({
        type: "mml",
        isNotStack: true,
        Add: function () {
            this.data.push.apply(this.data, arguments);
            return this
        }
    });
    b.fn = b.Subclass({
        type: "fn",
        checkItem: function (n) {
            if (this.data[0]) {
                if (n.isOpen) {
                    return true
                }
                if (n.type !== "fn") {
                    if (n.type !== "mml" || !n.data[0]) {
                        return [this.data[0], n]
                    }
                    if (n.data[0].isa(i.mspace)) {
                        return [this.data[0], n]
                    }
                    var m = n.data[0];
                    if (m.isEmbellished()) {
                        m = m.CoreMO()
                    }
                    if ([0, 0, 1, 1, 0, 1, 1, 0, 0, 0][m.Get("texClass")]) {
                        return [this.data[0], n]
                    }
                }
                return [this.data[0], i.mo(i.entity("#x2061")).With({
                    texClass: i.TEXCLASS.NONE
                }), n]
            }
            return this.SUPER(arguments).checkItem.apply(this, arguments)
        }
    });
    b.not = b.Subclass({
        type: "not",
        checkItem: function (n) {
            var m, o;
            if (n.type === "open" || n.type === "left") {
                return true
            }
            if (n.type === "mml" && n.data[0].type.match(/^(mo|mi|mtext)$/)) {
                m = n.data[0],
                    o = m.data.join("");
                if (o.length === 1 && !m.movesupsub && m.data.length === 1) {
                    o = b.not.remap[o.charCodeAt(0)];
                    if (o) {
                        m.SetData(0, i.chars(String.fromCharCode(o)))
                    } else {
                        m.Append(i.chars("\u0338"))
                    }
                    return n
                }
            }
            m = i.mpadded(i.mtext("\u29F8")).With({
                width: 0
            });
            m = i.TeXAtom(m).With({
                texClass: i.TEXCLASS.REL
            });
            return [m, n]
        }
    });
    b.not.remap = {
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
    b.dots = b.Subclass({
        type: "dots",
        checkItem: function (n) {
            if (n.type === "open" || n.type === "left") {
                return true
            }
            var o = this.ldots;
            if (n.type === "mml" && n.data[0].isEmbellished()) {
                var m = n.data[0].CoreMO().Get("texClass");
                if (m === i.TEXCLASS.BIN || m === i.TEXCLASS.REL) {
                    o = this.cdots
                }
            }
            return [o, n]
        }
    });
    var g = {
        Add: function (m, p, o) {
            if (!p) {
                p = this
            }
            for (var n in m) {
                if (m.hasOwnProperty(n)) {
                    if (typeof m[n] === "object" && !f(m[n]) && (typeof p[n] === "object" || typeof p[n] === "function")) {
                        this.Add(m[n], p[n], m[n], o)
                    } else {
                        if (!p[n] || !p[n].isUser || !o) {
                            p[n] = m[n]
                        }
                    }
                }
            }
            return p
        }
    };
    var l = function () {
        i = MathJax.ElementJax.mml;
        c.Insert(g, {
            letter: /[a-z]/i,
            digit: /[0-9.]/,
            number: /^(?:[0-9]+(?:\{,\}[0-9]{3})*(?:\.[0-9]*)*|\.[0-9]+)/,
            special: {
                "\\": "ControlSequence",
                "{": "Open",
                "}": "Close",
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
            remap: {
                "-": "2212",
                "*": "2217",
                "`": "2018"
            },
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
                S: ["00A7", {
                    mathvariant: i.VARIANT.NORMAL
                }],
                aleph: ["2135", {
                    mathvariant: i.VARIANT.NORMAL
                }],
                hbar: ["210F", {
                    variantForm: true
                }],
                imath: "0131",
                jmath: "0237",
                ell: "2113",
                wp: ["2118", {
                    mathvariant: i.VARIANT.NORMAL
                }],
                Re: ["211C", {
                    mathvariant: i.VARIANT.NORMAL
                }],
                Im: ["2111", {
                    mathvariant: i.VARIANT.NORMAL
                }],
                partial: ["2202", {
                    mathvariant: i.VARIANT.NORMAL
                }],
                infty: ["221E", {
                    mathvariant: i.VARIANT.NORMAL
                }],
                prime: ["2032", {
                    mathvariant: i.VARIANT.NORMAL,
                    variantForm: true
                }],
                emptyset: ["2205", {
                    mathvariant: i.VARIANT.NORMAL
                }],
                nabla: ["2207", {
                    mathvariant: i.VARIANT.NORMAL
                }],
                top: ["22A4", {
                    mathvariant: i.VARIANT.NORMAL
                }],
                bot: ["22A5", {
                    mathvariant: i.VARIANT.NORMAL
                }],
                angle: ["2220", {
                    mathvariant: i.VARIANT.NORMAL
                }],
                triangle: ["25B3", {
                    mathvariant: i.VARIANT.NORMAL
                }],
                backslash: ["2216", {
                    mathvariant: i.VARIANT.NORMAL,
                    variantForm: true
                }],
                forall: ["2200", {
                    mathvariant: i.VARIANT.NORMAL
                }],
                exists: ["2203", {
                    mathvariant: i.VARIANT.NORMAL
                }],
                neg: ["00AC", {
                    mathvariant: i.VARIANT.NORMAL
                }],
                lnot: ["00AC", {
                    mathvariant: i.VARIANT.NORMAL
                }],
                flat: ["266D", {
                    mathvariant: i.VARIANT.NORMAL
                }],
                natural: ["266E", {
                    mathvariant: i.VARIANT.NORMAL
                }],
                sharp: ["266F", {
                    mathvariant: i.VARIANT.NORMAL
                }],
                clubsuit: ["2663", {
                    mathvariant: i.VARIANT.NORMAL
                }],
                diamondsuit: ["2662", {
                    mathvariant: i.VARIANT.NORMAL
                }],
                heartsuit: ["2661", {
                    mathvariant: i.VARIANT.NORMAL
                }],
                spadesuit: ["2660", {
                    mathvariant: i.VARIANT.NORMAL
                }]
            },
            mathchar0mo: {
                surd: "221A",
                coprod: ["2210", {
                    texClass: i.TEXCLASS.OP,
                    movesupsub: true
                }],
                bigvee: ["22C1", {
                    texClass: i.TEXCLASS.OP,
                    movesupsub: true
                }],
                bigwedge: ["22C0", {
                    texClass: i.TEXCLASS.OP,
                    movesupsub: true
                }],
                biguplus: ["2A04", {
                    texClass: i.TEXCLASS.OP,
                    movesupsub: true
                }],
                bigcap: ["22C2", {
                    texClass: i.TEXCLASS.OP,
                    movesupsub: true
                }],
                bigcup: ["22C3", {
                    texClass: i.TEXCLASS.OP,
                    movesupsub: true
                }],
                "int": ["222B", {
                    texClass: i.TEXCLASS.OP
                }],
                intop: ["222B", {
                    texClass: i.TEXCLASS.OP,
                    movesupsub: true,
                    movablelimits: true
                }],
                iint: ["222C", {
                    texClass: i.TEXCLASS.OP
                }],
                iiint: ["222D", {
                    texClass: i.TEXCLASS.OP
                }],
                prod: ["220F", {
                    texClass: i.TEXCLASS.OP,
                    movesupsub: true
                }],
                sum: ["2211", {
                    texClass: i.TEXCLASS.OP,
                    movesupsub: true
                }],
                bigotimes: ["2A02", {
                    texClass: i.TEXCLASS.OP,
                    movesupsub: true
                }],
                bigoplus: ["2A01", {
                    texClass: i.TEXCLASS.OP,
                    movesupsub: true
                }],
                bigodot: ["2A00", {
                    texClass: i.TEXCLASS.OP,
                    movesupsub: true
                }],
                oint: ["222E", {
                    texClass: i.TEXCLASS.OP
                }],
                bigsqcup: ["2A06", {
                    texClass: i.TEXCLASS.OP,
                    movesupsub: true
                }],
                smallint: ["222B", {
                    largeop: false
                }],
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
                odot: ["2299", {
                    largeop: false
                }],
                oslash: ["2298", {
                    largeop: false
                }],
                otimes: ["2297", {
                    largeop: false
                }],
                ominus: ["2296", {
                    largeop: false
                }],
                oplus: ["2295", {
                    largeop: false
                }],
                mp: "2213",
                pm: "00B1",
                circ: "2218",
                bigcirc: "25EF",
                setminus: ["2216", {
                    variantForm: true
                }],
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
                ldotp: ["002E", {
                    texClass: i.TEXCLASS.PUNCT
                }],
                cdotp: ["22C5", {
                    texClass: i.TEXCLASS.PUNCT
                }],
                colon: ["003A", {
                    texClass: i.TEXCLASS.PUNCT
                }]
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
                "|": ["|", {
                    texClass: i.TEXCLASS.ORD
                }],
                ".": "",
                "\\\\": "\\",
                "\\lmoustache": "23B0",
                "\\rmoustache": "23B1",
                "\\lgroup": "27EE",
                "\\rgroup": "27EF",
                "\\arrowvert": "23D0",
                "\\Arrowvert": "2016",
                "\\bracevert": "23AA",
                "\\Vert": ["2016", {
                    texClass: i.TEXCLASS.ORD
                }],
                "\\|": ["2016", {
                    texClass: i.TEXCLASS.ORD
                }],
                "\\vert": ["|", {
                    texClass: i.TEXCLASS.ORD
                }],
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
                rm: ["SetFont", i.VARIANT.NORMAL],
                mit: ["SetFont", i.VARIANT.ITALIC],
                oldstyle: ["SetFont", i.VARIANT.OLDSTYLE],
                cal: ["SetFont", i.VARIANT.CALIGRAPHIC],
                it: ["SetFont", "-tex-mathit"],
                bf: ["SetFont", i.VARIANT.BOLD],
                bbFont: ["SetFont", i.VARIANT.DOUBLESTRUCK],
                scr: ["SetFont", i.VARIANT.SCRIPT],
                frak: ["SetFont", i.VARIANT.FRAKTUR],
                sf: ["SetFont", i.VARIANT.SANSSERIF],
                tt: ["SetFont", i.VARIANT.MONOSPACE],
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
                ",": ["Spacer", i.LENGTH.THINMATHSPACE],
                ":": ["Spacer", i.LENGTH.MEDIUMMATHSPACE],
                ">": ["Spacer", i.LENGTH.MEDIUMMATHSPACE],
                ";": ["Spacer", i.LENGTH.THICKMATHSPACE],
                "!": ["Spacer", i.LENGTH.NEGATIVETHINMATHSPACE],
                enspace: ["Spacer", ".5em"],
                quad: ["Spacer", "1em"],
                qquad: ["Spacer", "2em"],
                thinspace: ["Spacer", i.LENGTH.THINMATHSPACE],
                negthinspace: ["Spacer", i.LENGTH.NEGATIVETHINMATHSPACE],
                hskip: "Hskip",
                hspace: "Hskip",
                kern: "Hskip",
                mskip: "Hskip",
                mspace: "Hskip",
                mkern: "Hskip",
                rule: "rule",
                Rule: ["Rule"],
                Space: ["Rule", "blank"],
                big: ["MakeBig", i.TEXCLASS.ORD, 0.85],
                Big: ["MakeBig", i.TEXCLASS.ORD, 1.15],
                bigg: ["MakeBig", i.TEXCLASS.ORD, 1.45],
                Bigg: ["MakeBig", i.TEXCLASS.ORD, 1.75],
                bigl: ["MakeBig", i.TEXCLASS.OPEN, 0.85],
                Bigl: ["MakeBig", i.TEXCLASS.OPEN, 1.15],
                biggl: ["MakeBig", i.TEXCLASS.OPEN, 1.45],
                Biggl: ["MakeBig", i.TEXCLASS.OPEN, 1.75],
                bigr: ["MakeBig", i.TEXCLASS.CLOSE, 0.85],
                Bigr: ["MakeBig", i.TEXCLASS.CLOSE, 1.15],
                biggr: ["MakeBig", i.TEXCLASS.CLOSE, 1.45],
                Biggr: ["MakeBig", i.TEXCLASS.CLOSE, 1.75],
                bigm: ["MakeBig", i.TEXCLASS.REL, 0.85],
                Bigm: ["MakeBig", i.TEXCLASS.REL, 1.15],
                biggm: ["MakeBig", i.TEXCLASS.REL, 1.45],
                Biggm: ["MakeBig", i.TEXCLASS.REL, 1.75],
                mathord: ["TeXAtom", i.TEXCLASS.ORD],
                mathop: ["TeXAtom", i.TEXCLASS.OP],
                mathopen: ["TeXAtom", i.TEXCLASS.OPEN],
                mathclose: ["TeXAtom", i.TEXCLASS.CLOSE],
                mathbin: ["TeXAtom", i.TEXCLASS.BIN],
                mathrel: ["TeXAtom", i.TEXCLASS.REL],
                mathpunct: ["TeXAtom", i.TEXCLASS.PUNCT],
                mathinner: ["TeXAtom", i.TEXCLASS.INNER],
                vcenter: ["TeXAtom", i.TEXCLASS.VCENTER],
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
                eqalign: ["Matrix", null, null, "right left", i.LENGTH.THICKMATHSPACE, ".5em", "D"],
                displaylines: ["Matrix", null, null, "center", null, ".5em", "D"],
                cr: "Cr",
                "\\": "CrLaTeX",
                newline: "Cr",
                hline: ["HLine", "solid"],
                hdashline: ["HLine", "dashed"],
                eqalignno: ["Matrix", null, null, "right left", i.LENGTH.THICKMATHSPACE, ".5em", "D", null, "right"],
                leqalignno: ["Matrix", null, null, "right left", i.LENGTH.THICKMATHSPACE, ".5em", "D", null, "left"],
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
            },
            p_height: 1.2 / 0.85
        });
        if (this.config.Macros) {
            var m = this.config.Macros;
            for (var n in m) {
                if (m.hasOwnProperty(n)) {
                    if (typeof (m[n]) === "string") {
                        g.macros[n] = ["Macro", m[n]]
                    } else {
                        g.macros[n] = ["Macro"].concat(m[n])
                    }
                    g.macros[n].isUser = true
                }
            }
        }
    };
    var a = MathJax.Object.Subclass({
        Init: function (n, o) {
            this.string = n;
            this.i = 0;
            this.macroCount = 0;
            var m;
            if (o) {
                m = {};
                for (var p in o) {
                    if (o.hasOwnProperty(p)) {
                        m[p] = o[p]
                    }
                }
            }
            this.stack = d.Stack(m, !!o);
            this.Parse();
            this.Push(b.stop())
        },
        Parse: function () {
            var o, m;
            while (this.i < this.string.length) {
                o = this.string.charAt(this.i++);
                m = o.charCodeAt(0);
                if (m >= 55296 && m < 56320) {
                    o += this.string.charAt(this.i++)
                }
                if (g.special[o]) {
                    this[g.special[o]](o)
                } else {
                    if (g.letter.test(o)) {
                        this.Variable(o)
                    } else {
                        if (g.digit.test(o)) {
                            this.Number(o)
                        } else {
                            this.Other(o)
                        }
                    }
                }
            }
        },
        Push: function () {
            this.stack.Push.apply(this.stack, arguments)
        },
        mml: function () {
            if (this.stack.Top().type !== "mml") {
                return null
            }
            return this.stack.Top().data[0]
        },
        mmlToken: function (m) {
            return m
        },
        ControlSequence: function (p) {
            var m = this.GetCS()
                , o = this.csFindMacro(m);
            if (o) {
                if (!f(o)) {
                    o = [o]
                }
                var n = o[0];
                if (!(n instanceof Function)) {
                    n = this[n]
                }
                n.apply(this, [p + m].concat(o.slice(1)))
            } else {
                if (g.mathchar0mi[m]) {
                    this.csMathchar0mi(m, g.mathchar0mi[m])
                } else {
                    if (g.mathchar0mo[m]) {
                        this.csMathchar0mo(m, g.mathchar0mo[m])
                    } else {
                        if (g.mathchar7[m]) {
                            this.csMathchar7(m, g.mathchar7[m])
                        } else {
                            if (g.delimiter["\\" + m] != null) {
                                this.csDelimiter(m, g.delimiter["\\" + m])
                            } else {
                                this.csUndefined(p + m)
                            }
                        }
                    }
                }
            }
        },
        csFindMacro: function (m) {
            return g.macros[m]
        },
        csMathchar0mi: function (m, o) {
            var n = {
                mathvariant: i.VARIANT.ITALIC
            };
            if (f(o)) {
                n = o[1];
                o = o[0]
            }
            this.Push(this.mmlToken(i.mi(i.entity("#x" + o)).With(n)))
        },
        csMathchar0mo: function (m, o) {
            var n = {
                stretchy: false
            };
            if (f(o)) {
                n = o[1];
                n.stretchy = false;
                o = o[0]
            }
            this.Push(this.mmlToken(i.mo(i.entity("#x" + o)).With(n)))
        },
        csMathchar7: function (m, o) {
            var n = {
                mathvariant: i.VARIANT.NORMAL
            };
            if (f(o)) {
                n = o[1];
                o = o[0]
            }
            if (this.stack.env.font) {
                n.mathvariant = this.stack.env.font
            }
            this.Push(this.mmlToken(i.mi(i.entity("#x" + o)).With(n)))
        },
        csDelimiter: function (m, o) {
            var n = {};
            if (f(o)) {
                n = o[1];
                o = o[0]
            }
            if (o.length === 4) {
                o = i.entity("#x" + o)
            } else {
                o = i.chars(o)
            }
            this.Push(this.mmlToken(i.mo(o).With({
                fence: false,
                stretchy: false
            }).With(n)))
        },
        csUndefined: function (m) {
            d.Error(["UndefinedControlSequence", "Undefined control sequence %1", m])
        },
        Variable: function (n) {
            var m = {};
            if (this.stack.env.font) {
                m.mathvariant = this.stack.env.font
            }
            this.Push(this.mmlToken(i.mi(i.chars(n)).With(m)))
        },
        Number: function (p) {
            var m, o = this.string.slice(this.i - 1).match(g.number);
            if (o) {
                m = i.mn(o[0].replace(/[{}]/g, ""));
                this.i += o[0].length - 1
            } else {
                m = i.mo(i.chars(p))
            }
            if (this.stack.env.font) {
                m.mathvariant = this.stack.env.font
            }
            this.Push(this.mmlToken(m))
        },
        Open: function (m) {
            this.Push(b.open())
        },
        Close: function (m) {
            this.Push(b.close())
        },
        Tilde: function (m) {
            this.Push(i.mtext(i.chars(h)))
        },
        Space: function (m) { },
        Superscript: function (r) {
            if (this.GetNext().match(/\d/)) {
                this.string = this.string.substr(0, this.i + 1) + " " + this.string.substr(this.i + 1)
            }
            var q, o, p = this.stack.Top();
            if (p.type === "prime") {
                o = p.data[0];
                q = p.data[1];
                this.stack.Pop()
            } else {
                o = this.stack.Prev();
                if (!o) {
                    o = i.mi("")
                }
            }
            if (o.isEmbellishedWrapper) {
                o = o.data[0].data[0]
            }
            var n = o.movesupsub
                , m = o.sup;
            if ((o.type === "msubsup" && o.data[o.sup]) || (o.type === "munderover" && o.data[o.over] && !o.subsupOK)) {
                d.Error(["DoubleExponent", "Double exponent: use braces to clarify"])
            }
            if (o.type !== "msubsup") {
                if (n) {
                    if (o.type !== "munderover" || o.data[o.over]) {
                        if (o.movablelimits && o.isa(i.mi)) {
                            o = this.mi2mo(o)
                        }
                        o = i.munderover(o, null, null).With({
                            movesupsub: true
                        })
                    }
                    m = o.over
                } else {
                    o = i.msubsup(o, null, null);
                    m = o.sup
                }
            }
            this.Push(b.subsup(o).With({
                position: m,
                primes: q,
                movesupsub: n
            }))
        },
        Subscript: function (r) {
            if (this.GetNext().match(/\d/)) {
                this.string = this.string.substr(0, this.i + 1) + " " + this.string.substr(this.i + 1)
            }
            var q, o, p = this.stack.Top();
            if (p.type === "prime") {
                o = p.data[0];
                q = p.data[1];
                this.stack.Pop()
            } else {
                o = this.stack.Prev();
                if (!o) {
                    o = i.mi("")
                }
            }
            if (o.isEmbellishedWrapper) {
                o = o.data[0].data[0]
            }
            var n = o.movesupsub
                , m = o.sub;
            if ((o.type === "msubsup" && o.data[o.sub]) || (o.type === "munderover" && o.data[o.under] && !o.subsupOK)) {
                d.Error(["DoubleSubscripts", "Double subscripts: use braces to clarify"])
            }
            if (o.type !== "msubsup") {
                if (n) {
                    if (o.type !== "munderover" || o.data[o.under]) {
                        if (o.movablelimits && o.isa(i.mi)) {
                            o = this.mi2mo(o)
                        }
                        o = i.munderover(o, null, null).With({
                            movesupsub: true
                        })
                    }
                    m = o.under
                } else {
                    o = i.msubsup(o, null, null);
                    m = o.sub
                }
            }
            this.Push(b.subsup(o).With({
                position: m,
                primes: q,
                movesupsub: n
            }))
        },
        PRIME: "\u2032",
        SMARTQUOTE: "\u2019",
        Prime: function (o) {
            var n = this.stack.Prev();
            if (!n) {
                n = i.mi()
            }
            if (n.type === "msubsup" && n.data[n.sup]) {
                d.Error(["DoubleExponentPrime", "Prime causes double exponent: use braces to clarify"])
            }
            var m = "";
            this.i--;
            do {
                m += this.PRIME;
                this.i++,
                    o = this.GetNext()
            } while (o === "'" || o === this.SMARTQUOTE);
            m = ["", "\u2032", "\u2033", "\u2034", "\u2057"][m.length] || m;
            this.Push(b.prime(n, this.mmlToken(i.mo(m))))
        },
        mi2mo: function (m) {
            var n = i.mo();
            n.Append.apply(n, m.data);
            var o;
            for (o in n.defaults) {
                if (n.defaults.hasOwnProperty(o) && m[o] != null) {
                    n[o] = m[o]
                }
            }
            for (o in i.copyAttributes) {
                if (i.copyAttributes.hasOwnProperty(o) && m[o] != null) {
                    n[o] = m[o]
                }
            }
            n.lspace = n.rspace = "0";
            n.useMMLspacing &= ~(n.SPACE_ATTR.lspace | n.SPACE_ATTR.rspace);
            return n
        },
        Comment: function (m) {
            while (this.i < this.string.length && this.string.charAt(this.i) != "\n") {
                this.i++
            }
        },
        Hash: function (m) {
            d.Error(["CantUseHash1", "You can't use 'macro parameter character #' in math mode"])
        },
        Other: function (o) {
            var n, m;
            if (this.stack.env.font) {
                n = {
                    mathvariant: this.stack.env.font
                }
            }
            if (g.remap[o]) {
                o = g.remap[o];
                if (f(o)) {
                    n = o[1];
                    o = o[0]
                }
                m = i.mo(i.entity("#x" + o)).With(n)
            } else {
                m = i.mo(o).With(n)
            }
            if (m.autoDefault("stretchy", true)) {
                m.stretchy = false
            }
            if (m.autoDefault("texClass", true) == "") {
                m = i.TeXAtom(m)
            }
            this.Push(this.mmlToken(m))
        },
        SetFont: function (n, m) {
            this.stack.env.font = m
        },
        SetStyle: function (n, m, o, p) {
            this.stack.env.style = m;
            this.stack.env.level = p;
            this.Push(b.style().With({
                styles: {
                    displaystyle: o,
                    scriptlevel: p
                }
            }))
        },
        SetSize: function (m, n) {
            this.stack.env.size = n;
            this.Push(b.style().With({
                styles: {
                    mathsize: n + "em"
                }
            }))
        },
        Color: function (o) {
            var n = this.GetArgument(o);
            var m = this.stack.env.color;
            this.stack.env.color = n;
            var p = this.ParseArg(o);
            if (m) {
                this.stack.env.color
            } else {
                delete this.stack.env.color
            }
            this.Push(i.mstyle(p).With({
                mathcolor: n
            }))
        },
        Spacer: function (m, n) {
            this.Push(i.mspace().With({
                width: n,
                mathsize: i.SIZE.NORMAL,
                scriptlevel: 0
            }))
        },
        LeftRight: function (m) {
            this.Push(b[m.substr(1)]().With({
                delim: this.GetDelimiter(m)
            }))
        },
        Middle: function (m) {
            var n = this.GetDelimiter(m);
            this.Push(i.TeXAtom().With({
                texClass: i.TEXCLASS.CLOSE
            }));
            if (this.stack.Top().type !== "left") {
                d.Error(["MisplacedMiddle", "%1 must be within \\left and \\right", m])
            }
            this.Push(i.mo(n).With({
                stretchy: true
            }));
            this.Push(i.TeXAtom().With({
                texClass: i.TEXCLASS.OPEN
            }))
        },
        NamedFn: function (n, o) {
            if (!o) {
                o = n.substr(1)
            }
            var m = i.mi(o).With({
                texClass: i.TEXCLASS.OP
            });
            this.Push(b.fn(this.mmlToken(m)))
        },
        NamedOp: function (n, o) {
            if (!o) {
                o = n.substr(1)
            }
            o = o.replace(/&thinsp;/, "\u2006");
            var m = i.mo(o).With({
                movablelimits: true,
                movesupsub: true,
                form: i.FORM.PREFIX,
                texClass: i.TEXCLASS.OP
            });
            m.useMMLspacing &= ~m.SPACE_ATTR.form;
            this.Push(this.mmlToken(m))
        },
        Limits: function (n, m) {
            var p = this.stack.Prev("nopop");
            if (!p || (p.Get("texClass") !== i.TEXCLASS.OP && p.movesupsub == null)) {
                d.Error(["MisplacedLimits", "%1 is allowed only on operators", n])
            }
            var o = this.stack.Top();
            if (p.type === "munderover" && !m) {
                p = o.data[o.data.length - 1] = i.msubsup.apply(i.subsup, p.data)
            } else {
                if (p.type === "msubsup" && m) {
                    p = o.data[o.data.length - 1] = i.munderover.apply(i.underover, p.data)
                }
            }
            p.movesupsub = (m ? true : false);
            p.Core().movablelimits = false;
            if (p.movablelimits) {
                p.movablelimits = false
            }
        },
        Over: function (o, n, p) {
            var m = b.over().With({
                name: o
            });
            if (n || p) {
                m.open = n;
                m.close = p
            } else {
                if (o.match(/withdelims$/)) {
                    m.open = this.GetDelimiter(o);
                    m.close = this.GetDelimiter(o)
                }
            }
            if (o.match(/^\\above/)) {
                m.thickness = this.GetDimen(o)
            } else {
                if (o.match(/^\\atop/) || n || p) {
                    m.thickness = 0
                }
            }
            this.Push(m)
        },
        Frac: function (n) {
            var m = this.ParseArg(n);
            var o = this.ParseArg(n);
            this.Push(i.mfrac(m, o))
        },
        Sqrt: function (p) {
            var q = this.GetBrackets(p)
                , m = this.GetArgument(p);
            if (m === "\\frac") {
                m += "{" + this.GetArgument(m) + "}{" + this.GetArgument(m) + "}"
            }
            var o = d.Parse(m, this.stack.env).mml();
            if (!q) {
                o = i.msqrt.apply(i, o.array())
            } else {
                o = i.mroot(o, this.parseRoot(q))
            }
            this.Push(o)
        },
        Root: function (o) {
            var p = this.GetUpTo(o, "\\of");
            var m = this.ParseArg(o);
            this.Push(i.mroot(m, this.parseRoot(p)))
        },
        parseRoot: function (r) {
            var o = this.stack.env
                , m = o.inRoot;
            o.inRoot = true;
            var q = d.Parse(r, o);
            r = q.mml();
            var p = q.stack.global;
            if (p.leftRoot || p.upRoot) {
                r = i.mpadded(r);
                if (p.leftRoot) {
                    r.width = p.leftRoot
                }
                if (p.upRoot) {
                    r.voffset = p.upRoot;
                    r.height = p.upRoot
                }
            }
            o.inRoot = m;
            return r
        },
        MoveRoot: function (m, p) {
            if (!this.stack.env.inRoot) {
                d.Error(["MisplacedMoveRoot", "%1 can appear only within a root", m])
            }
            if (this.stack.global[p]) {
                d.Error(["MultipleMoveRoot", "Multiple use of %1", m])
            }
            var o = this.GetArgument(m);
            if (!o.match(/-?[0-9]+/)) {
                d.Error(["IntegerArg", "The argument to %1 must be an integer", m])
            }
            o = (o / 15) + "em";
            if (o.substr(0, 1) !== "-") {
                o = "+" + o
            }
            this.stack.global[p] = o
        },
        Accent: function (o, m, s) {
            var r = this.ParseArg(o);
            var q = {
                accent: true
            };
            if (this.stack.env.font) {
                q.mathvariant = this.stack.env.font
            }
            var n = this.mmlToken(i.mo(i.entity("#x" + m)).With(q));
            n.stretchy = (s ? true : false);
            var p = (r.isEmbellished() ? r.CoreMO() : r);
            if (p.isa(i.mo)) {
                p.movablelimits = false
            }
            this.Push(i.TeXAtom(i.munderover(r, null, n).With({
                accent: true
            })))
        },
        UnderOver: function (o, s, m, q) {
            var r = {
                o: "over",
                u: "under"
            }[o.charAt(1)];
            var p = this.ParseArg(o);
            if (p.Get("movablelimits")) {
                p.movablelimits = false
            }
            if (p.isa(i.munderover) && p.isEmbellished()) {
                p.Core().With({
                    lspace: 0,
                    rspace: 0
                });
                p = i.mrow(i.mo().With({
                    rspace: 0
                }), p)
            }
            var n = i.munderover(p, null, null);
            n.SetData(n[r], this.mmlToken(i.mo(i.entity("#x" + s)).With({
                stretchy: true,
                accent: !q
            })));
            if (m) {
                n = i.TeXAtom(n).With({
                    texClass: i.TEXCLASS.OP,
                    movesupsub: true
                })
            }
            this.Push(n.With({
                subsupOK: true
            }))
        },
        Overset: function (m) {
            var o = this.ParseArg(m)
                , n = this.ParseArg(m);
            if (n.movablelimits) {
                n.movablelimits = false
            }
            this.Push(i.mover(n, o))
        },
        Underset: function (m) {
            var o = this.ParseArg(m)
                , n = this.ParseArg(m);
            if (n.movablelimits) {
                n.movablelimits = false
            }
            this.Push(i.munder(n, o))
        },
        TeXAtom: function (p, r) {
            var q = {
                texClass: r
            }, o;
            if (r == i.TEXCLASS.OP) {
                q.movesupsub = q.movablelimits = true;
                var m = this.GetArgument(p);
                var n = m.match(/^\s*\\rm\s+([a-zA-Z0-9 ]+)$/);
                if (n) {
                    q.mathvariant = i.VARIANT.NORMAL;
                    o = b.fn(this.mmlToken(i.mi(n[1]).With(q)))
                } else {
                    o = b.fn(i.TeXAtom(d.Parse(m, this.stack.env).mml()).With(q))
                }
            } else {
                o = i.TeXAtom(this.ParseArg(p)).With(q)
            }
            this.Push(o)
        },
        MmlToken: function (o) {
            var p = this.GetArgument(o), m = this.GetBrackets(o, "").replace(/^\s+/, ""), s = this.GetArgument(o), r = {
                attrNames: []
            }, n;
            if (!i[p] || !i[p].prototype.isToken) {
                d.Error(["NotMathMLToken", "%1 is not a token element", p])
            }
            while (m !== "") {
                n = m.match(/^([a-z]+)\s*=\s*('[^']*'|"[^"]*"|[^ ,]*)\s*,?\s*/i);
                if (!n) {
                    d.Error(["InvalidMathMLAttr", "Invalid MathML attribute: %1", m])
                }
                if (i[p].prototype.defaults[n[1]] == null && !this.MmlTokenAllow[n[1]]) {
                    d.Error(["UnknownAttrForElement", "%1 is not a recognized attribute for %2", n[1], p])
                }
                var q = this.MmlFilterAttribute(n[1], n[2].replace(/^(['"])(.*)\1$/, "$2"));
                if (q) {
                    if (q.toLowerCase() === "true") {
                        q = true
                    } else {
                        if (q.toLowerCase() === "false") {
                            q = false
                        }
                    }
                    r[n[1]] = q;
                    r.attrNames.push(n[1])
                }
                m = m.substr(n[0].length)
            }
            this.Push(this.mmlToken(i[p](s).With(r)))
        },
        MmlFilterAttribute: function (m, n) {
            return n
        },
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
        Strut: function (m) {
            this.Push(i.mpadded(i.mrow()).With({
                height: "8.6pt",
                depth: "3pt",
                width: 0
            }))
        },
        Phantom: function (n, m, o) {
            var p = i.mphantom(this.ParseArg(n));
            if (m || o) {
                p = i.mpadded(p);
                if (o) {
                    p.height = p.depth = 0
                }
                if (m) {
                    p.width = 0
                }
            }
            this.Push(i.TeXAtom(p))
        },
        Smash: function (o) {
            var n = this.trimSpaces(this.GetBrackets(o, ""));
            var m = i.mpadded(this.ParseArg(o));
            switch (n) {
                case "b":
                    m.depth = 0;
                    break;
                case "t":
                    m.height = 0;
                    break;
                default:
                    m.height = m.depth = 0
            }
            this.Push(i.TeXAtom(m))
        },
        Lap: function (n) {
            var m = i.mpadded(this.ParseArg(n)).With({
                width: 0
            });
            if (n === "\\llap") {
                m.lspace = "-1width"
            }
            this.Push(i.TeXAtom(m))
        },
        RaiseLower: function (m) {
            var n = this.GetDimen(m);
            var o = b.position().With({
                name: m,
                move: "vertical"
            });
            if (n.charAt(0) === "-") {
                n = n.slice(1);
                m = {
                    raise: "\\lower",
                    lower: "\\raise"
                }[m.substr(1)]
            }
            if (m === "\\lower") {
                o.dh = "-" + n;
                o.dd = "+" + n
            } else {
                o.dh = "+" + n;
                o.dd = "-" + n
            }
            this.Push(o)
        },
        MoveLeftRight: function (m) {
            var p = this.GetDimen(m);
            var o = (p.charAt(0) === "-" ? p.slice(1) : "-" + p);
            if (m === "\\moveleft") {
                var n = p;
                p = o;
                o = n
            }
            this.Push(b.position().With({
                name: m,
                move: "horizontal",
                left: i.mspace().With({
                    width: p,
                    mathsize: i.SIZE.NORMAL
                }),
                right: i.mspace().With({
                    width: o,
                    mathsize: i.SIZE.NORMAL
                })
            }))
        },
        Hskip: function (m) {
            this.Push(i.mspace().With({
                width: this.GetDimen(m),
                mathsize: i.SIZE.NORMAL
            }))
        },
        Rule: function (n, p) {
            var m = this.GetDimen(n)
                , o = this.GetDimen(n)
                , r = this.GetDimen(n);
            var q = {
                width: m,
                height: o,
                depth: r
            };
            if (p !== "blank") {
                q.mathbackground = (this.stack.env.color || "black")
            }
            this.Push(i.mspace().With(q))
        },
        rule: function (p) {
            var n = this.GetBrackets(p)
                , m = this.GetDimen(p)
                , q = this.GetDimen(p);
            var o = i.mspace().With({
                width: m,
                height: q,
                mathbackground: (this.stack.env.color || "black")
            });
            if (n) {
                o = i.mpadded(o).With({
                    voffset: n
                });
                if (n.match(/^\-/)) {
                    o.height = n;
                    o.depth = "+" + n.substr(1)
                } else {
                    o.height = "+" + n
                }
            }
            this.Push(o)
        },
        MakeBig: function (m, p, n) {
            n *= g.p_height;
            n = String(n).replace(/(\.\d\d\d).+/, "$1") + "em";
            var o = this.GetDelimiter(m, true);
            this.Push(i.TeXAtom(i.mo(o).With({
                minsize: n,
                maxsize: n,
                fence: true,
                stretchy: true,
                symmetric: true
            })).With({
                texClass: p
            }))
        },
        BuildRel: function (m) {
            var n = this.ParseUpTo(m, "\\over");
            var o = this.ParseArg(m);
            this.Push(i.TeXAtom(i.munderover(o, null, n)).With({
                texClass: i.TEXCLASS.REL
            }))
        },
        HBox: function (m, n) {
            this.Push.apply(this, this.InternalMath(this.GetArgument(m), n))
        },
        FBox: function (m) {
            this.Push(i.menclose.apply(i, this.InternalMath(this.GetArgument(m))).With({
                notation: "box"
            }))
        },
        Not: function (m) {
            this.Push(b.not())
        },
        Dots: function (m) {
            this.Push(b.dots().With({
                ldots: this.mmlToken(i.mo(i.entity("#x2026")).With({
                    stretchy: false
                })),
                cdots: this.mmlToken(i.mo(i.entity("#x22EF")).With({
                    stretchy: false
                }))
            }))
        },
        Require: function (m) {
            var n = this.GetArgument(m).replace(/.*\//, "").replace(/[^a-z0-9_.-]/ig, "");
            this.Extension(null, n)
        },
        Extension: function (m, n, o) {
            if (m && !typeof (m) === "string") {
                m = m.name
            }
            n = d.extensionDir + "/" + n;
            if (!n.match(/\.js$/)) {
                n += ".js"
            }
            if (!j.loaded[j.fileURL(n)]) {
                if (m != null) {
                    delete g[o || "macros"][m.replace(/^\\/, "")]
                }
                c.RestartAfter(j.Require(n))
            }
        },
        Macro: function (o, r, q, s) {
            if (q) {
                var n = [];
                if (s != null) {
                    var m = this.GetBrackets(o);
                    n.push(m == null ? s : m)
                }
                for (var p = n.length; p < q; p++) {
                    n.push(this.GetArgument(o))
                }
                r = this.SubstituteArgs(n, r)
            }
            this.string = this.AddArgs(r, this.string.slice(this.i));
            this.i = 0;
            if (++this.macroCount > d.config.MAXMACROS) {
                d.Error(["MaxMacroSub1", "MathJax maximum macro substitution count exceeded; is there a recursive macro call?"])
            }
        },
        Matrix: function (n, p, v, r, u, o, m, w, t) {
            var s = this.GetNext();
            if (s === "") {
                d.Error(["MissingArgFor", "Missing argument for %1", n])
            }
            if (s === "{") {
                this.i++
            } else {
                this.string = s + "}" + this.string.slice(this.i + 1);
                this.i = 0
            }
            var q = b.array().With({
                requireClose: true,
                arraydef: {
                    rowspacing: (o || "4pt"),
                    columnspacing: (u || "1em")
                }
            });
            if (w) {
                q.isCases = true
            }
            if (t) {
                q.isNumbered = true;
                q.arraydef.side = t
            }
            if (p || v) {
                q.open = p;
                q.close = v
            }
            if (m === "D") {
                q.arraydef.displaystyle = true
            }
            if (r != null) {
                q.arraydef.columnalign = r
            }
            this.Push(q)
        },
        Entry: function (p) {
            this.Push(b.cell().With({
                isEntry: true,
                name: p
            }));
            if (this.stack.Top().isCases) {
                var o = this.string;
                var t = 0
                    , s = -1
                    , q = this.i
                    , n = o.length;
                while (q < n) {
                    var u = o.charAt(q);
                    if (u === "{") {
                        t++;
                        q++
                    } else {
                        if (u === "}") {
                            if (t === 0) {
                                n = 0
                            } else {
                                t--;
                                if (t === 0 && s < 0) {
                                    s = q - this.i
                                }
                                q++
                            }
                        } else {
                            if (u === "&" && t === 0) {
                                d.Error(["ExtraAlignTab", "Extra alignment tab in \\cases text"])
                            } else {
                                if (u === "\\") {
                                    if (o.substr(q).match(/^((\\cr)[^a-zA-Z]|\\\\)/)) {
                                        n = 0
                                    } else {
                                        q += 2
                                    }
                                } else {
                                    q++
                                }
                            }
                        }
                    }
                }
                var r = o.substr(this.i, q - this.i);
                if (!r.match(/^\s*\\text[^a-zA-Z]/) || s !== r.replace(/\s+$/, "").length - 1) {
                    this.Push.apply(this, this.InternalMath(r, 0));
                    this.i = q
                }
            }
        },
        Cr: function (m) {
            this.Push(b.cell().With({
                isCR: true,
                name: m
            }))
        },
        CrLaTeX: function (m) {
            var q;
            if (this.string.charAt(this.i) === "[") {
                q = this.GetBrackets(m, "").replace(/ /g, "").replace(/,/, ".");
                if (q && !this.matchDimen(q)) {
                    d.Error(["BracketMustBeDimension", "Bracket argument to %1 must be a dimension", m])
                }
            }
            this.Push(b.cell().With({
                isCR: true,
                name: m,
                linebreak: true
            }));
            var p = this.stack.Top();
            if (p.isa(b.array)) {
                if (q && p.arraydef.rowspacing) {
                    var o = p.arraydef.rowspacing.split(/ /);
                    if (!p.rowspacing) {
                        p.rowspacing = this.dimen2em(o[0])
                    }
                    while (o.length < p.table.length) {
                        o.push(this.Em(p.rowspacing))
                    }
                    o[p.table.length - 1] = this.Em(Math.max(0, p.rowspacing + this.dimen2em(q)));
                    p.arraydef.rowspacing = o.join(" ")
                }
            } else {
                if (q) {
                    this.Push(i.mspace().With({
                        depth: q
                    }))
                }
                this.Push(i.mspace().With({
                    linebreak: i.LINEBREAK.NEWLINE
                }))
            }
        },
        emPerInch: 7.2,
        pxPerInch: 72,
        matchDimen: function (m) {
            return m.match(/^(-?(?:\.\d+|\d+(?:\.\d*)?))(px|pt|em|ex|mu|pc|in|mm|cm)$/)
        },
        dimen2em: function (q) {
            var o = this.matchDimen(q);
            var n = parseFloat(o[1] || "1")
                , p = o[2];
            if (p === "em") {
                return n
            }
            if (p === "ex") {
                return n * 0.43
            }
            if (p === "pt") {
                return n / 10
            }
            if (p === "pc") {
                return n * 1.2
            }
            if (p === "px") {
                return n * this.emPerInch / this.pxPerInch
            }
            if (p === "in") {
                return n * this.emPerInch
            }
            if (p === "cm") {
                return n * this.emPerInch / 2.54
            }
            if (p === "mm") {
                return n * this.emPerInch / 25.4
            }
            if (p === "mu") {
                return n / 18
            }
            return 0
        },
        Em: function (n) {
            if (Math.abs(n) < 0.0006) {
                return "0em"
            }
            return n.toFixed(3).replace(/\.?0+$/, "") + "em"
        },
        HLine: function (n, o) {
            if (o == null) {
                o = "solid"
            }
            var p = this.stack.Top();
            if (!p.isa(b.array) || p.data.length) {
                d.Error(["Misplaced", "Misplaced %1", n])
            }
            if (p.table.length == 0) {
                p.frame.push("top")
            } else {
                var m = (p.arraydef.rowlines ? p.arraydef.rowlines.split(/ /) : []);
                while (m.length < p.table.length) {
                    m.push("none")
                }
                m[p.table.length - 1] = o;
                p.arraydef.rowlines = m.join(" ")
            }
        },
        HFill: function (m) {
            var n = this.stack.Top();
            if (n.isa(b.array)) {
                n.hfill.push(n.data.length)
            } else {
                d.Error(["UnsupportedHFill", "Unsupported use of %1", m])
            }
        },
        BeginEnd: function (o) {
            var p = this.GetArgument(o)
                , r = false;
            if (p.match(/^\\end\\/)) {
                r = true;
                p = p.substr(5)
            }
            if (p.match(/\\/i)) {
                d.Error(["InvalidEnv", "Invalid environment name '%1'", p])
            }
            var q = this.envFindName(p);
            if (!q) {
                d.Error(["UnknownEnv", "Unknown environment '%1'", p])
            }
            if (!f(q)) {
                q = [q]
            }
            var m = (f(q[1]) ? q[1][0] : q[1]);
            var n = b.begin().With({
                name: p,
                end: m,
                parse: this
            });
            if (o === "\\end") {
                if (!r && f(q[1]) && this[q[1][1]]) {
                    n = this[q[1][1]].apply(this, [n].concat(q.slice(2)))
                } else {
                    n = b.end().With({
                        name: p
                    })
                }
            } else {
                if (++this.macroCount > d.config.MAXMACROS) {
                    d.Error(["MaxMacroSub2", "MathJax maximum substitution count exceeded; is there a recursive latex environment?"])
                }
                if (q[0] && this[q[0]]) {
                    n = this[q[0]].apply(this, [n].concat(q.slice(2)))
                }
            }
            this.Push(n)
        },
        envFindName: function (m) {
            return g.environment[m]
        },
        Equation: function (m, n) {
            return n
        },
        ExtensionEnv: function (n, m) {
            this.Extension(n.name, m, "environment")
        },
        Array: function (n, p, u, s, t, o, m, q) {
            if (!s) {
                s = this.GetArgument("\\begin{" + n.name + "}")
            }
            var v = ("c" + s).replace(/[^clr|:]/g, "").replace(/[^|:]([|:])+/g, "$1");
            s = s.replace(/[^clr]/g, "").split("").join(" ");
            s = s.replace(/l/g, "left").replace(/r/g, "right").replace(/c/g, "center");
            var r = b.array().With({
                arraydef: {
                    columnalign: s,
                    columnspacing: (t || "1em"),
                    rowspacing: (o || "4pt")
                }
            });
            if (v.match(/[|:]/)) {
                if (v.charAt(0).match(/[|:]/)) {
                    r.frame.push("left");
                    r.frame.dashed = v.charAt(0) === ":"
                }
                if (v.charAt(v.length - 1).match(/[|:]/)) {
                    r.frame.push("right")
                }
                v = v.substr(1, v.length - 2);
                r.arraydef.columnlines = v.split("").join(" ").replace(/[^|: ]/g, "none").replace(/\|/g, "solid").replace(/:/g, "dashed")
            }
            if (p) {
                r.open = this.convertDelimiter(p)
            }
            if (u) {
                r.close = this.convertDelimiter(u)
            }
            if (m === "D") {
                r.arraydef.displaystyle = true
            } else {
                if (m) {
                    r.arraydef.displaystyle = false
                }
            }
            if (m === "S") {
                r.arraydef.scriptlevel = 1
            }
            if (q) {
                r.arraydef.useHeight = false
            }
            this.Push(n);
            return r
        },
        AlignedArray: function (m) {
            var n = this.GetBrackets("\\begin{" + m.name + "}");
            return this.setArrayAlign(this.Array.apply(this, arguments), n)
        },
        setArrayAlign: function (n, m) {
            m = this.trimSpaces(m || "");
            if (m === "t") {
                n.arraydef.align = "baseline 1"
            } else {
                if (m === "b") {
                    n.arraydef.align = "baseline -1"
                } else {
                    if (m === "c") {
                        n.arraydef.align = "center"
                    } else {
                        if (m) {
                            n.arraydef.align = m
                        }
                    }
                }
            }
            return n
        },
        convertDelimiter: function (m) {
            if (m) {
                m = g.delimiter[m]
            }
            if (m == null) {
                return null
            }
            if (f(m)) {
                m = m[0]
            }
            if (m.length === 4) {
                m = String.fromCharCode(parseInt(m, 16))
            }
            return m
        },
        trimSpaces: function (n) {
            if (typeof (n) != "string") {
                return n
            }
            var m = n.replace(/^\s+|\s+$/g, "");
            if (m.match(/\\$/) && n.match(/ $/)) {
                m += " "
            }
            return m
        },
        nextIsSpace: function () {
            return this.string.charAt(this.i).match(/\s/)
        },
        GetNext: function () {
            while (this.nextIsSpace()) {
                this.i++
            }
            return this.string.charAt(this.i)
        },
        GetCS: function () {
            var m = this.string.slice(this.i).match(/^([a-z]+|.) ?/i);
            if (m) {
                this.i += m[1].length;
                return m[1]
            } else {
                this.i++;
                return " "
            }
        },
        GetArgument: function (n, o) {
            switch (this.GetNext()) {
                case "":
                    if (!o) {
                        d.Error(["MissingArgFor", "Missing argument for %1", n])
                    }
                    return null;
                case "}":
                    if (!o) {
                        d.Error(["ExtraCloseMissingOpen", "Extra close brace or missing open brace"])
                    }
                    return null;
                case "\\":
                    this.i++;
                    return "\\" + this.GetCS();
                case "{":
                    var m = ++this.i
                        , p = 1;
                    while (this.i < this.string.length) {
                        switch (this.string.charAt(this.i++)) {
                            case "\\":
                                this.i++;
                                break;
                            case "{":
                                p++;
                                break;
                            case "}":
                                if (--p == 0) {
                                    return this.string.slice(m, this.i - 1)
                                }
                                break
                        }
                    }
                    d.Error(["MissingCloseBrace", "Missing close brace"]);
                    break
            }
            return this.string.charAt(this.i++)
        },
        GetBrackets: function (n, p) {
            if (this.GetNext() != "[") {
                return p
            }
            var m = ++this.i
                , o = 0;
            while (this.i < this.string.length) {
                switch (this.string.charAt(this.i++)) {
                    case "{":
                        o++;
                        break;
                    case "\\":
                        this.i++;
                        break;
                    case "}":
                        if (o-- <= 0) {
                            d.Error(["ExtraCloseLooking", "Extra close brace while looking for %1", "']'"])
                        }
                        break;
                    case "]":
                        if (o == 0) {
                            return this.string.slice(m, this.i - 1)
                        }
                        break
                }
            }
            d.Error(["MissingCloseBracket", "Couldn't find closing ']' for argument to %1", n])
        },
        GetDelimiter: function (m, n) {
            while (this.nextIsSpace()) {
                this.i++
            }
            var o = this.string.charAt(this.i);
            this.i++;
            if (this.i <= this.string.length) {
                if (o == "\\") {
                    o += this.GetCS(m)
                } else {
                    if (o === "{" && n) {
                        this.i--;
                        o = this.GetArgument(m)
                    }
                }
                if (g.delimiter[o] != null) {
                    return this.convertDelimiter(o)
                }
            }
            d.Error(["MissingOrUnrecognizedDelim", "Missing or unrecognized delimiter for %1", m])
        },
        GetDimen: function (n) {
            var o;
            if (this.nextIsSpace()) {
                this.i++
            }
            if (this.string.charAt(this.i) == "{") {
                o = this.GetArgument(n);
                if (o.match(/^\s*([-+]?([.,]\d+|\d+([.,]\d*)?))\s*(pt|em|ex|mu|px|mm|cm|in|pc)\s*$/)) {
                    return o.replace(/ /g, "").replace(/,/, ".")
                }
            } else {
                o = this.string.slice(this.i);
                var m = o.match(/^\s*(([-+]?([.,]\d+|\d+([.,]\d*)?))\s*(pt|em|ex|mu|px|mm|cm|in|pc)) ?/);
                if (m) {
                    this.i += m[0].length;
                    return m[1].replace(/ /g, "").replace(/,/, ".")
                }
            }
            d.Error(["MissingDimOrUnits", "Missing dimension or its units for %1", n])
        },
        GetUpTo: function (o, p) {
            while (this.nextIsSpace()) {
                this.i++
            }
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
                            d.Error(["ExtraCloseLooking", "Extra close brace while looking for %1", p])
                        }
                        q--;
                        break
                }
                if (q == 0 && r == p) {
                    return this.string.slice(n, m)
                }
            }
            d.Error(["TokenNotFoundForCommand", "Couldn't find %1 for %2", p, o])
        },
        ParseArg: function (m) {
            return d.Parse(this.GetArgument(m), this.stack.env).mml()
        },
        ParseUpTo: function (m, n) {
            return d.Parse(this.GetUpTo(m, n), this.stack.env).mml()
        },
        InternalMath: function (v, m) {
            var o = (this.stack.env.font ? {
                mathvariant: this.stack.env.font
            } : {});
            var n = [], r = 0, q = 0, u, s = "", p = 0;
            if (v.match(/\\?[${}\\]|\\\(|\\(eq)?ref\s*\{/)) {
                while (r < v.length) {
                    u = v.charAt(r++);
                    if (u === "$") {
                        if (s === "$" && p === 0) {
                            n.push(i.TeXAtom(d.Parse(v.slice(q, r - 1), {}).mml()));
                            s = "";
                            q = r
                        } else {
                            if (s === "") {
                                if (q < r - 1) {
                                    n.push(this.InternalText(v.slice(q, r - 1), o))
                                }
                                s = "$";
                                q = r
                            }
                        }
                    } else {
                        if (u === "{" && s !== "") {
                            p++
                        } else {
                            if (u === "}") {
                                if (s === "}" && p === 0) {
                                    n.push(i.TeXAtom(d.Parse(v.slice(q, r), {}).mml().With(o)));
                                    s = "";
                                    q = r
                                } else {
                                    if (s !== "") {
                                        if (p) {
                                            p--
                                        }
                                    }
                                }
                            } else {
                                if (u === "\\") {
                                    if (s === "" && v.substr(r).match(/^(eq)?ref\s*\{/)) {
                                        var t = RegExp["$&"].length;
                                        if (q < r - 1) {
                                            n.push(this.InternalText(v.slice(q, r - 1), o))
                                        }
                                        s = "}";
                                        q = r - 1;
                                        r += t
                                    } else {
                                        u = v.charAt(r++);
                                        if (u === "(" && s === "") {
                                            if (q < r - 2) {
                                                n.push(this.InternalText(v.slice(q, r - 2), o))
                                            }
                                            s = ")";
                                            q = r
                                        } else {
                                            if (u === ")" && s === ")" && p === 0) {
                                                n.push(i.TeXAtom(d.Parse(v.slice(q, r - 2), {}).mml()));
                                                s = "";
                                                q = r
                                            } else {
                                                if (u.match(/[${}\\]/) && s === "") {
                                                    r--;
                                                    v = v.substr(0, r - 1) + v.substr(r)
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
                    d.Error(["MathNotTerminated", "Math not terminated in text box"])
                }
            }
            if (q < v.length) {
                n.push(this.InternalText(v.slice(q), o))
            }
            if (m != null) {
                n = [i.mstyle.apply(i, n).With({
                    displaystyle: false,
                    scriptlevel: m
                })]
            } else {
                if (n.length > 1) {
                    n = [i.mrow.apply(i, n)]
                }
            }
            return n
        },
        InternalText: function (n, m) {
            n = n.replace(/^\s+/, h).replace(/\s+$/, h);
            return i.mtext(i.chars(n)).With(m)
        },
        SubstituteArgs: function (n, m) {
            var q = "";
            var p = "";
            var r;
            var o = 0;
            while (o < m.length) {
                r = m.charAt(o++);
                if (r === "\\") {
                    q += r + m.charAt(o++)
                } else {
                    if (r === "#") {
                        r = m.charAt(o++);
                        if (r === "#") {
                            q += r
                        } else {
                            if (!r.match(/[1-9]/) || r > n.length) {
                                d.Error(["IllegalMacroParam", "Illegal macro parameter reference"])
                            }
                            p = this.AddArgs(this.AddArgs(p, q), n[r - 1]);
                            q = ""
                        }
                    } else {
                        q += r
                    }
                }
            }
            return this.AddArgs(p, q)
        },
        AddArgs: function (n, m) {
            if (m.match(/^[a-z]/i) && n.match(/(^|[^\\])(\\\\)*\\[a-z]+$/i)) {
                n += " "
            }
            if (n.length + m.length > d.config.MAXBUFFER) {
                d.Error(["MaxBufferSize", "MathJax internal buffer size exceeded; is there a recursive macro call?"])
            }
            return n + m
        }
    });
    d.Augment({
        Stack: e,
        Parse: a,
        Definitions: g,
        Startup: l,
        config: {
            MAXMACROS: 10000,
            MAXBUFFER: 5 * 1024
        },
        sourceMenuTitle: ["TeXCommands", "TeX Commands"],
        annotationEncoding: "application/x-tex",
        prefilterHooks: CallbackUtil.Hooks(true),
        postfilterHooks: CallbackUtil.Hooks(true),
        Config: function () {
            this.SUPER(arguments).Config.apply(this, arguments);
            if (this.config.equationNumbers.autoNumber !== "none") {
                if (!this.config.extensions) {
                    this.config.extensions = []
                }
                this.config.extensions.push("AMSmath.js")
            }
        },
        Translate: function (m) {
            var n, o = false, q = MathJax.HTML.getScript(m);
            var s = (m.type.replace(/\n/g, " ").match(/(;|\s|\n)mode\s*=\s*display(;|\s|\n|$)/) != null);
            var r = {
                math: q,
                display: s,
                script: m
            };
            var t = this.prefilterHooks.Execute(r);
            if (t) {
                return t
            }
            q = r.math;
            try {
                n = d.Parse(q).mml()
            } catch (p) {
                if (!p.texError) {
                    throw p
                }
                n = this.formatError(p, q, s, m);
                o = true
            }
            if (n.isa(i.mtable) && n.displaystyle === "inherit") {
                n.displaystyle = s
            }
            if (n.inferred) {
                n = i.apply(MathJax.ElementJax, n.data)
            } else {
                n = i(n)
            }
            if (s) {
                n.root.display = "block"
            }
            if (o) {
                n.texError = true
            }
            r.math = n;
            return this.postfilterHooks.Execute(r) || r.math
        },
        prefilterMath: function (n, o, m) {
            return n
        },
        postfilterMath: function (n, o, m) {
            this.combineRelations(n.root);
            return n
        },
        formatError: function (p, o, q, m) {
            var n = p.message.replace(/\n.*/, "");
            c.signal.Post(["TeX Jax - parse error", n, o, q, m]);
            return i.Error(n)
        },
        Error: function (m) {
            if (f(m)) {
                m = k.apply(k, m)
            }
            throw c.Insert(Error(m), {
                texError: true
            })
        },
        Macro: function (m, n, o) {
            g.macros[m] = ["Macro"].concat([].slice.call(arguments, 1));
            g.macros[m].isUser = true
        },
        fenced: function (o, n, p) {
            var m = i.mrow().With({
                open: o,
                close: p,
                texClass: i.TEXCLASS.INNER
            });
            m.Append(i.mo(o).With({
                fence: true,
                stretchy: true,
                symmetric: true,
                texClass: i.TEXCLASS.OPEN
            }), n, i.mo(p).With({
                fence: true,
                stretchy: true,
                symmetric: true,
                texClass: i.TEXCLASS.CLOSE
            }));
            return m
        },
        fixedFence: function (o, n, p) {
            var m = i.mrow().With({
                open: o,
                close: p,
                texClass: i.TEXCLASS.ORD
            });
            if (o) {
                m.Append(this.mathPalette(o, "l"))
            }
            if (n.type === "mrow") {
                m.Append.apply(m, n.data)
            } else {
                m.Append(n)
            }
            if (p) {
                m.Append(this.mathPalette(p, "r"))
            }
            return m
        },
        mathPalette: function (p, n) {
            if (p === "{" || p === "}") {
                p = "\\" + p
            }
            var o = "{\\bigg" + n + " " + p + "}"
                , m = "{\\big" + n + " " + p + "}";
            return d.Parse("\\mathchoice" + o + m + m + m, {}).mml()
        },
        combineRelations: function (q) {
            var r, n, p, o;
            for (r = 0,
                n = q.data.length; r < n; r++) {
                if (q.data[r]) {
                    if (q.isa(i.mrow)) {
                        while (r + 1 < n && (p = q.data[r]) && (o = q.data[r + 1]) && p.isa(i.mo) && o.isa(i.mo) && p.Get("texClass") === i.TEXCLASS.REL && o.Get("texClass") === i.TEXCLASS.REL) {
                            if (p.variantForm == o.variantForm && p.Get("mathvariant") == o.Get("mathvariant") && p.style == o.style && p["class"] == o["class"] && !p.id && !o.id) {
                                p.Append.apply(p, o.data);
                                q.data.splice(r + 1, 1);
                                n--
                            } else {
                                p.rspace = o.lspace = "0pt";
                                r++
                            }
                        }
                    }
                    if (!q.data[r].isToken) {
                        this.combineRelations(q.data[r])
                    }
                }
            }
        }
    });
    d.prefilterHooks.Add(function (m) {
        m.math = d.prefilterMath(m.math, m.display, m.script)
    });
    d.postfilterHooks.Add(function (m) {
        m.math = d.postfilterMath(m.math, m.display, m.script)
    });
    d.loadComplete("jax.js")
}
)(MathJax.InputJax.TeX, MathJax.Hub, MathJax.Ajax);
MathJax.Ajax.loadComplete("[MathJax]/extensions/TeX/noErrors.js");

MathJax.Extension["TeX/AMSmath"] = {
    version: "2.7.2",
    number: 0,
    startNumber: 0,
    IDs: {},
    eqIDs: {},
    labels: {},
    eqlabels: {},
    refs: []
};
MathJax.Hub.Register.StartupHook("TeX Jax Ready", function () {
    var b = MathJax.ElementJax.mml
        , h = MathJax.InputJax.TeX
        , g = MathJax.Extension["TeX/AMSmath"];
    var d = h.Definitions
        , f = h.Stack.Item
        , a = h.config.equationNumbers;
    var c = function (k) {
        var n = [];
        for (var l = 0, j = k.length; l < j; l++) {
            n[l] = h.Parse.prototype.Em(k[l])
        }
        return n.join(" ")
    };
    var e = (document.getElementsByTagName("base").length === 0) ? "" : String(document.location).replace(/#.*$/, "");
    d.Add({
        mathchar0mo: {
            iiiint: ["2A0C", {
                texClass: b.TEXCLASS.OP
            }]
        },
        macros: {
            mathring: ["Accent", "2DA"],
            nobreakspace: "Tilde",
            negmedspace: ["Spacer", b.LENGTH.NEGATIVEMEDIUMMATHSPACE],
            negthickspace: ["Spacer", b.LENGTH.NEGATIVETHICKMATHSPACE],
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
            shoveleft: ["HandleShove", b.ALIGN.LEFT],
            shoveright: ["HandleShove", b.ALIGN.RIGHT],
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
            equation: ["EquationBegin", "Equation", true],
            "equation*": ["EquationBegin", "EquationStar", false],
            eqnarray: ["AMSarray", null, true, true, "rcl", "0 " + b.LENGTH.THICKMATHSPACE, ".5em"],
            "eqnarray*": ["AMSarray", null, false, true, "rcl", "0 " + b.LENGTH.THICKMATHSPACE, ".5em"]
        },
        delimiter: {
            "\\lvert": ["007C", {
                texClass: b.TEXCLASS.OPEN
            }],
            "\\rvert": ["007C", {
                texClass: b.TEXCLASS.CLOSE
            }],
            "\\lVert": ["2016", {
                texClass: b.TEXCLASS.OPEN
            }],
            "\\rVert": ["2016", {
                texClass: b.TEXCLASS.CLOSE
            }]
        }
    }, null, true);
    h.Parse.Augment({
        HandleTag: function (k) {
            var m = this.GetStar();
            var j = this.trimSpaces(this.GetArgument(k))
                , i = j;
            if (!m) {
                j = a.formatTag(j)
            }
            var l = this.stack.global;
            l.tagID = i;
            if (l.notags) {
                h.Error(["CommandNotAllowedInEnv", "%1 not allowed in %2 environment", k, l.notags])
            }
            if (l.tag) {
                h.Error(["MultipleCommand", "Multiple %1", k])
            }
            l.tag = b.mtd.apply(b, this.InternalMath(j)).With({
                id: a.formatID(i)
            })
        },
        HandleNoTag: function (i) {
            if (this.stack.global.tag) {
                delete this.stack.global.tag
            }
            this.stack.global.notag = true
        },
        HandleLabel: function (j) {
            var k = this.stack.global
                , i = this.GetArgument(j);
            if (i === "") {
                return
            }
            if (!g.refUpdate) {
                if (k.label) {
                    h.Error(["MultipleCommand", "Multiple %1", j])
                }
                k.label = i;
                if (g.labels[i] || g.eqlabels[i]) {
                    h.Error(["MultipleLabel", "Label '%1' multiply defined", i])
                }
                g.eqlabels[i] = {
                    tag: "???",
                    id: ""
                }
            }
        },
        HandleRef: function (k, m) {
            var j = this.GetArgument(k);
            var l = g.labels[j] || g.eqlabels[j];
            if (!l) {
                l = {
                    tag: "???",
                    id: ""
                };
                g.badref = !g.refUpdate
            }
            var i = l.tag;
            if (m) {
                i = a.formatTag(i)
            }
            this.Push(b.mrow.apply(b, this.InternalMath(i)).With({
                href: a.formatURL(l.id, e),
                "class": "MathJax_ref"
            }))
        },
        HandleDeclareOp: function (j) {
            var i = (this.GetStar() ? "" : "\\nolimits\\SkipLimits");
            var k = this.trimSpaces(this.GetArgument(j));
            if (k.charAt(0) == "\\") {
                k = k.substr(1)
            }
            var l = this.GetArgument(j);
            l = l.replace(/\*/g, "\\text{*}").replace(/-/g, "\\text{-}");
            h.Definitions.macros[k] = ["Macro", "\\mathop{\\rm " + l + "}" + i]
        },
        HandleOperatorName: function (j) {
            var i = (this.GetStar() ? "" : "\\nolimits\\SkipLimits");
            var k = this.trimSpaces(this.GetArgument(j));
            k = k.replace(/\*/g, "\\text{*}").replace(/-/g, "\\text{-}");
            this.string = "\\mathop{\\rm " + k + "}" + i + " " + this.string.slice(this.i);
            this.i = 0
        },
        SkipLimits: function (j) {
            var l = this.GetNext()
                , k = this.i;
            if (l === "\\" && ++this.i && this.GetCS() !== "limits") {
                this.i = k
            }
        },
        HandleShove: function (j, i) {
            var k = this.stack.Top();
            if (k.type !== "multline") {
                h.Error(["CommandInMultline", "%1 can only appear within the multline environment", j])
            }
            if (k.data.length) {
                h.Error(["CommandAtTheBeginingOfLine", "%1 must come at the beginning of the line", j])
            }
            k.data.shove = i
        },
        CFrac: function (l) {
            var i = this.trimSpaces(this.GetBrackets(l, ""))
                , k = this.GetArgument(l)
                , m = this.GetArgument(l);
            var j = b.mfrac(h.Parse("\\strut\\textstyle{" + k + "}", this.stack.env).mml(), h.Parse("\\strut\\textstyle{" + m + "}", this.stack.env).mml());
            i = ({
                l: b.ALIGN.LEFT,
                r: b.ALIGN.RIGHT,
                "": ""
            })[i];
            if (i == null) {
                h.Error(["IllegalAlign", "Illegal alignment specified in %1", l])
            }
            if (i) {
                j.numalign = j.denomalign = i
            }
            this.Push(j)
        },
        Genfrac: function (j, l, q, n, i) {
            if (l == null) {
                l = this.GetDelimiterArg(j)
            }
            if (q == null) {
                q = this.GetDelimiterArg(j)
            }
            if (n == null) {
                n = this.GetArgument(j)
            }
            if (i == null) {
                i = this.trimSpaces(this.GetArgument(j))
            }
            var m = this.ParseArg(j);
            var p = this.ParseArg(j);
            var k = b.mfrac(m, p);
            if (n !== "") {
                k.linethickness = n
            }
            if (l || q) {
                k = h.fixedFence(l, k.With({
                    texWithDelims: true
                }), q)
            }
            if (i !== "") {
                var o = (["D", "T", "S", "SS"])[i];
                if (o == null) {
                    h.Error(["BadMathStyleFor", "Bad math style for %1", j])
                }
                k = b.mstyle(k);
                if (o === "D") {
                    k.displaystyle = true;
                    k.scriptlevel = 0
                } else {
                    k.displaystyle = false;
                    k.scriptlevel = i - 1
                }
            }
            this.Push(k)
        },
        Multline: function (j, i) {
            this.Push(j);
            this.checkEqnEnv();
            return f.multline(i, this.stack).With({
                arraydef: {
                    displaystyle: true,
                    rowspacing: ".5em",
                    width: h.config.MultLineWidth,
                    columnwidth: "100%",
                    side: h.config.TagSide,
                    minlabelspacing: h.config.TagIndent
                }
            })
        },
        AMSarray: function (k, j, i, m, l) {
            this.Push(k);
            if (i) {
                this.checkEqnEnv()
            }
            m = m.replace(/[^clr]/g, "").split("").join(" ");
            m = m.replace(/l/g, "left").replace(/r/g, "right").replace(/c/g, "center");
            return f.AMSarray(k.name, j, i, this.stack).With({
                arraydef: {
                    displaystyle: true,
                    rowspacing: ".5em",
                    columnalign: m,
                    columnspacing: (l || "1em"),
                    rowspacing: "3pt",
                    side: h.config.TagSide,
                    minlabelspacing: h.config.TagIndent
                }
            })
        },
        AlignedAMSArray: function (i) {
            var j = this.GetBrackets("\\begin{" + i.name + "}");
            return this.setArrayAlign(this.AMSarray.apply(this, arguments), j)
        },
        AlignAt: function (l, j, i) {
            var q, k, p = "", o = [];
            if (!i) {
                k = this.GetBrackets("\\begin{" + l.name + "}")
            }
            q = this.GetArgument("\\begin{" + l.name + "}");
            if (q.match(/[^0-9]/)) {
                h.Error(["PositiveIntegerArg", "Argument to %1 must me a positive integer", "\\begin{" + l.name + "}"])
            }
            while (q > 0) {
                p += "rl";
                o.push("0em 0em");
                q--
            }
            o = o.join(" ");
            if (i) {
                return this.AMSarray(l, j, i, p, o)
            }
            var m = this.AMSarray(l, j, i, p, o);
            return this.setArrayAlign(m, k)
        },
        EquationBegin: function (i, j) {
            this.checkEqnEnv();
            this.stack.global.forcetag = (j && a.autoNumber !== "none");
            return i
        },
        EquationStar: function (i, j) {
            this.stack.global.tagged = true;
            return j
        },
        checkEqnEnv: function () {
            if (this.stack.global.eqnenv) {
                h.Error(["ErroneousNestingEq", "Erroneous nesting of equation structures"])
            }
            this.stack.global.eqnenv = true
        },
        MultiIntegral: function (j, m) {
            var l = this.GetNext();
            if (l === "\\") {
                var k = this.i;
                l = this.GetArgument(j);
                this.i = k;
                if (l === "\\limits") {
                    if (j === "\\idotsint") {
                        m = "\\!\\!\\mathop{\\,\\," + m + "}"
                    } else {
                        m = "\\!\\!\\!\\mathop{\\,\\,\\," + m + "}"
                    }
                }
            }
            this.string = m + " " + this.string.slice(this.i);
            this.i = 0
        },
        xArrow: function (k, o, n, i) {
            var m = {
                width: "+" + (n + i) + "mu",
                lspace: n + "mu"
            };
            var p = this.GetBrackets(k)
                , q = this.ParseArg(k);
            var s = b.mo(b.chars(String.fromCharCode(o))).With({
                stretchy: true,
                texClass: b.TEXCLASS.REL
            });
            var j = b.munderover(s);
            j.SetData(j.over, b.mpadded(q).With(m).With({
                voffset: ".15em"
            }));
            if (p) {
                p = h.Parse(p, this.stack.env).mml();
                j.SetData(j.under, b.mpadded(p).With(m).With({
                    voffset: "-.24em"
                }))
            }
            this.Push(j.With({
                subsupOK: true
            }))
        },
        GetDelimiterArg: function (i) {
            var j = this.trimSpaces(this.GetArgument(i));
            if (j == "") {
                return null
            }
            if (j in d.delimiter) {
                return j
            }
            h.Error(["MissingOrUnrecognizedDelim", "Missing or unrecognized delimiter for %1", i])
        },
        GetStar: function () {
            var i = (this.GetNext() === "*");
            if (i) {
                this.i++
            }
            return i
        }
    });
    f.Augment({
        autoTag: function () {
            var j = this.global;
            if (!j.notag) {
                g.number++;
                j.tagID = a.formatNumber(g.number.toString());
                var i = h.Parse("\\text{" + a.formatTag(j.tagID) + "}", {}).mml();
                j.tag = b.mtd(i).With({
                    id: a.formatID(j.tagID)
                })
            }
        },
        getTag: function () {
            var m = this.global
                , k = m.tag;
            m.tagged = true;
            if (m.label) {
                if (a.useLabelIds) {
                    k.id = a.formatID(m.label)
                }
                g.eqlabels[m.label] = {
                    tag: m.tagID,
                    id: k.id
                }
            }
            if (document.getElementById(k.id) || g.IDs[k.id] || g.eqIDs[k.id]) {
                var l = 0, j;
                do {
                    l++;
                    j = k.id + "_" + l
                } while (document.getElementById(j) || g.IDs[j] || g.eqIDs[j]);
                k.id = j;
                if (m.label) {
                    g.eqlabels[m.label].id = j
                }
            }
            g.eqIDs[k.id] = 1;
            this.clearTag();
            return k
        },
        clearTag: function () {
            var i = this.global;
            delete i.tag;
            delete i.tagID;
            delete i.label
        },
        fixInitialMO: function (l) {
            for (var k = 0, j = l.length; k < j; k++) {
                if (l[k] && (l[k].type !== "mspace" && (l[k].type !== "texatom" || (l[k].data[0] && l[k].data[0].data.length)))) {
                    if (l[k].isEmbellished()) {
                        l.unshift(b.mi())
                    }
                    break
                }
            }
        }
    });
    f.multline = f.array.Subclass({
        type: "multline",
        Init: function (j, i) {
            this.SUPER(arguments).Init.apply(this);
            this.numbered = (j && a.autoNumber !== "none");
            this.save = {
                notag: i.global.notag
            };
            i.global.tagged = !j && !i.global.forcetag
        },
        EndEntry: function () {
            if (this.table.length) {
                this.fixInitialMO(this.data)
            }
            var i = b.mtd.apply(b, this.data);
            if (this.data.shove) {
                i.columnalign = this.data.shove
            }
            this.row.push(i);
            this.data = []
        },
        EndRow: function () {
            if (this.row.length != 1) {
                h.Error(["MultlineRowsOneCol", "The rows within the %1 environment must have exactly one column", "multline"])
            }
            this.table.push(this.row);
            this.row = []
        },
        EndTable: function () {
            this.SUPER(arguments).EndTable.call(this);
            if (this.table.length) {
                var k = this.table.length - 1, n, l = -1;
                if (!this.table[0][0].columnalign) {
                    this.table[0][0].columnalign = b.ALIGN.LEFT
                }
                if (!this.table[k][0].columnalign) {
                    this.table[k][0].columnalign = b.ALIGN.RIGHT
                }
                if (!this.global.tag && this.numbered) {
                    this.autoTag()
                }
                if (this.global.tag && !this.global.notags) {
                    l = (this.arraydef.side === "left" ? 0 : this.table.length - 1);
                    this.table[l] = [this.getTag()].concat(this.table[l])
                }
                for (n = 0,
                    k = this.table.length; n < k; n++) {
                    var j = (n === l ? b.mlabeledtr : b.mtr);
                    this.table[n] = j.apply(b, this.table[n])
                }
            }
            this.global.notag = this.save.notag
        }
    });
    f.AMSarray = f.array.Subclass({
        type: "AMSarray",
        Init: function (l, k, j, i) {
            this.SUPER(arguments).Init.apply(this);
            this.numbered = (k && a.autoNumber !== "none");
            this.save = {
                notags: i.global.notags,
                notag: i.global.notag
            };
            i.global.notags = (j ? null : l);
            i.global.tagged = !k && !i.global.forcetag
        },
        EndEntry: function () {
            if (this.row.length % 2 === 1) {
                this.fixInitialMO(this.data)
            }
            this.row.push(b.mtd.apply(b, this.data));
            this.data = []
        },
        EndRow: function () {
            var i = b.mtr;
            if (!this.global.tag && this.numbered) {
                this.autoTag()
            }
            if (this.global.tag && !this.global.notags) {
                this.row = [this.getTag()].concat(this.row);
                i = b.mlabeledtr
            } else {
                this.clearTag()
            }
            if (this.numbered) {
                delete this.global.notag
            }
            this.table.push(i.apply(b, this.row));
            this.row = []
        },
        EndTable: function () {
            this.SUPER(arguments).EndTable.call(this);
            this.global.notags = this.save.notags;
            this.global.notag = this.save.notag
        }
    });
    f.start.Augment({
        oldCheckItem: f.start.prototype.checkItem,
        checkItem: function (k) {
            if (k.type === "stop") {
                var i = this.mmlData()
                    , j = this.global;
                if (g.display && !j.tag && !j.tagged && !j.isInner && (a.autoNumber === "all" || j.forcetag)) {
                    this.autoTag()
                }
                if (j.tag) {
                    var m = [this.getTag(), b.mtd(i)];
                    var l = {
                        side: h.config.TagSide,
                        minlabelspacing: h.config.TagIndent,
                        displaystyle: "inherit"
                    };
                    i = b.mtable(b.mlabeledtr.apply(b, m)).With(l)
                }
                return f.mml(i)
            }
            return this.oldCheckItem.call(this, k)
        }
    });
    h.prefilterHooks.Add(function (i) {
        g.display = i.display;
        g.number = g.startNumber;
        g.eqlabels = {};
        g.eqIDs = {};
        g.badref = false;
        if (g.refUpdate) {
            g.number = i.script.MathJax.startNumber
        }
    });
    h.postfilterHooks.Add(function (i) {
        i.script.MathJax.startNumber = g.startNumber;
        g.startNumber = g.number;
        MathJax.Hub.Insert(g.IDs, g.eqIDs);
        MathJax.Hub.Insert(g.labels, g.eqlabels);
        if (g.badref && !i.math.texError) {
            g.refs.push(i.script)
        }
    }, 100);
    MathJax.Hub.Register.MessageHook("Begin Math Input", function () {
        g.refs = [];
        g.refUpdate = false
    });
    MathJax.Hub.Register.MessageHook("End Math Input", function (l) {
        if (g.refs.length) {
            g.refUpdate = true;
            for (var k = 0, j = g.refs.length; k < j; k++) {
                g.refs[k].MathJax.state = ElementJax.STATE.UPDATE
            }
            return MathJax.Hub.processInput({
                scripts: g.refs,
                start: new Date().getTime(),
                i: 0,
                j: 0,
                jax: {},
                jaxIDs: []
            })
        }
        return null
    });
    h.resetEquationNumbers = function (j, i) {
        g.startNumber = (j || 0);
        if (!i) {
            g.labels = {};
            g.IDs = {}
        }
    }
        ;
    MathJax.Hub.Startup.signal.Post("TeX AMSmath Ready")
});
MathJax.Ajax.loadComplete("[MathJax]/extensions/TeX/AMSmath.js");

MathJax.Extension["TeX/AMSsymbols"] = {
    version: "2.7.2"
};
MathJax.Hub.Register.StartupHook("TeX Jax Ready", function () {
    var a = MathJax.ElementJax.mml
        , b = MathJax.InputJax.TeX.Definitions;
    b.Add({
        mathchar0mi: {
            digamma: "03DD",
            varkappa: "03F0",
            varGamma: ["0393", {
                mathvariant: a.VARIANT.ITALIC
            }],
            varDelta: ["0394", {
                mathvariant: a.VARIANT.ITALIC
            }],
            varTheta: ["0398", {
                mathvariant: a.VARIANT.ITALIC
            }],
            varLambda: ["039B", {
                mathvariant: a.VARIANT.ITALIC
            }],
            varXi: ["039E", {
                mathvariant: a.VARIANT.ITALIC
            }],
            varPi: ["03A0", {
                mathvariant: a.VARIANT.ITALIC
            }],
            varSigma: ["03A3", {
                mathvariant: a.VARIANT.ITALIC
            }],
            varUpsilon: ["03A5", {
                mathvariant: a.VARIANT.ITALIC
            }],
            varPhi: ["03A6", {
                mathvariant: a.VARIANT.ITALIC
            }],
            varPsi: ["03A8", {
                mathvariant: a.VARIANT.ITALIC
            }],
            varOmega: ["03A9", {
                mathvariant: a.VARIANT.ITALIC
            }],
            beth: "2136",
            gimel: "2137",
            daleth: "2138",
            backprime: ["2035", {
                variantForm: true
            }],
            hslash: "210F",
            varnothing: ["2205", {
                variantForm: true
            }],
            blacktriangle: "25B4",
            triangledown: ["25BD", {
                variantForm: true
            }],
            blacktriangledown: "25BE",
            square: "25FB",
            Box: "25FB",
            blacksquare: "25FC",
            lozenge: "25CA",
            Diamond: "25CA",
            blacklozenge: "29EB",
            circledS: ["24C8", {
                mathvariant: a.VARIANT.NORMAL
            }],
            bigstar: "2605",
            sphericalangle: "2222",
            measuredangle: "2221",
            nexists: "2204",
            complement: "2201",
            mho: "2127",
            eth: ["00F0", {
                mathvariant: a.VARIANT.NORMAL
            }],
            Finv: "2132",
            diagup: "2571",
            Game: "2141",
            diagdown: "2572",
            Bbbk: ["006B", {
                mathvariant: a.VARIANT.DOUBLESTRUCK
            }],
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
            centerdot: ["22C5", {
                variantForm: true
            }],
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
            thicksim: ["223C", {
                variantForm: true
            }],
            backsimeq: "22CD",
            thickapprox: ["2248", {
                variantForm: true
            }],
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
            smallsmile: ["2323", {
                variantForm: true
            }],
            shortmid: ["2223", {
                variantForm: true
            }],
            smallfrown: ["2322", {
                variantForm: true
            }],
            shortparallel: ["2225", {
                variantForm: true
            }],
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
            vartriangle: ["25B3", {
                variantForm: true
            }],
            Join: "22C8",
            nless: "226E",
            ngtr: "226F",
            nleq: "2270",
            ngeq: "2271",
            nleqslant: ["2A87", {
                variantForm: true
            }],
            ngeqslant: ["2A88", {
                variantForm: true
            }],
            nleqq: ["2270", {
                variantForm: true
            }],
            ngeqq: ["2271", {
                variantForm: true
            }],
            lneq: "2A87",
            gneq: "2A88",
            lneqq: "2268",
            gneqq: "2269",
            lvertneqq: ["2268", {
                variantForm: true
            }],
            gvertneqq: ["2269", {
                variantForm: true
            }],
            lnsim: "22E6",
            gnsim: "22E7",
            lnapprox: "2A89",
            gnapprox: "2A8A",
            nprec: "2280",
            nsucc: "2281",
            npreceq: ["22E0", {
                variantForm: true
            }],
            nsucceq: ["22E1", {
                variantForm: true
            }],
            precneqq: "2AB5",
            succneqq: "2AB6",
            precnsim: "22E8",
            succnsim: "22E9",
            precnapprox: "2AB9",
            succnapprox: "2ABA",
            nsim: "2241",
            ncong: "2246",
            nshortmid: ["2224", {
                variantForm: true
            }],
            nshortparallel: ["2226", {
                variantForm: true
            }],
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
            nsubseteqq: ["2288", {
                variantForm: true
            }],
            nsupseteqq: ["2289", {
                variantForm: true
            }],
            subsetneq: "228A",
            supsetneq: "228B",
            varsubsetneq: ["228A", {
                variantForm: true
            }],
            varsupsetneq: ["228B", {
                variantForm: true
            }],
            subsetneqq: "2ACB",
            supsetneqq: "2ACC",
            varsubsetneqq: ["2ACB", {
                variantForm: true
            }],
            varsupsetneqq: ["2ACC", {
                variantForm: true
            }],
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
            rightleftharpoons: ["21CC", {
                variantForm: true
            }],
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
    MathJax.Hub.Startup.signal.Post("TeX AMSsymbols Ready")
});
MathJax.Ajax.loadComplete("[MathJax]/extensions/TeX/AMSsymbols.js");

(function (a, e, b, f) {
    var c = b.config.menuSettings;
    var d = MathJax.Extension.AssistiveMML = {
        version: "2.7.2",
        config: b.CombineConfig("AssistiveMML", {
            disabled: false,
            styles: {
                ".MJX_Assistive_MathML": {
                    position: "absolute!important",
                    top: 0,
                    left: 0,
                    clip: (b.Browser.isMSIE && (document.documentMode || 0) < 8 ? "rect(1px 1px 1px 1px)" : "rect(1px, 1px, 1px, 1px)"),
                    padding: "1px 0 0 0!important",
                    border: "0!important",
                    height: "1px!important",
                    width: "1px!important",
                    overflow: "hidden!important",
                    display: "block!important",
                    "-webkit-touch-callout": "none",
                    "-webkit-user-select": "none",
                    "-khtml-user-select": "none",
                    "-moz-user-select": "none",
                    "-ms-user-select": "none",
                    "user-select": "none"
                },
                ".MJX_Assistive_MathML.MJX_Assistive_MathML_Block": {
                    width: "100%!important"
                }
            }
        }),
        Config: function () {
            if (!this.config.disabled && c.assistiveMML == null) {
                b.Config({
                    menuSettings: {
                        assistiveMML: true
                    }
                })
            }
            a.Styles(this.config.styles);
            b.Register.MessageHook("End Math", function (g) {
                if (c.assistiveMML) {
                    return d.AddAssistiveMathML(g[1])
                }
            })
        },
        AddAssistiveMathML: function (g) {
            var h = {
                jax: b.getAllJax(g),
                i: 0,
                callback: CallbackUtil.Create({})
            };
            this.HandleMML(h);
            return h.callback
        },
        RemoveAssistiveMathML: function (k) {
            var h = b.getAllJax(k), l;
            for (var j = 0, g = h.length; j < g; j++) {
                l = document.getElementById(h[j].inputID + "-Frame");
                if (l && l.getAttribute("data-mathml")) {
                    l.removeAttribute("data-mathml");
                    if (l.lastChild && l.lastChild.className.match(/MJX_Assistive_MathML/)) {
                        l.removeChild(l.lastChild)
                    }
                }
            }
        },
        HandleMML: function (l) {
            var g = l.jax.length, h, i, n, j;
            while (l.i < g) {
                h = l.jax[l.i];
                n = document.getElementById(h.inputID + "-Frame");
                if (h.outputJax !== "NativeMML" && h.outputJax !== "PlainSource" && n && !n.getAttribute("data-mathml")) {
                    try {
                        i = h.root.toMathML("").replace(/\n */g, "").replace(/<!--.*?-->/g, "")
                    } catch (k) {
                        if (!k.restart) {
                            throw k
                        }
                        return CallbackUtil.After(["HandleMML", this, l], k.restart)
                    }
                    n.setAttribute("data-mathml", i);
                    j = f.addElement(n, "span", {
                        isMathJax: true,
                        unselectable: "on",
                        className: "MJX_Assistive_MathML" + (h.root.Get("display") === "block" ? " MJX_Assistive_MathML_Block" : "")
                    });
                    try {
                        j.innerHTML = i
                    } catch (k) { }
                    n.style.position = "relative";
                    n.setAttribute("role", "presentation");
                    n.firstChild.setAttribute("aria-hidden", "true");
                    j.setAttribute("role", "presentation")
                }
                l.i++
            }
            l.callback()
        }
    };
    b.Startup.signal.Post("AssistiveMML Ready")
}
)(MathJax.Ajax, MathJax.Callback, MathJax.Hub, MathJax.HTML);
CallbackUtil.Queue(
    ["Require", MathJax.Ajax, "[MathJax]/extensions/toMathML.js"],
    ["loadComplete", MathJax.Ajax, "[MathJax]/extensions/AssistiveMML.js"],
    function () {
        MathJax.Hub.Register.StartupHook("End Config", ["Config", MathJax.Extension.AssistiveMML]);
    }
);

!function (a, b) {
    var c, d, e = a.config.menuSettings, f = Function.prototype.bind ? function (a, b) {
        return a.bind(b)
    }
        : function (a, b) {
            return function () {
                a.apply(b, arguments)
            }
        }
        , g = Object.keys || function (a) {
            var b = [];
            for (var c in a)
                a.hasOwnProperty(c) && b.push(c);
            return b
        }
        , h = MathJax.Ajax.config.path;
    h.a11y || (h.a11y = a.config.root + "/extensions/a11y");
    var i = b["accessibility-menu"] = {
        version: "1.2.3",
        prefix: "",
        defaults: {},
        modules: [],
        MakeOption: function (a) {
            return i.prefix + a
        },
        GetOption: function (a) {
            return e[i.MakeOption(a)]
        },
        AddDefaults: function () {
            for (var a, b = g(i.defaults), c = 0; a = b[c]; c++) {
                var d = i.MakeOption(a);
                void 0 === e[d] && (e[d] = i.defaults[a])
            }
        },
        AddMenu: function () {
            for (var a, b = Array(this.modules.length), e = 0; a = this.modules[e]; e++)
                b[e] = a.placeHolder;
            var f = d.FindId("Accessibility");
            if (f)
                b.unshift(c.RULE()),
                    f.submenu.items.push.apply(f.submenu.items, b);
            else {
                var g = (d.FindId("Settings", "Renderer") || {}).submenu;
                g && (b.unshift(c.RULE()),
                    b.unshift(g.items.pop()),
                    b.unshift(g.items.pop())),
                    b.unshift("Accessibility");
                var f = c.SUBMENU.apply(c.SUBMENU, b)
                    , h = d.IndexOfId("Locale");
                h ? d.items.splice(h, 0, f) : d.items.push(c.RULE(), f)
            }
        },
        Register: function (a) {
            i.defaults[a.option] = !1,
                i.modules.push(a)
        },
        Startup: function () {
            c = MathJax.Menu.ITEM,
                d = MathJax.Menu.menu;
            for (var a, b = 0; a = this.modules[b]; b++)
                a.CreateMenu();
            this.AddMenu()
        },
        LoadExtensions: function () {
            for (var b, c = [], d = 0; b = this.modules[d]; d++)
                e[b.option] && c.push(b.module);
            return c.length ? a.Startup.loadArray(c) : null
        }
    }
        , j = MathJax.Extension.ModuleLoader = MathJax.Object.Subclass({
            option: "",
            name: ["", ""],
            module: "",
            placeHolder: null,
            submenu: !1,
            extension: null,
            Init: function (a, b, c, d, e) {
                this.option = a,
                    this.name = [b.replace(/ /g, ""), b],
                    this.module = c,
                    this.extension = d,
                    this.submenu = e || !1
            },
            CreateMenu: function () {
                var a = f(this.Load, this);
                this.submenu ? this.placeHolder = c.SUBMENU(this.name, c.CHECKBOX(["Activate", "Activate"], i.MakeOption(this.option), {
                    action: a
                }), c.RULE(), c.COMMAND(["OptionsWhenActive", "(Options when Active)"], null, {
                    disabled: !0
                })) : this.placeHolder = c.CHECKBOX(this.name, i.MakeOption(this.option), {
                    action: a
                })
            },
            Load: function () {
                a.Queue(["Require", MathJax.Ajax, this.module, ["Enable", this]])
            },
            Enable: function (a) {
                var b = MathJax.Extension[this.extension];
                b && (b.Enable(!0, !0),
                    MathJax.Menu.saveCookie())
            }
        });
    i.Register(j("collapsible", "Collapsible Math", "[a11y]/collapsible.js", "collapsible")),
        i.Register(j("autocollapse", "Auto Collapse", "[a11y]/auto-collapse.js", "auto-collapse")),
        i.Register(j("explorer", "Explorer", "[a11y]/explorer.js", "explorer", !0)),
        i.AddDefaults(),
        a.Register.StartupHook("End Extensions", function () {
            a.Register.StartupHook("MathMenu Ready", function () {
                i.Startup(),
                    a.Startup.signal.Post("Accessibility Menu Ready")
            }, 5)
        }, 5),
        MathJax.Hub.Register.StartupHook("End Cookie", function () {
            CallbackUtil.Queue(["LoadExtensions", i], ["loadComplete", MathJax.Ajax, "[a11y]/accessibility-menu.js"])
        })
}(MathJax.Hub, MathJax.Extension);
MathJax.Ajax.loadComplete("[MathJax]/config/TeX-MML-AM_CHTML.js");
