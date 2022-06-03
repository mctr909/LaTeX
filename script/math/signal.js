///<reference path="../MathJax.js"/>

class QUEUE {
    constructor() {
        this.pending = this.running = 0;
        this.queue = [];
        this.Push.apply(this, arguments);
    }

    Push() {
        var callback;
        for (var i = 0, m = arguments.length; i < m; i++) {
            callback = CONSTRUCTOR(arguments[i]);
            if (callback === arguments[i] && !callback.called) {
                callback = CONSTRUCTOR(["wait", this, callback]);
            }
            this.queue.push(callback);
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

class SIGNAL extends QUEUE {
    constructor(name) {
        super();
        this.name = name;
        this.posted = [];
        this.listeners = new HOOKS(true);
        this.posting = false;
        this.callback = null;
    }

    Post(message, callback, forget) {
        callback = CONSTRUCTOR(callback);
        if (this.posting || this.pending) {
            this.Push(["Post", this, message, callback, forget]);
        } else {
            this.callback = callback; callback.reset();
            if (!forget) { this.posted.push(message) }
            this.Suspend();
            this.posting = true;
            var result = this.listeners.Execute(message);
            if (ISCALLBACK(result) && !result.called) { WAITFOR(result, this) }
            this.Resume();
            this.posting = false;
            if (!this.pending) { this.call() }
        }
        return callback;
    }

    Clear(callback) {
        callback = CONSTRUCTOR(callback);
        if (this.posting || this.pending) {
            callback = this.Push(["Clear", this, callback]);
        } else {
            this.posted = [];
            callback();
        }
        return callback;
    }

    call() {
        this.callback(this);
        this.Process();
    }

    Interest(callback, ignorePast, priority) {
        callback = CONSTRUCTOR(callback);
        this.listeners.Add(callback, priority);
        if (!ignorePast) {
            for (var i = 0, m = this.posted.length; i < m; i++) {
                callback.reset();
                var result = callback(this.posted[i]);
                if (ISCALLBACK(result) && i === this.posted.length - 1) { WAITFOR(result, this) }
            }
        }
        return callback;
    }

    NoInterest(callback) {
        this.listeners.Remove(callback);
    }

    MessageHook(msg, callback, priority) {
        callback = CONSTRUCTOR(callback);
        if (!this.hooks) {
            this.hooks = {};
            this.Interest(["ExecuteHooks", this]);
        }
        if (!this.hooks[msg]) { this.hooks[msg] = new HOOKS(true) }
        this.hooks[msg].Add(callback, priority);
        for (var i = 0, m = this.posted.length; i < m; i++) {
            if (this.posted[i] == msg) {
                callback.reset();
                callback(this.posted[i]);
            }
        }
        callback.msg = msg;
        return callback;
    }

    ExecuteHooks(msg) {
        var type = (MathJax.Object.isArray(msg) ? msg[0] : msg);
        if (!this.hooks[type]) { return null }
        return this.hooks[type].Execute(msg);
    }

    RemoveHook(hook) {
        this.hooks[hook.msg].Remove(hook);
    }
}
