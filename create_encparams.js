function createEncParams(e, t, i) {
    function n(e) {
        for (var t = [], i = 0, n = e.length; i < n; i += 2) t.push(parseInt(e.substr(i, 2), 16));
        return t
    }
    function s(e, t) {
        return e << t | e >>> 32 - t
    }
    function r(e) {
        return (255 & u[e >>> 24 & 255]) << 24 | (255 & u[e >>> 16 & 255]) << 16 | (255 & u[e >>> 8 & 255]) << 8 | 255 & u[255 & e]
    }
    function a(e) {
        return e ^ s(e, 2) ^ s(e, 10) ^ s(e, 18) ^ s(e, 24)
    }
    function o(e) {
        return e ^ s(e, 13) ^ s(e, 23)
    }
    function c(e, t, i, s) {
        var c = 3 < arguments.length && void 0 !== s ? s : {},
            u = c.padding,
            h = void 0 === u ? "pkcs#5" : u,
            p = c.mode,
            u = c.iv,
            u = void 0 === u ? [] : u,
            c = c.output,
            c = void 0 === c ? "string" : c;
        if ("cbc" === p && 16 !== (u = "string" == typeof u ? n(u) : u).length) throw new Error("iv is invalid");
        if (16 !== (t = "string" == typeof t ? n(t) : t).length) throw new Error("key is invalid");
        // e = [
        //     // 123, 34, 112, 100, 34, 58, 34, 99, 98, 103, 34, 44, 34, 112, 107, 105, 100, 34, 58, 34, 97, 113, 112, 79,
        //     123, 34, 112, 100, 34, 58, 34, 99, 98, 103, 34, 44, 34, 112, 107, 105, 100, 34, 58, 34, 97, 113, 112, 79,
        //     66, 119, 86, 34, 44, 34, 112, 107, 104, 116, 34, 58, 34, 99, 98, 103, 46, 49, 54, 51, 46, 99, 111, 109, 34,
        //     44, 34, 99, 104, 97, 110, 110, 101, 108, 34, 58, 48, 44, 34, 116, 111, 112, 85, 82, 76, 34, 58, 34, 104,
        //     116, 116, 112, 115, 58, 47, 47, 120, 121, 113, 45, 109, 46, 99, 98, 103, 46, 49, 54, 51, 46, 99, 111, 109,
        //     47, 99, 103, 105, 47, 109, 119, 101, 98, 47, 115, 104, 111, 119, 95, 108, 111, 103, 105, 110, 63, 98, 97,
        //     99, 107, 95, 117, 114, 108, 61, 37, 50, 70, 99, 103, 105, 37, 50, 70, 109, 119, 101, 98, 37, 50, 70, 108,
        //     111, 103, 105, 110, 37, 50, 70, 97, 114, 101, 97, 37, 51, 70, 98, 97, 99, 107, 95, 117, 114, 108, 37, 51,
        //     68, 104, 116, 116, 112, 115, 37, 50, 53, 51, 65, 37, 50, 53, 50, 70, 37, 50, 53, 50, 70, 120, 121, 113, 45,
        //     109, 46, 99, 98, 103, 46, 49, 54, 51, 46, 99, 111, 109, 37, 50, 53, 50, 70, 99, 103, 105, 37, 50, 53, 50, 70,
        //     109, 119, 101, 98, 37, 50, 53, 50, 70, 117, 115, 101, 114, 37, 50, 53, 51, 70, 95, 109, 111, 98, 105, 108,
        //     101, 95, 116, 105, 112, 115, 37, 50, 53, 51, 68, 49, 34, 44, 34, 114, 116, 105, 100, 34, 58, 34, 78, 75, 82,
        //     102, 54, 101, 57, 118, 97, 88, 109, 69, 103, 75, 106, 108, 111, 102, 48, 122, 76, 65, 81, 104, 98, 87, 52, 78,
        //     108, 115, 105, 69, 34, 125, 5, 5, 5, 5, 5
        // ];
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
        } : n : {})(e),
            "pkcs#5" === h && i !== _)
            for (var m = l - e.length % l, g = 0; g < m; g++)
                e.push(m);
        var b = new Array(32); !
            function (e, t, i) {
                for (var n = new Array(4), s = new Array(4), a = 0; a < 4; a++) s[0] = 255 & e[0 + 4 * a],
                    s[1] = 255 & e[1 + 4 * a],
                    s[2] = 255 & e[2 + 4 * a],
                    s[3] = 255 & e[3 + 4 * a],
                    n[a] = s[0] << 24 | s[1] << 16 | s[2] << 8 | s[3];
                n[0] ^= 2746333894,
                    n[1] ^= 1453994832,
                    n[2] ^= 1736282519,
                    n[3] ^= 2993693404;
                for (var c, d = 0; d < 32; d += 4) c = n[1] ^ n[2] ^ n[3] ^ f[d + 0],
                    t[d + 0] = n[0] ^= o(r(c)),
                    c = n[2] ^ n[3] ^ n[0] ^ f[d + 1],
                    t[d + 1] = n[1] ^= o(r(c)),
                    c = n[3] ^ n[0] ^ n[1] ^ f[d + 2],
                    t[d + 2] = n[2] ^= o(r(c)),
                    c = n[0] ^ n[1] ^ n[2] ^ f[d + 3],
                    t[d + 3] = n[3] ^= o(r(c));
                if (i === _) for (var l, u = 0; u < 16; u++) l = t[u],
                    t[u] = t[31 - u],
                    t[31 - u] = l
            }(t, b, i);
        for (var v = [], $ = u, y = e.length, C = 0; l <= y;) {
            var w = e.slice(C, C + 16),
                x = new Array(16);
            if ("cbc" === p) for (var T = 0; T < l; T++) i !== _ && (w[T] ^= $[T]); !
                function (e, t, i) {
                    for (var n = new Array(4), s = new Array(4), o = 0; o < 4; o++) s[0] = 255 & e[4 * o],
                        s[1] = 255 & e[4 * o + 1],
                        s[2] = 255 & e[4 * o + 2],
                        s[3] = 255 & e[4 * o + 3],
                        n[o] = s[0] << 24 | s[1] << 16 | s[2] << 8 | s[3];
                    for (var c, d = 0; d < 32; d += 4) c = n[1] ^ n[2] ^ n[3] ^ i[d + 0],
                        n[0] ^= a(r(c)),
                        c = n[2] ^ n[3] ^ n[0] ^ i[d + 1],
                        n[1] ^= a(r(c)),
                        c = n[3] ^ n[0] ^ n[1] ^ i[d + 2],
                        n[2] ^= a(r(c)),
                        c = n[0] ^ n[1] ^ n[2] ^ i[d + 3],
                        n[3] ^= a(r(c));
                    for (var _ = 0; _ < 16; _ += 4) t[_] = n[3 - _ / 4] >>> 24 & 255,
                        t[_ + 1] = n[3 - _ / 4] >>> 16 & 255,
                        t[_ + 2] = n[3 - _ / 4] >>> 8 & 255,
                        t[_ + 3] = 255 & n[3 - _ / 4]
                }(w, x, b);
            for (var E = 0; E < l; E++)"cbc" === p && i === _ && (x[E] ^= $[E]),
                v[C + E] = x[E];
            "cbc" === p && ($ = i !== _ ? x : w),
                y -= l,
                C += l
        }
        return "pkcs#5" === h && i === _ && (h = v[v.length - 1], v.splice(v.length - h, h)),
            "array" !== c ? i !== _ ? v.map(function (e) {
                return 1 === (e = e.toString(16)).length ? "0" + e : e
            }).join("") : function (e) {
                for (var t = [], i = 0, n = e.length; i < n; i++) 240 <= e[i] && e[i] <= 247 ? (t.push(String.fromCodePoint(((7 & e[i]) << 18) + ((63 & e[i + 1]) << 12) + ((63 & e[i + 2]) << 6) + (63 & e[i + 3]))), i += 3) : 224 <= e[i] && e[i] <= 239 ? (t.push(String.fromCodePoint(((15 & e[i]) << 12) + ((63 & e[i + 1]) << 6) + (63 & e[i + 2]))), i += 2) : 192 <= e[i] && e[i] <= 223 ? (t.push(String.fromCodePoint(((31 & e[i]) << 6) + (63 & e[i + 1]))), i++) : t.push(String.fromCodePoint(e[i]));
                return t.join("")
            }(v) : v
    }

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
}
function createRtId() {
    var e = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
        t = 32,
        i = [];
    for (; t-- > 0;) i[t] = e.charAt(Math.random() * e.length);
    return i.join("")
}
let obj = {
    exports: {}
};
createEncParams(obj);

let params = {
    "channel": 0,
    "pd": "cbg",
    "pkht": "cbg.163.com",
    "pkid": "aqpOBwV",
    // "rtid": createRtId(),
    "rtid": "eqcxS2y62TdMWl49pzdXP9TBo3CHGtZN",
    "topURL": "https://xyq-m.cbg.163.com/cgi/mweb/show_login?back_url=%2Fcgi%2Fmweb%2Flogin%2Farea%3Fback_url%3Dhttps%253A%252F%252Fxyq-m.cbg.163.com%252Fcgi%252Fmweb%252Flogin%252Frole%252F35%252F416%253Fback_url%2"
    // "topURL": "https://xyq-m.cbg.163.com/cgi/mweb/show_login?back_url=%2Fcgi%2Fmweb%2Flogin%2Farea%3Fback_url%3Dhttps%253A%252F%252Fxyq-m.cbg.163.com%252Fcgi%252Fmweb%252Fuser%253F_mobile_tips%253D1"
};
let x = "BC60B8B9E4FFEFFA219E5AD77F11F9E2"; // 第二个参数居然是写死的，有点离谱
let encParams = obj.exports.encrypt(params, x);

console.log(encParams);
/*
"{"pd":"cbg","pkid":"aqpOBwV","pkht":"cbg.163.com","channel":0,
"topURL":"https://xyq-m.cbg.163.com/cgi/mweb/show_login?back_url=%2Fcgi%2Fmweb%2Flogin%2Farea%3Fback_url%3Dhttps%253A%252F%252Fxyq-m.cbg.163.com%252Fcgi%252Fmweb%252Flogin%252Frole%252F35%252F416%253Fback_url%2",
"rtid":"eqcxS2y62TdMWl49pzdXP9TBo3CHGtZN"}"

*/