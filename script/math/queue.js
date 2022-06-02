///<reference path="../MathJax.js"/>

class QUEUE {
    constructor(q = []) {
        this.pending = this.running = 0;
        this.queue = q;
        this.Push.apply(this, arguments);
    }

    Push() {
        var callback;
        for (var i = 0, m = arguments.length; i < m; i++) {
            callback = CONSTRUCTOR(arguments[i]);
            if (callback === arguments[i] && !callback.called) {
                callback = CONSTRUCTOR(["wait", this, callback]);
            } this.queue.push(callback)
        }
        if (!this.running && !this.pending) { this.Process() }
        return callback;
    }

    Process(queue) {
        while (!this.running && !this.pending && this.queue.length) {
            var callback = this.queue[0];
            queue = this.queue.slice(1);
            this.queue = [];
            this.Suspend();
            var result = callback();
            this.Resume();
            if (queue.length) { this.queue = queue.concat(this.queue) }
            if (ISCALLBACK(result) && !result.called) { WAITFOR(result, this) }
        }
    }

    Suspend() {
        this.running++;
    }

    Resume() {
        if (this.running) { this.running-- }
    }

    call() {
        this.Process.apply(this, arguments);
    }

    wait(callback) {
        return callback;
    }
}
