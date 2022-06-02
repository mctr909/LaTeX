///<reference path="../MathJax.js"/>
///<reference path="timer.js"/>

class AJAX {
    static SCRIPTS = [];
    static PATH = {};
    static SS_COUNT = 0;

    constructor(name) {
        AJAX.PATH[name] = "";
        //AJAX.PATH.a11y = "[MathJax]/extensions/a11y";
        //AJAX.PATH.Contrib = "https://cdn.mathjax.org/mathjax/contrib";
        this.name = name;
        this.loaded = {};
        this.loading = {};
        this.loadHooks = {};
        this.timeout = 15 * 1000;
        this.styleDelay = 1;
        this.config = { root: "", path: AJAX.PATH };
        this.params = {};
        this.STATUS = { OK: 1, ERROR: -1 };
        this.loader = {
            JS: function (k, m) {
                var j = this.fileName(k);
                var i = document.createElement("script");
                var l = JAX_WINDOW.Callback(["loadTimeout", this, k]);
                this.loading[k] = {
                    callback: m,
                    timeout: setTimeout(l, this.timeout),
                    status: this.STATUS.OK,
                    script: i
                };
                this.loading[k].message = JAX_WINDOW.Message.File(j);
                i.onerror = l;
                i.type = "text/javascript";
                i.src = k + this.fileRev(j);
                this.head.appendChild(i);
            },
            CSS: function (j, l) {
                var i = this.fileName(j);
                var k = document.createElement("link");
                k.rel = "stylesheet";
                k.type = "text/css";
                k.href = j + this.fileRev(i);
                this.loading[j] = {
                    callback: l,
                    message: JAX_WINDOW.Message.File(i),
                    status: this.STATUS.OK
                };
                this.head.appendChild(k);
                this.timer.create.call(this, [this.timer.file, j], k);
            }
        };
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

    fileURL(j) {
        var i;
        while ((i = j.match(/^\[([-._a-z0-9]+)\]/i)) && AJAX.PATH.hasOwnProperty(i[1])) {
            j = (AJAX.PATH[i[1]] || this.config.root) + j.substr(i[1].length + 2);
        }
        return j;
    }

    fileName(j) {
        var i = this.config.root;
        if (j.substr(0, i.length) === i) {
            j = "[" + this.name + "]" + j.substr(i.length);
        }
        do {
            var k = false;
            for (var l in AJAX.PATH) {
                if (AJAX.PATH.hasOwnProperty(l) && AJAX.PATH[l]) {
                    if (j.substr(0, AJAX.PATH[l].length) === AJAX.PATH[l]) {
                        j = "[" + l + "]" + j.substr(AJAX.PATH[l].length);
                        k = true;
                        break;
                    }
                }
            }
        } while (k);
        return j;
    }

    fileRev(j) {
        var i = JAX_WINDOW.cdnFileVersions[j] || JAX_WINDOW.cdnVersion || "";
        if (i) { i = "?V=" + i }
        return i;
    }

    urlRev(i) {
        return this.fileURL(i) + this.fileRev(i);
    }

    Require(k, n) {
        n = JAX_WINDOW.Callback(n); var l;
        if (k instanceof Object) {
            for (var j in k) {
                if (k.hasOwnProperty(j)) { l = j.toUpperCase(); k = k[j] }
            }
        } else {
            l = k.split(/\./).pop().toUpperCase();
        }
        if (this.params.noContrib && k.substr(0, 9) === "[Contrib]") {
            n(this.STATUS.ERROR);
        } else {
            k = this.fileURL(k);
            if (this.loaded[k]) {
                n(this.loaded[k]);
            } else {
                var m = {};
                m[l] = k;
                this.Load(m, n);
            }
        }
        return n;
    }

    Load(k, m) {
        m = JAX_WINDOW.Callback(m);
        var l;
        if (k instanceof Object) {
            for (var j in k) {
                if (k.hasOwnProperty(j)) { l = j.toUpperCase(); k = k[j] }
            }
        } else {
            l = k.split(/\./).pop().toUpperCase();
        }
        k = this.fileURL(k);
        if (this.loading[k]) {
            this.addHook(k, m);
        } else {
            this.head = AJAX.GET_HEAD(this.head);
            if (this.loader[l]) {
                this.loader[l].call(this, k, m);
            } else {
                throw Error("Can't load files of type " + l);
            }
        }
        return m;
    }

    LoadHook(l, m, k) {
        m = JAX_WINDOW.Callback(m);
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
            JAX_WINDOW.Message.Clear(j.message);
            clearTimeout(j.timeout);
            if (j.script) {
                if (AJAX.SCRIPTS.length === 0) {
                    setTimeout(function () {
                        for (var k = 0, j = AJAX.SCRIPTS.length; k < j; k++) {
                            JAX_WINDOW.Ajax.head.removeChild(AJAX.SCRIPTS[k]);
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
        JAX_WINDOW.Message.Set(["LoadFailed", "File failed to load: %1", i], null, 2000);
        JAX_WINDOW.Hub.signal.Post(["file load error", i]);
    }

    Styles(k, l) {
        var i = this.StyleString(k);
        if (i === "") { l = JAX_WINDOW.Callback(l); l() }
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
        j = JAX_WINDOW.Callback(j);
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
                    if (JAX_WINDOW.Object.isArray(n[o])) {
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
