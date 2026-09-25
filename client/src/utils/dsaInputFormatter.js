function fmtArr(toks) {
  return "[" + toks.join(", ") + "]";
}

function fmtMat(rows) {
  return "[" + rows.map(function (r) { return "[" + r.join(", ") + "]"; }).join(", ") + "]";
}

function fmtOps(words) {
  return "[" + words.map(function (w) { return '"' + w + '"'; }).join(", ") + "]";
}

function safeLines(input) {
  return String(input == null ? "" : input).split("\n").map(function (l) {
    return l.replace(/\r$/, "");
  });
}

function intArrLine(line) {
  var t = (line || "").trim();
  return t === "" ? [] : t.split(/\s+/);
}

function readArrayBlock(lines, idx) {
  var n = parseInt((lines[idx] || "0").trim(), 10);
  var vals = intArrLine(lines[idx + 1]);
  if (!isNaN(n) && n >= 0 && vals.length > n) vals = vals.slice(0, n);
  return vals;
}

function readTreeBlock(lines, idx) {
  var n = parseInt((lines[idx] || "0").trim(), 10);
  var toks = intArrLine(lines[idx + 1]);
  if (!isNaN(n) && n >= 0 && toks.length > n) toks = toks.slice(0, n);
  return toks;
}

function readMatrixBlock(lines, idx) {
  var dims = intArrLine(lines[idx]);
  var rows = parseInt(dims[0] || "0", 10);
  var out = [];
  for (var i = 0; i < rows; i++) out.push(intArrLine(lines[idx + 1 + i]));
  return out;
}

function readGraphBlock(lines, idx) {
  var dims = intArrLine(lines[idx]);
  var n = dims[0] || "0";
  var m = parseInt(dims[1] || "0", 10);
  var edges = [];
  for (var i = 0; i < m; i++) {
    var p = intArrLine(lines[idx + 1 + i]);
    if (p.length >= 2) edges.push([p[0], p[1]]);
  }
  return { n: n, edges: edges };
}

function pair(name, value) {
  return { name: name, value: value };
}

export function formatInput(io, inputString) {
  try {
    var lines = safeLines(inputString);
    switch (io) {
      case "array":
        return [pair("nums", fmtArr(readArrayBlock(lines, 0)))];
      case "array-target":
        return [pair("nums", fmtArr(readArrayBlock(lines, 0))), pair("target", (lines[2] || "").trim())];
      case "array-k":
        return [pair("nums", fmtArr(readArrayBlock(lines, 0))), pair("k", (lines[2] || "").trim())];
      case "array-r":
        return [pair("nums", fmtArr(readArrayBlock(lines, 0))), pair("r", (lines[2] || "").trim())];
      case "array-m": {
        var all = readArrayBlock(lines, 0);
        var m = parseInt((lines[2] || "0").trim(), 10);
        if (isNaN(m)) m = 0;
        return [pair("nums1", fmtArr(all.slice(0, m))), pair("nums2", fmtArr(all.slice(m)))];
      }
      case "array-two-ints": {
        var lu = intArrLine(lines[2]);
        return [
          pair("nums", fmtArr(readArrayBlock(lines, 0))),
          pair("lower", lu[0] || ""),
          pair("upper", lu[1] || ""),
        ];
      }
      case "three-ints": {
        var tiz = intArrLine(lines[0]);
        return [pair("x", tiz[0] == null ? "" : String(tiz[0])), pair("y", tiz[1] == null ? "" : String(tiz[1])), pair("z", tiz[2] == null ? "" : String(tiz[2]))];
      }
      case "string-queries": {
        var sqParts = (lines[1] || "").trim().split(/\s+/);
        var sqRows = [];
        for (var sqI = 2; sqI + 1 < sqParts.length; sqI += 2) sqRows.push([parseInt(sqParts[sqI], 10), parseInt(sqParts[sqI + 1], 10)]);
        return [pair("s", sqParts[0] || ""), pair("queries", fmtMat(sqRows))];
      }
      case "intervals": {
        var cnt = parseInt((lines[0] || "0").trim(), 10);
        var rows = [];
        for (var i = 0; i < cnt; i++) rows.push(intArrLine(lines[1 + i]));
        return [pair("intervals", fmtMat(rows))];
      }
      case "string":
        return [pair("s", lines[0] == null ? "" : lines[0])];
      case "two-strings":
        return [pair("s", lines[0] == null ? "" : lines[0]), pair("t", lines[1] == null ? "" : lines[1])];
      case "string-int":
        return [pair("s", lines[0] == null ? "" : lines[0]), pair("k", (lines[1] || "").trim())];
      case "string-array": {
        var wc = parseInt((lines[0] || "0").trim(), 10);
        var words = [];
        for (var j = 0; j < wc && 1 + j < lines.length; j++) words.push(lines[1 + j]);
        return [pair("operations", fmtOps(words))];
      }
      case "int":
        return [pair("n", String(inputString == null ? "" : inputString).trim())];
      case "range-queries": {
        var arr = readArrayBlock(lines, 0);
        var qc = parseInt((lines[2] || "0").trim(), 10);
        var qs = [];
        for (var k2 = 0; k2 < qc; k2++) qs.push(intArrLine(lines[3 + k2]));
        return [pair("nums", fmtArr(arr)), pair("queries", fmtMat(qs))];
      }
      case "words-width":
        return [
          pair("words", fmtArr(intArrLine(lines[1]).map(function (w) { return '"' + w + '"'; }))),
          pair("maxWidth", (lines[2] || "").trim()),
        ];
      case "tree":
        return [pair("root", fmtArr(readTreeBlock(lines, 0)))];
      case "tree-target":
        return [pair("root", fmtArr(readTreeBlock(lines, 0))), pair("target", (lines[2] || "").trim())];
      case "tree-k":
        return [pair("root", fmtArr(readTreeBlock(lines, 0))), pair("k", (lines[2] || "").trim())];
      case "tree-two-ints": {
        var ab = intArrLine(lines[2]);
        return [
          pair("root", fmtArr(readTreeBlock(lines, 0))),
          pair("p", ab[0] || ""),
          pair("q", ab[1] || ""),
        ];
      }
      case "two-trees": {
        var t1 = readTreeBlock(lines, 0);
        var t2 = readTreeBlock(lines, 2);
        return [pair("p", fmtArr(t1)), pair("q", fmtArr(t2))];
      }
      case "linkedlist":
        return [pair("head", fmtArr(readArrayBlock(lines, 0)))];
      case "linkedlist-n":
        return [pair("head", fmtArr(readArrayBlock(lines, 0))), pair("pos", (lines[2] || "").trim())];
      case "linkedlist-x":
        return [pair("head", fmtArr(readArrayBlock(lines, 0))), pair("x", (lines[2] || "").trim())];
      case "two-lists": {
        var l1 = readArrayBlock(lines, 0);
        var l2 = readArrayBlock(lines, 2);
        return [pair("l1", fmtArr(l1)), pair("l2", fmtArr(l2))];
      }
      case "matrix":
        return [pair("matrix", fmtMat(readMatrixBlock(lines, 0)))];
      case "matrix-k": {
        var mk = readMatrixBlock(lines, 0);
        var dims = intArrLine(lines[0]);
        var kLine = lines[1 + parseInt(dims[0] || "0", 10)] || "";
        return [pair("matrix", fmtMat(mk)), pair("k", kLine.trim())];
      }
      case "matrix-three-ints": {
        var m3 = readMatrixBlock(lines, 0);
        var d3 = intArrLine(lines[0]);
        var p3 = intArrLine(lines[1 + parseInt(d3[0] || "0", 10)]);
        return [
          pair("image", fmtMat(m3)),
          pair("sr", p3[0] || ""),
          pair("sc", p3[1] || ""),
          pair("newColor", p3[2] || ""),
        ];
      }
      case "graph": {
        var g = readGraphBlock(lines, 0);
        return [pair("n", g.n), pair("edges", fmtMat(g.edges))];
      }
      case "graph-start": {
        var gs = readGraphBlock(lines, 0);
        var gm = parseInt(intArrLine(lines[0])[1] || "0", 10);
        return [pair("n", gs.n), pair("edges", fmtMat(gs.edges)), pair("start", (lines[1 + gm] || "").trim())];
      }
      default:
        return [pair("input", String(inputString == null ? "" : inputString))];
    }
  } catch (e) {
    return [pair("input", String(inputString == null ? "" : inputString))];
  }
}

export function formatOutput(returns, outputString) {
  try {
    var s = String(outputString == null ? "" : outputString).trim();
    switch (returns) {
      case "int":
      case "bool":
      case "string":
        return s;
      case "intArr":
      case "linkedlist":
        return s === "" ? "[]" : fmtArr(s.split(/\s+/));
      case "tree":
        return s === "" ? "[]" : fmtArr(s.split(/\s+/));
      case "intMat":
      case "strMat": {
        if (s === "") return "[]";
        var rows = s.split("\n").map(function (ln) {
          var t = ln.trim();
          return t === "" ? [] : t.split(/\s+/);
        });
        return fmtMat(rows);
      }
      default:
        return s;
    }
  } catch (e) {
    return String(outputString == null ? "" : outputString);
  }
}
