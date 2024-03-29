const NAME_TAG = "MathJax";
const __TAG = "[" + NAME_TAG + "]";

/** @type{MATHJAX} */
let MathJax = null;
let EMPTY = [];
let CALLBACK = [];

class MATHJAX {
    constructor() {
        this.isPacked = true;
        this.version = "2.7.2";
        this.fileversion = "2.7.2";
        this.cdnVersion = "2.7.2";
        this.cdnFileVersions = {};
        /** @type{Ajax} */
        this.Ajax = null;
        /** @type{HTML} */
        this.HTML = null;
        /** @type{Localization} */
        this.Localization = null;
        /** @type{Message} */
        this.Message = null;
        /** @type{Hub} */
        this.Hub = null;
        /** @type{Extension} */
        this.Extension = {};
        /** @type{ElementJax} */
        this.ElementJax = null;
        this.InputJax = null;
        this.OutputJax = null;
        /** @type{MathJaxObject} */
        this.Object = null;
        this.Menu = null;
    }
}
class Extension {
    constructor() {
        /** @type{Tex2Jax} */
        this.tex2jax = null;
        /** @type{MathMenu} */
        this.MathMenu = null;
        /** @type{MathZoom} */
        this.MathZoom = null;
        /** @type{MathEvents} */
        this.MathEvents = null;
    }
}
class MathEvents {
    constructor() {
        this.version = "2.7.2";
        this.safariContextMenuBug = false;
        this.operaPositionBug = false;
        /** @type{HTMLSpanElement} */
        this.topImg = null;
        /** @type{Events} */
        this.Event = null;
        /** @type{Hover} */
        this.Hover = null;
        /** @type{Touch} */
        this.Touch = null;
    }
}

class HTML {
    constructor() {
        this.Cookie = new Cookie();
    }
    Element(tagName, f, e) {
        var g = document.createElement(tagName), h;
        if (f) {
            if (f.hasOwnProperty("style")) {
                var c = f.style;
                f.style = {};
                for (h in c) {
                    if (c.hasOwnProperty(h)) {
                        f.style[h.replace(/-([a-z])/g, this.ucMatch)] = c[h];
                    }
                }
            }
            MathJax.Hub.Insert(g, f);
            for (h in f) {
                if (h === "role" || h.substr(0, 5) === "aria-") {
                    g.setAttribute(h, f[h]);
                }
            }
        }
        if (e) {
            if (!MathJax.Object.isArray(e)) {
                e = [e];
            }
            for (var b = 0, a = e.length; b < a; b++) {
                if (MathJax.Object.isArray(e[b])) {
                    g.appendChild(this.Element(e[b][0], e[b][1], e[b][2]));
                } else {
                    if (tagName === "script") {
                        this.setScript(g, e[b]);
                    } else {
                        g.appendChild(document.createTextNode(e[b]));
                    }
                }
            }
        }
        return g;
    }
    /**
     * @param {*} f 
     * @param {*} e 
     * @returns {HTMLSpanElement}
     */
    ElementSpan(f, e) {
        return this.Element("span", f, e);
    }
    ucMatch(a, b) {
        return b.toUpperCase();
    }
    addElement(b, a, d, c) {
        return b.appendChild(this.Element(a, d, c));
    }
    TextNode(a) {
        return document.createTextNode(a);
    }
    addText(a, b) {
        return a.appendChild(this.TextNode(b));
    }
    setScript(a, b) {
        if (this.setScriptBug) {
            a.text = b;
        } else {
            while (a.firstChild) {
                a.removeChild(a.firstChild);
            }
            this.addText(a, b);
        }
    }
    getScript(a) {
        var b = (a.text === "" ? a.innerHTML : a.text);
        return b.replace(/^\s+/, "").replace(/\s+$/, "");
    }
}
class Cookie {
    constructor() {
        this.prefix = "mjx";
        this.expires = 365;
    }
    Set(a, e) {
        var d = [];
        if (e) {
            for (var g in e) {
                if (e.hasOwnProperty(g)) {
                    d.push(g + ":" + e[g].toString().replace(/&/g, "&&"));
                }
            }
        }
        var b = this.prefix + "." + a + "=" + escape(d.join("&;"));
        if (this.expires) {
            var f = new Date();
            f.setDate(f.getDate() + this.expires);
            b += "; expires=" + f.toGMTString();
        }
        try {
            document.cookie = b + "; path=/";
        } catch (c) { }
    }
    Get(a, d) {
        if (!d) {
            d = {};
        }
        var g = new RegExp("(?:^|;\\s*)" + this.prefix + "\\." + a + "=([^;]*)(?:;|$)");
        var f;
        try {
            f = g.exec(document.cookie);
        } catch (c) { }
        if (f && f[1] !== "") {
            var j = unescape(f[1]).split("&;");
            for (var e = 0, b = j.length; e < b; e++) {
                f = j[e].match(/([^:]+):(.*)/);
                var h = f[2].replace(/&&/g, "&");
                if (h === "true") {
                    h = true;
                } else {
                    if (h === "false") {
                        h = false;
                    } else {
                        if (h.match(/^-?(\d+(\.\d+)?|\.\d+)$/)) {
                            h = parseFloat(h);
                        }
                    }
                }
                d[f[1]] = h;
            }
        }
        return d;
    }
}
class Localization {
    constructor() {
        this.locale = "en";
        this.directory = "[MathJax]/localization";
        this.pattern = /%(\d+|\{\d+\}|\{[a-z]+:\%\d+(?:\|(?:%\{\d+\}|%.|[^\}])*)+\}|.)/g;
        this.markdownPattern = /(%.)|(\*{1,3})((?:%.|.)+?)\2|(`+)((?:%.|.)+?)\4|\[((?:%.|.)+?)\]\(([^\s\)]+)\)/;
        this.strings = {
            en: {
                menuTitle: "English",
                isLoaded: true
            }
        };
    }
    _(b, a) {
        if (MathJax.Object.isArray(a)) {
            return this.processSnippet(b, a);
        }
        return this.processString(this.lookupPhrase(b, a), [].slice.call(arguments, 2));
    }
    SPLIT(c, e) {
        if ("axb".split(/(x)/).length === 3) {
            return c.split(e);
        } else {
            var a = [], b, d = 0;
            e.lastIndex = 0;
            while ((b = e.exec(c))) {
                a.push(c.substr(d, b.index - d));
                a.push.apply(a, b.slice(1));
                d = b.index + b[0].length;
            }
            a.push(c.substr(d));
            return a;
        }
    }
    processString(l, p, g) {
        var j, e, o = MathJax.Object.isArray;
        for (j = 0, e = p.length; j < e; j++) {
            if (g && o(p[j])) {
                p[j] = this.processSnippet(g, p[j]);
            }
        }
        var f = this.SPLIT(l, this.pattern);
        for (j = 1, e = f.length; j < e; j += 2) {
            var q = f[j].charAt(0);
            if (q >= "0" && q <= "9") {
                f[j] = p[f[j] - 1];
                if (typeof f[j] === "number") {
                    f[j] = this.number(f[j]);
                }
            } else {
                if (q === "{") {
                    q = f[j].substr(1);
                    if (q >= "0" && q <= "9") {
                        f[j] = p[f[j].substr(1, f[j].length - 2) - 1];
                        if (typeof f[j] === "number") {
                            f[j] = this.number(f[j]);
                        }
                    } else {
                        var k = f[j].match(/^\{([a-z]+):%(\d+)\|(.*)\}$/);
                        if (k) {
                            if (k[1] === "plural") {
                                var d = p[k[2] - 1];
                                if (typeof d === "undefined") {
                                    f[j] = "???";
                                } else {
                                    d = this.plural(d) - 1;
                                    var h = k[3].replace(/(^|[^%])(%%)*%\|/g, "$1$2%\uEFEF").split(/\|/);
                                    if (d >= 0 && d < h.length) {
                                        f[j] = this.processString(h[d].replace(/\uEFEF/g, "|"), p, g);
                                    } else {
                                        f[j] = "???";
                                    }
                                }
                            } else {
                                f[j] = "%" + f[j];
                            }
                        }
                    }
                }
            }
            if (f[j] == null) {
                f[j] = "???";
            }
        }
        if (!g) {
            return f.join("");
        }
        var a = [], b = "";
        for (j = 0; j < e; j++) {
            b += f[j];
            j++;
            if (j < e) {
                if (o(f[j])) {
                    a.push(b);
                    a = a.concat(f[j]);
                    b = "";
                } else {
                    b += f[j];
                }
            }
        }
        if (b !== "") {
            a.push(b);
        }
        return a;
    }
    processSnippet(g, e) {
        var c = [];
        for (var d = 0, b = e.length; d < b; d++) {
            if (MathJax.Object.isArray(e[d])) {
                var f = e[d];
                if (typeof f[1] === "string") {
                    var h = f[0];
                    if (!MathJax.Object.isArray(h)) {
                        h = [g, h];
                    }
                    var a = this.lookupPhrase(h, f[1]);
                    c = c.concat(this.processMarkdown(a, f.slice(2), g));
                } else {
                    if (MathJax.Object.isArray(f[1])) {
                        c = c.concat(this.processSnippet.apply(this, f));
                    } else {
                        if (f.length >= 3) {
                            c.push([f[0], f[1], this.processSnippet(g, f[2])]);
                        } else {
                            c.push(e[d]);
                        }
                    }
                }
            } else {
                c.push(e[d]);
            }
        }
        return c;
    }
    processMarkdown(b, h, d) {
        var j = [], e;
        var c = b.split(this.markdownPattern);
        var g = c[0];
        for (var f = 1, a = c.length; f < a; f += 8) {
            if (c[f + 1]) {
                e = this.processString(c[f + 2], h, d);
                if (!MathJax.Object.isArray(e)) {
                    e = [e];
                }
                e = [["b", "i", "i"][c[f + 1].length - 1], {}, e];
                if (c[f + 1].length === 3) {
                    e = ["b", {}, e];
                }
            } else {
                if (c[f + 3]) {
                    e = this.processString(c[f + 4].replace(/^\s/, "").replace(/\s$/, ""), h, d);
                    if (!MathJax.Object.isArray(e)) {
                        e = [e];
                    }
                    e = ["code", {}, e];
                } else {
                    if (c[f + 5]) {
                        e = this.processString(c[f + 5], h, d);
                        if (!MathJax.Object.isArray(e)) {
                            e = [e];
                        }
                        e = ["a", {
                            href: this.processString(c[f + 6], h),
                            target: "_blank"
                        }, e];
                    } else {
                        g += c[f];
                        e = null;
                    }
                }
            }
            if (e) {
                j = this.concatString(j, g, h, d);
                j.push(e);
                g = "";
            }
            if (c[f + 7] !== "") {
                g += c[f + 7];
            }
        }
        j = this.concatString(j, g, h, d);
        return j;
    }
    concatString(a, c, b, d) {
        if (c != "") {
            c = this.processString(c, b, d);
            if (!MathJax.Object.isArray(c)) {
                c = [c];
            }
            a = a.concat(c);
        }
        return a;
    }
    lookupPhrase(f, a, d) {
        if (!d) {
            d = "_";
        }
        if (MathJax.Object.isArray(f)) {
            d = (f[0] || "_");
            f = (f[1] || "");
        }
        var c = this.loadDomain(d);
        if (c) {
            MathJax.Hub.RestartAfter(c);
        }
        var b = this.strings[this.locale];
        if (b) {
            if (b.domains && d in b.domains) {
                var e = b.domains[d];
                if (e.strings && f in e.strings) {
                    a = e.strings[f];
                }
            }
        }
        return a;
    }
    loadFile(b, d, e) {
        e = CallbackUtil.Create(e);
        b = (d.file || b);
        if (!b.match(/\.js$/)) {
            b += ".js";
        }
        if (!b.match(/^([a-z]+:|\[MathJax\])/)) {
            var a = (this.strings[this.locale].directory || this.directory + "/" + this.locale || "[MathJax]/localization/" + this.locale);
            b = a + "/" + b;
        }
        var c = MathJax.Ajax.Require(b, function () {
            d.isLoaded = true;
            return e();
        });
        return (c.called ? null : c);
    }
    loadDomain(c, e) {
        var b, a = this.strings[this.locale];
        if (a) {
            if (!a.isLoaded) {
                b = this.loadFile(this.locale, a);
                if (b) {
                    return CallbackUtil.Queue(b, ["loadDomain", this, c]).Push(e || {});
                }
            }
            if (a.domains && c in a.domains) {
                var d = a.domains[c];
                if (!d.isLoaded) {
                    b = this.loadFile(c, d);
                    if (b) {
                        return CallbackUtil.Queue(b).Push(e);
                    }
                }
            }
        }
        return CallbackUtil.Create(e)();
    }
    Try(a) {
        a = CallbackUtil.Create(a);
        a.autoReset = true;
        try {
            a();
        } catch (b) {
            if (!b.restart) {
                throw b;
            }
            CallbackUtil.After(["Try", this, a], b.restart);
        }
    }
    resetLocale(a) {
        if (!a) {
            return;
        }
        a = a.toLowerCase();
        while (!this.strings[a]) {
            var c = a.lastIndexOf("-");
            if (c === -1) {
                return;
            }
            a = a.substring(0, c);
        }
        var b = this.strings[a].remap;
        this.locale = b ? b : a;
    }
    setLocale(a) {
        this.resetLocale(a);
        if (MathJax.Menu) {
            this.loadDomain("MathMenu");
        }
    }
    addTranslation(b, e, c) {
        var d = this.strings[b], a = false;
        if (!d) {
            d = this.strings[b] = {};
            a = true;
        }
        if (!d.domains) {
            d.domains = {};
        }
        if (e) {
            if (!d.domains[e]) {
                d.domains[e] = {};
            }
            d = d.domains[e];
        }
        MathJax.Hub.Insert(d, c);
        if (a && MathJax.Menu.menu) {
            MathJax.Menu.CreateLocaleMenu();
        }
    }
    setCSS(b) {
        var a = this.strings[this.locale];
        if (a) {
            if (a.fontFamily) {
                b.style.fontFamily = a.fontFamily;
            }
            if (a.fontDirection) {
                b.style.direction = a.fontDirection;
                if (a.fontDirection === "rtl") {
                    b.style.textAlign = "right";
                }
            }
        }
        return b;
    }
    fontFamily() {
        var a = this.strings[this.locale];
        return (a ? a.fontFamily : null);
    }
    fontDirection() {
        var a = this.strings[this.locale];
        return (a ? a.fontDirection : null);
    }
    plural(b) {
        var a = this.strings[this.locale];
        if (a && a.plural) {
            return a.plural(b);
        }
        if (b == 1) {
            return 1;
        }
        return 2;
    }
    number(b) {
        var a = this.strings[this.locale];
        if (a && a.number) {
            return a.number(b);
        }
        return b;
    }
}
class Message {
    constructor() {
        this.ready = false;
        this.log = [{}];
        this.current = null;
        this.textNodeBug = (navigator.vendor === "Apple Computer, Inc." && typeof navigator.vendorSub === "undefined")
            || (window.hasOwnProperty && window.hasOwnProperty("konqueror"));
        this.styles = {
            "#MathJax_Message": {
                position: "fixed",
                left: "1px",
                bottom: "2px",
                "background-color": "#E6E6E6",
                border: "1px solid #959595",
                margin: "0px",
                padding: "2px 8px",
                "z-index": "102",
                color: "black",
                "font-size": "80%",
                width: "auto",
                "white-space": "nowrap"
            },
            "#MathJax_MSIE_Frame": {
                position: "absolute",
                top: 0,
                left: 0,
                width: "0px",
                "z-index": 101,
                border: "0px",
                margin: "0px",
                padding: "0px"
            }
        };
        this.browsers = {
            MSIE: function (a) {
                MathJax.Message.msieFixedPositionBug = ((document.documentMode || 0) < 7);
                if (MathJax.Message.msieFixedPositionBug) {
                    MathJax.Hub.config.styles["#MathJax_Message"].position = "absolute";
                }
                MathJax.Message.quirks = (document.compatMode === "BackCompat");
            },
            Chrome: function (a) {
                MathJax.Hub.config.styles["#MathJax_Message"].bottom = "1.5em";
                MathJax.Hub.config.styles["#MathJax_Message"].left = "1em";
            }
        };
    }
    Init(a) {
        if (a) {
            this.ready = true;
        }
        if (!document.body || !this.ready) {
            return false;
        }
        if (this.div && this.div.parentNode == null) {
            this.div = document.getElementById("MathJax_Message");
            if (this.div) {
                this.text = this.div.firstChild;
            }
        }
        if (!this.div) {
            var b = document.body;
            if (this.msieFixedPositionBug && window.attachEvent) {
                b = this.frame = this.addDiv(document.body);
                b.removeAttribute("id");
                b.style.position = "absolute";
                b.style.border = b.style.margin = b.style.padding = "0px";
                b.style.zIndex = "101";
                b.style.height = "0px";
                b = this.addDiv(b);
                b.id = "MathJax_MSIE_Frame";
                window.attachEvent("onscroll", this.MoveFrame);
                window.attachEvent("onresize", this.MoveFrame);
                this.MoveFrame();
            }
            this.div = this.addDiv(b);
            this.div.style.display = "none";
            this.text = this.div.appendChild(document.createTextNode(""));
        }
        return true;
    }
    addDiv(a) {
        var b = document.createElement("div");
        b.id = "MathJax_Message";
        if (a.firstChild) {
            a.insertBefore(b, a.firstChild);
        } else {
            a.appendChild(b);
        }
        return b;
    }
    MoveFrame() {
        var a = (MathJax.Message.quirks ? document.body : document.documentElement);
        var b = MathJax.Message.frame;
        b.style.left = a.scrollLeft + "px";
        b.style.top = a.scrollTop + "px";
        b.style.width = a.clientWidth + "px";
        b = b.firstChild;
        b.style.height = a.clientHeight + "px";
    }
    localize(a) {
        return MathJax.Localization._(a, a);
    }
    filterText(a, c, b) {
        if (MathJax.Hub.config.messageStyle === "simple") {
            if (b === "LoadFile") {
                if (!this.loading) {
                    this.loading = this.localize("Loading") + " ";
                }
                a = this.loading;
                this.loading += ".";
            } else {
                if (b === "ProcessMath") {
                    if (!this.processing) {
                        this.processing = this.localize("Processing") + " ";
                    }
                    a = this.processing;
                    this.processing += ".";
                } else {
                    if (b === "TypesetMath") {
                        if (!this.typesetting) {
                            this.typesetting = this.localize("Typesetting") + " ";
                        }
                        a = this.typesetting;
                        this.typesetting += ".";
                    }
                }
            }
        }
        return a;
    }
    clearCounts() {
        delete this.loading;
        delete this.processing;
        delete this.typesetting;
    }
    Set(c, e, b) {
        if (e == null) {
            e = this.log.length;
            this.log[e] = {};
        }
        var d = "";
        if (MathJax.Object.isArray(c)) {
            d = c[0];
            if (MathJax.Object.isArray(d)) {
                d = d[1];
            }
            try {
                c = MathJax.Localization._.apply(MathJax.Localization, c);
            } catch (a) {
                if (!a.restart) {
                    throw a;
                }
                if (!a.restart.called) {
                    if (this.log[e].restarted == null) {
                        this.log[e].restarted = 0;
                    }
                    this.log[e].restarted++;
                    delete this.log[e].cleared;
                    CallbackUtil.After(["Set", this, c, e, b], a.restart);
                    return e;
                }
            }
        }
        if (this.timer) {
            clearTimeout(this.timer);
            delete this.timer;
        }
        this.log[e].text = c;
        this.log[e].filteredText = c = this.filterText(c, e, d);
        if (typeof (this.log[e].next) === "undefined") {
            this.log[e].next = this.current;
            if (this.current != null) {
                this.log[this.current].prev = e;
            }
            this.current = e;
        }
        if (this.current === e && MathJax.Hub.config.messageStyle !== "none") {
            if (this.Init()) {
                if (this.textNodeBug) {
                    this.div.innerHTML = c;
                } else {
                    this.text.nodeValue = c;
                }
                this.div.style.display = "";
                if (this.status) {
                    window.status = "";
                    delete this.status;
                }
            } else {
                window.status = c;
                this.status = true;
            }
        }
        if (this.log[e].restarted) {
            if (this.log[e].cleared) {
                b = 0;
            }
            if (--this.log[e].restarted === 0) {
                delete this.log[e].cleared;
            }
        }
        if (b) {
            setTimeout(CallbackUtil.Create(["Clear", this, e]), b);
        } else {
            if (b == 0) {
                this.Clear(e, 0);
            }
        }
        return e;
    }
    Clear(b, a) {
        if (this.log[b].prev != null) {
            this.log[this.log[b].prev].next = this.log[b].next;
        }
        if (this.log[b].next != null) {
            this.log[this.log[b].next].prev = this.log[b].prev;
        }
        if (this.current === b) {
            this.current = this.log[b].next;
            if (this.text) {
                if (this.div.parentNode == null) {
                    this.Init();
                }
                if (this.current == null) {
                    if (this.timer) {
                        clearTimeout(this.timer);
                        delete this.timer;
                    }
                    if (a == null) {
                        a = 600;
                    }
                    if (a === 0) {
                        this.Remove();
                    } else {
                        this.timer = setTimeout(CallbackUtil.Create(["Remove", this]), a);
                    }
                } else {
                    if (MathJax.Hub.config.messageStyle !== "none") {
                        if (this.textNodeBug) {
                            this.div.innerHTML = this.log[this.current].filteredText;
                        } else {
                            this.text.nodeValue = this.log[this.current].filteredText;
                        }
                    }
                }
                if (this.status) {
                    window.status = "";
                    delete this.status;
                }
            } else {
                if (this.status) {
                    window.status = (this.current == null ? "" : this.log[this.current].text);
                }
            }
        }
        delete this.log[b].next;
        delete this.log[b].prev;
        delete this.log[b].filteredText;
        if (this.log[b].restarted) {
            this.log[b].cleared = true;
        }
    }
    Remove() {
        this.text.nodeValue = "";
        this.div.style.display = "none";
    }
    File(a) {
        return this.Set(["LoadFile", "Loading %1", a], null, null);
    }
    Log() {
        var b = [];
        for (var c = 1, a = this.log.length; c < a; c++) {
            b[c] = this.log[c].text;
        }
        return b.join("\n");
    }
}
class Hooks {
    constructor(reset) {
        this.hooks = [];
        this.remove = [];
        this.reset = reset;
        this.running = false;
    }
    Add(hook, priority) {
        if (priority == null) {
            priority = 10;
        }
        if (!CallbackUtil.IsCallback(hook)) {
            hook = CallbackUtil.Create(hook);
        }
        hook.priority = priority;
        var i = this.hooks.length;
        while (i > 0 && priority < this.hooks[i - 1].priority) {
            i--;
        }
        this.hooks.splice(i, 0, hook);
        return hook;
    }
    Remove(hook) {
        for (var i = 0, m = this.hooks.length; i < m; i++) {
            if (this.hooks[i] === hook) {
                if (this.running) {
                    this.remove.push(i);
                } else {
                    this.hooks.splice(i, 1);
                }
                return;
            }
        }
    }
    Execute() {
        var callbacks = [{}];
        this.running = true;
        for (var i = 0, m = this.hooks.length; i < m; i++) {
            if (this.reset) {
                this.hooks[i].reset();
            }
            var result = this.hooks[i].apply(window, arguments);
            if (CallbackUtil.IsCallback(result) && !result.called) {
                callbacks.push(result);
            }
        }
        this.running = false;
        if (this.remove.length) {
            this.RemovePending();
        }
        if (callbacks.length === 1) {
            return null;
        }
        if (callbacks.length === 2) {
            return callbacks[1];
        }
        return CallbackUtil.After.apply({}, callbacks);
    }
    RemovePending() {
        this.remove = this.remove.sort();
        for (var i = this.remove.length - 1; i >= 0; i--) {
            this.hooks.splice(i, 1);
        }
        this.remove = [];
    }
}
class MenuSettings {
    constructor() {
        this.zoom = "Click";
        this.CTRL = false;
        this.ALT = false;
        this.CMD = false;
        this.Shift = false;
        this.discoverable = false;
        this.zscale = "200%";
        this.renderer = null;
        this.font = "Auto";
        this.context = "MathJax";
        this.locale = null;
        this.mpContext = false;
        this.mpMouse = false;
        this.texHints = true;
        this.inTabOrder = true;
        this.semantics = false;
    }
}
class HubConfig {
    constructor() {
        this.root = "";
        this.config = [];
        this.styleSheets = [];
        this.styles = {
            ".MathJax_Preview": {
                color: "#888"
            }
        };
        this.jax = [];
        this.extensions = [];
        this.preJax = null;
        this.postJax = null;
        this.displayAlign = "center";
        this.displayIndent = "0";
        this.preRemoveClass = "MathJax_Preview";
        this.showProcessingMessages = true;
        this.messageStyle = "normal";
        this.delayStartupUntil = "none";
        this.skipStartupTypeset = false;
        this.elements = [];
        this.positionToHash = true;
        this.showMathMenu = true;
        this.showMathMenuMSIE = true;
        /** @type{MenuSettings} */
        this.menuSettings = new MenuSettings();
        this.errorSettings = {
            message: ["[", ["MathProcessingError", "Math Processing Error"], "]"],
            style: {
                color: "#CC0000",
                "font-style": "italic"
            }
        };
        this.ignoreMMLattributes = {};
    }
}
class HubRegister {
    PreProcessor() {
        return MathJax.Hub.preProcessors.Add.apply(MathJax.Hub.preProcessors, arguments);
    }
    MessageHook() {
        return MathJax.Hub.signal.MessageHook.apply(MathJax.Hub.signal, arguments);
    }
    StartupHook() {
        return MathJax.Hub.Startup.signal.MessageHook.apply(MathJax.Hub.Startup.signal, arguments);
    }
    LoadHook() {
        return MathJax.Ajax.LoadHook.apply(MathJax.Ajax, arguments);
    }
}
class HubUnRegister {
    PreProcessor(a) {
        MathJax.Hub.preProcessors.Remove(a);
    }
    MessageHook(a) {
        MathJax.Hub.signal.RemoveHook(a);
    }
    StartupHook(a) {
        MathJax.Hub.Startup.signal.RemoveHook(a);
    }
    LoadHook(a) {
        MathJax.Ajax.removeHook(a);
    }
}
class HubScriptAction {
    Process(a) { }
    Update(b) {
        var a = b.MathJax.elementJax;
        if (a && a.needsUpdate()) {
            a.Remove(true);
            b.MathJax.state = ElementJax.STATE.UPDATE;
        } else {
            b.MathJax.state = ElementJax.STATE.PROCESSED;
        }
    }
    Reprocess(b) {
        var a = b.MathJax.elementJax;
        if (a) {
            a.Remove(true);
            b.MathJax.state = ElementJax.STATE.UPDATE;
        }
    }
    Rerender(b) {
        var a = b.MathJax.elementJax;
        if (a) {
            a.Remove(true);
            b.MathJax.state = ElementJax.STATE.OUTPUT;
        }
    }
}
class Hub {
    constructor() {
        /** @type{number} */
        this.processSectionDelay = 50;
        /** @type{number} */
        this.processUpdateTime = 250;
        /** @type{number} */
        this.processUpdateDelay = 10;
        /** @type{Hooks} */
        this.preProcessors = new Hooks(true);
        /** @type{Hooks} */
        this.postInputHooks = new Hooks(true);
        this.signal = CallbackUtil.Signal("Hub");
        this.inputJax = {};
        this.outputJax = { order: {} };
        /** @type{HubConfig} */
        this.config = new HubConfig();
        /** @type{HubRegister} */
        this.Register = new HubRegister();
        /** @type{HubUnRegister} */
        this.UnRegister = new HubUnRegister();
        /** @type{HubScriptAction} */
        this.scriptAction = new HubScriptAction();
        /** @type{HubStartUp} */
        this.Startup = new HubStartUp();
        this.Configured = CallbackUtil.Create({});
    }
    Config(a) {
        this.Insert(this.config, a);
        if (this.config.Augment) {
            this.Augment(this.config.Augment);
        }
    }
    CombineConfig(c, f) {
        var b = this.config, g, e;
        c = c.split(/\./);
        for (var d = 0, a = c.length; d < a; d++) {
            g = c[d];
            if (!b[g]) {
                b[g] = {};
            }
            e = b;
            b = b[g];
        }
        e[g] = b = this.Insert(f, b);
        return b;
    }
    getAllJax(e) {
        var c = [], b = this.elementScripts(e);
        for (var d = 0, a = b.length; d < a; d++) {
            if (b[d].MathJax && b[d].MathJax.elementJax) {
                c.push(b[d].MathJax.elementJax);
            }
        }
        return c;
    }
    getJaxByType(f, e) {
        var c = [], b = this.elementScripts(e);
        for (var d = 0, a = b.length; d < a; d++) {
            if (b[d].MathJax && b[d].MathJax.elementJax && b[d].MathJax.elementJax.mimeType === f) {
                c.push(b[d].MathJax.elementJax);
            }
        }
        return c;
    }
    getJaxByInputType(f, e) {
        var c = [], b = this.elementScripts(e);
        for (var d = 0, a = b.length; d < a; d++) {
            if (b[d].MathJax && b[d].MathJax.elementJax && b[d].type && b[d].type.replace(/ *;(.|\s)*/, "") === f) {
                c.push(b[d].MathJax.elementJax);
            }
        }
        return c;
    }
    getJaxFor(a) {
        if (typeof (a) === "string") {
            a = document.getElementById(a);
        }
        if (a && a.MathJax) {
            return a.MathJax.elementJax;
        }
        if (this.isMathJaxNode(a)) {
            if (!a.isMathJax) {
                a = a.firstChild;
            }
            while (a && !a.jaxID) {
                a = a.parentNode;
            }
            if (a) {
                return MathJax.OutputJax[a.jaxID].getJaxFromMath(a);
            }
        }
        return null;
    }
    isJax(a) {
        if (typeof (a) === "string") {
            a = document.getElementById(a);
        }
        if (this.isMathJaxNode(a)) {
            return 1;
        }
        if (a && (a.tagName || "").toLowerCase() === "script") {
            if (a.MathJax) {
                return (a.MathJax.state === ElementJax.STATE.PROCESSED ? 1 : -1);
            }
            if (a.type && this.inputJax[a.type.replace(/ *;(.|\s)*/, "")]) {
                return -1;
            }
        }
        return 0;
    }
    isMathJaxNode(a) {
        return !!a && (a.isMathJax || (a.className || "") === "MathJax_MathML");
    }
    setRenderer(d, c) {
        if (!d) {
            return;
        }
        if (!MathJax.OutputJax[d]) {
            this.config.menuSettings.renderer = "";
            var b = "[MathJax]/jax/output/" + d + "/config.js";
            return MathJax.Ajax.Require(b, ["setRenderer", this, d, c]);
        } else {
            this.config.menuSettings.renderer = d;
            if (c == null) {
                c = "jax/mml";
            }
            var a = this.outputJax;
            if (a[c] && a[c].length) {
                if (d !== a[c][0].id) {
                    a[c].unshift(MathJax.OutputJax[d]);
                    return this.signal.Post(["Renderer Selected", d]);
                }
            }
            return null;
        }
    }
    Queue() {
        return this.queue.Push.apply(this.queue, arguments);
    }
    Typeset(c, d) {
        if (!MathJax.isReady) {
            return null;
        }
        var b = this.elementCallback(c, d);
        if (b.count) {
            var a = CallbackUtil.Queue(["PreProcess", this, b.elements], ["Process", this, b.elements]);
        }
        return a.Push(b.callback);
    }
    PreProcess(e, g) {
        var c = this.elementCallback(e, g);
        var b = CallbackUtil.Queue();
        if (c.count) {
            var f = (c.count === 1 ? [c.elements] : c.elements);
            b.Push(["Post", this.signal, ["Begin PreProcess", c.elements]]);
            for (var d = 0, a = f.length; d < a; d++) {
                if (f[d]) {
                    b.Push(["Execute", this.preProcessors, f[d]]);
                }
            }
            b.Push(["Post", this.signal, ["End PreProcess", c.elements]]);
        }
        return b.Push(c.callback);
    }
    Process(a, b) {
        return this.takeAction("Process", a, b);
    }
    Update(a, b) {
        return this.takeAction("Update", a, b);
    }
    Reprocess(a, b) {
        return this.takeAction("Reprocess", a, b);
    }
    Rerender(a, b) {
        return this.takeAction("Rerender", a, b);
    }
    takeAction(g, d, h) {
        var c = this.elementCallback(d, h);
        var f = c.elements;
        var a = CallbackUtil.Queue(["Clear", this.signal]);
        var e = {
            scripts: [],
            start: new Date().getTime(),
            i: 0,
            j: 0,
            jax: {},
            jaxIDs: []
        };
        if (c.count) {
            var b = ["Delay", MathJax.Callback, this.processSectionDelay];
            if (!b[2]) {
                b = {};
            }
            a.Push(
                ["clearCounts", MathJax.Message],
                ["Post", this.signal, ["Begin " + g, f]],
                ["Post", this.signal, ["Begin Math", f, g]],
                ["prepareScripts", this, g, f, e],
                ["Post", this.signal, ["Begin Math Input", f, g]],
                ["processInput", this, e],
                ["Post", this.signal, ["End Math Input", f, g]],
                b,
                ["prepareOutput", this, e, "preProcess"],
                b,
                ["Post", this.signal, ["Begin Math Output", f, g]],
                ["processOutput", this, e],
                ["Post", this.signal, ["End Math Output", f, g]],
                b,
                ["prepareOutput", this, e, "postProcess"],
                b,
                ["Post", this.signal, ["End Math", f, g]],
                ["Post", this.signal, ["End " + g, f]],
                ["clearCounts", MathJax.Message]
            );
        }
        return a.Push(c.callback);
    }
    prepareScripts(h, e, g) {
        var b = this.elementScripts(e);
        var f = ElementJax.STATE;
        for (var d = 0, a = b.length; d < a; d++) {
            var c = b[d];
            if (c.type && this.inputJax[c.type.replace(/ *;(.|\n)*/, "")]) {
                if (c.MathJax) {
                    if (c.MathJax.elementJax && c.MathJax.elementJax.hover) {
                        MathJax.Extension.MathEvents.Hover.ClearHover(c.MathJax.elementJax);
                    }
                    if (c.MathJax.state !== f.PENDING) {
                        this.scriptAction[h](c);
                    }
                }
                if (!c.MathJax) {
                    c.MathJax = {
                        state: f.PENDING
                    };
                }
                if (c.MathJax.error) {
                    delete c.MathJax.error;
                }
                if (c.MathJax.state !== f.PROCESSED) {
                    g.scripts.push(c);
                }
            }
        }
    }
    checkScriptSiblings(a) {
        if (a.MathJax.checked) {
            return;
        }
        var b = this.config, f = a.previousSibling;
        if (f && f.nodeName === "#text") {
            var d, e, c = a.nextSibling;
            if (c && c.nodeName !== "#text") {
                c = null;
            }
            if (b.preJax) {
                if (typeof (b.preJax) === "string") {
                    b.preJax = new RegExp(b.preJax + "$");
                }
                d = f.nodeValue.match(b.preJax);
            }
            if (b.postJax && c) {
                if (typeof (b.postJax) === "string") {
                    b.postJax = new RegExp("^" + b.postJax);
                }
                e = c.nodeValue.match(b.postJax);
            }
            if (d && (!b.postJax || e)) {
                f.nodeValue = f.nodeValue.replace(b.preJax, (d.length > 1 ? d[1] : ""));
                f = null;
            }
            if (e && (!b.preJax || d)) {
                c.nodeValue = c.nodeValue.replace(b.postJax, (e.length > 1 ? e[1] : ""));
            }
            if (f && !f.nodeValue.match(/\S/)) {
                f = f.previousSibling;
            }
        }
        if (b.preRemoveClass && f && f.className === b.preRemoveClass) {
            a.MathJax.preview = f;
        }
        a.MathJax.checked = 1;
    }
    processInput(a) {
        var b, i = ElementJax.STATE;
        var h, e, d = a.scripts.length;
        try {
            while (a.i < d) {
                h = a.scripts[a.i];
                if (!h) {
                    a.i++;
                    continue;
                }
                e = h.previousSibling;
                if (e && e.className === "MathJax_Error") {
                    e.parentNode.removeChild(e);
                }
                if (!h.parentNode || !h.MathJax || h.MathJax.state === i.PROCESSED) {
                    a.i++;
                    continue;
                }
                if (!h.MathJax.elementJax || h.MathJax.state === i.UPDATE) {
                    this.checkScriptSiblings(h);
                    var g = h.type.replace(/ *;(.|\s)*/, "");
                    var j = this.inputJax[g];
                    b = j.Process(h, a);
                    if (typeof b === "function") {
                        if (b.called) {
                            continue;
                        }
                        this.RestartAfter(b);
                    }
                    b = b.Attach(h, j.id);
                    this.saveScript(b, a, h, i);
                    this.postInputHooks.Execute(b, j.id, h);
                } else {
                    if (h.MathJax.state === i.OUTPUT) {
                        this.saveScript(h.MathJax.elementJax, a, h, i);
                    }
                }
                a.i++;
                var c = new Date().getTime();
                if (c - a.start > this.processUpdateTime && a.i < a.scripts.length) {
                    a.start = c;
                    this.RestartAfter(CallbackUtil.Delay(1));
                }
            }
        } catch (f) {
            return this.processError(f, a, "Input");
        }
        if (a.scripts.length && this.config.showProcessingMessages) {
            MathJax.Message.Set(["ProcessMath", "Processing math: %1%%", 100], 0);
        }
        a.start = new Date().getTime();
        a.i = a.j = 0;
        return null;
    }
    saveScript(a, d, b, c) {
        if (!this.outputJax[a.mimeType]) {
            b.MathJax.state = c.UPDATE;
            throw Error("No output jax registered for " + a.mimeType);
        }
        a.outputJax = this.outputJax[a.mimeType][0].id;
        if (!d.jax[a.outputJax]) {
            if (d.jaxIDs.length === 0) {
                d.jax[a.outputJax] = d.scripts;
            } else {
                if (d.jaxIDs.length === 1) {
                    d.jax[d.jaxIDs[0]] = d.scripts.slice(0, d.i);
                }
                d.jax[a.outputJax] = [];
            }
            d.jaxIDs.push(a.outputJax);
        }
        if (d.jaxIDs.length > 1) {
            d.jax[a.outputJax].push(b);
        }
        b.MathJax.state = c.OUTPUT;
    }
    prepareOutput(c, f) {
        while (c.j < c.jaxIDs.length) {
            var e = c.jaxIDs[c.j], d = MathJax.OutputJax[e];
            if (d[f]) {
                try {
                    var a = d[f](c);
                    if (typeof a === "function") {
                        if (a.called) {
                            continue;
                        }
                        this.RestartAfter(a);
                    }
                } catch (b) {
                    if (!b.restart) {
                        MathJax.Message.Set(["PrepError", "Error preparing %1 output (%2)", e, f], null, 600);
                        MathJax.Hub.lastPrepError = b;
                        c.j++;
                    }
                    return CallbackUtil.After(["prepareOutput", this, c, f], b.restart);
                }
            }
            c.j++;
        }
        return null;
    }
    processOutput(h) {
        var b, g = ElementJax.STATE, d, a = h.scripts.length;
        try {
            while (h.i < a) {
                d = h.scripts[h.i];
                if (!d || !d.parentNode || !d.MathJax || d.MathJax.error) {
                    h.i++;
                    continue;
                }
                var c = d.MathJax.elementJax;
                if (!c) {
                    h.i++;
                    continue;
                }
                b = MathJax.OutputJax[c.outputJax].Process(d, h);
                if (b !== false) {
                    d.MathJax.state = g.PROCESSED;
                    if (d.MathJax.preview) {
                        d.MathJax.preview.innerHTML = "";
                        d.MathJax.preview.style.display = "none";
                    }
                    this.signal.Post(["New Math", c.inputID]);
                }
                h.i++;
                var e = new Date().getTime();
                if (e - h.start > this.processUpdateTime && h.i < h.scripts.length) {
                    h.start = e;
                    this.RestartAfter(CallbackUtil.Delay(this.processUpdateDelay));
                }
            }
        } catch (f) {
            return this.processError(f, h, "Output");
        }
        if (h.scripts.length && this.config.showProcessingMessages) {
            MathJax.Message.Set(["TypesetMath", "Typesetting math: %1%%", 100], 0);
            MathJax.Message.Clear(0);
        }
        h.i = h.j = 0;
        return null;
    }
    processMessage(d, b) {
        var a = Math.floor(d.i / (d.scripts.length) * 100);
        var c = (b === "Output" ? ["TypesetMath", "Typesetting math: %1%%"] : ["ProcessMath", "Processing math: %1%%"]);
        if (this.config.showProcessingMessages) {
            MathJax.Message.Set(c.concat(a), 0);
        }
    }
    processError(b, c, a) {
        if (!b.restart) {
            if (!this.config.errorSettings.message) {
                throw b;
            }
            this.formatError(c.scripts[c.i], b);
            c.i++;
        }
        this.processMessage(c, a);
        return CallbackUtil.After(["process" + a, this, c], b.restart);
    }
    formatError(b, f) {
        var h = function (l, k, j, i) {
            return MathJax.Localization._(l, k, j, i);
        };
        var e = h("ErrorMessage", "Error: %1", f.message) + "\n";
        if (f.sourceURL || f.fileName) {
            e += "\n" + h("ErrorFile", "file: %1", f.sourceURL || f.fileName);
        }
        if (f.line || f.lineNumber) {
            e += "\n" + h("ErrorLine", "line: %1", f.line || f.lineNumber);
        }
        e += "\n\n" + h("ErrorTips", "Debugging tips: use %1, inspect %2 in the browser console", "'unpacked/MathJax.js'", "'MathJax.Hub.lastError'");
        b.MathJax.error = MathJax.OutputJax.Error.Jax(e, b);
        if (b.MathJax.elementJax) {
            b.MathJax.error.inputID = b.MathJax.elementJax.inputID;
        }
        var g = this.config.errorSettings;
        var a = h(g.messageId, g.message);
        var c = MathJax.HTML.ElementSpan({
            className: "MathJax_Error",
            jaxID: "Error",
            isMathJax: true,
            id: b.MathJax.error.inputID + "-Frame"
        }, [["span", null, a]]);
        MathJax.Ajax.Require("[MathJax]/extensions/MathEvents.js", function () {
            var j = MathJax.Extension.MathEvents.Event, i = MathJax.Hub;
            c.oncontextmenu = j.Menu;
            c.onmousedown = j.Mousedown;
            c.onkeydown = j.Keydown;
            c.tabIndex = i.getTabOrder(i.getJaxFor(b));
        });
        var d = document.getElementById(c.id);
        if (d) {
            d.parentNode.removeChild(d);
        }
        if (b.parentNode) {
            b.parentNode.insertBefore(c, b);
        }
        if (b.MathJax.preview) {
            b.MathJax.preview.innerHTML = "";
            b.MathJax.preview.style.display = "none";
        }
        this.lastError = f;
        this.signal.Post(["Math Processing Error", b, f]);
    }
    RestartAfter(a) {
        throw this.Insert(Error("restart"), {
            restart: CallbackUtil.Create(a)
        });
    }
    elementCallback(c, f) {
        if (f == null && (MathJax.Object.isArray(c) || typeof c === "function")) {
            try {
                CallbackUtil.Create(c);
                f = c;
                c = null;
            } catch (d) { }
        }
        if (c == null) {
            c = this.config.elements || [];
        }
        if (this.isHTMLCollection(c)) {
            c = this.HTMLCollection2Array(c);
        }
        if (!MathJax.Object.isArray(c)) {
            c = [c];
        }
        c = [].concat(c);
        for (var b = 0, a = c.length; b < a; b++) {
            if (typeof (c[b]) === "string") {
                c[b] = document.getElementById(c[b]);
            }
        }
        if (!document.body) {
            document.body = document.getElementsByTagName("body")[0];
        }
        if (c.length == 0) {
            c.push(document.body);
        }
        if (!f) {
            f = {};
        }
        return {
            count: c.length,
            elements: (c.length === 1 ? c[0] : c),
            callback: f
        };
    }
    elementScripts(e) {
        var b = [];
        if (MathJax.Object.isArray(e) || this.isHTMLCollection(e)) {
            for (var d = 0, a = e.length; d < a; d++) {
                var f = 0;
                for (var c = 0; c < d && !f; c++) {
                    f = e[c].contains(e[d]);
                }
                if (!f) {
                    b.push.apply(b, this.elementScripts(e[d]));
                }
            }
            return b;
        }
        if (typeof (e) === "string") {
            e = document.getElementById(e);
        }
        if (!document.body) {
            document.body = document.getElementsByTagName("body")[0];
        }
        if (e == null) {
            e = document.body;
        }
        if (e.tagName != null && e.tagName.toLowerCase() === "script") {
            return [e];
        }
        b = e.getElementsByTagName("script");
        if (this.msieHTMLCollectionBug) {
            b = this.HTMLCollection2Array(b);
        }
        return b;
    }
    isHTMLCollection(a) {
        return ("HTMLCollection" in window && typeof (a) === "object" && a instanceof HTMLCollection);
    }
    HTMLCollection2Array(c) {
        if (!this.msieHTMLCollectionBug) {
            return [].slice.call(c);
        }
        var b = [];
        for (var d = 0, a = c.length; d < a; d++) {
            b[d] = c[d];
        }
        return b;
    }
    Insert(dst, src) {
        for (var b in src) {
            if (src.hasOwnProperty(b)) {
                if (typeof src[b] === "object" && !(MathJax.Object.isArray(src[b])) && (typeof dst[b] === "object" || typeof dst[b] === "function")) {
                    this.Insert(dst[b], src[b]);
                } else {
                    dst[b] = src[b];
                }
            }
        }
        return dst;
    }
    getTabOrder(a) {
        return this.config.menuSettings.inTabOrder ? 0 : -1;
    }
    SplitList(a) {
        if ("trim" in String.prototype) {
            return a.trim().split(/\s+/);
        } else {
            return a.replace(/^\s+/, "").replace(/\s+$/, "").split(/\s+/);
        }
    }
}
class HubStartUp {
    constructor() {
        /** @type{string} */
        this.script = "";
        this.params = {};
        this.queue = CallbackUtil.Queue();
        this.signal = CallbackUtil.Signal("Startup");
    }
    Config() {
        this.queue.Push(["Post", this.signal, "Begin Config"]);
        if (MathJax.AuthorConfig && MathJax.AuthorConfig.root) {
            MathJax.Ajax.config.root = MathJax.AuthorConfig.root;
        }
        if (this.params.locale) {
            MathJax.Localization.resetLocale(this.params.locale);
            MathJax.Hub.config.menuSettings.locale = this.params.locale;
        }
        if (this.params.config) {
            var c = this.params.config.split(/,/);
            for (var b = 0, a = c.length; b < a; b++) {
                if (!c[b].match(/\.js$/)) {
                    c[b] += ".js";
                }
                this.queue.Push(["Require", MathJax.Ajax, this.URL("config", c[b])]);
            }
        }
        this.queue.Push(["Config", MathJax.Hub, MathJax.AuthorConfig]);
        if (this.script.match(/\S/)) {
            this.queue.Push(this.script + ";\n1;");
        }
        this.queue.Push(["ConfigDelay", this], ["ConfigBlocks", this], [function (d) {
            return d.loadArray(MathJax.Hub.config.config, "config", null, true);
        }, this], ["Post", this.signal, "End Config"]);
    }
    ConfigDelay() {
        var a = this.params.delayStartupUntil || MathJax.Hub.config.delayStartupUntil;
        if (a === "onload") {
            return this.onload;
        }
        if (a === "configured") {
            return MathJax.Hub.Configured;
        }
        return a;
    }
    ConfigBlocks() {
        var c = document.getElementsByTagName("script");
        var b = CallbackUtil.Queue();
        for (var d = 0, a = c.length; d < a; d++) {
            var e = String(c[d].type).replace(/ /g, "");
            if (e.match(/^text\/x-mathjax-config(;.*)?$/) && !e.match(/;executed=true/)) {
                c[d].type += ";executed=true";
                b.Push(c[d].innerHTML + ";\n1;");
            }
        }
        return b.Push(function () {
            MathJax.Ajax.config.root = MathJax.Hub.config.root;
        });
    }
    Cookie() {
        return this.queue.Push(
            ["Post", this.signal, "Begin Cookie"],
            ["Get", MathJax.HTML.Cookie, "menu", MathJax.Hub.config.menuSettings],
            [function (e) {
                var d = e.menuSettings;
                if (d.locale) {
                    MathJax.Localization.resetLocale(d.locale);
                }
                var g = e.menuSettings.renderer, b = e.jax;
                if (g) {
                    var c = "output/" + g;
                    b.sort();
                    for (var f = 0, a = b.length; f < a; f++) {
                        if (b[f].substr(0, 7) === "output/") {
                            break;
                        }
                    }
                    if (f == a - 1) {
                        b.pop();
                    } else {
                        while (f < a) {
                            if (b[f] === c) {
                                b.splice(f, 1);
                                break;
                            }
                            f++;
                        }
                    }
                    b.unshift(c);
                }
                if (d.CHTMLpreview != null) {
                    delete d.CHTMLpreview;
                }
            }, MathJax.Hub.config],
            ["Post", this.signal, "End Cookie"]
        );
    }
    Styles() {
        return this.queue.Push(
            ["Post", this.signal, "Begin Styles"],
            ["loadArray", this, MathJax.Hub.config.styleSheets, "config"],
            ["Styles", MathJax.Ajax, MathJax.Hub.config.styles],
            ["Post", this.signal, "End Styles"]
        );
    }
    Jax() {
        var f = MathJax.Hub.config, c = MathJax.Hub.outputJax;
        for (var g = 0, b = f.jax.length, d = 0; g < b; g++) {
            var e = f.jax[g].substr(7);
            if (f.jax[g].substr(0, 7) === "output/" && c.order[e] == null) {
                c.order[e] = d;
                d++;
            }
        }
        var a = CallbackUtil.Queue();
        return a.Push(
            ["Post", this.signal, "Begin Jax"],
            ["loadArray", this, f.jax, "jax", "config.js"],
            ["Post", this.signal, "End Jax"]
        );
    }
    Extensions() {
        var a = CallbackUtil.Queue();
        return a.Push(
            ["Post", this.signal, "Begin Extensions"],
            ["loadArray", this, MathJax.Hub.config.extensions, "extensions"],
            ["Post", this.signal, "End Extensions"]
        );
    }
    Message() {
        MathJax.Message.Init(true);
    }
    Menu() {
        var b = MathJax.Hub.config.menuSettings, a = MathJax.Hub.outputJax, d;
        for (var c in a) {
            if (a.hasOwnProperty(c)) {
                if (a[c].length) {
                    d = a[c];
                    break;
                }
            }
        }
        if (d && d.length) {
            if (b.renderer && b.renderer !== d[0].id) {
                d.unshift(MathJax.OutputJax[b.renderer]);
            }
            b.renderer = d[0].id;
        }
    }
    Hash() {
        if (MathJax.Hub.config.positionToHash && document.location.hash && document.body && document.body.scrollIntoView) {
            var d = document.location.hash.substr(1);
            var f = document.getElementById(d);
            if (!f) {
                var c = document.getElementsByTagName("a");
                for (var e = 0, b = c.length; e < b; e++) {
                    if (c[e].name === d) {
                        f = c[e];
                        break;
                    }
                }
            }
            if (f) {
                while (!f.scrollIntoView) {
                    f = f.parentNode;
                }
                f = this.HashCheck(f);
                if (f && f.scrollIntoView) {
                    setTimeout(function () {
                        f.scrollIntoView(true);
                    }, 1);
                }
            }
        }
    }
    HashCheck(b) {
        var a = MathJax.Hub.getJaxFor(b);
        if (a && MathJax.OutputJax[a.outputJax].hashCheck) {
            b = MathJax.OutputJax[a.outputJax].hashCheck(b);
        }
        return b;
    }
    MenuZoom() {
        if (MathJax.Hub.config.showMathMenu) {
            if (!MathJax.Extension.MathMenu) {
                setTimeout(function () {
                    CallbackUtil.Queue(
                        ["Require", MathJax.Ajax, "[MathJax]/extensions/MathMenu.js", {}],
                        ["loadDomain", MathJax.Localization, "MathMenu"]
                    );
                }, 1000);
            } else {
                setTimeout(CallbackUtil.Create(["loadDomain", MathJax.Localization, "MathMenu"]), 1000);
            }
            if (!MathJax.Extension.MathZoom) {
                setTimeout(CallbackUtil.Create(["Require", MathJax.Ajax, "[MathJax]/extensions/MathZoom.js", {}]), 2000);
            }
        }
    }
    onLoad() {
        var a = this.onload = CallbackUtil.Create(function () {
            MathJax.Hub.Startup.signal.Post("onLoad");
        });
        if (document.body && document.readyState) {
            if (MathJax.Hub.Browser.isMSIE) {
                if (document.readyState === "complete") {
                    return [a];
                }
            } else {
                if (document.readyState !== "loading") {
                    return [a];
                }
            }
        }
        if (window.addEventListener) {
            window.addEventListener("load", a, false);
            if (!this.params.noDOMContentEvent) {
                window.addEventListener("DOMContentLoaded", a, false);
            }
        } else {
            if (window.attachEvent) {
                window.attachEvent("onload", a);
            } else {
                window.onload = a;
            }
        }
        return a;
    }
    Typeset(a, b) {
        if (MathJax.Hub.config.skipStartupTypeset) {
            return function () { };
        }
        return this.queue.Push(
            ["Post", this.signal, "Begin Typeset"],
            ["Typeset", MathJax.Hub, a, b],
            ["Post", this.signal, "End Typeset"]
        );
    }
    URL(b, a) {
        if (!a.match(/^([a-z]+:\/\/|\[|\/)/)) {
            a = "[MathJax]/" + b + "/" + a;
        }
        return a;
    }
    loadArray(b, f, c, a) {
        if (b) {
            if (!MathJax.Object.isArray(b)) {
                b = [b];
            }
            if (b.length) {
                var h = CallbackUtil.Queue(), j = {}, e;
                for (var g = 0, d = b.length; g < d; g++) {
                    e = this.URL(f, b[g]);
                    if (c) {
                        e += "/" + c;
                    }
                    if (a) {
                        h.Push(["Require", MathJax.Ajax, e, j]);
                    } else {
                        h.Push(MathJax.Ajax.Require(e, j));
                    }
                }
                return h.Push({});
            }
        }
        return null;
    }
}
class AjaxLoader {
    JS(k, m) {
        var j = this.fileName(k);
        var i = document.createElement("script");
        var l = CallbackUtil.Create(["loadTimeout", this, k]);
        this.loading[k] = {
            callback: m,
            timeout: setTimeout(l, this.timeout),
            status: this.STATUS.OK,
            script: i
        };
        this.loading[k].message = MathJax.Message.File(j);
        i.onerror = l;
        i.type = "text/javascript";
        i.src = k + this.fileRev(j);
        this.head.appendChild(i);
    }
    CSS(j, l) {
        var i = this.fileName(j);
        var k = document.createElement("link");
        k.rel = "stylesheet";
        k.type = "text/css";
        k.href = j + this.fileRev(i);
        this.loading[j] = {
            callback: l,
            message: MathJax.Message.File(i),
            status: this.STATUS.OK
        };
        this.head.appendChild(k);
        this.timer.create.call(this, [this.timer.file, j], k);
    }
}
class AjaxTimer {
    create(j, i) {
        j = CallbackUtil.Create(j);
        if (i.nodeName === "STYLE" && i.styleSheet && typeof (i.styleSheet.cssText) !== "undefined") {
            j(this.STATUS.OK);
        } else {
            if (window.chrome && i.nodeName === "LINK") {
                j(this.STATUS.OK);
            } else {
                if (navigator.vendor === "Apple Computer, Inc." && typeof navigator.vendorSub === "undefined") {
                    this.timer.start(this, [this.timer.checkSafari2, Ajax.StylesheetCount++, j], this.styleDelay);
                } else {
                    this.timer.start(this, [this.timer.checkLength, i, j], this.styleDelay);
                }
            }
        }
        return j;
    }
    start(j, i, k, l) {
        i = CallbackUtil.Create(i);
        i.execute = this.execute;
        i.time = this.time;
        i.STATUS = j.STATUS;
        i.timeout = l || j.timeout;
        i.delay = i.total = k || 0;
        if (k) {
            setTimeout(i, k);
        } else {
            i();
        }
    }
    time(i) {
        this.total += this.delay;
        this.delay = Math.floor(this.delay * 1.05 + 5);
        if (this.total >= this.timeout) {
            i(this.STATUS.ERROR);
            return 1;
        }
        return 0;
    }
    file(j, i) {
        if (i < 0) {
            MathJax.Ajax.loadTimeout(j);
        } else {
            MathJax.Ajax.loadComplete(j);
        }
    }
    execute() {
        this.hook.call(this.object, this, this.data[0], this.data[1]);
    }
    checkSafari2(i, j, k) {
        if (i.time(k)) {
            return;
        }
        if (document.styleSheets.length > j && document.styleSheets[j].cssRules && document.styleSheets[j].cssRules.length) {
            k(i.STATUS.OK);
        } else {
            setTimeout(i, i.delay);
        }
    }
    checkLength(i, l, n) {
        if (i.time(n)) {
            return;
        }
        var m = 0;
        var j = (l.sheet || l.styleSheet);
        try {
            if ((j.cssRules || j.rules || []).length > 0) {
                m = 1;
            }
        } catch (k) {
            if (k.message.match(/protected variable|restricted URI/)) {
                m = 1;
            } else {
                if (k.message.match(/Security error/)) {
                    m = 1;
                }
            }
        }
        if (m) {
            setTimeout(CallbackUtil.Create([n, i.STATUS.OK]), 0);
        } else {
            setTimeout(i, i.delay);
        }
    }
}
class Ajax {
    static PATH = {
        a11y: "[MathJax]/extensions/a11y",
        Contrib: "https://cdn.mathjax.org/mathjax/contrib"
    };
    static StylesheetCount = 0;
    static ScriptList = [];
    static GetHead(i) {
        if (document.styleSheets && document.styleSheets.length > Ajax.StylesheetCount) {
            Ajax.StylesheetCount = document.styleSheets.length;
        }
        if (!i) {
            i = document.head || ((document.getElementsByTagName("head"))[0]);
            if (!i) {
                i = document.body;
            }
        }
        return i;
    };
    static RemoveScript() {
        for (var k = 0, j = Ajax.ScriptList.length; k < j; k++) {
            MathJax.Ajax.head.removeChild(Ajax.ScriptList[k]);
        }
        Ajax.ScriptList = [];
    };
    constructor() {
        Ajax.PATH[NAME_TAG] = "";
        this.loaded = {};
        this.loading = {};
        this.loadHooks = {};
        this.timeout = 15 * 1000;
        this.styleDelay = 1;
        this.config = {
            root: "",
            path: Ajax.PATH
        };
        this.params = {};
        this.STATUS = {
            OK: 1,
            ERROR: -1
        };
        /** @type{AjaxLoader} */
        this.loader = new AjaxLoader();
        /** @type{AjaxTimer} */
        this.timer = new AjaxTimer();
        this.loadingMathMenu = false;
    }
    fileURL(path) {
        var i;
        while ((i = path.match(/^\[([-._a-z0-9]+)\]/i)) && Ajax.PATH.hasOwnProperty(i[1])) {
            path = (Ajax.PATH[i[1]] || this.config.root) + path.substr(i[1].length + 2);
        }
        return path;
    }
    fileName(path) {
        var i = this.config.root;
        if (path.substr(0, i.length) === i) {
            path = "[" + NAME_TAG + "]" + path.substr(i.length);
        }
        do {
            var k = false;
            for (var l in Ajax.PATH) {
                if (Ajax.PATH.hasOwnProperty(l) && Ajax.PATH[l]) {
                    if (path.substr(0, Ajax.PATH[l].length) === Ajax.PATH[l]) {
                        path = "[" + l + "]" + path.substr(Ajax.PATH[l].length);
                        k = true;
                        break;
                    }
                }
            }
        } while (k);
        return path;
    }
    fileRev(path) {
        var i = MathJax.cdnFileVersions[path] || MathJax.cdnVersion || "";
        if (i) {
            i = "?V=" + i;
        }
        return i;
    }
    urlRev(i) {
        return this.fileURL(i) + this.fileRev(i);
    }
    Require(path, n) {
        n = CallbackUtil.Create(n);
        var l;
        if (path instanceof Object) {
            for (var j in path) {
                if (path.hasOwnProperty(j)) {
                    l = j.toUpperCase();
                    path = path[j];
                }
            }
        } else {
            l = path.split(/\./).pop().toUpperCase();
        }
        if (this.params.noContrib && path.substr(0, 9) === "[Contrib]") {
            n(this.STATUS.ERROR);
        } else {
            path = this.fileURL(path);
            if (this.loaded[path]) {
                n(this.loaded[path]);
            } else {
                var m = {};
                m[l] = path;
                this.Load(m, n);
            }
        }
        return n;
    }
    Load(k, m) {
        m = CallbackUtil.Create(m);
        var l;
        if (k instanceof Object) {
            for (var j in k) {
                if (k.hasOwnProperty(j)) {
                    l = j.toUpperCase();
                    k = k[j];
                }
            }
        } else {
            l = k.split(/\./).pop().toUpperCase();
        }
        k = this.fileURL(k);
        if (this.loading[k]) {
            this.addHook(k, m);
        } else {
            this.head = Ajax.GetHead(this.head);
            if (this.loader[l]) {
                this.loader[l].call(this, k, m);
            } else {
                throw Error("Can't load files of type " + l);
            }
        }
        return m;
    }
    LoadHook(path, m, k) {
        m = CallbackUtil.Create(m);
        if (path instanceof Object) {
            for (var j in path) {
                if (path.hasOwnProperty(j)) {
                    path = path[j];
                }
            }
        }
        path = this.fileURL(path);
        if (this.loaded[path]) {
            m(this.loaded[path]);
        } else {
            this.addHook(path, m, k);
        }
        return m;
    }
    addHook(path, k, i) {
        if (!this.loadHooks[path]) {
            this.loadHooks[path] = new Hooks();
        }
        this.loadHooks[path].Add(k, i);
        k.file = path;
    }
    removeHook(i) {
        if (this.loadHooks[i.file]) {
            this.loadHooks[i.file].Remove(i);
            if (!this.loadHooks[i.file].hooks.length) {
                delete this.loadHooks[i.file];
            }
        }
    }
    Preloading(...paths) {
        for (var l = 0, j = paths.length; l < j; l++) {
            var k = this.fileURL(paths[l]);
            if (!this.loading[k]) {
                this.loading[k] = { preloaded: true };
            }
        }
    }
    loadComplete(path) {
        path = this.fileURL(path);
        var j = this.loading[path];
        if (j && !j.preloaded) {
            MathJax.Message.Clear(j.message);
            clearTimeout(j.timeout);
            if (j.script) {
                if (Ajax.ScriptList.length === 0) {
                    setTimeout(Ajax.RemoveScript, 0);
                }
                Ajax.ScriptList.push(j.script);
            }
            this.loaded[path] = j.status;
            delete this.loading[path];
            this.addHook(path, j.callback);
        } else {
            if (j) {
                delete this.loading[path];
            }
            this.loaded[path] = this.STATUS.OK;
            j = { status: this.STATUS.OK };
        }
        if (!this.loadHooks[path]) {
            return null;
        }
        return this.loadHooks[path].Execute(j.status);
    }
    loadTimeout(i) {
        if (this.loading[i].timeout) {
            clearTimeout(this.loading[i].timeout);
        }
        this.loading[i].status = this.STATUS.ERROR;
        this.loadError(i);
        this.loadComplete(i);
    }
    loadError(i) {
        MathJax.Message.Set(["LoadFailed", "File failed to load: %1", i], null, 2000);
        MathJax.Hub.signal.Post(["file load error", i]);
    }
    Styles(style, l) {
        var styleStr = this.StyleString(style);
        if (styleStr === "") {
            l = CallbackUtil.Create(l);
            l();
        } else {
            var styleElm = document.createElement("style");
            styleElm.type = "text/css";
            this.head = Ajax.GetHead(this.head);
            this.head.appendChild(styleElm);
            if (styleElm.styleSheet && typeof (styleElm.styleSheet.cssText) !== "undefined") {
                styleElm.styleSheet.cssText = styleStr;
            } else {
                styleElm.appendChild(document.createTextNode(styleStr));
            }
            l = this.timer.create.call(this, l, styleElm);
        }
        return l;
    }
    StyleString(style) {
        if (typeof (style) === "string") {
            return style;
        }
        var styleStr = "", styleName, styleItems;
        for (styleName in style) {
            if (style.hasOwnProperty(styleName)) {
                if (typeof style[styleName] === "string") {
                    styleStr += styleName + " {" + style[styleName] + "}\n";
                } else {
                    if (MathJax.Object.isArray(style[styleName])) {
                        for (var l = 0; l < style[styleName].length; l++) {
                            styleItems = {};
                            styleItems[styleName] = style[styleName][l];
                            styleStr += this.StyleString(styleItems);
                        }
                    } else {
                        if (styleName.substr(0, 6) === "@media") {
                            styleStr += styleName + " {" + this.StyleString(style[styleName]) + "}\n";
                        } else {
                            if (style[styleName] != null) {
                                styleItems = [];
                                for (var j in style[styleName]) {
                                    if (style[styleName].hasOwnProperty(j)) {
                                        if (style[styleName][j] != null) {
                                            styleItems[styleItems.length] = j + ": " + style[styleName][j];
                                        }
                                    }
                                }
                                styleStr += styleName + " {" + styleItems.join("; ") + "}\n";
                            }
                        }
                    }
                }
            }
        }
        return styleStr;
    }
}

class MathJaxObjectProto {
    __Init() {
    }
    __SUPER(f) {
        return f.callee.__SUPER;
    }
    isa(f) {
        return (f instanceof Object) && (this instanceof f);
    }
}
class OutputJaxError {
    constructor() {
        this.id = "Error";
        this.version = "2.7.2";
        this.config = {};
        this.errors = 0;
    }
    ContextMenu() {
        return MathJax.Extension.MathEvents.Event.ContextMenu.apply(MathJax.Extension.MathEvents.Event, arguments);
    }
    Mousedown() {
        return MathJax.Extension.MathEvents.Event.AltContextMenu.apply(MathJax.Extension.MathEvents.Event, arguments);
    }
    getJaxFromMath(h) {
        return (h.nextSibling.MathJax || {}).error;
    }
    Jax(j, i) {
        var h = MathJax.Hub.inputJax[i.type.replace(/ *;(.|\s)*/, "")];
        this.errors++;
        return {
            inputJax: (h || {
                id: "Error"
            }).id,
            outputJax: "Error",
            inputID: "MathJax-Error-" + this.errors,
            sourceMenuTitle: ["ErrorMessage", "Error Message"],
            sourceMenuFormat: "Error",
            originalText: MathJax.HTML.getScript(i),
            errorText: j
        };
    }
}
class InputJaxError {
    constructor() {
        this.id = "Error";
        this.version = "2.7.2";
        this.config = {};
        this.sourceMenuTitle = ["Original", "Original Form"];
    }
}
class ElementJax {
    static STATE = {
        PENDING: 1,
        PROCESSED: 2,
        UPDATE: 3,
        OUTPUT: 4
    };
    static ID = 0;
    static GetID() {
        ElementJax.ID++;
        return "MathJax-Element-" + ElementJax.ID;
    }
    constructor() {
        this.mml = null;
        this.directory = "";
        this.extensionDir = "";
    }
}

class CallbackUtil {
    static Queue = null;
    static Signal = null;
    static Create(args, i) {
        if (arguments.length > 1) {
            if (arguments.length === 2 && !(typeof arguments[0] === "function") && arguments[0] instanceof Object && typeof arguments[1] === "number") {
                args = [].slice.call(args, i);
            } else {
                args = [].slice.call(arguments, 0);
            }
        }
        if (MathJax.Object.isArray(args) && args.length === 1 && typeof (args[0]) === "function") {
            args = args[0];
        }
        if (typeof args === "function") {
            if (args.execute === CALLBACK.prototype.execute) {
                return args;
            }
            return CALLBACK({ hook: args });
        } else {
            if (MathJax.Object.isArray(args)) {
                if (typeof (args[0]) === "string" && args[1] instanceof Object && typeof args[1][args[0]] === "function") {
                    return CALLBACK({
                        hook: args[1][args[0]],
                        object: args[1],
                        data: args.slice(2)
                    });
                } else {
                    if (typeof args[0] === "function") {
                        return CALLBACK({
                            hook: args[0],
                            data: args.slice(1)
                        });
                    } else {
                        if (typeof args[1] === "function") {
                            return CALLBACK({
                                hook: args[1],
                                object: args[0],
                                data: args.slice(2)
                            });
                        }
                    }
                }
            } else {
                if (typeof (args) === "string") {
                    if (CallbackUtil.TestEval) {
                        CallbackUtil.TestEval();
                    }
                    return CALLBACK({ hook: CallbackUtil.Eval, data: [args] });
                } else {
                    if (args instanceof Object) {
                        return CALLBACK(args);
                    } else {
                        if (typeof (args) === "undefined") {
                            return CALLBACK({});
                        }
                    }
                }
            }
        }
        throw Error("Can't make callback from given data");
    }
    static Eval(code) {
        return eval.call(window, code);
    }
    static TestEval() {
        CallbackUtil.Eval("var __TeSt_VaR__ = 1");
        if (window.__TeSt_VaR__) {
            try {
                delete window.__TeSt_VaR__;
            } catch (error) {
                window.__TeSt_VaR__ = null;
            }
        } else {
            if (window.execScript) {
                CallbackUtil.Eval = function (code) {
                    MathJax.__code = code;
                    code = "try {" + NAME_TAG + ".__result = eval(" + NAME_TAG + ".__code)} catch(err) {" + NAME_TAG + ".__result = err}";
                    window.execScript(code);
                    var result = MathJax.__result;
                    delete MathJax.__result;
                    delete MathJax.__code;
                    if (result instanceof Error) {
                        throw result;
                    }
                    return result;
                }
            } else {
                CallbackUtil.Eval = function (code) {
                    MathJax.__code = code;
                    code = "try {" + NAME_TAG + ".__result = eval(" + NAME_TAG + ".__code)} catch(err) {" + NAME_TAG + ".__result = err}";
                    var head = (document.getElementsByTagName("head"))[0];
                    if (!head) {
                        head = document.body;
                    }
                    var script = document.createElement("script");
                    script.appendChild(document.createTextNode(code));
                    head.appendChild(script);
                    head.removeChild(script);
                    var result = MathJax.__result;
                    delete MathJax.__result;
                    delete MathJax.__code;
                    if (result instanceof Error) {
                        throw result;
                    }
                    return result;
                }
            }
        }
    }
    static IsCallback(f) {
        return (typeof (f) === "function" && f.isCallback);
    }
    static WaitSignal(callback, signals) {
        if (!MathJax.Object.isArray(signals)) {
            signals = [signals];
        }
        if (!callback.signal) {
            callback.oldExecute = callback.execute;
            callback.execute = CallbackUtil.WaitExecute;
            callback.signal = signals;
        } else {
            if (signals.length === 1) {
                callback.signal.push(signals[0]);
            } else {
                callback.signal = callback.signal.concat(signals);
            }
        }
    }
    static WaitExecute() {
        var signals = this.signal;
        delete this.signal;
        this.execute = this.oldExecute;
        delete this.oldExecute;
        var result = this.execute.apply(this, arguments);
        if (CallbackUtil.IsCallback(result) && !result.called) {
            CallbackUtil.WaitSignal(result, signals);
        } else {
            for (var i = 0, m = signals.length; i < m; i++) {
                signals[i].pending--;
                if (signals[i].pending <= 0) {
                    signals[i].call();
                }
            }
        }
    }
    static Delay(time, callback) {
        callback = CallbackUtil.Create(callback);
        callback.timeout = setTimeout(callback, time);
        return callback;
    }
    static WaitFor(callback, signal) {
        callback = CallbackUtil.Create(callback);
        if (!callback.called) {
            CallbackUtil.WaitSignal(callback, signal);
            signal.pending++;
        }
    }
    static After(callback) {
        callback = CallbackUtil.Create(callback);
        callback.pending = 0;
        for (var i = 1, m = arguments.length; i < m; i++) {
            if (arguments[i]) {
                CallbackUtil.WaitFor(arguments[i], callback);
            }
        }
        if (callback.pending === 0) {
            var result = callback();
            if (CallbackUtil.IsCallback(result)) {
                callback = result;
            }
        }
        return callback;
    }
    static ExecuteHooks(hooks, data, reset) {
        if (!hooks) {
            return null;
        }
        if (!MathJax.Object.isArray(hooks)) {
            hooks = [hooks];
        }
        if (!MathJax.Object.isArray(data)) {
            data = (data == null ? [] : [data]);
        }
        var handler = new Hooks(reset);
        for (var i = 0, m = hooks.length; i < m; i++) {
            handler.Add(hooks[i]);
        }
        return handler.Execute.apply(handler, data);
    }
    static Hooks(reset) {
        return new Hooks(reset);
    }
}

function createClass(src_class) {
    var new_class = function () { };
    for (var func in src_class) {
        if (func !== "instance" && src_class.hasOwnProperty(func)) {
            new_class[func] = src_class[func];
        }
    }
    return new_class;
}
function createObject() {
    if (MathJax.Object) {
        return;
    }
    MathJax.Object = createClass({
        __SUPER: null,
        __Init: function (f) {
            if (f.length === 1 && f[0] === EMPTY) {
                return this;
            }
            var g = new f.callee(EMPTY);
            return g.__Init.apply(g, f) || g;
        },
        __Subclass: function (f, h) {
            var new_cls = function () {
                return arguments.callee.__Init.call(this, arguments);
            }
            new_cls.__SUPER = this;
            new_cls.__Init = this.__Init;
            new_cls.__Subclass = this.__Subclass;
            new_cls.__Augment = this.__Augment;
            new_cls.__ProtoFunction = this.__ProtoFunction;
            new_cls.prototype = new this(EMPTY);
            new_cls.prototype.instance = new_cls;
            new_cls.__Augment(f, h);
            return new_cls;
        },
        __Augment: function (f, g) {
            var h;
            if (f != null) {
                for (h in f) {
                    if (f.hasOwnProperty(h)) {
                        this.__ProtoFunction(h, f[h]);
                    }
                }
                if (f.toString !== this.prototype.toString && f.toString !== {}.toString) {
                    this.__ProtoFunction("toString", f.toString);
                }
            }
            if (g != null) {
                for (h in g) {
                    if (g.hasOwnProperty(h)) {
                        this[h] = g[h];
                    }
                }
            }
            return this;
        },
        __ProtoFunction: function (g, f) {
            this.prototype[g] = f;
            if (typeof f === "function") {
                f.__SUPER = this.__SUPER.prototype;
            }
        },
        isArray: Array.isArray,
        Array: Array,
        prototype: new MathJaxObjectProto()
    });
}
function createCallback() {
    CALLBACK = function (data) {
        var cb = function () {
            return arguments.callee.execute.apply(arguments.callee, arguments);
        };
        for (var id in CALLBACK.prototype) {
            if (CALLBACK.prototype.hasOwnProperty(id)) {
                if (typeof (data[id]) !== "undefined") {
                    cb[id] = data[id];
                } else {
                    cb[id] = CALLBACK.prototype[id];
                }
            }
        }
        return cb;
    };
    CALLBACK.prototype = {
        isCallback: true,
        data: [],
        object: window,
        hook: function () { },
        execute: function (...args) {
            if (!this.called || this.autoReset) {
                this.called = !this.autoReset;
                return this.hook.apply(this.object, this.data.concat([].slice.call(args, 0)));
            }
        },
        reset: function () {
            delete this.called;
        }
    };
    CallbackUtil.Queue = MathJax.Object.__Subclass({
        __Init: function () {
            this.pending = this.running = 0;
            this.queue = [];
            this.Push.apply(this, arguments);
        },
        Push: function () {
            var callback;
            for (var i = 0, m = arguments.length; i < m; i++) {
                callback = CallbackUtil.Create(arguments[i]);
                if (callback === arguments[i] && !callback.called) {
                    callback = CallbackUtil.Create(["wait", this, callback]);
                }
                this.queue.push(callback);
            }
            if (!this.running && !this.pending) {
                this.Process();
            }
            return callback;
        },
        Process: function (queue) {
            while (!this.running && !this.pending && this.queue.length) {
                var callback = this.queue[0];
                queue = this.queue.slice(1);
                this.queue = [];
                this.Suspend();
                var result = callback();
                this.Resume();
                if (queue.length) {
                    this.queue = queue.concat(this.queue);
                }
                if (CallbackUtil.IsCallback(result) && !result.called) {
                    CallbackUtil.WaitFor(result, this);
                }
            }
        },
        Suspend: function () {
            this.running++;
        },
        Resume: function () {
            if (this.running) {
                this.running--;
            }
        },
        call: function () {
            this.Process.apply(this, arguments);
        },
        wait: function (callback) {
            return callback;
        }
    });
    CallbackUtil.Signal = CallbackUtil.Queue.__Subclass({
        __Init: function (name) {
            CallbackUtil.Queue.prototype.__Init.call(this);
            this.name = name;
            this.posted = [];
            this.listeners = new Hooks(true);
            this.posting = false;
            this.callback = null;
        },
        Post: function (message, callback, forget) {
            callback = CallbackUtil.Create(callback);
            if (this.posting || this.pending) {
                this.Push(["Post", this, message, callback, forget]);
            } else {
                this.callback = callback;
                callback.reset();
                if (!forget) {
                    this.posted.push(message);
                }
                this.Suspend();
                this.posting = true;
                var result = this.listeners.Execute(message);
                if (CallbackUtil.IsCallback(result) && !result.called) {
                    CallbackUtil.WaitFor(result, this);
                }
                this.Resume();
                this.posting = false;
                if (!this.pending) {
                    this.call();
                }
            }
            return callback;
        },
        Clear: function (callback) {
            callback = CallbackUtil.Create(callback);
            if (this.posting || this.pending) {
                callback = this.Push(["Clear", this, callback]);
            } else {
                this.posted = [];
                callback();
            }
            return callback;
        },
        call: function () {
            this.callback(this);
            this.Process();
        },
        Interest: function (callback, ignorePast, priority) {
            callback = CallbackUtil.Create(callback);
            this.listeners.Add(callback, priority);
            if (!ignorePast) {
                for (var i = 0, m = this.posted.length; i < m; i++) {
                    callback.reset();
                    var result = callback(this.posted[i]);
                    if (CallbackUtil.IsCallback(result) && i === this.posted.length - 1) {
                        CallbackUtil.WaitFor(result, this);
                    }
                }
            }
            return callback;
        },
        NoInterest: function (callback) {
            this.listeners.Remove(callback);
        },
        MessageHook: function (msg, callback, priority) {
            callback = CallbackUtil.Create(callback);
            if (!this.hooks) {
                this.hooks = {};
                this.Interest(["ExecuteHooks", this]);
            }
            if (!this.hooks[msg]) {
                this.hooks[msg] = new Hooks(true);
            }
            this.hooks[msg].Add(callback, priority);
            for (var i = 0, m = this.posted.length; i < m; i++) {
                if (this.posted[i] == msg) {
                    callback.reset();
                    callback(this.posted[i]);
                }
            }
            callback.msg = msg;
            return callback;
        },
        ExecuteHooks: function (msg) {
            var type = (MathJax.Object.isArray(msg) ? msg[0] : msg);
            if (!this.hooks[type]) {
                return null;
            }
            return this.hooks[type].Execute(msg);
        },
        RemoveHook: function (hook) {
            this.hooks[hook.msg].Remove(hook);
        }
    }, {
        signals: {},
        find: function (name) {
            if (!CallbackUtil.Signal.signals[name]) {
                CallbackUtil.Signal.signals[name] = new CallbackUtil.Signal(name);
            }
            return CallbackUtil.Signal.signals[name];
        }
    });
    MathJax.Callback = CallbackUtil.Create;
    MathJax.Callback.Delay = CallbackUtil.Delay;
}
function createJax() {
    var g = MathJax.Object.__Subclass({
        JAXFILE: "jax.js",
        require: null,
        config: {},
        __Init: function (i, h) {
            if (arguments.length === 0) {
                return this;
            }
            return (this.instance.__Subclass(i, h))();
        },
        __Augment: function (k, j) {
            var i = this.instance, h = {};
            if (k != null) {
                for (var l in k) {
                    if (k.hasOwnProperty(l)) {
                        if (typeof k[l] === "function") {
                            i.__ProtoFunction(l, k[l]);
                        } else {
                            h[l] = k[l];
                        }
                    }
                }
                if (k.toString !== i.prototype.toString && k.toString !== {}.toString) {
                    i.__ProtoFunction("toString", k.toString);
                }
            }
            MathJax.Hub.Insert(i.prototype, h);
            i.__Augment(null, j);
            return this;
        },
        Translate: function (h, i) {
            throw Error(this.directory + "/" + this.JAXFILE + " failed to define the Translate() method");
        },
        Register: function (h) { },
        Config: function () {
            this.config = MathJax.Hub.CombineConfig(this.id, this.config);
            if (this.config.Augment) {
                this.__Augment(this.config.Augment);
            }
        },
        Startup: function () { },
        loadComplete: function (i) {
            if (i === "config.js") {
                return MathJax.Ajax.loadComplete(this.directory + "/" + i);
            } else {
                var h = CallbackUtil.Queue();
                h.Push(MathJax.Hub.Register.StartupHook("End Config", {}),
                    ["Post", MathJax.Hub.Startup.signal, this.id + " Jax Config"],
                    ["Config", this],
                    ["Post", MathJax.Hub.Startup.signal, this.id + " Jax Require"],
                    [function (j) {
                        return MathJax.Hub.Startup.loadArray(j.require, this.directory);
                    }, this],
                    [function (j, k) {
                        return MathJax.Hub.Startup.loadArray(j.extensions, "extensions/" + k);
                    }, this.config || {}, this.id],
                    ["Post", MathJax.Hub.Startup.signal, this.id + " Jax Startup"],
                    ["Startup", this],
                    ["Post", MathJax.Hub.Startup.signal, this.id + " Jax Ready"]
                );
                if (this.copyTranslate) {
                    h.Push([function (j) {
                        j.preProcess = j.preTranslate;
                        j.Process = j.Translate;
                        j.postProcess = j.postTranslate;
                    }, this.instance.prototype]);
                }
                return h.Push(["loadComplete", MathJax.Ajax, this.directory + "/" + i]);
            }
        }
    }, {
        id: "Jax",
        version: "2.7.2",
        directory: __TAG + "/jax",
        extensionDir: __TAG + "/extensions"
    });
    MathJax.InputJax = g.__Subclass({
        elementJax: "mml",
        sourceMenuTitle: ["Original", "Original Form"],
        copyTranslate: true,
        Process: function (l, q) {
            var j = CallbackUtil.Queue(), o;
            var k = this.elementJax;
            if (!MathJax.Object.isArray(k)) {
                k = [k];
            }
            for (var n = 0, h = k.length; n < h; n++) {
                o = MathJax.ElementJax.directory + "/" + k[n] + "/" + this.JAXFILE;
                if (!this.require) {
                    this.require = [];
                } else {
                    if (!MathJax.Object.isArray(this.require)) {
                        this.require = [this.require];
                    }
                }
                this.require.push(o);
                j.Push(MathJax.Ajax.Require(o));
            }
            o = this.directory + "/" + this.JAXFILE;
            var p = j.Push(MathJax.Ajax.Require(o));
            if (!p.called) {
                this.instance.prototype.Process = function () {
                    if (!p.called) {
                        return p;
                    }
                    throw Error(o + " failed to load properly");
                }
            }
            k = MathJax.Hub.outputJax["jax/" + k[0]];
            if (k) {
                j.Push(MathJax.Ajax.Require(k[0].directory + "/" + this.JAXFILE));
            }
            return j.Push({});
        },
        needsUpdate: function (h) {
            var i = h.SourceElement();
            return (h.originalText !== MathJax.HTML.getScript(i));
        },
        Register: function (h) {
            if (!MathJax.Hub.inputJax) {
                MathJax.Hub.inputJax = {};
            }
            MathJax.Hub.inputJax[h] = this;
        }
    }, {
        id: "InputJax",
        version: "2.7.2",
        directory: g.directory + "/input",
        extensionDir: g.extensionDir
    });
    MathJax.OutputJax = g.__Subclass({
        copyTranslate: true,
        preProcess: function (j) {
            var i, h = this.directory + "/" + this.JAXFILE;
            this.instance.prototype.preProcess = function (k) {
                if (!i.called) {
                    return i;
                }
                throw Error(h + " failed to load properly");
            };
            i = MathJax.Ajax.Require(h);
            return i;
        },
        Register: function (i) {
            var h = MathJax.Hub.outputJax;
            if (!h[i]) {
                h[i] = [];
            }
            if (h[i].length && (this.id === MathJax.Hub.config.menuSettings.renderer || (h.order[this.id] || 0) < (h.order[h[i][0].id] || 0))) {
                h[i].unshift(this);
            } else {
                h[i].push(this);
            }
            if (!this.require) {
                this.require = [];
            } else {
                if (!MathJax.Object.isArray(this.require)) {
                    this.require = [this.require];
                }
            }
            this.require.push(MathJax.ElementJax.directory + "/" + (i.split(/\//)[1]) + "/" + this.JAXFILE);
        },
        Remove: function (h) { }
    }, {
        id: "OutputJax",
        version: "2.7.2",
        directory: g.directory + "/output",
        extensionDir: g.extensionDir,
        fontDir: __TAG + (MathJax.isPacked ? "" : "/..") + "/fonts",
        imageDir: __TAG + (MathJax.isPacked ? "" : "/..") + "/images"
    });
    MathJax.ElementJax = g.__Subclass({
        inputJax: null,
        outputJax: null,
        inputID: null,
        originalText: "",
        mimeType: "",
        sourceMenuTitle: ["MathMLcode", "MathML Code"],
        __Init: function (i, h) {
            return this.instance.__Subclass(i, h);
        },
        Attach: function (i, j) {
            var h = i.MathJax.elementJax;
            h = i.MathJax.elementJax = this;
            if (i.id) {
                this.inputID = i.id;
            } else {
                i.id = this.inputID = ElementJax.GetID();
                this.newID = 1;
            }
            h.originalText = MathJax.HTML.getScript(i);
            h.inputJax = j;
            if (h.root) {
                h.root.inputID = h.inputID;
            }
            return h;
        }
    }, {
        id: "ElementJax",
        version: "2.7.2",
        directory: g.directory + "/element",
        extensionDir: g.extensionDir,
        __Subclass: function () {
            var h = g.__Subclass.apply(this, arguments);
            h.loadComplete = this.prototype.loadComplete;
            return h;
        }
    });
    MathJax.ElementJax.prototype.STATE = ElementJax.STATE;
    MathJax.OutputJax.Error = new OutputJaxError();
    MathJax.InputJax.Error = new InputJaxError();
}
function checkBrowser() {
    var mathJaxHub = MathJax.Hub;
    var k = navigator.userAgent;
    var a = {
        isMac: (navigator.platform.substr(0, 3) === "Mac"),
        isPC: (navigator.platform.substr(0, 3) === "Win"),
        isMSIE: ("ActiveXObject" in window && "clipboardData" in window),
        isEdge: ("MSGestureEvent" in window && "chrome" in window && window.chrome.loadTimes == null),
        isFirefox: (!!k.match(/Gecko\//) && !k.match(/like Gecko/)),
        isSafari: (!!k.match(/ (Apple)?WebKit\//) && !k.match(/ like iPhone /) && (!window.chrome || window.chrome.app == null)),
        isChrome: ("chrome" in window && window.chrome.loadTimes != null),
        isOpera: ("opera" in window && window.opera.version != null),
        isKonqueror: ("konqueror" in window && navigator.vendor == "KDE"),
        versionAtLeast: function (y) {
            var x = (this.version).split(".");
            y = (new String(y)).split(".");
            for (var z = 0, j = y.length; z < j; z++) {
                if (x[z] != y[z]) {
                    return parseInt(x[z] || "0") >= parseInt(y[z]);
                }
            }
            return true;
        },
        Select: function (j) {
            var i = j[mathJaxHub.Browser];
            if (i) {
                return i(mathJaxHub.Browser);
            }
            return null;
        }
    };
    var e = k.replace(/^Mozilla\/(\d+\.)+\d+ /, "").replace(/[a-z][-a-z0-9._: ]+\/\d+[^ ]*-[^ ]*\.([a-z][a-z])?\d+ /i, "").replace(/Gentoo |Ubuntu\/(\d+\.)*\d+ (\([^)]*\) )?/, "");
    mathJaxHub.Browser = mathJaxHub.Insert(mathJaxHub.Insert(new String("Unknown"), {
        version: "0.0"
    }), a);
    for (var v in a) {
        if (a.hasOwnProperty(v)) {
            if (a[v] && v.substr(0, 2) === "is") {
                v = v.slice(2);
                if (v === "Mac" || v === "PC") {
                    continue;
                }
                mathJaxHub.Browser = mathJaxHub.Insert(new String(v), a);
                var r = new RegExp(".*(Version/| Trident/.*; rv:)((?:\\d+\\.)+\\d+)|.*(" + v + ")" + (v == "MSIE" ? " " : "/") + "((?:\\d+\\.)*\\d+)|(?:^|\\(| )([a-z][-a-z0-9._: ]+|(?:Apple)?WebKit)/((?:\\d+\\.)+\\d+)");
                var u = r.exec(e) || ["", "", "", "unknown", "0.0"];
                mathJaxHub.Browser.name = (u[1] != "" ? v : (u[3] || u[5]));
                mathJaxHub.Browser.version = u[2] || u[4] || u[6];
                break;
            }
        }
    }
    try {
        mathJaxHub.Browser.Select({
            Safari: function (j) {
                var i = parseInt((String(j.version).split("."))[0]);
                if (i > 85) {
                    j.webkit = j.version;
                }
                if (i >= 538) {
                    j.version = "8.0";
                } else {
                    if (i >= 537) {
                        j.version = "7.0";
                    } else {
                        if (i >= 536) {
                            j.version = "6.0";
                        } else {
                            if (i >= 534) {
                                j.version = "5.1";
                            } else {
                                if (i >= 533) {
                                    j.version = "5.0";
                                } else {
                                    if (i >= 526) {
                                        j.version = "4.0";
                                    } else {
                                        if (i >= 525) {
                                            j.version = "3.1";
                                        } else {
                                            if (i > 500) {
                                                j.version = "3.0";
                                            } else {
                                                if (i > 400) {
                                                    j.version = "2.0";
                                                } else {
                                                    if (i > 85) {
                                                        j.version = "1.0";
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                j.webkit = (navigator.appVersion.match(/WebKit\/(\d+)\./))[1];
                j.isMobile = (navigator.appVersion.match(/Mobile/i) != null);
                j.noContextMenu = j.isMobile;
            },
            Firefox: function (j) {
                if ((j.version === "0.0" || k.match(/Firefox/) == null) && navigator.product === "Gecko") {
                    var m = k.match(/[\/ ]rv:(\d+\.\d.*?)[\) ]/);
                    if (m) {
                        j.version = m[1];
                    } else {
                        var i = (navigator.buildID || navigator.productSub || "0").substr(0, 8);
                        if (i >= "20111220") {
                            j.version = "9.0";
                        } else {
                            if (i >= "20111120") {
                                j.version = "8.0";
                            } else {
                                if (i >= "20110927") {
                                    j.version = "7.0";
                                } else {
                                    if (i >= "20110816") {
                                        j.version = "6.0";
                                    } else {
                                        if (i >= "20110621") {
                                            j.version = "5.0";
                                        } else {
                                            if (i >= "20110320") {
                                                j.version = "4.0";
                                            } else {
                                                if (i >= "20100121") {
                                                    j.version = "3.6";
                                                } else {
                                                    if (i >= "20090630") {
                                                        j.version = "3.5";
                                                    } else {
                                                        if (i >= "20080617") {
                                                            j.version = "3.0";
                                                        } else {
                                                            if (i >= "20061024") {
                                                                j.version = "2.0";
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                j.isMobile = (navigator.appVersion.match(/Android/i) != null || k.match(/ Fennec\//) != null || k.match(/Mobile/) != null);
            },
            Chrome: function (i) {
                i.noContextMenu = i.isMobile = !!navigator.userAgent.match(/ Mobile[ \/]/);
            },
            Opera: function (i) {
                i.version = opera.version();
            },
            Edge: function (i) {
                i.isMobile = !!navigator.userAgent.match(/ Phone/);
            },
            MSIE: function (j) {
                j.isMobile = !!navigator.userAgent.match(/ Phone/);
                j.isIE9 = !!(document.documentMode && (window.performance || window.msPerformance));
                MathJax.HTML.setScriptBug = !j.isIE9 || document.documentMode < 9;
                MathJax.Hub.msieHTMLCollectionBug = (document.documentMode < 9);
                if (document.documentMode < 10 && !startup.params.NoMathPlayer) {
                    try {
                        new ActiveXObject("MathPlayer.Factory.1");
                        j.hasMathPlayer = true;
                    } catch (m) { }
                    try {
                        if (j.hasMathPlayer) {
                            var i = document.createElement("object");
                            i.id = "mathplayer";
                            i.classid = "clsid:32F66A20-7614-11D4-BD11-00104BD3F987";
                            g.appendChild(i);
                            document.namespaces.add("m", "http://www.w3.org/1998/Math/MathML");
                            j.mpNamespace = true;
                            if (document.readyState && (document.readyState === "loading" || document.readyState === "interactive")) {
                                document.write('<?import namespace="m" implementation="#MathPlayer">');
                                j.mpImported = true;
                            }
                        } else {
                            document.namespaces.add("mjx_IE_fix", "http://www.w3.org/1999/xlink");
                        }
                    } catch (m) { }
                }
            }
        });
    } catch (c) {
        console.error(c.message);
    }
    mathJaxHub.Browser.Select(MathJax.Message.browsers);
    if (MathJax.AuthorConfig && typeof MathJax.AuthorConfig.AuthorInit === "function") {
        MathJax.AuthorConfig.AuthorInit();
    }
}
function createMathJax() {
    MathJax = new MATHJAX();

    createObject();
    createCallback();

    MathJax.Ajax = new Ajax();
    MathJax.HTML = new HTML();
    MathJax.Localization = new Localization();
    MathJax.Message = new Message();
    MathJax.Hub = new Hub();
    MathJax.Hub.Insert(MathJax.Hub.config.styles, MathJax.Message.styles);
    MathJax.Hub.Insert(MathJax.Hub.config.styles, { ".MathJax_Error": MathJax.Hub.config.errorSettings.style });

    createJax();
    checkBrowser();
}
function loadScript() {
    var mathJaxHub = MathJax.Hub;
    var startup = mathJaxHub.Startup;
    var config = mathJaxHub.config;
    var g = document.head || (document.getElementsByTagName("head")[0]);
    if (!g) {
        g = document.childNodes[0];
    }
    var script = (document.documentElement || document).getElementsByTagName("script");
    if (script.length === 0 && g.namespaceURI) {
        script = document.getElementsByTagNameNS(g.namespaceURI, "script");
    }
    var f = new RegExp("(^|/)" + NAME_TAG + "\\.js(\\?.*)?$");
    for (var q = script.length - 1; q >= 0; q--) {
        if ((script[q].src || "").match(f)) {
            startup.script = script[q].innerHTML;
            if (RegExp.$2) {
                var t = RegExp.$2.substr(1).split(/\&/);
                for (var p = 0, l = t.length; p < l; p++) {
                    var n = t[p].match(/(.*)=(.*)/);
                    if (n) {
                        startup.params[unescape(n[1])] = unescape(n[2]);
                    } else {
                        startup.params[t[p]] = true;
                    }
                }
            }
            config.root = script[q].src.replace(/(^|\/)[^\/]*(\?.*)?$/, "");
            MathJax.Ajax.config.root = config.root;
            MathJax.Ajax.params = startup.params;
            break;
        }
    }

    mathJaxHub.queue = CallbackUtil.Queue();
    mathJaxHub.queue.Push(
        ["Post", startup.signal, "Begin"],
        ["Config", startup],
        ["Cookie", startup],
        ["Styles", startup],
        ["Message", startup],
        function () {
            var i = CallbackUtil.Queue(startup.Jax(), startup.Extensions());
            return i.Push({});
        },
        ["Menu", startup],
        startup.onLoad(),
        function () {
            MathJax.isReady = true;
        },
        ["Typeset", startup],
        ["Hash", startup],
        ["MenuZoom", startup],
        ["Post", startup.signal, "End"]
    );
}

if (document.getElementById && document.childNodes && document.createElement) {
    if (!(window.MathJax && MathJax.Hub)) {
        createMathJax();
        loadScript();
    }
}
