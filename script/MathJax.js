///<reference path="math/html.js"/>
///<reference path="math/localization.js"/>
///<reference path="math/message.js"/>
///<reference path="math/hub.js"/>
///<reference path="math/ajax.js"/>

var CALLBACK = null;
var ISCALLBACK = null;
var EVAL = null;
var TESTEVAL = null;
var CONSTRUCTOR = null;
var WAITSIGNAL = null;
var WAITEXECUTE = null;
var WAITFOR = null;
var JAX_WINDOW = null;

if (document.getElementById && document.childNodes && document.createElement) {
	if (!(window.MathJax && MathJax.Hub)) {
		if (window.MathJax) {
			window.MathJax = { AuthorConfig: window.MathJax };
		} else {
			window.MathJax = {};
		}

		(function (d) {
			var b = window[d];
			if (!b) {
				b = window[d] = {};
			}
			var e = [];
			var a = function () {
				return function () {
					return arguments.callee.Init.call(this, arguments);
				};
			};
			var c = function (f) {
				var g = f.constructor;
				if (!g) {
					g = function () { }
				}
				for (var h in f) {
					if (h !== "constructor" && f.hasOwnProperty(h)) {
						g[h] = f[h];
					}
				}
				return g;
			};
			b.Object = c({
				constructor: a(),
				Subclass: function (f, h) {
					var g = a();
					g.SUPER = this;
					g.Init = this.Init;
					g.Subclass = this.Subclass;
					g.Augment = this.Augment;
					g.protoFunction = this.protoFunction;
					g.can = this.can;
					g.has = this.has;
					g.isa = this.isa;
					g.prototype = new this(e);
					g.prototype.constructor = g;
					g.Augment(f, h);
					return g;
				},
				Init: function (f) {
					var g = this;
					if (f.length === 1 && f[0] === e) {
						return g;
					}
					if (!(g instanceof f.callee)) {
						g = new f.callee(e);
					}
					return g.Init.apply(g, f) || g;
				},
				Augment: function (f, g) {
					var h;
					if (f != null) {
						for (h in f) {
							if (f.hasOwnProperty(h)) {
								this.protoFunction(h, f[h]);
							}
						}
						if (f.toString !== this.prototype.toString && f.toString !== {}.toString) {
							this.protoFunction("toString", f.toString);
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
				protoFunction: function (g, f) {
					this.prototype[g] = f;
					if (typeof f === "function") {
						f.SUPER = this.SUPER.prototype;
					}
				},
				prototype: {
					Init: function () { },
					SUPER: function (f) {
						return f.callee.SUPER;
					},
					can: function (f) {
						return typeof (this[f]) === "function";
					},
					has: function (f) {
						return typeof (this[f]) !== "undefined";
					},
					isa: function (f) {
						return (f instanceof Object) && (this instanceof f);
					}
				},
				can: function (f) {
					return this.prototype.can.call(this, f);
				},
				has: function (f) {
					return this.prototype.has.call(this, f);
				},
				isa: function (g) {
					var f = this;
					while (f) {
						if (f === g) {
							return true;
						} else {
							f = f.SUPER;
						}
					}
					return false;
				},
				SimpleSUPER: c({
					constructor: function (f) {
						return this.SimpleSUPER.define(f);
					},
					define: function (f) {
						var h = {};
						if (f != null) {
							for (var g in f) {
								if (f.hasOwnProperty(g)) {
									h[g] = this.wrap(g, f[g]);
								}
							}
							if (f.toString !== this.prototype.toString && f.toString !== {}.toString) {
								h.toString = this.wrap("toString", f.toString);
							}
						}
						return h;
					},
					wrap: function (i, h) {
						if (typeof (h) !== "function" || !h.toString().match(/\.\s*SUPER\s*\(/)) {
							return h;
						}
						var g = function () {
							this.SUPER = g.SUPER[i];
							try {
								var f = h.apply(this, arguments);
							} catch (j) {
								delete this.SUPER;
								throw j;
							}
							delete this.SUPER;
							return f;
						};
						g.toString = function () {
							return h.toString.apply(h, arguments)
						};
						return g;
					}
				})
			});
			b.Object.isArray = Array.isArray || function (f) {
				return Object.prototype.toString.call(f) === "[object Array]";
			};
			b.Object.Array = Array;
		})("MathJax");

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
			cb.toString = CALLBACK.prototype.toString;
			return cb;
		};
		CALLBACK.prototype = {
			isCallback: true,
			hook: function () { },
			data: [],
			object: window,
			execute: function () {
				if (!this.called || this.autoReset) {
					this.called = !this.autoReset;
					var arr = [].slice.call(arguments, 0);
					return this.hook.apply(this.object, this.data.concat(arr));
				}
			},
			reset: function () {
				delete this.called;
			},
			toString: function () {
				return this.hook.toString.apply(this.hook, arguments);
			}
		};

		ISCALLBACK = function (f) {
			return (typeof (f) === "function" && f.isCallback);
		};
		EVAL = function (code) {
			return eval.call(window, code);
		};
		TESTEVAL = function () {
			EVAL("var __TeSt_VaR__ = 1");
			if (window.__TeSt_VaR__) {
				try { delete window.__TeSt_VaR__ }
				catch (error) { window.__TeSt_VaR__ = null }
			} else {
				if (window.execScript) {
					EVAL = function (code) {
						BASE.__code = code;
						code = "try {" + BASENAME + ".__result = eval(" + BASENAME + ".__code)} catch(err) {" + BASENAME + ".__result = err}";
						window.execScript(code);
						var result = BASE.__result;
						delete BASE.__result;
						delete BASE.__code;
						if (result instanceof Error) { throw result }
						return result;
					}
				} else {
					EVAL = function (code) {
						BASE.__code = code;
						code = "try {" + BASENAME + ".__result = eval(" + BASENAME + ".__code)} catch(err) {" + BASENAME + ".__result = err}";
						var head = (document.getElementsByTagName("head"))[0];
						if (!head) { head = document.body }
						var script = document.createElement("script");
						script.appendChild(document.createTextNode(code));
						head.appendChild(script);
						head.removeChild(script);
						var result = BASE.__result;
						delete BASE.__result;
						delete BASE.__code;
						if (result instanceof Error) { throw result }
						return result;
					}
				}
			}
			TESTEVAL = null;
		};
		CONSTRUCTOR = function (args, i) {
			if (arguments.length > 1) {
				if (arguments.length === 2 &&
					!(typeof arguments[0] === "function") &&
					arguments[0] instanceof Object &&
					typeof arguments[1] === "number"
				) {
					args = [].slice.call(args, i);
				} else {
					args = [].slice.call(arguments, 0);
				}
			}
			if (MathJax.Object.isArray(args) && args.length === 1) {
				args = args[0];
			}
			if (typeof args === "function") {
				if (args.execute === CALLBACK.prototype.execute) {
					return args;
				}
				return CALLBACK({
					hook: args
				});
			} else {
				if (MathJax.Object.isArray(args)) {
					if (typeof (args[0]) === "string" &&
						args[1] instanceof Object &&
						typeof args[1][args[0]] === "function"
					) {
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
						if (TESTEVAL) {
							TESTEVAL();
						}
						return CALLBACK({
							hook: EVAL,
							data: [args]
						});
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
		};
		WAITSIGNAL = function (callback, signals) {
			if (!MathJax.Object.isArray(signals)) { signals = [signals] }
			if (!callback.signal) {
				callback.oldExecute = callback.execute;
				callback.execute = WAITEXECUTE;
				callback.signal = signals;
			} else {
				if (signals.length === 1) { callback.signal.push(signals[0]) }
				else { callback.signal = callback.signal.concat(signals) }
			}
		};
		WAITEXECUTE = function () {
			var signals = this.signal;
			delete this.signal;
			this.execute = this.oldExecute;
			delete this.oldExecute;
			var result = this.execute.apply(this, arguments);
			if (ISCALLBACK(result) && !result.called) { WAITSIGNAL(result, signals) }
			else {
				for (var i = 0, m = signals.length; i < m; i++) {
					signals[i].pending--;
					if (signals[i].pending <= 0) { signals[i].call() }
				}
			}
		};
		WAITFOR = function (callback, signal) {
			callback = CONSTRUCTOR(callback);
			if (!callback.called) { WAITSIGNAL(callback, signal); signal.pending++ }
		};

		(function (name) {
			var mathJax = window[name];
			var DELAY = function (time, callback) {
				callback = CONSTRUCTOR(callback);
				callback.timeout = setTimeout(callback, time);
				return callback;
			};
			var AFTER = function (callback) {
				callback = CONSTRUCTOR(callback);
				callback.pending = 0;
				for (var i = 1, m = arguments.length; i < m; i++) {
					if (arguments[i]) { WAITFOR(arguments[i], callback) }
				}
				if (callback.pending === 0) {
					var result = callback();
					if (ISCALLBACK(result)) { callback = result }
				}
				return callback;
			};
			var EXECUTEHOOKS = function (hooks, data, reset) {
				if (!hooks) { return null }
				if (!MathJax.Object.isArray(hooks)) { hooks = [hooks] }
				if (!MathJax.Object.isArray(data)) { data = (data == null ? [] : [data]) }
				var handler = new HOOKS(reset);
				for (var i = 0, m = hooks.length; i < m; i++) { handler.Add(hooks[i]) }
				return handler.Execute.apply(handler, data);
			};
			mathJax.Callback = CONSTRUCTOR;
			mathJax.Callback.Delay = DELAY;
			mathJax.Callback.After = AFTER;
			mathJax.Callback.ExecuteHooks = EXECUTEHOOKS;
		})("MathJax");

		MathJax.isPacked = true;
		MathJax.version = "2.7.1";
		MathJax.fileversion = "2.7.1";
		MathJax.cdnVersion = "2.7.1";
		MathJax.cdnFileVersions = {};
		MathJax.HTML = new Html();
		MathJax.Localization = new LOCAL();
		MathJax.Message = new MESSAGE();
		MathJax.Extension = {};
		MathJax.Hub = new HUB();
		MathJax.Hub.Insert(MathJax.Hub.config.styles, MathJax.Message.styles);
		MathJax.Hub.Insert(MathJax.Hub.config.styles, { ".MathJax_Error": MathJax.Hub.config.errorSettings.style });

		JAX_WINDOW = window["MathJax"];
		if (!JAX_WINDOW) {
			JAX_WINDOW = window["MathJax"] = {};
		}
		JAX_WINDOW.Ajax = new AJAX("MathJax");

		(function (d) {
			var mathJax = window[d];
			var nameTag = "[" + d + "]";
			var hub = mathJax.Hub;
			var ajax = mathJax.Ajax;
			var callBack = mathJax.Callback;
			var g = mathJax.Object.Subclass({
				JAXFILE: "jax.js",
				require: null,
				config: {},
				Init: function (i, h) {
					if (arguments.length === 0) {
						return this;
					}
					return (this.constructor.Subclass(i, h))();
				},
				Augment: function (k, j) {
					var i = this.constructor, h = {};
					if (k != null) {
						for (var l in k) {
							if (k.hasOwnProperty(l)) {
								if (typeof k[l] === "function") {
									i.protoFunction(l, k[l]);
								} else {
									h[l] = k[l];
								}
							}
						}
						if (k.toString !== i.prototype.toString && k.toString !== {}.toString) {
							i.protoFunction("toString", k.toString);
						}
					}
					hub.Insert(i.prototype, h);
					i.Augment(null, j);
					return this;
				},
				Translate: function (h, i) {
					throw Error(this.directory + "/" + this.JAXFILE + " failed to define the Translate() method");
				},
				Register: function (h) { },
				Config: function () {
					this.config = hub.CombineConfig(this.id, this.config);
					if (this.config.Augment) { this.Augment(this.config.Augment) }
				},
				Startup: function () { },
				loadComplete: function (i) {
					if (i === "config.js") {
						return ajax.loadComplete(this.directory + "/" + i);
					} else {
						var h = new QUEUE();
						h.Push(
							hub.Register.StartupHook("End Config", {}),
							["Post", hub.Startup.signal, this.id + " Jax Config"],
							["Config", this],
							["Post", hub.Startup.signal, this.id + " Jax Require"],
							[function (j) {
								return MathJax.Hub.Startup.loadArray(j.require, this.directory);
							}, this],
							[function (j, k) {
								return MathJax.Hub.Startup.loadArray(j.extensions, "extensions/" + k);
							}, this.config || {}, this.id],
							["Post", hub.Startup.signal, this.id + " Jax Startup"],
							["Startup", this],
							["Post", hub.Startup.signal, this.id + " Jax Ready"]
						);
						if (this.copyTranslate) {
							h.Push([function (j) {
								j.preProcess = j.preTranslate;
								j.Process = j.Translate;
								j.postProcess = j.postTranslate;
							}, this.constructor.prototype]);
						}
						return h.Push(["loadComplete", ajax, this.directory + "/" + i]);
					}
				}
			}, {
				id: "Jax",
				version: "2.7.1",
				directory: nameTag + "/jax",
				extensionDir: nameTag + "/extensions"
			});
			mathJax.InputJax = g.Subclass({
				elementJax: "mml",
				sourceMenuTitle: ["Original", "Original Form"],
				copyTranslate: true,
				Process: function (l, q) {
					var j = callBack.Queue(), o;
					var k = this.elementJax;
					if (!mathJax.Object.isArray(k)) { k = [k] }
					for (var n = 0, h = k.length; n < h; n++) {
						o = mathJax.ElementJax.directory + "/" + k[n] + "/" + this.JAXFILE;
						if (!this.require) {
							this.require = [];
						} else {
							if (!mathJax.Object.isArray(this.require)) { this.require = [this.require] }
						}
						this.require.push(o);
						j.Push(ajax.Require(o));
					}
					o = this.directory + "/" + this.JAXFILE;
					var p = j.Push(ajax.Require(o));
					if (!p.called) {
						this.constructor.prototype.Process = function () {
							if (!p.called) {
								return p;
							}
							throw Error(o + " failed to load properly");
						}
					}
					k = hub.outputJax["jax/" + k[0]];
					if (k) {
						j.Push(ajax.Require(k[0].directory + "/" + this.JAXFILE));
					}
					return j.Push({});
				},
				needsUpdate: function (h) {
					var i = h.SourceElement();
					return (h.originalText !== mathJax.HTML.getScript(i));
				},
				Register: function (h) {
					if (!hub.inputJax) {
						hub.inputJax = {};
					}
					hub.inputJax[h] = this;
				}
			}, {
				id: "InputJax",
				version: "2.7.1",
				directory: g.directory + "/input",
				extensionDir: g.extensionDir
			});
			mathJax.OutputJax = g.Subclass({
				copyTranslate: true,
				preProcess: function (j) {
					var i, h = this.directory + "/" + this.JAXFILE;
					this.constructor.prototype.preProcess = function (k) {
						if (!i.called) {
							return i;
						}
						throw Error(h + " failed to load properly");
					};
					i = ajax.Require(h);
					return i;
				},
				Register: function (i) {
					var h = hub.outputJax;
					if (!h[i]) { h[i] = [] }
					if (h[i].length && (this.id === hub.config.menuSettings.renderer || (h.order[this.id] || 0) < (h.order[h[i][0].id] || 0))) {
						h[i].unshift(this);
					} else {
						h[i].push(this);
					}
					if (!this.require) {
						this.require = []
					} else {
						if (!mathJax.Object.isArray(this.require)) {
							this.require = [this.require];
						}
					}
					this.require.push(mathJax.ElementJax.directory + "/" + (i.split(/\//)[1]) + "/" + this.JAXFILE);
				},
				Remove: function (h) { }
			}, {
				id: "OutputJax",
				version: "2.7.1",
				directory: g.directory + "/output",
				extensionDir: g.extensionDir,
				fontDir: nameTag + (mathJax.isPacked ? "" : "/..") + "/fonts",
				imageDir: nameTag + (mathJax.isPacked ? "" : "/..") + "/images"
			});
			mathJax.ElementJax = g.Subclass({
				Init: function (i, h) {
					return this.constructor.Subclass(i, h);
				},
				inputJax: null,
				outputJax: null,
				inputID: null,
				originalText: "",
				mimeType: "",
				sourceMenuTitle: ["MathMLcode", "MathML Code"],
				Text: function (i, j) {
					var h = this.SourceElement();
					mathJax.HTML.setScript(h, i);
					h.MathJax.state = this.STATE.UPDATE;
					return hub.Update(h, j);
				},
				Reprocess: function (i) {
					var h = this.SourceElement();
					h.MathJax.state = this.STATE.UPDATE;
					return hub.Reprocess(h, i);
				},
				Update: function (h) {
					return this.Rerender(h);
				},
				Rerender: function (i) {
					var h = this.SourceElement();
					h.MathJax.state = this.STATE.OUTPUT;
					return hub.Process(h, i);
				},
				Remove: function (h) {
					if (this.hover) {
						this.hover.clear(this);
					}
					mathJax.OutputJax[this.outputJax].Remove(this);
					if (!h) {
						hub.signal.Post(["Remove Math", this.inputID]);
						this.Detach();
					}
				},
				needsUpdate: function () {
					return mathJax.InputJax[this.inputJax].needsUpdate(this);
				},
				SourceElement: function () {
					return document.getElementById(this.inputID);
				},
				Attach: function (i, j) {
					var h = i.MathJax.elementJax;
					if (i.MathJax.state === this.STATE.UPDATE) {
						h.Clone(this);
					} else {
						h = i.MathJax.elementJax = this;
						if (i.id) {
							this.inputID = i.id;
						} else {
							i.id = this.inputID = mathJax.ElementJax.GetID();
							this.newID = 1;
						}
					}
					h.originalText = mathJax.HTML.getScript(i);
					h.inputJax = j;
					if (h.root) { h.root.inputID = h.inputID }
					return h;
				},
				Detach: function () {
					var h = this.SourceElement();
					if (!h) {
						return;
					}
					try {
						delete h.MathJax;
					} catch (i) {
						h.MathJax = null;
					}
					if (this.newID) { h.id = "" }
				},
				Clone: function (h) {
					var i;
					for (i in this) {
						if (!this.hasOwnProperty(i)) {
							continue;
						}
						if (typeof (h[i]) === "undefined" && i !== "newID") {
							delete this[i];
						}
					}
					for (i in h) {
						if (!h.hasOwnProperty(i)) {
							continue;
						}
						if (typeof (this[i]) === "undefined" || (this[i] !== h[i] && i !== "inputID")) {
							this[i] = h[i];
						}
					}
				}
			}, {
				id: "ElementJax",
				version: "2.7.1",
				directory: g.directory + "/element",
				extensionDir: g.extensionDir,
				ID: 0,
				STATE: { PENDING: 1, PROCESSED: 2, UPDATE: 3, OUTPUT: 4 },
				GetID: function () {
					this.ID++;
					return "MathJax-Element-" + this.ID;
				},
				Subclass: function () {
					var h = g.Subclass.apply(this, arguments);
					h.loadComplete = this.prototype.loadComplete;
					return h;
				}
			});
			mathJax.ElementJax.prototype.STATE = mathJax.ElementJax.STATE;
			mathJax.OutputJax.Error = {
				id: "Error",
				version: "2.7.1",
				config: {},
				errors: 0,
				ContextMenu: function () {
					return mathJax.Extension.MathEvents.Event.ContextMenu.apply(mathJax.Extension.MathEvents.Event, arguments);
				},
				Mousedown: function () {
					return mathJax.Extension.MathEvents.Event.AltContextMenu.apply(mathJax.Extension.MathEvents.Event, arguments);
				},
				getJaxFromMath: function (h) {
					return (h.nextSibling.MathJax || {}).error;
				},
				Jax: function (j, i) {
					var h = MathJax.Hub.inputJax[i.type.replace(/ *;(.|\s)*/, "")];
					this.errors++;
					return {
						inputJax: (h || { id: "Error" }).id,
						outputJax: "Error",
						inputID: "MathJax-Error-" + this.errors,
						sourceMenuTitle: ["ErrorMessage", "Error Message"],
						sourceMenuFormat: "Error",
						originalText: MathJax.HTML.getScript(i),
						errorText: j
					};
				}
			};
			mathJax.InputJax.Error = {
				id: "Error",
				version: "2.7.1",
				config: {},
				sourceMenuTitle: ["Original", "Original Form"]
			}
		})("MathJax");

		(function (o) {
			var h = window[o];
			if (!h) { h = window[o] = {} }
			var d = h.Hub;
			var s = d.Startup;
			var w = d.config;
			var g = document.head || (document.getElementsByTagName("head")[0]);
			if (!g) { g = document.childNodes[0] }
			var b = (document.documentElement || document).getElementsByTagName("script");
			if (b.length === 0 && g.namespaceURI) {
				b = document.getElementsByTagNameNS(g.namespaceURI, "script");
			}
			var f = new RegExp("(^|/)" + o + "\\.js(\\?.*)?$");
			for (var q = b.length - 1; q >= 0; q--) {
				if ((b[q].src || "").match(f)) {
					s.script = b[q].innerHTML;
					if (RegExp.$2) {
						var t = RegExp.$2.substr(1).split(/\&/);
						for (var p = 0, l = t.length; p < l; p++) {
							var n = t[p].match(/(.*)=(.*)/);
							if (n) { s.params[unescape(n[1])] = unescape(n[2]) }
							else { s.params[t[p]] = true }
						}
					}
					w.root = b[q].src.replace(/(^|\/)[^\/]*(\?.*)?$/, "");
					h.Ajax.config.root = w.root;
					h.Ajax.params = s.params;
					break;
				}
			}
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
					var i = j[d.Browser];
					if (i) {
						return i(d.Browser);
					}
					return null;
				}
			};
			var e = k
				.replace(/^Mozilla\/(\d+\.)+\d+ /, "")
				.replace(/[a-z][-a-z0-9._: ]+\/\d+[^ ]*-[^ ]*\.([a-z][a-z])?\d+ /i, "")
				.replace(/Gentoo |Ubuntu\/(\d+\.)*\d+ (\([^)]*\) )?/, "");
			d.Browser = d.Insert(d.Insert(new String("Unknown"), { version: "0.0" }), a);
			for (var v in a) {
				if (a.hasOwnProperty(v)) {
					if (a[v] && v.substr(0, 2) === "is") {
						v = v.slice(2);
						if (v === "Mac" || v === "PC") {
							continue;
						}
						d.Browser = d.Insert(new String(v), a);
						var r = new RegExp(".*(Version/| Trident/.*; rv:)((?:\\d+\\.)+\\d+)|.*(" + v + ")"
							+ (v == "MSIE" ? " " : "/")
							+ "((?:\\d+\\.)*\\d+)|(?:^|\\(| )([a-z][-a-z0-9._: ]+|(?:Apple)?WebKit)/((?:\\d+\\.)+\\d+)"
						);
						var u = r.exec(e) || ["", "", "", "unknown", "0.0"];
						d.Browser.name = (u[1] != "" ? v : (u[3] || u[5]));
						d.Browser.version = u[2] || u[4] || u[6];
						break;
					}
				}
			}
			try {
				d.Browser.Select({
					Safari: function (j) {
						var i = parseInt((String(j.version).split("."))[0]);
						if (i > 85) {
							j.webkit = j.version;
						}
						if (i >= 538) {
							j.version = "8.0";
						} else {
							if (i >= 537) { j.version = "7.0"; }
							else {
								if (i >= 536) { j.version = "6.0"; }
								else {
									if (i >= 534) { j.version = "5.1"; }
									else {
										if (i >= 533) { j.version = "5.0"; }
										else {
											if (i >= 526) { j.version = "4.0"; }
											else {
												if (i >= 525) { j.version = "3.1"; }
												else {
													if (i > 500) { j.version = "3.0"; }
													else {
														if (i > 400) { j.version = "2.0"; }
														else {
															if (i > 85) { j.version = "1.0"; }
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
						j.noContextMenu = j.isMobile
					},
					Firefox: function (j) {
						if ((j.version === "0.0" || k.match(/Firefox/) == null) && navigator.product === "Gecko") {
							var m = k.match(/[\/ ]rv:(\d+\.\d.*?)[\) ]/);
							if (m) {
								j.version = m[1];
							} else {
								var i = (navigator.buildID || navigator.productSub || "0").substr(0, 8);
								if (i >= "20111220") { j.version = "9.0" }
								else {
									if (i >= "20111120") { j.version = "8.0" }
									else {
										if (i >= "20110927") { j.version = "7.0" }
										else {
											if (i >= "20110816") { j.version = "6.0" }
											else {
												if (i >= "20110621") { j.version = "5.0" }
												else {
													if (i >= "20110320") { j.version = "4.0" }
													else {
														if (i >= "20100121") { j.version = "3.6" }
														else {
															if (i >= "20090630") { j.version = "3.5" }
															else {
																if (i >= "20080617") { j.version = "3.0" }
																else { if (i >= "20061024") { j.version = "2.0" } }
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
						if (document.documentMode < 10 && !s.params.NoMathPlayer) {
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
				})
			} catch (c) {
				console.error(c.message);
			}
			d.Browser.Select(MathJax.Message.browsers);
			if (h.AuthorConfig && typeof h.AuthorConfig.AuthorInit === "function") {
				h.AuthorConfig.AuthorInit();
			}
			d.queue = new QUEUE();
			d.queue.Push(
				["Post", s.signal, "Begin"],
				["Config", s],
				["Cookie", s],
				["Styles", s],
				["Message", s],
				function () {
					var i = new QUEUE(s.Jax(), s.Extensions());
					return i.Push({});
				},
				["Menu", s],
				s.onLoad(),
				function () {
					MathJax.isReady = true;
				},
				["Typeset", s],
				["Hash", s],
				["MenuZoom", s],
				["Post", s.signal, "End"]
			);
		})("MathJax")
	}
};
