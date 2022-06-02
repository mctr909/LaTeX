class HOOKS {
    constructor(reset) {
        this.hooks = [];
        this.remove = [];
        this.reset = reset;
        this.running = false;
    }

    Add(hook, priority) {
        if (priority == null) { priority = 10 }
        if (!ISCALLBACK(hook)) { hook = CONSTRUCTOR(hook) }
        hook.priority = priority;
        var i = this.hooks.length;
        while (i > 0 && priority < this.hooks[i - 1].priority) { i-- }
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
            if (this.reset) { this.hooks[i].reset() }
            var result = this.hooks[i].apply(window, arguments);
            if (ISCALLBACK(result) && !result.called) { callbacks.push(result) }
        }
        this.running = false;
        if (this.remove.length) { this.RemovePending() }
        if (callbacks.length === 1) { return null }
        if (callbacks.length === 2) { return callbacks[1] }
        return AFTER.apply({}, callbacks);
    }

    RemovePending() {
        this.remove = this.remove.sort();
        for (var i = this.remove.length - 1; i >= 0; i--) {
            this.hooks.splice(i, 1);
        }
        this.remove = [];
    }
}
