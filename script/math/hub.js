///<reference path="startup.js"/>

class HUB {
	constructor() {
		this.config = {
			root: "",
			config: [],
			styleSheets: [],
			styles: {
				".MathJax_Preview": { color: "#888" }
			},
			jax: [],
			extensions: [],
			preJax: null,
			postJax: null,
			displayAlign: "center",
			displayIndent: "0",
			preRemoveClass: "MathJax_Preview",
			showProcessingMessages: true,
			messageStyle: "normal",
			delayStartupUntil: "none",
			skipStartupTypeset: false,
			elements: [],
			positionToHash: true,
			showMathMenu: true,
			showMathMenuMSIE: true,
			menuSettings: {
				zoom: "None",
				CTRL: false,
				ALT: false,
				CMD: false,
				Shift: false,
				discoverable: false,
				zscale: "200%",
				renderer: null,
				font: "Auto",
				context: "MathJax",
				locale: null,
				mpContext: false,
				mpMouse: false,
				texHints: true,
				FastPreview: null,
				assistiveMML: null,
				inTabOrder: true,
				semantics: false
			},
			errorSettings: {
				message: ["[", ["MathProcessingError", "Math Processing Error"], "]"],
				style: { color: "#CC0000", "font-style": "italic" }
			},
			ignoreMMLattributes: {}
		};
		this.inputJax = {};
		this.outputJax = { order: {} };
		this.processSectionDelay = 50;
		this.processUpdateTime = 250;
		this.processUpdateDelay = 10;
		this.preProcessors = new HOOKS(true);
		this.signal = new SIGNAL("Hub");
		this.postInputHooks = new HOOKS(true);
		this.Register = {
			PreProcessor: function () {
				return MathJax.Hub.preProcessors.Add.apply(MathJax.Hub.preProcessors, arguments);
			},
			MessageHook: function () {
				return MathJax.Hub.signal.MessageHook.apply(MathJax.Hub.signal, arguments);
			},
			StartupHook: function () {
				return MathJax.Hub.Startup.signal.MessageHook.apply(MathJax.Hub.Startup.signal, arguments);
			},
			LoadHook: function () {
				return MathJax.Ajax.LoadHook.apply(MathJax.Ajax, arguments);
			}
		};
		this.UnRegister = {
			PreProcessor: function (a) {
				MathJax.Hub.preProcessors.Remove(a);
			},
			MessageHook: function (a) {
				MathJax.Hub.signal.RemoveHook(a);
			},
			StartupHook: function (a) {
				MathJax.Hub.Startup.signal.RemoveHook(a);
			},
			LoadHook: function (a) {
				MathJax.Ajax.removeHook(a);
			}
		};
		this.scriptAction = {
			Process: function (a) { },
			Update: function (b) {
				var a = b.MathJax.elementJax;
				if (a && a.needsUpdate()) {
					a.Remove(true);
					b.MathJax.state = a.STATE.UPDATE;
				} else {
					b.MathJax.state = a.STATE.PROCESSED;
				}
			},
			Reprocess: function (b) {
				var a = b.MathJax.elementJax;
				if (a) {
					a.Remove(true);
					b.MathJax.state = a.STATE.UPDATE;
				}
			},
			Rerender: function (b) {
				var a = b.MathJax.elementJax;
				if (a) {
					a.Remove(true);
					b.MathJax.state = a.STATE.OUTPUT;
				}
			}
		};
		this.Configured = MathJax.Callback({});
		this.Startup = new STARTUP();
	}

	SplitList(a) {
		if ("trim" in String.prototype) {
			return a.trim().split(/\s+/);
		} else {
			return a.replace(/^\s+/, "").replace(/\s+$/, "").split(/\s+/);
		}
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
			if (!b[g]) { b[g] = {} }
			e = b; b = b[g];
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
				return (a.MathJax.state === MathJax.ElementJax.STATE.PROCESSED ? 1 : -1);
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
			if (c == null) { c = "jax/mml" }
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
			var a = MathJax.Callback.Queue(
				["PreProcess", this, b.elements],
				["Process", this, b.elements]
			);
		}
		return a.Push(b.callback);
	}

	PreProcess(e, g) {
		var c = this.elementCallback(e, g);
		var b = MathJax.Callback.Queue();
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
		var a = MathJax.Callback.Queue(["Clear", this.signal]);
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
			if (!b[2]) { b = {} }
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
		var f = MathJax.ElementJax.STATE;
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
					c.MathJax = { state: f.PENDING };
				}
				if (c.MathJax.error) {
					delete c.MathJax.error;
				}
				if (c.MathJax.state !== f.PROCESSED) { g.scripts.push(c) }
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
			if (c && c.nodeName !== "#text") { c = null }
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
			if (f && !f.nodeValue.match(/\S/)) { f = f.previousSibling }
		}
		if (b.preRemoveClass && f && f.className === b.preRemoveClass) {
			a.MathJax.preview = f;
		}
		a.MathJax.checked = 1;
	}

	processInput(a) {
		var b, i = MathJax.ElementJax.STATE;
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
					a.start = c; this.RestartAfter(MathJax.Callback.Delay(1));
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
					return MathJax.Callback.After(["prepareOutput", this, c, f], b.restart);
				}
			}
			c.j++;
		}
		return null;
	}

	processOutput(h) {
		var b, g = MathJax.ElementJax.STATE, d, a = h.scripts.length;
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
					this.RestartAfter(MathJax.Callback.Delay(this.processUpdateDelay));
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
		return MathJax.Callback.After(["process" + a, this, c], b.restart);
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
		var c = MathJax.HTML.Element(
			"span",
			{
				className: "MathJax_Error",
				jaxID: "Error",
				isMathJax: true,
				id: b.MathJax.error.inputID + "-Frame"
			},
			[["span", null, a]]
		);
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
			restart: MathJax.Callback(a)
		});
	}

	elementCallback(c, f) {
		if (f == null && (MathJax.Object.isArray(c) || typeof c === "function")) {
			try {
				MathJax.Callback(c);
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
		if (!f) { f = {} }
		return { count: c.length, elements: (c.length === 1 ? c[0] : c), callback: f };
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

	Insert(c, a) {
		for (var b in a) {
			if (a.hasOwnProperty(b)) {
				if (typeof a[b] === "object" && !(MathJax.Object.isArray(a[b])) && (typeof c[b] === "object" || typeof c[b] === "function")) {
					this.Insert(c[b], a[b]);
				} else {
					c[b] = a[b];
				}
			}
		}
		return c;
	}

	getTabOrder(a) {
		return this.config.menuSettings.inTabOrder ? 0 : -1;
	}
}
