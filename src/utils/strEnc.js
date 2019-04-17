/*eslint-disable*/
function strEnc(r, e, a, n) {
  var t,
    s,
    o,
    c,
    f,
    u,
    l = r.length,
    b = ''
  if (
    (null != e && '' != e && ((t = getKeyBytes(e)), (c = t.length)),
    null != a && '' != a && ((s = getKeyBytes(a)), (f = s.length)),
    null != n && '' != n && ((o = getKeyBytes(n)), (u = o.length)),
    l > 0)
  )
    if (l < 4) {
      var i,
        y = strToBt(r)
      if (null != e && '' != e && null != a && '' != a && null != n && '' != n) {
        var k, v, g, w
        for (k = y, v = 0; v < c; v++) k = enc(k, t[v])
        for (g = 0; g < f; g++) k = enc(k, s[g])
        for (w = 0; w < u; w++) k = enc(k, o[w])
        i = k
      } else if (null != e && '' != e && null != a && '' != a) {
        var k, v, g
        for (k = y, v = 0; v < c; v++) k = enc(k, t[v])
        for (g = 0; g < f; g++) k = enc(k, s[g])
        i = k
      } else if (null != e && '' != e) {
        var k,
          v = 0
        for (k = y, v = 0; v < c; v++) k = enc(k, t[v])
        i = k
      }
      b = bt64ToHex(i)
    } else {
      var A = parseInt(l / 4),
        B = l % 4,
        x = 0
      for (x = 0; x < A; x++) {
        var i,
          h = r.substring(4 * x + 0, 4 * x + 4),
          m = strToBt(h)
        if (null != e && '' != e && null != a && '' != a && null != n && '' != n) {
          var k, v, g, w
          for (k = m, v = 0; v < c; v++) k = enc(k, t[v])
          for (g = 0; g < f; g++) k = enc(k, s[g])
          for (w = 0; w < u; w++) k = enc(k, o[w])
          i = k
        } else if (null != e && '' != e && null != a && '' != a) {
          var k, v, g
          for (k = m, v = 0; v < c; v++) k = enc(k, t[v])
          for (g = 0; g < f; g++) k = enc(k, s[g])
          i = k
        } else if (null != e && '' != e) {
          var k, v
          for (k = m, v = 0; v < c; v++) k = enc(k, t[v])
          i = k
        }
        b += bt64ToHex(i)
      }
      if (B > 0) {
        var i,
          T = r.substring(4 * A + 0, l),
          m = strToBt(T)
        if (null != e && '' != e && null != a && '' != a && null != n && '' != n) {
          var k, v, g, w
          for (k = m, v = 0; v < c; v++) k = enc(k, t[v])
          for (g = 0; g < f; g++) k = enc(k, s[g])
          for (w = 0; w < u; w++) k = enc(k, o[w])
          i = k
        } else if (null != e && '' != e && null != a && '' != a) {
          var k, v, g
          for (k = m, v = 0; v < c; v++) k = enc(k, t[v])
          for (g = 0; g < f; g++) k = enc(k, s[g])
          i = k
        } else if (null != e && '' != e) {
          var k, v
          for (k = m, v = 0; v < c; v++) k = enc(k, t[v])
          i = k
        }
        b += bt64ToHex(i)
      }
    }
  return b
}
function strDec(r, e, a, n) {
  var t,
    s,
    o,
    c,
    f,
    u,
    l = r.length,
    b = ''
  null != e && '' != e && ((t = getKeyBytes(e)), (c = t.length)),
    null != a && '' != a && ((s = getKeyBytes(a)), (f = s.length)),
    null != n && '' != n && ((o = getKeyBytes(n)), (u = o.length))
  var i = parseInt(l / 16),
    y = 0
  for (y = 0; y < i; y++) {
    var k = r.substring(16 * y + 0, 16 * y + 16),
      v = hexToBt64(k),
      g = new Array(64),
      w = 0
    for (w = 0; w < 64; w++) g[w] = parseInt(v.substring(w, w + 1))
    var A
    if (null != e && '' != e && null != a && '' != a && null != n && '' != n) {
      var B, x, h, m
      for (B = g, x = u - 1; x >= 0; x--) B = dec(B, o[x])
      for (h = f - 1; h >= 0; h--) B = dec(B, s[h])
      for (m = c - 1; m >= 0; m--) B = dec(B, t[m])
      A = B
    } else if (null != e && '' != e && null != a && '' != a) {
      var B, x, h, m
      for (B = g, x = f - 1; x >= 0; x--) B = dec(B, s[x])
      for (h = c - 1; h >= 0; h--) B = dec(B, t[h])
      A = B
    } else if (null != e && '' != e) {
      var B, x, h, m
      for (B = g, x = c - 1; x >= 0; x--) B = dec(B, t[x])
      A = B
    }
    b += byteToString(A)
  }
  return b
}
function getKeyBytes(r) {
  var e = new Array(),
    a = r.length,
    n = parseInt(a / 4),
    t = a % 4,
    s = 0
  for (s = 0; s < n; s++) e[s] = strToBt(r.substring(4 * s + 0, 4 * s + 4))
  return t > 0 && (e[s] = strToBt(r.substring(4 * s + 0, a))), e
}
function strToBt(r) {
  var e = r.length,
    a = new Array(64)
  if (e < 4) {
    var n = 0,
      t = 0,
      s = 0,
      o = 0
    for (n = 0; n < e; n++) {
      var c = r.charCodeAt(n)
      for (t = 0; t < 16; t++) {
        var f = 1,
          u = 0
        for (u = 15; u > t; u--) f *= 2
        a[16 * n + t] = parseInt(c / f) % 2
      }
    }
    for (s = e; s < 4; s++) {
      var c = 0
      for (o = 0; o < 16; o++) {
        var f = 1,
          u = 0
        for (u = 15; u > o; u--) f *= 2
        a[16 * s + o] = parseInt(c / f) % 2
      }
    }
  } else
    for (n = 0; n < 4; n++) {
      var c = r.charCodeAt(n)
      for (t = 0; t < 16; t++) {
        var f = 1
        for (u = 15; u > t; u--) f *= 2
        a[16 * n + t] = parseInt(c / f) % 2
      }
    }
  return a
}
function bt4ToHex(r) {
  var e
  switch (r) {
    case '0000':
      e = '0'
      break
    case '0001':
      e = '1'
      break
    case '0010':
      e = '2'
      break
    case '0011':
      e = '3'
      break
    case '0100':
      e = '4'
      break
    case '0101':
      e = '5'
      break
    case '0110':
      e = '6'
      break
    case '0111':
      e = '7'
      break
    case '1000':
      e = '8'
      break
    case '1001':
      e = '9'
      break
    case '1010':
      e = 'A'
      break
    case '1011':
      e = 'B'
      break
    case '1100':
      e = 'C'
      break
    case '1101':
      e = 'D'
      break
    case '1110':
      e = 'E'
      break
    case '1111':
      e = 'F'
  }
  return e
}
function hexToBt4(r) {
  var e
  switch (r) {
    case '0':
      e = '0000'
      break
    case '1':
      e = '0001'
      break
    case '2':
      e = '0010'
      break
    case '3':
      e = '0011'
      break
    case '4':
      e = '0100'
      break
    case '5':
      e = '0101'
      break
    case '6':
      e = '0110'
      break
    case '7':
      e = '0111'
      break
    case '8':
      e = '1000'
      break
    case '9':
      e = '1001'
      break
    case 'A':
      e = '1010'
      break
    case 'B':
      e = '1011'
      break
    case 'C':
      e = '1100'
      break
    case 'D':
      e = '1101'
      break
    case 'E':
      e = '1110'
      break
    case 'F':
      e = '1111'
  }
  return e
}
function byteToString(r) {
  var e = ''
  for (i = 0; i < 4; i++) {
    var a = 0
    for (j = 0; j < 16; j++) {
      var n = 1
      for (m = 15; m > j; m--) n *= 2
      a += r[16 * i + j] * n
    }
    0 != a && (e += String.fromCharCode(a))
  }
  return e
}
function bt64ToHex(r) {
  for (var e = '', a = 0; a < 16; a++) {
    for (var n = '', t = 0; t < 4; t++) n += r[4 * a + t]
    e += bt4ToHex(n)
  }
  return e
}
function hexToBt64(r) {
  for (var e = '', a = 0; a < 16; a++) e += hexToBt4(r.substring(a, a + 1))
  return e
}
function enc(r, e) {
  var a = generateKeys(e),
    n = initPermute(r),
    t = new Array(32),
    s = new Array(32),
    o = new Array(32),
    c = 0,
    f = 0,
    u = 0,
    l = 0,
    b = 0
  for (u = 0; u < 32; u++) (t[u] = n[u]), (s[u] = n[32 + u])
  for (c = 0; c < 16; c++) {
    for (f = 0; f < 32; f++) (o[f] = t[f]), (t[f] = s[f])
    var i = new Array(48)
    for (l = 0; l < 48; l++) i[l] = a[c][l]
    var y = xor(pPermute(sBoxPermute(xor(expandPermute(s), i))), o)
    for (b = 0; b < 32; b++) s[b] = y[b]
  }
  var k = new Array(64)
  for (c = 0; c < 32; c++) (k[c] = s[c]), (k[32 + c] = t[c])
  return finallyPermute(k)
}
function dec(r, e) {
  var a = generateKeys(e),
    n = initPermute(r),
    t = new Array(32),
    s = new Array(32),
    o = new Array(32),
    c = 0,
    f = 0,
    u = 0,
    l = 0,
    b = 0
  for (u = 0; u < 32; u++) (t[u] = n[u]), (s[u] = n[32 + u])
  for (c = 15; c >= 0; c--) {
    for (f = 0; f < 32; f++) (o[f] = t[f]), (t[f] = s[f])
    var i = new Array(48)
    for (l = 0; l < 48; l++) i[l] = a[c][l]
    var y = xor(pPermute(sBoxPermute(xor(expandPermute(s), i))), o)
    for (b = 0; b < 32; b++) s[b] = y[b]
  }
  var k = new Array(64)
  for (c = 0; c < 32; c++) (k[c] = s[c]), (k[32 + c] = t[c])
  return finallyPermute(k)
}
function initPermute(r) {
  for (var e = new Array(64), a = 0, n = 1, t = 0; a < 4; a++, n += 2, t += 2)
    for (var s = 7, o = 0; s >= 0; s--, o++) (e[8 * a + o] = r[8 * s + n]), (e[8 * a + o + 32] = r[8 * s + t])
  return e
}
function expandPermute(r) {
  for (var e = new Array(48), a = 0; a < 8; a++)
    0 == a ? (e[6 * a + 0] = r[31]) : (e[6 * a + 0] = r[4 * a - 1]),
      (e[6 * a + 1] = r[4 * a + 0]),
      (e[6 * a + 2] = r[4 * a + 1]),
      (e[6 * a + 3] = r[4 * a + 2]),
      (e[6 * a + 4] = r[4 * a + 3]),
      7 == a ? (e[6 * a + 5] = r[0]) : (e[6 * a + 5] = r[4 * a + 4])
  return e
}
function xor(r, e) {
  for (var a = new Array(r.length), n = 0; n < r.length; n++) a[n] = r[n] ^ e[n]
  return a
}
function sBoxPermute(r) {
  for (
    var e = new Array(32),
      a = '',
      n = [
        [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
        [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
        [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
        [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]
      ],
      t = [
        [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
        [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
        [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
        [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]
      ],
      s = [
        [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
        [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
        [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
        [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]
      ],
      o = [
        [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
        [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
        [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
        [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]
      ],
      c = [
        [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
        [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
        [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
        [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]
      ],
      f = [
        [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
        [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
        [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
        [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]
      ],
      u = [
        [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
        [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
        [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
        [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]
      ],
      l = [
        [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
        [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
        [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
        [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]
      ],
      b = 0;
    b < 8;
    b++
  ) {
    var i = 0,
      y = 0
    switch (
      ((i = 2 * r[6 * b + 0] + r[6 * b + 5]),
      (y = 2 * r[6 * b + 1] * 2 * 2 + 2 * r[6 * b + 2] * 2 + 2 * r[6 * b + 3] + r[6 * b + 4]),
      b)
    ) {
      case 0:
        a = getBoxBinary(n[i][y])
        break
      case 1:
        a = getBoxBinary(t[i][y])
        break
      case 2:
        a = getBoxBinary(s[i][y])
        break
      case 3:
        a = getBoxBinary(o[i][y])
        break
      case 4:
        a = getBoxBinary(c[i][y])
        break
      case 5:
        a = getBoxBinary(f[i][y])
        break
      case 6:
        a = getBoxBinary(u[i][y])
        break
      case 7:
        a = getBoxBinary(l[i][y])
    }
    ;(e[4 * b + 0] = parseInt(a.substring(0, 1))),
      (e[4 * b + 1] = parseInt(a.substring(1, 2))),
      (e[4 * b + 2] = parseInt(a.substring(2, 3))),
      (e[4 * b + 3] = parseInt(a.substring(3, 4)))
  }
  return e
}
function pPermute(r) {
  var e = new Array(32)
  return (
    (e[0] = r[15]),
    (e[1] = r[6]),
    (e[2] = r[19]),
    (e[3] = r[20]),
    (e[4] = r[28]),
    (e[5] = r[11]),
    (e[6] = r[27]),
    (e[7] = r[16]),
    (e[8] = r[0]),
    (e[9] = r[14]),
    (e[10] = r[22]),
    (e[11] = r[25]),
    (e[12] = r[4]),
    (e[13] = r[17]),
    (e[14] = r[30]),
    (e[15] = r[9]),
    (e[16] = r[1]),
    (e[17] = r[7]),
    (e[18] = r[23]),
    (e[19] = r[13]),
    (e[20] = r[31]),
    (e[21] = r[26]),
    (e[22] = r[2]),
    (e[23] = r[8]),
    (e[24] = r[18]),
    (e[25] = r[12]),
    (e[26] = r[29]),
    (e[27] = r[5]),
    (e[28] = r[21]),
    (e[29] = r[10]),
    (e[30] = r[3]),
    (e[31] = r[24]),
    e
  )
}
function finallyPermute(r) {
  var e = new Array(64)
  return (
    (e[0] = r[39]),
    (e[1] = r[7]),
    (e[2] = r[47]),
    (e[3] = r[15]),
    (e[4] = r[55]),
    (e[5] = r[23]),
    (e[6] = r[63]),
    (e[7] = r[31]),
    (e[8] = r[38]),
    (e[9] = r[6]),
    (e[10] = r[46]),
    (e[11] = r[14]),
    (e[12] = r[54]),
    (e[13] = r[22]),
    (e[14] = r[62]),
    (e[15] = r[30]),
    (e[16] = r[37]),
    (e[17] = r[5]),
    (e[18] = r[45]),
    (e[19] = r[13]),
    (e[20] = r[53]),
    (e[21] = r[21]),
    (e[22] = r[61]),
    (e[23] = r[29]),
    (e[24] = r[36]),
    (e[25] = r[4]),
    (e[26] = r[44]),
    (e[27] = r[12]),
    (e[28] = r[52]),
    (e[29] = r[20]),
    (e[30] = r[60]),
    (e[31] = r[28]),
    (e[32] = r[35]),
    (e[33] = r[3]),
    (e[34] = r[43]),
    (e[35] = r[11]),
    (e[36] = r[51]),
    (e[37] = r[19]),
    (e[38] = r[59]),
    (e[39] = r[27]),
    (e[40] = r[34]),
    (e[41] = r[2]),
    (e[42] = r[42]),
    (e[43] = r[10]),
    (e[44] = r[50]),
    (e[45] = r[18]),
    (e[46] = r[58]),
    (e[47] = r[26]),
    (e[48] = r[33]),
    (e[49] = r[1]),
    (e[50] = r[41]),
    (e[51] = r[9]),
    (e[52] = r[49]),
    (e[53] = r[17]),
    (e[54] = r[57]),
    (e[55] = r[25]),
    (e[56] = r[32]),
    (e[57] = r[0]),
    (e[58] = r[40]),
    (e[59] = r[8]),
    (e[60] = r[48]),
    (e[61] = r[16]),
    (e[62] = r[56]),
    (e[63] = r[24]),
    e
  )
}
function getBoxBinary(r) {
  var e = ''
  switch (r) {
    case 0:
      e = '0000'
      break
    case 1:
      e = '0001'
      break
    case 2:
      e = '0010'
      break
    case 3:
      e = '0011'
      break
    case 4:
      e = '0100'
      break
    case 5:
      e = '0101'
      break
    case 6:
      e = '0110'
      break
    case 7:
      e = '0111'
      break
    case 8:
      e = '1000'
      break
    case 9:
      e = '1001'
      break
    case 10:
      e = '1010'
      break
    case 11:
      e = '1011'
      break
    case 12:
      e = '1100'
      break
    case 13:
      e = '1101'
      break
    case 14:
      e = '1110'
      break
    case 15:
      e = '1111'
  }
  return e
}
function generateKeys(r) {
  var e = new Array(56),
    a = new Array()
  ;(a[0] = new Array()),
    (a[1] = new Array()),
    (a[2] = new Array()),
    (a[3] = new Array()),
    (a[4] = new Array()),
    (a[5] = new Array()),
    (a[6] = new Array()),
    (a[7] = new Array()),
    (a[8] = new Array()),
    (a[9] = new Array()),
    (a[10] = new Array()),
    (a[11] = new Array()),
    (a[12] = new Array()),
    (a[13] = new Array()),
    (a[14] = new Array()),
    (a[15] = new Array())
  var n = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1],
    t = 0,
    s = 0,
    o = 0,
    c = 0
  for (t = 0; t < 7; t++) for (s = 0, o = 7; s < 8; s++, o--) e[8 * t + s] = r[8 * o + t]
  for (t = 0, t = 0; t < 16; t++) {
    var f = 0,
      u = 0
    for (s = 0; s < n[t]; s++) {
      for (f = e[0], u = e[28], o = 0; o < 27; o++) (e[o] = e[o + 1]), (e[28 + o] = e[29 + o])
      ;(e[27] = f), (e[55] = u)
    }
    var l = new Array(48)
    switch (
      ((l[0] = e[13]),
      (l[1] = e[16]),
      (l[2] = e[10]),
      (l[3] = e[23]),
      (l[4] = e[0]),
      (l[5] = e[4]),
      (l[6] = e[2]),
      (l[7] = e[27]),
      (l[8] = e[14]),
      (l[9] = e[5]),
      (l[10] = e[20]),
      (l[11] = e[9]),
      (l[12] = e[22]),
      (l[13] = e[18]),
      (l[14] = e[11]),
      (l[15] = e[3]),
      (l[16] = e[25]),
      (l[17] = e[7]),
      (l[18] = e[15]),
      (l[19] = e[6]),
      (l[20] = e[26]),
      (l[21] = e[19]),
      (l[22] = e[12]),
      (l[23] = e[1]),
      (l[24] = e[40]),
      (l[25] = e[51]),
      (l[26] = e[30]),
      (l[27] = e[36]),
      (l[28] = e[46]),
      (l[29] = e[54]),
      (l[30] = e[29]),
      (l[31] = e[39]),
      (l[32] = e[50]),
      (l[33] = e[44]),
      (l[34] = e[32]),
      (l[35] = e[47]),
      (l[36] = e[43]),
      (l[37] = e[48]),
      (l[38] = e[38]),
      (l[39] = e[55]),
      (l[40] = e[33]),
      (l[41] = e[52]),
      (l[42] = e[45]),
      (l[43] = e[41]),
      (l[44] = e[49]),
      (l[45] = e[35]),
      (l[46] = e[28]),
      (l[47] = e[31]),
      t)
    ) {
      case 0:
        for (c = 0; c < 48; c++) a[0][c] = l[c]
        break
      case 1:
        for (c = 0; c < 48; c++) a[1][c] = l[c]
        break
      case 2:
        for (c = 0; c < 48; c++) a[2][c] = l[c]
        break
      case 3:
        for (c = 0; c < 48; c++) a[3][c] = l[c]
        break
      case 4:
        for (c = 0; c < 48; c++) a[4][c] = l[c]
        break
      case 5:
        for (c = 0; c < 48; c++) a[5][c] = l[c]
        break
      case 6:
        for (c = 0; c < 48; c++) a[6][c] = l[c]
        break
      case 7:
        for (c = 0; c < 48; c++) a[7][c] = l[c]
        break
      case 8:
        for (c = 0; c < 48; c++) a[8][c] = l[c]
        break
      case 9:
        for (c = 0; c < 48; c++) a[9][c] = l[c]
        break
      case 10:
        for (c = 0; c < 48; c++) a[10][c] = l[c]
        break
      case 11:
        for (c = 0; c < 48; c++) a[11][c] = l[c]
        break
      case 12:
        for (c = 0; c < 48; c++) a[12][c] = l[c]
        break
      case 13:
        for (c = 0; c < 48; c++) a[13][c] = l[c]
        break
      case 14:
        for (c = 0; c < 48; c++) a[14][c] = l[c]
        break
      case 15:
        for (c = 0; c < 48; c++) a[15][c] = l[c]
    }
  }
  return a
}
module.exports = strEnc
/*eslint-enable*/
