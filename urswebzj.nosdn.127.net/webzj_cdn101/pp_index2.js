var QRCode;
! function () {
	function e(e) {
		this.mode = o.MODE_8BIT_BYTE, this.data = e, this.parsedData = [];
		for (var t = 0, i = this.data.length; t < i; t++) {
			var n = [],
				s = this.data.charCodeAt(t);
			s > 65536 ? (n[0] = 240 | (1835008 & s) >>> 18, n[1] = 128 | (258048 & s) >>> 12, n[2] = 128 | (4032 & s) >>> 6, n[3] = 128 | 63 & s) : s > 2048 ? (n[0] = 224 | (61440 & s) >>> 12, n[1] = 128 | (4032 & s) >>> 6, n[2] = 128 | 63 & s) : s > 128 ? (n[0] = 192 | (1984 & s) >>> 6, n[1] = 128 | 63 & s) : n[0] = s, this.parsedData.push(n)
		}
		this.parsedData = Array.prototype.concat.apply([], this.parsedData), this.parsedData.length != this.data.length && (this.parsedData.unshift(191), this.parsedData.unshift(187), this.parsedData.unshift(239))
	}

	function t(e, t) {
		this.typeNumber = e, this.errorCorrectLevel = t, this.modules = null, this.moduleCount = 0, this.dataCache = null, this.dataList = []
	}

	function i(e, t) {
		if (void 0 == e.length) throw new Error(e.length + "/" + t);
		for (var i = 0; i < e.length && 0 == e[i];) i++;
		this.num = new Array(e.length - i + t);
		for (var n = 0; n < e.length - i; n++) this.num[n] = e[n + i]
	}

	function n(e, t) {
		this.totalCount = e, this.dataCount = t
	}

	function s() {
		this.buffer = [], this.length = 0
	}

	function a() {
		var e = !1,
			t = navigator.userAgent;
		if (/android/i.test(t)) {
			e = !0;
			var i = t.toString().match(/android ([0-9]\.[0-9])/i);
			i && i[1] && (e = parseFloat(i[1]))
		}
		return e
	}

	function r(e, t) {
		for (var i = 1, n = function (e) {
			var t = encodeURI(e).toString().replace(/\%[0-9a-fA-F]{2}/g, "a");
			return t.length + (t.length != e ? 3 : 0)
		}(e), s = 0, a = $.length; s <= a; s++) {
			var r = 0;
			switch (t) {
				case c.L:
					r = $[s][0];
					break;
				case c.M:
					r = $[s][1];
					break;
				case c.Q:
					r = $[s][2];
					break;
				case c.H:
					r = $[s][3]
			}
			if (n <= r) break;
			i++
		}
		if (i > $.length) throw new Error("Too long data");
		return i
	}
	e.prototype = {
		getLength: function (e) {
			return this.parsedData.length
		},
		write: function (e) {
			for (var t = 0, i = this.parsedData.length; t < i; t++) e.put(this.parsedData[t], 8)
		}
	}, t.prototype = {
		addData: function (t) {
			var i = new e(t);
			this.dataList.push(i), this.dataCache = null
		},
		isDark: function (e, t) {
			if (e < 0 || this.moduleCount <= e || t < 0 || this.moduleCount <= t) throw new Error(e + "," + t);
			return this.modules[e][t]
		},
		getModuleCount: function () {
			return this.moduleCount
		},
		make: function () {
			this.makeImpl(!1, this.getBestMaskPattern())
		},
		makeImpl: function (e, i) {
			this.moduleCount = 4 * this.typeNumber + 17, this.modules = new Array(this.moduleCount);
			for (var n = 0; n < this.moduleCount; n++) {
				this.modules[n] = new Array(this.moduleCount);
				for (var s = 0; s < this.moduleCount; s++) this.modules[n][s] = null
			}
			this.setupPositionProbePattern(0, 0), this.setupPositionProbePattern(this.moduleCount - 7, 0), this.setupPositionProbePattern(0, this.moduleCount - 7), this.setupPositionAdjustPattern(), this.setupTimingPattern(), this.setupTypeInfo(e, i), this.typeNumber >= 7 && this.setupTypeNumber(e), null == this.dataCache && (this.dataCache = t.createData(this.typeNumber, this.errorCorrectLevel, this.dataList)), this.mapData(this.dataCache, i)
		},
		setupPositionProbePattern: function (e, t) {
			for (var i = -1; i <= 7; i++)
				if (!(e + i <= -1 || this.moduleCount <= e + i))
					for (var n = -1; n <= 7; n++) t + n <= -1 || this.moduleCount <= t + n || (this.modules[e + i][t + n] = 0 <= i && i <= 6 && (0 == n || 6 == n) || 0 <= n && n <= 6 && (0 == i || 6 == i) || 2 <= i && i <= 4 && 2 <= n && n <= 4)
		},
		getBestMaskPattern: function () {
			for (var e = 0, t = 0, i = 0; i < 8; i++) {
				this.makeImpl(!0, i);
				var n = g.getLostPoint(this);
				(0 == i || e > n) && (e = n, t = i)
			}
			return t
		},
		createMovieClip: function (e, t, i) {
			var n = e.createEmptyMovieClip(t, i);
			this.make();
			for (var s = 0; s < this.modules.length; s++)
				for (var a = 1 * s, r = 0; r < this.modules[s].length; r++) {
					var o = 1 * r;
					this.modules[s][r] && (n.beginFill(0, 100), n.moveTo(o, a), n.lineTo(o + 1, a), n.lineTo(o + 1, a + 1), n.lineTo(o, a + 1), n.endFill())
				}
			return n
		},
		setupTimingPattern: function () {
			for (var e = 8; e < this.moduleCount - 8; e++) null == this.modules[e][6] && (this.modules[e][6] = e % 2 == 0);
			for (var t = 8; t < this.moduleCount - 8; t++) null == this.modules[6][t] && (this.modules[6][t] = t % 2 == 0)
		},
		setupPositionAdjustPattern: function () {
			for (var e = g.getPatternPosition(this.typeNumber), t = 0; t < e.length; t++)
				for (var i = 0; i < e.length; i++) {
					var n = e[t],
						s = e[i];
					if (null == this.modules[n][s])
						for (var a = -2; a <= 2; a++)
							for (var r = -2; r <= 2; r++) this.modules[n + a][s + r] = -2 == a || 2 == a || -2 == r || 2 == r || 0 == a && 0 == r
				}
		},
		setupTypeNumber: function (e) {
			for (var t = g.getBCHTypeNumber(this.typeNumber), i = 0; i < 18; i++) {
				var n = !e && 1 == (t >> i & 1);
				this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = n
			}
			for (i = 0; i < 18; i++) {
				n = !e && 1 == (t >> i & 1);
				this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = n
			}
		},
		setupTypeInfo: function (e, t) {
			for (var i = this.errorCorrectLevel << 3 | t, n = g.getBCHTypeInfo(i), s = 0; s < 15; s++) {
				var a = !e && 1 == (n >> s & 1);
				s < 6 ? this.modules[s][8] = a : s < 8 ? this.modules[s + 1][8] = a : this.modules[this.moduleCount - 15 + s][8] = a
			}
			for (s = 0; s < 15; s++) {
				a = !e && 1 == (n >> s & 1);
				s < 8 ? this.modules[8][this.moduleCount - s - 1] = a : s < 9 ? this.modules[8][15 - s - 1 + 1] = a : this.modules[8][15 - s - 1] = a
			}
			this.modules[this.moduleCount - 8][8] = !e
		},
		mapData: function (e, t) {
			for (var i = -1, n = this.moduleCount - 1, s = 7, a = 0, r = this.moduleCount - 1; r > 0; r -= 2)
				for (6 == r && r--; ;) {
					for (var o = 0; o < 2; o++)
						if (null == this.modules[n][r - o]) {
							var c = !1;
							a < e.length && (c = 1 == (e[a] >>> s & 1)), g.getMask(t, n, r - o) && (c = !c), this.modules[n][r - o] = c, -1 == --s && (a++, s = 7)
						}
					if ((n += i) < 0 || this.moduleCount <= n) {
						n -= i, i = -i;
						break
					}
				}
		}
	}, t.PAD0 = 236, t.PAD1 = 17, t.createData = function (e, i, a) {
		for (var r = n.getRSBlocks(e, i), o = new s, c = 0; c < a.length; c++) {
			var d = a[c];
			o.put(d.mode, 4), o.put(d.getLength(), g.getLengthInBits(d.mode, e)), d.write(o)
		}
		var _ = 0;
		for (c = 0; c < r.length; c++) _ += r[c].dataCount;
		if (o.getLengthInBits() > 8 * _) throw new Error("code length overflow. (" + o.getLengthInBits() + ">" + 8 * _ + ")");
		for (o.getLengthInBits() + 4 <= 8 * _ && o.put(0, 4); o.getLengthInBits() % 8 != 0;) o.putBit(!1);
		for (; !(o.getLengthInBits() >= 8 * _ || (o.put(t.PAD0, 8), o.getLengthInBits() >= 8 * _));) o.put(t.PAD1, 8);
		return t.createBytes(o, r)
	}, t.createBytes = function (e, t) {
		for (var n = 0, s = 0, a = 0, r = new Array(t.length), o = new Array(t.length), c = 0; c < t.length; c++) {
			var d = t[c].dataCount,
				_ = t[c].totalCount - d;
			s = Math.max(s, d), a = Math.max(a, _), r[c] = new Array(d);
			for (var l = 0; l < r[c].length; l++) r[c][l] = 255 & e.buffer[l + n];
			n += d;
			var u = g.getErrorCorrectPolynomial(_),
				f = new i(r[c], u.getLength() - 1).mod(u);
			o[c] = new Array(u.getLength() - 1);
			for (l = 0; l < o[c].length; l++) {
				var h = l + f.getLength() - o[c].length;
				o[c][l] = h >= 0 ? f.get(h) : 0
			}
		}
		var p = 0;
		for (l = 0; l < t.length; l++) p += t[l].totalCount;
		var m = new Array(p),
			b = 0;
		for (l = 0; l < s; l++)
			for (c = 0; c < t.length; c++) l < r[c].length && (m[b++] = r[c][l]);
		for (l = 0; l < a; l++)
			for (c = 0; c < t.length; c++) l < o[c].length && (m[b++] = o[c][l]);
		return m
	};
	for (var o = {
		MODE_NUMBER: 1,
		MODE_ALPHA_NUM: 2,
		MODE_8BIT_BYTE: 4,
		MODE_KANJI: 8
	}, c = {
		L: 1,
		M: 0,
		Q: 3,
		H: 2
	}, d = 0, _ = 1, l = 2, u = 3, f = 4, h = 5, p = 6, m = 7, g = {
		PATTERN_POSITION_TABLE: [
			[],
			[6, 18],
			[6, 22],
			[6, 26],
			[6, 30],
			[6, 34],
			[6, 22, 38],
			[6, 24, 42],
			[6, 26, 46],
			[6, 28, 50],
			[6, 30, 54],
			[6, 32, 58],
			[6, 34, 62],
			[6, 26, 46, 66],
			[6, 26, 48, 70],
			[6, 26, 50, 74],
			[6, 30, 54, 78],
			[6, 30, 56, 82],
			[6, 30, 58, 86],
			[6, 34, 62, 90],
			[6, 28, 50, 72, 94],
			[6, 26, 50, 74, 98],
			[6, 30, 54, 78, 102],
			[6, 28, 54, 80, 106],
			[6, 32, 58, 84, 110],
			[6, 30, 58, 86, 114],
			[6, 34, 62, 90, 118],
			[6, 26, 50, 74, 98, 122],
			[6, 30, 54, 78, 102, 126],
			[6, 26, 52, 78, 104, 130],
			[6, 30, 56, 82, 108, 134],
			[6, 34, 60, 86, 112, 138],
			[6, 30, 58, 86, 114, 142],
			[6, 34, 62, 90, 118, 146],
			[6, 30, 54, 78, 102, 126, 150],
			[6, 24, 50, 76, 102, 128, 154],
			[6, 28, 54, 80, 106, 132, 158],
			[6, 32, 58, 84, 110, 136, 162],
			[6, 26, 54, 82, 110, 138, 166],
			[6, 30, 58, 86, 114, 142, 170]
		],
		G15: 1335,
		G18: 7973,
		G15_MASK: 21522,
		getBCHTypeInfo: function (e) {
			for (var t = e << 10; g.getBCHDigit(t) - g.getBCHDigit(g.G15) >= 0;) t ^= g.G15 << g.getBCHDigit(t) - g.getBCHDigit(g.G15);
			return (e << 10 | t) ^ g.G15_MASK
		},
		getBCHTypeNumber: function (e) {
			for (var t = e << 12; g.getBCHDigit(t) - g.getBCHDigit(g.G18) >= 0;) t ^= g.G18 << g.getBCHDigit(t) - g.getBCHDigit(g.G18);
			return e << 12 | t
		},
		getBCHDigit: function (e) {
			for (var t = 0; 0 != e;) t++, e >>>= 1;
			return t
		},
		getPatternPosition: function (e) {
			return g.PATTERN_POSITION_TABLE[e - 1]
		},
		getMask: function (e, t, i) {
			switch (e) {
				case d:
					return (t + i) % 2 == 0;
				case _:
					return t % 2 == 0;
				case l:
					return i % 3 == 0;
				case u:
					return (t + i) % 3 == 0;
				case f:
					return (Math.floor(t / 2) + Math.floor(i / 3)) % 2 == 0;
				case h:
					return t * i % 2 + t * i % 3 == 0;
				case p:
					return (t * i % 2 + t * i % 3) % 2 == 0;
				case m:
					return (t * i % 3 + (t + i) % 2) % 2 == 0;
				default:
					throw new Error("bad maskPattern:" + e)
			}
		},
		getErrorCorrectPolynomial: function (e) {
			for (var t = new i([1], 0), n = 0; n < e; n++) t = t.multiply(new i([1, b.gexp(n)], 0));
			return t
		},
		getLengthInBits: function (e, t) {
			if (1 <= t && t < 10) switch (e) {
				case o.MODE_NUMBER:
					return 10;
				case o.MODE_ALPHA_NUM:
					return 9;
				case o.MODE_8BIT_BYTE:
				case o.MODE_KANJI:
					return 8;
				default:
					throw new Error("mode:" + e)
			} else if (t < 27) switch (e) {
				case o.MODE_NUMBER:
					return 12;
				case o.MODE_ALPHA_NUM:
					return 11;
				case o.MODE_8BIT_BYTE:
					return 16;
				case o.MODE_KANJI:
					return 10;
				default:
					throw new Error("mode:" + e)
			} else {
				if (!(t < 41)) throw new Error("type:" + t);
				switch (e) {
					case o.MODE_NUMBER:
						return 14;
					case o.MODE_ALPHA_NUM:
						return 13;
					case o.MODE_8BIT_BYTE:
						return 16;
					case o.MODE_KANJI:
						return 12;
					default:
						throw new Error("mode:" + e)
				}
			}
		},
		getLostPoint: function (e) {
			for (var t = e.getModuleCount(), i = 0, n = 0; n < t; n++)
				for (var s = 0; s < t; s++) {
					for (var a = 0, r = e.isDark(n, s), o = -1; o <= 1; o++)
						if (!(n + o < 0 || t <= n + o))
							for (var c = -1; c <= 1; c++) s + c < 0 || t <= s + c || 0 == o && 0 == c || r == e.isDark(n + o, s + c) && a++;
					a > 5 && (i += 3 + a - 5)
				}
			for (n = 0; n < t - 1; n++)
				for (s = 0; s < t - 1; s++) {
					var d = 0;
					e.isDark(n, s) && d++, e.isDark(n + 1, s) && d++, e.isDark(n, s + 1) && d++, e.isDark(n + 1, s + 1) && d++, 0 != d && 4 != d || (i += 3)
				}
			for (n = 0; n < t; n++)
				for (s = 0; s < t - 6; s++) e.isDark(n, s) && !e.isDark(n, s + 1) && e.isDark(n, s + 2) && e.isDark(n, s + 3) && e.isDark(n, s + 4) && !e.isDark(n, s + 5) && e.isDark(n, s + 6) && (i += 40);
			for (s = 0; s < t; s++)
				for (n = 0; n < t - 6; n++) e.isDark(n, s) && !e.isDark(n + 1, s) && e.isDark(n + 2, s) && e.isDark(n + 3, s) && e.isDark(n + 4, s) && !e.isDark(n + 5, s) && e.isDark(n + 6, s) && (i += 40);
			var _ = 0;
			for (s = 0; s < t; s++)
				for (n = 0; n < t; n++) e.isDark(n, s) && _++;
			return i += 10 * (Math.abs(100 * _ / t / t - 50) / 5)
		}
	}, b = {
		glog: function (e) {
			if (e < 1) throw new Error("glog(" + e + ")");
			return b.LOG_TABLE[e]
		},
		gexp: function (e) {
			for (; e < 0;) e += 255;
			for (; e >= 256;) e -= 255;
			return b.EXP_TABLE[e]
		},
		EXP_TABLE: new Array(256),
		LOG_TABLE: new Array(256)
	}, v = 0; v < 8; v++) b.EXP_TABLE[v] = 1 << v;
	for (v = 8; v < 256; v++) b.EXP_TABLE[v] = b.EXP_TABLE[v - 4] ^ b.EXP_TABLE[v - 5] ^ b.EXP_TABLE[v - 6] ^ b.EXP_TABLE[v - 8];
	for (v = 0; v < 255; v++) b.LOG_TABLE[b.EXP_TABLE[v]] = v;
	i.prototype = {
		get: function (e) {
			return this.num[e]
		},
		getLength: function () {
			return this.num.length
		},
		multiply: function (e) {
			for (var t = new Array(this.getLength() + e.getLength() - 1), n = 0; n < this.getLength(); n++)
				for (var s = 0; s < e.getLength(); s++) t[n + s] ^= b.gexp(b.glog(this.get(n)) + b.glog(e.get(s)));
			return new i(t, 0)
		},
		mod: function (e) {
			if (this.getLength() - e.getLength() < 0) return this;
			for (var t = b.glog(this.get(0)) - b.glog(e.get(0)), n = new Array(this.getLength()), s = 0; s < this.getLength(); s++) n[s] = this.get(s);
			for (s = 0; s < e.getLength(); s++) n[s] ^= b.gexp(b.glog(e.get(s)) + t);
			return new i(n, 0).mod(e)
		}
	}, n.RS_BLOCK_TABLE = [
		[1, 26, 19],
		[1, 26, 16],
		[1, 26, 13],
		[1, 26, 9],
		[1, 44, 34],
		[1, 44, 28],
		[1, 44, 22],
		[1, 44, 16],
		[1, 70, 55],
		[1, 70, 44],
		[2, 35, 17],
		[2, 35, 13],
		[1, 100, 80],
		[2, 50, 32],
		[2, 50, 24],
		[4, 25, 9],
		[1, 134, 108],
		[2, 67, 43],
		[2, 33, 15, 2, 34, 16],
		[2, 33, 11, 2, 34, 12],
		[2, 86, 68],
		[4, 43, 27],
		[4, 43, 19],
		[4, 43, 15],
		[2, 98, 78],
		[4, 49, 31],
		[2, 32, 14, 4, 33, 15],
		[4, 39, 13, 1, 40, 14],
		[2, 121, 97],
		[2, 60, 38, 2, 61, 39],
		[4, 40, 18, 2, 41, 19],
		[4, 40, 14, 2, 41, 15],
		[2, 146, 116],
		[3, 58, 36, 2, 59, 37],
		[4, 36, 16, 4, 37, 17],
		[4, 36, 12, 4, 37, 13],
		[2, 86, 68, 2, 87, 69],
		[4, 69, 43, 1, 70, 44],
		[6, 43, 19, 2, 44, 20],
		[6, 43, 15, 2, 44, 16],
		[4, 101, 81],
		[1, 80, 50, 4, 81, 51],
		[4, 50, 22, 4, 51, 23],
		[3, 36, 12, 8, 37, 13],
		[2, 116, 92, 2, 117, 93],
		[6, 58, 36, 2, 59, 37],
		[4, 46, 20, 6, 47, 21],
		[7, 42, 14, 4, 43, 15],
		[4, 133, 107],
		[8, 59, 37, 1, 60, 38],
		[8, 44, 20, 4, 45, 21],
		[12, 33, 11, 4, 34, 12],
		[3, 145, 115, 1, 146, 116],
		[4, 64, 40, 5, 65, 41],
		[11, 36, 16, 5, 37, 17],
		[11, 36, 12, 5, 37, 13],
		[5, 109, 87, 1, 110, 88],
		[5, 65, 41, 5, 66, 42],
		[5, 54, 24, 7, 55, 25],
		[11, 36, 12, 7, 37, 13],
		[5, 122, 98, 1, 123, 99],
		[7, 73, 45, 3, 74, 46],
		[15, 43, 19, 2, 44, 20],
		[3, 45, 15, 13, 46, 16],
		[1, 135, 107, 5, 136, 108],
		[10, 74, 46, 1, 75, 47],
		[1, 50, 22, 15, 51, 23],
		[2, 42, 14, 17, 43, 15],
		[5, 150, 120, 1, 151, 121],
		[9, 69, 43, 4, 70, 44],
		[17, 50, 22, 1, 51, 23],
		[2, 42, 14, 19, 43, 15],
		[3, 141, 113, 4, 142, 114],
		[3, 70, 44, 11, 71, 45],
		[17, 47, 21, 4, 48, 22],
		[9, 39, 13, 16, 40, 14],
		[3, 135, 107, 5, 136, 108],
		[3, 67, 41, 13, 68, 42],
		[15, 54, 24, 5, 55, 25],
		[15, 43, 15, 10, 44, 16],
		[4, 144, 116, 4, 145, 117],
		[17, 68, 42],
		[17, 50, 22, 6, 51, 23],
		[19, 46, 16, 6, 47, 17],
		[2, 139, 111, 7, 140, 112],
		[17, 74, 46],
		[7, 54, 24, 16, 55, 25],
		[34, 37, 13],
		[4, 151, 121, 5, 152, 122],
		[4, 75, 47, 14, 76, 48],
		[11, 54, 24, 14, 55, 25],
		[16, 45, 15, 14, 46, 16],
		[6, 147, 117, 4, 148, 118],
		[6, 73, 45, 14, 74, 46],
		[11, 54, 24, 16, 55, 25],
		[30, 46, 16, 2, 47, 17],
		[8, 132, 106, 4, 133, 107],
		[8, 75, 47, 13, 76, 48],
		[7, 54, 24, 22, 55, 25],
		[22, 45, 15, 13, 46, 16],
		[10, 142, 114, 2, 143, 115],
		[19, 74, 46, 4, 75, 47],
		[28, 50, 22, 6, 51, 23],
		[33, 46, 16, 4, 47, 17],
		[8, 152, 122, 4, 153, 123],
		[22, 73, 45, 3, 74, 46],
		[8, 53, 23, 26, 54, 24],
		[12, 45, 15, 28, 46, 16],
		[3, 147, 117, 10, 148, 118],
		[3, 73, 45, 23, 74, 46],
		[4, 54, 24, 31, 55, 25],
		[11, 45, 15, 31, 46, 16],
		[7, 146, 116, 7, 147, 117],
		[21, 73, 45, 7, 74, 46],
		[1, 53, 23, 37, 54, 24],
		[19, 45, 15, 26, 46, 16],
		[5, 145, 115, 10, 146, 116],
		[19, 75, 47, 10, 76, 48],
		[15, 54, 24, 25, 55, 25],
		[23, 45, 15, 25, 46, 16],
		[13, 145, 115, 3, 146, 116],
		[2, 74, 46, 29, 75, 47],
		[42, 54, 24, 1, 55, 25],
		[23, 45, 15, 28, 46, 16],
		[17, 145, 115],
		[10, 74, 46, 23, 75, 47],
		[10, 54, 24, 35, 55, 25],
		[19, 45, 15, 35, 46, 16],
		[17, 145, 115, 1, 146, 116],
		[14, 74, 46, 21, 75, 47],
		[29, 54, 24, 19, 55, 25],
		[11, 45, 15, 46, 46, 16],
		[13, 145, 115, 6, 146, 116],
		[14, 74, 46, 23, 75, 47],
		[44, 54, 24, 7, 55, 25],
		[59, 46, 16, 1, 47, 17],
		[12, 151, 121, 7, 152, 122],
		[12, 75, 47, 26, 76, 48],
		[39, 54, 24, 14, 55, 25],
		[22, 45, 15, 41, 46, 16],
		[6, 151, 121, 14, 152, 122],
		[6, 75, 47, 34, 76, 48],
		[46, 54, 24, 10, 55, 25],
		[2, 45, 15, 64, 46, 16],
		[17, 152, 122, 4, 153, 123],
		[29, 74, 46, 14, 75, 47],
		[49, 54, 24, 10, 55, 25],
		[24, 45, 15, 46, 46, 16],
		[4, 152, 122, 18, 153, 123],
		[13, 74, 46, 32, 75, 47],
		[48, 54, 24, 14, 55, 25],
		[42, 45, 15, 32, 46, 16],
		[20, 147, 117, 4, 148, 118],
		[40, 75, 47, 7, 76, 48],
		[43, 54, 24, 22, 55, 25],
		[10, 45, 15, 67, 46, 16],
		[19, 148, 118, 6, 149, 119],
		[18, 75, 47, 31, 76, 48],
		[34, 54, 24, 34, 55, 25],
		[20, 45, 15, 61, 46, 16]
	], n.getRSBlocks = function (e, t) {
		var i = n.getRsBlockTable(e, t);
		if (void 0 == i) throw new Error("bad rs block @ typeNumber:" + e + "/errorCorrectLevel:" + t);
		for (var s = i.length / 3, a = [], r = 0; r < s; r++)
			for (var o = i[3 * r + 0], c = i[3 * r + 1], d = i[3 * r + 2], _ = 0; _ < o; _++) a.push(new n(c, d));
		return a
	}, n.getRsBlockTable = function (e, t) {
		switch (t) {
			case c.L:
				return n.RS_BLOCK_TABLE[4 * (e - 1) + 0];
			case c.M:
				return n.RS_BLOCK_TABLE[4 * (e - 1) + 1];
			case c.Q:
				return n.RS_BLOCK_TABLE[4 * (e - 1) + 2];
			case c.H:
				return n.RS_BLOCK_TABLE[4 * (e - 1) + 3];
			default:
				return
		}
	}, s.prototype = {
		get: function (e) {
			var t = Math.floor(e / 8);
			return 1 == (this.buffer[t] >>> 7 - e % 8 & 1)
		},
		put: function (e, t) {
			for (var i = 0; i < t; i++) this.putBit(1 == (e >>> t - i - 1 & 1))
		},
		getLengthInBits: function () {
			return this.length
		},
		putBit: function (e) {
			var t = Math.floor(this.length / 8);
			this.buffer.length <= t && this.buffer.push(0), e && (this.buffer[t] |= 128 >>> this.length % 8), this.length++
		}
	};
	var $ = [
		[17, 14, 11, 7],
		[32, 26, 20, 14],
		[53, 42, 32, 24],
		[78, 62, 46, 34],
		[106, 84, 60, 44],
		[134, 106, 74, 58],
		[154, 122, 86, 64],
		[192, 152, 108, 84],
		[230, 180, 130, 98],
		[271, 213, 151, 119],
		[321, 251, 177, 137],
		[367, 287, 203, 155],
		[425, 331, 241, 177],
		[458, 362, 258, 194],
		[520, 412, 292, 220],
		[586, 450, 322, 250],
		[644, 504, 364, 280],
		[718, 560, 394, 310],
		[792, 624, 442, 338],
		[858, 666, 482, 382],
		[929, 711, 509, 403],
		[1003, 779, 565, 439],
		[1091, 857, 611, 461],
		[1171, 911, 661, 511],
		[1273, 997, 715, 535],
		[1367, 1059, 751, 593],
		[1465, 1125, 805, 625],
		[1528, 1190, 868, 658],
		[1628, 1264, 908, 698],
		[1732, 1370, 982, 742],
		[1840, 1452, 1030, 790],
		[1952, 1538, 1112, 842],
		[2068, 1628, 1168, 898],
		[2188, 1722, 1228, 958],
		[2303, 1809, 1283, 983],
		[2431, 1911, 1351, 1051],
		[2563, 1989, 1423, 1093],
		[2699, 2099, 1499, 1139],
		[2809, 2213, 1579, 1219],
		[2953, 2331, 1663, 1273]
	];
	var y = function () {
		var e = function (e, t) {
			this._el = e, this._htOption = t
		};
		return e.prototype.draw = function (e) {
			function t(e, t) {
				var i = document.createElementNS("http://www.w3.org/2000/svg", e);
				for (var n in t) t.hasOwnProperty(n) && i.setAttribute(n, t[n]);
				return i
			}
			var i = this._htOption,
				n = this._el,
				s = e.getModuleCount();
			Math.floor(i.width / s), Math.floor(i.height / s);
			this.clear();
			var a = t("svg", {
				viewBox: "0 0 " + String(s) + " " + String(s),
				width: "100%",
				height: "100%",
				fill: i.colorLight
			});
			a.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink"), n.appendChild(a), a.appendChild(t("rect", {
				fill: i.colorLight,
				width: "100%",
				height: "100%"
			})), a.appendChild(t("rect", {
				fill: i.colorDark,
				width: "1",
				height: "1",
				id: "template"
			}));
			for (var r = 0; r < s; r++)
				for (var o = 0; o < s; o++)
					if (e.isDark(r, o)) {
						var c = t("use", {
							x: String(o),
							y: String(r)
						});
						c.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#template"), a.appendChild(c)
					}
		}, e.prototype.clear = function () {
			for (; this._el.hasChildNodes();) this._el.removeChild(this._el.lastChild)
		}, e
	}();
	(QRCode = function (e, t) {
		if (this._htOption = {
			width: 256,
			height: 256,
			typeNumber: 4,
			colorDark: "#000000",
			colorLight: "#ffffff",
			correctLevel: c.H
		}, "string" == typeof t && (t = {
			text: t
		}), t)
			for (var i in t) this._htOption[i] = t[i];
		"string" == typeof e && (e = document.getElementById(e)), this._htOption.useSVG && (C = y), this._android = a(), this._el = e, this._oQRCode = null, this._oDrawing = new C(this._el, this._htOption), this._htOption.text && this.makeCode(this._htOption.text)
	}).prototype.makeCode = function (e) {
		this._oQRCode = new t(r(e, this._htOption.correctLevel), this._htOption.correctLevel), this._oQRCode.addData(e), this._oQRCode.make(), this._el.title = e, this._oDrawing.draw(this._oQRCode), this.makeImage()
	}, QRCode.prototype.makeImage = function () {
		"function" == typeof this._oDrawing.makeImage && (!this._android || this._android >= 3) && this._oDrawing.makeImage()
	}, QRCode.prototype.clear = function () {
		this._oDrawing.clear()
	}, QRCode.CorrectLevel = c
}(), "undefined" != typeof module && (module.exports = QRCode);
var dbits;
var canary = 0xdeadbeefcafe;
var j_lm = 15715070 == (16777215 & canary);

function BigInteger(e, t, i) {
	if (null != e)
		if ("number" == typeof e) this.fromNumber(e, t, i);
		else if (null == t && "string" != typeof e) this.fromString(e, 256);
		else this.fromString(e, t);
}

function nbi() {
	return new BigInteger(null)
}

function am1(e, t, i, n, s, a) {
	for (; --a >= 0;) {
		var r = t * this[e++] + i[n] + s;
		s = Math.floor(r / 67108864);
		i[n++] = 67108863 & r
	}
	return s
}

function am2(e, t, i, n, s, a) {
	var r = 32767 & t,
		o = t >> 15;
	for (; --a >= 0;) {
		var c = 32767 & this[e];
		var d = this[e++] >> 15;
		var _ = o * c + d * r;
		c = r * c + ((32767 & _) << 15) + i[n] + (1073741823 & s);
		s = (c >>> 30) + (_ >>> 15) + o * d + (s >>> 30);
		i[n++] = 1073741823 & c
	}
	return s
}

function am3(e, t, i, n, s, a) {
	var r = 16383 & t,
		o = t >> 14;
	for (; --a >= 0;) {
		var c = 16383 & this[e];
		var d = this[e++] >> 14;
		var _ = o * c + d * r;
		c = r * c + ((16383 & _) << 14) + i[n] + s;
		s = (c >> 28) + (_ >> 14) + o * d;
		i[n++] = 268435455 & c
	}
	return s
}
BigInteger.prototype.am = am3;
dbits = 28;
BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = (1 << dbits) - 1;
BigInteger.prototype.DV = 1 << dbits;
var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2, BI_FP);
BigInteger.prototype.F1 = BI_FP - dbits;
BigInteger.prototype.F2 = 2 * dbits - BI_FP;
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
var BI_RC = new Array;
var rr, vv;
rr = "0".charCodeAt(0);
for (vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
rr = "a".charCodeAt(0);
for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
rr = "A".charCodeAt(0);
for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

function int2char(e) {
	return BI_RM.charAt(e)
}

function intAt(e, t) {
	var i = BI_RC[e.charCodeAt(t)];
	return null == i ? -1 : i
}

function bnpCopyTo(e) {
	for (var t = this.t - 1; t >= 0; --t) e[t] = this[t];
	e.t = this.t;
	e.s = this.s
}

function bnpFromInt(e) {
	this.t = 1;
	this.s = e < 0 ? -1 : 0;
	if (e > 0) this[0] = e;
	else if (e < -1) this[0] = e + DV;
	else this.t = 0
}

function nbv(e) {
	var t = nbi();
	t.fromInt(e);
	return t
}

function bnpFromString(e, t) {
	var i;
	if (16 == t) i = 4;
	else if (8 == t) i = 3;
	else if (256 == t) i = 8;
	else if (2 == t) i = 1;
	else if (32 == t) i = 5;
	else if (4 == t) i = 2;
	else {
		this.fromRadix(e, t);
		return
	}
	this.t = 0;
	this.s = 0;
	var n = e.length,
		s = !1,
		a = 0;
	for (; --n >= 0;) {
		var r = 8 == i ? 255 & e[n] : intAt(e, n);
		if (!(r < 0)) {
			s = !1;
			if (0 == a) this[this.t++] = r;
			else if (a + i > this.DB) {
				this[this.t - 1] |= (r & (1 << this.DB - a) - 1) << a;
				this[this.t++] = r >> this.DB - a
			} else this[this.t - 1] |= r << a;
			a += i;
			if (a >= this.DB) a -= this.DB
		} else if ("-" == e.charAt(n)) s = !0
	}
	if (8 == i && 0 != (128 & e[0])) {
		this.s = -1;
		if (a > 0) this[this.t - 1] |= (1 << this.DB - a) - 1 << a
	}
	this.clamp();
	if (s) BigInteger.ZERO.subTo(this, this)
}

function bnpClamp() {
	var e = this.s & this.DM;
	for (; this.t > 0 && this[this.t - 1] == e;)--this.t
}

function bnToString(e) {
	if (this.s < 0) return "-" + this.negate().toString(e);
	var t;
	if (16 == e) t = 4;
	else if (8 == e) t = 3;
	else if (2 == e) t = 1;
	else if (32 == e) t = 5;
	else if (4 == e) t = 2;
	else return this.toRadix(e);
	var i = (1 << t) - 1,
		n, s = !1,
		a = "",
		r = this.t;
	var o = this.DB - r * this.DB % t;
	if (r-- > 0) {
		if (o < this.DB && (n = this[r] >> o) > 0) {
			s = !0;
			a = int2char(n)
		}
		for (; r >= 0;) {
			if (o < t) {
				n = (this[r] & (1 << o) - 1) << t - o;
				n |= this[--r] >> (o += this.DB - t)
			} else {
				n = this[r] >> (o -= t) & i;
				if (o <= 0) {
					o += this.DB;
					--r
				}
			} if (n > 0) s = !0;
			if (s) a += int2char(n)
		}
	}
	return s ? a : "0"
}

function bnNegate() {
	var e = nbi();
	BigInteger.ZERO.subTo(this, e);
	return e
}

function bnAbs() {
	return this.s < 0 ? this.negate() : this
}

function bnCompareTo(e) {
	var t = this.s - e.s;
	if (0 != t) return t;
	var i = this.t;
	t = i - e.t;
	if (0 != t) return this.s < 0 ? -t : t;
	for (; --i >= 0;)
		if (0 != (t = this[i] - e[i])) return t;
	return 0
}

function nbits(e) {
	var t = 1,
		i;
	if (0 != (i = e >>> 16)) {
		e = i;
		t += 16
	}
	if (0 != (i = e >> 8)) {
		e = i;
		t += 8
	}
	if (0 != (i = e >> 4)) {
		e = i;
		t += 4
	}
	if (0 != (i = e >> 2)) {
		e = i;
		t += 2
	}
	if (0 != (i = e >> 1)) {
		e = i;
		t += 1
	}
	return t
}

function bnBitLength() {
	if (this.t <= 0) return 0;
	else return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ this.s & this.DM)
}

function bnpDLShiftTo(e, t) {
	var i;
	for (i = this.t - 1; i >= 0; --i) t[i + e] = this[i];
	for (i = e - 1; i >= 0; --i) t[i] = 0;
	t.t = this.t + e;
	t.s = this.s
}

function bnpDRShiftTo(e, t) {
	for (var i = e; i < this.t; ++i) t[i - e] = this[i];
	t.t = Math.max(this.t - e, 0);
	t.s = this.s
}

function bnpLShiftTo(e, t) {
	var i = e % this.DB;
	var n = this.DB - i;
	var s = (1 << n) - 1;
	var a = Math.floor(e / this.DB),
		r = this.s << i & this.DM,
		o;
	for (o = this.t - 1; o >= 0; --o) {
		t[o + a + 1] = this[o] >> n | r;
		r = (this[o] & s) << i
	}
	for (o = a - 1; o >= 0; --o) t[o] = 0;
	t[a] = r;
	t.t = this.t + a + 1;
	t.s = this.s;
	t.clamp()
}

function bnpRShiftTo(e, t) {
	t.s = this.s;
	var i = Math.floor(e / this.DB);
	if (!(i >= this.t)) {
		var n = e % this.DB;
		var s = this.DB - n;
		var a = (1 << n) - 1;
		t[0] = this[i] >> n;
		for (var r = i + 1; r < this.t; ++r) {
			t[r - i - 1] |= (this[r] & a) << s;
			t[r - i] = this[r] >> n
		}
		if (n > 0) t[this.t - i - 1] |= (this.s & a) << s;
		t.t = this.t - i;
		t.clamp()
	} else t.t = 0
}

function bnpSubTo(e, t) {
	var i = 0,
		n = 0,
		s = Math.min(e.t, this.t);
	for (; i < s;) {
		n += this[i] - e[i];
		t[i++] = n & this.DM;
		n >>= this.DB
	}
	if (e.t < this.t) {
		n -= e.s;
		for (; i < this.t;) {
			n += this[i];
			t[i++] = n & this.DM;
			n >>= this.DB
		}
		n += this.s
	} else {
		n += this.s;
		for (; i < e.t;) {
			n -= e[i];
			t[i++] = n & this.DM;
			n >>= this.DB
		}
		n -= e.s
	}
	t.s = n < 0 ? -1 : 0;
	if (n < -1) t[i++] = this.DV + n;
	else if (n > 0) t[i++] = n;
	t.t = i;
	t.clamp()
}

function bnpMultiplyTo(e, t) {
	var i = this.abs(),
		n = e.abs();
	var s = i.t;
	t.t = s + n.t;
	for (; --s >= 0;) t[s] = 0;
	for (s = 0; s < n.t; ++s) t[s + i.t] = i.am(0, n[s], t, s, 0, i.t);
	t.s = 0;
	t.clamp();
	if (this.s != e.s) BigInteger.ZERO.subTo(t, t)
}

function bnpSquareTo(e) {
	var t = this.abs();
	var i = e.t = 2 * t.t;
	for (; --i >= 0;) e[i] = 0;
	for (i = 0; i < t.t - 1; ++i) {
		var n = t.am(i, t[i], e, 2 * i, 0, 1);
		if ((e[i + t.t] += t.am(i + 1, 2 * t[i], e, 2 * i + 1, n, t.t - i - 1)) >= t.DV) {
			e[i + t.t] -= t.DV;
			e[i + t.t + 1] = 1
		}
	}
	if (e.t > 0) e[e.t - 1] += t.am(i, t[i], e, 2 * i, 0, 1);
	e.s = 0;
	e.clamp()
}

function bnpDivRemTo(e, t, i) {
	var n = e.abs();
	if (!(n.t <= 0)) {
		var s = this.abs();
		if (!(s.t < n.t)) {
			if (null == i) i = nbi();
			var a = nbi(),
				r = this.s,
				o = e.s;
			var c = this.DB - nbits(n[n.t - 1]);
			if (c > 0) {
				n.lShiftTo(c, a);
				s.lShiftTo(c, i)
			} else {
				n.copyTo(a);
				s.copyTo(i)
			}
			var d = a.t;
			var _ = a[d - 1];
			if (0 != _) {
				var l = _ * (1 << this.F1) + (d > 1 ? a[d - 2] >> this.F2 : 0);
				var u = this.FV / l,
					f = (1 << this.F1) / l,
					h = 1 << this.F2;
				var p = i.t,
					m = p - d,
					g = null == t ? nbi() : t;
				a.dlShiftTo(m, g);
				if (i.compareTo(g) >= 0) {
					i[i.t++] = 1;
					i.subTo(g, i)
				}
				BigInteger.ONE.dlShiftTo(d, g);
				g.subTo(a, a);
				for (; a.t < d;) a[a.t++] = 0;
				for (; --m >= 0;) {
					var b = i[--p] == _ ? this.DM : Math.floor(i[p] * u + (i[p - 1] + h) * f);
					if ((i[p] += a.am(0, b, i, m, 0, d)) < b) {
						a.dlShiftTo(m, g);
						i.subTo(g, i);
						for (; i[p] < --b;) i.subTo(g, i)
					}
				}
				if (null != t) {
					i.drShiftTo(d, t);
					if (r != o) BigInteger.ZERO.subTo(t, t)
				}
				i.t = d;
				i.clamp();
				if (c > 0) i.rShiftTo(c, i);
				if (r < 0) BigInteger.ZERO.subTo(i, i)
			}
		} else {
			if (null != t) t.fromInt(0);
			if (null != i) this.copyTo(i)
		}
	}
}

function bnMod(e) {
	var t = nbi();
	this.abs().divRemTo(e, null, t);
	if (this.s < 0 && t.compareTo(BigInteger.ZERO) > 0) e.subTo(t, t);
	return t
}

function Classic(e) {
	this.m = e
}

function cConvert(e) {
	if (e.s < 0 || e.compareTo(this.m) >= 0) return e.mod(this.m);
	else return e
}

function cRevert(e) {
	return e
}

function cReduce(e) {
	e.divRemTo(this.m, null, e)
}

function cMulTo(e, t, i) {
	e.multiplyTo(t, i);
	this.reduce(i)
}

function cSqrTo(e, t) {
	e.squareTo(t);
	this.reduce(t)
}
Classic.prototype.convert = cConvert;
Classic.prototype.revert = cRevert;
Classic.prototype.reduce = cReduce;
Classic.prototype.mulTo = cMulTo;
Classic.prototype.sqrTo = cSqrTo;

function bnpInvDigit() {
	if (this.t < 1) return 0;
	var e = this[0];
	if (0 == (1 & e)) return 0;
	var t = 3 & e;
	t = t * (2 - (15 & e) * t) & 15;
	t = t * (2 - (255 & e) * t) & 255;
	t = t * (2 - ((65535 & e) * t & 65535)) & 65535;
	t = t * (2 - e * t % this.DV) % this.DV;
	return t > 0 ? this.DV - t : -t
}

function Montgomery(e) {
	this.m = e;
	this.mp = e.invDigit();
	this.mpl = 32767 & this.mp;
	this.mph = this.mp >> 15;
	this.um = (1 << e.DB - 15) - 1;
	this.mt2 = 2 * e.t
}

function montConvert(e) {
	var t = nbi();
	e.abs().dlShiftTo(this.m.t, t);
	t.divRemTo(this.m, null, t);
	if (e.s < 0 && t.compareTo(BigInteger.ZERO) > 0) this.m.subTo(t, t);
	return t
}

function montRevert(e) {
	var t = nbi();
	e.copyTo(t);
	this.reduce(t);
	return t
}

function montReduce(e) {
	for (; e.t <= this.mt2;) e[e.t++] = 0;
	for (var t = 0; t < this.m.t; ++t) {
		var i = 32767 & e[t];
		var n = i * this.mpl + ((i * this.mph + (e[t] >> 15) * this.mpl & this.um) << 15) & e.DM;
		i = t + this.m.t;
		e[i] += this.m.am(0, n, e, t, 0, this.m.t);
		for (; e[i] >= e.DV;) {
			e[i] -= e.DV;
			e[++i]++
		}
	}
	e.clamp();
	e.drShiftTo(this.m.t, e);
	if (e.compareTo(this.m) >= 0) e.subTo(this.m, e)
}

function montSqrTo(e, t) {
	e.squareTo(t);
	this.reduce(t)
}

function montMulTo(e, t, i) {
	e.multiplyTo(t, i);
	this.reduce(i)
}
Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;

function bnpIsEven() {
	return 0 == (this.t > 0 ? 1 & this[0] : this.s)
}

function bnpExp(e, t) {
	if (e > 4294967295 || e < 1) return BigInteger.ONE;
	var i = nbi(),
		n = nbi(),
		s = t.convert(this),
		a = nbits(e) - 1;
	s.copyTo(i);
	for (; --a >= 0;) {
		t.sqrTo(i, n);
		if ((e & 1 << a) > 0) t.mulTo(n, s, i);
		else {
			var r = i;
			i = n;
			n = r
		}
	}
	return t.revert(i)
}

function bnModPowInt(e, t) {
	var i;
	if (e < 256 || t.isEven()) i = new Classic(t);
	else i = new Montgomery(t);
	return this.exp(e, i)
}
BigInteger.prototype.copyTo = bnpCopyTo;
BigInteger.prototype.fromInt = bnpFromInt;
BigInteger.prototype.fromString = bnpFromString;
BigInteger.prototype.clamp = bnpClamp;
BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
BigInteger.prototype.drShiftTo = bnpDRShiftTo;
BigInteger.prototype.lShiftTo = bnpLShiftTo;
BigInteger.prototype.rShiftTo = bnpRShiftTo;
BigInteger.prototype.subTo = bnpSubTo;
BigInteger.prototype.multiplyTo = bnpMultiplyTo;
BigInteger.prototype.squareTo = bnpSquareTo;
BigInteger.prototype.divRemTo = bnpDivRemTo;
BigInteger.prototype.invDigit = bnpInvDigit;
BigInteger.prototype.isEven = bnpIsEven;
BigInteger.prototype.exp = bnpExp;
BigInteger.prototype.toString = bnToString;
BigInteger.prototype.negate = bnNegate;
BigInteger.prototype.abs = bnAbs;
BigInteger.prototype.compareTo = bnCompareTo;
BigInteger.prototype.bitLength = bnBitLength;
BigInteger.prototype.mod = bnMod;
BigInteger.prototype.modPowInt = bnModPowInt;
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);

function bnClone() {
	var e = nbi();
	this.copyTo(e);
	return e
}

function bnIntValue() {
	if (this.s < 0) {
		if (1 == this.t) return this[0] - this.DV;
		else if (0 == this.t) return -1
	} else if (1 == this.t) return this[0];
	else if (0 == this.t) return 0;
	return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0]
}

function bnByteValue() {
	return 0 == this.t ? this.s : this[0] << 24 >> 24
}

function bnShortValue() {
	return 0 == this.t ? this.s : this[0] << 16 >> 16
}

function bnpChunkSize(e) {
	return Math.floor(Math.LN2 * this.DB / Math.log(e))
}

function bnSigNum() {
	if (this.s < 0) return -1;
	else if (this.t <= 0 || 1 == this.t && this[0] <= 0) return 0;
	else return 1
}

function bnpToRadix(e) {
	if (null == e) e = 10;
	if (0 == this.signum() || e < 2 || e > 36) return "0";
	var t = this.chunkSize(e);
	var i = Math.pow(e, t);
	var n = nbv(i),
		s = nbi(),
		a = nbi(),
		r = "";
	this.divRemTo(n, s, a);
	for (; s.signum() > 0;) {
		r = (i + a.intValue()).toString(e).substr(1) + r;
		s.divRemTo(n, s, a)
	}
	return a.intValue().toString(e) + r
}

function bnpFromRadix(e, t) {
	this.fromInt(0);
	if (null == t) t = 10;
	var i = this.chunkSize(t);
	var n = Math.pow(t, i),
		s = !1,
		a = 0,
		r = 0;
	for (var o = 0; o < e.length; ++o) {
		var c = intAt(e, o);
		if (!(c < 0)) {
			r = t * r + c;
			if (++a >= i) {
				this.dMultiply(n);
				this.dAddOffset(r, 0);
				a = 0;
				r = 0
			}
		} else if ("-" == e.charAt(o) && 0 == this.signum()) s = !0
	}
	if (a > 0) {
		this.dMultiply(Math.pow(t, a));
		this.dAddOffset(r, 0)
	}
	if (s) BigInteger.ZERO.subTo(this, this)
}

function bnpFromNumber(e, t, i) {
	if ("number" == typeof t)
		if (e < 2) this.fromInt(1);
		else {
			this.fromNumber(e, i);
			if (!this.testBit(e - 1)) this.bitwiseTo(BigInteger.ONE.shiftLeft(e - 1), op_or, this);
			if (this.isEven()) this.dAddOffset(1, 0);
			for (; !this.isProbablePrime(t);) {
				this.dAddOffset(2, 0);
				if (this.bitLength() > e) this.subTo(BigInteger.ONE.shiftLeft(e - 1), this)
			}
		} else {
		var n = new Array,
			s = 7 & e;
		n.length = (e >> 3) + 1;
		t.nextBytes(n);
		if (s > 0) n[0] &= (1 << s) - 1;
		else n[0] = 0;
		this.fromString(n, 256)
	}
}

function bnToByteArray() {
	var e = this.t,
		t = new Array;
	t[0] = this.s;
	var i = this.DB - e * this.DB % 8,
		n, s = 0;
	if (e-- > 0) {
		if (i < this.DB && (n = this[e] >> i) != (this.s & this.DM) >> i) t[s++] = n | this.s << this.DB - i;
		for (; e >= 0;) {
			if (i < 8) {
				n = (this[e] & (1 << i) - 1) << 8 - i;
				n |= this[--e] >> (i += this.DB - 8)
			} else {
				n = this[e] >> (i -= 8) & 255;
				if (i <= 0) {
					i += this.DB;
					--e
				}
			} if (0 != (128 & n)) n |= -256;
			if (0 == s && (128 & this.s) != (128 & n)) ++s;
			if (s > 0 || n != this.s) t[s++] = n
		}
	}
	return t
}

function bnEquals(e) {
	return 0 == this.compareTo(e)
}

function bnMin(e) {
	return this.compareTo(e) < 0 ? this : e
}

function bnMax(e) {
	return this.compareTo(e) > 0 ? this : e
}

function bnpBitwiseTo(e, t, i) {
	var n, s, a = Math.min(e.t, this.t);
	for (n = 0; n < a; ++n) i[n] = t(this[n], e[n]);
	if (e.t < this.t) {
		s = e.s & this.DM;
		for (n = a; n < this.t; ++n) i[n] = t(this[n], s);
		i.t = this.t
	} else {
		s = this.s & this.DM;
		for (n = a; n < e.t; ++n) i[n] = t(s, e[n]);
		i.t = e.t
	}
	i.s = t(this.s, e.s);
	i.clamp()
}

function op_and(e, t) {
	return e & t
}

function bnAnd(e) {
	var t = nbi();
	this.bitwiseTo(e, op_and, t);
	return t
}

function op_or(e, t) {
	return e | t
}

function bnOr(e) {
	var t = nbi();
	this.bitwiseTo(e, op_or, t);
	return t
}

function op_xor(e, t) {
	return e ^ t
}

function bnXor(e) {
	var t = nbi();
	this.bitwiseTo(e, op_xor, t);
	return t
}

function op_andnot(e, t) {
	return e & ~t
}

function bnAndNot(e) {
	var t = nbi();
	this.bitwiseTo(e, op_andnot, t);
	return t
}

function bnNot() {
	var e = nbi();
	for (var t = 0; t < this.t; ++t) e[t] = this.DM & ~this[t];
	e.t = this.t;
	e.s = ~this.s;
	return e
}

function bnShiftLeft(e) {
	var t = nbi();
	if (e < 0) this.rShiftTo(-e, t);
	else this.lShiftTo(e, t);
	return t
}

function bnShiftRight(e) {
	var t = nbi();
	if (e < 0) this.lShiftTo(-e, t);
	else this.rShiftTo(e, t);
	return t
}

function lbit(e) {
	if (0 == e) return -1;
	var t = 0;
	if (0 == (65535 & e)) {
		e >>= 16;
		t += 16
	}
	if (0 == (255 & e)) {
		e >>= 8;
		t += 8
	}
	if (0 == (15 & e)) {
		e >>= 4;
		t += 4
	}
	if (0 == (3 & e)) {
		e >>= 2;
		t += 2
	}
	if (0 == (1 & e)) ++t;
	return t
}

function bnGetLowestSetBit() {
	for (var e = 0; e < this.t; ++e)
		if (0 != this[e]) return e * this.DB + lbit(this[e]);
	if (this.s < 0) return this.t * this.DB;
	else return -1
}

function cbit(e) {
	var t = 0;
	for (; 0 != e;) {
		e &= e - 1;
		++t
	}
	return t
}

function bnBitCount() {
	var e = 0,
		t = this.s & this.DM;
	for (var i = 0; i < this.t; ++i) e += cbit(this[i] ^ t);
	return e
}

function bnTestBit(e) {
	var t = Math.floor(e / this.DB);
	if (t >= this.t) return 0 != this.s;
	else return 0 != (this[t] & 1 << e % this.DB)
}

function bnpChangeBit(e, t) {
	var i = BigInteger.ONE.shiftLeft(e);
	this.bitwiseTo(i, t, i);
	return i
}

function bnSetBit(e) {
	return this.changeBit(e, op_or)
}

function bnClearBit(e) {
	return this.changeBit(e, op_andnot)
}

function bnFlipBit(e) {
	return this.changeBit(e, op_xor)
}

function bnpAddTo(e, t) {
	var i = 0,
		n = 0,
		s = Math.min(e.t, this.t);
	for (; i < s;) {
		n += this[i] + e[i];
		t[i++] = n & this.DM;
		n >>= this.DB
	}
	if (e.t < this.t) {
		n += e.s;
		for (; i < this.t;) {
			n += this[i];
			t[i++] = n & this.DM;
			n >>= this.DB
		}
		n += this.s
	} else {
		n += this.s;
		for (; i < e.t;) {
			n += e[i];
			t[i++] = n & this.DM;
			n >>= this.DB
		}
		n += e.s
	}
	t.s = n < 0 ? -1 : 0;
	if (n > 0) t[i++] = n;
	else if (n < -1) t[i++] = this.DV + n;
	t.t = i;
	t.clamp()
}

function bnAdd(e) {
	var t = nbi();
	this.addTo(e, t);
	return t
}

function bnSubtract(e) {
	var t = nbi();
	this.subTo(e, t);
	return t
}

function bnMultiply(e) {
	var t = nbi();
	this.multiplyTo(e, t);
	return t
}

function bnSquare() {
	var e = nbi();
	this.squareTo(e);
	return e
}

function bnDivide(e) {
	var t = nbi();
	this.divRemTo(e, t, null);
	return t
}

function bnRemainder(e) {
	var t = nbi();
	this.divRemTo(e, null, t);
	return t
}

function bnDivideAndRemainder(e) {
	var t = nbi(),
		i = nbi();
	this.divRemTo(e, t, i);
	return new Array(t, i)
}

function bnpDMultiply(e) {
	this[this.t] = this.am(0, e - 1, this, 0, 0, this.t);
	++this.t;
	this.clamp()
}

function bnpDAddOffset(e, t) {
	if (0 != e) {
		for (; this.t <= t;) this[this.t++] = 0;
		this[t] += e;
		for (; this[t] >= this.DV;) {
			this[t] -= this.DV;
			if (++t >= this.t) this[this.t++] = 0;
			++this[t]
		}
	}
}

function NullExp() { }

function nNop(e) {
	return e
}

function nMulTo(e, t, i) {
	e.multiplyTo(t, i)
}

function nSqrTo(e, t) {
	e.squareTo(t)
}
NullExp.prototype.convert = nNop;
NullExp.prototype.revert = nNop;
NullExp.prototype.mulTo = nMulTo;
NullExp.prototype.sqrTo = nSqrTo;

function bnPow(e) {
	return this.exp(e, new NullExp)
}

function bnpMultiplyLowerTo(e, t, i) {
	var n = Math.min(this.t + e.t, t);
	i.s = 0;
	i.t = n;
	for (; n > 0;) i[--n] = 0;
	var s;
	for (s = i.t - this.t; n < s; ++n) i[n + this.t] = this.am(0, e[n], i, n, 0, this.t);
	for (s = Math.min(e.t, t); n < s; ++n) this.am(0, e[n], i, n, 0, t - n);
	i.clamp()
}

function bnpMultiplyUpperTo(e, t, i) {
	--t;
	var n = i.t = this.t + e.t - t;
	i.s = 0;
	for (; --n >= 0;) i[n] = 0;
	for (n = Math.max(t - this.t, 0); n < e.t; ++n) i[this.t + n - t] = this.am(t - n, e[n], i, 0, 0, this.t + n - t);
	i.clamp();
	i.drShiftTo(1, i)
}

function Barrett(e) {
	this.r2 = nbi();
	this.q3 = nbi();
	BigInteger.ONE.dlShiftTo(2 * e.t, this.r2);
	this.mu = this.r2.divide(e);
	this.m = e
}

function barrettConvert(e) {
	if (e.s < 0 || e.t > 2 * this.m.t) return e.mod(this.m);
	else if (e.compareTo(this.m) < 0) return e;
	else {
		var t = nbi();
		e.copyTo(t);
		this.reduce(t);
		return t
	}
}

function barrettRevert(e) {
	return e
}

function barrettReduce(e) {
	e.drShiftTo(this.m.t - 1, this.r2);
	if (e.t > this.m.t + 1) {
		e.t = this.m.t + 1;
		e.clamp()
	}
	this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
	this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
	for (; e.compareTo(this.r2) < 0;) e.dAddOffset(1, this.m.t + 1);
	e.subTo(this.r2, e);
	for (; e.compareTo(this.m) >= 0;) e.subTo(this.m, e)
}

function barrettSqrTo(e, t) {
	e.squareTo(t);
	this.reduce(t)
}

function barrettMulTo(e, t, i) {
	e.multiplyTo(t, i);
	this.reduce(i)
}
Barrett.prototype.convert = barrettConvert;
Barrett.prototype.revert = barrettRevert;
Barrett.prototype.reduce = barrettReduce;
Barrett.prototype.mulTo = barrettMulTo;
Barrett.prototype.sqrTo = barrettSqrTo;

function bnModPow(e, t) {
	var i = e.bitLength(),
		n, s = nbv(1),
		a;
	if (i <= 0) return s;
	else if (i < 18) n = 1;
	else if (i < 48) n = 3;
	else if (i < 144) n = 4;
	else if (i < 768) n = 5;
	else n = 6; if (i < 8) a = new Classic(t);
	else if (t.isEven()) a = new Barrett(t);
	else a = new Montgomery(t);
	var r = new Array,
		o = 3,
		c = n - 1,
		d = (1 << n) - 1;
	r[1] = a.convert(this);
	if (n > 1) {
		var _ = nbi();
		a.sqrTo(r[1], _);
		for (; o <= d;) {
			r[o] = nbi();
			a.mulTo(_, r[o - 2], r[o]);
			o += 2
		}
	}
	var l = e.t - 1,
		u, f = !0,
		h = nbi(),
		p;
	i = nbits(e[l]) - 1;
	for (; l >= 0;) {
		if (i >= c) u = e[l] >> i - c & d;
		else {
			u = (e[l] & (1 << i + 1) - 1) << c - i;
			if (l > 0) u |= e[l - 1] >> this.DB + i - c
		}
		o = n;
		for (; 0 == (1 & u);) {
			u >>= 1;
			--o
		}
		if ((i -= o) < 0) {
			i += this.DB;
			--l
		}
		if (f) {
			r[u].copyTo(s);
			f = !1
		} else {
			for (; o > 1;) {
				a.sqrTo(s, h);
				a.sqrTo(h, s);
				o -= 2
			}
			if (o > 0) a.sqrTo(s, h);
			else {
				p = s;
				s = h;
				h = p
			}
			a.mulTo(h, r[u], s)
		}
		for (; l >= 0 && 0 == (e[l] & 1 << i);) {
			a.sqrTo(s, h);
			p = s;
			s = h;
			h = p;
			if (--i < 0) {
				i = this.DB - 1;
				--l
			}
		}
	}
	return a.revert(s)
}

function bnGCD(e) {
	var t = this.s < 0 ? this.negate() : this.clone();
	var i = e.s < 0 ? e.negate() : e.clone();
	if (t.compareTo(i) < 0) {
		var n = t;
		t = i;
		i = n
	}
	var s = t.getLowestSetBit(),
		a = i.getLowestSetBit();
	if (a < 0) return t;
	if (s < a) a = s;
	if (a > 0) {
		t.rShiftTo(a, t);
		i.rShiftTo(a, i)
	}
	for (; t.signum() > 0;) {
		if ((s = t.getLowestSetBit()) > 0) t.rShiftTo(s, t);
		if ((s = i.getLowestSetBit()) > 0) i.rShiftTo(s, i);
		if (t.compareTo(i) >= 0) {
			t.subTo(i, t);
			t.rShiftTo(1, t)
		} else {
			i.subTo(t, i);
			i.rShiftTo(1, i)
		}
	}
	if (a > 0) i.lShiftTo(a, i);
	return i
}

function bnpModInt(e) {
	if (e <= 0) return 0;
	var t = this.DV % e,
		i = this.s < 0 ? e - 1 : 0;
	if (this.t > 0)
		if (0 == t) i = this[0] % e;
		else
			for (var n = this.t - 1; n >= 0; --n) i = (t * i + this[n]) % e;
	return i
}

function bnModInverse(e) {
	var t = e.isEven();
	if (this.isEven() && t || 0 == e.signum()) return BigInteger.ZERO;
	var i = e.clone(),
		n = this.clone();
	var s = nbv(1),
		a = nbv(0),
		r = nbv(0),
		o = nbv(1);
	for (; 0 != i.signum();) {
		for (; i.isEven();) {
			i.rShiftTo(1, i);
			if (t) {
				if (!s.isEven() || !a.isEven()) {
					s.addTo(this, s);
					a.subTo(e, a)
				}
				s.rShiftTo(1, s)
			} else if (!a.isEven()) a.subTo(e, a);
			a.rShiftTo(1, a)
		}
		for (; n.isEven();) {
			n.rShiftTo(1, n);
			if (t) {
				if (!r.isEven() || !o.isEven()) {
					r.addTo(this, r);
					o.subTo(e, o)
				}
				r.rShiftTo(1, r)
			} else if (!o.isEven()) o.subTo(e, o);
			o.rShiftTo(1, o)
		}
		if (i.compareTo(n) >= 0) {
			i.subTo(n, i);
			if (t) s.subTo(r, s);
			a.subTo(o, a)
		} else {
			n.subTo(i, n);
			if (t) r.subTo(s, r);
			o.subTo(a, o)
		}
	}
	if (0 != n.compareTo(BigInteger.ONE)) return BigInteger.ZERO;
	if (o.compareTo(e) >= 0) return o.subtract(e);
	if (o.signum() < 0) o.addTo(e, o);
	else return o; if (o.signum() < 0) return o.add(e);
	else return o
}
var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];

function bnIsProbablePrime(e) {
	var t, i = this.abs();
	if (1 == i.t && i[0] <= lowprimes[lowprimes.length - 1]) {
		for (t = 0; t < lowprimes.length; ++t)
			if (i[0] == lowprimes[t]) return !0;
		return !1
	}
	if (i.isEven()) return !1;
	t = 1;
	for (; t < lowprimes.length;) {
		var n = lowprimes[t],
			s = t + 1;
		for (; s < lowprimes.length && n < lplim;) n *= lowprimes[s++];
		n = i.modInt(n);
		for (; t < s;)
			if (n % lowprimes[t++] == 0) return !1
	}
	return i.millerRabin(e)
}

function bnpMillerRabin(e) {
	var t = this.subtract(BigInteger.ONE);
	var i = t.getLowestSetBit();
	if (i <= 0) return !1;
	var n = t.shiftRight(i);
	e = e + 1 >> 1;
	if (e > lowprimes.length) e = lowprimes.length;
	var s = nbi();
	for (var a = 0; a < e; ++a) {
		s.fromInt(lowprimes[Math.floor(Math.random() * lowprimes.length)]);
		var r = s.modPow(n, this);
		if (0 != r.compareTo(BigInteger.ONE) && 0 != r.compareTo(t)) {
			var o = 1;
			for (; o++ < i && 0 != r.compareTo(t);) {
				r = r.modPowInt(2, this);
				if (0 == r.compareTo(BigInteger.ONE)) return !1
			}
			if (0 != r.compareTo(t)) return !1
		}
	}
	return !0
}
BigInteger.prototype.chunkSize = bnpChunkSize;
BigInteger.prototype.toRadix = bnpToRadix;
BigInteger.prototype.fromRadix = bnpFromRadix;
BigInteger.prototype.fromNumber = bnpFromNumber;
BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
BigInteger.prototype.changeBit = bnpChangeBit;
BigInteger.prototype.addTo = bnpAddTo;
BigInteger.prototype.dMultiply = bnpDMultiply;
BigInteger.prototype.dAddOffset = bnpDAddOffset;
BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
BigInteger.prototype.modInt = bnpModInt;
BigInteger.prototype.millerRabin = bnpMillerRabin;
BigInteger.prototype.clone = bnClone;
BigInteger.prototype.intValue = bnIntValue;
BigInteger.prototype.byteValue = bnByteValue;
BigInteger.prototype.shortValue = bnShortValue;
BigInteger.prototype.signum = bnSigNum;
BigInteger.prototype.toByteArray = bnToByteArray;
BigInteger.prototype.equals = bnEquals;
BigInteger.prototype.min = bnMin;
BigInteger.prototype.max = bnMax;
BigInteger.prototype.and = bnAnd;
BigInteger.prototype.or = bnOr;
BigInteger.prototype.xor = bnXor;
BigInteger.prototype.andNot = bnAndNot;
BigInteger.prototype.not = bnNot;
BigInteger.prototype.shiftLeft = bnShiftLeft;
BigInteger.prototype.shiftRight = bnShiftRight;
BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
BigInteger.prototype.bitCount = bnBitCount;
BigInteger.prototype.testBit = bnTestBit;
BigInteger.prototype.setBit = bnSetBit;
BigInteger.prototype.clearBit = bnClearBit;
BigInteger.prototype.flipBit = bnFlipBit;
BigInteger.prototype.add = bnAdd;
BigInteger.prototype.subtract = bnSubtract;
BigInteger.prototype.multiply = bnMultiply;
BigInteger.prototype.divide = bnDivide;
BigInteger.prototype.remainder = bnRemainder;
BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
BigInteger.prototype.modPow = bnModPow;
BigInteger.prototype.modInverse = bnModInverse;
BigInteger.prototype.pow = bnPow;
BigInteger.prototype.gcd = bnGCD;
BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
BigInteger.prototype.square = bnSquare;
if ("object" != typeof JSON) JSON = {};
! function () {
	"use strict";

	function f(e) {
		return e < 10 ? "0" + e : e
	}

	function quote(e) {
		escapable.lastIndex = 0;
		return escapable.test(e) ? '"' + e.replace(escapable, function (e) {
			var t = meta[e];
			return "string" == typeof t ? t : "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
		}) + '"' : '"' + e + '"'
	}

	function str(e, t) {
		var i, n, s, a, r = gap,
			o, c = t[e];
		if (c && "object" == typeof c && "function" == typeof c.toJSON) c = c.toJSON(e);
		if ("function" == typeof rep) c = rep.call(t, e, c);
		switch (typeof c) {
			case "string":
				return quote(c);
			case "number":
				return isFinite(c) ? String(c) : "null";
			case "boolean":
			case "null":
				return String(c);
			case "object":
				if (!c) return "null";
				gap += indent;
				o = [];
				if ("[object Array]" === Object.prototype.toString.apply(c)) {
					a = c.length;
					for (i = 0; i < a; i += 1) o[i] = str(i, c) || "null";
					s = 0 === o.length ? "[]" : gap ? "[\n" + gap + o.join(",\n" + gap) + "\n" + r + "]" : "[" + o.join(",") + "]";
					gap = r;
					return s
				}
				if (rep && "object" == typeof rep) {
					a = rep.length;
					for (i = 0; i < a; i += 1)
						if ("string" == typeof rep[i]) {
							n = rep[i];
							s = str(n, c);
							if (s) o.push(quote(n) + (gap ? ": " : ":") + s)
						}
				} else
					for (n in c)
						if (Object.prototype.hasOwnProperty.call(c, n)) {
							s = str(n, c);
							if (s) o.push(quote(n) + (gap ? ": " : ":") + s)
						} s = 0 === o.length ? "{}" : gap ? "{\n" + gap + o.join(",\n" + gap) + "\n" + r + "}" : "{" + o.join(",") + "}";
				gap = r;
				return s
		}
	}
	if ("function" != typeof Date.prototype.toJSON) {
		Date.prototype.toJSON = function () {
			return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
		};
		String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function () {
			return this.valueOf()
		}
	}
	var cx, escapable, gap, indent, meta, rep;
	if ("function" != typeof JSON.stringify) {
		escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
		meta = {
			"\b": "\\b",
			"\t": "\\t",
			"\n": "\\n",
			"\f": "\\f",
			"\r": "\\r",
			'"': '\\"',
			"\\": "\\\\"
		};
		JSON.stringify = function (e, t, i) {
			var n;
			gap = "";
			indent = "";
			if ("number" == typeof i)
				for (n = 0; n < i; n += 1) indent += " ";
			else if ("string" == typeof i) indent = i;
			rep = t;
			if (t && "function" != typeof t && ("object" != typeof t || "number" != typeof t.length)) throw new Error("JSON.stringify");
			return str("", {
				"": e
			})
		}
	}
	if ("function" != typeof JSON.parse) {
		cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
		JSON.parse = function (text, reviver) {
			function walk(e, t) {
				var i, n, s = e[t];
				if (s && "object" == typeof s)
					for (i in s)
						if (Object.prototype.hasOwnProperty.call(s, i)) {
							n = walk(s, i);
							if (void 0 !== n) s[i] = n;
							else delete s[i]
						}
				return reviver.call(e, t, s)
			}
			var j;
			text = String(text);
			cx.lastIndex = 0;
			if (cx.test(text)) text = text.replace(cx, function (e) {
				return "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
			});
			if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
				j = eval("(" + text + ")");
				return "function" == typeof reviver ? walk({
					"": j
				}, "") : j
			}
			throw new SyntaxError("JSON.parse")
		}
	}
}();
var RSAPublicKey = function (e, t) {
	this.modulus = new BigInteger(Hex.encode(e), 16);
	this.encryptionExponent = new BigInteger(Hex.encode(t), 16)
};
var UTF8 = {
	encode: function (e) {
		e = e.replace(/\r\n/g, "\n");
		var t = "";
		for (var i = 0; i < e.length; i++) {
			var n = e.charCodeAt(i);
			if (n < 128) t += String.fromCharCode(n);
			else if (n > 127 && n < 2048) {
				t += String.fromCharCode(n >> 6 | 192);
				t += String.fromCharCode(63 & n | 128)
			} else {
				t += String.fromCharCode(n >> 12 | 224);
				t += String.fromCharCode(n >> 6 & 63 | 128);
				t += String.fromCharCode(63 & n | 128)
			}
		}
		return t
	},
	decode: function (e) {
		var t = "";
		var i = 0;
		var n = $c1 = $c2 = 0;
		for (; i < e.length;) {
			n = e.charCodeAt(i);
			if (n < 128) {
				t += String.fromCharCode(n);
				i++
			} else if (n > 191 && n < 224) {
				$c2 = e.charCodeAt(i + 1);
				t += String.fromCharCode((31 & n) << 6 | 63 & $c2);
				i += 2
			} else {
				$c2 = e.charCodeAt(i + 1);
				$c3 = e.charCodeAt(i + 2);
				t += String.fromCharCode((15 & n) << 12 | (63 & $c2) << 6 | 63 & $c3);
				i += 3
			}
		}
		return t
	}
};
var Base64 = {
	base64: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	encode: function (e) {
		if (!e) return !1;
		var t = "";
		var i, n, s;
		var a, r, o, c;
		var d = 0;
		do {
			i = e.charCodeAt(d++);
			n = e.charCodeAt(d++);
			s = e.charCodeAt(d++);
			a = i >> 2;
			r = (3 & i) << 4 | n >> 4;
			o = (15 & n) << 2 | s >> 6;
			c = 63 & s;
			if (isNaN(n)) o = c = 64;
			else if (isNaN(s)) c = 64;
			t += this.base64.charAt(a) + this.base64.charAt(r) + this.base64.charAt(o) + this.base64.charAt(c)
		} while (d < e.length);
		return t
	},
	decode: function (e) {
		if (!e) return !1;
		e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		var t = "";
		var i, n, s, a;
		var r = 0;
		do {
			i = this.base64.indexOf(e.charAt(r++));
			n = this.base64.indexOf(e.charAt(r++));
			s = this.base64.indexOf(e.charAt(r++));
			a = this.base64.indexOf(e.charAt(r++));
			t += String.fromCharCode(i << 2 | n >> 4);
			if (64 != s) t += String.fromCharCode((15 & n) << 4 | s >> 2);
			if (64 != a) t += String.fromCharCode((3 & s) << 6 | a)
		} while (r < e.length);
		return t
	}
};
var Hex = {
	hex: "0123456789abcdef",
	encode: function (e) {
		if (!e) return !1;
		var t = "";
		var i;
		var n = 0;
		do {
			i = e.charCodeAt(n++);
			t += this.hex.charAt(i >> 4 & 15) + this.hex.charAt(15 & i)
		} while (n < e.length);
		return t
	},
	decode: function (e) {
		if (!e) return !1;
		e = e.replace(/[^0-9abcdef]/g, "");
		var t = "";
		var i = 0;
		do t += String.fromCharCode(this.hex.indexOf(e.charAt(i++)) << 4 & 240 | 15 & this.hex.indexOf(e.charAt(i++))); while (i < e.length);
		return t
	}
};
var ASN1Data = function (e) {
	this.error = !1;
	this.parse = function (e) {
		if (!e) {
			this.error = !0;
			return null
		}
		var t = [];
		for (; e.length > 0;) {
			var i = e.charCodeAt(0);
			e = e.substr(1);
			var n = 0;
			if (5 == (31 & i)) e = e.substr(1);
			else if (128 & e.charCodeAt(0)) {
				var s = 127 & e.charCodeAt(0);
				e = e.substr(1);
				if (s > 0) n = e.charCodeAt(0);
				if (s > 1) n = n << 8 | e.charCodeAt(1);
				if (s > 2) {
					this.error = !0;
					return null
				}
				e = e.substr(s)
			} else {
				n = e.charCodeAt(0);
				e = e.substr(1)
			}
			var a = "";
			if (n) {
				if (n > e.length) {
					this.error = !0;
					return null
				}
				a = e.substr(0, n);
				e = e.substr(n)
			}
			if (32 & i) t.push(this.parse(a));
			else t.push(this.value(128 & i ? 4 : 31 & i, a))
		}
		return t
	};
	this.value = function (e, t) {
		if (1 == e) return t ? !0 : !1;
		else if (2 == e) return t;
		else if (3 == e) return this.parse(t.substr(1));
		else if (5 == e) return null;
		else if (6 == e) {
			var i = [];
			var n = t.charCodeAt(0);
			i.push(Math.floor(n / 40));
			i.push(n - 40 * i[0]);
			var s = [];
			var a = 0;
			var r;
			for (r = 1; r < t.length; r++) {
				var o = t.charCodeAt(r);
				s.push(127 & o);
				if (128 & o) a++;
				else {
					var c;
					var d = 0;
					for (c = 0; c < s.length; c++) d += s[c] * Math.pow(128, a--);
					i.push(d);
					a = 0;
					s = []
				}
			}
			return i.join(".")
		}
		return null
	};
	this.data = this.parse(e)
};
var RSA = {
	getPublicKey: function (e) {
		if (e.length < 50) return !1;
		if ("-----BEGIN PUBLIC KEY-----" != e.substr(0, 26)) return !1;
		e = e.substr(26);
		if ("-----END PUBLIC KEY-----" != e.substr(e.length - 24)) return !1;
		e = e.substr(0, e.length - 24);
		e = new ASN1Data(Base64.decode(e));
		if (e.error) return !1;
		e = e.data;
		if ("1.2.840.113549.1.1.1" == e[0][0][0]) return new RSAPublicKey(e[0][1][0][0], e[0][1][0][1]);
		else return !1
	},
	encrypt: function (e, t) {
		if (!t) return !1;
		var i = t.modulus.bitLength() + 7 >> 3;
		e = this.pkcs1pad2(e, i);
		if (!e) return !1;
		e = e.modPowInt(t.encryptionExponent, t.modulus);
		if (!e) return !1;
		e = e.toString(16);
		for (; e.length < 2 * i;) e = "0" + e;
		return Base64.encode(Hex.decode(e))
	},
	decrypt: function (e) {
		var t = new BigInteger(e, 16)
	},
	pkcs1pad2: function (e, t) {
		if (t < e.length + 11) return null;
		var i = [];
		var n = e.length - 1;
		for (; n >= 0 && t > 0;) i[--t] = e.charCodeAt(n--);
		i[--t] = 0;
		for (; t > 2;) i[--t] = Math.floor(254 * Math.random()) + 1;
		i[--t] = 2;
		i[--t] = 0;
		return new BigInteger(i)
	}
};
var MpUtil = function () {
	var e = 0;
	var t = function (e, t, i) {
		e.addEventListener ? e.addEventListener(t, i, !1) : e.attachEvent("on" + t, i)
	};
	var i = function (e, t, i) {
		e.removeEventListener ? e.removeEventListener(t, i, !1) : e.detachEvent("on" + t, i)
	};
	var n = function () {
		return "" + ++e
	};
	var s = function (e, t) {
		try {
			t = t.toLowerCase();
			if (null === e) return "null" == t;
			if (void 0 === e) return "undefined" == t;
			else return Object.prototype.toString.call(e).toLowerCase() == "[object " + t + "]"
		} catch (i) {
			return !1
		}
	};
	return {
		addEvent: t,
		clearEvent: i,
		uniqueId: n,
		isTypeOf: s
	}
}();
var MpRequest = function () {
	var e;
	var t = "zc.reg.163.com/resources/mp-agent-finger.html?WEBZJVersion=915d363b59bdb5f056a009f7abbc5ce0";
	var i = "MP-DATA:";
	var n = "MP-COOKIE:";
	var s = "MP_AGENT_READY";
	var a = !1;
	var r = !1;
	var o = [];
	var c;
	var d = {};
	var _ = {};
	var l, u, f, h, p, m, g, b, v;
	var $;
	var y = 200 * Math.random();
	var C = function () {
		a = !0;
		var t = function (e) {
			var t = document.createElement("img");
			t.style.width = "0px";
			t.style.height = "0px";
			t.style.position = "absolute";
			document.body.appendChild(t);
			t.src = e;
			setTimeout(function () {
				document.body.removeChild(t)
			}, 1e4)
		};
		var l = function (e, i) {
			try {
				var n, s = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 24, 25, 20400, 20500];
				var a = "https://pr.nss.netease.com/sentry/passive?uapi=" + encodeURIComponent(e);
				var r = e.indexOf("dl-") > -1 ? 1 : 0;
				var o = window._$needUrsBgp && window._$BGPZC ? 1 : 0;
				var c = 0;
				if (y <= 1) {
					n = u(i);
					a = a + "&dataTime=" + (new Date).getTime() + "&clusterName=urs-webzj-static-passive&modelName=webzj_response_time2&one=1&isLogin=" + r + "&isBGP=" + o + "&isNew=" + c;
					for (var d = 0, _ = s.length, l; d < _; d++) {
						l = s[d];
						if (l == n) a = a + "&step" + l + "=1";
						else a = a + "&step" + l + "=0"
					}
					t(a)
				}
			} catch (f) { }
		};
		var u = function (e) {
			var t = 1;
			if (e > 2e4)
				if (20400 == e || 20500 == e) t = e;
				else if (e.toString().indexOf("4") > -1) t = 24;
				else if (e.toString().indexOf("5") > -1) t = 25;
				else t = 10;
			else if (e > 1e4) t = 9;
			else if (e > 2e3) t = 8;
			else if (e > 1e3) t = 7;
			else if (e > 500) t = 6;
			else if (e > 200) t = 5;
			else if (e > 90) t = 4;
			else if (e > 60) t = 3;
			else if (e > 30) t = 2;
			return t
		};
		m = function (t) {
			var a = t.data,
				u;
			if (a !== s) {
				if ("object" == typeof a) a = JSON.stringify(a);
				if (0 !== a.indexOf(n)) {
					if (0 === a.indexOf(i)) {
						a = JSON.parse(a.replace(i, ""));
						u = d[a.key];
						delete d[a.key];
						if (u)
							if (0 !== ("" + a.status).indexOf("2")) {
								var h = {
									ret: "" + a.status
								};
								if ("-1" == a.status) l(u.logPath, 10001);
								else l(u.logPath, 2e4 + parseInt(a.status));
								u && u.error(h)
							} else {
								a.result = JSON.parse(decodeURIComponent(a.result || "{}"));
								a.result.time = a.time;
								l(u.logPath, a.time);
								u && u.success(a.result)
							}
					}
				} else {
					a = JSON.parse(a.replace(n, ""));
					u = _[a.key];
					delete _[a.key];
					if (!u) return;
					u(a.cookieValue)
				}
			} else {
				r = !0;
				var p = (new Date).getTime() - $;
				var m = window._$needUrsBgp && window._$BGPZC ? "BGP" : "notBGP";
				l("zc-iframe-" + m, p);
				for (var g = 0, b = o.length; g < b; g++) c(e.contentWindow, {
					data: o[g]
				});
				clearTimeout(f)
			}
		};
		if (!window.postMessage) {
			var g = "MSGREGISTER|",
				b = [];
			var v = function () {
				var e = function (e) {
					var t = {}, i = e.split("|");
					for (var n = 0, s = i.length, a; n < s; n++) {
						a = i[n].split("=");
						t[decodeURIComponent(a.shift())] = decodeURIComponent(a.join("="))
					}
					return t
				};
				return function () {
					var t = unescape(window.name || "");
					if (t && 0 == t.indexOf(g)) {
						window.name = "";
						t = t.replace(g, "");
						var i = e(t),
							n = (i.origin || "").toLowerCase();
						if (!n || "*" == n || 0 == location.href.toLowerCase().indexOf(n)) m({
							data: JSON.parse(i.data || "null"),
							origin: document.referrer
						})
					}
				}
			}();
			var C = function () {
				var e;
				var t = function (e, t) {
					for (var i = 0, n = e.length; i < n; i++)
						if (e[i] == t) return !0;
					return !1
				};
				return function () {
					if (b.length) {
						e = [];
						for (var i = b.length - 1, n; i >= 0; i--) {
							n = b[i];
							if (!t(e, n.w)) {
								e.push(n.w);
								b.splice(i, 1);
								n.w.name = n.d
							}
						}
						e = null
					}
				}
			}();
			c = function () {
				var e = function (e) {
					var t = [];
					for (var i in e) t.push(encodeURIComponent(i) + "=" + encodeURIComponent(e[i]));
					return t.join("|")
				};
				var t = function (t) {
					var i = {};
					t = t || {};
					i.origin = t.origin || "*";
					i.ref = location.href;
					i.data = JSON.stringify(t.data);
					return g + e(i)
				};
				return function (e, i) {
					b.unshift({
						w: e,
						d: escape(t(i))
					})
				}
			}();
			h = window.setInterval(C, 100);
			p = window.setInterval(v, 20)
		} else {
			c = function (e, t) {
				t = t || {};
				e.postMessage(JSON.stringify(t.data), t.origin || "*")
			};
			MpUtil.addEvent(window, "message", m)
		}
	};
	var w = function () {
		return function (e) {
			e = e || {};
			var t;
			t = document.createElement("iframe");
			t.frameBorder = 0;
			t.style.position = "absolute";
			t.style.width = 0;
			t.style.height = 0;
			t.id = "id-" + MpUtil.uniqueId();
			document.body.appendChild(t);
			var i = e.src;
			window.setTimeout(function () {
				t.src = i
			}, 0);
			return t
		}
	}();
	var x = function (e) {
		h = window.clearInterval(h);
		p = window.clearInterval(p);
		MpUtil.clearEvent(window, "message", m);
		g = 1;
		C({
			timeout: e.timeout
		})
	};
	var T = function () {
		var i = function (e) {
			return e.replace("dl.reg.163.com", "dl2.reg.163.com").replace("zc.reg.163.com", "zc2.reg.163.com").replace("passport.", "passport2.").replace("reg.icourse163.org", "reg2.icourse163.org")
		};
		var n = function (e) {
			var t = [];
			for (var i in e) t.push(encodeURIComponent(i) + "=" + encodeURIComponent(e[i]));
			return t.join("&")
		};
		return function (s, _) {
			var h;
			s = s || {};
			var p = MpUtil.uniqueId();
			if (!a) {
				l = p;
				f = setTimeout(function () {
					d[l].error({
						ret: "-2"
					});
					delete d[l]
				}, window._$bgpTime2);
				C({
					timeout: s.timeout
				})
			}
			if (window._$needUrsBgp && window._$BGPZC && !g) {
				f = window.clearTimeout(f);
				u = p;
				f = setTimeout(function () {
					d[u].error({
						ret: "-2"
					});
					delete d[u]
				}, window._$bgpTime2);
				x(s)
			}
			var m = s.url.indexOf("/yd/") >= 0 ? "yd-" + _ : _;
			m = m.replace(/\//g, "");
			m = "zc-" + m;
			d[p] = {
				success: s.success,
				error: s.error,
				logPath: m
			};
			if (window._$needUrsBgp && window._$BGPZC && e && !b) {
				var y = e.contentWindow;
				if (e) {
					e.src = "about:blank";
					try {
						y.document.write("");
						y.document.clear()
					} catch (T) { }
				}
				document.body.removeChild(e);
				window.CollectGarbage && window.CollectGarbage();
				e = null;
				r = !1;
				b = 0;
				v = 1;
				for (var E = 0; E < o.length; E++) {
					var k = o[E].url;
					if (o[E].key != l) o[E].url = i(k);
					else;
				}
				for (var S = 0; S < o.length; S++)
					if (o[S].key == l) {
						o.shift();
						break
					}
			} else if ("/ini" == _ || "/nini" == _) o = [];
			if ("get" === s.type.toLowerCase()) {
				var N = s.url;
				var L = N.indexOf("?") < 0 ? "?" : "&";
				s.data.nocache = p;
				var I = n(s.data);
				if (I) N += L + I;
				s.url = N
			}
			var M = {};
			M.isInit = s.isInit || "";
			if (s.data) M.rtid = s.data.rtid || "";
			M.key = p;
			M.data = "get" === s.type.toLowerCase() ? null : s.data;
			M.headers = {};
			M.headers["Content-Type"] = s.contentType || "application/x-www-form-urlencoded";
			if ("application/x-www-form-urlencoded" == M.headers["Content-Type"]) {
				s.data = JSON.parse(s.data);
				M.data = n(s.data)
			}
			M.method = s.type;
			M.timeout = s.timeout || 1e4;
			M.url = s.url;
			if (!e) {
				if (window["$regCookieDomain"])
					if (window["$regCookieDomain"].indexOf("icourse163.org") >= 0) t = t.replace("zc.reg.163.com", "reg." + window["$regCookieDomain"] + "/zc");
					else t = t.replace("zc.reg.163.com", "passport." + window["$regCookieDomain"] + "/zc");
				t = t + "&pkid=" + window._$PKID + "&product=" + window._$PRODUCT + "&mpfrom=" + encodeURIComponent(window._$TOPURL);
				h = window.REGPROTOCOL + t;
				if (window._$needUrsBgp && window._$BGPZC) {
					b = 1;
					h = i(h)
				}
				$ = (new Date).getTime();
				e = w({
					src: h
				})
			}
			if (!r)
				if (v && o.length > 0) v = 0;
				else o.push(M);
			else c(e.contentWindow, {
				data: M
			});
			return p
		}
	}();
	var E = function () {
		return function (t, i) {
			var n = MpUtil.uniqueId();
			_[n] = i;
			var s = {
				key: n,
				cookieKey: t
			};
			c(e.contentWindow, {
				data: s
			})
		}
	}();
	var k = function (t) {
		for (var i = 0; i < t.length; i++) {
			var n = t[i];
			S(n);
			if (d[n]) delete d[n]
		}
		var s = {
			clearAjaxArr: t
		};
		c(e.contentWindow, {
			data: s
		})
	};
	var S = function (e) {
		for (var t = 0; t < o.length; t++) {
			var i = o[t];
			if (i.key === e) {
				o.splice(t, 1);
				break
			}
		}
	};
	return {
		request: T,
		getCookie: E,
		reset: x,
		clearAjaxByKey: k
	}
}();
var MpRequest2 = function () {
	var e;
	var t = "dl.reg.163.com/src/mp-agent-finger.html?WEBZJVersion=85952b46a73272662a3467d72e129fea";
	var i = "MP2-DATA:";
	var n = "MP2-COOKIE:";
	var s = "MP2_AGENT_READY";
	var a = !1;
	var r = !1;
	var o = [];
	var c;
	var d = {};
	var _ = {};
	var l, u, f, h, p, m, g, b, v;
	var $;
	var y = function (e) {
		if ((e.indexOf("dl2.reg.163.com") > -1 || e.indexOf("dl.reg.163.com") > -1) && e.indexOf("/dl/") < 0)
			if (e.indexOf("/b/") > -1) e = e.replace(/:\/\/[^/]+\/b\//, function (e) {
				return e + "dl/"
			});
			else e = e.replace(/:\/\/[^/]+\//, function (e) {
				return e + "dl/"
			});
		return e
	};
	var C = function (e) {
		return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(e).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null
	};
	var w = 200 * Math.random();
	var x = function () {
		a = !0;
		var t = function (e) {
			var t = document.createElement("img");
			t.style.width = "0px";
			t.style.height = "0px";
			t.style.position = "absolute";
			document.body.appendChild(t);
			t.src = e;
			setTimeout(function () {
				document.body.removeChild(t)
			}, 1e4)
		};
		var l = function (e, i) {
			try {
				var n, s = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 24, 25, 20400, 20500];
				var a = "https://pr.nss.netease.com/sentry/passive?uapi=" + encodeURIComponent(e);
				var r = e.indexOf("dl-") > -1 ? 1 : 0;
				var o = window._$needUrsBgp && window._$BGP ? 1 : 0;
				var c = 0;
				if (w <= 1) {
					n = u(i);
					a = a + "&dataTime=" + (new Date).getTime() + "&clusterName=urs-webzj-static-passive&modelName=webzj_response_time2&one=1&isLogin=" + r + "&isBGP=" + o + "&isNew=" + c;
					for (var d = 0, _ = s.length, l; d < _; d++) {
						l = s[d];
						if (l == n) a = a + "&step" + l + "=1";
						else a = a + "&step" + l + "=0"
					}
					t(a)
				}
			} catch (f) { }
		};
		var u = function (e) {
			var t = 1;
			if (e > 2e4)
				if (20400 == e || 20500 == e) t = e;
				else if (e.toString().indexOf("4") > -1) t = 24;
				else if (e.toString().indexOf("5") > -1) t = 25;
				else t = 10;
			else if (e > 1e4) t = 9;
			else if (e > 2e3) t = 8;
			else if (e > 1e3) t = 7;
			else if (e > 500) t = 6;
			else if (e > 200) t = 5;
			else if (e > 90) t = 4;
			else if (e > 60) t = 3;
			else if (e > 30) t = 2;
			return t
		};
		m = function (t) {
			var a = t.data,
				u;
			if (a !== s) {
				if ("object" == typeof a) a = JSON.stringify(a);
				if (0 !== a.indexOf(n)) {
					if (0 === a.indexOf(i)) {
						a = JSON.parse(a.replace(i, ""));
						u = d[a.key];
						delete d[a.key];
						if (u)
							if (0 !== ("" + a.status).indexOf("2")) {
								var h = {
									ret: "" + a.status
								};
								if ("-1" == a.status) l(u.logPath, 10001);
								else l(u.logPath, 2e4 + parseInt(a.status));
								u && u.error(h)
							} else {
								a.result = JSON.parse(decodeURIComponent(a.result || "{}"));
								a.result.time = a.time;
								l(u.logPath, a.time);
								u && u.success(a.result)
							}
					}
				} else {
					a = JSON.parse(a.replace(n, ""));
					u = _[a.key];
					delete _[a.key];
					if (!u) return;
					u(a.cookieValue)
				}
			} else {
				r = !0;
				var p = (new Date).getTime() - $;
				var m = window._$needUrsBgp && window._$BGP ? "BGP" : "notBGP";
				l("dl-iframe-" + m, p);
				for (var g = 0, b = o.length; g < b; g++) c(e.contentWindow, {
					data: o[g]
				});
				clearTimeout(f)
			}
		};
		if (!window.postMessage) {
			var g = "MSGLOGIN|",
				b = [];
			var v = function () {
				var e = function (e) {
					var t = {}, i = e.split("|");
					for (var n = 0, s = i.length, a; n < s; n++) {
						a = i[n].split("=");
						t[decodeURIComponent(a.shift())] = decodeURIComponent(a.join("="))
					}
					return t
				};
				return function () {
					var t = unescape(window.name || "");
					if (t && 0 == t.indexOf(g)) {
						window.name = "";
						t = t.replace(g, "");
						var i = e(t),
							n = (i.origin || "").toLowerCase();
						if (!n || "*" == n || 0 == location.href.toLowerCase().indexOf(n)) m({
							data: JSON.parse(i.data || "null"),
							origin: document.referrer
						})
					}
				}
			}();
			var y = function () {
				var e;
				var t = function (e, t) {
					for (var i = 0, n = e.length; i < n; i++)
						if (e[i] == t) return !0;
					return !1
				};
				return function () {
					if (b.length) {
						e = [];
						for (var i = b.length - 1, n; i >= 0; i--) {
							n = b[i];
							if (!t(e, n.w)) {
								e.push(n.w);
								b.splice(i, 1);
								n.w.name = n.d
							}
						}
						e = null
					}
				}
			}();
			c = function () {
				var e = function (e) {
					var t = [];
					for (var i in e) t.push(encodeURIComponent(i) + "=" + encodeURIComponent(e[i]));
					return t.join("|")
				};
				var t = function (t) {
					var i = {};
					t = t || {};
					i.origin = t.origin || "*";
					i.ref = location.href;
					i.data = JSON.stringify(t.data);
					return g + e(i)
				};
				return function (e, i) {
					b.unshift({
						w: e,
						d: escape(t(i))
					})
				}
			}();
			h = window.setInterval(y, 100);
			p = window.setInterval(v, 20)
		} else {
			c = function (e, t) {
				t = t || {};
				e.postMessage(JSON.stringify(t.data), t.origin || "*")
			};
			MpUtil.addEvent(window, "message", m)
		}
	};
	var T = function () {
		return function (e) {
			e = e || {};
			var t;
			t = document.createElement("iframe");
			t.frameBorder = 0;
			t.style.position = "absolute";
			t.style.width = 0;
			t.style.height = 0;
			t.id = "id-" + MpUtil.uniqueId();
			document.body.appendChild(t);
			var i = e.src;
			window.setTimeout(function () {
				t.src = i
			}, 0);
			return t
		}
	}();
	var E = function (e) {
		h = window.clearInterval(h);
		p = window.clearInterval(p);
		MpUtil.clearEvent(window, "message", m);
		g = 1;
		x({
			timeout: e.timeout
		})
	};
	var k = function () {
		var i = function (e) {
			return e.replace("dl.reg.163.com", "dl2.reg.163.com").replace("zc.reg.163.com", "zc2.reg.163.com").replace("passport.", "passport2.").replace("reg.icourse163.org", "reg2.icourse163.org")
		};
		var n = function (e) {
			var t = [];
			for (var i in e) t.push(encodeURIComponent(i) + "=" + encodeURIComponent(e[i]));
			return t.join("&")
		};
		return function (s, _) {
			var h;
			s = s || {};
			var p = MpUtil.uniqueId();
			if (!a) {
				l = p;
				f = setTimeout(function () {
					d[l].error({
						ret: "-2"
					});
					delete d[l]
				}, window._$bgpTime2);
				x({
					timeout: s.timeout
				})
			}
			if (window._$needUrsBgp && window._$BGP && !g) {
				f = window.clearTimeout(f);
				u = p;
				f = setTimeout(function () {
					d[u].error({
						ret: "-2"
					});
					delete d[u]
				}, window._$bgpTime2);
				E(s)
			}
			var m = s.url.indexOf("/yd/") >= 0 ? "yd-" + _ : _;
			m = m.replace(/\//g, "");
			m = "dl-" + m;
			d[p] = {
				success: s.success,
				error: s.error,
				logPath: m
			};
			if (window._$needUrsBgp && window._$BGP && e && !b) {
				var w = e.contentWindow;
				if (e) {
					e.src = "about:blank";
					try {
						w.document.write("");
						w.document.clear()
					} catch (k) { }
				}
				document.body.removeChild(e);
				window.CollectGarbage && window.CollectGarbage();
				e = null;
				r = !1;
				b = 0;
				v = 1;
				for (var S = 0; S < o.length; S++) {
					var N = o[S].url;
					if (o[S].key != l) o[S].url = i(N);
					else;
				}
				for (var L = 0; L < o.length; L++)
					if (o[L].key == l) {
						o.shift();
						break
					}
			} else if ("/ini" == _ || "/nini" == _) o = [];
			if ("get" === s.type.toLowerCase()) {
				var I = s.url;
				var M = I.indexOf("?") < 0 ? "?" : "&";
				s.data.nocache = p;
				var P = n(s.data);
				if (P) I += M + P;
				s.url = I
			}
			var O = {};
			O.isInit = s.isInit || "";
			if (s.data) O.rtid = s.data.rtid || "";
			O.key = p;
			O.data = "get" === s.type.toLowerCase() ? null : s.data;
			O.headers = {};
			O.headers["Content-Type"] = s.contentType || "application/x-www-form-urlencoded";
			if ("application/x-www-form-urlencoded" == O.headers["Content-Type"]) {
				s.data = JSON.parse(s.data);
				O.data = n(s.data)
			}
			O.method = s.type;
			O.timeout = s.timeout || 1e4;
			O.url = s.url;
			O.ydSignCookie = C("l_yd_sign");
			if (!e) {
				if (window["$cookieDomain"])
					if (window["$cookieDomain"].indexOf("icourse163.org") >= 0) t = t.replace("dl.reg.163.com", "reg." + window["$cookieDomain"] + "/dl");
					else t = t.replace("dl.reg.163.com", "passport." + window["$cookieDomain"] + "/dl");
				t = t + "&pkid=" + window._$PKID + "&product=" + window._$PRODUCT + "&mpfrom=" + encodeURIComponent(window._$TOPURL);
				h = window.PROTOCOL + t;
				if (window._$needUrsBgp && window._$BGP) {
					b = 1;
					h = i(h)
				}
				if (window._$pathB) h = h.replace(/:\/\/(?:[^\/]+)/, function (e) {
					return e + "/b"
				});
				$ = (new Date).getTime();
				h = y(h);
				e = T({
					src: h
				})
			}
			if (!r)
				if (v && o.length > 0) v = 0;
				else o.push(O);
			else c(e.contentWindow, {
				data: O
			});
			return p
		}
	}();
	var S = function () {
		return function (t, i) {
			var n = MpUtil.uniqueId();
			_[n] = i;
			var s = {
				key: n,
				cookieKey: t
			};
			c(e.contentWindow, {
				data: s
			})
		}
	}();
	var N = function (t) {
		for (var i = 0; i < t.length; i++) {
			var n = t[i];
			L(n);
			if (d[n]) delete d[n]
		}
		var s = {
			clearAjaxArr: t
		};
		c(e.contentWindow, {
			data: s
		})
	};
	var L = function (e) {
		for (var t = 0; t < o.length; t++) {
			var i = o[t];
			if (i.key === e) {
				o.splice(t, 1);
				break
			}
		}
	};
	return {
		request: k,
		getCookie: S,
		reset: E,
		clearAjaxByKey: N
	}
}();
var MP = function () {
	var e = "zc.reg.163.com",
		t = "ntes_zc_",
		i = "-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC5gsH+AA4XWONB5TDcUd+xCz7ejOFHZKlcZDx+pF1i7Gsvi1vjyJoQhRtRSn950x498VUkx7rUxg1/ScBVfrRxQOZ8xFBye3pjAzfb22+RCuYApSVpJ3OO3KsEuKExftz9oFBv3ejxPlYc5yq7YiBO8XlTnQN0Sa4R4qhPO3I2MQIDAQAB-----END PUBLIC KEY-----",
		n = "dl.reg.163.com";
	if (window._$needUrsBgp && window._$BGP) n = "dl2.reg.163.com";
	var s = function (e) {
		var t = "&";
		if (e.indexOf("?") == -1) {
			e += "?";
			t = ""
		}
		e = e + t + "rtid=" + window._$RTID;
		return e
	};
	var a = function () {
		var e = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
			t = 32,
			i = [];
		for (; t-- > 0;) i[t] = e.charAt(Math.random() * e.length);
		return i.join("")
	};
	var r = function (e) {
		var t = "&";
		if (e.indexOf("?") == -1) {
			e += "?";
			t = ""
		}
		e = e + t + "topURL=" + encodeURIComponent(window._$TOPURL);
		return e
	};
	var o = function (e) {
		var t = "&";
		if (e.indexOf("?") === -1) {
			e += "?";
			t = ""
		}
		e = e + t + "pd=" + window._$URSOPT.product + "&pkid=" + window._$URSOPT.promark;
		return e
	};
	var c = function (e) {
		return e.replace("dl.reg.163.com", "dl2.reg.163.com").replace("zc.reg.163.com", "zc2.reg.163.com").replace("passport.", "passport2.").replace("reg.icourse163.org", "reg2.icourse163.org")
	};
	var d = function (e) {
		var t = "&";
		if (e.indexOf("?") == -1) {
			e += "?";
			t = ""
		}
		if (window._$URSOPT.opd) e = e + t + "opd=" + window._$URSOPT.opd;
		if (window._$URSOPT.opkid) e = e + "&opkid=" + window._$URSOPT.opkid;
		return e
	};
	var _ = function (e) {
		if ((e.indexOf("dl2.reg.163.com") > -1 || e.indexOf("dl.reg.163.com") > -1) && e.indexOf("/dl/") < 0)
			if (e.indexOf("/b/") > -1) e = e.replace(/:\/\/[^/]+\/b\//, function (e) {
				return e + "dl/"
			});
			else e = e.replace(/:\/\/[^/]+\//, function (e) {
				return e + "dl/"
			});
		return e
	};
	var l = function (e) {
		if (window._$pathB) e = e.replace(/:\/\/(?:[^\/]+)/, function (e) {
			return e + "/b"
		});
		return e
	}, u = function (t) {
		var i = t.data,
			n = (t.host ? t.host : e) + t.path;
		var s = t.isLogin;
		var r = t.isInit || "";
		if (s) {
			if (window._$needUrsBgp && window._$BGP) n = c(n)
		} else if (window._$needUrsBgp && window._$BGPZC) n = c(n);
		if ("string" == typeof i) i = JSON.parse(i);
		if (r) window._$RTID = a();
		i.rtid = window._$RTID;
		delete i.isleak;
		f(i);
		if (!s) n = window.REGPROTOCOL + n;
		else n = window.PROTOCOL + n;
		var o = 1e4;
		if (s) {
			if (window._$URSOPT.opd) i.opd = window._$URSOPT.opd;
			if (window._$URSOPT.opkid) i.opkid = window._$URSOPT.opkid;
			n = l(n)
		}
		if ("POST" == t.type) i = JSON.stringify(i);
		n = _(n);
		var d = s ? {
			isInit: r,
			url: n,
			type: t.type,
			data: i,
			contentType: t.contentType || "application/json",
			dataType: t.dataType || "json",
			timeout: o,
			success: function (e) {
				var i = e && e.ret;
				if (201 != i) t.error(t.path, e);
				else t.success(t.path, e)
			},
			error: function () {
				var e = Array.prototype.slice.call(arguments);
				e.unshift(t.path);
				t.error.apply(null, e)
			}
		} : {
			isInit: r,
			url: n,
			type: t.type,
			data: i,
			contentType: t.contentType || "application/json",
			dataType: t.dataType || "json",
			timeout: o,
			success: function (e) {
				if (e && e.ret && ("102" === e.ret || "104" === e.ret || "200" === e.ret || "201" === e.ret || "202" === e.ret)) t.success(t.path, e);
				else t.error(t.path, e)
			},
			error: function () {
				var e = Array.prototype.slice.call(arguments);
				e.unshift(t.path);
				t.error.apply(null, e)
			}
		};
		if (s) return MpRequest2.request(d, t.path);
		else return MpRequest.request(d, t.path)
	};
	var f = function (e) {
		try {
			e.topURL = window._$TOPURL
		} catch (t) {
			return
		}
	};
	return {
		TICKET: "",
		encrypt: function (e, t) {
			var n = RSA.getPublicKey(i);
			return RSA.encrypt(e + "`" + t, n)
		},
		encrypt2: function (e) {
			var t = RSA.getPublicKey(i);
			return RSA.encrypt(e, t)
		},
		getCookieId: function (e, t) {
			MpRequest2.getCookie(e, t)
		},
		getId: function (e, i) {
			MpRequest.getCookie(t + e, i)
		},
		regvftcp: function (e, t, i, n) {
			u({
				path: "/vftcp",
				type: "GET",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 0
			})
		},
		regvfscp: function (e, t, i, n) {
			u({
				path: "/vfscp",
				type: "GET",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 0
			})
		},
		regvfccp: function (e, t, i, n) {
			u({
				path: "/vfccp",
				type: "GET",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 0
			})
		},
		init: function (e, t, i, n) {
			u({
				path: "/ini",
				type: "GET",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 0,
				isInit: 1
			})
		},
		vfsmsup: function (e, t, i, n) {
			return u({
				path: "/vfsmsup",
				type: "GET",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 0
			})
		},
		getCaptcha: function () {
			var t = e,
				i = window["$regCookieDomain"];
			if (i)
				if (i.indexOf("icourse163.org") >= 0) t = "reg." + i + "/zc";
				else t = "passport." + i + "/zc";
			if (window._$needUrsBgp && window._$BGPZC) t = c(t);
			var n = window.REGPROTOCOL + t + "/cp?channel=2&nocache=" + window.MpUtil.uniqueId();
			n = s(n);
			n = r(n);
			n = o(n);
			return n
		},
		checkCaptcha: function (e, t, i, n) {
			u({
				path: "/vfcp",
				type: "POST",
				contentType: "application/x-www-form-urlencoded",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 0
			})
		},
		checkName: function (e, t, i, n) {
			u({
				path: "/chn",
				type: "GET",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 0
			})
		},
		getMailSms: function (e, t, i, n) {
			u({
				path: "/mlrgsm",
				type: "GET",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 0
			})
		},
		getTicket: function (e, t, i, n) {
			u({
				path: "/gt",
				type: "POST",
				contentType: "application/json",
				data: JSON.stringify(e),
				success: t,
				error: i,
				host: n,
				isLogin: 0
			})
		},
		setTicket: function (e) {
			MP.TICKET = e || ""
		},
		regMob: function (e, t, i, n) {
			u({
				path: "/mrg",
				type: "POST",
				contentType: "application/json",
				data: JSON.stringify(e),
				success: t,
				error: i,
				host: n,
				isLogin: 0
			})
		},
		fastReg: function (e, t, i, n) {
			u({
				path: "/frg",
				type: "POST",
				contentType: "application/json",
				data: JSON.stringify(e),
				success: t,
				error: i,
				host: n,
				isLogin: 0
			})
		},
		sendActMail: function (e, t, i, n) {
			u({
				path: "/sendActMail",
				type: "GET",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 0
			})
		},
		qrlogin: function (e, t, i, n) {
			u({
				path: "/qrcodel",
				type: "GET",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 1
			})
		},
		getCaptchaLogin: function (e, t, i) {
			var a = n;
			if (i)
				if (i.indexOf("icourse163.org") >= 0) a = "reg." + i + "/dl";
				else a = "passport." + i + "/dl";
			if (window._$needUrsBgp && window._$BGP) a = c(a);
			var u = window.PROTOCOL + a + "/cp?random=" + window.MpUtil.uniqueId();
			u = l(u);
			u = d(u);
			u = s(u);
			u = r(u);
			u = _(u);
			u = o(u);
			return u
		},
		safelogin: function (e, t, i, n) {
			u({
				path: "/l",
				type: "POST",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 1
			})
		},
		llp: function (e, t, i, n) {
			u({
				path: "/llp",
				type: "POST",
				contentType: "application/x-www-form-urlencoded",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 1
			})
		},
		sendSmsLogin: function (e, t, i, n) {
			u({
				path: "/sm",
				type: "GET",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 1
			})
		},
		initComponentLogin: function (e, t, i, n) {
			u({
				path: "/ini",
				type: "GET",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 1,
				isInit: 1
			})
		},
		checkSmsCode: function (e, t, i, n) {
			u({
				path: "/vfcp",
				type: "POST",
				contentType: "application/x-www-form-urlencoded",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 1
			})
		},
		vfsms: function (e, t, i, n) {
			return u({
				path: "/vfsms",
				type: "POST",
				contentType: "application/x-www-form-urlencoded",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 1
			})
		},
		getLoginTicket: function (e, t, i, n) {
			u({
				path: "/gt",
				type: "GET",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 1
			})
		},
		vftcp: function (e, t, i, n) {
			u({
				path: "/vftcp",
				type: "GET",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 1
			})
		},
		vfscp: function (e, t, i, n) {
			u({
				path: "/vfscp",
				type: "GET",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 1
			})
		},
		vfccp: function (e, t, i, n) {
			u({
				path: "/vfccp",
				type: "GET",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 1
			})
		},
		getPP: function (e, t, i, n) {
			u({
				path: "/pp",
				type: "GET",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 1
			})
		},
		vfppc: function (e, t, i, n) {
			u({
				path: "/vfppc",
				type: "POST",
				contentType: "application/x-www-form-urlencoded",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 1
			})
		},
		vfotp: function (e, t, i, n) {
			u({
				path: "/vfotp",
				type: "POST",
				contentType: "application/x-www-form-urlencoded",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 1
			})
		},
		mbsm: function (e, t, i, n) {
			u({
				path: "/mbsm",
				type: "GET",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 1
			})
		},
		vfmbsms: function (e, t, i, n) {
			return u({
				path: "/vfmbsms",
				type: "POST",
				contentType: "application/x-www-form-urlencoded",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 1
			})
		},
		goonlog: function (e, t, i, n) {
			u({
				path: "/go",
				type: "GET",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 1
			})
		},
		"mb-qrlogin": function (e, t, i, n) {
			u({
				path: "/qrcodel",
				type: "GET",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 1
			})
		},
		"mb-login": function (e, t, i, n) {
			u({
				path: "/lpwd",
				type: "POST",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 1
			})
		},
		"mb-gt": function (e, t, i, n) {
			return u({
				path: "/gt",
				type: "GET",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 1
			})
		},
		"mb-ini": function (e, t, i, n) {
			u({
				path: "/ini",
				type: "GET",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 1,
				isInit: 1
			})
		},
		"mb-vfcp": function (e, t, i, n) {
			u({
				path: "/vfcp",
				type: "POST",
				contentType: "application/x-www-form-urlencoded",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 1
			})
		},
		"mb-cp": function (e, t, i) {
			var a = n;
			if (i)
				if (i.indexOf("icourse163.org") >= 0) a = "reg." + i + "/dl";
				else a = "passport." + i + "/dl";
			if (window._$needUrsBgp && window._$BGP) a = c(a);
			var u = window.PROTOCOL + a + "/yd/cp?random=" + window.MpUtil.uniqueId();
			u = l(u);
			u = d(u);
			u = s(u);
			u = r(u);
			u = _(u);
			u = o(u);
			return u
		},
		"mb-lvfsms": function (e, t, i, n) {
			return u({
				path: "/lvfsms",
				type: "POST",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 1
			})
		},
		"mb-vftcp": function (e, t, i, n) {
			u({
				path: "/vftcp",
				type: "GET",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 1
			})
		},
		"mb-vfccp": function (e, t, i, n) {
			u({
				path: "/vfccp",
				type: "GET",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 1
			})
		},
		"mb-sms-lsm": function (e, t, i, n) {
			u({
				path: "/lsm",
				type: "GET",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 1
			})
		},
		"mb-reg-ini": function (e, t, i, n) {
			u({
				path: "/ini",
				type: "GET",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 0,
				isInit: 1
			})
		},
		"mb-reg-cp": function () {
			var t = window["$regCookieDomain"];
			var i = e;
			if (t)
				if (t.indexOf("icourse163.org") >= 0) i = "reg." + t + "/zc";
				else i = "passport." + t + "/zc";
			if (window._$needUrsBgp && window._$BGPZC) i = c(i);
			var n = window.REGPROTOCOL + i + "/yd/cp?channel=3&nocache=" + window.MpUtil.uniqueId();
			n = s(n);
			n = r(n);
			n = o(n);
			return n
		},
		"mb-reg-sm": function (e, t, i, n) {
			u({
				path: "/sm",
				type: "GET",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 0
			})
		},
		"mb-reg-vfsms": function (e, t, i, n) {
			return u({
				path: "/vfsms",
				type: "POST",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 0
			})
		},
		"mb-nini": function (e, t, i, n) {
			u({
				path: "/nini",
				type: "GET",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 1,
				isInit: 1
			})
		},
		"mb-nlregssms": function (e, t, i, n) {
			u({
				path: "/nlregssms",
				type: "GET",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 1
			})
		},
		"mb-nlgt": function (e, t, i, n) {
			return u({
				path: "/nlgt",
				type: "GET",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 1
			})
		},
		"mb-nlregvfsms": function (e, t, i, n) {
			return u({
				path: "/nlregvfsms",
				type: "POST",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 1
			})
		},
		"mb-ncp": function (e, t) {
			var i = n;
			if (t)
				if (t.indexOf("icourse163.org") >= 0) i = "reg." + t + "/dl";
				else i = "passport." + t + "/dl";
			if (window._$needUrsBgp && window._$BGP) i = c(i);
			var a = window.PROTOCOL + i + "/yd/ncp?pd=" + e.product + "&pkid=" + e.pkid + "&pkht=" + e.pkht + "&channel=" + e.channel + "&random=" + window.MpUtil.uniqueId();
			a = l(a);
			a = d(a);
			a = s(a);
			a = r(a);
			a = _(a);
			return a
		},
		"mb-nvfcp": function (e, t, i, n) {
			u({
				path: "/nvfcp",
				type: "POST",
				contentType: "application/x-www-form-urlencoded",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 1
			})
		},
		"mb-nvftcp": function (e, t, i, n) {
			u({
				path: "/nvftcp",
				type: "GET",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 1
			})
		},
		"mb-nvfccp": function (e, t, i, n) {
			u({
				path: "/nvfccp",
				type: "GET",
				data: e,
				success: t,
				error: i,
				host: n,
				isLogin: 1
			})
		}
	}
}();
if ("undefined" == typeof I$) I$ = function () {
	var e = {}, t = function () {
		return !1
	}, i = {};
	var n = function (t, i) {
		return e.toString.call(t) === "[object " + i + "]"
	};
	return function (e, s) {
		var a = i[e],
			r = n(s, "Function");
		if (null != s && !r) a = s;
		if (r && (null == a || a.__dt__ === !0)) {
			var o = [];
			for (var c = 2, d = arguments.length; c < d; c++) o.push(arguments.callee(arguments[c]));
			var _ = {};
			o.push.call(o, _, {}, t, []);
			var l = s.apply(null, o) || _;
			if (!a || !n(l, "Object")) a = l;
			else if (Object.keys)
				for (var u = Object.keys(l), c = 0, d = u.length, f; c < d; c++) {
					f = u[c];
					a[f] = l[f]
				} else
				for (var f in l) a[f] = l[f];
			if (null != a && a.__dt__ === !0) delete a.__dt__
		}
		if (null == a) a = {
			__dt__: !0
		};
		i[e] = a;
		return a
	}
}();
I$("017b426dd2bb4315fa45d567a1fd3718", function (e, t, i, n) {
	var s = Function.prototype;
	s._$aop = function (e, t) {
		var t = t || i,
			e = e || i,
			s = this;
		return function () {
			var i = {
				args: n.slice.call(arguments, 0)
			};
			e(i);
			if (!i.stopped) {
				i.value = s.apply(this, i.args);
				t(i)
			}
			return i.value
		}
	};
	s._$bind = function () {
		var e = arguments,
			t = arguments[0],
			i = this;
		return function () {
			var s = n.slice.call(e, 1);
			n.push.apply(s, arguments);
			return i.apply(t || null, s)
		}
	};
	s._$bind2 = function () {
		var e = arguments,
			t = n.shift.call(e),
			i = this;
		return function () {
			n.push.apply(arguments, e);
			return i.apply(t || null, arguments)
		}
	};
	var s = String.prototype;
	if (!s.trim) s.trim = function () {
		var e = /(?:^\s+)|(?:\s+$)/g;
		return function () {
			return this.replace(e, "")
		}
	}();
	if (!this.console) this.console = {
		log: i,
		error: i
	};
	if (!0) {
		NEJ = this.NEJ || {};
		NEJ.copy = function (e, i) {
			e = e || {};
			i = i || t;
			for (var n in i)
				if (i.hasOwnProperty(n)) e[n] = i[n];
			return e
		};
		NEJ = NEJ.copy(NEJ, {
			O: t,
			R: n,
			F: i,
			P: function (e) {
				if (!e || !e.length) return null;
				var t = window;
				for (var i = e.split("."), n = i.length, s = "window" == i[0] ? 1 : 0; s < n; t = t[i[s]] = t[i[s]] || {}, s++);
				return t
			}
		});
		return NEJ
	}
	return e
});
I$("a878c0216188111f46d39b9df767b354", function (e, t, i, n, s) {
	var a = this.navigator.platform,
		r = this.navigator.userAgent;
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
	for (var c in o) o[c] = new RegExp(c, "i").test(o[c]);
	o.ios = o.ipad || o.iphone || o.ipod;
	o.tablet = o.ipad;
	o.desktop = o.mac || o.win || o.linux && !o.android;
	t._$is = function (e) {
		return !!o[e]
	};
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
	if (/msie\s+(.*?);/i.test(r) || /trident\/.+rv:([\d\.]+)/i.test(r)) {
		d.engine = "trident";
		d.browser = "ie";
		d.version = RegExp.$1;
		d.prefix = {
			css: "ms",
			pro: "ms",
			clz: "MS",
			evt: "MS"
		};
		var _ = {
			6: "2.0",
			7: "3.0",
			8: "4.0",
			9: "5.0",
			10: "6.0",
			11: "7.0"
		};
		d.release = _[document.documentMode] || _[parseInt(d.version)]
	} else if (/webkit\/?([\d.]+?)(?=\s|$)/i.test(r)) {
		d.engine = "webkit";
		d.release = RegExp.$1 || "";
		d.prefix = {
			css: "webkit",
			pro: "webkit",
			clz: "WebKit"
		}
	} else if (/rv\:(.*?)\)\s+gecko\//i.test(r)) {
		d.engine = "gecko";
		d.release = RegExp.$1 || "";
		d.browser = "firefox";
		d.prefix = {
			css: "Moz",
			pro: "moz",
			clz: "Moz"
		};
		if (/firefox\/(.*?)(?=\s|$)/i.test(r)) d.version = RegExp.$1 || ""
	} else if (/presto\/(.*?)\s/i.test(r)) {
		d.engine = "presto";
		d.release = RegExp.$1 || "";
		d.browser = "opera";
		d.prefix = {
			css: "O",
			pro: "o",
			clz: "O"
		};
		if (/version\/(.*?)(?=\s|$)/i.test(r)) d.version = RegExp.$1 || ""
	}
	if ("unknow" == d.browser) {
		var _ = ["chrome", "maxthon", "safari"];
		for (var l = 0, u = _.length, f; l < u; l++) {
			f = "safari" == _[l] ? "version" : _[l];
			if (new RegExp(f + "/(.*?)(?=\\s|$)", "i").test(r)) {
				d.browser = _[l];
				d.version = RegExp.$1.trim();
				break
			}
		}
	}
	t._$SUPPORT = {};
	t._$support = function (e) {
		return !!t._$SUPPORT[e]
	};
	if (!0) e.copy(e.P("nej.p"), t);
	return t
}, "017b426dd2bb4315fa45d567a1fd3718");
I$("cb8d4f18701219d40dd544cd8b92c6b6", function (e, t, i, n) {
	e.__forIn = function (e, t, i) {
		if (!e || !t) return null;
		var n = Object.keys(e);
		for (var s = 0, a = n.length, r, o; s < a; s++) {
			r = n[s];
			o = t.call(i || null, e[r], r, e);
			if (o) return r
		}
		return null
	};
	e.__forEach = function (e, t, i) {
		e.forEach(t, i)
	};
	e.__col2array = function (e) {
		return n.slice.call(e, 0)
	};
	e.__str2time = function (e) {
		return Date.parse(e)
	};
	return e
});
I$("ccd88ad78fcab04c80ceaacee2b1c681", function (e, t, i, n, s, a) {
	if ("trident" === t._$KERNEL.engine && t._$KERNEL.release <= "4.0") I$("2d1f7c9d3671b1ae55a0fa6f39700413", function () {
		e.__forIn = function (e, t, i) {
			if (e && t) {
				var n;
				for (var s in e)
					if (e.hasOwnProperty(s)) {
						n = t.call(i, e[s], s, e);
						if (n) return s
					} else;
			}
		};
		e.__forEach = function (e, t, i) {
			for (var n = 0, s = e.length; n < s; n++) t.call(i, e[n], n, e)
		};
		e.__col2array = function (e) {
			var t = [];
			if (e && e.length)
				for (var i = 0, n = e.length; i < n; i++) t.push(e[i]);
			return t
		};
		e.__str2time = function () {
			var e = /-/g;
			return function (t) {
				return Date.parse(t.replace(e, "/").split(".")[0])
			}
		}()
	});
	return e
}, "cb8d4f18701219d40dd544cd8b92c6b6", "a878c0216188111f46d39b9df767b354");
I$("4600f25ee05ffacd81f2d44da00eaaa7", function (e, t, i, n, s, a) {
	i._$klass = function () {
		var e = function () {
			return "[object Function]" !== n.toString.call(arguments[0])
		};
		var i = function (e, i) {
			for (; i;) {
				var n = i.prototype,
					s = t.__forIn(n, function (t) {
						return e === t
					});
				if (null != s) return {
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
					if (s !== !1) t.__forIn(n, function (t, i) {
						if (!e(t)) a[i] = t
					});
					this._$super = n;
					var r = function () { };
					r.prototype = n.prototype;
					this.prototype = new r;
					this.prototype.constructor = this;
					var o = [],
						c = {};
					var d = function (e, t) {
						var n = i(e, t);
						if (n) {
							if (o[o.length - 1] != n.name) o.push(n.name);
							c[n.name] = n.klass._$super;
							return n.name
						}
					};
					this.prototype.__super = function () {
						var e = o[o.length - 1],
							t = arguments.callee.caller;
						if (!e) e = d(t, this.constructor);
						else {
							var i = c[e].prototype;
							if (!i.hasOwnProperty(t) || t != i[e]) e = d(t, this.constructor);
							else c[e] = c[e]._$super
						}
						var n = c[e].prototype[e].apply(this, arguments);
						if (e == o[o.length - 1]) {
							o.pop();
							delete c[e]
						}
						return n
					};
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
			};
			return n
		}
	}();
	if (!0) {
		e.C = i._$klass;
		e.copy(this.NEJ, e)
	}
	return i
}, "017b426dd2bb4315fa45d567a1fd3718", "ccd88ad78fcab04c80ceaacee2b1c681");
I$("8fd03edddb19cf8c294f56ca6638c475", function (e, t, i, n, s, a) {
	var r = function (e, t) {
		try {
			t = t.toLowerCase();
			if (null === e) return "null" == t;
			if (void 0 === e) return "undefined" == t;
			else return n.toString.call(e).toLowerCase() == "[object " + t + "]"
		} catch (i) {
			return !1
		}
	};
	i._$isFunction = function (e) {
		return r(e, "function")
	};
	i._$isString = function (e) {
		return r(e, "string")
	};
	i._$isNumber = function (e) {
		return r(e, "number")
	};
	i._$isBoolean = function (e) {
		return r(e, "boolean")
	};
	i._$isDate = function (e) {
		return r(e, "date")
	};
	i._$isArray = function (e) {
		return r(e, "array")
	};
	i._$isObject = function (e) {
		return r(e, "object")
	};
	i._$length = function () {
		var e = /[^\x00-\xff]/g;
		return function (t) {
			return ("" + (t || "")).replace(e, "**").length
		}
	}();
	i._$loop = function (e, n, s) {
		if (i._$isObject(e) && i._$isFunction(n)) return t.__forIn.apply(t, arguments);
		else return null
	};
	i._$indexOf = function (e, t) {
		var n = i._$isFunction(t) ? t : function (e) {
			return e === t
		}, s = i._$forIn(e, n);
		return null != s ? s : -1
	};
	i._$binSearch = function () {
		var e;
		var t = function (i, n, s) {
			if (n > s) return -1;
			var a = Math.ceil((n + s) / 2),
				r = e(i[a], a, i);
			if (0 == r) return a;
			if (r < 0) return t(i, n, a - 1);
			else return t(i, a + 1, s)
		};
		return function (i, n) {
			e = n || s;
			return t(i, 0, i.length - 1)
		}
	}();
	i._$reverseEach = function (e, t, n) {
		if (e && e.length && i._$isFunction(t))
			for (var s = e.length - 1; s >= 0; s--)
				if (t.call(n, e[s], s, e)) return s;
		return null
	};
	i._$forEach = function (e, n, s) {
		if (e && e.length && i._$isFunction(n))
			if (!e.forEach) i._$forIn.apply(i, arguments);
			else t.__forEach(e, n, s);
	};
	i._$forIn = function (e, t, n) {
		if (!e || !i._$isFunction(t)) return null;
		if (i._$isNumber(e.length)) {
			for (var s = 0, a = e.length; s < a; s++)
				if (t.call(n, e[s], s, e)) return s
		} else if (i._$isObject(e)) return i._$loop(e, t, n);
		return null
	};
	i._$encode = function (e, t) {
		t = "" + t;
		if (!e || !t) return t || "";
		else return t.replace(e.r, function (t) {
			var i = e[!e.i ? t.toLowerCase() : t];
			return null != i ? i : t
		})
	};
	i._$escape = function () {
		var e = /<br\/?>$/,
			t = {
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
		}, t = ["上午", "下午"],
			n = ["A.M.", "P.M."],
			s = ["日", "一", "二", "三", "四", "五", "六"],
			a = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],
			r = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
		var o = function (e) {
			e = parseInt(e) || 0;
			return (e < 10 ? "0" : "") + e
		};
		var c = function (e) {
			return e < 12 ? 0 : 1
		};
		return function (d, _, l) {
			if (!d || !_) return "";
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
			if (l) e.H = e.H % 12;
			return i._$encode(e, _)
		}
	}();
	i._$var2date = function (e) {
		var n = e;
		if (i._$isString(e)) n = new Date(t.__str2time(e));
		if (!i._$isDate(n)) n = new Date(e);
		return n
	};
	i._$fixed = function (e, t) {
		return parseFloat(new Number(e).toFixed(t))
	};
	i._$absolute = function () {
		var e = /([^\/:])\/.*$/,
			t = /\/[^\/]+$/,
			i = /[#\?]/,
			n = location.href.split(/[?#]/)[0],
			s = document.createElement("a");
		var a = function (e) {
			return (e || "").indexOf("://") > 0
		};
		var r = function (e) {
			return (e || "").split(i)[0].replace(t, "/")
		};
		var o = function (t, i) {
			if (0 == t.indexOf("/")) return i.replace(e, "$1") + t;
			else return r(i) + t
		};
		n = r(n);
		return function (e, t) {
			e = (e || "").trim();
			if (!a(t)) t = n;
			if (!e) return t;
			if (a(e)) return e;
			e = o(e, t);
			s.href = e;
			e = s.href;
			return a(e) ? e : s.getAttribute("href", 4)
		}
	}();
	i._$url2origin = function () {
		var e = /^([\w]+?:\/\/.*?(?=\/|$))/i;
		return function (t) {
			if (e.test(t || "")) return RegExp.$1.toLowerCase();
			else return ""
		}
	}();
	i._$string2object = function (e, t) {
		var n = {};
		i._$forEach((e || "").split(t), function (e) {
			var t = e.split("=");
			if (t && t.length) {
				var i = t.shift();
				if (i) n[decodeURIComponent(i)] = decodeURIComponent(t.join("="))
			}
		});
		return n
	};
	i._$object2string = function (e, t, n) {
		if (!e) return "";
		var s = [];
		i._$loop(e, function (e, t) {
			if (!i._$isFunction(e)) {
				if (i._$isDate(e)) e = e.getTime();
				else if (i._$isArray(e)) e = e.join(",");
				else if (i._$isObject(e)) e = JSON.stringify(e);
				if (n) e = encodeURIComponent(e);
				s.push(encodeURIComponent(t) + "=" + e)
			}
		});
		return s.join(t || ",")
	};
	i._$query2object = function (e) {
		return i._$string2object(e, "&")
	};
	i._$object2query = function (e) {
		return i._$object2string(e, "&", !0)
	};
	i._$object2array = function (e) {
		return t.__col2array(e)
	};
	i._$array2object = function (e, t) {
		var n = {};
		i._$forEach(e, function (e) {
			var i = e;
			if (t) i = t(e);
			if (null != i) n[i] = e
		});
		return n
	};
	i._$number2string = function (e, t) {
		var i = ("" + e).length,
			n = Math.max(1, parseInt(t) || 0),
			s = n - i;
		if (s > 0) e = new Array(s + 1).join("0") + e;
		return "" + e
	};
	i._$safeDelete = function (e, t) {
		if (!i._$isArray(t)) try {
			delete e[t]
		} catch (n) {
			e[t] = void 0
		} else i._$forEach(t, function (t) {
			i._$safeDelete(e, t)
		})
	};
	i._$randString = function () {
		var e = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
		return function (t) {
			t = t || 10;
			var i = [];
			for (var n = 0, s; n < t; ++n) {
				s = Math.floor(Math.random() * e.length);
				i.push(e.charAt(s))
			}
			return i.join("")
		}
	}();
	i._$randNumber = function (e, t) {
		return Math.floor(Math.random() * (t - e) + e)
	};
	i._$randNumberString = function (e) {
		e = Math.max(0, Math.min(e || 8, 30));
		var t = Math.pow(10, e - 1),
			n = 10 * t;
		return i._$randNumber(t, n).toString()
	};
	i._$uniqueID = function () {
		var e = +new Date;
		return function () {
			return "" + e++
		}
	}();
	i._$query = function (e, t) {
		e = e || n;
		var i = (t || "").split(".");
		for (var s = 0, a = i.length; s < a; s++) {
			e = e[i[s]];
			if (!e) break
		}
		return e
	};
	i._$merge = function () {
		var e = arguments.length - 1,
			t = arguments[e];
		if (i._$isFunction(t)) e -= 1;
		else t = s;
		var n = arguments[0] || {};
		for (var a = 1; a <= e; a++) i._$loop(arguments[a], function (e, i) {
			if (!t(e, i)) n[i] = e
		});
		return n
	};
	i._$fetch = function (e, t) {
		if (t) i._$loop(e, function (e, i, n) {
			var s = t[i];
			if (null != s) n[i] = s
		});
		return e
	};
	i._$hasProperty = function (e) {
		if (!e) return !1;
		if (null != e.length) return e.length > 0;
		var t = 0;
		i._$loop(e, function () {
			t++;
			return t > 0
		});
		return t > 0
	};
	if (!0) {
		e.Q = i._$query;
		e.X = i._$merge;
		e.EX = i._$fetch;
		e.copy(this.NEJ, e);
		e.copy(e.P("nej.u"), i)
	}
	return i
}, "017b426dd2bb4315fa45d567a1fd3718", "ccd88ad78fcab04c80ceaacee2b1c681");
I$("2dbc00a6d507b41f62491aabb3a16a1c", function (e, t, i, n, s, a) {
	var r = {};
	i.__url2host = function () {
		var e = /^([\w]+?:\/\/.*?(?=\/|$))/i;
		return function (t) {
			t = t || "";
			if (e.test(t)) return RegExp.$1;
			else return location.protocol + "//" + location.host
		}
	}();
	i.__set = function (e, t) {
		r[e] = t
	};
	i.__get = function (e) {
		return r[e]
	};
	var o = function () {
		var e = {
			portrait: {
				name: "portrait",
				dft: "portrait/"
			},
			"ajax.swf": {
				name: "ajax",
				dft: "nej_proxy_flash.swf"
			},
			"chart.swf": {
				name: "chart",
				dft: "nej_flex_chart.swf"
			},
			"audio.swf": {
				name: "audio",
				dft: "nej_player_audio.swf"
			},
			"video.swf": {
				name: "video",
				dft: "nej_player_video.swf"
			},
			"clipboard.swf": {
				name: "clipboard",
				dft: "nej_clipboard.swf"
			},
			"upload.image.swf": {
				name: "uploadimage",
				dft: "nej_upload_image.swf"
			}
		};
		var s = function (e) {
			var t = {};
			if (!e || !e.length) return t;
			for (var n = 0, s = e.length, a; n < s; n++) {
				a = e[n];
				if (a.indexOf("://") > 0) t[i.__url2host(a)] = a
			}
			return t
		};
		return function (a) {
			i.__set("root", a.root || "/res/");
			var r = i.__get("root");
			t._$loop(e, function (e, t, n) {
				i.__set(t, a[e.name] || r + e.dft)
			});
			var o = a.p_csrf;
			if (o === !0) o = {
				cookie: "AntiCSRF",
				param: "AntiCSRF"
			};
			o = o || n;
			i.__set("csrf", {
				param: o.param || "",
				cookie: o.cookie || ""
			});
			i.__set("frames", s(a.p_frame));
			i.__set("flashs", s(a.p_flash))
		}
	}();
	o(this.NEJ_CONF || n);
	return i
}, "017b426dd2bb4315fa45d567a1fd3718", "8fd03edddb19cf8c294f56ca6638c475");
I$("768f95ed04d3c5fbeb1fa8c0594bf442", function (e, t, i, n, s, a) {
	if ("trident" === t._$KERNEL.engine) I$("d884e1271ab628dbf685d6c0593321ae", function () {
		e.__set("storage.swf", (this.NEJ_CONF || n).storage || e.__get("root") + "nej_storage.swf")
	});
	if ("trident" === t._$KERNEL.engine && t._$KERNEL.release <= "3.0") I$("87a356ff1743730f7234ac005cb7e7d0", function () {
		e.__set("blank.png", (this.NEJ_CONF || n).blank || e.__get("root") + "nej_blank.gif")
	});
	return e
}, "2dbc00a6d507b41f62491aabb3a16a1c", "a878c0216188111f46d39b9df767b354");
I$("d8896d88a70151d93b32a59d4533d829", function (e, t, i, n, s, a) {
	i._$getFrameProxy = function (e) {
		var n = t.__url2host(e);
		return i._$get("frames")[n] || n + "/res/nej_proxy_frame.html"
	};
	i._$getFlashProxy = function (e) {
		return i._$get("flashs")[t.__url2host(e)]
	};
	i._$get = function (e) {
		return t.__get(e)
	};
	if (!0) e.copy(e.P("nej.c"), i);
	return i
}, "017b426dd2bb4315fa45d567a1fd3718", "768f95ed04d3c5fbeb1fa8c0594bf442");
I$("ab8abeca574cb254ef6aea89d6984f91", function (e, t, i, n, s, a) {
	var r = +new Date;
	i._$CODE_NOTFUND = 1e4 - r;
	i._$CODE_NOTASGN = 10001 - r;
	i._$CODE_NOTSPOT = 10002 - r;
	i._$CODE_TIMEOUT = 10003 - r;
	i._$CODE_ERREVAL = 10004 - r;
	i._$CODE_ERRCABK = 10005 - r;
	i._$CODE_ERRSERV = 10006 - r;
	i._$CODE_ERRABRT = 10007 - r;
	i._$HEAD_CT = "Content-Type";
	i._$HEAD_CT_PLAN = "text/plain";
	i._$HEAD_CT_FILE = "multipart/form-data";
	i._$HEAD_CT_FORM = "application/x-www-form-urlencoded";
	i._$BLANK_IMAGE = t._$get("blank.png") || "data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
	if (!0) e.copy(e.P("nej.g"), i);
	return i
}, "017b426dd2bb4315fa45d567a1fd3718", "d8896d88a70151d93b32a59d4533d829");
I$("703889c7eb7b7020f9b7e23d6c3a0b64", function (e, t) {
	var i = {};
	t._$merge = function (t) {
		e._$merge(i, t)
	};
	t._$dump = function () {
		return i
	};
	t._$clear = function () {
		i = {}
	};
	return t
}, "8fd03edddb19cf8c294f56ca6638c475");
I$("d3eb58adfc09fce24eaf1a6579b96488", function (e, t, i, n, s, a) {
	i.__checkEvent = function () {
		var e = {
			touchstart: "mousedown",
			touchmove: "mousemove",
			touchend: "mouseup"
		}, i = t._$KERNEL.prefix,
			n = {
				transitionend: "TransitionEnd",
				animationend: "AnimationEnd",
				animationstart: "AnimationStart",
				animationiteration: "AnimationIteration",
				visibilitychange: "visibilitychange"
			};
		var s = {
			enter: function (e, t, i) {
				var n = {
					type: "keypress"
				};
				if (i) n.handler = function (t) {
					if (13 === t.keyCode) i.call(e, t)
				};
				return n
			}
		};
		var a = function (e) {
			return (i.evt || i.pro) + e
		};
		return function (t, i, r) {
			var o = {
				type: i,
				handler: r
			};
			if (!("on" + i in t)) {
				var c = e[i];
				if (c) {
					o.type = c;
					return o
				}
				var c = n[i];
				if (c) {
					o.type = a(c);
					return o
				}
				var d = s[i];
				if (d) return d.apply(null, arguments)
			}
			return o
		}
	}();
	i.__addEvent = function () {
		var e = arguments;
		if (!1)
			if (!("on" + e[1] in e[0])) console.log("not support event[" + e[1] + "] for " + e[0]);
		e[0].addEventListener(e[1], e[2], e[3])
	};
	i.__delEvent = function () {
		var e = arguments;
		e[0].removeEventListener(e[1], e[2], e[3])
	};
	i.__dispatchEvent = function (t, i, n) {
		var s = document.createEvent("Event");
		s.initEvent(i, !0, !0);
		e._$merge(s, n);
		t.dispatchEvent(s)
	};
	return i
}, "8fd03edddb19cf8c294f56ca6638c475", "a878c0216188111f46d39b9df767b354");
I$("6e45193dd4812ec2c0ec80a02bb3e752", function (e, t, i, n, s, a, r) {
	if ("trident" === e._$KERNEL.engine && e._$KERNEL.release >= "6.0") I$("fdf357ec26d43deb8b3735ff94e326b5", function () {
		t.__checkEvent = function () {
			var e = {
				touchcancel: "MSPointerCancel",
				touchstart: "MSPointerDown",
				touchmove: "MSPointerMove",
				touchend: "MSPointerUp"
			};
			return t.__checkEvent._$aop(function (t) {
				var i = t.args;
				var n = e[i[1]];
				if (n) {
					t.stopped = !0;
					t.value = {
						type: n,
						handler: i[2]
					}
				}
			})
		}()
	});
	if ("trident" === e._$KERNEL.engine && "5.0" == e._$KERNEL.release) I$("8a5715212e5f142eda103d0d3cdc6952", function () {
		t.__checkEvent = function () {
			var e = {};
			var i = {
				input: function (t, i, n) {
					if (!n) return {
						type: i
					};
					else return {
						type: i,
						handler: function (i) {
							var s = t.id;
							e[s] = t.value;
							n.call(t, i)
						},
						link: [
							[document, "selectionchange",
								function (i) {
									var s = t.id;
									if (t == document.activeElement) {
										if (e[s] !== t.value) {
											e[s] = t.value;
											n.call(t, i)
										}
									} else delete e[s]
								}
							]
						]
					}
				}
			};
			return t.__checkEvent._$aop(function (e) {
				var t = e.args;
				var n = i[t[1]];
				if (n) {
					e.stopped = !0;
					e.value = n.apply(null, t)
				}
			})
		}()
	});
	if ("trident" === e._$KERNEL.engine && e._$KERNEL.release >= "5.0") I$("cf7ac45e345b8ae5919c02307a746c06", function () {
		var e = {
			propertychange: 1
		};
		t.__addEvent = t.__addEvent._$aop(function (t) {
			var i = t.args;
			if (null != e[i[1]] && i[0].attachEvent) {
				t.stopped = !0;
				i[0].attachEvent("on" + i[1], i[2])
			}
		});
		t.__delEvent = t.__delEvent._$aop(function (t) {
			var i = t.args,
				n = e[i[1]];
			if (null != e[i[1]] && i[0].detachEvent) {
				t.stopped = !0;
				i[0].detachEvent("on" + i[1], i[2])
			}
		})
	});
	if ("trident" === e._$KERNEL.engine && e._$KERNEL.release <= "4.0") I$("60058da94c6b9a5fc29eb6ea6b073933", function () {
		t.__checkEvent = function () {
			var e = {};
			var i = {
				input: function (t, i, n) {
					var s = {
						type: "propertychange"
					};
					if (n) {
						var a = t.id;
						var r = function (i) {
							if (t.value && !e["x-" + a]) {
								e["x-" + a] = !0;
								n.call(t, i)
							}
						};
						s.handler = function (i) {
							if ("value" in t && "value" == i.propertyName) {
								if (e[a]) return;
								e[a] = !0;
								n.call(t, i);
								delete e[a]
							}
						};
						s.link = [
							[t, "keyup", r],
							[t, "mouseup", r],
							[t, "mousemove", r]
						];
						s.destroy = function () {
							delete e[a];
							delete e["x-" + a]
						}
					}
					return s
				},
				load: function (e, t, i) {
					var n = {
						type: "readystatechange"
					};
					if (i) n.handler = function (t) {
						if ("loaded" == e.readyState || "complete" == e.readyState) i.call(e, t)
					};
					return n
				}
			};
			return t.__checkEvent._$aop(function (e) {
				var t = e.args;
				var n = i[t[1]];
				if (n) {
					e.stopped = !0;
					e.value = n.apply(null, t)
				}
				if (t[2]) t[2] = t[2]._$bind(t[0])
			})
		}();
		t.__addEvent = function () {
			var e = arguments;
			if (!1)
				if (!("on" + e[1] in e[0])) console.log("not support event[" + e[1] + "] for " + e[0]);
			e[0].attachEvent("on" + e[1], e[2])
		};
		t.__delEvent = function () {
			var e = arguments;
			e[0].detachEvent("on" + e[1], e[2])
		};
		t.__dispatchEvent = function () {
			var e = {
				propertychange: {
					propertyName: "value"
				}
			};
			return function (t, n, s) {
				var a = document.createEventObject();
				try {
					i._$merge(a, e[n], s);
					t.fireEvent("on" + n, a)
				} catch (r) {
					console.error(r.message);
					console.error(r.stack)
				}
			}
		}()
	});
	if ("gecko" === e._$KERNEL.engine) I$("32b3dc04600b092e7779a5c94ecbd572", function () {
		t.__checkEvent = function () {
			var e = /^(?:transitionend|animationend|animationstart|animationiteration)$/i;
			var i = {
				mousewheel: function (e, t, i) {
					var n = {
						type: "MozMousePixelScroll"
					};
					if (i) n.handler = function (t) {
						var n = t.detail;
						t.wheelDelta = -n;
						t.wheelDeltaY = -n;
						t.wheelDeltaX = 0;
						i.call(e, t)
					};
					return n
				}
			};
			return t.__checkEvent._$aop(function (t) {
				var n = t.args;
				if (e.test(n[1])) {
					t.stopped = !0;
					t.value = {
						type: n[1],
						handler: n[2]
					}
				}
				var s = i[n[1]];
				if (s) {
					t.stopped = !0;
					t.value = s.apply(null, n)
				}
			})
		}()
	});
	return t
}, "a878c0216188111f46d39b9df767b354", "d3eb58adfc09fce24eaf1a6579b96488", "8fd03edddb19cf8c294f56ca6638c475");
I$("a100971a16ec757a0282a3b2cc059019", function (e, t, i, n, s, a, r, o, c) {
	var d = {}, _ = {};
	var l = function () {
		var e = /[\s,;]+/;
		return function (t) {
			var t = (t || "").trim().toLowerCase();
			return !t ? null : t.split(e)
		}
	}();
	var u = function (e, i, n) {
		var s = "page" + i;
		return null != e[s] ? e[s] : e["client" + i] + t._$getPageBox()["scroll" + n]
	};
	var f = function (e, t, i) {
		var n = "scroll" + i;
		_node = a._$getElement(e), _xret = u(e, t, i);
		for (; _node && _node != document.body && _node != document.documentElement;) {
			_xret += _node[n] || 0;
			_node = _node.parentNode
		}
		return _xret
	};
	var h = function (e, n, s, a) {
		var r = {};
		e = t._$get(e);
		if (!e) return null;
		t._$id(e);
		r.element = e;
		if (!i._$isFunction(s)) return null;
		r.handler = s;
		var n = l(n);
		if (!n) return null;
		r.type = n;
		r.capture = !!a;
		return r
	};
	a._$addEvent = _._$addEvent = function () {
		var e = function (e, i, n) {
			var s = t._$id(i.element),
				a = d[s] || {}, r = a[e] || [];
			r.push({
				type: n.type || e,
				func: n.handler || i.handler,
				sfun: i.handler,
				capt: i.capture,
				link: n.link,
				destroy: n.destroy
			});
			a[e] = r;
			d[s] = a
		};
		return function () {
			var n = h.apply(null, arguments);
			if (n) i._$forEach(n.type, function (a) {
				var r = s.__checkEvent(n.element, a, n.handler);
				s.__addEvent(n.element, r.type, r.handler, n.capture);
				i._$forIn(r.link, function (e) {
					e[3] = !!e[3];
					s.__addEvent.apply(s, e);
					e[0] = t._$id(e[0])
				});
				e(a, n, r)
			})
		}
	}();
	a._$delEvent = _._$delEvent = function () {
		var e = function (e, n) {
			var s = t._$id(n.element),
				a = d[s] || r,
				o = a[e],
				c = i._$indexOf(o, function (e) {
					return e.sfun === n.handler && e.capt === n.capture
				});
			var _ = null;
			if (c >= 0) {
				var l = o.splice(c, 1)[0];
				_ = [
					[n.element, l.type, l.func, n.capture]
				];
				if (l.link) {
					i._$forEach(l.link, function (e) {
						e[0] = t._$get(e[0])
					});
					_.push.apply(_, l.link)
				}
				if (l.destroy) l.destroy();
				if (!o.length) delete a[e];
				if (!i._$hasProperty(a)) delete d[s]
			}
			return _
		};
		return function () {
			var t = h.apply(null, arguments);
			if (t) i._$forEach(t.type, function (n) {
				i._$forEach(e(n, t), function (e) {
					s.__delEvent.apply(s, e)
				})
			})
		}
	}();
	a._$clearEvent = _._$clearEvent = function () {
		var e = function (e, t, n) {
			i._$reverseEach(n, function (i) {
				a._$delEvent(e, t, i.sfun, i.capt)
			})
		};
		return function (n, s) {
			var r = t._$id(n);
			if (r) {
				var o = d[r];
				if (o) {
					s = l(s);
					if (s) i._$forEach(s, function (t) {
						e(r, t, o[t])
					});
					else i._$loop(o, function (e, t) {
						a._$clearEvent(n, t)
					})
				}
			}
		}
	}();
	a._$dispatchEvent = _._$dispatchEvent = function (e, n, a) {
		var e = t._$get(e);
		if (e) i._$forEach(l(n), function (t) {
			var i = s.__checkEvent(e, t);
			s.__dispatchEvent(e, i.type, a)
		})
	};
	a._$getElement = function () {
		var e;
		var n = function (i, n) {
			var s = i.split(":");
			if (s.length > 1) {
				if (!e) e = {
					a: t._$attr,
					d: t._$dataset,
					c: t._$hasClassName,
					t: function (e, t) {
						return (e.tagName || "").toLowerCase() === t
					}
				};
				var a = e[s[0]];
				if (a) return !!a(n, s[1]);
				i = s[1]
			}
			return !!t._$attr(n, i) || !!t._$dataset(n, i) || t._$hasClassName(n, i)
		};
		return function (e) {
			if (!e) return null;
			var t = e.target || e.srcElement,
				s = arguments[1];
			if (!s) return t;
			if (i._$isString(s)) s = n._$bind(null, s);
			if (i._$isFunction(s)) {
				for (; t;) {
					if (s(t)) return t;
					t = t.parentNode
				}
				return null
			}
			return t
		}
	}();
	a._$stop = function (e) {
		a._$stopBubble(e);
		a._$stopDefault(e)
	};
	a._$stopBubble = function (e) {
		if (e) e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0
	};
	a._$stopDefault = function (e) {
		if (e) e.preventDefault ? e.preventDefault() : e.returnValue = !1
	};
	a._$page = function (e) {
		return {
			x: a._$pageX(e),
			y: a._$pageY(e)
		}
	};
	a._$pageX = function (e) {
		return f(e, "X", "Left")
	};
	a._$pageY = function (e) {
		return f(e, "Y", "Top")
	};
	a._$clientX = function (e) {
		return u(e, "X", "Left")
	};
	a._$clientY = function (e) {
		return u(e, "Y", "Top")
	};
	n._$merge(_);
	if (!0) e.copy(e.P("nej.v"), a);
	return a
}, "017b426dd2bb4315fa45d567a1fd3718", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "8fd03edddb19cf8c294f56ca6638c475", "703889c7eb7b7020f9b7e23d6c3a0b64", "6e45193dd4812ec2c0ec80a02bb3e752");
I$("01e8a797a1d8f116c57c13304dff7150", function (e, t, i, n, s, a) {
	i.__getElementById = function (e, t) {
		if (e.getElementById) return e.getElementById("" + t);
		try {
			return e.querySelector("#" + t)
		} catch (i) {
			return null
		}
	};
	i.__getChildren = function (t) {
		return e._$object2array(t.children)
	};
	i.__getElementsByClassName = function (t, i) {
		return e._$object2array(t.getElementsByClassName(i))
	};
	i.__nextSibling = function (e) {
		return e.nextElementSibling
	};
	i.__previousSibling = function (e) {
		return e.previousElementSibling
	};
	i.__dataset = function (e, t, i) {
		e.dataset = e.dataset || {};
		if (void 0 !== i) e.dataset[t] = i;
		return e.dataset[t]
	};
	i.__getAttribute = function (e, t) {
		return e.getAttribute(t)
	};
	i.__serializeDOM2XML = function (e) {
		return (new XMLSerializer).serializeToString(e) || ""
	};
	i.__parseDOMFromXML = function (e) {
		var t = (new DOMParser).parseFromString(e, "text/xml").documentElement;
		return "parsererror" == t.nodeName ? null : t
	};
	i.__fullScreen = function () { };
	i.__mask = function () { };
	i.__unmask = function () { };
	var r = t._$SUPPORT,
		o = t._$KERNEL.prefix;
	i.__isMatchedName = function () {
		var e = /^([a-z]+?)[A-Z]/;
		return function (t, i) {
			return !!(i[t] || e.test(t) && i[RegExp.$1])
		}
	}();
	i.__isNeedPrefixed = function () {
		var t = e._$array2object(["animation", "transform", "transition", "appearance", "userSelect", "box", "flex", "column"]);
		return function (e) {
			return i.__isMatchedName(e, t)
		}
	}();
	i.__fmtStyleName = function () {
		var e = /-([a-z])/g;
		return function (t) {
			t = t || "";
			return t.replace(e, function (e, t) {
				return t.toUpperCase()
			})
		}
	}();
	i.__getStyleName = function () {
		var e = /^[a-z]/,
			t = o.css || "";
		return function (n) {
			n = i.__fmtStyleName(n);
			if (!i.__isNeedPrefixed(n)) return n;
			else return t + n.replace(e, function (e) {
				return e.toUpperCase()
			})
		}
	}();
	i.__getStyleValue = function (e, t) {
		var n = window.getComputedStyle(e, null);
		return n[i.__getStyleName(t)] || ""
	};
	i.__setStyleValue = function (e, t, n) {
		e.style[i.__getStyleName(t)] = n
	};
	i.__getCSSMatrix = function () {
		var t = /\((.*?)\)/,
			i = /\s*,\s*/,
			n = ["CSSMatrix", o.clz + "CSSMatrix"],
			s = ["m11", "m12", "m21", "m22", "m41", "m42"];
		var a = function (n) {
			var a = {};
			if (t.test(n || "")) e._$forEach(RegExp.$1.split(i), function (e, t) {
				a[s[t]] = e
			});
			return a
		};
		return function (t) {
			var i;
			e._$forIn(n, function (e) {
				if (this[e]) {
					i = new this[e](t || "");
					return !0
				}
			});
			return !i ? a(t) : i
		}
	}();
	i.__injectCSSText = function (e, t) {
		e.textContent = t
	};
	i.__processCSSText = function () {
		var t = /\$<(.*?)>/gi,
			s = /\{(.*?)\}/g,
			a = "-" + o.css.toLowerCase() + "-",
			c = {
				scale: "scale({x|1},{y|1})",
				rotate: "rotate({a})",
				translate: "translate({x},{y})",
				matrix: "matrix({m11},{m12},{m21},{m22},{m41},{m42})"
			}, d = {
				scale: "scale3d({x|1},{y|1},{z|1})",
				rotate: "rotate3d({x},{y},{z},{a})",
				translate: "translate3d({x},{y},{z})",
				matrix: "matrix3d({m11},{m12},{m13},{m14},{m21},{m22},{m23},{m24},{m31},{m32},{m33|1},{m34},{m41},{m42},{m43},{m44|1})"
			};
		var _ = function (e, t) {
			t = t || n;
			return e.replace(s, function (e, i) {
				var n = i.split("|");
				return t[n[0]] || n[1] || "0"
			})
		};
		i.__processTransformValue = function (e, t) {
			var i = (!r.css3d ? c : d)[e.trim()];
			if (i) return _(i, t);
			else return ""
		};
		return function (n) {
			if (!n.replace) return n;
			else return n.replace(t, function (t, n) {
				if ("vendor" === n) return a;
				var s = (n || "").split("|");
				return i.__processTransformValue(s[0], e._$query2object(s[1])) || t
			})
		}
	}();
	i.__appendCSSText = function (e, t) {
		var i = e.sheet,
			n = i.cssRules.length;
		i.insertRule(t, n);
		return i.cssRules[n]
	};
	i.__getClassList = function () {
		var e = /\s+/;
		return function (t) {
			t = (t || "").trim();
			return t ? t.split(e) : null
		}
	}();
	i.__processClassName = function (t, n, s) {
		if ("replace" != n) e._$forEach(i.__getClassList(s), function (e) {
			t.classList[n](e)
		});
		else {
			i.__processClassName(t, "remove", s);
			i.__processClassName(t, "add", arguments[3])
		}
	};
	i.__hasClassName = function (t, n) {
		var s = t.classList;
		if (!s || !s.length) return !1;
		else return e._$indexOf(i.__getClassList(n), function (e) {
			return s.contains(e)
		}) >= 0
	};
	! function () {
		if (!r.css3d) {
			var e = i.__getCSSMatrix();
			r.css3d = !!e && null != e.m41
		}
	}();
	return i
}, "8fd03edddb19cf8c294f56ca6638c475", "a878c0216188111f46d39b9df767b354");
I$("331dc65215bd207feab55e8d55f69da4", function (e, t, i, n, s, a, r) {
	if ("trident" === t._$KERNEL.engine) I$("4c40398b356e019371518506dc172989", function () {
		e.__getChildren = e.__getChildren._$aop(function (e) {
			var t = e.args[0];
			if (!t.children) {
				e.stopped = !0;
				var n = [];
				i._$forEach(t.childNodes, function (e) {
					if (1 == e.nodeType) n.push(e)
				});
				e.value = n
			}
		})
	});
	if ("trident" === t._$KERNEL.engine && t._$KERNEL.release <= "6.0") I$("25e721a27905bf8ad4bc5972cd9076f4", function () {
		e.__dataset = function () {
			var e = {}, t = "data-",
				n = /\-(.{1})/gi;
			var s = function (s) {
				var a = s.id;
				if (!e[a]) {
					var r = {};
					i._$forEach(s.attributes, function (e) {
						var i = e.nodeName;
						if (0 == i.indexOf(t)) {
							i = i.replace(t, "").replace(n, function (e, t) {
								return t.toUpperCase()
							});
							r[i] = e.nodeValue || ""
						}
					});
					e[a] = r
				}
			};
			return function (t, i, n) {
				s(t);
				var a = e[t.id];
				if (void 0 !== n) a[i] = n;
				return a[i]
			}
		}()
	});
	if ("trident" === t._$KERNEL.engine && t._$KERNEL.release <= "5.0") I$("bbff8d8fbd966c8363c594335f007bb2", function () {
		try {
			document.execCommand("BackgroundImageCache", !1, !0)
		} catch (t) { }
		e.__injectCSSText = function () {
			var t = 30;
			return e.__injectCSSText._$aop(function (e) {
				var i = e.args[0];
				if (i.styleSheet) {
					e.stopped = !0;
					var n = e.args[1];
					var s = document.styleSheets;
					if (s.length > t) {
						i = s[t];
						n = i.cssText + n
					} else i = i.styleSheet;
					i.cssText = n
				}
			})
		}();
		e.__getClassRegExp = function () {
			var e = /\s+/g;
			return function (t) {
				t = (t || "").trim().replace(e, "|");
				return !t ? null : new RegExp("(\\s|^)(?:" + t + ")(?=\\s|$)", "g")
			}
		}();
		e.__processClassName = function (t, i, n) {
			n = n || "";
			var s = t.className || "",
				a = e.__getClassRegExp(n + " " + (arguments[3] || ""));
			var r = s;
			if (a) r = r.replace(a, "");
			switch (i) {
				case "remove":
					n = "";
					break;
				case "replace":
					n = arguments[3] || ""
			}
			r = (r + " " + n).trim();
			if (s != r) t.className = r
		};
		e.__hasClassName = function (t, i) {
			var n = e.__getClassRegExp(i);
			if (n) return n.test(t.className || "");
			else return !1
		}
	});
	if ("trident" === t._$KERNEL.engine && t._$KERNEL.release <= "4.0") I$("2ecdcef17b15c95393eab69e61eda0bd", function () {
		e.__getElementsByClassName = function (e, t) {
			var n = [],
				s = new RegExp("(\\s|^)(?:" + t.replace(/\s+/g, "|") + ")(?=\\s|$)");
			i._$forEach(e.getElementsByTagName("*"), function (e) {
				if (s.test(e.className)) n.push(e)
			});
			return n
		};
		e.__nextSibling = function (e) {
			for (; e = e.nextSibling;)
				if (1 == e.nodeType) return e
		};
		e.__previousSibling = function (e) {
			for (; e = e.previousSibling;)
				if (1 == e.nodeType) return e
		};
		e.__serializeDOM2XML = function (e) {
			return "xml" in e ? e.xml : e.outerHTML
		};
		e.__parseDOMFromXML = function () {
			var e = ["Msxml2.DOMDocument.6.0", "Msxml2.DOMDocument.3.0"];
			var t = function () {
				try {
					for (var t = 0, i = e.length; t < i; t++) return new ActiveXObject(e[t])
				} catch (n) {
					return null
				}
			};
			return function (e) {
				var i = t();
				if (i && i.loadXML(e) && !i.parseError.errorCode) return i.documentElement;
				else return null
			}
		}();
		e.__getStyleValue = function () {
			var t = /opacity\s*=\s*([\d]+)/i;
			var i = {
				opacity: function (e) {
					var i = 0;
					if (t.test(e.filter || "")) i = parseFloat(RegExp.$1) / 100;
					return i
				}
			};
			return function (t, n) {
				var s = t.currentStyle,
					a = i[n];
				if (a) return a(s);
				else return s[e.__getStyleName(n)] || ""
			}
		}();
		e.__setStyleValue = function () {
			var t = {
				opacity: function (e, t) {
					e.style.filter = "alpha(opacity=" + 100 * t + ")"
				}
			};
			return function (i, n, s) {
				var a = t[n];
				if (a) a(i, s);
				else i.style[e.__getStyleName(n)] = s
			}
		}();
		e.__appendCSSText = function (e, t) {
			var i = e.styleSheet,
				n = i.rules.length,
				s = t.split(/[\{\}]/);
			i.addRule(s[0], s[1], n);
			return i.rules[n]
		}
	});
	if ("trident" === t._$KERNEL.engine && t._$KERNEL.release <= "3.0") I$("66613f9156fc8979ff6da15440dd226a", function () {
		e.__getAttribute = e.__getAttribute._$aop(null, function (e) {
			var t = e.args;
			if ("maxlength" == t[1] && 2147483647 == e.value) e.value = null
		})
	});
	if ("trident" === t._$KERNEL.engine && t._$KERNEL.release <= "2.0") I$("bac6864a689513243853964e4960bfb2", function () {
		e.__fullScreen = function (e, t) {
			var i = e.style;
			i.width = t.scrollWidth + "px";
			i.height = t.scrollHeight + "px"
		};
		e.__mask = function () {
			var t = {};
			e.__unmask = function (e) {
				var i = e.id,
					n = t[i];
				if (n) {
					delete t[i];
					n.parentNode.removeChild(n)
				}
			};
			return function (e) {
				var i = e.id,
					n = t[i];
				if (!n) {
					n = document.createElement("iframe");
					n.style.position = "absolute";
					t[i] = n
				}
				var s = n.style,
					a = e.style;
				s.top = (parseInt(a.top) || 0) + "px";
				s.left = (parseInt(a.left) || 0) + "px";
				s.width = e.offsetWidth + "px";
				s.height = e.offsetHeight + "px";
				e.insertAdjacentElement("beforeBegin", n);
				return n
			}
		}()
	});
	if ("gecko" === t._$KERNEL.engine) I$("414ac2152be76971e88f4d366ea48dc6", function () {
		if (!t._$SUPPORT.css3d) t._$SUPPORT.css3d = "MozPerspective" in document.body.style;
		if (!("insertAdjacentElement" in document.body)) HTMLElement.prototype.insertAdjacentElement = function (e, t) {
			if (e && t) switch (e) {
				case "beforeEnd":
					this.appendChild(t);
					return;
				case "beforeBegin":
					this.parentNode.insertBefore(t, this);
					return;
				case "afterBegin":
					!this.firstChild ? this.appendChild(t) : this.insertBefore(t, this.firstChild);
					return;
				case "afterEnd":
					!this.nextSibling ? this.parentNode.appendChild(t) : this.parentNode.insertBefore(t, this.nextSibling);
					return
			}
		};
		if (!("innerText" in document.body)) {
			HTMLElement.prototype["__defineGetter__"]("innerText", function () {
				return this.textContent
			});
			HTMLElement.prototype["__defineSetter__"]("innerText", function (e) {
				this.textContent = e
			})
		}
	});
	return e
}, "01e8a797a1d8f116c57c13304dff7150", "a878c0216188111f46d39b9df767b354", "8fd03edddb19cf8c294f56ca6638c475");
I$("1c92dd86f4b11b13a0c8a0c0f91b27e9", function (e, t, i, n, s, a, r, o, c, d) {
	var _ = {}, l, u = {}, f = {}, h = document.createDocumentFragment();
	if (!document.head) document.head = document.getElementsByTagName("head")[0] || document.body;
	r.dump = function () {
		return {
			pool: u,
			dirty: f,
			fragment: h
		}
	};
	r._$id = _._$id = function (e) {
		e = r._$get(e);
		if (e) {
			var t = e.id ? e.id : "auto-id-" + i._$uniqueID();
			if (!("id" in e)) u[t] = e;
			e.id = t;
			if (!r._$get(t)) f[t] = e;
			return t
		}
	};
	r._$get = function (e) {
		var t = u["" + e];
		if (t) return t;
		if (!i._$isString(e) && !i._$isNumber(e)) return e;
		var t = document.getElementById(e);
		if (!t) t = a.__getElementById(h, e);
		if (t) delete f[e];
		return t || f[e]
	};
	r._$getChildren = _._$getChildren = function (e, t) {
		e = r._$get(e);
		if (!e) return null;
		var n = a.__getChildren(e);
		if (t) i._$reverseEach(n, function (e, i, n) {
			if (!r._$hasClassName(e, t)) n.splice(i, 1)
		});
		return n
	};
	r._$getByClassName = _._$getByClassName = function (e, t) {
		e = r._$get(e);
		return !e ? null : a.__getElementsByClassName(e, t.trim())
	};
	r._$getSibling = _._$getSibling = function () {
		var e = function () {
			return !0
		};
		return function (t, n) {
			t = r._$get(t);
			if (!t) return null;
			var s = {
				backward: !1,
				filter: e
			};
			if (i._$isFunction(n)) s.filter = n;
			else s = i._$fetch(s, n);
			var o = s.backward ? a.__previousSibling : a.__nextSibling;
			for (;
				(t = o(t)) && !s.filter(t););
			return t
		}
	}();
	r._$getScrollViewPort = function (e) {
		e = r._$get(e);
		if (e) {
			e = e.parentNode;
			for (; e && !(e.scrollHeight > e.clientHeight);) e = e.parentNode;
			if (e) return e
		}
		var t = document.body.scrollHeight,
			i = document.documentElement.scrollHeight;
		return i >= t ? document.documentElement : document.body
	};
	r._$getPageBox = function () {
		var e = function (e) {
			var t = 0;
			i._$forEach(e, function (e) {
				if (e)
					if (!t) t = e;
					else t = Math.min(t, e)
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
			var n = {}, s = e || document,
				a = s.body,
				r = s.documentElement;
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
		var n = i._$merge({}, e),
			s = t.width / t.height,
			a = e.width / e.height;
		if (s > a && e.height > t.height) {
			n.height = t.height;
			n.width = n.height * a
		}
		if (s < a && e.width > t.width) {
			n.width = t.width;
			n.height = n.width / a
		}
		return n
	};
	r._$scrollTo = _._$scrollTo = function (e) {
		var t = r._$offset(e);
		window.scrollTo(t.x, t.y)
	};
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
			var a = {}, r = (s || "").split(e),
				o = t[r[1]] || t.middle,
				c = t[r[0]] || t.center;
			a.top = o(i, n);
			a.left = c(i, n);
			return a
		}
	}();
	r._$offset = _._$offset = function () {
		var e = function (e) {
			return e == document.body || e == document.documentElement
		};
		return function (t, i) {
			t = r._$get(t);
			if (!t) return null;
			i = r._$get(i) || null;
			var n = t,
				s = {
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
		if (e) a.__fullScreen(e, r._$getPageBox())
	};
	r._$mask = _._$mask = function (e) {
		e = r._$get(e);
		if (e) {
			r._$id(e);
			return a.__mask(e)
		}
		return null
	};
	r._$unmask = _._$unmask = function (e) {
		e = r._$get(e);
		if (e) {
			r._$id(e);
			return a.__unmask(e)
		}
		return null
	};
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
			var a = document.createElement(t),
				o = e[t.toLowerCase()];
			i._$merge(a, o);
			if (n) a.className = n;
			s = r._$get(s);
			if (s) s.appendChild(a);
			else if (!o) h.appendChild(a);
			return a
		}
	}();
	r._$createXFrame = function () {
		var e = function () {
			if (location.hostname == document.domain) return "about:blank";
			else return 'javascript:(function(){document.open();document.domain="' + document.domain + '";document.close();})();'
		};
		var t = function (e) {
			e = e.trim();
			if (!e) return r._$create("iframe");
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
			if (!s.visible) a.style.display = "none";
			if (i._$isFunction(s.onload)) n._$addEvent(a, "load", function (e) {
				if (a.src) {
					n._$clearEvent(a, "load");
					s.onload(e)
				}
			});
			var c = s.parent;
			if (i._$isFunction(c)) try {
				c(a)
			} catch (d) { } else (r._$get(c) || document.body).appendChild(a);
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
				if (t.getElementsByTagName) i._$forEach(t.getElementsByTagName(n), s)
			} else {
				var a = (t.tagName || "").toLowerCase(),
					r = e[a];
				if (r) r(t)
			}
		};
		return function (e) {
			e = r._$get(e);
			if (e) {
				if (!arguments[1]) n._$clearEvent(e);
				s(e);
				s(e, "img");
				s(e, "iframe");
				if (e.parentNode) e.parentNode.removeChild(e)
			}
		}
	}();
	r._$removeByEC = _._$removeByEC = function (e) {
		e = r._$get(e);
		if (e) try {
			h.appendChild(e)
		} catch (t) {
			console.error(t)
		}
	};
	r._$clearChildren = _._$clearChildren = function (e) {
		e = r._$get(e);
		if (e) i._$reverseEach(e.childNodes, function (e) {
			r._$remove(e)
		})
	};
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
			if (!n) return null;
			i();
			s = s || o;
			var a = n.parentNode;
			if (!r._$hasClassName(a, e)) {
				a = r._$create("span", e);
				n.insertAdjacentElement("beforeBegin", a);
				a.appendChild(n)
			}
			var c = s.nid || "",
				d = r._$getByClassName(a, c || e + "-show")[0];
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
		if (!s) return null;
		if (i._$isString(t)) return a.__dataset(r._$get(e), t, n);
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
	};
	r._$attr = _._$attr = function (e, t, i) {
		e = r._$get(e);
		if (!e) return "";
		if (void 0 !== i && e.setAttribute) e.setAttribute(t, i);
		return a.__getAttribute(e, t)
	};
	r._$html2node = function () {
		var e = /<(.*?)(?=\s|>)/i,
			t = {
				li: "ul",
				tr: "tbody",
				td: "tr",
				th: "tr",
				option: "select"
			};
		return function (i) {
			var n;
			if (e.test(i)) n = t[(RegExp.$1 || "").toLowerCase()] || "";
			var s = r._$create(n || "div");
			s.innerHTML = i;
			var a = r._$getChildren(s);
			return a.length > 1 ? s : a[0]
		}
	}();
	r._$dom2xml = _._$dom2xml = function (e) {
		e = r._$get(e);
		return !e ? "" : a.__serializeDOM2XML(e)
	};
	r._$xml2dom = function (e) {
		e = (e || "").trim();
		return !e ? null : a.__parseDOMFromXML(e)
	};
	r._$dom2object = _._$dom2object = function (e, t) {
		t = t || {};
		e = r._$get(e);
		if (!e) return t;
		var n = e.tagName.toLowerCase(),
			s = r._$getChildren(e);
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
	};
	r._$xml2object = function (e) {
		try {
			return r._$dom2object(r._$xml2dom(e))
		} catch (t) {
			return null
		}
	};
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
		if (e) i._$loop(t, function (t, i) {
			r._$setStyle(e, i, t)
		})
	};
	r._$setStyle = _._$setStyle = function (e, t, i) {
		e = r._$get(e);
		if (e) a.__setStyleValue(e, t, a.__processCSSText(i))
	};
	r._$getStyle = _._$getStyle = function (e, t) {
		e = r._$get(e);
		return !e ? "" : a.__getStyleValue(e, t)
	};
	r._$addScript = function (e) {
		try {
			e = e.trim();
			if (e) return new Function(e)()
		} catch (t) {
			console.error(t.message);
			console.error(t.stack)
		}
	};
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
		var e = /#<(.*?)>/g,
			t = +new Date;
		return function (t, n) {
			if (!l) l = [];
			var s = "auto-" + i._$uniqueID(),
				a = i._$merge({
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
	};
	r._$appendCSSText = _._$appendCSSText = function (e, t) {
		e = r._$get(e);
		return !e ? null : a.__appendCSSText(e, a.__processCSSText(t))
	};
	r._$addClassName = _._$addClassName = function (e, t) {
		e = r._$get(e);
		if (e) a.__processClassName(e, "add", t)
	};
	r._$delClassName = _._$delClassName = function (e, t) {
		e = r._$get(e);
		if (e) a.__processClassName(e, "remove", t)
	};
	r._$replaceClassName = _._$replaceClassName = function (e, t, i) {
		e = r._$get(e);
		if (e) a.__processClassName(e, "replace", t, i)
	};
	r._$hasClassName = _._$hasClassName = function (e, t) {
		e = r._$get(e);
		if (e) return a.__hasClassName(e, t);
		else return !1
	};
	r._$matrix = function (e) {
		e = (e || "").trim();
		return a.__getCSSMatrix(e)
	};
	r._$css3d = _._$css3d = function (e, t, i) {
		e = r._$get(e);
		if (e) {
			var n = a.__processTransformValue(t, i);
			if (n) r._$setStyle(e, "transform", n)
		}
	};
	s._$merge(_);
	if (!0) e.copy(e.P("nej.e"), r);
	return r
}, "017b426dd2bb4315fa45d567a1fd3718", "ab8abeca574cb254ef6aea89d6984f91", "8fd03edddb19cf8c294f56ca6638c475", "a100971a16ec757a0282a3b2cc059019", "703889c7eb7b7020f9b7e23d6c3a0b64", "331dc65215bd207feab55e8d55f69da4");
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
	};
	s._$$EventTarget._$recycle = function () {
		var e = function (e, t, i) {
			e._$recycle();
			i.splice(t, 1)
		};
		return function (t) {
			if (!t) return null;
			if (!n._$isArray(t)) {
				if (!(t instanceof this)) {
					var i = t.constructor;
					if (i._$recycle) i._$recycle(t);
					return null
				}
				if (t == this.__instance) delete this.__instance;
				if (t == this.__inctanse) delete this.__inctanse;
				t.__destroy();
				if (!this.__pool) this.__pool = [];
				if (n._$indexOf(this.__pool, t) < 0) this.__pool.push(t);
				return null
			}
			n._$reverseEach(t, e, this)
		}
	}();
	s._$$EventTarget._$getInstance = function (e) {
		if (!this.__instance) this.__instance = this._$allocate(e);
		return this.__instance
	};
	s._$$EventTarget._$getInstanceWithReset = function (e, t) {
		if (t && this.__inctanse) {
			this.__inctanse._$recycle();
			delete this.__inctanse
		}
		if (!this.__inctanse) this.__inctanse = this._$allocate(e);
		else this.__inctanse.__reset(e);
		return this.__inctanse
	};
	c.__init = function () {
		this.__events = {};
		this.__events_dom = {};
		this.id = n._$uniqueID()
	};
	c.__reset = function (e) {
		this._$batEvent(e)
	};
	c.__destroy = function () {
		this._$clearEvent();
		this.__doClearDomEvent()
	};
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
	};
	c._$recycle = function () {
		this.constructor._$recycle(this)
	};
	c._$hasEvent = function (e) {
		var e = (e || "").toLowerCase(),
			t = this.__events[e];
		return !!t && t !== r
	};
	c._$delEvent = function (e, t) {
		var e = (e || "").toLowerCase(),
			i = this.__events[e];
		if (n._$isArray(i)) {
			n._$reverseEach(i, function (e, i, n) {
				if (e == t) n.splice(i, 1)
			});
			if (!i.length) delete this.__events[e]
		} else if (i == t) delete this.__events[e]
	};
	c._$setEvent = function (e, t) {
		if (e && n._$isFunction(t)) this.__events[e.toLowerCase()] = t
	};
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
			if (t) delete this.__events[t];
			else n._$loop(this.__events, e, this)
		}
	}();
	c._$addEvent = function (e, t) {
		if (e && n._$isFunction(t)) {
			e = e.toLowerCase();
			var i = this.__events[e];
			if (i) {
				if (!n._$isArray(i)) this.__events[e] = [i];
				this.__events[e].push(t)
			} else this.__events[e] = t
		}
	};
	c._$dispatchEvent = function (e) {
		var e = (e || "").toLowerCase(),
			t = this.__events[e];
		if (t) {
			var i = o.slice.call(arguments, 1);
			if (n._$isArray(t)) n._$forEach(t, function (e) {
				if (!1) e.apply(this, i);
				else try {
					e.apply(this, i)
				} catch (t) {
					console.error(t.message);
					console.error(t.stack)
				}
			}, this);
			else t.apply(this, i)
		}
	};
	if (!0) {
		s._$$Event = s._$$EventTarget;
		e.copy(e.P("nej.ut"), s)
	}
	return s
}, "017b426dd2bb4315fa45d567a1fd3718", "4600f25ee05ffacd81f2d44da00eaaa7", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475");
! function () {
	if ("undefined" == typeof TrimPath) {
		TrimPath = {};
		if ("undefined" != typeof exports) TrimPath = exports
	}
	var e = {}, t = [],
		i = /\s+/g,
		n = +new Date,
		s, a, r;
	var o = function () {
		var e = /^\s*[\[\{'"].*?[\]\}'"]\s*$/,
			t = /[\&\|\<\>\+\-\*\/\%\,\(\)\[\]\?\:\!\=\;]/,
			i = /^(?:defined|null|undefined|true|false|instanceof|new|this|typeof|\$v|[\d]+)$/i,
			n = /^new\s+/,
			s = /['"]/;
		var a = function (t) {
			if (!e.test(t)) {
				t = t.split(".")[0].trim();
				if (t && !s.test(t)) {
					t = t.replace(n, "");
					try {
						if (i.test(t)) return;
						r[t] = 1
					} catch (a) { }
				}
			}
		};
		return function (i) {
			i = i || "";
			if (i && !e.test(i)) {
				var n = i.split(t);
				for (var s = 0, r = n.length; s < r; s++) a(n[s])
			}
		}
	}();
	var c = function (e) {
		if ("in" != e[2]) throw "bad for loop statement: " + e.join(" ");
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
		if ("as" != e[2]) throw "bad for list loop statement: " + e.join(" ");
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
		if (!e[1]) throw "bad include statement: " + e.join(" ");
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
			var s = t.slice(1, -1).split(i),
				r = a.def[s[0]];
			if (r) {
				if (r.pmin && r.pmin >= s.length) throw "Statement needs more parameters:" + t;
				n.push(r.pfix && "string" != typeof r.pfix ? r.pfix(s) : r.pfix || "");
				if (r.sfix) {
					if (s.length <= 1) {
						if (r.pdft) n.push(r.pdft)
					} else
						for (var o = 1, c = s.length; o < c; o++) {
							if (o > 1) n.push(" ");
							n.push(s[o])
						}
					n.push(r.sfix)
				}
			} else $(t, n)
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
						if (!r) continue
					}
					y(r, t);
					if (s && n < a - 1) t.push("__OUT.push('\\n');")
				}
		}
	};
	var y = function () {
		var e = /\|\|/g,
			t = /#@@#/g;
		return function (i, n) {
			var s = "}",
				a = -1,
				r = i.length,
				o, c, d, _, l;
			for (; a + s.length < r;) {
				o = "${";
				c = "}";
				d = i.indexOf(o, a + s.length);
				if (d < 0) break;
				if ("%" == i.charAt(d + 2)) {
					o = "${%";
					c = "%}"
				}
				_ = i.indexOf(c, d + o.length);
				if (_ < 0) break;
				C(i.substring(a + s.length, d), n);
				l = i.substring(d + o.length, _).replace(e, "#@@#").split("|");
				for (var u = 0, f = l.length; u < f; l[u] = l[u].replace(t, "||"), u++);
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
			if (e) i.push("__OUT.push('" + t(e) + "');")
		}
	}();
	var w = function () {
		var e = /\t/g,
			t = /\n/g,
			n = /\r\n?/g;
		var s = function (e, t) {
			var i = e.indexOf("}", t + 1);
			for (;
				"\\" == e.charAt(i - 1);) i = e.indexOf("}", i + 1);
			return i
		};
		var o = function () {
			var e = [],
				t = arguments[0];
			for (var i in t) {
				i = (i || "").trim();
				if (i) e.push(i + "=$v('" + i + "')");
				else;
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
			var _ = -1,
				l = c.length;
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
										if (y) d.push("__OUT.push((function(){" + y + "})());")
								}
								u = _ = m + v.length - 1
							}
						}
					} else if ("$" != c.charAt(u - 1) && "\\" != c.charAt(u - 1) && 0 == h.substr("/" == h.charAt(1) ? 2 : 1).search(a.tag)) break;
					u = c.indexOf("{", u + 1)
				}
				if (u < 0) break;
				f = s(c, u);
				if (f < 0) break;
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
	};
	TrimPath.merge = function () {
		var t = {};
		TrimPath.dump = function () {
			return {
				func: t,
				text: e
			}
		};
		return function (i, n, s) {
			try {
				n = n || {};
				if (!t[i] && !e[i]) return "";
				if (!t[i]) {
					t[i] = w(e[i]);
					delete e[i]
				}
				if (s)
					for (var r in a.ext)
						if (!s[r]) s[r] = a.ext[r];
				return t[i](n, s || a.ext)
			} catch (o) {
				return o.message || ""
			}
		}
	}();
	TrimPath.parse = function () {
		var t = +new Date;
		return function (i, n) {
			if (!i) return "";
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
I$("bff3d86ec4ea91399919ee4963badfeb", function (e, t, i, n, s, a, r, o, c) {
	var d = {};
	a._$seed = TrimPath.seed;
	a._$get = function () {
		var e = function (e) {
			return !a._$getTextTemplate ? "" : a._$getTextTemplate(e)
		};
		return function (i, n, s) {
			n = n || {};
			n.inline = e;
			s = t._$merge({}, d, s);
			s.rand = t._$uniqueID;
			s.format = t._$format;
			s.escape = t._$escape;
			s.inline = e;
			return TrimPath.merge(i, n, s)
		}
	}();
	a._$add = function (e, t) {
		if (!e) return "";
		var n, s = i._$get(e);
		if (s) {
			n = s.id;
			e = s.value || s.innerText;
			if (!t) i._$remove(s)
		}
		return TrimPath.parse(e, n)
	};
	a._$addTemplate = function (e, t) {
		return TrimPath.parse(e, t)
	};
	a._$render = function (e, t, n, s) {
		e = i._$get(e);
		if (e) e.innerHTML = a._$get(t, n, s)
	};
	a._$extend = function (e) {
		t._$merge(d, e)
	};
	n._$merge({
		_$render: a._$render
	});
	if (!0) {
		var _ = e.P("nej.e");
		_._$addHtmlTemplate = a._$add;
		_._$getHtmlTemplate = a._$get;
		_._$getHtmlTemplateSeed = a._$seed;
		_._$renderHtmlTemplate = a._$render;
		_._$registJSTExt = a._$extend
	}
	return a
}, "017b426dd2bb4315fa45d567a1fd3718", "8fd03edddb19cf8c294f56ca6638c475", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "703889c7eb7b7020f9b7e23d6c3a0b64", "182393ceff60d0a962e9f4d9798ef86a");
I$("383b6571ddec98d00d11a1634708517f", function (e, t, i, n, s, a, r, o, c, d) {
	var _;
	r._$$CustomEvent = t._$klass();
	_ = r._$$CustomEvent._$extend(a._$$EventTarget);
	_.__init = function () {
		this.__cache = {};
		this.__super()
	};
	_.__reset = function (e) {
		this.__super(e);
		this.__element = i._$get(e.element) || window;
		this.__doEventInit(e.event);
		this.__doEventAPIEnhance();
		this._$dispatchEvent("oninit")
	};
	_.__destroy = function () {
		var e = function (e, t, i) {
			if (!s._$isArray(e)) s._$safeDelete(this.__element, t);
			delete i[t]
		};
		return function () {
			this.__super();
			s._$loop(this.__cache, e, this);
			delete this.__element
		}
	}();
	_.__isDelegate = function (e, t) {
		e = i._$get(e);
		return !(e !== this.__element || t && !this.__cache["on" + t])
	};
	_.__doEventInit = function (e) {
		if (!s._$isString(e)) {
			if (s._$isArray(e)) s._$forEach(e, this.__doEventInit, this)
		} else {
			var t = "on" + e;
			if (!this.__cache[t]) this.__cache[t] = this.__doEventDispatch._$bind(this, e);
			this.__doEventBind(e)
		}
	};
	_.__doEventBind = function (e) {
		var t = "on" + e,
			i = this.__element[t],
			n = this.__cache[t];
		if (i != n) {
			this.__doEventDelete(e);
			if (i && i != c) this.__doEventAdd(e, i);
			this.__element[t] = n
		}
	};
	_.__doEventAdd = function (e, t, i) {
		var n = this.__cache[e];
		if (!n) {
			n = [];
			this.__cache[e] = n
		}
		if (s._$isFunction(t)) !i ? n.push(t) : n.unshift(t)
	};
	_.__doEventDelete = function (e, t) {
		var i = this.__cache[e];
		if (i && i.length)
			if (t) s._$reverseEach(i, function (e, i, n) {
				if (t === e) {
					n.splice(i, 1);
					return !0
				}
			});
			else delete this.__cache[e]
	};
	_.__doEventDispatch = function (e, t) {
		t = t || {
			noargs: !0
		};
		if (t == o) t = {};
		t.type = e;
		this._$dispatchEvent("ondispatch", t);
		if (!t.stopped) s._$forEach(this.__cache[e], function (e) {
			if (!1) e(t);
			else try {
				e(t)
			} catch (i) {
				console.error(i.message);
				console.error(i.stack)
			}
		})
	};
	_.__doEventAPIEnhance = function () {
		var t = function (e) {
			var t = e.args,
				i = t[1].toLowerCase();
			if (this.__isDelegate(t[0], i)) {
				e.stopped = !0;
				this.__doEventBind(i);
				this.__doEventAdd(i, t[2], t[3]);
				this._$dispatchEvent("oneventadd", {
					type: i,
					listener: t[2]
				})
			}
		};
		var i = function (e) {
			var t = e.args,
				i = t[1].toLowerCase();
			if (this.__isDelegate(t[0], i)) {
				e.stopped = !0;
				this.__doEventDelete(i, t[2])
			}
		};
		var a = function (e) {
			var t = e.args,
				i = (t[1] || "").toLowerCase();
			if (this.__isDelegate(t[0])) {
				if (i) {
					this.__doEventDelete(i);
					return
				}
				s._$loop(this.__cache, function (e, t) {
					if (s._$isArray(e)) this.__doEventDelete(t)
				}, this)
			}
		};
		var r = function (e) {
			var t = e.args,
				i = t[1].toLowerCase();
			if (this.__isDelegate(t[0], i)) {
				e.stopped = !0;
				t[0]["on" + i].apply(t[0], t.slice(2))
			}
		};
		return function () {
			if (!this.__enhanced) {
				this.__enhanced = !0;
				n._$addEvent = n._$addEvent._$aop(t._$bind(this));
				n._$delEvent = n._$delEvent._$aop(i._$bind(this));
				n._$clearEvent = n._$clearEvent._$aop(a._$bind(this));
				n._$dispatchEvent = n._$dispatchEvent._$aop(r._$bind(this));
				if (!0) e.copy(e.P("nej.v"), n)
			}
		}
	}();
	if (!0) e.copy(e.P("nej.ut"), r);
	return r
}, "017b426dd2bb4315fa45d567a1fd3718", "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "e0793c838b68fed5a7e1742035643bec");
I$("da26cfd4acda6a50e5f2f0cfde754788", function (e, t, i, n, s, a, r, o, c, d) {
	var _, l = 6e4;
	r._$$LoaderAbstract = t._$klass();
	_ = r._$$LoaderAbstract._$extend(a._$$EventTarget);
	_.__init = function () {
		this.__super();
		this.__qopt = {
			onerror: this.__onQueueError._$bind(this),
			onload: this.__onQueueLoaded._$bind(this)
		};
		if (!this.constructor.__cache) this.constructor.__cache = {
			loaded: {}
		}
	};
	_.__reset = function (e) {
		this.__super(e);
		this.__version = e.version;
		this.__timeout = e.timeout;
		this.__qopt.version = this.__version;
		this.__qopt.timeout = this.__timeout
	};
	_.__delLoadData = function (e) {
		delete this.constructor.__cache[e]
	};
	_.__getLoadData = function (e) {
		return this.constructor.__cache[e]
	};
	_.__setLoadData = function (e, t) {
		this.constructor.__cache[e] = t
	};
	_.__getRequest = c;
	_.__doClearRequest = function (e) {
		n._$clearEvent(e)
	};
	_.__doRequest = function (e) {
		e.src = this.__url;
		document.head.appendChild(e)
	};
	_.__doClear = function () {
		var e = this.__getLoadData(this.__url);
		if (e) {
			window.clearTimeout(e.timer);
			this.__doClearRequest(e.request);
			delete e.bind;
			delete e.timer;
			delete e.request;
			this.__delLoadData(this.__url);
			this.__getLoadData("loaded")[this.__url] = !0
		}
	};
	_.__doCallback = function (e) {
		var t = this.__getLoadData(this.__url);
		if (t) {
			var i = t.bind;
			this.__doClear();
			if (i && i.length > 0) {
				var n;
				for (; i.length;) {
					n = i.shift();
					try {
						n._$dispatchEvent(e, arguments[1])
					} catch (s) {
						if (!1) throw s;
						console.error(s.message);
						console.error(s.stack)
					}
					n._$recycle()
				}
			}
		}
	};
	_.__onError = function (e) {
		this.__doCallback("onerror", e)
	};
	_.__onLoaded = function () {
		this.__doCallback("onload")
	};
	_.__doLoadQueue = function (e) {
		this.constructor._$allocate(this.__qopt)._$load(e)
	};
	_.__onQueueCheck = function (e) {
		var t = this.__getLoadData(this.__key);
		if (t) {
			if (e) t.error++;
			t.loaded++;
			if (!(t.loaded < t.total)) {
				this.__delLoadData(this.__key);
				this._$dispatchEvent(t.error > 0 ? "onerror" : "onload")
			}
		}
	};
	_.__onQueueError = function (e) {
		this.__onQueueCheck(!0)
	};
	_.__onQueueLoaded = function () {
		this.__onQueueCheck()
	};
	_._$load = function (e) {
		e = s._$absolute(e);
		if (e) {
			this.__url = e;
			if (this.__version) this.__url += (this.__url.indexOf("?") < 0 ? "?" : "&") + this.__version;
			if (!this.__getLoadData("loaded")[this.__url]) {
				var t = this.__getLoadData(this.__url),
					a;
				if (t) {
					t.bind.unshift(this);
					t.timer = window.clearTimeout(t.timer)
				} else {
					a = this.__getRequest();
					t = {
						request: a,
						bind: [this]
					};
					this.__setLoadData(this.__url, t);
					n._$addEvent(a, "load", this.__onLoaded._$bind(this));
					n._$addEvent(a, "error", this.__onError._$bind(this, {
						code: i._$CODE_ERRSERV,
						message: "无法加载指定资源文件[" + this.__url + "]！"
					}))
				} if (0 != this.__timeout) t.timer = window.setTimeout(this.__onError._$bind(this, {
					code: i._$CODE_TIMEOUT,
					message: "指定资源文件[" + this.__url + "]载入超时！"
				}), this.__timeout || l);
				if (a) this.__doRequest(a);
				this._$dispatchEvent("onloading")
			} else {
				try {
					this._$dispatchEvent("onload")
				} catch (r) {
					if (!1) throw r;
					console.error(r.message);
					console.error(r.stack)
				}
				this._$recycle()
			}
		} else this._$dispatchEvent("onerror", {
			code: i._$CODE_NOTASGN,
			message: "请指定要载入的资源地址！"
		})
	};
	_._$queue = function (e) {
		if (e && e.length) {
			this.__key = s._$uniqueID();
			var t = {
				error: 0,
				loaded: 0,
				total: e.length
			};
			this.__setLoadData(this.__key, t);
			s._$forEach(e, function (e, i) {
				if (e) this.__doLoadQueue(e);
				else t.total--
			}, this);
			this._$dispatchEvent("onloading")
		} else this._$dispatchEvent("onerror", {
			code: i._$CODE_NOTASGN,
			message: "请指定要载入的资源队列！"
		})
	};
	return r
}, "017b426dd2bb4315fa45d567a1fd3718", "4600f25ee05ffacd81f2d44da00eaaa7", "ab8abeca574cb254ef6aea89d6984f91", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "e0793c838b68fed5a7e1742035643bec");
I$("54120fa727d71cd38f3b1273d034afef", function (e, t, i, n, s, a) {
	i._$cookie = function () {
		var e = 864e5;
		var i = function (e) {
			var t = document.cookie,
				i = "\\b" + e + "=",
				n = t.search(i);
			if (n < 0) return "";
			n += i.length - 2;
			var s = t.indexOf(";", n);
			if (s < 0) s = t.length;
			return t.substring(n, s) || ""
		};
		var s = "SameSite=None; Secure";
		return function (a, r) {
			var o = new Date,
				c = +o,
				d;
			if (void 0 === r) return i(a);
			if (t._$isString(r)) {
				if (r) {
					d = a + "=" + r + ";";
					if (window._$URS.needChromeHack) d = [d, s].join("");
					document.cookie = d;
					return r
				}
				r = {
					expires: -100
				}
			}
			r = r || n;
			var _ = a + "=" + (r.value || "") + ";";
			delete r.value;
			if (void 0 !== r.expires) {
				o.setTime(c + r.expires * e);
				r.expires = o.toGMTString()
			}
			_ += t._$object2string(r, ";");
			if (window._$URS.needChromeHack)
				if (";" === _[_.length - 1]) _ = [_, s].join("");
				else _ = [_, s].join(";");
			document.cookie = _
		}
	}();
	if (!0) e.copy(e.P("nej.j"), i);
	return i
}, "017b426dd2bb4315fa45d567a1fd3718", "8fd03edddb19cf8c294f56ca6638c475");
! function () {
	var e = !0,
		t = null;
	! function (i) {
		function n(i) {
			if ("bug-string-char-index" == i) return "a" != "a"[0];
			var n, a = "json" == i;
			if (a || "json-stringify" == i || "json-parse" == i) {
				if ("json-stringify" == i || a) {
					var r = d.stringify,
						c = "function" == typeof r && _;
					if (c) {
						(n = function () {
							return 1
						}).toJSON = n;
						try {
							c = "0" === r(0) && "0" === r(new Number) && '""' == r(new String) && r(s) === o && r(o) === o && r() === o && "1" === r(n) && "[1]" == r([n]) && "[null]" == r([o]) && "null" == r(t) && "[null,null,null]" == r([o, s, t]) && '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}' == r({
								a: [n, e, !1, t, "\0\b\n\f\r\t"]
							}) && "1" === r(t, n) && "[\n 1,\n 2\n]" == r([1, 2], t, 1) && '"-271821-04-20T00:00:00.000Z"' == r(new Date((-864e13))) && '"+275760-09-13T00:00:00.000Z"' == r(new Date(864e13)) && '"-000001-01-01T00:00:00.000Z"' == r(new Date((-621987552e5))) && '"1969-12-31T23:59:59.999Z"' == r(new Date((-1)))
						} catch (l) {
							c = !1
						}
					}
					if (!a) return c
				}
				if ("json-parse" == i || a) {
					i = d.parse;
					if ("function" == typeof i) try {
						if (0 === i("0") && !i(!1)) {
							n = i('{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}');
							var u = 5 == n.a.length && 1 === n.a[0];
							if (u) {
								try {
									u = !i('"\t"')
								} catch (f) { }
								if (u) try {
									u = 1 !== i("01")
								} catch (h) { }
							}
						}
					} catch (p) {
						u = !1
					}
					if (!a) return u
				}
				return c && u
			}
		}
		var s = {}.toString,
			a, r, o, c = "function" == typeof define && define.amd,
			d = "object" == typeof exports && exports;
		d || c ? "object" == typeof JSON && JSON ? d ? (d.stringify = JSON.stringify, d.parse = JSON.parse) : d = JSON : c && (d = i.JSON = {}) : d = i.JSON || (i.JSON = {});
		var _ = new Date((-0xc782b5b800cec));
		try {
			_ = -109252 == _.getUTCFullYear() && 0 === _.getUTCMonth() && 1 === _.getUTCDate() && 10 == _.getUTCHours() && 37 == _.getUTCMinutes() && 6 == _.getUTCSeconds() && 708 == _.getUTCMilliseconds()
		} catch (l) { }
		if (!n("json")) {
			var u = n("bug-string-char-index");
			if (!_) var f = Math.floor,
				h = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334], p = function (e, t) {
					return h[t] + 365 * (e - 1970) + f((e - 1969 + (t = +(t > 1))) / 4) - f((e - 1901 + t) / 100) + f((e - 1601 + t) / 400)
				};
			if (!(a = {}.hasOwnProperty)) a = function (e) {
				var i = {}, n;
				if ((i.__proto__ = t, i.__proto__ = {
					toString: 1
				}, i).toString != s) a = function (e) {
					var i = this.__proto__,
						e = e in (this.__proto__ = t, this);
					this.__proto__ = i;
					return e
				};
				else {
					n = i.constructor;
					a = function (e) {
						var t = (this.constructor || n).prototype;
						return e in this && !(e in t && this[e] === t[e])
					}
				}
				i = t;
				return a.call(this, e)
			};
			var m = {
				"boolean": 1,
				number: 1,
				string: 1,
				undefined: 1
			};
			r = function (e, i) {
				var n = 0,
					r, o, c;
				(r = function () {
					this.valueOf = 0
				}).prototype.valueOf = 0;
				o = new r;
				for (c in o) a.call(o, c) && n++;
				r = o = t;
				if (n) n = 2 == n ? function (e, t) {
					var i = {}, n = "[object Function]" == s.call(e),
						r;
					for (r in e) !(n && "prototype" == r) && !a.call(i, r) && (i[r] = 1) && a.call(e, r) && t(r)
				} : function (e, t) {
					var i = "[object Function]" == s.call(e),
						n, r;
					for (n in e) !(i && "prototype" == n) && a.call(e, n) && !(r = "constructor" === n) && t(n);
					(r || a.call(e, n = "constructor")) && t(n)
				};
				else {
					o = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
					n = function (e, t) {
						var i = "[object Function]" == s.call(e),
							n, r;
						if (r = !i)
							if (r = "function" != typeof e.constructor) {
								r = typeof e.hasOwnProperty;
								r = "object" == r ? !!e.hasOwnProperty : !m[r]
							}
						r = r ? e.hasOwnProperty : a;
						for (n in e) !(i && "prototype" == n) && r.call(e, n) && t(n);
						for (i = o.length; n = o[--i]; r.call(e, n) && t(n));
					}
				}
				n(e, i)
			};
			if (!n("json-stringify")) {
				var g = {
					92: "\\\\",
					34: '\\"',
					8: "\\b",
					12: "\\f",
					10: "\\n",
					13: "\\r",
					9: "\\t"
				}, b = function (e, t) {
					return ("000000" + (t || 0)).slice(-e)
				}, v = function (e) {
					var t = '"',
						i = 0,
						n = e.length,
						s = n > 10 && u,
						a;
					for (s && (a = e.split("")); i < n; i++) {
						var r = e.charCodeAt(i);
						switch (r) {
							case 8:
							case 9:
							case 10:
							case 12:
							case 13:
							case 34:
							case 92:
								t += g[r];
								break;
							default:
								if (r < 32) {
									t += "\\u00" + b(2, r.toString(16));
									break
								}
								t += s ? a[i] : u ? e.charAt(i) : e[i]
						}
					}
					return t + '"'
				}, $ = function (i, n, c, d, _, l, u) {
					var h = n[i],
						m, g, y, C, w, x, T, E, k;
					try {
						h = n[i]
					} catch (S) { }
					if ("object" == typeof h && h) {
						m = s.call(h);
						if ("[object Date]" == m && !a.call(h, "toJSON"))
							if (h > -1 / 0 && h < 1 / 0) {
								if (p) {
									y = f(h / 864e5);
									for (m = f(y / 365.2425) + 1970 - 1; p(m + 1, 0) <= y; m++);
									for (g = f((y - p(m, 0)) / 30.42); p(m, g + 1) <= y; g++);
									y = 1 + y - p(m, g);
									C = (h % 864e5 + 864e5) % 864e5;
									w = f(C / 36e5) % 24;
									x = f(C / 6e4) % 60;
									T = f(C / 1e3) % 60;
									C %= 1e3
								} else {
									m = h.getUTCFullYear();
									g = h.getUTCMonth();
									y = h.getUTCDate();
									w = h.getUTCHours();
									x = h.getUTCMinutes();
									T = h.getUTCSeconds();
									C = h.getUTCMilliseconds()
								}
								h = (m <= 0 || m >= 1e4 ? (m < 0 ? "-" : "+") + b(6, m < 0 ? -m : m) : b(4, m)) + "-" + b(2, g + 1) + "-" + b(2, y) + "T" + b(2, w) + ":" + b(2, x) + ":" + b(2, T) + "." + b(3, C) + "Z"
							} else h = t;
						else if ("function" == typeof h.toJSON && ("[object Number]" != m && "[object String]" != m && "[object Array]" != m || a.call(h, "toJSON"))) h = h.toJSON(i)
					}
					c && (h = c.call(n, i, h));
					if (h === t) return "null";
					m = s.call(h);
					if ("[object Boolean]" == m) return "" + h;
					if ("[object Number]" == m) return h > -1 / 0 && h < 1 / 0 ? "" + h : "null";
					if ("[object String]" == m) return v("" + h);
					if ("object" == typeof h) {
						for (i = u.length; i--;)
							if (u[i] === h) throw TypeError();
						u.push(h);
						E = [];
						n = l;
						l += _;
						if ("[object Array]" == m) {
							g = 0;
							for (i = h.length; g < i; k || (k = e), g++) {
								m = $(g, h, c, d, _, l, u);
								E.push(m === o ? "null" : m)
							}
							i = k ? _ ? "[\n" + l + E.join(",\n" + l) + "\n" + n + "]" : "[" + E.join(",") + "]" : "[]"
						} else {
							r(d || h, function (t) {
								var i = $(t, h, c, d, _, l, u);
								i !== o && E.push(v(t) + ":" + (_ ? " " : "") + i);
								k || (k = e)
							});
							i = k ? _ ? "{\n" + l + E.join(",\n" + l) + "\n" + n + "}" : "{" + E.join(",") + "}" : "{}"
						}
						u.pop();
						return i
					}
				};
				d.stringify = function (e, t, i) {
					var n, a, r;
					if ("function" == typeof t || "object" == typeof t && t)
						if ("[object Function]" == s.call(t)) a = t;
						else if ("[object Array]" == s.call(t)) {
							r = {};
							for (var o = 0, c = t.length, d; o < c; d = t[o++], ("[object String]" == s.call(d) || "[object Number]" == s.call(d)) && (r[d] = 1));
						}
					if (i)
						if ("[object Number]" == s.call(i)) {
							if ((i -= i % 1) > 0) {
								n = "";
								for (i > 10 && (i = 10); n.length < i; n += " ");
							}
						} else "[object String]" == s.call(i) && (n = i.length <= 10 ? i : i.slice(0, 10));
					return $("", (d = {}, d[""] = e, d), a, r, n, "", [])
				}
			}
			if (!n("json-parse")) {
				var y = String.fromCharCode,
					C = {
						92: "\\",
						34: '"',
						47: "/",
						98: "\b",
						116: "\t",
						110: "\n",
						102: "\f",
						114: "\r"
					}, w, x, T = function () {
						w = x = t;
						throw SyntaxError()
					}, E = function () {
						for (var i = x, n = i.length, s, a, r, o, c; w < n;) {
							c = i.charCodeAt(w);
							switch (c) {
								case 9:
								case 10:
								case 13:
								case 32:
									w++;
									break;
								case 123:
								case 125:
								case 91:
								case 93:
								case 58:
								case 44:
									s = u ? i.charAt(w) : i[w];
									w++;
									return s;
								case 34:
									s = "@";
									for (w++; w < n;) {
										c = i.charCodeAt(w);
										if (c < 32) T();
										else if (92 == c) {
											c = i.charCodeAt(++w);
											switch (c) {
												case 92:
												case 34:
												case 47:
												case 98:
												case 116:
												case 110:
												case 102:
												case 114:
													s += C[c];
													w++;
													break;
												case 117:
													a = ++w;
													for (r = w + 4; w < r; w++) {
														c = i.charCodeAt(w);
														c >= 48 && c <= 57 || c >= 97 && c <= 102 || c >= 65 && c <= 70 || T()
													}
													s += y("0x" + i.slice(a, w));
													break;
												default:
													T()
											}
										} else {
											if (34 == c) break;
											c = i.charCodeAt(w);
											for (a = w; c >= 32 && 92 != c && 34 != c;) c = i.charCodeAt(++w);
											s += i.slice(a, w)
										}
									}
									if (34 == i.charCodeAt(w)) {
										w++;
										return s
									}
									T();
								default:
									a = w;
									if (45 == c) {
										o = e;
										c = i.charCodeAt(++w)
									}
									if (c >= 48 && c <= 57) {
										for (48 == c && (c = i.charCodeAt(w + 1), c >= 48 && c <= 57) && T(); w < n && (c = i.charCodeAt(w), c >= 48 && c <= 57); w++);
										if (46 == i.charCodeAt(w)) {
											for (r = ++w; r < n && (c = i.charCodeAt(r), c >= 48 && c <= 57); r++);
											r == w && T();
											w = r
										}
										c = i.charCodeAt(w);
										if (101 == c || 69 == c) {
											c = i.charCodeAt(++w);
											(43 == c || 45 == c) && w++;
											for (r = w; r < n && (c = i.charCodeAt(r), c >= 48 && c <= 57); r++);
											r == w && T();
											w = r
										}
										return +i.slice(a, w)
									}
									o && T();
									if ("true" == i.slice(w, w + 4)) {
										w += 4;
										return e
									}
									if ("false" == i.slice(w, w + 5)) {
										w += 5;
										return !1
									}
									if ("null" == i.slice(w, w + 4)) {
										w += 4;
										return t
									}
									T()
							}
						}
						return "$"
					}, k = function (t) {
						var i, n;
						"$" == t && T();
						if ("string" == typeof t) {
							if ("@" == (u ? t.charAt(0) : t[0])) return t.slice(1);
							if ("[" == t) {
								for (i = []; ; n || (n = e)) {
									t = E();
									if ("]" == t) break;
									if (n)
										if ("," == t) {
											t = E();
											"]" == t && T()
										} else T();
									"," == t && T();
									i.push(k(t))
								}
								return i
							}
							if ("{" == t) {
								for (i = {}; ; n || (n = e)) {
									t = E();
									if ("}" == t) break;
									if (n)
										if ("," == t) {
											t = E();
											"}" == t && T()
										} else T();
									("," == t || "string" != typeof t || "@" != (u ? t.charAt(0) : t[0]) || ":" != E()) && T();
									i[t.slice(1)] = k(E())
								}
								return i
							}
							T()
						}
						return t
					}, S = function (e, t, i) {
						i = N(e, t, i);
						i === o ? delete e[t] : e[t] = i
					}, N = function (e, t, i) {
						var n = e[t],
							a;
						if ("object" == typeof n && n)
							if ("[object Array]" == s.call(n))
								for (a = n.length; a--;) S(n, a, i);
							else r(n, function (e) {
								S(n, e, i)
							});
						return i.call(e, t, n)
					};
				d.parse = function (e, i) {
					var n, a;
					w = 0;
					x = "" + e;
					n = k(E());
					"$" != E() && T();
					w = x = t;
					return i && "[object Function]" == s.call(i) ? N((a = {}, a[""] = n, a), "", i) : n
				}
			}
		}
		c && define(function () {
			return d
		})
	}(this);
	return JSON
}();
I$("c2c971a1b6f4ea984b7a0e36e8426906", function (_m, _p, _o, _f, _r) {
	if ("trident" === _m._$KERNEL.engine && "2.0" == _m._$KERNEL.release) I$("9e78313601a8d611e6701dd409597104", function () {
		JSON.parse = function () {
			var _isSafeJSON = function (e) {
				return !/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(e.replace(/"(\\.|[^"\\])*"/g, ""))
			};
			return JSON.parse._$aop(function (_event) {
				var _str = _event.args[0] || "";
				if (_str.length >= 5e5) {
					_event.stopped = !0;
					_event.value = eval("(" + _str + ")")
				}
			})
		}()
	});
	return JSON
}, "a878c0216188111f46d39b9df767b354");
I$("80a12d410a5748fceeb02a9bc494bd11", function () {
	return JSON
}, "c2c971a1b6f4ea984b7a0e36e8426906");
I$("4d951fe9bacf38bc6fc63d4b9acd162d", function (e, t, i, n, s, a, r, o, c, d, _, l) {
	var u;
	c._$$ProxyAbstract = e._$klass();
	u = c._$$ProxyAbstract._$extend(a._$$EventTarget);
	u.__reset = function (e) {
		this.__super(e);
		this.__request = t._$fetch({
			url: "",
			sync: !1,
			cookie: !1,
			type: "text",
			method: "GET",
			timeout: 6e4
		}, e);
		var i = n._$get("csrf");
		if (i.cookie && i.param) {
			var a = encodeURIComponent(i.param) + "=" + encodeURIComponent(r._$cookie(i.cookie) || ""),
				o = this.__request.url.indexOf("?") < 0 ? "?" : "&";
			this.__request.url += o + a
		}
		this.__headers = e.headers || {};
		var c = this.__headers[s._$HEAD_CT];
		if (null == c) this.__headers[s._$HEAD_CT] = s._$HEAD_CT_FORM
	};
	u.__destroy = function () {
		this.__super();
		delete this.__rkey;
		delete this.__request;
		delete this.__headers
	};
	u.__onLoadRequest = function (e) {
		var t = e.status;
		if (t != -1)
			if (0 == ("" + t).indexOf("2")) this._$dispatchEvent("onload", i._$text2type(e.result, this.__request.type));
			else this._$dispatchEvent("onerror", {
				data: t,
				result: e.result,
				code: s._$CODE_ERRSERV,
				message: "服务器返回异常状态[" + t + "]!"
			});
		else this._$dispatchEvent("onerror", {
			code: s._$CODE_TIMEOUT,
			message: "请求[" + this.__request.url + "]超时！"
		})
	};
	u.__doSendRequest = _;
	u.__getResponseHeader = _;
	u._$send = function (e) {
		var t = this.__request.url;
		if (t) try {
			this.__request.data = null == e ? null : e;
			var i = {
				request: this.__request,
				headers: this.__headers
			};
			try {
				this._$dispatchEvent("onbeforerequest", i)
			} catch (n) {
				console.error(n.message);
				console.error(n.stack)
			}
			this.__doSendRequest(i)
		} catch (a) {
			this._$dispatchEvent("onerror", {
				code: s._$CODE_ERRSERV,
				message: "请求[" + t + "]失败:" + a.message + "！"
			})
		} else this._$dispatchEvent("onerror", {
			code: s._$CODE_NOTASGN,
			message: "没有输入请求地址！"
		})
	};
	u._$abort = _;
	u._$header = function (e) {
		if (!t._$isArray(e)) return this.__getResponseHeader(e) || "";
		var i = {};
		t._$forEach(e, function (e) {
			i[e] = this._$header(e)
		}, this);
		return i
	};
	return c
}, "4600f25ee05ffacd81f2d44da00eaaa7", "8fd03edddb19cf8c294f56ca6638c475", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "d8896d88a70151d93b32a59d4533d829", "ab8abeca574cb254ef6aea89d6984f91", "e0793c838b68fed5a7e1742035643bec", "54120fa727d71cd38f3b1273d034afef", "80a12d410a5748fceeb02a9bc494bd11");
I$("425b189215319baba586a4d0b9e2df99", function (e, t, i, n) {
	e.__getXMLHttpRequest = function () {
		return new XMLHttpRequest
	};
	return e
});
I$("5ff708b4debbc508f8d22815607a65da", function (e, t, i, n, s, a, r) {
	if ("trident" === e._$KERNEL.engine && e._$KERNEL.release <= "2.0") I$("f09766539260e43386c24b44e64023ec", function () {
		t.__getXMLHttpRequest = function () {
			var e = ["Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP.4.0", "Msxml2.XMLHTTP.5.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
			return function () {
				var t = null;
				i._$forIn(e, function (e) {
					try {
						t = new ActiveXObject(e);
						return !0
					} catch (i) { }
				});
				return t
			}
		}()
	});
	return t
}, "a878c0216188111f46d39b9df767b354", "425b189215319baba586a4d0b9e2df99", "8fd03edddb19cf8c294f56ca6638c475");
I$("af8d309d2b14782d472637ca95bfa4fa", function (e, t, i, n, s, a, r, o, c) {
	var d;
	a._$$ProxyXHR = i._$klass();
	d = a._$$ProxyXHR._$extend(e._$$ProxyAbstract);
	d.__destroy = function () {
		this.__super();
		window.clearTimeout(this.__timer);
		delete this.__timer;
		try {
			this.__xhr.onreadystatechange = o;
			this.__xhr.abort()
		} catch (e) { }
		delete this.__xhr
	};
	d.__doSendRequest = function () {
		var e = function (e, t) {
			this.__xhr.setRequestHeader(t, e)
		};
		var i = function (e) {
			var i = [];
			t._$reverseEach(e.getElementsByTagName("input"), function (e) {
				if ("file" == e.type)
					if (e.name) {
						if (e.files.length > 1) {
							t._$forEach(e.files, function (t) {
								i.push({
									name: e.name,
									file: t
								})
							});
							e.parentNode.removeChild(e)
						}
					} else e.parentNode.removeChild(e)
			});
			return i.length > 0 ? i : null
		};
		return function (a) {
			var r = a.request,
				o = a.headers;
			this.__xhr = s.__getXMLHttpRequest();
			if (o[n._$HEAD_CT] === n._$HEAD_CT_FILE) {
				delete o[n._$HEAD_CT];
				this.__xhr.upload.onprogress = this.__onStateChange._$bind(this, 1);
				if ("FORM" === r.data.tagName) {
					var c = i(r.data);
					r.data = new FormData(r.data);
					t._$forEach(c, function (e) {
						var i = e.file;
						r.data.append(e.name || i.name || "file-" + t._$uniqueID(), i)
					})
				}
			}
			this.__xhr.onreadystatechange = this.__onStateChange._$bind(this, 2);
			if (0 !== r.timeout) this.__timer = window.setTimeout(this.__onStateChange._$bind(this, 3), r.timeout);
			this.__xhr.open(r.method, r.url, !r.sync);
			t._$loop(o, e, this);
			if (this.__request.cookie && "withCredentials" in this.__xhr) this.__xhr.withCredentials = !0;
			this.__xhr.send(r.data)
		}
	}();
	d.__onStateChange = function (e) {
		switch (e) {
			case 1:
				this._$dispatchEvent("onuploading", arguments[1]);
				break;
			case 2:
				if (4 == this.__xhr.readyState) this.__onLoadRequest({
					status: this.__xhr.status,
					result: this.__xhr.responseText || ""
				});
				break;
			case 3:
				this.__onLoadRequest({
					status: -1
				})
		}
	};
	d.__getResponseHeader = function (e) {
		return !this.__xhr ? "" : this.__xhr.getResponseHeader(e)
	};
	d._$abort = function () {
		this.__onLoadRequest({
			status: 0
		})
	};
	return a
}, "4d951fe9bacf38bc6fc63d4b9acd162d", "8fd03edddb19cf8c294f56ca6638c475", "4600f25ee05ffacd81f2d44da00eaaa7", "ab8abeca574cb254ef6aea89d6984f91", "5ff708b4debbc508f8d22815607a65da");
I$("66d39a9e8d95915df63e39f8753dc354", function (e, t, i, n, s) {
	var a = this,
		r = e._$KERNEL.prefix.pro,
		o = e._$is("desktop") ? 80 : e._$is("ios") ? 50 : 30;
	t.__requestAnimationFrame = function () {
		var t = e._$is("android") ? null : a.requestAnimationFrame || a[r + "RequestAnimationFrame"];
		return function () {
			if (!t) t = function (e) {
				return window.setTimeout(function () {
					try {
						e(+new Date)
					} catch (t) { }
				}, 1e3 / o)
			};
			return t.apply(this, arguments)
		}
	}();
	t.__cancelAnimationFrame = function () {
		var t = e._$is("android") ? null : a.cancelAnimationFrame || a[r + "CancelAnimationFrame"];
		return function () {
			if (!t) t = function (e) {
				window.clearTimeout(e)
			};
			return t.apply(this, arguments)
		}
	}();
	return t
}, "a878c0216188111f46d39b9df767b354");
I$("189fcf729b95d093dfd26aa8c85f59b0", function (e, t) {
	return e
}, "66d39a9e8d95915df63e39f8753dc354", "a878c0216188111f46d39b9df767b354");
I$("65920a8f36e490e14ed9352c35c32cde", function (e, t, i, n, s, a) {
	i.requestAnimationFrame = function () {
		t.__requestAnimationFrame.apply(null, arguments)
	};
	i.cancelAnimationFrame = function () {
		t.__cancelAnimationFrame.apply(null, arguments)
	};
	if (!0) {
		if (!this.requestAnimationFrame) this.requestAnimationFrame = i.requestAnimationFrame;
		if (!this.cancelAnimationFrame) this.cancelAnimationFrame = i.cancelAnimationFrame
	}
	return i
}, "a878c0216188111f46d39b9df767b354", "189fcf729b95d093dfd26aa8c85f59b0");
I$("e46abbe2f961d4a19e9d6030ff7a70c9", function (e, t, i, n, s) {
	t.__canFlashEventBubble = function (e) {
		return "transparent" != (e || "").toLowerCase()
	};
	return t
}, "a878c0216188111f46d39b9df767b354");
I$("7330904e9a82232310d2b4d68e60deee", function (e, t, i, n, s, a) {
	if ("trident" === t._$KERNEL.engine) I$("d1a5de37242e7aa9a1d00406b650ea33", function () {
		e.__canFlashEventBubble = function (e) {
			return !0
		}
	});
	if ("webkit" === t._$KERNEL.engine) I$("b95532c10398a8a8f801ff746c70d29f", function () {
		e.__canFlashEventBubble = function (e) {
			return !0
		}
	});
	return e
}, "e46abbe2f961d4a19e9d6030ff7a70c9", "a878c0216188111f46d39b9df767b354");
I$("3e0e2a658f8e6f0fac893657ab2cc549", '{var hide  = defined("hidden")&&!!hidden}\n{var param = defined("params")&&params||NEJ.O}\n{var width = !hide?width:"1px",height = !hide?height:"1px"}\n{if hide}<div style="position:absolute;top:0;left:0;width:1px;height:1px;z-index:10000;overflow:hidden;">{/if}\n<object classid = "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"\n        codebase = "http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab"\n        width = "${width|default:"100px"}"\n        height = "${height|default:"100px"}" id="${id}">\n    <param value="${src}" name="movie">\n    {for x in param}\n    <param value="${x}" name="${x_key}"/>\n    {/for}\n    <embed src="${src}" name="${id}"\n           width="${width|default:"100px"}"\n           height="${height|default:"100px"}"\n           pluginspage="http://www.adobe.com/go/getflashplayer"\n           type="application/x-shockwave-flash"\n           {for x in param}${x_key}="${x}" {/for}></embed>\n</object>\n{if hide}</div>{/if}');
I$("28ac398f855e4cdb0f5aef454c7b3c27", function (e, t, i, n, s, a, r, o, c, d, _, l) {
	var u = s._$add(o);
	c._$flash = function () {
		var o = {}, c, d = /^(?:mouse.*|(?:dbl)?click)$/i;
		window.onflashevent = function (e) {
			var t = decodeURIComponent(e.target),
				i = e.type.toLowerCase();
			var n = o[t + "-tgt"];
			if (n && d.test(i)) l(n, e);
			var s = o[t + "-on" + i];
			if (s) {
				var a = "";
				try {
					a = s(e)
				} catch (r) { }
				return a
			}
		};
		var _ = function (e) {
			c = document.title;
			var i = t._$get(e.parent) || document.body,
				n = s._$get(u, e);
			i.insertAdjacentHTML(!e.hidden ? "beforeEnd" : "afterBegin", n)
		};
		var l = function (e, t) {
			var n = t.type.toLowerCase();
			a.requestAnimationFrame(function () {
				i._$dispatchEvent(e, n)
			})
		};
		var f = function (e) {
			return !!e && !!e.inited && !!e.inited()
		};
		var h = function (e) {
			var i = [document.embeds[e], t._$get(e), document[e], window[e]],
				s = n._$forIn(i, f),
				a = i[s],
				r = e + "-count";
			o[r]++;
			if (!(a || o[r] > 100)) window.setTimeout(h._$bind(null, e), 300);
			else {
				if (c) {
					document.title = c;
					c = null
				}
				o[e](a);
				delete o[e];
				delete o[r]
			}
		};
		var p = function (e) {
			var i = e.id,
				s = e.params;
			if (!s) {
				s = {};
				e.params = s
			}
			var a = s.flashvars || "";
			a += (!a ? "" : "&") + ("id=" + i);
			if (!e.hidden && (e.target || r.__canFlashEventBubble(s.wmode))) {
				var c = t._$id(e.target) || t._$id(e.parent);
				o[i + "-tgt"] = c
			}
			s.flashvars = a;
			n._$loop(e, function (e, t) {
				if (n._$isFunction(e) && "onready" != t) o[i + "-" + t] = e
			})
		};
		return function (t) {
			t = e.X({}, t);
			if (t.src) {
				var i = "_" + n._$uniqueID();
				t.id = i;
				p(t);
				_(t);
				if (t.onready) {
					o[i] = t.onready;
					o[i + "-count"] = 0;
					h(i)
				}
			}
		}
	}();
	if (!0) e.copy(e.P("nej.e"), c);
	return c
}, "017b426dd2bb4315fa45d567a1fd3718", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "bff3d86ec4ea91399919ee4963badfeb", "65920a8f36e490e14ed9352c35c32cde", "7330904e9a82232310d2b4d68e60deee", "3e0e2a658f8e6f0fac893657ab2cc549");
I$("e075c92044b2a4fb25d3cd2e2f1e3824", function (e, t, i, n, s, a, r, o, c) {
	var d, _ = {}, l = n._$uniqueID();
	this["ld" + l] = function (e, t) {
		var i = _[e];
		if (i) {
			delete _[e];
			i.__onLoadRequest({
				status: 200,
				result: t
			})
		}
	};
	this["er" + l] = function (e, t) {
		var i = _[e];
		if (i) {
			delete _[e];
			i.__onLoadRequest({
				status: t || 0
			})
		}
	};
	a._$$ProxyFlash = t._$klass();
	d = a._$$ProxyFlash._$extend(e._$$ProxyAbstract);
	d.__doSendRequest = function (e) {
		var t = _.flash;
		if (!n._$isArray(t))
			if (t) {
				this.__rkey = n._$uniqueID();
				_[this.__rkey] = this;
				var a = n._$fetch({
					url: "",
					data: null,
					method: "GET"
				}, e.request);
				a.key = this.__rkey;
				a.headers = e.headers;
				a.onerror = "cb.er" + l;
				a.onloaded = "cb.ld" + l;
				var r = i._$getFlashProxy(a.url);
				if (r) a.policyURL = r;
				t.request(a)
			} else {
				_.flash = [this.__doSendRequest._$bind(this, e)];
				s._$flash({
					hidden: !0,
					src: i._$get("ajax.swf"),
					onready: function (e) {
						if (e) {
							var t = _.flash;
							_.flash = e;
							n._$reverseEach(t, function (e, t, i) {
								try {
									e()
								} catch (n) { }
							})
						}
					}
				})
			} else t.push(this.__doSendRequest._$bind(this, e))
	};
	d._$abort = function () {
		delete _[this.__rkey];
		this.__onLoadRequest({
			status: 0
		})
	};
	return a
}, "4d951fe9bacf38bc6fc63d4b9acd162d", "4600f25ee05ffacd81f2d44da00eaaa7", "d8896d88a70151d93b32a59d4533d829", "8fd03edddb19cf8c294f56ca6638c475", "28ac398f855e4cdb0f5aef454c7b3c27");
I$("be14685e38c2c21658f6a274913a9a9f", function (e, t, i, n) {
	e.__formatOrigin = function () {
		var e = /^([\w]+?:\/\/.*?(?=\/|$))/i;
		return function (t) {
			t = t || "";
			if (e.test(t)) return RegExp.$1;
			else return "*"
		}
	}();
	e.__formatPassData = function (e) {
		return e
	};
	e.__postMessage = function (i, n) {
		if (i.postMessage) {
			n = n || t;
			i.postMessage(e.__formatPassData(n.data), e.__formatOrigin(n.origin))
		}
	};
	return e
});
I$("c127d1322c9dba58ccd453cc0fd427ce", function (e, t, i, n, s, a, r, o) {
	if ("trident" === e._$KERNEL.engine && e._$KERNEL.release >= "4.0" && e._$KERNEL.release <= "5.0") I$("34d3616383fc455e525c861e0e133896", function () {
		t.__formatPassData = function (e) {
			return JSON.stringify(e)
		}
	});
	if ("trident" === e._$KERNEL.engine && e._$KERNEL.release <= "3.0") I$("5720a5bb49faf2362f74d39596ec4c42", function (e) {
		var s = "MSG|",
			r = [];
		var o = function () {
			var e = unescape(window.name || "").trim();
			if (e && 0 == e.indexOf(s)) {
				window.name = "";
				var a = i._$string2object(e.replace(s, ""), "|"),
					r = (a.origin || "").toLowerCase();
				if (!r || "*" == r || 0 == location.href.toLowerCase().indexOf(r)) n._$dispatchEvent(window, "message", {
					data: JSON.parse(a.data || "null"),
					source: window.frames[a.self] || a.self,
					origin: t.__formatOrigin(a.ref || document.referrer)
				})
			}
		};
		var c = function () {
			var e;
			var t = function (t, n, s) {
				if (i._$indexOf(e, t.w) < 0) {
					e.push(t.w);
					s.splice(n, 1);
					t.w.name = t.d
				}
			};
			return function () {
				e = [];
				i._$reverseEach(r, t);
				e = null
			}
		}();
		t.__postMessage = function () {
			var e = function (e) {
				var t = {};
				e = e || a;
				t.origin = e.origin || "";
				t.ref = location.href;
				t.self = e.source;
				t.data = JSON.stringify(e.data);
				return s + i._$object2string(t, "|", !0)
			};
			return function (t, i) {
				r.unshift({
					w: t,
					d: escape(e(i))
				})
			}
		}();
		e._$$CustomEvent._$allocate({
			element: window,
			event: "message"
		});
		setInterval(c, 100);
		setInterval(o, 20)
	}, "383b6571ddec98d00d11a1634708517f", "80a12d410a5748fceeb02a9bc494bd11");
	return t
}, "a878c0216188111f46d39b9df767b354", "be14685e38c2c21658f6a274913a9a9f", "8fd03edddb19cf8c294f56ca6638c475", "a100971a16ec757a0282a3b2cc059019");
I$("8f33f2dc03528616b29dd40cc05162ac", function (e, t, i, n, s, a, r, o) {
	s._$postMessage = function () {
		var e = window.name || "_parent",
			s = [];
		s["_top"] = window.top;
		s["_self"] = window;
		s["_parent"] = window.parent;
		return function (r, o) {
			if (t._$isString(r)) {
				r = s[r] || window.frames[r] || (i._$get(r) || a).contentWindow;
				if (!r) return
			}
			var c = t._$fetch({
				data: null,
				origin: "*",
				source: e
			}, o);
			n.__postMessage(r, c)
		}
	}();
	if (!0) e.copy(e.P("nej.j"), s);
	return s
}, "017b426dd2bb4315fa45d567a1fd3718", "8fd03edddb19cf8c294f56ca6638c475", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "c127d1322c9dba58ccd453cc0fd427ce");
I$("2e4b3f51175b9421d336d0add531db20", function (e, t, i, n, s, a, r, o, c, d, _) {
	var l, u = {};
	o._$$ProxyFrame = i._$klass();
	l = o._$$ProxyFrame._$extend(e._$$ProxyAbstract);
	l.__init = function () {
		var e = "NEJ-AJAX-DATA:",
			t = !1;
		var i = function (t) {
			var i = t.data;
			if (0 == i.indexOf(e)) {
				i = JSON.parse(i.replace(e, ""));
				var n = u[i.key];
				if (n) {
					delete u[i.key];
					i.result = decodeURIComponent(i.result || "");
					n.__onLoadRequest(i)
				}
			}
		};
		var s = function () {
			if (!t) {
				t = !0;
				n._$addEvent(window, "message", i)
			}
		};
		return function () {
			this.__super();
			s()
		}
	}();
	l.__doSendRequest = function (e) {
		var i = e.request,
			o = s._$getFrameProxy(i.url),
			c = u[o];
		if (!t._$isArray(c))
			if (c) {
				this.__rkey = t._$uniqueID();
				u[this.__rkey] = this;
				var d = t._$fetch({
					url: "",
					data: null,
					timeout: 0,
					method: "GET"
				}, i);
				d.key = this.__rkey;
				d.headers = e.headers;
				r._$postMessage(u[o], {
					data: d
				})
			} else {
				u[o] = [this.__doSendRequest._$bind(this, e)];
				a._$createXFrame({
					src: o,
					visible: !1,
					onload: function (e) {
						var i = u[o];
						u[o] = n._$getElement(e).contentWindow;
						t._$reverseEach(i, function (e) {
							try {
								e()
							} catch (t) { }
						})
					}
				})
			} else c.push(this.__doSendRequest._$bind(this, e))
	};
	l._$abort = function () {
		delete u[this.__rkey];
		this.__onLoadRequest({
			status: 0
		})
	};
	return o
}, "4d951fe9bacf38bc6fc63d4b9acd162d", "8fd03edddb19cf8c294f56ca6638c475", "4600f25ee05ffacd81f2d44da00eaaa7", "a100971a16ec757a0282a3b2cc059019", "d8896d88a70151d93b32a59d4533d829", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "8f33f2dc03528616b29dd40cc05162ac");
I$("d1b409b34e06cae9f13d32129b21694e", function (e, t, i, n, s, a, r, o, c, d, _, l) {
	var u, f = {}, h = "NEJ-UPLOAD-RESULT:";
	c._$$ProxyUpload = t._$klass();
	u = c._$$ProxyUpload._$extend(e._$$ProxyAbstract);
	u.__init = function () {
		var e = !1;
		var t = function (e) {
			var t = e.data;
			if (0 == t.indexOf(h)) {
				t = JSON.parse(t.replace(h, ""));
				var i = f[t.key];
				if (i) {
					delete f[t.key];
					i.__onLoadRequest(decodeURIComponent(t.result))
				}
			}
		};
		var i = function () {
			if (!e) {
				e = !0;
				n._$addEvent(window, "message", t)
			}
		};
		return function () {
			this.__super();
			i()
		}
	}();
	u.__destroy = function () {
		this.__super();
		s._$remove(this.__frame);
		delete this.__frame;
		window.clearTimeout(this.__timer);
		delete this.__timer
	};
	u.__onLoadRequest = function (e) {
		try {
			var t = s._$text2type(e, this.__request.type);
			this._$dispatchEvent("onload", t)
		} catch (i) {
			this._$dispatchEvent("onerror", {
				code: a._$CODE_ERREVAL,
				message: e
			})
		}
	};
	u.__doSendRequest = function () {
		var e = function () {
			var e, t;
			try {
				var e = this.__frame.contentWindow.document.body,
					t = (e.innerText || e.textContent || "").trim();
				if (t.indexOf(h) >= 0 || e.innerHTML.indexOf(h) >= 0) return
			} catch (i) {
				return
			}
			this.__onLoadRequest(t)
		};
		var t = function (e, i, n) {
			r._$request(e, {
				type: "json",
				method: "POST",
				cookie: n,
				mode: parseInt(i) || 0,
				onload: function (s) {
					if (this.__timer) {
						this._$dispatchEvent("onuploading", s);
						this.__timer = window.setTimeout(t._$bind(this, e, i, n), 1e3)
					}
				}._$bind(this),
				onerror: function (s) {
					if (this.__timer) this.__timer = window.setTimeout(t._$bind(this, e, i, n), 1e3)
				}._$bind(this)
			})
		};
		return function (r) {
			var o = r.request,
				c = r.headers,
				_ = o.data,
				l = i._$uniqueID();
			f[l] = this;
			_.target = l;
			_.method = "POST";
			_.enctype = a._$HEAD_CT_FILE;
			_.encoding = a._$HEAD_CT_FILE;
			var u = _.action || "",
				h = u.indexOf("?") <= 0 ? "?" : "&";
			_.action = u + h + "_proxy_=form";
			this.__frame = s._$createXFrame({
				name: l,
				onload: function (i) {
					var s = n._$getElement(i);
					n._$addEvent(s, "load", e._$bind(this));
					_.submit();
					var a = (_.nej_query || d).value;
					if (a) {
						var r = (_.nej_mode || d).value,
							o = "true" === (_.nej_cookie || d).value;
						this.__timer = window.setTimeout(t._$bind(this, a, r, o), 100)
					}
				}._$bind(this)
			})
		}
	}();
	u._$abort = function () {
		this._$dispatchEvent("onerror", {
			code: a._$CODE_ERRABRT,
			message: "客户端终止文件上传"
		})
	};
	return c
}, "4d951fe9bacf38bc6fc63d4b9acd162d", "4600f25ee05ffacd81f2d44da00eaaa7", "8fd03edddb19cf8c294f56ca6638c475", "a100971a16ec757a0282a3b2cc059019", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "ab8abeca574cb254ef6aea89d6984f91", "9a2eeb6403e6ff7ded02a3eabd637af9", "8f33f2dc03528616b29dd40cc05162ac");
I$("2a0d12bd3ef7646c6df6c599d867b672", function (e, t, i, n, s, a, r, o) {
	s.__getProxyByMode = function (s, a, r) {
		var o = a ? {
			2: n._$$ProxyUpload
		} : {
			2: i._$$ProxyFrame,
			3: t._$$ProxyFlash
		};
		return (o[s] || e._$$ProxyXHR)._$allocate(r)
	};
	return s
}, "af8d309d2b14782d472637ca95bfa4fa", "e075c92044b2a4fb25d3cd2e2f1e3824", "2e4b3f51175b9421d336d0add531db20", "d1b409b34e06cae9f13d32129b21694e");
I$("22d3076c507cd39b6f11f18809399054", function (e, t, i, n, s, a) {
	if ("trident" === e._$KERNEL.engine && e._$KERNEL.release <= "5.0") I$("da5a9c3cfdd9ac2db467a83b82cb3dc7", function () {
		t.__getProxyByMode = function () {
			var e = {
				0: 2,
				1: 3
			};
			return t.__getProxyByMode._$aop(function (t) {
				var i = t.args,
					n = i[0] || 0;
				i[0] = i[1] ? 2 : e[n] || n
			})
		}()
	});
	return t
}, "a878c0216188111f46d39b9df767b354", "2a0d12bd3ef7646c6df6c599d867b672");
I$("9a2eeb6403e6ff7ded02a3eabd637af9", function (e, t, i, n, s, a, r, o, c, d) {
	var _ = {}, l = c;
	r._$abort = function (e) {
		var t = _[e];
		if (t) t.req._$abort()
	};
	r._$filter = function (e) {
		l = e || c
	};
	r._$request = function () {
		var e = (location.protocol + "//" + location.host).toLowerCase();
		var n = function (t) {
			var n = i._$url2origin(t);
			return !!n && n != e
		};
		var r = function (e) {
			return (e || o)[t._$HEAD_CT] == t._$HEAD_CT_FILE
		};
		var d = function (e) {
			var t = r(e.headers);
			if (!n(e.url) && !t) return s._$$ProxyXHR._$allocate(e);
			else return a.__getProxyByMode(e.mode, t, e)
		};
		var u = function (e, t) {
			var i = {
				data: t
			};
			var n = e.result.headers;
			if (n) i.headers = e.req._$header(n);
			return i
		};
		var f = function (e) {
			var t = _[e];
			if (t) {
				if (t.req) t.req._$recycle();
				delete _[e]
			}
		};
		var h = function (e, t) {
			var i = _[e];
			if (i) {
				var n = arguments[2];
				if ("onload" == t && i.result) n = u(i, n);
				f(e);
				var s = {
					type: t,
					result: n
				};
				l(s);
				if (!s.stopped) (i[t] || c)(s.result)
			}
		};
		var p = function (e, t) {
			h(e, "onload", t)
		};
		var m = function (e, t) {
			h(e, "onerror", t)
		};
		var g = function (e, t) {
			var n = e.indexOf("?") < 0 ? "?" : "&",
				t = t || "";
			if (i._$isObject(t)) t = i._$object2query(t);
			if (t) e += n + t;
			return e
		};
		return function (e, t) {
			t = t || {};
			var n = i._$uniqueID(),
				s = {
					result: t.result,
					onload: t.onload || c,
					onerror: t.onerror || c
				};
			_[n] = s;
			t.onload = p._$bind(null, n);
			t.onerror = m._$bind(null, n);
			if (t.query) e = g(e, t.query);
			var a = t.method || "";
			if ((!a || /get/i.test(a)) && t.data) {
				e = g(e, t.data);
				t.data = null
			}
			t.url = e;
			s.req = d(t);
			s.req._$send(t.data);
			return n
		}
	}();
	r._$upload = function (e, s) {
		e = n._$get(e);
		if (!e) return "";
		var a = i._$fetch({
			mode: 0,
			type: "json",
			query: null,
			cookie: !1,
			headers: {},
			onload: null,
			onerror: null,
			onuploading: null,
			onbeforerequest: null
		}, s);
		a.data = e;
		a.method = "POST";
		a.timeout = 0;
		a.headers[t._$HEAD_CT] = t._$HEAD_CT_FILE;
		return r._$request(e.action, a)
	};
	if (!0) e.copy(e.P("nej.j"), r);
	return r
}, "017b426dd2bb4315fa45d567a1fd3718", "ab8abeca574cb254ef6aea89d6984f91", "8fd03edddb19cf8c294f56ca6638c475", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "af8d309d2b14782d472637ca95bfa4fa", "22d3076c507cd39b6f11f18809399054");
I$("71672268c88ed1857e7b1dcfea4097a8", function (e, t, i, n, s, a, r, o) {
	var c;
	s._$$LoaderText = t._$klass();
	c = s._$$LoaderText._$extend(e._$$LoaderAbstract);
	c.__getRequest = function () {
		return null
	};
	c.__doRequest = function () {
		n._$request(this.__url, {
			method: "GET",
			type: "text",
			onload: this.__onLoaded._$bind(this),
			onerror: this.__onError._$bind(this)
		})
	};
	c.__onLoaded = function (e) {
		this.__doCallback("onload", {
			url: this.__url,
			content: e
		})
	};
	return s
}, "da26cfd4acda6a50e5f2f0cfde754788", "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "9a2eeb6403e6ff7ded02a3eabd637af9");
I$("6e802c94e9b794cae0ad26508a99e695", function (e, t, i, n, s) {
	t.__removeIFrameKeepHistory = function (t) {
		e._$remove(t)
	};
	return t
}, "1c92dd86f4b11b13a0c8a0c0f91b27e9");
I$("af5a299b84f4951b9a6e91452b97c438", function (e, t, i, n, s, a, r) {
	if ("trident" === i._$KERNEL.engine && i._$KERNEL.release <= "2.0") I$("3856ddf34da711f5e31cee56913f656a", function () {
		e.__removeIFrameKeepHistory = function (e) {
			t._$setStyle(e, "display", "none");
			try {
				e.contentWindow.document.body.innerHTML = "&nbsp;"
			} catch (i) { }
		}
	});
	return e
}, "6e802c94e9b794cae0ad26508a99e695", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a878c0216188111f46d39b9df767b354");
I$("a3f9f6db781503d1890042b07300d5f3", function (e, t, i, n, s, a, r, o) {
	var c;
	s._$$LoaderHtml = t._$klass();
	c = s._$$LoaderHtml._$extend(e._$$LoaderAbstract);
	c.__getRequest = function () {
		var e = i._$create("iframe");
		e.width = 0;
		e.height = 0;
		e.style.display = "none";
		return e
	};
	c.__doRequest = function (e) {
		try {
			document.body.appendChild(e);
			e.src = this.__url
		} catch (t) {
			console.log(e);
			console.error(t)
		}
	};
	c.__onError = function (e) {
		var t = (this.__getLoadData(this.__url) || a).request;
		this.__doCallback("onerror", e);
		n.__removeIFrameKeepHistory(t)
	};
	c.__onLoaded = function () {
		var e = null,
			t = (this.__getLoadData(this.__url) || a).request;
		try {
			if (t.src != this.__url) return;
			e = t.contentWindow.document.body
		} catch (i) { }
		this.__doCallback("onload", e);
		n.__removeIFrameKeepHistory(t)
	};
	return s
}, "da26cfd4acda6a50e5f2f0cfde754788", "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "af5a299b84f4951b9a6e91452b97c438");
I$("a050032cb2949e552a8ec03009ac4253", function (e, t, i, n, s, a, r) {
	var o;
	n._$$LoaderStyle = t._$klass();
	o = n._$$LoaderStyle._$extend(e._$$LoaderAbstract);
	o.__getRequest = function () {
		return i._$create("link")
	};
	o.__doRequest = function (e) {
		e.href = this.__url;
		document.head.appendChild(e)
	};
	return n
}, "da26cfd4acda6a50e5f2f0cfde754788", "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9");
I$("c488423b9f57765277b603bdd1fe75ea", function (e, t, i, n, s, a, r) {
	var o;
	n._$$LoaderScript = t._$klass();
	o = n._$$LoaderScript._$extend(e._$$LoaderAbstract);
	o.__reset = function (e) {
		this.__super(e);
		this.__async = e.async;
		this.__charset = e.charset;
		this.__qopt.async = !1;
		this.__qopt.charset = this.__charset
	};
	o.__getRequest = function () {
		var e = i._$create("script");
		if (null != this.__async) e.async = !!this.__async;
		if (null != this.__charset) e.charset = this.__charset;
		return e
	};
	o.__doClearRequest = function (e) {
		i._$remove(e)
	};
	return n
}, "da26cfd4acda6a50e5f2f0cfde754788", "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9");
I$("39759f285cdd7c9a25bc01cc7df24dca", function (e, t, i, n, s, a, r, o, c) {
	a._$loadScript = function (e, t) {
		s._$$LoaderScript._$allocate(t)._$load(e)
	};
	a._$queueScript = function (e, t) {
		s._$$LoaderScript._$allocate(t)._$queue(e)
	};
	a._$loadStyle = function (e, t) {
		n._$$LoaderStyle._$allocate(t)._$load(e)
	};
	a._$queueStyle = function (e, t) {
		n._$$LoaderStyle._$allocate(t)._$queue(e)
	};
	a._$loadHtml = function (e, t) {
		i._$$LoaderHtml._$allocate(t)._$load(e)
	};
	a._$loadText = function (e, i) {
		t._$$LoaderText._$allocate(i)._$load(e)
	};
	if (!0) e.copy(e.P("nej.j"), a);
	return a
}, "017b426dd2bb4315fa45d567a1fd3718", "71672268c88ed1857e7b1dcfea4097a8", "a3f9f6db781503d1890042b07300d5f3", "a050032cb2949e552a8ec03009ac4253", "c488423b9f57765277b603bdd1fe75ea");
I$("12c5dab742044e15807978f676f5c3fc", function (e, t, i, n, s, a, r, o, c, d, _, l, u, f) {
	var h = {}, p = "ntp-" + +new Date + "-";
	_.tpl = function () {
		return h
	};
	_._$parseTemplate = function () {
		var e = 0;
		var d = function () {
			if (!(e > 0)) {
				e = 0;
				i._$dispatchEvent(document, "templateready");
				i._$clearEvent(document, "templateready")
			}
		};
		var u = function (e, i) {
			var s = n._$dataset(e, "src");
			if (s) {
				i = i || l;
				var a = i.root;
				if (!a) a = e.ownerDocument.location.href;
				else a = t._$absolute(a);
				s = s.split(",");
				t._$forEach(s, function (e, i, n) {
					n[i] = t._$absolute(e, a)
				});
				return s
			}
		};
		var f = function (e) {
			if (s._$is("mac") && "safari" === s._$KERNEL.browser) return t._$unescape(e.innerHTML);
			else return e.value || e.innerText || ""
		};
		var h = function (e, t) {
			if (e) {
				var i = u(e, t);
				if (i) o._$queueStyle(i, {
					version: n._$dataset(e, "version")
				});
				n._$addStyle(e.value)
			}
		};
		var p = function (t) {
			e--;
			n._$addScript(t);
			d()
		};
		var m = function (t, i) {
			if (t) {
				var s = u(t, i),
					a = t.value;
				if (!s) n._$addScript(a);
				else {
					e++;
					var i = {
						version: n._$dataset(t, "version"),
						onload: p._$bind(null, a)
					};
					window.setTimeout(o._$queueScript._$bind(o, s, i), 0)
				}
			}
		};
		var g = function (t) {
			e--;
			_._$parseTemplate(t);
			d()
		};
		var b = function (t, i) {
			if (t) {
				var s = u(t, i)[0];
				if (s) {
					e++;
					var i = {
						version: n._$dataset(t, "version"),
						onload: g
					};
					window.setTimeout(o._$loadHtml._$bind(o, s, i), 0)
				}
			}
		};
		var v = function (t, i) {
			e--;
			_._$addTextTemplate(t, i || "");
			d()
		};
		var $ = function (t, i) {
			if (t && t.id) {
				var s = t.id,
					a = u(t, i)[0];
				if (a) {
					e++;
					var r = a + (a.indexOf("?") < 0 ? "?" : "&") + (n._$dataset(t, "version") || ""),
						i = {
							type: "text",
							method: "GET",
							onload: v._$bind(null, s)
						};
					window.setTimeout(c._$request._$bind(c, r, i), 0)
				}
			}
		};
		var y = function (e, t) {
			var i = e.name.toLowerCase();
			switch (i) {
				case "jst":
					a._$addTemplate(f(e), e.id);
					return;
				case "txt":
					_._$addTextTemplate(e.id, f(e));
					return;
				case "ntp":
					_._$addNodeTemplate(f(e), e.id);
					return;
				case "js":
					m(e, t);
					return;
				case "css":
					h(e, t);
					return;
				case "html":
					b(e, t);
					return;
				case "res":
					$(e, t);
					return
			}
		};
		r._$$CustomEvent._$allocate({
			element: document,
			event: "templateready",
			oneventadd: d
		});
		return function (e, i) {
			e = n._$get(e);
			if (e) {
				var s = "TEXTAREA" == e.tagName ? [e] : t._$object2array(e.getElementsByTagName("textarea"));
				t._$forEach(s, function (e) {
					y(e, i)
				});
				n._$remove(e, !0)
			}
			d()
		}
	}();
	_._$addTextTemplate = function (e, t) {
		if (null != h[e] && typeof h[e] == typeof t) {
			console.warn("text template overwrited with key " + e);
			console.debug("old template content: " + h[e].replace(/\n/g, " "));
			console.debug("new template content: " + t.replace(/\n/g, " "))
		}
		h[e] = t || ""
	};
	_._$getTextTemplate = function (e) {
		return h[e] || ""
	};
	_._$addNodeTemplate = function (e, i) {
		i = i || t._$uniqueID();
		e = n._$get(e) || e;
		_._$addTextTemplate(p + i, e);
		if (!t._$isString(e)) n._$removeByEC(e);
		return i
	};
	_._$getNodeTemplate = function (e) {
		if (!e) return null;
		e = p + e;
		var i = _._$getTextTemplate(e);
		if (!i) return null;
		var s;
		if (t._$isString(i)) {
			i = n._$html2node(i);
			var a = i.getElementsByTagName("textarea");
			if (!("TEXTAREA" == i.tagName || a && a.length)) _._$addTextTemplate(e, i);
			else s = i
		}
		if (!s) s = i.cloneNode(!0);
		n._$removeByEC(s);
		return s
	};
	_._$getItemTemplate = function () {
		var e = function (e, t) {
			return "offset" == t || "limit" == t
		};
		return function (i, n, s) {
			var a = [];
			if (!i || !i.length || !n) return a;
			s = s || l;
			var r = i.length,
				o = parseInt(s.offset) || 0,
				c = Math.min(r, o + (parseInt(s.limit) || r)),
				d = {
					total: i.length,
					range: [o, c]
				};
			t._$merge(d, s, e);
			for (var _ = o, u; _ < c; _++) {
				d.index = _;
				d.data = i[_];
				u = n._$allocate(d);
				var f = u._$getId();
				h[f] = u;
				u._$recycle = u._$recycle._$aop(function (e, t) {
					delete h[e];
					delete t._$recycle
				}._$bind(null, f, u));
				a.push(u)
			}
			return a
		}
	}();
	_._$getItemById = function (e) {
		return h[e]
	};
	_._$parseUITemplate = function () {
		var e = /#<(.+?)>/g;
		return function (i, s) {
			s = s || {};
			i = (i || "").replace(e, function (e, i) {
				var n = s[i];
				if (!n) {
					n = "tpl-" + t._$uniqueID();
					s[i] = n
				}
				return n
			});
			_._$parseTemplate(n._$html2node(i));
			return s
		}
	}();
	d._$merge({
		_$parseTemplate: _._$parseTemplate,
		_$addNodeTemplate: _._$addNodeTemplate
	});
	if (!0) e.copy(e.P("nej.e"), _);
	return _
}, "017b426dd2bb4315fa45d567a1fd3718", "8fd03edddb19cf8c294f56ca6638c475", "a100971a16ec757a0282a3b2cc059019", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a878c0216188111f46d39b9df767b354", "bff3d86ec4ea91399919ee4963badfeb", "383b6571ddec98d00d11a1634708517f", "39759f285cdd7c9a25bc01cc7df24dca", "9a2eeb6403e6ff7ded02a3eabd637af9", "703889c7eb7b7020f9b7e23d6c3a0b64");
I$("dde0e6b40e64b3f022ca4ad9ab8b1a9c", function (e, t, i, n) {
	var s = {
		404: "网络异常，请刷新页面重试",
		"-1": "网络不好，请刷新页面重试",
		"-2": "网络不好，请刷新页面重试",
		0: "网络不好，请刷新页面重试",
		101: "暂不支持该地区注册",
		103: "无法注册，请更换网络环境",
		401: "操作超时，请刷新页面重试",
		408: "该号码可能存在安全风险，请更换手机号",
		462: "该手机号码绑定帐号过多，请更换手机号",
		461: "该手机号码注册过于频繁，请过段时间再试",
		40110: "帐号格式错误",
		40101: "帐号格式错误",
		40102: "帐号格式错误",
		407: '该帐号已注册或暂不支持注册，<a target="_blank" href="https://hc.reg.163.com/iTerm/doc.html?id=540">点击查看详情</a>',
		410: "超过IP限制，请稍后再试",
		433: "系统繁忙，请刷新页面重试",
		108: "请输入图片验证码",
		409: "注册尝试次数太频繁",
		500: "系统繁忙，请您稍后再试",
		503: "服务器繁忙，请稍后再试",
		504: "次数超限，请稍后再试",
		505: "次数超限，请稍后再试",
		434: "您验证错误次数过多，请稍后再试",
		435: "您验证错误次数过多，请改天再试",
		436: "您验证错误次数过多，请稍后再试",
		437: "您验证错误次数过多，请改天再试",
		605: "密码强度过低，请更换后重试",
		604: "该帐号无法注册，请更换后重试",
		603: "当前环境存在风险，请更换网络环境或网络设备后重试",
		active_104: "帐号不存在",
		active_106: "用户不是外部邮箱",
		active_421: "该帐号已被注册",
		CHECK_PASSWORD_LEVEL: "8-16位大小写字母、数字、符号3种以上组合",
		CHECK_USER_EMPTY: "请输入帐号",
		CHECK_USER_TOO_LONG: "您输入的帐号太长了",
		CHECK_URS_EMPTY: "请输入帐号",
		CHECK_URS_BAD_BEGIN: "帐号须由字母开头",
		CHECK_URS_BAD_END: "帐号请以字母或数字结尾",
		CHECK_URS_BAD_LENGTH: "帐号须由6-18个字符组成",
		CHECK_URS_BAD_ILLEGAL: "请用字母、数字或下划线命名",
		CHECK_PASSWORD_EMPTY: "请设置您的登录密码",
		CHECK_PASSWORD_LENGTH: "8-16位大小写字母、数字、符号3种以上组合",
		CHECK_PASSWORD_SIMPLE: "密码过于简单，请重新设置",
		CHECK_PASSWORD_EQUAL: "密码不能与帐号相同",
		CHECK_PASSWORD_CHARCODE255: "密码只能包含数字、字母、标点符号",
		CHECK_PASSWORD_HASEMPTY: "密码请勿使用空格",
		CHECK_PASSWORD2_EMPTY: "请重复输入密码",
		CHECK_PASSWORD2_DIFF: "密码不一致",
		CHECK_SMS_EMPTY: "请输入正确的验证码",
		CHECK_SMS_BAD: "请输入正确的验证码",
		CHECK_CAPTCHA_EMPTY: "请输入正确的验证码",
		CHECK_CAPTCHA_BAD: "请输入正确的验证码",
		CHECK_PERSON_ID_EMPTY: "请输入您的身份证号码",
		CHECK_PERSON_NAME_EMPTY: "请输入您的姓名",
		CHECK_MOBILE_EMPTY: "请输入正确的手机号",
		CHECK_MOBILE_BAD: "请输入正确的手机号",
		EXCEPTION_INIT_COMPONENT_401: "初始化失败，参数不齐全",
		EXCEPTION_INIT_COMPONENT_433: "初始化失败，参数不匹配",
		EXCEPTION_INIT_COMPONENT_500: "系统繁忙，请您稍后再试",
		EXCEPTION_CHECK_NAME_160: '您输入的是网易靓号，请<a target="_blank" href="https://haoma.163.com/?from=zj">前往选购</a>',
		EXCEPTION_CHECK_NAME_106: "该帐号不可注册",
		EXCEPTION_CHECK_NAME_401: "操作超时，请刷新页面重试",
		EXCEPTION_CHECK_NAME_433: "系统繁忙，请刷新页面重试",
		EXCEPTION_CHECK_NAME_407: '该帐号已注册或暂不支持注册，<a target="_blank" href="https://hc.reg.163.com/iTerm/doc.html?id=540">点击查看详情</a>',
		EXCEPTION_CHECK_NAME_4303: "该帐号已被回收，不支持再次注册，请更换后重试",
		EXCEPTION_CHECK_NAME_102: "该帐号已被注销，不支持再次注册，请更换后重试",
		EXCEPTION_CHECK_NAME_409: "注册尝试次数太频繁",
		EXCEPTION_CHECK_NAME_410: "超过IP限制，请稍后再试",
		EXCEPTION_CHECK_NAME_422: "该帐号已被冻结",
		EXCEPTION_CHECK_NAME_500: "系统繁忙，请您稍后再试",
		EXCEPTION_CHECK_NAME_504: "次数超限，请稍后再试",
		EXCEPTION_CHECK_NAME_505: "次数超限，请稍后再试",
		EXCEPTION_GET_TICKET_160: '您输入的是网易靓号，请<a target="_blank" href="https://haoma.163.com/?from=zj">前往选购</a>',
		EXCEPTION_GET_TICKET_106: "该帐号不可注册",
		EXCEPTION_GET_TICKET_108: "请输入图片验证码",
		EXCEPTION_GET_TICKET_401: "操作超时，请刷新页面重试",
		EXCEPTION_GET_TICKET_433: "系统繁忙，请刷新页面重试",
		EXCEPTION_GET_TICKET_424: "请求错误，请您稍后再试",
		EXCEPTION_GET_TICKET_407: '该帐号已注册或暂不支持注册，<a target="_blank" href="https://hc.reg.163.com/iTerm/doc.html?id=540">点击查看详情</a>',
		EXCEPTION_GET_TICKET_4303: "该帐号已被回收，不支持再次注册，请更换后重试",
		EXCEPTION_GET_TICKET_102: "该帐号已被注销，不支持再次注册，请更换后重试",
		EXCEPTION_GET_TICKET_409: "注册尝试次数太频繁",
		EXCEPTION_GET_TICKET_410: "超过IP限制，请稍后再试",
		EXCEPTION_GET_TICKET_422: "该帐号已被冻结",
		EXCEPTION_GET_TICKET_500: "系统繁忙，请您稍后再试",
		EXCEPTION_GET_TICKET_503: "服务器繁忙，请稍后再试",
		EXCEPTION_GET_TICKET_504: "次数超限，请稍后再试",
		EXCEPTION_FAST_REG_160: '您输入的是网易靓号，请<a target="_blank" href="https://haoma.163.com/?from=zj">前往选购</a>',
		EXCEPTION_FAST_REG_107: "请输入正确的验证码",
		EXCEPTION_FAST_REG_106: "该帐号不可注册",
		EXCEPTION_FAST_REG_401: "操作超时，请刷新页面重试",
		EXCEPTION_FAST_REG_433: "系统繁忙，请刷新页面重试",
		EXCEPTION_FAST_REG_402: "当前网络异常，请检查您的网络环境",
		EXCEPTION_FAST_REG_407: '该帐号已注册或暂不支持注册，<a target="_blank" href="https://hc.reg.163.com/iTerm/doc.html?id=540">点击查看详情</a>',
		EXCEPTION_FAST_REG_409: "注册尝试次数太频繁",
		EXCEPTION_FAST_REG_410: "超过IP限制，请稍后再试",
		EXCEPTION_FAST_REG_422: "该帐号已被冻结",
		EXCEPTION_FAST_REG_412: "验证码错误次数过多，请改天再试",
		EXCEPTION_FAST_REG_413: "请输入正确的验证码",
		EXCEPTION_FAST_REG_500: "系统繁忙，请您稍后再试",
		EXCEPTION_FAST_REG_503: "服务器繁忙，请稍后再试",
		EXCEPTION_FAST_REG_504: "次数超限，请稍后再试",
		EXCEPTION_FAST_REG_406: "该号码可能存在安全风险，请更换手机号",
		EXCEPTION_REG_MOB_160: '您输入的是网易靓号，请<a target="_blank" href="https://haoma.163.com/?from=zj">前往选购</a>',
		EXCEPTION_REG_MOB_401: "操作超时，请刷新页面重试",
		EXCEPTION_REG_MOB_106: "该帐号不可注册",
		EXCEPTION_REG_MOB_433: "系统繁忙，请刷新页面重试",
		EXCEPTION_REG_MOB_402: "当前网络异常，请检查您的网络环境",
		EXCEPTION_REG_MOB_407: '该帐号已注册或暂不支持注册，<a target="_blank" href="https://hc.reg.163.com/iTerm/doc.html?id=540">点击查看详情</a>',
		EXCEPTION_REG_MOB_409: "注册尝试次数太频繁",
		EXCEPTION_REG_MOB_410: "超过IP限制，请稍后再试",
		EXCEPTION_REG_MOB_422: "该帐号已被冻结",
		EXCEPTION_REG_MOB_412: "验证码错误次数过多，请改天再试",
		EXCEPTION_REG_MOB_413: "请输入正确的验证码",
		EXCEPTION_REG_MOB_421: "该手机号已被注册",
		EXCEPTION_REG_MOB_423: "该手机号是保留帐号",
		EXCEPTION_REG_MOB_500: "系统繁忙，请您稍后再试",
		EXCEPTION_REG_MOB_107: "请输入正确的验证码",
		EXCEPTION_REG_MOB_108: "请输入图片验证码",
		EXCEPTION_REG_MOB_406: "该号码可能存在安全风险，请更换手机号",
		EXCEPTION_REG_MOB_417: "请获取短信验证码",
		EXCEPTION_GET_SMS_458: "短信发送过于频繁，请稍后再试",
		EXCEPTION_GET_SMS_506: "短信发送失败，请检查手机号码是否正确",
		EXCEPTION_GET_SMS_405: "请输入正确的中国大陆手机号",
		EXCEPTION_GET_SMS_408: "该号码可能存在安全风险，请更换手机号",
		EXCEPTION_GET_SMS_107: "请输入正确的验证码",
		EXCEPTION_GET_SMS_108: "请输入图片验证码",
		EXCEPTION_GET_SMS_401: "操作超时，请刷新页面重试",
		EXCEPTION_GET_SMS_284: "请更换手机号再试",
		EXCEPTION_GET_SMS_242: "该手机号码绑定帐号数达到上限，请更换手机号再试",
		EXCEPTION_GET_SMS_433: "系统繁忙，请刷新页面重试",
		EXCEPTION_GET_SMS_410: "超过IP限制，请稍后再试",
		EXCEPTION_GET_SMS_412: "验证码错误次数过多，请明天再试",
		EXCEPTION_GET_SMS_413: "请输入正确的验证码",
		EXCEPTION_GET_SMS_421: "该手机号已被注册",
		EXCEPTION_GET_SMS_423: "该手机号是保留帐号",
		EXCEPTION_GET_SMS_500: "系统繁忙，请您稍后再试",
		EXCEPTION_GET_SMS_415: "获取短信过于频繁，请稍后再试",
		EXCEPTION_GET_SMS_416: "获取短信过于频繁，请重新验证",
		EXCEPTION_GET_SMS_406: "该号码可能存在安全风险，请更换手机号",
		EXCEPTION_GET_SMS_40113: "请输入正确的手机号",
		EXCEPTION_GET_SMS_40113_2: "手机号码格式错误，请勿以“0”开头",
		EXCEPTION_GET_SMS_414: "验证码发送超过限制，请明天再试",
		EXCEPTION_GET_SMS_461: "该手机号码注册过于频繁，请过段时间再试",
		EXCEPTION_GET_SMS_462: "该手机号码绑定帐号过多，请更换手机号",
		EXCEPTION_SEND_MAIL_104: "帐号不存在。",
		EXCEPTION_SEND_MAIL_106: "用户不是外部邮箱。",
		EXCEPTION_SEND_MAIL_401: "操作超时，请刷新页面重试。",
		EXCEPTION_SEND_MAIL_410: "超过IP限制，请稍后再试",
		EXCEPTION_SEND_MAIL_421: "帐号已被注册。",
		EXCEPTION_SEND_MAIL_500: "系统繁忙，请您稍后再试。",
		EXCEPTION_SEND_MAIL_503: "服务器维护中，请稍后再试",
		EXCEPTION_SEND_MAIL_504: "重发邮件次数超过限制",
		MODAL_MAIL_SUCCESS_TITLE: "激活邮件已再次发送！",
		MODAL_MAIL_SUCCESS_TEXT: "请查看您的邮箱。",
		MODAL_MAIL_SUCCESS_BUTTON: "立即查看邮件",
		MODAL_MAIL_ERROR_TITLE: "出错了"
	};
	return s
});
I$("aeb48ea44f253e0d5b476e156149d630", function () {
	var e = {
		4502: "该帐号无法使用，请更换后重试",
		4503: "该手机无法使用，请更换后重试",
		4504: "您的网络环境存在风险，请更换网络",
		501: "系统繁忙，请您稍后再试",
		502: "系统繁忙，请您稍后再试",
		500: "系统繁忙，请您稍后再试",
		"-1": "网络不好，请刷新页面重试",
		"-2": "网络不好，请刷新页面重试",
		404: "网络异常，请刷新页面重试",
		401: "操作超时，请刷新页面重试",
		433: "系统繁忙，请刷新页面重试",
		"-101": "已重新发送激活邮件",
		"-102": "发送邮件失败，请稍后再试",
		"-103": "正在加载AA资源，请稍后重试",
		"-104": "您的网络不好，请刷新重试",
		"-105": "正在加载，请稍后...",
		"httpcode-1": "网络异常，请稍后再试",
		"httpcode-400": "网络异常，请稍后再试",
		"httpcode-404": "网络异常，请稍后再试",
		"httpcode-500": "系统繁忙，请稍后再试",
		"httpcode-502": "系统繁忙，请稍后再试",
		"httpcode-503": "系统繁忙，请稍后再试",
		"httpcode-4xx": "网络异常，请稍后再试",
		"httpcode-5xx": "系统繁忙，请稍后再试",
		"httpcode-429": "操作过于频繁，请稍后再试"
	};
	return e
});
I$("ae8136e351bba7de76cf9b8b49bb9488", function (e, t, i, n, s, a, r, o, c, d) {
	var _ = "dl.reg.163.com",
		l = "zc.reg.163.com";
	var u = [];
	var f = {
		"/l": {
			name: "/l",
			201: {
				ret: "201",
				message: "登录成功"
			},
			401: {
				ret: "401",
				message: "参数错误"
			},
			402: {
				ret: "402",
				message: "指纹错误"
			},
			423: {
				ret: "423",
				message: "风控帐号"
			}
		},
		"/lpwd": {
			name: "/lpwd",
			201: {
				ret: "201",
				message: "登录成功"
			}
		},
		"/lvfsms": {
			name: "/lvfsms",
			201: {
				ret: "201",
				message: "登录成功"
			}
		}
	};
	r._$request = function () {
		var e = function (e, t) {
			if (f[e]) {
				var i = {
					data: {}
				};
				var n = t.ret || -1;
				i.data["URS-CM"] = 1;
				i.data["URS-CM-STATE"] = f[e][n] || {
					ret: -1
				};
				if (t.unprotectedGuide) f[e][n].unprotectedGuide = 1;
				i.data["URS-CM-STATENAME"] = f[e].name;
				a._$postMessage("_parent", i)
			}
		};
		return function (t, i, n, s, r) {
			var o = _;
			var c = l;
			var d;
			if (window["$cookieDomain"])
				if (window["$cookieDomain"].indexOf("icourse163.org") >= 0) o = "reg." + window["$cookieDomain"] + "/dl";
				else o = "passport." + window["$cookieDomain"] + "/dl";
			if (window["$regCookieDomain"])
				if (window["$regCookieDomain"].indexOf("icourse163.org") >= 0) c = "reg." + window["$regCookieDomain"] + "/zc";
				else c = "passport." + window["$regCookieDomain"] + "/zc";
			if (t.indexOf("mb-") > -1) {
				o += "/yd";
				c += "/yd"
			}
			if (r) d = o;
			else d = c;
			var f = MP[t](i, function (t, i) {
				e(t, i);
				n(i)
			}, function (t, i) {
				e(t, i);
				if ("601" == i.ret) a._$setOutLogin(1);
				s(i)
			}, d);
			u.push(f);
			return f
		}
	}();
	r._$clearAllAjax = function () {
		try {
			if (MpRequest2 && MpRequest2["clearAjaxByKey"]) MpRequest2["clearAjaxByKey"](u);
			if (MpRequest && MpRequest["clearAjaxByKey"]) MpRequest["clearAjaxByKey"](u)
		} catch (e) { }
	};
	return r
}, "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "8fd03edddb19cf8c294f56ca6638c475", "9a2eeb6403e6ff7ded02a3eabd637af9", "8f33f2dc03528616b29dd40cc05162ac", "a4de926c2d79e8d8f856eaff4dac0f8b");
I$("58c544ea4fe5292e5520436314a60716", function (e, t, i, n, s) {
	var a = 8;
	var r = function (e, t) {
		return e << t | e >>> 32 - t
	};
	var o = function (e, t) {
		var i = (65535 & e) + (65535 & t),
			n = (e >> 16) + (t >> 16) + (i >> 16);
		return n << 16 | 65535 & i
	};
	var c = function (e, t, i, n) {
		if (e < 20) return t & i | ~t & n;
		if (e < 40) return t ^ i ^ n;
		if (e < 60) return t & i | t & n | i & n;
		else return t ^ i ^ n
	};
	var d = function (e) {
		if (e < 20) return 1518500249;
		if (e < 40) return 1859775393;
		if (e < 60) return -1894007588;
		else return -899497514
	};
	var _ = function () {
		var e = function (e) {
			return e % 32
		}, t = function (e) {
			return 32 - a - e % 32
		};
		return function (i, n) {
			var s = [],
				r = (1 << a) - 1,
				o = n ? e : t;
			for (var c = 0, d = i.length * a; c < d; c += a) s[c >> 5] |= (i.charCodeAt(c / a) & r) << o(c);
			return s
		}
	}();
	var l = function () {
		var e = "0123456789abcdef",
			t = function (e) {
				return e % 4
			}, i = function (e) {
				return 3 - e % 4
			};
		return function (n, s) {
			var a = [],
				r = s ? t : i;
			for (var o = 0, c = 4 * n.length; o < c; o++) a.push(e.charAt(n[o >> 2] >> 8 * r(o) + 4 & 15) + e.charAt(n[o >> 2] >> 8 * r(o) & 15));
			return a.join("")
		}
	}();
	var u = function () {
		var e = function (e) {
			return e % 32
		}, t = function (e) {
			return 32 - a - e % 32
		};
		return function (i, n) {
			var s = [],
				r = (1 << a) - 1,
				o = n ? e : t;
			for (var c = 0, d = 32 * i.length; c < d; c += a) s.push(String.fromCharCode(i[c >> 5] >>> o(c) & r));
			return s.join("")
		}
	}();
	var f = function () {
		var e = "=",
			t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
			i = function (e) {
				return e % 4
			}, n = function (e) {
				return 3 - e % 4
			};
		return function (s, a) {
			var r = [],
				o = a ? i : n;
			for (var c = 0, d; c < 4 * s.length; c += 3) {
				d = (s[c >> 2] >> 8 * o(c) & 255) << 16 | (s[c + 1 >> 2] >> 8 * o(c + 1) & 255) << 8 | s[c + 2 >> 2] >> 8 * o(c + 2) & 255;
				for (var _ = 0; _ < 4; _++) r.push(8 * c + 6 * _ > 32 * s.length ? e : t.charAt(d >> 6 * (3 - _) & 63))
			}
			return r.join("")
		}
	}();
	var h = function (e, t, i, n, s, a) {
		return o(r(o(o(t, e), o(n, a)), s), i)
	};
	var p = function (e, t, i, n, s, a, r) {
		return h(t & i | ~t & n, e, t, s, a, r)
	};
	var m = function (e, t, i, n, s, a, r) {
		return h(t & n | i & ~n, e, t, s, a, r)
	};
	var g = function (e, t, i, n, s, a, r) {
		return h(t ^ i ^ n, e, t, s, a, r)
	};
	var b = function (e, t, i, n, s, a, r) {
		return h(i ^ (t | ~n), e, t, s, a, r)
	};
	var v = function (e, t) {
		e[t >> 5] |= 128 << t % 32;
		e[(t + 64 >>> 9 << 4) + 14] = t;
		var i = 1732584193,
			n = -271733879,
			s = -1732584194,
			a = 271733878;
		for (var r = 0, c = e.length, d, _, l, u; r < c; r += 16) {
			d = i;
			_ = n;
			l = s;
			u = a;
			i = p(i, n, s, a, e[r + 0], 7, -680876936);
			a = p(a, i, n, s, e[r + 1], 12, -389564586);
			s = p(s, a, i, n, e[r + 2], 17, 606105819);
			n = p(n, s, a, i, e[r + 3], 22, -1044525330);
			i = p(i, n, s, a, e[r + 4], 7, -176418897);
			a = p(a, i, n, s, e[r + 5], 12, 1200080426);
			s = p(s, a, i, n, e[r + 6], 17, -1473231341);
			n = p(n, s, a, i, e[r + 7], 22, -45705983);
			i = p(i, n, s, a, e[r + 8], 7, 1770035416);
			a = p(a, i, n, s, e[r + 9], 12, -1958414417);
			s = p(s, a, i, n, e[r + 10], 17, -42063);
			n = p(n, s, a, i, e[r + 11], 22, -1990404162);
			i = p(i, n, s, a, e[r + 12], 7, 1804603682);
			a = p(a, i, n, s, e[r + 13], 12, -40341101);
			s = p(s, a, i, n, e[r + 14], 17, -1502002290);
			n = p(n, s, a, i, e[r + 15], 22, 1236535329);
			i = m(i, n, s, a, e[r + 1], 5, -165796510);
			a = m(a, i, n, s, e[r + 6], 9, -1069501632);
			s = m(s, a, i, n, e[r + 11], 14, 643717713);
			n = m(n, s, a, i, e[r + 0], 20, -373897302);
			i = m(i, n, s, a, e[r + 5], 5, -701558691);
			a = m(a, i, n, s, e[r + 10], 9, 38016083);
			s = m(s, a, i, n, e[r + 15], 14, -660478335);
			n = m(n, s, a, i, e[r + 4], 20, -405537848);
			i = m(i, n, s, a, e[r + 9], 5, 568446438);
			a = m(a, i, n, s, e[r + 14], 9, -1019803690);
			s = m(s, a, i, n, e[r + 3], 14, -187363961);
			n = m(n, s, a, i, e[r + 8], 20, 1163531501);
			i = m(i, n, s, a, e[r + 13], 5, -1444681467);
			a = m(a, i, n, s, e[r + 2], 9, -51403784);
			s = m(s, a, i, n, e[r + 7], 14, 1735328473);
			n = m(n, s, a, i, e[r + 12], 20, -1926607734);
			i = g(i, n, s, a, e[r + 5], 4, -378558);
			a = g(a, i, n, s, e[r + 8], 11, -2022574463);
			s = g(s, a, i, n, e[r + 11], 16, 1839030562);
			n = g(n, s, a, i, e[r + 14], 23, -35309556);
			i = g(i, n, s, a, e[r + 1], 4, -1530992060);
			a = g(a, i, n, s, e[r + 4], 11, 1272893353);
			s = g(s, a, i, n, e[r + 7], 16, -155497632);
			n = g(n, s, a, i, e[r + 10], 23, -1094730640);
			i = g(i, n, s, a, e[r + 13], 4, 681279174);
			a = g(a, i, n, s, e[r + 0], 11, -358537222);
			s = g(s, a, i, n, e[r + 3], 16, -722521979);
			n = g(n, s, a, i, e[r + 6], 23, 76029189);
			i = g(i, n, s, a, e[r + 9], 4, -640364487);
			a = g(a, i, n, s, e[r + 12], 11, -421815835);
			s = g(s, a, i, n, e[r + 15], 16, 530742520);
			n = g(n, s, a, i, e[r + 2], 23, -995338651);
			i = b(i, n, s, a, e[r + 0], 6, -198630844);
			a = b(a, i, n, s, e[r + 7], 10, 1126891415);
			s = b(s, a, i, n, e[r + 14], 15, -1416354905);
			n = b(n, s, a, i, e[r + 5], 21, -57434055);
			i = b(i, n, s, a, e[r + 12], 6, 1700485571);
			a = b(a, i, n, s, e[r + 3], 10, -1894986606);
			s = b(s, a, i, n, e[r + 10], 15, -1051523);
			n = b(n, s, a, i, e[r + 1], 21, -2054922799);
			i = b(i, n, s, a, e[r + 8], 6, 1873313359);
			a = b(a, i, n, s, e[r + 15], 10, -30611744);
			s = b(s, a, i, n, e[r + 6], 15, -1560198380);
			n = b(n, s, a, i, e[r + 13], 21, 1309151649);
			i = b(i, n, s, a, e[r + 4], 6, -145523070);
			a = b(a, i, n, s, e[r + 11], 10, -1120210379);
			s = b(s, a, i, n, e[r + 2], 15, 718787259);
			n = b(n, s, a, i, e[r + 9], 21, -343485551);
			i = o(i, d);
			n = o(n, _);
			s = o(s, l);
			a = o(a, u)
		}
		return [i, n, s, a]
	};
	var $ = function (e, t) {
		var i = _(e, !0);
		if (i.length > 16) i = v(i, e.length * a);
		var n = Array(16),
			s = Array(16);
		for (var r = 0; r < 16; r++) {
			n[r] = 909522486 ^ i[r];
			s[r] = 1549556828 ^ i[r]
		}
		var o = v(n.concat(_(t, !0)), 512 + t.length * a);
		return v(s.concat(o), 640)
	};
	var y = function (e, t) {
		e[t >> 5] |= 128 << 24 - t % 32;
		e[(t + 64 >> 9 << 4) + 15] = t;
		var i = Array(80),
			n = 1732584193,
			s = -271733879,
			a = -1732584194,
			_ = 271733878,
			l = -1009589776;
		for (var u = 0, f = e.length, h, p, m, g, b; u < f; u += 16) {
			h = n;
			p = s;
			m = a;
			g = _;
			b = l;
			for (var v = 0; v < 80; v++) {
				i[v] = v < 16 ? e[u + v] : r(i[v - 3] ^ i[v - 8] ^ i[v - 14] ^ i[v - 16], 1);
				var $ = o(o(r(n, 5), c(v, s, a, _)), o(o(l, i[v]), d(v)));
				l = _;
				_ = a;
				a = r(s, 30);
				s = n;
				n = $
			}
			n = o(n, h);
			s = o(s, p);
			a = o(a, m);
			_ = o(_, g);
			l = o(l, b)
		}
		return [n, s, a, _, l]
	};
	var C = function (e, t) {
		var i = _(e);
		if (i.length > 16) i = y(i, e.length * a);
		var n = Array(16),
			s = Array(16);
		for (var r = 0; r < 16; r++) {
			n[r] = 909522486 ^ i[r];
			s[r] = 1549556828 ^ i[r]
		}
		var o = y(n.concat(_(t)), 512 + t.length * a);
		return y(s.concat(o), 672)
	};
	t._$hmacsha12hex = function (e, t) {
		return l(C(e, t))
	};
	t._$hmacsha12b64 = function (e, t) {
		return f(C(e, t))
	};
	t._$hmacsha12str = function (e, t) {
		return u(C(e, t))
	};
	t._$hmacmd52hex = function (e, t) {
		return l($(e, t), !0)
	};
	t._$hmacmd52b64 = function (e, t) {
		return f($(e, t), !0)
	};
	t._$hmacmd52str = function (e, t) {
		return u($(e, t), !0)
	};
	t._$sha12hex = function (e) {
		return l(y(_(e), e.length * a))
	};
	t._$sha12b64 = function (e) {
		return f(y(_(e), e.length * a))
	};
	t._$sha12str = function (e) {
		return u(y(_(e), e.length * a))
	};
	t._$md52hex = function (e) {
		return l(v(_(e, !0), e.length * a), !0)
	};
	t._$md52b64 = function (e) {
		return f(v(_(e, !0), e.length * a), !0)
	};
	t._$md52str = function (e) {
		return u(v(_(e, !0), e.length * a), !0)
	};
	t._$str2hex = function (e, t) {
		return l(_(e, !t), !t)
	};
	if (!0) e.copy(e.P("nej.u"), t);
	return t
}, "017b426dd2bb4315fa45d567a1fd3718");
I$("0a1f43423259f38e3b62bed150ead0f8", function () {
	var e = {
		4502: "该帐号无法使用，请更换后重试",
		4503: "该手机无法使用，请更换后重试",
		4504: "您的网络环境存在风险，请更换网络",
		501: "系统繁忙，请您稍后再试",
		502: "系统繁忙，请您稍后再试",
		500: "系统繁忙，请您稍后再试",
		"-1": "网络不好，请刷新页面重试",
		"-2": "网络不好，请刷新页面重试",
		404: "网络异常，请刷新页面重试",
		401: "操作超时，请刷新页面重试",
		433: "系统繁忙，请刷新页面重试",
		"-101": "已重新发送激活邮件",
		"-102": "发送邮件失败，请稍后再试",
		"-103": "正在加载AA资源，请稍后重试",
		"-104": "您的网络不好，请刷新重试",
		"-105": "正在加载，请稍后...",
		"httpcode-1": "网络异常，请稍后再试",
		"httpcode-400": "网络异常，请稍后再试",
		"httpcode-404": "网络异常，请稍后再试",
		"httpcode-500": "系统繁忙，请稍后再试",
		"httpcode-502": "系统繁忙，请稍后再试",
		"httpcode-503": "系统繁忙，请稍后再试",
		"httpcode-4xx": "网络异常，请稍后再试",
		"httpcode-5xx": "系统繁忙，请稍后再试",
		"httpcode-429": "操作过于频繁，请稍后再试"
	};
	return e
});
I$("24608969b225d7ff9edd983af51d1473", function (e, t, i, n, s, a, r, o, c, d, _, l) {
	var u;
	var f = "ntes_zc_",
		h = "-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC5gsH+AA4XWONB5TDcUd+xCz7ejOFHZKlcZDx+pF1i7Gsvi1vjyJoQhRtRSn950x498VUkx7rUxg1/ScBVfrRxQOZ8xFBye3pjAzfb22+RCuYApSVpJ3OO3KsEuKExftz9oFBv3ejxPlYc5yq7YiBO8XlTnQN0Sa4R4qhPO3I2MQIDAQAB-----END PUBLIC KEY-----";
	var p = {
		"/l": {
			name: "/l",
			201: {
				ret: "201",
				message: "登录成功"
			},
			401: {
				ret: "401",
				message: "参数错误"
			},
			402: {
				ret: "402",
				message: "指纹错误"
			},
			423: {
				ret: "423",
				message: "风控帐号"
			}
		},
		"/lpwd": {
			name: "/lpwd",
			201: {
				ret: "201",
				message: "登录成功"
			}
		},
		"/lvfsms": {
			name: "/lvfsms",
			201: {
				ret: "201",
				message: "登录成功"
			}
		}
	};
	var m = location.protocol + "//";
	var g = [];
	var b = {
		init: {
			path: "/zj/mail/ini",
			type: "POST",
			isLogin: 0,
			isInit: 1,
			channel: 2
		},
		checkName: {
			path: "/zj/mail/chn",
			type: "POST",
			isLogin: 0,
			channel: 2
		},
		checkCaptcha: {
			path: "/zj/mail/vfcp",
			type: "POST",
			isLogin: 0,
			channel: 2
		},
		regvftcp: {
			path: "/zj/mail/vftcp",
			type: "POST",
			isLogin: 0,
			channel: 2
		},
		regvfccp: {
			path: "/zj/mail/vfccp",
			type: "POST",
			isLogin: 0,
			channel: 2
		},
		regvfscp: {
			path: "/zj/mail/vfscp",
			type: "POST",
			isLogin: 0,
			channel: 2
		},
		getTicket: {
			path: "/zj/mail/gt",
			type: "POST",
			isLogin: 0,
			channel: 2
		},
		fastReg: {
			path: "/zj/mail/frg",
			type: "POST",
			isLogin: 0,
			channel: 2
		},
		getMailSms: {
			path: "/zj/mail/sm",
			type: "POST",
			isLogin: 0,
			channel: 2
		},
		vfsmsup: {
			path: "/zj/mail/vfsmsup",
			type: "POST",
			isLogin: 0,
			channel: 2
		},
		sendActMail: {
			path: "/zj/mail/sendActMail",
			type: "POST",
			isLogin: 0,
			channel: 2
		},
		initComponentLogin: {
			path: "/zj/mail/ini",
			type: "POST",
			isLogin: 1,
			isInit: 1,
			channel: 0
		},
		checkSmsCode: {
			path: "/zj/mail/vfcp",
			type: "POST",
			isLogin: 1,
			channel: 0
		},
		vftcp: {
			path: "/zj/mail/vftcp",
			type: "POST",
			isLogin: 1,
			channel: 0
		},
		vfccp: {
			path: "/zj/mail/vfccp",
			type: "POST",
			isLogin: 1,
			channel: 0
		},
		vfscp: {
			path: "/zj/mail/vfscp",
			type: "POST",
			isLogin: 1,
			channel: 0
		},
		getLoginTicket: {
			path: "/zj/mail/gt",
			type: "POST",
			isLogin: 1,
			channel: 0
		},
		safelogin: {
			path: "/zj/mail/l",
			type: "POST",
			isLogin: 1,
			channel: 0
		},
		llp: {
			path: "/zj/mail/llp",
			type: "POST",
			isLogin: 1,
			channel: 0
		},
		goonlog: {
			path: "/zj/mail/go",
			type: "POST",
			isLogin: 1,
			channel: 0
		},
		qrlogin: {
			path: "/zj/mail/qrcodel",
			type: "POST",
			isLogin: 1,
			channel: 3
		},
		"mb-ini": {
			path: "/zj/yd/ini",
			type: "POST",
			isLogin: 1,
			isInit: 1,
			channel: 1
		},
		"mb-vfcp": {
			path: "/zj/yd/vfcp",
			type: "POST",
			isLogin: 1,
			channel: 1
		},
		"mb-vftcp": {
			path: "/zj/yd/vftcp",
			type: "POST",
			isLogin: 1,
			channel: 1
		},
		"mb-vfccp": {
			path: "/zj/yd/vfccp",
			type: "POST",
			isLogin: 1,
			channel: 1
		},
		"mb-vfscp": {
			path: "/zj/yd/vfscp",
			type: "POST",
			isLogin: 1,
			channel: 1
		},
		"mb-gt": {
			path: "/zj/yd/gt",
			type: "POST",
			isLogin: 1,
			channel: 1
		},
		"mb-login": {
			path: "/zj/yd/pwd/l",
			type: "POST",
			isLogin: 1,
			channel: 1
		},
		"mb-sms-lsm": {
			path: "/zj/yd/sms/sm",
			type: "POST",
			isLogin: 1,
			channel: 2
		},
		"mb-lvfsms": {
			path: "/zj/yd/sms/vfsms",
			type: "POST",
			isLogin: 1,
			channel: 2
		},
		"mb-qrlogin": {
			path: "/zj/yd/qrcodel",
			type: "POST",
			isLogin: 1,
			channel: 4
		},
		"mb-reg-ini": {
			path: "/zj/yd/ini",
			type: "POST",
			isLogin: 0,
			isInit: 1,
			channel: 3
		},
		"mb-reg-sm": {
			path: "/zj/yd/sm",
			type: "POST",
			isLogin: 0,
			channel: 3
		},
		"mb-reg-vfsms": {
			path: "/zj/yd/vfsms",
			type: "POST",
			isLogin: 0,
			channel: 3
		},
		"mb-nini": {
			path: "/dlzc/yd/ini",
			type: "POST",
			isLogin: 1,
			isInit: 1,
			channel: 14
		},
		"mb-nvfcp": {
			path: "/dlzc/yd/vfcp",
			type: "POST",
			isLogin: 1,
			channel: 14
		},
		"mb-nvftcp": {
			path: "/dlzc/yd/vftcp",
			type: "POST",
			isLogin: 1,
			channel: 14
		},
		"mb-nvfccp": {
			path: "/dlzc/yd/vfccp",
			type: "POST",
			isLogin: 1,
			channel: 14
		},
		"mb-nvfscp": {
			path: "/dlzc/yd/vfscp",
			type: "POST",
			isLogin: 1,
			channel: 14
		},
		"mb-nlgt": {
			path: "/dlzc/yd/gt",
			type: "POST",
			isLogin: 1,
			channel: 14
		},
		"mb-nlregssms": {
			path: "/dlzc/yd/sms/sm",
			type: "POST",
			isLogin: 1,
			channel: 14
		},
		"mb-nlregvfsms": {
			path: "/dlzc/yd/sms/vfsms",
			type: "POST",
			isLogin: 1,
			channel: 14
		}
	};
	c._$init = function () {
		window.MP = {
			setTicket: function (e) {
				window.MP.TICKET = e || ""
			},
			encrypt: function (e, t) {
				t = t.toLowerCase();
				var i = RSA.getPublicKey(h);
				return RSA.encrypt(e + "`" + t, i)
			},
			encrypt2: function (e) {
				var t = RSA.getPublicKey(h);
				return RSA.encrypt(e, t)
			},
			getCookieId: function (e, t) {
				var i = a._$cookie(e);
				t(i)
			},
			getId: function (e, t) {
				var i = a._$cookie(f + e);
				t(i)
			},
			getCaptcha: function () {
				return this.getCaptcha()
			}._$bind(this),
			getCaptchaLogin: function (e, t) {
				return this.getCaptchaLogin(e, t)
			}._$bind(this),
			"mb-ncp": function (e) {
				return this["mb-ncp"](e)
			}._$bind(this),
			"mb-reg-cp": function () {
				return this["mb-reg-cp"]()
			}._$bind(this),
			"mb-cp": function (e, t, i, n) {
				return this["mb-cp"](e, t, i, n)
			}._$bind(this)
		}
	};
	c._$request = function () {
		var e = function (e, t) {
			var i;
			var n = location.host + "/dl";
			var a = location.host + "/zc";
			if (e.indexOf("mb-") > -1 && (!s._$getSmState() || !b[e])) {
				n += "/yd";
				a += "/yd"
			}
			i = t ? n : a;
			return i
		};
		return function (t, i, n, s, a) {
			if (!this.__run) {
				this._$init();
				this.__run = 1
			}
			var r = e(t, a);
			return this.__createDataAndSend(t, i, r, n, s)
		}
	}();
	c._addRtid = function (e) {
		s._$addUtid();
		var t = "&";
		if (e.indexOf("?") == -1) {
			e += "?";
			t = ""
		}
		e = e + t + "rtid=" + window._$RTID;
		return e
	};
	c._addTopURL = function (e) {
		var t = "&";
		if (e.indexOf("?") == -1) {
			e += "?";
			t = ""
		}
		e = e + t + "topURL=" + encodeURIComponent(window._$TOPURL);
		return e
	};
	c._addPathB = function (e) {
		if (window._$pathB) e = e.replace(/:\/\/(?:[^\/]+)/, function (e) {
			return e + "/b"
		});
		return e
	};
	c._addOpdAndOpkid = function (e) {
		if (!window._$URSOPT.opd && !window._$URSOPT.opkid) return e;
		var t = "&";
		if (e.indexOf("?") == -1) {
			e += "?";
			t = ""
		}
		if (window._$URSOPT.opd) e = e + t + "opd=" + window._$URSOPT.opd;
		if (window._$URSOPT.opkid) e = e + "&opkid=" + window._$URSOPT.opkid;
		return e
	};
	c._getHost = function (e) {
		var t = location.host + e;
		return t
	};
	c._addParams = function (e) {
		e = this._addPathB(e);
		e = this._addOpdAndOpkid(e);
		e = this._addRtid(e);
		e = this._addTopURL(e);
		return e
	};
	c._addParamsForRegCap = function (e) {
		s._$addUtid();
		var t = {
			channel: e,
			rtid: window._$RTID,
			pd: window._$URSOPT.product,
			pkid: window._$URSOPT.promark
		};
		return t
	};
	c._addParamsForLoginCap = function (e, t) {
		s._$addUtid();
		var i = {
			channel: e,
			rtid: window._$RTID,
			pd: window._$URSOPT.product,
			pkid: window._$URSOPT.promark
		};
		if (1 === t) i.pkht = window._$URSOPT.host;
		if (window._$URSOPT.opd) i.opd = window._$URSOPT.opd;
		if (window._$URSOPT.opkid) i.opkid = window._$URSOPT.opkid;
		return i
	};
	c["getCaptchaSm"] = function () {
		var e = this._getHost("/zc/zj/mail");
		var t = this._addParamsForRegCap(2);
		t = s._$sm4Encrypt(t);
		var i = m + e + "/cp?encParams=" + t + "&nocache=" + (new Date).getTime();
		return i
	};
	c["getCaptcha"] = function () {
		if (s._$getSmState()) return c["getCaptchaSm"]();
		var e = this._getHost("/zc");
		var t = m + e + "/cp?channel=2&nocache=" + (new Date).getTime();
		t = this._addRtid(t);
		t = this._addTopURL(t);
		t = s._$addPdAndPkid(t);
		return t
	};
	c["getCaptchaLoginSm"] = function () {
		var e = window._$pathB ? "/b/dl/zj/mail" : "/dl/zj/mail";
		var t = this._getHost(e);
		var i = this._addParamsForLoginCap(0);
		i = s._$sm4Encrypt(i);
		var n = m + t + "/cp?encParams=" + i + "&nocache=" + (new Date).getTime();
		return n
	};
	c["getCaptchaLogin"] = function () {
		if (s._$getSmState()) return c["getCaptchaLoginSm"]();
		var e = this._getHost("/dl");
		var t = m + e + "/cp?&channel=0&random=" + (new Date).getTime();
		t = this._addParams(t);
		t = s._$addPdAndPkid(t);
		return t
	};
	c["mb-cp-sm"] = function (e) {
		var t = window._$pathB ? "/b/dl/zj/yd" : "/dl/zj/yd";
		var i = this._getHost(t);
		var n = this._addParamsForLoginCap(e);
		n = s._$sm4Encrypt(n);
		var a = m + i + "/cp?encParams=" + n + "&nocache=" + (new Date).getTime();
		return a
	};
	c["mb-cp"] = function (e, t, i, n) {
		if (s._$getSmState()) return c["mb-cp-sm"](n);
		var a = this._getHost("/dl");
		var r = m + a + "/yd/cp?&channel=" + n + "&random=" + (new Date).getTime();
		r = this._addParams(r);
		r = s._$addPdAndPkid(r);
		return r
	};
	c["mb-reg-cp-sm"] = function () {
		var e = this._getHost("/zc/zj/yd");
		var t = this._addParamsForRegCap(3);
		t = s._$sm4Encrypt(t);
		var i = m + e + "/cp?encParams=" + t + "&nocache=" + (new Date).getTime();
		return i
	};
	c["mb-reg-cp"] = function () {
		if (s._$getSmState()) return c["mb-reg-cp-sm"]();
		var e = this._getHost("/zc");
		var t = m + e + "/yd/cp?channel=3&nocache=" + (new Date).getTime();
		t = this._addRtid(t);
		t = this._addTopURL(t);
		t = s._$addPdAndPkid(t);
		return t
	};
	c["mb-ncp-sm"] = function () {
		var e = window._$pathB ? "/b/dl/dlzc/yd" : "/dl/dlzc/yd";
		var t = this._getHost(e);
		var i = this._addParamsForLoginCap(14, 1);
		i = s._$sm4Encrypt(i);
		var n = m + t + "/cp?encParams=" + i + "&nocache=" + (new Date).getTime();
		return n
	};
	c["mb-ncp"] = function (e) {
		if (s._$getSmState()) return c["mb-ncp-sm"]();
		var t = this._getHost("/dl");
		var i = m + t + "/yd/ncp?channel=14&pd=" + e.product + "&pkid=" + e.pkid + "&pkht=" + e.pkht + "&random=" + (new Date).getTime();
		i = this._addParams(i);
		return i
	};
	c._$parseApi = function () {
		var e = {
			vfsmsup: {
				path: "/vfsmsup",
				type: "GET",
				isLogin: 0,
				channel: 2
			},
			regvftcp: {
				path: "/vftcp",
				type: "GET",
				isLogin: 0,
				channel: 2
			},
			regvfccp: {
				path: "/vfccp",
				type: "GET",
				isLogin: 0,
				channel: 2
			},
			regvfscp: {
				path: "/vfscp",
				type: "GET",
				isLogin: 0,
				channel: 2
			},
			init: {
				path: "/ini",
				type: "GET",
				isLogin: 0,
				isInit: 1,
				channel: 2
			},
			checkCaptcha: {
				path: "/vfcp",
				type: "POST",
				contentType: "application/x-www-form-urlencoded",
				isLogin: 0,
				channel: 2
			},
			checkName: {
				path: "/chn",
				type: "GET",
				isLogin: 0,
				channel: 2
			},
			getMailSms: {
				path: "/mlrgsm",
				type: "GET",
				isLogin: 0,
				channel: 2
			},
			getTicket: {
				path: "/gt",
				type: "POST",
				contentType: "application/json",
				isLogin: 0,
				channel: 2
			},
			fastReg: {
				path: "/frg",
				type: "POST",
				contentType: "application/json",
				isLogin: 0,
				channel: 2
			},
			sendActMail: {
				path: "/sendActMail",
				type: "GET",
				isLogin: 0,
				channel: 2
			},
			qrlogin: {
				path: "/qrcodel",
				type: "GET",
				isLogin: 1,
				channel: 3
			},
			safelogin: {
				path: "/l",
				type: "POST",
				isLogin: 1,
				channel: 0
			},
			llp: {
				path: "/llp",
				type: "POST",
				contentType: "application/x-www-form-urlencoded",
				isLogin: 1,
				channel: 0
			},
			sendSmsLogin: {
				path: "/sm",
				type: "GET",
				isLogin: 1,
				channel: 0
			},
			initComponentLogin: {
				path: "/ini",
				type: "GET",
				isLogin: 1,
				isInit: 1,
				channel: 0
			},
			checkSmsCode: {
				path: "/vfcp",
				type: "POST",
				contentType: "application/x-www-form-urlencoded",
				isLogin: 1,
				channel: 0
			},
			vfsms: {
				path: "/vfsms",
				type: "POST",
				contentType: "application/x-www-form-urlencoded",
				isLogin: 1,
				channel: 0
			},
			getLoginTicket: {
				path: "/gt",
				type: "GET",
				isLogin: 1,
				channel: 0
			},
			vftcp: {
				path: "/vftcp",
				type: "GET",
				isLogin: 1,
				channel: 0
			},
			vfccp: {
				path: "/vfccp",
				type: "GET",
				isLogin: 1,
				channel: 0
			},
			vfscp: {
				path: "/vfscp",
				type: "GET",
				isLogin: 1,
				channel: 0
			},
			getPP: {
				path: "/pp",
				type: "GET",
				isLogin: 1,
				channel: 0
			},
			vfppc: {
				path: "/vfppc",
				type: "POST",
				contentType: "application/x-www-form-urlencoded",
				isLogin: 1,
				channel: 0
			},
			vfotp: {
				path: "/vfotp",
				type: "POST",
				contentType: "application/x-www-form-urlencoded",
				isLogin: 1,
				channel: 0
			},
			mbsm: {
				path: "/mbsm",
				type: "GET",
				isLogin: 1,
				channel: 0
			},
			vfmbsms: {
				path: "/vfmbsms",
				type: "POST",
				contentType: "application/x-www-form-urlencoded",
				isLogin: 1,
				channel: 0
			},
			goonlog: {
				path: "/go",
				type: "GET",
				isLogin: 1,
				channel: 0
			},
			"mb-qrlogin": {
				path: "/qrcodel",
				type: "GET",
				isLogin: 1,
				channel: 4
			},
			"mb-login": {
				path: "/lpwd",
				type: "POST",
				isLogin: 1,
				channel: 1
			},
			"mb-gt": {
				path: "/gt",
				type: "GET",
				isLogin: 1,
				channel: 1
			},
			"mb-ini": {
				path: "/ini",
				type: "GET",
				isLogin: 1,
				isInit: 1,
				channel: 1
			},
			"mb-vfcp": {
				path: "/vfcp",
				type: "POST",
				contentType: "application/x-www-form-urlencoded",
				isLogin: 1,
				channel: 1
			},
			"mb-lvfsms": {
				path: "/lvfsms",
				type: "POST",
				isLogin: 1,
				channel: 2
			},
			"mb-vftcp": {
				path: "/vftcp",
				type: "GET",
				isLogin: 1,
				channel: 1
			},
			"mb-vfccp": {
				path: "/vfccp",
				type: "GET",
				isLogin: 1,
				channel: 1
			},
			"mb-vfscp": {
				path: "/vfscp",
				type: "GET",
				isLogin: 1,
				channel: 1
			},
			"mb-sms-lsm": {
				path: "/lsm",
				type: "GET",
				isLogin: 1,
				channel: 2
			},
			"mb-reg-ini": {
				path: "/ini",
				type: "GET",
				isLogin: 0,
				isInit: 1,
				channel: 3
			},
			"mb-reg-sm": {
				path: "/sm",
				type: "GET",
				isLogin: 0,
				channel: 3
			},
			"mb-reg-vfsms": {
				path: "/vfsms",
				type: "POST",
				isLogin: 0,
				channel: 3
			},
			"mb-nini": {
				path: "/nini",
				type: "GET",
				isLogin: 1,
				isInit: 1,
				channel: 14
			},
			"mb-nlregssms": {
				path: "/nlregssms",
				type: "GET",
				isLogin: 1,
				channel: 14
			},
			"mb-nlgt": {
				path: "/nlgt",
				type: "GET",
				isLogin: 1,
				channel: 14
			},
			"mb-nlregvfsms": {
				path: "/nlregvfsms",
				type: "POST",
				isLogin: 1,
				channel: 14
			},
			"mb-nvfcp": {
				path: "/nvfcp",
				type: "POST",
				contentType: "application/x-www-form-urlencoded",
				isLogin: 1,
				channel: 14
			},
			"mb-nvfscp": {
				path: "/nvfscp",
				type: "GET",
				isLogin: 1,
				channel: 14
			},
			"mb-nvftcp": {
				path: "/nvftcp",
				type: "GET",
				isLogin: 1,
				channel: 14
			},
			"mb-nvfccp": {
				path: "/nvfccp",
				type: "GET",
				isLogin: 1,
				channel: 14
			}
		};
		return function (t) {
			if (s._$getSmState()) return b[t] || e[t] || {};
			else return e[t] || {}
		}
	}();
	c.__createDataAndSend = function () {
		var e = function (e) {
			try {
				e.topURL = window._$TOPURL
			} catch (t) {
				return
			}
		};
		return function (t, i, n, a, r) {
			var o = this._$parseApi(t);
			n += o.path;
			var c = o.isLogin;
			var d = o.isInit || "";
			var _ = o.channel;
			if ("string" == typeof i) i = JSON.parse(i);
			if ("undefined" == typeof i.channel) i.channel = _;
			if (s._$isIPV6())
				if ("safelogin" === t || "llp" === t || "qrlogin" === t || "mb-qrlogin" === t || "mb-login" === t || "mb-nlregvfsms" === t || "mb-lvfsms" === t || "fastReg" === t || "mb-reg-vfsms" === t) i.v6 = 1;
			e(i);
			var l = o.contentType || "application/json";
			if (!c) n = m + n;
			else {
				n = m + n;
				if (c) {
					if (window._$URSOPT.opd) i.opd = window._$URSOPT.opd;
					if (window._$URSOPT.opkid) i.opkid = window._$URSOPT.opkid;
					n = this._addPathB(n)
				}
			}
			var u = {
				isInit: d,
				url: n,
				type: o.type,
				data: i,
				contentType: l,
				isLogin: c,
				onerror: r,
				onload: a
			};
			return this.__doSend(u, o.path, t)
		}
	}();
	c.__doSend = function () {
		var e = function () {
			var e = ["device_name", "user_agent", "language", "color_depth", "pixel_ratio", "hardware_concurrency", "computer_screen", "browser_window_size", "timezone_offset", "regular_plugins", "js_fonts", "webgl_vendor", "touch_support", "canvas", "webgl", "HTTP_ACCEPT_Headers"];
			var t = ["dn", "ua", "la", "cd", "pr", "hc", "cs", "bws", "tzo", "plg", "jsf", "wv", "ts", "ca", "wgl", "hah"];
			var i = function (e) {
				var t, i;
				if (e && e.di) {
					t = JSON.parse(e.di);
					if (t.plg) {
						i = t.plg;
						for (var n = 0, s = i.length, a; n < s; n++) {
							a = i[n];
							a = a.split(":")[0];
							i[n] = a
						}
					}
					t.plg = i;
					e.di = JSON.stringify(t)
				}
				return e
			};
			var n = function () {
				s._$postMessage("_parent", {
					data: {
						type: "webInitOk",
						rtid: window._$RTID || "",
						ursfp: a._$cookie("NTES_WEB_FP") || ""
					}
				})
			};
			var o = function (e) {
				n();
				e.src = "WEBZJ";
				e.time = (new Date).getTime();
				var t = "//fl.reg.163.com/urs/__utm.gif?";
				var a = [];
				e = i(e);
				for (var r in e) a.push(encodeURIComponent(r) + "=" + encodeURIComponent(e[r]));
				t += a.join("&");
				s._$sendLog(t)
			};
			var c = function (e, t) {
				var i = {};
				var n = {
					page: 2
				};
				var s = a._$cookie("NTES_WEB_FP");
				n["fp"] = s || "";
				i.di = JSON.stringify(n);
				i.utid = e;
				i.rtid = t;
				o(i)
			};
			var d = function (i, n) {
				try {
					var s = new Fingerprint2;
					s.get(function (c, d) {
						var _ = {}, l = {}, u = {}, f, h = [],
							p = a._$cookie("NTES_WEB_FP");
						if (p) c = p || "";
						else a._$cookie("NTES_WEB_FP", {
							value: c || "",
							expires: 30,
							path: "/"
						});
						_["fp"] = c || "";
						for (var m = 0, g; m < d.length; m++) {
							g = d[m];
							l[g.key] = g.value
						}
						for (var b = 0, v, $, y = e.length; b < y; b++) {
							v = e[b];
							$ = t[b];
							_[$] = l[v] || ""
						}
						f = _["jsf"];
						h = [];
						for (var C = 0, w; C < f.length; C++) {
							w = f[C];
							var x = w.substring(0, 1);
							h.push(x)
						}
						f = h.join("");
						_["jsf"] = f.length + "-" + r._$sha12b64(f);
						_["ca"] = s.x64hash128(_["ca"]);
						_["wgl"] = s.x64hash128(_["wgl"]);
						_.page = 1;
						_ = JSON.stringify(_);
						u.di = _;
						u.utid = i;
						u.rtid = n;
						o(u)
					})
				} catch (d) {
					c(i, n)
				}
			};
			return function (e, t) {
				d(e, t)
			}
		}();
		var t = function () {
			var e = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
				t = 32,
				i = [];
			for (; t-- > 0;) i[t] = e.charAt(Math.random() * e.length);
			return i.join("")
		};
		var o = function (e, t) {
			if (!s._$isIPV6()) try {
				var i, n = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 24, 25, 20400, 20500];
				var a = "https://pr.nss.netease.com/sentry/passive?uapi=" + encodeURIComponent(e);
				var r = e.indexOf("dl-") > -1 ? 1 : 0;
				var o = 1;
				if (window._$URSOPT.needSendLog) {
					i = c(t);
					a = a + "&dataTime=" + (new Date).getTime() + "&clusterName=urs-webzj-static-passive&modelName=webzj_response_time2&one=1&isLogin=" + r + "&isBGP=" + u + "&isNew=" + o;
					for (var d = 0, _ = n.length, l; d < _; d++) {
						l = n[d];
						if (l == i) a = a + "&step" + l + "=1";
						else a = a + "&step" + l + "=0"
					}
					s._$sendLog(a)
				}
			} catch (f) { }
		};
		var c = function (e) {
			var t = 1;
			if (e > 2e4)
				if (20400 == e || 20500 == e) t = e;
				else if (e.toString().indexOf("4") > -1) t = 24;
				else if (e.toString().indexOf("5") > -1) t = 25;
				else t = 10;
			else if (e > 1e4) t = 9;
			else if (e > 2e3) t = 8;
			else if (e > 1e3) t = 7;
			else if (e > 500) t = 6;
			else if (e > 200) t = 5;
			else if (e > 90) t = 4;
			else if (e > 60) t = 3;
			else if (e > 30) t = 2;
			return t
		};
		return function (r, c, d) {
			r = r || {};
			var _ = s._$addUtid();
			if (r.isInit) {
				this._$clearAllAjax();
				window._$RTID = t();
				a._$cookie("webzjcookiecheck", {
					value: 1,
					expires: -1,
					path: "/"
				});
				a._$cookie("webzjcookiecheck", {
					value: 1,
					expires: 1 / 24,
					path: "/"
				});
				if (!a._$cookie("webzjcookiecheck")) {
					r.onerror({
						ret: "-401"
					});
					return
				} else a._$cookie("webzjcookiecheck", {
					value: 1,
					expires: -1,
					path: "/"
				});
				e(_, window._$RTID)
			}
			if (r.data) r.data.rtid = window._$RTID;
			var l = r.type.toUpperCase();
			var f = {};
			if (s._$getSmState() && b[d]) r.data = {
				encParams: s._$sm4Encrypt(r.data)
			};
			f["Content-Type"] = r.contentType || "application/json";
			var h = 2e4;
			var p = r.url.indexOf("/yd/") >= 0 ? "yd-" + c : c;
			p = p.replace(/\//g, "");
			p = (r.isLogin ? "dl-" : "zc-") + p;
			u = /\/\/([^\.]+2\..+\/:?)/.test(r.url) ? 1 : 0;
			var m = (new Date).getTime();
			if ("POST" == l)
				if ("application/x-www-form-urlencoded" == r.contentType) r.data = i._$object2query(r.data);
				else r.data = JSON.stringify(r.data);
			if ("GET" == l) r.data.nocache = m;
			if (1 === window._$URSOPT.APILOG) s._$doLog(c, r.data);
			var v = n._$request(r.url, {
				type: "json",
				method: l,
				data: r.data,
				headers: f,
				timeout: h,
				onload: function (e, t, i, n, s) {
					if ("" === s || null === s) s = {};
					var a = s && s.ret;
					var r = (new Date).getTime() - e;
					o(t, r);
					if (i.isLogin)
						if ("201" != a) this.__onerror(n, i, s);
						else this.__onsuccess(n, i, s);
					else if ("102" === a || "104" === a || "200" === a || "201" === a || "202" === a) this.__onsuccess(n, i, s);
					else this.__onerror(n, i, s)
				}._$bind(this, m, p, r, c),
				onerror: function (e, t, i, n, a) {
					if ("" === a || null === a) a = {};
					if (0 !== a.data || void 0 !== a.result) {
						if (a && a.data) a.ret = a.data;
						else a.ret = "-1";
						var r = (new Date).getTime() - e;
						o(t, r);
						try {
							s._$sendApm(i.url, a.ret)
						} catch (c) { }
						var d = s._$getHttpCodeTxt(a.ret);
						a.ret = "httpcode-" + a.ret;
						if ("/zj/mail/go" !== n) s._$showFail2(d);
						s._$setIsHttpCode(1);
						this.__onerror(n, i, a);
						s._$setIsHttpCode(0)
					}
				}._$bind(this, m, p, r, c)
			});
			g.push(v);
			return v
		}
	}();
	c.__sendParentData = function (e, t) {
		if (p[e]) {
			var i = {
				data: {}
			};
			var n = t.ret || -1;
			i.data["URS-CM"] = 1;
			i.data["URS-CM-STATE"] = p[e][n] || {
				ret: -1
			};
			if (t.unprotectedGuide) p[e][n].unprotectedGuide = 1;
			i.data["URS-CM-STATENAME"] = p[e].name;
			s._$postMessage("_parent", i)
		}
	};
	c.__onerror = function (e, t, i) {
		this.__sendParentData(e, i);
		if ("601" == i.ret) s._$setOutLogin(1);
		t.onerror(i)
	};
	c.__onsuccess = function (e, t, i) {
		this.__sendParentData(e, i);
		t.onload(i)
	};
	c._$clearAllAjax = function () {
		try {
			i._$forEach(g, function (e) {
				try {
					n._$abort(e)
				} catch (t) { }
			});
			g = []
		} catch (e) { }
	};
	return c
}, "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "8fd03edddb19cf8c294f56ca6638c475", "9a2eeb6403e6ff7ded02a3eabd637af9", "a4de926c2d79e8d8f856eaff4dac0f8b", "54120fa727d71cd38f3b1273d034afef", "58c544ea4fe5292e5520436314a60716", "0a1f43423259f38e3b62bed150ead0f8");
I$("53c267efd983fb8c66cb645beead7a8d", function (e, t, i, n, s, a, r, o, c, d, _, l, u) {
	var f = [];
	var h = ["un", "userName"];
	d._$request = function (e, t, n, s, r) {
		if (e.indexOf("mb-") < 0 && !r) t = d.__unToLow(t);
		if (i._$indexOf(["vfscp", "regvfscp", "mb-vfscp", "mb-nvfscp"], e) !== -1) delete t.capkey;
		if (i._$indexOf(["mb-sms-lsm", "mb-nlregssms", "sendSmsLogin"], e) !== -1)
			if (window._$URSOPT.client_id) t.client_id = window._$URSOPT.client_id;
		if (o._$parseApi(e).isInit) {
			a._$clearFail5();
			d._$clearApiStoListByInit()
		}
		d._$sendReqReal(e, t, n, s, r)
	};
	d.__unToLow = function (e) {
		i._$forEach(h, function (t) {
			var i = e[t];
			if (i) e[t] = i.toLowerCase()
		});
		return e
	};
	d._$sendReqReal = function (e, t, i, n, s) {
		if (a._$isNewRequest()) {
			if (window._$URS.needChromeHack) t.othersite = !0;
			return o._$request(e, t, i, n, s)
		} else return r._$request(e, t, i, n, s)
	};
	d._$clearApiStoListByInit = function () {
		i._$forEach(f, function (e) {
			clearTimeout(e)
		});
		f = []
	};
	d._$clearTimeoutAndAjax = function () {
		d._$clearApiStoListByInit();
		if (a._$isNewRequest()) o._$clearAllAjax();
		else r._$clearAllAjax()
	};
	d._$abort = function (e) {
		return n._$abort(e)
	};
	return d
}, "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "8fd03edddb19cf8c294f56ca6638c475", "9a2eeb6403e6ff7ded02a3eabd637af9", "8f33f2dc03528616b29dd40cc05162ac", "a4de926c2d79e8d8f856eaff4dac0f8b", "ae8136e351bba7de76cf9b8b49bb9488", "24608969b225d7ff9edd983af51d1473", "54120fa727d71cd38f3b1273d034afef");
! function e(t, i) {
	"object" == typeof exports && "object" == typeof module ? module.exports = i() : "function" == typeof define && define.amd ? define("URSSM4", [], i) : "object" == typeof exports ? exports.URSSM4 = i() : t.URSSM4 = i()
}(self, function () {
	function e(n) {
		var s = i[n];
		if (void 0 !== s) return s.exports;
		s = i[n] = {
			exports: {}
		};
		return t[n](s, s.exports, e), s.exports
	}
	return t = {
		7228: function (e) {
			e.exports = function (e, t) {
				(null == t || t > e.length) && (t = e.length);
				for (var i = 0, n = new Array(t); i < t; i++) n[i] = e[i];
				return n
			}, e.exports["default"] = e.exports, e.exports.__esModule = !0
		},
		3646: function (e, t, i) {
			var n = i(7228);
			e.exports = function (e) {
				if (Array.isArray(e)) return n(e)
			}, e.exports["default"] = e.exports, e.exports.__esModule = !0
		},
		6860: function (e) {
			e.exports = function (e) {
				if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e)
			}, e.exports["default"] = e.exports, e.exports.__esModule = !0
		},
		8206: function (e) {
			e.exports = function () {
				throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
			}, e.exports["default"] = e.exports, e.exports.__esModule = !0
		},
		319: function (e, t, i) {
			var n = i(3646),
				s = i(6860),
				a = i(379),
				r = i(8206);
			e.exports = function (e) {
				return n(e) || s(e) || a(e) || r()
			}, e.exports["default"] = e.exports, e.exports.__esModule = !0
		},
		379: function (e, t, i) {
			var n = i(7228);
			e.exports = function (e, t) {
				if (e) {
					if ("string" == typeof e) return n(e, t);
					var i = Object.prototype.toString.call(e).slice(8, -1);
					return "Map" === (i = "Object" === i && e.constructor ? e.constructor.name : i) || "Set" === i ? Array.from(e) : "Arguments" === i || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i) ? n(e, t) : void 0
				}
			}, e.exports["default"] = e.exports, e.exports.__esModule = !0
		},
		9579: function (e, t, i) {
			function n(e) {
				for (var t = [], i = 0, n = e.length; i < n; i += 2) t.push(parseInt(e.substr(i, 2), 16));
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
				var c = 3 < arguments.length && void 0 !== s ? s : {}, u = c.padding,
					h = void 0 === u ? "pkcs#5" : u,
					p = c.mode,
					u = c.iv,
					u = void 0 === u ? [] : u,
					c = c.output,
					c = void 0 === c ? "string" : c;
				if ("cbc" === p && 16 !== (u = "string" == typeof u ? n(u) : u).length) throw new Error("iv is invalid");
				if (16 !== (t = "string" == typeof t ? n(t) : t).length) throw new Error("key is invalid");
				if (e = ("string" == typeof e ? i !== _ ? function (e) {
					for (var t = [], i = 0, n = e.length; i < n; i++) {
						var s = e.codePointAt(i);
						if (s <= 127) t.push(s);
						else if (s <= 2047) t.push(192 | s >>> 6), t.push(128 | 63 & s);
						else if (s <= 55295 || 57344 <= s && s <= 65535) t.push(224 | s >>> 12), t.push(128 | s >>> 6 & 63), t.push(128 | 63 & s);
						else {
							if (!(65536 <= s && s <= 1114111)) throw t.push(s), new Error("input is not supported");
							i++, t.push(240 | s >>> 18 & 28), t.push(128 | s >>> 12 & 63), t.push(128 | s >>> 6 & 63), t.push(128 | 63 & s)
						}
					}
					return t
				} : n : d)(e), "pkcs#5" === h && i !== _)
					for (var m = l - e.length % l, g = 0; g < m; g++) e.push(m);
				var b = new Array(32);
				! function (e, t, i) {
					for (var n = new Array(4), s = new Array(4), r = 0; r < 4; r++) s[0] = 255 & e[0 + 4 * r], s[1] = 255 & e[1 + 4 * r], s[2] = 255 & e[2 + 4 * r], s[3] = 255 & e[3 + 4 * r], n[r] = s[0] << 24 | s[1] << 16 | s[2] << 8 | s[3];
					n[0] ^= 2746333894, n[1] ^= 1453994832, n[2] ^= 1736282519, n[3] ^= 2993693404;
					for (var c, d = 0; d < 32; d += 4) c = n[1] ^ n[2] ^ n[3] ^ f[d + 0], t[d + 0] = n[0] ^= o(a(c)), c = n[2] ^ n[3] ^ n[0] ^ f[d + 1], t[d + 1] = n[1] ^= o(a(c)), c = n[3] ^ n[0] ^ n[1] ^ f[d + 2], t[d + 2] = n[2] ^= o(a(c)), c = n[0] ^ n[1] ^ n[2] ^ f[d + 3], t[d + 3] = n[3] ^= o(a(c));
					if (i === _)
						for (var l, u = 0; u < 16; u++) l = t[u], t[u] = t[31 - u], t[31 - u] = l
				}(t, b, i);
				for (var v = [], $ = u, y = e.length, C = 0; l <= y;) {
					var w = e.slice(C, C + 16),
						x = new Array(16);
					if ("cbc" === p)
						for (var T = 0; T < l; T++) i !== _ && (w[T] ^= $[T]);
					! function (e, t, i) {
						for (var n = new Array(4), s = new Array(4), o = 0; o < 4; o++) s[0] = 255 & e[4 * o], s[1] = 255 & e[4 * o + 1], s[2] = 255 & e[4 * o + 2], s[3] = 255 & e[4 * o + 3], n[o] = s[0] << 24 | s[1] << 16 | s[2] << 8 | s[3];
						for (var c, d = 0; d < 32; d += 4) c = n[1] ^ n[2] ^ n[3] ^ i[d + 0], n[0] ^= r(a(c)), c = n[2] ^ n[3] ^ n[0] ^ i[d + 1], n[1] ^= r(a(c)), c = n[3] ^ n[0] ^ n[1] ^ i[d + 2], n[2] ^= r(a(c)), c = n[0] ^ n[1] ^ n[2] ^ i[d + 3], n[3] ^= r(a(c));
						for (var _ = 0; _ < 16; _ += 4) t[_] = n[3 - _ / 4] >>> 24 & 255, t[_ + 1] = n[3 - _ / 4] >>> 16 & 255, t[_ + 2] = n[3 - _ / 4] >>> 8 & 255, t[_ + 3] = 255 & n[3 - _ / 4]
					}(w, x, b);
					for (var E = 0; E < l; E++) "cbc" === p && i === _ && (x[E] ^= $[E]), v[C + E] = x[E];
					"cbc" === p && ($ = i !== _ ? x : w), y -= l, C += l
				}
				return "pkcs#5" === h && i === _ && (h = v[v.length - 1], v.splice(v.length - h, h)), "array" !== c ? i !== _ ? v.map(function (e) {
					return 1 === (e = e.toString(16)).length ? "0" + e : e
				}).join("") : function (e) {
					for (var t = [], i = 0, n = e.length; i < n; i++) 240 <= e[i] && e[i] <= 247 ? (t.push(String.fromCodePoint(((7 & e[i]) << 18) + ((63 & e[i + 1]) << 12) + ((63 & e[i + 2]) << 6) + (63 & e[i + 3]))), i += 3) : 224 <= e[i] && e[i] <= 239 ? (t.push(String.fromCodePoint(((15 & e[i]) << 12) + ((63 & e[i + 1]) << 6) + (63 & e[i + 2]))), i += 2) : 192 <= e[i] && e[i] <= 223 ? (t.push(String.fromCodePoint(((31 & e[i]) << 6) + (63 & e[i + 1]))), i++) : t.push(String.fromCodePoint(e[i]));
					return t.join("")
				}(v) : v
			}
			var d = i(319);
			i(1058), i(9600), i(1249), i(3710), i(1539), i(9714), i(9841), i(4953), i(7042), i(561);
			var _ = 0,
				l = 16,
				u = [214, 144, 233, 254, 204, 225, 61, 183, 22, 182, 20, 194, 40, 251, 44, 5, 43, 103, 154, 118, 42, 190, 4, 195, 170, 68, 19, 38, 73, 134, 6, 153, 156, 66, 80, 244, 145, 239, 152, 122, 51, 84, 11, 67, 237, 207, 172, 98, 228, 179, 28, 169, 201, 8, 232, 149, 128, 223, 148, 250, 117, 143, 63, 166, 71, 7, 167, 252, 243, 115, 23, 186, 131, 89, 60, 25, 230, 133, 79, 168, 104, 107, 129, 178, 113, 100, 218, 139, 248, 235, 15, 75, 112, 86, 157, 53, 30, 36, 14, 94, 99, 88, 209, 162, 37, 34, 124, 59, 1, 33, 120, 135, 212, 0, 70, 87, 159, 211, 39, 82, 76, 54, 2, 231, 160, 196, 200, 158, 234, 191, 138, 210, 64, 199, 56, 181, 163, 247, 242, 206, 249, 97, 21, 161, 224, 174, 93, 164, 155, 52, 26, 85, 173, 147, 50, 48, 245, 140, 177, 227, 29, 246, 226, 46, 130, 102, 202, 96, 192, 41, 35, 171, 13, 83, 78, 111, 213, 219, 55, 69, 222, 253, 142, 47, 3, 255, 106, 114, 109, 108, 91, 81, 141, 27, 175, 146, 187, 221, 188, 127, 17, 217, 92, 65, 31, 16, 90, 216, 10, 193, 49, 136, 165, 205, 123, 189, 45, 116, 208, 18, 184, 229, 180, 176, 137, 105, 151, 74, 12, 150, 119, 126, 101, 185, 241, 9, 197, 110, 198, 132, 24, 240, 125, 236, 58, 220, 77, 32, 121, 238, 95, 62, 215, 203, 57, 72],
				f = [462357, 472066609, 943670861, 1415275113, 1886879365, 2358483617, 2830087869, 3301692121, 3773296373, 4228057617, 404694573, 876298825, 1347903077, 1819507329, 2291111581, 2762715833, 3234320085, 3705924337, 4177462797, 337322537, 808926789, 1280531041, 1752135293, 2223739545, 2695343797, 3166948049, 3638552301, 4110090761, 269950501, 741554753, 1213159005, 1684763257];
			e.exports = {
				encrypt: function (e, t, i) {
					return c(e, t, 1, i)
				},
				decrypt: function (e, t, i) {
					return c(e, t, 0, i)
				}
			}
		},
		9662: function (e, t, i) {
			var n = i(7854),
				s = i(614),
				a = i(6330),
				r = n.TypeError;
			e.exports = function (e) {
				if (s(e)) return e;
				throw r(a(e) + " is not a function")
			}
		},
		9670: function (e, t, i) {
			var n = i(7854),
				s = i(111),
				a = n.String,
				r = n.TypeError;
			e.exports = function (e) {
				if (s(e)) return e;
				throw r(a(e) + " is not an object")
			}
		},
		1318: function (e, t, i) {
			var n = i(5656),
				s = i(1400),
				a = i(6244),
				i = function (e) {
					return function (t, i, r) {
						var o, c = n(t),
							d = a(c),
							_ = s(r, d);
						if (e && i != i) {
							for (; _ < d;)
								if ((o = c[_++]) != o) return !0
						} else
							for (; _ < d; _++)
								if ((e || _ in c) && c[_] === i) return e || _ || 0; return !e && -1
					}
				};
			e.exports = {
				includes: i(!0),
				indexOf: i(!1)
			}
		},
		2092: function (e, t, i) {
			var n = i(9974),
				s = i(1702),
				a = i(8361),
				r = i(7908),
				o = i(6244),
				c = i(5417),
				d = s([].push),
				s = function (e) {
					var t = 1 == e,
						i = 2 == e,
						s = 3 == e,
						_ = 4 == e,
						l = 6 == e,
						u = 7 == e,
						f = 5 == e || l;
					return function (h, p, m, g) {
						for (var b, v, $ = r(h), y = a($), C = n(p, m), w = o(y), x = 0, g = g || c, T = t ? g(h, w) : i || u ? g(h, 0) : void 0; x < w; x++)
							if ((f || x in y) && (v = C(b = y[x], x, $), e))
								if (t) T[x] = v;
								else if (v) switch (e) {
									case 3:
										return !0;
									case 5:
										return b;
									case 6:
										return x;
									case 2:
										d(T, b)
								} else switch (e) {
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
			var n = i(7293),
				s = i(5112),
				a = i(7392),
				r = s("species");
			e.exports = function (e) {
				return 51 <= a || !n(function () {
					var t = [];
					return (t.constructor = {})[r] = function () {
						return {
							foo: 1
						}
					}, 1 !== t[e](Boolean).foo
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
					}, 1)
				})
			}
		},
		206: function (e, t, i) {
			i = i(1702);
			e.exports = i([].slice)
		},
		7475: function (e, t, i) {
			var n = i(7854),
				s = i(3157),
				a = i(4411),
				r = i(111),
				o = i(5112)("species"),
				c = n.Array;
			e.exports = function (e) {
				var t;
				return s(e) && (t = e.constructor, (a(t) && (t === c || s(t.prototype)) || r(t) && null === (t = t[o])) && (t = void 0)), void 0 === t ? c : t
			}
		},
		5417: function (e, t, i) {
			var n = i(7475);
			e.exports = function (e, t) {
				return new (n(e))(0 === t ? 0 : t)
			}
		},
		4326: function (e, t, i) {
			var i = i(1702),
				n = i({}.toString),
				s = i("".slice);
			e.exports = function (e) {
				return s(n(e), 8, -1)
			}
		},
		648: function (e, t, i) {
			var n = i(7854),
				s = i(1694),
				a = i(614),
				r = i(4326),
				o = i(5112)("toStringTag"),
				c = n.Object,
				d = "Arguments" == r(function () {
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
			var n = i(2597),
				s = i(3887),
				a = i(1236),
				r = i(3070);
			e.exports = function (e, t) {
				for (var i = s(t), o = r.f, c = a.f, d = 0; d < i.length; d++) {
					var _ = i[d];
					n(e, _) || o(e, _, c(t, _))
				}
			}
		},
		8880: function (e, t, i) {
			var n = i(9781),
				s = i(3070),
				a = i(9114);
			e.exports = n ? function (e, t, i) {
				return s.f(e, t, a(1, i))
			} : function (e, t, i) {
				return e[t] = i, e
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
			var n = i(4948),
				s = i(3070),
				a = i(9114);
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
			var n = i(7854),
				i = i(111),
				s = n.document,
				a = i(s) && i(s.createElement);
			e.exports = function (e) {
				return a ? s.createElement(e) : {}
			}
		},
		8113: function (e, t, i) {
			i = i(5005);
			e.exports = i("navigator", "userAgent") || ""
		},
		7392: function (e, t, i) {
			var n, s, a = i(7854),
				r = i(8113),
				i = a.process,
				a = a.Deno,
				a = i && i.versions || a && a.version,
				a = a && a.v8;
			!(s = a ? 0 < (n = a.split("."))[0] && n[0] < 4 ? 1 : +(n[0] + n[1]) : s) && r && (!(n = r.match(/Edge\/(\d+)/)) || 74 <= n[1]) && (n = r.match(/Chrome\/(\d+)/)) && (s = +n[1]),
				e.exports = s
		},
		748: function (e) {
			e.exports = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"]
		},
		2109: function (e, t, i) {
			var n = i(7854),
				s = i(1236).f,
				a = i(8880),
				r = i(1320),
				o = i(3505),
				c = i(9920),
				d = i(4705);
			e.exports = function (e, t) {
				var i, _, l, u = e.target,
					f = e.global,
					h = e.stat,
					p = f ? n : h ? n[u] || o(u, {}) : (n[u] || {}).prototype;
				if (p)
					for (i in t) {
						if (_ = t[i], l = e.noTargetGet ? (l = s(p, i)) && l.value : p[i], !d(f ? i : u + (h ? "." : "#") + i, e.forced) && void 0 !== l) {
							if (typeof _ == typeof l) continue;
							c(_, l)
						} (e.sham || l && l.sham) && a(_, "sham", !0), r(p, i, _, e)
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
			var n = i(1702),
				s = i(9662),
				a = n(n.bind);
			e.exports = function (e, t) {
				return s(e), void 0 === t ? e : a ? a(e, t) : function () {
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
			var n = i(9781),
				s = i(2597),
				a = Function.prototype,
				r = n && Object.getOwnPropertyDescriptor,
				i = s(a, "name"),
				s = i && "something" === function () { }.name,
				r = i && (!n || r(a, "name").configurable);
			e.exports = {
				EXISTS: i,
				PROPER: s,
				CONFIGURABLE: r
			}
		},
		1702: function (e) {
			var t = Function.prototype,
				i = t.bind,
				n = t.call,
				s = i && i.bind(n);
			e.exports = i ? function (e) {
				return e && s(n, e)
			} : function (e) {
				return e && function () {
					return n.apply(e, arguments)
				}
			}
		},
		5005: function (e, t, i) {
			var n = i(7854),
				s = i(614);
			e.exports = function (e, t) {
				return arguments.length < 2 ? (i = n[e], s(i) ? i : void 0) : n[e] && n[e][t];
				var i
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
			var n = i(1702),
				s = i(7908),
				a = n({}.hasOwnProperty);
			e.exports = Object.hasOwn || function (e, t) {
				return a(s(e), t)
			}
		},
		3501: function (e) {
			e.exports = {}
		},
		4664: function (e, t, i) {
			var n = i(9781),
				s = i(7293),
				a = i(317);
			e.exports = !n && !s(function () {
				return 7 != Object.defineProperty(a("div"), "a", {
					get: function () {
						return 7
					}
				}).a
			})
		},
		8361: function (e, t, i) {
			var n = i(7854),
				s = i(1702),
				a = i(7293),
				r = i(4326),
				o = n.Object,
				c = s("".split);
			e.exports = a(function () {
				return !o("z").propertyIsEnumerable(0)
			}) ? function (e) {
				return "String" == r(e) ? c(e, "") : o(e)
			} : o
		},
		2788: function (e, t, i) {
			var n = i(1702),
				s = i(614),
				i = i(5465),
				a = n(Function.toString);
			s(i.inspectSource) || (i.inspectSource = function (e) {
				return a(e)
			}), e.exports = i.inspectSource
		},
		9909: function (e, t, i) {
			var n, s, a, r, o, c, d, _, l = i(8536),
				u = i(7854),
				f = i(1702),
				h = i(111),
				p = i(8880),
				m = i(2597),
				g = i(5465),
				b = i(6200),
				i = i(3501),
				v = "Object already initialized",
				$ = u.TypeError,
				u = u.WeakMap;
			d = l || g.state ? (n = g.state || (g.state = new u), s = f(n.get), a = f(n.has), r = f(n.set), o = function (e, t) {
				if (a(n, e)) throw new $(v);
				return t.facade = e, r(n, e, t), t
			}, c = function (e) {
				return s(n, e) || {}
			}, function (e) {
				return a(n, e)
			}) : (i[_ = b("state")] = !0, o = function (e, t) {
				if (m(e, _)) throw new $(v);
				return t.facade = e, p(e, _, t), t
			}, c = function (e) {
				return m(e, _) ? e[_] : {}
			}, function (e) {
				return m(e, _)
			}), e.exports = {
				set: o,
				get: c,
				has: d,
				enforce: function (e) {
					return d(e) ? c(e) : o(e, {})
				},
				getterFor: function (e) {
					return function (t) {
						var i;
						if (!h(t) || (i = c(t)).type !== e) throw $("Incompatible receiver, " + e + " required");
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
			var n = i(1702),
				s = i(7293),
				a = i(614),
				r = i(648),
				o = i(5005),
				c = i(2788),
				d = function () { }, _ = [],
				l = o("Reflect", "construct"),
				u = /^\s*(?:class|function)\b/,
				f = n(u.exec),
				h = !u.exec(d),
				p = function (e) {
					if (!a(e)) return !1;
					try {
						return l(d, _, e), !0
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
				if (!a(e)) return !1;
				switch (r(e)) {
					case "AsyncFunction":
					case "GeneratorFunction":
					case "AsyncGeneratorFunction":
						return !1
				}
				return h || !!f(u, c(e))
			} : p
		},
		4705: function (e, t, i) {
			var n = i(7293),
				s = i(614),
				a = /#|\.prototype\./,
				i = function (e, t) {
					e = o[r(e)];
					return e == d || e != c && (s(t) ? n(t) : !!t)
				}, r = i.normalize = function (e) {
					return String(e).replace(a, ".").toLowerCase()
				}, o = i.data = {}, c = i.NATIVE = "N",
				d = i.POLYFILL = "P";
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
			var n = i(7854),
				s = i(5005),
				a = i(614),
				r = i(7976),
				i = i(3307),
				o = n.Object;
			e.exports = i ? function (e) {
				return "symbol" == typeof e
			} : function (e) {
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
			var n = i(7392),
				i = i(7293);
			e.exports = !!Object.getOwnPropertySymbols && !i(function () {
				var e = Symbol();
				return !String(e) || !(Object(e) instanceof Symbol) || !Symbol.sham && n && n < 41
			})
		},
		8536: function (e, t, i) {
			var n = i(7854),
				s = i(614),
				i = i(2788),
				n = n.WeakMap;
			e.exports = s(n) && /native code/.test(i(n))
		},
		3009: function (e, t, i) {
			var n = i(7854),
				s = i(7293),
				a = i(1702),
				r = i(1340),
				o = i(3111).trim,
				i = i(1361),
				c = n.parseInt,
				n = n.Symbol,
				d = n && n.iterator,
				_ = /^[+-]?0x/i,
				l = a(_.exec),
				s = 8 !== c(i + "08") || 22 !== c(i + "0x16") || d && !s(function () {
					c(Object(d))
				});
			e.exports = s ? function u(e, t) {
				e = o(r(e));
				return c(e, t >>> 0 || (l(_, e) ? 16 : 10))
			} : c
		},
		3070: function (e, t, i) {
			var n = i(7854),
				s = i(9781),
				a = i(4664),
				r = i(9670),
				o = i(4948),
				c = n.TypeError,
				d = Object.defineProperty;
			t.f = s ? d : function (e, t, i) {
				if (r(e), t = o(t), r(i), a) try {
					return d(e, t, i)
				} catch (n) { }
				if ("get" in i || "set" in i) throw c("Accessors not supported");
				return "value" in i && (e[t] = i.value), e
			}
		},
		1236: function (e, t, i) {
			var n = i(9781),
				s = i(6916),
				a = i(5296),
				r = i(9114),
				o = i(5656),
				c = i(4948),
				d = i(2597),
				_ = i(4664),
				l = Object.getOwnPropertyDescriptor;
			t.f = n ? l : function (e, t) {
				if (e = o(e), t = c(t), _) try {
					return l(e, t)
				} catch (i) { }
				if (d(e, t)) return r(!s(a.f, e, t), e[t])
			}
		},
		8006: function (e, t, i) {
			var n = i(6324),
				s = i(748).concat("length", "prototype");
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
			var n = i(1702),
				s = i(2597),
				a = i(5656),
				r = i(1318).indexOf,
				o = i(3501),
				c = n([].push);
			e.exports = function (e, t) {
				var i, n = a(e),
					d = 0,
					_ = [];
				for (i in n) !s(o, i) && s(n, i) && c(_, i);
				for (; t.length > d;) s(n, i = t[d++]) && (~r(_, i) || c(_, i));
				return _
			}
		},
		5296: function (e, t) {
			"use strict";
			var i = {}.propertyIsEnumerable,
				n = Object.getOwnPropertyDescriptor,
				s = n && !i.call({
					1: 2
				}, 1);
			t.f = s ? function (e) {
				e = n(this, e);
				return !!e && e.enumerable
			} : i
		},
		288: function (e, t, i) {
			"use strict";
			var n = i(1694),
				s = i(648);
			e.exports = n ? {}.toString : function () {
				return "[object " + s(this) + "]"
			}
		},
		2140: function (e, t, i) {
			var n = i(7854),
				s = i(6916),
				a = i(614),
				r = i(111),
				o = n.TypeError;
			e.exports = function (e, t) {
				var i, n;
				if ("string" === t && a(i = e.toString) && !r(n = s(i, e))) return n;
				if (a(i = e.valueOf) && !r(n = s(i, e))) return n;
				if ("string" !== t && a(i = e.toString) && !r(n = s(i, e))) return n;
				throw o("Can't convert object to primitive value")
			}
		},
		3887: function (e, t, i) {
			var n = i(5005),
				s = i(1702),
				a = i(8006),
				r = i(5181),
				o = i(9670),
				c = s([].concat);
			e.exports = n("Reflect", "ownKeys") || function (e) {
				var t = a.f(o(e)),
					i = r.f;
				return i ? c(t, i(e)) : t
			}
		},
		1320: function (e, t, i) {
			var n = i(7854),
				s = i(614),
				a = i(2597),
				r = i(8880),
				o = i(3505),
				c = i(2788),
				d = i(9909),
				_ = i(6530).CONFIGURABLE,
				l = d.get,
				u = d.enforce,
				f = String(String).split("String");
			(e.exports = function (e, t, i, c) {
				var d = !!c && !!c.unsafe,
					l = !!c && !!c.enumerable,
					h = !!c && !!c.noTargetGet,
					p = c && void 0 !== c.name ? c.name : t;
				s(i) && ("Symbol(" === String(p).slice(0, 7) && (p = "[" + String(p).replace(/^Symbol\(([^)]*)\)/, "$1") + "]"), (!a(i, "name") || _ && i.name !== p) && r(i, "name", p), (c = u(i)).source || (c.source = f.join("string" == typeof p ? p : ""))), e !== n ? (d ? !h && e[t] && (l = !0) : delete e[t], l ? e[t] = i : r(e, t, i)) : l ? e[t] = i : o(t, i)
			})(Function.prototype, "toString", function () {
				return s(this) && l(this).source || c(this)
			})
		},
		7066: function (e, t, i) {
			"use strict";
			var n = i(9670);
			e.exports = function () {
				var e = n(this),
					t = "";
				return e.global && (t += "g"), e.ignoreCase && (t += "i"), e.multiline && (t += "m"), e.dotAll && (t += "s"), e.unicode && (t += "u"), e.sticky && (t += "y"), t
			}
		},
		4488: function (e, t, i) {
			var n = i(7854).TypeError;
			e.exports = function (e) {
				if (void 0 == e) throw n("Can't call method on " + e);
				return e
			}
		},
		3505: function (e, t, i) {
			var n = i(7854),
				s = Object.defineProperty;
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
			var n = i(2309),
				s = i(9711),
				a = n("keys");
			e.exports = function (e) {
				return a[e] || (a[e] = s(e))
			}
		},
		5465: function (e, t, i) {
			var n = i(7854),
				s = i(3505),
				i = "__core-js_shared__",
				s = n[i] || s(i, {});
			e.exports = s
		},
		2309: function (e, t, i) {
			var n = i(1913),
				s = i(5465);
			(e.exports = function (e, t) {
				return s[e] || (s[e] = void 0 !== t ? t : {})
			})("versions", []).push({
				version: "3.19.0",
				mode: n ? "pure" : "global",
				copyright: "© 2021 Denis Pushkarev (zloirock.ru)"
			})
		},
		8710: function (e, t, i) {
			var n = i(1702),
				s = i(9303),
				a = i(1340),
				r = i(4488),
				o = n("".charAt),
				c = n("".charCodeAt),
				d = n("".slice),
				n = function (e) {
					return function (t, i) {
						var n, _ = a(r(t)),
							l = s(i),
							t = _.length;
						return l < 0 || t <= l ? e ? "" : void 0 : (i = c(_, l)) < 55296 || 56319 < i || l + 1 === t || (n = c(_, l + 1)) < 56320 || 57343 < n ? e ? o(_, l) : i : e ? d(_, l, l + 2) : n - 56320 + (i - 55296 << 10) + 65536
					}
				};
			e.exports = {
				codeAt: n(!1),
				charAt: n(!0)
			}
		},
		3111: function (e, t, i) {
			var n = i(1702),
				s = i(4488),
				a = i(1340),
				i = i(1361),
				r = n("".replace),
				i = "[" + i + "]",
				o = RegExp("^" + i + i + "*"),
				c = RegExp(i + i + "*$"),
				i = function (e) {
					return function (t) {
						t = a(s(t));
						return 1 & e && (t = r(t, o, "")), t = 2 & e ? r(t, c, "") : t
					}
				};
			e.exports = {
				start: i(1),
				end: i(2),
				trim: i(3)
			}
		},
		1400: function (e, t, i) {
			var n = i(9303),
				s = Math.max,
				a = Math.min;
			e.exports = function (e, t) {
				e = n(e);
				return e < 0 ? s(e + t, 0) : a(e, t)
			}
		},
		5656: function (e, t, i) {
			var n = i(8361),
				s = i(4488);
			e.exports = function (e) {
				return n(s(e))
			}
		},
		9303: function (e) {
			var t = Math.ceil,
				i = Math.floor;
			e.exports = function (e) {
				e = +e;
				return e != e || 0 == e ? 0 : (0 < e ? i : t)(e)
			}
		},
		7466: function (e, t, i) {
			var n = i(9303),
				s = Math.min;
			e.exports = function (e) {
				return 0 < e ? s(n(e), 9007199254740991) : 0
			}
		},
		7908: function (e, t, i) {
			var n = i(7854),
				s = i(4488),
				a = n.Object;
			e.exports = function (e) {
				return a(s(e))
			}
		},
		7593: function (e, t, i) {
			var n = i(7854),
				s = i(6916),
				a = i(111),
				r = i(2190),
				o = i(8173),
				c = i(2140),
				i = i(5112),
				d = n.TypeError,
				_ = i("toPrimitive");
			e.exports = function (e, t) {
				if (!a(e) || r(e)) return e;
				var i = o(e, _);
				if (i) {
					if (void 0 === t && (t = "default"), i = s(i, e, t), !a(i) || r(i)) return i;
					throw d("Can't convert object to primitive value");
				}
				return void 0 === t && (t = "number"), c(e, t)
			}
		},
		4948: function (e, t, i) {
			var n = i(7593),
				s = i(2190);
			e.exports = function (e) {
				e = n(e, "string");
				return s(e) ? e : e + ""
			}
		},
		1694: function (e, t, i) {
			var n = {};
			n[i(5112)("toStringTag")] = "z", e.exports = "[object z]" === String(n)
		},
		1340: function (e, t, i) {
			var n = i(7854),
				s = i(648),
				a = n.String;
			e.exports = function (e) {
				if ("Symbol" === s(e)) throw TypeError("Cannot convert a Symbol value to a string");
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
			var i = i(1702),
				n = 0,
				s = Math.random(),
				a = i(1..toString);
			e.exports = function (e) {
				return "Symbol(" + (void 0 === e ? "" : e) + ")_" + a(++n + s, 36)
			}
		},
		3307: function (e, t, i) {
			i = i(133);
			e.exports = i && !Symbol.sham && "symbol" == typeof Symbol.iterator
		},
		5112: function (e, t, i) {
			var n = i(7854),
				s = i(2309),
				a = i(2597),
				r = i(9711),
				o = i(133),
				c = i(3307),
				d = s("wks"),
				_ = n.Symbol,
				l = _ && _["for"],
				u = c ? _ : _ && _.withoutSetter || r;
			e.exports = function (e) {
				var t;
				return a(d, e) && (o || "string" == typeof d[e]) || (t = "Symbol." + e, o && a(_, e) ? d[e] = _[e] : d[e] = (c && l ? l : u)(t)), d[e]
			}
		},
		1361: function (e) {
			e.exports = "\t\n\x0B\f\r                　\u2028\u2029\ufeff"
		},
		9600: function (e, t, i) {
			"use strict";
			var n = i(2109),
				s = i(1702),
				a = i(8361),
				r = i(5656),
				i = i(9341),
				o = s([].join),
				a = a != Object,
				i = i("join", ",");
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
			var n = i(2109),
				s = i(2092).map;
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
			var n = i(2109),
				s = i(7854),
				a = i(3157),
				r = i(4411),
				o = i(111),
				c = i(1400),
				d = i(6244),
				_ = i(5656),
				l = i(6135),
				u = i(5112),
				f = i(1194),
				h = i(206),
				f = f("slice"),
				p = u("species"),
				m = s.Array,
				g = Math.max;
			n({
				target: "Array",
				proto: !0,
				forced: !f
			}, {
				slice: function (e, t) {
					var i, n, s, u = _(this),
						f = d(u),
						b = c(e, f),
						v = c(void 0 === t ? f : t, f);
					if (a(u) && (i = u.constructor, (i = r(i) && (i === m || a(i.prototype)) || o(i) && null === (i = i[p]) ? void 0 : i) === m || void 0 === i)) return h(u, b, v);
					for (n = new (void 0 === i ? m : i)(g(v - b, 0)), s = 0; b < v; b++, s++) b in u && l(n, s, u[b]);
					return n.length = s, n
				}
			})
		},
		561: function (e, t, i) {
			"use strict";
			var n = i(2109),
				s = i(7854),
				a = i(1400),
				r = i(9303),
				o = i(6244),
				c = i(7908),
				d = i(5417),
				_ = i(6135),
				i = i(1194)("splice"),
				l = s.TypeError,
				u = Math.max,
				f = Math.min;
			n({
				target: "Array",
				proto: !0,
				forced: !i
			}, {
				splice: function (e, t) {
					var i, n, s, h, p, m, g = c(this),
						b = o(g),
						v = a(e, b),
						e = arguments.length;
					if (0 === e ? i = n = 0 : n = 1 === e ? (i = 0, b - v) : (i = e - 2, f(u(r(t), 0), b - v)), 9007199254740991 < b + i - n) throw l("Maximum allowed length exceeded");
					for (s = d(g, n), h = 0; h < n; h++)(p = v + h) in g && _(s, h, g[p]);
					if (i < (s.length = n)) {
						for (h = v; h < b - n; h++) m = h + i, (p = h + n) in g ? g[m] = g[p] : delete g[m];
						for (h = b; b - n + i < h; h--) delete g[h - 1]
					} else if (n < i)
						for (h = b - n; v < h; h--) m = h + i - 1, (p = h + n - 1) in g ? g[m] = g[p] : delete g[m];
					for (h = 0; h < i; h++) g[h + v] = arguments[h + 2];
					return g.length = b - n + i, s
				}
			})
		},
		3710: function (e, t, i) {
			var n = i(1702),
				s = i(1320),
				a = Date.prototype,
				r = "Invalid Date",
				i = "toString",
				o = n(a[i]),
				c = n(a.getTime);
			String(new Date(NaN)) != r && s(a, i, function () {
				var e = c(this);
				return e == e ? o(this) : r
			})
		},
		1539: function (e, t, i) {
			var n = i(1694),
				s = i(1320),
				i = i(288);
			n || s(Object.prototype, "toString", i, {
				unsafe: !0
			})
		},
		1058: function (e, t, i) {
			var n = i(2109),
				i = i(3009);
			n({
				global: !0,
				forced: parseInt != i
			}, {
				parseInt: i
			})
		},
		9714: function (e, t, i) {
			"use strict";
			var n = i(1702),
				s = i(6530).PROPER,
				a = i(1320),
				r = i(9670),
				o = i(7976),
				c = i(1340),
				d = i(7293),
				_ = i(7066),
				i = "toString",
				l = RegExp.prototype,
				u = l[i],
				f = n(_),
				d = d(function () {
					return "/a/b" != u.call({
						source: "a",
						flags: "b"
					})
				}),
				s = s && u.name != i;
			(d || s) && a(RegExp.prototype, i, function () {
				var e = r(this),
					t = c(e.source),
					i = e.flags;
				return "/" + t + "/" + c(void 0 !== i || !o(l, e) || "flags" in l ? i : f(e))
			}, {
				unsafe: !0
			})
		},
		9841: function (e, t, i) {
			"use strict";
			var n = i(2109),
				s = i(8710).codeAt;
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
			var n = i(2109),
				s = i(7854),
				a = i(1702),
				r = i(1400),
				o = s.RangeError,
				c = String.fromCharCode,
				s = String.fromCodePoint,
				d = a([].join);
			n({
				target: "String",
				stat: !0,
				forced: !!s && 1 != s.length
			}, {
				fromCodePoint: function (e) {
					for (var t, i = [], n = arguments.length, s = 0; s < n;) {
						if (t = +arguments[s++], r(t, 1114111) !== t) throw o(t + " is not a valid code point");
						i[s] = t < 65536 ? c(t) : c(55296 + ((t -= 65536) >> 10), t % 1024 + 56320)
					}
					return d(i, "")
				}
			})
		}
	}, i = {}, e.g = function () {
		if ("object" == typeof globalThis) return globalThis;
		try {
			return this || new Function("return this")()
		} catch (e) {
			if ("object" == typeof window) return window
		}
	}(), e(9579);
	var t, i
});
I$("46a4de3a50f50a600950ca9cee88031e", function (e, t, i, n, s, a, r, o, c) {
	var d = {
		"您需要同意相关条款才能使用": "Pleas agree the agreement",
		"使用密码验证登录": "Password login",
		"十天内免登录": "Ten days free login",
		"快捷登录": "Quick login",
		"《服务条款》": "Terms of Service",
		"《网易隐私政策》": "Privacy Policy",
		"请输入手机号": "Enter mobile number",
		"请输入短信验证码": "Enter sms",
		"登录": "login",
		"请您编辑短信": "Input this content",
		"发送到": "send to",
		"获取验证码，短信费用由运营商收取": "to get the sms code",
		"我同意": "I agree",
		"遇到问题": "Any question",
		"手机号码格式错误，请更换后重试": "Format error of phone number",
		"切换到国内手机": "To china mobile",
		"切换到国际手机": "To itlmobile",
		"短信验证码格式错误": "Format error of sms code",
		"秒后重发": "second retry",
		"获取验证码": "Get sms",
		"请先拖动滑块进行安全验证": "Drag the slider for security verification",
		"请先进行验证": "Verify first",
		"请输入图片验证码": "Enter image code",
		"图片验证码格式错误": "Wrong image code",
		"点击刷新图片": "Click to refresh image",
		"点击获取验证码": "Click to get",
		"点击刷新验证码": "Click to refresh image",
		"请滑动验证码": "Drag the slide",
		"按住滑块，拖动完成上方拼图": "Drag to complete the puzzle",
		"加载失败，请刷新页面重试": "Load fail, refresh the page",
		"请完成安全验证": "Complete security verification",
		"系统繁忙，请刷新重试": "System is busy, refresh and try again",
		"验证码异常，请稍后重试": "Verification code is abnormal, try again later",
		"切换手机号": "Change mobile",
		"和": "and",
		"我已发送": "Has send",
		"<切换手机号": "<Change mobile",
		"为了您的安全，请用": "Please use ",
		"发送短信进行验证，": " send sms to verfiy",
		"发送短信进行验证": " send sms to verfiy",
		"系统不会回复短信": "system will not reply",
		"，短信费用由运营商收取": "",
		"短信费用由运营商收取": " ",
		"前往发送短信": "send sms",
		"如果“前往发送短信”操作失败，请": "if send sms fail,",
		"手动发送短信": "send by youself",
		"试试手动发送吧": "Try hand",
		"编辑短信": "Edit sms",
		"发送至": "send to",
		"嫌手动发送麻烦？试试": "If manually is trouble, try ",
		"为了您的安全，请发送短信进行验证": "Please send sms to verfiy",
		"发送到": "send to",
		"系统不会回复短信，短信费用由运营商收取": "System will not reply",
		"扫码快速发送": "Scan to send",
		"请求错误": "Request error",
		"您需要同意相关条款才能登录": "Please agree the agreement",
		"请使用": "Use",
		"短信验证登录": "sms code to login",
		"检测出非法请求，为了您的帐号安全，请您稍后再试。": "Illegal request, try again later",
		"系统繁忙，请您稍后再试": "System busy, try later",
		"系统繁忙，请刷新页面重试": "System busy, refresh page",
		"服务器内部错误，请您稍后再试": "System error, try later",
		"请求错误，请您稍后再试": "Request error, try later",
		"帐号长期未使用已冻结，请": "The account has not been used for a long time and has been frozen,",
		"自助解冻": "do unlock",
		"验证失败，请再次点击###按钮": "Verify fail, click the ### button again",
		"忘记密码？": "Forget password?",
		"去注册": "Register",
		"请输入邮箱地址": "Enter email",
		"请输入密码": "Enter password",
		"验证码": "Image code",
		"请输入帐号": "Enter the account",
		"手机号输入有误": "Malformed phone number",
		"帐号格式错误": "Malformed account",
		"密码格式错误": "Malformed password",
		"正在登录...": "Login...",
		"其他方式登录": "Login ways",
		"登&nbsp;&nbsp;录": "Login",
		"您的帐号容易被盗": "Account is weak",
		"请立即验证手机号": "Please verify your phone",
		"返&nbsp;&nbsp;&nbsp;&nbsp;回": "Back",
		"加强保护": "Do protect",
		"帐号安全等级低": "The account low safe level",
		"建议你修改密码": "Recommend modify password",
		"继续登录": "Login",
		"修改密码": "Modify password",
		"请立即修改密码": "Modify your password",
		"密码错误次数过多，请稍后再试或": "Wrong password too much, try later or ",
		"找回密码？": "find password?",
		"多次输入错误，是否申请修复密码": "Wrong too much, recommend modify password ",
		"修复": "repair",
		"该帐号已被锁定，请前往": "Account has locked, go ",
		"帐号安全中心": "Account control center ",
		"申请解锁": "unlock",
		"当前登录环境有风险": "The login place is at risk",
		"请点击前往进行安全验证": "Click to verify",
		"建议你绑定手机": "Recommend bind mobile",
		"绑定手机": "Bind mobile",
		"验证码输入错误": "sms code error",
		"去登录>>": "Login",
		"下一步": "Next",
		"8-16位密码，字母+数字": "8-16number, number+letter",
		"您密码错误次数过多，我们锁定了您的帐号，请您输入手机验证码解锁或十分钟后再试": "Account is locked, please verify phone or try later",
		"《网易邮箱帐号服务条款》": " Netease account agreement",
		"请输入验证码": "Enter the image code",
		"16位大小写字母、数字、符号3种以上组合": "16bits，number、letter or Punctuation",
		"格式错误": "Format error",
		"请输入手机号或帐号": "Enter the mobile or accout",
		"不支持该类型邮箱注册": "Cannot register this email",
		"正在注册...": "Registering",
		"注&nbsp;&nbsp;册": "Register",
		"秒后自动登录": "s later to login",
		"您需要同意相关条款才能注册": "Need agree the agreements",
		"注册": "Register",
		"本次注册需要短信验证，请按以下提示操作": "Need to verify sms code",
		"您的操作存在异常，请您进行验证后继续注册": "Your action is exception, please verify to register",
		"注册成功": "Register success",
		"请激活帐号": "Active your account",
		"激活邮件已发到": "Active email has send to ",
		"邮箱，请在48小时内登录邮箱完成激活": ", please in 48h to do active the email",
		"如何激活": "How to active",
		"去激活": "Go to active",
		"没收到验证邮件": "Did not get the active mail",
		"尝试到广告邮件、垃圾邮件目录里找找看": "Try to find the junk mailbox",
		"再次发送": "send again ",
		"验证邮件": "active mail",
		"验证码格式错误": "wrong sms code",
		"如果重发激活邮件仍没收到，请更换邮箱": "If resend has not get, please change email ",
		"重新注册": "register again",
		"我已发送，注册": "Has send, register",
		"验证成功，正在注册...": "Verify success, registering...",
		"请获取短信验证码": "Please get the sms code",
		"网络异常，请稍后重试": "Network error, try later again",
		"验证码错误次数过多，请明天再试": "Wrong too many times, try tomorrow",
		"系统未收到短信或短信内容错误": "Didn't receive the sms or sms error",
		'请用字母、数字或下划线命名，<a href="//haoma.163.com/?from=zj" target="_blank">尝试注册</a>当前帐号？': "Please use letters or numbers",
		'帐号须由6-18个字符组成，<a href="//haoma.163.com/?from=zj" target="_blank">尝试注册</a>当前帐号？': "Account must be 6-18 characters",
		'帐号请以字母或数字结尾，<a href="//haoma.163.com/?from=zj" target="_blank">尝试注册</a>当前帐号？': "Account must end with a letter or number",
		'帐号须由字母开头，<a href="//haoma.163.com/?from=zj" target="_blank">尝试注册</a>当前帐号？': "Account must start with a letter",
		"请输入正确的验证码": "Enter the correct image code",
		"操作超时，请刷新页面重试": "Long time, refresh page",
		"网络不好，请刷新页面重试": "Network error, refresh page",
		"手机号格式错误": "Malformed phone number",
		"次数超限，请稍后再试": "Exceeded limit, try again later",
		"该帐号在考察期（24小时）内，请使用原手机号登录": "During the 24H inspection period, please login with your original mobile",
		"超过IP限制，请稍后再试": "Exceed the IP limit, try again later",
		"验证码错误超过限制，请稍后再试": "The verification code error exceeds the limit, try again later",
		"验证码发送超过限制，请改天再试": "Verification code sending exceeds the limit, try again another day",
		'该帐号已被锁定，<a target="_blank" href="https://aq.reg.163.com/ydaq/welcome?module=offAccountUnlock" style="color:#4aafe9;text-decoration:underline;">尝试解锁</a>。': 'The account is lock, <a target="_blank" href="https://aq.reg.163.com/ydaq/welcome?module=offAccountUnlock" style="color:#4aafe9;text-decoration:underline;">try do unlock</a>',
		'帐号长期未使用已冻结，请<a target="_blank" href="https://aq.reg.163.com/ydaq/welcome?module=offAccountAppeal">自助解冻</a>': 'The account has not been used for a long time and has been frozen, <a target="_blank" href="https://aq.reg.163.com/ydaq/welcome?module=offAccountAppeal">do unlock</a>',
		"手机号码请勿以“0”开头": "Don't start with '0' in your phone number",
		"该帐号正在注销中，无法登录": "The account is being logged out and cannot be logged in",
		"请先获取验证码": "Get the verification code first",
		"您的操作太频繁，请稍后再试": "Your operation is too frequent, try again later",
		"当前网络异常，请检查您的网络环境": "The current network is abnormal, check your network environment",
		"验证码验证错误次数过多，请稍后再试": "Too many verification code errors, try again later",
		"帐号或验证码错误": "Incorrect account or verification code",
		"您的IP登录过于频繁，请稍后再试": "Your IP login is too frequent, try again later",
		"该手机帐号未注册": "The mobile account is not registered",
		"您登录错误次数过多，请稍后再试": "You have logged in errors too many times, try again later",
		"您登录错误验证码次数过多，请稍后再试": "Verification code errors too many times, try again later",
		"您登录错误验证码次数过多，请明天再试": "Verification code errors too many times, try again tomorrow",
		"您的IP登录错误验证码次数过多，请稍后再试": "Login error verification code too many times, try again later",
		"您的IP登录错误次数过多，请稍后再试": "Login error is too many times, try again later",
		"您的IP登录成功次数过多，请稍后再试": "logged in too many times, try again later",
		"您登录成功次数过多，请稍后再试": "You have logged in too many times, try again later",
		"您登录过于频繁，请稍后再试": "You have logged in too often, try again later",
		"请输入正确的短信验证码": "Enter the correct SMS verification code",
		"<strong>系统未收到短信，请重新发送短信验证</strong>": "<strong>The system did not receive the SMS, resend the SMS verification</strong>",
		'请设置<a target="_blank" href="https://www.baidu.com/s?wd=safari%E5%BC%80%E5%90%AFcookie">浏览器接受第三方cookie</a>，或者更换浏览器尝试': '<a target="_blank" href="https://www.baidu.com/s?wd=safari%E5%BC%80%E5%90%AFcookie">set your browser to accept third-party cookies</a>, or change your browser to try',
		"服务器繁忙，请稍后再试": "Server is busy, try again later",
		"操作存在风险，请更换手机或切换网络后重试": "Risk detected, please change mobile or network",
		"您的网络不好，请刷新重试": "Network error, refresh page",
		"网络异常，请稍后再试": "Network error, try again later",
		"操作过于频繁，请稍后再试": "Your operation is too frequent, try again later",
		"正在加载，请稍后...": "Loading, please wait...",
		"该帐号无法使用，请更换后重试": "The account cannot be used, change and try again",
		"该手机无法使用，请更换后重试": "The phone cannot be used, change and try again",
		"您的网络环境存在风险，请更换网络": "Network error, try again later",
		"验证失败，请稍后再试": "Verify fail, try again later",
		"网络异常，请刷新页面重试": "Network error, refresh page",
		"系统繁忙，请稍后再试": "System is busy, try again later",
		"请稍候，正在跳转...": "loading...",
		"本次登录存在异常，请刷新重试或更换浏览器": "Login error, refresh or change browser",
		"网络异常，建议切换网络或稍后重试": "Network error, change and try again",
		"IP一分钟内登录不存在的用户达到限制，5分钟后再试": "Ip login times too many times，try later again",
		"帐号或密码错误": "Account or password error",
		'该帐号<a target="_blank" href="https://hc.reg.163.com/iTerm/doc.html?id=561">无法使用</a>，请重新注册其他帐号': 'The account <a target="_blank" href="https://hc.reg.163.com/iTerm/doc.html?id=561">cannot use</a>, please register another',
		"您登录错误次数过多，请明天再试": "Login error times too many, try tomorrow",
		"您登录密码错误次数过多，请稍后再试": "Password error too much, try later again",
		"您登录密码错误次数过多，请明天再试": "Paswword error too much, try tomorrow",
		"您的IP登录密码错误次数过多，请稍后再试": "Ip error too much, try later again",
		"您的IP登录错误次数过多，请明天再试": "Ip error too much, try tomorrow",
		"您的IP登录过于频繁,请稍后再试": "Ip too frequent, try later",
		"您的IP登录成功次数过多，请明天再试": "Ip success too many times, try tomorrow",
		"您登录成功次数过多,请稍后再试": "Login too many times, try later again",
		"您登录成功次数过多,请明天再试": "Login too many times, try tomorrow",
		"您登录过于频繁,请稍后再试": "login too frequent, try later again",
		"帐号不存在": "Account is not exit",
		'该帐号尚未激活，请到已注册的邮箱<a target="_blank" href="#">激活帐号</a>': 'The account not activated，pleasea <a target="_blank" href="#">activation</a>',
		"该帐号未及时激活，请重新注册": "The account not activated，pleasea register again",
		'邮箱服务已到期，<a target="_blank" href="https://vpay.vip.163.com/center/index.html?sign={{sign}}&from={{product}}&utm_source={{product}}">请立即续费</a>': 'Service has expired，please <a target="_blank" href="https://vpay.vip.163.com/center/index.html?sign={{sign}}&from={{product}}&utm_source={{product}}">Renewal</a>',
		"您验证错误次数过多，请稍后再试": "Verify times too many, try later again",
		"您验证错误次数过多，请改天再试": "Verify times too many，try tomorrow",
		"此次登录不需要进行密保验证": "Login donnot need verify",
		'帐号正在注销中，如需使用，请先<a target="_blank" href="https://{{aqhost}}/logoutQuery.html?username={{username}}&from=webzjlogin">撤销注销</a>': 'The account is deleting，please <a target="_blank" href="https://{{aqhost}}/logoutQuery.html?username={{username}}&from=webzjlogin">Cancel</a>',
		"该帐号已经注销，请更换其他帐号": "The accout is delete",
		'如需使用该帐号，请先<a target="_blank" href="https://{{aqhost}}/login.html?from=webzjlogin&promark={{promark}}&username={{username}}&curl=https%3a%2f%2f{{aqhost2}}%2fverify.html%3Ffrom%3Dwebzjlogin%23%2fbindMobile">绑定安全手机</a>': 'Please <a target="_blank" href="https://{{aqhost}}/login.html?from=webzjlogin&promark={{promark}}&username={{username}}&curl=https%3a%2f%2f{{aqhost2}}%2fverify.html%3Ffrom%3Dwebzjlogin%23%2fbindMobile">bind mobile</a>',
		"短信发送过于频繁，请稍后再试": "SMS is sent too frequently, try later again",
		"暂不支持该地区注册": "Your region cannot register",
		"无法注册，请更换网络环境": "Cannot register, please change network",
		"该号码可能存在安全风险，请更换手机号": "Change mobile",
		"该手机号码绑定帐号过多，请更换手机号": "This mobile is overload, please Change",
		"该手机号码注册过于频繁，请过段时间再试": "Register frequently，try later again",
		'该帐号已注册或暂不支持注册，<a target="_blank" href="https://hc.reg.163.com/iTerm/doc.html?id=540">点击查看详情</a>': 'The account has been registered or cannot register，<a target="_blank" href="https://hc.reg.163.com/iTerm/doc.html?id=540">Check details</a>',
		"注册尝试次数太频繁": "Register is frequently",
		"密码强度过低，请更换后重试": "The password is too simple",
		"该帐号无法注册，请更换后重试": "The account cannot register",
		"当前环境存在风险，请更换网络环境或网络设备后重试": "Cannot register, please change network",
		"用户不是外部邮箱": "not an external mailbox",
		"该帐号已被注册": "The account has been registered",
		"8-16位大小写字母、数字、符号3种以上组合": "8-16bits，number、letter or Punctuation",
		"请输入帐号": "Enter the account",
		"帐号须由字母开头": "Account must start with a letter",
		"帐号请以字母或数字结尾": "Account must end with a letter or number",
		"帐号须由6-18个字符组成": "Account must be 6-18 characters",
		"请用字母、数字或下划线命名": "Please use letters or numbers",
		"请设置您的登录密码": "Please set a password",
		"密码过于简单，请重新设置": "The password is too simple",
		"密码不能与帐号相同": "Password cannot be the same as the account",
		"密码只能包含数字、字母、标点符号": "Password can only contain numbers, letters or punctuation",
		"密码请勿使用空格": "Password cannot use spaces",
		"请重复输入密码": "Enter password again",
		"密码不一致": "The two passwords do not match",
		"请输入您的身份证号码": "Please enter the ID number",
		"请输入您的姓名": "Please enter your name",
		"请输入正确的手机号": "Enter the mobile number",
		"初始化失败，参数不齐全": "Initialization failed",
		"初始化失败，参数不匹配": "nitialization failed",
		'您输入的是网易靓号，请<a target="_blank" href="https://haoma.163.com/?from=zj">前往选购</a>': 'You entered is "lianghao"，please <a target="_blank" href="https://haoma.163.com/?from=zj">go to buy</a>',
		"该帐号不可注册": "The account cannot register",
		"该帐号已被回收，不支持再次注册，请更换后重试": "The account has been reclaimed，cannot re-register",
		"该帐号已被注销，不支持再次注册，请更换后重试": "The account has been delete，cannot re-register",
		"该帐号已被冻结": "The account has been locked",
		"验证码错误次数过多，请改天再试": "Verify times too many，try tomorrow",
		"该手机号已被注册": "The mobile number has been registered",
		"短信发送过于频繁，请稍后再试": "SMS is sent too frequently",
		"短信发送失败，请检查手机号码是否正确": "Failed to send SMS, please check mobile number",
		"请输入正确的中国大陆手机号": "Please enter a Chinese mobile number",
		"请更换手机号再试": "Please change mobile number",
		"该手机号码绑定帐号数达到上限，请更换手机号再试": "The mobile binding has exceeds the limit",
		"该手机号是保留帐号": "The mobile cannot register",
		"获取短信过于频繁，请稍后再试": "SMS is sent too frequently",
		"获取短信过于频繁，请重新验证": "SMS is sent too frequently",
		"手机号码格式错误，请勿以“0”开头": "Mobile number cannot have 0 before it",
		"验证码发送超过限制，请明天再试": "SMS is sent too frequently，try tomorrow",
		"帐号不存在。": "Account does not exist",
		"用户不是外部邮箱。": "not an external mailbox。",
		"操作超时，请刷新页面重试。": "Operation timed out, please refresh the page",
		"帐号已被注册。": "The account has been registered",
		"系统繁忙，请您稍后再试。": "The system is busy, please try again later",
		"服务器维护中，请稍后再试": "Server maintenance, please try again later",
		"重发邮件次数超过限制": "Resend messages exceeded the limit",
		"激活邮件已再次发送！": "Activation email has been resent",
		"请查看您的邮箱。": "Please check your mailbox",
		"立即查看邮件": "Check your mail now",
		"出错了": "Error"
	};
	a.showText = function (e, t) {
		if (1 == t) return d[e] || e;
		else return e
	};
	return a
}, "a878c0216188111f46d39b9df767b354", "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475");
I$("a4de926c2d79e8d8f856eaff4dac0f8b", function (e, t, i, n, s, a, r, o, c, d, _, l, u, f, h, p, m, g) {
	var b = 0,
		v = "",
		$ = {}, y = {}, C = {}, w = "127.0.0.1",
		x = "BC60B8B9E4FFEFFA219E5AD77F11F9E2";
	var T = {
		1: !0,
		2: !0,
		3: !0
	};
	var E = new RegExp("^http[s]?://[^?/#]*\\.(((163|16163|126|188|netease|youdao|yodao|lofter|leihuo|lede|lmlc|yunyan|yunyanzx|163yun|arthome163|tryfun)\\.com)|(fc18\\.com\\.cn)|((yeah|leihuo)\\.net)|(126\\.am)|((blizzard|yixingame)\\.cn)|(icourse163\\.org)|((netease|yixin)\\.im))((/|\\?|#)\\S*|$)");
	var k = {
		haomaEmail: /^[\w-\.]{1,18}@(126\.com|163\.com)$/i,
		eleven: /^1\d{10}$/,
		mobile: /^(13|14|15|16|17|18|19)\d{9}$/,
		itlMobile: /^\d{3,19}$/,
		netease: /^[a-zA-Z]([a-zA-Z]|\d|_){4,16}([a-zA-Z]|\d)$/
	};
	var S = '该手机帐号未注册，<a class="u-goToReg" style="color:#4cb5ff;" href="javascript:void(0);" data-action="changepage" data-mdtype="{{_mdtype}}">{{_mbRegGuide}}</a>',
		N = '该手机帐号未注册，<a class="u-goToReg" style="color:#4cb5ff;" target="_blank" href="{{_regGuideUrl}}">{{_mbRegGuide}}</a>',
		L = '该手机帐号未注册，<a class="u-goToReg" style="color:#4cb5ff;" href="javascript:void(0);" data-action="goUniteLogin">{{_mbRegGuide}}</a>';
	var I, M = 0,
		P = {
			"qq.com": "1",
			"sina.com": "1",
			"foxmail.com": "1",
			"sohu.com": "1",
			"vip.qq.com": "1",
			"live.com": "1",
			"139.com": "1",
			"tom.com": "1",
			"icloud.com": "1",
			"aliyun.com": "1",
			"edu.tw": "1"
		}, O = {
			qq: "1",
			renren: "2",
			weibo: "3",
			weixin: "13",
			yixin: "8"
		};
	var R = function (e) {
		var t = document.body.scrollWidth,
			i = document.body.clientHeight,
			n = {
				width: t,
				height: i,
				type: e || "resize"
			};
		if (t * i > 0) {
			n["URS-CM"] = 1;
			h._$postMessage("_parent", {
				data: n
			})
		}
	};
	h._$resize = R;
	window._$ursResize = R;
	h._$getHttpError = function (e) {
		e = e.toString();
		var t = "请求错误，请您稍后再试",
			i = 0;
		if (0 === e.indexOf("5")) t = "服务器内部错误，请您稍后再试";
		else if (0 === e.indexOf("4")) t = "请求错误，请您稍后再试";
		if ("400" == e || "0" == e) {
			t = '请求错误，请尝试<a target="_blank" href="https://hc.reg.163.com/webcomponent/guide.html">清理cookie</a>后重试';
			i = 2
		}
		return {
			s: t,
			t: i
		}
	};
	var A = function (e, t) {
		this._hasFocus = 0;
		t = t && t.trim();
		if (!this._hasFocus) {
			e.tabIndex = "0";
			e.title = t;
			e.focus()
		}
	};
	var B = function (e, t, s, r, o) {
		if (!h._$isHttpCode()) {
			s = i._$get(s);
			if ('您输入的是网易靓号，请<a target="_blank" href="https://haoma.163.com/?from=zj">前往选购</a>' === t) r = 2;
			if (1 != window._$needCookieSet || t.indexOf("开启浏览器cookies") != -1) {
				r = r || "";
				var c = 0;
				if (window._$URSOPT) c = window._$URSOPT.enlang;
				t = f.showText(t, c);
				if (t)
					if (t == window._$capTxt1 || t == window._$capTxt2) {
						if (!window.initNECaptcha) {
							h._$showFail("-105");
							return
						}
						if ("popup" == window._$URSOPT.mode) return
					}
				var d = i._$get("cnt-box-parent");
				var _ = e && h._$getParent(e, "inputbox");
				if (_) i._$addClassName(_, "error-color");
				var l = a._$get("error-tmp", {
					str: t || "",
					type: r
				});
				if (3 == r) l = l.replace("ferrorhead3", "ferrorhead2").replace("ferrortail3", "ferrortail2 ferrortail3");
				s.innerHTML = l;
				s.className = "m-nerror";
				if (0 === e) i._$dataset(s, "from", "0");
				else if (100 === e || 101 === e) i._$dataset(s, "from", e);
				else if (e) {
					i._$dataset(s, "from", e.name);
					i._$addClassName(s, "err_" + e.name)
				} else i._$dataset(s, "from", "null"); if (window._$errClickHide) {
					n._$clearEvent(s);
					var u = "touchend";
					if (nej.p._$IS.desktop) u = "mouseup";
					n._$addEvent(s, u, function () {
						i._$addClassName(s, "f-dn");
						i._$delClassName(d, "haserr");
						R()
					})
				}
				i._$addClassName(d, "haserr");
				if (window._$readErrHelper) try {
					var p = s.outerText;
					A.call(this, s, p)
				} catch (m) { }
				if (o && o.icon) {
					var g = i._$getChildren(s)[0];
					g.setAttribute("style", "background:url(" + o.icon + ") 0px 0px no-repeat !important")
				}
				R()
			}
		}
	};
	h._$isBadNetease = function (e) {
		return !k.netease.test(e)
	};
	h._$isNeteaseEmail = function (e) {
		return "163.com" === e || "126.com" === e || "yeah.net" === e || "vip.163.com" == e || "vip.126.com" == e || "188.com" == e || "vip.188.com" == e
	};
	h._$checkMobile = function (e) {
		return k.mobile.test(e)
	};
	h._$checkItlMobile = function (e) {
		return k.itlMobile.test(e)
	};
	h._$getParent = function (e, t) {
		e = i._$get(e);
		if (!e) return null;
		e = e.parentElement || e.parentNode;
		for (; e != document.body;) {
			if (!e) return null;
			if (i._$hasClassName(e, t)) break;
			else e = e.parentElement || e.parentNode
		}
		return e
	};
	h._$showError = function (e, t, i, n, s) {
		B(e, t, i, n, s)
	};
	h._$showError2 = function (e, t, s, r) {
		var o = 0;
		if (window._$URSOPT) o = window._$URSOPT.enlang;
		t = f.showText(t, o);
		if (!h._$isHttpCode()) {
			var c = i._$get("cnt-box-parent");
			var d = e && h._$getParent(e, "inputbox");
			if (0 === r) {
				if (d) i._$addClassName(d, "error-color");
				s = i._$get(s);
				s.innerHTML = a._$get("error-tmp", {
					str: t || ""
				});
				s.className = "m-nerror";
				if (e) {
					i._$dataset(s, "from", e.name);
					i._$addClassName(s, "err_" + e.name)
				} else i._$dataset(s, "from", "null")
			}
			n._$addEvent(s, "click", function () {
				if (e) try {
					e.focus()
				} catch (t) { } else {
					i._$addClassName(s, "f-dn");
					R()
				}
			});
			i._$addClassName(c, "haserr");
			R()
		}
	};
	h._$removeError = function (e, t) {
		var n = i._$get("cnt-box-parent");
		var s = i._$dataset(t, "from");
		var a = e.name;
		var r = e && h._$getParent(e, "inputbox");
		if (r) i._$delClassName(r, "error-color");
		if (s == a || "null" == s) {
			t = i._$get(t);
			i._$addClassName(t, "f-dn");
			if (0 != s) i._$delClassName(n, "haserr");
			if ("email" == a) i._$delClassName(t, "err_email");
			else if ("password" == a) i._$delClassName(t, "err_password");
			else if ("checkcode" == a) i._$delClassName(t, "err_checkcode");
			else if ("phone" == a) i._$delClassName(t, "err_phone");
			else if ("phonecode" == a) i._$delClassName(t, "err_phonecode")
		}
		R()
	};
	h._$removeError2 = function (e) {
		var t = i._$get("nerror"),
			n = i._$dataset(t, "from");
		e = e || 100;
		if (n == e) i._$addClassName(t, "f-dn");
		R()
	};
	h._$removeError3 = function () {
		var e = i._$get("nerror");
		i._$addClassName(e, "f-dn");
		R()
	};
	h._$showFail = function (t, n) {
		if ("-105" === t) M = 1;
		else M = 0;
		var s = i._$get("cnt-box-parent");
		if ("601" != t) {
			I = clearTimeout(I);
			i._$remove("failbox", !0);
			var a = parseInt(e._$KERNEL.version, 10);
			var r = "trident" == e._$KERNEL.engine && a < 10 ? "boxtop" : "";
			var o, d = 500 == t ? "fail0 " : "fail1 ",
				_ = i._$create("div", d + r, i._$getByClassName(document, "g-bd")[0]);
			var l = 0;
			if (window._$URSOPT) l = window._$URSOPT.enlang;
			o = f.showText(c[t], l) || h._$getErrorTxt(t);
			if ("-103" == t) o = o.replace("AA", n);
			_.id = "failbox";
			_.innerHTML = '<div class="box">' + o + "</div>";
			i._$addClassName(s, "haserr");
			if (window._$readErrHelper) try {
				var u = _.outerText;
				A.call(this, _, u)
			} catch (p) { }
			I = setTimeout(function () {
				i._$delClassName(s, "haserr");
				i._$remove("failbox", !0);
				R()
			}, 5e3);
			R()
		}
	};
	h._$showFail2 = function (t) {
		var n = 0;
		if (window._$URSOPT) n = window._$URSOPT.enlang;
		t = f.showText(t, n);
		M = 0;
		var s = i._$get("cnt-box-parent");
		I = clearTimeout(I);
		i._$remove("failbox", !0);
		var a = parseInt(e._$KERNEL.version, 10);
		var r = "trident" == e._$KERNEL.engine && a < 10 ? "boxtop" : "";
		var o = "fail1 ",
			c = i._$create("div", o + r, i._$getByClassName(document, "g-bd")[0]);
		c.id = "failbox";
		c.innerHTML = '<div class="box">' + t + "</div>";
		i._$addClassName(s, "haserr");
		if (window._$readErrHelper) try {
			var d = c.outerText;
			A.call(this, c, d)
		} catch (_) { }
		I = setTimeout(function () {
			i._$delClassName(s, "haserr");
			i._$remove("failbox", !0);
			R()
		}, 5e3);
		R()
	};
	h._$hideFail = function () {
		i._$remove("failbox", !0)
	};
	h._$getCommonEmail = function (e) {
		var t = e.split("@")[1];
		return P[t] ? "//mail." + e.substr(e.indexOf("@") + 1) : ""
	};
	h.__hackPush = function () {
		return 0
	};
	h._$loadGaq = function () {
		_gaq = window["_gaq"] || [];
		if (!window.wdaId) _gaq.push = h.__hackPush
	};
	h._$timeCount = function (e) {
		if (!window.timecount) window.timecount = [];
		window.timecount[e] = (new Date).getTime()
	};
	h._$timeCountEnd = function (e) {
		if (!window.timecount) return 0;
		if (!window.timecount[e]) return 0;
		var t = (new Date).getTime() - window.timecount[e];
		window.timecount[e] = 0;
		return t
	};
	h._$requestJsonp = function (e, t, i, n) {
		var s = (new Date).getTime();
		var a = "jsonp" + s;
		window["qrcb"] = [];
		window["qrcb"][a] = i;
		var r = "";
		t.rtid = h._$getRtid();
		for (var o in t) r += "&" + o + "=" + t[o];
		r = r.slice(1);
		var c = e + "?" + r + "&callback=qrcb." + a;
		var d = document.getElementById("mp-script-" + a);
		if (!d) {
			d = document.createElement("script");
			d.type = "text/javascript";
			d.id = "mp-script-" + a;
			d.src = c;
			document.getElementsByTagName("head")[0].appendChild(d)
		}
		if (!n) document.getElementsByTagName("head")[0].appendChild(d)
	};
	h._$showSucLoading = function () {
		var e = 0;
		if (window._$URSOPT) e = window._$URSOPT.enlang;
		document.body.innerHTML = "";
		var t = i._$create("div", "sucloading", document.body);
		t.innerHTML = '<div class="loading-img"><span>请稍候，正在跳转...</span></div>';
		if (1 == e) t.innerHTML = '<div class="loading-img"><span>' + f.showText("请稍候，正在跳转...", 1) + "</span></div>"
	};
	h._$postMessage = function (e, t) {
		var i = t.data.type;
		t.data["MGID"] = window.mgid;
		if ("success" === i || "register-success" === i) h._$showSucLoading();
		if ("renderOk" === i) {
			t.data["time"] = (new Date).getTime();
			h._$trySendFmp()
		}
		r._$postMessage(e, t)
	};
	h._$trySendFmp = function () {
		var e = 0,
			t;
		if ("1" == window._$URSOPT.needfmp) {
			if (t) t = clearInterval(t);
			t = setInterval(function () {
				if (e >= 5) t = clearInterval(t);
				else e++;
				try {
					var i = document.body.scrollWidth,
						n = document.body.clientHeight,
						s = window.__PT_GLOBAL_INSTANCE__.states.initialState.timing.fmp;
					if (i > 0 && n > 0 && s) {
						t = clearInterval(t);
						var a = "//dl.reg.163.com/UA1435545636633/__utm.gif?from=webzj&type=getfmp&fmp=" + s;
						h._$sendLog(a)
					}
				} catch (r) { }
			}._$bind(this), 2e3)
		}
	};
	h._$validateSecIdCard = function (e) {
		var t = 0;
		var i = e;
		var n = {
			11: "北京",
			12: "天津",
			13: "河北",
			14: "山西",
			15: "内蒙",
			21: "辽宁",
			22: "吉林",
			23: "黑龙",
			31: "上海",
			32: "江苏",
			33: "浙江",
			34: "安徽",
			35: "福建",
			36: "江西",
			37: "山东",
			41: "河南",
			42: "湖北",
			43: "湖南",
			44: "广东",
			45: "广西",
			46: "海南",
			50: "重庆",
			51: "四川",
			52: "贵州",
			53: "云南",
			54: "西藏",
			61: "陕西",
			62: "甘肃",
			63: "青海",
			64: "宁夏",
			65: "新疆",
			71: "台湾",
			81: "香港",
			82: "澳门",
			91: "国外"
		};
		if (!/^\d{17}(\d|x)$/i.test(i)) return !1;
		i = i.replace(/x$/i, "a");
		if (null === n[parseInt(i.substr(0, 2))]) return !1;
		var s = i.substr(6, 4) + "-" + Number(i.substr(10, 2)) + "-" + Number(i.substr(12, 2));
		var a = new Date(s.replace(/-/g, "/"));
		if (s != a.getFullYear() + "-" + (a.getMonth() + 1) + "-" + a.getDate()) return !1;
		for (var r = 17; r >= 0; r--) t += Math.pow(2, r) % 11 * parseInt(i.charAt(17 - r), 11);
		if (t % 11 != 1) return !1;
		else return !0
	};
	h._$parseOauth = function () {
		var e = window.URSCONFIG.oauthLoginConfig || !1;
		if (!e) return e;
		var t = location.protocol + "//reg.163.com/outerLogin/oauth2/connect.do?product=" + window.URSCONFIG.product;
		s._$forEach(e, function (e) {
			if (!e.url)
				if ("alipay" == e.name) {
					t = t.replace("/outerLogin/oauth2/connect.do", "/outerLogin/oauth2/aliPayFastLogin.do");
					e.url = t
				} else e.url = t + "&target=" + O[e.name];
			var i, n = location.host;
			n = n.indexOf("webzj") > -1 ? n : n + "/webzj";
			i = location.protocol + "//" + n + "/webapp/res/statichtml/third.html";
			var a = {
				url: i,
				url2: i
			};
			if (e.backurl) {
				a = {
					url: i + "?backurl=" + e.backurl,
					url2: i + "?backurl=" + e.backurl
				};
				if ("alipay" == e.name) a = {
					redirect_error: i + "?backurl=" + e.backurl,
					redirect_url: i + "?backurl=" + e.backurl
				}
			} else if ("alipay" == e.name) a = {
				redirect_error: i,
				redirect_url: i
			};
			if (0 == e.url.indexOf("//")) e.url = location.protocol + e.url;
			e.url += "&" + s._$object2query(a)
		});
		return e
	};
	h._$doThirdLogin = function (e) {
		var t = n._$getElement(e),
			s = i._$dataset(t, "link"),
			a = i._$dataset(t, "width"),
			r = i._$dataset(t, "height");
		if (s) {
			var o = a || 514;
			var c = r || 764;
			var d = (window.screen.availHeight - 30 - o) / 2;
			var _ = (window.screen.availWidth - 10 - c) / 2;
			if (h._$notURL(s)) s = "";
			if (window.URSCONFIG.openSelf) {
				n._$stop(e);
				location.href = s
			} else window.open(s, "thirdLogin", "height=" + o + ",width=" + c + ",top=" + d + ",left=" + _ + ",toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no")
		}
	};
	h._$checkPwd = function () {
		var e = {
			word_l: /[a-z]+/,
			word_u: /[A-Z]+/,
			number: /[0-9]+/,
			sign: /[^a-zA-Z0-9]+/
		};
		var t = function (t) {
			var i = 0,
				n;
			if (e.word_l.test(t)) i++;
			if (e.word_u.test(t)) i++;
			if (e.number.test(t)) i++;
			if (e.sign.test(t)) i++;
			if (i < 3) n = o.CHECK_PASSWORD_LEVEL;
			return n
		};
		var i = function (e, t) {
			e = e || "";
			t = t || "";
			e = e.toLowerCase();
			t = t.toLowerCase();
			var i = t.substr(0, t.indexOf("@")) || t;
			return e === i || e === t
		};
		var n = function (e) {
			return /[^\x21-\x7E]/g.test(e)
		};
		var s = function (e) {
			return /\s/.test(e)
		};
		return function (e, a, r) {
			var c = e.length,
				d;
			if (c < 8 || c > 16) d = o.CHECK_PASSWORD_LENGTH;
			else d = t(e); if (d) return d;
			if (i(e, a)) d = o.CHECK_PASSWORD_EQUAL;
			else if (s(e)) d = o.CHECK_PASSWORD_HASEMPTY;
			else if (n(e)) d = o.CHECK_PASSWORD_CHARCODE255;
			return d
		}
	}();
	h.__sendClose = function () {
		var e = {
			type: "close"
		};
		e["URS-CM"] = 1;
		h._$postMessage("_parent", {
			data: e
		})
	};
	h._$getErrorTxt = function (e, t) {
		var i = 0;
		if (window._$URSOPT) i = window._$URSOPT.enlang;
		if (!e) return f.showText("检测出非法请求，为了您的帐号安全，请您稍后再试。", i);
		e = e.toString();
		var n = e.split("-"),
			a = n[n.length - 1];
		if (a && s._$indexOf(["4502", "4503", "4504"], a) !== -1) return f.showText(c[a], i);
		if (e.indexOf("601") > -1) return h._$setOutLogin();
		var r;
		if (e.indexOf("451") > -1) {
			if (t) r = "https://aq.reg.163.com/ydaq/welcome?module=offlinePasswordFind&from=webzj&username=" + t;
			else r = "https://aq.reg.163.com/ydaq/welcome?module=offlinePasswordFind&from=webzj";
			return '为了您的帐号安全，<a target="_blank" href="' + r + '">请设置登录密码</a>'
		}
		if (e.indexOf("501") > -1) return f.showText(c["501"], i);
		if (e.indexOf("502") > -1) return f.showText(c["502"], i);
		if (e.indexOf("433") > -1) return f.showText(c["433"], i);
		if (0 === e.indexOf("5")) return f.showText("服务器内部错误，请您稍后再试", i);
		else if (0 === e.indexOf("4")) return f.showText("请求错误，请您稍后再试", i);
		else return f.showText("请求错误，请您稍后再试", i)
	};
	h._$setOutLogin = function () {
		var e = function (e, t, i) {
			return (i ? "?" : "&") + e + "=" + encodeURIComponent(t)
		};
		return function (t) {
			var i = window.$loginOpts.promark + +new Date;
			var n = window.$loginOpts.product || "";
			var s = window.$loginOpts.promark || "";
			var a = window.$loginOpts.mbNeedItl || "";
			var r = window.$loginOpts.domains || "";
			var o = window.$loginOpts.cookieDomain || "";
			var c = window.$loginOpts.prdomain || "";
			var d = window.$loginOpts.needMobileLogin || "";
			var _ = window.$loginOpts.mobileFirst || "";
			var l = window.$loginOpts.noqr || "";
			var u = window.$loginOpts.smsLoginFirst || "";
			var f = window.$loginOpts.toolName || "";
			var h = window.$loginOpts.toolUrl || "";
			var p = window.$loginOpts.needQrLogin || "";
			var m = location.protocol;
			var g = "";
			if (window.$loginOpts.uniteLogin) g = JSON.stringify(window.$loginOpts.uniteLogin);
			var b = location.host;
			b = b.indexOf("webzj") > -1 ? b : b + "/webzj";
			var v = m + "//" + b + "/safelogin.html" + e("loginKey", i, 1) + e("domains", r) + e("prdomain", c) + e("cookieDomain", o) + e("needMobileLogin", d) + e("mobileFirst", _) + e("noqr", l) + e("smsLoginFirst", u) + e("toolName", f) + e("toolUrl", h) + e("needQrLogin", p) + e("promark", s) + e("product", n) + e("mbNeedItl", a) + e("uniteLogin", g);
			var $ = '<strong class="msg"><span style="color:#000;">当前登录存在风险，</span><a style="color:red;font-size:14px;text-decoration:underline;font-weight:bolder;" target="_blank" href=' + v + ">点此进行安全登录</a></strong>";
			if (t) B(0, $, "nerror");
			return $
		}
	}();
	h._$addPathB = function (e) {
		if (window._$pathB) e = e.replace(/:\/\/(?:[^\/]+)/, function (e) {
			return e + "/b"
		});
		return e
	};
	h._$3pSuccess = function (e) {
		e["URS-CM"] = 1;
		e["type"] = "otherRegSuccess";
		h._$postMessage("_parent", {
			data: e
		})
	};
	h._$configLog = function (e) {
		var t = {};
		var i = {
			needanimation: 1,
			nocover: 1,
			errMode: 1,
			needUrsBgp: 1,
			passportNeedUrsBgp: 1,
			loadTime: 1,
			bgpTime2: 1,
			pathB: 1,
			preFilledMail: 1,
			preFilledMobile: 1,
			preFilledMobileReg: 1,
			preFillUnite: 1,
			frameSize: 1,
			placeholders: 1,
			placeholder: 1,
			mobilePlaceholder: 1,
			regPlaceholder: 1,
			domains: 1,
			includeBox: 1,
			forgetpwdlink: 1,
			topURL: 1,
			errMsg: 1,
			from: 1,
			mailreghooklink: 1,
			regUrl: 1,
			host: 1,
			toolName: 1,
			mbagree1: 1,
			mbagree2: 1,
			hintTxt: 1,
			iframeShowAnimation: 1,
			otherThirdLink: 1,
			bid: 1,
			eventType: 1,
			lockConfig: 1,
			style: 1,
			coverBackground: 1,
			mblink1: 1,
			mblink2: 1,
			regDomains: 1
		};
		s._$forIn(e, function (e, n) {
			if ("swidth" == n) try {
				e = parseInt(e);
				e = Math.abs(e)
			} catch (s) {
				e = 0
			}
			if ("style" == n) t["style"] = 1;
			if (!i[n]) t[n] = e
		});
		h._$sendConfigLog(t)
	};
	h._$sendConfigLog = function (e) {
		var t = encodeURIComponent(window._$TOPURL || "");
		e = JSON.stringify(e);
		e = encodeURIComponent(e);
		var i = "//dl.reg.163.com/UA1435545636633/__utm.gif?configlog=1&from=" + t + "&config=" + e;
		h._$sendLog(i)
	};
	h._$isV6Url = function (e) {
		return e && e.indexOf("-v6") > -1
	};
	h._$sendLog = function (e) {
		var t = i._$create("img", "", document.body);
		t.style.position = "absolute";
		t.style.width = "0px";
		t.style.height = "0px";
		if (e.indexOf("pr.nss.netease.com") === -1 && !h._$isV6Url(e)) e = h._$urlToIPV6(e);
		t.src = e;
		setTimeout(function () {
			i._$remove(t)
		}, 1e4)
	};
	h._$sendLog2 = function (e) {
		s._$reverseEach(e, function (t, i) {
			if (h._$getSmState() && h._$isGoUrl(t)) {
				var n = h._$tryAddSm(t).paramobj;
				l._$request("goonlog", n, m, m, 1, window._$URSOPT.product);
				e.splice(i, 1)
			}
		}._$bind(this));
		for (var t = 0, i; t < e.length; t++) {
			i = e[t];
			h._$sendLog(i)
		}
	};
	h._$HtmlEncode = function (e) {
		function t(e) {
			var t = !0;
			var n = e.charCodeAt(0);
			switch (n) {
				case 10:
					return "<br/>";
				case 32:
					return "&nbsp;";
				case 34:
					return "&quot;";
				case 38:
					return "&amp;";
				case 39:
					return "&#x27;";
				case 47:
					return "&#x2F;";
				case 60:
					return "&lt;";
				case 62:
					return "&gt;";
				case 198:
					return "&AElig;";
				case 193:
					return "&Aacute;";
				case 194:
					return "&Acirc;";
				case 192:
					return "&Agrave;";
				case 197:
					return "&Aring;";
				case 195:
					return "&Atilde;";
				case 196:
					return "&Auml;";
				case 199:
					return "&Ccedil;";
				case 208:
					return "&ETH;";
				case 201:
					return "&Eacute;";
				case 202:
					return "&Ecirc;";
				case 200:
					return "&Egrave;";
				case 203:
					return "&Euml;";
				case 205:
					return "&Iacute;";
				case 206:
					return "&Icirc;";
				case 204:
					return "&Igrave;";
				case 207:
					return "&Iuml;";
				case 209:
					return "&Ntilde;";
				case 211:
					return "&Oacute;";
				case 212:
					return "&Ocirc;";
				case 210:
					return "&Ograve;";
				case 216:
					return "&Oslash;";
				case 213:
					return "&Otilde;";
				case 214:
					return "&Ouml;";
				case 222:
					return "&THORN;";
				case 218:
					return "&Uacute;";
				case 219:
					return "&Ucirc;";
				case 217:
					return "&Ugrave;";
				case 220:
					return "&Uuml;";
				case 221:
					return "&Yacute;";
				case 225:
					return "&aacute;";
				case 226:
					return "&acirc;";
				case 230:
					return "&aelig;";
				case 224:
					return "&agrave;";
				case 229:
					return "&aring;";
				case 227:
					return "&atilde;";
				case 228:
					return "&auml;";
				case 231:
					return "&ccedil;";
				case 233:
					return "&eacute;";
				case 234:
					return "&ecirc;";
				case 232:
					return "&egrave;";
				case 240:
					return "&eth;";
				case 235:
					return "&euml;";
				case 237:
					return "&iacute;";
				case 238:
					return "&icirc;";
				case 236:
					return "&igrave;";
				case 239:
					return "&iuml;";
				case 241:
					return "&ntilde;";
				case 243:
					return "&oacute;";
				case 244:
					return "&ocirc;";
				case 242:
					return "&ograve;";
				case 248:
					return "&oslash;";
				case 245:
					return "&otilde;";
				case 246:
					return "&ouml;";
				case 223:
					return "&szlig;";
				case 254:
					return "&thorn;";
				case 250:
					return "&uacute;";
				case 251:
					return "&ucirc;";
				case 249:
					return "&ugrave;";
				case 252:
					return "&uuml;";
				case 253:
					return "&yacute;";
				case 255:
					return "&yuml;";
				case 162:
					return "&cent;";
				case "\r":
					break;
				default:
					t = !1
			}
			if (!t)
				if (n > 127) {
					var s = n;
					var a = s % 16;
					s = Math.floor(s / 16);
					var r = s % 16;
					s = Math.floor(s / 16);
					var o = s % 16;
					s = Math.floor(s / 16);
					var c = s % 16;
					return "&#x" + i[c] + i[o] + i[r] + i[a] + ";"
				} else return e
		}
		var i = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");
		var n = e;
		var s = "";
		for (var a = 0; a < n.length; a++) {
			var r = n.charAt(a);
			s += t(r)
		}
		return s
	};
	h._$notURL = function (e) {
		return !/^http[s]?:/i.test(e) && !/^\/\//.test(e)
	};
	h._$isHaomaEmail = function (e) {
		return k.haomaEmail.test(e)
	};
	h._$formatUn = function (e) {
		return e && e.split("@")[0]
	};
	h._$doProxyLink = function (e) {
		var t, i = n._$getElement(e) || "";
		if (window.URSCONFIG.openSelf)
			if ("_blank" == i.target)
				if ("A" == i.tagName.toUpperCase()) {
					t = i.href;
					if (!h._$notURL(t)) {
						n._$stop(e);
						location.href = t
					}
				}
	};
	h._$getDlapp = function () {
		return '<span style="color:#000;">使用</span><a target="_blank" href="https://id.163.com/gj/?from=webzj_cw">网易帐号管家</a>，<span style="color:#000;">全面保护您的帐号！</span>'
	};
	h._$emailFilter = function (e) {
		e = e || "";
		return e.replace(/[\u202d|\u202c]/g, "")
	};
	h._$getRtid = function () {
		return window._$RTID
	};
	h._$createUtid = function () {
		var e = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
			t = 32,
			i = [];
		for (; t-- > 0;) i[t] = e.charAt(Math.random() * e.length);
		return i.join("")
	};
	h._$getUtid = function (e, t) {
		var i;
		if (e) _req = MpRequest2;
		else _req = MpRequest;
		_req.getCookie("utid", function (e) {
			i = e || "null";
			t(i)
		})
	};
	h._$addUtid = function () {
		var e = function () {
			var e = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
				t = 32,
				i = [];
			for (; t-- > 0;) i[t] = e.charAt(Math.random() * e.length);
			return i.join("")
		};
		return function () {
			var t = d._$cookie("utid");
			if (!t) {
				t = e();
				d._$cookie("utid", {
					value: t,
					expires: 3650,
					path: "/"
				})
			}
			return t
		}
	}();
	h._$get401Error = function (e) {
		e = e || "登录";
		var t = "https://pr.nss.netease.com/sentry/passive?clusterName=urs-webzj-static-passive&modelName=webzj_response_time2&one=1&uapi=401error&pkid=" + window._$PKID + "&pd=" + window._$PRODUCT + "&dataTime=" + (new Date).getTime() + "&str=" + e + "&host=" + location.host;
		h._$sendLog(t);
		return "无法" + e + '，请<a style="color:#4aafe9;" target="_blank" href="https://hc.reg.163.com/webcomponent/doc2.html?pkid=' + window._$PKID + "&pd=" + window._$PRODUCT + "&time=" + (new Date).getTime() + "_" + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].sort(function () {
			return Math.random() > .5 ? 1 : -1
		}).join("") + "&from=" + encodeURIComponent(window._$TOPURL) + "&host=" + location.host + '">开启浏览器cookies</a>或更换浏览器后刷新重试'
	};
	h._$getInnerText = function (e) {
		if (e) return "string" == typeof e.textContent ? e.textContent : e.innerText
	};
	h._$isNewRequest = function () {
		var e = location.protocol + "//";
		var t = window.REGPROTOCOL === window.PROTOCOL && e === window.PROTOCOL;
		var i = t && window._$URSOPT.from3Cdn;
		if (!i && "3" == window._$URSOPT.version)
			if ("dl.reg.163.com" === location.host) i = !0;
		return i
	};
	h._$doLog = function (e, t) {
		console && console.log("api:" + e + ",data:" + JSON.stringify(t))
	};
	h._$tryWeixinResize = function () {
		var e = navigator && navigator.userAgent.toLowerCase();
		var t = /(micromessenger|MQQBrowser)/i.test(e);
		this._$InputBlur();
		if (t) {
			var i = {
				type: "WeiXinInputBlur"
			};
			i["URS-CM"] = 1;
			h._$postMessage("_parent", {
				data: i
			})
		}
	};
	h._$InputBlur = function () {
		var e = {
			type: "InputBlur"
		};
		e["URS-CM"] = 1;
		h._$postMessage("_parent", {
			data: e
		})
	};
	h._$hideFailForCap = function () {
		if (1 === M) {
			i._$remove("failbox", !0);
			R()
		}
	};
	h._$urlToIPV6 = function (e) {
		if (!h._$isIPV6()) return e;
		else return e.replace(/\/\/([^\/]+:?)\//, function (e, t) {
			var i = t;
			i = i.replace(/([^\.]+:?)\./, function (e, t) {
				return t + "-v6."
			});
			return "//" + i + "/"
		})
	};
	h._$isIPV6 = function () {
		return location.host.indexOf("-v6.") > -1
	};
	h._$getNoRegHtml = function (e) {
		if (e.mbRegGuide)
			if (e.uniteLogin) return L.replace("{{_mbRegGuide}}", e.mbRegGuide);
			else if (e.mdtype) return S.replace("{{_mdtype}}", e.mdtype).replace("{{_mbRegGuide}}", e.mbRegGuide);
			else return N.replace("{{_regGuideUrl}}", e.regGuideUrl).replace("{{_mbRegGuide}}", e.mbRegGuide)
	};
	h._$sendNetWorkLog = function () {
		var e = 0;
		var t = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		var i = {
			script: 1,
			xmlhttprequest: 1
		};
		var n = ["fingerprint2", "webzjconf", "pp_index", "load.min.js", "tool.min.js", "watchman.min.js", "plugins.min.js", "config/js", "/core", "/light", "v2/getconf", "v2/d", "v2/get", "v2/b"];
		var a = function (e, t) {
			var i;
			if (0 === t) {
				i = "index";
				return i
			}
			s._$forEach(n, function (t) {
				if (e.indexOf(t) > -1) i = t.replace(/[_\/\.]/g, "")
			});
			return i
		};
		var r = function (e) {
			e = Math.ceil(e || 0);
			var t = 1;
			if (e > 2e4) t = 10;
			else if (e > 1e4) t = 9;
			else if (e > 2e3) t = 8;
			else if (e > 1e3) t = 7;
			else if (e > 500) t = 6;
			else if (e > 200) t = 5;
			else if (e > 90) t = 4;
			else if (e > 60) t = 3;
			else if (e > 30) t = 2;
			return t
		};
		return function () {
			var e, n, o;
			if (!h._$isIPV6()) {
				if (window._$URSOPT.needSendLogDt) setTimeout(function () {
					try {
						if (window.performance && window.performance.getEntries) {
							var e = window.performance.getEntries();
							h._$sendApm(e)
						}
					} catch (t) { }
				}._$bind(this), 5e3);
				if (window._$URSOPT.needSendLog) setTimeout(function () {
					try {
						if (window.performance && window.performance.getEntries) {
							e = window.performance.getEntries();
							var c = [];
							s._$forEach(e, function (e, d) {
								if (i[e.initiatorType] || 0 === d) {
									n = r(e.duration);
									o = a(e.name, d);
									if (o) {
										var _ = {
											one: 1,
											uapi: o
										};
										s._$forEach(t, function (e) {
											if (e == n) _["step" + e] = 1;
											else _["step" + e] = 0
										});
										c.push(_)
									}
								}
							});
							var d = {
								clusterName: "urs-webzj-static-passive",
								modelName: "webzj_response_time3",
								timestamp: (new Date).getTime(),
								dataList: c
							};
							_._$request("https://pr.nss.netease.com/sentry/passive", {
								type: "json",
								method: "POST",
								headers: {
									"Content-Type": "application/json"
								},
								timeout: 2e4,
								data: JSON.stringify(d),
								mode: 0
							})
						}
					} catch (l) { }
				}._$bind(this), 5e3)
			}
		}
	}();
	h._$sendApm = function () {
		var t = {
			url: "name",
			fpt: "responseStart",
			fs: "fetchStart",
			rs: "responseStart",
			re: "responseEnd",
			cs: "connectStart",
			ce: "connectEnd",
			rq: "requestStart",
			ds: "domainLookupStart",
			de: "domainLookupEnd"
		};
		var i = function (i, n) {
			var a;
			var r = [];
			var o = (new Date).getTime();
			if (n) {
				errorMsg = "ajaxerror|" + n;
				a = {
					url: i,
					fs: o,
					rs: o,
					re: o,
					cs: o,
					ce: o,
					rq: o,
					sc: n,
					pk: "75ec138aa92238938a8ab7b24e6ae026",
					em: errorMsg,
					ci: w || "",
					pf: e._$is("desktop") ? "web" : "h5",
					ct: o,
					rqet: 0,
					fpt: o,
					spc: 0,
					did: window._$URSOPT.ursDeviceId || "",
					ds: o,
					de: o
				};
				r.push(a)
			} else s._$forEach(i, function (i) {
				a = {
					sc: 200,
					pk: "75ec138aa92238938a8ab7b24e6ae026",
					em: "",
					ci: w || "",
					pf: e._$is("desktop") ? "web" : "h5",
					ct: o,
					rqet: 0,
					spc: 0,
					did: window._$URSOPT.ursDeviceId || ""
				};
				s._$forIn(t, function (e, t) {
					var n = i[e] || 0;
					if ("url" === t) {
						n = i[e] || "";
						if (n.indexOf("?") > -1) n = n.split("?")[0]
					}
					if (s._$isNumber(n)) n = parseInt(o + n);
					a[t] = n
				});
				r.push(a)
			});
			_._$request("https://mam.netease.com/web/urs", {
				type: "json",
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				timeout: 2e4,
				data: JSON.stringify(r),
				mode: 0
			})
		};
		return function (e, t) {
			try {
				if (window.performance && window.performance.getEntries)
					if ("127.0.0.1" === w) _._$request("https://mam.netease.com/api/config/getClientIp", {
						type: "json",
						method: "GET",
						timeout: 2e4,
						mode: 0,
						onload: function (n) {
							try {
								if ("" === n || null === n) n = {};
								w = n.result || "";
								i(e, t)
							} catch (s) { }
						},
						onerror: function () {
							try {
								i(e, t)
							} catch (n) { }
						}
					});
					else i(e, t)
			} catch (n) { }
		}
	}();
	h._$formatSmscode = function (e) {
		var t = [];
		e = e.split("");
		for (var i = 0, n; i < e.length; i++) {
			if (0 != i && i % 4 === 0) t.push(" ");
			n = e[i];
			t.push(n)
		}
		return t.join("")
	};
	h._$createUnbindLink = function (e, t) {
		t = encodeURIComponent(t);
		if (100 * Math.random() <= window._$KGCONFIG.guideId) {
			e = e.replace("{{aqhost}}", "id.163.com/mail/mailaq");
			e = e.replace("{{aqhost2}}", "id.163.com%2Fmail%2Fmailaq")
		} else {
			e = e.replace("{{aqhost}}", "m.reg.163.com");
			e = e.replace("{{aqhost2}}", "m.reg.163.com")
		}
		var i = window.$loginOpts.promark;
		return e.replace("{{promark}}", i).replace("{{username}}", t)
	};
	h._$createLogoutLink = function (e, t) {
		t = encodeURIComponent(t);
		if (100 * Math.random() <= window._$KGCONFIG.guideId) e = e.replace("{{aqhost}}", "id.163.com/mail/mailaq");
		else e = e.replace("{{aqhost}}", "m.reg.163.com");
		return e.replace("{{username}}", t)
	};
	h._$getHttpCodeTxt = function (e) {
		var t = "httpcode-1";
		e += "";
		var i = ["400", "404", "500", "502", "503", "429"];
		if (s._$indexOf(i, e) !== -1) t = "httpcode-" + e;
		else {
			if (0 === e.indexOf("4")) t = "httpcode-4xx";
			if (0 === e.indexOf("5")) t = "httpcode-5xx"
		}
		var n = 0;
		if (window._$URSOPT) n = window._$URSOPT.enlang;
		return f.showText(c[t], n)
	};
	h._$isHttpCode = function () {
		return b
	};
	h._$setIsHttpCode = function (e) {
		b = e
	};
	h._$listSafeUrlFilter = function (e) {
		s._$forEach(e, function (e) {
			var t = e.url;
			if (t && h._$notURL(t)) e.url = ""
		});
		return e
	};
	h._$deepCopy = function () {
		var e = {};
		var t = e.hasOwnProperty;
		var i = t.toString;
		var n = i.call(Object);
		var a = function (e, t) {
			try {
				if (Object.prototype.hasOwnProperty.call(e, t)) {
					var i = e[t];
					delete e[t]
				}
				return e[t]
			} catch (n) {
				throw n
			} finally {
				e[t] = i
			}
		};
		var r = function () {
			var e = Object.getPrototypeOf;
			if ("function" != typeof e) e = "object" == typeof "".__proto__ ? function (e) {
				return a(e, "__proto__")
			} : function (e) {
				return a(e, "constructor").prototype
			};
			return e
		};
		var o = r();
		var c = function (e) {
			var s, a;
			if (!e || "[object Object]" !== e.toString()) return !1;
			s = o(e);
			if (!s) return !0;
			a = t.call(s, "constructor") && s.constructor;
			return "function" == typeof a && i.call(a) === n
		};
		var d = function (e) {
			return "function" == typeof e && "number" != typeof e.nodeType
		};
		var _ = function () {
			var e, t, i, n, a, r, o = arguments[0] || {}, l = 1,
				u = arguments.length,
				f = !1;
			if ("boolean" == typeof o) {
				f = o;
				o = arguments[l] || {};
				l++
			}
			if ("object" != typeof o && !d(o)) o = {};
			if (l === u) {
				o = this;
				l--
			}
			for (; l < u; l++)
				if (null != (e = arguments[l]))
					for (t in e) {
						n = e[t];
						if ("__proto__" !== t && o !== n) {
							if (f && n && (c(n) || (a = s._$isArray(n)))) {
								i = o[t];
								if (a && !s._$isArray(i)) r = [];
								else if (!a && !c(i)) r = {};
								else r = i;
								a = !1;
								o[t] = _(f, r, n)
							} else if (void 0 !== n) o[t] = n
						} else;
					}
			return o
		};
		return function (e, t, i) {
			return _(e, t, i)
		}
	}();
	h._$getCodeByslideTarget = function () {
		var e = {
			1: "441",
			2: "444",
			3: "445",
			4: "447"
		};
		return function (t) {
			return e[t]
		}
	}();
	h._$getRetByCapFlag = function () {
		var e = {
			1: "441",
			4: "444",
			5: "445",
			6: "447"
		};
		return function (t) {
			return e[t]
		}
	}();
	h._$isH5FourVersion = function () {
		return h._$isVersionFour() && !e._$is("desktop")
	};
	h._$isVersionFour = function () {
		return 4 === window._$URSOPT.version
	};
	h._$isVersionOk = function (e) {
		e = parseInt(e, 10);
		return e >= 3
	};
	h._$setAiCapId = function (e) {
		if (e && e.capId) v = e.capId
	};
	h._$getAiCapId = function () {
		return v
	};
	h._$setAiBtn = function (e) {
		$ = e
	};
	h._$getAiBtn = function () {
		return $
	};
	h._$getCapFlayByCode = function () {
		var e = {
			108: 1,
			109: 4,
			110: 5,
			111: 6,
			441: 1,
			444: 4,
			445: 5,
			447: 6
		};
		return function (t) {
			return e[t]
		}
	}();
	h._$isCapCode = function (e) {
		return s._$indexOf(["441", "444", "445", "447"], e) !== -1 || s._$indexOf(["108", "109", "110", "111"], e) !== -1
	};
	h._$regCodeToLgCode = function () {
		var e = {
			108: "441",
			109: "444",
			110: "445",
			111: "447"
		};
		return function (t) {
			return e[t]
		}
	}();
	h._$getAiBtnTxt = function (e) {
		var t = "string" == typeof $.textContent ? $.textContent : $.innerText;
		t = t.replace(/\s/g, "");
		if (e) t = "【" + t + "】";
		var i = window._$URSOPT.enlang;
		var n = "";
		if (1 == i) n = h._$HtmlEncode(f.showText("验证失败，请再次点击###按钮", 1).replace("###", t));
		else n = h._$HtmlEncode("验证失败，请再次点击###按钮".replace("###", t));
		return n
	};
	h._$getRetByCf = function () {
		var e = {
			1: "108",
			4: "109",
			5: "110",
			6: "111"
		};
		return function (t) {
			var i = {};
			i.ret = e[t];
			return i
		}
	}();
	h._$getCfByCode = function () {
		var e = {
			108: 1,
			109: 4,
			110: 5,
			111: 6
		};
		return function (t) {
			return e[t]
		}
	}();
	h._$getMbCapFlag = function () {
		var e = {
			4: 2,
			5: 3,
			6: 4
		};
		return function (t) {
			return e[t]
		}
	}();
	h._$getCfBySt = function () {
		var e = {
			2: 4,
			3: 5,
			4: 6
		};
		return function (t) {
			return e[t]
		}
	}();
	h._$showFail5Error = function () {
		var e = 0;
		if (window._$URSOPT) e = window._$URSOPT.enlang;
		var t = f.showText("验证失败，请稍后再试", e);
		h._$showError(0, t, "nerror")
	};
	h._$fail5 = function (e) {
		if (!y[e]) y[e] = 1;
		else y[e] = y[e] + 1;
		return h._$fail5check(e)
	};
	h._$fail5check = function (e) {
		var t = !1,
			i = y[e] || 0;
		if (i >= 5) {
			h._$showFail5Error();
			t = !0
		}
		return t
	};
	h._$clearFail5 = function () {
		y = {}
	};
	h._$setApiStartTime = function (e) {
		C[e] = (new Date).getTime()
	};
	h._$checkApiTime = function (e) {
		var t = (new Date).getTime(),
			i = C[e] || 0,
			n;
		n = t - i;
		return n
	};
	h._$addPdAndPkid = function (e) {
		var t = "&";
		if (e.indexOf("?") === -1) {
			e += "?";
			t = ""
		}
		e = e + t + "pd=" + window._$URSOPT.product + "&pkid=" + window._$URSOPT.promark;
		return e
	};
	h._$cookieTest = function () {
		d._$cookie("cookietest", {
			value: 1,
			expires: -1,
			path: "/"
		});
		d._$cookie("cookietest", {
			value: 1,
			expires: 1,
			path: "/"
		});
		if (!d._$cookie("cookietest")) return !1;
		else {
			d._$cookie("cookietest", {
				value: 1,
				expires: -1,
				path: "/"
			});
			return !0
		}
	};
	h._$needChromeHack = function () {
		var t = 1e6,
			i = e._$KERNEL.version || 0,
			n = e._$KERNEL.browser || "";
		if (!window.URSCONFIG.chromeSupport) return !1;
		i = parseInt(i, 10);
		if (window._$URSCDNCF && window._$URSCDNCF.chromeversion) t = window._$URSCDNCF.chromeversion;
		if ("chrome" === n.toLowerCase() && i >= t) return !0;
		else return !1
	};
	h._$tryAddChromeHack = function (e) {
		if (h._$needChromeHack())
			if (e.indexOf("?") > -1) e += "&othersite=true";
			else e += "?othersite=true";
		return e
	};
	h._$createQRcode = function (e) {
		var t = e.node,
			i = e.smstxt,
			n = e.smscode,
			s = encodeURIComponent(e.btntxt);
		var a = "//dl.reg.163.com/webzj/qrcode/qrcode.html?smstxt=";
		if (window._$pathB) a = "//dl.reg.163.com/webzj/b/qrcode/qrcode.html?smstxt=";
		var r = [location.protocol, a, i, "&smscode=", n, "&btntxt=", s];
		new QRCode(t, {
			text: r.join(""),
			width: 100,
			height: 100,
			correctLevel: QRCode.CorrectLevel.L
		});
		t.title = ""
	}, h._$startZero = function (e) {
		return e.indexOf("-0") !== -1
	};
	h._$changeImg = function (e) {
		var t = window._$URSOPT.cdnhostname,
			i = "webzj.netstatic.net",
			n = "webzj-v6.netstatic.net";
		if (t == i || t == n) {
			e = e.replace("ursdoccdn.nosdn.127.net", i);
			e = e.replace("urswebzj.nosdn.127.net", i)
		}
		return e
	};
	h._$findDataCode = function (e, t) {
		if (!e) return !1;
		var n = i._$dataset(e, t);
		if (n === t) return e;
		else {
			e = e.parentNode;
			return h._$findDataCode(e, t)
		}
	};
	h._$testOrigin = function (e) {
		return E.test(e)
	};
	h._$createVipLink = function (e, t) {
		t = encodeURIComponent(t);
		return e.replace("{{sign}}", t).replace(/{{product}}/g, window.URSCONFIG.product).replace("{{product}}", window._$URSOPT.product)
	};
	h._$useDefaultRegMailLog = function (e, t) {
		if (T[t]) {
			var i = window._$TOPURL || "";
			var n = "//dl.reg.163.com/UA1435545636633/__utm.gif?useDefaultRegMail=1&from=" + i + "&promark=" + window._$URSOPT.promark + "&product=" + window._$URSOPT.product;
			if (e)
				if (e.indexOf("pkid=qzgcGfv") !== -1 || e.indexOf("pkid=") === -1) h._$sendLog(n);
			T[t] = !1
		}
	};
	h._$isDes = function () {
		return window._$URSOPT.desMobile && window._$URSOPT.desMobileReal
	};
	h._$sm4Encrypt = function (e) {
		return window.URSSM4.encrypt(JSON.stringify(e), x)
	};
	h._$isCanSmUrl = function (e) {
		var t = e.split("?")[0] || "";
		return h._$isGoUrl(e) || /\/dl\/common\/setCookie$/.test(t) || /\/zc\/common\/setCookie$/.test(t)
	};
	h._$isGoUrl = function (e) {
		var t = e.split("?")[0] || "";
		return /\/dl\/zj\/mail\/go$/.test(t)
	};
	h._$tryAddSm = function (e) {
		var t, i, n, a, r, o;
		if (h._$getSmState() && h._$isCanSmUrl(e)) {
			n = e.split("?");
			i = n[0] || "";
			t = n[1] || "";
			if (t) {
				a = {};
				t = t.split("&");
				s._$forEach(t, function (e) {
					var t = e.split("=");
					if (t[0]) a[t[0]] = t[1] || ""
				})
			}
			o = h._$sm4Encrypt(a);
			r = t ? i + "?encParams=" + o : i;
			return {
				realurl: r,
				paramobj: a
			}
		} else return {
			realurl: e
		}
	};
	h._$isNeedSm = function () {
		return 1 === window._$URSOPT.needSm
	};
	h._$getSmState = function () {
		var e = window._$URSOPT.product,
			t = window._$URSOPT.promark,
			i = window._$URSSMCONFIG || {};
		if (!h._$isNewRequest()) return !1;
		if (s._$indexOf(i.promarkList, t) !== -1) return !0;
		if (s._$indexOf(i.pdblackList, e) !== -1) return !1;
		if (i.opensm) return !0;
		if (s._$indexOf(i.productList, e) !== -1) return !0;
		else return !1
	};
	h.caluseErrIndex = 98;
	return h
}, "a878c0216188111f46d39b9df767b354", "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "bff3d86ec4ea91399919ee4963badfeb", "8f33f2dc03528616b29dd40cc05162ac", "dde0e6b40e64b3f022ca4ad9ab8b1a9c", "aeb48ea44f253e0d5b476e156149d630", "54120fa727d71cd38f3b1273d034afef", "9a2eeb6403e6ff7ded02a3eabd637af9", "53c267efd983fb8c66cb645beead7a8d", "5222336a9d5500b0e70208e718b88ec6", "46a4de3a50f50a600950ca9cee88031e");
I$("e30f9e8af4c2bb3cff9252a9e1c3e5da", function (e, t, i, n, s, a, r, o, c, d) {
	var _;
	r._$$Abstract = t._$klass();
	_ = r._$$Abstract._$extend(s._$$EventTarget);
	_.__init = function () {
		this.__super();
		i._$dumpCSSText();
		this.__initXGui();
		this.__initNode()
	};
	_.__reset = function (e) {
		this.__super(e);
		this.__doInitClass(e.clazz);
		this._$appendTo(e.parent)
	};
	_.__destroy = function () {
		this.__super();
		this.__doDelParentClass();
		delete this.__parent;
		i._$removeByEC(this.__body);
		i._$delClassName(this.__body, this.__class);
		delete this.__class
	};
	_.__initXGui = c;
	_.__initNode = function () {
		if (!this.__seed_html) this.__initNodeTemplate();
		this.__body = a._$getNodeTemplate(this.__seed_html);
		if (!this.__body) this.__body = i._$create("div", this.__seed_css);
		i._$addClassName(this.__body, this.__seed_css)
	};
	_.__initNodeTemplate = c;
	_.__doInitClass = function (e) {
		this.__class = e || "";
		i._$addClassName(this.__body, this.__class)
	};
	_.__doAddParentClass = function () {
		if (this.__seed_css) {
			var e = this.__seed_css.split(/\s+/);
			i._$addClassName(this.__parent, e.pop() + "-parent")
		}
	};
	_.__doDelParentClass = function () {
		if (this.__seed_css) {
			var e = this.__seed_css.split(/\s+/);
			i._$delClassName(this.__parent, e.pop() + "-parent")
		}
	};
	_._$getBody = function () {
		return this.__body
	};
	_._$appendTo = function (e) {
		if (this.__body) {
			this.__doDelParentClass();
			if (n._$isFunction(e)) this.__parent = e(this.__body);
			else {
				this.__parent = i._$get(e);
				if (this.__parent) this.__parent.appendChild(this.__body)
			}
			this.__doAddParentClass()
		}
	};
	_._$show = function () {
		if (this.__parent && this.__body && this.__body.parentNode != this.__parent) this.__parent.appendChild(this.__body)
	};
	_._$hide = function () {
		i._$removeByEC(this.__body)
	};
	if (!0) e.copy(e.P("nej.ui"), r);
	return r
}, "017b426dd2bb4315fa45d567a1fd3718", "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "8fd03edddb19cf8c294f56ca6638c475", "e0793c838b68fed5a7e1742035643bec", "12c5dab742044e15807978f676f5c3fc");
I$("285e64765191768caf2cc6de0397e37c", function (e, t, i, n) {
	var s = {
		404: "网络异常，请刷新页面重试",
		"-1": "网络不好，请刷新页面重试",
		"-2": "网络不好，请刷新页面重试",
		0: "网络不好，请刷新页面重试",
		161: "该帐号不是网易靓号，此处仅支持网易靓号登录",
		401: "操作超时，请刷新页面重试",
		40110: "帐号格式错误",
		40109: "手机号格式错误",
		405: "本次登录存在异常，请刷新重试或更换浏览器",
		402: "当前网络异常，请检查您的网络环境",
		403: "网络异常，建议切换网络或稍后重试",
		410: "超过IP限制，请稍后再试",
		433: "系统繁忙，请刷新页面重试",
		441: "请输入图片验证码",
		411: "IP一分钟内登录不存在的用户达到限制，5分钟后再试",
		413: "帐号或密码错误",
		455: '该帐号<a target="_blank" href="https://hc.reg.163.com/iTerm/doc.html?id=561">无法使用</a>，请重新注册其他帐号',
		415: "请获取短信验证码",
		"412-01": "您登录错误次数过多，请稍后再试",
		"412-02": "您登录错误次数过多，请明天再试",
		"413-01": "您登录密码错误次数过多，请稍后再试",
		"413-02": "您登录密码错误次数过多，请明天再试",
		"413-03": "您的IP登录密码错误次数过多，请稍后再试",
		"414-01": "您的IP登录错误次数过多，请稍后再试",
		"414-02": "您的IP登录错误次数过多，请明天再试",
		416: "您的IP登录过于频繁,请稍后再试",
		"417-01": "您的IP登录成功次数过多，请稍后再试",
		"417-02": "您的IP登录成功次数过多，请明天再试",
		"418-01": "您登录成功次数过多,请稍后再试",
		"418-02": "您登录成功次数过多,请明天再试",
		"419-01": "您登录过于频繁,请稍后再试",
		"419-02": "您的IP登录过于频繁,请稍后再试",
		420: "帐号不存在",
		424: '该靓号服务已到期，<a target="_blank" href="//haoma.163.com/pay/pay.do?ayRenew=1">点击续费</a>，更多精彩',
		425: '该帐号尚未激活，请到已注册的邮箱<a target="_blank" href="#">激活帐号</a>',
		426: "该帐号未及时激活，请重新注册",
		442: "请输入正确的验证码",
		443: "请输入正确的短信验证码",
		409: "您登录过于频繁,请稍后再试",
		500: "系统繁忙，请您稍后再试",
		503: "服务器繁忙，请稍后再试",
		505: "次数超限，请稍后再试",
		602: '邮箱服务已到期，<a target="_blank" href="https://vpay.vip.163.com/center/index.html?sign={{sign}}&from={{product}}&utm_source={{product}}">请立即续费</a>',
		431: "请求错误，请您稍后再试",
		434: "您验证错误次数过多，请稍后再试",
		435: "您验证错误次数过多，请改天再试",
		436: "您验证错误次数过多，请稍后再试",
		437: "您验证错误次数过多，请改天再试",
		430: "此次登录不需要进行密保验证",
		452: '帐号正在注销中，如需使用，请先<a target="_blank" href="https://{{aqhost}}/logoutQuery.html?username={{username}}&from=webzjlogin">撤销注销</a>',
		453: "该帐号已经注销，请更换其他帐号",
		454: '如需使用该帐号，请先<a target="_blank" href="https://{{aqhost}}/login.html?from=webzjlogin&promark={{promark}}&username={{username}}&curl=https%3a%2f%2f{{aqhost2}}%2fverify.html%3Ffrom%3Dwebzjlogin%23%2fbindMobile">绑定安全手机</a>',
		458: "短信发送过于频繁，请稍后再试"
	};
	return s
});
! function (e, t) {
	"object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : "object" == typeof exports ? exports.Regular = t() : e.Regular = t()
}(this, function () {
	return function (e) {
		function t(n) {
			if (i[n]) return i[n].exports;
			var s = i[n] = {
				exports: {},
				id: n,
				loaded: !1
			};
			return e[n].call(s.exports, s, s.exports, t), s.loaded = !0, s.exports
		}
		var i = {};
		return t.m = e, t.c = i, t.p = "", t(0)
	}([
		function (e, t, i) {
			var n = i(1),
				s = i(2),
				a = e.exports = i(3),
				r = a.Parser,
				o = a.Lexer;
			n.browser && (i(6), i(7), i(8), a.dom = i(4)), a.env = n, a.util = i(5), a.parse = function (e, t) {
				t = t || {}, (t.BEGIN || t.END) && (t.BEGIN && (s.BEGIN = t.BEGIN), t.END && (s.END = t.END), o.setup());
				var i = new r(e).parse();
				return t.stringify ? JSON.stringify(i) : i
			}
		},
		function (e, t, i) {
			var n = i(5);
			t.svg = function () {
				return "undefined" != typeof document && document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1")
			}(), t.browser = "undefined" != typeof document && document.nodeType, t.exprCache = n.cache(1e3), t.isRunning = !1
		},
		function (e) {
			e.exports = {
				BEGIN: "{",
				END: "}"
			}
		},
		function (e, t, i) {
			var n = i(1),
				s = i(11),
				a = i(12),
				r = i(2),
				o = i(5),
				c = i(13),
				d = {};
			if (n.browser) {
				var _ = i(4),
					l = i(9),
					u = i(10),
					f = _.doc;
				d = i(14)
			}
			var h = i(15),
				p = i(16),
				m = i(17),
				g = i(18),
				b = function (e, t) {
					var i = n.isRunning;
					n.isRunning = !0;
					var s, r;
					e = e || {}, t = t || {}, e.data = e.data || {}, e.computed = e.computed || {}, e.events = e.events || {}, this.data && o.extend(e.data, this.data), this.computed && o.extend(e.computed, this.computed), this.events && o.extend(e.events, this.events), o.extend(this, e, !0), this.$parent && this.$parent._append(this), this._children = [], this.$refs = {}, r = this.template, "string" == typeof r && r.length < 16 && (s = _.find(r)) && (r = s.innerHTML), r && r.nodeType && (r = r.innerHTML), "string" == typeof r && (this.template = new a(r).parse()), this.computed = v(this.computed), this.$root = this.$root || this, this.events && this.$on(this.events), this.$emit("$config"), this.config && this.config(this.data);
					var c = this._body;
					this._body = null, c && c.ast && c.ast.length && (this.$body = o.getCompileFn(c.ast, c.ctx, {
						outer: this,
						namespace: t.namespace,
						extra: t.extra,
						record: !0
					})), r && (this.group = this.$compile(this.template, {
						namespace: t.namespace
					}), d.node(this)), this.$parent || this.$update(), this.$ready = !0, this.$emit("$init"), this.init && this.init(this.data), n.isRunning = i
				};
			l && (l.Regular = b), o.extend(b, {
				_directives: {
					__regexp__: []
				},
				_plugins: {},
				_protoInheritCache: ["directive", "use"],
				__after__: function (e, t) {
					var i;
					if (this.__after__ = e.__after__, t.name && b.component(t.name, this), i = t.template) {
						var n, s;
						"string" == typeof i && i.length < 16 && (n = _.find(i)) && (i = n.innerHTML, (s = _.attr(n, "name")) && b.component(s, this)), i.nodeType && (i = i.innerHTML), "string" == typeof i && (this.prototype.template = new a(i).parse())
					}
					t.computed && (this.prototype.computed = v(t.computed)), b._inheritConfig(this, e)
				},
				directive: function (e, t) {
					if ("object" === o.typeOf(e)) {
						for (var i in e) e.hasOwnProperty(i) && this.directive(i, e[i]);
						return this
					}
					var n, s = o.typeOf(e),
						a = this._directives;
					if (null != t) return "function" == typeof t && (t = {
						link: t
					}), "string" === s ? a[e] = t : "regexp" === s && (t.regexp = e, a.__regexp__.push(t)), this;
					else {
						if ("string" === s && (n = a[e])) return n;
						for (var r = a.__regexp__, c = 0, d = r.length; d > c; c++) {
							n = r[c];
							var _ = n.regexp.test(e);
							if (_) return n
						}
					}
				},
				plugin: function (e, t) {
					var i = this._plugins;
					return null == t ? i[e] : (i[e] = t, this)
				},
				use: function (e) {
					return "string" == typeof e && (e = b.plugin(e)), "function" != typeof e ? this : (e(this, b), this)
				},
				config: function (e) {
					var t = !1;
					if ("object" == typeof e)
						for (var i in e) ("END" === i || "BEGIN" === i) && (t = !0), r[i] = e[i];
					t && s.setup()
				},
				expression: m.expression,
				Parser: a,
				Lexer: s,
				_addProtoInheritCache: function (e, t) {
					if (Array.isArray(e)) return e.forEach(b._addProtoInheritCache);
					var i = "_" + e + "s";
					b._protoInheritCache.push(e), b[i] = {}, b[e] || (b[e] = function (n, s) {
						var a = this[i];
						if ("object" == typeof n) {
							for (var r in n) n.hasOwnProperty(r) && this[e](r, n[r]);
							return this
						}
						return null == s ? a[n] : (a[n] = t ? t(s) : s, this)
					})
				},
				_inheritConfig: function (e, t) {
					var i = b._protoInheritCache,
						n = o.slice(i);
					return n.forEach(function (i) {
						e[i] = t[i];
						var n = "_" + i + "s";
						t[n] && (e[n] = o.createObject(t[n]))
					}), e
				}
			}), c(b), b._addProtoInheritCache("component"), b._addProtoInheritCache("filter", function (e) {
				return "function" == typeof e ? {
					get: e
				} : e
			}), h.mixTo(b), p.mixTo(b), b.implement({
				init: function () { },
				config: function () { },
				destroy: function () {
					this.$emit("$destroy"), this.group && this.group.destroy(!0), this.group = null, this.parentNode = null, this._watchers = null, this._children = [];
					var e = this.$parent;
					if (e) {
						var t = e._children.indexOf(this);
						e._children.splice(t, 1)
					}
					this.$parent = null, this.$root = null, this._handles = null, this.$refs = null
				},
				$compile: function (e, t) {
					t = t || {}, "string" == typeof e && (e = new a(e).parse());
					var i, n = this.__ext__,
						s = t.record;
					t.extra && (this.__ext__ = t.extra), s && this._record();
					var r = this._walk(e, t);
					if (s) {
						i = this._release();
						var o = this;
						i.length && (r.ondestroy = function () {
							o.$unwatch(i)
						})
					}
					return t.extra && (this.__ext__ = n), r
				},
				$bind: function (e, t, i) {
					var n = o.typeOf(t);
					if ("expression" === t.type || "string" === n) this._bind(e, t, i);
					else if ("array" === n)
						for (var s = 0, a = t.length; a > s; s++) this._bind(e, t[s]);
					else if ("object" === n)
						for (var s in t) t.hasOwnProperty(s) && this._bind(e, s, t[s]);
					return e.$update(), this
				},
				$unbind: function () { },
				$inject: d.inject,
				$mute: function (e) {
					e = !!e;
					var t = e === !1 && this._mute;
					return this._mute = !!e, t && this.$update(), this
				},
				_bind: function (e, t, i) {
					var n = this;
					if (!(e && e instanceof b)) throw "$bind() should pass Regular component as first argument";
					if (!t) throw "$bind() should  pass as least one expression to bind";
					if (i || (i = t), t = m.expression(t), i = m.expression(i), i.set) {
						var s = this.$watch(t, function (t) {
							e.$update(i, t)
						});
						e.$on("$destroy", function () {
							n.$unwatch(s)
						})
					}
					if (t.set) {
						var a = e.$watch(i, function (e) {
							n.$update(t, e)
						});
						this.$on("$destroy", e.$unwatch.bind(e, a))
					}
					i.set(e, t.get(this))
				},
				_walk: function (e, t) {
					if ("array" === o.typeOf(e)) {
						for (var i = [], n = 0, s = e.length; s > n; n++) i.push(this._walk(e[n], t));
						return new u(i)
					}
					return "string" == typeof e ? f.createTextNode(e) : l[e.type || "default"].call(this, e, t)
				},
				_append: function (e) {
					this._children.push(e), e.$parent = this
				},
				_handleEvent: function (e, t, i, n) {
					var s, a = this.constructor,
						r = "function" != typeof i ? o.handleEvent.call(this, i, t) : i,
						c = a.event(t);
					return c ? s = c.call(this, e, r, n) : _.on(e, t, r), c ? s : function () {
						_.off(e, t, r)
					}
				},
				_touchExpr: function (e) {
					var t, i = this.__ext__,
						n = {};
					if ("expression" !== e.type || e.touched) return e;
					if (t = e.get || (e.get = new Function(o.ctxName, o.extName, o.prefix + "return (" + e.body + ")")), n.get = i ? function (e) {
						return t(e, i)
					} : t, e.setbody && !e.set) {
						var s = e.setbody;
						e.set = function (t, i, n) {
							return e.set = new Function(o.ctxName, o.setName, o.extName, o.prefix + s), e.set(t, i, n)
						}, e.setbody = null
					}
					return e.set && (n.set = i ? function (t, n) {
						return e.set(t, n, i)
					} : e.set), o.extend(n, {
						type: "expression",
						touched: !0,
						once: e.once || e.constant
					}), n
				},
				_f_: function (e) {
					var t = this.constructor,
						i = t.filter(e);
					if (!i) throw Error("filter " + e + " is undefined");
					return i
				},
				_sg_: function (e, t, i) {
					if ("undefined" != typeof i) {
						var n = this.computed,
							s = n[e];
						if (s) {
							if ("expression" !== s.type || s.get || this._touchExpr(s), s.get) return s.get(this);
							o.log("the computed '" + e + "' don't define the get function,  get data." + e + " altnately", "warn")
						}
					}
					return "undefined" == typeof t || "undefined" == typeof e ? void 0 : i && "undefined" != typeof i[e] ? i[e] : t[e]
				},
				_ss_: function (e, t, i, n, s) {
					var a, s = this.computed,
						n = n || "=",
						r = s ? s[e] : null;
					if ("=" !== n) switch (a = r ? r.get(this) : i[e], n) {
						case "+=":
							t = a + t;
							break;
						case "-=":
							t = a - t;
							break;
						case "*=":
							t = a * t;
							break;
						case "/=":
							t = a / t;
							break;
						case "%=":
							t = a % t
					}
					if (r) {
						if (r.set) return r.set(this, t);
						o.log("the computed '" + e + "' don't define the set function,  assign data." + e + " altnately", "warn")
					}
					return i[e] = t, t
				}
			}), b.prototype.inject = function () {
				return o.log("use $inject instead of inject", "error"), this.$inject.apply(this, arguments)
			}, b.filter(g), e.exports = b;
			var v = function () {
				function e(e) {
					return function (t) {
						return e.call(t, t.data)
					}
				}

				function t(e) {
					return function (t, i) {
						return e.call(t, i, t.data), i
					}
				}
				return function (i) {
					if (i) {
						var n, s, a, r = {};
						for (var o in i) n = i[o], a = typeof n, "expression" !== n.type ? "string" === a ? r[o] = m.expression(n) : (s = r[o] = {
							type: "expression"
						}, "function" === a ? s.get = e(n) : (n.get && (s.get = e(n.get)), n.set && (s.set = t(n.set)))) : r[o] = n;
						return r
					}
				}
			}()
		},
		function (e, t, i) {
			function n(e) {
				return ("" + e).replace(/-\D/g, function (e) {
					return e.charAt(1).toUpperCase()
				})
			}

			function s(e, t) {
				return "change" === t && c.msie < 9 && e && e.tagName && "input" === e.tagName.toLowerCase() && ("checkbox" === e.type || "radio" === e.type) ? "click" : t
			}

			function a(e) {
				if (e = e || window.event, e._fixed) return e;
				this.event = e, this.target = e.target || e.srcElement;
				var t = this.type = e.type,
					i = this.button = e.button;
				if (p.test(t) && (this.pageX = null != e.pageX ? e.pageX : e.clientX + m.scrollLeft, this.pageY = null != e.pageX ? e.pageY : e.clientY + m.scrollTop, "mouseover" === t || "mouseout" === t)) {
					for (var n = e.relatedTarget || e[("mouseover" === t ? "from" : "to") + "Element"]; n && 3 === n.nodeType;) n = n.parentNode;
					this.relatedTarget = n
				} ("DOMMouseScroll" === t || "mousewheel" === t) && (this.wheelDelta = e.wheelDelta ? e.wheelDelta / 120 : -(e.detail || 0) / 3), this.which = e.which || e.keyCode, this.which || void 0 === i || (this.which = 1 & i ? 1 : 2 & i ? 3 : 4 & i ? 2 : 0), this._fixed = !0
			}
			var r, o, c = e.exports,
				d = i(1),
				_ = i(5),
				l = document.createElement("div"),
				u = function () { }, f = {
					html: "http://www.w3.org/1999/xhtml",
					svg: "http://www.w3.org/2000/svg"
				};
			c.body = document.body, c.doc = document, c.tNode = l, l.addEventListener ? (r = function (e, t, i) {
				e.addEventListener(t, i, !1)
			}, o = function (e, t, i) {
				e.removeEventListener(t, i, !1)
			}) : (r = function (e, t, i) {
				e.attachEvent("on" + t, i)
			}, o = function (e, t, i) {
				e.detachEvent("on" + t, i)
			}), c.msie = parseInt((/msie (\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1]), isNaN(c.msie) && (c.msie = parseInt((/trident\/.*; rv:(\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1])), c.find = function (e) {
				if (document.querySelector) try {
					return document.querySelector(e)
				} catch (t) { }
				return -1 !== e.indexOf("#") ? document.getElementById(e.slice(1)) : void 0
			}, c.inject = function (e, t, i) {
				if (i = i || "bottom", e) {
					if (Array.isArray(e)) {
						var n = e;
						e = c.fragment();
						for (var s = 0, a = n.length; a > s; s++) e.appendChild(n[s])
					}
					var r, o;
					switch (i) {
						case "bottom":
							t.appendChild(e);
							break;
						case "top":
							(r = t.firstChild) ? t.insertBefore(e, t.firstChild) : t.appendChild(e);
							break;
						case "after":
							(o = t.nextSibling) ? o.parentNode.insertBefore(e, o) : t.parentNode.appendChild(e);
							break;
						case "before":
							t.parentNode.insertBefore(e, t)
					}
				}
			}, c.id = function (e) {
				return document.getElementById(e)
			}, c.create = function (e, t) {
				if ("svg" === t) {
					if (!d.svg) throw Error("the env need svg support");
					t = f.svg
				}
				return t ? document.createElementNS(t, e) : document.createElement(e)
			}, c.fragment = function () {
				return document.createDocumentFragment()
			};
			var h = {
				"class": function (e, t) {
					"className" in e && (e.namespaceURI === f.html || !e.namespaceURI) ? e.className = t || "" : e.setAttribute("class", t)
				},
				"for": function (e, t) {
					"htmlFor" in e ? e.htmlFor = t : e.setAttribute("for", t)
				},
				style: function (e, t) {
					e.style ? e.style.cssText = t : e.setAttribute("style", t)
				},
				value: function (e, t) {
					e.value = null != t ? t : ""
				}
			};
			c.attr = function (e, t, i) {
				if (_.isBooleanAttr(t)) {
					if ("undefined" == typeof i) return e[t] || (e.attributes.getNamedItem(t) || u).specified ? t : void 0;
					i ? (e[t] = !0, e.setAttribute(t, t), c.msie && c.msie <= 7 && (e.defaultChecked = !0)) : (e[t] = !1, e.removeAttribute(t))
				} else if ("undefined" != typeof i) h[t] ? h[t](e, i) : null === i ? e.removeAttribute(t) : e.setAttribute(t, i);
				else if (e.getAttribute) {
					var n = e.getAttribute(t, 2);
					return null === n ? void 0 : n
				}
			}, c.on = function (e, t, i) {
				var n = t.split(" ");
				i.real = function (t) {
					var n = new a(t);
					n.origin = e, i.call(e, n)
				}, n.forEach(function (t) {
					t = s(e, t), r(e, t, i.real)
				})
			}, c.off = function (e, t, i) {
				var n = t.split(" ");
				i = i.real || i, n.forEach(function (t) {
					t = s(e, t), o(e, t, i)
				})
			}, c.text = function () {
				var e = {};
				return c.msie && c.msie < 9 ? (e[1] = "innerText", e[3] = "nodeValue") : e[1] = e[3] = "textContent",
					function (t, i) {
						var n = e[t.nodeType];
						return null == i ? n ? t[n] : "" : void (t[n] = i)
					}
			}(), c.html = function (e, t) {
				return "undefined" == typeof t ? e.innerHTML : void (e.innerHTML = t)
			}, c.replace = function (e, t) {
				t.parentNode && t.parentNode.replaceChild(e, t)
			}, c.remove = function (e) {
				e.parentNode && e.parentNode.removeChild(e)
			}, c.css = function (e, t, i) {
				if ("object" !== _.typeOf(t)) {
					if ("undefined" == typeof i) {
						var s;
						return c.msie <= 8 && (s = e.currentStyle && e.currentStyle[t], "" === s && (s = "auto")), s = s || e.style[t], c.msie <= 8 && (s = "" === s ? void 0 : s), s
					}
					t = n(t), t && (e.style[t] = i)
				} else
					for (var a in t) t.hasOwnProperty(a) && c.css(e, a, t[a])
			}, c.addClass = function (e, t) {
				var i = e.className || ""; - 1 === (" " + i + " ").indexOf(" " + t + " ") && (e.className = i ? i + " " + t : t)
			}, c.delClass = function (e, t) {
				var i = e.className || "";
				e.className = (" " + i + " ").replace(" " + t + " ", " ").trim()
			}, c.hasClass = function (e, t) {
				var i = e.className || "";
				return -1 !== (" " + i + " ").indexOf(" " + t + " ")
			};
			var p = /^(?:click|dblclick|contextmenu|DOMMouseScroll|mouse(?:\w+))$/,
				m = document;
			m = m.compatMode && "CSS1Compat" !== m.compatMode ? m.body : m.documentElement, _.extend(a.prototype, {
				immediateStop: _.isFalse,
				stop: function () {
					this.preventDefault().stopPropagation()
				},
				preventDefault: function () {
					return this.event.preventDefault ? this.event.preventDefault() : this.event.returnValue = !1, this
				},
				stopPropagation: function () {
					return this.event.stopPropagation ? this.event.stopPropagation() : this.event.cancelBubble = !0, this
				},
				stopImmediatePropagation: function () {
					this.event.stopImmediatePropagation && this.event.stopImmediatePropagation()
				}
			}), c.nextFrame = function () {
				var e = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (e) {
					setTimeout(e, 16)
				}, t = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelRequestAnimationFrame || function (e) {
					clearTimeout(e)
				};
				return function (i) {
					var n = e(i);
					return function () {
						t(n)
					}
				}
			}();
			var g;
			c.nextReflow = c.msie ? function (e) {
				return c.nextFrame(function () {
					g = document.body.offsetWidth, e()
				})
			} : c.nextFrame
		},
		function (e, t, i) {
			(function (t) {
				function n(e, t) {
					"undefined" != typeof console && console[t || "log"](e)
				}
				i(19)();
				var s = e.exports,
					a = i(20),
					r = [].slice,
					o = {}.toString,
					c = "undefined" != typeof window ? window : t;
				s.noop = function () { }, s.uid = function () {
					var e = 0;
					return function () {
						return e++
					}
				}(), s.extend = function (e, t, i) {
					for (var n in t) ("undefined" == typeof e[n] || i === !0) && (e[n] = t[n]);
					return e
				}, s.keys = function (e) {
					if (Object.keys) return Object.keys(e);
					var t = [];
					for (var i in e) e.hasOwnProperty(i) && t.push(i);
					return t
				}, s.varName = "d", s.setName = "p_", s.ctxName = "c", s.extName = "e", s.rWord = /^[\$\w]+$/, s.rSimpleAccessor = /^[\$\w]+(\.[\$\w]+)*$/, s.nextTick = "function" == typeof setImmediate ? setImmediate.bind(c) : function (e) {
					setTimeout(e, 0)
				}, s.prefix = "var " + s.varName + "=" + s.ctxName + ".data;" + s.extName + "=" + s.extName + "||'';", s.slice = function (e, t, i) {
					for (var n = [], s = t || 0, a = i || e.length; a > s; s++) {
						var r = e[s];
						n.push(r)
					}
					return n
				}, s.typeOf = function (e) {
					return null == e ? String(e) : o.call(e).slice(8, -1).toLowerCase()
				}, s.makePredicate = function (e) {
					function t(e) {
						if (1 === e.length) return i += "return str === '" + e[0] + "';";
						i += "switch(str){";
						for (var t = 0; t < e.length; ++t) i += "case '" + e[t] + "':";
						i += "return true}return false;"
					}
					"string" == typeof e && (e = e.split(" "));
					var i = "",
						n = [];
					e: for (var s = 0; s < e.length; ++s) {
						for (var a = 0; a < n.length; ++a)
							if (n[a][0].length === e[s].length) {
								n[a].push(e[s]);
								continue e
							}
						n.push([e[s]])
					}
					if (n.length > 3) {
						n.sort(function (e, t) {
							return t.length - e.length
						}), i += "switch(str.length){";
						for (var s = 0; s < n.length; ++s) {
							var r = n[s];
							i += "case " + r[0].length + ":", t(r)
						}
						i += "}"
					} else t(e);
					return new Function("str", i)
				}, s.trackErrorPos = function () {
					function e(e, t) {
						for (var i = 0, n = 0, s = e.length; s > n; n++) {
							var a = (e[n] || "").length;
							if (i + a > t) return {
								num: n,
								line: e[n],
								start: t - n - i,
								prev: e[n - 1],
								next: e[n + 1]
							};
							i += a
						}
					}

					function t(e, t, i, a) {
						var r = e.length,
							o = t - n;
						0 > o && (o = 0);
						var c = t + s;
						c > r && (c = r);
						var d = e.slice(o, c),
							_ = "[" + (i + 1) + "] " + (o > 0 ? ".." : ""),
							l = r > c ? ".." : "",
							u = _ + d + l;
						return a && (u += "\n" + new Array(t - o + _.length + 1).join(" ") + "^^^"), u
					}
					var i = /\r\n|[\n\r\u2028\u2029]/g,
						n = 20,
						s = 20;
					return function (n, s) {
						s > n.length - 1 && (s = n.length - 1), i.lastIndex = 0;
						var a = n.split(i),
							r = e(a, s),
							o = r.start,
							c = r.num;
						return (r.prev ? t(r.prev, o, c - 1) + "\n" : "") + t(r.line, o, c, !0) + "\n" + (r.next ? t(r.next, o, c + 1) + "\n" : "")
					}
				}();
				var d = /\((\?\!|\?\:|\?\=)/g;
				s.findSubCapture = function (e) {
					var t = 0,
						i = 0,
						n = e.length,
						s = e.match(d);
					for (s = s ? s.length : 0; n--;) {
						var a = e.charAt(n);
						(0 === n || "\\" !== e.charAt(n - 1)) && ("(" === a && t++, ")" === a && i++);
					}
					if (t !== i) throw "RegExp: " + e + "'s bracket is not marched";
					return t - s
				}, s.escapeRegExp = function (e) {
					return e.replace(/[-[\]{}()*+?.\\^$|,#\s]/g, function (e) {
						return "\\" + e
					})
				};
				var _ = new RegExp("&(?:(#x[0-9a-fA-F]+)|(#[0-9]+)|(" + s.keys(a).join("|") + "));", "gi");
				s.convertEntity = function (e) {
					return ("" + e).replace(_, function (e, t, i, n) {
						var s;
						return s = i ? parseInt(i.slice(1), 10) : t ? parseInt(t.slice(2), 16) : a[n], String.fromCharCode(s)
					})
				}, s.createObject = function (e, t) {
					function i() { }
					i.prototype = e;
					var n = new i;
					return t && s.extend(n, t), n
				}, s.createProto = function (e, t) {
					function i() {
						this.constructor = e
					}
					return i.prototype = t, e.prototype = new i
				}, s.clone = function (e) {
					var t = s.typeOf(e);
					if ("array" === t) {
						for (var i = [], n = 0, a = e.length; a > n; n++) i[n] = e[n];
						return i
					}
					if ("object" === t) {
						var i = {};
						for (var n in e) e.hasOwnProperty(n) && (i[n] = e[n]);
						return i
					}
					return e
				}, s.equals = function (e, t) {
					var i = typeof e;
					return "number" === i && "number" == typeof t && isNaN(e) && isNaN(t) ? !0 : e === t
				};
				var l = /-([a-z])/g;
				s.camelCase = function (e) {
					return e.replace(l, function (e, t) {
						return t.toUpperCase()
					})
				}, s.throttle = function (e, t) {
					var i, n, s, t = t || 100,
						a = null,
						r = 0,
						o = function () {
							r = +new Date, a = null, s = e.apply(i, n), i = n = null
						};
					return function () {
						var c = +new Date,
							d = t - (c - r);
						return i = this, n = arguments, 0 >= d || d > t ? (clearTimeout(a), a = null, r = c, s = e.apply(i, n), i = n = null) : a || (a = setTimeout(o, d)), s
					}
				}, s.escape = function () {
					var e = /&/g,
						t = /</g,
						i = />/g,
						n = /\'/g,
						s = /\"/g,
						a = /[&<>\"\']/;
					return function (r) {
						return a.test(r) ? r.replace(e, "&amp;").replace(t, "&lt;").replace(i, "&gt;").replace(n, "&#39;").replace(s, "&quot;") : r
					}
				}(), s.cache = function (e) {
					e = e || 1e3;
					var t = [],
						i = {};
					return {
						set: function (e, n) {
							return t.length > this.max && (i[t.shift()] = void 0), void 0 === i[e] && t.push(e), i[e] = n, n
						},
						get: function (e) {
							return void 0 === e ? i : i[e]
						},
						max: e,
						len: function () {
							return t.length
						}
					}
				}, s.handleEvent = function (e) {
					var t, i = this;
					return "expression" === e.type && (t = e.get), t ? function (e) {
						i.$update(function () {
							var n = this.data;
							n.$event = e;
							var s = t(i);
							s === !1 && e && e.preventDefault && e.preventDefault(), n.$event = void 0
						})
					} : function () {
						var t = r.call(arguments);
						t.unshift(e), i.$update(function () {
							i.$emit.apply(i, t)
						})
					}
				}, s.once = function (e) {
					var t = 0;
					return function () {
						0 === t++ && e.apply(this, arguments)
					}
				}, s.fixObjStr = function (e) {
					return 0 !== e.trim().indexOf("{") ? "{" + e + "}" : e
				}, s.map = function (e, t) {
					for (var i = [], n = 0, s = e.length; s > n; n++) i.push(t(e[n], n));
					return i
				}, s.log = n, s.isVoidTag = s.makePredicate("area base br col embed hr img input keygen link menuitem meta param source track wbr r-content"), s.isBooleanAttr = s.makePredicate("selected checked disabled readonly required open autofocus controls autoplay compact loop defer multiple"), s.isFalse - function () {
					return !1
				}, s.isTrue - function () {
					return !0
				}, s.isExpr = function (e) {
					return e && "expression" === e.type
				}, s.isGroup = function (e) {
					return e.inject || e.$inject
				}, s.getCompileFn = function (e, t, i) {
					return t.$compile.bind(t, e, i)
				}
			}).call(t, function () {
				return this
			}())
		},
		function (e, t, i) {
			var n = i(5),
				s = i(4),
				a = (i(21), i(3)),
				r = i(22);
			i(23), i(24), e.exports = {
				"r-class": function (e, t) {
					"string" == typeof t && (t = n.fixObjStr(t)), this.$watch(t, function (t) {
						var i = " " + e.className.replace(/\s+/g, " ") + " ";
						for (var n in t) t.hasOwnProperty(n) && (i = i.replace(" " + n + " ", " "), t[n] === !0 && (i += n + " "));
						e.className = i.trim()
					}, !0)
				},
				"r-style": function (e, t) {
					"string" == typeof t && (t = n.fixObjStr(t)), this.$watch(t, function (t) {
						for (var i in t) t.hasOwnProperty(i) && s.css(e, i, t[i])
					}, !0)
				},
				"r-hide": function (e, t) {
					var i, s = null;
					n.isExpr(t) || "string" == typeof t ? this.$watch(t, function (t) {
						var n = !!t;
						n !== s && (s = n, n ? e.onleave ? i = e.onleave(function () {
							e.style.display = "none", i = null
						}) : e.style.display = "none" : (i && i(), e.style.display = "", e.onenter && e.onenter()))
					}) : t && (e.style.display = "none")
				},
				"r-html": function (e, t) {
					this.$watch(t, function (t) {
						t = t || "", s.html(e, t)
					}, {
						force: !0
					})
				},
				ref: {
					accept: r.COMPONENT_TYPE + r.ELEMENT_TYPE,
					link: function (e, t) {
						var i, s = this.$refs || (this.$refs = {});
						return n.isExpr(t) ? this.$watch(t, function (t, n) {
							i = t, s[n] === e && (s[n] = null), i && (s[i] = e)
						}) : s[i = t] = e,
							function () {
								s[i] = null
							}
					}
				}
			}, a.directive(e.exports)
		},
		function (e, t, i) {
			function n(e) {
				var t, i = [],
					n = 0,
					s = a.noop,
					r = {
						type: e,
						start: function (e) {
							return t = a.uid(), "function" == typeof e && (s = e), n > 0 ? n = 0 : r.step(), r.compelete
						},
						compelete: function () {
							t = null, s && s(), s = a.noop, n = 0
						},
						step: function () {
							i[n] && i[n](r.done.bind(r, t))
						},
						done: function (e) {
							e === t && (n < i.length - 1 ? (n++, r.step()) : r.compelete())
						},
						push: function (e) {
							i.push(e)
						}
					};
				return r
			}

			function s(e, t) {
				function i(e) {
					l && g.push(l), l = n(e)
				}

				function s(e, t) {
					t && e()
				}

				function r(e) {
					return function () {
						e.onenter = null, e.onleave = null
					}
				}
				var o = this.constructor;
				a.isExpr(t) && (t = t.get(this)), t = t.trim();
				for (var c, l, u, f, h, p, m = t.split(";"), g = [], b = [], v = 0, $ = m.length; $ > v; v++)
					if (c = m[v], h = c.split(":"), u = h[0] && h[0].trim(), f = h[1] && h[1].trim(), u)
						if (u !== d)
							if (u !== _) {
								var p = o.animation(u);
								if (!p || !l) throw Error(p ? "you should start with `on` or `event` in animation" : "undefined animator 【" + u + "】");
								l.push(p.call(this, {
									element: e,
									done: l.done,
									param: f
								}))
							} else i(f), "leave" === f ? (e.onleave = l.start, b.push(r(e))) : "enter" === f ? (e.onenter = l.start, b.push(r(e))) : "on" + f in e ? b.push(this._handleEvent(e, f, l.start)) : (this.$on(f, l.start), b.push(this.$off.bind(this, f, l.start)));
						else i("when"), this.$watch(f, s.bind(this, l.start));
				return b.length ? function () {
					b.forEach(function (e) {
						e()
					})
				} : void 0
			}
			var a = i(5),
				r = i(21),
				o = (i(4), i(3)),
				c = /\s+/,
				d = "when",
				_ = "on";
			o._addProtoInheritCache("animation"), o.animation({
				wait: function (e) {
					var t = parseInt(e.param) || 0;
					return function (e) {
						setTimeout(e, t)
					}
				},
				"class": function (e) {
					var t = e.param.split(","),
						i = t[0] || "",
						n = parseInt(t[1]) || 1;
					return function (t) {
						r.startClassAnimate(e.element, i, t, n)
					}
				},
				call: function (e) {
					var t = this.$expression(e.param).get,
						i = this;
					return function (e) {
						t(i), i.$update(), e()
					}
				},
				emit: function (e) {
					var t = e.param,
						i = t.split(","),
						n = i[0] || "",
						s = i[1] ? this.$expression(i[1]).get : null;
					if (!n) throw Error("you shoud specified a eventname in emit command");
					var a = this;
					return function (e) {
						a.$emit(n, s ? s(a) : void 0), e()
					}
				},
				style: function (e) {
					var t, i = {}, n = e.param,
						s = n.split(",");
					return s.forEach(function (e) {
						if (e = e.trim()) {
							var n = e.split(c),
								s = n.shift(),
								a = n.join(" ");
							if (!s || !a) throw Error("invalid style in command: style");
							i[s] = a, t = !0
						}
					}),
						function (n) {
							t ? r.startStyleAnimate(e.element, i, n) : n()
						}
				}
			}), o.directive("r-animation", s), o.directive("r-anim", s)
		},
		function (e, t, i) {
			function n(e) {
				e.implement({
					$timeout: function (e, t) {
						return t = t || 0, setTimeout(function () {
							e.call(this), this.$update()
						}.bind(this), t)
					},
					$interval: function (e, t) {
						return t = t || 1e3 / 60, setInterval(function () {
							e.call(this), this.$update()
						}.bind(this), t)
					}
				})
			}
			var s = i(3);
			s.plugin("timeout", n), s.plugin("$timeout", n)
		},
		function (e, t, i) {
			function n(e, t) {
				return "object" === t ? _.keys(e) : "array" === t ? e : []
			}

			function s(e, t, i) {
				for (var n = [], s = 0, a = e.length; a > s; s++) {
					var r = this._walk(e[s], {
						element: t,
						fromElement: !0,
						attrs: e,
						extra: i
					});
					r && n.push(r)
				}
				return n
			}
			var a = i(25).diffArray,
				r = i(14),
				o = i(21),
				c = (i(26), i(10)),
				d = i(4),
				_ = i(5),
				l = e.exports = {};
			l.list = function (e, t) {
				function i(e, t) {
					for (var i = 0; t > i; i++) {
						var n = C.children.splice(e + 1, 1)[0];
						n && n.destroy(!0)
					}
				}

				function s(i, n, s, a) {
					for (var c = i; n > c; c++) {
						var l = s[c],
							u = {};
						d(u, c, l, a), u = _.createObject($, u);
						var f = y.$compile(e.body, {
							extra: u,
							namespace: v,
							record: !0,
							outer: t.outer
						});
						f.data = u;
						var h = r.last(C.get(c));
						h.parentNode && o.inject(r.node(f), h, "after"), C.children.splice(c + 1, 0, f)
					}
				}

				function d(e, t, i, n) {
					e[w] = t, n ? (e[x] = i, e[T] = n[i]) : (e[T] = i, e[x] = null)
				}

				function u(e, t, i, n) {
					for (var s = e; t > s; s++) {
						var a = C.get(s + 1),
							r = i[s];
						d(a.data, s, r, n)
					}
				}

				function f(e, t, n, r) {
					var o = 0,
						c = e.length;
					if (n || 0 === c && 0 === t.length || (n = a(e, t, !0)), n && n.length) {
						for (var d = 0; d < n.length; d++) {
							var _ = n[d],
								l = _.index,
								f = _.removed,
								h = _.add,
								p = f.length;
							if (k && p && h) {
								for (var g = Math.min(p, h), b = 0; g > b;) m(e[l], l) !== m(f[0], l) && (i(l, 1), s(l, l + 1, e, r)), f.shift(), h--, l++, b++;
								p = f.length
							}
							u(o, l, e, r), i(l, p), s(l, l + h, e, r), o = l + h - p, o = 0 > o ? 0 : o
						}
						if (c > o)
							for (var d = o; c > d; d++) {
								var v = C.get(d + 1);
								v.data[w] = d
							}
					}
				}

				function h(e, t, n) {
					var a = e.length,
						r = t.length,
						o = Math.min(a, r);
					u(0, o, e, n), r > a ? i(a, r - a) : a > r && s(r, a, e, n)
				}

				function p(e, i, s) {
					var a, c = _.typeOf(e),
						d = _.typeOf(i),
						l = n(e, c),
						u = n(i, d),
						p = l && l.length,
						m = u && u.length;
					if (!m && p && C.get(1)) {
						var g = C.children.pop();
						g.destroy && g.destroy(!0)
					}
					if ("object" === c && (a = e), k === !0 ? h(l, u, a) : f(l, u, s, a), !p && E && E.length) {
						var w = y.$compile(E, {
							extra: $,
							record: !0,
							outer: t.outer,
							namespace: v
						});
						C.children.push(w), b.parentNode && o.inject(r.node(w), b, "after")
					}
				}
				var m, g, b = (l.Regular, document.createComment("Regular list")),
					v = t.namespace,
					$ = t.extra,
					y = this,
					C = new c([b]),
					w = e.variable + "_index",
					x = e.variable + "_key",
					T = e.variable,
					E = e.alternate,
					k = e.track;
				return k && k !== !0 && (k = this._touchExpr(k), g = _.createObject($), m = function (e, t) {
					return g[T] = e, g[w] = t, k.get(y, g)
				}), this.$watch(e.sequence, p, {
					init: !0,
					diff: k !== !0,
					deep: !0
				}), C
			}, l.template = function (e, t) {
				var i, i, n = e.content,
					s = document.createComment("inlcude"),
					a = t.namespace,
					r = t.extra,
					o = new c([s]);
				if (n) {
					var d = this;
					this.$watch(n, function (e) {
						var n = o.get(1),
							c = typeof e;
						n && (n.destroy(!0), o.children.pop()), e && (o.push(i = "function" === c ? e() : d.$compile("object" !== c ? String(e) : e, {
							record: !0,
							outer: t.outer,
							namespace: a,
							extra: r
						})), s.parentNode && i.$inject(s, "before"))
					}, {
						init: !0
					})
				}
				return o
			};
			var u = 0;
			l["if"] = function (e, t) {
				var i, n, s = this,
					a = t.extra;
				if (t && t.element) {
					var d = function (o) {
						o ? (n && r.destroy(n), e.consequent && (i = s.$compile(e.consequent, {
							record: !0,
							element: t.element,
							extra: a
						}))) : (i && r.destroy(i), e.alternate && (n = s.$compile(e.alternate, {
							record: !0,
							element: t.element,
							extra: a
						})))
					};
					return this.$watch(e.test, d, {
						force: !0
					}), {
						destroy: function () {
							i ? r.destroy(i) : n && r.destroy(n)
						}
					}
				}
				var i, n, _ = document.createComment("Regular if" + u++),
					l = new c;
				l.push(_);
				var f = null,
					h = t.namespace,
					d = function (c) {
						var d = !!c;
						d !== f && (f = d, l.children[1] && (l.children[1].destroy(!0), l.children.pop()), d ? e.consequent && e.consequent.length && (i = s.$compile(e.consequent, {
							record: !0,
							outer: t.outer,
							namespace: h,
							extra: a
						}), l.push(i), _.parentNode && o.inject(r.node(i), _, "before")) : e.alternate && e.alternate.length && (n = s.$compile(e.alternate, {
							record: !0,
							outer: t.outer,
							namespace: h,
							extra: a
						}), l.push(n), _.parentNode && o.inject(r.node(n), _, "before")))
					};
				return this.$watch(e.test, d, {
					force: !0,
					init: !0
				}), l
			}, l.expression = function (e) {
				var t = document.createTextNode("");
				return this.$watch(e, function (e) {
					d.text(t, "" + (null == e ? "" : "" + e))
				}, {
					init: !0
				}), t
			}, l.text = function (e) {
				var t = document.createTextNode(_.convertEntity(e.text));
				return t
			};
			var f = /^on-(.+)$/;
			l.element = function (e, t) {
				var i, n, a = e.attrs,
					c = this.constructor,
					u = e.children,
					f = t.namespace,
					h = t.extra,
					p = e.tag,
					m = c.component(p);
				if ("r-content" === p) return _.log("r-content is deprecated, use {#inc this.$body} instead (`{#include}` as same)", "warn"), this.$body && this.$body();
				if (m || "r-component" === p) return t.Component = m, l.component.call(this, e, t);
				"svg" === p && (f = "svg"), u && u.length && (i = this.$compile(u, {
					outer: t.outer,
					namespace: f,
					extra: h
				})), n = d.create(p, f, a), i && !_.isVoidTag(p) && d.inject(r.node(i), n), e.touched || (a.sort(function (e, t) {
					var i = c.directive(e.name),
						n = c.directive(t.name);
					return i && n ? (n.priority || 1) - (i.priority || 1) : i ? 1 : n ? -1 : "type" === t.name ? 1 : -1
				}), e.touched = !0);
				var g = s.call(this, a, n, h);
				return {
					type: "element",
					group: i,
					node: function () {
						return n
					},
					last: function () {
						return n
					},
					destroy: function (e) {
						e ? o.remove(n, i ? i.destroy.bind(i) : _.noop) : i && i.destroy(), g.length && g.forEach(function (e) {
							e && ("function" == typeof e.destroy ? e.destroy() : e())
						})
					}
				}
			}, l.component = function (e, t) {
				for (var i, n, s, a, o = e.attrs, d = t.Component, l = this.constructor, u = t.extra, h = t.namespace, p = this, m = {}, g = 0, b = o.length; b > g; g++) {
					var v = o[g],
						$ = this._touchExpr(void 0 === v.value ? !0 : v.value);
					$.constant && ($ = v.value = $.get(this)), v.value && v.value.constant === !0 && ($ = $.get(this));
					var y = v.name;
					if (!v.event) {
						var C = y.match(f);
						C && (v.event = C[1])
					}
					if ("cmpl" === v.mdf && ($ = _.getCompileFn($, this, {
						record: !0,
						namespace: h,
						extra: u,
						outer: t.outer
					})), "is" === y && !d) {
						s = $;
						var w = this.$get($, !0);
						if (d = l.component(w), "function" != typeof d) throw new Error("component " + w + " has not registed!")
					}
					var x;
					(x = v.event) ? (a = a || {}, a[x] = _.handleEvent.call(this, $, x)) : (y = v.name = _.camelCase(y), m[y] = "expression" !== $.type ? $ : $.get(p), "ref" === y && null != $ && (n = $), "isolate" === y && (i = "expression" === $.type ? $.get(p) : parseInt($ === !0 ? 3 : $, 10), m.isolate = i))
				}
				var T, E = {
					data: m,
					events: a,
					$parent: 2 & i ? null : this,
					$root: this.$root,
					$outer: t.outer,
					_body: {
						ctx: this,
						ast: e.children
					}
				}, t = {
					namespace: h,
					extra: t.extra
				}, k = new d(E, t);
				n && this.$refs && (T = d.directive("ref").link, this.$on("$destroy", T.call(this, k, n))), n && p.$refs && (p.$refs[n] = k);
				for (var g = 0, b = o.length; b > g; g++) {
					var v = o[g],
						$ = v.value || !0,
						y = v.name;
					"expression" !== $.type || v.event || ($ = p._touchExpr($), 2 & i || this.$watch($, function (e, t) {
						this.data[e] = t
					}.bind(k, y)), !$.set || 1 & i || k.$watch(y, p.$update.bind(p, $), {
						sync: !0
					}))
				}
				if (s && "expression" === s.type) {
					var S = new c;
					return S.push(k), this.$watch(s, function (e) {
						var t = l.component(e);
						if (!t) throw new Error("component " + e + " has not registed!");
						var i = new t(E),
							s = S.children.pop();
						S.push(i), i.$inject(r.last(s), "after"), s.destroy(), n && (p.$refs[n] = i)
					}, {
						sync: !0
					}), S
				}
				return k
			}, l.attribute = function (e, t) {
				var i = e,
					n = i.name,
					s = i.value || "",
					a = s.constant,
					r = this.constructor,
					o = r.directive(n),
					c = t.element,
					l = this;
				if (s = this._touchExpr(s), a && (s = s.get(this)), o && o.link) {
					var u = o.link.call(l, c, s, n, t.attrs);
					return "function" == typeof u && (u = {
						destroy: u
					}), u
				}
				return "expression" === s.type ? this.$watch(s, function (e) {
					d.attr(c, n, e)
				}, {
					init: !0
				}) : _.isBooleanAttr(n) ? d.attr(c, n, !0) : d.attr(c, n, s), t.fromElement ? void 0 : {
					destroy: function () {
						d.attr(c, n, null)
					}
				}
			}
		},
		function (e, t, i) {
			function n(e) {
				this.children = e || []
			}
			var s = i(5),
				a = i(14),
				r = s.extend(n.prototype, {
					destroy: function (e) {
						a.destroy(this.children, e), this.ondestroy && this.ondestroy(), this.children = null
					},
					get: function (e) {
						return this.children[e]
					},
					push: function (e) {
						this.children.push(e)
					}
				});
			r.inject = r.$inject = a.inject, e.exports = n
		},
		function (e, t, i) {
			function n(e) {
				return function (t) {
					return {
						type: e,
						value: t
					}
				}
			}

			function s(e, t) {
				l[_.END] && (this.markStart = l[_.END], this.markEnd = _.END), this.input = (e || "").trim(), this.opts = t || {}, this.map = 2 !== this.opts.mode ? o : c, this.states = ["INIT"], t && t.expression && (this.states.push("JST"), this.expression = !0)
			}

			function a(e) {
				for (var t, i, n = {}, s = 0, a = e.length; a > s; s++) t = e[s], i = t[2] || "INIT", (n[i] || (n[i] = {
					rules: [],
					links: []
				})).rules.push(t);
				return r(n)
			}

			function r(e) {
				function t(e, t) {
					return "string" == typeof u[t] ? d.escapeRegExp(u[t]) : String(u[t]).slice(1, -1)
				}
				var i, s, a, r, o, c, _;
				for (var l in e) {
					i = e[l], i.curIndex = 1, s = i.rules, a = [];
					for (var f = 0, h = s.length; h > f; f++) _ = s[f], o = _[0], r = _[1], "string" == typeof r && (r = n(r)), "regexp" === d.typeOf(o) && (o = o.toString().slice(1, -1)), o = o.replace(/\{(\w+)\}/g, t), c = d.findSubCapture(o) + 1, i.links.push([i.curIndex, c, r]), i.curIndex += c, a.push(o);
					i.TRUNK = new RegExp("^(?:(" + a.join(")|(") + "))")
				}
				return e
			}
			var o, c, d = i(5),
				_ = i(2),
				l = {
					"}": "{",
					"]": "["
				}, u = {
					NAME: /(?:[:_A-Za-z][-\.:_0-9A-Za-z]*)/,
					IDENT: /[\$_A-Za-z][_0-9A-Za-z\$]*/,
					SPACE: /[\r\n\t\f ]/
				}, f = /a|(b)/.exec("a"),
				h = f && void 0 === f[1] ? function (e) {
					return void 0 !== e
				} : function (e) {
					return !!e
				}, p = s.prototype;
			p.lex = function (e) {
				e = (e || this.input).trim();
				var t, i, n, s, a, r = [];
				this.input = e, this.marks = 0, this.index = 0;
				for (var o = 0; e;) o++, a = this.state(), t = this.map[a], i = t.TRUNK.exec(e), i || this.error("Unrecoginized Token"), n = i[0].length, e = e.slice(n), s = this._process.call(this, i, t, e), s && r.push(s), this.index += n;
				return r.push({
					type: "EOF"
				}), r
			}, p.error = function (e) {
				throw Error("Parse Error: " + e + ":\n" + d.trackErrorPos(this.input, this.index))
			}, p._process = function (e, t, i) {
				for (var n, s = t.links, a = !1, r = s.length, o = 0; r > o; o++) {
					var c = s[o],
						d = c[2],
						_ = c[0];
					if (h(e[_])) {
						a = !0, d && (n = d.apply(this, e.slice(_, _ + c[1])), n && (n.pos = this.index));
						break
					}
				}
				if (!a) switch (i.charAt(0)) {
					case "<":
						this.enter("TAG");
						break;
					default:
						this.enter("JST")
				}
				return n
			}, p.enter = function (e) {
				return this.states.push(e), this
			}, p.state = function () {
				var e = this.states;
				return e[e.length - 1]
			}, p.leave = function (e) {
				var t = this.states;
				e && t[t.length - 1] !== e || t.pop()
			}, s.setup = function () {
				u.END = _.END, u.BEGIN = _.BEGIN, o = a([m.ENTER_JST, m.ENTER_TAG, m.TEXT, m.TAG_NAME, m.TAG_OPEN, m.TAG_CLOSE, m.TAG_PUNCHOR, m.TAG_ENTER_JST, m.TAG_UNQ_VALUE, m.TAG_STRING, m.TAG_SPACE, m.TAG_COMMENT, m.JST_OPEN, m.JST_CLOSE, m.JST_COMMENT, m.JST_EXPR_OPEN, m.JST_IDENT, m.JST_SPACE, m.JST_LEAVE, m.JST_NUMBER, m.JST_PUNCHOR, m.JST_STRING, m.JST_COMMENT]), c = a([m.ENTER_JST2, m.TEXT, m.JST_COMMENT, m.JST_OPEN, m.JST_CLOSE, m.JST_EXPR_OPEN, m.JST_IDENT, m.JST_SPACE, m.JST_LEAVE, m.JST_NUMBER, m.JST_PUNCHOR, m.JST_STRING, m.JST_COMMENT])
			};
			var m = {
				ENTER_JST: [/[^\x00<]*?(?={BEGIN})/,
					function (e) {
						return this.enter("JST"), e ? {
							type: "TEXT",
							value: e
						} : void 0
					}
				],
				ENTER_JST2: [/[^\x00]*?(?={BEGIN})/,
					function (e) {
						return this.enter("JST"), e ? {
							type: "TEXT",
							value: e
						} : void 0
					}
				],
				ENTER_TAG: [/[^\x00]*?(?=<[\w\/\!])/,
					function (e) {
						return this.enter("TAG"), e ? {
							type: "TEXT",
							value: e
						} : void 0
					}
				],
				TEXT: [/[^\x00]+/, "TEXT"],
				TAG_NAME: [/{NAME}/, "NAME", "TAG"],
				TAG_UNQ_VALUE: [/[^\{}&"'=><`\r\n\f\t ]+/, "UNQ", "TAG"],
				TAG_OPEN: [/<({NAME})\s*/,
					function (e, t) {
						return {
							type: "TAG_OPEN",
							value: t
						}
					}, "TAG"
				],
				TAG_CLOSE: [/<\/({NAME})[\r\n\f\t ]*>/,
					function (e, t) {
						return this.leave(), {
							type: "TAG_CLOSE",
							value: t
						}
					}, "TAG"
				],
				TAG_ENTER_JST: [/(?={BEGIN})/,
					function () {
						this.enter("JST")
					}, "TAG"
				],
				TAG_PUNCHOR: [/[\>\/=&]/,
					function (e) {
						return ">" === e && this.leave(), {
							type: e,
							value: e
						}
					}, "TAG"
				],
				TAG_STRING: [/'([^']*)'|"([^"]*)\"/,
					function (e, t, i) {
						var n = t || i || "";
						return {
							type: "STRING",
							value: n
						}
					}, "TAG"
				],
				TAG_SPACE: [/{SPACE}+/, null, "TAG"],
				TAG_COMMENT: [/<\!--([^\x00]*?)--\>/,
					function () {
						this.leave()
					}, "TAG"
				],
				JST_OPEN: ["{BEGIN}#{SPACE}*({IDENT})",
					function (e, t) {
						return {
							type: "OPEN",
							value: t
						}
					}, "JST"
				],
				JST_LEAVE: [/{END}/,
					function (e) {
						return this.markEnd === e && this.expression ? {
							type: this.markEnd,
							value: this.markEnd
						} : this.markEnd && this.marks ? (this.marks--, {
							type: this.markEnd,
							value: this.markEnd
						}) : (this.firstEnterStart = !1, this.leave("JST"), {
							type: "END"
						})
					}, "JST"
				],
				JST_CLOSE: [/{BEGIN}\s*\/({IDENT})\s*{END}/,
					function (e, t) {
						return this.leave("JST"), {
							type: "CLOSE",
							value: t
						}
					}, "JST"
				],
				JST_COMMENT: [/{BEGIN}\!([^\x00]*?)\!{END}/,
					function () {
						this.leave()
					}, "JST"
				],
				JST_EXPR_OPEN: ["{BEGIN}",
					function (e) {
						if (e === this.markStart) {
							if (this.expression) return {
								type: this.markStart,
								value: this.markStart
							};
							if (this.firstEnterStart || this.marks) return this.marks++, this.firstEnterStart = !1, {
								type: this.markStart,
								value: this.markStart
							};
							this.firstEnterStart = !0
						}
						return {
							type: "EXPR_OPEN",
							escape: !1
						}
					}, "JST"
				],
				JST_IDENT: ["{IDENT}", "IDENT", "JST"],
				JST_SPACE: [/[ \r\n\f]+/, null, "JST"],
				JST_PUNCHOR: [/[=!]?==|[-=><+*\/%\!]?\=|\|\||&&|\@\(|\.\.|[<\>\[\]\(\)\-\|\{}\+\*\/%?:\.!,]/,
					function (e) {
						return {
							type: e,
							value: e
						}
					}, "JST"
				],
				JST_STRING: [/'([^']*)'|"([^"]*)"/,
					function (e, t, i) {
						return {
							type: "STRING",
							value: t || i || ""
						}
					}, "JST"
				],
				JST_NUMBER: [/(?:[0-9]*\.[0-9]+|[0-9]+)(e\d+)?/,
					function (e) {
						return {
							type: "NUMBER",
							value: parseFloat(e, 10)
						}
					}, "JST"
				]
			};
			s.setup(), e.exports = s
		},
		function (e, t, i) {
			function n(e, t) {
				t = t || {}, this.input = e, this.tokens = new o(e, t).lex(), this.pos = 0, this.length = this.tokens.length
			}
			var s = i(5),
				a = i(2),
				r = i(26),
				o = i(11),
				c = s.varName,
				d = s.ctxName,
				_ = s.extName,
				l = s.makePredicate("STRING IDENT NUMBER"),
				u = s.makePredicate("true false undefined null this Array Date JSON Math NaN RegExp decodeURI decodeURIComponent encodeURI encodeURIComponent parseFloat parseInt Object"),
				f = n.prototype;
			f.parse = function () {
				this.pos = 0;
				var e = this.program();
				return "TAG_CLOSE" === this.ll().type && this.error("You may got a unclosed Tag"), e
			}, f.ll = function (e) {
				e = e || 1, 0 > e && (e += 1);
				var t = this.pos + e - 1;
				return t > this.length - 1 ? this.tokens[this.length - 1] : this.tokens[t]
			}, f.la = function (e) {
				return (this.ll(e) || "").type
			}, f.match = function (e, t) {
				var i;
				return (i = this.eat(e, t)) ? i : (i = this.ll(), void this.error("expect [" + e + (null == t ? "" : ":" + t) + ']" -> got "[' + i.type + (null == t ? "" : ":" + i.value) + "]", i.pos))
			}, f.error = function (e, t) {
				throw e = "\n【 parse failed 】 " + e + ":\n\n" + s.trackErrorPos(this.input, "number" == typeof t ? t : this.ll().pos || 0), new Error(e)
			}, f.next = function (e) {
				e = e || 1, this.pos += e
			}, f.eat = function (e, t) {
				var i = this.ll();
				if ("string" != typeof e) {
					for (var n = e.length; n--;)
						if (i.type === e[n]) return this.next(), i
				} else if (i.type === e && ("undefined" == typeof t || i.value === t)) return this.next(), i;
				return !1
			}, f.program = function () {
				for (var e = [], t = this.ll();
					"EOF" !== t.type && "TAG_CLOSE" !== t.type;) e.push(this.statement()), t = this.ll();
				return e
			}, f.statement = function () {
				var e = this.ll();
				switch (e.type) {
					case "NAME":
					case "TEXT":
						var t = e.value;
						for (this.next(); e = this.eat(["NAME", "TEXT"]);) t += e.value;
						return r.text(t);
					case "TAG_OPEN":
						return this.xml();
					case "OPEN":
						return this.directive();
					case "EXPR_OPEN":
						return this.interplation();
					default:
						this.error("Unexpected token: " + this.la())
				}
			}, f.xml = function () {
				var e, t, i, n;
				return e = this.match("TAG_OPEN").value, t = this.attrs(), n = this.eat("/"), this.match(">"),
					n || s.isVoidTag(e) || (i = this.program(), this.eat("TAG_CLOSE", e) || this.error("expect </" + e + "> gotno matched closeTag")), r.element(e, t, i)
			}, f.xentity = function (e) {
				var t, i, n = e.value;
				if ("NAME" === e.type) {
					if (~n.indexOf(".")) {
						var s = n.split(".");
						n = s[0], i = s[1]
					}
					return this.eat("=") && (t = this.attvalue(i)), r.attribute(n, t, i)
				}
				return "if" !== n && this.error("current version. ONLY RULE #if #else #elseif is valid in tag, the rule #" + n + " is invalid"), this["if"](!0)
			}, f.attrs = function (e) {
				var t;
				t = e ? ["NAME"] : ["NAME", "OPEN"];
				for (var i, n = []; i = this.eat(t);) n.push(this.xentity(i));
				return n
			}, f.attvalue = function (e) {
				var t = this.ll();
				switch (t.type) {
					case "NAME":
					case "UNQ":
					case "STRING":
						this.next();
						var i = t.value;
						if (~i.indexOf(a.BEGIN) && ~i.indexOf(a.END) && "cmpl" !== e) {
							var s = !0,
								o = new n(i, {
									mode: 2
								}).parse();
							if (1 === o.length && "expression" === o[0].type) return o[0];
							var c = [];
							o.forEach(function (e) {
								e.constant || (s = !1), c.push(e.body || "'" + e.text.replace(/'/g, "\\'") + "'")
							}), c = "[" + c.join(",") + "].join('')", i = r.expression(c, null, s)
						}
						return i;
					case "EXPR_OPEN":
						return this.interplation();
					default:
						this.error("Unexpected token: " + this.la())
				}
			}, f.directive = function () {
				var e = this.ll().value;
				return this.next(), "function" == typeof this[e] ? this[e]() : void this.error("Undefined directive[" + e + "]")
			}, f.interplation = function () {
				this.match("EXPR_OPEN");
				var e = this.expression(!0);
				return this.match("END"), e
			}, f.inc = f.include = function () {
				var e = this.expression();
				return this.match("END"), r.template(e)
			}, f["if"] = function (e) {
				var t = this.expression(),
					i = [],
					n = [],
					s = i,
					a = e ? "attrs" : "statement";
				this.match("END");
				for (var o, c; !(c = this.eat("CLOSE"));)
					if (o = this.ll(), "OPEN" === o.type) switch (o.value) {
						case "else":
							s = n, this.next(), this.match("END");
							break;
						case "elseif":
							return this.next(), n.push(this["if"](e)), r["if"](t, i, n);
						default:
							s.push(this[a](!0))
					} else s.push(this[a](!0));
				return "if" !== c.value && this.error("Unmatched if directive"), r["if"](t, i, n)
			}, f.list = function () {
				var e, t, i, n = this.expression(),
					s = [],
					a = [],
					o = s;
				for (this.match("IDENT", "as"), e = this.match("IDENT").value, this.eat("IDENT", "by") && (this.eat("IDENT", e + "_index") ? i = !0 : (i = this.expression(), i.constant && (i = !0))), this.match("END"); !(t = this.eat("CLOSE"));) this.eat("OPEN", "else") ? (o = a, this.match("END")) : o.push(this.statement());
				return "list" !== t.value && this.error("expect list got /" + t.value + " ", t.pos), r.list(n, e, s, a, i)
			}, f.expression = function () {
				var e;
				return this.eat("@(") ? (e = this.expr(), e.once = !0, this.match(")")) : e = this.expr(), e
			}, f.expr = function () {
				this.depend = [];
				var e = this.filter(),
					t = e.get || e,
					i = e.set;
				return r.expression(t, i, !this.depend.length)
			}, f.filter = function () {
				var e, t, i, n = this.assign(),
					a = this.eat("|"),
					r = [],
					o = "t",
					c = n.set,
					_ = "";
				if (a) {
					c && (e = []), t = "(function(" + o + "){";
					do _ = o + " = " + d + "._f_('" + this.match("IDENT").value + "' ).get.call( " + s.ctxName + "," + o, _ += this.eat(":") ? ", " + this.arguments("|").join(",") + ");" : ");", r.push(_), e && e.unshift(_.replace(" ).get.call", " ).set.call")); while (a = this.eat("|"));
					return r.push("return " + o), e && e.push("return " + o), i = t + r.join("") + "})(" + n.get + ")", e && (c = c.replace(s.setName, t + e.join("") + "})(" + s.setName + ")")), this.getset(i, c)
				}
				return n
			}, f.assign = function () {
				var e, t = this.condition();
				return (e = this.eat(["=", "+=", "-=", "*=", "/=", "%="])) ? (t.set || this.error("invalid lefthand expression in assignment expression"), this.getset(t.set.replace("," + s.setName, "," + this.condition().get).replace("'='", "'" + e.type + "'"), t.set)) : t
			}, f.condition = function () {
				var e = this.or();
				return this.eat("?") ? this.getset([e.get + "?", this.assign().get, this.match(":").type, this.assign().get].join("")) : e
			}, f.or = function () {
				var e = this.and();
				return this.eat("||") ? this.getset(e.get + "||" + this.or().get) : e
			}, f.and = function () {
				var e = this.equal();
				return this.eat("&&") ? this.getset(e.get + "&&" + this.and().get) : e
			}, f.equal = function () {
				var e, t = this.relation();
				return (e = this.eat(["==", "!=", "===", "!=="])) ? this.getset(t.get + e.type + this.equal().get) : t
			}, f.relation = function () {
				var e, t = this.additive();
				return (e = this.eat(["<", ">", ">=", "<="]) || this.eat("IDENT", "in")) ? this.getset(t.get + e.value + this.relation().get) : t
			}, f.additive = function () {
				var e, t = this.multive();
				return (e = this.eat(["+", "-"])) ? this.getset(t.get + e.value + this.additive().get) : t
			}, f.multive = function () {
				var e, t = this.range();
				return (e = this.eat(["*", "/", "%"])) ? this.getset(t.get + e.type + this.multive().get) : t
			}, f.range = function () {
				var e, t, i = this.unary();
				if (e = this.eat("..")) {
					t = this.unary();
					var n = "(function(start,end){var res = [],step=end>start?1:-1; for(var i = start; end>start?i <= end: i>=end; i=i+step){res.push(i); } return res })(" + i.get + "," + t.get + ")";
					return this.getset(n)
				}
				return i
			}, f.unary = function () {
				var e;
				return (e = this.eat(["+", "-", "~", "!"])) ? this.getset("(" + e.type + this.unary().get + ")") : this.member()
			}, f.member = function (e, t, i, n) {
				var a, r, o, u = !1;
				if (e) "string" == typeof t && l(t) ? i.push(t) : (i && i.length && this.depend.push(i), i = null);
				else {
					r = this.primary();
					var f = typeof r;
					"string" === f ? (i = [], i.push(r), t = r, o = _ + "." + r, e = d + "._sg_('" + r + "', " + c + ", " + _ + ")", u = !0) : "this" === r.get ? (e = d, i = ["this"]) : (i = null, e = r.get)
				} if (a = this.eat(["[", ".", "("])) switch (a.type) {
					case ".":
						var h = this.match("IDENT").value;
						return n = e, "(" !== this.la() ? e = d + "._sg_('" + h + "', " + e + ")" : e += "['" + h + "']", this.member(e, h, i, n);
					case "[":
						return r = this.assign(), n = e, "(" !== this.la() ? e = d + "._sg_(" + r.get + ", " + e + ")" : e += "[" + r.get + "]", this.match("]"), this.member(e, r, i, n);
					case "(":
						var p = this.arguments().join(",");
						return e = e + "(" + p + ")", this.match(")"), this.member(e, null, i)
				}
				i && i.length && this.depend.push(i);
				var m = {
					get: e
				};
				return t && (m.set = d + "._ss_(" + (t.get ? t.get : "'" + t + "'") + "," + s.setName + "," + (n ? n : s.varName) + ", '=', " + (u ? 1 : 0) + ")"), m
			}, f.arguments = function (e) {
				e = e || ")";
				var t = [];
				do this.la() !== e && t.push(this.assign().get); while (this.eat(","));
				return t
			}, f.primary = function () {
				var e = this.ll();
				switch (e.type) {
					case "{":
						return this.object();
					case "[":
						return this.array();
					case "(":
						return this.paren();
					case "STRING":
						return this.next(), this.getset("'" + e.value + "'");
					case "NUMBER":
						return this.next(), this.getset("" + e.value);
					case "IDENT":
						return this.next(), u(e.value) ? this.getset(e.value) : e.value;
					default:
						this.error("Unexpected Token: " + e.type)
				}
			}, f.object = function () {
				for (var e = [this.match("{").type], t = this.eat(["STRING", "IDENT", "NUMBER"]); t;) {
					e.push("'" + t.value + "'" + this.match(":").type);
					var i = this.assign().get;
					e.push(i), t = null, this.eat(",") && (t = this.eat(["STRING", "IDENT", "NUMBER"])) && e.push(",")
				}
				return e.push(this.match("}").type), {
					get: e.join("")
				}
			}, f.array = function () {
				var e, t = [this.match("[").type];
				if (this.eat("]")) t.push("]");
				else {
					for (;
						(e = this.assign()) && (t.push(e.get), this.eat(","));) t.push(",");
					t.push(this.match("]").type)
				}
				return {
					get: t.join("")
				}
			}, f.paren = function () {
				this.match("(");
				var e = this.filter();
				return e.get = "(" + e.get + ")", this.match(")"), e
			}, f.getset = function (e, t) {
				return {
					get: e,
					set: t
				}
			}, e.exports = n
		},
		function (e, t, i) {
			function n(e, t, i) {
				return function () {
					var n = this.supr;
					this.supr = i[e];
					var s = t.apply(this, arguments);
					return this.supr = n, s
				}
			}

			function s(e, t, i) {
				for (var s in t) t.hasOwnProperty(s) && (e[s] = o(t[s]) && o(i[s]) && r.test(t[s]) ? n(s, t[s], i) : t[s])
			}
			var a = i(5),
				r = /xy/.test(function () {
					;
					"xy"
				}) ? /\bsupr\b/ : /.*/,
				o = function (e) {
					return "function" == typeof e
				}, c = ["events", "data", "computed"],
				d = c.length;
			e.exports = function _(e) {
				function t() {
					r.apply(this, arguments)
				}

				function i(e) {
					for (var t = d; t--;) {
						var i = c[t];
						e.hasOwnProperty(i) && n.hasOwnProperty(i) && (a.extend(n[i], e[i], !0), delete e[i])
					}
					return s(n, e, o), this
				}
				e = e || {};
				var n, r = this,
					o = r && r.prototype || {};
				return "function" == typeof e ? (n = e.prototype, e.implement = i, e.extend = _, e) : (n = a.createProto(t, o), t.implement = i, t.implement(e), r.__after__ && r.__after__.call(t, r, e), t.extend = _, t)
			}
		},
		function (e, t, i) {
			var n = i(4),
				s = i(21),
				a = e.exports = {
					node: function (e) {
						var t, i, n;
						if (e) {
							if (e.element) return e.element;
							if ("function" == typeof e.node) return e.node();
							if ("number" == typeof e.nodeType) return e;
							if (e.group) return a.node(e.group);
							if (t = e.children) {
								if (1 === t.length) return a.node(t[0]);
								n = [];
								for (var s = 0, r = t.length; r > s; s++) i = a.node(t[s]), Array.isArray(i) ? n.push.apply(n, i) : i && n.push(i);
								return n
							}
						}
					},
					inject: function (e, t) {
						var i = this,
							r = a.node(i.group || i);
						if (e === !1) return s.remove(r), i;
						if (!r) return i;
						if ("string" == typeof e && (e = n.find(e)), !e) throw Error("injected node is not found");
						if (s.inject(r, e, t), i.$emit) {
							var o = i.parentNode,
								c = "after" === t || "before" === t ? e.parentNode : e;
							i.parentNode = c, i.$emit("$inject", e, t, o)
						}
						return i
					},
					last: function (e) {
						var t = e.children;
						return "function" == typeof e.last ? e.last() : "number" == typeof e.nodeType ? e : t && t.length ? a.last(t[t.length - 1]) : e.group ? a.last(e.group) : void 0
					},
					destroy: function (e, t) {
						if (e) {
							if (Array.isArray(e))
								for (var i = 0, s = e.length; s > i; i++) a.destroy(e[i], t);
							var r = e.children;
							if ("function" == typeof e.destroy) return e.destroy(t);
							"number" == typeof e.nodeType && t && n.remove(e), r && r.length && (a.destroy(r, !0), e.children = null)
						}
					}
				};
			n.element = function (e, t) {
				if (!e) return t ? [] : null;
				var i = a.node(e);
				if (1 === i.nodeType) return t ? [i] : i;
				for (var n = [], s = 0; s < i.length; s++) {
					var r = i[s];
					if (r && 1 === r.nodeType) {
						if (!t) return r;
						n.push(r)
					}
				}
				return t ? n : n[0]
			}
		},
		function (e, t, i) {
			function n() { }
			var s = [].slice,
				a = i(5),
				r = {
					$on: function (e, t) {
						if ("object" == typeof e)
							for (var i in e) this.$on(i, e[i]);
						else {
							var n = this,
								s = n._handles || (n._handles = {}),
								a = s[e] || (s[e] = []);
							a.push(t)
						}
						return this
					},
					$off: function (e, t) {
						var i = this;
						if (i._handles) {
							e || (this._handles = {});
							var n, s = i._handles;
							if (n = s[e]) {
								if (!t) return s[e] = [], i;
								for (var a = 0, r = n.length; r > a; a++)
									if (t === n[a]) return n.splice(a, 1), i
							}
							return i
						}
					},
					$emit: function (e) {
						var t, i, n, a = this,
							r = a._handles;
						if (e) {
							var i = s.call(arguments, 1),
								n = e;
							if (!r) return a;
							if (t = r[n.slice(1)])
								for (var o = 0, c = t.length; c > o; o++) t[o].apply(a, i);
							if (!(t = r[n])) return a;
							for (var d = 0, c = t.length; c > d; d++) t[d].apply(a, i);
							return a
						}
					},
					$one: function () { }
				};
			a.extend(n.prototype, r), n.mixTo = function (e) {
				e = "function" == typeof e ? e.prototype : e, a.extend(e, r)
			}, e.exports = n
		},
		function (e, t, i) {
			function n() { }
			var s = i(5),
				a = i(17).expression,
				r = i(25),
				o = r.diffArray,
				c = r.diffObject,
				d = {
					$watch: function (e, t, i) {
						var n, r, o, c, d = this.__ext__;
						this._watchers || (this._watchers = []), i = i || {}, i === !0 && (i = {
							deep: !0
						});
						var _ = s.uid("w_");
						if (Array.isArray(e)) {
							for (var l = [], u = 0, f = e.length; f > u; u++) l.push(this.$expression(e[u]).get);
							var h = [];
							o = function (e) {
								for (var t = !0, i = 0, n = l.length; n > i; i++) {
									var a = l[i](e, d);
									s.equals(a, h[i]) || (t = !1,
										h[i] = s.clone(a))
								}
								return t ? !1 : h
							}
						} else "function" == typeof e ? n = e.bind(this) : (e = this._touchExpr(a(e)), n = e.get, r = e.once);
						var p = {
							id: _,
							get: n,
							fn: t,
							once: r,
							force: i.force,
							diff: i.diff,
							test: o,
							deep: i.deep,
							last: i.sync ? n(this) : i.last
						};
						if (this._watchers.push(p), c = this._records && this._records.length, c && this._records[c - 1].push(_), i.init === !0) {
							var m = this.$phase;
							this.$phase = "digest", this._checkSingleWatch(p, this._watchers.length - 1), this.$phase = m
						}
						return p
					},
					$unwatch: function (e) {
						if (e = e.uid || e, this._watchers || (this._watchers = []), Array.isArray(e))
							for (var t = 0, i = e.length; i > t; t++) this.$unwatch(e[t]);
						else {
							var n, s, a = this._watchers;
							if (!e || !a || !(s = a.length)) return;
							for (; s--;) n = a[s], n && n.id === e && a.splice(s, 1)
						}
					},
					$expression: function (e) {
						return this._touchExpr(a(e))
					},
					$digest: function () {
						if ("digest" !== this.$phase && !this._mute) {
							this.$phase = "digest";
							for (var e = !1, t = 0; e = this._digest();)
								if (++t > 20) throw Error("there may a circular dependencies reaches");
							t > 0 && this.$emit && this.$emit("$update"), this.$phase = null
						}
					},
					_digest: function () {
						var e, t, i, n = this._watchers,
							s = !1;
						if (n && n.length)
							for (var a = 0, r = n.length; r > a; a++) t = n[a], i = this._checkSingleWatch(t, a), i && (s = !0);
						if (e = this._children, e && e.length)
							for (var o = 0, c = e.length; c > o; o++) {
								var d = e[o];
								d && d._digest() && (s = !0)
							}
						return s
					},
					_checkSingleWatch: function (e, t) {
						var i = !1;
						if (e) {
							var n, a, r, d, _, l;
							if (e.test) {
								var u = e.test(this);
								u && (i = !0, e.fn.apply(this, u))
							} else n = e.get(this), a = e.last, r = s.typeOf(a), d = s.typeOf(n), _ = !0, l, "object" === d && "object" === r && e.deep ? (l = c(n, a, e.diff), (l === !0 || l.length) && (i = !0)) : "array" !== d || "undefined" != r && "array" !== r ? (_ = s.equals(n, a), (!_ || e.force) && (e.force = null, i = !0)) : (l = o(n, e.last || [], e.diff), ("array" !== r || l === !0 || l.length) && (i = !0));
							return i && !e.test && (e.last = "object" === d && e.deep || "array" === d ? s.clone(n) : n, e.fn.call(this, n, a, l), e.once && this._watchers.splice(t, 1)), i
						}
					},
					$set: function (e, t) {
						if (null != e) {
							var i = s.typeOf(e);
							if ("string" === i || "expression" === e.type) e = this.$expression(e), e.set(this, t);
							else if ("function" === i) e.call(this, this.data);
							else
								for (var n in e) this.$set(n, e[n])
						}
					},
					$get: function (e, t) {
						return t && "string" == typeof e ? e : this.$expression(e).get(this)
					},
					$update: function () {
						var e = this;
						do {
							if (e.data.isolate || !e.$parent) break;
							e = e.$parent
						} while (e);
						var t = e.$phase;
						return e.$phase = "digest", this.$set.apply(this, arguments), e.$phase = t, e.$digest(), this
					},
					_record: function () {
						this._records || (this._records = []), this._records.push([])
					},
					_release: function () {
						return this._records.pop()
					}
				};
			s.extend(n.prototype, d), n.mixTo = function (e) {
				return e = "function" == typeof e ? e.prototype : e, s.extend(e, d)
			}, e.exports = n
		},
		function (e, t, i) {
			var n = i(1).exprCache,
				s = (i(5), i(12));
			e.exports = {
				expression: function (e) {
					return "string" == typeof e && (e = e.trim()) && (e = n.get(e) || n.set(e, new s(e, {
						mode: 2,
						expression: !0
					}).expression())), e ? e : void 0
				},
				parse: function (e) {
					return new s(e).parse()
				}
			}
		},
		function (e) {
			var t = e.exports = {};
			t.json = {
				get: function (e) {
					return "undefined" != typeof JSON ? JSON.stringify(e) : e
				},
				set: function (e) {
					return "undefined" != typeof JSON ? JSON.parse(e) : e
				}
			}, t.last = function (e) {
				return e && e[e.length - 1]
			}, t.average = function (e, i) {
				return e = e || [], e.length ? t.total(e, i) / e.length : 0
			}, t.total = function (e, t) {
				var i = 0;
				if (e) return e.forEach(function (e) {
					i += t ? e[t] : e
				}), i
			}
		},
		function (e) {
			function t(e, t) {
				for (var i in t) void 0 === e[i] && (e[i] = t[i]);
				return t
			}
			var i = [].slice,
				n = {}.toString;
			e.exports = function () {
				t(String.prototype, {
					trim: function () {
						return this.replace(/^\s+|\s+$/g, "")
					}
				}), t(Array.prototype, {
					indexOf: function (e, t) {
						t = t || 0;
						for (var i = t, n = this.length; n > i; i++)
							if (this[i] === e) return i;
						return -1
					},
					forEach: function (e, t) {
						var i = 0,
							n = Object(this),
							s = n.length >>> 0;
						if ("function" != typeof e) throw new TypeError(e + " is not a function");
						for (; s > i;) {
							var a;
							i in n && (a = n[i], e.call(t, a, i, n)), i++
						}
					},
					filter: function (e, t) {
						var i = Object(this),
							n = i.length >>> 0;
						if ("function" != typeof e) throw new TypeError;
						for (var s = [], a = 0; n > a; a++)
							if (a in i) {
								var r = i[a];
								e.call(t, r, a, i) && s.push(r)
							}
						return s
					}
				}), t(Function.prototype, {
					bind: function (e) {
						var t = this,
							n = i.call(arguments, 1);
						return function () {
							var s = n.concat(i.call(arguments));
							return t.apply(e, s)
						}
					}
				}), t(Array, {
					isArray: function (e) {
						return "[object Array]" === n.call(e)
					}
				})
			}
		},
		function (e) {
			var t = {
				quot: 34,
				amp: 38,
				apos: 39,
				lt: 60,
				gt: 62,
				nbsp: 160,
				iexcl: 161,
				cent: 162,
				pound: 163,
				curren: 164,
				yen: 165,
				brvbar: 166,
				sect: 167,
				uml: 168,
				copy: 169,
				ordf: 170,
				laquo: 171,
				not: 172,
				shy: 173,
				reg: 174,
				macr: 175,
				deg: 176,
				plusmn: 177,
				sup2: 178,
				sup3: 179,
				acute: 180,
				micro: 181,
				para: 182,
				middot: 183,
				cedil: 184,
				sup1: 185,
				ordm: 186,
				raquo: 187,
				frac14: 188,
				frac12: 189,
				frac34: 190,
				iquest: 191,
				Agrave: 192,
				Aacute: 193,
				Acirc: 194,
				Atilde: 195,
				Auml: 196,
				Aring: 197,
				AElig: 198,
				Ccedil: 199,
				Egrave: 200,
				Eacute: 201,
				Ecirc: 202,
				Euml: 203,
				Igrave: 204,
				Iacute: 205,
				Icirc: 206,
				Iuml: 207,
				ETH: 208,
				Ntilde: 209,
				Ograve: 210,
				Oacute: 211,
				Ocirc: 212,
				Otilde: 213,
				Ouml: 214,
				times: 215,
				Oslash: 216,
				Ugrave: 217,
				Uacute: 218,
				Ucirc: 219,
				Uuml: 220,
				Yacute: 221,
				THORN: 222,
				szlig: 223,
				agrave: 224,
				aacute: 225,
				acirc: 226,
				atilde: 227,
				auml: 228,
				aring: 229,
				aelig: 230,
				ccedil: 231,
				egrave: 232,
				eacute: 233,
				ecirc: 234,
				euml: 235,
				igrave: 236,
				iacute: 237,
				icirc: 238,
				iuml: 239,
				eth: 240,
				ntilde: 241,
				ograve: 242,
				oacute: 243,
				ocirc: 244,
				otilde: 245,
				ouml: 246,
				divide: 247,
				oslash: 248,
				ugrave: 249,
				uacute: 250,
				ucirc: 251,
				uuml: 252,
				yacute: 253,
				thorn: 254,
				yuml: 255,
				fnof: 402,
				Alpha: 913,
				Beta: 914,
				Gamma: 915,
				Delta: 916,
				Epsilon: 917,
				Zeta: 918,
				Eta: 919,
				Theta: 920,
				Iota: 921,
				Kappa: 922,
				Lambda: 923,
				Mu: 924,
				Nu: 925,
				Xi: 926,
				Omicron: 927,
				Pi: 928,
				Rho: 929,
				Sigma: 931,
				Tau: 932,
				Upsilon: 933,
				Phi: 934,
				Chi: 935,
				Psi: 936,
				Omega: 937,
				alpha: 945,
				beta: 946,
				gamma: 947,
				delta: 948,
				epsilon: 949,
				zeta: 950,
				eta: 951,
				theta: 952,
				iota: 953,
				kappa: 954,
				lambda: 955,
				mu: 956,
				nu: 957,
				xi: 958,
				omicron: 959,
				pi: 960,
				rho: 961,
				sigmaf: 962,
				sigma: 963,
				tau: 964,
				upsilon: 965,
				phi: 966,
				chi: 967,
				psi: 968,
				omega: 969,
				thetasym: 977,
				upsih: 978,
				piv: 982,
				bull: 8226,
				hellip: 8230,
				prime: 8242,
				Prime: 8243,
				oline: 8254,
				frasl: 8260,
				weierp: 8472,
				image: 8465,
				real: 8476,
				trade: 8482,
				alefsym: 8501,
				larr: 8592,
				uarr: 8593,
				rarr: 8594,
				darr: 8595,
				harr: 8596,
				crarr: 8629,
				lArr: 8656,
				uArr: 8657,
				rArr: 8658,
				dArr: 8659,
				hArr: 8660,
				forall: 8704,
				part: 8706,
				exist: 8707,
				empty: 8709,
				nabla: 8711,
				isin: 8712,
				notin: 8713,
				ni: 8715,
				prod: 8719,
				sum: 8721,
				minus: 8722,
				lowast: 8727,
				radic: 8730,
				prop: 8733,
				infin: 8734,
				ang: 8736,
				and: 8743,
				or: 8744,
				cap: 8745,
				cup: 8746,
				"int": 8747,
				there4: 8756,
				sim: 8764,
				cong: 8773,
				asymp: 8776,
				ne: 8800,
				equiv: 8801,
				le: 8804,
				ge: 8805,
				sub: 8834,
				sup: 8835,
				nsub: 8836,
				sube: 8838,
				supe: 8839,
				oplus: 8853,
				otimes: 8855,
				perp: 8869,
				sdot: 8901,
				lceil: 8968,
				rceil: 8969,
				lfloor: 8970,
				rfloor: 8971,
				lang: 9001,
				rang: 9002,
				loz: 9674,
				spades: 9824,
				clubs: 9827,
				hearts: 9829,
				diams: 9830,
				OElig: 338,
				oelig: 339,
				Scaron: 352,
				scaron: 353,
				Yuml: 376,
				circ: 710,
				tilde: 732,
				ensp: 8194,
				emsp: 8195,
				thinsp: 8201,
				zwnj: 8204,
				zwj: 8205,
				lrm: 8206,
				rlm: 8207,
				ndash: 8211,
				mdash: 8212,
				lsquo: 8216,
				rsquo: 8217,
				sbquo: 8218,
				ldquo: 8220,
				rdquo: 8221,
				bdquo: 8222,
				dagger: 8224,
				Dagger: 8225,
				permil: 8240,
				lsaquo: 8249,
				rsaquo: 8250,
				euro: 8364
			};
			e.exports = t
		},
		function (e, t, i) {
			function n(e) {
				var t, i = 0,
					n = 0,
					a = 0,
					r = 0,
					o = 0,
					c = 5 / 3;
				return window.getComputedStyle && (t = window.getComputedStyle(e), n = s(t[l + "Duration"]) || n, a = s(t[l + "Delay"]) || a, r = s(t[u + "Duration"]) || r, o = s(t[u + "Delay"]) || o, i = Math.max(n + a, r + o)), 1e3 * i * c
			}

			function s(e) {
				var t, i = 0;
				return e ? (e.split(",").forEach(function (e) {
					t = parseFloat(e), t > i && (i = t)
				}), i) : 0
			}
			var a = i(5),
				r = i(4),
				o = {}, c = i(1),
				d = "transitionend",
				_ = "animationend",
				l = "transition",
				u = "animation";
			"ontransitionend" in window || ("onwebkittransitionend" in window ? (d += " webkitTransitionEnd", l = "webkitTransition") : ("onotransitionend" in r.tNode || "Opera" === navigator.appName) && (d += " oTransitionEnd", l = "oTransition")), "onanimationend" in window || ("onwebkitanimationend" in window ? (_ += " webkitAnimationEnd", u = "webkitAnimation") : "onoanimationend" in r.tNode && (_ += " oAnimationEnd", u = "oAnimation")), o.inject = function (e, t, i, n) {
				if (n = n || a.noop, Array.isArray(e)) {
					for (var s = r.fragment(), o = 0, c = 0, d = e.length; d > c; c++) s.appendChild(e[c]);
					r.inject(s, t, i);
					var _ = function () {
						o++, o === d && n()
					};
					for (d === o && n(), c = 0; d > c; c++) e[c].onenter ? e[c].onenter(_) : _()
				} else r.inject(e, t, i), e.onenter ? e.onenter(n) : n()
			}, o.remove = function (e, t) {
				function i() {
					n++, n === a && t && t()
				}
				if (e) {
					var n = 0;
					if (Array.isArray(e)) {
						for (var s = 0, a = e.length; a > s; s++) o.remove(e[s], i);
						return e
					}
					e.onleave ? e.onleave(function () {
						f(e, t)
					}) : f(e, t)
				}
			};
			var f = function (e, t) {
				r.remove(e), t && t()
			};
			o.startClassAnimate = function (e, t, i, s) {
				var o, l, u, f;
				return !_ && !d || c.isRunning ? i() : (f = a.once(4 !== s ? function () {
					u && clearTimeout(u), 2 === s && r.delClass(e, o), 3 !== s && r.delClass(e, t), r.off(e, _, f), r.off(e, d, f), i()
				} : function () {
					u && clearTimeout(u), i()
				}), 2 === s ? (r.addClass(e, t), o = a.map(t.split(/\s+/), function (e) {
					return e + "-active"
				}).join(" "), r.nextReflow(function () {
					r.addClass(e, o), l = n(e), u = setTimeout(f, l)
				})) : r.nextReflow(4 === s ? function () {
					r.delClass(e, t), l = n(e), u = setTimeout(f, l)
				} : function () {
					r.addClass(e, t), l = n(e), u = setTimeout(f, l)
				}), r.on(e, _, f), r.on(e, d, f), f)
			}, o.startStyleAnimate = function (e, t, i) {
				var s, o, c;
				return r.nextReflow(function () {
					r.css(e, t), s = n(e), c = setTimeout(o, s)
				}), o = a.once(function () {
					c && clearTimeout(c), r.off(e, _, o), r.off(e, d, o), i()
				}), r.on(e, _, o), r.on(e, d, o), o
			}, e.exports = o
		},
		function (e) {
			e.exports = {
				COMPONENT_TYPE: 1,
				ELEMENT_TYPE: 2
			}
		},
		function (e, t, i) {
			function n(e, t, i) {
				if (i)
					for (var n, s = e.target; s && s !== i;) {
						for (var a = 0, r = t.length; r > a; a++) n = t[a], n && n.element === s && n.fire(e);
						s = s.parentNode
					}
			}
			var s = i(5),
				a = i(4),
				r = i(3);
			r._addProtoInheritCache("event"), r.directive(/^on-\w+$/, function (e, t, i, n) {
				if (i && t) {
					var s = i.split("-")[1];
					return this._handleEvent(e, s, t, n)
				}
			}), r.directive(/^(delegate|de)-\w+$/, function (e, t, i) {
				function r(e) {
					n(e, c[d], o.parentNode)
				}
				var o = this.$root,
					c = o._delegates || (o._delegates = {});
				if (i && t) {
					var d = i.split("-")[1],
						_ = s.handleEvent.call(this, t, d);
					c[d] || (c[d] = [], o.parentNode ? a.on(o.parentNode, d, r) : o.$on("$inject", function (e, t, i) {
						var n = this.parentNode;
						i && a.off(i, d, r), n && a.on(this.parentNode, d, r)
					}), o.$on("$destroy", function () {
						o.parentNode && a.off(o.parentNode, d, r), c[d] = null
					}));
					var l = {
						element: e,
						fire: _
					};
					return c[d].push(l),
						function () {
							var e = c[d];
							if (e && e.length)
								for (var t = 0, i = e.length; i > t; t++) e[t] === l && e.splice(t, 1)
						}
				}
			})
		},
		function (e, t, i) {
			function n(e, t) {
				function i() {
					t.set(n, this.value), s.last = this.value, n.$update()
				}
				var n = this,
					s = this.$watch(t, function (t) {
						var i = o.slice(e.getElementsByTagName("option"));
						i.forEach(function (i, n) {
							i.value == t && (e.selectedIndex = n)
						})
					});
				return c.on(e, "change", i), void 0 === t.get(n) && e.value && t.set(n, e.value),
					function () {
						c.off(e, "change", i);
					}
			}

			function s(e, t) {
				var i = this,
					n = this.$watch(t, function (t) {
						e.value !== t && (e.value = null == t ? "" : "" + t)
					}),
					s = function (e) {
						var s = this;
						if ("cut" === e.type || "paste" === e.type) o.nextTick(function () {
							var e = s.value;
							t.set(i, e), n.last = e, i.$update()
						});
						else {
							var a = s.value;
							t.set(i, a), n.last = a, i.$update()
						}
					};
				return 9 !== c.msie && "oninput" in c.tNode ? e.addEventListener("input", s) : (c.on(e, "paste", s), c.on(e, "keyup", s), c.on(e, "cut", s), c.on(e, "change", s)), void 0 === t.get(i) && e.value && t.set(i, e.value),
					function () {
						9 !== c.msie && "oninput" in c.tNode ? e.removeEventListener("input", s) : (c.off(e, "paste", s), c.off(e, "keyup", s), c.off(e, "cut", s), c.off(e, "change", s))
					}
			}

			function a(e, t) {
				var i = this,
					n = this.$watch(t, function (t) {
						c.attr(e, "checked", !!t)
					}),
					s = function () {
						var e = this.checked;
						t.set(i, e), n.last = e, i.$update()
					};
				return t.set && c.on(e, "change", s), void 0 === t.get(i) && t.set(i, !!e.checked),
					function () {
						t.set && c.off(e, "change", s)
					}
			}

			function r(e, t) {
				var i = this,
					n = (this.$watch(t, function (t) {
						e.checked = t == e.value ? !0 : !1
					}), function () {
						var e = this.value;
						t.set(i, e), i.$update()
					});
				return t.set && c.on(e, "change", n), void 0 === t.get(i) && e.checked && t.set(i, e.value),
					function () {
						t.set && c.off(e, "change", n)
					}
			}
			var o = i(5),
				c = i(4),
				d = i(3),
				_ = {
					text: s,
					select: n,
					checkbox: a,
					radio: r
				};
			d.directive("r-model", function (e, t) {
				var i = e.tagName.toLowerCase(),
					n = i;
				return "input" === n ? n = e.type || "text" : "textarea" === n && (n = "text"), "string" == typeof t && (t = this.$expression(t)), _[n] ? _[n].call(this, e, t) : "input" === i ? _.text.call(this, e, t) : void 0
			})
		},
		function (e, t, i) {
			function n(e, t) {
				var i = e.length,
					n = t.length;
				if (i !== n) return !0;
				for (var s = 0; i > s; s++)
					if (e[s] !== t[s]) return !0;
				return !1
			}

			function s(e, t) {
				return e === t
			}

			function a(e, t, i) {
				for (var n = e.length, a = t.length, i = i || s, r = [], o = 0; n >= o; o++) r.push([o]);
				for (var c = 1; a >= c; c++) r[0][c] = c;
				for (var o = 1; n >= o; o++)
					for (var c = 1; a >= c; c++) r[o][c] = i(e[o - 1], t[c - 1]) ? r[o - 1][c - 1] : Math.min(r[o - 1][c] + 1, r[o][c - 1] + 1);
				return r
			}

			function r(e, t, i, s) {
				if (!i) return n(e, t);
				for (var r = a(t, e, s), o = t.length, c = o, d = e.length, _ = d, l = [], u = r[c][_]; c > 0 || _ > 0;)
					if (0 !== c)
						if (0 !== _) {
							var f = r[c - 1][_ - 1],
								h = r[c - 1][_],
								p = r[c][_ - 1],
								m = Math.min(p, h, f);
							m === h ? (l.unshift(2), c--, u = h) : m === f ? (f === u ? l.unshift(0) : (l.unshift(1), u = f), c--, _--) : (l.unshift(3), _--, u = p)
						} else l.unshift(2), c--;
					else l.unshift(3), _--;
				var g = 0,
					b = 3,
					v = 2,
					$ = 1,
					o = 0;
				d = 0;
				for (var y = [], C = {
					index: null,
					add: 0,
					removed: []
				}, c = 0; c < l.length; c++) switch (l[c] > 0 ? null === C.index && (C.index = d) : null != C.index && (y.push(C), C = {
					index: null,
					add: 0,
					removed: []
				}), l[c]) {
						case g:
							o++, d++;
							break;
						case b:
							C.add++, d++;
							break;
						case v:
							C.removed.push(t[o]), o++;
							break;
						case $:
							C.add++, C.removed.push(t[o]), o++, d++
					}
				return null != C.index && y.push(C), y
			}

			function o(e, t, i) {
				if (i) {
					var n = c.keys(e),
						s = c.keys(t);
					return r(n, s, i, function (i, n) {
						return e[n] === t[i]
					})
				}
				for (var a in e)
					if (t[a] !== e[a]) return !0;
				for (var o in t)
					if (t[o] !== e[o]) return !0;
				return !1
			}
			var c = i(5);
			e.exports = {
				diffArray: r,
				diffObject: o
			}
		},
		function (e) {
			e.exports = {
				element: function (e, t, i) {
					return {
						type: "element",
						tag: e,
						attrs: t,
						children: i
					}
				},
				attribute: function (e, t, i) {
					return {
						type: "attribute",
						name: e,
						value: t,
						mdf: i
					}
				},
				"if": function (e, t, i) {
					return {
						type: "if",
						test: e,
						consequent: t,
						alternate: i
					}
				},
				list: function (e, t, i, n, s) {
					return {
						type: "list",
						sequence: e,
						alternate: n,
						variable: t,
						body: i,
						track: s
					}
				},
				expression: function (e, t, i) {
					return {
						type: "expression",
						body: e,
						constant: i || !1,
						setbody: t || !1
					}
				},
				text: function (e) {
					return {
						type: "text",
						text: e
					}
				},
				template: function (e) {
					return {
						type: "template",
						content: e
					}
				}
			}
		}
	])
});
I$("f1fc556eafb5676910602a7f1fa3af8e", function (e, t, i, n, s, a, r, o, c, d, _, l, u) {
	var f, h, p;
	var m = function (e, t) {
		t.data["MGID"] = window.mgid;
		t.data["URS-CM"] = 1;
		r._$postMessage(e, t)
	};
	var g = function () {
		var e = document.body.scrollWidth,
			t = document.body.clientHeight,
			i = {
				width: e,
				height: t,
				type: "resize"
			};
		if (e * t > 0) m("_parent", {
			data: i
		})
	};
	var b = Regular.extend({
		data: {},
		config: function (e) {
			i._$merge(this.data, e || {});
			this.supr(e);
			if (this.data.productKey) this.data.productkey = this.data.productKey
		},
		init: function (e) {
			this.supr(e)
		},
		_findErrorIndex: function () {
			var e = 100;
			i._$forIn(this.errorIndexMap, function (t) {
				if (t <= e && t >= 0) e = t
			}._$bind(this));
			this.errorIndex = e
		},
		_addIframeNoPathBAndOpd: function (e, t) {
			if ("https:" == location.protocol) t = t.replace("http:", "https:");
			t = r._$tryAddChromeHack(t);
			t = r._$tryAddSm(t).realurl;
			n._$createXFrame({
				src: t,
				parent: document.body,
				visible: !1,
				onload: function () {
					this.__iframeIndex++;
					if (this.__ifarmeSize == this.__iframeIndex) {
						this.__iframeCt = clearTimeout(this.__iframeCt);
						this._$sendMsg(e)
					}
				}._$bind(this)
			})
		},
		_addIframe: function (e, t) {
			if ("https:" == location.protocol) t = t.replace("http:", "https:");
			t = r._$addPathB(t);
			if (window._$URSOPT.opd) t = t + (t.indexOf("?") >= 0 ? "&" : "?") + "opd=" + window._$URSOPT.opd;
			if (window._$URSOPT.opkid) t = t + (t.indexOf("?") >= 0 ? "&" : "?") + "opkid=" + window._$URSOPT.opkid;
			this._addIframeNoPathBAndOpd(e, t)
		},
		_$sendMsg: function (e) {
			if ("reg" == this.data.module) this.doUnlockReg && this.doUnlockReg();
			if ("login" == this.data.module) this.doUnlockLogin && this.doUnlockLogin();
			if ("uniteLogin" == this.data.module) this.doUniteLoginUnLock && this.doUniteLoginUnLock();
			if (window.$outLoginKey && "success" == e.type) e.fromOutLogin = 1;
			m("_parent", {
				data: e
			})
		},
		_$setDomains: function (e) {
			var t = e || {};
			this.__iframeIndex = 0;
			var i = t.nextUrls || [];
			this.__ifarmeSize = i.length || 0;
			if (this.__ifarmeSize > 0) this.__iframeCt = setTimeout(function () {
				this._$sendMsg(t)
			}._$bind(this), 5e3);
			else this._$sendMsg(t);
			return {
				list: i,
				data: t
			}
		},
		_$setDomainsHasPathBAndOpd: function (e) {
			var t = this._$setDomains(e);
			i._$forEach(t.list, this._addIframe._$bind(this, t.data))
		},
		_$setDomainsNoPathBAndOpd: function (e) {
			var t = this._$setDomains(e);
			i._$forEach(t.list, this._addIframeNoPathBAndOpd._$bind(this, t.data))
		},
		_$doShowError: function (e) {
			var t = e.type || "",
				i = e.target,
				s = n._$get(e.node),
				o = e.str || (1 == window._$URSOPT.enlang ? c.showText("请求错误", 1) : "请求错误"),
				d = n._$get("cnt-box-parent"),
				_ = e.tabIndex;
			if (!r._$isHttpCode()) {
				if (o == window._$capTxt1 || o == window._$capTxt2) {
					if (!window.initNECaptcha) {
						r._$showFail("-105");
						return
					}
					if ("popup" == window._$URSOPT.mode) return
				}
				if (1 != window._$needCookieSet || o.indexOf("开启浏览器cookies") != -1) {
					if (o.indexOf("点此进行安全登录") > -1) _ = 99;
					var l = i && r._$getParent(i, "inputbox");
					this.errorIndexMap[_] = _;
					if (s && (this.errorIndex == -1 || _ <= this.errorIndex)) {
						this.errorIndex = _;
						s.innerHTML = a._$get("error-tmp", {
							str: o || "",
							type: t
						});
						s.className = "m-nerror";
						if (l) n._$addClassName(l, "error-color")
					} else if (l) n._$delClassName(l, "error-color");
					n._$addClassName(d, "haserr");
					g()
				}
			}
		},
		_$removeError: function (e) {
			var t = n._$get("cnt-box-parent"),
				i = e.target,
				s = i && r._$getParent(i, "inputbox"),
				a = n._$get(e.node),
				o = e.tabIndex;
			if (!window._$needCookieSet) {
				if (1e3 === o || this.errorIndex == o || this.errorIndex == -1) {
					n._$addClassName(a, "f-dn");
					if (s) n._$delClassName(s, "error-color")
				}
				delete this.errorIndexMap[o];
				this._findErrorIndex();
				n._$delClassName(t, "haserr");
				g()
			}
		},
		_$resize: function () {
			g()
		},
		_$postMessage: function (e) {
			m("_parent", {
				data: e
			})
		},
		destroyNewCap: function () {
			this.__needPopup = 1;
			this.data.hasSlide = 0;
			this.data.hasImgCap = 0;
			this.$refs.slidecap && this.$refs.slidecap._$destroyNewCap();
			if (this.$refs.slidecap) this.$refs.slidecap.destroy();
			this.$refs.slidecap = null;
			delete this.$refs.slidecap;
			this.$update()
		},
		_$clearAllAjax: function () {
			o._$clearTimeoutAndAjax()
		},
		tryShowUpQr: function (i) {
			if (r._$isVersionFour() && e._$is("desktop")) try {
				f = n._$getByClassName(document.body, "j-icon")[0];
				if (f && n._$hasClassName(f, "ferrortail2")) {
					var s = i[0],
						o = i[1],
						d = this.data.saveBtnTxt.replace(/ /g, "");
					n._$addClassName(f, "ferrortail2-up");
					a._$render(f, "upqrcode-tmp", {
						scanTxt: 1 == window._$URSOPT.enlang ? c.showText("扫码快速发送", 1) : "扫码快速发送"
					});
					p = n._$getByClassName(document.body, "up-qrcode")[0];
					if (void 0 === this.data.upqrcodeanim) this.data.upqrcodeanim = "up-qrcode-anim";
					n._$addClassName(p, this.data.upqrcodeanim);
					this.data.upqrcodeanim = "";
					h = n._$getByClassName(document.body, "up-qrcode-inner")[0];
					r._$createQRcode({
						node: h,
						smstxt: s,
						smscode: o,
						btntxt: d
					});
					t._$addEvent(f, "click", this.toggleQr._$bind(this));
					if (this.data.upqrhidden) n._$addClassName(p, "f-dn");
					this.$update()
				}
			} catch (_) {
				if (p) n._$addClassName(p, "f-dn")
			}
		},
		toggleQr: function (e) {
			t._$stop(e);
			var i = t._$getElement(e),
				s = r._$getParent(i, "up-qrcode");
			if (n._$hasClassName(i, "up-qrcode-close") || !n._$hasClassName(i, "up-qrcode") && !n._$hasClassName(s, "up-qrcode")) {
				if (n._$hasClassName(p, "f-dn")) {
					this.data.upqrhidden = 0;
					n._$delClassName(p, "f-dn")
				} else {
					this.data.upqrhidden = 1;
					n._$addClassName(p, "f-dn");
					n._$delClassName(p, "up-qrcode-anim")
				}
				this.$update()
			}
		},
		tryShowH5Up: function () {
			if (r._$isH5FourVersion()) {
				this.data.ish5upsms = 1;
				this.data.canshownext = 0
			} else {
				this.data.ish5upsms = 0;
				this.data.canshownext = 1
			}
			this.$update();
			setTimeout(r._$resize, 10)
		}
	});
	return b
}, "a878c0216188111f46d39b9df767b354", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a13cd829d734e255809c920485d5a6b2", "bff3d86ec4ea91399919ee4963badfeb", "a4de926c2d79e8d8f856eaff4dac0f8b", "53c267efd983fb8c66cb645beead7a8d", "46a4de3a50f50a600950ca9cee88031e");
I$("41ef7aa93d23fe74cbf747774554e6ce", function (e, t, i, n, s, a, r, o, c, d, _, l, u) {
	var f = 200,
		h = 100;
	var p = o.extend({
		getPwd: function () {
			return this.__saveValidate || ""
		},
		getCt: function () {
			return this.data.captchaType || ""
		},
		_$getCapState: function () {
			return this.__capState
		},
		destroy: function () {
			this.__beforeDestroy();
			this.sto = clearTimeout(this.sto);
			this.supr()
		},
		init: function (e) {
			this.supr(e);
			this.enlang = window._$URSOPT.enlang;
			this.__clearNecapstl();
			this.data.lang = this.data.lang || "zh-CN";
			this.data.mode = this.data.mode || "float";
			this.data.width = this.data.width || "320px";
			this.doInitCallback = this.data.initCallback || l;
			this.doCapErr = this.data.initErrorHandler || l;
			this.doVerify = this.data.verifyCallback || l;
			this.doAutoVerify = this.data.doAutoVerify || l;
			this.doLockVerify = this.data.doLockVerify || l;
			this.onClose = this.data.onClose || l;
			this.__capState = 1;
			this.showCap();
			if (this.data.capBox) {
				this.__capBox = this.data.capBox;
				setTimeout(function () {
					t._$delEvent(this.__capBox, "mouseout", this.__slidebarout._$bind(this));
					t._$delEvent(this.__capBox, "mouseover", this.__slidebarover._$bind(this));
					t._$addEvent(this.__capBox, "mouseout", this.__slidebarout._$bind(this));
					t._$addEvent(this.__capBox, "mouseover", this.__slidebarover._$bind(this))
				}._$bind(this), 300)
			}
		},
		__slidebarout: function () {
			if (this.__sdov) this.__sdov = clearTimeout(this.__sdov);
			this.__sdot = setTimeout(function () {
				this.__capBox.style.zIndex = "20"
			}._$bind(this), 100)
		},
		__slidebarover: function () {
			if (this.__sdot) this.__sdot = clearTimeout(this.__sdot);
			this.__sdov = setTimeout(function () {
				this.__capBox.style.zIndex = "501"
			}._$bind(this), 100)
		},
		doClose: function () {
			if (this.__close) t._$delEvent(this.__close, "click", this.doClose._$bind(this));
			if (this.__layer) {
				this.__layer.style.display = "none";
				n._$remove(this.__layer)
			}
		},
		doPopUp: function () {
			var e = function () {
				this.data.capBarHeight = parseInt(this.data.capBarHeight || 40);
				this.data.capPadding = parseInt(this.data.capPadding || 10);
				this.__layer = n._$create("div", "cap-box", document.body);
				n._$create("iframe", "cap-box-mask", this.__layer);
				n._$create("div", "cap-box-mask", this.__layer);
				this.__innerBox = n._$create("div", "cap-box-inner", this.__layer);
				var e = n._$create("div", "cap-bar", this.__innerBox);
				e.style.height = this.data.capBarHeight + "px";
				e.style.lineHeight = this.data.capBarHeight + "px";
				var t = n._$create("div", "cap-title", e);
				t.style.paddingLeft = this.data.capPadding + "px";
				this.__close = n._$create("div", "cap-close", e);
				t.innerHTML = c.showText("请完成安全验证", this.enlang);
				this.__close.innerHTML = "&nbsp;";
				this.__close.style.top = parseInt(this.data.capBarHeight / 2) - parseInt(this.__close.offsetHeight / 2) + "px";
				this.__close.style.display = "block";
				this.__cnt = n._$create("div", "cap-cnt", this.__innerBox);
				this.__cnt.style.padding = this.data.capPadding + "px";
				this.__cnt.style.paddingTop = "0px";
				this.__layer.style.visibility = "hidden";
				return this.__cnt
			};
			return function (t) {
				t.element = e.call(this);
				t.mode = "embed";
				if (!window.initNECaptcha) r._$showFail("-105");
				this.__initNECaptcha(t, "popup")
			}
		}(),
		__getExtraData: function () {
			var e = n._$get("mobile-itl-div"),
				t = n._$getByClassName(document, "j-nameforslide")[0],
				i, s, a = n._$getByClassName(document, "j-prdomain")[0];
			s = t ? t.value : "";
			if (e) {
				i = n._$dataset(e, "code") || "";
				s = i + s
			}
			if (a && a.innerText && s) {
				var o = r._$formatUn(s.trim());
				s = o + a.innerText
			}
			return s.trim()
		},
		parseCapConf: function () {
			var e = r._$isIPV6();
			var t = "conf0";
			var i = "conf0";
			var n = window._$URSCDNCF;
			if (n) {
				if (n.capConfV6 || n.capConf) t = e ? n.capConfV6 : n.capConf;
				if (n.watchManConfV6 || n.watchManConf) i = e ? n.watchManConfV6 : n.watchManConf
			}
			var s = {
				configServer: "webzjac.reg.163.com",
				apiServer: "webzjac.reg.163.com",
				staticServer: "acstatic-dun.126.net"
			};
			var a = {
				staticServer: "acstatic.dun.163yun.com"
			};
			var o = ["webzjcaptcha.reg.163.com", "c.dun.163yun.com"];
			var c = ["c.dun.163yun.com", "webzjcaptcha.reg.163.com"];
			var d = ["cstaticdun.126.net"];
			var _ = ["cstaticdun1.126.net"];
			if (e) {
				s = {
					configServer: "webzjac-v6.reg.163.com",
					apiServer: "webzjac-v6.reg.163.com",
					staticServer: "acstatic-dun-v6.126.net"
				};
				o = ["webzjcaptcha-v6.reg.163.com", "c-v6.dun.163yun.com"];
				c = ["c-v6.dun.163yun.com", "webzjcaptcha-v6.reg.163.com"];
				d = ["cstaticdun-v6.126.net"]
			}
			var l = "conf0" === i;
			var u = "conf0" === t;
			return {
				wmServerConfig: l ? s : a,
				apiServer: u ? o : c,
				staticServer: u ? d : _
			}
		},
		getAiPopStyle: function (e) {
			var t = document.body.clientWidth;
			var i = window._$URSOPT.aiCapWidth || Math.floor(.8 * t);
			i = i >= 350 || i <= 0 ? 350 : i;
			e.popupStyles = {
				capBarHeight: window._$URSOPT.aiCapBarHeight || 40,
				capPadding: window._$URSOPT.aiCapPadding || 10,
				width: i,
				top: "auto"
			};
			if (void 0 !== window._$URSOPT.aiCapOpacity) e.popupStyles.opacity = window._$URSOPT.aiCapOpacity;
			return e
		},
		readyCallback: function (e) {
			this.__instance = e;
			r._$hideFailForCap();
			this.doInitCallback();
			if (this.data.autoVerify && 6 === this.data.capFlag) this.doAutoVerify()
		},
		onVerify: function (e, t) {
			if (e) {
				this.__capState = 1;
				if ("popup" != this.data.mode && 6 != this.data.capFlag) this.doVerify({
					validate: !1
				});
				try {
					var i;
					if (this.data.capFlag) i = this.data.capFlag;
					else if (this.data.captchaType) i = this.data.captchaType + 2;
					var n = "https://pr.nss.netease.com/sentry/passive?uapi=webzjzw&dataTime=100000&clusterName=urs-webzj-static-passive&modelName=webzj_response_webzc&one=1&url=caperror&capType=" + i + "&isLogin=" + (this.data.isLogin ? "1" : "0");
					r._$sendLog(n)
				} catch (s) { }
			} else {
				this.__capState = 0;
				if ("popup" == this.data.mode && 6 != this.data.capFlag) this.__close.style.display = "none";
				t.captchaType = this.data.captchaType;
				this.__saveValidate = t.validate;
				this.doVerify(t)
			}
		},
		_$doVerify: function (e) {
			e = e || 0;
			if (this.sto) clearTimeout(this.sto);
			if (this.__instance) {
				this.doLockVerify();
				this.__instance.verify()
			} else this.sto = setTimeout(function () {
				e++;
				if (e >= 50) {
					clearTimeout(this.sto);
					r._$showError(0, c.showText("系统繁忙，请刷新重试", this.enlang), "nerror")
				}
				this._$doVerify(e)
			}._$bind(this), 200)
		},
		getCapConfig: function (e, t) {
			var i = {
				ipv6: r._$isIPV6(),
				wmServerConfig: e.wmServerConfig,
				apiServer: e.apiServer,
				staticServer: e.staticServer,
				extraData: this.__getExtraData._$bind(this),
				captchaId: this.data.captchaId,
				onVerify: this.onVerify._$bind(this),
				lang: this.data.lang,
				onReady: this.readyCallback._$bind(this),
				timeout: 2e4
			};
			if (t) {
				i.element = r._$getAiBtn();
				i.mode = "bind";
				i.captchaId = r._$getAiCapId();
				if (!i.captchaId) {
					r._$showError(0, c.showText("系统繁忙，请刷新重试", this.enlang), "nerror");
					this.onClose();
					return
				}
				i.onClose = this.doAiClose._$bind(this);
				i = this.getAiPopStyle(i)
			} else {
				i.element = this.data.parentNode;
				i.customStyles = this.data.customStyles;
				i.captchaType = this.data.captchaType;
				i.mode = this.data.mode;
				i.width = this.data.width
			}
			return i
		},
		doAiClose: function () {
			setTimeout(function () {
				if (0 !== this.__capState) this.onClose()
			}._$bind(this), 200)
		},
		showNormalCap: function (e) {
			var t = this.getCapConfig(e);
			if (t)
				if ("popup" == this.data.mode) this.doPopUp(t);
				else this.__initNECaptcha(t)
		},
		showCap: function () {
			if (!this.data.customStyles.gap) this.data.customStyles.gap = "0";
			var e = this.parseCapConf();
			if (6 === this.data.capFlag) {
				if (this.data.autoVerify) this.doLockVerify();
				if (r._$isVersionFour()) this.showAiCap(e);
				else {
					r._$showError(0, c.showText("验证码异常，请稍后重试", this.enlang), "nerror");
					window._$needCookieSet = 1;
					return
				}
			} else this.showNormalCap(e)
		},
		showAiCap: function (e) {
			var t = this.getCapConfig(e, !0);
			if (t) this.__initNECaptcha(t)
		},
		__clearNecapstl: function () {
			if (this.__necapStl) this.__necapStl = clearTimeout(this.__necapStl);
			this.__necapStlNum = 0
		},
		__initNECaptcha: function (e, t) {
			if (!(this.__necapStlNum >= f || 1 === window._$LOADCAPJSERROR))
				if (window.initNECaptcha) {
					this.__clearNecapstl();
					if (this.__instance) this.__instance = null;
					if ("popup" === t) this.__doInitPopupCap(e);
					else this.__doInitCap(e)
				} else this.__necapStl = setTimeout(function () {
					this.__necapStlNum++;
					this.__initNECaptcha(e, t)
				}._$bind(this), h);
			else {
				this.__clearNecapstl();
				this.doCapErr()
			}
		},
		__doInitPopupCap: function (e) {
			window.initNECaptcha(e, function (e) {
				this.__instance = e;
				this.__innerBox.style.marginLeft = -1 * parseInt(this.__innerBox.offsetWidth / 2) + "px";
				this.__innerBox.style.marginTop = -1 * parseInt(this.__innerBox.offsetHeight / 2) + "px";
				this.__innerBox.style.width = parseInt(this.data.width) + 2 * this.data.capPadding + "px";
				this.__layer.style.visibility = "visible";
				t._$delEvent(this.__close, "click", this.doClose._$bind(this));
				t._$addEvent(this.__close, "click", this.doClose._$bind(this));
				r._$resize()
			}._$bind(this), function () {
				this.doCapErr()
			}._$bind(this))
		},
		__doInitCap: function (e) {
			window.initNECaptcha(e, function (e) {
				this.__instance = e;
				r._$resize()
			}._$bind(this), function () {
				this.doCapErr()
			}._$bind(this))
		},
		__beforeDestroy: function () {
			this.__clearNecapstl();
			this.__capState = 1;
			this.doClose();
			if (this.__instance && this.__instance.destroy) this.__instance.destroy()
		},
		_$refresh: function (e) {
			this.data.autoVerify = e;
			this.__beforeDestroy();
			this.showCap()
		}
	});
	return p
}, "a878c0216188111f46d39b9df767b354", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a13cd829d734e255809c920485d5a6b2", "bff3d86ec4ea91399919ee4963badfeb", "a4de926c2d79e8d8f856eaff4dac0f8b", "f1fc556eafb5676910602a7f1fa3af8e", "46a4de3a50f50a600950ca9cee88031e");
I$("ef328f7ca95c06d61f18782bd6ac5271", function (e, t, i, n, s, a, r, o, c, d, _, l, u, f) {
	var h;
	_._$$Module = e._$klass();
	h = _._$$Module._$extend(s._$$Abstract);
	h.__init = function (e) {
		this.enlang = window._$URSOPT.enlang;
		this.__super(e)
	};
	h.__reset = function (e) {
		this.__super(e);
		this.__initForm();
		this.__initEvent();
		this.__states = {};
		if (!e.errMsg) this._$clearState()
	};
	h.__sendMsg = function (e) {
		var t = e || {};
		t["URS-CM"] = 1;
		a._$postMessage("_parent", {
			data: t
		})
	};
	h.__destroy = function () {
		this.__super();
		if (this.__newSlideCap) this.__newSlideCap = this.__newSlideCap.destroy();
		n._$forEach(this.__ipts, function (e) {
			e = e._$recycle()
		})
	};
	h.__initNode = function () {
		this.__super()
	};
	h.__initCallback = function () { };
	h.__initErrorHandler = function () {
		a._$showError({
			name: ""
		}, "加载失败，请刷新页面重试", "nerror")
	};
	h.__setPlaceHolder = function () {
		if (this.__placeholder && !this.__placeholder2) {
			if (this.__placeholder.account) {
				var e = t._$getByClassName(this.__body, "u-input")[0];
				t._$getByClassName(e, "u-label")[0].innerHTML = a._$HtmlEncode(this.__placeholder.account);
				var i = t._$getByClassName(e, "j-inputtext")[0];
				t._$dataset(i, "placeholder", this.__placeholder.account)
			}
			if (this.__placeholder.pwd) {
				var n = t._$getByClassName(this.__body, "u-input")[1];
				t._$getByClassName(n, "u-label")[0].innerHTML = a._$HtmlEncode(this.__placeholder.pwd);
				var s = t._$getByClassName(n, "j-inputtext")[0];
				var r = t._$getByClassName(n, "u-pwdtext")[0];
				t._$dataset(s, "placeholder", this.__placeholder.pwd);
				if (r) t._$dataset(r, "placeholder", this.__placeholder.pwd)
			}
			this.__placeholder2 = 1
		}
	};
	h._$stateOK = function (e) {
		this.__form._$checkValidity(null, 1);
		setTimeout(function () {
			var t = 1,
				i = "",
				s = ["email", "password", "tcheckcode", "slidecap"];
			if (void 0 != typeof this.__states["checkcode"]) this.__states["tcheckcode"] = this.__states["checkcode"];
			n._$forEach(s, function (e) {
				if (1 == this.__states[e])
					if (!i) {
						t = 0;
						i = e
					}
			}._$bind(this));
			e(t, i)
		}._$bind(this), 400)
	};
	h._$getValues = function () {
		var e = [];
		n._$forEach(this.__inputs, function (t) {
			var i = t.value;
			e.push(i)
		});
		return e
	};
	h._$clearState = function () {
		n._$reverseEach(this.__ipts, function (e, t) {
			var i = t ? 0 : 1;
			e._$onClear(i)
		}._$bind(this));
		this.__initError()
	};
	h.__initError = function () {
		var e = t._$get("nerror");
		e.innerHTML = "";
		var i = t._$getByClassName(document, "error-color");
		for (var n = 0; n < i.length; n++) t._$delClassName(i[n], "error-color")
	};
	h.__setSlideSuc = function () {
		this._$dispatchEvent("onSlideOk");
		this.__destroyPopSlideCap();
		var e = t._$getByClassName(document, "ncpt_txt_status")[0];
		if (e) {
			e.style.display = "block";
			e.innerHTML = '<div class="u-success u-suc"></div>';
			e.className = "ncpt_txt_status TxtStatus statusTxt"
		}
		this.__states["slidecap"] = 0;
	};
	h.__cbVftcp = function () {
		this.__clearSlideErr();
		this.__slideCapLock = 0;
		this.__setSlideSuc();
		this.__checkNextBtn()
	};
	h.__destroyPopSlideCap = function () {
		if (this.__newSlideCap && "popup" == this.__opts.mode && !this.__needAiCap) this.__newSlideCap.doClose()
	};
	h.__unlockVfcap = function (e) {
		this.__slideCapLock = 0;
		if ("ainounlock" === e) this._$dispatchEvent("aiUnlockBtn");
		else {
			if (this.__unLockLogin) this.__unLockLogin();
			if (this.__unLockReg) this.__unLockReg()
		}
		this.__destroyPopSlideCap()
	};
	h.__slideErrShow = function (e, t) {
		var i;
		if (!t)
			if ("441" == e || "108" == e) {
				i = r[e] || c[e] || a._$getErrorTxt(e);
				a._$showError({
					name: "checkcode"
				}, i, "nerror")
			} else if ("444" == e || "445" == e || "109" == e || "110" == e) a._$showError({
				name: "slide"
			}, this.__slideTxt, "nerror")
	};
	h.__slideErrShowDefAndRefresh = function (e, t) {
		var i = !(!t || !t.noshow),
			n = !(t && t.isreg),
			s = t && t.dt;
		var o = r[e] || a._$getErrorTxt(e);
		var d = {
			name: "slide"
		};
		if ("401" == e && "02" == s) {
			o = c["40102"];
			d = null
		}
		if (!i) a._$showError(d, o, "nerror");
		this._$getSlideCap(n)
	};
	h.__aiSlideErrShow = function (e) {
		var t = a._$getAiBtnTxt();
		a._$showError({
			name: "slide"
		}, t, "nerror");
		this.__autoVerify = !1;
		var i = e ? "111" : "447";
		this.__changeCapTypeByCode(i, e)
	};
	h.__cbVftcpEx = function (e) {
		var t;
		this.__unlockVfcap();
		if (e) {
			if (a._$fail5("maillogin")) return;
			t = e.ret;
			if (n._$indexOf(["441", "444", "445", "447"], t) !== -1) {
				this.__autoVerify = "447" == t ? !0 : !1;
				this.__changeCapTypeByCode(t)
			} else this.__slideErrShowDefAndRefresh(t);
			this.__slideErrShow(t)
		} else this.__showSlideDefErrTxt()
	};
	h.__showSlideDefErrTxt = function () {
		a._$showError({
			name: "slide"
		}, this.__slideTxt, "nerror")
	};
	h.__resetCapType = function () {
		this.__needAiCap = 0;
		this.__needSlideCap = 0;
		this.__needCheckCode = 0
	};
	h.__changeCapTypeByCode = function (e, t) {
		this.__resetCapType();
		if ("447" == e || "111" == e) this.__needAiCap = 1;
		else if ("441" == e || "108" == e) this.__needCheckCode = 1;
		else if ("444" == e || "445" == e || "109" == e || "110" == e) this.__needSlideCap = 1;
		var i = t ? 0 : 1;
		this._$refreshCheckCode(e, i)
	};
	h.__slidebarover = function () {
		if (this.__sdot) this.__sdot = clearTimeout(this.__sdot);
		this.__sdov = setTimeout(function () {
			this.__slideCapBox.style.zIndex = "501"
		}._$bind(this), 100)
	};
	h.__slidebarout = function () {
		if (this.__sdov) this.__sdov = clearTimeout(this.__sdov);
		this.__sdot = setTimeout(function () {
			this.__slideCapBox.style.zIndex = "20"
		}._$bind(this), 100)
	};
	h.__clearSlideErr = function () {
		a._$removeError({
			name: "slide"
		}, "nerror")
	};
	h.__vSlide = function () {
		var e = function () {
			if (!this.__newSlideCap) return 1;
			else return this.__newSlideCap._$getCapState()
		};
		return function () {
			return e.call(this)
		}
	}();
	h._$getSlideCap = function (e) {
		if (e) a._$setAiBtn(this.__loginBtn);
		else a._$setAiBtn(this.__mainBtn);
		var i = {
			capBox: t._$get("ScapTcha").parentNode,
			captchaType: this.__slideTarget,
			parentNode: t._$get("ScapTcha"),
			customStyles: this.__opts.customStyles || {},
			capPadding: this.__opts.capPadding || "",
			capBarHeight: this.__opts.capBarHeight || "",
			isLogin: e,
			lang: this.__opts.lang,
			captchaId: this.__opts.productKey,
			mode: this.__opts.mode,
			width: this.__opts.swidth,
			verifyCallback: this.__slideVerify._$bind(this),
			initCallback: this.__initCallback._$bind(this),
			initErrorHandler: this.__initErrorHandler._$bind(this),
			autoVerify: this.__autoVerify,
			capFlag: this.__cf,
			doAutoVerify: this.__doAutoVerify._$bind(this),
			doLockVerify: this.__doLockVerify._$bind(this),
			onClose: this.__onAiClose._$bind(this)
		};
		if (this.__newSlideCap) this.__newSlideCap = this.__newSlideCap.destroy();
		this.__newSlideCap = new o({
			data: i
		})
	};
	h.__onAiClose = function () {
		this.__unlockVfcap()
	};
	h.__doLockVerify = function () {
		if (this.__doLockLogin) this.__doLockLogin({
			fromai: 1
		});
		if (this.__doLockReg) this.__doLockReg({
			fromai: 1
		})
	};
	h._$doVerify = function () {
		if (this.__newSlideCap) this.__newSlideCap._$doVerify()
	};
	h.__doAutoVerify = function () {
		this._$dispatchEvent("aiUnlockBtn");
		if (this.__loginBtn) this.__loginBtn.click();
		else if (this.__mainBtn) this.__mainBtn.click()
	};
	h.__newVerifyCap = function (e, t) {
		e.cap = t ? t.validate : this.__newSlideCap.getPwd();
		return e
	};
	h._$refreshCheckCode = function (e, t) {
		if (this.__needSlideCap || this.__needAiCap) this._$showSlideCode(e, t);
		else if (this.__needCheckCode) this._$showCheckCode();
		if (this.__cf) this._$dispatchEvent("onSetCF", this.__cf)
	};
	h._$hasCheckCode = function () {
		return this.__needCheckCode || this.__needSlideCap
	};
	h._$getAiCapState = function () {
		return this.__aicapstate
	};
	h.__showAiCap = function (e) {
		this._$hideCheckCode();
		this.__states["aicap"] = 1;
		this._$getSlideCap(e);
		setTimeout(function () {
			a._$resize()
		}, 200)
	};
	h._$showSlideCode = function (e, i) {
		this._$hideCheckCode();
		if ("447" != e && "111" != e) {
			if ("444" == e || "109" == e) {
				this.__cf = 4;
				this.__slideTarget = 2;
				this.__slideTxt = window._$capTxt1
			} else if ("445" == e || "110" == e) {
				this.__cf = 5;
				this.__slideTarget = 3;
				this.__slideTxt = window._$capTxt2
			}
			this.__needSlideCap = 1;
			this.__states["slidecap"] = 1;
			t._$delClassName(this.__slideCapBox, "f-dn");
			this._$getSlideCap(i);
			this._$dispatchEvent("ondisabled", 1);
			this.__checkNextBtn();
			var n = t._$get("cnt-box-parent");
			t._$addClassName(n, "hascheckcode");
			setTimeout(function () {
				a._$resize()
			}, 200)
		} else {
			this.__cf = 6;
			this.__slideTarget = 4;
			this.__aicapstate = !1;
			this.__showAiCap(i)
		}
	};
	h._$hideCheckCode = function () {
		var e = t._$get("cnt-box-parent");
		t._$delClassName(e, "hascheckcode");
		this.__states["checkcode"] = 0;
		this.__states["slidecap"] = 0;
		this.__needSlideCap = 0;
		this.__needCheckCode = 0;
		t._$addClassName(this.__checkCode, "f-dn");
		t._$addClassName(this.__slideCapBox, "f-dn");
		a._$resize()
	};
	h._$setNeedCheckCode = function () {
		this.__needSlideCap = 1;
		this.__needCheckCode = 0;
		this.__states["slidecap"] = 1;
		if (this.__newSlideCap) this.__newSlideCap = this.__newSlideCap.destroy()
	};
	return _
}, "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "e30f9e8af4c2bb3cff9252a9e1c3e5da", "a4de926c2d79e8d8f856eaff4dac0f8b", "285e64765191768caf2cc6de0397e37c", "41ef7aa93d23fe74cbf747774554e6ce", "dde0e6b40e64b3f022ca4ad9ab8b1a9c", "46a4de3a50f50a600950ca9cee88031e");
I$("47697f09a27d316bca77777112e11ab5", function (e, t, i, n, s, a) {
	i.__focusElement = function () {
		var i = function (i, n) {
			var s = e._$getElement(n);
			if (!s.value) t._$delClassName(s, i)
		};
		var n = function (i, n) {
			t._$addClassName(e._$getElement(n), i)
		};
		return function (t, s, a) {
			if (1 == s) e._$addEvent(t, "blur", i._$bind(null, a));
			if (1 == s || s == -1) e._$addEvent(t, "focus", n._$bind(null, a))
		}
	}();
	return i
}, "a100971a16ec757a0282a3b2cc059019", "1c92dd86f4b11b13a0c8a0c0f91b27e9");
I$("3a06af6ef5405b6c5a02133fb528748a", function (e, t, i, n, s, a, r, o) {
	if ("trident" === e._$KERNEL.engine && e._$KERNEL.release <= "3.0") I$("8694857e5d0d10495f696158c2a714a7", function () {
		t.__focusElement = function () {
			var e = function (e, t) {
				n._$delClassName(i._$getElement(t), e)
			};
			return t.__focusElement._$aop(function (t) {
				var n = t.args;
				if (1 != n[1]) {
					i._$addEvent(n[0], "blur", e._$bind(null, n[2]));
					n[1] = -1
				}
			})
		}()
	});
	return t
}, "a878c0216188111f46d39b9df767b354", "47697f09a27d316bca77777112e11ab5", "a100971a16ec757a0282a3b2cc059019", "1c92dd86f4b11b13a0c8a0c0f91b27e9");
I$("761fbdbe29c775b80a321f096f211cd8", function (e, t, i, n, s, a, r, o, c) {
	a._$focus = function (e, s) {
		e = i._$get(e);
		if (e) {
			var a = 0,
				r = "js-focus";
			if (t._$isNumber(s)) a = s;
			else if (t._$isString(s)) r = s;
			else if (t._$isObject(s)) {
				a = s.mode || a;
				r = s.clazz || r
			}
			var o = parseInt(i._$dataset(e, "mode"));
			if (!isNaN(o)) a = o;
			o = i._$dataset(e, "focus");
			if (o) r = o;
			n.__focusElement(e, a, r)
		}
	};
	s._$merge(a);
	if (!0) e.copy(e.P("nej.e"), a);
	return a
}, "017b426dd2bb4315fa45d567a1fd3718", "8fd03edddb19cf8c294f56ca6638c475", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "3a06af6ef5405b6c5a02133fb528748a", "703889c7eb7b7020f9b7e23d6c3a0b64");
I$("3450fb8b23067efa3570f911a05e6bc6", function (e) {
	e.__length = function () {
		var e = /(\r\n|\r|\n)/g;
		return function (t) {
			return (t || "").replace(e, "**").length
		}
	}();
	return e
}, "a878c0216188111f46d39b9df767b354");
I$("2a0ccd3add82d0b12e32ed0b4fbec141", function (e, t) {
	if ("trident" === e._$KERNEL.engine) I$("7e4cb60074495f74f406b0be1e53b7bd", function () {
		t.__length = function () {
			return (_event.args[0] || "").length
		}
	});
	return t
}, "a878c0216188111f46d39b9df767b354", "3450fb8b23067efa3570f911a05e6bc6");
I$("a307efa4affa2678b97e2509f0a05384", function (e, t, i, n, s, a, r, o, c, d) {
	r._$counter = function () {
		var e = /[\r\n]/gi,
			s = {};
		var r = function (e) {
			return a.__length(e)
		};
		var o = function (e) {
			var i = s[e],
				n = t._$get(e),
				a = t._$get(i.xid);
			if (n && i) {
				var r = {
					input: n.value
				};
				r.length = i.onlength(r.input);
				r.delta = i.max - r.length;
				i.onchange(r);
				a.innerHTML = r.value || "剩余" + Math.max(0, r.delta) + "个字"
			}
		};
		return function (e, a) {
			var d = t._$id(e);
			if (d && !s[d]) {
				var _ = n._$merge({}, a);
				_.onchange = _.onchange || c;
				_.onlength = r;
				if (!_.max) {
					var l = parseInt(t._$attr(d, "maxlength")),
						u = parseInt(t._$dataset(d, "maxLength"));
					_.max = l || u || 100;
					if (!l && u) _.onlength = n._$length
				}
				s[d] = _;
				i._$addEvent(d, "input", o._$bind(null, d));
				var f = t._$wrapInline(d, {
					nid: _.nid || "js-counter",
					clazz: _.clazz
				});
				_.xid = t._$id(f);
				o(d)
			}
		}
	}();
	s._$merge(r);
	if (!0) e.copy(e.P("nej.e"), r);
	return r
}, "017b426dd2bb4315fa45d567a1fd3718", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "703889c7eb7b7020f9b7e23d6c3a0b64", "2a0ccd3add82d0b12e32ed0b4fbec141");
I$("40f8c081ce0c3a7291a282bae15f39c7", function (e, t, i, n) {
	e.__setPlaceholder = function (e, t) { };
	return e
});
I$("c69723587926ec94197dfdb56ce44941", function (e, t, i, n, s, a, r, o, c) {
	if ("trident" === e._$KERNEL.engine && e._$KERNEL.release <= "5.0") I$("0505d97471f1c09f9da9f9dc9e9c7092", function () {
		s.__setPlaceholder = function () {
			var e = {}, s = {
				nid: "j-holder-" + n._$uniqueID()
			};
			var a = function (i) {
				var n = t._$get(i);
				e[i] = 2;
				if (!n.value) t._$setStyle(t._$wrapInline(n, s), "display", "none")
			};
			var r = function (i) {
				var n = t._$get(i);
				e[i] = 1;
				if (!n.value) t._$setStyle(t._$wrapInline(n, s), "display", "")
			};
			var o = function (i) {
				var n = t._$get(i);
				if (2 != e[i]) t._$setStyle(t._$wrapInline(n, s), "display", !n.value ? "" : "none")
			};
			var c = function (e, i) {
				var n = t._$id(e),
					a = t._$wrapInline(e, {
						tag: "label",
						clazz: i,
						nid: s.nid
					});
				a.htmlFor = n;
				var r = t._$attr(e, "placeholder") || "";
				a.innerText = "null" == r ? "" : r;
				var o = e.offsetHeight + "px";
				t._$style(a, {
					left: 0,
					display: !e.value ? "" : "none"
				})
			};
			return function (t, n) {
				if (null == e[t.id]) {
					c(t, n);
					var s = t.id;
					e[s] = 1;
					i._$addEvent(t, "blur", r._$bind(null, s));
					i._$addEvent(t, "focus", a._$bind(null, s));
					i._$addEvent(t, "input", o._$bind(null, s))
				}
			}
		}()
	});
	return s
}, "a878c0216188111f46d39b9df767b354", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "40f8c081ce0c3a7291a282bae15f39c7");
I$("40a6967199520c0d6b6bd3adea78027f", function (e, t, i, n, s, a, r, o) {
	s._$placeholder = function (e, i) {
		e = t._$get(e);
		n.__setPlaceholder(e, t._$dataset(e, "holder") || i || "js-placeholder")
	};
	i._$merge(s);
	if (!0) e.copy(e.P("nej.e"), s);
	return s
}, "017b426dd2bb4315fa45d567a1fd3718", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "703889c7eb7b7020f9b7e23d6c3a0b64", "c69723587926ec94197dfdb56ce44941");
I$("1a47ce4641d0edf3b9f3fe61693eef2b", function (e, t, i, n, s, a, r, o, c, d, _, l, u, f) {
	d._$$WebForm = t._$klass();
	f = d._$$WebForm._$extend(a._$$EventTarget);
	f.__init = function () {
		this.__super();
		this.__wopt = {
			tp: {
				nid: "js-nej-tp"
			},
			ok: {
				nid: "js-nej-ok"
			},
			er: {
				nid: "js-nej-er"
			}
		}
	};
	f.__reset = function (e) {
		this.__super(e);
		this.__form = document.forms[e.form] || i._$get(e.form);
		this.__doInitDomEvent([
			[this.__form, "enter", this._$dispatchEvent._$bind(this, "onenter")]
		]);
		this.__message = e.message || {};
		this.__message.pass = this.__message.pass || "&nbsp;";
		var t = this.__dataset(this.__form, "focusMode", 1);
		if (!isNaN(t)) this.__fopt = {
			mode: t,
			clazz: e.focus
		};
		this.__holder = e.holder;
		this.__wopt.tp.clazz = "js-mhd " + (e.tip || "js-tip");
		this.__wopt.ok.clazz = "js-mhd " + (e.pass || "js-pass");
		this.__wopt.er.clazz = "js-mhd " + (e.error || "js-error");
		this.__invalid = e.invalid || "js-invalid";
		this.__doInitValidRule(e);
		this._$refresh();
		if (this.__fnode) this.__fnode.focus()
	};
	f.__destroy = function () {
		this.__super();
		this._$reset();
		delete this.__message;
		delete this.__fnode;
		delete this.__vinfo;
		delete this.__xattr;
		delete this.__form;
		delete this.__treg;
		delete this.__vfun
	};
	f.__dataset = function (e, t, n) {
		var s = i._$dataset(e, t);
		switch (n) {
			case 1:
				return parseInt(s, 10);
			case 2:
				return "true" == (s || "").toLowerCase();
			case 3:
				return this.__doParseDate(s)
		}
		return s
	};
	f.__number = function (e, t, i) {
		if ("date" == t) return this.__doParseDate(e, i);
		else return parseInt(e, 10)
	};
	f.__isValidElement = function () {
		var e = /^button|submit|reset|image|hidden|file$/i;
		return function (t) {
			t = this._$get(t) || t;
			var i = t.type;
			return !!t.name && !e.test(t.type || "")
		}
	}();
	f.__isValueElement = function () {
		var e = /^hidden$/i;
		return function (t) {
			if (this.__isValidElement(t)) return !0;
			t = this._$get(t) || t;
			var i = t.type || "";
			return e.test(i)
		}
	}();
	f.__doParseDate = function () {
		var e = /[:\.]/;
		return function (t, i) {
			if ("now" == (t || "").toLowerCase()) return +new Date;
			var n = s._$var2date(t);
			if (n && !e.test(t)) {
				var a = (i || "").split(e);
				n.setHours(parseInt(a[0], 10) || 0, parseInt(a[1], 10) || 0, parseInt(a[2], 10) || 0, parseInt(a[3], 10) || 0)
			}
			return +n
		}
	}();
	f.__doCheckString = function (e, t) {
		var i = this.__vfun[t],
			n = this.__dataset(e, t);
		if (n && i) {
			this.__doPushValidRule(e, i);
			this.__doSaveValidInfo(e, t, n)
		}
	};
	f.__doCheckPattern = function (e, t) {
		try {
			var i = this.__dataset(e, t);
			if (!i) return;
			var n = new RegExp(i);
			this.__doSaveValidInfo(e, t, n);
			this.__doPushValidRule(e, this.__vfun[t])
		} catch (s) { }
	};
	f.__doCheckBoolean = function (e, t) {
		var i = this.__vfun[t];
		if (i && this.__dataset(e, t, 2)) this.__doPushValidRule(e, i)
	};
	f.__doCheckNumber = function (e, t, i) {
		i = parseInt(i, 10);
		if (!isNaN(i)) {
			this.__doSaveValidInfo(e, t, i);
			this.__doPushValidRule(e, this.__vfun[t])
		}
	};
	f.__doCheckDSNumber = function (e, t) {
		this.__doCheckNumber(e, t, this.__dataset(e, t))
	};
	f.__doCheckATNumber = function (e, t) {
		this.__doCheckNumber(e, t, i._$attr(e, t))
	};
	f.__doCheckTPNumber = function (e, t, i) {
		var n = this.__number(this.__dataset(e, t), this.__dataset(e, "type"));
		this.__doCheckNumber(e, t, n)
	};
	f.__doCheckCustomAttr = function (e) {
		s._$loop(this.__xattr, function (t, n) {
			var s = i._$dataset(e, n);
			if (null != s) {
				this.__doSaveValidInfo(e, n, s);
				this.__doPushValidRule(e, this.__vfun[n])
			}
		}, this)
	};
	f.__doPrepareElement = function () {
		var e = /^input|textarea$/i,
			t = /[:\.]/;
		var s = function (e) {
			this._$showTip(n._$getElement(e))
		};
		var a = function (e) {
			var t = n._$getElement(e);
			if (!this.__dataset(t, "ignore", 2)) this.__doCheckValidity(t)
		};
		return function (t) {
			if (this.__dataset(t, "autoFocus", 2)) this.__fnode = t;
			var n = i._$attr(t, "placeholder");
			if (n && "null" != n) c._$placeholder(t, this.__holder);
			if (this.__fopt && e.test(t.tagName)) r._$focus(t, this.__fopt);
			var d = i._$id(t);
			this.__doCheckBoolean(d, "required");
			this.__doCheckString(d, "type");
			this.__doCheckPattern(d, "pattern");
			this.__doCheckATNumber(d, "maxlength");
			this.__doCheckATNumber(d, "minlength");
			this.__doCheckDSNumber(d, "maxLength");
			this.__doCheckDSNumber(d, "minLength");
			this.__doCheckTPNumber(d, "min");
			this.__doCheckTPNumber(d, "max");
			this.__doCheckCustomAttr(d);
			var l = i._$dataset(d, "time");
			if (l) this.__doSaveValidInfo(d, "time", l);
			var u = t.name;
			this.__message[u + "-tip"] = this.__dataset(t, "tip");
			this.__message[u + "-error"] = this.__dataset(t, "message");
			this._$showTip(t);
			var f = this.__vinfo[d],
				h = (f || _).data || _,
				p = this.__dataset(t, "counter", 2);
			if (p && (h.maxlength || h.maxLength)) o._$counter(d, {
				nid: this.__wopt.tp.nid,
				clazz: "js-counter"
			});
			if (f && e.test(t.tagName)) this.__doInitDomEvent([
				[t, "focus", s._$bind(this)],
				[t, "blur", a._$bind(this)]
			]);
			else if (this.__dataset(t, "focus", 2)) this.__doInitDomEvent([
				[t, "focus", s._$bind(this)]
			])
		}
	}();
	f.__doInitValidRule = function () {
		var t = {
			number: /^[\d]+$/i,
			url: /^[a-z]+:\/\/(?:[\w-]+\.)+[a-z]{2,6}.*$/i,
			email: /^[\w-\.]+@(?:[\w-]+\.)+[a-z]{2,6}$/i,
			email1: /^[\w-\.]+@(?:[\w-]+\.)+[a-z]{2,6}$/i,
			email2: /^[\w-\.]+$/i,
			date: function (e, t) {
				var i = this.__dataset(t, "format") || "yyyy-MM-dd";
				return !e || !isNaN(this.__doParseDate(e)) && s._$format(this.__doParseDate(e), i) == e
			}
		};
		var i = {
			required: function (e) {
				var t = e.type,
					i = !e.value,
					n = ("checkbox" == t || "radio" == t) && !e.checked;
				if (n || i) return -1
			},
			type: function (e, t) {
				var i = this.__treg[t.type],
					n = e.value.trim(),
					a = !!i.test && !i.test(n),
					r = s._$isFunction(i) && !i.call(this, n, e);
				if (a || r) return -2
			},
			pattern: function (e, t) {
				if (!t.pattern.test(e.value)) return -3
			},
			maxlength: function (e, t) {
				if (e.value.length > t.maxlength) return -4
			},
			minlength: function (e, t) {
				if (e.value.length < t.minlength) return -5
			},
			maxLength: function (e, t) {
				if (s._$length(e.value) > t.maxLength) return -4
			},
			minLength: function (e, t) {
				if (s._$length(e.value) < t.minLength) return -5
			},
			min: function (e, t) {
				var i = this.__number(e.value, t.type, t.time);
				if (isNaN(i) || i < t.min) return -6
			},
			max: function (e, t) {
				var i = this.__number(e.value, t.type, t.time);
				if (isNaN(i) || i > t.max) return -7
			}
		};
		var n = function (e, t, i, n) {
			var a = e[i];
			if (!s._$isFunction(t) || !s._$isFunction(a)) e[i] = t;
			else e[i] = a._$aop(t)
		};
		return function (a) {
			if (a.domain) t.email = t.email2;
			else t.email = t.email1;
			this.__treg = e.X({}, t);
			s._$loop(a.type, n._$bind(null, this.__treg));
			this.__vfun = e.X({}, i);
			this.__xattr = a.attr;
			s._$loop(this.__xattr, n._$bind(null, this.__vfun))
		}
	}();
	f.__doPushValidRule = function (e, t) {
		if (s._$isFunction(t)) {
			var i = this.__vinfo[e];
			if (!i || !i.func) {
				i = i || {};
				i.func = [];
				this.__vinfo[e] = i
			}
			i.func.push(t)
		}
	};
	f.__doSaveValidInfo = function (e, t, i) {
		if (t) {
			var n = this.__vinfo[e];
			if (!n || !n.data) {
				n = n || {};
				n.data = {};
				this.__vinfo[e] = n
			}
			n.data[t] = i
		}
	};
	f.__doCheckValidity = function (e) {
		e = this._$get(e) || e;
		if (!e) return !0;
		var t = this.__vinfo[i._$id(e)];
		if (!t && this.__isValidElement(e)) {
			this.__doPrepareElement(e);
			t = this.__vinfo[i._$id(e)]
		}
		if (!t) return !0;
		var n;
		s._$forIn(t.func, function (i) {
			n = i.call(this, e, t.data);
			return null != n
		}, this);
		if (null == n) {
			var a = {
				target: e,
				form: this.__form
			};
			this._$dispatchEvent("oncheck", a);
			n = a.value
		}
		var a = {
			target: e,
			form: this.__form
		};
		if (null != n) {
			if (s._$isObject(n)) s._$merge(a, n);
			else a.code = n;
			this._$dispatchEvent("oninvalid", a);
			if (!a.stopped) this._$showMsgError(e, a.value || this.__message[e.name + n])
		} else {
			this._$dispatchEvent("onvalid", a);
			if (!a.stopped) this._$showMsgPass(e, a.value)
		}
		return null == n
	};
	f.__doShowMessage = function () {
		var e = {
			tp: "tip",
			ok: "pass",
			er: "error"
		};
		var t = function (e, t) {
			return e == t ? "block" : "none"
		};
		var n = function (e, t, n) {
			var s = a.call(this, e, t);
			if (!s && n) s = i._$wrapInline(e, this.__wopt[t]);
			return s
		};
		var a = function (t, n) {
			var s = i._$get(t.name + "-" + e[n]);
			if (!s) s = i._$getByClassName(t.parentNode, this.__wopt[n].nid)[0];
			return s
		};
		return function (e, r, o) {
			e = this._$get(e) || e;
			if (e) {
				"er" == o ? i._$addClassName(e, this.__invalid) : i._$delClassName(e, this.__invalid);
				var c = n.call(this, e, o, r);
				if (c && r) c.innerHTML = r;
				s._$loop(this.__wopt, function (n, s) {
					i._$setStyle(a.call(this, e, s), "display", t(o, s))
				}, this)
			}
		}
	}();
	f._$showTip = function (e, t) {
		this.__doShowMessage(e, t || this.__message[e.name + "-tip"], "tp")
	};
	f._$showMsgPass = function (e, t) {
		this.__doShowMessage(e, t || this.__message[e.name + "-pass"] || this.__message.pass, "ok")
	};
	f._$showMsgError = function (e, t) {
		this.__doShowMessage(e, t || this.__message[e.name + "-error"], "er")
	};
	f._$setValue = function () {
		var e = /^(?:radio|checkbox)$/i;
		var t = function (e) {
			return null == e ? "" : e
		};
		var i = function (e, i) {
			if (i.multiple) {
				var n;
				if (!s._$isArray(e)) n[e] = e;
				else n = s._$array2object(e);
				s._$forEach(i.options, function (e) {
					e.selected = null != n[e.value]
				})
			} else i.value = t(e)
		};
		var n = function (n, s) {
			if (e.test(s.type || "")) s.checked = n == s.value;
			else if ("SELECT" == s.tagName) i(n, s);
			else s.value = t(n)
		};
		return function (e, t) {
			var i = this._$get(e);
			if (i)
				if ("SELECT" == i.tagName || !i.length) n(t, i);
				else s._$forEach(i, n._$bind(null, t))
		}
	}();
	f._$get = function (e) {
		return this.__form.elements[e]
	};
	f._$form = function () {
		return this.__form
	};
	f._$data = function () {
		var e = /^radio|checkbox$/i,
			t = /^number|date$/;
		var n = function (e) {
			if ("SELECT" == e.tagName && e.multiple) {
				var t = [];
				s._$forEach(e.options, function (e) {
					if (e.selected) t.push(e.value)
				});
				return t.length > 0 ? t : ""
			}
			return e.value
		};
		var a = function (a, r) {
			var o = r.name,
				c = n(r),
				d = a[o],
				_ = this.__dataset(r, "type"),
				l = i._$dataset(r, "time");
			if (t.test(_))
				if (s._$isArray(c)) s._$forEach(c, function (e, t, i) {
					i[t] = this.__number(e, _, l)
				}, this);
				else c = this.__number(c, _, l);
			if (e.test(r.type) && !r.checked) {
				c = this.__dataset(r, "value");
				if (!c) return
			}
			if (d) {
				if (!s._$isArray(d)) {
					d = [d];
					a[o] = d
				}
				d.push(c)
			} else a[o] = c
		};
		return function () {
			var e = {};
			s._$forEach(this.__form.elements, function (t) {
				if (this.__isValueElement(t)) a.call(this, e, t)
			}, this);
			return e
		}
	}();
	f._$reset = function () {
		var e = function (e) {
			if (this.__isValidElement(e)) this._$showTip(e)
		};
		return function () {
			this.__form.reset();
			s._$forEach(this.__form.elements, e, this)
		}
	}();
	f._$submit = function () {
		this.__form.submit()
	};
	f._$refresh = function () {
		var e = function (e) {
			if (this.__isValidElement(e)) this.__doPrepareElement(e)
		};
		return function () {
			this.__vinfo = {};
			s._$forEach(this.__form.elements, e, this)
		}
	}();
	f._$checkValidity = function (e, t) {
		e = this._$get(e) || e;
		if (e) return this.__doCheckValidity(e);
		var i = !0;
		s._$forEach(this.__form.elements, function (e) {
			var n = this._$checkValidity(e);
			i = i && n;
			if (!i && t) return !0
		}, this);
		return i;
	};
	if (!0) e.copy(e.P("nej.ut"), d);
	return d
}, "017b426dd2bb4315fa45d567a1fd3718", "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "e0793c838b68fed5a7e1742035643bec", "761fbdbe29c775b80a321f096f211cd8", "a307efa4affa2678b97e2509f0a05384", "40a6967199520c0d6b6bd3adea78027f");
I$("20a53a78a8e132ee6b99f8e237d5d673", function (e, t, i, n, s) {
	var a;
	s._$$WebForm = e._$klass();
	a = s._$$WebForm._$extend(n._$$WebForm);
	a.__doInitValidRule = function () {
		var e = {
			number: /^[\d]+$/i,
			url: /^[a-z]+:\/\/(?:[\w-]+\.)+[a-z]{2,6}.*$/i,
			email: /^[\w-\.]+@(?:[\w-]+\.)+[a-z]{2,6}$/i,
			email1: /^[\w-\.]+@(?:[\w-]+\.)+[a-z]{2,6}$/i,
			email2: /(^[\w-\.]+$|^[\w-\.]+@.+$)/i,
			phone: /^(13|14|15|16|17|18|19)\d{9}$/,
			date: function (e, i) {
				var n = this.__dataset(i, "format") || "yyyy-MM-dd";
				return !e || !isNaN(this.__doParseDate(e)) && t._$format(this.__doParseDate(e), n) == e
			}
		};
		var i = {
			required: function (e) {
				var t = e.type,
					i = !e.value,
					n = ("checkbox" == t || "radio" == t) && !e.checked;
				if (n || i) return -1
			},
			type: function (e, i) {
				var n = this.__treg[i.type],
					s = e.value.trim(),
					a = !!n.test && !n.test(s),
					r = t._$isFunction(n) && !n.call(this, s, e);
				if (a || r) return -2
			},
			pattern: function (e, t) {
				if (!t.pattern.test(e.value)) return -3
			},
			maxlength: function (e, t) {
				if (e.value.length > t.maxlength) return -4
			},
			minlength: function (e, t) {
				if (e.value.length < t.minlength) return -5
			},
			maxLength: function (e, i) {
				if (t._$length(e.value) > i.maxLength) return -4
			},
			minLength: function (e, i) {
				if (t._$length(e.value) < i.minLength) return -5
			},
			min: function (e, t) {
				var i = this.__number(e.value, t.type, t.time);
				if (isNaN(i) || i < t.min) return -6
			},
			max: function (e, t) {
				var i = this.__number(e.value, t.type, t.time);
				if (isNaN(i) || i > t.max) return -7
			}
		};
		var n = function (e, i, n, s) {
			var a = e[n];
			if (!t._$isFunction(i) || !t._$isFunction(a)) e[n] = i;
			else e[n] = a._$aop(i)
		};
		return function (s) {
			if (s.onlyPhone) e.email = e.phone;
			else if (s.domain) e.email = e.email2;
			else e.email = e.email1;
			this.__treg = NEJ.X({}, e);
			t._$loop(s.type, n._$bind(null, this.__treg));
			this.__vfun = NEJ.X({}, i);
			this.__xattr = s.attr;
			t._$loop(this.__xattr, n._$bind(null, this.__vfun))
		}
	}();
	a.__doCheckValidity = function (e) {
		var n;
		e = this._$get(e) || e;
		if (!e) return !0;
		var s = this.__vinfo[i._$id(e)];
		if (!s && this.__isValidElement(e)) {
			this.__doPrepareElement(e);
			s = this.__vinfo[i._$id(e)]
		}
		if (!s) return !0;
		var a;
		t._$forIn(s.func, function (t) {
			a = t.call(this, e, s.data);
			return null != a
		}, this);
		if (null == a) {
			n = {
				target: e,
				form: this.__form
			};
			this._$dispatchEvent("oncheck", n);
			a = n.value
		}
		n = {
			target: e,
			form: this.__form
		};
		if (null != a) {
			if (t._$isObject(a)) t._$merge(n, a);
			else n.code = a;
			this._$dispatchEvent("oninvalid", n);
			if (!n.stopped) this._$showMsgError(e, n.value || this.__message[e.name + a])
		} else {
			this._$dispatchEvent("onvalid", n);
			if (!n.stopped) this._$showMsgPass(e, n.value)
		} if (n.ignore) return !0;
		else return null == a
	};
	return s
}, "4600f25ee05ffacd81f2d44da00eaaa7", "8fd03edddb19cf8c294f56ca6638c475", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "1a47ce4641d0edf3b9f3fe61693eef2b");
I$("a36623c79d79c9f11f2c733ec46973dd", function (e, t, i, n, s, a, r, o, c, d) {
	a._$$SelectHelper = t._$klass();
	d = a._$$SelectHelper._$extend(s._$$EventTarget);
	d.__reset = function (e) {
		this.__super(e);
		this.__loop = !!e.loopable;
		this.__parent = i._$get(e.parent);
		this.__selected = e.selected || "js-selected";
		this.__hovered = e.hover || this.__selected;
		this.__nopt = {};
		if (e.clazz) {
			this.__nopt.filter = i._$hasClassName._$bind2(i, e.clazz);
			this.__clazz = e.clazz
		}
		this.__kbody = this.__getKeyBoardParent(this.__parent);
		this.__doInitDomEvent([
			[this.__kbody, "keydown", this.__doCheckKBAction._$bind(this), !0],
			[this.__kbody, "enter", this.__doCheckKBEnter._$bind(this)],
			[this.__parent, "mousedown", this.__onCheckClick._$bind(this)],
			[this.__parent, "mouseover", this.__onCheckHover._$bind(this)],
			[this.__parent, "mouseleave", this.__onCheckLeave._$bind(this)]
		])
	};
	d.__destroy = function () {
		this.__super();
		delete this.__selected;
		delete this.__hovered;
		delete this.__parent;
		delete this.__kbody;
		delete this.__clazz;
		delete this.__nopt;
		delete this.__loop
	};
	d.__isItemElement = function (e) {
		if (this.__clazz) return i._$hasClassName(e, this.__clazz);
		else return e.parentNode == this.__parent
	};
	d.__getKeyBoardParent = function () {
		var e = 1e3;
		return function (t) {
			for (; t && (parseInt(t.tabIndex) || 0) <= e;) t = t.parentNode;
			return t || document
		}
	}();
	d.__getItemElement = function (e) {
		var t = i._$getByClassName(this.__parent, e);
		return !t ? null : t[0]
	};
	d.__doSyncSelection = function (e, t) {
		i._$delClassName(e.last, t);
		i._$addClassName(e.target, t);
		if (t == this.__selected && e.last != e.target) {
			this.__doScrollToView(e.target);
			this._$dispatchEvent("onchange", e)
		}
	};
	d.__doScrollToView = function (e) {
		var t = i._$getScrollViewPort(e),
			n = i._$offset(e, t);
		if (!(n.y - t.scrollTop < 0)) {
			var s = n.y + e.offsetHeight - t.clientHeight;
			if (s > t.scrollTop) t.scrollTop = s
		} else t.scrollTop = n.y
	};
	d.__doParseSelection = function (e, t) {
		var i = n._$getElement(e, this.__isItemElement._$bind(this));
		return !i ? null : {
			last: this.__getItemElement(t),
			target: i
		}
	};
	d.__doCheckKBAction = function (e) {
		var t = e.keyCode;
		if (38 == t || 40 == t) {
			n._$stop(e);
			var s = {
				last: this._$getSelectedNode()
			};
			this.__nopt.backward = 38 == t;
			var a = !this.__clazz ? i._$getChildren(this.__parent) : i._$getByClassName(this.__parent, this.__clazz),
				r = this.__nopt.backward ? a[a.length - 1] : a[0];
			if (!s.last) s.target = this.__getItemElement(this.__hovered) || r;
			else s.target = i._$getSibling(s.last, this.__nopt); if (!s.target) {
				if (!this.__loop || a.length <= 1) return;
				s.target = r
			}
			this.__doSyncSelection(s, this.__selected)
		}
	};
	d.__doCheckKBEnter = function (e) {
		n._$stop(e);
		this._$dispatchEvent("onselect", {
			enter: !0,
			target: this._$getSelectedNode()
		})
	};
	d.__onCheckClick = function (e) {
		n._$stop(e);
		var t = this.__doParseSelection(e, this.__selected);
		if (t) {
			this.__doSyncSelection(t, this.__selected);
			this._$dispatchEvent("onselect", {
				target: t.target
			})
		}
	};
	d.__onCheckHover = function (e) {
		var t = this.__doParseSelection(e, this.__hovered);
		if (t) {
			this.__doSyncSelection(t, this.__hovered);
			if (this.__kbody.focus) this.__kbody.focus()
		}
	};
	d.__onCheckLeave = function (e) {
		if (this.__hovered != this.__selected) i._$delClassName(this.__getItemElement(this.__hovered), this.__hovered)
	};
	d._$getSelectedNode = function () {
		return this.__getItemElement(this.__selected)
	};
	if (!0) e.copy(e.P("nej.ut"), a);
	return a
}, "017b426dd2bb4315fa45d567a1fd3718", "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a100971a16ec757a0282a3b2cc059019", "e0793c838b68fed5a7e1742035643bec");
I$("8a2da1cdb91a8851557f9465fe9c8248", function (e, t, i, n, s, a, r, o, c) {
	var d;
	a._$$Suggest = t._$klass();
	d = a._$$Suggest._$extend(n._$$EventTarget);
	d.__init = function () {
		this.__sopt = {
			loopable: !0,
			onselect: this.__onSelect._$bind(this),
			onchange: this.__onSelectionChange._$bind(this)
		};
		this.__super()
	};
	d.__reset = function (e) {
		this.__super(e);
		this.__auto = !!e.autofill;
		this.__input = i._$get(e.input);
		this.__sopt.clazz = e.clazz;
		this.__sopt.parent = i._$get(e.body);
		this.__sopt.selected = e.selected || "js-selected";
		this.__doInitDomEvent([
			[this.__input, "input", this.__onInput._$bind(this)],
			[this.__input, "focus", this.__onInput._$bind(this)]
		]);
		if (!e.noblur) this.__doInitDomEvent([
			[this.__input, "blur", this.__onBlur._$bind(this)]
		]);
		this._$visibile(!1);
		this.__helper = s._$$SelectHelper._$allocate(this.__sopt)
	};
	d.__destroy = function () {
		this.__super();
		if (this.__helper) {
			this.__helper._$recycle();
			delete this.__helper
		}
		delete this.__xxx;
		delete this.__input;
		delete this.__sopt.parent
	};
	d.__onBlur = function () {
		var e = this.__helper._$getSelectedNode();
		var t = i._$dataset(e, "ishaoma");
		if ("1" == t) e = this.__sopt.parent.children[0];
		this.__onSelect({
			target: e
		})
	};
	d.__onInput = function () {
		var e = this.__input.value.trim();
		if (!e) this._$visibile(!1);
		else if (!this.__xxx) this._$dispatchEvent("onchange", e)
	};
	d.__doUpdateValue = function (e) {
		if (!this.__xxx) {
			this.__xxx = !0;
			if (e && e != this.__input.value) this.__input.value = e;
			this.__xxx = !1
		}
	};
	d.__onSelect = function (e) {
		if ("hidden" != i._$getStyle(this.__sopt.parent, "visibility")) {
			var t = i._$dataset(e.target, "value") || "";
			this.__doUpdateValue(t);
			t = t || this.__input.value;
			this._$update("");
			this._$dispatchEvent("onselect", t, {
				target: e.target,
				enter: e.enter,
				value: t,
				event: e
			})
		}
	};
	d.__onSelectionChange = function (e) {
		if (this.__auto) this.__doUpdateValue(i._$dataset(e.target, "value") || "")
	};
	d._$setList = function (e) {
		this._$visibile(!!e && e.length > 0)
	};
	d._$visibile = function (e) {
		var e = !e ? "hidden" : "visible";
		this.__sopt.parent.style.visibility = e;
		if ("hidden" === e) this.__sopt.parent.innerHTML = ""
	};
	d._$update = function (e) {
		this.__sopt.parent.innerHTML = e || "&nbsp;";
		this._$visibile(!!e)
	};
	if (!0) e.copy(e.P("nej.ut"), a);
	return a
}, "017b426dd2bb4315fa45d567a1fd3718", "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "e0793c838b68fed5a7e1742035643bec", "a36623c79d79c9f11f2c733ec46973dd");
I$("71f2f52d2739fd2c36502fedbe60fa8b", ".#<uispace>-parent{position:relative;}\n.#<uispace>{position:absolute;border:1px solid #aaa;background:#fff;text-align:left;visibility:hidden;}\n.#<uispace> .zitm{height:20px;line-height:20px;cursor:default;}\n.#<uispace> .js-selected{background:#1257F9;}");
I$("9bde6f7ef66f65825a0909c1cceed61a", '{if defined("xlist")&&!!xlist.length}\n  {list xlist as x}<div class="zitm" data-value="${x}">${x}</div>{/list}\n{/if}');
I$("f07c4a98a7ab2c8b7667423915976e60", function (e, t, i, n, s, a, r, o, c, d, _, l, u) {
	var f = i._$pushCSSText(o),
		h = r._$add(c),
		p;
	d._$$Suggest = t._$klass();
	p = d._$$Suggest._$extend(s._$$Abstract);
	p.__init = function () {
		this.__sopt = {
			onchange: this.__onChange._$bind(this),
			onselect: this.__onSelect._$bind(this)
		};
		this.__super()
	};
	p.__reset = function (e) {
		this.__super(e);
		this.__sopt.autofill = 0 != e.autofill;
		this.__sopt.input = i._$get(e.input);
		this.__sopt.input.insertAdjacentElement("afterEnd", this.__body);
		this.__suggest = a._$$Suggest._$allocate(this.__sopt)
	};
	p.__destroy = function () {
		if (this.__suggest) {
			this.__suggest._$recycle();
			delete this.__suggest
		}
		this.__super();
		delete this.__sopt.input
	};
	p.__initXGui = function () {
		this.__seed_css = f
	};
	p.__initNode = function () {
		this.__super();
		this.__sopt.body = this.__body
	};
	p.__onChange = function (e) {
		this._$dispatchEvent("onchange", e)
	};
	p.__onSelect = function (e, t) {
		this._$dispatchEvent("onselect", e, t)
	};
	p._$setList = function (e, t) {
		if (n._$isArray(e)) e = r._$get(h, {
			xlist: e
		});
		this.__body.innerHTML = e || "";
		this.__suggest._$setList(!t ? i._$getChildren(this.__body) : i._$getByClassName(this.__body, t))
	};
	if (!0) e.copy(e.P("nej.ui"), d);
	return d
}, "017b426dd2bb4315fa45d567a1fd3718", "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "8fd03edddb19cf8c294f56ca6638c475", "e30f9e8af4c2bb3cff9252a9e1c3e5da", "8a2da1cdb91a8851557f9465fe9c8248", "bff3d86ec4ea91399919ee4963badfeb", "71f2f52d2739fd2c36502fedbe60fa8b", "9bde6f7ef66f65825a0909c1cceed61a");
I$("d311422206de0b8499264964e9de72a8", function (e, t, i, n, s, a, r, o, c, d, _, l, u) {
	var f, h = /^[\w-\.@]*$/i;
	d._$$Input = e._$klass();
	f = d._$$Input._$extend(a._$$EventTarget);
	f.__init = function (e) {
		this.__super(e)
	};
	f.__destroy = function () {
		i._$remove(this.__clearBtn2, !0);
		this.__clearBtn2 = null;
		this.__saveInputValue = null;
		this.__focusTimeout = clearTimeout(this.__focusTimeout);
		this.__blurTimeout = clearTimeout(this.__blurTimeout);
		n._$clearEvent(this.__input);
		n._$clearEvent(this.__label);
		if (this.haomasto) this.haomasto = clearTimeout(this.haomasto);
		this.__super()
	};
	f.__reset = function (e) {
		this.__super(e);
		this.__opts = e.opts || {};
		this.__input = e.node;
		this.__form = e.form;
		this.__isLogin = e.isLogin || 0;
		this.__inputBox = r._$getParent(this.__input, "inputbox");
		this.__clearBtn = i._$getByClassName(this.__inputBox, "u-tip")[0];
		this.__pwdtext = i._$get("pwdtext");
		this.__needClose = e.needClose;
		this.__isUsername = e.isUsername;
		this.__domain = e.domain;
		this.__needEye = this.__opts.needEye;
		this.__mailRegHasEye = this.__opts.mailRegHasEye;
		if (this.__isLogin && this.__needEye || !this.__isLogin && this.__mailRegHasEye) this.__hasEye = e.isPwd;
		else this.__hasEye = 0; if (!this.__clearBtn2 && this.__hasEye) this.__createEyeNode();
		this.__enterNode = e.enterNode;
		this.__label = i._$getByClassName(this.__inputBox, "u-label")[0];
		var t = this.__supportPH();
		var n = i._$dataset(this.__input, "placeholder");
		if (this.__label)
			if (!t) i._$delClassName(this.__label, "f-dn");
			else {
				i._$addClassName(this.__label, "f-dn");
				i._$attr(this.__input, "placeholder", n);
				if (this.__pwdtext) {
					var s = i._$dataset(this.__pwdtext, "placeholder");
					i._$attr(this.__pwdtext, "placeholder", s)
				}
			}
		this.__initEvent();
		if (this.__isUsername) this.__initSuggest()
	};
	f.__createEyeNode = function () {
		if (this.__pwdtext) i._$setStyle(this.__pwdtext, "zIndex", -1);
		i._$addClassName(this.__clearBtn, "m-eye-close");
		var e = i._$create("div", "u-tip-eye m-eye u-pwdshow");
		e.innerHTML = c._$get("eye-tmp", {});
		this.__clearBtn2 = e;
		this.__clearBtn.insertAdjacentElement("beforeBegin", this.__clearBtn2)
	};
	f.__initEvent = function () {
		var e = [
			[this.__label, "click", this.__doFocus._$bind(this)],
			[this.__input, "focus", this.__onFocus._$bind(this)],
			[this.__input, "blur", this.__onBlur._$bind(this)],
			[this.__input, "input", this.__onInput._$bind(this, 0)],
			[this.__input, "keyup", this.__doEnter._$bind(this)]
		];
		if (window._$ISIOS && window && "ontouchend" in window) e.push([this.__input, "touchend", this.__doHackFocus._$bind(this)]);
		if (this.__hasEye) {
			e.push([this.__pwdtext, "blur", this.__onBlur._$bind(this)]);
			e.push([this.__pwdtext, "focus", this.__onFocus._$bind(this)]);
			e.push([this.__pwdtext, "input", this.__onInput._$bind(this, 1)]);
			e.push([this.__pwdtext, "keyup", this.__doEnter._$bind(this)]);
			e.push([this.__clearBtn2, "click", this.__onEye._$bind(this)]);
			e.push([this.__clearBtn, "click", this._$onClear._$bind(this, 2)]);
			if (window._$ISIOS && window && "ontouchend" in window) e.push([this.__pwdtext, "touchend", this.__doHackFocus._$bind(this)])
		} else if (this.__needClose) e.push([this.__clearBtn, "click", this._$onClear._$bind(this, 2)]);
		this.__doInitDomEvent(e)
	};
	f.__doHackFocus = function (e) {
		try {
			if (document.activeElement && e && document.activeElement === e.target) {
				window.focus();
				setTimeout(function () {
					e.target.focus()
				}, 0)
			}
		} catch (t) { }
	};
	f.__supportPH = function () {
		var e = t._$KERNEL;
		if ("trident" == e.engine && parseInt(e.release, 10) <= 5) return 0;
		else return 1
	};
	f.__doEnter = function (e) {
		var t = n._$getElement(e),
			i = t.name;
		if ("password" == i && 13 != e.keyCode) this._$dispatchEvent("onPwdKeyUp");
		if (13 == e.keyCode) n._$dispatchEvent(this.__enterNode, "click")
	};
	f.__onEye = function () {
		var e;
		if (!this.__pwdtext.disabled)
			if (i._$hasClassName(this.__clearBtn2, "eyeactive")) {
				e = this.__pwdtext.value;
				i._$delClassName(this.__clearBtn2, "eyeactive");
				i._$setStyle(this.__pwdtext, "zIndex", -1);
				this.__input.value = e;
				try {
					this.__input.focus()
				} catch (t) { }
				this.__moveToEnd(this.__input)
			} else {
				e = this.__input.value;
				this.__setPwdText(e);
				i._$addClassName(this.__clearBtn2, "eyeactive");
				i._$setStyle(this.__pwdtext, "zIndex", 1);
				try {
					this.__pwdtext.focus()
				} catch (t) { }
				this.__moveToEnd(this.__pwdtext)
			}
	};
	f.__moveToEnd = function (e) {
		var t;
		var i = e.value.length;
		if (e.createTextRange) {
			t = e.createTextRange();
			t.moveStart("character", i);
			t.collapse(!0);
			t.select()
		}
	};
	f.__setPwdText = function (e) {
		this.__pwdtext.value = e
	};
	f.__doFocus = function () {
		try {
			if (i._$hasClassName(this.__clearBtn2, "eyeactive")) this.__pwdtext.focus();
			else this.__input.focus()
		} catch (e) { }
	};
	f.__onFocus = function () {
		if (this.__blurTimeout) this.__blurTimeout = clearTimeout(this.__blurTimeout);
		this._$dispatchEvent("onClearInptTimeout", this.__input);
		var e;
		if (this.__pwdtext && i._$hasClassName(this.__input, "dlpwd")) {
			e = i._$getStyle(this.__pwdtext, "zIndex");
			if ("1" === e) try {
				this.__pwdtext.focus()
			} catch (t) { }
		}
		i._$replaceClassName(this.__inputBox, "error-color", "active");
		if ("password" == this.__input.id && !this.__firstFocus) {
			this.__input.value = "";
			this.__firstFocus = 1
		}
		if (this.__clearBtn && this.__needEye && "" != this.__input.value) i._$setStyle(this.__clearBtn, "display", "block");
		this.__focusTimeout = setTimeout(function () {
			this._$dispatchEvent("onfocus", this.__input)
		}._$bind(this), window._$inputTime)
	};
	f.__onBlur = function () {
		r._$tryWeixinResize();
		if (this.__focusTimeout) this.__focusTimeout = clearTimeout(this.__focusTimeout);
		this._$dispatchEvent("onClearInptTimeout", this.__input);
		this.__blurTimeout = setTimeout(function () {
			var e = i._$dataset(this.__input, "loginname");
			if ("loginEmail" == e) this.__input.value = r._$emailFilter(this.__input.value);
			var t = this.__form._$checkValidity(this.__input);
			i._$delClassName(this.__inputBox, "active");
			if (this.__clearBtn && this.__needEye) i._$setStyle(this.__clearBtn, "display", "none");
			this._$dispatchEvent("onstate", t, this.__input)
		}._$bind(this), window._$inputTime)
	};
	f.__onInput = function (e) {
		var t = this.__input;
		if (e) this.__input.value = this.__pwdtext.value;
		var n = (t.value || "").length;
		if (this.__needClose) i._$setStyle(this.__clearBtn, "display", n > 0 ? "block" : "none");
		if (n > 0) this.__label.style.display = "none";
		else if (0 == n) this.__label.style.display = "block";
		this._$dispatchEvent("onInput", t, 1)
	};
	f.__initSuggest = function () {
		var e = [".888", "520.", "-666"];
		var t = function (t, i, n) {
			var s, a, o, c;
			var d = r._$HtmlEncode(t + i);
			if (n) {
				c = e.shift();
				if ("520." === c) s = c + t;
				else s = t + c;
				a = r._$HtmlEncode(s + i);
				a = a.replace(c, '<span style="color:red;">' + c + "</span>");
				o = '<div class="itm" data-value=' + d + " data-ishaoma=1>" + a + "</div>"
			} else o = '<div class="itm" data-value=' + d + ">" + d + "</div>";
			return o
		};
		var a = function (n) {
			var a = [];
			e = [".888", "520.", "-666"];
			if (h.test(n)) {
				if (n.indexOf("@") == -1) s._$forEach(this.__suffix, function (e) {
					var i, r;
					if (!s._$isString(e)) {
						i = e.domain;
						r = !!e.ishaoma
					} else i = e;
					var o = t(n, i, r);
					a.push(o)
				});
				else {
					var r = n.split("@"),
						o = r[0],
						c = r[1];
					if (n.match(/@/g).length > 1) a = [];
					else if (!c) s._$forEach(this.__suffix, function (e) {
						var i, r;
						if (!s._$isString(e)) {
							i = e.domain;
							r = !!e.ishaoma
						} else i = e;
						i = i.split("@")[1];
						var o = t(n, i, r);
						a.push(o)
					});
					else if (c.indexOf(".com") > -1) a = [];
					else s._$forEach(this.__suffix, function (e) {
						var i, n;
						if (!s._$isString(e)) {
							i = e.domain;
							n = !!e.ishaoma
						} else i = e; if (1 == i.indexOf(c)) {
							var r = t(o, i, n);
							a.push(r)
						}
					})
				} if (a[0]) a[0] = a[0].replace('class="itm"', 'class="itm js-selected"');
				this.__suggest._$setList(a.join(""));
				i._$get("account-box").style.zIndex = "500"
			} else this.__suggest._$setList(a.join(""))
		};
		var c = function (e, t) {
			if (!window.outlinkflag) {
				var n = t.event;
				if (n && "1" == i._$dataset(n.target, "ishaoma")) this.haomasto = setTimeout(function () {
					var e = ["https://haoma.163.com/?from=webzjzca", "pd=" + encodeURIComponent(window._$URSOPT.product), "pkid=" + encodeURIComponent(window._$URSOPT.promark)].join("&");
					window.open(e)
				}._$bind(this), 100);
				i._$get("account-box").style.zIndex = "0";
				this.__suggest._$setList([]);
				this._$dispatchEvent("onClearEmailTimeout");
				if (!this.__checkIpt(e, "email")) r._$showError(this.__input, "帐号格式错误", "nerror");
				else r._$removeError(this.__input, "nerror"); if (window.$autoFocus) this._$dispatchEvent("onFocusNext")
			}
		};
		var d = function () {
			i._$get("account-box").style.zIndex = "1"
		};
		return function () {
			this.__suffix = this.__suffix || ["@163.com", "@126.com", "@yeah.net", "@188.com", "@vip.163.com", "@vip.126.com"];
			if (this.__suggest) this.__suggest = o._$$Suggest._$recycle(this.__suggest);
			var e = r._$getParent(this.__input, "u-input");
			if (!this.__suggest) {
				n._$delEvent(this.__input, "blur", d);
				n._$addEvent(this.__input, "blur", d);
				this.__suggest = o._$$Suggest._$allocate({
					parent: e,
					clazz: "m-sug",
					input: this.__input,
					autofill: !1,
					onchange: a._$bind(this),
					onselect: c._$bind(this)
				})
			}
		}
	}();
	f.__checkIpt = function () {
		var e = {
			email: /^[\w-\.]+@(?:[\w-]+\.)+[a-z]{2,6}$/i
		};
		return function (t, i) {
			t = t.trim();
			return e[i].test(t)
		}
	}();
	f._$showCloseBtn = function () {
		if (!this.__needEye) i._$setStyle(this.__clearBtn, "display", "block")
	};
	f._$hideCloseBtn = function () {
		i._$setStyle(this.__clearBtn, "display", "none")
	};
	f._$setSuggest = function (e) {
		this.__suffix = e;
		this.__initSuggest()
	};
	f._$hideLabel = function () {
		this.__label.style.display = "none"
	};
	f._$onClear = function (e) {
		var t;
		if (!this.__input.disabled) {
			this.__input.value = "";
			this.__clearBtn.style.display = "none";
			if (this.__clearBtn2 && this.__hasEye)
				if (this.__pwdtext) this.__pwdtext.value = "";
			this.__label.style.display = "block";
			if ("2" == e) try {
				this.__input.focus();
				if (this.__pwdtext) {
					t = i._$getStyle(this.__pwdtext, "zIndex");
					if ("1" === t) this.__pwdtext.focus()
				}
			} catch (s) { }
			n._$stop(e);
			this._$dispatchEvent("onInput", this.__input)
		}
	}
}, "4600f25ee05ffacd81f2d44da00eaaa7", "a878c0216188111f46d39b9df767b354", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "e0793c838b68fed5a7e1742035643bec", "a4de926c2d79e8d8f856eaff4dac0f8b", "f07c4a98a7ab2c8b7667423915976e60", "bff3d86ec4ea91399919ee4963badfeb");
I$("858cadb3921bea0353a4bf7f1c9e7759", function (e, t, i, n, s, a, r, o, c, d, _, l, u, f, h, p, m) {
	var g, b, v = {
		email: /^[\w-\.]+@(?:[\w-]+\.)+[a-z]{2,6}$/i,
		sms: /^[0-9a-zA-Z]{4}$/,
		pwd: /^[0-9a-zA-Z]{6,16}$/
	}, $ = "https://reg.163.com/naq/findPassword";
	f._$$Login = e._$klass();
	g = f._$$Login._$extend(r._$$Module);
	g.__init = function (e) {
		this.enlang = window._$URSOPT.enlang;
		this.__setTimeoutList = {};
		this.__opts = e.opts || {};
		this.__mailloginclauselist = [];
		if (this.__opts.mailloginclause && this.__opts.mailloginclause.list) this.__mailloginclauselist = this.__opts.mailloginclause.list;
		this.__imgRefreshTip = this.__opts.imgRefreshTip || 0;
		this.__needEye = this.__opts.needEye || 0;
		this.__domainSuffixs = this.__opts.domainSuffixs || "";
		this.__lazyCheck = this.__opts.lazyCheck || 0;
		this.__domainSuffixs = this.__domainSuffixs ? this.__domainSuffixs.split(",") : ["@163.com", "@126.com", "@yeah.net", "@188.com", "@vip.163.com", "@vip.126.com"];
		this.__placeholder = this.__opts.placeholder || {};
		this.__btnTxt = this.__opts.loginText || "";
		this.__domain = this.__opts.prdomain || "";
		if (this.__opts.prdomain) this.__domainSuffixs = "";
		this.__onlyPhone = this.__opts.onlyPhone || 0;
		this.__swidth = this.__opts.swidth || 320;
		if (c._$notURL(this.__opts.forgetpwdlink)) this.__opts.forgetpwdlink = "";
		this.__forgetpwdlink = this.__opts.forgetpwdlink || $;
		this.__forgetPwdText = this.__opts.forgetPwdText || u.showText("忘记密码？", this.enlang);
		this.__agreeText = this.__opts.agreeText || u.showText("我同意", this.enlang);
		this.__andText = this.__opts.andText || u.showText("和", this.enlang);
		this.__unLoginText = this.__opts.unLoginText || u.showText("十天内免登录", this.enlang);
		this.__server = "captcha.reg.163.com/v2";
		if (this.__opts.productKey) this.__opts.productkey = this.__opts.productKey;
		this.__productkey = this.__opts.productkey;
		this.__hintTxt = this.__opts.hintTxt || u.showText("按住滑块，拖动完成上方拼图", this.enlang);
		this.__errMsg = c._$HtmlEncode(this.__opts.errMsg || "");
		this.__gotoRegText = this.__opts.gotoRegText || u.showText("去注册", this.enlang);
		this.__clazz = 1 == this.enlang ? "m-email-login-container" : "";
		this.__super()
	};
	g.__slideVerify = function (e) {
		e.value = e.validate;
		if (e && e.value) this._$verifyCap(e);
		else this.__cbVftcpEx()
	};
	g.__reset = function (e) {
		this.__ipts = [];
		this.__product = this.__opts.product || "";
		this.__pkid = this.__opts.promark || "";
		this.__super(e);
		this.__resetInput();
		this.__imgLock = 0;
		this._$hideCheckCode();
		this.codeTryTime = 0;
		this.__aicapstate = !1
	};
	g.__resetInput = function () {
		if (this.__nameinput) {
			this.__nameinput.disabled = !1;
			this.__nameinput.value = ""
		}
		if (this.__passwordinput) {
			this.__passwordinput.disabled = !1;
			this.__passwordinput.value = ""
		}
		if (this.__smscode) {
			this.__smscode.disabled = !1;
			this.__smscode.value = ""
		}
		if (this.__pwdtext) {
			this.__pwdtext.disabled = !1;
			this.__pwdtext.value = ""
		}
	};
	g.__destroy = function () {
		var e = this.__nameinput.value.trim();
		e = this.__domain ? c._$formatUn(e) + this.__domain : e;
		window._$URS.saveTempEmail = e;
		c._$removeError3();
		this.__super()
	};
	g.__initNode = function () {
		this.__super();
		this.__checkCode = t._$getByClassName(this.__body, "ckbox")[0];
		this.__slideCapBox = t._$getByClassName(this.__body, "slidebox")[0];
		this.__cdImg = t._$getByClassName(this.__body, "ckimg")[0];
		this.__cklink = t._$getByClassName(this.__body, "j-cklink")[0];
		this.__olist = t._$getByClassName(this.__body, "olist")[0];
		this.__footer = t._$getByClassName(document, "m-footer")[0];
		this.__loginBtn = t._$getByClassName(this.__body, "u-loginbtn")[0];
		this.__fgpwdLink = t._$getByClassName(this.__body, "j-fglink")[0]
	};
	g.__initXGui = function () {
		var e = this.__parseOauth();
		var t = u.showText("登&nbsp;&nbsp;录", this.enlang);
		if (this.__btnTxt) t = c._$HtmlEncode(this.__btnTxt);
		b = s._$addNodeTemplate(a._$get("login-tmp", {
			clazz: this.__clazz || "",
			config: e || [],
			btnTxt: t,
			gotoRegText: this.__gotoRegText,
			unLoginText: this.__unLoginText,
			forgetText: this.__forgetPwdText,
			forgetpwdlink: this.__forgetpwdlink,
			imgRefreshTip: this.__imgRefreshTip,
			mailloginclause: this.__mailloginclauselist,
			agreeText: this.__agreeText,
			andText: this.__andText,
			isVersionFour: c._$isVersionFour(),
			emailPlaceholder: u.showText("请输入邮箱地址", this.enlang),
			pwdPlaceholder: u.showText("请输入密码", this.enlang),
			imageCode: u.showText("验证码", this.enlang),
			imgCodeRefresh: u.showText("点击刷新验证码", this.enlang),
			imgCodeGet: u.showText("点击获取验证码", this.enlang),
			imgPicGet: u.showText("点击刷新图片", this.enlang),
			otherLoginTxt: u.showText("其他方式登录", this.enlang)
		}));
		this.__seed_html = b
	};
	g.__parseOauth = function () {
		return c._$parseOauth()
	};
	g.__initEvent = function () {
		this.__inputs = t._$getByClassName(this.__body, "j-inputtext");
		if (this.__needEye) this.__pwdtext = t._$get("pwdtext");
		this.__nameinput = this.__inputs[0];
		this.__passwordinput = this.__inputs[1];
		this.__smscode = this.__inputs[2];
		var e;
		if (0 === this.__ipts.length) {
			this.__setPlaceHolder();
			n._$forEach(this.__inputs, function (t, i) {
				var n = {
					opts: this.__opts,
					node: t,
					isLogin: 1,
					form: this.__form,
					needClose: 1,
					onstate: this.__onState._$bind(this),
					onfocus: this.__onFocus._$bind(this),
					onInput: this.__onInput._$bind(this),
					onPwdKeyUp: this.__onPwdKeyUp._$bind(this),
					onFocusNext: this.__onFocusNext._$bind(this),
					onClearInptTimeout: this.__onClearInptTimeout._$bind(this)
				};
				if (!i)
					if (this.__onlyPhone) {
						n.isUsername = 0;
						n.domain = "@163.com"
					} else {
						n.isUsername = this.__domain ? 0 : 1;
						n.domain = this.__domain
					}
				if (1 == i) n.isPwd = 1;
				e = d._$$Input._$allocate(n);
				if (!i && this.__domainSuffixs && this.__domainSuffixs.length > 0) e._$setSuggest(this.__domainSuffixs);
				this.__ipts.push(e)
			}._$bind(this))
		}
		var i = [
			[this.__cdImg, "click", this._$getCheckCode._$bind(this)],
			[this.__olist, "click", this._$doThirdLogin._$bind(this)],
			[this.__fgpwdLink, "click", this._$fgpwdLinkClick._$bind(this)]
		];
		if (this.__cklink) i.push([this.__cklink, "click", this._$getCheckCode._$bind(this)]);
		this.__doInitDomEvent(i)
	};
	g.__onState = function (e, i) {
		var n = i && t._$dataset(i, "loginname");
		var s = i.value;
		if ("loginEmail" === n) this.__sendMsg({
			type: "loginEmailValue",
			value: s
		})
	};
	g._$doThirdLogin = function (e) {
		c._$doThirdLogin(e)
	};
	g.__onPwdKeyUp = function () {
		this._$dispatchEvent("onPwdKeyUp")
	};
	g.__onFocusNext = function () {
		this._stopEnter = 1;
		try {
			this.__inputs[1].focus()
		} catch (e) { }
	};
	g.__onFocus = function (e) {
		c._$removeError(e, "nerror")
	};
	g.__onClearInptTimeout = function (e) {
		var t = e.name;
		if (this.__setTimeoutList["invalid" + t]) this.__setTimeoutList["invalid" + t] = clearTimeout(this.__setTimeoutList["invalid" + t]);
		if (this.__setTimeoutList["valid" + t]) this.__setTimeoutList["valid" + t] = clearTimeout(this.__setTimeoutList["valid" + t])
	};
	g.__initForm = function () {
		if (!this.__form) this.__form = o._$$WebForm._$allocate({
			form: "login-form",
			domain: this.__domain || null,
			onlyPhone: this.__onlyPhone || 0,
			oninvalid: function (e) {
				var n = "请输入",
					s = e.code,
					a = i._$getElement(e),
					r = a.name;
				if (!window.outlinkflag) {
					this.__clearTimeout(r);
					if ("checkcode" == r && t._$hasClassName(this.__checkCode, "f-dn") && this.__needSlideCap) e.ignore = 1;
					this.__setTimeoutList["invalid" + r] = setTimeout(function (i) {
						var r = i;
						if ("checkcode" != r || !t._$hasClassName(this.__checkCode, "f-dn"))
							if ("slidecap" != r || !this.__needSlideCap) {
								if (s == -1) {
									if ("email" == r) {
										n += "帐号";
										if (this.__onlyPhone) n = "手机号输入有误"
									} else if ("password" == r) n += "密码";
									else if ("checkcode" == r) n = "请输入图片验证码"
								} else if (s == -4 || s == -2 || s == -3) {
									n = "格式错误";
									if ("email" == r) {
										n = "帐号" + n;
										if (this.__onlyPhone) n = "手机号输入有误"
									} else if ("password" == r) n = "密码" + n;
									else if ("checkcode" == r) n = "请输入图片验证码"
								}
								if ("slidecap" == r && !this.__needSlideCap) this.__states[r] = 0;
								else this.__states[r] = 1;
								n = u.showText(n, this.enlang);
								if (s != -1) this.__checkList(a, n)
							} else if (!this.__vSlide()) this.__states["slidecap"] = 0;
							else this.__states["slidecap"] = 1;
						else {
							if (this.__needSlideCap) e.ignore = 1;
							this.__states[r] = 0
						}
					}._$bind(this, r), 100);
					e.stopped = !0
				} else if (!this.__refocus && 1 == window.outlinkflag) this.__refocus = setTimeout(function () {
					this.__refocus = clearTimeout(this.__refocus);
					try {
						a.focus()
					} catch (e) { }
				}._$bind(this), 200)
			}._$bind(this),
			onvalid: function (e) {
				var t = i._$getElement(e),
					n = t.name;
				this.__clearTimeout(n);
				this.__setTimeoutList["valid" + n] = setTimeout(function (e) {
					var i = e;
					this.__states[i] = 0;
					this.__hideErrorList(t)
				}._$bind(this, n), 100);
				e.stopped = !0
			}._$bind(this)
		})
	};
	g.__clearTimeout = function (e) {
		if (this.__setTimeoutList["invalid" + e]) this.__setTimeoutList["invalid" + e] = clearTimeout(this.__setTimeoutList["invalid" + e]);
		if (this.__setTimeoutList["valid" + e]) this.__setTimeoutList["valid" + e] = clearTimeout(this.__setTimeoutList["valid" + e])
	};
	g.__hideErrorList = function (e) {
		var i = e.name;
		if ("email" == i) {
			var n = e.value.indexOf("@") != -1 ? e.value.substring(e.value.indexOf("@")).toLocaleLowerCase() : this.__domain;
			if (!n) n = e.value;
			_gaq.push(["_trackEvent", "登录步骤", "【1】帐号输入", "输入成功：" + n])
		} else if ("password" == i) _gaq.push(["_trackEvent", "登录步骤", "【2】密码输入", "输入" + (e.value || "").length + "位密码"]);
		else if ("checkcode" == i && !t._$hasClassName(this.__checkCode, "f-dn")) {
			this.codeTryTime = this.codeTryTime ? this.codeTryTime + 1 : 1;
			_gaq.push(["_trackEvent", "登录步骤", "【3】验证码输入", "图片验证码校验成功,尝试次数：" + this.codeTryTime])
		}
	};
	g.__checkStatus = function (e) {
		var i = e.name;
		if ("password" == i) {
			if (this.__states["email"] && "" != this.__nameinput.value) return
		} else if ("checkcode" == i && !t._$hasClassName(this.__checkCode, "f-dn"))
			if (this.__states["password"] && "" != this.__passwordinput.value || this.__states["email"] && "" != this.__nameinput.value) return;
		return 1
	};
	g.__checkList = function (e, t) {
		if (this.__checkStatus(e)) c._$showError(e, t, "nerror");
		else c._$showError2(e, t, "nerror", 1)
	};
	g.__onInput = function (e) {
		setTimeout(this.__checkNextBtn._$bind(this, e), 50)
	};
	g.__checkNextBtn = function (e) {
		var t = this.__vName();
		var i = this.__vPwd();
		var n = this.__vSms();
		var s = this.__vSlide();
		if (e && "checkcode" == e.name) {
			var a = this.__smscode.value.trim();
			this.__smscodeValue = a;
			if (v["sms"].test(a) && !this.__lazyCheck) this.__doCheckSmsCode(a)
		}
		if (!this.__needSlideCap && !this.__needCheckCode)
			if (!t && !i) this._$dispatchEvent("ondisabled", 0);
			else this._$dispatchEvent("ondisabled", 1);
		else if (this.__needSlideCap)
			if (!t && !i && !s) this._$dispatchEvent("ondisabled", 0);
			else this._$dispatchEvent("ondisabled", 1);
		else if (this.__needCheckCode)
			if (!t && !i && !n) this._$dispatchEvent("ondisabled", 0);
			else this._$dispatchEvent("ondisabled", 1)
	};
	g.__vSms = function () {
		var e = this.__smscode.value.trim();
		if (v["sms"].test(e)) return 0;
		else return 1
	};
	g.__doCheckSmsCode = function (e) {
		if (!this.__checkSmsCodeLock) {
			this.__checkSmsCodeLock = 1;
			var t = this.__nameinput.value.trim();
			t = this.__domain ? c._$formatUn(t) + this.__domain : t;
			var i = {
				cap: e,
				pd: this.__product,
				pkid: this.__pkid
			};
			i.un = t;
			if (this.__onlyPhone) i.mbl = 1;
			_._$request("checkSmsCode", i, this.__cbSmsCode._$bind(this), this.__ckSmsCodeExCb._$bind(this, u.showText("验证码输入错误", this.enlang)), 1, this.__product)
		}
	};
	g.__ckSmsCodeExCb = function (e, t) {
		if (!c._$fail5("maillogin")) this.__ckSmsCodeEx(e, t)
	};
	g.__cbSmsCode = function () {
		this.__checkSmsCodeLock = 0;
		this.__imgLock = 1;
		this.__smscode.disabled = !0;
		this.__ipts[2]._$hideCloseBtn();
		t._$getByClassName(document, "u-tip")[3].style.display = "block";
		c._$removeError(this.__smscode, "nerror")
	};
	g.__ckSmsCodeEx = function (e, t) {
		var i, s = 1 == e ? !0 : !1;
		this.codeTryTime = this.codeTryTime ? this.codeTryTime + 1 : 1;
		this.__checkSmsCodeLock = 0;
		if (t) {
			i = t.ret;
			if (n._$indexOf(["441", "444", "445", "447"], i) !== -1) {
				this.__autoVerify = "447" == i ? !0 : !1;
				if (t.forceNoAuto) this.__autoVerify = !1;
				this.__changeCapTypeByCode(i)
			} else this.__refreshImgCap(i);
			this.__slideErrShow(i, s)
		} else this.__refreshImgCap(i)
	};
	g.__refreshImgCap = function (e) {
		this.__needCheckCode = 1;
		this._$getCheckCode();
		this.__ipts[2]._$onClear();
		this._$dispatchEvent("ondisabled", 1);
		var t = u.showText(l[e], this.enlang) || c._$getErrorTxt(e) || u.showText("验证码输入错误", this.enlang);
		c._$showError(this.__smscode, t, "nerror")
	};
	g.__vName = function () {
		var e = this.__nameinput.value.trim();
		if ("" !== e) return 0;
		else return 1
	};
	g.__vPwd = function () {
		var e = this.__passwordinput.value.trim();
		if ("" !== e) return 0;
		else return 1
	};
	g._$setUsername = function (e) {
		try {
			if (e) this._$hideLabel();
			this.__inputs[0].value = e;
			this.__ipts[0]._$showCloseBtn()
		} catch (t) { }
	};
	g._$setUsernameDis = function () {
		var e = t._$get("account-box");
		t._$addClassName(e, "inputbox-disabled");
		this.__inputs[0].disabled = "disabled"
	};
	g._$setPwd = function (e) {
		try {
			if (e) this._$hideLabel(1);
			this.__inputs[1].value = e;
			this.__ipts[1]._$showCloseBtn();
			if (this.__pwdtext) this.__pwdtext.value = e
		} catch (t) { }
	};
	g._$showCheckCode = function () {
		this.__cf = 1;
		this.__checkSmsCodeLock = 0;
		this._$hideCheckCode();
		this.__states["checkcode"] = 1;
		this.__needCheckCode = 1;
		t._$delClassName(this.__checkCode, "f-dn");
		this.__imgLock = 0;
		this.__smscode.disabled = !1;
		this._$getCheckCode();
		this.__ipts[2]._$onClear();
		this._$dispatchEvent("ondisabled", 1);
		this.__checkNextBtn();
		var e = t._$get("cnt-box-parent");
		t._$addClassName(e, "hascheckcode");
		setTimeout(function () {
			c._$resize()
		}, 200)
	};
	g._$doFocus = function (e) {
		try {
			if ("pwd" == e) this.__passwordinput.focus();
			if ("username" == e) this.__nameinput.focus()
		} catch (t) { }
	};
	g._$getCheckCode = function () {
		if (!this.__imgLock) {
			this.__cdImg.src = MP["getCaptchaLogin"](this.__product, this.__pkid, window["$cookieDomain"]);
			t._$getByClassName(document, "u-tip")[3].style.display = "none"
		}
	};
	g._$hideLabel = function (e) {
		if (1 === e) this.__ipts[1]._$hideLabel();
		else this.__ipts[0]._$hideLabel()
	};
	g.$clearText = function (e) {
		e.value = ""
	};
	g.__unLockLogin = function () {
		this._$dispatchEvent("onUnLockLogin")
	};
	g.__doLockLogin = function () {
		this._$dispatchEvent("onDoLockLogin")
	};
	g._$verifyCap = function (e) {
		var t;
		if (!this.__slideCapLock) {
			this.__slideCapLock = 1;
			var i = {};
			var n = this.__nameinput.value.trim();
			n = this.__domain ? c._$formatUn(n) + this.__domain : n;
			i.un = n;
			if (this.__onlyPhone) i.mbl = 1;
			i.capkey = this.__productkey;
			i.pd = this.__product;
			i.pkid = this.__pkid;
			i = this.__newVerifyCap(i, e);
			if (4 === this.__slideTarget) {
				t = "vfscp";
				_._$request(t, i, this.__cbVfscp._$bind(this), this.__cbVfscpEx._$bind(this), 1)
			} else {
				t = 2 == this.__slideTarget ? "vftcp" : "vfccp";
				_._$request(t, i, this.__cbVftcp._$bind(this), this.__cbVftcpEx._$bind(this), 1)
			}
		}
	};
	g.__cbVfscp = function () {
		this.__unlockVfcap("ainounlock");
		this.__aicapstate = !0;
		this.__loginBtn.click()
	};
	g.__cbVfscpEx = function (e) {
		var t;
		this.__unlockVfcap();
		this.__aicapstate = !1;
		if (e) {
			if (c._$fail5("maillogin")) return;
			t = e.ret;
			if (n._$indexOf(["441", "444", "445"], t) !== -1) this.__changeCapTypeByCode(t);
			else if ("447" == t) this.__aiSlideErrShow();
			else {
				this.__autoVerify = !1;
				this.__slideErrShowDefAndRefresh(t)
			}
			this.__slideErrShow(t)
		} else this.__aiSlideErrShow()
	};
	g._$getSmsValue = function () {
		return this.__smscodeValue
	};
	g._$clearPwd = function (e) {
		this.__ipts[1]._$onClear(e)
	};
	g._$focusHelper = function () {
		try {
			this.__nameinput.focus()
		} catch (e) { }
	};
	g._$fgpwdLinkClick = function (e) {
		if (this.__fgpwdLink && this.__fgpwdLink.href === $) {
			var t = this.__nameinput.value.trim();
			t = this.__domain ? c._$formatUn(t) + this.__domain : t;
			if (t && v.email.test(t)) {
				i._$stop(e);
				t = encodeURIComponent(t);
				var n = [$, "?username=", t].join("");
				window.open(n)
			}
		}
	}
}, "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "12c5dab742044e15807978f676f5c3fc", "bff3d86ec4ea91399919ee4963badfeb", "ef328f7ca95c06d61f18782bd6ac5271", "20a53a78a8e132ee6b99f8e237d5d673", "a4de926c2d79e8d8f856eaff4dac0f8b", "d311422206de0b8499264964e9de72a8", "53c267efd983fb8c66cb645beead7a8d", "285e64765191768caf2cc6de0397e37c", "46a4de3a50f50a600950ca9cee88031e");
I$("56eb089afee6bce0764df69e2c34d644", function (e, t, i, n, s, a, r, o, c, d) {
	a._$$SelectHelper = t._$klass();
	d = a._$$SelectHelper._$extend(s._$$EventTarget);
	d.__reset = function (e) {
		this.__super(e);
		this.__loop = !!e.loopable;
		this.__parent = i._$get(e.parent);
		this.__selected = e.selected || "js-selected";
		this.__hovered = e.hover || this.__selected;
		this.__nopt = {};
		if (e.clazz) {
			this.__nopt.filter = i._$hasClassName._$bind2(i, e.clazz);
			this.__clazz = e.clazz
		}
		this.__kbody = this.__getKeyBoardParent(this.__parent);
		this.__doInitDomEvent([
			[this.__kbody, "keydown", this.__doCheckKBAction._$bind(this), !0],
			[this.__kbody, "enter", this.__doCheckKBEnter._$bind(this)],
			[this.__parent, "click", this.__onCheckClick._$bind(this)],
			[this.__parent, "mouseover", this.__onCheckHover._$bind(this)],
			[this.__parent, "mouseleave", this.__onCheckLeave._$bind(this)]
		])
	};
	d.__destroy = function () {
		this.__super();
		delete this.__selected;
		delete this.__hovered;
		delete this.__parent;
		delete this.__kbody;
		delete this.__clazz;
		delete this.__nopt;
		delete this.__loop
	};
	d.__isItemElement = function (e) {
		if (this.__clazz) return i._$hasClassName(e, this.__clazz);
		else return e.parentNode == this.__parent
	};
	d.__getKeyBoardParent = function () {
		var e = 1e3;
		return function (t) {
			for (; t && (parseInt(t.tabIndex) || 0) <= e;) t = t.parentNode;
			return t || document
		}
	}();
	d.__getItemElement = function (e) {
		var t = i._$getByClassName(this.__parent, e);
		return !t ? null : t[0]
	};
	d.__doSyncSelection = function (e, t) {
		i._$delClassName(e.last, t);
		i._$addClassName(e.target, t);
		if (t == this.__selected && e.last != e.target) {
			this.__doScrollToView(e.target);
			this._$dispatchEvent("onchange", e)
		}
	};
	d.__doScrollToView = function (e) {
		var t = i._$getScrollViewPort(e),
			n = i._$offset(e, t);
		if (!(n.y - t.scrollTop < 0)) {
			var s = n.y + e.offsetHeight - t.clientHeight;
			if (s > t.scrollTop) t.scrollTop = s
		} else t.scrollTop = n.y
	};
	d.__doParseSelection = function (e, t) {
		var i = n._$getElement(e, this.__isItemElement._$bind(this));
		return !i ? null : {
			last: this.__getItemElement(t),
			target: i
		}
	};
	d.__doCheckKBAction = function (e) {
		var t = e.keyCode;
		if (38 == t || 40 == t) {
			n._$stop(e);
			var s = {
				last: this._$getSelectedNode()
			};
			this.__nopt.backward = 38 == t;
			var a = !this.__clazz ? i._$getChildren(this.__parent) : i._$getByClassName(this.__parent, this.__clazz),
				r = this.__nopt.backward ? a[a.length - 1] : a[0];
			if (!s.last) s.target = this.__getItemElement(this.__hovered) || r;
			else s.target = i._$getSibling(s.last, this.__nopt); if (!s.target) {
				if (!this.__loop || a.length <= 1) return;
				s.target = r
			}
			this.__doSyncSelection(s, this.__selected)
		}
	};
	d.__doCheckKBEnter = function (e) {
		n._$stop(e);
		this._$dispatchEvent("onselect", {
			enter: !0,
			target: this._$getSelectedNode()
		})
	};
	d.__onCheckClick = function (e) {
		n._$stop(e);
		var t = this.__doParseSelection(e, this.__selected);
		if (t) {
			this.__doSyncSelection(t, this.__selected);
			this._$dispatchEvent("onselect", {
				target: t.target
			})
		}
	};
	d.__onCheckHover = function (e) {
		var t = this.__doParseSelection(e, this.__hovered);
		if (t) {
			this.__doSyncSelection(t, this.__hovered);
			if (this.__kbody.focus) this.__kbody.focus()
		}
	};
	d.__onCheckLeave = function (e) {
		if (this.__hovered != this.__selected) i._$delClassName(this.__getItemElement(this.__hovered), this.__hovered)
	};
	d._$getSelectedNode = function () {
		return this.__getItemElement(this.__selected)
	};
	if (!0) e.copy(e.P("nej.ut"), a);
	return a
}, "017b426dd2bb4315fa45d567a1fd3718", "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a100971a16ec757a0282a3b2cc059019", "e0793c838b68fed5a7e1742035643bec");
I$("bc0f77dfcc9bde34f9fcbf32fdec36a8", function (e, t, i, n, s, a, r, o, c) {
	var d;
	a._$$Suggest = t._$klass();
	d = a._$$Suggest._$extend(n._$$EventTarget);
	d.__init = function () {
		this.__sopt = {
			loopable: !0,
			onselect: this.__onSelect._$bind(this),
			onchange: this.__onSelectionChange._$bind(this)
		};
		this.__super()
	};
	d.__reset = function (e) {
		this.__super(e);
		this.__auto = !!e.autofill;
		this.__input = i._$get(e.input);
		this.__sopt.clazz = e.clazz;
		this.__sopt.parent = i._$get(e.body);
		this.__sopt.selected = e.selected || "js-selected";
		this.__doInitDomEvent([
			[this.__input, "input", this.__onInput._$bind(this)],
			[this.__input, "focus", this.__onInput._$bind(this)]
		]);
		if (!e.noblur) this.__doInitDomEvent([
			[this.__input, "blur", this.__onBlur._$bind(this)]
		]);
		this._$visibile(!1);
		this.__helper = s._$$SelectHelper._$allocate(this.__sopt)
	};
	d.__destroy = function () {
		this.__super();
		if (this.__helper) {
			this.__helper._$recycle();
			delete this.__helper
		}
		delete this.__xxx;
		delete this.__input;
		delete this.__sopt.parent
	};
	d.__onBlur = function () {
		this.__onSelect({
			target: this.__helper._$getSelectedNode()
		})
	};
	d.__onInput = function () {
		var e = this.__input.value.trim();
		if (!e) this._$visibile(!1);
		else if (!this.__xxx) this._$dispatchEvent("onchange", e)
	};
	d.__doUpdateValue = function (e) {
		if (!this.__xxx) {
			this.__xxx = !0;
			if (e && e != this.__input.value) this.__input.value = e;
			this.__xxx = !1
		}
	};
	d.__onSelect = function (e) {
		if ("hidden" != i._$getStyle(this.__sopt.parent, "visibility")) {
			var t = i._$dataset(e.target, "value") || "";
			this.__doUpdateValue(t);
			t = t || this.__input.value;
			this._$update("");
			this._$dispatchEvent("onselect", t, {
				target: e.target,
				enter: e.enter,
				value: t
			})
		}
	};
	d.__onSelectionChange = function (e) {
		if (this.__auto) this.__doUpdateValue(i._$dataset(e.target, "value") || "")
	};
	d._$setList = function (e) {
		this._$visibile(!!e && e.length > 0)
	};
	d._$visibile = function (e) {
		var e = !e ? "hidden" : "visible";
		this.__sopt.parent.style.visibility = e;
		if ("hidden" === e) this.__sopt.parent.innerHTML = ""
	};
	d._$update = function (e) {
		this.__sopt.parent.innerHTML = e || "&nbsp;";
		this._$visibile(!!e)
	};
	if (!0) e.copy(e.P("nej.ut"), a);
	return a
}, "017b426dd2bb4315fa45d567a1fd3718", "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "e0793c838b68fed5a7e1742035643bec", "56eb089afee6bce0764df69e2c34d644");
I$("d98b951627de51b3e48fa0100519c954", ".#<uispace>-parent{position:relative;}\n.#<uispace>{position:absolute;border:1px solid #aaa;background:#fff;text-align:left;visibility:hidden;}\n.#<uispace> .zitm{height:20px;line-height:20px;cursor:default;}\n.#<uispace> .js-selected{background:#1257F9;}");
I$("d3607cfbf751661a8505060ad1de0362", '{if defined("xlist")&&!!xlist.length}\n  {list xlist as x}<div class="zitm" data-value="${x}">${x}</div>{/list}\n{/if}');
I$("60faa331365b82e507d8aa4c86005328", function (e, t, i, n, s, a, r, o, c, d, _, l, u) {
	var f = i._$pushCSSText(o),
		h = r._$add(c),
		p;
	d._$$Suggest = t._$klass();
	p = d._$$Suggest._$extend(s._$$Abstract);
	p.__init = function () {
		this.__sopt = {
			onchange: this.__onChange._$bind(this),
			onselect: this.__onSelect._$bind(this)
		};
		this.__super()
	};
	p.__reset = function (e) {
		this.__super(e);
		this.__sopt.autofill = 0 != e.autofill;
		this.__sopt.input = i._$get(e.input);
		this.__sopt.input.insertAdjacentElement("afterEnd", this.__body);
		this.__suggest = a._$$Suggest._$allocate(this.__sopt)
	};
	p.__destroy = function () {
		if (this.__suggest) {
			this.__suggest._$recycle();
			delete this.__suggest
		}
		this.__super();
		delete this.__sopt.input
	};
	p.__initXGui = function () {
		this.__seed_css = f
	};
	p.__initNode = function () {
		this.__super();
		this.__sopt.body = this.__body
	};
	p.__onChange = function (e) {
		this._$dispatchEvent("onchange", e)
	};
	p.__onSelect = function (e, t) {
		this._$dispatchEvent("onselect", e, t)
	};
	p._$setList = function (e, t) {
		if (n._$isArray(e)) e = r._$get(h, {
			xlist: e
		});
		this.__body.innerHTML = e || "";
		this.__suggest._$setList(!t ? i._$getChildren(this.__body) : i._$getByClassName(this.__body, t))
	};
	if (!0) e.copy(e.P("nej.ui"), d);
	return d
}, "017b426dd2bb4315fa45d567a1fd3718", "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "8fd03edddb19cf8c294f56ca6638c475", "e30f9e8af4c2bb3cff9252a9e1c3e5da", "bc0f77dfcc9bde34f9fcbf32fdec36a8", "bff3d86ec4ea91399919ee4963badfeb", "d98b951627de51b3e48fa0100519c954", "d3607cfbf751661a8505060ad1de0362");
I$("b819242a9b3581fcd37cdd1531beab1d", function (e, t, i, n, s, a, r, o, c, d, _, l) {
	var u;
	c._$$CountDown = e._$klass();
	u = c._$$CountDown._$extend(s._$$EventTarget);
	u.__reset = function (e) {
		this.__super(e);
		this.__lock = 0;
		this.__btn = e.btn;
		this.__initEvent()
	};
	u.__destroy = function (e) {
		this.__resetTimer();
		this.__super(e)
	};
	u.__initEvent = function () {
		this.__doInitDomEvent([
			[this.__btn, "click", this.__onClick._$bind(this)]
		])
	};
	u.__resetTimer = function () {
		this.__btn.innerHTML = window._$URSOPT.getsmstxt;
		t._$delClassName(this.__btn, "disable");
		this.__btn.disabled = !1;
		this.__lock = 0;
		if (this.__stl) this.__stl = clearInterval(this.__stl);
		this.__timer = 30
	};
	u.__setTimeout = function () {
		var e = function (e) {
			if (!(this.__timer <= 1)) {
				this.__timer--;
				this.__btn.innerHTML = this.__timer + e
			} else this.__resetTimer()
		};
		return function () {
			var i = window._$URSOPT.enlang;
			var n = 1 == i ? o.showText("秒后重发", i) : "秒后重发";
			t._$addClassName(this.__btn, "disable");
			this.__btn.disabled = !0;
			this.__timer = 30;
			this.__btn.innerHTML = this.__timer + n;
			if (this.__stl) this.__stl = clearInterval(this.__stl);
			this.__stl = setInterval(e._$bind(this, n), 1e3)
		}
	}();
	u.__onClick = function () {
		try {
			this.__btn.focus()
		} catch (e) { }
		if (!this.__lock) this._$dispatchEvent("onclick")
	};
	u._$getSms = function () {
		this.__lock = 1;
		this.__setTimeout()
	}
}, "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "e0793c838b68fed5a7e1742035643bec", "a4de926c2d79e8d8f856eaff4dac0f8b", "60faa331365b82e507d8aa4c86005328", "46a4de3a50f50a600950ca9cee88031e");
I$("2e90615631450f00881b76afff6bd63c", function (e, t, i, n, s, a, r, o, c, d, _, l, u, f, h, p, m) {
	var g, b, v = {
		phonecode: 0
	};
	var $ = {
		412: "验证码错误次数过多，请明天再试",
		413: "当日尝试次数过多，请明天再试",
		430: "此次登录不需要进行密保验证",
		506: "短信发送失败，请稍后再试"
	};
	f._$$Phone = e._$klass();
	g = f._$$Phone._$extend(r._$$Module);
	g.__init = function (e) {
		this.__opts = e.opts || {};
		this.__onlyPhone = this.__opts.onlyPhone || 0;
		this.__super()
	};
	g.__reset = function (e) {
		this.__data = e.data;
		this.__dt = "00";
		this.__mb = e.mb;
		this.__doback = e.doback;
		this.__ipts = [];
		this.__super(e);
		t._$addClassName(this.__unlockBtn, "btndisabled");
		t._$get("pp_mb").innerHTML = this.__mb;
		this.__canUnlock = 0;
		this._mob_can_pass = !1;
		if (!this.__countDownBtn) this.__countDownBtn = u._$$CountDown._$allocate({
			btn: this.__getSmsCode,
			onclick: this.__onGetSmsCode._$bind(this)
		})
	};
	g.__destroy = function () {
		if (this.__countDownBtn) this.__countDownBtn = this.__countDownBtn._$recycle();
		this.__unLockSendSmsBtn();
		this.__super()
	};
	g.__initNode = function () {
		this.__super();
		this.__getSmsCode = t._$getByClassName(this.__body, "getsmscode")[0];
		this.__unlockBtn = t._$getByClassName(this.__body, "btncolor")[0]
	};
	g.__initXGui = function () {
		b = s._$addNodeTemplate(a._$get("phone-tmp", {
			getsmstxt: window._$URSOPT.getsmstxt
		}));
		this.__seed_html = b
	};
	g.__initEvent = function () {
		this.__inputs = t._$getByClassName(this.__body, "j-inputtext");
		if (0 == this.__ipts.length) n._$forEach(this.__inputs, function (e) {
			var t = {
				opts: this.__opts,
				node: e,
				form: this.__form,
				needClose: 1,
				onfocus: this.__onFocus._$bind(this),
				onInput: this.__onInput._$bind(this)
			};
			this.__ipts.push(d._$$Input._$allocate(t))
		}._$bind(this))
	};
	g.__onFocus = function (e) {
		c._$removeError(e, "nerror")
	};
	g.__onInput = function (e) {
		var i = this.__inputs[0].value.trim();
		if (/^\d{6}$/.test(i)) {
			if (window._$ISIOS) c._$removeError(e, "nerror");
			t._$delClassName(this.__unlockBtn, "btndisabled");
			this.__canUnlock = 1
		} else {
			t._$addClassName(this.__unlockBtn, "btndisabled");
			this.__canUnlock = 0
		}
	};
	g.__onGetSmsCode = function () {
		if (!this.__lockSendSmsBtnState) {
			if (this.__onlyPhone) this.__data.mbl = 1;
			c._$removeError2();
			this.__lockSendSmsBtn();
			_._$request("sendSmsLogin", this.__data, this.__cbGetSmsCode._$bind(this), this.__cbWarn._$bind(this), 1)
		}
	};
	g.__cbWarn = function (e) {
		this.__unLockSendSmsBtn();
		this._mob_can_pass = !0;
		var t = e.ret,
			i = e.dt,
			n;
		if (e)
			if ("411" == t)
				if ("02" == i) {
					this.__dt = "02";
					this._$dispatchEvent("onChangeToUpsms", {
						mobile: this.__mb,
						receiveCode: e.receiveCode,
						product: this.__data.pd,
						promark: this.__data.pkid,
						onlyPhone: this.__onlyPhone,
						username: this.__data.un
					})
				} else {
					this.__dt = "00";
					var s = e.receiveCode.split(",");
					var a = "请您编辑短信<strong> " + (s[0] || "验证") + " </strong>发送到<strong> " + (s[1] || "106981630163331") + " </strong>获取验证码，短信费用由运营商收取";
					c._$showError(null, a, "nerror", 2)
				} else {
				n = l[t] || c._$getErrorTxt(e.ret);
				if ("458" === t) {
					c._$showError(null, n, "nerror");
					return
				}
				if ("412" == t || "413" == t || "430" == t || "506" == t) {
					n = $[t];
					if ("506" === t) {
						c._$showError(null, n, "nerror");
						return
					}
				} else if ("10" == e.dt && "401" == t) n = l["40110"];
				this.__doback({
					errorTxt: n
				})
			}
	};
	g.__cbGetSmsCode = function () {
		return function (e) {
			this.__unLockSendSmsBtn();
			if ("02" === e.dt) this.__dt = "02";
			else this.__dt = "00"; if (this.__inputs[0]) c._$removeError(this.__inputs[0], "nerror");
			this._mob_can_pass = !0;
			this.__countDownBtn._$getSms()
		}
	}();
	g.__initForm = function () {
		if (!this.__form) this.__form = o._$$WebForm._$allocate({
			form: "phone-form",
			oninvalid: function (e) {
				var t = "请输入",
					n = e.code,
					s = i._$getElement(e),
					a = s.name;
				if (!window.outlinkflag) {
					if (n != -1) {
						if (n == -4 || n == -2 || n == -3) {
							t = "格式错误";
							if ("phonecode" == a) t = "短信验证码" + t
						}
						this.__states[a] = 1;
						if ("phonecode" == a) v["phonecode"] = 1;
						c._$showError(s, t, "nerror");
						e.stopped = !0
					} else if ("phonecode" == a) v["phonecode"] = 0
				} else if (!this.__refocus && 1 == window.outlinkflag) this.__refocus = setTimeout(function () {
					this.__refocus = clearTimeout(this.__refocus);
					try {
						s.focus()
					} catch (e) { }
				}._$bind(this), 200)
			}._$bind(this),
			onvalid: function (e) {
				var t = i._$getElement(e),
					n = t.name;
				this.__states[n] = 0;
				e.stopped = !0
			}._$bind(this)
		})
	};
	g._$showReason = function () {
		var e = this.__inputs[0].value.trim();
		if (!this._mob_can_pass) c._$showError(null, "请先获取验证码", "nerror");
		else if (!this.__canUnlock && "" == e) c._$showError(null, "请输入短信验证码", "nerror")
	};
	g._$getDt = function () {
		return this.__dt || "00"
	};
	g._$canUnlcok = function () {
		return this.__canUnlock && this._mob_can_pass
	};
	g.__lockSendSmsBtn = function () {
		if (c._$isVersionFour()) {
			this.__lockSendSmsBtnState = !0;
			t._$addClassName(this.__getSmsCode, "u-btn-loading u-btn-loading-blue")
		}
	};
	g.__unLockSendSmsBtn = function () {
		if (c._$isVersionFour()) {
			this.__lockSendSmsBtnState = !1;
			t._$delClassName(this.__getSmsCode, "u-btn-loading u-btn-loading-blue")
		}
	}
}, "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "12c5dab742044e15807978f676f5c3fc", "bff3d86ec4ea91399919ee4963badfeb", "ef328f7ca95c06d61f18782bd6ac5271", "20a53a78a8e132ee6b99f8e237d5d673", "a4de926c2d79e8d8f856eaff4dac0f8b", "d311422206de0b8499264964e9de72a8", "53c267efd983fb8c66cb645beead7a8d", "285e64765191768caf2cc6de0397e37c", "b819242a9b3581fcd37cdd1531beab1d");
I$("08bf049f40f15439bfc7bac0801dd022", function (e, t, i, n, s, a, r, o, c, d, _, l, u, f, h) {
	var p, m, g = {
		otpcode: 0
	};
	l._$$OTP = e._$klass();
	p = l._$$OTP._$extend(r._$$Module);
	p.__init = function (e) {
		this.__opts = e.opts || {};
		this.__super()
	};
	p.__reset = function (e) {
		this.__data = e.data;
		this.__ipts = [];
		this.__super(e);
		t._$addClassName(this.__unlockBtn, "btndisabled");
		this.__canUnlock = 0
	};
	p.__destroy = function () {
		this.__super()
	};
	p.__initNode = function () {
		this.__super();
		this.__unlockBtn = t._$getByClassName(this.__body, "btncolor")[0]
	};
	p.__initXGui = function () {
		m = s._$addNodeTemplate(a._$get("otp-tmp"));
		this.__seed_html = m
	};
	p.__initEvent = function () {
		this.__inputs = t._$getByClassName(this.__body, "j-inputtext");
		this.__clearBtn = t._$getByClassName(this.__body, "u-clear")[0];
		this.__inputBox = c._$getParent(this.__inputs[0], "inputbox");
		this.__label = t._$getByClassName(this.__inputBox, "u-label")[0];
		if (0 == this.__ipts.length) n._$forEach(this.__inputs, function (e) {
			var t = {
				opts: this.__opts,
				node: e,
				form: this.__form,
				needClose: 1,
				onfocus: this.__onFocus._$bind(this),
				onInput: this.__onInput._$bind(this)
			};
			this.__ipts.push(d._$$Input._$allocate(t))
		}._$bind(this))
	};
	p.__onFocus = function (e) {
		c._$removeError(e, "nerror")
	};
	p.__onInput = function () {
		var e = this.__inputs[0].value.trim();
		if (/^\d{6}$/.test(e)) {
			t._$delClassName(this.__unlockBtn, "btndisabled");
			this.__canUnlock = 1
		} else {
			t._$addClassName(this.__unlockBtn, "btndisabled");
			this.__canUnlock = 0
		}
	};
	p.__initForm = function () {
		if (!this.__form) this.__form = o._$$WebForm._$allocate({
			form: "otp-form",
			oninvalid: function (e) {
				var t = "请输入",
					n = e.code,
					s = i._$getElement(e),
					a = s.name;
				if (!window.outlinkflag)
					if (n != -1) {
						if (n == -4 || n == -2 || n == -3) t = "动态密码格式错误";
						this.__states[a] = 1;
						g["otpcode"] = 1;
						c._$showError(s, t, "nerror");
						e.stopped = !0
					} else g["otpcode"] = 0;
				else if (!this.__refocus && 1 == window.outlinkflag) this.__refocus = setTimeout(function () {
					this.__refocus = clearTimeout(this.__refocus);
					try {
						s.focus()
					} catch (e) { }
				}._$bind(this), 200)
			}._$bind(this),
			onvalid: function (e) {
				var t = i._$getElement(e),
					n = t.name;
				this.__states[n] = 0;
				e.stopped = !0
			}._$bind(this)
		})
	};
	p.__clearInpt = function () {
		this.__label.style.display = "block";
		this.__clearBtn.style.display = "none";
		this.__inputs[0].value = "";
		t._$addClassName(this.__unlockBtn, "btndisabled");
		this.__canUnlock = 0
	};
	p._$showReason = function () {
		var e = this.__inputs[0].value.trim();
		if (!this.__canUnlock && "" == e) c._$showError(null, "请输入动态密码", "nerror")
	}
}, "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "12c5dab742044e15807978f676f5c3fc", "bff3d86ec4ea91399919ee4963badfeb", "ef328f7ca95c06d61f18782bd6ac5271", "20a53a78a8e132ee6b99f8e237d5d673", "a4de926c2d79e8d8f856eaff4dac0f8b", "d311422206de0b8499264964e9de72a8", "53c267efd983fb8c66cb645beead7a8d");
I$("1b8d69883f39aeaa23b0e322eab51b91", function (e, t, i, n, s, a, r, o, c, d, _, l, u, f, h) {
	var p, m, g = {
		ppccode: 0
	};
	l._$$PPC = e._$klass();
	p = l._$$PPC._$extend(r._$$Module);
	p.__init = function (e) {
		this.__opts = e.opts || {};
		this.__super()
	};
	p.__reset = function (e) {
		this.__data = e.data || [];
		this.__mb = e.mb;
		this.__ipts = [];
		this.__super(e);
		this.__setCoord(this.__data.coord);
		t._$addClassName(this.__unlockBtn, "btndisabled");
		this.__canUnlock = 0
	};
	p.__destroy = function () {
		this.__super()
	};
	p.__initNode = function () {
		this.__super();
		this.__getSmsCode = t._$getByClassName(this.__body, "getsmscode")[0];
		this.__unlockBtn = t._$getByClassName(this.__body, "btncolor")[0]
	};
	p.__initXGui = function () {
		m = s._$addNodeTemplate(a._$get("ppc-tmp"));
		this.__seed_html = m
	};
	p.__initEvent = function () {
		this.__inputs = t._$getByClassName(this.__body, "j-inputtext");
		if (0 == this.__ipts.length) n._$forEach(this.__inputs, function (e) {
			var t = {
				opts: this.__opts,
				node: e,
				form: this.__form,
				needClose: 0,
				onfocus: this.__onFocus._$bind(this),
				onInput: this.__onInput._$bind(this)
			};
			this.__ipts.push(d._$$Input._$allocate(t))
		}._$bind(this))
	};
	p.__onFocus = function (e) {
		c._$removeError(e, "nerror")
	};
	p.__onInput = function () {
		var e = this.__inputs[0].value.trim();
		var i = this.__inputs[1].value.trim();
		var n = this.__inputs[2].value.trim();
		if (/^\d{1,3}$/.test(e) && /^\d{1,3}$/.test(i) && /^\d{1,3}$/.test(n)) {
			t._$delClassName(this.__unlockBtn, "btndisabled");
			this.__canUnlock = 1
		} else {
			t._$addClassName(this.__unlockBtn, "btndisabled");
			this.__canUnlock = 0
		}
	};
	p.__initForm = function () {
		if (!this.__form) this.__form = o._$$WebForm._$allocate({
			form: "ppc-form",
			oninvalid: function (e) {
				var t = "请输入",
					n = e.code,
					s = i._$getElement(e),
					a = s.name;
				if (!window.outlinkflag) {
					if (n != -1) {
						if (n == -4 || n == -2 || n == -3) {
							t = "格式错误";
							if ("ppccode" == a) t = "验证码" + t
						}
						this.__states[a] = 1;
						if ("ppccode" == a) g["ppccode"] = 1;
						c._$showError(s, t, "nerror");
						e.stopped = !0
					} else if ("ppccode" == a) g["ppccode"] = 0
				} else if (!this.__refocus && 1 == window.outlinkflag) this.__refocus = setTimeout(function () {
					this.__refocus = clearTimeout(this.__refocus);
					try {
						s.focus()
					} catch (e) { }
				}._$bind(this), 200)
			}._$bind(this),
			onvalid: function (e) {
				var t = i._$getElement(e),
					n = t.name;
				this.__states[n] = 0;
				e.stopped = !0
			}._$bind(this)
		})
	};
	p.__setCoord = function (e) {
		if (e) {
			var i = t._$getByClassName(this.__body, "coord"),
				n = e.split(";") || [];
			i[0].innerHTML = n[0];
			i[1].innerHTML = n[1];
			i[2].innerHTML = n[2]
		}
	};
	p.__clearInpt = function () {
		this.__inputs[0].value = "";
		this.__inputs[1].value = "";
		this.__inputs[2].value = "";
		t._$addClassName(this.__unlockBtn, "btndisabled");
		this.__canUnlock = 0
	};
	p._$showReason = function () {
		if (!this.__canUnlock) c._$showError(null, "请正确输入密保卡上对应的数字", "nerror")
	}
}, "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "12c5dab742044e15807978f676f5c3fc", "bff3d86ec4ea91399919ee4963badfeb", "ef328f7ca95c06d61f18782bd6ac5271", "20a53a78a8e132ee6b99f8e237d5d673", "a4de926c2d79e8d8f856eaff4dac0f8b", "d311422206de0b8499264964e9de72a8", "53c267efd983fb8c66cb645beead7a8d");
I$("bcf92c1440ed9035b127f4bb379657f3", function () {
	var e = {
		4502: "该帐号无法使用，请更换后重试",
		4503: "该手机无法使用，请更换后重试",
		4504: "您的网络环境存在风险，请更换网络",
		501: "系统繁忙，请您稍后再试",
		502: "系统繁忙，请您稍后再试",
		500: "系统繁忙，请您稍后再试",
		"-1": "网络不好，请刷新页面重试",
		"-2": "网络不好，请刷新页面重试",
		404: "网络异常，请刷新页面重试",
		401: "操作超时，请刷新页面重试",
		433: "系统繁忙，请刷新页面重试",
		"-101": "已重新发送激活邮件",
		"-102": "发送邮件失败，请稍后再试",
		"-103": "正在加载AA资源，请稍后重试",
		"-104": "您的网络不好，请刷新重试",
		"-105": "正在加载，请稍后...",
		"httpcode-1": "网络异常，请稍后再试",
		"httpcode-400": "网络异常，请稍后再试",
		"httpcode-404": "网络异常，请稍后再试",
		"httpcode-500": "系统繁忙，请稍后再试",
		"httpcode-502": "系统繁忙，请稍后再试",
		"httpcode-503": "系统繁忙，请稍后再试",
		"httpcode-4xx": "网络异常，请稍后再试",
		"httpcode-5xx": "系统繁忙，请稍后再试",
		"httpcode-429": "操作过于频繁，请稍后再试"
	};
	return e
});
I$("7b21e2d34151b2744c99076d5be5823a", function (e, t, i, n, s, a, r, o, c, d, _, l, u, f, h, p, m) {
	var g;
	f._$$Manager = e._$klass();
	g = f._$$Manager._$extend(a._$$EventTarget);
	g.__init = function (e) {
		this.enlang = window._$URSOPT.enlang;
		this.__setMap = {};
		this.__product = e.product;
		this.__promark = e.promark;
		window._$errClickHide = e.errClickHide || 0;
		if (this.__options) {
			this.__options.goEmailLoginTxt = this.__options.goEmailLoginTxt || "网易邮箱帐号登录";
			this.__options.goMbLoginTxt = this.__options.goMbLoginTxt || "网易手机帐号登录";
			this.__options.goEmailRegTxt = this.__options.goEmailRegTxt || "网易邮箱帐号注册";
			this.__options.goMbRegTxt = this.__options.goMbRegTxt || "网易手机帐号注册"
		}
		this.__super(e)
	};
	g.__reset = function (e) {
		this.__super(e);
		window.$outLoginKey = this.__options.outLoginKey || "";
		window.$autoFocus = "0" == this.__options.autoFocus ? 0 : 1;
		this.__box = i._$get("cnt-box");
		this.__box2 = i._$get("cnt-box2");
		r._$render(this.__box, "h-tmp");
		this.__initEvent()
	};
	g.__destroy = function () {
		this.__super()
	};
	g.__initEvent = function () {
		var e = "click";
		var n = i._$get("confirm");
		var s = i._$get("cnt-box-parent");
		var a = [
			[n, e, this.__doAction._$bind(this)],
			[s, e, this.__doAction._$bind(this)],
			[document, "mouseover", this.__onMouseover._$bind(this)]
		];
		if (this.__options.needScrollToView && t._$is("android")) a.push([document, "click", this.__onWindowClick._$bind(this)]);
		this.__doInitDomEvent(a)
	};
	g.__onWindowClick = function () {
		try {
			if (document.activeElement && "INPUT" == document.activeElement.tagName.toUpperCase() && document.activeElement.scrollIntoViewIfNeeded) window.setTimeout(function () {
				document.activeElement.scrollIntoViewIfNeeded()
			}, 200)
		} catch (e) { }
	};
	g.__onMouseover = function (e) {
		var t = n._$getElement(e),
			s = i._$dataset(t, "outlink") || 0;
		window.outlinkflag = s
	};
	g.__changePage = function (e) {
		i._$setStyle(this.__box, "display", e ? "none" : "block");
		i._$setStyle(this.__box2, "display", e ? "block" : "none");
		c._$resize();
		setTimeout(function () {
			this.__sendSize("moduleResize")
		}._$bind(this), 200)
	};
	g.__showFail = function (e) {
		var t = _[e] || c._$getErrorTxt(e);
		c._$showError(0, t, "nerror")
	};
	g.__showLeak = function (e, t) {
		var i, n;
		var s;
		this.__isLeak = !0;
		if (1 == e) {
			this.__isLeak1 = !0;
			i = t.mode || {};
			s = i.srcList ? i.srcList.join(",") : "";
			r._$render(this.__box2, "exception1-tmp", {
				product: this.__product,
				promark: this.__promark,
				srclist: s,
				tip1: u.showText("帐号安全等级低", this.enlang),
				tip2: u.showText("建议你修改密码", this.enlang),
				loginTxt: u.showText("继续登录", this.enlang),
				pwdTxt: u.showText("修改密码", this.enlang)
			})
		} else if (2 == e) {
			this.__isLeak2 = !0;
			r._$render(this.__box2, "exception2-tmp", {
				product: this.__product,
				promark: this.__promark,
				tip1: u.showText("帐号安全等级低", this.enlang),
				tip2: u.showText("请立即修改密码", this.enlang),
				backTxt: u.showText("返&nbsp;&nbsp;&nbsp;&nbsp;回", this.enlang),
				pwdText: u.showText("修改密码", this.enlang)
			})
		} else if (3 == e) {
			this.__isLeak3 = !0;
			r._$render(this.__box2, "exception3-tmp", {
				product: this.__product,
				promark: this.__promark,
				tip1: u.showText("帐号安全等级低", this.enlang),
				tip2: u.showText("建议你绑定手机", this.enlang),
				loginTxt: u.showText("继续登录", this.enlang),
				bindMobile: u.showText("绑定手机", this.enlang)
			})
		} else if (4 == e) {
			i = t.mode || {};
			this.__showMode(i)
		} else if (5 == e) {
			this.__isLeak = !1;
			i = t.mode || {};
			n = i.txt0.split("<br>");
			i.txt1 = n[0] || "";
			i.txt2 = n[1] || "";
			r._$render(this.__box2, "exception4-tmp", i)
		} else if (6 == e) {
			i = t.mode || {};
			s = i.srcList ? i.srcList.join(",") : "";
			r._$render(this.__box2, "exception5-tmp", {
				btnLink1: i.btnLink1 || "",
				srclist: s,
				tip1: u.showText("您的帐号容易被盗", this.enlang),
				tip2: u.showText("请立即验证手机号", this.enlang),
				backBtnTxt: u.showText("返&nbsp;&nbsp;&nbsp;&nbsp;回", this.enlang),
				protectText: u.showText("加强保护", this.enlang)
			})
		}
		this.__changePage(1)
	};
	g.__changeImgToIPV6 = function (e) {
		var t = e.img0 || "";
		t = t.replace("ursdoccdn.nosdn.127.net", "urswebzj.nosdn.127.net");
		if (e && t && (t.indexOf("urswebzj.nosdn.127.net") > 0 || t.indexOf("webzj.netstatic.net") > 0)) e.img0 = c._$urlToIPV6(t);
		return e
	};
	g.__showMode = function (e) {
		if (e.img0) e.img0 = c._$changeImg(e.img0);
		if (c._$isIPV6()) e = this.__changeImgToIPV6(e);
		this.__isMode = 1;
		var t = {
			product: this.__product,
			promark: this.__promark
		};
		var i = e;
		i.srclist = i.srcList ? i.srcList.join(",") : "";
		s._$merge(t, i);
		var n = "exception-tmp-" + (e.mode || 0);
		r._$render(this.__box2, n, t);
		this.__changePage(1)
	};
	g.__sendSize = function (e) {
		c._$resize(e)
	};
	g.__sendClose = function (e) {
		var t = i._$getByClassName(document, "j-inputtext");
		var n = !0;
		s._$forEach(t, function (e) {
			if (e.value) n = !1
		});
		if (e || this.__islogin || n) {
			var a = {
				type: "close"
			};
			a["URS-CM"] = 1;
			c._$postMessage("_parent", {
				data: a
			})
		} else this.__showConfirm()
	};
	g.__doAction = function (e) {
		var t = n._$getElement(e),
			s = i._$dataset(t, "action");
		if ("confirmgoon" == s) {
			i._$addClassName(i._$get("confirm"), "f-dn");
			i._$delClassName(i._$get("cnt-box-parent"), "f-dn");
			this.__sendSize("init")
		}
		if ("confirmclose" == s) {
			_gaq.push(["_trackEvent", "注册步骤", "【-】放弃注册", "放弃注册"]);
			var a = {
				type: "close"
			};
			a["URS-CM"] = 1;
			c._$postMessage("_parent", {
				data: a
			});
			this.__closeFlag = !1
		}
	};
	g.__showConfirm = function () {
		i._$addClassName(i._$get("cnt-box-parent"), "f-dn");
		i._$delClassName(i._$get("confirm"), "f-dn");
		this.__sendSize("init")
	};
	g.__sendMsgDomain = function (e, t) {
		this.__onUnLockLogin && this.__onUnLockLogin();
		this.__onUnLockReg && this.__onUnLockReg();
		this.__sendMsg(e);
		if (t && this.__setDomainsOk) this.__setDomainsOk(t)
	};
	g.__addIframe = function (e, t, i, n) {
		if ("https:" == location.protocol) n = n.replace("http:", "https:");
		n = c._$addPathB(n);
		if (window._$URSOPT.opd) n = n + (n.indexOf("?") >= 0 ? "&" : "?") + "opd=" + window._$URSOPT.opd;
		if (window._$URSOPT.opkid) n = n + (n.indexOf("?") >= 0 ? "&" : "?") + "opkid=" + window._$URSOPT.opkid;
		this.__addIframeNoPathBAndOpd(e, t, i, n)
	};
	g.__addIframeNoPathBAndOpd = function (e, t, n, s) {
		if ("https:" == location.protocol) s = s.replace("http:", "https:");
		s = c._$tryAddChromeHack(s);
		s = c._$tryAddSm(s).realurl;
		i._$createXFrame({
			src: s,
			parent: document.body,
			visible: !1,
			onload: function () {
				this.__setMap[n].iframeIndex++;
				var i = {
					time: n,
					data: e,
					json: t
				};
				this.__doReqSendNext(i)
			}._$bind(this)
		})
	};
	g.__doReqSendNext = function (e) {
		var t = e.time,
			i = e.data,
			n = e.json,
			s = this.__setMap[t].ifarmeSize;
		if (this.smGoUrlLength && this.smGoUrlLength > 0) s = this.__setMap[t].ifarmeSize + this.smGoUrlLength;
		if (s == this.__setMap[t].iframeIndex) {
			if (this.__setMap[t].iframeCt) this.__setMap[t].iframeCt = clearTimeout(this.__setMap[t].iframeCt);
			this.__sendMsgDomain(i, n)
		}
	};
	g.__setDomains = function (e, t) {
		var i = e || {};
		t = t || "";
		i["URS-CM"] = 1;
		var n = (new Date).getTime();
		this.__setMap[n] = {};
		this.__setMap[n].iframeIndex = 0;
		var a = i.nextUrls || [];
		this.smGoUrlLength = 0;
		if (c._$getSmState()) s._$reverseEach(a, function (e, s) {
			if (c._$isGoUrl(e)) {
				var r = c._$tryAddSm(e).paramobj;
				this.smGoUrlLength++;
				var o = {
					time: n,
					data: i,
					json: t
				};
				l._$request("goonlog", r, this.__gooncb._$bind(this, o), this.__gooncb._$bind(this, o), 1, this.__product);
				a.splice(s, 1)
			}
		}._$bind(this));
		this.__setMap[n].ifarmeSize = a.length || 0;
		if (this.__setMap[n].ifarmeSize > 0 || this.smGoUrlLength > 0) this.__setMap[n].iframeCt = setTimeout(function (e, t) {
			this.__sendMsgDomain(e, t)
		}._$bind(this, i, t), 5e3);
		else this.__sendMsgDomain(i, t);
		return {
			list: a,
			data: i,
			json: t,
			time: n
		}
	};
	g.__gooncb = function (e) {
		var t = e.time;
		this.__setMap[t].iframeIndex++;
		this.__doReqSendNext(e)
	};
	g.__setDomainsHasPathbAndOpd = function (e, t) {
		e = e || {};
		if (void 0 !== this.__tempData && "success" === e.type && 1 !== e.isqr) {
			e.data = this.__tempData;
			e.ursfp = d._$cookie("NTES_WEB_FP") || "";
			e.rtid = window._$RTID || ""
		}
		var i = this.__setDomains(e, t);
		s._$forEach(i.list, this.__addIframe._$bind(this, i.data, i.json, i.time))
	};
	g.__setDomainsNoPathbAndOpd = function (e, t) {
		var i = this.__setDomains(e, t);
		s._$forEach(i.list, this.__addIframeNoPathBAndOpd._$bind(this, i.data, i.json, i.time))
	};
	g.__sendMsg = function (e) {
		var t = e || {};
		t["URS-CM"] = 1;
		if (window.$outLoginKey && "success" == t.type) t.fromOutLogin = 1;
		c._$postMessage("_parent", {
			data: t
		})
	};
	g.__hideFooter = function () {
		var e = i._$get("footer");
		i._$addClassName(e, "f-dn")
	};
	window.thirdHandler = function (e) {
		var t = {
			type: "success",
			isOther: !0,
			username: e
		};
		t["URS-CM"] = 1;
		if (window.$outLoginKey) t.fromOutLogin = 1;
		c._$postMessage("_parent", {
			data: t
		})
	};
	window.$outLogin = function (e) {
		var t;
		if (e.isOther) window.thirdHandler(e.username);
		else {
			var i = JSON.stringify(e);
			t = JSON.parse(i);
			t.toOpener = 1;
			c._$postMessage("_parent", {
				data: t
			})
		}
	};
	return f
}, "4600f25ee05ffacd81f2d44da00eaaa7", "a878c0216188111f46d39b9df767b354", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "e0793c838b68fed5a7e1742035643bec", "bff3d86ec4ea91399919ee4963badfeb", "8f33f2dc03528616b29dd40cc05162ac", "a4de926c2d79e8d8f856eaff4dac0f8b", "54120fa727d71cd38f3b1273d034afef", "bcf92c1440ed9035b127f4bb379657f3", "53c267efd983fb8c66cb645beead7a8d", "46a4de3a50f50a600950ca9cee88031e");
I$("8358c6f2f973f1bfd6290185a03b5423", function (e, t, i, n, s, a, r, o, c, d, _) {
	var l = r._$isIPV6() ? "https://reg-v6.163.com/services/getqrcodeid" : "https://reg.163.com/services/getqrcodeid";
	var u = r._$isIPV6() ? "https://reg-v6.163.com/services/getUrlQrcode" : "https://reg.163.com/services/getUrlQrcode";
	var f = r._$isIPV6() ? "https://reg-v6.163.com/services/qrcodeauth" : "https://reg.163.com/services/qrcodeauth";
	o._$initQr = function (e) {
		if (!e) e = {};
		this.__opts = e.opts || {};
		this.__newQrCode = e.newQrCode || 0;
		if (this.__newQrCode) {
			l = "https://q.reg.163.com/qrcode/getqrcodeid";
			u = "https://q.reg.163.com/qrcode/getGeneralUrlQrcode";
			f = "https://q.reg.163.com/qrcode/qrcodeauthstatus"
		}
		this.__totalState = 0;
		this.__ticket = "";
		this.__fromModule = e.fromModule || "";
		this.__domains = e.domains || "";
		this.__prdomain = e.prdomain || "";
		this.__product = e.product || "urs";
		this.__qrurl1 = this.__opts.qrurl1 || "";
		this.__qrurl2 = this.__opts.qrurl2 || "";
		this.__promark = e.promark;
		this.__usage = e.usage || 0;
		this.__size = e.size || "200";
		this.__format = e.format || "png";
		this.__qrcodeDom = e.qrcodeDom || null;
		this.__imgDom = e.imgDom || null;
		this.__oWarmDom = e.oWarmDom || null;
		this.__qrSuccDom = e.qrSuccDom || null;
		this.__qrBackBrn = e.qrBackDom || null;
		this.__pollingSec = e.pollingSec || 2e3;
		this.__maxPollingTimes = e.maxPollingTimes || 150;
		this.__completePollingTimes = e.completePollingTimes || 60;
		this.__qrLoginSucc = e.qrLoginSucc || this.__qrLoginSucc;
		this.__qrLoginErr = e.qrLoginErr || this.__qrLoginErr;
		this.__confirmLogin = e.confirmLogin || this.__confirmLogin;
		this.__scanIsComplete = e.scanIsComplete || this.__scanIsComplete;
		this.__codeLose = e.codeLose || this.__codeLose;
		this.__oWarmDom.onclick = function () {
			o.__changeState(1)
		};
		this.__qrBackBrn.onclick = function () {
			o.__changeState(1)
		};
		this.__changeState(1)
	};
	o.__changeState = function (e) {
		switch (e) {
			case 0:
				this._$clearAllStatus();
				this.__hideScanSucc();
				this.__showQrcodeM();
				this.__showOWarm();
				this.__totalState = 0;
				break;
			case 1:
				this.__hideScanSucc();
				this.__showQrcodeM();
				this.__getQrcode();
				this.__hideOWarm();
				this.__totalState = 1;
				break;
			case 2:
				this.__hideQrcodeM();
				this.__showScanSucc();
				this.__totalState = 2
		}
	};
	o.__getQrcode = function () {
		var e = this;
		if (1 !== this.__totalState) {
			var t = function (t) {
				t = JSON.parse(t["content"]);
				e.__qrId = t["l"]["i"];
				if (e.__qrId) e.__showQrcode(e.__imgDom)
			};
			var i = {
				product: this.__product,
				usage: this.__usage
			};
			r._$requestJsonp(l, i, t)
		}
	};
	o.__showQrcode = function (e) {
		e.src = u + "?uuid=" + this.__qrId + "&size=" + this.__size + "&format=" + this.__format + "&product=" + this.__product + "&rtid=" + r._$getRtid() + "&" + (new Date).getTime() + "&url=" + this.__qrurl1 + "&url2=" + this.__qrurl2;
		this.__restartTiming(0)
	};
	o.__restartTiming = function (e) {
		var t = this;
		this.__qrTiming = 0;
		var i = this.__pollingSec;
		var n = 0 == e ? this.__maxPollingTimes : this.__completePollingTimes;
		if (this.__checkQrStIntv) clearInterval(t.__checkQrStIntv);
		this.__checkQrStIntv = setInterval(function () {
			t.__qrTiming++;
			t.__checkQrStatus();
			if (t.__qrTiming >= n) {
				clearInterval(t.__checkQrStIntv);
				t.__changeState(0);
				t.__codeLose()
			}
		}, i)
	};
	o.__checkQrLoginBc = function (e) {
		var t = e.crossSetCookieUrl ? e.crossSetCookieUrl.split(",") : [];
		if (t && t.length > 0)
			for (var i = 0, n; i < t.length; i++) {
				n = t[i];
				t[i] = n + "?uuid=" + this.__qrId + "&product=" + this.__product + "&rtid=" + r._$getRtid()
			}
		var s = e.userName;
		var a = {
			username: s,
			nextUrls: t,
			isThird: "3" == e.accountType ? 1 : 0,
			newQrCode: 1
		};
		s.indexOf("@") === -1 ? s += "@163.com" : null;
		if (!this.__prdomain || s.substring(s.indexOf("@")) == this.__prdomain) this.__qrLoginSucc(s, a);
		else {
			this.__changeState(1);
			var o = this.__prdomain ? "扫码失败，请使用" + this.__prdomain + "帐号扫码登录" : "请使用指定域名帐号扫码登录";
			this.__qrLoginErr(a, o)
		}
	};
	o.__doNewQrLogin = function (e) {
		this.__confirmLogin(e);
		this._$clearAllStatus();
		this.__checkQrLoginBc(e)
	};
	o.__doOldQrLogin = function (e) {
		this.__ticket = e.ticket;
		this.__confirmLogin(e);
		this._$clearAllStatus();
		this.__doQrLogin(e)
	};
	o.__doChangeUrl = function (e) {
		if (1 == this.__totalState) {
			if (this.__newQrCode) {
				this.__newQrCodeMbOk = 1;
				f = "https://q.reg.163.com/qrcode/qrcodeauth"
			}
			this.__scanIsComplete(e);
			this.__changeState(2);
			this.__restartTiming(1)
		}
	};
	o.__checkQrStatus = function () {
		var e = this;
		var t = function (t) {
			var i = t.retCode;
			switch (i) {
				case "200":
					if (e.__newQrCode && t && !t.userName) {
						e.__doChangeUrl(t);
						return
					}
					if (0 == e.__totalState) break;
					e.__changeState(2);
					if (e.__newQrCode) e.__doNewQrLogin(t);
					else e.__doOldQrLogin(t);
					break;
				case "401":
					if (1 != e.__totalState) break;
					e.__changeState(0);
					e.__codeLose(t);
					break;
				case "404":
					if (1 != e.__totalState) break;
					e.__changeState(0);
					e.__codeLose(t);
					break;
				case "408":
					break;
				case "409":
					if (1 != e.__totalState) break;
					if (e.__newQrCode) {
						e.__newQrCodeMbOk = 1;
						f = "https://q.reg.163.com/qrcode/qrcodeauth"
					}
					e.__scanIsComplete(t);
					e.__changeState(2);
					e.__restartTiming(1);
					break;
				case "500":
					if (1 != e.__totalState) break;
					e.__codeLose(t);
					e.__changeState(0)
			}
		};
		var i = {
			uuid: this.__qrId,
			product: this.__product
		};
		if (this.__newQrCode && this.__newQrCodeMbOk) {
			i.domains = this.__domains;
			i.newQrCode = 1
		}
		r._$requestJsonp(f, i, t)
	};
	o.__doQrLogin = function (e) {
		var t = this;
		var i = function (e) {
			var i = e.ret;
			if ("201" == i) {
				var n = e.username;
				n.indexOf("@") === -1 ? n += "@163.com" : null;
				if (!t.__prdomain || n.substring(n.indexOf("@")) == t.__prdomain) t.__qrLoginSucc(n, e);
				else {
					t.__changeState(1);
					var s = t.__prdomain ? "扫码失败，请使用" + t.__prdomain + "帐号扫码登录" : "请使用指定域名帐号扫码登录";
					t.__qrLoginErr(e, s)
				}
			} else {
				t.__changeState(0);
				t.__qrLoginErr(e)
			}
		};
		var n = {
			tk: this.__ticket,
			pd: this.__product,
			domains: this.__domains,
			pkid: this.__promark,
			channel: 3
		};
		var a = "qrlogin";
		if ("2" == e.accountType) {
			a = "mb-qrlogin";
			n.channel = 4
		}
		s._$request(a, n, i._$bind(this), i._$bind(this), 1)
	};
	o.__qrLoginSucc = function () { };
	o.__qrLoginErr = function () { };
	o.__confirmLogin = function () { };
	o.__scanIsComplete = function () { };
	o.__codeLose = function () { };
	o._$clearAllStatus = function () {
		clearInterval(this.__checkQrStIntv);
		this.__qrTiming = 0
	};
	o.__showQrcodeM = function () {
		if (this.__qrcodeDom) t._$delClassName(this.__qrcodeDom, "f-dn")
	};
	o.__hideQrcodeM = function () {
		if (this.__qrcodeDom) t._$addClassName(this.__qrcodeDom, "f-dn")
	};
	o.__showOWarm = function () {
		if (this.__oWarmDom) t._$delClassName(this.__oWarmDom, "f-dn")
	};
	o.__hideOWarm = function () {
		if (this.__oWarmDom) t._$addClassName(this.__oWarmDom, "f-dn")
	};
	o.__showScanSucc = function () {
		if (this.__qrSuccDom) t._$delClassName(this.__qrSuccDom, "f-dn")
	};
	o.__hideScanSucc = function () {
		if (this.__qrSuccDom) t._$addClassName(this.__qrSuccDom, "f-dn")
	};
	return o
}, "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "53c267efd983fb8c66cb645beead7a8d", "9a2eeb6403e6ff7ded02a3eabd637af9", "a4de926c2d79e8d8f856eaff4dac0f8b");
I$("be27b7248163984ec2f46cbffbbf3dab", function (e, t, i, n, s, a, r, o, c, d, _, l, u, f, h) {
	var p, m;
	l._$$QrcodeManager = e._$klass();
	p = l._$$QrcodeManager._$extend(r._$$Abstract);
	p.__init = function (e) {
		this.__product = e.product || "urs";
		this.__prdomain = e.prdomain || "";
		this.__toolName = e.toolName || "网易帐号管家";
		this.__toolUrl = e.toolUrl || "//id.163.com/gj/?from=webzj";
		this.__opts = e.opts;
		this.__super()
	};
	p.__reset = function (e) {
		this.__super(e);
		this.__fromModule = e.fromModule || "";
		this.__qrBox = t._$getByClassName(document, "m-qrcode")[0];
		if (o._$notURL(this.__toolUrl)) this.__toolUrl = "";
		if (this.__opts.goRegQr) {
			if ("mobile" == this.__fromModule) {
				this.__regQrUrl = this.__opts.goRegQr.goRegMbUrl || "https://aq.reg.163.com/ydaq/offline?needReg=1";
				this.__regQrTxt = this.__opts.goRegQr.goRegMbTxt || "去注册"
			} else {
				this.__regQrUrl = this.__opts.goRegQr.goRegEmailUrl || "https://zc.reg.163.com/regInitialized?pd=urszjmailreg&pkid=qzgcGfv&pkht=id.163.com";
				o._$useDefaultRegMailLog(this.__regQrUrl, "2");
				this.__regQrTxt = this.__opts.goRegQr.goRegEmailTxt || "去注册"
			} if (o._$notURL(this.__regQrUrl)) this.__regQrUrl = "";
			this.__goRegQrUrl.href = this.__regQrUrl || "";
			this.__goRegQrUrl.innerHTML = o._$HtmlEncode(this.__regQrTxt || "去注册")
		} else t._$addClassName(this.__goRegQrUrl, "f-dn");
		this.__tooApp.href = this.__toolUrl;
		this.__tooApp.innerHTML = o._$HtmlEncode(this.__toolName);
		this.__qrcodeDom = t._$getByClassName(this.__qrBox, "j-qrblock")[0];
		this.__qrImgDom = t._$getByClassName(this.__qrBox, "j-qrcode")[0];
		this.__qrOWarmDom = t._$getByClassName(this.__qrBox, "j-owarm")[0];
		this.__qrSuccDom = t._$getByClassName(this.__qrBox, "j-qrsucc")[0];
		this.__qrBackDom = t._$getByClassName(this.__qrBox, "j-qrback")[0];
		var i = {
			opts: this.__opts,
			newQrCode: this.__opts.newQrCode,
			fromModule: this.__fromModule,
			promark: this.__opts.promark,
			domains: this.__opts.domains,
			product: this.__product,
			prdomain: this.__prdomain,
			qrcodeDom: this.__qrcodeDom,
			imgDom: this.__qrImgDom,
			oWarmDom: this.__qrOWarmDom,
			qrSuccDom: this.__qrSuccDom,
			qrBackDom: this.__qrBackDom,
			qrLoginSucc: this.__qrLoginSucc._$bind(this),
			qrLoginErr: this.__qrLoginErr._$bind(this),
			confirmLogin: this.__confirmLogin._$bind(this),
			scanIsComplete: this.__scanIsComplete._$bind(this),
			codeLose: this.__codeLose._$bind(this)
		};
		d._$initQr(i);
		o._$resize()
	};
	p.__destroy = function () {
		this.__super();
		d._$clearAllStatus()
	};
	p.__initNode = function () {
		this.__super();
		this.__tooApp = t._$getByClassName(this.__body, "j-toolapp")[0];
		this.__goRegQrUrl = t._$getByClassName(this.__body, "j-goRegQrUrl")[0]
	};
	p.__initXGui = function () {
		m = s._$addNodeTemplate(a._$get("qrcode-tmp"));
		this.__seed_html = m
	};
	p.__qrLoginSucc = function (e, t) {
		this.__username = e;
		this.__doQrLoginSucc(t)
	};
	p.__doQrLoginSucc = function (e) {
		var t = e.nextUrls;
		var i = {
			type: "success",
			username: this.__username,
			isqr: 1,
			nextUrls: t,
			k: e.k || "",
			isThird: e.isThird || ""
		};
		if (!e.newQrCode) i.needPathbAndOpd = 1;
		this._$dispatchEvent("sendmsg", i);
		_gaq.push(["_trackEvent", "二维码登录", "【3】二维码登录结果", "扫码登录成功"])
	};
	p.__qrLoginErr = function (e, t) {
		var i = t || "扫码登录失败，请使用帐号密码登录";
		o._$showFail2(i)
	};
	p.__confirmLogin = function () {
		_gaq.push(["_trackEvent", "二维码登录", "【2】二维码确认", "用户确认登录"])
	};
	p.__scanIsComplete = function () {
		_gaq.push(["_trackEvent", "二维码登录", "【1】扫码", "扫码成功"])
	};
	p.__codeLose = function () {
		_gaq.push(["_trackEvent", "二维码登录", "【-】二维码异常", "二维码失效"])
	}
}, "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "12c5dab742044e15807978f676f5c3fc", "bff3d86ec4ea91399919ee4963badfeb", "e30f9e8af4c2bb3cff9252a9e1c3e5da", "a4de926c2d79e8d8f856eaff4dac0f8b", "7b21e2d34151b2744c99076d5be5823a", "8358c6f2f973f1bfd6290185a03b5423", "54120fa727d71cd38f3b1273d034afef");
I$("d6e36b6b1f96e15e42725a59e7acd142", function (e, t, i, n) {
	var s = {
		441: "请输入图片验证码",
		442: "请输入正确的验证码",
		"mb-nini-433": "系统繁忙，请刷新页面重试",
		"mb-nini-401": "操作超时，请刷新页面重试",
		"mb-nini--1": "网络不好，请刷新页面重试",
		"mb-nini--2": "网络不好，请刷新页面重试",
		"mb-nini-404": "网络不好，请刷新页面重试",
		"mb-nini-500": "系统繁忙，请您稍后再试",
		"mb-nini-0": "网络不好，请刷新页面重试",
		"mb-nlgt-433": "系统繁忙，请刷新页面重试",
		"mb-nlgt-401": "操作超时，请刷新页面重试",
		"mb-nlgt-40110": "手机号格式错误",
		"mb-nlgt--1": "网络不好，请刷新页面重试",
		"mb-nlgt--2": "网络不好，请刷新页面重试",
		"mb-nlgt-404": "网络不好，请刷新页面重试",
		"mb-nlgt-500": "系统繁忙，请您稍后再试",
		"mb-nlgt-0": "网络不好，请刷新页面重试",
		"mb-nvfcp-433": "系统繁忙，请刷新页面重试",
		"mb-nvfcp-442": "请输入正确的验证码",
		"mb-nvfcp-401": "操作超时，请刷新页面重试",
		"mb-nvfcp-441": "请输入图片验证码",
		"mb-nvfcp--1": "网络不好，请刷新页面重试",
		"mb-nvfcp--2": "网络不好，请刷新页面重试",
		"mb-nvfcp-404": "网络不好，请刷新页面重试",
		"mb-nvfcp-500": "系统繁忙，请您稍后再试",
		"mb-nvfcp-0": "网络不好，请刷新页面重试",
		"mb-nvfcp-505": "次数超限，请稍后再试",
		"mb-nvftcp-433": "系统繁忙，请刷新页面重试",
		"mb-nvftcp-401": "操作超时，请刷新页面重试",
		"mb-nvftcp-441": "请输入图片验证码",
		"mb-nvftcp--1": "网络不好，请刷新页面重试",
		"mb-nvftcp--2": "网络不好，请刷新页面重试",
		"mb-nvftcp-404": "网络不好，请刷新页面重试",
		"mb-nvftcp-500": "系统繁忙，请您稍后再试",
		"mb-nvftcp-0": "网络不好，请刷新页面重试",
		"mb-nvftcp-505": "次数超限，请稍后再试",
		"mb-nvfccp-433": "系统繁忙，请刷新页面重试",
		"mb-nvfccp-401": "操作超时，请刷新页面重试",
		"mb-nvfccp-441": "请输入图片验证码",
		"mb-nvfccp--1": "网络不好，请刷新页面重试",
		"mb-nvfccp--2": "网络不好，请刷新页面重试",
		"mb-nvfccp-404": "网络不好，请刷新页面重试",
		"mb-nvfccp-500": "系统繁忙，请您稍后再试",
		"mb-nvfccp-0": "网络不好，请刷新页面重试",
		"mb-nvfccp-505": "次数超限，请稍后再试",
		"mb-nlregssms-433": "系统繁忙，请刷新页面重试",
		"mb-nlregssms-635": "该帐号在考察期（24小时）内，请使用原手机号登录",
		"mb-nlregssms-410": "超过IP限制，请稍后再试",
		"mb-nlregssms-412": "操作存在风险，请更换手机或切换网络后重试",
		"mb-nlregssms-413": "验证码发送超过限制，请改天再试",
		"mb-nlregssms-441": "请输入图片验证码",
		"mb-nlregssms-422": '该帐号已被锁定，<a target="_blank" href="https://aq.reg.163.com/ydaq/welcome?module=offAccountUnlock" style="color:#4aafe9;text-decoration:underline;">尝试解锁</a>。',
		"mb-nlregssms-602": '帐号长期未使用已冻结，请<a target="_blank" href="https://aq.reg.163.com/ydaq/welcome?module=offAccountAppeal">自助解冻</a>',
		"mb-nlregssms-401": "操作超时，请刷新页面重试",
		"mb-nlregssms-40110": "手机号格式错误",
		"mb-nlregssms-40120": "手机号码请勿以“0”开头",
		"mb-nlregssms--1": "网络不好，请刷新页面重试",
		"mb-nlregssms--2": "网络不好，请刷新页面重试",
		"mb-nlregssms-404": "网络不好，请刷新页面重试",
		"mb-nlregssms-500": "系统繁忙，请您稍后再试",
		"mb-nlregssms-0": "网络不好，请刷新页面重试",
		"mb-nlregssms-505": "次数超限，请稍后再试",
		"mb-nlregssms-6351": "该帐号正在注销中，无法登录",
		"mb-nlregvfsms-415": "请先获取验证码",
		"mb-nlregvfsms-40901": "您的操作太频繁，请稍后再试",
		"mb-nlregvfsms-401": "操作超时，请刷新页面重试",
		"mb-nlregvfsms-402": "当前网络异常，请检查您的网络环境",
		"mb-nlregvfsms-40110": "手机号格式错误",
		"mb-nlregvfsms-40120": "手机号码请勿以“0”开头",
		"mb-nlregvfsms-409": "您的操作太频繁，请稍后再试",
		"mb-nlregvfsms-410": "超过IP限制，请稍后再试",
		"mb-nlregvfsms-412": "验证码验证错误次数过多，请稍后再试",
		"mb-nlregvfsms-413": "帐号或验证码错误",
		"mb-nlregvfsms-416": "您的IP登录过于频繁，请稍后再试",
		"mb-nlregvfsms-433": "系统繁忙，请刷新页面重试",
		"mb-nlregvfsms-420": "该手机帐号未注册",
		"mb-nlregvfsms-422": '该帐号已被锁定，<a target="_blank" href="https://aq.reg.163.com/ydaq/welcome?module=offAccountUnlock" style="color:#4aafe9;text-decoration:underline;">尝试解锁</a>。',
		"mb-nlregvfsms-41201": "您登录错误次数过多，请稍后再试",
		"mb-nlregvfsms-41301": "您登录错误验证码次数过多，请稍后再试",
		"mb-nlregvfsms-41302": "您登录错误验证码次数过多，请明天再试",
		"mb-nlregvfsms-41303": "您的IP登录错误验证码次数过多，请稍后再试",
		"mb-nlregvfsms-41401": "您的IP登录错误次数过多，请稍后再试",
		"mb-nlregvfsms-41701": "您的IP登录成功次数过多，请稍后再试",
		"mb-nlregvfsms-41801": "您登录成功次数过多，请稍后再试",
		"mb-nlregvfsms-41901": "您登录过于频繁，请稍后再试",
		"mb-nlregvfsms-41902": "您的IP登录过于频繁，请稍后再试",
		"mb-nlregvfsms-443": "请输入正确的短信验证码",
		"mb-nlregvfsms-44302": "<strong>系统未收到短信，请重新发送短信验证</strong>",
		"mb-nlregvfsms-40107": '请设置<a target="_blank" href="https://www.baidu.com/s?wd=safari%E5%BC%80%E5%90%AFcookie">浏览器接受第三方cookie</a>，或者更换浏览器尝试',
		"mb-nlregvfsms--1": "网络不好，请刷新页面重试",
		"mb-nlregvfsms--2": "网络不好，请刷新页面重试",
		"mb-nlregvfsms-404": "网络不好，请刷新页面重试",
		"mb-nlregvfsms-500": "系统繁忙，请您稍后再试",
		"mb-nlregvfsms-503": "服务器繁忙，请稍后再试",
		"mb-nlregvfsms-0": "网络不好，请刷新页面重试",
		"mb-nlregvfsms-602": '帐号长期未使用已冻结，请<a target="_blank" href="https://aq.reg.163.com/ydaq/welcome?module=offAccountAppeal">自助解冻</a>',
		"mb-nlregvfsms-635": "该帐号在考察期（24小时）内，请使用原手机号登录",
		"mb-nlregvfsms-6351": "该帐号正在注销中，无法登录",
		"mb-ini-433": "系统繁忙，请刷新页面重试",
		"mb-ini-401": "操作超时，请刷新页面重试",
		"mb-ini--1": "网络不好，请刷新页面重试",
		"mb-ini--2": "网络不好，请刷新页面重试",
		"mb-ini-404": "网络不好，请刷新页面重试",
		"mb-ini-500": "系统繁忙，请您稍后再试",
		"mb-ini-0": "网络不好，请刷新页面重试",
		"mb-gt-401": "操作超时，请刷新页面重试",
		"mb-gt-40110": "手机号格式错误",
		"mb-gt--1": "网络不好，请刷新页面重试",
		"mb-gt--2": "网络不好，请刷新页面重试",
		"mb-gt-404": "网络不好，请刷新页面重试",
		"mb-gt-500": "系统繁忙，请您稍后再试",
		"mb-gt-0": "网络不好，请刷新页面重试",
		"mb-vfcp-442": "请输入正确的验证码",
		"mb-vfcp-401": "操作超时，请刷新页面重试",
		"mb-vfcp-441": "请输入图片验证码",
		"mb-vfcp--1": "网络不好，请刷新页面重试",
		"mb-vfcp--2": "网络不好，请刷新页面重试",
		"mb-vfcp-404": "网络不好，请刷新页面重试",
		"mb-vfcp-500": "系统繁忙，请您稍后再试",
		"mb-vfcp-0": "网络不好，请刷新页面重试",
		"mb-vfcp-505": "次数超限，请稍后再试",
		"mb-vftcp-442": "请输入正确的验证码",
		"mb-vftcp-401": "操作超时，请刷新页面重试",
		"mb-vftcp-441": "请输入图片验证码",
		"mb-vftcp--1": "网络不好，请刷新页面重试",
		"mb-vftcp--2": "网络不好，请刷新页面重试",
		"mb-vftcp-404": "网络不好，请刷新页面重试",
		"mb-vftcp-500": "系统繁忙，请您稍后再试",
		"mb-vftcp-0": "网络不好，请刷新页面重试",
		"mb-vftcp-505": "次数超限，请稍后再试",
		"mb-vfccp-442": "请输入正确的验证码",
		"mb-vfccp-401": "操作超时，请刷新页面重试",
		"mb-vfccp-441": "请输入图片验证码",
		"mb-vfccp--1": "网络不好，请刷新页面重试",
		"mb-vfccp--2": "网络不好，请刷新页面重试",
		"mb-vfccp-404": "网络不好，请刷新页面重试",
		"mb-vfccp-500": "系统繁忙，请您稍后再试",
		"mb-vfccp-0": "网络不好，请刷新页面重试",
		"mb-vfccp-505": "次数超限，请稍后再试",
		"mb-login-403": "网络异常，建议切换网络或稍后重试",
		"mb-login-401": "操作超时，请刷新页面重试",
		"mb-login-40110": "手机号格式错误",
		"mb-login-40120": "手机号码请勿以“0”开头",
		"mb-login-409": "您的操作太频繁，请稍后再试",
		"mb-login-413": "帐号或密码错误",
		"mb-login-402": "当前网络异常，请检查您的网络环境",
		"mb-login-433": "系统繁忙，请刷新页面重试",
		"mb-login-410": "超过IP限制，请稍后再试",
		"mb-login-420": "该手机帐号未注册",
		"mb-login-422": '该帐号已被锁定，<a target="_blank" href="https://aq.reg.163.com/ydaq/welcome?module=offAccountUnlock" style="color:#4aafe9;text-decoration:underline;">尝试解锁</a>。',
		"mb-login-602": '帐号长期未使用已冻结，请<a target="_blank" href="https://aq.reg.163.com/ydaq/welcome?module=offAccountAppeal">自助解冻</a>',
		"mb-login-609": "请通过手机短信登录",
		"mb-login-635": "该帐号在考察期（24小时）内，请使用原手机号登录",
		"mb-login-41201": "您登录错误次数过多，请稍后再试",
		"mb-login-41202": "您登录错误次数过多，请明天再试",
		"mb-login-41301": "您登录密码错误次数过多，请稍后再试",
		"mb-login-41302": "您登录密码错误次数过多，请明天再试",
		"mb-login-41303": "您的IP登录密码错误次数过多，请稍后再试",
		"mb-login-41401": "您的IP登录错误次数过多，请稍后再试",
		"mb-login-41402": "您的IP登录错误次数过多，请明天再试",
		"mb-login-41701": "您的IP登录成功次数过多，请稍后再试",
		"mb-login-41702": "您的IP登录成功次数过多，请明天再试",
		"mb-login-41801": "您登录成功次数过多，请稍后再试",
		"mb-login-41802": "您登录成功次数过多，请明天再试",
		"mb-login-416": "您的IP登录过于频繁，请稍后再试",
		"mb-login-41901": "您登录过于频繁，请稍后再试",
		"mb-login-41902": "您的IP登录过于频繁，请稍后再试",
		"mb-login-441": "请输入图片验证码",
		"mb-login-40107": '请设置<a target="_blank" href="https://www.baidu.com/s?wd=safari%E5%BC%80%E5%90%AFcookie">浏览器接受第三方cookie</a>，或者更换浏览器尝试',
		"mb-login--1": "网络不好，请刷新页面重试",
		"mb-login--2": "网络不好，请刷新页面重试",
		"mb-login-404": "网络不好，请刷新页面重试",
		"mb-login-500": "系统繁忙，请您稍后再试",
		"mb-login-503": "服务器繁忙，请稍后再试",
		"mb-login-0": "网络不好，请刷新页面重试",
		"mb-login-6351": "该帐号正在注销中，无法登录",
		"mb-lvfsms-415": "请先获取验证码",
		"mb-lvfsms-635": "该帐号在考察期（24小时）内，请使用原手机号登录",
		"mb-lvfsms-443": "请输入正确的短信验证码",
		"mb-lvfsms-44302": "<strong>系统未收到短信，请重新发送短信验证</strong>",
		"mb-lvfsms-409": "您的操作太频繁，请稍后再试",
		"mb-lvfsms-410": "超过IP限制，请稍后再试",
		"mb-lvfsms-441": "请输入图片验证码",
		"mb-lvfsms-412": "短信验证错误次数过多，请稍后再试",
		"mb-lvfsms-41201": "您登录错误次数过多，请稍后再试",
		"mb-lvfsms-41202": "您登录错误次数过多，请明天再试",
		"mb-lvfsms-41301": "您的短信验证错误次数过多，请稍后再试",
		"mb-lvfsms-41302": "您的短信验证错误次数过多，请明天再试",
		"mb-lvfsms-41303": "您的IP登录错误验证码次数过多，请稍后再试",
		"mb-lvfsms-41401": "您的IP登录错误次数过多，请稍后再试",
		"mb-lvfsms-41402": "您的IP登录错误次数过多，请明天再试",
		"mb-lvfsms-41701": "您的IP登录成功次数过多，请稍后再试",
		"mb-lvfsms-41702": "您的IP登录成功次数过多，请明天再试",
		"mb-lvfsms-41801": "您登录成功次数过多，请稍后再试",
		"mb-lvfsms-41802": "您登录成功次数过多，请明天再试",
		"mb-lvfsms-416": "您的IP登录过于频繁,请稍后再试",
		"mb-lvfsms-41901": "您登录过于频繁，请稍后再试",
		"mb-lvfsms-41902": "您的IP登录过于频繁，请稍后再试",
		"mb-lvfsms-420": "该手机帐号未注册",
		"mb-lvfsms-422": '该帐号已被锁定，<a target="_blank" href="https://aq.reg.163.com/ydaq/welcome?module=offAccountUnlock" style="color:#4aafe9;text-decoration:underline;">尝试解锁</a>。',
		"mb-lvfsms-602": '帐号长期未使用已冻结，请<a target="_blank" href="https://aq.reg.163.com/ydaq/welcome?module=offAccountAppeal">自助解冻</a>',
		"mb-lvfsms-402": "当前网络异常，请检查您的网络环境",
		"mb-lvfsms-401": "操作超时，请刷新页面重试",
		"mb-lvfsms-40120": "手机号码请勿以“0”开头",
		"mb-lvfsms-40110": "手机号格式错误",
		"mb-lvfsms-40109": "手机号格式错误",
		"mb-lvfsms--1": "网络不好，请刷新页面重试",
		"mb-lvfsms--2": "网络不好，请刷新页面重试",
		"mb-lvfsms-404": "网络不好，请刷新页面重试",
		"mb-lvfsms-500": "系统繁忙，请您稍后再试",
		"mb-lvfsms-0": "网络不好，请刷新页面重试",
		"mb-lvfsms-6351": "该帐号正在注销中，无法登录",
		"mb-sms-lsm-10710": "请输入图片验证码",
		"mb-sms-lsm-635": "该帐号在考察期（24小时）内，请使用原手机号登录",
		"mb-sms-lsm-407": "该帐号已注册",
		"mb-sms-lsm-410": "超过IP限制，请稍后再试",
		"mb-sms-lsm-412": "短信验证错误超过限制，请稍后再试",
		"mb-sms-lsm-413": "短信验证超过限制，请改天再试",
		"mb-sms-lsm-441": "请输入图片验证码",
		"mb-sms-lsm-420": "该手机帐号未注册",
		"mb-sms-lsm-442": "请输入正确的验证码",
		"mb-sms-lsm-422": '该帐号已被锁定，<a target="_blank" href="https://aq.reg.163.com/ydaq/welcome?module=offAccountUnlock" style="color:#4aafe9;text-decoration:underline;">尝试解锁</a>。',
		"mb-sms-lsm-602": '帐号长期未使用已冻结，请<a target="_blank" href="https://aq.reg.163.com/ydaq/welcome?module=offAccountAppeal">自助解冻</a>',
		"mb-sms-lsm-401": "操作超时，请刷新页面重试",
		"mb-sms-lsm-40110": "手机号格式错误",
		"mb-sms-lsm-40109": "手机号格式错误",
		"mb-sms-lsm--1": "网络不好，请刷新页面重试",
		"mb-sms-lsm--2": "网络不好，请刷新页面重试",
		"mb-sms-lsm-404": "网络不好，请刷新页面重试",
		"mb-sms-lsm-500": "系统繁忙，请您稍后再试",
		"mb-sms-lsm-0": "网络不好，请刷新页面重试",
		"mb-sms-lsm-505": "次数超限，请稍后再试",
		"mb-sms-lsm-6351": "该帐号正在注销中，无法登录",
		"mb-reg-sm-10700": "请输入图片验证码",
		"mb-reg-sm-407": "该帐号已注册",
		"mb-reg-sm-410": "超过IP限制，请稍后再试",
		"mb-reg-sm-108": "请输入图片验证码",
		"mb-reg-sm-441": "请输入图片验证码",
		"mb-reg-sm-41201": "短信验证超过限制，请改天再试",
		"mb-reg-sm-41202": "短信验证错误超过限制，请稍后再试",
		"mb-reg-sm-401": "操作超时，请刷新页面重试",
		"mb-reg-sm-40112": "手机号格式错误",
		"mb-reg-sm-40113": "手机号格式错误",
		"mb-reg-sm-40120": "手机号码请勿以“0”开头",
		"mb-reg-sm--1": "网络不好，请刷新页面重试",
		"mb-reg-sm--2": "网络不好，请刷新页面重试",
		"mb-reg-sm-404": "网络不好，请刷新页面重试",
		"mb-reg-sm-500": "系统繁忙，请您稍后再试",
		"mb-reg-sm-0": "网络不好，请刷新页面重试",
		"mb-reg-sm-433": "系统繁忙，请刷新页面重试",
		"mb-reg-sm-635": "该帐号在考察期（24小时）内，请使用原手机号登录",
		"mb-reg-sm-6351": "该帐号正在注销中，无法登录",
		"mb-reg-vfsms-417": "请先获取验证码",
		"mb-reg-vfsms-402": "当前网络异常，请检查您的网络环境",
		"mb-reg-vfsms-409": "您的操作太频繁，请稍后再试",
		"mb-reg-vfsms-410": "超过IP限制，请稍后再试",
		"mb-reg-vfsms-407": "该帐号已注册",
		"mb-reg-vfsms-412": "短信验证错误次数过多，请稍后再试",
		"mb-reg-vfsms-413": "请输入正确的验证码",
		"mb-reg-vfsms-41302": "<strong>系统未收到短信，请重新发送短信验证</strong>",
		"mb-reg-vfsms-401": "操作超时，请刷新页面重试",
		"mb-reg-vfsms-40112": "手机号格式错误",
		"mb-reg-vfsms-40113": "手机号格式错误",
		"mb-reg-vfsms-40120": "手机号码请勿以“0”开头",
		"mb-reg-vfsms--1": "网络不好，请刷新页面重试",
		"mb-reg-vfsms--2": "网络不好，请刷新页面重试",
		"mb-reg-vfsms-404": "网络不好，请刷新页面重试",
		"mb-reg-vfsms-500": "系统繁忙，请您稍后再试",
		"mb-reg-vfsms-635": "该帐号在考察期（24小时）内，请使用原手机号登录",
		"mb-reg-vfsms-6351": "该帐号正在注销中，无法登录",
		"mb-reg-vfsms-0": "网络不好，请刷新页面重试",
		"mb-reg-vfsms-433": "系统繁忙，请刷新页面重试",
		"mb-reg-ini-433": "系统繁忙，请刷新页面重试",
		"mb-reg-ini-401": "操作超时，请刷新页面重试",
		"mb-reg-ini--1": "网络不好，请刷新页面重试",
		"mb-reg-ini--2": "网络不好，请刷新页面重试",
		"mb-reg-ini-404": "网络不好，请刷新页面重试",
		"mb-reg-ini-500": "系统繁忙，请您稍后再试",
		"mb-reg-ini-0": "网络不好，请刷新页面重试"
	};
	return s
});
I$("968ba3167101c772e3f6362803b987d8", function (e, t, i, n, s, a, r, o, c, d, _, l, u, f, h, p) {
	var m = o.extend({
		data: {},
		destroy: function (e) {
			window._$needCookieSet = 0;
			this.supr(e)
		},
		initCapByInit: function (e) {
			var t = e.capFlag || e.cf;
			this.__capFlag = t;
			this.__needPopup = 0;
			r._$setAiCapId(e);
			this.resetCapFlag();
			if (6 == t) {
				this.data.forceNoAuto = 1;
				this.setAiCap()
			} else if (1 == t) this.data.hasImgCap = 1;
			else if (4 == t || 5 == t) {
				this.data.hasSlide = 1;
				this.data.slideTarget = r._$getMbCapFlag(this.__capFlag);
				if (this.__isNewCapPopup) {
					this.__needPopup = 1;
					this.data.hasSlide = 0
				}
			}
		},
		setAiCap: function () {
			var e;
			if (this.$refs.smsinput) e = this.$refs.smsinput.getAiBtn();
			else e = this.$refs.loginBtn;
			r._$setAiBtn(e);
			this.data.hasAiCap = 1;
			this.data.slideTarget = r._$getMbCapFlag(this.__capFlag)
		},
		resetCapFlag: function () {
			this.data.hasImgCap = 0;
			this.data.hasSlide = 0;
			this.data.hasAiCap = 0
		},
		doShow401Error: function (e, t, i, n) {
			var s, a = n.ret;
			if ("-401" != e) {
				if ("401" == e) e = i + a;
				else e = i + a + (n.dt || "");
				var o = {
					tabIndex: -1,
					str: d[e] || r._$getErrorTxt(a),
					node: "nerror"
				};
				this._$doShowError(o)
			} else {
				s = t ? "登录" : "注册";
				this._$doShowError({
					tabIndex: -1,
					str: r._$get401Error(s),
					node: "nerror"
				});
				window._$needCookieSet = 1
			}
		},
		getSlideTarget: function () {
			return this.data.slideTarget
		},
		doShowInitFail: function (e) {
			var t = "-103";
			r._$showFail(t, e)
		},
		doShowError: function (e) {
			if (!e.node) e.node = "nerror";
			this._$doShowError(e)
		},
		rmError: function (e) {
			if (!e.node) e.node = "nerror";
			this._$removeError(e)
		},
		doRefreshCap: function (e) {
			e = e || {};
			this.refreshCaps(null, e.code, e.forceNoAuto);
			if (e.hasError) this.doShowError(e.hasError)
		},
		refreshCaps: function (e, t, i) {
			setTimeout(function () {
				r._$resize()
			}, 200);
			if (!r._$isCapCode(t)) this.doRefreshCapByNormalCode(e, t, i);
			else {
				this.resetCaps();
				this.nextShowCap(t, i)
			}
		},
		doRefreshCapByNormalCode: function (e, t, i) {
			if ("mb-lvfsms-" != e) {
				if (this.data.hasImgCap && "411" != t) this.$refs.captcha._$refreshImg();
				if (this.data.hasSlide || this.data.hasAiCap) {
					this.$refs.slidecap._$setForceNoAuto(i);
					this.$refs.slidecap.refreshSlide()
				}
			}
			this.$update()
		},
		resetCaps: function () {
			this.resetCapFlag();
			if (this.$refs.captcha) this.$refs.captcha.destroy();
			this.$refs.captcha = null;
			delete this.$refs.captcha;
			if (this.$refs.slidecap) this.$refs.slidecap.destroy();
			this.$refs.slidecap = null;
			delete this.$refs.slidecap;
			this.$update()
		},
		nextShowCap: function (e, t) {
			setTimeout(function () {
				if ("447" == e) {
					this.__capFlag = 6;
					this.data.forceNoAuto = t || !1;
					this.setAiCap()
				} else if ("441" == e) {
					this.__capFlag = 1;
					this.data.hasImgCap = 1
				} else if ("444" == e || "445" == e) {
					this.__capFlag = "444" == e ? 4 : 5;
					this.data.slideTarget = r._$getMbCapFlag(this.__capFlag);
					this.data.hasSlide = 1
				}
				this.$update()
			}._$bind(this), 10)
		},
		onShowErr: function (t, i, n, s) {
			var a = t.ret,
				o = "";
			if (a.indexOf("451") > -1 && this.$refs && this.$refs.mninput) o = this.$refs.mninput._$getValueForUrl().trim() || "";
			var c = d[a] || r._$getErrorTxt(a, o);
			if (s && s.sourceTxt) c += s.sourceTxt;
			if (t.pcUrl && t.h5Url)
				if (e._$is("desktop"))
					if (1 == window._$URSOPT.enlang) c = l.showText("帐号长期未使用已冻结，请", 1) + '<a target="_blank" href="' + t.pcUrl + '">' + l.showText("自助解冻", 1) + "</a>";
					else c = '帐号长期未使用已冻结，请<a target="_blank" href="' + t.pcUrl + '">自助解冻</a>';
				else if (1 == window._$URSOPT.enlang) c = l.showText("帐号长期未使用已冻结，请", 1) + '<a target="_blank" href="' + t.h5Url + '">' + l.showText("自助解冻", 1) + "</a>";
				else c = '帐号长期未使用已冻结，请<a target="_blank" href="' + t.h5Url + '">自助解冻</a>';
			var _ = {
				tabIndex: i || -1,
				str: c,
				node: "nerror",
				type: n || ""
			};
			var u = a.split("-"),
				f = u[u.length - 1];
			if ("4503" === f && this.$refs && this.$refs.mninput) _.target = this.$refs.mninput._$getInputRef();
			this._$doShowError(_)
		},
		_trySetArea: function (e) {
			try {
				var t = e.split("-")[0];
				if (t) {
					t = ["+", t, "-"].join("");
					this.$refs.mninput._$setCountry(t, 1)
				}
			} catch (i) { }
		},
		_trySetMobile: function () {
			var e = window._$URS.saveTempMobile || this.data.saveTempMobile;
			if (this.$refs.mninput && e) {
				this.$refs.mninput.trySetMobile(e);
				window._$URS.saveTempMobile = ""
			}
		},
		__fail5: function () {
			var e = "mb" + this.data.channel;
			if (r._$fail5(e)) return !0
		},
		__fail5check: function () {
			var e = "mb" + this.data.channel;
			if (r._$fail5check(e)) return !0
		},
		onUnLockVerify: function () {
			this.data.isVerifyLock = 0;
			this.$update()
		},
		onLockVerify: function () {
			this.data.isVerifyLock = 1;
			this.$update()
		}
	});
	return m
}, "a878c0216188111f46d39b9df767b354", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a13cd829d734e255809c920485d5a6b2", "bff3d86ec4ea91399919ee4963badfeb", "a4de926c2d79e8d8f856eaff4dac0f8b", "f1fc556eafb5676910602a7f1fa3af8e", "53c267efd983fb8c66cb645beead7a8d", "d6e36b6b1f96e15e42725a59e7acd142", "54120fa727d71cd38f3b1273d034afef", "46a4de3a50f50a600950ca9cee88031e");
I$("b62616ba5d59a47ea54fc057cbcd66b8", function (e, t, i, n, s, a, r, o, c, d, _, l, u, f, h, p) {
	var m = r.caluseErrIndex;
	var g = o.extend({
		data: {},
		config: function (e) {
			i._$merge(this.data, e || {});
			if (r._$isVersionFour()) this.data.isVersionFour = !0;
			this.data.pwdfind = "https://aq.reg.163.com/ydaq/welcome?module=offlinePasswordFind";
			this.data.hasQuestion = this.data.hasQuestion || "https://aq.reg.163.com/ydaq/offline";
			this.supr(e)
		},
		watchLoginClause: function (e) {
			if (e && !this.data.isupmodule) this._$removeError({
				tabIndex: m,
				node: "nerror"
			})
		},
		destroy: function (e) {
			if (this.shakesto) this.shakesto = clearTimeout(this.shakesto);
			this.supr(e)
		},
		init: function (e) {
			if (this.data.mobileUnLoginTime) this.data.unLoginSelected = 1;
			else this.data.unLoginSelected = 0;
			this.errorIndex = -1;
			this.errorIndexMap = {};
			this.$watch("ckboxOk", this.watchLoginClause._$bind(this));
			if (this.data.noqr) {
				var t = n._$getByClassName(document, "j-btnqrcode")[0];
				n._$addClassName(t, "f-dn")
			}
			this.supr(e);
			var i, s;
			if (!this.data.uniteLogin && this.data.mbRegGuide) {
				i = this.data.mbRegGuide;
				i = "1" == i ? "去注册" : r._$HtmlEncode(i);
				if (this.data.mbLogin && this.data.mbLogin.mbRegGuideUrl) {
					s = this.data.mbLogin.mbRegGuideUrl || "";
					if (r._$notURL(s)) s = "";
					i = r._$getNoRegHtml({
						mbRegGuide: i,
						regGuideUrl: s
					})
				} else i = r._$getNoRegHtml({
					mbRegGuide: i,
					mdtype: 1
				});
				d["mb-login-420"] = i;
				d["mb-lvfsms-420"] = i;
				d["mb-sms-lsm-420"] = i
			} else if (this.data.uniteLogin && this.data.uniteLogin.goUniteLoginForRegTxt) {
				i = this.data.uniteLogin.goUniteLoginForRegTxt;
				i = r._$HtmlEncode(i);
				if (this.data.uniteLogin.goUniteLoginForRegUrl) {
					s = this.data.uniteLogin.goUniteLoginForRegUrl;
					if (r._$notURL(s)) s = "";
					i = r._$getNoRegHtml({
						mbRegGuide: i,
						regGuideUrl: s
					})
				} else i = r._$getNoRegHtml({
					mbRegGuide: i,
					uniteLogin: 1
				});
				d["mb-login-420"] = i
			}
			if (this.data.mbNoSms) d["mb-login-609"] = '请使用<a class="u-goSmsLogin" data-action="goSmsLogin" href="javascript:void(0);">短信验证登录</a>'
		},
		doEnter: function (e) {
			var t = e.keyCode;
			if (13 == t) {
				if ("login" === this.data.page) {
					if (this.__ml && "1" == this.__config2.channel) this.__ml.doLogin();
					if (this.__msl && "2" == this.__config2.channel) this.__msl.doLogin();
					if (this.__uml && "14" == this.__config2.channel) this.__uml.doLogin()
				}
				if ("register" === this.data.page && this.__mbreg) this.__mbreg.doReg()
			}
		},
		getUn: function (e) {
			return this.$refs.mninput._$getValue(e).trim()
		},
		iniSuccess: function (e) {
			this.__isNewCapPopup = "popup" == this.data.mode;
			if (this.$refs) {
				this._$doToggleLoingLockMb();
				this.data.initSuccess = 1;
				this.initCapByInit(e);
				this._$postMessage({
					type: "mbInitSuccess"
				});
				this.$update();
				setTimeout(function () {
					if (this.data.focusHelper) this.$refs.mninput._$focusHelper();
					this._$resize()
				}._$bind(this), 200)
			}
		},
		iniError: function (e, t) {
			var i = t.ret,
				n;
			if ("mb-reg-ini-" == e) n = 0;
			else n = 1;
			this.data.initSuccess = -1;
			if (!window._$URSOPT.from3Cdn)
				if (window._$needUrsBgp)
					if (!this.tmpBgp && ("-2" == i || "-1" == i || "0" == i)) {
						this.tmpBgp = 1;
						if (n) window._$BGP = 1;
						else window._$BGPZC = 1;
						setTimeout(this.doInit._$bind(this, 1), 200);
						return
					}
			this.doShow401Error(i, n, e, t)
		},
		doClick: function (e) {
			var i = t._$getElement(e),
				s = n._$dataset(i, "link");
			if (s) r._$doThirdLogin(e)
		},
		doPreFill: function () {
			var e = _._$cookie("regmbcookiename");
			var t = _._$cookie("THE_LAST_LOGIN_MOBILE");
			if (this.data.preFilledMobile && "login" == this.data.module) {
				if (1 != this.data.preRegDisabled) this.$emit("delPreFill");
				this.$refs.mninput._$setValue(this.data.preFilledMobile);
				if (1 == this.data.preRegDisabled) this.data.preDisabled = !0;
				else this.data.preDisabled = !1
			} else if (!this._trySetDesMobile()) {
				if (!window._$URS.setMobileFromCookie)
					if (e && e.indexOf("-") < 0 && "login" == this.data.module) {
						this.$refs.mninput._$setValue(e);
						window._$URS.setMobileFromCookie = !0;
						_._$cookie("regmbcookiename", {
							expires: -1,
							path: "/"
						})
					} else if (t && t.indexOf("-") < 0 && "login" == this.data.module) {
						window._$URS.setMobileFromCookie = !0;
						this.$refs.mninput._$setValue(t)
					}
				if (window._$URSOPT.rmbArea && t.indexOf("-") !== -1 && !window._$URSOPT.firstArea && !this.data.preFilledMobile) this._trySetArea(t);
				this._trySetMobile()
			}
			this.$update()
		},
		_trySetDesMobile: function () {
			if (r._$isDes()) {
				this.$refs.mninput._$setValue(window._$URSOPT.desMobile, "isDes");
				this.$refs.mninput._$setCountry("+86-", 1)
			}
			return r._$isDes()
		},
		doInit: function (e) {
			if (1 != e) this.doPreFill();
			var t = {};
			t.pd = this.data.product;
			t.pkid = this.data.promark;
			t.pkht = this.data.host || "";
			t.channel = this.data.channel;
			this.data.initSuccess = 0;
			c._$request("mb-ini", t, this.iniSuccess._$bind(this), this.iniError._$bind(this, "mb-ini-"), 1)
		},
		__getUserName: function () {
			return {
				username: this.__username
			}
		},
		loginSuccess: function (e, t) {
			var i = this.__getUserName();
			var n = e ? "密码方式" : "验证码方式";
			_gaq.push(["_trackEvent", "手机帐号登录", "登录成功", n + "###" + JSON.stringify(i)]);
			MP.getCookieId("l_yd_sign", function (e) {
				if ("null" != e) _._$cookie("l_yd_sign", {
					value: e,
					expires: 3650,
					path: "/"
				});
				if (!r._$isDes()) _._$cookie("THE_LAST_LOGIN_MOBILE", {
					value: this.__username,
					expires: 30,
					path: "/"
				});
				this._$setDomainsHasPathBAndOpd({
					type: "success",
					username: this.__username || "",
					nextUrls: t.nextUrls,
					k: t.k || ""
				})
			}._$bind(this))
		},
		loginError: function (e, t) {
			var n = -1,
				s;
			var a = t.ret;
			this.doUnlockLogin();
			if ("mb-login-" === e)
				if ("401" == a && i._$indexOf(["20", "10"], t.dt) === -1) t.ret = e + a;
				else t.ret = e + a + (t.dt || "");
			else if ("401" == a && i._$indexOf(["09", "10", "20"], t.dt) === -1) t.ret = e + a;
			else t.ret = e + a + (t.dt || "");
			this.__capFlag = t.capFlag || this.__capFlag;
			if (r._$isCapCode(a)) {
				this.refreshCaps(e, a);
				if ("447" === a) {
					this.$update();
					return
				}
			} else if ("mb-login-" === e && "6" == this.__capFlag) this.refreshCaps(e, "447", 1);
			else if ("mb-login-" === e && "1" == this.__capFlag) this.refreshCaps(e, "441");
			else if ("mb-login-" === e && ("4" == this.__capFlag || "5" == this.__capFlag)) {
				this.data.slideTarget = r._$getMbCapFlag(this.__capFlag);
				if (this.__isNewCapPopup) this.destroyNewCap();
				else this.refreshCaps(e, "44" + this.__capFlag)
			}
			if ("07" == t.dt || "602" == a) s = 2;
			if ("422" == a) s = 2;
			this.$update();
			this.onShowErr(t, n, s)
		},
		getGtError: function (e) {
			this.doUnlockLogin();
			var t = e.ret,
				i = "mb-gt-";
			if ("401" == t && (!e.dt || "10" != e.dt)) e.ret = i + t;
			else e.ret = i + t + (e.dt || "");
			this.onShowErr(e)
		},
		doUnlockLogin: function () {
			this.__getTicketLock = 0;
			if (this.__loginBtn && this.__loginBtnTxt) this.__loginBtn.innerHTML = r._$HtmlEncode(this.__loginBtnTxt)
		},
		doLockLogin: function () {
			this.__getTicketLock = 1;
			this.__loginBtn = this.$refs.loginBtn;
			this.__loginBtnTxt = "string" == typeof this.__loginBtn.textContent ? this.__loginBtn.textContent : this.__loginBtn.innerText;
			this.__loginBtn.innerHTML = r._$HtmlEncode(this.__loginLockTxtMb)
		},
		getTicket: function (e) {
			if (!e || !e.nolock) {
				if (this.__getTicketLock) return;
				this.doLockLogin()
			}
			var t = {};
			t.un = this.$refs.mninput._$getValue().trim();
			this.__username = t.un;
			t.channel = this.data.channel;
			t.pd = this.data.product;
			t.pkid = this.data.promark;
			if (r._$isDes()) {
				delete t.un;
				t.encUn = window._$URSOPT.desMobileReal
			}
			c._$request("mb-gt", t, this.getGtSuccess._$bind(this), this.getGtError._$bind(this), 1)
		},
		checkForm: function () {
			var e = 0;
			var t = [];
			i._$forEach(this.ORDERMAP, function (e) {
				var i = this.$refs[e];
				if (i) t.push(i)
			}._$bind(this));
			for (var n = 0, s; n < t.length; n++) {
				s = t[n];
				if (!s.data || "1" != s.data.ignore) {
					if (s.data && s.data.hasError && "mninput" === s.data.ref) {
						e = 1;
						break
					}
					s.onCheckRegexp && s.onCheckRegexp();
					if (s.data) {
						if (s.data.emptyTxt) {
							e = s._$emptyCheck();
							if (e) break
						}
						if (s.otherCheck && s.otherCheck())
							if (s.data.hasError) {
								e = 1;
								break
							}
						if (s.data.hasError) {
							e = 1;
							break
						}
					} else;
				} else;
			}
			return e
		},
		onChangeUnLogin: function () {
			this.data.mobileDefaultUnLogin = !this.data.mobileDefaultUnLogin
		},
		doLogin: function () {
			if (!this.data.mbLoginLock) {
				if (this.isInitLoginSucc())
					if (!r._$fail5check("mb" + this.data.channel))
						if (!this.checkForm()) {
							if (this.needLoginClause() && this.checkLoginClause()) return;
							if ("1" == this.data.channel) {
								if (this.data.isVerifyLock) return;
								if (this.data.hasAiCap && !this.$refs.slidecap.getCapState()) {
									this.$refs.slidecap._$doVerify();
									return
								}
							}
							if ("1" == this.data.channel && this.__needPopup && !this.data.hasSlide && !this.data.hasAiCap) {
								this.__needPopup = 0;
								this.data.hasSlide = 1;
								return
							}
							this.getTicket()
						}
			} else this._$postMessage({
				type: "lockMbLoginState",
				value: this.data.mbLoginLock
			})
		},
		checkLoginClause: function () {
			var e = !this.data.ckboxOk;
			if (e) this._$doShowError({
				tabIndex: m,
				str: this.data.mbloginclause.clauseErr || "您需要同意相关条款才能登录",
				node: "nerror"
			});
			return e
		},
		_$setMbClause: function (e) {
			this.data.ckboxOk = e;
			this.$update()
		},
		needLoginClause: function () {
			return !!this.data.mbloginclause
		},
		isInitLoginSucc: function () {
			if (0 == this.data.initSuccess) {
				var e = 1 == window._$URSOPT.enlang ? l.showText("登录", window._$URSOPT.enlang) : "登录";
				this.doShowInitFail(e);
				return 0
			}
			if (this.data.initSuccess == -1) {
				r._$showFail("-104");
				return 0
			}
			return 1
		},
		_$doToggleLoingLockMb: function () {
			this.data.mbLoginLock = window._$mbLoginLock;
			this.$update()
		},
		onShake: function () {
			this.data.shakecss = "u-shake";
			this.shakesto = setTimeout(function () {
				this.data.shakecss = "";
				this.$update()
			}._$bind(this), 1e3)
		},
		onInputBlur: function () {
			this._$sendMsg({
				type: "loginMbValue",
				value: this.$refs.mninput._$getValue()
			})
		},
		doCheckBox: function () {
			this.data.ckboxOk = !this.data.ckboxOk;
			this.$update()
		}
	});
	return g
}, "a878c0216188111f46d39b9df767b354", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a13cd829d734e255809c920485d5a6b2", "bff3d86ec4ea91399919ee4963badfeb", "a4de926c2d79e8d8f856eaff4dac0f8b", "968ba3167101c772e3f6362803b987d8", "53c267efd983fb8c66cb645beead7a8d", "d6e36b6b1f96e15e42725a59e7acd142", "54120fa727d71cd38f3b1273d034afef", "46a4de3a50f50a600950ca9cee88031e");
I$("18b25c9751295445fbbb6b3eea3687b1", function (e, t, i, n, s, a, r, o, c, d) {
	var _ = Regular.extend({
		data: {},
		config: function (e) {
			i._$merge(this.data, e || {});
			if (this.data.needEye) this.data.showBtn = 0;
			else this.data.showBtn = 1;
			this.supr(e)
		},
		init: function (e) {
			if (!this.supporPlaceHolder()) this.data.labelHidden = 0;
			else this.data.labelHidden = 1;
			this.data.isIOS = window._$ISIOS;
			this.supr(e)
		},
		onLabelFocus: function () {
			try {
				this.$refs.input.focus()
			} catch (e) { }
		},
		onPropertychange: function (e) {
			var t = e && e.event || {};
			if (t.propertyName && "value" == t.propertyName.toLowerCase()) this.onInput()
		},
		onInput: function () {
			if (this.$refs && this.$refs.input) {
				var e = this.$refs.input.value;
				this.data.hasError = 0;
				this.data.active = 1;
				if (e) {
					this.data.hasValue = 1;
					this.data.showBtn = 1
				} else this.data.hasValue = 0;
				setTimeout(function () {
					if (this.$refs && this.$refs.input) this.$emit("input", {
						value: this.$refs.input.value
					})
				}._$bind(this), 10);
				this.$update()
			}
		},
		onFocus: function () {
			this.data.active = 1;
			this.data.hasError = 0;
			this.data.showBtn = 1;
			if (this.data.pwdValue) this.data.hasValue = 1;
			this.$emit("rmError", {
				tabIndex: this.data.tabIndex,
				target: this.$refs.input
			});
			this.$update()
		},
		onCheckRegexp: function () {
			if (!this.data.isDes) {
				var e = !1;
				if (this.$refs && this.$refs.input) {
					if ("phoneipt" == this.$refs.input.id) this.$refs.input.value = n._$emailFilter(this.$refs.input.value);
					var t = this.$refs.input.value;
					t = t.trim();
					var i = t;
					if (this.data.mbHasItl && "+86" !== this.data.countryNumber) {
						if (/^000/.test(t)) e = !0;
						i = this.data.countryNumber.replace("+", "") + t
					}
					if (t)
						if (this.data.regexp)
							if (this.data.regexp.test(i) && !e) {
								this.data.hasError = 0;
								this.data.active = 0;
								this.$emit("rmError", {
									tabIndex: this.data.tabIndex,
									target: this.$refs.input
								})
							} else {
								if (this.$parent.errorIndex == -1 || this.data.tabIndex <= this.$parent.errorIndex) this.data.hasError = 1;
								else this.data.hasError = 2;
								this.$emit("showError", {
									tabIndex: this.data.tabIndex,
									str: this.data.errTxt,
									target: this.$refs.input
								})
							} else {
							this.data.hasError = 0;
							this.data.active = 0
						} else this.data.active = 0;
					this.$update();
					return this.data.hasError
				}
			} else {
				this.data.hasError = 0;
				this.data.active = 0;
				this.$update()
			}
		},
		onMouseOver: function () {
			this.data.isCloseOver = 1
		},
		onMouseOut: function () {
			this.data.isCloseOver = 0
		},
		setCloseOver: function (e) {
			this.data.isCloseOver = e
		},
		onBlur: function (e) {
			if (this.data.needSafePwd)
				if ("safePwdCheck" !== e) return;
			n._$tryWeixinResize();
			if (!this.data.isCloseOver) {
				if (this.data.needEye) this.data.showBtn = 0;
				this.onCheckRegexp();
				this.otherCheck && this.otherCheck();
				this.$emit("blur", {
					hasError: this.data.hasError
				});
				this.$update()
			}
		},
		onClearInput: function () {
			this.onClearInputPuer();
			if (this.data.isDes) {
				this.data.isDesClazz = "";
				this.data.disabled = "";
				this.data.isDes = !1;
				delete window._$URSOPT.desMobile;
				delete window._$URSOPT.desMobileReal
			}
			try {
				this.$refs.input.focus()
			} catch (e) { }
		},
		onClearInputPuer: function () {
			this.data.pwdValue = "";
			this.$refs.input.value = "";
			this.data.hasValue = 0;
			this.data.active = 0;
			this.data.hasError = 0;
			this.$update()
		},
		supporPlaceHolder: function () {
			var t = e._$KERNEL;
			if ("trident" == t.engine && parseInt(t.release, 10) <= 5) return 0;
			else return 1
		},
		_$getValue: function () {
			return this.$refs.input.value
		},
		_$setValue: function (e, t) {
			this.$refs.input.value = e;
			if (e) this.data.hasValue = 1;
			if ("isDes" === t) {
				this.data.isDesClazz = "desClazz";
				this.data.disabled = "disabled";
				this.data.isDes = !0
			} else {
				this.data.isDesClazz = "";
				this.data.isDes = !1
			}
		},
		_$emptyCheck: function () {
			if (!this.$refs.input.value) {
				this.data.hasError = 1;
				this.$emit("showError", {
					tabIndex: this.data.tabIndex,
					str: this.data.emptyTxt,
					target: this.$refs.input
				});
				return 1
			}
			return 0
		},
		_$focusHelper: function () {
			try {
				this.$refs.input.focus()
			} catch (e) { }
		},
		onHackFocus: function (e) {
			try {
				if (document.activeElement && e && document.activeElement === e.target) {
					window.focus();
					setTimeout(function () {
						e.target.focus()
					}, 0)
				}
			} catch (t) { }
		}
	});
	return _
}, "a878c0216188111f46d39b9df767b354", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "a4de926c2d79e8d8f856eaff4dac0f8b", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a13cd829d734e255809c920485d5a6b2");
I$("fbc7461d750287ea4accba3b2d5edebd", '<div r-hide={ish5upsms===1} ref="mbInput" on-click="{this.onShake()}" {#if itlOpened && ish5upsms!=1}style="z-index:999;"{/if}{#if disabled}class="inputbox inputbox-disabled" {#elseif active && !hasError}class="inputbox active"{#elseif hasError===1}class="inputbox error-color"{#else}class="inputbox"{/if}>\n    {#if !mbHasItl}\n        <div class="u-logo"><div class="u-logo-img3"></div></div>\n    {/if}\n    {#if mbHasItl}\n        <div ref="itlBox" class="u-input box mbItlBox">\n            <label on-click={this.onLabelFocus($event)} {#if !labelHidden && !hasValue}class="u-label"{#else}class="u-label f-dn"{/if}>{placeholder}</label>\n            <div id="mobile-itl-div" ref="itlBtn" class={itlClazz} on-click={this.__toggleC($event)} data-code="{firstCountry}"><em>{countryNumber}</em></div>\n            <input {#if disabled}disabled="{disabled}"{/if} id="phoneipt" {#if isIOS}on-touchend={this.onHackFocus($event)}{/if} on-propertychange={this.onPropertychange($event)} on-input={this.onInput($event)} ref="input" on-focus={this.onFocus($event)} on-blur={this.onBlur($event)} placeholder="{placeholder}" name="email" class="dlemail j-nameforslide" type="tel" autocomplete="off" tabindex="1" spellcheck="false">\n            <country ref="country" on-setCode={this.__toggleC($event)} on-hideCountry={this.onHideCountry($event)}></country>\n        </div>\n    {#else}\n        <div class="u-input box">\n        <label on-click={this.onLabelFocus($event)} {#if !labelHidden && !hasValue}class="u-label"{#else}class="u-label f-dn"{/if}>{placeholder}</label>\n        <input {#if disabled}disabled="{disabled}"{/if} id="phoneipt" {#if isIOS}on-touchend={this.onHackFocus($event)}{/if} on-propertychange={this.onPropertychange($event)} on-input={this.onInput($event)} ref="input" on-focus={this.onFocus($event)} on-blur={this.onBlur($event)} placeholder="{placeholder}" name="email" class="dlemail j-nameforslide" type="tel" autocomplete="off" tabindex="1" spellcheck="false" maxlength="11">\n    </div>\n    {/if}\n    {#if isshake}\n    <div class="u-tip u-upsms-tip"><div class="u-success u-clear {shakecss}"></div></div>\n    {#else}\n    <div on-mouseover={this.onMouseOver()} on-mouseout={this.onMouseOut()}  on-click={this.onClearInput($event)} class="u-tip {isDesClazz}" {#if isDes||(hasValue && showBtn)}style="display:block;"{/if}><div class="u-success u-clear {closeshakecss}"></div></div>\n    {/if}\n    {#if isVersionFour && !!fromsmsup}\n    <div class="mbtoggleitl-box"><a class="mbtoggleitl" on-click={this.onChangeItl($event)} href="javascript:void(0);">{changeItlTxt}</a></div>\n    {#elseif !isVersionFour && mbNeedItl && !mbOnlyItl}\n    <div class="mbtoggleitl-box"><a class="mbtoggleitl" on-click={this.onChangeItl($event)} href="javascript:void(0);">{changeItlTxt}</a></div>\n    {/if}\n</div>\n');
I$("35556ed2cbe57845a6fcd07d1a9cfebe", '<div {#if hidden}class="j-country u-country f-dn"{#else}class="j-country u-country"{/if} on-click="{this.onClick($event)}">\n    {#list countryList as c}\n        <a href="javascript:void(0);" class="{c.countryClass}" data-code="{c.countryCode}"><em>&nbsp;</em>{c.countryName}</a>\n    {/list}\n    </div>');
I$("420d443e889a68e94b0376ca02626a43", function (e, t, i, n) {
	var s = [{
		countryClass: "flag-CN",
		countryCode: "+86-",
		countryName: "中国 +86"
	}, {
		countryClass: "flag-TW",
		countryCode: "+886-",
		countryName: "台湾地区 +886"
	}, {
		countryClass: "flag-HK",
		countryCode: "+852-",
		countryName: "香港地区 +852"
	}, {
		countryClass: "flag-MO",
		countryCode: "+853-",
		countryName: "澳门地区 +853"
	}, {
		countryClass: "flag-MY",
		countryCode: "+60-",
		countryName: "马来西亚 +60"
	}, {
		countryClass: "flag-SG",
		countryCode: "+65-",
		countryName: "新加坡 +65"
	}, {
		countryClass: "flag-JP",
		countryCode: "+81-",
		countryName: "日本 +81"
	}, {
		countryClass: "flag-KR",
		countryCode: "+82-",
		countryName: "韩国 +82"
	}, {
		countryClass: "flag-US",
		countryCode: "+1-",
		countryName: "美国 +1"
	}, {
		countryClass: "flag-CA",
		countryCode: "+1-",
		countryName: "加拿大 +1"
	}, {
		countryClass: "flag-AU",
		countryCode: "+61-",
		countryName: "澳大利亚 +61"
	}, {
		countryClass: "flag-NZ",
		countryCode: "+64-",
		countryName: "新西兰 +64"
	}, {
		countryClass: "flag-X3",
		countryCode: "+247-",
		countryName: "阿森松岛 +247"
	}, {
		countryClass: "flag-AL",
		countryCode: "+355-",
		countryName: "阿尔巴尼亚 +355"
	}, {
		countryClass: "flag-DZ",
		countryCode: "+213-",
		countryName: "阿尔及利亚 +213"
	}, {
		countryClass: "flag-AF",
		countryCode: "+93-",
		countryName: "阿富汗 +93"
	}, {
		countryClass: "flag-AR",
		countryCode: "+54-",
		countryName: "阿根廷 +54"
	}, {
		countryClass: "flag-AE",
		countryCode: "+971-",
		countryName: "阿拉伯联合大公国 +971"
	}, {
		countryClass: "flag-AW",
		countryCode: "+297-",
		countryName: "阿鲁巴 +297"
	}, {
		countryClass: "flag-OM",
		countryCode: "+968-",
		countryName: "阿曼 +968"
	}, {
		countryClass: "flag-AZ",
		countryCode: "+994-",
		countryName: "阿塞拜疆 +994"
	}, {
		countryClass: "flag-EG",
		countryCode: "+20-",
		countryName: "埃及 +20"
	}, {
		countryClass: "flag-ET",
		countryCode: "+251-",
		countryName: "埃塞俄比亚 +251"
	}, {
		countryClass: "flag-IE",
		countryCode: "+353-",
		countryName: "爱尔兰 +353"
	}, {
		countryClass: "flag-EE",
		countryCode: "+372-",
		countryName: "爱沙尼亚 +372"
	}, {
		countryClass: "flag-AD",
		countryCode: "+376-",
		countryName: "安道尔 +376"
	}, {
		countryClass: "flag-AO",
		countryCode: "+244-",
		countryName: "安哥拉 +244"
	}, {
		countryClass: "flag-AI",
		countryCode: "+1264-",
		countryName: "安圭拉 +1264"
	}, {
		countryClass: "flag-AG",
		countryCode: "+1268-",
		countryName: "安提瓜和巴布达 +1268"
	}, {
		countryClass: "flag-AT",
		countryCode: "+43-",
		countryName: "奥地利 +43"
	}, {
		countryClass: "flag-BB",
		countryCode: "+1246-",
		countryName: "巴巴多斯 +1246"
	}, {
		countryClass: "flag-PG",
		countryCode: "+675-",
		countryName: "巴布亚新几内亚 +675"
	}, {
		countryClass: "flag-BS",
		countryCode: "+1242-",
		countryName: "巴哈马 +1242"
	}, {
		countryClass: "flag-PK",
		countryCode: "+92-",
		countryName: "巴基斯坦 +92"
	}, {
		countryClass: "flag-PY",
		countryCode: "+595-",
		countryName: "巴拉圭 +595"
	}, {
		countryClass: "flag-PS",
		countryCode: "+970-",
		countryName: "巴勒斯坦领土 +970"
	}, {
		countryClass: "flag-BH",
		countryCode: "+973-",
		countryName: "巴林 +973"
	}, {
		countryClass: "flag-PA",
		countryCode: "+507-",
		countryName: "巴拿马 +507"
	}, {
		countryClass: "flag-BR",
		countryCode: "+55-",
		countryName: "巴西 +55"
	}, {
		countryClass: "flag-BY",
		countryCode: "+375-",
		countryName: "白俄罗斯 +375"
	}, {
		countryClass: "flag-BM",
		countryCode: "+1441-",
		countryName: "百慕大 +1441"
	}, {
		countryClass: "flag-BG",
		countryCode: "+359-",
		countryName: "保加利亚 +359"
	}, {
		countryClass: "flag-X1",
		countryCode: "+1670-",
		countryName: "北马里亚纳群岛 +1670"
	}, {
		countryClass: "flag-BJ",
		countryCode: "+229-",
		countryName: "贝宁 +229"
	}, {
		countryClass: "flag-BE",
		countryCode: "+32-",
		countryName: "比利时 +32"
	}, {
		countryClass: "flag-IS",
		countryCode: "+354-",
		countryName: "冰岛 +354"
	}, {
		countryClass: "flag-PR",
		countryCode: "+1787-",
		countryName: "波多黎各 +1787"
	}, {
		countryClass: "flag-PL",
		countryCode: "+48-",
		countryName: "波兰 +48"
	}, {
		countryClass: "flag-BA",
		countryCode: "+387-",
		countryName: "波斯尼亚和黑塞哥维那 +387"
	}, {
		countryClass: "flag-BO",
		countryCode: "+591-",
		countryName: "玻利维亚 +591"
	}, {
		countryClass: "flag-BZ",
		countryCode: "+501-",
		countryName: "伯利兹 +501"
	}, {
		countryClass: "flag-BW",
		countryCode: "+267-",
		countryName: "博茨瓦纳 +267"
	}, {
		countryClass: "flag-BT",
		countryCode: "+975-",
		countryName: "不丹 +975"
	}, {
		countryClass: "flag-BF",
		countryCode: "+226-",
		countryName: "布基纳法索 +226"
	}, {
		countryClass: "flag-BI",
		countryCode: "+257-",
		countryName: "布隆迪 +257"
	}, {
		countryClass: "flag-KP",
		countryCode: "+850-",
		countryName: "朝鲜 +850"
	}, {
		countryClass: "flag-GQ",
		countryCode: "+240-",
		countryName: "赤道几内亚 +240"
	}, {
		countryClass: "flag-DK",
		countryCode: "+45-",
		countryName: "丹麦 +45"
	}, {
		countryClass: "flag-DE",
		countryCode: "+49-",
		countryName: "德国 +49"
	}, {
		countryClass: "flag-TL",
		countryCode: "+670-",
		countryName: "东帝汶 +670"
	}, {
		countryClass: "flag-TG",
		countryCode: "+228-",
		countryName: "多哥 +228"
	}, {
		countryClass: "flag-DM",
		countryCode: "+1767-",
		countryName: "多米尼加 +1767"
	}, {
		countryClass: "flag-DO",
		countryCode: "+1809-",
		countryName: "多明尼加共和国 +1809"
	}, {
		countryClass: "flag-RU",
		countryCode: "+7-",
		countryName: "俄罗斯 +7"
	}, {
		countryClass: "flag-EC",
		countryCode: "+593-",
		countryName: "厄瓜多尔 +593"
	}, {
		countryClass: "flag-ER",
		countryCode: "+291-",
		countryName: "厄立特里亚 +291"
	}, {
		countryClass: "flag-FR",
		countryCode: "+33-",
		countryName: "法国 +33"
	}, {
		countryClass: "flag-FO",
		countryCode: "+298-",
		countryName: "法罗群岛 +298"
	}, {
		countryClass: "flag-PF",
		countryCode: "+689-",
		countryName: "法属波利尼西亚 +689"
	}, {
		countryClass: "flag-GF",
		countryCode: "+594-",
		countryName: "法属圭亚那 +594"
	}, {
		countryClass: "flag-PH",
		countryCode: "+63-",
		countryName: "菲律宾 +63"
	}, {
		countryClass: "flag-FJ",
		countryCode: "+679-",
		countryName: "斐济 +679"
	}, {
		countryClass: "flag-FI",
		countryCode: "+358-",
		countryName: "芬兰 +358"
	}, {
		countryClass: "flag-CV",
		countryCode: "+238-",
		countryName: "佛得角 +238"
	}, {
		countryClass: "flag-GM",
		countryCode: "+220-",
		countryName: "冈比亚 +220"
	}, {
		countryClass: "flag-CG",
		countryCode: "+242-",
		countryName: "刚果共和国 +242"
	}, {
		countryClass: "flag-CD",
		countryCode: "+243-",
		countryName: "刚果民主共和国 +243"
	}, {
		countryClass: "flag-CO",
		countryCode: "+57-",
		countryName: "哥伦比亚 +57"
	}, {
		countryClass: "flag-CR",
		countryCode: "+506-",
		countryName: "哥斯达黎加 +506"
	}, {
		countryClass: "flag-GD",
		countryCode: "+1473-",
		countryName: "格林纳达 +1473"
	}, {
		countryClass: "flag-GL",
		countryCode: "+299-",
		countryName: "格陵兰 +299"
	}, {
		countryClass: "flag-GE",
		countryCode: "+995-",
		countryName: "格鲁吉亚 +995"
	}, {
		countryClass: "flag-CU",
		countryCode: "+53-",
		countryName: "古巴 +53"
	}, {
		countryClass: "flag-GP",
		countryCode: "+590-",
		countryName: "瓜德罗普岛 +590"
	}, {
		countryClass: "flag-GU",
		countryCode: "+1671-",
		countryName: "关岛 +1671"
	}, {
		countryClass: "flag-GY",
		countryCode: "+592-",
		countryName: "圭亚那 +592"
	}, {
		countryClass: "flag-KZ",
		countryCode: "+7-",
		countryName: "哈萨克斯坦 +7"
	}, {
		countryClass: "flag-HT",
		countryCode: "+509-",
		countryName: "海地 +509"
	}, {
		countryClass: "flag-NL",
		countryCode: "+31-",
		countryName: "荷兰 +31"
	}, {
		countryClass: "flag-AN",
		countryCode: "+599-",
		countryName: "荷属安的列斯群岛 +599"
	}, {
		countryClass: "flag-ME",
		countryCode: "+382-",
		countryName: "黑山 +382"
	}, {
		countryClass: "flag-HN",
		countryCode: "+504-",
		countryName: "洪都拉斯 +504"
	}, {
		countryClass: "flag-DJ",
		countryCode: "+253-",
		countryName: "吉布提 +253"
	}, {
		countryClass: "flag-KG",
		countryCode: "+996-",
		countryName: "吉尔吉斯斯坦 +996"
	}, {
		countryClass: "flag-GN",
		countryCode: "+224-",
		countryName: "几内亚 +224"
	}, {
		countryClass: "flag-GW",
		countryCode: "+245-",
		countryName: "几内亚比绍 +245"
	}, {
		countryClass: "flag-GH",
		countryCode: "+233-",
		countryName: "加纳 +233"
	}, {
		countryClass: "flag-GA",
		countryCode: "+241-",
		countryName: "加蓬 +241"
	}, {
		countryClass: "flag-KH",
		countryCode: "+855-",
		countryName: "柬埔寨 +855"
	}, {
		countryClass: "flag-CZ",
		countryCode: "+420-",
		countryName: "捷克共和国 +420"
	}, {
		countryClass: "flag-ZW",
		countryCode: "+263-",
		countryName: "津巴布韦 +263"
	}, {
		countryClass: "flag-CM",
		countryCode: "+237-",
		countryName: "喀麦隆 +237"
	}, {
		countryClass: "flag-QA",
		countryCode: "+974-",
		countryName: "卡塔尔 +974"
	}, {
		countryClass: "flag-KY",
		countryCode: "+1345-",
		countryName: "开曼群岛 +1345"
	}, {
		countryClass: "flag-KM",
		countryCode: "+269-",
		countryName: "科摩罗 +269"
	}, {
		countryClass: "flag-KW",
		countryCode: "+965-",
		countryName: "科威特 +965"
	}, {
		countryClass: "flag-HR",
		countryCode: "+385-",
		countryName: "克罗地亚 +385"
	}, {
		countryClass: "flag-KE",
		countryCode: "+254-",
		countryName: "肯尼亚 +254"
	}, {
		countryClass: "flag-CK",
		countryCode: "+682-",
		countryName: "库克群岛 +682"
	}, {
		countryClass: "flag-LV",
		countryCode: "+371-",
		countryName: "拉脱维亚 +371"
	}, {
		countryClass: "flag-LS",
		countryCode: "+266-",
		countryName: "莱索托 +266"
	}, {
		countryClass: "flag-LA",
		countryCode: "+856-",
		countryName: "老挝 +856"
	}, {
		countryClass: "flag-LB",
		countryCode: "+961-",
		countryName: "黎巴嫩 +961"
	}, {
		countryClass: "flag-LT",
		countryCode: "+370-",
		countryName: "立陶宛 +370"
	}, {
		countryClass: "flag-LR",
		countryCode: "+231-",
		countryName: "利比里亚 +231"
	}, {
		countryClass: "flag-LY",
		countryCode: "+218-",
		countryName: "利比亚 +218"
	}, {
		countryClass: "flag-LI",
		countryCode: "+423-",
		countryName: "列支敦士登 +423"
	}, {
		countryClass: "flag-RE",
		countryCode: "+262-",
		countryName: "留尼旺岛 +262"
	}, {
		countryClass: "flag-LU",
		countryCode: "+352-",
		countryName: "卢森堡 +352"
	}, {
		countryClass: "flag-RW",
		countryCode: "+250-",
		countryName: "卢旺达 +250"
	}, {
		countryClass: "flag-RO",
		countryCode: "+40-",
		countryName: "罗马尼亚 +40"
	}, {
		countryClass: "flag-Myanmar",
		countryCode: "+95-",
		countryName: "缅甸 +95"
	}, {
		countryClass: "flag-MG",
		countryCode: "+261-",
		countryName: "马达加斯加 +261"
	}, {
		countryClass: "flag-MV",
		countryCode: "+960-",
		countryName: "马尔代夫 +960"
	}, {
		countryClass: "flag-MT",
		countryCode: "+356-",
		countryName: "马耳他 +356"
	}, {
		countryClass: "flag-MW",
		countryCode: "+265-",
		countryName: "马拉维 +265"
	}, {
		countryClass: "flag-ML",
		countryCode: "+223-",
		countryName: "马里 +223"
	}, {
		countryClass: "flag-MK",
		countryCode: "+389-",
		countryName: "马其顿 +389"
	}, {
		countryClass: "flag-MQ",
		countryCode: "+596-",
		countryName: "马提尼克 +596"
	}, {
		countryClass: "flag-MU",
		countryCode: "+230-",
		countryName: "毛里求斯 +230"
	}, {
		countryClass: "flag-MR",
		countryCode: "+222-",
		countryName: "毛里塔尼亚 +222"
	}, {
		countryClass: "flag-MN",
		countryCode: "+976-",
		countryName: "蒙古 +976"
	}, {
		countryClass: "flag-MS",
		countryCode: "+1664-",
		countryName: "蒙特塞拉特 +1664"
	}, {
		countryClass: "flag-BD",
		countryCode: "+880-",
		countryName: "孟加拉国 +880"
	}, {
		countryClass: "flag-PE",
		countryCode: "+51-",
		countryName: "秘鲁 +51"
	}, {
		countryClass: "flag-MD",
		countryCode: "+373-",
		countryName: "摩尔多瓦 +373"
	}, {
		countryClass: "flag-MA",
		countryCode: "+212-",
		countryName: "摩洛哥 +212"
	}, {
		countryClass: "flag-MC",
		countryCode: "+377-",
		countryName: "摩纳哥 +377"
	}, {
		countryClass: "flag-MZ",
		countryCode: "+258-",
		countryName: "莫桑比克 +258"
	}, {
		countryClass: "flag-MX",
		countryCode: "+52-",
		countryName: "墨西哥 +52"
	}, {
		countryClass: "flag-NA",
		countryCode: "+264-",
		countryName: "纳米比亚 +264"
	}, {
		countryClass: "flag-ZA",
		countryCode: "+27-",
		countryName: "南非 +27"
	}, {
		countryClass: "flag-SS",
		countryCode: "+211-",
		countryName: "南苏丹 +211"
	}, {
		countryClass: "flag-NP",
		countryCode: "+977-",
		countryName: "尼泊尔 +977"
	}, {
		countryClass: "flag-NI",
		countryCode: "+505-",
		countryName: "尼加拉瓜 +505"
	}, {
		countryClass: "flag-NE",
		countryCode: "+227-",
		countryName: "尼日尔 +227"
	}, {
		countryClass: "flag-NG",
		countryCode: "+234-",
		countryName: "尼日利亚 +234"
	}, {
		countryClass: "flag-NO",
		countryCode: "+47-",
		countryName: "挪威 +47"
	}, {
		countryClass: "flag-PT",
		countryCode: "+351-",
		countryName: "葡萄牙 +351"
	}, {
		countryClass: "flag-X3",
		countryCode: "+680-",
		countryName: "帕劳 +680"
	}, {
		countryClass: "flag-SE",
		countryCode: "+46-",
		countryName: "瑞典 +46"
	}, {
		countryClass: "flag-CH",
		countryCode: "+41-",
		countryName: "瑞士 +41"
	}, {
		countryClass: "flag-SV",
		countryCode: "+503-",
		countryName: "萨尔瓦多 +503"
	}, {
		countryClass: "flag-WS",
		countryCode: "+685-",
		countryName: "萨摩亚 +685"
	}, {
		countryClass: "flag-RS",
		countryCode: "+381-",
		countryName: "塞尔维亚 +381"
	}, {
		countryClass: "flag-SL",
		countryCode: "+232-",
		countryName: "塞拉利昂 +232"
	}, {
		countryClass: "flag-SN",
		countryCode: "+221-",
		countryName: "塞内加尔 +221"
	}, {
		countryClass: "flag-CY",
		countryCode: "+357-",
		countryName: "塞浦路斯 +357"
	}, {
		countryClass: "flag-SC",
		countryCode: "+248-",
		countryName: "塞舌尔 +248"
	}, {
		countryClass: "flag-SA",
		countryCode: "+966-",
		countryName: "沙特阿拉伯 +966"
	}, {
		countryClass: "flag-ST",
		countryCode: "+239-",
		countryName: "圣多美和普林西比 +239"
	}, {
		countryClass: "flag-KN",
		countryCode: "+1869-",
		countryName: "圣基茨和尼维斯 +1869"
	}, {
		countryClass: "flag-LC",
		countryCode: "+1758-",
		countryName: "圣卢西亚 +1758"
	}, {
		countryClass: "flag-SM",
		countryCode: "+378-",
		countryName: "圣马力诺 +378"
	}, {
		countryClass: "flag-PM",
		countryCode: "+508-",
		countryName: "圣皮埃尔和密克隆群岛 +508"
	}, {
		countryClass: "flag-VC",
		countryCode: "+1784-",
		countryName: "圣文森特和格林纳丁斯 +1784"
	}, {
		countryClass: "flag-LK",
		countryCode: "+94-",
		countryName: "斯里兰卡 +94"
	}, {
		countryClass: "flag-SK",
		countryCode: "+421-",
		countryName: "斯洛伐克 +421"
	}, {
		countryClass: "flag-SI",
		countryCode: "+386-",
		countryName: "斯洛文尼亚 +386"
	}, {
		countryClass: "flag-SZ",
		countryCode: "+268-",
		countryName: "斯威士兰 +268"
	}, {
		countryClass: "flag-SD",
		countryCode: "+249-",
		countryName: "苏丹 +249"
	}, {
		countryClass: "flag-SR",
		countryCode: "+597-",
		countryName: "苏里南 +597"
	}, {
		countryClass: "flag-SO",
		countryCode: "+252-",
		countryName: "索马里 +252"
	}, {
		countryClass: "flag-X2",
		countryCode: "+677-",
		countryName: "所罗门群岛 +677"
	}, {
		countryClass: "flag-TJ",
		countryCode: "+992-",
		countryName: "塔吉克斯坦 +992"
	}, {
		countryClass: "flag-TH",
		countryCode: "+66-",
		countryName: "泰国 +66"
	}, {
		countryClass: "flag-TZ",
		countryCode: "+255-",
		countryName: "坦桑尼亚 +255"
	}, {
		countryClass: "flag-TO",
		countryCode: "+676-",
		countryName: "汤加 +676"
	}, {
		countryClass: "flag-TC",
		countryCode: "+1649-",
		countryName: "特克斯和凯科斯群岛 +1649"
	}, {
		countryClass: "flag-TT",
		countryCode: "+1868-",
		countryName: "特里尼达和多巴哥 +1868"
	}, {
		countryClass: "flag-TN",
		countryCode: "+216-",
		countryName: "突尼斯 +216"
	}, {
		countryClass: "flag-TR",
		countryCode: "+90-",
		countryName: "土耳其 +90"
	}, {
		countryClass: "flag-TM",
		countryCode: "+993-",
		countryName: "土库曼斯坦 +993"
	}, {
		countryClass: "flag-VU",
		countryCode: "+678-",
		countryName: "瓦努阿图 +678"
	}, {
		countryClass: "flag-GT",
		countryCode: "+502-",
		countryName: "危地马拉 +502"
	}, {
		countryClass: "flag-VE",
		countryCode: "+58-",
		countryName: "委内瑞拉 +58"
	}, {
		countryClass: "flag-BN",
		countryCode: "+673-",
		countryName: "文莱 +673"
	}, {
		countryClass: "flag-UG",
		countryCode: "+256-",
		countryName: "乌干达 +256"
	}, {
		countryClass: "flag-UA",
		countryCode: "+380-",
		countryName: "乌克兰 +380"
	}, {
		countryClass: "flag-UY",
		countryCode: "+598-",
		countryName: "乌拉圭 +598"
	}, {
		countryClass: "flag-UZ",
		countryCode: "+998-",
		countryName: "乌兹别克斯坦 +998"
	}, {
		countryClass: "flag-ES",
		countryCode: "+34-",
		countryName: "西班牙 +34"
	}, {
		countryClass: "flag-GR",
		countryCode: "+30-",
		countryName: "希腊 +30"
	}, {
		countryClass: "flag-CI",
		countryCode: "+225-",
		countryName: "象牙海岸 +225"
	}, {
		countryClass: "flag-NC",
		countryCode: "+687-",
		countryName: "新喀里多尼亚 +687"
	}, {
		countryClass: "flag-HU",
		countryCode: "+36-",
		countryName: "匈牙利 +36"
	}, {
		countryClass: "flag-SY",
		countryCode: "+963-",
		countryName: "叙利亚 +963"
	}, {
		countryClass: "flag-JM",
		countryCode: "+1876-",
		countryName: "牙买加 +1876"
	}, {
		countryClass: "flag-AM",
		countryCode: "+374-",
		countryName: "亚美尼亚 +374"
	}, {
		countryClass: "flag-YE",
		countryCode: "+967-",
		countryName: "也门 +967"
	}, {
		countryClass: "flag-IQ",
		countryCode: "+964-",
		countryName: "伊拉克 +964"
	}, {
		countryClass: "flag-IR",
		countryCode: "+98-",
		countryName: "伊朗 +98"
	}, {
		countryClass: "flag-IL",
		countryCode: "+972-",
		countryName: "以色列 +972"
	}, {
		countryClass: "flag-IT",
		countryCode: "+39-",
		countryName: "意大利 +39"
	}, {
		countryClass: "flag-IN",
		countryCode: "+91-",
		countryName: "印度 +91"
	}, {
		countryClass: "flag-ID",
		countryCode: "+62-",
		countryName: "印尼 +62"
	}, {
		countryClass: "flag-GB",
		countryCode: "+44-",
		countryName: "英国 +44"
	}, {
		countryClass: "flag-VG",
		countryCode: "+1340-",
		countryName: "英属维尔京群岛 +1340"
	}, {
		countryClass: "flag-JO",
		countryCode: "+962-",
		countryName: "约旦 +962"
	}, {
		countryClass: "flag-VN",
		countryCode: "+84-",
		countryName: "越南 +84"
	}, {
		countryClass: "flag-ZM",
		countryCode: "+260-",
		countryName: "赞比亚 +260"
	}, {
		countryClass: "flag-JE",
		countryCode: "+44-",
		countryName: "泽西岛 +44"
	}, {
		countryClass: "flag-TD",
		countryCode: "+235-",
		countryName: "乍得 +235"
	}, {
		countryClass: "flag-GI",
		countryCode: "+350-",
		countryName: "直布罗陀 +350"
	}, {
		countryClass: "flag-CL",
		countryCode: "+56-",
		countryName: "智利 +56"
	}, {
		countryClass: "flag-CF",
		countryCode: "+236-",
		countryName: "中非共和国 +236"
	}];
	return s
});
I$("9f04a93d717c1c5979d4b010c0e6d7fe", function (e, t, i, n) {
	var s = [{
		countryClass: "flag-CN",
		countryCode: "+86-",
		countryName: "Chinese Mainland +86"
	}, {
		countryClass: "flag-TW",
		countryCode: "+886-",
		countryName: "Taiwan, China +886"
	}, {
		countryClass: "flag-HK",
		countryCode: "+852-",
		countryName: "Hong Kong, China +852"
	}, {
		countryClass: "flag-MO",
		countryCode: "+853-",
		countryName: "Macao China +853"
	}, {
		countryClass: "flag-MY",
		countryCode: "+60-",
		countryName: "Malaysia +60"
	}, {
		countryClass: "flag-SG",
		countryCode: "+65-",
		countryName: "Singapore +65"
	}, {
		countryClass: "flag-JP",
		countryCode: "+81-",
		countryName: "Japan +81"
	}, {
		countryClass: "flag-KR",
		countryCode: "+82-",
		countryName: "South Korea +82"
	}, {
		countryClass: "flag-US",
		countryCode: "+1-",
		countryName: "United States of America +1"
	}, {
		countryClass: "flag-CA",
		countryCode: "+1-",
		countryName: "Canada +1"
	}, {
		countryClass: "flag-AU",
		countryCode: "+61-",
		countryName: "Australia +61"
	}, {
		countryClass: "flag-NZ",
		countryCode: "+64-",
		countryName: "New Zealand +64"
	}, {
		countryClass: "flag-X3",
		countryCode: "+247-",
		countryName: "Ascension Island +247"
	}, {
		countryClass: "flag-AL",
		countryCode: "+355-",
		countryName: "Albania +355"
	}, {
		countryClass: "flag-DZ",
		countryCode: "+213-",
		countryName: "Algeria +213"
	}, {
		countryClass: "flag-AF",
		countryCode: "+93-",
		countryName: "Afghanistan +93"
	}, {
		countryClass: "flag-AR",
		countryCode: "+54-",
		countryName: "Argentina +54"
	}, {
		countryClass: "flag-AE",
		countryCode: "+971-",
		countryName: "United Arab Emirates +971"
	}, {
		countryClass: "flag-AW",
		countryCode: "+297-",
		countryName: "Aruba +297"
	}, {
		countryClass: "flag-OM",
		countryCode: "+968-",
		countryName: "Oman +968"
	}, {
		countryClass: "flag-AZ",
		countryCode: "+994-",
		countryName: "Azerbaijan +994"
	}, {
		countryClass: "flag-EG",
		countryCode: "+20-",
		countryName: "Egypt +20"
	}, {
		countryClass: "flag-ET",
		countryCode: "+251-",
		countryName: "Ethiopia +251"
	}, {
		countryClass: "flag-IE",
		countryCode: "+353-",
		countryName: "Ireland +353"
	}, {
		countryClass: "flag-EE",
		countryCode: "+372-",
		countryName: "Estonia +372"
	}, {
		countryClass: "flag-AD",
		countryCode: "+376-",
		countryName: "Andorra +376"
	}, {
		countryClass: "flag-AO",
		countryCode: "+244-",
		countryName: "Angola +244"
	}, {
		countryClass: "flag-AI",
		countryCode: "+1264-",
		countryName: "Anguilla +1264"
	}, {
		countryClass: "flag-AG",
		countryCode: "+1268-",
		countryName: "Antigua and Barbuda +1268"
	}, {
		countryClass: "flag-AT",
		countryCode: "+43-",
		countryName: "Austria +43"
	}, {
		countryClass: "flag-BB",
		countryCode: "+1246-",
		countryName: "Barbados +1246"
	}, {
		countryClass: "flag-PG",
		countryCode: "+675-",
		countryName: "papua new guinea +675"
	}, {
		countryClass: "flag-BS",
		countryCode: "+1242-",
		countryName: "Bahamas +1242"
	}, {
		countryClass: "flag-PK",
		countryCode: "+92-",
		countryName: "Pakistan +92"
	}, {
		countryClass: "flag-PY",
		countryCode: "+595-",
		countryName: "Paraguay +595"
	}, {
		countryClass: "flag-PS",
		countryCode: "+970-",
		countryName: "Palestinian territories +970"
	}, {
		countryClass: "flag-BH",
		countryCode: "+973-",
		countryName: "Bahrain +973"
	}, {
		countryClass: "flag-PA",
		countryCode: "+507-",
		countryName: "Panama +507"
	}, {
		countryClass: "flag-BR",
		countryCode: "+55-",
		countryName: "Brazil +55"
	}, {
		countryClass: "flag-BY",
		countryCode: "+375-",
		countryName: "Belarus +375"
	}, {
		countryClass: "flag-BM",
		countryCode: "+1441-",
		countryName: "Bermuda +1441"
	}, {
		countryClass: "flag-BG",
		countryCode: "+359-",
		countryName: "Bulgaria +359"
	}, {
		countryClass: "flag-X1",
		countryCode: "+1670-",
		countryName: "Northern Mariana Islands +1670"
	}, {
		countryClass: "flag-BJ",
		countryCode: "+229-",
		countryName: "Benin +229"
	}, {
		countryClass: "flag-BE",
		countryCode: "+32-",
		countryName: "Belgium +32"
	}, {
		countryClass: "flag-IS",
		countryCode: "+354-",
		countryName: "Iceland +354"
	}, {
		countryClass: "flag-PR",
		countryCode: "+1787-",
		countryName: "Puerto Rico +1787"
	}, {
		countryClass: "flag-PL",
		countryCode: "+48-",
		countryName: "Poland +48"
	}, {
		countryClass: "flag-BA",
		countryCode: "+387-",
		countryName: "Bosnia and Herzegovina +387"
	}, {
		countryClass: "flag-BO",
		countryCode: "+591-",
		countryName: "Bolivia +591"
	}, {
		countryClass: "flag-BZ",
		countryCode: "+501-",
		countryName: "Belize +501"
	}, {
		countryClass: "flag-BW",
		countryCode: "+267-",
		countryName: "Botswana +267"
	}, {
		countryClass: "flag-BT",
		countryCode: "+975-",
		countryName: "Bhutan +975"
	}, {
		countryClass: "flag-BF",
		countryCode: "+226-",
		countryName: "burkina faso +226"
	}, {
		countryClass: "flag-BI",
		countryCode: "+257-",
		countryName: "Burundi +257"
	}, {
		countryClass: "flag-KP",
		countryCode: "+850-",
		countryName: "North Korea +850"
	}, {
		countryClass: "flag-GQ",
		countryCode: "+240-",
		countryName: "Equatorial Guinea +240"
	}, {
		countryClass: "flag-DK",
		countryCode: "+45-",
		countryName: "Denmark +45"
	}, {
		countryClass: "flag-DE",
		countryCode: "+49-",
		countryName: "Germany +49"
	}, {
		countryClass: "flag-TL",
		countryCode: "+670-",
		countryName: "Timor Leste +670"
	}, {
		countryClass: "flag-TG",
		countryCode: "+228-",
		countryName: "Togo +228"
	}, {
		countryClass: "flag-DM",
		countryCode: "+1767-",
		countryName: "Dominican +1767"
	}, {
		countryClass: "flag-DO",
		countryCode: "+1809-",
		countryName: "Dominican Republic +1809"
	}, {
		countryClass: "flag-RU",
		countryCode: "+7-",
		countryName: "Russian Federation +7"
	}, {
		countryClass: "flag-EC",
		countryCode: "+593-",
		countryName: "Ecuador +593"
	}, {
		countryClass: "flag-ER",
		countryCode: "+291-",
		countryName: "Eritrea +291"
	}, {
		countryClass: "flag-FR",
		countryCode: "+33-",
		countryName: "France +33"
	}, {
		countryClass: "flag-FO",
		countryCode: "+298-",
		countryName: "Faroe Islands +298"
	}, {
		countryClass: "flag-PF",
		countryCode: "+689-",
		countryName: "French Polynesia +689"
	}, {
		countryClass: "flag-GF",
		countryCode: "+594-",
		countryName: "French Guiana +594"
	}, {
		countryClass: "flag-PH",
		countryCode: "+63-",
		countryName: "Philippines +63"
	}, {
		countryClass: "flag-FJ",
		countryCode: "+679-",
		countryName: "Fiji +679"
	}, {
		countryClass: "flag-FI",
		countryCode: "+358-",
		countryName: "Finland +358"
	}, {
		countryClass: "flag-CV",
		countryCode: "+238-",
		countryName: "Cape Verde +238"
	}, {
		countryClass: "flag-GM",
		countryCode: "+220-",
		countryName: "Gambia +220"
	}, {
		countryClass: "flag-CG",
		countryCode: "+242-",
		countryName: "Republic of the Congo +242"
	}, {
		countryClass: "flag-CD",
		countryCode: "+243-",
		countryName: "Democratic of the Congo +243"
	}, {
		countryClass: "flag-CO",
		countryCode: "+57-",
		countryName: "Colombia +57"
	}, {
		countryClass: "flag-CR",
		countryCode: "+506-",
		countryName: "Costa Rica +506"
	}, {
		countryClass: "flag-GD",
		countryCode: "+1473-",
		countryName: "Grenada +1473"
	}, {
		countryClass: "flag-GL",
		countryCode: "+299-",
		countryName: "Greenland +299"
	}, {
		countryClass: "flag-GE",
		countryCode: "+995-",
		countryName: "Georgia +995"
	}, {
		countryClass: "flag-CU",
		countryCode: "+53-",
		countryName: "Cuba +53"
	}, {
		countryClass: "flag-GP",
		countryCode: "+590-",
		countryName: "Guadeloupe +590"
	}, {
		countryClass: "flag-GU",
		countryCode: "+1671-",
		countryName: "Guam +1671"
	}, {
		countryClass: "flag-GY",
		countryCode: "+592-",
		countryName: "Guyana +592"
	}, {
		countryClass: "flag-KZ",
		countryCode: "+7-",
		countryName: "Kazakhstan +7"
	}, {
		countryClass: "flag-HT",
		countryCode: "+509-",
		countryName: "Haiti +509"
	}, {
		countryClass: "flag-NL",
		countryCode: "+31-",
		countryName: "Netherlands +31"
	}, {
		countryClass: "flag-AN",
		countryCode: "+599-",
		countryName: "Netherlands Antilles +599"
	}, {
		countryClass: "flag-ME",
		countryCode: "+382-",
		countryName: "Montenegro +382"
	}, {
		countryClass: "flag-HN",
		countryCode: "+504-",
		countryName: "Honduras +504"
	}, {
		countryClass: "flag-DJ",
		countryCode: "+253-",
		countryName: "Djibouti +253"
	}, {
		countryClass: "flag-KG",
		countryCode: "+996-",
		countryName: "Kyrgyzstan +996"
	}, {
		countryClass: "flag-GN",
		countryCode: "+224-",
		countryName: "Guinea +224"
	}, {
		countryClass: "flag-GW",
		countryCode: "+245-",
		countryName: "Guinea-Bissau +245"
	}, {
		countryClass: "flag-GH",
		countryCode: "+233-",
		countryName: "Ghana +233"
	}, {
		countryClass: "flag-GA",
		countryCode: "+241-",
		countryName: "Gabon +241"
	}, {
		countryClass: "flag-KH",
		countryCode: "+855-",
		countryName: "Cambodia +855"
	}, {
		countryClass: "flag-CZ",
		countryCode: "+420-",
		countryName: "The Czech Republic +420"
	}, {
		countryClass: "flag-ZW",
		countryCode: "+263-",
		countryName: "Zimbabwe +263"
	}, {
		countryClass: "flag-CM",
		countryCode: "+237-",
		countryName: "Cameroon +237"
	}, {
		countryClass: "flag-QA",
		countryCode: "+974-",
		countryName: "Qatar +974"
	}, {
		countryClass: "flag-KY",
		countryCode: "+1345-",
		countryName: "Cayman Islands +1345"
	}, {
		countryClass: "flag-KM",
		countryCode: "+269-",
		countryName: "Comoros +269"
	}, {
		countryClass: "flag-KW",
		countryCode: "+965-",
		countryName: "Kuwait +965"
	}, {
		countryClass: "flag-HR",
		countryCode: "+385-",
		countryName: "Croatia +385"
	}, {
		countryClass: "flag-KE",
		countryCode: "+254-",
		countryName: "Kenya +254"
	}, {
		countryClass: "flag-CK",
		countryCode: "+682-",
		countryName: "Cook Islands +682"
	}, {
		countryClass: "flag-LV",
		countryCode: "+371-",
		countryName: "Latvia +371"
	}, {
		countryClass: "flag-LS",
		countryCode: "+266-",
		countryName: "Lesotho +266"
	}, {
		countryClass: "flag-LA",
		countryCode: "+856-",
		countryName: "Laos +856"
	}, {
		countryClass: "flag-LB",
		countryCode: "+961-",
		countryName: "Lebanon +961"
	}, {
		countryClass: "flag-LT",
		countryCode: "+370-",
		countryName: "Lithuania +370"
	}, {
		countryClass: "flag-LR",
		countryCode: "+231-",
		countryName: "Liberia +231"
	}, {
		countryClass: "flag-LY",
		countryCode: "+218-",
		countryName: "Libya +218"
	}, {
		countryClass: "flag-LI",
		countryCode: "+423-",
		countryName: "Liechtenstein +423"
	}, {
		countryClass: "flag-RE",
		countryCode: "+262-",
		countryName: "Reunion Island +262"
	}, {
		countryClass: "flag-LU",
		countryCode: "+352-",
		countryName: "Luxembourg +352"
	}, {
		countryClass: "flag-RW",
		countryCode: "+250-",
		countryName: "Rwanda +250"
	}, {
		countryClass: "flag-RO",
		countryCode: "+40-",
		countryName: "Romania +40"
	}, {
		countryClass: "flag-Myanmar",
		countryCode: "+95-",
		countryName: "Myanmar +95"
	}, {
		countryClass: "flag-MG",
		countryCode: "+261-",
		countryName: "Madagascar +261"
	}, {
		countryClass: "flag-MV",
		countryCode: "+960-",
		countryName: "Maldives +960"
	}, {
		countryClass: "flag-MT",
		countryCode: "+356-",
		countryName: "Malta +356"
	}, {
		countryClass: "flag-MW",
		countryCode: "+265-",
		countryName: "Malawi +265"
	}, {
		countryClass: "flag-ML",
		countryCode: "+223-",
		countryName: "Mali +223"
	}, {
		countryClass: "flag-MK",
		countryCode: "+389-",
		countryName: "Macedonia +389"
	}, {
		countryClass: "flag-MQ",
		countryCode: "+596-",
		countryName: "Martinique +596"
	}, {
		countryClass: "flag-MU",
		countryCode: "+230-",
		countryName: "Mauritius +230"
	}, {
		countryClass: "flag-MR",
		countryCode: "+222-",
		countryName: "Mauritania +222"
	}, {
		countryClass: "flag-MN",
		countryCode: "+976-",
		countryName: "Mongolia +976"
	}, {
		countryClass: "flag-MS",
		countryCode: "+1664-",
		countryName: "Montserrat +1664"
	}, {
		countryClass: "flag-BD",
		countryCode: "+880-",
		countryName: "Bangladesh +880"
	}, {
		countryClass: "flag-PE",
		countryCode: "+51-",
		countryName: "Peru +51"
	}, {
		countryClass: "flag-MD",
		countryCode: "+373-",
		countryName: "Moldova +373"
	}, {
		countryClass: "flag-MA",
		countryCode: "+212-",
		countryName: "Morocco +212"
	}, {
		countryClass: "flag-MC",
		countryCode: "+377-",
		countryName: "Monaco +377"
	}, {
		countryClass: "flag-MZ",
		countryCode: "+258-",
		countryName: "Mozambique +258"
	}, {
		countryClass: "flag-MX",
		countryCode: "+52-",
		countryName: "Mexico +52"
	}, {
		countryClass: "flag-NA",
		countryCode: "+264-",
		countryName: "Namibia +264"
	}, {
		countryClass: "flag-ZA",
		countryCode: "+27-",
		countryName: "South Africa +27"
	}, {
		countryClass: "flag-SS",
		countryCode: "+211-",
		countryName: "South Sudan +211"
	}, {
		countryClass: "flag-NP",
		countryCode: "+977-",
		countryName: "Nepal +977"
	}, {
		countryClass: "flag-NI",
		countryCode: "+505-",
		countryName: "Nicaragua +505"
	}, {
		countryClass: "flag-NE",
		countryCode: "+227-",
		countryName: "Niger +227"
	}, {
		countryClass: "flag-NG",
		countryCode: "+234-",
		countryName: "Nigeria +234"
	}, {
		countryClass: "flag-NO",
		countryCode: "+47-",
		countryName: "Norway +47"
	}, {
		countryClass: "flag-PT",
		countryCode: "+351-",
		countryName: "Portugal +351"
	}, {
		countryClass: "flag-X3",
		countryCode: "+680-",
		countryName: "Palau +680"
	}, {
		countryClass: "flag-SE",
		countryCode: "+46-",
		countryName: "Sweden +46"
	}, {
		countryClass: "flag-CH",
		countryCode: "+41-",
		countryName: "Switzerland +41"
	}, {
		countryClass: "flag-SV",
		countryCode: "+503-",
		countryName: "El Salvador +503"
	}, {
		countryClass: "flag-WS",
		countryCode: "+685-",
		countryName: "Samoa +685"
	}, {
		countryClass: "flag-RS",
		countryCode: "+381-",
		countryName: "Serbia +381"
	}, {
		countryClass: "flag-SL",
		countryCode: "+232-",
		countryName: "Sierra Leone +232"
	}, {
		countryClass: "flag-SN",
		countryCode: "+221-",
		countryName: "Senegal +221"
	}, {
		countryClass: "flag-CY",
		countryCode: "+357-",
		countryName: "Cyprus +357"
	}, {
		countryClass: "flag-SC",
		countryCode: "+248-",
		countryName: "Seychelles +248"
	}, {
		countryClass: "flag-SA",
		countryCode: "+966-",
		countryName: "Saudi Arabia +966"
	}, {
		countryClass: "flag-ST",
		countryCode: "+239-",
		countryName: "Sao Tome and Principe +239"
	}, {
		countryClass: "flag-KN",
		countryCode: "+1869-",
		countryName: "Saint Kitts and Nevis +1869"
	}, {
		countryClass: "flag-LC",
		countryCode: "+1758-",
		countryName: "Saint Lucia +1758"
	}, {
		countryClass: "flag-SM",
		countryCode: "+378-",
		countryName: "San Marino +378"
	}, {
		countryClass: "flag-PM",
		countryCode: "+508-",
		countryName: "Saint Pierre et Miquelon +508"
	}, {
		countryClass: "flag-VC",
		countryCode: "+1784-",
		countryName: "Saint Vincent +1784"
	}, {
		countryClass: "flag-LK",
		countryCode: "+94-",
		countryName: "Sri Lanka +94"
	}, {
		countryClass: "flag-SK",
		countryCode: "+421-",
		countryName: "Slovakia +421"
	}, {
		countryClass: "flag-SI",
		countryCode: "+386-",
		countryName: "Slovenia +386"
	}, {
		countryClass: "flag-SZ",
		countryCode: "+268-",
		countryName: "Swaziland +268"
	}, {
		countryClass: "flag-SD",
		countryCode: "+249-",
		countryName: "Sudan +249"
	}, {
		countryClass: "flag-SR",
		countryCode: "+597-",
		countryName: "Suriname +597"
	}, {
		countryClass: "flag-SO",
		countryCode: "+252-",
		countryName: "Somalia +252"
	}, {
		countryClass: "flag-X2",
		countryCode: "+677-",
		countryName: "Solomon Islands +677"
	}, {
		countryClass: "flag-TJ",
		countryCode: "+992-",
		countryName: "Tajikistan +992"
	}, {
		countryClass: "flag-TH",
		countryCode: "+66-",
		countryName: "Thailand +66"
	}, {
		countryClass: "flag-TZ",
		countryCode: "+255-",
		countryName: "Tanzania +255"
	}, {
		countryClass: "flag-TO",
		countryCode: "+676-",
		countryName: "Tonga +676"
	}, {
		countryClass: "flag-TC",
		countryCode: "+1649-",
		countryName: "Turks and Caicos Islands +1649"
	}, {
		countryClass: "flag-TT",
		countryCode: "+1868-",
		countryName: "Trinidad and Tobago +1868"
	}, {
		countryClass: "flag-TN",
		countryCode: "+216-",
		countryName: "Tunisia +216"
	}, {
		countryClass: "flag-TR",
		countryCode: "+90-",
		countryName: "Turkey +90"
	}, {
		countryClass: "flag-TM",
		countryCode: "+993-",
		countryName: "Turkmenistan +993"
	}, {
		countryClass: "flag-VU",
		countryCode: "+678-",
		countryName: "Vanuatu +678"
	}, {
		countryClass: "flag-GT",
		countryCode: "+502-",
		countryName: "Guatemala +502"
	}, {
		countryClass: "flag-VE",
		countryCode: "+58-",
		countryName: "Venezuela +58"
	}, {
		countryClass: "flag-BN",
		countryCode: "+673-",
		countryName: "Brunei +673"
	}, {
		countryClass: "flag-UG",
		countryCode: "+256-",
		countryName: "Uganda +256"
	}, {
		countryClass: "flag-UA",
		countryCode: "+380-",
		countryName: "Ukraine +380"
	}, {
		countryClass: "flag-UY",
		countryCode: "+598-",
		countryName: "Uruguay +598"
	}, {
		countryClass: "flag-UZ",
		countryCode: "+998-",
		countryName: "Uzbekistan +998"
	}, {
		countryClass: "flag-ES",
		countryCode: "+34-",
		countryName: "Spain +34"
	}, {
		countryClass: "flag-GR",
		countryCode: "+30-",
		countryName: "Greece +30"
	}, {
		countryClass: "flag-CI",
		countryCode: "+225-",
		countryName: "Ivory Coast +225"
	}, {
		countryClass: "flag-NC",
		countryCode: "+687-",
		countryName: "New Caledonia +687"
	}, {
		countryClass: "flag-HU",
		countryCode: "+36-",
		countryName: "Hungary +36"
	}, {
		countryClass: "flag-SY",
		countryCode: "+963-",
		countryName: "Syria +963"
	}, {
		countryClass: "flag-JM",
		countryCode: "+1876-",
		countryName: "Jamaica +1876"
	}, {
		countryClass: "flag-AM",
		countryCode: "+374-",
		countryName: "Armenia +374"
	}, {
		countryClass: "flag-YE",
		countryCode: "+967-",
		countryName: "Yemen +967"
	}, {
		countryClass: "flag-IQ",
		countryCode: "+964-",
		countryName: "Iraq +964"
	}, {
		countryClass: "flag-IR",
		countryCode: "+98-",
		countryName: "Iran +98"
	}, {
		countryClass: "flag-IL",
		countryCode: "+972-",
		countryName: "Israel +972"
	}, {
		countryClass: "flag-IT",
		countryCode: "+39-",
		countryName: "Italy +39"
	}, {
		countryClass: "flag-IN",
		countryCode: "+91-",
		countryName: "India +91"
	}, {
		countryClass: "flag-ID",
		countryCode: "+62-",
		countryName: "Indonesia +62"
	}, {
		countryClass: "flag-GB",
		countryCode: "+44-",
		countryName: "United Kingdom +44"
	}, {
		countryClass: "flag-VG",
		countryCode: "+1340-",
		countryName: "British Virgin Islands +1340"
	}, {
		countryClass: "flag-JO",
		countryCode: "+962-",
		countryName: "Jordan +962"
	}, {
		countryClass: "flag-VN",
		countryCode: "+84-",
		countryName: "Viet Nam +84"
	}, {
		countryClass: "flag-ZM",
		countryCode: "+260-",
		countryName: "Zambia +260"
	}, {
		countryClass: "flag-JE",
		countryCode: "+44-",
		countryName: "Jersey +44"
	}, {
		countryClass: "flag-TD",
		countryCode: "+235-",
		countryName: "Chad +235"
	}, {
		countryClass: "flag-GI",
		countryCode: "+350-",
		countryName: "Gibraltar +350"
	}, {
		countryClass: "flag-CL",
		countryCode: "+56-",
		countryName: "Chile +56"
	}, {
		countryClass: "flag-CF",
		countryCode: "+236-",
		countryName: "Central African Republic +236"
	}];
	return s
});
I$("facc340e79eadf3a9f6671c0e71dbe82", function (e, t, i, n, s, a, r, o, c, d, _) {
	var l = Regular.extend({
		template: s,
		name: "country",
		data: {
			hidden: 1
		},
		config: function (e) {
			e = e || {};
			t._$merge(this.data, e);
			e.countryList = this._filterCountry(e);
			e.countryList = this._sortCountry(e.countryList);
			this.supr(e)
		},
		_sortCountry: function (e) {
			var i = e.concat();
			var n = e.concat();
			if (window._$URSOPT.commonAreas) {
				var s = window._$URSOPT.commonAreas.split(",") || [];
				var a = [],
					r = [];
				t._$reverseEach(n, function (e, i) {
					var r = e.countryCode.replace(/[\+\-]/g, "");
					var o = t._$indexOf(s, r);
					if (o !== -1) {
						a[o] = e;
						n.splice(i, 1)
					}
				}._$bind(this));
				t._$forEach(a, function (e, t) {
					if (e) r.push(e)
				}._$bind(this));
				i = r.concat(n)
			}
			return i
		},
		_filterCountry: function (e) {
			var i = window._$URSOPT.enlang;
			var n = 1 == i ? r.concat() : a.concat();
			var s = window._$URS.hideAreas;
			if (e.isMailReg && s && s.length > 0) t._$reverseEach(n, function (e, i) {
				var a = e.countryCode.replace(/[\+\-]/g, "");
				if (t._$indexOf(s, a) !== -1) n.splice(i, 1)
			}._$bind(this));
			return n
		},
		init: function (e) {
			this.supr(e)
		},
		onClick: function (t) {
			e._$stop(t);
			var n = e._$getElement(t),
				s = i._$dataset(n, "code");
			if (s) {
				this.data.countryArea = s;
				this.$emit("setCode", {
					code: s,
					className: n.className
				})
			}
		},
		setCountry: function (e, n, s) {
			if (!s && !e && window._$URSOPT.firstArea && t._$isNumber(window._$URSOPT.firstArea)) e = ["+", window._$URSOPT.firstArea, "-"].join("");
			e = e || "+86-";
			var a = i._$getByClassName(document, "j-country")[0];
			var r = i._$getChildren(a);
			t._$forEach(r, function (t) {
				var s = i._$dataset(t, "code");
				if (s == e) {
					this.data.countryArea = e;
					this.$emit("setCode", {
						code: e,
						className: t.className,
						nofocus: n
					});
					this.data.hidden = 1;
					this.$emit("hideCountry");
					this.$update()
				}
			}._$bind(this))
		},
		getArea: function () {
			return this.data.countryArea
		}
	});
	return l
}, "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a13cd829d734e255809c920485d5a6b2", "35556ed2cbe57845a6fcd07d1a9cfebe", "420d443e889a68e94b0376ca02626a43", "9f04a93d717c1c5979d4b010c0e6d7fe");
I$("5019a97f49cafc5e6cc6da470054165c", function (e, t, i, n, s, a, r, o, c, d, _, l, u, f, h) {
	var p = s.extend({
		template: a,
		data: {
			needCheck: 1,
			tabIndex: 1,
			changeItlTxt: "切换到国际手机",
			placeholder: "请输入手机号",
			regexp: /^(13|14|15|16|17|18|19)\d{9}$/,
			errTxt: "手机号码格式错误，请更换后重试",
			emptyTxt: "请输入手机号",
			disabled: "",
			shakecss: "",
			closeshakecss: "",
			isDesClazz: ""
		},
		config: function (t) {
			var n = e._$KERNEL;
			if ("trident" == n.engine && parseInt(n.release, 10) <= 3) this.data.isLowIE = 1;
			this.enlang = window._$URSOPT.enlang;
			if (1 == this.enlang) {
				var s = ["changeItlTxt", "placeholder", "errTxt", "emptyTxt"];
				i._$forEach(s, function (e) {
					this.data[e] = _.showText(this.data[e], 1)
				}._$bind(this))
			}
			i._$merge(this.data, t || {});
			this.supr(t);
			if (c._$isVersionFour()) {
				this.data.isVersionFour = !0;
				if (this.data.mbNeedItl) this.data.mbOnlyItl = 1
			}
		},
		init: function () {
			var e = function () {
				this.$update();
				setTimeout(function () {
					if (this.$refs && this.$refs.country)
						if (!this.$refs.country.getArea()) this.$refs.country.setCountry("", 1, this.data.fromsmsup)
				}._$bind(this), 10)
			};
			return function (t) {
				this.data.mbHasItl = 0;
				if (this.data.mbOnlyItl) {
					this.data.mbHasItl = 1;
					e.call(this)
				}
				if ("1" == this.data.fromUnite) e.call(this);
				else if (!this.data.mbOnlyItl) {
					this.data.itlClazz = "country flag-US";
					this.data.firstCountry = "+86-";
					this.data.countryNumber = this.data.firstCountry.replace("-", "")
				}
				this.$watch("mbHasItl", this.watchMbHasItl._$bind(this));
				setTimeout(function () {
					this.__setInputMaxLength()
				}._$bind(this), 200);
				this.supr(t)
			}
		}(),
		onHideCountry: function () {
			this.data.itlOpened = !1;
			this.$update()
		},
		watchMbHasItl: function (e) {
			var t = !!e;
			this.$emit("mbhasitl", t)
		},
		onChangeItl: function () {
			if (!this.data.fromsmsup) {
				this.data.hasError = 0;
				this.data.active = 0;
				this.data.hasValue = 0;
				this.$emit("rmError", {
					tabIndex: this.data.tabIndex,
					target: this.$refs.input
				});
				this.data.mbHasItl = !this.data.mbHasItl;
				this.data.changeItlTxt = this.data.mbHasItl ? "切换到国内手机" : "切换到国际手机";
				setTimeout(this.__setInputMaxLength._$bind(this), 0)
			} else this.$emit("changemobile")
		},
		__toggleC: function (e) {
			var i = e.code;
			var s = e.className;
			t._$stop(i);
			if (this.data.isLowIE) {
				this.$refs.mbInput.style.position = "absolute";
				this.$refs.mbInput.style.zIndex = "999";
				setTimeout(function () {
					this.$refs.mbInput.style.position = "relative"
				}._$bind(this), 40)
			}
			if (!this.data.fromsmsup && !this.data.isDes) {
				this.$refs.country.data.hidden = this.$refs.country.data.hidden ? 0 : 1;
				if (this.data.disabled) this.$refs.country.data.hidden = 1
			}
			this.data.itlOpened = !this.$refs.country.data.hidden;
			if ("string" == typeof i) {
				this.data.itlClazz = "country " + s;
				n._$dataset(this.$refs.itlBtn, "code", i);
				this.data.countryNumber = i.replace("-", "");
				this.__setInputMaxLength();
				if (1 !== e.nofocus) try {
					this.$refs.input.focus()
				} catch (a) { }
			}
			this.$refs.country.$update();
			this.$update()
		},
		__setInputMaxLength: function () {
			if (this.data.mbHasItl)
				if (this.$refs && this.$refs.input) {
					this.$refs.input.maxLength = "+86" === this.data.countryNumber ? 11 : 50;
					this.data.regexp = "+86" === this.data.countryNumber ? /^(13|14|15|16|17|18|19)\d{9}$/ : /^\d{3,19}$/
				}
		},
		trySetMobile: function (e) {
			var t = e.split("-");
			if (!this.data.mbHasItl) {
				if (e.indexOf("-") < 0) this._$setValue(e)
			} else if (e.indexOf("-") === -1) {
				this.$refs.country.setCountry("+86-", 1);
				this._$setValue(t[0])
			} else {
				this.$refs.country.setCountry("+" + t[0] + "-", 1);
				this._$setValue(t[1])
			}
		},
		onFocus: function (e) {
			this.supr(e);
			if (this.$refs && this.$refs.country) {
				this.$refs.country.data.hidden = 1;
				this.data.itlOpened = !this.$refs.country.data.hidden;
				this.$refs.country.$update()
			}
			this.$update()
		},
		_$getValueForUrl: function () {
			if (c._$isDes()) return "";
			else return this._$getValue()
		},
		_$getValue: function (e) {
			var t, i = this.$refs.input.value.trim();
			if (this.data.mbHasItl) {
				t = n._$dataset(this.$refs.itlBtn, "code");
				if ("+86-" == t)
					if (e) return c._$emailFilter(t.split("+")[1] + i);
					else return c._$emailFilter(i);
				t = t.split("+")[1];
				if (!e && !i) return "";
				else return c._$emailFilter(t + i)
			} else return c._$emailFilter(i)
		},
		_$setHasError: function () {
			this.data.hasError = 1;
			this.$update()
		},
		onShake: function () {
			if (this.data.isDes) {
				this.data.closeshakecss = "u-shake-close";
				this.shakesto = setTimeout(function () {
					this.data.closeshakecss = "";
					this.$update()
				}._$bind(this), 1e3)
			} else this.$emit("shake");
		},
		_$setCountry: function (e, t, i) {
			if (this.$refs.country) this.$refs.country.setCountry(e, t, i)
		},
		_$getInputRef: function () {
			return this.$refs.input
		}
	});
	return p
}, "a878c0216188111f46d39b9df767b354", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "18b25c9751295445fbbb6b3eea3687b1", "fbc7461d750287ea4accba3b2d5edebd", "d6e36b6b1f96e15e42725a59e7acd142", "53c267efd983fb8c66cb645beead7a8d", "a4de926c2d79e8d8f856eaff4dac0f8b", "facc340e79eadf3a9f6671c0e71dbe82", "46a4de3a50f50a600950ca9cee88031e");
I$("695257d8d6444f89067833b29a8c3cc8", '<div data-safepwdbox="safepwdbox" r-hide={ish5upsms===1} {#if active && (!hasError||needSafePwd)}class="inputbox active u-pwdbox"{#elseif hasError===1}class="inputbox error-color"{#else}class="inputbox"{/if}>\n    <div class="u-logo"><div class="u-logo-img2"></div></div>\n    <div class="u-input box" {#if needSafePwd}on-click="{this.doPwdFocus($event)}"{/if}>\n        <label on-click={this.onLabelFocus($event)} {#if !labelHidden && !hasValue}class="u-label"{#else}class="u-label f-dn"{/if}>{placeholder}</label>\n        <input type="password" style="display:none;width:0;height:0;">\n        <input needSafePwd={needSafePwd} {#if needSafePwd}readonly="readonly"{/if} {#if isIOS}on-touchend={this.onHackFocus($event)}{/if} on-propertychange={this.onPropertychange($event)} ref="input" on-focus={this.onFocus($event)} on-input={this.onInput($event)} on-blur={this.onBlur($event)} placeholder="{placeholder}" name="email" class="j-inputtext dlemail" type="password" autocomplete="new-password" tabindex="{tabindex}" r-model={pwdValue} spellcheck="false">\n        <input {#if needSafePwd}readonly="readonly"{/if} {#if isIOS}on-touchend={this.onHackFocus($event)}{/if} type="text" on-propertychange={this.onPropertychange($event)} on-focus={this.onFocus($event)} on-input={this.onInput($event)} on-blur={this.onBlur($event)} ref="inputtext" placeholder="{placeholder}" class="u-pwdtext" {#if needEye && eyeActive}style="z-index:1;"{#else}style="z-index:-1;"{/if} r-model={pwdValue} spellcheck="false" />\n    </div>\n    {#if needEye}\n        <div on-mouseover={this.onMouseOver()} on-mouseout={this.onMouseOut()} on-click={this.onChangePwdType($event)} {#if eyeActive}class="u-tip-eye m-eye u-pwdshow-mb eyeactive"{#else}class="u-tip-eye m-eye u-pwdshow-mb"{/if} ><div class="u-success u-eye u-clear"></div></div>\n        <div on-mouseover={this.onMouseOver()} on-mouseout={this.onMouseOut()}  on-click={this.onClearInput($event)} class="u-tip" {#if pwdValue && showBtn}style="display:block;"{#else}style="display:none;"{/if}><div class="u-success u-clear"></div></div>\n    {#else}\n        <div on-mouseover={this.onMouseOver()} on-mouseout={this.onMouseOut()}  on-click={this.onClearInput($event)} class="u-tip" {#if pwdValue && showBtn}style="display:block;"{#else}style="display:none;"{/if}><div class="u-success u-clear"></div></div>\n    {/if}\n</div>');
I$("7ac9d06f817adcdab54eea77e53ebe6a", function (e, t, i, n, s, a, r, o, c, d) {
	var _ = n.extend({
		template: s,
		data: {
			tabindex: 2,
			tabIndex: 2,
			placeholder: "请输入密码",
			errTxt: "8-16位大小写字母、数字、符号3种以上组合",
			emptyTxt: "请输入密码",
			eyeActive: 0,
			clazz: ""
		},
		config: function (e) {
			t._$merge(this.data, e || {});
			if (this.data.needCheck) this.otherCheck = this._$doOtherCheck._$bind(this);
			this.supr(e)
		},
		init: function (e) {
			this.supr(e)
		},
		onCheckRegexp: function () {
			this.data.active = 0;
			this.data.hasError = 0
		},
		onChangePwdType: function () {
			this.data.eyeActive = this.data.eyeActive ? 0 : 1;
			try {
				if (!this.data.needSafePwd)
					if (this.data.eyeActive) this.$refs.inputtext.focus();
					else this.$refs.input.focus()
			} catch (e) { }
			this.$update()
		},
		_$doOtherCheck: function () {
			var e = this.$refs.input.value;
			if (e) {
				this.$emit("pwdOtherCheck", e);
				return 1
			}
		},
		_$showErrorFromParent: function (e) {
			if (this.$parent.errorIndex == -1 || this.data.tabIndex <= this.$parent.errorIndex) this.data.hasError = 1;
			else this.data.hasError = 2;
			this.$update();
			this.$emit("showError", {
				tabIndex: this.data.tabIndex,
				str: e,
				target: this.$refs.input
			})
		},
		_$hasError: function () {
			return !!this.data.hasError
		},
		_$setValue: function (e) {
			this.supr(e);
			this.data.pwdValue = e;
			this.$update()
		},
		doPwdFocus: function (t) {
			this.onFocus(t);
			var n = e._$getElement(t);
			var s = a._$findDataCode(n, "safepwdbox");
			var r = i._$offset(s);
			var o = !this.data.pwdValue;
			if (this.data.needSafePwd) a._$postMessage("_parent", {
				data: {
					type: "doPwdFocus",
					offset: r,
					clearPwd: o
				}
			})
		},
		onClearInput: function (e) {
			this.supr(e);
			this.doPwdFocus(e)
		}
	});
	return _
}, "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "18b25c9751295445fbbb6b3eea3687b1", "695257d8d6444f89067833b29a8c3cc8", "a4de926c2d79e8d8f856eaff4dac0f8b");
I$("64f39a8849b9813bf5a252ee03f6216b", '<div class="ckbox m-ckcnt f-cb">\n    <div {#if active && !hasError}class="inputbox ckin active"{#elseif hasError===1}class="inputbox ckin error-color"{#else}class="inputbox ckin"{/if}>\n        <div class="u-input">\n            <label on-click={this.onLabelFocus($event)} {#if !labelHidden && !hasValue}class="u-label"{#else}class="u-label f-dn"{/if}>{placeholder}</label>\n            <input {#if isIOS}on-touchend={this.onHackFocus($event)}{/if} on-propertychange={this.onPropertychange($event)} ref="input" placeholder="{placeholder}" on-focus={this.onFocus($event)} on-input={this.onInput($event)} on-blur={this.onBlur($event)} name="checkcode" class="cktext" type="text" maxlength="4" tabindex="2" autocomplete="off" spellcheck="false" {#if disabled}disabled="disabled"{/if}></div>\n        <div on-mouseover={this.onMouseOver()} on-click={this.onClearInput($event)} class="u-tip" {#if showBtn && hasValue && !vfsuc}style="display:block;"{/if}><div class="u-success u-clear"></div></div>\n        <div class="u-tip" {#if vfsuc}style="display:block;"{/if}><div class="u-success u-suc"></div></div>\n    </div>\n    <div class="inputbox ckimgbox f-fr">\n        <img on-click={this.refreshImg()} ref="captcha" class="ckimg" title={freshTxt} alt={altTxt} />\n    </div>\n    {#if imgRefreshTip}\n    <a class="cklink" on-click={this.refreshImg()}>{refreshTxt}</a>\n    {/if}\n</div>\n');
I$("5312c1874a87427492f714754fc9318b", function (e, t, i, n, s, a, r, o, c, d, _, l, u) {
	var f = n.extend({
		template: r,
		data: {
			ignore: 1,
			needCheck: 1,
			tabIndex: 2,
			placeholder: "请输入图片验证码",
			regexp: /^[0-9a-zA-Z]{4}$/,
			errTxt: "图片验证码格式错误",
			emptyTxt: "请输入图片验证码",
			refreshTxt: "点击刷新图片",
			altTxt: "点击获取验证码",
			freshTxt: "点击刷新验证码"
		},
		config: function (e) {
			this.enlang = window._$URSOPT.enlang;
			if (1 == this.enlang) {
				var i = ["placeholder", "errTxt", "emptyTxt", "refreshTxt", "altTxt", "freshTxt"];
				t._$forEach(i, function (e) {
					this.data[e] = c.showText(this.data[e], this.enlang)
				}._$bind(this))
			}
			t._$merge(this.data, e || {});
			this.__product = e.product;
			this.__pkid = e.promark;
			this.supr(e)
		},
		init: function (e) {
			this.supr(e);
			this.refreshImg()
		},
		vfCapSuccess: function () {
			this.__vfcapLock = 0;
			this.data.vfsuc = 1;
			this.data.disabled = 1;
			this.data.hasValue = 1;
			this.getImglock = 1;
			this.data.active = 0;
			this.$update()
		},
		__fail5: function () {
			var e = "mb" + this.data.channel;
			if (o._$fail5(e)) return !0
		},
		vfCapError: function (e) {
			if (!this.__fail5()) {
				var t = "",
					i = "mb-vfcp-";
				if (this.data.isUnite) i = "mb-nvfcp-";
				this.__vfcapLock = 0;
				this.data.active = 1;
				var n = e.ret;
				if ("447" != n) {
					if ("441" == n || "444" == n || "445" == n) {
						t = a[i + n] || a[n] || o._$getErrorTxt(n);
						this.$emit("refreshCap", {
							code: n,
							hasError: {
								tabIndex: this.data.tabIndex,
								str: t,
								target: null
							}
						});
						return
					} else this._$refreshImg(); if ("401" == n) n = i + e.ret;
					else n = i + e.ret + (e.dt || "");
					t = a[n] || o._$getErrorTxt(e.ret);
					this.$emit("showError", {
						tabIndex: this.data.tabIndex,
						str: t,
						target: this.$refs.input
					});
					this.$update()
				} else this.$emit("refreshCap", {
					code: n
				})
			}
		},
		_vfcaptcha: function (e) {
			if (!this.__vfcapLock) {
				this.__vfcapLock = 1;
				var t = {};
				t.pd = this.data.product;
				t.pkid = this.data.promark;
				t.cap = e;
				t.channel = this.data.channel;
				t.un = this.$parent.getUn();
				var i = "mb-vfcp";
				if (this.data.isUnite) {
					t.pkht = this.data.host;
					i = "mb-nvfcp"
				}
				if ("mb-vfcp" === i)
					if (o._$isDes()) {
						delete t.un;
						t.encUn = window._$URSOPT.desMobileReal
					}
				s._$request(i, t, this.vfCapSuccess._$bind(this), this.vfCapError._$bind(this), 1)
			}
		},
		onInput: function (e) {
			this.supr(e);
			var t = this.$refs.input.value.trim();
			if (this.data.needVf && this.data.regexp.test(t)) this._vfcaptcha(t)
		},
		refreshImg: function () {
			if (!this.getImglock)
				if (this.data.isUnite) this.$refs.captcha.src = MP["mb-ncp"]({
					product: this.__product,
					pkid: this.__pkid,
					pkht: this.data.host,
					channel: this.data.channel
				}, window["$cookieDomain"]);
				else if (this.data.isReg) this.$refs.captcha.src = MP["mb-reg-cp"]();
				else this.$refs.captcha.src = MP["mb-cp"](this.__product, this.__pkid, window["$cookieDomain"], this.data.channel)
		},
		_$refreshImg: function () {
			this.onClearInput();
			this.__vfcapLock = 0;
			this.getImglock = 0;
			this.data.disabled = 0;
			this.data.vfsuc = 0;
			this.data.hasValue = 0;
			this.$update();
			this.refreshImg()
		}
	});
	return f
}, "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "18b25c9751295445fbbb6b3eea3687b1", "53c267efd983fb8c66cb645beead7a8d", "d6e36b6b1f96e15e42725a59e7acd142", "64f39a8849b9813bf5a252ee03f6216b", "a4de926c2d79e8d8f856eaff4dac0f8b", "46a4de3a50f50a600950ca9cee88031e");
I$("64572428bb1919be361216a3f3e5b1c8", '<div ref=slidebox class="{clazz}" style="position: relative;">\n    <div ref=ScapTcha class="ScapTcha" id="ScapTcha"></div>\n    <input ref=slidecap name="slidecap" style="height:0;width:0;display:none;" type="text" value="" />\n</div>');
I$("1135272f84d09a1f87f596dd6a5819ae", function (e, t, i, n, s, a, r, o, c, d, _, l, u, f) {
	var h = n.extend({
		template: a,
		data: {
			ignore: 1,
			needCheck: 1,
			tabIndex: 3,
			errTxt: "请滑动验证码",
			hasError: 1,
			clazz: "ckbox m-ckcnt slidebox f-cb"
		},
		config: function (e) {
			this.enlang = window._$URSOPT.enlang;
			if (1 == this.enlang) this.data.errTxt = d.showText("请滑动验证码", this.enlang);
			var i = 1 == this.enlang ? d.showText("按住滑块，拖动完成上方拼图", this.enlang) : "按住滑块，拖动完成上方拼图";
			t._$merge(this.data, e || {});
			this.__product = e.product;
			this.__pkid = e.promark;
			this.__server = "captcha.reg.163.com/v2";
			this.__productkey = this.data.productkey;
			this.__swidth = this.data.swidth || 320;
			this.__hintTxt = this.data.hintTxt || i;
			this.supr(e);
			if (this.__isAiCap()) this.data.clazz = "ckbox m-ckcnt slidebox f-cb f-dn";
			else this.data.clazz = "ckbox m-ckcnt slidebox f-cb"
		},
		__initCallback: function () { },
		__initErrorHandler: function () {
			this.$emit("showError", {
				tabIndex: 100,
				str: 1 == this.enlang ? d.showText("加载失败，请刷新页面重试", this.enlang) : "加载失败，请刷新页面重试"
			})
		},
		init: function (e) {
			this.data.capValue = "";
			this.supr(e);
			this.refreshSlide()
		},
		getCapState: function () {
			return !this.data.hasError
		},
		__fail5: function () {
			var e = "mb" + this.data.channel;
			if (c._$fail5(e)) return !0
		},
		__newVerifyCap: function (e, t) {
			e.cap = t ? t.validate : this.__myCaptcha.getPwd();
			return e
		},
		__doVerify: function (e) {
			var t = {
				pd: this.__product,
				pkid: this.__pkid,
				capkey: this.__productkey,
				channel: this.data.channel
			};
			t.un = this.$parent.getUn();
			t = this.__newVerifyCap(t, e);
			this.__verifySlideCap(t)
		},
		__verifyFail: function (e) {
			this.$emit("unLockVerify", {});
			if (!this.__isAiCap() && "popup" == this.data.mode) this.__myCaptcha && this.__myCaptcha.doClose();
			if (!this.__fail5()) {
				var t = e.ret;
				this.__showSlideErr(1, t)
			}
		},
		__verifyOk: function () {
			this.__clearSlideErr();
			this.__setSlideSuc()
		},
		__verifySlideCap: function (e) {
			var i;
			if (this.data.isUniteLogin) e.pkht = this.data.host;
			if (this.__isAiCap()) {
				i = "mb-vfscp";
				if (this.data.isUniteLogin) i = "mb-nvfscp"
			} else {
				i = 2 == this.data.slideTarget ? "mb-vftcp" : "mb-vfccp";
				if (this.data.isUniteLogin) i = 2 == this.data.slideTarget ? "mb-nvftcp" : "mb-nvfccp"
			} if (t._$indexOf(["mb-vftcp", "mb-vfccp", "mb-vfscp"], i) !== -1)
				if (c._$isDes()) {
					delete e.un;
					e.encUn = window._$URSOPT.desMobileReal
				}
			this.prefix = i + "-";
			s._$request(i, e, this.__verifyOk._$bind(this), this.__verifyFail._$bind(this), 1)
		},
		__setSlideSuc: function () {
			if (!this.__isAiCap()) {
				if ("popup" == this.data.mode) {
					this.$emit("slideOk", {});
					this.__myCaptcha && this.__myCaptcha.doClose()
				}
				var e = i._$getByClassName(document, "ncpt_txt_status")[0];
				if (e) {
					e.style.display = "block";
					e.innerHTML = '<div class="u-success u-suc"></div>';
					e.className = "ncpt_txt_status TxtStatus statusTxt"
				}
			} else this.$emit("slideOk", {})
		},
		__slideVerify: function (e) {
			e.value = e.validate;
			if (e.value) {
				this.data.hasError = 0;
				this.__clearSlideErr();
				if (this.data.isPwLogin || this.data.isUniteLogin) this.__doVerify(e);
				else this.__setSlideSuc()
			} else this.__showSlideErr()
		},
		__showSlideErr: function (e, t) {
			var i = 1;
			this.data.hasError = 1;
			if (e) {
				if ("447" === t)
					if (this.__isAiCap()) this._$showAiErrTxt();
					else i = 0;
				else this.__showErrByCode(t);
				this.$emit("refreshCap", {
					code: t,
					forceNoAuto: i
				})
			} else this.__showErrTxt()
		},
		__showErrTxt: function () {
			if (this.__isAiCap()) this._$showAiErrTxt();
			else this.__showSlideErrTxt()
		},
		__showErrByCode: function (e) {
			this.prefix += e;
			var t = r[this.prefix] || r[e] || c._$getErrorTxt(e);
			this.$emit("showError", {
				tabIndex: this.data.tabIndex,
				str: t,
				target: this.$refs && this.$refs.input
			})
		},
		_$showAiErrTxt: function () {
			this.data.errTxt = c._$getAiBtnTxt();
			this.__showSlideErrTxt(this.data.errTxt)
		},
		__showSlideErrTxt: function (e) {
			this.data.errTxt = e || (2 == this.data.slideTarget ? window._$capTxt1 : window._$capTxt2);
			this.$emit("showError", {
				tabIndex: this.data.tabIndex,
				str: this.data.errTxt,
				target: this.$refs && this.$refs.input
			})
		},
		__clearSlideErr: function () {
			this.$emit("rmError", {
				tabIndex: this.data.tabIndex
			})
		},
		__onAiClose: function () {
			this.$emit("unLockVerify", {})
		},
		__doLockVerify: function () {
			this.$emit("lockVerify", {})
		},
		__doAutoVerify: function () {
			this.$emit("slideOk", {})
		},
		__getNewSlideCap: function (e) {
			var t = {
				capBox: this.$refs.slidebox,
				captchaType: this.data.slideTarget,
				parentNode: this.$refs.ScapTcha,
				customStyles: this.data.customStyles || {},
				capPadding: this.data.capPadding || "",
				capBarHeight: this.data.capBarHeight || "",
				isLogin: e,
				lang: this.data.lang,
				captchaId: this.data.productkey,
				mode: this.data.mode,
				width: this.data.swidth,
				verifyCallback: this.__slideVerify._$bind(this),
				initCallback: this.__initCallback._$bind(this),
				initErrorHandler: this.__initErrorHandler._$bind(this),
				doAutoVerify: this.__doAutoVerify._$bind(this),
				doLockVerify: this.__doLockVerify._$bind(this),
				onClose: this.__onAiClose._$bind(this)
			};
			if (this.__isAiCap()) {
				t.mode = "bind";
				t.autoVerify = this.data.forceNoAuto ? !1 : !0;
				t.capFlag = c._$getCfBySt(this.data.slideTarget)
			}
			if (this.__myCaptcha) this.__myCaptcha = this.__myCaptcha.destroy();
			this.__myCaptcha = new o({
				data: t
			})
		},
		__isAiCap: function () {
			return 4 === this.data.slideTarget
		},
		refreshSlide: function () {
			this.data.hasError = 1;
			this.data.slideTarget = this.$parent.getSlideTarget();
			var e = this.data.isUniteLogin || this.data.isLoginModule ? 1 : 0;
			this.__getNewSlideCap(e)
		},
		onCheckRegexp: function () {
			if (this.data.hasError) {
				this.__showSlideErr();
				if ("popup" == this.data.mode && !this.__isAiCap()) this.refreshSlide()
			}
			return this.data.hasError
		},
		_$getPwdValue: function () {
			return this.__myCaptcha.getPwd()
		},
		_$getCapKey: function () {
			return this.__isAiCap() ? c._$getAiCapId() : this.__productkey
		},
		_$getCt: function () {
			return this.__myCaptcha.getCt()
		},
		_$destroyNewCap: function () {
			this.data.hasError = 1;
			if (this.__myCaptcha) this.__myCaptcha = this.__myCaptcha.destroy()
		},
		_$doVerify: function () {
			if (this.__myCaptcha) this.__myCaptcha._$doVerify()
		},
		_$setForceNoAuto: function (e) {
			this.data.forceNoAuto = e || !1
		}
	});
	return h
}, "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "b62616ba5d59a47ea54fc057cbcd66b8", "53c267efd983fb8c66cb645beead7a8d", "64572428bb1919be361216a3f3e5b1c8", "d6e36b6b1f96e15e42725a59e7acd142", "41ef7aa93d23fe74cbf747774554e6ce", "a4de926c2d79e8d8f856eaff4dac0f8b", "46a4de3a50f50a600950ca9cee88031e");
I$("6cc03cb2cef6634c39673bc3567cabea", '<div class="m-container" on-click="{this.doAction($event)}">\n    <div class="u-tab f-cb">\n        <a class="tab1" on-click={this.goSmsLogin()}>{mbSmsLoginTxt}</a>\n    </div>\n    <!--帐号-->\n    <mninput mbOnlyItl="{mbOnlyItl}" mbNeedItl="{mbNeedItl}" needEye="{needEye}" ref=mninput on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} on-blur={this.onInputBlur($event)} placeholder="{mobilePlaceholder.mobile}" disabled="{preDisabled}" />\n    <div class="fur-change-email"></div>\n    <!--密码needEye="{needEye}"-->\n    <mpinput needEye="{needEye}" ref=mpinput on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} placeholder="{mobilePlaceholder.pwd1}" />\n    <!-- 验证码 -->\n    {#if hasImgCap}\n    <captcha ignore="0" imgRefreshTip="{imgRefreshTip}" needEye="{needEye}" ref=captcha on-refreshCap={this.doRefreshCap($event)} on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} product="{product}" promark="{promark}" needVf="1" channel="{channel}" placeholder="{mobilePlaceholder.cap1}"  />\n    {/if}\n    <!-- 滑块验证码 -->\n    {#if hasSlide}\n    <slidecap ignore="0" slideTarget={slideTarget} capBarHeight={capBarHeight} capPadding={capPadding} customStyles="{customStyles}" lang="{lang}" mode="{mode}" version="{version}" tabIndex=-1 ref=slidecap on-refreshCap={this.doRefreshCap($event)} isPwLogin=1 on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} server="{server}" productkey="{productkey}" swidth="{swidth}" product="{product}" promark="{promark}" hintTxt="{hintTxt}" channel="{channel}" isLoginModule=1 on-slideOk="{this.onSlideOk($event)}" />\n    {/if}\n    <!-- 保证类型切换slidecap会刷新 -->\n    {#if hasAiCap}\n    <slidecap ignore="1" forceNoAuto={forceNoAuto} isAiCap={hasAiCap} slideTarget={slideTarget} capBarHeight={capBarHeight} capPadding={capPadding} customStyles="{customStyles}" lang="{lang}" mode="{mode}" version="{version}" tabIndex=-1 ref=slidecap on-refreshCap={this.doRefreshCap($event)} isPwLogin=1 on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} server="{server}" productkey="{productkey}" swidth="{swidth}" product="{product}" promark="{promark}" hintTxt="{hintTxt}" channel="{channel}" isLoginModule=1 on-slideOk="{this.onSlideOk($event)}" on-lockVerify="{this.onLockVerify($event)}" on-unLockVerify="{this.onUnLockVerify($event)}" />\n    {/if}\n    <!-- 错误提示 -->\n    <div class="m-nerror f-dn" id="nerror"></div>\n    <!-- 登录条款 -->\n    {#if isVersionFour && mbloginclause}\n    <div class="fur-item fur-agree m-mb-clause fur-agree-4">\n        <label>\n            <span {#if ckboxOk}class="u-dl-agree u-dl-agree-select"{#else}class="u-dl-agree"{/if}><input on-click={this.doCheckBox()} type="checkbox" class="dl-clause-login" />\n            </span> 我同意\n            {#list mbloginclause.list as item}\n                <a href="{item.url}" target="_blank" tabindex="-1" data-outlink="1">{item.txt}</a>\n                {#if item_index<mbloginclause.list.length-2} 、{#elseif item_index<mbloginclause.list.length-1} 和 {/if}\n            {/list}\n        </label>\n    </div>\n    {/if}\n    <!-- 登录按钮 -->\n    <div class="f-cb loginbox">\n        <a ref=loginBtn id="submitBtn" on-click={this.doLogin()} {#if mbLoginLock}class="u-loginbtn btncolor tabfocus u-loginbtn-gary {loginbtnclazz}"{#else}class="u-loginbtn btncolor tabfocus {loginbtnclazz}"{/if} tabindex="8">{mbBtnTxt}</a>\n    </div>\n    <!-- 登录条款 -->\n    {#if !isVersionFour && mbloginclause}\n    <div class="fur-item fur-agree m-mb-clause">\n        <label>\n            <span {#if ckboxOk}class="u-dl-agree u-dl-agree-select"{#else}class="u-dl-agree"{/if}><input on-click={this.doCheckBox()} type="checkbox" class="dl-clause-login" />\n            </span> 我同意\n            {#list mbloginclause.list as item}\n                <a href="{item.url}" target="_blank" tabindex="-1" data-outlink="1">{item.txt}</a>\n                {#if item_index<mbloginclause.list.length-2} 、{#elseif item_index<mbloginclause.list.length-1} 和 {/if}\n            {/list}\n        </label>\n    </div>\n    {/if}\n    <!-- 免登复选框 -->\n    <div class="m-unlogin">\n        {#if mobileUnLoginTime}\n            <div on-click={this.onChangeUnLogin()} class="b-unlogn">\n                <span {#if mobileDefaultUnLogin}class="u-checkbox tabfocus u-checkbox-select"{#else}class="u-checkbox tabfocus"{/if}>\n                </span>\n                <label for="un-login">{mobileUnLoginTimeTxt}</label>\n            </div>\n        {/if}\n        <a class="forgetpwdReg" data-outlink="1" href={pwdfind} target="_blank">忘记密码？</a>\n        {#if !single}\n        {#if mbLogin && mbLogin.gotoRegTextMbUrl}\n            <a class="u-regbtn bgcolor tabfocus j-redirect" href="{mbLogin.gotoRegTextMbUrl}" data-outlink="2" target="_blank" tabindex="11">{gotoRegTextMb}</a>\n        {#else}\n            <a class="u-regbtn bgcolor tabfocus j-redirect" href="javascript:void(0);" data-outlink="2" target="_self" tabindex="11" data-action="changepage" data-mdtype="1" data-log="mbLoginGoReg">{gotoRegTextMb}</a>\n        {/if}\n        {/if}\n    </div>\n    <!-- 第三方登录 -->\n    {#if config && config.length}\n    <div ref=thirdLogin class="m-ologin">\n        <div class="otip f-fl">其他方式登录</div>\n        <div class="olist">\n            {#list config as o}\n                <a data-width="{o.width}" data-height="{o.height}" data-outlink="1" data-link="{o.url}" class="f-cb f-fl third {o.name} j-redirect" href="javascript:void(0);"></a>\n            {/list}\n        </div>\n    </div>\n    {/if}\n</div>\n');
I$("dd644bb12a87654fed12c35f5a57eeb1", function (e, t, i, n, s, a, r, o, c, d, _, l, u, f, h) {
	var p = "使用短信验证登录";
	var m = s.extend({
		template: _,
		data: {
			ckboxOk: !1,
			module: "login",
			warn: "",
			unLoginText: "几天免登录",
			gotoRegText: "注册手机帐号",
			channel: 1,
			mbSmsLoginTxt: p,
			mobileDefaultUnLogin: 0,
			mobileUnLoginTime: 0,
			mobileUnLoginTimeTxt: "十天内免登录",
			preDisabled: !1
		},
		config: function (e) {
			this.ORDERMAP = ["mninput", "mpinput", "slidecap", "captcha"];
			if (e.uniteLogin) this.data.mbSmsLoginTxt = e.mbSmsLoginTxt === p ? "短信快捷登录" : e.mbSmsLoginTxt;
			t._$merge(this.data, e || {});
			if (this.data.mbLogin && this.data.mbLogin.gotoRegTextMbUrl && i._$notURL(this.data.mbLogin.gotoRegTextMbUrl)) this.data.mbLogin.gotoRegTextMbUrl = "";
			this.supr(e);
			this.__loginLockTxtMb = this.data.lockConfig && this.data.lockConfig.loginLockTxtMb || "正在登录..."
		},
		doAction: function (t) {
			var i = e._$getElement(t),
				s = n._$dataset(i, "action");
			if ("goSmsLogin" === s || "goUniteLogin" === s) this.goSmsLogin()
		},
		init: function (t) {
			this.supr(t);
			this.$watch("isVerifyLock", this.watchVerifyLock._$bind(this));
			if (this.$refs.thirdLogin) {
				e._$clearEvent(this.$refs.thirdLogin);
				e._$addEvent(this.$refs.thirdLogin, "click", this.doClick._$bind(this))
			}
		},
		watchVerifyLock: function (e) {
			if (1 === e) this.data.loginbtnclazz = "u-btn-loading";
			else this.data.loginbtnclazz = "";
			this.$update()
		},
		destroy: function () {
			if (this.$refs && this.$refs.captcha) this.$refs.captcha._$setValue("");
			if (this.$refs && this.$refs.slidecap) this.$refs.slidecap._$destroyNewCap();
			try {
				window._$URS.saveTempMobile = this.getUn(1)
			} catch (e) { }
			this.supr()
		},
		goSmsLogin: function () {
			var e = 0;
			var t = this.$refs.mninput._$getValue().trim();
			var i = {
				username: t
			};
			this._$postMessage({
				type: "mbChangeModule"
			});
			_gaq.push(["_trackEvent", "手机帐号登录页面", "点击切换登录方式", "切换到用验证码登录###" + JSON.stringify(i)]);
			if (this.data.uniteLogin) e = 2;
			this.$emit("changeModule", {
				type: e,
				mobile: t
			})
		},
		getGtSuccess: function (e) {
			this.ticket = e.tk;
			var t = {};
			if (this.data.mobileDefaultUnLogin) {
				t.l = 1;
				t.d = this.data.mobileUnLoginTime
			}
			t.un = this.$refs.mninput._$getValue().trim();
			t.pw = MP.encrypt2(this.$refs.mpinput._$getValue() || "0");
			t.pd = this.data.product;
			t.pkid = this.data.promark;
			t.tk = this.ticket;
			t.domains = this.data.domains || "";
			if (i._$isDes()) {
				delete t.un;
				t.encUn = window._$URSOPT.desMobileReal
			}
			d._$request("mb-login", t, this.loginSuccess._$bind(this, 1), this.loginError._$bind(this, "mb-login-"), 1)
		},
		onSlideOk: function () {
			this.data.isVerifyLock = 0;
			this.$update();
			this.doLogin()
		}
	});
	m.component("mninput", a);
	m.component("mpinput", r);
	m.component("captcha", o);
	m.component("slidecap", c);
	return m
}, "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "a4de926c2d79e8d8f856eaff4dac0f8b", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "b62616ba5d59a47ea54fc057cbcd66b8", "5019a97f49cafc5e6cc6da470054165c", "7ac9d06f817adcdab54eea77e53ebe6a", "5312c1874a87427492f714754fc9318b", "1135272f84d09a1f87f596dd6a5819ae", "53c267efd983fb8c66cb645beead7a8d", "6cc03cb2cef6634c39673bc3567cabea");
I$("fc4a08da8d214cd878e594c5298cab3a", '<div r-hide={ish5upsms!=1} class="m-smsup {extclazz}">\n    {#if nochange!=1}\n        <div class="u-changemb" on-click={this.changemb($event)}>{changembtxt}</div>\n    {/if}\n    <div class="u-smsUp-new u-black">{safeTxt}<span class="u-black">{mobile}</span>{sendSmsTxt}<span class="u-red">{systemTxt}</span>{costTxt}：</div>\n    <div r-hide={ishand}>\n        <div ref="btnLogin" class="u-loginbtn btncolor tabfocus u-smsup-btns">\n            <a ref="btnLogina" target="{smstarget}" class={smsupaclazz} href={smsUploadNumberReal} on-click={this.goonsms($event)}>{toSendTxt}</a>\n        </div>\n        <p class="u-smsUp-new">{sendFailTxt}<span on-click={this.gohand(true)} class="u-blue">{handSendTxt}<div r-hide="!showTip" on-click={this.hideTip($event,1)} class="u-handtip">{tryHandSendTxt}<span class="u-close"></span><div class="triangle"></div></div></span></p>\n    </div>\n    {#if ishand}\n        <div class="smsup-info-box">\n            <div class="smsup-item">\n                <span class="smsup-tlt">\n                    {editSmsTxt}：\n                </span>\n                <span class="smsup-info smsup-select-allow">\n                    { smscnt }\n                </span>\n            </div>\n            <div class="smsup-item smsup-item-noline">\n                <span class="smsup-tlt smsup-tlt1">\n                    {sendToTxt}：\n                </span>\n                <span class="smsup-info smsup-select-allow">\n                    { smsnumber }\n                </span>\n            </div>\n        </div>\n        {#if hasAuto}\n            <div class="u-hand-txt">{tryTxt}<span class="u-blue" on-click={this.gohand(false)}>{toSendTxt}</span></div>\n        {/if}\n    {/if}\n</div>\n');
I$("b8dcd05845cd9f8fc24b889725fc0a53", function (e, t, i, n, s, a, r) {
	var o = /(UCBrowser\/|QQ\/|NeteaseMusic\/|MailMaster\/|TIM\/|Eleme\/|YiXin)/.test(window.navigator.userAgent);
	var c = Regular.extend({
		name: "h5upsms",
		template: s,
		data: {
			ishand: !1,
			hasAuto: !0,
			hideTipClicked: !1,
			clickNumber: 0,
			newSmsUpStep: 0,
			changembtxt: "<切换手机号",
			smsUploadNumberReal: "javascript:void(0)",
			smstarget: "_self",
			safeTxt: "为了您的安全，请用",
			sendSmsTxt: "发送短信进行验证",
			sysTxt: "系统不会回复短信",
			costTxt: "，短信费用由运营商收取",
			toSendTxt: "前往发送短信",
			sendFailTxt: "如果“前往发送短信”操作失败，请",
			handSendTxt: "手动发送短信",
			tryHandSendTxt: "试试手动发送吧",
			editSmsTxt: "编辑短信",
			sendToTxt: "发送至",
			tryTxt: "嫌手动发送麻烦？试试"
		},
		computed: {
			ishand: function (e) {
				if (3 === e.newSmsUpStep) return !0;
				else return !1
			}
		},
		config: function (i) {
			this.enlang = window._$URSOPT.enlang;
			if (1 == this.enlang) {
				var n = ["changembtxt", "safeTxt", "sendSmsTxt", "sysTxt", "toSendTxt", "sendFailTxt", "handSendTxt", "tryHandSendTxt", "editSmsTxt", "sendToTxt", "tryTxt"];
				t._$forEach(n, function (e) {
					this.data[e] = r.showText(this.data[e], this.enlang)
				}._$bind(this));
				this.data.costTxt = ""
			}
			var s = i.receiveCode;
			if (t._$isString(s)) s = s.split(",");
			this.data.mobile = i.mobile;
			this.data.smscnt = s[0];
			this.data.smsnumber = s[1];
			this.$watch("ish5upsms", this.watchIsh5upsms._$bind(this));
			this.$watch("newSmsUpStep", this.watchNewSmsUpStep._$bind(this));
			if (e._$is("ios")) {
				if (navigator.userAgent) {
					this.data.smsUploadNumberReal = this.__createSmsLink("&");
					if ("safari" === e._$KERNEL.browser) this.data.smstarget = "_parent"
				}
			} else this.data.smsUploadNumberReal = this.__createSmsLink("?");
			this.supr()
		},
		watchIsh5upsms: function (e) {
			if (1 === e && o) {
				this.data.newSmsUpStep = 3;
				this.data.hasAuto = !1
			}
			this.$update()
		},
		watchNewSmsUpStep: function (e) {
			if (e > 1) {
				this.$emit("shownext");
				this.data.smsupaclazz = "u-smsup-anobg";
				var t = i._$getStyle(this.$refs.btnLogin, "backgroundColor");
				if (t) {
					i._$setStyle(this.$refs.btnLogin, "overflow", "hidden");
					i._$setStyle(this.$refs.btnLogin, "boxSizing", "border-box");
					i._$setStyle(this.$refs.btnLogin, "border", "1px solid " + t);
					i._$setStyle(this.$refs.btnLogina, "color", t)
				}
			}
			setTimeout(a._$resize, 10)
		},
		__createSmsLink: function (e) {
			return "sms:" + this.data.smsnumber.replace(/\s/g, "") + e + "body=" + this.data.smscnt
		},
		changemb: function () {
			this.$emit("changemobile")
		},
		goonsms: function () {
			this.data.clickNumber++;
			if (1 === this.data.clickNumber) this.data.newSmsUpStep = 2;
			if (this.data.clickNumber > 1) this.showTip();
			this.$update()
		},
		showTip: function () {
			if (!this.data.hideTipClicked) this.data.showTip = !0
		},
		hideTip: function (e, t) {
			n._$stop(e);
			if (1 === t) this.data.hideTipClicked = !0;
			this.data.showTip = !1
		},
		gohand: function (e) {
			this.hideTip();
			this.data.ishand = e;
			if (this.data.ishand) this.data.newSmsUpStep = 3;
			else this.data.newSmsUpStep = 2;
			this.$update()
		}
	});
	return c
}, "a878c0216188111f46d39b9df767b354", "8fd03edddb19cf8c294f56ca6638c475", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a100971a16ec757a0282a3b2cc059019", "fc4a08da8d214cd878e594c5298cab3a", "a4de926c2d79e8d8f856eaff4dac0f8b", "46a4de3a50f50a600950ca9cee88031e");
I$("1598780dd8cf6308c2b48cd5a9c0d07f", function (e, t, i, n, s, a, r, o, c, d, _, l, u, f, h, p, m) {
	var g = "为了您的安全，请发送短信进行验证：",
		b = '<br />编辑短信“<strong class="msg">{{smstxt}}</strong>”，发送到<strong class="phone">{{smscode}}</strong><br />系统不会回复短信，短信费用由运营商收取。<br />';
	var v = o.extend({
		data: {},
		destroy: function (e) {
			if (this.$refs && this.$refs.slidecap) this.$refs.slidecap._$destroyNewCap();
			this.supr(e)
		},
		init: function (e) {
			this.supr(e);
			var t = window._$URSOPT.enlang;
			if (1 == t) {
				g = u.showText("为了您的安全，请发送短信进行验证", 1) + "：";
				b = "<br />" + u.showText("编辑短信", 1) + '“<strong class="msg">{{smstxt}}</strong>”，' + u.showText("发送到", 1) + '<strong class="phone">{{smscode}}</strong><br />' + u.showText("系统不会回复短信，短信费用由运营商收取", 1) + "。<br />"
			}
			this.$watch("isVerifyLock", this.watchVerifyLock._$bind(this));
			this.$watch("sendSmsLock", this.watchSendSmsLock._$bind(this))
		},
		watchSendSmsLock: function (e) {
			if (r._$isVersionFour()) {
				if (1 === e) this.data.smsbtnclazz = "u-btn-loading u-btn-loading-blue";
				else this.data.smsbtnclazz = "";
				this.$update()
			}
		},
		watchVerifyLock: function (e) {
			if (1 === e) this.data.smsbtnclazz = "u-btn-loading u-btn-loading-blue";
			else this.data.smsbtnclazz = "";
			this.$update()
		},
		checkCapByCode: function (e, t, i) {
			if (r._$isCapCode(e)) {
				var n = !0;
				if (i) e = r._$regCodeToLgCode(e);
				if (this.__capFlag != r._$getCapFlayByCode(e)) n = !0;
				var s = !n;
				if (this.__capFlag && s && this.__fail5()) return !0;
				if (6 === this.__capFlag && s) {
					this.$refs.slidecap._$showAiErrTxt();
					this.refreshCaps(t, e, s);
					return !0
				}
				this.refreshCaps(t, e, s);
				if (n && "447" === e) return !0
			} else if ("411" != e)
				if (this.__isNewCapPopup && this.data.hasSlide) this.destroyNewCap();
				else if (6 == this.__capFlag) this.refreshCaps(t, e, 1);
				else this.refreshCaps(t, e)
		},
		getSmsSuccess: function (e) {
			this.unLockSendSms();
			this.$refs.smsinput.getSms(e);
			this._$sendMsg({
				type: "sendSmsOk",
				value: this.$refs.mninput._$getValue().trim()
			})
		},
		onSlideOk: function () {
			this.data.isVerifyLock = 0;
			this.sendSms();
			this.$update()
		},
		__getCapforData: function (e) {
			if (!r._$getSmState()) e.mb = this.$refs.mninput._$getValue().trim();
			e.pkid = this.data.promark;
			e.pd = this.data.product;
			if (this.data.hasImgCap) e.cap = this.$refs.captcha._$getValue().trim();
			if (this.data.hasSlide || this.data.hasAiCap) {
				e.cap = this.$refs.slidecap._$getPwdValue();
				e.capkey = this.$refs.slidecap._$getCapKey()
			}
			return e
		},
		__checkMbNotOk: function () {
			var e = !1;
			var t = this.$refs.mninput._$emptyCheck();
			if (t) {
				e = !0;
				return e
			}
			var i = this.$refs.mninput.onCheckRegexp();
			this.$refs.smsinput.onClearInputPuer();
			if (i) e = !0;
			return e
		},
		__checkCapStateNotOk: function () {
			var e = !1,
				t, i;
			if (this.data.isVerifyLock) {
				e = !0;
				return e
			}
			if (this.__needPopup && !this.data.hasSlide) {
				this.__needPopup = 0;
				this.data.hasSlide = 1;
				e = !0;
				return e
			}
			if (this.data.hasImgCap) {
				t = this.$refs.captcha._$emptyCheck();
				i = this.$refs.captcha.data.hasError
			}
			if (this.data.hasSlide) t = this.$refs.slidecap.onCheckRegexp();
			if (t || i || this.data.hasAiCap && !this.$refs.slidecap.getCapState()) {
				if (this.data.hasAiCap) this.$refs.slidecap._$doVerify();
				e = !0
			}
			return e
		},
		doShowErrTxt: function (e) {
			var t = {
				tabIndex: -1,
				str: e,
				node: "nerror"
			};
			this._$doShowError(t)
		},
		doRefresh: function (e) {
			var t = {
				ret: "201",
				capFlag: e
			};
			this.iniSuccess(t)
		},
		checkLockSendSms: function () {
			if (this.data.sendSmsLock) return !0;
			this.data.sendSmsLock = 1;
			this.$update()
		},
		unLockSendSms: function () {
			this.data.sendSmsLock = 0;
			this.$update()
		},
		showInitGuide: function () {
			var e = b,
				t = 2,
				i = this.data.receiveCode[0],
				n = r._$formatSmscode(this.data.receiveCode[1]);
			if (!r._$isH5FourVersion()) {
				this.sourceTxt = e.replace("{{smstxt}}", i).replace("{{smscode}}", n);
				var s = {
					tabIndex: -1,
					str: g + this.sourceTxt,
					node: "nerror",
					type: t || ""
				};
				this._$doShowError(s);
				this.tryShowUpQr(this.data.receiveCode);
				r._$resize()
			} else this._$removeError({
				node: "nerror",
				tabIndex: 1e3
			})
		},
		onShowNext: function () {
			this.data.canshownext = 1;
			this.$update();
			setTimeout(r._$resize, 10)
		},
		setUpMobile: function (e, t) {
			if (this.$refs.mninput) {
				this.$refs.mninput.trySetMobile(e);
				if (t) this.$refs.mninput._$setHasError()
			}
		}
	});
	return v
}, "a878c0216188111f46d39b9df767b354", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a13cd829d734e255809c920485d5a6b2", "bff3d86ec4ea91399919ee4963badfeb", "a4de926c2d79e8d8f856eaff4dac0f8b", "b62616ba5d59a47ea54fc057cbcd66b8", "53c267efd983fb8c66cb645beead7a8d", "d6e36b6b1f96e15e42725a59e7acd142", "54120fa727d71cd38f3b1273d034afef", "b8dcd05845cd9f8fc24b889725fc0a53", "46a4de3a50f50a600950ca9cee88031e");
I$("06487f737fd7737bdade1cc8922435f6", '<div class="m-pccnt f-cb">\n    <div class="m-pcbox">\n        <div {#if active && !hasError}class="inputbox m-mb m-pc f-fl active"{#elseif hasError===1}class="inputbox m-mb m-pc f-fl error-color"{#else}class="inputbox m-mb m-pc f-fl"{/if}>\n            <div class="u-input">\n                <label on-click={this.onLabelFocus($event)} {#if !labelHidden && !hasValue}class="u-label"{#else}class="u-label f-dn"{/if}>{placeholder}</label>\n                <input {#if isIOS}on-touchend={this.onHackFocus($event)}{/if} on-propertychange={this.onPropertychange($event)} ref="input" on-focus={this.onFocus($event)} on-input={this.onInput($event)} on-blur={this.onBlur($event)} placeholder="{placeholder}" name="phonecode" class="j-inputtext pcin" type="tel" data-max-length="6" maxlength="6" tabindex="5" spellcheck="false" autocomplete="off"></div>\n            <div on-mouseover={this.onMouseOver()} on-mouseout={this.onMouseOut()} on-click={this.onClearInput($event)} class="u-tip" {#if hasValue && showBtn}style="display:block;"{/if}><div class="u-success u-clear"></div></div>\n        </div>\n\n        <div class="pcbtn f-fl">\n            <a ref=smsBtn href="javascript:void(0);" class="tabfocus getsmscode {smsbtnclazz}" r-html={getsmstxt}></a>\n        </div>\n    </div>\n</div>');
I$("2c9966685c48aa132d904e29fe50ab0b", function (e, t, i, n, s, a, r, o, c, d, _) {
	var l = n.extend({
		template: r,
		data: {
			needCheck: 1,
			tabIndex: 4,
			placeholder: "请输入短信验证码",
			regexp: /^\d{6}$/,
			errTxt: "短信验证码格式错误",
			emptyTxt: "请输入短信验证码",
			slideKey: "123"
		},
		config: function (e) {
			this.enlang = window._$URSOPT.enlang;
			if (1 == this.enlang) {
				var i = ["placeholder", "errTxt", "emptyTxt"];
				t._$forEach(i, function (e) {
					this.data[e] = a.showText(this.data[e], this.enlang)
				}._$bind(this))
			}
			t._$merge(this.data, e || {});
			this.supr(e)
		},
		destroy: function (e) {
			if (this.__countDownBtn) this.__countDownBtn = this.__countDownBtn._$recycle();
			this.supr(e)
		},
		init: function (e) {
			this.supr(e);
			if (!this.__countDownBtn) this.__countDownBtn = s._$$CountDown._$allocate({
				btn: this.$refs.smsBtn,
				onclick: this.onSendSms._$bind(this)
			})
		},
		onSendSms: function () {
			this.$emit("sendSms")
		},
		getSms: function () {
			this.__countDownBtn._$getSms()
		},
		tryClearError: function () {
			var e = this.$refs.input.value;
			if (this.data.regexp.test(e)) this.$emit("rmError", {
				tabIndex: this.data.tabIndex,
				target: this.$refs.input
			})
		},
		onInput: function () {
			if (window._$ISIOS) this.tryClearError();
			this.supr()
		},
		getAiBtn: function () {
			return this.$refs.smsBtn
		},
		_$doClick: function () {
			this.$refs.smsBtn.click()
		}
	});
	return l
}, "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "18b25c9751295445fbbb6b3eea3687b1", "b819242a9b3581fcd37cdd1531beab1d", "46a4de3a50f50a600950ca9cee88031e", "06487f737fd7737bdade1cc8922435f6");
I$("0e65d314ee345a1225070ace517eb5e8", '<div class="m-container">\n    <div class="u-tab f-cb">\n        <a class="tab0" on-click={this.goPwdLogin()}>{mbPwdLoginTxt}</a>\n    </div>\n    <!--帐号-->\n    <mninput mbOnlyItl="{mbOnlyItl}" mbNeedItl="{mbNeedItl}" needEye="{needEye}" ref=mninput on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} on-blur={this.onInputBlur($event)} placeholder="{mobilePlaceholder.mobile2}" disabled="{preDisabled}"/>\n    <!-- 验证码 -->\n    {#if hasImgCap}\n    <captcha tabIndex=-1 imgRefreshTip="{imgRefreshTip}" needEye="{needEye}" ref=captcha on-refreshCap={this.doRefreshCap($event)} on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} product="{product}" pkid="{pkid}" promark="{promark}" placeholder="{mobilePlaceholder.cap2}" channel="{channel}"  />\n    {/if}\n    <!-- 滑块验证码 -->\n    {#if hasSlide}\n    <slidecap ignore="0" slideTarget={slideTarget} capBarHeight={capBarHeight} capPadding={capPadding} customStyles="{customStyles}" lang="{lang}" mode="{mode}" version="{version}" tabIndex=-1 ref=slidecap on-refreshCap={this.doRefreshCap($event)} on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} server="{server}" productkey="{productkey}" swidth="{swidth}" product="{product}" promark="{promark}" hintTxt="{hintTxt}" channel="{channel}" isLoginModule=1 on-slideOk="{this.onSlideOk($event)}" />\n    {/if}\n    {#if hasAiCap}\n    <slidecap ignore="1" forceNoAuto={forceNoAuto} isAiCap={hasAiCap} slideTarget={slideTarget} capBarHeight={capBarHeight} capPadding={capPadding} customStyles="{customStyles}" lang="{lang}" mode="{mode}" version="{version}" tabIndex=-1 ref=slidecap on-refreshCap={this.doRefreshCap($event)} on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} server="{server}" productkey="{productkey}" swidth="{swidth}" product="{product}" promark="{promark}" hintTxt="{hintTxt}" channel="{channel}" isLoginModule=1 on-slideOk="{this.onSlideOk($event)}" on-lockVerify="{this.onLockVerify($event)}" on-unLockVerify="{this.onUnLockVerify($event)}" />\n    {/if}\n    <!-- 短信 -->\n    <smsinput getsmstxt={getsmstxt} smsbtnclazz="{smsbtnclazz}" needEye="{needEye}" ref=smsinput on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} on-sendSms={this.sendSms($event)} product="{product}" pkid="{pkid}" promark="{promark}" placeholder="{mobilePlaceholder.sms2}" />\n    <!-- 错误提示 -->\n    <div class="m-nerror f-dn" id="nerror"></div>\n    <!-- 登录条款 -->\n    {#if isVersionFour && mbloginclause}\n    <div class="fur-item fur-agree m-mb-clause fur-agree-4">\n        <label>\n            <span {#if ckboxOk}class="u-dl-agree u-dl-agree-select"{#else}class="u-dl-agree"{/if}><input on-click={this.doCheckBox()} type="checkbox" class="dl-clause-login" />\n            </span> 我同意\n            {#list mbloginclause.list as item}\n                <a href="{item.url}" target="_blank" tabindex="-1" data-outlink="1">{item.txt}</a>\n                {#if item_index<mbloginclause.list.length-2} 、{#elseif item_index<mbloginclause.list.length-1} 和 {/if}\n            {/list}\n        </label>\n    </div>\n    {/if}\n    <!-- 登录按钮 -->\n    <div class="f-cb loginbox">\n        <a ref=loginBtn id="submitBtn" on-click={this.doLogin()} {#if mbLoginLock}class="u-loginbtn btncolor tabfocus u-loginbtn-gary"{#else}class="u-loginbtn btncolor tabfocus"{/if} tabindex="8">{smsBtnTxt}</a>\n    </div>\n    <!-- 登录条款 -->\n    {#if !isVersionFour && mbloginclause}\n    <div class="fur-item fur-agree m-mb-clause">\n        <label>\n            <span {#if ckboxOk}class="u-dl-agree u-dl-agree-select"{#else}class="u-dl-agree"{/if}><input on-click={this.doCheckBox()} type="checkbox" class="dl-clause-login" />\n            </span> 我同意\n            {#list mbloginclause.list as item}\n                <a href="{item.url}" target="_blank" tabindex="-1" data-outlink="1">{item.txt}</a>\n                {#if item_index<mbloginclause.list.length-2} 、{#elseif item_index<mbloginclause.list.length-1} 和 {/if}\n            {/list}\n        </label>\n    </div>\n    {/if}\n    <!-- 免登复选框 -->\n    <div class="m-unlogin">\n        {#if mobileUnLoginTime}\n            <div  on-click={this.onChangeUnLogin()} class="b-unlogn">\n                <span {#if mobileDefaultUnLogin}class="u-checkbox tabfocus u-checkbox-select"{#else}class="u-checkbox tabfocus"{/if}>\n                </span>\n                <label for="un-login">{mobileUnLoginTimeTxt}</label>\n            </div>\n        {/if}\n        <a class="forgetpwdReg" data-outlink="1" href={hasQuestion} target="_blank">遇到问题？</a>\n        <div class="b-unlogn j-unlogn f-dn">\n            <span class="u-checkbox tabfocus">\n                <input type="checkbox" name="un-login" class="un-login">\n            </span>\n            <label for="un-login">{unLoginText}</label>\n        </div>\n        {#if !single}\n        {#if mbLogin && mbLogin.gotoRegTextMbUrl}\n            <a class="u-regbtn bgcolor tabfocus j-redirect" href="{mbLogin.gotoRegTextMbUrl}" data-outlink="2" target="_blank" tabindex="11">{gotoRegTextMb}</a>\n        {#else}\n            <a class="u-regbtn bgcolor tabfocus" href="javascript:void(0);" data-outlink="2" target="_self" tabindex="11" data-action="changepage" data-mdtype="1" data-log="mbLoginGoReg">{gotoRegTextMb}</a>\n        {/if}\n        {/if}\n    </div>\n    <!-- 第三方登录 -->\n    {#if config && config.length}\n    <div ref=thirdLogin class="m-ologin">\n        <div class="otip f-fl">其他方式登录</div>\n        <div class="olist">\n            {#list config as o}\n                <a data-width="{o.width}" data-height="{o.height}" data-outlink="1" data-link="{o.url}" class="f-cb f-fl third {o.name} j-redirect" href="javascript:void(0);"></a>\n            {/list}\n        </div>\n    </div>\n    {/if}\n</div>\n');
I$("8ef2745709cc1c6c902b758d33d5627e", function (e, t, i, n, s, a, r, o, c, d, _, l, u, f, h, p, m) {
	var g = n.extend({
		template: d,
		data: {
			ckboxOk: !1,
			module: "login",
			warn: "",
			unLoginText: "几天免登录",
			gotoRegText: "注册手机帐号",
			channel: 2,
			mbPwdLoginTxt: "使用密码验证登录",
			mobileDefaultUnLogin: 0,
			mobileUnLoginTime: 0,
			mobileUnLoginTimeTxt: "十天内免登录",
			preDisabled: !1
		},
		config: function (e) {
			this.ORDERMAP = ["mninput", "smsinput"];
			t._$merge(this.data, e || {});
			if (this.data.mbLogin && this.data.mbLogin.gotoRegTextMbUrl && u._$notURL(this.data.mbLogin.gotoRegTextMbUrl)) this.data.mbLogin.gotoRegTextMbUrl = "";
			this.supr(e);
			if (void 0 !== e.rmbclause) this.data.ckboxOk = e.rmbclause;
			this.__loginLockTxtMb = this.data.lockConfig && this.data.lockConfig.loginLockTxtMb || "正在登录..."
		},
		init: function (t) {
			this.supr(t);
			if (this.$refs.thirdLogin) {
				e._$clearEvent(this.$refs.thirdLogin);
				e._$addEvent(this.$refs.thirdLogin, "click", this.doClick._$bind(this))
			}
		},
		destroy: function (e) {
			try {
				window._$URS.saveTempMobile = this.getUn(1)
			} catch (t) { }
			this.supr(e)
		},
		iniSuccess: function (e) {
			if (this.$refs) this.supr(e)
		},
		goPwdLogin: function () {
			var e = this.$refs.mninput._$getValue().trim();
			this._$postMessage({
				type: "mbChangeModule"
			});
			this.$emit("changeModule", {
				type: 1,
				mobile: e
			})
		},
		getGtSuccess: function (e, t) {
			this.ticket = e.tk;
			var i = {};
			if (this.data.mobileDefaultUnLogin) {
				i.l = 1;
				i.d = this.data.mobileUnLoginTime || 10
			}
			i.un = this.$refs.mninput._$getValue().trim();
			if (!t) {
				var n = this.$refs.smsinput._$getValue().trim();
				if (u._$getSmState()) i.sms = n;
				else i.pw = n
			}
			i.pd = this.data.product;
			i.pkid = this.data.promark;
			i.tk = this.ticket;
			i.domains = this.data.domains || "";
			if (u._$isDes()) {
				delete i.un;
				i.encUn = window._$URSOPT.desMobileReal
			}
			c._$request("mb-lvfsms", i, this.loginSuccess._$bind(this, 0), this.loginError._$bind(this, "mb-lvfsms-"), 1)
		},
		getSmsFail: function (e) {
			var i = e.ret,
				n = -1,
				s, a = "mb-sms-lsm-",
				r = e.dt || "";
			this.unLockSendSms();
			if (!this.checkCapByCode(i, a)) {
				if (411 == i) {
					var o = e.receiveCode.split(",");
					if ("02" === r) {
						this.$emit("changeModule", {
							isup: !0,
							mobile: this.$refs.mninput._$getValue().trim(),
							receiveCode: o,
							capFlag: this.__capFlag || "",
							rmbclause: this.data.ckboxOk
						});
						return
					} else {
						s = 2;
						_["mb-sms-lsm-411"] = '请您编辑短信<strong class="msg">' + o[0] + '</strong>发送到<strong class="phone">' + o[1] + "</strong> 获取验证码，短信费用由运营商收取";
						this.$refs.smsinput.onClearInputPuer()
					}
				}
				if (420 == i || 422 == i || 602 == i) {
					if (422 == i || 602 == i) s = 2;
					n = 1
				}
				if ("401" == i && t._$indexOf(["09", "10"], r) === -1) e.ret = a + i;
				else e.ret = a + i + (e.dt || "");
				this.onShowErr(e, n, s)
			}
		},
		sendSms: function () {
			if (this.isInitLoginSucc())
				if (!this.__checkMbNotOk())
					if (!this.__fail5check())
						if (!this.__checkCapStateNotOk()) {
							var e = {};
							e = this.__getCapforData(e);
							if (u._$getSmState()) e.un = this.$refs.mninput._$getValue().trim();
							if (!this.checkLockSendSms()) {
								if (u._$isDes()) {
									delete e.mb;
									delete e.un;
									e.encUn = window._$URSOPT.desMobileReal
								}
								c._$request("mb-sms-lsm", e, this.getSmsSuccess._$bind(this), this.getSmsFail._$bind(this), 1)
							}
						}
		},
		doFocusMb: function () {
			this.$refs.mninput._$focusHelper();
			this._$resize()
		}
	});
	g.component("mninput", s);
	g.component("captcha", r);
	g.component("smsinput", a);
	g.component("slidecap", o);
	return g
}, "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "1598780dd8cf6308c2b48cd5a9c0d07f", "5019a97f49cafc5e6cc6da470054165c", "2c9966685c48aa132d904e29fe50ab0b", "5312c1874a87427492f714754fc9318b", "1135272f84d09a1f87f596dd6a5819ae", "53c267efd983fb8c66cb645beead7a8d", "0e65d314ee345a1225070ace517eb5e8", "d6e36b6b1f96e15e42725a59e7acd142", "54120fa727d71cd38f3b1273d034afef", "a4de926c2d79e8d8f856eaff4dac0f8b");
I$("c4ad5dac9207ce71767f800694decbdc", '<div class="m-container m-uniteLogin {enlangClazz}">\n    <div class="u-tab f-cb">\n        <a class="tab0" on-click={this.goPwdLogin()}>{mbPwdLoginTxt}</a>\n    </div>\n    <mninput fromUnite="{uniteLogin.isItl}" mbHasItl="{uniteLogin.isItl}" needEye="{needEye}" ref=mninput on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} placeholder="{uniteLogin.placeholders.mob}" disabled="{preDisabled}" />\n    <!--帐号-->\n    <!-- 验证码 -->\n    {#if hasImgCap}\n    <captcha tabIndex=-1 imgRefreshTip="{imgRefreshTip}" needVf=1 isUnite=1 needEye="{needEye}" ref=captcha on-refreshCap={this.doRefreshCap($event)} on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} product="{product}" pkid="{pkid}" promark="{promark}" host="{host}" channel="{channel}" placeholder="{uniteLogin.placeholders.cap}" />\n    {/if}\n    <!-- 滑块验证码 -->\n    {#if hasSlide}\n    <slidecap ignore="0" slideTarget={slideTarget} capBarHeight={capBarHeight} capPadding={capPadding} customStyles="{customStyles}" lang="{lang}" mode="{mode}" version="{version}" tabIndex=-1 isUniteLogin=1 ref=slidecap on-refreshCap={this.doRefreshCap($event)} on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} server="{server}" productkey="{productkey}" swidth="{swidth}" product="{product}" promark="{promark}" hintTxt="{hintTxt}" host="{host}" channel="{channel}" on-slideOk="{this.onSlideOk($event)}" />\n    {/if}\n    <!-- 保证类型切换slidecap会刷新 -->\n    {#if hasAiCap}\n    <slidecap ignore="1" forceNoAuto={forceNoAuto} isAiCap={hasAiCap} slideTarget={slideTarget} capBarHeight={capBarHeight} capPadding={capPadding} customStyles="{customStyles}" lang="{lang}" mode="{mode}" version="{version}" tabIndex=-1 isUniteLogin=1 ref=slidecap on-refreshCap={this.doRefreshCap($event)} on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} server="{server}" productkey="{productkey}" swidth="{swidth}" product="{product}" promark="{promark}" hintTxt="{hintTxt}" host="{host}" channel="{channel}" on-slideOk="{this.onSlideOk($event)}" on-lockVerify="{this.onLockVerify($event)}" on-unLockVerify="{this.onUnLockVerify($event)}" />\n    {/if}\n    <!-- 短信 -->\n    <smsinput getsmstxt={getsmstxt} smsbtnclazz="{smsbtnclazz}" needEye="{needEye}" ref=smsinput on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} on-sendSms={this.sendSms($event)} product="{product}" pkid="{pkid}" promark="{promark}" placeholder="{uniteLogin.placeholders.sms}" />\n    <!-- 错误提示 -->\n    <div class="m-nerror f-dn" id="nerror"></div>\n    <!-- 条款 -->\n    {#if isVersionFour && uniteLogin.needClause == \'1\'}\n    <div class="fur-agree-4">\n        <span on-click={this.doCheckBox()} {#if uniteLogin.clause}class="u-zc-agree u-zc-agree-select"{#else}class="u-zc-agree"{/if}><input type="checkbox" class="zc-un-login" /></span>\n        <div class="fur-item fur-agree" style="padding: 0 0 4px 0;margin-left:24px;">\n            <label><span on-click={this.doCheckBox()}>{agreeText}</span>\n            {#if newCDN === 1 && uniteLogin.uniteLoginTermsList && uniteLogin.uniteLoginTermsList.length>0}\n                {#list uniteLogin.uniteLoginTermsList as item}\n                    <a href="{item.url}" target="_blank" tabindex="-1" data-outlink="1">{item.name}</a>{#if item_index<uniteLogin.uniteLoginTermsList.length-1} {andTxt} {/if}\n                {/list}\n            {#else}\n                <a href="{uniteLogin.terms0Link}" target="_blank" tabindex="-1" data-outlink="1">{uniteLogin.terms0}</a><span on-click={this.doCheckBox()}> {andTxt} </span><a href="{uniteLogin.terms1Link}" target="_blank" tabindex="-1" data-outlink="1">{uniteLogin.terms1}</a>\n            {/if}\n            </label>\n        </div>\n    </div>\n    {/if}\n    <!-- 登录按钮 -->\n    <div class="f-cb loginbox">\n        <a ref=loginBtn on-click={this.doLogin()} {#if mbLoginLock}class="u-loginbtn btncolor tabfocus u-loginbtn-gary"{#else}class="u-loginbtn btncolor tabfocus"{/if} r-html={uniteLogin.loginTxtNew} tabindex="8"></a>\n    </div>\n    <!-- 条款 -->\n    {#if !isVersionFour && uniteLogin.needClause == \'1\'}\n    <span on-click={this.doCheckBox()} {#if uniteLogin.clause}class="u-zc-agree u-zc-agree-select"{#else}class="u-zc-agree"{/if}><input type="checkbox" class="zc-un-login" /></span>\n    <div class="fur-item fur-agree" style="padding: 0 0 4px 0;margin-left:24px;">\n        <label><span on-click={this.doCheckBox()}>{agreeText}</span>\n        {#if newCDN === 1 && uniteLogin.uniteLoginTermsList && uniteLogin.uniteLoginTermsList.length>0}\n            {#list uniteLogin.uniteLoginTermsList as item}\n                <a href="{item.url}" target="_blank" tabindex="-1" data-outlink="1">{item.name}</a>{#if item_index<uniteLogin.uniteLoginTermsList.length-1} {andTxt} {/if}\n            {/list}\n        {#else}\n            <a href="{uniteLogin.terms0Link}" target="_blank" tabindex="-1" data-outlink="1">{uniteLogin.terms0}</a><span on-click={this.doCheckBox()}> {andTxt} </span><a href="{uniteLogin.terms1Link}" target="_blank" tabindex="-1" data-outlink="1">{uniteLogin.terms1}</a>\n        {/if}\n        </label>\n    </div>\n    {/if}\n    <!-- 免登复选框 -->\n    <div class="m-unlogin">\n        {#if uniteLogin.needUnLogin == \'1\'}\n        {#if uniteLogin.unLoginTime}\n            <div on-click={this.onChangeUnLogin()} class="b-unlogn" style="border-right:0;">\n                <span {#if uniteLogin.unLoginDefautl==\'1\'}class="u-checkbox tabfocus u-checkbox-select"{#else}class="u-checkbox tabfocus"{/if}>\n                </span>\n                <label for="un-login">{uniteLogin.unLoginTxt}</label>\n            </div>\n        {/if}\n        {/if}\n        <a class="forgetpwdReg" style="float:right;color:#9eb8d4;" data-outlink="1" href={hasQuestion} target="_blank">{questionTxt}？</a>\n    </div>\n</div>\n');
I$("0ac97ee3b0042dd10b801ecd34c1ae66", function (e, t, i, n, s, a, r, o, c, d, _, l, u, f, h, p, m, g, b) {
	var v = {
		module: "uniteLogin",
		warn: "您需要同意相关条款才能使用",
		agreeText: "我同意",
		channel: 14,
		andTxt: "和",
		mbPwdLoginTxt: "使用密码验证登录",
		questionTxt: "遇到问题",
		uniteLogin: {
			needClause: 1,
			isItl: 0,
			clause: 1,
			needUnLogin: 0,
			unLoginTime: 10,
			unLoginDefautl: 1,
			unLoginTxt: "十天内免登录",
			loginTxt: "快捷登录",
			terms0: "《服务条款》",
			terms0Link: "//hc.reg.163.com/iTerm/doc.html?id=542",
			terms1: "《网易隐私政策》",
			terms1Link: "//hc.reg.163.com/iTerm/doc.html?id=437",
			placeholders: {
				mob: "请输入手机号",
				cap: "请输入图片验证码",
				sms: "请输入短信验证码"
			}
		},
		preDisabled: !1,
		preRegDisabled: 0,
		enlangClazz: ""
	};
	var $ = s.extend({
		template: _,
		config: function (e) {
			this.enlang = window._$URSOPT.enlang;
			if (1 == this.enlang) {
				var t = ["warn", "agreeText", "mbPwdLoginTxt", "questionTxt", "andTxt"];
				i._$forEach(t, function (e) {
					v[e] = h.showText(v[e], this.enlang)
				}._$bind(this));
				var n = ["unLoginTxt", "loginTxt", "terms0", "terms1"];
				i._$forEach(n, function (e) {
					v.uniteLogin[e] = h.showText(v.uniteLogin[e], this.enlang)
				}._$bind(this));
				var s = ["mob", "cap", "sms"];
				i._$forEach(s, function (e) {
					v.uniteLogin.placeholders[e] = h.showText(v.uniteLogin.placeholders[e], this.enlang)
				}._$bind(this));
				v.enlangClazz = "m-uniteLogin-english-wrap"
			}
			this.ORDERMAP = ["mninput", "smsinput"];
			if (e.mbPwdLoginTxt) v.mbPwdLoginTxt = e.mbPwdLoginTxt;
			v.preRegDisabled = e.preRegDisabled || 0;
			i._$merge(v.uniteLogin, e.uniteLogin);
			i._$merge(this.data, v);
			if ("1" == this.data.uniteLogin.needClause && void 0 !== e.rmbclause) this.data.uniteLogin.clause = e.rmbclause;
			if ("1" == this.data.uniteLogin.needUnLogin && void 0 !== e.rmbunLoginDefautl) this.data.uniteLogin.unLoginDefautl = e.rmbunLoginDefautl;
			this.data.uniteLogin.loginTxtNew = f._$HtmlEncode(this.data.uniteLogin.loginTxt);
			var a = this.data.uniteLogin.uniteLoginTermsList;
			if (a && a.length > 0) i._$forEach(a, function (e) {
				if (f._$notURL(e.url)) e.url = ""
			});
			if (f._$notURL(this.data.uniteLogin.terms0Link)) this.data.uniteLogin.terms0Link = "";
			if (f._$notURL(this.data.uniteLogin.terms1Link)) this.data.uniteLogin.terms1Link = "";
			this.supr(e);
			this.errorIndex = -1;
			this.errorIndexMap = {}
		},
		init: function (e) {
			this.supr(e);
			if (this.$refs.thirdLogin) {
				t._$clearEvent(this.$refs.thirdLogin);
				t._$addEvent(this.$refs.thirdLogin, "click", this.doClick._$bind(this))
			}
		},
		destroy: function (e) {
			try {
				window._$URS.saveTempMobile = this.getUn(1)
			} catch (t) { }
			this.supr(e)
		},
		doClick: function (e) {
			var i = t._$getElement(e),
				s = n._$dataset(i, "link");
			if (s) f._$doThirdLogin(e)
		},
		doPreFill: function () {
			var e = u._$cookie("THE_LAST_LOGIN_MOBILE");
			if (!window._$URS.setMobileFromCookie) {
				if (e && e.indexOf("-") < 0) this.$refs.mninput._$setValue(e);
				window._$URS.setMobileFromCookie = !0
			}
			if (window._$URSOPT.rmbArea && e.indexOf("-") !== -1 && !window._$URSOPT.firstArea && !this.data.uniteLogin.preFillUnite) this._trySetArea(e);
			if (!f._$isDes()) this._trySetMobile();
			if (("1" != this.data.uniteLogin.isItl || "1" == this.data.uniteLogin.isItlNeedPreFill) && this.data.uniteLogin.preFillUnite) {
				this.$refs.mninput._$setValue(this.data.uniteLogin.preFillUnite);
				if (1 == this.data.preRegDisabled) this.data.preDisabled = !0;
				else this.data.preDisabled = !1; if (1 != this.data.preRegDisabled) this.data.uniteLogin.preFillUnite = ""
			}
			this.$update()
		},
		doTipsFill: function () {
			if (this.data.uniteLogin && this.data.uniteLogin.tips) this._$doShowError({
				tabIndex: 100,
				str: this.data.uniteLogin.tips,
				node: "nerror",
				type: 4
			})
		},
		doInit: function (e) {
			this.doTipsFill();
			if (1 != e) this.doPreFill();
			var t = {};
			t.pd = this.data.product;
			t.pkid = this.data.promark;
			t.pkht = this.data.host;
			t.channel = this.data.channel;
			this.data.initSuccess = 0;
			d._$request("mb-nini", t, this.iniSuccess._$bind(this), this.iniError._$bind(this, "mb-nini-"), 1)
		},
		getUn: function (e) {
			return this.$refs.mninput._$getValue(e).trim()
		},
		iniSuccess: function (e) {
			this.__isNewCapPopup = "popup" == this.data.mode;
			this._$doToggleLoingLockMb();
			this.data.initSuccess = 1;
			this.initCapByInit(e);
			this._$postMessage({
				type: "mbInitSuccess"
			});
			this.$update();
			setTimeout(function () {
				if (this.data.focusHelper) this.$refs.mninput._$focusHelper();
				this._$resize()
			}._$bind(this), 200)
		},
		onChangeUnLogin: function () {
			this.data.uniteLogin.unLoginDefautl = !this.data.uniteLogin.unLoginDefautl
		},
		iniError: function (e, t) {
			var i = t.ret;
			this.data.initSuccess = -1;
			if (!window._$URSOPT.from3Cdn)
				if (window._$needUrsBgp)
					if (!this.tmpBgp && ("-2" == i || "-1" == i || "0" == i)) {
						this.tmpBgp = 1;
						window._$BGP = 1;
						setTimeout(this.doInit._$bind(this, 1), 200);
						return
					}
			this.doShow401Error(i, 1, e, t)
		},
		goPwdLogin: function () {
			var e = this.$refs.mninput._$getValue().trim();
			this._$postMessage({
				type: "mbChangeModule"
			});
			this.$emit("changeModule", {
				type: 1,
				mobile: e
			})
		},
		getGtSuccess: function (e, t) {
			this.ticket = e.tk;
			var i = {};
			if ("1" == this.data.uniteLogin.unLoginDefautl && "1" == this.data.uniteLogin.needUnLogin) {
				i.l = 1;
				i.d = this.data.uniteLogin.unLoginTime
			}
			i.un = this.$refs.mninput._$getValue().trim();
			if (!t) i.sms = this.$refs.smsinput._$getValue().trim();
			i.pd = this.data.product;
			i.pkid = this.data.promark;
			i.pkht = this.data.host;
			i.tk = this.ticket;
			i.domains = this.data.domains || "";
			i.channel = this.data.channel || "";
			d._$request("mb-nlregvfsms", i, this.loginSuccess._$bind(this, 0), this.loginError._$bind(this, "mb-nlregvfsms-"), 1)
		},
		loginSuccess: function (e, t) {
			MP.getCookieId("l_yd_sign", function (e) {
				if ("null" != e) u._$cookie("l_yd_sign", {
					value: e,
					expires: 3650,
					path: "/"
				});
				u._$cookie("THE_LAST_LOGIN_MOBILE", {
					value: this.__username,
					expires: 30,
					path: "/"
				});
				this._$setDomainsHasPathBAndOpd({
					type: "success",
					username: this.__username || "",
					nextUrls: t.nextUrls,
					k: t.k || ""
				})
			}._$bind(this))
		},
		loginError: function (e, t) {
			var n = -1,
				s;
			var a = t.ret;
			this.doUniteLoginUnLock();
			if ("401" == a && i._$indexOf(["10", "20"], t.dt) === -1) t.ret = e + a;
			else t.ret = e + a + (t.dt || ""); if ("602" == a || "422" == a) s = 2;
			this.$update();
			this.onShowErr(t, n, s)
		},
		getGtError: function (e) {
			this.doUniteLoginUnLock();
			var t = e.ret,
				i = "mb-nlgt-";
			if ("401" == t && (!e.dt || "10" != e.dt)) e.ret = i + t;
			else e.ret = i + t + (e.dt || "");
			this.onShowErr(e)
		},
		doLogin: function () {
			if (!this.data.mbLoginLock) {
				if (this.isInitSucc())
					if (!this.checkForm() && this.checkClause()) this.getTicket()
			} else this._$postMessage({
				type: "lockMbLoginState",
				value: this.data.mbLoginLock
			})
		},
		isInitSucc: function () {
			if (0 == this.data.initSuccess) {
				if (1 == this.enlang) {
					var e = h.showText("登录", this.enlang);
					this.doShowInitFail(e)
				} else this.doShowInitFail("登录");
				return 0
			}
			if (this.data.initSuccess == -1) {
				f._$showFail("-104");
				return 0
			}
			return 1
		},
		checkClause: function () {
			if (this.data.uniteLogin.needClause)
				if ("1" == this.data.uniteLogin.clause) return 1;
				else {
					this._$doShowError({
						tabIndex: -1,
						str: this.data.warn,
						node: "nerror"
					});
					return 0
				} else return 1
		},
		checkForm: function () {
			var e = 0;
			var t = [];
			i._$forEach(this.ORDERMAP, function (e) {
				var i = this.$refs[e];
				if (i) t.push(i)
			}._$bind(this));
			for (var n = 0, s; n < t.length; n++) {
				s = t[n];
				if (!s.data || "1" != s.data.ignore) {
					s.onCheckRegexp && s.onCheckRegexp();
					if (s.data) {
						if (s.data.emptyTxt) {
							e = s._$emptyCheck();
							if (e) break
						}
						if (s.otherCheck && s.otherCheck())
							if (s.data.hasError) {
								e = 1;
								break
							}
						if (s.data.hasError) {
							e = 1;
							break
						}
					} else;
				} else;
			}
			return e
		},
		doUniteLoginUnLock: function () {
			this.__getTicketLock = 0;
			if (this.__loginBtn) {
				this.__loginBtn.innerHTML = this.data.uniteLogin.loginTxtNew;
				n._$delClassName(this.__loginBtn, "u-btn-loading")
			}
		},
		doUniteLoginLock: function () {
			this.__getTicketLock = 1;
			this.__loginBtn = this.$refs.loginBtn;
			this.__loginBtn.innerHTML = "";
			n._$addClassName(this.__loginBtn, "u-btn-loading")
		},
		getTicket: function (e) {
			if (!e || !e.nolock) {
				if (this.__getTicketLock) return;
				this.doUniteLoginLock()
			}
			var t = {};
			t.un = this.$refs.mninput._$getValue().trim();
			this.__username = t.un;
			t.channel = this.data.channel;
			t.pd = this.data.product;
			t.pkid = this.data.promark;
			t.pkht = this.data.host;
			d._$request("mb-nlgt", t, this.getGtSuccess._$bind(this), this.getGtError._$bind(this), 1)
		},
		getSmsFail: function (e) {
			var t = e.ret,
				n = -1,
				s, a = "mb-nlregssms-",
				r = e.dt || "";
			this.unLockSendSms();
			if (!this.checkCapByCode(t, a)) {
				if (411 == t) {
					var o = e.receiveCode.split(",");
					if ("02" === r) {
						var c = {
							isup: !0,
							type: 2,
							mobile: this.$refs.mninput._$getValue().trim(),
							receiveCode: o,
							capFlag: this.__capFlag || ""
						};
						if ("1" == this.data.uniteLogin.needClause) c.rmbclause = this.data.uniteLogin.clause;
						if ("1" == this.data.uniteLogin.needUnLogin) c.rmbunLoginDefautl = this.data.uniteLogin.unLoginDefautl;
						this.$emit("changeModule", c);
						return
					} else {
						s = 2;
						if (1 == this.enlang) {
							var d = h.showText("请您编辑短信", this.enlang);
							var _ = h.showText("发送到", this.enlang);
							var u = h.showText("获取验证码，短信费用由运营商收取", this.enlang);
							l["mb-nlregssms-411"] = d + '<strong class="msg">' + o[0] + "</strong>" + _ + '<strong class="phone">' + o[1] + "</strong> " + u
						} else l["mb-nlregssms-411"] = '请您编辑短信<strong class="msg">' + o[0] + '</strong>发送到<strong class="phone">' + o[1] + "</strong> 获取验证码，短信费用由运营商收取";
						this.$refs.smsinput.onClearInputPuer()
					}
				}
				if (420 == t || 422 == t || 602 == t) {
					if (422 == t || 602 == t) s = 2;
					n = 1
				}
				if ("401" == t && i._$indexOf(["10", "20"], e.dt) === -1) e.ret = a + t;
				else e.ret = a + t + (e.dt || ""); if (i._$indexOf(["4503"], t) !== -1) {
					this.$refs.mninput._$setHasError();
					n = 1
				}
				this.onShowErr(e, n, s)
			}
		},
		doCheckBox: function () {
			this.data.uniteLogin.clause = !this.data.uniteLogin.clause;
			if (this.data.uniteLogin.clause) this.rmError({
				tabIndex: 5
			})
		},
		sendSms: function () {
			if (this.isInitSucc())
				if (!this.__checkMbNotOk())
					if (!this.__fail5check())
						if (!this.__checkCapStateNotOk()) {
							var e = {};
							e.un = this.$refs.mninput._$getValue().trim();
							e.pd = this.data.product;
							e.pkid = this.data.promark;
							e.pkht = this.data.host;
							e.channel = this.data.channel;
							if (!this.checkLockSendSms()) d._$request("mb-nlregssms", e, this.getSmsSuccess._$bind(this), this.getSmsFail._$bind(this), 1)
						}
		},
		_$doToggleLoingLockMb: function () {
			this.data.mbLoginLock = window._$mbLoginLock;
			this.$update()
		},
		doFocusMb: function () {
			this.$refs.mninput._$focusHelper();
			this._$resize()
		},
		_$doMbUnLogin: function () {
			this.doLogin()
		},
		_$setUniteMbAndSendSms: function (e) {
			var t = e.mobile || "",
				i = 0 !== e.auto,
				n = t.split("-"),
				s = n[0] || "",
				a = n[1] || "",
				r;
			if (t.indexOf("-") === -1 || "86" === s) {
				r = "86" === s ? a : t;
				if (!f._$checkMobile(r)) {
					this._$resize();
					return
				}
			} else {
				r = s + a;
				if (!f._$checkItlMobile(r)) {
					this._$resize();
					return
				}
			}
			this.$refs.mninput.trySetMobile(t);
			if (i) this.$refs.smsinput._$doClick();
			this._$resize()
		}
	});
	$.component("mninput", a);
	$.component("captcha", o);
	$.component("smsinput", r);
	$.component("slidecap", c);
	return $
}, "a878c0216188111f46d39b9df767b354", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "1598780dd8cf6308c2b48cd5a9c0d07f", "5019a97f49cafc5e6cc6da470054165c", "2c9966685c48aa132d904e29fe50ab0b", "5312c1874a87427492f714754fc9318b", "1135272f84d09a1f87f596dd6a5819ae", "53c267efd983fb8c66cb645beead7a8d", "c4ad5dac9207ce71767f800694decbdc", "d6e36b6b1f96e15e42725a59e7acd142", "54120fa727d71cd38f3b1273d034afef", "a4de926c2d79e8d8f856eaff4dac0f8b", "46a4de3a50f50a600950ca9cee88031e");
I$("687b82ccc95f5bfce967655823ddb8ae", '<form id="login-form"></form>');
I$("ec7162243c447c8078e08f30bea88309", '<div class="m-container">\n    <div class="u-tab f-cb">\n        <a class="tab0" on-click={this.goPwdLogin()}>{mbPwdLoginTxt}</a>\n    </div>\n    <!--帐号-->\n    <mninput ish5upsms={ish5upsms} ref=mninput on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} placeholder="" on-changemobile={this.onChangeMobile()} disabled="disabled" fromsmsup=true on-shake="{this.onShake()}" needEye=0 changeItlTxt="{changeItlTxt}" isshake=true shakecss="{shakecss}" />\n    <h5upsms ish5upsms={ish5upsms} ref=h5upsms receiveCode={receiveCode} mobile={saveTempMobile} on-changemobile={this.onChangeMobile()} on-shownext={this.onShowNext($event)} />\n    <div r-hide={!canshownext}>\n        <!-- 错误提示 -->\n        <div class="m-nerror f-dn" id="nerror"></div>\n        <!-- 登录条款 -->\n        {#if isVersionFour && mbloginclause}\n        <div class="fur-item fur-agree m-mb-clause fur-agree-4">\n            <label>\n                <span {#if ckboxOk}class="u-dl-agree u-dl-agree-select"{#else}class="u-dl-agree"{/if}><input on-click={this.doCheckBox()} type="checkbox" class="dl-clause-login" />\n                </span> 我同意\n                {#list mbloginclause.list as item}\n                    <a href="{item.url}" target="_blank" tabindex="-1" data-outlink="1">{item.txt}</a>\n                    {#if item_index<mbloginclause.list.length-2} 、{#elseif item_index<mbloginclause.list.length-1} 和 {/if}\n                {/list}\n            </label>\n        </div>\n        {/if}\n        <!-- 登录按钮 -->\n        <div class="f-cb loginbox">\n            <a ref=loginBtn id="submitBtn" on-click={this.doLogin()} {#if mbLoginLock}class="u-loginbtn btncolor tabfocus u-loginbtn-gary"{#else}class="u-loginbtn btncolor tabfocus"{/if} tabindex="8">{smsBtnTxt}</a>\n        </div>\n        <!-- 登录条款 -->\n        {#if !isVersionFour && mbloginclause}\n        <div class="fur-item fur-agree m-mb-clause">\n            <label>\n                <span {#if ckboxOk}class="u-dl-agree u-dl-agree-select"{#else}class="u-dl-agree"{/if}><input on-click={this.doCheckBox()} type="checkbox" class="dl-clause-login" />\n                </span> 我同意\n                {#list mbloginclause.list as item}\n                    <a href="{item.url}" target="_blank" tabindex="-1" data-outlink="1">{item.txt}</a>\n                    {#if item_index<mbloginclause.list.length-2} 、{#elseif item_index<mbloginclause.list.length-1} 和 {/if}\n                {/list}\n            </label>\n        </div>\n        {/if}\n        <!-- 免登复选框 -->\n        <div class="m-unlogin">\n            {#if mobileUnLoginTime}\n                <div  on-click={this.onChangeUnLogin()} class="b-unlogn">\n                    <span {#if mobileDefaultUnLogin}class="u-checkbox tabfocus u-checkbox-select"{#else}class="u-checkbox tabfocus"{/if}>\n                    </span>\n                    <label for="un-login">{mobileUnLoginTimeTxt}</label>\n                </div>\n            {/if}\n            <a class="forgetpwdReg" data-outlink="1" href={hasQuestion} target="_blank">遇到问题？</a>\n            <div class="b-unlogn j-unlogn f-dn">\n                <span class="u-checkbox tabfocus">\n                    <input type="checkbox" name="un-login" class="un-login">\n                </span>\n                <label for="un-login">{unLoginText}</label>\n            </div>\n            {#if !single}\n            {#if mbLogin && mbLogin.gotoRegTextMbUrl}\n                <a class="u-regbtn bgcolor tabfocus j-redirect" href="{mbLogin.gotoRegTextMbUrl}" data-outlink="2" target="_blank" tabindex="11">{gotoRegTextMb}</a>\n            {#else}\n                <a class="u-regbtn bgcolor tabfocus" href="javascript:void(0);" data-outlink="2" target="_self" tabindex="11" data-action="changepage" data-mdtype="1" data-log="mbLoginGoReg">{gotoRegTextMb}</a>\n            {/if}\n            {/if}\n        </div>\n        <!-- 第三方登录 -->\n        {#if config && config.length}\n        <div ref=thirdLogin class="m-ologin">\n            <div class="otip f-fl">其他方式登录</div>\n            <div class="olist">\n                {#list config as o}\n                    <a data-width="{o.width}" data-height="{o.height}" data-outlink="1" data-link="{o.url}" class="f-cb f-fl third {o.name} j-redirect" href="javascript:void(0);"></a>\n                {/list}\n            </div>\n        </div>\n        {/if}\n    </div>\n</div>\n');
I$("49bd4eac031648a801555ce91ad9425a", function (e, t, i, n, s, a, r, o, c, d, _, l) {
	var u = -1;
	var f = 3e3;
	var h = n.extend({
		template: a,
		data: {
			isupmodule: 1,
			mbPwdLoginTxt: "使用密码验证登录",
			mobileUnLoginTimeTxt: "十天内免登录"
		},
		destroy: function (e) {
			this.doUnlockLogin();
			if (this.loginsto) this.loginsto = clearTimeout(this.loginsto);
			this._$clearAllAjax();
			this.supr(e)
		},
		config: function (e) {
			this.supr(e);
			this.__loginLockTxtMb = this.data.lockConfig && this.data.lockConfig.loginLockTxtMb || "正在登录...";
			this.data.changeItlTxt = "切换手机号";
			var t = this.data.smsBtnTxt || "登录";
			this.data.smsBtnTxt = "我已发送，" + t;
			this.data.saveBtnTxt = this.data.smsBtnTxt
		},
		init: function (e) {
			this.supr(e)
		},
		onChangeMobile: function (e) {
			var t = {
				noinit: !0,
				capFlag: this.data.capFlag,
				errtxt: e || ""
			};
			if (this.data.mbloginclause) t.rmbclause = this.data.ckboxOk;
			this.$emit("changeModule", t)
		},
		doInit: function () {
			if (this.data.saveTempMobile && this.$refs.mninput) this.$refs.mninput._$setValue(this.data.saveTempMobile);
			this.showInitGuide();
			this.tryShowH5Up();
			this._$doToggleLoingLockMb()
		},
		doCheckBox: function () {
			this.data.ckboxOk = !this.data.ckboxOk;
			if (this.data.ckboxOk) this.showInitGuide();
			this.$update()
		},
		doLogin: function () {
			if (!this.data.mbLoginLock) {
				if (!this.__getTicketLock)
					if (!this.data.mbloginclause || this.data.ckboxOk) {
						this.doLockLogin();
						this.showInitGuide();
						this.loginsto = setTimeout(this.getTicket._$bind(this, {
							nolock: !0
						}), f)
					} else this._$doShowError({
						tabIndex: u,
						str: this.data.mbloginclause.clauseErr || "您需要同意相关条款才能登录",
						node: "nerror"
					})
			} else this._$postMessage({
				type: "lockMbLoginState",
				value: this.data.mbLoginLock
			})
		},
		loginError: function (e, i) {
			var n = -1,
				s, a, o = i.ret,
				c = i.dt || "";
			this.doUnlockLogin();
			if ("415" != o) {
				if ("401" == o && t._$indexOf(["09", "10", "20"], c) === -1) i.ret = e + o;
				else i.ret = e + o + c;
				var d = {};
				if ("443" === o && "02" === c) {
					n = 100;
					s = 2;
					d.sourceTxt = this.sourceTxt
				}
				if ("422" === o || "602" === o) s = 2;
				this.onShowErr(i, n, s, d);
				this.$update()
			} else {
				a = r[e + o];
				this.changeDownAndCapRefresh(a)
			}
		},
		changeDownAndCapRefresh: function (e) {
			this.onChangeMobile(e)
		},
		getGtSuccess: function (e) {
			this.supr(e, 1)
		}
	});
	return h
}, "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "8ef2745709cc1c6c902b758d33d5627e", "53c267efd983fb8c66cb645beead7a8d", "ec7162243c447c8078e08f30bea88309", "d6e36b6b1f96e15e42725a59e7acd142", "a4de926c2d79e8d8f856eaff4dac0f8b");
I$("3beb34ec2b9fd8242fe35bbf099914b6", '<div class="m-container m-uniteLogin {enlangClazz}">\n    <div class="u-tab f-cb">\n        <a class="tab0" on-click={this.goPwdLogin()}>{mbPwdLoginTxt}</a>\n    </div>\n    <!--帐号-->\n    <mninput ish5upsms={ish5upsms} fromUnite="{uniteLogin.isItl}" mbHasItl="{uniteLogin.isItl}" needEye="{needEye}" ref=mninput on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} placeholder="" on-changemobile={this.onChangeMobile()} disabled="disabled" fromsmsup=true mbNeedItl=true on-shake="{this.onShake()}" needEye=0 changeItlTxt="{changeItlTxt}" isshake=true shakecss="{shakecss}" />\n    <h5upsms ish5upsms={ish5upsms} ref=h5upsms receiveCode={receiveCode} mobile={saveTempMobile} on-changemobile={this.onChangeMobile()} on-shownext={this.onShowNext($event)} />\n    <!--帐号-->\n    <div r-hide={!canshownext}>\n        <!-- 错误提示 -->\n        <div class="m-nerror f-dn" id="nerror"></div>\n        <!-- 条款 -->\n        {#if isVersionFour && uniteLogin.needClause == \'1\'}\n        <div class="fur-agree-4">\n            <span on-click={this.doCheckBox()} {#if uniteLogin.clause}class="u-zc-agree u-zc-agree-select"{#else}class="u-zc-agree"{/if}><input type="checkbox" class="zc-un-login" /></span>\n            <div class="fur-item fur-agree" style="padding: 0 0 4px 0;margin-left:24px;">\n                <label><span on-click={this.doCheckBox()}>{argeenTxt}</span>\n                {#if newCDN === 1 && uniteLogin.uniteLoginTermsList && uniteLogin.uniteLoginTermsList.length>0}\n                    {#list uniteLogin.uniteLoginTermsList as item}\n                        <a href="{item.url}" target="_blank" tabindex="-1" data-outlink="1">{item.name}</a>{#if item_index<uniteLogin.uniteLoginTermsList.length-1} {andTxt} {/if}\n                    {/list}\n                {#else}\n                    <a href="{uniteLogin.terms0Link}" target="_blank" tabindex="-1" data-outlink="1">{uniteLogin.terms0}</a><span on-click={this.doCheckBox()}> {andTxt} </span><a href="{uniteLogin.terms1Link}" target="_blank" tabindex="-1" data-outlink="1">{uniteLogin.terms1}</a>\n                {/if}\n                </label>\n            </div>\n        </div>\n        {/if}\n        <!-- 登录按钮 -->\n        <div class="f-cb loginbox">\n            <a ref=loginBtn on-click={this.doLogin()} {#if mbLoginLock}class="u-loginbtn btncolor tabfocus u-loginbtn-gary"{#else}class="u-loginbtn btncolor tabfocus"{/if} r-html={uniteLogin.loginTxtNew} tabindex="8"></a>\n        </div>\n        <!-- 条款 -->\n        {#if !isVersionFour && uniteLogin.needClause == \'1\'}\n        <span on-click={this.doCheckBox()} {#if uniteLogin.clause}class="u-zc-agree u-zc-agree-select"{#else}class="u-zc-agree"{/if}><input type="checkbox" class="zc-un-login" /></span>\n        <div class="fur-item fur-agree" style="padding: 0 0 4px 0;margin-left:24px;">\n            <label><span on-click={this.doCheckBox()}>{argeenTxt}</span>\n            {#if newCDN === 1 && uniteLogin.uniteLoginTermsList && uniteLogin.uniteLoginTermsList.length>0}\n                {#list uniteLogin.uniteLoginTermsList as item}\n                    <a href="{item.url}" target="_blank" tabindex="-1" data-outlink="1">{item.name}</a>{#if item_index<uniteLogin.uniteLoginTermsList.length-1} {andTxt} {/if}\n                {/list}\n            {#else}\n                <a href="{uniteLogin.terms0Link}" target="_blank" tabindex="-1" data-outlink="1">{uniteLogin.terms0}</a><span on-click={this.doCheckBox()}> {andTxt} </span><a href="{uniteLogin.terms1Link}" target="_blank" tabindex="-1" data-outlink="1">{uniteLogin.terms1}</a>\n            {/if}\n            </label>\n        </div>\n        {/if}\n        <!-- 免登复选框 -->\n        <div class="m-unlogin">\n            {#if uniteLogin.needUnLogin == \'1\'}\n            {#if uniteLogin.unLoginTime}\n                <div on-click={this.onChangeUnLogin()} class="b-unlogn" style="border-right:0;">\n                    <span {#if uniteLogin.unLoginDefautl==\'1\'}class="u-checkbox tabfocus u-checkbox-select"{#else}class="u-checkbox tabfocus"{/if}>\n                    </span>\n                    <label for="un-login">{uniteLogin.unLoginTxt}</label>\n                </div>\n            {/if}\n            {/if}\n            <a class="forgetpwdReg" style="float:right;color:#9eb8d4;" data-outlink="1" href={hasQuestion} target="_blank">{questionTxt}？</a>\n        </div>\n    </div>\n</div>\n');
I$("7dd1d1775fa3bfe695208f8035bbb2eb", function (e, t, i, n, s, a, r, o, c, d, _, l, u) {
	var f = 3e3;
	var h = n.extend({
		template: a,
		data: {
			isupmodule: 1,
			mbPwdLoginTxt: "使用密码验证登录",
			questionTxt: "遇到问题",
			argeenTxt: "我同意",
			andTxt: "和",
			sendTxt: "我已发送",
			loginTxt: "快捷登录",
			enlangClazz: ""
		},
		destroy: function (e) {
			this.doUniteLoginUnLock();
			if (this.loginsto) this.loginsto = clearTimeout(this.loginsto);
			this._$clearAllAjax();
			this.supr(e)
		},
		config: function (e) {
			this.supr(e);
			this.enlang = window._$URSOPT.enlang;
			if (1 == this.enlang) {
				var i = ["mbPwdLoginTxt", "questionTxt", "argeenTxt", "andTxt", "sendTxt", "loginTxt"];
				t._$forEach(i, function (e) {
					this.data[e] = c.showText(this.data[e], this.enlang)
				}._$bind(this));
				this.data.enlangClazz = "m-uniteLogin-english-wrap"
			}
			this.hasClause = "1" == this.data.uniteLogin.needClause;
			this.hasUnLogin = "1" == this.data.uniteLogin.needUnLogin;
			var n = this.data.uniteLogin.loginTxt || this.data.loginTxt;
			this.data.uniteLogin.loginTxtNew = o._$HtmlEncode(this.data.sendTxt + "，" + n);
			this.data.saveBtnTxt = this.data.sendTxt + "，" + n;
			this.data.changeItlTxt = 1 == this.enlang ? c.showText("切换手机号", this.enlang) : "切换手机号"
		},
		init: function (e) {
			this.supr(e)
		},
		onChangeMobile: function (e, t, i) {
			var n = {
				noinit: !0,
				capFlag: this.data.capFlag,
				errtxt: e || "",
				type: 2
			};
			if (1 === t) n.saveUpMobile = this.data.saveTempMobile;
			if (i) n.needLight = 1;
			if (this.hasClause) n.rmbclause = this.data.uniteLogin.clause;
			if (this.hasUnLogin) n.rmbunLoginDefautl = this.data.uniteLogin.unLoginDefautl;
			this.$emit("changeModule", n)
		},
		doInit: function () {
			if (this.data.saveTempMobile && this.$refs.mninput) this.$refs.mninput._$setValue(this.data.saveTempMobile);
			this.showInitGuide();
			this.tryShowH5Up();
			this._$doToggleLoingLockMb()
		},
		doCheckBox: function () {
			this.data.uniteLogin.clause = !this.data.uniteLogin.clause;
			if (this.data.uniteLogin.clause) this.showInitGuide()
		},
		doLogin: function () {
			if (!this.data.mbLoginLock) {
				if (this.checkClause()) {
					if (this.__getTicketLock) return;
					this.doUniteLoginLock();
					this.showInitGuide();
					this.loginsto = setTimeout(this.getTicket._$bind(this, {
						nolock: !0
					}), f)
				}
			} else this._$postMessage({
				type: "lockMbLoginState",
				value: this.data.mbLoginLock
			})
		},
		loginError: function (e, i) {
			var n = -1,
				s, a, c = i.ret,
				d = i.dt || "";
			this.doUniteLoginUnLock();
			if ("415" != c && "4503" !== c) {
				if ("401" == c && t._$indexOf(["10", "20"], d) === -1) i.ret = e + c;
				else i.ret = e + c + d;
				var _ = {};
				if ("443" === c && "02" === d) {
					n = 100;
					s = 2;
					_.sourceTxt = this.sourceTxt
				}
				if ("422" === c || "602" === c) s = 2;
				this.onShowErr(i, n, s, _);
				this.$update()
			} else {
				a = r[e + c] || o._$getErrorTxt(c);
				if ("4503" === c) this.onChangeMobile(a, 1, 1);
				else this.onChangeMobile(a, 1)
			}
		},
		changeDownAndCapRefresh: function (e) {
			this.onChangeMobile(e)
		},
		getGtSuccess: function (e) {
			this.supr(e, 1)
		},
		onShake: function () {
			this.data.shakecss = "u-shake";
			this.shakesto = setTimeout(function () {
				this.data.shakecss = "";
				this.$update()
			}._$bind(this), 1e3)
		},
		_$doMbUnLogin: function () {
			this.doLogin()
		}
	});
	return h
}, "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "0ac97ee3b0042dd10b801ecd34c1ae66", "53c267efd983fb8c66cb645beead7a8d", "3beb34ec2b9fd8242fe35bbf099914b6", "d6e36b6b1f96e15e42725a59e7acd142", "a4de926c2d79e8d8f856eaff4dac0f8b", "46a4de3a50f50a600950ca9cee88031e");
I$("64e9a03fc7b8c800da6b65f5fae35bfc", function (e, t, i, n, s, a, r, o, c, d, _, l, u, f, h, p) {
	var m = s.extend({
		template: d,
		data: {},
		config: function (e) {
			t._$merge(this.data, e || {});
			this.supr(e)
		},
		init: function (i) {
			this.supr(i);
			this.__config = {};
			t._$merge(this.__config, i);
			this.__config.config = n._$parseOauth();
			e._$addEvent(document, "keyup", this.doEnter._$bind(this))
		},
		_$delPreFill: function () {
			if (this.__config.preFilledMobile) this.__config.preFilledMobile = ""
		},
		destroy: function () {
			e._$clearEvent(document, "keyup");
			this.__clearModules();
			this.supr()
		},
		__clearModules: function () {
			this.__nowModule = "";
			if (this.__ml) this.__ml.destroy();
			if (this.__msl) this.__msl.destroy();
			if (this.__uml) this.__uml.destroy();
			if (this.__mbsmsloginup) this.__mbsmsloginup.destroy();
			if (this.__uniteloginup) this.__uniteloginup.destroy()
		},
		_$changeModule: function (e) {
			e = e || {};
			var t = e.type,
				i = e.mobile,
				s = e.isup || !1,
				a = e.noinit || !1,
				o = e.capFlag || "";
			this.__clearModules();
			this.__config2 = n._$deepCopy(!0, {}, this.__config);
			this.__config2.hasImgCap = 0;
			this.__config2.hasSlide = 0;
			this.__config2.saveTempMobile = void 0 === i ? window._$URS.saveTempMobile || "" : i;
			this.__config2.rmbclause = e.rmbclause;
			this.__config2.rmbunLoginDefautl = e.rmbunLoginDefautl;
			if (s) {
				this.__config2.capFlag = o;
				this.__config2.receiveCode = e.receiveCode
			}
			if ("2" == t) {
				this.__config2.channel = 14;
				if (s) this.initumlup();
				else this.inituml(e, a)
			} else if ("1" == t) {
				this.__nowModule = "mbpwdlogin";
				this.__config2.channel = 1;
				this.__ml = new r({
					data: this.__config2
				}).$inject("#login-form");
				this.__ml.$on("changeModule", this._$changeModule._$bind(this));
				this.__ml.$on("delPreFill", this._$delPreFill._$bind(this));
				this.__ml.doInit()
			} else {
				this.__config2.channel = 2;
				if (s) this.initmslup();
				else this.initmsl(e, a)
			}
		},
		initumlup: function () {
			this.__nowModule = "uniteloginup";
			this.__uniteloginup = new l({
				data: this.__config2
			}).$inject("#login-form");
			this.__uniteloginup.$on("changeModule", this._$changeModule._$bind(this));
			this.__uniteloginup.doInit()
		},
		inituml: function (e, t) {
			this.__nowModule = "unitelogin";
			this.__uml = new c({
				data: this.__config2
			}).$inject("#login-form");
			this.__uml.$on("changeModule", this._$changeModule._$bind(this));
			if (t) {
				this.__uml.doRefresh(e.capFlag);
				if (e.saveUpMobile) this.__uml.setUpMobile(e.saveUpMobile, e.needLight);
				else if (1 != this.__config2.preRegDisabled) this.__uml.doFocusMb();
				if (e.errtxt) this.__uml.doShowErrTxt(e.errtxt);
				if (1 == this.__config2.preRegDisabled) this.__uml.doPreFill()
			} else this.__uml.doInit()
		},
		initmslup: function () {
			this.__nowModule = "mbsmsloginup";
			this.__mbsmsloginup = new _({
				data: this.__config2
			}).$inject("#login-form");
			this.__mbsmsloginup.$on("changeModule", this._$changeModule._$bind(this));
			this.__mbsmsloginup.doInit()
		},
		initmsl: function (e, t) {
			this.__nowModule = "mbsmslogin";
			this.__msl = new o({
				data: this.__config2
			}).$inject("#login-form");
			this.__msl.$on("changeModule", this._$changeModule._$bind(this));
			this.__msl.$on("delPreFill", this._$delPreFill._$bind(this));
			if (t) {
				this.__msl.doRefresh(e.capFlag);
				if (1 != this.__config2.preRegDisabled) this.__msl.doFocusMb();
				if (e.errtxt) this.__msl.doShowErrTxt(e.errtxt);
				if (n._$isDes() || 1 == this.__config2.preRegDisabled) this.__msl.doPreFill()
			} else this.__msl.doInit()
		},
		_$doToggleLoingLockMb: function (e) {
			window._$mbLoginLock = e;
			if (this.__ml) this.__ml._$doToggleLoingLockMb();
			if (this.__msl) this.__msl._$doToggleLoingLockMb();
			if (this.__mbsmsloginup) this.__mbsmsloginup._$doToggleLoingLockMb();
			if (this.__uml) this.__uml._$doToggleLoingLockMb();
			if (this.__uniteloginup) this.__uniteloginup._$doToggleLoingLockMb()
		},
		_$setMbClause: function (e) {
			if (this.__ml) this.__ml._$setMbClause(e);
			if (this.__msl) this.__msl._$setMbClause(e)
		},
		_$doMbUnLogin: function () {
			if ("uniteloginup" === this.__nowModule && this.__uniteloginup) this.__uniteloginup._$doMbUnLogin();
			else if ("unitelogin" === this.__nowModule && this.__uml) this.__uml._$doMbUnLogin()
		},
		_$setUniteMbAndSendSms: function (e) {
			if (this.__uml) this.__uml._$setUniteMbAndSendSms(e)
		}
	});
	return m
}, "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a4de926c2d79e8d8f856eaff4dac0f8b", "b62616ba5d59a47ea54fc057cbcd66b8", "53c267efd983fb8c66cb645beead7a8d", "dd644bb12a87654fed12c35f5a57eeb1", "8ef2745709cc1c6c902b758d33d5627e", "0ac97ee3b0042dd10b801ecd34c1ae66", "687b82ccc95f5bfce967655823ddb8ae", "49bd4eac031648a801555ce91ad9425a", "7dd1d1775fa3bfe695208f8035bbb2eb");
I$("23e5675795b942746eac3b34e36aa849", function (e, t, i, n, s, a, r, o, c, d, _) {
	var l;
	o._$$Collect = e._$klass();
	l = o._$$Collect._$extend(s._$$EventTarget);
	l.__init = function (e) {
		this.__super(e)
	};
	l.__reset = function (e) {
		this.__super(e);
		this.__el = e.holder;
		this.__threMouse = e.threMouse || 32;
		this.__threKey = e.threKey || 32;
		this.__initEvent();
		this.__timeBase = new Date;
		this._events = {
			scrSx: 0,
			scrSy: 0,
			winLF: 0,
			winSx: 0,
			winSy: 0,
			winPx: 0,
			winPy: 0,
			ursSx: 0,
			ursSy: 0,
			ursPx: 0,
			ursPy: 0,
			pw1Sx: 0,
			pw1Sy: 0,
			pw1Px: 0,
			pw1Py: 0,
			check: 0,
			mouseN: 0,
			mouseL: [],
			mouseT: 0,
			keyN: 0,
			keyL: [],
			keyT: 0
		}
	};
	l.__initEvent = function () {
		var e = [
			[this.__el, "mousedown", this.__onMouseDown._$bind(this)],
			[this.__el, "keydown", this.__onKeyDown._$bind(this)]
		];
		this.__doInitDomEvent(e)
	};
	l.__onMouseDown = function (e) {
		var t = new Date;
		if (this._events.mouseL.length > this.__threMouse) {
			this._events.mouseL = [];
			this._events.mouseT++
		}
		this._events.mouseL.push([e.which, t - this.__timeBase]);
		this._events.mouseN++
	};
	l.__onKeyDown = function (e) {
		var t = new Date;
		var i = "T";
		if (this._events.keyL.length > this.__threKey) {
			this._events.keyL = [];
			this._events.keyT++
		}
		var n = e.keyCode;
		if (n >= 48 && n <= 57 || n >= 96 && n <= 105) i = "D";
		else if (n >= 65 && n <= 90) i = "S";
		this._events.keyL.push([i, t - this.__timeBase]);
		this._events.keyN++
	};
	l._$check = function () {
		this._events.check++
	};
	l._$getEvents = function () {
		return this._events
	}
}, "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "e0793c838b68fed5a7e1742035643bec", "a4de926c2d79e8d8f856eaff4dac0f8b", "60faa331365b82e507d8aa4c86005328");
I$("ab30b27a7bf1539f01a51c9a74708788", function (e, t, i, n, s, a, r, o, c, d, _, l, u, f, h, p, m, g, b, v) {
	var $;
	m._$$GetSmsBase = e._$klass();
	$ = m._$$GetSmsBase._$extend(r._$$Abstract);
	$.__init = function (e) {
		this.enlang = window._$URSOPT.enlang;
		this.__super(e);
		this.__error_flag = {
			phone: 0,
			phonecode: 0
		};
		this.__opts = e.opts || {};
		this.__onlyPhone = e.onlyPhone || 0;
		this.__ipts = [];
		this.__disabled = !0;
		this.__cgp = p.showText("切换到国际手机", this.enlang);
		this.__country = new h({
			data: {
				isMailReg: !!this.__isMailReg
			}
		});
		this.__country.$on("setCode", this.__toggleC._$bind(this));
		this.__country.$inject(this.__itlCountry)
	};
	$.__reset = function (e) {
		this.__super(e);
		this._mob_can_pass = !1;
		this.__hasShow = 1;
		t._$addClassName(this.__inputbox3, "f-dn");
		t._$delClassName(this.__regPhoneBox, "f-dn");
		this.__promark = e.promark || "";
		this.__product = e.product || "";
		this.__captcha = e.captcha || "";
		this.__un = e.un || "";
		this.__un = this.__un.trim();
		this.__initForm();
		this.__initEvent();
		this.__states = {};
		this.__error.style.display = "none";
		this.__error2.style.display = "none";
		if (!this.__countDownBtn) this.__countDownBtn = u._$$CountDown._$allocate({
			btn: this.__getSmsCode,
			onclick: this.__onSendSms._$bind(this)
		});
		try {
			this.__inputs[0].focus()
		} catch (i) { }
		this._$clearState();
		this.__clearError();
		this._$dispatchEvent("onhidefooter")
	};
	$.__clearError = function () {
		var e = t._$get("nerror");
		if (e) e.innerHTML = ""
	};
	$.__destroy = function () {
		if (this.__countDownBtn) this.__countDownBtn = this.__countDownBtn._$recycle();
		this.__hasShow = 0;
		if (this.__unLockSendSmsBtn) this.__unLockSendSmsBtn();
		if (this.__unLockRegBtn) this.__unLockRegBtn();
		this.__super()
	};
	$.__initNode = function () {
		this.__super();
		this.__inputBoxs = t._$getByClassName(this.__body, "inputbox");
		this.__inputbox3 = t._$getByClassName(this.__body, "inputbox3")[0];
		this.__inputbox3mobile = t._$getByClassName(this.__body, "inputbox3mobile")[0];
		this.__regPhoneBox = t._$getByClassName(this.__body, "reg-phone-nomobile-box")[0];
		this.__phoneBox = this.__inputBoxs[0];
		this.__itlCountry = this.__inputBoxs[1];
		this.__getSmsCode = t._$getByClassName(this.__body, "tabfocus")[0];
		this.__error = t._$getByClassName(this.__body, "fur-smserror")[0];
		this.__errorInner = t._$getByClassName(this.__body, "ettext")[0];
		this.__error2 = t._$getByClassName(this.__body, "fur-smserror2")[0];
		this.__error2Inner = t._$getByClassName(this.__body, "smserror2")[0];
		this.__itlMobileInput = t._$getByClassName(this.__body, "j-itlphone")[0];
		this.__itlBtn = t._$getByClassName(this.__body, "j-itlBtn")[0];
		this.__countryCode = t._$getByClassName(this.__body, "j-country-code")[0];
		this.__cgpBtn = t._$getByClassName(this.__body, "j-cgp")[0];
		this.__mpcbox = t._$getByClassName(this.__body, "j-m-pcbox")[0]
	};
	$.__initEvent = function () {
		this.__inputs = t._$getByClassName(this.__body, "j-inputtext");
		this.__doreg = t._$getByClassName(this.__body, "u-loginbtn")[0];
		this.__phone = this.__inputs[0];
		this.__itlPhone = this.__inputs[1];
		this.__phonecode = this.__inputs[2];
		if (0 === this.__ipts.length) n._$forEach(this.__inputs, function (e) {
			var t = {
				opts: this.__opts,
				node: e,
				form: this.__form,
				needClose: 1,
				onfocus: this.__onFocus._$bind(this),
				onInput: this.__onInput._$bind(this)
			};
			this.__ipts.push(_._$$Input._$allocate(t))
		}._$bind(this));
		this.__doInitDomEvent([
			[this.__doreg, "click", this.__doReg._$bind(this)],
			[this.__itlBtn, "click", this.__toggleC._$bind(this)],
			[this.__cgpBtn, "click", this.__toggleCgp._$bind(this)],
			[this.__body, "click", this.__hideC._$bind(this)]
		]);
		this.__doInitDomEvent([
			[document, "keyup", this.__doEnter._$bind(this)]
		])
	};
	$.__onInput = function () {
		var e;
		var t = this.__phone.value.trim();
		var i = this.__phonecode.value.trim();
		var n = this.__itlPhone.value.trim();
		if (window._$ISIOS && 6 == i.length) {
			var s = this.__form._$checkValidity(this.__phonecode);
			if (s) c._$removeError(this.__phonecode, "nerror")
		}
		if (6 == i.length && 11 == t.length) {
			var a = this.__form._$checkValidity(this.__phone);
			if (!a) return;
			e = this.__form._$checkValidity(this.__phonecode);
			if (a && e) this.__disabled = !1;
			else this.__disabled = !0
		} else if (6 == i.length && n) {
			e = this.__form._$checkValidity(this.__phonecode);
			if (e) this.__disabled = !1;
			else this.__disabled = !0
		} else this.__disabled = !0;
		this.__checkDisable()
	};
	$.__onFocus = function (e) {
		if (e == this.__itlPhone) {
			this.__country.data.hidden = 1;
			this.__country.$update()
		}
		c._$removeError(e, "nerror")
	};
	$.__toggleC = function (e) {
		var n = e.code;
		var s = e.className;
		i._$stop(e);
		this.__country.data.hidden = this.__country.data.hidden ? 0 : 1;
		if ("string" == typeof n) {
			this.__itlBtn.className = "country " + s;
			this.__countryCode.innerHTML = n.replace("-", "");
			t._$dataset(this.__itlBtn, "code", n);
			this.__setInputMaxLength(n);
			try {
				this.__itlMobileInput.focus()
			} catch (a) { }
		}
		this.__country.$update()
	};
	$.__checkDisable = function () {
		var e = t._$getByClassName(this.__body, "u-loginbtn")[0];
		if (this.__disabled) t._$addClassName(e, "btndisabled");
		else t._$delClassName(e, "btndisabled")
	};
	$.__onSendSms = function (e) {
		var t;
		if (!this.__isRegBindMb || !c._$fail5check("mailregbdmb"))
			if ("forcesend" === e || !this.__lockSendSmsBtnState) {
				if (!this.__isItlPhone) {
					var i = this.__form._$checkValidity(this.__phone);
					if (!i) {
						t = "" == this.__phone.value.trim() ? "请输入手机号" : "手机号格式错误";
						c._$showError(this.__phone, t, "nerror");
						return
					}
				} else {
					this.__form._$checkValidity(this.__itlPhone);
					if ("" == this.__itlPhone.value.trim()) {
						t = "请输入手机号";
						c._$showError(this.__itlPhone, t, "nerror");
						return
					} else if (1 == this.__states["phone-itl"]) return
				} if (!this.__newAiSlideCap || this.__aicapstate) this.__doSendSms();
				else this.__newAiSlideCap._$doVerify()
			}
	};
	$.__doEnter = function (e) {
		if (13 == e.keyCode && this.__hasShow) this.__doReg()
	};
	$.__initForm = function () {
		if (!this.__form) this.__form = o._$$WebForm._$allocate({
			form: "reg-phone-form",
			oninvalid: function (e) {
				var t = "请输入",
					n = e.code,
					s = i._$getElement(e),
					a = s.name;
				if (n != -1) {
					if (n == -4 || n == -2 || n == -3) {
						t = "格式错误";
						if ("phone" == a) t = "手机号" + t;
						if ("phonecode" == a) t = "验证码" + t
					}
					this.__states[a] = 1;
					if ("phone" == a) this.__error_flag["phone"] = 1;
					else if ("phonecode" == a) {
						if (1 == this.__error_flag["phone"] && !this.__isItlPhone) {
							c._$showError2(s, t, "nerror", 1);
							return
						}
						this.__error_flag["phonecode"] = 1
					}
					c._$showError(s, t, "nerror");
					e.stopped = !0
				} else {
					t = "格式错误";
					if ("phone" == a) this.__error_flag["phone"] = 0;
					if ("phonecode" == a) this.__error_flag["phonecode"] = 0
				}
			}._$bind(this),
			onvalid: function (e) {
				var t = i._$getElement(e),
					n = t.name;
				this.__states[n] = 0;
				if ("phone" == n && 1 == this.__error_flag["phone"]) {
					c._$removeError(t, "nerror");
					this.__error_flag["phone"] = 0
				} else if ("phonecode" == n && 1 == this.__error_flag["phonecode"]) {
					c._$removeError(t, "nerror");
					this.__error_flag["phonecode"] = 0
				} else if ("phone-itl" == n) {
					var s = this.__reCheckItl(t);
					if (!s) {
						this.__states[n] = 1;
						if ("" !== t.value.trim()) c._$showError(t, "手机号码格式错误，请更换后重试", "nerror");
						this.__error_flag[n] = 1
					}
				}
				e.stopped = !0
			}._$bind(this)
		})
	};
	$.__reCheckItl = function (e) {
		var i = e.value;
		var n = t._$dataset(this.__itlBtn, "code");
		var s;
		if ("+86-" == n) return c._$checkMobile(i);
		else {
			s = n + i;
			s = s.replace(/[+-]/g, "");
			return !/^00/.test(i) && c._$checkItlMobile(s)
		}
	};
	$.__getItlPhone = function () {
		var e = t._$dataset(this.__itlBtn, "code");
		var i = this.__inputs[1].value.trim();
		if ("+86-" == e) return c._$emailFilter(i);
		e = e.split("+")[1];
		return c._$emailFilter(e + i)
	};
	$.__getSms = function () {
		if (this.__phonecode) c._$removeError(this.__phonecode, "nerror");
		this.__sendSms2Lock = 0;
		this.__sendSmsLock = 0;
		this._mob_can_pass = !0;
		if (this.__unLockSendSmsBtn) this.__unLockSendSmsBtn();
		this.__countDownBtn._$getSms()
	};
	$.__hideC = function () {
		if (this.__country) {
			this.__country.data.hidden = 1;
			this.__country.$update()
		}
	};
	$.__getPhone = function () {
		var e;
		if (this.__isItlPhone) e = this.__getItlPhone();
		else e = this.__phone.value.trim();
		return e
	};
	$.__doReg = function () {
		if (!this.__lockRegBtnState)
			if (!this.__isRegBindMb || !c._$fail5check("mailregbdmb")) {
				var e, t, i, n, s;
				t = this.__phonecode.value.trim();
				if (this.__isItlPhone) {
					e = this.__getPhone();
					s = this.__itlPhone.value.trim();
					if (!s) {
						c._$showError(this.__itlPhone, "请输入手机号", "nerror");
						return
					}
					if (!this._mob_can_pass) {
						c._$showError(null, "请先获取验证码", "nerror");
						return
					}
					if ("" == t) c._$showError(this.__phonecode, "请输入验证码", "nerror");
					n = this.__form._$checkValidity(this.__phonecode);
					if (n) {
						if (this.__newAiSlideCapReg && !this.__aicapstatereg) {
							this.__newAiSlideCapReg._$doVerify();
							return
						}
						this._$dispatchEvent("onVerifyOk", e, t, this.__doreg)
					}
				} else {
					i = this.__form._$checkValidity(this.__phone);
					if (!i) {
						if ("" == this.__phone.value.trim()) c._$showError(this.__phone, "请输入手机号", "nerror");
						return
					}
					if (!this._mob_can_pass) {
						c._$showError(null, "请先获取验证码", "nerror");
						return
					}
					if ("" == t) c._$showError(this.__phonecode, "请输入验证码", "nerror");
					n = this.__form._$checkValidity(this.__phonecode);
					if (i && n) {
						e = this.__phone.value.trim();
						if (this.__newAiSlideCapReg && !this.__aicapstatereg) {
							this.__newAiSlideCapReg._$doVerify();
							return
						}
						this._$dispatchEvent("onVerifyOk", e, t, this.__doreg)
					}
				}
			}
	};
	$.__toItl0 = function () {
		t._$addClassName(this.__doreg, "btndisabled");
		this.__cgp = p.showText("切换到国内手机", this.enlang);
		this.__cgpBtn.innerHTML = this.__cgp;
		this.__isItlPhone = 1;
		t._$addClassName(this.__phoneBox, "f-dn");
		t._$delClassName(this.__itlCountry, "f-dn");
		setTimeout(function () {
			this.__ipts[0]._$onClear();
			this.__ipts[2]._$onClear();
			c._$removeError(this.__inputs[0], "nerror");
			c._$removeError(this.__inputs[2], "nerror");
			this.__ipts[1]._$onClear(2)
		}._$bind(this), 150)
	};
	$._$toItl1 = function (e) {
		t._$addClassName(this.__doreg, "btndisabled");
		this.__cgp = p.showText("切换到国际手机", this.enlang);
		this.__cgpBtn.innerHTML = this.__cgp;
		this.__isItlPhone = 0;
		t._$delClassName(this.__phoneBox, "f-dn");
		t._$addClassName(this.__itlCountry, "f-dn");
		if (e) e();
		else setTimeout(function () {
			this.__ipts[1]._$onClear();
			this.__ipts[2]._$onClear();
			c._$removeError(this.__inputs[1], "nerror");
			c._$removeError(this.__inputs[2], "nerror");
			this.__ipts[0]._$onClear(2)
		}._$bind(this), 150)
	};
	$.__toggleCgp = function () {
		if (this.__cgp === p.showText("切换到国际手机", this.enlang)) this.__toItl0();
		else this._$toItl1()
	};
	$.__setInputMaxLength = function (e) {
		this.__itlMobileInput.maxLength = "+86-" === e ? 11 : 50
	};
	$._$clearState = function () {
		this.__ipts[1]._$onClear();
		this.__ipts[0]._$onClear(1);
		c._$removeError(this.__inputs[0], "nerror");
		c._$removeError(this.__inputs[2], "nerror");
		if (this.__ipts[2]) this.__ipts[2]._$onClear();
		this.__error.style.display = "none";
		this.__error2.style.display = "none"
	};
	$.__lockSendSmsBtn = function () {
		if (c._$isVersionFour() && this.__getSmsCode) {
			this.__lockSendSmsBtnState = !0;
			t._$addClassName(this.__getSmsCode, "u-btn-loading u-btn-loading-blue")
		}
	};
	$.__unLockSendSmsBtn = function () {
		if (c._$isVersionFour() && this.__getSmsCode) {
			this.__lockSendSmsBtnState = !1;
			t._$delClassName(this.__getSmsCode, "u-btn-loading u-btn-loading-blue")
		}
	}
}, "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "12c5dab742044e15807978f676f5c3fc", "bff3d86ec4ea91399919ee4963badfeb", "e30f9e8af4c2bb3cff9252a9e1c3e5da", "20a53a78a8e132ee6b99f8e237d5d673", "a4de926c2d79e8d8f856eaff4dac0f8b", "53c267efd983fb8c66cb645beead7a8d", "d311422206de0b8499264964e9de72a8", "dde0e6b40e64b3f022ca4ad9ab8b1a9c", "b819242a9b3581fcd37cdd1531beab1d", "23e5675795b942746eac3b34e36aa849", "facc340e79eadf3a9f6671c0e71dbe82", "46a4de3a50f50a600950ca9cee88031e");
I$("ef8017a163d39bd52dc4f8d2a3987619", function (e, t, i, n, s, a, r, o, c, d, _, l, u, f, h, p, m, g, b) {
	var v, $;
	var y = {
		412: "验证码错误次数过多，请明天再试",
		413: "当日尝试次数过多，请明天再试",
		430: "此次登录不需要进行密保验证"
	};
	p._$$VerifyMobile = e._$klass();
	v = p._$$VerifyMobile._$extend(r._$$GetSmsBase);
	v.__init = function (e) {
		this.__super(e)
	};
	v.__onInput = function () {
		var e = this.__phone.value.trim();
		if (this.__vfmbNewUp) {
			if (11 == e.length) {
				var t = this.__form._$checkValidity(this.__phone);
				if (t) this.__disabled = !1;
				else this.__disabled = !0
			} else this.__disabled = !0;
			this.__checkDisable()
		} else this.__super()
	};
	v.__doSendSms = function () {
		if (!this.__sendSmsLock) {
			c._$removeError2();
			this.__sendSmsLock = 1;
			var e = this.__getPhone();
			var t = {
				un: this.__un,
				mb: e,
				pd: this.__product,
				pkid: this.__promark
			};
			if (this.__onlyPhone) t.mbl = 1;
			this.__lockSendSmsBtn();
			d._$request("mbsm", t, this.__getSms._$bind(this), this.__getSmsException._$bind(this), 1)
		}
	};
	v.__reset = function (e) {
		this.__super(e);
		this.__vfmbNewUp = e.vfmbNewUp || !1;
		this.__receiveCode = e.receiveCode || "";
		if (this.__vfmbNewUp) {
			this.__cgp = "切换到国内手机";
			this.__toggleCgp();
			t._$addClassName(this.__cgpBtn, "f-dn");
			t._$addClassName(this.__mpcbox, "f-dn");
			this.__doreg.innerHTML = "下一步"
		} else {
			t._$delClassName(this.__cgpBtn, "f-dn");
			t._$delClassName(this.__mpcbox, "f-dn");
			this.__doreg.innerHTML = "确&nbsp;&nbsp;定";
			if (c._$isVersionFour()) {
				t._$addClassName(this.__cgpBtn, "f-dn");
				this.__toItl0();
				this.__country.setCountry()
			}
		}
	};
	v.__initXGui = function () {
		$ = s._$addNodeTemplate(a._$get("verify-phone-tmp", {
			getsmstxt: window._$URSOPT.getsmstxt
		}));
		this.__seed_html = $
	};
	v.__doReg = function () {
		var e;
		if (this.__vfmbNewUp) {
			e = this.__form._$checkValidity(this.__phone);
			if (!e) {
				if ("" == this.__phone.value.trim()) c._$showError(this.__phone, "请输入手机号", "nerror");
				return
			}
			this.__changeToSmsUp()
		} else this.__super()
	};
	v.__changeToSmsUp = function () {
		var e = this.__getPhone();
		this._$dispatchEvent("onChangeToUpsms", {
			receiveCode: this.__receiveCode,
			vfmbNewUp: this.__vfmbNewUp,
			mobile: e,
			promark: this.__promark,
			product: this.__product,
			onlyPhone: this.__onlyPhone,
			un: this.__un
		})
	};
	v.__getSmsException = function (e) {
		this.__unLockSendSmsBtn();
		var t = e.ret,
			i = e.dt || 0,
			n;
		this.__sendSms2Lock = 0;
		this.__sendSmsLock = 0;
		this._mob_can_pass = !0;
		if (e)
			if ("401" == t && "09" == i) {
				n = "手机号格式错误";
				c._$showError(null, n, "nerror")
			} else if ("411" == t)
				if ("02" == i) {
					var s = this.__getPhone();
					if (s.indexOf("-") > -1) {
						c._$showError(null, "请刷新页面重试", "nerror");
						return
					}
					this.__vfmbNewUp = !0;
					this.__receiveCode = e.receiveCode;
					this.__changeToSmsUp();
					return
				} else {
					var a = e.receiveCode.split(",");
					var r = "请您编辑短信<strong> " + (a[0] || "验证") + " </strong>发送到<strong> " + (a[1] || "106981630163331") + " </strong>获取验证码，短信费用由运营商收取";
					c._$showError(null, r, "nerror", 2)
				} else {
				n = l[t] || c._$getErrorTxt(e.ret);
				if ("401" == t && "10" == i) n = l["40110"];
				if ("412" == t || "413" == t || "430" == t) n = y[t];
				this._$hide();
				this._$dispatchEvent("onback", {
					errorTxt: n
				})
			}
	}
}, "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "12c5dab742044e15807978f676f5c3fc", "bff3d86ec4ea91399919ee4963badfeb", "ab30b27a7bf1539f01a51c9a74708788", "20a53a78a8e132ee6b99f8e237d5d673", "a4de926c2d79e8d8f856eaff4dac0f8b", "53c267efd983fb8c66cb645beead7a8d", "d311422206de0b8499264964e9de72a8", "dde0e6b40e64b3f022ca4ad9ab8b1a9c", "b819242a9b3581fcd37cdd1531beab1d", "23e5675795b942746eac3b34e36aa849", "facc340e79eadf3a9f6671c0e71dbe82");
I$("94b358c972f61ae8621427352d109a26", function (e, t, i, n, s, a, r, o, c) {
	var d = "为了您的安全，请发送短信进行验证：<br />";
	var _ = '编辑短信“<strong class="msg">{{smstxt}}</strong>”，发送到<strong class="phone">{{smscode}}</strong><br />系统不会回复短信，短信费用由运营商收取。<br />';
	var l = i.extend({
		data: {
			changembtxt: "<切换手机号"
		},
		config: function (t) {
			this.enlang = window._$URSOPT.enlang;
			this.data.changembtxt = s.showText("<切换手机号", this.enlang);
			e._$merge(this.data, t || {});
			this.supr(t)
		},
		destroy: function (e) {
			this.ignore = 1;
			this.clearAjaxList();
			this.resetRegBtn();
			this.ignore = 0;
			this.supr(e)
		},
		init: function (e) {
			this.supr(e);
			this.showInitGuide();
			this.tryShowH5Up()
		},
		showInitGuide: function () {
			if (1 == this.enlang) {
				d = s.showText("为了您的安全，请发送短信进行验证", 1) + "：<br />";
				_ = s.showText("编辑短信", 1) + '“<strong class="msg">{{smstxt}}</strong>”，' + s.showText("发送到", 1) + '<strong class="phone">{{smscode}}</strong><br />' + s.showText("系统不会回复短信，短信费用由运营商收取", 1) + "。<br />"
			}
			var e = this.data.receiveCode.split(","),
				i = e[0],
				n = e[1];
			var a = '请您编辑短信"<strong class="msg">' + i + '</strong>"，发送到<strong class="phone">' + n + "</strong> ，系统不会回复短信，短信费用由运营商收取";
			if (1 == this.enlang) a = s.showText("请您编辑短信", 1) + '"<strong class="msg">' + i + '</strong>"，' + s.showText("发送到", 1) + '<strong class="phone">' + n + "</strong> ，" + s.showText("系统不会回复短信，短信费用由运营商收取", 1);
			if (!t._$isH5FourVersion()) {
				this.upsmsTxt = a;
				if (t._$isVersionFour()) {
					this.upsmsTxt = _.replace("{{smstxt}}", i).replace("{{smscode}}", t._$formatSmscode(n));
					a = d + this.upsmsTxt
				}
				setTimeout(function () {
					t._$showError(null, a, "nerror", 2);
					this.tryShowUpQr(e)
				}._$bind(this), 0)
			} else t._$removeError3()
		},
		onShake: function () {
			this.data.shakecss = "u-shake";
			setTimeout(function () {
				this.data.shakecss = "";
				this.$update()
			}._$bind(this), 1e3)
		},
		resetRegBtnErr: function (e) {
			this.resetRegBtn();
			var i = this.upsmsTxt ? "<br/>" + this.upsmsTxt : "";
			e = '<strong class="msg">' + e + "</strong>" + i;
			t._$showError(null, e, "nerror", 2)
		},
		clearAjaxList: function () {
			if (this.sto) this.sto = clearTimeout(this.sto);
			n._$clearTimeoutAndAjax()
		},
		addOnlyPhone: function (e) {
			if (this.data.onlyPhone) e.mbl = 1;
			return e
		},
		onCheckSmsUp: function (e) {
			if (!this.data.isBindMbUpSms || !t._$fail5check("mailregbdmbup"))
				if ("forcesend" === e || !this.lockBtnClick && "u-btn-loading" !== this.data.ubtnloading) {
					this.data.ubtnloading = "u-btn-loading";
					if (!this.__newAiSlideCap || this.__aicapstate) {
						this.lockBtnClick = !0;
						if (this.uploadSmsIsOk) this.regvfsmsupOk();
						else this.doCheck()
					} else this.__newAiSlideCap._$doVerify()
				}
		},
		onShowNext: function () {
			this.data.canshownext = 1;
			this.$update();
			setTimeout(t._$resize, 10)
		},
		needExtClazz: function () {
			if (t._$isH5FourVersion()) {
				this.data.h5extclazz = "h5ext-page-sms";
				this.$update()
			}
		}
	});
	return l
}, "8fd03edddb19cf8c294f56ca6638c475", "a4de926c2d79e8d8f856eaff4dac0f8b", "f1fc556eafb5676910602a7f1fa3af8e", "53c267efd983fb8c66cb645beead7a8d", "46a4de3a50f50a600950ca9cee88031e");
I$("869b13dc811214f75220d7dde4498c3b", '<form id="reg-phone-form" class="page-sms {h5extclazz}">\n    <div class="m-pccnt">\n        <div r-hide={ish5upsms===1} class="reg-phone-nomobile-box">\n            <div class="ph-tip">本次登录需要短信验证，请按以下提示操作</div>\n            <div class="inputbox" on-click="{this.onShake($event)}">\n                <div class="u-input">\n                    <label class="u-label f-dn">请输入手机号</label>\n                    <input data-placeholder="请输入手机号" name="phone" class="j-inputtext u-upsms-disabled" type="tel" data-required="true" data-name="phone" data-pattern="^(13|14|15|16|17|18|19)\\d{9}$" tabindex="1" spellcheck="false" autocomplete="off" maxlength="11" value="{mobile}" disabled="disabled" />\n                </div>\n                <div class="u-tip u-upsms-tip"><div class="u-success u-clear {shakecss}"></div></div>\n            </div>\n            <div class="u-toggleitlbox"><a class="toggleitl j-cgp" href="javascript:void(0);" on-click={this.backDownSms($event)}>切换手机号</a></div>\n        </div>\n        <h5upsms extclazz="m-smsup-ext" ish5upsms={ish5upsms} ref=h5upsms receiveCode={receiveCode} mobile={mobile} changembtxt={changembtxt} on-changemobile={this.backDownSms($event)} on-shownext={this.onShowNext($event)} />\n        <div class="m-nerror f-dn" id="nerror"></div>\n    </div>\n    <div r-hide={!canshownext}>\n        <div class="f-cb loginbox">\n            <a class="u-loginbtn btncolor tabfocus btndisabled {ubtnloading}" on-click={this.onCheckSmsUp($event)} tabindex="5">{regBtnTxt}</a>\n        </div>\n    </div>\n</form>');
I$("d7b1af22875fe7b83dcda4008c6c6efa", function (e, t, i, n, s, a, r, o, c, d, _, l) {
	var u = 3e3;
	var f = "我已发送，登录";
	var h = s.extend({
		template: o,
		data: {
			saveBtnTxt: f,
			regBtnTxt: f
		},
		config: function (e) {
			t._$merge(this.data, e || {});
			this.supr(e);
			this.needExtClazz()
		},
		resetRegBtn: function () {
			this.data.ubtnloading = "";
			this.lockBtnClick = !1;
			this.data.regBtnTxt = f;
			this.$update()
		},
		regvfsmsupOk: function () {
			this.resetRegBtn();
			this.$emit("onVerifyOk")
		},
		backDownSms: function (e) {
			var t = 1 === e ? "请获取短信验证码" : "";
			this.$emit("changeToVerifyMobile", {
				txt: t
			})
		},
		regvfsmsupFail: function (e) {
			var t = e.ret || "",
				i;
			if ("-1" != t)
				if ("430" == t) {
					i = r[t];
					this.$emit("onback", {
						errorTxt: i
					})
				} else if ("412" == t) this.resetRegBtnErr("验证码错误次数过多，请明天再试");
				else if ("443" == t || "409" == t) this.resetRegBtnErr("系统未收到短信或短信内容错误");
				else {
					if ("401" == t && e.dt) t += e.dt;
					i = r[t] || n._$getErrorTxt(t);
					this.resetRegBtn();
					n._$showError(null, i, "nerror")
				} else if (!this.ignore) this.resetRegBtnErr("网络异常，请稍后重试")
		},
		doCheck: function () {
			var e = {};
			e.un = this.data.un;
			e.pd = this.data.product;
			e.pkid = this.data.promark;
			e.mb = this.data.mobile;
			this.addOnlyPhone(e);
			if (n._$isVersionFour()) this.showInitGuide();
			this.sto = setTimeout(function () {
				a._$request("vfmbsms", e, this.regvfsmsupOk._$bind(this), this.regvfsmsupFail._$bind(this), 1)
			}._$bind(this), u)
		}
	});
	return h
}, "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a4de926c2d79e8d8f856eaff4dac0f8b", "94b358c972f61ae8621427352d109a26", "53c267efd983fb8c66cb645beead7a8d", "285e64765191768caf2cc6de0397e37c", "869b13dc811214f75220d7dde4498c3b");
I$("1214a1313fb5c7b23edf0238d4b7b29c", '<form id="phone-form" action="javascript:void(0);">\n    <!--手机验证-->\n    <div r-hide={ish5upsms===1} id="phonecheck-box" class="m-pccnt">\n        <p>请用手机<span id="pp_mb">{mobile}</span>进行安全验证：</p>\n    </div>\n    <h5upsms nochange=1 ish5upsms={ish5upsms} ref=h5upsms receiveCode={receiveCode} mobile={mobile} changembtxt={changembtxt} on-changemobile={this.backDownSms($event)} on-shownext={this.onShowNext($event)} />\n    <div r-hide={!canshownext}>\n        <!-- 错误提示 -->\n        <div class="m-nerror f-dn" id="nerror"></div>\n        <div class="f-cb btnbox unlockbox">\n            <a on-click={this.onCheckSmsUp($event)} class="u-loginbtn btncolor tabfocus {ubtnloading}" tabindex="9">{regBtnTxt}</a>\n        </div>\n        <p class="t-appeal">无法安全验证？你可以<a href="https://mima.163.com/nie/" target="_blank">帐号申诉</a></p>\n    </div>\n</form>');
I$("b88d7e82afb4d7879a79ca11de4cd6f0", function (e, t, i, n, s, a, r, o, c, d, _, l) {
	var u = 3e3;
	var f = "我已发送，登录";
	var h = s.extend({
		template: o,
		data: {
			saveBtnTxt: f,
			regBtnTxt: f
		},
		config: function (e) {
			t._$merge(this.data, e || {});
			this.supr(e)
		},
		resetRegBtn: function () {
			this.data.ubtnloading = "";
			this.lockBtnClick = !1;
			this.data.regBtnTxt = f;
			this.$update()
		},
		backDownSms: function () {
			var e = "请获取短信验证码";
			this.$emit("changeToVerifyPhone", {
				txt: e
			})
		},
		regvfsmsupOk: function () {
			this.resetRegBtn();
			this.$emit("onVerifyOk")
		},
		regvfsmsupFail: function (e) {
			var t = e.ret || "",
				i;
			if ("-1" != t)
				if ("430" == t) {
					i = r[t];
					this.$emit("onback", {
						errorTxt: i
					})
				} else if ("412" == t) this.resetRegBtnErr("验证码错误次数过多，请明天再试");
				else if ("443" == t || "409" == t) this.resetRegBtnErr("系统未收到短信或短信内容错误");
				else if ("415" == t) this.backDownSms();
				else {
					if ("401" == t && e.dt) t += e.dt;
					i = r[t] || n._$getErrorTxt(t);
					this.resetRegBtn();
					n._$showError(null, i, "nerror")
				} else if (!this.ignore) this.resetRegBtnErr("网络异常，请稍后重试")
		},
		doCheck: function () {
			var e = {
				un: this.data.username,
				pd: this.data.product,
				pkid: this.data.promark,
				n: 1
			};
			this.addOnlyPhone(e);
			if (n._$isVersionFour()) this.showInitGuide();
			this.sto = setTimeout(function () {
				a._$request("vfsms", e, this.regvfsmsupOk._$bind(this), this.regvfsmsupFail._$bind(this), 1)
			}._$bind(this), u)
		}
	});
	return h
}, "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a4de926c2d79e8d8f856eaff4dac0f8b", "94b358c972f61ae8621427352d109a26", "53c267efd983fb8c66cb645beead7a8d", "285e64765191768caf2cc6de0397e37c", "1214a1313fb5c7b23edf0238d4b7b29c");
I$("fc7cb307034da37cb66f38dd2e97d767", function (e, t, i, n, s, a, r, o, c, d, _, l, u, f, h, p, m, g, b, v, $, y, C, w, x, T) {
	var E, k = 2e3,
		S = 1e3;
	C._$$LoginManager = e._$klass();
	E = C._$$LoginManager._$extend(h._$$Manager);
	E.__init = function (e) {
		this.enlang = window._$URSOPT.enlang;
		var t;
		s._$loadGaq();
		this.__pwdErrCountMap = {};
		this.__options = e || {};
		window.$loginOpts = this.__options;
		this.__onlyPhone = e.onlyPhone || 0;
		p["601"] = s._$setOutLogin();
		this.__isNewCapPopup = "popup" == this.__options.mode;
		this.__loginLockTxt = e.lockConfig && e.lockConfig.loginLockTxt || y.showText("正在登录...", this.enlang);
		this.__preFilledMail = e.preFilledMail || "";
		this.__preFilledDisabled = e.preRegDisabled || 0;
		this.__domains = e.domains || "";
		this.__product = e.product || "";
		this.__promark = e.promark || "";
		this.__host = e.host || "";
		this.__focusHelper = e.focusHelper || 0;
		this.__lazyCheck = e.lazyCheck || 0;
		this.__autoSuffix = e.autoSuffix || 0;
		this.__needUnLogin = e.needUnLogin || 0;
		this.__defaultUnLogin = e.defaultUnLogin || 0;
		this.__needQrLogin = e.needQrLogin || 0;
		this.__toolName = e.toolName || 0;
		this.__toolUrl = e.toolUrl || 0;
		this.__unLoginChecked = this.__defaultUnLogin || 0;
		this.__unLoginTime = e.unLoginTime || 10;
		this.__needMailLoginClause = this.__options.mailloginclause && this.__options.mailloginclause.list && this.__options.mailloginclause.list.length > 0;
		this.__mailLoginClauseOk = 0;
		if (e.loadTime) {
			t = window._$BGP ? "BGP" : "非BGP";
			_gaq.push(["_trackEvent", "外层用时" + window._$PKID, "加载成功", t + "-【" + e.loadTime + "】ms"])
		}
		this.__gaqo = {
			pid: this.__promark,
			pdt: this.__product
		};
		this.__domain = e.prdomain;
		window["$cookieDomain"] = e.cookieDomain;
		this.__errMsg = s._$HtmlEncode(e.errMsg || "");
		this.__errMode = e.errMode || 1;
		this.__super(e);
		if (this.__errMsg) setTimeout(function () {
			s._$showError(null, this.__errMsg, "nerror")
		}._$bind(this), 20);
		s._$resize();
		i._$addEvent(window, "message", this.onMessage._$bind(this))
	};
	E.onMessage = function (e) {
		var t;
		var i = e && e.data;
		if (i) {
			if ("string" == typeof i) try {
				i = JSON.parse(i)
			} catch (n) { }
			if ("object" == typeof i && "URS|" == i.from)
				if (i.fromUniteMbAndSendSms && this.__mbLoginModule) this.__mbLoginModule._$setUniteMbAndSendSms(i);
				else if (i.fromLoginLockMb && this.__mbLoginModule) {
					t = i.lock || 0;
					this.__mbLoginModule._$doToggleLoingLockMb(t)
				}
		}
	};
	E.__reset = function (e) {
		this.__super(e);
		this.__islogin = 1;
		this.__disabled = 1;
		this.__onpage = "login";
		this.__single = parseInt(e.single);
		this.__includeBox = !!e.includeBox;
		this.__mobileFirst = e.mobileFirst || 0;
		this.__regUrl = e.regUrl;
		this.__regUrlForce = e.regUrlForce || "";
		this.__renderBox();
		s._$resize()
	};
	E.__renderLogin = function () {
		this.__hasllpErr = 0;
		this.__moduleType = "email";
		if (this.__needQrLogin) this.__showQrcodeBtn();
		this.__module = "goEmailLogin";
		this.__initLogin();
		this.__initUnLogin();
		this.__initMailLoginClause();
		this.__setUsername();
		this.__sendSize("init");
		this.__checkDisable();
		this.__inputs = t._$getByClassName(this.__box, "j-inputtext");
		this.__pwdtext = t._$get("pwdtext");
		this.__nameinput = this.__inputs[0];
		this.__passwordinput = this.__inputs[1];
		this.__checkcodeinput = this.__inputs[2];
		if (this.__domain && !this.__domain2) {
			this.__initUserNameDomain(this.__domain);
			this.__domain2 = 1
		}
	};
	E.__renderBox = function () {
		o._$render(this.__box, "index-tmp", {
			needMobileLogin: this.__options.needMobileLogin,
			goEmailLoginTxt: this.__options.goEmailLoginTxt,
			goMbLoginTxt: this.__options.goMbLoginTxt,
			goEmailRegTxt: this.__options.goEmailRegTxt,
			goMbRegTxt: this.__options.goMbRegTxt
		});
		this.__cnt = t._$getByClassName(this.__box, "m-cnt")[0];
		this.__footer = t._$getByClassName(this.__box, "m-footer")[0];
		if (this.__includeBox) {
			var e = t._$get("cnt-box-parent");
			if (!t._$hasClassName(e, "cnt-box-include")) t._$addClassName(e, "cnt-box-include")
		}
		var i = t._$get("mobileModule");
		if (this.__mobileFirst && i) this.__doAction(i);
		else this.__renderLogin()
	};
	E.__initUserNameDomain = function (e) {
		try {
			var i = t._$getByClassName(this.__box, "j-prdomain")[0];
			var n = t._$getByClassName(this.__box, "j-inputtext")[0];
			var a = t._$getByClassName(this.__box, "inputbox")[0];
			var r = t._$getByClassName(this.__box, "u-logo")[0];
			i.innerHTML = s._$HtmlEncode(e);
			t._$delClassName(i, "f-dn");
			n.style.width = a.clientWidth - r.clientWidth - i.clientWidth - 22 + "px";
			i.style.right = -5 - i.clientWidth + "px"
		} catch (o) { }
	};
	E.__showQrcodeBtn = function () {
		this.__qrm = t._$getByClassName(this.__box, "j-btnqrcode")[0];
		if (this.__qrm) {
			t._$delClassName(this.__qrm, "f-dn");
			i._$clearEvent(this.__qrm);
			i._$addEvent(this.__qrm, "click", this.__showQrcodeModule._$bind(this))
		}
	};
	E.__hideQrcodeBtn = function () {
		if (this.__qrm) t._$addClassName(this.__qrm, "f-dn")
	};
	E.__doEnter = function (e) {
		if (this.__loginModule && "login" == this.__onpage && !this.__isAppSafe)
			if (13 == e.keyCode && !this.__loginModule._stopEnter) this.__doAction(null, "dologin");
			else if (this.__loginModule) this.__loginModule._stopEnter = 0
	};
	E.__checkDisable = function () {
		var e = t._$get("dologin");
		if (this.__disabled) t._$addClassName(e, "btndisabled");
		else t._$delClassName(e, "btndisabled")
	};
	E.__destroy = function () {
		window._$needCookieSet = 0;
		this.__clearModule();
		this.__super();
		this.__hideQrcodeBtn();
		delete this.__module
	};
	E.__clearLockState = function () {
		this.__vfLock = 0;
		this.__getTkLock = 0;
		this.__doLoginLock = 0;
		this.__checkSmsCodeLock = 0;
		this.__doVfoLock = 0
	};
	E.__initComp = function (e) {
		var t = s._$timeCountEnd("initLogin");
		if (t > 0) {
			var i = window._$BGP ? "BGP" : "非BGP";
			_gaq.push(["_trackEvent", "登录初始化" + window._$PKID, "初始化成功", "详细耗时【" + e.time + "ms】渠道" + i]);
			t = -1
		}
		if (this.__loginModule) {
			if (this.__focusHelper) {
				this.__loginModule._$focusHelper();
				this.__focusHelper = !1
			}
			this.__showOtpOrPPcError();
			if (!this.__errMsg && e.adInfo && !this.__hasllpErr) try {
				e.adInfo = JSON.parse(e.adInfo);
				if (e.adInfo.icon) e.adInfo.icon = s._$changeImg(e.adInfo.icon);
				if (s._$isIPV6()) e = this.__changeIconToIPV6(e);
				s._$showError(0, e.adInfo.content, "nerror", 3, {
					icon: e.adInfo.icon
				})
			} catch (n) { }
			if (this.__hasllpErr) this.__hasllpErr = 0;
			if (this.__loginVerifyError) {
				s._$showError(null, this.__loginVerifyError, "nerror");
				this.__loginVerifyError = null
			}
			this.__hasInit = 1;
			this.__aqGuideFlag = e.aqGuideFlag || 0;
			this.__needWatchman = "1" == e.watchman ? 1 : 0;
			this.__capFlag = e ? e.capFlag : this.__capFlag;
			s._$setAiCapId(e);
			this.__initCap(e, 1);
			this.__sendMsg({
				type: "loginInitSuccess"
			})
		}
	};
	E.__initCap = function (e, t) {
		if (1 == this.__capFlag) this.__showCheckCode(e);
		else if (4 == this.__capFlag || 5 == this.__capFlag)
			if (this.__isNewCapPopup) this.__loginModule._$setNeedCheckCode();
			else this.__showCheckCode(e);
		else if (6 == this.__capFlag) this.__showCheckCode(e, t)
	};
	E.__changeIconToIPV6 = function (e) {
		var t = e.adInfo.icon || "";
		t = t.replace("ursdoccdn.nosdn.127.net", "urswebzj.nosdn.127.net");
		if (t && (t.indexOf("urswebzj.nosdn.127.net") > 0 || t.indexOf("webzj.netstatic.net") > 0)) e.adInfo.icon = s._$urlToIPV6(t);
		return e
	};
	E.__onPwdKeyUp = function () {
		this.__pwdKeyUp = 1
	};
	E.__initLogin = function () {
		var e = function (e) {
			var i = t._$get("changepage");
			t._$dataset(i, "action", "none");
			if (s._$notURL(e)) e = "";
			var n = e || "https://zc.reg.163.com/regInitialized?pd=urszjmailreg&pkid=qzgcGfv&pkht=id.163.com";
			s._$useDefaultRegMailLog(n, "1");
			i.href = n;
			i.target = "_blank"
		};
		return function () {
			if (!this.__loginModule) this.__createLoginModule(1);
			this.__mainBtn = t._$getByClassName(this.__box, "u-loginbtn")[0];
			if (this.__regUrlForce) e.call(this, this.__regUrlForce);
			else if (this.__single) e.call(this, this.__regUrl)
		}
	}();
	E.__onDisabled = function (e) {
		this.__disabled = e;
		this.__checkDisable()
	};
	E.__onUnLockLogin = function () {
		this.__doLoginLock = 0;
		if (this.__loginBtn && this.__loginBtnTxt) this.__loginBtn.innerHTML = s._$HtmlEncode(this.__loginBtnTxt)
	};
	E.__onDoLockLogin = function (e) {
		e = e || {};
		this.__doLoginLock = 1;
		this.__loginBtn = t._$getByClassName(document, "u-loginbtn")[0];
		var i = "string" == typeof this.__loginBtn.textContent ? this.__loginBtn.textContent : this.__loginBtn.innerText;
		if (i != (e.txt || this.__loginLockTxt)) this.__loginBtnTxt = i;
		if (!e.noTxt) this.__loginBtn.innerHTML = s._$HtmlEncode(e.txt || this.__loginLockTxt)
	};
	E.__createLoginModule = function (e) {
		var t = {
			pd: this.__product,
			pkid: this.__promark,
			pkht: this.__host
		};
		this.__addOnlyPhone(t);
		this.__iniData = t;
		this.__loginModule = d._$$Login._$allocate({
			parent: this.__cnt,
			opts: this.__options,
			onSlideOk: this.__onSlideOk._$bind(this),
			onPwdKeyUp: this.__onPwdKeyUp._$bind(this),
			ondisabled: this.__onDisabled._$bind(this),
			onUnLockLogin: this.__onUnLockLogin._$bind(this),
			onDoLockLogin: this.__onDoLockLogin._$bind(this),
			onSetCF: this.__onSetCF._$bind(this),
			aiUnlockBtn: this.__onAiUnlockBtn._$bind(this)
		});
		if (e) {
			s._$timeCount("initLogin");
			this.__hasInit = -1;
			a._$request("initComponentLogin", t, this.__initComp._$bind(this), this.__initFail._$bind(this, 0), 1, this.__product)
		}
		if (this.__password) this.__loginModule._$setPwd(this.__password);
		this.__onpage = "login";
		i._$delEvent(document, "keyup", this.__doEnter._$bind(this));
		i._$addEvent(document, "keyup", this.__doEnter._$bind(this))
	};
	E.__onAiUnlockBtn = function () {
		this.__doLoginLock = 0
	};
	E.__onSetCF = function (e) {
		this.__capFlag = e
	};
	E._$doRefresh = function () {
		s._$timeCount("initLogin");
		this.__hasInit = -1;
		a._$request("initComponentLogin", this.__iniData, this.__initComp._$bind(this), this.__initFail._$bind(this, 1), 1, this.__product)
	};
	E.__createMbLoginModule = function () {
		this.__moduleType = "mobile";
		var e = this.__options.smsLoginFirst ? 0 : 1;
		if (this.__options.uniteLogin)
			if ("0" == this.__options.uniteLogin.first) e = 1;
			else e = 2;
		if (this.__needQrLogin) this.__showQrcodeBtn();
		this.__mbLoginModule = new m({
			data: this.__options
		});
		this.__mbLoginModule.$inject(this.__cnt);
		this.__mbLoginModule._$changeModule({
			type: e
		});
		if (this.__options.preFilledMobile && 1 != this.__options.preRegDisabled) this.__options.preFilledMobile = "";
		if (this.__options.uniteLogin && this.__options.uniteLogin.preFillUnite && 1 != this.__options.preRegDisabled) this.__options.uniteLogin.preFillUnite = ""
	};
	E.__showFooter = function () {
		var e = t._$get("footer");
		if (e) t._$delClassName(e, "f-dn")
	};
	E.__goModule = function () {
		this.__clearModule();
		if ("goEmailLogin" == this.__module) this.__renderLogin();
		else this.__createMbLoginModule();
		this.__showFooter()
	};
	E.__doAction = function (e, a, r) {
		var o = i._$getElement(e) || e,
			d = a || t._$dataset(o, "action"),
			_ = t._$dataset(this.__mainBtn, "lock") || 0,
			l = t._$dataset(o, "srclist") || "";
		if ("dounlocklogin" != d) {
			if ("myphonegoon" == d) {
				var u = {};
				var f = t._$get("ismyphonebox");
				u.ck = "0";
				if (f) u.ck = f.checked ? "1" : "0";
				l = l ? l.split(",") : [];
				if (l.length > 0)
					for (var h = 0, p; h < l.length; h++) {
						p = l[h];
						l[h] = p + "&ck=" + u.ck
					}
				this.__setDomainsHasPathbAndOpd({
					type: "success",
					username: this.__username || "",
					nextUrls: l,
					k: this.__tempK
				});
				if (!this.__onlyPhone) c._$cookie("THE_LAST_LOGIN", {
					value: this.__username || "",
					expires: 30,
					path: "/"
				})
			} else if ("goEmailLogin" == d || "goMbLogin" == d) {
				if (d == this.__module) return;
				this.__heads = t._$getByClassName(this.__box, "j-head");
				n._$forEach(this.__heads, function (e) {
					t._$delClassName(e, "active")
				});
				t._$addClassName(o, "active");
				this.__module = d;
				this.__goModule()
			} else if ("modeBack" == d) {
				l = l ? l.split(",") : [];
				if (l.length > 0) s._$sendLog2(l);
				this.__doBack(1)
			} else if ("modeGoon" == d) {
				l = l ? l.split(",") : [];
				this.__setDomainsHasPathbAndOpd({
					type: "success",
					username: this.__username || "",
					nextUrls: l,
					k: this.__tempK
				});
				if (!this.__onlyPhone) c._$cookie("THE_LAST_LOGIN", {
					value: this.__username || "",
					expires: 30,
					path: "/"
				})
			} else if ("leakLogin" == d) {
				if (this.__isLeak1) this.__doGoon(1, o);
				else if (this.__isLeak2) {
					this.__isLeak = !1;
					this.__doBack(1)
				} else if (this.__isLeak3) this.__doGoon()
			} else if ("dologin" == d) {
				if (_) this.__sendMsg({
					type: "lockLoginState",
					value: _
				});
				if ("1" == _) return;
				this.__doLogin()
			} else if ("dounlock-ph" == d)
				if (this.__phoneModule._$canUnlcok()) this.__unlockAndLogin(1);
				else this.__phoneModule && this.__phoneModule._$showReason();
			else if ("dounlock-otp" == d)
				if (this.__otpModule.__canUnlock) this.__unlockAndLogin(2);
				else this.__otpModule && this.__otpModule._$showReason();
			else if ("dounlock-ppc" == d)
				if (this.__ppcModule.__canUnlock) this.__unlockAndLogin(3);
				else this.__ppcModule && this.__ppcModule._$showReason();
			else if ("doback" == d) {
				l = l ? l.split(",") : [];
				if (l.length > 0) s._$sendLog2(l);
				this.__isLeak = !1;
				r = !r;
				this.__doBack(r)
			} else if ("doclose" == d)
				if (!this.__closeFlag) {
					this.__closeFlag = !0;
					this.__sendClose()
				}
			this.__super(e)
		} else {
			this.__unLockLoginState(1);
			this.__hasllpErr = 1;
			s._$showError(null, "已取消登录，请重新登录", "nerror", 2)
		}
	};
	E.__goonLog = function (e) {
		if (e && "10" == e.dt && "401" == e.ret) {
			var t = p["40110"];
			s._$showError(null, t, "nerror")
		}
	};
	E.__doGoon = function (e, i) {
		var n;
		if (!this.__onlyPhone) c._$cookie("THE_LAST_LOGIN", {
			value: this.__username || "",
			expires: 30,
			path: "/"
		});
		if (1 == e) {
			n = t._$dataset(i, "srclist") || "";
			n = n ? n.split(",") : []
		}
		this.__setDomainsHasPathbAndOpd({
			type: "success",
			username: this.__username || "",
			nextUrls: n || [],
			k: this.__tempK
		})
	};
	E.__clearModule = function () {
		this.__clearLockState();
		this.__isDoBack = 0;
		if (this.__isAppSafe) this.__unLockLoginState();
		if (this.__mbLoginModule) this.__mbLoginModule.destroy();
		if (this.__verifyPhoneUpSms) this.__verifyPhoneUpSms.destroy();
		if (this.__verifyMobileUpSms) this.__verifyMobileUpSms.destroy();
		if (this.__phoneModule) this.__phoneModule = this.__phoneModule._$recycle();
		else if (this.__otpModule) this.__otpModule = this.__otpModule._$recycle();
		else if (this.__ppcModule) this.__ppcModule = this.__ppcModule._$recycle();
		if (this.__verifyMobileModule) this.__verifyMobileModule = this.__verifyMobileModule._$recycle();
		if (this.__loginModule) {
			this.__onUnLockLogin();
			this.__loginModule = this.__loginModule._$recycle()
		}
		if (this.__qrcodeModule) this.__qrcodeModule = this.__qrcodeModule._$recycle()
	};
	E.__doBack = function (e) {
		if ("object" == typeof e) this.__loginVerifyError = e.errorTxt || "";
		this.__clearModule();
		this.__isDoBack = 1;
		if (this.__module && "goMbLogin" == this.__module) {
			this.__module = null;
			this.__doAction(t._$get("mobileModule"))
		} else {
			this.__createLoginModule(e);
			this.__setUsername();
			this.__changePage()
		}
		this.__showFooter();
		s._$resize()
	};
	E.__initMailLoginClause = function () {
		var e = function () {
			var e = t._$getByClassName(this.__box, "j-mail-clause-span")[0];
			if (!t._$hasClassName(e, "u-dl-agree-select")) this.__setMailLoginClauseOk(e);
			else this.__setMailLoginClauseFail(e)
		};
		return function () {
			if (this.__needMailLoginClause) {
				var n = t._$getByClassName(this.__box, "j-mail-clause-checkbox")[0];
				i._$clearEvent(n);
				i._$addEvent(n, "click", e._$bind(this))
			}
		}
	}();
	E.__initUnLogin = function () {
		var e = function () {
			var e = t._$getByClassName(this.__box, "u-checkbox")[0];
			if (!t._$hasClassName(e, "u-checkbox-select")) {
				this.__unLoginChecked = 1;
				t._$addClassName(e, "u-checkbox-select")
			} else {
				this.__unLoginChecked = 0;
				t._$delClassName(e, "u-checkbox-select")
			}
		};
		return function () {
			var n = t._$getByClassName(this.__box, "j-unlogn")[0];
			if (this.__needUnLogin && n) {
				t._$delClassName(n, "f-dn");
				var s = t._$getByClassName(n, "un-login")[0];
				if (this.__unLoginChecked) t._$addClassName(t._$getByClassName(this.__box, "u-checkbox")[0], "u-checkbox-select");
				i._$clearEvent(s);
				i._$addEvent(s, "click", e._$bind(this))
			} else t._$addClassName(n, "f-dn")
		}
	}();
	E.__setUsername = function () {
		var e;
		var t;
		if (1 === this.__options.clearMailFill) t = window._$URS.saveTempEmail || this.__preFilledMail || this.__username;
		else t = window._$URS.saveTempEmail || this.__preFilledMail || this.__username || c._$cookie("THE_LAST_LOGIN"); if (t) {
			if (this.__domain)
				if (t.substring(t.indexOf("@")) === this.__domain) e = t.substring(0, t.indexOf("@"));
				else e = "";
			else if (this.__onlyPhone) e = this.__preFilledMail || this.__username || "";
			else e = t;
			this.__loginModule._$setUsername(e);
			if (this.__preFilledMail && 1 == this.__preFilledDisabled) this.__loginModule._$setUsernameDis();
			if (1 != this.__preFilledDisabled) this.__preFilledMail = ""
		}
	};
	E.__unlockAndLogin = function (e) {
		if (1 == e) this.__phoneModule._$stateOK(this.__doUnlockAndLogin._$bind(this, e));
		else if (2 == e) this.__otpModule._$stateOK(this.__doUnlockAndLogin._$bind(this, e));
		else if (3 == e && this.__ppcModule.__canUnlock) this.__doUnlockAndLogin(3, 1)
	};
	E.__doUnlockAndLogin = function (e, t) {
		if (t) {
			var i, n = {}, s = {};
			n.un = this.__username;
			n.pw = MP.encrypt2(this.__password);
			n.pkid = this.__promark;
			n.pd = this.__product;
			n.l = this.__unLoginChecked ? 1 : 0;
			n.d = this.__unLoginTime;
			if (1 == e) {
				i = this.__phoneModule._$getValues() || [];
				s.sms = i[0];
				s.un = this.__username;
				s.pd = this.__product;
				s.pkid = this.__promark;
				if ("02" === this.__phoneModule._$getDt()) s.n = 1;
				this.__dovfsms(s, n)
			} else if (2 == e) {
				i = this.__otpModule._$getValues() || [];
				s.otppwd = i[0];
				s.un = this.__username;
				s.pd = this.__product;
				s.pkid = this.__promark;
				this.__dovfotp(s, n)
			} else if (3 == e) {
				i = this.__ppcModule._$getValues() || [];
				s.cos = this.__ppcCos;
				s.ppcpwd = i[0] + i[1] + i[2];
				s.un = this.__username;
				s.pd = this.__product;
				s.pkid = this.__promark;
				this.__dovfppc(s, n)
			}
		}
	};
	E.__dovfsms = function (e, t) {
		if (!this.__vfLock) {
			this.__vfLock = 1;
			this.__addOnlyPhone(e);
			a._$request("vfsms", e, this.__vfSuccess._$bind(this, t), this.__vfsmsWarn._$bind(this), 1, this.__product)
		}
	};
	E.__vfSuccess = function (e) {
		this.__vfLock = 0;
		this.__doAction(null, "doback", 1);
		this.__safeLogin(e, 1)
	};
	E.__vfsmsWarn = function (e) {
		this.__vfLock = 0;
		var t = e.ret,
			i;
		if (e)
			if ("415" == t || "443" == t) {
				i = p[t] || s._$getErrorTxt(e.ret);
				this.__setError(i)
			} else if ("412" == t) {
				this.__phoneError = "验证码错误次数过多，请明天再试";
				this.__doAction(null, "doback")
			} else if (t) {
				if ("401" == t)
					if ("10" == e.dt && "401" == t) i = p["40110"];
					else i = p["401"];
				else {
					if (e.dt) t = t + "-" + e.dt;
					i = p[t] || s._$getErrorTxt(e.ret)
				}
				this.__phoneError = i;
				this.__doAction(null, "doback")
			}
	};
	E.__dovfppc = function (e, t) {
		if (!this.__vfLock) {
			this.__vfLock = 1;
			this.__addOnlyPhone(e);
			a._$request("vfppc", e, this.__vfSuccess._$bind(this, t), this.__vfppcWarn._$bind(this), 1, this.__product)
		}
	};
	E.__setError = function (e) {
		s._$showError(null, e, "nerror")
	};
	E.__vfppcWarn = function (e) {
		this.__vfLock = 0;
		var t = e.ret;
		if (e)
			if ("494" == t || "493" == t) {
				if ("494" == t) {
					this.__ppcCos = e.coordinate || "";
					this.__ppcModule.__setCoord(this.__ppcCos)
				}
				this.__ppcModule.__clearInpt();
				this.__setError("验证码验证错误，请重新输入坐标对应数字")
			} else {
				if ("412" == t) this.__ppcError = "密保卡验证错误次数过多，请改天再试";
				else if ("492" == t) this.__ppcError = "帐号未绑定密保卡";
				else {
					var i = p[t] || s._$getErrorTxt(e.ret);
					if ("10" == e.dt && "401" == t) i = p["40110"];
					if ("454" === t) i = s._$createUnbindLink(i, this.__username);
					if ("452" === t) i = s._$createLogoutLink(i, this.__username);
					this.__ppcError = i
				}
				this.__doAction(null, "doback")
			}
	};
	E.__dovfotp = function (e, t) {
		if (!this.__vfLock) {
			this.__vfLock = 1;
			this.__addOnlyPhone(e);
			a._$request("vfotp", e, this.__vfSuccess._$bind(this, t), this.__vfotpWarn._$bind(this), 1, this.__product)
		}
	};
	E.__vfotpWarn = function (e) {
		this.__vfLock = 0;
		var t = e.ret,
			i;
		if (e)
			if ("480" == t) {
				this.__otpModule.__clearInpt();
				this.__setError("动态密码错误，请重试")
			} else {
				if ("412" == t) this.__otpError = "将军令验证错误次数过多，请改天再试";
				else if ("481" == t) this.__otpError = "尝试次数过多，请稍后再试";
				else if ("484" == t) this.__otpError = "帐号未绑定将军令";
				else {
					i = p[t] || s._$getErrorTxt(e.ret);
					if ("10" == e.dt && "401" == t) i = p["40110"];
					if ("454" === t) i = s._$createUnbindLink(i, this.__username);
					if ("452" === t) i = s._$createLogoutLink(i, this.__username);
					this.__otpError = i
				}
				this.__doAction(null, "doback")
			}
	};
	E.__doLogin = function () {
		var e = "-103";
		if ("-1" != this.__hasInit) {
			if ("0" == this.__hasInit) s._$showFail("-104");
			if (!s._$fail5check("maillogin"))
				if (!this.__doLoginLock) {
					this.__onDoLockLogin({
						noTxt: 1
					});
					this.__nameinput.value = s._$emailFilter(this.__nameinput.value);
					this.__loginModule._$stateOK(this.__doLoginCb._$bind(this))
				}
		} else s._$showFail(e, "登录")
	};
	E.__checkAiCapState = function () {
		var e = !0;
		if (6 === this.__capFlag) e = !!this.__loginModule._$getAiCapState();
		return e
	};
	E.__doLoginCb = function (e, t) {
		var i;
		if (this.__loginModule) {
			this.__pass = e;
			this.__errKey = t;
			if (e && this.__hasInit) {
				if (this.__needMailLoginClause && 0 === this.__mailLoginClauseOk) {
					this.__onUnLockLogin();
					var n = this.__options.mailloginclause.clauseErr;
					var a = n ? n : y.showText("您需要同意相关条款才能登录", this.enlang);
					s._$showError(101, a, "nerror");
					return
				}
				if (!this.__checkAiCapState()) {
					s._$removeError({
						name: "slide"
					}, "nerror");
					this.__loginModule._$doVerify();
					return
				}
				this.__onDoLockLogin();
				this.__doLoginReal.call(this)
			} else if (1 === this.__errMode) {
				this.__onUnLockLogin();
				this.__sendMsg({
					type: "loginstate",
					state: 0
				});
				if ("email" === t && !this.__nameinput.value) {
					var r = this.__onlyPhone ? y.showText("手机号输入有误", this.enlang) : y.showText("请输入帐号", this.enlang);
					s._$showError(this.__nameinput, r, "nerror")
				} else if ("password" === t && !this.__passwordinput.value) s._$showError(this.__passwordinput, y.showText("请输入密码", this.enlang), "nerror");
				else if ("tcheckcode" === t && !this.__checkcodeinput.value) s._$showError(this.__checkcodeinput, y.showText("请输入图片验证码", this.enlang), "nerror");
				else if ("slidecap" === t) {
					if (this.__loginModule) i = 2 == this.__loginModule.__slideTarget ? window._$capTxt1 : window._$capTxt2;
					if (this.__isPopAndSlide()) this.__showCheckCode({
						capFlag: this.__capFlag
					});
					else s._$showError({
						name: "slide"
					}, i, "nerror")
				}
			} else {
				this.__onUnLockLogin();
				this.__sendMsg({
					type: "loginstate",
					state: 0
				})
			}
		}
	};
	E.__doLoginReal = function () {
		if (this.__pass && this.__hasInit) {
			s._$timeCount("LOGIN_TIME");
			var e = this.__loginModule._$getValues(),
				t = {}, i = e[0].trim(),
				n = e[1];
			t.un = this.__domain ? s._$formatUn(i) + this.__domain : i;
			t.pw = MP.encrypt2(n);
			t.pd = this.__product;
			t.l = this.__unLoginChecked ? 1 : 0;
			t.d = this.__unLoginTime;
			t.t = (new Date).getTime();
			t.pkid = this.__promark;
			this.__username = t.un;
			this.__password = n;
			this.__safeLogin(t)
		}
	};
	E.__safeLogin = function () {
		var e = function (e) {
			var t = [],
				i = {};
			n._$forEach(e, function (e) {
				if (!i[e]) {
					i[e] = 1;
					t.push(e)
				}
			});
			return t
		};
		var t = function (t, i, n) {
			if (n) {
				var s = t.split("@")[1];
				i = i + (i ? "," : "") + s
			}
			i = i.replace("vip.188.com", "188.com");
			var a = i.split(",");
			a = e(a);
			return a.join(",")
		};
		return function (e, i) {
			e.domains = this.__domains || "";
			e.domains = t(e.un, e.domains, this.__autoSuffix);
			if (this.__loginModule && this.__password) this.__loginModule._$setPwd(this.__password);
			if (!i && this.__lazyCheck && 1 == this.__capFlag) {
				this.__dataTemp = e;
				this.__doLazyCheck()
			} else this.__getLoginTicket(e)
		}
	}();
	E.__isPopAndSlide = function () {
		return this.__isNewCapPopup && (4 == this.__capFlag || 5 == this.__capFlag)
	};
	E.__onSlideOk = function () {
		if (this.__isPopAndSlide()) this.__doLogin()
	};
	E.__doLazyCheck = function () {
		var e = this.__loginModule._$getSmsValue();
		if (!this.__checkSmsCodeLock) {
			this.__checkSmsCodeLock = 1;
			var t = this.__nameinput.value.trim();
			t = this.__domain ? s._$formatUn(t) + this.__domain : t;
			var i = {
				cap: e,
				pd: this.__product,
				pkid: this.__promark
			};
			i.un = t;
			this.__addOnlyPhone(i);
			a._$request("checkSmsCode", i, this.__cbSmsCode._$bind(this), this.__ckSmsCodeEx._$bind(this, "验证码输入错误"), 1, this.__product)
		}
	};
	E.__cbSmsCode = function () {
		this.__checkSmsCodeLock = 0;
		if (this.__dataTemp) this.__getLoginTicket(this.__dataTemp)
	};
	E.__ckSmsCodeEx = function (e, t) {
		this.__checkSmsCodeLock = 0;
		this.__onUnLockLogin();
		if (!s._$fail5("maillogin")) this.__loginModule.__ckSmsCodeEx(e, t)
	};
	E.__getLoginTicket = function (e) {
		if (!this.__getTkLock) {
			this.__watchmanFlushTime = (new Date).getTime();
			this.__watchmanToken = "";
			if (this.__needWatchman && window._$URS.wm) window._$URS.wm.getToken("dd0f8e95f1844a20a363b60685225af4", function (e) {
				this.__watchmanToken = e
			}._$bind(this));
			var t = {};
			t.un = e.un;
			t.pkid = this.__promark;
			t.pd = this.__product;
			this.__getTkLock = 1;
			this.__addOnlyPhone(t);
			a._$request("getLoginTicket", t, this.__gltSuccess._$bind(this, e), this.__gltWarn._$bind(this), 1, this.__product);
		}
	};
	E.__addOnlyPhone = function (e) {
		if (this.__onlyPhone) e.mbl = 1
	};
	E.__sendLogin = function (e) {
		if (this.__watchmanToken) e.clientToken = this.__watchmanToken;
		e.tk = this.__tk;
		e.pwdKeyUp = this.__pwdKeyUp || 0;
		this.__addOnlyPhone(e);
		if (window._$pathB) e.b = 1;
		if (window._$URSOPT.enlang) e.lang = parseInt(window._$URSOPT.enlang, 10);
		a._$request("safelogin", e, this.__loginSuccess._$bind(this), this.__cbWarn._$bind(this), 1, this.__product)
	};
	E.__gltSuccess = function (e, t) {
		var i;
		this.__getTkLock = 0;
		var n = t.ret;
		this.__tk = t.tk;
		if (201 == n)
			if (this.__needWatchman && "1" == this.__options.watchMan)
				if (this.__watchmanToken) this.__sendLogin(e);
				else this.__watchmanFlushStl = setInterval(function () {
					i = (new Date).getTime() - this.__watchmanFlushTime;
					if (this.__watchmanToken || i > 1e4) {
						this.__watchmanFlushStl = clearInterval(this.__watchmanFlushStl);
						this.__sendLogin(e)
					}
				}._$bind(this), 200);
			else this.__sendLogin(e);
		else {
			var a = y.showText(p[n], this.enlang) || s._$getErrorTxt(t.ret);
			s._$showError(null, a, "nerror");
			this.__onUnLockLogin()
		}
	};
	E.__gltWarn = function (e) {
		this.__sendMsg({
			type: "loginstate",
			state: 0
		});
		this.__onUnLockLogin();
		this.__getTkLock = 0;
		var t = e.ret || 0;
		var i = e.dt || "";
		var n = p[t] || s._$getErrorTxt(e.ret);
		if ("10" == i && "401" == t) n = p["40110"];
		_gaq.push(["_trackEvent", "登录结果", "登录失败", "【" + t + "-" + i + "】" + n]);
		if (this.__notCapCode(t)) s._$showError(null, n, "nerror")
	};
	E.__setLlpTime = function () {
		s._$showError(0, '已开启登录保护，请打开<a class="u-llp-color1" style="color:#2c85ff;" href="https://id.163.com/gj/?from=webzj" target="_blank">网易帐号管家</a>完成验证   <span class="u-llp-color2" style="color:#2c85ff;">' + this.__llpNumber + '</span>秒后超时。<a class="u-llp-color3" style="color:#2c85ff;" href="https://id.163.com/gj/faq/s/p_o.html?ct=1&from=webzj" target="_blank">无法收到验证消息?</a>', "nerror", 3)
	};
	E.__lockLoginState = function () {
		if (!this.__isAppSafe) {
			this.__isAppSafe = 1;
			this.__nameinput.disabled = !0;
			this.__passwordinput.disabled = !0;
			if (this.__checkcodeinput) this.__checkcodeinput.disabled = !0;
			if (this.__pwdtext) this.__pwdtext.disabled = !0;
			this.__onDoLockLogin({
				txt: "取消登录"
			});
			setTimeout(function () {
				this.__llpNumber = 120;
				this.__setLlpTime();
				this.__safeItl2 = clearInterval(this.__safeItl2);
				this.__safeItl = clearInterval(this.__safeItl);
				this.__safeItl2 = setInterval(this.__setSafeItl._$bind(this), S);
				this.__startllp = 0;
				this.__safeItl = setInterval(this.__doCheckLlp._$bind(this), k);
				t._$dataset(this.__loginBtn, "action", "dounlocklogin")
			}._$bind(this), 200)
		}
	};
	E.__setSafeItl = function () {
		this.__llpNumber--;
		if (this.__llpNumber < 0) this.__safeItl2 = clearInterval(this.__safeItl2);
		else this.__setLlpTime()
	};
	E.__doCheckLlp = function () {
		this.__startllp++;
		var e = this.__checkLlpTimeout();
		if (!e) {
			var t = {
				pd: this.__product,
				pkid: this.__promark,
				un: this.__username
			};
			if (s._$getSmState()) t.appUuid = this.__uuid;
			else t.uuid = this.__uuid;
			this.__addOnlyPhone(t);
			a._$request("llp", t, this.__llpOK._$bind(this), this.__llpFail._$bind(this), 1, this.__product)
		}
	};
	E.__checkLlpTimeout = function () {
		if (this.__startllp > 59) {
			this.__unLockLoginState(1);
			this.__hasllpErr = 1;
			s._$showError(null, "登录验证超时，请重新登录", "nerror", 2);
			return 1
		}
		return 0
	};
	E.__llpFail = function (e) {
		var t = e.ret;
		if ("401" != t)
			if ("446" != t) {
				if (t && "438" != t) {
					this.__unLockLoginState(1);
					var i = p[t] || s._$getErrorTxt(t);
					this.__hasllpErr = 1;
					s._$showError(null, i, "nerror")
				}
			} else {
				this.__unLockLoginState(1);
				this.__hasllpErr = 1;
				s._$showError(null, "网易帐号管家已拒绝本次登录", "nerror", 2)
			} else {
			this.__unLockLoginState(1);
			this.__hasllpErr = 1;
			s._$showError(null, "登录验证超时，请重新登录", "nerror", 2)
		}
	};
	E.__llpOK = function (e) {
		var t = e.ret;
		if ("201" == t) {
			this.__safeItl2 = clearInterval(this.__safeItl2);
			this.__safeItl = clearInterval(this.__safeItl);
			this.__loginSuccess(e)
		}
	};
	E.__unLockLoginState = function (e) {
		this.__safeItl2 = clearInterval(this.__safeItl2);
		this.__safeItl = clearInterval(this.__safeItl);
		this.__isAppSafe = 0;
		e = e || 0;
		this.__doBack(e);
		this.__onUnLockLogin();
		t._$dataset(this.__loginBtn, "action", "dologin")
	};
	E.__setDomainsOk = function (e) {
		if (!e.mode || !e.mode.mode && "0" != e.mode.mode)
			if (e.unprotectedGuide) {
				this.__onUnLockLogin();
				this.__showLeak(3)
			} else if (e.safeMobileGuide) {
				this.__onUnLockLogin();
				this.__showLeak(4, e)
			} else this.__setDomainsHasPathbAndOpd({
				type: "success",
				username: this.__username || "",
				k: this.__tempK
			});
		else {
			this.__onUnLockLogin();
			this.__showMode(e.mode)
		}
	};
	E.__loginSuccess = function (e) {
		this.__tempK = e && e.k || "";
		this.__tempData = e && e.data || "";
		if (e && "201" == e.ret && !e.nextUrls && !e.mode && !e.unprotectedGuide) this.__sendMsg({
			type: "loginstate",
			state: 1,
			username: this.__username
		});
		else this.__sendMsg({
			type: "loginstate",
			state: 0
		});
		this.__pwdKeyUp = 0;
		_gaq.push(["_trackEvent", "登录结果", "登录成功", "【登录成功】from:" + this.__product + ",domain:" + this.__username.substring(this.__username.indexOf("@"))]);
		var t = s._$timeCountEnd("LOGIN_TIME");
		if (t > 0) {
			_gaq.push(["_trackEvent", "登录效率", "耗时【" + 50 * Math.ceil(t / 50) + "ms】", "详细耗时【" + t + "ms】"]);
			t = -1
		}
		if (!this.__onlyPhone) c._$cookie("THE_LAST_LOGIN", {
			value: this.__username,
			expires: 30,
			path: "/"
		});
		if (e && e.nextUrls) this.__setDomainsHasPathbAndOpd({
			type: "fksuccess",
			username: this.__username || "",
			nextUrls: e.nextUrls
		}, e);
		else this.__setDomainsOk(e)
	};
	E.__doVerifyOk = function (e, t) {
		var i = {};
		if (!this.__doVfoLock) {
			this.__doVfoLock = 1;
			i.un = this.__username;
			i.pd = this.__product;
			i.pkid = this.__promark;
			i.mb = e;
			i.sms = t;
			this.__addOnlyPhone(i);
			a._$request("vfmbsms", i, this.__vfmbsmsOk._$bind(this), this.__vfmbsmsFail._$bind(this), 1, this.__product)
		}
	};
	E.__vfmbsmsOk = function () {
		var e = {};
		this.__doVfoLock = 0;
		e.un = this.__username;
		e.pw = MP.encrypt2(this.__password);
		e.pkid = this.__promark;
		e.pd = this.__product;
		e.l = this.__unLoginChecked ? 1 : 0;
		e.d = this.__unLoginTime;
		if (this.__verifyMobileUpSms) this.__verifyMobileUpSms.destroy();
		if (this.__verifyMobileModule) this.__verifyMobileModule = this.__verifyMobileModule._$recycle();
		this.__doAction(null, "doback", 1);
		this.__safeLogin(e, 1)
	};
	E.__vfmbsmsFail = function (e) {
		this.__doVfoLock = 0;
		var t = e.ret,
			i = e.dt || "",
			n;
		if (e)
			if ("401" == t && "09" == i) s._$showError(null, "手机号格式错误", "nerror");
			else if ("443" == t) {
				n = p[t] || s._$getErrorTxt(e.ret);
				s._$showError(null, n, "nerror")
			} else if ("412" == t) {
				if (this.__verifyMobileModule) this.__verifyMobileModule = this.__verifyMobileModule._$recycle();
				this.__doBack({
					errorTxt: "验证码错误次数过多，请明天再试"
				})
			} else {
				if ("10" == e.dt && "401" == t) t = "40110";
				n = p[t] || s._$getErrorTxt(e.ret);
				if (t) {
					if (this.__verifyMobileModule) this.__verifyMobileModule = this.__verifyMobileModule._$recycle();
					this.__doBack({
						errorTxt: n
					})
				}
			}
	};
	E.__getUnlockUrl2 = function () {
		var e = {
			username: this.__username,
			from: "webzjlogin"
		};
		var t = "m.reg.163.com";
		if (100 * Math.random() <= window._$KGCONFIG.guideId) t = "id.163.com/mail/mailaq";
		var i = "https://" + t + "/unlock.html?" + n._$object2query(e);
		var s = '该帐号已被锁定，请前往<a target="_blank" href="' + i + '" style="color:#4aafe9;text-decoration:underline;">帐号安全中心</a>申请解锁';
		if (1 == this.enlang) s = y.showText("该帐号已被锁定，请前往", 1) + '<a target="_blank" href="' + i + '" style="color:#4aafe9;text-decoration:underline;">' + y.showText("帐号安全中心", 1) + "</a>" + y.showText("申请解锁", 1);
		return s
	};
	E.__getUnlockUrl = function () {
		var e = {
			product: this.__options.product,
			zj_promark: this.__options.promark,
			username: this.__username,
			source: "zjlogin"
		};
		var t = "m.reg.163.com";
		if (100 * Math.random() <= window._$KGCONFIG.guideId) t = "id.163.com/mail/mailaq";
		var i = "https://" + t + "/stable.html?" + n._$object2query(e);
		var s = '当前登录环境有风险，<a class="u-unlock" style="text-decoration:underline;" href="' + i + '" target="_blank">请点击前往进行安全验证</a>';
		if (1 == this.enlang) s = y.showText("当前登录环境有风险", 1) + '，<a class="u-unlock" style="text-decoration:underline;" href="' + i + '" target="_blank">' + y.showText("请点击前往进行安全验证", 1) + "</a>";
		return s
	};
	E.__cbWarn = function (e) {
		this.__tempK = e && e.k || "";
		this.__tempData = e && e.data || "";
		var t, i;
		this.__sendMsg({
			type: "loginstate",
			state: 0
		});
		this.__pwdKeyUp = 0;
		this.__onUnLockLogin();
		var n = e.ret,
			r = e.pp || 0;
		if ("438" != n) {
			if ("408" == n) s._$showError(0, '已开启登录保护，请打开<a class="u-app-color" style="color:#2c85ff;" href="https://id.163.com/gj/?from=webzj" target="_blank">网易帐号管家</a>绑定帐号并重新登录验证', "nerror", 3);
			else if (e) {
				if (e.nextUrls) this.__setDomainsHasPathbAndOpd({
					type: "fksuccess",
					username: this.__username || "",
					nextUrls: e.nextUrls
				});
				if (e.mode && (e.mode.mode || "0" == e.mode.mode)) {
					this.__showMode(e.mode);
					return
				} else if ("421" == n) {
					this.__showLeak(5, e);
					return
				}
				if ("423" == n) {
					_gaq.push(["_trackEvent", "登录结果", "登录异常", "【423】风控帐号"]);
					this.__showLeak(1, e)
				} else if ("428" == n) {
					_gaq.push(["_trackEvent", "登录结果", "登录异常", "【428】标记帐号"]);
					this.__showLeak(2)
				} else if ("427" == n) {
					this.__showLeak(6, e);
					return
				} else if ("401" == n) {
					t = p[n] || s._$getErrorTxt(e.ret);
					if ("10" == e.dt) t = p["40110"];
					t = y.showText(t, this.enlang);
					_gaq.push(["_trackEvent", "登录结果", "登录失败", "【401-" + (e.dt || "00") + "】参数错误"]);
					s._$showError(null, t, "nerror")
				} else {
					if (e.dt) n = n + "-" + e.dt;
					var o = this.__loginModule._$getValues(),
						c = {}, d = o[0].trim(),
						_, l;
					if (r && ("429" == n || "412-01" == n || "413-01" == n || "413-03" == n || "414-01" == n || "417-01" == n || "418-01" == n || "419-01" == n || "419-02" == n || "405" == n)) {
						c.un = this.__domain ? s._$formatUn(d) + this.__domain : d;
						c.pd = this.__product;
						c.pkid = this.__promark;
						this.__addOnlyPhone(c);
						a._$request("getPP", c, this.__getPPSuccess._$bind(this, n), this.__getPPWarn._$bind(this, n), 1, this.__product)
					} else if (n) {
						t = y.showText(p[n], this.enlang) || s._$getErrorTxt(e.ret);
						if (e.guideFindPassword && "413-01" === n) {
							l = this.__username;
							_ = "https://reg.163.com/naq/findPassword?wbzj=1&username=" + encodeURIComponent(l) + "#/verifyAccount";
							t = '密码错误次数过多，请稍后再试或<a target="_blank" href="FINDPWDURL">找回密码？</a>'.replace("FINDPWDURL", _);
							if (1 == this.enlang) t = y.showText("密码错误次数过多，请稍后再试或", 1) + '<a target="_blank" href="FINDPWDURL">'.replace("FINDPWDURL", _) + y.showText("找回密码？", 1) + "</a>"
						}
						if ("602" === n) t = s._$createVipLink(t, e.sign);
						if ("454" === n) t = s._$createUnbindLink(t, this.__username);
						if ("452" === n) t = s._$createLogoutLink(t, this.__username);
						if (1 === this.__aqGuideFlag && "413" == n) {
							var u = this.__loginModule._$getValues()[0].trim();
							u = this.__domain ? s._$formatUn(u) + this.__domain : u;
							if (this.__pwdErrCountMap[u]) this.__pwdErrCountMap[u] = ++this.__pwdErrCountMap[u];
							else this.__pwdErrCountMap[u] = 1; if (this.__pwdErrCountMap[u] && this.__pwdErrCountMap[u] > 1) t = this.__getRepairGuide(u)
						}
						var f = 424 == n || 425 == n || 426 == n || 422 == n || 602 == n ? 2 : 0;
						if ("422" == n) t = this.__getUnlockUrl2();
						else if ("403" == n) t = this.__getUnlockUrl();
						else if (425 == n) {
							var h = s._$getCommonEmail(this.__username) || "https://hc.reg.163.com/webcomponentH5/doc.html?id=552&itemid=320";
							t = t.replace("#", function () {
								return h
							}._$bind(this))
						}
						if (this.__notCapCode(n)) s._$showError(null, t, "nerror", f);
						else if ("444" == n || "445" == n) s._$showError({
							name: "slide"
						}, t, "nerror", f);
						else if ("441" == n) s._$showError(this.__checkcodeinput, t, "nerror", f)
					}
				}
			}
			this.__capFlag = e.capFlag || this.__capFlag;
			if ("447" == n || 6 === this.__capFlag) {
				if ("447" == n) i = 0;
				else i = 1;
				this.__showCheckCode(e, i)
			} else if (this.__isNewCapPopup) {
				if ("441" == n || "444" == n || "445" == n) this.__showCheckCode(e);
				else if (1 == this.__capFlag) this.__showCheckCode(e);
				else if (4 == this.__capFlag || 5 == this.__capFlag) this.__loginModule._$setNeedCheckCode()
			} else this.__showCheckCode(e)
		} else {
			this.__uuid = e.uuid || 0;
			this.__lockLoginState()
		}
	};
	E.__notCapCode = function (e) {
		return n._$indexOf(["441", "444", "445", "447"], e) === -1
	};
	E.__getPPSuccess = function (e, i) {
		var n = i.ret;
		if (201 == n) {
			var a = i.yz;
			if (1 == a) {
				var r = i.mb;
				this.__showPhoneModule(r);
				t._$addClassName(this.__footer, "f-dn");
				this.__onpage = "pp_phone"
			} else if (2 == a) {
				this.__showOTPModule();
				t._$addClassName(this.__footer, "f-dn");
				this.__onpage = "pp_otp"
			} else if (3 == a) {
				this.__ppcCos = i.cos || "";
				this.__showPPCModule(this.__ppcCos);
				t._$addClassName(this.__footer, "f-dn");
				this.__onpage = "pp_ppc"
			} else if (4 == a) {
				this.__clearModule();
				if (i.receiveCode) {
					this.__vfmbNewUp = !0;
					this.__verifyMobileReceiveCode = i.receiveCode
				} else {
					this.__vfmbNewUp = !1;
					this.__verifyMobileReceiveCode = ""
				}
				this.__createVerifyMobileModule();
				this.__onpage = "pp_vmb"
			} else this.__getPPWarn(e, i);
			s._$resize()
		} else this.__getPPWarn(e, i)
	};
	E.__createVerifyMobileModule = function () {
		this.__verifyMobileModule = g._$$VerifyMobile._$allocate({
			opts: this.__options,
			vfmbNewUp: this.__vfmbNewUp,
			receiveCode: this.__verifyMobileReceiveCode || "",
			onlyPhone: this.__onlyPhone,
			parent: this.__cnt,
			un: this.__username,
			promark: this.__promark,
			product: this.__product,
			onhidefooter: this.__hideFooter._$bind(this),
			onback: this.__doBack._$bind(this),
			onVerifyOk: this.__doVerifyOk._$bind(this),
			onChangeToUpsms: this.__doChangeToMobileUpSms._$bind(this)
		})
	};
	E.__doChangeToMobileUpSms = function (e) {
		if (this.__verifyMobileModule) this.__verifyMobileModule = this.__verifyMobileModule._$recycle();
		this.__vfmbNewUp = e.vfmbNewUp || !1;
		this.__verifyMobileReceiveCode = e.receiveCode;
		this.__verifyMobileUpSms = new v({
			data: e
		});
		this.__verifyMobileUpSms.$on("changeToVerifyMobile", this.__changeToVerifyMobile._$bind(this));
		this.__verifyMobileUpSms.$on("onVerifyOk", this.__vfmbsmsOk._$bind(this));
		this.__verifyMobileUpSms.$on("onback", this.__doBack._$bind(this));
		this.__verifyMobileUpSms.$inject(this.__cnt)
	};
	E.__changeToVerifyMobile = function (e) {
		if (this.__verifyMobileUpSms) this.__verifyMobileUpSms.destroy();
		if (!this.__verifyMobileModule) {
			this.__createVerifyMobileModule();
			if (e.txt && !this.__vfmbNewUp) s._$showError(100, e.txt, "nerror")
		}
		s._$resize()
	};
	E.__getPPWarn = function (e, t) {
		var i = t.ret,
			n;
		if (434 == i || 435 == i || 436 == i || 437 == i || 452 == i || 453 == i || 454 == i) e = i;
		n = p[e] || s._$getErrorTxt(i);
		if ("401" == i && "10" == t.dt) n = p["40110"];
		if ("454" === i) n = s._$createUnbindLink(n, this.__username);
		if ("452" === i) n = s._$createLogoutLink(n, this.__username);
		s._$showError(null, n, "nerror", 0)
	};
	E.__showCheckCode = function (e, t) {
		var i;
		if (this.__loginModule)
			if (e) {
				if (e.capFlag) {
					e.ret = s._$getRetByCapFlag(e.capFlag);
					i = 1
				}
				if ("441" == e.ret) {
					this.__capFlag = 1;
					i = i || y.showText("请输入图片验证码", this.enlang);
					this.__loginModule.__ckSmsCodeEx(i, e)
				} else if ("444" == e.ret) {
					this.__capFlag = 4;
					i = i || window._$capTxt1;
					this.__loginModule.__ckSmsCodeEx(i, e)
				} else if ("445" == e.ret) {
					this.__capFlag = 5;
					i = i || window._$capTxt2;
					this.__loginModule.__ckSmsCodeEx(i, e)
				} else if ("447" == e.ret) {
					this.__capFlag = 6;
					i = i || window._$capTxt2;
					e.forceNoAuto = t;
					this.__loginModule.__ckSmsCodeEx(i, e)
				} else if (this.__loginModule.__needSlideCap || this.__loginModule.__needCheckCode) {
					var n = "44" + (this.__loginModule.__needSlideCap ? 2 == this.__loginModule.__slideTarget ? "4" : "5" : "1");
					i = 1;
					e = {
						ret: n
					};
					this.__loginModule.__ckSmsCodeEx(i, e)
				}
			}
	};
	E.__hideCheckCode = function () {
		this.__loginModule._$hideCheckCode()
	};
	E.__getCheckCode = function () {
		this.__loginModule._$getCheckCode()
	};
	E.__showPhoneModule = function (e) {
		var t = this.__loginModule._$getValues(),
			i = {}, n = t[0].trim();
		i.un = this.__domain ? s._$formatUn(n) + this.__domain : n;
		i.pd = this.__product;
		i.pkid = this.__promark;
		this.__clearModule();
		this.__createVerifyPhone(i, e)
	};
	E.__createVerifyPhone = function (e, t) {
		if (!this.__phoneModule) this.__phoneModule = _._$$Phone._$allocate({
			opts: this.__options,
			parent: this.__cnt,
			data: e,
			mb: t,
			doback: this.__doBack._$bind(this),
			onChangeToUpsms: this.__doChangeToPhoneUpsms._$bind(this, t, e)
		})
	};
	E.__doChangeToPhoneUpsms = function (e, t, i) {
		if (this.__phoneModule) this.__phoneModule = this.__phoneModule._$recycle();
		this.__verifyPhoneUpSms = new $({
			data: i
		});
		this.__verifyPhoneUpSms.$on("changeToVerifyPhone", this.__changeToVerifyPhone._$bind(this, e, t));
		this.__verifyPhoneUpSms.$on("onVerifyOk", this.__verifyPhoneUpSmsOk._$bind(this));
		this.__verifyPhoneUpSms.$on("onback", this.__doBack._$bind(this));
		this.__verifyPhoneUpSms.$inject(this.__cnt)
	};
	E.__verifyPhoneUpSmsOk = function () {
		var e = {};
		e.un = this.__username;
		e.pw = MP.encrypt2(this.__password);
		e.pkid = this.__promark;
		e.pd = this.__product;
		e.l = this.__unLoginChecked ? 1 : 0;
		e.d = this.__unLoginTime;
		this.__vfSuccess(e)
	};
	E.__changeToVerifyPhone = function (e, t, i) {
		if (this.__verifyPhoneUpSms) this.__verifyPhoneUpSms.destroy();
		if (!this.__phoneModule) {
			this.__createVerifyPhone(t, e);
			if (i.txt) s._$showError(100, i.txt, "nerror")
		}
		s._$resize()
	};
	E.__showOTPModule = function () {
		var e = this.__loginModule._$getValues(),
			t = {}, i = e[0].trim();
		t.un = this.__domain ? s._$formatUn(i) + this.__domain : i;
		t.pd = this.__product;
		t.pkid = this.__promark;
		this.__clearModule();
		if (!this.__otpModule) {
			var n = l._$$OTP._$allocate({
				parent: this.__cnt,
				data: t
			});
			this.__otpModule = n
		}
	};
	E.__showPPCModule = function (e) {
		var t = this.__loginModule._$getValues(),
			i = {}, n = t[0].trim();
		i.un = this.__domain ? s._$formatUn(n) + this.__domain : n;
		i.pd = this.__product;
		i.pkid = this.__promark;
		i.coord = e;
		this.__clearModule();
		if (!this.__ppcModule) {
			var a = u._$$PPC._$allocate({
				parent: this.__cnt,
				data: i
			});
			this.__ppcModule = a
		}
	};
	E.__doQrsetDomains = function (e) {
		e = e || {};
		if (e.needPathbAndOpd) this.__setDomainsHasPathbAndOpd(e);
		else this.__setDomainsNoPathbAndOpd(e)
	};
	E.__showQrcodeModule = function () {
		this.__clearModule();
		var e = t._$getByClassName(this.__box, "j-headimg")[0];
		if (!this.__qrcodeModule && "qrcode" != this.__onpage) {
			e.style.display = "none";
			this.__qrcodeModule = f._$$QrcodeManager._$allocate({
				fromModule: this.__moduleType,
				parent: this.__cnt,
				opts: this.__options,
				product: this.__product,
				prdomain: this.__domain,
				toolName: this.__toolName,
				toolUrl: this.__toolUrl,
				sendmsg: this.__doQrsetDomains._$bind(this)
			});
			this.__onpage = "qrcode";
			t._$addClassName(this.__qrm, "pc")
		} else {
			e.style.display = "block";
			this.__doBack(1);
			this.__onpage = "login";
			t._$delClassName(this.__qrm, "pc")
		}
	};
	E.__showOtpOrPPcError = function () {
		if (this.__otpError) {
			this.__errMsg = 1;
			s._$showError(null, this.__otpError, "nerror");
			this.__otpError = null;
			return 1
		}
		if (this.__ppcError) {
			this.__errMsg = 1;
			s._$showError(null, this.__ppcError, "nerror");
			this.__ppcError = null;
			return 1
		}
		if (this.__phoneError) {
			this.__errMsg = 1;
			s._$showError(null, this.__phoneError, "nerror");
			this.__phoneError = null;
			return 1
		}
	};
	E.__initFail = function (e, t) {
		var i = t && t.ret || "0";
		this.__hasInit = 0;
		if (!window._$URSOPT.from3Cdn)
			if (window._$needUrsBgp)
				if (!window._$BGP && ("0" == i || "-1" == i || "-2" == i)) {
					window._$BGP = 1;
					setTimeout(this._$doRefresh._$bind(this), 200);
					return
				}
		if ("-401" != i) {
			if (!this.__showOtpOrPPcError()) this.__showFail(i)
		} else {
			s._$showError(0, s._$get401Error("登录"), "nerror");
			window._$needCookieSet = 1
		}
	};
	E.__showLeak = function (e, t) {
		_gaq.push(["_trackEvent", "异常", "登录异常", "异常"]);
		this.__super(e, t);
		s._$resize()
	};
	E._$doToggleLock = function (e, i) {
		if (e) {
			t._$addClassName(this.__mainBtn, i);
			t._$dataset(this.__mainBtn, "lock", 1)
		} else {
			t._$delClassName(this.__mainBtn, i);
			t._$dataset(this.__mainBtn, "lock", 0)
		}
	};
	E.__doMbUnLogin = function () {
		this.__mbLoginModule._$doMbUnLogin()
	};
	E._$doLoginProxy = function () {
		var e = function (e, t) {
			this.__loginModule._$setUsername(e);
			this.__loginModule._$setPwd(t);
			this.__doAction(null, "dologin")
		};
		return function (i) {
			var n = i.username,
				s = i.pwd,
				a = i.defaultUnLogin,
				r = i.proxyModule;
			if ("mbunlogin" === r) this.__doMbUnLogin();
			else {
				this.__defaultUnLogin = a;
				this.__unLoginChecked = this.__defaultUnLogin;
				if (this.__unLoginChecked) t._$addClassName(t._$getByClassName(this.__box, "u-checkbox")[0], "u-checkbox-select");
				else t._$delClassName(t._$getByClassName(this.__box, "u-checkbox")[0], "u-checkbox-select"); if (this.__loginModule) e.call(this, n, s);
				else {
					this.__module = "goEmailLogin";
					this.__doBack();
					e.call(this, n, s)
				}
			}
		}
	}();
	E.__getRepairGuide = function (e) {
		e = encodeURIComponent(e);
		var t = o._$add('多次输入错误，是否申请修复密码 <a target="_blank" href="https://reg.163.com/naq/findPassword?username=${un}#/verifyAccount">修复</a>');
		if (1 == this.enlang) {
			var i = y.showText("多次输入错误，是否申请修复密码", 1) + '<a target="_blank" href="https://reg.163.com/naq/findPassword?username=${un}#/verifyAccount">' + y.showText("修复", 1) + "</a>";
			t = o._$add(i)
		}
		return o._$get(t, {
			un: e
		})
	};
	E.__setMailLoginClauseFail = function (e) {
		this.__mailLoginClauseOk = 0;
		t._$delClassName(e, "u-dl-agree-select")
	};
	E.__setMailLoginClauseOk = function (e) {
		this.__mailLoginClauseOk = 1;
		t._$addClassName(e, "u-dl-agree-select");
		s._$removeError2(101)
	};
	E.__setMailClause = function (e) {
		var i = t._$getByClassName(this.__box, "j-mail-clause-span")[0];
		if ("1" == e) this.__setMailLoginClauseOk(i);
		else this.__setMailLoginClauseFail(i)
	};
	E.__setMbClause = function (e) {
		if (this.__mbLoginModule) this.__mbLoginModule._$setMbClause(e)
	};
	E._$setLoginClause = function (e, t) {
		if (t) this.__setMbClause(e);
		else this.__setMailClause(e)
	}
}, "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "a4de926c2d79e8d8f856eaff4dac0f8b", "53c267efd983fb8c66cb645beead7a8d", "12c5dab742044e15807978f676f5c3fc", "bff3d86ec4ea91399919ee4963badfeb", "54120fa727d71cd38f3b1273d034afef", "858cadb3921bea0353a4bf7f1c9e7759", "2e90615631450f00881b76afff6bd63c", "08bf049f40f15439bfc7bac0801dd022", "1b8d69883f39aeaa23b0e322eab51b91", "be27b7248163984ec2f46cbffbbf3dab", "7b21e2d34151b2744c99076d5be5823a", "285e64765191768caf2cc6de0397e37c", "64e9a03fc7b8c800da6b65f5fae35bfc", "ef8017a163d39bd52dc4f8d2a3987619", "a878c0216188111f46d39b9df767b354", "d7b1af22875fe7b83dcda4008c6c6efa", "b88d7e82afb4d7879a79ca11de4cd6f0", "46a4de3a50f50a600950ca9cee88031e");
I$("15dadd8bbdea76cdae0add1f8dec1460", function (e, t, i, n, s, a, r, o, c, d, _, l, u, f, h, p, m, g, b) {
	var v, $, y = {
		email: /^[\w-\.]+@(?:[\w-]+\.)+[a-z]{2,6}$/i,
		sms: /^[0-9a-zA-Z]{4,6}$/,
		pwd: /^[0-9a-zA-Z]{6,16}$/,
		vip: /vip\.163\.com|vip\.126\.com|188\.com/
	}, C = [
		["@qq.com", "@sina.com", "@sina.cn", "@sohu.com", "@vip.qq.com", "@hotmail.com", "@gmail.com"],
		["@163.com", "@126.com", "@yeah.net", "@188.com", "@vip.163.com", "@vip.126.com"]
	],
		w = ["@188.com", "@vip.163.com", "@vip.126.com"],
		x = {
			email: 0,
			pwd: 0,
			sms: 0
		};
	p._$$Register = t._$klass();
	v = p._$$Register._$extend(f._$$Module);
	v.__checkSuffixs = function () {
		var e = C[1].join(","),
			t = this.__regDomainSuffixs.split(","),
			i = [];
		s._$forEach(t, function (t) {
			if (e.indexOf(t) >= 0) {
				var n = s._$indexOf(w, t);
				if (n >= 0 && !this.__opts.regDomainSuffixs) {
					t = "@163.com";
					i.push({
						domain: "@163.com",
						ishaoma: !0
					})
				} else i.push({
					domain: t
				})
			}
		}._$bind(this));
		return i
	};
	v.__init = function (e) {
		this.enlang = window._$URSOPT.enlang;
		this.hasRegFlag = !1;
		this.__setTimeoutList = {};
		this.__opts = e.opts || {};
		this.__imgRefreshTip = this.__opts.imgRefreshTip || 0;
		this.__regDomainSuffixs = this.__opts.regDomainSuffixs || C[1].join(",");
		this.__regDomainSuffixs = this.__checkSuffixs();
		this.__mailRegHasEye = this.__opts.mailRegHasEye || 0;
		this.__regCapLazyload = this.__opts.regCapLazyload || 0;
		this.__getInitState = e.getInitState;
		this.__placeholder = this.__opts.regPlaceholder || {};
		this.__preRegDisabled = this.__opts.preRegDisabled || 0;
		this.__hasIdCard = 0;
		this.__btnTxt = this.__opts.regText || "";
		this.__gotoLoginText = this.__opts.gotoLoginText || h.showText("去登录>>", this.enlang);
		this.__swidth = this.__opts.swidth || 320;
		this.__server = "captcha.reg.163.com/v2";
		if (this.__opts.productKey) this.__opts.productkey = this.__opts.productKey;
		this.__productkey = this.__opts.productkey;
		this.__hintTxt = this.__opts.hintTxt || h.showText("按住滑块，拖动完成上方拼图", this.enlang);
		this.__super(e)
	};
	v.__slideVerify = function (e) {
		e.value = e.validate;
		if (e && e.value) this._$verifyCap(e);
		else this.__cbVftcpEx()
	};
	v.__reset = function (e) {
		this.__promark = this.__opts.promark;
		this.__product = this.__opts.product;
		this.__single = this.__opts.single;
		this.__ipts = [];
		this.codeTryTime = 0;
		this.__super(e);
		this._$hideCheckCode()
	};
	v.__destroy = function () {
		this.__initSlideCap = null;
		var e = i._$get("VIP");
		if (e) e.style.display = "none";
		this.__super()
	};
	v.__initNode = function () {
		this.__super();
		this.__checkCode = i._$getByClassName(this.__body, "ckbox")[0];
		this.__slideCapBox = i._$getByClassName(this.__body, "slidebox")[0];
		this.__errorTip = i._$getByClassName(this.__body, "m-etbox")[0];
		this.__errorTipText = i._$getByClassName(this.__body, "ettext")[0];
		this.__getSmsCode = i._$getByClassName(this.__body, "getsmscode")[0];
		this.__lable = i._$getByClassName(this.__body, "u-label")[0];
		this.__cdImg = i._$getByClassName(this.__body, "ckimg")[0];
		this.__cklink = i._$getByClassName(this.__body, "j-cklink")[0];
		this.__mainBtn = i._$getByClassName(this.__body, "u-loginbtn")[0]
	};
	v.__initXGui = function () {
		var e = h.showText("下一步", this.enlang);
		if (this.__btnTxt) e = c._$HtmlEncode(this.__btnTxt);
		$ = a._$addNodeTemplate(r._$get("register-tmp", {
			btnTxt: e,
			gotoLoginText: this.__gotoLoginText,
			hasIdCard: this.__hasIdCard,
			imgRefreshTip: this.__imgRefreshTip,
			mailRegHasEye: this.__mailRegHasEye,
			isVersionFour: c._$isVersionFour(),
			mailDisabled: 1 == this.__preRegDisabled && this.__opts.preFilledMailReg,
			emailPlaceholder: h.showText("请输入邮箱地址", this.enlang),
			pwdPlaceholder: h.showText("8-16位密码，字母+数字", this.enlang),
			imgCodeTxt: h.showText("验证码", this.enlang),
			imgCodeRefresh: h.showText("点击刷新验证码", this.enlang),
			imgCodeGet: h.showText("点击获取验证码", this.enlang),
			imgPicGet: h.showText("点击刷新图片", this.enlang),
			errorManyTxt: h.showText("您密码错误次数过多，我们锁定了您的帐号，请您输入手机验证码解锁或十分钟后再试", this.enlang),
			agreeTxt: h.showText("我同意", this.enlang),
			andTxt: h.showText("和", this.enlang),
			emailAgree1: h.showText("《网易邮箱帐号服务条款》", this.enlang),
			emailAgree2: h.showText("《网易隐私政策》", this.enlang),
			capCodeTxt: h.showText("请输入验证码", this.enlang)
		}));
		this.__seed_html = $
	};
	v.__initEvent = function () {
		this.__inputs = i._$getByClassName(this.__body, "j-inputtext");
		this.__nameinput = this.__inputs[0];
		this.__passwordinput = this.__inputs[1];
		if (this.__hasIdCard) {
			this.__realnameinput = this.__inputs[2];
			this.__idcardinput = this.__inputs[3];
			this.__smscode = this.__inputs[4]
		} else this.__smscode = this.__inputs[2]; if (0 === this.__ipts.length) {
			this.__setPlaceHolder();
			s._$forEach(this.__inputs, function (e, t) {
				var i = {
					opts: this.__opts,
					node: e,
					form: this.__form,
					needClose: 1,
					onInput: this.__onInput._$bind(this),
					onfocus: this.__onFocus._$bind(this),
					onFocusNext: this.__onFocusNext._$bind(this),
					onClearInptTimeout: this.__onClearInptTimeout._$bind(this)
				};
				if (!t) {
					i.isUsername = 1;
					i.onstate = this.__onState._$bind(this)
				}
				if (1 == t) i.isPwd = 1;
				var n = d._$$Input._$allocate(i);
				this.__ipts.push(n);
				if (!t && this.__regDomainSuffixs && this.__regDomainSuffixs.length > 0) n._$setSuggest(this.__regDomainSuffixs)
			}._$bind(this))
		}
		var e = [
			[this.__cdImg, "click", this.__getImg._$bind(this)]
		];
		if (this.__cklink) e.push([this.__cklink, "click", this.__getImg._$bind(this)]);
		this.__doInitDomEvent(e);
		this.__emailFlag = 1
	};
	v.__onFocusNext = function () {
		this._stopEnter = 1;
		try {
			this.__passwordinput.focus()
		} catch (e) { }
	};
	v.__getIpt = function () {
		var e = this.__getIptI();
		return this.__ipts[e]
	};
	v.__getIptI = function () {
		if (this.__hasIdCard) return 4;
		else return 2
	};
	v.__onClearInptTimeout = function (e) {
		var t = e.name;
		if (this.__setTimeoutList["invalid" + t]) this.__setTimeoutList["invalid" + t] = clearTimeout(this.__setTimeoutList["invalid" + t]);
		if (this.__setTimeoutList["valid" + t]) this.__setTimeoutList["valid" + t] = clearTimeout(this.__setTimeoutList["valid" + t])
	};
	v.__onInput = function (e, t) {
		var i = n._$getElement(e) || e;
		if (this.__regCapLazyload)
			if ("" != i.value) this._$dispatchEvent("onRegCapLazyload");
		if (1 == t) this.__checkSmsCode();
		setTimeout(this.__checkNextBtn._$bind(this, e), 50)
	};
	v.__checkNextBtn = function () {
		var e = this.__vName();
		if (e) {
			var t = this.__nameinput.value.trim();
			if (t) c._$showError(this.__nameinput, "帐号格式错误", "nerror")
		}
		var i = this.__vPwd();
		var n = this.__vSms();
		var s = this.__vRealName();
		var a = this.__vIdCard();
		var r = this.__vSlide();
		if (!this.__needSlideCap && !this.__needCheckCode)
			if (this.__hasIdCard)
				if (!(e || i || s || a)) this._$dispatchEvent("ondisabled", 0);
				else this._$dispatchEvent("ondisabled", 1);
			else if (!e && !i) this._$dispatchEvent("ondisabled", 0);
			else this._$dispatchEvent("ondisabled", 1);
		else if (this.__needSlideCap)
			if (this.__hasIdCard)
				if (!(e || i || s || a || r)) this._$dispatchEvent("ondisabled", 0);
				else this._$dispatchEvent("ondisabled", 1);
			else if (!e && !i && !r) this._$dispatchEvent("ondisabled", 0);
			else this._$dispatchEvent("ondisabled", 1);
		else if (this.__needCheckCode)
			if (this.__hasIdCard)
				if (!(e || i || n || s || a)) this._$dispatchEvent("ondisabled", 0);
				else this._$dispatchEvent("ondisabled", 1);
			else if (!e && !i && !n) this._$dispatchEvent("ondisabled", 0);
			else this._$dispatchEvent("ondisabled", 1)
	};
	v.__vRealName = function () {
		var e = this.__realnameinput ? this.__realnameinput.value : "";
		e = e.trim();
		if (/^[\u4e00-\u9fa5|.]{1,20}$/.test(e)) return 0;
		else return 1
	};
	v.__vIdCard = function () {
		var e = this.__idcardinput ? this.__idcardinput.value : "";
		e = e.trim();
		if (c._$validateSecIdCard(e)) return 0;
		else return 1
	};
	v.__vName = function () {
		var e = this.__nameinput.value.trim();
		if (e) return 0;
		else return 1
	};
	v.__vPwd = function () {
		var e = this.__passwordinput.value.trim();
		if (e) return 0;
		else return 1
	};
	v.__vSms = function () {
		if (0 == this.__cf || 1 == this.__needSlideCap || 1 == this.__needAiCap) return 0;
		var e = this.__smscode.value.trim();
		if (e) return 0;
		else return 1
	};
	v.__checkSmsCode = function () {
		if (0 == this.__cf || 1 == this.__needSlideCap || 1 == this.__needAiCap) return 0;
		var e = this.__smscode.value.trim();
		if (y["sms"].test(e) && "-1" != x["sms"]) {
			if (this.__checkCapLock) return;
			this.__checkCapLock = 1;
			var t = {
				cap: e,
				channel: 2,
				un: this.__nameinput.value.trim() || "",
				pkid: this.__promark,
				pd: this.__product
			};
			_._$request("checkCaptcha", t, function () {
				this.__checkCapLock = 0;
				this.__checkCaptchaOk()
			}._$bind(this), this._$checkCaptchaException._$bind(this, "请输入正确的验证码"))
		}
	};
	v.__checkCaptchaOk = function () {
		c._$removeError(this.__smscode, "nerror");
		this.__smscode.disabled = !0;
		if (this.__hasIdCard) {
			i._$getByClassName(document, "u-tip")[4].style.display = "none";
			i._$getByClassName(document, "u-tip")[5].style.display = "block"
		} else {
			i._$getByClassName(document, "u-tip")[2].style.display = "none";
			i._$getByClassName(document, "u-tip")[3].style.display = "block"
		}
		i._$delClassName(i._$getByClassName(this.__body, "ckin")[0], "error-color");
		x["sms"] = -1
	};
	v._$checkCaptchaException = function (e, t) {
		this.__checkCapLock = 0;
		if ("107" == t.ret && "02" == t.dt) this.__checkCaptchaOk();
		else {
			if (c._$fail5("mailreg")) return;
			this.__resetCapType();
			if ("111" == t.ret) {
				this.__needAiCap = 1;
				this.__autoVerify = !0;
				this._$refreshCheckCode(t.ret)
			} else if ("108" == t.ret) {
				this.__needCheckCode = 1;
				this._$refreshCheckCode(t.ret);
				if (e) c._$showError(this.__smscode, e, "nerror")
			} else if ("109" == t.ret || "110" == t.ret) {
				this.__needSlideCap = 1;
				this._$refreshCheckCode(t.ret);
				if (e) {
					e = "109" == t.ret ? window._$capTxt1 : window._$capTxt2;
					c._$showError(null, e, "nerror")
				}
			} else {
				this.__needCheckCode = 1;
				this._$showCheckCode();
				if ("401" == t.ret && "02" == t.dt) {
					e = l["40102"];
					c._$showError(null, e, "nerror")
				} else if (1 == x["email"] || 1 == x["pwd"]) c._$showError2(this.__smscode, "", "nerror", 1);
				else {
					e = l[t.ret] || c._$getErrorTxt(t.ret) || "验证码输入错误";
					c._$showError(this.__smscode, e, "nerror")
				}
			}
		}
	};
	v.__onFocus = function (e) {
		if ("email" == e.name) {
			i._$get("VIP").style.display = "none";
			this.hasRegFlag = !1
		}
		c._$removeError(e, "nerror")
	};
	v.__initForm = function () {
		if (!this.__form) this.__form = o._$$WebForm._$allocate({
			form: "register-form",
			oninvalid: function (e) {
				var t = "请输入",
					s = e.code,
					a = n._$getElement(e),
					r = a.name;
				if (!window.outlinkflag) {
					if ("checkcode" == r && i._$hasClassName(this.__checkCode, "f-dn") && this.__needSlideCap) e.ignore = 1;
					if (this.__setTimeoutList["valid" + r]) this.__setTimeoutList["valid" + r] = clearTimeout(this.__setTimeoutList["valid" + r]);
					this.__setTimeoutList["invalid" + r] = setTimeout(function (n) {
						var r = n;
						if ("checkcode" != r || !i._$hasClassName(this.__checkCode, "f-dn"))
							if ("slidecap" != r || !this.__needSlideCap) {
								if (s == -1) {
									if ("email" == r) t += this.__emailFlag ? "手机号或帐号" : "帐号";
									if ("password" == r) t += "密码";
									if ("checkcode" == r) t = "请输入图片验证码"
								} else if (s == -4 || s == -2 || s == -3) {
									t = "格式错误";
									if ("email" == r) {
										var o = this.__nameinput.value.trim();
										o = o.split("@")[0];
										t = this.__checkEmail(o, 1)
									}
									if ("password" == r) t = "8-16位大小写字母、数字、符号3种以上组合";
									if ("checkcode" == r) t = "请输入图片验证码"
								}
								if ("slidecap" == r && !this.__needSlideCap) this.__states[r] = 0;
								else this.__states[r] = 1; if (s != -1) {
									if ("email" == r) x["email"] = 1;
									else if ("password" == r) {
										if (1 == x["email"]) {
											c._$showError2(a, t, "nerror", 1);
											return
										}
										x["pwd"] = 1
									} else if ("checkcode" == r) {
										if (1 == x["email"] || 1 == x["pwd"]) {
											c._$showError2(a, t, "nerror", 1);
											return
										}
										x["sms"] = 1
									}
									c._$showError(a, t, "nerror")
								} else if ("email" == r) x["email"] = 0;
								else if ("password" == r) x["pwd"] = 0;
								else if ("checkcode" == r) x["sms"] = 0;
								else if ("realname" == r) x["realname"] = 0;
								else if ("idcard" == r) x["idcard"] = 0
							} else if (!this.__vSlide()) this.__states["slidecap"] = 0;
							else this.__states["slidecap"] = 1;
						else {
							if (this.__needSlideCap) e.ignore = 1;
							this.__states[r] = 0
						}
					}._$bind(this, r), 100);
					e.stopped = !0
				} else if (!this.__refocus && 1 == window.outlinkflag) this.__refocus = setTimeout(function () {
					this.__refocus = clearTimeout(this.__refocus);
					try {
						a.focus()
					} catch (e) { }
				}._$bind(this), 200)
			}._$bind(this),
			onvalid: function (e) {
				var t = n._$getElement(e),
					i = t.name;
				var s;
				if (this.__setTimeoutList["invalid" + i]) this.__setTimeoutList["invalid" + i] = clearTimeout(this.__setTimeoutList["invalid" + i]);
				this.__setTimeoutList["valid" + i] = setTimeout(function (e) {
					var i = e;
					this.__states[i] = 0;
					if ("email" == i);
					else if ("password" == i) {
						s = this.__checkPwd(t.value);
						if (s) {
							this.__states[i] = 1;
							if (1 == x["email"]) c._$showError2(t, s, "nerror", 1);
							else {
								x["pwd"] = 1;
								c._$showError(t, s, "nerror")
							}
							_gaq.push(["_trackEvent", "注册步骤", "【2】密码输入", "密码输入失败，err：" + s]);
							return
						} else if (1 == x["pwd"]) {
							c._$removeError(t, "nerror");
							x["pwd"] = 0;
							_gaq.push(["_trackEvent", "注册步骤", "【2】密码输入", "密码输入成功，长度：" + (t.value || "").length])
						}
					} else if ("realname" == i) {
						var n = "请输入正确的姓名";
						if (this.__vRealName()) {
							this.__states[i] = 1;
							if (1 == x["email"] || 1 == x["pwd"]) c._$showError2(t, n, "nerror", 1);
							else {
								x["realname"] = 1;
								c._$showError(t, n, "nerror")
							}
						} else if (1 == x["realname"]) {
							c._$removeError(t, "nerror");
							x["realname"] = 0
						}
					} else if ("idcard" == i) {
						var a = "请输入正确的身份证";
						if (this.__vIdCard()) {
							this.__states[i] = 1;
							if (1 == x["email"] || 1 == x["pwd"] || 1 == x["realname"]) c._$showError2(t, a, "nerror", 1);
							else {
								x["idcard"] = 1;
								c._$showError(t, a, "nerror")
							}
						} else if (1 == x["idcard"]) {
							c._$removeError(t, "nerror");
							x["idcard"] = 0
						}
					} else if ("checkcode" == i) {
						var r = this.__checkSms(t.value);
						if (r && 1 == x["sms"]) c._$removeError(t, "nerror")
					}
					if ("email" != i);
					else {
						var o = this.__onState(2);
						if (0 === o) {
							x["email"] = 1;
							this.__states[i] = 1
						}
					}
				}._$bind(this, i), 100);
				e.stopped = !0
			}._$bind(this)
		})
	};
	v.__checkPwd = function (e) {
		var t = this.__nameinput.value.trim() || "";
		var i = this.__opts.zfPwd || 0;
		return c._$checkPwd(e, t, i)
	};
	v.__checkSms = function () {
		return 1
	};
	v.__checkEmail = function (e, t) {
		var i, n, s, a;
		if (e.indexOf("@") >= 0) {
			n = e.split("@");
			a = n.length - 1;
			s = n[a];
			s = -1 - s.length;
			e = e.slice(0, s)
		}
		if (c._$isBadNetease(e)) {
			if (!/^[a-zA-Z]/.test(e)) i = l.CHECK_URS_BAD_BEGIN;
			else if (!/([a-zA-Z]|\d)$/.test(e)) i = l.CHECK_URS_BAD_END;
			else if (e.length < 6 || e.length > 18) i = l.CHECK_URS_BAD_LENGTH;
			else i = l.CHECK_URS_BAD_ILLEGAL; if (i && !t) {
				this.__states["email"] = 1;
				c._$showError(this.__nameinput, i, "nerror");
				return i
			} else return i
		} else return !1
	};
	v.__popVip = function (t) {
		var n = e._$is("desktop");
		var s = n ? "//reg.vip.163.com/register.m?from=ursreg" : "//vip.163.com/webapp/#page=choose&domain=163?from=ursreg";
		if ("188.com" === t.toLocaleLowerCase()) s = n ? "//reg.188.com/register.m?from=ursreg" : "//vip.163.com/webapp/#page=choose&domain=188?from=ursreg";
		else if ("vip.126.com" === t.toLocaleLowerCase()) s = n ? "//reg.vip.126.com/register.m?from=ursreg" : "//vip.163.com/webapp/#page=choose&domain=126?from=ursreg";
		i._$get("a-vip").setAttribute("href", s);
		var a = i._$get("VIP");
		if (!i._$hasClassName(a, "fur-vip")) i._$addClassName(a, "fur-vip");
		a.style.display = "block";
		try {
			a.focus()
		} catch (r) { }
	};
	v.__onState = function (e, t) {
		var i = this.__nameinput.value.trim(),
			n = i.split("@"),
			s = n[0],
			a = n.length - 1,
			r = n[a],
			o, d;
		r = r.toLocaleLowerCase();
		if (!window.outlinkflag || "mustCheck" == e) {
			if (e)
				if ("vip.188.com" != r && "188.com" != r && "vip.163.com" != r && "vip.126.com" != r) {
					if (!y.email.test(i)) {
						if (r && c._$isNeteaseEmail(r)) d = this.__checkEmail(i);
						else d = l.CHECK_URS_BAD_ILLEGAL;
						c._$showError(this.__nameinput, d, "nerror");
						return 0
					}
					if (c._$isNeteaseEmail(r)) {
						o = this.__checkEmail(s, 1);
						if (o) {
							if (this.__unFmtErrWGdHm) {
								if (c._$isHaomaEmail(i)) {
									o += '，<a href="//haoma.163.com/?from=zj" target="_blank">尝试注册</a>当前帐号？';
									setTimeout(function () {
										c._$showError(this.__nameinput, o, "nerror", 2)
									}._$bind(this), 200)
								} else c._$showError(this.__nameinput, o, "nerror");
								return 0
							} else c._$showError(this.__nameinput, o, "nerror");
							return 0
						}
					}
					if ("corp.netease.com" == r) {
						c._$showError(this.__nameinput, "不支持该类型邮箱注册", "nerror");
						return 0
					}
					this.__username = i;
					if (e) {
						if ("noClear" != e && 2 != e) c._$removeError(this.__nameinput, "nerror");
						if (2 != e) this._$doCheckName()
					}
				} else this.__popVip(r)
		} else if (!this.__refocus && 1 == window.outlinkflag) this.__refocus = setTimeout(function () {
			this.__refocus = clearTimeout(this.__refocus);
			try {
				t.focus()
			} catch (e) { }
		}._$bind(this), 200)
	};
	v._$doCheckName = function () {
		if (this.__getInitState()) {
			var e = {
				un: this.__username,
				channel: 2,
				pkid: this.__promark,
				pd: this.__product
			};
			this._$dispatchEvent("collect");
			_._$request("checkName", e, function (e) {
				if ("102" != e.ret) {
					x["email"] = 0;
					this._$dispatchEvent("canpass", 1)
				} else this._$checkNameException(e)
			}._$bind(this), this._$checkNameException._$bind(this))
		}
	};
	v._$setCFModule = function (e) {
		this.__cf = e
	};
	v._$checkNameException = function (e) {
		var t, i, n = e.ret;
		if ("106" == n && !MP.TICKET) {
			i = "EXCEPTION_CHECK_NAME_" + n;
			t = l[i] || l[n] || c._$getErrorTxt(e.ret)
		} else {
			i = "EXCEPTION_CHECK_NAME_" + n;
			var s = e.dt;
			if ("02" == s && "401" == n) i = "40102";
			if ("407" === n) this.hasRegFlag = !0;
			t = l[i] || l[n] || c._$getErrorTxt(e.ret)
		} if (t)
			if ("4504" === n) c._$showError(null, t, "nerror");
			else c._$showError(this.__nameinput, t, "nerror");
		x["email"] = 1;
		this._$dispatchEvent("canpass", 0);
		this._$dispatchEvent("setmbreged", 0)
	};
	v._$checkEndException = function (e) {
		var t, i, n = e.ret;
		if ("106" == n && !MP.TICKET) {
			i = "EXCEPTION_CHECK_NAME_" + n;
			t = l[i] || l[n] || c._$getErrorTxt(e.ret)
		} else {
			i = "EXCEPTION_GET_TICKET_" + n;
			var s = e.dt;
			if ("02" == s && "401" == n) i = "40102";
			t = l[i] || l[n] || c._$getErrorTxt(e.ret)
		} if (t)
			if ("4502" === n && this.__nameinput) c._$showError(this.__nameinput, t, "nerror");
			else c._$showError(null, t, "nerror")
	};
	v._$fastRegException = function (e, t, i) {
		var n, s, a, r, o;
		if (i) o = i.cf;
		if (t) a = e;
		else {
			n = e.ret;
			s = "EXCEPTION_FAST_REG_" + n;
			var d = e.dt;
			if ("02" == d && "401" == n) s = "40102";
			a = l[s] || l[n] || c._$getErrorTxt(e.ret)
		} if ("107" == n || "108" == n || "109" == n || "110" == n || "111" == n) {
			r = c._$getCfByCode(n);
			if ("111" === n)
				if (o === r) a = c._$getAiBtnTxt();
				else a = "";
			var _ = this.__getAutoFlag(n);
			this._$dispatchEvent("onback", {
				cf: r,
				errorTxt: a,
				noRefresh: 1,
				noAuto: _
			})
		} else if (("4502" === e.ret || "604" == e.ret) && this.__nameinput) c._$showError(this.__nameinput, a, "nerror");
		else c._$showError(null, a, "nerror")
	};
	v.__getAutoFlag = function (e) {
		return "107" === e || "111" === e ? 1 : 0
	};
	v._$showCheckCode = function () {
		this.__cf = 1;
		this._$hideCheckCode();
		this.__states["checkcode"] = 1;
		this.__needCheckCode = 1;
		i._$delClassName(this.__checkCode, "f-dn");
		this.__getImg();
		this._$dispatchEvent("ondisabled", 1);
		this.__checkNextBtn();
		setTimeout(function () {
			c._$resize()
		}, 200)
	};
	v.__getImg = function () {
		var e = this.__getIpt();
		var t = this.__getIptI();
		e.__input.disabled = !1;
		e._$onClear();
		x["sms"] = 0;
		i._$getByClassName(document, "u-tip")[t + 1].style.display = "none";
		this.__cdImg.src = MP["getCaptcha"]()
	};
	v._$verifyCap = function (e) {
		var t = {}, i;
		t.capkey = this.__productkey;
		t.un = this.__nameinput.value.trim() || "";
		t.pkid = this.__promark;
		t.pd = this.__product;
		t = this.__newVerifyCap(t, e);
		if (4 === this.__slideTarget) {
			i = "regvfscp";
			_._$request(i, t, this.__cbVfscp._$bind(this), this.__cbVfscpEx._$bind(this))
		} else {
			i = 2 == this.__slideTarget ? "regvftcp" : "regvfccp";
			_._$request(i, t, this.__cbVftcp._$bind(this), this.__cbVftcpExCb._$bind(this))
		}
	};
	v.__cbVftcpExCb = function (e) {
		if (e && "107" == e.ret && "02" == e.dt) this.__cbVftcp();
		else {
			if (c._$fail5("mailreg")) return;
			this.__cbVftcpEx(e)
		}
	};
	v.__cbVfscp = function () {
		this.__unlockVfcap("ainounlock");
		this.__clearSlideErr();
		this.__slideCapLock = 0;
		this.__aicapstate = !0;
		this._$dispatchEvent("onSlideOk", "autoreg")
	};
	v.__unLockReg = function () {
		this._$dispatchEvent("onUnLockReg")
	};
	v.__doLockReg = function () {
		this._$dispatchEvent("onDoLockReg")
	};
	v.__cbVfscpEx = function (e) {
		var t;
		this.__unlockVfcap();
		if (e) {
			if (c._$fail5("mailreg")) return;
			t = e.ret;
			if (s._$indexOf(["108", "109", "110"], t) !== -1) this.__changeCapTypeByCode(t, 1);
			else if ("111" == t) this.__aiSlideErrShow(1);
			else {
				this.__autoVerify = !1;
				this.__slideErrShowDefAndRefresh(t, {
					isreg: 1,
					dt: e.dt
				})
			}
			this.__slideErrShow(t)
		} else this.__aiSlideErrShow(1)
	};
	v.__cbVftcpEx = function (e, t, i) {
		var n;
		if (e && "107" == e.ret && "02" == e.dt) this.__cbVftcp();
		else if (e) {
			n = e.ret;
			if (s._$indexOf(["108", "109", "110", "111"], n) !== -1) {
				this.__autoVerify = "111" == n ? !0 : !1;
				if (i) this.__autoVerify = !1;
				this.__changeCapTypeByCode(n, 1)
			} else this.__slideErrShowDefAndRefresh(n, {
				noshow: t,
				isreg: 1,
				dt: e.dt
			});
			this.__slideErrShow(n, t)
		} else this.__showSlideDefErrTxt()
	};
	v._$getErrorFlag = function () {
		return x
	};
	v._$focusHelper = function () {
		try {
			this.__nameinput.focus()
		} catch (e) { }
	};
	v._$setPreFillMail = function () {
		if (this.__opts.preFilledMailReg) {
			this.__ipts[0]._$hideLabel();
			this.__nameinput.value = this.__opts.preFilledMailReg;
			setTimeout(function () {
				this.__onState("mustCheck")
			}._$bind(this), 500)
		}
	};
	v._$setUnFmtErrWGdHm = function (e) {
		this.__unFmtErrWGdHm = e || 0
	};
	v._$getHasRegFlag = function () {
		if (this.hasRegFlag) {
			var e = "EXCEPTION_CHECK_NAME_407";
			var t = l[e];
			c._$showError(this.__nameinput, t, "nerror")
		}
		return this.hasRegFlag
	}
}, "a878c0216188111f46d39b9df767b354", "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "12c5dab742044e15807978f676f5c3fc", "bff3d86ec4ea91399919ee4963badfeb", "20a53a78a8e132ee6b99f8e237d5d673", "a4de926c2d79e8d8f856eaff4dac0f8b", "d311422206de0b8499264964e9de72a8", "53c267efd983fb8c66cb645beead7a8d", "dde0e6b40e64b3f022ca4ad9ab8b1a9c", "b819242a9b3581fcd37cdd1531beab1d", "ef328f7ca95c06d61f18782bd6ac5271", "46a4de3a50f50a600950ca9cee88031e");
I$("aa4a3754f70e632205fd7e90aecf3619", function (e, t, i, n, s, a, r, o, c, d, _, l, u, f, h, p, m, g, b, v, $) {
	var y, C, w = 0;
	g._$$BindMobile = e._$klass();
	y = g._$$BindMobile._$extend(r._$$GetSmsBase);
	y.__init = function (e) {
		this.enlang = window._$URSOPT.enlang;
		this.__isMailReg = !0;
		this.__super(e)
	};
	y.__destroy = function (e) {
		if (this.__newAiSlideCap) this.__newAiSlideCap = this.__newAiSlideCap.destroy();
		if (this.__newAiSlideCapReg) this.__newAiSlideCapReg = this.__newAiSlideCapReg.destroy();
		this.__super(e)
	};
	y.__reset = function (e) {
		this.__super(e);
		this.__isRegBindMb = 1;
		this.__getDomains = e.domains || "";
		this.__ticket = e.ticket;
		this.__password = e.pwd;
		this.__allowGlobalMb = e.allowGlobalMb;
		this.__setAllowGlobalMb()
	};
	y.__setAllowGlobalMb = function (e) {
		if (this.__allowGlobalMb)
			if (c._$isVersionFour()) {
				t._$addClassName(this.__cgpBtn, "f-dn");
				t._$setStyle(this.__cgpBtn, "display", "none");
				this.__toItl0();
				this.__country.setCountry()
			} else {
				t._$delClassName(this.__cgpBtn, "f-dn");
				t._$setStyle(this.__cgpBtn, "display", "inline")
			} else {
			t._$addClassName(this.__cgpBtn, "f-dn");
			t._$setStyle(this.__cgpBtn, "display", "none");
			this._$toItl1(this.__afterShowErr._$bind(this, e))
		}
	};
	y.__afterShowErr = function (e) {
		if (e) c._$showError(null, e, "nerror")
	};
	y.__initXGui = function () {
		C = s._$addNodeTemplate(a._$get("register-phone-tmp", {
			getsmstxt: window._$URSOPT.getsmstxt,
			smsbindTip: m.showText("本次注册需要短信验证，请按以下提示操作", this.enlang),
			mobileTxt: m.showText("请输入手机号", this.enlang),
			toItlMobileTxt: m.showText("切换到国际手机", this.enlang),
			smsTxt: m.showText("请输入短信验证码", this.enlang),
			regTxt: m.showText("注&nbsp;&nbsp;册", this.enlang),
			excepTxt: m.showText("您的操作存在异常，请您进行验证后继续注册", this.enlang)
		}));
		this.__seed_html = C
	};
	y.__doSendSms = function () {
		if (!this.__sendSmsLock) {
			c._$removeError2();
			if (this.__phonecode) c._$removeError(this.__phonecode, "nerror");
			var e = this.__getPhone();
			var t = {
				mb: e,
				tk: MP.TICKET,
				channel: 2,
				un: this.__un,
				pd: this.__product,
				pkid: this.__promark
			};
			this.__sendSmsLock = 1;
			this.__lockSendSmsBtn();
			d._$request("getMailSms", t, this.__getSms._$bind(this), this.__getSmsException._$bind(this))
		}
	};
	y._$fastRegException = function (e) {
		var t = e.ret,
			i, s = "EXCEPTION_REG_MOB_" + t;
		var a = e.dt,
			r;
		if ("02" != a || "401" != t) {
			i = l[s] || l[t] || c._$getErrorTxt(e.ret);
			if (!("111" === t || this.__newAiSlideCapReg && "107" == t))
				if (n._$indexOf(["407", "107", "108", "109", "110", "4502", "604"], t) !== -1) {
					r = c._$getCfByCode(t);
					var o = this.__getAutoFlag(t);
					this._$dispatchEvent("onback", {
						cf: r,
						errorTxt: i,
						noRefresh: 1,
						noAuto: o,
						realRes: e
					})
				} else if ("605" == t) {
					var o = this.__getAutoFlag(t);
					this._$dispatchEvent("onback", {
						cf: null,
						errorTxt: i,
						noRefresh: 1,
						noAuto: o,
						realRes: e
					})
				} else c._$showError(null, i, "nerror");
			else this.__showAiCapReg()
		} else {
			s = "40102";
			i = l[s] || l[t] || c._$getErrorTxt(e.ret);
			this._$dispatchEvent("onback", {
				cf: void 0,
				errorTxt: i,
				noRefresh: 1,
				noAuto: 1
			})
		}
	};
	y.__getAutoFlag = function (e) {
		return n._$indexOf(["407", "107", "4502", "604", "605"], e) !== -1 ? 1 : 0
	};
	y.__getSmsException = function (e) {
		var t = this.__getPhone();
		this.__sendSms2Lock = 0;
		this.__sendSmsLock = 0;
		this._mob_can_pass = !0;
		this.__unLockSendSmsBtn();
		var i, s, a, r = e.ret,
			o = e.dt,
			d;
		if ("416" != r) {
			w = 0;
			if (n._$indexOf(["405", "412", "413", "415", "414", "461", "462"], r) === -1)
				if (!("111" === r || this.__newAiSlideCap && "107" == r)) {
					if (n._$indexOf(["107", "108", "109", "110", "4502", "604"], r) !== -1) {
						s = "EXCEPTION_GET_SMS_" + r;
						i = l[s] || l[r] || c._$getErrorTxt(e.ret);
						d = c._$getCfByCode(r);
						var _ = this.__getAutoFlag(r);
						this._$dispatchEvent("onback", {
							cf: d,
							errorTxt: i,
							noRefresh: 1,
							noAuto: _,
							realRes: e
						});
						return
					} else if ("605" === r) {
						s = "EXCEPTION_GET_SMS_" + r;
						i = l[s] || l[r] || c._$getErrorTxt(e.ret);
						var _ = this.__getAutoFlag(r);
						this._$dispatchEvent("onback", {
							cf: null,
							errorTxt: i,
							noRefresh: 1,
							noAuto: _,
							realRes: e
						});
						return
					}
					s = "EXCEPTION_GET_SMS_" + r;
					if ("411" == r)
						if ("02" == o) this._$dispatchEvent("onChangeToUpsms", {
							mobile: this.__getPhone(),
							receiveCode: e.receiveCode,
							un: this.__un,
							promark: this.__promark,
							product: this.__product,
							ticket: this.__ticket,
							password: this.__password,
							domains: this.__getDomains
						});
						else {
							a = e.receiveCode.split(",");
							i = '请您编辑短信"<strong class="msg">' + a[0] + '</strong>",发送到<strong class="phone">' + a[1] + "</strong> 获取验证码，短信费用由运营商收取";
							if (1 == this.enlang) i = m.showText("请您编辑短信", 1) + '"<strong class="msg">' + a[0] + '</strong>",' + m.showText("发送到", 1) + '<strong class="phone">' + a[1] + "</strong> " + m.showText("获取验证码，短信费用由运营商收取", 1);
							c._$showError(null, i, "nerror", 2)
						} else {
						if ("401" === r && ("01" === o || "02" === o)) {
							s = r + o;
							i = l[s] || l[r] || c._$getErrorTxt(e.ret);
							this._$dispatchEvent("onback", {
								cf: void 0,
								errorTxt: i,
								noRefresh: 1,
								noAuto: 1
							});
							return
						}
						if ("401" == r && "13" == o) {
							s += o;
							if (c._$startZero(t)) s += "_2"
						}
						i = l[s] || l[r] || c._$getErrorTxt(e.ret);
						c._$showError(null, i, "nerror")
					}
				} else this.__showAiCap();
			else {
				s = "EXCEPTION_GET_SMS_" + r;
				i = l[s] || l[r] || c._$getErrorTxt(e.ret);
				if ("405" === r) {
					this.__allowGlobalMb = !1;
					this.__setAllowGlobalMb(i);
					return
				}
				c._$showError(null, i, "nerror")
			}
		} else {
			w++;
			s = "EXCEPTION_GET_SMS_" + r;
			i = l[s] || l[r] || c._$getErrorTxt(e.ret);
			d = e.cf;
			if (6 === d) {
				if (w > 5) return;
				this.__showAiCap(!0)
			} else this._$dispatchEvent("onback", {
				cf: d,
				errorTxt: i,
				noRefresh: 1,
				noAuto: 1
			})
		}
	};
	y.__showAiCap = function (e) {
		if (!this.__newAiSlideCap) this._$getAiSlideCap();
		else {
			var t = c._$getAiBtnTxt();
			c._$showError(null, t, "nerror");
			this.__aicapstate = !1;
			var i = !!e;
			this.__newAiSlideCap._$refresh(i)
		}
	};
	y.__showAiCapReg = function () {
		if (!this.__newAiSlideCapReg) this._$getAiSlideCap("fromreg");
		else {
			var e = c._$getAiBtnTxt();
			c._$showError(null, e, "nerror");
			this.__aicapstatereg = !1;
			this.__newAiSlideCapReg._$refresh(!1)
		}
	};
	y.__doLockVerify = function (e) {
		if ("fromreg" === e) this.__lockRegBtn();
		else this.__lockSendSmsBtn()
	};
	y._$getAiSlideCap = function (e) {
		var t = {
			captchaType: 4,
			customStyles: this.__opts.customStyles || {},
			capPadding: this.__opts.capPadding || "",
			capBarHeight: this.__opts.capBarHeight || "",
			lang: this.__opts.lang,
			verifyCallback: this.__slideVerify._$bind(this),
			initCallback: v,
			initErrorHandler: this.__initErrorHandler._$bind(this),
			autoVerify: !0,
			capFlag: 6,
			doAutoVerify: this.__doAutoVerify._$bind(this),
			doLockVerify: this.__doLockVerify._$bind(this, e),
			onClose: this.__onAiClose._$bind(this)
		};
		if ("fromreg" === e) {
			this.__aifromreg = !0;
			c._$setAiBtn(this.__doreg);
			if (this.__newAiSlideCapReg) this.__newAiSlideCapReg = this.__newAiSlideCapReg.destroy();
			this.__aicapstatereg = !1;
			this.__newAiSlideCapReg = new p({
				data: t
			})
		} else {
			this.__aifromreg = !1;
			c._$setAiBtn(this.__getSmsCode);
			if (this.__newAiSlideCap) this.__newAiSlideCap = this.__newAiSlideCap.destroy();
			this.__aicapstate = !1;
			this.__newAiSlideCap = new p({
				data: t
			})
		}
	};
	y.__lockRegBtn = function () {
		if (c._$isVersionFour() && this.__doreg) {
			this.__lockRegBtnState = !0;
			this.__doreg.innerHTML = m.showText("正在注册...", this.enlang)
		}
	};
	y.__unLockRegBtn = function () {
		if (c._$isVersionFour() && this.__doreg) {
			this.__lockRegBtnState = !1;
			this.__doreg.innerHTML = m.showText("注&nbsp;&nbsp;册", this.enlang)
		}
	};
	y.__slideVerify = function (e) {
		if (e && e.validate) this._$verifyCap(e);
		else this.__unLockBtn()
	};
	y._$verifyCap = function (e) {
		var t = {}, i = "regvfscp";
		t.un = this.__un;
		t.pkid = this.__promark;
		t.pd = this.__product;
		t.cap = e.validate;
		d._$request(i, t, this.__cbVfscp._$bind(this), this.__cbVfscpEx._$bind(this))
	};
	y.__cbVfscp = function () {
		this.__unLockBtn();
		if (this.__aifromreg) {
			this.__aicapstatereg = !0;
			this.__doReg()
		} else {
			this.__aicapstate = !0;
			this.__onSendSms("forcesend")
		}
	};
	y.__cbVfscpEx = function (e) {
		var t, i, s, a, r;
		this.__unLockBtn();
		if (e) {
			if (c._$fail5("mailregbdmb")) return;
			t = e.ret;
			r = e.dt;
			if (n._$indexOf(["108", "109", "110"], t) !== -1) {
				a = "EXCEPTION_GET_SMS_" + t;
				s = l[a] || l[t] || c._$getErrorTxt(t);
				i = c._$getCfByCode(t);
				this._$dispatchEvent("onback", {
					cf: i,
					errorTxt: s,
					noRefresh: 1
				})
			} else {
				if (this.__aifromreg) this.__showAiCapReg();
				else this.__showAiCap();
				s = l[t] || c._$getErrorTxt(t);
				if ("401" === t && "02" === r) s = l["40102"];
				if ("111" === t) s = c._$getAiBtnTxt();
				c._$showError(null, s, "nerror")
			}
		}
	};
	y.__initErrorHandler = function () {
		this.__unLockBtn();
		c._$showError(null, "加载失败，请刷新页面重试", "nerror")
	};
	y.__doAutoVerify = function () {
		this.__unLockBtn();
		if (this.__aifromreg) this.__doReg();
		else this.__onSendSms("forcesend")
	};
	y.__onAiClose = function () {
		this.__unLockBtn()
	};
	y.__unLockBtn = function () {
		if (this.__aifromreg) this.__unLockRegBtn();
		else this.__unLockSendSmsBtn()
	}
}, "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "12c5dab742044e15807978f676f5c3fc", "bff3d86ec4ea91399919ee4963badfeb", "ab30b27a7bf1539f01a51c9a74708788", "20a53a78a8e132ee6b99f8e237d5d673", "a4de926c2d79e8d8f856eaff4dac0f8b", "53c267efd983fb8c66cb645beead7a8d", "d311422206de0b8499264964e9de72a8", "dde0e6b40e64b3f022ca4ad9ab8b1a9c", "b819242a9b3581fcd37cdd1531beab1d", "23e5675795b942746eac3b34e36aa849", "facc340e79eadf3a9f6671c0e71dbe82", "41ef7aa93d23fe74cbf747774554e6ce", "46a4de3a50f50a600950ca9cee88031e");
I$("f62d95b7dd837d3793385fbc9d26ed44", '<div class="m-container">\n    <!--帐号-->\n    <mninput mbCanLoginGuide="{mbCanLoginGuide}"  mbOnlyItl="{mbOnlyItl}" mbNeedItl="{mbNeedItl}" needEye="{needEye}" ref=mninput on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} product="{product}" host="{host}" promark="{promark}" placeholder="{mobilePlaceholder.regmobile}" on-mbhasitl={this.mbHasItl($event)} disabled="{preRegDisabled}"/>\n    {#if mbnewupopen}\n        <!--密码-->\n        {#if !mbNoPwd}\n        <div class="fur-change-email"></div>\n        <mpinput needSafePwd={needSafePwd} eyeActive={eyeActive} needEye="{needEye}" tabindex=2 tabIndex=2 ref=mpinput on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} on-pwdOtherCheck={this.pwdOtherCheck($event)} placeholder="{mobilePlaceholder.regpwd}" needCheck=1 />\n        {/if}\n    {/if}\n    <!-- 验证码 -->\n    {#if hasImgCap}\n    <captcha tabIndex=-1 imgRefreshTip="{imgRefreshTip}" needEye="{needEye}" isReg=1 ref=captcha on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} product="{product}" promark="{promark}" placeholder="{mobilePlaceholder.regcap}"  />\n    {/if}\n    <!-- 滑块验证码 -->\n    {#if hasSlide}\n    <slidecap ignore="0" slideTarget={slideTarget} capBarHeight={capBarHeight} capPadding={capPadding} customStyles="{customStyles}" lang="{lang}" mode="{mode}" version="{version}" tabIndex=-1 ref=slidecap on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} server="{server}" productkey="{productkey}" swidth="{swidth}" product="{product}" promark="{promark}" hintTxt="{hintTxt}" channel="{channel}" on-slideOk="{this.onSlideOk($event)}" />\n    {/if}\n    {#if hasAiCap}\n    <slidecap ignore="1" forceNoAuto={forceNoAuto} isAiCap={hasAiCap} slideTarget={slideTarget} capBarHeight={capBarHeight} capPadding={capPadding} customStyles="{customStyles}" lang="{lang}" mode="{mode}" version="{version}" tabIndex=-1 ref=slidecap on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} server="{server}" productkey="{productkey}" swidth="{swidth}" product="{product}" promark="{promark}" hintTxt="{hintTxt}" channel="{channel}" on-slideOk="{this.onSlideOk($event)}" on-lockVerify="{this.onLockVerify($event)}" on-unLockVerify="{this.onUnLockVerify($event)}" />\n    {/if}\n    <!-- 短信 -->\n    <smsinput getsmstxt={getsmstxt} smsbtnclazz="{smsbtnclazz}" needEye="{needEye}" tabIndex=3 ref=smsinput on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} on-sendSms={this.sendSms($event)} product="{product}" pkid="{pkid}" promark="{promark}" placeholder="{mobilePlaceholder.regsms}" />\n    {#if !mbnewupopen}\n        <div class="fur-change-email"></div>\n        {#if !mbNoPwd}\n        <mpinput needSafePwd={needSafePwd} eyeActive={eyeActive} needEye="{needEye}" tabindex=2 tabIndex=2 ref=mpinput on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} on-pwdOtherCheck={this.pwdOtherCheck($event)} placeholder="{mobilePlaceholder.regpwd}" needCheck=1 />\n        {/if}\n    {/if}\n    <!-- 错误提示 -->\n    <div class="m-nerror f-dn" id="nerror"></div>\n    <!-- 注册协议 -->\n    {#if isVersionFour}\n    <div class="fur-item fur-agree fur-agree-4">\n        <label>\n            {#if needRegAgreeMb}\n            <span {#if ckboxOk}class="u-zc-agree u-zc-agree-select"{#else}class="u-zc-agree"{/if}><input on-click={this.doCheckBox()} type="checkbox" class="zc-un-login" />\n            </span>{/if} 我同意\n            {#if newCDN === 1 && mbRegTermsList && mbRegTermsList.length>0}\n                {#list mbRegTermsList as item}\n                    <a href="{item.url}" target="_blank" tabindex="-1" data-outlink="1">{item.name}</a>\n                    {#if item_index<mbRegTermsList.length-1} 和 {/if}\n                {/list}\n            {#else}\n                <a href="{mblink1}" target="_blank" tabindex="-1" data-outlink="1">{mbagree1}</a> 和 <a href="{mblink2}" target="_blank" tabindex="-1" data-outlink="1">{mbagree2}</a>\n            {/if}\n        </label>\n    </div>\n    {/if}\n    <!-- 登录按钮 -->\n    <div class="f-cb loginbox">\n        <a ref=regBtn id="submitBtn" on-click={this.doReg()} {#if mbRegLock}class="u-loginbtn btncolor tabfocus u-loginbtn-gary"{#else}class="u-loginbtn btncolor tabfocus"{/if} tabindex="8">{regMbTxt}</a>\n    </div>\n    <!-- 注册协议 -->\n    {#if !isVersionFour}\n    <div class="fur-item fur-agree">\n        <label>\n            {#if needRegAgreeMb}\n            <span {#if ckboxOk}class="u-zc-agree u-zc-agree-select"{#else}class="u-zc-agree"{/if}><input on-click={this.doCheckBox()} type="checkbox" class="zc-un-login" />\n            </span>{/if} 我同意\n            {#if newCDN === 1 && mbRegTermsList && mbRegTermsList.length>0}\n                {#list mbRegTermsList as item}\n                    <a href="{item.url}" target="_blank" tabindex="-1" data-outlink="1">{item.name}</a>\n                    {#if item_index<mbRegTermsList.length-1} 和 {/if}\n                {/list}\n            {#else}\n                <a href="{mblink1}" target="_blank" tabindex="-1" data-outlink="1">{mbagree1}</a> 和 <a href="{mblink2}" target="_blank" tabindex="-1" data-outlink="1">{mbagree2}</a>\n            {/if}\n        </label>\n    </div>\n    {/if}\n    <div class="f-cb unandmailbox">\n        <!-- 免登复选框 -->\n        {#if !single}\n        <div class="m-unlogin m-unlogin2">\n            <a ref=gotoLoginTextMb class="u-regbtn bgcolor tabfocus u-regbtn2" href="javascript:void(0);" data-outlink="2" target="_self" tabindex="11" data-action="changepage" data-mdtype="1" data-log="mbRegGoLogin1">{gotoLoginTextMb}</a>\n        </div>\n        {/if}\n        {#if mailreghook}\n        <div class="u-mailreghook-box">\n            <a target="_blank" href={mailreghooklink} {#if !mailreghooklink}data-action="goEmailReg"{/if} class="mailreghook">{mailreghook}</a>\n        </div>\n        {/if}\n    </div>\n</div>\n');
I$("08fae8cb6c83128fc48ff497777614a9", function (e, t, i, n, s, a, r, o, c, d, _, l, u, f, h, p, m, g) {
	var b = n.caluseErrIndex,
		v = "8-16位密码，字母+数字";
	var $ = s.extend({
		template: l,
		data: {
			mbnewupopen: !0,
			ckboxOk: !1,
			mailreghooklink: "https://zc.reg.163.com/regInitialized?pd=urszjmailreg&pkid=qzgcGfv&pkht=id.163.com",
			module: "reg",
			warn: "",
			unLoginText: "几天免登录",
			gotoRegText: "注册手机帐号",
			channel: 3,
			mbagree1: "《服务条款》",
			mblink1: "//hc.reg.163.com/iTerm/doc.html?id=542",
			mbagree2: "《网易隐私政策》",
			mblink2: "//hc.reg.163.com/iTerm/doc.html?id=437",
			preRegDisabled: !1
		},
		config: function (e) {
			if (!/^http[s]?:/i.test(e.mailreghooklink)) e.mailreghooklink = "https://zc.reg.163.com/regInitialized?pd=urszjmailreg&pkid=qzgcGfv&pkht=id.163.com";
			t._$merge(this.data, e || {});
			if (this.data.mailreghook) n._$useDefaultRegMailLog(e.mailreghooklink, "3");
			if (!this.data.mobilePlaceholder) {
				this.data.mobilePlaceholder = {};
				this.data.mobilePlaceholder.regpwd = v
			} else if (t._$isObject(this.data.mobilePlaceholder) && !this.data.mobilePlaceholder.regpwd) try {
				this.data.mobilePlaceholder.regpwd = v
			} catch (i) { }
			var s = window._$URSCDNCF;
			if (s && s.mbnewupcloselist)
				if (s.mbnewupcloselist.indexOf(this.data.product) > -1) this.data.mbnewupopen = !1;
			if (this.data.mbnewupopen) this.ORDERMAP = ["mninput", "mpinput", "smsinput"];
			else this.ORDERMAP = ["mninput", "smsinput", "mpinput"]; if (this.data.needRegAgreeMb) this.data.ckboxOk = !0;
			if (1 == this.data.needRegAgreeMbNoChecked) this.data.ckboxOk = !1;
			if (this.data.needRegAgreeMb && void 0 !== e.rmbclause) this.data.ckboxOk = e.rmbclause;
			if (1 == this.data.preRegDisabled && this.data.preFilledMobileReg) this.data.preRegDisabled = !0;
			else this.data.preRegDisabled = !1;
			var a = this.data.mbRegTermsList;
			if (a && a.length > 0) t._$forEach(a, function (e) {
				if (n._$notURL(e.url)) e.url = ""
			}._$bind(this));
			if (n._$notURL(this.data.mblink1)) this.data.mblink1 = "";
			if (n._$notURL(this.data.mblink2)) this.data.mblink2 = "";
			this.supr(e);
			var r;
			if (this.data.mbCanLoginGuide) {
				r = '<a class="u-goToMbLogin" style="color:#4cb5ff;" href="javascript:void(0);" data-action="changepage" data-mdtype="1" data-log="mbRegGoLogin2">登录</a>';
				u["mb-reg-sm-407"] = "该帐号已注册,请直接" + r;
				u["mb-reg-vfsms-407"] = "该帐号已注册,请直接" + r
			}
			this.__regLockTxtMb = this.data.lockConfig && this.data.lockConfig.regLockTxtMb || "正在注册..."
		},
		init: function (e) {
			this.supr(e)
		},
		destroy: function (e) {
			try {
				window._$URS.saveTempMobile = this.getUn(1)
			} catch (t) { }
			this.supr(e)
		},
		iniSuccess: function (e) {
			f._$cookie("ursactivetest", {
				value: 1,
				expires: 1,
				path: "/"
			});
			f._$cookie("ursactivetest", {
				value: 1,
				expires: -1,
				path: "/"
			});
			if (this.$refs) {
				var t = this.data.preFilledMobileReg;
				this._$doToggleRegLockMb();
				this.supr(e, 1);
				if (this.$refs && this.$refs.mninput && t) {
					this.$refs.mninput._$setValue(t);
					setTimeout(function () {
						this.$refs.mninput.onBlur()
					}._$bind(this), 500)
				}
				this.data.initSuccess = 1
			}
		},
		tryGetIdAgain: function () {
			setTimeout(function () {
				MP.getId("yd_" + this.data.promark, function (e) {
					if ("null" == e || "" == e) {
						this._$doShowError({
							tabIndex: -1,
							str: n._$get401Error("注册"),
							node: "nerror"
						});
						var t = "//dl.reg.163.com/UA1435545636633/__utm.gif?from=webzjreginitlog&ua=" + encodeURIComponent(navigator.userAgent) + "&promark=" + encodeURIComponent(this.data.promark) + "&type=2&id=" + e;
						n._$sendLog(t)
					}
				}._$bind(this))
			}._$bind(this), 10)
		},
		doInit: function () {
			this._trySetArea();
			if (!n._$isDes()) this._trySetMobile();
			var e = {};
			e.pd = this.data.product;
			e.pkid = this.data.promark;
			e.pkht = this.data.host || "";
			this.data.initSuccess = 0;
			_._$request("mb-reg-ini", e, this.iniSuccess._$bind(this), this.iniError._$bind(this, "mb-reg-ini-"))
		},
		_trySetArea: function () {
			var e = f._$cookie("THE_LAST_LOGIN_MOBILE");
			if (window._$URSOPT.rmbArea && e.indexOf("-") !== -1 && !window._$URSOPT.firstArea && !this.data.preFilledMobileReg) this.supr(e)
		},
		autoLogin: function (e) {
			this._$setDomainsNoPathBAndOpd({
				type: "register-success",
				username: this.rmbMobile || "",
				nextUrls: e.nextUrls,
				isReg: 1
			})
		},
		regSuccess: function (e) {
			if (this.$refs.gotoLoginTextMb) {
				f._$cookie("regmbcookiename", {
					value: this.rmbMobile,
					path: "/"
				});
				f._$cookie("THE_LAST_LOGIN_MOBILE", {
					value: this.rmbMobile,
					path: "/",
					expires: 30
				})
			}
			this.autoLogin(e)
		},
		__doSendLog: function (e) {
			var t, i;
			if (this.data.mbCanLoginGuide && "407" == e) {
				i = this.$refs.mninput._$getValue().trim();
				t = "//dl.reg.163.com/UA1435545636633/__utm.gif?log=" + encodeURIComponent("mbRegGoLogin0") + "&ssn=" + encodeURIComponent(i) + "&promark=" + encodeURIComponent(window._$PKID);
				n._$sendLog(t)
			}
		},
		regError: function (e) {
			this.doUnlockReg();
			var i = -1,
				n = "mb-reg-vfsms-",
				s = e.ret;
			this.__doSendLog(s);
			if ("401" == s && t._$indexOf(["13", "20"], e.dt) === -1) e.ret = n + s;
			else e.ret = n + s + (e.dt || ""); if ("407" === s || "4503" === s) {
				this.$refs.mninput._$setHasError();
				i = 1
			}
			this.$update();
			this.onShowErr(e, i)
		},
		pwdOtherCheck: function (e) {
			if (this.$refs.mpinput) {
				var t = this.$refs.mpinput;
				var i = this.$refs.mninput._$getValue().trim();
				var s = this.data.zfPwd || 0;
				var a = n._$checkPwd(e, i, s);
				if (a) t._$showErrorFromParent(a)
			}
		},
		__checkInitOk: function () {
			var e = !0;
			if (this.data.initSuccess === -1) {
				n._$showFail("-104");
				e = !1
			} else if (0 === this.data.initSuccess) {
				this.doShowInitFail("注册");
				e = !1
			}
			return e
		},
		doReg: function () {
			if (!this.data.mbRegLock) {
				if (this.__checkInitOk())
					if (!this.checkForm()) {
						if (this.data.needRegAgreeMb && !this.data.ckboxOk) {
							this._$doShowError({
								tabIndex: b,
								str: "您需要同意相关条款才能注册",
								node: "nerror"
							});
							return
						}
						var e = {}, t = this.data.regDomains || "",
							i = this.data.regCookieDomain || "";
						var s = this.$refs.mninput._$getValue().trim();
						if (n._$getSmState()) e.un = s;
						else e.mb = s;
						e.sms = this.$refs.smsinput._$getValue().trim();
						if (this.$refs.mpinput) e.pw = MP.encrypt(this.$refs.mpinput._$getValue(), s);
						e.pkid = this.data.promark;
						e.pd = this.data.product;
						if (t) t += i ? "," + i : "";
						else t = i;
						e.domains = t;
						if (this.__doRegLock) return;
						this.doLockReg();
						this.rmbMobile = s;
						_._$request("mb-reg-vfsms", e, this.regSuccess._$bind(this), this.regError._$bind(this))
					}
			} else this._$postMessage({
				type: "lockMbRegState",
				value: this.data.mbRegLock
			})
		},
		doLockReg: function () {
			this.__doRegLock = 1;
			this.__regBtn = this.$refs.regBtn;
			this.__regBtnTxt = "string" == typeof this.__regBtn.textContent ? this.__regBtn.textContent : this.__regBtn.innerText;
			this.__regBtn.innerHTML = n._$HtmlEncode(this.__regLockTxtMb)
		},
		doUnlockReg: function () {
			this.__doRegLock = 0;
			if (this.__regBtn && this.__regBtnTxt) this.__regBtn.innerHTML = n._$HtmlEncode(this.__regBtnTxt)
		},
		getSmsFail: function (e) {
			var i = e.ret,
				n = -1,
				s, a = "mb-reg-sm-",
				r = e.dt || "";
			this.unLockSendSms();
			this.__doSendLog(i);
			if (!this.checkCapByCode(i, a, "isreg")) {
				if (411 == i) {
					var o = e.receiveCode.split(",");
					if ("02" === r) {
						var c = {
							isup: !0,
							mobile: this.$refs.mninput._$getValue().trim(),
							receiveCode: o,
							capFlag: this.__capFlag || "",
							ckboxOk: this.data.ckboxOk
						};
						if (!this.data.mbNoPwd) c.rmbpw = this.$refs.mpinput._$getValue();
						if (this.data.needRegAgreeMb) c.rmbclause = this.data.ckboxOk;
						this.$emit("changeModule", c);
						return
					} else {
						s = 2;
						u["mb-reg-sm-411"] = '请您编辑短信<strong class="msg">' + o[0] + '</strong>发送到<strong class="phone">' + o[1] + "</strong> 获取验证码，短信费用由运营商收取";
						this.$refs.smsinput.onClearInputPuer()
					}
				}
				if (420 == i || 422 == i || 602 == i) {
					if (422 == i || 602 == i) s = 2;
					n = 1
				}
				if ("401" == i && t._$indexOf(["13", "20"], r) === -1) e.ret = a + i;
				else {
					if ("107" == i && "00" == r && this.data.hasSlide) e.dt = 2 == this.$refs.captcha._$getCt() ? "04" : "05";
					e.ret = a + i + r
				} if (t._$indexOf(["407", "4503"], i) !== -1) {
					this.$refs.mninput._$setHasError();
					n = 1
				}
				this.onShowErr(e, n, s)
			}
		},
		__checkPwdNotOk: function () {
			var e = !1;
			var t = this.$refs.mpinput._$emptyCheck();
			if (t) {
				e = !0;
				return e
			}
			this.$refs.mpinput._$doOtherCheck();
			if (this.$refs.mpinput._$hasError()) e = !0;
			return e
		},
		sendSms: function () {
			if (this.__checkInitOk())
				if (!this.__checkMbNotOk())
					if (!this.__fail5check())
						if (!(this.data.mbnewupopen && this.$refs.mpinput && this.__checkPwdNotOk()))
							if (!this.__checkCapStateNotOk()) {
								var e = {};
								e = this.__getCapforData(e);
								e.un = this.$refs.mninput._$getValue().trim();
								if (!this.checkLockSendSms()) _._$request("mb-reg-sm", e, this.getSmsSuccess._$bind(this), this.getSmsFail._$bind(this))
							}
		},
		_$doToggleRegLockMb: function () {
			this.data.mbRegLock = window._$mbRegLock;
			this.$update()
		},
		doFocusMb: function () {
			this.$refs.mninput._$focusHelper();
			this._$resize()
		},
		mbHasItl: function (e) {
			if (window._$URSOPT.mbNoPwd && n._$isVersionFour()) {
				this.data.mbNoPwd = !e;
				this.$update();
				setTimeout(function () {
					this._$resize()
				}._$bind(this), 10)
			}
		},
		_$setMb: function (e) {
			this.$refs.mninput._$setValue(e)
		},
		_$setPwd: function (e) {
			this.$refs.mpinput._$setValue(e)
		},
		_$safekeyboardMsg: function (e) {
			if (e.doCheck) {
				this.$refs.mpinput.setCloseOver(0);
				this.$refs.mpinput.onBlur("safePwdCheck")
			} else {
				var t = e.value || "";
				this.$refs.mpinput._$setValue(t)
			}
		}
	});
	$.component("mninput", a);
	$.component("captcha", o);
	$.component("smsinput", r);
	$.component("slidecap", c);
	$.component("mpinput", d);
	return $
}, "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a4de926c2d79e8d8f856eaff4dac0f8b", "1598780dd8cf6308c2b48cd5a9c0d07f", "5019a97f49cafc5e6cc6da470054165c", "2c9966685c48aa132d904e29fe50ab0b", "5312c1874a87427492f714754fc9318b", "1135272f84d09a1f87f596dd6a5819ae", "7ac9d06f817adcdab54eea77e53ebe6a", "53c267efd983fb8c66cb645beead7a8d", "f62d95b7dd837d3793385fbc9d26ed44", "d6e36b6b1f96e15e42725a59e7acd142", "54120fa727d71cd38f3b1273d034afef");
I$("f3171e31fd7f05504130680dab7749d3", '<form id="login-form" class="regManager"></form>');
I$("4cd9f6120a8859908cbda0ff3cfa5163", '<div class="m-container">\n    <!--帐号-->\n    <mninput ish5upsms={ish5upsms} mbCanLoginGuide="{mbCanLoginGuide}"  mbOnlyItl="{mbOnlyItl}" mbNeedItl="{mbNeedItl}" needEye="{needEye}" ref=mninput on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} product="{product}" host="{host}" promark="{promark}" placeholder="" on-changemobile={this.onChangeMobile()} disabled="disabled" fromsmsup=true on-shake="{this.onShake()}" needEye=0 changeItlTxt="{changeItlTxt}" isshake=true shakecss="{shakecss}" />\n    <h5upsms ish5upsms={ish5upsms} ref=h5upsms receiveCode={receiveCode} mobile={saveTempMobile} changembtxt={changembtxt} on-changemobile={this.onChangeMobile(\'nocelar\')} on-shownext={this.onShowNext($event)} />\n    <!--密码-->\n    {#if !mbNoPwd}\n        <div r-hide={ish5upsms===1} class="fur-change-email"></div>\n        <mpinput needSafePwd={needSafePwd} ish5upsms={ish5upsms} eyeActive={eyeActive} needEye="{needEye}" tabindex=2 tabIndex=2 ref=mpinput on-focus={this.onFocus($event)} on-input={this.onInput($event)} on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} on-pwdOtherCheck={this.pwdOtherCheck($event)} placeholder="{mobilePlaceholder.regpwd}" needCheck=1 />\n    {/if}\n    <div r-hide={!canshownext}>\n        <!-- 错误提示 -->\n        <div class="m-nerror f-dn" id="nerror"></div>\n        <!-- 注册协议 -->\n        {#if isVersionFour}\n        <div class="fur-item fur-agree fur-agree-4">\n            <label>\n                {#if needRegAgreeMb}\n                <span {#if ckboxOk}class="u-zc-agree u-zc-agree-select"{#else}class="u-zc-agree"{/if}><input on-click={this.doCheckBox()} type="checkbox" class="zc-un-login" />\n                </span>{/if} 我同意\n                {#if newCDN === 1 && mbRegTermsList && mbRegTermsList.length>0}\n                    {#list mbRegTermsList as item}\n                        <a href="{item.url}" target="_blank" tabindex="-1" data-outlink="1">{item.name}</a>\n                        {#if item_index<mbRegTermsList.length-1} 和 {/if}\n                    {/list}\n                {#else}\n                    <a href="{mblink1}" target="_blank" tabindex="-1" data-outlink="1">{mbagree1}</a> 和 <a href="{mblink2}" target="_blank" tabindex="-1" data-outlink="1">{mbagree2}</a>\n                {/if}\n            </label>\n        </div>\n        {/if}\n        <!-- 登录按钮 -->\n        <div class="f-cb loginbox">\n            <a ref=regBtn id="submitBtn" on-click={this.doReg()} {#if mbRegLock}class="u-loginbtn btncolor tabfocus u-loginbtn-gary"{#else}class="u-loginbtn btncolor tabfocus"{/if} tabindex="8">{regMbTxt}</a>\n        </div>\n        <!-- 注册协议 -->\n        {#if !isVersionFour}\n        <div class="fur-item fur-agree">\n            <label>\n                {#if needRegAgreeMb}\n                <span {#if ckboxOk}class="u-zc-agree u-zc-agree-select"{#else}class="u-zc-agree"{/if}><input on-click={this.doCheckBox()} type="checkbox" class="zc-un-login" />\n                </span>{/if} 我同意\n                {#if newCDN === 1 && mbRegTermsList && mbRegTermsList.length>0}\n                    {#list mbRegTermsList as item}\n                        <a href="{item.url}" target="_blank" tabindex="-1" data-outlink="1">{item.name}</a>\n                        {#if item_index<mbRegTermsList.length-1} 和 {/if}\n                    {/list}\n                {#else}\n                    <a href="{mblink1}" target="_blank" tabindex="-1" data-outlink="1">{mbagree1}</a> 和 <a href="{mblink2}" target="_blank" tabindex="-1" data-outlink="1">{mbagree2}</a>\n                {/if}\n            </label>\n        </div>\n        {/if}\n        <div class="f-cb unandmailbox">\n            <!-- 免登复选框 -->\n            {#if !single}\n            <div class="m-unlogin m-unlogin2">\n                <a ref=gotoLoginTextMb class="u-regbtn bgcolor tabfocus u-regbtn2" href="javascript:void(0);" data-outlink="2" target="_self" tabindex="11" data-action="changepage" data-mdtype="1" data-log="mbRegGoLogin1">{gotoLoginTextMb}</a>\n            </div>\n            {/if}\n            {#if mailreghook}\n            <div class="u-mailreghook-box">\n                <a target="_blank" href={mailreghooklink} {#if !mailreghooklink}data-action="goEmailReg"{/if} class="mailreghook">{mailreghook}</a>\n            </div>\n            {/if}\n        </div>\n    </div>\n</div>\n');
I$("7257eef34ff48c041b2aafe400c6c5e3", function (e, t, i, n, s, a, r, o, c, d, _, l) {
	var u = -1;
	var f = 3e3;
	var h = n.extend({
		template: a,
		data: {
			isupmodule: 1,
			mailreghooklink: "https://zc.reg.163.com/regInitialized?pd=urszjmailreg&pkid=qzgcGfv&pkht=id.163.com",
			mbagree1: "《服务条款》",
			mblink1: "//hc.reg.163.com/iTerm/doc.html?id=542",
			mbagree2: "《网易隐私政策》",
			mblink2: "//hc.reg.163.com/iTerm/doc.html?id=437",
			changembtxt: "<切换手机号/修改密码"
		},
		destroy: function (e) {
			this.doUnlockReg();
			if (this.regsto) this.regsto = clearTimeout(this.regsto);
			this._$clearAllAjax();
			this.supr(e)
		},
		config: function (e) {
			this.supr(e);
			this.ORDERMAP = ["mninput", "mpinput"];
			this.rmbpw = e.rmbpw;
			this.saveTempMobile = e.saveTempMobile;
			this.__loginLockTxtMb = this.data.lockConfig && this.data.lockConfig.loginLockTxtMb || "正在登录...";
			this.data.changeItlTxt = "切换手机号";
			var t = this.data.regMbTxt || "注册";
			this.data.regMbTxt = "我已发送，" + t;
			this.data.saveBtnTxt = this.data.regMbTxt
		},
		init: function (e) {
			this.supr(e);
			this.$refs.mpinput && this.$refs.mpinput._$setValue(this.rmbpw)
		},
		onChangeMobile: function (e, t, i) {
			var n = {
				noinit: !0,
				capFlag: this.data.capFlag,
				errtxt: e || ""
			};
			if (1 === t) n.saveUpMobile = this.data.saveTempMobile;
			if (1 === i) n.needLight = 1;
			if (this.data.needRegAgreeMb) n.rmbclause = this.data.ckboxOk;
			if ("nocelar" == e) {
				n.errtxt = "";
				n.noclear = !0;
				n.mobile = this.saveTempMobile;
				n.rmbpw = this.rmbpw
			}
			this.$emit("changeModule", n)
		},
		rmError: function (e) {
			this.supr(e);
			this.showInitGuide()
		},
		doInit: function () {
			if (this.data.saveTempMobile && this.$refs.mninput) this.$refs.mninput._$setValue(this.data.saveTempMobile);
			this.showInitGuide();
			this.tryShowH5Up();
			this._$doToggleRegLockMb()
		},
		doCheckBox: function () {
			this.data.ckboxOk = !this.data.ckboxOk;
			if (this.data.ckboxOk) this.showInitGuide();
			this.$update()
		},
		onInput: function (e) {
			var t = e.value,
				i = this.$refs.mninput._$getValue().trim(),
				n = this.data.zfPwd || 0;
			var s = o._$checkPwd(t, i, n);
			if (!s) this.showInitGuide()
		},
		doReg: function () {
			if (!this.data.mbRegLock) {
				if (!this.checkForm()) {
					if (this.data.needRegAgreeMb && !this.data.ckboxOk) {
						this._$doShowError({
							tabIndex: u,
							str: "您需要同意相关条款才能注册",
							node: "nerror"
						});
						return
					}
					var e = {}, t = this.data.regDomains || "",
						i = this.data.regCookieDomain || "",
						n;
					var a = this.$refs.mninput._$getValue().trim();
					if (o._$getSmState()) e.un = a;
					else e.mb = a; if (!this.data.mbNoPwd) {
						n = this.$refs.mpinput._$getValue();
						e.pw = MP.encrypt(n, a)
					}
					e.pkid = this.data.promark;
					e.pd = this.data.product;
					if (t) t += i ? "," + i : "";
					else t = i;
					e.domains = t;
					if (this.__doRegLock) return;
					this.doLockReg();
					this.showInitGuide();
					this.regsto = setTimeout(function () {
						this.rmbMobile = a;
						s._$request("mb-reg-vfsms", e, this.regSuccess._$bind(this), this.regError._$bind(this))
					}._$bind(this), f)
				}
			} else this._$postMessage({
				type: "lockMbRegState",
				value: this.data.mbRegLock
			})
		},
		regError: function (e) {
			this.doUnlockReg();
			var i = -1,
				n = "mb-reg-vfsms-",
				s = e.ret,
				a, c = e.dt || "";
			this.__doSendLog(s);
			if ("417" != s && "4503" !== s) {
				if ("401" == s && t._$indexOf(["13", "20"], c) === -1) e.ret = n + s;
				else e.ret = n + s + c; if ("407" === s) {
					this.$refs.mninput._$setHasError();
					i = 1
				}
				var d = {};
				if ("413" === s && "02" === c) {
					i = 100;
					a = 2;
					d.sourceTxt = this.sourceTxt
				}
				this.$update();
				this.onShowErr(e, i, a, d)
			} else {
				var _ = r[n + s] || o._$getErrorTxt(s);
				if ("4503" === s) this.onChangeMobile(_, 1, 1);
				else this.onChangeMobile(_, 1)
			}
		}
	});
	return h
}, "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "08fae8cb6c83128fc48ff497777614a9", "53c267efd983fb8c66cb645beead7a8d", "4cd9f6120a8859908cbda0ff3cfa5163", "d6e36b6b1f96e15e42725a59e7acd142", "a4de926c2d79e8d8f856eaff4dac0f8b");
I$("b87b783e8fe7b8a80eb0f2a116abb4ac", function (e, t, i, n, s, a, r, o, c, d, _, l, u) {
	var f = s.extend({
		template: o,
		data: {},
		config: function (e) {
			t._$merge(this.data, e || {});
			this.supr(e)
		},
		init: function (i) {
			this.supr(i);
			this.__config = {};
			t._$merge(this.__config, i);
			e._$addEvent(document, "keyup", this.doEnter._$bind(this))
		},
		destroy: function () {
			e._$clearEvent(document, "keyup");
			this.__clearModules();
			this.supr()
		},
		__clearModules: function () {
			if (this.__mbreg) this.__mbreg.destroy();
			if (this.__mbregup) this.__mbregup.destroy()
		},
		_$changeModule: function (e) {
			e = e || {};
			var t = e.mobile,
				i = e.isup || !1,
				s = e.noinit || !1,
				a = e.capFlag || "",
				o = e.noclear || !1;
			this.__clearModules();
			this.__config2 = n._$deepCopy(!0, {}, this.__config);
			this.__config2.rmbclause = e.rmbclause;
			if (i) {
				this.__config2.capFlag = a;
				this.__config2.receiveCode = e.receiveCode;
				this.__config2.saveTempMobile = t
			}
			if (i) {
				this.__config2.rmbpw = e.rmbpw;
				this.__nowModule = "mbregup";
				this.__mbregup = new c({
					data: this.__config2
				}).$inject("#login-form");
				this.__mbregup.$on("changeModule", this._$changeModule._$bind(this));
				this.__mbregup.doInit()
			} else {
				this.__nowModule = "mbreg";
				this.__mbreg = new r({
					data: this.__config2
				}).$inject("#login-form");
				this.__mbreg.$on("changeModule", this._$changeModule._$bind(this));
				if (s) {
					this.__mbreg.doRefresh(e.capFlag);
					if (e.saveUpMobile) this.__mbreg.setUpMobile(e.saveUpMobile, e.needLight);
					else this.__mbreg.doFocusMb(); if (e.errtxt) this.__mbreg.doShowErrTxt(e.errtxt);
					if (o) {
						this.__mbreg._$setMb(e.mobile);
						this.__mbreg._$setPwd(e.rmbpw)
					}
				} else this.__mbreg.doInit()
			}
		},
		_$doToggleRegLockMb: function (e) {
			window._$mbRegLock = e;
			if (this.__mbreg) this.__mbreg._$doToggleRegLockMb();
			if (this.__mbregup) this.__mbregup._$doToggleRegLockMb()
		},
		_$safekeyboardMsg: function (e) {
			if ("mbreg" === this.__nowModule && this.__mbreg) this.__mbreg._$safekeyboardMsg(e);
			if ("mbregup" === this.__nowModule && this.__mbregup) this.__mbregup._$safekeyboardMsg(e)
		}
	});
	return f
}, "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a4de926c2d79e8d8f856eaff4dac0f8b", "b62616ba5d59a47ea54fc057cbcd66b8", "53c267efd983fb8c66cb645beead7a8d", "08fae8cb6c83128fc48ff497777614a9", "f3171e31fd7f05504130680dab7749d3", "7257eef34ff48c041b2aafe400c6c5e3");
I$("dc628e4680f8520b821dce87fc401663", '<form id="reg-phone-form" class="page-sms {h5extclazz}">\n    <div class="m-pccnt">\n        <div r-hide={ish5upsms===1} class="reg-phone-nomobile-box">\n            <div class="ph-tip">{bindTxt}</div>\n            <div class="inputbox" on-click="{this.onShake($event)}">\n                <div class="u-input">\n                    <label class="u-label f-dn">手机号</label>\n                    <input data-placeholder="手机号" name="phone" class="j-inputtext u-upsms-disabled" type="tel" data-required="true" data-name="phone" data-pattern="^(13|14|15|16|17|18|19)\\d{9}$" tabindex="1" spellcheck="false" autocomplete="off" maxlength="11" value="{mobile}" disabled="disabled" />\n                </div>\n                <div class="u-tip u-upsms-tip"><div class="u-success u-clear {shakecss}"></div></div>\n            </div>\n            <div class="u-toggleitlbox"><a class="toggleitl j-cgp" href="javascript:void(0);" on-click={this.backDownSms($event)}>{changeTxt}</a></div>\n        </div>\n        <h5upsms extclazz="m-smsup-ext" ish5upsms={ish5upsms} ref=h5upsms receiveCode={receiveCode} mobile={mobile} changembtxt={changembtxt} on-changemobile={this.backDownSms($event)} on-shownext={this.onShowNext($event)}  />\n        <div class="m-nerror f-dn" id="nerror"></div>\n    </div>\n    <div r-hide={!canshownext}>\n        <div class="f-cb loginbox">\n            <a ref="regBtnRef" class="u-loginbtn btncolor tabfocus btndisabled {ubtnloading}" on-click={this.onCheckSmsUp($event)} tabindex="5">{regBtnTxt}</a>\n        </div>\n    </div>\n</form>\n');
I$("6ea0215970b9a141ebcd2546bb2ad5d7", function (e, t, i, n, s, a, r, o, c, d, _, l, u, f) {
	var h = 3e3;
	var p = "我已发送，注册";
	var m = s.extend({
		template: o,
		data: {
			saveBtnTxt: p,
			regBtnTxt: p,
			isBindMbUpSms: 1,
			bindTxt: "本次注册需要短信验证，请按以下提示操作",
			changeTxt: "切换手机号"
		},
		config: function (e) {
			this.enlang = window._$URSOPT.enlang;
			if (1 == this.enlang) {
				var i = ["bindTxt", "changeTxt", "regBtnTxt", "saveBtnTxt"];
				t._$forEach(i, function (e) {
					this.data[e] = d.showText(this.data[e], 1)
				}._$bind(this))
			}
			t._$merge(this.data, e || {});
			this.supr(e);
			this.needExtClazz()
		},
		destroy: function (e) {
			if (this.__newAiSlideCap) this.__newAiSlideCap = this.__newAiSlideCap.destroy();
			this.__unLockSendSmsBtn();
			this.resetRegBtn();
			this.supr(e)
		},
		resetRegBtn: function () {
			this.data.ubtnloading = "";
			this.lockBtnClick = !1;
			this.data.regBtnTxt = d.showText(p, this.enlang);
			this.$update()
		},
		regvfsmsupOk: function () {
			this.resetRegBtn();
			this.data.regBtnTxt = d.showText("验证成功，正在注册...", this.enlang);
			this.uploadSmsIsOk = !0;
			this.lockBtnClick = !0;
			this.$update();
			var e = {
				tk: this.data.ticket,
				un: this.data.un,
				pw: MP.encrypt(this.data.password, this.data.un),
				channel: 2,
				mb: this.data.mobile,
				domains: this.data.domains,
				pkid: this.data.promark,
				pd: this.data.product
			};
			a._$request("fastReg", e, this.fastRegOk._$bind(this), this.fastException._$bind(this))
		},
		fastRegOk: function (e) {
			var t = this.data.un;
			this.lockBtnClick = !1;
			if (e.nextUrls) this.$emit("setDomains", {
				type: "regcksuccess",
				username: "",
				nextUrls: e.nextUrls
			});
			if ("201" === e.ret) this.$emit("onregsuc", {
				url: e.url || ""
			});
			else if ("202" === e.ret) this.$emit("onreg3p", {
				saveurl: n._$getCommonEmail(t)
			})
		},
		fastException: function (e) {
			var t = e.ret,
				i = e.dt;
			this.resetRegBtn();
			if ("411" != t || "02" != i) this._$fastRegException(e);
			else this.backDownSms(1)
		},
		_$fastRegException: function (e) {
			var i = e.ret,
				s, a = "EXCEPTION_REG_MOB_" + i;
			var o = e.dt,
				c;
			if ("02" != o || "401" != i) {
				s = r[a] || r[i] || n._$getErrorTxt(e.ret);
				if (!("111" === i || this.__newAiSlideCap && "107" == i))
					if (t._$indexOf(["407", "408", "462", "461", "107", "108", "109", "110", "4502", "604"], i) !== -1) {
						c = n._$getCfByCode(i);
						var d = this.__getAutoFlag(i);
						this.$emit("onback", {
							cf: c,
							errorTxt: s,
							noRefresh: 1,
							noAuto: d,
							realRes: e
						})
					} else if ("605" === i) {
						var d = this.__getAutoFlag(i);
						this.$emit("onback", {
							cf: null,
							errorTxt: s,
							noRefresh: 1,
							noAuto: d,
							realRes: e
						})
					} else n._$showError(null, s, "nerror");
				else this.__showAiCap()
			} else {
				a = "40102";
				s = r[a] || r[i] || n._$getErrorTxt(e.ret);
				this.$emit("onback", {
					cf: void 0,
					errorTxt: s,
					noRefresh: 1,
					noAuto: 1
				})
			}
		},
		__getAutoFlag: function (e) {
			return t._$indexOf(["407", "408", "462", "461", "107", "4502", "605", "604"], e) !== -1 ? 1 : 0
		},
		backDownSms: function (e) {
			var t = 1 === e ? d.showText("请获取短信验证码", this.enlang) : "";
			this.$emit("changeToBindMobile", {
				txt: t
			})
		},
		regvfsmsupFail: function (e) {
			var t = e.ret || "",
				i, s, a;
			if ("-1" != t)
				if ("412" == t) this.resetRegBtnErr(d.showText("验证码错误次数过多，请明天再试", this.enlang));
				else if ("413" == t || "409" == t) this.resetRegBtnErr(d.showText("系统未收到短信或短信内容错误", this.enlang));
				else if ("417" == t) this.backDownSms(1);
				else {
					s = e.dt;
					i = r[t] || n._$getErrorTxt(t);
					if ("401" === t && ("01" === s || "02" === s)) {
						a = t + s;
						i = r[a];
						this.$emit("onback", {
							cf: void 0,
							errorTxt: i,
							noRefresh: 1,
							noAuto: 1
						});
						return
					}
					this.resetRegBtn();
					n._$showError(null, i, "nerror")
				} else if (!this.ignore) this.resetRegBtnErr(d.showText("网络异常，请稍后重试", this.enlang))
		},
		doCheck: function () {
			var e = {
				mb: this.data.mobile,
				un: this.data.un,
				channel: 2,
				pkid: this.data.promark,
				pd: this.data.product
			};
			if (n._$isVersionFour()) this.showInitGuide();
			this.sto = setTimeout(function () {
				a._$request("vfsmsup", e, this.regvfsmsupOk._$bind(this), this.regvfsmsupFail._$bind(this))
			}._$bind(this), h)
		},
		__showAiCap: function () {
			if (!this.__newAiSlideCap) this._$getAiSlideCap();
			else {
				var e = n._$getAiBtnTxt(!0);
				n._$showError(null, e, "nerror");
				this.__aicapstate = !1;
				this.__newAiSlideCap._$refresh(!1)
			}
		},
		_$getAiSlideCap: function () {
			n._$setAiBtn(this.$refs.regBtnRef);
			var e = {
				captchaType: 4,
				customStyles: this.data.customStyles || {},
				capPadding: this.data.capPadding || "",
				capBarHeight: this.data.capBarHeight || "",
				lang: this.data.lang,
				verifyCallback: this.__slideVerify._$bind(this),
				initCallback: u,
				initErrorHandler: this.__initErrorHandler._$bind(this),
				autoVerify: !0,
				capFlag: 6,
				doAutoVerify: this.__doAutoVerify._$bind(this),
				doLockVerify: this.__lockSendSmsBtn._$bind(this),
				onClose: this.__onAiClose._$bind(this)
			};
			if (this.__newAiSlideCap) this.__newAiSlideCap = this.__newAiSlideCap.destroy();
			this.__aicapstate = !1;
			this.__newAiSlideCap = new c({
				data: e
			})
		},
		__lockSendSmsBtn: function () {
			if (n._$isVersionFour()) {
				this.data.ubtnloading = "u-btn-loading";
				this.$update()
			}
		},
		__unLockSendSmsBtn: function () {
			if (n._$isVersionFour()) {
				this.data.ubtnloading = "";
				this.$update()
			}
		},
		__slideVerify: function (e) {
			this.__unLockSendSmsBtn();
			if (e && e.validate) this._$verifyCap(e)
		},
		_$verifyCap: function (e) {
			var t = {}, i = "regvfscp";
			t.un = this.data.un;
			t.pkid = this.data.promark;
			t.pd = this.data.product;
			t.cap = e.validate;
			a._$request(i, t, this.__cbVfscp._$bind(this), this.__cbVfscpEx._$bind(this))
		},
		__cbVfscp: function () {
			this.__aicapstate = !0;
			this.onCheckSmsUp("forcesend")
		},
		__cbVfscpEx: function (e) {
			var i, s, a, o;
			this.__unLockSendSmsBtn();
			if (e) {
				if (n._$fail5("mailregbdmbup")) return;
				i = e.ret;
				if (t._$indexOf(["108", "109", "110"], i) !== -1) {
					o = "EXCEPTION_REG_MOB_" + i;
					a = r[o] || r[i] || n._$getErrorTxt(i);
					this.$emit("onback", {
						cf: s,
						errorTxt: a,
						noRefresh: 1
					})
				} else {
					this.__showAiCap();
					a = r[i] || n._$getErrorTxt(i);
					if ("111" === i) a = n._$getAiBtnTxt(!0);
					n._$showError(null, a, "nerror")
				}
			}
		},
		__initErrorHandler: function () {
			this.__unLockSendSmsBtn();
			n._$showError(null, "加载失败，请刷新页面重试", "nerror")
		},
		__doAutoVerify: function () {
			this.onCheckSmsUp("forcesend")
		},
		__onAiClose: function () {
			this.__unLockSendSmsBtn()
		}
	});
	return m
}, "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a4de926c2d79e8d8f856eaff4dac0f8b", "94b358c972f61ae8621427352d109a26", "53c267efd983fb8c66cb645beead7a8d", "dde0e6b40e64b3f022ca4ad9ab8b1a9c", "dc628e4680f8520b821dce87fc401663", "41ef7aa93d23fe74cbf747774554e6ce", "46a4de3a50f50a600950ca9cee88031e");
I$("4d89b0f3b292fe1c24e1a564b3682e56", function (e, t, i, n, s, a, r, o, c, d, _, l, u, f, h, p, m, g, b, v) {
	var $;
	m._$$RegisterManager = e._$klass();
	$ = m._$$RegisterManager._$extend(u._$$Manager);
	$.__init = function (e) {
		this.enlang = window._$URSOPT.enlang;
		o._$loadGaq();
		this.__options = e || {};
		this.__isNewCapPopup = "popup" == this.__options.mode;
		this.__regLockTxt = e.lockConfig && e.lockConfig.regLockTxt || p.showText("正在注册...", this.enlang);
		this.__focusHelper = this.__options.focusHelper || 0;
		this.__promark = e.promark || "";
		this.__product = e.product || "";
		this.__host = e.host || "";
		this.__regCapLazyload = e.regCapLazyload || 0;
		this.__cf = 1;
		window["$regCookieDomain"] = e.regCookieDomain;
		this.__super(e);
		this.__gaqo = {
			pid: this.__promark,
			pdt: this.__product
		};
		this.__lockReg = 0;
		this.__canPass = 0;
		i._$addEvent(window, "message", this.onMessage._$bind(this))
	};
	$.onMessage = function (e) {
		var t;
		var i = e && e.data;
		if (i) {
			if ("string" == typeof i) try {
				i = JSON.parse(i)
			} catch (n) { }
			if ("object" == typeof i && "URS|" == i.from)
				if (i.fromRegLockMb && this.__mbRegModule) {
					t = i.lock || 0;
					this.__mbRegModule._$doToggleRegLockMb(t)
				}
		}
	};
	$.__reset = function (e) {
		this.__super(e);
		this.__lockReg = 0;
		this.__disabled = 1;
		this.__single = parseInt(e.single);
		this.__regSucCount = e.regSucCount;
		this.__includeBox = !!e.includeBox;
		this.__mobileFirst = e.mobileFirst || 0;
		if (e.terms) this.__terms = e.terms;
		this.__isGetTicket = !1;
		this.__initHtml();
		o._$resize()
	};
	$.__renderReg = function () {
		if (!this.__collect) this.__collect = l._$$Collect._$allocate({
			holder: document.body
		});
		this.__module = "goEmailReg";
		this.__initCompOK();
		this.__initComp();
		this.__checkDisable();
		if (this.__terms) {
			var e = t._$getByClassName(this.__box, "fur-agree")[0];
			var s = '<label><span id="j-zc-agree" class="u-zc-agree u-zc-agree-select"><input type="checkbox" class="zc-un-login" checked="checked"></span>  ' + p.showText("我同意", this.enlang);
			n._$forEach(this.__terms, function (e, t, i) {
				if (o._$notURL(e.url)) e.url = "";
				s += '<a href="' + n._$escape(e.url) + '" target="_blank" tabindex="-1" data-outlink="1">' + o._$HtmlEncode(e.name) + "</a>";
				if (t < i.length - 1) s += p.showText("和", this.enlang)
			}._$bind(this));
			s += "</label>";
			e.innerHTML = s
		}
		this.__zcAgree = t._$get("j-zc-agree");
		this.__zcAgreeInput = t._$getByClassName(document, "zc-un-login")[0];
		if (this.__options.needRegAgree) {
			i._$delEvent(this.__zcAgreeInput, "click", this.__doZcAgree._$bind(this));
			i._$addEvent(this.__zcAgreeInput, "click", this.__doZcAgree._$bind(this))
		} else t._$addClassName(this.__zcAgree, "f-urs-dn"); if (1 == this.__options.needRegAgreeNoChecked) {
			this.__zcAgreeInput.checked = !1;
			this.__doZcAgree()
		} else {
			this.__zcAgreeInput.checked = !0;
			this.__doZcAgree()
		}
	};
	$.__doZcAgree = function () {
		if (this.__zcAgreeInput.checked) {
			t._$addClassName(this.__zcAgree, "u-zc-agree-select");
			o._$removeError2()
		} else t._$delClassName(this.__zcAgree, "u-zc-agree-select")
	};
	$.__initHtml = function (e) {
		r._$render(this.__box, "index-tmp", {
			needMobileReg: this.__options.needMobileReg,
			goEmailLoginTxt: this.__options.goEmailLoginTxt,
			goMbLoginTxt: this.__options.goMbLoginTxt,
			goEmailRegTxt: this.__options.goEmailRegTxt,
			goMbRegTxt: this.__options.goMbRegTxt
		});
		this.__cnt = t._$getByClassName(this.__box, "m-cnt")[0];
		if (this.__includeBox) {
			var i = t._$get("cnt-box-parent");
			if (!t._$hasClassName(i, "cnt-box-include")) t._$addClassName(i, "cnt-box-include")
		}
		var n = t._$get("mobileReg");
		if (!e && this.__mobileFirst && n) this.__doAction(n);
		else this.__renderReg()
	};
	$.__doEnter = function (e) {
		if (this.__registerModule)
			if (13 == e.keyCode && !this.__ticket && !this.__registerModule._stopEnter);
			else if (this.__registerModule) this.__registerModule._stopEnter = 0
	};
	$.__checkDisable = function () {
		var e = t._$get("doregister");
		if (this.__disabled) t._$addClassName(e, "btndisabled");
		else t._$delClassName(e, "btndisabled")
	};
	$.__destroy = function () {
		window._$needCookieSet = 0;
		this.__noRefresh = 0;
		this.__bindMbError = "";
		this.__clearModule();
		delete this.__module;
		this.__super()
	};
	$.__initComp = function () {
		var e = {
			pkid: this.__promark,
			pkht: this.__host,
			pd: this.__product,
			channel: 2
		};
		this.__hasInit = -1;
		s._$request("init", e, this.__initOk._$bind(this), this.___initComponentException._$bind(this))
	};
	$.__initOk = function (e) {
		if (this.__registerModule) {
			this.__allowGlobalMb = !0;
			if (e.allowGlobalMb === !1) this.__allowGlobalMb = !1;
			if (e.forbidMbCode && e.forbidMbCode.length > 0) window._$URS.hideAreas = e.forbidMbCode;
			else window._$URS.hideAreas = "";
			this.__unFmtErrWGdHm = e.unFmtErrWGdHm || 0;
			this.__registerModule._$setUnFmtErrWGdHm(this.__unFmtErrWGdHm);
			this.__hasInit = 1;
			this.__cf = e.cf;
			o._$setAiCapId(e);
			MP.getId(this.__promark, function (e) {
				if (6 == this.__cf) this.__showCap(1);
				else if (!this.__regCapLazyload && (1 == this.__cf || 4 == this.__cf || 5 == this.__cf))
					if (1 != this.__cf && this.__isNewCapPopup) this.__registerModule._$setNeedCheckCode();
					else this.__showCap();
				else this.__registerModule._$hideCheckCode();
				if (this.__focusHelper) {
					this.__registerModule._$focusHelper();
					this.__focusHelper = !1
				}
				if (this.__bindMbError && this.__cf) {
					o._$showError({
						name: 1 == this.__cf ? "checkcode" : "slide"
					}, this.__bindMbError, "nerror");
					this.__bindMbError = ""
				}
				if (this.__registerModule && this.__options.preFilledMailReg) {
					this.__registerModule._$setPreFillMail();
					this.__options.preFilledMailReg = ""
				}
				this.__sendMsg({
					type: "regInitSuccess"
				})
			}._$bind(this));
			try {
				this.__registerModule._$setCFModule(this.__cf)
			} catch (t) { }
		}
	};
	$.__showCap = function (e) {
		var t = o._$getRetByCf(this.__cf);
		if (this.__cf) this.__showCheckCode(t, 1, e)
	};
	$.___initComponentException = function (e) {
		this.__hasInit = 0;
		var t = e && e.ret || "0";
		if ("-401" != t) {
			if (!window._$URSOPT.from3Cdn)
				if (window._$needUrsBgp)
					if (!window._$BGPZC && ("0" == t || "-1" == t || "-2" == t)) {
						window._$BGPZC = 1;
						setTimeout(function () {
							this.__initComp()
						}._$bind(this), 200);
						return
					}
			this.__showFail(t)
		} else {
			o._$showError(0, o._$get401Error("注册"), "nerror");
			window._$needCookieSet = 1
		}
	};
	$.__initCompOK = function () {
		this.__initRegister();
		this.__sendSize("init")
	};
	$.__getInitState = function () {
		return 1 === this.__hasInit
	};
	$.__onRegCapLazyload = function () {
		if (!this.__hasCap) {
			this.__hasCap = 1;
			if (6 != this.__cf) this.__showCap()
		}
	};
	$.__isPopAndSlide = function () {
		return this.__isNewCapPopup && (4 == this.__cf || 5 == this.__cf)
	};
	$.__onSlideOk = function (e) {
		if (this.__isPopAndSlide() || "autoreg" === e) this.__doReg()
	};
	$.__onSetCF = function (e) {
		this.__cf = e
	};
	$.__doCollect = function () {
		this.__collect && this.__collect._$check()
	};
	$.__initRegister = function () {
		if (!this.__registerModule) this.__registerModule = c._$$Register._$allocate({
			parent: this.__cnt,
			opts: this.__options,
			onRegCapLazyload: this.__onRegCapLazyload._$bind(this),
			canpass: this.__onCanPass._$bind(this),
			ondisabled: this.__onDisabled._$bind(this),
			setmbreged: this.__setMbReged._$bind(this),
			getInitState: this.__getInitState._$bind(this),
			onback: this.__backReg._$bind(this),
			onSlideOk: this.__onSlideOk._$bind(this),
			onSetCF: this.__onSetCF._$bind(this),
			onUnLockReg: this.__onUnLockReg._$bind(this),
			onDoLockReg: this.__onDoLockReg._$bind(this),
			aiUnlockBtn: this.__onAiUnlockBtn._$bind(this),
			collect: this.__doCollect._$bind(this)
		});
		this.__inputs = t._$getByClassName(this.__box, "j-inputtext");
		this.__nameinput = this.__inputs[0];
		this.__passwordinput = this.__inputs[1];
		this.__checkcodeinput = this.__inputs[2];
		i._$delEvent(document, "keyup", this.__doEnter._$bind(this));
		i._$addEvent(document, "keyup", this.__doEnter._$bind(this));
		this.__mainBtn = t._$getByClassName(this.__box, "u-loginbtn")[0];
		if (this.__single) {
			var e = t._$get("changepage");
			if (e) e.style.display = "none"
		}
	};
	$.__onCanPass = function (e) {
		this.__canPass = e
	};
	$.__setMbReged = function (e) {
		this.__pbHasReged = e
	};
	$.__onDisabled = function (e) {
		this.__disabled = e;
		this.__checkDisable()
	};
	$.__showFooter = function () {
		var e = t._$get("footer");
		if (e) t._$delClassName(e, "f-dn")
	};
	$.__bindMbSetDomains = function (e) {
		this.__setDomainsNoPathbAndOpd(e)
	};
	$.__showPage = function (e) {
		if ("bindmobile" == e) {
			this.__registerModule._$hide();
			if (!this.__bindMobileModule) this.__createBindMobileModule();
			o._$resize()
		}
	};
	$.__createBindMobileModule = function () {
		var e = this.__getDomains();
		this.__bindMobileModule = d._$$BindMobile._$allocate({
			opts: this.__options,
			allowGlobalMb: this.__allowGlobalMb,
			un: this.__username,
			domains: e,
			pwd: this.__password,
			ticket: this.__ticket,
			parent: this.__cnt,
			promark: this.__promark,
			product: this.__product,
			captcha: this.__smscode,
			mbreged: this.__pbHasReged,
			onreg3p: this.__doReg3p._$bind(this),
			onregsuc: this.__doRegsuc._$bind(this),
			onhidefooter: this.__hideFooter._$bind(this),
			onback: this.__backReg._$bind(this),
			onVerifyOk: this.__doFastReg._$bind(this),
			setDomains: this.__bindMbSetDomains._$bind(this),
			onChangeToUpsms: this.__doChangeToUpSms._$bind(this)
		})
	};
	$.__doChangeToUpSms = function (e) {
		if (this.__bindMobileModule) this.__bindMobileModule = this.__bindMobileModule._$recycle();
		this.__bindMobileUpSms = new h({
			data: e
		});
		this.__bindMobileUpSms.$on("changeToBindMobile", this.__changeToBindMobile._$bind(this));
		this.__bindMobileUpSms.$on("setDomains", this.__bindMbSetDomains._$bind(this));
		this.__bindMobileUpSms.$on("onregsuc", this.__doRegsuc._$bind(this));
		this.__bindMobileUpSms.$on("onreg3p", this.__doReg3p._$bind(this));
		this.__bindMobileUpSms.$on("onback", this.__backReg._$bind(this));
		this.__bindMobileUpSms.$inject(this.__cnt)
	};
	$.__changeToBindMobile = function (e) {
		if (this.__bindMobileUpSms) this.__bindMobileUpSms.destroy();
		if (!this.__bindMobileModule) {
			this.__createBindMobileModule();
			if (e.txt) o._$showError(100, e.txt, "nerror")
		}
		o._$resize()
	};
	$.__doReg3p = function (e) {
		this.__saveurl = e.saveurl || "";
		this.__onReg3P()
	};
	$.__doRegsuc = function (e) {
		this.__url = e.url || "";
		this.__onRegSuccess()
	};
	$.__doFastReg = function (e, t, i) {
		if (!this.__regmobileLock) {
			this.__savembregbtn = i;
			this.__doRegmobileLock();
			this.__bindmobile = e;
			this.__bindsms = t;
			this._$fastReg()
		}
	};
	$.__doRegmobileLock = function () {
		this.__regmobileLock = 1;
		if (o._$isVersionFour() && this.__savembregbtn) this.__savembregbtn.innerHTML = p.showText("正在注册...", this.enlang)
	};
	$.__unRegmobileLock = function () {
		this.__regmobileLock = 0;
		if (o._$isVersionFour() && this.__savembregbtn) this.__savembregbtn.innerHTML = p.showText("注&nbsp;&nbsp;册", this.enlang)
	};
	$.__onReg3P = function (e) {
		r._$render(this.__box2, "register-3p-success", {
			username: this.__username,
			activeurl: this.__saveurl,
			resend: e,
			activeTxt: p.showText("请激活帐号", this.enlang),
			sendToTxt: p.showText("激活邮件已发到", this.enlang),
			activeTxt2: p.showText("邮箱，请在48小时内登录邮箱完成激活", this.enlang),
			activeTip: p.showText("如何激活", this.enlang),
			goActive: p.showText("去激活", this.enlang),
			notGetTxt: p.showText("没收到验证邮件", this.enlang),
			tryTxt1: p.showText("尝试到广告邮件、垃圾邮件目录里找找看", this.enlang),
			doSendAgain: p.showText("再次发送", this.enlang),
			acitveMail: p.showText("验证邮件", this.enlang),
			changeMail: p.showText("如果重发激活邮件仍没收到，请更换邮箱", this.enlang),
			reRegister: p.showText("重新注册", this.enlang)
		});
		var t = {
			userName: this.__username,
			otherRegSuccess: 1
		};
		o._$3pSuccess(t);
		this.__changePage(1);
		o._$resize()
	};
	$.__onRegSuccess = function () {
		var e = "2" == this.__captype && "01" == this.__dt ? this.__bindmobile : "";
		r._$render(this.__box2, "register-success", {
			username: this.__username,
			mobile: e,
			succTxt: p.showText("注册成功", this.enlang)
		});
		var i = 0 === this.__regSucCount ? 0 : this.__regSucCount || 3;
		if (0 !== i) {
			this.__changePage(1);
			if (!/^\d+$/.test(i)) i = 3;
			t._$get("countdown").innerHTML = i + p.showText("秒后自动登录", this.enlang);
			var n = setInterval(function () {
				i -= 1;
				if (0 !== i) t._$get("countdown").innerHTML = i + p.showText("秒后自动登录", this.enlang);
				else {
					n = clearInterval(n);
					this.__sendMsg({
						type: "register-success",
						username: this.__username,
						url: this.__url
					});
					this.__sendClose(1)
				}
			}._$bind(this), 1e3);
			o._$resize()
		} else {
			this.__sendMsg({
				type: "register-success",
				username: this.__username,
				url: this.__url
			});
			this.__sendClose(1)
		}
	};
	$.__goModule = function () {
		this.__clearModule();
		if ("goEmailReg" == this.__module) this.__renderReg();
		else this.__createMbRegModule();
		this.__showFooter()
	};
	$.__createMbRegModule = function () {
		this.__mbRegModule = new f({
			data: this.__options
		});
		if (this.__options.preFilledMobileReg && 1 != this.__options.preRegDisabled) this.__options.preFilledMobileReg = "";
		this.__mbRegModule.$inject(this.__cnt);
		this.__mbRegModule._$changeModule()
	};
	$.__doAction = function (e) {
		var s = i._$getElement(e) || e,
			a = t._$dataset(s, "action"),
			r = t._$dataset(this.__mainBtn, "lock") || 0;
		if ("goMbReg" == a || "goEmailReg" == a) {
			if (a == this.__module) return;
			this.__heads = t._$getByClassName(this.__box, "j-head");
			n._$forEach(this.__heads, function (e) {
				t._$delClassName(e, "active")
			});
			t._$addClassName(s, "active");
			this.__module = a;
			this.__goModule()
		} else if ("doregister" == a) {
			if (r) this.__sendMsg({
				type: "lockRegState",
				value: r
			});
			if ("1" == r) return;
			this.__doReg()
		} else if ("goback" == a) this.__doBack();
		else if ("backreg" == a) this.__backReg({
			forceMail: !0
		});
		else if ("resend" == a) this.__sendMail(1);
		else if ("doclose" == a) this.__sendClose();
		this.__super(e)
	};
	$.__sendMail = function (e) {
		var t;
		if (o._$getSmState()) t = {
			pd: this.__product,
			pkid: this.__promark,
			pkht: this.__host,
			channel: 2,
			un: this.__username
		};
		else t = {
			proId: this.__product,
			promarkId: this.__promark,
			promarkHost: this.__host,
			channel: 2,
			userName: this.__username
		};
		s._$request("sendActMail", t, this.__onSendActMail._$bind(this, e), this.__onSendActMailFail._$bind(this))
	};
	$.__onSendActMailFail = function (e) {
		var t = "-102",
			i;
		t = e && e.ret;
		if ("104" == t || "106" == t || "421" == t) {
			t = "active_" + t;
			i = _[t];
			o._$showFail2(i)
		} else o._$showFail(t)
	};
	$.__onSendActMail = function (e) {
		if (e) o._$showFail("-101");
		this.__onReg3P(1)
	};
	$.__doBackAndRefreshCap = function (e, t) {
		var i;
		var n = t && t.realRes;
		this.__doBack();
		if (e) {
			this.__cf = e;
			i = {
				name: 1 == this.__cf ? "checkcode" : "slide"
			}
		} else i = null; if (t && 1 === t.noAuto) this.__showCap(1);
		else this.__showCap(); if (this.__bindMbError) {
			if (n && "4502" === n.ret && this.__nameinput) i = this.__nameinput;
			o._$showError(i, this.__bindMbError, "nerror")
		}
		this.__bindMbError = ""
	};
	$.__backReg = function (e) {
		e = e || {};
		var t = e.forceMail;
		this.__noRefresh = e.noRefresh || 0;
		this.__bindMbError = e && e.errorTxt || "";
		this.__showFooter();
		if (!this.__noRefresh) {
			if (this.__registerModule) {
				this.__registerModule._$clearState();
				this.__registerModule = this.__registerModule._$recycle()
			}
			if (this.__bindMobileModule) {
				this.__bindMobileModule._$clearState();
				this.__bindMobileModule = this.__bindMobileModule._$recycle()
			}
			if (this.__bindMobileUpSms) this.__bindMobileUpSms.destroy();
			this.__initHtml(t);
			this.__changePage()
		} else this.__doBackAndRefreshCap(e.cf, e)
	};
	$.__clearLockState = function () {
		this.__regmobileLock = 0;
		this.__lockReg = 0
	};
	$.__clearModule = function () {
		this.__clearLockState();
		if (this.__bindMobileUpSms) this.__bindMobileUpSms.destroy();
		if (this.__mbRegModule) this.__mbRegModule.destroy();
		if (this.__registerModule) {
			this.__onUnLockReg();
			this.__registerModule = this.__registerModule._$recycle()
		}
		if (this.__bindMobileModule) this.__bindMobileModule = this.__bindMobileModule._$recycle();
		if (this.__collect) this.__collect = this.__collect._$recycle()
	};
	$.__doBack = function () {
		this.__changePage();
		this.__registerModule._$show();
		if (this.__bindMobileModule) this.__bindMobileModule = this.__bindMobileModule._$recycle();
		if (this.__bindMobileUpSms) this.__bindMobileUpSms.destroy()
	};
	$.__showCheckCode = function (e, t, i) {
		var n;
		if (this.__registerModule)
			if (e)
				if ("111" == e.ret) {
					this.__cf = 6;
					this.__registerModule.__cbVftcpEx(e, 1, i)
				} else if ("108" == e.ret) {
					this.__cf = 1;
					this.__registerModule.__cbVftcpEx(e, t)
				} else if ("109" == e.ret || "110" == e.ret) {
					this.__cf = "109" == e.ret ? 4 : 5;
					this.__registerModule.__cbVftcpEx(e, t)
				} else if (this.__registerModule.__needAiCap) this.__registerModule.__cbVftcpEx({
					ret: "111"
				}, 1, 1);
				else if (this.__registerModule.__needSlideCap || this.__registerModule.__needCheckCode) {
					if (this.__registerModule.__needSlideCap) n = "1" + ("2" == this.__registerModule.__slideTarget ? "09" : "10");
					else n = "108";
					e = {
						ret: n
					};
					this.__registerModule.__cbVftcpEx(e, t)
				}
	};
	$.__getCheckCode = function () {
		this.__registerModule._$getCheckCode()
	};
	$.__getTicket = function (e) {
		if ("102" !== e.ret) {
			this.__isGetTicket = !0;
			this.__ticket = e.tk;
			MP.setTicket(this.__ticket);
			this.__captype = e.cap;
			this.__dt = e.dt || "01";
			switch (this.__captype) {
				case "0":
					this._$fastReg();
					break;
				case "1":
					this._$fastReg();
					break;
				case "2":
					this.__onUnLockReg();
					this.__showPage("bindmobile")
			}
		} else this.__getTicketException(e)
	};
	$.__regMobException = function (e) {
		this.__onUnLockReg();
		this.__unRegmobileLock();
		this.__bindMobileModule._$fastRegException(e)
	};
	$.__getTicketException = function (e) {
		this.__onUnLockReg();
		var t = e.ret;
		if (n._$indexOf(["108", "109", "110", "111"], t) !== -1)
			if ("111" === t) {
				if (6 === this.__cf) {
					var i = o._$getAiBtnTxt();
					o._$showError(null, i, "nerror");
					this.__showCheckCode(e, 1, 1)
				} else this.__showCheckCode(e);
				return
			} else this.__showCheckCode(e);
		else if (this.__isPopAndSlide()) this.__registerModule._$setNeedCheckCode();
		else this.__showCheckCode(e);
		this.__registerModule._$checkEndException(e)
	};
	$.__fastException = function (e) {
		this.__onUnLockReg();
		this.__unRegmobileLock();
		if ("2" == this.__captype) this.__bindMobileModule._$fastRegException(e);
		else this.__registerModule._$fastRegException(e, "", {
			cf: this.__cf
		})
	};
	$.__fastRegOk = function (e) {
		var t;
		this.__unRegmobileLock();
		this.__dt = e.dt || "01";
		if (e.nextUrls) this.__setDomainsNoPathbAndOpd({
			type: "regcksuccess",
			username: "",
			nextUrls: e.nextUrls
		});
		else this.__onUnLockReg(); if ("201" === e.ret) {
			t = this.__username;
			this.__url = e.url || "";
			this.__onRegSuccess()
		} else if ("202" === e.ret) {
			t = this.__username;
			this.__saveurl = o._$getCommonEmail(t);
			this.__onReg3P()
		}
		this._$dispatchEvent("oninit", 1)
	};
	$.__checkAiCapState = function () {
		var e = !0;
		if (6 === this.__cf) e = !!this.__registerModule._$getAiCapState();
		return e
	};
	$.__doRegCb = function (e, t) {
		if (this.__registerModule) {
			this.__pass = e;
			if (e)
				if (this.__options.needRegAgree && !this.__zcAgreeInput.checked) {
					this.__onUnLockReg();
					o._$showError(100, "您需要同意相关条款才能注册", "nerror")
				} else {
					if (!this.__checkAiCapState()) {
						o._$removeError({
							name: "slide"
						}, "nerror");
						this.__registerModule._$doVerify();
						return
					}
					this.__doRegReal()
				} else {
				this.__onUnLockReg();
				if (this.__registerModule._$getHasRegFlag()) return;
				if ("email" === t && !this.__nameinput.value) o._$showError(this.__nameinput, "请输入帐号", "nerror");
				else if ("password" === t && !this.__passwordinput.value) o._$showError(this.__passwordinput, "请输入密码", "nerror");
				else if ("tcheckcode" === t && !this.__checkcodeinput.value) o._$showError(this.__checkcodeinput, "请输入图片验证码", "nerror");
				else if ("slidecap" === t) {
					if (this.__registerModule) _txt = 2 == this.__registerModule.__slideTarget ? window._$capTxt1 : window._$capTxt2;
					if (this.__isPopAndSlide()) {
						var i;
						if (4 == this.__cf) i = {
							ret: "109"
						};
						if (5 == this.__cf) i = {
							ret: "110"
						};
						this.__showCheckCode(i, 1)
					} else o._$showError({
						name: "slide"
					}, _txt, "nerror")
				}
			}
		}
	};
	$.__onAiUnlockBtn = function () {
		this.__lockReg = 0
	};
	$.__doRegReal = function () {
		this.__onDoLockReg();
		if (this.__collect) this._events = this.__collect._$getEvents();
		var e = this.__registerModule._$getValues();
		this.__username = e[0].trim();
		this.__password = e[1];
		this.__smscode = e[2];
		if (this.__pass) {
			var t = {
				un: this.__username,
				pw: MP.encrypt(this.__password, this.__username),
				events: JSON.stringify(this._events),
				channel: 2,
				pd: this.__product,
				pkid: this.__promark
			};
			s._$request("getTicket", t, this.__getTicket._$bind(this), this.__getTicketException._$bind(this))
		}
	};
	$.__onUnLockReg = function () {
		this.__lockReg = 0;
		if (this.__regBtn && this.__regBtnTxt) this.__regBtn.innerHTML = o._$HtmlEncode(this.__regBtnTxt)
	};
	$.__onDoLockReg = function (e) {
		e = e || {};
		this.__lockReg = 1;
		this.__regBtn = t._$get("doregister");
		var i = "string" == typeof this.__regBtn.textContent ? this.__regBtn.textContent : this.__regBtn.innerText;
		if (i != (e.txt || this.__regLockTxt)) this.__regBtnTxt = i;
		if (!e.noTxt) this.__regBtn.innerHTML = o._$HtmlEncode(e.txt || this.__regLockTxt)
	};
	$.__doReg = function () {
		var e = "-103";
		if (0 === this.__hasInit) o._$showFail("-104");
		else if (this.__hasInit === -1) {
			o._$showFail(e, "注册");
			return
		}
		if (!this.__lockReg && this.__hasInit)
			if (!o._$fail5check("mailreg"))
				if (!this.__registerModule._$getHasRegFlag()) {
					this.__onDoLockReg({
						noTxt: 1
					});
					this.__registerModule._$stateOK(this.__doRegCb._$bind(this))
				} else this.__onUnLockReg()
	};
	$.__getDomains = function () {
		var e = this.__options.regDomains || "";
		var t = window["$regCookieDomain"] || "";
		if (e) e += t ? "," + t : "";
		else e = t;
		return e
	};
	$._$fastReg = function () {
		var e;
		e = {
			tk: this.__ticket,
			un: this.__username,
			pw: MP.encrypt(this.__password, this.__username),
			channel: 2,
			pkid: this.__promark,
			pd: this.__product
		};
		if ("2" === this.__captype) {
			e.mb = this.__bindmobile;
			e.sms = this.__bindsms
		}
		e.domains = this.__getDomains();
		s._$request("fastReg", e, this.__fastRegOk._$bind(this), this.__fastException._$bind(this))
	};
	$._$doToggleLock = function (e, i) {
		if (e) {
			t._$addClassName(this.__mainBtn, i);
			t._$dataset(this.__mainBtn, "lock", 1)
		} else {
			t._$delClassName(this.__mainBtn, i);
			t._$dataset(this.__mainBtn, "lock", 0)
		}
	};
	$._$safekeyboardMsg = function (e) {
		if (this.__mbRegModule) this.__mbRegModule._$safekeyboardMsg(e)
	}
}, "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "53c267efd983fb8c66cb645beead7a8d", "12c5dab742044e15807978f676f5c3fc", "bff3d86ec4ea91399919ee4963badfeb", "a4de926c2d79e8d8f856eaff4dac0f8b", "15dadd8bbdea76cdae0add1f8dec1460", "aa4a3754f70e632205fd7e90aecf3619", "dde0e6b40e64b3f022ca4ad9ab8b1a9c", "23e5675795b942746eac3b34e36aa849", "7b21e2d34151b2744c99076d5be5823a", "b87b783e8fe7b8a80eb0f2a116abb4ac", "6ea0215970b9a141ebcd2546bb2ad5d7", "46a4de3a50f50a600950ca9cee88031e");
I$("d9c6ce60dbff98dbeeee86945957430a", function (e, t, i, n, s, a, r, o, c, d, _, l, u, f, h, p, m, g, b, v) {
	window._$URS = {};
	var $, y = {
		1: "red",
		2: "orange",
		3: "green",
		4: "blue"
	};
	var C = "MP2-WEBINITOK:";
	m._$$IndexBase = t._$klass();
	$ = m._$$IndexBase._$extend(a._$$EventTarget);
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
			var a = {
				configServer: "webzjac.reg.163.com",
				apiServer: "webzjac.reg.163.com",
				staticServer: "acstatic-dun.126.net"
			};
			var r = {
				staticServer: "acstatic.dun.163yun.com"
			};
			if (e) {
				n = "//acstatic-dun-v6.126.net/tool.min.js";
				a = {
					configServer: "webzjac-v6.reg.163.com",
					apiServer: "webzjac-v6.reg.163.com",
					staticServer: "acstatic-dun-v6.126.net"
				}
			}
			var o = "conf0" === t;
			return {
				staticjs0: location.protocol + (o ? n : s),
				staticjs1: location.protocol + (o ? s : n),
				__serverConfig__: o ? a : r
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
			}, 100)
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
		s._$forIn(e, function (e, i) {
			if (s._$indexOf(["needanimation", "nocover", "iframeShowAnimation", "otherThirdLink"], i) !== -1) t = !1;
			if ("version" === i && !d._$isVersionOk(e) || "isHttps" === i && 1 !== e || "PROTOCOL" === i && "http" === e || "REGPROTOCOL" === i && "http" === e) t = !1
		});
		return t
	};
	$.__chromeSupportCheck = function () {
		if (this.__options.chromeSupport)
			if (!d._$isNewRequest() || "https:" !== location.protocol || "1" != this.__options.newCDN) {
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
			if (i && i.indexOf("dl.reg.163.com") < 0)
				if (window._$needUrsBgp && t.passportNeedUrsBgp) window._$needUrsBgp = 1;
				else window._$needUrsBgp = 0;
			window.isHttps = t.isHttps || 0;
			window.PROTOCOL = "http" == t.PROTOCOL ? "http://" : "https://";
			window.REGPROTOCOL = "http" == t.REGPROTOCOL ? "http://" : "https://";
			if (window.isHttps) {
				window.PROTOCOL = "https://";
				window.REGPROTOCOL = "https://"
			}
			if (!this.__tryUnload(t))
				if (this.__chromeSupportCheck()) {
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
			var a = "conf0" === t;
			return {
				staticjs0: location.protocol + (a ? i : n),
				staticjs1: location.protocol + (a ? n : i)
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
			s._$forIn(u, function (t, i) {
				u[i] = p.showText(t, e)
			});
			s._$forIn(f, function (t, i) {
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
			var a = document.createElement("link");
			a.rel = "stylesheet";
			a.type = "text/css";
			a.href = "../../webapp/res/css/" + t + ".css";
			document.getElementsByTagName("head")[0].appendChild(a)
		}
	};
	$.__saveTempValue = function (e) {
		var t = i._$get("phoneipt");
		if ("mbRegGoLogin1" == e || "mbRegGoLogin2" == e || "mbLoginGoReg" == e)
			if (t && this.__opt) {
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
			a = i._$dataset(t, "mdtype"),
			r = i._$dataset(t, "log"),
			o;
		if (r) {
			r = this.__saveTempValue(r);
			d._$sendLog(r)
		}
		d._$doProxyLink(e);
		if ("changepage" == s) {
			this.__mdType = a;
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
		if (d._$testOrigin(i))
			if (this.__rg) this.__rg._$safekeyboardMsg(e)
	};
	$._$safeCheck = function () {
		var e = this.__options.enlang;
		if (1 == e) {
			var t = p.showText("获取验证码", e);
			this.__options.getsmstxt = this.__options.getsmstxt ? d._$HtmlEncode(this.__options.getsmstxt) : t
		} else this.__options.getsmstxt = this.__options.getsmstxt ? d._$HtmlEncode(this.__options.getsmstxt) : "获取验证码"; if (this.__options.hasMbQuestionUrl && !d._$notURL(this.__options.hasMbQuestionUrl)) this.__options.hasQuestion = this.__options.hasMbQuestionUrl;
		if (this.__options.mailloginclause) {
			if (this.__options.mailloginclause.list) this.__options.mailloginclause.list = d._$listSafeUrlFilter(this.__options.mailloginclause.list);
			if (this.__options.mailloginclause.clauseErr) this.__options.mailloginclause.clauseErr = d._$HtmlEncode(this.__options.mailloginclause.clauseErr)
		}
		if (this.__options.mbloginclause) {
			if (this.__options.mbloginclause.list) this.__options.mbloginclause.list = d._$listSafeUrlFilter(this.__options.mbloginclause.list);
			if (this.__options.mbloginclause.clauseErr) this.__options.mbloginclause.clauseErr = d._$HtmlEncode(this.__options.mbloginclause.clauseErr)
		}
	}
}, "a878c0216188111f46d39b9df767b354", "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "e0793c838b68fed5a7e1742035643bec", "12c5dab742044e15807978f676f5c3fc", "c488423b9f57765277b603bdd1fe75ea", "8f33f2dc03528616b29dd40cc05162ac", "a4de926c2d79e8d8f856eaff4dac0f8b", "285e64765191768caf2cc6de0397e37c", "dde0e6b40e64b3f022ca4ad9ab8b1a9c", "d6e36b6b1f96e15e42725a59e7acd142", "0a1f43423259f38e3b62bed150ead0f8", "54120fa727d71cd38f3b1273d034afef", "46a4de3a50f50a600950ca9cee88031e");
I$("6e03360fbae81b4ba0e4a28f0b7de97b", '<div style="display:none;" id="jst-template">\n    <!-- 登录 -->\n    <textarea name="jst" id="login-tmp">\n        <form id="login-form">\n            <div class="m-container ${clazz}">\n                <!--帐号-->\n                <div class="inputbox" id="account-box">\n                    <div class="u-logo"><div class="u-logo-img1"></div></div>\n                    <div class="u-input box">\n                        <label class="u-label f-dn">${emailPlaceholder}</label>\n                        <input data-placeholder="${emailPlaceholder}" name="email" data-type="email" data-loginName="loginEmail" data-required="true" class="j-inputtext dlemail j-nameforslide" type="text" autocomplete="off" tabindex="1" spellcheck="false">\n                        <span class="pr-domain j-prdomain f-dn"></span>\n                    </div>\n                    <div class="u-tip"><div class="u-success u-clear"></div></div>\n                </div>\n                <div class="fur-change-email"></div>\n                <!--密码-->\n                <div class="inputbox">\n                    <div class="u-logo"><div class="u-logo-img2"></div></div>\n                    <div class="u-input box">\n                        <label class="u-label f-dn">${pwdPlaceholder}</label>\n                        <input type="password" style="display:none;width:0;height:0;">\n                        <input data-placeholder="${pwdPlaceholder}" name="password" maxlength="50" data-required="true" class="j-inputtext dlpwd" type="password" autocomplete="new-password"  data-max-length="50" tabindex="2" spellcheck="false">\n                        <input maxlength="50" data-placeholder="${pwdPlaceholder}" type="text" id="pwdtext" class="u-pwdtext" />\n                    </div>\n                    <div class="u-tip"><div class="u-success u-clear"></div></div>\n                </div>\n                <!-- 验证码 -->\n                <div class="ckbox m-ckcnt f-cb f-dn">\n                    <div class="inputbox ckin">\n                        <div class="u-input">\n                            <label class="u-label f-dn">${imageCode}</label>\n                            <input data-placeholder="${imageCode}" name="checkcode" class="j-inputtext cktext" type="text" data-required="true" data-max-length="4" maxlength="4"  data-pattern="^[0-9a-zA-Z]{4,6}$" tabindex="3" spellcheck="false" autocomplete="off">\n                        </div>\n                        <div class="u-tip"><div class="u-success u-clear"></div></div>\n                        <div class="u-tip"><div class="u-success u-suc"></div></div>\n                    </div>\n                    <div class="inputbox ckimgbox f-fr">\n                        <img class="ckimg" title="${imgCodeRefresh}" alt="${imgCodeGet}" onerror="">\n                    </div>\n                    {if imgRefreshTip}\n                    <a class="cklink j-cklink" href="javascript:void(0);">${imgPicGet}</a>\n                    {/if}\n                </div>\n                <!-- 滑块验证码 -->\n                <div class="ckbox m-ckcnt slidebox f-cb f-dn" style="position: relative;">\n                    <div class="ScapTcha" id="ScapTcha"></div>\n                    <input type="hidden" id="pwd" value=""/>\n                    <input type="hidden" id="ct" value=""/>\n                    <input name="slidecap" style="height:0;width:0;display:none;" type="text" data-required="true" value="" />\n                </div>\n                <!-- 错误提示 -->\n                <div class="m-etbox" style="display:none;">\n                    <div class="ettip">\n                        <div class="etimgbox">\n                            <div class="img etimg"></div>\n                        </div>\n                        <div class="ettext">${warn}</div>\n                    </div>\n                </div>\n                <div class="m-nerror f-dn" id="nerror"></div>\n                <!-- 登录条款 -->\n                {if isVersionFour && mailloginclause && mailloginclause.length>0}\n                    <div class="fur-item fur-agree fur-agree-4 m-mail-clause">\n                        <label>\n                            <span name="mailclause" class="u-dl-agree j-mail-clause-span"><input type="checkbox" class="dl-clause-login j-mail-clause-checkbox" checked="checked"></span> ${agreeText|escape} {list mailloginclause as c}<a href=${c.url|escape} target="_blank" tabindex="-1" data-outlink="1">${c.txt|escape}</a>{if c_index==mailloginclause.length-2} ${andText|escape} {elseif c_index<mailloginclause.length-1}、{/if}\n                            {/list}\n                        </label>\n                    </div>\n                {/if}\n                <!-- 登录按钮 -->\n                <div class="f-cb loginbox">\n                    <a href="javascript:void(0);" id="dologin" data-action=\'dologin\' class="u-loginbtn btncolor tabfocus" tabindex="8">${btnTxt}</a>\n                </div>\n                <!-- 登录条款 -->\n                {if !isVersionFour && mailloginclause && mailloginclause.length>0}\n                    <div class="fur-item fur-agree m-mail-clause">\n                        <label>\n                            <span name="mailclause" class="u-dl-agree j-mail-clause-span"><input type="checkbox" class="dl-clause-login j-mail-clause-checkbox" checked="checked"></span> ${agreeText|escape} {list mailloginclause as c}<a href=${c.url|escape} target="_blank" tabindex="-1" data-outlink="1">${c.txt|escape}</a>{if c_index==mailloginclause.length-2} ${andText|escape} {elseif c_index<mailloginclause.length-1}、{/if}\n                            {/list}\n                        </label>\n                    </div>\n                {/if}\n                <!-- 免登复选框 -->\n                <div class="m-unlogin">\n                    <div class="b-unlogn j-unlogn f-dn">\n                        <span class="u-checkbox tabfocus">\n                            <input id="un-login" type="checkbox" name="un-login" class="un-login">\n                        </span>\n                        <label for="un-login">${unLoginText|escape}</label>\n                    </div>\n                    <a class="forgetpwd j-redirect j-fglink" data-outlink="1" href="${forgetpwdlink|escape}" target="_blank">${forgetText|escape}</a>\n                    <a id="changepage" data-action="changepage" class="u-regbtn bgcolor tabfocus j-redirect" href="javascript:void(0);" data-outlink="2" target="_self" tabindex="11">${gotoRegText|escape}</a>\n\n                </div>\n                <!-- 第三方登录 -->\n                {if config && config.length}\n                <div class="m-ologin">\n                    <div class="otip f-fl">${otherLoginTxt}</div>\n                    <div class="olist">\n                        {list config as o}\n                            <a data-width="${o.width|escape}" data-height="${o.height|escape}" data-outlink="1" data-link="${o.url|escape}" class="f-cb f-fl third ${o.name|escape} j-redirect" href="javascript:void(0);"></a>\n                        {/list}\n                    </div>\n                </div>\n                {/if}\n            </div>\n        </form>\n    </textarea>\n    <!-- 登录手机验证 -->\n    <textarea name="jst" id="phone-tmp">\n        <form id="phone-form" action="javascript:void(0);">\n            <!--手机验证-->\n            <div id="phonecheck-box" class="m-pccnt">\n                <p>请用手机<span id="pp_mb"></span>进行安全验证：</p>\n                <div class="m-pcbox">\n                    <div class="inputbox m-pc">\n                        <div class="u-input">\n                            <label class="u-label f-dn">请输入短信验证码</label>\n                            <input data-placeholder="请输入短信验证码" name="phonecode" class="j-inputtext pcin" type="tel" data-max-length="6" data-name="smscode" maxlength="6" data-required="true" data-pattern="^\\d{6}$" tabindex="5" spellcheck="false" autocomplete="off">\n                        </div>\n                        <div class="u-tip"><div class="u-success u-clear"></div></div>\n                    </div>\n                    <div class="pcbtn">\n                        <a class="tabfocus getsmscode" tabindex="6">${getsmstxt}</a>\n                    </div>\n                </div>\n            </div>\n            <!-- 错误提示 -->\n            <div class="m-nerror f-dn" id="nerror"></div>\n            <div class="f-cb btnbox unlockbox">\n                <a data-action=\'dounlock-ph\' class="u-loginbtn btncolor tabfocus" tabindex="9">确&nbsp;&nbsp;认</a>\n            </div>\n            <p class="t-appeal">无法安全验证？你可以<a href="https://mima.163.com/nie/" target="_blank">帐号申诉</a></p>\n        </form>\n    </textarea>\n    <!--登录：将军令二次验证-->\n    <textarea name="jst" id="otp-tmp">\n        <form id="otp-form" action="javascript:void(0);">\n\n            <div id="optcheck-box" class="m-pccnt">\n                <p>你是将军令用户，请验证将军令动态密码：</p>\n                <div class="m-pcbox">\n                    <div class="inputbox">\n                        <div class="u-input">\n                            <label class="u-label f-dn">请输入动态密码</label>\n                            <input data-placeholder="请输入动态密码" name="otpcode" class="j-inputtext dlpwd" type="tel" data-max-length="6" data-name="otpcode" maxlength="6" data-required="true" data-pattern="^\\d{6}$" tabindex="5" spellcheck="false" autocomplete="off">\n                        </div>\n                        <div class="u-tip"><div class="u-success u-clear"></div></div>\n                    </div>\n                </div>\n            </div>\n            <!-- 错误提示 -->\n            <div class="m-nerror f-dn" id="nerror"></div>\n            <div class="f-cb btnbox unlockbox">\n                <a data-action=\'dounlock-otp\' class="u-loginbtn btncolor tabfocus" tabindex="9">确&nbsp;&nbsp;认</a>\n            </div>\n            <p class="t-appeal">无法安全验证？你可以<a href="https://mima.163.com/nie/" target="_blank">帐号申诉</a></p>\n\n\n        </form>\n    </textarea>\n    <!--登录：密保卡二次验证-->\n    <textarea name="jst" id="ppc-tmp">\n        <form id="ppc-form" action="javascript:void(0);">\n\n            <div id="ppccheck-box" class="m-pccnt">\n                <p>你是密保卡用户，请输入密保卡上对应的数字</p>\n                <div class="m-ppcbox">\n                        <label class="u-label f-dn"></label>\n                        <span class="i-card">\n                            <label for="c1" class="coord clr1">##</label>\n                            <input id="c1" type="tel"  autocomplete="off" class="j-inputtext c-ipt" data-max-length="3" data-name="ppccode" maxlength="3" data-required="true" data-pattern="^\\d{1,3}$" tabindex="5" spellcheck="false">\n                        </span>\n                        <span class="i-card">\n                            <label for="c2" class="coord clr2">##</label>\n                            <input id="c2" type="tel" autocomplete="off" class="j-inputtext c-ipt" data-max-length="3" data-name="ppccode" maxlength="3" data-required="true" data-pattern="^\\d{1,3}$" tabindex="5" spellcheck="false">\n                        </span>\n                        <span class="i-card">\n                            <label for="c3" class="coord clr3">##</label>\n                            <input id="c3" type="tel" autocomplete="off" class="j-inputtext c-ipt" data-max-length="3" data-name="ppccode" maxlength="3" data-required="true" data-pattern="^\\d{1,3}$" tabindex="5" spellcheck="false">\n                        </span>\n                        <div class="u-tip f-dn"><div class="u-success u-clear"></div></div>\n\n                </div>\n            </div>\n\n            <!-- 错误提示 -->\n            <div class="m-nerror f-dn" id="nerror"></div>\n            <div class="f-cb btnbox unlockbox">\n                <a data-action=\'dounlock-ppc\' class="u-loginbtn btncolor tabfocus" tabindex="9">确&nbsp;&nbsp;认</a>\n            </div>\n            <p class="t-appeal">无法安全验证？你可以<a href="https://mima.163.com/nie/" target="_blank">帐号申诉</a></p>\n\n        </form>\n    </textarea>\n    <!-- 二维码页面 -->\n    <textarea  name="jst" id="qrcode-tmp">\n        <div class="m-qrcode">\n            <div class="j-qrblock">\n                <div class="tlt">手机扫码&nbsp;&nbsp;安全防盗</div>\n                <img src="" class="i-qrcode j-qrcode"/>\n                <div class="warn j-owarm">二维码已失效<br/>请点击刷新</div>\n                <div class="subtlt tip">使用<a class="j-toolapp" href="" target="_blank"></a>扫一扫快速登录</div>\n                <div class="m-goregqr"><a class="m-goregqr-a j-goRegQrUrl" href="javascript:void(0);" target="_blank"></a></div>\n            </div>\n            <div class="j-qrsucc f-dn">\n                <div class="i-qrsucc"></div>\n                <p class="subtlt succ">扫码成功，请在手机上确认登录</p>\n                <a href="javascript:void(0);" class="qrback j-qrback">返回重新扫码</a>\n            </div>\n        </div>\n    </textarea>\n    <!-- 异常页面3 ：裸帐号-->\n    <textarea name="jst" id="exception3-tmp">\n        <div class="w-exception">\n            <div class="img close u-closebtn" data-action="doclose"></div>\n            <div class="cnt">\n                <div class="img warnlogo"></div>\n                <div class="note">\n                    <p>${tip1}</p>\n                    <p>${tip2}</p>\n                </div>\n                <div class="btnbox">\n                    <a data-action=\'leakLogin\' class="u-btn u-btn-middle3 f-ib bgcolor f-fl">${loginTxt}</a><a class="u-btn-middle3 btncolor j-redirect f-fr" target="_blank" href="//reg.163.com/reinforce/in.do?source=bindmobile&from=webzj_${product}&promark=webzj_${promark}">${bindMobile}</a>\n                </div>\n            </div>\n        </div>\n    </textarea>\n    <!-- 异常页面1 ：风控帐号-->\n    <textarea name="jst" id="exception1-tmp">\n        <div class="w-exception">\n            <div class="img close u-closebtn" data-action="doclose"></div>\n            <div class="cnt">\n                <div class="img warnlogo"></div>\n                <div class="note">\n                    <p>${tip1}</p>\n                    <p>${tip2}</p>\n                </div>\n                <div class="btnbox">\n                    <a data-srclist=\'${srclist}\' data-action=\'leakLogin\' class="u-btn u-btn-middle3 f-ib bgcolor f-fl">${loginTxt}</a><a class="u-btn-middle3 btncolor j-redirect f-fr" target="_blank" href="//reg.163.com/reinforce/in.do?source=chgpass&from=webzj_${product}&promark=webzj_${promark}">${pwdTxt}</a>\n                </div>\n            </div>\n        </div>\n    </textarea>\n    <!-- 异常页面2 : 找回密码 -->\n    <textarea name="jst" id="exception2-tmp">\n        <div class="w-exception">\n            <div class="img close u-closebtn" data-action="doclose"></div>\n            <div class="cnt">\n                <div class="img warnlogo"></div>\n                <div class="note">\n                    <p>${tip1}</p>\n                    <p>${tip2}</p>\n                </div>\n                <div class="btnbox">\n                    <a data-action=\'leakLogin\' class="u-btn u-btn-middle3 f-ib bgcolor f-fl">${backTxt}</a><a class="u-btn-middle3 btncolor j-redirect f-fr" target="_blank" href="//reg.163.com/resetpwd/index.do">${pwdText}</a>\n                </div>\n            </div>\n        </div>\n    </textarea>\n    <!-- 异常页面 : 黑产 -->\n    <textarea name="jst" id="exception4-tmp">\n        <div class="w-exception">\n            <div class="cnt">\n                <div class="img warnlogo"></div>\n                <div class="note">\n                    <p>${txt1}</p>\n                    <p>${txt2}</p>\n                </div>\n                <div class="btnbox">\n                    <a data-action=\'modeBack\' class="u-btn u-btn-middle3 f-ib bgcolor f-fl">${btnTxt0}</a><a class="u-btn-middle3 btncolor j-redirect f-fr" target="_blank" href="${btnLink1}">${btnTxt1}</a>\n                </div>\n            </div>\n        </div>\n    </textarea>\n    <!-- 通用异常页面 -->\n    <textarea name="jst" id="exception-tmp-0">\n        <div class="w-exception-normal">\n            <div class="img close u-closebtn" data-action="doclose"></div>\n            <div class="cnt">\n                <div class="img warnlogo">\n                    <img src="${img0}">\n                </div>\n                <div class="note">\n                    ${txt0}\n                </div>\n                <div class="btnbox">\n                    <a data-action=\'modeGoon\' data-srclist=\'${srclist}\' class="u-btn u-btn-middle3 f-ib bgcolor">${btnTxt0}</a>\n                </div>\n            </div>\n        </div>\n    </textarea>\n    <textarea name="jst" id="exception-tmp-1">\n        <div class="w-exception-normal">\n            <div class="img close u-closebtn" data-action="doclose"></div>\n            <div class="cnt">\n                <div class="img warnlogo">\n                    <img src="${img0}">\n                </div>\n                <div class="note">\n                    ${txt0}\n                </div>\n                <div class="btnbox">\n                    <a class="u-btn-middle3 btncolor j-redirect" target="_blank" href="${btnLink0}">${btnTxt0}</a>\n                </div>\n            </div>\n        </div>\n    </textarea>\n    <textarea name="jst" id="exception-tmp-2">\n        <div class="w-exception-normal">\n            <div class="img close u-closebtn" data-action="doclose"></div>\n            <div class="cnt">\n                <div class="img warnlogo">\n                    <img src="${img0}">\n                </div>\n                <div class="note">\n                    ${txt0}\n                </div>\n                <div class="btnbox">\n                    <a data-action=\'modeBack\' data-srclist="${srclist}" class="u-btn u-btn-middle3 f-ib bgcolor f-fl">${btnTxt0}</a><a class="u-btn-middle3 btncolor j-redirect f-fr" target="_blank" data-action=\'modeBack\' href="${btnLink1}">${btnTxt1}</a>\n                </div>\n            </div>\n        </div>\n    </textarea>\n    <textarea name="jst" id="exception-tmp-3">\n        <div class="w-exception-normal">\n            <div class="img close u-closebtn" data-action="doclose"></div>\n            <div class="cnt">\n                <div class="img warnlogo">\n                    <img src="${img0}">\n                </div>\n                <div class="note">\n                    ${txt0}\n                </div>\n                <div class="btnbox">\n                    <a data-action=\'modeGoon\' data-srclist=\'${srclist}\' class="u-btn u-btn-middle3 f-ib bgcolor f-fl">${btnTxt0}</a><a class="u-btn-middle3 btncolor j-redirect f-fr" target="_blank" href="${btnLink1}">${btnTxt1}</a>\n                </div>\n            </div>\n        </div>\n    </textarea>\n    <textarea name="jst" id="exception-tmp-4">\n        <div class="w-exception">\n            <div class="img close u-closebtn" data-action="doclose"></div>\n            <div class="cnt">\n                <div style="padding:10px 10px 30px;" class="m-ismyphone">\n                    <p class="m-ismyphone-p0" style="font-size:14px;text-align:left;line-height:20px;padding-top:20px;">${txt0}</p>\n                    <p class="m-ismyphone-p1" style="font-size:14px;text-align:left;padding-top:35px;">\n                        <input type="checkbox" id="ismyphonebox" style="width:15px;background:none;height:15px;position:relative;top:2px;">${txt1}\n                    </p>\n                </div>\n                <div class="btnbox">\n                    <a data-srclist=\'${srclist}\' data-action="myphonegoon" class="u-btn u-btn-middle3 f-ib bgcolor f-fl">${btnTxt0}</a>\n                    <a class="u-btn-middle3 btncolor j-redirect f-fr" target="_blank" href="${btnLink1}">${btnTxt1}</a>\n                </div>\n            </div>\n        </div>\n    </textarea>\n    <textarea name="jst" id="verify-phone-tmp">\n        <form id="reg-phone-form" class="page-sms">\n            <div class="m-pccnt">\n                <div class="reg-phone-nomobile-box">\n                    <div class="ph-tip">本次登录需要短信验证，请按以下提示操作</div>\n                    <div class="inputbox">\n                        <div class="u-input">\n                            <label class="u-label f-dn">请输入手机号</label>\n                            <input data-placeholder="请输入手机号" name="phone" class="j-inputtext" type="tel" data-required="true" data-name="phone" data-pattern="^(13|14|15|16|17|18|19)\\d{9}$" tabindex="1" spellcheck="false" autocomplete="off" maxlength="11" />\n                        </div>\n                        <div class="u-tip"><div class="u-success u-clear"></div></div>\n                    </div>\n                    <div class="inputbox f-dn" style="z-index:99;">\n                        <div class="m-country" style="overflow:visible;">\n                            <label class="u-label f-dn">请输入手机号</label>\n                            <div class="country flag-US j-itlBtn" data-code="+86-">\n                                <em class="j-country-code">+86</em>\n                            </div>\n                            <input style="position:absolute;left:50px;" data-placeholder="请输入手机号" name="phone-itl" class="j-inputtext j-itlphone" type="tel" data-name="phone-itl" tabindex="2" spellcheck="false" autocomplete="off" maxlength="50" />\n                            <div class="u-tip"><div class="u-success u-clear"></div></div>\n                        </div>\n                    </div>\n                    <div class="u-toggleitlbox"><a class="toggleitl j-cgp" href="javascript:void(0);">切换到国际手机</a></div>\n                </div>\n                <div class="inputbox3">\n                    <div class="tip">点击“获取验证码”发送短信到手机</div>\n                    <div class="mobile inputbox3mobile">${mobile}</div>\n                </div>\n                <div class="m-pcbox j-m-pcbox">\n                    <div class="inputbox m-pc">\n                        <div class="u-input">\n                            <label class="u-label f-dn">请输入短信验证码</label>\n                            <input data-placeholder="请输入短信验证码" name="phonecode" class="j-inputtext pcin" type="tel" data-max-length="6" maxlength="6" data-name="smscode" data-required="true" data-pattern="^\\d{6}$" tabindex="3" spellcheck="false" autocomplete="off">\n                        </div>\n                        <div class="u-tip"><div class="u-success u-clear"></div></div>\n                    </div>\n                    <div class="pcbtn">\n                        <a class="tabfocus" tabindex="4">${getsmstxt}</a>\n                    </div>\n                </div>\n                <div class="m-nerror f-dn" id="nerror"></div>\n            </div>\n\n            <div class="f-cb loginbox">\n                <a class="u-loginbtn btncolor tabfocus btndisabled" tabindex="5">确&nbsp;&nbsp;定</a>\n            </div>\n\n            <div class="fur-item fur-submit" style="display:none;">\n                <button class="fur-btn fur-btn-small fur-btn-captcha-submit captcha-btn0" type="submit">\n                    <span>继续注册</span>\n                </button>\n                <div class="captcha-btn1">\n                    <span>返&nbsp;&nbsp;回</span>\n                </div>\n            </div>\n            <div class="m-etbox fur-smserror2" style="display:none;">\n                <div class="ettip">\n                    <div class="smserror2"></div>\n                </div>\n            </div>\n\n            <div class="m-etbox fur-smserror" style="display:none;">\n                <div class="ettip">\n                    <div class="etimgbox">\n                        <div class="etimg"></div>\n                    </div>\n                    <div class="ettext">您的操作存在异常，请您进行验证后继续注册</div>\n                </div>\n            </div>\n        </form>\n    </textarea>\n    <!-- 异常页面：邮箱帐号登录裸账号强制绑定手机 返回的data-action \'doback\' 171103 hzhuangdi -->\n    <textarea name="jst" id="exception5-tmp">\n        <div class="w-exception">\n            <div class="img close u-closebtn" data-action="doclose"></div>\n            <div class="cnt">\n                <div class="img warnlogo"></div>\n                <div class="note">\n                    <p>${tip1}</p>\n                    <p>${tip2}</p>\n                </div>\n                <div class="btnbox">\n                    <a data-action=\'doback\' data-srclist="${srclist}" class="u-btn u-btn-middle3 f-ib bgcolor f-fl">${backBtnTxt}</a><a class="u-btn-middle3 btncolor j-redirect f-fr" target="_blank" href="${btnLink1}">${protectText}</a>\n                </div>\n            </div>\n        </div>\n    </textarea>\n    <!-- END 异常页面：邮箱帐号登录裸账号强制绑定手机 -->\n</div>\n');
I$("4bb17f3a2d1f21b6b75e84daab140453", '<div style="display:none;" id="jst-template">\n    <!-- 注册 -->\n    <textarea name="jst" id="register-tmp">\n        <div id="VIP" class="fur-vip" style="display:none;">\n            <a id="a-vip" target="_blank" href="//vpay.vip.163.com/vippayunion/index.html" class="btn-vip" >注册VIP邮箱</a>\n        </div>\n        <form id="register-form">\n            <div class="m-container">\n                <!--帐号-->\n                <div class="inputbox inputbox2 {if mailDisabled}inputbox-disabled{/if} " id="account-box">\n                    <div class="u-input box">\n                        <label class="u-label f-dn">${emailPlaceholder}</label>\n                        <input {if mailDisabled}disabled{/if} data-placeholder="${emailPlaceholder}" name="email" data-auto-focus="false" data-required="true" class="j-inputtext zcemail j-nameforslide" type="text" autocomplete="off" tabindex="1" spellcheck="false">\n                    </div>\n                    <div class="u-tip"><div class="u-success u-clear"></div></div>\n                </div>\n                <!--切换后缀模式-->\n                <div class="fur-change-email"></div>\n                <!--密码-->\n                <div class="inputbox">\n                    <div class="u-input box">\n                        <label class="u-label f-dn">${pwdPlaceholder}</label>\n                        <input type="password" style="display:none;width:0;height:0;">\n                        <input data-placeholder="${pwdPlaceholder}" name="password" data-required="true" class="j-inputtext zcpwd" type="password" autocomplete="new-password"  data-max-length="16" maxlength="16" tabindex="2" spellcheck="false">\n                        {if mailRegHasEye}\n                            <input maxlength="16" data-placeholder="${pwdPlaceholder}" type="text" id="pwdtext" class="u-pwdtext" />\n                        {/if}\n                    </div>\n                    <div class="u-tip"><div class="u-success u-clear"></div></div>\n                </div>\n                {if hasIdCard}\n                <div class="fur-change-email"></div>\n                <div class="inputbox inputbox2">\n                    <div class="u-input box">\n                        <label class="u-label f-dn">请输入姓名</label>\n                        <input data-placeholder="请输入姓名" name="realname" data-auto-focus="false" data-required="true" class="j-inputtext" type="text" autocomplete="off" tabindex="3" spellcheck="false">\n                    </div>\n                    <div class="u-tip"><div class="u-success u-clear"></div></div>\n                </div>\n                <div class="fur-change-email"></div>\n                <div class="inputbox inputbox2">\n                    <div class="u-input box">\n                        <label class="u-label f-dn">请输入18位身份证号</label>\n                        <input data-placeholder="请输入18位身份证号" name="idcard" data-auto-focus="false" data-required="true" class="j-inputtext" type="text" autocomplete="off" tabindex="4" spellcheck="false">\n                    </div>\n                    <div class="u-tip"><div class="u-success u-clear"></div></div>\n                </div>\n                {/if}\n                <!-- 验证码 -->\n                <div class="m-pcbox ckbox f-dn">\n                    <div class="ckbox m-ckcnt f-cb">\n                        <div class="fur-item">\n                            <p>${capCodeTxt}</p>\n                        </div>\n                        <div class="inputbox ckin">\n                            <div class="u-input">\n                                <label class="u-label f-dn">${imgCodeTxt}</label>\n                                <input data-placeholder="${imgCodeTxt}" name="checkcode" class="j-inputtext cktext" type="text" data-required="true" data-max-length="4" maxlength="4" data-pattern="^[0-9a-zA-Z]{4,6}$" tabindex="5" spellcheck="false" autocomplete="off">\n                            </div>\n                            <div class="u-tip"><div class="u-success u-clear"></div></div>\n                            <div class="u-tip"><div class="u-success u-suc"></div></div>\n                        </div>\n                        <div class="inputbox ckimgbox f-fr">\n                            <img class="ckimg" title="${imgCodeRefresh}" alt="${imgCodeGet}" onerror="">\n                        </div>\n                        {if imgRefreshTip}\n                        <a class="cklink j-cklink" href="javascript:void(0);">${imgPicGet}</a>\n                        {/if}\n                    </div>\n                </div>\n                <!-- 滑块验证码 -->\n                <div class="ckbox m-ckcnt slidebox f-cb f-dn" style="position: relative;">\n                    <div class="ScapTcha" id="ScapTcha"></div>\n                    <input type="hidden" id="pwd" value=""/>\n                    <input type="hidden" id="ct" value=""/>\n                    <input name="slidecap" style="height:0;width:0;display:none;" type="text" data-required="true" value="" />\n                </div>\n                <!-- 错误提示 -->\n                <div class="m-etbox" style="display:none;">\n                    <div class="ettip">\n                        <div class="etimgbox">\n                            <div class="img etimg"></div>\n                        </div>\n                        <div class="ettext">${errorManyTxt}</div>\n                    </div>\n                </div>\n                <div class="m-nerror f-dn" id="nerror"></div>\n                {if isVersionFour}\n                <!-- 注册协议 -->\n                <div class="fur-item fur-agree fur-agree-4">\n                    <label>\n                        <span id="j-zc-agree" class="u-zc-agree u-zc-agree-select"><input type="checkbox" class="zc-un-login" checked="checked"></span> ${agreeTxt}<a href="//hc.reg.163.com/iTerm/doc.html?id=541" target="_blank" tabindex="-1" data-outlink="1">${emailAgree1}</a> ${andTxt} <a href="//hc.reg.163.com/iTerm/doc.html?id=437" target="_blank" tabindex="-1" data-outlink="1">${emailAgree2}</a>\n                    </label>\n                </div>\n                {/if}\n                <!-- 注册按钮 -->\n                <div class="f-cb loginbox">\n                    <a id="doregister" data-action=\'doregister\' class="u-loginbtn btncolor tabfocus" tabindex="6">${btnTxt}</a>\n                </div>\n                {if !isVersionFour}\n                <!-- 注册协议 -->\n                <div class="fur-item fur-agree">\n                    <label>\n                        <span id="j-zc-agree" class="u-zc-agree u-zc-agree-select"><input type="checkbox" class="zc-un-login" checked="checked"></span> ${agreeTxt}<a href="//hc.reg.163.com/iTerm/doc.html?id=541" target="_blank" tabindex="-1" data-outlink="1">${emailAgree1}</a> ${andTxt} <a href="//hc.reg.163.com/iTerm/doc.html?id=437" target="_blank" tabindex="-1" data-outlink="1">${emailAgree2}</a>\n                    </label>\n                </div>\n                {/if}\n                <a id="changepage" data-action="changepage" class="u-logbtn bgcolor tabfocus j-redirect" href="javascript:void(0);" data-outlink="2" target="_self" tabindex="11">${gotoLoginText|escape}</a>\n\n            </div>\n        </form>\n    </textarea>\n    <!-- 注册手机号强制绑定手机 -->\n    <textarea name="jst" id="register-phone-tmp">\n        <form id="reg-phone-form" class="page-sms">\n            <div class="m-pccnt">\n                <div class="reg-phone-nomobile-box">\n                    <div class="ph-tip">${smsbindTip}</div>\n                    <div class="inputbox">\n                        <div class="u-input">\n                            <label class="u-label f-dn">${mobileTxt}</label>\n                            <input data-placeholder="${mobileTxt}" name="phone" class="j-inputtext" type="tel" data-required="true" data-name="phone" data-pattern="^(13|14|15|16|17|18|19)\\d{9}$" tabindex="1" spellcheck="false" autocomplete="off" maxlength="11" />\n                        </div>\n                        <div class="u-tip"><div class="u-success u-clear"></div></div>\n                    </div>\n                    <div class="inputbox f-dn" style="z-index:99;">\n                        <div class="m-country" style="overflow:visible;">\n                            <label class="u-label f-dn">${mobileTxt}</label>\n                            <div class="country flag-US j-itlBtn" data-code="+86-">\n                                <em class="j-country-code">+86</em>\n                            </div>\n                            <input style="position:absolute;left:50px;" data-placeholder="${mobileTxt}" name="phone-itl" class="j-inputtext j-itlphone" type="tel" data-name="phone-itl" tabindex="2" spellcheck="false" autocomplete="off" maxlength="50" />\n                            <div class="u-tip"><div class="u-success u-clear"></div></div>\n                        </div>\n                    </div>\n                    <div class="u-toggleitlbox"><a class="toggleitl j-cgp" href="javascript:void(0);">${toItlMobileTxt}</a></div>\n                </div>\n                <div class="inputbox3">\n                    <div class="tip">点击“获取验证码”发送短信到手机</div>\n                    <div class="mobile inputbox3mobile">${mobile}</div>\n                </div>\n                <div class="m-pcbox j-m-pcbox">\n                    <div class="inputbox m-pc">\n                        <div class="u-input">\n                            <label class="u-label f-dn">${smsTxt}</label>\n                            <input data-placeholder="${smsTxt}" name="phonecode" class="j-inputtext pcin" type="tel" data-max-length="6" maxlength="6" data-name="smscode" data-required="true" data-pattern="^\\d{6}$" tabindex="3" spellcheck="false" autocomplete="off">\n                        </div>\n                        <div class="u-tip"><div class="u-success u-clear"></div></div>\n                    </div>\n                    <div class="pcbtn">\n                        <a class="tabfocus" tabindex="4">${getsmstxt}</a>\n                    </div>\n                </div>\n                <div class="m-nerror f-dn" id="nerror"></div>\n            </div>\n\n            <div class="f-cb loginbox">\n                <a class="u-loginbtn btncolor tabfocus btndisabled" tabindex="5">${regTxt}</a>\n            </div>\n\n            <div class="fur-item fur-submit" style="display:none;">\n                <button class="fur-btn fur-btn-small fur-btn-captcha-submit captcha-btn0" type="submit">\n                    <span>继续注册</span>\n                </button>\n                <div class="captcha-btn1">\n                    <span>返&nbsp;&nbsp;回</span>\n                </div>\n            </div>\n            <div class="m-etbox fur-smserror2" style="display:none;">\n                <div class="ettip">\n                    <div class="smserror2"></div>\n                </div>\n            </div>\n\n            <div class="m-etbox fur-smserror" style="display:none;">\n                <div class="ettip">\n                    <div class="etimgbox">\n                        <div class="etimg"></div>\n                    </div>\n                    <div class="ettext">${excepTxt}</div>\n                </div>\n            </div>\n        </form>\n    </textarea>\n    <!-- 内域注册成功页面 -->\n    <textarea name="jst" id="register-success">\n        <div class="m-cnt">\n            <div class="fur-page fur-page-success-netease">\n                <div class="fur-item">\n                    <div class="headicon fur-reg-success0"></div>\n                    <h3 class="thanks">${succTxt}</h3>\n                </div>\n                <div class="fur-btn-note" id="countdown"></div>\n            </div>\n        </div>\n    </textarea>\n    <!-- 外域注册成功页面 -->\n    <textarea name="jst" id="register-3p-success">\n        <div class="m-header">\n            <div class="u-closebtn u-closebtn1" data-action="doclose"></div>\n        </div>\n        <div class="m-cnt">\n            <div class="fur-page fur-page-success-3p">\n                <div class="fur-item">\n                    <div class="headicon fur-reg-success1"></div>\n                    <h3 class="thanks">${activeTxt}</h3>\n                </div>\n\n                <div class="fur-item">\n                    <p>${sendToTxt} <b class="fur-content-urs">${username}</b> ${activeTxt2}。<a class="u-howactive" target="_blank" href="https://hc.reg.163.com/webcomponentH5/doc.html?id=552&itemid=320">${activeTip}?</a></p>\n                </div>\n\n                {if activeurl}\n                <div class="f-cb loginbox">\n                    <a target="_blank" data-username="${username}" data-action="3psuccess" href="${activeurl}" class="u-loginbtn btncolor tabfocus">${goActive}</a>\n                </div>\n                {/if}\n            </div>\n        </div>\n        <!--页脚-->\n        <div class="fur-footer-ext">\n            <div class="fur-item fur-notice">\n                <p class="notice">${notGetTxt}</p>\n                <ol>\n                    <li>1. ${tryTxt1}</li>\n                    <li>2. <a data-action="resend" class="fur-btn-3p-send-again" href="javascript:void(0);">${doSendAgain}</a>${acitveMail}</li>\n                    <li>3.  ${changeMail}<a data-action="backreg" class="fur-btn-3p-reg-again" href="javascript:void(0);">${reRegister}</a></li>\n                </ol>\n            </div>\n        </div>\n    </textarea>\n</div>\n');
I$("0725741183df5ff898f8b2c242d049be", '<div style="display:none;" id="jst-template-pub">\n    <textarea name="jst" id="h-tmp">\n        <div style="height:427px;width:420px;"></div>\n    </textarea>\n    <textarea name="jst" id="upqrcode-tmp">\n        <div class="up-qrcode">\n            <div class="up-qrcode-tips">${scanTxt|escape}</div>\n            <div class="up-qrcode-close"></div>\n            <div class="up-qrcode-inner"></div>\n            <div class="arrow">\n                <em></em><span></span>\n            </div>\n        </div>\n    </textarea>\n    <textarea name="jst" id="error-tmp">\n        <div class=\'j-icon ferrortail${type}\'></div><div class=\'ferrorhead${type}\'>${str}</div>\n    </textarea>\n    <!-- 组件主框架结构 -->\n    <textarea name="jst" id="index-tmp">\n        {if (!needMobileLogin) && (!needMobileReg)}\n        <div class="m-header">\n            <div class="u-closebtn u-closebtn1" data-action="doclose"></div>\n            <div class="headimg j-headimg"></div>\n        </div>\n        {elseif needMobileLogin}\n        <div class="m-header f-cb m-header2">\n            <div class="u-closebtn u-closebtn1" data-action="doclose"></div>\n            <div class="j-headimg">\n                <div data-action="goEmailLogin" class="u-head1 active j-head">${goEmailLoginTxt|escape}</div>\n                <span class="line">&nbsp;</span>\n                <div id="mobileModule" data-action="goMbLogin" class="u-head2 j-head">${goMbLoginTxt|escape}</div>\n            </div>\n        </div>\n        {elseif needMobileReg}\n        <div class="m-header f-cb m-header2">\n            <div class="u-closebtn u-closebtn1" data-action="doclose"></div>\n            <div class="j-headimg">\n                <div data-action="goEmailReg" class="u-head1 active j-head">${goEmailRegTxt|escape}</div>\n                <span class="line">&nbsp;</span>\n                <div id="mobileReg" data-action="goMbReg" class="u-head2 j-head">${goMbRegTxt|escape}</div>\n            </div>\n        </div>\n        {/if}\n        <div class="m-cnt"></div>\n        <!-- 分割线 -->\n        <div class="m-sep">\n            <div class="leftsep f-fl"></div>\n            <div class="rightsep f-fr"></div>\n            <div class="centertext">网易用户中心</div>\n        </div>\n        <!--页脚-->\n        <div class="m-footer" id="footer">\n            <div class="f-cb">\n                <p class="f-fl tip m-sep">您还没有网易邮箱帐号？</p>\n                <p class="f-fr">\n                     <a class="btn-qrcode j-btnqrcode f-dn"></a>\n                </p>\n            </div>\n        </div>\n    </textarea>\n    <textarea name="jst" id="eye-tmp">\n        <div class="u-success u-eye"></div>\n    </textarea>\n</div>\n');
I$("28369fe88d542f8619c1b3c7dbc327b3", function (e, t, i, n, s, a, r, o, c, d, _, l, u, f, h, p, m, g, b, v, $, y, C) {
	r._$parseTemplate(i._$html2node(b));
	r._$parseTemplate(i._$html2node(m));
	r._$parseTemplate(i._$html2node(g));
	var w, x;
	v._$$Index = t._$klass();
	w = v._$$Index._$extend(p._$$IndexBase);
	w.__loadConfig = function (e) {
		if ("1" == e.watchMan) this.__addWatchMan();
		this.__super(e)
	};
	w.__showPage = function (e) {
		l._$hideFail();
		this.__opt.page = this.__page;
		var t = this.__opt.needanimation;
		var n = 0 == t ? 0 : this._$supportCss3("animation");
		n = !this._pageinit ? 0 : n;
		this._pageinit = !0;
		if (e) {
			this.__opt.mobileFirst = this.__mdType ? 1 : 0;
			var s = i._$get("cnt-box-parent");
			i._$addClassName(s, "switching");
			setTimeout(function () {
				i._$delClassName(s, "switching")
			}, n ? 800 : 0)
		}
		setTimeout(function () {
			if (this.__lg) this.__lg = this.__lg._$recycle();
			if (this.__rg) this.__rg = this.__rg._$recycle();
			if ("login" == this.__page) {
				this.__opt.onRefresh = this._$LgRefresh._$bind(this);
				this.__lg = o._$$LoginManager._$allocate(this.__opt);
				if (this.__options.doLoginLockStyle) this._$doToggleLoingLock()
			} else {
				this.__rg = c._$$RegisterManager._$allocate(this.__opt);
				if (this.__options.doRegLockStyle) this._$doToggleRegLock()
			} if (!e) {
				l._$postMessage("_parent", {
					data: {
						type: "renderOk"
					}
				});
				setTimeout(function () {
					l._$postMessage("_parent", {
						data: {
							"URS-READY-DONE": 1
						}
					})
				}, 150)
			}
		}._$bind(this), n ? 400 : 0)
	};
	w._$supportCss3 = function (e) {
		var t = ["webkit", "Moz", "ms", "o"],
			i, n = [],
			s = document.documentElement.style,
			a = function (e) {
				return e.replace(/-(\w)/g, function (e, t) {
					return t.toUpperCase()
				})
			};
		for (i in t) n.push(a(t[i] + "-" + e));
		n.push(a(e));
		for (i in n)
			if (n[i] in s) return !0;
		return !1
	};
	w._$doToggleLoingLock = function (e) {
		var t = 1;
		if (e) t = e.lock;
		if (this.__lg) this.__lg._$doToggleLock(t, this.__options.doLoginLockStyle)
	};
	w._$doToggleRegLock = function (e) {
		var t = 1;
		if (e) t = e.lock;
		if (this.__rg) this.__rg._$doToggleLock(t, this.__options.doRegLockStyle)
	};
	w._$doLoginProxy = function (e) {
		if (this.__lg) this.__lg._$doLoginProxy(e);
		else {
			this.__page = "login";
			this.__showPage();
			setTimeout(function () {
				if (this.__lg) this.__lg._$doLoginProxy(e)
			}._$bind(this), 500)
		}
	};
	n._$addEvent(document, "templateready", function () {
		var e = function (e) {
			var t = e.data;
			if (t) {
				if ("string" == typeof t) try {
					t = JSON.parse(t)
				} catch (i) { }
				if ("object" == typeof t && "URS|" == t.from)
					if (t.isSafekeyboardMsg) x._$safekeyboardMsg(t, e);
					else if (t.fromMbSetClause) x._$setLoginClause(t.mbloginClause, 1);
					else if (t.fromMailSetClause) x._$setLoginClause(t.mailloginClause, 0);
					else if (t.getIframeSize) l._$resize();
					else if (t.doLoginProxy) x._$doLoginProxy(t);
					else if (t.fromLoginLock) x._$doToggleLoingLock(t);
					else if (t.fromRegLock) x._$doToggleRegLock(t);
					else if (t.fromUniteMbAndSendSms || t.fromLoginLockMb || t.fromRegLockMb);
					else {
						window.URSCONFIG = t;
						x = v._$$Index._$allocate(t)
					}
			}
		};
		n._$addEvent(window, "message", e);
		l._$postMessage("_parent", {
			data: {
				"URS-READY": 1
			}
		})
	})
}, "a878c0216188111f46d39b9df767b354", "4600f25ee05ffacd81f2d44da00eaaa7", "1c92dd86f4b11b13a0c8a0c0f91b27e9", "a100971a16ec757a0282a3b2cc059019", "8fd03edddb19cf8c294f56ca6638c475", "e0793c838b68fed5a7e1742035643bec", "12c5dab742044e15807978f676f5c3fc", "fc7cb307034da37cb66f38dd2e97d767", "4d89b0f3b292fe1c24e1a564b3682e56", "c488423b9f57765277b603bdd1fe75ea", "8f33f2dc03528616b29dd40cc05162ac", "a4de926c2d79e8d8f856eaff4dac0f8b", "285e64765191768caf2cc6de0397e37c", "dde0e6b40e64b3f022ca4ad9ab8b1a9c", "d6e36b6b1f96e15e42725a59e7acd142", "d9c6ce60dbff98dbeeee86945957430a", "6e03360fbae81b4ba0e4a28f0b7de97b", "4bb17f3a2d1f21b6b75e84daab140453", "0725741183df5ff898f8b2c242d049be");



function createRtId() {
	var e = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
		t = 32,
		i = [];
	for (; t-- > 0;) i[t] = e.charAt(Math.random() * e.length);
	return i.join("")
}


let rtId = createRtId();

var str = `{"pd":"cbg","pkid":"aqpOBwV","pkht":"cbg.163.com","channel":0,"topURL":"https://xyq-m.cbg.163.com/cgi/mweb/show_login?back_url=%2Fcgi%2Fmweb%2Flogin%2Farea%3Fback_url%3Dhttps%253A%252F%252Fxyq-m.cbg.163.com%252Fcgi%252Fmweb%252Flogin%252Frole%252F35%252F416%253Fback_url%2","rtid":"${rtId}"}"`

URSSM4.encrypt(str, "BC60B8B9E4FFEFFA219E5AD77F11F9E2")