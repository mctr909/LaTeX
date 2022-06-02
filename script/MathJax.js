///<reference path="math/html.js"/>
///<reference path="math/localization.js"/>
///<reference path="math/message.js"/>
///<reference path="math/hub.js"/>

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
			var a = function () {
				return function () {
					return arguments.callee.Init.call(this, arguments);
				};
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

		var CALLBACK = function (data) {
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
					return this.hook.apply(this.object, this.data.concat([].slice.call(arguments, 0)));
				}
			},
			reset: function () {
				delete this.called;
			},
			toString: function () {
				return this.hook.toString.apply(this.hook, arguments);
			}
		};
		var ISCALLBACK = function (f) {
			return (typeof (f) === "function" && f.isCallback);
		};
		var EVAL = function (code) {
			return eval.call(window, code);
		};
		var TESTEVAL = function () {
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
		var CONSTRUCTOR = function (args, i) {
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
		var DELAY = function (time, callback) {
			callback = CONSTRUCTOR(callback);
			callback.timeout = setTimeout(callback, time);
			return callback;
		};
		var WAITFOR = function (callback, signal) {
			callback = CONSTRUCTOR(callback);
			if (!callback.called) { WAITSIGNAL(callback, signal); signal.pending++ }
		};
		var WAITEXECUTE = function () {
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
		var WAITSIGNAL = function (callback, signals) {
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

		MathJax.Callback = CONSTRUCTOR;
		MathJax.Callback.Delay = DELAY;
		MathJax.Callback.After = AFTER;
		MathJax.Callback.ExecuteHooks = EXECUTEHOOKS;
		
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

		(function (e) {
			var a = window[e];
			if (!a) { a = window[e] = {} }
			var d = (navigator.vendor === "Apple Computer, Inc." && typeof navigator.vendorSub === "undefined");
			var g = 0;
			var h = function (i) {
				if (document.styleSheets && document.styleSheets.length > g) {
					g = document.styleSheets.length;
				}
				if (!i) {
					i = document.head || ((document.getElementsByTagName("head"))[0]);
					if (!i) { i = document.body }
				}
				return i;
			};
			var f = [];
			var c = function () {
				for (var k = 0, j = f.length; k < j; k++) { a.Ajax.head.removeChild(f[k]) }
				f = [];
			};
			var b = {};
			b[e] = "";
			b.a11y = "[MathJax]/extensions/a11y";
			b.Contrib = "https://cdn.mathjax.org/mathjax/contrib";
			a.Ajax = {
				loaded: {},
				loading: {},
				loadHooks: {},
				timeout: 15 * 1000,
				styleDelay: 1,
				config: { root: "", path: b },
				params: {},
				STATUS: { OK: 1, ERROR: -1 },
				fileURL: function (j) {
					var i;
					while ((i = j.match(/^\[([-._a-z0-9]+)\]/i)) && b.hasOwnProperty(i[1])) {
						j = (b[i[1]] || this.config.root) + j.substr(i[1].length + 2);
					}
					return j;
				},
				fileName: function (j) {
					var i = this.config.root;
					if (j.substr(0, i.length) === i) {
						j = "[" + e + "]" + j.substr(i.length);
					}
					do {
						var k = false;
						for (var l in b) {
							if (b.hasOwnProperty(l) && b[l]) {
								if (j.substr(0, b[l].length) === b[l]) {
									j = "[" + l + "]" + j.substr(b[l].length);
									k = true;
									break;
								}
							}
						}
					} while (k);
					return j;
				},
				fileRev: function (j) {
					var i = a.cdnFileVersions[j] || a.cdnVersion || "";
					if (i) { i = "?V=" + i }
					return i;
				},
				urlRev: function (i) {
					return this.fileURL(i) + this.fileRev(i);
				},
				Require: function (k, n) {
					n = a.Callback(n); var l;
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
				},
				Load: function (k, m) {
					m = a.Callback(m);
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
						this.head = h(this.head);
						if (this.loader[l]) {
							this.loader[l].call(this, k, m);
						} else {
							throw Error("Can't load files of type " + l);
						}
					}
					return m;
				},
				LoadHook: function (l, m, k) {
					m = a.Callback(m);
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
				},
				addHook: function (j, k, i) {
					if (!this.loadHooks[j]) {
						this.loadHooks[j] = new HOOKS();
					}
					this.loadHooks[j].Add(k, i);
					k.file = j;
				},
				removeHook: function (i) {
					if (this.loadHooks[i.file]) {
						this.loadHooks[i.file].Remove(i);
						if (!this.loadHooks[i.file].hooks.length) {
							delete this.loadHooks[i.file];
						}
					}
				},
				Preloading: function () {
					for (var l = 0, j = arguments.length; l < j; l++) {
						var k = this.fileURL(arguments[l]);
						if (!this.loading[k]) {
							this.loading[k] = { preloaded: true };
						}
					}
				},
				loader: {
					JS: function (k, m) {
						var j = this.fileName(k);
						var i = document.createElement("script");
						var l = a.Callback(["loadTimeout", this, k]);
						this.loading[k] = {
							callback: m,
							timeout: setTimeout(l, this.timeout),
							status: this.STATUS.OK,
							script: i
						};
						this.loading[k].message = a.Message.File(j);
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
							message: a.Message.File(i),
							status: this.STATUS.OK
						};
						this.head.appendChild(k);
						this.timer.create.call(this, [this.timer.file, j], k);
					}
				},
				timer: {
					create: function (j, i) {
						j = a.Callback(j);
						if (i.nodeName === "STYLE" && i.styleSheet && typeof (i.styleSheet.cssText) !== "undefined") {
							j(this.STATUS.OK);
						} else {
							if (window.chrome && i.nodeName === "LINK") {
								j(this.STATUS.OK);
							} else {
								if (d) {
									this.timer.start(this, [this.timer.checkSafari2, g++, j], this.styleDelay);
								} else {
									this.timer.start(this, [this.timer.checkLength, i, j], this.styleDelay);
								}
							}
						}
						return j;
					},
					start: function (j, i, k, l) {
						i = a.Callback(i);
						i.execute = this.execute;
						i.time = this.time;
						i.STATUS = j.STATUS;
						i.timeout = l || j.timeout;
						i.delay = i.total = k || 0;
						if (k) { setTimeout(i, k) }
						else { i() }
					},
					time: function (i) {
						this.total += this.delay;
						this.delay = Math.floor(this.delay * 1.05 + 5);
						if (this.total >= this.timeout) {
							i(this.STATUS.ERROR);
							return 1;
						}
						return 0;
					},
					file: function (j, i) {
						if (i < 0) { a.Ajax.loadTimeout(j) }
						else { a.Ajax.loadComplete(j) }
					},
					execute: function () {
						this.hook.call(this.object, this, this.data[0], this.data[1]);
					},
					checkSafari2: function (i, j, k) {
						if (i.time(k)) {
							return;
						}
						if (document.styleSheets.length > j && document.styleSheets[j].cssRules && document.styleSheets[j].cssRules.length) {
							k(i.STATUS.OK);
						} else {
							setTimeout(i, i.delay);
						}
					},
					checkLength: function (i, l, n) {
						if (i.time(n)) {
							return;
						}
						var m = 0;
						var j = (l.sheet || l.styleSheet);
						try {
							if ((j.cssRules || j.rules || []).length > 0) { m = 1 }
						} catch (k) {
							if (k.message.match(/protected variable|restricted URI/)) { m = 1 }
							else {
								if (k.message.match(/Security error/)) { m = 1 }
							}
						}
						if (m) {
							setTimeout(a.Callback([n, i.STATUS.OK]), 0);
						} else {
							setTimeout(i, i.delay);
						}
					}
				},
				loadComplete: function (i) {
					i = this.fileURL(i);
					var j = this.loading[i];
					if (j && !j.preloaded) {
						a.Message.Clear(j.message);
						clearTimeout(j.timeout);
						if (j.script) {
							if (f.length === 0) { setTimeout(c, 0) }
							f.push(j.script);
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
				},
				loadTimeout: function (i) {
					if (this.loading[i].timeout) {
						clearTimeout(this.loading[i].timeout);
					}
					this.loading[i].status = this.STATUS.ERROR;
					this.loadError(i); this.loadComplete(i);
				},
				loadError: function (i) {
					a.Message.Set(["LoadFailed", "File failed to load: %1", i], null, 2000);
					a.Hub.signal.Post(["file load error", i]);
				},
				Styles: function (k, l) {
					var i = this.StyleString(k);
					if (i === "") { l = a.Callback(l); l() }
					else {
						var j = document.createElement("style");
						j.type = "text/css";
						this.head = h(this.head);
						this.head.appendChild(j);
						if (j.styleSheet && typeof (j.styleSheet.cssText) !== "undefined") { j.styleSheet.cssText = i }
						else { j.appendChild(document.createTextNode(i)) }
						l = this.timer.create.call(this, l, j);
					}
					return l;
				},
				StyleString: function (n) {
					if (typeof (n) === "string") { return n }
					var k = "", o, m;
					for (o in n) {
						if (n.hasOwnProperty(o)) {
							if (typeof n[o] === "string") {
								k += o + " {" + n[o] + "}\n";
							} else {
								if (a.Object.isArray(n[o])) {
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
		})("MathJax");

		(function (d) {
			var b = window[d], e = "[" + d + "]";
			var c = b.Hub, a = b.Ajax, f = b.Callback;
			var g = MathJax.Object.Subclass({
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
					c.Insert(i.prototype, h);
					i.Augment(null, j);
					return this;
				},
				Translate: function (h, i) {
					throw Error(this.directory + "/" + this.JAXFILE + " failed to define the Translate() method");
				},
				Register: function (h) { },
				Config: function () {
					this.config = c.CombineConfig(this.id, this.config);
					if (this.config.Augment) { this.Augment(this.config.Augment) }
				},
				Startup: function () { },
				loadComplete: function (i) {
					if (i === "config.js") {
						return a.loadComplete(this.directory + "/" + i);
					} else {
						var h = new QUEUE();
						h.Push(
							c.Register.StartupHook("End Config", {}),
							["Post", c.Startup.signal, this.id + " Jax Config"],
							["Config", this],
							["Post", c.Startup.signal, this.id + " Jax Require"],
							[function (j) {
								return MathJax.Hub.Startup.loadArray(j.require, this.directory);
							}, this],
							[function (j, k) {
								return MathJax.Hub.Startup.loadArray(j.extensions, "extensions/" + k);
							}, this.config || {}, this.id],
							["Post", c.Startup.signal, this.id + " Jax Startup"],
							["Startup", this],
							["Post", c.Startup.signal, this.id + " Jax Ready"]
						);
						if (this.copyTranslate) {
							h.Push([function (j) {
								j.preProcess = j.preTranslate;
								j.Process = j.Translate;
								j.postProcess = j.postTranslate;
							}, this.constructor.prototype]);
						}
						return h.Push(["loadComplete", a, this.directory + "/" + i]);
					}
				}
			}, {
				id: "Jax",
				version: "2.7.1",
				directory: e + "/jax",
				extensionDir: e + "/extensions"
			});
			b.InputJax = g.Subclass({
				elementJax: "mml",
				sourceMenuTitle: ["Original", "Original Form"],
				copyTranslate: true,
				Process: function (l, q) {
					var j = f.Queue(), o;
					var k = this.elementJax;
					if (!b.Object.isArray(k)) { k = [k] }
					for (var n = 0, h = k.length; n < h; n++) {
						o = b.ElementJax.directory + "/" + k[n] + "/" + this.JAXFILE;
						if (!this.require) {
							this.require = [];
						} else {
							if (!b.Object.isArray(this.require)) { this.require = [this.require] }
						}
						this.require.push(o);
						j.Push(a.Require(o));
					}
					o = this.directory + "/" + this.JAXFILE;
					var p = j.Push(a.Require(o));
					if (!p.called) {
						this.constructor.prototype.Process = function () {
							if (!p.called) {
								return p;
							}
							throw Error(o + " failed to load properly");
						}
					}
					k = c.outputJax["jax/" + k[0]];
					if (k) {
						j.Push(a.Require(k[0].directory + "/" + this.JAXFILE));
					}
					return j.Push({});
				},
				needsUpdate: function (h) {
					var i = h.SourceElement();
					return (h.originalText !== b.HTML.getScript(i));
				},
				Register: function (h) {
					if (!c.inputJax) {
						c.inputJax = {};
					}
					c.inputJax[h] = this;
				}
			}, {
				id: "InputJax",
				version: "2.7.1",
				directory: g.directory + "/input",
				extensionDir: g.extensionDir
			});
			b.OutputJax = g.Subclass({
				copyTranslate: true,
				preProcess: function (j) {
					var i, h = this.directory + "/" + this.JAXFILE;
					this.constructor.prototype.preProcess = function (k) {
						if (!i.called) {
							return i;
						}
						throw Error(h + " failed to load properly");
					};
					i = a.Require(h);
					return i;
				},
				Register: function (i) {
					var h = c.outputJax;
					if (!h[i]) { h[i] = [] }
					if (h[i].length && (this.id === c.config.menuSettings.renderer || (h.order[this.id] || 0) < (h.order[h[i][0].id] || 0))) {
						h[i].unshift(this);
					} else {
						h[i].push(this);
					}
					if (!this.require) {
						this.require = []
					} else {
						if (!b.Object.isArray(this.require)) {
							this.require = [this.require];
						}
					}
					this.require.push(b.ElementJax.directory + "/" + (i.split(/\//)[1]) + "/" + this.JAXFILE);
				},
				Remove: function (h) { }
			}, {
				id: "OutputJax",
				version: "2.7.1",
				directory: g.directory + "/output",
				extensionDir: g.extensionDir,
				fontDir: e + (b.isPacked ? "" : "/..") + "/fonts",
				imageDir: e + (b.isPacked ? "" : "/..") + "/images"
			});
			b.ElementJax = g.Subclass({
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
					b.HTML.setScript(h, i);
					h.MathJax.state = this.STATE.UPDATE;
					return c.Update(h, j);
				},
				Reprocess: function (i) {
					var h = this.SourceElement();
					h.MathJax.state = this.STATE.UPDATE;
					return c.Reprocess(h, i);
				},
				Update: function (h) {
					return this.Rerender(h);
				},
				Rerender: function (i) {
					var h = this.SourceElement();
					h.MathJax.state = this.STATE.OUTPUT;
					return c.Process(h, i);
				},
				Remove: function (h) {
					if (this.hover) {
						this.hover.clear(this);
					}
					b.OutputJax[this.outputJax].Remove(this);
					if (!h) {
						c.signal.Post(["Remove Math", this.inputID]);
						this.Detach();
					}
				},
				needsUpdate: function () {
					return b.InputJax[this.inputJax].needsUpdate(this);
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
							i.id = this.inputID = b.ElementJax.GetID();
							this.newID = 1;
						}
					}
					h.originalText = b.HTML.getScript(i);
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
			b.ElementJax.prototype.STATE = b.ElementJax.STATE;
			b.OutputJax.Error = {
				id: "Error",
				version: "2.7.1",
				config: {},
				errors: 0,
				ContextMenu: function () {
					return b.Extension.MathEvents.Event.ContextMenu.apply(b.Extension.MathEvents.Event, arguments);
				},
				Mousedown: function () {
					return b.Extension.MathEvents.Event.AltContextMenu.apply(b.Extension.MathEvents.Event, arguments);
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
			b.InputJax.Error = {
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
