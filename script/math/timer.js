///<reference path="ajax.js"/>

class TIMER {
    start(ajax, i, timeOut, l) {
        i = JAX_WINDOW.Callback(i);
        i.execute = this.execute;
        i.time = this.time;
        i.STATUS = ajax.STATUS;
        i.timeout = l || ajax.timeout;
        i.delay = i.total = timeOut || 0;
        if (timeOut) {
            setTimeout(i, timeOut);
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
        if (i < 0) { JAX_WINDOW.Ajax.loadTimeout(j) }
        else { JAX_WINDOW.Ajax.loadComplete(j) }
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
            setTimeout(JAX_WINDOW.Callback([n, i.STATUS.OK]), 0);
        } else {
            setTimeout(i, i.delay);
        }
    }
}
