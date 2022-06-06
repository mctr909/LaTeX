///<reference path="../MathJax.js"/>
///<reference path="hooks.js"/>

class CONFIG {
    constructor(root = "", path = { MathJax: "" }) {
        this.root = root;
        this.path = path;
    }
}
class STATUS {
    constructor() {
        this.OK = true;
        this.ERROR = false;
    }
}
class TIMER {
    /**
     * @param {AJAX} ajax
     * @param {any} i
     * @param {number} timeOut
     * @param {any} l
     */
    start(ajax, i, timeOut, l) {
        var cb = MathJax.Callback(i);
        cb.execute = this.execute;
        cb.time = this.time;
        cb.STATUS = ajax.STATUS;
        cb.timeout = l || ajax.timeout;
        cb.delay = cb.total = timeOut || 0;
        if (timeOut) {
            setTimeout(cb, timeOut);
        } else {
            cb();
        }
    }

    /**
     * @param {function} func
     * @returns 
     */
    time(func) {
        this.total += this.delay;
        this.delay = Math.floor(this.delay * 1.05 + 5);
        if (this.total >= this.timeout) {
            func(this.STATUS.ERROR);
            return 1;
        }
        return 0;
    }

    file(j, i) {
        if (i < 0) { MathJax.Ajax.loadTimeout(j) }
        else { MathJax.Ajax.loadComplete(j) }
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
            if ((j.cssRules || j.rules || []).length > 0) { m = 1 }
        } catch (k) {
            if (k.message.match(/protected variable|restricted URI/)) {
                m = 1;
            } else {
                if (k.message.match(/Security error/)) { m = 1 }
            }
        }
        if (m) {
            setTimeout(MathJax.Callback([n, i.STATUS.OK]), 0);
        } else {
            setTimeout(i, i.delay);
        }
    }
}
class AJAX {
    static SCRIPTS = [];
    static PATH = {};
    static SS_COUNT = 0;

    constructor(name = "") {
        AJAX.PATH[name] = "";
        //AJAX.PATH.a11y = "[MathJax]/extensions/a11y";
        //AJAX.PATH.Contrib = "https://cdn.mathjax.org/mathjax/contrib";
        this.name = name;
        /** @type {Array<number>} */
        this.loaded = {};
        /** @type {Array<{callback:any, timeout:number, status: STATUS, script: any}>} */
        this.loading = {};
        /** @type {Array<HOOKS>} */
        this.loadHooks = {};
        this.timeout = 15 * 1000;
        this.styleDelay = 1;
        this.config = new CONFIG("", AJAX.PATH);
        this.STATUS = new STATUS();
        this.timer = new TIMER();
    }

    static GET_HEAD(head) {
        if (document.styleSheets && document.styleSheets.length > AJAX.SS_COUNT) {
            AJAX.SS_COUNT = document.styleSheets.length;
        }
        if (!head) {
            head = document.head || ((document.getElementsByTagName("head"))[0]);
            if (!head) {
                head = document.body;
            }
        }
        return head;
    }

    static FILE_REV(j) {
        var i = MathJax.cdnFileVersions[j] || MathJax.cdnVersion || "";
        if (i) { i = "?V=" + i }
        return i;
    }

    /**
     * @param {string} path 
     * @returns
     */
    fileURL(path) {
        var i;
        while ((i = path.match(/^\[([-._a-z0-9]+)\]/i)) && AJAX.PATH.hasOwnProperty(i[1])) {
            path = (AJAX.PATH[i[1]] || this.config.root) + path.substr(i[1].length + 2);
        }
        return path;
    }

    /**
     * @param {string} path
     * @returns
     */
    fileName(path) {
        var i = this.config.root;
        if (path.substr(0, i.length) === i) {
            path = "[" + this.name + "]" + path.substr(i.length);
        }
        do {
            var k = false;
            for (var l in AJAX.PATH) {
                if (AJAX.PATH.hasOwnProperty(l) && AJAX.PATH[l]) {
                    if (path.substr(0, AJAX.PATH[l].length) === AJAX.PATH[l]) {
                        path = "[" + l + "]" + path.substr(AJAX.PATH[l].length);
                        k = true;
                        break;
                    }
                }
            }
        } while (k);
        return path;
    }

    urlRev(i) {
        return this.fileURL(i) + this.fileRev(i);
    }

    /**
     * @param {string} path
     * @param {array<any>} arr
     * @returns 
     */
    Require(path, arr) {
        var func = MathJax.Callback(arr);
        var ext;
        if (path instanceof Object) {
            for (var j in path) {
                if (path.hasOwnProperty(j)) {
                    ext = j.toUpperCase();
                    path = path[j];
                }
            }
        } else {
            ext = path.split(/\./).pop().toUpperCase();
        }

        if (path.substr(0, 9) === "[Contrib]") {
            func(this.STATUS.ERROR);
        } else {
            path = this.fileURL(path);
            if (this.loaded[path]) {
                func(this.loaded[path]);
            } else {
                var m = {};
                m[ext] = path;
                this.Load(m, func);
            }
        }
        return func;
    }

    /**
     * @param {string} path 
     * @param {any} cb
     */
    JS(path, cb) {
        var j = this.fileName(path);
        var i = document.createElement("script");
        var l = MathJax.Callback(["loadTimeout", this, path]);
        this.loading[path] = {
            callback: cb,
            timeout: setTimeout(l, this.timeout),
            status: this.STATUS.OK,
            script: i
        };
        this.loading[path].message = MathJax.Message.File(j);
        i.onerror = l;
        i.type = "text/javascript";
        i.src = path + AJAX.FILE_REV(j);
        this.head = AJAX.GET_HEAD(this.head);
        this.head.appendChild(i);
    }

    Load(kv, arr) {
        var func = MathJax.Callback(arr);
        var l;
        if (kv instanceof Object) {
            for (var j in kv) {
                if (kv.hasOwnProperty(j)) {
                    l = j.toUpperCase();
                    kv = kv[j];
                }
            }
        } else {
            l = kv.split(/\./).pop().toUpperCase();
        }
        kv = this.fileURL(kv);
        if (this.loading[kv]) {
            this.addHook(kv, func);
        } else {
            this.JS(kv, func);
        }
        return func;
    }

    LoadHook(l, m, k) {
        m = MathJax.Callback(m);
        if (l instanceof Object) {
            for (var j in l) {
                if (l.hasOwnProperty(j)) { l = l[j] }
            }
        }
        l = this.fileURL(l);
        if (this.loaded[l]) {
            m(this.loaded[l]);
        } else {
            this.addHook(l, m, k);
        }
        return m;
    }

    addHook(j, k, i) {
        if (!this.loadHooks[j]) {
            this.loadHooks[j] = new HOOKS();
        }
        this.loadHooks[j].Add(k, i);
        k.file = j;
    }

    removeHook(i) {
        if (this.loadHooks[i.file]) {
            this.loadHooks[i.file].Remove(i);
            if (!this.loadHooks[i.file].hooks.length) {
                delete this.loadHooks[i.file];
            }
        }
    }

    Preloading() {
        for (var l = 0, j = arguments.length; l < j; l++) {
            var k = this.fileURL(arguments[l]);
            if (!this.loading[k]) {
                this.loading[k] = { preloaded: true };
            }
        }
    }

    loadComplete(i) {
        i = this.fileURL(i);
        var j = this.loading[i];
        if (j && !j.preloaded) {
            MathJax.Message.Clear(j.message);
            clearTimeout(j.timeout);
            if (j.script) {
                if (AJAX.SCRIPTS.length === 0) {
                    setTimeout(function () {
                        for (var k = 0, j = AJAX.SCRIPTS.length; k < j; k++) {
                            MathJax.Ajax.head.removeChild(AJAX.SCRIPTS[k]);
                        }
                        AJAX.SCRIPTS = [];
                    }, 0);
                }
                AJAX.SCRIPTS.push(j.script);
            }
            this.loaded[i] = j.status;
            delete this.loading[i];
            this.addHook(i, j.callback);
        } else {
            if (j) {
                delete this.loading[i];
            }
            this.loaded[i] = this.STATUS.OK;
            j = { status: this.STATUS.OK };
        }
        if (!this.loadHooks[i]) {
            return null;
        }
        return this.loadHooks[i].Execute(j.status);
    }

    loadTimeout(i) {
        if (this.loading[i].timeout) {
            clearTimeout(this.loading[i].timeout);
        }
        this.loading[i].status = this.STATUS.ERROR;
        this.loadError(i); this.loadComplete(i);
    }

    loadError(i) {
        MathJax.Message.Set(["LoadFailed", "File failed to load: %1", i], null, 2000);
        MathJax.Hub.signal.Post(["file load error", i]);
    }

    Styles(k, l) {
        var i = this.StyleString(k);
        if (i === "") { l = MathJax.Callback(l); l() }
        else {
            var j = document.createElement("style");
            j.type = "text/css";
            this.head = AJAX.GET_HEAD(this.head);
            this.head.appendChild(j);
            if (j.styleSheet && typeof (j.styleSheet.cssText) !== "undefined") { j.styleSheet.cssText = i }
            else { j.appendChild(document.createTextNode(i)) }
            l = this.createTimer.call(this, l, j);
        }
        return l;
    }

    createTimer(j, i) {
        j = MathJax.Callback(j);
        if (i.nodeName === "STYLE" && i.styleSheet && typeof (i.styleSheet.cssText) !== "undefined") {
            j(this.STATUS.OK);
        } else {
            if (window.chrome && i.nodeName === "LINK") {
                j(this.STATUS.OK);
            } else {
                if (navigator.vendor === "Apple Computer, Inc." && typeof navigator.vendorSub === "undefined") {
                    this.timer.start(this, [this.timer.checkSafari2, AJAX.SS_COUNT++, j], this.styleDelay);
                } else {
                    this.timer.start(this, [this.timer.checkLength, i, j], this.styleDelay);
                }
            }
        }
        return j;
    }

    StyleString(n) {
        if (typeof (n) === "string") { return n }
        var k = "", o, m;
        for (o in n) {
            if (n.hasOwnProperty(o)) {
                if (typeof n[o] === "string") {
                    k += o + " {" + n[o] + "}\n";
                } else {
                    if (MathJax.Object.isArray(n[o])) {
                        for (var l = 0; l < n[o].length; l++) {
                            m = {};
                            m[o] = n[o][l];
                            k += this.StyleString(m);
                        }
                    } else {
                        if (o.substr(0, 6) === "@media") {
                            k += o + " {" + this.StyleString(n[o]) + "}\n";
                        } else {
                            if (n[o] != null) {
                                m = [];
                                for (var j in n[o]) {
                                    if (n[o].hasOwnProperty(j)) {
                                        if (n[o][j] != null) {
                                            m[m.length] = j + ": " + n[o][j];
                                        }
                                    }
                                }
                                k += o + " {" + m.join("; ") + "}\n";
                            }
                        }
                    }
                }
            }
        }
        return k;
    }
}
