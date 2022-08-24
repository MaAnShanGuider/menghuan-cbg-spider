let window = {};
let location = {
	protocol: "http:"
}
if ("undefined" == typeof I$)
	I$ = function () {
		console.log(22);
		var e = {}
			, t = function () {
				return !1
			}
			, i = {};
		var n = function (t, i) {
			return e.toString.call(t) === "[object " + i + "]"
		};
		return function (e, s) {
			var a = i[e]
				, r = n(s, "Function");
			if (null != s && !r)
				a = s;
			if (r && (null == a || a.__dt__ === !0)) {
				var o = [];
				for (var c = 2, d = arguments.length; c < d; c++)
					o.push(arguments.callee(arguments[c]));
				var _ = {};
				o.push.call(o, _, {}, t, []);
				var l = s.apply(null, o) || _;
				if (!a || !n(l, "Object"))
					a = l;
				else if (Object.keys)
					for (var u = Object.keys(l), c = 0, d = u.length, f; c < d; c++) {
						f = u[c];
						a[f] = l[f]
					}
				else
					for (var f in l)
						a[f] = l[f];
				if (null != a && a.__dt__ === !0)
					delete a.__dt__
			}
			if (null == a)
				a = {
					__dt__: !0
				};
			i[e] = a;
			return a
		}
	}();
I$("甲", function (e, t, i, n) {
	var s = String.prototype;
	if (!s.trim)
		s.trim = function () {
			var e = /(?:^\s+)|(?:\s+$)/g;
			return function () {
				return this.replace(e, "")
			}
		}();
	if (!this.console)
		this.console = {
			log: i,
			error: i
		};
	if (!0) {
		NEJ = this.NEJ || {};
		NEJ.copy = function (e, i) {
			e = e || {};
			i = i || t;
			for (var n in i)
				if (i.hasOwnProperty(n))
					e[n] = i[n];
			return e
		}
			;
		NEJ = NEJ.copy(NEJ, {
			O: t,
			R: n,
			F: i,
			P: function (e) {

				if (!e || !e.length)
					return null;
				var t = this;
				for (var i = e.split("."), n = i.length, s = "window" == i[0] ? 1 : 0; s < n; t = t[i[s]] = t[i[s]] || {},
					s++)
					;
				return t
			}
		});
		return NEJ
	}
	return e
});
I$("乙", function (e, t, i, n, s) {
	var a = "Win32"
		, r = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';
	var o = {
		mac: a,
		win: a,
		linux: a,
		ipad: r,
		ipod: r,
		iphone: a,
		android: r
	};

	t._$IS = o;
	for (var c in o)
		o[c] = new RegExp(c, "i").test(o[c]);
	o.ios = o.ipad || o.iphone || o.ipod;
	o.tablet = o.ipad;
	o.desktop = o.mac || o.win || o.linux && !o.android;
	t._$is = function (e) {

		return !!o[e]
	}
		;
	var d = {
		engine: "unknow",
		release: "unknow",
		browser: "unknow",
		version: "unknow",
		prefix: {
			css: "",
			pro: "",
			clz: ""
		}
	};
	t._$KERNEL = d;
	t._$SUPPORT = {};
	if (!0)
		e.copy(e.P("nej.p"), t);
	return t
}, "甲");
I$("cb8d4f18701219d40dd544cd8b92c6b6", function (e, t, i, n) {
	e.__forIn = function (e, t, i) {
		if (!e || !t)
			return null;
		var n = Object.keys(e);
		for (var s = 0, a = n.length, r, o; s < a; s++) {
			r = n[s];
			o = t.call(i || null, e[r], r, e);
			if (o)
				return r
		}
		return null
	}
		;
	e.__forEach = function (e, t, i) {
		e.forEach(t, i)
	}
		;
	return e
});
I$("ccd88ad78fcab04c80ceaacee2b1c681", function (e, t, i, n, s, a) {
	if ("trident" === t._$KERNEL.engine && t._$KERNEL.release <= "4.0")
		I$("2d1f7c9d3671b1ae55a0fa6f39700413", function () {
		});
	return e
}, "cb8d4f18701219d40dd544cd8b92c6b6", "乙");
I$("丙", function (e, t, i, n, s, a) {
	i._$klass = function () {

		var e = function () {
			return "[object Function]" !== n.toString.call(arguments[0])
		};
		var i = function (e, i) {
			for (; i;) {
				var n = i.prototype
					, s = t.__forIn(n, function (t) {
						return e === t
					});
				if (null != s)
					return {
						name: s,
						klass: i
					};
				i = i._$super
			}
		};
		return function () {

			var n = function () {
				return this.__init.apply(this, arguments)
			};
			n.prototype.__init = s;
			n._$extend = function (n, s) {
				if (!e(n)) {
					var a = this;
					if (s !== !1)
						t.__forIn(n, function (t, i) {
							if (!e(t))
								a[i] = t
						});
					this._$super = n;
					var r = function () { };
					r.prototype = n.prototype;
					this.prototype = new r;
					this.prototype.constructor = this;
					var o = []
						, c = {};
					var d = function (e, t) {
						var n = i(e, t);
						if (n) {
							if (o[o.length - 1] != n.name)
								o.push(n.name);
							c[n.name] = n.klass._$super;
							return n.name
						}
					};
					this.prototype.__super = function () {
						var e = o[o.length - 1]
							, t = arguments.callee.caller;
						if (!e)
							e = d(t, this.constructor);
						else {
							var i = c[e].prototype;
							if (!i.hasOwnProperty(t) || t != i[e])
								e = d(t, this.constructor);
							else
								c[e] = c[e]._$super
						}
						var n = c[e].prototype[e].apply(this, arguments);
						if (e == o[o.length - 1]) {
							o.pop();
							delete c[e]
						}
						return n
					}
						;
					if (!0) {
						var _ = this.prototype;
						_.__supInit = _.__super;
						_.__supReset = _.__super;
						_.__supDestroy = _.__super;
						_.__supInitNode = _.__super;
						_.__supDoBuild = _.__super;
						_.__supOnShow = _.__super;
						_.__supOnHide = _.__super;
						_.__supOnRefresh = _.__super;
						this._$supro = n.prototype
					}
					return this.prototype
				}
			}
				;
			return n
		}
	}();
	if (!0) {
		e.C = i._$klass;
		e.copy(this.NEJ, e)
	}
	return i
}, "甲", "ccd88ad78fcab04c80ceaacee2b1c681");
I$("8fd03edddb19cf8c294f56ca6638c475", function (e, t, i, n, s, a) {
	var r = function (e, t) {
		try {

			t = t.toLowerCase();
			if (null === e)
				return "null" == t;
			if (void 0 === e)
				return "undefined" == t;
			else
				return n.toString.call(e).toLowerCase() == "[object " + t + "]"
		} catch (i) {
			return !1
		}
	};
	i._$isFunction = function (e) {

		return r(e, "function")
	}
		;
	i._$isString = function (e) {
		return r(e, "string")
	}
		;
	i._$isNumber = function (e) {
		return r(e, "number")
	}
		;
	i._$isBoolean = function (e) {
		return r(e, "boolean")
	}
		;
	i._$isDate = function (e) {
		return r(e, "date")
	}
		;
	i._$isArray = function (e) {
		return r(e, "array")
	}
		;
	i._$isObject = function (e) {
		return r(e, "object")
	}
		;
	i._$length = function () {
		var e = /[^\x00-\xff]/g;
		return function (t) {
			return ("" + (t || "")).replace(e, "**").length
		}
	}();
	i._$loop = function (e, n, s) {
		if (i._$isObject(e) && i._$isFunction(n))
			return t.__forIn.apply(t, arguments);
		else
			return null
	}
		;
	i._$indexOf = function (e, t) {
		var n = i._$isFunction(t) ? t : function (e) {
			return e === t
		}
			, s = i._$forIn(e, n);
		return null != s ? s : -1
	}
		;
	i._$binSearch = function () {
		var e;
		var t = function (i, n, s) {
			if (n > s)
				return -1;
			var a = Math.ceil((n + s) / 2)
				, r = e(i[a], a, i);
			if (0 == r)
				return a;
			if (r < 0)
				return t(i, n, a - 1);
			else
				return t(i, a + 1, s)
		};
		return function (i, n) {
			e = n || s;
			return t(i, 0, i.length - 1)
		}
	}();
	i._$reverseEach = function (e, t, n) {
		if (e && e.length && i._$isFunction(t))
			for (var s = e.length - 1; s >= 0; s--)
				if (t.call(n, e[s], s, e))
					return s;
		return null
	}
		;
	i._$forEach = function (e, n, s) {
		if (e && e.length && i._$isFunction(n))
			if (!e.forEach)
				i._$forIn.apply(i, arguments);
			else
				t.__forEach(e, n, s);
	}
		;
	i._$forIn = function (e, t, n) {
		if (!e || !i._$isFunction(t))
			return null;
		if (i._$isNumber(e.length)) {
			for (var s = 0, a = e.length; s < a; s++)
				if (t.call(n, e[s], s, e))
					return s
		} else if (i._$isObject(e))
			return i._$loop(e, t, n);
		return null
	}
		;
	i._$encode = function (e, t) {
		t = "" + t;
		if (!e || !t)
			return t || "";
		else
			return t.replace(e.r, function (t) {
				var i = e[!e.i ? t.toLowerCase() : t];
				return null != i ? i : t
			})
	}
		;
	i._$escape = function () {
		var e = /<br\/?>$/
			, t = {
				r: /\<|\>|\&|\r|\n|\s|\'|\"/g,
				"<": "&lt;",
				">": "&gt;",
				"&": "&amp;",
				" ": "&nbsp;",
				'"': "&quot;",
				"'": "&#39;",
				"\n": "<br/>",
				"\r": ""
			};
		return function (n) {
			n = i._$encode(t, n);
			return n.replace(e, "<br/><br/>")
		}
	}();
	i._$unescape = function () {
		var e = {
			r: /\&(?:lt|gt|amp|nbsp|#39|quot)\;|\<br\/\>/gi,
			"&lt;": "<",
			"&gt;": ">",
			"&amp;": "&",
			"&nbsp;": " ",
			"&#39;": "'",
			"&quot;": '"',
			"<br/>": "\n"
		};
		return function (t) {
			return i._$encode(e, t)
		}
	}();
	i._$format = function () {
		var e = {
			i: !0,
			r: /\byyyy|yy|MM|cM|eM|M|dd|d|HH|H|mm|ms|ss|m|s|w|ct|et\b/g
		}
			, t = ["上午", "下午"]
			, n = ["A.M.", "P.M."]
			, s = ["日", "一", "二", "三", "四", "五", "六"]
			, a = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"]
			, r = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
		var o = function (e) {
			e = parseInt(e) || 0;
			return (e < 10 ? "0" : "") + e
		};
		var c = function (e) {
			return e < 12 ? 0 : 1
		};
		return function (d, _, l) {
			if (!d || !_)
				return "";
			d = i._$var2date(d);
			e.yyyy = d.getFullYear();
			e.yy = ("" + e.yyyy).substr(2);
			e.M = d.getMonth() + 1;
			e.MM = o(e.M);
			e.eM = r[e.M - 1];
			e.cM = a[e.M - 1];
			e.d = d.getDate();
			e.dd = o(e.d);
			e.H = d.getHours();
			e.HH = o(e.H);
			e.m = d.getMinutes();
			e.mm = o(e.m);
			e.s = d.getSeconds();
			e.ss = o(e.s);
			e.ms = d.getMilliseconds();
			e.w = s[d.getDay()];
			var u = c(e.H);
			e.ct = t[u];
			e.et = n[u];
			if (l)
				e.H = e.H % 12;
			return i._$encode(e, _)
		}
	}();
	i._$var2date = function (e) {
		var n = e;
		if (i._$isString(e))
			n = new Date(t.__str2time(e));
		if (!i._$isDate(n))
			n = new Date(e);
		return n
	}
		;
	i._$fixed = function (e, t) {
		return parseFloat(new Number(e).toFixed(t))
	}
		;
	i._$absolute = "";
	i._$url2origin = function () {

		var e = /^([\w]+?:\/\/.*?(?=\/|$))/i;
		return function (t) {
			if (e.test(t || ""))
				return RegExp.$1.toLowerCase();
			else
				return ""
		}
	}();

	;

	;

	;
	i._$array2object = function (e, t) {
		var n = {};
		i._$forEach(e, function (e) {
			var i = e;
			if (t)
				i = t(e);
			if (null != i)
				n[i] = e
		});
		return n
	}
		;



	i._$uniqueID = function () {
		var e = +new Date;
		return function () {
			return "" + e++
		}
	}();

	i._$merge = function () {
		var e = arguments.length - 1
			, t = arguments[e];
		if (i._$isFunction(t))
			e -= 1;
		else
			t = s;
		var n = arguments[0] || {};
		for (var a = 1; a <= e; a++)
			i._$loop(arguments[a], function (e, i) {
				if (!t(e, i))
					n[i] = e
			});
		return n
	}
		;
	i._$fetch = function (e, t) {
		if (t)
			i._$loop(e, function (e, i, n) {
				var s = t[i];
				if (null != s)
					n[i] = s
			});
		return e
	}
		;
	i._$hasProperty = function (e) {
		if (!e)
			return !1;
		if (null != e.length)
			return e.length > 0;
		var t = 0;
		i._$loop(e, function () {
			t++;
			return t > 0
		});
		return t > 0
	}
		;
	if (!0) {
		e.Q = i._$query;
		e.X = i._$merge;
		e.EX = i._$fetch;
		e.copy(this.NEJ, e);
		e.copy(e.P("nej.u"), i)
	}
	return i
}, "甲", "ccd88ad78fcab04c80ceaacee2b1c681");


I$("703889c7eb7b7020f9b7e23d6c3a0b64", function (e, t) {
	var i = {};
	t._$merge = function (t) {
		e._$merge(i, t)
	}
		;
	t._$dump = function () {
		return i
	}
		;
	t._$clear = function () {
		i = {}
	}
		;
	return t
}, "8fd03edddb19cf8c294f56ca6638c475");

I$("丁", function (e, t, i, n, s, a, r, o, c, d) {
	var _ = {}, l, u = {}, f = {}, h = {};
	r.dump = function () {
		return {
			pool: u,
			dirty: f,
			fragment: h
		}
	}
		;
	r._$id = _._$id = function (e) {
		e = r._$get(e);
		if (e) {
			var t = e.id ? e.id : "auto-id-" + i._$uniqueID();
			if (!("id" in e))
				u[t] = e;
			e.id = t;
			if (!r._$get(t))
				f[t] = e;
			return t
		}
	}
		;
	r._$get = function (e) {
		var t = u["" + e];
		if (t)
			return t;
		if (!i._$isString(e) && !i._$isNumber(e))
			return e;

		if (t)
			delete f[e];
		return t || f[e]
	}
		;
	r._$getChildren = _._$getChildren = function (e, t) {
		e = r._$get(e);
		if (!e)
			return null;
		var n = a.__getChildren(e);
		if (t)
			i._$reverseEach(n, function (e, i, n) {
				if (!r._$hasClassName(e, t))
					n.splice(i, 1)
			});
		return n
	}
		;
	r._$getByClassName = _._$getByClassName = function (e, t) {
		e = r._$get(e);
		return !e ? null : a.__getElementsByClassName(e, t.trim())
	}
		;
	r._$getSibling = _._$getSibling = function () {
		var e = function () {
			return !0
		};
		return function (t, n) {
			t = r._$get(t);
			if (!t)
				return null;
			var s = {
				backward: !1,
				filter: e
			};
			if (i._$isFunction(n))
				s.filter = n;
			else
				s = i._$fetch(s, n);
			var o = s.backward ? a.__previousSibling : a.__nextSibling;
			for (; (t = o(t)) && !s.filter(t);)
				;
			return t
		}
	}();
	r._$getScrollViewPort = function (e) {
		e = r._$get(e);
		if (e) {
			e = e.parentNode;
			for (; e && !(e.scrollHeight > e.clientHeight);)
				e = e.parentNode;
			if (e)
				return e
		}
		var t = 2
			, i = 1;
		return {}
	}
		;
	r._$getPageBox = function () {
		var e = function (e) {
			var t = 0;
			i._$forEach(e, function (e) {
				if (e)
					if (!t)
						t = e;
					else
						t = Math.min(t, e)
			});
			return t
		};
		var t = [{
			main: "scroll",
			sub: ["Top", "Left"],
			func: function (e, t, i) {
				return Math.max(t["scroll" + e], i["scroll" + e])
			}
		}, {
			main: "client",
			sub: ["Width", "Height"],
			func: function (t, i, n) {
				return e([i["client" + t], i["offset" + t], n["client" + t], n["offset" + t]])
			}
		}, {
			main: "scroll",
			sub: ["Width", "Height"],
			func: function (e, t, i, n) {
				return Math.max(n["client" + e], t["scroll" + e], i["scroll" + e])
			}
		}];
		return function (e) {
			var n = {}
				, s = e || document
				, a = s.body
				, r = s.documentElement;
			i._$forEach(t, function (e) {
				var t = e.main;
				i._$forEach(e.sub, function (i) {
					n[t + i] = e.func(i, a, r, n)
				})
			});
			return n
		}
	}();
	r._$getMaxBox = function (e, t) {
		var n = i._$merge({}, e)
			, s = t.width / t.height
			, a = e.width / e.height;
		if (s > a && e.height > t.height) {
			n.height = t.height;
			n.width = n.height * a
		}
		if (s < a && e.width > t.width) {
			n.width = t.width;
			n.height = n.width / a
		}
		return n
	}
		;
	r._$scrollTo = _._$scrollTo = function (e) {
		var t = r._$offset(e);
		window.scrollTo(t.x, t.y)
	}
		;
	r._$align = function () {
		var e = /\s+/;
		var t = {
			left: function () {
				return 0
			},
			center: function (e, t) {
				return (e.width - t.width) / 2
			},
			right: function (e, t) {
				return e.width - t.width
			},
			top: function () {
				return 0
			},
			middle: function (e, t) {
				return (e.height - t.height) / 2
			},
			bottom: function (e, t) {
				return e.height - t.height
			}
		};
		return function (i, n, s) {
			var a = {}
				, r = (s || "").split(e)
				, o = t[r[1]] || t.middle
				, c = t[r[0]] || t.center;
			a.top = o(i, n);
			a.left = c(i, n);
			return a
		}
	}();
	r._$offset = _._$offset = function () {
		var e = function (e) {
			return true
		};
		return function (t, i) {
			t = r._$get(t);
			if (!t)
				return null;
			i = r._$get(i) || null;
			var n = t, s = {
				x: 0,
				y: 0
			}, a, o, c;
			for (; n && n != i;) {
				a = e(n) || n == t;
				o = a ? 0 : n.scrollLeft;
				c = parseInt(r._$getStyle(n, "borderLeftWidth")) || 0;
				s.x += n.offsetLeft + c - o;
				o = a ? 0 : n.scrollTop;
				c = parseInt(r._$getStyle(n, "borderTopWidth")) || 0;
				s.y += n.offsetTop + c - o;
				n = n.offsetParent
			}
			return s
		}
	}();
	r._$fullScreen = _._$fullScreen = function (e) {
		e = r._$get(e);
		if (e)
			a.__fullScreen(e, r._$getPageBox())
	}
		;
	r._$mask = _._$mask = function (e) {
		e = r._$get(e);
		if (e) {
			r._$id(e);
			return a.__mask(e)
		}
		return null
	}
		;
	r._$unmask = _._$unmask = function (e) {
		e = r._$get(e);
		if (e) {
			r._$id(e);
			return a.__unmask(e)
		}
		return null
	}
		;
	r._$create = function () {
		var e = {
			a: {
				href: "#",
				hideFocus: !0
			},
			style: {
				type: "text/css"
			},
			link: {
				type: "text/css",
				rel: "stylesheet"
			},
			iframe: {
				frameBorder: 0
			},
			script: {
				defer: !0,
				type: "text/javascript"
			}
		};
		return function (t, n, s) {
			var a = document.createElement(t)
				, o = e[t.toLowerCase()];
			i._$merge(a, o);
			if (n)
				a.className = n;
			s = r._$get(s);
			if (s)
				s.appendChild(a);
			else if (!o)
				h.appendChild(a);
			return a
		}
	}();
	r._$createXFrame = function () {
		var e = function () {
			if (location.hostname == document.domain)
				return "about:blank";
			else
				return 'javascript:(function(){document.open();document.domain="' + document.domain + '";document.close();})();'
		};
		var t = function (e) {
			e = e.trim();
			if (!e)
				return r._$create("iframe");
			var t;
			try {
				t = document.createElement('<iframe name="' + e + '"></iframe>');
				t.frameBorder = 0
			} catch (i) {
				t = r._$create("iframe");
				t.name = e
			}
			return t
		};
		return function (s) {
			s = s || o;
			var a = t(s.name || "");
			if (!s.visible)
				a.style.display = "none";
			if (i._$isFunction(s.onload))
				n._$addEvent(a, "load", function (e) {
					if (a.src) {
						n._$clearEvent(a, "load");
						s.onload(e)
					}
				});
			var c = s.parent;
			if (i._$isFunction(c))
				try {
					c(a)
				} catch (d) { }
			else
				(r._$get(c) || document.body).appendChild(a);
			var _ = s.src || e();
			window.setTimeout(function () {
				a.src = _
			}, 0);
			return a
		}
	}();
	r._$remove = _._$remove = function () {
		var e = {
			img: function (e) {
				e.src = t._$BLANK_IMAGE
			},
			iframe: function (e) {
				e.src = "about:blank"
			}
		};
		var s = function (t, n) {
			if (n) {
				if (t.getElementsByTagName)
					i._$forEach(t.getElementsByTagName(n), s)
			} else {
				var a = (t.tagName || "").toLowerCase()
					, r = e[a];
				if (r)
					r(t)
			}
		};
		return function (e) {
			e = r._$get(e);
			if (e) {
				if (!arguments[1])
					n._$clearEvent(e);
				s(e);
				s(e, "img");
				s(e, "iframe");
				if (e.parentNode)
					e.parentNode.removeChild(e)
			}
		}
	}();
	r._$removeByEC = _._$removeByEC = function (e) {
		e = r._$get(e);
		if (e)
			try {
				h.appendChild(e)
			} catch (t) {
				console.error(t)
			}
	}
		;
	r._$clearChildren = _._$clearChildren = function (e) {
		e = r._$get(e);
		if (e)
			i._$reverseEach(e.childNodes, function (e) {
				r._$remove(e)
			})
	}
		;
	r._$wrapInline = _._$wrapInline = function () {
		var e, t = /\s+/;
		var i = function () {
			if (!e) {
				e = r._$pushCSSText(".#<uispace>{position:relative;zoom:1;}.#<uispace>-show{position:absolute;top:0;left:100%;cursor:text;white-space:nowrap;overflow:hidden;}");
				r._$dumpCSSText()
			}
		};
		return function (n, s) {
			n = r._$get(n);
			if (!n)
				return null;
			i();
			s = s || o;
			var a = n.parentNode;
			if (!r._$hasClassName(a, e)) {
				a = r._$create("span", e);
				n.insertAdjacentElement("beforeBegin", a);
				a.appendChild(n)
			}
			var c = s.nid || ""
				, d = r._$getByClassName(a, c || e + "-show")[0];
			if (!d) {
				var _ = ((s.clazz || "") + " " + c).trim();
				_ = e + "-show" + (!_ ? "" : " ") + _;
				d = r._$create(s.tag || "span", _);
				a.appendChild(d)
			}
			var _ = s.clazz;
			if (_) {
				_ = (_ || "").trim().split(t)[0] + "-parent";
				r._$addClassName(a, _)
			}
			return d
		}
	}();
	r._$dataset = _._$dataset = function (e, t, n) {
		var s = r._$id(e);
		if (!s)
			return null;
		if (i._$isString(t))
			return a.__dataset(r._$get(e), t, n);
		if (i._$isObject(t)) {
			var o = {};
			i._$forIn(t, function (e, t) {
				o[t] = r._$dataset(s, t, e)
			});
			return o
		}
		if (i._$isArray(t)) {
			var o = {};
			i._$forEach(t, function (e) {
				o[e] = r._$dataset(s, e)
			});
			return o
		}
		return null
	}
		;
	r._$attr = _._$attr = function (e, t, i) {
		e = r._$get(e);
		if (!e)
			return "";
		if (void 0 !== i && e.setAttribute)
			e.setAttribute(t, i);
		return a.__getAttribute(e, t)
	}
		;
	r._$html2node = function () {
		var e = /<(.*?)(?=\s|>)/i
			, t = {
				li: "ul",
				tr: "tbody",
				td: "tr",
				th: "tr",
				option: "select"
			};
		return function (i) {
			var n;
			if (e.test(i))
				n = t[(RegExp.$1 || "").toLowerCase()] || "";
			var s = r._$create(n || "div");
			s.innerHTML = i;
			var a = r._$getChildren(s);
			return a.length > 1 ? s : a[0]
		}
	}();
	r._$dom2xml = _._$dom2xml = function (e) {
		e = r._$get(e);
		return !e ? "" : a.__serializeDOM2XML(e)
	}
		;
	r._$xml2dom = function (e) {
		e = (e || "").trim();
		return !e ? null : a.__parseDOMFromXML(e)
	}
		;
	r._$dom2object = _._$dom2object = function (e, t) {
		t = t || {};
		e = r._$get(e);
		if (!e)
			return t;
		var n = e.tagName.toLowerCase()
			, s = r._$getChildren(e);
		if (!s || !s.length) {
			t[n] = e.textContent || e.text || "";
			return t
		}
		var a = {};
		t[n] = a;
		i._$forEach(s, function (e) {
			r._$dom2object(e, a)
		});
		return t
	}
		;
	r._$xml2object = function (e) {
		try {
			return r._$dom2object(r._$xml2dom(e))
		} catch (t) {
			return null
		}
	}
		;
	r._$text2type = function () {
		var e = {
			xml: function (e) {
				return r._$xml2dom(e)
			},
			json: function (e) {
				try {
					return JSON.parse(e)
				} catch (t) {
					return null
				}
			},
			dft: function (e) {
				return e
			}
		};
		return function (t, i) {
			i = (i || "").toLowerCase();
			return (e[i] || e.dft)(t || "")
		}
	}();
	r._$style = _._$style = function (e, t) {
		e = r._$get(e);
		if (e)
			i._$loop(t, function (t, i) {
				r._$setStyle(e, i, t)
			})
	}
		;
	r._$setStyle = _._$setStyle = function (e, t, i) {
		e = r._$get(e);
		if (e)
			a.__setStyleValue(e, t, a.__processCSSText(i))
	}
		;
	r._$getStyle = _._$getStyle = function (e, t) {
		e = r._$get(e);
		return !e ? "" : a.__getStyleValue(e, t)
	}
		;
	r._$addScript = function (e) {
		try {
			e = e.trim();
			if (e)
				return new Function(e)()
		} catch (t) {
			console.error(t.message);
			console.error(t.stack)
		}
	}
		;
	r._$addStyle = function () {
		var e = /[\s\r\n]+/gi;
		return function (t) {
			t = (t || "").replace(e, " ").trim();
			var i = null;
			if (t) {
				i = r._$create("style");
				document.head.appendChild(i);
				a.__injectCSSText(i, a.__processCSSText(t))
			}
			return i
		}
	}();
	r._$pushCSSText = function () {
		var e = /#<(.*?)>/g
			, t = +new Date;
		return function (t, n) {
			if (!l)
				l = [];
			var s = "auto-" + i._$uniqueID()
				, a = i._$merge({
					uispace: s
				}, n);
			l.push(t.replace(e, function (e, t) {
				return a[t] || e
			}));
			return s
		}
	}();
	r._$dumpCSSText = function () {
		if (l) {
			r._$addStyle(l.join(" "));
			l = null
		}
	}
		;
	r._$appendCSSText = _._$appendCSSText = function (e, t) {
		e = r._$get(e);
		return !e ? null : a.__appendCSSText(e, a.__processCSSText(t))
	}
		;
	r._$addClassName = _._$addClassName = function (e, t) {
		e = r._$get(e);
		if (e)
			a.__processClassName(e, "add", t)
	}
		;
	r._$delClassName = _._$delClassName = function (e, t) {
		e = r._$get(e);
		if (e)
			a.__processClassName(e, "remove", t)
	}
		;
	r._$replaceClassName = _._$replaceClassName = function (e, t, i) {
		e = r._$get(e);
		if (e)
			a.__processClassName(e, "replace", t, i)
	}
		;
	r._$hasClassName = _._$hasClassName = function (e, t) {
		e = r._$get(e);
		if (e)
			return a.__hasClassName(e, t);
		else
			return !1
	}
		;
	r._$matrix = function (e) {
		e = (e || "").trim();
		return a.__getCSSMatrix(e)
	}
		;
	r._$css3d = _._$css3d = function (e, t, i) {
		e = r._$get(e);
		if (e) {
			var n = a.__processTransformValue(t, i);
			if (n)
				r._$setStyle(e, "transform", n)
		}
	}
		;
	s._$merge(_);
	if (!0)
		e.copy(e.P("nej.e"), r);
	return r
}, "甲", "ab8abeca574cb254ef6aea89d6984f91", "8fd03edddb19cf8c294f56ca6638c475", "a100971a16ec757a0282a3b2cc059019", "703889c7eb7b7020f9b7e23d6c3a0b64", "331dc65215bd207feab55e8d55f69da4");
I$("e0793c838b68fed5a7e1742035643bec", function (e, t, i, n, s, a, r, o) {
	var c;
	s._$$EventTarget = t._$klass();
	c = s._$$EventTarget.prototype;
	s._$$EventTarget._$allocate = function (e) {
		e = e || {};
		var t = !!this.__pool && this.__pool.shift();
		if (!t) {
			t = new this(e);
			this.__inst__ = (this.__inst__ || 0) + 1
		}
		t.__reset(e);
		return t
	}
		;
	s._$$EventTarget._$recycle = function () {
		var e = function (e, t, i) {
			e._$recycle();
			i.splice(t, 1)
		};
		return function (t) {
			if (!t)
				return null;
			if (!n._$isArray(t)) {
				if (!(t instanceof this)) {
					var i = t.constructor;
					if (i._$recycle)
						i._$recycle(t);
					return null
				}
				if (t == this.__instance)
					delete this.__instance;
				if (t == this.__inctanse)
					delete this.__inctanse;
				t.__destroy();
				if (!this.__pool)
					this.__pool = [];
				if (n._$indexOf(this.__pool, t) < 0)
					this.__pool.push(t);
				return null
			}
			n._$reverseEach(t, e, this)
		}
	}();
	s._$$EventTarget._$getInstance = function (e) {
		if (!this.__instance)
			this.__instance = this._$allocate(e);
		return this.__instance
	}
		;
	s._$$EventTarget._$getInstanceWithReset = function (e, t) {
		if (t && this.__inctanse) {
			this.__inctanse._$recycle();
			delete this.__inctanse
		}
		if (!this.__inctanse)
			this.__inctanse = this._$allocate(e);
		else
			this.__inctanse.__reset(e);
		return this.__inctanse
	}
		;
	c.__init = function () {
		this.__events = {};
		this.__events_dom = {};
		this.id = n._$uniqueID()
	}
		;
	c.__reset = function (e) {
		this._$batEvent(e)
	}
		;
	c.__destroy = function () {
		this._$clearEvent();
		this.__doClearDomEvent()
	}
		;
	c.__doInitDomEvent = function () {
		var e = function (e) {
			if (e && !(e.length < 3)) {
				this.__events_dom["de-" + n._$uniqueID()] = e;
				i._$addEvent.apply(i, e)
			}
		};
		return function (t) {
			n._$forEach(t, e, this)
		}
	}();
	c.__doClearDomEvent = function () {
		var e = function (e, t, n) {
			delete n[t];
			i._$delEvent.apply(i, e)
		};
		return function () {
			n._$loop(this.__events_dom, e)
		}
	}();
	c.__doClearComponent = function (e) {
		e = e || r;
		n._$loop(this, function (t, i, n) {
			if (t && t._$recycle && !e(t)) {
				delete n[i];
				t._$recycle()
			}
		})
	}
		;
	c._$recycle = function () {
		this.constructor._$recycle(this)
	}
		;
	c._$hasEvent = function (e) {
		var e = (e || "").toLowerCase()
			, t = this.__events[e];
		return !!t && t !== r
	}
		;
	c._$delEvent = function (e, t) {
		var e = (e || "").toLowerCase()
			, i = this.__events[e];
		if (n._$isArray(i)) {
			n._$reverseEach(i, function (e, i, n) {
				if (e == t)
					n.splice(i, 1)
			});
			if (!i.length)
				delete this.__events[e]
		} else if (i == t)
			delete this.__events[e]
	}
		;
	c._$setEvent = function (e, t) {
		if (e && n._$isFunction(t))
			this.__events[e.toLowerCase()] = t
	}
		;
	c._$batEvent = function () {
		var e = function (e, t) {
			this._$setEvent(t, e)
		};
		return function (t) {
			n._$loop(t, e, this)
		}
	}();
	c._$clearEvent = function () {
		var e = function (e, t) {
			this._$clearEvent(t)
		};
		return function (t) {
			var t = (t || "").toLowerCase();
			if (t)
				delete this.__events[t];
			else
				n._$loop(this.__events, e, this)
		}
	}();
	c._$addEvent = function (e, t) {
		if (e && n._$isFunction(t)) {
			e = e.toLowerCase();
			var i = this.__events[e];
			if (i) {
				if (!n._$isArray(i))
					this.__events[e] = [i];
				this.__events[e].push(t)
			} else
				this.__events[e] = t
		}
	}
		;
	c._$dispatchEvent = function (e) {
		var e = (e || "").toLowerCase()
			, t = this.__events[e];
		if (t) {
			var i = o.slice.call(arguments, 1);
			if (n._$isArray(t))
				n._$forEach(t, function (e) {
					if (!1)
						e.apply(this, i);
					else
						try {
							e.apply(this, i)
						} catch (t) {
							console.error(t.message);
							console.error(t.stack)
						}
				}, this);
			else
				t.apply(this, i)
		}
	}
		;
	if (!0) {
		s._$$Event = s._$$EventTarget;
		e.copy(e.P("nej.ut"), s)
	}
	return s
}, "甲", "丙", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475");
!function () {
	if ("undefined" == typeof TrimPath) {
		TrimPath = {};
		if ("undefined" != typeof exports)
			TrimPath = exports
	}
	var e = {}, t = [], i = /\s+/g, n = +new Date, s, a, r;
	var o = function () {
		var e = /^\s*[\[\{'"].*?[\]\}'"]\s*$/
			, t = /[\&\|\<\>\+\-\*\/\%\,\(\)\[\]\?\:\!\=\;]/
			, i = /^(?:defined|null|undefined|true|false|instanceof|new|this|typeof|\$v|[\d]+)$/i
			, n = /^new\s+/
			, s = /['"]/;
		var a = function (t) {
			if (!e.test(t)) {
				t = t.split(".")[0].trim();
				if (t && !s.test(t)) {
					t = t.replace(n, "");
					try {
						if (i.test(t))
							return;
						r[t] = 1
					} catch (a) { }
				}
			}
		};
		return function (i) {
			i = i || "";
			if (i && !e.test(i)) {
				var n = i.split(t);
				for (var s = 0, r = n.length; s < r; s++)
					a(n[s])
			}
		}
	}();
	var c = function (e) {
		if ("in" != e[2])
			throw "bad for loop statement: " + e.join(" ");
		t.push(e[1]);
		o(e[3]);
		return "var __HASH__" + e[1] + " = " + e[3] + "," + e[1] + "," + e[1] + "_count=0;if (!!__HASH__" + e[1] + ")for(var " + e[1] + "_key in __HASH__" + e[1] + "){" + e[1] + " = __HASH__" + e[1] + "[" + e[1] + "_key];if (typeof(" + e[1] + ')=="function") continue;' + e[1] + "_count++;"
	};
	var d = function () {
		var e = t[t.length - 1];
		return "}; if(!__HASH__" + e + "||!" + e + "_count){"
	};
	var _ = function () {
		t.pop();
		return "};"
	};
	var l = function (e) {
		if ("as" != e[2])
			throw "bad for list loop statement: " + e.join(" ");
		var t = e[1].split("..");
		if (t.length > 1) {
			o(t[0]);
			o(t[1]);
			return "for(var " + e[3] + "," + e[3] + "_index=0," + e[3] + "_beg=" + t[0] + "," + e[3] + "_end=" + t[1] + "," + e[3] + "_length=parseInt(" + e[3] + "_end-" + e[3] + "_beg+1);" + e[3] + "_index<" + e[3] + "_length;" + e[3] + "_index++){" + e[3] + " = " + e[3] + "_beg+" + e[3] + "_index;"
		} else {
			o(e[1]);
			return "for(var __LIST__" + e[3] + " = " + e[1] + "," + e[3] + "," + e[3] + "_index=0," + e[3] + "_length=__LIST__" + e[3] + ".length;" + e[3] + "_index<" + e[3] + "_length;" + e[3] + "_index++){" + e[3] + " = __LIST__" + e[3] + "[" + e[3] + "_index];"
		}
	};
	var u = function (e) {
		if (e && e.length) {
			e.shift();
			var t = e[0].split("(")[0];
			return "var " + t + " = function" + e.join("").replace(t, "") + "{var __OUT=[];"
		}
	};
	var f = function (e) {
		if (!e[1])
			throw "bad include statement: " + e.join(" ");
		return 'if (typeof inline == "function"){__OUT.push(inline('
	};
	var h = function (e, t) {
		o(t.slice(1).join(" "));
		return e
	};
	var p = function (e) {
		return h("if(", e)
	};
	var m = function (e) {
		return h("}else if(", e)
	};
	var g = function (e) {
		return h("var ", e)
	};
	a = {
		blk: /^\{(cdata|minify|eval)/i,
		tag: "forelse|for|list|if|elseif|else|var|macro|break|notrim|trim|include",
		def: {
			"if": {
				pfix: p,
				sfix: "){",
				pmin: 1
			},
			"else": {
				pfix: "}else{"
			},
			elseif: {
				pfix: m,
				sfix: "){",
				pdft: "true"
			},
			"/if": {
				pfix: "}"
			},
			"for": {
				pfix: c,
				pmin: 3
			},
			forelse: {
				pfix: d
			},
			"/for": {
				pfix: _
			},
			list: {
				pfix: l,
				pmin: 3
			},
			"/list": {
				pfix: "};"
			},
			"break": {
				pfix: "break;"
			},
			"var": {
				pfix: g,
				sfix: ";"
			},
			macro: {
				pfix: u
			},
			"/macro": {
				pfix: 'return __OUT.join("");};'
			},
			trim: {
				pfix: function () {
					s = !0
				}
			},
			"/trim": {
				pfix: function () {
					s = null
				}
			},
			inline: {
				pfix: f,
				pmin: 1,
				sfix: "));}"
			}
		},
		ext: {
			seed: function (e) {
				return (e || "") + "" + n
			},
			"default": function (e, t) {
				return e || t
			}
		}
	};
	var b = function () {
		var e = /\\([\{\}])/g;
		return function (t, n) {
			t = t.replace(e, "$1");
			var s = t.slice(1, -1).split(i)
				, r = a.def[s[0]];
			if (r) {
				if (r.pmin && r.pmin >= s.length)
					throw "Statement needs more parameters:" + t;
				n.push(r.pfix && "string" != typeof r.pfix ? r.pfix(s) : r.pfix || "");
				if (r.sfix) {
					if (s.length <= 1) {
						if (r.pdft)
							n.push(r.pdft)
					} else
						for (var o = 1, c = s.length; o < c; o++) {
							if (o > 1)
								n.push(" ");
							n.push(s[o])
						}
					n.push(r.sfix)
				}
			} else
				$(t, n)
		}
	}();
	var v = function (e, t) {
		if (e && e.length)
			if (1 != e.length) {
				var i = e.pop().split(":");
				t.push("__MDF['" + i.shift() + "'](");
				v(e, t);
				if (i.length > 0) {
					var n = i.join(":");
					o(n);
					t.push("," + n)
				}
				t.push(")")
			} else {
				var s = e.pop();
				o(s);
				t.push("" == s ? '""' : s)
			}
	};
	var $ = function (e, t) {
		if (e) {
			var i = e.split("\n");
			if (i && i.length)
				for (var n = 0, a = i.length, r; n < a; n++) {
					r = i[n];
					if (s) {
						r = r.trim();
						if (!r)
							continue
					}
					y(r, t);
					if (s && n < a - 1)
						t.push("__OUT.push('\\n');")
				}
		}
	};
	var y = function () {
		var e = /\|\|/g
			, t = /#@@#/g;
		return function (i, n) {
			var s = "}", a = -1, r = i.length, o, c, d, _, l;
			for (; a + s.length < r;) {
				o = "${";
				c = "}";
				d = i.indexOf(o, a + s.length);
				if (d < 0)
					break;
				if ("%" == i.charAt(d + 2)) {
					o = "${%";
					c = "%}"
				}
				_ = i.indexOf(c, d + o.length);
				if (_ < 0)
					break;
				C(i.substring(a + s.length, d), n);
				l = i.substring(d + o.length, _).replace(e, "#@@#").split("|");
				for (var u = 0, f = l.length; u < f; l[u] = l[u].replace(t, "||"),
					u++)
					;
				n.push("__OUT.push(");
				v(l, n);
				n.push(");");
				s = c;
				a = _
			}
			C(i.substring(a + s.length), n)
		}
	}();
	var C = function () {
		var e = {
			r: /\n|\\|\'/g,
			"\n": "\\n",
			"\\": "\\\\",
			"'": "\\'"
		};
		var t = function (t) {
			return (t || "").replace(e.r, function (t) {
				return e[t] || t
			})
		};
		return function (e, i) {
			if (e)
				i.push("__OUT.push('" + t(e) + "');")
		}
	}();
	var w = function () {
		var e = /\t/g
			, t = /\n/g
			, n = /\r\n?/g;
		var s = function (e, t) {
			var i = e.indexOf("}", t + 1);
			for (; "\\" == e.charAt(i - 1);)
				i = e.indexOf("}", i + 1);
			return i
		};
		var o = function () {
			var e = []
				, t = arguments[0];
			for (var i in t) {
				i = (i || "").trim();
				if (i)
					e.push(i + "=$v('" + i + "')");
				else
					;
			}
			return e.length > 0 ? "var " + e.join(",") + ";" : ""
		};
		return function (c) {
			r = {};
			c = c.replace(n, "\n").replace(e, "    ");
			var d = ["if(!__CTX) return '';", ""];
			d.push("function $v(__NAME){var v = __CTX[__NAME];return v==null?window[__NAME]:v;};");
			d.push("var defined=function(__NAME){return __CTX[__NAME]!=null;},");
			d.push("__OUT=[];");
			var _ = -1
				, l = c.length;
			var u, f, h, p, m, g, v, y;
			for (; _ + 1 < l;) {
				u = _;
				u = c.indexOf("{", u + 1);
				for (; u >= 0;) {
					f = s(c, u);
					h = c.substring(u, f);
					p = h.match(a.blk);
					if (p) {
						m = p[1].length + 1;
						g = c.indexOf("}", u + m);
						if (g >= 0) {
							v = g - u - m <= 0 ? "{/" + p[1] + "}" : h.substr(m + 1);
							m = c.indexOf(v, g + 1);
							if (m >= 0) {
								$(c.substring(_ + 1, u), d);
								y = c.substring(g + 1, m);
								switch (p[1]) {
									case "cdata":
										C(y, d);
										break;
									case "minify":
										C(y.replace(t, " ").replace(i, " "), d);
										break;
									case "eval":
										if (y)
											d.push("__OUT.push((function(){" + y + "})());")
								}
								u = _ = m + v.length - 1
							}
						}
					} else if ("$" != c.charAt(u - 1) && "\\" != c.charAt(u - 1) && 0 == h.substr("/" == h.charAt(1) ? 2 : 1).search(a.tag))
						break;
					u = c.indexOf("{", u + 1)
				}
				if (u < 0)
					break;
				f = s(c, u);
				if (f < 0)
					break;
				$(c.substring(_ + 1, u), d);
				b(c.substring(u, f + 1), d);
				_ = f
			}
			$(c.substring(_ + 1), d);
			d.push(';return __OUT.join("");');
			d[1] = o(r);
			r = null;
			return new Function("__CTX", "__MDF", d.join(""))
		}
	}();
	TrimPath.seed = function () {
		return n
	}
		;
	TrimPath.merge = function () {
		var t = {};
		TrimPath.dump = function () {
			return {
				func: t,
				text: e
			}
		}
			;
		return function (i, n, s) {
			try {
				n = n || {};
				if (!t[i] && !e[i])
					return "";
				if (!t[i]) {
					t[i] = w(e[i]);
					delete e[i]
				}
				if (s)
					for (var r in a.ext)
						if (!s[r])
							s[r] = a.ext[r];
				return t[i](n, s || a.ext)
			} catch (o) {
				return o.message || ""
			}
		}
	}();
	TrimPath.parse = function () {
		var t = +new Date;
		return function (i, n) {
			if (!i)
				return "";
			n = n || "ck-" + t++;
			if (null != e[n]) {
				console.warn("jst template overwrited with key " + n);
				console.debug("old template content: " + e[n].replace(/\n/g, " "));
				console.debug("new template content: " + i.replace(/\n/g, " "))
			}
			e[n] = i;
			return n
		}
	}()
}();

!function e(t, i) {
	"object" == typeof exports && "object" == typeof module ? module.exports = i() : "function" == typeof define && define.amd ? define("URSSM4", [], i) : "object" == typeof exports ? exports.URSSM4 = i() : t.URSSM4 = i()
}(this, function () {
	function e(n) {
		var s = i[n];
		if (void 0 !== s)
			return s.exports;
		s = i[n] = {
			exports: {}
		};
		return t[n](s, s.exports, e),
			s.exports
	}
	return t = {
		7228: function (e) {
			e.exports = function (e, t) {
				(null == t || t > e.length) && (t = e.length);
				for (var i = 0, n = new Array(t); i < t; i++)
					n[i] = e[i];
				return n
			}
				,
				e.exports["default"] = e.exports,
				e.exports.__esModule = !0
		},
		3646: function (e, t, i) {
			var n = i(7228);
			e.exports = function (e) {
				if (Array.isArray(e))
					return n(e)
			}
				,
				e.exports["default"] = e.exports,
				e.exports.__esModule = !0
		},
		6860: function (e) {
			e.exports = function (e) {
				if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"])
					return Array.from(e)
			}
				,
				e.exports["default"] = e.exports,
				e.exports.__esModule = !0
		},
		8206: function (e) {
			e.exports = function () {
				throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
			}
				,
				e.exports["default"] = e.exports,
				e.exports.__esModule = !0
		},
		319: function (e, t, i) {
			var n = i(3646)
				, s = i(6860)
				, a = i(379)
				, r = i(8206);
			console.log("我是319");
			e.exports = function (e) {
				return n(e) || s(e) || a(e) || r()
			}
				,
				e.exports["default"] = e.exports,
				e.exports.__esModule = !0;

		},
		379: function (e, t, i) {
			var n = i(7228);
			e.exports = function (e, t) {
				if (e) {
					if ("string" == typeof e)
						return n(e, t);
					var i = Object.prototype.toString.call(e).slice(8, -1);
					return "Map" === (i = "Object" === i && e.constructor ? e.constructor.name : i) || "Set" === i ? Array.from(e) : "Arguments" === i || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i) ? n(e, t) : void 0
				}
			}
				,
				e.exports["default"] = e.exports,
				e.exports.__esModule = !0
		},
		9579: function (e, t, i) {

			function n(e) {
				console.log("222222");
				for (var t = [], i = 0, n = e.length; i < n; i += 2)
					t.push(parseInt(e.substr(i, 2), 16));
				return t
			}
			function s(e, t) {
				return e << t | e >>> 32 - t
			}
			function a(e) {
				return (255 & u[e >>> 24 & 255]) << 24 | (255 & u[e >>> 16 & 255]) << 16 | (255 & u[e >>> 8 & 255]) << 8 | 255 & u[255 & e]
			}
			function r(e) {
				return e ^ s(e, 2) ^ s(e, 10) ^ s(e, 18) ^ s(e, 24)
			}
			function o(e) {
				return e ^ s(e, 13) ^ s(e, 23)
			}
			function c(e, t, i, s) {
				var c = 3 < arguments.length && void 0 !== s ? s : {}
					, u = c.padding
					, h = void 0 === u ? "pkcs#5" : u
					, p = c.mode
					, u = c.iv
					, u = void 0 === u ? [] : u
					, c = c.output
					, c = void 0 === c ? "string" : c;
				if ("cbc" === p && 16 !== (u = "string" == typeof u ? n(u) : u).length)
					throw new Error("iv is invalid");
				if (16 !== (t = "string" == typeof t ? n(t) : t).length)
					throw new Error("key is invalid");
				if (e = ("string" == typeof e ? i !== _ ? function (e) {
					for (var t = [], i = 0, n = e.length; i < n; i++) {
						var s = e.codePointAt(i);
						if (s <= 127)
							t.push(s);
						else if (s <= 2047)
							t.push(192 | s >>> 6),
								t.push(128 | 63 & s);
						else if (s <= 55295 || 57344 <= s && s <= 65535)
							t.push(224 | s >>> 12),
								t.push(128 | s >>> 6 & 63),
								t.push(128 | 63 & s);
						else {
							if (!(65536 <= s && s <= 1114111))
								throw t.push(s),
								new Error("input is not supported");
							i++,
								t.push(240 | s >>> 18 & 28),
								t.push(128 | s >>> 12 & 63),
								t.push(128 | s >>> 6 & 63),
								t.push(128 | 63 & s)
						}
					}
					return t
				}
					: n : d)(e),
					"pkcs#5" === h && i !== _)
					for (var m = l - e.length % l, g = 0; g < m; g++)
						e.push(m);
				var b = new Array(32);
				!function (e, t, i) {
					for (var n = new Array(4), s = new Array(4), r = 0; r < 4; r++)
						s[0] = 255 & e[0 + 4 * r],
							s[1] = 255 & e[1 + 4 * r],
							s[2] = 255 & e[2 + 4 * r],
							s[3] = 255 & e[3 + 4 * r],
							n[r] = s[0] << 24 | s[1] << 16 | s[2] << 8 | s[3];
					n[0] ^= 2746333894,
						n[1] ^= 1453994832,
						n[2] ^= 1736282519,
						n[3] ^= 2993693404;
					for (var c, d = 0; d < 32; d += 4)
						c = n[1] ^ n[2] ^ n[3] ^ f[d + 0],
							t[d + 0] = n[0] ^= o(a(c)),
							c = n[2] ^ n[3] ^ n[0] ^ f[d + 1],
							t[d + 1] = n[1] ^= o(a(c)),
							c = n[3] ^ n[0] ^ n[1] ^ f[d + 2],
							t[d + 2] = n[2] ^= o(a(c)),
							c = n[0] ^ n[1] ^ n[2] ^ f[d + 3],
							t[d + 3] = n[3] ^= o(a(c));
					if (i === _)
						for (var l, u = 0; u < 16; u++)
							l = t[u],
								t[u] = t[31 - u],
								t[31 - u] = l
				}(t, b, i);
				for (var v = [], $ = u, y = e.length, C = 0; l <= y;) {
					var w = e.slice(C, C + 16)
						, x = new Array(16);
					if ("cbc" === p)
						for (var T = 0; T < l; T++)
							i !== _ && (w[T] ^= $[T]);
					!function (e, t, i) {
						for (var n = new Array(4), s = new Array(4), o = 0; o < 4; o++)
							s[0] = 255 & e[4 * o],
								s[1] = 255 & e[4 * o + 1],
								s[2] = 255 & e[4 * o + 2],
								s[3] = 255 & e[4 * o + 3],
								n[o] = s[0] << 24 | s[1] << 16 | s[2] << 8 | s[3];
						for (var c, d = 0; d < 32; d += 4)
							c = n[1] ^ n[2] ^ n[3] ^ i[d + 0],
								n[0] ^= r(a(c)),
								c = n[2] ^ n[3] ^ n[0] ^ i[d + 1],
								n[1] ^= r(a(c)),
								c = n[3] ^ n[0] ^ n[1] ^ i[d + 2],
								n[2] ^= r(a(c)),
								c = n[0] ^ n[1] ^ n[2] ^ i[d + 3],
								n[3] ^= r(a(c));
						for (var _ = 0; _ < 16; _ += 4)
							t[_] = n[3 - _ / 4] >>> 24 & 255,
								t[_ + 1] = n[3 - _ / 4] >>> 16 & 255,
								t[_ + 2] = n[3 - _ / 4] >>> 8 & 255,
								t[_ + 3] = 255 & n[3 - _ / 4]
					}(w, x, b);
					for (var E = 0; E < l; E++)
						"cbc" === p && i === _ && (x[E] ^= $[E]),
							v[C + E] = x[E];
					"cbc" === p && ($ = i !== _ ? x : w),
						y -= l,
						C += l
				}
				console.log(d);
				return "pkcs#5" === h && i === _ && (h = v[v.length - 1],
					v.splice(v.length - h, h)),
					"array" !== c ? i !== _ ? v.map(function (e) {
						return 1 === (e = e.toString(16)).length ? "0" + e : e
					}).join("") : function (e) {
						for (var t = [], i = 0, n = e.length; i < n; i++)
							240 <= e[i] && e[i] <= 247 ? (t.push(String.fromCodePoint(((7 & e[i]) << 18) + ((63 & e[i + 1]) << 12) + ((63 & e[i + 2]) << 6) + (63 & e[i + 3]))),
								i += 3) : 224 <= e[i] && e[i] <= 239 ? (t.push(String.fromCodePoint(((15 & e[i]) << 12) + ((63 & e[i + 1]) << 6) + (63 & e[i + 2]))),
									i += 2) : 192 <= e[i] && e[i] <= 223 ? (t.push(String.fromCodePoint(((31 & e[i]) << 6) + (63 & e[i + 1]))),
										i++) : t.push(String.fromCodePoint(e[i]));
						return t.join("")
					}(v) : v
			}
			var d = i(319);
			i(1058),
				i(9600),
				i(1249),
				i(3710),
				i(1539),
				i(9714),
				i(9841),
				i(4953),
				i(7042),
				i(561);
			var _ = 0
				, l = 16
				, u = [214, 144, 233, 254, 204, 225, 61, 183, 22, 182, 20, 194, 40, 251, 44, 5, 43, 103, 154, 118, 42, 190, 4, 195, 170, 68, 19, 38, 73, 134, 6, 153, 156, 66, 80, 244, 145, 239, 152, 122, 51, 84, 11, 67, 237, 207, 172, 98, 228, 179, 28, 169, 201, 8, 232, 149, 128, 223, 148, 250, 117, 143, 63, 166, 71, 7, 167, 252, 243, 115, 23, 186, 131, 89, 60, 25, 230, 133, 79, 168, 104, 107, 129, 178, 113, 100, 218, 139, 248, 235, 15, 75, 112, 86, 157, 53, 30, 36, 14, 94, 99, 88, 209, 162, 37, 34, 124, 59, 1, 33, 120, 135, 212, 0, 70, 87, 159, 211, 39, 82, 76, 54, 2, 231, 160, 196, 200, 158, 234, 191, 138, 210, 64, 199, 56, 181, 163, 247, 242, 206, 249, 97, 21, 161, 224, 174, 93, 164, 155, 52, 26, 85, 173, 147, 50, 48, 245, 140, 177, 227, 29, 246, 226, 46, 130, 102, 202, 96, 192, 41, 35, 171, 13, 83, 78, 111, 213, 219, 55, 69, 222, 253, 142, 47, 3, 255, 106, 114, 109, 108, 91, 81, 141, 27, 175, 146, 187, 221, 188, 127, 17, 217, 92, 65, 31, 16, 90, 216, 10, 193, 49, 136, 165, 205, 123, 189, 45, 116, 208, 18, 184, 229, 180, 176, 137, 105, 151, 74, 12, 150, 119, 126, 101, 185, 241, 9, 197, 110, 198, 132, 24, 240, 125, 236, 58, 220, 77, 32, 121, 238, 95, 62, 215, 203, 57, 72]
				, f = [462357, 472066609, 943670861, 1415275113, 1886879365, 2358483617, 2830087869, 3301692121, 3773296373, 4228057617, 404694573, 876298825, 1347903077, 1819507329, 2291111581, 2762715833, 3234320085, 3705924337, 4177462797, 337322537, 808926789, 1280531041, 1752135293, 2223739545, 2695343797, 3166948049, 3638552301, 4110090761, 269950501, 741554753, 1213159005, 1684763257];
			e.exports = {
				encrypt: function (e, t, i) {
					var wodiu = c(e, t, 1, i);
					console.log("不是吧");
					return c(e, t, 1, i)
				},
				decrypt: function (e, t, i) {
					return c(e, t, 0, i)
				}
			}
			console.log("没有结果", e.exports);
			window.URSSM4 = e.exports;

		},
		9662: function (e, t, i) {
			var n = i(7854)
				, s = i(614)
				, a = i(6330)
				, r = n.TypeError;
			e.exports = function (e) {
				if (s(e))
					return e;
				throw r(a(e) + " is not a function")
			}
		},
		9670: function (e, t, i) {
			var n = i(7854)
				, s = i(111)
				, a = n.String
				, r = n.TypeError;
			e.exports = function (e) {
				if (s(e))
					return e;
				throw r(a(e) + " is not an object")
			}
		},
		1318: function (e, t, i) {
			var n = i(5656)
				, s = i(1400)
				, a = i(6244)
				, i = function (e) {
					return function (t, i, r) {
						var o, c = n(t), d = a(c), _ = s(r, d);
						if (e && i != i) {
							for (; _ < d;)
								if ((o = c[_++]) != o)
									return !0
						} else
							for (; _ < d; _++)
								if ((e || _ in c) && c[_] === i)
									return e || _ || 0;
						return !e && -1
					}
				};
			e.exports = {
				includes: i(!0),
				indexOf: i(!1)
			}
		},
		2092: function (e, t, i) {
			var n = i(9974)
				, s = i(1702)
				, a = i(8361)
				, r = i(7908)
				, o = i(6244)
				, c = i(5417)
				, d = s([].push)
				, s = function (e) {
					var t = 1 == e
						, i = 2 == e
						, s = 3 == e
						, _ = 4 == e
						, l = 6 == e
						, u = 7 == e
						, f = 5 == e || l;
					return function (h, p, m, g) {
						for (var b, v, $ = r(h), y = a($), C = n(p, m), w = o(y), x = 0, g = g || c, T = t ? g(h, w) : i || u ? g(h, 0) : void 0; x < w; x++)
							if ((f || x in y) && (v = C(b = y[x], x, $),
								e))
								if (t)
									T[x] = v;
								else if (v)
									switch (e) {
										case 3:
											return !0;
										case 5:
											return b;
										case 6:
											return x;
										case 2:
											d(T, b)
									}
								else
									switch (e) {
										case 4:
											return !1;
										case 7:
											d(T, b)
									}
						return l ? -1 : s || _ ? _ : T
					}
				};
			e.exports = {
				forEach: s(0),
				map: s(1),
				filter: s(2),
				some: s(3),
				every: s(4),
				find: s(5),
				findIndex: s(6),
				filterReject: s(7)
			}
		},
		1194: function (e, t, i) {
			var n = i(7293)
				, s = i(5112)
				, a = i(7392)
				, r = s("species");
			e.exports = function (e) {
				return 51 <= a || !n(function () {
					var t = [];
					return (t.constructor = {})[r] = function () {
						return {
							foo: 1
						}
					}
						,
						1 !== t[e](Boolean).foo
				})
			}
		},
		9341: function (e, t, i) {
			"use strict";
			var n = i(7293);
			e.exports = function (e, t) {
				var i = [][e];
				return !!i && n(function () {
					i.call(null, t || function () {
						throw 1
					}
						, 1)
				})
			}
		},
		206: function (e, t, i) {
			i = i(1702);
			e.exports = i([].slice)
		},
		7475: function (e, t, i) {
			var n = i(7854)
				, s = i(3157)
				, a = i(4411)
				, r = i(111)
				, o = i(5112)("species")
				, c = n.Array;
			e.exports = function (e) {
				var t;
				return s(e) && (t = e.constructor,
					(a(t) && (t === c || s(t.prototype)) || r(t) && null === (t = t[o])) && (t = void 0)),
					void 0 === t ? c : t
			}
		},
		5417: function (e, t, i) {
			var n = i(7475);
			e.exports = function (e, t) {
				return new (n(e))(0 === t ? 0 : t)
			}
		},
		4326: function (e, t, i) {
			var i = i(1702)
				, n = i({}.toString)
				, s = i("".slice);
			e.exports = function (e) {
				return s(n(e), 8, -1)
			}
		},
		648: function (e, t, i) {
			var n = i(7854)
				, s = i(1694)
				, a = i(614)
				, r = i(4326)
				, o = i(5112)("toStringTag")
				, c = n.Object
				, d = "Arguments" == r(function () {
					return arguments
				}());
			e.exports = s ? r : function (e) {
				var t;
				return void 0 === e ? "Undefined" : null === e ? "Null" : "string" == typeof (e = function (e, t) {
					try {
						return e[t]
					} catch (i) { }
				}(t = c(e), o)) ? e : d ? r(t) : "Object" == (e = r(t)) && a(t.callee) ? "Arguments" : e
			}
		},
		9920: function (e, t, i) {
			var n = i(2597)
				, s = i(3887)
				, a = i(1236)
				, r = i(3070);
			e.exports = function (e, t) {
				for (var i = s(t), o = r.f, c = a.f, d = 0; d < i.length; d++) {
					var _ = i[d];
					n(e, _) || o(e, _, c(t, _))
				}
			}
		},
		8880: function (e, t, i) {
			var n = i(9781)
				, s = i(3070)
				, a = i(9114);
			e.exports = n ? function (e, t, i) {
				return s.f(e, t, a(1, i))
			}
				: function (e, t, i) {
					return e[t] = i,
						e
				}
		},
		9114: function (e) {
			e.exports = function (e, t) {
				return {
					enumerable: !(1 & e),
					configurable: !(2 & e),
					writable: !(4 & e),
					value: t
				}
			}
		},
		6135: function (e, t, i) {
			"use strict";
			var n = i(4948)
				, s = i(3070)
				, a = i(9114);
			e.exports = function (e, t, i) {
				t = n(t);
				t in e ? s.f(e, t, a(0, i)) : e[t] = i
			}
		},
		9781: function (e, t, i) {
			i = i(7293);
			e.exports = !i(function () {
				return 7 != Object.defineProperty({}, 1, {
					get: function () {
						return 7
					}
				})[1]
			})
		},
		317: function (e, t, i) {
			var n = i(7854)
				, i = i(111)
				, s = n.document
				, a = i(s) && i(s.createElement);
			e.exports = function (e) {
				return a ? s.createElement(e) : {}
			}
		},
		8113: function (e, t, i) {
			i = i(5005);
			e.exports = i("navigator", "userAgent") || ""
		},
		7392: function (e, t, i) {
			var n, s, a = i(7854), r = i(8113), i = a.process, a = a.Deno, a = i && i.versions || a && a.version, a = a && a.v8;
			!(s = a ? 0 < (n = a.split("."))[0] && n[0] < 4 ? 1 : +(n[0] + n[1]) : s) && r && (!(n = r.match(/Edge\/(\d+)/)) || 74 <= n[1]) && (n = r.match(/Chrome\/(\d+)/)) && (s = +n[1]),
				e.exports = s
		},
		748: function (e) {
			e.exports = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"]
		},
		2109: function (e, t, i) {
			var n = i(7854)
				, s = i(1236).f
				, a = i(8880)
				, r = i(1320)
				, o = i(3505)
				, c = i(9920)
				, d = i(4705);
			e.exports = function (e, t) {
				var i, _, l, u = e.target, f = e.global, h = e.stat, p = f ? n : h ? n[u] || o(u, {}) : (n[u] || {}).prototype;
				if (p)
					for (i in t) {
						if (_ = t[i],
							l = e.noTargetGet ? (l = s(p, i)) && l.value : p[i],
							!d(f ? i : u + (h ? "." : "#") + i, e.forced) && void 0 !== l) {
							if (typeof _ == typeof l)
								continue;
							c(_, l)
						}
						(e.sham || l && l.sham) && a(_, "sham", !0),
							r(p, i, _, e)
					}
			}
		},
		7293: function (e) {
			e.exports = function (e) {
				try {
					return !!e()
				} catch (t) {
					return !0
				}
			}
		},
		9974: function (e, t, i) {
			var n = i(1702)
				, s = i(9662)
				, a = n(n.bind);
			e.exports = function (e, t) {
				return s(e),
					void 0 === t ? e : a ? a(e, t) : function () {
						return e.apply(t, arguments)
					}
			}
		},
		6916: function (e) {
			var t = Function.prototype.call;
			e.exports = t.bind ? t.bind(t) : function () {
				return t.apply(t, arguments)
			}
		},
		6530: function (e, t, i) {
			var n = i(9781)
				, s = i(2597)
				, a = Function.prototype
				, r = n && Object.getOwnPropertyDescriptor
				, i = s(a, "name")
				, s = i && "something" === function () { }
					.name
				, r = i && (!n || r(a, "name").configurable);
			e.exports = {
				EXISTS: i,
				PROPER: s,
				CONFIGURABLE: r
			}
		},
		1702: function (e) {
			var t = Function.prototype
				, i = t.bind
				, n = t.call
				, s = i && i.bind(n);
			e.exports = i ? function (e) {
				return e && s(n, e)
			}
				: function (e) {
					return e && function () {
						return n.apply(e, arguments)
					}
				}
		},
		5005: function (e, t, i) {
			var n = i(7854)
				, s = i(614);
			e.exports = function (e, t) {
				return arguments.length < 2 ? (i = n[e],
					s(i) ? i : void 0) : n[e] && n[e][t];
			}
		},
		8173: function (e, t, i) {
			var n = i(9662);
			e.exports = function (e, t) {
				e = e[t];
				return null == e ? void 0 : n(e)
			}
		},
		7854: function (e, t, i) {
			var n = function (e) {
				return e && e.Math == Math && e
			};
			e.exports = n("object" == typeof globalThis && globalThis) || n("object" == typeof window && window) || n("object" == typeof self && self) || n("object" == typeof i.g && i.g) || function () {
				return this
			}() || Function("return this")()
		},
		2597: function (e, t, i) {
			var n = i(1702)
				, s = i(7908)
				, a = n({}.hasOwnProperty);
			e.exports = Object.hasOwn || function (e, t) {
				return a(s(e), t)
			}
		},
		3501: function (e) {
			e.exports = {}
		},
		4664: function (e, t, i) {
			var n = i(9781)
				, s = i(7293)
				, a = i(317);
			e.exports = !n && !s(function () {
				return 7 != Object.defineProperty(a("div"), "a", {
					get: function () {
						return 7
					}
				}).a
			})
		},
		8361: function (e, t, i) {
			var n = i(7854)
				, s = i(1702)
				, a = i(7293)
				, r = i(4326)
				, o = n.Object
				, c = s("".split);
			e.exports = a(function () {
				return !o("z").propertyIsEnumerable(0)
			}) ? function (e) {
				return "String" == r(e) ? c(e, "") : o(e)
			}
				: o
		},
		2788: function (e, t, i) {
			var n = i(1702)
				, s = i(614)
				, i = i(5465)
				, a = n(Function.toString);
			s(i.inspectSource) || (i.inspectSource = function (e) {
				return a(e)
			}
			),
				e.exports = i.inspectSource
		},
		9909: function (e, t, i) {
			var n, s, a, r, o, c, d, _, l = i(8536), u = i(7854), f = i(1702), h = i(111), p = i(8880), m = i(2597), g = i(5465), b = i(6200), i = i(3501), v = "Object already initialized", $ = u.TypeError, u = u.WeakMap;
			d = l || g.state ? (n = g.state || (g.state = new u),
				s = f(n.get),
				a = f(n.has),
				r = f(n.set),
				o = function (e, t) {
					if (a(n, e))
						throw new $(v);
					return t.facade = e,
						r(n, e, t),
						t
				}
				,
				c = function (e) {
					return s(n, e) || {}
				}
				,
				function (e) {
					return a(n, e)
				}
			) : (i[_ = b("state")] = !0,
				o = function (e, t) {
					if (m(e, _))
						throw new $(v);
					return t.facade = e,
						p(e, _, t),
						t
				}
				,
				c = function (e) {
					return m(e, _) ? e[_] : {}
				}
				,
				function (e) {
					return m(e, _)
				}
			),
				e.exports = {
					set: o,
					get: c,
					has: d,
					enforce: function (e) {
						return d(e) ? c(e) : o(e, {})
					},
					getterFor: function (e) {
						return function (t) {
							var i;
							if (!h(t) || (i = c(t)).type !== e)
								throw $("Incompatible receiver, " + e + " required");
							return i
						}
					}
				}
		},
		3157: function (e, t, i) {
			var n = i(4326);
			e.exports = Array.isArray || function (e) {
				return "Array" == n(e)
			}
		},
		614: function (e) {
			e.exports = function (e) {
				return "function" == typeof e
			}
		},
		4411: function (e, t, i) {
			var n = i(1702)
				, s = i(7293)
				, a = i(614)
				, r = i(648)
				, o = i(5005)
				, c = i(2788)
				, d = function () { }
				, _ = []
				, l = o("Reflect", "construct")
				, u = /^\s*(?:class|function)\b/
				, f = n(u.exec)
				, h = !u.exec(d)
				, p = function (e) {
					if (!a(e))
						return !1;
					try {
						return l(d, _, e),
							!0
					} catch (t) {
						return !1
					}
				};
			e.exports = !l || s(function () {
				var e;
				return p(p.call) || !p(Object) || !p(function () {
					e = !0
				}) || e
			}) ? function (e) {
				if (!a(e))
					return !1;
				switch (r(e)) {
					case "AsyncFunction":
					case "GeneratorFunction":
					case "AsyncGeneratorFunction":
						return !1
				}
				return h || !!f(u, c(e))
			}
				: p
		},
		4705: function (e, t, i) {
			var n = i(7293)
				, s = i(614)
				, a = /#|\.prototype\./
				, i = function (e, t) {
					e = o[r(e)];
					return e == d || e != c && (s(t) ? n(t) : !!t)
				}
				, r = i.normalize = function (e) {
					return String(e).replace(a, ".").toLowerCase()
				}
				, o = i.data = {}
				, c = i.NATIVE = "N"
				, d = i.POLYFILL = "P";
			e.exports = i
		},
		111: function (e, t, i) {
			var n = i(614);
			e.exports = function (e) {
				return "object" == typeof e ? null !== e : n(e)
			}
		},
		1913: function (e) {
			e.exports = !1
		},
		2190: function (e, t, i) {
			var n = i(7854)
				, s = i(5005)
				, a = i(614)
				, r = i(7976)
				, i = i(3307)
				, o = n.Object;
			e.exports = i ? function (e) {
				return "symbol" == typeof e
			}
				: function (e) {
					var t = s("Symbol");
					return a(t) && r(t.prototype, o(e))
				}
		},
		6244: function (e, t, i) {
			var n = i(7466);
			e.exports = function (e) {
				return n(e.length)
			}
		},
		133: function (e, t, i) {
			var n = i(7392)
				, i = i(7293);
			e.exports = !!Object.getOwnPropertySymbols && !i(function () {
				var e = Symbol();
				return !String(e) || !(Object(e) instanceof Symbol) || !Symbol.sham && n && n < 41
			})
		},
		8536: function (e, t, i) {
			var n = i(7854)
				, s = i(614)
				, i = i(2788)
				, n = n.WeakMap;
			e.exports = s(n) && /native code/.test(i(n))
		},
		3009: function (e, t, i) {
			var n = i(7854)
				, s = i(7293)
				, a = i(1702)
				, r = i(1340)
				, o = i(3111).trim
				, i = i(1361)
				, c = n.parseInt
				, n = n.Symbol
				, d = n && n.iterator
				, _ = /^[+-]?0x/i
				, l = a(_.exec)
				, s = 8 !== c(i + "08") || 22 !== c(i + "0x16") || d && !s(function () {
					c(Object(d))
				});
			e.exports = s ? function u(e, t) {
				e = o(r(e));
				return c(e, t >>> 0 || (l(_, e) ? 16 : 10))
			}
				: c
		},
		3070: function (e, t, i) {
			var n = i(7854)
				, s = i(9781)
				, a = i(4664)
				, r = i(9670)
				, o = i(4948)
				, c = n.TypeError
				, d = Object.defineProperty;
			t.f = s ? d : function (e, t, i) {
				if (r(e),
					t = o(t),
					r(i),
					a)
					try {
						return d(e, t, i)
					} catch (n) { }
				if ("get" in i || "set" in i)
					throw c("Accessors not supported");
				return "value" in i && (e[t] = i.value),
					e
			}
		},
		1236: function (e, t, i) {
			var n = i(9781)
				, s = i(6916)
				, a = i(5296)
				, r = i(9114)
				, o = i(5656)
				, c = i(4948)
				, d = i(2597)
				, _ = i(4664)
				, l = Object.getOwnPropertyDescriptor;
			t.f = n ? l : function (e, t) {
				if (e = o(e),
					t = c(t),
					_)
					try {
						return l(e, t)
					} catch (i) { }
				if (d(e, t))
					return r(!s(a.f, e, t), e[t])
			}
		},
		8006: function (e, t, i) {
			var n = i(6324)
				, s = i(748).concat("length", "prototype");
			t.f = Object.getOwnPropertyNames || function (e) {
				return n(e, s)
			}
		},
		5181: function (e, t) {
			t.f = Object.getOwnPropertySymbols
		},
		7976: function (e, t, i) {
			i = i(1702);
			e.exports = i({}.isPrototypeOf)
		},
		6324: function (e, t, i) {
			var n = i(1702)
				, s = i(2597)
				, a = i(5656)
				, r = i(1318).indexOf
				, o = i(3501)
				, c = n([].push);
			e.exports = function (e, t) {
				var i, n = a(e), d = 0, _ = [];
				for (i in n)
					!s(o, i) && s(n, i) && c(_, i);
				for (; t.length > d;)
					s(n, i = t[d++]) && (~r(_, i) || c(_, i));
				return _
			}
		},
		5296: function (e, t) {
			"use strict";
			var i = {}.propertyIsEnumerable
				, n = Object.getOwnPropertyDescriptor
				, s = n && !i.call({
					1: 2
				}, 1);
			t.f = s ? function (e) {
				e = n(this, e);
				return !!e && e.enumerable
			}
				: i
		},
		288: function (e, t, i) {
			"use strict";
			var n = i(1694)
				, s = i(648);
			e.exports = n ? {}.toString : function () {
				return "[object " + s(this) + "]"
			}
		},
		2140: function (e, t, i) {
			var n = i(7854)
				, s = i(6916)
				, a = i(614)
				, r = i(111)
				, o = n.TypeError;
			e.exports = function (e, t) {
				var i, n;
				if ("string" === t && a(i = e.toString) && !r(n = s(i, e)))
					return n;
				if (a(i = e.valueOf) && !r(n = s(i, e)))
					return n;
				if ("string" !== t && a(i = e.toString) && !r(n = s(i, e)))
					return n;
				throw o("Can't convert object to primitive value")
			}
		},
		3887: function (e, t, i) {
			var n = i(5005)
				, s = i(1702)
				, a = i(8006)
				, r = i(5181)
				, o = i(9670)
				, c = s([].concat);
			e.exports = n("Reflect", "ownKeys") || function (e) {
				var t = a.f(o(e))
					, i = r.f;
				return i ? c(t, i(e)) : t
			}
		},
		1320: function (e, t, i) {
			var n = i(7854)
				, s = i(614)
				, a = i(2597)
				, r = i(8880)
				, o = i(3505)
				, c = i(2788)
				, d = i(9909)
				, _ = i(6530).CONFIGURABLE
				, l = d.get
				, u = d.enforce
				, f = String(String).split("String");
			(e.exports = function (e, t, i, c) {
				var d = !!c && !!c.unsafe
					, l = !!c && !!c.enumerable
					, h = !!c && !!c.noTargetGet
					, p = c && void 0 !== c.name ? c.name : t;
				s(i) && ("Symbol(" === String(p).slice(0, 7) && (p = "[" + String(p).replace(/^Symbol\(([^)]*)\)/, "$1") + "]"),
					(!a(i, "name") || _ && i.name !== p) && r(i, "name", p),
					(c = u(i)).source || (c.source = f.join("string" == typeof p ? p : ""))),
					e !== n ? (d ? !h && e[t] && (l = !0) : delete e[t],
						l ? e[t] = i : r(e, t, i)) : l ? e[t] = i : o(t, i)
			}
			)(Function.prototype, "toString", function () {
				return s(this) && l(this).source || c(this)
			})
		},
		7066: function (e, t, i) {
			"use strict";
			var n = i(9670);
			e.exports = function () {
				var e = n(this)
					, t = "";
				return e.global && (t += "g"),
					e.ignoreCase && (t += "i"),
					e.multiline && (t += "m"),
					e.dotAll && (t += "s"),
					e.unicode && (t += "u"),
					e.sticky && (t += "y"),
					t
			}
		},
		4488: function (e, t, i) {
			var n = i(7854).TypeError;
			e.exports = function (e) {
				if (void 0 == e)
					throw n("Can't call method on " + e);
				return e
			}
		},
		3505: function (e, t, i) {
			var n = i(7854)
				, s = Object.defineProperty;
			e.exports = function (e, t) {
				try {
					s(n, e, {
						value: t,
						configurable: !0,
						writable: !0
					})
				} catch (i) {
					n[e] = t
				}
				return t
			}
		},
		6200: function (e, t, i) {
			var n = i(2309)
				, s = i(9711)
				, a = n("keys");
			e.exports = function (e) {
				return a[e] || (a[e] = s(e))
			}
		},
		5465: function (e, t, i) {
			var n = i(7854)
				, s = i(3505)
				, i = "__core-js_shared__"
				, s = n[i] || s(i, {});
			e.exports = s
		},
		2309: function (e, t, i) {
			var n = i(1913)
				, s = i(5465);
			(e.exports = function (e, t) {
				return s[e] || (s[e] = void 0 !== t ? t : {})
			}
			)("versions", []).push({
				version: "3.19.0",
				mode: n ? "pure" : "global",
				copyright: "22"
			})
		},
		8710: function (e, t, i) {
			var n = i(1702)
				, s = i(9303)
				, a = i(1340)
				, r = i(4488)
				, o = n("".charAt)
				, c = n("".charCodeAt)
				, d = n("".slice)
				, n = function (e) {
					return function (t, i) {
						var n, _ = a(r(t)), l = s(i), t = _.length;
						return l < 0 || t <= l ? e ? "" : void 0 : (i = c(_, l)) < 55296 || 56319 < i || l + 1 === t || (n = c(_, l + 1)) < 56320 || 57343 < n ? e ? o(_, l) : i : e ? d(_, l, l + 2) : n - 56320 + (i - 55296 << 10) + 65536
					}
				};
			e.exports = {
				codeAt: n(!1),
				charAt: n(!0)
			}
		},
		3111: function (e, t, i) {
			var n = i(1702)
				, s = i(4488)
				, a = i(1340)
				, i = i(1361)
				, r = n("".replace)
				, i = "[" + i + "]"
				, o = RegExp("^" + i + i + "*")
				, c = RegExp(i + i + "*$")
				, i = function (e) {
					return function (t) {
						t = a(s(t));
						return 1 & e && (t = r(t, o, "")),
							t = 2 & e ? r(t, c, "") : t
					}
				};
			e.exports = {
				start: i(1),
				end: i(2),
				trim: i(3)
			}
		},
		1400: function (e, t, i) {
			var n = i(9303)
				, s = Math.max
				, a = Math.min;
			e.exports = function (e, t) {
				e = n(e);
				return e < 0 ? s(e + t, 0) : a(e, t)
			}
		},
		5656: function (e, t, i) {
			var n = i(8361)
				, s = i(4488);
			e.exports = function (e) {
				return n(s(e))
			}
		},
		9303: function (e) {
			var t = Math.ceil
				, i = Math.floor;
			e.exports = function (e) {
				e = +e;
				return e != e || 0 == e ? 0 : (0 < e ? i : t)(e)
			}
		},
		7466: function (e, t, i) {
			var n = i(9303)
				, s = Math.min;
			e.exports = function (e) {
				return 0 < e ? s(n(e), 9007199254740991) : 0
			}
		},
		7908: function (e, t, i) {
			var n = i(7854)
				, s = i(4488)
				, a = n.Object;
			e.exports = function (e) {
				return a(s(e))
			}
		},
		7593: function (e, t, i) {
			var n = i(7854)
				, s = i(6916)
				, a = i(111)
				, r = i(2190)
				, o = i(8173)
				, c = i(2140)
				, i = i(5112)
				, d = n.TypeError
				, _ = i("toPrimitive");
			e.exports = function (e, t) {
				if (!a(e) || r(e))
					return e;
				var i = o(e, _);
				if (i) {
					if (void 0 === t && (t = "default"),
						i = s(i, e, t),
						!a(i) || r(i))
						return i;
					throw d("Can't convert object to primitive value");
				}
				return void 0 === t && (t = "number"),
					c(e, t)
			}
		},
		4948: function (e, t, i) {
			var n = i(7593)
				, s = i(2190);
			e.exports = function (e) {
				e = n(e, "string");
				return s(e) ? e : e + ""
			}
		},
		1694: function (e, t, i) {
			var n = {};
			n[i(5112)("toStringTag")] = "z",
				e.exports = "[object z]" === String(n)
		},
		1340: function (e, t, i) {
			var n = i(7854)
				, s = i(648)
				, a = n.String;
			e.exports = function (e) {
				if ("Symbol" === s(e))
					throw TypeError("Cannot convert a Symbol value to a string");
				return a(e)
			}
		},
		6330: function (e, t, i) {
			var n = i(7854).String;
			e.exports = function (e) {
				try {
					return n(e)
				} catch (t) {
					return "Object"
				}
			}
		},
		9711: function (e, t, i) {
			var i = i(1702)
				, n = 0
				, s = Math.random()
				, a = i(1..toString);
			e.exports = function (e) {
				return "Symbol(" + (void 0 === e ? "" : e) + ")_" + a(++n + s, 36)
			}
		},
		3307: function (e, t, i) {
			i = i(133);
			e.exports = i && !Symbol.sham && "symbol" == typeof Symbol.iterator
		},
		5112: function (e, t, i) {
			var n = i(7854)
				, s = i(2309)
				, a = i(2597)
				, r = i(9711)
				, o = i(133)
				, c = i(3307)
				, d = s("wks")
				, _ = n.Symbol
				, l = _ && _["for"]
				, u = c ? _ : _ && _.withoutSetter || r;
			e.exports = function (e) {
				var t;
				return a(d, e) && (o || "string" == typeof d[e]) || (t = "Symbol." + e,
					o && a(_, e) ? d[e] = _[e] : d[e] = (c && l ? l : u)(t)),
					d[e]
			}
		},
		1361: function (e) {
			e.exports = "\t\n\x0B\f\r                　\u2028\u2029\ufeff"
		},
		9600: function (e, t, i) {
			"use strict";
			var n = i(2109)
				, s = i(1702)
				, a = i(8361)
				, r = i(5656)
				, i = i(9341)
				, o = s([].join)
				, a = a != Object
				, i = i("join", ",");
			n({
				target: "Array",
				proto: !0,
				forced: a || !i
			}, {
				join: function (e) {
					return o(r(this), void 0 === e ? "," : e)
				}
			})
		},
		1249: function (e, t, i) {
			"use strict";
			var n = i(2109)
				, s = i(2092).map;
			n({
				target: "Array",
				proto: !0,
				forced: !i(1194)("map")
			}, {
				map: function (e) {
					return s(this, e, 1 < arguments.length ? arguments[1] : void 0)
				}
			})
		},
		7042: function (e, t, i) {
			"use strict";
			var n = i(2109)
				, s = i(7854)
				, a = i(3157)
				, r = i(4411)
				, o = i(111)
				, c = i(1400)
				, d = i(6244)
				, _ = i(5656)
				, l = i(6135)
				, u = i(5112)
				, f = i(1194)
				, h = i(206)
				, f = f("slice")
				, p = u("species")
				, m = s.Array
				, g = Math.max;
			n({
				target: "Array",
				proto: !0,
				forced: !f
			}, {
				slice: function (e, t) {
					var i, n, s, u = _(this), f = d(u), b = c(e, f), v = c(void 0 === t ? f : t, f);
					if (a(u) && (i = u.constructor,
						(i = r(i) && (i === m || a(i.prototype)) || o(i) && null === (i = i[p]) ? void 0 : i) === m || void 0 === i))
						return h(u, b, v);
					for (n = new (void 0 === i ? m : i)(g(v - b, 0)),
						s = 0; b < v; b++,
						s++)
						b in u && l(n, s, u[b]);
					return n.length = s,
						n
				}
			})
		},
		561: function (e, t, i) {
			"use strict";
			var n = i(2109)
				, s = i(7854)
				, a = i(1400)
				, r = i(9303)
				, o = i(6244)
				, c = i(7908)
				, d = i(5417)
				, _ = i(6135)
				, i = i(1194)("splice")
				, l = s.TypeError
				, u = Math.max
				, f = Math.min;
			n({
				target: "Array",
				proto: !0,
				forced: !i
			}, {
				splice: function (e, t) {
					var i, n, s, h, p, m, g = c(this), b = o(g), v = a(e, b), e = arguments.length;
					if (0 === e ? i = n = 0 : n = 1 === e ? (i = 0,
						b - v) : (i = e - 2,
							f(u(r(t), 0), b - v)),
						9007199254740991 < b + i - n)
						throw l("Maximum allowed length exceeded");
					for (s = d(g, n),
						h = 0; h < n; h++)
						(p = v + h) in g && _(s, h, g[p]);
					if (i < (s.length = n)) {
						for (h = v; h < b - n; h++)
							m = h + i,
								(p = h + n) in g ? g[m] = g[p] : delete g[m];
						for (h = b; b - n + i < h; h--)
							delete g[h - 1]
					} else if (n < i)
						for (h = b - n; v < h; h--)
							m = h + i - 1,
								(p = h + n - 1) in g ? g[m] = g[p] : delete g[m];
					for (h = 0; h < i; h++)
						g[h + v] = arguments[h + 2];
					return g.length = b - n + i,
						s
				}
			})
		},
		3710: function (e, t, i) {
			var n = i(1702)
				, s = i(1320)
				, a = Date.prototype
				, r = "Invalid Date"
				, i = "toString"
				, o = n(a[i])
				, c = n(a.getTime);
			String(new Date(NaN)) != r && s(a, i, function () {
				var e = c(this);
				return e == e ? o(this) : r
			})
		},
		1539: function (e, t, i) {
			var n = i(1694)
				, s = i(1320)
				, i = i(288);
			n || s(Object.prototype, "toString", i, {
				unsafe: !0
			})
		},
		1058: function (e, t, i) {
			var n = i(2109)
				, i = i(3009);
			n({
				global: !0,
				forced: parseInt != i
			}, {
				parseInt: i
			})
		},
		9714: function (e, t, i) {
			"use strict";
			var n = i(1702)
				, s = i(6530).PROPER
				, a = i(1320)
				, r = i(9670)
				, o = i(7976)
				, c = i(1340)
				, d = i(7293)
				, _ = i(7066)
				, i = "toString"
				, l = RegExp.prototype
				, u = l[i]
				, f = n(_)
				, d = d(function () {
					return "/a/b" != u.call({
						source: "a",
						flags: "b"
					})
				})
				, s = s && u.name != i;
			(d || s) && a(RegExp.prototype, i, function () {
				var e = r(this)
					, t = c(e.source)
					, i = e.flags;
				return "/" + t + "/" + c(void 0 !== i || !o(l, e) || "flags" in l ? i : f(e))
			}, {
				unsafe: !0
			})
		},
		9841: function (e, t, i) {
			"use strict";
			var n = i(2109)
				, s = i(8710).codeAt;
			n({
				target: "String",
				proto: !0
			}, {
				codePointAt: function (e) {
					return s(this, e)
				}
			})
		},
		4953: function (e, t, i) {
			var n = i(2109)
				, s = i(7854)
				, a = i(1702)
				, r = i(1400)
				, o = s.RangeError
				, c = String.fromCharCode
				, s = String.fromCodePoint
				, d = a([].join);
			n({
				target: "String",
				stat: !0,
				forced: !!s && 1 != s.length
			}, {
				fromCodePoint: function (e) {
					for (var t, i = [], n = arguments.length, s = 0; s < n;) {
						if (t = +arguments[s++],
							r(t, 1114111) !== t)
							throw o(t + " is not a valid code point");
						i[s] = t < 65536 ? c(t) : c(55296 + ((t -= 65536) >> 10), t % 1024 + 56320)
					}
					return d(i, "")
				}
			})
		}
	},
		i = {},
		e.g = function () {
			if ("object" == typeof globalThis)
				return globalThis;
			try {
				return this || new Function("return this")()
			} catch (e) {
				if ("object" == typeof window)
					return window
			}
		}(),
		e(9579);
});

function createRtId() {
	var e = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
		t = 32,
		i = [];
	for (; t-- > 0;) i[t] = e.charAt(Math.random() * e.length);
	return i.join("")
}


let rtId = createRtId();

var str = `{"pd":"cbg","pkid":"aqpOBwV","pkht":"cbg.163.com","channel":0,"topURL":"https://xyq-m.cbg.163.com/cgi/mweb/show_login?back_url=%2Fcgi%2Fmweb%2Flogin%2Farea%3Fback_url%3Dhttps%253A%252F%252Fxyq-m.cbg.163.com%252Fcgi%252Fmweb%252Flogin%252Frole%252F35%252F416%253Fback_url%2","rtid":"${rtId}"}"`


// console.log(window.URSSM4.encrypt(str, "BC60B8B9E4FFEFFA219E5AD77F11F9E2"));
function createEncParams() {
	return window.URSSM4.encrypt(str, "BC60B8B9E4FFEFFA219E5AD77F11F9E2");
}

console.log(createEncParams());