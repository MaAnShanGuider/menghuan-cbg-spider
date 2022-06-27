I$("d9c6ce60dbff98dbeeee86945957430a",
	function (e, t, i, n, s, r, a, o, c, d, _, l, u, f, h, p, m, g, b, v) {
		window._$URS = {};
		var $, y = {
			1: "red",
			2: "orange",
			3: "green",
			4: "blue"
		};
		var C = "MP2-WEBINITOK:";
		m._$$IndexBase = t._$klass();
		$ = m._$$IndexBase._$extend(r._$$EventTarget);
		$.__init = function (e) {
			if (e.chromeSupport) this.__checkChromeHack();
			e = this.__changeCKeyToPKey(e);
			this.__super(e);
			this.__loadConfig(e);
			if (e.needSafePwd) n._$addEvent(document, "touchstart", this.__touchStart._$bind(this));
			n._$addEvent(document, "click", this.__changePage._$bind(this));
			d._$sendNetWorkLog();
			n._$addEvent(window, "message", this.__onMessage._$bind(this))
		};
		$.__checkIsDes = function () {
			if (window._$URSOPT.preFilledMobile) {
				window._$URSOPT.desMobile = "";
				window._$URSOPT.desMobileReal = ""
			}
		};
		$.__onMessage = function (e) {
			var t = e && e.data;
			if (t) {
				if ("object" == typeof t) t = JSON.stringify(t);
				if (0 === t.indexOf(C)) {
					t = JSON.parse(t.replace(C, ""));
					d._$postMessage("_parent", {
						data: {
							type: "webInitOk",
							rtid: window._$RTID || "",
							ursfp: t.ursfp || ""
						}
					})
				}
			}
		};
		$.__checkChromeHack = function () {
			if (!d._$cookieTest()) window._$URS.needChromeHack = d._$needChromeHack()
		};
		$.__reset = function (e) {
			this.__super(e)
		};
		$.__doClose = function () {
			var e = {
				type: "close"
			};
			e["URS-CM"] = 1;
			d._$postMessage("_parent", {
				data: e
			})
		};
		$.__addWatchMan = function () {
			var e = function () {
				var e = d._$isIPV6();
				var t = "conf0";
				var i = window._$URSCDNCF;
				if (i && (i.watchManConfV6 || i.watchManConf)) t = e ? i.watchManConfV6 : i.watchManConf;
				var n = "//acstatic-dun.126.net/tool.min.js",
					s = "//acstatic.dun.163yun.com/tool.min.js";
				var r = {
					configServer: "webzjac.reg.163.com",
					apiServer: "webzjac.reg.163.com",
					staticServer: "acstatic-dun.126.net"
				};
				var a = {
					staticServer: "acstatic.dun.163yun.com"
				};
				if (e) {
					n = "//acstatic-dun-v6.126.net/tool.min.js";
					r = {
						configServer: "webzjac-v6.reg.163.com",
						apiServer: "webzjac-v6.reg.163.com",
						staticServer: "acstatic-dun-v6.126.net"
					}
				}
				var o = "conf0" === t;
				return {
					staticjs0: location.protocol + (o ? n : s),
					staticjs1: location.protocol + (o ? s : n),
					__serverConfig__: o ? r : a
				}
			};
			return function () {
				var t = e();
				var i = o._$$LoaderScript._$allocate({
					timeout: 1e4,
					onerror: function () {
						var e = o._$$LoaderScript._$allocate({});
						e._$load(t["staticjs1"])
					}
				});
				i._$load(t["staticjs0"]);
				var n = setInterval(function () {
					if (window.initWatchman) {
						window.initWatchman({
							productNumber: "YD00000690443311",
							onload: function (e) {
								window._$URS.wm = e
							},
							__serverConfig__: t["__serverConfig__"]
						});
						n = clearInterval(n)
					}
				},
					100)
			}
		}();
		$.__tryUnload = function (e) {
			if (e.isDemo) return !1;
			if (d._$isVersionFour()) {
				if (!d._$isNewRequest() || !this.__tryConsoleWarn(e)) {
					this.showNotSupport();
					return !0
				}
			} else if (!d._$isVersionOk(e.version)) {
				this.showNotSupport();
				return !0
			}
		};
		$.showNotSupport = function () {
			i._$get("cnt-box-parent").innerHTML = '<div style="font-size:18px;text-align:center;padding:50px 0;">页面访问出错，请返回主页</div>';
			d._$resize()
		};
		$.__changeCKeyToPKey = function (e) {
			if (e.captchaKey) e.productKey = e.captchaKey;
			return e
		};
		$.__tryConsoleWarn = function (e) {
			var t = !0;
			s._$forIn(e,
				function (e, i) {
					if (s._$indexOf(["needanimation", "nocover", "iframeShowAnimation", "otherThirdLink"], i) !== -1) t = !1;
					if ("version" === i && !d._$isVersionOk(e) || "isHttps" === i && 1 !== e || "PROTOCOL" === i && "http" === e || "REGPROTOCOL" === i && "http" === e) t = !1
				});
			return t
		};
		$.__chromeSupportCheck = function () {
			if (this.__options.chromeSupport) if (!d._$isNewRequest() || "https:" !== location.protocol || "1" != this.__options.newCDN) {
				i._$get("cnt-box-parent").innerHTML = '<div style="font-size:18px;text-align:center;padding:50px 0;">配置不规范</div>';
				d._$resize();
				return !1
			}
			return !0
		};
		$.__loadConfig = function (t) {
			this.__options = t;
			if (t) {
				this._$safeCheck();
				t.needRegAgree = 1;
				t.needRegAgreeMb = 1;
				t.single = t.single || 0;
				this.__page = t.page || "login";
				if (t.notFastReg) {
					this.__page = "login";
					t.single = 1
				}
				if (t.needSafePwd && e._$is("desktop")) t.needSafePwd = 0;
				window._$inputTime = 300;
				window._$PRODUCT = t.product || "";
				window._$URSOPT = t || {};
				this.__checkIsDes();
				this.__loadCapJS();
				window._$capTxt1 = "请先拖动滑块进行安全验证";
				window._$capTxt2 = "请先进行验证";
				if (1 == t.enlang) {
					window._$capTxt1 = p.showText("请先拖动滑块进行安全验证", 1);
					window._$capTxt2 = p.showText("请先进行验证", 1)
				}
				window._$PKID = t.promark || "";
				window._$TOPURL = t.topURL || "";
				window._$TOPURL = window._$TOPURL.substring(0, 200);
				window._$pathB = t.pathB || 0;
				window._$needUrsBgp = t.needUrsBgp || 0;
				window._$bgpTime2 = t.bgpTime2 || 1e4;
				window._$readErrHelper = t.readErrHelper || "";
				window._$ISIOS = e._$is("ios");
				if (1 == window._$URSOPT.enlang) window._$URSOPT.lang = "en";
				this.__addCodeMap();
				this.__doEnCodeMap();
				d._$configLog(t);
				var i = t.cookieDomain;
				if (i && i.indexOf("dl.reg.163.com") < 0) if (window._$needUrsBgp && t.passportNeedUrsBgp) window._$needUrsBgp = 1;
				else window._$needUrsBgp = 0;
				window.isHttps = t.isHttps || 0;
				window.PROTOCOL = "http" == t.PROTOCOL ? "http://" : "https://";
				window.REGPROTOCOL = "http" == t.REGPROTOCOL ? "http://" : "https://";
				if (window.isHttps) {
					window.PROTOCOL = "https://";
					window.REGPROTOCOL = "https://"
				}
				if (!this.__tryUnload(t)) if (this.__chromeSupportCheck()) {
					if (d._$isVersionFour()) {
						t = this.__addDefaultBtnTxt(t);
						t.needRegAgreeNoChecked = 1;
						t.needRegAgreeMbNoChecked = 1;
						if (t.uniteLogin) {
							t.uniteLogin.clause = 1;
							if (1 === t.uniteLogin.noClauseForce) t.uniteLogin.clause = 0;
							t.uniteLogin.needClause = 1
						}
					}
					this.__loadStyle(t);
					this.__opt = t;
					this.__showPage()
				}
			} else this.__doClose()
		};
		$.__addDefaultBtnTxt = function (e) {
			if (e.needMobileLogin) {
				e.smsBtnTxt = e.smsBtnTxt || "登录";
				e.mbBtnTxt = e.mbBtnTxt || "登录"
			}
			if (e.needMobileReg) e.regMbTxt = e.regMbTxt || "注册";
			return e
		};
		$.__loadCapJS = function () {
			var e = function () {
				var e = d._$isIPV6();
				var t = "conf0";
				var i = "//cstaticdun.126.net/load.min.js",
					n = "//cstaticdun1.126.net/load.min.js";
				var s = window._$URSCDNCF;
				if (s && (s.capConfV6 || s.capConf)) t = e ? s.capConfV6 : s.capConf;
				if (e) i = "//cstaticdun-v6.126.net/load.min.js";
				var r = "conf0" === t;
				return {
					staticjs0: location.protocol + (r ? i : n),
					staticjs1: location.protocol + (r ? n : i)
				}
			};
			return function () {
				var t = e();
				var i = o._$$LoaderScript._$allocate({
					timeout: 1e4,
					onerror: function (e) {
						var i = 1;
						if (e && e.message.indexOf("超时") > -1) i = 2;
						var n = o._$$LoaderScript._$allocate({
							onerror: function () {
								window._$LOADCAPJSERROR = 1
							}
						});
						n._$load(t["staticjs1"]);
						var s = "//dl.reg.163.com/UA1435545636633/__utm.gif?from=webzj&loadcapjs=error&type=" + i;
						d._$sendLog(s)
					}
				});
				i._$load(t["staticjs0"])
			}
		}();
		$.__addCodeMap = function () {
			_["444"] = window._$capTxt1;
			_["445"] = window._$capTxt2;
			l["109"] = window._$capTxt1;
			l["110"] = window._$capTxt2;
			l["EXCEPTION_GET_TICKET_109"] = window._$capTxt1;
			l["EXCEPTION_GET_TICKET_110"] = window._$capTxt2;
			l["EXCEPTION_REG_MOB_109"] = window._$capTxt1;
			l["EXCEPTION_REG_MOB_110"] = window._$capTxt2;
			l["EXCEPTION_GET_SMS_109"] = window._$capTxt1;
			l["EXCEPTION_GET_SMS_110"] = window._$capTxt2;
			u["mb-nvfcp-444"] = window._$capTxt1;
			u["mb-nvfcp-445"] = window._$capTxt2;
			u["mb-nvftcp-444"] = window._$capTxt1;
			u["mb-nvftcp-445"] = window._$capTxt2;
			u["mb-nvfccp-444"] = window._$capTxt1;
			u["mb-nvfccp-445"] = window._$capTxt2;
			u["mb-nvfscp-444"] = window._$capTxt1;
			u["mb-nvfscp-445"] = window._$capTxt2;
			u["mb-nlregssms-444"] = window._$capTxt1;
			u["mb-nlregssms-445"] = window._$capTxt2;
			u["mb-vfcp-444"] = window._$capTxt1;
			u["mb-vfcp-445"] = window._$capTxt2;
			u["mb-vfscp-444"] = window._$capTxt1;
			u["mb-vfscp-445"] = window._$capTxt2;
			u["mb-vftcp-444"] = window._$capTxt1;
			u["mb-vftcp-445"] = window._$capTxt2;
			u["mb-vfccp-444"] = window._$capTxt1;
			u["mb-vfccp-445"] = window._$capTxt2;
			u["mb-login-444"] = window._$capTxt1;
			u["mb-login-445"] = window._$capTxt2;
			u["mb-lvfsms-444"] = window._$capTxt1;
			u["mb-lvfsms-445"] = window._$capTxt2;
			u["mb-sms-lsm-444"] = window._$capTxt1;
			u["mb-sms-lsm-445"] = window._$capTxt2;
			u["mb-reg-sm-10704"] = window._$capTxt1;
			u["mb-reg-sm-10705"] = window._$capTxt2;
			u["mb-reg-sm-109"] = window._$capTxt1;
			u["mb-reg-sm-110"] = window._$capTxt2;
			u["mb-reg-sm-444"] = window._$capTxt1;
			u["mb-reg-sm-445"] = window._$capTxt2
		};
		$.__doEnCodeMap = function () {
			var e = window._$URSOPT.enlang;
			if (1 == e) {
				s._$forIn(u,
					function (t, i) {
						u[i] = p.showText(t, e)
					});
				s._$forIn(f,
					function (t, i) {
						f[i] = p.showText(t, e)
					})
			}
		};
		$.__loadStyle = function (e) {
			var t = e.skin || "1";
			var n = e.cssFiles || "";
			var s = e.style || "";
			if (s) i._$addStyle(s);
			else if (!n && 0 != t) {
				t = y[t] || "red";
				var r = document.createElement("link");
				r.rel = "stylesheet";
				r.type = "text/css";
				r.href = "../../webapp/res/css/" + t + ".css";
				document.getElementsByTagName("head")[0].appendChild(r);
			}
		};
		$.__saveTempValue = function (e) {
			var t = i._$get("phoneipt");
			if ("mbRegGoLogin1" == e || "mbRegGoLogin2" == e || "mbLoginGoReg" == e) if (t && this.__opt) {
				var n = t.value || "";
				e = "//dl.reg.163.com/UA1435545636633/__utm.gif?log=" + encodeURIComponent(e) + "&ssn=" + encodeURIComponent(n) + "&pkid=" + encodeURIComponent(window._$PKID)
			}
			return e
		};
		$.__touchStart = function (e) {
			var t = n._$getElement(e),
				i = d._$findDataCode(t, "safepwdbox");
			if (!i) d._$postMessage("_parent", {
				data: {
					type: "doPwdHide"
				}
			})
		};
		$.__changePage = function (e) {
			var t = n._$getElement(e),
				s = i._$dataset(t, "action"),
				r = i._$dataset(t, "mdtype"),
				a = i._$dataset(t, "log"),
				o;
			if (a) {
				a = this.__saveTempValue(a);
				d._$sendLog(a)
			}
			d._$doProxyLink(e);
			if ("changepage" == s) {
				this.__mdType = r;
				this.__page = "login" == this.__page ? "register" : "login";
				if ("login" == this.__page && i._$get("VIP")) i._$get("VIP").style.display = "none";
				o = {
					type: "changepage",
					page: this.__page,
					mdtype: this.__mdType || ""
				};
				o["URS-CM"] = 1;
				d._$postMessage("_parent", {
					data: o
				});
				this.__showPage(1)
			}
		};
		$._$LgRefresh = function () {
			this.__page = "login";
			this.__showPage()
		};
		$._$setLoginClause = function (e, t) {
			e = "1" == e ? !0 : !1;
			if (this.__lg) this.__lg._$setLoginClause(e, t)
		};
		$._$safekeyboardMsg = function (e, t) {
			var i = t.origin;
			if (d._$testOrigin(i)) if (this.__rg) this.__rg._$safekeyboardMsg(e)
		};
		$._$safeCheck = function () {
			var e = this.__options.enlang;
			if (1 == e) {
				var t = p.showText("获取验证码", e);
				this.__options.getsmstxt = this.__options.getsmstxt ? d._$HtmlEncode(this.__options.getsmstxt) : t
			} else this.__options.getsmstxt = this.__options.getsmstxt ? d._$HtmlEncode(this.__options.getsmstxt) : "获取验证码";
			if (this.__options.hasMbQuestionUrl && !d._$notURL(this.__options.hasMbQuestionUrl)) this.__options.hasQuestion = this.__options.hasMbQuestionUrl;
			if (this.__options.mailloginclause) {
				if (this.__options.mailloginclause.list) this.__options.mailloginclause.list = d._$listSafeUrlFilter(this.__options.mailloginclause.list);
				if (this.__options.mailloginclause.clauseErr) this.__options.mailloginclause.clauseErr = d._$HtmlEncode(this.__options.mailloginclause.clauseErr)
			}
			if (this.__options.mbloginclause) {
				if (this.__options.mbloginclause.list) this.__options.mbloginclause.list = d._$listSafeUrlFilter(this.__options.mbloginclause.list);
				if (this.__options.mbloginclause.clauseErr) this.__options.mbloginclause.clauseErr = d._$HtmlEncode(this.__options.mbloginclause.clauseErr)
			}
		}
	},
	"a878c0216188111f46d39b9df767b354", "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "e0793c838b68fed5a7e1742035643bec", "12c5dab742044e15807978f676f5c3fc", "c488423b9f57765277b603bdd1fe75ea", "8f33f2dc03528616b29dd40cc05162ac", "a4de926c2d79e8d8f856eaff4dac0f8b", "285e64765191768caf2cc6de0397e37c", "dde0e6b40e64b3f022ca4ad9ab8b1a9c", "d6e36b6b1f96e15e42725a59e7acd142", "0a1f43423259f38e3b62bed150ead0f8", "54120fa727d71cd38f3b1273d034afef", "46a4de3a50f50a600950ca9cee88031e");