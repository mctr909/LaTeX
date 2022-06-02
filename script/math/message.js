class MESSAGE {
	constructor() {
		this.ready = false;
		this.log = [{}];
		this.current = null;
		this.textNodeBug = (navigator.vendor === "Apple Computer, Inc." &&
			typeof navigator.vendorSub === "undefined"
		) || (window.hasOwnProperty &&
			window.hasOwnProperty("konqueror")
		);
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
		if (a) { this.ready = true }
		if (!document.body || !this.ready) { return false }
		if (this.div && this.div.parentNode == null) {
			this.div = document.getElementById("MathJax_Message");
			if (this.div) { this.text = this.div.firstChild }
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
		if (a.firstChild) { a.insertBefore(b, a.firstChild) }
		else { a.appendChild(b) }
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
						a = this.typesetting; this.typesetting += ".";
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
				if (!a.restart) { throw a }
				if (!a.restart.called) {
					if (this.log[e].restarted == null) { this.log[e].restarted = 0 }
					this.log[e].restarted++;
					delete this.log[e].cleared;
					MathJax.Callback.After(["Set", this, c, e, b], a.restart);
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
			if (this.log[e].cleared) { b = 0 }
			if (--this.log[e].restarted === 0) { delete this.log[e].cleared }
		}
		if (b) {
			setTimeout(MathJax.Callback(["Clear", this, e]), b);
		} else {
			if (b == 0) { this.Clear(e, 0) }
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
					if (a == null) { a = 600 }
					if (a === 0) {
						this.Remove()
					} else {
						this.timer = setTimeout(MathJax.Callback(["Remove", this]), a);
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
