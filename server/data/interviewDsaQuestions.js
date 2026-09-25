const DSA_QUESTION_BANK = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "easy",
    topic: "array",
    description:
      "Given an array of integers and a target value, print the indices of the two numbers that add up to the target (0-indexed, space-separated). Assume exactly one valid answer exists.\n\nInput:\nLine 1: the array, space-separated integers\nLine 2: the target integer\n\nOutput:\nThe two indices, space-separated, on one line.",
    testCases: [
      { input: "2 7 11 15\n9", expectedOutput: "0 1" },
      { input: "3 2 4\n6", expectedOutput: "1 2" },
      { input: "3 3\n6", expectedOutput: "0 1" },
      { input: "1 5 3 7 9 2\n11", expectedOutput: "4 5" },
    ],
    starterCode: {
      javascript:
        "const lines = require('fs').readFileSync(0, 'utf8').split('\\n');\nconst nums = lines[0].trim().split(/\\s+/).map(Number);\nconst target = parseInt(lines[1]);\n\nfunction twoSum(nums, target) {\n  // write your solution here\n\n}\n\nconsole.log(twoSum(nums, target).join(' '));\n",
      python:
        "import sys\ndata = sys.stdin.read().split('\\n')\nnums = list(map(int, data[0].split()))\ntarget = int(data[1])\n\ndef two_sum(nums, target):\n    # write your solution here\n    pass\n\nprint(' '.join(map(str, two_sum(nums, target))))\n",
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // write your solution here\n\n    return {};\n}\n\nint main() {\n    string line1, line2;\n    getline(cin, line1);\n    getline(cin, line2);\n    stringstream ss(line1);\n    vector<int> nums;\n    int x;\n    while (ss >> x) nums.push_back(x);\n    int target = stoi(line2);\n\n    vector<int> res = twoSum(nums, target);\n    for (size_t i = 0; i < res.size(); i++) {\n        cout << res[i];\n        if (i + 1 < res.size()) cout << " ";\n    }\n    cout << endl;\n    return 0;\n}\n',
      java: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    static int[] twoSum(int[] nums, int target) {\n        // write your solution here\n\n        return new int[0];\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int[] nums = Arrays.stream(br.readLine().trim().split("\\\\s+")).mapToInt(Integer::parseInt).toArray();\n        int target = Integer.parseInt(br.readLine().trim());\n\n        int[] res = twoSum(nums, target);\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < res.length; i++) {\n            sb.append(res[i]);\n            if (i + 1 < res.length) sb.append(" ");\n        }\n        System.out.println(sb.toString());\n    }\n}\n',
    },
  },
  {
    id: "valid-anagram",
    title: "Valid Anagram",
    difficulty: "easy",
    topic: "string",
    description:
      'Given two strings, print "true" if the second string is an anagram of the first, otherwise print "false".\n\nInput:\nLine 1: string s\nLine 2: string t\n\nOutput:\ntrue or false (lowercase)',
    testCases: [
      { input: "anagram\nnagaram", expectedOutput: "true" },
      { input: "rat\ncar", expectedOutput: "false" },
      { input: "listen\nsilent", expectedOutput: "true" },
      { input: "abc\nabcd", expectedOutput: "false" },
    ],
    starterCode: {
      javascript:
        "const lines = require('fs').readFileSync(0, 'utf8').split('\\n');\nconst s = lines[0].trim();\nconst t = lines[1].trim();\n\nfunction isAnagram(s, t) {\n  // write your solution here\n\n}\n\nconsole.log(isAnagram(s, t));\n",
      python:
        "import sys\ndata = sys.stdin.read().split('\\n')\ns = data[0].strip()\nt = data[1].strip()\n\ndef is_anagram(s, t):\n    # write your solution here\n    pass\n\nprint(str(is_anagram(s, t)).lower())\n",
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nbool isAnagram(string s, string t) {\n    // write your solution here\n\n    return false;\n}\n\nint main() {\n    string s, t;\n    getline(cin, s);\n    getline(cin, t);\n\n    cout << (isAnagram(s, t) ? "true" : "false") << endl;\n    return 0;\n}\n',
      java: "import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    static boolean isAnagram(String s, String t) {\n        // write your solution here\n\n        return false;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String s = br.readLine().trim();\n        String t = br.readLine().trim();\n\n        System.out.println(isAnagram(s, t));\n    }\n}\n",
    },
  },
  {
    id: "binary-search",
    title: "Binary Search",
    difficulty: "easy",
    topic: "binary search",
    description:
      "Given a sorted array of distinct integers and a target, print the index of the target using binary search, or -1 if it isn't present.\n\nInput:\nLine 1: sorted array, space-separated integers\nLine 2: the target integer\n\nOutput:\nThe index (0-indexed), or -1",
    testCases: [
      { input: "-1 0 3 5 9 12\n9", expectedOutput: "4" },
      { input: "-1 0 3 5 9 12\n2", expectedOutput: "-1" },
      { input: "5\n5", expectedOutput: "0" },
      { input: "1 2 3 4 5 6 7 8 9 10\n10", expectedOutput: "9" },
    ],
    starterCode: {
      javascript:
        "const lines = require('fs').readFileSync(0, 'utf8').split('\\n');\nconst nums = lines[0].trim().split(/\\s+/).map(Number);\nconst target = parseInt(lines[1]);\n\nfunction search(nums, target) {\n  // write your solution here — must be O(log n)\n\n}\n\nconsole.log(search(nums, target));\n",
      python:
        "import sys\ndata = sys.stdin.read().split('\\n')\nnums = list(map(int, data[0].split()))\ntarget = int(data[1])\n\ndef search(nums, target):\n    # write your solution here — must be O(log n)\n    pass\n\nprint(search(nums, target))\n",
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\nint search(vector<int>& nums, int target) {\n    // write your solution here — must be O(log n)\n\n    return -1;\n}\n\nint main() {\n    string line1, line2;\n    getline(cin, line1);\n    getline(cin, line2);\n    stringstream ss(line1);\n    vector<int> nums;\n    int x;\n    while (ss >> x) nums.push_back(x);\n    int target = stoi(line2);\n\n    cout << search(nums, target) << endl;\n    return 0;\n}\n",
      java: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    static int search(int[] nums, int target) {\n        // write your solution here — must be O(log n)\n\n        return -1;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int[] nums = Arrays.stream(br.readLine().trim().split("\\\\s+")).mapToInt(Integer::parseInt).toArray();\n        int target = Integer.parseInt(br.readLine().trim());\n\n        System.out.println(search(nums, target));\n    }\n}\n',
    },
  },
  {
    id: "best-time-to-buy-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "easy",
    topic: "array",
    description:
      "Given an array of stock prices by day, print the maximum profit from one buy and one sell (buy before sell). If no profit is possible, print 0.\n\nInput:\nLine 1: prices, space-separated integers\n\nOutput:\nThe maximum profit (a single integer)",
    testCases: [
      { input: "7 1 5 3 6 4", expectedOutput: "5" },
      { input: "7 6 4 3 1", expectedOutput: "0" },
      { input: "1 2", expectedOutput: "1" },
      { input: "3 3 5 0 0 3 1 4", expectedOutput: "4" },
    ],
    starterCode: {
      javascript:
        "const prices = require('fs').readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\n\nfunction maxProfit(prices) {\n  // write your solution here — single pass, O(n)\n\n}\n\nconsole.log(maxProfit(prices));\n",
      python:
        "import sys\nprices = list(map(int, sys.stdin.read().split()))\n\ndef max_profit(prices):\n    # write your solution here — single pass, O(n)\n    pass\n\nprint(max_profit(prices))\n",
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\nint maxProfit(vector<int>& prices) {\n    // write your solution here — single pass, O(n)\n\n    return 0;\n}\n\nint main() {\n    string line;\n    getline(cin, line);\n    stringstream ss(line);\n    vector<int> prices;\n    int x;\n    while (ss >> x) prices.push_back(x);\n\n    cout << maxProfit(prices) << endl;\n    return 0;\n}\n",
      java: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    static int maxProfit(int[] prices) {\n        // write your solution here — single pass, O(n)\n\n        return 0;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int[] prices = Arrays.stream(br.readLine().trim().split("\\\\s+")).mapToInt(Integer::parseInt).toArray();\n\n        System.out.println(maxProfit(prices));\n    }\n}\n',
    },
  },
  {
    id: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "easy",
    topic: "array",
    description:
      'Given an array of integers, print "true" if any value appears at least twice, otherwise print "false".\n\nInput:\nLine 1: the array, space-separated integers\n\nOutput:\ntrue or false (lowercase)',
    testCases: [
      { input: "1 2 3 1", expectedOutput: "true" },
      { input: "1 2 3 4", expectedOutput: "false" },
      { input: "1 1 1 3 3 4 3 2 4 2", expectedOutput: "true" },
      { input: "5", expectedOutput: "false" },
    ],
    starterCode: {
      javascript:
        "const nums = require('fs').readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\n\nfunction containsDuplicate(nums) {\n  // write your solution here\n\n}\n\nconsole.log(containsDuplicate(nums));\n",
      python:
        "import sys\nnums = list(map(int, sys.stdin.read().split()))\n\ndef contains_duplicate(nums):\n    # write your solution here\n    pass\n\nprint(str(contains_duplicate(nums)).lower())\n",
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nbool containsDuplicate(vector<int>& nums) {\n    // write your solution here\n\n    return false;\n}\n\nint main() {\n    string line;\n    getline(cin, line);\n    stringstream ss(line);\n    vector<int> nums;\n    int x;\n    while (ss >> x) nums.push_back(x);\n\n    cout << (containsDuplicate(nums) ? "true" : "false") << endl;\n    return 0;\n}\n',
      java: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    static boolean containsDuplicate(int[] nums) {\n        // write your solution here\n\n        return false;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int[] nums = Arrays.stream(br.readLine().trim().split("\\\\s+")).mapToInt(Integer::parseInt).toArray();\n\n        System.out.println(containsDuplicate(nums));\n    }\n}\n',
    },
  },
  {
    id: "valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "easy",
    topic: "string",
    description:
      'Given a string, ignoring case and non-alphanumeric characters, print "true" if it reads the same forwards and backwards, otherwise print "false".\n\nInput:\nLine 1: the string\n\nOutput:\ntrue or false (lowercase)',
    testCases: [
      { input: "A man, a plan, a canal: Panama", expectedOutput: "true" },
      { input: "race a car", expectedOutput: "false" },
      { input: "No lemon, no melon", expectedOutput: "true" },
      { input: "Was it a car or a cat I saw?", expectedOutput: "true" },
    ],
    starterCode: {
      javascript:
        "const s = require('fs').readFileSync(0, 'utf8').replace(/\\n$/, '');\n\nfunction isPalindrome(s) {\n  // write your solution here — ignore case and non-alphanumeric characters\n\n}\n\nconsole.log(isPalindrome(s));\n",
      python:
        "import sys\ns = sys.stdin.readline().rstrip('\\n')\n\ndef is_palindrome(s):\n    # write your solution here — ignore case and non-alphanumeric characters\n    pass\n\nprint(str(is_palindrome(s)).lower())\n",
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nbool isPalindrome(string s) {\n    // write your solution here — ignore case and non-alphanumeric characters\n\n    return false;\n}\n\nint main() {\n    string s;\n    getline(cin, s);\n\n    cout << (isPalindrome(s) ? "true" : "false") << endl;\n    return 0;\n}\n',
      java: "import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    static boolean isPalindrome(String s) {\n        // write your solution here — ignore case and non-alphanumeric characters\n\n        return false;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String s = br.readLine();\n\n        System.out.println(isPalindrome(s));\n    }\n}\n",
    },
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "easy",
    topic: "stack",
    description:
      "Given a string containing only '(', ')', '{', '}', '[', ']', print \"true\" if every bracket is closed in the correct order, otherwise print \"false\".\n\nInput:\nLine 1: the string\n\nOutput:\ntrue or false (lowercase)",
    testCases: [
      { input: "()", expectedOutput: "true" },
      { input: "()[]{}", expectedOutput: "true" },
      { input: "(]", expectedOutput: "false" },
      { input: "([)]", expectedOutput: "false" },
    ],
    starterCode: {
      javascript:
        "const s = require('fs').readFileSync(0, 'utf8').trim();\n\nfunction isValid(s) {\n  // write your solution here — use a stack\n\n}\n\nconsole.log(isValid(s));\n",
      python:
        "import sys\ns = sys.stdin.readline().strip()\n\ndef is_valid(s):\n    # write your solution here — use a stack\n    pass\n\nprint(str(is_valid(s)).lower())\n",
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\nbool isValid(string s) {\n    // write your solution here — use a stack\n\n    return false;\n}\n\nint main() {\n    string s;\n    getline(cin, s);\n    // trim any trailing whitespace/carriage return\n    while (!s.empty() && (s.back() == '\\r' || s.back() == ' ')) s.pop_back();\n\n    cout << (isValid(s) ? \"true\" : \"false\") << endl;\n    return 0;\n}\n",
      java: "import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    static boolean isValid(String s) {\n        // write your solution here — use a stack\n\n        return false;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String s = br.readLine().trim();\n\n        System.out.println(isValid(s));\n    }\n}\n",
    },
  },
  {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "easy",
    topic: "dynamic programming",
    description:
      "You're climbing a staircase of n steps, and can climb 1 or 2 steps at a time. Print how many distinct ways there are to reach the top.\n\nInput:\nLine 1: n (an integer)\n\nOutput:\nThe number of distinct ways (a single integer)",
    testCases: [
      { input: "2", expectedOutput: "2" },
      { input: "3", expectedOutput: "3" },
      { input: "5", expectedOutput: "8" },
      { input: "10", expectedOutput: "89" },
    ],
    starterCode: {
      javascript:
        "const n = parseInt(require('fs').readFileSync(0, 'utf8').trim());\n\nfunction climbStairs(n) {\n  // write your solution here — DP, O(n)\n\n}\n\nconsole.log(climbStairs(n));\n",
      python:
        "import sys\nn = int(sys.stdin.readline().strip())\n\ndef climb_stairs(n):\n    # write your solution here — DP, O(n)\n    pass\n\nprint(climb_stairs(n))\n",
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\nint climbStairs(int n) {\n    // write your solution here — DP, O(n)\n\n    return 0;\n}\n\nint main() {\n    int n;\n    cin >> n;\n\n    cout << climbStairs(n) << endl;\n    return 0;\n}\n",
      java: "import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    static int climbStairs(int n) {\n        // write your solution here — DP, O(n)\n\n        return 0;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int n = Integer.parseInt(br.readLine().trim());\n\n        System.out.println(climbStairs(n));\n    }\n}\n",
    },
  },
  {
    id: "missing-number",
    title: "Missing Number",
    difficulty: "easy",
    topic: "array",
    description:
      "Given an array containing n distinct numbers from 0 to n, print the one number missing from the array.\n\nInput:\nLine 1: the array, space-separated integers\n\nOutput:\nThe missing number (a single integer)",
    testCases: [
      { input: "3 0 1", expectedOutput: "2" },
      { input: "0 1", expectedOutput: "2" },
      { input: "9 6 4 2 3 5 7 0 1", expectedOutput: "8" },
      { input: "0", expectedOutput: "1" },
    ],
    starterCode: {
      javascript:
        "const nums = require('fs').readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\n\nfunction missingNumber(nums) {\n  // write your solution here — try the sum trick, O(n)\n\n}\n\nconsole.log(missingNumber(nums));\n",
      python:
        "import sys\nnums = list(map(int, sys.stdin.read().split()))\n\ndef missing_number(nums):\n    # write your solution here — try the sum trick, O(n)\n    pass\n\nprint(missing_number(nums))\n",
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\nint missingNumber(vector<int>& nums) {\n    // write your solution here — try the sum trick, O(n)\n\n    return 0;\n}\n\nint main() {\n    string line;\n    getline(cin, line);\n    stringstream ss(line);\n    vector<int> nums;\n    int x;\n    while (ss >> x) nums.push_back(x);\n\n    cout << missingNumber(nums) << endl;\n    return 0;\n}\n",
      java: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    static int missingNumber(int[] nums) {\n        // write your solution here — try the sum trick, O(n)\n\n        return 0;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int[] nums = Arrays.stream(br.readLine().trim().split("\\\\s+")).mapToInt(Integer::parseInt).toArray();\n\n        System.out.println(missingNumber(nums));\n    }\n}\n',
    },
  },
  {
    id: "single-number",
    title: "Single Number",
    difficulty: "easy",
    topic: "bit manipulation",
    description:
      "Given a non-empty array where every element appears twice except for one, print that single element. Try to do it in O(n) time and O(1) space.\n\nInput:\nLine 1: the array, space-separated integers\n\nOutput:\nThe single element (a single integer)",
    testCases: [
      { input: "2 2 1", expectedOutput: "1" },
      { input: "4 1 2 1 2", expectedOutput: "4" },
      { input: "1", expectedOutput: "1" },
      { input: "7 3 5 4 3 5 7", expectedOutput: "4" },
    ],
    starterCode: {
      javascript:
        "const nums = require('fs').readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\n\nfunction singleNumber(nums) {\n  // write your solution here — XOR trick gets O(1) space\n\n}\n\nconsole.log(singleNumber(nums));\n",
      python:
        "import sys\nnums = list(map(int, sys.stdin.read().split()))\n\ndef single_number(nums):\n    # write your solution here — XOR trick gets O(1) space\n    pass\n\nprint(single_number(nums))\n",
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\nint singleNumber(vector<int>& nums) {\n    // write your solution here — XOR trick gets O(1) space\n\n    return 0;\n}\n\nint main() {\n    string line;\n    getline(cin, line);\n    stringstream ss(line);\n    vector<int> nums;\n    int x;\n    while (ss >> x) nums.push_back(x);\n\n    cout << singleNumber(nums) << endl;\n    return 0;\n}\n",
      java: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    static int singleNumber(int[] nums) {\n        // write your solution here — XOR trick gets O(1) space\n\n        return 0;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int[] nums = Arrays.stream(br.readLine().trim().split("\\\\s+")).mapToInt(Integer::parseInt).toArray();\n\n        System.out.println(singleNumber(nums));\n    }\n}\n',
    },
  },
  {
    id: "longest-common-prefix",
    title: "Longest Common Prefix",
    difficulty: "easy",
    topic: "string",
    description:
      "Given a list of words, print the longest common prefix string among them. If there's no common prefix, print an empty line.\n\nInput:\nLine 1: the words, space-separated\n\nOutput:\nThe longest common prefix (may be empty)",
    testCases: [
      { input: "flower flow flight", expectedOutput: "fl" },
      { input: "dog racecar car", expectedOutput: "" },
      {
        input: "interspecies interstellar interstate",
        expectedOutput: "inters",
      },
      { input: "throne throne", expectedOutput: "throne" },
    ],
    starterCode: {
      javascript:
        "const words = require('fs').readFileSync(0, 'utf8').trim().split(/\\s+/);\n\nfunction longestCommonPrefix(words) {\n  // write your solution here\n\n}\n\nconsole.log(longestCommonPrefix(words));\n",
      python:
        "import sys\nwords = sys.stdin.read().split()\n\ndef longest_common_prefix(words):\n    # write your solution here\n    pass\n\nprint(longest_common_prefix(words))\n",
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nstring longestCommonPrefix(vector<string>& words) {\n    // write your solution here\n\n    return "";\n}\n\nint main() {\n    string line;\n    getline(cin, line);\n    stringstream ss(line);\n    vector<string> words;\n    string w;\n    while (ss >> w) words.push_back(w);\n\n    cout << longestCommonPrefix(words) << endl;\n    return 0;\n}\n',
      java: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    static String longestCommonPrefix(String[] words) {\n        // write your solution here\n\n        return "";\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String[] words = br.readLine().trim().split("\\\\s+");\n\n        System.out.println(longestCommonPrefix(words));\n    }\n}\n',
    },
  },
  {
    id: "move-zeroes",
    title: "Move Zeroes",
    difficulty: "easy",
    topic: "two pointers",
    description:
      "Given an array of integers, move all zeroes to the end while keeping the relative order of the non-zero elements, then print the resulting array (space-separated).\n\nInput:\nLine 1: the array, space-separated integers\n\nOutput:\nThe resulting array, space-separated",
    testCases: [
      { input: "0 1 0 3 12", expectedOutput: "1 3 12 0 0" },
      { input: "0", expectedOutput: "0" },
      { input: "1 0 1", expectedOutput: "1 1 0" },
      { input: "0 0 1", expectedOutput: "1 0 0" },
    ],
    starterCode: {
      javascript:
        "const nums = require('fs').readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\n\nfunction moveZeroes(nums) {\n  // write your solution here — in place, keep relative order\n\n  return nums;\n}\n\nconsole.log(moveZeroes(nums).join(' '));\n",
      python:
        "import sys\nnums = list(map(int, sys.stdin.read().split()))\n\ndef move_zeroes(nums):\n    # write your solution here — in place, keep relative order\n    return nums\n\nprint(' '.join(map(str, move_zeroes(nums))))\n",
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nvector<int> moveZeroes(vector<int>& nums) {\n    // write your solution here — in place, keep relative order\n\n    return nums;\n}\n\nint main() {\n    string line;\n    getline(cin, line);\n    stringstream ss(line);\n    vector<int> nums;\n    int x;\n    while (ss >> x) nums.push_back(x);\n\n    vector<int> res = moveZeroes(nums);\n    for (size_t i = 0; i < res.size(); i++) {\n        cout << res[i];\n        if (i + 1 < res.size()) cout << " ";\n    }\n    cout << endl;\n    return 0;\n}\n',
      java: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    static int[] moveZeroes(int[] nums) {\n        // write your solution here — in place, keep relative order\n\n        return nums;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int[] nums = Arrays.stream(br.readLine().trim().split("\\\\s+")).mapToInt(Integer::parseInt).toArray();\n\n        int[] res = moveZeroes(nums);\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < res.length; i++) {\n            sb.append(res[i]);\n            if (i + 1 < res.length) sb.append(" ");\n        }\n        System.out.println(sb.toString());\n    }\n}\n',
    },
  },
  {
    id: "majority-element",
    title: "Majority Element",
    difficulty: "easy",
    topic: "array",
    description:
      "Given an array of size n, print the majority element — the one that appears more than n/2 times. You may assume it always exists.\n\nInput:\nLine 1: the array, space-separated integers\n\nOutput:\nThe majority element (a single integer)",
    testCases: [
      { input: "3 2 3", expectedOutput: "3" },
      { input: "2 2 1 1 1 2 2", expectedOutput: "2" },
      { input: "1", expectedOutput: "1" },
      { input: "6 5 5", expectedOutput: "5" },
    ],
    starterCode: {
      javascript:
        "const nums = require('fs').readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\n\nfunction majorityElement(nums) {\n  // write your solution here — try Boyer-Moore voting for O(1) space\n\n}\n\nconsole.log(majorityElement(nums));\n",
      python:
        "import sys\nnums = list(map(int, sys.stdin.read().split()))\n\ndef majority_element(nums):\n    # write your solution here — try Boyer-Moore voting for O(1) space\n    pass\n\nprint(majority_element(nums))\n",
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\nint majorityElement(vector<int>& nums) {\n    // write your solution here — try Boyer-Moore voting for O(1) space\n\n    return 0;\n}\n\nint main() {\n    string line;\n    getline(cin, line);\n    stringstream ss(line);\n    vector<int> nums;\n    int x;\n    while (ss >> x) nums.push_back(x);\n\n    cout << majorityElement(nums) << endl;\n    return 0;\n}\n",
      java: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    static int majorityElement(int[] nums) {\n        // write your solution here — try Boyer-Moore voting for O(1) space\n\n        return 0;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int[] nums = Arrays.stream(br.readLine().trim().split("\\\\s+")).mapToInt(Integer::parseInt).toArray();\n\n        System.out.println(majorityElement(nums));\n    }\n}\n',
    },
  },
  {
    id: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "medium",
    topic: "array",
    description:
      "Given an array of integers (which may include negatives), print the largest possible sum of a contiguous subarray.\n\nInput:\nLine 1: the array, space-separated integers\n\nOutput:\nThe maximum subarray sum (a single integer)",
    testCases: [
      { input: "-2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6" },
      { input: "1", expectedOutput: "1" },
      { input: "5 4 -1 7 8", expectedOutput: "23" },
      { input: "-1 -2 -3 -4", expectedOutput: "-1" },
    ],
    starterCode: {
      javascript:
        "const nums = require('fs').readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\n\nfunction maxSubArray(nums) {\n  // write your solution here — Kadane's algorithm runs in O(n)\n\n}\n\nconsole.log(maxSubArray(nums));\n",
      python:
        "import sys\nnums = list(map(int, sys.stdin.read().split()))\n\ndef max_sub_array(nums):\n    # write your solution here — Kadane's algorithm runs in O(n)\n    pass\n\nprint(max_sub_array(nums))\n",
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\nint maxSubArray(vector<int>& nums) {\n    // write your solution here — Kadane's algorithm runs in O(n)\n\n    return 0;\n}\n\nint main() {\n    string line;\n    getline(cin, line);\n    stringstream ss(line);\n    vector<int> nums;\n    int x;\n    while (ss >> x) nums.push_back(x);\n\n    cout << maxSubArray(nums) << endl;\n    return 0;\n}\n",
      java: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    static int maxSubArray(int[] nums) {\n        // write your solution here — Kadane\'s algorithm runs in O(n)\n\n        return 0;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int[] nums = Arrays.stream(br.readLine().trim().split("\\\\s+")).mapToInt(Integer::parseInt).toArray();\n\n        System.out.println(maxSubArray(nums));\n    }\n}\n',
    },
  },
  {
    id: "search-rotated-sorted-array",
    title: "Search in Rotated Sorted Array",
    difficulty: "medium",
    topic: "binary search",
    description:
      "You're given a sorted array of distinct integers that has been rotated at an unknown pivot, and a target value. Print the index of the target, or -1 if it isn't present. Your solution must run in O(log n).\n\nInput:\nLine 1: the rotated array, space-separated integers\nLine 2: the target integer\n\nOutput:\nThe index (0-indexed), or -1",
    testCases: [
      { input: "4 5 6 7 0 1 2\n0", expectedOutput: "4" },
      { input: "4 5 6 7 0 1 2\n3", expectedOutput: "-1" },
      { input: "1\n0", expectedOutput: "-1" },
      { input: "6 7 8 1 2 3 4 5\n8", expectedOutput: "2" },
    ],
    starterCode: {
      javascript:
        "const lines = require('fs').readFileSync(0, 'utf8').split('\\n');\nconst nums = lines[0].trim().split(/\\s+/).map(Number);\nconst target = parseInt(lines[1]);\n\nfunction search(nums, target) {\n  // write your solution here — must be O(log n)\n\n}\n\nconsole.log(search(nums, target));\n",
      python:
        "import sys\ndata = sys.stdin.read().split('\\n')\nnums = list(map(int, data[0].split()))\ntarget = int(data[1])\n\ndef search(nums, target):\n    # write your solution here — must be O(log n)\n    pass\n\nprint(search(nums, target))\n",
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\nint search(vector<int>& nums, int target) {\n    // write your solution here — must be O(log n)\n\n    return -1;\n}\n\nint main() {\n    string line1, line2;\n    getline(cin, line1);\n    getline(cin, line2);\n    stringstream ss(line1);\n    vector<int> nums;\n    int x;\n    while (ss >> x) nums.push_back(x);\n    int target = stoi(line2);\n\n    cout << search(nums, target) << endl;\n    return 0;\n}\n",
      java: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    static int search(int[] nums, int target) {\n        // write your solution here — must be O(log n)\n\n        return -1;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int[] nums = Arrays.stream(br.readLine().trim().split("\\\\s+")).mapToInt(Integer::parseInt).toArray();\n        int target = Integer.parseInt(br.readLine().trim());\n\n        System.out.println(search(nums, target));\n    }\n}\n',
    },
  },
  {
    id: "longest-substring-without-repeating",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "medium",
    topic: "sliding window",
    description:
      "Given a string, print the length of the longest substring without repeating characters.\n\nInput:\nLine 1: the string\n\nOutput:\nThe length (a single integer)",
    testCases: [
      { input: "abcabcbb", expectedOutput: "3" },
      { input: "bbbbb", expectedOutput: "1" },
      { input: "pwwkew", expectedOutput: "3" },
      { input: "dvdf", expectedOutput: "3" },
    ],
    starterCode: {
      javascript:
        "const s = require('fs').readFileSync(0, 'utf8').split('\\n')[0];\n\nfunction lengthOfLongestSubstring(s) {\n  // write your solution here — sliding window runs in O(n)\n\n}\n\nconsole.log(lengthOfLongestSubstring(s));\n",
      python:
        "import sys\ns = sys.stdin.readline().strip()\n\ndef length_of_longest_substring(s):\n    # write your solution here — sliding window runs in O(n)\n    pass\n\nprint(length_of_longest_substring(s))\n",
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\nint lengthOfLongestSubstring(string s) {\n    // write your solution here — sliding window runs in O(n)\n\n    return 0;\n}\n\nint main() {\n    string s;\n    getline(cin, s);\n\n    cout << lengthOfLongestSubstring(s) << endl;\n    return 0;\n}\n",
      java: "import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    static int lengthOfLongestSubstring(String s) {\n        // write your solution here — sliding window runs in O(n)\n\n        return 0;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String s = br.readLine().trim();\n\n        System.out.println(lengthOfLongestSubstring(s));\n    }\n}\n",
    },
  },
  {
    id: "product-of-array-except-self",
    title: "Product of Array Except Self",
    difficulty: "medium",
    topic: "array",
    description:
      "Given an array of integers, print an array where each element is the product of all other elements (not itself), without using division. Space-separated output.\n\nInput:\nLine 1: the array, space-separated integers\n\nOutput:\nThe resulting array, space-separated",
    testCases: [
      { input: "1 2 3 4", expectedOutput: "24 12 8 6" },
      { input: "-1 1 0 -3 3", expectedOutput: "0 0 9 0 0" },
      { input: "2 3", expectedOutput: "3 2" },
      { input: "4 5 1 8 2", expectedOutput: "80 64 320 40 160" },
    ],
    starterCode: {
      javascript:
        "const nums = require('fs').readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\n\nfunction productExceptSelf(nums) {\n  // write your solution here — prefix/suffix products, O(n), no division\n\n}\n\nconsole.log(productExceptSelf(nums).join(' '));\n",
      python:
        "import sys\nnums = list(map(int, sys.stdin.read().split()))\n\ndef product_except_self(nums):\n    # write your solution here — prefix/suffix products, O(n), no division\n    pass\n\nprint(' '.join(map(str, product_except_self(nums))))\n",
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nvector<long long> productExceptSelf(vector<int>& nums) {\n    // write your solution here — prefix/suffix products, O(n), no division\n\n    return {};\n}\n\nint main() {\n    string line;\n    getline(cin, line);\n    stringstream ss(line);\n    vector<int> nums;\n    int x;\n    while (ss >> x) nums.push_back(x);\n\n    vector<long long> res = productExceptSelf(nums);\n    for (size_t i = 0; i < res.size(); i++) {\n        cout << res[i];\n        if (i + 1 < res.size()) cout << " ";\n    }\n    cout << endl;\n    return 0;\n}\n',
      java: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    static long[] productExceptSelf(int[] nums) {\n        // write your solution here — prefix/suffix products, O(n), no division\n\n        return new long[0];\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int[] nums = Arrays.stream(br.readLine().trim().split("\\\\s+")).mapToInt(Integer::parseInt).toArray();\n\n        long[] res = productExceptSelf(nums);\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < res.length; i++) {\n            sb.append(res[i]);\n            if (i + 1 < res.length) sb.append(" ");\n        }\n        System.out.println(sb.toString());\n    }\n}\n',
    },
  },
  {
    id: "merge-intervals",
    title: "Merge Intervals",
    difficulty: "medium",
    topic: "array",
    description:
      'Given a list of intervals as "start,end" pairs (space-separated, not necessarily sorted), merge all overlapping intervals and print the result sorted by start, in the same "start,end" format, space-separated.\n\nInput:\nLine 1: intervals, e.g. "1,3 2,6 8,10 15,18"\n\nOutput:\nThe merged intervals, space-separated',
    testCases: [
      {
        input: "1,3 2,6 8,10 15,18",
        expectedOutput: "1,6 8,10 15,18",
      },
      { input: "1,4 4,5", expectedOutput: "1,5" },
      { input: "1,4 0,4", expectedOutput: "0,4" },
      { input: "1,4 0,0", expectedOutput: "0,0 1,4" },
    ],
    starterCode: {
      javascript:
        "const line = require('fs').readFileSync(0, 'utf8').trim();\nconst intervals = line.split(' ').map(pair => pair.split(',').map(Number));\n\nfunction merge(intervals) {\n  // write your solution here — sort by start, then merge overlaps\n\n}\n\nconsole.log(merge(intervals).map(x => x.join(',')).join(' '));\n",
      python:
        "import sys\nline = sys.stdin.readline().strip()\nintervals = [list(map(int, pair.split(','))) for pair in line.split()]\n\ndef merge(intervals):\n    # write your solution here — sort by start, then merge overlaps\n    pass\n\nprint(' '.join(f'{a},{b}' for a, b in merge(intervals)))\n",
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nvector<pair<int,int>> mergeIntervals(vector<pair<int,int>>& intervals) {\n    // write your solution here — sort by start, then merge overlaps\n\n    return {};\n}\n\nint main() {\n    string line;\n    getline(cin, line);\n    stringstream ss(line);\n    string token;\n    vector<pair<int,int>> intervals;\n    while (ss >> token) {\n        size_t comma = token.find(\',\');\n        int a = stoi(token.substr(0, comma));\n        int b = stoi(token.substr(comma + 1));\n        intervals.push_back({a, b});\n    }\n\n    vector<pair<int,int>> res = mergeIntervals(intervals);\n    for (size_t i = 0; i < res.size(); i++) {\n        cout << res[i].first << "," << res[i].second;\n        if (i + 1 < res.size()) cout << " ";\n    }\n    cout << endl;\n    return 0;\n}\n',
      java: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    static int[][] mergeIntervals(int[][] intervals) {\n        // write your solution here — sort by start, then merge overlaps\n\n        return new int[0][0];\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String[] tokens = br.readLine().trim().split("\\\\s+");\n        int[][] intervals = new int[tokens.length][2];\n        for (int i = 0; i < tokens.length; i++) {\n            String[] parts = tokens[i].split(",");\n            intervals[i][0] = Integer.parseInt(parts[0]);\n            intervals[i][1] = Integer.parseInt(parts[1]);\n        }\n\n        int[][] res = mergeIntervals(intervals);\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < res.length; i++) {\n            sb.append(res[i][0]).append(",").append(res[i][1]);\n            if (i + 1 < res.length) sb.append(" ");\n        }\n        System.out.println(sb.toString());\n    }\n}\n',
    },
  },
  {
    id: "kth-largest-element",
    title: "Kth Largest Element in an Array",
    difficulty: "medium",
    topic: "sorting / heap",
    description:
      "Given an unsorted array and an integer k, print the kth largest element (not the kth distinct element).\n\nInput:\nLine 1: the array, space-separated integers\nLine 2: k (an integer)\n\nOutput:\nThe kth largest element (a single integer)",
    testCases: [
      { input: "3 2 1 5 6 4\n2", expectedOutput: "5" },
      { input: "3 2 3 1 2 4 5 5 6\n4", expectedOutput: "4" },
      { input: "1\n1", expectedOutput: "1" },
      { input: "7 6 5 4 3 2 1\n1", expectedOutput: "7" },
    ],
    starterCode: {
      javascript:
        "const lines = require('fs').readFileSync(0, 'utf8').split('\\n');\nconst nums = lines[0].trim().split(/\\s+/).map(Number);\nconst k = parseInt(lines[1]);\n\nfunction findKthLargest(nums, k) {\n  // write your solution here — sorting works, a heap is more efficient\n\n}\n\nconsole.log(findKthLargest(nums, k));\n",
      python:
        "import sys\ndata = sys.stdin.read().split('\\n')\nnums = list(map(int, data[0].split()))\nk = int(data[1])\n\ndef find_kth_largest(nums, k):\n    # write your solution here — sorting works, a heap is more efficient\n    pass\n\nprint(find_kth_largest(nums, k))\n",
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\nint findKthLargest(vector<int>& nums, int k) {\n    // write your solution here — sorting works, a heap is more efficient\n\n    return 0;\n}\n\nint main() {\n    string line1, line2;\n    getline(cin, line1);\n    getline(cin, line2);\n    stringstream ss(line1);\n    vector<int> nums;\n    int x;\n    while (ss >> x) nums.push_back(x);\n    int k = stoi(line2);\n\n    cout << findKthLargest(nums, k) << endl;\n    return 0;\n}\n",
      java: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    static int findKthLargest(int[] nums, int k) {\n        // write your solution here — sorting works, a heap is more efficient\n\n        return 0;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int[] nums = Arrays.stream(br.readLine().trim().split("\\\\s+")).mapToInt(Integer::parseInt).toArray();\n        int k = Integer.parseInt(br.readLine().trim());\n\n        System.out.println(findKthLargest(nums, k));\n    }\n}\n',
    },
  },
  {
    id: "coin-change",
    title: "Coin Change",
    difficulty: "medium",
    topic: "dynamic programming",
    description:
      "Given coin denominations and a target amount, print the fewest number of coins needed to make that amount. If it's not possible, print -1.\n\nInput:\nLine 1: coin denominations, space-separated integers\nLine 2: the target amount\n\nOutput:\nThe minimum number of coins, or -1",
    testCases: [
      { input: "1 2 5\n11", expectedOutput: "3" },
      { input: "2\n3", expectedOutput: "-1" },
      { input: "1\n0", expectedOutput: "0" },
      { input: "1 3 4\n6", expectedOutput: "2" },
    ],
    starterCode: {
      javascript:
        "const lines = require('fs').readFileSync(0, 'utf8').split('\\n');\nconst coins = lines[0].trim().split(/\\s+/).map(Number);\nconst amount = parseInt(lines[1]);\n\nfunction coinChange(coins, amount) {\n  // write your solution here — DP over amounts 0..amount\n\n}\n\nconsole.log(coinChange(coins, amount));\n",
      python:
        "import sys\ndata = sys.stdin.read().split('\\n')\ncoins = list(map(int, data[0].split()))\namount = int(data[1])\n\ndef coin_change(coins, amount):\n    # write your solution here — DP over amounts 0..amount\n    pass\n\nprint(coin_change(coins, amount))\n",
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\nint coinChange(vector<int>& coins, int amount) {\n    // write your solution here — DP over amounts 0..amount\n\n    return -1;\n}\n\nint main() {\n    string line1, line2;\n    getline(cin, line1);\n    getline(cin, line2);\n    stringstream ss(line1);\n    vector<int> coins;\n    int x;\n    while (ss >> x) coins.push_back(x);\n    int amount = stoi(line2);\n\n    cout << coinChange(coins, amount) << endl;\n    return 0;\n}\n",
      java: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    static int coinChange(int[] coins, int amount) {\n        // write your solution here — DP over amounts 0..amount\n\n        return -1;\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int[] coins = Arrays.stream(br.readLine().trim().split("\\\\s+")).mapToInt(Integer::parseInt).toArray();\n        int amount = Integer.parseInt(br.readLine().trim());\n\n        System.out.println(coinChange(coins, amount));\n    }\n}\n',
    },
  },
];

export default DSA_QUESTION_BANK;
