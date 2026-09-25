const TYPES = {
  int: {
    javascript: "number",
    python: "int",
    cpp: "int",
    java: "int",
  },
  bool: {
    javascript: "boolean",
    python: "bool",
    cpp: "bool",
    java: "boolean",
  },
  string: {
    javascript: "string",
    python: "str",
    cpp: "string",
    java: "String",
  },
  intArr: {
    javascript: "number[]",
    python: "List[int]",
    cpp: "vector<int>",
    java: "int[]",
  },
  intMat: {
    javascript: "number[][]",
    python: "List[List[int]]",
    cpp: "vector<vector<int>>",
    java: "int[][]",
  },
  strArr: {
    javascript: "string[]",
    python: "List[str]",
    cpp: "vector<string>",
    java: "String[]",
  },
  strMat: {
    javascript: "string[][]",
    python: "List[List[str]]",
    cpp: "vector<vector<string>>",
    java: "String[][]",
  },
  tree: {
    javascript: "TreeNode",
    python: "Optional[TreeNode]",
    cpp: "TreeNode*",
    java: "TreeNode",
  },
  linkedlist: {
    javascript: "ListNode",
    python: "Optional[ListNode]",
    cpp: "ListNode*",
    java: "ListNode",
  },
  graph: {
    javascript: "number[][]",
    python: "List[List[int]]",
    cpp: "vector<vector<int>>",
    java: "int[][]",
  },
};

const CPP_PARAM = {
  int: "int",
  bool: "bool",
  string: "string",
  intArr: "vector<int>&",
  intMat: "vector<vector<int>>&",
  strArr: "vector<string>&",
  strMat: "vector<vector<string>>&",
  tree: "TreeNode*",
  linkedlist: "ListNode*",
};

const PATTERNS = {
  array: { params: [["arr", "intArr"]] },
  "array-target": {
    params: [
      ["arr", "intArr"],
      ["target", "int"],
    ],
  },
  "array-k": {
    params: [
      ["arr", "intArr"],
      ["k", "int"],
    ],
  },
  "array-m": {
    params: [
      ["arr", "intArr"],
      ["m", "int"],
    ],
  },
  "array-two-ints": {
    params: [
      ["arr", "intArr"],
      ["lower", "int"],
      ["upper", "int"],
    ],
  },
  "array-r": {
    params: [
      ["arr", "intArr"],
      ["r", "int"],
    ],
  },
  intervals: { params: [["intervals", "intMat"]] },
  string: { params: [["s", "string"]] },
  "two-strings": {
    params: [
      ["a", "string"],
      ["b", "string"],
    ],
  },
  "string-int": {
    params: [
      ["s", "string"],
      ["k", "int"],
    ],
  },
  "string-array": { params: [["words", "strArr"]] },
  int: { params: [["n", "int"]] },
  "range-queries": {
    params: [
      ["arr", "intArr"],
      ["queries", "intMat"],
    ],
  },
  "words-width": {
    params: [
      ["words", "strArr"],
      ["width", "int"],
    ],
  },
  "three-ints": {
    params: [
      ["x", "int"],
      ["y", "int"],
      ["z", "int"],
    ],
  },
  "string-queries": {
    params: [
      ["s", "string"],
      ["queries", "intMat"],
    ],
  },
  tree: { params: [["root", "tree"]] },
  "tree-target": {
    params: [
      ["root", "tree"],
      ["target", "int"],
    ],
  },
  "tree-k": {
    params: [
      ["root", "tree"],
      ["k", "int"],
    ],
  },
  "tree-two-ints": {
    params: [
      ["root", "tree"],
      ["a", "int"],
      ["b", "int"],
    ],
  },
  "two-trees": {
    params: [
      ["p", "tree"],
      ["q", "tree"],
    ],
  },
  linkedlist: { params: [["head", "linkedlist"]] },
  "linkedlist-n": {
    params: [
      ["head", "linkedlist"],
      ["n", "int"],
    ],
  },
  "linkedlist-x": {
    params: [
      ["head", "linkedlist"],
      ["x", "int"],
    ],
  },
  "two-lists": {
    params: [
      ["l1", "linkedlist"],
      ["l2", "linkedlist"],
    ],
  },
  matrix: { params: [["matrix", "intMat"]] },
  "matrix-k": {
    params: [
      ["matrix", "intMat"],
      ["k", "int"],
    ],
  },
  "matrix-three-ints": {
    params: [
      ["matrix", "intMat"],
      ["sr", "int"],
      ["sc", "int"],
      ["newColor", "int"],
    ],
  },
  graph: { params: [["graph", "graph"]] },
  "graph-start": {
    params: [
      ["graph", "graph"],
      ["start", "int"],
    ],
  },
};

const PARSE = {
  array: {
    javascript:
      'const __lines = require("fs").readFileSync(0, "utf8").trim().split("\\n");\nconst arr = __lines[1].trim().split(/\\s+/).map(Number);',
    python:
      '__lines = sys.stdin.read().strip().split("\\n")\narr = list(map(int, __lines[1].strip().split()))',
    cpp: "int __n;\nif (!(cin >> __n)) return 0;\nvector<int> arr(__n);\nfor (int __i = 0; __i < __n; __i++) cin >> arr[__i];",
    java: "Scanner __sc = new Scanner(System.in);\nint __n = __sc.nextInt();\nint[] arr = new int[__n];\nfor (int __i = 0; __i < __n; __i++) arr[__i] = __sc.nextInt();",
  },
  "array-target": {
    javascript:
      'const __lines = require("fs").readFileSync(0, "utf8").trim().split("\\n");\nconst arr = __lines[1].trim().split(/\\s+/).map(Number);\nconst target = parseInt(__lines[2].trim(), 10);',
    python:
      '__lines = sys.stdin.read().strip().split("\\n")\narr = list(map(int, __lines[1].strip().split()))\ntarget = int(__lines[2].strip())',
    cpp: "int __n;\nif (!(cin >> __n)) return 0;\nvector<int> arr(__n);\nfor (int __i = 0; __i < __n; __i++) cin >> arr[__i];\nint target;\ncin >> target;",
    java: "Scanner __sc = new Scanner(System.in);\nint __n = __sc.nextInt();\nint[] arr = new int[__n];\nfor (int __i = 0; __i < __n; __i++) arr[__i] = __sc.nextInt();\nint target = __sc.nextInt();",
  },
  "array-k": {
    javascript:
      'const __lines = require("fs").readFileSync(0, "utf8").trim().split("\\n");\nconst arr = __lines[1].trim().split(/\\s+/).map(Number);\nconst k = parseInt(__lines[2].trim(), 10);',
    python:
      '__lines = sys.stdin.read().strip().split("\\n")\narr = list(map(int, __lines[1].strip().split()))\nk = int(__lines[2].strip())',
    cpp: "int __n;\nif (!(cin >> __n)) return 0;\nvector<int> arr(__n);\nfor (int __i = 0; __i < __n; __i++) cin >> arr[__i];\nint k;\ncin >> k;",
    java: "Scanner __sc = new Scanner(System.in);\nint __n = __sc.nextInt();\nint[] arr = new int[__n];\nfor (int __i = 0; __i < __n; __i++) arr[__i] = __sc.nextInt();\nint k = __sc.nextInt();",
  },
  "array-m": {
    javascript:
      'const __lines = require("fs").readFileSync(0, "utf8").trim().split("\\n");\nconst arr = __lines[1].trim().split(/\\s+/).map(Number);\nconst m = parseInt(__lines[2].trim(), 10);',
    python:
      '__lines = sys.stdin.read().strip().split("\\n")\narr = list(map(int, __lines[1].strip().split()))\nm = int(__lines[2].strip())',
    cpp: "int __n;\nif (!(cin >> __n)) return 0;\nvector<int> arr(__n);\nfor (int __i = 0; __i < __n; __i++) cin >> arr[__i];\nint m;\ncin >> m;",
    java: "Scanner __sc = new Scanner(System.in);\nint __n = __sc.nextInt();\nint[] arr = new int[__n];\nfor (int __i = 0; __i < __n; __i++) arr[__i] = __sc.nextInt();\nint m = __sc.nextInt();",
  },
  "array-two-ints": {
    javascript:
      'const __lines = require("fs").readFileSync(0, "utf8").trim().split("\\n");\nconst arr = __lines[1].trim().split(/\\s+/).map(Number);\nconst [lower, upper] = __lines[2].trim().split(/\\s+/).map(Number);',
    python:
      '__lines = sys.stdin.read().strip().split("\\n")\narr = list(map(int, __lines[1].strip().split()))\nlower, upper = map(int, __lines[2].strip().split())',
    cpp: "int __n;\nif (!(cin >> __n)) return 0;\nvector<int> arr(__n);\nfor (int __i = 0; __i < __n; __i++) cin >> arr[__i];\nint lower, upper;\ncin >> lower >> upper;",
    java: "Scanner __sc = new Scanner(System.in);\nint __n = __sc.nextInt();\nint[] arr = new int[__n];\nfor (int __i = 0; __i < __n; __i++) arr[__i] = __sc.nextInt();\nint lower = __sc.nextInt();\nint upper = __sc.nextInt();",
  },
  "array-r": {
    javascript:
      'const __lines = require("fs").readFileSync(0, "utf8").trim().split("\\n");\nconst arr = __lines[1].trim().split(/\\s+/).map(Number);\nconst r = parseInt(__lines[2].trim(), 10);',
    python:
      '__lines = sys.stdin.read().strip().split("\\n")\narr = list(map(int, __lines[1].strip().split()))\nr = int(__lines[2].strip())',
    cpp: "int __n;\nif (!(cin >> __n)) return 0;\nvector<int> arr(__n);\nfor (int __i = 0; __i < __n; __i++) cin >> arr[__i];\nint r;\ncin >> r;",
    java: "Scanner __sc = new Scanner(System.in);\nint __n = __sc.nextInt();\nint[] arr = new int[__n];\nfor (int __i = 0; __i < __n; __i++) arr[__i] = __sc.nextInt();\nint r = __sc.nextInt();",
  },
  intervals: {
    javascript:
      'const __lines = require("fs").readFileSync(0, "utf8").trim().split("\\n");\nconst __n = parseInt(__lines[0].trim(), 10);\nconst intervals = [];\nfor (let __i = 0; __i < __n; __i++) {\n  const __p = __lines[1 + __i].trim().split(/\\s+/).map(Number);\n  intervals.push([__p[0], __p[1]]);\n}',
    python:
      '__lines = sys.stdin.read().strip().split("\\n")\n__n = int(__lines[0].strip())\nintervals = []\nfor __i in range(__n):\n    __a, __b = map(int, __lines[1 + __i].strip().split())\n    intervals.append([__a, __b])',
    cpp: "int __n;\nif (!(cin >> __n)) return 0;\nvector<vector<int>> intervals(__n, vector<int>(2));\nfor (int __i = 0; __i < __n; __i++) cin >> intervals[__i][0] >> intervals[__i][1];",
    java: "Scanner __sc = new Scanner(System.in);\nint __n = __sc.nextInt();\nint[][] intervals = new int[__n][2];\nfor (int __i = 0; __i < __n; __i++) { intervals[__i][0] = __sc.nextInt(); intervals[__i][1] = __sc.nextInt(); }",
  },
  string: {
    javascript:
      'const s = require("fs").readFileSync(0, "utf8").split("\\n")[0].replace(/\\r$/, "");',
    python: 's = sys.stdin.readline().rstrip("\\r\\n")',
    cpp: "string s;\ngetline(cin, s);\nif (!s.empty() && s.back() == '\\r') s.pop_back();",
    java: "Scanner __sc = new Scanner(System.in);\nString s = __sc.hasNextLine() ? __sc.nextLine() : \"\";",
  },
  "two-strings": {
    javascript:
      'const __raw = require("fs").readFileSync(0, "utf8").split("\\n");\nconst a = __raw[0].replace(/\\r$/, "");\nconst b = (__raw[1] || "").replace(/\\r$/, "");',
    python:
      '__raw = sys.stdin.read().split("\\n")\na = __raw[0].rstrip("\\r")\nb = __raw[1].rstrip("\\r") if len(__raw) > 1 else ""',
    cpp: "string a, b;\ngetline(cin, a);\ngetline(cin, b);\nif (!a.empty() && a.back() == '\\r') a.pop_back();\nif (!b.empty() && b.back() == '\\r') b.pop_back();",
    java: "Scanner __sc = new Scanner(System.in);\nString a = __sc.hasNextLine() ? __sc.nextLine() : \"\";\nString b = __sc.hasNextLine() ? __sc.nextLine() : \"\";",
  },
  "string-int": {
    javascript:
      'const __raw = require("fs").readFileSync(0, "utf8").split("\\n");\nconst s = __raw[0].replace(/\\r$/, "");\nconst k = parseInt((__raw[1] || "0").trim(), 10);',
    python:
      '__raw = sys.stdin.read().split("\\n")\ns = __raw[0].rstrip("\\r")\nk = int(__raw[1].strip()) if len(__raw) > 1 and __raw[1].strip() else 0',
    cpp: "string s;\ngetline(cin, s);\nif (!s.empty() && s.back() == '\\r') s.pop_back();\nint k = 0;\ncin >> k;",
    java: "Scanner __sc = new Scanner(System.in);\nString s = __sc.hasNextLine() ? __sc.nextLine() : \"\";\nint k = __sc.hasNextInt() ? __sc.nextInt() : 0;",
  },
  "string-array": {
    javascript:
      'const __raw = require("fs").readFileSync(0, "utf8").split("\\n");\nconst __n = parseInt(__raw[0].trim(), 10);\nconst words = [];\nfor (let __i = 0; __i < __n; __i++) words.push((__raw[1 + __i] || "").replace(/\\r$/, ""));',
    python:
      '__raw = sys.stdin.read().split("\\n")\n__n = int(__raw[0].strip())\nwords = [__raw[1 + __i].rstrip("\\r") for __i in range(__n)]',
    cpp: "int __n;\nif (!(cin >> __n)) return 0;\nstring __dummy;\ngetline(cin, __dummy);\nvector<string> words(__n);\nfor (int __i = 0; __i < __n; __i++) {\ngetline(cin, words[__i]);\nif (!words[__i].empty() && words[__i].back() == '\\r') words[__i].pop_back();\n}",
    java: "Scanner __sc = new Scanner(System.in);\nint __n = Integer.parseInt(__sc.nextLine().trim());\nString[] words = new String[__n];\nfor (int __i = 0; __i < __n; __i++) words[__i] = __sc.hasNextLine() ? __sc.nextLine() : \"\";",
  },
  int: {
    javascript:
      'const n = parseInt(require("fs").readFileSync(0, "utf8").trim(), 10);',
    python: "n = int(sys.stdin.read().strip())",
    cpp: "int n;\nif (!(cin >> n)) return 0;",
    java: "Scanner __sc = new Scanner(System.in);\nint n = __sc.nextInt();",
  },
  "range-queries": {
    javascript:
      'const __lines = require("fs").readFileSync(0, "utf8").trim().split("\\n");\nconst __n = parseInt(__lines[0].trim(), 10);\nconst arr = __lines[1].trim().split(/\\s+/).map(Number);\nconst __q = parseInt(__lines[2].trim(), 10);\nconst queries = [];\nfor (let __i = 0; __i < __q; __i++) {\n  const __p = __lines[3 + __i].trim().split(/\\s+/).map(Number);\n  queries.push([__p[0], __p[1]]);\n}',
    python:
      '__lines = sys.stdin.read().strip().split("\\n")\n__n = int(__lines[0].strip())\narr = list(map(int, __lines[1].strip().split()))\n__q = int(__lines[2].strip())\nqueries = []\nfor __i in range(__q):\n    __l, __r = map(int, __lines[3 + __i].strip().split())\n    queries.append([__l, __r])',
    cpp: "int __n;\nif (!(cin >> __n)) return 0;\nvector<int> arr(__n);\nfor (int __i = 0; __i < __n; __i++) cin >> arr[__i];\nint __q;\ncin >> __q;\nvector<vector<int>> queries(__q, vector<int>(2));\nfor (int __i = 0; __i < __q; __i++) cin >> queries[__i][0] >> queries[__i][1];",
    java: "Scanner __sc = new Scanner(System.in);\nint __n = __sc.nextInt();\nint[] arr = new int[__n];\nfor (int __i = 0; __i < __n; __i++) arr[__i] = __sc.nextInt();\nint __q = __sc.nextInt();\nint[][] queries = new int[__q][2];\nfor (int __i = 0; __i < __q; __i++) { queries[__i][0] = __sc.nextInt(); queries[__i][1] = __sc.nextInt(); }",
  },
  "words-width": {
    javascript:
      'const __lines = require("fs").readFileSync(0, "utf8").trim().split("\\n");\nconst __n = parseInt(__lines[0].trim(), 10);\nconst words = __lines[1].trim().split(/\\s+/);\nconst width = parseInt(__lines[2].trim(), 10);',
    python:
      '__lines = sys.stdin.read().strip().split("\\n")\n__n = int(__lines[0].strip())\nwords = __lines[1].strip().split()\nwidth = int(__lines[2].strip())',
    cpp: "int __n;\nif (!(cin >> __n)) return 0;\nvector<string> words(__n);\nfor (int __i = 0; __i < __n; __i++) cin >> words[__i];\nint width;\ncin >> width;",
    java: "Scanner __sc = new Scanner(System.in);\nint __n = __sc.nextInt();\nString[] words = new String[__n];\nfor (int __i = 0; __i < __n; __i++) words[__i] = __sc.next();\nint width = __sc.nextInt();",
  },
  "three-ints": {
    javascript:
      'const __t = require("fs").readFileSync(0, "utf8").trim().split(/\\s+/).map(Number);\nconst x = __t[0];\nconst y = __t[1];\nconst z = __t[2];',
    python: '__t = list(map(int, sys.stdin.read().strip().split()))\nx, y, z = __t[0], __t[1], __t[2]',
    cpp: "int x, y, z;\nif (!(cin >> x >> y >> z)) return 0;",
    java: "Scanner __sc = new Scanner(System.in);\nint x = __sc.nextInt();\nint y = __sc.nextInt();\nint z = __sc.nextInt();",
  },
  "string-queries": {
    javascript:
      'const __lines = require("fs").readFileSync(0, "utf8").trim().split("\\n");\nconst __q = parseInt(__lines[0].trim(), 10);\nconst __parts = __lines[1].trim().split(/\\s+/);\nconst s = __parts[0];\nconst queries = [];\nfor (let __i = 0; __i < __q; __i++) { queries.push([parseInt(__parts[2 + __i * 2], 10), parseInt(__parts[3 + __i * 2], 10)]); }',
    python:
      '__lines = sys.stdin.read().strip().split("\\n")\n__q = int(__lines[0].strip())\n__parts = __lines[1].strip().split()\ns = __parts[0]\nqueries = [[int(__parts[2 + __i * 2]), int(__parts[3 + __i * 2])] for __i in range(__q)]',
    cpp: "int __q;\nif (!(cin >> __q)) return 0;\nstring s;\ncin >> s;\nint __qq;\ncin >> __qq;\nvector<vector<int>> queries(__q, vector<int>(2));\nfor (int __i = 0; __i < __q; __i++) cin >> queries[__i][0] >> queries[__i][1];",
    java: "Scanner __sc = new Scanner(System.in);\nint __q = __sc.nextInt();\nString s = __sc.next();\nint __qq = __sc.nextInt();\nint[][] queries = new int[__q][2];\nfor (int __i = 0; __i < __q; __i++) { queries[__i][0] = __sc.nextInt(); queries[__i][1] = __sc.nextInt(); }",
  },
  tree: {
    javascript:
      'const __lines = require("fs").readFileSync(0, "utf8").trim().split("\\n")\nconst __n = parseInt(__lines[0].trim(), 10)\nconst __toks = __n > 0 ? __lines[1].trim().split(/\\s+/) : []\nconst __tvals = __toks.map(__t => __t === "null" ? null : parseInt(__t, 10))\nconst root = __buildTree(__tvals)',
    python:
      '__lines = sys.stdin.read().strip().split("\\n")\n__n = int(__lines[0].strip())\n__toks = __lines[1].strip().split() if __n > 0 else []\n__tvals = [None if __t == "null" else int(__t) for __t in __toks]\nroot = __build_tree(__tvals)',
    cpp: "int __n;\nif (!(cin >> __n)) return 0;\nvector<string> __toks(__n);\nfor (int __i = 0; __i < __n; __i++) cin >> __toks[__i];\nTreeNode* root = __buildTree(__toks);",
    java: "Scanner __sc = new Scanner(System.in);\nint __n = __sc.nextInt();\nString[] __toks = new String[__n];\nfor (int __i = 0; __i < __n; __i++) __toks[__i] = __sc.next();\nTreeNode root = __buildTree(__toks);",
  },
  "tree-target": {
    javascript:
      'const __lines = require("fs").readFileSync(0, "utf8").trim().split("\\n")\nconst __n = parseInt(__lines[0].trim(), 10)\nconst __toks = __n > 0 ? __lines[1].trim().split(/\\s+/) : []\nconst __tvals = __toks.map(__t => __t === "null" ? null : parseInt(__t, 10))\nconst root = __buildTree(__tvals)\nconst target = parseInt(__lines[2].trim(), 10)',
    python:
      '__lines = sys.stdin.read().strip().split("\\n")\n__n = int(__lines[0].strip())\n__toks = __lines[1].strip().split() if __n > 0 else []\n__tvals = [None if __t == "null" else int(__t) for __t in __toks]\nroot = __build_tree(__tvals)\ntarget = int(__lines[2].strip())',
    cpp: "int __n;\nif (!(cin >> __n)) return 0;\nvector<string> __toks(__n);\nfor (int __i = 0; __i < __n; __i++) cin >> __toks[__i];\nTreeNode* root = __buildTree(__toks);\nint target;\ncin >> target;",
    java: "Scanner __sc = new Scanner(System.in);\nint __n = __sc.nextInt();\nString[] __toks = new String[__n];\nfor (int __i = 0; __i < __n; __i++) __toks[__i] = __sc.next();\nTreeNode root = __buildTree(__toks);\nint target = __sc.nextInt();",
  },
  "tree-k": {
    javascript:
      'const __lines = require("fs").readFileSync(0, "utf8").trim().split("\\n")\nconst __n = parseInt(__lines[0].trim(), 10)\nconst __toks = __n > 0 ? __lines[1].trim().split(/\\s+/) : []\nconst __tvals = __toks.map(__t => __t === "null" ? null : parseInt(__t, 10))\nconst root = __buildTree(__tvals)\nconst k = parseInt(__lines[2].trim(), 10)',
    python:
      '__lines = sys.stdin.read().strip().split("\\n")\n__n = int(__lines[0].strip())\n__toks = __lines[1].strip().split() if __n > 0 else []\n__tvals = [None if __t == "null" else int(__t) for __t in __toks]\nroot = __build_tree(__tvals)\nk = int(__lines[2].strip())',
    cpp: "int __n;\nif (!(cin >> __n)) return 0;\nvector<string> __toks(__n);\nfor (int __i = 0; __i < __n; __i++) cin >> __toks[__i];\nTreeNode* root = __buildTree(__toks);\nint k;\ncin >> k;",
    java: "Scanner __sc = new Scanner(System.in);\nint __n = __sc.nextInt();\nString[] __toks = new String[__n];\nfor (int __i = 0; __i < __n; __i++) __toks[__i] = __sc.next();\nTreeNode root = __buildTree(__toks);\nint k = __sc.nextInt();",
  },
  "tree-two-ints": {
    javascript:
      'const __lines = require("fs").readFileSync(0, "utf8").trim().split("\\n")\nconst __n = parseInt(__lines[0].trim(), 10)\nconst __toks = __n > 0 ? __lines[1].trim().split(/\\s+/) : []\nconst __tvals = __toks.map(__t => __t === "null" ? null : parseInt(__t, 10))\nconst root = __buildTree(__tvals)\nconst [a, b] = __lines[2].trim().split(/\\s+/).map(Number)',
    python:
      '__lines = sys.stdin.read().strip().split("\\n")\n__n = int(__lines[0].strip())\n__toks = __lines[1].strip().split() if __n > 0 else []\n__tvals = [None if __t == "null" else int(__t) for __t in __toks]\nroot = __build_tree(__tvals)\na, b = map(int, __lines[2].strip().split())',
    cpp: "int __n;\nif (!(cin >> __n)) return 0;\nvector<string> __toks(__n);\nfor (int __i = 0; __i < __n; __i++) cin >> __toks[__i];\nTreeNode* root = __buildTree(__toks);\nint a, b;\ncin >> a >> b;",
    java: "Scanner __sc = new Scanner(System.in);\nint __n = __sc.nextInt();\nString[] __toks = new String[__n];\nfor (int __i = 0; __i < __n; __i++) __toks[__i] = __sc.next();\nTreeNode root = __buildTree(__toks);\nint a = __sc.nextInt();\nint b = __sc.nextInt();",
  },
  "two-trees": {
    javascript:
      'const __lines = require("fs").readFileSync(0, "utf8").trim().split("\\n")\nconst __n1 = parseInt(__lines[0].trim(), 10)\nconst __t1 = __n1 > 0 ? __lines[1].trim().split(/\\s+/).map(__t => __t === "null" ? null : parseInt(__t, 10)) : []\nconst p = __buildTree(__t1)\nconst __n2 = parseInt(__lines[2].trim(), 10)\nconst __t2 = __n2 > 0 ? __lines[3].trim().split(/\\s+/).map(__t => __t === "null" ? null : parseInt(__t, 10)) : []\nconst q = __buildTree(__t2)',
    python:
      '__lines = sys.stdin.read().strip().split("\\n")\n__n1 = int(__lines[0].strip())\n__t1 = [None if __t == "null" else int(__t) for __t in __lines[1].strip().split()] if __n1 > 0 else []\np = __build_tree(__t1)\n__n2 = int(__lines[2].strip())\n__t2 = [None if __t == "null" else int(__t) for __t in __lines[3].strip().split()] if __n2 > 0 else []\nq = __build_tree(__t2)',
    cpp: "int __n1;\nif (!(cin >> __n1)) return 0;\nvector<string> __tk1(__n1);\nfor (int __i = 0; __i < __n1; __i++) cin >> __tk1[__i];\nTreeNode* p = __buildTree(__tk1);\nint __n2;\ncin >> __n2;\nvector<string> __tk2(__n2);\nfor (int __i = 0; __i < __n2; __i++) cin >> __tk2[__i];\nTreeNode* q = __buildTree(__tk2);",
    java: "Scanner __sc = new Scanner(System.in);\nint __n1 = __sc.nextInt();\nString[] __tk1 = new String[__n1];\nfor (int __i = 0; __i < __n1; __i++) __tk1[__i] = __sc.next();\nTreeNode p = __buildTree(__tk1);\nint __n2 = __sc.nextInt();\nString[] __tk2 = new String[__n2];\nfor (int __i = 0; __i < __n2; __i++) __tk2[__i] = __sc.next();\nTreeNode q = __buildTree(__tk2);",
  },
  linkedlist: {
    javascript:
      'const __lines = require("fs").readFileSync(0, "utf8").trim().split("\\n")\nconst __n = parseInt(__lines[0].trim(), 10)\nconst __lvals = __n > 0 ? __lines[1].trim().split(/\\s+/).map(Number) : []\nconst head = __buildList(__lvals)',
    python:
      '__lines = sys.stdin.read().strip().split("\\n")\n__n = int(__lines[0].strip())\n__lvals = list(map(int, __lines[1].strip().split())) if __n > 0 else []\nhead = __build_list(__lvals)',
    cpp: "int __n;\nif (!(cin >> __n)) return 0;\nvector<int> __lvals(__n);\nfor (int __i = 0; __i < __n; __i++) cin >> __lvals[__i];\nListNode* head = __buildList(__lvals);",
    java: "Scanner __sc = new Scanner(System.in);\nint __n = __sc.nextInt();\nint[] __lvals = new int[__n];\nfor (int __i = 0; __i < __n; __i++) __lvals[__i] = __sc.nextInt();\nListNode head = __buildList(__lvals);",
  },
  "linkedlist-n": {
    javascript:
      'const __lines = require("fs").readFileSync(0, "utf8").trim().split("\\n")\nconst __n = parseInt(__lines[0].trim(), 10)\nconst __lvals = __n > 0 ? __lines[1].trim().split(/\\s+/).map(Number) : []\nconst head = __buildList(__lvals)\nconst n = parseInt(__lines[2].trim(), 10)',
    python:
      '__lines = sys.stdin.read().strip().split("\\n")\n__n = int(__lines[0].strip())\n__lvals = list(map(int, __lines[1].strip().split())) if __n > 0 else []\nhead = __build_list(__lvals)\nn = int(__lines[2].strip())',
    cpp: "int __n;\nif (!(cin >> __n)) return 0;\nvector<int> __lvals(__n);\nfor (int __i = 0; __i < __n; __i++) cin >> __lvals[__i];\nListNode* head = __buildList(__lvals);\nint n;\ncin >> n;",
    java: "Scanner __sc = new Scanner(System.in);\nint __n = __sc.nextInt();\nint[] __lvals = new int[__n];\nfor (int __i = 0; __i < __n; __i++) __lvals[__i] = __sc.nextInt();\nListNode head = __buildList(__lvals);\nint n = __sc.nextInt();",
  },
  "linkedlist-x": {
    javascript:
      'const __lines = require("fs").readFileSync(0, "utf8").trim().split("\\n")\nconst __n = parseInt(__lines[0].trim(), 10)\nconst __lvals = __n > 0 ? __lines[1].trim().split(/\\s+/).map(Number) : []\nconst head = __buildList(__lvals)\nconst x = parseInt(__lines[2].trim(), 10)',
    python:
      '__lines = sys.stdin.read().strip().split("\\n")\n__n = int(__lines[0].strip())\n__lvals = list(map(int, __lines[1].strip().split())) if __n > 0 else []\nhead = __build_list(__lvals)\nx = int(__lines[2].strip())',
    cpp: "int __n;\nif (!(cin >> __n)) return 0;\nvector<int> __lvals(__n);\nfor (int __i = 0; __i < __n; __i++) cin >> __lvals[__i];\nListNode* head = __buildList(__lvals);\nint x;\ncin >> x;",
    java: "Scanner __sc = new Scanner(System.in);\nint __n = __sc.nextInt();\nint[] __lvals = new int[__n];\nfor (int __i = 0; __i < __n; __i++) __lvals[__i] = __sc.nextInt();\nListNode head = __buildList(__lvals);\nint x = __sc.nextInt();",
  },
  "two-lists": {
    javascript:
      'const __lines = require("fs").readFileSync(0, "utf8").trim().split("\\n")\nconst __n1 = parseInt(__lines[0].trim(), 10)\nconst __lv1 = __n1 > 0 ? __lines[1].trim().split(/\\s+/).map(Number) : []\nconst l1 = __buildList(__lv1)\nconst __n2 = parseInt(__lines[2].trim(), 10)\nconst __lv2 = __n2 > 0 ? __lines[3].trim().split(/\\s+/).map(Number) : []\nconst l2 = __buildList(__lv2)',
    python:
      '__lines = sys.stdin.read().strip().split("\\n")\n__n1 = int(__lines[0].strip())\n__lv1 = list(map(int, __lines[1].strip().split())) if __n1 > 0 else []\nl1 = __build_list(__lv1)\n__n2 = int(__lines[2].strip())\n__lv2 = list(map(int, __lines[3].strip().split())) if __n2 > 0 else []\nl2 = __build_list(__lv2)',
    cpp: "int __n1;\nif (!(cin >> __n1)) return 0;\nvector<int> __lv1(__n1);\nfor (int __i = 0; __i < __n1; __i++) cin >> __lv1[__i];\nListNode* l1 = __buildList(__lv1);\nint __n2;\ncin >> __n2;\nvector<int> __lv2(__n2);\nfor (int __i = 0; __i < __n2; __i++) cin >> __lv2[__i];\nListNode* l2 = __buildList(__lv2);",
    java: "Scanner __sc = new Scanner(System.in);\nint __n1 = __sc.nextInt();\nint[] __lv1 = new int[__n1];\nfor (int __i = 0; __i < __n1; __i++) __lv1[__i] = __sc.nextInt();\nListNode l1 = __buildList(__lv1);\nint __n2 = __sc.nextInt();\nint[] __lv2 = new int[__n2];\nfor (int __i = 0; __i < __n2; __i++) __lv2[__i] = __sc.nextInt();\nListNode l2 = __buildList(__lv2);",
  },
  matrix: {
    javascript:
      'const __lines = require("fs").readFileSync(0, "utf8").trim().split("\\n")\nconst [__rows, __cols] = __lines[0].trim().split(/\\s+/).map(Number)\nconst matrix = []\nfor (let __i = 0; __i < __rows; __i++) matrix.push(__lines[1 + __i].trim().split(/\\s+/).map(Number))',
    python:
      '__lines = sys.stdin.read().strip().split("\\n")\n__rows, __cols = map(int, __lines[0].strip().split())\nmatrix = [list(map(int, __lines[1 + __i].strip().split())) for __i in range(__rows)]',
    cpp: "int __rows, __cols;\nif (!(cin >> __rows >> __cols)) return 0;\nvector<vector<int>> matrix(__rows, vector<int>(__cols));\nfor (int __i = 0; __i < __rows; __i++) for (int __j = 0; __j < __cols; __j++) cin >> matrix[__i][__j];",
    java: "Scanner __sc = new Scanner(System.in);\nint __rows = __sc.nextInt();\nint __cols = __sc.nextInt();\nint[][] matrix = new int[__rows][__cols];\nfor (int __i = 0; __i < __rows; __i++) for (int __j = 0; __j < __cols; __j++) matrix[__i][__j] = __sc.nextInt();",
  },
  "matrix-k": {
    javascript:
      'const __lines = require("fs").readFileSync(0, "utf8").trim().split("\\n")\nconst [__rows, __cols] = __lines[0].trim().split(/\\s+/).map(Number)\nconst matrix = []\nfor (let __i = 0; __i < __rows; __i++) matrix.push(__lines[1 + __i].trim().split(/\\s+/).map(Number))\nconst k = parseInt(__lines[1 + __rows].trim(), 10)',
    python:
      '__lines = sys.stdin.read().strip().split("\\n")\n__rows, __cols = map(int, __lines[0].strip().split())\nmatrix = [list(map(int, __lines[1 + __i].strip().split())) for __i in range(__rows)]\nk = int(__lines[1 + __rows].strip())',
    cpp: "int __rows, __cols;\nif (!(cin >> __rows >> __cols)) return 0;\nvector<vector<int>> matrix(__rows, vector<int>(__cols));\nfor (int __i = 0; __i < __rows; __i++) for (int __j = 0; __j < __cols; __j++) cin >> matrix[__i][__j];\nint k;\ncin >> k;",
    java: "Scanner __sc = new Scanner(System.in);\nint __rows = __sc.nextInt();\nint __cols = __sc.nextInt();\nint[][] matrix = new int[__rows][__cols];\nfor (int __i = 0; __i < __rows; __i++) for (int __j = 0; __j < __cols; __j++) matrix[__i][__j] = __sc.nextInt();\nint k = __sc.nextInt();",
  },
  "matrix-three-ints": {
    javascript:
      'const __lines = require("fs").readFileSync(0, "utf8").trim().split("\\n")\nconst [__rows, __cols] = __lines[0].trim().split(/\\s+/).map(Number)\nconst matrix = []\nfor (let __i = 0; __i < __rows; __i++) matrix.push(__lines[1 + __i].trim().split(/\\s+/).map(Number))\nconst [sr, sc, newColor] = __lines[1 + __rows].trim().split(/\\s+/).map(Number)',
    python:
      '__lines = sys.stdin.read().strip().split("\\n")\n__rows, __cols = map(int, __lines[0].strip().split())\nmatrix = [list(map(int, __lines[1 + __i].strip().split())) for __i in range(__rows)]\nsr, sc, newColor = map(int, __lines[1 + __rows].strip().split())',
    cpp: "int __rows, __cols;\nif (!(cin >> __rows >> __cols)) return 0;\nvector<vector<int>> matrix(__rows, vector<int>(__cols));\nfor (int __i = 0; __i < __rows; __i++) for (int __j = 0; __j < __cols; __j++) cin >> matrix[__i][__j];\nint sr, sc, newColor;\ncin >> sr >> sc >> newColor;",
    java: "Scanner __sc = new Scanner(System.in);\nint __rows = __sc.nextInt();\nint __cols = __sc.nextInt();\nint[][] matrix = new int[__rows][__cols];\nfor (int __i = 0; __i < __rows; __i++) for (int __j = 0; __j < __cols; __j++) matrix[__i][__j] = __sc.nextInt();\nint sr = __sc.nextInt();\nint sc = __sc.nextInt();\nint newColor = __sc.nextInt();",
  },
  graph: {
    javascript:
      'const __lines = require("fs").readFileSync(0, "utf8").trim().split("\\n")\nconst [__n, __m] = __lines[0].trim().split(/\\s+/).map(Number)\nconst graph = Array.from({length: __n}, () => [])\nfor (let __i = 0; __i < __m; __i++) { const [__u, __v] = __lines[1 + __i].trim().split(/\\s+/).map(Number); graph[__u].push(__v); graph[__v].push(__u); }',
    python:
      '__lines = sys.stdin.read().strip().split("\\n")\n__n, __m = map(int, __lines[0].strip().split())\ngraph = [[] for _ in range(__n)]\nfor __i in range(__m):\n    __u, __v = map(int, __lines[1 + __i].strip().split())\n    graph[__u].append(__v)\n    graph[__v].append(__u)',
    cpp: "int __n, __m;\nif (!(cin >> __n >> __m)) return 0;\nvector<vector<int>> graph(__n);\nfor (int __i = 0; __i < __m; __i++) { int __u, __v; cin >> __u >> __v; graph[__u].push_back(__v); graph[__v].push_back(__u); }",
    java: "Scanner __sc = new Scanner(System.in);\nint __n = __sc.nextInt();\nint __m = __sc.nextInt();\nint[][] graph = new int[__n][];\njava.util.List<java.util.List<Integer>> __adj = new java.util.ArrayList<>();\nfor (int __i = 0; __i < __n; __i++) __adj.add(new java.util.ArrayList<>());\nfor (int __i = 0; __i < __m; __i++) { int __u = __sc.nextInt(); int __v = __sc.nextInt(); __adj.get(__u).add(__v); __adj.get(__v).add(__u); }\nfor (int __i = 0; __i < __n; __i++) { graph[__i] = new int[__adj.get(__i).size()]; for (int __j = 0; __j < __adj.get(__i).size(); __j++) graph[__i][__j] = __adj.get(__i).get(__j); }",
  },
  "graph-start": {
    javascript:
      'const __lines = require("fs").readFileSync(0, "utf8").trim().split("\\n")\nconst [__n, __m] = __lines[0].trim().split(/\\s+/).map(Number)\nconst graph = Array.from({length: __n}, () => [])\nfor (let __i = 0; __i < __m; __i++) { const [__u, __v] = __lines[1 + __i].trim().split(/\\s+/).map(Number); graph[__u].push(__v); graph[__v].push(__u); }\nconst start = parseInt(__lines[1 + __m].trim(), 10)',
    python:
      '__lines = sys.stdin.read().strip().split("\\n")\n__n, __m = map(int, __lines[0].strip().split())\ngraph = [[] for _ in range(__n)]\nfor __i in range(__m):\n    __u, __v = map(int, __lines[1 + __i].strip().split())\n    graph[__u].append(__v)\n    graph[__v].append(__u)\nstart = int(__lines[1 + __m].strip())',
    cpp: "int __n, __m;\nif (!(cin >> __n >> __m)) return 0;\nvector<vector<int>> graph(__n);\nfor (int __i = 0; __i < __m; __i++) { int __u, __v; cin >> __u >> __v; graph[__u].push_back(__v); graph[__v].push_back(__u); }\nint start;\ncin >> start;",
    java: "Scanner __sc = new Scanner(System.in);\nint __n = __sc.nextInt();\nint __m = __sc.nextInt();\nint[][] graph = new int[__n][];\njava.util.List<java.util.List<Integer>> __adj = new java.util.ArrayList<>();\nfor (int __i = 0; __i < __n; __i++) __adj.add(new java.util.ArrayList<>());\nfor (int __i = 0; __i < __m; __i++) { int __u = __sc.nextInt(); int __v = __sc.nextInt(); __adj.get(__u).add(__v); __adj.get(__v).add(__u); }\nfor (int __i = 0; __i < __n; __i++) { graph[__i] = new int[__adj.get(__i).size()]; for (int __j = 0; __j < __adj.get(__i).size(); __j++) graph[__i][__j] = __adj.get(__i).get(__j); }\nint start = __sc.nextInt();",
  },
};

const PRINT = {
  int: {
    javascript: "console.log(__res);",
    python: "print(__res)",
    cpp: "cout << __res;",
    java: "System.out.print(__res);",
  },
  bool: {
    javascript: 'console.log(__res ? "true" : "false");',
    python: "print(str(__res).lower())",
    cpp: 'cout << (__res ? "true" : "false");',
    java: "System.out.print(__res);",
  },
  string: {
    javascript: "console.log(__res);",
    python: "print(__res)",
    cpp: "cout << __res;",
    java: "System.out.print(__res);",
  },
  intArr: {
    javascript: 'console.log(__res.join(" "));',
    python: 'print(" ".join(map(str, __res)))',
    cpp: 'for (size_t __i = 0; __i < __res.size(); __i++) { if (__i) cout << " "; cout << __res[__i]; }',
    java: 'for (int __i = 0; __i < __res.length; __i++) { if (__i > 0) System.out.print(" "); System.out.print(__res[__i]); }',
  },
  intMat: {
    javascript: 'console.log(__res.map(__r => __r.join(" ")).join("\\n"));',
    python: 'print("\\n".join(" ".join(map(str, __r)) for __r in __res))',
    cpp: 'for (size_t __i = 0; __i < __res.size(); __i++) { for (size_t __j = 0; __j < __res[__i].size(); __j++) { if (__j) cout << " "; cout << __res[__i][__j]; } if (__i + 1 < __res.size()) cout << "\\n"; }',
    java: 'for (int __i = 0; __i < __res.length; __i++) { for (int __j = 0; __j < __res[__i].length; __j++) { if (__j > 0) System.out.print(" "); System.out.print(__res[__i][__j]); } if (__i + 1 < __res.length) System.out.println(); }',
  },
  strMat: {
    javascript: 'console.log(__res.map(__r => __r.join(" ")).join("\\n"));',
    python: 'print("\\n".join(" ".join(__r) for __r in __res))',
    cpp: 'for (size_t __i = 0; __i < __res.size(); __i++) { for (size_t __j = 0; __j < __res[__i].size(); __j++) { if (__j) cout << " "; cout << __res[__i][__j]; } if (__i + 1 < __res.size()) cout << "\\n"; }',
    java: 'for (int __i = 0; __i < __res.length; __i++) { for (int __j = 0; __j < __res[__i].length; __j++) { if (__j > 0) System.out.print(" "); System.out.print(__res[__i][__j]); } if (__i + 1 < __res.length) System.out.println(); }',
  },
  tree: {
    javascript: 'console.log(__treeToArray(__res).map(__v => __v === null ? "null" : __v).join(" "));',
    python: 'print(" ".join("null" if __v is None else str(__v) for __v in __tree_to_array(__res)))',
    cpp: 'auto __ta = __treeToArray(__res);\nfor (size_t __i = 0; __i < __ta.size(); __i++) { if (__i) cout << " "; cout << __ta[__i]; }',
    java: 'java.util.List<String> __ta = __treeToArray(__res);\nfor (int __i = 0; __i < __ta.size(); __i++) { if (__i > 0) System.out.print(" "); System.out.print(__ta.get(__i)); }',
  },
  linkedlist: {
    javascript: 'console.log(__listToArray(__res).join(" "));',
    python: 'print(" ".join(map(str, __list_to_array(__res))))',
    cpp: 'auto __la = __listToArray(__res);\nfor (size_t __i = 0; __i < __la.size(); __i++) { if (__i) cout << " "; cout << __la[__i]; }',
    java: 'java.util.List<Integer> __la = __listToArray(__res);\nfor (int __i = 0; __i < __la.size(); __i++) { if (__i > 0) System.out.print(" "); System.out.print(__la.get(__i)); }',
  },
};


const NODE_HELPERS = {
  tree: {
    javascript: `function __buildTree(__vals) {
  if (!__vals.length || __vals[0] === null) return null;
  const __root = new TreeNode(__vals[0]);
  const __q = [__root];
  let __i = 1;
  while (__q.length && __i < __vals.length) {
    const __node = __q.shift();
    if (__i < __vals.length && __vals[__i] !== null) {
      __node.left = new TreeNode(__vals[__i]);
      __q.push(__node.left);
    }
    __i++;
    if (__i < __vals.length && __vals[__i] !== null) {
      __node.right = new TreeNode(__vals[__i]);
      __q.push(__node.right);
    }
    __i++;
  }
  return __root;
}
function __treeToArray(__root) {
  if (!__root) return [];
  const __out = [];
  const __q = [__root];
  while (__q.length) {
    const __node = __q.shift();
    if (__node) {
      __out.push(__node.val);
      __q.push(__node.left);
      __q.push(__node.right);
    } else {
      __out.push(null);
    }
  }
  while (__out.length && __out[__out.length - 1] === null) __out.pop();
  return __out;
}`,
    python: `def __build_tree(__vals):
    if not __vals or __vals[0] is None:
        return None
    __root = TreeNode(__vals[0])
    __q = [__root]
    __i = 1
    while __q and __i < len(__vals):
        __node = __q.pop(0)
        if __i < len(__vals) and __vals[__i] is not None:
            __node.left = TreeNode(__vals[__i])
            __q.append(__node.left)
        __i += 1
        if __i < len(__vals) and __vals[__i] is not None:
            __node.right = TreeNode(__vals[__i])
            __q.append(__node.right)
        __i += 1
    return __root

def __tree_to_array(__root):
    if not __root:
        return []
    __out = []
    __q = [__root]
    while __q:
        __node = __q.pop(0)
        if __node:
            __out.append(__node.val)
            __q.append(__node.left)
            __q.append(__node.right)
        else:
            __out.append(None)
    while __out and __out[-1] is None:
        __out.pop()
    return __out`,
    cpp: `TreeNode* __buildTree(const vector<string>& __vals) {
    if (__vals.empty() || __vals[0] == "null") return nullptr;
    TreeNode* __root = new TreeNode(stoi(__vals[0]));
    queue<TreeNode*> __q;
    __q.push(__root);
    size_t __i = 1;
    while (!__q.empty() && __i < __vals.size()) {
        TreeNode* __node = __q.front(); __q.pop();
        if (__i < __vals.size() && __vals[__i] != "null") {
            __node->left = new TreeNode(stoi(__vals[__i]));
            __q.push(__node->left);
        }
        __i++;
        if (__i < __vals.size() && __vals[__i] != "null") {
            __node->right = new TreeNode(stoi(__vals[__i]));
            __q.push(__node->right);
        }
        __i++;
    }
    return __root;
}
vector<string> __treeToArray(TreeNode* __root) {
    vector<string> __out;
    if (!__root) return __out;
    queue<TreeNode*> __q;
    __q.push(__root);
    while (!__q.empty()) {
        TreeNode* __node = __q.front(); __q.pop();
        if (__node) {
            __out.push_back(to_string(__node->val));
            __q.push(__node->left);
            __q.push(__node->right);
        } else {
            __out.push_back("null");
        }
    }
    while (!__out.empty() && __out.back() == "null") __out.pop_back();
    return __out;
}`,
    java: `    static TreeNode __buildTree(String[] __vals) {
        if (__vals.length == 0 || __vals[0].equals("null")) return null;
        TreeNode __root = new TreeNode(Integer.parseInt(__vals[0]));
        java.util.Queue<TreeNode> __q = new java.util.LinkedList<>();
        __q.add(__root);
        int __i = 1;
        while (!__q.isEmpty() && __i < __vals.length) {
            TreeNode __node = __q.poll();
            if (__i < __vals.length && !__vals[__i].equals("null")) {
                __node.left = new TreeNode(Integer.parseInt(__vals[__i]));
                __q.add(__node.left);
            }
            __i++;
            if (__i < __vals.length && !__vals[__i].equals("null")) {
                __node.right = new TreeNode(Integer.parseInt(__vals[__i]));
                __q.add(__node.right);
            }
            __i++;
        }
        return __root;
    }
    static java.util.List<String> __treeToArray(TreeNode __root) {
        java.util.List<String> __out = new java.util.ArrayList<>();
        if (__root == null) return __out;
        java.util.Queue<TreeNode> __q = new java.util.LinkedList<>();
        __q.add(__root);
        while (!__q.isEmpty()) {
            TreeNode __node = __q.poll();
            if (__node != null) {
                __out.add(String.valueOf(__node.val));
                __q.add(__node.left);
                __q.add(__node.right);
            } else {
                __out.add("null");
            }
        }
        while (!__out.isEmpty() && __out.get(__out.size() - 1).equals("null")) __out.remove(__out.size() - 1);
        return __out;
    }`,
  },
  linkedlist: {
    javascript: `function __buildList(__vals) {
  const __dummy = new ListNode(0);
  let __cur = __dummy;
  for (const __v of __vals) {
    __cur.next = new ListNode(__v);
    __cur = __cur.next;
  }
  return __dummy.next;
}
function __listToArray(__head) {
  const __out = [];
  let __cur = __head;
  while (__cur) {
    __out.push(__cur.val);
    __cur = __cur.next;
  }
  return __out;
}`,
    python: `def __build_list(__vals):
    __dummy = ListNode(0)
    __cur = __dummy
    for __v in __vals:
        __cur.next = ListNode(__v)
        __cur = __cur.next
    return __dummy.next

def __list_to_array(__head):
    __out = []
    __cur = __head
    while __cur:
        __out.append(__cur.val)
        __cur = __cur.next
    return __out`,
    cpp: `ListNode* __buildList(const vector<int>& __vals) {
    ListNode __dummy(0);
    ListNode* __cur = &__dummy;
    for (int __v : __vals) {
        __cur->next = new ListNode(__v);
        __cur = __cur->next;
    }
    return __dummy.next;
}
vector<int> __listToArray(ListNode* __head) {
    vector<int> __out;
    while (__head) {
        __out.push_back(__head->val);
        __head = __head->next;
    }
    return __out;
}`,
    java: `    static ListNode __buildList(int[] __vals) {
        ListNode __dummy = new ListNode(0);
        ListNode __cur = __dummy;
        for (int __v : __vals) {
            __cur.next = new ListNode(__v);
            __cur = __cur.next;
        }
        return __dummy.next;
    }
    static java.util.List<Integer> __listToArray(ListNode __head) {
        java.util.List<Integer> __out = new java.util.ArrayList<>();
        while (__head != null) {
            __out.add(__head.val);
            __head = __head.next;
        }
        return __out;
    }`,
  },
};

const getNodeHelpers = (pattern, language) => {
  let out = "";
  if (pattern.includes("tree")) out += NODE_HELPERS.tree[language] + "\n";
  if (pattern.includes("list")) out += NODE_HELPERS.linkedlist[language] + "\n";
  return out;
};

const NODE_CLASS_DEF = {
  tree: {
    javascript: "function TreeNode(val, left, right) {\n    this.val = (val===undefined ? 0 : val);\n    this.left = (left===undefined ? null : left);\n    this.right = (right===undefined ? null : right);\n}\n",
    python: "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\n",
    cpp: "struct TreeNode {\n    int val;\n    TreeNode *left;\n    TreeNode *right;\n    TreeNode() : val(0), left(nullptr), right(nullptr) {}\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}\n};\n",
    java: "class TreeNode {\n    int val;\n    TreeNode left;\n    TreeNode right;\n    TreeNode() {}\n    TreeNode(int val) { this.val = val; }\n    TreeNode(int val, TreeNode left, TreeNode right) {\n        this.val = val;\n        this.left = left;\n        this.right = right;\n    }\n}\n",
  },
  linkedlist: {
    javascript: "function ListNode(val, next) {\n    this.val = (val===undefined ? 0 : val);\n    this.next = (next===undefined ? null : next);\n}\n",
    python: "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\n",
    cpp: "struct ListNode {\n    int val;\n    ListNode *next;\n    ListNode() : val(0), next(nullptr) {}\n    ListNode(int x) : val(x), next(nullptr) {}\n    ListNode(int x, ListNode *next) : val(x), next(next) {}\n};\n",
    java: "class ListNode {\n    int val;\n    ListNode next;\n    ListNode() {}\n    ListNode(int val) { this.val = val; }\n    ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n}\n",
  },
};

const getNodeClassDef = (pattern, language) => {
  let out = "";
  if (pattern.includes("tree")) out += NODE_CLASS_DEF.tree[language];
  if (pattern.includes("list")) out += NODE_CLASS_DEF.linkedlist[language];
  return out;
};

const toCamel = (id) =>
  id.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const toSnake = (id) => id.replace(/-/g, "_");

const getFuncName = (questionId, language) => {
  if (!questionId) return "solve";
  return language === "python" ? toSnake(questionId) : toCamel(questionId);
};

const paramList = (pattern, language) => {
  const def = PATTERNS[pattern];
  if (!def) return "";
  return def.params
    .map(([name, kind]) => {
      if (language === "javascript") return name;
      if (language === "python") return name + ": " + TYPES[kind].python;
      if (language === "cpp") return CPP_PARAM[kind] + " " + name;
      if (language === "java") return TYPES[kind].java + " " + name;
      return name;
    })
    .join(", ");
};

const getStarterCode = (pattern, language, funcName, returnsKind) => {
  const def = PATTERNS[pattern];
  const ret = TYPES[returnsKind] ? returnsKind : "string";
  if (!def || !funcName) return null;
  const params = paramList(pattern, language);
  const nodeDef = getNodeClassDef(pattern, language);
  if (language === "javascript") {
    const docs = def.params
      .map(([name, kind]) => " * @param {" + (TYPES[kind] || TYPES.string).javascript + "} " + name)
      .concat([" * @return {" + TYPES[ret].javascript + "}"]);
    return (
      nodeDef +
      "/**\n" +
      docs.join("\n") +
      "\n */\n" +
      "var " +
      funcName +
      " = function(" +
      params +
      ") {\n    // Write your code here\n};\n"
    );
  }
  if (language === "python") {
    const needOptional = pattern.includes("tree") || pattern.includes("list");
    return (
      "from typing import List" +
      (needOptional ? ", Optional" : "") +
      "\n\n" +
      nodeDef +
      "class Solution:\n    def " +
      funcName +
      "(self, " +
      params +
      ") -> " +
      TYPES[ret].python +
      ":\n        # Write your code here\n        pass\n"
    );
  }
  if (language === "cpp") {
    return (
      nodeDef +
      "class Solution {\npublic:\n    " +
      TYPES[ret].cpp +
      " " +
      funcName +
      "(" +
      params +
      ") {\n        // Write your code here\n    }\n};\n"
    );
  }
  if (language === "java") {
    return (
      nodeDef +
      "class Solution {\n    public " +
      TYPES[ret].java +
      " " +
      funcName +
      "(" +
      params +
      ") {\n        // Write your code here\n    }\n}\n"
    );
  }
  return null;
};

const invokeCall = (language, funcName, argNames) => {
  if (language === "javascript") return funcName + "(" + argNames + ")";
  if (language === "python") return "Solution()." + funcName + "(" + argNames + ")";
  if (language === "cpp") return "__sol." + funcName + "(" + argNames + ")";
  if (language === "java") return "new Solution()." + funcName + "(" + argNames + ")";
  return funcName + "(" + argNames + ")";
};

const buildDriver = (pattern, language, funcName, returnsKind) => {
  const def = PATTERNS[pattern];
  const parse = def && PARSE[pattern] ? PARSE[pattern][language] : null;
  const print = PRINT[returnsKind] ? PRINT[returnsKind][language] : null;
  if (!def || !parse || !print || !funcName) return null;
  const argNames = def.params.map(([name]) => name).join(", ");
  const call = invokeCall(language, funcName, argNames);
  const helpers = getNodeHelpers(pattern, language);
  if (language === "javascript") {
    return helpers + parse + "\nconst __res = " + call + ";\n" + print;
  }
  if (language === "python") {
    return "import sys\n" + helpers + parse + "\n__res = " + call + "\n" + print;
  }
  if (language === "cpp") {
    return (
      helpers +
      "int main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    " +
      parse.split("\n").join("\n    ") +
      "\n    Solution __sol;\n    auto __res = " +
      call +
      ";\n    " +
      print.split("\n").join("\n    ") +
      "\n    return 0;\n}"
    );
  }
  if (language === "java") {
    return (
      "public class Main {\n" +
      helpers +
      "    public static void main(String[] args) {\n        " +
      parse.split("\n").join("\n        ") +
      "\n        " +
      TYPES[returnsKind].java +
      " __res = " +
      call +
      ";\n        " +
      print.split("\n").join("\n        ") +
      "\n    }\n}"
    );
  }
  return null;
};

const buildProgram = (pattern, language, funcName, returnsKind, userCode) => {
  const driver = buildDriver(pattern, language, funcName, returnsKind);
  if (!driver || !userCode) return userCode;
  if (language === "cpp") {
    return "#include <bits/stdc++.h>\nusing namespace std;\n" + userCode + "\n" + driver + "\n";
  }
  if (language === "java") {
    return "import java.util.*;\n" + userCode + "\n" + driver + "\n";
  }
  return userCode + "\n" + driver + "\n";
};

const buildBatchProgram = (pattern, language, funcName, returnsKind, userCode, inputs, uuid) => {
  const def = PATTERNS[pattern];
  const parse = def && PARSE[pattern] ? PARSE[pattern][language] : null;
  const print = PRINT[returnsKind] ? PRINT[returnsKind][language] : null;
  if (!def || !parse || !print || !funcName || !userCode || !inputs || !inputs.length || !uuid) return null;
  const argNames = def.params.map(([name]) => name).join(", ");
  const call = invokeCall(language, funcName, argNames);
  const helpers = getNodeHelpers(pattern, language);
  const casesLit = inputs.map((s) => JSON.stringify(s)).join(", ");
  const pad = (code, n) => {
    const p = " ".repeat(n);
    return code.split("\n").map((l) => (l.trim() ? p + l : l)).join("\n");
  };
  if (language === "javascript") {
    const parseBatch = parse.split('require("fs").readFileSync(0, "utf8")').join("__cases[__ci]");
    const body = pad(parseBatch + "\nconst __res = " + call + ";\n" + print, 4);
    return (
      userCode + "\n" + helpers +
      "const __cases = [" + casesLit + "];\n" +
      "for (let __ci = 0; __ci < __cases.length; __ci++) {\n" +
      "  console.log(\"__IQ" + uuid + "B\" + __ci + \"__\");\n" +
      "  try {\n" + body + "\n" +
      "  } catch (__e) {\n" +
      "    console.log(\"__IQ" + uuid + "X\" + __ci + \"__\");\n" +
      "    console.log(__e && __e.stack ? __e.stack : String(__e));\n" +
      "  }\n" +
      "  console.log(\"__IQ" + uuid + "E\" + __ci + \"__\");\n" +
      "}\n"
    );
  }
  if (language === "python") {
    const body = pad(parse + "\n__res = " + call + "\n" + print, 8);
    return (
      "import sys, io, traceback\n" + userCode + "\n" + helpers +
      "__cases = [" + casesLit + "]\n" +
      "for __ci in range(len(__cases)):\n" +
      "    print(\"__IQ" + uuid + "B\" + str(__ci) + \"__\")\n" +
      "    try:\n" +
      "        sys.stdin = io.StringIO(__cases[__ci])\n" + body + "\n" +
      "    except Exception:\n" +
      "        print(\"__IQ" + uuid + "X\" + str(__ci) + \"__\")\n" +
      "        print(traceback.format_exc().strip())\n" +
      "    print(\"__IQ" + uuid + "E\" + str(__ci) + \"__\")\n"
    );
  }
  if (language === "cpp") {
    const parseBatch = parse.split("return 0;").join("return false;");
    const body = pad(parseBatch, 8) + "\n        cin.rdbuf(__oldbuf);\n        Solution __sol;\n        auto __res = " + call + ";\n" + pad(print, 8);
    return (
      "#include <bits/stdc++.h>\nusing namespace std;\n" + userCode + "\n" + helpers +
      "vector<string> __cases = {" + casesLit + "};\n" +
      "bool __runCase(const string& __input) {\n" +
      "    istringstream __iss(__input);\n" +
      "    streambuf* __oldbuf = cin.rdbuf(__iss.rdbuf());\n" +
      body + "\n" +
      "    return true;\n" +
      "}\n" +
      "int main() {\n" +
      "    ios::sync_with_stdio(false);\n" +
      "    cin.tie(nullptr);\n" +
      "    for (size_t __ci = 0; __ci < __cases.size(); __ci++) {\n" +
      "        cout << \"__IQ" + uuid + "B\" << __ci << \"__\\n\";\n" +
      "        try {\n" +
      "            if (!__runCase(__cases[__ci])) {\n" +
      "                cout << \"__IQ" + uuid + "X\" << __ci << \"__\\nFailed to parse input\\n\";\n" +
      "            }\n" +
      "        } catch (const exception& __e) {\n" +
      "            cout << \"__IQ" + uuid + "X\" << __ci << \"__\\n\" << __e.what() << \"\\n\";\n" +
      "        } catch (...) {\n" +
      "            cout << \"__IQ" + uuid + "X\" << __ci << \"__\\nUnknown runtime error\\n\";\n" +
      "        }\n" +
      "        cout << \"__IQ" + uuid + "E\" << __ci << \"__\\n\";\n" +
      "    }\n" +
      "    return 0;\n" +
      "}\n"
    );
  }
  if (language === "java") {
    const parseBatch = parse.split("System.in").join("__caseStr");
    const body = pad(parseBatch, 8) + "\n        " + TYPES[returnsKind].java + " __res = " + call + ";\n" + pad(print, 8);
    return (
      "import java.util.*;\n" + userCode + "\n" +
      "public class Main {\n" + helpers +
      "    static String[] __cases = {" + casesLit + "};\n" +
      "    static boolean __runCase(String __input) {\n" +
      "        String __caseStr = __input;\n" +
      body + "\n" +
      "        return true;\n" +
      "    }\n" +
      "    public static void main(String[] args) {\n" +
      "        for (int __ci = 0; __ci < __cases.length; __ci++) {\n" +
      "            System.out.println(\"__IQ" + uuid + "B\" + __ci + \"__\");\n" +
      "            try {\n" +
      "                if (!__runCase(__cases[__ci])) {\n" +
      "                    System.out.println(\"__IQ" + uuid + "X\" + __ci + \"__\");\n" +
      "                    System.out.println(\"Failed to parse input\");\n" +
      "                }\n" +
      "            } catch (Throwable __e) {\n" +
      "                System.out.println(\"__IQ" + uuid + "X\" + __ci + \"__\");\n" +
      "                java.io.StringWriter __sw = new java.io.StringWriter();\n" +
      "                java.io.PrintWriter __pw = new java.io.PrintWriter(__sw);\n" +
      "                __e.printStackTrace(__pw);\n" +
      "                __pw.flush();\n" +
      "                System.out.println(__sw.toString().trim());\n" +
      "            }\n" +
      "            System.out.println(\"__IQ" + uuid + "E\" + __ci + \"__\");\n" +
      "        }\n" +
      "    }\n" +
      "}\n"
    );
  }
  return null;
};

export { TYPES, PATTERNS, getFuncName, getStarterCode, buildDriver, buildProgram, buildBatchProgram };
export default { TYPES, PATTERNS, getFuncName, getStarterCode, buildDriver, buildProgram, buildBatchProgram };
