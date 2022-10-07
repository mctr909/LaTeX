///<reference path="../MathJax.js"/>

MathJax.Ajax.Preloading(
    "[MathJax]/jax/output/CommonHTML/config.js",
    "[MathJax]/extensions/tex2jax.js",
    "[MathJax]/extensions/TeX/AMSmath.js",
    "[MathJax]/extensions/TeX/AMSsymbols.js",
    "[MathJax]/extensions/a11y/accessibility-menu.js"
);

MathJax.Hub.Config({ extensions: ['[a11y]/accessibility-menu.js'] });

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
                    c = MathJax.HTML.ElementSpan(null, c);
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
            c = MathJax.HTML.ElementSpan({
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
MathJax.Extension.tex2jax = new Tex2Jax();
MathJax.Hub.Register.PreProcessor(["PreProcess", MathJax.Extension.tex2jax]);
MathJax.Ajax.loadComplete("[MathJax]/extensions/tex2jax.js");

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
    var mml = MathJax.ElementJax.mml;
    var tex = MathJax.InputJax.TeX;
    var amsMath = MathJax.Extension["TeX/AMSmath"];
    var stackItem = tex.Stack.Item;
    var eqNumbers = tex.config.equationNumbers;
    var d = tex.Definitions;
    var c = function (k) {
        var n = [];
        for (var l = 0, j = k.length; l < j; l++) {
            ///TODO: TexParser
            //n[l] = tex.Parse.prototype.Em(k[l]);
            n[l] = tex.Parse.Em(k[l]);
        }
        return n.join(" ")
    };
    d.Add({
        mathchar0mo: {
            iiiint: ["2A0C", {
                texClass: mml.TEXCLASS.OP
            }]
        },
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
            equation: ["EquationBegin", "Equation", true],
            "equation*": ["EquationBegin", "EquationStar", false],
            eqnarray: ["AMSarray", null, true, true, "rcl", "0 " + mml.LENGTH.THICKMATHSPACE, ".5em"],
            "eqnarray*": ["AMSarray", null, false, true, "rcl", "0 " + mml.LENGTH.THICKMATHSPACE, ".5em"]
        },
        delimiter: {
            "\\lvert": ["007C", {
                texClass: mml.TEXCLASS.OPEN
            }],
            "\\rvert": ["007C", {
                texClass: mml.TEXCLASS.CLOSE
            }],
            "\\lVert": ["2016", {
                texClass: mml.TEXCLASS.OPEN
            }],
            "\\rVert": ["2016", {
                texClass: mml.TEXCLASS.CLOSE
            }]
        }
    }, null, true);

    stackItem.__Augment({
        autoTag: function () {
            var j = this.global;
            if (!j.notag) {
                amsMath.number++;
                j.tagID = eqNumbers.formatNumber(amsMath.number.toString());
                var i = tex.Parse("\\text{" + eqNumbers.formatTag(j.tagID) + "}", {}).mml();
                j.tag = mml.mtd(i).With({
                    id: eqNumbers.formatID(j.tagID)
                })
            }
        },
        getTag: function () {
            var m = this.global
                , k = m.tag;
            m.tagged = true;
            if (m.label) {
                if (eqNumbers.useLabelIds) {
                    k.id = eqNumbers.formatID(m.label)
                }
                amsMath.eqlabels[m.label] = {
                    tag: m.tagID,
                    id: k.id
                }
            }
            if (document.getElementById(k.id) || amsMath.IDs[k.id] || amsMath.eqIDs[k.id]) {
                var l = 0, j;
                do {
                    l++;
                    j = k.id + "_" + l
                } while (document.getElementById(j) || amsMath.IDs[j] || amsMath.eqIDs[j]);
                k.id = j;
                if (m.label) {
                    amsMath.eqlabels[m.label].id = j
                }
            }
            amsMath.eqIDs[k.id] = 1;
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
                        l.unshift(mml.mi())
                    }
                    break
                }
            }
        }
    });
    stackItem.multline = stackItem.array.__Subclass({
        type: "multline",
        __Init: function (j, i) {
            this.__SUPER(arguments).__Init.apply(this);
            this.numbered = (j && eqNumbers.autoNumber !== "none");
            this.save = {
                notag: i.global.notag
            };
            i.global.tagged = !j && !i.global.forcetag
        },
        EndEntry: function () {
            if (this.table.length) {
                this.fixInitialMO(this.data)
            }
            var i = mml.mtd.apply(mml, this.data);
            if (this.data.shove) {
                i.columnalign = this.data.shove
            }
            this.row.push(i);
            this.data = []
        },
        EndRow: function () {
            if (this.row.length != 1) {
                tex.Error(["MultlineRowsOneCol", "The rows within the %1 environment must have exactly one column", "multline"])
            }
            this.table.push(this.row);
            this.row = []
        },
        EndTable: function () {
            this.__SUPER(arguments).EndTable.call(this);
            if (this.table.length) {
                var k = this.table.length - 1, n, l = -1;
                if (!this.table[0][0].columnalign) {
                    this.table[0][0].columnalign = mml.ALIGN.LEFT
                }
                if (!this.table[k][0].columnalign) {
                    this.table[k][0].columnalign = mml.ALIGN.RIGHT
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
                    var j = (n === l ? mml.mlabeledtr : mml.mtr);
                    this.table[n] = j.apply(mml, this.table[n])
                }
            }
            this.global.notag = this.save.notag
        }
    });
    stackItem.AMSarray = stackItem.array.__Subclass({
        type: "AMSarray",
        __Init: function (l, k, j, i) {
            this.__SUPER(arguments).__Init.apply(this);
            this.numbered = (k && eqNumbers.autoNumber !== "none");
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
            this.row.push(mml.mtd.apply(mml, this.data));
            this.data = []
        },
        EndRow: function () {
            var i = mml.mtr;
            if (!this.global.tag && this.numbered) {
                this.autoTag()
            }
            if (this.global.tag && !this.global.notags) {
                this.row = [this.getTag()].concat(this.row);
                i = mml.mlabeledtr
            } else {
                this.clearTag()
            }
            if (this.numbered) {
                delete this.global.notag
            }
            this.table.push(i.apply(mml, this.row));
            this.row = []
        },
        EndTable: function () {
            this.__SUPER(arguments).EndTable.call(this);
            this.global.notags = this.save.notags;
            this.global.notag = this.save.notag
        }
    });
    stackItem.start.__Augment({
        oldCheckItem: stackItem.start.prototype.checkItem,
        checkItem: function (k) {
            if (k.type === "stop") {
                var i = this.mmlData()
                    , j = this.global;
                if (amsMath.display && !j.tag && !j.tagged && !j.isInner && (eqNumbers.autoNumber === "all" || j.forcetag)) {
                    this.autoTag()
                }
                if (j.tag) {
                    var m = [this.getTag(), mml.mtd(i)];
                    var l = {
                        side: tex.config.TagSide,
                        minlabelspacing: tex.config.TagIndent,
                        displaystyle: "inherit"
                    };
                    i = mml.mtable(mml.mlabeledtr.apply(mml, m)).With(l)
                }
                return stackItem.mml(i)
            }
            return this.oldCheckItem.call(this, k)
        }
    });
    tex.prefilterHooks.Add(function (i) {
        amsMath.display = i.display;
        amsMath.number = amsMath.startNumber;
        amsMath.eqlabels = {};
        amsMath.eqIDs = {};
        amsMath.badref = false;
        if (amsMath.refUpdate) {
            amsMath.number = i.script.MathJax.startNumber
        }
    });
    tex.postfilterHooks.Add(function (i) {
        i.script.MathJax.startNumber = amsMath.startNumber;
        amsMath.startNumber = amsMath.number;
        MathJax.Hub.Insert(amsMath.IDs, amsMath.eqIDs);
        MathJax.Hub.Insert(amsMath.labels, amsMath.eqlabels);
        if (amsMath.badref && !i.math.texError) {
            amsMath.refs.push(i.script)
        }
    }, 100);
    MathJax.Hub.Register.MessageHook("Begin Math Input", function () {
        amsMath.refs = [];
        amsMath.refUpdate = false
    });
    MathJax.Hub.Register.MessageHook("End Math Input", function (l) {
        if (amsMath.refs.length) {
            amsMath.refUpdate = true;
            for (var k = 0, j = amsMath.refs.length; k < j; k++) {
                amsMath.refs[k].MathJax.state = ElementJax.STATE.UPDATE
            }
            return MathJax.Hub.processInput({
                scripts: amsMath.refs,
                start: new Date().getTime(),
                i: 0,
                j: 0,
                jax: {},
                jaxIDs: []
            })
        }
        return null
    });
    tex.resetEquationNumbers = function (j, i) {
        amsMath.startNumber = (j || 0);
        if (!i) {
            amsMath.labels = {};
            amsMath.IDs = {}
        }
    };
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

!function (a, b) {
    var c, d, e = a.config.menuSettings;
    var f = Function.prototype.bind ? function (a, b) {
        return a.bind(b)
    } : function (a, b) {
        return function () {
            a.apply(b, arguments);
        };
    };
    var g = Object.keys || function (a) {
        var b = [];
        for (var c in a) {
            a.hasOwnProperty(c) && b.push(c);
        }
        return b;
    };
    var h = MathJax.Ajax.config.path;
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
    };
    var j = MathJax.Extension.ModuleLoader = MathJax.Object.__Subclass({
        option: "",
        name: ["", ""],
        module: "",
        placeHolder: null,
        submenu: !1,
        extension: null,
        __Init: function (a, b, c, d, e) {
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
MathJax.Ajax.loadComplete("[MathJax]/config/TeX-CHTML.js");
