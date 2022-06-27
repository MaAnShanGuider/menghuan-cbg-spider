
const Te = {
	default: Date.now
}

function le() {
	var d1 = Te.default()
	console.log(d1);
	console.log("执行到2e,测试");
	function e() {
		var e = Math.random(),
			t = arguments,
			n = t.length;
		return 1 === n ? e *= t[0] : 2 === n && (e = Math.round(e * (t[1] - t[0])) + t[0]),
			e
	}
	function t(t, n) {
		if (t < 1) return 0;
		for (var r, a = "",
			o = "num" === n; a.length < t;) r = Math.floor((0, Te.
				default)() * e() * 999),
				o || (r = r.toString(16)),
				a += r;
		return a.substr(0, t)
	}
	function n(e, t) {
		return t < 1 ? "" : new Array(t + 1).join(e)
	}
	var r = function (t, n) {
		for (var r = t.toString(16), a = r.length - 1, o = ""; o.length < n;) o += r.substr(Math.round(e(0, a)), 1);
		return o
	},
		a = (0, Te.
			default)(),
		o = function (e, t) {
			if (!e) return "0";
			var r = String(e);
			return n("0", 12 - r.length) + r
		}(a.toString(16)),
		i = o.substr(0, 8),
		u = o.substr(8, 4),
		c = r(a, 4),
		l = r(t(a % 97), 2),
		s = r(t(a % 89), 2),
		f = r(t(4), 1) + r(t(8), 1) + r(t(16), 2) + r(t(32), 2) + r(t(64), 3) + r(t(128), 3),
		d = i + "-" + u + "-" + c + "-" + l + s + "-" + f;
	console.log(i)
	console.log(u)
	console.log(c)
	console.log(l)
	console.log(s)
	console.log(f)
	return d.toUpperCase()
}

console.log(le());