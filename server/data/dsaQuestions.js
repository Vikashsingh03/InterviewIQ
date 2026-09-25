const DSA_QUESTION_BANK = [
  {
    id: "max-min-array",
    "hints": ["Scan the array once, keeping track of the smallest and largest values you have seen so far.","Initialize both trackers with the first element, then compare every remaining element against them."],
    returns: "intArr",
    title: "Maximum and Minimum Element in an Array",
    difficulty: "easy",
    topic: "arrays",
    companies: ["Amazon", "Microsoft", "Google", "Adobe", "Cisco"],
    description:
      "Given an array arr of n integers, find the minimum and the maximum element. Return them as an array [min, max], min first.",
    examples: [
      {
        input: "5\n3 1 4 1 5",
        output: "1 5",
        explanation: "Minimum is 1 and maximum is 5.",
      },
      {
        input: "4\n-5 -2 -9 -1",
        output: "-9 -1",
        explanation: "Minimum is -9 and maximum is -1.",
      },
    ],
    constraints: ["1 <= n <= 10^5", "-10^9 <= arr[i] <= 10^9"],
    io: "array",
    testCases: [
      { input: "5\n3 1 4 1 5", expectedOutput: "1 5" },
      { input: "1\n42", expectedOutput: "42 42" },
      { input: "4\n-5 -2 -9 -1", expectedOutput: "-9 -1" },
      { input: "6\n7 7 7 7 7 7", expectedOutput: "7 7" },
      { input: "3\n100 -100 0", expectedOutput: "-100 100" },
      { input: "8\n5 4 3 2 1 0 -1 -2", expectedOutput: "-2 5" },
      { input: "2\n-3 9", expectedOutput: "-3 9" },
      { input: "7\n1 2 3 4 5 6 7", expectedOutput: "1 7" },
      { input: "5\n-1 -1 5 5 0", expectedOutput: "-1 5" },
      { input: "4\n2147483647 -2147483648 0 1", expectedOutput: "-2147483648 2147483647" },
      { input: "9\n9 8 7 6 5 4 3 2 1", expectedOutput: "1 9" },
      { input: "3\n0 0 1", expectedOutput: "0 1" },
    ],
  },
  {
    id: "reverse-array",
    "hints": ["Think about swapping elements from the outside in — the first element trades places with the last.","Use two pointers, one at each end, moving toward the center; you only need to iterate halfway."],
    returns: "intArr",
    title: "Reverse the Array",
    difficulty: "easy",
    topic: "arrays",
    companies: ["Microsoft", "Amazon", "Adobe"],
    description:
      "Given an array arr of n integers, return a new array with the elements in reverse order.",
    examples: [
      {
        input: "5\n1 2 3 4 5",
        output: "5 4 3 2 1",
        explanation: "Reading the array backwards gives 5 4 3 2 1.",
      },
      {
        input: "1\n9",
        output: "9",
        explanation: "A single element stays the same.",
      },
    ],
    constraints: ["1 <= n <= 10^5", "-10^9 <= arr[i] <= 10^9"],
    io: "array",
    testCases: [
      { input: "5\n1 2 3 4 5", expectedOutput: "5 4 3 2 1" },
      { input: "1\n9", expectedOutput: "9" },
      { input: "4\n1 1 2 2", expectedOutput: "2 2 1 1" },
      { input: "6\n-1 0 5 -3 2 8", expectedOutput: "8 2 -3 5 0 -1" },
      { input: "2\n10 20", expectedOutput: "20 10" },
      { input: "7\n3 5 7 9 11 13 15", expectedOutput: "15 13 11 9 7 5 3" },
      { input: "3\n0 0 0", expectedOutput: "0 0 0" },
      { input: "5\n100 200 300 400 500", expectedOutput: "500 400 300 200 100" },
      { input: "8\n1 3 5 7 9 2 4 6", expectedOutput: "6 4 2 9 7 5 3 1" },
      { input: "4\n-5 -4 -3 -2", expectedOutput: "-2 -3 -4 -5" },
      { input: "10\n1 2 3 4 5 6 7 8 9 10", expectedOutput: "10 9 8 7 6 5 4 3 2 1" },
      { input: "5\n5 4 3 2 1", expectedOutput: "1 2 3 4 5" },
    ],
  },
  {
    id: "maximum-subarray",
    "hints": ["At each position, decide whether it is better to extend the previous subarray or start fresh from the current element.","Track the best sum ending at each index (resetting when the running sum turns negative) alongside the best sum seen overall."],
    returns: "int",
    title: "Maximum Subarray (Kadane's Algorithm)",
    difficulty: "medium",
    topic: "arrays",
    companies: ["Amazon", "Microsoft", "Google", "LinkedIn"],
    description:
      "Given an integer array arr, find the contiguous subarray with the largest sum and return that sum. Use Kadane's algorithm for an O(n) solution.",
    examples: [
      {
        input: "9\n-2 1 -3 4 -1 2 1 -5 4",
        output: "6",
        explanation: "Subarray [4, -1, 2, 1] has the largest sum 6.",
      },
      {
        input: "5\n5 4 -1 7 8",
        output: "23",
        explanation: "The whole array gives the largest sum 23.",
      },
    ],
    constraints: ["1 <= n <= 10^5", "-10^4 <= arr[i] <= 10^4"],
    io: "array",
    testCases: [
      { input: "9\n-2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6" },
      { input: "1\n5", expectedOutput: "5" },
      { input: "1\n-3", expectedOutput: "-3" },
      { input: "5\n5 4 -1 7 8", expectedOutput: "23" },
      { input: "4\n-1 -2 -3 -4", expectedOutput: "-1" },
      { input: "6\n1 2 3 4 5 6", expectedOutput: "21" },
      { input: "3\n-2 -1 -3", expectedOutput: "-1" },
      { input: "7\n-2 3 -1 5 -6 1 4", expectedOutput: "7" },
      { input: "5\n0 0 0 0 0", expectedOutput: "0" },
      { input: "8\n2 -1 2 -1 2 -1 2 -1", expectedOutput: "5" },
      { input: "4\n-5 4 -3 4", expectedOutput: "5" },
      { input: "10\n1 -2 3 -4 5 -6 7 -8 9 -10", expectedOutput: "9" },
    ],
  },
  {
    id: "contains-duplicate",
    "hints": ["The key question is whether you have seen the current element before — you need a fast way to remember past values.","A hash set gives constant-time lookup and insertion per element; alternatively, sorting brings any duplicates next to each other."],
    returns: "bool",
    title: "Contains Duplicate",
    difficulty: "easy",
    topic: "arrays",
    companies: ["Amazon", "Google", "Apple", "Microsoft"],
    description:
      "Given an integer array arr, return true if any value appears at least twice, otherwise return false.",
    examples: [
      {
        input: "4\n1 2 3 1",
        output: "true",
        explanation: "1 appears twice.",
      },
      {
        input: "4\n1 2 3 4",
        output: "false",
        explanation: "All elements are distinct.",
      },
    ],
    constraints: ["1 <= n <= 10^5", "-10^9 <= arr[i] <= 10^9"],
    io: "array",
    testCases: [
      { input: "4\n1 2 3 1", expectedOutput: "true" },
      { input: "4\n1 2 3 4", expectedOutput: "false" },
      { input: "3\n1 1 1", expectedOutput: "true" },
      { input: "1\n5", expectedOutput: "false" },
      { input: "6\n1 2 3 4 5 6", expectedOutput: "false" },
      { input: "5\n-1 0 -1 2 3", expectedOutput: "true" },
      { input: "2\n0 0", expectedOutput: "true" },
      { input: "7\n10 20 30 40 50 60 70", expectedOutput: "false" },
      { input: "5\n3 3 3 3 4", expectedOutput: "true" },
      { input: "4\n-5 -4 -3 -2", expectedOutput: "false" },
      { input: "8\n1 2 3 4 5 1 2 3", expectedOutput: "true" },
      { input: "3\n100 200 100", expectedOutput: "true" },
    ],
  },
  {
    id: "chocolate-distribution",
    "hints": ["If the packets were sorted, the m packets with the smallest spread would have to sit next to each other — consider why.","Sort the array, then slide a window of size m across it and take the minimum difference between each window's ends."],
    returns: "int",
    title: "Chocolate Distribution Problem",
    difficulty: "medium",
    topic: "arrays",
    companies: ["Amazon", "Microsoft", "Flipkart", "Accolite"],
    description:
      "Given an array arr of n packets with different chocolate counts and an integer m (number of students), each student must get exactly one packet. Return the minimum possible difference between the maximum and minimum chocolates among the m chosen packets.",
    examples: [
      {
        input: "8\n3 4 1 9 56 7 9 12\n5",
        output: "6",
        explanation: "Choose packets 3 4 7 9 9, difference is 9 - 3 = 6.",
      },
      {
        input: "7\n7 3 2 4 9 12 56\n3",
        output: "2",
        explanation: "Choose packets 2 3 4, difference is 4 - 2 = 2.",
      },
    ],
    constraints: ["1 <= m <= n <= 10^5", "1 <= arr[i] <= 10^9"],
    io: "array-m",
    testCases: [
      { input: "8\n3 4 1 9 56 7 9 12\n5", expectedOutput: "6" },
      { input: "7\n7 3 2 4 9 12 56\n3", expectedOutput: "2" },
      { input: "5\n1 2 3 4 5\n5", expectedOutput: "4" },
      { input: "5\n1 2 3 4 5\n1", expectedOutput: "0" },
      { input: "4\n10 10 10 10\n2", expectedOutput: "0" },
      { input: "6\n12 4 7 9 2 23\n3", expectedOutput: "5" },
      { input: "3\n5 5 6\n2", expectedOutput: "0" },
      { input: "9\n1 100 101 102 103 104 105 106 2\n4", expectedOutput: "3" },
      { input: "5\n8 4 2 1 9\n3", expectedOutput: "3" },
      { input: "6\n30 10 20 40 50 60\n4", expectedOutput: "30" },
      { input: "4\n1 3 5 7\n4", expectedOutput: "6" },
      { input: "10\n5 15 25 35 45 55 65 75 85 95\n2", expectedOutput: "10" },
    ],
  },
  {
    id: "search-rotated-sorted-array",
    "hints": ["Even though the array is rotated, at least one half of any midpoint split is always fully sorted — identify which half first.","Apply binary search: check whether the target falls inside the sorted half's range to decide which side to discard."],
    returns: "int",
    title: "Search in Rotated Sorted Array",
    difficulty: "medium",
    topic: "arrays",
    companies: ["Amazon", "Microsoft", "Adobe", "Facebook"],
    description:
      "Given a rotated sorted array arr of distinct integers and a target value, return the 0-based index of the target, or -1 if it is not present. Solve in O(log n) time.",
    examples: [
      {
        input: "7\n4 5 6 7 0 1 2\n0",
        output: "4",
        explanation: "0 is at index 4.",
      },
      {
        input: "7\n4 5 6 7 0 1 2\n3",
        output: "-1",
        explanation: "3 is not in the array.",
      },
    ],
    constraints: ["1 <= n <= 10^5", "all elements distinct", "-10^4 <= arr[i], target <= 10^4"],
    io: "array-target",
    testCases: [
      { input: "7\n4 5 6 7 0 1 2\n0", expectedOutput: "4" },
      { input: "7\n4 5 6 7 0 1 2\n3", expectedOutput: "-1" },
      { input: "1\n1\n1", expectedOutput: "0" },
      { input: "1\n1\n2", expectedOutput: "-1" },
      { input: "5\n1 2 3 4 5\n3", expectedOutput: "2" },
      { input: "6\n3 4 5 1 2 3\n1", expectedOutput: "3" },
      { input: "8\n6 7 8 1 2 3 4 5\n8", expectedOutput: "2" },
      { input: "4\n2 3 4 1\n4", expectedOutput: "2" },
      { input: "4\n2 3 4 1\n1", expectedOutput: "3" },
      { input: "3\n3 1 2\n2", expectedOutput: "2" },
      { input: "9\n5 6 7 8 9 1 2 3 4\n9", expectedOutput: "4" },
      { input: "6\n4 5 6 1 2 3\n6", expectedOutput: "2" },
    ],
  },
  {
    id: "next-permutation",
    "hints": ["Scan from the right to find the first position where the order breaks (a smaller element before a larger one) — that is your pivot.","Swap the pivot with the smallest larger element to its right, then reverse the suffix after the pivot into ascending order."],
    returns: "intArr",
    title: "Next Permutation",
    difficulty: "medium",
    topic: "arrays",
    companies: ["Amazon", "Goldman Sachs", "Adobe", "Uber"],
    description:
      "Given an array arr, rearrange it into its lexicographically next greater permutation. If no greater permutation exists, rearrange it into the lowest possible order (sorted ascending). Return the resulting array.",
    examples: [
      {
        input: "3\n1 2 3",
        output: "1 3 2",
        explanation: "The next permutation after 1 2 3 is 1 3 2.",
      },
      {
        input: "3\n3 2 1",
        output: "1 2 3",
        explanation: "No greater permutation exists, so return sorted order.",
      },
    ],
    constraints: ["1 <= n <= 10^5", "0 <= arr[i] <= 10^5"],
    io: "array",
    testCases: [
      { input: "3\n1 2 3", expectedOutput: "1 3 2" },
      { input: "3\n3 2 1", expectedOutput: "1 2 3" },
      { input: "3\n1 1 5", expectedOutput: "1 5 1" },
      { input: "4\n1 3 2 4", expectedOutput: "1 3 4 2" },
      { input: "1\n5", expectedOutput: "5" },
      { input: "5\n1 2 3 5 4", expectedOutput: "1 2 4 3 5" },
      { input: "4\n2 3 1 4", expectedOutput: "2 3 4 1" },
      { input: "4\n4 3 2 1", expectedOutput: "1 2 3 4" },
      { input: "5\n1 1 1 2 1", expectedOutput: "1 1 2 1 1" },
      { input: "6\n1 2 4 3 5 6", expectedOutput: "1 2 4 3 6 5" },
      { input: "2\n2 1", expectedOutput: "1 2" },
      { input: "5\n5 4 3 2 1", expectedOutput: "1 2 3 4 5" },
    ],
  },
  {
    id: "best-time-to-buy-sell-stock",
    "hints": ["For each day treated as a potential sell day, the best buy day is simply the cheapest price seen before it.","Track the minimum price so far in a single pass, computing the profit against each day's price and keeping the maximum."],
    returns: "int",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "easy",
    topic: "arrays",
    companies: ["Amazon", "Facebook", "Microsoft", "Goldman Sachs"],
    description:
      "Given an array arr where arr[i] is the price of a stock on day i, find the maximum profit from one buy and one sell (buy must come before sell). Return the maximum profit, or 0 if no profit is possible.",
    examples: [
      {
        input: "6\n7 1 5 3 6 4",
        output: "5",
        explanation: "Buy at 1, sell at 6, profit 5.",
      },
      {
        input: "5\n7 6 4 3 1",
        output: "0",
        explanation: "Prices only fall, no profit possible.",
      },
    ],
    constraints: ["1 <= n <= 10^5", "0 <= prices[i] <= 10^4"],
    io: "array",
    testCases: [
      { input: "6\n7 1 5 3 6 4", expectedOutput: "5" },
      { input: "5\n7 6 4 3 1", expectedOutput: "0" },
      { input: "1\n5", expectedOutput: "0" },
      { input: "4\n1 2 3 4", expectedOutput: "3" },
      { input: "5\n2 4 1 7 3", expectedOutput: "6" },
      { input: "3\n3 3 3", expectedOutput: "0" },
      { input: "7\n5 1 2 8 3 9 2", expectedOutput: "8" },
      { input: "2\n1 100", expectedOutput: "99" },
      { input: "6\n10 7 5 8 11 9", expectedOutput: "6" },
      { input: "4\n4 3 2 1", expectedOutput: "0" },
      { input: "8\n3 8 1 4 7 2 9 5", expectedOutput: "8" },
      { input: "5\n1 5 2 8 3", expectedOutput: "7" },
    ],
  },
  {
    id: "repeat-missing-number",
    "hints": ["Compare what the sum of 1 to n should be against the actual sum — the gap between expectation and reality reveals both numbers.","Set up two equations using the sum and sum-of-squares (or use XOR partitioning) to solve for the repeating and missing values."],
    returns: "intArr",
    title: "Repeat and Missing Number Array",
    difficulty: "medium",
    topic: "arrays",
    companies: ["Amazon", "Microsoft"],
    description:
      "Given an array arr of n integers containing numbers from 1 to n, where one number repeats and one number is missing, return an array [repeating, missing].",
    examples: [
      {
        input: "5\n3 1 2 5 3",
        output: "3 4",
        explanation: "3 repeats and 4 is missing.",
      },
      {
        input: "4\n1 2 2 4",
        output: "2 3",
        explanation: "2 repeats and 3 is missing.",
      },
    ],
    constraints: ["2 <= n <= 10^5", "1 <= arr[i] <= n"],
    io: "array",
    testCases: [
      { input: "5\n3 1 2 5 3", expectedOutput: "3 4" },
      { input: "4\n1 2 2 4", expectedOutput: "2 3" },
      { input: "3\n1 1 3", expectedOutput: "1 2" },
      { input: "6\n4 3 6 2 1 1", expectedOutput: "1 5" },
      { input: "2\n2 2", expectedOutput: "2 1" },
      { input: "7\n1 2 3 4 5 6 6", expectedOutput: "6 7" },
      { input: "5\n5 4 3 2 2", expectedOutput: "2 1" },
      { input: "8\n1 2 3 4 5 6 8 8", expectedOutput: "8 7" },
      { input: "4\n3 3 1 4", expectedOutput: "3 2" },
      { input: "6\n1 1 2 3 4 5", expectedOutput: "1 6" },
      { input: "9\n9 8 7 6 5 4 3 2 2", expectedOutput: "2 1" },
      { input: "5\n2 3 4 5 5", expectedOutput: "5 1" },
    ],
  },
  {
    id: "kth-largest-element",
    "hints": ["You do not need the entire array sorted — you only need the top k elements kept in some order.","A min-heap of size k keeps the kth largest at its top; quickselect also solves this in average linear time."],
    returns: "int",
    title: "Kth Largest Element in an Array",
    difficulty: "medium",
    topic: "arrays",
    companies: ["Amazon", "Microsoft", "Walmart", "Adobe", "Facebook"],
    description:
      "Given an array arr and an integer k, return the kth largest element (1-indexed, duplicates count separately).",
    examples: [
      {
        input: "6\n3 2 1 5 6 4\n2",
        output: "5",
        explanation: "Sorted descending: 6 5 4 3 2 1, the 2nd largest is 5.",
      },
      {
        input: "9\n3 2 3 1 2 4 5 5 6\n4",
        output: "4",
        explanation: "Sorted descending: 6 5 5 4 3 3 2 2 1, the 4th largest is 4.",
      },
    ],
    constraints: ["1 <= k <= n <= 10^5", "-10^4 <= arr[i] <= 10^4"],
    io: "array-k",
    testCases: [
      { input: "6\n3 2 1 5 6 4\n2", expectedOutput: "5" },
      { input: "9\n3 2 3 1 2 4 5 5 6\n4", expectedOutput: "4" },
      { input: "1\n1\n1", expectedOutput: "1" },
      { input: "5\n7 7 7 7 7\n3", expectedOutput: "7" },
      { input: "7\n-1 -2 -3 -4 -5 -6 -7\n2", expectedOutput: "-2" },
      { input: "8\n10 4 5 8 6 11 26 3\n3", expectedOutput: "10" },
      { input: "3\n1 2 3\n3", expectedOutput: "1" },
      { input: "5\n5 4 3 2 1\n1", expectedOutput: "5" },
      { input: "6\n2 2 2 1 1 3\n2", expectedOutput: "2" },
      { input: "10\n9 8 7 6 5 4 3 2 1 0\n10", expectedOutput: "0" },
      { input: "5\n100 50 200 150 75\n4", expectedOutput: "75" },
      { input: "4\n-10 0 10 20\n4", expectedOutput: "-10" },
    ],
  },
  {
    id: "trapping-rain-water",
    "hints": ["The water above each position is limited by the shorter of the tallest bar to its left and the tallest bar to its right.","Precompute left-max and right-max for every index (or converge two pointers from both ends) and sum min(leftMax, rightMax) minus height."],
    returns: "int",
    title: "Trapping Rain Water",
    difficulty: "hard",
    topic: "arrays",
    companies: ["Amazon", "Microsoft", "Google", "Adobe", "Goldman Sachs"],
    description:
      "Given an array arr of n non-negative integers representing an elevation map, compute how much water it can trap after raining. Return the total units of trapped water.",
    images: ["https://assets.leetcode.com/uploads/2018/10/22/rainwatertrap.png"],
    examples: [
      {
        input: "12\n0 1 0 2 1 0 1 3 2 1 2 1",
        output: "6",
        explanation: "The elevation map traps 6 units of water.",
      },
      {
        input: "6\n4 2 0 3 2 5",
        output: "9",
        explanation: "9 units of water are trapped.",
      },
    ],
    constraints: ["1 <= n <= 10^5", "0 <= height[i] <= 10^4"],
    io: "array",
    testCases: [
      { input: "12\n0 1 0 2 1 0 1 3 2 1 2 1", expectedOutput: "6" },
      { input: "6\n4 2 0 3 2 5", expectedOutput: "9" },
      { input: "1\n5", expectedOutput: "0" },
      { input: "2\n2 3", expectedOutput: "0" },
      { input: "5\n5 4 3 2 1", expectedOutput: "0" },
      { input: "5\n1 2 3 4 5", expectedOutput: "0" },
      { input: "7\n3 0 0 2 0 4 0", expectedOutput: "10" },
      { input: "4\n2 0 2 0", expectedOutput: "2" },
      { input: "9\n5 0 5 0 5 0 5 0 5", expectedOutput: "20" },
      { input: "3\n0 0 0", expectedOutput: "0" },
      { input: "8\n1 0 2 0 3 0 4 0", expectedOutput: "6" },
      { input: "6\n4 2 3 2 4 1", expectedOutput: "5" },
    ],
  },
  {
    id: "product-of-array-except-self",
    "hints": ["The answer at each position equals the product of everything to its left times the product of everything to its right.","Build prefix products in a forward pass and suffix products in a backward pass, combining them without division."],
    returns: "intArr",
    title: "Product of Array Except Self",
    difficulty: "medium",
    topic: "arrays",
    companies: ["Amazon", "Microsoft", "Facebook", "Apple"],
    description:
      "Given an integer array arr, return an array where each element is the product of all other elements. Solve in O(n) without using division.",
    examples: [
      {
        input: "4\n1 2 3 4",
        output: "24 12 8 6",
        explanation: "For 1: 2*3*4=24, for 2: 1*3*4=12, and so on.",
      },
      {
        input: "5\n-1 1 0 -3 3",
        output: "0 0 9 0 0",
        explanation: "The zero makes most products zero; for 0 itself the product is 9.",
      },
    ],
    constraints: ["2 <= n <= 10^5", "-30 <= arr[i] <= 30"],
    io: "array",
    testCases: [
      { input: "4\n1 2 3 4", expectedOutput: "24 12 8 6" },
      { input: "5\n-1 1 0 -3 3", expectedOutput: "0 0 9 0 0" },
      { input: "2\n2 3", expectedOutput: "3 2" },
      { input: "3\n0 0 0", expectedOutput: "0 0 0" },
      { input: "4\n5 5 5 5", expectedOutput: "125 125 125 125" },
      { input: "3\n1 -1 1", expectedOutput: "-1 1 -1" },
      { input: "6\n2 2 2 2 2 2", expectedOutput: "32 32 32 32 32 32" },
      { input: "4\n10 20 30 40", expectedOutput: "24000 12000 8000 6000" },
      { input: "3\n-2 -3 -4", expectedOutput: "12 8 6" },
      { input: "5\n1 2 3 4 5", expectedOutput: "120 60 40 30 24" },
      { input: "2\n0 5", expectedOutput: "5 0" },
      { input: "4\n-1 -1 -1 -1", expectedOutput: "-1 -1 -1 -1" },
    ],
  },
  {
    id: "maximum-product-subarray",
    "hints": ["Unlike sums, a negative product can become the maximum after one more multiplication — so you must track both extremes.","Maintain the maximum and minimum products ending at each position (swapping them when the current number is negative) and record the overall best."],
    returns: "int",
    title: "Maximum Product Subarray",
    difficulty: "medium",
    topic: "arrays",
    companies: ["Amazon", "Microsoft", "LinkedIn"],
    description:
      "Given an integer array arr, find the contiguous subarray with the largest product and return that product.",
    examples: [
      {
        input: "4\n2 3 -2 4",
        output: "6",
        explanation: "Subarray [2, 3] has the largest product 6.",
      },
      {
        input: "3\n-2 0 -1",
        output: "0",
        explanation: "The single element [0] gives product 0.",
      },
    ],
    constraints: ["1 <= n <= 10^5", "-10 <= arr[i] <= 10"],
    io: "array",
    testCases: [
      { input: "4\n2 3 -2 4", expectedOutput: "6" },
      { input: "3\n-2 0 -1", expectedOutput: "0" },
      { input: "1\n-5", expectedOutput: "-5" },
      { input: "4\n-2 3 -4 5", expectedOutput: "120" },
      { input: "5\n2 -5 -2 -4 3", expectedOutput: "24" },
      { input: "3\n0 0 0", expectedOutput: "0" },
      { input: "2\n-1 -2", expectedOutput: "2" },
      { input: "6\n1 2 3 4 5 6", expectedOutput: "720" },
      { input: "5\n-1 -2 -3 0 5", expectedOutput: "6" },
      { input: "4\n3 -1 4 -1", expectedOutput: "12" },
      { input: "3\n-4 -3 -2", expectedOutput: "12" },
      { input: "7\n2 3 -2 -5 4 -1 2", expectedOutput: "240" },
    ],
  },
  {
    id: "find-min-rotated-sorted",
    "hints": ["The minimum is the rotation pivot — the one element smaller than its left neighbor — and binary search can locate it.","Compare the middle element with the rightmost: if mid is greater, the minimum lies to the right; otherwise it is at mid or to the left."],
    returns: "int",
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "medium",
    topic: "arrays",
    companies: ["Amazon", "Adobe", "Microsoft"],
    description:
      "Given a rotated sorted array arr of distinct integers, return the minimum element. Solve in O(log n) time.",
    examples: [
      {
        input: "7\n4 5 6 7 0 1 2",
        output: "0",
        explanation: "The minimum element is 0.",
      },
      {
        input: "5\n1 2 3 4 5",
        output: "1",
        explanation: "Not rotated; minimum is the first element.",
      },
    ],
    constraints: ["1 <= n <= 10^5", "all elements distinct"],
    io: "array",
    testCases: [
      { input: "7\n4 5 6 7 0 1 2", expectedOutput: "0" },
      { input: "5\n1 2 3 4 5", expectedOutput: "1" },
      { input: "1\n10", expectedOutput: "10" },
      { input: "2\n2 1", expectedOutput: "1" },
      { input: "6\n3 4 5 1 2 3", expectedOutput: "1" },
      { input: "4\n5 1 2 3", expectedOutput: "1" },
      { input: "8\n7 8 1 2 3 4 5 6", expectedOutput: "1" },
      { input: "3\n2 3 1", expectedOutput: "1" },
      { input: "9\n6 7 8 9 1 2 3 4 5", expectedOutput: "1" },
      { input: "5\n-3 -2 -1 0 1", expectedOutput: "-3" },
      { input: "6\n2 3 4 5 6 1", expectedOutput: "1" },
      { input: "4\n10 20 30 5", expectedOutput: "5" },
    ],
  },
  {
    id: "pair-sum-sorted-rotated",
    "hints": ["First locate the rotation pivot (the smallest element); reading circularly from there, the array behaves as sorted.","Place one pointer at the smallest and one at the largest element, moving them circularly toward each other like the classic two-pointer sum technique."],
    returns: "bool",
    title: "Find Pair with Sum in Sorted and Rotated Array",
    difficulty: "medium",
    topic: "arrays",
    companies: ["Amazon", "D-E-Shaw", "Microsoft"],
    description:
      "Given a sorted and rotated array arr of distinct integers and a target sum, return true if any pair adds up to the target, otherwise return false. Solve in O(n) time with O(1) space using the two-pointer technique on the rotated array.",
    examples: [
      {
        input: "6\n11 15 6 8 9 10\n16",
        output: "true",
        explanation: "6 + 10 = 16.",
      },
      {
        input: "6\n11 15 6 8 9 10\n100",
        output: "false",
        explanation: "No pair sums to 100.",
      },
    ],
    constraints: ["2 <= n <= 10^5", "all elements distinct"],
    io: "array-target",
    testCases: [
      { input: "6\n11 15 6 8 9 10\n16", expectedOutput: "true" },
      { input: "6\n11 15 6 8 9 10\n20", expectedOutput: "true" },
      { input: "6\n11 15 6 8 9 10\n100", expectedOutput: "false" },
      { input: "4\n3 4 5 1\n9", expectedOutput: "true" },
      { input: "4\n3 4 5 1\n3", expectedOutput: "false" },
      { input: "5\n1 2 3 4 5\n9", expectedOutput: "true" },
      { input: "2\n2 1\n3", expectedOutput: "true" },
      { input: "7\n4 5 6 7 0 1 2\n9", expectedOutput: "true" },
      { input: "7\n4 5 6 7 0 1 2\n14", expectedOutput: "false" },
      { input: "5\n5 1 2 3 4\n6", expectedOutput: "true" },
      { input: "3\n3 1 2\n5", expectedOutput: "true" },
      { input: "6\n8 9 10 1 2 3\n19", expectedOutput: "true" },
    ],
  },
  {
    id: "three-sum",
    "hints": ["Fix one element first — the problem then reduces to finding pairs with a target sum in the rest of the array.","Sort the array, fix each index as the first element, then two-pointer the remainder while skipping duplicate values at every step."],
    returns: "intMat",
    title: "3Sum",
    difficulty: "medium",
    topic: "arrays",
    companies: ["Amazon", "Microsoft", "Adobe", "Facebook"],
    description:
      "Given an array arr and a target sum, return all unique triplets that add up to the target. Return them as a 2D array where each triplet is sorted in ascending order and the triplets are in lexicographic order. If no triplet exists, return [[-1]].",
    examples: [
      {
        input: "6\n-1 0 1 2 -1 -4\n0",
        output: "-1 -1 2\n-1 0 1",
        explanation: "Two unique triplets sum to 0.",
      },
      {
        input: "4\n1 2 3 4\n10",
        output: "-1",
        explanation: "No triplet sums to 10.",
      },
    ],
    constraints: ["3 <= n <= 3000", "-10^5 <= arr[i] <= 10^5"],
    io: "array-target",
    testCases: [
      { input: "6\n-1 0 1 2 -1 -4\n0", expectedOutput: "-1 -1 2\n-1 0 1" },
      { input: "4\n1 2 3 4\n10", expectedOutput: "-1" },
      { input: "5\n0 0 0 0 0\n0", expectedOutput: "0 0 0" },
      { input: "6\n1 1 1 2 2 3\n4", expectedOutput: "1 1 2" },
      { input: "7\n-2 -1 0 1 2 3 4\n3", expectedOutput: "-2 1 4\n-2 2 3\n-1 0 4\n-1 1 3\n0 1 2" },
      { input: "3\n1 2 3\n6", expectedOutput: "1 2 3" },
      { input: "5\n5 5 5 5 5\n15", expectedOutput: "5 5 5" },
      { input: "6\n-5 -4 -3 1 2 3\n-6", expectedOutput: "-5 -4 3\n-5 -3 2\n-4 -3 1" },
      { input: "4\n2 2 2 2\n6", expectedOutput: "2 2 2" },
      { input: "8\n1 2 -2 -1 0 3 -3 4\n0", expectedOutput: "-3 -1 4\n-3 0 3\n-3 1 2\n-2 -1 3\n-2 0 2\n-1 0 1" },
      { input: "5\n10 20 30 40 50\n60", expectedOutput: "10 20 30" },
      { input: "6\n-1 -1 0 1 1 2\n1", expectedOutput: "-1 0 2\n-1 1 1" },
    ],
  },
  {
    id: "container-with-most-water",
    "hints": ["The area is capped by the shorter line, so moving the taller line inward can never improve the result for the current width.","Use two pointers at both ends, always advancing the pointer at the shorter line, and track the maximum area seen."],
    returns: "int",
    title: "Container With Most Water",
    difficulty: "medium",
    topic: "arrays",
    companies: ["Amazon", "Google", "Goldman Sachs", "Facebook"],
    description:
      "Given an array arr of n non-negative integers where each represents a vertical line at that position, find the two lines that together with the x-axis form a container holding the most water. Return the maximum area.",
    images: ["https://assets.leetcode.com/uploads/2018/07/17/question_11.jpg"],
    examples: [
      {
        input: "9\n1 8 6 2 5 4 8 3 7",
        output: "49",
        explanation: "Lines at index 1 (8) and index 8 (7): min(8,7) * 7 = 49.",
      },
      {
        input: "2\n1 1",
        output: "1",
        explanation: "Only one container possible: 1 * 1 = 1.",
      },
    ],
    constraints: ["2 <= n <= 10^5", "0 <= height[i] <= 10^4"],
    io: "array",
    testCases: [
      { input: "9\n1 8 6 2 5 4 8 3 7", expectedOutput: "49" },
      { input: "2\n1 1", expectedOutput: "1" },
      { input: "5\n5 4 3 2 1", expectedOutput: "6" },
      { input: "4\n1 2 1 2", expectedOutput: "4" },
      { input: "3\n3 3 3", expectedOutput: "6" },
      { input: "7\n2 3 4 5 18 17 6", expectedOutput: "17" },
      { input: "1\n5", expectedOutput: "0" },
      { input: "8\n1 2 3 4 5 6 7 8", expectedOutput: "16" },
      { input: "6\n6 5 4 3 2 1", expectedOutput: "9" },
      { input: "5\n0 0 0 0 0", expectedOutput: "0" },
      { input: "10\n4 3 2 1 4 5 2 1 4 3", expectedOutput: "32" },
      { input: "4\n10 1 1 10", expectedOutput: "30" },
    ],
  },
  {
    id: "pair-with-given-sum",
    "hints": ["For each element you know exactly what its complement must be — the only question is whether you have already seen it.","Store each value's index in a hash map as you iterate, checking for (target minus current) before inserting."],
    returns: "intArr",
    title: "Pair with Given Sum (Two Sum)",
    difficulty: "easy",
    topic: "arrays",
    companies: ["Amazon", "Adobe", "Microsoft", "Google"],
    description:
      "Given an array arr and a target sum, return the 0-based indices of any two distinct elements that add up to the target as an array [i, j]. If multiple pairs exist, return the one with the smallest first index (then smallest second index). If none exists, return [-1, -1].",
    examples: [
      {
        input: "4\n2 7 11 15\n9",
        output: "0 1",
        explanation: "2 + 7 = 9.",
      },
      {
        input: "4\n1 2 3 4\n10",
        output: "-1 -1",
        explanation: "No pair sums to 10.",
      },
    ],
    constraints: ["1 <= n <= 10^5", "-10^9 <= arr[i], target <= 10^9"],
    io: "array-target",
    testCases: [
      { input: "4\n2 7 11 15\n9", expectedOutput: "0 1" },
      { input: "3\n3 2 4\n6", expectedOutput: "1 2" },
      { input: "2\n3 3\n6", expectedOutput: "0 1" },
      { input: "4\n1 2 3 4\n10", expectedOutput: "-1 -1" },
      { input: "5\n5 4 3 2 1\n9", expectedOutput: "0 1" },
      { input: "2\n0 0\n0", expectedOutput: "0 1" },
      { input: "6\n-1 -2 -3 -4 -5 -6\n-8", expectedOutput: "1 5" },
      { input: "5\n1 5 3 7 9\n12", expectedOutput: "1 3" },
      { input: "4\n4 4 4 4\n8", expectedOutput: "0 1" },
      { input: "3\n-5 0 5\n0", expectedOutput: "0 2" },
      { input: "6\n10 20 30 40 50 60\n70", expectedOutput: "0 5" },
      { input: "1\n5\n10", expectedOutput: "-1 -1" },
    ],
  },
  {
    id: "kth-smallest-element",
    "hints": ["This mirrors kth largest — you only need the smallest k elements organized, not a fully sorted array.","A max-heap of size k keeps the kth smallest at its top; quickselect also solves it in average linear time."],
    returns: "int",
    title: "Kth Smallest Element",
    difficulty: "medium",
    topic: "arrays",
    companies: ["Amazon", "Microsoft", "Samsung", "Snapdeal"],
    description:
      "Given an array arr and an integer k, return the kth smallest element (1-indexed, duplicates count separately).",
    examples: [
      {
        input: "6\n7 10 4 3 20 15\n3",
        output: "7",
        explanation: "Sorted: 3 4 7 10 15 20, the 3rd smallest is 7.",
      },
      {
        input: "5\n7 10 4 3 20\n4",
        output: "10",
        explanation: "Sorted: 3 4 7 10 20, the 4th smallest is 10.",
      },
    ],
    constraints: ["1 <= k <= n <= 10^5", "-10^4 <= arr[i] <= 10^4"],
    io: "array-k",
    testCases: [
      { input: "6\n7 10 4 3 20 15\n3", expectedOutput: "7" },
      { input: "5\n7 10 4 3 20\n4", expectedOutput: "10" },
      { input: "1\n5\n1", expectedOutput: "5" },
      { input: "5\n1 1 1 1 1\n2", expectedOutput: "1" },
      { input: "8\n12 3 5 7 19 2 8 1\n5", expectedOutput: "7" },
      { input: "4\n9 8 7 6\n4", expectedOutput: "9" },
      { input: "5\n-5 -1 -3 -2 -4\n3", expectedOutput: "-3" },
      { input: "10\n100 90 80 70 60 50 40 30 20 10\n7", expectedOutput: "70" },
      { input: "3\n3 1 2\n2", expectedOutput: "2" },
      { input: "6\n5 2 8 1 9 3\n6", expectedOutput: "9" },
      { input: "5\n4 4 4 4 5\n4", expectedOutput: "4" },
      { input: "7\n2 7 1 8 2 8 1\n3", expectedOutput: "2" },
    ],
  },
  {
    id: "merge-intervals",
    "hints": ["Overlaps are far easier to detect when intervals are ordered — sort by start time first.","Sweep through the sorted intervals, extending the current merged interval while the next overlaps and starting a new one when it does not."],
    returns: "intMat",
    title: "Merge Overlapping Intervals",
    difficulty: "medium",
    topic: "arrays",
    companies: ["Amazon", "Google", "Microsoft", "Facebook"],
    description:
      "Given a 2D array intervals of [start, end] pairs, merge all overlapping intervals and return the merged intervals as a 2D array sorted by start time.",
    examples: [
      {
        input: "4\n1 3\n2 6\n8 10\n15 18",
        output: "1 6\n8 10\n15 18",
        explanation: "[1,3] and [2,6] merge into [1,6].",
      },
      {
        input: "2\n1 4\n4 5",
        output: "1 5",
        explanation: "Touching intervals merge into [1,5].",
      },
    ],
    constraints: ["1 <= n <= 10^4", "-10^4 <= start <= end <= 10^4"],
    io: "intervals",
    testCases: [
      { input: "4\n1 3\n2 6\n8 10\n15 18", expectedOutput: "1 6\n8 10\n15 18" },
      { input: "2\n1 4\n4 5", expectedOutput: "1 5" },
      { input: "1\n1 4", expectedOutput: "1 4" },
      { input: "3\n1 4\n2 3\n5 7", expectedOutput: "1 4\n5 7" },
      { input: "4\n1 10\n2 3\n4 5\n6 7", expectedOutput: "1 10" },
      { input: "5\n5 6\n1 2\n3 4\n7 8\n2 5", expectedOutput: "1 6\n7 8" },
      { input: "3\n1 2\n3 4\n5 6", expectedOutput: "1 2\n3 4\n5 6" },
      { input: "2\n1 5\n2 3", expectedOutput: "1 5" },
      { input: "4\n-5 -1\n-3 0\n1 2\n-2 1", expectedOutput: "-5 2" },
      { input: "6\n1 3\n5 7\n2 4\n6 8\n9 10\n8 9", expectedOutput: "1 4\n5 10" },
      { input: "3\n10 12\n1 3\n4 6", expectedOutput: "1 3\n4 6\n10 12" },
      { input: "2\n0 0\n0 0", expectedOutput: "0 0" },
    ],
  },
  {
    id: "min-merge-palindrome",
    "hints": ["Compare the two ends: if they match, move inward; if they differ, the smaller end must merge with its neighbor.","Use two pointers from both ends — when the ends differ, merge the smaller side into its neighbor and count one operation."],
    returns: "int",
    title: "Minimum Merges to Make Array Palindrome",
    difficulty: "medium",
    topic: "arrays",
    companies: ["Amazon", "Flipkart", "Microsoft"],
    description:
      "Given an array arr of positive integers, you may merge two adjacent elements (replace them with their sum). Return the minimum number of merge operations needed to make the array a palindrome.",
    examples: [
      {
        input: "4\n11 14 15 99",
        output: "3",
        explanation: "Merge left side repeatedly: 3 operations make [139].",
      },
      {
        input: "4\n1 2 2 1",
        output: "0",
        explanation: "Already a palindrome.",
      },
    ],
    constraints: ["1 <= n <= 10^5", "1 <= arr[i] <= 10^4"],
    io: "array",
    testCases: [
      { input: "4\n11 14 15 99", expectedOutput: "3" },
      { input: "4\n1 2 3 4", expectedOutput: "3" },
      { input: "4\n1 2 2 1", expectedOutput: "0" },
      { input: "5\n1 3 2 1 1", expectedOutput: "1" },
      { input: "1\n5", expectedOutput: "0" },
      { input: "6\n1 4 5 9 8 1", expectedOutput: "3" },
      { input: "3\n2 3 2", expectedOutput: "0" },
      { input: "5\n5 4 3 2 1", expectedOutput: "4" },
      { input: "4\n2 2 2 2", expectedOutput: "0" },
      { input: "6\n3 1 2 3 1 3", expectedOutput: "1" },
      { input: "5\n10 1 1 1 10", expectedOutput: "0" },
      { input: "7\n1 2 3 4 5 6 7", expectedOutput: "6" },
    ],
  },
  {
    id: "largest-number-formed",
    "hints": ["Comparing numbers by numeric value is misleading here — compare them by which concatenation order yields the larger result.","Sort with a custom comparator placing a before b when (a+b) exceeds (b+a) as strings, then join; handle the all-zeros case."],
    returns: "string",
    title: "Arrange Numbers to Form the Biggest Number",
    difficulty: "medium",
    topic: "arrays",
    companies: ["Amazon", "Microsoft", "Goldman Sachs", "Adobe"],
    description:
      "Given an array arr of non-negative integers, arrange them to form the largest possible number and return it as a string. If the result is all zeros, return \"0\".",
    examples: [
      {
        input: "5\n3 30 34 5 9",
        output: "9534330",
        explanation: "Arranged as 9 5 34 3 30.",
      },
      {
        input: "2\n10 2",
        output: "210",
        explanation: "210 is larger than 102.",
      },
    ],
    constraints: ["1 <= n <= 10^5", "0 <= arr[i] <= 10^9"],
    io: "array",
    testCases: [
      { input: "5\n3 30 34 5 9", expectedOutput: "9534330" },
      { input: "2\n10 2", expectedOutput: "210" },
      { input: "3\n0 0 0", expectedOutput: "0" },
      { input: "4\n1 2 3 4", expectedOutput: "4321" },
      { input: "4\n54 546 548 60", expectedOutput: "6054854654" },
      { input: "2\n12 121", expectedOutput: "12121" },
      { input: "4\n7 70 71 72", expectedOutput: "7727170" },
      { input: "1\n5", expectedOutput: "5" },
      { input: "6\n0 1 0 1 0 1", expectedOutput: "111000" },
      { input: "3\n999 99 9", expectedOutput: "999999" },
      { input: "4\n20 200 2000 2", expectedOutput: "2202002000" },
      { input: "4\n100 1000 10000 10", expectedOutput: "10100100010000" },
    ],
  },
  {
    id: "odd-occurring-element",
    "hints": ["XOR has a handy property: any number XORed with itself cancels out to zero.","XOR all elements together — every even-occurring value cancels, leaving only the odd-occurring element."],
    returns: "int",
    title: "Element Occurring Odd Number of Times (Bit Manipulation)",
    difficulty: "easy",
    topic: "arrays",
    companies: ["Amazon", "Microsoft", "Adobe"],
    description:
      "Given an array arr where every element occurs an even number of times except one, find that element using bit manipulation (XOR) in O(n) time and O(1) space. Return the element.",
    examples: [
      {
        input: "7\n1 2 3 2 3 1 3",
        output: "3",
        explanation: "XOR of all elements cancels pairs, leaving 3.",
      },
      {
        input: "5\n5 5 5 5 4",
        output: "4",
        explanation: "Only 4 occurs an odd number of times.",
      },
    ],
    constraints: ["1 <= n <= 10^5", "n is odd", "-10^9 <= arr[i] <= 10^9"],
    io: "array",
    testCases: [
      { input: "7\n1 2 3 2 3 1 3", expectedOutput: "3" },
      { input: "5\n5 5 5 5 4", expectedOutput: "4" },
      { input: "1\n9", expectedOutput: "9" },
      { input: "3\n1 1 2", expectedOutput: "2" },
      { input: "9\n4 4 4 4 4 4 4 4 7", expectedOutput: "7" },
      { input: "5\n-1 -1 -2 -2 -3", expectedOutput: "-3" },
      { input: "11\n10 20 10 30 20 40 30 50 40 50 60", expectedOutput: "60" },
      { input: "3\n0 0 5", expectedOutput: "5" },
      { input: "7\n100 200 300 200 100 300 400", expectedOutput: "400" },
      { input: "5\n7 7 8 8 9", expectedOutput: "9" },
      { input: "9\n1 1 2 2 3 3 4 4 5", expectedOutput: "5" },
      { input: "5\n-5 -5 10 10 -3", expectedOutput: "-3" },
    ],
  },
  {
    id: "subarray-sum-divisible-k",
    "hints": ["If two prefix sums share the same remainder modulo k, the subarray between them is divisible by k.","Track prefix-sum remainders in a frequency map (adjusting negatives into range); each remainder adds its current count to the answer."],
    returns: "int",
    title: "Subarray Sum Divisible by K",
    difficulty: "medium",
    topic: "arrays",
    companies: ["Microsoft", "Amazon", "Snapdeal", "Facebook"],
    description:
      "Given an array arr and an integer k, return the count of non-empty subarrays whose sum is divisible by k.",
    examples: [
      {
        input: "6\n4 5 0 -2 -3 1\n5",
        output: "7",
        explanation: "7 subarrays have sums divisible by 5.",
      },
      {
        input: "5\n5 5 5 5 5\n5",
        output: "15",
        explanation: "Every subarray sum is divisible by 5: 5*6/2 = 15.",
      },
    ],
    constraints: ["1 <= n <= 10^5", "-10^4 <= arr[i] <= 10^4", "2 <= k <= 10^4"],
    io: "array-k",
    testCases: [
      { input: "6\n4 5 0 -2 -3 1\n5", expectedOutput: "7" },
      { input: "5\n5 5 5 5 5\n5", expectedOutput: "15" },
      { input: "3\n1 2 3\n3", expectedOutput: "3" },
      { input: "3\n-1 2 9\n2", expectedOutput: "2" },
      { input: "1\n0\n5", expectedOutput: "1" },
      { input: "5\n1 2 3 4 5\n2", expectedOutput: "6" },
      { input: "4\n7 7 7 7\n7", expectedOutput: "10" },
      { input: "6\n-5 5 -5 5 -5 5\n5", expectedOutput: "21" },
      { input: "3\n0 0 0\n3", expectedOutput: "6" },
      { input: "5\n2 4 6 8 10\n3", expectedOutput: "7" },
      { input: "4\n1 -1 1 -1\n2", expectedOutput: "4" },
      { input: "7\n3 1 4 1 5 9 2\n5", expectedOutput: "7" },
    ],
  },
  {
    id: "combinations-r",
    "hints": ["Build combinations incrementally: at each step you either include the current element or skip it.","Use backtracking with a start index to avoid duplicates, saving a copy whenever the current combination reaches size r."],
    returns: "intMat",
    title: "Return All Combinations of r Elements",
    difficulty: "medium",
    topic: "arrays",
    companies: ["Amazon", "Microsoft"],
    description:
      "Given an array arr of n distinct integers and an integer r, return all combinations of r elements as a 2D array, each combination keeping the order the elements appear in arr, with combinations in lexicographic order of indices.",
    examples: [
      {
        input: "4\n1 2 3 4\n2",
        output: "1 2\n1 3\n1 4\n2 3\n2 4\n3 4",
        explanation: "All 6 ways to choose 2 out of 4.",
      },
      {
        input: "3\n1 2 3\n3",
        output: "1 2 3",
        explanation: "Only one combination.",
      },
    ],
    constraints: ["1 <= r <= n <= 12", "array elements distinct"],
    io: "array-r",
    testCases: [
      { input: "4\n1 2 3 4\n2", expectedOutput: "1 2\n1 3\n1 4\n2 3\n2 4\n3 4" },
      { input: "3\n1 2 3\n3", expectedOutput: "1 2 3" },
      { input: "5\n5 4 3 2 1\n1", expectedOutput: "5\n4\n3\n2\n1" },
      { input: "4\n1 2 3 4\n4", expectedOutput: "1 2 3 4" },
      { input: "5\n1 2 3 4 5\n3", expectedOutput: "1 2 3\n1 2 4\n1 2 5\n1 3 4\n1 3 5\n1 4 5\n2 3 4\n2 3 5\n2 4 5\n3 4 5" },
      { input: "3\n3 1 2\n2", expectedOutput: "3 1\n3 2\n1 2" },
      { input: "2\n7 9\n2", expectedOutput: "7 9" },
      { input: "6\n1 2 3 4 5 6\n5", expectedOutput: "1 2 3 4 5\n1 2 3 4 6\n1 2 3 5 6\n1 2 4 5 6\n1 3 4 5 6\n2 3 4 5 6" },
      { input: "4\n10 20 30 40\n3", expectedOutput: "10 20 30\n10 20 40\n10 30 40\n20 30 40" },
      { input: "5\n2 4 6 8 10\n4", expectedOutput: "2 4 6 8\n2 4 6 10\n2 4 8 10\n2 6 8 10\n4 6 8 10" },
      { input: "3\n5 5 5\n2", expectedOutput: "5 5\n5 5\n5 5" },
      { input: "4\n-1 0 1 2\n2", expectedOutput: "-1 0\n-1 1\n-1 2\n0 1\n0 2\n1 2" },
    ],
  },
  {
    id: "range-distinct-queries",
    "hints": ["Answering every query from scratch is too slow — but moving between nearby query ranges needs only small adjustments.","Sort the queries in Mo's order, then expand and shrink the current range while maintaining a frequency map and distinct count."],
    returns: "intMat",
    title: "Range Distinct Queries (Mo's Algorithm)",
    difficulty: "hard",
    topic: "arrays",
    companies: ["Amazon", "Microsoft", "Directi"],
    description:
      "Given an array arr and a 2D array queries of [l, r] ranges (0-indexed, inclusive), return a 2D array where each row holds the count of distinct elements in the corresponding range. The intended solution is Mo's algorithm.",
    examples: [
      {
        input: "5\n1 2 1 3 2\n3\n0 4\n1 3\n2 2",
        output: "3\n3\n1",
        explanation: "[0,4] has {1,2,3}, [1,3] has {2,1,3}, [2,2] has {1}.",
      },
      {
        input: "4\n1 1 1 1\n2\n0 3\n1 2",
        output: "1\n1",
        explanation: "All elements are the same.",
      },
    ],
    constraints: ["1 <= n, q <= 10^5", "0 <= l <= r < n"],
    io: "range-queries",
    testCases: [
      { input: "5\n1 2 1 3 2\n3\n0 4\n1 3\n2 2", expectedOutput: "3\n3\n1" },
      { input: "4\n1 1 1 1\n2\n0 3\n1 2", expectedOutput: "1\n1" },
      { input: "6\n1 2 3 4 5 6\n2\n0 5\n2 4", expectedOutput: "6\n3" },
      { input: "1\n5\n1\n0 0", expectedOutput: "1" },
      { input: "7\n3 1 4 1 5 9 2\n3\n0 6\n0 0\n3 5", expectedOutput: "6\n1\n3" },
      { input: "5\n5 4 3 2 1\n2\n0 4\n1 3", expectedOutput: "5\n3" },
      { input: "8\n1 2 1 2 1 2 1 2\n3\n0 7\n0 1\n2 5", expectedOutput: "2\n2\n2" },
      { input: "4\n10 20 30 40\n1\n1 2", expectedOutput: "2" },
      { input: "6\n1 1 2 2 3 3\n2\n0 5\n2 3", expectedOutput: "3\n1" },
      { input: "9\n5 5 5 1 1 1 2 2 2\n2\n0 8\n3 5", expectedOutput: "3\n1" },
      { input: "3\n1 2 3\n3\n0 0\n1 1\n2 2", expectedOutput: "1\n1\n1" },
      { input: "10\n1 3 5 7 9 2 4 6 8 10\n2\n0 9\n4 6", expectedOutput: "10\n3" },
    ],
  },
  {
    id: "valid-palindrome",
    "hints": ["First picture the string after stripping everything that is not a letter or digit — the check becomes straightforward.","Use two pointers from both ends, skipping non-alphanumeric characters and comparing case-insensitively."],
    returns: "bool",
    title: "Valid Palindrome",
    difficulty: "easy",
    topic: "strings",
    companies: ["Amazon", "Facebook", "Cisco", "Microsoft"],
    description:
      "Given a string s, check whether it is a palindrome considering only alphanumeric characters and ignoring case. Return true or false.",
    examples: [
      {
        input: "A man, a plan, a canal: Panama",
        output: "true",
        explanation: "After filtering, it reads amanaplanacanalpanama.",
      },
      {
        input: "race a car",
        output: "false",
        explanation: "Filtered to raceacar, which is not a palindrome.",
      },
    ],
    constraints: ["0 <= s.length <= 2 * 10^5", "ASCII characters"],
    io: "string",
    testCases: [
      { input: "A man, a plan, a canal: Panama", expectedOutput: "true" },
      { input: "race a car", expectedOutput: "false" },
      { input: " ", expectedOutput: "true" },
      { input: "0P", expectedOutput: "false" },
      { input: "Madam", expectedOutput: "true" },
      { input: "ab@a", expectedOutput: "true" },
      { input: "a", expectedOutput: "true" },
      { input: "ab", expectedOutput: "false" },
      { input: "Aa", expectedOutput: "true" },
      { input: ".,", expectedOutput: "true" },
      { input: "No 'x' in Nixon", expectedOutput: "true" },
      { input: "hello", expectedOutput: "false" },
    ],
  },
  {
    id: "valid-anagram",
    "hints": ["Two strings are anagrams exactly when every character occurs the same number of times in both.","Count character frequencies in both strings with a single array or hash map and compare the counts."],
    returns: "bool",
    title: "Valid Anagram",
    difficulty: "easy",
    topic: "strings",
    companies: ["Amazon", "Google", "Adobe"],
    description:
      "Given two strings a and b, return true if one is an anagram of the other (exact same characters with same frequencies, case-sensitive), otherwise return false.",
    examples: [
      {
        input: "anagram\nnagaram",
        output: "true",
        explanation: "Both have the same character counts.",
      },
      {
        input: "rat\ncar",
        output: "false",
        explanation: "Different character counts.",
      },
    ],
    constraints: ["0 <= s.length, t.length <= 5 * 10^4"],
    io: "two-strings",
    testCases: [
      { input: "anagram\nnagaram", expectedOutput: "true" },
      { input: "rat\ncar", expectedOutput: "false" },
      { input: "a\nab", expectedOutput: "false" },
      { input: "listen\nsilent", expectedOutput: "true" },
      { input: "aacc\nccac", expectedOutput: "false" },
      { input: "\n", expectedOutput: "true" },
      { input: "Dormitory\ndirty room", expectedOutput: "false" },
      { input: "hello\nolleh", expectedOutput: "true" },
      { input: "abc\ncba", expectedOutput: "true" },
      { input: "aab\nabb", expectedOutput: "false" },
      { input: "abcd\ndcba", expectedOutput: "true" },
      { input: "silent\nlisten", expectedOutput: "true" },
    ],
  },
  {
    id: "remove-consecutive-characters",
    "hints": ["You only need to remember the last character you kept — if the current one matches it, skip it.","Build the result in one pass, appending a character only when it differs from the previously appended one."],
    returns: "string",
    title: "Remove Consecutive Characters",
    difficulty: "easy",
    topic: "strings",
    companies: ["Adobe", "Amazon", "Microsoft"],
    description:
      "Given a string s, collapse every run of consecutive identical characters into a single character and return the result.",
    examples: [
      {
        input: "aabccba",
        output: "abcba",
        explanation: "aa becomes a, cc becomes c.",
      },
      {
        input: "aaaa",
        output: "a",
        explanation: "One run collapses to a single a.",
      },
    ],
    constraints: ["0 <= s.length <= 10^5"],
    io: "string",
    testCases: [
      { input: "aabccba", expectedOutput: "abcba" },
      { input: "aaaa", expectedOutput: "a" },
      { input: "abc", expectedOutput: "abc" },
      { input: "", expectedOutput: "" },
      { input: "a", expectedOutput: "a" },
      { input: "aaabbbccc", expectedOutput: "abc" },
      { input: "abccbccba", expectedOutput: "abcbcba" },
      { input: "hello world", expectedOutput: "helo world" },
      { input: "1122334455", expectedOutput: "12345" },
      { input: "aAaAaA", expectedOutput: "aAaAaA" },
      { input: "Mississippi", expectedOutput: "Misisipi" },
      { input: "bookkeeper", expectedOutput: "bokeper" },
    ],
  },
  {
    id: "longest-common-prefix",
    "hints": ["The common prefix cannot exceed the shortest string — use the first string as your initial candidate.","Compare character by character across all strings, stopping at the first mismatch; sorting first and comparing only the extremes also works."],
    returns: "string",
    title: "Longest Common Prefix",
    difficulty: "easy",
    topic: "strings",
    companies: ["Amazon", "Google", "Adobe", "Apple"],
    description:
      "Given an array words of n strings, find the longest common prefix shared by all of them and return it. Return an empty string if there is none.",
    examples: [
      {
        input: "3\nflower\nflow\nflight",
        output: "fl",
        explanation: "fl is the longest shared prefix.",
      },
      {
        input: "3\ndog\nracecar\ncar",
        output: "",
        explanation: "No common prefix.",
      },
    ],
    constraints: ["1 <= n <= 200", "0 <= words[i].length <= 200"],
    io: "string-array",
    testCases: [
      { input: "3\nflower\nflow\nflight", expectedOutput: "fl" },
      { input: "3\ndog\nracecar\ncar", expectedOutput: "" },
      { input: "1\nhello", expectedOutput: "hello" },
      { input: "4\ninterspecies\ninterstellar\ninterstate\ninterim", expectedOutput: "inter" },
      { input: "2\nabc\nabc", expectedOutput: "abc" },
      { input: "3\n\n\n", expectedOutput: "" },
      { input: "4\na\nab\nabc\nabcd", expectedOutput: "a" },
      { input: "3\nprefix\npreform\nprevent", expectedOutput: "pre" },
      { input: "2\nsame\nsame", expectedOutput: "same" },
      { input: "5\nthrone\nthrone\ndungeon\nthrone\nthrone", expectedOutput: "" },
      { input: "3\napple\napricot\navocado", expectedOutput: "a" },
      { input: "2\n\nabc", expectedOutput: "" },
    ],
  },
  {
    id: "mobile-numeric-keypad",
    "hints": ["Each letter maps to exactly one digit, so this is a direct substitution problem.","Build a lookup table for every letter (with space mapping to 0), then convert each character in a single pass."],
    returns: "string",
    title: "Mobile Numeric Keypad Sequence",
    difficulty: "easy",
    topic: "strings",
    companies: ["Amazon", "Microsoft", "Samsung", "Snapdeal"],
    description:
      "Given a string s of uppercase letters and spaces, convert it to the old mobile keypad digit sequence: ABC->2, DEF->3, GHI->4, JKL->5, MNO->6, PQRS->7, TUV->8, WXYZ->9, space->0. Return the digit string.",
    examples: [
      {
        input: "HELLO WORLD",
        output: "43556096753",
        explanation: "H=4 E=3 L=5 L=5 O=6 space=0 W=9 O=6 R=7 L=5 D=3.",
      },
      {
        input: "ABC",
        output: "222",
        explanation: "A, B, C all map to 2.",
      },
    ],
    constraints: ["1 <= s.length <= 10^5", "only A-Z and spaces"],
    io: "string",
    testCases: [
      { input: "HELLO WORLD", expectedOutput: "43556096753" },
      { input: "ABC", expectedOutput: "222" },
      { input: "GEEKSFORGEEKS", expectedOutput: "4335736743357" },
      { input: "A", expectedOutput: "2" },
      { input: "Z", expectedOutput: "9" },
      { input: "SPACE TEST", expectedOutput: "7722308378" },
      { input: "PQRS", expectedOutput: "7777" },
      { input: "WXYZ", expectedOutput: "9999" },
      { input: "MNO", expectedOutput: "666" },
      { input: "TUV", expectedOutput: "888" },
      { input: "JKL", expectedOutput: "555" },
      { input: "DEF", expectedOutput: "333" },
    ],
  },
  {
    id: "print-duplicates-string",
    "hints": ["You must know each character's total count before deciding which ones are duplicates.","Count frequencies in one pass, then emit the characters with count above one in alphabetical order."],
    returns: "strMat",
    title: "Return Duplicates in a String",
    difficulty: "easy",
    topic: "strings",
    companies: ["Amazon", "Adobe", "Microsoft"],
    description:
      "Given a string s, return every character that appears more than once as a 2D array of [char, count] pairs, sorted alphabetically by character. If there are none, return [[\"No duplicates\"]].",
    examples: [
      {
        input: "geeksforgeeks",
        output: "e 4\ng 2\nk 2\ns 2",
        explanation: "e appears 4 times, g/k/s appear twice.",
      },
      {
        input: "abc",
        output: "No duplicates",
        explanation: "All characters are unique.",
      },
    ],
    constraints: ["0 <= s.length <= 10^5"],
    io: "string",
    testCases: [
      { input: "geeksforgeeks", expectedOutput: "e 4\ng 2\nk 2\ns 2" },
      { input: "abc", expectedOutput: "No duplicates" },
      { input: "aabbcc", expectedOutput: "a 2\nb 2\nc 2" },
      { input: "hello", expectedOutput: "l 2" },
      { input: "a", expectedOutput: "No duplicates" },
      { input: "mississippi", expectedOutput: "i 4\np 2\ns 4" },
      { input: "aAaA", expectedOutput: "A 2\na 2" },
      { input: "112233", expectedOutput: "1 2\n2 2\n3 2" },
      { input: "programming", expectedOutput: "g 2\nm 2\nr 2" },
      { input: "abccba", expectedOutput: "a 2\nb 2\nc 2" },
      { input: "zzz", expectedOutput: "z 3" },
      { input: "", expectedOutput: "No duplicates" },
    ],
  },
  {
    id: "longest-substring-without-repeating",
    "hints": ["When you meet a repeated character, the new window must begin just after that character's previous occurrence.","Slide a window while tracking last-seen indices in a hash map; jump the left edge past the duplicate and record the maximum width."],
    returns: "int",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "medium",
    topic: "strings",
    companies: ["Amazon", "Microsoft", "Google", "Adobe"],
    description:
      "Given a string s, return the length of the longest substring without repeating characters.",
    examples: [
      {
        input: "abcabcbb",
        output: "3",
        explanation: "abc is the longest such substring.",
      },
      {
        input: "pwwkew",
        output: "3",
        explanation: "wke is the longest such substring.",
      },
    ],
    constraints: ["0 <= s.length <= 5 * 10^4"],
    io: "string",
    testCases: [
      { input: "abcabcbb", expectedOutput: "3" },
      { input: "bbbbb", expectedOutput: "1" },
      { input: "pwwkew", expectedOutput: "3" },
      { input: "", expectedOutput: "0" },
      { input: "abcdef", expectedOutput: "6" },
      { input: "abba", expectedOutput: "2" },
      { input: "dvdf", expectedOutput: "3" },
      { input: "aab", expectedOutput: "2" },
      { input: "tmmzuxt", expectedOutput: "5" },
      { input: "anviaj", expectedOutput: "5" },
      { input: "abcdeafgh", expectedOutput: "8" },
      { input: "a", expectedOutput: "1" },
    ],
  },
  {
    id: "longest-repeating-character-replacement",
    "hints": ["Inside any window, the replacements needed equal the window size minus the count of its most frequent character.","Expand the window while (length minus max frequency) stays within k, moving the left edge only when the condition breaks."],
    returns: "int",
    title: "Longest Repeating Character Replacement",
    difficulty: "medium",
    topic: "strings",
    companies: ["Amazon", "Google", "Microsoft"],
    description:
      "Given a string s of uppercase letters and an integer k, you may replace at most k characters to make all characters in a substring equal. Return the length of the longest such substring.",
    examples: [
      {
        input: "ABAB\n2",
        output: "4",
        explanation: "Replace the two Bs with As to get AAAA.",
      },
      {
        input: "AABABBA\n1",
        output: "4",
        explanation: "AABA becomes AAAA with one replacement.",
      },
    ],
    constraints: ["1 <= s.length <= 10^5", "0 <= k <= s.length"],
    io: "string-int",
    testCases: [
      { input: "ABAB\n2", expectedOutput: "4" },
      { input: "AABABBA\n1", expectedOutput: "4" },
      { input: "AAAA\n2", expectedOutput: "4" },
      { input: "ABCDE\n1", expectedOutput: "2" },
      { input: "A\n0", expectedOutput: "1" },
      { input: "ABBB\n2", expectedOutput: "4" },
      { input: "AAAB\n0", expectedOutput: "3" },
      { input: "ABCDEFG\n3", expectedOutput: "4" },
      { input: "AABA\n0", expectedOutput: "2" },
      { input: "BBBBB\n1", expectedOutput: "5" },
      { input: "ABCABC\n2", expectedOutput: "4" },
      { input: "AABBC\n2", expectedOutput: "4" },
    ],
  },
  {
    id: "group-anagrams",
    "hints": ["Anagrams share a canonical form — normalize each word the same way and anagrams will produce identical keys.","Sort each word's characters (or use its frequency signature) as a hash map key and collect words by key."],
    returns: "strMat",
    title: "Group Anagrams",
    difficulty: "medium",
    topic: "strings",
    companies: ["Amazon", "Microsoft", "Goldman Sachs", "Uber"],
    description:
      "Given an array words of n strings, group the anagrams together. Return a 2D array where each row is a group with its words sorted alphabetically; order the rows by each group's first word.",
    examples: [
      {
        input: "6\neat\ntea\ntan\nate\nnat\nbat",
        output: "ate eat tea\nbat\nnat tan",
        explanation: "Three anagram groups.",
      },
      {
        input: "1\nabc",
        output: "abc",
        explanation: "A single group.",
      },
    ],
    constraints: ["1 <= n <= 10^4", "1 <= words[i].length <= 100"],
    io: "string-array",
    testCases: [
      { input: "6\neat\ntea\ntan\nate\nnat\nbat", expectedOutput: "ate eat tea\nbat\nnat tan" },
      { input: "1\nabc", expectedOutput: "abc" },
      { input: "4\nabc\ndef\nghi\njkl", expectedOutput: "abc\ndef\nghi\njkl" },
      { input: "5\naaa\naaa\naaa\naaa\naaa", expectedOutput: "aaa aaa aaa aaa aaa" },
      { input: "4\nlisten\nsilent\nenlist\nhello", expectedOutput: "enlist listen silent\nhello" },
      { input: "3\nab\nba\nab", expectedOutput: "ab ab ba" },
      { input: "2\nx\ny", expectedOutput: "x\ny" },
      { input: "6\nabc\nbca\ncab\nxyz\nzyx\nyzx", expectedOutput: "abc bca cab\nxyz yzx zyx" },
      { input: "4\nrat\ntar\nart\ncat", expectedOutput: "art rat tar\ncat" },
      { input: "3\na\nb\nc", expectedOutput: "a\nb\nc" },
      { input: "5\nstop\npots\ntops\nopts\npost", expectedOutput: "opts post pots stop tops" },
      { input: "2\nabcd\ndcba", expectedOutput: "abcd dcba" },
    ],
  },
  {
    id: "longest-palindromic-substring",
    "hints": ["Every palindrome has a center — expand outward from each possible center and keep the longest result.","Try each index and each gap between indices as a center, expanding while characters match, and track the best span."],
    returns: "string",
    title: "Longest Palindromic Substring",
    difficulty: "medium",
    topic: "strings",
    companies: ["Amazon", "Microsoft", "Samsung", "Adobe"],
    description:
      "Given a string s, return its longest palindromic substring. If several have the same maximum length, return the one that starts earliest.",
    examples: [
      {
        input: "babad",
        output: "bab",
        explanation: "bab and aba both qualify; bab starts earlier.",
      },
      {
        input: "cbbd",
        output: "bb",
        explanation: "bb is the longest palindromic substring.",
      },
    ],
    constraints: ["1 <= s.length <= 1000"],
    io: "string",
    testCases: [
      { input: "babad", expectedOutput: "bab" },
      { input: "cbbd", expectedOutput: "bb" },
      { input: "a", expectedOutput: "a" },
      { input: "ac", expectedOutput: "a" },
      { input: "racecar", expectedOutput: "racecar" },
      { input: "abccba", expectedOutput: "abccba" },
      { input: "abcdef", expectedOutput: "a" },
      { input: "aabbaa", expectedOutput: "aabbaa" },
      { input: "forgeeksskeegfor", expectedOutput: "geeksskeeg" },
      { input: "abacdfgdcaba", expectedOutput: "aba" },
      { input: "aaaa", expectedOutput: "aaaa" },
      { input: "abcba", expectedOutput: "abcba" },
    ],
  },
  {
    id: "palindromic-substrings-count",
    "hints": ["This is the counting version of center expansion — every successful expansion step discovers one palindrome.","Expand around all centers (both odd and even lengths) and count each valid expansion rather than tracking the longest."],
    returns: "int",
    title: "Palindromic Substrings",
    difficulty: "medium",
    topic: "strings",
    companies: ["Facebook", "Microsoft", "Google", "Uber"],
    description:
      "Given a string s, return the count of palindromic substrings (including single characters and duplicates).",
    examples: [
      {
        input: "abc",
        output: "3",
        explanation: "Only the three single characters.",
      },
      {
        input: "aaa",
        output: "6",
        explanation: "3 singles + 2 doubles + 1 triple.",
      },
    ],
    constraints: ["0 <= s.length <= 1000"],
    io: "string",
    testCases: [
      { input: "abc", expectedOutput: "3" },
      { input: "aaa", expectedOutput: "6" },
      { input: "a", expectedOutput: "1" },
      { input: "abccba", expectedOutput: "9" },
      { input: "racecar", expectedOutput: "10" },
      { input: "", expectedOutput: "0" },
      { input: "aaaa", expectedOutput: "10" },
      { input: "ababa", expectedOutput: "9" },
      { input: "abcdef", expectedOutput: "6" },
      { input: "aabaa", expectedOutput: "9" },
      { input: "noon", expectedOutput: "6" },
      { input: "xyx", expectedOutput: "4" },
    ],
  },
  {
    id: "next-permutation-string",
    "hints": ["The same pivot logic as the array version applies — convert the string to a character array first.","Find the rightmost ascent pivot, swap it with the smallest larger character to its right, then reverse the suffix."],
    returns: "string",
    title: "Next Permutation of a String",
    difficulty: "medium",
    topic: "strings",
    companies: ["Amazon", "Adobe", "Microsoft"],
    description:
      "Given a string s, rearrange its characters into the lexicographically next greater permutation. If none exists, return the characters sorted in ascending order.",
    examples: [
      {
        input: "abc",
        output: "acb",
        explanation: "The next permutation after abc.",
      },
      {
        input: "cba",
        output: "abc",
        explanation: "No greater permutation; return sorted order.",
      },
    ],
    constraints: ["1 <= s.length <= 10^5", "lowercase letters"],
    io: "string",
    testCases: [
      { input: "abc", expectedOutput: "acb" },
      { input: "cba", expectedOutput: "abc" },
      { input: "abdc", expectedOutput: "acbd" },
      { input: "a", expectedOutput: "a" },
      { input: "aab", expectedOutput: "aba" },
      { input: "dcba", expectedOutput: "abcd" },
      { input: "hefg", expectedOutput: "hegf" },
      { input: "ab", expectedOutput: "ba" },
      { input: "ba", expectedOutput: "ab" },
      { input: "aaabbb", expectedOutput: "aababb" },
      { input: "zyx", expectedOutput: "xyz" },
      { input: "abcd", expectedOutput: "abdc" },
    ],
  },
  {
    id: "count-palindromic-subsequences",
    "hints": ["Think recursively: a subsequence either includes or excludes the outer characters — handle the matching and differing cases separately.","Use interval DP where dp[i][j] counts palindromic subsequences in s[i..j], combining the inner intervals and adding extra when the ends match."],
    returns: "int",
    title: "Count Palindromic Subsequences",
    difficulty: "hard",
    topic: "strings",
    companies: ["Myntra", "Amazon", "Microsoft", "Samsung"],
    description:
      "Given a string s, return the count of palindromic subsequences, including duplicates (every index set that forms a palindrome counts).",
    examples: [
      {
        input: "abc",
        output: "3",
        explanation: "Only the three single characters.",
      },
      {
        input: "aaa",
        output: "7",
        explanation: "Every non-empty subsequence is a palindrome: 2^3 - 1.",
      },
    ],
    constraints: ["1 <= s.length <= 12"],
    io: "string",
    testCases: [
      { input: "abc", expectedOutput: "3" },
      { input: "aaa", expectedOutput: "7" },
      { input: "aba", expectedOutput: "5" },
      { input: "aab", expectedOutput: "4" },
      { input: "abcd", expectedOutput: "4" },
      { input: "a", expectedOutput: "1" },
      { input: "abca", expectedOutput: "7" },
      { input: "aaaa", expectedOutput: "15" },
      { input: "ab", expectedOutput: "2" },
      { input: "aa", expectedOutput: "3" },
      { input: "abcba", expectedOutput: "13" },
      { input: "xyzyx", expectedOutput: "13" },
    ],
  },
  {
    id: "smallest-window-substring",
    "hints": ["Expand the window until it contains every required character, then shrink from the left while it still does.","Maintain frequency maps for the pattern and the window, track how many requirements are satisfied, and record the smallest valid window."],
    returns: "string",
    title: "Smallest Window Containing All Characters",
    difficulty: "hard",
    topic: "strings",
    companies: ["Amazon", "Microsoft", "Google", "Adobe"],
    description:
      "Given a string s and a pattern t, return the smallest window in s that contains all characters of t (with frequencies). If several windows tie, return the earliest one. If none exists, return \"none\".",
    examples: [
      {
        input: "ADOBECODEBANC\nABC",
        output: "BANC",
        explanation: "BANC is the shortest window containing A, B and C.",
      },
      {
        input: "a\nb",
        output: "none",
        explanation: "b never appears in s.",
      },
    ],
    constraints: ["1 <= s.length <= 10^5", "1 <= t.length <= 10^5"],
    io: "two-strings",
    testCases: [
      { input: "ADOBECODEBANC\nABC", expectedOutput: "BANC" },
      { input: "a\nb", expectedOutput: "none" },
      { input: "a\na", expectedOutput: "a" },
      { input: "ab\nb", expectedOutput: "b" },
      { input: "this is a test string\ntist", expectedOutput: "t stri" },
      { input: "aa\nbb", expectedOutput: "none" },
      { input: "geeksforgeeks\nork", expectedOutput: "ksfor" },
      { input: "abcd\nabcd", expectedOutput: "abcd" },
      { input: "abc\ncba", expectedOutput: "abc" },
      { input: "aaaaab\nab", expectedOutput: "ab" },
      { input: "xyz\ny", expectedOutput: "y" },
      { input: "aabbcc\naabc", expectedOutput: "aabbc" },
    ],
  },
  {
    id: "wildcard-string-matching",
    "hints": ["The tricky symbol is '*', which may need to consume one more character and retry after a failed match.","Use DP over string and pattern indices, or a greedy two-pointer scan that backtracks to the last '*' on mismatch."],
    returns: "bool",
    title: "Wildcard Pattern Matching",
    difficulty: "hard",
    topic: "strings",
    companies: ["Microsoft", "Amazon", "Flipkart", "Adobe"],
    description:
      "Given a string a and a pattern b containing ? (matches exactly one character) and * (matches any sequence including empty), return true if the whole string matches the pattern, else return false.",
    examples: [
      {
        input: "aa\na",
        output: "false",
        explanation: "a does not match the full string aa.",
      },
      {
        input: "aa\n*",
        output: "true",
        explanation: "* matches everything.",
      },
    ],
    constraints: ["0 <= s.length <= 2000", "0 <= p.length <= 2000"],
    io: "two-strings",
    testCases: [
      { input: "aa\na", expectedOutput: "false" },
      { input: "aa\n*", expectedOutput: "true" },
      { input: "cb\n?a", expectedOutput: "false" },
      { input: "adceb\n*ab", expectedOutput: "false" },
      { input: "acdcb\nac*b", expectedOutput: "true" },
      { input: "abc\nabc", expectedOutput: "true" },
      { input: "abc\na?c", expectedOutput: "true" },
      { input: "\n*", expectedOutput: "true" },
      { input: "\n?", expectedOutput: "false" },
      { input: "abcdef\n*", expectedOutput: "true" },
      { input: "abcdef\na*f", expectedOutput: "true" },
      { input: "abcde\nab*d", expectedOutput: "false" },
    ],
  },
  {
    id: "longest-prefix-suffix",
    "hints": ["The LPS array stores, for every prefix, the longest proper prefix that is also a suffix — build it incrementally.","Apply the KMP prefix function: on mismatch, fall back to the LPS value of the previous position instead of restarting."],
    returns: "int",
    title: "Longest Prefix Which is Also Suffix",
    difficulty: "medium",
    topic: "strings",
    companies: ["Amazon", "Adobe", "Microsoft"],
    description:
      "Given a string s, return the length of the longest proper prefix which is also a suffix (the KMP LPS value for the whole string).",
    examples: [
      {
        input: "abab",
        output: "2",
        explanation: "ab is both prefix and suffix.",
      },
      {
        input: "aaaa",
        output: "3",
        explanation: "aaa is both prefix and suffix.",
      },
    ],
    constraints: ["1 <= s.length <= 10^5"],
    io: "string",
    testCases: [
      { input: "abab", expectedOutput: "2" },
      { input: "aaaa", expectedOutput: "3" },
      { input: "abc", expectedOutput: "0" },
      { input: "a", expectedOutput: "0" },
      { input: "ababab", expectedOutput: "4" },
      { input: "abcdabca", expectedOutput: "1" },
      { input: "aaabaaa", expectedOutput: "3" },
      { input: "abcab", expectedOutput: "2" },
      { input: "abcdef", expectedOutput: "0" },
      { input: "aabaab", expectedOutput: "3" },
      { input: "abcabc", expectedOutput: "3" },
      { input: "mississippi", expectedOutput: "0" },
    ],
  },
  {
    id: "rabin-karp-pattern-search",
    "hints": ["Comparing the pattern against every window character by character is quadratic — a rolling hash compares windows in constant time.","Hash the pattern and maintain a rolling hash over text windows, verifying each hash match to rule out collisions."],
    returns: "intArr",
    title: "Pattern Searching (Rabin-Karp)",
    difficulty: "medium",
    topic: "strings",
    companies: ["Microsoft", "Amazon", "Adobe"],
    description:
      "Given a text a and a pattern b, return all 0-based starting indices where the pattern occurs in the text as an array. Return [-1] if the pattern never occurs. The intended solution is the Rabin-Karp rolling-hash algorithm.",
    examples: [
      {
        input: "AABAACAADAABAABA\nAABA",
        output: "0 9 12",
        explanation: "AABA occurs at indices 0, 9 and 12.",
      },
      {
        input: "abc\nxyz",
        output: "-1",
        explanation: "No occurrence.",
      },
    ],
    constraints: ["1 <= text.length <= 10^5", "1 <= pattern.length <= text.length"],
    io: "two-strings",
    testCases: [
      { input: "AABAACAADAABAABA\nAABA", expectedOutput: "0 9 12" },
      { input: "hello\nll", expectedOutput: "2" },
      { input: "aaaaa\naa", expectedOutput: "0 1 2 3" },
      { input: "abc\nxyz", expectedOutput: "-1" },
      { input: "abcabcabc\nabc", expectedOutput: "0 3 6" },
      { input: "a\na", expectedOutput: "0" },
      { input: "abcd\nabcd", expectedOutput: "0" },
      { input: "mississippi\nissi", expectedOutput: "1 4" },
      { input: "abcdef\ndef", expectedOutput: "3" },
      { input: "aaaaab\naaab", expectedOutput: "2" },
      { input: "xyz\nxyzxyz", expectedOutput: "-1" },
      { input: "abababab\nabab", expectedOutput: "0 2 4" },
    ],
  },
  {
    id: "transform-string-min-operations",
    "hints": ["Moving a character to the front never disturbs the relative order of the rest — consider which suffix can stay untouched.","First confirm both strings share identical character counts, then scan from the end for the longest already-matching suffix; the remainder is the answer."],
    returns: "int",
    title: "Transform String with Minimum Operations",
    difficulty: "medium",
    topic: "strings",
    companies: ["Amazon", "Microsoft", "Adobe"],
    description:
      "In one operation you may take any character and move it to the front of the string. Given strings a and b of equal length, return the minimum operations to transform a into b, or -1 if it is impossible.",
    examples: [
      {
        input: "EACBD\nEABCD",
        output: "3",
        explanation: "Three front-moves are needed.",
      },
      {
        input: "ABD\nBAD",
        output: "1",
        explanation: "Move B to the front once.",
      },
    ],
    constraints: ["1 <= a.length = b.length <= 10^5", "lowercase and uppercase letters"],
    io: "two-strings",
    testCases: [
      { input: "EACBD\nEABCD", expectedOutput: "3" },
      { input: "ABD\nBAD", expectedOutput: "1" },
      { input: "ABC\nABC", expectedOutput: "0" },
      { input: "ABC\nDEF", expectedOutput: "-1" },
      { input: "ABCDE\nEDCBA", expectedOutput: "4" },
      { input: "GEEK\nEKEG", expectedOutput: "3" },
      { input: "ABCDEF\nFABCDE", expectedOutput: "1" },
      { input: "AAAA\nAAAA", expectedOutput: "0" },
      { input: "AB\nBA", expectedOutput: "1" },
      { input: "XYZ\nZYX", expectedOutput: "2" },
      { input: "HELLO\nOLELH", expectedOutput: "4" },
      { input: "AAB\nABA", expectedOutput: "2" },
    ],
  },
  {
    id: "boyer-moore-pattern-search",
    "hints": ["Matching right to left lets you skip ahead when the mismatching text character never appears in the pattern.","Precompute the bad-character table of last occurrences, then shift the pattern past each mismatch accordingly."],
    returns: "intArr",
    title: "Pattern Searching (Boyer-Moore)",
    difficulty: "medium",
    topic: "strings",
    companies: ["Microsoft", "Amazon", "MakeMyTrip"],
    description:
      "Given a text a and a pattern b, return all 0-based starting indices where the pattern occurs in the text as an array. Return [-1] if the pattern never occurs. The intended solution is the Boyer-Moore algorithm with the bad-character heuristic.",
    examples: [
      {
        input: "AABAACAADAABAABA\nAABA",
        output: "0 9 12",
        explanation: "AABA occurs at indices 0, 9 and 12.",
      },
      {
        input: "abc\ndef",
        output: "-1",
        explanation: "No occurrence.",
      },
    ],
    constraints: ["1 <= text.length <= 10^5", "1 <= pattern.length <= text.length"],
    io: "two-strings",
    testCases: [
      { input: "AABAACAADAABAABA\nAABA", expectedOutput: "0 9 12" },
      { input: "hello world\nworld", expectedOutput: "6" },
      { input: "aaaa\naa", expectedOutput: "0 1 2" },
      { input: "abc\ndef", expectedOutput: "-1" },
      { input: "ababababab\naba", expectedOutput: "0 2 4 6" },
      { input: "x\nx", expectedOutput: "0" },
      { input: "abcdef\nabc", expectedOutput: "0" },
      { input: "mississippi\nssi", expectedOutput: "2 5" },
      { input: "aaaaaa\naaa", expectedOutput: "0 1 2 3" },
      { input: "hello\nhello", expectedOutput: "0" },
      { input: "abcabc\nabcabcabc", expectedOutput: "-1" },
      { input: "testtest\ntest", expectedOutput: "0 4" },
    ],
  },
  {
    id: "word-wrap",
    "hints": ["The cost of each line depends only on where the previous line ended — a classic optimal-substructure setup.","Let dp[i] be the minimum cost for the first i words, trying every possible last-line break; the final line costs zero."],
    returns: "int",
    title: "Word Wrap (Minimum Cost)",
    difficulty: "hard",
    topic: "strings",
    companies: ["Microsoft", "Amazon", "Atlassian", "Adobe"],
    description:
      "Given an array words of n words and a line width width, break the words into lines (keeping order) so that the total cost is minimized. The cost of a line (except the last) is the cube of the number of extra spaces left on it. Return the minimum total cost.",
    examples: [
      {
        input: "4\ngeeks for geeks quiz\n12",
        output: "27",
        explanation: "Lines [geeks for][geeks quiz]: first line has 3 extra spaces, 3^3 = 27, last line is free.",
      },
      {
        input: "3\naa bb cc\n6",
        output: "1",
        explanation: "Lines [aa bb][cc]: 1^3 = 1, last line free.",
      },
    ],
    constraints: ["1 <= n <= 500", "each word fits in the width"],
    io: "words-width",
    testCases: [
      { input: "4\ngeeks for geeks quiz\n12", expectedOutput: "27" },
      { input: "3\naa bb cc\n6", expectedOutput: "1" },
      { input: "1\nhello\n10", expectedOutput: "0" },
      { input: "2\nab cd\n5", expectedOutput: "0" },
      { input: "5\na b c d e\n3", expectedOutput: "0" },
      { input: "5\na b c d e\n4", expectedOutput: "2" },
      { input: "3\nword wrap test\n8", expectedOutput: "128" },
      { input: "6\nthe quick brown fox jumps over\n10", expectedOutput: "2" },
      { input: "4\nab cd ef gh\n7", expectedOutput: "8" },
      { input: "2\na bb\n4", expectedOutput: "0" },
      { input: "7\nword1 word2 word3 word4 word5 word6 word7\n12", expectedOutput: "3" },
      { input: "3\nabc def ghi\n7", expectedOutput: "0" },
    ],
  },
{
    id: "reverse-linked-list",
    "hints": ["Think about walking through the list while rewiring each node's next pointer to point backwards instead of forwards.","Use three pointers (previous, current, next) so you don't lose the rest of the list while reversing; the key is saving current.next before you overwrite it."],
    returns: "linkedlist",
    title: "Reverse Linked List",
    difficulty: "easy",
    topic: "linked-list",
    companies: ["Amazon", "Microsoft", "Meta", "Google"],
    description: "Given the head of a singly linked list, reverse the list and return the new head.",
    examples: [
      { input: "5\n1 2 3 4 5", output: "5 4 3 2 1", explanation: "The list 1 -> 2 -> 3 -> 4 -> 5 becomes 5 -> 4 -> 3 -> 2 -> 1 after reversing all links." },
      { input: "1\n9", output: "9", explanation: "A single node list stays the same after reversal." },
      { input: "0\n", output: "", explanation: "An empty list reversed is still empty." },
    ],
    constraints: ["The number of nodes in the list is in the range [0, 5000].", "-5000 <= Node.val <= 5000"],
    io: "linkedlist",
    testCases: [
      { input: "5\n1 2 3 4 5", expectedOutput: "5 4 3 2 1" },
      { input: "1\n9", expectedOutput: "9" },
      { input: "0\n", expectedOutput: "" },
      { input: "2\n1 2", expectedOutput: "2 1" },
      { input: "6\n1 1 2 2 3 3", expectedOutput: "3 3 2 2 1 1" },
      { input: "3\n-1 -2 -3", expectedOutput: "-3 -2 -1" },
      { input: "4\n10 20 30 40", expectedOutput: "40 30 20 10" },
      { input: "7\n5 4 3 2 1 0 -1", expectedOutput: "-1 0 1 2 3 4 5" },
      { input: "2\n-5 5", expectedOutput: "5 -5" },
      { input: "10\n1 2 3 4 5 6 7 8 9 10", expectedOutput: "10 9 8 7 6 5 4 3 2 1" },
      { input: "3\n0 0 0", expectedOutput: "0 0 0" },
      { input: "5\n100 -100 50 -50 0", expectedOutput: "0 -50 50 -100 100" },
    ],
  },
  {
    id: "middle-of-linked-list",
    "hints": ["You don't need to know the length first; think about how two walkers moving at different speeds would end up positioned.","Use the slow-and-fast pointer technique: advance one pointer one node at a time and the other two at a time, so when the fast one reaches the end, the slow one sits on the middle."],
    returns: "int",
    title: "Middle of the Linked List",
    difficulty: "easy",
    topic: "linked-list",
    companies: ["Amazon", "Adobe", "Microsoft"],
    description: "Given the head of a singly linked list, return the value of the middle node of the linked list. If there are two middle nodes, return the value of the second middle node.",
    examples: [
      { input: "5\n1 2 3 4 5", output: "3", explanation: "The middle node of 1 -> 2 -> 3 -> 4 -> 5 is the node with value 3." },
      { input: "6\n1 2 3 4 5 6", output: "4", explanation: "For an even length list the second middle node is returned, which holds value 4." },
      { input: "1\n9", output: "9", explanation: "A single node is its own middle." },
    ],
    constraints: ["The number of nodes in the list is in the range [1, 100].", "-100 <= Node.val <= 100"],
    io: "linkedlist",
    testCases: [
      { input: "5\n1 2 3 4 5", expectedOutput: "3" },
      { input: "6\n1 2 3 4 5 6", expectedOutput: "4" },
      { input: "1\n9", expectedOutput: "9" },
      { input: "2\n1 2", expectedOutput: "2" },
      { input: "3\n7 8 9", expectedOutput: "8" },
      { input: "4\n-1 -2 -3 -4", expectedOutput: "-3" },
      { input: "7\n10 20 30 40 50 60 70", expectedOutput: "40" },
      { input: "8\n1 1 1 1 1 1 1 1", expectedOutput: "1" },
      { input: "2\n-5 5", expectedOutput: "5" },
      { input: "9\n9 8 7 6 5 4 3 2 1", expectedOutput: "5" },
      { input: "10\n1 2 3 4 5 6 7 8 9 10", expectedOutput: "6" },
      { input: "1\n-100", expectedOutput: "-100" },
    ],
  },
  {
    id: "merge-two-sorted-lists",
    "hints": ["Since both lists are already sorted, you only ever need to compare the current heads of each list.","Use a dummy head node to simplify the merge logic, then repeatedly attach the smaller of the two heads and advance that list's pointer."],
    returns: "linkedlist",
    title: "Merge Two Sorted Lists",
    difficulty: "easy",
    topic: "linked-list",
    companies: ["Amazon", "Microsoft", "Apple", "Meta"],
    description: "You are given the heads of two sorted linked lists l1 and l2. Merge the two lists into one sorted list and return its head.",
    examples: [
      { input: "3\n1 2 4\n3\n1 3 4", output: "1 1 2 3 4 4", explanation: "Merging 1 -> 2 -> 4 and 1 -> 3 -> 4 gives 1 -> 1 -> 2 -> 3 -> 4 -> 4." },
      { input: "0\n\n3\n1 3 4", output: "1 3 4", explanation: "Merging an empty list with 1 -> 3 -> 4 returns 1 -> 3 -> 4." },
      { input: "2\n1 2\n1\n3", output: "1 2 3", explanation: "Merging 1 -> 2 and 3 gives 1 -> 2 -> 3." },
    ],
    constraints: ["The number of nodes in each list is in the range [0, 50].", "-100 <= Node.val <= 100", "Both l1 and l2 are sorted in non-decreasing order."],
    io: "two-lists",
    testCases: [
      { input: "3\n1 2 4\n3\n1 3 4", expectedOutput: "1 1 2 3 4 4" },
      { input: "0\n\n3\n1 3 4", expectedOutput: "1 3 4" },
      { input: "2\n1 2\n1\n3", expectedOutput: "1 2 3" },
      { input: "0\n\n0\n", expectedOutput: "" },
      { input: "1\n5\n1\n5", expectedOutput: "5 5" },
      { input: "4\n-4 -2 0 2\n4\n-3 -1 1 3", expectedOutput: "-4 -3 -2 -1 0 1 2 3" },
      { input: "5\n1 1 1 1 1\n5\n1 1 1 1 1", expectedOutput: "1 1 1 1 1 1 1 1 1 1" },
      { input: "3\n1 2 3\n0\n", expectedOutput: "1 2 3" },
      { input: "1\n-10\n3\n-5 0 10", expectedOutput: "-10 -5 0 10" },
      { input: "4\n2 4 6 8\n4\n1 3 5 7", expectedOutput: "1 2 3 4 5 6 7 8" },
      { input: "2\n0 0\n2\n0 0", expectedOutput: "0 0 0 0" },
      { input: "6\n1 3 5 7 9 11\n6\n2 4 6 8 10 12", expectedOutput: "1 2 3 4 5 6 7 8 9 10 11 12" },
    ],
  },
  {
    id: "remove-nth-node-from-end",
    "hints": ["Think about how you could locate the node just before the target without knowing the list's length.","Keep a gap of n nodes between two pointers; when the leading pointer hits the end, the trailing pointer is positioned right before the node to remove."],
    returns: "linkedlist",
    title: "Remove Nth Node From End of List",
    difficulty: "medium",
    topic: "linked-list",
    companies: ["Amazon", "Meta", "Google"],
    description: "Given the head of a linked list, remove the nth node from the end of the list and return its head.",
    examples: [
      { input: "5\n1 2 3 4 5\n2", output: "1 2 3 5", explanation: "The 2nd node from the end is 4, removing it gives 1 -> 2 -> 3 -> 5." },
      { input: "1\n1\n1", output: "", explanation: "Removing the only node leaves an empty list." },
      { input: "2\n1 2\n1", output: "1", explanation: "The 1st node from the end is 2, removing it gives 1." },
    ],
    constraints: ["The number of nodes in the list is sz.", "1 <= sz <= 30", "0 <= Node.val <= 100", "1 <= n <= sz"],
    io: "linkedlist-n",
    testCases: [
      { input: "5\n1 2 3 4 5\n2", expectedOutput: "1 2 3 5" },
      { input: "1\n1\n1", expectedOutput: "" },
      { input: "2\n1 2\n1", expectedOutput: "1" },
      { input: "5\n1 2 3 4 5\n5", expectedOutput: "2 3 4 5" },
      { input: "5\n1 2 3 4 5\n1", expectedOutput: "1 2 3 4" },
      { input: "3\n7 8 9\n3", expectedOutput: "8 9" },
      { input: "4\n-1 -2 -3 -4\n2", expectedOutput: "-1 -2 -4" },
      { input: "6\n1 1 2 2 3 3\n4", expectedOutput: "1 1 2 3 3" },
      { input: "2\n5 5\n2", expectedOutput: "5" },
      { input: "7\n10 20 30 40 50 60 70\n3", expectedOutput: "10 20 30 40 60 70" },
      { input: "3\n0 0 0\n2", expectedOutput: "0 0" },
      { input: "10\n1 2 3 4 5 6 7 8 9 10\n7", expectedOutput: "1 2 3 5 6 7 8 9 10" },
    ],
  },
  {
    id: "remove-duplicates-from-sorted-list",
    "hints": ["Because the list is sorted, any duplicates must be sitting next to each other.","Walk the list once and whenever the next node has the same value as the current node, skip the next node by relinking current.next."],
    returns: "linkedlist",
    title: "Remove Duplicates from Sorted List",
    difficulty: "easy",
    topic: "linked-list",
    companies: ["Amazon", "Microsoft"],
    description: "Given the head of a sorted linked list, delete all duplicates such that each element appears only once and return the head.",
    examples: [
      { input: "3\n1 1 2", output: "1 2", explanation: "The duplicate 1 is removed, leaving 1 -> 2." },
      { input: "5\n1 1 2 3 3", output: "1 2 3", explanation: "Duplicates are removed from both ends, giving 1 -> 2 -> 3." },
      { input: "0\n", output: "", explanation: "An empty list has no duplicates to remove." },
    ],
    constraints: ["The number of nodes in the list is in the range [0, 300].", "-100 <= Node.val <= 100", "The list is sorted in non-decreasing order."],
    io: "linkedlist",
    testCases: [
      { input: "3\n1 1 2", expectedOutput: "1 2" },
      { input: "5\n1 1 2 3 3", expectedOutput: "1 2 3" },
      { input: "0\n", expectedOutput: "" },
      { input: "1\n7", expectedOutput: "7" },
      { input: "4\n1 1 1 1", expectedOutput: "1" },
      { input: "5\n-3 -3 -1 0 0", expectedOutput: "-3 -1 0" },
      { input: "6\n1 2 3 4 5 6", expectedOutput: "1 2 3 4 5 6" },
      { input: "7\n0 0 0 1 1 2 2", expectedOutput: "0 1 2" },
      { input: "2\n5 5", expectedOutput: "5" },
      { input: "8\n-5 -5 -4 -4 -3 -3 -2 -2", expectedOutput: "-5 -4 -3 -2" },
      { input: "5\n1 2 2 2 3", expectedOutput: "1 2 3" },
      { input: "3\n-1 0 0", expectedOutput: "-1 0" },
    ],
  },
  {
    id: "palindrome-linked-list",
    "hints": ["Think about how you'd compare the first half of the list with the second half read backwards.","Find the middle with two pointers, reverse the second half in place, then walk both halves in parallel comparing values."],
    returns: "bool",
    title: "Palindrome Linked List",
    difficulty: "easy",
    topic: "linked-list",
    companies: ["Amazon", "Meta", "Microsoft"],
    description: "Given the head of a singly linked list, return true if it is a palindrome and false otherwise.",
    examples: [
      { input: "4\n1 2 2 1", output: "true", explanation: "1 -> 2 -> 2 -> 1 reads the same forward and backward." },
      { input: "2\n1 2", output: "false", explanation: "1 -> 2 does not read the same backward." },
      { input: "1\n5", output: "true", explanation: "A single node is always a palindrome." },
    ],
    constraints: ["The number of nodes in the list is in the range [0, 10^5].", "0 <= Node.val <= 9"],
    io: "linkedlist",
    testCases: [
      { input: "4\n1 2 2 1", expectedOutput: "true" },
      { input: "2\n1 2", expectedOutput: "false" },
      { input: "1\n5", expectedOutput: "true" },
      { input: "0\n", expectedOutput: "true" },
      { input: "5\n1 2 3 2 1", expectedOutput: "true" },
      { input: "3\n1 2 3", expectedOutput: "false" },
      { input: "6\n1 2 3 3 2 1", expectedOutput: "true" },
      { input: "2\n7 7", expectedOutput: "true" },
      { input: "4\n-1 2 -1 2", expectedOutput: "false" },
      { input: "5\n0 0 0 0 0", expectedOutput: "true" },
      { input: "3\n1 0 1", expectedOutput: "true" },
      { input: "4\n1 0 0 1", expectedOutput: "true" },
    ],
  },
  {
    id: "add-two-numbers",
    "hints": ["Treat the lists as digits aligned by place value and simulate grade-school addition, including carries.","Walk both lists simultaneously, add digits plus any carry from the previous step, append digit % 10 to the result and propagate digit // 10 as the next carry."],
    returns: "linkedlist",
    title: "Add Two Numbers",
    difficulty: "medium",
    topic: "linked-list",
    companies: ["Amazon", "Microsoft", "Google", "Adobe"],
    description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list in the same reverse order.",
    examples: [
      { input: "3\n2 4 3\n3\n5 6 4", output: "7 0 8", explanation: "342 + 465 = 807, stored in reverse order as 7 -> 0 -> 8." },
      { input: "1\n0\n1\n0", output: "0", explanation: "0 + 0 = 0." },
      { input: "7\n9 9 9 9 9 9 9\n4\n9 9 9 9", output: "8 9 9 9 0 0 0 1", explanation: "9999999 + 9999 = 10009998, stored as 8 -> 9 -> 9 -> 9 -> 0 -> 0 -> 0 -> 1." },
    ],
    constraints: ["The number of nodes in each linked list is in the range [1, 100].", "0 <= Node.val <= 9", "Each list represents a number without leading zeros."],
    io: "two-lists",
    testCases: [
      { input: "3\n2 4 3\n3\n5 6 4", expectedOutput: "7 0 8" },
      { input: "1\n0\n1\n0", expectedOutput: "0" },
      { input: "7\n9 9 9 9 9 9 9\n4\n9 9 9 9", expectedOutput: "8 9 9 9 0 0 0 1" },
      { input: "1\n5\n1\n5", expectedOutput: "0 1" },
      { input: "3\n1 0 0\n3\n9 9 9", expectedOutput: "0 0 0 1" },
      { input: "2\n9 9\n1\n1", expectedOutput: "0 0 1" },
      { input: "4\n1 2 3 4\n4\n5 6 7 8", expectedOutput: "6 8 0 3 1" },
      { input: "5\n0 0 0 0 1\n5\n0 0 0 0 9", expectedOutput: "0 0 0 0 0 1" },
      { input: "3\n5 5 5\n3\n5 5 5", expectedOutput: "0 1 1 1" },
      { input: "2\n1 8\n2\n0 2", expectedOutput: "1 0 1" },
      { input: "6\n9 9 9 9 9 9\n6\n1 0 0 0 0 0", expectedOutput: "0 0 0 0 0 0 1" },
      { input: "4\n2 4 9\n3\n5 6 4", expectedOutput: "7 0 4 1" },
    ],
  },
  {
    id: "remove-linked-list-elements",
    "hints": ["Removing nodes from the front is the tricky part because there's no previous node to relink.","Use a dummy head so every removal is handled uniformly, then skip over any node whose value equals val."],
    returns: "linkedlist",
    title: "Remove Linked List Elements",
    difficulty: "easy",
    topic: "linked-list",
    companies: ["Amazon", "Microsoft"],
    description: "Given the head of a linked list and an integer val, remove all the nodes of the linked list that have Node.val equal to val, and return the new head.",
    examples: [
      { input: "7\n1 2 6 3 4 5 6\n6", output: "1 2 3 4 5", explanation: "All nodes with value 6 are removed, leaving 1 -> 2 -> 3 -> 4 -> 5." },
      { input: "0\n\n6", output: "", explanation: "Removing from an empty list gives an empty list." },
      { input: "4\n7 7 7 7\n7", output: "", explanation: "Every node has value 7, so the result is empty." },
    ],
    constraints: ["The number of nodes in the list is in the range [0, 10^4].", "1 <= Node.val <= 50", "0 <= val <= 50"],
    io: "linkedlist-x",
    testCases: [
      { input: "7\n1 2 6 3 4 5 6\n6", expectedOutput: "1 2 3 4 5" },
      { input: "0\n\n6", expectedOutput: "" },
      { input: "4\n7 7 7 7\n7", expectedOutput: "" },
      { input: "3\n1 2 3\n4", expectedOutput: "1 2 3" },
      { input: "1\n5\n5", expectedOutput: "" },
      { input: "1\n5\n3", expectedOutput: "5" },
      { input: "5\n1 1 1 2 1\n1", expectedOutput: "2" },
      { input: "6\n-1 -2 -1 -3 -1 -4\n-1", expectedOutput: "-2 -3 -4" },
      { input: "5\n0 0 1 0 2\n0", expectedOutput: "1 2" },
      { input: "8\n3 3 1 3 2 3 4 3\n3", expectedOutput: "1 2 4" },
      { input: "2\n6 1\n6", expectedOutput: "1" },
      { input: "2\n1 6\n6", expectedOutput: "1" },
    ],
  },
  {
    id: "swap-nodes-in-pairs",
    "hints": ["Focus on swapping pointers rather than values, and work out the new links for a pair of nodes on paper first.","Process the list two nodes at a time, keeping a reference to the previous pair's tail so you can stitch the pairs back together correctly."],
    returns: "linkedlist",
    title: "Swap Nodes in Pairs",
    difficulty: "medium",
    topic: "linked-list",
    companies: ["Amazon", "Microsoft", "Meta"],
    description: "Given a linked list, swap every two adjacent nodes and return its head. You must solve the problem by modifying the nodes themselves, without changing their values.",
    examples: [
      { input: "4\n1 2 3 4", output: "2 1 4 3", explanation: "Pairs (1,2) and (3,4) are swapped, giving 2 -> 1 -> 4 -> 3." },
      { input: "0\n", output: "", explanation: "An empty list stays empty." },
      { input: "1\n5", output: "5", explanation: "A single node has no pair to swap." },
    ],
    constraints: ["The number of nodes in the list is in the range [0, 100].", "0 <= Node.val <= 100"],
    io: "linkedlist",
    testCases: [
      { input: "4\n1 2 3 4", expectedOutput: "2 1 4 3" },
      { input: "0\n", expectedOutput: "" },
      { input: "1\n5", expectedOutput: "5" },
      { input: "2\n1 2", expectedOutput: "2 1" },
      { input: "3\n1 2 3", expectedOutput: "2 1 3" },
      { input: "5\n7 8 9 10 11", expectedOutput: "8 7 10 9 11" },
      { input: "6\n-1 -2 -3 -4 -5 -6", expectedOutput: "-2 -1 -4 -3 -6 -5" },
      { input: "4\n1 1 1 1", expectedOutput: "1 1 1 1" },
      { input: "7\n1 2 3 4 5 6 7", expectedOutput: "2 1 4 3 6 5 7" },
      { input: "2\n0 0", expectedOutput: "0 0" },
      { input: "8\n10 20 30 40 50 60 70 80", expectedOutput: "20 10 40 30 60 50 80 70" },
      { input: "3\n-5 5 -5", expectedOutput: "5 -5 -5" },
    ],
  },
  {
    id: "odd-even-linked-list",
    "hints": ["Think of splitting the list into two separate chains as you walk it once.","Maintain odd-head/odd-tail and even-head/even-tail pointers, append each node to its group's tail, then link the odd tail to the even head."],
    returns: "linkedlist",
    title: "Odd Even Linked List",
    difficulty: "medium",
    topic: "linked-list",
    companies: ["Amazon", "Microsoft"],
    description: "Given the head of a singly linked list, group all the nodes with odd indices together followed by the nodes with even indices, and return the reordered list. The relative order inside both the odd and even groups must stay the same as in the input.",
    examples: [
      { input: "5\n1 2 3 4 5", output: "1 3 5 2 4", explanation: "Odd-positioned nodes 1, 3, 5 come first, then even-positioned 2, 4." },
      { input: "6\n2 1 3 5 6 4", output: "2 3 6 1 5 4", explanation: "Odd positions give 2, 3, 6 and even positions give 1, 5, 4." },
      { input: "0\n", output: "", explanation: "An empty list stays empty." },
    ],
    constraints: ["The number of nodes in the list is in the range [0, 10^4].", "-10^6 <= Node.val <= 10^6"],
    io: "linkedlist",
    testCases: [
      { input: "5\n1 2 3 4 5", expectedOutput: "1 3 5 2 4" },
      { input: "6\n2 1 3 5 6 4", expectedOutput: "2 3 6 1 5 4" },
      { input: "0\n", expectedOutput: "" },
      { input: "1\n9", expectedOutput: "9" },
      { input: "2\n1 2", expectedOutput: "1 2" },
      { input: "3\n1 2 3", expectedOutput: "1 3 2" },
      { input: "4\n1 2 3 4", expectedOutput: "1 3 2 4" },
      { input: "7\n1 2 3 4 5 6 7", expectedOutput: "1 3 5 7 2 4 6" },
      { input: "5\n-1 -2 -3 -4 -5", expectedOutput: "-1 -3 -5 -2 -4" },
      { input: "6\n1 1 1 1 1 1", expectedOutput: "1 1 1 1 1 1" },
      { input: "4\n0 1 0 1", expectedOutput: "0 0 1 1" },
      { input: "8\n8 7 6 5 4 3 2 1", expectedOutput: "8 6 4 2 7 5 3 1" },
    ],
  },
  {
    id: "rotate-list",
    "hints": ["Rotating right by k is really about finding the new tail and new head positions.","Reduce k modulo the list length, then connect the tail to the head to form a ring and break it at the new tail, which sits at position (length - k)."],
    returns: "linkedlist",
    title: "Rotate List",
    difficulty: "medium",
    topic: "linked-list",
    companies: ["Amazon", "Microsoft", "Adobe"],
    description: "Given the head of a linked list, rotate the list to the right by k places and return the new head.",
    examples: [
      { input: "5\n1 2 3 4 5\n2", output: "4 5 1 2 3", explanation: "Rotating right by 2 moves the last two nodes to the front: 4 -> 5 -> 1 -> 2 -> 3." },
      { input: "3\n0 1 2\n4", output: "2 0 1", explanation: "Rotating by 4 is the same as rotating by 1, giving 2 -> 0 -> 1." },
      { input: "0\n\n3", output: "", explanation: "Rotating an empty list gives an empty list." },
    ],
    constraints: ["The number of nodes in the list is in the range [0, 500].", "-100 <= Node.val <= 100", "0 <= k <= 2 * 10^9"],
    io: "linkedlist-n",
    testCases: [
      { input: "5\n1 2 3 4 5\n2", expectedOutput: "4 5 1 2 3" },
      { input: "3\n0 1 2\n4", expectedOutput: "2 0 1" },
      { input: "0\n\n3", expectedOutput: "" },
      { input: "1\n7\n100", expectedOutput: "7" },
      { input: "4\n1 2 3 4\n0", expectedOutput: "1 2 3 4" },
      { input: "4\n1 2 3 4\n4", expectedOutput: "1 2 3 4" },
      { input: "4\n1 2 3 4\n5", expectedOutput: "4 1 2 3" },
      { input: "6\n1 2 3 4 5 6\n10", expectedOutput: "3 4 5 6 1 2" },
      { input: "2\n-1 -2\n1", expectedOutput: "-2 -1" },
      { input: "5\n1 1 2 2 3\n3", expectedOutput: "2 2 3 1 1" },
      { input: "7\n10 20 30 40 50 60 70\n7", expectedOutput: "10 20 30 40 50 60 70" },
      { input: "3\n5 6 7\n1", expectedOutput: "7 5 6" },
    ],
  },
  {
    id: "delete-middle-node",
    "hints": ["Deleting the middle node means you actually need the node right before it.","Use slow and fast pointers with the slow pointer starting one step behind (track its previous node), then bypass the middle node when the fast pointer reaches the end."],
    returns: "linkedlist",
    title: "Delete the Middle Node of a Linked List",
    difficulty: "medium",
    topic: "linked-list",
    companies: ["Amazon", "Google", "Microsoft"],
    description: "You are given the head of a linked list. Delete the middle node and return the head of the modified linked list. For an even length list, delete the second middle node. If the list has only one node, return an empty list.",
    examples: [
      { input: "7\n1 3 4 7 1 2 6", output: "1 3 4 1 2 6", explanation: "The middle node with value 7 is deleted, giving 1 -> 3 -> 4 -> 1 -> 2 -> 6." },
      { input: "4\n1 2 3 4", output: "1 2 4", explanation: "For an even length list the second middle (3) is deleted, giving 1 -> 2 -> 4." },
      { input: "2\n2 1", output: "2", explanation: "Deleting the middle of a two node list leaves 2." },
    ],
    constraints: ["The number of nodes in the list is in the range [1, 10^5].", "1 <= Node.val <= 10^5"],
    io: "linkedlist",
    testCases: [
      { input: "7\n1 3 4 7 1 2 6", expectedOutput: "1 3 4 1 2 6" },
      { input: "4\n1 2 3 4", expectedOutput: "1 2 4" },
      { input: "2\n2 1", expectedOutput: "2" },
      { input: "1\n5", expectedOutput: "" },
      { input: "3\n1 2 3", expectedOutput: "1 3" },
      { input: "6\n10 20 30 40 50 60", expectedOutput: "10 20 30 50 60" },
      { input: "5\n-1 -2 -3 -4 -5", expectedOutput: "-1 -2 -4 -5" },
      { input: "4\n1 1 1 1", expectedOutput: "1 1 1" },
      { input: "8\n1 2 3 4 5 6 7 8", expectedOutput: "1 2 3 4 6 7 8" },
      { input: "2\n0 0", expectedOutput: "0" },
      { input: "9\n9 8 7 6 5 4 3 2 1", expectedOutput: "9 8 7 6 4 3 2 1" },
      { input: "3\n100 200 300", expectedOutput: "100 300" },
    ],
  },
{
    id: "valid-parentheses",
    "hints": ["An opening bracket must be closed by the same type and in the reverse order of opening.","Push opening brackets onto a stack and pop on each closing bracket, checking the popped bracket matches the closing type."],
    returns: "bool",
    title: "Valid Parentheses",
    difficulty: "easy",
    topic: "stack",
    companies: ["Amazon", "Microsoft", "Google", "Meta"],
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets, and open brackets are closed in the correct order.",
    examples: [
      { input: "()", output: "true", explanation: "The single pair of parentheses is properly opened and closed." },
      { input: "()[]{}", output: "true", explanation: "Each type of bracket forms a valid pair in the correct order." },
      { input: "([)]", output: "false", explanation: "The brackets interleave: '(' is closed after '[', which breaks the correct order." },
    ],
    constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only: '()[]{}'."],
    io: "string",
    testCases: [
      { input: "()", expectedOutput: "true" },
      { input: "()[]{}", expectedOutput: "true" },
      { input: "([)]", expectedOutput: "false" },
      { input: "{[]}", expectedOutput: "true" },
      { input: "]", expectedOutput: "false" },
      { input: "(", expectedOutput: "false" },
      { input: "((((((", expectedOutput: "false" },
      { input: "}}}", expectedOutput: "false" },
      { input: "([{}])", expectedOutput: "true" },
      { input: "((()))", expectedOutput: "true" },
      { input: "([)]{}", expectedOutput: "false" },
      { input: "()()()()()()()()()()", expectedOutput: "true" },
    ],
  },
  {
    id: "baseball-game",
    "hints": ["Each operation either adds a score, derives one from previous scores, or removes the last score.","Use a stack to maintain the record; for '+' sum the top two, for 'D' double the top, for 'C' pop, then sum everything."],
    returns: "int",
    title: "Baseball Game",
    difficulty: "easy",
    topic: "stack",
    companies: ["Amazon"],
    description: "You are keeping score for a baseball game with strange rules. You are given a list of strings ops, where each string is one of: an integer x meaning record a new score of x, '+' meaning record the sum of the previous two scores, 'D' meaning record double the previous score, or 'C' meaning invalidate the previous score. Return the sum of all the scores on the record after applying all operations.",
    examples: [
      { input: "5\n5\n2\nC\nD\n+", output: "30", explanation: "Record 5 and 2, invalidate 2, record 10 (double of 5), record 15 (5 + 10). The sum is 5 + 10 + 15 = 30." },
      { input: "8\n5\n-2\n4\nC\nD\n9\n+\n+", output: "27", explanation: "Record 5 and -2, record 4 then invalidate it, record -4 (double of -2), record 9, then 5 (-4 + 9), then 14 (9 + 5). The sum is 5 + (-2) + (-4) + 9 + 5 + 14 = 27." },
      { input: "1\n1", output: "1", explanation: "A single score of 1 gives a total of 1." },
    ],
    constraints: ["1 <= ops.length <= 1000", "ops[i] is \"C\", \"D\", \"+\", or a string representing an integer in the range [-3 * 10^4, 3 * 10^4].", "For \"+\", there will always be at least two previous scores on the record.", "For \"C\" and \"D\", there will always be at least one previous score on the record."],
    io: "string-array",
    testCases: [
      { input: "5\n5\n2\nC\nD\n+", expectedOutput: "30" },
      { input: "8\n5\n-2\n4\nC\nD\n9\n+\n+", expectedOutput: "27" },
      { input: "1\n1", expectedOutput: "1" },
      { input: "2\n1\nC", expectedOutput: "0" },
      { input: "3\n-5\n-2\n-3", expectedOutput: "-10" },
      { input: "4\n10\nD\nD\n+", expectedOutput: "130" },
      { input: "3\n1\n2\n+", expectedOutput: "6" },
      { input: "3\n5\n6\nD", expectedOutput: "23" },
      { input: "5\n1\n2\n3\n+\nD", expectedOutput: "21" },
      { input: "6\n-1\n-1\n+\nD\nC\n+", expectedOutput: "-7" },
      { input: "2\n0\nD", expectedOutput: "0" },
      { input: "7\n100\nD\n+\nC\n+\nD\n+", expectedOutput: "2100" },
    ],
  },
  {
    id: "remove-all-adjacent-duplicates",
    "hints": ["Removing a pair can create a new adjacent pair, so you need to recheck after each removal.","Process characters with a stack: push a character if it differs from the top, otherwise pop; the stack naturally handles cascading removals."],
    returns: "string",
    title: "Remove All Adjacent Duplicates In String",
    difficulty: "easy",
    topic: "stack",
    companies: ["Amazon", "Google"],
    description: "You are given a string s consisting of lowercase English letters. A duplicate removal consists of choosing two adjacent and equal letters and removing them. Repeatedly remove adjacent duplicates from s until no more removals are possible, and return the final string.",
    examples: [
      { input: "abbaca", output: "ca", explanation: "Remove 'bb' to get 'aaca', then remove 'aa' to get 'ca'." },
      { input: "azxxzy", output: "ay", explanation: "Remove 'xx' to get 'azzy', then remove 'zz' to get 'ay'." },
      { input: "aaaaaaaa", output: "", explanation: "The characters cancel out in pairs until nothing remains." },
    ],
    constraints: ["1 <= s.length <= 10^5", "s consists of lowercase English letters."],
    io: "string",
    testCases: [
      { input: "abbaca", expectedOutput: "ca" },
      { input: "azxxzy", expectedOutput: "ay" },
      { input: "aaaaaaaa", expectedOutput: "" },
      { input: "a", expectedOutput: "a" },
      { input: "aa", expectedOutput: "" },
      { input: "ab", expectedOutput: "ab" },
      { input: "abcddcba", expectedOutput: "" },
      { input: "abccba", expectedOutput: "" },
      { input: "aabbaa", expectedOutput: "" },
      { input: "abbba", expectedOutput: "aba" },
      { input: "aabbcc", expectedOutput: "" },
      { input: "ca", expectedOutput: "ca" },
    ],
  },
  {
    id: "backspace-string-compare",
    "hints": ["A '#' deletes the previous surviving character, so think about processing each string into its final form.","Build each string with a stack where '#' pops the top character, then compare the two resulting strings."],
    returns: "bool",
    title: "Backspace String Compare",
    difficulty: "easy",
    topic: "stack",
    companies: ["Google", "Amazon"],
    description: "Given two strings s and t, return true if they are equal when both are typed into empty text editors. The character '#' represents a backspace, which deletes the previous character.",
    examples: [
      { input: "ab#c\nad#c", output: "true", explanation: "Both strings become 'ac' after applying the backspaces." },
      { input: "ab##\nc#d#", output: "true", explanation: "Both strings become empty after applying the backspaces." },
      { input: "a#c\nb", output: "false", explanation: "The first string becomes 'c' but the second string is 'b'." },
    ],
    constraints: ["1 <= s.length, t.length <= 200", "s and t only contain lowercase letters and '#' characters."],
    io: "two-strings",
    testCases: [
      { input: "ab#c\nad#c", expectedOutput: "true" },
      { input: "ab##\nc#d#", expectedOutput: "true" },
      { input: "a#c\nb", expectedOutput: "false" },
      { input: "a##c\n#c", expectedOutput: "true" },
      { input: "###\n##", expectedOutput: "true" },
      { input: "abc####d\nd", expectedOutput: "true" },
      { input: "bxj##tw\nbxo#j##tw", expectedOutput: "true" },
      { input: "ab##c\nd", expectedOutput: "false" },
      { input: "xy#z\nxzz#", expectedOutput: "true" },
      { input: "a###b\nb", expectedOutput: "true" },
      { input: "nzp#o#g\nb#nzp#o#g", expectedOutput: "true" },
      { input: "abc#d\nefg#d", expectedOutput: "false" },
    ],
  },
  {
    id: "next-greater-element-single",
    "hints": ["For each element you need the first strictly greater element to its right.","Scan from right to left maintaining a monotonic decreasing stack; pop smaller elements until the top is greater or the stack is empty."],
    returns: "intArr",
    title: "Next Greater Element",
    difficulty: "easy",
    topic: "stack",
    companies: ["Amazon", "Microsoft"],
    description: "Given an array nums, for each element find the first element to its right that is strictly greater than it. If no such element exists, use -1 for that position. Return the resulting array.",
    examples: [
      { input: "4\n4 5 2 25", output: "5 25 25 -1", explanation: "4 -> 5, 5 -> 25, 2 -> 25, and 25 has no greater element to its right." },
      { input: "4\n13 7 6 12", output: "-1 12 12 -1", explanation: "13 has no greater element, 7 -> 12, 6 -> 12, 12 -> -1." },
      { input: "1\n5", output: "-1", explanation: "A single element has nothing to its right." },
    ],
    constraints: ["1 <= nums.length <= 10^4", "-10^4 <= nums[i] <= 10^4"],
    io: "array",
    testCases: [
      { input: "4\n4 5 2 25", expectedOutput: "5 25 25 -1" },
      { input: "4\n13 7 6 12", expectedOutput: "-1 12 12 -1" },
      { input: "1\n5", expectedOutput: "-1" },
      { input: "5\n1 2 3 4 5", expectedOutput: "2 3 4 5 -1" },
      { input: "5\n5 4 3 2 1", expectedOutput: "-1 -1 -1 -1 -1" },
      { input: "6\n2 1 2 4 3 1", expectedOutput: "4 2 4 -1 -1 -1" },
      { input: "3\n3 3 3", expectedOutput: "-1 -1 -1" },
      { input: "5\n6 8 0 1 3", expectedOutput: "8 -1 1 3 -1" },
      { input: "2\n-1 -2", expectedOutput: "-1 -1" },
      { input: "3\n-2 -1 0", expectedOutput: "-1 0 -1" },
      { input: "7\n11 13 21 3 3 3 3", expectedOutput: "13 21 -1 -1 -1 -1 -1" },
      { input: "4\n1 3 2 4", expectedOutput: "3 4 4 -1" },
    ],
  },
  {
    id: "daily-temperatures",
    "hints": ["For each day you need how far ahead the next warmer day is, which is a next-greater-element variant.","Use a monotonic decreasing stack of indices; when a warmer temperature arrives, pop indices and record the distance between them."],
    returns: "intArr",
    title: "Daily Temperatures",
    difficulty: "medium",
    topic: "stack",
    companies: ["Amazon", "Google"],
    description: "Given an array of integers temperatures representing daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. If there is no future day with a warmer temperature, use 0.",
    examples: [
      { input: "8\n73 74 75 71 69 72 76 73", output: "1 1 4 2 1 1 0 0", explanation: "Day 0 waits 1 day for 74, day 2 waits 4 days for 76, and the last two days never see a warmer temperature." },
      { input: "4\n30 40 50 60", output: "1 1 1 0", explanation: "Each day is followed by a warmer day except the last one." },
      { input: "3\n30 60 90", output: "1 1 0", explanation: "Day 0 waits 1 day for 60, day 1 waits 1 day for 90." },
    ],
    constraints: ["1 <= temperatures.length <= 10^5", "30 <= temperatures[i] <= 100"],
    io: "array",
    testCases: [
      { input: "8\n73 74 75 71 69 72 76 73", expectedOutput: "1 1 4 2 1 1 0 0" },
      { input: "4\n30 40 50 60", expectedOutput: "1 1 1 0" },
      { input: "3\n30 60 90", expectedOutput: "1 1 0" },
      { input: "1\n100", expectedOutput: "0" },
      { input: "5\n90 80 70 60 50", expectedOutput: "0 0 0 0 0" },
      { input: "5\n50 60 70 80 90", expectedOutput: "1 1 1 1 0" },
      { input: "3\n70 70 70", expectedOutput: "0 0 0" },
      { input: "2\n100 50", expectedOutput: "0 0" },
      { input: "2\n50 100", expectedOutput: "1 0" },
      { input: "7\n55 54 53 52 51 50 60", expectedOutput: "6 5 4 3 2 1 0" },
      { input: "6\n30 30 31 30 32 30", expectedOutput: "2 1 2 1 0 0" },
      { input: "9\n89 62 70 58 47 47 46 76 100", expectedOutput: "8 1 5 4 3 2 1 1 0" },
    ],
  },
  {
    id: "evaluate-reverse-polish-notation",
    "hints": ["In postfix notation, when you see an operator, its operands are the most recently seen numbers.","Push numbers onto a stack; on an operator, pop the top two operands (right operand first), apply the operator, and push the result back."],
    returns: "int",
    title: "Evaluate Reverse Polish Notation",
    difficulty: "medium",
    topic: "stack",
    companies: ["Amazon", "Microsoft"],
    description: "You are given an array of strings tokens that represents an arithmetic expression in Reverse Polish Notation. Evaluate the expression and return the result as an integer. The valid operators are '+', '-', '*' and '/'. Division between two integers truncates toward zero.",
    examples: [
      { input: "3\n2\n1\n+", output: "3", explanation: "2 + 1 = 3." },
      { input: "5\n4\n13\n5\n/\n+", output: "6", explanation: "13 / 5 = 2 after truncation toward zero, then 4 + 2 = 6." },
      { input: "13\n10\n6\n9\n3\n+\n-11\n*\n/\n*\n17\n+\n5\n+", output: "22", explanation: "The full expression evaluates to 22." },
    ],
    constraints: ["1 <= tokens.length <= 10^4", "tokens[i] is either an operator (\"+\", \"-\", \"*\" or \"/\") or an integer in the range [-200, 200]."],
    io: "string-array",
    testCases: [
      { input: "3\n2\n1\n+", expectedOutput: "3" },
      { input: "5\n4\n13\n5\n/\n+", expectedOutput: "6" },
      { input: "13\n10\n6\n9\n3\n+\n-11\n*\n/\n*\n17\n+\n5\n+", expectedOutput: "22" },
      { input: "3\n4\n-2\n/", expectedOutput: "-2" },
      { input: "3\n-4\n2\n/", expectedOutput: "-2" },
      { input: "3\n7\n-3\n/", expectedOutput: "-2" },
      { input: "3\n-7\n3\n/", expectedOutput: "-2" },
      { input: "3\n5\n3\n-", expectedOutput: "2" },
      { input: "3\n5\n3\n*", expectedOutput: "15" },
      { input: "1\n18", expectedOutput: "18" },
      { input: "5\n2\n3\n+\n4\n*", expectedOutput: "20" },
      { input: "7\n4\n3\n-\n2\n/\n5\n+", expectedOutput: "5" },
    ],
  },
  {
    id: "asteroid-collision",
    "hints": ["Only a right-moving asteroid followed by a left-moving one can collide, so direction matters.","Use a stack for right-moving asteroids; for each left-moving asteroid, resolve collisions by comparing sizes and popping smaller ones until it explodes or survives."],
    returns: "intArr",
    title: "Asteroid Collision",
    difficulty: "medium",
    topic: "stack",
    companies: ["Amazon", "Google"],
    description: "You are given an array asteroids of integers representing asteroids in a row. The absolute value of each asteroid is its size and its sign is its direction: positive moves right, negative moves left. When two asteroids moving toward each other collide, the smaller one explodes; if they are the same size, both explode. Asteroids moving in the same direction never meet. Return the state of the asteroids after all collisions.",
    examples: [
      { input: "3\n5 10 -5", output: "5 10", explanation: "10 and -5 collide and 10 survives; 5 never meets -5." },
      { input: "2\n8 -8", output: "", explanation: "Both asteroids are the same size and explode." },
      { input: "3\n10 2 -5", output: "10", explanation: "2 and -5 collide and -5 survives; then 10 and -5 collide and 10 survives." },
    ],
    constraints: ["1 <= asteroids.length <= 10^4", "-1000 <= asteroids[i] <= 1000", "asteroids[i] != 0"],
    io: "array",
    testCases: [
      { input: "3\n5 10 -5", expectedOutput: "5 10" },
      { input: "2\n8 -8", expectedOutput: "" },
      { input: "3\n10 2 -5", expectedOutput: "10" },
      { input: "2\n-2 -1", expectedOutput: "-2 -1" },
      { input: "2\n-2 1", expectedOutput: "-2 1" },
      { input: "4\n-2 -1 1 2", expectedOutput: "-2 -1 1 2" },
      { input: "4\n1 -2 -2 -2", expectedOutput: "-2 -2 -2" },
      { input: "4\n10 -10 10 -10", expectedOutput: "" },
      { input: "3\n1 2 -3", expectedOutput: "-3" },
      { input: "4\n3 5 -6 2", expectedOutput: "-6 2" },
      { input: "1\n5", expectedOutput: "5" },
      { input: "1\n-5", expectedOutput: "-5" },
    ],
  },
  {
    id: "decode-string",
    "hints": ["The nesting means the innermost bracketed part must be decoded first.","Use two stacks (counts and partial results); on '[', push the current state, and on ']', pop and repeat the decoded segment."],
    returns: "string",
    title: "Decode String",
    difficulty: "medium",
    topic: "stack",
    companies: ["Google", "Amazon", "Microsoft"],
    description: "Given an encoded string, return its decoded string. The encoding rule is k[encoded_string], where the encoded_string inside the square brackets is repeated exactly k times. You may assume the input is always valid and contains only lowercase letters, digits and square brackets.",
    examples: [
      { input: "3[a2[c]]", output: "accaccacc", explanation: "The inner '2[c]' becomes 'cc', then '3[acc]' becomes 'accaccacc'." },
      { input: "3[a]2[bc]", output: "aaabcbc", explanation: "Each block is expanded and concatenated." },
      { input: "2[abc]3[cd]ef", output: "abcabccdcdcdef", explanation: "The trailing 'ef' is appended as is." },
    ],
    constraints: ["1 <= s.length <= 30", "s consists of lowercase English letters, digits and square brackets '[]'.", "1 <= k <= 100", "The test cases are generated so that the output fits in memory."],
    io: "string",
    testCases: [
      { input: "3[a2[c]]", expectedOutput: "accaccacc" },
      { input: "3[a]2[bc]", expectedOutput: "aaabcbc" },
      { input: "2[abc]3[cd]ef", expectedOutput: "abcabccdcdcdef" },
      { input: "abc", expectedOutput: "abc" },
      { input: "10[a]", expectedOutput: "aaaaaaaaaa" },
      { input: "3[z]2[2[y]pq4[2[jk]e1[f]]]ef", expectedOutput: "zzzyypqjkjkefjkjkefjkjkefjkjkefyypqjkjkefjkjkefjkjkefef" },
      { input: "2[ab]", expectedOutput: "abab" },
      { input: "100[leetcode]", expectedOutput: "leetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcodeleetcode" },
      { input: "a", expectedOutput: "a" },
      { input: "3[b2[ca]]", expectedOutput: "bcacabcacabcaca" },
      { input: "2[a2[b2[c]]]", expectedOutput: "abccbccabccbcc" },
      { input: "1[2[3[4[x]]]]", expectedOutput: "xxxxxxxxxxxxxxxxxxxxxxxx" },
    ],
  },
  {
    id: "simplify-path",
    "hints": ["Think of the path as a sequence of directory operations where '..' cancels the previous directory.","Split the path by '/', push real directory names onto a stack, pop on '..', ignore '.' and empty parts, then join with '/'."],
    returns: "string",
    title: "Simplify Path",
    difficulty: "medium",
    topic: "stack",
    companies: ["Amazon", "Microsoft", "Meta"],
    description: "Given an absolute Unix-style file path, return its canonical form. A single period '.' means the current directory, a double period '..' means the parent directory, and multiple consecutive slashes are treated as one. The canonical path must start with '/', have no trailing slash, and contain only single slashes between directories.",
    examples: [
      { input: "/home/", output: "/home", explanation: "The trailing slash is removed." },
      { input: "/../", output: "/", explanation: "Going above the root stays at the root." },
      { input: "/home//foo/", output: "/home/foo", explanation: "Multiple consecutive slashes collapse into one." },
    ],
    constraints: ["1 <= path.length <= 3000", "path consists of English letters, digits, '.', '/' and '_'.", "path is a valid absolute Unix path."],
    io: "string",
    testCases: [
      { input: "/home/", expectedOutput: "/home" },
      { input: "/../", expectedOutput: "/" },
      { input: "/home//foo/", expectedOutput: "/home/foo" },
      { input: "/a/./b/../../c/", expectedOutput: "/c" },
      { input: "/.../a/../b/c/../d/./", expectedOutput: "/.../b/d" },
      { input: "/", expectedOutput: "/" },
      { input: "/a/../../b/../c//.//", expectedOutput: "/c" },
      { input: "/a//b////c/d//././/..", expectedOutput: "/a/b/c" },
      { input: "/hello../world", expectedOutput: "/hello../world" },
      { input: "/a/b/c/../../../..", expectedOutput: "/" },
      { input: "/././.", expectedOutput: "/" },
      { input: "/abc/.../def", expectedOutput: "/abc/.../def" },
    ],
  },
{
    id: "first-unique-character",
    "hints": ["Think about which characters appear exactly once and where the earliest such character sits.","Count character frequencies in one pass, then scan the string a second time and return the index of the first character with count 1."],
    returns: "int",
    title: "First Unique Character in a String",
    difficulty: "easy",
    topic: "queue",
    companies: ["Amazon", "Microsoft", "Adobe"],
    description: "Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1.",
    examples: [
      { input: "s = \"leetcode\"", output: "0", explanation: "The character 'l' appears only once and is the first such character, at index 0." },
      { input: "s = \"loveleetcode\"", output: "2", explanation: "The characters 'l', 'o' and 'e' repeat. The first non-repeating character is 'v' at index 2." },
      { input: "s = \"aabb\"", output: "-1", explanation: "Every character repeats, so there is no unique character." }
    ],
    constraints: ["1 <= s.length <= 10^5", "s consists of only lowercase English letters."],
    io: "string",
    testCases: [
      { input: "leetcode", expectedOutput: "0" },
      { input: "loveleetcode", expectedOutput: "2" },
      { input: "aabb", expectedOutput: "-1" },
      { input: "z", expectedOutput: "0" },
      { input: "aadadaad", expectedOutput: "-1" },
      { input: "dddccdbba", expectedOutput: "8" },
      { input: "abacabad", expectedOutput: "3" },
      { input: "aabbc", expectedOutput: "4" },
      { input: "abcabcab", expectedOutput: "-1" },
      { input: "swiss", expectedOutput: "1" },
      { input: "aabbccddeeffg", expectedOutput: "12" },
      { input: "stress", expectedOutput: "1" }
    ]
  },
  {
    id: "sliding-window-maximum",
    "hints": ["A brute-force scan of each window is too slow; you need the maximum of each window without rescanning.","Use a monotonic decreasing deque of indices: drop indices outside the window from the front and smaller elements from the back, so the front always holds the window's maximum."],
    returns: "intArr",
    title: "Sliding Window Maximum",
    difficulty: "hard",
    topic: "queue",
    companies: ["Amazon", "Google", "Microsoft"],
    description: "You are given an array of integers nums and an integer k. There is a sliding window of size k which moves from the very left of the array to the very right. Return the maximum value in each window as an array, from left to right.",
    examples: [
      { input: "nums = [1,3,-1,-3,5,3,6,7], k = 3", output: "3 3 5 5 6 7", explanation: "The windows are [1,3,-1], [3,-1,-3], [-1,-3,5], [-3,5,3], [5,3,6], [3,6,7] and their maximums are 3, 3, 5, 5, 6, 7." },
      { input: "nums = [1], k = 1", output: "1", explanation: "There is only one window and its maximum is 1." },
      { input: "nums = [9,8,7,6,5], k = 2", output: "9 8 7 6", explanation: "The windows are [9,8], [8,7], [7,6], [6,5] with maximums 9, 8, 7, 6." }
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4", "1 <= k <= nums.length"],
    io: "array-k",
    testCases: [
      { input: "8\n1 3 -1 -3 5 3 6 7\n3", expectedOutput: "3 3 5 5 6 7" },
      { input: "1\n1\n1", expectedOutput: "1" },
      { input: "5\n9 8 7 6 5\n2", expectedOutput: "9 8 7 6" },
      { input: "5\n1 2 3 4 5\n5", expectedOutput: "5" },
      { input: "6\n4 4 4 4 4 4\n3", expectedOutput: "4 4 4 4" },
      { input: "7\n1 -1 2 -2 3 -3 4\n4", expectedOutput: "2 3 3 4" },
      { input: "4\n7 2 5 1\n1", expectedOutput: "7 2 5 1" },
      { input: "6\n-5 -2 -8 -1 -9 -3\n2", expectedOutput: "-2 -2 -1 -1 -3" },
      { input: "9\n3 1 2 5 4 6 7 8 9\n3", expectedOutput: "3 5 5 6 7 8 9" },
      { input: "3\n5 5 5\n3", expectedOutput: "5" },
      { input: "10\n2 1 2 3 1 2 4 3 2 1\n4", expectedOutput: "3 3 3 4 4 4 4" },
      { input: "6\n10 9 8 7 6 5\n4", expectedOutput: "10 9 8" }
    ]
  },
  {
    id: "time-needed-to-buy-tickets",
    "hints": ["You don't need to simulate the queue; think about how many tickets each person buys before person k finishes.","Each person in front of or at k buys min(tickets[i], tickets[k]) tickets, and each person behind k buys min(tickets[i], tickets[k] - 1) tickets."],
    returns: "int",
    title: "Time Needed to Buy Tickets",
    difficulty: "easy",
    topic: "queue",
    companies: ["Amazon", "Microsoft"],
    description: "There are n people in a line queuing to buy tickets, where the ith person wants to buy tickets[i] tickets. Each person takes exactly 1 second to buy one ticket, then goes to the end of the line if they still need more tickets. Given the array tickets and an integer k for the 0-indexed position of the person you care about, return the number of seconds until that person finishes buying all their tickets.",
    examples: [
      { input: "tickets = [2,3,2], k = 2", output: "6", explanation: "The person at position 2 buys a ticket at second 3, waits through the line, then buys their last ticket at second 6 and leaves." },
      { input: "tickets = [5,1,1,1], k = 0", output: "8", explanation: "The person at position 0 needs 5 tickets and finishes buying them at second 8." },
      { input: "tickets = [1,1], k = 1", output: "2", explanation: "Each person buys exactly one ticket, so the person at position 1 finishes at second 2." }
    ],
    constraints: ["1 <= tickets.length <= 100", "1 <= tickets[i] <= 100", "0 <= k < tickets.length"],
    io: "array-k",
    testCases: [
      { input: "3\n2 3 2\n2", expectedOutput: "6" },
      { input: "4\n5 1 1 1\n0", expectedOutput: "8" },
      { input: "2\n1 1\n1", expectedOutput: "2" },
      { input: "1\n10\n0", expectedOutput: "10" },
      { input: "5\n1 2 3 4 5\n4", expectedOutput: "15" },
      { input: "5\n1 2 3 4 5\n0", expectedOutput: "1" },
      { input: "4\n3 3 3 3\n2", expectedOutput: "11" },
      { input: "6\n2 6 3 4 5 1\n1", expectedOutput: "21" },
      { input: "3\n4 9 3\n1", expectedOutput: "16" },
      { input: "2\n100 1\n0", expectedOutput: "101" },
      { input: "7\n1 1 1 7 1 1 1\n3", expectedOutput: "13" },
      { input: "5\n2 2 2 2 2\n3", expectedOutput: "9" }
    ]
  },
  {
    id: "reveal-cards-in-increasing-order",
    "hints": ["Think about reversing the reveal process: instead of revealing, imagine rebuilding the deck from the sorted order.","Place the sorted cards using a queue that simulates the reveal: repeatedly take the front index, assign the next smallest card, then move the new front to the back."],
    returns: "intArr",
    title: "Reveal Cards In Increasing Order",
    difficulty: "medium",
    topic: "queue",
    companies: ["Google", "Amazon"],
    description: "You are given an integer array deck of distinct integers. Order the deck so that when the cards are revealed one by one using this process, they come out in increasing order: take the top card and reveal it, then move the new top card to the bottom of the deck, and repeat until no cards remain. Return an ordering of the deck that reveals the cards in increasing order.",
    examples: [
      { input: "deck = [17,13,11,2,3,5,7]", output: "2 13 3 11 5 17 7", explanation: "Revealing this ordering produces 2, 3, 5, 7, 11, 13, 17, which is increasing." },
      { input: "deck = [1,2,3,4,5]", output: "1 5 2 4 3", explanation: "Revealing this ordering produces 1, 2, 3, 4, 5, which is increasing." },
      { input: "deck = [42]", output: "42", explanation: "With a single card, the deck is revealed as is." }
    ],
    constraints: ["1 <= deck.length <= 1000", "1 <= deck[i] <= 10^4", "All values in deck are distinct."],
    io: "array",
    testCases: [
      { input: "7\n17 13 11 2 3 5 7", expectedOutput: "2 13 3 11 5 17 7" },
      { input: "5\n1 2 3 4 5", expectedOutput: "1 5 2 4 3" },
      { input: "1\n42", expectedOutput: "42" },
      { input: "2\n10 20", expectedOutput: "10 20" },
      { input: "4\n5 3 8 1", expectedOutput: "1 5 3 8" },
      { input: "6\n6 5 4 3 2 1", expectedOutput: "1 4 2 6 3 5" },
      { input: "3\n100 1 50", expectedOutput: "1 100 50" },
      { input: "8\n8 7 6 5 4 3 2 1", expectedOutput: "1 5 2 7 3 6 4 8" },
      { input: "3\n3 2 1", expectedOutput: "1 3 2" },
      { input: "4\n40 30 20 10", expectedOutput: "10 30 20 40" },
      { input: "5\n9 7 5 3 1", expectedOutput: "1 9 3 7 5" },
      { input: "9\n1 1000 2 999 3 998 4 997 5", expectedOutput: "1 1000 2 997 3 999 4 998 5" }
    ]
  },
  {
    id: "dota2-senate",
    "hints": ["Each senator bans the earliest acting opponent senator, so order of action matters.","Use two queues holding the indices of Radiant and Dire senators; repeatedly compare fronts, let the earlier one ban the later, and requeue the winner with index + n."],
    returns: "string",
    title: "Dota2 Senate",
    difficulty: "medium",
    topic: "queue",
    companies: ["Google", "Meta"],
    description: "In the world of Dota2 there are two parties: the Radiant and the Dire. The senate is a string where each character is 'R' for Radiant or 'D' for Dire. Senators act in round-robin order and each active senator bans one senator of the opposing party, removing them permanently. The party with senators remaining at the end wins. Given the senate string, predict the winner and return Radiant or Dire.",
    examples: [
      { input: "senate = \"RD\"", output: "Radiant", explanation: "The Radiant senator bans the Dire senator in the first round, so Radiant wins." },
      { input: "senate = \"RDD\"", output: "Dire", explanation: "The Radiant senator bans one Dire senator, then the remaining Dire senator bans the Radiant senator, so Dire wins." },
      { input: "senate = \"RRDDD\"", output: "Radiant", explanation: "After several rounds of banning, only Radiant senators remain." }
    ],
    constraints: ["1 <= senate.length <= 10^4", "senate consists of only 'R' and 'D' characters."],
    io: "string",
    testCases: [
      { input: "RD", expectedOutput: "Radiant" },
      { input: "RDD", expectedOutput: "Dire" },
      { input: "RRDDD", expectedOutput: "Radiant" },
      { input: "DDR", expectedOutput: "Dire" },
      { input: "RDRD", expectedOutput: "Radiant" },
      { input: "DRDR", expectedOutput: "Dire" },
      { input: "RRR", expectedOutput: "Radiant" },
      { input: "DDD", expectedOutput: "Dire" },
      { input: "RDRDRD", expectedOutput: "Radiant" },
      { input: "DRRDRD", expectedOutput: "Radiant" },
      { input: "R", expectedOutput: "Radiant" },
      { input: "D", expectedOutput: "Dire" }
    ]
  },
  {
    id: "moving-average-window",
    "hints": ["Recomputing each window's sum from scratch repeats a lot of work.","Use a sliding window sum: add the new element entering the window and subtract the one leaving, then divide by k."],
    returns: "intArr",
    title: "Moving Average of Window",
    difficulty: "easy",
    topic: "queue",
    companies: ["Google", "Amazon"],
    description: "You are given an integer array arr and an integer k. For every contiguous window of size k, compute the average of the window rounded down to an integer. Return the averages for all windows from left to right.",
    examples: [
      { input: "arr = [1,3,2,6], k = 3", output: "2 3", explanation: "The window averages are (1+3+2)/3 = 2 and (3+2+6)/3 = 3 after rounding down." },
      { input: "arr = [1,2,3,4,5], k = 1", output: "1 2 3 4 5", explanation: "Each window has a single element, so the averages equal the elements." },
      { input: "arr = [10,20,30,40,50], k = 5", output: "30", explanation: "There is one window and its average is 150/5 = 30." }
    ],
    constraints: ["1 <= arr.length <= 10^5", "0 <= arr[i] <= 10^4", "1 <= k <= arr.length"],
    io: "array-k",
    testCases: [
      { input: "4\n1 3 2 6\n3", expectedOutput: "2 3" },
      { input: "5\n1 2 3 4 5\n1", expectedOutput: "1 2 3 4 5" },
      { input: "5\n10 20 30 40 50\n5", expectedOutput: "30" },
      { input: "6\n7 7 7 7 7 7\n2", expectedOutput: "7 7 7 7 7" },
      { input: "6\n0 0 0 0 0 5\n3", expectedOutput: "0 0 0 1" },
      { input: "3\n5 8 13\n2", expectedOutput: "6 10" },
      { input: "7\n100 200 300 400 500 600 700\n4", expectedOutput: "250 350 450 550" },
      { input: "4\n1 1 1 2\n4", expectedOutput: "1" },
      { input: "8\n3 1 4 1 5 9 2 6\n3", expectedOutput: "2 2 3 5 5 5" },
      { input: "2\n9 9\n2", expectedOutput: "9" },
      { input: "10\n1 2 3 4 5 6 7 8 9 10\n5", expectedOutput: "3 4 5 6 7 8" },
      { input: "5\n2 4 6 8 10\n3", expectedOutput: "4 6 8" }
    ]
  },
  {
    id: "first-negative-in-window",
    "hints": ["You need the first negative in each window as it slides, without rescanning the whole window.","Keep a queue of indices of negative numbers; the front is the answer for the current window, and drop indices that fall out of the window."],
    returns: "intArr",
    title: "First Negative Integer in Every Window",
    difficulty: "medium",
    topic: "queue",
    companies: ["Amazon", "Flipkart"],
    description: "You are given an integer array arr and an integer k. For every contiguous window of size k, find the first negative integer in the window reading from the left. If a window has no negative integer, use 0 for that window. Return the results for all windows from left to right.",
    examples: [
      { input: "arr = [-8,2,3,-6,10,5,-1,2], k = 3", output: "-8 -6 -6 -6 -1 -1", explanation: "The first negative integer in each window of size 3 gives -8, -6, -6, -6, -1, -1." },
      { input: "arr = [1,2,3,4,5], k = 2", output: "0 0 0 0", explanation: "No window contains a negative integer, so every answer is 0." },
      { input: "arr = [-1,-2,-3,-4,-5], k = 3", output: "-1 -2 -3", explanation: "The first negatives of the windows are -1, -2 and -3." }
    ],
    constraints: ["1 <= arr.length <= 10^5", "-10^4 <= arr[i] <= 10^4", "1 <= k <= arr.length"],
    io: "array-k",
    testCases: [
      { input: "8\n-8 2 3 -6 10 5 -1 2\n3", expectedOutput: "-8 -6 -6 -6 -1 -1" },
      { input: "5\n1 2 3 4 5\n2", expectedOutput: "0 0 0 0" },
      { input: "5\n-1 -2 -3 -4 -5\n3", expectedOutput: "-1 -2 -3" },
      { input: "4\n5 -3 8 -2\n4", expectedOutput: "-3" },
      { input: "6\n1 -1 1 -1 1 -1\n2", expectedOutput: "-1 -1 -1 -1 -1" },
      { input: "3\n-5 10 20\n1", expectedOutput: "-5 0 0" },
      { input: "7\n4 -2 0 -7 3 -1 8\n3", expectedOutput: "-2 -2 -7 -7 -1" },
      { input: "1\n-9\n1", expectedOutput: "-9" },
      { input: "6\n0 0 -4 0 0 -6\n4", expectedOutput: "-4 -4 -4" },
      { input: "9\n-1 2 -3 4 -5 6 -7 8 -9\n4", expectedOutput: "-1 -3 -3 -5 -5 -7" },
      { input: "5\n10 20 -30 40 50\n5", expectedOutput: "-30" },
      { input: "4\n-1 -1 -1 -1\n2", expectedOutput: "-1 -1 -1" }
    ]
  },
  {
    id: "card-rotation-game",
    "hints": ["This is the inverse of the reveal process: you know the revealed order and must reconstruct the original deck.","Simulate the reverse process with a deque: for cards in reverse revealed order, move the back card to the front, then push the card to the front."],
    returns: "intArr",
    title: "Card Rotation Game",
    difficulty: "medium",
    topic: "queue",
    companies: ["Google", "Microsoft"],
    description: "A deck of cards is revealed using this process: take the top card and reveal it, then move the new top card to the bottom of the deck, and repeat until no cards remain. You are given the array cards containing the values in the exact order they were revealed, which is strictly increasing. Reconstruct and return the original order of the deck before the revealing began.",
    examples: [
      { input: "cards = [2,3,5,7,11,13,17]", output: "2 13 3 11 5 17 7", explanation: "Revealing the deck [2,13,3,11,5,17,7] produces the cards in the given order 2, 3, 5, 7, 11, 13, 17." },
      { input: "cards = [1,2,3,4,5]", output: "1 5 2 4 3", explanation: "Revealing the deck [1,5,2,4,3] produces the cards in the given order 1, 2, 3, 4, 5." },
      { input: "cards = [42]", output: "42", explanation: "With a single card, the original deck is the same." }
    ],
    constraints: ["1 <= cards.length <= 1000", "cards is strictly increasing."],
    io: "array",
    testCases: [
      { input: "7\n2 3 5 7 11 13 17", expectedOutput: "2 13 3 11 5 17 7" },
      { input: "5\n1 2 3 4 5", expectedOutput: "1 5 2 4 3" },
      { input: "1\n42", expectedOutput: "42" },
      { input: "2\n10 20", expectedOutput: "10 20" },
      { input: "4\n1 3 5 8", expectedOutput: "1 5 3 8" },
      { input: "6\n1 2 3 4 5 6", expectedOutput: "1 4 2 6 3 5" },
      { input: "3\n1 50 100", expectedOutput: "1 100 50" },
      { input: "8\n1 2 3 4 5 6 7 8", expectedOutput: "1 5 2 7 3 6 4 8" },
      { input: "3\n1 2 3", expectedOutput: "1 3 2" },
      { input: "4\n10 20 30 40", expectedOutput: "10 30 20 40" },
      { input: "5\n1 3 5 7 9", expectedOutput: "1 9 3 7 5" },
      { input: "9\n1 2 3 4 5 997 998 999 1000", expectedOutput: "1 1000 2 997 3 999 4 998 5" }
    ]
  },
{
    id: "invert-binary-tree",
    "hints": ["Think about what inverting means for each individual node and its two children.","Recursively swap the left and right children of every node; a post-order or pre-order traversal both work."],
    returns: "tree",
    title: "Invert Binary Tree",
    difficulty: "easy",
    topic: "trees",
    companies: ["Google", "Amazon", "Microsoft"],
    description: "Given the root of a binary tree, invert the tree, and return its root. Inverting a binary tree means swapping the left and right child of every node. Each node is a TreeNode with val, left and right properties.",
    images: ["https://assets.leetcode.com/uploads/2021/03/14/invert1-tree.jpg", "https://assets.leetcode.com/uploads/2021/03/14/invert2-tree.jpg"],
    examples: [
      { input: "7\n4 2 7 1 3 6 9", output: "4 7 2 9 6 3 1", explanation: "Swapping the left and right child of every node turns the tree [4,2,7,1,3,6,9] into [4,7,2,9,6,3,1]." },
      { input: "3\n2 1 3", output: "2 3 1", explanation: "The two children of node 2 are swapped, giving [2,3,1]." },
      { input: "0\n", output: "", explanation: "An empty tree inverts to an empty tree." },
    ],
    constraints: ["The number of nodes in the tree is in the range [0, 100].", "-100 <= Node.val <= 100"],
    io: "tree",
    testCases: [
      { input: "7\n4 2 7 1 3 6 9", expectedOutput: "4 7 2 9 6 3 1" },
      { input: "3\n2 1 3", expectedOutput: "2 3 1" },
      { input: "0\n", expectedOutput: "" },
      { input: "1\n5", expectedOutput: "5" },
      { input: "5\n1 2 3 4 5", expectedOutput: "1 3 2 null null 5 4" },
      { input: "4\n1 2 null 3", expectedOutput: "1 null 2 null 3" },
      { input: "7\n10 5 15 3 7 null 18", expectedOutput: "10 15 5 18 null 7 3" },
      { input: "2\n1 2", expectedOutput: "1 null 2" },
      { input: "12\n8 3 10 1 6 null 14 null null 4 7 13", expectedOutput: "8 10 3 14 null 6 1 null 13 7 4" },
      { input: "5\n1 null 2 null 3", expectedOutput: "1 2 null 3" },
      { input: "7\n1 2 3 4 null null 5", expectedOutput: "1 3 2 5 null null 4" },
      { input: "12\n50 30 70 20 40 60 80 null null null null 55", expectedOutput: "50 70 30 80 60 40 20 null null null 55" },
    ],
  },
  {
    id: "maximum-depth-of-binary-tree",
    "hints": ["The depth of a tree is one more than the deeper of its two subtrees.","Use recursion: depth(node) = 1 + max(depth(left), depth(right)), with an empty tree having depth 0."],
    returns: "int",
    title: "Maximum Depth of Binary Tree",
    difficulty: "easy",
    topic: "trees",
    companies: ["Amazon", "Microsoft"],
    description: "Given the root of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node. Each node is a TreeNode with val, left and right properties.",
    images: ["https://assets.leetcode.com/uploads/2020/11/26/tmp-tree.jpg"],
    examples: [
      { input: "7\n3 9 20 null null 15 7", output: "3", explanation: "The longest root-to-leaf path is 3 -> 20 -> 15 (or 3 -> 20 -> 7), which has 3 nodes." },
      { input: "2\n1 null 2", output: "2", explanation: "The path 1 -> 2 has 2 nodes." },
      { input: "0\n", output: "0", explanation: "An empty tree has depth 0." },
    ],
    constraints: ["The number of nodes in the tree is in the range [0, 10000].", "-100 <= Node.val <= 100"],
    io: "tree",
    testCases: [
      { input: "7\n3 9 20 null null 15 7", expectedOutput: "3" },
      { input: "2\n1 null 2", expectedOutput: "2" },
      { input: "0\n", expectedOutput: "0" },
      { input: "1\n1", expectedOutput: "1" },
      { input: "5\n1 2 3 4 5", expectedOutput: "3" },
      { input: "5\n1 null 2 null 3", expectedOutput: "3" },
      { input: "7\n1 2 3 4 5 6 7", expectedOutput: "3" },
      { input: "15\n1 2 3 4 5 6 7 8 9 10 11 12 13 14 15", expectedOutput: "4" },
      { input: "3\n1 2 null", expectedOutput: "2" },
      { input: "7\n1 2 3 4 null null null", expectedOutput: "3" },
      { input: "12\n5 3 8 1 4 7 9 null null null null 6", expectedOutput: "4" },
      { input: "2\n1 2", expectedOutput: "2" },
    ],
  },
  {
    id: "same-tree",
    "hints": ["Two trees are the same only if every corresponding pair of nodes matches.","Recursively check that both nodes are null together, have equal values, and their left and right subtrees are pairwise the same."],
    returns: "bool",
    title: "Same Tree",
    difficulty: "easy",
    topic: "trees",
    companies: ["Google", "Amazon"],
    description: "Given the roots p and q of two binary trees, check whether they are the same or not. Two binary trees are considered the same if they are structurally identical and the nodes have the same value. Each node is a TreeNode with val, left and right properties.",
    images: ["https://assets.leetcode.com/uploads/2020/12/20/ex1.jpg", "https://assets.leetcode.com/uploads/2020/12/20/ex2.jpg", "https://assets.leetcode.com/uploads/2020/12/20/ex3.jpg"],
    examples: [
      { input: "3\n1 2 3\n3\n1 2 3", output: "true", explanation: "Both trees have identical structure and the same values at every position." },
      { input: "2\n1 2\n2\n1 null 2", output: "false", explanation: "The structures differ: node 2 is a left child in the first tree but a right child in the second." },
      { input: "3\n1 2 1\n3\n1 1 2", output: "false", explanation: "The values at matching positions differ, so the trees are not the same." },
    ],
    constraints: ["The number of nodes in both trees is in the range [0, 100].", "-10000 <= Node.val <= 10000"],
    io: "two-trees",
    testCases: [
      { input: "3\n1 2 3\n3\n1 2 3", expectedOutput: "true" },
      { input: "2\n1 2\n2\n1 null 2", expectedOutput: "false" },
      { input: "3\n1 2 1\n3\n1 1 2", expectedOutput: "false" },
      { input: "0\n\n0\n", expectedOutput: "true" },
      { input: "1\n1\n0\n", expectedOutput: "false" },
      { input: "1\n1\n1\n1", expectedOutput: "true" },
      { input: "1\n5\n1\n6", expectedOutput: "false" },
      { input: "7\n1 2 3 4 5 6 7\n7\n1 2 3 4 5 6 7", expectedOutput: "true" },
      { input: "7\n1 2 3 4 5 6 7\n7\n1 2 3 4 5 6 8", expectedOutput: "false" },
      { input: "4\n1 2 null 3\n4\n1 2 null 3", expectedOutput: "true" },
      { input: "4\n1 2 null 3\n4\n1 null 2 3", expectedOutput: "false" },
      { input: "7\n10 20 30 null null 40 50\n7\n10 20 30 null null 40 50", expectedOutput: "true" },
    ],
  },
  {
    id: "symmetric-tree",
    "hints": ["Symmetry means the left subtree mirrors the right subtree, not that each is symmetric alone.","Write a helper that compares two nodes as mirrors: values equal, left.left with right.right, and left.right with right.left."],
    returns: "bool",
    title: "Symmetric Tree",
    difficulty: "easy",
    topic: "trees",
    companies: ["Amazon", "Microsoft"],
    description: "Given the root of a binary tree, check whether it is a mirror of itself, that is, symmetric around its center. Each node is a TreeNode with val, left and right properties.",
    images: ["https://assets.leetcode.com/uploads/2021/02/19/symtree1.jpg", "https://assets.leetcode.com/uploads/2021/02/19/symtree2.jpg"],
    examples: [
      { input: "7\n1 2 2 3 4 4 3", output: "true", explanation: "The left subtree is a mirror reflection of the right subtree." },
      { input: "7\n1 2 2 null 3 null 3", output: "false", explanation: "The left and right subtrees are not mirror images of each other." },
      { input: "0\n", output: "true", explanation: "An empty tree is symmetric." },
    ],
    constraints: ["The number of nodes in the tree is in the range [0, 1000].", "-100 <= Node.val <= 100"],
    io: "tree",
    testCases: [
      { input: "7\n1 2 2 3 4 4 3", expectedOutput: "true" },
      { input: "7\n1 2 2 null 3 null 3", expectedOutput: "false" },
      { input: "0\n", expectedOutput: "true" },
      { input: "1\n1", expectedOutput: "true" },
      { input: "3\n1 2 2", expectedOutput: "true" },
      { input: "3\n1 2 3", expectedOutput: "false" },
      { input: "11\n1 2 2 3 4 4 3 5 null null 5", expectedOutput: "false" },
      { input: "7\n1 2 2 3 null null 3", expectedOutput: "true" },
      { input: "7\n2 3 3 4 5 5 4", expectedOutput: "true" },
      { input: "7\n2 3 3 4 5 null 4", expectedOutput: "false" },
      { input: "11\n1 2 2 3 4 4 3 5 6 6 5", expectedOutput: "false" },
      { input: "2\n1 2", expectedOutput: "false" },
    ],
  },
  {
    id: "binary-tree-inorder-traversal",
    "hints": ["Inorder means left subtree, then the node, then the right subtree.","Implement the recursive definition directly, or use an explicit stack simulating the same left-node-right order iteratively."],
    returns: "intArr",
    title: "Binary Tree Inorder Traversal",
    difficulty: "easy",
    topic: "trees",
    companies: ["Google", "Amazon", "Microsoft"],
    description: "Given the root of a binary tree, return the inorder traversal of its nodes' values. Inorder traversal visits the left subtree first, then the node itself, then the right subtree. Each node is a TreeNode with val, left and right properties.",
    images: ["https://assets.leetcode.com/uploads/2024/08/29/screenshot-2024-08-29-202743.png", "https://assets.leetcode.com/uploads/2024/08/29/tree_2.png"],
    examples: [
      { input: "4\n1 null 2 3", output: "1 3 2", explanation: "Inorder visits left, node, right: first 1, then the right subtree gives 3 followed by 2." },
      { input: "7\n1 2 3 4 5 6 7", output: "4 2 5 1 6 3 7", explanation: "Inorder traversal of this complete binary tree visits nodes in sorted order." },
      { input: "0\n", output: "", explanation: "An empty tree has an empty traversal." },
    ],
    constraints: ["The number of nodes in the tree is in the range [0, 100].", "-100 <= Node.val <= 100"],
    io: "tree",
    testCases: [
      { input: "4\n1 null 2 3", expectedOutput: "1 3 2" },
      { input: "7\n1 2 3 4 5 6 7", expectedOutput: "4 2 5 1 6 3 7" },
      { input: "0\n", expectedOutput: "" },
      { input: "1\n1", expectedOutput: "1" },
      { input: "3\n3 1 2", expectedOutput: "1 3 2" },
      { input: "6\n5 4 null 3 null 2", expectedOutput: "2 3 4 5" },
      { input: "5\n1 null 2 null 3", expectedOutput: "1 2 3" },
      { input: "12\n8 3 10 1 6 null 14 null null 4 7 13", expectedOutput: "1 3 4 6 7 8 10 13 14" },
      { input: "7\n10 5 15 3 7 null 18", expectedOutput: "3 5 7 10 15 18" },
      { input: "3\n1 null 2", expectedOutput: "1 2" },
      { input: "4\n1 2 null 3", expectedOutput: "3 2 1" },
      { input: "7\n4 2 6 1 3 5 7", expectedOutput: "1 2 3 4 5 6 7" },
    ],
  },
  {
    id: "path-sum",
    "hints": ["As you go down, the remaining sum you need to find shrinks by each node's value.","Recursively check with target minus node value; return true only when you reach a leaf whose value equals the remaining target."],
    returns: "bool",
    title: "Path Sum",
    difficulty: "easy",
    topic: "trees",
    companies: ["Amazon", "Microsoft"],
    description: "Given the root of a binary tree and an integer target, return true if the tree has a root-to-leaf path such that adding up all the values along the path equals target. A leaf is a node with no children. Each node is a TreeNode with val, left and right properties.",
    images: ["https://assets.leetcode.com/uploads/2021/01/18/pathsum1.jpg", "https://assets.leetcode.com/uploads/2021/01/18/pathsum2.jpg"],
    examples: [
      { input: "13\n5 4 8 11 null 13 4 7 2 null null null 1\n22", output: "true", explanation: "The path 5 -> 4 -> 11 -> 2 adds up to 22." },
      { input: "3\n1 2 3\n5", output: "false", explanation: "The root-to-leaf paths give 1 -> 2 = 3 and 1 -> 3 = 4, neither of which equals 5." },
      { input: "0\n\n0", output: "false", explanation: "An empty tree has no root-to-leaf path." },
    ],
    constraints: ["The number of nodes in the tree is in the range [0, 5000].", "-1000 <= Node.val <= 1000", "-1000 <= target <= 1000"],
    io: "tree-target",
    testCases: [
      { input: "13\n5 4 8 11 null 13 4 7 2 null null null 1\n22", expectedOutput: "true" },
      { input: "3\n1 2 3\n5", expectedOutput: "false" },
      { input: "0\n\n0", expectedOutput: "false" },
      { input: "1\n1\n1", expectedOutput: "true" },
      { input: "1\n1\n2", expectedOutput: "false" },
      { input: "5\n1 2 3 4 5\n7", expectedOutput: "true" },
      { input: "5\n1 2 3 4 5\n8", expectedOutput: "true" },
      { input: "5\n1 2 3 4 5\n9", expectedOutput: "false" },
      { input: "7\n1 2 3 4 null null 5\n8", expectedOutput: "false" },
      { input: "3\n1 -2 3\n-1", expectedOutput: "true" },
      { input: "4\n1 2 null 3\n6", expectedOutput: "true" },
      { input: "7\n10 5 15 3 7 null 18\n22", expectedOutput: "true" },
    ],
  },
  {
    id: "diameter-of-binary-tree",
    "hints": ["The longest path may pass through any node, not necessarily the root.","At each node, compute left depth plus right depth as a candidate diameter, and return 1 + max(left, right) upward; track the global maximum."],
    returns: "int",
    title: "Diameter of Binary Tree",
    difficulty: "easy",
    topic: "trees",
    companies: ["Google", "Meta"],
    description: "Given the root of a binary tree, return the length of the diameter of the tree. The diameter of a binary tree is the length of the longest path between any two nodes in the tree. This path may or may not pass through the root. The length of a path between two nodes is represented by the number of edges between them. Each node is a TreeNode with val, left and right properties.",
    images: ["https://assets.leetcode.com/uploads/2021/03/06/diamtree.jpg"],
    examples: [
      { input: "5\n1 2 3 4 5", output: "3", explanation: "The longest path is 4 -> 2 -> 1 -> 3 (or 5 -> 2 -> 1 -> 3), which has 3 edges." },
      { input: "2\n1 2", output: "1", explanation: "The only path is 1 -> 2, which has 1 edge." },
      { input: "0\n", output: "0", explanation: "An empty tree has diameter 0." },
    ],
    constraints: ["The number of nodes in the tree is in the range [0, 10000].", "-100 <= Node.val <= 100"],
    io: "tree",
    testCases: [
      { input: "5\n1 2 3 4 5", expectedOutput: "3" },
      { input: "2\n1 2", expectedOutput: "1" },
      { input: "0\n", expectedOutput: "0" },
      { input: "1\n1", expectedOutput: "0" },
      { input: "7\n1 2 3 4 5 6 7", expectedOutput: "4" },
      { input: "5\n1 null 2 null 3", expectedOutput: "2" },
      { input: "11\n1 2 3 4 5 null null 6 null null 7", expectedOutput: "4" },
      { input: "3\n1 2 3", expectedOutput: "2" },
      { input: "6\n4 2 6 1 3 5", expectedOutput: "4" },
      { input: "8\n1 2 null 3 null 4 null 5", expectedOutput: "4" },
      { input: "7\n3 9 20 null null 15 7", expectedOutput: "3" },
      { input: "13\n5 4 8 11 null 13 4 7 2 null null null 1", expectedOutput: "6" },
    ],
  },
  {
    id: "balanced-binary-tree",
    "hints": ["Checking balance top-down recomputes heights many times; think about what one bottom-up pass could return.","Write a helper returning the subtree height, or -1 if unbalanced; a node is balanced when both children are balanced and their heights differ by at most 1."],
    returns: "bool",
    title: "Balanced Binary Tree",
    difficulty: "easy",
    topic: "trees",
    companies: ["Amazon", "Microsoft"],
    description: "Given a binary tree, determine if it is height-balanced. A height-balanced binary tree is a binary tree in which the depth of the two subtrees of every node never differs by more than one. Each node is a TreeNode with val, left and right properties.",
    images: ["https://assets.leetcode.com/uploads/2020/10/06/balance_1.jpg", "https://assets.leetcode.com/uploads/2020/10/06/balance_2.jpg"],
    examples: [
      { input: "7\n3 9 20 null null 15 7", output: "true", explanation: "The left and right subtrees of every node differ in height by at most 1." },
      { input: "9\n1 2 2 3 3 null null 4 4", output: "false", explanation: "The left subtree of the root has height 3 while the right subtree has height 1, a difference of 2." },
      { input: "0\n", output: "true", explanation: "An empty tree is balanced." },
    ],
    constraints: ["The number of nodes in the tree is in the range [0, 5000].", "-10000 <= Node.val <= 10000"],
    io: "tree",
    testCases: [
      { input: "7\n3 9 20 null null 15 7", expectedOutput: "true" },
      { input: "9\n1 2 2 3 3 null null 4 4", expectedOutput: "false" },
      { input: "0\n", expectedOutput: "true" },
      { input: "1\n1", expectedOutput: "true" },
      { input: "3\n1 2 3", expectedOutput: "true" },
      { input: "4\n1 2 null 3", expectedOutput: "false" },
      { input: "7\n1 2 3 4 5 6 7", expectedOutput: "true" },
      { input: "5\n1 null 2 null 3", expectedOutput: "false" },
      { input: "7\n1 2 3 4 null null 5", expectedOutput: "true" },
      { input: "2\n1 2", expectedOutput: "true" },
      { input: "15\n1 2 3 4 5 6 7 8 9 10 11 12 13 14 15", expectedOutput: "true" },
      { input: "7\n1 2 2 3 null null 3", expectedOutput: "true" },
    ],
  },
  {
    id: "binary-tree-level-order-traversal",
    "hints": ["Level order means visiting nodes breadth-first, level by level.","Use a queue for BFS, processing nodes level by level by capturing the queue size at the start of each level."],
    returns: "intMat",
    title: "Binary Tree Level Order Traversal",
    difficulty: "medium",
    topic: "trees",
    companies: ["Google", "Amazon", "Microsoft"],
    description: "Given the root of a binary tree, return the level order traversal of its nodes' values, that is, from left to right, level by level. Each level of the tree is returned on its own line. Each node is a TreeNode with val, left and right properties.",
    images: ["https://assets.leetcode.com/uploads/2021/02/19/tree1.jpg"],
    examples: [
      { input: "7\n3 9 20 null null 15 7", output: "3\n9 20\n15 7", explanation: "Level 0 has [3], level 1 has [9, 20], and level 2 has [15, 7]." },
      { input: "1\n1", output: "1", explanation: "A single node forms exactly one level." },
      { input: "0\n", output: "", explanation: "An empty tree has no levels." },
    ],
    constraints: ["The number of nodes in the tree is in the range [0, 2000].", "-1000 <= Node.val <= 1000"],
    io: "tree",
    testCases: [
      { input: "7\n3 9 20 null null 15 7", expectedOutput: "3\n9 20\n15 7" },
      { input: "1\n1", expectedOutput: "1" },
      { input: "0\n", expectedOutput: "" },
      { input: "3\n1 2 3", expectedOutput: "1\n2 3" },
      { input: "7\n1 2 3 4 5 6 7", expectedOutput: "1\n2 3\n4 5 6 7" },
      { input: "5\n1 null 2 null 3", expectedOutput: "1\n2\n3" },
      { input: "4\n1 2 null 3", expectedOutput: "1\n2\n3" },
      { input: "7\n10 5 15 3 7 null 18", expectedOutput: "10\n5 15\n3 7 18" },
      { input: "12\n8 3 10 1 6 null 14 null null 4 7 13", expectedOutput: "8\n3 10\n1 6 14\n4 7 13" },
      { input: "2\n1 2", expectedOutput: "1\n2" },
      { input: "11\n1 2 3 4 5 6 7 8 9 10 11", expectedOutput: "1\n2 3\n4 5 6 7\n8 9 10 11" },
      { input: "13\n5 4 8 11 null 13 4 7 2 null null null 1", expectedOutput: "5\n4 8\n11 13 4\n7 2 1" },
    ],
  },
  {
    id: "kth-smallest-element-in-a-bst",
    "hints": ["A BST's inorder traversal visits values in ascending order.","Do an inorder traversal with a counter and stop at the kth visited node, or use subtree sizes to skip whole subtrees."],
    returns: "int",
    title: "Kth Smallest Element in a BST",
    difficulty: "medium",
    topic: "trees",
    companies: ["Amazon", "Google"],
    description: "Given the root of a binary search tree and an integer k, return the kth smallest value, 1-indexed, of all the values of the nodes in the tree. Each node is a TreeNode with val, left and right properties.",
    images: ["https://assets.leetcode.com/uploads/2021/01/28/kthtree1.jpg", "https://assets.leetcode.com/uploads/2021/01/28/kthtree2.jpg"],
    examples: [
      { input: "5\n3 1 4 null 2\n1", output: "1", explanation: "The values in sorted order are [1, 2, 3, 4], so the 1st smallest is 1." },
      { input: "8\n5 3 6 2 4 null null 1\n3", output: "3", explanation: "The values in sorted order are [1, 2, 3, 4, 5, 6], so the 3rd smallest is 3." },
      { input: "1\n1\n1", output: "1", explanation: "The only value in the tree is the 1st smallest." },
    ],
    constraints: ["The number of nodes in the tree is n.", "1 <= k <= n <= 10000", "0 <= Node.val <= 10000"],
    io: "tree-k",
    testCases: [
      { input: "5\n3 1 4 null 2\n1", expectedOutput: "1" },
      { input: "8\n5 3 6 2 4 null null 1\n3", expectedOutput: "3" },
      { input: "1\n1\n1", expectedOutput: "1" },
      { input: "3\n2 1 3\n2", expectedOutput: "2" },
      { input: "7\n4 2 6 1 3 5 7\n4", expectedOutput: "4" },
      { input: "7\n4 2 6 1 3 5 7\n7", expectedOutput: "7" },
      { input: "7\n4 2 6 1 3 5 7\n1", expectedOutput: "1" },
      { input: "5\n5 3 6 2 4\n2", expectedOutput: "3" },
      { input: "12\n8 3 10 1 6 null 14 null null 4 7 13\n5", expectedOutput: "7" },
      { input: "2\n2 1\n2", expectedOutput: "2" },
      { input: "10\n10 5 15 3 7 null 18 1 null 6\n6", expectedOutput: "10" },
      { input: "5\n20 10 30 5 15\n3", expectedOutput: "15" },
    ],
  },
  {
    id: "validate-binary-search-tree",
    "hints": ["Each node must lie within a valid range that tightens as you descend.","Pass down (low, high) bounds recursively: left children must be below the node's value and right children above it."],
    returns: "bool",
    title: "Validate Binary Search Tree",
    difficulty: "medium",
    topic: "trees",
    companies: ["Amazon", "Microsoft", "Google"],
    description: "Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST is defined as follows: the left subtree of a node contains only nodes with keys less than the node's key, the right subtree of a node contains only nodes with keys greater than the node's key, and both the left and right subtrees must also be binary search trees. Each node is a TreeNode with val, left and right properties.",
    images: ["https://assets.leetcode.com/uploads/2020/12/01/tree1.jpg", "https://assets.leetcode.com/uploads/2020/12/01/tree2.jpg"],
    examples: [
      { input: "3\n2 1 3", output: "true", explanation: "Since 1 < 2 < 3, every node satisfies the BST property." },
      { input: "5\n5 1 4 null null 3 6", output: "false", explanation: "Node 4 sits in the right subtree of 5, but 4 < 5, which violates the BST property." },
      { input: "0\n", output: "true", explanation: "An empty tree is a valid binary search tree." },
    ],
    constraints: ["The number of nodes in the tree is in the range [0, 10000].", "-2147483648 <= Node.val <= 2147483647"],
    io: "tree",
    testCases: [
      { input: "3\n2 1 3", expectedOutput: "true" },
      { input: "5\n5 1 4 null null 3 6", expectedOutput: "false" },
      { input: "0\n", expectedOutput: "true" },
      { input: "1\n1", expectedOutput: "true" },
      { input: "7\n5 4 6 null null 3 7", expectedOutput: "false" },
      { input: "7\n3 1 5 null null 4 6", expectedOutput: "true" },
      { input: "3\n1 1 2", expectedOutput: "false" },
      { input: "7\n10 5 15 null null 6 20", expectedOutput: "false" },
      { input: "2\n2 2", expectedOutput: "false" },
      { input: "3\n1 null 2", expectedOutput: "true" },
      { input: "12\n8 3 10 1 6 null 14 null null 4 7 13", expectedOutput: "true" },
      { input: "3\n0 -1 1", expectedOutput: "true" },
    ],
  },
  {
    id: "subtree-of-another-tree",
    "hints": ["A tree is a subtree if it matches at the root or inside either child.","For each node of the main tree, check whether the subtree rooted there is identical to subRoot using a same-tree helper."],
    returns: "bool",
    title: "Subtree of Another Tree",
    difficulty: "easy",
    topic: "trees",
    companies: ["Google", "Amazon"],
    description: "Given the roots of two binary trees root and subRoot, return true if there is a subtree of root with the same structure and node values as subRoot, and false otherwise. A subtree of a binary tree is a tree that consists of a node in the tree and all of this node's descendants. Each node is a TreeNode with val, left and right properties.",
    images: ["https://assets.leetcode.com/uploads/2021/04/28/subtree1-tree.jpg", "https://assets.leetcode.com/uploads/2021/04/28/subtree2-tree.jpg"],
    examples: [
      { input: "5\n3 4 5 1 2\n3\n4 1 2", output: "true", explanation: "The subtree rooted at node 4 in the main tree matches subRoot exactly." },
      { input: "10\n3 4 5 1 2 null null null null 0\n3\n4 1 2", output: "false", explanation: "Node 4 in the main tree has an extra child 0, so no subtree matches subRoot." },
      { input: "1\n1\n1\n1", output: "true", explanation: "Both single-node trees are identical." },
    ],
    constraints: ["The number of nodes in the root tree is in the range [0, 2000].", "The number of nodes in the subRoot tree is in the range [0, 1000].", "-100 <= Node.val <= 100"],
    io: "two-trees",
    testCases: [
      { input: "5\n3 4 5 1 2\n3\n4 1 2", expectedOutput: "true" },
      { input: "10\n3 4 5 1 2 null null null null 0\n3\n4 1 2", expectedOutput: "false" },
      { input: "1\n1\n1\n1", expectedOutput: "true" },
      { input: "3\n1 2 3\n2\n2 3", expectedOutput: "false" },
      { input: "7\n1 2 3 4 5 6 7\n3\n2 4 5", expectedOutput: "true" },
      { input: "7\n1 2 3 4 5 6 7\n3\n3 6 7", expectedOutput: "true" },
      { input: "7\n1 2 3 4 5 6 7\n3\n2 4 6", expectedOutput: "false" },
      { input: "4\n1 2 null 3\n2\n2 3", expectedOutput: "true" },
      { input: "0\n\n1\n1", expectedOutput: "false" },
      { input: "1\n1\n0\n", expectedOutput: "true" },
      { input: "12\n8 3 10 1 6 null 14 null null 4 7 13\n3\n6 4 7", expectedOutput: "true" },
      { input: "5\n1 2 3 4 5\n3\n4 5 6", expectedOutput: "false" },
    ],
  },
  {
    id: "minimum-depth-of-binary-tree",
    "hints": ["Unlike maximum depth, a missing child doesn't count as depth 0 here.","When one child is null, the minimum depth must come from the non-null child; only take the min of both when both exist."],
    returns: "int",
    title: "Minimum Depth of Binary Tree",
    difficulty: "easy",
    topic: "trees",
    companies: ["Amazon"],
    description: "Given a binary tree, find its minimum depth. The minimum depth is the number of nodes along the shortest path from the root node down to the nearest leaf node. Note that a leaf is a node with no children. Each node is a TreeNode with val, left and right properties.",
    examples: [
      { input: "7\n3 9 20 null null 15 7", output: "2", explanation: "The nearest leaf is node 9, which is 2 nodes down from the root." },
      { input: "9\n2 null 3 null 4 null 5 null 6", output: "5", explanation: "The only leaf is node 6, which is 5 nodes down from the root." },
      { input: "0\n", output: "0", explanation: "An empty tree has depth 0." },
    ],
    constraints: ["The number of nodes in the tree is in the range [0, 100000].", "-1000 <= Node.val <= 1000"],
    io: "tree",
    testCases: [
      { input: "7\n3 9 20 null null 15 7", expectedOutput: "2" },
      { input: "9\n2 null 3 null 4 null 5 null 6", expectedOutput: "5" },
      { input: "0\n", expectedOutput: "0" },
      { input: "1\n1", expectedOutput: "1" },
      { input: "3\n1 2 3", expectedOutput: "2" },
      { input: "5\n1 2 3 4 5", expectedOutput: "2" },
      { input: "4\n1 2 null 3", expectedOutput: "3" },
      { input: "7\n1 2 3 4 null null 5", expectedOutput: "3" },
      { input: "7\n1 2 3 4 null null null", expectedOutput: "2" },
      { input: "8\n1 2 null 3 null 4 null 5", expectedOutput: "5" },
      { input: "13\n5 4 8 11 null 13 4 7 2 null null null 1", expectedOutput: "3" },
      { input: "2\n1 2", expectedOutput: "2" },
    ],
  },
  {
    id: "binary-tree-right-side-view",
    "hints": ["From the right side you see exactly one node per level: the rightmost one.","Do a level-order traversal and take the last node of each level, or DFS visiting right child before left and recording the first node seen at each depth."],
    returns: "intArr",
    title: "Binary Tree Right Side View",
    difficulty: "medium",
    topic: "trees",
    companies: ["Amazon", "Microsoft"],
    description: "Given the root of a binary tree, imagine yourself standing on the right side of it. Return the values of the nodes you can see ordered from top to bottom. Each node is a TreeNode with val, left and right properties.",
    images: ["https://assets.leetcode.com/uploads/2024/11/24/tmpd5jn43fs-1.png", "https://assets.leetcode.com/uploads/2024/11/24/tmpkpe40xeh-1.png"],
    examples: [
      { input: "7\n1 2 3 null 5 null 4", output: "1 3 4", explanation: "From the right side you see 1 at level 0, 3 at level 1, and 4 at level 2." },
      { input: "3\n1 null 3", output: "1 3", explanation: "The visible nodes from the right are 1 and 3." },
      { input: "0\n", output: "", explanation: "An empty tree has no visible nodes." },
    ],
    constraints: ["The number of nodes in the tree is in the range [0, 100].", "-100 <= Node.val <= 100"],
    io: "tree",
    testCases: [
      { input: "7\n1 2 3 null 5 null 4", expectedOutput: "1 3 4" },
      { input: "3\n1 null 3", expectedOutput: "1 3" },
      { input: "0\n", expectedOutput: "" },
      { input: "1\n1", expectedOutput: "1" },
      { input: "4\n1 2 3 4", expectedOutput: "1 3 4" },
      { input: "5\n1 2 3 4 5", expectedOutput: "1 3 5" },
      { input: "5\n1 null 2 null 3", expectedOutput: "1 2 3" },
      { input: "4\n1 2 null 3", expectedOutput: "1 2 3" },
      { input: "7\n3 9 20 null null 15 7", expectedOutput: "3 20 7" },
      { input: "12\n8 3 10 1 6 null 14 null null 4 7 13", expectedOutput: "8 10 14 13" },
      { input: "11\n1 2 3 4 5 6 7 8 9 10 11", expectedOutput: "1 3 7 11" },
      { input: "7\n10 5 15 3 7 null 18", expectedOutput: "10 15 18" },
    ],
  },
  {
    id: "sum-of-left-leaves",
    "hints": ["Only leaves that are left children count, so you need to know each node's position.","Traverse passing a flag for whether the node is a left child; add its value only when it's both a leaf and a left child."],
    returns: "int",
    title: "Sum of Left Leaves",
    difficulty: "easy",
    topic: "trees",
    companies: ["Amazon"],
    description: "Given the root of a binary tree, return the sum of all left leaves. A leaf is a node with no children. A left leaf is a leaf that is the left child of another node. Each node is a TreeNode with val, left and right properties.",
    examples: [
      { input: "7\n3 9 20 null null 15 7", output: "24", explanation: "The left leaves are 9 and 15, and 9 + 15 = 24." },
      { input: "1\n1", output: "0", explanation: "A single root node is not a left leaf, so the sum is 0." },
      { input: "0\n", output: "0", explanation: "An empty tree has no leaves." },
    ],
    constraints: ["The number of nodes in the tree is in the range [0, 1000].", "-1000 <= Node.val <= 1000"],
    io: "tree",
    testCases: [
      { input: "7\n3 9 20 null null 15 7", expectedOutput: "24" },
      { input: "1\n1", expectedOutput: "0" },
      { input: "0\n", expectedOutput: "0" },
      { input: "5\n1 2 3 4 5", expectedOutput: "4" },
      { input: "3\n1 2 3", expectedOutput: "2" },
      { input: "2\n1 2", expectedOutput: "2" },
      { input: "3\n1 null 2", expectedOutput: "0" },
      { input: "12\n8 3 10 1 6 null 14 null null 4 7 13", expectedOutput: "18" },
      { input: "7\n1 2 3 4 null null 5", expectedOutput: "4" },
      { input: "4\n1 2 null 3", expectedOutput: "3" },
      { input: "7\n10 5 15 3 7 null 18", expectedOutput: "3" },
      { input: "11\n1 2 3 4 5 6 7 8 9 10 11", expectedOutput: "24" },
    ],
  }
,
  {
    "id": "lowest-common-ancestor-of-bst",
    "hints": ["The BST ordering lets you decide which subtree contains both values without searching both.","Compare p and q with the current node: if both are smaller go left, both larger go right, otherwise the current node is the LCA."],
    "returns": "int",
    "title": "Lowest Common Ancestor of a Binary Search Tree",
    "difficulty": "medium",
    "topic": "bst",
    "companies": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "description": "Given a binary search tree (BST), find the lowest common ancestor (LCA) of two given values p and q. The LCA is the deepest node that has both p and q as descendants. Return the value of the LCA node. It is guaranteed that both p and q exist in the tree. Each node is a TreeNode with val, left and right properties.",
    "examples": [
      {
        "input": "7\n6 2 8 0 4 7 9\n2 8",
        "output": "6",
        "explanation": "Both 2 and 8 are in different subtrees of 6, so 6 is their lowest common ancestor."
      },
      {
        "input": "7\n6 2 8 0 4 7 9\n2 4",
        "output": "2",
        "explanation": "Node 2 is an ancestor of 4, so the LCA of 2 and 4 is 2 itself."
      },
      {
        "input": "3\n2 1 3\n1 3",
        "output": "2",
        "explanation": "Nodes 1 and 3 sit in the left and right subtrees of 2, so the LCA is 2."
      }
    ],
    "constraints": [
      "The number of nodes in the tree is in the range [1, 10000].",
      "-100000 <= Node.val <= 100000",
      "Both p and q exist in the BST."
    ],
    "io": "tree-two-ints",
    "testCases": [
      {
        "input": "7\n6 2 8 0 4 7 9\n2 8",
        "expectedOutput": "6"
      },
      {
        "input": "7\n6 2 8 0 4 7 9\n2 4",
        "expectedOutput": "2"
      },
      {
        "input": "3\n2 1 3\n1 3",
        "expectedOutput": "2"
      },
      {
        "input": "1\n5\n5 5",
        "expectedOutput": "5"
      },
      {
        "input": "9\n10 5 15 3 7 null 18 1 null 6\n1 7",
        "expectedOutput": "5"
      },
      {
        "input": "9\n10 5 15 3 7 null 18 1 null 6\n6 18",
        "expectedOutput": "10"
      },
      {
        "input": "5\n4 2 6 1 3\n1 3",
        "expectedOutput": "2"
      },
      {
        "input": "7\n20 10 30 5 15 25 35\n5 15",
        "expectedOutput": "10"
      },
      {
        "input": "7\n20 10 30 5 15 25 35\n25 35",
        "expectedOutput": "30"
      },
      {
        "input": "3\n5 3 7\n3 7",
        "expectedOutput": "5"
      },
      {
        "input": "11\n8 3 10 1 6 null 14 null null 4 7 13\n4 13",
        "expectedOutput": "8"
      },
      {
        "input": "2\n2 1\n2 1",
        "expectedOutput": "2"
      }
    ]
  },
  {
    "id": "search-in-bst",
    "hints": ["The BST property tells you exactly which half of the tree can contain the target.","Walk down comparing the target with each node: go left if smaller, right if larger, and return true on equality or false at null."],
    "returns": "bool",
    "title": "Search in a Binary Search Tree",
    "difficulty": "easy",
    "topic": "bst",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Given the root of a binary search tree and an integer target, return true if a node with value equal to target exists in the tree, and false otherwise. Each node is a TreeNode with val, left and right properties.",
    "examples": [
      {
        "input": "7\n4 2 7 1 3 6 9\n2",
        "output": "true",
        "explanation": "The value 2 exists in the tree, in the left subtree of 4."
      },
      {
        "input": "7\n4 2 7 1 3 6 9\n5",
        "output": "false",
        "explanation": "No node in the tree holds the value 5."
      },
      {
        "input": "0\n\n7",
        "output": "false",
        "explanation": "An empty tree contains nothing, so the search fails."
      }
    ],
    "constraints": [
      "The number of nodes in the tree is in the range [0, 5000].",
      "-100000 <= Node.val <= 100000"
    ],
    "io": "tree-target",
    "testCases": [
      {
        "input": "7\n4 2 7 1 3 6 9\n2",
        "expectedOutput": "true"
      },
      {
        "input": "7\n4 2 7 1 3 6 9\n5",
        "expectedOutput": "false"
      },
      {
        "input": "0\n\n7",
        "expectedOutput": "false"
      },
      {
        "input": "1\n5\n5",
        "expectedOutput": "true"
      },
      {
        "input": "1\n5\n3",
        "expectedOutput": "false"
      },
      {
        "input": "5\n10 5 15 3 7\n7",
        "expectedOutput": "true"
      },
      {
        "input": "5\n10 5 15 3 7\n12",
        "expectedOutput": "false"
      },
      {
        "input": "3\n2 1 3\n1",
        "expectedOutput": "true"
      },
      {
        "input": "9\n8 3 10 1 6 null 14 null null 4 7 13\n13",
        "expectedOutput": "true"
      },
      {
        "input": "9\n8 3 10 1 6 null 14 null null 4 7 13\n11",
        "expectedOutput": "false"
      },
      {
        "input": "4\n5 3 null 2\n2",
        "expectedOutput": "true"
      },
      {
        "input": "4\n5 3 null 2\n6",
        "expectedOutput": "false"
      }
    ]
  },
  {
    "id": "minimum-element-in-bst",
    "hints": ["In a BST the smallest value is at an extreme position.","Follow left children from the root until there is no left child; that node's value is the minimum."],
    "returns": "int",
    "title": "Minimum Element in BST",
    "difficulty": "easy",
    "topic": "bst",
    "companies": [
      "Amazon",
      "Adobe"
    ],
    "description": "Given the root of a non-empty binary search tree, return the minimum value stored in the tree. Each node is a TreeNode with val, left and right properties.",
    "examples": [
      {
        "input": "7\n4 2 7 1 3 6 9",
        "output": "1",
        "explanation": "The leftmost node holds the smallest value, which is 1."
      },
      {
        "input": "3\n5 3 7",
        "output": "3",
        "explanation": "The smallest value in this tree is 3."
      },
      {
        "input": "1\n42",
        "output": "42",
        "explanation": "A single node tree has minimum equal to its only value."
      }
    ],
    "constraints": [
      "The number of nodes in the tree is in the range [1, 10000].",
      "1 <= Node.val <= 1000000"
    ],
    "io": "tree",
    "testCases": [
      {
        "input": "7\n4 2 7 1 3 6 9",
        "expectedOutput": "1"
      },
      {
        "input": "3\n5 3 7",
        "expectedOutput": "3"
      },
      {
        "input": "1\n42",
        "expectedOutput": "42"
      },
      {
        "input": "5\n10 5 15 3 7",
        "expectedOutput": "3"
      },
      {
        "input": "4\n8 null 10 null 12",
        "expectedOutput": "8"
      },
      {
        "input": "6\n5 3 null 2 null 1",
        "expectedOutput": "1"
      },
      {
        "input": "9\n8 3 10 1 6 null 14 null null 4 7 13",
        "expectedOutput": "1"
      },
      {
        "input": "2\n2 1",
        "expectedOutput": "1"
      },
      {
        "input": "7\n50 30 70 20 40 60 80",
        "expectedOutput": "20"
      },
      {
        "input": "3\n100 50 150",
        "expectedOutput": "50"
      },
      {
        "input": "5\n9 7 null 5 null 3",
        "expectedOutput": "3"
      },
      {
        "input": "7\n15 10 20 5 12 17 25",
        "expectedOutput": "5"
      }
    ]
  },
  {
    "id": "predecessor-and-successor-in-bst",
    "hints": ["The predecessor is the largest value below the key and the successor the smallest above it.","Walk down tracking the last node smaller than key (predecessor candidate) and the last node greater than key (successor candidate)."],
    "returns": "string",
    "title": "Predecessor and Successor in BST",
    "difficulty": "medium",
    "topic": "bst",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Given the root of a binary search tree and an integer key, find the predecessor (the largest value smaller than key) and the successor (the smallest value larger than key). Return them as two space-separated integers. If the predecessor or successor does not exist, use -1 in its place. Each node is a TreeNode with val, left and right properties.",
    "examples": [
      {
        "input": "7\n4 2 7 1 3 6 9\n5",
        "output": "4 6",
        "explanation": "The largest value below 5 is 4 and the smallest value above 5 is 6."
      },
      {
        "input": "7\n4 2 7 1 3 6 9\n1",
        "output": "-1 2",
        "explanation": "There is no value smaller than 1, and the next larger value is 2."
      },
      {
        "input": "7\n4 2 7 1 3 6 9\n9",
        "output": "7 -1",
        "explanation": "The largest value below 9 is 7 and nothing is larger than 9."
      }
    ],
    "constraints": [
      "The number of nodes in the tree is in the range [1, 10000].",
      "-100000 <= Node.val <= 100000",
      "All node values are unique."
    ],
    "io": "tree-target",
    "testCases": [
      {
        "input": "7\n4 2 7 1 3 6 9\n5",
        "expectedOutput": "4 6"
      },
      {
        "input": "7\n4 2 7 1 3 6 9\n1",
        "expectedOutput": "-1 2"
      },
      {
        "input": "7\n4 2 7 1 3 6 9\n9",
        "expectedOutput": "7 -1"
      },
      {
        "input": "7\n4 2 7 1 3 6 9\n4",
        "expectedOutput": "3 6"
      },
      {
        "input": "5\n10 5 15 3 7\n6",
        "expectedOutput": "5 7"
      },
      {
        "input": "5\n10 5 15 3 7\n1",
        "expectedOutput": "-1 3"
      },
      {
        "input": "5\n10 5 15 3 7\n20",
        "expectedOutput": "15 -1"
      },
      {
        "input": "3\n2 1 3\n2",
        "expectedOutput": "1 3"
      },
      {
        "input": "9\n8 3 10 1 6 null 14 null null 4 7 13\n9",
        "expectedOutput": "8 10"
      },
      {
        "input": "9\n8 3 10 1 6 null 14 null null 4 7 13\n0",
        "expectedOutput": "-1 1"
      },
      {
        "input": "1\n5\n5",
        "expectedOutput": "-1 -1"
      },
      {
        "input": "1\n5\n3",
        "expectedOutput": "-1 5"
      }
    ]
  },
  {
    "id": "dead-end-in-bst",
    "hints": ["A dead end is a leaf where no value can ever be inserted below it.","Track the allowed (min, max) range at each node; a leaf is a dead end when its range has no room left (min == max)."],
    "returns": "bool",
    "title": "Check Whether BST Contains Dead End",
    "difficulty": "medium",
    "topic": "bst",
    "companies": [
      "Amazon"
    ],
    "description": "Given the root of a binary search tree with all positive values, return true if the tree contains a dead end and false otherwise. A dead end is a leaf node with value x after which no further insertion is possible in its subtree. This happens when both x - 1 and x + 1 already exist in the tree. For x equal to 1, only the presence of 2 matters. Each node is a TreeNode with val, left and right properties.",
    "examples": [
      {
        "input": "8\n8 5 9 2 7 null null 1",
        "output": "true",
        "explanation": "Node 1 is a leaf and both 0 is out of range and 2 exists, so nothing more can be inserted below it."
      },
      {
        "input": "5\n10 5 15 null 7",
        "output": "false",
        "explanation": "Every leaf still has room for insertion, for example 6 can go left of 7."
      },
      {
        "input": "1\n5",
        "output": "false",
        "explanation": "A single node tree always has room to grow on both sides."
      }
    ],
    "constraints": [
      "The number of nodes in the tree is in the range [1, 10000].",
      "1 <= Node.val <= 100000",
      "All node values are unique."
    ],
    "io": "tree",
    "testCases": [
      {
        "input": "8\n8 5 9 2 7 null null 1",
        "expectedOutput": "true"
      },
      {
        "input": "5\n10 5 15 null 7",
        "expectedOutput": "false"
      },
      {
        "input": "1\n5",
        "expectedOutput": "false"
      },
      {
        "input": "7\n4 2 7 1 3 6 9",
        "expectedOutput": "true"
      },
      {
        "input": "3\n2 1 3",
        "expectedOutput": "true"
      },
      {
        "input": "3\n3 2 null",
        "expectedOutput": "false"
      },
      {
        "input": "4\n3 2 5 1",
        "expectedOutput": "true"
      },
      {
        "input": "7\n8 3 10 1 6 null 14",
        "expectedOutput": "false"
      },
      {
        "input": "5\n5 3 8 1 4",
        "expectedOutput": "true"
      },
      {
        "input": "6\n10 5 15 3 7 12",
        "expectedOutput": "false"
      },
      {
        "input": "2\n2 1",
        "expectedOutput": "true"
      },
      {
        "input": "7\n20 10 30 5 15 25 35",
        "expectedOutput": "false"
      }
    ]
  },
  {
    "id": "binary-tree-to-bst",
    "hints": ["The shape stays fixed, so you just need to place the values in BST order.","Collect all values, sort them, then write them back with an inorder traversal which fills positions in ascending order."],
    "returns": "tree",
    "title": "Binary Tree to BST",
    "difficulty": "medium",
    "topic": "bst",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Given the root of a binary tree, convert it to a binary search tree. The structure of the tree must stay exactly the same, only the node values may be rearranged. Return the root of the converted tree. Each node is a TreeNode with val, left and right properties.",
    "examples": [
      {
        "input": "7\n10 2 7 8 4 null null",
        "output": "8 4 10 2 7",
        "explanation": "Keeping the shape fixed and placing the sorted values 2 4 7 8 10 in inorder positions gives this BST."
      },
      {
        "input": "3\n1 2 3",
        "output": "2 1 3",
        "explanation": "This tree is already a BST, so it stays unchanged."
      },
      {
        "input": "1\n5",
        "output": "5",
        "explanation": "A single node is already a BST."
      }
    ],
    "constraints": [
      "The number of nodes in the tree is in the range [0, 10000].",
      "-100000 <= Node.val <= 100000"
    ],
    "io": "tree",
    "testCases": [
      {
        "input": "7\n10 2 7 8 4 null null",
        "expectedOutput": "8 4 10 2 7"
      },
      {
        "input": "3\n1 2 3",
        "expectedOutput": "2 1 3"
      },
      {
        "input": "1\n5",
        "expectedOutput": "5"
      },
      {
        "input": "0\n",
        "expectedOutput": ""
      },
      {
        "input": "5\n5 4 3 2 1",
        "expectedOutput": "4 2 5 1 3"
      },
      {
        "input": "4\n4 1 null 3",
        "expectedOutput": "4 3 null 1"
      },
      {
        "input": "5\n9 1 8 2 7",
        "expectedOutput": "8 2 9 1 7"
      },
      {
        "input": "7\n3 9 20 null null 15 7",
        "expectedOutput": "7 3 15 null null 9 20"
      },
      {
        "input": "6\n7 5 9 3 6 8",
        "expectedOutput": "7 5 9 3 6 8"
      },
      {
        "input": "2\n2 1",
        "expectedOutput": "2 1"
      },
      {
        "input": "4\n10 null 5 null 1",
        "expectedOutput": "1 null 5 null 10"
      },
      {
        "input": "17\n9 8 null 7 null 6 null 5 null 4 null 3 null 2 null 1",
        "expectedOutput": "9 8 null 7 null 6 null 5 null 4 null 3 null 2 null 1"
      }
    ]
  },
  {
    "id": "kth-largest-element-in-bst",
    "hints": ["The kth largest is the mirror image of the kth smallest.","Do a reverse inorder traversal (right, node, left) with a counter and stop at the kth visited node."],
    "returns": "int",
    "title": "Kth Largest Element in a BST",
    "difficulty": "medium",
    "topic": "bst",
    "companies": [
      "Amazon",
      "Google"
    ],
    "description": "Given the root of a binary search tree and an integer k, return the kth largest value in the tree, where k is 1-indexed. Each node is a TreeNode with val, left and right properties.",
    "examples": [
      {
        "input": "7\n4 2 7 1 3 6 9\n2",
        "output": "7",
        "explanation": "The values in decreasing order are 9 7 6 4 3 2 1, so the 2nd largest is 7."
      },
      {
        "input": "7\n4 2 7 1 3 6 9\n1",
        "output": "9",
        "explanation": "The largest value in the tree is 9."
      },
      {
        "input": "7\n4 2 7 1 3 6 9\n7",
        "output": "1",
        "explanation": "The 7th largest, which is the smallest, is 1."
      }
    ],
    "constraints": [
      "The number of nodes in the tree is n.",
      "1 <= k <= n <= 10000",
      "-100000 <= Node.val <= 100000"
    ],
    "io": "tree-k",
    "testCases": [
      {
        "input": "7\n4 2 7 1 3 6 9\n2",
        "expectedOutput": "7"
      },
      {
        "input": "7\n4 2 7 1 3 6 9\n1",
        "expectedOutput": "9"
      },
      {
        "input": "7\n4 2 7 1 3 6 9\n7",
        "expectedOutput": "1"
      },
      {
        "input": "3\n5 3 7\n1",
        "expectedOutput": "7"
      },
      {
        "input": "1\n10\n1",
        "expectedOutput": "10"
      },
      {
        "input": "9\n8 3 10 1 6 null 14 null null 4 7 13\n3",
        "expectedOutput": "10"
      },
      {
        "input": "8\n5 4 null 3 null 2 null 1\n2",
        "expectedOutput": "4"
      },
      {
        "input": "9\n1 null 2 null 3 null 4 null 5\n3",
        "expectedOutput": "3"
      },
      {
        "input": "7\n20 10 30 5 15 25 35\n4",
        "expectedOutput": "20"
      },
      {
        "input": "6\n50 30 70 20 40 60\n5",
        "expectedOutput": "30"
      },
      {
        "input": "5\n7 3 9 null 5\n2",
        "expectedOutput": "7"
      },
      {
        "input": "11\n8 3 10 1 6 null 14 null null 4 7 13\n5",
        "expectedOutput": "7"
      }
    ]
  },
  {
    "id": "delete-node-in-bst",
    "hints": ["Deleting a node with two children requires a replacement that preserves the BST property.","Find the node, then handle three cases: no children (remove), one child (bypass), two children (replace with inorder successor and delete it)."],
    "returns": "tree",
    "title": "Delete Node in a BST",
    "difficulty": "medium",
    "topic": "bst",
    "companies": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "description": "Given the root of a binary search tree and an integer key, delete the node with value equal to key and return the root of the modified tree. If the deleted node has two children, replace it with its inorder successor, which is the smallest value in its right subtree. If the key is not present, return the tree unchanged. Each node is a TreeNode with val, left and right properties.",
    "examples": [
      {
        "input": "7\n5 3 6 2 4 null 7\n3",
        "output": "5 4 6 2 null null 7",
        "explanation": "Node 3 has two children, so it is replaced by its inorder successor 4."
      },
      {
        "input": "7\n5 3 6 2 4 null 7\n5",
        "output": "6 3 7 2 4",
        "explanation": "The root 5 is replaced by its inorder successor 6."
      },
      {
        "input": "3\n2 1 3\n1",
        "output": "2 null 3",
        "explanation": "Node 1 is a leaf, so it is simply removed."
      }
    ],
    "constraints": [
      "The number of nodes in the tree is in the range [0, 10000].",
      "-100000 <= Node.val <= 100000",
      "All node values are unique."
    ],
    "io": "tree-target",
    "testCases": [
      {
        "input": "7\n5 3 6 2 4 null 7\n3",
        "expectedOutput": "5 4 6 2 null null 7"
      },
      {
        "input": "7\n5 3 6 2 4 null 7\n5",
        "expectedOutput": "6 3 7 2 4"
      },
      {
        "input": "3\n2 1 3\n1",
        "expectedOutput": "2 null 3"
      },
      {
        "input": "1\n5\n5",
        "expectedOutput": ""
      },
      {
        "input": "5\n5 3 6 2 4\n6",
        "expectedOutput": "5 3 null 2 4"
      },
      {
        "input": "3\n5 3 6\n0",
        "expectedOutput": "5 3 6"
      },
      {
        "input": "0\n\n4",
        "expectedOutput": ""
      },
      {
        "input": "7\n4 2 7 1 3 6 9\n2",
        "expectedOutput": "4 3 7 1 null 6 9"
      },
      {
        "input": "7\n10 5 15 null null 12 18\n15",
        "expectedOutput": "10 5 18 null null 12"
      },
      {
        "input": "4\n3 2 null 1\n2",
        "expectedOutput": "3 1"
      },
      {
        "input": "6\n8 3 10 1 6 null 14\n3",
        "expectedOutput": "8 6 10 1 null null 14"
      },
      {
        "input": "9\n8 3 10 1 6 null 14 null null 4 7 13\n6",
        "expectedOutput": "8 3 10 1 7 null 14 null null 4 null 13"
      }
    ]
  },
  {
    "id": "flatten-bst-to-sorted-list",
    "hints": ["The sorted order of a BST is its inorder traversal.","Do an inorder traversal while rewiring nodes: set each node's left to null and chain it as the right child of the previous node."],
    "returns": "tree",
    "title": "Flatten BST to Sorted List",
    "difficulty": "medium",
    "topic": "bst",
    "companies": [
      "Amazon"
    ],
    "description": "Given the root of a binary search tree, flatten it into a sorted linked list in increasing order. The flattened structure must use only the right child pointer to link to the next node, and the left child pointer of every node must be null. Return the head of the flattened list. Each node is a TreeNode with val, left and right properties.",
    "examples": [
      {
        "input": "7\n4 2 7 1 3 6 9",
        "output": "1 null 2 null 3 null 4 null 6 null 7 null 9",
        "explanation": "The values in increasing order are 1 2 3 4 6 7 9, linked through right pointers."
      },
      {
        "input": "1\n5",
        "output": "5",
        "explanation": "A single node is already flattened."
      },
      {
        "input": "0\n",
        "output": "",
        "explanation": "An empty tree flattens to nothing."
      }
    ],
    "constraints": [
      "The number of nodes in the tree is in the range [0, 5000].",
      "-100000 <= Node.val <= 100000"
    ],
    "io": "tree",
    "testCases": [
      {
        "input": "7\n4 2 7 1 3 6 9",
        "expectedOutput": "1 null 2 null 3 null 4 null 6 null 7 null 9"
      },
      {
        "input": "1\n5",
        "expectedOutput": "5"
      },
      {
        "input": "0\n",
        "expectedOutput": ""
      },
      {
        "input": "3\n2 1 3",
        "expectedOutput": "1 null 2 null 3"
      },
      {
        "input": "8\n5 4 null 3 null 2 null 1",
        "expectedOutput": "1 null 2 null 3 null 4 null 5"
      },
      {
        "input": "9\n1 null 2 null 3 null 4 null 5",
        "expectedOutput": "1 null 2 null 3 null 4 null 5"
      },
      {
        "input": "4\n3 2 null 1",
        "expectedOutput": "1 null 2 null 3"
      },
      {
        "input": "7\n10 5 15 3 7 12 18",
        "expectedOutput": "3 null 5 null 7 null 10 null 12 null 15 null 18"
      },
      {
        "input": "2\n2 1",
        "expectedOutput": "1 null 2"
      },
      {
        "input": "5\n6 4 8 null 5",
        "expectedOutput": "4 null 5 null 6 null 8"
      },
      {
        "input": "6\n7 3 9 1 5 8",
        "expectedOutput": "1 null 3 null 5 null 7 null 8 null 9"
      },
      {
        "input": "9\n8 3 10 1 6 null 14 null null 4 7 13",
        "expectedOutput": "1 null 3 null 4 null 6 null 7 null 8 null 10 null 13 null 14"
      }
    ]
  },
  {
    "id": "preorder-to-postorder-of-bst",
    "hints": ["You can rebuild the BST from preorder and then read off its postorder.","Insert preorder values into a BST (or build it with range bounds in O(n)), then do a postorder traversal."],
    "returns": "intArr",
    "title": "Preorder to Postorder of BST",
    "difficulty": "medium",
    "topic": "bst",
    "companies": [
      "Amazon",
      "Adobe"
    ],
    "description": "Given the preorder traversal of a binary search tree with unique values, return its postorder traversal. The first line of input is n, the number of values, and the second line holds the n preorder values.",
    "examples": [
      {
        "input": "6\n8 5 1 7 10 12",
        "output": "1 7 5 12 10 8",
        "explanation": "The BST has 8 at the root with left subtree 5 and right subtree 10, whose postorder is 1 7 5 12 10 8."
      },
      {
        "input": "3\n1 2 3",
        "output": "3 2 1",
        "explanation": "A right-skewed tree posts its nodes bottom-up as 3 2 1."
      },
      {
        "input": "3\n3 2 1",
        "output": "1 2 3",
        "explanation": "A left-skewed tree posts its nodes bottom-up as 1 2 3."
      }
    ],
    "constraints": [
      "1 <= n <= 10000",
      "-100000 <= values[i] <= 100000",
      "All values are unique and form a valid BST preorder."
    ],
    "io": "array",
    "testCases": [
      {
        "input": "6\n8 5 1 7 10 12",
        "expectedOutput": "1 7 5 12 10 8"
      },
      {
        "input": "3\n1 2 3",
        "expectedOutput": "3 2 1"
      },
      {
        "input": "3\n3 2 1",
        "expectedOutput": "1 2 3"
      },
      {
        "input": "1\n5",
        "expectedOutput": "5"
      },
      {
        "input": "6\n10 5 1 7 40 50",
        "expectedOutput": "1 7 5 50 40 10"
      },
      {
        "input": "5\n4 2 1 3 5",
        "expectedOutput": "1 3 2 5 4"
      },
      {
        "input": "8\n8 3 1 6 4 7 10 14",
        "expectedOutput": "1 4 7 6 3 14 10 8"
      },
      {
        "input": "4\n20 10 5 15",
        "expectedOutput": "5 15 10 20"
      },
      {
        "input": "2\n2 1",
        "expectedOutput": "1 2"
      },
      {
        "input": "2\n1 2",
        "expectedOutput": "2 1"
      },
      {
        "input": "9\n50 30 20 40 70 60 80 10 90",
        "expectedOutput": "10 20 40 30 60 90 80 70 50"
      },
      {
        "input": "5\n7 4 2 5 9",
        "expectedOutput": "2 5 4 9 7"
      }
    ]
  },
  {
    "id": "count-bst-nodes-in-range",
    "hints": ["The BST ordering lets you skip entire subtrees that fall outside the range.","Recurse only into subtrees that can contain in-range values: skip left when node value < l, skip right when node value > r, and count the node when l <= value <= r."],
    "returns": "int",
    "title": "Count BST Nodes That Lie in a Given Range",
    "difficulty": "easy",
    "topic": "bst",
    "companies": [
      "Amazon",
      "Google"
    ],
    "description": "Given the root of a binary search tree and two integers l and r, return the number of nodes whose values lie in the range [l, r] inclusive. Each node is a TreeNode with val, left and right properties.",
    "examples": [
      {
        "input": "7\n10 5 15 3 7 12 18\n5 15",
        "output": "5",
        "explanation": "The nodes 5 7 10 12 15 lie in the range, so the count is 5."
      },
      {
        "input": "7\n10 5 15 3 7 12 18\n1 100",
        "output": "7",
        "explanation": "Every node lies in this wide range."
      },
      {
        "input": "7\n10 5 15 3 7 12 18\n20 30",
        "output": "0",
        "explanation": "No node value reaches this range."
      }
    ],
    "constraints": [
      "The number of nodes in the tree is in the range [1, 10000].",
      "-100000 <= Node.val <= 100000",
      "l <= r"
    ],
    "io": "tree-two-ints",
    "testCases": [
      {
        "input": "7\n10 5 15 3 7 12 18\n5 15",
        "expectedOutput": "5"
      },
      {
        "input": "7\n10 5 15 3 7 12 18\n1 100",
        "expectedOutput": "7"
      },
      {
        "input": "7\n10 5 15 3 7 12 18\n20 30",
        "expectedOutput": "0"
      },
      {
        "input": "1\n5\n5 5",
        "expectedOutput": "1"
      },
      {
        "input": "1\n5\n1 4",
        "expectedOutput": "0"
      },
      {
        "input": "5\n4 2 6 1 3\n2 4",
        "expectedOutput": "3"
      },
      {
        "input": "9\n8 3 10 1 6 null 14 null null 4 7 13\n6 10",
        "expectedOutput": "4"
      },
      {
        "input": "3\n2 1 3\n1 3",
        "expectedOutput": "3"
      },
      {
        "input": "7\n4 2 7 1 3 6 9\n3 7",
        "expectedOutput": "4"
      },
      {
        "input": "5\n4 2 5 1 3\n3 5",
        "expectedOutput": "3"
      },
      {
        "input": "6\n50 30 70 20 40 60\n25 55",
        "expectedOutput": "3"
      },
      {
        "input": "4\n10 5 null 3\n4 9",
        "expectedOutput": "1"
      }
    ]
  },
  {
    "id": "inorder-successor-in-bst",
    "hints": ["The successor is the smallest value strictly greater than the key.","Walk down the tree tracking the best candidate: move left when the node is greater than key (recording it), move right otherwise."],
    "returns": "int",
    "title": "Inorder Successor in BST",
    "difficulty": "medium",
    "topic": "bst",
    "companies": [
      "Amazon",
      "Microsoft",
      "Meta"
    ],
    "description": "Given the root of a binary search tree and an integer key, return the inorder successor of the key, which is the smallest value in the tree strictly greater than key. Return -1 if no such value exists. Each node is a TreeNode with val, left and right properties.",
    "examples": [
      {
        "input": "7\n4 2 7 1 3 6 9\n5",
        "output": "6",
        "explanation": "The smallest value larger than 5 in the tree is 6."
      },
      {
        "input": "7\n4 2 7 1 3 6 9\n9",
        "output": "-1",
        "explanation": "Nothing in the tree is larger than 9."
      },
      {
        "input": "7\n4 2 7 1 3 6 9\n1",
        "output": "2",
        "explanation": "The next value after 1 is 2."
      }
    ],
    "constraints": [
      "The number of nodes in the tree is in the range [1, 10000].",
      "-100000 <= Node.val <= 100000",
      "All node values are unique."
    ],
    "io": "tree-target",
    "testCases": [
      {
        "input": "7\n4 2 7 1 3 6 9\n5",
        "expectedOutput": "6"
      },
      {
        "input": "7\n4 2 7 1 3 6 9\n9",
        "expectedOutput": "-1"
      },
      {
        "input": "7\n4 2 7 1 3 6 9\n1",
        "expectedOutput": "2"
      },
      {
        "input": "5\n20 10 30 5 15\n15",
        "expectedOutput": "20"
      },
      {
        "input": "5\n20 10 30 5 15\n30",
        "expectedOutput": "-1"
      },
      {
        "input": "3\n2 1 3\n2",
        "expectedOutput": "3"
      },
      {
        "input": "1\n5\n5",
        "expectedOutput": "-1"
      },
      {
        "input": "1\n5\n3",
        "expectedOutput": "5"
      },
      {
        "input": "9\n8 3 10 1 6 null 14 null null 4 7 13\n7",
        "expectedOutput": "8"
      },
      {
        "input": "9\n8 3 10 1 6 null 14 null null 4 7 13\n14",
        "expectedOutput": "-1"
      },
      {
        "input": "7\n10 5 15 3 7 12 18\n11",
        "expectedOutput": "12"
      },
      {
        "input": "4\n5 3 null 2\n4",
        "expectedOutput": "5"
      }
    ]
  },
  {
    "id": "convert-bst-to-balanced-bst",
    "hints": ["A balanced BST can be built directly from a sorted sequence.","Get the sorted values via inorder traversal, then recursively build the tree by picking the middle element as root."],
    "returns": "tree",
    "title": "Convert Normal BST to Balanced BST",
    "difficulty": "medium",
    "topic": "bst",
    "companies": [
      "Amazon",
      "Google"
    ],
    "description": "Given the root of a binary search tree, convert it into a height-balanced binary search tree. A height-balanced tree is one where the heights of the two subtrees of every node differ by at most one. Return the root of the balanced tree. Each node is a TreeNode with val, left and right properties.",
    "examples": [
      {
        "input": "9\n1 null 2 null 3 null 4 null 5",
        "output": "3 1 4 null 2 null 5",
        "explanation": "The sorted values rebuilt around the middle give a balanced tree rooted at 3."
      },
      {
        "input": "1\n5",
        "output": "5",
        "explanation": "A single node is already balanced."
      },
      {
        "input": "0\n",
        "output": "",
        "explanation": "An empty tree stays empty."
      }
    ],
    "constraints": [
      "The number of nodes in the tree is in the range [0, 10000].",
      "-100000 <= Node.val <= 100000"
    ],
    "io": "tree",
    "testCases": [
      {
        "input": "9\n1 null 2 null 3 null 4 null 5",
        "expectedOutput": "3 1 4 null 2 null 5"
      },
      {
        "input": "1\n5",
        "expectedOutput": "5"
      },
      {
        "input": "0\n",
        "expectedOutput": ""
      },
      {
        "input": "4\n3 2 null 1",
        "expectedOutput": "2 1 3"
      },
      {
        "input": "7\n10 5 15 3 7 12 18",
        "expectedOutput": "10 5 15 3 7 12 18"
      },
      {
        "input": "7\n4 3 null 2 null 1",
        "expectedOutput": "2 1 3 null null null 4"
      },
      {
        "input": "11\n6 5 null 4 null 3 null 2 null 1",
        "expectedOutput": "3 1 5 null 2 4 6"
      },
      {
        "input": "2\n2 1",
        "expectedOutput": "1 null 2"
      },
      {
        "input": "17\n9 8 null 7 null 6 null 5 null 4 null 3 null 2 null 1",
        "expectedOutput": "5 2 7 1 3 6 8 null null null 4 null null null 9"
      },
      {
        "input": "5\n50 30 70 20 40",
        "expectedOutput": "40 20 50 null 30 null 70"
      },
      {
        "input": "4\n1 null 2 null 3",
        "expectedOutput": "2 1 3"
      },
      {
        "input": "15\n8 7 null 6 null 5 null 4 null 3 null 2 null 1",
        "expectedOutput": "4 2 6 1 3 5 7 null null null null null null null 8"
      }
    ]
  },
  {
    "id": "merge-two-bsts",
    "hints": ["Merging two BSTs reduces to merging two sorted sequences.","Inorder-traverse both trees to get two sorted arrays, then merge them like in merge sort."],
    "returns": "intArr",
    "title": "Merge Two BSTs",
    "difficulty": "medium",
    "topic": "bst",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Given the roots of two binary search trees, return all the values from both trees merged into a single sorted array in increasing order. Each node is a TreeNode with val, left and right properties.",
    "examples": [
      {
        "input": "3\n2 1 3\n3\n5 4 6",
        "output": "1 2 3 4 5 6",
        "explanation": "Merging the sorted values 1 2 3 and 4 5 6 gives 1 2 3 4 5 6."
      },
      {
        "input": "1\n1\n1\n2",
        "output": "1 2",
        "explanation": "Two single node trees merge to 1 2."
      },
      {
        "input": "0\n\n3\n2 1 3",
        "output": "1 2 3",
        "explanation": "Merging an empty tree with 2 1 3 gives 1 2 3."
      }
    ],
    "constraints": [
      "The number of nodes in each tree is in the range [0, 5000].",
      "-100000 <= Node.val <= 100000"
    ],
    "io": "two-trees",
    "testCases": [
      {
        "input": "3\n2 1 3\n3\n5 4 6",
        "expectedOutput": "1 2 3 4 5 6"
      },
      {
        "input": "1\n1\n1\n2",
        "expectedOutput": "1 2"
      },
      {
        "input": "0\n\n3\n2 1 3",
        "expectedOutput": "1 2 3"
      },
      {
        "input": "3\n2 1 3\n0\n",
        "expectedOutput": "1 2 3"
      },
      {
        "input": "0\n\n0\n",
        "expectedOutput": ""
      },
      {
        "input": "5\n5 3 7 2 4\n5\n6 4 8 5 7",
        "expectedOutput": "2 3 4 5 5 4 7 7 6 8"
      },
      {
        "input": "7\n4 2 6 1 3 5 7\n3\n10 9 11",
        "expectedOutput": "1 2 3 4 5 6 7 9 10 11"
      },
      {
        "input": "2\n1 null 2\n2\n3 null 4",
        "expectedOutput": "1 2 3 4"
      },
      {
        "input": "4\n10 5 15 3\n4\n20 12 25 18",
        "expectedOutput": "3 5 10 15 18 12 20 25"
      },
      {
        "input": "5\n8 3 10 1 6\n5\n8 3 10 1 6",
        "expectedOutput": "1 1 3 3 6 6 8 8 10 10"
      },
      {
        "input": "3\n100 50 150\n2\n75 60",
        "expectedOutput": "50 60 75 100 150"
      },
      {
        "input": "6\n7 3 9 1 5 8\n4\n2 1 3 4",
        "expectedOutput": "1 3 4 1 2 3 5 7 8 9"
      }
    ]
  },
  {
    "id": "conflicting-appointments",
    "hints": ["Two appointments conflict when their intervals overlap.","Sort appointments by start time and check each against the previous ones for overlap, or sweep through sorted endpoints tracking active intervals."],
    "returns": "intArr",
    "title": "Find All Conflicting Appointments",
    "difficulty": "medium",
    "topic": "bst",
    "companies": [
      "Amazon",
      "Google"
    ],
    "description": "You are given n appointments, each with a start time and an end time. Two appointments conflict if their time intervals overlap. The first line of input is n, and the second line holds 2n integers as s1 e1 s2 e2 and so on. Return the 0-based indices of all appointments that conflict with at least one other appointment, in increasing order. If there are no conflicts, return an empty result.",
    "examples": [
      {
        "input": "3\n1 3 2 4 5 6",
        "output": "0 1",
        "explanation": "Appointments 0 and 1 overlap in [2, 3), while appointment 2 stands alone."
      },
      {
        "input": "2\n1 2 3 4",
        "output": "",
        "explanation": "The two appointments do not overlap, so there are no conflicts."
      },
      {
        "input": "2\n1 5 2 3",
        "output": "0 1",
        "explanation": "Appointment 1 sits fully inside appointment 0, so both conflict."
      }
    ],
    "constraints": [
      "1 <= n <= 1000",
      "0 <= start < end <= 1000000"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "3\n1 3 2 4 5 6",
        "expectedOutput": "0 1"
      },
      {
        "input": "2\n1 2 3 4",
        "expectedOutput": ""
      },
      {
        "input": "2\n1 5 2 3",
        "expectedOutput": "0 1"
      },
      {
        "input": "4\n1 2 2 3 3 4 1 4",
        "expectedOutput": "0 1 2 3"
      },
      {
        "input": "1\n1 10",
        "expectedOutput": ""
      },
      {
        "input": "3\n1 10 2 3 4 5",
        "expectedOutput": "0 1 2"
      },
      {
        "input": "5\n1 3 5 7 9 11 13 15 2 6",
        "expectedOutput": "0 1 4"
      },
      {
        "input": "4\n10 20 15 25 30 40 35 45",
        "expectedOutput": "0 1 2 3"
      },
      {
        "input": "3\n1 2 3 4 5 6",
        "expectedOutput": ""
      },
      {
        "input": "6\n1 5 6 10 2 3 7 8 4 9 11 12",
        "expectedOutput": "0 1 2 3 4"
      },
      {
        "input": "2\n5 5 5 5",
        "expectedOutput": ""
      },
      {
        "input": "4\n1 100 2 3 4 5 6 7",
        "expectedOutput": "0 1 2 3"
      }
    ]
  },
  {
    "id": "replace-with-least-greater-on-right",
    "hints": ["Processing right to left lets you maintain the set of values seen so far.","Scan from right to left keeping a balanced BST (or sorted structure) of seen values; for each element find its successor, then insert the element."],
    "returns": "intArr",
    "title": "Replace Every Element with the Least Greater Element on Its Right",
    "difficulty": "medium",
    "topic": "bst",
    "companies": [
      "Amazon"
    ],
    "description": "Given an array, replace every element with the least greater element on its right side. If no greater element exists on the right, replace it with -1. The first line of input is n, the size of the array, and the second line holds the n values. Return the modified array.",
    "examples": [
      {
        "input": "6\n8 58 71 18 31 32",
        "output": "18 71 -1 31 32 -1",
        "explanation": "For 8 the least greater on the right is 18, for 71 nothing is greater so it becomes -1."
      },
      {
        "input": "4\n1 2 3 4",
        "output": "2 3 4 -1",
        "explanation": "Each element is followed by a larger one except the last."
      },
      {
        "input": "4\n4 3 2 1",
        "output": "-1 -1 -1 -1",
        "explanation": "No element has anything greater on its right."
      }
    ],
    "constraints": [
      "1 <= n <= 10000",
      "-100000 <= arr[i] <= 100000"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "6\n8 58 71 18 31 32",
        "expectedOutput": "18 71 -1 31 32 -1"
      },
      {
        "input": "4\n1 2 3 4",
        "expectedOutput": "2 3 4 -1"
      },
      {
        "input": "4\n4 3 2 1",
        "expectedOutput": "-1 -1 -1 -1"
      },
      {
        "input": "1\n5",
        "expectedOutput": "-1"
      },
      {
        "input": "5\n5 5 5 5 5",
        "expectedOutput": "-1 -1 -1 -1 -1"
      },
      {
        "input": "7\n10 100 93 70 92 80 1",
        "expectedOutput": "70 -1 -1 80 -1 -1 -1"
      },
      {
        "input": "3\n3 1 2",
        "expectedOutput": "-1 2 -1"
      },
      {
        "input": "8\n2 7 1 8 2 8 1 8",
        "expectedOutput": "7 8 2 -1 8 -1 8 -1"
      },
      {
        "input": "2\n1 100",
        "expectedOutput": "100 -1"
      },
      {
        "input": "2\n100 1",
        "expectedOutput": "-1 -1"
      },
      {
        "input": "6\n6 1 5 2 4 3",
        "expectedOutput": "-1 2 -1 3 -1 -1"
      },
      {
        "input": "5\n9 8 7 6 5",
        "expectedOutput": "-1 -1 -1 -1 -1"
      }
    ]
  },
  {
    "id": "construct-bst-from-preorder",
    "hints": ["Inserting preorder values in order with standard BST insertion rebuilds the tree.","Insert each value one by one: go left if smaller than the node, right if larger; or build in O(n) using min/max bounds."],
    "returns": "tree",
    "title": "Construct BST from Given Preorder Traversal",
    "difficulty": "medium",
    "topic": "bst",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Given the preorder traversal of a binary search tree with unique values, construct the BST by inserting the values in the given order using standard BST insertion, and return its root. The first line of input is n, the number of values, and the second line holds the n preorder values. Each node is a TreeNode with val, left and right properties.",
    "examples": [
      {
        "input": "6\n8 5 1 7 10 12",
        "output": "8 5 10 1 7 null 12",
        "explanation": "Inserting 8 5 1 7 10 12 in order builds this BST."
      },
      {
        "input": "3\n1 2 3",
        "output": "1 null 2 null 3",
        "explanation": "Increasing values form a right-skewed tree."
      },
      {
        "input": "3\n3 2 1",
        "output": "3 2 null 1",
        "explanation": "Decreasing values form a left-skewed tree."
      }
    ],
    "constraints": [
      "1 <= n <= 10000",
      "-100000 <= values[i] <= 100000",
      "All values are unique and form a valid BST preorder."
    ],
    "io": "array",
    "testCases": [
      {
        "input": "6\n8 5 1 7 10 12",
        "expectedOutput": "8 5 10 1 7 null 12"
      },
      {
        "input": "3\n1 2 3",
        "expectedOutput": "1 null 2 null 3"
      },
      {
        "input": "3\n3 2 1",
        "expectedOutput": "3 2 null 1"
      },
      {
        "input": "1\n5",
        "expectedOutput": "5"
      },
      {
        "input": "6\n10 5 1 7 40 50",
        "expectedOutput": "10 5 40 1 7 null 50"
      },
      {
        "input": "4\n4 2 1 3",
        "expectedOutput": "4 2 null 1 3"
      },
      {
        "input": "5\n7 4 2 5 9",
        "expectedOutput": "7 4 9 2 5"
      },
      {
        "input": "8\n8 3 1 6 4 7 10 14",
        "expectedOutput": "8 3 10 1 6 null 14 null null 4 7"
      },
      {
        "input": "2\n2 1",
        "expectedOutput": "2 1"
      },
      {
        "input": "2\n1 2",
        "expectedOutput": "1 null 2"
      },
      {
        "input": "9\n50 30 20 40 70 60 80 10 90",
        "expectedOutput": "50 30 70 20 40 60 80 10 null null null null null null 90"
      },
      {
        "input": "5\n20 10 5 15 30",
        "expectedOutput": "20 10 30 5 15"
      }
    ]
  },
  {
    "id": "median-of-bst",
    "hints": ["The median is the middle value (or average of two middles) of the sorted order.","Count the nodes, then do an inorder traversal stopping at the middle position(s) to compute the median."],
    "returns": "string",
    "title": "Find Median of BST",
    "difficulty": "medium",
    "topic": "bst",
    "companies": [
      "Amazon"
    ],
    "description": "Given the root of a binary search tree, return its median. If the tree has an odd number of nodes, the median is the middle value in sorted order. If it has an even number of nodes, the median is the average of the two middle values. Return the median as a string, using a .5 suffix when the average is not a whole number. Each node is a TreeNode with val, left and right properties.",
    "examples": [
      {
        "input": "7\n4 2 6 1 3 5 7",
        "output": "4",
        "explanation": "The sorted values are 1 2 3 4 5 6 7, so the middle value is 4."
      },
      {
        "input": "6\n4 2 6 1 3 5",
        "output": "3.5",
        "explanation": "The sorted values are 1 2 3 4 5 6, and the average of 3 and 4 is 3.5."
      },
      {
        "input": "1\n5",
        "output": "5",
        "explanation": "A single node tree has median equal to its value."
      }
    ],
    "constraints": [
      "The number of nodes in the tree is in the range [1, 10000].",
      "-100000 <= Node.val <= 100000"
    ],
    "io": "tree",
    "testCases": [
      {
        "input": "7\n4 2 6 1 3 5 7",
        "expectedOutput": "4"
      },
      {
        "input": "6\n4 2 6 1 3 5",
        "expectedOutput": "3.5"
      },
      {
        "input": "1\n5",
        "expectedOutput": "5"
      },
      {
        "input": "2\n2 1",
        "expectedOutput": "1.5"
      },
      {
        "input": "3\n2 1 3",
        "expectedOutput": "2"
      },
      {
        "input": "4\n4 2 6 1",
        "expectedOutput": "3"
      },
      {
        "input": "5\n5 3 7 2 4",
        "expectedOutput": "4"
      },
      {
        "input": "8\n8 4 12 2 6 10 14 1",
        "expectedOutput": "7"
      },
      {
        "input": "9\n9 5 13 3 7 11 15 1 4",
        "expectedOutput": "7"
      },
      {
        "input": "5\n10 5 15 3 7",
        "expectedOutput": "7"
      },
      {
        "input": "6\n10 5 15 null null 12",
        "expectedOutput": "11"
      },
      {
        "input": "7\n20 10 30 5 15 25 35",
        "expectedOutput": "20"
      }
    ]
  },
  {
    "id": "largest-bst-in-binary-tree",
    "hints": ["For each subtree you need to know whether it's a BST and, if so, its size and value range.","Return a tuple (is_bst, size, min, max) bottom-up; a node forms a BST when both children are BSTs and max(left) < node < min(right), tracking the largest such size."],
    "returns": "int",
    "title": "Largest BST in a Binary Tree",
    "difficulty": "hard",
    "topic": "bst",
    "companies": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "description": "Given the root of a binary tree, return the number of nodes in the largest subtree which is a valid binary search tree. A subtree of a binary tree is a tree consisting of a node and all of its descendants. Each node is a TreeNode with val, left and right properties.",
    "examples": [
      {
        "input": "7\n10 5 15 1 8 null 7",
        "output": "3",
        "explanation": "The subtree rooted at 5 with nodes 1 5 8 is a valid BST of size 3, and no larger BST subtree exists."
      },
      {
        "input": "3\n2 1 3",
        "output": "3",
        "explanation": "The whole tree is a valid BST."
      },
      {
        "input": "3\n5 1 4",
        "output": "1",
        "explanation": "No subtree larger than a single node is a valid BST."
      }
    ],
    "constraints": [
      "The number of nodes in the tree is in the range [0, 10000].",
      "-100000 <= Node.val <= 100000"
    ],
    "io": "tree",
    "testCases": [
      {
        "input": "7\n10 5 15 1 8 null 7",
        "expectedOutput": "3"
      },
      {
        "input": "3\n2 1 3",
        "expectedOutput": "3"
      },
      {
        "input": "3\n5 1 4",
        "expectedOutput": "1"
      },
      {
        "input": "1\n5",
        "expectedOutput": "1"
      },
      {
        "input": "0\n",
        "expectedOutput": "0"
      },
      {
        "input": "7\n4 2 6 1 3 5 7",
        "expectedOutput": "7"
      },
      {
        "input": "5\n3 2 5 1 4",
        "expectedOutput": "3"
      },
      {
        "input": "6\n6 4 8 3 5 7",
        "expectedOutput": "6"
      },
      {
        "input": "4\n1 2 3 4",
        "expectedOutput": "1"
      },
      {
        "input": "11\n8 3 10 1 6 null 14 null null 4 7 13",
        "expectedOutput": "9"
      },
      {
        "input": "7\n5 3 8 1 4 7 9",
        "expectedOutput": "7"
      },
      {
        "input": "8\n10 5 12 4 7 11 15 3",
        "expectedOutput": "8"
      }
    ]
  }
,
  {
    id: "flood-fill",
    "hints": ["Think of this as a connectivity problem on a grid: the starting pixel's original color defines the region, and every 4-directionally adjacent pixel with that same color belongs to it.","Use BFS or DFS from (sr, sc) with a visited set (or mark in place), expanding only into cells matching the original color; guard against the case where newColor equals the old color."],
    returns: "intMat",
    title: "Flood Fill",
    difficulty: "easy",
    topic: "graphs",
    companies: [
      "Amazon",
      "Google",
      "Meta"
    ],
    description: "An image is represented by an r x c grid of integers. Given a starting pixel (sr, sc) and a new color, perform a flood fill: change the color of the starting pixel and every pixel 4-directionally connected to it that has the same original color, to the new color. Input format: first line r c, then r rows of the grid, then a line sr sc newColor. Output the modified grid, one row per line.",
    examples: [
      {
        input: "3 3\n1 1 1\n1 1 0\n1 0 1\n1 1 2",
        output: "2 2 2\n2 2 0\n2 0 1",
        explanation: "Pixels 4-connected to (1,1) with value 1 become 2."
      },
      {
        input: "3 3\n0 0 0\n0 0 0\n0 0 0\n0 0 0",
        output: "0 0 0\n0 0 0\n0 0 0",
        explanation: "New color equals the old color, so the grid is unchanged."
      },
      {
        input: "1 2\n1 2\n0 1 3",
        output: "1 3",
        explanation: "The pixel (0,1) has value 2 and is recolored to 3."
      }
    ],
    constraints: [
      "1 <= r, c <= 50",
      "0 <= grid[i][j], newColor <= 100",
      "0 <= sr < r, 0 <= sc < c"
    ],
    io: "matrix-three-ints",
    testCases: [
      {
        input: "3 3\n1 1 1\n1 1 0\n1 0 1\n1 1 2",
        expectedOutput: "2 2 2\n2 2 0\n2 0 1"
      },
      {
        input: "3 3\n0 0 0\n0 0 0\n0 0 0\n0 0 0",
        expectedOutput: "0 0 0\n0 0 0\n0 0 0"
      },
      {
        input: "1 2\n1 2\n0 1 3",
        expectedOutput: "1 3"
      },
      {
        input: "2 2\n1 1\n1 1\n0 0 2",
        expectedOutput: "2 2\n2 2"
      },
      {
        input: "2 3\n1 2 1\n1 1 1\n0 0 5",
        expectedOutput: "5 2 5\n5 5 5"
      },
      {
        input: "3 3\n1 1 1\n1 2 1\n1 1 1\n1 1 9",
        expectedOutput: "1 1 1\n1 9 1\n1 1 1"
      },
      {
        input: "1 1\n7\n0 0 3",
        expectedOutput: "3"
      },
      {
        input: "4 4\n0 1 0 1\n1 0 1 0\n0 1 0 1\n1 0 1 0\n0 1 2",
        expectedOutput: "0 2 0 1\n1 0 1 0\n0 1 0 1\n1 0 1 0"
      },
      {
        input: "3 4\n2 2 2 2\n2 2 2 2\n2 2 2 2\n2 2 1",
        expectedOutput: "1 1 1 1\n1 1 1 1\n1 1 1 1"
      },
      {
        input: "5 1\n1\n2\n1\n2\n1\n2 0 9",
        expectedOutput: "1\n2\n9\n2\n1"
      },
      {
        input: "2 2\n3 3\n3 4\n0 0 4",
        expectedOutput: "4 4\n4 4"
      },
      {
        input: "3 3\n5 5 5\n5 0 5\n5 5 5\n1 1 8",
        expectedOutput: "5 5 5\n5 8 5\n5 5 5"
      }
    ]
  },
  {
    id: "number-of-triangles",
    "hints": ["A triangle is formed whenever two neighbors of a node are also connected to each other, so anchor your counting at a node and examine its neighborhood pairs.","Build an adjacency set for O(1) edge lookups, then for each node check all pairs of its neighbors for an edge between them, dividing the total by 3 to correct for overcounting."],
    returns: "int",
    title: "Number of Triangles in a Graph",
    difficulty: "medium",
    topic: "graphs",
    companies: [
      "Amazon",
      "Microsoft"
    ],
    description: "Given an undirected graph with n nodes labeled 0 to n-1 and m edges, count the number of distinct triangles. A triangle is a set of three nodes where each pair is connected by an edge. Input format: first line n m, then m lines u v.",
    examples: [
      {
        input: "3 3\n0 1\n1 2\n2 0",
        output: "1",
        explanation: "The three nodes form exactly one triangle."
      },
      {
        input: "4 3\n0 1\n1 2\n2 3",
        output: "0",
        explanation: "A simple path has no triangles."
      },
      {
        input: "4 6\n0 1\n0 2\n0 3\n1 2\n1 3\n2 3",
        output: "4",
        explanation: "A complete graph on 4 nodes has 4 triangles."
      }
    ],
    constraints: [
      "1 <= n <= 50",
      "0 <= m <= n*(n-1)/2",
      "No duplicate edges"
    ],
    io: "graph",
    testCases: [
      {
        input: "3 3\n0 1\n1 2\n2 0",
        expectedOutput: "1"
      },
      {
        input: "4 3\n0 1\n1 2\n2 3",
        expectedOutput: "0"
      },
      {
        input: "4 6\n0 1\n0 2\n0 3\n1 2\n1 3\n2 3",
        expectedOutput: "4"
      },
      {
        input: "5 10\n0 1\n0 2\n0 3\n0 4\n1 2\n1 3\n1 4\n2 3\n2 4\n3 4",
        expectedOutput: "10"
      },
      {
        input: "6 6\n0 1\n1 2\n2 0\n3 4\n4 5\n5 3",
        expectedOutput: "2"
      },
      {
        input: "1 0",
        expectedOutput: "0"
      },
      {
        input: "2 1\n0 1",
        expectedOutput: "0"
      },
      {
        input: "5 4\n0 1\n0 2\n0 3\n0 4",
        expectedOutput: "0"
      },
      {
        input: "5 6\n0 1\n1 2\n2 0\n2 3\n3 4\n4 2",
        expectedOutput: "2"
      },
      {
        input: "6 9\n0 1\n0 2\n1 2\n3 4\n3 5\n4 5\n0 3\n1 4\n2 5",
        expectedOutput: "2"
      },
      {
        input: "4 5\n0 1\n0 2\n0 3\n1 2\n1 3",
        expectedOutput: "2"
      },
      {
        input: "7 6\n0 1\n1 2\n2 0\n3 4\n4 5\n5 3",
        expectedOutput: "2"
      }
    ]
  },
  {
    id: "detect-cycle-directed-graph",
    "hints": ["A cycle exists if you can return to a node that is currently on your exploration path — this is different from undirected graphs, where you must also handle the parent edge.","Run DFS with a three-color scheme (unvisited, in-recursion-stack, finished) or a recursion-stack set: reaching a node marked 'in stack' confirms a directed cycle."],
    returns: "bool",
    title: "Detect Cycle in a Directed Graph",
    difficulty: "medium",
    topic: "graphs",
    companies: [
      "Amazon",
      "Microsoft",
      "Flipkart"
    ],
    description: "Given a directed graph with n nodes labeled 0 to n-1 and m directed edges, determine whether the graph contains a cycle. Input format: first line n m, then m lines u v representing a directed edge from u to v. Output true if a cycle exists, false otherwise.",
    examples: [
      {
        input: "3 3\n0 1\n1 2\n2 0",
        output: "true",
        explanation: "0 -> 1 -> 2 -> 0 forms a cycle."
      },
      {
        input: "3 2\n0 1\n1 2",
        output: "false",
        explanation: "A simple directed path has no cycle."
      },
      {
        input: "4 4\n0 1\n1 2\n2 3\n3 1",
        output: "true",
        explanation: "1 -> 2 -> 3 -> 1 forms a cycle."
      }
    ],
    constraints: [
      "1 <= n <= 100",
      "0 <= m <= n*(n-1)",
      "No duplicate edges"
    ],
    io: "graph",
    testCases: [
      {
        input: "3 3\n0 1\n1 2\n2 0",
        expectedOutput: "true"
      },
      {
        input: "3 2\n0 1\n1 2",
        expectedOutput: "false"
      },
      {
        input: "4 4\n0 1\n1 2\n2 3\n3 1",
        expectedOutput: "true"
      },
      {
        input: "1 1\n0 0",
        expectedOutput: "true"
      },
      {
        input: "5 4\n0 1\n0 2\n1 3\n2 4",
        expectedOutput: "false"
      },
      {
        input: "4 5\n0 1\n1 2\n2 0\n2 3\n3 3",
        expectedOutput: "true"
      },
      {
        input: "6 6\n0 1\n1 2\n2 3\n3 4\n4 5\n5 2",
        expectedOutput: "true"
      },
      {
        input: "2 0",
        expectedOutput: "false"
      },
      {
        input: "4 3\n0 1\n2 3\n1 2",
        expectedOutput: "false"
      },
      {
        input: "5 5\n0 1\n1 2\n3 4\n4 3\n2 3",
        expectedOutput: "true"
      },
      {
        input: "3 3\n0 1\n0 2\n1 2",
        expectedOutput: "false"
      },
      {
        input: "6 5\n5 4\n4 3\n3 2\n2 1\n1 0",
        expectedOutput: "false"
      }
    ]
  },
  {
    id: "detect-cycle-undirected-graph",
    "hints": ["A cycle exists if you encounter a node you've already visited that is not the node you just came from — note that a self-loop is also a cycle.","Run DFS or BFS with a visited set plus parent tracking; if you reach an already-visited neighbor that is not your parent, a cycle is present."],
    returns: "bool",
    title: "Detect Cycle in an Undirected Graph",
    difficulty: "medium",
    topic: "graphs",
    companies: [
      "Amazon",
      "Adobe",
      "Samsung"
    ],
    description: "Given an undirected graph with n nodes labeled 0 to n-1 and m edges, determine whether the graph contains a cycle. Input format: first line n m, then m lines u v. Output true if a cycle exists, false otherwise.",
    examples: [
      {
        input: "3 3\n0 1\n1 2\n2 0",
        output: "true",
        explanation: "The three nodes form a cycle."
      },
      {
        input: "4 3\n0 1\n1 2\n2 3",
        output: "false",
        explanation: "A simple path has no cycle."
      },
      {
        input: "6 6\n0 1\n1 2\n2 0\n3 4\n4 5\n5 5",
        output: "true",
        explanation: "The self-loop at node 5 is a cycle."
      }
    ],
    constraints: [
      "1 <= n <= 100",
      "0 <= m <= n*(n-1)/2",
      "No duplicate edges"
    ],
    io: "graph",
    testCases: [
      {
        input: "3 3\n0 1\n1 2\n2 0",
        expectedOutput: "true"
      },
      {
        input: "4 3\n0 1\n1 2\n2 3",
        expectedOutput: "false"
      },
      {
        input: "6 6\n0 1\n1 2\n2 0\n3 4\n4 5\n5 5",
        expectedOutput: "true"
      },
      {
        input: "1 0",
        expectedOutput: "false"
      },
      {
        input: "2 1\n0 1",
        expectedOutput: "false"
      },
      {
        input: "5 4\n0 1\n0 2\n0 3\n0 4",
        expectedOutput: "false"
      },
      {
        input: "4 4\n0 1\n1 2\n2 3\n3 0",
        expectedOutput: "true"
      },
      {
        input: "6 5\n0 1\n2 3\n3 4\n4 5\n5 2",
        expectedOutput: "true"
      },
      {
        input: "3 2\n0 1\n0 2",
        expectedOutput: "false"
      },
      {
        input: "7 6\n0 1\n1 2\n3 4\n4 5\n5 6\n6 3",
        expectedOutput: "true"
      },
      {
        input: "4 6\n0 1\n0 2\n0 3\n1 2\n1 3\n2 3",
        expectedOutput: "true"
      },
      {
        input: "5 0",
        expectedOutput: "false"
      }
    ]
  },
  {
    id: "rat-in-maze",
    "hints": ["You need to enumerate every simple path from start to finish, so this is an exhaustive search problem where each path must remember the cells it has used.","Use recursive backtracking DFS in the fixed move order D, L, R, U (which yields lexicographic ordering), marking cells visited on entry and unmarking on backtrack."],
    returns: "string",
    title: "Rat in a Maze",
    difficulty: "medium",
    topic: "graphs",
    companies: [
      "Amazon",
      "Microsoft",
      "Adobe"
    ],
    description: "A rat starts at cell (0,0) of an r x c binary matrix and wants to reach cell (r-1,c-1). The rat can move one step in four directions: D (down), L (left), R (right), U (up), only through cells containing 1, and cannot visit any cell more than once in a single path. Input format: first line r c, then r rows of 0s and 1s. Output all valid paths as strings of moves, sorted lexicographically and separated by a single space. Output -1 if no path exists.",
    examples: [
      {
        input: "4 4\n1 0 0 0\n1 1 0 1\n1 1 0 0\n0 1 1 1",
        output: "DDRDRR DRDDRR",
        explanation: "Two valid paths exist from start to finish."
      },
      {
        input: "2 2\n1 0\n1 0",
        output: "-1",
        explanation: "The destination is blocked, so no path exists."
      },
      {
        input: "2 2\n1 1\n1 1",
        output: "DR RD",
        explanation: "Both DR and RD reach the destination."
      }
    ],
    constraints: [
      "1 <= r, c <= 8",
      "Matrix contains only 0 and 1"
    ],
    io: "matrix",
    testCases: [
      {
        input: "4 4\n1 0 0 0\n1 1 0 1\n1 1 0 0\n0 1 1 1",
        expectedOutput: "DDRDRR DRDDRR"
      },
      {
        input: "2 2\n1 0\n1 0",
        expectedOutput: "-1"
      },
      {
        input: "2 2\n1 1\n1 1",
        expectedOutput: "DR RD"
      },
      {
        input: "1 1\n1",
        expectedOutput: ""
      },
      {
        input: "3 3\n1 1 1\n1 1 1\n1 1 1",
        expectedOutput: "DDRR DDRURD DDRUURDD DRDR DRRD DRURDD RDDR RDLDRR RDRD RRDD RRDLDR RRDLLDRR"
      },
      {
        input: "3 3\n1 0 0\n1 1 0\n0 1 1",
        expectedOutput: "DRDR"
      },
      {
        input: "2 3\n1 1 1\n1 1 1",
        expectedOutput: "DRR DRURD RDR RRD"
      },
      {
        input: "3 3\n0 1 1\n1 1 1\n1 1 1",
        expectedOutput: "-1"
      },
      {
        input: "3 3\n1 1 1\n1 1 1\n1 1 0",
        expectedOutput: "-1"
      },
      {
        input: "1 4\n1 1 1 1",
        expectedOutput: "RRR"
      },
      {
        input: "4 1\n1\n1\n1\n1",
        expectedOutput: "DDD"
      },
      {
        input: "3 4\n1 1 0 1\n1 1 1 1\n0 1 1 1",
        expectedOutput: "DRDRR DRDRURD DRRDR DRRRD RDDRR RDDRURD RDRDR RDRRD"
      }
    ]
  },
  {
    id: "clone-graph",
    "hints": ["The challenge is that nodes can be reached through multiple paths, so you must reuse already-created copies rather than duplicating nodes.","Do a BFS/DFS traversal keeping a hash map from original node id to its clone; create each clone on first visit and wire up neighbor lists afterward."],
    returns: "string",
    title: "Clone Graph",
    difficulty: "medium",
    topic: "graphs",
    companies: [
      "Google",
      "Amazon",
      "Meta"
    ],
    description: "Given an undirected graph with n nodes labeled 0 to n-1 as an edge list, clone it and output the adjacency list of the cloned graph. Input format: first line n m, then m lines u v. Output format: for each node i from 0 to n-1, print i followed by a colon and its sorted neighbor list, with nodes separated by ;  (for example: 0: 1 2; 1: 0 2; 2: 0 1). Output an empty string for an empty graph.",
    examples: [
      {
        input: "4 4\n0 1\n1 2\n2 3\n3 0",
        output: "0: 1 3; 1: 0 2; 2: 1 3; 3: 0 2",
        explanation: "Each node keeps its two neighbors in the clone."
      },
      {
        input: "1 0",
        output: "0: ",
        explanation: "A single isolated node clones to itself."
      },
      {
        input: "0 0",
        output: "",
        explanation: "An empty graph clones to an empty graph."
      }
    ],
    constraints: [
      "0 <= n <= 50",
      "0 <= m <= n*(n-1)/2",
      "No duplicate edges"
    ],
    io: "graph",
    testCases: [
      {
        input: "4 4\n0 1\n1 2\n2 3\n3 0",
        expectedOutput: "0: 1 3; 1: 0 2; 2: 1 3; 3: 0 2"
      },
      {
        input: "1 0",
        expectedOutput: "0: "
      },
      {
        input: "0 0",
        expectedOutput: ""
      },
      {
        input: "3 3\n0 1\n1 2\n2 0",
        expectedOutput: "0: 1 2; 1: 0 2; 2: 0 1"
      },
      {
        input: "5 4\n0 1\n0 2\n0 3\n0 4",
        expectedOutput: "0: 1 2 3 4; 1: 0; 2: 0; 3: 0; 4: 0"
      },
      {
        input: "2 1\n0 1",
        expectedOutput: "0: 1; 1: 0"
      },
      {
        input: "4 2\n0 1\n2 3",
        expectedOutput: "0: 1; 1: 0; 2: 3; 3: 2"
      },
      {
        input: "3 0",
        expectedOutput: "0: ; 1: ; 2: "
      },
      {
        input: "6 5\n0 1\n1 2\n2 3\n3 4\n4 5",
        expectedOutput: "0: 1; 1: 0 2; 2: 1 3; 3: 2 4; 4: 3 5; 5: 4"
      },
      {
        input: "4 6\n0 1\n0 2\n0 3\n1 2\n1 3\n2 3",
        expectedOutput: "0: 1 2 3; 1: 0 2 3; 2: 0 1 3; 3: 0 1 2"
      },
      {
        input: "5 5\n0 1\n1 2\n2 3\n3 4\n4 0",
        expectedOutput: "0: 1 4; 1: 0 2; 2: 1 3; 3: 2 4; 4: 0 3"
      },
      {
        input: "2 0",
        expectedOutput: "0: ; 1: "
      }
    ]
  },
  {
    id: "operations-to-connect-network",
    "hints": ["To connect n computers you need at least n-1 cables; a cable is 'usable' for rewiring only if removing it doesn't split a component apart.","Find connected components with union-find or DFS; if the cable count is below n-1 return -1, otherwise the answer is components minus 1 (redundant cables are counted as excess edges)."],
    returns: "int",
    title: "Number of Operations to Make Network Connected",
    difficulty: "medium",
    topic: "graphs",
    companies: [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    description: "There are n computers labeled 0 to n-1 connected by m cable connections. You can remove a cable between two directly connected computers and place it between any two disconnected computers. Return the minimum number of such operations needed so that all computers are connected. Return -1 if it is impossible. Input format: first line n m, then m lines u v.",
    examples: [
      {
        input: "4 3\n0 1\n0 2\n1 2",
        output: "1",
        explanation: "Move one redundant cable to connect node 3."
      },
      {
        input: "6 3\n0 1\n0 2\n3 4",
        output: "-1",
        explanation: "Only 3 cables exist but 5 are needed to connect 6 computers."
      },
      {
        input: "5 4\n0 1\n0 2\n3 4\n2 3",
        output: "0",
        explanation: "All computers are already connected."
      }
    ],
    constraints: [
      "1 <= n <= 100",
      "0 <= m <= n*(n-1)/2",
      "No duplicate connections"
    ],
    io: "graph",
    testCases: [
      {
        input: "4 3\n0 1\n0 2\n1 2",
        expectedOutput: "1"
      },
      {
        input: "6 3\n0 1\n0 2\n3 4",
        expectedOutput: "-1"
      },
      {
        input: "5 4\n0 1\n0 2\n3 4\n2 3",
        expectedOutput: "0"
      },
      {
        input: "1 0",
        expectedOutput: "0"
      },
      {
        input: "2 0",
        expectedOutput: "-1"
      },
      {
        input: "3 3\n0 1\n1 2\n0 2",
        expectedOutput: "0"
      },
      {
        input: "8 6\n0 1\n1 2\n2 0\n3 4\n4 5\n6 7",
        expectedOutput: "-1"
      },
      {
        input: "8 7\n0 1\n1 2\n2 0\n3 4\n4 5\n5 3\n6 7",
        expectedOutput: "2"
      },
      {
        input: "4 4\n0 1\n1 2\n2 3\n3 0",
        expectedOutput: "0"
      },
      {
        input: "10 9\n0 1\n1 2\n2 3\n3 4\n5 6\n6 7\n7 8\n8 9\n4 5",
        expectedOutput: "0"
      },
      {
        input: "5 2\n0 1\n2 3",
        expectedOutput: "-1"
      },
      {
        input: "6 6\n0 1\n1 2\n2 0\n3 4\n4 5\n5 3",
        expectedOutput: "1"
      }
    ]
  },
  {
    id: "dijkstra-shortest-path",
    "hints": ["Because all edge weights are non-negative, once you settle the closest unsettled node its distance can never improve — that greedy invariant is the heart of the algorithm.","Use a min-heap priority queue keyed by distance, relaxing neighbors from the smallest-distance node and skipping stale heap entries; unreachable nodes keep -1."],
    returns: "intArr",
    title: "Dijkstra Shortest Path",
    difficulty: "medium",
    topic: "graphs",
    companies: [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    description: "Given a directed weighted graph with n nodes labeled 0 to n-1 and a source node, compute the shortest distance from the source to every node. Input format: first line n m, then m lines u v w representing a directed edge from u to v with weight w, then a final line with the source node. Output the n distances in order, using -1 for unreachable nodes.",
    examples: [
      {
        input: "5 6\n0 1 4\n0 2 1\n2 1 2\n1 3 1\n2 3 5\n3 4 3\n0",
        output: "0 3 1 4 7",
        explanation: "Shortest distances from node 0 are 0, 3, 1, 4, 7."
      },
      {
        input: "3 2\n0 1 5\n1 2 3\n0",
        output: "0 5 8",
        explanation: "A simple chain gives distances 0, 5, 8."
      },
      {
        input: "4 2\n0 1 2\n2 3 4\n0",
        output: "0 2 -1 -1",
        explanation: "Nodes 2 and 3 are unreachable from node 0."
      }
    ],
    constraints: [
      "1 <= n <= 100",
      "0 <= m <= n*(n-1)",
      "1 <= w <= 1000"
    ],
    io: "graph-start",
    testCases: [
      {
        input: "5 6\n0 1 4\n0 2 1\n2 1 2\n1 3 1\n2 3 5\n3 4 3\n0",
        expectedOutput: "0 3 1 4 7"
      },
      {
        input: "3 2\n0 1 5\n1 2 3\n0",
        expectedOutput: "0 5 8"
      },
      {
        input: "4 2\n0 1 2\n2 3 4\n0",
        expectedOutput: "0 2 -1 -1"
      },
      {
        input: "1 0\n0",
        expectedOutput: "0"
      },
      {
        input: "4 4\n0 1 1\n1 2 1\n2 3 1\n0 3 10\n0",
        expectedOutput: "0 1 2 3"
      },
      {
        input: "5 7\n0 1 2\n0 2 4\n1 2 1\n1 3 7\n2 4 3\n3 4 1\n2 3 2\n0",
        expectedOutput: "0 2 3 5 6"
      },
      {
        input: "3 3\n0 1 1\n1 0 1\n1 2 1\n2",
        expectedOutput: "-1 -1 0"
      },
      {
        input: "6 5\n0 1 3\n0 2 2\n1 3 4\n2 3 1\n3 4 2\n0",
        expectedOutput: "0 3 2 3 5 -1"
      },
      {
        input: "4 6\n0 1 1\n0 2 4\n1 2 2\n1 3 6\n2 3 3\n0 3 10\n1",
        expectedOutput: "-1 0 2 5"
      },
      {
        input: "5 4\n0 1 10\n1 2 10\n2 3 10\n3 4 10\n2",
        expectedOutput: "-1 -1 0 10 20"
      },
      {
        input: "3 3\n0 1 7\n0 2 9\n1 2 10\n0",
        expectedOutput: "0 7 9"
      },
      {
        input: "7 8\n0 1 2\n0 2 6\n1 3 5\n2 3 8\n3 4 10\n3 5 15\n4 6 2\n5 6 6\n0",
        expectedOutput: "0 2 6 7 17 22 19"
      }
    ]
  },
  {
    id: "topological-sort",
    "hints": ["A node can appear in the ordering only after all its prerequisites do, so repeatedly pick a node whose remaining dependencies are exhausted.","Use Kahn's algorithm with indegree counts and a min-heap (priority queue) so the smallest available node is always chosen, giving the lexicographically smallest ordering."],
    returns: "intArr",
    title: "Topological Sort",
    difficulty: "medium",
    topic: "graphs",
    companies: [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    description: "Given a directed acyclic graph with n nodes labeled 0 to n-1, return a topological ordering: a permutation where every directed edge u -> v has u before v. When several orderings are possible, return the lexicographically smallest one. Input format: first line n m, then m lines u v for a directed edge from u to v.",
    examples: [
      {
        input: "4 4\n0 1\n0 2\n1 3\n2 3",
        output: "0 1 2 3",
        explanation: "0 comes first, then 1 and 2 in order, then 3."
      },
      {
        input: "3 2\n2 0\n2 1",
        output: "2 0 1",
        explanation: "2 must come before both 0 and 1."
      },
      {
        input: "6 6\n5 2\n5 0\n4 0\n4 1\n2 3\n3 1",
        output: "4 5 0 2 3 1",
        explanation: "Lexicographically smallest valid ordering."
      }
    ],
    constraints: [
      "1 <= n <= 100",
      "The graph is guaranteed to be acyclic",
      "No duplicate edges"
    ],
    io: "graph",
    testCases: [
      {
        input: "4 4\n0 1\n0 2\n1 3\n2 3",
        expectedOutput: "0 1 2 3"
      },
      {
        input: "3 2\n2 0\n2 1",
        expectedOutput: "2 0 1"
      },
      {
        input: "6 6\n5 2\n5 0\n4 0\n4 1\n2 3\n3 1",
        expectedOutput: "4 5 0 2 3 1"
      },
      {
        input: "1 0",
        expectedOutput: "0"
      },
      {
        input: "5 4\n0 1\n1 2\n2 3\n3 4",
        expectedOutput: "0 1 2 3 4"
      },
      {
        input: "5 0",
        expectedOutput: "0 1 2 3 4"
      },
      {
        input: "4 3\n3 2\n2 1\n1 0",
        expectedOutput: "3 2 1 0"
      },
      {
        input: "6 5\n0 3\n0 2\n1 3\n1 4\n2 5",
        expectedOutput: "0 1 2 3 4 5"
      },
      {
        input: "3 3\n0 1\n1 2\n0 2",
        expectedOutput: "0 1 2"
      },
      {
        input: "7 7\n0 1\n0 2\n1 3\n2 3\n3 4\n3 5\n4 6",
        expectedOutput: "0 1 2 3 4 5 6"
      },
      {
        input: "2 1\n1 0",
        expectedOutput: "1 0"
      },
      {
        input: "8 7\n0 4\n1 4\n2 5\n3 6\n4 7\n5 7\n6 7",
        expectedOutput: "0 1 2 3 4 5 6 7"
      }
    ]
  },
  {
    id: "oliver-and-the-game",
    "hints": ["Subtree membership in a rooted tree can be answered in constant time if you stamp every node with an entry and exit time during a single traversal.","Run one DFS from node 0 recording tin/tout timestamps; x is in y's subtree exactly when tin[y] <= tin[x] and tout[x] <= tout[y], then answer each query by orienting it per its type."],
    returns: "string",
    title: "Oliver and the Game",
    difficulty: "medium",
    topic: "graphs",
    companies: [
      "Amazon",
      "Flipkart",
      "CodeChef"
    ],
    description: "You are given a tree with n nodes labeled 0 to n-1 rooted at node 0, followed by q queries. Each query has a type t and two nodes x and y. If t is 0, answer whether x lies in the subtree of y; if t is 1, answer whether y lies in the subtree of x. Input format: first line n, then n-1 lines u v for tree edges, then a line q, then q lines t x y. Output YES or NO for each query, separated by a single space.",
    examples: [
      {
        input: "7\n0 1\n0 2\n1 3\n1 4\n2 5\n2 6\n4\n0 3 1\n0 5 1\n1 0 6\n0 6 2",
        output: "YES NO YES YES",
        explanation: "3 is in the subtree of 1; 5 is not in the subtree of 1; 6 is in the subtree of 0; 6 is in the subtree of 2."
      },
      {
        input: "1\n1\n0 0 0",
        output: "YES",
        explanation: "The only node is in its own subtree."
      },
      {
        input: "3\n0 1\n1 2\n3\n0 2 0\n0 0 2\n1 2 0",
        output: "YES NO NO",
        explanation: "2 is in the subtree of 0; 0 is not in the subtree of 2; 0 is not in the subtree of 2."
      }
    ],
    constraints: [
      "1 <= n <= 1000",
      "1 <= q <= 1000",
      "The edges form a valid tree"
    ],
    io: "graph",
    testCases: [
      {
        input: "7\n0 1\n0 2\n1 3\n1 4\n2 5\n2 6\n4\n0 3 1\n0 5 1\n1 0 6\n0 6 2",
        expectedOutput: "YES NO YES YES"
      },
      {
        input: "1\n1\n0 0 0",
        expectedOutput: "YES"
      },
      {
        input: "3\n0 1\n1 2\n3\n0 2 0\n0 0 2\n1 2 0",
        expectedOutput: "YES NO NO"
      },
      {
        input: "5\n0 1\n0 2\n2 3\n2 4\n5\n0 1 0\n0 3 2\n0 4 1\n1 0 4\n0 2 2",
        expectedOutput: "YES YES NO YES YES"
      },
      {
        input: "4\n0 1\n1 2\n2 3\n2\n0 3 1\n1 3 0",
        expectedOutput: "YES NO"
      },
      {
        input: "6\n0 1\n0 2\n1 3\n3 4\n3 5\n4\n0 4 3\n0 5 1\n1 2 5\n0 2 0",
        expectedOutput: "YES YES NO YES"
      },
      {
        input: "2\n0 1\n3\n0 1 1\n0 0 1\n1 0 1",
        expectedOutput: "YES NO YES"
      },
      {
        input: "8\n0 1\n0 2\n1 3\n1 4\n2 5\n5 6\n5 7\n3\n0 6 2\n0 7 1\n1 0 7",
        expectedOutput: "YES NO YES"
      },
      {
        input: "1\n2\n0 0 0\n1 0 0",
        expectedOutput: "YES YES"
      },
      {
        input: "9\n0 1\n1 2\n2 3\n0 4\n4 5\n5 6\n0 7\n7 8\n4\n0 3 1\n0 6 4\n0 8 0\n1 8 7",
        expectedOutput: "YES YES YES NO"
      },
      {
        input: "3\n0 1\n0 2\n4\n1 1 0\n1 2 0\n0 1 2\n0 2 1",
        expectedOutput: "NO NO NO NO"
      },
      {
        input: "10\n0 1\n0 2\n1 3\n1 4\n2 5\n2 6\n3 7\n4 8\n5 9\n5\n0 7 3\n0 9 2\n0 8 1\n1 0 9\n0 6 5",
        expectedOutput: "YES YES YES YES NO"
      }
    ]
  },
  {
    id: "min-time-each-job-dag",
    "hints": ["Each job finishes 1 unit after the latest-finishing of its prerequisites, so the times propagate forward along dependency edges in dependency order.","Process nodes in topological order (Kahn's algorithm with indegree counts) and relax finish times as max over predecessors plus one; source jobs finish at time 1."],
    returns: "intArr",
    title: "Minimum Time for Each Job in a DAG",
    difficulty: "medium",
    topic: "graphs",
    companies: [
      "Amazon",
      "Microsoft"
    ],
    description: "Jobs 0 to n-1 have dependencies given as directed edges u -> v meaning job u must finish before job v starts. Every job takes exactly 1 unit of time and any number of jobs can run in parallel. Compute the earliest finishing time of each job. Input format: first line n m, then m lines u v for a directed edge from u to v. The graph is a DAG. Output n finishing times in order.",
    examples: [
      {
        input: "4 3\n0 1\n1 2\n2 3",
        output: "1 2 3 4",
        explanation: "Jobs run one after another: times 1 2 3 4."
      },
      {
        input: "4 4\n0 1\n0 2\n1 3\n2 3",
        output: "1 2 2 3",
        explanation: "Jobs 1 and 2 run in parallel after job 0."
      },
      {
        input: "3 0",
        output: "1 1 1",
        explanation: "No dependencies, every job finishes at time 1."
      }
    ],
    constraints: [
      "1 <= n <= 100",
      "The graph is guaranteed to be acyclic"
    ],
    io: "graph",
    testCases: [
      {
        input: "4 3\n0 1\n1 2\n2 3",
        expectedOutput: "1 2 3 4"
      },
      {
        input: "4 4\n0 1\n0 2\n1 3\n2 3",
        expectedOutput: "1 2 2 3"
      },
      {
        input: "3 0",
        expectedOutput: "1 1 1"
      },
      {
        input: "5 4\n0 2\n1 2\n2 3\n2 4",
        expectedOutput: "1 1 2 3 3"
      },
      {
        input: "1 0",
        expectedOutput: "1"
      },
      {
        input: "6 5\n0 1\n0 2\n1 3\n2 3\n3 4",
        expectedOutput: "1 2 2 3 4 1"
      },
      {
        input: "4 2\n2 0\n2 1",
        expectedOutput: "2 2 1 1"
      },
      {
        input: "7 6\n0 1\n1 2\n0 3\n3 4\n4 5\n5 6",
        expectedOutput: "1 2 3 2 3 4 5"
      },
      {
        input: "3 2\n0 2\n1 2",
        expectedOutput: "1 1 2"
      },
      {
        input: "5 5\n0 1\n1 2\n0 3\n3 4\n2 4",
        expectedOutput: "1 2 3 2 4"
      },
      {
        input: "2 1\n1 0",
        expectedOutput: "2 1"
      },
      {
        input: "8 7\n0 1\n1 2\n2 3\n4 5\n5 6\n6 7\n3 4",
        expectedOutput: "1 2 3 4 5 6 7 8"
      }
    ]
  },
  {
    id: "finish-all-tasks",
    "hints": ["Finishing all tasks is possible exactly when the dependency graph is acyclic, so this reduces to a cycle check on a directed graph.","Run DFS with a recursion-stack/three-color scheme, or Kahn's algorithm counting how many nodes get emitted; if the count is less than n, a cycle blocks completion."],
    returns: "bool",
    title: "Finish All Tasks from Dependencies",
    difficulty: "medium",
    topic: "graphs",
    companies: [
      "Amazon",
      "Google",
      "Meta"
    ],
    description: "There are n tasks labeled 0 to n-1 with dependencies given as directed edges u -> v meaning task u must be done before task v. Determine whether it is possible to finish all tasks, which is true exactly when the dependency graph has no cycle. Input format: first line n m, then m lines u v. Output true if all tasks can be finished, false otherwise.",
    examples: [
      {
        input: "2 1\n0 1",
        output: "true",
        explanation: "Do task 0 first, then task 1."
      },
      {
        input: "2 2\n0 1\n1 0",
        output: "false",
        explanation: "The tasks depend on each other, impossible."
      },
      {
        input: "4 4\n0 1\n1 2\n2 3\n3 1",
        output: "false",
        explanation: "Tasks 1, 2, 3 form a dependency cycle."
      }
    ],
    constraints: [
      "1 <= n <= 100",
      "0 <= m <= n*(n-1)"
    ],
    io: "graph",
    testCases: [
      {
        input: "2 1\n0 1",
        expectedOutput: "true"
      },
      {
        input: "2 2\n0 1\n1 0",
        expectedOutput: "false"
      },
      {
        input: "4 4\n0 1\n1 2\n2 3\n3 1",
        expectedOutput: "false"
      },
      {
        input: "4 3\n0 1\n0 2\n3 0",
        expectedOutput: "true"
      },
      {
        input: "1 0",
        expectedOutput: "true"
      },
      {
        input: "3 3\n0 1\n1 2\n2 0",
        expectedOutput: "false"
      },
      {
        input: "5 4\n0 1\n2 1\n3 2\n4 3",
        expectedOutput: "true"
      },
      {
        input: "6 6\n0 1\n1 2\n2 3\n3 4\n4 5\n5 3",
        expectedOutput: "false"
      },
      {
        input: "3 2\n0 1\n0 2",
        expectedOutput: "true"
      },
      {
        input: "4 4\n0 1\n1 0\n2 3\n3 2",
        expectedOutput: "false"
      },
      {
        input: "5 0",
        expectedOutput: "true"
      },
      {
        input: "7 6\n0 1\n1 2\n2 0\n3 4\n4 5\n5 6",
        expectedOutput: "false"
      }
    ]
  },
  {
    id: "number-of-islands",
    "hints": ["Every maximal 4-directionally connected group of 1s is one island, so each time you discover an uncounted 1 you should swallow its entire connected group before counting the next.","Scan the grid and launch BFS/DFS from each unvisited 1, marking visited cells (in a separate set or in place), incrementing the count once per launch."],
    returns: "int",
    title: "Number of Islands",
    difficulty: "easy",
    topic: "graphs",
    companies: [
      "Amazon",
      "Google",
      "Meta",
      "Microsoft"
    ],
    description: "Given an r x c binary grid, an island is a group of 1s connected 4-directionally and surrounded by 0s. Count the number of islands. Input format: first line r c, then r rows of 0s and 1s.",
    images: ["https://fastly.jsdelivr.net/gh/doocs/leetcode@main/solution/0600-0699/0695.Max%20Area%20of%20Island/images/maxarea1-grid.jpg"],
    examples: [
      {
        input: "4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0",
        output: "1",
        explanation: "All 1s are connected into a single island."
      },
      {
        input: "4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1",
        output: "3",
        explanation: "There are three separate islands."
      },
      {
        input: "3 3\n0 0 0\n0 0 0\n0 0 0",
        output: "0",
        explanation: "No land at all."
      }
    ],
    constraints: [
      "1 <= r, c <= 50",
      "Grid contains only 0 and 1"
    ],
    io: "matrix",
    testCases: [
      {
        input: "4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0",
        expectedOutput: "1"
      },
      {
        input: "4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1",
        expectedOutput: "3"
      },
      {
        input: "3 3\n0 0 0\n0 0 0\n0 0 0",
        expectedOutput: "0"
      },
      {
        input: "1 1\n1",
        expectedOutput: "1"
      },
      {
        input: "1 1\n0",
        expectedOutput: "0"
      },
      {
        input: "3 3\n1 0 1\n0 1 0\n1 0 1",
        expectedOutput: "5"
      },
      {
        input: "2 2\n1 1\n1 1",
        expectedOutput: "1"
      },
      {
        input: "4 4\n1 1 0 1\n0 0 0 1\n1 0 1 1\n1 1 0 0",
        expectedOutput: "3"
      },
      {
        input: "5 5\n1 0 0 0 1\n0 0 0 0 0\n0 0 1 0 0\n0 0 0 0 0\n1 0 0 0 1",
        expectedOutput: "5"
      },
      {
        input: "3 5\n1 1 1 1 1\n1 1 1 1 1\n1 1 1 1 1",
        expectedOutput: "1"
      },
      {
        input: "4 3\n1 0 1\n0 1 0\n1 0 1\n0 1 0",
        expectedOutput: "6"
      },
      {
        input: "2 5\n1 0 1 0 1\n0 1 0 1 0",
        expectedOutput: "5"
      }
    ]
  },
  {
    id: "prims-mst",
    "hints": ["Grow the tree outward from any start node, always attaching the cheapest edge that connects the growing tree to a node outside it.","Keep a min-heap of candidate crossing edges (or a min-key array) with a visited/in-MST set; each extraction adds the cheapest frontier edge's weight to the total."],
    returns: "int",
    title: "Prim's Algorithm for MST",
    difficulty: "medium",
    topic: "graphs",
    companies: [
      "Amazon",
      "Microsoft",
      "Cisco"
    ],
    description: "Given a connected undirected weighted graph with n nodes labeled 0 to n-1, compute the total weight of its minimum spanning tree using Prim's algorithm. Input format: first line n m, then m lines u v w.",
    examples: [
      {
        input: "4 5\n0 1 10\n0 2 6\n0 3 5\n1 3 15\n2 3 4",
        output: "19",
        explanation: "MST edges weigh 4, 5 and 10 for a total of 19."
      },
      {
        input: "3 3\n0 1 1\n1 2 2\n0 2 3",
        output: "3",
        explanation: "MST uses the two cheapest edges: total 3."
      },
      {
        input: "5 7\n0 1 2\n0 3 6\n1 2 3\n1 3 8\n1 4 5\n2 4 7\n3 4 9",
        output: "16",
        explanation: "MST total weight is 16."
      }
    ],
    constraints: [
      "1 <= n <= 100",
      "The graph is connected",
      "1 <= w <= 1000"
    ],
    io: "graph",
    testCases: [
      {
        input: "4 5\n0 1 10\n0 2 6\n0 3 5\n1 3 15\n2 3 4",
        expectedOutput: "19"
      },
      {
        input: "3 3\n0 1 1\n1 2 2\n0 2 3",
        expectedOutput: "3"
      },
      {
        input: "5 7\n0 1 2\n0 3 6\n1 2 3\n1 3 8\n1 4 5\n2 4 7\n3 4 9",
        expectedOutput: "16"
      },
      {
        input: "2 1\n0 1 7",
        expectedOutput: "7"
      },
      {
        input: "1 0",
        expectedOutput: "0"
      },
      {
        input: "6 8\n0 1 4\n0 2 3\n1 2 1\n1 3 2\n2 3 4\n3 4 2\n3 5 6\n4 5 3",
        expectedOutput: "11"
      },
      {
        input: "4 6\n0 1 1\n0 2 1\n0 3 1\n1 2 1\n1 3 1\n2 3 1",
        expectedOutput: "3"
      },
      {
        input: "5 4\n0 1 5\n1 2 3\n2 3 8\n3 4 2",
        expectedOutput: "18"
      },
      {
        input: "3 2\n0 2 4\n1 2 4",
        expectedOutput: "8"
      },
      {
        input: "7 9\n0 1 7\n0 3 5\n1 2 8\n1 3 9\n1 4 7\n2 4 5\n3 4 15\n3 5 6\n4 6 9",
        expectedOutput: "39"
      },
      {
        input: "4 5\n0 1 2\n1 2 3\n2 3 1\n0 3 4\n0 2 5",
        expectedOutput: "6"
      },
      {
        input: "5 10\n0 1 1\n0 2 2\n0 3 3\n0 4 4\n1 2 5\n1 3 6\n1 4 7\n2 3 8\n2 4 9\n3 4 10",
        expectedOutput: "10"
      }
    ]
  },
  {
    id: "negative-weight-cycle",
    "hints": ["A negative cycle exists exactly when a shortest path can still be improved after it should have stabilized — improvement beyond the (n-1)th round is the telltale sign.","Relax all edges n-1 times, then do one extra pass: any edge that can still be relaxed lies on or reaches a negative weight cycle, so return true."],
    returns: "bool",
    title: "Negative Weight Cycle",
    difficulty: "medium",
    topic: "graphs",
    companies: [
      "Amazon",
      "Google"
    ],
    description: "Given a directed weighted graph with n nodes labeled 0 to n-1, determine whether it contains a negative weight cycle, i.e. a directed cycle whose total edge weight is negative. Input format: first line n m, then m lines u v w for a directed edge from u to v with weight w. Output true if such a cycle exists, false otherwise.",
    examples: [
      {
        input: "3 3\n0 1 1\n1 2 -1\n2 0 -1",
        output: "true",
        explanation: "The cycle 0 -> 1 -> 2 -> 0 has total weight -1."
      },
      {
        input: "3 3\n0 1 1\n1 2 2\n2 0 3",
        output: "false",
        explanation: "The only cycle has positive total weight."
      },
      {
        input: "4 4\n0 1 1\n1 2 -5\n2 3 2\n3 1 1",
        output: "true",
        explanation: "The cycle 1 -> 2 -> 3 -> 1 has total weight -2."
      }
    ],
    constraints: [
      "1 <= n <= 100",
      "0 <= m <= n*(n-1)",
      "-1000 <= w <= 1000"
    ],
    io: "graph",
    testCases: [
      {
        input: "3 3\n0 1 1\n1 2 -1\n2 0 -1",
        expectedOutput: "true"
      },
      {
        input: "3 3\n0 1 1\n1 2 2\n2 0 3",
        expectedOutput: "false"
      },
      {
        input: "4 4\n0 1 1\n1 2 -5\n2 3 2\n3 1 1",
        expectedOutput: "true"
      },
      {
        input: "2 2\n0 1 5\n1 0 -3",
        expectedOutput: "false"
      },
      {
        input: "1 1\n0 0 -1",
        expectedOutput: "true"
      },
      {
        input: "4 3\n0 1 2\n1 2 3\n2 3 4",
        expectedOutput: "false"
      },
      {
        input: "5 6\n0 1 2\n1 2 2\n2 0 -5\n2 3 1\n3 4 1\n4 2 -3",
        expectedOutput: "true"
      },
      {
        input: "3 2\n0 1 -2\n1 2 -2",
        expectedOutput: "false"
      },
      {
        input: "4 5\n0 1 1\n1 2 1\n2 3 1\n3 0 -2\n0 2 5",
        expectedOutput: "false"
      },
      {
        input: "4 5\n0 1 1\n1 2 1\n2 3 1\n3 0 -4\n0 2 5",
        expectedOutput: "true"
      },
      {
        input: "2 0",
        expectedOutput: "false"
      },
      {
        input: "6 7\n0 1 3\n1 2 4\n2 3 5\n3 1 -10\n3 4 2\n4 5 1\n5 0 -2",
        expectedOutput: "true"
      }
    ]
  },
  {
    id: "floyd-warshall",
    "hints": ["The shortest i-to-j path either uses some intermediate node k as its highest-numbered waypoint or it doesn't, which suggests improving the whole matrix one intermediate at a time.","Use the triple-loop dynamic programming formulation over k, i, j with dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]), guarding against overflow when combining two -1 (infinite) entries."],
    returns: "intMat",
    title: "Floyd Warshall Algorithm",
    difficulty: "medium",
    topic: "graphs",
    companies: [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    description: "Given a directed weighted graph with n nodes labeled 0 to n-1, compute the shortest distance between every pair of nodes. Input format: first line n m, then m lines u v w for a directed edge from u to v with weight w. Output an n x n matrix, one row per line, where entry (i,j) is the shortest distance from i to j, 0 on the diagonal, and -1 when j is unreachable from i.",
    examples: [
      {
        input: "4 4\n0 1 5\n0 3 10\n1 2 3\n2 3 1",
        output: "0 5 8 9\n-1 0 3 4\n-1 -1 0 1\n-1 -1 -1 0",
        explanation: "Shortest paths: 0->2 is 8 via node 1, 0->3 is 9 via nodes 1 and 2."
      },
      {
        input: "3 3\n0 1 4\n1 2 5\n0 2 10",
        output: "0 4 9\n-1 0 5\n-1 -1 0",
        explanation: "The indirect route 0 -> 1 -> 2 costs 9, cheaper than the direct edge."
      },
      {
        input: "2 1\n0 1 7",
        output: "0 7\n-1 0",
        explanation: "Node 1 cannot reach node 0."
      }
    ],
    constraints: [
      "1 <= n <= 50",
      "No negative weight cycles",
      "-1000 <= w <= 1000"
    ],
    io: "graph",
    testCases: [
      {
        input: "4 4\n0 1 5\n0 3 10\n1 2 3\n2 3 1",
        expectedOutput: "0 5 8 9\n-1 0 3 4\n-1 -1 0 1\n-1 -1 -1 0"
      },
      {
        input: "3 3\n0 1 4\n1 2 5\n0 2 10",
        expectedOutput: "0 4 9\n-1 0 5\n-1 -1 0"
      },
      {
        input: "2 1\n0 1 7",
        expectedOutput: "0 7\n-1 0"
      },
      {
        input: "1 0",
        expectedOutput: "0"
      },
      {
        input: "3 4\n0 1 2\n1 0 2\n1 2 3\n2 1 3",
        expectedOutput: "0 2 5\n2 0 3\n5 3 0"
      },
      {
        input: "4 5\n0 1 1\n1 2 1\n2 3 1\n0 2 5\n1 3 5",
        expectedOutput: "0 1 2 3\n-1 0 1 2\n-1 -1 0 1\n-1 -1 -1 0"
      },
      {
        input: "5 6\n0 1 3\n0 2 8\n1 3 1\n2 3 4\n3 4 2\n1 4 7",
        expectedOutput: "0 3 8 4 6\n-1 0 -1 1 3\n-1 -1 0 4 6\n-1 -1 -1 0 2\n-1 -1 -1 -1 0"
      },
      {
        input: "4 6\n0 1 1\n0 2 4\n1 2 2\n1 3 5\n2 3 1\n0 3 9",
        expectedOutput: "0 1 3 4\n-1 0 2 3\n-1 -1 0 1\n-1 -1 -1 0"
      },
      {
        input: "3 3\n0 1 -2\n1 2 -3\n0 2 1",
        expectedOutput: "0 -2 -5\n-1 0 -3\n-1 -1 0"
      },
      {
        input: "6 5\n0 1 2\n2 3 4\n3 4 1\n4 5 3\n1 2 1",
        expectedOutput: "0 2 3 7 8 11\n-1 0 1 5 6 9\n-1 -1 0 4 5 8\n-1 -1 -1 0 1 4\n-1 -1 -1 -1 0 3\n-1 -1 -1 -1 -1 0"
      },
      {
        input: "4 4\n0 1 2\n2 0 2\n1 3 1\n2 3 1",
        expectedOutput: "0 2 -1 3\n-1 0 -1 1\n2 4 0 1\n-1 -1 -1 0"
      },
      {
        input: "5 8\n0 1 10\n0 4 5\n1 2 1\n1 4 2\n2 3 4\n3 0 7\n3 2 6\n4 1 3",
        expectedOutput: "0 8 9 13 5\n12 0 1 5 2\n11 19 0 4 16\n7 15 6 0 12\n15 3 4 8 0"
      }
    ]
  },
  {
    id: "graph-coloring",
    "hints": ["The chromatic number can be found by testing feasibility: if k colors suffice, so do k+1, which turns the optimization into a yes/no search over k.","Binary-search k from 1 to n and test each with backtracking coloring (assign the lowest feasible color per node, pruning on conflict); the smallest feasible k is the answer."],
    returns: "int",
    title: "Graph Coloring",
    difficulty: "hard",
    topic: "graphs",
    companies: [
      "Amazon",
      "Microsoft",
      "Samsung"
    ],
    description: "Given an undirected graph with n nodes labeled 0 to n-1, find its chromatic number: the smallest number of colors needed to color every node so that no two adjacent nodes share a color. Input format: first line n m, then m lines u v.",
    examples: [
      {
        input: "3 3\n0 1\n1 2\n2 0",
        output: "3",
        explanation: "A triangle needs 3 colors."
      },
      {
        input: "4 3\n0 1\n1 2\n2 3",
        output: "2",
        explanation: "A path is bipartite, so 2 colors suffice."
      },
      {
        input: "4 6\n0 1\n0 2\n0 3\n1 2\n1 3\n2 3",
        output: "4",
        explanation: "A complete graph on 4 nodes needs 4 colors."
      }
    ],
    constraints: [
      "1 <= n <= 8",
      "0 <= m <= n*(n-1)/2"
    ],
    io: "graph",
    testCases: [
      {
        input: "3 3\n0 1\n1 2\n2 0",
        expectedOutput: "3"
      },
      {
        input: "4 3\n0 1\n1 2\n2 3",
        expectedOutput: "2"
      },
      {
        input: "4 6\n0 1\n0 2\n0 3\n1 2\n1 3\n2 3",
        expectedOutput: "4"
      },
      {
        input: "5 4\n0 1\n0 2\n0 3\n0 4",
        expectedOutput: "2"
      },
      {
        input: "1 0",
        expectedOutput: "1"
      },
      {
        input: "5 5\n0 1\n1 2\n2 3\n3 4\n4 0",
        expectedOutput: "3"
      },
      {
        input: "6 5\n0 1\n1 2\n2 0\n3 4\n4 5",
        expectedOutput: "3"
      },
      {
        input: "5 10\n0 1\n0 2\n0 3\n0 4\n1 2\n1 3\n1 4\n2 3\n2 4\n3 4",
        expectedOutput: "5"
      },
      {
        input: "4 4\n0 1\n1 2\n2 3\n3 0",
        expectedOutput: "2"
      },
      {
        input: "6 7\n0 1\n0 2\n1 3\n2 3\n3 4\n4 5\n3 5",
        expectedOutput: "3"
      },
      {
        input: "7 6\n0 1\n1 2\n2 3\n3 4\n4 5\n5 6",
        expectedOutput: "2"
      },
      {
        input: "2 0",
        expectedOutput: "1"
      }
    ]
  },
  {
    id: "snakes-and-ladders",
    "hints": ["Every dice throw moves 1 to 6 squares forward, so the fewest throws is the shortest path in the implicit graph of board squares; snakes and ladders are just forced redirects on arrival.","Model squares as nodes and run BFS from square 1, mapping each board cell through the boustrophedon layout, with a visited set to avoid reprocessing redirected squares."],
    returns: "int",
    title: "Snakes and Ladders",
    difficulty: "medium",
    topic: "graphs",
    companies: [
      "Amazon",
      "Microsoft",
      "Flipkart"
    ],
    description: "You are given an n x n board. Squares are numbered from 1 to n*n starting at the bottom-left, going left to right on the bottom row, then right to left on the next row, alternating (boustrophedon). From square s you may move to any of s+1..s+6; if the destination square has a snake or ladder, you must take it. Input format: first line n n, then n rows of the board where -1 means no snake or ladder and any other value d means a snake or ladder to square d. Output the minimum number of dice throws to reach square n*n from square 1, or -1 if impossible.",
    images: ["https://assets.leetcode.com/uploads/2018/09/23/snakes.png"],
    examples: [
      {
        input: "6 6\n-1 -1 -1 -1 -1 -1\n-1 -1 -1 -1 -1 -1\n-1 -1 -1 -1 -1 -1\n-1 35 -1 -1 13 -1\n-1 -1 -1 -1 -1 -1\n-1 15 -1 -1 -1 -1",
        output: "4",
        explanation: "The classic example needs 4 throws."
      },
      {
        input: "6 6\n-1 -1 -1 -1 -1 -1\n-1 -1 -1 -1 -1 -1\n-1 -1 -1 -1 -1 -1\n-1 -1 -1 -1 -1 -1\n-1 -1 -1 -1 -1 -1\n-1 36 -1 -1 -1 -1",
        output: "1",
        explanation: "A ladder from square 2 to 36 wins in 1 throw."
      },
      {
        input: "2 2\n-1 -1\n-1 -1",
        output: "1",
        explanation: "From square 1, one throw reaches square 4 directly."
      }
    ],
    constraints: [
      "1 <= n <= 10",
      "Board values are -1 or a valid square number"
    ],
    io: "matrix",
    testCases: [
      {
        input: "6 6\n-1 -1 -1 -1 -1 -1\n-1 -1 -1 -1 -1 -1\n-1 -1 -1 -1 -1 -1\n-1 35 -1 -1 13 -1\n-1 -1 -1 -1 -1 -1\n-1 15 -1 -1 -1 -1",
        expectedOutput: "4"
      },
      {
        input: "6 6\n-1 -1 -1 -1 -1 -1\n-1 -1 -1 -1 -1 -1\n-1 -1 -1 -1 -1 -1\n-1 -1 -1 -1 -1 -1\n-1 -1 -1 -1 -1 -1\n-1 36 -1 -1 -1 -1",
        expectedOutput: "1"
      },
      {
        input: "2 2\n-1 -1\n-1 -1",
        expectedOutput: "1"
      },
      {
        input: "1 1\n-1",
        expectedOutput: "0"
      },
      {
        input: "3 3\n-1 -1 -1\n-1 -1 -1\n-1 9 -1",
        expectedOutput: "1"
      },
      {
        input: "3 3\n-1 -1 -1\n-1 -1 -1\n-1 -1 -1",
        expectedOutput: "2"
      },
      {
        input: "4 4\n-1 -1 -1 -1\n-1 -1 -1 -1\n-1 -1 -1 -1\n-1 16 -1 -1",
        expectedOutput: "1"
      },
      {
        input: "4 4\n-1 -1 -1 -1\n-1 -1 -1 -1\n-1 -1 -1 -1\n-1 -1 -1 1",
        expectedOutput: "3"
      },
      {
        input: "5 5\n-1 -1 -1 -1 -1\n-1 -1 -1 -1 -1\n-1 -1 -1 -1 -1\n-1 -1 -1 -1 -1\n-1 25 -1 -1 -1",
        expectedOutput: "1"
      },
      {
        input: "2 2\n-1 3\n-1 -1",
        expectedOutput: "1"
      },
      {
        input: "3 3\n-1 -1 2\n-1 -1 -1\n-1 -1 -1",
        expectedOutput: "-1"
      },
      {
        input: "4 4\n-1 -1 -1 -1\n-1 14 -1 -1\n-1 -1 -1 -1\n-1 -1 -1 -1",
        expectedOutput: "3"
      }
    ]
  },
  {
    id: "kosaraju-scc-count",
    "hints": ["Two passes exploit symmetry: the first pass orders nodes by when their DFS finishes, and the second pass on the reversed graph explores whole strongly connected components.","First do DFS on the original graph pushing nodes onto a stack by finish time, then DFS the transpose (reversed edges) in that order, counting how many launches it takes."],
    returns: "int",
    title: "Kosaraju Strongly Connected Components",
    difficulty: "medium",
    topic: "graphs",
    companies: [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    description: "Given a directed graph with n nodes labeled 0 to n-1, count its strongly connected components using Kosaraju's algorithm. A strongly connected component is a maximal set of nodes where every node is reachable from every other node in the set. Input format: first line n m, then m lines u v for a directed edge from u to v.",
    examples: [
      {
        input: "5 5\n1 0\n0 2\n2 1\n0 3\n3 4",
        output: "3",
        explanation: "Components are {0,1,2}, {3} and {4}."
      },
      {
        input: "3 3\n0 1\n1 2\n2 0",
        output: "1",
        explanation: "All nodes reach each other: one component."
      },
      {
        input: "4 0",
        output: "4",
        explanation: "No edges, so every node is its own component."
      }
    ],
    constraints: [
      "1 <= n <= 100",
      "0 <= m <= n*(n-1)"
    ],
    io: "graph",
    testCases: [
      {
        input: "5 5\n1 0\n0 2\n2 1\n0 3\n3 4",
        expectedOutput: "3"
      },
      {
        input: "3 3\n0 1\n1 2\n2 0",
        expectedOutput: "1"
      },
      {
        input: "4 0",
        expectedOutput: "4"
      },
      {
        input: "4 3\n0 1\n1 2\n2 3",
        expectedOutput: "4"
      },
      {
        input: "6 7\n0 1\n1 2\n2 0\n2 3\n3 4\n4 5\n5 3",
        expectedOutput: "2"
      },
      {
        input: "1 1\n0 0",
        expectedOutput: "1"
      },
      {
        input: "5 6\n0 1\n1 2\n2 3\n3 0\n2 4\n4 2",
        expectedOutput: "1"
      },
      {
        input: "7 6\n0 1\n2 3\n3 4\n4 2\n5 6\n6 5",
        expectedOutput: "4"
      },
      {
        input: "3 2\n0 1\n2 1",
        expectedOutput: "3"
      },
      {
        input: "8 9\n0 1\n1 2\n2 3\n3 0\n4 5\n5 6\n6 4\n2 4\n6 7",
        expectedOutput: "3"
      },
      {
        input: "2 2\n0 1\n1 0",
        expectedOutput: "1"
      },
      {
        input: "5 4\n0 1\n1 0\n2 3\n3 2",
        expectedOutput: "3"
      }
    ]
  },
  {
    id: "journey-to-moon",
    "hints": ["Astronauts connected by edges belong to the same country, so the countries are exactly the connected components — you need pairs drawn from different components.","Find component sizes with union-find or DFS/BFS, then compute total pairs minus within-component pairs, or accumulate size products against the running remainder."],
    returns: "int",
    title: "Journey to the Moon",
    difficulty: "medium",
    topic: "graphs",
    companies: [
      "Amazon",
      "HackerRank",
      "Flipkart"
    ],
    description: "There are n astronauts labeled 0 to n-1. Pairs of astronauts from the same country are given as m undirected edges. Count the number of ways to choose a pair of astronauts from different countries. Input format: first line n m, then m lines u v.",
    examples: [
      {
        input: "5 3\n0 1\n2 3\n0 4",
        output: "6",
        explanation: "Countries are {0,1,4} and {2,3}, giving 3 x 2 = 6 pairs."
      },
      {
        input: "4 2\n0 1\n2 3",
        output: "4",
        explanation: "Two countries of size 2 give 2 x 2 = 4 pairs."
      },
      {
        input: "4 0",
        output: "6",
        explanation: "Everyone is from a different country: 6 pairs."
      }
    ],
    constraints: [
      "1 <= n <= 1000",
      "0 <= m <= n*(n-1)/2"
    ],
    io: "graph",
    testCases: [
      {
        input: "5 3\n0 1\n2 3\n0 4",
        expectedOutput: "6"
      },
      {
        input: "4 2\n0 1\n2 3",
        expectedOutput: "4"
      },
      {
        input: "4 0",
        expectedOutput: "6"
      },
      {
        input: "1 0",
        expectedOutput: "0"
      },
      {
        input: "6 4\n0 1\n1 2\n3 4\n4 5",
        expectedOutput: "9"
      },
      {
        input: "10 0",
        expectedOutput: "45"
      },
      {
        input: "5 4\n0 1\n1 2\n2 3\n3 4",
        expectedOutput: "0"
      },
      {
        input: "7 3\n0 1\n2 3\n4 5",
        expectedOutput: "18"
      },
      {
        input: "3 1\n0 2",
        expectedOutput: "2"
      },
      {
        input: "8 6\n0 1\n1 2\n2 0\n3 4\n5 6\n6 7",
        expectedOutput: "21"
      },
      {
        input: "2 1\n0 1",
        expectedOutput: "0"
      },
      {
        input: "9 5\n0 1\n2 3\n4 5\n6 7\n7 8",
        expectedOutput: "30"
      }
    ]
  },
  {
    id: "vertex-cover",
    "hints": ["Every edge forces a choice of at least one endpoint, which suggests a branching search; this is NP-hard, so don't expect a greedy shortcut to always be optimal.","Use recursive backtracking that picks an uncovered edge (u, v) and branches on including u or including v, pruning with the best cover size found so far."],
    returns: "int",
    title: "Vertex Cover",
    difficulty: "hard",
    topic: "graphs",
    companies: [
      "Amazon",
      "Microsoft"
    ],
    description: "Given an undirected graph with n nodes labeled 0 to n-1, find the size of a minimum vertex cover: the smallest set of nodes such that every edge has at least one endpoint in the set. Input format: first line n m, then m lines u v.",
    examples: [
      {
        input: "3 3\n0 1\n1 2\n2 0",
        output: "2",
        explanation: "Any two nodes of a triangle cover all edges."
      },
      {
        input: "4 3\n0 1\n1 2\n2 3",
        output: "2",
        explanation: "Nodes {1, 3} or {0, 2} cover the path: size 2."
      },
      {
        input: "5 4\n0 1\n0 2\n0 3\n0 4",
        output: "1",
        explanation: "The center of the star alone covers every edge."
      }
    ],
    constraints: [
      "1 <= n <= 12",
      "0 <= m <= n*(n-1)/2"
    ],
    io: "graph",
    testCases: [
      {
        input: "3 3\n0 1\n1 2\n2 0",
        expectedOutput: "2"
      },
      {
        input: "4 3\n0 1\n1 2\n2 3",
        expectedOutput: "2"
      },
      {
        input: "5 4\n0 1\n0 2\n0 3\n0 4",
        expectedOutput: "1"
      },
      {
        input: "4 6\n0 1\n0 2\n0 3\n1 2\n1 3\n2 3",
        expectedOutput: "3"
      },
      {
        input: "1 0",
        expectedOutput: "0"
      },
      {
        input: "6 5\n0 1\n1 2\n2 3\n3 4\n4 5",
        expectedOutput: "3"
      },
      {
        input: "5 5\n0 1\n1 2\n2 3\n3 4\n4 0",
        expectedOutput: "3"
      },
      {
        input: "4 3\n0 1\n2 3\n1 2",
        expectedOutput: "2"
      },
      {
        input: "6 6\n0 1\n0 2\n1 3\n2 3\n3 4\n3 5",
        expectedOutput: "2"
      },
      {
        input: "2 1\n0 1",
        expectedOutput: "1"
      },
      {
        input: "7 6\n0 1\n1 2\n2 3\n3 4\n4 5\n5 6",
        expectedOutput: "3"
      },
      {
        input: "5 0",
        expectedOutput: "0"
      }
    ]
  },
  {
    id: "m-coloring-problem",
    "hints": ["This is a constraint-satisfaction problem: color nodes one at a time, and backtrack as soon as a node conflicts with an already-colored neighbor.","Apply recursive backtracking over the node order, trying colors 1..m for each node and checking only its colored neighbors for conflicts, pruning entire branches on the first violation."],
    returns: "bool",
    title: "M Coloring Problem",
    difficulty: "medium",
    topic: "graphs",
    companies: [
      "Amazon",
      "Microsoft",
      "Adobe"
    ],
    description: "Given an undirected graph with n nodes labeled 0 to n-1 and an integer m, determine whether the nodes can be colored with m colors so that no two adjacent nodes share a color. Input format: first line n e, then e lines u v, then a final line with m. Output true if such a coloring exists, false otherwise.",
    examples: [
      {
        input: "3 3\n0 1\n1 2\n2 0\n3",
        output: "true",
        explanation: "A triangle can be colored with 3 colors."
      },
      {
        input: "3 3\n0 1\n1 2\n2 0\n2",
        output: "false",
        explanation: "A triangle cannot be colored with 2 colors."
      },
      {
        input: "4 4\n0 1\n1 2\n2 3\n3 0\n2",
        output: "true",
        explanation: "An even cycle is bipartite."
      }
    ],
    constraints: [
      "1 <= n <= 12",
      "1 <= m <= n"
    ],
    io: "graph",
    testCases: [
      {
        input: "3 3\n0 1\n1 2\n2 0\n3",
        expectedOutput: "true"
      },
      {
        input: "3 3\n0 1\n1 2\n2 0\n2",
        expectedOutput: "false"
      },
      {
        input: "4 4\n0 1\n1 2\n2 3\n3 0\n2",
        expectedOutput: "true"
      },
      {
        input: "4 6\n0 1\n0 2\n0 3\n1 2\n1 3\n2 3\n3",
        expectedOutput: "false"
      },
      {
        input: "4 6\n0 1\n0 2\n0 3\n1 2\n1 3\n2 3\n4",
        expectedOutput: "true"
      },
      {
        input: "5 5\n0 1\n1 2\n2 3\n3 4\n4 0\n3",
        expectedOutput: "true"
      },
      {
        input: "5 5\n0 1\n1 2\n2 3\n3 4\n4 0\n2",
        expectedOutput: "false"
      },
      {
        input: "1 0\n1",
        expectedOutput: "true"
      },
      {
        input: "6 5\n0 1\n1 2\n2 3\n3 4\n4 5\n2",
        expectedOutput: "true"
      },
      {
        input: "6 9\n0 1\n0 2\n0 3\n1 2\n1 4\n2 5\n3 4\n3 5\n4 5\n3",
        expectedOutput: "true"
      },
      {
        input: "3 2\n0 1\n1 2\n2",
        expectedOutput: "true"
      },
      {
        input: "5 4\n0 1\n0 2\n0 3\n0 4\n2",
        expectedOutput: "true"
      }
    ]
  },
  {
    id: "cheapest-flights-k-stops",
    "hints": ["The stop limit is the real twist: a cheaper price might arrive via a longer route, so plain Dijkstra on price alone can discard the answer before it qualifies on stops.","Track (cost, city, stops-used) in a priority queue ordered by cost, and allow revisiting a city when the new route uses fewer stops, capping stops at k+1 edges."],
    returns: "int",
    title: "Cheapest Flights Within K Stops",
    difficulty: "medium",
    topic: "graphs",
    companies: [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    description: "There are n cities labeled 0 to n-1 and m flights. Find the cheapest price from city src to city dst using at most k stops (intermediate cities). Input format: first line n m, then m lines u v w for a directed flight from u to v costing w, then a final line src dst k. Output the minimum price, or -1 if there is no valid route.",
    examples: [
      {
        input: "4 4\n0 1 100\n1 2 100\n2 0 100\n1 3 600\n0 3 1",
        output: "700",
        explanation: "Route 0 -> 1 -> 3 costs 700 with 1 stop."
      },
      {
        input: "3 3\n0 1 100\n1 2 100\n0 2 500\n0 2 1",
        output: "200",
        explanation: "Route 0 -> 1 -> 2 costs 200 with 1 stop."
      },
      {
        input: "3 3\n0 1 100\n1 2 100\n0 2 500\n0 2 0",
        output: "500",
        explanation: "With 0 stops only the direct flight 0 -> 2 is allowed: 500."
      }
    ],
    constraints: [
      "1 <= n <= 50",
      "0 <= m <= n*(n-1)",
      "1 <= w <= 10000",
      "0 <= k < n"
    ],
    io: "graph",
    testCases: [
      {
        input: "4 4\n0 1 100\n1 2 100\n2 0 100\n1 3 600\n0 3 1",
        expectedOutput: "700"
      },
      {
        input: "3 3\n0 1 100\n1 2 100\n0 2 500\n0 2 1",
        expectedOutput: "200"
      },
      {
        input: "3 3\n0 1 100\n1 2 100\n0 2 500\n0 2 0",
        expectedOutput: "500"
      },
      {
        input: "2 1\n0 1 50\n0 1 0",
        expectedOutput: "50"
      },
      {
        input: "3 1\n0 1 100\n0 2 1",
        expectedOutput: "-1"
      },
      {
        input: "5 6\n0 1 5\n0 2 10\n1 3 3\n2 3 1\n3 4 2\n1 4 20\n0 4 2",
        expectedOutput: "10"
      },
      {
        input: "5 6\n0 1 5\n0 2 10\n1 3 3\n2 3 1\n3 4 2\n1 4 20\n0 4 1",
        expectedOutput: "25"
      },
      {
        input: "4 3\n0 1 1\n1 2 1\n2 3 1\n0 3 2",
        expectedOutput: "3"
      },
      {
        input: "4 3\n0 1 1\n1 2 1\n2 3 1\n0 3 1",
        expectedOutput: "-1"
      },
      {
        input: "6 7\n0 1 2\n0 2 4\n1 2 1\n1 3 7\n2 4 3\n3 5 1\n4 5 5\n0 5 3",
        expectedOutput: "10"
      },
      {
        input: "4 4\n0 1 5\n0 2 1\n2 1 1\n1 3 1\n0 3 1",
        expectedOutput: "6"
      },
      {
        input: "4 5\n0 1 1\n0 2 5\n1 2 1\n1 3 4\n2 3 1\n0 3 2",
        expectedOutput: "3"
      }
    ]
  },
  {
    id: "path-longer-than-k",
    "hints": ["Since paths must be simple (no repeated nodes), weight maximization is NP-hard here, but the search space is finite — you need a systematic way to explore candidate routes.","Use DFS from the source with a visited set and running weight, backtracking after each recursive call; return true as soon as the accumulated weight exceeds k."],
    returns: "bool",
    title: "Path of More Than K Length from Source",
    difficulty: "medium",
    topic: "graphs",
    companies: [
      "Amazon",
      "Microsoft"
    ],
    description: "Given an undirected weighted graph with n nodes labeled 0 to n-1 and a source node, determine whether there exists a simple path (no repeated nodes) starting from the source whose total weight is strictly greater than k. Input format: first line n m, then m lines u v w, then a line with the source node, then a final line with k. Output true if such a path exists, false otherwise.",
    examples: [
      {
        input: "4 4\n0 1 5\n1 2 5\n2 3 5\n0 3 1\n0\n12",
        output: "true",
        explanation: "Path 0 -> 1 -> 2 -> 3 has weight 15, greater than 12."
      },
      {
        input: "4 4\n0 1 5\n1 2 5\n2 3 5\n0 3 1\n0\n15",
        output: "false",
        explanation: "No simple path from 0 exceeds weight 15."
      },
      {
        input: "3 2\n0 1 3\n1 2 4\n0\n6",
        output: "true",
        explanation: "Path 0 -> 1 -> 2 has weight 7, greater than 6."
      }
    ],
    constraints: [
      "1 <= n <= 12",
      "0 <= m <= n*(n-1)/2",
      "1 <= w <= 100"
    ],
    io: "graph",
    testCases: [
      {
        input: "4 4\n0 1 5\n1 2 5\n2 3 5\n0 3 1\n0\n12",
        expectedOutput: "true"
      },
      {
        input: "4 4\n0 1 5\n1 2 5\n2 3 5\n0 3 1\n0\n15",
        expectedOutput: "false"
      },
      {
        input: "3 2\n0 1 3\n1 2 4\n0\n6",
        expectedOutput: "true"
      },
      {
        input: "3 2\n0 1 3\n1 2 4\n2\n6",
        expectedOutput: "true"
      },
      {
        input: "2 1\n0 1 10\n0\n10",
        expectedOutput: "false"
      },
      {
        input: "5 6\n0 1 2\n0 2 3\n1 3 4\n2 3 1\n3 4 5\n1 4 2\n0\n10",
        expectedOutput: "true"
      },
      {
        input: "5 6\n0 1 2\n0 2 3\n1 3 4\n2 3 1\n3 4 5\n1 4 2\n0\n11",
        expectedOutput: "false"
      },
      {
        input: "1 0\n0\n0",
        expectedOutput: "false"
      },
      {
        input: "4 5\n0 1 1\n1 2 1\n2 3 1\n0 2 5\n0 3 2\n0\n5",
        expectedOutput: "true"
      },
      {
        input: "4 3\n0 1 4\n1 2 4\n2 3 4\n1\n7",
        expectedOutput: "true"
      },
      {
        input: "4 3\n0 1 4\n1 2 4\n2 3 4\n1\n8",
        expectedOutput: "false"
      },
      {
        input: "6 7\n0 1 3\n0 2 2\n1 3 4\n2 3 1\n3 4 6\n4 5 2\n3 5 3\n0\n14",
        expectedOutput: "true"
      }
    ]
  },
  {
    id: "bellman-ford",
    "hints": ["Unlike Dijkstra, this algorithm tolerates negative edges by relaxing every edge repeatedly until distances stabilize, which takes n-1 rounds in the worst case.","Initialize distances to infinity (source 0), relax all edges n-1 times taking min over each edge, and leave -1 for nodes that stay unreachable; no negative cycle is guaranteed."],
    returns: "intArr",
    title: "Bellman Ford Algorithm",
    difficulty: "medium",
    topic: "graphs",
    companies: [
      "Amazon",
      "Google",
      "Cisco"
    ],
    description: "Given a directed weighted graph with n nodes labeled 0 to n-1 and a source node, compute the shortest distance from the source to every node. Edge weights may be negative but there is no negative weight cycle. Input format: first line n m, then m lines u v w for a directed edge from u to v with weight w, then a final line with the source node. Output the n distances in order, using -1 for unreachable nodes.",
    examples: [
      {
        input: "5 8\n0 1 -1\n0 2 4\n1 2 3\n1 3 2\n1 4 2\n3 2 5\n3 1 1\n4 3 -3\n0",
        output: "0 -1 2 -2 1",
        explanation: "The classic example gives distances 0, -1, 2, -2, 1."
      },
      {
        input: "4 4\n0 1 1\n1 2 2\n2 3 3\n0 3 10\n0",
        output: "0 1 3 6",
        explanation: "Distances along the chain: 0, 1, 3, 6."
      },
      {
        input: "3 2\n0 1 5\n1 2 3\n2",
        output: "-1 -1 0",
        explanation: "Only node 2 is reachable from itself."
      }
    ],
    constraints: [
      "1 <= n <= 100",
      "No negative weight cycles",
      "-1000 <= w <= 1000"
    ],
    io: "graph-start",
    testCases: [
      {
        input: "5 8\n0 1 -1\n0 2 4\n1 2 3\n1 3 2\n1 4 2\n3 2 5\n3 1 1\n4 3 -3\n0",
        expectedOutput: "0 -1 2 -2 1"
      },
      {
        input: "4 4\n0 1 1\n1 2 2\n2 3 3\n0 3 10\n0",
        expectedOutput: "0 1 3 6"
      },
      {
        input: "3 2\n0 1 5\n1 2 3\n2",
        expectedOutput: "-1 -1 0"
      },
      {
        input: "1 0\n0",
        expectedOutput: "0"
      },
      {
        input: "4 5\n0 1 4\n0 2 5\n1 2 -3\n2 3 4\n1 3 6\n0",
        expectedOutput: "0 4 1 5"
      },
      {
        input: "5 6\n0 1 6\n0 2 7\n1 2 8\n1 3 5\n1 4 -4\n2 3 -3\n0",
        expectedOutput: "0 6 7 4 2"
      },
      {
        input: "3 3\n0 1 1\n1 2 -1\n0 2 5\n0",
        expectedOutput: "0 1 0"
      },
      {
        input: "6 7\n0 1 2\n0 2 4\n1 3 1\n2 3 3\n3 4 2\n4 5 1\n3 5 10\n0",
        expectedOutput: "0 2 4 3 5 6"
      },
      {
        input: "4 4\n0 1 3\n2 0 1\n1 2 2\n2 3 5\n3",
        expectedOutput: "-1 -1 -1 0"
      },
      {
        input: "5 7\n0 1 2\n1 2 3\n2 4 1\n0 3 1\n3 4 5\n1 3 4\n3 2 1\n0",
        expectedOutput: "0 2 2 1 3"
      },
      {
        input: "2 1\n1 0 8\n0",
        expectedOutput: "0 -1"
      },
      {
        input: "7 9\n0 1 4\n0 2 3\n1 2 -2\n1 3 5\n2 3 2\n3 4 1\n4 5 2\n5 6 3\n4 6 6\n0",
        expectedOutput: "0 4 2 4 5 7 10"
      }
    ]
  },
  {
    id: "bipartite-graph",
    "hints": ["A graph is bipartite exactly when it can be two-colored so no edge joins same-colored nodes — an odd cycle is the only obstruction, so try building the coloring and watch for contradictions.","Run BFS/DFS from every unvisited node assigning alternating colors to neighbors in a color array; a neighbor that already has the same color proves the graph is not bipartite."],
    returns: "bool",
    title: "Bipartite Graph",
    difficulty: "medium",
    topic: "graphs",
    companies: [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    description: "Given an undirected graph with n nodes labeled 0 to n-1, determine whether it is bipartite, i.e. whether the nodes can be split into two sets so that every edge connects a node from one set to a node from the other. Input format: first line n m, then m lines u v. Output true if the graph is bipartite, false otherwise.",
    examples: [
      {
        input: "4 4\n0 1\n1 2\n2 3\n3 0",
        output: "true",
        explanation: "An even cycle is bipartite."
      },
      {
        input: "3 3\n0 1\n1 2\n2 0",
        output: "false",
        explanation: "A triangle is not bipartite."
      },
      {
        input: "5 4\n0 1\n0 2\n0 3\n0 4",
        output: "true",
        explanation: "A star is bipartite."
      }
    ],
    constraints: [
      "1 <= n <= 100",
      "0 <= m <= n*(n-1)/2"
    ],
    io: "graph",
    testCases: [
      {
        input: "4 4\n0 1\n1 2\n2 3\n3 0",
        expectedOutput: "true"
      },
      {
        input: "3 3\n0 1\n1 2\n2 0",
        expectedOutput: "false"
      },
      {
        input: "5 4\n0 1\n0 2\n0 3\n0 4",
        expectedOutput: "true"
      },
      {
        input: "6 6\n0 1\n1 2\n2 0\n3 4\n4 5\n5 3",
        expectedOutput: "false"
      },
      {
        input: "1 0",
        expectedOutput: "true"
      },
      {
        input: "4 6\n0 1\n0 2\n0 3\n1 2\n1 3\n2 3",
        expectedOutput: "false"
      },
      {
        input: "6 5\n0 1\n1 2\n2 3\n3 4\n4 5",
        expectedOutput: "true"
      },
      {
        input: "5 0",
        expectedOutput: "true"
      },
      {
        input: "8 8\n0 1\n1 2\n2 3\n3 0\n4 5\n5 6\n6 7\n7 4",
        expectedOutput: "true"
      },
      {
        input: "5 6\n0 1\n1 2\n2 3\n3 4\n4 0\n0 2",
        expectedOutput: "false"
      },
      {
        input: "2 1\n0 1",
        expectedOutput: "true"
      },
      {
        input: "7 7\n0 1\n1 2\n2 3\n3 4\n4 5\n5 6\n6 0",
        expectedOutput: "false"
      }
    ]
  },
  {
    id: "word-ladder",
    "hints": ["Each word is a node and edges join words differing by one letter, so the transformation length is a shortest path in this implicit graph — avoid O(n^2) pairwise comparisons.","Run BFS from beginWord using wildcard patterns (e.g. h*t) or one-letter mutation generation with a visited set, counting levels for the sequence length including both endpoints."],
    returns: "int",
    title: "Word Ladder",
    difficulty: "hard",
    topic: "graphs",
    companies: [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    description: "A transformation sequence from beginWord to endWord using a dictionary is a sequence of words where each adjacent pair differs by exactly one letter and every intermediate word is in the dictionary. Given the dictionary words, find the length of the shortest such sequence, counting both beginWord and endWord. Input format: first line n (number of dictionary words), second line the n words separated by spaces, third line beginWord endWord. Output the sequence length, or 0 if no sequence exists.",
    examples: [
      {
        input: "7\nhit hot dot dog lot log cog\nhit cog",
        output: "5",
        explanation: "hit -> hot -> dot -> dog -> cog has length 5."
      },
      {
        input: "6\nhit hot dot dog lot log\nhit hot",
        output: "2",
        explanation: "Direct transformation has length 2."
      },
      {
        input: "3\nabc def ghi\nabc ghi",
        output: "0",
        explanation: "No transformation sequence exists."
      }
    ],
    constraints: [
      "1 <= n <= 500",
      "All words have the same length",
      "1 <= word length <= 10"
    ],
    io: "graph",
    testCases: [
      {
        input: "7\nhit hot dot dog lot log cog\nhit cog",
        expectedOutput: "5"
      },
      {
        input: "6\nhit hot dot dog lot log\nhit hot",
        expectedOutput: "2"
      },
      {
        input: "3\nabc def ghi\nabc ghi",
        expectedOutput: "0"
      },
      {
        input: "1\na\na a",
        expectedOutput: "1"
      },
      {
        input: "5\ncold cord card ward warm\ncold warm",
        expectedOutput: "5"
      },
      {
        input: "4\naaa aab abb bbb\naaa bbb",
        expectedOutput: "4"
      },
      {
        input: "2\ncat bat\ncat dog",
        expectedOutput: "0"
      },
      {
        input: "4\nlead load goad gold\nlead gold",
        expectedOutput: "4"
      },
      {
        input: "6\ncat cot cog dot dog log\ncat dog",
        expectedOutput: "4"
      },
      {
        input: "3\nhot dot dog\nhot dog",
        expectedOutput: "3"
      },
      {
        input: "4\nab ac ad ae\nab ae",
        expectedOutput: "2"
      },
      {
        input: "4\ncode cade cate cats\ncode cats",
        expectedOutput: "4"
      }
    ]
  },
  {
    id: "allen-dictionary",
    "hints": ["You only need dictionary words of the same length that differ in exactly one position, so length filtering first keeps the comparison work focused.","Group the dictionary by word length, then compare the query word against each same-length candidate position by position, collecting those with exactly one mismatch."],
    returns: "string",
    title: "Allen Dictionary",
    difficulty: "medium",
    topic: "graphs",
    companies: [
      "Amazon",
      "Directi"
    ],
    description: "Given a dictionary of n words and a query word, find all dictionary words that have the same length as the query word and differ from it in exactly one character position. Input format: first line n, second line the n words separated by spaces, third line the query word. Output the matching words sorted lexicographically and separated by a single space, or -1 if there are none.",
    examples: [
      {
        input: "5\ncat bat rat dog cog\ncat",
        output: "bat rat",
        explanation: "bat and rat each differ from cat in exactly one position."
      },
      {
        input: "4\nhello hallo hullo help\nhello",
        output: "hallo hullo",
        explanation: "hallo and hullo differ in exactly one position."
      },
      {
        input: "3\nabc def ghi\nxyz",
        output: "-1",
        explanation: "No word differs in exactly one position."
      }
    ],
    constraints: [
      "1 <= n <= 500",
      "1 <= word length <= 20"
    ],
    io: "graph",
    testCases: [
      {
        input: "5\ncat bat rat dog cog\ncat",
        expectedOutput: "bat rat"
      },
      {
        input: "4\nhello hallo hullo help\nhello",
        expectedOutput: "hallo hullo"
      },
      {
        input: "3\nabc def ghi\nxyz",
        expectedOutput: "-1"
      },
      {
        input: "4\naaa aab abb bbb\naaa",
        expectedOutput: "aab"
      },
      {
        input: "1\ntest\ntest",
        expectedOutput: "-1"
      },
      {
        input: "6\ncold cord card ward warm\nword",
        expectedOutput: "cord ward"
      },
      {
        input: "3\nab ac ad\nab",
        expectedOutput: "ac ad"
      },
      {
        input: "4\nstone stoke spoke smoke\nstoke",
        expectedOutput: "smoke spoke stone"
      },
      {
        input: "2\na b\na",
        expectedOutput: "b"
      },
      {
        input: "4\nabcd abce abde acde\nabcf",
        expectedOutput: "abcd abce"
      },
      {
        input: "3\nlonger short words\nlonger",
        expectedOutput: "-1"
      },
      {
        input: "5\ncat cats cut cart\ncat",
        expectedOutput: "cut"
      }
    ]
  },
  {
    id: "kruskals-mst",
    "hints": ["If you always take the globally cheapest edge that doesn't create a cycle, the result is guaranteed to be a minimum spanning tree — the key is fast cycle detection.","Sort all edges by weight and use a union-find (disjoint set) structure: add an edge to the total only when its endpoints are in different sets, then union them."],
    returns: "int",
    title: "Kruskal's Algorithm for MST",
    difficulty: "medium",
    topic: "graphs",
    companies: [
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    description: "Given a connected undirected weighted graph with n nodes labeled 0 to n-1, compute the total weight of its minimum spanning tree using Kruskal's algorithm. Input format: first line n m, then m lines u v w.",
    examples: [
      {
        input: "4 5\n0 1 10\n0 2 6\n0 3 5\n1 3 15\n2 3 4",
        output: "19",
        explanation: "MST edges weigh 4, 5 and 10 for a total of 19."
      },
      {
        input: "3 3\n0 1 1\n1 2 2\n0 2 3",
        output: "3",
        explanation: "MST uses the two cheapest edges: total 3."
      },
      {
        input: "5 6\n0 1 1\n1 2 2\n2 3 3\n3 4 4\n0 4 10\n1 3 5",
        output: "10",
        explanation: "MST total weight is 10."
      }
    ],
    constraints: [
      "1 <= n <= 100",
      "The graph is connected",
      "1 <= w <= 1000"
    ],
    io: "graph",
    testCases: [
      {
        input: "4 5\n0 1 10\n0 2 6\n0 3 5\n1 3 15\n2 3 4",
        expectedOutput: "19"
      },
      {
        input: "3 3\n0 1 1\n1 2 2\n0 2 3",
        expectedOutput: "3"
      },
      {
        input: "5 6\n0 1 1\n1 2 2\n2 3 3\n3 4 4\n0 4 10\n1 3 5",
        expectedOutput: "10"
      },
      {
        input: "2 1\n1 0 9",
        expectedOutput: "9"
      },
      {
        input: "1 0",
        expectedOutput: "0"
      },
      {
        input: "6 9\n0 1 4\n0 2 4\n1 2 2\n2 3 3\n2 5 2\n2 4 4\n3 4 3\n4 5 3\n1 4 1",
        expectedOutput: "12"
      },
      {
        input: "4 3\n0 1 5\n1 2 5\n2 3 5",
        expectedOutput: "15"
      },
      {
        input: "5 7\n0 1 2\n0 3 6\n1 2 3\n1 3 8\n1 4 5\n2 4 7\n3 4 9",
        expectedOutput: "16"
      },
      {
        input: "3 2\n0 1 4\n1 2 4",
        expectedOutput: "8"
      },
      {
        input: "7 11\n0 1 7\n0 3 5\n1 2 8\n1 3 9\n1 4 7\n2 4 5\n3 4 15\n3 5 6\n4 5 8\n4 6 9\n5 6 11",
        expectedOutput: "39"
      },
      {
        input: "4 5\n0 1 2\n1 2 3\n2 3 1\n3 0 4\n0 2 5",
        expectedOutput: "6"
      },
      {
        input: "8 10\n0 1 1\n1 2 2\n2 3 3\n3 4 4\n4 5 5\n5 6 6\n6 7 7\n0 7 8\n1 6 9\n2 5 10",
        expectedOutput: "28"
      }
    ]
  },
  {
    id: "count-spanning-trees",
    "hints": ["Counting trees combinatorially is intractable by enumeration, but linear algebra gives the answer directly through the graph's Laplacian matrix.","Apply Kirchhoff's Matrix-Tree theorem: build the Laplacian (degree matrix minus adjacency matrix), delete any one row and column, and compute the determinant of the resulting cofactor."],
    returns: "int",
    title: "Total Number of Spanning Trees",
    difficulty: "hard",
    topic: "graphs",
    companies: [
      "Amazon",
      "Microsoft"
    ],
    description: "Given an undirected graph with n nodes labeled 0 to n-1, count the total number of distinct spanning trees of the graph. Input format: first line n m, then m lines u v.",
    examples: [
      {
        input: "3 3\n0 1\n1 2\n2 0",
        output: "3",
        explanation: "A triangle has 3 spanning trees."
      },
      {
        input: "4 6\n0 1\n0 2\n0 3\n1 2\n1 3\n2 3",
        output: "16",
        explanation: "A complete graph on 4 nodes has 16 spanning trees."
      },
      {
        input: "4 3\n0 1\n1 2\n2 3",
        output: "1",
        explanation: "A tree has exactly 1 spanning tree: itself."
      }
    ],
    constraints: [
      "1 <= n <= 6",
      "0 <= m <= n*(n-1)/2"
    ],
    io: "graph",
    testCases: [
      {
        input: "3 3\n0 1\n1 2\n2 0",
        expectedOutput: "3"
      },
      {
        input: "4 6\n0 1\n0 2\n0 3\n1 2\n1 3\n2 3",
        expectedOutput: "16"
      },
      {
        input: "4 3\n0 1\n1 2\n2 3",
        expectedOutput: "1"
      },
      {
        input: "1 0",
        expectedOutput: "1"
      },
      {
        input: "2 1\n0 1",
        expectedOutput: "1"
      },
      {
        input: "4 4\n0 1\n1 2\n2 3\n3 0",
        expectedOutput: "4"
      },
      {
        input: "5 4\n0 1\n0 2\n0 3\n0 4",
        expectedOutput: "1"
      },
      {
        input: "4 5\n0 1\n0 2\n0 3\n1 2\n2 3",
        expectedOutput: "8"
      },
      {
        input: "5 5\n0 1\n1 2\n2 3\n3 4\n4 0",
        expectedOutput: "5"
      },
      {
        input: "3 2\n0 1\n1 2",
        expectedOutput: "1"
      },
      {
        input: "6 5\n0 1\n1 2\n2 3\n3 4\n4 5",
        expectedOutput: "1"
      },
      {
        input: "5 6\n0 1\n1 2\n2 0\n2 3\n3 4\n4 2",
        expectedOutput: "9"
      }
    ]
  },
  {
    id: "travelling-salesman",
    "hints": ["The tour is a permutation of cities with the return edge, and brute-forcing all n! orders is infeasible — you need to memoize the best cost of reaching each state.","Use DP over subsets: dp[mask][last] = minimum cost to visit exactly the cities in mask ending at last, transitioning by adding one unvisited city, then close the tour back to city 0."],
    returns: "int",
    title: "Travelling Salesman Problem",
    difficulty: "hard",
    topic: "graphs",
    companies: [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    description: "Given an n x n cost matrix where cost[i][j] is the cost of traveling from city i to city j, find the minimum cost of a tour that starts at city 0, visits every city exactly once, and returns to city 0. Input format: first line n n, then n rows of the cost matrix.",
    examples: [
      {
        input: "4 4\n0 10 15 20\n10 0 35 25\n15 35 0 30\n20 25 30 0",
        output: "80",
        explanation: "The optimal tour 0 -> 1 -> 3 -> 2 -> 0 costs 80."
      },
      {
        input: "3 3\n0 5 10\n5 0 15\n10 15 0",
        output: "30",
        explanation: "Both tours cost 30."
      },
      {
        input: "2 2\n0 7\n7 0",
        output: "14",
        explanation: "The only tour costs 14."
      }
    ],
    constraints: [
      "1 <= n <= 8",
      "0 <= cost[i][j] <= 1000"
    ],
    io: "matrix",
    testCases: [
      {
        input: "4 4\n0 10 15 20\n10 0 35 25\n15 35 0 30\n20 25 30 0",
        expectedOutput: "80"
      },
      {
        input: "3 3\n0 5 10\n5 0 15\n10 15 0",
        expectedOutput: "30"
      },
      {
        input: "2 2\n0 7\n7 0",
        expectedOutput: "14"
      },
      {
        input: "1 1\n0",
        expectedOutput: "0"
      },
      {
        input: "4 4\n0 1 1 1\n1 0 1 1\n1 1 0 1\n1 1 1 0",
        expectedOutput: "4"
      },
      {
        input: "5 5\n0 3 1 5 8\n3 0 6 7 9\n1 6 0 4 2\n5 7 4 0 3\n8 9 2 3 0",
        expectedOutput: "16"
      },
      {
        input: "3 3\n0 1 2\n3 0 4\n5 6 0",
        expectedOutput: "10"
      },
      {
        input: "6 6\n0 2 3 4 5 6\n2 0 7 8 9 10\n3 7 0 11 12 13\n4 8 11 0 14 15\n5 9 12 14 0 16\n6 10 13 15 16 0",
        expectedOutput: "52"
      },
      {
        input: "4 4\n0 2 9 10\n1 0 6 4\n15 7 0 8\n6 3 12 0",
        expectedOutput: "21"
      },
      {
        input: "2 2\n0 3\n4 0",
        expectedOutput: "7"
      },
      {
        input: "5 5\n0 2 2 2 2\n2 0 2 2 2\n2 2 0 2 2\n2 2 2 0 2\n2 2 2 2 0",
        expectedOutput: "10"
      },
      {
        input: "3 3\n0 10 20\n10 0 30\n20 30 0",
        expectedOutput: "60"
      }
    ]
  },
  {
    id: "longest-path-in-dag",
    "hints": ["In a DAG the longest path is easy because processing nodes in dependency order means every predecessor is already resolved when a node's turn comes.","Obtain a topological order first (Kahn's algorithm or DFS finishing order), then relax edges in that order taking the maximum distance; unreachable-from-source nodes contribute nothing."],
    returns: "int",
    title: "Longest Path in a Directed Acyclic Graph",
    difficulty: "medium",
    topic: "graphs",
    companies: [
      "Amazon",
      "Google"
    ],
    description: "Given a directed acyclic graph with weighted edges and a source node, find the length of the longest path starting from the source. Input format: first line n m, then m lines u v w for a directed edge from u to v with weight w, then a final line with the source node. Output the maximum distance; 0 if no edge is reachable from the source.",
    examples: [
      {
        input: "6 7\n0 1 5\n0 2 3\n1 3 6\n1 2 2\n2 4 4\n2 5 2\n3 4 1\n0",
        output: "12",
        explanation: "The longest path is 0 -> 1 -> 3 -> 4 with weight 12."
      },
      {
        input: "4 3\n0 1 1\n1 2 2\n2 3 3\n0",
        output: "6",
        explanation: "The only path has weight 6."
      },
      {
        input: "3 0\n1",
        output: "0",
        explanation: "Node 1 is isolated, so the longest path has weight 0."
      }
    ],
    constraints: [
      "1 <= n <= 100",
      "The graph is guaranteed to be acyclic",
      "1 <= w <= 1000"
    ],
    io: "graph-start",
    testCases: [
      {
        input: "6 7\n0 1 5\n0 2 3\n1 3 6\n1 2 2\n2 4 4\n2 5 2\n3 4 1\n0",
        expectedOutput: "12"
      },
      {
        input: "4 3\n0 1 1\n1 2 2\n2 3 3\n0",
        expectedOutput: "6"
      },
      {
        input: "3 0\n1",
        expectedOutput: "0"
      },
      {
        input: "5 4\n0 1 10\n0 2 1\n1 3 1\n2 3 1\n0",
        expectedOutput: "11"
      },
      {
        input: "4 4\n0 1 2\n0 2 3\n1 3 4\n2 3 5\n2",
        expectedOutput: "5"
      },
      {
        input: "7 8\n0 1 1\n0 2 2\n1 3 3\n2 3 1\n3 4 4\n3 5 2\n4 6 1\n5 6 5\n0",
        expectedOutput: "11"
      },
      {
        input: "2 1\n0 1 7\n1",
        expectedOutput: "0"
      },
      {
        input: "5 6\n0 1 3\n0 2 2\n1 4 4\n2 4 6\n1 3 1\n3 4 2\n0",
        expectedOutput: "8"
      },
      {
        input: "1 0\n0",
        expectedOutput: "0"
      },
      {
        input: "6 5\n5 4 1\n4 3 2\n3 2 3\n2 1 4\n1 0 5\n5",
        expectedOutput: "15"
      },
      {
        input: "4 4\n0 2 5\n0 1 1\n1 2 10\n2 3 2\n0",
        expectedOutput: "13"
      },
      {
        input: "8 9\n0 1 2\n0 2 3\n1 3 4\n2 3 1\n3 4 2\n3 5 5\n4 6 1\n5 6 2\n6 7 3\n0",
        expectedOutput: "16"
      }
    ]
  },
  {
    id: "two-clique-problem",
    "hints": ["Partitioning into two cliques is equivalent to checking a transformed graph for bipartiteness, because a clique in the original becomes an independent set in the complement.","Build the complement graph (edges where the original has none, excluding self-loops) and test it for bipartiteness with two-color BFS/DFS."],
    returns: "bool",
    title: "Two Clique Problem",
    difficulty: "hard",
    topic: "graphs",
    companies: [
      "Amazon",
      "Microsoft"
    ],
    description: "Given an undirected graph with n nodes labeled 0 to n-1, determine whether the nodes can be partitioned into two groups such that each group forms a clique (every pair of nodes within the group is connected by an edge). Input format: first line n m, then m lines u v. Output true if such a partition exists, false otherwise.",
    examples: [
      {
        input: "4 4\n0 1\n1 2\n2 3\n3 0",
        output: "true",
        explanation: "Partition into {0,2} and {1,3}: each pair within a group is not required to be an edge in the complement sense; verified via complement bipartiteness."
      },
      {
        input: "5 5\n0 1\n1 2\n2 3\n3 4\n4 0",
        output: "false",
        explanation: "The complement of C5 is C5, which is not bipartite."
      },
      {
        input: "4 6\n0 1\n0 2\n0 3\n1 2\n1 3\n2 3",
        output: "true",
        explanation: "The whole graph is already a clique."
      }
    ],
    constraints: [
      "1 <= n <= 50",
      "0 <= m <= n*(n-1)/2"
    ],
    io: "graph",
    testCases: [
      {
        input: "4 4\n0 1\n1 2\n2 3\n3 0",
        expectedOutput: "true"
      },
      {
        input: "5 5\n0 1\n1 2\n2 3\n3 4\n4 0",
        expectedOutput: "false"
      },
      {
        input: "4 6\n0 1\n0 2\n0 3\n1 2\n1 3\n2 3",
        expectedOutput: "true"
      },
      {
        input: "3 3\n0 1\n1 2\n2 0",
        expectedOutput: "true"
      },
      {
        input: "6 9\n0 1\n0 2\n0 3\n1 2\n1 3\n2 3\n3 4\n4 5\n3 5",
        expectedOutput: "true"
      },
      {
        input: "1 0",
        expectedOutput: "true"
      },
      {
        input: "2 0",
        expectedOutput: "true"
      },
      {
        input: "6 5\n0 1\n1 2\n2 3\n3 4\n4 5",
        expectedOutput: "false"
      },
      {
        input: "5 10\n0 1\n0 2\n0 3\n0 4\n1 2\n1 3\n1 4\n2 3\n2 4\n3 4",
        expectedOutput: "true"
      },
      {
        input: "4 5\n0 1\n0 2\n0 3\n1 2\n2 3",
        expectedOutput: "true"
      },
      {
        input: "7 9\n0 1\n1 2\n2 0\n3 4\n4 5\n5 3\n0 3\n1 4\n2 5",
        expectedOutput: "false"
      },
      {
        input: "3 0",
        expectedOutput: "false"
      }
    ]
  },
  {
    id: "minimise-cash-flow",
    "hints": ["Individual debts cancel out: only each person's net balance matters, and the minimum transactions equal the number of people settled after greedily matching debtors with creditors.","Compute net amounts (received minus paid), then repeatedly pair the largest debtor with the largest creditor, settling the smaller of the two amounts in one transaction until all nets are zero."],
    returns: "int",
    title: "Minimise the Cash Flow",
    difficulty: "medium",
    topic: "graphs",
    companies: [
      "Amazon",
      "Google"
    ],
    description: "There are n friends labeled 0 to n-1. You are given m debts as triples u v w meaning person u owes person v an amount w. Find the minimum number of transactions needed to settle all debts (a transaction is one person paying any amount to another). Input format: first line n m, then m lines u v w.",
    examples: [
      {
        input: "3 3\n0 1 10\n1 2 5\n2 0 5",
        output: "1",
        explanation: "Net amounts are -5, 5, 0, so one transaction settles everything."
      },
      {
        input: "2 1\n0 1 7",
        output: "1",
        explanation: "Person 0 simply pays person 1."
      },
      {
        input: "4 4\n0 1 10\n1 2 10\n2 3 10\n3 0 10",
        output: "0",
        explanation: "Everybody's net amount is already zero."
      }
    ],
    constraints: [
      "1 <= n <= 8",
      "0 <= m <= n*(n-1)",
      "1 <= w <= 1000"
    ],
    io: "graph",
    testCases: [
      {
        input: "3 3\n0 1 10\n1 2 5\n2 0 5",
        expectedOutput: "1"
      },
      {
        input: "2 1\n0 1 7",
        expectedOutput: "1"
      },
      {
        input: "4 4\n0 1 10\n1 2 10\n2 3 10\n3 0 10",
        expectedOutput: "0"
      },
      {
        input: "3 2\n0 1 5\n0 2 5",
        expectedOutput: "2"
      },
      {
        input: "3 3\n0 1 5\n1 0 5\n0 2 3",
        expectedOutput: "1"
      },
      {
        input: "4 3\n0 1 4\n1 2 4\n2 3 4",
        expectedOutput: "1"
      },
      {
        input: "5 4\n0 1 10\n0 2 10\n3 0 5\n4 0 5",
        expectedOutput: "3"
      },
      {
        input: "1 0",
        expectedOutput: "0"
      },
      {
        input: "4 6\n0 1 1\n0 2 2\n0 3 3\n1 2 4\n1 3 5\n2 3 6",
        expectedOutput: "2"
      },
      {
        input: "6 5\n0 1 5\n2 3 5\n4 5 5\n1 2 5\n3 4 5",
        expectedOutput: "1"
      },
      {
        input: "3 4\n0 1 10\n0 1 5\n1 2 7\n2 0 3",
        expectedOutput: "2"
      },
      {
        input: "4 4\n0 2 5\n1 2 5\n2 3 6\n3 0 2",
        expectedOutput: "3"
      }
    ]
  },
  {
    id: "chinese-postman",
    "hints": ["All-even-degree graphs have an Euler circuit covering every edge exactly once; the extra cost comes only from the odd-degree nodes, which must be paired up via shortest paths.","Sum all edge weights, then if odd-degree nodes exist, find all-pairs shortest paths among them and compute the minimum-weight perfect matching to determine the cheapest retracing."],
    returns: "int",
    title: "Chinese Postman Problem",
    difficulty: "hard",
    topic: "graphs",
    companies: [
      "Amazon",
      "Google"
    ],
    description: "A postman must traverse every road of an undirected weighted graph at least once and return to the start, minimizing the total distance traveled. Given n nodes labeled 0 to n-1 and m weighted edges, compute the minimum route length. Input format: first line n m, then m lines u v w. The graph is connected.",
    examples: [
      {
        input: "4 4\n0 1 1\n1 2 1\n2 3 1\n3 0 1",
        output: "4",
        explanation: "Every node has even degree, so the tour is just the sum of edges: 4."
      },
      {
        input: "4 3\n0 1 2\n1 2 3\n2 3 4",
        output: "18",
        explanation: "Nodes 0 and 3 have odd degree; the shortest path between them (9) must be retraced: 18."
      },
      {
        input: "3 3\n0 1 5\n1 2 6\n2 0 7",
        output: "18",
        explanation: "Eulerian graph: total is 18."
      }
    ],
    constraints: [
      "1 <= n <= 10",
      "The graph is connected",
      "1 <= w <= 100"
    ],
    io: "graph",
    testCases: [
      {
        input: "4 4\n0 1 1\n1 2 1\n2 3 1\n3 0 1",
        expectedOutput: "4"
      },
      {
        input: "4 3\n0 1 2\n1 2 3\n2 3 4",
        expectedOutput: "18"
      },
      {
        input: "3 3\n0 1 5\n1 2 6\n2 0 7",
        expectedOutput: "18"
      },
      {
        input: "2 1\n0 1 10",
        expectedOutput: "20"
      },
      {
        input: "1 0",
        expectedOutput: "0"
      },
      {
        input: "4 5\n0 1 1\n0 2 1\n0 3 1\n1 2 10\n2 3 10",
        expectedOutput: "24"
      },
      {
        input: "5 6\n0 1 2\n1 2 2\n2 3 2\n3 4 2\n4 0 2\n0 2 5",
        expectedOutput: "19"
      },
      {
        input: "6 7\n0 1 1\n1 2 1\n2 3 1\n3 4 1\n4 5 1\n5 0 1\n0 3 5",
        expectedOutput: "14"
      },
      {
        input: "3 2\n0 1 4\n1 2 6",
        expectedOutput: "20"
      },
      {
        input: "5 5\n0 1 3\n1 2 3\n2 0 3\n2 3 4\n3 4 4",
        expectedOutput: "25"
      },
      {
        input: "4 6\n0 1 2\n0 2 2\n0 3 2\n1 2 2\n1 3 2\n2 3 2",
        expectedOutput: "16"
      },
      {
        input: "7 6\n0 1 1\n1 2 2\n2 3 3\n3 4 4\n4 5 5\n5 6 6",
        expectedOutput: "42"
      }
    ]
  },
  {
    id: "water-jug",
    "hints": ["Every reachable state is a pair (a, b) of jug contents, and the operations are deterministic transitions between states, which turns this into a reachability question.","Run BFS/DFS over the state space of (x-contents, y-contents) with a visited set, generating the six transitions (fill, empty, pour each jug), and check for a state containing z; a gcd(x, y) divisibility check also decides feasibility."],
    returns: "bool",
    title: "Water Jug Problem",
    difficulty: "medium",
    topic: "graphs",
    companies: [
      "Amazon",
      "Microsoft"
    ],
    description: "You have two jugs with capacities x and y litres. You may fill a jug, empty a jug, or pour from one jug into the other until it is full or the first is empty. Determine whether it is possible to end up with exactly z litres in either jug. Input format: a single line x y z. Output true if z can be measured, false otherwise.",
    examples: [
      {
        input: "3 5 4",
        output: "true",
        explanation: "4 litres can be measured with 3 and 5 litre jugs."
      },
      {
        input: "2 6 5",
        output: "false",
        explanation: "5 cannot be measured since it is not a multiple of gcd(2,6)=2."
      },
      {
        input: "2 3 1",
        output: "true",
        explanation: "Fill the 3-litre jug and pour into the 2-litre jug, leaving 1 litre."
      }
    ],
    constraints: [
      "0 <= x, y <= 100",
      "0 <= z <= 200"
    ],
    io: "three-ints",
    testCases: [
      {
        input: "3 5 4",
        expectedOutput: "true"
      },
      {
        input: "2 6 5",
        expectedOutput: "false"
      },
      {
        input: "2 3 1",
        expectedOutput: "true"
      },
      {
        input: "4 6 5",
        expectedOutput: "false"
      },
      {
        input: "5 5 5",
        expectedOutput: "true"
      },
      {
        input: "10 15 25",
        expectedOutput: "false"
      },
      {
        input: "8 3 4",
        expectedOutput: "true"
      },
      {
        input: "2 4 3",
        expectedOutput: "false"
      },
      {
        input: "1 1 0",
        expectedOutput: "true"
      },
      {
        input: "7 11 6",
        expectedOutput: "true"
      },
      {
        input: "6 10 14",
        expectedOutput: "false"
      },
      {
        input: "9 6 3",
        expectedOutput: "true"
      }
    ]
  },
  {
    id: "water-jug-2",
    "hints": ["Since every operation costs exactly one step, the fewest steps to reach z is the shortest path in the jug-state graph from the initial empty state.","Run BFS over (a, b) states with a visited set, expanding fill/empty/pour transitions level by level, and return the depth at which z first appears (or -1 after full exploration)."],
    returns: "int",
    title: "Water Jug Minimum Steps",
    difficulty: "medium",
    topic: "graphs",
    companies: [
      "Amazon",
      "Google"
    ],
    description: "You have two jugs with capacities x and y litres. In one step you may fill a jug, empty a jug, or pour from one jug into the other until it is full or the first is empty. Find the minimum number of steps to have exactly z litres in either jug. Input format: a single line x y z. Output the minimum steps, or -1 if impossible.",
    examples: [
      {
        input: "3 5 4",
        output: "6",
        explanation: "6 steps suffice to measure 4 litres."
      },
      {
        input: "2 6 5",
        output: "-1",
        explanation: "Impossible: 5 is not a multiple of gcd(2,6)=2."
      },
      {
        input: "1 1 1",
        output: "1",
        explanation: "Fill either jug in 1 step."
      }
    ],
    constraints: [
      "0 <= x, y <= 100",
      "0 <= z <= 200"
    ],
    io: "three-ints",
    testCases: [
      {
        input: "3 5 4",
        expectedOutput: "6"
      },
      {
        input: "2 6 5",
        expectedOutput: "-1"
      },
      {
        input: "1 1 1",
        expectedOutput: "1"
      },
      {
        input: "4 6 8",
        expectedOutput: "-1"
      },
      {
        input: "5 3 4",
        expectedOutput: "6"
      },
      {
        input: "2 3 1",
        expectedOutput: "2"
      },
      {
        input: "7 5 6",
        expectedOutput: "10"
      },
      {
        input: "10 6 8",
        expectedOutput: "6"
      },
      {
        input: "3 5 0",
        expectedOutput: "0"
      },
      {
        input: "4 9 6",
        expectedOutput: "8"
      },
      {
        input: "2 10 4",
        expectedOutput: "4"
      },
      {
        input: "6 4 2",
        expectedOutput: "2"
      }
    ]
  }
,
  {
    id: "knapsack-with-duplicate-items",
    "hints": ["Think of the best value achievable for every capacity from 0 up to W, and build the answer up one capacity at a time since the same item can be reused.","This is the unbounded knapsack pattern: a one-dimensional tabulation over capacity where taking an item lets you stay on that item again."],
    returns: "int",
    title: "Knapsack with Duplicate Items",
    difficulty: "medium",
    topic: "dp",
    companies: [
      "Amazon",
      "Flipkart",
      "Microsoft"
    ],
    description: "Given weights and values of n items and a knapsack capacity W, find the maximum value that can be put in the knapsack. Each item can be taken any number of times. Input has 2 rows: the first row holds the weights, the second row holds the values, followed by the capacity W.",
    examples: [
      {
        input: "2 3\n1 2 3\n10 15 40\n6",
        output: "80",
        explanation: "With capacity 6, taking the item of weight 3 and value 40 twice gives 80, which is the best possible."
      },
      {
        input: "2 2\n2 3\n10 15\n5",
        output: "25",
        explanation: "With capacity 5, one item of weight 2 and one of weight 3 give value 25."
      },
      {
        input: "2 1\n5\n10\n3",
        output: "0",
        explanation: "The only item weighs 5 which does not fit in capacity 3, so the answer is 0."
      }
    ],
    constraints: [
      "1 <= n <= 100",
      "1 <= W <= 1000",
      "1 <= weight[i], value[i] <= 100"
    ],
    io: "matrix-k",
    testCases: [
      {
        input: "2 3\n1 2 3\n10 15 40\n6",
        expectedOutput: "80"
      },
      {
        input: "2 2\n2 3\n10 15\n5",
        expectedOutput: "25"
      },
      {
        input: "2 1\n5\n10\n3",
        expectedOutput: "0"
      },
      {
        input: "2 4\n2 3 4 5\n3 4 5 6\n5",
        expectedOutput: "7"
      },
      {
        input: "2 3\n5 4 6\n10 40 30\n10",
        expectedOutput: "80"
      },
      {
        input: "2 2\n1 1\n2 3\n4",
        expectedOutput: "12"
      },
      {
        input: "2 5\n1 2 3 4 5\n1 2 3 4 5\n8",
        expectedOutput: "8"
      },
      {
        input: "2 3\n3 4 5\n30 50 60\n8",
        expectedOutput: "100"
      },
      {
        input: "2 2\n10 20\n60 100\n50",
        expectedOutput: "300"
      },
      {
        input: "2 3\n2 2 2\n5 5 5\n6",
        expectedOutput: "15"
      },
      {
        input: "2 4\n1 3 4 5\n1 4 5 7\n7",
        expectedOutput: "9"
      },
      {
        input: "2 1\n2\n5\n10",
        expectedOutput: "25"
      }
    ]
  },
  {
    id: "bbt-counter",
    "hints": ["A balanced tree of height h is built from two balanced subtrees of height h-1, or one of height h-1 and one of height h-2, so the count for h depends only on the counts for h-1 and h-2.","Use memoized one-dimensional DP over heights with the modulus applied at every step, combining the subtree-count options for the two child heights."],
    returns: "int",
    title: "BBT Counter",
    difficulty: "easy",
    topic: "dp",
    companies: [
      "Amazon",
      "Microsoft"
    ],
    description: "Count the number of balanced binary trees of height h. A balanced binary tree is one where the heights of the two subtrees of every node differ by at most one. Return the count modulo 1000000007.",
    examples: [
      {
        input: "1",
        output: "2",
        explanation: "There are 2 balanced binary trees of height 1."
      },
      {
        input: "2",
        output: "8",
        explanation: "There are 8 balanced binary trees of height 2."
      },
      {
        input: "3",
        output: "96",
        explanation: "There are 96 balanced binary trees of height 3."
      }
    ],
    constraints: [
      "1 <= h <= 1000"
    ],
    io: "int",
    testCases: [
      {
        input: "1",
        expectedOutput: "2"
      },
      {
        input: "2",
        expectedOutput: "8"
      },
      {
        input: "3",
        expectedOutput: "96"
      },
      {
        input: "4",
        expectedOutput: "10752"
      },
      {
        input: "5",
        expectedOutput: "117669888"
      },
      {
        input: "6",
        expectedOutput: "818262972"
      },
      {
        input: "7",
        expectedOutput: "850978293"
      },
      {
        input: "10",
        expectedOutput: "617284980"
      },
      {
        input: "15",
        expectedOutput: "800857053"
      },
      {
        input: "20",
        expectedOutput: "112231650"
      },
      {
        input: "50",
        expectedOutput: "104340751"
      },
      {
        input: "100",
        expectedOutput: "825741557"
      }
    ]
  },
  {
    id: "reach-a-given-score",
    "hints": ["This is a combination-counting problem: count distinct multisets of the moves {3, 5, 10} that total n, where order does not matter.","Use a one-dimensional tabulation in the coin-change counting style, iterating over moves in the outer loop and scores in the inner loop so each multiset is counted once."],
    returns: "int",
    title: "Reach a Given Score",
    difficulty: "easy",
    topic: "dp",
    companies: [
      "Amazon",
      "Adobe"
    ],
    description: "Find the number of ways to reach a score n using moves that add 3, 5 or 10 points. Two ways are the same if they use the same count of each move, regardless of order.",
    examples: [
      {
        input: "10",
        output: "2",
        explanation: "The valid multisets are {10} and {5,5}, so there are 2 ways."
      },
      {
        input: "20",
        output: "4",
        explanation: "Score 20 has 4 ways: {10,10}, {10,5,5}, {5,5,5,5}, {5,3,3,3,3,3}."
      },
      {
        input: "3",
        output: "1",
        explanation: "Score 3 has exactly 1 way: a single move of 3."
      }
    ],
    constraints: [
      "1 <= n <= 1000"
    ],
    io: "int",
    testCases: [
      {
        input: "10",
        expectedOutput: "2"
      },
      {
        input: "20",
        expectedOutput: "4"
      },
      {
        input: "3",
        expectedOutput: "1"
      },
      {
        input: "0",
        expectedOutput: "1"
      },
      {
        input: "5",
        expectedOutput: "1"
      },
      {
        input: "6",
        expectedOutput: "1"
      },
      {
        input: "8",
        expectedOutput: "1"
      },
      {
        input: "11",
        expectedOutput: "1"
      },
      {
        input: "13",
        expectedOutput: "2"
      },
      {
        input: "15",
        expectedOutput: "3"
      },
      {
        input: "18",
        expectedOutput: "3"
      },
      {
        input: "30",
        expectedOutput: "7"
      }
    ]
  },
  {
    id: "max-difference-zeros-ones",
    "hints": ["Map every 0 to +1 and every 1 to -1; the answer is the maximum subarray sum over these transformed values, with -1 returned if no positive sum exists.","This is a Kadane-style maximum-subarray scan: one pass tracking the best subarray ending at the current character, plus the global best."],
    returns: "int",
    title: "Maximum Difference of Zeros and Ones",
    difficulty: "easy",
    topic: "dp",
    companies: [
      "Amazon",
      "Microsoft"
    ],
    description: "Given a binary string, find the maximum difference between the count of zeros and the count of ones over all non-empty substrings, that is max(count0 - count1). If every substring has more ones than zeros, return -1.",
    examples: [
      {
        input: "11000010001",
        output: "6",
        explanation: "The substring 00001000 has seven zeros and one one, giving 7 - 1 = 6."
      },
      {
        input: "1111",
        output: "-1",
        explanation: "All characters are 1, so every substring has more ones than zeros and the answer is -1."
      },
      {
        input: "0000",
        output: "4",
        explanation: "All characters are 0, so the whole string gives 4 - 0 = 4."
      }
    ],
    constraints: [
      "1 <= s.length <= 10^5",
      "s consists of only 0 and 1"
    ],
    io: "string",
    testCases: [
      {
        input: "11000010001",
        expectedOutput: "6"
      },
      {
        input: "1111",
        expectedOutput: "-1"
      },
      {
        input: "0000",
        expectedOutput: "4"
      },
      {
        input: "10101",
        expectedOutput: "1"
      },
      {
        input: "1",
        expectedOutput: "-1"
      },
      {
        input: "0",
        expectedOutput: "1"
      },
      {
        input: "10",
        expectedOutput: "1"
      },
      {
        input: "01",
        expectedOutput: "1"
      },
      {
        input: "1100",
        expectedOutput: "2"
      },
      {
        input: "0011",
        expectedOutput: "2"
      },
      {
        input: "101000",
        expectedOutput: "3"
      },
      {
        input: "111000111",
        expectedOutput: "3"
      }
    ]
  },
  {
    id: "climbing-stairs",
    "hints": ["The ways to reach step n split on the last move: either a 1-step from n-1 or a 2-step from n-2, so the count for n is the sum of the two previous counts.","Classic one-dimensional Fibonacci-style DP: keep only the last two values, giving constant extra space."],
    returns: "int",
    title: "Climbing Stairs",
    difficulty: "easy",
    topic: "dp",
    companies: [
      "Amazon",
      "Google",
      "Adobe"
    ],
    description: "You are climbing a staircase with n steps. Each time you can climb either 1 or 2 steps. Return the number of distinct ways to reach the top.",
    examples: [
      {
        input: "1",
        output: "1",
        explanation: "There is 1 way to climb 1 step."
      },
      {
        input: "2",
        output: "2",
        explanation: "There are 2 ways to climb 2 steps: 1+1 and 2."
      },
      {
        input: "3",
        output: "3",
        explanation: "There are 3 ways to climb 3 steps: 1+1+1, 1+2 and 2+1."
      }
    ],
    constraints: [
      "1 <= n <= 45"
    ],
    io: "int",
    testCases: [
      {
        input: "1",
        expectedOutput: "1"
      },
      {
        input: "2",
        expectedOutput: "2"
      },
      {
        input: "3",
        expectedOutput: "3"
      },
      {
        input: "4",
        expectedOutput: "5"
      },
      {
        input: "5",
        expectedOutput: "8"
      },
      {
        input: "6",
        expectedOutput: "13"
      },
      {
        input: "10",
        expectedOutput: "89"
      },
      {
        input: "15",
        expectedOutput: "987"
      },
      {
        input: "20",
        expectedOutput: "10946"
      },
      {
        input: "30",
        expectedOutput: "1346269"
      },
      {
        input: "40",
        expectedOutput: "165580141"
      },
      {
        input: "45",
        expectedOutput: "1836311903"
      }
    ]
  },
  {
    id: "permutation-coefficient",
    "hints": ["Build the count up from smaller cases: choosing an ordered arrangement of k from n can be reduced to choosing one fewer from one fewer.","Fill a small two-dimensional table row by row using the multiplicative relationship between adjacent states, or accumulate the product directly over k terms."],
    returns: "int",
    title: "Permutation Coefficient",
    difficulty: "easy",
    topic: "dp",
    companies: [
      "Amazon",
      "Microsoft"
    ],
    description: "Compute the permutation coefficient P(n, k), the number of ways to arrange k distinct items chosen from n distinct items. P(n, k) = n * (n-1) * ... * (n-k+1). The input gives n and k.",
    examples: [
      {
        input: "2\n5 2",
        output: "20",
        explanation: "P(5, 2) = 5 * 4 = 20."
      },
      {
        input: "2\n10 3",
        output: "720",
        explanation: "P(10, 3) = 10 * 9 * 8 = 720."
      },
      {
        input: "2\n7 0",
        output: "1",
        explanation: "P(7, 0) = 1 by definition."
      }
    ],
    constraints: [
      "0 <= k <= n <= 20"
    ],
    io: "array",
    testCases: [
      {
        input: "2\n5 2",
        expectedOutput: "20"
      },
      {
        input: "2\n10 3",
        expectedOutput: "720"
      },
      {
        input: "2\n7 0",
        expectedOutput: "1"
      },
      {
        input: "2\n7 7",
        expectedOutput: "5040"
      },
      {
        input: "2\n6 1",
        expectedOutput: "6"
      },
      {
        input: "2\n8 4",
        expectedOutput: "1680"
      },
      {
        input: "2\n4 4",
        expectedOutput: "24"
      },
      {
        input: "2\n9 2",
        expectedOutput: "72"
      },
      {
        input: "2\n12 5",
        expectedOutput: "95040"
      },
      {
        input: "2\n5 3",
        expectedOutput: "60"
      },
      {
        input: "2\n15 2",
        expectedOutput: "210"
      },
      {
        input: "2\n10 10",
        expectedOutput: "3628800"
      }
    ]
  },
  {
    id: "longest-repeating-subsequence",
    "hints": ["Run a subsequence comparison of the string against itself, but require the two matched copies to use different positions in the string.","Use the two-dimensional LCS-style table with the added constraint that the two indices must not be equal when characters match."],
    returns: "int",
    title: "Longest Repeating Subsequence",
    difficulty: "medium",
    topic: "dp",
    companies: [
      "Amazon",
      "Google"
    ],
    description: "Given a string, find the length of the longest repeating subsequence: a subsequence that appears at least twice in the string with the two occurrences using different positions.",
    examples: [
      {
        input: "abcabc",
        output: "3",
        explanation: "The subsequence abc appears twice in abcabc, so the answer is 3."
      },
      {
        input: "aabebcdd",
        output: "3",
        explanation: "The longest repeating subsequence of aabebcdd is abd with length 3."
      },
      {
        input: "aaaa",
        output: "3",
        explanation: "Every character of aaaa repeats, giving length 3."
      }
    ],
    constraints: [
      "1 <= s.length <= 1000"
    ],
    io: "string",
    testCases: [
      {
        input: "abcabc",
        expectedOutput: "3"
      },
      {
        input: "aabebcdd",
        expectedOutput: "3"
      },
      {
        input: "aaaa",
        expectedOutput: "3"
      },
      {
        input: "abcdef",
        expectedOutput: "0"
      },
      {
        input: "axxxy",
        expectedOutput: "2"
      },
      {
        input: "abacaba",
        expectedOutput: "3"
      },
      {
        input: "a",
        expectedOutput: "0"
      },
      {
        input: "ab",
        expectedOutput: "0"
      },
      {
        input: "aaabbb",
        expectedOutput: "4"
      },
      {
        input: "abcdeabcde",
        expectedOutput: "5"
      },
      {
        input: "xyzxy",
        expectedOutput: "2"
      },
      {
        input: "aabbcc",
        expectedOutput: "3"
      }
    ]
  },
  {
    id: "pairs-with-specific-difference",
    "hints": ["As you scan the array left to right, each new element forms valid pairs only with previously seen values that are exactly k away from it.","A single pass with a hash map of seen values counts every valid pair in linear time with no nested loops."],
    returns: "int",
    title: "Pairs with Specific Difference",
    difficulty: "easy",
    topic: "dp",
    companies: [
      "Amazon",
      "Flipkart"
    ],
    description: "Given an array and an integer k, count the number of pairs (i, j) with i < j such that the absolute difference between arr[i] and arr[j] equals k.",
    examples: [
      {
        input: "5\n1 5 3 4 2\n2",
        output: "3",
        explanation: "The pairs with difference 2 in [1, 5, 3, 4, 2] are (1, 3), (5, 3) and (4, 2), giving 3."
      },
      {
        input: "5\n1 2 3 4 5\n1",
        output: "4",
        explanation: "In [1,2,3,4,5] with k=1 the pairs are (1,2), (2,3), (3,4), (4,5), giving 4."
      },
      {
        input: "4\n1 1 1 1\n0",
        output: "6",
        explanation: "All four ones form C(4,2) = 6 pairs with difference 0."
      }
    ],
    constraints: [
      "1 <= n <= 10^5",
      "0 <= k <= 10^9"
    ],
    io: "array-k",
    testCases: [
      {
        input: "5\n1 5 3 4 2\n2",
        expectedOutput: "3"
      },
      {
        input: "5\n1 2 3 4 5\n1",
        expectedOutput: "4"
      },
      {
        input: "4\n1 1 1 1\n0",
        expectedOutput: "6"
      },
      {
        input: "5\n5 4 3 2 1\n3",
        expectedOutput: "2"
      },
      {
        input: "3\n1 10 100\n9",
        expectedOutput: "1"
      },
      {
        input: "6\n-1 -2 -3 0 1 2\n2",
        expectedOutput: "4"
      },
      {
        input: "4\n7 7 7 7\n0",
        expectedOutput: "6"
      },
      {
        input: "5\n1 3 5 7 9\n4",
        expectedOutput: "3"
      },
      {
        input: "2\n5 5\n0",
        expectedOutput: "1"
      },
      {
        input: "7\n1 2 4 8 16 32 64\n3",
        expectedOutput: "1"
      },
      {
        input: "5\n10 20 30 40 50\n10",
        expectedOutput: "4"
      },
      {
        input: "6\n3 6 9 12 15 18\n6",
        expectedOutput: "4"
      }
    ]
  },
  {
    id: "longest-subsequence-diff-one",
    "hints": ["For each position, the best valid subsequence ending there extends the best subsequence ending at an earlier element whose value differs by exactly 1.","Use one-dimensional LIS-style DP; since adjacency depends on values, a map from value to best length avoids scanning all earlier indices."],
    returns: "int",
    title: "Longest Subsequence with Adjacent Difference One",
    difficulty: "easy",
    topic: "dp",
    companies: [
      "Amazon",
      "Microsoft"
    ],
    description: "Given an array, find the length of the longest subsequence in which every pair of adjacent elements differs by exactly 1 in absolute value.",
    examples: [
      {
        input: "6\n1 2 3 4 5 6",
        output: "6",
        explanation: "The whole array 1,2,3,4,5,6 already satisfies the condition, so the answer is 6."
      },
      {
        input: "5\n10 11 12 13 14",
        output: "5",
        explanation: "The longest such subsequence of [10,11,12,13,14] has length 5."
      },
      {
        input: "4\n1 3 5 7",
        output: "1",
        explanation: "No two elements of [1,3,5,7] differ by 1, so the answer is 1."
      }
    ],
    constraints: [
      "1 <= n <= 1000"
    ],
    io: "array",
    testCases: [
      {
        input: "6\n1 2 3 4 5 6",
        expectedOutput: "6"
      },
      {
        input: "5\n10 11 12 13 14",
        expectedOutput: "5"
      },
      {
        input: "4\n1 3 5 7",
        expectedOutput: "1"
      },
      {
        input: "7\n1 2 1 2 1 2 1",
        expectedOutput: "7"
      },
      {
        input: "5\n5 4 3 2 1",
        expectedOutput: "5"
      },
      {
        input: "1\n42",
        expectedOutput: "1"
      },
      {
        input: "6\n1 3 2 4 3 5",
        expectedOutput: "3"
      },
      {
        input: "8\n7 8 7 8 7 8 7 8",
        expectedOutput: "8"
      },
      {
        input: "5\n1 1 1 1 1",
        expectedOutput: "1"
      },
      {
        input: "6\n2 4 6 8 10 12",
        expectedOutput: "1"
      },
      {
        input: "4\n5 6 7 8",
        expectedOutput: "4"
      },
      {
        input: "7\n3 4 5 6 7 8 9",
        expectedOutput: "7"
      }
    ]
  },
  {
    id: "coin-change",
    "hints": ["For every amount up to the target, the minimum coin count is one plus the best count for a smaller amount after removing one coin.","Unbounded-knapsack tabulation with a one-dimensional array: initialize with infinity, seed amount 0, and relax each amount with every denomination."],
    returns: "int",
    title: "Coin Change",
    difficulty: "medium",
    topic: "dp",
    companies: [
      "Amazon",
      "Google",
      "Microsoft",
      "Flipkart"
    ],
    description: "Given coin denominations and an amount, find the minimum number of coins needed to make up that amount. Each coin can be used any number of times. Return -1 if the amount cannot be formed.",
    examples: [
      {
        input: "3\n1 2 5\n11",
        output: "3",
        explanation: "11 = 5 + 5 + 1 uses 3 coins, which is minimal."
      },
      {
        input: "1\n2\n3",
        output: "-1",
        explanation: "3 cannot be formed with only 2s, so the answer is -1."
      },
      {
        input: "1\n1\n5",
        output: "5",
        explanation: "5 = 1 five times uses 5 coins."
      }
    ],
    constraints: [
      "1 <= n <= 12",
      "1 <= amount <= 10^4"
    ],
    io: "array-k",
    testCases: [
      {
        input: "3\n1 2 5\n11",
        expectedOutput: "3"
      },
      {
        input: "1\n2\n3",
        expectedOutput: "-1"
      },
      {
        input: "1\n1\n5",
        expectedOutput: "5"
      },
      {
        input: "4\n1 5 10 25\n63",
        expectedOutput: "6"
      },
      {
        input: "3\n2 5 10\n1",
        expectedOutput: "-1"
      },
      {
        input: "2\n3 7\n12",
        expectedOutput: "4"
      },
      {
        input: "4\n2 3 5 7\n14",
        expectedOutput: "2"
      },
      {
        input: "1\n2\n4",
        expectedOutput: "2"
      },
      {
        input: "3\n1 3 4\n6",
        expectedOutput: "2"
      },
      {
        input: "5\n1 2 5 10 20\n37",
        expectedOutput: "4"
      },
      {
        input: "2\n5 10\n3",
        expectedOutput: "-1"
      },
      {
        input: "3\n4 5 6\n11",
        expectedOutput: "2"
      }
    ]
  },
  {
    id: "longest-common-subsequence",
    "hints": ["Compare prefixes of the two strings: matching last characters can be paired, otherwise the answer comes from dropping a character from one side.","Build a two-dimensional table over prefix pairs; the match-or-skip structure is the signature LCS tabulation pattern."],
    returns: "int",
    title: "Longest Common Subsequence",
    difficulty: "medium",
    topic: "dp",
    companies: [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    description: "Given two strings, find the length of their longest common subsequence: the longest sequence that appears as a subsequence in both strings.",
    examples: [
      {
        input: "abcde\nace",
        output: "3",
        explanation: "The LCS of abcde and ace is ace with length 3."
      },
      {
        input: "abc\nabc",
        output: "3",
        explanation: "The strings are identical, so the LCS length is 3."
      },
      {
        input: "abc\ndef",
        output: "0",
        explanation: "abc and def share no character, so the LCS length is 0."
      }
    ],
    constraints: [
      "1 <= a.length, b.length <= 1000"
    ],
    io: "two-strings",
    testCases: [
      {
        input: "abcde\nace",
        expectedOutput: "3"
      },
      {
        input: "abc\nabc",
        expectedOutput: "3"
      },
      {
        input: "abc\ndef",
        expectedOutput: "0"
      },
      {
        input: "abcdefgh\naxbxcxdx",
        expectedOutput: "4"
      },
      {
        input: "a\nb",
        expectedOutput: "0"
      },
      {
        input: "aaaa\nbb",
        expectedOutput: "0"
      },
      {
        input: "abcbdab\nbdcaba",
        expectedOutput: "4"
      },
      {
        input: "x\ny",
        expectedOutput: "0"
      },
      {
        input: "programming\ngramming",
        expectedOutput: "8"
      },
      {
        input: "stone\nlongest",
        expectedOutput: "3"
      },
      {
        input: "abcdef\nazced",
        expectedOutput: "3"
      },
      {
        input: "abcd\nefgh",
        expectedOutput: "0"
      }
    ]
  },
  {
    id: "word-break",
    "hints": ["The question for each prefix is whether some suffix of it is a dictionary word glued onto an already segmentable earlier prefix.","Use a one-dimensional boolean DP over string positions, checking every dictionary word (or every split point) as a possible tail of the current prefix."],
    returns: "bool",
    title: "Word Break",
    difficulty: "medium",
    topic: "dp",
    companies: [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    description: "Given a string s and a dictionary of words given as space-separated words on the second line, return true if s can be segmented into a sequence of one or more dictionary words.",
    examples: [
      {
        input: "leetcode\nleet code",
        output: "true",
        explanation: "leetcode segments as leet code, so the answer is true."
      },
      {
        input: "applepenapple\napple pen",
        output: "true",
        explanation: "applepenapple segments as apple pen apple, so the answer is true."
      },
      {
        input: "catsandog\ncats dog sand and cat",
        output: "false",
        explanation: "catsandog cannot be segmented with the given words, so the answer is false."
      }
    ],
    constraints: [
      "1 <= s.length <= 300"
    ],
    io: "two-strings",
    testCases: [
      {
        input: "leetcode\nleet code",
        expectedOutput: "true"
      },
      {
        input: "applepenapple\napple pen",
        expectedOutput: "true"
      },
      {
        input: "catsandog\ncats dog sand and cat",
        expectedOutput: "false"
      },
      {
        input: "a\nb",
        expectedOutput: "false"
      },
      {
        input: "aaaaaaa\naaaa aa a",
        expectedOutput: "true"
      },
      {
        input: "bb\nb",
        expectedOutput: "true"
      },
      {
        input: "abcd\nab cd",
        expectedOutput: "true"
      },
      {
        input: "helloworld\nhello world",
        expectedOutput: "true"
      },
      {
        input: "aaaaab\na aa aaa",
        expectedOutput: "false"
      },
      {
        input: "cars\ncar ca rs",
        expectedOutput: "true"
      },
      {
        input: "aaaaaaaa\naaa aaaaa",
        expectedOutput: "true"
      },
      {
        input: "abc\nab",
        expectedOutput: "false"
      }
    ]
  },
  {
    id: "combination-sum-iv",
    "hints": ["The count for a target is the sum of the counts for all targets reachable by appending one more number, because order matters here.","One-dimensional tabulation with the target loop on the outside and the numbers on the inside: this ordering counts permutations, not combinations."],
    returns: "int",
    title: "Combination Sum IV",
    difficulty: "medium",
    topic: "dp",
    companies: [
      "Google",
      "Amazon"
    ],
    description: "Given distinct positive integers and a target, count the number of possible combinations that add up to the target. Different orders of the same numbers count as different combinations.",
    examples: [
      {
        input: "3\n1 2 3\n4",
        output: "7",
        explanation: "Target 4 with [1,2,3] has 7 combinations: (1,1,1,1), (1,1,2), (1,2,1), (1,3), (2,1,1), (2,2), (3,1)."
      },
      {
        input: "2\n1 2\n3",
        output: "3",
        explanation: "Target 3 with [1,2] has 3 combinations: (1,1,1), (1,2), (2,1)."
      },
      {
        input: "1\n5\n10",
        output: "1",
        explanation: "Target 10 with [5] has 1 combination: (5, 5)."
      }
    ],
    constraints: [
      "1 <= n <= 200",
      "1 <= target <= 1000"
    ],
    io: "array-k",
    testCases: [
      {
        input: "3\n1 2 3\n4",
        expectedOutput: "7"
      },
      {
        input: "2\n1 2\n3",
        expectedOutput: "3"
      },
      {
        input: "1\n5\n10",
        expectedOutput: "1"
      },
      {
        input: "3\n2 3 5\n8",
        expectedOutput: "6"
      },
      {
        input: "2\n9 4\n0",
        expectedOutput: "1"
      },
      {
        input: "4\n1 2 4 8\n10",
        expectedOutput: "174"
      },
      {
        input: "3\n3 5 7\n12",
        expectedOutput: "3"
      },
      {
        input: "2\n2 4\n7",
        expectedOutput: "0"
      },
      {
        input: "1\n1\n5",
        expectedOutput: "1"
      },
      {
        input: "3\n1 2 3\n0",
        expectedOutput: "1"
      },
      {
        input: "2\n10 20\n30",
        expectedOutput: "3"
      },
      {
        input: "3\n4 6 8\n16",
        expectedOutput: "8"
      }
    ]
  },
  {
    id: "house-robber",
    "hints": ["At each house the decision is local: rob it (then the previous house must be skipped) or skip it (then the previous house is free to choose).","Linear one-dimensional DP carrying forward the two recent states; the pattern compresses to two variables since only neighbors interact."],
    returns: "int",
    title: "House Robber",
    difficulty: "easy",
    topic: "dp",
    companies: [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    description: "A robber wants to rob houses arranged in a line. Each house has some money, but adjacent houses cannot both be robbed. Return the maximum money that can be robbed.",
    examples: [
      {
        input: "4\n1 2 3 1",
        output: "4",
        explanation: "Robbing houses 1 and 3 gives 1 + 3 = 4."
      },
      {
        input: "5\n2 7 9 3 1",
        output: "12",
        explanation: "Robbing houses 1, 3 and 5 gives 2 + 9 + 1 = 12."
      },
      {
        input: "1\n5",
        output: "5",
        explanation: "A single house gives 5."
      }
    ],
    constraints: [
      "1 <= n <= 100"
    ],
    io: "array",
    testCases: [
      {
        input: "4\n1 2 3 1",
        expectedOutput: "4"
      },
      {
        input: "5\n2 7 9 3 1",
        expectedOutput: "12"
      },
      {
        input: "1\n5",
        expectedOutput: "5"
      },
      {
        input: "2\n2 3",
        expectedOutput: "3"
      },
      {
        input: "6\n5 1 1 5 1 5",
        expectedOutput: "15"
      },
      {
        input: "3\n1 2 3",
        expectedOutput: "4"
      },
      {
        input: "4\n2 1 1 2",
        expectedOutput: "4"
      },
      {
        input: "5\n1 3 1 3 100",
        expectedOutput: "103"
      },
      {
        input: "2\n1 2",
        expectedOutput: "2"
      },
      {
        input: "7\n6 1 2 7 1 2 7",
        expectedOutput: "20"
      },
      {
        input: "3\n3 3 3",
        expectedOutput: "6"
      },
      {
        input: "8\n1 2 3 4 5 6 7 8",
        expectedOutput: "20"
      }
    ]
  },
  {
    id: "house-robber-ii",
    "hints": ["The circle creates only one extra restriction: the first and last houses cannot both be taken, so solve two line problems - one excluding the first house, one excluding the last - and take the better.","Run the standard house-robber DP twice on the two reduced arrays and keep the maximum, handling the single-house edge case separately."],
    returns: "int",
    title: "House Robber II",
    difficulty: "easy",
    topic: "dp",
    companies: [
      "Amazon",
      "Microsoft"
    ],
    description: "Houses are arranged in a circle, so the first and last houses are also adjacent and cannot both be robbed. Return the maximum money that can be robbed.",
    examples: [
      {
        input: "3\n2 3 2",
        output: "3",
        explanation: "Robbing house 2 alone gives 3, the best possible in the circle."
      },
      {
        input: "4\n1 2 3 1",
        output: "4",
        explanation: "Robbing houses 1 and 3 gives 1 + 3 = 4."
      },
      {
        input: "1\n5",
        output: "5",
        explanation: "A single house gives 5."
      }
    ],
    constraints: [
      "1 <= n <= 100"
    ],
    io: "array",
    testCases: [
      {
        input: "3\n2 3 2",
        expectedOutput: "3"
      },
      {
        input: "4\n1 2 3 1",
        expectedOutput: "4"
      },
      {
        input: "1\n5",
        expectedOutput: "5"
      },
      {
        input: "2\n2 3",
        expectedOutput: "3"
      },
      {
        input: "5\n1 2 3 4 5",
        expectedOutput: "8"
      },
      {
        input: "4\n2 1 1 2",
        expectedOutput: "3"
      },
      {
        input: "6\n1 3 1 3 100 2",
        expectedOutput: "103"
      },
      {
        input: "3\n1 2 3",
        expectedOutput: "3"
      },
      {
        input: "5\n5 1 1 5 1",
        expectedOutput: "10"
      },
      {
        input: "2\n1 1",
        expectedOutput: "1"
      },
      {
        input: "4\n4 1 2 3",
        expectedOutput: "6"
      },
      {
        input: "6\n2 7 9 3 1 5",
        expectedOutput: "15"
      }
    ]
  },
  {
    id: "decode-ways",
    "hints": ["Process the digit string left to right: the current digit may stand alone, and together with the previous digit it may form a valid two-digit letter.","One-dimensional DP over prefixes where each state combines the one-digit and (when valid) two-digit options; treat '0' as a special invalid case for single digits."],
    returns: "int",
    title: "Decode Ways",
    difficulty: "easy",
    topic: "dp",
    companies: [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    description: "A message containing letters A-Z is encoded as numbers where 1 means A up to 26 meaning Z. Given a string of digits, return the number of ways to decode it.",
    examples: [
      {
        input: "12",
        output: "2",
        explanation: "12 can be decoded as AB (1,2) or L (12), giving 2 ways."
      },
      {
        input: "226",
        output: "3",
        explanation: "226 can be decoded as BBF, BZ or VF, giving 3 ways."
      },
      {
        input: "06",
        output: "0",
        explanation: "06 has no valid decoding because 0 maps to nothing, giving 0."
      }
    ],
    constraints: [
      "1 <= s.length <= 100",
      "s consists of digits"
    ],
    io: "string",
    testCases: [
      {
        input: "12",
        expectedOutput: "2"
      },
      {
        input: "226",
        expectedOutput: "3"
      },
      {
        input: "06",
        expectedOutput: "0"
      },
      {
        input: "10",
        expectedOutput: "1"
      },
      {
        input: "27",
        expectedOutput: "1"
      },
      {
        input: "11106",
        expectedOutput: "2"
      },
      {
        input: "0",
        expectedOutput: "0"
      },
      {
        input: "1",
        expectedOutput: "1"
      },
      {
        input: "2101",
        expectedOutput: "1"
      },
      {
        input: "12345",
        expectedOutput: "3"
      },
      {
        input: "100",
        expectedOutput: "0"
      },
      {
        input: "12120",
        expectedOutput: "3"
      }
    ]
  },
  {
    id: "unique-paths",
    "hints": ["Every cell is reached only from above or from the left, so its path count is the sum of those two neighbors' counts.","Two-dimensional tabulation with the first row and column seeded to 1; the table can be compressed to a single rolling row."],
    returns: "int",
    title: "Unique Paths",
    difficulty: "easy",
    topic: "dp",
    companies: [
      "Google",
      "Amazon"
    ],
    description: "A robot starts at the top-left of an m x n grid and wants to reach the bottom-right. It can only move right or down. The input gives m and n. Return the number of unique paths.",
    images: ["https://assets.leetcode.com/uploads/2018/10/22/robot_maze.png"],
    examples: [
      {
        input: "2\n3 7",
        output: "28",
        explanation: "A 3x7 grid has 28 unique paths."
      },
      {
        input: "2\n3 2",
        output: "3",
        explanation: "A 3x2 grid has 3 unique paths."
      },
      {
        input: "2\n1 1",
        output: "1",
        explanation: "A 1x1 grid has exactly 1 path."
      }
    ],
    constraints: [
      "1 <= m, n <= 100"
    ],
    io: "array",
    testCases: [
      {
        input: "2\n3 7",
        expectedOutput: "28"
      },
      {
        input: "2\n3 2",
        expectedOutput: "3"
      },
      {
        input: "2\n1 1",
        expectedOutput: "1"
      },
      {
        input: "2\n1 5",
        expectedOutput: "1"
      },
      {
        input: "2\n5 1",
        expectedOutput: "1"
      },
      {
        input: "2\n2 2",
        expectedOutput: "2"
      },
      {
        input: "2\n4 4",
        expectedOutput: "20"
      },
      {
        input: "2\n3 3",
        expectedOutput: "6"
      },
      {
        input: "2\n7 3",
        expectedOutput: "28"
      },
      {
        input: "2\n10 10",
        expectedOutput: "48620"
      },
      {
        input: "2\n2 10",
        expectedOutput: "10"
      },
      {
        input: "2\n5 5",
        expectedOutput: "70"
      }
    ]
  },
  {
    id: "jump-game",
    "hints": ["Keep track of the farthest index you can reach so far; if the scan ever reaches a position beyond that, the end is unreachable.","This is a greedy reachability pass with one running maximum - a one-dimensional reachability DP can express the same idea but the greedy scan is cleaner."],
    returns: "bool",
    title: "Jump Game",
    difficulty: "easy",
    topic: "dp",
    companies: [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    description: "Given an array where each element is the maximum jump length from that position, return true if you can reach the last index starting from the first, and false otherwise.",
    examples: [
      {
        input: "5\n2 3 1 1 4",
        output: "true",
        explanation: "Jump 1 step to index 1, then 3 steps to the end: reachable, so true."
      },
      {
        input: "5\n3 2 1 0 4",
        output: "false",
        explanation: "From index 0 you can reach index 3 at most, which holds 0, so the end is unreachable: false."
      },
      {
        input: "1\n0",
        output: "true",
        explanation: "A single element is already at the end: true."
      }
    ],
    constraints: [
      "1 <= n <= 10^4"
    ],
    io: "array",
    testCases: [
      {
        input: "5\n2 3 1 1 4",
        expectedOutput: "true"
      },
      {
        input: "5\n3 2 1 0 4",
        expectedOutput: "false"
      },
      {
        input: "1\n0",
        expectedOutput: "true"
      },
      {
        input: "2\n1 0",
        expectedOutput: "true"
      },
      {
        input: "2\n0 1",
        expectedOutput: "false"
      },
      {
        input: "6\n1 1 1 1 1 1",
        expectedOutput: "true"
      },
      {
        input: "4\n3 0 0 0",
        expectedOutput: "true"
      },
      {
        input: "5\n2 0 0 1 0",
        expectedOutput: "false"
      },
      {
        input: "3\n1 2 3",
        expectedOutput: "true"
      },
      {
        input: "4\n0 2 3 1",
        expectedOutput: "false"
      },
      {
        input: "5\n4 3 2 1 0",
        expectedOutput: "true"
      },
      {
        input: "6\n1 2 0 1 0 2",
        expectedOutput: "false"
      }
    ]
  },
  {
    id: "knapsack-01",
    "hints": ["Each item is a yes-or-no decision: the optimum for the first i items at capacity w comes from either taking item i (using the optimum for i-1 items at reduced capacity) or skipping it.","Use the 0/1 knapsack tabulation; a one-dimensional array works if capacity is iterated in reverse so each item is used at most once."],
    returns: "int",
    title: "0-1 Knapsack Problem",
    difficulty: "medium",
    topic: "dp",
    companies: [
      "Amazon",
      "Microsoft",
      "Flipkart"
    ],
    description: "Given weights and values of n items and a knapsack capacity W, find the maximum value obtainable. Each item can be taken at most once. Input has 2 rows: the first row holds the weights, the second row holds the values, followed by the capacity W.",
    examples: [
      {
        input: "2 3\n1 2 3\n10 15 40\n6",
        output: "65",
        explanation: "With capacity 6, taking the items of weight 1, 2 and 3 gives 10 + 15 + 40 = 65."
      },
      {
        input: "2 4\n2 3 4 5\n3 4 5 6\n5",
        output: "7",
        explanation: "With capacity 5, taking the weight-2 and weight-3 items gives 3 + 4 = 7."
      },
      {
        input: "2 1\n5\n10\n3",
        output: "0",
        explanation: "The only item weighs 5 which exceeds capacity 3, so the answer is 0."
      }
    ],
    constraints: [
      "1 <= n <= 100",
      "1 <= W <= 1000"
    ],
    io: "matrix-k",
    testCases: [
      {
        input: "2 3\n1 2 3\n10 15 40\n6",
        expectedOutput: "65"
      },
      {
        input: "2 4\n2 3 4 5\n3 4 5 6\n5",
        expectedOutput: "7"
      },
      {
        input: "2 1\n5\n10\n3",
        expectedOutput: "0"
      },
      {
        input: "2 3\n5 4 6\n10 40 30\n10",
        expectedOutput: "70"
      },
      {
        input: "2 2\n1 1\n2 3\n4",
        expectedOutput: "5"
      },
      {
        input: "2 4\n1 2 3 4\n2 4 4 5\n5",
        expectedOutput: "8"
      },
      {
        input: "2 3\n3 4 5\n30 50 60\n8",
        expectedOutput: "90"
      },
      {
        input: "2 2\n10 20\n60 100\n50",
        expectedOutput: "160"
      },
      {
        input: "2 5\n1 2 3 4 5\n5 4 3 2 1\n7",
        expectedOutput: "12"
      },
      {
        input: "2 3\n2 3 4\n3 4 5\n6",
        expectedOutput: "8"
      },
      {
        input: "2 4\n4 5 1 3\n1 2 3 4\n4",
        expectedOutput: "7"
      },
      {
        input: "2 2\n5 6\n10 12\n11",
        expectedOutput: "22"
      }
    ]
  },
  {
    id: "catalan-number",
    "hints": ["Catalan structures split at their root (or first paired element) into two independent smaller structures whose sizes add up to n-1, so the nth value combines products of smaller ones.","One-dimensional tabulation from 0 up to n, where each entry aggregates the products of the pairs of smaller Catalan numbers that fit the split."],
    returns: "int",
    title: "Catalan Number",
    difficulty: "easy",
    topic: "dp",
    companies: [
      "Amazon",
      "Microsoft"
    ],
    description: "Find the nth Catalan number. Catalan numbers count many combinatorial structures such as valid parenthesis sequences and binary search trees with n keys.",
    examples: [
      {
        input: "0",
        output: "1",
        explanation: "The 0th Catalan number is 1."
      },
      {
        input: "1",
        output: "1",
        explanation: "The 1st Catalan number is 1."
      },
      {
        input: "2",
        output: "2",
        explanation: "The 2nd Catalan number is 2."
      }
    ],
    constraints: [
      "0 <= n <= 19"
    ],
    io: "int",
    testCases: [
      {
        input: "0",
        expectedOutput: "1"
      },
      {
        input: "1",
        expectedOutput: "1"
      },
      {
        input: "2",
        expectedOutput: "2"
      },
      {
        input: "3",
        expectedOutput: "5"
      },
      {
        input: "4",
        expectedOutput: "14"
      },
      {
        input: "5",
        expectedOutput: "42"
      },
      {
        input: "6",
        expectedOutput: "132"
      },
      {
        input: "7",
        expectedOutput: "429"
      },
      {
        input: "8",
        expectedOutput: "1430"
      },
      {
        input: "9",
        expectedOutput: "4862"
      },
      {
        input: "10",
        expectedOutput: "16796"
      },
      {
        input: "15",
        expectedOutput: "9694845"
      }
    ]
  },
  {
    id: "edit-distance",
    "hints": ["Convert prefixes of the first string into prefixes of the second: matching ends need no operation, and the three operations each correspond to moving through the table in a different direction.","Classic two-dimensional string DP with insert, delete, and replace transitions; only the previous row is needed if space matters."],
    returns: "int",
    title: "Edit Distance",
    difficulty: "medium",
    topic: "dp",
    companies: [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    description: "Given two strings, find the minimum number of operations (insert, delete, replace a character) required to convert the first string into the second.",
    examples: [
      {
        input: "horse\nros",
        output: "3",
        explanation: "horse to ros takes 3 operations."
      },
      {
        input: "intention\nexecution",
        output: "5",
        explanation: "intention to execution takes 5 operations."
      },
      {
        input: "a\nb",
        output: "1",
        explanation: "Replacing a with b takes 1 operation."
      }
    ],
    constraints: [
      "0 <= a.length, b.length <= 500"
    ],
    io: "two-strings",
    testCases: [
      {
        input: "horse\nros",
        expectedOutput: "3"
      },
      {
        input: "intention\nexecution",
        expectedOutput: "5"
      },
      {
        input: "a\nb",
        expectedOutput: "1"
      },
      {
        input: "abc\nabc",
        expectedOutput: "0"
      },
      {
        input: "kitten\nsitting",
        expectedOutput: "3"
      },
      {
        input: "\nabc",
        expectedOutput: "3"
      },
      {
        input: "abc\n",
        expectedOutput: "3"
      },
      {
        input: "sunday\nsaturday",
        expectedOutput: "3"
      },
      {
        input: "flaw\nlawn",
        expectedOutput: "2"
      },
      {
        input: "gfg\ngfg",
        expectedOutput: "0"
      },
      {
        input: "abcd\nbcde",
        expectedOutput: "2"
      },
      {
        input: "algorithm\nalligator",
        expectedOutput: "6"
      }
    ]
  },
  {
    id: "subset-sum",
    "hints": ["Ask for each reachable sum whether it can be formed using the items considered so far, extending reachable sums by adding the current item.","Boolean knapsack tabulation: a one-dimensional reachable array updated in reverse capacity order so each element is used at most once."],
    returns: "bool",
    title: "Subset Sum Problem",
    difficulty: "medium",
    topic: "dp",
    companies: [
      "Amazon",
      "Microsoft"
    ],
    description: "Given an array and a target sum, return true if there exists a subset of the array whose elements add up to the target, and false otherwise.",
    examples: [
      {
        input: "6\n3 34 4 12 5 2\n9",
        output: "true",
        explanation: "The subset {4, 5} sums to 9, so true."
      },
      {
        input: "3\n1 2 3\n7",
        output: "false",
        explanation: "No subset of [1,2,3] sums to 7, so false."
      },
      {
        input: "4\n1 5 11 5\n11",
        output: "true",
        explanation: "The subset {11} alone sums to 11, so true."
      }
    ],
    constraints: [
      "1 <= n <= 100",
      "0 <= target <= 10^4"
    ],
    io: "array-k",
    testCases: [
      {
        input: "6\n3 34 4 12 5 2\n9",
        expectedOutput: "true"
      },
      {
        input: "3\n1 2 3\n7",
        expectedOutput: "false"
      },
      {
        input: "4\n1 5 11 5\n11",
        expectedOutput: "true"
      },
      {
        input: "2\n1 2\n4",
        expectedOutput: "false"
      },
      {
        input: "5\n2 4 6 8 10\n14",
        expectedOutput: "true"
      },
      {
        input: "1\n7\n7",
        expectedOutput: "true"
      },
      {
        input: "1\n7\n5",
        expectedOutput: "false"
      },
      {
        input: "4\n3 3 3 3\n6",
        expectedOutput: "true"
      },
      {
        input: "6\n1 2 3 4 5 6\n21",
        expectedOutput: "true"
      },
      {
        input: "3\n5 5 5\n10",
        expectedOutput: "true"
      },
      {
        input: "4\n10 20 30 40\n60",
        expectedOutput: "true"
      },
      {
        input: "5\n1 1 1 1 1\n3",
        expectedOutput: "true"
      }
    ]
  },
  {
    id: "gold-mine",
    "hints": ["The value of a cell depends on cells to its right, so process columns from right to left: each cell's best total is its gold plus the best of the three reachable cells in the next column.","Grid DP in reverse column order with a rolling array; boundary rows skip the missing diagonal moves."],
    returns: "int",
    title: "Gold Mine Problem",
    difficulty: "medium",
    topic: "dp",
    companies: [
      "Amazon",
      "Samsung",
      "Flipkart"
    ],
    description: "A gold mine is an m x n grid where each cell has some gold. A miner starts at any cell in the first column and moves only right, right-up or right-down, collecting gold. Return the maximum gold collectible.",
    examples: [
      {
        input: "3 3\n1 3 3\n2 1 4\n0 6 7",
        output: "15",
        explanation: "The path 2-6-7 starting at row 1 collects 15 units of gold."
      },
      {
        input: "2 2\n5 1\n4 2",
        output: "7",
        explanation: "A 2x2 mine yields 7 at best."
      },
      {
        input: "1 1\n7",
        output: "7",
        explanation: "A single cell mine yields its own gold: 7."
      }
    ],
    constraints: [
      "1 <= m, n <= 100"
    ],
    io: "matrix",
    testCases: [
      {
        input: "3 3\n1 3 3\n2 1 4\n0 6 7",
        expectedOutput: "15"
      },
      {
        input: "2 2\n5 1\n4 2",
        expectedOutput: "7"
      },
      {
        input: "1 1\n7",
        expectedOutput: "7"
      },
      {
        input: "1 4\n1 2 3 4",
        expectedOutput: "10"
      },
      {
        input: "4 1\n5\n4\n3\n2",
        expectedOutput: "5"
      },
      {
        input: "3 4\n1 2 3 4\n5 6 7 8\n9 10 11 12",
        expectedOutput: "42"
      },
      {
        input: "2 3\n10 20 30\n5 15 25",
        expectedOutput: "60"
      },
      {
        input: "3 3\n0 0 0\n0 0 0\n0 0 0",
        expectedOutput: "0"
      },
      {
        input: "4 4\n1 2 3 4\n4 3 2 1\n5 6 7 8\n8 7 6 5",
        expectedOutput: "30"
      },
      {
        input: "2 5\n1 1 1 1 1\n2 2 2 2 2",
        expectedOutput: "10"
      },
      {
        input: "3 2\n4 5\n6 7\n8 9",
        expectedOutput: "17"
      },
      {
        input: "5 3\n3 2 1\n4 5 6\n7 8 9\n1 1 1\n2 2 2",
        expectedOutput: "24"
      }
    ]
  },
  {
    id: "assembly-line-scheduling",
    "hints": ["For each station, keep the fastest time to reach it on each of the two lines, accounting for the transfer cost when switching lines between consecutive stations.","Two-row tabulation over stations using the entry times to seed the first column and adding the exit times at the end."],
    returns: "int",
    title: "Assembly Line Scheduling",
    difficulty: "hard",
    topic: "dp",
    companies: [
      "Amazon",
      "Microsoft"
    ],
    description: "Two assembly lines each have n stations. Input is an (n+1) x 4 matrix: rows 0..n-1 hold [line1 time, line2 time, transfer from line1, transfer from line2] for each station, and the last row holds [entry1, entry2, exit1, exit2]. Find the minimum time for a car to go through the factory.",
    examples: [
      {
        input: "5 4\n4 2 7 9\n5 10 4 2\n3 1 5 8\n2 4 0 0\n10 12 18 7",
        output: "35",
        explanation: "The classic two-line example gives 35."
      },
      {
        input: "2 4\n5 6 0 0\n2 3 4 5",
        output: "11",
        explanation: "A single station needs entry plus processing plus exit: 11."
      },
      {
        input: "3 4\n3 3 1 1\n3 3 0 0\n5 5 5 5",
        output: "16",
        explanation: "Two stations on identical lines give 16."
      }
    ],
    constraints: [
      "1 <= n <= 100"
    ],
    io: "matrix",
    testCases: [
      {
        input: "5 4\n4 2 7 9\n5 10 4 2\n3 1 5 8\n2 4 0 0\n10 12 18 7",
        expectedOutput: "35"
      },
      {
        input: "2 4\n5 6 0 0\n2 3 4 5",
        expectedOutput: "11"
      },
      {
        input: "3 4\n3 3 1 1\n3 3 0 0\n5 5 5 5",
        expectedOutput: "16"
      },
      {
        input: "2 4\n1 1 1 1\n1 1 1 1",
        expectedOutput: "3"
      },
      {
        input: "4 4\n2 2 0 0\n2 2 0 0\n2 2 0 0\n1 1 1 1",
        expectedOutput: "8"
      },
      {
        input: "3 4\n10 1 0 0\n1 10 0 0\n5 5 0 0",
        expectedOutput: "7"
      },
      {
        input: "3 4\n4 4 2 1\n4 4 1 2\n10 10 10 10",
        expectedOutput: "28"
      },
      {
        input: "2 4\n7 8 1 2\n3 4 5 6",
        expectedOutput: "15"
      },
      {
        input: "4 4\n6 1 0 4\n1 6 0 4\n3 2 0 0\n4 4 0 0",
        expectedOutput: "12"
      },
      {
        input: "5 4\n1 3 5 9\n2 4 6 10\n1 3 7 0\n2 4 8 0\n0 0 1 1",
        expectedOutput: "7"
      },
      {
        input: "3 4\n5 9 3 0\n5 9 0 0\n2 2 2 2",
        expectedOutput: "14"
      },
      {
        input: "6 4\n2 4 1 2\n3 5 1 2\n1 2 0 1\n1 2 0 1\n3 2 1 1\n1 1 1 1",
        expectedOutput: "11"
      }
    ]
  },
  {
    id: "maximize-cut-segments",
    "hints": ["The maximum segments for length n builds on the maxima for n-x, n-y, and n-z; lengths that cannot be cut exactly must be marked as impossible rather than treated as zero.","One-dimensional tabulation with a negative-infinity sentinel for unreachable lengths, returning -1 when the target stays unreachable."],
    returns: "int",
    title: "Maximize the Cut Segments",
    difficulty: "medium",
    topic: "dp",
    companies: [
      "Amazon",
      "Microsoft"
    ],
    description: "The input array is [n, x, y, z]: given a rod of length n and three cut lengths x, y, z, cut the rod into the maximum number of segments of lengths x, y or z. Return -1 if the rod cannot be cut exactly.",
    examples: [
      {
        input: "4\n4 2 1 1",
        output: "4",
        explanation: "A rod of 4 with cuts 2, 1, 1 gives 4 segments of length 1."
      },
      {
        input: "4\n5 5 3 2",
        output: "2",
        explanation: "A rod of 5 with cuts 5, 3, 2 gives 2 segments: 3 + 2."
      },
      {
        input: "4\n3 5 6 7",
        output: "-1",
        explanation: "A rod of 3 cannot be cut with 5, 6, 7, so the answer is -1."
      }
    ],
    constraints: [
      "1 <= n <= 10^4",
      "1 <= x, y, z <= n"
    ],
    io: "array",
    testCases: [
      {
        input: "4\n4 2 1 1",
        expectedOutput: "4"
      },
      {
        input: "4\n5 5 3 2",
        expectedOutput: "2"
      },
      {
        input: "4\n3 5 6 7",
        expectedOutput: "-1"
      },
      {
        input: "4\n7 5 2 2",
        expectedOutput: "2"
      },
      {
        input: "4\n11 11 9 12",
        expectedOutput: "1"
      },
      {
        input: "4\n23 11 9 12",
        expectedOutput: "2"
      },
      {
        input: "4\n5 1 2 3",
        expectedOutput: "5"
      },
      {
        input: "4\n9 2 2 2",
        expectedOutput: "-1"
      },
      {
        input: "4\n10 2 3 5",
        expectedOutput: "5"
      },
      {
        input: "4\n15 5 5 5",
        expectedOutput: "3"
      },
      {
        input: "4\n12 3 4 5",
        expectedOutput: "4"
      },
      {
        input: "4\n17 2 3 5",
        expectedOutput: "8"
      }
    ]
  },
  {
    id: "maximum-sum-increasing-subsequence",
    "hints": ["For each position, compute the best increasing-subsequence sum that ends exactly there by extending any earlier smaller element's best sum.","One-dimensional LIS-variant DP where the state accumulates sums instead of lengths; the answer is the maximum over all end positions."],
    returns: "int",
    title: "Maximum Sum Increasing Subsequence",
    difficulty: "easy",
    topic: "dp",
    companies: [
      "Amazon",
      "Microsoft"
    ],
    description: "Given an array, find the maximum sum of any strictly increasing subsequence.",
    examples: [
      {
        input: "6\n1 101 2 3 100 4",
        output: "106",
        explanation: "The subsequence 1, 2, 3, 100 sums to 106, the maximum possible."
      },
      {
        input: "5\n5 4 3 2 1",
        output: "5",
        explanation: "A decreasing array can only pick single elements, so the answer is 5."
      },
      {
        input: "4\n1 2 3 4",
        output: "10",
        explanation: "An increasing array takes everything: 10."
      }
    ],
    constraints: [
      "1 <= n <= 1000"
    ],
    io: "array",
    testCases: [
      {
        input: "6\n1 101 2 3 100 4",
        expectedOutput: "106"
      },
      {
        input: "5\n5 4 3 2 1",
        expectedOutput: "5"
      },
      {
        input: "4\n1 2 3 4",
        expectedOutput: "10"
      },
      {
        input: "1\n7",
        expectedOutput: "7"
      },
      {
        input: "7\n3 4 5 10 1 2 20",
        expectedOutput: "42"
      },
      {
        input: "5\n10 5 4 3 2",
        expectedOutput: "10"
      },
      {
        input: "6\n2 2 2 2 2 2",
        expectedOutput: "2"
      },
      {
        input: "8\n1 3 5 2 4 6 8 10",
        expectedOutput: "33"
      },
      {
        input: "4\n-1 -2 5 3",
        expectedOutput: "5"
      },
      {
        input: "5\n1 2 10 4 5",
        expectedOutput: "13"
      },
      {
        input: "6\n10 20 30 5 40 50",
        expectedOutput: "150"
      },
      {
        input: "3\n5 1 4",
        expectedOutput: "5"
      }
    ]
  },
  {
    id: "count-subsequences-product-less-than-k",
    "hints": ["Build the count over prefixes of the array, tracking for each prefix how many subsequences produce each product below k.","Two-dimensional DP over (prefix length, product value) with include/skip logic; inclusion is valid only when the product stays divisible and under k."],
    returns: "int",
    title: "Count Subsequences with Product Less Than K",
    difficulty: "hard",
    topic: "dp",
    companies: [
      "Amazon",
      "Google"
    ],
    description: "Given an array of positive integers and an integer k, count the number of non-empty subsequences whose product is strictly less than k.",
    examples: [
      {
        input: "4\n1 2 3 4\n10",
        output: "11",
        explanation: "Out of 15 non-empty subsequences of [1,2,3,4], 11 have product less than 10."
      },
      {
        input: "3\n2 3 5\n10",
        output: "4",
        explanation: "Subsequences with product less than 10 in [2,3,5] are [2], [3], [5], [2,3]: 4 total."
      },
      {
        input: "1\n5\n10",
        output: "1",
        explanation: "A single element 5 is less than 10: 1."
      }
    ],
    constraints: [
      "1 <= n <= 100",
      "1 <= k <= 100"
    ],
    io: "array-k",
    testCases: [
      {
        input: "4\n1 2 3 4\n10",
        expectedOutput: "11"
      },
      {
        input: "3\n2 3 5\n10",
        expectedOutput: "4"
      },
      {
        input: "1\n5\n10",
        expectedOutput: "1"
      },
      {
        input: "2\n10 20\n5",
        expectedOutput: "0"
      },
      {
        input: "5\n1 1 1 1 1\n3",
        expectedOutput: "31"
      },
      {
        input: "3\n4 4 4\n10",
        expectedOutput: "3"
      },
      {
        input: "4\n2 2 2 2\n9",
        expectedOutput: "14"
      },
      {
        input: "2\n3 7\n22",
        expectedOutput: "3"
      },
      {
        input: "6\n1 2 3 4 5 6\n7",
        expectedOutput: "13"
      },
      {
        input: "3\n1 2 3\n2",
        expectedOutput: "1"
      },
      {
        input: "4\n5 5 5 5\n6",
        expectedOutput: "4"
      },
      {
        input: "5\n2 3 4 5 6\n30",
        expectedOutput: "15"
      }
    ]
  },
  {
    id: "egg-dropping-puzzle",
    "hints": ["If you drop an egg from some floor, it either breaks (one fewer egg, search below) or survives (same eggs, search above); the worst case over the two outcomes must be minimized by choosing the drop floor well.","Two-dimensional memoization over (eggs, floors) evaluating the worst-case split for every candidate drop floor; the recursion depth stays small since floors shrink fast."],
    returns: "int",
    title: "Egg Dropping Puzzle",
    difficulty: "hard",
    topic: "dp",
    companies: [
      "Google",
      "Amazon",
      "Microsoft",
      "Flipkart"
    ],
    description: "Given e eggs and f floors, find the minimum number of trials needed in the worst case to find the critical floor: the highest floor from which an egg does not break. Input gives eggs and floors.",
    examples: [
      {
        input: "2\n1 5",
        output: "5",
        explanation: "With 1 egg and 5 floors you must try each floor: 5 trials."
      },
      {
        input: "2\n2 10",
        output: "4",
        explanation: "With 2 eggs and 10 floors, 4 trials suffice in the worst case."
      },
      {
        input: "2\n2 100",
        output: "14",
        explanation: "With 2 eggs and 100 floors, 14 trials are needed."
      }
    ],
    constraints: [
      "1 <= e <= 10",
      "1 <= f <= 100"
    ],
    io: "array",
    testCases: [
      {
        input: "2\n1 5",
        expectedOutput: "5"
      },
      {
        input: "2\n2 10",
        expectedOutput: "4"
      },
      {
        input: "2\n2 100",
        expectedOutput: "14"
      },
      {
        input: "2\n3 14",
        expectedOutput: "4"
      },
      {
        input: "2\n2 1",
        expectedOutput: "1"
      },
      {
        input: "2\n3 1",
        expectedOutput: "1"
      },
      {
        input: "2\n1 1",
        expectedOutput: "1"
      },
      {
        input: "2\n2 36",
        expectedOutput: "8"
      },
      {
        input: "2\n3 100",
        expectedOutput: "9"
      },
      {
        input: "2\n4 100",
        expectedOutput: "8"
      },
      {
        input: "2\n2 50",
        expectedOutput: "10"
      },
      {
        input: "2\n5 1000",
        expectedOutput: "11"
      }
    ]
  },
  {
    id: "maximum-length-chain",
    "hints": ["After ordering the pairs appropriately, each pair can extend any earlier compatible pair, turning the problem into a longest-chain-over-prefixes question.","Sort-based DP in the LIS family: compute the best chain ending at each pair from earlier compatible pairs, with sorting making compatibility easy to check."],
    returns: "int",
    title: "Maximum Length Chain of Pairs",
    difficulty: "easy",
    topic: "dp",
    companies: [
      "Amazon",
      "Microsoft"
    ],
    description: "Given n pairs as two rows (first elements, then second elements), find the maximum length chain: a sequence of pairs (a1,b1), (a2,b2) ... with b1 < a2, b2 < a3 and so on.",
    examples: [
      {
        input: "2 5\n5 39 15 27 50\n24 60 28 40 90",
        output: "3",
        explanation: "The pairs (5,24), (39,60), (15,28), (27,40), (50,90) form a chain of length 3."
      },
      {
        input: "2 3\n1 2 3\n2 3 4",
        output: "2",
        explanation: "With pairs (1,2), (2,3), (3,4) the longest chain has length 2."
      },
      {
        input: "2 1\n5\n10",
        output: "1",
        explanation: "A single pair forms a chain of length 1."
      }
    ],
    constraints: [
      "1 <= n <= 10^5"
    ],
    io: "matrix",
    testCases: [
      {
        input: "2 5\n5 39 15 27 50\n24 60 28 40 90",
        expectedOutput: "3"
      },
      {
        input: "2 3\n1 2 3\n2 3 4",
        expectedOutput: "2"
      },
      {
        input: "2 1\n5\n10",
        expectedOutput: "1"
      },
      {
        input: "2 4\n1 2 3 4\n10 20 30 40",
        expectedOutput: "1"
      },
      {
        input: "2 4\n10 20 30 40\n1 2 3 4",
        expectedOutput: "4"
      },
      {
        input: "2 6\n1 2 3 4 5 6\n2 3 4 5 6 7",
        expectedOutput: "3"
      },
      {
        input: "2 3\n5 6 7\n1 2 3",
        expectedOutput: "3"
      },
      {
        input: "2 5\n1 3 5 7 9\n2 4 6 8 10",
        expectedOutput: "5"
      },
      {
        input: "2 4\n4 3 2 1\n8 7 6 5",
        expectedOutput: "1"
      },
      {
        input: "2 2\n1 5\n2 3",
        expectedOutput: "2"
      },
      {
        input: "2 7\n3 1 4 1 5 9 2\n6 5 8 7 10 12 11",
        expectedOutput: "2"
      },
      {
        input: "2 3\n1 1 1\n1 1 1",
        expectedOutput: "1"
      }
    ]
  },
  {
    id: "maximal-square",
    "hints": ["For each cell that is 1, the largest square ending there is limited by the smallest square ending at its top, left, and top-left neighbors.","Two-dimensional grid DP where each 1-cell takes one plus the minimum of its three neighbors; track the maximum side and square it for the area."],
    returns: "int",
    title: "Maximal Square",
    difficulty: "medium",
    topic: "dp",
    companies: [
      "Google",
      "Amazon"
    ],
    description: "Given a binary matrix, find the area of the largest square containing only 1s.",
    examples: [
      {
        input: "4 5\n1 0 1 0 0\n1 0 1 1 1\n1 1 1 1 1\n1 0 0 1 0",
        output: "4",
        explanation: "The largest all-1 square has side 2, so area 4."
      },
      {
        input: "2 2\n0 0\n0 0",
        output: "0",
        explanation: "An all-zero matrix has area 0."
      },
      {
        input: "1 1\n1",
        output: "1",
        explanation: "A single 1 gives area 1."
      }
    ],
    constraints: [
      "1 <= m, n <= 300"
    ],
    io: "matrix",
    testCases: [
      {
        input: "4 5\n1 0 1 0 0\n1 0 1 1 1\n1 1 1 1 1\n1 0 0 1 0",
        expectedOutput: "4"
      },
      {
        input: "2 2\n0 0\n0 0",
        expectedOutput: "0"
      },
      {
        input: "1 1\n1",
        expectedOutput: "1"
      },
      {
        input: "3 3\n1 1 1\n1 1 1\n1 1 1",
        expectedOutput: "9"
      },
      {
        input: "2 3\n1 1 0\n1 1 0",
        expectedOutput: "4"
      },
      {
        input: "4 4\n0 1 1 0\n1 1 1 1\n1 1 1 1\n0 1 1 0",
        expectedOutput: "4"
      },
      {
        input: "1 5\n1 1 1 1 1",
        expectedOutput: "1"
      },
      {
        input: "5 1\n1\n1\n1\n1\n1",
        expectedOutput: "1"
      },
      {
        input: "3 4\n1 0 1 1\n1 1 1 1\n0 1 1 1",
        expectedOutput: "4"
      },
      {
        input: "2 2\n1 1\n1 0",
        expectedOutput: "1"
      },
      {
        input: "6 6\n1 1 1 1 0 0\n1 1 1 1 0 0\n1 1 1 1 1 1\n0 0 1 1 1 1\n0 0 1 1 1 1\n0 0 1 1 1 1",
        expectedOutput: "16"
      },
      {
        input: "3 3\n0 0 0\n0 1 0\n0 0 0",
        expectedOutput: "1"
      }
    ]
  },
  {
    id: "maximum-path-sum-matrix",
    "hints": ["Every cell's best path from the top-left comes from either its top or left neighbor, plus its own value.","Forward two-dimensional tabulation from the top-left corner accumulating the best incoming sum at each cell."],
    returns: "int",
    title: "Maximum Path Sum in Matrix",
    difficulty: "medium",
    topic: "dp",
    companies: [
      "Amazon",
      "Microsoft"
    ],
    description: "Given a matrix, find the maximum sum of a path from the top-left cell to the bottom-right cell, moving only right or down.",
    examples: [
      {
        input: "3 3\n1 3 1\n1 5 1\n4 2 1",
        output: "12",
        explanation: "The best path 1-3-5-2-1 sums to 12."
      },
      {
        input: "2 2\n1 2\n3 4",
        output: "8",
        explanation: "The best path 1-3-4 sums to 8."
      },
      {
        input: "1 1\n5",
        output: "5",
        explanation: "A single cell path gives 5."
      }
    ],
    constraints: [
      "1 <= m, n <= 200"
    ],
    io: "matrix",
    testCases: [
      {
        input: "3 3\n1 3 1\n1 5 1\n4 2 1",
        expectedOutput: "12"
      },
      {
        input: "2 2\n1 2\n3 4",
        expectedOutput: "8"
      },
      {
        input: "1 1\n5",
        expectedOutput: "5"
      },
      {
        input: "1 4\n1 2 3 4",
        expectedOutput: "10"
      },
      {
        input: "4 1\n1\n2\n3\n4",
        expectedOutput: "10"
      },
      {
        input: "3 3\n5 5 5\n5 5 5\n5 5 5",
        expectedOutput: "25"
      },
      {
        input: "2 3\n1 100 1\n1 1 100",
        expectedOutput: "202"
      },
      {
        input: "4 4\n1 2 3 4\n5 6 7 8\n9 10 11 12\n13 14 15 16",
        expectedOutput: "73"
      },
      {
        input: "2 2\n-1 -2\n-3 -4",
        expectedOutput: "-7"
      },
      {
        input: "3 4\n2 1 3 4\n5 6 1 2\n1 2 7 1",
        expectedOutput: "23"
      },
      {
        input: "5 2\n1 2\n3 4\n5 6\n7 8\n9 10",
        expectedOutput: "35"
      },
      {
        input: "2 5\n5 4 3 2 1\n1 2 3 4 5",
        expectedOutput: "24"
      }
    ]
  },
  {
    id: "minimum-number-of-jumps",
    "hints": ["The minimum jumps to each index is one more than the minimum over all earlier positions that can reach it.","One-dimensional DP with an O(n^2) scan, or a linear greedy that expands the current reachable window one jump layer at a time."],
    returns: "int",
    title: "Minimum Number of Jumps",
    difficulty: "easy",
    topic: "dp",
    companies: [
      "Amazon",
      "Microsoft",
      "Flipkart"
    ],
    description: "Given an array where each element is the maximum jump length from that position, find the minimum number of jumps needed to reach the last index. Return -1 if the end cannot be reached.",
    examples: [
      {
        input: "5\n2 3 1 1 4",
        output: "2",
        explanation: "Jump from index 0 to 1, then to the end: 2 jumps."
      },
      {
        input: "5\n3 2 1 0 4",
        output: "-1",
        explanation: "The zeros block every path, so the answer is -1."
      },
      {
        input: "1\n0",
        output: "0",
        explanation: "A single element needs 0 jumps."
      }
    ],
    constraints: [
      "1 <= n <= 10^4"
    ],
    io: "array",
    testCases: [
      {
        input: "5\n2 3 1 1 4",
        expectedOutput: "2"
      },
      {
        input: "5\n3 2 1 0 4",
        expectedOutput: "-1"
      },
      {
        input: "1\n0",
        expectedOutput: "0"
      },
      {
        input: "2\n1 1",
        expectedOutput: "1"
      },
      {
        input: "5\n1 1 1 1 1",
        expectedOutput: "4"
      },
      {
        input: "4\n6 2 4 0",
        expectedOutput: "1"
      },
      {
        input: "3\n1 0 1",
        expectedOutput: "-1"
      },
      {
        input: "7\n1 3 5 8 9 2 6",
        expectedOutput: "3"
      },
      {
        input: "2\n0 0",
        expectedOutput: "-1"
      },
      {
        input: "4\n2 0 2 0",
        expectedOutput: "2"
      },
      {
        input: "5\n4 1 1 3 1",
        expectedOutput: "1"
      },
      {
        input: "6\n1 2 3 4 5 6",
        expectedOutput: "3"
      }
    ]
  },
  {
    id: "minimum-removals-bounded-range",
    "hints": ["Sort the array, then keeping the most elements with max-min at most k is equivalent to finding the longest sorted subarray satisfying that bound; the answer is n minus that length.","Sort plus a two-pointer sliding window tracking the longest valid window - the removals are whatever falls outside it."],
    returns: "int",
    title: "Minimum Removals for Bounded Range",
    difficulty: "easy",
    topic: "dp",
    companies: [
      "Amazon",
      "Flipkart"
    ],
    description: "Given an array and an integer k, find the minimum number of elements to remove so that the difference between the maximum and minimum of the remaining array is at most k.",
    examples: [
      {
        input: "6\n1 2 3 4 5 6\n3",
        output: "2",
        explanation: "Keeping [1,2,3,4] needs 2 removals."
      },
      {
        input: "5\n1 1 1 1 1\n0",
        output: "0",
        explanation: "All elements are equal, so 0 removals are needed."
      },
      {
        input: "4\n1 10 20 30\n5",
        output: "3",
        explanation: "Only single elements fit within range 5, so 3 removals are needed."
      }
    ],
    constraints: [
      "1 <= n <= 10^5",
      "0 <= k <= 10^9"
    ],
    io: "array-k",
    testCases: [
      {
        input: "6\n1 2 3 4 5 6\n3",
        expectedOutput: "2"
      },
      {
        input: "5\n1 1 1 1 1\n0",
        expectedOutput: "0"
      },
      {
        input: "4\n1 10 20 30\n5",
        expectedOutput: "3"
      },
      {
        input: "5\n5 4 3 2 1\n2",
        expectedOutput: "2"
      },
      {
        input: "1\n100\n50",
        expectedOutput: "0"
      },
      {
        input: "7\n1 2 3 10 11 12 13\n3",
        expectedOutput: "3"
      },
      {
        input: "3\n1 2 3\n10",
        expectedOutput: "0"
      },
      {
        input: "6\n1 5 9 13 17 21\n4",
        expectedOutput: "4"
      },
      {
        input: "8\n4 8 15 16 23 42 4 8\n10",
        expectedOutput: "4"
      },
      {
        input: "2\n1 100\n99",
        expectedOutput: "0"
      },
      {
        input: "5\n1 3 6 10 15\n5",
        expectedOutput: "2"
      },
      {
        input: "4\n7 7 7 7\n0",
        expectedOutput: "0"
      }
    ]
  },
  {
    id: "longest-common-substring",
    "hints": ["Unlike the subsequence version, a common substring must end exactly at the compared positions: a match extends the streak, a mismatch resets it to zero.","Two-dimensional table like LCS but with the mismatch case resetting instead of carrying over; keep a running global maximum."],
    returns: "int",
    title: "Longest Common Substring",
    difficulty: "medium",
    topic: "dp",
    companies: [
      "Amazon",
      "Microsoft"
    ],
    description: "Given two strings, find the length of the longest substring (contiguous characters) common to both strings.",
    examples: [
      {
        input: "abcde\nabfce",
        output: "2",
        explanation: "abcde and abfce share ab with length 2."
      },
      {
        input: "abcdxyz\nxyzabcd",
        output: "4",
        explanation: "abcdxyz and xyzabcd share abcd with length 4."
      },
      {
        input: "abc\ndef",
        output: "0",
        explanation: "abc and def share nothing, so 0."
      }
    ],
    constraints: [
      "1 <= a.length, b.length <= 1000"
    ],
    io: "two-strings",
    testCases: [
      {
        input: "abcde\nabfce",
        expectedOutput: "2"
      },
      {
        input: "abcdxyz\nxyzabcd",
        expectedOutput: "4"
      },
      {
        input: "abc\ndef",
        expectedOutput: "0"
      },
      {
        input: "programming\ngram",
        expectedOutput: "4"
      },
      {
        input: "a\na",
        expectedOutput: "1"
      },
      {
        input: "abcdef\nazced",
        expectedOutput: "1"
      },
      {
        input: "hello\nworld",
        expectedOutput: "1"
      },
      {
        input: "abcd\nabcd",
        expectedOutput: "4"
      },
      {
        input: "xyz\nabcxyzdef",
        expectedOutput: "3"
      },
      {
        input: "aaaa\naa",
        expectedOutput: "2"
      },
      {
        input: "abcde\nedcba",
        expectedOutput: "1"
      },
      {
        input: "stone\nlongest",
        expectedOutput: "2"
      }
    ]
  },
  {
    id: "partition-equal-subset-sum",
    "hints": ["An equal split exists only when the total is even, and then it reduces to asking whether some subset sums to exactly half the total.","Reduce to the subset-sum decision problem with a one-dimensional boolean reachable array over the target half-sum."],
    returns: "bool",
    title: "Partition Equal Subset Sum",
    difficulty: "medium",
    topic: "dp",
    companies: [
      "Amazon",
      "Microsoft"
    ],
    description: "Given an array, return true if it can be partitioned into two subsets with equal sum, and false otherwise.",
    examples: [
      {
        input: "4\n1 5 11 5",
        output: "true",
        explanation: "[1,5,11,5] splits into [1,5,5] and [11], so true."
      },
      {
        input: "4\n1 5 11 9",
        output: "false",
        explanation: "[1,5,11,9] totals 26 (target 13) but no subset sums to 13, so false."
      },
      {
        input: "1\n1",
        output: "false",
        explanation: "A single 1 cannot be split into two equal subsets, so false."
      }
    ],
    constraints: [
      "1 <= n <= 200",
      "1 <= arr[i] <= 100"
    ],
    io: "array",
    testCases: [
      {
        input: "4\n1 5 11 5",
        expectedOutput: "true"
      },
      {
        input: "4\n1 5 11 9",
        expectedOutput: "false"
      },
      {
        input: "1\n1",
        expectedOutput: "false"
      },
      {
        input: "2\n1 1",
        expectedOutput: "true"
      },
      {
        input: "3\n1 2 3",
        expectedOutput: "true"
      },
      {
        input: "5\n1 2 3 4 6",
        expectedOutput: "true"
      },
      {
        input: "3\n2 2 3",
        expectedOutput: "false"
      },
      {
        input: "6\n1 1 1 1 1 5",
        expectedOutput: "true"
      },
      {
        input: "4\n14 9 8 7",
        expectedOutput: "false"
      },
      {
        input: "5\n3 3 3 4 5",
        expectedOutput: "true"
      },
      {
        input: "2\n100 100",
        expectedOutput: "true"
      },
      {
        input: "6\n1 2 5 9 10 3",
        expectedOutput: "true"
      }
    ]
  },
  {
    id: "longest-palindromic-subsequence",
    "hints": ["Look at the outer characters of each substring: equal ends can both be taken around the inner best, unequal ends force dropping one side.","Interval DP over substring bounds filled by increasing length, or equivalently the LCS of the string with its reverse."],
    returns: "int",
    title: "Longest Palindromic Subsequence",
    difficulty: "medium",
    topic: "dp",
    companies: [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    description: "Given a string, find the length of its longest palindromic subsequence: a subsequence that reads the same forwards and backwards.",
    examples: [
      {
        input: "bbbab",
        output: "4",
        explanation: "bbbab has bbab with length 4."
      },
      {
        input: "cbbd",
        output: "2",
        explanation: "cbbd has bb with length 2."
      },
      {
        input: "a",
        output: "1",
        explanation: "A single character is a palindrome of length 1."
      }
    ],
    constraints: [
      "1 <= s.length <= 1000"
    ],
    io: "string",
    testCases: [
      {
        input: "bbbab",
        expectedOutput: "4"
      },
      {
        input: "cbbd",
        expectedOutput: "2"
      },
      {
        input: "a",
        expectedOutput: "1"
      },
      {
        input: "abcdef",
        expectedOutput: "1"
      },
      {
        input: "aabaa",
        expectedOutput: "5"
      },
      {
        input: "racecar",
        expectedOutput: "7"
      },
      {
        input: "abccba",
        expectedOutput: "6"
      },
      {
        input: "abcda",
        expectedOutput: "3"
      },
      {
        input: "aaaa",
        expectedOutput: "4"
      },
      {
        input: "abacabad",
        expectedOutput: "7"
      },
      {
        input: "xyzzyx",
        expectedOutput: "6"
      },
      {
        input: "aebcbda",
        expectedOutput: "5"
      }
    ]
  },
  {
    id: "longest-alternating-subsequence",
    "hints": ["The only thing that matters about the subsequence so far is whether its last move went up or down, since the next move must go the opposite way.","Keep two DP states per position - best length ending with an up-move and with a down-move - or equivalently count the sign changes greedily."],
    returns: "int",
    title: "Longest Alternating Subsequence",
    difficulty: "easy",
    topic: "dp",
    companies: [
      "Google",
      "Amazon"
    ],
    description: "Given an array, find the length of the longest subsequence that alternates between increasing and decreasing, that is a wiggle sequence where differences strictly alternate in sign.",
    examples: [
      {
        input: "6\n1 7 4 9 2 5",
        output: "6",
        explanation: "1,7,4,9,2,5 already alternates, giving 6."
      },
      {
        input: "6\n1 17 5 10 13 15",
        output: "4",
        explanation: "The longest wiggle subsequence of [1,17,5,10,13,15] has length 4."
      },
      {
        input: "6\n1 2 3 4 5 6",
        output: "2",
        explanation: "A strictly increasing array gives 2."
      }
    ],
    constraints: [
      "1 <= n <= 1000"
    ],
    io: "array",
    testCases: [
      {
        input: "6\n1 7 4 9 2 5",
        expectedOutput: "6"
      },
      {
        input: "6\n1 17 5 10 13 15",
        expectedOutput: "4"
      },
      {
        input: "6\n1 2 3 4 5 6",
        expectedOutput: "2"
      },
      {
        input: "3\n3 3 3",
        expectedOutput: "1"
      },
      {
        input: "1\n5",
        expectedOutput: "1"
      },
      {
        input: "2\n1 2",
        expectedOutput: "2"
      },
      {
        input: "5\n5 4 3 2 1",
        expectedOutput: "2"
      },
      {
        input: "8\n1 7 4 9 2 5 3 8",
        expectedOutput: "8"
      },
      {
        input: "4\n1 3 2 4",
        expectedOutput: "4"
      },
      {
        input: "5\n2 2 2 3 3",
        expectedOutput: "2"
      },
      {
        input: "7\n1 5 2 6 3 7 4",
        expectedOutput: "7"
      },
      {
        input: "4\n4 3 2 1",
        expectedOutput: "2"
      }
    ]
  },
  {
    id: "weighted-job-scheduling",
    "hints": ["Sort jobs by finish time; each job is either skipped or taken together with the best schedule of jobs that end no later than it starts.","DP over sorted jobs where the 'take' option adds the latest compatible job's value, found with binary search on end times."],
    returns: "int",
    title: "Weighted Job Scheduling",
    difficulty: "medium",
    topic: "dp",
    companies: [
      "Amazon",
      "Google"
    ],
    description: "Given n jobs as three rows (start times, end times, profits), select non-overlapping jobs to maximize total profit. A job starting exactly when another ends is allowed.",
    examples: [
      {
        input: "3 4\n1 3 6 2\n2 5 19 100\n50 20 100 200",
        output: "250",
        explanation: "Jobs (1,2,50) and (2,100,200) do not overlap, giving 50 + 200 = 250."
      },
      {
        input: "3 3\n1 2 3\n3 4 5\n10 20 30",
        output: "40",
        explanation: "Jobs (1,3,10) and (3,5,30) give 40."
      },
      {
        input: "3 1\n1\n2\n100",
        output: "100",
        explanation: "A single job gives its own profit: 100."
      }
    ],
    constraints: [
      "1 <= n <= 10^4"
    ],
    io: "matrix",
    testCases: [
      {
        input: "3 4\n1 3 6 2\n2 5 19 100\n50 20 100 200",
        expectedOutput: "250"
      },
      {
        input: "3 3\n1 2 3\n3 4 5\n10 20 30",
        expectedOutput: "40"
      },
      {
        input: "3 1\n1\n2\n100",
        expectedOutput: "100"
      },
      {
        input: "3 4\n1 1 1 1\n2 2 2 2\n5 6 7 8",
        expectedOutput: "8"
      },
      {
        input: "3 5\n1 3 0 5 8\n2 4 6 7 9\n50 10 40 70 30",
        expectedOutput: "160"
      },
      {
        input: "3 2\n1 3\n2 4\n20 30",
        expectedOutput: "50"
      },
      {
        input: "3 6\n1 2 3 4 5 6\n2 3 4 5 6 7\n1 2 3 4 5 6",
        expectedOutput: "21"
      },
      {
        input: "3 3\n1 5 2\n10 6 8\n100 200 150",
        expectedOutput: "200"
      },
      {
        input: "3 4\n1 2 3 4\n5 6 7 8\n10 10 10 10",
        expectedOutput: "10"
      },
      {
        input: "3 2\n1 2\n3 4\n5 6",
        expectedOutput: "6"
      },
      {
        input: "3 5\n1 2 3 4 5\n3 4 5 6 7\n5 4 3 2 1",
        expectedOutput: "9"
      },
      {
        input: "3 4\n0 1 2 3\n1 2 3 4\n10 20 30 40",
        expectedOutput: "100"
      }
    ]
  },
  {
    id: "coin-game",
    "hints": ["A pile size is winning exactly when some legal move leaves a losing pile for the opponent; the base case is the empty pile, which is losing.","One-dimensional boolean DP from 0 up to n checking the three moves; each state is the logical OR of the negation of its successors."],
    returns: "bool",
    title: "Coin Game",
    difficulty: "medium",
    topic: "dp",
    companies: [
      "Amazon",
      "Microsoft"
    ],
    description: "There is a pile of n coins. Two players alternate taking 1, x or y coins. The player who takes the last coin wins. Both play optimally. The input gives n, x and y. Return true if the first player wins.",
    examples: [
      {
        input: "3\n5 3 4",
        output: "true",
        explanation: "With 5 coins and moves 1, 3, 4, the first player takes 3 leaving 2, from which the opponent cannot force a win: true."
      },
      {
        input: "3\n2 3 4",
        output: "false",
        explanation: "With 2 coins and moves 1, 3, 4, the first player can only take 1 and then loses the last coin: false."
      },
      {
        input: "3\n1 2 3",
        output: "true",
        explanation: "With 1 coin, the first player takes it and wins: true."
      }
    ],
    constraints: [
      "1 <= n <= 1000",
      "1 <= x, y <= n"
    ],
    io: "array",
    testCases: [
      {
        input: "3\n5 3 4",
        expectedOutput: "true"
      },
      {
        input: "3\n2 3 4",
        expectedOutput: "false"
      },
      {
        input: "3\n1 2 3",
        expectedOutput: "true"
      },
      {
        input: "3\n10 2 5",
        expectedOutput: "true"
      },
      {
        input: "3\n7 2 3",
        expectedOutput: "true"
      },
      {
        input: "3\n4 2 3",
        expectedOutput: "false"
      },
      {
        input: "3\n15 3 5",
        expectedOutput: "true"
      },
      {
        input: "3\n3 1 2",
        expectedOutput: "false"
      },
      {
        input: "3\n6 1 4",
        expectedOutput: "true"
      },
      {
        input: "3\n8 3 5",
        expectedOutput: "false"
      },
      {
        input: "3\n20 4 7",
        expectedOutput: "true"
      },
      {
        input: "3\n9 2 4",
        expectedOutput: "false"
      }
    ]
  },
  {
    id: "coin-game-winner",
    "hints": ["Determine for each pile size whether the player to move can force a win, then report First if the full pile is winning and Second otherwise.","Build the same one-dimensional win/lose DP as the coin game and map the final boolean to the required label."],
    returns: "string",
    title: "Coin Game Winner",
    difficulty: "easy",
    topic: "dp",
    companies: [
      "Amazon",
      "Flipkart"
    ],
    description: "There is a pile of n coins. Two players alternate taking 1, x or y coins. The player who takes the last coin wins. Both play optimally. The input gives n, x and y. Return First if the first player wins and Second otherwise.",
    examples: [
      {
        input: "3\n5 3 4",
        output: "First",
        explanation: "With 5 coins and moves 1, 3, 4, the first player wins."
      },
      {
        input: "3\n2 3 4",
        output: "Second",
        explanation: "With 2 coins and moves 1, 3, 4, the second player wins."
      },
      {
        input: "3\n1 2 3",
        output: "First",
        explanation: "With 1 coin, the first player wins."
      }
    ],
    constraints: [
      "1 <= n <= 1000",
      "1 <= x, y <= n"
    ],
    io: "array",
    testCases: [
      {
        input: "3\n5 3 4",
        expectedOutput: "First"
      },
      {
        input: "3\n2 3 4",
        expectedOutput: "Second"
      },
      {
        input: "3\n1 2 3",
        expectedOutput: "First"
      },
      {
        input: "3\n10 2 5",
        expectedOutput: "First"
      },
      {
        input: "3\n7 2 3",
        expectedOutput: "First"
      },
      {
        input: "3\n4 2 3",
        expectedOutput: "Second"
      },
      {
        input: "3\n15 3 5",
        expectedOutput: "First"
      },
      {
        input: "3\n3 1 2",
        expectedOutput: "Second"
      },
      {
        input: "3\n6 1 4",
        expectedOutput: "First"
      },
      {
        input: "3\n8 3 5",
        expectedOutput: "Second"
      },
      {
        input: "3\n20 4 7",
        expectedOutput: "First"
      },
      {
        input: "3\n9 2 4",
        expectedOutput: "Second"
      }
    ]
  },
  {
    id: "optimal-strategy-for-a-game",
    "hints": ["When the current player picks an end, the opponent will then play optimally on the remaining subarray, so the player must assume the worse of the opponent's two responses.","Interval DP over (left, right) filled by increasing subarray length, combining each pick with the minimum the opponent leaves behind."],
    returns: "int",
    title: "Optimal Strategy for a Game",
    difficulty: "medium",
    topic: "dp",
    companies: [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    description: "Two players alternately pick a coin from either end of a row. Both play optimally to maximize their own total. Return the maximum value the first player can collect.",
    examples: [
      {
        input: "4\n8 15 3 7",
        output: "22",
        explanation: "Picking 7 first leads to a total of 22 for the first player."
      },
      {
        input: "4\n2 2 2 2",
        output: "4",
        explanation: "With all equal coins the first player gets 4."
      },
      {
        input: "6\n20 30 2 2 2 10",
        output: "42",
        explanation: "Optimal play on [20, 30, 2, 2, 2, 10] gives the first player 42."
      }
    ],
    constraints: [
      "1 <= n <= 100"
    ],
    io: "array",
    testCases: [
      {
        input: "4\n8 15 3 7",
        expectedOutput: "22"
      },
      {
        input: "4\n2 2 2 2",
        expectedOutput: "4"
      },
      {
        input: "6\n20 30 2 2 2 10",
        expectedOutput: "42"
      },
      {
        input: "1\n5",
        expectedOutput: "5"
      },
      {
        input: "2\n5 10",
        expectedOutput: "10"
      },
      {
        input: "3\n1 2 3",
        expectedOutput: "4"
      },
      {
        input: "5\n1 2 3 4 5",
        expectedOutput: "9"
      },
      {
        input: "4\n5 3 7 10",
        expectedOutput: "15"
      },
      {
        input: "6\n1 2 3 4 5 6",
        expectedOutput: "12"
      },
      {
        input: "3\n10 1 1",
        expectedOutput: "11"
      },
      {
        input: "4\n1 100 2 3",
        expectedOutput: "103"
      },
      {
        input: "5\n7 8 9 1 2",
        expectedOutput: "16"
      }
    ]
  },
  {
    id: "matrix-chain-multiplication",
    "hints": ["The whole chain splits at some multiplication point into two independent subchains; the total cost is the two subchain costs plus the cost of multiplying their results.","Interval DP over chain segments filled by increasing segment length, trying every split position inside each segment."],
    returns: "int",
    title: "Matrix Chain Multiplication",
    difficulty: "hard",
    topic: "dp",
    companies: [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    description: "Given the dimensions of n matrices where matrix i has dimensions dims[i-1] x dims[i], find the minimum number of scalar multiplications needed to multiply the whole chain.",
    examples: [
      {
        input: "4\n1 2 3 4",
        output: "18",
        explanation: "Matrices 1x2, 2x3, 3x4 need 18 multiplications optimally."
      },
      {
        input: "5\n10 20 30 40 30",
        output: "30000",
        explanation: "Matrices 10x20, 20x30, 30x40, 40x30 need 30000 multiplications."
      },
      {
        input: "3\n5 10 20",
        output: "1000",
        explanation: "Matrices 5x10 and 10x20 need 5*10*20 = 1000 multiplications."
      }
    ],
    constraints: [
      "2 <= dims.length <= 100"
    ],
    io: "array",
    testCases: [
      {
        input: "4\n1 2 3 4",
        expectedOutput: "18"
      },
      {
        input: "5\n10 20 30 40 30",
        expectedOutput: "30000"
      },
      {
        input: "3\n5 10 20",
        expectedOutput: "1000"
      },
      {
        input: "2\n3 4",
        expectedOutput: "0"
      },
      {
        input: "6\n5 10 3 12 5 50",
        expectedOutput: "1655"
      },
      {
        input: "4\n2 3 4 5",
        expectedOutput: "64"
      },
      {
        input: "5\n1 2 3 4 5",
        expectedOutput: "38"
      },
      {
        input: "3\n10 20 30",
        expectedOutput: "6000"
      },
      {
        input: "4\n40 20 30 10",
        expectedOutput: "14000"
      },
      {
        input: "7\n1 2 3 4 5 6 7",
        expectedOutput: "110"
      },
      {
        input: "3\n7 8 9",
        expectedOutput: "504"
      },
      {
        input: "5\n4 5 6 7 8",
        expectedOutput: "512"
      }
    ]
  },
  {
    id: "buy-and-sell-stock-twice",
    "hints": ["Split the timeline at every day: the best total is the best single transaction on the left plus the best single transaction on the right.","Two passes computing best-forward and best-backward single-transaction profits and combining them, or a four-state machine DP tracking the two buys and two sells."],
    returns: "int",
    title: "Buy and Sell Stock At Most Twice",
    difficulty: "medium",
    topic: "dp",
    companies: [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    description: "Given daily stock prices, find the maximum profit achievable with at most two transactions. A transaction is one buy followed by one sell; you cannot hold two positions at once.",
    examples: [
      {
        input: "8\n3 3 5 0 0 3 1 4",
        output: "6",
        explanation: "Two transactions give profit 6."
      },
      {
        input: "5\n1 2 3 4 5",
        output: "4",
        explanation: "A rising market gives 4 with one transaction."
      },
      {
        input: "5\n7 6 4 3 1",
        output: "0",
        explanation: "A falling market gives 0."
      }
    ],
    constraints: [
      "1 <= n <= 10^5"
    ],
    io: "array",
    testCases: [
      {
        input: "8\n3 3 5 0 0 3 1 4",
        expectedOutput: "6"
      },
      {
        input: "5\n1 2 3 4 5",
        expectedOutput: "4"
      },
      {
        input: "5\n7 6 4 3 1",
        expectedOutput: "0"
      },
      {
        input: "1\n5",
        expectedOutput: "0"
      },
      {
        input: "2\n1 2",
        expectedOutput: "1"
      },
      {
        input: "6\n2 1 2 0 1 3",
        expectedOutput: "4"
      },
      {
        input: "4\n1 2 4 2",
        expectedOutput: "3"
      },
      {
        input: "7\n5 4 3 2 1 2 3",
        expectedOutput: "2"
      },
      {
        input: "6\n1 2 3 2 5 1",
        expectedOutput: "5"
      },
      {
        input: "3\n2 2 2",
        expectedOutput: "0"
      },
      {
        input: "9\n1 3 2 4 3 5 4 6 5",
        expectedOutput: "6"
      },
      {
        input: "4\n6 1 3 2",
        expectedOutput: "2"
      }
    ]
  },
  {
    id: "optimal-binary-search-tree",
    "hints": ["For any interval of keys, try each key as the root: its cost is the sum of frequencies in the interval plus the optimal costs of the two resulting subtrees.","Interval DP over key ranges filled by increasing range length, with a prefix-sum array supplying each interval's frequency total in constant time."],
    returns: "int",
    title: "Optimal Binary Search Tree",
    difficulty: "hard",
    topic: "dp",
    companies: [
      "Amazon",
      "Microsoft"
    ],
    description: "Given keys and their search frequencies as two rows, build the binary search tree with minimum total search cost, where the cost is the sum of frequency times depth over all keys.",
    examples: [
      {
        input: "2 3\n10 12 20\n34 8 50",
        output: "142",
        explanation: "Keys 10, 12, 20 with frequencies 34, 8, 50 give cost 142."
      },
      {
        input: "2 2\n1 2\n10 20",
        output: "40",
        explanation: "Keys 1, 2 with frequencies 10, 20 give cost 40."
      },
      {
        input: "2 1\n5\n100",
        output: "100",
        explanation: "A single key gives its own frequency: 100."
      }
    ],
    constraints: [
      "1 <= n <= 100"
    ],
    io: "matrix",
    testCases: [
      {
        input: "2 3\n10 12 20\n34 8 50",
        expectedOutput: "142"
      },
      {
        input: "2 2\n1 2\n10 20",
        expectedOutput: "40"
      },
      {
        input: "2 1\n5\n100",
        expectedOutput: "100"
      },
      {
        input: "2 4\n1 2 3 4\n4 2 6 3",
        expectedOutput: "26"
      },
      {
        input: "2 3\n30 10 20\n34 8 50",
        expectedOutput: "134"
      },
      {
        input: "2 5\n1 2 3 4 5\n1 1 1 1 1",
        expectedOutput: "11"
      },
      {
        input: "2 2\n5 1\n3 7",
        expectedOutput: "13"
      },
      {
        input: "2 4\n4 2 1 3\n1 2 3 4",
        expectedOutput: "18"
      },
      {
        input: "2 3\n1 2 3\n100 1 1",
        expectedOutput: "105"
      },
      {
        input: "2 6\n1 2 3 4 5 6\n6 5 4 3 2 1",
        expectedOutput: "45"
      },
      {
        input: "2 3\n7 8 9\n1 1 1",
        expectedOutput: "5"
      },
      {
        input: "2 4\n10 20 30 40\n1 1 1 100",
        expectedOutput: "108"
      }
    ]
  },
  {
    id: "largest-submatrix-sum-zero",
    "hints": ["Fix a pair of top and bottom rows, compress each column between them into a single sum, and the problem becomes the longest zero-sum subarray in one dimension.","Enumerate row pairs with running column sums and apply the hashmap longest-zero-sum-subarray technique per pair, tracking the maximum area."],
    returns: "int",
    title: "Largest Submatrix with Sum Zero",
    difficulty: "hard",
    topic: "dp",
    companies: [
      "Amazon",
      "Microsoft"
    ],
    description: "Given a matrix, find the area (rows times columns) of the largest submatrix whose elements sum to zero. Return 0 if none exists.",
    examples: [
      {
        input: "2 2\n1 -1\n-1 1",
        output: "4",
        explanation: "The whole 2x2 block sums to zero, giving area 4."
      },
      {
        input: "2 2\n1 2\n3 4",
        output: "0",
        explanation: "No submatrix sums to zero, so the answer is 0."
      },
      {
        input: "1 1\n0",
        output: "1",
        explanation: "A single zero cell gives area 1."
      }
    ],
    constraints: [
      "1 <= m, n <= 100"
    ],
    io: "matrix",
    testCases: [
      {
        input: "2 2\n1 -1\n-1 1",
        expectedOutput: "4"
      },
      {
        input: "2 2\n1 2\n3 4",
        expectedOutput: "0"
      },
      {
        input: "1 1\n0",
        expectedOutput: "1"
      },
      {
        input: "1 1\n5",
        expectedOutput: "0"
      },
      {
        input: "3 3\n0 0 0\n0 0 0\n0 0 0",
        expectedOutput: "9"
      },
      {
        input: "2 3\n1 2 3\n4 5 6",
        expectedOutput: "0"
      },
      {
        input: "3 4\n1 -1 2 -2\n3 -3 4 -4\n5 -5 6 -6",
        expectedOutput: "12"
      },
      {
        input: "1 3\n1 -1 0",
        expectedOutput: "3"
      },
      {
        input: "4 4\n1 2 3 4\n-1 -2 -3 -4\n1 1 1 1\n-1 -1 -1 -1",
        expectedOutput: "16"
      },
      {
        input: "2 4\n2 -2 3 -3\n1 -1 4 -4",
        expectedOutput: "8"
      },
      {
        input: "3 2\n5 5\n-5 -5\n5 5",
        expectedOutput: "4"
      },
      {
        input: "3 3\n1 2 3\n-3 -2 -1\n1 1 1",
        expectedOutput: "6"
      }
    ]
  },
  {
    id: "largest-submatrix-equal-zeros-ones",
    "hints": ["Turn every 0 into -1 so that equal counts become a zero sum, then the problem is identical to the largest zero-sum submatrix.","Transform the matrix and reuse the row-pair compression plus hashmap longest-zero-sum-subarray approach."],
    returns: "int",
    title: "Largest Submatrix with Equal Zeros and Ones",
    difficulty: "hard",
    topic: "dp",
    companies: [
      "Amazon",
      "Google"
    ],
    description: "Given a binary matrix, find the area of the largest submatrix containing an equal number of zeros and ones. Return 0 if none exists.",
    examples: [
      {
        input: "2 2\n1 0\n0 1",
        output: "4",
        explanation: "The whole 2x2 block has two zeros and two ones: area 4."
      },
      {
        input: "2 2\n1 1\n1 1",
        output: "0",
        explanation: "An all-ones matrix has no valid submatrix: 0."
      },
      {
        input: "1 4\n1 0 1 0",
        output: "4",
        explanation: "A single row [1,0,1,0] gives area 4."
      }
    ],
    constraints: [
      "1 <= m, n <= 100"
    ],
    io: "matrix",
    testCases: [
      {
        input: "2 2\n1 0\n0 1",
        expectedOutput: "4"
      },
      {
        input: "2 2\n1 1\n1 1",
        expectedOutput: "0"
      },
      {
        input: "1 4\n1 0 1 0",
        expectedOutput: "4"
      },
      {
        input: "4 4\n1 1 0 0\n1 1 0 0\n0 0 1 1\n0 0 1 1",
        expectedOutput: "16"
      },
      {
        input: "3 4\n0 0 0 0\n0 0 0 0\n0 0 0 0",
        expectedOutput: "0"
      },
      {
        input: "2 3\n1 0 1\n1 0 1",
        expectedOutput: "4"
      },
      {
        input: "1 1\n0",
        expectedOutput: "0"
      },
      {
        input: "1 2\n0 1",
        expectedOutput: "2"
      },
      {
        input: "5 5\n1 0 1 0 1\n0 1 0 1 0\n1 0 1 0 1\n0 1 0 1 0\n1 0 1 0 1",
        expectedOutput: "20"
      },
      {
        input: "3 3\n1 1 1\n1 0 1\n1 1 1",
        expectedOutput: "2"
      },
      {
        input: "4 2\n1 0\n0 1\n1 0\n0 1",
        expectedOutput: "8"
      },
      {
        input: "3 3\n1 0 1\n0 1 0\n1 0 1",
        expectedOutput: "6"
      }
    ]
  }
,
{
    "id": "activity-selection",
    "hints": ["Think about which activity to commit to first: choosing the one that finishes earliest leaves the maximum room for everything else.","Sort all activities by finish time ascending, then greedily pick each activity whose start time is at or after the last picked activity's finish."],
    "returns": "int",
    "title": "Activity Selection Problem",
    "difficulty": "easy",
    "topic": "greedy",
    "companies": [
      "Facebook",
      "Morgan Stanley",
      "Flipkart"
    ],
    "description": "Given n activities with start and finish times, select the maximum number of activities that can be performed by a single person, assuming only one activity can be performed at a time. Input format: first line n, then n lines each with start and finish time.",
    "examples": [
      {
        "input": "6\n1 2\n3 4\n0 6\n5 7\n8 9\n5 9",
        "output": "4",
        "explanation": "Activities sorted by finish time give [1,2],[3,4],[5,7],[8,9], a total of 4."
      },
      {
        "input": "3\n10 20\n12 25\n20 30",
        "output": "2",
        "explanation": "Pick [10,20] then [20,30] for 2 activities."
      },
      {
        "input": "3\n1 10\n2 3\n4 5",
        "output": "2",
        "explanation": "[2,3] and [4,5] fit inside [1,10], so 2 activities."
      }
    ],
    "constraints": [
      "1 <= n <= 10^5",
      "0 <= start < finish <= 10^9"
    ],
    "io": "intervals",
    "testCases": [
      {
        "input": "6\n1 2\n3 4\n0 6\n5 7\n8 9\n5 9",
        "expectedOutput": "4"
      },
      {
        "input": "3\n10 20\n12 25\n20 30",
        "expectedOutput": "2"
      },
      {
        "input": "3\n1 10\n2 3\n4 5",
        "expectedOutput": "2"
      },
      {
        "input": "6\n5 9\n1 2\n3 4\n0 6\n5 7\n8 9",
        "expectedOutput": "4"
      },
      {
        "input": "1\n1 2",
        "expectedOutput": "1"
      },
      {
        "input": "11\n1 4\n3 5\n0 6\n5 7\n3 9\n5 9\n6 10\n8 11\n8 12\n2 14\n12 16",
        "expectedOutput": "4"
      },
      {
        "input": "4\n1 3\n2 4\n3 5\n4 6",
        "expectedOutput": "2"
      },
      {
        "input": "4\n0 1\n1 2\n2 3\n3 4",
        "expectedOutput": "4"
      },
      {
        "input": "3\n5 6\n5 6\n5 6",
        "expectedOutput": "1"
      },
      {
        "input": "5\n2 5\n1 3\n4 8\n7 9\n10 12",
        "expectedOutput": "3"
      },
      {
        "input": "4\n0 5\n3 7\n5 9\n8 10",
        "expectedOutput": "2"
      },
      {
        "input": "4\n6 8\n1 9\n2 4\n4 7",
        "expectedOutput": "2"
      }
    ]
  },
  {
    "id": "minimum-number-of-coins",
    "hints": ["Ask yourself whether taking the largest denomination that fits the remaining amount can ever lead to more coins than an optimal solution.","Sort denominations in descending order and greedily take as many of each coin as possible before moving to the next smaller one."],
    "returns": "int",
    "title": "Minimum Number of Coins",
    "difficulty": "easy",
    "topic": "greedy",
    "companies": [
      "Amazon",
      "Paytm",
      "Oracle"
    ],
    "description": "Given coin denominations and an amount, find the minimum number of coins needed to make that amount using a greedy approach. Input format: first line n, second line the denominations, third line the amount.",
    "examples": [
      {
        "input": "6\n1 5 10 20 50 100\n93",
        "output": "6",
        "explanation": "50 + 20 + 20 + 1 + 1 + 1 uses 6 coins."
      },
      {
        "input": "4\n1 5 10 25\n30",
        "output": "2",
        "explanation": "25 + 5 uses 2 coins."
      },
      {
        "input": "4\n1 2 5 10\n18",
        "output": "4",
        "explanation": "10 + 5 + 2 + 1 uses 4 coins."
      }
    ],
    "constraints": [
      "1 <= n <= 100",
      "1 <= amount <= 10^5",
      "Denominations form a canonical coin system"
    ],
    "io": "array-target",
    "testCases": [
      {
        "input": "6\n1 5 10 20 50 100\n93",
        "expectedOutput": "6"
      },
      {
        "input": "4\n1 5 10 25\n30",
        "expectedOutput": "2"
      },
      {
        "input": "4\n1 2 5 10\n18",
        "expectedOutput": "4"
      },
      {
        "input": "3\n1 5 10\n7",
        "expectedOutput": "3"
      },
      {
        "input": "4\n1 5 10 20\n40",
        "expectedOutput": "2"
      },
      {
        "input": "1\n1\n11",
        "expectedOutput": "11"
      },
      {
        "input": "5\n2 5 10 20 50\n87",
        "expectedOutput": "5"
      },
      {
        "input": "5\n1 5 10 50 100\n256",
        "expectedOutput": "5"
      },
      {
        "input": "4\n1 3 9 27\n38",
        "expectedOutput": "4"
      },
      {
        "input": "3\n5 10 25\n5",
        "expectedOutput": "1"
      },
      {
        "input": "5\n1 5 10 20 100\n1000",
        "expectedOutput": "10"
      },
      {
        "input": "3\n1 2 5\n13",
        "expectedOutput": "4"
      }
    ]
  },
  {
    "id": "minimum-sum-two-numbers",
    "hints": ["The largest digits should end up in the least significant positions, and the two numbers should stay balanced in length so neither dominates.","Sort the digits ascending and distribute them alternately between the two numbers, placing smaller digits at more significant positions."],
    "returns": "int",
    "title": "Minimum Sum of Two Numbers Formed from Digits",
    "difficulty": "medium",
    "topic": "greedy",
    "companies": [
      "Google",
      "Amazon"
    ],
    "description": "Given an array of digits, form two numbers from all the digits such that their sum is minimized, and return that sum. Input format: first line n, second line the digits.",
    "examples": [
      {
        "input": "6\n6 8 4 5 2 3",
        "output": "604",
        "explanation": "Sorted digits 2 3 4 5 6 8 form 246 and 358, sum 604."
      },
      {
        "input": "5\n5 3 0 7 4",
        "output": "82",
        "explanation": "Digits form 047 and 35, sum 82."
      },
      {
        "input": "2\n1 2",
        "output": "3",
        "explanation": "Numbers 1 and 2 sum to 3."
      }
    ],
    "constraints": [
      "2 <= n <= 10^5",
      "0 <= digit <= 9"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "6\n6 8 4 5 2 3",
        "expectedOutput": "604"
      },
      {
        "input": "5\n5 3 0 7 4",
        "expectedOutput": "82"
      },
      {
        "input": "2\n1 2",
        "expectedOutput": "3"
      },
      {
        "input": "4\n9 9 9 9",
        "expectedOutput": "198"
      },
      {
        "input": "3\n0 0 1",
        "expectedOutput": "1"
      },
      {
        "input": "8\n8 1 7 2 6 3 5 4",
        "expectedOutput": "3825"
      },
      {
        "input": "3\n4 4 4",
        "expectedOutput": "48"
      },
      {
        "input": "4\n1 0 0 0",
        "expectedOutput": "1"
      },
      {
        "input": "2\n7 5",
        "expectedOutput": "12"
      },
      {
        "input": "8\n3 1 4 1 5 9 2 6",
        "expectedOutput": "2605"
      },
      {
        "input": "5\n2 2 2 2 2",
        "expectedOutput": "244"
      },
      {
        "input": "5\n9 0 1 8 2",
        "expectedOutput": "47"
      }
    ]
  },
  {
    "id": "minimum-sum-absolute-difference-pairs",
    "hints": ["If two pairs are crossed (a smaller A matched with a larger B while a larger A takes a smaller B), swapping them can never increase the total.","Sort both arrays in ascending order and pair them position-wise; this order-preserving greedy matching is optimal."],
    "returns": "int",
    "title": "Minimum Sum of Absolute Difference of Pairs",
    "difficulty": "medium",
    "topic": "greedy",
    "companies": [
      "Amazon",
      "Google"
    ],
    "description": "Given two arrays A and B of equal length n, pair each element of A with exactly one element of B so that the sum of absolute differences of the pairs is minimized. Return that minimum sum. Input format: first line is the total count, second line starts with n followed by the n elements of A and then the n elements of B.",
    "examples": [
      {
        "input": "7\n3 1 5 9 4 6 2",
        "output": "5",
        "explanation": "A=[1,5,9], B=[4,6,2]. Sorted pairs give |1-2|+|5-4|+|9-6| = 5."
      },
      {
        "input": "9\n4 1 2 3 4 1 2 3 4",
        "output": "0",
        "explanation": "Identical arrays give sum 0."
      },
      {
        "input": "5\n2 10 20 1 2",
        "output": "27",
        "explanation": "A=[10,20], B=[1,2]. Best pairing gives |10-2|+|20-1| = 27."
      }
    ],
    "constraints": [
      "1 <= n <= 10^5",
      "0 <= A[i], B[i] <= 10^9"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "7\n3 1 5 9 4 6 2",
        "expectedOutput": "5"
      },
      {
        "input": "9\n4 1 2 3 4 1 2 3 4",
        "expectedOutput": "0"
      },
      {
        "input": "5\n2 10 20 1 2",
        "expectedOutput": "27"
      },
      {
        "input": "3\n1 5 100",
        "expectedOutput": "95"
      },
      {
        "input": "11\n5 3 1 4 1 5 2 8 7 6 5",
        "expectedOutput": "14"
      },
      {
        "input": "7\n3 7 7 7 7 7 7",
        "expectedOutput": "0"
      },
      {
        "input": "9\n4 9 1 8 2 3 4 5 6",
        "expectedOutput": "10"
      },
      {
        "input": "5\n2 1 100 50 60",
        "expectedOutput": "89"
      },
      {
        "input": "13\n6 5 4 3 2 1 0 1 2 3 4 5 6",
        "expectedOutput": "6"
      },
      {
        "input": "7\n3 1 1 1 100 100 100",
        "expectedOutput": "297"
      },
      {
        "input": "9\n4 2 7 1 8 2 7 1 8",
        "expectedOutput": "0"
      },
      {
        "input": "11\n5 10 20 30 40 50 15 25 35 45 55",
        "expectedOutput": "25"
      }
    ]
  },
  {
    "id": "maximum-height-pyramid",
    "hints": ["To get the tallest pyramid, each level should consume as little total width and as few objects as possible while still beating the level above it.","Sort the widths ascending and greedily build each level from the smallest remaining objects such that both its count and total width strictly exceed the previous level."],
    "returns": "int",
    "title": "Maximum Height Pyramid from Array",
    "difficulty": "medium",
    "topic": "greedy",
    "companies": [
      "Flipkart",
      "Amazon"
    ],
    "description": "Given an array of object widths, build the tallest possible pyramid where each level uses objects of strictly greater total width and strictly more objects than the level above it. Return the maximum height. Input format: first line n, second line the widths.",
    "examples": [
      {
        "input": "7\n4 1 2 3 4 5 6",
        "output": "3",
        "explanation": "Levels: [4], [1,5], [2,3,6] give height 3."
      },
      {
        "input": "3\n1 2 3",
        "output": "2",
        "explanation": "Levels: [1], [2,3] give height 2."
      },
      {
        "input": "1\n5",
        "output": "1",
        "explanation": "A single object gives height 1."
      }
    ],
    "constraints": [
      "1 <= n <= 10^5",
      "1 <= width <= 10^4"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "7\n4 1 2 3 4 5 6",
        "expectedOutput": "3"
      },
      {
        "input": "3\n1 2 3",
        "expectedOutput": "2"
      },
      {
        "input": "1\n5",
        "expectedOutput": "1"
      },
      {
        "input": "4\n2 2 2 2",
        "expectedOutput": "2"
      },
      {
        "input": "6\n1 1 1 2 2 3",
        "expectedOutput": "3"
      },
      {
        "input": "8\n10 20 30 40 50 60 70 80",
        "expectedOutput": "3"
      },
      {
        "input": "7\n3 3 3 3 3 3 3",
        "expectedOutput": "3"
      },
      {
        "input": "2\n1 2",
        "expectedOutput": "1"
      },
      {
        "input": "8\n5 4 3 2 1 1 1 1",
        "expectedOutput": "3"
      },
      {
        "input": "1\n100",
        "expectedOutput": "1"
      },
      {
        "input": "10\n1 2 3 4 5 6 7 8 9 10",
        "expectedOutput": "4"
      },
      {
        "input": "6\n6 6 6 7 7 8",
        "expectedOutput": "3"
      }
    ]
  },
  {
    "id": "minimum-cost-to-acquire-coins",
    "hints": ["Every purchase covers k+1 coins total, so the question reduces to how few coins you need to buy and which ones.","Sort prices ascending and buy only the cheapest ceil(n / (k+1)) coins, letting each purchase's k free coins absorb the most expensive ones."],
    "returns": "int",
    "title": "Minimum Cost to Acquire All Coins",
    "difficulty": "medium",
    "topic": "greedy",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "There are n coins with given prices. When you buy a coin you get k additional coins for free. Find the minimum cost to acquire all coins. Input format: first line n, second line prices, third line k.",
    "examples": [
      {
        "input": "5\n4 3 2 5 10\n2",
        "output": "5",
        "explanation": "Buy coins 2 and 3 (cheapest), get the rest free. Cost 5."
      },
      {
        "input": "5\n1 2 3 4 5\n1",
        "output": "6",
        "explanation": "Buy 1, 2, 3 and get 4, 5 free. Cost 6."
      },
      {
        "input": "3\n10 20 30\n0",
        "output": "60",
        "explanation": "With k=0 every coin must be bought. Cost 60."
      }
    ],
    "constraints": [
      "1 <= n <= 10^5",
      "1 <= price <= 10^4",
      "0 <= k < n"
    ],
    "io": "array-k",
    "testCases": [
      {
        "input": "5\n4 3 2 5 10\n2",
        "expectedOutput": "5"
      },
      {
        "input": "5\n1 2 3 4 5\n1",
        "expectedOutput": "6"
      },
      {
        "input": "3\n10 20 30\n0",
        "expectedOutput": "60"
      },
      {
        "input": "1\n100\n5",
        "expectedOutput": "100"
      },
      {
        "input": "6\n5 4 3 2 1 6\n3",
        "expectedOutput": "3"
      },
      {
        "input": "4\n7 7 7 7\n1",
        "expectedOutput": "14"
      },
      {
        "input": "8\n1 1 1 1 1 1 1 1\n7",
        "expectedOutput": "1"
      },
      {
        "input": "5\n9 8 7 6 5\n2",
        "expectedOutput": "11"
      },
      {
        "input": "2\n3 8\n1",
        "expectedOutput": "3"
      },
      {
        "input": "10\n1 2 3 4 5 6 7 8 9 10\n4",
        "expectedOutput": "3"
      },
      {
        "input": "3\n5 5 5\n2",
        "expectedOutput": "5"
      },
      {
        "input": "7\n12 11 10 9 8 7 6\n1",
        "expectedOutput": "30"
      }
    ]
  },
  {
    "id": "maximum-equal-sum-three-stacks",
    "hints": ["Since you can only remove from the top, each stack's achievable sums are exactly its suffix sums, and the answer is the largest sum all three can reach.","Track each stack's current total and repeatedly pop from the top of the tallest stack until all three sums are equal or a stack empties."],
    "returns": "int",
    "title": "Maximum Equal Sum of Three Stacks",
    "difficulty": "medium",
    "topic": "greedy",
    "companies": [
      "Microsoft",
      "Amazon",
      "Flipkart"
    ],
    "description": "Given three stacks, remove some elements from the top of each stack so that all three stacks have the maximum possible equal sum. Return that sum, or 0 if impossible. Input format: first line is the total count, second line starts with n1 n2 n3 followed by the n1 elements of stack 1, n2 of stack 2 and n3 of stack 3. The first element of each stack is the top.",
    "examples": [
      {
        "input": "13\n3 3 4 3 2 1 1 4 1 1 2 3 4",
        "output": "0",
        "explanation": "Stacks [3,2,1,1],[4,1],[1,2,3,4] equalize at sum 5."
      },
      {
        "input": "9\n2 2 2 1 1 1 1 1 1",
        "output": "2",
        "explanation": "All stacks already sum to 2."
      },
      {
        "input": "6\n1 1 1 5 6 7",
        "output": "0",
        "explanation": "No common sum possible, answer 0."
      }
    ],
    "constraints": [
      "1 <= n1, n2, n3 <= 10^5",
      "1 <= stack element <= 10^4"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "13\n3 3 4 3 2 1 1 4 1 1 2 3 4",
        "expectedOutput": "0"
      },
      {
        "input": "9\n2 2 2 1 1 1 1 1 1",
        "expectedOutput": "2"
      },
      {
        "input": "6\n1 1 1 5 6 7",
        "expectedOutput": "0"
      },
      {
        "input": "15\n4 4 4 1 2 3 4 1 2 3 4 1 2 3 4",
        "expectedOutput": "10"
      },
      {
        "input": "9\n3 2 1 2 2 2 3 3 4",
        "expectedOutput": "0"
      },
      {
        "input": "13\n5 3 2 1 1 1 1 1 2 2 2 3 3",
        "expectedOutput": "0"
      },
      {
        "input": "12\n2 3 4 10 20 5 5 5 1 1 1 1",
        "expectedOutput": "0"
      },
      {
        "input": "9\n1 2 3 7 3 4 1 2 3",
        "expectedOutput": "0"
      },
      {
        "input": "12\n3 3 3 5 5 5 5 5 5 5 5 5",
        "expectedOutput": "15"
      },
      {
        "input": "9\n4 1 1 1 2 3 4 10 10",
        "expectedOutput": "10"
      },
      {
        "input": "10\n2 2 3 4 4 4 4 4 4 4",
        "expectedOutput": "8"
      },
      {
        "input": "21\n6 6 6 1 2 3 4 5 6 6 5 4 3 2 1 2 2 2 2 2 2",
        "expectedOutput": "6"
      }
    ]
  },
  {
    "id": "job-sequencing-problem",
    "hints": ["High-profit jobs deserve priority, but a job only earns its profit if it lands in a free time slot on or before its deadline.","Sort jobs by profit descending and schedule each one at the latest still-free slot at or before its deadline."],
    "returns": "int",
    "title": "Job Sequencing Problem",
    "difficulty": "medium",
    "topic": "greedy",
    "companies": [
      "Microsoft",
      "Amazon"
    ],
    "description": "Given n jobs with deadlines and profits, schedule jobs to maximize profit where each job takes one unit of time and only one job runs at a time. Input format: first line n, then n lines each with deadline and profit.",
    "examples": [
      {
        "input": "4\n4 20\n1 10\n1 40\n1 30",
        "output": "60",
        "explanation": "Schedule job 3 (profit 40) at time 1 and job 1 (profit 20) at time 4. Total 60."
      },
      {
        "input": "5\n2 100\n1 19\n2 27\n1 25\n3 15",
        "output": "142",
        "explanation": "Jobs with profit 100, 27 and 15 fit. Total 142."
      },
      {
        "input": "1\n1 50",
        "output": "50",
        "explanation": "Single job gives profit 50."
      }
    ],
    "constraints": [
      "1 <= n <= 10^5",
      "1 <= deadline <= n",
      "1 <= profit <= 10^4"
    ],
    "io": "intervals",
    "testCases": [
      {
        "input": "4\n4 20\n1 10\n1 40\n1 30",
        "expectedOutput": "60"
      },
      {
        "input": "5\n2 100\n1 19\n2 27\n1 25\n3 15",
        "expectedOutput": "142"
      },
      {
        "input": "1\n1 50",
        "expectedOutput": "50"
      },
      {
        "input": "3\n3 30\n3 20\n3 10",
        "expectedOutput": "60"
      },
      {
        "input": "4\n2 50\n2 60\n1 20\n1 30",
        "expectedOutput": "110"
      },
      {
        "input": "5\n5 10\n5 20\n5 30\n5 40\n5 50",
        "expectedOutput": "150"
      },
      {
        "input": "3\n1 10\n2 20\n3 30",
        "expectedOutput": "60"
      },
      {
        "input": "7\n4 70\n2 60\n4 50\n3 40\n1 30\n4 20\n6 10",
        "expectedOutput": "230"
      },
      {
        "input": "3\n1 5\n1 5\n1 5",
        "expectedOutput": "5"
      },
      {
        "input": "4\n2 40\n2 30\n2 20\n2 10",
        "expectedOutput": "70"
      },
      {
        "input": "3\n3 15\n1 10\n2 5",
        "expectedOutput": "30"
      },
      {
        "input": "4\n7 100\n7 90\n7 80\n7 70",
        "expectedOutput": "340"
      }
    ]
  },
  {
    "id": "egyptian-fraction",
    "hints": ["Peel the fraction apart one unit fraction at a time: repeatedly subtract the largest unit fraction that does not exceed the remainder.","At each step use denominator ceil(dr/nr), subtract 1/denominator, reduce the fraction, and repeat until the remainder is itself a unit fraction."],
    "returns": "string",
    "title": "Egyptian Fraction",
    "difficulty": "medium",
    "topic": "greedy",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Given a fraction nr/dr, represent it as a sum of distinct unit fractions using the greedy method. Return the representation as a string like 1/2 + 1/3. Input format: first line 2, second line nr dr.",
    "examples": [
      {
        "input": "2\n6 14",
        "output": "1/3 + 1/11 + 1/231",
        "explanation": "6/14 reduces to 3/7 = 1/3 + 1/11 + 1/231."
      },
      {
        "input": "2\n2 3",
        "output": "1/2 + 1/6",
        "explanation": "2/3 = 1/2 + 1/6."
      },
      {
        "input": "2\n1 2",
        "output": "1/2",
        "explanation": "1/2 is already a unit fraction."
      }
    ],
    "constraints": [
      "1 <= nr < dr <= 10^4",
      "Fraction is in lowest terms"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "2\n6 14",
        "expectedOutput": "1/3 + 1/11 + 1/231"
      },
      {
        "input": "2\n2 3",
        "expectedOutput": "1/2 + 1/6"
      },
      {
        "input": "2\n1 2",
        "expectedOutput": "1/2"
      },
      {
        "input": "2\n12 13",
        "expectedOutput": "1/2 + 1/3 + 1/12 + 1/156"
      },
      {
        "input": "2\n3 4",
        "expectedOutput": "1/2 + 1/4"
      },
      {
        "input": "2\n4 5",
        "expectedOutput": "1/2 + 1/4 + 1/20"
      },
      {
        "input": "2\n5 6",
        "expectedOutput": "1/2 + 1/3"
      },
      {
        "input": "2\n2 5",
        "expectedOutput": "1/3 + 1/15"
      },
      {
        "input": "2\n7 15",
        "expectedOutput": "1/3 + 1/8 + 1/120"
      },
      {
        "input": "2\n1 7",
        "expectedOutput": "1/7"
      },
      {
        "input": "2\n3 7",
        "expectedOutput": "1/3 + 1/11 + 1/231"
      },
      {
        "input": "2\n9 10",
        "expectedOutput": "1/2 + 1/3 + 1/15"
      }
    ]
  },
  {
    "id": "fractional-knapsack",
    "hints": ["Because fractions are allowed, every unit of capacity should go to whatever gives the most value per unit weight; there is never a reason to save space for a worse ratio.","Sort items by value-to-weight ratio descending, fill the knapsack greedily, and take a fraction of the first item that overflows the remaining capacity."],
    "returns": "string",
    "title": "Fractional Knapsack Problem",
    "difficulty": "medium",
    "topic": "greedy",
    "companies": [
      "Microsoft",
      "Amazon"
    ],
    "description": "Given n items with values and weights and a knapsack capacity W, take fractions of items to maximize total value. Return the maximum value rounded to 2 decimals. Input format: first line is the total count, second line starts with n and W, followed by n values and then n weights.",
    "examples": [
      {
        "input": "8\n3 50 60 100 120 10 20 30",
        "output": "240.00",
        "explanation": "Ratios 6, 5, 4. Take all of first two and 2/3 of third: 240.00."
      },
      {
        "input": "6\n2 50 60 100 10 20",
        "output": "160.00",
        "explanation": "Take all of item 2 and all of item 1: 160.00."
      },
      {
        "input": "4\n1 10 500 30",
        "output": "166.67",
        "explanation": "Only a fraction 10/30 fits: 166.67."
      }
    ],
    "constraints": [
      "1 <= n <= 10^5",
      "1 <= W <= 10^5",
      "1 <= value, weight <= 10^4"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "8\n3 50 60 100 120 10 20 30",
        "expectedOutput": "240.00"
      },
      {
        "input": "6\n2 50 60 100 10 20",
        "expectedOutput": "160.00"
      },
      {
        "input": "4\n1 10 500 30",
        "expectedOutput": "166.67"
      },
      {
        "input": "10\n4 60 100 280 120 100 10 40 20 24",
        "expectedOutput": "440.00"
      },
      {
        "input": "8\n3 15 10 20 30 5 10 15",
        "expectedOutput": "30.00"
      },
      {
        "input": "6\n2 5 10 20 5 5",
        "expectedOutput": "20.00"
      },
      {
        "input": "12\n5 100 20 30 40 50 60 10 20 30 40 50",
        "expectedOutput": "140.00"
      },
      {
        "input": "8\n3 7 14 21 28 2 3 4",
        "expectedOutput": "49.00"
      },
      {
        "input": "10\n4 10 5 10 15 7 3 5 9 12",
        "expectedOutput": "18.33"
      },
      {
        "input": "6\n2 100 100 200 50 50",
        "expectedOutput": "300.00"
      },
      {
        "input": "8\n3 90 60 100 120 10 20 30",
        "expectedOutput": "280.00"
      },
      {
        "input": "4\n1 5 10 10",
        "expectedOutput": "5.00"
      }
    ]
  },
  {
    "id": "maximum-length-chain-of-pairs",
    "hints": ["A chain that ends earlier leaves more room for later pairs, so prefer the pair that finishes first when you have a choice.","Sort pairs by their second element ascending and greedily extend the chain whenever the next pair's start is greater than the current chain's end."],
    "returns": "int",
    "title": "Maximum Length Chain of Pairs",
    "difficulty": "medium",
    "topic": "greedy",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Given n pairs, a pair (c, d) can follow (a, b) if b < c. Find the length of the longest chain. Input format: first line n, then n lines each with two integers.",
    "examples": [
      {
        "input": "5\n5 24\n39 60\n15 28\n27 40\n50 90",
        "output": "3",
        "explanation": "Chain [5,24] -> [27,40] -> [50,90] has length 3."
      },
      {
        "input": "3\n1 2\n3 4\n5 6",
        "output": "3",
        "explanation": "All three pairs chain in order."
      },
      {
        "input": "1\n1 2",
        "output": "1",
        "explanation": "A single pair has chain length 1."
      }
    ],
    "constraints": [
      "1 <= n <= 10^5",
      "-10^9 <= a < b <= 10^9"
    ],
    "io": "intervals",
    "testCases": [
      {
        "input": "5\n5 24\n39 60\n15 28\n27 40\n50 90",
        "expectedOutput": "3"
      },
      {
        "input": "3\n1 2\n3 4\n5 6",
        "expectedOutput": "3"
      },
      {
        "input": "1\n1 2",
        "expectedOutput": "1"
      },
      {
        "input": "4\n1 10\n2 3\n4 5\n6 7",
        "expectedOutput": "3"
      },
      {
        "input": "3\n3 4\n1 2\n2 3",
        "expectedOutput": "2"
      },
      {
        "input": "3\n10 20\n20 30\n30 40",
        "expectedOutput": "2"
      },
      {
        "input": "4\n5 6\n1 2\n3 4\n7 8",
        "expectedOutput": "4"
      },
      {
        "input": "4\n1 5\n6 10\n11 15\n2 7",
        "expectedOutput": "3"
      },
      {
        "input": "4\n8 9\n1 3\n4 6\n2 5",
        "expectedOutput": "3"
      },
      {
        "input": "1\n1 100",
        "expectedOutput": "1"
      },
      {
        "input": "5\n2 5\n5 8\n8 11\n11 14\n1 3",
        "expectedOutput": "3"
      },
      {
        "input": "4\n4 5\n4 6\n6 7\n7 8",
        "expectedOutput": "2"
      }
    ]
  },
  {
    "id": "smallest-number-with-digits-and-sum",
    "hints": ["To make the number smallest, push the big digits as far right as possible while keeping the leftmost digit non-zero.","Reserve at least 1 for the most significant digit, then greedily fill the remaining positions from right to left with the largest digits that fit."],
    "returns": "string",
    "title": "Smallest Number with Given Digits and Digit Sum",
    "difficulty": "medium",
    "topic": "greedy",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Find the smallest number with exactly m digits whose digits sum to s. Return -1 if impossible. Input format: first line 2, second line m s.",
    "examples": [
      {
        "input": "2\n2 9",
        "output": "18",
        "explanation": "Smallest 2-digit number with digit sum 9 is 18."
      },
      {
        "input": "2\n3 20",
        "output": "299",
        "explanation": "Smallest 3-digit number with digit sum 20 is 299."
      },
      {
        "input": "2\n1 0",
        "output": "0",
        "explanation": "Single digit 0 is valid."
      }
    ],
    "constraints": [
      "1 <= m <= 10^5",
      "0 <= s <= 9*m"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "2\n2 9",
        "expectedOutput": "18"
      },
      {
        "input": "2\n3 20",
        "expectedOutput": "299"
      },
      {
        "input": "2\n1 0",
        "expectedOutput": "0"
      },
      {
        "input": "2\n2 0",
        "expectedOutput": "-1"
      },
      {
        "input": "2\n2 18",
        "expectedOutput": "99"
      },
      {
        "input": "2\n2 19",
        "expectedOutput": "-1"
      },
      {
        "input": "2\n4 1",
        "expectedOutput": "1000"
      },
      {
        "input": "2\n3 27",
        "expectedOutput": "999"
      },
      {
        "input": "2\n5 43",
        "expectedOutput": "79999"
      },
      {
        "input": "2\n1 5",
        "expectedOutput": "5"
      },
      {
        "input": "2\n3 1",
        "expectedOutput": "100"
      },
      {
        "input": "2\n4 35",
        "expectedOutput": "8999"
      }
    ]
  },
  {
    "id": "maximize-sum-consecutive-differences",
    "hints": ["Big differences come from placing extremes next to each other, so alternate between the smallest and largest remaining elements around the circle.","Sort the array and use two pointers from both ends to interleave small and large values, maximizing adjacent gaps."],
    "returns": "int",
    "title": "Maximize Sum of Consecutive Differences",
    "difficulty": "medium",
    "topic": "greedy",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Given an array, rearrange it in circular order to maximize the sum of absolute differences of consecutive elements, and return that maximum sum. Input format: first line n, second line the array.",
    "examples": [
      {
        "input": "4\n1 2 3 4",
        "output": "8",
        "explanation": "Best circular arrangement gives sum 8."
      },
      {
        "input": "4\n4 1 2 3",
        "output": "8",
        "explanation": "Best circular arrangement gives sum 8."
      },
      {
        "input": "3\n1 1 1",
        "output": "0",
        "explanation": "All equal, sum is 0."
      }
    ],
    "constraints": [
      "2 <= n <= 10^5",
      "1 <= arr[i] <= 10^9"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "4\n1 2 3 4",
        "expectedOutput": "8"
      },
      {
        "input": "4\n4 1 2 3",
        "expectedOutput": "8"
      },
      {
        "input": "3\n1 1 1",
        "expectedOutput": "0"
      },
      {
        "input": "5\n10 20 30 40 50",
        "expectedOutput": "120"
      },
      {
        "input": "4\n5 5 5 5",
        "expectedOutput": "0"
      },
      {
        "input": "6\n1 3 5 7 9 11",
        "expectedOutput": "36"
      },
      {
        "input": "2\n2 1",
        "expectedOutput": "2"
      },
      {
        "input": "5\n7 3 9 1 5",
        "expectedOutput": "24"
      },
      {
        "input": "4\n100 1 100 1",
        "expectedOutput": "396"
      },
      {
        "input": "5\n6 2 8 4 10",
        "expectedOutput": "24"
      },
      {
        "input": "7\n1 2 3 4 5 6 7",
        "expectedOutput": "24"
      },
      {
        "input": "5\n9 8 7 6 5",
        "expectedOutput": "12"
      }
    ]
  },
  {
    "id": "lexicographically-smallest-k-swaps",
    "hints": ["Fix the answer left to right: at each position, pull in the smallest element you can reach with the swaps you have left.","Scan left to right, find the minimum in the window of up to k+1 elements ahead, shift it to the current position with adjacent swaps, and reduce k accordingly."],
    "returns": "intArr",
    "title": "Lexicographically Smallest Array with K Swaps",
    "difficulty": "medium",
    "topic": "greedy",
    "companies": [
      "Amazon",
      "Google"
    ],
    "description": "Given an array and k, perform at most k adjacent swaps to get the lexicographically smallest array. Return the resulting array. Input format: first line n, second line the array, third line k.",
    "examples": [
      {
        "input": "3\n3 1 2\n1",
        "output": "1 3 2",
        "explanation": "One swap gives 1 3 2."
      },
      {
        "input": "5\n5 4 3 2 1\n3",
        "output": "2 5 4 3 1",
        "explanation": "Three swaps give 2 3 4 5 1."
      },
      {
        "input": "3\n1 2 3\n0",
        "output": "1 2 3",
        "explanation": "No swaps allowed, array unchanged."
      }
    ],
    "constraints": [
      "1 <= n <= 10^5",
      "1 <= arr[i] <= 10^9",
      "0 <= k <= 10^9"
    ],
    "io": "array-k",
    "testCases": [
      {
        "input": "3\n3 1 2\n1",
        "expectedOutput": "1 3 2"
      },
      {
        "input": "5\n5 4 3 2 1\n3",
        "expectedOutput": "2 5 4 3 1"
      },
      {
        "input": "3\n1 2 3\n0",
        "expectedOutput": "1 2 3"
      },
      {
        "input": "4\n4 3 2 1\n10",
        "expectedOutput": "1 2 3 4"
      },
      {
        "input": "4\n2 1 4 3\n2",
        "expectedOutput": "1 2 3 4"
      },
      {
        "input": "1\n1\n5",
        "expectedOutput": "1"
      },
      {
        "input": "3\n3 3 3\n2",
        "expectedOutput": "3 3 3"
      },
      {
        "input": "7\n7 6 5 4 3 2 1\n4",
        "expectedOutput": "3 7 6 5 4 2 1"
      },
      {
        "input": "5\n1 5 2 4 3\n2",
        "expectedOutput": "1 2 4 5 3"
      },
      {
        "input": "3\n9 8 7\n1",
        "expectedOutput": "8 9 7"
      },
      {
        "input": "3\n2 3 1\n2",
        "expectedOutput": "1 2 3"
      },
      {
        "input": "5\n5 1 4 2 3\n5",
        "expectedOutput": "1 2 3 5 4"
      }
    ]
  },
  {
    "id": "chocola-cutting-board",
    "hints": ["An expensive cut should happen early, while the board is still in few pieces, so its cost is multiplied as few times as possible.","Sort all horizontal and vertical cuts by cost descending and always perform the costliest remaining cut, multiplying it by the current piece count along the perpendicular axis."],
    "returns": "int",
    "title": "CHOCOLA - Cutting Board into Squares",
    "difficulty": "hard",
    "topic": "greedy",
    "companies": [
      "Amazon",
      "Flipkart"
    ],
    "description": "Given costs of horizontal and vertical cuts, find the minimum cost to cut a board into 1x1 squares. Each cut spans the whole current board. Input format: first line is the total count, second line starts with nh and nv, followed by nh horizontal cut costs and nv vertical cut costs.",
    "examples": [
      {
        "input": "8\n3 2 2 1 3 1 1 1",
        "output": "14",
        "explanation": "Minimum cost is 12."
      },
      {
        "input": "6\n2 2 4 1 2 1",
        "output": "13",
        "explanation": "Minimum cost is 11."
      },
      {
        "input": "4\n1 1 5 5",
        "output": "15",
        "explanation": "One horizontal and one vertical cut cost 5 + 5 = 10."
      }
    ],
    "constraints": [
      "1 <= nh, nv <= 10^5",
      "1 <= cut cost <= 10^4"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "8\n3 2 2 1 3 1 1 1",
        "expectedOutput": "14"
      },
      {
        "input": "6\n2 2 4 1 2 1",
        "expectedOutput": "13"
      },
      {
        "input": "4\n1 1 5 5",
        "expectedOutput": "15"
      },
      {
        "input": "9\n4 3 3 2 1 4 5 2 3",
        "expectedOutput": "46"
      },
      {
        "input": "7\n2 3 1 2 3 2 1",
        "expectedOutput": "17"
      },
      {
        "input": "8\n5 1 1 2 3 4 5 10",
        "expectedOutput": "40"
      },
      {
        "input": "7\n1 4 7 1 2 3 4",
        "expectedOutput": "27"
      },
      {
        "input": "8\n3 3 6 5 4 3 2 1",
        "expectedOutput": "39"
      },
      {
        "input": "5\n2 1 10 20 30",
        "expectedOutput": "90"
      },
      {
        "input": "10\n4 4 1 1 1 1 1 1 1 1",
        "expectedOutput": "24"
      },
      {
        "input": "7\n3 2 5 5 5 4 4",
        "expectedOutput": "47"
      },
      {
        "input": "10\n6 2 2 4 6 8 10 12 1 3",
        "expectedOutput": "69"
      }
    ]
  },
  {
    "id": "minimum-time-to-finish-jobs",
    "hints": ["The longest jobs constrain the answer the most, so place them first when workers are still idle; short jobs fill the gaps later.","Use the longest-processing-time rule: sort durations descending and assign each job to the currently least-loaded worker, tracked with a min-heap."],
    "returns": "int",
    "title": "Minimum Time to Finish All Jobs",
    "difficulty": "medium",
    "topic": "greedy",
    "companies": [
      "Google",
      "Amazon"
    ],
    "description": "Given n jobs with durations and k workers, assign jobs to minimize the maximum load on any worker using the greedy longest-processing-time rule. Return that minimum possible maximum load. Input format: first line n, second line durations, third line k.",
    "examples": [
      {
        "input": "3\n3 2 2\n2",
        "output": "4",
        "explanation": "Jobs 3 | 2,2 give max load 4."
      },
      {
        "input": "5\n1 2 3 4 5\n2",
        "output": "8",
        "explanation": "Jobs 5,2 | 4,3,1 give max load 8."
      },
      {
        "input": "4\n10 10 10 10\n4",
        "output": "10",
        "explanation": "Each worker gets one job, max load 10."
      }
    ],
    "constraints": [
      "1 <= n <= 10^5",
      "1 <= duration <= 10^4",
      "1 <= k <= n"
    ],
    "io": "array-k",
    "testCases": [
      {
        "input": "3\n3 2 2\n2",
        "expectedOutput": "4"
      },
      {
        "input": "5\n1 2 3 4 5\n2",
        "expectedOutput": "8"
      },
      {
        "input": "4\n10 10 10 10\n4",
        "expectedOutput": "10"
      },
      {
        "input": "2\n7 3\n1",
        "expectedOutput": "10"
      },
      {
        "input": "5\n5 5 5 5 5\n3",
        "expectedOutput": "10"
      },
      {
        "input": "4\n8 4 3 2\n2",
        "expectedOutput": "9"
      },
      {
        "input": "1\n1\n5",
        "expectedOutput": "1"
      },
      {
        "input": "6\n6 6 6 6 6 6\n2",
        "expectedOutput": "18"
      },
      {
        "input": "5\n9 7 5 3 1\n3",
        "expectedOutput": "9"
      },
      {
        "input": "4\n4 4 4 4\n2",
        "expectedOutput": "8"
      },
      {
        "input": "4\n2 8 4 6\n3",
        "expectedOutput": "8"
      },
      {
        "input": "3\n11 22 33\n2",
        "expectedOutput": "33"
      }
    ]
  },
  {
    "id": "job-sequencing-using-dsu",
    "hints": ["Process jobs in decreasing profit and give each the best available slot at or before its deadline, just like classic job sequencing.","Use a disjoint-set union structure to jump each job straight to the largest free slot at or before its deadline, unioning a slot with its predecessor once filled."],
    "returns": "int",
    "title": "Job Sequencing using Disjoint Set Union",
    "difficulty": "medium",
    "topic": "greedy",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Given n jobs with deadlines and profits, schedule jobs to maximize profit where each job takes one unit of time. Input format: first line n, then n lines each with deadline and profit.",
    "examples": [
      {
        "input": "4\n2 50\n1 20\n2 30\n3 40",
        "output": "120",
        "explanation": "Best schedule gives profit 120."
      },
      {
        "input": "3\n1 100\n2 200\n3 300",
        "output": "600",
        "explanation": "All three jobs fit, profit 600."
      },
      {
        "input": "4\n4 20\n1 10\n1 40\n1 30",
        "output": "60",
        "explanation": "Schedule job 3 then job 1, profit 60."
      }
    ],
    "constraints": [
      "1 <= n <= 10^5",
      "1 <= deadline <= n",
      "1 <= profit <= 10^4"
    ],
    "io": "intervals",
    "testCases": [
      {
        "input": "4\n2 50\n1 20\n2 30\n3 40",
        "expectedOutput": "120"
      },
      {
        "input": "3\n1 100\n2 200\n3 300",
        "expectedOutput": "600"
      },
      {
        "input": "4\n4 20\n1 10\n1 40\n1 30",
        "expectedOutput": "60"
      },
      {
        "input": "5\n2 100\n1 19\n2 27\n1 25\n3 15",
        "expectedOutput": "142"
      },
      {
        "input": "5\n5 5\n5 4\n5 3\n5 2\n5 1",
        "expectedOutput": "15"
      },
      {
        "input": "3\n1 10\n1 20\n1 30",
        "expectedOutput": "30"
      },
      {
        "input": "7\n3 35\n4 30\n4 25\n2 20\n3 15\n1 12\n2 5",
        "expectedOutput": "110"
      },
      {
        "input": "5\n2 60\n1 100\n3 20\n2 40\n1 10",
        "expectedOutput": "180"
      },
      {
        "input": "1\n6 10",
        "expectedOutput": "10"
      },
      {
        "input": "3\n2 15\n2 10\n1 5",
        "expectedOutput": "25"
      },
      {
        "input": "4\n4 40\n2 30\n4 20\n3 10",
        "expectedOutput": "100"
      },
      {
        "input": "4\n3 27\n3 25\n3 23\n3 21",
        "expectedOutput": "75"
      }
    ]
  },
  {
    "id": "rearrange-characters-string",
    "hints": ["First check feasibility: if the most frequent character appears more than (n+1)/2 times, no valid rearrangement exists.","Use a max-heap keyed by remaining count and always place the most abundant character next, as long as it differs from the previous one placed."],
    "returns": "string",
    "title": "Rearrange Characters in String",
    "difficulty": "medium",
    "topic": "greedy",
    "companies": [
      "Google",
      "Amazon"
    ],
    "description": "Given a string, rearrange its characters so that no two adjacent characters are the same. Return any valid rearrangement, or an empty string if impossible. Input is the string on the first line.",
    "examples": [
      {
        "input": "aaabbc",
        "output": "ababac",
        "explanation": "One valid rearrangement is abacaba."
      },
      {
        "input": "aaab",
        "output": "",
        "explanation": "Impossible, return empty string."
      },
      {
        "input": "a",
        "output": "a",
        "explanation": "Single character is trivially valid."
      }
    ],
    "constraints": [
      "1 <= s.length <= 10^5",
      "s contains lowercase English letters"
    ],
    "io": "string",
    "testCases": [
      {
        "input": "aaabbc",
        "expectedOutput": "ababac"
      },
      {
        "input": "aaab",
        "expectedOutput": ""
      },
      {
        "input": "a",
        "expectedOutput": "a"
      },
      {
        "input": "aab",
        "expectedOutput": "aba"
      },
      {
        "input": "aa",
        "expectedOutput": ""
      },
      {
        "input": "abcdef",
        "expectedOutput": "abcdef"
      },
      {
        "input": "aabbcc",
        "expectedOutput": "abcabc"
      },
      {
        "input": "aaabc",
        "expectedOutput": "abaca"
      },
      {
        "input": "zzxyy",
        "expectedOutput": "yzxyz"
      },
      {
        "input": "abcabc",
        "expectedOutput": "abcabc"
      },
      {
        "input": "aaaaabbbbbccccc",
        "expectedOutput": "abcabcabcabcabc"
      },
      {
        "input": "qwerty",
        "expectedOutput": "eqrtwy"
      }
    ]
  },
  {
    "id": "minimize-cash-flow",
    "hints": ["Collapse the matrix into net balances first: each person ends up as either a net creditor or a net debtor with a single amount.","Greedily settle the largest creditor against the largest debtor each round, transferring the smaller of the two amounts (use max-heaps or sorted sets)."],
    "returns": "intMat",
    "title": "Minimize Cash Flow Among Friends",
    "difficulty": "hard",
    "topic": "greedy",
    "companies": [
      "Amazon",
      "Google"
    ],
    "description": "Given an n x n matrix where mat[i][j] is the amount person i owes person j, settle all debts with the minimum number of transactions using the greedy strategy. Return the transactions as rows of debtor creditor amount. Input format: first line is the total count, second line starts with n followed by the n*n matrix values row by row.",
    "examples": [
      {
        "input": "10\n3 0 1000 0 0 0 5000 0 0 0",
        "output": "1 2 4000\n0 2 1000",
        "explanation": "Person 1 pays 4000 to person 2, then person 0 pays 1000 to person 2. Two transactions settle everyone."
      },
      {
        "input": "10\n3 0 0 100 0 0 0 0 0 0",
        "output": "0 2 100",
        "explanation": "Person 0 pays 100 to person 2 in a single transaction."
      },
      {
        "input": "5\n2 0 50 0 0",
        "output": "0 1 50",
        "explanation": "Person 0 pays 50 to person 1 in a single transaction."
      }
    ],
    "constraints": [
      "1 <= n <= 10^3",
      "0 <= mat[i][j] <= 10^4"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "10\n3 0 1000 0 0 0 5000 0 0 0",
        "expectedOutput": "1 2 4000\n0 2 1000"
      },
      {
        "input": "10\n3 0 0 100 0 0 0 0 0 0",
        "expectedOutput": "0 2 100"
      },
      {
        "input": "5\n2 0 50 0 0",
        "expectedOutput": "0 1 50"
      },
      {
        "input": "17\n4 0 100 0 0 0 0 200 0 0 0 0 300 0 0 0 0",
        "expectedOutput": "0 3 100\n1 3 100\n2 3 100"
      },
      {
        "input": "10\n3 0 0 0 0 0 0 0 0 0",
        "expectedOutput": ""
      },
      {
        "input": "5\n2 0 0 0 0",
        "expectedOutput": ""
      },
      {
        "input": "10\n3 0 500 200 0 0 300 0 0 0",
        "expectedOutput": "0 2 500\n0 1 200"
      },
      {
        "input": "17\n4 0 0 0 1000 0 0 0 0 0 0 0 0 0 0 0 0",
        "expectedOutput": "0 3 1000"
      },
      {
        "input": "10\n3 0 100 50 0 0 25 0 0 0",
        "expectedOutput": "0 1 75\n0 2 75"
      },
      {
        "input": "26\n5 0 10 0 0 0 0 0 20 0 0 0 0 0 0 0 0 30 0 0 0 0 0 0 0 0",
        "expectedOutput": "3 1 20\n0 2 10\n3 2 10"
      },
      {
        "input": "10\n3 0 0 300 200 0 0 0 0 0",
        "expectedOutput": "1 2 200\n0 2 100"
      },
      {
        "input": "5\n2 0 100 50 0",
        "expectedOutput": "0 1 50"
      }
    ]
  },
  {
    "id": "minimum-cost-to-cut-board",
    "hints": ["Cut the most expensive lines first, while the piece count is smallest, because every later cut multiplies earlier costs.","Sort horizontal and vertical cut costs descending and repeatedly take the costliest remaining cut, scaled by the number of current segments in the perpendicular direction."],
    "returns": "int",
    "title": "Minimum Cost to Cut Board into Squares",
    "difficulty": "hard",
    "topic": "greedy",
    "companies": [
      "Amazon",
      "Google"
    ],
    "description": "Given costs of horizontal and vertical cuts, find the minimum cost to cut a board into 1x1 squares. Each cut spans the whole current board. Input format: first line is the total count, second line starts with nh and nv, followed by nh horizontal cut costs and nv vertical cut costs.",
    "examples": [
      {
        "input": "5\n2 1 3 2 4",
        "output": "14",
        "explanation": "Minimum cost is 11."
      },
      {
        "input": "5\n1 2 1 2 3",
        "output": "8",
        "explanation": "Minimum cost is 11."
      },
      {
        "input": "8\n3 3 1 2 3 4 5 6",
        "output": "39",
        "explanation": "Minimum cost is 34."
      }
    ],
    "constraints": [
      "1 <= nh, nv <= 10^5",
      "1 <= cut cost <= 10^4"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "5\n2 1 3 2 4",
        "expectedOutput": "14"
      },
      {
        "input": "5\n1 2 1 2 3",
        "expectedOutput": "8"
      },
      {
        "input": "8\n3 3 1 2 3 4 5 6",
        "expectedOutput": "39"
      },
      {
        "input": "8\n4 2 2 2 2 2 3 3",
        "expectedOutput": "30"
      },
      {
        "input": "4\n1 1 10 10",
        "expectedOutput": "30"
      },
      {
        "input": "12\n5 5 5 4 3 2 1 1 2 3 4 5",
        "expectedOutput": "85"
      },
      {
        "input": "8\n2 4 8 6 1 3 5 7",
        "expectedOutput": "61"
      },
      {
        "input": "6\n3 1 7 7 7 9",
        "expectedOutput": "51"
      },
      {
        "input": "11\n6 3 1 1 1 1 1 1 2 2 2",
        "expectedOutput": "30"
      },
      {
        "input": "6\n2 2 100 1 100 1",
        "expectedOutput": "305"
      },
      {
        "input": "7\n4 1 4 3 2 1 5",
        "expectedOutput": "25"
      },
      {
        "input": "9\n3 4 2 2 2 1 1 1 1",
        "expectedOutput": "22"
      }
    ]
  },
  {
    "id": "choose-k-minimize-difference",
    "hints": ["After sorting the array, the k elements with the smallest max-min difference must be consecutive in the sorted order, so the problem reduces to examining adjacent groups of size k.","Sort the array, then slide a window of size k across it and track the minimum of arr[i+k-1] - arr[i]; sorting alone orders all candidates, so no heap is needed."],
    "returns": "int",
    "title": "Choose K Elements to Minimize Difference",
    "difficulty": "medium",
    "topic": "heaps",
    "companies": [
      "Amazon",
      "Google"
    ],
    "description": "Given an array, choose k elements so that the difference between the maximum and minimum of the chosen elements is minimized. Return that minimum difference. Input format: first line n, second line the array, third line k.",
    "examples": [
      {
        "input": "6\n1 5 3 2 8 7\n3",
        "output": "2",
        "explanation": "Sorted: pick 1,2,3 with difference 2."
      },
      {
        "input": "4\n10 20 30 100\n2",
        "output": "10",
        "explanation": "Pick 10, 20 with difference 10."
      },
      {
        "input": "4\n5 5 5 5\n4",
        "output": "0",
        "explanation": "All equal, difference 0."
      }
    ],
    "constraints": [
      "1 <= k <= n <= 10^5",
      "0 <= arr[i] <= 10^9"
    ],
    "io": "array-k",
    "testCases": [
      {
        "input": "6\n1 5 3 2 8 7\n3",
        "expectedOutput": "2"
      },
      {
        "input": "4\n10 20 30 100\n2",
        "expectedOutput": "10"
      },
      {
        "input": "4\n5 5 5 5\n4",
        "expectedOutput": "0"
      },
      {
        "input": "5\n1 100 101 102 200\n3",
        "expectedOutput": "2"
      },
      {
        "input": "1\n7\n1",
        "expectedOutput": "0"
      },
      {
        "input": "7\n9 4 1 7 3 8 2\n4",
        "expectedOutput": "3"
      },
      {
        "input": "10\n1 2 3 4 5 6 7 8 9 10\n5",
        "expectedOutput": "4"
      },
      {
        "input": "5\n50 10 40 20 30\n2",
        "expectedOutput": "10"
      },
      {
        "input": "8\n3 1 4 1 5 9 2 6\n6",
        "expectedOutput": "4"
      },
      {
        "input": "2\n100 200\n2",
        "expectedOutput": "100"
      },
      {
        "input": "5\n15 25 10 30 20\n3",
        "expectedOutput": "10"
      },
      {
        "input": "5\n1 3 6 10 15\n2",
        "expectedOutput": "2"
      }
    ]
  },
  {
    "id": "heap-sort",
    "hints": ["Treat the array itself as a binary heap so you can sort in place: first arrange all elements to satisfy the heap property, then repeatedly move the extreme element to its final position.","Build a max-heap bottom-up with heapify in O(n) time, then swap the root with the last unplaced element and re-heapify the shrinking prefix, repeating until the array is sorted ascending."],
    "returns": "intArr",
    "title": "Heap Sort",
    "difficulty": "medium",
    "topic": "heaps",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Given an array, sort it in ascending order. Input format: first line n, second line the array.",
    "examples": [
      {
        "input": "5\n4 10 3 5 1",
        "output": "1 3 4 5 10",
        "explanation": "Sorted array is 1 3 4 5 10."
      },
      {
        "input": "3\n1 2 3",
        "output": "1 2 3",
        "explanation": "Already sorted."
      },
      {
        "input": "3\n3 2 1",
        "output": "1 2 3",
        "explanation": "Reversed to 1 2 3."
      }
    ],
    "constraints": [
      "1 <= n <= 10^5",
      "-10^9 <= arr[i] <= 10^9"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "5\n4 10 3 5 1",
        "expectedOutput": "1 3 4 5 10"
      },
      {
        "input": "3\n1 2 3",
        "expectedOutput": "1 2 3"
      },
      {
        "input": "3\n3 2 1",
        "expectedOutput": "1 2 3"
      },
      {
        "input": "1\n5",
        "expectedOutput": "5"
      },
      {
        "input": "5\n2 2 2 1 1",
        "expectedOutput": "1 1 2 2 2"
      },
      {
        "input": "4\n-1 -5 3 0",
        "expectedOutput": "-5 -1 0 3"
      },
      {
        "input": "10\n10 9 8 7 6 5 4 3 2 1",
        "expectedOutput": "1 2 3 4 5 6 7 8 9 10"
      },
      {
        "input": "5\n1 3 2 5 4",
        "expectedOutput": "1 2 3 4 5"
      },
      {
        "input": "4\n100 50 75 25",
        "expectedOutput": "25 50 75 100"
      },
      {
        "input": "3\n7 7 7",
        "expectedOutput": "7 7 7"
      },
      {
        "input": "6\n12 11 13 5 6 7",
        "expectedOutput": "5 6 7 11 12 13"
      },
      {
        "input": "4\n0 -1 -2 5",
        "expectedOutput": "-2 -1 0 5"
      }
    ]
  },
  {
    "id": "top-k-frequent-elements",
    "hints": ["Count frequencies first, then keep only the k best candidates instead of sorting every distinct element.","Push (frequency, value) pairs into a min-heap capped at size k with a custom comparator that evicts the lowest frequency, breaking ties toward the smaller value, so the heap always holds the current top k."],
    "returns": "intArr",
    "title": "Top K Frequent Elements",
    "difficulty": "medium",
    "topic": "heaps",
    "companies": [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    "description": "Given an array and k, return the k most frequent elements. Ties are broken by smaller value first. Input format: first line n, second line the array, third line k.",
    "examples": [
      {
        "input": "6\n1 1 1 2 2 3\n2",
        "output": "1 2",
        "explanation": "1 appears 3 times, 2 appears 2 times."
      },
      {
        "input": "1\n1\n1",
        "output": "1",
        "explanation": "Only one element."
      },
      {
        "input": "6\n4 4 4 5 5 6\n3",
        "output": "4 5 6",
        "explanation": "Frequencies 3, 2, 1 give 4 5 6."
      }
    ],
    "constraints": [
      "1 <= k <= n <= 10^5",
      "-10^4 <= arr[i] <= 10^4"
    ],
    "io": "array-k",
    "testCases": [
      {
        "input": "6\n1 1 1 2 2 3\n2",
        "expectedOutput": "1 2"
      },
      {
        "input": "1\n1\n1",
        "expectedOutput": "1"
      },
      {
        "input": "6\n4 4 4 5 5 6\n3",
        "expectedOutput": "4 5 6"
      },
      {
        "input": "5\n1 2 3 4 5\n2",
        "expectedOutput": "1 2"
      },
      {
        "input": "8\n3 3 3 2 2 1 1 1\n2",
        "expectedOutput": "1 3"
      },
      {
        "input": "5\n5 5 4 4 3\n1",
        "expectedOutput": "4"
      },
      {
        "input": "4\n7 7 7 7\n1",
        "expectedOutput": "7"
      },
      {
        "input": "7\n1 1 2 2 3 3 4\n3",
        "expectedOutput": "1 2 3"
      },
      {
        "input": "6\n10 20 10 30 20 10\n2",
        "expectedOutput": "10 20"
      },
      {
        "input": "6\n2 2 3 3 3 1\n3",
        "expectedOutput": "3 2 1"
      },
      {
        "input": "6\n9 8 7 9 8 9\n1",
        "expectedOutput": "9"
      },
      {
        "input": "10\n1 2 2 3 3 3 4 4 4 4\n2",
        "expectedOutput": "4 3"
      }
    ]
  },
  {
    "id": "next-greater-element",
    "hints": ["Scan from right to left while maintaining the candidates that could still serve as an answer for earlier elements, discarding any that the current element blocks.","Use a monotonic decreasing stack: pop while the stack top is less than or equal to the current element, then the new top (or -1 if the stack is empty) is its next greater element, and push the current element."],
    "returns": "intArr",
    "title": "Next Greater Element",
    "difficulty": "medium",
    "topic": "heaps",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Given an array, for each element find the next greater element to its right, or -1 if none exists. Input format: first line n, second line the array.",
    "examples": [
      {
        "input": "4\n4 5 2 25",
        "output": "5 25 25 -1",
        "explanation": "Next greater of 4 is 5, of 5 is 25, of 2 is 25, of 25 none."
      },
      {
        "input": "4\n1 2 3 4",
        "output": "2 3 4 -1",
        "explanation": "Each element's next greater is the following one."
      },
      {
        "input": "4\n4 3 2 1",
        "output": "-1 -1 -1 -1",
        "explanation": "No greater elements exist."
      }
    ],
    "constraints": [
      "1 <= n <= 10^5",
      "-10^9 <= arr[i] <= 10^9"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "4\n4 5 2 25",
        "expectedOutput": "5 25 25 -1"
      },
      {
        "input": "4\n1 2 3 4",
        "expectedOutput": "2 3 4 -1"
      },
      {
        "input": "4\n4 3 2 1",
        "expectedOutput": "-1 -1 -1 -1"
      },
      {
        "input": "1\n5",
        "expectedOutput": "-1"
      },
      {
        "input": "3\n2 2 2",
        "expectedOutput": "-1 -1 -1"
      },
      {
        "input": "4\n13 7 6 12",
        "expectedOutput": "-1 12 12 -1"
      },
      {
        "input": "4\n1 3 2 4",
        "expectedOutput": "3 4 4 -1"
      },
      {
        "input": "5\n6 8 0 1 3",
        "expectedOutput": "8 -1 1 3 -1"
      },
      {
        "input": "4\n10 9 8 11",
        "expectedOutput": "11 11 11 -1"
      },
      {
        "input": "5\n3 1 4 1 5",
        "expectedOutput": "4 4 5 5 -1"
      },
      {
        "input": "5\n5 4 3 2 6",
        "expectedOutput": "6 6 6 6 -1"
      },
      {
        "input": "7\n2 7 3 5 4 6 8",
        "expectedOutput": "7 8 5 6 6 8 -1"
      }
    ]
  },
  {
    "id": "kth-smallest-element-heap",
    "hints": ["You only need to know the k smallest values seen so far, and the largest of those is exactly the kth smallest overall.","Maintain a max-heap of size k: push each element and pop the top whenever the heap grows past k; after one pass the heap top is the kth smallest."],
    "returns": "int",
    "title": "Kth Smallest Element in Unsorted Array",
    "difficulty": "medium",
    "topic": "heaps",
    "companies": [
      "Amazon",
      "Microsoft",
      "Walmart"
    ],
    "description": "Given an unsorted array and k, return the kth smallest element. Input format: first line n, second line the array, third line k.",
    "examples": [
      {
        "input": "6\n7 10 4 3 20 15\n3",
        "output": "7",
        "explanation": "Sorted: 3,4,7,10,15,20. 3rd smallest is 7."
      },
      {
        "input": "6\n7 10 4 3 20 15\n4",
        "output": "10",
        "explanation": "4th smallest is 10."
      },
      {
        "input": "1\n1\n1",
        "output": "1",
        "explanation": "Only one element."
      }
    ],
    "constraints": [
      "1 <= k <= n <= 10^5",
      "-10^9 <= arr[i] <= 10^9"
    ],
    "io": "array-k",
    "testCases": [
      {
        "input": "6\n7 10 4 3 20 15\n3",
        "expectedOutput": "7"
      },
      {
        "input": "6\n7 10 4 3 20 15\n4",
        "expectedOutput": "10"
      },
      {
        "input": "1\n1\n1",
        "expectedOutput": "1"
      },
      {
        "input": "5\n5 4 3 2 1\n1",
        "expectedOutput": "1"
      },
      {
        "input": "5\n5 4 3 2 1\n5",
        "expectedOutput": "5"
      },
      {
        "input": "4\n3 3 3 3\n2",
        "expectedOutput": "3"
      },
      {
        "input": "5\n12 3 5 7 19\n2",
        "expectedOutput": "5"
      },
      {
        "input": "4\n-1 -5 0 10\n3",
        "expectedOutput": "0"
      },
      {
        "input": "5\n100 90 80 70 60\n4",
        "expectedOutput": "90"
      },
      {
        "input": "2\n2 1\n2",
        "expectedOutput": "2"
      },
      {
        "input": "7\n8 6 7 5 3 0 9\n6",
        "expectedOutput": "8"
      },
      {
        "input": "4\n15 25 35 45\n3",
        "expectedOutput": "35"
      }
    ]
  },
  {
    "id": "maximum-repeating-number",
    "hints": ["Because every element lies in the range 0 to n-1, you can count frequencies in O(n) time with O(n) space instead of a generic sort.","Build a frequency array (or use the in-place add-n-and-modulo trick) and scan it once, keeping the index with the highest count and preferring the smaller index on ties."],
    "returns": "int",
    "title": "Maximum Repeating Number",
    "difficulty": "easy",
    "topic": "heaps",
    "companies": [
      "Amazon",
      "D-E-Shaw"
    ],
    "description": "Given an array where elements are in range 0 to n-1, find the element with maximum frequency. If tied, return the smallest. Input format: first line n, second line the array.",
    "examples": [
      {
        "input": "7\n2 2 1 1 1 2 2",
        "output": "2",
        "explanation": "2 appears 4 times, the most."
      },
      {
        "input": "4\n0 0 0 1",
        "output": "0",
        "explanation": "0 appears 3 times."
      },
      {
        "input": "3\n3 1 2",
        "output": "1",
        "explanation": "All appear once, smallest is 1."
      }
    ],
    "constraints": [
      "1 <= n <= 10^5",
      "0 <= arr[i] < n"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "7\n2 2 1 1 1 2 2",
        "expectedOutput": "2"
      },
      {
        "input": "4\n0 0 0 1",
        "expectedOutput": "0"
      },
      {
        "input": "3\n3 1 2",
        "expectedOutput": "1"
      },
      {
        "input": "4\n1 1 2 2",
        "expectedOutput": "1"
      },
      {
        "input": "7\n4 4 4 4 0 1 2",
        "expectedOutput": "4"
      },
      {
        "input": "1\n0",
        "expectedOutput": "0"
      },
      {
        "input": "7\n2 3 3 2 3 2 2",
        "expectedOutput": "2"
      },
      {
        "input": "5\n1 0 1 0 1",
        "expectedOutput": "1"
      },
      {
        "input": "5\n5 5 5 5 5",
        "expectedOutput": "5"
      },
      {
        "input": "7\n3 2 1 0 3 2 3",
        "expectedOutput": "3"
      },
      {
        "input": "8\n1 2 3 4 5 1 2 1",
        "expectedOutput": "1"
      },
      {
        "input": "8\n0 1 2 3 4 0 1 0",
        "expectedOutput": "0"
      }
    ]
  },
  {
    "id": "kth-smallest-after-removal",
    "hints": ["Sort the removed integers and walk through the natural numbers, counting how many numbers survive in the gaps before and between the removed values.","For the sorted removed list, the count of surviving numbers up to any value equals the value minus the removed elements before it; advance until that count reaches k."],
    "returns": "int",
    "title": "Kth Smallest Element After Removing Integers",
    "difficulty": "medium",
    "topic": "heaps",
    "companies": [
      "Amazon",
      "Google"
    ],
    "description": "Given an array of removed integers from the natural numbers and k, find the kth smallest natural number that was not removed. Input format: first line n, second line the removed integers, third line k.",
    "examples": [
      {
        "input": "5\n2 3 4 7 11\n5",
        "output": "9",
        "explanation": "Remaining: 1,5,6,8,9,10... 5th is 9."
      },
      {
        "input": "3\n1 2 3\n1",
        "output": "4",
        "explanation": "1 removed, so 1st remaining is 4? No: remaining starts 4? Actually 1,2,3 removed so 1st is 4."
      },
      {
        "input": "1\n5\n5",
        "output": "6",
        "explanation": "5 removed, 5th remaining is 6."
      }
    ],
    "constraints": [
      "1 <= n <= 10^5",
      "1 <= arr[i] <= 10^9",
      "1 <= k <= 10^9"
    ],
    "io": "array-k",
    "testCases": [
      {
        "input": "5\n2 3 4 7 11\n5",
        "expectedOutput": "9"
      },
      {
        "input": "3\n1 2 3\n1",
        "expectedOutput": "4"
      },
      {
        "input": "1\n5\n5",
        "expectedOutput": "6"
      },
      {
        "input": "5\n2 3 4 7 11\n1",
        "expectedOutput": "1"
      },
      {
        "input": "5\n1 2 3 4 5\n3",
        "expectedOutput": "8"
      },
      {
        "input": "3\n10 20 30\n10",
        "expectedOutput": "11"
      },
      {
        "input": "3\n4 2 1\n4",
        "expectedOutput": "7"
      },
      {
        "input": "1\n7\n1",
        "expectedOutput": "1"
      },
      {
        "input": "4\n3 5 7 9\n2",
        "expectedOutput": "2"
      },
      {
        "input": "4\n1 3 5 7\n4",
        "expectedOutput": "8"
      },
      {
        "input": "1\n2\n100",
        "expectedOutput": "101"
      },
      {
        "input": "3\n6 6 6\n6",
        "expectedOutput": "7"
      }
    ]
  },
  {
    "id": "k-closest-elements",
    "hints": ["Order candidates by their absolute distance from x, keeping only the k smallest distances seen so far.","Use a max-heap of size k keyed by distance, evicting the farthest and breaking distance ties by keeping the smaller value, then sort the heap's contents ascending for the output."],
    "returns": "intArr",
    "title": "K Closest Elements to X",
    "difficulty": "medium",
    "topic": "heaps",
    "companies": [
      "Google",
      "Amazon"
    ],
    "description": "Given k, x and an array, return the k elements closest to x. Ties are broken by smaller value, and the result is sorted ascending. Input format: first line is the total count, second line starts with k and x followed by the array elements.",
    "examples": [
      {
        "input": "7\n4 3 1 2 3 4 5",
        "output": "1 2 3 4",
        "explanation": "Closest to 3 are 2, 3, 4 and 1 or 5 (tie picks smaller). Sorted: 1 2 3 4."
      },
      {
        "input": "7\n2 0 1 2 3 4 5",
        "output": "1 2",
        "explanation": "Closest to 0 are 1 and 2."
      },
      {
        "input": "5\n1 10 5 6 7",
        "output": "7",
        "explanation": "Only 7 is closest to 10."
      }
    ],
    "constraints": [
      "1 <= k <= n <= 10^5",
      "-10^4 <= x, arr[i] <= 10^4"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "7\n4 3 1 2 3 4 5",
        "expectedOutput": "1 2 3 4"
      },
      {
        "input": "7\n2 0 1 2 3 4 5",
        "expectedOutput": "1 2"
      },
      {
        "input": "5\n1 10 5 6 7",
        "expectedOutput": "7"
      },
      {
        "input": "6\n3 5 1 10 15 20",
        "expectedOutput": "1 10 15"
      },
      {
        "input": "7\n5 3 1 2 3 4 5",
        "expectedOutput": "1 2 3 4 5"
      },
      {
        "input": "6\n2 -5 -10 -3 0 5",
        "expectedOutput": "-10 -3"
      },
      {
        "input": "6\n3 100 90 95 105 110",
        "expectedOutput": "90 95 105"
      },
      {
        "input": "10\n4 7 1 2 3 4 5 6 7 8",
        "expectedOutput": "5 6 7 8"
      },
      {
        "input": "6\n2 2 1 1 1 1",
        "expectedOutput": "1 1"
      },
      {
        "input": "7\n3 0 -1 -2 -3 1 2",
        "expectedOutput": "-2 -1 1"
      },
      {
        "input": "3\n1 5 5",
        "expectedOutput": "5"
      },
      {
        "input": "8\n6 4 1 3 5 7 9 2",
        "expectedOutput": "1 2 3 5 7 9"
      }
    ]
  },
  {
    "id": "kth-largest-in-stream",
    "hints": ["Keep just the k largest values seen so far; the smallest of that group is the kth largest at every step.","Maintain a min-heap of size k: push each new number and pop the top when the heap grows past k, then the heap top (or -1 while the heap holds fewer than k elements) is the answer after each insertion."],
    "returns": "intArr",
    "title": "Kth Largest Element in a Stream",
    "difficulty": "medium",
    "topic": "heaps",
    "companies": [
      "Amazon",
      "Google"
    ],
    "description": "Given a stream of integers and k, after each insertion output the kth largest element seen so far, or -1 if fewer than k elements have arrived. Input format: first line n, second line the stream, third line k.",
    "examples": [
      {
        "input": "4\n4 5 8 2\n3",
        "output": "-1 -1 4 4",
        "explanation": "After 4: -1, after 5: -1, after 8: 4, after 2: 4."
      },
      {
        "input": "3\n1 2 3\n1",
        "output": "1 2 3",
        "explanation": "Kth largest with k=1 is the running maximum."
      },
      {
        "input": "5\n5 4 3 2 1\n2",
        "output": "-1 4 4 4 4",
        "explanation": "Running 2nd largest: -1, 4, 4, 4, 4."
      }
    ],
    "constraints": [
      "1 <= n <= 10^5",
      "1 <= k <= 10^5",
      "-10^4 <= stream[i] <= 10^4"
    ],
    "io": "array-k",
    "testCases": [
      {
        "input": "4\n4 5 8 2\n3",
        "expectedOutput": "-1 -1 4 4"
      },
      {
        "input": "3\n1 2 3\n1",
        "expectedOutput": "1 2 3"
      },
      {
        "input": "5\n5 4 3 2 1\n2",
        "expectedOutput": "-1 4 4 4 4"
      },
      {
        "input": "1\n10\n1",
        "expectedOutput": "10"
      },
      {
        "input": "6\n3 1 5 12 2 11\n4",
        "expectedOutput": "-1 -1 -1 1 2 3"
      },
      {
        "input": "4\n7 7 7 7\n3",
        "expectedOutput": "-1 -1 7 7"
      },
      {
        "input": "2\n1 2\n5",
        "expectedOutput": "-1 -1"
      },
      {
        "input": "6\n9 8 7 6 5 4\n3",
        "expectedOutput": "-1 -1 7 7 7 7"
      },
      {
        "input": "4\n2 4 6 8\n2",
        "expectedOutput": "-1 2 4 6"
      },
      {
        "input": "3\n100 50 75\n2",
        "expectedOutput": "-1 50 75"
      },
      {
        "input": "1\n5\n3",
        "expectedOutput": "-1"
      },
      {
        "input": "9\n1 3 5 7 9 2 4 6 8\n5",
        "expectedOutput": "-1 -1 -1 -1 1 2 3 4 5"
      }
    ]
  },
  {
    "id": "connect-ropes",
    "hints": ["Combining the two smallest available ropes first is the greedy choice that minimizes the total, because every rope's length is counted once per merge it participates in.","Push all lengths into a min-heap, repeatedly pop the two smallest, add their sum to the total cost, and push the sum back until a single rope remains."],
    "returns": "int",
    "title": "Connect Ropes with Minimum Cost",
    "difficulty": "medium",
    "topic": "heaps",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Given n ropes with lengths, connect them into one rope. The cost to connect two ropes is the sum of their lengths. Find the minimum total cost. Input format: first line n, second line the lengths.",
    "examples": [
      {
        "input": "4\n4 3 2 6",
        "output": "29",
        "explanation": "Connect 2+3=5, 4+5=9, 6+9=15. Total 29."
      },
      {
        "input": "5\n4 3 2 6 5",
        "output": "45",
        "explanation": "Optimal cost is 33."
      },
      {
        "input": "2\n1 2",
        "output": "3",
        "explanation": "Two ropes cost 3."
      }
    ],
    "constraints": [
      "1 <= n <= 10^5",
      "1 <= length <= 10^4"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "4\n4 3 2 6",
        "expectedOutput": "29"
      },
      {
        "input": "5\n4 3 2 6 5",
        "expectedOutput": "45"
      },
      {
        "input": "2\n1 2",
        "expectedOutput": "3"
      },
      {
        "input": "1\n5",
        "expectedOutput": "0"
      },
      {
        "input": "5\n1 2 3 4 5",
        "expectedOutput": "33"
      },
      {
        "input": "4\n8 4 6 12",
        "expectedOutput": "58"
      },
      {
        "input": "4\n2 2 2 2",
        "expectedOutput": "16"
      },
      {
        "input": "3\n10 20 30",
        "expectedOutput": "90"
      },
      {
        "input": "5\n1 1 1 1 1",
        "expectedOutput": "12"
      },
      {
        "input": "4\n7 5 9 3",
        "expectedOutput": "47"
      },
      {
        "input": "4\n100 200 300 400",
        "expectedOutput": "1900"
      },
      {
        "input": "5\n3 7 2 8 5",
        "expectedOutput": "55"
      }
    ]
  },
  {
    "id": "cuckoo-hashing",
    "hints": ["Every key has exactly two candidate slots; on a collision, evict the resident key and insert it into its alternate slot, chaining displacements until every key settles.","Track displacement steps and detect a cycle when a key returns to a visited slot; on a cycle, resize or rehash the tables rather than looping forever."],
    "returns": "intMat",
    "title": "Cuckoo Hashing",
    "difficulty": "hard",
    "topic": "heaps",
    "companies": [
      "Amazon",
      "Google"
    ],
    "description": "Insert keys into two hash tables of given size using cuckoo hashing with h1(k) = k mod size and h2(k) = (k div size) mod size, displacing existing keys on collision. Return both tables with -1 for empty slots, each table on its own line. Input format: first line n, second line the keys, third line the table size.",
    "examples": [
      {
        "input": "10\n20 50 53 75 100 67 105 3 36 39\n11",
        "output": "-1 100 -1 36 -1 -1 50 -1 -1 75 -1\n3 20 -1 39 53 -1 67 -1 -1 105 -1",
        "explanation": "Keys are placed across the two tables after displacements."
      },
      {
        "input": "3\n1 2 3\n7",
        "output": "-1 1 2 3 -1 -1 -1\n-1 -1 -1 -1 -1 -1 -1",
        "explanation": "No collisions, all keys land in table 1."
      },
      {
        "input": "4\n10 20 30 40\n13",
        "output": "-1 40 -1 -1 30 -1 -1 20 -1 -1 10 -1 -1\n-1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1",
        "explanation": "Keys spread across both tables."
      }
    ],
    "constraints": [
      "1 <= n <= 100",
      "2 <= size <= 100",
      "0 <= key <= 10^4"
    ],
    "io": "array-k",
    "testCases": [
      {
        "input": "10\n20 50 53 75 100 67 105 3 36 39\n11",
        "expectedOutput": "-1 100 -1 36 -1 -1 50 -1 -1 75 -1\n3 20 -1 39 53 -1 67 -1 -1 105 -1"
      },
      {
        "input": "3\n1 2 3\n7",
        "expectedOutput": "-1 1 2 3 -1 -1 -1\n-1 -1 -1 -1 -1 -1 -1"
      },
      {
        "input": "4\n10 20 30 40\n13",
        "expectedOutput": "-1 40 -1 -1 30 -1 -1 20 -1 -1 10 -1 -1\n-1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1"
      },
      {
        "input": "3\n5 15 25\n11",
        "expectedOutput": "-1 -1 -1 25 15 5 -1 -1 -1 -1 -1\n-1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1"
      },
      {
        "input": "5\n7 14 21 28 35\n17",
        "expectedOutput": "-1 35 -1 -1 21 -1 -1 7 -1 -1 -1 28 -1 -1 14 -1 -1\n-1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1"
      },
      {
        "input": "2\n100 200\n19",
        "expectedOutput": "-1 -1 -1 -1 -1 100 -1 -1 -1 -1 200 -1 -1 -1 -1 -1 -1 -1 -1\n-1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1"
      },
      {
        "input": "6\n3 6 9 12 15 18\n23",
        "expectedOutput": "-1 -1 -1 3 -1 -1 6 -1 -1 9 -1 -1 12 -1 -1 15 -1 -1 18 -1 -1 -1 -1\n-1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1"
      },
      {
        "input": "3\n11 22 33\n13",
        "expectedOutput": "-1 -1 -1 -1 -1 -1 -1 33 -1 22 -1 11 -1\n-1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1"
      },
      {
        "input": "4\n8 16 24 32\n17",
        "expectedOutput": "-1 -1 -1 -1 -1 -1 -1 24 8 -1 -1 -1 -1 -1 -1 32 16\n-1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1"
      },
      {
        "input": "5\n50 60 70 80 90\n29",
        "expectedOutput": "-1 -1 60 90 -1 -1 -1 -1 -1 -1 -1 -1 70 -1 -1 -1 -1 -1 -1 -1 -1 50 80 -1 -1 -1 -1 -1 -1\n-1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1"
      },
      {
        "input": "2\n13 26\n11",
        "expectedOutput": "-1 -1 13 -1 26 -1 -1 -1 -1 -1 -1\n-1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1"
      },
      {
        "input": "5\n9 18 27 36 45\n31",
        "expectedOutput": "-1 -1 -1 -1 -1 36 -1 -1 -1 9 -1 -1 -1 -1 45 -1 -1 -1 18 -1 -1 -1 -1 -1 -1 -1 -1 27 -1 -1 -1\n-1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1"
      }
    ]
  },
  {
    "id": "itinerary-from-tickets",
    "hints": ["Using every ticket exactly once is an Eulerian trail; to get the lexicographically smallest route, always fly to the smallest available destination from the current airport.","Store each airport's outgoing tickets in a min-heap (or sorted adjacency list) and run Hierholzer's algorithm with post-order insertion, then reverse the collected path."],
    "returns": "string",
    "title": "Itinerary from List of Tickets",
    "difficulty": "medium",
    "topic": "heaps",
    "companies": [
      "Google",
      "Amazon"
    ],
    "description": "Given flight tickets as from-to pairs, reconstruct the itinerary in order using all tickets exactly once, choosing the smallest lexical order when multiple exist. Input format: a single line with n followed by n pairs of from and to airport codes. Return the itinerary as space-separated codes.",
    "examples": [
      {
        "input": "4 MUC LHR JFK MUC SFO SJC LHR SFO",
        "output": "JFK MUC LHR SFO SJC",
        "explanation": "Itinerary: JFK MUC LHR SFO SJC."
      },
      {
        "input": "3 JFK SFO JFK ATL SFO ATL",
        "output": "JFK SFO ATL ATL",
        "explanation": "Itinerary: JFK ATL SFO ATL."
      },
      {
        "input": "1 A B",
        "output": "A B",
        "explanation": "Direct flight A to B."
      }
    ],
    "constraints": [
      "1 <= n <= 10^4",
      "Codes are uppercase letters"
    ],
    "io": "string",
    "testCases": [
      {
        "input": "4 MUC LHR JFK MUC SFO SJC LHR SFO",
        "expectedOutput": "JFK MUC LHR SFO SJC"
      },
      {
        "input": "3 JFK SFO JFK ATL SFO ATL",
        "expectedOutput": "JFK SFO ATL ATL"
      },
      {
        "input": "1 A B",
        "expectedOutput": "A B"
      },
      {
        "input": "2 A B B C",
        "expectedOutput": "A B C"
      },
      {
        "input": "3 A B A C B A",
        "expectedOutput": "A B A C"
      },
      {
        "input": "2 X Y Y X",
        "expectedOutput": "X Y X"
      },
      {
        "input": "4 P Q Q R R S S P",
        "expectedOutput": "P Q R S P"
      },
      {
        "input": "3 DEL BOM BOM CCU DEL CCU",
        "expectedOutput": "DEL CCU BOM CCU"
      },
      {
        "input": "2 M N N O",
        "expectedOutput": "M N O"
      },
      {
        "input": "5 A C A B B C C A A D",
        "expectedOutput": "A B C A D C"
      },
      {
        "input": "1 JFK LAX",
        "expectedOutput": "JFK LAX"
      },
      {
        "input": "3 SFO SJC SJC SFO SFO OAK",
        "expectedOutput": "SFO SJC SFO OAK"
      }
    ]
  },
  {
    "id": "largest-subarray-zero-sum",
    "hints": ["A subarray sums to zero exactly when the prefix sums at its two boundaries are equal, so look for the farthest-apart equal prefix sums.","Record each prefix sum's earliest index in a hashmap (starting with sum 0 at index -1) and update the maximum length j - i whenever a prefix sum repeats."],
    "returns": "int",
    "title": "Largest Subarray with 0 Sum",
    "difficulty": "medium",
    "topic": "heaps",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Given an array, find the length of the largest subarray with sum 0. Input format: first line n, second line the array.",
    "examples": [
      {
        "input": "8\n15 -2 2 -8 1 7 10 23",
        "output": "5",
        "explanation": "Subarray -2 2 -8 1 7 has sum 0 and length 5."
      },
      {
        "input": "3\n1 2 3",
        "output": "0",
        "explanation": "No zero-sum subarray."
      },
      {
        "input": "3\n0 0 0",
        "output": "3",
        "explanation": "Whole array sums to 0."
      }
    ],
    "constraints": [
      "1 <= n <= 10^5",
      "-10^4 <= arr[i] <= 10^4"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "8\n15 -2 2 -8 1 7 10 23",
        "expectedOutput": "5"
      },
      {
        "input": "3\n1 2 3",
        "expectedOutput": "0"
      },
      {
        "input": "3\n0 0 0",
        "expectedOutput": "3"
      },
      {
        "input": "10\n1 -1 3 2 -2 -8 1 7 10 23",
        "expectedOutput": "5"
      },
      {
        "input": "1\n5",
        "expectedOutput": "0"
      },
      {
        "input": "1\n0",
        "expectedOutput": "1"
      },
      {
        "input": "6\n1 2 -3 3 -3 3",
        "expectedOutput": "5"
      },
      {
        "input": "4\n-1 1 -1 1",
        "expectedOutput": "4"
      },
      {
        "input": "12\n2 8 -3 -5 2 -4 6 1 2 1 -3 4",
        "expectedOutput": "8"
      },
      {
        "input": "3\n1 0 -1",
        "expectedOutput": "3"
      },
      {
        "input": "4\n10 -10 10 -10",
        "expectedOutput": "4"
      },
      {
        "input": "6\n3 4 -7 1 2 -1",
        "expectedOutput": "4"
      }
    ]
  },
  {
    "id": "count-distinct-every-window",
    "hints": ["Slide the window one position at a time and update the distinct count incrementally instead of recounting each window from scratch.","Keep a hashmap of element frequencies for the current window: remove the outgoing element's contribution, add the incoming one, and the map's size is the window's distinct count."],
    "returns": "intArr",
    "title": "Count Distinct Elements in Every Window",
    "difficulty": "medium",
    "topic": "heaps",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Given an array and k, count distinct elements in every window of size k. Input format: first line n, second line the array, third line k.",
    "examples": [
      {
        "input": "7\n1 2 1 3 4 2 3\n4",
        "output": "3 4 4 3",
        "explanation": "Windows have 3, 4, 4 and 3 distinct elements."
      },
      {
        "input": "4\n1 1 1 1\n2",
        "output": "1 1 1",
        "explanation": "Every window has 1 distinct element."
      },
      {
        "input": "4\n1 2 3 4\n1",
        "output": "1 1 1 1",
        "explanation": "Each window of size 1 has 1 distinct element."
      }
    ],
    "constraints": [
      "1 <= k <= n <= 10^5",
      "-10^4 <= arr[i] <= 10^4"
    ],
    "io": "array-k",
    "testCases": [
      {
        "input": "7\n1 2 1 3 4 2 3\n4",
        "expectedOutput": "3 4 4 3"
      },
      {
        "input": "4\n1 1 1 1\n2",
        "expectedOutput": "1 1 1"
      },
      {
        "input": "4\n1 2 3 4\n1",
        "expectedOutput": "1 1 1 1"
      },
      {
        "input": "6\n1 2 2 1 3 3\n3",
        "expectedOutput": "2 2 3 2"
      },
      {
        "input": "5\n5 5 5 5 5\n5",
        "expectedOutput": "1"
      },
      {
        "input": "5\n1 2 3 2 1\n3",
        "expectedOutput": "3 2 3"
      },
      {
        "input": "6\n4 1 2 1 4 3\n2",
        "expectedOutput": "2 2 2 2 2"
      },
      {
        "input": "3\n10 20 30\n3",
        "expectedOutput": "3"
      },
      {
        "input": "5\n1 2 1 2 1\n4",
        "expectedOutput": "2 2"
      },
      {
        "input": "5\n7 3 7 3 7\n2",
        "expectedOutput": "2 2 2 2"
      },
      {
        "input": "6\n1 2 3 4 5 6\n6",
        "expectedOutput": "6"
      },
      {
        "input": "6\n2 2 3 3 4 4\n4",
        "expectedOutput": "2 3 2"
      }
    ]
  },
  {
    "id": "group-shifted-strings",
    "hints": ["Two strings are shifts of each other exactly when the sequence of gaps between consecutive characters matches, regardless of the starting letter.","Build a canonical key from the differences (s[i] - s[0]) mod 26 for each string and group strings by that key in a hashmap; sort each group and the groups before joining."],
    "returns": "string",
    "title": "Group Shifted Strings",
    "difficulty": "medium",
    "topic": "heaps",
    "companies": [
      "Google",
      "Uber"
    ],
    "description": "Group strings that are shifts of each other, meaning each character is shifted by the same amount. Input format: a single line with n followed by the n strings. Return groups with strings sorted and comma-separated, groups sorted and joined by |.",
    "examples": [
      {
        "input": "6 abc bcd acef xyz az ba",
        "output": "abc,bcd,xyz|acef|az,ba",
        "explanation": "abc,bcd,xyz shift together; acef alone; az,ba together."
      },
      {
        "input": "1 a",
        "output": "a",
        "explanation": "Single string forms one group."
      },
      {
        "input": "3 abc def ghi",
        "output": "abc,def,ghi",
        "explanation": "All three are shifts of each other."
      }
    ],
    "constraints": [
      "1 <= n <= 10^4",
      "Strings contain lowercase letters"
    ],
    "io": "string",
    "testCases": [
      {
        "input": "6 abc bcd acef xyz az ba",
        "expectedOutput": "abc,bcd,xyz|acef|az,ba"
      },
      {
        "input": "1 a",
        "expectedOutput": "a"
      },
      {
        "input": "3 abc def ghi",
        "expectedOutput": "abc,def,ghi"
      },
      {
        "input": "4 ab ba cd dc",
        "expectedOutput": "ab,cd|ba,dc"
      },
      {
        "input": "2 abc xyz",
        "expectedOutput": "abc,xyz"
      },
      {
        "input": "5 a b c d e",
        "expectedOutput": "a,b,c,d,e"
      },
      {
        "input": "3 moon noon sun",
        "expectedOutput": "moon|noon|sun"
      },
      {
        "input": "4 abc bcd cde efg",
        "expectedOutput": "abc,bcd,cde,efg"
      },
      {
        "input": "2 za ab",
        "expectedOutput": "ab,za"
      },
      {
        "input": "3 abc amn xyz",
        "expectedOutput": "abc,xyz|amn"
      },
      {
        "input": "1 hello",
        "expectedOutput": "hello"
      },
      {
        "input": "4 def ghi abc xyz",
        "expectedOutput": "abc,def,ghi,xyz"
      }
    ]
  },
  {
    "id": "merge-k-sorted-lists",
    "hints": ["The next output element is always the smallest among the current heads of the k lists, so you only need to compare k candidates at a time.","Seed a min-heap with each list's first element as (value, list index); repeatedly pop the smallest, append it to the result, and push the next element from the same list."],
    "returns": "intArr",
    "title": "Merge K Sorted Lists",
    "difficulty": "hard",
    "topic": "heaps",
    "companies": [
      "Microsoft",
      "Amazon",
      "Google"
    ],
    "description": "Given k sorted lists, merge them into one sorted list. Input format: first line is the total count, second line starts with k, then k lengths, followed by all the elements in order.",
    "examples": [
      {
        "input": "13\n3 3 3 2 1 4 2 3 5 6 4 6 7",
        "output": "1 3 4 2 4 5 6 6",
        "explanation": "Lists [1,4,5],[1,3,4],[2,6] merge to 1 1 2 3 4 4 5 6."
      },
      {
        "input": "5\n1 3 1 2 3",
        "output": "1 2 3",
        "explanation": "Single list returned as is."
      },
      {
        "input": "5\n2 0 2 1 2",
        "output": "1 2",
        "explanation": "First list empty, result is 1 2."
      }
    ],
    "constraints": [
      "0 <= k <= 10^4",
      "Lists are sorted ascending"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "13\n3 3 3 2 1 4 2 3 5 6 4 6 7",
        "expectedOutput": "1 3 4 2 4 5 6 6"
      },
      {
        "input": "5\n1 3 1 2 3",
        "expectedOutput": "1 2 3"
      },
      {
        "input": "5\n2 0 2 1 2",
        "expectedOutput": "1 2"
      },
      {
        "input": "7\n3 1 1 1 5 3 1",
        "expectedOutput": "1 3 5"
      },
      {
        "input": "11\n2 4 4 1 3 5 7 2 4 6 8",
        "expectedOutput": "1 2 3 4 5 6 7 8"
      },
      {
        "input": "13\n4 2 2 2 2 1 2 3 4 5 6 7 8",
        "expectedOutput": "1 2 3 4 5 6 7 8"
      },
      {
        "input": "2\n1 0",
        "expectedOutput": ""
      },
      {
        "input": "10\n3 2 2 2 1 1 2 2 3 3",
        "expectedOutput": "1 1 2 2 3 3"
      },
      {
        "input": "9\n2 3 3 -5 0 5 -3 3 9",
        "expectedOutput": "-5 -3 0 3 5 9"
      },
      {
        "input": "11\n5 1 1 1 1 1 1 2 3 4 5",
        "expectedOutput": "1 2 3 4 5"
      },
      {
        "input": "13\n2 5 5 10 20 30 40 50 15 25 35 45 55",
        "expectedOutput": "10 15 20 25 30 35 40 45 50 55"
      },
      {
        "input": "13\n3 3 2 4 1 1 1 2 2 3 3 3 3",
        "expectedOutput": "1 1 1 2 2 3 3 3 3"
      }
    ]
  },
  {
    "id": "find-median-from-data-stream",
    "hints": ["Split the numbers seen so far into a lower half and an upper half so the median always sits at the boundary between them.","Keep a max-heap for the lower half and a min-heap for the upper half, rebalancing so their sizes differ by at most one; the median is the top of the larger heap, or the average of the two tops when sizes are equal."],
    "returns": "string",
    "title": "Find Median from Data Stream",
    "difficulty": "hard",
    "topic": "heaps",
    "companies": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "description": "Given a stream of integers, after each insertion output the median of all elements seen so far. Integers print without decimals, halves print as .5. Input format: first line n, second line the stream. Return medians space-separated.",
    "examples": [
      {
        "input": "4\n5 15 1 3",
        "output": "5 10 5 4",
        "explanation": "Medians: 5, 10, 5, 4."
      },
      {
        "input": "1\n1",
        "output": "1",
        "explanation": "Single element median is 1."
      },
      {
        "input": "2\n2 3",
        "output": "2 2.5",
        "explanation": "Medians: 2, 2.5."
      }
    ],
    "constraints": [
      "1 <= n <= 10^5",
      "-10^5 <= stream[i] <= 10^5"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "4\n5 15 1 3",
        "expectedOutput": "5 10 5 4"
      },
      {
        "input": "1\n1",
        "expectedOutput": "1"
      },
      {
        "input": "2\n2 3",
        "expectedOutput": "2 2.5"
      },
      {
        "input": "5\n1 2 3 4 5",
        "expectedOutput": "1 1.5 2 2.5 3"
      },
      {
        "input": "5\n5 4 3 2 1",
        "expectedOutput": "5 4.5 4 3.5 3"
      },
      {
        "input": "3\n1 1 1",
        "expectedOutput": "1 1 1"
      },
      {
        "input": "4\n10 20 30 40",
        "expectedOutput": "10 15 20 25"
      },
      {
        "input": "3\n3 1 2",
        "expectedOutput": "3 2 2"
      },
      {
        "input": "3\n-1 -2 -3",
        "expectedOutput": "-1 -1.5 -2"
      },
      {
        "input": "5\n7 3 5 1 9",
        "expectedOutput": "7 5 5 4 5"
      },
      {
        "input": "4\n4 4 4 4",
        "expectedOutput": "4 4 4 4"
      },
      {
        "input": "3\n100 1 50",
        "expectedOutput": "100 50.5 50"
      }
    ]
  },
  {
    "id": "sliding-window-maximum-heap",
    "hints": ["Keep the window's candidates in a structure ordered by value, and make sure elements that slide out of the window can no longer be reported as the maximum.","Push (value, index) pairs into a max-heap; for each window, lazily pop entries whose index is older than the window's left edge before reading the top as the window maximum."],
    "returns": "intArr",
    "title": "Sliding Window Maximum",
    "difficulty": "hard",
    "topic": "heaps",
    "companies": [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    "description": "Given an array and k, return the maximum of every window of size k using a heap-based approach. Input format: first line n, second line the array, third line k.",
    "examples": [
      {
        "input": "8\n1 3 -1 -3 5 3 6 7\n3",
        "output": "3 3 5 5 6 7",
        "explanation": "Window maximums are 3 3 5 5 6 7."
      },
      {
        "input": "1\n1\n1",
        "output": "1",
        "explanation": "Single window gives 1."
      },
      {
        "input": "5\n9 8 7 6 5\n2",
        "output": "9 8 7 6",
        "explanation": "Maximums are 9 8 7 6."
      }
    ],
    "constraints": [
      "1 <= k <= n <= 10^5",
      "-10^4 <= arr[i] <= 10^4"
    ],
    "io": "array-k",
    "testCases": [
      {
        "input": "8\n1 3 -1 -3 5 3 6 7\n3",
        "expectedOutput": "3 3 5 5 6 7"
      },
      {
        "input": "1\n1\n1",
        "expectedOutput": "1"
      },
      {
        "input": "5\n9 8 7 6 5\n2",
        "expectedOutput": "9 8 7 6"
      },
      {
        "input": "5\n1 2 3 4 5\n5",
        "expectedOutput": "5"
      },
      {
        "input": "4\n5 5 5 5\n2",
        "expectedOutput": "5 5 5"
      },
      {
        "input": "3\n7 2 4\n1",
        "expectedOutput": "7 2 4"
      },
      {
        "input": "5\n1 -1 2 -2 3\n3",
        "expectedOutput": "2 2 3"
      },
      {
        "input": "5\n4 3 2 1 5\n3",
        "expectedOutput": "4 3 5"
      },
      {
        "input": "6\n2 1 2 3 1 2\n4",
        "expectedOutput": "3 3 3"
      },
      {
        "input": "4\n-5 -2 -8 -1\n2",
        "expectedOutput": "-2 -2 -1"
      },
      {
        "input": "6\n6 5 4 3 2 1\n4",
        "expectedOutput": "6 5 4"
      },
      {
        "input": "8\n3 1 4 1 5 9 2 6\n3",
        "expectedOutput": "4 4 5 9 9 9"
      }
    ]
  },
  {
    "id": "smallest-positive-number",
    "hints": ["The answer must lie between 1 and n+1, so any element outside that range can be ignored entirely.","Place each value x in its matching slot x-1 in a single pass (or mark presence in a boolean array), then the first index i whose slot does not hold i+1 gives the answer i+1."],
    "returns": "int",
    "title": "Smallest Positive Number Missing",
    "difficulty": "medium",
    "topic": "heaps",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Given an array, find the smallest positive integer missing from it. Input format: first line n, second line the array.",
    "examples": [
      {
        "input": "3\n1 2 0",
        "output": "3",
        "explanation": "1 and 2 present, 3 missing."
      },
      {
        "input": "4\n3 4 -1 1",
        "output": "2",
        "explanation": "1 present, 2 missing."
      },
      {
        "input": "5\n7 8 9 11 12",
        "output": "1",
        "explanation": "1 missing."
      }
    ],
    "constraints": [
      "1 <= n <= 10^5",
      "-10^9 <= arr[i] <= 10^9"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "3\n1 2 0",
        "expectedOutput": "3"
      },
      {
        "input": "4\n3 4 -1 1",
        "expectedOutput": "2"
      },
      {
        "input": "5\n7 8 9 11 12",
        "expectedOutput": "1"
      },
      {
        "input": "3\n1 2 3",
        "expectedOutput": "4"
      },
      {
        "input": "3\n-5 -1 0",
        "expectedOutput": "1"
      },
      {
        "input": "1\n2",
        "expectedOutput": "1"
      },
      {
        "input": "1\n1",
        "expectedOutput": "2"
      },
      {
        "input": "5\n5 4 3 2 1",
        "expectedOutput": "6"
      },
      {
        "input": "4\n1 3 5 7",
        "expectedOutput": "2"
      },
      {
        "input": "5\n0 2 2 1 1",
        "expectedOutput": "3"
      },
      {
        "input": "4\n100 101 1 2",
        "expectedOutput": "3"
      },
      {
        "input": "5\n-1 -2 3 1 2",
        "expectedOutput": "4"
      }
    ]
  },
  {
    "id": "surpasser-count",
    "hints": ["For each element you need to count greater elements to its right, which a divide-and-conquer pass can do while it sorts.","Run a merge-sort variant that, during the merge step, counts how many right-half elements are greater than each left-half element, accumulating those counts per original position."],
    "returns": "intArr",
    "title": "Surpasser Count of Each Element",
    "difficulty": "medium",
    "topic": "heaps",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Given an array, for each element count how many elements to its right are greater than it. These are its surpassers. Input format: first line n, second line the array.",
    "examples": [
      {
        "input": "7\n2 7 5 3 0 8 1",
        "output": "4 1 1 1 2 0 0",
        "explanation": "Surpassers: 2 has 3, 7 has 1, 5 has 1, 3 has 1, 0 has 2, 8 has 0, 1 has 0."
      },
      {
        "input": "3\n1 2 3",
        "output": "2 1 0",
        "explanation": "1 has 2, 2 has 1, 3 has 0."
      },
      {
        "input": "3\n3 2 1",
        "output": "0 0 0",
        "explanation": "Decreasing array, all zero."
      }
    ],
    "constraints": [
      "1 <= n <= 10^5",
      "-10^9 <= arr[i] <= 10^9"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "7\n2 7 5 3 0 8 1",
        "expectedOutput": "4 1 1 1 2 0 0"
      },
      {
        "input": "3\n1 2 3",
        "expectedOutput": "2 1 0"
      },
      {
        "input": "3\n3 2 1",
        "expectedOutput": "0 0 0"
      },
      {
        "input": "1\n5",
        "expectedOutput": "0"
      },
      {
        "input": "3\n4 4 4",
        "expectedOutput": "0 0 0"
      },
      {
        "input": "5\n10 5 8 3 9",
        "expectedOutput": "0 2 1 1 0"
      },
      {
        "input": "5\n1 3 2 5 4",
        "expectedOutput": "4 2 2 0 0"
      },
      {
        "input": "4\n6 1 2 7",
        "expectedOutput": "1 2 1 0"
      },
      {
        "input": "5\n9 8 7 6 10",
        "expectedOutput": "1 1 1 1 0"
      },
      {
        "input": "4\n2 2 3 1",
        "expectedOutput": "1 1 0 0"
      },
      {
        "input": "5\n5 1 4 2 3",
        "expectedOutput": "0 3 0 1 0"
      },
      {
        "input": "4\n100 90 95 85",
        "expectedOutput": "0 1 0 0"
      }
    ]
  },
  {
    "id": "second-maximum-tournament",
    "hints": ["The second strongest player must have lost directly to the champion, so only the champion's defeated opponents are candidates.","Simulate the knockout bracket while recording whom the champion beats (or pop a max-heap twice); the answer is the maximum among the players the champion defeated."],
    "returns": "int",
    "title": "Second Maximum in Tournament",
    "difficulty": "medium",
    "topic": "heaps",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Given an array of player strengths, simulate a knockout tournament where the stronger player always wins. Return the strength of the second strongest player overall. Input format: first line n, second line the strengths.",
    "examples": [
      {
        "input": "6\n4 3 7 1 2 5",
        "output": "5",
        "explanation": "Champion 7 beats 4, 3 and 1; second best among them is 5."
      },
      {
        "input": "2\n1 2",
        "output": "1",
        "explanation": "Only two players, second is 1."
      },
      {
        "input": "4\n5 5 5 5",
        "output": "5",
        "explanation": "All equal, second max is 5."
      }
    ],
    "constraints": [
      "2 <= n <= 10^5",
      "1 <= strength <= 10^9"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "6\n4 3 7 1 2 5",
        "expectedOutput": "5"
      },
      {
        "input": "2\n1 2",
        "expectedOutput": "1"
      },
      {
        "input": "4\n5 5 5 5",
        "expectedOutput": "5"
      },
      {
        "input": "5\n10 20 30 40 50",
        "expectedOutput": "40"
      },
      {
        "input": "8\n3 1 4 1 5 9 2 6",
        "expectedOutput": "6"
      },
      {
        "input": "2\n100 1",
        "expectedOutput": "1"
      },
      {
        "input": "7\n7 3 9 2 8 1 6",
        "expectedOutput": "8"
      },
      {
        "input": "6\n2 4 6 8 10 12",
        "expectedOutput": "10"
      },
      {
        "input": "4\n15 25 5 35",
        "expectedOutput": "25"
      },
      {
        "input": "8\n1 3 5 7 9 11 13 15",
        "expectedOutput": "13"
      },
      {
        "input": "5\n50 40 30 20 10",
        "expectedOutput": "40"
      },
      {
        "input": "9\n9 7 5 3 1 2 4 6 8",
        "expectedOutput": "8"
      }
    ]
  },
  {
    "id": "largest-contiguous-subarray",
    "hints": ["With all distinct elements, a subarray contains consecutive integers exactly when max - min equals the subarray length minus one.","For each starting index, expand right while tracking the running minimum and maximum, updating the best length whenever max - min == j - i."],
    "returns": "int",
    "title": "Largest Contiguous Subarray",
    "difficulty": "hard",
    "topic": "heaps",
    "companies": [
      "Amazon",
      "Google"
    ],
    "description": "Given an array of distinct integers, find the length of the largest subarray that contains consecutive integers in some order. Input format: first line n, second line the array.",
    "examples": [
      {
        "input": "3\n10 12 11",
        "output": "3",
        "explanation": "10, 12, 11 form consecutive integers, length 3."
      },
      {
        "input": "4\n14 12 11 20",
        "output": "2",
        "explanation": "Best subarray has length 2."
      },
      {
        "input": "10\n1 56 58 57 90 92 94 93 91 45",
        "output": "5",
        "explanation": "56-58 and 90-94 are consecutive runs of length 5."
      }
    ],
    "constraints": [
      "1 <= n <= 10^5",
      "Array has distinct integers"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "3\n10 12 11",
        "expectedOutput": "3"
      },
      {
        "input": "4\n14 12 11 20",
        "expectedOutput": "2"
      },
      {
        "input": "10\n1 56 58 57 90 92 94 93 91 45",
        "expectedOutput": "5"
      },
      {
        "input": "1\n1",
        "expectedOutput": "1"
      },
      {
        "input": "5\n5 4 3 2 1",
        "expectedOutput": "5"
      },
      {
        "input": "4\n1 3 5 7",
        "expectedOutput": "1"
      },
      {
        "input": "5\n10 11 12 14 15",
        "expectedOutput": "3"
      },
      {
        "input": "5\n2 1 3 5 4",
        "expectedOutput": "5"
      },
      {
        "input": "5\n100 101 103 102 105",
        "expectedOutput": "4"
      },
      {
        "input": "5\n7 8 9 1 2",
        "expectedOutput": "3"
      },
      {
        "input": "6\n20 10 30 40 11 12",
        "expectedOutput": "2"
      },
      {
        "input": "6\n3 2 1 6 5 4",
        "expectedOutput": "6"
      }
    ]
  },
  {
    "id": "can-make-palindrome-queries",
    "hints": ["A substring can be rearranged into a palindrome exactly when at most one character has an odd count, so each query only needs 26 parity bits.","Build a prefix bitmask of character parities and XOR the masks at l-1 and r for each query; answer YES if the result has at most one bit set."],
    "returns": "string",
    "title": "Can Make Palindrome from Substring Queries",
    "difficulty": "medium",
    "topic": "heaps",
    "companies": [
      "Amazon",
      "Google"
    ],
    "description": "Given a string and queries [l, r], determine for each whether the substring can be rearranged into a palindrome. Input format: first line is the total count, second line starts with the string and q, followed by q pairs of l and r (0-indexed). Return YES or NO space-separated.",
    "examples": [
      {
        "input": "2\nabcda 2 0 3 1 4",
        "output": "NO NO",
        "explanation": "abcd cannot form palindrome, bcda cannot either."
      },
      {
        "input": "1\naaaa 1 0 3",
        "output": "YES",
        "explanation": "aaaa is already a palindrome."
      },
      {
        "input": "1\nabc 1 0 2",
        "output": "NO",
        "explanation": "abc has 3 odd counts, cannot form palindrome."
      }
    ],
    "constraints": [
      "1 <= s.length <= 10^5",
      "1 <= q <= 10^5",
      "0 <= l <= r < s.length"
    ],
    "io": "string-queries",
    "testCases": [
      {
        "input": "2\nabcda 2 0 3 1 4",
        "expectedOutput": "NO NO"
      },
      {
        "input": "1\naaaa 1 0 3",
        "expectedOutput": "YES"
      },
      {
        "input": "1\nabc 1 0 2",
        "expectedOutput": "NO"
      },
      {
        "input": "3\nabccaa 3 0 5 1 3 2 4",
        "expectedOutput": "NO YES YES"
      },
      {
        "input": "1\na 1 0 0",
        "expectedOutput": "YES"
      },
      {
        "input": "2\nracecar 2 0 6 1 5",
        "expectedOutput": "YES YES"
      },
      {
        "input": "2\nabcdef 2 0 1 2 3",
        "expectedOutput": "NO NO"
      },
      {
        "input": "2\naabbcc 2 0 5 0 3",
        "expectedOutput": "YES YES"
      },
      {
        "input": "1\nxyzyx 1 0 4",
        "expectedOutput": "YES"
      },
      {
        "input": "2\nab 2 0 0 0 1",
        "expectedOutput": "YES NO"
      },
      {
        "input": "3\nzzxyyxzz 3 0 7 2 5 1 6",
        "expectedOutput": "YES YES YES"
      },
      {
        "input": "1\nqwerty 1 0 5",
        "expectedOutput": "NO"
      }
    ]
  },
  {
    "id": "count-distinct-subarrays",
    "hints": ["For each right endpoint, every valid subarray ending there starts after the most recent duplicate, so count those starts instead of enumerating subarrays.","Use two pointers with a hashmap of last-seen indices: when arr[right] repeats, move left just past its previous occurrence, then add (right - left + 1) to the answer."],
    "returns": "int",
    "title": "Count Subarrays with All Distinct Elements",
    "difficulty": "medium",
    "topic": "heaps",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Given an array, count the number of subarrays in which all elements are distinct. Input format: first line n, second line the array.",
    "examples": [
      {
        "input": "3\n1 2 3",
        "output": "6",
        "explanation": "All 6 subarrays have distinct elements."
      },
      {
        "input": "3\n1 1 1",
        "output": "3",
        "explanation": "Only 3 single-element subarrays qualify."
      },
      {
        "input": "3\n1 2 1",
        "output": "5",
        "explanation": "Subarrays: [1],[2],[1],[1,2],[2,1] = 5."
      }
    ],
    "constraints": [
      "1 <= n <= 10^5",
      "-10^4 <= arr[i] <= 10^4"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "3\n1 2 3",
        "expectedOutput": "6"
      },
      {
        "input": "3\n1 1 1",
        "expectedOutput": "3"
      },
      {
        "input": "3\n1 2 1",
        "expectedOutput": "5"
      },
      {
        "input": "1\n5",
        "expectedOutput": "1"
      },
      {
        "input": "4\n1 2 3 4",
        "expectedOutput": "10"
      },
      {
        "input": "4\n2 2 3 4",
        "expectedOutput": "7"
      },
      {
        "input": "4\n1 3 2 3",
        "expectedOutput": "8"
      },
      {
        "input": "5\n4 5 6 7 8",
        "expectedOutput": "15"
      },
      {
        "input": "5\n1 2 3 1 2",
        "expectedOutput": "12"
      },
      {
        "input": "2\n10 10",
        "expectedOutput": "2"
      },
      {
        "input": "5\n3 1 4 1 5",
        "expectedOutput": "11"
      },
      {
        "input": "5\n7 8 7 8 7",
        "expectedOutput": "9"
      }
    ]
  },
  {
    "id": "fraction-to-recurring-decimal",
    "hints": ["Long division repeats a remainder exactly when the decimal starts repeating, so detecting a repeated remainder locates the cycle.","Simulate division while mapping each remainder to its position in the output string; when a remainder repeats, wrap the digits from its first occurrence in parentheses."],
    "returns": "string",
    "title": "Fraction to Recurring Decimal",
    "difficulty": "medium",
    "topic": "heaps",
    "companies": [
      "Amazon",
      "Google"
    ],
    "description": "Given a numerator and denominator, return the fraction as a decimal string with repeating parts in parentheses. Input format: first line is the total count, second line has numerator and denominator.",
    "examples": [
      {
        "input": "2\n1 2",
        "output": "0.5",
        "explanation": "1/2 = 0.5."
      },
      {
        "input": "2\n2 1",
        "output": "2",
        "explanation": "2/1 = 2."
      },
      {
        "input": "2\n4 333",
        "output": "0.(0)",
        "explanation": "4/333 = 0.(012)."
      }
    ],
    "constraints": [
      "-2^31 <= numerator, denominator <= 2^31 - 1",
      "denominator != 0"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "2\n1 2",
        "expectedOutput": "0.5"
      },
      {
        "input": "2\n2 1",
        "expectedOutput": "2"
      },
      {
        "input": "2\n4 333",
        "expectedOutput": "0.(0)"
      },
      {
        "input": "2\n1 3",
        "expectedOutput": "0.(3)"
      },
      {
        "input": "2\n0 5",
        "expectedOutput": "0"
      },
      {
        "input": "2\n-50 8",
        "expectedOutput": "-6.25"
      },
      {
        "input": "2\n7 -12",
        "expectedOutput": "-0.58(3)"
      },
      {
        "input": "2\n1 6",
        "expectedOutput": "0.1(6)"
      },
      {
        "input": "2\n22 7",
        "expectedOutput": "3.(1)"
      },
      {
        "input": "2\n1 7",
        "expectedOutput": "0.(1)"
      },
      {
        "input": "2\n-1 -2147483648",
        "expectedOutput": "0.0000000004656612873077392578125"
      },
      {
        "input": "2\n5 4",
        "expectedOutput": "1.25"
      }
    ]
  },
  {
    "id": "k-maximum-sum-combinations",
    "hints": ["After sorting both arrays descending, the largest sum pairs the two largest elements, and every other sum is one index step away from an already-emitted pair.","Push (A[0]+B[0], 0, 0) into a max-heap with a visited set of index pairs; pop k times, each time pushing the (i+1, j) and (i, j+1) neighbors if unseen, collecting sums in descending order."],
    "returns": "string",
    "title": "K Maximum Sum Combinations",
    "difficulty": "hard",
    "topic": "heaps",
    "companies": [
      "Amazon",
      "Google"
    ],
    "description": "Given two arrays A and B and k, return the k maximum sums formed by picking one element from each array. Input format: first line is the total count, second line starts with n1, n2 and k, followed by n1 elements of A and n2 elements of B. Result is space-separated descending.",
    "examples": [
      {
        "input": "11\n4 3 3 1 4 2 3 2 5 1 6",
        "output": "9 8 7",
        "explanation": "A=[1,4,2,3], B=[2,5,1]. Top 3 sums: 9, 8, 7."
      },
      {
        "input": "5\n1 1 1 5 10",
        "output": "15",
        "explanation": "Only one combination: 15."
      },
      {
        "input": "7\n2 2 4 1 2 3 4",
        "output": "6 5 5 4",
        "explanation": "A=[1,2], B=[3,4]. All 4 sums in descending order: 6 5 5 4."
      }
    ],
    "constraints": [
      "1 <= n1, n2 <= 10^5",
      "1 <= k <= n1 * n2"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "11\n4 3 3 1 4 2 3 2 5 1 6",
        "expectedOutput": "9 8 7"
      },
      {
        "input": "5\n1 1 1 5 10",
        "expectedOutput": "15"
      },
      {
        "input": "7\n2 2 4 1 2 3 4",
        "expectedOutput": "6 5 5 4"
      },
      {
        "input": "9\n3 3 2 1 1 1 2 2 2",
        "expectedOutput": "3 3"
      },
      {
        "input": "8\n2 3 3 10 20 1 2 3",
        "expectedOutput": "23 22 21"
      },
      {
        "input": "8\n3 2 5 5 4 3 2 1",
        "expectedOutput": "7 6 6 5 5"
      },
      {
        "input": "7\n1 3 2 7 1 2 3",
        "expectedOutput": "10 9"
      },
      {
        "input": "11\n4 4 4 1 3 5 7 2 4 6 8",
        "expectedOutput": "15 13 13 11"
      },
      {
        "input": "7\n2 2 1 100 1 100 1",
        "expectedOutput": "200"
      },
      {
        "input": "9\n3 3 9 1 2 3 4 5 6",
        "expectedOutput": "9 8 8 7 7 7 6 6 5"
      },
      {
        "input": "13\n5 5 3 9 8 7 6 5 1 2 3 4 5",
        "expectedOutput": "14 13 13"
      },
      {
        "input": "7\n2 2 2 3 3 3 3",
        "expectedOutput": "6 6"
      }
    ]
  },
  {
    "id": "sort-characters-by-frequency",
    "hints": ["Count how often each character appears, then emit characters ordered by that count with the smaller character winning ties.","Push (frequency, character) entries into a max-heap with a custom comparator that orders by frequency descending and character ascending, then drain the heap while repeating each character by its frequency."],
    "returns": "string",
    "title": "Sort Characters by Frequency",
    "difficulty": "medium",
    "topic": "heaps",
    "companies": [
      "Amazon",
      "Google"
    ],
    "description": "Given a string, sort its characters by decreasing frequency. Characters with equal frequency are ordered by smaller character first. Input is the string on the first line.",
    "examples": [
      {
        "input": "tree",
        "output": "eert",
        "explanation": "e appears twice, then r and t once each."
      },
      {
        "input": "cccaaa",
        "output": "aaaccc",
        "explanation": "a and c tie at 3 each, a first."
      },
      {
        "input": "a",
        "output": "a",
        "explanation": "Single character."
      }
    ],
    "constraints": [
      "1 <= s.length <= 10^5",
      "s contains printable ASCII characters"
    ],
    "io": "string",
    "testCases": [
      {
        "input": "tree",
        "expectedOutput": "eert"
      },
      {
        "input": "cccaaa",
        "expectedOutput": "aaaccc"
      },
      {
        "input": "a",
        "expectedOutput": "a"
      },
      {
        "input": "abacabad",
        "expectedOutput": "aaaabbcd"
      },
      {
        "input": "zzzzz",
        "expectedOutput": "zzzzz"
      },
      {
        "input": "hello",
        "expectedOutput": "lleho"
      },
      {
        "input": "bbaac",
        "expectedOutput": "aabbc"
      },
      {
        "input": "mississippi",
        "expectedOutput": "iiiissssppm"
      },
      {
        "input": "abcd",
        "expectedOutput": "abcd"
      },
      {
        "input": "aabbccddeeff",
        "expectedOutput": "aabbccddeeff"
      },
      {
        "input": "programming",
        "expectedOutput": "ggmmrrainop"
      },
      {
        "input": "xyzzy",
        "expectedOutput": "yyzzx"
      }
    ]
  },
  {
    "id": "binary-search",
    "hints": ["A sorted array lets every comparison eliminate half of the remaining candidates.","Keep low and high bounds, inspect the midpoint, and discard the half that cannot contain the target."],
    "returns": "int",
    "title": "Binary Search",
    "difficulty": "easy",
    "topic": "searching-sorting",
    "companies": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "description": "Given a sorted array and a target, return the index of the target using binary search, or -1 if not found. Input format: first line n, second line the sorted array, third line the target.",
    "examples": [
      {
        "input": "5\n1 2 3 4 5\n3",
        "output": "2",
        "explanation": "3 found at index 2."
      },
      {
        "input": "5\n1 2 3 4 5\n6",
        "output": "-1",
        "explanation": "6 not present, return -1."
      },
      {
        "input": "1\n10\n10",
        "output": "0",
        "explanation": "Single element matches."
      }
    ],
    "constraints": [
      "1 <= n <= 10^5",
      "Array is sorted ascending",
      "-10^9 <= target <= 10^9"
    ],
    "io": "array-target",
    "testCases": [
      {
        "input": "5\n1 2 3 4 5\n3",
        "expectedOutput": "2"
      },
      {
        "input": "5\n1 2 3 4 5\n6",
        "expectedOutput": "-1"
      },
      {
        "input": "1\n10\n10",
        "expectedOutput": "0"
      },
      {
        "input": "5\n1 3 5 7 9\n1",
        "expectedOutput": "0"
      },
      {
        "input": "5\n1 3 5 7 9\n9",
        "expectedOutput": "4"
      },
      {
        "input": "4\n2 4 6 8\n5",
        "expectedOutput": "-1"
      },
      {
        "input": "5\n-5 -2 0 3 7\n-2",
        "expectedOutput": "1"
      },
      {
        "input": "2\n1 2\n2",
        "expectedOutput": "1"
      },
      {
        "input": "6\n5 10 15 20 25 30\n25",
        "expectedOutput": "4"
      },
      {
        "input": "4\n1 1 1 1\n1",
        "expectedOutput": "1"
      },
      {
        "input": "3\n100 200 300\n150",
        "expectedOutput": "-1"
      },
      {
        "input": "7\n3 6 9 12 15 18 21\n12",
        "expectedOutput": "3"
      }
    ]
  },
  {
    "id": "sort-0-1-2",
    "hints": ["You need three regions for 0s, 1s and 2s — imagine what three boundary pointers could maintain.","Apply the Dutch National Flag method: low and high guard the outer regions while mid scans and swaps."],
    "returns": "intArr",
    "title": "Sort 0s 1s and 2s",
    "difficulty": "medium",
    "topic": "searching-sorting",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Given an array containing only 0s, 1s and 2s, sort it in place. Input format: first line n, second line the array.",
    "examples": [
      {
        "input": "6\n2 0 2 1 1 0",
        "output": "0 0 1 1 2 2",
        "explanation": "Sorted: 0 0 1 1 2 2."
      },
      {
        "input": "3\n2 0 1",
        "output": "0 1 2",
        "explanation": "Sorted: 0 1 2."
      },
      {
        "input": "3\n0 0 0",
        "output": "0 0 0",
        "explanation": "All zeros stay."
      }
    ],
    "constraints": [
      "1 <= n <= 10^5",
      "arr[i] is 0, 1 or 2"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "6\n2 0 2 1 1 0",
        "expectedOutput": "0 0 1 1 2 2"
      },
      {
        "input": "3\n2 0 1",
        "expectedOutput": "0 1 2"
      },
      {
        "input": "3\n0 0 0",
        "expectedOutput": "0 0 0"
      },
      {
        "input": "3\n2 2 2",
        "expectedOutput": "2 2 2"
      },
      {
        "input": "3\n1 1 1",
        "expectedOutput": "1 1 1"
      },
      {
        "input": "6\n1 2 0 2 1 0",
        "expectedOutput": "0 0 1 1 2 2"
      },
      {
        "input": "1\n0",
        "expectedOutput": "0"
      },
      {
        "input": "3\n2 1 0",
        "expectedOutput": "0 1 2"
      },
      {
        "input": "7\n1 0 2 0 1 2 1",
        "expectedOutput": "0 0 1 1 1 2 2"
      },
      {
        "input": "3\n0 1 2",
        "expectedOutput": "0 1 2"
      },
      {
        "input": "6\n2 2 1 1 0 0",
        "expectedOutput": "0 0 1 1 2 2"
      },
      {
        "input": "7\n1 2 1 2 0 0 1",
        "expectedOutput": "0 0 1 1 1 2 2"
      }
    ]
  },
  {
    "id": "majority-element",
    "hints": ["If you cancel each occurrence of a candidate against a different element, a true majority element must survive.","Use Boyer-Moore voting to pick a candidate in one pass, then verify its count in a second pass."],
    "returns": "int",
    "title": "Majority Element",
    "difficulty": "easy",
    "topic": "searching-sorting",
    "companies": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "description": "Given an array, find the element that appears more than n/2 times. Return -1 if no such element exists. Input format: first line n, second line the array.",
    "examples": [
      {
        "input": "3\n3 2 3",
        "output": "3",
        "explanation": "3 appears 2 out of 3 times."
      },
      {
        "input": "7\n2 2 1 1 1 2 2",
        "output": "2",
        "explanation": "2 appears 4 out of 7 times."
      },
      {
        "input": "3\n1 2 3",
        "output": "-1",
        "explanation": "No majority, return -1."
      }
    ],
    "constraints": [
      "1 <= n <= 10^5",
      "-10^9 <= arr[i] <= 10^9"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "3\n3 2 3",
        "expectedOutput": "3"
      },
      {
        "input": "7\n2 2 1 1 1 2 2",
        "expectedOutput": "2"
      },
      {
        "input": "3\n1 2 3",
        "expectedOutput": "-1"
      },
      {
        "input": "1\n5",
        "expectedOutput": "5"
      },
      {
        "input": "5\n1 1 1 2 2",
        "expectedOutput": "1"
      },
      {
        "input": "6\n4 4 4 1 2 3",
        "expectedOutput": "-1"
      },
      {
        "input": "5\n1 2 1 2 1",
        "expectedOutput": "1"
      },
      {
        "input": "16\n7 7 5 7 5 1 5 7 5 5 7 7 7 7 7 7",
        "expectedOutput": "7"
      },
      {
        "input": "5\n10 20 10 30 10",
        "expectedOutput": "10"
      },
      {
        "input": "4\n1 1 2 2",
        "expectedOutput": "-1"
      },
      {
        "input": "6\n9 9 9 9 8 8",
        "expectedOutput": "9"
      },
      {
        "input": "5\n2 3 2 3 2",
        "expectedOutput": "2"
      }
    ]
  },
  {
    "id": "count-inversions",
    "hints": ["An inversion is simply an out-of-order pair — merge sort already compares such pairs while merging halves.","Count during the merge step: when a right-half element is placed before leftover left-half elements, each forms an inversion."],
    "returns": "int",
    "title": "Count Inversions in Array",
    "difficulty": "hard",
    "topic": "searching-sorting",
    "companies": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "description": "Given an array, count the number of inversions where i < j but arr[i] > arr[j]. Input format: first line n, second line the array.",
    "examples": [
      {
        "input": "5\n2 4 1 3 5",
        "output": "3",
        "explanation": "Inversions: (2,1), (4,1), (4,3) = 3."
      },
      {
        "input": "5\n5 4 3 2 1",
        "output": "10",
        "explanation": "Fully reversed: 10 inversions."
      },
      {
        "input": "5\n1 2 3 4 5",
        "output": "0",
        "explanation": "Sorted: 0 inversions."
      }
    ],
    "constraints": [
      "1 <= n <= 10^5",
      "-10^9 <= arr[i] <= 10^9"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "5\n2 4 1 3 5",
        "expectedOutput": "3"
      },
      {
        "input": "5\n5 4 3 2 1",
        "expectedOutput": "10"
      },
      {
        "input": "5\n1 2 3 4 5",
        "expectedOutput": "0"
      },
      {
        "input": "1\n1",
        "expectedOutput": "0"
      },
      {
        "input": "3\n3 1 2",
        "expectedOutput": "2"
      },
      {
        "input": "5\n2 3 8 6 1",
        "expectedOutput": "5"
      },
      {
        "input": "5\n1 20 6 4 5",
        "expectedOutput": "5"
      },
      {
        "input": "3\n10 10 10",
        "expectedOutput": "0"
      },
      {
        "input": "6\n4 3 2 1 5 6",
        "expectedOutput": "6"
      },
      {
        "input": "4\n8 4 2 1",
        "expectedOutput": "6"
      },
      {
        "input": "5\n1 5 3 2 4",
        "expectedOutput": "4"
      },
      {
        "input": "7\n6 5 4 3 2 1 0",
        "expectedOutput": "21"
      }
    ]
  },
  {
    "id": "aggressive-cows",
    "hints": ["If cows fit with minimum distance d, they also fit for any smaller distance — this monotonicity invites binary search.","Binary search the distance; the check greedily places cows left to right and reports whether m cows fit."],
    "returns": "int",
    "title": "Aggressive Cows",
    "difficulty": "hard",
    "topic": "searching-sorting",
    "companies": [
      "Google",
      "Amazon"
    ],
    "description": "Given stall positions and m cows, place the cows so the minimum distance between any two is maximized. Return that maximum distance. Input format: first line n, second line the positions, third line m.",
    "examples": [
      {
        "input": "5\n1 2 4 8 9\n3",
        "output": "3",
        "explanation": "Place at 1, 4, 8 or 9 with min distance 3."
      },
      {
        "input": "5\n1 2 3 4 5\n2",
        "output": "4",
        "explanation": "Place at 1 and 5, distance 4."
      },
      {
        "input": "3\n10 20 30\n3",
        "output": "10",
        "explanation": "All stalls used, min distance 10."
      }
    ],
    "constraints": [
      "2 <= m <= n <= 10^5",
      "0 <= position <= 10^9"
    ],
    "io": "array-m",
    "testCases": [
      {
        "input": "5\n1 2 4 8 9\n3",
        "expectedOutput": "3"
      },
      {
        "input": "5\n1 2 3 4 5\n2",
        "expectedOutput": "4"
      },
      {
        "input": "3\n10 20 30\n3",
        "expectedOutput": "10"
      },
      {
        "input": "5\n1 5 10 15 20\n4",
        "expectedOutput": "5"
      },
      {
        "input": "2\n1 100\n2",
        "expectedOutput": "99"
      },
      {
        "input": "5\n4 2 1 3 6\n3",
        "expectedOutput": "2"
      },
      {
        "input": "5\n1 2 4 8 9\n2",
        "expectedOutput": "8"
      },
      {
        "input": "6\n5 10 15 20 25 30\n3",
        "expectedOutput": "10"
      },
      {
        "input": "5\n1 3 5 7 9\n5",
        "expectedOutput": "2"
      },
      {
        "input": "6\n2 6 11 14 19 25\n4",
        "expectedOutput": "6"
      },
      {
        "input": "2\n1 2\n2",
        "expectedOutput": "1"
      },
      {
        "input": "5\n10 1 2 7 5\n3",
        "expectedOutput": "4"
      }
    ]
  },
  {
    "id": "painter-partition",
    "hints": ["Feasibility is monotonic: if a maximum length X works, any larger X works too — so binary search the answer.","Search between the largest single board and the total sum, greedily assigning contiguous boards to test each candidate."],
    "returns": "int",
    "title": "Painter Partition Problem",
    "difficulty": "hard",
    "topic": "searching-sorting",
    "companies": [
      "Amazon",
      "Google"
    ],
    "description": "Given boards with lengths and k painters, assign contiguous boards to minimize the maximum length painted by any painter. Return that minimum possible maximum. Input format: first line n, second line the lengths, third line k.",
    "examples": [
      {
        "input": "4\n10 20 30 40\n2",
        "output": "60",
        "explanation": "Split [10,20,30] and [40], max 60."
      },
      {
        "input": "4\n10 20 30 40\n1",
        "output": "100",
        "explanation": "One painter paints all 100."
      },
      {
        "input": "4\n5 5 5 5\n4",
        "output": "5",
        "explanation": "Each painter gets one board, max 5."
      }
    ],
    "constraints": [
      "1 <= k <= n <= 10^5",
      "1 <= length <= 10^6"
    ],
    "io": "array-k",
    "testCases": [
      {
        "input": "4\n10 20 30 40\n2",
        "expectedOutput": "60"
      },
      {
        "input": "4\n10 20 30 40\n1",
        "expectedOutput": "100"
      },
      {
        "input": "4\n5 5 5 5\n4",
        "expectedOutput": "5"
      },
      {
        "input": "9\n1 2 3 4 5 6 7 8 9\n3",
        "expectedOutput": "17"
      },
      {
        "input": "1\n100\n1",
        "expectedOutput": "100"
      },
      {
        "input": "4\n10 10 10 10\n2",
        "expectedOutput": "20"
      },
      {
        "input": "5\n7 2 5 10 8\n2",
        "expectedOutput": "18"
      },
      {
        "input": "3\n1 2 3\n2",
        "expectedOutput": "3"
      },
      {
        "input": "2\n48 90\n2",
        "expectedOutput": "90"
      },
      {
        "input": "5\n5 10 30 20 15\n3",
        "expectedOutput": "35"
      },
      {
        "input": "6\n1 1 1 1 1 1\n3",
        "expectedOutput": "2"
      },
      {
        "input": "5\n25 46 28 49 24\n4",
        "expectedOutput": "71"
      }
    ]
  },
  {
    "id": "allocate-books",
    "hints": ["This has the same shape as painter partition — binary search the smallest feasible maximum.","Binary search the page limit and check it by greedily allocating contiguous books without exceeding the limit."],
    "returns": "int",
    "title": "Allocate Minimum Number of Pages",
    "difficulty": "hard",
    "topic": "searching-sorting",
    "companies": [
      "Amazon",
      "Google"
    ],
    "description": "Given books with page counts and k students, allocate contiguous books to minimize the maximum pages any student gets. Return that minimum. Input format: first line n, second line the page counts, third line k.",
    "examples": [
      {
        "input": "4\n12 34 67 90\n2",
        "output": "113",
        "explanation": "Allocate [12,34,67] and [90], max 113."
      },
      {
        "input": "3\n15 17 20\n2",
        "output": "32",
        "explanation": "Allocate [15,17] and [20], max 32."
      },
      {
        "input": "4\n10 20 30 40\n1",
        "output": "100",
        "explanation": "One student gets all 100 pages."
      }
    ],
    "constraints": [
      "1 <= k <= n <= 10^5",
      "1 <= pages <= 10^6"
    ],
    "io": "array-k",
    "testCases": [
      {
        "input": "4\n12 34 67 90\n2",
        "expectedOutput": "113"
      },
      {
        "input": "3\n15 17 20\n2",
        "expectedOutput": "32"
      },
      {
        "input": "4\n10 20 30 40\n1",
        "expectedOutput": "100"
      },
      {
        "input": "4\n5 5 5 5\n4",
        "expectedOutput": "5"
      },
      {
        "input": "5\n1 2 3 4 5\n3",
        "expectedOutput": "6"
      },
      {
        "input": "3\n100 200 300\n2",
        "expectedOutput": "300"
      },
      {
        "input": "5\n25 46 28 49 24\n4",
        "expectedOutput": "71"
      },
      {
        "input": "5\n7 2 5 10 8\n2",
        "expectedOutput": "18"
      },
      {
        "input": "1\n1\n1",
        "expectedOutput": "1"
      },
      {
        "input": "3\n30 10 20\n3",
        "expectedOutput": "30"
      },
      {
        "input": "4\n12 34 67 90\n4",
        "expectedOutput": "90"
      },
      {
        "input": "5\n8 8 8 8 8\n2",
        "expectedOutput": "24"
      }
    ]
  },
  {
    "id": "find-peak-element",
    "hints": ["If the middle element is smaller than its right neighbor, a peak must exist somewhere to the right of it.","Binary search on the slope: move right when arr[mid] is less than arr[mid+1], else move left, until the pointers converge."],
    "returns": "int",
    "title": "Find Peak Element",
    "difficulty": "medium",
    "topic": "searching-sorting",
    "companies": [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    "description": "Given an array, find the index of any peak element, where an element is strictly greater than its neighbors. Ends compare with one neighbor. Input format: first line n, second line the array.",
    "examples": [
      {
        "input": "4\n1 2 3 1",
        "output": "2",
        "explanation": "3 at index 2 is a peak."
      },
      {
        "input": "7\n1 2 1 3 5 6 4",
        "output": "5",
        "explanation": "6 at index 5 is a peak."
      },
      {
        "input": "1\n1",
        "output": "0",
        "explanation": "Single element is a peak."
      }
    ],
    "constraints": [
      "1 <= n <= 10^5",
      "-2^31 <= arr[i] <= 2^31 - 1"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "4\n1 2 3 1",
        "expectedOutput": "2"
      },
      {
        "input": "7\n1 2 1 3 5 6 4",
        "expectedOutput": "5"
      },
      {
        "input": "1\n1",
        "expectedOutput": "0"
      },
      {
        "input": "2\n1 2",
        "expectedOutput": "1"
      },
      {
        "input": "2\n2 1",
        "expectedOutput": "0"
      },
      {
        "input": "5\n1 3 2 4 1",
        "expectedOutput": "3"
      },
      {
        "input": "5\n5 4 3 2 1",
        "expectedOutput": "0"
      },
      {
        "input": "5\n1 2 3 4 5",
        "expectedOutput": "4"
      },
      {
        "input": "7\n10 20 15 2 23 90 67",
        "expectedOutput": "5"
      },
      {
        "input": "5\n3 4 3 2 1",
        "expectedOutput": "1"
      },
      {
        "input": "5\n1 5 1 2 1",
        "expectedOutput": "3"
      },
      {
        "input": "7\n6 5 4 3 2 3 2",
        "expectedOutput": "0"
      }
    ]
  },
  {
    "id": "search-rotated-sorted-array-ss",
    "hints": ["Splitting a rotated sorted array at the midpoint always leaves one fully sorted half — determine which one.","Binary search by checking whether the target lies inside the sorted half's range; otherwise continue in the other half."],
    "returns": "int",
    "title": "Search in Rotated Sorted Array",
    "difficulty": "medium",
    "topic": "searching-sorting",
    "companies": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "description": "Given a rotated sorted array with distinct elements and a target, return its index or -1. Input format: first line n, second line the array, third line the target.",
    "examples": [
      {
        "input": "7\n4 5 6 7 0 1 2\n0",
        "output": "4",
        "explanation": "0 found at index 4."
      },
      {
        "input": "7\n4 5 6 7 0 1 2\n3",
        "output": "-1",
        "explanation": "3 not present."
      },
      {
        "input": "1\n1\n1",
        "output": "0",
        "explanation": "Single element matches."
      }
    ],
    "constraints": [
      "1 <= n <= 10^5",
      "All elements distinct",
      "-10^4 <= target <= 10^4"
    ],
    "io": "array-target",
    "testCases": [
      {
        "input": "7\n4 5 6 7 0 1 2\n0",
        "expectedOutput": "4"
      },
      {
        "input": "7\n4 5 6 7 0 1 2\n3",
        "expectedOutput": "-1"
      },
      {
        "input": "1\n1\n1",
        "expectedOutput": "0"
      },
      {
        "input": "2\n1 3\n3",
        "expectedOutput": "1"
      },
      {
        "input": "3\n5 1 3\n5",
        "expectedOutput": "0"
      },
      {
        "input": "7\n4 5 6 7 0 1 2\n6",
        "expectedOutput": "2"
      },
      {
        "input": "2\n3 1\n1",
        "expectedOutput": "1"
      },
      {
        "input": "5\n1 2 3 4 5\n4",
        "expectedOutput": "3"
      },
      {
        "input": "7\n6 7 1 2 3 4 5\n7",
        "expectedOutput": "1"
      },
      {
        "input": "9\n2 3 4 5 6 7 8 9 1\n1",
        "expectedOutput": "8"
      },
      {
        "input": "4\n10 20 30 5\n20",
        "expectedOutput": "1"
      },
      {
        "input": "6\n7 8 9 1 2 3\n9",
        "expectedOutput": "2"
      }
    ]
  },
  {
    "id": "first-last-position",
    "hints": ["Run two biased binary searches — one hunting the left edge of the target's range, one hunting the right edge.","When searching for the first position, keep moving left after finding the target; mirror the logic for the last."],
    "returns": "intArr",
    "title": "First and Last Position of Element",
    "difficulty": "medium",
    "topic": "searching-sorting",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Given a sorted array and a target, return the first and last index of the target, or -1 -1 if absent. Input format: first line n, second line the sorted array, third line the target. Return two integers space-separated.",
    "examples": [
      {
        "input": "6\n5 7 7 8 8 10\n8",
        "output": "3 4",
        "explanation": "8 spans indices 3 to 4."
      },
      {
        "input": "6\n5 7 7 8 8 10\n6",
        "output": "-1 -1",
        "explanation": "6 absent, return -1 -1."
      },
      {
        "input": "1\n1\n1",
        "output": "0 0",
        "explanation": "Single element at index 0."
      }
    ],
    "constraints": [
      "1 <= n <= 10^5",
      "Array is sorted ascending"
    ],
    "io": "array-target",
    "testCases": [
      {
        "input": "6\n5 7 7 8 8 10\n8",
        "expectedOutput": "3 4"
      },
      {
        "input": "6\n5 7 7 8 8 10\n6",
        "expectedOutput": "-1 -1"
      },
      {
        "input": "1\n1\n1",
        "expectedOutput": "0 0"
      },
      {
        "input": "4\n2 2 2 2\n2",
        "expectedOutput": "0 3"
      },
      {
        "input": "5\n1 2 3 4 5\n1",
        "expectedOutput": "0 0"
      },
      {
        "input": "5\n1 2 3 4 5\n5",
        "expectedOutput": "4 4"
      },
      {
        "input": "6\n1 1 2 2 3 3\n2",
        "expectedOutput": "2 3"
      },
      {
        "input": "6\n5 7 7 8 8 10\n7",
        "expectedOutput": "1 2"
      },
      {
        "input": "5\n1 4 4 4 9\n4",
        "expectedOutput": "1 3"
      },
      {
        "input": "3\n3 3 3\n4",
        "expectedOutput": "-1 -1"
      },
      {
        "input": "7\n1 2 3 3 3 3 4\n3",
        "expectedOutput": "2 5"
      },
      {
        "input": "3\n10 20 30\n30",
        "expectedOutput": "2 2"
      }
    ]
  },
  {
    "id": "count-smaller-after-self",
    "hints": ["Scanning right to left turns the question into 'how many already-seen values are smaller' — a running order statistic.","Use a Fenwick tree over compressed values scanning right to left, or count smaller elements during merge sort's merge step."],
    "returns": "intArr",
    "title": "Count of Smaller Numbers After Self",
    "difficulty": "hard",
    "topic": "searching-sorting",
    "companies": [
      "Amazon",
      "Google"
    ],
    "description": "Given an array, for each element count how many elements to its right are smaller than it. Input format: first line n, second line the array.",
    "examples": [
      {
        "input": "4\n5 2 6 1",
        "output": "2 1 1 0",
        "explanation": "5 has 2 smaller after, 2 has 1, 6 has 1, 1 has 0."
      },
      {
        "input": "4\n1 2 3 4",
        "output": "0 0 0 0",
        "explanation": "Increasing, all zero."
      },
      {
        "input": "4\n4 3 2 1",
        "output": "3 2 1 0",
        "explanation": "Decreasing: 3, 2, 1, 0."
      }
    ],
    "constraints": [
      "1 <= n <= 10^5",
      "-10^4 <= arr[i] <= 10^4"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "4\n5 2 6 1",
        "expectedOutput": "2 1 1 0"
      },
      {
        "input": "4\n1 2 3 4",
        "expectedOutput": "0 0 0 0"
      },
      {
        "input": "4\n4 3 2 1",
        "expectedOutput": "3 2 1 0"
      },
      {
        "input": "1\n1",
        "expectedOutput": "0"
      },
      {
        "input": "3\n2 0 1",
        "expectedOutput": "2 0 0"
      },
      {
        "input": "3\n5 5 5",
        "expectedOutput": "0 0 0"
      },
      {
        "input": "3\n3 1 2",
        "expectedOutput": "2 0 0"
      },
      {
        "input": "5\n7 6 5 4 3",
        "expectedOutput": "4 3 2 1 0"
      },
      {
        "input": "5\n1 9 7 8 5",
        "expectedOutput": "0 3 1 1 0"
      },
      {
        "input": "4\n4 1 3 2",
        "expectedOutput": "3 0 1 0"
      },
      {
        "input": "5\n10 5 8 3 9",
        "expectedOutput": "4 1 1 0 0"
      },
      {
        "input": "5\n2 4 1 3 5",
        "expectedOutput": "1 2 0 0 0"
      }
    ]
  },
  {
    "id": "minimum-platforms",
    "hints": ["Sort arrivals and departures separately, then sweep through time as if merging two timelines.","Walk both sorted lists with two pointers: an arrival before the earliest departure needs a new platform, otherwise one frees up."],
    "returns": "int",
    "title": "Minimum Number of Platforms",
    "difficulty": "medium",
    "topic": "searching-sorting",
    "companies": [
      "Amazon",
      "Paytm"
    ],
    "description": "Given train arrival and departure times, find the minimum platforms needed so no train waits. Input format: first line is the total count, second line starts with n followed by n arrival times and n departure times.",
    "examples": [
      {
        "input": "7\n3 900 940 950 910 1200 1120",
        "output": "2",
        "explanation": "Trains overlap at 940-950, need 3 platforms."
      },
      {
        "input": "5\n2 900 1000 930 1100",
        "output": "1",
        "explanation": "Two overlapping trains need 2 platforms."
      },
      {
        "input": "3\n1 900 1000",
        "output": "1",
        "explanation": "Single train needs 1 platform."
      }
    ],
    "constraints": [
      "1 <= n <= 10^5",
      "Times in HHMM format"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "7\n3 900 940 950 910 1200 1120",
        "expectedOutput": "2"
      },
      {
        "input": "5\n2 900 1000 930 1100",
        "expectedOutput": "1"
      },
      {
        "input": "3\n1 900 1000",
        "expectedOutput": "1"
      },
      {
        "input": "9\n4 900 940 950 1100 910 1200 1120 1130",
        "expectedOutput": "3"
      },
      {
        "input": "7\n3 100 200 300 150 250 350",
        "expectedOutput": "1"
      },
      {
        "input": "5\n2 100 200 200 300",
        "expectedOutput": "2"
      },
      {
        "input": "11\n5 1 2 3 4 5 2 3 4 5 6",
        "expectedOutput": "2"
      },
      {
        "input": "7\n3 900 905 910 915 920 925",
        "expectedOutput": "3"
      },
      {
        "input": "9\n4 800 900 1000 1100 830 930 1030 1130",
        "expectedOutput": "1"
      },
      {
        "input": "5\n2 1000 1100 1000 1100",
        "expectedOutput": "1"
      },
      {
        "input": "13\n6 900 910 920 930 940 950 1000 1010 1020 1030 1040 1050",
        "expectedOutput": "6"
      },
      {
        "input": "7\n3 1200 1300 1400 1230 1330 1430",
        "expectedOutput": "1"
      }
    ]
  },
  {
    "id": "merge-intervals-ss",
    "hints": ["Sorting by start time reduces overlap detection to a simple neighbor comparison.","Sweep the sorted intervals, absorbing each into the current interval while they overlap."],
    "returns": "intMat",
    "title": "Merge Overlapping Intervals",
    "difficulty": "medium",
    "topic": "searching-sorting",
    "companies": [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    "description": "Given intervals, merge all overlapping ones and return them sorted by start. Input format: first line is the total count, second line starts with n followed by n pairs of start and end.",
    "examples": [
      {
        "input": "9\n4 1 3 2 6 8 10 15 18",
        "output": "1 6\n8 10\n15 18",
        "explanation": "[1,3] and [2,6] merge to [1,6]."
      },
      {
        "input": "5\n2 1 4 4 5",
        "output": "1 5",
        "explanation": "[1,4] and [4,5] merge to [1,5]."
      },
      {
        "input": "7\n3 1 2 3 4 5 6",
        "output": "1 2\n3 4\n5 6",
        "explanation": "No overlaps, unchanged."
      }
    ],
    "constraints": [
      "1 <= n <= 10^4",
      "0 <= start <= end <= 10^4"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "9\n4 1 3 2 6 8 10 15 18",
        "expectedOutput": "1 6\n8 10\n15 18"
      },
      {
        "input": "5\n2 1 4 4 5",
        "expectedOutput": "1 5"
      },
      {
        "input": "7\n3 1 2 3 4 5 6",
        "expectedOutput": "1 2\n3 4\n5 6"
      },
      {
        "input": "3\n1 1 5",
        "expectedOutput": "1 5"
      },
      {
        "input": "7\n3 1 4 2 3 5 7",
        "expectedOutput": "1 4\n5 7"
      },
      {
        "input": "9\n4 1 10 2 3 4 5 6 7",
        "expectedOutput": "1 10"
      },
      {
        "input": "5\n2 1 4 0 0",
        "expectedOutput": "0 0\n1 4"
      },
      {
        "input": "11\n5 1 2 2 3 3 4 4 5 5 6",
        "expectedOutput": "1 6"
      },
      {
        "input": "7\n3 5 7 1 3 2 4",
        "expectedOutput": "1 4\n5 7"
      },
      {
        "input": "5\n2 1 5 6 8",
        "expectedOutput": "1 5\n6 8"
      },
      {
        "input": "9\n4 2 3 4 5 6 7 8 9",
        "expectedOutput": "2 3\n4 5\n6 7\n8 9"
      },
      {
        "input": "7\n3 1 3 2 4 5 6",
        "expectedOutput": "1 4\n5 6"
      }
    ]
  },
  {
    "id": "insert-interval",
    "hints": ["The existing intervals are sorted and disjoint, so the new interval only interacts with the ones it overlaps.","Copy intervals ending before the new one, merge every overlapping interval into it, then append the remainder."],
    "returns": "intMat",
    "title": "Insert Interval",
    "difficulty": "medium",
    "topic": "searching-sorting",
    "companies": [
      "Google",
      "Facebook"
    ],
    "description": "Given sorted non-overlapping intervals and a new interval, insert and merge it. Input format: first line is the total count, second line starts with n, then n pairs, then the new interval pair.",
    "examples": [
      {
        "input": "7\n2 1 3 6 9 2 5",
        "output": "1 5\n6 9",
        "explanation": "[2,5] merges with [1,3] to give [1,5],[6,9]."
      },
      {
        "input": "9\n3 1 2 3 5 6 7 8 10",
        "output": "1 2\n3 5\n6 7\n8 10",
        "explanation": "[8,10] appended, no merge."
      },
      {
        "input": "3\n0 5 7",
        "output": "5 7",
        "explanation": "Empty list, result is just [5,7]."
      }
    ],
    "constraints": [
      "0 <= n <= 10^4",
      "Intervals sorted and non-overlapping"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "7\n2 1 3 6 9 2 5",
        "expectedOutput": "1 5\n6 9"
      },
      {
        "input": "9\n3 1 2 3 5 6 7 8 10",
        "expectedOutput": "1 2\n3 5\n6 7\n8 10"
      },
      {
        "input": "3\n0 5 7",
        "expectedOutput": "5 7"
      },
      {
        "input": "7\n2 1 5 6 8 0 0",
        "expectedOutput": "0 0\n1 5\n6 8"
      },
      {
        "input": "7\n2 1 5 6 8 9 10",
        "expectedOutput": "1 5\n6 8\n9 10"
      },
      {
        "input": "5\n1 3 5 1 2",
        "expectedOutput": "1 2\n3 5"
      },
      {
        "input": "9\n3 1 2 4 5 7 8 3 6",
        "expectedOutput": "1 2\n3 6\n7 8"
      },
      {
        "input": "7\n2 2 4 6 8 5 5",
        "expectedOutput": "2 4\n5 5\n6 8"
      },
      {
        "input": "5\n1 1 1 1 1",
        "expectedOutput": "1 1"
      },
      {
        "input": "11\n4 1 2 3 4 5 6 7 8 0 9",
        "expectedOutput": "0 9"
      },
      {
        "input": "7\n2 10 20 30 40 25 35",
        "expectedOutput": "10 20\n25 40"
      },
      {
        "input": "9\n3 1 5 6 10 15 20 4 16",
        "expectedOutput": "1 20"
      }
    ]
  },
  {
    "id": "sqrt-x",
    "hints": ["The answer is the largest n with n squared not exceeding x — and squaring is monotonic, so binary search applies.","Search the range [0, x], comparing mid squared against x while guarding against overflow."],
    "returns": "int",
    "title": "Square Root of X",
    "difficulty": "easy",
    "topic": "searching-sorting",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Given a non-negative integer x, return the floor of its square root. Input is x on the first line.",
    "examples": [
      {
        "input": "8",
        "output": "2",
        "explanation": "Floor of sqrt(8) is 2."
      },
      {
        "input": "4",
        "output": "2",
        "explanation": "sqrt(4) is exactly 2."
      },
      {
        "input": "0",
        "output": "0",
        "explanation": "sqrt(0) is 0."
      }
    ],
    "constraints": [
      "0 <= x <= 2^31 - 1",
      "Return the floor value for non-perfect squares"
    ],
    "io": "int",
    "testCases": [
      {
        "input": "8",
        "expectedOutput": "2"
      },
      {
        "input": "4",
        "expectedOutput": "2"
      },
      {
        "input": "0",
        "expectedOutput": "0"
      },
      {
        "input": "1",
        "expectedOutput": "1"
      },
      {
        "input": "15",
        "expectedOutput": "3"
      },
      {
        "input": "16",
        "expectedOutput": "4"
      },
      {
        "input": "2147395599",
        "expectedOutput": "46339"
      },
      {
        "input": "2",
        "expectedOutput": "1"
      },
      {
        "input": "100",
        "expectedOutput": "10"
      },
      {
        "input": "99",
        "expectedOutput": "9"
      },
      {
        "input": "1000000",
        "expectedOutput": "1000"
      },
      {
        "input": "27",
        "expectedOutput": "5"
      }
    ]
  },
  {
    "id": "koko-eating-bananas",
    "hints": ["If Koko finishes at speed k, she finishes at any faster speed — binary search the minimum feasible speed.","Test each candidate speed by summing ceil(pile / speed) over all piles and comparing against h hours."],
    "returns": "int",
    "title": "Koko Eating Bananas",
    "difficulty": "medium",
    "topic": "searching-sorting",
    "companies": [
      "Google",
      "Amazon"
    ],
    "description": "Given piles of bananas and h hours, find the minimum eating speed k so Koko finishes all piles within h hours. Input format: first line is the total count, second line has the piles followed by h.",
    "examples": [
      {
        "input": "5\n3 6 7 11 8",
        "output": "4",
        "explanation": "Speed 4 finishes in 8 hours."
      },
      {
        "input": "6\n30 11 23 4 20 5",
        "output": "30",
        "explanation": "Speed 30 finishes in 5 hours."
      },
      {
        "input": "6\n30 11 23 4 20 6",
        "output": "23",
        "explanation": "Speed 23 finishes in 6 hours."
      }
    ],
    "constraints": [
      "1 <= piles.length <= 10^4",
      "1 <= piles[i] <= 10^9",
      "piles.length <= h <= 10^9"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "5\n3 6 7 11 8",
        "expectedOutput": "4"
      },
      {
        "input": "6\n30 11 23 4 20 5",
        "expectedOutput": "30"
      },
      {
        "input": "6\n30 11 23 4 20 6",
        "expectedOutput": "23"
      },
      {
        "input": "4\n1 1 1 3",
        "expectedOutput": "1"
      },
      {
        "input": "2\n100 1",
        "expectedOutput": "100"
      },
      {
        "input": "5\n2 2 2 2 4",
        "expectedOutput": "2"
      },
      {
        "input": "4\n5 10 15 6",
        "expectedOutput": "5"
      },
      {
        "input": "2\n312884470 312884469",
        "expectedOutput": "2"
      },
      {
        "input": "4\n10 20 30 3",
        "expectedOutput": "30"
      },
      {
        "input": "4\n4 8 12 6",
        "expectedOutput": "4"
      },
      {
        "input": "5\n7 7 7 7 7",
        "expectedOutput": "7"
      },
      {
        "input": "6\n1 2 3 4 5 5",
        "expectedOutput": "5"
      }
    ]
  },
  {
    "id": "minimum-days-bouquets",
    "hints": ["Feasibility grows monotonically with days: whatever works by day d also works on any later day.","Binary search the day; to verify, scan for groups of k adjacent bloomed flowers and count the bouquets formed."],
    "returns": "int",
    "title": "Minimum Days to Make M Bouquets",
    "difficulty": "hard",
    "topic": "searching-sorting",
    "companies": [
      "Amazon",
      "Google"
    ],
    "description": "Given bloom days, make m bouquets each with k adjacent flowers. Return the minimum days needed, or -1 if impossible. Input format: first line is the total count, second line starts with n, m and k, followed by n bloom days.",
    "examples": [
      {
        "input": "8\n5 3 1 1 10 3 10 2",
        "output": "3",
        "explanation": "Need 3 bouquets of 1 flower: day 3."
      },
      {
        "input": "8\n5 3 2 1 10 3 10 2",
        "output": "-1",
        "explanation": "Need 6 flowers but only 5 exist: -1."
      },
      {
        "input": "10\n7 2 3 7 7 7 7 12 7 7",
        "output": "12",
        "explanation": "Need 2 bouquets of 3: day 12."
      }
    ],
    "constraints": [
      "1 <= n <= 10^5",
      "1 <= m, k <= 10^6",
      "1 <= bloomDay[i] <= 10^9"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "8\n5 3 1 1 10 3 10 2",
        "expectedOutput": "3"
      },
      {
        "input": "8\n5 3 2 1 10 3 10 2",
        "expectedOutput": "-1"
      },
      {
        "input": "10\n7 2 3 7 7 7 7 12 7 7",
        "expectedOutput": "12"
      },
      {
        "input": "4\n1 1 1 5",
        "expectedOutput": "5"
      },
      {
        "input": "6\n3 2 2 1 2 3",
        "expectedOutput": "-1"
      },
      {
        "input": "8\n5 1 5 1 2 3 4 5",
        "expectedOutput": "5"
      },
      {
        "input": "7\n4 4 1 1 1 1 1",
        "expectedOutput": "1"
      },
      {
        "input": "9\n6 2 2 5 5 5 5 5 5",
        "expectedOutput": "5"
      },
      {
        "input": "12\n9 3 3 1 10 2 9 3 8 4 7 5",
        "expectedOutput": "10"
      },
      {
        "input": "5\n2 1 2 3 4",
        "expectedOutput": "4"
      },
      {
        "input": "11\n8 2 4 1 2 4 9 3 4 9 7",
        "expectedOutput": "9"
      },
      {
        "input": "8\n5 2 1 5 4 3 2 1",
        "expectedOutput": "2"
      }
    ]
  },
  {
    "id": "search-2d-matrix-ii",
    "hints": ["Begin at a corner where one direction increases and the other decreases — the top-right corner has this property.","From the top-right, step left when the value exceeds the target and down when it is smaller, eliminating a row or column each move."],
    "returns": "bool",
    "title": "Search a 2D Matrix II",
    "difficulty": "medium",
    "topic": "searching-sorting",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Given a matrix with rows and columns sorted ascending, determine if a target exists. Input format: first line is the total count, second line starts with rows, cols and target, followed by the matrix values row by row. Return true or false.",
    "examples": [
      {
        "input": "28\n5 5 5 1 4 7 11 15 2 5 8 12 19 3 6 9 16 22 10 13 14 17 24 18 21 23 26 30",
        "output": "true",
        "explanation": "5 exists in the matrix."
      },
      {
        "input": "28\n5 5 20 1 4 7 11 15 2 5 8 12 19 3 6 9 16 22 10 13 14 17 24 18 21 23 26 30",
        "output": "false",
        "explanation": "20 does not exist."
      },
      {
        "input": "4\n1 1 5 5",
        "output": "true",
        "explanation": "Single element matches."
      }
    ],
    "constraints": [
      "1 <= rows, cols <= 300",
      "-10^9 <= target <= 10^9"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "28\n5 5 5 1 4 7 11 15 2 5 8 12 19 3 6 9 16 22 10 13 14 17 24 18 21 23 26 30",
        "expectedOutput": "true"
      },
      {
        "input": "28\n5 5 20 1 4 7 11 15 2 5 8 12 19 3 6 9 16 22 10 13 14 17 24 18 21 23 26 30",
        "expectedOutput": "false"
      },
      {
        "input": "4\n1 1 5 5",
        "expectedOutput": "true"
      },
      {
        "input": "4\n1 1 3 5",
        "expectedOutput": "false"
      },
      {
        "input": "7\n2 2 3 1 2 3 4",
        "expectedOutput": "true"
      },
      {
        "input": "12\n3 3 9 1 2 3 4 5 6 7 8 9",
        "expectedOutput": "true"
      },
      {
        "input": "12\n3 3 10 1 2 3 4 5 6 7 8 9",
        "expectedOutput": "false"
      },
      {
        "input": "9\n2 3 6 1 3 5 2 4 6",
        "expectedOutput": "true"
      },
      {
        "input": "19\n4 4 1 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16",
        "expectedOutput": "true"
      },
      {
        "input": "19\n4 4 16 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16",
        "expectedOutput": "true"
      },
      {
        "input": "7\n2 2 0 1 2 3 4",
        "expectedOutput": "false"
      },
      {
        "input": "6\n3 1 2 1 2 3",
        "expectedOutput": "true"
      }
    ]
  },
  {
    "id": "count-set-bits",
    "hints": ["Think about what happens to a number's binary representation when you clear its lowest set bit.","Use the n & (n-1) trick to drop the rightmost 1 on each iteration, or shift right and test the last bit."],
    "returns": "int",
    "title": "Count Set Bits",
    "difficulty": "easy",
    "topic": "bit-manipulation",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Given a non-negative integer n, count the number of 1 bits in its binary representation. Input is n on the first line.",
    "examples": [
      {
        "input": "11",
        "output": "3",
        "explanation": "11 in binary is 1011, three set bits."
      },
      {
        "input": "128",
        "output": "1",
        "explanation": "128 is 10000000, one set bit."
      },
      {
        "input": "0",
        "output": "0",
        "explanation": "0 has no set bits."
      }
    ],
    "constraints": [
      "0 <= n <= 2^32 - 1",
      "Count bits in the 32-bit representation"
    ],
    "io": "int",
    "testCases": [
      {
        "input": "11",
        "expectedOutput": "3"
      },
      {
        "input": "128",
        "expectedOutput": "1"
      },
      {
        "input": "0",
        "expectedOutput": "0"
      },
      {
        "input": "1",
        "expectedOutput": "1"
      },
      {
        "input": "7",
        "expectedOutput": "3"
      },
      {
        "input": "255",
        "expectedOutput": "8"
      },
      {
        "input": "16",
        "expectedOutput": "1"
      },
      {
        "input": "100",
        "expectedOutput": "3"
      },
      {
        "input": "1023",
        "expectedOutput": "10"
      },
      {
        "input": "1024",
        "expectedOutput": "1"
      },
      {
        "input": "4294967295",
        "expectedOutput": "32"
      },
      {
        "input": "19",
        "expectedOutput": "3"
      }
    ]
  },
  {
    "id": "power-of-two",
    "hints": ["A power of two has exactly one bit set in binary. What does subtracting 1 do to that pattern?","Check that n is positive and (n & (n-1)) equals 0; handle the edge cases n = 0 and negative values."],
    "returns": "bool",
    "title": "Power of Two",
    "difficulty": "easy",
    "topic": "bit-manipulation",
    "companies": [
      "Amazon",
      "Google"
    ],
    "description": "Given an integer n, determine if it is a power of two. Return true or false. Input is n on the first line.",
    "examples": [
      {
        "input": "16",
        "output": "true",
        "explanation": "16 = 2^4, true."
      },
      {
        "input": "3",
        "output": "false",
        "explanation": "3 is not a power of two."
      },
      {
        "input": "1",
        "output": "true",
        "explanation": "1 = 2^0, true."
      }
    ],
    "constraints": [
      "-2^31 <= n <= 2^31 - 1",
      "1 is considered a power of two (2^0)"
    ],
    "io": "int",
    "testCases": [
      {
        "input": "16",
        "expectedOutput": "true"
      },
      {
        "input": "3",
        "expectedOutput": "false"
      },
      {
        "input": "1",
        "expectedOutput": "true"
      },
      {
        "input": "0",
        "expectedOutput": "false"
      },
      {
        "input": "-16",
        "expectedOutput": "false"
      },
      {
        "input": "1024",
        "expectedOutput": "true"
      },
      {
        "input": "1023",
        "expectedOutput": "false"
      },
      {
        "input": "2",
        "expectedOutput": "true"
      },
      {
        "input": "1073741824",
        "expectedOutput": "true"
      },
      {
        "input": "1073741825",
        "expectedOutput": "false"
      },
      {
        "input": "64",
        "expectedOutput": "true"
      },
      {
        "input": "100",
        "expectedOutput": "false"
      }
    ]
  },
  {
    "id": "single-number",
    "hints": ["You need an operation that cancels out numbers appearing twice. Which bitwise operator is its own inverse?","XOR all elements together: pairs cancel to 0 and the lone number remains. This runs in O(n) time with O(1) space."],
    "returns": "int",
    "title": "Single Number",
    "difficulty": "easy",
    "topic": "bit-manipulation",
    "companies": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "description": "Given an array where every element appears twice except one, find that single element. Input format: first line n, second line the array.",
    "examples": [
      {
        "input": "3\n2 2 1",
        "output": "1",
        "explanation": "1 appears once."
      },
      {
        "input": "5\n4 1 2 1 2",
        "output": "4",
        "explanation": "4 appears once."
      },
      {
        "input": "1\n1",
        "output": "1",
        "explanation": "Single element array."
      }
    ],
    "constraints": [
      "1 <= n <= 3 * 10^4",
      "-3 * 10^4 <= arr[i] <= 3 * 10^4"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "3\n2 2 1",
        "expectedOutput": "1"
      },
      {
        "input": "5\n4 1 2 1 2",
        "expectedOutput": "4"
      },
      {
        "input": "1\n1",
        "expectedOutput": "1"
      },
      {
        "input": "5\n5 5 7 7 9",
        "expectedOutput": "9"
      },
      {
        "input": "3\n-1 -1 -2",
        "expectedOutput": "-2"
      },
      {
        "input": "3\n10 20 10",
        "expectedOutput": "20"
      },
      {
        "input": "3\n0 1 0",
        "expectedOutput": "1"
      },
      {
        "input": "7\n3 3 4 4 5 5 6",
        "expectedOutput": "6"
      },
      {
        "input": "5\n100 200 300 200 100",
        "expectedOutput": "300"
      },
      {
        "input": "3\n7 8 7",
        "expectedOutput": "8"
      },
      {
        "input": "7\n1 2 3 4 1 2 3",
        "expectedOutput": "4"
      },
      {
        "input": "9\n9 9 8 8 7 7 6 6 5",
        "expectedOutput": "5"
      }
    ]
  },
  {
    "id": "single-number-ii",
    "hints": ["Plain XOR cannot separate triples. What if you counted the set bits at each position across all numbers?","Sum the bits at each position; the unique number's bits are those whose count is not a multiple of 3. A ones/twos bitmask state machine also works."],
    "returns": "int",
    "title": "Single Number II",
    "difficulty": "medium",
    "topic": "bit-manipulation",
    "companies": [
      "Amazon",
      "Google"
    ],
    "description": "Given an array where every element appears three times except one, find that single element. Input format: first line n, second line the array.",
    "examples": [
      {
        "input": "4\n2 2 3 2",
        "output": "3",
        "explanation": "3 appears once."
      },
      {
        "input": "7\n0 1 0 1 0 1 99",
        "output": "99",
        "explanation": "99 appears once."
      },
      {
        "input": "1\n5",
        "output": "5",
        "explanation": "Single element array."
      }
    ],
    "constraints": [
      "1 <= n <= 3 * 10^4",
      "-2^31 <= arr[i] <= 2^31 - 1"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "4\n2 2 3 2",
        "expectedOutput": "3"
      },
      {
        "input": "7\n0 1 0 1 0 1 99",
        "expectedOutput": "99"
      },
      {
        "input": "1\n5",
        "expectedOutput": "5"
      },
      {
        "input": "4\n1 1 1 2",
        "expectedOutput": "2"
      },
      {
        "input": "10\n-2 -2 1 1 4 1 4 4 -4 -2",
        "expectedOutput": "-4"
      },
      {
        "input": "4\n7 7 7 3",
        "expectedOutput": "3"
      },
      {
        "input": "7\n10 20 10 20 10 20 30",
        "expectedOutput": "30"
      },
      {
        "input": "4\n0 0 0 5",
        "expectedOutput": "5"
      },
      {
        "input": "7\n100 1 100 1 100 1 2",
        "expectedOutput": "2"
      },
      {
        "input": "7\n4 4 4 9 9 9 1",
        "expectedOutput": "1"
      },
      {
        "input": "4\n-1 -1 -1 -5",
        "expectedOutput": "-5"
      },
      {
        "input": "7\n6 2 6 2 6 2 8",
        "expectedOutput": "8"
      }
    ]
  },
  {
    "id": "reverse-bits",
    "hints": ["Process the number one bit at a time from the right, placing each bit into the answer starting from the left.","Loop 32 times: shift the result left, OR in (n & 1), then shift n right."],
    "returns": "int",
    "title": "Reverse Bits",
    "difficulty": "easy",
    "topic": "bit-manipulation",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Given a 32-bit unsigned integer, reverse its bits and return the resulting integer. Input is n on the first line.",
    "examples": [
      {
        "input": "43261596",
        "output": "964176192",
        "explanation": "43261596 reversed is 964176192."
      },
      {
        "input": "4294967293",
        "output": "3221225471",
        "explanation": "4294967293 reversed is 3221225471."
      },
      {
        "input": "0",
        "output": "0",
        "explanation": "0 reversed is 0."
      }
    ],
    "constraints": [
      "0 <= n <= 2^32 - 1",
      "Treat n as a 32-bit unsigned integer"
    ],
    "io": "int",
    "testCases": [
      {
        "input": "43261596",
        "expectedOutput": "964176192"
      },
      {
        "input": "4294967293",
        "expectedOutput": "3221225471"
      },
      {
        "input": "0",
        "expectedOutput": "0"
      },
      {
        "input": "1",
        "expectedOutput": "2147483648"
      },
      {
        "input": "4294967295",
        "expectedOutput": "4294967295"
      },
      {
        "input": "2",
        "expectedOutput": "1073741824"
      },
      {
        "input": "2147483648",
        "expectedOutput": "1"
      },
      {
        "input": "12345",
        "expectedOutput": "2618032128"
      },
      {
        "input": "255",
        "expectedOutput": "4278190080"
      },
      {
        "input": "16",
        "expectedOutput": "134217728"
      },
      {
        "input": "100",
        "expectedOutput": "637534208"
      },
      {
        "input": "7",
        "expectedOutput": "3758096384"
      }
    ]
  },
  {
    "id": "hamming-distance",
    "hints": ["The positions where x and y differ are exactly the set bits of one combined value. Which one?","Compute x ^ y, then count its set bits using the standard set-bit counting trick."],
    "returns": "int",
    "title": "Hamming Distance",
    "difficulty": "easy",
    "topic": "bit-manipulation",
    "companies": [
      "Amazon",
      "Google"
    ],
    "description": "Given two integers x and y, return the number of positions at which their binary representations differ. Input format: first line is the total count, second line has x and y.",
    "examples": [
      {
        "input": "2\n1 4",
        "output": "2",
        "explanation": "1 (0001) vs 4 (0100) differ in 2 positions."
      },
      {
        "input": "2\n3 1",
        "output": "1",
        "explanation": "3 (11) vs 1 (01) differ in 1 position."
      },
      {
        "input": "2\n0 0",
        "output": "0",
        "explanation": "Identical, distance 0."
      }
    ],
    "constraints": [
      "0 <= x, y <= 2^31 - 1",
      "Compare bits from the least significant position"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "2\n1 4",
        "expectedOutput": "2"
      },
      {
        "input": "2\n3 1",
        "expectedOutput": "1"
      },
      {
        "input": "2\n0 0",
        "expectedOutput": "0"
      },
      {
        "input": "2\n1 1",
        "expectedOutput": "0"
      },
      {
        "input": "2\n15 0",
        "expectedOutput": "4"
      },
      {
        "input": "2\n93 73",
        "expectedOutput": "2"
      },
      {
        "input": "2\n255 255",
        "expectedOutput": "0"
      },
      {
        "input": "2\n10 20",
        "expectedOutput": "4"
      },
      {
        "input": "2\n100 200",
        "expectedOutput": "4"
      },
      {
        "input": "2\n7 7",
        "expectedOutput": "0"
      },
      {
        "input": "2\n8 15",
        "expectedOutput": "3"
      },
      {
        "input": "2\n123 456",
        "expectedOutput": "6"
      }
    ]
  },
  {
    "id": "count-total-set-bits",
    "hints": ["Counting bit by bit up to n is too slow for large n. Look for a repeating cycle within each bit position.","For bit position i the pattern repeats every 2^(i+1) with exactly half ones; derive the formula and sum over all positions in O(log n)."],
    "returns": "int",
    "title": "Count Total Set Bits from 1 to N",
    "difficulty": "medium",
    "topic": "bit-manipulation",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Given n, count the total number of set bits in binary representations of all numbers from 1 to n. Input is n on the first line.",
    "examples": [
      {
        "input": "4",
        "output": "5",
        "explanation": "1(1)+2(1)+3(2)+4(1) = 5."
      },
      {
        "input": "1",
        "output": "1",
        "explanation": "Just 1, one set bit."
      },
      {
        "input": "0",
        "output": "0",
        "explanation": "n=0 gives 0."
      }
    ],
    "constraints": [
      "0 <= n <= 10^9",
      "Sum over all integers from 1 to n inclusive"
    ],
    "io": "int",
    "testCases": [
      {
        "input": "4",
        "expectedOutput": "5"
      },
      {
        "input": "1",
        "expectedOutput": "1"
      },
      {
        "input": "0",
        "expectedOutput": "0"
      },
      {
        "input": "7",
        "expectedOutput": "12"
      },
      {
        "input": "8",
        "expectedOutput": "13"
      },
      {
        "input": "10",
        "expectedOutput": "17"
      },
      {
        "input": "15",
        "expectedOutput": "32"
      },
      {
        "input": "100",
        "expectedOutput": "319"
      },
      {
        "input": "2",
        "expectedOutput": "2"
      },
      {
        "input": "3",
        "expectedOutput": "4"
      },
      {
        "input": "16",
        "expectedOutput": "33"
      },
      {
        "input": "1000",
        "expectedOutput": "4938"
      }
    ]
  },
  {
    "id": "swap-all-odd-even-bits",
    "hints": ["The odd-positioned bits and even-positioned bits can be separated with two masks before being swapped.","Isolate even bits with 0xAAAAAAAA and odd bits with 0x55555555, shift each group toward the other, then OR the results together."],
    "returns": "int",
    "title": "Swap All Odd and Even Bits",
    "difficulty": "easy",
    "topic": "bit-manipulation",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Given an unsigned integer, swap all odd and even bits. Input is n on the first line.",
    "examples": [
      {
        "input": "23",
        "output": "43",
        "explanation": "23 (10111) becomes 43 (101011)."
      },
      {
        "input": "2",
        "output": "1",
        "explanation": "2 (10) becomes 1 (01)."
      },
      {
        "input": "0",
        "output": "0",
        "explanation": "0 stays 0."
      }
    ],
    "constraints": [
      "0 <= n <= 2^32 - 1",
      "Bit positions are 0-indexed from the least significant bit"
    ],
    "io": "int",
    "testCases": [
      {
        "input": "23",
        "expectedOutput": "43"
      },
      {
        "input": "2",
        "expectedOutput": "1"
      },
      {
        "input": "0",
        "expectedOutput": "0"
      },
      {
        "input": "1",
        "expectedOutput": "2"
      },
      {
        "input": "255",
        "expectedOutput": "255"
      },
      {
        "input": "10",
        "expectedOutput": "5"
      },
      {
        "input": "16",
        "expectedOutput": "32"
      },
      {
        "input": "100",
        "expectedOutput": "152"
      },
      {
        "input": "4294967295",
        "expectedOutput": "4294967295"
      },
      {
        "input": "3",
        "expectedOutput": "3"
      },
      {
        "input": "170",
        "expectedOutput": "85"
      },
      {
        "input": "85",
        "expectedOutput": "170"
      }
    ]
  },
  {
    "id": "xor-1-to-n",
    "hints": ["Compute the XOR for n = 1 through 8 by hand and observe how the answer depends on n mod 4.","The result cycles with period 4: n, 1, n+1, 0 for remainders 0, 1, 2, 3 respectively, giving an O(1) answer."],
    "returns": "int",
    "title": "XOR of Numbers from 1 to N",
    "difficulty": "easy",
    "topic": "bit-manipulation",
    "companies": [
      "Amazon",
      "Google"
    ],
    "description": "Given n, compute the XOR of all numbers from 1 to n. Input is n on the first line.",
    "examples": [
      {
        "input": "5",
        "output": "1",
        "explanation": "1^2^3^4^5 = 1."
      },
      {
        "input": "1",
        "output": "1",
        "explanation": "XOR of just 1 is 1."
      },
      {
        "input": "0",
        "output": "0",
        "explanation": "Empty range gives 0."
      }
    ],
    "constraints": [
      "0 <= n <= 10^9",
      "XOR of an empty range (n = 0) is 0"
    ],
    "io": "int",
    "testCases": [
      {
        "input": "5",
        "expectedOutput": "1"
      },
      {
        "input": "1",
        "expectedOutput": "1"
      },
      {
        "input": "0",
        "expectedOutput": "0"
      },
      {
        "input": "4",
        "expectedOutput": "4"
      },
      {
        "input": "10",
        "expectedOutput": "11"
      },
      {
        "input": "100",
        "expectedOutput": "100"
      },
      {
        "input": "7",
        "expectedOutput": "0"
      },
      {
        "input": "8",
        "expectedOutput": "8"
      },
      {
        "input": "1000000000",
        "expectedOutput": "1000000000"
      },
      {
        "input": "2",
        "expectedOutput": "3"
      },
      {
        "input": "3",
        "expectedOutput": "0"
      },
      {
        "input": "6",
        "expectedOutput": "7"
      }
    ]
  }
,
{
    "id": "combination-sum",
    "hints": ["Decide for each candidate, in order, how many times to include it. A start index keeps every combination non-decreasing.","Backtrack over candidates from index i, adding the current candidate while the remaining target allows it; never move the index backwards to avoid duplicate permutations."],
    "returns": "intMat",
    "title": "Combination Sum",
    "difficulty": "medium",
    "topic": "backtracking",
    "companies": [
      "Adobe",
      "Amazon",
      "Microsoft"
    ],
    "description": "Given distinct integers candidates and a target, return all unique combinations (reuse allowed) that sum to target. Each combination lists numbers in non-decreasing order and combinations are sorted lexicographically.",
    "constraints": [
      "1 <= candidates.length <= 30",
      "2 <= candidates[i] <= 40",
      "1 <= target <= 500"
    ],
    "io": "array-target",
    "examples": [
      {
        "input": "4\n2 3 6 7\n7",
        "output": "2 2 3\n7",
        "explanation": "[2,2,3] and [7] both sum to 7."
      },
      {
        "input": "3\n2 3 5\n8",
        "output": "2 2 2 2\n2 3 3\n3 5",
        "explanation": "Three combinations sum to 8: [2,2,2,2], [2,3,3] and [3,5]."
      },
      {
        "input": "1\n2\n1",
        "output": "",
        "explanation": "No combination of [2] sums to 1, so the answer is empty."
      }
    ],
    "testCases": [
      {
        "input": "4\n2 3 6 7\n7",
        "expectedOutput": "2 2 3\n7"
      },
      {
        "input": "3\n2 3 5\n8",
        "expectedOutput": "2 2 2 2\n2 3 3\n3 5"
      },
      {
        "input": "1\n2\n1",
        "expectedOutput": ""
      },
      {
        "input": "2\n2 4\n7",
        "expectedOutput": ""
      },
      {
        "input": "3\n3 5 7\n9",
        "expectedOutput": "3 3 3"
      },
      {
        "input": "2\n1 2\n4",
        "expectedOutput": "1 1 1 1\n1 1 2\n2 2"
      },
      {
        "input": "1\n5\n10",
        "expectedOutput": "5 5"
      },
      {
        "input": "2\n2 3\n6",
        "expectedOutput": "2 2 2\n3 3"
      },
      {
        "input": "3\n7 3 2\n18",
        "expectedOutput": "2 2 2 2 2 2 2 2 2\n2 2 2 2 2 2 3 3\n2 2 2 2 3 7\n2 2 2 3 3 3 3\n2 2 7 7\n2 3 3 3 7\n3 3 3 3 3 3"
      },
      {
        "input": "3\n4 6 8\n16",
        "expectedOutput": "4 4 4 4\n4 4 8\n4 6 6\n8 8"
      },
      {
        "input": "2\n9 3\n12",
        "expectedOutput": "3 3 3 3\n3 9"
      },
      {
        "input": "4\n2 5 3 6\n10",
        "expectedOutput": "2 2 2 2 2\n2 2 3 3\n2 2 6\n2 3 5\n5 5"
      }
    ]
  },
  {
    "id": "crossword-puzzle",
    "hints": ["Find every maximal horizontal and vertical '-' slot on the board, then try fitting each word into a slot of matching length.","For each slot, test words whose length matches and whose pre-filled letters are compatible; place the word, recurse, and undo the placement on backtrack."],
    "returns": "string",
    "title": "Crossword Puzzle",
    "difficulty": "hard",
    "topic": "backtracking",
    "companies": [
      "Microsoft",
      "Amazon"
    ],
    "description": "Fill a crossword board. Input lines: first line is 'R W' (board rows, word count), next R lines are the board ('+' blocked, '-' empty), next W lines are the words. Return the solved board, one row per line.",
    "constraints": [
      "1 <= R, C <= 10",
      "Each word fits exactly one slot",
      "A solution always exists"
    ],
    "io": "string-array",
    "examples": [
      {
        "input": "3\n1 1\n-----\nHELLO",
        "output": "HELLO",
        "explanation": "Single horizontal slot of length 5 fits HELLO."
      },
      {
        "input": "6\n4 1\n-\n-\n-\n-\nCODE",
        "output": "C\nO\nD\nE",
        "explanation": "Single vertical slot of length 4 fits CODE top to bottom."
      },
      {
        "input": "6\n3 2\n--+\n+++\n---\nAT\nCAT",
        "output": "AT+\n+++\nCAT",
        "explanation": "Two separate rows of lengths 2 and 3 take AT and CAT."
      }
    ],
    "testCases": [
      {
        "input": "3\n1 1\n-----\nHELLO",
        "expectedOutput": "HELLO"
      },
      {
        "input": "6\n4 1\n-\n-\n-\n-\nCODE",
        "expectedOutput": "C\nO\nD\nE"
      },
      {
        "input": "6\n3 2\n--+\n+++\n---\nAT\nCAT",
        "expectedOutput": "AT+\n+++\nCAT"
      },
      {
        "input": "7\n3 3\n-+-\n---\n-+-\nCAT\nACE\nATE",
        "expectedOutput": "A+A\nCAT\nE+E"
      },
      {
        "input": "3\n1 1\n----\nTRIE",
        "expectedOutput": "TRIE"
      },
      {
        "input": "7\n3 3\n--+-\n-+++\n----\nDQ\nDZW\nWVAP",
        "expectedOutput": "DQ+-\nZ+++\nWVAP"
      },
      {
        "input": "8\n4 3\n+--\n-+-\n-+-\n-+-\nJT\nTCSG\nVCE",
        "expectedOutput": "+JT\nV+C\nC+S\nE+G"
      },
      {
        "input": "8\n4 3\n+---+\n+-+++\n-----\n+-+++\nQAQT\nAQBNC\nQLA",
        "expectedOutput": "+QLA+\n+A+++\nAQBNC\n+T+++"
      },
      {
        "input": "10\n5 4\n--+\n-+-\n---\n-+-\n-+-\nRD\nLQM\nUMSS\nRCLAK",
        "expectedOutput": "RD+\nC+U\nLQM\nA+S\nK+S"
      },
      {
        "input": "7\n3 3\n-+-++\n++-+-\n-----\nSQJTX\nXX\nWZJ",
        "expectedOutput": "-+W++\n++Z+X\nSQJTX"
      },
      {
        "input": "8\n4 3\n---\n+-+\n--+\n+-+\nNEC\nEVOV\nLO",
        "expectedOutput": "NEC\n+V+\nLO+\n+V+"
      },
      {
        "input": "7\n3 3\n-++-\n+-+-\n----\nHHS\nJY\nBYVS",
        "expectedOutput": "-++H\n+J+H\nBYVS"
      }
    ]
  },
  {
    "id": "longest-route-in-matrix-with-hurdles",
    "hints": ["You must explore every possible simple path, so mark visited cells as you go and unmark them when you return.","Run DFS from (0,0) tracking the current path length while skipping hurdles and visited cells; keep the maximum length among paths that reach the destination."],
    "returns": "int",
    "title": "Longest Possible Route in a Matrix with Hurdles",
    "difficulty": "medium",
    "topic": "backtracking",
    "companies": [
      "Microsoft",
      "Amazon"
    ],
    "description": "Given a binary matrix (1 = free, 0 = hurdle), find the longest path from the top-left cell (0,0) to the bottom-right cell moving 4-directionally without revisiting any cell. Return the number of cells in the path, or -1 if unreachable.",
    "constraints": [
      "1 <= R, C <= 4",
      "mat[i][j] is 0 or 1"
    ],
    "io": "matrix",
    "examples": [
      {
        "input": "3 3\n1 1 1\n1 1 1\n1 1 1",
        "output": "9",
        "explanation": "A 3x3 open grid: the longest simple path from (0,0) to (2,2) visits 9 cells."
      },
      {
        "input": "3 3\n1 0 1\n1 1 1\n1 1 1",
        "output": "7",
        "explanation": "The hurdle at (0,1) forces a detour; the longest path visits 7 cells."
      },
      {
        "input": "2 2\n1 1\n1 1",
        "output": "3",
        "explanation": "A 2x2 open grid has a longest path of 3 cells."
      }
    ],
    "testCases": [
      {
        "input": "3 3\n1 1 1\n1 1 1\n1 1 1",
        "expectedOutput": "9"
      },
      {
        "input": "3 3\n1 0 1\n1 1 1\n1 1 1",
        "expectedOutput": "7"
      },
      {
        "input": "2 2\n1 1\n1 1",
        "expectedOutput": "3"
      },
      {
        "input": "2 2\n1 0\n0 1",
        "expectedOutput": "-1"
      },
      {
        "input": "2 4\n1 1 1 1\n1 1 1 1",
        "expectedOutput": "7"
      },
      {
        "input": "3 3\n1 1 0\n0 1 1\n1 1 1",
        "expectedOutput": "5"
      },
      {
        "input": "1 1\n1",
        "expectedOutput": "1"
      },
      {
        "input": "1 1\n0",
        "expectedOutput": "-1"
      },
      {
        "input": "3 3\n1 1 1\n0 0 1\n1 1 1",
        "expectedOutput": "5"
      },
      {
        "input": "3 4\n1 0 1 1\n1 1 1 0\n0 1 1 1",
        "expectedOutput": "6"
      },
      {
        "input": "2 2\n1 1\n1 0",
        "expectedOutput": "-1"
      },
      {
        "input": "3 4\n1 1 1 1\n1 0 0 1\n1 1 1 1",
        "expectedOutput": "6"
      }
    ]
  },
  {
    "id": "n-queens",
    "hints": ["Place queens row by row. For each row, try every column and reject any that conflicts with queens already placed.","Track used columns and both diagonal directions with sets; when the row index reaches N, record the column positions as one solution."],
    "returns": "intMat",
    "title": "N-Queens",
    "difficulty": "hard",
    "topic": "backtracking",
    "companies": [
      "Accolite",
      "Amazon",
      "Microsoft",
      "Twitter"
    ],
    "description": "Place N queens on an NxN board so none attack another. Return every solution as an array of N column positions (one per row, 0-indexed), sorted lexicographically.",
    "constraints": [
      "1 <= n <= 8",
      "Solutions list one column index per row, 0-indexed"
    ],
    "io": "int",
    "examples": [
      {
        "input": "4",
        "output": "1 3 0 2\n2 0 3 1",
        "explanation": "n=4 has 2 solutions: queens at columns [1,3,0,2] and [2,0,3,1]."
      },
      {
        "input": "1",
        "output": "0",
        "explanation": "n=1 has exactly one solution: the queen at column 0."
      },
      {
        "input": "2",
        "output": "",
        "explanation": "n=2 has no valid placement, so the answer is empty."
      }
    ],
    "testCases": [
      {
        "input": "4",
        "expectedOutput": "1 3 0 2\n2 0 3 1"
      },
      {
        "input": "1",
        "expectedOutput": "0"
      },
      {
        "input": "2",
        "expectedOutput": ""
      },
      {
        "input": "3",
        "expectedOutput": ""
      },
      {
        "input": "5",
        "expectedOutput": "0 2 4 1 3\n0 3 1 4 2\n1 3 0 2 4\n1 4 2 0 3\n2 0 3 1 4\n2 4 1 3 0\n3 0 2 4 1\n3 1 4 2 0\n4 1 3 0 2\n4 2 0 3 1"
      },
      {
        "input": "6",
        "expectedOutput": "1 3 5 0 2 4\n2 5 1 4 0 3\n3 0 4 1 5 2\n4 2 0 5 3 1"
      },
      {
        "input": "7",
        "expectedOutput": "0 2 4 6 1 3 5\n0 3 6 2 5 1 4\n0 4 1 5 2 6 3\n0 5 3 1 6 4 2\n1 3 0 6 4 2 5\n1 3 5 0 2 4 6\n1 4 0 3 6 2 5\n1 4 2 0 6 3 5\n1 4 6 3 0 2 5\n1 5 2 6 3 0 4\n1 6 4 2 0 5 3\n2 0 5 1 4 6 3\n2 0 5 3 1 6 4\n2 4 6 1 3 5 0\n2 5 1 4 0 3 6\n2 6 1 3 5 0 4\n2 6 3 0 4 1 5\n3 0 2 5 1 6 4\n3 0 4 1 5 2 6\n3 1 6 4 2 0 5\n3 5 0 2 4 6 1\n3 6 2 5 1 4 0\n3 6 4 1 5 0 2\n4 0 3 6 2 5 1\n4 0 5 3 1 6 2\n4 1 5 2 6 3 0\n4 2 0 5 3 1 6\n4 6 1 3 5 0 2\n4 6 1 5 2 0 3\n5 0 2 4 6 1 3\n5 1 4 0 3 6 2\n5 2 0 3 6 4 1\n5 2 4 6 0 3 1\n5 2 6 3 0 4 1\n5 3 1 6 4 2 0\n5 3 6 0 2 4 1\n6 1 3 5 0 2 4\n6 2 5 1 4 0 3\n6 3 0 4 1 5 2\n6 4 2 0 5 3 1"
      },
      {
        "input": "8",
        "expectedOutput": "0 4 7 5 2 6 1 3\n0 5 7 2 6 3 1 4\n0 6 3 5 7 1 4 2\n0 6 4 7 1 3 5 2\n1 3 5 7 2 0 6 4\n1 4 6 0 2 7 5 3\n1 4 6 3 0 7 5 2\n1 5 0 6 3 7 2 4\n1 5 7 2 0 3 6 4\n1 6 2 5 7 4 0 3\n1 6 4 7 0 3 5 2\n1 7 5 0 2 4 6 3\n2 0 6 4 7 1 3 5\n2 4 1 7 0 6 3 5\n2 4 1 7 5 3 6 0\n2 4 6 0 3 1 7 5\n2 4 7 3 0 6 1 5\n2 5 1 4 7 0 6 3\n2 5 1 6 0 3 7 4\n2 5 1 6 4 0 7 3\n2 5 3 0 7 4 6 1\n2 5 3 1 7 4 6 0\n2 5 7 0 3 6 4 1\n2 5 7 0 4 6 1 3\n2 5 7 1 3 0 6 4\n2 6 1 7 4 0 3 5\n2 6 1 7 5 3 0 4\n2 7 3 6 0 5 1 4\n3 0 4 7 1 6 2 5\n3 0 4 7 5 2 6 1\n3 1 4 7 5 0 2 6\n3 1 6 2 5 7 0 4\n3 1 6 2 5 7 4 0\n3 1 6 4 0 7 5 2\n3 1 7 4 6 0 2 5\n3 1 7 5 0 2 4 6\n3 5 0 4 1 7 2 6\n3 5 7 1 6 0 2 4\n3 5 7 2 0 6 4 1\n3 6 0 7 4 1 5 2\n3 6 2 7 1 4 0 5\n3 6 4 1 5 0 2 7\n3 6 4 2 0 5 7 1\n3 7 0 2 5 1 6 4\n3 7 0 4 6 1 5 2\n3 7 4 2 0 6 1 5\n4 0 3 5 7 1 6 2\n4 0 7 3 1 6 2 5\n4 0 7 5 2 6 1 3\n4 1 3 5 7 2 0 6\n4 1 3 6 2 7 5 0\n4 1 5 0 6 3 7 2\n4 1 7 0 3 6 2 5\n4 2 0 5 7 1 3 6\n4 2 0 6 1 7 5 3\n4 2 7 3 6 0 5 1\n4 6 0 2 7 5 3 1\n4 6 0 3 1 7 5 2\n4 6 1 3 7 0 2 5\n4 6 1 5 2 0 3 7\n4 6 1 5 2 0 7 3\n4 6 3 0 2 7 5 1\n4 7 3 0 2 5 1 6\n4 7 3 0 6 1 5 2\n5 0 4 1 7 2 6 3\n5 1 6 0 2 4 7 3\n5 1 6 0 3 7 4 2\n5 2 0 6 4 7 1 3\n5 2 0 7 3 1 6 4\n5 2 0 7 4 1 3 6\n5 2 4 6 0 3 1 7\n5 2 4 7 0 3 1 6\n5 2 6 1 3 7 0 4\n5 2 6 1 7 4 0 3\n5 2 6 3 0 7 1 4\n5 3 0 4 7 1 6 2\n5 3 1 7 4 6 0 2\n5 3 6 0 2 4 1 7\n5 3 6 0 7 1 4 2\n5 7 1 3 0 6 4 2\n6 0 2 7 5 3 1 4\n6 1 3 0 7 4 2 5\n6 1 5 2 0 3 7 4\n6 2 0 5 7 4 1 3\n6 2 7 1 4 0 5 3\n6 3 1 4 7 0 2 5\n6 3 1 7 5 0 2 4\n6 4 2 0 5 7 1 3\n7 1 3 0 6 4 2 5\n7 1 4 2 0 6 3 5\n7 2 0 5 1 4 6 3\n7 3 0 2 5 1 6 4"
      },
      {
        "input": "4",
        "expectedOutput": "1 3 0 2\n2 0 3 1"
      },
      {
        "input": "5",
        "expectedOutput": "0 2 4 1 3\n0 3 1 4 2\n1 3 0 2 4\n1 4 2 0 3\n2 0 3 1 4\n2 4 1 3 0\n3 0 2 4 1\n3 1 4 2 0\n4 1 3 0 2\n4 2 0 3 1"
      },
      {
        "input": "1",
        "expectedOutput": "0"
      },
      {
        "input": "6",
        "expectedOutput": "1 3 5 0 2 4\n2 5 1 4 0 3\n3 0 4 1 5 2\n4 2 0 5 3 1"
      }
    ]
  },
  {
    "id": "sudoku-solver",
    "hints": ["Pick an empty cell, try each digit 1-9 that does not violate the row, column, or 3x3 box, then recurse.","Maintain row, column, and box occupancy sets for O(1) validity checks, and undo the digit when backtracking."],
    "returns": "intMat",
    "title": "Sudoku Solver",
    "difficulty": "hard",
    "topic": "backtracking",
    "companies": [
      "Amazon",
      "Microsoft",
      "Oracle",
      "Zoho"
    ],
    "description": "Solve a 9x9 Sudoku. Input uses 0 for empty cells. Return the completed board. Every puzzle has exactly one solution.",
    "constraints": [
      "board is 9x9",
      "Empty cells are 0",
      "Exactly one solution exists"
    ],
    "io": "matrix",
    "examples": [
      {
        "input": "9 9\n6 4 7 8 0 1 3 5 0\n4 9 0 2 0 8 5 7 0\n9 6 0 1 0 2 7 3 0\n2 1 0 7 0 5 9 6 0\n1 8 0 3 0 7 6 4 0\n8 2 0 5 0 3 4 9 0\n5 7 0 9 0 4 2 1 0\n7 3 0 6 0 9 1 8 0\n3 5 0 4 0 6 8 2 0",
        "output": "6 4 7 8 9 1 3 5 2\n4 9 3 2 6 8 5 7 1\n9 6 5 1 4 2 7 3 8\n2 1 4 7 8 5 9 6 3\n1 8 9 3 2 7 6 4 5\n8 2 6 5 1 3 4 9 7\n5 7 8 9 3 4 2 1 6\n7 3 2 6 5 9 1 8 4\n3 5 1 4 7 6 8 2 9",
        "explanation": "Fill the empty cells so each row, column and 3x3 box holds 1-9."
      },
      {
        "input": "9 9\n0 1 6 2 5 0 0 0 3\n7 6 9 5 4 0 0 0 0\n0 9 1 4 2 0 0 0 0\n0 8 7 9 1 0 0 0 0\n0 3 8 6 9 0 0 0 2\n0 7 3 1 6 5 0 0 0\n1 5 4 7 3 6 0 0 0\n0 2 5 8 7 0 4 0 0\n6 4 2 3 8 0 0 0 0",
        "output": "8 1 6 2 5 7 9 4 3\n7 6 9 5 4 3 1 2 8\n3 9 1 4 2 8 6 5 7\n4 8 7 9 1 2 3 6 5\n5 3 8 6 9 4 7 1 2\n2 7 3 1 6 5 8 9 4\n1 5 4 7 3 6 2 8 9\n9 2 5 8 7 1 4 3 6\n6 4 2 3 8 9 5 7 1",
        "explanation": "A harder puzzle with fewer clues, still uniquely solvable."
      },
      {
        "input": "9 9\n0 0 3 5 0 8 4 7 1\n0 5 2 8 0 9 0 1 6\n0 0 0 9 0 5 0 6 7\n0 0 0 6 0 7 5 4 3\n0 0 0 1 8 6 0 2 4\n0 0 0 7 0 1 0 3 2\n0 0 7 2 0 4 0 5 8\n0 0 0 4 6 3 0 8 9\n0 0 0 3 0 2 0 9 5",
        "output": "6 9 3 5 2 8 4 7 1\n7 5 2 8 4 9 3 1 6\n1 8 4 9 3 5 2 6 7\n2 1 8 6 9 7 5 4 3\n3 7 5 1 8 6 9 2 4\n4 6 9 7 5 1 8 3 2\n9 3 7 2 1 4 6 5 8\n5 2 1 4 6 3 7 8 9\n8 4 6 3 7 2 1 9 5",
        "explanation": "The completed board satisfies all Sudoku rules."
      }
    ],
    "testCases": [
      {
        "input": "9 9\n6 4 7 8 0 1 3 5 0\n4 9 0 2 0 8 5 7 0\n9 6 0 1 0 2 7 3 0\n2 1 0 7 0 5 9 6 0\n1 8 0 3 0 7 6 4 0\n8 2 0 5 0 3 4 9 0\n5 7 0 9 0 4 2 1 0\n7 3 0 6 0 9 1 8 0\n3 5 0 4 0 6 8 2 0",
        "expectedOutput": "6 4 7 8 9 1 3 5 2\n4 9 3 2 6 8 5 7 1\n9 6 5 1 4 2 7 3 8\n2 1 4 7 8 5 9 6 3\n1 8 9 3 2 7 6 4 5\n8 2 6 5 1 3 4 9 7\n5 7 8 9 3 4 2 1 6\n7 3 2 6 5 9 1 8 4\n3 5 1 4 7 6 8 2 9"
      },
      {
        "input": "9 9\n0 1 6 2 5 0 0 0 3\n7 6 9 5 4 0 0 0 0\n0 9 1 4 2 0 0 0 0\n0 8 7 9 1 0 0 0 0\n0 3 8 6 9 0 0 0 2\n0 7 3 1 6 5 0 0 0\n1 5 4 7 3 6 0 0 0\n0 2 5 8 7 0 4 0 0\n6 4 2 3 8 0 0 0 0",
        "expectedOutput": "8 1 6 2 5 7 9 4 3\n7 6 9 5 4 3 1 2 8\n3 9 1 4 2 8 6 5 7\n4 8 7 9 1 2 3 6 5\n5 3 8 6 9 4 7 1 2\n2 7 3 1 6 5 8 9 4\n1 5 4 7 3 6 2 8 9\n9 2 5 8 7 1 4 3 6\n6 4 2 3 8 9 5 7 1"
      },
      {
        "input": "9 9\n0 0 3 5 0 8 4 7 1\n0 5 2 8 0 9 0 1 6\n0 0 0 9 0 5 0 6 7\n0 0 0 6 0 7 5 4 3\n0 0 0 1 8 6 0 2 4\n0 0 0 7 0 1 0 3 2\n0 0 7 2 0 4 0 5 8\n0 0 0 4 6 3 0 8 9\n0 0 0 3 0 2 0 9 5",
        "expectedOutput": "6 9 3 5 2 8 4 7 1\n7 5 2 8 4 9 3 1 6\n1 8 4 9 3 5 2 6 7\n2 1 8 6 9 7 5 4 3\n3 7 5 1 8 6 9 2 4\n4 6 9 7 5 1 8 3 2\n9 3 7 2 1 4 6 5 8\n5 2 1 4 6 3 7 8 9\n8 4 6 3 7 2 1 9 5"
      },
      {
        "input": "9 9\n1 0 0 3 0 8 4 0 7\n0 0 0 9 0 3 6 2 4\n0 0 0 8 0 9 7 0 6\n0 0 3 2 0 5 8 0 9\n0 0 0 5 6 1 9 4 3\n0 0 0 1 4 2 3 0 8\n8 0 0 7 0 6 5 0 1\n3 0 0 4 0 7 2 9 5\n0 0 0 6 0 4 1 0 2",
        "expectedOutput": "1 9 6 3 2 8 4 5 7\n5 8 7 9 1 3 6 2 4\n2 3 4 8 5 9 7 1 6\n4 1 3 2 7 5 8 6 9\n7 2 8 5 6 1 9 4 3\n6 5 9 1 4 2 3 7 8\n8 4 2 7 9 6 5 3 1\n3 6 1 4 8 7 2 9 5\n9 7 5 6 3 4 1 8 2"
      },
      {
        "input": "9 9\n0 2 4 7 5 0 3 6 0\n0 9 2 5 1 0 6 8 0\n0 4 9 1 7 0 8 3 0\n0 8 6 9 4 0 5 1 0\n0 6 3 2 9 0 7 5 0\n0 3 8 4 2 0 1 7 0\n8 7 1 3 6 0 4 2 0\n0 1 5 8 3 0 9 4 0\n0 5 7 6 8 0 2 9 0",
        "expectedOutput": "1 2 4 7 5 8 3 6 9\n7 9 2 5 1 3 6 8 4\n5 4 9 1 7 6 8 3 2\n2 8 6 9 4 7 5 1 3\n4 6 3 2 9 1 7 5 8\n9 3 8 4 2 5 1 7 6\n8 7 1 3 6 9 4 2 5\n6 1 5 8 3 2 9 4 7\n3 5 7 6 8 4 2 9 1"
      },
      {
        "input": "9 9\n0 7 1 8 0 4 0 0 0\n5 1 9 2 0 8 7 0 0\n0 9 7 4 0 2 0 0 3\n0 2 4 3 0 6 0 0 1\n0 4 8 5 0 3 0 0 0\n9 8 2 6 0 5 0 0 0\n0 6 3 1 2 7 0 0 0\n0 3 5 9 0 1 0 0 0\n2 5 6 7 8 9 0 0 0",
        "expectedOutput": "3 7 1 8 6 4 9 2 5\n5 1 9 2 3 8 7 4 6\n6 9 7 4 5 2 1 8 3\n7 2 4 3 9 6 8 5 1\n1 4 8 5 7 3 2 6 9\n9 8 2 6 1 5 4 3 7\n4 6 3 1 2 7 5 9 8\n8 3 5 9 4 1 6 7 2\n2 5 6 7 8 9 3 1 4"
      },
      {
        "input": "9 9\n3 0 6 7 2 4 0 1 8\n6 0 4 5 7 0 0 8 9\n4 0 3 2 5 0 0 9 1\n1 0 8 6 3 0 0 7 5\n8 0 9 4 6 0 0 5 2\n9 0 1 3 4 0 0 2 7\n5 0 2 9 8 0 0 4 3\n2 0 7 1 9 0 0 3 6\n7 0 5 8 1 0 0 6 4",
        "expectedOutput": "3 9 6 7 2 4 5 1 8\n6 1 4 5 7 3 2 8 9\n4 8 3 2 5 6 7 9 1\n1 2 8 6 3 9 4 7 5\n8 7 9 4 6 1 3 5 2\n9 5 1 3 4 8 6 2 7\n5 6 2 9 8 7 1 4 3\n2 4 7 1 9 5 8 3 6\n7 3 5 8 1 2 9 6 4"
      },
      {
        "input": "9 9\n0 0 0 5 4 0 7 9 2\n0 0 0 4 8 0 0 3 9\n0 0 0 8 5 1 0 2 3\n0 0 0 1 6 0 0 8 4\n0 1 0 6 7 3 2 5 8\n0 0 0 7 1 2 0 4 5\n4 0 0 2 9 0 0 7 6\n0 0 0 9 3 0 0 1 7\n0 0 0 3 2 0 8 6 1",
        "expectedOutput": "1 8 3 5 4 6 7 9 2\n6 5 2 4 8 7 1 3 9\n7 4 9 8 5 1 6 2 3\n2 7 5 1 6 9 3 8 4\n9 1 4 6 7 3 2 5 8\n3 6 8 7 1 2 9 4 5\n4 3 1 2 9 8 5 7 6\n8 2 6 9 3 5 4 1 7\n5 9 7 3 2 4 8 6 1"
      },
      {
        "input": "9 9\n3 5 0 0 0 0 9 0 1\n2 3 0 0 5 0 7 8 9\n5 2 6 0 0 0 1 0 7\n9 1 2 0 7 0 4 0 8\n1 7 0 0 0 0 8 0 6\n7 9 0 3 0 0 6 0 4\n8 6 9 0 0 0 2 0 3\n4 8 0 0 0 0 5 0 2\n6 4 0 0 0 0 3 7 5",
        "expectedOutput": "3 5 8 4 2 7 9 6 1\n2 3 4 6 5 1 7 8 9\n5 2 6 8 3 9 1 4 7\n9 1 2 5 7 6 4 3 8\n1 7 3 2 9 4 8 5 6\n7 9 5 3 1 8 6 2 4\n8 6 9 7 4 5 2 1 3\n4 8 7 1 6 3 5 9 2\n6 4 1 9 8 2 3 7 5"
      },
      {
        "input": "9 9\n3 6 0 5 0 9 2 0 7\n6 8 0 1 0 5 7 0 4\n8 3 0 9 0 1 4 0 2\n1 9 0 7 0 2 3 0 6\n9 5 0 4 0 7 6 0 8\n5 1 0 2 0 4 8 0 3\n4 2 0 6 0 3 1 0 9\n7 4 9 3 0 8 5 0 1\n2 7 0 8 0 6 9 0 5",
        "expectedOutput": "3 6 4 5 8 9 2 1 7\n6 8 2 1 3 5 7 9 4\n8 3 7 9 6 1 4 5 2\n1 9 8 7 5 2 3 4 6\n9 5 3 4 1 7 6 2 8\n5 1 6 2 9 4 8 7 3\n4 2 5 6 7 3 1 8 9\n7 4 9 3 2 8 5 6 1\n2 7 1 8 4 6 9 3 5"
      },
      {
        "input": "9 9\n0 6 5 3 9 1 0 0 0\n0 5 2 9 8 0 0 0 0\n4 2 6 8 3 0 5 0 0\n0 8 3 4 7 0 0 0 0\n2 9 8 1 4 0 0 5 0\n5 3 9 7 1 0 0 0 0\n0 4 7 6 5 0 0 0 0\n0 7 1 5 2 0 0 3 0\n0 1 4 2 6 3 0 9 0",
        "expectedOutput": "7 6 5 3 9 1 2 4 8\n1 5 2 9 8 4 6 7 3\n4 2 6 8 3 7 5 1 9\n6 8 3 4 7 5 9 2 1\n2 9 8 1 4 6 3 5 7\n5 3 9 7 1 2 8 6 4\n3 4 7 6 5 9 1 8 2\n9 7 1 5 2 8 4 3 6\n8 1 4 2 6 3 7 9 5"
      },
      {
        "input": "9 9\n5 3 0 0 1 9 8 6 0\n3 2 0 0 7 1 4 8 0\n2 5 1 0 9 7 6 4 0\n4 6 0 0 2 3 7 1 0\n8 4 0 0 3 5 1 9 0\n6 8 0 0 5 2 9 7 0\n1 7 0 0 4 8 3 5 0\n7 9 0 0 6 4 2 3 0\n9 1 0 0 8 6 5 2 0",
        "expectedOutput": "5 3 7 4 1 9 8 6 2\n3 2 9 6 7 1 4 8 5\n2 5 1 8 9 7 6 4 3\n4 6 5 9 2 3 7 1 8\n8 4 2 7 3 5 1 9 6\n6 8 3 1 5 2 9 7 4\n1 7 6 2 4 8 3 5 9\n7 9 8 5 6 4 2 3 1\n9 1 4 3 8 6 5 2 7"
      }
    ]
  },
  {
    "id": "knights-tour",
    "hints": ["From each square, try all 8 knight moves to unvisited cells and backtrack when stuck. The order in which you try moves matters for speed.","Use Warnsdorff's heuristic: always move to the reachable square with the fewest onward moves, which prunes the search dramatically."],
    "returns": "intMat",
    "title": "Knight's Tour",
    "difficulty": "hard",
    "topic": "backtracking",
    "companies": [
      "IBM",
      "Amazon"
    ],
    "description": "Find a knight's tour on an NxN board starting at (0,0): visit every cell exactly once with knight moves. Return the board where each cell holds its move number (0 to N*N-1). If no tour exists return [[-1]].",
    "constraints": [
      "1 <= n <= 8",
      "Tour starts at (0,0)"
    ],
    "io": "int",
    "examples": [
      {
        "input": "1",
        "output": "0",
        "explanation": "n=1: the single cell is move 0."
      },
      {
        "input": "5",
        "output": "0 19 8 13 2\n9 14 1 18 23\n20 7 22 3 12\n15 10 5 24 17\n6 21 16 11 4",
        "explanation": "n=5: a full 25-move tour starting at the top-left corner."
      },
      {
        "input": "2",
        "output": "-1",
        "explanation": "n=2: no knight's tour exists."
      }
    ],
    "testCases": [
      {
        "input": "1",
        "expectedOutput": "0"
      },
      {
        "input": "5",
        "expectedOutput": "0 19 8 13 2\n9 14 1 18 23\n20 7 22 3 12\n15 10 5 24 17\n6 21 16 11 4"
      },
      {
        "input": "2",
        "expectedOutput": "-1"
      },
      {
        "input": "3",
        "expectedOutput": "-1"
      },
      {
        "input": "4",
        "expectedOutput": "-1"
      },
      {
        "input": "6",
        "expectedOutput": "0 27 8 19 2 29\n9 20 1 28 15 18\n34 7 26 17 30 3\n21 10 33 14 25 16\n6 35 12 23 4 31\n11 22 5 32 13 24"
      },
      {
        "input": "5",
        "expectedOutput": "0 19 8 13 2\n9 14 1 18 23\n20 7 22 3 12\n15 10 5 24 17\n6 21 16 11 4"
      },
      {
        "input": "7",
        "expectedOutput": "0 29 16 33 2 39 26\n17 32 1 28 25 34 3\n30 15 42 35 38 27 40\n43 18 31 24 41 4 37\n14 21 44 47 36 7 10\n19 46 23 12 9 48 5\n22 13 20 45 6 11 8"
      },
      {
        "input": "8",
        "expectedOutput": "0 15 30 39 2 17 20 55\n29 38 1 16 41 54 3 18\n14 31 40 45 52 19 56 21\n37 28 47 42 57 44 53 4\n32 13 36 51 46 59 22 61\n27 48 33 58 43 62 5 8\n12 35 50 25 10 7 60 23\n49 26 11 34 63 24 9 6"
      },
      {
        "input": "1",
        "expectedOutput": "0"
      },
      {
        "input": "6",
        "expectedOutput": "0 27 8 19 2 29\n9 20 1 28 15 18\n34 7 26 17 30 3\n21 10 33 14 25 16\n6 35 12 23 4 31\n11 22 5 32 13 24"
      },
      {
        "input": "7",
        "expectedOutput": "0 29 16 33 2 39 26\n17 32 1 28 25 34 3\n30 15 42 35 38 27 40\n43 18 31 24 41 4 37\n14 21 44 47 36 7 10\n19 46 23 12 9 48 5\n22 13 20 45 6 11 8"
      }
    ]
  },
  {
    "id": "remove-invalid-parentheses",
    "hints": ["First compute the minimum number of removals required, then generate all strings reachable by removing exactly that many characters.","Use DFS or BFS that removes one parenthesis at a time, skipping duplicates with a visited set or by skipping consecutive identical characters."],
    "returns": "string",
    "title": "Remove Invalid Parentheses",
    "difficulty": "hard",
    "topic": "backtracking",
    "companies": [
      "Uber",
      "Google"
    ],
    "description": "Remove the minimum number of parentheses to make the string valid. Return all possible results, one per line, sorted lexicographically.",
    "constraints": [
      "1 <= s.length <= 20",
      "s has '(' , ')' and lowercase letters"
    ],
    "io": "string",
    "examples": [
      {
        "input": "()())()",
        "output": "(())()\n()()()",
        "explanation": "Removing one parenthesis yields (())() and ()()()."
      },
      {
        "input": "(a)())()",
        "output": "(a())()\n(a)()()",
        "explanation": "Two minimal removals give (a())() and (a)()()."
      },
      {
        "input": ")(",
        "output": "",
        "explanation": "The only fix is the empty string."
      }
    ],
    "testCases": [
      {
        "input": "()())()",
        "expectedOutput": "(())()\n()()()"
      },
      {
        "input": "(a)())()",
        "expectedOutput": "(a())()\n(a)()()"
      },
      {
        "input": ")(",
        "expectedOutput": ""
      },
      {
        "input": "()()",
        "expectedOutput": "()()"
      },
      {
        "input": "(()",
        "expectedOutput": "()"
      },
      {
        "input": ")()(",
        "expectedOutput": "()"
      },
      {
        "input": "((()",
        "expectedOutput": "()"
      },
      {
        "input": "()(()",
        "expectedOutput": "()()"
      },
      {
        "input": "())(()",
        "expectedOutput": "()()"
      },
      {
        "input": "(()())",
        "expectedOutput": "(()())"
      },
      {
        "input": ")a(b)c(",
        "expectedOutput": "a(b)c"
      },
      {
        "input": "(a(b(c)d)",
        "expectedOutput": "(a(bc)d)\n(ab(c)d)\na(b(c)d)"
      }
    ]
  },
  {
    "id": "palindromic-partitioning",
    "hints": ["Build the partition left to right: at each step take a palindromic prefix, then recursively partition the remaining suffix.","Precompute which substrings are palindromes with a DP table or expand-around-center so each palindromicity check is O(1) during backtracking."],
    "returns": "string",
    "title": "Palindromic Partitioning",
    "difficulty": "medium",
    "topic": "backtracking",
    "companies": [
      "Facebook",
      "Amazon",
      "Microsoft"
    ],
    "description": "Partition the string so every piece is a palindrome. Return all partitions: pieces joined by ',', partitions one per line, sorted lexicographically.",
    "constraints": [
      "1 <= s.length <= 12",
      "s has lowercase letters"
    ],
    "io": "string",
    "examples": [
      {
        "input": "aab",
        "output": "a,a,b\naa,b",
        "explanation": "aab splits as [a,a,b] and [aa,b]."
      },
      {
        "input": "a",
        "output": "a",
        "explanation": "A single character is one partition."
      },
      {
        "input": "efe",
        "output": "e,f,e\nefe",
        "explanation": "efe splits as [e,f,e] and [efe]."
      }
    ],
    "testCases": [
      {
        "input": "aab",
        "expectedOutput": "a,a,b\naa,b"
      },
      {
        "input": "a",
        "expectedOutput": "a"
      },
      {
        "input": "efe",
        "expectedOutput": "e,f,e\nefe"
      },
      {
        "input": "nitin",
        "expectedOutput": "n,i,t,i,n\nn,iti,n\nnitin"
      },
      {
        "input": "abba",
        "expectedOutput": "a,b,b,a\na,bb,a\nabba"
      },
      {
        "input": "racecar",
        "expectedOutput": "r,a,c,e,c,a,r\nr,a,cec,a,r\nr,aceca,r\nracecar"
      },
      {
        "input": "aa",
        "expectedOutput": "a,a\naa"
      },
      {
        "input": "aba",
        "expectedOutput": "a,b,a\naba"
      },
      {
        "input": "abcba",
        "expectedOutput": "a,b,c,b,a\na,bcb,a\nabcba"
      },
      {
        "input": "aabbaa",
        "expectedOutput": "a,a,b,b,a,a\na,a,b,b,aa\na,a,bb,a,a\na,a,bb,aa\na,abba,a\naa,b,b,a,a\naa,b,b,aa\naa,bb,a,a\naa,bb,aa\naabbaa"
      },
      {
        "input": "madam",
        "expectedOutput": "m,a,d,a,m\nm,ada,m\nmadam"
      },
      {
        "input": "noon",
        "expectedOutput": "n,o,o,n\nn,oo,n\nnoon"
      }
    ]
  },
  {
    "id": "shortest-safe-route-in-matrix-with-landmines",
    "hints": ["First mark every landmine's four neighbours as unsafe; the problem then becomes a shortest path over the safe cells.","After preprocessing the unsafe grid, run multi-source BFS starting from all safe cells in the first column simultaneously."],
    "returns": "int",
    "title": "Shortest Safe Route in a Matrix with Landmines",
    "difficulty": "medium",
    "topic": "backtracking",
    "companies": [
      "Facebook",
      "Amazon",
      "Microsoft"
    ],
    "description": "A 0 marks a landmine; any cell adjacent (4-directional) to a landmine is unsafe. Find the shortest safe path from any cell in the first column to any cell in the last column. Return the number of steps, or -1 if impossible.",
    "constraints": [
      "1 <= R, C <= 6",
      "mat[i][j] is 0 or 1"
    ],
    "io": "matrix",
    "examples": [
      {
        "input": "3 4\n1 1 1 1\n1 1 1 1\n1 1 1 1",
        "output": "3",
        "explanation": "An open 3x4 grid: 3 steps straight across any row."
      },
      {
        "input": "3 4\n1 1 1 0\n1 1 1 1\n1 1 1 1",
        "output": "3",
        "explanation": "The landmine at (0,3) makes its neighbours unsafe; the shortest route is 3 steps along row 1."
      },
      {
        "input": "3 3\n0 1 1\n1 1 1\n1 1 1",
        "output": "2",
        "explanation": "The landmine at (0,0) blocks rows 0 and 1 of column 0; the only safe start is row 2, giving 2 steps."
      }
    ],
    "testCases": [
      {
        "input": "3 4\n1 1 1 1\n1 1 1 1\n1 1 1 1",
        "expectedOutput": "3"
      },
      {
        "input": "3 4\n1 1 1 0\n1 1 1 1\n1 1 1 1",
        "expectedOutput": "3"
      },
      {
        "input": "3 3\n0 1 1\n1 1 1\n1 1 1",
        "expectedOutput": "2"
      },
      {
        "input": "3 3\n1 0 1\n1 1 1\n1 1 1",
        "expectedOutput": "2"
      },
      {
        "input": "2 2\n1 1\n1 1",
        "expectedOutput": "1"
      },
      {
        "input": "2 2\n0 0\n0 0",
        "expectedOutput": "-1"
      },
      {
        "input": "3 3\n1 1 1\n1 0 1\n1 1 1",
        "expectedOutput": "-1"
      },
      {
        "input": "3 5\n1 1 1 1 1\n1 1 0 1 1\n1 1 1 1 1",
        "expectedOutput": "-1"
      },
      {
        "input": "3 4\n1 0 1 1\n1 1 1 1\n1 1 0 1",
        "expectedOutput": "-1"
      },
      {
        "input": "3 3\n1 1 1\n0 1 0\n1 1 1",
        "expectedOutput": "-1"
      },
      {
        "input": "3 4\n1 1 0 1\n1 1 1 1\n0 1 1 1",
        "expectedOutput": "-1"
      },
      {
        "input": "4 4\n1 1 1 1\n1 0 0 1\n1 1 1 1\n1 1 1 1",
        "expectedOutput": "3"
      }
    ]
  },
  {
    "id": "partition-array-into-k-equal-subsets",
    "hints": ["If the total sum is not divisible by k, the answer is immediately false. Otherwise fill k buckets of equal target sum one element at a time.","Sort the array in descending order and backtrack assigning each number to a bucket; skip symmetric empty buckets and stop once k-1 buckets are complete."],
    "returns": "bool",
    "title": "Partition Array into K Equal Subsets",
    "difficulty": "medium",
    "topic": "backtracking",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Decide whether the array can be split into k non-empty subsets with equal sums.",
    "constraints": [
      "1 <= arr.length <= 12",
      "1 <= arr[i] <= 50",
      "1 <= k <= arr.length"
    ],
    "io": "array-k",
    "examples": [
      {
        "input": "7\n4 3 2 3 5 2 1\n4",
        "output": "true",
        "explanation": "Splits into [5],[1,4],[2,3],[2,3] each summing to 5."
      },
      {
        "input": "4\n1 2 3 4\n3",
        "output": "false",
        "explanation": "Total 10 is not divisible by 3."
      },
      {
        "input": "8\n2 2 2 2 3 3 3 3\n2",
        "output": "true",
        "explanation": "Splits into two groups of 10: [2,2,3,3] and [2,2,3,3]."
      }
    ],
    "testCases": [
      {
        "input": "7\n4 3 2 3 5 2 1\n4",
        "expectedOutput": "true"
      },
      {
        "input": "4\n1 2 3 4\n3",
        "expectedOutput": "false"
      },
      {
        "input": "8\n2 2 2 2 3 3 3 3\n2",
        "expectedOutput": "true"
      },
      {
        "input": "8\n1 1 1 1 2 2 2 2\n4",
        "expectedOutput": "true"
      },
      {
        "input": "3\n5 5 5\n3",
        "expectedOutput": "true"
      },
      {
        "input": "3\n1 2 3\n2",
        "expectedOutput": "true"
      },
      {
        "input": "9\n10 10 10 7 7 7 7 7 7\n3",
        "expectedOutput": "true"
      },
      {
        "input": "4\n4 4 4 4\n2",
        "expectedOutput": "true"
      },
      {
        "input": "4\n1 5 11 5\n2",
        "expectedOutput": "true"
      },
      {
        "input": "6\n3 3 3 3 3 3\n3",
        "expectedOutput": "true"
      },
      {
        "input": "4\n2 2 1 1\n4",
        "expectedOutput": "false"
      },
      {
        "input": "5\n7 3 2 5 8\n3",
        "expectedOutput": "false"
      }
    ]
  },
  {
    "id": "hamiltonian-cycle",
    "hints": ["Build the path vertex by vertex starting from vertex 0, extending only to unvisited neighbours.","Backtrack with a visited array; when every vertex is used, check the adjacency matrix for an edge back to the start vertex."],
    "returns": "bool",
    "title": "Hamiltonian Cycle",
    "difficulty": "medium",
    "topic": "backtracking",
    "companies": [
      "Amazon",
      "Google"
    ],
    "description": "Given an undirected graph as an adjacency matrix, decide whether a Hamiltonian cycle exists: a cycle visiting every vertex exactly once and returning to the start.",
    "constraints": [
      "2 <= n <= 7",
      "adj[i][j] is 0 or 1"
    ],
    "io": "matrix",
    "examples": [
      {
        "input": "4 4\n0 1 0 1\n1 0 1 0\n0 1 0 1\n1 0 1 0",
        "output": "true",
        "explanation": "A 4-cycle graph trivially has a Hamiltonian cycle."
      },
      {
        "input": "4 4\n0 1 0 0\n1 0 1 0\n0 1 0 1\n0 0 1 0",
        "output": "false",
        "explanation": "A 4-vertex path cannot return to its start."
      },
      {
        "input": "5 5\n0 1 0 0 1\n1 0 1 0 0\n0 1 0 1 0\n0 0 1 0 1\n1 0 0 1 0",
        "output": "true",
        "explanation": "A 5-cycle graph has a Hamiltonian cycle."
      }
    ],
    "testCases": [
      {
        "input": "4 4\n0 1 0 1\n1 0 1 0\n0 1 0 1\n1 0 1 0",
        "expectedOutput": "true"
      },
      {
        "input": "4 4\n0 1 0 0\n1 0 1 0\n0 1 0 1\n0 0 1 0",
        "expectedOutput": "false"
      },
      {
        "input": "5 5\n0 1 0 0 1\n1 0 1 0 0\n0 1 0 1 0\n0 0 1 0 1\n1 0 0 1 0",
        "expectedOutput": "true"
      },
      {
        "input": "4 4\n0 1 1 0\n1 0 1 1\n1 1 0 1\n0 1 1 0",
        "expectedOutput": "true"
      },
      {
        "input": "4 4\n0 1 0 0\n1 0 1 0\n0 1 0 1\n0 0 1 0",
        "expectedOutput": "false"
      },
      {
        "input": "6 6\n0 1 0 0 0 1\n1 0 1 0 0 0\n0 1 0 1 0 0\n0 0 1 0 1 0\n0 0 0 1 0 1\n1 0 0 0 1 0",
        "expectedOutput": "true"
      },
      {
        "input": "4 4\n0 1 1 1\n1 0 1 0\n1 1 0 1\n1 0 1 0",
        "expectedOutput": "true"
      },
      {
        "input": "5 5\n0 1 0 0 0\n1 0 1 0 0\n0 1 0 1 0\n0 0 1 0 1\n0 0 0 1 0",
        "expectedOutput": "false"
      },
      {
        "input": "5 5\n0 1 0 1 1\n1 0 1 0 0\n0 1 0 1 0\n1 0 1 0 1\n1 0 0 1 0",
        "expectedOutput": "true"
      },
      {
        "input": "3 3\n0 1 1\n1 0 1\n1 1 0",
        "expectedOutput": "true"
      },
      {
        "input": "5 5\n0 1 1 0 0\n1 0 0 0 0\n1 0 0 1 1\n0 0 1 0 1\n0 0 1 1 0",
        "expectedOutput": "false"
      },
      {
        "input": "7 7\n0 1 0 0 0 0 1\n1 0 1 0 0 0 0\n0 1 0 1 0 0 0\n0 0 1 0 1 0 0\n0 0 0 1 0 1 0\n0 0 0 0 1 0 1\n1 0 0 0 0 1 0",
        "expectedOutput": "true"
      }
    ]
  },
  {
    "id": "tug-of-war",
    "hints": ["Choose exactly n/2 elements for team A and let the rest form team B, then try every valid split.","Backtrack including or excluding each element while tracking team size and both sums; prune branches using the best difference found so far."],
    "returns": "int",
    "title": "Tug of War",
    "difficulty": "medium",
    "topic": "backtracking",
    "companies": [
      "Google",
      "Amazon"
    ],
    "description": "Split the array into two teams whose sizes differ by at most one so the absolute difference of their sums is minimized. Return that minimum difference.",
    "constraints": [
      "2 <= arr.length <= 14",
      "-100 <= arr[i] <= 100"
    ],
    "io": "array",
    "examples": [
      {
        "input": "10\n3 4 5 -3 100 1 89 54 23 20",
        "output": "0",
        "explanation": "The best split of the 10 numbers leaves a minimum difference of 0."
      },
      {
        "input": "4\n1 2 3 4",
        "output": "0",
        "explanation": "[1,4] vs [2,3] gives difference 0."
      },
      {
        "input": "4\n1 6 11 5",
        "output": "1",
        "explanation": "[1,11] vs [6,5] gives difference 1."
      }
    ],
    "testCases": [
      {
        "input": "10\n3 4 5 -3 100 1 89 54 23 20",
        "expectedOutput": "0"
      },
      {
        "input": "4\n1 2 3 4",
        "expectedOutput": "0"
      },
      {
        "input": "4\n1 6 11 5",
        "expectedOutput": "1"
      },
      {
        "input": "6\n2 48 18 16 15 9",
        "expectedOutput": "10"
      },
      {
        "input": "6\n44 48 35 6 38 28",
        "expectedOutput": "3"
      },
      {
        "input": "6\n2 6 14 15 33 39",
        "expectedOutput": "1"
      },
      {
        "input": "6\n36 13 46 42 45 35",
        "expectedOutput": "9"
      },
      {
        "input": "12\n15 29 38 18 1 49 11 45 28 22 18 10",
        "expectedOutput": "0"
      },
      {
        "input": "8\n49 22 7 6 25 7 23 23",
        "expectedOutput": "6"
      },
      {
        "input": "14\n17 3 47 30 35 8 25 6 36 19 41 40 24 37",
        "expectedOutput": "0"
      },
      {
        "input": "8\n46 5 3 43 15 50 19 6",
        "expectedOutput": "7"
      },
      {
        "input": "8\n7 25 18 30 41 24 11 24",
        "expectedOutput": "0"
      }
    ]
  },
  {
    "id": "maximum-number-by-k-swaps",
    "hints": ["At each position, consider swapping in the largest digit available later in the string; each swap is one decision with k total allowed.","Recursively try swapping the current position with every later position holding the maximum digit, decrementing k each time, and undo the swap on backtrack."],
    "returns": "string",
    "title": "Maximum Number by At Most K Swaps",
    "difficulty": "medium",
    "topic": "backtracking",
    "companies": [
      "Amazon",
      "Adobe",
      "Accolite",
      "Traveloka"
    ],
    "description": "Given a string of digits and k, swap any two digits at most k times to form the largest possible number. Return it as a string.",
    "constraints": [
      "1 <= s.length <= 8",
      "s has digits",
      "0 <= k <= 5"
    ],
    "io": "string-int",
    "examples": [
      {
        "input": "129814999\n4",
        "output": "999984211",
        "explanation": "Four swaps turn 129814999 into 999984211."
      },
      {
        "input": "254\n1",
        "output": "524",
        "explanation": "One swap on 254 gives 524."
      },
      {
        "input": "254\n2",
        "output": "542",
        "explanation": "Two swaps on 254 give the fully sorted 542."
      }
    ],
    "testCases": [
      {
        "input": "129814999\n4",
        "expectedOutput": "999984211"
      },
      {
        "input": "254\n1",
        "expectedOutput": "524"
      },
      {
        "input": "254\n2",
        "expectedOutput": "542"
      },
      {
        "input": "12345\n1",
        "expectedOutput": "52341"
      },
      {
        "input": "999\n2",
        "expectedOutput": "999"
      },
      {
        "input": "100\n1",
        "expectedOutput": "100"
      },
      {
        "input": "4321\n2",
        "expectedOutput": "4321"
      },
      {
        "input": "11112\n2",
        "expectedOutput": "21111"
      },
      {
        "input": "9837\n1",
        "expectedOutput": "9873"
      },
      {
        "input": "10200\n2",
        "expectedOutput": "21000"
      },
      {
        "input": "56789\n3",
        "expectedOutput": "98765"
      },
      {
        "input": "909\n1",
        "expectedOutput": "990"
      }
    ]
  },
  {
    "id": "cryptarithmetic-puzzles",
    "hints": ["Treat it as assigning digits to letters under column-by-column addition constraints, trying the most constrained letters first.","Backtrack over the distinct letters, pruning with partial column sums, the no-leading-zero rule, and the all-different constraint."],
    "returns": "string",
    "title": "Solving Cryptarithmetic Puzzles",
    "difficulty": "hard",
    "topic": "backtracking",
    "companies": [
      "Goldman Sachs",
      "Amazon"
    ],
    "description": "Input is one line like SEND+MORE=MONEY. Assign a distinct digit to each letter (no leading zeros) so the addition holds. Return the solved equation like 9567+1085=10652, or NO SOLUTION.",
    "constraints": [
      "Expression has form WORD+WORD=WORD",
      "At most 10 distinct letters",
      "No leading zeros"
    ],
    "io": "string",
    "examples": [
      {
        "input": "SEND+MORE=MONEY",
        "output": "9567+1085=10652",
        "explanation": "The classic: 9567+1085=10652."
      },
      {
        "input": "TWO+TWO=FOUR",
        "output": "734+734=1468",
        "explanation": "734+734=1468."
      },
      {
        "input": "A+B=C",
        "output": "1+2=3",
        "explanation": "The smallest puzzle solves as 1+2=3."
      }
    ],
    "testCases": [
      {
        "input": "SEND+MORE=MONEY",
        "expectedOutput": "9567+1085=10652"
      },
      {
        "input": "TWO+TWO=FOUR",
        "expectedOutput": "734+734=1468"
      },
      {
        "input": "A+B=C",
        "expectedOutput": "1+2=3"
      },
      {
        "input": "BASE+BALL=GAMES",
        "expectedOutput": "7483+7455=14938"
      },
      {
        "input": "NO+NO=YES",
        "expectedOutput": "52+52=104"
      },
      {
        "input": "AB+CD=EFG",
        "expectedOutput": "42+63=105"
      },
      {
        "input": "DONALD+GERALD=ROBERT",
        "expectedOutput": "526485+197485=723970"
      },
      {
        "input": "AT+BAT=CAT",
        "expectedOutput": "NO SOLUTION"
      },
      {
        "input": "XY+YX=ZZZ",
        "expectedOutput": "NO SOLUTION"
      },
      {
        "input": "CROSS+ROADS=DANGER",
        "expectedOutput": "96233+62513=158746"
      },
      {
        "input": "EAT+THAT=APPLE",
        "expectedOutput": "819+9219=10038"
      },
      {
        "input": "UP+UP=DOWN",
        "expectedOutput": "NO SOLUTION"
      }
    ]
  },
  {
    "id": "corner-to-middle-cell-paths-in-maze",
    "hints": ["Count every simple path from the corner to the middle cell: explore all four directions while marking cells visited to avoid cycles.","Run DFS with a visited matrix, incrementing the counter when the middle cell is reached and unmarking the cell on backtrack."],
    "returns": "int",
    "title": "Paths from Corner Cell to Middle Cell in Maze",
    "difficulty": "medium",
    "topic": "backtracking",
    "companies": [
      "Meta",
      "Google"
    ],
    "description": "Count all simple paths from the top-left corner (0,0) to the middle cell (R//2, C//2), moving 4-directionally through cells with value 1 without revisiting any cell.",
    "constraints": [
      "1 <= R, C <= 3",
      "mat[i][j] is 0 or 1"
    ],
    "io": "matrix",
    "examples": [
      {
        "input": "3 3\n1 1 1\n1 1 1\n1 1 1",
        "output": "8",
        "explanation": "An open 3x3 grid has 8 simple paths from (0,0) to the centre (1,1)."
      },
      {
        "input": "3 3\n1 1 1\n1 0 1\n1 1 1",
        "output": "0",
        "explanation": "Blocking the centre leaves 0 paths."
      },
      {
        "input": "3 3\n1 0 1\n1 1 1\n1 1 1",
        "output": "3",
        "explanation": "With (0,1) blocked there are 3 paths to the centre."
      }
    ],
    "testCases": [
      {
        "input": "3 3\n1 1 1\n1 1 1\n1 1 1",
        "expectedOutput": "8"
      },
      {
        "input": "3 3\n1 1 1\n1 0 1\n1 1 1",
        "expectedOutput": "0"
      },
      {
        "input": "3 3\n1 0 1\n1 1 1\n1 1 1",
        "expectedOutput": "3"
      },
      {
        "input": "2 2\n1 1\n1 1",
        "expectedOutput": "2"
      },
      {
        "input": "1 1\n1",
        "expectedOutput": "1"
      },
      {
        "input": "2 2\n0 1\n1 1",
        "expectedOutput": "0"
      },
      {
        "input": "3 3\n1 1 0\n1 1 1\n0 1 1",
        "expectedOutput": "2"
      },
      {
        "input": "3 3\n1 0 0\n1 1 0\n1 1 1",
        "expectedOutput": "2"
      },
      {
        "input": "3 3\n1 1 1\n0 1 0\n1 1 1",
        "expectedOutput": "1"
      },
      {
        "input": "2 2\n1 1\n0 1",
        "expectedOutput": "1"
      },
      {
        "input": "3 3\n1 0 1\n0 1 0\n1 0 1",
        "expectedOutput": "0"
      },
      {
        "input": "3 3\n1 1 1\n1 1 0\n1 0 1",
        "expectedOutput": "2"
      }
    ]
  },
  {
    "id": "construct-trie-from-scratch",
    "hints": ["Build a tree where each edge represents a character and each node records whether a word ends at that point.","Implement nodes with a children map and an end-of-word flag; insert walks or creates nodes, search checks the end flag, and startsWith only verifies the path exists."],
    "returns": "intArr",
    "title": "Construct a Trie from Scratch",
    "difficulty": "medium",
    "topic": "tries",
    "companies": [
      "Accolite",
      "Amazon",
      "Microsoft",
      "FactSet"
    ],
    "description": "Process operations on a Trie, one per input line: 'insert:word', 'search:word' (1 if the exact word was inserted else 0) and 'startsWith:prefix' (1 if any inserted word has the prefix else 0). Return the answers for search/startsWith operations in order, space-separated.",
    "constraints": [
      "1 <= operations <= 50",
      "words have lowercase letters"
    ],
    "io": "string-array",
    "examples": [
      {
        "input": "6\ninsert:apple\nsearch:apple\nsearch:app\nstartsWith:app\ninsert:app\nsearch:app",
        "output": "1 0 1 1",
        "explanation": "apple inserted: search apple=1, app=0, prefix app=1; after inserting app, search app=1."
      },
      {
        "input": "5\ninsert:hello\ninsert:world\nsearch:hell\nstartsWith:wor\nsearch:world",
        "output": "0 1 1",
        "explanation": "hell was never inserted (0); 'wor' is a prefix of world (1); world found (1)."
      },
      {
        "input": "4\nsearch:abc\nstartsWith:a\ninsert:abc\nsearch:abc",
        "output": "0 0 1",
        "explanation": "Empty trie answers 0; after inserting abc, search abc=1."
      }
    ],
    "testCases": [
      {
        "input": "6\ninsert:apple\nsearch:apple\nsearch:app\nstartsWith:app\ninsert:app\nsearch:app",
        "expectedOutput": "1 0 1 1"
      },
      {
        "input": "5\ninsert:hello\ninsert:world\nsearch:hell\nstartsWith:wor\nsearch:world",
        "expectedOutput": "0 1 1"
      },
      {
        "input": "4\nsearch:abc\nstartsWith:a\ninsert:abc\nsearch:abc",
        "expectedOutput": "0 0 1"
      },
      {
        "input": "8\ninsert:a\ninsert:ab\ninsert:abc\nsearch:a\nsearch:ab\nsearch:abc\nsearch:abcd\nstartsWith:abcd",
        "expectedOutput": "1 1 1 0 0"
      },
      {
        "input": "6\ninsert:dog\ninsert:cat\nstartsWith:do\nstartsWith:ca\nsearch:dog\nsearch:bat",
        "expectedOutput": "1 1 1 0"
      },
      {
        "input": "5\ninsert:trie\ninsert:tries\nsearch:trie\nsearch:tries\nstartsWith:tri",
        "expectedOutput": "1 1 1"
      },
      {
        "input": "5\ninsert:x\nsearch:x\nsearch:y\nstartsWith:x\nstartsWith:xy",
        "expectedOutput": "1 0 1 0"
      },
      {
        "input": "6\ninsert:aaaa\ninsert:aaab\nsearch:aaaa\nsearch:aaab\nsearch:aaac\nstartsWith:aaa",
        "expectedOutput": "1 1 0 1"
      },
      {
        "input": "7\ninsert:up\ninsert:down\nstartsWith:u\nstartsWith:d\nsearch:up\nsearch:down\nsearch:UP",
        "expectedOutput": "1 1 1 1 0"
      },
      {
        "input": "6\ninsert:code\ninsert:coding\ninsert:cod\nsearch:cod\nstartsWith:cod\nsearch:codi",
        "expectedOutput": "1 1 0"
      },
      {
        "input": "5\ninsert:mango\nstartsWith:man\nstartsWith:mango\nsearch:mango\nsearch:mang",
        "expectedOutput": "1 1 1 0"
      },
      {
        "input": "6\ninsert:z\ninsert:zz\ninsert:zzz\nsearch:zz\nstartsWith:zzzz\nsearch:z",
        "expectedOutput": "1 0 1"
      }
    ]
  },
  {
    "id": "unique-rows-in-boolean-matrix",
    "hints": ["You need fast duplicate detection over sequences. What structure stores sequences and supports quick membership checks?","Insert each row into a trie, or into a hash set using the joined row as a key, and output a row only the first time it is seen."],
    "returns": "intMat",
    "title": "Print Unique Rows in a Given Boolean Matrix",
    "difficulty": "medium",
    "topic": "tries",
    "companies": [
      "Amazon",
      "Zoho"
    ],
    "description": "Given a binary matrix, print the unique rows keeping their first-occurrence order.",
    "constraints": [
      "1 <= R, C <= 10",
      "mat[i][j] is 0 or 1"
    ],
    "io": "matrix",
    "examples": [
      {
        "input": "4 3\n0 1 0\n1 0 1\n0 1 0\n1 1 1",
        "output": "0 1 0\n1 0 1\n1 1 1",
        "explanation": "Rows 0 and 2 are duplicates; unique rows are [0,1,0], [1,0,1], [1,1,1]."
      },
      {
        "input": "3 2\n1 1\n1 1\n1 1",
        "output": "1 1",
        "explanation": "All rows are identical, so one row remains."
      },
      {
        "input": "4 1\n0\n1\n0\n1",
        "output": "0\n1",
        "explanation": "Alternating single-column rows give [0] then [1]."
      }
    ],
    "testCases": [
      {
        "input": "4 3\n0 1 0\n1 0 1\n0 1 0\n1 1 1",
        "expectedOutput": "0 1 0\n1 0 1\n1 1 1"
      },
      {
        "input": "3 2\n1 1\n1 1\n1 1",
        "expectedOutput": "1 1"
      },
      {
        "input": "4 1\n0\n1\n0\n1",
        "expectedOutput": "0\n1"
      },
      {
        "input": "3 4\n1 0 1 0\n1 0 1 0\n0 0 0 0",
        "expectedOutput": "1 0 1 0\n0 0 0 0"
      },
      {
        "input": "1 1\n1",
        "expectedOutput": "1"
      },
      {
        "input": "5 2\n0 0\n0 1\n1 0\n1 1\n0 0",
        "expectedOutput": "0 0\n0 1\n1 0\n1 1"
      },
      {
        "input": "5 3\n1 1 1\n0 0 0\n1 1 1\n0 0 0\n1 0 1",
        "expectedOutput": "1 1 1\n0 0 0\n1 0 1"
      },
      {
        "input": "2 2\n0 1\n1 0",
        "expectedOutput": "0 1\n1 0"
      },
      {
        "input": "5 2\n1 0\n1 0\n0 1\n0 1\n1 1",
        "expectedOutput": "1 0\n0 1\n1 1"
      },
      {
        "input": "3 3\n0 0 0\n0 0 0\n0 0 1",
        "expectedOutput": "0 0 0\n0 0 1"
      },
      {
        "input": "4 4\n1 1 0 1\n1 0 1 1\n0 1 1 0\n1 1 0 1",
        "expectedOutput": "1 1 0 1\n1 0 1 1\n0 1 1 0"
      },
      {
        "input": "3 1\n0\n0\n0",
        "expectedOutput": "0"
      }
    ]
  },
  {
    "id": "print-anagrams-together",
    "hints": ["Anagrams share the same multiset of letters, so find a canonical key that is identical for every anagram.","Use the sorted characters, or a 26-letter frequency signature, as a hash map key to group the words."],
    "returns": "string",
    "title": "Print All Anagrams Together",
    "difficulty": "medium",
    "topic": "tries",
    "companies": [
      "Amazon",
      "Goldman Sachs",
      "Microsoft",
      "Morgan Stanley"
    ],
    "description": "Group words that are anagrams of each other. Return one group per line with words comma-separated; words inside a group are alphabetical and groups are ordered by their sorted-letter key.",
    "constraints": [
      "1 <= words <= 50",
      "words have lowercase letters"
    ],
    "io": "string-array",
    "examples": [
      {
        "input": "6\neat\ntea\ntan\nate\nnat\nbat",
        "output": "bat\nate,eat,tea\nnat,tan",
        "explanation": "eat/tea/ate form one group, tan/nat another, bat stands alone."
      },
      {
        "input": "4\nabc\nbca\ncab\nxyz",
        "output": "abc,bca,cab\nxyz",
        "explanation": "abc/bca/cab group together; xyz is separate."
      },
      {
        "input": "1\na",
        "output": "a",
        "explanation": "A single word is its own group."
      }
    ],
    "testCases": [
      {
        "input": "6\neat\ntea\ntan\nate\nnat\nbat",
        "expectedOutput": "bat\nate,eat,tea\nnat,tan"
      },
      {
        "input": "4\nabc\nbca\ncab\nxyz",
        "expectedOutput": "abc,bca,cab\nxyz"
      },
      {
        "input": "1\na",
        "expectedOutput": "a"
      },
      {
        "input": "4\nlisten\nsilent\nenlist\nhello",
        "expectedOutput": "hello\nenlist,listen,silent"
      },
      {
        "input": "3\nabc\ndef\nghi",
        "expectedOutput": "abc\ndef\nghi"
      },
      {
        "input": "3\naaa\naaa\naaa",
        "expectedOutput": "aaa,aaa,aaa"
      },
      {
        "input": "5\npots\ntops\nspot\nstop\nopts",
        "expectedOutput": "opts,pots,spot,stop,tops"
      },
      {
        "input": "5\ncat\nact\ntac\ndog\ngod",
        "expectedOutput": "act,cat,tac\ndog,god"
      },
      {
        "input": "4\nabcd\ndcba\nbcad\nefgh",
        "expectedOutput": "abcd,bcad,dcba\nefgh"
      },
      {
        "input": "4\nx\ny\nz\nxx",
        "expectedOutput": "x\nxx\ny\nz"
      },
      {
        "input": "4\nstate\ntaste\nteats\ntates",
        "expectedOutput": "state,taste,tates,teats"
      },
      {
        "input": "4\nloop\npool\npolo\nlopo",
        "expectedOutput": "loop,lopo,polo,pool"
      }
    ]
  },
  {
    "id": "shortest-unique-prefix",
    "hints": ["Insert all words into a trie while counting how many words pass through each node.","For each word, walk the trie and stop at the first node whose pass-through count is 1; that prefix is the shortest unique one."],
    "returns": "string",
    "title": "Shortest Unique Prefix for Every Word",
    "difficulty": "medium",
    "topic": "tries",
    "companies": [
      "Microsoft",
      "Google"
    ],
    "description": "For each word in input order, find its shortest prefix that is not a prefix of any other word (use the full word if none exists). Return one prefix per line.",
    "constraints": [
      "1 <= words <= 50",
      "words have lowercase letters"
    ],
    "io": "string-array",
    "examples": [
      {
        "input": "4\nzebra\ndog\nduck\ndove",
        "output": "z\ndog\ndu\ndov",
        "explanation": "zebra->z, dog->dog, duck->du, dove->dov."
      },
      {
        "input": "3\ngeeks\ngeek\ngeeky",
        "output": "geeks\ngeek\ngeeky",
        "explanation": "geek is a prefix of geeks/geeky so it stays whole; geeks->geeks, geeky->geeky."
      },
      {
        "input": "3\napple\napricot\nbanana",
        "output": "app\napr\nb",
        "explanation": "apple->app, apricot->apr, banana->b."
      }
    ],
    "testCases": [
      {
        "input": "4\nzebra\ndog\nduck\ndove",
        "expectedOutput": "z\ndog\ndu\ndov"
      },
      {
        "input": "3\ngeeks\ngeek\ngeeky",
        "expectedOutput": "geeks\ngeek\ngeeky"
      },
      {
        "input": "3\napple\napricot\nbanana",
        "expectedOutput": "app\napr\nb"
      },
      {
        "input": "3\na\nab\nabc",
        "expectedOutput": "a\nab\nabc"
      },
      {
        "input": "4\nhello\nhell\nheaven\nheavy",
        "expectedOutput": "hello\nhell\nheave\nheavy"
      },
      {
        "input": "4\ncar\ncat\ncart\ndog",
        "expectedOutput": "car\ncat\ncart\nd"
      },
      {
        "input": "3\nabcd\nabce\nabcf",
        "expectedOutput": "abcd\nabce\nabcf"
      },
      {
        "input": "1\nx",
        "expectedOutput": "x"
      },
      {
        "input": "3\nsame\nsame\nsame",
        "expectedOutput": "same\nsame\nsame"
      },
      {
        "input": "4\ninterview\ninternet\ninternal\ninto",
        "expectedOutput": "interv\ninterne\ninterna\ninto"
      },
      {
        "input": "4\naaa\naab\naac\naba",
        "expectedOutput": "aaa\naab\naac\nab"
      },
      {
        "input": "4\none\ntwo\nthree\nfour",
        "expectedOutput": "o\ntw\nth\nf"
      }
    ]
  },
  {
    "id": "implement-phone-directory",
    "hints": ["All contacts sharing a prefix live under a single subtree, so store the contacts in a trie.","Insert every contact, then walk to the node for the search prefix and collect all words in its subtree, keeping input order."],
    "returns": "string",
    "title": "Implement a Phone Directory",
    "difficulty": "medium",
    "topic": "tries",
    "companies": [
      "Amazon",
      "Microsoft",
      "Snapdeal"
    ],
    "description": "Input lines: all but the last are contact names, the last line is the search prefix. Return every contact starting with the prefix in input order, one per line, or 0 if none match.",
    "constraints": [
      "1 <= contacts <= 50",
      "names have lowercase letters"
    ],
    "io": "string-array",
    "examples": [
      {
        "input": "4\ngeeikistest\ngeeksforgeeks\ngeeksfortest\ngee",
        "output": "geeikistest\ngeeksforgeeks\ngeeksfortest",
        "explanation": "All three contacts start with 'gee'."
      },
      {
        "input": "4\napple\napplication\nbanana\napp",
        "output": "apple\napplication",
        "explanation": "apple and application start with 'app'."
      },
      {
        "input": "4\ncat\ndog\ncow\nz",
        "output": "0",
        "explanation": "No contact starts with 'z', so the answer is 0."
      }
    ],
    "testCases": [
      {
        "input": "4\ngeeikistest\ngeeksforgeeks\ngeeksfortest\ngee",
        "expectedOutput": "geeikistest\ngeeksforgeeks\ngeeksfortest"
      },
      {
        "input": "4\napple\napplication\nbanana\napp",
        "expectedOutput": "apple\napplication"
      },
      {
        "input": "4\ncat\ndog\ncow\nz",
        "expectedOutput": "0"
      },
      {
        "input": "5\na\nab\nabc\nabcd\nabc",
        "expectedOutput": "abc\nabcd"
      },
      {
        "input": "5\nhello\nhelp\nhelmet\nheld\nhel",
        "expectedOutput": "hello\nhelp\nhelmet\nheld"
      },
      {
        "input": "3\nabc\ndef\nab",
        "expectedOutput": "abc"
      },
      {
        "input": "4\njohn\njane\njack\nja",
        "expectedOutput": "jane\njack"
      },
      {
        "input": "5\ntest\ntesting\ntester\ntoast\ntes",
        "expectedOutput": "test\ntesting\ntester"
      },
      {
        "input": "5\nmango\nman\nmany\nmap\nma",
        "expectedOutput": "mango\nman\nmany\nmap"
      },
      {
        "input": "3\nx\ny\nxy",
        "expectedOutput": "0"
      },
      {
        "input": "4\ncode\ncoder\ncoding\ncode",
        "expectedOutput": "code\ncoder"
      },
      {
        "input": "5\naaa\naab\naac\naad\naa",
        "expectedOutput": "aaa\naab\naac\naad"
      }
    ]
  },
  {
    "id": "implement-trie-ii",
    "hints": ["Extend the basic trie node with two counters: how many words end here and how many words pass through.","Maintain countEnd and countPrefix at every node; insert and erase update them along the path, and the count queries read them directly."],
    "returns": "intArr",
    "title": "Implement Trie II (Prefix Tree with Counts)",
    "difficulty": "medium",
    "topic": "tries",
    "companies": [
      "Amazon",
      "Google"
    ],
    "description": "Operations, one per line: 'insert:word', 'erase:word' (word guaranteed present), 'countWordsEqualTo:word' and 'countWordsStartingWith:prefix'. Return the count answers in order, space-separated.",
    "constraints": [
      "1 <= operations <= 50",
      "words have lowercase letters"
    ],
    "io": "string-array",
    "examples": [
      {
        "input": "6\ninsert:apple\ninsert:apple\ncountWordsEqualTo:apple\ncountWordsStartingWith:app\nerase:apple\ncountWordsEqualTo:apple",
        "output": "2 2 1",
        "explanation": "apple inserted twice: equalTo=2, prefix app=2; after erase, equalTo=1."
      },
      {
        "input": "6\ninsert:abc\ncountWordsEqualTo:abc\ncountWordsStartingWith:a\ncountWordsStartingWith:ab\ncountWordsStartingWith:abc\ncountWordsStartingWith:abcd",
        "output": "1 1 1 1 0",
        "explanation": "abc: equalTo=1, prefixes a/ab/abc=1, abcd=0."
      },
      {
        "input": "7\ninsert:a\ninsert:ab\ninsert:abc\ncountWordsStartingWith:a\nerase:ab\ncountWordsStartingWith:a\ncountWordsEqualTo:ab",
        "output": "3 2 0",
        "explanation": "a,ab,abc inserted: prefix a=3; after erasing ab, prefix a=2, equalTo ab=0."
      }
    ],
    "testCases": [
      {
        "input": "6\ninsert:apple\ninsert:apple\ncountWordsEqualTo:apple\ncountWordsStartingWith:app\nerase:apple\ncountWordsEqualTo:apple",
        "expectedOutput": "2 2 1"
      },
      {
        "input": "6\ninsert:abc\ncountWordsEqualTo:abc\ncountWordsStartingWith:a\ncountWordsStartingWith:ab\ncountWordsStartingWith:abc\ncountWordsStartingWith:abcd",
        "expectedOutput": "1 1 1 1 0"
      },
      {
        "input": "7\ninsert:a\ninsert:ab\ninsert:abc\ncountWordsStartingWith:a\nerase:ab\ncountWordsStartingWith:a\ncountWordsEqualTo:ab",
        "expectedOutput": "3 2 0"
      },
      {
        "input": "6\ninsert:hello\ninsert:hell\ncountWordsEqualTo:hell\ncountWordsStartingWith:hell\nerase:hell\ncountWordsStartingWith:hell",
        "expectedOutput": "1 2 1"
      },
      {
        "input": "8\ninsert:x\ninsert:xy\ninsert:xyz\ncountWordsStartingWith:x\nerase:xyz\nerase:xy\ncountWordsStartingWith:x\ncountWordsEqualTo:x",
        "expectedOutput": "3 1 1"
      },
      {
        "input": "4\ncountWordsEqualTo:nope\ncountWordsStartingWith:no\ninsert:nope\ncountWordsEqualTo:nope",
        "expectedOutput": "0 0 1"
      },
      {
        "input": "8\ninsert:aa\ninsert:aa\ninsert:aa\ncountWordsEqualTo:aa\nerase:aa\nerase:aa\ncountWordsEqualTo:aa\ncountWordsStartingWith:a",
        "expectedOutput": "3 1 1"
      },
      {
        "input": "6\ninsert:dog\ninsert:dogs\ncountWordsStartingWith:dog\ncountWordsEqualTo:dog\nerase:dogs\ncountWordsStartingWith:dog",
        "expectedOutput": "2 1 1"
      },
      {
        "input": "5\ninsert:m\ncountWordsStartingWith:m\ncountWordsEqualTo:m\nerase:m\ncountWordsStartingWith:m",
        "expectedOutput": "1 1 0"
      },
      {
        "input": "6\ninsert:ab\ninsert:ac\ncountWordsStartingWith:a\nerase:ab\ncountWordsStartingWith:a\ncountWordsStartingWith:ab",
        "expectedOutput": "2 1 0"
      },
      {
        "input": "5\ninsert:qwerty\ncountWordsStartingWith:q\ncountWordsStartingWith:qw\ncountWordsStartingWith:qwe\ncountWordsEqualTo:qwert",
        "expectedOutput": "1 1 1 0"
      },
      {
        "input": "7\ninsert:go\ninsert:gone\ninsert:gold\ncountWordsStartingWith:go\nerase:gone\ncountWordsStartingWith:go\ncountWordsStartingWith:gol",
        "expectedOutput": "3 2 1"
      }
    ]
  },
  {
    "id": "longest-word-with-all-prefixes",
    "hints": ["A word qualifies only if you can walk down the trie and hit an end-of-word marker at every single step.","Insert all words, then DFS or BFS from the root following only nodes marked as word ends, tracking the longest word and breaking ties by lexicographic order."],
    "returns": "string",
    "title": "Longest Word with All Prefixes",
    "difficulty": "medium",
    "topic": "tries",
    "companies": [
      "Google",
      "Amazon"
    ],
    "description": "Find the longest word such that every one of its prefixes is also in the list. Break ties by lexicographically smallest. Return the word.",
    "constraints": [
      "1 <= words <= 50",
      "words have lowercase letters"
    ],
    "io": "string-array",
    "examples": [
      {
        "input": "5\nw\nwo\nwor\nworl\nworld",
        "output": "world",
        "explanation": "world: every prefix w, wo, wor, worl is present."
      },
      {
        "input": "7\na\nbanana\napp\nappl\nap\napply\napple",
        "output": "apple",
        "explanation": "apple beats apply lexicographically among length-5 candidates."
      },
      {
        "input": "3\nabc\nab\na",
        "output": "abc",
        "explanation": "abc: all prefixes a, ab present."
      }
    ],
    "testCases": [
      {
        "input": "5\nw\nwo\nwor\nworl\nworld",
        "expectedOutput": "world"
      },
      {
        "input": "7\na\nbanana\napp\nappl\nap\napply\napple",
        "expectedOutput": "apple"
      },
      {
        "input": "3\nabc\nab\na",
        "expectedOutput": "abc"
      },
      {
        "input": "3\nx\ny\nz",
        "expectedOutput": "x"
      },
      {
        "input": "8\nt\nti\ntig\ntige\ntiger\ne\nen\neng",
        "expectedOutput": "tiger"
      },
      {
        "input": "5\na\nab\nabc\nabcd\nabcde",
        "expectedOutput": "abcde"
      },
      {
        "input": "10\nm\nmo\nmon\nmone\nmoney\nmor\nmorn\nmorni\nmornin\nmorning",
        "expectedOutput": "morning"
      },
      {
        "input": "3\nz\nza\nzab",
        "expectedOutput": "zab"
      },
      {
        "input": "7\np\npr\npre\npref\nprefi\nprefix\nq",
        "expectedOutput": "prefix"
      },
      {
        "input": "6\na\naa\naaa\naaaa\nb\nbb",
        "expectedOutput": "aaaa"
      },
      {
        "input": "6\nk\nki\nkin\nkind\nl\nli",
        "expectedOutput": "kind"
      },
      {
        "input": "7\ns\nst\nstr\nstre\nstrea\nstream\nstreams",
        "expectedOutput": "streams"
      }
    ]
  },
  {
    "id": "maximum-xor-of-two-numbers",
    "hints": ["To maximize XOR, at each bit position you want the opposite bit of the current number, if such a number exists in the set.","Insert all numbers into a binary trie bit by bit from the most significant bit, then for each number greedily choose the opposite branch to build the maximum XOR."],
    "returns": "int",
    "title": "Maximum XOR of Two Numbers in an Array",
    "difficulty": "medium",
    "topic": "tries",
    "companies": [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    "description": "Find the maximum XOR value of any pair of numbers in the array. A binary trie gives an efficient solution.",
    "constraints": [
      "2 <= arr.length <= 200",
      "0 <= arr[i] <= 1000000"
    ],
    "io": "array",
    "examples": [
      {
        "input": "6\n3 10 5 25 2 8",
        "output": "28",
        "explanation": "5 XOR 25 = 28 is the maximum pair XOR."
      },
      {
        "input": "2\n0 0",
        "output": "0",
        "explanation": "0 XOR 0 = 0."
      },
      {
        "input": "2\n2 4",
        "output": "6",
        "explanation": "2 XOR 4 = 6."
      }
    ],
    "testCases": [
      {
        "input": "6\n3 10 5 25 2 8",
        "expectedOutput": "28"
      },
      {
        "input": "2\n0 0",
        "expectedOutput": "0"
      },
      {
        "input": "2\n2 4",
        "expectedOutput": "6"
      },
      {
        "input": "3\n8 10 2",
        "expectedOutput": "10"
      },
      {
        "input": "5\n1 2 3 4 5",
        "expectedOutput": "7"
      },
      {
        "input": "7\n970 154 404 666 49 74 840",
        "expectedOutput": "1019"
      },
      {
        "input": "10\n96 374 596 59 931 519 219 38 88 444",
        "expectedOutput": "1019"
      },
      {
        "input": "8\n71 246 92 564 434 60 846 579",
        "expectedOutput": "1009"
      },
      {
        "input": "3\n970 228 645",
        "expectedOutput": "814"
      },
      {
        "input": "12\n596 970 63 590 599 406 50 999 226 47 570 879",
        "expectedOutput": "1016"
      },
      {
        "input": "4\n296 429 147 553",
        "expectedOutput": "900"
      },
      {
        "input": "3\n584 315 573",
        "expectedOutput": "883"
      }
    ]
  },
  {
    "id": "replace-words",
    "hints": ["For each word in the sentence you need its shortest dictionary prefix, which a trie can find in a single walk.","Insert all roots into the trie, then for each sentence word walk down and stop at the first end-of-word node; use that prefix as the replacement."],
    "returns": "string",
    "title": "Replace Words",
    "difficulty": "medium",
    "topic": "tries",
    "companies": [
      "Amazon",
      "Google"
    ],
    "description": "Input lines: all but the last are dictionary roots, the last line is a sentence. Replace each word in the sentence with its shortest root prefix (if any). Return the new sentence.",
    "constraints": [
      "1 <= roots <= 50",
      "sentence has lowercase words"
    ],
    "io": "string-array",
    "examples": [
      {
        "input": "4\ncat\nbat\nrat\nthe cattle was rattled by the battery",
        "output": "the cat was rat by the bat",
        "explanation": "cattle->cat, rattled->rat, battery->bat."
      },
      {
        "input": "4\na\naa\naaa\na aa aaa aaaa",
        "output": "a a a a",
        "explanation": "a is the shortest root for every word."
      },
      {
        "input": "4\ncatt\ncat\nbat\nthe cattle was rattled by the battery",
        "output": "the cat was rattled by the bat",
        "explanation": "cat beats catt as the shorter root for cattle."
      }
    ],
    "testCases": [
      {
        "input": "4\ncat\nbat\nrat\nthe cattle was rattled by the battery",
        "expectedOutput": "the cat was rat by the bat"
      },
      {
        "input": "4\na\naa\naaa\na aa aaa aaaa",
        "expectedOutput": "a a a a"
      },
      {
        "input": "4\ncatt\ncat\nbat\nthe cattle was rattled by the battery",
        "expectedOutput": "the cat was rattled by the bat"
      },
      {
        "input": "2\nhello\nthe hello world",
        "expectedOutput": "the hello world"
      },
      {
        "input": "3\npre\npro\nprefix problem promise",
        "expectedOutput": "pre pro pro"
      },
      {
        "input": "3\nx\ny\nx y z",
        "expectedOutput": "x y z"
      },
      {
        "input": "3\nan\nthe\nan apple and an ant",
        "expectedOutput": "an apple an an an"
      },
      {
        "input": "4\nroot\nrats\nrace\nroot rats race",
        "expectedOutput": "root rats race"
      },
      {
        "input": "4\nab\nabc\nabcd\nabcde abcd abc ab",
        "expectedOutput": "ab ab ab ab"
      },
      {
        "input": "4\nz\nzoo\nzoom\nzoo keeper zooms",
        "expectedOutput": "z keeper z"
      },
      {
        "input": "4\nin\ninside\ninsight\ninside insight",
        "expectedOutput": "in in"
      },
      {
        "input": "3\ncar\ncars\ncar cars carpet",
        "expectedOutput": "car car car"
      }
    ]
  },
  {
    "id": "design-add-and-search-words",
    "hints": ["A trie handles addWord naturally, but the '.' wildcard requires exploring multiple branches at that position.","Search with DFS on the trie: on '.' recurse into every child, on a letter follow the single matching edge, and succeed only when landing on an end-of-word node."],
    "returns": "intArr",
    "title": "Design Add and Search Words Data Structure",
    "difficulty": "medium",
    "topic": "tries",
    "companies": [
      "Facebook",
      "Amazon"
    ],
    "description": "Operations, one per line: 'addWord:word' and 'search:word' where '.' matches any single letter. Return the search answers (1/0) in order, space-separated.",
    "constraints": [
      "1 <= operations <= 50",
      "words have lowercase letters and '.'"
    ],
    "io": "string-array",
    "examples": [
      {
        "input": "7\naddWord:bad\naddWord:dad\naddWord:mad\nsearch:pad\nsearch:bad\nsearch:.ad\nsearch:b..",
        "output": "0 1 1 1",
        "explanation": "pad absent (0); bad present (1); .ad matches bad/dad/mad (1); b.. matches bad (1)."
      },
      {
        "input": "6\naddWord:a\naddWord:ab\nsearch:a\nsearch:a.\nsearch:.\nsearch:..",
        "output": "1 1 1 1",
        "explanation": "a.=ab (1); '.' matches a (1); '..' needs length 2, only ab (1)."
      },
      {
        "input": "5\naddWord:hello\nsearch:hello\nsearch:hell.\nsearch:h.llo\nsearch:helloo",
        "output": "1 1 1 0",
        "explanation": "hell. matches hello (1); helloo too long (0)."
      }
    ],
    "testCases": [
      {
        "input": "7\naddWord:bad\naddWord:dad\naddWord:mad\nsearch:pad\nsearch:bad\nsearch:.ad\nsearch:b..",
        "expectedOutput": "0 1 1 1"
      },
      {
        "input": "6\naddWord:a\naddWord:ab\nsearch:a\nsearch:a.\nsearch:.\nsearch:..",
        "expectedOutput": "1 1 1 1"
      },
      {
        "input": "5\naddWord:hello\nsearch:hello\nsearch:hell.\nsearch:h.llo\nsearch:helloo",
        "expectedOutput": "1 1 1 0"
      },
      {
        "input": "4\nsearch:abc\naddWord:abc\nsearch:abc\nsearch:a.c",
        "expectedOutput": "0 1 1"
      },
      {
        "input": "5\naddWord:code\naddWord:mode\nsearch:.ode\nsearch:....\nsearch:...",
        "expectedOutput": "1 1 0"
      },
      {
        "input": "6\naddWord:x\naddWord:xy\naddWord:xyz\nsearch:x.\nsearch:.y.\nsearch:...",
        "expectedOutput": "1 1 1"
      },
      {
        "input": "5\naddWord:aaa\naddWord:aab\nsearch:aa.\nsearch:..b\nsearch:.a.",
        "expectedOutput": "1 1 1"
      },
      {
        "input": "4\naddWord:word\nsearch:....\nsearch:.....\nsearch:wor.",
        "expectedOutput": "1 0 1"
      },
      {
        "input": "5\naddWord:ab\naddWord:ba\nsearch:..\nsearch:a.\nsearch:.b",
        "expectedOutput": "1 1 1"
      },
      {
        "input": "5\naddWord:test\naddWord:tent\nsearch:te.t\nsearch:te..\nsearch:t.st",
        "expectedOutput": "1 1 1"
      },
      {
        "input": "4\naddWord:q\nsearch:.\nsearch:q\nsearch:..",
        "expectedOutput": "1 1 0"
      },
      {
        "input": "4\naddWord:longword\nsearch:long....\nsearch:........\nsearch:longword.",
        "expectedOutput": "1 1 0"
      }
    ]
  },
  {
    "id": "range-sum-query-immutable",
    "hints": ["Answering each query by scanning the range costs O(n). Can you preprocess something once so every query becomes O(1)?","Build a prefix-sum array; the sum over [l, r] is then prefix[r+1] minus prefix[l]."],
    "returns": "intArr",
    "title": "Range Sum Query - Immutable",
    "difficulty": "easy",
    "topic": "segment-trees",
    "companies": [
      "Amazon",
      "Google"
    ],
    "description": "Given an immutable array, answer sum queries [l, r] (inclusive). Input: array then q query lines. Return the q sums, space-separated.",
    "constraints": [
      "1 <= arr.length <= 100",
      "0 <= l <= r < arr.length"
    ],
    "io": "range-queries",
    "examples": [
      {
        "input": "6\n-2 0 3 -5 2 -1\n3\n0 2\n2 5\n0 5",
        "output": "1 -1 -3",
        "explanation": "Sums: [0,2]=1, [2,5]=-1, [0,5]=-3."
      },
      {
        "input": "5\n1 2 3 4 5\n3\n0 4\n1 3\n2 2",
        "output": "15 9 3",
        "explanation": "Sums: 15, 9, 3."
      },
      {
        "input": "1\n10\n1\n0 0",
        "output": "10",
        "explanation": "Single element query returns 10."
      }
    ],
    "testCases": [
      {
        "input": "6\n-2 0 3 -5 2 -1\n3\n0 2\n2 5\n0 5",
        "expectedOutput": "1 -1 -3"
      },
      {
        "input": "5\n1 2 3 4 5\n3\n0 4\n1 3\n2 2",
        "expectedOutput": "15 9 3"
      },
      {
        "input": "1\n10\n1\n0 0",
        "expectedOutput": "10"
      },
      {
        "input": "6\n5 -3 2 8 -1 4\n3\n0 5\n2 4\n3 3",
        "expectedOutput": "15 9 8"
      },
      {
        "input": "4\n0 0 0 0\n2\n0 3\n1 2",
        "expectedOutput": "0 0"
      },
      {
        "input": "4\n-1 -2 -3 -4\n3\n0 3\n0 0\n3 3",
        "expectedOutput": "-10 -1 -4"
      },
      {
        "input": "1\n7\n1\n0 0",
        "expectedOutput": "7"
      },
      {
        "input": "7\n1 1 1 1 1 1 1\n2\n0 6\n3 5",
        "expectedOutput": "7 3"
      },
      {
        "input": "5\n100 -50 25 -75 10\n2\n0 4\n1 3",
        "expectedOutput": "10 -100"
      },
      {
        "input": "8\n3 1 4 1 5 9 2 6\n3\n0 7\n2 5\n4 4",
        "expectedOutput": "31 19 5"
      },
      {
        "input": "1\n-5\n1\n0 0",
        "expectedOutput": "-5"
      },
      {
        "input": "5\n2 4 6 8 10\n3\n1 3\n0 2\n2 4",
        "expectedOutput": "18 12 24"
      }
    ]
  },
  {
    "id": "range-minimum-query",
    "hints": ["Unlike sums, minimums cannot use a prefix trick, so you need a structure that merges answers from intervals.","Build a segment tree, or a sparse table since the array never changes, storing each segment's minimum and combining O(log n) nodes per query."],
    "returns": "intArr",
    "title": "Range Minimum Query",
    "difficulty": "medium",
    "topic": "segment-trees",
    "companies": [
      "Google",
      "Amazon"
    ],
    "description": "Given an array, answer minimum queries [l, r] (inclusive). Input: array then q query lines. Return the q minimums, space-separated.",
    "constraints": [
      "1 <= arr.length <= 100",
      "0 <= l <= r < arr.length"
    ],
    "io": "range-queries",
    "examples": [
      {
        "input": "5\n1 5 2 4 3\n2\n0 2\n1 4",
        "output": "1 2",
        "explanation": "Minimums: [0,2]=1, [1,4]=2."
      },
      {
        "input": "6\n7 2 9 4 1 8\n3\n0 5\n2 4\n3 3",
        "output": "1 1 4",
        "explanation": "Minimums: 1, 1, 4."
      },
      {
        "input": "1\n5\n1\n0 0",
        "output": "5",
        "explanation": "Single element query returns 5."
      }
    ],
    "testCases": [
      {
        "input": "5\n1 5 2 4 3\n2\n0 2\n1 4",
        "expectedOutput": "1 2"
      },
      {
        "input": "6\n7 2 9 4 1 8\n3\n0 5\n2 4\n3 3",
        "expectedOutput": "1 1 4"
      },
      {
        "input": "1\n5\n1\n0 0",
        "expectedOutput": "5"
      },
      {
        "input": "4\n3 3 3 3\n2\n0 3\n1 2",
        "expectedOutput": "3 3"
      },
      {
        "input": "5\n10 -2 7 -8 5\n2\n0 4\n1 3",
        "expectedOutput": "-8 -8"
      },
      {
        "input": "8\n1 2 3 4 5 6 7 8\n2\n0 7\n4 7",
        "expectedOutput": "1 5"
      },
      {
        "input": "5\n9 8 7 6 5\n3\n0 4\n0 0\n4 4",
        "expectedOutput": "5 9 5"
      },
      {
        "input": "1\n100\n1\n0 0",
        "expectedOutput": "100"
      },
      {
        "input": "6\n4 1 6 2 9 3\n3\n1 4\n0 2\n3 5",
        "expectedOutput": "1 1 2"
      },
      {
        "input": "3\n-1 -5 -3\n2\n0 2\n1 1",
        "expectedOutput": "-5 -5"
      },
      {
        "input": "5\n2 2 1 2 2\n2\n0 4\n2 2",
        "expectedOutput": "1 1"
      },
      {
        "input": "5\n15 11 13 12 14\n2\n0 4\n1 3",
        "expectedOutput": "11 11"
      }
    ]
  },
  {
    "id": "range-sum-query-mutable",
    "hints": ["Point updates together with range sums require a structure that supports both operations in logarithmic time.","Use a segment tree or Fenwick tree: update the leaf and recompute its ancestors, and answer each sum query by merging O(log n) segment nodes."],
    "returns": "intArr",
    "title": "Range Sum Query - Mutable",
    "difficulty": "medium",
    "topic": "segment-trees",
    "companies": [
      "Alibaba",
      "Amazon"
    ],
    "description": "Support point updates and range sums. Each query line has two ints [x, y]: if x < 0 it is an update setting arr[-x-1] = y (no output); otherwise it asks for sum(arr[x..y]). Return the sums in order, space-separated.",
    "constraints": [
      "1 <= arr.length <= 100",
      "updates and queries interleaved"
    ],
    "io": "range-queries",
    "examples": [
      {
        "input": "3\n1 3 5\n3\n0 2\n-2 2\n0 2",
        "output": "9 8",
        "explanation": "sum(0,2)=9, update index 1 to 2, sum(0,2)=8."
      },
      {
        "input": "4\n1 2 3 4\n4\n0 3\n-1 10\n0 3\n2 3",
        "output": "10 19 7",
        "explanation": "sum=10, update index 0 to 10, sums 19 and 7."
      },
      {
        "input": "1\n5\n3\n0 0\n-1 7\n0 0",
        "output": "5 7",
        "explanation": "Single element: 5, update to 7, then 7."
      }
    ],
    "testCases": [
      {
        "input": "3\n1 3 5\n3\n0 2\n-2 2\n0 2",
        "expectedOutput": "9 8"
      },
      {
        "input": "4\n1 2 3 4\n4\n0 3\n-1 10\n0 3\n2 3",
        "expectedOutput": "10 19 7"
      },
      {
        "input": "1\n5\n3\n0 0\n-1 7\n0 0",
        "expectedOutput": "5 7"
      },
      {
        "input": "3\n0 0 0\n5\n0 2\n-2 5\n0 2\n-3 1\n1 2",
        "expectedOutput": "0 5 6"
      },
      {
        "input": "3\n10 20 30\n3\n1 2\n-3 0\n0 2",
        "expectedOutput": "50 30"
      },
      {
        "input": "4\n4 4 4 4\n3\n0 3\n-4 1\n0 3",
        "expectedOutput": "16 13"
      },
      {
        "input": "1\n1\n2\n-1 100\n0 0",
        "expectedOutput": "100"
      },
      {
        "input": "6\n2 7 1 8 2 8\n4\n0 5\n-4 0\n0 5\n3 4",
        "expectedOutput": "28 20 2"
      },
      {
        "input": "3\n9 9 9\n4\n0 2\n-2 0\n-3 0\n0 2",
        "expectedOutput": "27 9"
      },
      {
        "input": "3\n3 1 4\n3\n2 2\n-1 5\n0 2",
        "expectedOutput": "4 10"
      },
      {
        "input": "6\n6 5 4 3 2 1\n4\n0 5\n-6 10\n0 0\n5 5",
        "expectedOutput": "21 6 10"
      },
      {
        "input": "2\n7 7\n4\n0 1\n-1 3\n-2 4\n0 1",
        "expectedOutput": "14 7"
      }
    ]
  },
  {
    "id": "create-sorted-array-through-instructions",
    "hints": ["For each new x you need the counts of strictly smaller and strictly greater elements among previous insertions, which calls for a frequency structure over the value range.","Coordinate-compress the values and maintain a Fenwick or segment tree of frequencies; the insertion cost is the minimum of query(x-1) and total minus query(x)."],
    "returns": "int",
    "title": "Create Sorted Array through Instructions",
    "difficulty": "hard",
    "topic": "segment-trees",
    "companies": [
      "Samsung",
      "Accolite"
    ],
    "description": "Insert numbers one by one. Inserting x costs min(count of strictly smaller inserted, count of strictly greater inserted). Return the total cost modulo 1e9+7.",
    "constraints": [
      "1 <= arr.length <= 100",
      "1 <= arr[i] <= 100"
    ],
    "io": "array",
    "examples": [
      {
        "input": "4\n1 5 6 2",
        "output": "1",
        "explanation": "[1,5,6,2]: inserting 2 costs min(1 smaller, 2 greater) = 1; total = 1."
      },
      {
        "input": "6\n1 2 3 6 5 4",
        "output": "3",
        "explanation": "Inserting 5 costs min(3 smaller, 1 greater) = 1; inserting 4 costs min(3, 2) = 2; total = 3."
      },
      {
        "input": "5\n1 1 1 1 1",
        "output": "0",
        "explanation": "All equal: every insertion costs 0."
      }
    ],
    "testCases": [
      {
        "input": "4\n1 5 6 2",
        "expectedOutput": "1"
      },
      {
        "input": "6\n1 2 3 6 5 4",
        "expectedOutput": "3"
      },
      {
        "input": "5\n1 1 1 1 1",
        "expectedOutput": "0"
      },
      {
        "input": "9\n28 18 28 30 25 15 15 17 28",
        "expectedOutput": "4"
      },
      {
        "input": "5\n6 26 17 16 21",
        "expectedOutput": "3"
      },
      {
        "input": "4\n4 15 10 5",
        "expectedOutput": "2"
      },
      {
        "input": "3\n18 26 29",
        "expectedOutput": "0"
      },
      {
        "input": "2\n20 13",
        "expectedOutput": "0"
      },
      {
        "input": "9\n21 24 20 21 6 20 1 27 17",
        "expectedOutput": "4"
      },
      {
        "input": "3\n2 2 7",
        "expectedOutput": "0"
      },
      {
        "input": "5\n20 1 25 15 11",
        "expectedOutput": "2"
      },
      {
        "input": "9\n19 27 7 17 8 21 10 16 1",
        "expectedOutput": "8"
      }
    ]
  },
  {
    "id": "count-smaller-numbers-after-self",
    "hints": ["Process the array from right to left while maintaining a structure of the values seen so far that can answer how many are smaller than x.","Use a Fenwick tree or balanced binary search tree over compressed values; for each element query the prefix count below it, then insert it."],
    "returns": "intArr",
    "title": "Count of Smaller Numbers After Self",
    "difficulty": "hard",
    "topic": "segment-trees",
    "companies": [
      "Codenation",
      "Google"
    ],
    "description": "For each element, count how many smaller elements appear after it. Return the counts, space-separated.",
    "constraints": [
      "1 <= arr.length <= 100",
      "-100 <= arr[i] <= 100"
    ],
    "io": "array",
    "examples": [
      {
        "input": "4\n5 2 6 1",
        "output": "2 1 1 0",
        "explanation": "[5,2,6,1] -> [2,1,1,0]: two smaller after 5, one after 2, one after 6, none after 1."
      },
      {
        "input": "1\n-1",
        "output": "0",
        "explanation": "Single element -> [0]."
      },
      {
        "input": "2\n-1 -1",
        "output": "0 0",
        "explanation": "Equal elements are not smaller: [-1,-1] -> [0,0]."
      }
    ],
    "testCases": [
      {
        "input": "4\n5 2 6 1",
        "expectedOutput": "2 1 1 0"
      },
      {
        "input": "1\n-1",
        "expectedOutput": "0"
      },
      {
        "input": "2\n-1 -1",
        "expectedOutput": "0 0"
      },
      {
        "input": "3\n2 0 1",
        "expectedOutput": "2 0 0"
      },
      {
        "input": "5\n-2 -9 -6 -11 -6",
        "expectedOutput": "4 1 1 0 0"
      },
      {
        "input": "11\n-9 -12 -16 14 -7 -2 -19 7 -12 18 -20",
        "expectedOutput": "5 3 2 6 3 3 1 2 1 1 0"
      },
      {
        "input": "5\n-11 -15 -4 8 7",
        "expectedOutput": "1 0 0 1 0"
      },
      {
        "input": "3\n-4 2 -6",
        "expectedOutput": "1 1 0"
      },
      {
        "input": "8\n15 16 7 3 7 20 0 -13",
        "expectedOutput": "5 5 3 2 2 2 1 0"
      },
      {
        "input": "6\n18 20 -4 8 15 19",
        "expectedOutput": "3 4 0 0 0 0"
      },
      {
        "input": "12\n-12 8 8 14 -9 -2 -8 -9 13 2 -4 3",
        "expectedOutput": "0 7 7 8 0 3 1 0 3 1 0 0"
      },
      {
        "input": "8\n-4 18 -3 5 -12 16 11 15",
        "expectedOutput": "1 6 1 1 0 2 0 0"
      }
    ]
  }
,
{
    "id": "count-of-range-sum",
    "hints": ["Rewrite range sums with prefix sums: sum(i, j) equals P[j+1] minus P[i], so you need index pairs with lower <= P[j] - P[i] <= upper.","Compress the prefix sums and use a Fenwick tree or a merge-sort based counting pass to count the valid pairs in O(n log n)."],
    "returns": "int",
    "title": "Count of Range Sum",
    "difficulty": "hard",
    "topic": "segment-trees",
    "companies": ["Google", "Amazon", "Microsoft"],
    "description": "Given an integer array nums, return the number of range sums that lie in [lower, upper] inclusive. Range sum S(i, j) is defined as the sum of the elements in nums between indices i and j inclusive, where 0 <= i <= j < nums.length.",
    "examples": [
      {
        "input": "3\n-2 5 -1\n-2 2",
        "output": "3",
        "explanation": "The three range sums that lie in [-2, 2] are: S(0, 0) = -2, S(2, 2) = -1 and S(0, 2) = 2."
      },
      {
        "input": "1\n0\n0 0",
        "output": "1",
        "explanation": "The only range sum S(0, 0) = 0 lies in [0, 0]."
      },
      {
        "input": "2\n0 0\n0 0",
        "output": "3",
        "explanation": "All three range sums S(0, 0) = 0, S(0, 1) = 0 and S(1, 1) = 0 lie in [0, 0]."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^5",
      "-10^5 <= lower <= upper <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    "io": "array-two-ints",
    "testCases": [
      { "input": "3\n-2 5 -1\n-2 2", "expectedOutput": "3" },
      { "input": "1\n0\n0 0", "expectedOutput": "1" },
      { "input": "2\n0 0\n0 0", "expectedOutput": "3" },
      { "input": "1\n5\n-2 2", "expectedOutput": "0" },
      { "input": "5\n-3 -2 -1 -4 -2\n-5 -1", "expectedOutput": "8" },
      { "input": "6\n1 2 3 -4 5 -6\n-3 3", "expectedOutput": "12" },
      { "input": "4\n100000 -100000 100000 -100000\n-100000 100000", "expectedOutput": "10" },
      { "input": "4\n1 1 1 1\n2 2", "expectedOutput": "3" },
      { "input": "3\n10 20 30\n-100 -1", "expectedOutput": "0" },
      { "input": "3\n1 1 1\n1 6", "expectedOutput": "6" },
      { "input": "8\n2 -1 3 -2 4 -3 1 2\n0 5", "expectedOutput": "29" },
      { "input": "10\n-5 4 -3 2 -1 6 -7 8 -2 3\n-4 4", "expectedOutput": "32" }
    ]
  }
,
{
    "id": "remove-duplicates-from-unsorted-list",
    "hints": ["Unlike the sorted version, you can't rely on duplicates being adjacent here.","Use a hash set to record values you've seen while traversing; when the next node's value is already in the set, skip it."],
    "returns": "linkedlist",
    "title": "Remove Duplicates from an Unsorted Linked List",
    "difficulty": "easy",
    "topic": "linked-list",
    "companies": [
      "Amazon",
      "Intuit"
    ],
    "description": "Given the head of an unsorted linked list, remove all duplicate nodes so that each value appears only once. Keep the first occurrence of every value and preserve the original relative order.",
    "examples": [
      {
        "input": "5\n1 2 3 2 1",
        "output": "1 2 3",
        "explanation": "Keeping the first occurrence of each value, 1 -> 2 -> 3 -> 2 -> 1 becomes 1 2 3."
      },
      {
        "input": "4\n5 5 5 5",
        "output": "5",
        "explanation": "Every node holds the same value, so only one node survives: 5."
      },
      {
        "input": "3\n1 2 3",
        "output": "1 2 3",
        "explanation": "There are no duplicates, so the list is unchanged: 1 2 3."
      }
    ],
    "constraints": [
      "The number of nodes is in the range [0, 10000].",
      "-10000 <= Node.val <= 10000"
    ],
    "io": "linkedlist",
    "testCases": [
      {
        "input": "5\n1 2 3 2 1",
        "expectedOutput": "1 2 3"
      },
      {
        "input": "4\n5 5 5 5",
        "expectedOutput": "5"
      },
      {
        "input": "3\n1 2 3",
        "expectedOutput": "1 2 3"
      },
      {
        "input": "0\n",
        "expectedOutput": ""
      },
      {
        "input": "1\n7",
        "expectedOutput": "7"
      },
      {
        "input": "6\n3 1 3 1 2 3",
        "expectedOutput": "3 1 2"
      },
      {
        "input": "6\n1 1 2 2 3 3",
        "expectedOutput": "1 2 3"
      },
      {
        "input": "4\n4 3 2 1",
        "expectedOutput": "4 3 2 1"
      },
      {
        "input": "5\n-1 2 -1 3 2",
        "expectedOutput": "-1 2 3"
      },
      {
        "input": "6\n10 20 10 30 20 40",
        "expectedOutput": "10 20 30 40"
      },
      {
        "input": "7\n1 2 1 2 1 2 3",
        "expectedOutput": "1 2 3"
      },
      {
        "input": "5\n9 8 7 9 8",
        "expectedOutput": "9 8 7"
      }
    ]
  },
  {
    "id": "sort-linked-list-0s-1s-2s",
    "hints": ["You can sort this in one pass without any comparisons of node values.","Count the occurrences of 0s, 1s, and 2s first, then rewrite the node values in order; alternatively, build three separate chains and link them."],
    "returns": "linkedlist",
    "title": "Sort a Linked List of 0s, 1s and 2s",
    "difficulty": "medium",
    "topic": "linked-list",
    "companies": [
      "Microsoft",
      "Amazon",
      "MakeMyTrip"
    ],
    "description": "Given the head of a linked list containing only 0s, 1s and 2s, sort the list so that all 0s come first, followed by all 1s, followed by all 2s.",
    "examples": [
      {
        "input": "6\n1 2 0 2 1 0",
        "output": "0 0 1 1 2 2",
        "explanation": "Counting gives two 0s, two 1s and two 2s, so the sorted list is 0 0 1 1 2 2."
      },
      {
        "input": "3\n2 2 2",
        "output": "2 2 2",
        "explanation": "All values are already 2, the list stays 2 2 2."
      },
      {
        "input": "1\n0",
        "output": "0",
        "explanation": "A single node list is already sorted: 0."
      }
    ],
    "constraints": [
      "The number of nodes is in the range [0, 10000].",
      "Node.val is 0, 1 or 2."
    ],
    "io": "linkedlist",
    "testCases": [
      {
        "input": "6\n1 2 0 2 1 0",
        "expectedOutput": "0 0 1 1 2 2"
      },
      {
        "input": "3\n2 2 2",
        "expectedOutput": "2 2 2"
      },
      {
        "input": "1\n0",
        "expectedOutput": "0"
      },
      {
        "input": "0\n",
        "expectedOutput": ""
      },
      {
        "input": "3\n2 1 0",
        "expectedOutput": "0 1 2"
      },
      {
        "input": "7\n0 0 0 1 1 2 2",
        "expectedOutput": "0 0 0 1 1 2 2"
      },
      {
        "input": "3\n1 1 1",
        "expectedOutput": "1 1 1"
      },
      {
        "input": "5\n2 0 2 0 1",
        "expectedOutput": "0 0 1 2 2"
      },
      {
        "input": "6\n0 1 2 0 1 2",
        "expectedOutput": "0 0 1 1 2 2"
      },
      {
        "input": "1\n1",
        "expectedOutput": "1"
      },
      {
        "input": "6\n2 2 1 1 0 0",
        "expectedOutput": "0 0 1 1 2 2"
      },
      {
        "input": "3\n0 2 1",
        "expectedOutput": "0 1 2"
      }
    ]
  },
  {
    "id": "multiply-two-numbers-linked-lists",
    "hints": ["The lists store digits with the most significant first, so convert each list to its numeric value before operating.","Convert each linked list to a number by iterating digits as value = value * 10 + digit, then multiply the two numbers."],
    "returns": "int",
    "title": "Multiply Two Numbers Represented by Linked Lists",
    "difficulty": "medium",
    "topic": "linked-list",
    "companies": [
      "Amazon"
    ],
    "description": "Two non-negative numbers are represented by linked lists with the most significant digit first. Multiply the two numbers and return the product as an integer.",
    "examples": [
      {
        "input": "2\n1 2\n2\n3 4",
        "output": "408",
        "explanation": "The lists represent 12 and 34, and 12 * 34 = 408."
      },
      {
        "input": "1\n0\n3\n1 2 3",
        "output": "0",
        "explanation": "Multiplying by zero gives 0."
      },
      {
        "input": "2\n9 9\n2\n9 9",
        "output": "9801",
        "explanation": "The lists represent 99 and 99, and 99 * 99 = 9801."
      }
    ],
    "constraints": [
      "Each list has 1 to 6 nodes.",
      "The product fits in a 32-bit signed integer."
    ],
    "io": "two-lists",
    "testCases": [
      {
        "input": "2\n1 2\n2\n3 4",
        "expectedOutput": "408"
      },
      {
        "input": "1\n0\n3\n1 2 3",
        "expectedOutput": "0"
      },
      {
        "input": "2\n9 9\n2\n9 9",
        "expectedOutput": "9801"
      },
      {
        "input": "1\n1\n1\n1",
        "expectedOutput": "1"
      },
      {
        "input": "2\n2 5\n1\n4",
        "expectedOutput": "100"
      },
      {
        "input": "3\n1 0 0\n2\n1 0",
        "expectedOutput": "1000"
      },
      {
        "input": "1\n9\n1\n9",
        "expectedOutput": "81"
      },
      {
        "input": "3\n1 2 3\n3\n4 5 6",
        "expectedOutput": "56088"
      },
      {
        "input": "2\n5 0\n2\n2 0",
        "expectedOutput": "1000"
      },
      {
        "input": "1\n7\n2\n8 9",
        "expectedOutput": "623"
      },
      {
        "input": "2\n1 1\n2\n1 1",
        "expectedOutput": "121"
      },
      {
        "input": "3\n3 3 3\n3\n1 0 1",
        "expectedOutput": "33633"
      }
    ]
  },
  {
    "id": "reorder-list",
    "hints": ["Break the problem into three steps: find the middle, reverse the second half, then merge the two halves alternately.","After reversing the second half, weave the two lists together node by node, taking one node from each half in turn."],
    "returns": "linkedlist",
    "title": "Reorder List",
    "difficulty": "medium",
    "topic": "linked-list",
    "companies": [
      "Amazon",
      "Microsoft",
      "Intuit"
    ],
    "description": "Given the head of a linked list L0 -> L1 -> ... -> Ln-1 -> Ln, reorder it to L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 -> ... Return the head of the reordered list.",
    "examples": [
      {
        "input": "4\n1 2 3 4",
        "output": "1 4 2 3",
        "explanation": "Interleaving from both ends gives 1 -> 4 -> 2 -> 3, i.e. 1 4 2 3."
      },
      {
        "input": "5\n1 2 3 4 5",
        "output": "1 5 2 4 3",
        "explanation": "Interleaving from both ends gives 1 -> 5 -> 2 -> 4 -> 3, i.e. 1 5 2 4 3."
      },
      {
        "input": "1\n7",
        "output": "7",
        "explanation": "A single node list is unchanged: 7."
      }
    ],
    "constraints": [
      "The number of nodes is in the range [0, 5000].",
      "-5000 <= Node.val <= 5000"
    ],
    "io": "linkedlist",
    "testCases": [
      {
        "input": "4\n1 2 3 4",
        "expectedOutput": "1 4 2 3"
      },
      {
        "input": "5\n1 2 3 4 5",
        "expectedOutput": "1 5 2 4 3"
      },
      {
        "input": "1\n7",
        "expectedOutput": "7"
      },
      {
        "input": "0\n",
        "expectedOutput": ""
      },
      {
        "input": "2\n1 2",
        "expectedOutput": "1 2"
      },
      {
        "input": "3\n1 2 3",
        "expectedOutput": "1 3 2"
      },
      {
        "input": "6\n10 20 30 40 50 60",
        "expectedOutput": "10 60 20 50 30 40"
      },
      {
        "input": "5\n5 4 3 2 1",
        "expectedOutput": "5 1 4 2 3"
      },
      {
        "input": "7\n1 3 5 7 9 11 13",
        "expectedOutput": "1 13 3 11 5 9 7"
      },
      {
        "input": "2\n2 4",
        "expectedOutput": "2 4"
      },
      {
        "input": "8\n1 2 3 4 5 6 7 8",
        "expectedOutput": "1 8 2 7 3 6 4 5"
      },
      {
        "input": "1\n9",
        "expectedOutput": "9"
      }
    ]
  },
  {
    "id": "linked-list-zigzag-fashion",
    "hints": ["The pattern alternates between less-than and greater-than comparisons at each adjacent pair.","Walk the list once comparing adjacent nodes; if position i should have a[i] < a[i+1] but doesn't, swap their values (values may be swapped since distinctness is guaranteed)."],
    "returns": "linkedlist",
    "title": "Linked List in Zig-Zag Fashion",
    "difficulty": "medium",
    "topic": "linked-list",
    "companies": [
      "Microsoft"
    ],
    "description": "Given the head of a linked list, rearrange it in zig-zag fashion so that the values satisfy a < b > c < d > e and so on. All values are distinct.",
    "examples": [
      {
        "input": "4\n4 3 7 8",
        "output": "3 7 4 8",
        "explanation": "A single left-to-right pass with an alternating flag turns 4 -> 3 -> 7 -> 8 into 3 7 4 8, and 3 < 7 > 4 < 8 holds."
      },
      {
        "input": "5\n1 2 3 4 5",
        "output": "1 3 2 5 4",
        "explanation": "Rearranging gives 1 3 2 5 4, and 1 < 3 > 2 < 5 > 4 holds."
      },
      {
        "input": "2\n2 1",
        "output": "1 2",
        "explanation": "Two nodes out of order are swapped to 1 2."
      }
    ],
    "constraints": [
      "The number of nodes is in the range [0, 5000].",
      "All node values are distinct."
    ],
    "io": "linkedlist",
    "testCases": [
      {
        "input": "4\n4 3 7 8",
        "expectedOutput": "3 7 4 8"
      },
      {
        "input": "5\n1 2 3 4 5",
        "expectedOutput": "1 3 2 5 4"
      },
      {
        "input": "2\n2 1",
        "expectedOutput": "1 2"
      },
      {
        "input": "1\n5",
        "expectedOutput": "5"
      },
      {
        "input": "0\n",
        "expectedOutput": ""
      },
      {
        "input": "3\n3 1 2",
        "expectedOutput": "1 3 2"
      },
      {
        "input": "3\n10 20 30",
        "expectedOutput": "10 30 20"
      },
      {
        "input": "5\n5 4 3 2 1",
        "expectedOutput": "4 5 2 3 1"
      },
      {
        "input": "5\n1 4 2 5 3",
        "expectedOutput": "1 4 2 5 3"
      },
      {
        "input": "9\n9 7 5 3 1 2 4 6 8",
        "expectedOutput": "7 9 3 5 1 4 2 8 6"
      },
      {
        "input": "2\n2 3",
        "expectedOutput": "2 3"
      },
      {
        "input": "6\n6 1 5 2 4 3",
        "expectedOutput": "1 6 2 5 3 4"
      }
    ]
  },
  {
    "id": "delete-nodes-greater-on-right",
    "hints": ["A node survives only if nothing larger appears after it in the list.","Reverse the list (or process it right-to-left with a stack), track the maximum value seen so far, and delete any node smaller than that maximum."],
    "returns": "linkedlist",
    "title": "Delete Nodes Which Have a Greater Value on the Right",
    "difficulty": "medium",
    "topic": "linked-list",
    "companies": [
      "Amazon"
    ],
    "description": "Given the head of a linked list, delete every node which has a node with a strictly greater value somewhere on its right side. Return the head of the modified list.",
    "examples": [
      {
        "input": "8\n12 15 10 11 5 6 2 3",
        "output": "15 11 6 3",
        "explanation": "12 has 15 on its right, 10 has 11, 5 has 6 and 2 has 3, so they are removed and the list becomes 15 11 6 3."
      },
      {
        "input": "3\n1 2 3",
        "output": "3",
        "explanation": "Every node has a greater value on its right except the last, so only 3 survives: 3."
      },
      {
        "input": "3\n3 2 1",
        "output": "3 2 1",
        "explanation": "No node has a greater value on its right, nothing is deleted: 3 2 1."
      }
    ],
    "constraints": [
      "The number of nodes is in the range [0, 10000].",
      "-10000 <= Node.val <= 10000"
    ],
    "io": "linkedlist",
    "testCases": [
      {
        "input": "8\n12 15 10 11 5 6 2 3",
        "expectedOutput": "15 11 6 3"
      },
      {
        "input": "3\n1 2 3",
        "expectedOutput": "3"
      },
      {
        "input": "3\n3 2 1",
        "expectedOutput": "3 2 1"
      },
      {
        "input": "1\n5",
        "expectedOutput": "5"
      },
      {
        "input": "0\n",
        "expectedOutput": ""
      },
      {
        "input": "4\n10 20 30 40",
        "expectedOutput": "40"
      },
      {
        "input": "4\n40 30 20 10",
        "expectedOutput": "40 30 20 10"
      },
      {
        "input": "3\n5 5 5",
        "expectedOutput": "5 5 5"
      },
      {
        "input": "4\n1 3 2 4",
        "expectedOutput": "4"
      },
      {
        "input": "6\n9 1 8 2 7 3",
        "expectedOutput": "9 8 7 3"
      },
      {
        "input": "5\n2 7 4 3 5",
        "expectedOutput": "7 5"
      },
      {
        "input": "1\n100",
        "expectedOutput": "100"
      }
    ]
  },
  {
    "id": "segregate-even-and-odd-elements",
    "hints": ["This is the same idea as partitioning by a property while keeping the original relative order.","Build separate even and odd chains in a single pass, then connect the even tail to the odd head."],
    "returns": "linkedlist",
    "title": "Segregate Even and Odd Elements in a Linked List",
    "difficulty": "easy",
    "topic": "linked-list",
    "companies": [
      "Walmart"
    ],
    "description": "Given the head of a linked list, segregate it by node value: all nodes with even values come first, followed by all nodes with odd values. Preserve the original relative order inside each group.",
    "examples": [
      {
        "input": "6\n1 2 3 4 5 6",
        "output": "2 4 6 1 3 5",
        "explanation": "Even values 2, 4, 6 move to the front keeping order, then odd values 1, 3, 5: 2 4 6 1 3 5."
      },
      {
        "input": "4\n2 4 6 8",
        "output": "2 4 6 8",
        "explanation": "All values are even, so the list is unchanged: 2 4 6 8."
      },
      {
        "input": "3\n1 3 5",
        "output": "1 3 5",
        "explanation": "All values are odd, so the list is unchanged: 1 3 5."
      }
    ],
    "constraints": [
      "The number of nodes is in the range [0, 10000].",
      "-10000 <= Node.val <= 10000"
    ],
    "io": "linkedlist",
    "testCases": [
      {
        "input": "6\n1 2 3 4 5 6",
        "expectedOutput": "2 4 6 1 3 5"
      },
      {
        "input": "4\n2 4 6 8",
        "expectedOutput": "2 4 6 8"
      },
      {
        "input": "3\n1 3 5",
        "expectedOutput": "1 3 5"
      },
      {
        "input": "0\n",
        "expectedOutput": ""
      },
      {
        "input": "1\n7",
        "expectedOutput": "7"
      },
      {
        "input": "1\n8",
        "expectedOutput": "8"
      },
      {
        "input": "5\n5 4 3 2 1",
        "expectedOutput": "4 2 5 3 1"
      },
      {
        "input": "4\n11 22 33 44",
        "expectedOutput": "22 44 11 33"
      },
      {
        "input": "4\n0 1 0 1",
        "expectedOutput": "0 0 1 1"
      },
      {
        "input": "3\n-2 -3 4",
        "expectedOutput": "-2 4 -3"
      },
      {
        "input": "2\n2 1",
        "expectedOutput": "2 1"
      },
      {
        "input": "2\n1 2",
        "expectedOutput": "2 1"
      }
    ]
  },
  {
    "id": "merge-sort-linked-list",
    "hints": ["Merge sort fits linked lists well because merging two sorted lists is O(1) extra space.","Split the list into halves with slow/fast pointers, recursively sort each half, then merge the two sorted halves."],
    "returns": "linkedlist",
    "title": "Merge Sort for Linked List",
    "difficulty": "medium",
    "topic": "linked-list",
    "companies": [
      "Accolite",
      "Adobe",
      "Amazon",
      "Microsoft"
    ],
    "description": "Given the head of a linked list, sort it in non-decreasing order using merge sort. Return the head of the sorted list.",
    "examples": [
      {
        "input": "4\n4 2 1 3",
        "output": "1 2 3 4",
        "explanation": "Sorting 4 -> 2 -> 1 -> 3 in non-decreasing order gives 1 2 3 4."
      },
      {
        "input": "5\n5 4 3 2 1",
        "output": "1 2 3 4 5",
        "explanation": "The reversed list becomes fully sorted: 1 2 3 4 5."
      },
      {
        "input": "1\n1",
        "output": "1",
        "explanation": "A single node list is already sorted: 1."
      }
    ],
    "constraints": [
      "The number of nodes is in the range [0, 5000].",
      "-5000 <= Node.val <= 5000"
    ],
    "io": "linkedlist",
    "testCases": [
      {
        "input": "4\n4 2 1 3",
        "expectedOutput": "1 2 3 4"
      },
      {
        "input": "5\n5 4 3 2 1",
        "expectedOutput": "1 2 3 4 5"
      },
      {
        "input": "1\n1",
        "expectedOutput": "1"
      },
      {
        "input": "0\n",
        "expectedOutput": ""
      },
      {
        "input": "3\n3 3 3",
        "expectedOutput": "3 3 3"
      },
      {
        "input": "2\n2 1",
        "expectedOutput": "1 2"
      },
      {
        "input": "4\n10 -1 5 0",
        "expectedOutput": "-1 0 5 10"
      },
      {
        "input": "4\n1 2 3 4",
        "expectedOutput": "1 2 3 4"
      },
      {
        "input": "5\n7 3 9 1 5",
        "expectedOutput": "1 3 5 7 9"
      },
      {
        "input": "2\n100 50",
        "expectedOutput": "50 100"
      },
      {
        "input": "6\n4 4 1 1 2 2",
        "expectedOutput": "1 1 2 2 4 4"
      },
      {
        "input": "4\n-5 -10 0 5",
        "expectedOutput": "-10 -5 0 5"
      }
    ]
  },
  {
    "id": "quicksort-linked-list",
    "hints": ["Partitioning around a pivot works on a linked list if you build less-than and greater-than chains.","Pick the head as pivot, partition the remaining nodes into smaller and larger chains, then recursively sort each chain and concatenate pivot between them."],
    "returns": "linkedlist",
    "title": "Quicksort on Singly Linked List",
    "difficulty": "medium",
    "topic": "linked-list",
    "companies": [
      "Paytm"
    ],
    "description": "Given the head of a singly linked list, sort it in non-decreasing order using quicksort. Return the head of the sorted list.",
    "examples": [
      {
        "input": "4\n4 2 1 3",
        "output": "1 2 3 4",
        "explanation": "Quicksort arranges 4 -> 2 -> 1 -> 3 into non-decreasing order: 1 2 3 4."
      },
      {
        "input": "5\n5 4 3 2 1",
        "output": "1 2 3 4 5",
        "explanation": "The reversed list becomes fully sorted: 1 2 3 4 5."
      },
      {
        "input": "1\n1",
        "output": "1",
        "explanation": "A single node list is already sorted: 1."
      }
    ],
    "constraints": [
      "The number of nodes is in the range [0, 5000].",
      "-5000 <= Node.val <= 5000"
    ],
    "io": "linkedlist",
    "testCases": [
      {
        "input": "4\n4 2 1 3",
        "expectedOutput": "1 2 3 4"
      },
      {
        "input": "5\n5 4 3 2 1",
        "expectedOutput": "1 2 3 4 5"
      },
      {
        "input": "1\n1",
        "expectedOutput": "1"
      },
      {
        "input": "0\n",
        "expectedOutput": ""
      },
      {
        "input": "9\n9 7 5 3 1 2 4 6 8",
        "expectedOutput": "1 2 3 4 5 6 7 8 9"
      },
      {
        "input": "4\n2 2 1 1",
        "expectedOutput": "1 1 2 2"
      },
      {
        "input": "3\n3 1 2",
        "expectedOutput": "1 2 3"
      },
      {
        "input": "4\n-1 -5 0 5",
        "expectedOutput": "-5 -1 0 5"
      },
      {
        "input": "3\n1 2 3",
        "expectedOutput": "1 2 3"
      },
      {
        "input": "5\n50 40 30 20 10",
        "expectedOutput": "10 20 30 40 50"
      },
      {
        "input": "4\n6 3 9 0",
        "expectedOutput": "0 3 6 9"
      },
      {
        "input": "1\n8",
        "expectedOutput": "8"
      }
    ]
  },
  {
    "id": "delete-node-without-head",
    "hints": ["You can't reach the node itself's predecessor, so think about what data you can move instead.","Copy the next node's value into the target node, then delete the next node by bypassing it."],
    "returns": "linkedlist",
    "title": "Delete Node Without Head Pointer",
    "difficulty": "easy",
    "topic": "linked-list",
    "companies": [
      "Amazon",
      "Microsoft",
      "Samsung"
    ],
    "description": "Given the head of a linked list and the value x of a node to delete, delete the first node holding x without using any previous pointer (copy the next node data into it). It is guaranteed that x exists and is not the value of the last node. Return the head of the modified list.",
    "examples": [
      {
        "input": "5\n1 2 3 4 5\n3",
        "output": "1 2 4 5",
        "explanation": "The node holding 3 copies the data of 4 and skips it, so 1 -> 2 -> 3 -> 4 -> 5 becomes 1 2 4 5."
      },
      {
        "input": "4\n4 5 1 9\n5",
        "output": "4 1 9",
        "explanation": "Deleting the node with value 5 gives 4 1 9."
      },
      {
        "input": "2\n1 2\n1",
        "output": "2",
        "explanation": "Deleting the head node value 1 leaves 2."
      }
    ],
    "constraints": [
      "The list has at least 2 nodes.",
      "x exists in the list and is not the last node value."
    ],
    "io": "linkedlist-x",
    "testCases": [
      {
        "input": "5\n1 2 3 4 5\n3",
        "expectedOutput": "1 2 4 5"
      },
      {
        "input": "4\n4 5 1 9\n5",
        "expectedOutput": "4 1 9"
      },
      {
        "input": "2\n1 2\n1",
        "expectedOutput": "2"
      },
      {
        "input": "3\n1 2 3\n1",
        "expectedOutput": "2 3"
      },
      {
        "input": "3\n1 2 3\n2",
        "expectedOutput": "1 3"
      },
      {
        "input": "4\n5 5 5 5\n5",
        "expectedOutput": "5 5 5"
      },
      {
        "input": "3\n10 20 30\n10",
        "expectedOutput": "20 30"
      },
      {
        "input": "3\n10 20 30\n20",
        "expectedOutput": "10 30"
      },
      {
        "input": "5\n7 8 9 10 11\n8",
        "expectedOutput": "7 9 10 11"
      },
      {
        "input": "3\n1 1 2\n1",
        "expectedOutput": "1 2"
      },
      {
        "input": "4\n3 2 1 0\n3",
        "expectedOutput": "2 1 0"
      },
      {
        "input": "2\n100 200\n100",
        "expectedOutput": "200"
      }
    ]
  },
  {
    "id": "subtract-two-numbers-linked-lists",
    "hints": ["Handle this like manual subtraction with borrowing, since digits are most significant first.","Process digits from least significant to most significant (use stacks or reverse the lists), borrow from the next digit when the top digit is smaller, then strip leading zeros."],
    "returns": "linkedlist",
    "title": "Subtract Two Numbers Represented as Linked Lists",
    "difficulty": "medium",
    "topic": "linked-list",
    "companies": [
      "Amazon",
      "Goldman Sachs"
    ],
    "description": "Two non-negative numbers are represented by linked lists with the most significant digit first. The first number is greater than or equal to the second. Subtract the second number from the first and return the result as a linked list, most significant digit first, with no leading zeros (return a single 0 if the result is zero).",
    "examples": [
      {
        "input": "3\n1 0 0\n1\n1",
        "output": "9 9",
        "explanation": "100 - 1 = 99, returned most significant digit first as 9 9."
      },
      {
        "input": "2\n5 0\n2\n5 0",
        "output": "0",
        "explanation": "Both numbers are equal, so the result is 0."
      },
      {
        "input": "3\n1 2 3\n2\n1 2",
        "output": "1 1 1",
        "explanation": "123 - 12 = 111, returned as 1 1 1."
      }
    ],
    "constraints": [
      "Each list has 1 to 6 nodes.",
      "The first number is >= the second number."
    ],
    "io": "two-lists",
    "testCases": [
      {
        "input": "3\n1 0 0\n1\n1",
        "expectedOutput": "9 9"
      },
      {
        "input": "2\n5 0\n2\n5 0",
        "expectedOutput": "0"
      },
      {
        "input": "3\n1 2 3\n2\n1 2",
        "expectedOutput": "1 1 1"
      },
      {
        "input": "4\n1 0 0 0\n3\n9 9 9",
        "expectedOutput": "1"
      },
      {
        "input": "1\n5\n1\n3",
        "expectedOutput": "2"
      },
      {
        "input": "2\n1 0\n1\n1",
        "expectedOutput": "9"
      },
      {
        "input": "3\n2 0 0\n3\n1 9 9",
        "expectedOutput": "1"
      },
      {
        "input": "3\n9 9 9\n3\n9 9 8",
        "expectedOutput": "1"
      },
      {
        "input": "4\n1 2 3 4\n4\n1 2 3 4",
        "expectedOutput": "0"
      },
      {
        "input": "3\n5 0 0\n3\n4 9 9",
        "expectedOutput": "1"
      },
      {
        "input": "2\n7 5\n2\n2 5",
        "expectedOutput": "5 0"
      },
      {
        "input": "5\n1 0 0 0 0\n1\n1",
        "expectedOutput": "9 9 9 9"
      }
    ]
  },
  {
    "id": "queue-reversal",
    "hints": ["Reversing a queue means the last element becomes the first.","Use a stack as auxiliary storage: dequeue everything into the stack, then dequeue the stack back into the queue."],
    "returns": "intArr",
    "title": "Queue Reversal",
    "difficulty": "easy",
    "topic": "queue",
    "companies": [
      "Amazon",
      "Morgan Stanley"
    ],
    "description": "Given a queue represented as an array where the first element is the front of the queue, reverse the queue and return the resulting array.",
    "examples": [
      {
        "input": "5\n1 2 3 4 5",
        "output": "5 4 3 2 1",
        "explanation": "Reversing the queue turns front-to-back order 1 2 3 4 5 into 5 4 3 2 1."
      },
      {
        "input": "1\n7",
        "output": "7",
        "explanation": "A single element queue is unchanged: 7."
      },
      {
        "input": "3\n3 2 1",
        "output": "1 2 3",
        "explanation": "Reversing gives 1 2 3."
      }
    ],
    "constraints": [
      "The queue size is in the range [0, 10000].",
      "-10000 <= elements <= 10000"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "5\n1 2 3 4 5",
        "expectedOutput": "5 4 3 2 1"
      },
      {
        "input": "1\n7",
        "expectedOutput": "7"
      },
      {
        "input": "3\n3 2 1",
        "expectedOutput": "1 2 3"
      },
      {
        "input": "0\n",
        "expectedOutput": ""
      },
      {
        "input": "3\n1 1 1",
        "expectedOutput": "1 1 1"
      },
      {
        "input": "2\n10 20",
        "expectedOutput": "20 10"
      },
      {
        "input": "3\n-1 -2 -3",
        "expectedOutput": "-3 -2 -1"
      },
      {
        "input": "6\n5 4 3 2 1 0",
        "expectedOutput": "0 1 2 3 4 5"
      },
      {
        "input": "1\n100",
        "expectedOutput": "100"
      },
      {
        "input": "2\n1 2",
        "expectedOutput": "2 1"
      },
      {
        "input": "9\n9 8 7 6 5 4 3 2 1",
        "expectedOutput": "1 2 3 4 5 6 7 8 9"
      },
      {
        "input": "3\n0 0 1",
        "expectedOutput": "1 0 0"
      }
    ]
  },
  {
    "id": "reverse-first-k-elements-of-queue",
    "hints": ["Only the first k elements change position; the rest stay exactly where they are.","Dequeue the first k elements into a stack, push them back (which reverses them), then rotate the remaining n - k elements to the back."],
    "returns": "intArr",
    "title": "Reverse First K Elements of Queue",
    "difficulty": "easy",
    "topic": "queue",
    "companies": [
      "Microsoft",
      "Amdocs"
    ],
    "description": "Given a queue represented as an array where the first element is the front of the queue, and an integer k, reverse the first k elements of the queue while keeping the remaining elements in their original order.",
    "examples": [
      {
        "input": "5\n1 2 3 4 5\n3",
        "output": "3 2 1 4 5",
        "explanation": "Reversing the first 3 elements of 1 2 3 4 5 gives 3 2 1 4 5."
      },
      {
        "input": "4\n1 2 3 4\n4",
        "output": "4 3 2 1",
        "explanation": "Reversing all 4 elements reverses the whole queue: 4 3 2 1."
      },
      {
        "input": "4\n1 2 3 4\n1",
        "output": "1 2 3 4",
        "explanation": "Reversing just the first element changes nothing: 1 2 3 4."
      }
    ],
    "constraints": [
      "1 <= k <= n <= 10000.",
      "-10000 <= elements <= 10000"
    ],
    "io": "array-k",
    "testCases": [
      {
        "input": "5\n1 2 3 4 5\n3",
        "expectedOutput": "3 2 1 4 5"
      },
      {
        "input": "4\n1 2 3 4\n4",
        "expectedOutput": "4 3 2 1"
      },
      {
        "input": "4\n1 2 3 4\n1",
        "expectedOutput": "1 2 3 4"
      },
      {
        "input": "1\n5\n1",
        "expectedOutput": "5"
      },
      {
        "input": "3\n1 2 3\n2",
        "expectedOutput": "2 1 3"
      },
      {
        "input": "4\n9 8 7 6\n3",
        "expectedOutput": "7 8 9 6"
      },
      {
        "input": "4\n1 1 1 1\n2",
        "expectedOutput": "1 1 1 1"
      },
      {
        "input": "5\n10 20 30 40 50\n5",
        "expectedOutput": "50 40 30 20 10"
      },
      {
        "input": "3\n3 1 2\n3",
        "expectedOutput": "2 1 3"
      },
      {
        "input": "2\n4 3\n1",
        "expectedOutput": "4 3"
      },
      {
        "input": "6\n1 2 3 4 5 6\n4",
        "expectedOutput": "4 3 2 1 5 6"
      },
      {
        "input": "3\n7 7 8\n2",
        "expectedOutput": "7 7 8"
      }
    ]
  },
  {
    "id": "first-non-repeating-character-in-stream",
    "hints": ["After each new character, you need the earliest character seen so far with frequency 1.","Maintain a frequency map plus a queue of candidates; after each character, drop queue fronts whose frequency exceeds 1, and the front (or '#') is the answer."],
    "returns": "string",
    "title": "First Non-Repeating Character in a Stream",
    "difficulty": "medium",
    "topic": "queue",
    "companies": [
      "Microsoft",
      "Flipkart"
    ],
    "description": "Given a stream of lowercase characters as a string, after reading each character find the first non-repeating character seen so far. Append '#' when every character seen so far repeats. Return the resulting string.",
    "examples": [
      {
        "input": "aabc",
        "output": "a#bb",
        "explanation": "Reading a, a, b, c: first non-repeating chars are a, then none, then b, then b, giving a#bb."
      },
      {
        "input": "abcabc",
        "output": "aaabc#",
        "explanation": "Reading a, b, c, a, b, c: answers are a, a, a, b, c and then none, giving aaabc#."
      },
      {
        "input": "aabbcc",
        "output": "a#b#c#",
        "explanation": "Reading a, a, b, b, c, c: answers are a, none, b, none, c, none, giving a#b#c#."
      }
    ],
    "constraints": [
      "The stream length is in the range [1, 10000].",
      "The stream contains only lowercase letters."
    ],
    "io": "string",
    "testCases": [
      {
        "input": "aabc",
        "expectedOutput": "a#bb"
      },
      {
        "input": "abcabc",
        "expectedOutput": "aaabc#"
      },
      {
        "input": "aabbcc",
        "expectedOutput": "a#b#c#"
      },
      {
        "input": "a",
        "expectedOutput": "a"
      },
      {
        "input": "aa",
        "expectedOutput": "a#"
      },
      {
        "input": "abcd",
        "expectedOutput": "aaaa"
      },
      {
        "input": "zzxyzz",
        "expectedOutput": "z#xxxx"
      },
      {
        "input": "abac",
        "expectedOutput": "aabb"
      },
      {
        "input": "leetcode",
        "expectedOutput": "llllllll"
      },
      {
        "input": "abc",
        "expectedOutput": "aaa"
      },
      {
        "input": "aabb",
        "expectedOutput": "a#b#"
      },
      {
        "input": "abccba",
        "expectedOutput": "aaaaa#"
      }
    ]
  },
  {
    "id": "infix-to-postfix",
    "hints": ["Operators with higher precedence should appear earlier in the output, and parentheses override precedence.","Use the shunting-yard algorithm: output operands directly, push operators onto a stack popping higher-or-equal precedence ones first, and handle '(' and ')' specially."],
    "returns": "string",
    "title": "Infix to Postfix",
    "difficulty": "medium",
    "topic": "stack",
    "companies": [
      "Amazon",
      "Samsung",
      "Paytm"
    ],
    "description": "Given a valid infix expression, convert it to postfix notation. Operands are single alphanumeric characters. Operators are +, -, *, / and ^ with the usual precedence (^ highest and right-associative). Parentheses may appear.",
    "examples": [
      {
        "input": "a+b*c",
        "output": "abc*+",
        "explanation": "Multiplication binds tighter than addition, so a+b*c becomes abc*+."
      },
      {
        "input": "(a+b)*c",
        "output": "ab+c*",
        "explanation": "Parentheses force the addition first: (a+b)*c becomes ab+c*."
      },
      {
        "input": "a^b^c",
        "output": "abc^^",
        "explanation": "^ is right-associative, so a^b^c becomes abc^^."
      }
    ],
    "constraints": [
      "The expression length is in the range [1, 1000].",
      "The expression is valid and has balanced parentheses."
    ],
    "io": "string",
    "testCases": [
      {
        "input": "a+b*c",
        "expectedOutput": "abc*+"
      },
      {
        "input": "(a+b)*c",
        "expectedOutput": "ab+c*"
      },
      {
        "input": "a^b^c",
        "expectedOutput": "abc^^"
      },
      {
        "input": "a+b",
        "expectedOutput": "ab+"
      },
      {
        "input": "(a)",
        "expectedOutput": "a"
      },
      {
        "input": "a*b+c",
        "expectedOutput": "ab*c+"
      },
      {
        "input": "a+b*(c^d-e)^(f+g*h)-i",
        "expectedOutput": "abcd^e-fgh*+^*+i-"
      },
      {
        "input": "(a+b)*(c-d)",
        "expectedOutput": "ab+cd-*"
      },
      {
        "input": "a-b-c",
        "expectedOutput": "ab-c-"
      },
      {
        "input": "a/b*c",
        "expectedOutput": "ab/c*"
      },
      {
        "input": "x^y^z",
        "expectedOutput": "xyz^^"
      },
      {
        "input": "((a+b))",
        "expectedOutput": "ab+"
      }
    ]
  },
  {
    "id": "longest-valid-parentheses",
    "hints": ["Track positions of unmatched brackets so you can measure the gaps between them.","Push indices onto a stack with a sentinel base; on ')', pop and compute the length as current index minus the new top, pushing a new base when the stack empties."],
    "returns": "int",
    "title": "Longest Valid Parentheses",
    "difficulty": "hard",
    "topic": "stack",
    "companies": [
      "Google",
      "Microsoft"
    ],
    "description": "Given a string containing only '(' and ')', return the length of the longest well-formed parentheses substring.",
    "examples": [
      {
        "input": "(()",
        "output": "2",
        "explanation": "The longest well-formed substring of \"(()\" is \"()\", of length 2."
      },
      {
        "input": ")()())",
        "output": "4",
        "explanation": "The longest well-formed substring of \")()())\" is \"()()\", of length 4."
      },
      {
        "input": "",
        "output": "0",
        "explanation": "An empty string has no valid substring, so the answer is 0."
      }
    ],
    "constraints": [
      "The string length is in the range [0, 30000].",
      "The string contains only '(' and ')'."
    ],
    "io": "string",
    "testCases": [
      {
        "input": "(()",
        "expectedOutput": "2"
      },
      {
        "input": ")()())",
        "expectedOutput": "4"
      },
      {
        "input": "",
        "expectedOutput": "0"
      },
      {
        "input": "()(())",
        "expectedOutput": "6"
      },
      {
        "input": "(((",
        "expectedOutput": "0"
      },
      {
        "input": ")))",
        "expectedOutput": "0"
      },
      {
        "input": "()(()",
        "expectedOutput": "2"
      },
      {
        "input": "(()())",
        "expectedOutput": "6"
      },
      {
        "input": ")()(",
        "expectedOutput": "2"
      },
      {
        "input": "(()(((()",
        "expectedOutput": "2"
      },
      {
        "input": "()()()",
        "expectedOutput": "6"
      },
      {
        "input": "((()))",
        "expectedOutput": "6"
      }
    ]
  },
  {
    "id": "duplicate-parenthesis",
    "hints": ["Redundant parentheses are those that enclose no operator at all.","Push characters onto a stack; when you see ')', pop until '(' and check whether any operator was seen inside — if not, duplicates exist."],
    "returns": "bool",
    "title": "Find If an Expression Has Duplicate Parenthesis",
    "difficulty": "easy",
    "topic": "stack",
    "companies": [
      "Flipkart",
      "Microsoft",
      "Google"
    ],
    "description": "Given a balanced expression, return true if it contains duplicate (redundant) parentheses, meaning some pair of parentheses encloses no operator at all.",
    "examples": [
      {
        "input": "((a+b))",
        "output": "true",
        "explanation": "The outer pair of parentheses in \"((a+b))\" encloses no operator, so the answer is true."
      },
      {
        "input": "(a+b)",
        "output": "false",
        "explanation": "Every pair in \"(a+b)\" encloses the + operator, so the answer is false."
      },
      {
        "input": "(a+(b))",
        "output": "true",
        "explanation": "The pair around (b) encloses no operator, so the answer is true."
      }
    ],
    "constraints": [
      "The expression length is in the range [1, 1000].",
      "Parentheses are balanced."
    ],
    "io": "string",
    "testCases": [
      {
        "input": "((a+b))",
        "expectedOutput": "true"
      },
      {
        "input": "(a+b)",
        "expectedOutput": "false"
      },
      {
        "input": "(a+(b))",
        "expectedOutput": "true"
      },
      {
        "input": "((a+b)+(c+d))",
        "expectedOutput": "false"
      },
      {
        "input": "(a)",
        "expectedOutput": "true"
      },
      {
        "input": "a+b",
        "expectedOutput": "false"
      },
      {
        "input": "((x))",
        "expectedOutput": "true"
      },
      {
        "input": "(a*(b+c))",
        "expectedOutput": "false"
      },
      {
        "input": "(((a+b)))",
        "expectedOutput": "true"
      },
      {
        "input": "(a+b*(c-d))",
        "expectedOutput": "false"
      },
      {
        "input": "(a+(b+(c)))",
        "expectedOutput": "true"
      },
      {
        "input": "(p)",
        "expectedOutput": "true"
      }
    ]
  },
  {
    "id": "sort-stack-using-recursion",
    "hints": ["You can only use the call stack plus a helper that inserts an element into an already sorted stack.","Recursively pop the top, sort the rest, then insert the popped element at its correct position using a recursive insert helper."],
    "returns": "intArr",
    "title": "Sort a Stack Using Recursion",
    "difficulty": "medium",
    "topic": "stack",
    "companies": [
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "description": "A stack is given as an array where the first element is the top of the stack. Sort the stack using recursion so that the smallest element ends up on the top. Return the sorted stack in the same format (first element is the top).",
    "examples": [
      {
        "input": "3\n3 1 2",
        "output": "1 2 3",
        "explanation": "With top 3, sorting smallest-on-top gives 1 2 3."
      },
      {
        "input": "4\n4 3 2 1",
        "output": "1 2 3 4",
        "explanation": "The stack is reversed into ascending order: 1 2 3 4."
      },
      {
        "input": "1\n5",
        "output": "5",
        "explanation": "A single element stack is already sorted: 5."
      }
    ],
    "constraints": [
      "The stack size is in the range [0, 1000].",
      "-10000 <= elements <= 10000"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "3\n3 1 2",
        "expectedOutput": "1 2 3"
      },
      {
        "input": "4\n4 3 2 1",
        "expectedOutput": "1 2 3 4"
      },
      {
        "input": "1\n5",
        "expectedOutput": "5"
      },
      {
        "input": "0\n",
        "expectedOutput": ""
      },
      {
        "input": "4\n1 2 3 4",
        "expectedOutput": "1 2 3 4"
      },
      {
        "input": "3\n2 2 1",
        "expectedOutput": "1 2 2"
      },
      {
        "input": "5\n5 1 4 2 3",
        "expectedOutput": "1 2 3 4 5"
      },
      {
        "input": "3\n-1 -5 0",
        "expectedOutput": "-5 -1 0"
      },
      {
        "input": "1\n9",
        "expectedOutput": "9"
      },
      {
        "input": "3\n3 3 3",
        "expectedOutput": "3 3 3"
      },
      {
        "input": "2\n10 -10",
        "expectedOutput": "-10 10"
      },
      {
        "input": "4\n7 2 9 1",
        "expectedOutput": "1 2 7 9"
      }
    ]
  },
  {
    "id": "next-smaller-element",
    "hints": ["This mirrors next-greater-element but with the comparison flipped.","Scan from right to left with a monotonic increasing stack; pop elements greater than or equal to the current one until the top is smaller or the stack is empty."],
    "returns": "intArr",
    "title": "Next Smaller Element",
    "difficulty": "easy",
    "topic": "stack",
    "companies": [
      "Codenation"
    ],
    "description": "Given an array, for each element find the next smaller element to its right. If there is no smaller element on the right, use -1.",
    "examples": [
      {
        "input": "4\n4 5 2 25",
        "output": "2 2 -1 -1",
        "explanation": "Next smaller to the right: 4 -> 2, 5 -> 2, 2 -> none, 25 -> none, giving 2 2 -1 -1."
      },
      {
        "input": "4\n13 7 6 12",
        "output": "7 6 -1 -1",
        "explanation": "Next smaller to the right: 13 -> 7, 7 -> 6, 6 -> none, 12 -> none, giving 7 6 -1 -1."
      },
      {
        "input": "1\n5",
        "output": "-1",
        "explanation": "A single element has nothing on its right: -1."
      }
    ],
    "constraints": [
      "The array size is in the range [0, 10000].",
      "-10000 <= elements <= 10000"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "4\n4 5 2 25",
        "expectedOutput": "2 2 -1 -1"
      },
      {
        "input": "4\n13 7 6 12",
        "expectedOutput": "7 6 -1 -1"
      },
      {
        "input": "1\n5",
        "expectedOutput": "-1"
      },
      {
        "input": "0\n",
        "expectedOutput": ""
      },
      {
        "input": "4\n1 2 3 4",
        "expectedOutput": "-1 -1 -1 -1"
      },
      {
        "input": "4\n4 3 2 1",
        "expectedOutput": "3 2 1 -1"
      },
      {
        "input": "3\n2 1 2",
        "expectedOutput": "1 -1 -1"
      },
      {
        "input": "3\n5 5 5",
        "expectedOutput": "-1 -1 -1"
      },
      {
        "input": "5\n3 1 4 1 5",
        "expectedOutput": "1 -1 1 -1 -1"
      },
      {
        "input": "1\n10",
        "expectedOutput": "-1"
      },
      {
        "input": "4\n6 2 8 1",
        "expectedOutput": "2 1 1 -1"
      },
      {
        "input": "3\n-1 -2 -3",
        "expectedOutput": "-2 -3 -1"
      }
    ]
  },
  {
    "id": "maximum-of-minimums-every-window-size",
    "hints": ["For each element, determine the range of window sizes in which it is the minimum.","Use previous-smaller and next-smaller boundaries from a monotonic stack to find each element's span, update the answer for that span length, then propagate maximums downward."],
    "returns": "intArr",
    "title": "Maximum of Minimums for Every Window Size",
    "difficulty": "hard",
    "topic": "stack",
    "companies": [
      "Amazon",
      "Microsoft",
      "Flipkart"
    ],
    "description": "Given an array, for every window size k from 1 to n consider all contiguous windows of size k, take the minimum of each window, and then the maximum of those minimums. Return these values for k = 1..n.",
    "examples": [
      {
        "input": "7\n10 20 30 50 10 70 30",
        "output": "70 30 20 10 10 10 10",
        "explanation": "Window minimums peak at 70 for k=1, 30 for k=2, 20 for k=3 and 10 afterwards, giving 70 30 20 10 10 10 10."
      },
      {
        "input": "3\n1 2 3",
        "output": "3 2 1",
        "explanation": "For 1 2 3 the answers for k=1,2,3 are 3, 2, 1, i.e. 3 2 1."
      },
      {
        "input": "1\n5",
        "output": "5",
        "explanation": "A single element array has only one window: 5."
      }
    ],
    "constraints": [
      "1 <= n <= 1000.",
      "-10000 <= elements <= 10000"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "7\n10 20 30 50 10 70 30",
        "expectedOutput": "70 30 20 10 10 10 10"
      },
      {
        "input": "3\n1 2 3",
        "expectedOutput": "3 2 1"
      },
      {
        "input": "1\n5",
        "expectedOutput": "5"
      },
      {
        "input": "3\n3 3 3",
        "expectedOutput": "3 3 3"
      },
      {
        "input": "5\n5 4 3 2 1",
        "expectedOutput": "5 4 3 2 1"
      },
      {
        "input": "5\n1 2 3 4 5",
        "expectedOutput": "5 4 3 2 1"
      },
      {
        "input": "2\n2 1",
        "expectedOutput": "2 1"
      },
      {
        "input": "3\n1 3 2",
        "expectedOutput": "3 2 1"
      },
      {
        "input": "4\n8 8 8 8",
        "expectedOutput": "8 8 8 8"
      },
      {
        "input": "3\n4 1 5",
        "expectedOutput": "5 1 1"
      },
      {
        "input": "1\n7",
        "expectedOutput": "7"
      },
      {
        "input": "4\n9 5 1 8",
        "expectedOutput": "9 5 1 1"
      }
    ]
  },
  {
    "id": "reverse-level-order-traversal",
    "hints": ["This is level order but bottom-up instead of top-down.","Do a normal BFS level order and reverse the list of levels at the end, or push each level onto a stack."],
    "returns": "intArr",
    "title": "Reverse Level Order Traversal",
    "difficulty": "easy",
    "topic": "trees",
    "companies": [
      "Amazon",
      "Microsoft",
      "Adobe"
    ],
    "description": "Given the root of a binary tree, return its level order traversal from bottom to top, with nodes ordered left to right inside each level.",
    "examples": [
      {
        "input": "7\n3 9 20 null null 15 7",
        "output": "15 7 9 20 3",
        "explanation": "Levels bottom-up are [15, 7], [9, 20], [3], so the traversal is 15 7 9 20 3."
      },
      {
        "input": "3\n1 2 3",
        "output": "2 3 1",
        "explanation": "Levels bottom-up are [2, 3], [1], so the traversal is 2 3 1."
      },
      {
        "input": "1\n1",
        "output": "1",
        "explanation": "A single node tree gives 1."
      }
    ],
    "constraints": [
      "The number of nodes is in the range [0, 2000].",
      "-1000 <= Node.val <= 1000"
    ],
    "io": "tree",
    "testCases": [
      {
        "input": "7\n3 9 20 null null 15 7",
        "expectedOutput": "15 7 9 20 3"
      },
      {
        "input": "3\n1 2 3",
        "expectedOutput": "2 3 1"
      },
      {
        "input": "1\n1",
        "expectedOutput": "1"
      },
      {
        "input": "4\n1 2 null 3",
        "expectedOutput": "3 2 1"
      },
      {
        "input": "5\n1 null 2 null 3",
        "expectedOutput": "3 2 1"
      },
      {
        "input": "13\n5 4 8 11 null 13 4 7 2 null null null 1",
        "expectedOutput": "7 2 1 11 13 4 4 8 5"
      },
      {
        "input": "3\n2 1 3",
        "expectedOutput": "1 3 2"
      },
      {
        "input": "5\n1 2 3 4 5",
        "expectedOutput": "4 5 2 3 1"
      },
      {
        "input": "1\n10",
        "expectedOutput": "10"
      },
      {
        "input": "7\n1 2 3 4 null null 5",
        "expectedOutput": "4 5 2 3 1"
      },
      {
        "input": "3\n7 7 7",
        "expectedOutput": "7 7 7"
      },
      {
        "input": "3\n1 null 2",
        "expectedOutput": "2 1"
      }
    ]
  },
  {
    "id": "left-view-of-binary-tree",
    "hints": ["From the left side you see the first node of each level.","Do a level-order traversal and take the first node of each level, or DFS visiting left child first and recording the first node at each depth."],
    "returns": "intArr",
    "title": "Left View of Binary Tree",
    "difficulty": "easy",
    "topic": "trees",
    "companies": [
      "Microsoft",
      "Adobe",
      "Cisco"
    ],
    "description": "Given the root of a binary tree, return its left view: the first node visible at each level when the tree is viewed from the left side.",
    "examples": [
      {
        "input": "7\n3 9 20 null null 15 7",
        "output": "3 9 15",
        "explanation": "The first node of each level from the left is 3, 9, 15, i.e. 3 9 15."
      },
      {
        "input": "3\n1 2 3",
        "output": "1 2",
        "explanation": "The left view is 1, 2, i.e. 1 2."
      },
      {
        "input": "1\n5",
        "output": "5",
        "explanation": "A single node tree shows only that node: 5."
      }
    ],
    "constraints": [
      "The number of nodes is in the range [0, 2000].",
      "-1000 <= Node.val <= 1000"
    ],
    "io": "tree",
    "testCases": [
      {
        "input": "7\n3 9 20 null null 15 7",
        "expectedOutput": "3 9 15"
      },
      {
        "input": "3\n1 2 3",
        "expectedOutput": "1 2"
      },
      {
        "input": "1\n5",
        "expectedOutput": "5"
      },
      {
        "input": "5\n1 null 2 null 3",
        "expectedOutput": "1 2 3"
      },
      {
        "input": "4\n1 2 null 3",
        "expectedOutput": "1 2 3"
      },
      {
        "input": "7\n1 2 3 4 5 6 7",
        "expectedOutput": "1 2 4"
      },
      {
        "input": "4\n10 20 30 40",
        "expectedOutput": "10 20 40"
      },
      {
        "input": "5\n1 2 3 null 4",
        "expectedOutput": "1 2 4"
      },
      {
        "input": "7\n8 3 10 1 6 null 14",
        "expectedOutput": "8 3 1"
      },
      {
        "input": "2\n2 1",
        "expectedOutput": "2 1"
      },
      {
        "input": "4\n1 null 3 2",
        "expectedOutput": "1 3 2"
      },
      {
        "input": "7\n4 2 7 1 3 6 9",
        "expectedOutput": "4 2 1"
      }
    ]
  },
  {
    "id": "leaf-at-same-level",
    "hints": ["All leaves must share one depth, so compare each leaf's depth against the first leaf found.","Track leaf depths during traversal (DFS or BFS) and return false as soon as two leaves have different depths."],
    "returns": "bool",
    "title": "Leaf at Same Level",
    "difficulty": "easy",
    "topic": "trees",
    "companies": [
      "Amazon"
    ],
    "description": "Given the root of a binary tree, return true if all leaf nodes lie at the same level, and false otherwise.",
    "examples": [
      {
        "input": "7\n3 9 20 null null 15 7",
        "output": "false",
        "explanation": "Leaves 9, 15 and 7 are all at depth 2, so the answer is false."
      },
      {
        "input": "4\n1 2 3 4",
        "output": "false",
        "explanation": "Leaf 4 is at depth 2 while leaf 3 is at depth 1, so the answer is false."
      },
      {
        "input": "1\n1",
        "output": "true",
        "explanation": "A single node is itself a leaf, so the answer is true."
      }
    ],
    "constraints": [
      "The number of nodes is in the range [1, 2000].",
      "-1000 <= Node.val <= 1000"
    ],
    "io": "tree",
    "testCases": [
      {
        "input": "7\n3 9 20 null null 15 7",
        "expectedOutput": "false"
      },
      {
        "input": "4\n1 2 3 4",
        "expectedOutput": "false"
      },
      {
        "input": "1\n1",
        "expectedOutput": "true"
      },
      {
        "input": "3\n1 2 3",
        "expectedOutput": "true"
      },
      {
        "input": "5\n1 2 null 3 4",
        "expectedOutput": "true"
      },
      {
        "input": "7\n1 2 3 4 null null null",
        "expectedOutput": "false"
      },
      {
        "input": "2\n2 1",
        "expectedOutput": "true"
      },
      {
        "input": "7\n1 2 3 4 5 6 7",
        "expectedOutput": "true"
      },
      {
        "input": "5\n1 2 3 4 5",
        "expectedOutput": "false"
      },
      {
        "input": "13\n5 4 8 11 null 13 4 7 2 null null null 1",
        "expectedOutput": "false"
      },
      {
        "input": "2\n10 20",
        "expectedOutput": "true"
      },
      {
        "input": "5\n1 null 2 null 3",
        "expectedOutput": "true"
      }
    ]
  },
  {
    "id": "transform-to-sum-tree",
    "hints": ["Each node's new value depends on its children's original values, so children must be processed first.","Use post-order traversal: recursively transform the subtrees, then set the node's value to the sum of the original left and right subtree values."],
    "returns": "tree",
    "title": "Transform to Sum Tree",
    "difficulty": "medium",
    "topic": "trees",
    "companies": [
      "Amazon",
      "Microsoft",
      "Samsung"
    ],
    "description": "Given the root of a binary tree, transform it into a sum tree: every node value becomes the sum of the values of its left and right subtrees in the original tree. Leaf nodes become 0. Return the root of the transformed tree.",
    "examples": [
      {
        "input": "7\n10 -2 6 8 -4 7 5",
        "output": "20 4 12 0 0 0 0",
        "explanation": "Each node is replaced by the sum of its original subtrees, giving the level order 20 4 12 0 0 0 0."
      },
      {
        "input": "3\n1 2 3",
        "output": "5 0 0",
        "explanation": "The root becomes 2 + 3 = 5 and both leaves become 0, giving 5 0 0."
      },
      {
        "input": "1\n5",
        "output": "0",
        "explanation": "A single leaf node becomes 0: 0."
      }
    ],
    "constraints": [
      "The number of nodes is in the range [1, 2000].",
      "-1000 <= Node.val <= 1000"
    ],
    "io": "tree",
    "testCases": [
      {
        "input": "7\n10 -2 6 8 -4 7 5",
        "expectedOutput": "20 4 12 0 0 0 0"
      },
      {
        "input": "3\n1 2 3",
        "expectedOutput": "5 0 0"
      },
      {
        "input": "1\n5",
        "expectedOutput": "0"
      },
      {
        "input": "5\n1 2 3 4 5",
        "expectedOutput": "14 9 0 0 0"
      },
      {
        "input": "2\n2 1",
        "expectedOutput": "1 0"
      },
      {
        "input": "7\n4 2 7 1 3 6 9",
        "expectedOutput": "28 4 15 0 0 0 0"
      },
      {
        "input": "3\n0 0 0",
        "expectedOutput": "0 0 0"
      },
      {
        "input": "3\n3 1 2",
        "expectedOutput": "3 0 0"
      },
      {
        "input": "5\n1 null 2 null 3",
        "expectedOutput": "5 null 3 null 0"
      },
      {
        "input": "3\n6 3 8",
        "expectedOutput": "11 0 0"
      },
      {
        "input": "4\n1 2 null 3",
        "expectedOutput": "5 3 null 0"
      },
      {
        "input": "3\n7 7 7",
        "expectedOutput": "14 0 0"
      }
    ]
  },
  {
    "id": "check-if-tree-is-isomorphic",
    "hints": ["At each pair of nodes, you may either keep the children as-is or swap them.","Recursively check both possibilities: (left1 vs left2 and right1 vs right2) or (left1 vs right2 and right1 vs left2)."],
    "returns": "bool",
    "title": "Check if Tree is Isomorphic",
    "difficulty": "medium",
    "topic": "trees",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Given the roots of two binary trees, return true if one tree can be turned into the other by swapping the left and right children of any number of nodes.",
    "examples": [
      {
        "input": "3\n1 2 3\n3\n1 3 2",
        "output": "true",
        "explanation": "Swapping the children of the root turns the first tree into the second, so the answer is true."
      },
      {
        "input": "3\n1 2 3\n3\n1 2 null",
        "output": "false",
        "explanation": "The second tree has fewer nodes, so they cannot be isomorphic: false."
      },
      {
        "input": "1\n1\n1\n1",
        "output": "true",
        "explanation": "Two single-node trees with the same value are isomorphic: true."
      }
    ],
    "constraints": [
      "Each tree has 1 to 2000 nodes.",
      "-1000 <= Node.val <= 1000"
    ],
    "io": "two-trees",
    "testCases": [
      {
        "input": "3\n1 2 3\n3\n1 3 2",
        "expectedOutput": "true"
      },
      {
        "input": "3\n1 2 3\n3\n1 2 null",
        "expectedOutput": "false"
      },
      {
        "input": "1\n1\n1\n1",
        "expectedOutput": "true"
      },
      {
        "input": "3\n1 2 3\n3\n1 2 3",
        "expectedOutput": "true"
      },
      {
        "input": "2\n1 2\n2\n2 1",
        "expectedOutput": "false"
      },
      {
        "input": "4\n1 2 3 4\n7\n1 3 2 null null 4 null",
        "expectedOutput": "true"
      },
      {
        "input": "3\n1 2 3\n3\n4 5 6",
        "expectedOutput": "false"
      },
      {
        "input": "3\n5 4 8\n3\n5 8 4",
        "expectedOutput": "true"
      },
      {
        "input": "4\n1 2 null 3\n5\n1 null 2 null 3",
        "expectedOutput": "true"
      },
      {
        "input": "1\n1\n1\n2",
        "expectedOutput": "false"
      },
      {
        "input": "7\n3 9 20 null null 15 7\n5\n3 20 9 7 15",
        "expectedOutput": "true"
      },
      {
        "input": "5\n1 2 3 4 5\n6\n1 2 3 4 5 6",
        "expectedOutput": "false"
      }
    ]
  },
  {
    "id": "top-view-of-binary-tree",
    "hints": ["Each vertical column shows only its topmost node.","Do a BFS tracking horizontal distance from the root; record the first node seen at each distance and output them left to right."],
    "returns": "intArr",
    "title": "Top View of Binary Tree",
    "difficulty": "medium",
    "topic": "trees",
    "companies": [
      "Microsoft",
      "Adobe",
      "Expedia"
    ],
    "description": "Given the root of a binary tree, return its top view: the nodes visible when the tree is viewed from the top, ordered from left to right.",
    "examples": [
      {
        "input": "7\n1 2 3 4 5 6 7",
        "output": "4 2 1 3 7",
        "explanation": "From the top, the visible nodes left to right are 4, 2, 1, 3, 7, i.e. 4 2 1 3 7."
      },
      {
        "input": "3\n1 2 3",
        "output": "2 1 3",
        "explanation": "The top view of this small tree is 2 1 3."
      },
      {
        "input": "1\n10",
        "output": "10",
        "explanation": "A single node tree shows only that node: 10."
      }
    ],
    "constraints": [
      "The number of nodes is in the range [1, 2000].",
      "-1000 <= Node.val <= 1000"
    ],
    "io": "tree",
    "testCases": [
      {
        "input": "7\n1 2 3 4 5 6 7",
        "expectedOutput": "4 2 1 3 7"
      },
      {
        "input": "3\n1 2 3",
        "expectedOutput": "2 1 3"
      },
      {
        "input": "1\n10",
        "expectedOutput": "10"
      },
      {
        "input": "7\n1 2 3 null 4 null 5",
        "expectedOutput": "2 1 3 5"
      },
      {
        "input": "4\n1 2 null 3",
        "expectedOutput": "3 2 1"
      },
      {
        "input": "5\n1 null 2 null 3",
        "expectedOutput": "1 2 3"
      },
      {
        "input": "7\n20 8 22 5 3 null 25",
        "expectedOutput": "5 8 20 22 25"
      },
      {
        "input": "5\n1 2 3 4 5",
        "expectedOutput": "4 2 1 3"
      },
      {
        "input": "7\n3 9 20 null null 15 7",
        "expectedOutput": "9 3 20 7"
      },
      {
        "input": "2\n2 1",
        "expectedOutput": "1 2"
      },
      {
        "input": "7\n1 2 3 4 null 5 6",
        "expectedOutput": "4 2 1 3 6"
      },
      {
        "input": "7\n4 2 7 1 3 6 9",
        "expectedOutput": "1 2 4 7 9"
      }
    ]
  },
  {
    "id": "bottom-view-of-binary-tree",
    "hints": ["Each vertical column shows only its bottommost node.","Do a BFS tracking horizontal distance; overwrite the recorded node at each distance so the last (deepest) one wins, then output left to right."],
    "returns": "intArr",
    "title": "Bottom View of Binary Tree",
    "difficulty": "medium",
    "topic": "trees",
    "companies": [
      "DE Shaw"
    ],
    "description": "Given the root of a binary tree, return its bottom view: the bottommost node at each horizontal distance, ordered from left to right.",
    "examples": [
      {
        "input": "7\n1 2 3 4 5 6 7",
        "output": "4 2 6 3 7",
        "explanation": "The bottommost node at each horizontal distance, left to right, is 4, 2, 6, 3, 7, i.e. 4 2 6 3 7."
      },
      {
        "input": "3\n1 2 3",
        "output": "2 1 3",
        "explanation": "The bottom view of this small tree is 2 1 3."
      },
      {
        "input": "1\n10",
        "output": "10",
        "explanation": "A single node tree shows only that node: 10."
      }
    ],
    "constraints": [
      "The number of nodes is in the range [1, 2000].",
      "-1000 <= Node.val <= 1000"
    ],
    "io": "tree",
    "testCases": [
      {
        "input": "7\n1 2 3 4 5 6 7",
        "expectedOutput": "4 2 6 3 7"
      },
      {
        "input": "3\n1 2 3",
        "expectedOutput": "2 1 3"
      },
      {
        "input": "1\n10",
        "expectedOutput": "10"
      },
      {
        "input": "7\n1 2 3 null 4 null 5",
        "expectedOutput": "2 4 3 5"
      },
      {
        "input": "7\n20 8 22 5 3 null 25",
        "expectedOutput": "5 8 3 22 25"
      },
      {
        "input": "4\n1 2 null 3",
        "expectedOutput": "3 2 1"
      },
      {
        "input": "5\n1 null 2 null 3",
        "expectedOutput": "1 2 3"
      },
      {
        "input": "7\n3 9 20 null null 15 7",
        "expectedOutput": "9 15 20 7"
      },
      {
        "input": "5\n1 2 3 4 5",
        "expectedOutput": "4 2 5 3"
      },
      {
        "input": "2\n2 1",
        "expectedOutput": "1 2"
      },
      {
        "input": "7\n1 2 3 4 null 5 6",
        "expectedOutput": "4 2 5 3 6"
      },
      {
        "input": "7\n4 2 7 1 3 6 9",
        "expectedOutput": "1 2 6 7 9"
      }
    ]
  },
  {
    "id": "diagonal-traversal-of-binary-tree",
    "hints": ["Nodes on the same diagonal share a slope: moving right keeps you on the diagonal, moving left drops you one down.","Traverse with a diagonal index (right child keeps it, left child increments it) and group nodes by index using a map."],
    "returns": "intArr",
    "title": "Diagonal Traversal of Binary Tree",
    "difficulty": "medium",
    "topic": "trees",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Given the root of a binary tree, return its diagonal traversal: print the nodes of the topmost-right diagonal first, then the next diagonal below it, and so on. Inside each diagonal list nodes top to bottom, left to right.",
    "examples": [
      {
        "input": "13\n8 3 10 1 6 null 14 null null 4 7 13 null",
        "output": "8 10 14 3 6 7 13 1 4",
        "explanation": "The diagonals are [8, 10, 14], [3, 6, 7, 13] and [1, 4], flattened to 8 10 14 3 6 7 13 1 4."
      },
      {
        "input": "3\n1 2 3",
        "output": "1 3 2",
        "explanation": "The diagonals are [1, 3] and [2], giving 1 3 2."
      },
      {
        "input": "1\n5",
        "output": "5",
        "explanation": "A single node tree gives 5."
      }
    ],
    "constraints": [
      "The number of nodes is in the range [1, 2000].",
      "-1000 <= Node.val <= 1000"
    ],
    "io": "tree",
    "testCases": [
      {
        "input": "13\n8 3 10 1 6 null 14 null null 4 7 13 null",
        "expectedOutput": "8 10 14 3 6 7 13 1 4"
      },
      {
        "input": "3\n1 2 3",
        "expectedOutput": "1 3 2"
      },
      {
        "input": "1\n5",
        "expectedOutput": "5"
      },
      {
        "input": "7\n1 2 3 4 5 6 7",
        "expectedOutput": "1 3 7 2 5 6 4"
      },
      {
        "input": "5\n1 2 null 3 4",
        "expectedOutput": "1 2 4 3"
      },
      {
        "input": "5\n1 null 2 null 3",
        "expectedOutput": "1 2 3"
      },
      {
        "input": "7\n4 2 7 1 3 6 9",
        "expectedOutput": "4 7 9 2 3 6 1"
      },
      {
        "input": "4\n10 20 30 40",
        "expectedOutput": "10 30 20 40"
      },
      {
        "input": "7\n3 9 20 null null 15 7",
        "expectedOutput": "3 20 7 9 15"
      },
      {
        "input": "2\n2 1",
        "expectedOutput": "2 1"
      },
      {
        "input": "7\n1 2 3 null 4 5 null",
        "expectedOutput": "1 3 2 4 5"
      },
      {
        "input": "3\n6 3 8",
        "expectedOutput": "6 8 3"
      }
    ]
  },
  {
    "id": "boundary-traversal-of-binary-tree",
    "hints": ["The boundary has three parts that must not double-count leaves.","Collect the left boundary top-down excluding leaves, then all leaves left to right, then the right boundary bottom-up excluding leaves."],
    "returns": "intArr",
    "title": "Boundary Traversal of Binary Tree",
    "difficulty": "medium",
    "topic": "trees",
    "companies": [
      "Amazon",
      "Accolite",
      "FactSet"
    ],
    "description": "Given the root of a binary tree, return its boundary traversal: the left boundary top-down (excluding leaves), then all leaf nodes left to right, then the right boundary bottom-up (excluding leaves).",
    "examples": [
      {
        "input": "7\n1 2 3 4 5 6 7",
        "output": "1 2 4 5 6 7 3",
        "explanation": "Left boundary 1, 2; leaves 4, 5, 6, 7; right boundary 3, giving 1 2 4 5 6 7 3."
      },
      {
        "input": "3\n1 2 3",
        "output": "1 2 3",
        "explanation": "Root 1, leaves 2, 3 and no separate boundaries give 1 2 3."
      },
      {
        "input": "1\n1",
        "output": "1",
        "explanation": "A single node is the whole boundary: 1."
      }
    ],
    "constraints": [
      "The number of nodes is in the range [1, 2000].",
      "-1000 <= Node.val <= 1000"
    ],
    "io": "tree",
    "testCases": [
      {
        "input": "7\n1 2 3 4 5 6 7",
        "expectedOutput": "1 2 4 5 6 7 3"
      },
      {
        "input": "3\n1 2 3",
        "expectedOutput": "1 2 3"
      },
      {
        "input": "1\n1",
        "expectedOutput": "1"
      },
      {
        "input": "7\n1 2 3 null 4 5 null",
        "expectedOutput": "1 2 4 5 3"
      },
      {
        "input": "5\n1 null 2 null 3",
        "expectedOutput": "1 3 2"
      },
      {
        "input": "4\n1 2 null 3",
        "expectedOutput": "1 2 3"
      },
      {
        "input": "7\n20 8 22 5 3 null 25",
        "expectedOutput": "20 8 5 3 25 22"
      },
      {
        "input": "6\n1 2 3 4 5 6",
        "expectedOutput": "1 2 4 5 6 3"
      },
      {
        "input": "7\n4 2 7 1 3 6 9",
        "expectedOutput": "4 2 1 3 6 9 7"
      },
      {
        "input": "2\n2 1",
        "expectedOutput": "2 1"
      },
      {
        "input": "5\n10 20 30 40 50",
        "expectedOutput": "10 20 40 50 30"
      },
      {
        "input": "7\n1 2 3 4 null null 5",
        "expectedOutput": "1 2 4 5 3"
      }
    ]
  },
  {
    "id": "construct-binary-tree-from-string-brackets",
    "hints": ["The string encodes a preorder structure where parentheses delimit subtrees.","Parse with an index pointer: read the number, then recursively parse the left child inside the first bracket pair and the right child inside the second."],
    "returns": "tree",
    "title": "Construct Binary Tree from String with Brackets",
    "difficulty": "medium",
    "topic": "trees",
    "companies": [
      "Microsoft",
      "Samsung",
      "Oyo"
    ],
    "description": "Given a string encoding a binary tree as value(left-subtree)(right-subtree), e.g. 4(2(3)(1))(6(5)), construct the tree and return its root. Values may be negative and multi-digit; a missing child is simply omitted.",
    "examples": [
      {
        "input": "4(2(3)(1))(6(5))",
        "output": "4 2 6 3 1 5",
        "explanation": "4 has left child 2 (with children 3 and 1) and right child 6 (with child 5); level order is 4 2 6 3 1 5."
      },
      {
        "input": "1(2)(3)",
        "output": "1 2 3",
        "explanation": "A simple tree with root 1 and children 2, 3 gives level order 1 2 3."
      },
      {
        "input": "1",
        "output": "1",
        "explanation": "A single value builds a single node tree: 1."
      }
    ],
    "constraints": [
      "The string length is in the range [1, 1000].",
      "The string is a valid encoding."
    ],
    "io": "string",
    "testCases": [
      {
        "input": "4(2(3)(1))(6(5))",
        "expectedOutput": "4 2 6 3 1 5"
      },
      {
        "input": "1(2)(3)",
        "expectedOutput": "1 2 3"
      },
      {
        "input": "1",
        "expectedOutput": "1"
      },
      {
        "input": "1(2(3))",
        "expectedOutput": "1 2 null 3"
      },
      {
        "input": "-1(-2)(-3)",
        "expectedOutput": "-1 -2 -3"
      },
      {
        "input": "10(5)(15)",
        "expectedOutput": "10 5 15"
      },
      {
        "input": "1(2(4)(5))(3(6)(7))",
        "expectedOutput": "1 2 3 4 5 6 7"
      },
      {
        "input": "5",
        "expectedOutput": "5"
      },
      {
        "input": "2(1)",
        "expectedOutput": "2 1"
      },
      {
        "input": "3(1)(2)",
        "expectedOutput": "3 1 2"
      },
      {
        "input": "7(3(1))(9)",
        "expectedOutput": "7 3 9 1"
      },
      {
        "input": "12(-4(2))",
        "expectedOutput": "12 -4 null 2"
      }
    ]
  },
  {
    "id": "min-swaps-convert-binary-tree-to-bst",
    "hints": ["A BST's inorder traversal is sorted, so the problem becomes sorting the inorder sequence.","Compute the inorder traversal, then count minimum swaps to sort it using cycle decomposition of the permutation."],
    "returns": "int",
    "title": "Minimum Swaps to Convert Binary Tree to BST",
    "difficulty": "medium",
    "topic": "trees",
    "companies": [
      "Adobe",
      "Amazon"
    ],
    "description": "A binary tree is given as a level-order array of a complete binary tree with distinct values. Return the minimum number of swaps required to convert it into a binary search tree, which equals the minimum swaps needed to sort its inorder traversal.",
    "examples": [
      {
        "input": "5\n5 6 7 8 9",
        "output": "2",
        "explanation": "The inorder is 8, 6, 9, 5, 7 which needs 2 swaps to become sorted."
      },
      {
        "input": "3\n1 2 3",
        "output": "1",
        "explanation": "The inorder is 2, 1, 3 which needs 1 swap to become sorted."
      },
      {
        "input": "3\n3 2 1",
        "output": "2",
        "explanation": "The inorder is 2, 3, 1 which needs 2 swaps to become sorted."
      }
    ],
    "constraints": [
      "1 <= n <= 10000.",
      "All values are distinct."
    ],
    "io": "array",
    "testCases": [
      {
        "input": "5\n5 6 7 8 9",
        "expectedOutput": "2"
      },
      {
        "input": "3\n1 2 3",
        "expectedOutput": "1"
      },
      {
        "input": "3\n3 2 1",
        "expectedOutput": "2"
      },
      {
        "input": "7\n8 6 10 5 7 9 11",
        "expectedOutput": "0"
      },
      {
        "input": "4\n4 3 2 1",
        "expectedOutput": "2"
      },
      {
        "input": "2\n2 1",
        "expectedOutput": "0"
      },
      {
        "input": "3\n2 3 1",
        "expectedOutput": "1"
      },
      {
        "input": "3\n10 5 15",
        "expectedOutput": "0"
      },
      {
        "input": "3\n7 1 9",
        "expectedOutput": "0"
      },
      {
        "input": "7\n9 8 7 6 5 4 3",
        "expectedOutput": "4"
      },
      {
        "input": "1\n1",
        "expectedOutput": "0"
      },
      {
        "input": "7\n5 4 3 2 1 6 7",
        "expectedOutput": "5"
      }
    ]
  },
  {
    "id": "lowest-common-ancestor-of-binary-tree",
    "hints": ["The LCA is the first node where the two targets split into different subtrees, or one of the targets itself.","Recursively search both subtrees; if both sides return non-null, the current node is the LCA, otherwise propagate whichever side found a target."],
    "returns": "int",
    "title": "Lowest Common Ancestor in a Binary Tree",
    "difficulty": "medium",
    "topic": "trees",
    "companies": [
      "Amazon",
      "Cisco",
      "Microsoft"
    ],
    "description": "Given the root of a binary tree and two distinct node values a and b (both present in the tree), return the value of their lowest common ancestor. The input gives the tree, then a and b separated by a space.",
    "examples": [
      {
        "input": "11\n3 5 1 6 2 0 8 null null 7 4\n5 1",
        "output": "3",
        "explanation": "Nodes 5 and 1 split at the root 3, so the LCA value is 3."
      },
      {
        "input": "11\n3 5 1 6 2 0 8 null null 7 4\n5 4",
        "output": "5",
        "explanation": "Node 5 is an ancestor of 4, so the LCA value is 5."
      },
      {
        "input": "3\n1 2 3\n2 3",
        "output": "1",
        "explanation": "Nodes 2 and 3 meet at the root 1, so the LCA value is 1."
      }
    ],
    "constraints": [
      "The tree has 2 to 2000 nodes.",
      "a and b are distinct values present in the tree."
    ],
    "io": "tree-two-ints",
    "testCases": [
      {
        "input": "11\n3 5 1 6 2 0 8 null null 7 4\n5 1",
        "expectedOutput": "3"
      },
      {
        "input": "11\n3 5 1 6 2 0 8 null null 7 4\n5 4",
        "expectedOutput": "5"
      },
      {
        "input": "3\n1 2 3\n2 3",
        "expectedOutput": "1"
      },
      {
        "input": "2\n1 2\n1 2",
        "expectedOutput": "1"
      },
      {
        "input": "7\n1 2 3 4 5 6 7\n4 5",
        "expectedOutput": "2"
      },
      {
        "input": "7\n1 2 3 4 5 6 7\n4 6",
        "expectedOutput": "1"
      },
      {
        "input": "7\n1 2 3 4 5 6 7\n6 7",
        "expectedOutput": "3"
      },
      {
        "input": "8\n5 3 6 2 4 null null 1\n1 4",
        "expectedOutput": "3"
      },
      {
        "input": "8\n5 3 6 2 4 null null 1\n3 1",
        "expectedOutput": "3"
      },
      {
        "input": "3\n2 1 3\n1 3",
        "expectedOutput": "2"
      },
      {
        "input": "4\n1 2 3 4\n4 3",
        "expectedOutput": "1"
      },
      {
        "input": "5\n7 3 9 1 5\n1 5",
        "expectedOutput": "3"
      }
    ]
  },
  {
    "id": "min-distance-between-two-nodes",
    "hints": ["Distance between two nodes always passes through their lowest common ancestor.","Find the LCA, then the answer is the depth of a plus the depth of b measured from the LCA."],
    "returns": "int",
    "title": "Min Distance Between Two Given Nodes of a Binary Tree",
    "difficulty": "medium",
    "topic": "trees",
    "companies": [
      "Amazon",
      "Ola",
      "Qualcomm"
    ],
    "description": "Given the root of a binary tree and two distinct node values a and b (both present in the tree), return the minimum distance between them measured in edges. The input gives the tree, then a and b separated by a space.",
    "examples": [
      {
        "input": "7\n1 2 3 4 5 6 7\n4 5",
        "output": "2",
        "explanation": "Nodes 4 and 5 share parent 2, so the distance is 2 edges."
      },
      {
        "input": "7\n1 2 3 4 5 6 7\n4 7",
        "output": "4",
        "explanation": "The path 4 -> 2 -> 1 -> 3 -> 7 has 4 edges."
      },
      {
        "input": "3\n1 2 3\n2 3",
        "output": "2",
        "explanation": "Nodes 2 and 3 meet at the root, so the distance is 2 edges."
      }
    ],
    "constraints": [
      "The tree has 2 to 2000 nodes.",
      "a and b are distinct values present in the tree."
    ],
    "io": "tree-two-ints",
    "testCases": [
      {
        "input": "7\n1 2 3 4 5 6 7\n4 5",
        "expectedOutput": "2"
      },
      {
        "input": "7\n1 2 3 4 5 6 7\n4 7",
        "expectedOutput": "4"
      },
      {
        "input": "3\n1 2 3\n2 3",
        "expectedOutput": "2"
      },
      {
        "input": "2\n1 2\n1 2",
        "expectedOutput": "1"
      },
      {
        "input": "11\n3 5 1 6 2 0 8 null null 7 4\n7 4",
        "expectedOutput": "2"
      },
      {
        "input": "11\n3 5 1 6 2 0 8 null null 7 4\n6 8",
        "expectedOutput": "4"
      },
      {
        "input": "8\n5 3 6 2 4 null null 1\n1 6",
        "expectedOutput": "4"
      },
      {
        "input": "5\n1 2 3 4 5\n4 3",
        "expectedOutput": "3"
      },
      {
        "input": "3\n2 1 3\n1 3",
        "expectedOutput": "2"
      },
      {
        "input": "7\n4 2 7 1 3 6 9\n1 9",
        "expectedOutput": "4"
      },
      {
        "input": "7\n1 2 3 4 5 6 7\n2 3",
        "expectedOutput": "2"
      },
      {
        "input": "3\n10 20 30\n20 30",
        "expectedOutput": "2"
      }
    ]
  },
  {
    "id": "kth-ancestor-of-node-in-binary-tree",
    "hints": ["Think about the path from the root down to the target node.","Find the root-to-target path with DFS, then the kth ancestor is the node k positions before the target on that path."],
    "returns": "int",
    "title": "Kth Ancestor of a Node in Binary Tree",
    "difficulty": "medium",
    "topic": "trees",
    "companies": [
      "Josh Technology"
    ],
    "description": "Given the root of a binary tree, a target node value a and an integer k, return the value of the kth ancestor of the target node. Return -1 if the kth ancestor does not exist. The input gives the tree, then a (target) and b (k) separated by a space.",
    "examples": [
      {
        "input": "7\n1 2 3 4 5 6 7\n4 2",
        "output": "1",
        "explanation": "Ancestors of 4 are 2 then 1, so the 2nd ancestor is 1."
      },
      {
        "input": "7\n1 2 3 4 5 6 7\n4 1",
        "output": "2",
        "explanation": "The 1st ancestor (parent) of 4 is 2."
      },
      {
        "input": "7\n1 2 3 4 5 6 7\n4 3",
        "output": "-1",
        "explanation": "Node 4 has only 2 ancestors, so the 3rd ancestor does not exist: -1."
      }
    ],
    "constraints": [
      "The tree has 1 to 2000 nodes.",
      "a is present in the tree.",
      "1 <= k <= 1000"
    ],
    "io": "tree-two-ints",
    "testCases": [
      {
        "input": "7\n1 2 3 4 5 6 7\n4 2",
        "expectedOutput": "1"
      },
      {
        "input": "7\n1 2 3 4 5 6 7\n4 1",
        "expectedOutput": "2"
      },
      {
        "input": "7\n1 2 3 4 5 6 7\n4 3",
        "expectedOutput": "-1"
      },
      {
        "input": "7\n1 2 3 4 5 6 7\n7 2",
        "expectedOutput": "1"
      },
      {
        "input": "7\n1 2 3 4 5 6 7\n1 1",
        "expectedOutput": "-1"
      },
      {
        "input": "11\n3 5 1 6 2 0 8 null null 7 4\n7 2",
        "expectedOutput": "5"
      },
      {
        "input": "11\n3 5 1 6 2 0 8 null null 7 4\n7 3",
        "expectedOutput": "3"
      },
      {
        "input": "11\n3 5 1 6 2 0 8 null null 7 4\n7 4",
        "expectedOutput": "-1"
      },
      {
        "input": "3\n2 1 3\n3 1",
        "expectedOutput": "2"
      },
      {
        "input": "4\n10 20 30 40\n40 2",
        "expectedOutput": "10"
      },
      {
        "input": "4\n10 20 30 40\n40 1",
        "expectedOutput": "20"
      },
      {
        "input": "5\n1 2 3 4 5\n5 1",
        "expectedOutput": "2"
      }
    ]
  },
  {
    "id": "binary-tree-maximum-path-sum",
    "hints": ["The best path through a node combines the best downward paths from its left and right children.","Return the max gain upward (node value plus the better child's gain, floored at 0), while tracking the global best of left gain + right gain + node value."],
    "returns": "int",
    "title": "Binary Tree Maximum Path Sum",
    "difficulty": "hard",
    "topic": "trees",
    "companies": [
      "Samsung",
      "Facebook"
    ],
    "description": "Given the root of a binary tree, return the maximum path sum. A path is any sequence of nodes from some starting node to any other node going only through parent-child connections, and it must contain at least one node.",
    "examples": [
      {
        "input": "3\n1 2 3",
        "output": "6",
        "explanation": "The best path is 2 -> 1 -> 3 with sum 6."
      },
      {
        "input": "7\n-10 9 20 null null 15 7",
        "output": "42",
        "explanation": "The best path is 15 -> 20 -> 7 with sum 42."
      },
      {
        "input": "1\n-3",
        "output": "-3",
        "explanation": "A single negative node must form the path alone, giving -3."
      }
    ],
    "constraints": [
      "The tree has 1 to 2000 nodes.",
      "-1000 <= Node.val <= 1000"
    ],
    "io": "tree",
    "testCases": [
      {
        "input": "3\n1 2 3",
        "expectedOutput": "6"
      },
      {
        "input": "7\n-10 9 20 null null 15 7",
        "expectedOutput": "42"
      },
      {
        "input": "1\n-3",
        "expectedOutput": "-3"
      },
      {
        "input": "2\n2 1",
        "expectedOutput": "3"
      },
      {
        "input": "5\n1 2 3 4 5",
        "expectedOutput": "11"
      },
      {
        "input": "2\n-2 -1",
        "expectedOutput": "-1"
      },
      {
        "input": "13\n5 4 8 11 null 13 4 7 2 null null null 1",
        "expectedOutput": "48"
      },
      {
        "input": "1\n1",
        "expectedOutput": "1"
      },
      {
        "input": "3\n1 -2 3",
        "expectedOutput": "4"
      },
      {
        "input": "7\n9 6 -3 null null -6 2",
        "expectedOutput": "15"
      },
      {
        "input": "1\n0",
        "expectedOutput": "0"
      },
      {
        "input": "3\n2 -1 -2",
        "expectedOutput": "2"
      }
    ]
  },
  {
    "id": "serialize-and-deserialize-binary-tree",
    "hints": ["Level order with explicit nulls captures the exact structure.","Serialize with BFS writing null for missing children and trimming trailing nulls; deserialize by reading values in pairs as left/right children using a queue."],
    "returns": "string",
    "title": "Serialize and Deserialize Binary Tree",
    "difficulty": "hard",
    "topic": "trees",
    "companies": [
      "Flipkart",
      "Microsoft",
      "Linkedin"
    ],
    "description": "Write a function that serializes a binary tree into a string so it can be deserialized back later. Use level-order traversal, write null for missing children, trim trailing nulls, and join values with commas.",
    "examples": [
      {
        "input": "7\n1 2 3 null null 4 5",
        "output": "1,2,3,null,null,4,5",
        "explanation": "Level order with nulls, trailing nulls trimmed, joined by commas gives 1,2,3,null,null,4,5."
      },
      {
        "input": "1\n1",
        "output": "1",
        "explanation": "A single node serializes to 1."
      },
      {
        "input": "3\n1 2 3",
        "output": "1,2,3",
        "explanation": "A complete three-node tree serializes to 1,2,3."
      }
    ],
    "constraints": [
      "The number of nodes is in the range [0, 2000].",
      "-1000 <= Node.val <= 1000"
    ],
    "io": "tree",
    "testCases": [
      {
        "input": "7\n1 2 3 null null 4 5",
        "expectedOutput": "1,2,3,null,null,4,5"
      },
      {
        "input": "1\n1",
        "expectedOutput": "1"
      },
      {
        "input": "3\n1 2 3",
        "expectedOutput": "1,2,3"
      },
      {
        "input": "5\n1 null 2 null 3",
        "expectedOutput": "1,null,2,null,3"
      },
      {
        "input": "7\n3 9 20 null null 15 7",
        "expectedOutput": "3,9,20,null,null,15,7"
      },
      {
        "input": "13\n5 4 8 11 null 13 4 7 2 null null null 1",
        "expectedOutput": "5,4,8,11,null,13,4,7,2,null,null,null,1"
      },
      {
        "input": "2\n2 1",
        "expectedOutput": "2,1"
      },
      {
        "input": "4\n1 2 null 3",
        "expectedOutput": "1,2,null,3"
      },
      {
        "input": "1\n10",
        "expectedOutput": "10"
      },
      {
        "input": "3\n-1 -2 -3",
        "expectedOutput": "-1,-2,-3"
      },
      {
        "input": "4\n1 2 3 4",
        "expectedOutput": "1,2,3,4"
      },
      {
        "input": "3\n7 null 9",
        "expectedOutput": "7,null,9"
      }
    ]
  },
  {
    "id": "binary-tree-to-dll",
    "hints": ["Inorder traversal of the tree gives the DLL order.","Do an inorder traversal while linking each visited node to the previous one with left/right pointers, then return the leftmost node as head."],
    "returns": "intArr",
    "title": "Binary Tree to DLL",
    "difficulty": "medium",
    "topic": "trees",
    "companies": [
      "Amazon",
      "Microsoft",
      "Goldman Sachs"
    ],
    "description": "Given the root of a binary tree, convert it into a doubly linked list in place following the inorder traversal order. Return the values of the doubly linked list from head to tail as an array.",
    "examples": [
      {
        "input": "3\n4 2 5",
        "output": "2 4 5",
        "explanation": "The inorder traversal is 2, 4, 5, so the DLL values head to tail are 2 4 5."
      },
      {
        "input": "1\n7",
        "output": "7",
        "explanation": "A single node tree gives a single-node list: 7."
      },
      {
        "input": "7\n10 12 15 25 30 36 null",
        "output": "25 12 30 10 36 15",
        "explanation": "The inorder traversal gives 25 12 30 10 36 15."
      }
    ],
    "constraints": [
      "The number of nodes is in the range [1, 2000].",
      "-1000 <= Node.val <= 1000"
    ],
    "io": "tree",
    "testCases": [
      {
        "input": "3\n4 2 5",
        "expectedOutput": "2 4 5"
      },
      {
        "input": "1\n7",
        "expectedOutput": "7"
      },
      {
        "input": "7\n10 12 15 25 30 36 null",
        "expectedOutput": "25 12 30 10 36 15"
      },
      {
        "input": "5\n1 2 3 4 5",
        "expectedOutput": "4 2 5 1 3"
      },
      {
        "input": "5\n1 null 2 null 3",
        "expectedOutput": "1 2 3"
      },
      {
        "input": "3\n3 1 2",
        "expectedOutput": "1 3 2"
      },
      {
        "input": "7\n8 3 10 1 6 null 14",
        "expectedOutput": "1 3 6 8 10 14"
      },
      {
        "input": "2\n2 1",
        "expectedOutput": "1 2"
      },
      {
        "input": "13\n5 4 8 11 null 13 4 7 2 null null null 1",
        "expectedOutput": "7 11 2 4 5 13 8 4 1"
      },
      {
        "input": "7\n1 2 3 4 null null 5",
        "expectedOutput": "4 2 1 3 5"
      },
      {
        "input": "1\n9",
        "expectedOutput": "9"
      },
      {
        "input": "5\n6 3 8 1 4",
        "expectedOutput": "1 3 4 6 8"
      }
    ]
  },
  {
    "id": "k-sum-paths-in-binary-tree",
    "hints": ["Paths can start anywhere, so you need to consider all downward paths, not just root-to-leaf.","Use prefix sums along each root-to-node path: at each node, the number of valid paths ending here equals the count of earlier prefix sums equal to (current sum - k)."],
    "returns": "int",
    "title": "K-Sum Paths in a Binary Tree",
    "difficulty": "medium",
    "topic": "trees",
    "companies": [
      "Accolite",
      "Amazon",
      "Goldman Sachs"
    ],
    "description": "Given the root of a binary tree and an integer k, return the number of downward paths (starting at any node and going only from parent to child) whose node values sum to k.",
    "examples": [
      {
        "input": "11\n10 5 -3 3 2 null 11 3 -2 null 1\n8",
        "output": "3",
        "explanation": "Three downward paths sum to 8: 5 -> 3, 5 -> 2 -> 1 and -3 -> 11, so the count is 3."
      },
      {
        "input": "3\n1 2 3\n3",
        "output": "2",
        "explanation": "Two downward paths sum to 3: 1 -> 2 and 3 alone, so the count is 2."
      },
      {
        "input": "1\n1\n1",
        "output": "1",
        "explanation": "The single node itself forms a path summing to 1, so the count is 1."
      }
    ],
    "constraints": [
      "The tree has 1 to 2000 nodes.",
      "-1000 <= Node.val <= 1000",
      "-10^9 <= k <= 10^9"
    ],
    "io": "tree-k",
    "testCases": [
      {
        "input": "11\n10 5 -3 3 2 null 11 3 -2 null 1\n8",
        "expectedOutput": "3"
      },
      {
        "input": "3\n1 2 3\n3",
        "expectedOutput": "2"
      },
      {
        "input": "1\n1\n1",
        "expectedOutput": "1"
      },
      {
        "input": "13\n5 4 8 11 null 13 4 7 2 null null 5 1\n22",
        "expectedOutput": "3"
      },
      {
        "input": "2\n1 2\n2",
        "expectedOutput": "1"
      },
      {
        "input": "3\n1 -1 1\n0",
        "expectedOutput": "1"
      },
      {
        "input": "3\n0 0 0\n0",
        "expectedOutput": "5"
      },
      {
        "input": "2\n3 3\n6",
        "expectedOutput": "1"
      },
      {
        "input": "1\n1\n0",
        "expectedOutput": "0"
      },
      {
        "input": "3\n2 1 3\n3",
        "expectedOutput": "2"
      },
      {
        "input": "1\n5\n5",
        "expectedOutput": "1"
      },
      {
        "input": "5\n1 2 3 4 5\n3",
        "expectedOutput": "2"
      }
    ]
  }
,
{
    "id": "diagonal-traversal-of-matrix",
    "hints": ["Cells on the same diagonal share an equal (row + col) sum — use that as a grouping key.","Walk the diagonals in order of increasing (i + j), alternating direction within each diagonal."],
    "returns": "intArr",
    "title": "Diagonal Traversal of Matrix",
    "difficulty": "medium",
    "topic": "2d-arrays",
    "companies": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "description": "Given an m x n matrix, return all elements of the matrix in diagonal order (zigzag): diagonals alternate between going up-right and down-left, starting with the top-left element. The first line of input contains R C, followed by R lines of the matrix.",
    "examples": [
      {
        "input": "3 3\n1 2 3\n4 5 6\n7 8 9",
        "output": "1 2 4 7 5 3 6 8 9",
        "explanation": "Diagonals: [1], [2,4], [3,5,7], [6,8], [9] traversed alternately up-right and down-left."
      },
      {
        "input": "2 2\n1 2\n3 4",
        "output": "1 2 3 4",
        "explanation": "Order is 1, then 2,3, then 4."
      },
      {
        "input": "1 1\n1",
        "output": "1",
        "explanation": "A single element matrix returns that element."
      }
    ],
    "constraints": [
      "1 <= R, C <= 100",
      "-10^4 <= matrix[i][j] <= 10^4"
    ],
    "io": "matrix",
    "testCases": [
      {
        "input": "3 3\n1 2 3\n4 5 6\n7 8 9",
        "expectedOutput": "1 2 4 7 5 3 6 8 9"
      },
      {
        "input": "2 2\n1 2\n3 4",
        "expectedOutput": "1 2 3 4"
      },
      {
        "input": "1 1\n1",
        "expectedOutput": "1"
      },
      {
        "input": "3 4\n1 2 3 4\n5 6 7 8\n9 10 11 12",
        "expectedOutput": "1 2 5 9 6 3 4 7 10 11 8 12"
      },
      {
        "input": "3 1\n1\n2\n3",
        "expectedOutput": "1 2 3"
      },
      {
        "input": "1 5\n1 2 3 4 5",
        "expectedOutput": "1 2 3 4 5"
      },
      {
        "input": "1 3\n6 9 7",
        "expectedOutput": "6 9 7"
      },
      {
        "input": "3 2\n2 3\n4 5\n6 7",
        "expectedOutput": "2 3 4 6 5 7"
      },
      {
        "input": "2 3\n1 2 3\n4 5 6",
        "expectedOutput": "1 2 4 5 3 6"
      },
      {
        "input": "2 3\n1 0 1\n0 1 0",
        "expectedOutput": "1 0 0 1 1 0"
      },
      {
        "input": "3 2\n3 1\n2 4\n5 6",
        "expectedOutput": "3 1 2 5 4 6"
      },
      {
        "input": "3 4\n9 8 7 6\n5 4 3 2\n1 0 -1 -2",
        "expectedOutput": "9 8 5 1 4 7 6 3 0 -1 2 -2"
      }
    ]
  },
  {
    "id": "set-matrix-zeroes",
    "hints": ["The first row and first column can double as markers recording which rows and columns need zeroing.","Flag zero rows and columns into row 0 and column 0 (remembering whether they need zeroing themselves), then apply in a second pass."],
    "returns": "intMat",
    "title": "Set Matrix Zeroes",
    "difficulty": "medium",
    "topic": "2d-arrays",
    "companies": [
      "Amazon",
      "Microsoft",
      "Google",
      "Meta"
    ],
    "description": "Given an m x n integer matrix, if an element is 0, set its entire row and column to 0. Return the modified matrix. The first line of input contains R C, followed by R lines of the matrix.",
    "examples": [
      {
        "input": "3 3\n1 1 1\n1 0 1\n1 1 1",
        "output": "1 0 1\n0 0 0\n1 0 1",
        "explanation": "The 0 at (1,1) zeroes out row 1 and column 1."
      },
      {
        "input": "3 4\n0 1 2 0\n3 4 5 2\n1 3 1 5",
        "output": "0 0 0 0\n0 4 5 0\n0 3 1 0",
        "explanation": "Zeroes at (0,0) and (0,3) zero out row 0 and columns 0 and 3."
      },
      {
        "input": "1 1\n1",
        "output": "1",
        "explanation": "No zeroes, matrix is unchanged."
      }
    ],
    "constraints": [
      "1 <= R, C <= 200",
      "-2^31 <= matrix[i][j] <= 2^31 - 1"
    ],
    "io": "matrix",
    "testCases": [
      {
        "input": "3 3\n1 1 1\n1 0 1\n1 1 1",
        "expectedOutput": "1 0 1\n0 0 0\n1 0 1"
      },
      {
        "input": "3 4\n0 1 2 0\n3 4 5 2\n1 3 1 5",
        "expectedOutput": "0 0 0 0\n0 4 5 0\n0 3 1 0"
      },
      {
        "input": "1 1\n1",
        "expectedOutput": "1"
      },
      {
        "input": "2 2\n0 0\n0 0",
        "expectedOutput": "0 0\n0 0"
      },
      {
        "input": "1 4\n1 2 3 4",
        "expectedOutput": "1 2 3 4"
      },
      {
        "input": "3 1\n5\n0\n7",
        "expectedOutput": "0\n0\n0"
      },
      {
        "input": "2 2\n1 2\n3 4",
        "expectedOutput": "1 2\n3 4"
      },
      {
        "input": "3 3\n1 0 3\n4 5 6\n7 8 0",
        "expectedOutput": "0 0 0\n4 0 0\n0 0 0"
      },
      {
        "input": "4 3\n1 2 3\n4 0 6\n7 8 9\n0 1 2",
        "expectedOutput": "0 0 3\n0 0 0\n0 0 9\n0 0 0"
      },
      {
        "input": "1 1\n0",
        "expectedOutput": "0"
      },
      {
        "input": "2 2\n1 1\n1 0",
        "expectedOutput": "1 0\n0 0"
      },
      {
        "input": "2 3\n2 1 0\n1 2 1",
        "expectedOutput": "0 0 0\n1 2 0"
      }
    ]
  },
  {
    "id": "spiral-matrix",
    "hints": ["Peel the matrix layer by layer — every layer is just four straight edge traversals.","Maintain top, bottom, left and right boundaries, walk each edge in turn, then shrink the boundaries and repeat."],
    "returns": "intArr",
    "title": "Spiral Matrix",
    "difficulty": "medium",
    "topic": "2d-arrays",
    "companies": [
      "Amazon",
      "Google",
      "Microsoft",
      "Meta"
    ],
    "description": "Given an m x n matrix, return all elements of the matrix in spiral order, starting at the top-left and going clockwise inward. The first line of input contains R C, followed by R lines of the matrix.",
    "examples": [
      {
        "input": "3 3\n1 2 3\n4 5 6\n7 8 9",
        "output": "1 2 3 6 9 8 7 4 5",
        "explanation": "Outer ring 1 2 3 6 9 8 7 4, then the center 5."
      },
      {
        "input": "3 4\n1 2 3 4\n5 6 7 8\n9 10 11 12",
        "output": "1 2 3 4 8 12 11 10 9 5 6 7",
        "explanation": "Top row, right column, bottom row reversed, left column up, then 6 7."
      },
      {
        "input": "1 1\n1",
        "output": "1",
        "explanation": "A single element matrix returns that element."
      }
    ],
    "constraints": [
      "1 <= R, C <= 100",
      "-10^4 <= matrix[i][j] <= 10^4"
    ],
    "io": "matrix",
    "testCases": [
      {
        "input": "3 3\n1 2 3\n4 5 6\n7 8 9",
        "expectedOutput": "1 2 3 6 9 8 7 4 5"
      },
      {
        "input": "3 4\n1 2 3 4\n5 6 7 8\n9 10 11 12",
        "expectedOutput": "1 2 3 4 8 12 11 10 9 5 6 7"
      },
      {
        "input": "1 1\n1",
        "expectedOutput": "1"
      },
      {
        "input": "3 5\n1 2 3 4 5\n6 7 8 9 10\n11 12 13 14 15",
        "expectedOutput": "1 2 3 4 5 10 15 14 13 12 11 6 7 8 9"
      },
      {
        "input": "4 1\n1\n2\n3\n4",
        "expectedOutput": "1 2 3 4"
      },
      {
        "input": "1 4\n1 2 3 4",
        "expectedOutput": "1 2 3 4"
      },
      {
        "input": "3 2\n1 2\n3 4\n5 6",
        "expectedOutput": "1 2 4 6 5 3"
      },
      {
        "input": "2 3\n7 9 6\n1 2 3",
        "expectedOutput": "7 9 6 3 2 1"
      },
      {
        "input": "4 3\n1 2 3\n4 5 6\n7 8 9\n10 11 12",
        "expectedOutput": "1 2 3 6 9 12 11 10 7 4 5 8"
      },
      {
        "input": "1 1\n5",
        "expectedOutput": "5"
      },
      {
        "input": "2 2\n1 2\n3 4",
        "expectedOutput": "1 2 4 3"
      },
      {
        "input": "3 2\n-1 -2\n-3 -4\n-5 -6",
        "expectedOutput": "-1 -2 -4 -6 -5 -3"
      }
    ]
  },
  {
    "id": "rotate-image",
    "hints": ["A 90-degree rotation decomposes into two reflections: transpose the matrix, then reverse each row.","Swap elements across the main diagonal first, then reverse every row — all in place."],
    "returns": "intMat",
    "title": "Rotate Image",
    "difficulty": "medium",
    "topic": "2d-arrays",
    "companies": [
      "Amazon",
      "Microsoft",
      "Google",
      "Apple"
    ],
    "description": "Given an n x n 2D matrix, rotate it by 90 degrees clockwise and return the rotated matrix. The first line of input contains R C (R equals C), followed by R lines of the matrix.",
    "examples": [
      {
        "input": "3 3\n1 2 3\n4 5 6\n7 8 9",
        "output": "7 4 1\n8 5 2\n9 6 3",
        "explanation": "Each element moves to its 90-degree clockwise position."
      },
      {
        "input": "4 4\n5 1 9 11\n2 4 8 10\n13 3 6 7\n15 14 12 16",
        "output": "15 13 2 5\n14 3 4 1\n12 6 8 9\n16 7 10 11",
        "explanation": "The 4x4 matrix is rotated clockwise in place."
      },
      {
        "input": "1 1\n1",
        "output": "1",
        "explanation": "A 1x1 matrix is unchanged."
      }
    ],
    "constraints": [
      "1 <= n <= 100",
      "-10^4 <= matrix[i][j] <= 10^4"
    ],
    "io": "matrix",
    "testCases": [
      {
        "input": "3 3\n1 2 3\n4 5 6\n7 8 9",
        "expectedOutput": "7 4 1\n8 5 2\n9 6 3"
      },
      {
        "input": "4 4\n5 1 9 11\n2 4 8 10\n13 3 6 7\n15 14 12 16",
        "expectedOutput": "15 13 2 5\n14 3 4 1\n12 6 8 9\n16 7 10 11"
      },
      {
        "input": "1 1\n1",
        "expectedOutput": "1"
      },
      {
        "input": "2 2\n1 2\n3 4",
        "expectedOutput": "3 1\n4 2"
      },
      {
        "input": "2 2\n1 2\n3 4",
        "expectedOutput": "3 1\n4 2"
      },
      {
        "input": "3 3\n1 2 3\n4 5 6\n7 8 9",
        "expectedOutput": "7 4 1\n8 5 2\n9 6 3"
      },
      {
        "input": "1 1\n10",
        "expectedOutput": "10"
      },
      {
        "input": "4 4\n1 2 3 4\n5 6 7 8\n9 10 11 12\n13 14 15 16",
        "expectedOutput": "13 9 5 1\n14 10 6 2\n15 11 7 3\n16 12 8 4"
      },
      {
        "input": "2 2\n2 1\n4 3",
        "expectedOutput": "4 2\n3 1"
      },
      {
        "input": "2 2\n7 8\n9 10",
        "expectedOutput": "9 7\n10 8"
      },
      {
        "input": "3 3\n1 2 3\n4 5 6\n7 8 9",
        "expectedOutput": "7 4 1\n8 5 2\n9 6 3"
      },
      {
        "input": "2 2\n0 1\n1 0",
        "expectedOutput": "1 0\n0 1"
      }
    ]
  },
  {
    "id": "word-search",
    "hints": ["From each cell matching the first letter, explore all four directions depth-first while marking visited cells.","Backtrack through the grid matching characters in order, temporarily marking cells visited and unmarking them when retreating."],
    "returns": "bool",
    "title": "Word Search",
    "difficulty": "medium",
    "topic": "2d-arrays",
    "companies": [
      "Amazon",
      "Microsoft",
      "Google",
      "Meta"
    ],
    "description": "Given an m x n board of characters and a word, return true if the word exists in the grid. The word can be constructed from letters of sequentially adjacent cells (up, down, left, right); the same cell may not be used more than once. Input: the first line contains R C followed by R board rows (each a string of C characters); the second line contains the word.",
    "examples": [
      {
        "input": "3 4 ABCE SFCS ADEE\nABCCED",
        "output": "true",
        "explanation": "ABCCED can be traced through adjacent cells."
      },
      {
        "input": "3 4 ABCE SFCS ADEE\nSEE",
        "output": "true",
        "explanation": "SEE exists along the right and bottom edge."
      },
      {
        "input": "3 4 ABCE SFCS ADEE\nABCB",
        "output": "false",
        "explanation": "ABCB cannot be formed without reusing a cell."
      }
    ],
    "constraints": [
      "1 <= R, C <= 6",
      "1 <= word.length <= 15",
      "board and word contain only uppercase English letters"
    ],
    "io": "two-strings",
    "testCases": [
      {
        "input": "3 4 ABCE SFCS ADEE\nABCCED",
        "expectedOutput": "true"
      },
      {
        "input": "3 4 ABCE SFCS ADEE\nSEE",
        "expectedOutput": "true"
      },
      {
        "input": "3 4 ABCE SFCS ADEE\nABCB",
        "expectedOutput": "false"
      },
      {
        "input": "1 1 A\nA",
        "expectedOutput": "true"
      },
      {
        "input": "1 1 A\nB",
        "expectedOutput": "false"
      },
      {
        "input": "2 2 AB CD\nACDB",
        "expectedOutput": "true"
      },
      {
        "input": "2 2 AB CD\nABDC",
        "expectedOutput": "true"
      },
      {
        "input": "3 3 AAA AAA AAA\nAAAAAAAAA",
        "expectedOutput": "true"
      },
      {
        "input": "2 3 XYZ ABC\nZYX",
        "expectedOutput": "true"
      },
      {
        "input": "1 1 P\nP",
        "expectedOutput": "true"
      },
      {
        "input": "3 4 ABCE SFES ADEE\nABCESEEEFS",
        "expectedOutput": "true"
      },
      {
        "input": "3 1 A B C\nABC",
        "expectedOutput": "true"
      }
    ]
  },
  {
    "id": "surrounded-regions",
    "hints": ["Instead of hunting surrounded regions, identify the regions that are definitely safe — anything touching the border.","Flood-fill from every border zero to mark safe cells, then flip each unmarked zero to one."],
    "returns": "intMat",
    "title": "Replace 'O' with 'X' if Surrounded by 'X'",
    "difficulty": "medium",
    "topic": "2d-arrays",
    "companies": [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    "description": "Given a matrix of 0s and 1s where 0 represents 'O' and 1 represents 'X', replace every 0 that is completely surrounded by 1s with 1. A 0 on the border, or connected to a border 0, is not surrounded and stays 0. Return the resulting matrix. The first line of input contains R C, followed by R lines of the matrix.",
    "examples": [
      {
        "input": "4 4\n1 1 1 1\n1 0 0 1\n1 1 0 1\n1 0 1 1",
        "output": "1 1 1 1\n1 1 1 1\n1 1 1 1\n1 0 1 1",
        "explanation": "All interior 0s are surrounded by 1s except the 0 at (3,1), which connects to the border."
      },
      {
        "input": "1 1\n0",
        "output": "0",
        "explanation": "The single 0 is on the border, so it is not flipped."
      },
      {
        "input": "2 2\n1 0\n0 1",
        "output": "1 0\n0 1",
        "explanation": "Both 0s touch the border and stay 0."
      }
    ],
    "constraints": [
      "1 <= R, C <= 200",
      "matrix[i][j] is 0 or 1"
    ],
    "io": "matrix",
    "testCases": [
      {
        "input": "4 4\n1 1 1 1\n1 0 0 1\n1 1 0 1\n1 0 1 1",
        "expectedOutput": "1 1 1 1\n1 1 1 1\n1 1 1 1\n1 0 1 1"
      },
      {
        "input": "1 1\n0",
        "expectedOutput": "0"
      },
      {
        "input": "2 2\n1 0\n0 1",
        "expectedOutput": "1 0\n0 1"
      },
      {
        "input": "3 3\n1 1 1\n1 1 1\n1 1 1",
        "expectedOutput": "1 1 1\n1 1 1\n1 1 1"
      },
      {
        "input": "2 3\n0 0 0\n0 0 0",
        "expectedOutput": "0 0 0\n0 0 0"
      },
      {
        "input": "2 4\n1 0 1 0\n0 1 0 1",
        "expectedOutput": "1 0 1 0\n0 1 0 1"
      },
      {
        "input": "4 4\n0 1 1 0\n1 0 0 1\n1 0 0 1\n0 1 1 0",
        "expectedOutput": "0 1 1 0\n1 1 1 1\n1 1 1 1\n0 1 1 0"
      },
      {
        "input": "1 1\n1",
        "expectedOutput": "1"
      },
      {
        "input": "3 2\n0 1\n1 1\n1 0",
        "expectedOutput": "0 1\n1 1\n1 0"
      },
      {
        "input": "4 5\n1 1 0 1 1\n1 0 0 0 1\n1 0 1 0 1\n1 1 1 1 1",
        "expectedOutput": "1 1 0 1 1\n1 0 0 0 1\n1 0 1 0 1\n1 1 1 1 1"
      },
      {
        "input": "2 2\n0 0\n0 0",
        "expectedOutput": "0 0\n0 0"
      },
      {
        "input": "3 3\n1 0 1\n0 0 0\n1 0 1",
        "expectedOutput": "1 0 1\n0 0 0\n1 0 1"
      }
    ]
  },
  {
    "id": "common-element-in-all-rows",
    "hints": ["Every row is sorted, so binary search within rows is possible — but a coordinated pointer sweep is more efficient.","Keep one pointer per row and repeatedly advance the pointers sitting below the current maximum until all agree or a row runs out."],
    "returns": "int",
    "title": "Common Element in All Rows of a Row-Wise Sorted Matrix",
    "difficulty": "medium",
    "topic": "2d-arrays",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Given an R x C matrix where each row is sorted, find the smallest element that appears in every row. If no such element exists, return -1. The first line of input contains R C, followed by R lines of the matrix.",
    "examples": [
      {
        "input": "4 5\n1 2 3 4 5\n2 4 5 8 10\n3 5 7 9 11\n1 3 5 7 9",
        "output": "5",
        "explanation": "5 appears in all four rows."
      },
      {
        "input": "2 2\n1 2\n3 4",
        "output": "-1",
        "explanation": "No element is present in both rows, so return -1."
      },
      {
        "input": "2 3\n7 7 7\n7 7 7",
        "output": "7",
        "explanation": "7 appears in every row."
      }
    ],
    "constraints": [
      "1 <= R, C <= 100",
      "-10^4 <= matrix[i][j] <= 10^4",
      "Each row is sorted in non-decreasing order"
    ],
    "io": "matrix",
    "testCases": [
      {
        "input": "4 5\n1 2 3 4 5\n2 4 5 8 10\n3 5 7 9 11\n1 3 5 7 9",
        "expectedOutput": "5"
      },
      {
        "input": "2 2\n1 2\n3 4",
        "expectedOutput": "-1"
      },
      {
        "input": "2 3\n7 7 7\n7 7 7",
        "expectedOutput": "7"
      },
      {
        "input": "1 1\n5",
        "expectedOutput": "5"
      },
      {
        "input": "4 3\n1 2 3\n4 5 6\n7 8 9\n1 5 9",
        "expectedOutput": "-1"
      },
      {
        "input": "3 2\n2 4\n4 8\n8 16",
        "expectedOutput": "-1"
      },
      {
        "input": "2 3\n1 3 5\n2 4 6",
        "expectedOutput": "-1"
      },
      {
        "input": "3 3\n9 8 7\n6 5 4\n3 2 1",
        "expectedOutput": "-1"
      },
      {
        "input": "3 3\n1 1 2\n1 2 3\n2 3 4",
        "expectedOutput": "2"
      },
      {
        "input": "1 4\n4 4 4 4",
        "expectedOutput": "4"
      },
      {
        "input": "2 4\n1 2 3 4\n1 2 3 4",
        "expectedOutput": "1"
      },
      {
        "input": "3 2\n10 20\n20 30\n10 30",
        "expectedOutput": "-1"
      }
    ]
  },
  {
    "id": "alternating-rectangles-of-o-and-x",
    "hints": ["Each cell's value depends only on its distance from the nearest border, with the outermost ring as layer zero.","Compute min(i, j, n-1-i, n-1-j) per cell: even layers become X, odd layers become O."],
    "returns": "intMat",
    "title": "Matrix with Alternating Rectangles of O and X",
    "difficulty": "easy",
    "topic": "2d-arrays",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Given an integer n, create an n x n matrix filled with alternating concentric rectangles: the outermost rectangle is 1 ('X'), the next is 0 ('O'), then 1 again, and so on. Return the matrix. Input is a single integer n.",
    "examples": [
      {
        "input": "4",
        "output": "1 1 1 1\n1 0 0 1\n1 0 0 1\n1 1 1 1",
        "explanation": "Outer 4x4 ring of 1s, inner 2x2 block of 0s."
      },
      {
        "input": "5",
        "output": "1 1 1 1 1\n1 0 0 0 1\n1 0 1 0 1\n1 0 0 0 1\n1 1 1 1 1",
        "explanation": "Outer ring of 1s, middle ring of 0s, center cell 1."
      },
      {
        "input": "1",
        "output": "1",
        "explanation": "A single cell is 1."
      }
    ],
    "constraints": [
      "1 <= n <= 50"
    ],
    "io": "int",
    "testCases": [
      {
        "input": "4",
        "expectedOutput": "1 1 1 1\n1 0 0 1\n1 0 0 1\n1 1 1 1"
      },
      {
        "input": "5",
        "expectedOutput": "1 1 1 1 1\n1 0 0 0 1\n1 0 1 0 1\n1 0 0 0 1\n1 1 1 1 1"
      },
      {
        "input": "1",
        "expectedOutput": "1"
      },
      {
        "input": "2",
        "expectedOutput": "1 1\n1 1"
      },
      {
        "input": "3",
        "expectedOutput": "1 1 1\n1 0 1\n1 1 1"
      },
      {
        "input": "6",
        "expectedOutput": "1 1 1 1 1 1\n1 0 0 0 0 1\n1 0 1 1 0 1\n1 0 1 1 0 1\n1 0 0 0 0 1\n1 1 1 1 1 1"
      },
      {
        "input": "7",
        "expectedOutput": "1 1 1 1 1 1 1\n1 0 0 0 0 0 1\n1 0 1 1 1 0 1\n1 0 1 0 1 0 1\n1 0 1 1 1 0 1\n1 0 0 0 0 0 1\n1 1 1 1 1 1 1"
      },
      {
        "input": "8",
        "expectedOutput": "1 1 1 1 1 1 1 1\n1 0 0 0 0 0 0 1\n1 0 1 1 1 1 0 1\n1 0 1 0 0 1 0 1\n1 0 1 0 0 1 0 1\n1 0 1 1 1 1 0 1\n1 0 0 0 0 0 0 1\n1 1 1 1 1 1 1 1"
      },
      {
        "input": "9",
        "expectedOutput": "1 1 1 1 1 1 1 1 1\n1 0 0 0 0 0 0 0 1\n1 0 1 1 1 1 1 0 1\n1 0 1 0 0 0 1 0 1\n1 0 1 0 1 0 1 0 1\n1 0 1 0 0 0 1 0 1\n1 0 1 1 1 1 1 0 1\n1 0 0 0 0 0 0 0 1\n1 1 1 1 1 1 1 1 1"
      },
      {
        "input": "10",
        "expectedOutput": "1 1 1 1 1 1 1 1 1 1\n1 0 0 0 0 0 0 0 0 1\n1 0 1 1 1 1 1 1 0 1\n1 0 1 0 0 0 0 1 0 1\n1 0 1 0 1 1 0 1 0 1\n1 0 1 0 1 1 0 1 0 1\n1 0 1 0 0 0 0 1 0 1\n1 0 1 1 1 1 1 1 0 1\n1 0 0 0 0 0 0 0 0 1\n1 1 1 1 1 1 1 1 1 1"
      },
      {
        "input": "11",
        "expectedOutput": "1 1 1 1 1 1 1 1 1 1 1\n1 0 0 0 0 0 0 0 0 0 1\n1 0 1 1 1 1 1 1 1 0 1\n1 0 1 0 0 0 0 0 1 0 1\n1 0 1 0 1 1 1 0 1 0 1\n1 0 1 0 1 0 1 0 1 0 1\n1 0 1 0 1 1 1 0 1 0 1\n1 0 1 0 0 0 0 0 1 0 1\n1 0 1 1 1 1 1 1 1 0 1\n1 0 0 0 0 0 0 0 0 0 1\n1 1 1 1 1 1 1 1 1 1 1"
      },
      {
        "input": "12",
        "expectedOutput": "1 1 1 1 1 1 1 1 1 1 1 1\n1 0 0 0 0 0 0 0 0 0 0 1\n1 0 1 1 1 1 1 1 1 1 0 1\n1 0 1 0 0 0 0 0 0 1 0 1\n1 0 1 0 1 1 1 1 0 1 0 1\n1 0 1 0 1 0 0 1 0 1 0 1\n1 0 1 0 1 0 0 1 0 1 0 1\n1 0 1 0 1 1 1 1 0 1 0 1\n1 0 1 0 0 0 0 0 0 1 0 1\n1 0 1 1 1 1 1 1 1 1 0 1\n1 0 0 0 0 0 0 0 0 0 0 1\n1 1 1 1 1 1 1 1 1 1 1 1"
      }
    ]
  },
  {
    "id": "maximal-rectangle",
    "hints": ["Treat each row as the base of a histogram whose bar heights count consecutive ones above it — reducing to largest-rectangle-in-histogram.","Update histogram heights row by row and run the monotonic-stack solution per row, keeping the best area."],
    "returns": "int",
    "title": "Maximum Size Rectangle of All 1s",
    "difficulty": "hard",
    "topic": "2d-arrays",
    "companies": [
      "Amazon",
      "Google",
      "Microsoft",
      "Meta"
    ],
    "description": "Given a binary matrix of 0s and 1s, find the area of the largest rectangle containing only 1s and return the area. The first line of input contains R C, followed by R lines of the matrix.",
    "examples": [
      {
        "input": "4 5\n1 0 1 0 0\n1 0 1 1 1\n1 1 1 1 1\n1 0 0 1 0",
        "output": "6",
        "explanation": "The largest all-1s rectangle has area 6."
      },
      {
        "input": "1 1\n0",
        "output": "0",
        "explanation": "No 1s in the matrix, so the area is 0."
      },
      {
        "input": "1 1\n1",
        "output": "1",
        "explanation": "The single cell is 1, so the area is 1."
      }
    ],
    "constraints": [
      "1 <= R, C <= 200",
      "matrix[i][j] is 0 or 1"
    ],
    "io": "matrix",
    "testCases": [
      {
        "input": "4 5\n1 0 1 0 0\n1 0 1 1 1\n1 1 1 1 1\n1 0 0 1 0",
        "expectedOutput": "6"
      },
      {
        "input": "1 1\n0",
        "expectedOutput": "0"
      },
      {
        "input": "1 1\n1",
        "expectedOutput": "1"
      },
      {
        "input": "2 2\n1 1\n1 1",
        "expectedOutput": "4"
      },
      {
        "input": "2 5\n1 0 1 1 1\n1 1 1 1 0",
        "expectedOutput": "4"
      },
      {
        "input": "4 4\n0 1 1 0\n1 1 1 1\n1 1 1 1\n1 1 0 0",
        "expectedOutput": "8"
      },
      {
        "input": "1 5\n1 1 1 1 1",
        "expectedOutput": "5"
      },
      {
        "input": "5 1\n1\n1\n1\n0\n1",
        "expectedOutput": "3"
      },
      {
        "input": "2 2\n0 0\n0 0",
        "expectedOutput": "0"
      },
      {
        "input": "3 3\n1 0 0\n1 1 1\n0 1 1",
        "expectedOutput": "4"
      },
      {
        "input": "3 4\n1 1 0 1\n1 1 1 1\n0 1 1 1",
        "expectedOutput": "6"
      },
      {
        "input": "3 4\n1 0 1 0\n1 1 1 0\n0 1 1 1",
        "expectedOutput": "4"
      }
    ]
  },
  {
    "id": "two-non-repeating-elements",
    "hints": ["XORing everything gives the XOR of the two unique numbers. How can one differing bit split the array into two groups?","Find any set bit in the total XOR, partition the numbers by that bit, and XOR each group separately to recover the two answers."],
    "returns": "intArr",
    "title": "Two Non-Repeating Elements in an Array of Repeating Elements",
    "difficulty": "medium",
    "topic": "bit-manipulation",
    "companies": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "description": "Given an array where every element appears exactly twice except two elements that appear exactly once, find those two elements. Return them sorted in ascending order, space-separated. The first line of input is n, the second line contains the n array elements.",
    "examples": [
      {
        "input": "8\n2 3 7 9 11 2 3 11",
        "output": "7 9",
        "explanation": "Every element repeats twice except 7 and 9."
      },
      {
        "input": "6\n1 1 2 3 3 4",
        "output": "2 4",
        "explanation": "The non-repeating elements are 2 and 4."
      },
      {
        "input": "6\n5 5 8 8 1 9",
        "output": "1 9",
        "explanation": "The non-repeating elements are 1 and 9."
      }
    ],
    "constraints": [
      "2 <= n <= 10^5",
      "Exactly two elements appear once, all others appear twice"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "8\n2 3 7 9 11 2 3 11",
        "expectedOutput": "7 9"
      },
      {
        "input": "6\n1 1 2 3 3 4",
        "expectedOutput": "2 4"
      },
      {
        "input": "6\n5 5 8 8 1 9",
        "expectedOutput": "1 9"
      },
      {
        "input": "4\n0 0 1 2",
        "expectedOutput": "1 2"
      },
      {
        "input": "6\n-1 -1 5 6 5 6",
        "expectedOutput": "0 0"
      },
      {
        "input": "6\n10 20 10 30 20 40",
        "expectedOutput": "30 40"
      },
      {
        "input": "6\n7 7 3 3 9 1",
        "expectedOutput": "1 9"
      },
      {
        "input": "4\n100 1 100 2",
        "expectedOutput": "1 2"
      },
      {
        "input": "6\n4 4 8 8 12 6",
        "expectedOutput": "6 12"
      },
      {
        "input": "6\n15 15 21 21 13 19",
        "expectedOutput": "13 19"
      },
      {
        "input": "6\n2 2 2 2 5 9",
        "expectedOutput": "5 9"
      },
      {
        "input": "6\n11 22 11 33 22 44",
        "expectedOutput": "33 44"
      }
    ]
  },
  {
    "id": "position-of-only-set-bit",
    "hints": ["First verify the number has exactly one set bit; powers of two have a well-known bit test.","Check n is positive and (n & (n-1)) equals 0, then count the bit position by shifting right until the value becomes 0."],
    "returns": "int",
    "title": "Position of the Only Set Bit",
    "difficulty": "easy",
    "topic": "bit-manipulation",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Given an integer n, find the position of the only set bit in its binary representation, counting from 1 at the least significant bit. If n is 0 or has more than one set bit, return -1. Input is a single integer n.",
    "examples": [
      {
        "input": "8",
        "output": "4",
        "explanation": "8 is 1000 in binary; the only set bit is at position 4."
      },
      {
        "input": "1",
        "output": "1",
        "explanation": "1 is 1 in binary; the set bit is at position 1."
      },
      {
        "input": "7",
        "output": "-1",
        "explanation": "7 is 111 in binary with three set bits, so return -1."
      }
    ],
    "constraints": [
      "0 <= n <= 2^31 - 1"
    ],
    "io": "int",
    "testCases": [
      {
        "input": "8",
        "expectedOutput": "4"
      },
      {
        "input": "1",
        "expectedOutput": "1"
      },
      {
        "input": "7",
        "expectedOutput": "-1"
      },
      {
        "input": "16",
        "expectedOutput": "5"
      },
      {
        "input": "0",
        "expectedOutput": "-1"
      },
      {
        "input": "32",
        "expectedOutput": "6"
      },
      {
        "input": "10",
        "expectedOutput": "-1"
      },
      {
        "input": "64",
        "expectedOutput": "7"
      },
      {
        "input": "3",
        "expectedOutput": "-1"
      },
      {
        "input": "128",
        "expectedOutput": "8"
      },
      {
        "input": "1024",
        "expectedOutput": "11"
      },
      {
        "input": "6",
        "expectedOutput": "-1"
      }
    ]
  },
  {
    "id": "copy-set-bits-in-range",
    "hints": ["You need a mask covering exactly bits l through r, then take only the set bits of y inside that mask.","Build the range mask, compute (y & mask), and OR it into x."],
    "returns": "int",
    "title": "Copy Set Bits in a Range",
    "difficulty": "easy",
    "topic": "bit-manipulation",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Given integers x and y and a range [l, r] (1-indexed bit positions from the least significant bit), copy every set bit of y within that range into x, leaving the other bits of x unchanged. Return the resulting integer. The first line of input is 4; the second line contains x y l r.",
    "examples": [
      {
        "input": "4\n10 13 2 3",
        "output": "14",
        "explanation": "y = 13 (1101); bits 2..3 of y are 01; setting them in x = 10 (1010) gives 14 (1110)."
      },
      {
        "input": "4\n10 13 1 32",
        "output": "15",
        "explanation": "Copying all bits of y into x gives 10 | 13 = 15."
      },
      {
        "input": "4\n8 7 1 2",
        "output": "11",
        "explanation": "y = 7 (0111); bits 1..2 are both set; x = 8 (1000) becomes 11 (1011)."
      }
    ],
    "constraints": [
      "0 <= x, y <= 10^9",
      "1 <= l <= r <= 31"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "4\n10 13 2 3",
        "expectedOutput": "14"
      },
      {
        "input": "4\n10 13 1 32",
        "expectedOutput": "15"
      },
      {
        "input": "4\n8 7 1 2",
        "expectedOutput": "11"
      },
      {
        "input": "4\n0 15 1 4",
        "expectedOutput": "15"
      },
      {
        "input": "4\n255 0 1 8",
        "expectedOutput": "255"
      },
      {
        "input": "4\n1 2 1 1",
        "expectedOutput": "1"
      },
      {
        "input": "4\n16 8 4 4",
        "expectedOutput": "24"
      },
      {
        "input": "4\n100 200 3 6",
        "expectedOutput": "108"
      },
      {
        "input": "4\n7 7 1 3",
        "expectedOutput": "7"
      },
      {
        "input": "4\n1024 2048 11 12",
        "expectedOutput": "3072"
      },
      {
        "input": "4\n5 10 2 2",
        "expectedOutput": "7"
      },
      {
        "input": "4\n31 63 5 6",
        "expectedOutput": "63"
      }
    ]
  },
  {
    "id": "square-without-multiply",
    "hints": ["Every integer is a sum of powers of two, and multiplying by a power of two is just a left shift.","Decompose n into its set bits; for each set bit at position i add (n << i) to the running total."],
    "returns": "int",
    "title": "Square of a Number Without *, / or pow()",
    "difficulty": "easy",
    "topic": "bit-manipulation",
    "companies": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "description": "Given an integer n, compute n squared without using the multiplication, division, or power operators (use bit shifts and addition instead). Input is a single integer n.",
    "examples": [
      {
        "input": "5",
        "output": "25",
        "explanation": "5 squared is 25."
      },
      {
        "input": "0",
        "output": "0",
        "explanation": "0 squared is 0."
      },
      {
        "input": "-7",
        "output": "49",
        "explanation": "(-7) squared is 49."
      }
    ],
    "constraints": [
      "-10^4 <= n <= 10^4"
    ],
    "io": "int",
    "testCases": [
      {
        "input": "5",
        "expectedOutput": "25"
      },
      {
        "input": "0",
        "expectedOutput": "0"
      },
      {
        "input": "-7",
        "expectedOutput": "49"
      },
      {
        "input": "12",
        "expectedOutput": "144"
      },
      {
        "input": "1",
        "expectedOutput": "1"
      },
      {
        "input": "-1",
        "expectedOutput": "1"
      },
      {
        "input": "100",
        "expectedOutput": "10000"
      },
      {
        "input": "9",
        "expectedOutput": "81"
      },
      {
        "input": "-15",
        "expectedOutput": "225"
      },
      {
        "input": "25",
        "expectedOutput": "625"
      },
      {
        "input": "2",
        "expectedOutput": "4"
      },
      {
        "input": "50",
        "expectedOutput": "2500"
      }
    ]
  },
  {
    "id": "divide-two-integers",
    "hints": ["Repeated subtraction is too slow for large quotients; instead subtract the largest shifted multiple of the divisor each step.","Use bit shifts to find the biggest (divisor << k) that fits into the remaining dividend, subtract it, and accumulate 2^k into the answer, handling signs and the overflow edge case."],
    "returns": "int",
    "title": "Divide Two Integers Without *, / or %",
    "difficulty": "medium",
    "topic": "bit-manipulation",
    "companies": [
      "Amazon",
      "Microsoft",
      "Google",
      "Meta"
    ],
    "description": "Given a dividend and a divisor, divide them without using multiplication, division, or the modulo operator (use bit shifts and subtraction instead). Truncate toward zero. Clamp the result to the 32-bit signed range; the overflow case -2^31 / -1 returns 2^31 - 1. The first line of input is 2; the second line contains the dividend and the divisor.",
    "examples": [
      {
        "input": "2\n10 3",
        "output": "3",
        "explanation": "10 / 3 = 3.333, truncated toward zero is 3."
      },
      {
        "input": "2\n7 -3",
        "output": "-2",
        "explanation": "7 / -3 = -2.333, truncated toward zero is -2."
      },
      {
        "input": "2\n-2147483648 -1",
        "output": "2147483647",
        "explanation": "Overflow: -2147483648 / -1 clamps to 2147483647."
      }
    ],
    "constraints": [
      "-2^31 <= dividend <= 2^31 - 1",
      "divisor != 0",
      "-2^31 <= divisor <= 2^31 - 1"
    ],
    "io": "array",
    "testCases": [
      {
        "input": "2\n10 3",
        "expectedOutput": "3"
      },
      {
        "input": "2\n7 -3",
        "expectedOutput": "-2"
      },
      {
        "input": "2\n-2147483648 -1",
        "expectedOutput": "2147483647"
      },
      {
        "input": "2\n0 5",
        "expectedOutput": "0"
      },
      {
        "input": "2\n-15 2",
        "expectedOutput": "-7"
      },
      {
        "input": "2\n1 1",
        "expectedOutput": "1"
      },
      {
        "input": "2\n-1 1",
        "expectedOutput": "-1"
      },
      {
        "input": "2\n2147483647 1",
        "expectedOutput": "2147483647"
      },
      {
        "input": "2\n100 10",
        "expectedOutput": "10"
      },
      {
        "input": "2\n-100 -10",
        "expectedOutput": "10"
      },
      {
        "input": "2\n43 -8",
        "expectedOutput": "-5"
      },
      {
        "input": "2\n5 2",
        "expectedOutput": "2"
      }
    ]
  },
  {
    "id": "power-set",
    "hints": ["Each subset corresponds to a binary mask from 0 to 2^n - 1, where bit i decides whether s[i] is included.","Iterate all masks in increasing order and build each subset by picking characters whose bit is set."],
    "returns": "string",
    "title": "Power Set",
    "difficulty": "medium",
    "topic": "bit-manipulation",
    "companies": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "description": "Given a string s of distinct characters, print every subset of its characters (the power set), one subset per line, in increasing bitmask order (mask 0 to 2^n - 1, where bit i picks s[i]). The first line is the empty subset (a blank line). Input is the string on a single line.",
    "examples": [
      {
        "input": "abc",
        "output": "\na\nb\nab\nc\nac\nbc\nabc",
        "explanation": "All 8 subsets of abc; the first line is the empty subset."
      },
      {
        "input": "ab",
        "output": "\na\nb\nab",
        "explanation": "All 4 subsets of ab; the first line is the empty subset."
      },
      {
        "input": "a",
        "output": "\na",
        "explanation": "Subsets are the empty set and a."
      }
    ],
    "constraints": [
      "1 <= s.length <= 10",
      "s contains distinct lowercase letters"
    ],
    "io": "string",
    "testCases": [
      {
        "input": "abc",
        "expectedOutput": "\na\nb\nab\nc\nac\nbc\nabc"
      },
      {
        "input": "ab",
        "expectedOutput": "\na\nb\nab"
      },
      {
        "input": "a",
        "expectedOutput": "\na"
      },
      {
        "input": "abcd",
        "expectedOutput": "\na\nb\nab\nc\nac\nbc\nabc\nd\nad\nbd\nabd\ncd\nacd\nbcd\nabcd"
      },
      {
        "input": "xy",
        "expectedOutput": "\nx\ny\nxy"
      },
      {
        "input": "pqrs",
        "expectedOutput": "\np\nq\npq\nr\npr\nqr\npqr\ns\nps\nqs\npqs\nrs\nprs\nqrs\npqrs"
      },
      {
        "input": "m",
        "expectedOutput": "\nm"
      },
      {
        "input": "wxyz",
        "expectedOutput": "\nw\nx\nwx\ny\nwy\nxy\nwxy\nz\nwz\nxz\nwxz\nyz\nwyz\nxyz\nwxyz"
      },
      {
        "input": "de",
        "expectedOutput": "\nd\ne\nde"
      },
      {
        "input": "klm",
        "expectedOutput": "\nk\nl\nkl\nm\nkm\nlm\nklm"
      },
      {
        "input": "efg",
        "expectedOutput": "\ne\nf\nef\ng\neg\nfg\nefg"
      },
      {
        "input": "nop",
        "expectedOutput": "\nn\no\nno\np\nnp\nop\nnop"
      }
    ]
  }
,
{
    "id": "permute-two-arrays",
    "hints": ["To maximize the weakest pair, match the smallest elements of one array against the largest of the other.","Sort A ascending and B descending, then verify every paired sum meets K."],
    "returns": "bool",
    "title": "Permute Two Arrays such that Sum of Every Pair is Greater or Equal to K",
    "difficulty": "easy",
    "companies": [
      "Samsung",
      "Amazon"
    ],
    "description": "You are given two arrays A and B, each of size n, and an integer K. Determine whether the arrays can be permuted so that every pair (A[i], B[i]) satisfies A[i] + B[i] >= K. Print true if possible, false otherwise. Input format: first line 2n (total integers), second line 2n integers where the first n form array A and the next n form array B, third line K.",
    "constraints": [
      "1 <= n <= 10^5",
      "-10^9 <= A[i], B[i], K <= 10^9"
    ],
    "io": "array-k",
    "topic": "searching-sorting",
    "examples": [
      {
        "input": "6\n1 2 3 3 2 1\n4",
        "output": "true",
        "explanation": "Sort A ascending to 1 2 3 and B descending to 3 2 1; pairs sum to 4, 4, 4, all >= 4."
      },
      {
        "input": "8\n1 2 2 1 3 3 3 4\n5",
        "output": "false",
        "explanation": "Sorted pairs are (1,4), (1,3), (2,3), (2,3); the pair (1,3) sums to 4, which is < 5."
      },
      {
        "input": "2\n5 5\n10",
        "output": "true",
        "explanation": "The only pair sums to 10, which is >= 10."
      }
    ],
    "testCases": [
      {
        "input": "6\n1 2 3 3 2 1\n4",
        "expectedOutput": "true"
      },
      {
        "input": "8\n1 2 2 1 3 3 3 4\n5",
        "expectedOutput": "false"
      },
      {
        "input": "2\n5 5\n10",
        "expectedOutput": "true"
      },
      {
        "input": "4\n1 1 1 1\n2",
        "expectedOutput": "true"
      },
      {
        "input": "4\n1 1 1 1\n3",
        "expectedOutput": "false"
      },
      {
        "input": "2\n0 0\n1",
        "expectedOutput": "false"
      },
      {
        "input": "6\n2 7 11 4 9 10\n13",
        "expectedOutput": "false"
      },
      {
        "input": "6\n2 7 11 4 9 10\n12",
        "expectedOutput": "true"
      },
      {
        "input": "8\n5 5 5 5 5 5 5 5\n10",
        "expectedOutput": "true"
      },
      {
        "input": "8\n5 5 5 5 5 5 5 5\n11",
        "expectedOutput": "false"
      },
      {
        "input": "4\n-1 5 3 -2\n2",
        "expectedOutput": "true"
      },
      {
        "input": "10\n8 1 6 3 5 9 2 7 4 10\n14",
        "expectedOutput": "false"
      }
    ]
  },
  {
    "id": "counting-sort",
    "hints": ["Knowing each value's frequency lets you write the values back in order directly, without comparisons.","Count occurrences (shifting for negatives), then rebuild the array by repeating each value its counted times."],
    "returns": "intArr",
    "title": "Counting Sort",
    "difficulty": "easy",
    "companies": [
      "Samsung",
      "Morgan Stanley",
      "Snapdeal"
    ],
    "description": "Sort the given array using counting sort and print the sorted array. Input format: first line n, second line n integers (may include negatives).",
    "constraints": [
      "1 <= n <= 10^5",
      "-10^4 <= arr[i] <= 10^4"
    ],
    "io": "array",
    "topic": "searching-sorting",
    "examples": [
      {
        "input": "6\n4 2 2 8 3 3",
        "output": "2 2 3 3 4 8",
        "explanation": "Counting frequencies and expanding them in order gives 2 2 3 3 4 8."
      },
      {
        "input": "5\n5 4 3 2 1",
        "output": "1 2 3 4 5",
        "explanation": "Expanding frequencies gives 1 2 3 4 5."
      },
      {
        "input": "4\n-1 -3 2 0",
        "output": "-3 -1 0 2",
        "explanation": "With an offset for negatives, the sorted order is -3 -1 0 2."
      }
    ],
    "testCases": [
      {
        "input": "6\n4 2 2 8 3 3",
        "expectedOutput": "2 2 3 3 4 8"
      },
      {
        "input": "5\n5 4 3 2 1",
        "expectedOutput": "1 2 3 4 5"
      },
      {
        "input": "4\n-1 -3 2 0",
        "expectedOutput": "-3 -1 0 2"
      },
      {
        "input": "1\n1",
        "expectedOutput": "1"
      },
      {
        "input": "4\n3 3 3 3",
        "expectedOutput": "3 3 3 3"
      },
      {
        "input": "10\n9 8 7 6 5 4 3 2 1 0",
        "expectedOutput": "0 1 2 3 4 5 6 7 8 9"
      },
      {
        "input": "5\n-5 -5 0 5 5",
        "expectedOutput": "-5 -5 0 5 5"
      },
      {
        "input": "1\n100",
        "expectedOutput": "100"
      },
      {
        "input": "2\n2 1",
        "expectedOutput": "1 2"
      },
      {
        "input": "4\n0 0 1 0",
        "expectedOutput": "0 0 0 1"
      },
      {
        "input": "7\n7 7 7 1 1 1 7",
        "expectedOutput": "1 1 1 7 7 7 7"
      },
      {
        "input": "20\n31 -36 -47 44 -15 -19 -22 -33 44 -37 36 44 19 -39 25 4 -46 -47 -39 -23",
        "expectedOutput": "-47 -47 -46 -39 -39 -37 -36 -33 -23 -22 -19 -15 4 19 25 31 36 44 44 44"
      }
    ]
  },
  {
    "id": "common-elements-three-sorted-arrays",
    "hints": ["With all three arrays sorted, always advance the pointer sitting on the smallest value — like a three-way merge.","Use one pointer per array: record the value when all three agree, otherwise move the pointer(s) at the minimum."],
    "returns": "intArr",
    "title": "Find Common Elements in Three Sorted Arrays",
    "difficulty": "easy",
    "companies": [
      "Microsoft",
      "MAQ Software",
      "VMWare"
    ],
    "description": "Given three sorted arrays A, B and C, print their common elements in sorted order without duplicates. If there are none, print nothing. Input format: first line total element count, second line all elements with array A first, then B, then C, third line two integers: size of A and size of B.",
    "constraints": [
      "1 <= size of each array <= 10^5",
      "arrays are sorted in non-decreasing order"
    ],
    "io": "array-two-ints",
    "topic": "searching-sorting",
    "examples": [
      {
        "input": "19\n1 5 10 20 40 80 6 7 20 80 100 3 4 15 20 30 70 80 120\n6 5",
        "output": "20 80",
        "explanation": "The three-pointer scan finds 20 and 80 present in all three arrays."
      },
      {
        "input": "9\n1 2 3 4 5 6 7 8 9\n3 3",
        "output": "",
        "explanation": "No value appears in all three arrays."
      },
      {
        "input": "9\n1 2 2 3 2 2 4 2 5\n4 3",
        "output": "2",
        "explanation": "Only 2 is present in all three arrays."
      }
    ],
    "testCases": [
      {
        "input": "19\n1 5 10 20 40 80 6 7 20 80 100 3 4 15 20 30 70 80 120\n6 5",
        "expectedOutput": "20 80"
      },
      {
        "input": "9\n1 2 3 4 5 6 7 8 9\n3 3",
        "expectedOutput": ""
      },
      {
        "input": "9\n1 2 2 3 2 2 4 2 5\n4 3",
        "expectedOutput": "2"
      },
      {
        "input": "15\n1 2 3 4 5 1 2 3 4 5 1 2 3 4 5\n5 5",
        "expectedOutput": "1 2 3 4 5"
      },
      {
        "input": "3\n1 1 1\n1 1",
        "expectedOutput": "1"
      },
      {
        "input": "3\n1 2 3\n1 1",
        "expectedOutput": ""
      },
      {
        "input": "6\n1 2 2 3 3 4\n2 2",
        "expectedOutput": ""
      },
      {
        "input": "10\n2 4 6 8 1 2 3 4 2 4\n4 4",
        "expectedOutput": "2 4"
      },
      {
        "input": "9\n1 1 1 1 1 1 1 1 1\n3 2",
        "expectedOutput": "1"
      },
      {
        "input": "8\n5 10 15 3 5 9 5 20\n3 3",
        "expectedOutput": "5"
      },
      {
        "input": "13\n1 3 5 7 9 2 4 6 8 10 1 2 3\n5 5",
        "expectedOutput": ""
      },
      {
        "input": "11\n10 20 30 40 15 20 25 30 20 30 35\n4 4",
        "expectedOutput": "20 30"
      }
    ]
  },
  {
    "id": "search-array-adjacent-differ-k",
    "hints": ["If arr[i] is d away from x and neighbors differ by at most k, the target must be at least d/k steps ahead.","Jump forward by max(1, |arr[i] - x| / k) instead of advancing one element at a time."],
    "returns": "int",
    "title": "Searching in an Array where Adjacent Differ by at most K",
    "difficulty": "easy",
    "companies": [
      "TCS",
      "Amazon"
    ],
    "description": "Given an array where adjacent elements differ by at most k, find the index of x using jumps of size |arr[i] - x| / k. Print the index of x or -1 if absent. Input format: first line n, second line n integers, third line k and x.",
    "constraints": [
      "1 <= n <= 10^5",
      "adjacent elements differ by at most k"
    ],
    "io": "array-two-ints",
    "topic": "searching-sorting",
    "examples": [
      {
        "input": "6\n4 5 6 7 8 9\n1 7",
        "output": "3",
        "explanation": "Starting at index 0, jumps of |4-7|/1 land on index 3 where arr[3] = 7."
      },
      {
        "input": "5\n20 40 50 70 70\n20 70",
        "output": "3",
        "explanation": "Jumping by |diff|/20 finds 70 at index 3."
      },
      {
        "input": "4\n1 2 3 4\n1 9",
        "output": "-1",
        "explanation": "x = 9 never appears, so the answer is -1."
      }
    ],
    "testCases": [
      {
        "input": "6\n4 5 6 7 8 9\n1 7",
        "expectedOutput": "3"
      },
      {
        "input": "5\n20 40 50 70 70\n20 70",
        "expectedOutput": "3"
      },
      {
        "input": "4\n1 2 3 4\n1 9",
        "expectedOutput": "-1"
      },
      {
        "input": "1\n5\n3 5",
        "expectedOutput": "0"
      },
      {
        "input": "1\n5\n3 4",
        "expectedOutput": "-1"
      },
      {
        "input": "7\n10 13 16 19 22 25 28\n3 22",
        "expectedOutput": "4"
      },
      {
        "input": "5\n1 1 1 1 1\n0 1",
        "expectedOutput": "0"
      },
      {
        "input": "5\n1 1 1 1 1\n0 2",
        "expectedOutput": "-1"
      },
      {
        "input": "6\n50 40 30 20 10 0\n10 0",
        "expectedOutput": "5"
      },
      {
        "input": "6\n50 40 30 20 10 0\n10 25",
        "expectedOutput": "-1"
      },
      {
        "input": "8\n3 5 7 9 11 13 15 17\n2 15",
        "expectedOutput": "6"
      },
      {
        "input": "4\n8 6 4 2\n2 8",
        "expectedOutput": "0"
      }
    ]
  },
  {
    "id": "ceiling-in-sorted-array",
    "hints": ["Run a standard binary search, but remember the best valid candidate whenever you move past a too-large midpoint.","Search for the leftmost index with value at least x, retaining the smallest such index found."],
    "returns": "int",
    "title": "Ceiling in a Sorted Array",
    "difficulty": "easy",
    "companies": [
      "TCS",
      "Amazon"
    ],
    "description": "Given a sorted array and a value x, print the index of the smallest element greater than or equal to x (its ceiling), or -1 if no such element exists. Input format: first line n, second line n sorted integers, third line x.",
    "constraints": [
      "1 <= n <= 10^5",
      "array is sorted in non-decreasing order"
    ],
    "io": "array-target",
    "topic": "searching-sorting",
    "examples": [
      {
        "input": "7\n1 2 8 10 10 12 19\n5",
        "output": "2",
        "explanation": "The first element >= 5 is 8 at index 2."
      },
      {
        "input": "4\n1 2 3 4\n4",
        "output": "3",
        "explanation": "4 itself is present at index 3."
      },
      {
        "input": "3\n1 2 3\n10",
        "output": "-1",
        "explanation": "Every element is smaller than 10, so there is no ceiling."
      }
    ],
    "testCases": [
      {
        "input": "7\n1 2 8 10 10 12 19\n5",
        "expectedOutput": "2"
      },
      {
        "input": "4\n1 2 3 4\n4",
        "expectedOutput": "3"
      },
      {
        "input": "3\n1 2 3\n10",
        "expectedOutput": "-1"
      },
      {
        "input": "1\n1\n1",
        "expectedOutput": "0"
      },
      {
        "input": "1\n1\n2",
        "expectedOutput": "-1"
      },
      {
        "input": "1\n1\n0",
        "expectedOutput": "0"
      },
      {
        "input": "5\n1 3 5 7 9\n6",
        "expectedOutput": "3"
      },
      {
        "input": "5\n1 3 5 7 9\n0",
        "expectedOutput": "0"
      },
      {
        "input": "4\n2 4 6 8\n8",
        "expectedOutput": "3"
      },
      {
        "input": "4\n2 4 6 8\n9",
        "expectedOutput": "-1"
      },
      {
        "input": "4\n5 5 5 5\n5",
        "expectedOutput": "0"
      },
      {
        "input": "5\n1 2 3 4 5\n3",
        "expectedOutput": "2"
      }
    ]
  },
  {
    "id": "pair-with-given-difference",
    "hints": ["After sorting, each element's partner must equal exactly (element + difference) — a searchable value.","Sort first, then locate partners with two pointers, binary search, or a hash set."],
    "returns": "bool",
    "title": "Pair with Given Difference",
    "difficulty": "easy",
    "companies": [
      "Amazon",
      "Visa"
    ],
    "description": "Given an array and a difference, determine whether any pair of elements has absolute difference equal to the given value. Print true or false. Input format: first line n, second line n integers, third line the difference.",
    "constraints": [
      "1 <= n <= 10^5",
      "difference >= 0"
    ],
    "io": "array-target",
    "topic": "searching-sorting",
    "examples": [
      {
        "input": "6\n5 20 3 2 50 80\n78",
        "output": "true",
        "explanation": "80 - 2 = 78, so the pair (2, 80) works."
      },
      {
        "input": "4\n1 2 3 4\n10",
        "output": "false",
        "explanation": "No two elements differ by 10."
      },
      {
        "input": "5\n-5 0 5 10 15\n5",
        "output": "true",
        "explanation": "5 - 0 = 5 (also 10 - 5 and 15 - 10)."
      }
    ],
    "testCases": [
      {
        "input": "6\n5 20 3 2 50 80\n78",
        "expectedOutput": "true"
      },
      {
        "input": "4\n1 2 3 4\n10",
        "expectedOutput": "false"
      },
      {
        "input": "5\n-5 0 5 10 15\n5",
        "expectedOutput": "true"
      },
      {
        "input": "4\n1 2 3 4\n0",
        "expectedOutput": "false"
      },
      {
        "input": "4\n1 2 2 3\n0",
        "expectedOutput": "true"
      },
      {
        "input": "1\n10\n5",
        "expectedOutput": "false"
      },
      {
        "input": "4\n-10 -5 0 5\n10",
        "expectedOutput": "true"
      },
      {
        "input": "4\n1 5 9 13\n4",
        "expectedOutput": "true"
      },
      {
        "input": "4\n1 5 9 13\n3",
        "expectedOutput": "false"
      },
      {
        "input": "3\n7 7 7\n0",
        "expectedOutput": "true"
      },
      {
        "input": "3\n100 200 300\n150",
        "expectedOutput": "false"
      },
      {
        "input": "5\n3 1 4 1 5\n2",
        "expectedOutput": "true"
      }
    ]
  },
  {
    "id": "count-triplets-sum-smaller",
    "hints": ["Fix the first element, then count qualifying pairs in the remainder against the adjusted target.","Sort the array; for each i, two-pointer the rest — when arr[l] + arr[r] is small enough, all indices between l and r pair validly with i."],
    "returns": "int",
    "title": "Count Triplets with Sum Smaller than a Given Value",
    "difficulty": "medium",
    "companies": [
      "Amazon",
      "SAP Labs"
    ],
    "description": "Count the number of triplets (i < j < k) in the array whose sum is strictly smaller than the given value. Input format: first line n, second line n integers, third line the sum limit.",
    "constraints": [
      "1 <= n <= 10^5",
      "-10^3 <= arr[i] <= 10^3"
    ],
    "io": "array-target",
    "topic": "searching-sorting",
    "examples": [
      {
        "input": "4\n-2 0 1 3\n2",
        "output": "2",
        "explanation": "The triplets (-2,0,1) and (-2,0,3) have sums below 2."
      },
      {
        "input": "5\n5 1 3 4 7\n12",
        "output": "4",
        "explanation": "Four triplets (1,3,4), (1,3,5), (1,3,7), (1,4,5) sum to less than 12."
      },
      {
        "input": "3\n1 2 3\n6",
        "output": "0",
        "explanation": "The only triplet sums to 6, which is not smaller than 6."
      }
    ],
    "testCases": [
      {
        "input": "4\n-2 0 1 3\n2",
        "expectedOutput": "2"
      },
      {
        "input": "5\n5 1 3 4 7\n12",
        "expectedOutput": "4"
      },
      {
        "input": "3\n1 2 3\n6",
        "expectedOutput": "0"
      },
      {
        "input": "3\n1 2 3\n10",
        "expectedOutput": "1"
      },
      {
        "input": "4\n1 1 1 1\n4",
        "expectedOutput": "4"
      },
      {
        "input": "3\n5 5 5\n15",
        "expectedOutput": "0"
      },
      {
        "input": "3\n-1 -2 -3\n0",
        "expectedOutput": "1"
      },
      {
        "input": "5\n0 0 0 0 0\n1",
        "expectedOutput": "10"
      },
      {
        "input": "2\n1 2\n5",
        "expectedOutput": "0"
      },
      {
        "input": "4\n4 3 2 1\n9",
        "expectedOutput": "3"
      },
      {
        "input": "3\n10 20 30\n100",
        "expectedOutput": "1"
      },
      {
        "input": "5\n-5 10 3 -2 8\n5",
        "expectedOutput": "3"
      }
    ]
  },
  {
    "id": "merge-sorted-arrays-o1-space",
    "hints": ["Compare the largest element of A with the smallest of B — if they are already ordered, the merge is done.","Swap A's tail with B's head wherever out of order (the gap method generalizes this), then sort each array."],
    "returns": "intArr",
    "title": "Merge Sorted Arrays using O(1) Space",
    "difficulty": "medium",
    "companies": [
      "Goldman Sachs",
      "Microsoft",
      "Amazon",
      "Adobe"
    ],
    "description": "Given two sorted arrays A and B, merge them into a single sorted array. Input format: first line total element count, second line all elements with array A first then array B, third line the size of A.",
    "constraints": [
      "0 <= size of A, B <= 10^5",
      "both arrays are sorted in non-decreasing order"
    ],
    "io": "array-m",
    "topic": "searching-sorting",
    "examples": [
      {
        "input": "9\n1 3 5 7 0 2 6 8 9\n4",
        "output": "0 1 2 3 5 6 7 8 9",
        "explanation": "Merging 1 3 5 7 and 0 2 6 8 9 gives 0 1 2 3 5 6 7 8 9."
      },
      {
        "input": "5\n10 12 5 18 20\n2",
        "output": "5 10 12 18 20",
        "explanation": "Merging 10 12 and 5 18 20 gives 5 10 12 18 20."
      },
      {
        "input": "2\n1 2\n1",
        "output": "1 2",
        "explanation": "Merging single elements 1 and 2 gives 1 2."
      }
    ],
    "testCases": [
      {
        "input": "9\n1 3 5 7 0 2 6 8 9\n4",
        "expectedOutput": "0 1 2 3 5 6 7 8 9"
      },
      {
        "input": "5\n10 12 5 18 20\n2",
        "expectedOutput": "5 10 12 18 20"
      },
      {
        "input": "2\n1 2\n1",
        "expectedOutput": "1 2"
      },
      {
        "input": "6\n1 2 3 4 5 6\n3",
        "expectedOutput": "1 2 3 4 5 6"
      },
      {
        "input": "6\n4 5 6 1 2 3\n3",
        "expectedOutput": "1 2 3 4 5 6"
      },
      {
        "input": "2\n1 2\n0",
        "expectedOutput": "1 2"
      },
      {
        "input": "2\n1 2\n2",
        "expectedOutput": "1 2"
      },
      {
        "input": "5\n1 1 1 1 1\n3",
        "expectedOutput": "1 1 1 1 1"
      },
      {
        "input": "4\n-3 -1 -2 0\n2",
        "expectedOutput": "-3 -2 -1 0"
      },
      {
        "input": "6\n5 1 2 3 4 6\n1",
        "expectedOutput": "1 2 3 4 5 6"
      },
      {
        "input": "10\n2 4 6 8 10 1 3 5 7 9\n5",
        "expectedOutput": "1 2 3 4 5 6 7 8 9 10"
      },
      {
        "input": "3\n1 3 2\n2",
        "expectedOutput": "1 2 3"
      }
    ]
  },
  {
    "id": "find-duplicates-on-time-o1-space",
    "hints": ["Because values are bounded, the array indices themselves can act as visited markers.","For each value v, inspect index |v|-1: negate it on first visit, and report v as duplicate if it is already negative."],
    "returns": "intArr",
    "title": "Find Duplicates in O(n) Time and O(1) Extra Space",
    "difficulty": "medium",
    "companies": [
      "Amazon",
      "Flipkart",
      "Paytm"
    ],
    "description": "Given an array, print all duplicate elements in ascending order without repetition. If there are no duplicates, print nothing. Input format: first line n, second line n integers.",
    "constraints": [
      "2 <= n <= 10^5",
      "1 <= arr[i] < n"
    ],
    "io": "array",
    "topic": "searching-sorting",
    "examples": [
      {
        "input": "8\n4 3 2 7 8 2 3 1",
        "output": "2 3",
        "explanation": "2 and 3 each appear twice."
      },
      {
        "input": "5\n1 1 2 3 4",
        "output": "1",
        "explanation": "Only 1 repeats."
      },
      {
        "input": "4\n1 2 3 4",
        "output": "",
        "explanation": "Every element appears once, so the result is empty."
      }
    ],
    "testCases": [
      {
        "input": "8\n4 3 2 7 8 2 3 1",
        "expectedOutput": "2 3"
      },
      {
        "input": "5\n1 1 2 3 4",
        "expectedOutput": "1"
      },
      {
        "input": "4\n1 2 3 4",
        "expectedOutput": ""
      },
      {
        "input": "6\n1 2 3 4 5 1",
        "expectedOutput": "1"
      },
      {
        "input": "2\n2 2",
        "expectedOutput": "2"
      },
      {
        "input": "6\n1 2 3 1 2 3",
        "expectedOutput": "1 2 3"
      },
      {
        "input": "7\n5 4 3 2 1 5 4",
        "expectedOutput": "4 5"
      },
      {
        "input": "4\n1 1 1 1",
        "expectedOutput": "1"
      },
      {
        "input": "3\n3 1 2",
        "expectedOutput": ""
      },
      {
        "input": "5\n1 3 4 2 2",
        "expectedOutput": "2"
      },
      {
        "input": "6\n10 9 8 10 9 1",
        "expectedOutput": "9 10"
      },
      {
        "input": "10\n2 5 9 6 9 3 8 9 7 1",
        "expectedOutput": "9"
      }
    ]
  },
  {
    "id": "radix-sort",
    "hints": ["Sort digit by digit from least to most significant — each digit pass must be stable for the final order to hold.","Run a stable counting sort on every digit place, handling negative numbers by offsetting or splitting by sign."],
    "returns": "intArr",
    "title": "Radix Sort",
    "difficulty": "medium",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Sort the given array using radix sort and print the sorted array. Input format: first line n, second line n integers (may include negatives).",
    "constraints": [
      "1 <= n <= 10^5",
      "-10^6 <= arr[i] <= 10^6"
    ],
    "io": "array",
    "topic": "searching-sorting",
    "examples": [
      {
        "input": "8\n170 45 75 90 802 24 2 66",
        "output": "2 24 45 66 75 90 170 802",
        "explanation": "Sorting digit by digit gives 2 24 45 66 75 90 170 802."
      },
      {
        "input": "5\n-5 -10 0 5 10",
        "output": "-10 -5 0 5 10",
        "explanation": "Negatives are sorted by magnitude and reversed: -10 -5 0 5 10."
      },
      {
        "input": "1\n42",
        "output": "42",
        "explanation": "A single element is already sorted."
      }
    ],
    "testCases": [
      {
        "input": "8\n170 45 75 90 802 24 2 66",
        "expectedOutput": "2 24 45 66 75 90 170 802"
      },
      {
        "input": "5\n-5 -10 0 5 10",
        "expectedOutput": "-10 -5 0 5 10"
      },
      {
        "input": "1\n42",
        "expectedOutput": "42"
      },
      {
        "input": "5\n5 4 3 2 1",
        "expectedOutput": "1 2 3 4 5"
      },
      {
        "input": "5\n1 2 3 4 5",
        "expectedOutput": "1 2 3 4 5"
      },
      {
        "input": "3\n0 0 0",
        "expectedOutput": "0 0 0"
      },
      {
        "input": "3\n-1 -2 -3",
        "expectedOutput": "-3 -2 -1"
      },
      {
        "input": "4\n1000 100 10 1",
        "expectedOutput": "1 10 100 1000"
      },
      {
        "input": "4\n432 234 324 243",
        "expectedOutput": "234 243 324 432"
      },
      {
        "input": "1\n7",
        "expectedOutput": "7"
      },
      {
        "input": "5\n-100 50 -25 75 0",
        "expectedOutput": "-100 -25 0 50 75"
      },
      {
        "input": "3\n999999 1 500000",
        "expectedOutput": "1 500000 999999"
      }
    ]
  },
  {
    "id": "make-all-array-elements-equal",
    "hints": ["The total cost is the sum of distances to the chosen target — which single value minimizes total distance?","The median minimizes the sum of absolute deviations: sort and accumulate |arr[i] - median|."],
    "returns": "int",
    "title": "Make all Array Elements Equal",
    "difficulty": "medium",
    "companies": [
      "Amazon",
      "Google"
    ],
    "description": "In one operation you may increment or decrement any element by 1. Print the minimum number of operations needed to make all array elements equal. Input format: first line n, second line n integers.",
    "constraints": [
      "1 <= n <= 10^5",
      "-10^9 <= arr[i] <= 10^9"
    ],
    "io": "array",
    "topic": "searching-sorting",
    "examples": [
      {
        "input": "4\n1 2 3 4",
        "output": "4",
        "explanation": "Using median 2, the costs are 1 + 0 + 1 + 2 = 4."
      },
      {
        "input": "3\n1 10 2",
        "output": "9",
        "explanation": "Using median 2, the costs are 1 + 8 + 0 = 9."
      },
      {
        "input": "1\n7",
        "output": "0",
        "explanation": "Already equal, 0 operations."
      }
    ],
    "testCases": [
      {
        "input": "4\n1 2 3 4",
        "expectedOutput": "4"
      },
      {
        "input": "3\n1 10 2",
        "expectedOutput": "9"
      },
      {
        "input": "1\n7",
        "expectedOutput": "0"
      },
      {
        "input": "4\n5 5 5 5",
        "expectedOutput": "0"
      },
      {
        "input": "2\n1 100",
        "expectedOutput": "99"
      },
      {
        "input": "3\n1 2 3",
        "expectedOutput": "2"
      },
      {
        "input": "3\n-3 -2 -1",
        "expectedOutput": "2"
      },
      {
        "input": "5\n10 20 30 40 50",
        "expectedOutput": "60"
      },
      {
        "input": "4\n4 4 4 9",
        "expectedOutput": "5"
      },
      {
        "input": "2\n2 9",
        "expectedOutput": "7"
      },
      {
        "input": "6\n1 1 2 2 3 3",
        "expectedOutput": "4"
      },
      {
        "input": "2\n1000000 1",
        "expectedOutput": "999999"
      }
    ]
  },
  {
    "id": "check-reverse-subarray-sorted",
    "hints": ["Find where sorted order first breaks from the left and from the right — any fixing reversal must span that segment.","Identify the disorder boundaries, reverse exactly that segment, then verify the whole array is sorted."],
    "returns": "bool",
    "title": "Check if Reversing a Subarray Makes the Array Sorted",
    "difficulty": "medium",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "Determine whether reversing exactly one subarray can sort the array in non-decreasing order. Print true or false. Input format: first line n, second line n integers.",
    "constraints": [
      "1 <= n <= 10^5",
      "-10^9 <= arr[i] <= 10^9"
    ],
    "io": "array",
    "topic": "searching-sorting",
    "examples": [
      {
        "input": "7\n1 2 5 4 3 6 7",
        "output": "true",
        "explanation": "Reversing the subarray 5 4 3 gives 1 2 3 4 5 6 7."
      },
      {
        "input": "5\n1 2 3 5 4",
        "output": "true",
        "explanation": "Reversing 5 4 gives the sorted array."
      },
      {
        "input": "5\n2 1 4 3 5",
        "output": "false",
        "explanation": "No single reversal can sort this array."
      }
    ],
    "testCases": [
      {
        "input": "7\n1 2 5 4 3 6 7",
        "expectedOutput": "true"
      },
      {
        "input": "5\n1 2 3 5 4",
        "expectedOutput": "true"
      },
      {
        "input": "5\n2 1 4 3 5",
        "expectedOutput": "false"
      },
      {
        "input": "5\n1 2 3 4 5",
        "expectedOutput": "true"
      },
      {
        "input": "5\n5 4 3 2 1",
        "expectedOutput": "true"
      },
      {
        "input": "1\n1",
        "expectedOutput": "true"
      },
      {
        "input": "3\n1 3 2",
        "expectedOutput": "true"
      },
      {
        "input": "3\n3 1 2",
        "expectedOutput": "false"
      },
      {
        "input": "6\n1 5 3 4 2 6",
        "expectedOutput": "false"
      },
      {
        "input": "5\n1 2 4 3 5",
        "expectedOutput": "true"
      },
      {
        "input": "3\n2 3 1",
        "expectedOutput": "false"
      },
      {
        "input": "5\n1 4 3 2 5",
        "expectedOutput": "true"
      }
    ]
  },
  {
    "id": "four-sum",
    "hints": ["Extend the 3Sum strategy: fix two elements up front, then two-pointer the remainder.","Sort the array, nest two loops to fix the first pair, and scan the rest with two pointers while skipping duplicates everywhere."],
    "returns": "intMat",
    "title": "Find Four Elements that Sum to a Given Value",
    "difficulty": "medium",
    "companies": [
      "Adobe",
      "Amazon",
      "Google",
      "Microsoft"
    ],
    "description": "Find all unique quadruples in the array that sum to the given value. Print each quadruple in ascending order, one per line, sorted lexicographically; print nothing if none exist. Input format: first line n, second line n integers, third line the target sum.",
    "constraints": [
      "1 <= n <= 200",
      "-10^9 <= arr[i], target <= 10^9"
    ],
    "io": "array-target",
    "topic": "searching-sorting",
    "examples": [
      {
        "input": "6\n1 0 -1 0 -2 2\n0",
        "output": "-2 -1 1 2\n-2 0 0 2\n-1 0 0 1",
        "explanation": "The quadruples are [-2,-1,1,2], [-2,0,0,2] and [-1,0,0,1]."
      },
      {
        "input": "5\n2 2 2 2 2\n8",
        "output": "2 2 2 2",
        "explanation": "The only quadruple is [2,2,2,2]."
      },
      {
        "input": "4\n1 2 3 4\n100",
        "output": "",
        "explanation": "No four elements sum to 100."
      }
    ],
    "testCases": [
      {
        "input": "6\n1 0 -1 0 -2 2\n0",
        "expectedOutput": "-2 -1 1 2\n-2 0 0 2\n-1 0 0 1"
      },
      {
        "input": "5\n2 2 2 2 2\n8",
        "expectedOutput": "2 2 2 2"
      },
      {
        "input": "4\n1 2 3 4\n100",
        "expectedOutput": ""
      },
      {
        "input": "5\n1 1 1 1 1\n4",
        "expectedOutput": "1 1 1 1"
      },
      {
        "input": "4\n0 0 0 0\n0",
        "expectedOutput": "0 0 0 0"
      },
      {
        "input": "7\n-3 -2 -1 0 1 2 3\n0",
        "expectedOutput": "-3 -2 2 3\n-3 -1 1 3\n-3 0 1 2\n-2 -1 0 3\n-2 -1 1 2"
      },
      {
        "input": "6\n5 5 3 4 1 2\n12",
        "expectedOutput": "1 2 4 5"
      },
      {
        "input": "2\n1 2\n3",
        "expectedOutput": ""
      },
      {
        "input": "5\n-1 -1 0 1 2\n0",
        "expectedOutput": "-1 -1 0 2"
      },
      {
        "input": "6\n2 2 2 2 2 2\n8",
        "expectedOutput": "2 2 2 2"
      },
      {
        "input": "4\n10 20 30 40\n100",
        "expectedOutput": "10 20 30 40"
      },
      {
        "input": "5\n-5 -4 -3 -2 -1\n-14",
        "expectedOutput": "-5 -4 -3 -2"
      }
    ]
  },
  {
    "id": "median-of-two-sorted-arrays",
    "hints": ["The median splits the combined array into equal halves — binary search where that split lands in the smaller array.","Partition both arrays so the left halves match the right halves in size, adjusting until max(left) <= min(right)."],
    "returns": "string",
    "title": "Median of Two Sorted Arrays of Different Sizes",
    "difficulty": "hard",
    "companies": [
      "Amazon",
      "Google",
      "Microsoft",
      "Samsung"
    ],
    "description": "Given two sorted arrays of possibly different sizes, print the median of the combined sorted array. Input format: first line total element count, second line all elements with the first array first then the second, third line the size of the first array.",
    "constraints": [
      "0 <= size of each array <= 10^5",
      "total size >= 1",
      "both arrays are sorted in non-decreasing order"
    ],
    "io": "array-m",
    "topic": "searching-sorting",
    "examples": [
      {
        "input": "3\n1 3 2\n2",
        "output": "2",
        "explanation": "Merged array is 1 2 3, median is 2."
      },
      {
        "input": "4\n1 2 3 4\n2",
        "output": "2.5",
        "explanation": "Merged array is 1 2 3 4, median is (2+3)/2 = 2.5."
      },
      {
        "input": "4\n0 0 0 0\n2",
        "output": "0",
        "explanation": "Merged array is 0 0 0 0, median is 0."
      }
    ],
    "testCases": [
      {
        "input": "3\n1 3 2\n2",
        "expectedOutput": "2"
      },
      {
        "input": "4\n1 2 3 4\n2",
        "expectedOutput": "2.5"
      },
      {
        "input": "4\n0 0 0 0\n2",
        "expectedOutput": "0"
      },
      {
        "input": "2\n1 2\n1",
        "expectedOutput": "1.5"
      },
      {
        "input": "1\n5\n1",
        "expectedOutput": "5"
      },
      {
        "input": "1\n7\n0",
        "expectedOutput": "7"
      },
      {
        "input": "10\n1 2 3 4 5 6 7 8 9 10\n5",
        "expectedOutput": "5.5"
      },
      {
        "input": "5\n-5 -3 -1 -4 -2\n3",
        "expectedOutput": "-3"
      },
      {
        "input": "2\n100 1\n1",
        "expectedOutput": "50.5"
      },
      {
        "input": "5\n1 1 1 1 1\n3",
        "expectedOutput": "1"
      },
      {
        "input": "3\n2 1 3\n1",
        "expectedOutput": "2"
      },
      {
        "input": "4\n-2 -1 3 4\n2",
        "expectedOutput": "1"
      }
    ]
  },
  {
    "id": "subarrays-with-zero-sum",
    "hints": ["A zero-sum subarray sits between two equal prefix sums — the same insight as the divisible-by-k problem.","Store prefix sums with all their indices in a hash map; every repeat of a sum yields zero-sum subarrays ending here."],
    "returns": "intMat",
    "title": "Print Subarrays with 0 Sum",
    "difficulty": "medium",
    "companies": [
      "Paytm",
      "Adobe"
    ],
    "description": "Print all subarrays whose elements sum to 0, ordered by start index then end index, one subarray per line. Print nothing if none exist. Input format: first line n, second line n integers.",
    "constraints": [
      "1 <= n <= 100",
      "-10^3 <= arr[i] <= 10^3"
    ],
    "io": "array",
    "topic": "searching-sorting",
    "examples": [
      {
        "input": "6\n4 2 -3 -1 0 4",
        "output": "-3 -1 0 4\n0",
        "explanation": "Subarrays [-3,-1,0,4] and [0] sum to 0."
      },
      {
        "input": "3\n1 2 3",
        "output": "",
        "explanation": "No subarray sums to 0."
      },
      {
        "input": "4\n0 0 0 0",
        "output": "0\n0 0\n0 0 0\n0 0 0 0\n0\n0 0\n0 0 0\n0\n0 0\n0",
        "explanation": "Every subarray of [0,0,0,0] sums to 0, 10 in total."
      }
    ],
    "testCases": [
      {
        "input": "6\n4 2 -3 -1 0 4",
        "expectedOutput": "-3 -1 0 4\n0"
      },
      {
        "input": "3\n1 2 3",
        "expectedOutput": ""
      },
      {
        "input": "4\n0 0 0 0",
        "expectedOutput": "0\n0 0\n0 0 0\n0 0 0 0\n0\n0 0\n0 0 0\n0\n0 0\n0"
      },
      {
        "input": "1\n0",
        "expectedOutput": "0"
      },
      {
        "input": "2\n1 -1",
        "expectedOutput": "1 -1"
      },
      {
        "input": "3\n1 2 -3",
        "expectedOutput": "1 2 -3"
      },
      {
        "input": "4\n2 -2 2 -2",
        "expectedOutput": "2 -2\n2 -2 2 -2\n-2 2\n2 -2"
      },
      {
        "input": "2\n0 1",
        "expectedOutput": "0"
      },
      {
        "input": "3\n0 1 -1",
        "expectedOutput": "0\n0 1 -1\n1 -1"
      },
      {
        "input": "3\n-1 1 0",
        "expectedOutput": "-1 1\n-1 1 0\n0"
      },
      {
        "input": "3\n3 4 -7",
        "expectedOutput": "3 4 -7"
      },
      {
        "input": "4\n1 2 3 -6",
        "expectedOutput": "1 2 3 -6"
      }
    ]
  },
  {
    "id": "minimum-swaps-to-sort",
    "hints": ["Each element belongs at a known sorted position — view the current arrangement as a permutation of target positions.","Decompose the permutation into cycles; a cycle of length L resolves in L-1 swaps."],
    "returns": "int",
    "title": "Minimum Swaps to Sort",
    "difficulty": "medium",
    "companies": [
      "Amazon",
      "Google"
    ],
    "description": "Print the minimum number of swaps required to sort the array in ascending order. All elements are distinct. Input format: first line n, second line n integers.",
    "constraints": [
      "1 <= n <= 10^5",
      "all elements are distinct"
    ],
    "io": "array",
    "topic": "searching-sorting",
    "examples": [
      {
        "input": "5\n4 3 2 1 5",
        "output": "2",
        "explanation": "Swap 4 with 1 and 3 with 2: 2 swaps."
      },
      {
        "input": "4\n1 2 3 4",
        "output": "0",
        "explanation": "Already sorted, 0 swaps."
      },
      {
        "input": "4\n2 1 4 3",
        "output": "2",
        "explanation": "Swap (2,1) and (4,3): 2 swaps."
      }
    ],
    "testCases": [
      {
        "input": "5\n4 3 2 1 5",
        "expectedOutput": "2"
      },
      {
        "input": "4\n1 2 3 4",
        "expectedOutput": "0"
      },
      {
        "input": "4\n2 1 4 3",
        "expectedOutput": "2"
      },
      {
        "input": "1\n1",
        "expectedOutput": "0"
      },
      {
        "input": "2\n2 1",
        "expectedOutput": "1"
      },
      {
        "input": "3\n3 2 1",
        "expectedOutput": "1"
      },
      {
        "input": "3\n1 3 2",
        "expectedOutput": "1"
      },
      {
        "input": "5\n5 4 3 2 1",
        "expectedOutput": "2"
      },
      {
        "input": "7\n7 1 3 2 4 5 6",
        "expectedOutput": "5"
      },
      {
        "input": "3\n10 20 30",
        "expectedOutput": "0"
      },
      {
        "input": "3\n30 10 20",
        "expectedOutput": "2"
      },
      {
        "input": "4\n4 1 2 3",
        "expectedOutput": "3"
      }
    ]
  }
,
{
      "id": "linked-list-cycle",
    "hints": ["Think about what happens if two walkers move through the list at different speeds and a cycle exists.","Use Floyd's cycle detection: a slow pointer and a fast pointer; if they ever meet, a cycle exists, and if the fast pointer hits null, there is none."],
      "returns": "bool",
      "title": "Linked List Cycle",
      "difficulty": "easy",
      "topic": "linked-list",
      "companies": [
            "Amazon",
            "Microsoft",
            "Adobe"
          ],
      "description": "Given the head of a singly linked list, determine whether the list contains a cycle. Input format: line 1 = n (number of nodes), line 2 = n space-separated node values, line 3 = pos, the 0-based index of the node that the tail links back to in order to form a cycle. pos = -1 means the tail points to null and there is no cycle. Return true if a cycle exists, otherwise false.",
      "examples": [
            {
                    "input": "4\n3 2 0 -4\n1",
                    "output": "true",
                    "explanation": "The tail (value -4) links back to the node at index 1 (value 2), forming a cycle."
                  },
            {
                    "input": "2\n1 2\n0",
                    "output": "true",
                    "explanation": "The tail links back to the head, forming a cycle."
                  },
            {
                    "input": "2\n1 2\n-1",
                    "output": "false",
                    "explanation": "The tail points to null, so there is no cycle."
                  }
          ],
      "constraints": [
            "0 <= n <= 10^4",
            "-10^5 <= node value <= 10^5",
            "-1 <= pos < n"
          ],
      "io": "linkedlist-n",
      "testCases": [
            {
                    "input": "4\n3 2 0 -4\n1",
                    "expectedOutput": "true"
                  },
            {
                    "input": "2\n1 2\n0",
                    "expectedOutput": "true"
                  },
            {
                    "input": "2\n1 2\n-1",
                    "expectedOutput": "false"
                  },
            {
                    "input": "7\n-13 -20 -15 17 -18 -15 -14\n4",
                    "expectedOutput": "true"
                  },
            {
                    "input": "3\n-19 -19 -19\n1",
                    "expectedOutput": "true"
                  },
            {
                    "input": "7\n19 9 -11 -15 -9 -13 -20\n6",
                    "expectedOutput": "true"
                  },
            {
                    "input": "3\n-16 14 9\n-1",
                    "expectedOutput": "false"
                  },
            {
                    "input": "1\n12\n-1",
                    "expectedOutput": "false"
                  },
            {
                    "input": "4\n15 -16 -1 10\n1",
                    "expectedOutput": "true"
                  },
            {
                    "input": "4\n-5 -8 9 13\n-1",
                    "expectedOutput": "false"
                  },
            {
                    "input": "8\n-16 -20 1 -11 10 4 -10 -17\n0",
                    "expectedOutput": "true"
                  },
            {
                    "input": "7\n-10 -16 15 -7 -11 -19 2\n0",
                    "expectedOutput": "true"
                  }
          ]
    },
  {
      "id": "detect-and-remove-loop",
    "hints": ["First find whether a loop exists, then figure out where the loop actually starts.","Detect the loop with Floyd's algorithm, then keep one pointer at the meeting point and move another from the head until their next pointers coincide; set that next to null to break the loop."],
      "returns": "linkedlist",
      "title": "Detect and Remove Loop in a Linked List",
      "difficulty": "medium",
      "topic": "linked-list",
      "companies": [
            "Amazon",
            "Microsoft"
          ],
      "description": "Given a singly linked list that may contain a loop, detect the loop and remove it so the list becomes linear. Input format: line 1 = n (number of nodes), line 2 = n space-separated node values, line 3 = pos, the 0-based index of the node that the tail links back to (pos = -1 means no loop). Return the values of the resulting list in order, space-separated.",
      "examples": [
            {
                    "input": "5\n1 2 3 4 5\n2",
                    "output": "1 2 3 4 5",
                    "explanation": "The tail links back to the node with value 3; removing the loop gives 1 2 3 4 5."
                  },
            {
                    "input": "3\n1 2 3\n0",
                    "output": "1 2 3",
                    "explanation": "The tail links back to the head; removing the loop gives 1 2 3."
                  },
            {
                    "input": "4\n1 2 3 4\n-1",
                    "output": "1 2 3 4",
                    "explanation": "There is no loop, so the list is unchanged."
                  }
          ],
      "constraints": [
            "0 <= n <= 10^4",
            "-10^5 <= node value <= 10^5",
            "-1 <= pos < n"
          ],
      "io": "linkedlist-n",
      "testCases": [
            {
                    "input": "5\n1 2 3 4 5\n2",
                    "expectedOutput": "1 2 3 4 5"
                  },
            {
                    "input": "3\n1 2 3\n0",
                    "expectedOutput": "1 2 3"
                  },
            {
                    "input": "4\n1 2 3 4\n-1",
                    "expectedOutput": "1 2 3 4"
                  },
            {
                    "input": "8\n-11 -1 9 -18 6 -3 -18 -9\n3",
                    "expectedOutput": "-11 -1 9 -18 6 -3 -18 -9"
                  },
            {
                    "input": "2\n-1 -11\n0",
                    "expectedOutput": "-1 -11"
                  },
            {
                    "input": "0\n\n-1",
                    "expectedOutput": ""
                  },
            {
                    "input": "6\n2 11 1 17 9 10\n-1",
                    "expectedOutput": "2 11 1 17 9 10"
                  },
            {
                    "input": "7\n18 -10 8 13 8 -2 -3\n0",
                    "expectedOutput": "18 -10 8 13 8 -2 -3"
                  },
            {
                    "input": "2\n6 7\n-1",
                    "expectedOutput": "6 7"
                  },
            {
                    "input": "8\n-14 11 4 -4 -8 2 -14 -10\n3",
                    "expectedOutput": "-14 11 4 -4 -8 2 -14 -10"
                  },
            {
                    "input": "2\n0 8\n1",
                    "expectedOutput": "0 8"
                  },
            {
                    "input": "1\n-15\n0",
                    "expectedOutput": "-15"
                  }
          ]
    },
  {
      "id": "intersection-point-two-linked-lists",
    "hints": ["Focus on node identity (shared references) rather than equal values when the lists are actually linked.","The two-pointer trick works here: walk both lists, and when a pointer reaches the end, redirect it to the other list's head; they meet at the intersection."],
      "returns": "int",
      "title": "Intersection Point of Two Linked Lists",
      "difficulty": "easy",
      "topic": "linked-list",
      "companies": [
            "Amazon",
            "Microsoft",
            "Flipkart"
          ],
      "description": "Given two singly linked lists, find their intersection point. Input format: line 1 = n1, line 2 = values of list 1, line 3 = n2, line 4 = values of list 2. Since the two lists are built independently here, intersection is determined by value: return the first value of list 1 that also appears in list 2. Return -1 if there is no common value.",
      "examples": [
            {
                    "input": "5\n4 1 8 4 5\n6\n5 6 1 8 4 5",
                    "output": "4",
                    "explanation": "4 is the first value of list 1 that also appears in list 2."
                  },
            {
                    "input": "3\n1 2 3\n3\n4 5 6",
                    "output": "-1",
                    "explanation": "The two lists share no value."
                  },
            {
                    "input": "4\n2 6 4 1\n3\n3 2 8",
                    "output": "2",
                    "explanation": "2 is the first value of list 1 found in list 2."
                  }
          ],
      "constraints": [
            "0 <= n1, n2 <= 10^4",
            "1 <= node value <= 10^4"
          ],
      "io": "two-lists",
      "testCases": [
            {
                    "input": "5\n4 1 8 4 5\n6\n5 6 1 8 4 5",
                    "expectedOutput": "4"
                  },
            {
                    "input": "3\n1 2 3\n3\n4 5 6",
                    "expectedOutput": "-1"
                  },
            {
                    "input": "4\n2 6 4 1\n3\n3 2 8",
                    "expectedOutput": "2"
                  },
            {
                    "input": "3\n1 15 5\n0\n",
                    "expectedOutput": "-1"
                  },
            {
                    "input": "3\n9 14 2\n5\n5 8 2 10 5",
                    "expectedOutput": "2"
                  },
            {
                    "input": "1\n12\n6\n4 2 7 4 12 15",
                    "expectedOutput": "12"
                  },
            {
                    "input": "7\n9 4 14 13 6 15 14\n3\n9 15 12",
                    "expectedOutput": "9"
                  },
            {
                    "input": "6\n3 10 4 5 1 14\n5\n9 3 8 15 13",
                    "expectedOutput": "3"
                  },
            {
                    "input": "8\n8 6 3 3 1 10 3 15\n2\n14 9",
                    "expectedOutput": "-1"
                  },
            {
                    "input": "1\n12\n5\n3 1 11 11 1",
                    "expectedOutput": "-1"
                  },
            {
                    "input": "1\n13\n2\n15 4",
                    "expectedOutput": "-1"
                  },
            {
                    "input": "0\n\n6\n7 12 6 4 14 11",
                    "expectedOutput": "-1"
                  }
          ]
    },
  {
      "id": "flatten-linked-list-next-child",
    "hints": ["Think of the child chains as continuations that must be woven in right after each main-list node.","Do a depth-first flatten: for each main-list node in order, emit its value followed by its entire child chain before moving to the next main node."],
      "returns": "intArr",
      "title": "Flatten a Linked List with Next and Child Pointers",
      "difficulty": "medium",
      "topic": "linked-list",
      "companies": [
            "Amazon",
            "Microsoft"
          ],
      "description": "Every node of the main linked list has a next pointer and a child pointer (the head of a child list). Flatten the structure depth-first: output each main-list node's value followed by its child chain, in main-list order. Input format: line 1 = 'R C'. Row 0 holds the main list values. Row j+1 holds the child chain of main-list node j. Rows are padded with -1 to length C; -1 means absent and all real values are non-negative.",
      "examples": [
            {
                    "input": "4 3\n1 2 3\n4 5 -1\n-1 -1 -1\n6 -1 -1",
                    "output": "1 4 5 2 3 6",
                    "explanation": "Node 1 is followed by children 4, 5; node 2 has no children; node 3 is followed by child 6."
                  },
            {
                    "input": "2 2\n1 2\n-1 -1",
                    "output": "1 2",
                    "explanation": "No child chains, so the flattened list is 1 2."
                  },
            {
                    "input": "3 2\n9 8\n7 -1\n-1 -1",
                    "output": "9 7 8",
                    "explanation": "Node 9 is followed by child 7; node 8 has no children."
                  }
          ],
      "constraints": [
            "1 <= main list length <= 100",
            "0 <= node value <= 10^3"
          ],
      "io": "matrix",
      "testCases": [
            {
                    "input": "4 3\n1 2 3\n4 5 -1\n-1 -1 -1\n6 -1 -1",
                    "expectedOutput": "1 4 5 2 3 6"
                  },
            {
                    "input": "2 2\n1 2\n-1 -1",
                    "expectedOutput": "1 2"
                  },
            {
                    "input": "3 2\n9 8\n7 -1\n-1 -1",
                    "expectedOutput": "9 7 8"
                  },
            {
                    "input": "5 4\n35 68 80 38\n40 87 73 -1\n68 -1 -1 -1\n-1 -1 -1 -1\n35 52 -1 -1",
                    "expectedOutput": "35 40 87 73 68 68 80 38 35 52"
                  },
            {
                    "input": "5 4\n72 35 67 14\n35 27 38 -1\n6 44 56 -1\n99 -1 -1 -1\n21 48 39 -1",
                    "expectedOutput": "72 35 27 38 35 6 44 56 67 99 14 21 48 39"
                  },
            {
                    "input": "2 3\n9 -1 -1\n50 38 54",
                    "expectedOutput": "9 50 38 54"
                  },
            {
                    "input": "5 4\n23 51 80 61\n36 -1 -1 -1\n83 76 -1 -1\n26 21 -1 -1\n85 60 84 -1",
                    "expectedOutput": "23 36 51 83 76 80 26 21 61 85 60 84"
                  },
            {
                    "input": "2 3\n92 -1 -1\n84 13 3",
                    "expectedOutput": "92 84 13 3"
                  },
            {
                    "input": "4 3\n60 8 17\n44 96 -1\n38 87 -1\n72 37 -1",
                    "expectedOutput": "60 44 96 8 38 87 17 72 37"
                  },
            {
                    "input": "6 5\n24 65 95 35 9\n43 -1 -1 -1 -1\n41 58 -1 -1 -1\n10 97 -1 -1 -1\n-1 -1 -1 -1 -1\n32 -1 -1 -1 -1",
                    "expectedOutput": "24 43 65 41 58 95 10 97 35 9 32"
                  },
            {
                    "input": "4 3\n17 3 50\n-1 -1 -1\n-1 -1 -1\n85 -1 -1",
                    "expectedOutput": "17 3 50 85"
                  },
            {
                    "input": "3 2\n40 66\n55 65\n-1 -1",
                    "expectedOutput": "40 55 65 66"
                  }
          ]
    },
  {
      "id": "reverse-doubly-linked-list",
    "hints": ["Reversing values of a doubly linked list is equivalent to reversing the sequence.","Since the list is given as forward-order values, simply reverse the array of values to get the reversed list."],
      "returns": "intArr",
      "title": "Reverse a Doubly Linked List",
      "difficulty": "easy",
      "topic": "linked-list",
      "companies": [
            "Amazon",
            "Adobe"
          ],
      "description": "Given a doubly linked list represented as an array of its forward-order values, return the reversed doubly linked list as an array. Reversing the node values of a doubly linked list is equivalent to reversing this array.",
      "examples": [
            {
                    "input": "5\n1 2 3 4 5",
                    "output": "5 4 3 2 1",
                    "explanation": "Reversing 1 2 3 4 5 gives 5 4 3 2 1."
                  },
            {
                    "input": "1\n7",
                    "output": "7",
                    "explanation": "A single node list is unchanged."
                  },
            {
                    "input": "4\n10 20 30 40",
                    "output": "40 30 20 10",
                    "explanation": "Reversing gives 40 30 20 10."
                  }
          ],
      "constraints": [
            "1 <= n <= 10^4",
            "-10^5 <= value <= 10^5"
          ],
      "io": "array",
      "testCases": [
            {
                    "input": "5\n1 2 3 4 5",
                    "expectedOutput": "5 4 3 2 1"
                  },
            {
                    "input": "1\n7",
                    "expectedOutput": "7"
                  },
            {
                    "input": "4\n10 20 30 40",
                    "expectedOutput": "40 30 20 10"
                  },
            {
                    "input": "5\n-17 39 12 24 -22",
                    "expectedOutput": "-22 24 12 39 -17"
                  },
            {
                    "input": "6\n14 -40 33 -48 37 24",
                    "expectedOutput": "24 37 -48 33 -40 14"
                  },
            {
                    "input": "6\n22 -21 -30 11 13 37",
                    "expectedOutput": "37 13 11 -30 -21 22"
                  },
            {
                    "input": "3\n18 29 29",
                    "expectedOutput": "29 29 18"
                  },
            {
                    "input": "2\n-32 18",
                    "expectedOutput": "18 -32"
                  },
            {
                    "input": "4\n38 -29 14 46",
                    "expectedOutput": "46 14 -29 38"
                  },
            {
                    "input": "9\n38 49 0 -9 -34 40 21 22 18",
                    "expectedOutput": "18 22 21 40 -34 -9 0 49 38"
                  },
            {
                    "input": "10\n26 7 -45 -3 -42 -3 47 36 2 -45",
                    "expectedOutput": "-45 2 36 47 -3 -42 -3 -45 7 26"
                  },
            {
                    "input": "10\n28 -41 -10 -21 29 -25 -6 16 38 48",
                    "expectedOutput": "48 38 16 -6 -25 29 -21 -10 -41 28"
                  }
          ]
    },
  {
      "id": "point-next-higher-arbitrary-pointer",
    "hints": ["Each node's target is the first strictly greater value appearing after it in the list.","For each position, scan rightward to find the first value greater than the current one, or use a monotonic stack scanning from right to left for an O(n) solution."],
      "returns": "intArr",
      "title": "Point to Next Higher Value Node with an Arbitrary Pointer",
      "difficulty": "medium",
      "topic": "linked-list",
      "companies": [
            "Amazon",
            "Google"
          ],
      "description": "Every node of the linked list has an arbitrary pointer that must point to the next node with a strictly higher value: the first node after it whose value is greater than its own, or null if no such node exists. Given the list values as an array, output for each position the value that its arbitrary pointer targets, or -1 when it points to null.",
      "examples": [
            {
                    "input": "5\n5 2 6 1 3",
                    "output": "6 6 -1 3 -1",
                    "explanation": "5 -> 6, 2 -> 6, 6 -> none, 1 -> 3, 3 -> none."
                  },
            {
                    "input": "3\n1 2 3",
                    "output": "2 3 -1",
                    "explanation": "Each node points to its immediate successor."
                  },
            {
                    "input": "4\n4 3 2 1",
                    "output": "-1 -1 -1 -1",
                    "explanation": "No node has a higher value after it."
                  }
          ],
      "constraints": [
            "1 <= n <= 10^4",
            "-10^5 <= value <= 10^5"
          ],
      "io": "array",
      "testCases": [
            {
                    "input": "5\n5 2 6 1 3",
                    "expectedOutput": "6 6 -1 3 -1"
                  },
            {
                    "input": "3\n1 2 3",
                    "expectedOutput": "2 3 -1"
                  },
            {
                    "input": "4\n4 3 2 1",
                    "expectedOutput": "-1 -1 -1 -1"
                  },
            {
                    "input": "7\n25 13 -44 -47 7 -40 -13",
                    "expectedOutput": "-1 -1 7 7 -1 -13 -1"
                  },
            {
                    "input": "7\n-7 -32 12 36 46 33 -20",
                    "expectedOutput": "12 12 36 46 -1 -1 -1"
                  },
            {
                    "input": "1\n44",
                    "expectedOutput": "-1"
                  },
            {
                    "input": "6\n25 -3 3 -28 -41 31",
                    "expectedOutput": "31 3 31 31 31 -1"
                  },
            {
                    "input": "1\n-23",
                    "expectedOutput": "-1"
                  },
            {
                    "input": "4\n27 29 20 43",
                    "expectedOutput": "29 43 43 -1"
                  },
            {
                    "input": "3\n14 -34 36",
                    "expectedOutput": "36 36 -1"
                  },
            {
                    "input": "5\n33 45 -44 26 9",
                    "expectedOutput": "45 -1 26 -1 -1"
                  },
            {
                    "input": "6\n26 43 -3 -14 0 2",
                    "expectedOutput": "43 -1 0 0 2 -1"
                  }
          ]
    },
  {
      "id": "rearrange-linked-list-in-place",
    "hints": ["This is the same reorder pattern as splitting, reversing, and merging.","Find the middle, reverse the second half, then merge the two halves by alternating nodes from each."],
      "returns": "linkedlist",
      "title": "Rearrange a Given Linked List in Place",
      "difficulty": "medium",
      "topic": "linked-list",
      "companies": [
            "Amazon",
            "Microsoft"
          ],
      "description": "Rearrange a singly linked list in place into the order L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 -> ... where L0 is the head and Ln is the tail. Return the rearranged values, space-separated.",
      "examples": [
            {
                    "input": "4\n1 2 3 4",
                    "output": "1 4 2 3",
                    "explanation": "Rearranged as 1 -> 4 -> 2 -> 3."
                  },
            {
                    "input": "5\n1 2 3 4 5",
                    "output": "1 5 2 4 3",
                    "explanation": "Rearranged as 1 -> 5 -> 2 -> 4 -> 3."
                  },
            {
                    "input": "1\n9",
                    "output": "9",
                    "explanation": "A single node list is unchanged."
                  }
          ],
      "constraints": [
            "1 <= n <= 10^4",
            "-10^5 <= node value <= 10^5"
          ],
      "io": "linkedlist",
      "testCases": [
            {
                    "input": "4\n1 2 3 4",
                    "expectedOutput": "1 4 2 3"
                  },
            {
                    "input": "5\n1 2 3 4 5",
                    "expectedOutput": "1 5 2 4 3"
                  },
            {
                    "input": "1\n9",
                    "expectedOutput": "9"
                  },
            {
                    "input": "6\n-21 -14 -49 -10 24 -16",
                    "expectedOutput": "-21 -16 -14 24 -49 -10"
                  },
            {
                    "input": "2\n19 26",
                    "expectedOutput": "19 26"
                  },
            {
                    "input": "1\n-23",
                    "expectedOutput": "-23"
                  },
            {
                    "input": "9\n23 25 -3 18 -27 -9 -13 -4 -16",
                    "expectedOutput": "23 -16 25 -4 -3 -13 18 -9 -27"
                  },
            {
                    "input": "3\n8 -29 -50",
                    "expectedOutput": "8 -50 -29"
                  },
            {
                    "input": "9\n39 2 -20 -26 6 -16 43 -28 -5",
                    "expectedOutput": "39 -5 2 -28 -20 43 -26 -16 6"
                  },
            {
                    "input": "10\n2 17 12 46 26 25 11 11 15 6",
                    "expectedOutput": "2 6 17 15 12 11 46 11 26 25"
                  },
            {
                    "input": "6\n29 -37 41 36 17 1",
                    "expectedOutput": "29 1 -37 17 41 36"
                  },
            {
                    "input": "10\n-34 -37 50 10 12 -38 19 21 -34 48",
                    "expectedOutput": "-34 48 -37 -34 50 21 10 19 12 -38"
                  }
          ]
    },
  {
      "id": "sort-biotonic-doubly-linked-list",
    "hints": ["A bitonic list is increasing then decreasing, so the sorted order is a merge of two sorted sequences.","Split the list at the peak into an increasing part and a decreasing part, reverse the decreasing part, then merge the two sorted halves."],
      "returns": "intArr",
      "title": "Sort Biotonic Doubly Linked Lists",
      "difficulty": "medium",
      "topic": "linked-list",
      "companies": [
            "Amazon",
            "Microsoft",
            "Adobe"
          ],
      "description": "Given a bitonic doubly linked list, i.e. node values strictly increase and then strictly decrease, represented as an array of its forward-order values, return the values sorted in ascending order. Purely increasing or purely decreasing inputs are valid degenerate bitonic lists.",
      "examples": [
            {
                    "input": "6\n2 5 7 12 10 6",
                    "output": "2 5 6 7 10 12",
                    "explanation": "Increasing part 2 5 7 12, decreasing part 10 6; sorted gives 2 5 6 7 10 12."
                  },
            {
                    "input": "4\n1 3 5 7",
                    "output": "1 3 5 7",
                    "explanation": "Already increasing; sorted output is the same."
                  },
            {
                    "input": "5\n9 7 5 3 1",
                    "output": "1 3 5 7 9",
                    "explanation": "Purely decreasing; sorted gives 1 3 5 7 9."
                  }
          ],
      "constraints": [
            "1 <= n <= 10^4",
            "0 <= value <= 10^5"
          ],
      "io": "array",
      "testCases": [
            {
                    "input": "6\n2 5 7 12 10 6",
                    "expectedOutput": "2 5 6 7 10 12"
                  },
            {
                    "input": "4\n1 3 5 7",
                    "expectedOutput": "1 3 5 7"
                  },
            {
                    "input": "5\n9 7 5 3 1",
                    "expectedOutput": "1 3 5 7 9"
                  },
            {
                    "input": "5\n36 171 489 357 200",
                    "expectedOutput": "36 171 200 357 489"
                  },
            {
                    "input": "5\n96 181 207 280 437",
                    "expectedOutput": "96 181 207 280 437"
                  },
            {
                    "input": "10\n55 163 226 238 268 345 470 475 484 476",
                    "expectedOutput": "55 163 226 238 268 345 470 475 476 484"
                  },
            {
                    "input": "9\n38 43 88 90 101 171 193 311 459",
                    "expectedOutput": "38 43 88 90 101 171 193 311 459"
                  },
            {
                    "input": "5\n15 80 497 338 135",
                    "expectedOutput": "15 80 135 338 497"
                  },
            {
                    "input": "6\n23 28 51 133 347 413",
                    "expectedOutput": "23 28 51 133 347 413"
                  },
            {
                    "input": "7\n157 174 222 475 365 303 295",
                    "expectedOutput": "157 174 222 295 303 365 475"
                  },
            {
                    "input": "11\n4 145 148 497 471 465 424 305 304 202 192",
                    "expectedOutput": "4 145 148 192 202 304 305 424 465 471 497"
                  },
            {
                    "input": "12\n79 99 127 227 231 310 474 471 439 438 430 312",
                    "expectedOutput": "79 99 127 227 231 310 312 430 438 439 471 474"
                  }
          ]
    },
  {
      "id": "flattening-linked-list",
    "hints": ["All child chains are already sorted, so this reduces to merging multiple sorted lists.","Collect every value from the main list and all child chains, then sort them all into one ascending list."],
      "returns": "intArr",
      "title": "Flattening a Linked List",
      "difficulty": "medium",
      "topic": "linked-list",
      "companies": [
            "Amazon",
            "Microsoft"
          ],
      "description": "Each node of the main linked list has a next pointer and a bottom (child) pointer to a sorted sub-list. Flatten the structure by merging every value, from the main list and from all child chains, into one sorted list. Input format: line 1 = 'R C'. Row 0 holds the main list values. Row j+1 holds the child chain of main-list node j. Rows are padded with -1 to length C; -1 means absent and all real values are non-negative. Return all values sorted ascending, space-separated.",
      "examples": [
            {
                    "input": "4 3\n1 2 3\n4 5 -1\n-1 -1 -1\n6 -1 -1",
                    "output": "1 2 3 4 5 6",
                    "explanation": "All values are 1 2 3 4 5 6, already sorted."
                  },
            {
                    "input": "3 2\n5 3\n1 4\n-1 -1",
                    "output": "1 3 4 5",
                    "explanation": "All values are 5 3 1 4; sorted gives 1 3 4 5."
                  },
            {
                    "input": "2 1\n9\n-1",
                    "output": "9",
                    "explanation": "Only one node, output is 9."
                  }
          ],
      "constraints": [
            "1 <= total nodes <= 10^4",
            "0 <= node value <= 10^3"
          ],
      "io": "matrix",
      "testCases": [
            {
                    "input": "4 3\n1 2 3\n4 5 -1\n-1 -1 -1\n6 -1 -1",
                    "expectedOutput": "1 2 3 4 5 6"
                  },
            {
                    "input": "3 2\n5 3\n1 4\n-1 -1",
                    "expectedOutput": "1 3 4 5"
                  },
            {
                    "input": "2 1\n9\n-1",
                    "expectedOutput": "9"
                  },
            {
                    "input": "5 4\n64 43 66 34\n50 33 87 -1\n40 31 36 -1\n20 -1 -1 -1\n20 4 29 -1",
                    "expectedOutput": "4 20 20 29 31 33 34 36 40 43 50 64 66 87"
                  },
            {
                    "input": "6 5\n69 45 80 26 55\n3 70 51 -1 -1\n-1 -1 -1 -1 -1\n-1 -1 -1 -1 -1\n-1 -1 -1 -1 -1\n82 -1 -1 -1 -1",
                    "expectedOutput": "3 26 45 51 55 69 70 80 82"
                  },
            {
                    "input": "5 4\n91 62 48 99\n88 -1 -1 -1\n65 41 -1 -1\n84 87 8 -1\n98 3 -1 -1",
                    "expectedOutput": "3 8 41 48 62 65 84 87 88 91 98 99"
                  },
            {
                    "input": "6 5\n23 18 48 54 22\n38 -1 -1 -1 -1\n-1 -1 -1 -1 -1\n69 42 76 -1 -1\n34 -1 -1 -1 -1\n95 60 35 -1 -1",
                    "expectedOutput": "18 22 23 34 35 38 42 48 54 60 69 76 95"
                  },
            {
                    "input": "4 3\n21 8 56\n56 -1 -1\n96 -1 -1\n-1 -1 -1",
                    "expectedOutput": "8 21 56 56 96"
                  },
            {
                    "input": "4 3\n19 80 71\n18 50 -1\n25 -1 -1\n27 -1 -1",
                    "expectedOutput": "18 19 25 27 50 71 80"
                  },
            {
                    "input": "4 3\n92 86 79\n86 0 66\n24 82 -1\n70 -1 -1",
                    "expectedOutput": "0 24 66 70 79 82 86 86 92"
                  },
            {
                    "input": "2 2\n2 -1\n56 30",
                    "expectedOutput": "2 30 56"
                  },
            {
                    "input": "2 3\n53 -1 -1\n63 53 42",
                    "expectedOutput": "42 53 53 63"
                  }
          ]
    },
  {
      "id": "clone-linked-list-next-random",
    "hints": ["The challenge is wiring the random pointers of the copy to the copied nodes rather than the originals.","Map each original node's index to its clone while building the copy, then set each clone's random pointer using the index recorded in the input."],
      "returns": "string",
      "title": "Clone a Linked List with Next and Random Pointer",
      "difficulty": "medium",
      "topic": "linked-list",
      "companies": [
            "Amazon",
            "Microsoft",
            "Google"
          ],
      "description": "Clone a linked list in which every node has a next pointer and a random pointer. Input format: line 1 = 'n 2', followed by n rows of [value, random_index], where random_index is the 0-based index of the node the random pointer targets (-1 means null). Output the cloned list as space-separated 'value:random_value' pairs, where random_value is the value of the random target (-1 if null).",
      "examples": [
            {
                    "input": "5 2\n7 -1\n13 0\n11 4\n10 2\n1 0",
                    "output": "7:-1 13:7 11:1 10:11 1:7",
                    "explanation": "Random targets resolve to values: 7->null, 13->7, 11->1, 10->11, 1->7."
                  },
            {
                    "input": "2 2\n1 1\n2 1",
                    "output": "1:2 2:2",
                    "explanation": "Both random pointers target the node with value 2."
                  },
            {
                    "input": "1 2\n3 -1",
                    "output": "3:-1",
                    "explanation": "Single node with a null random pointer."
                  }
          ],
      "constraints": [
            "0 <= n <= 100",
            "-10^4 <= value <= 10^4",
            "-1 <= random_index < n"
          ],
      "io": "matrix",
      "testCases": [
            {
                    "input": "5 2\n7 -1\n13 0\n11 4\n10 2\n1 0",
                    "expectedOutput": "7:-1 13:7 11:1 10:11 1:7"
                  },
            {
                    "input": "2 2\n1 1\n2 1",
                    "expectedOutput": "1:2 2:2"
                  },
            {
                    "input": "1 2\n3 -1",
                    "expectedOutput": "3:-1"
                  },
            {
                    "input": "4 2\n49 3\n50 3\n50 3\n32 1",
                    "expectedOutput": "49:32 50:32 50:32 32:50"
                  },
            {
                    "input": "8 2\n38 -1\n2 3\n45 0\n29 2\n26 5\n14 -1\n28 5\n8 5",
                    "expectedOutput": "38:-1 2:29 45:38 29:45 26:14 14:-1 28:14 8:14"
                  },
            {
                    "input": "3 2\n12 -1\n47 1\n11 0",
                    "expectedOutput": "12:-1 47:47 11:12"
                  },
            {
                    "input": "2 2\n33 0\n3 -1",
                    "expectedOutput": "33:33 3:-1"
                  },
            {
                    "input": "5 2\n44 3\n2 1\n33 -1\n18 4\n34 -1",
                    "expectedOutput": "44:18 2:2 33:-1 18:34 34:-1"
                  },
            {
                    "input": "1 2\n27 0",
                    "expectedOutput": "27:27"
                  },
            {
                    "input": "1 2\n46 0",
                    "expectedOutput": "46:46"
                  },
            {
                    "input": "3 2\n15 2\n37 -1\n19 0",
                    "expectedOutput": "15:19 37:-1 19:15"
                  },
            {
                    "input": "8 2\n30 1\n17 1\n27 3\n34 -1\n19 4\n41 2\n12 -1\n42 3",
                    "expectedOutput": "30:17 17:17 27:34 34:-1 19:19 41:27 12:-1 42:34"
                  }
          ]
    },
  {
      "id": "implement-two-stacks-in-array",
    "hints": ["Let the two stacks grow toward each other from opposite ends of the array.","Keep top1 starting at -1 growing right and top2 starting at size growing left; overflow occurs when top1 + 1 == top2."],
      "returns": "string",
      "title": "Implement Two Stacks in an Array",
      "difficulty": "easy",
      "topic": "stack",
      "companies": [
            "Amazon",
            "Microsoft"
          ],
      "description": "Implement two stacks inside a single array of fixed size: stack 1 grows from the left end and stack 2 grows from the right end. Input: line 1 = number of following lines, line 2 = array size, then one operation per line: 'push1 x' pushes x onto stack 1, 'pop1' pops stack 1, 'push2 x' pushes x onto stack 2, 'pop2' pops stack 2. A push prints 'null' on success and '-1' on overflow; a pop prints the popped value or '-1' if that stack is empty. Print each result on its own line.",
      "examples": [
            {
                    "input": "7\n5\npush1 2\npush1 3\npush2 4\npop1\npop2\npop1",
                    "output": "null\nnull\nnull\n3\n4\n2",
                    "explanation": "push1 2 -> null, push1 3 -> null, push2 4 -> null, pop1 -> 3, pop2 -> 4, pop1 -> 2."
                  },
            {
                    "input": "4\n2\npush1 1\npush2 2\npush1 3",
                    "output": "null\nnull\n-1",
                    "explanation": "The third push overflows the shared array, so it prints -1."
                  },
            {
                    "input": "3\n3\npop1\npop2",
                    "output": "-1\n-1",
                    "explanation": "Both stacks are empty, so both pops print -1."
                  }
          ],
      "constraints": [
            "1 <= size <= 100",
            "1 <= operations <= 100",
            "1 <= x <= 10^4"
          ],
      "io": "string-array",
      "testCases": [
            {
                    "input": "7\n5\npush1 2\npush1 3\npush2 4\npop1\npop2\npop1",
                    "expectedOutput": "null\nnull\nnull\n3\n4\n2"
                  },
            {
                    "input": "4\n2\npush1 1\npush2 2\npush1 3",
                    "expectedOutput": "null\nnull\n-1"
                  },
            {
                    "input": "3\n3\npop1\npop2",
                    "expectedOutput": "-1\n-1"
                  },
            {
                    "input": "10\n8\npop2\npush1 55\npush2 56\npop1\npop1\npush1 11\npop2\npop1\npush1 85",
                    "expectedOutput": "-1\nnull\nnull\n55\n-1\nnull\n56\n11\nnull"
                  },
            {
                    "input": "8\n6\npush2 52\npush1 72\npop1\npush2 84\npush1 51\npush1 41\npush2 82",
                    "expectedOutput": "null\nnull\n72\nnull\nnull\nnull\nnull"
                  },
            {
                    "input": "10\n3\npop1\npop2\npop1\npush1 9\npop2\npush1 46\npush1 76\npush2 14\npop2",
                    "expectedOutput": "-1\n-1\n-1\nnull\n-1\nnull\nnull\n-1\n-1"
                  },
            {
                    "input": "9\n8\npush2 74\npush1 35\npop2\npop1\npush1 85\npop1\npop1\npush2 12",
                    "expectedOutput": "null\nnull\n74\n35\nnull\n85\n-1\nnull"
                  },
            {
                    "input": "11\n7\npush2 13\npop1\npush1 9\npush1 4\npop1\npop1\npop2\npush1 51\npop2\npush1 28",
                    "expectedOutput": "null\n-1\nnull\nnull\n4\n9\n13\nnull\n-1\nnull"
                  },
            {
                    "input": "7\n3\npop1\npop1\npop2\npop1\npush1 4\npush2 18",
                    "expectedOutput": "-1\n-1\n-1\n-1\nnull\nnull"
                  },
            {
                    "input": "7\n6\npush2 13\npush1 35\npush2 5\npop1\npop2\npush1 65",
                    "expectedOutput": "null\nnull\nnull\n35\n5\nnull"
                  },
            {
                    "input": "10\n6\npop1\npush1 54\npop1\npush2 70\npush2 80\npush2 91\npop2\npush2 81\npop2",
                    "expectedOutput": "-1\nnull\n54\nnull\nnull\nnull\n91\nnull\n81"
                  },
            {
                    "input": "8\n8\npush2 49\npop2\npop2\npop1\npop1\npop1\npush2 46",
                    "expectedOutput": "null\n49\n-1\n-1\n-1\n-1\nnull"
                  }
          ]
    },
  {
      "id": "implement-stack-using-queues",
    "hints": ["A queue is FIFO, so to pop the most recent element you must rotate everything else out of the way.","On push, enqueue the new element then rotate the existing elements behind it, so the newest element is always at the front for O(1) pop."],
      "returns": "string",
      "title": "Implement Stack using Queues",
      "difficulty": "easy",
      "topic": "stack",
      "companies": [
            "Amazon",
            "Microsoft"
          ],
      "description": "Implement a LIFO stack using only queues. Input: line 1 = number of following lines, then one operation per line: 'push x' pushes x, 'pop' removes and returns the top, 'top' returns the top without removing, 'empty' checks emptiness. push prints 'null'; pop and top print the value or '-1' if the stack is empty; empty prints 'true' or 'false'. Print each result on its own line.",
      "examples": [
            {
                    "input": "5\npush 1\npush 2\ntop\npop\nempty",
                    "output": "null\nnull\n2\n2\nfalse",
                    "explanation": "Stack is [1, 2]: top -> 2, pop -> 2, then one element remains so empty -> false."
                  },
            {
                    "input": "3\npop\ntop\nempty",
                    "output": "-1\n-1\ntrue",
                    "explanation": "Empty stack: pop -> -1, top -> -1, empty -> true."
                  },
            {
                    "input": "4\npush 5\npop\npop\nempty",
                    "output": "null\n5\n-1\ntrue",
                    "explanation": "push 5 -> null, pop -> 5, pop -> -1, empty -> true."
                  }
          ],
      "constraints": [
            "1 <= operations <= 100",
            "1 <= x <= 10^4"
          ],
      "io": "string-array",
      "testCases": [
            {
                    "input": "5\npush 1\npush 2\ntop\npop\nempty",
                    "expectedOutput": "null\nnull\n2\n2\nfalse"
                  },
            {
                    "input": "3\npop\ntop\nempty",
                    "expectedOutput": "-1\n-1\ntrue"
                  },
            {
                    "input": "4\npush 5\npop\npop\nempty",
                    "expectedOutput": "null\n5\n-1\ntrue"
                  },
            {
                    "input": "5\ntop\ntop\npop\ntop\npop",
                    "expectedOutput": "-1\n-1\n-1\n-1\n-1"
                  },
            {
                    "input": "5\nempty\npush 34\nempty\ntop\npush 45",
                    "expectedOutput": "true\nnull\nfalse\n34\nnull"
                  },
            {
                    "input": "3\npush 26\ntop\npop",
                    "expectedOutput": "null\n26\n26"
                  },
            {
                    "input": "10\nempty\ntop\ntop\nempty\nempty\ntop\nempty\npush 78\ntop\ntop",
                    "expectedOutput": "true\n-1\n-1\ntrue\ntrue\n-1\ntrue\nnull\n78\n78"
                  },
            {
                    "input": "6\ntop\npush 52\ntop\ntop\nempty\ntop",
                    "expectedOutput": "-1\nnull\n52\n52\nfalse\n52"
                  },
            {
                    "input": "9\nempty\ntop\ntop\npop\nempty\ntop\npop\npop\npush 49",
                    "expectedOutput": "true\n-1\n-1\n-1\ntrue\n-1\n-1\n-1\nnull"
                  },
            {
                    "input": "10\npop\npop\nempty\ntop\ntop\nempty\ntop\npop\ntop\nempty",
                    "expectedOutput": "-1\n-1\ntrue\n-1\n-1\ntrue\n-1\n-1\n-1\ntrue"
                  },
            {
                    "input": "8\npush 81\npop\ntop\npop\nempty\nempty\ntop\ntop",
                    "expectedOutput": "null\n81\n-1\n-1\ntrue\ntrue\n-1\n-1"
                  },
            {
                    "input": "10\npush 22\nempty\nempty\npush 8\ntop\npop\nempty\npop\nempty\npush 25",
                    "expectedOutput": "null\nfalse\nfalse\nnull\n8\n8\nfalse\n22\ntrue\nnull"
                  }
          ]
    },
  {
      "id": "implement-queue-using-deque",
    "hints": ["A deque supports insertion and removal at both ends, so map queue operations to the right ends.","Enqueue at the rear of the deque and dequeue from the front to get FIFO behavior."],
      "returns": "string",
      "title": "Implement Queue using Deque",
      "difficulty": "easy",
      "topic": "queue",
      "companies": [
            "Amazon",
            "Microsoft",
            "Flipkart"
          ],
      "description": "Implement a FIFO queue using a deque. Input: line 1 = number of following lines, then one operation per line: 'enqueue x' adds x to the rear, 'dequeue' removes and returns the front, 'front' returns the front without removing. enqueue prints 'null'; dequeue and front print the value or '-1' if the queue is empty. Print each result on its own line.",
      "examples": [
            {
                    "input": "5\nenqueue 1\nenqueue 2\nfront\ndequeue\ndequeue",
                    "output": "null\nnull\n1\n1\n2",
                    "explanation": "front -> 1, dequeue -> 1, dequeue -> 2."
                  },
            {
                    "input": "3\ndequeue\nfront\nenqueue 7",
                    "output": "-1\n-1\nnull",
                    "explanation": "Empty queue: dequeue -> -1, front -> -1, enqueue 7 -> null."
                  },
            {
                    "input": "4\nenqueue 3\ndequeue\ndequeue\nfront",
                    "output": "null\n3\n-1\n-1",
                    "explanation": "dequeue -> 3, then the queue is empty: dequeue -> -1, front -> -1."
                  }
          ],
      "constraints": [
            "1 <= operations <= 100",
            "1 <= x <= 10^4"
          ],
      "io": "string-array",
      "testCases": [
            {
                    "input": "5\nenqueue 1\nenqueue 2\nfront\ndequeue\ndequeue",
                    "expectedOutput": "null\nnull\n1\n1\n2"
                  },
            {
                    "input": "3\ndequeue\nfront\nenqueue 7",
                    "expectedOutput": "-1\n-1\nnull"
                  },
            {
                    "input": "4\nenqueue 3\ndequeue\ndequeue\nfront",
                    "expectedOutput": "null\n3\n-1\n-1"
                  },
            {
                    "input": "5\ndequeue\ndequeue\ndequeue\nenqueue 75\nfront",
                    "expectedOutput": "-1\n-1\n-1\nnull\n75"
                  },
            {
                    "input": "9\ndequeue\nenqueue 31\nfront\nfront\ndequeue\ndequeue\nenqueue 21\nfront\nenqueue 15",
                    "expectedOutput": "-1\nnull\n31\n31\n31\n-1\nnull\n21\nnull"
                  },
            {
                    "input": "4\nenqueue 17\nenqueue 61\ndequeue\nenqueue 72",
                    "expectedOutput": "null\nnull\n17\nnull"
                  },
            {
                    "input": "3\nenqueue 27\nenqueue 41\ndequeue",
                    "expectedOutput": "null\nnull\n27"
                  },
            {
                    "input": "7\nfront\nfront\ndequeue\nfront\ndequeue\nfront\ndequeue",
                    "expectedOutput": "-1\n-1\n-1\n-1\n-1\n-1\n-1"
                  },
            {
                    "input": "10\nenqueue 9\ndequeue\nenqueue 27\nfront\ndequeue\nfront\nfront\ndequeue\nfront\ndequeue",
                    "expectedOutput": "null\n9\nnull\n27\n27\n-1\n-1\n-1\n-1\n-1"
                  },
            {
                    "input": "10\nfront\ndequeue\ndequeue\nfront\nenqueue 24\ndequeue\nfront\nenqueue 6\ndequeue\nfront",
                    "expectedOutput": "-1\n-1\n-1\n-1\nnull\n24\n-1\nnull\n6\n-1"
                  },
            {
                    "input": "8\nfront\ndequeue\ndequeue\nenqueue 56\nenqueue 98\nfront\ndequeue\nfront",
                    "expectedOutput": "-1\n-1\n-1\nnull\nnull\n56\n56\n98"
                  },
            {
                    "input": "9\nfront\nenqueue 91\ndequeue\nenqueue 51\ndequeue\ndequeue\nenqueue 49\nenqueue 53\nenqueue 81",
                    "expectedOutput": "-1\nnull\n91\nnull\n51\n-1\nnull\nnull\nnull"
                  }
          ]
    },
  {
      "id": "design-stack-with-middle-operation",
    "hints": ["O(1) middle access requires a structure that can jump to the center, like a doubly linked list.","Use a doubly linked list with a mid pointer; on push/pop adjust mid based on whether the size is odd or even."],
      "returns": "string",
      "title": "Design Stack with Middle Operation",
      "difficulty": "medium",
      "topic": "stack",
      "companies": [
            "Amazon",
            "Microsoft",
            "Adobe"
          ],
      "description": "Design a stack that supports push, pop, findMiddle and deleteMiddle, each in O(1) time. The middle element is defined as the element at index floor(size/2) from the bottom (0-indexed). Input: line 1 = number of following lines, then one operation per line: 'push x' (prints null), 'pop' (prints the popped value or -1), 'findMiddle' (prints the middle value or -1), 'deleteMiddle' (removes and prints the middle value or -1). Print each result on its own line.",
      "examples": [
            {
                    "input": "7\npush 1\npush 2\npush 3\nfindMiddle\npush 4\ndeleteMiddle\nfindMiddle",
                    "output": "null\nnull\nnull\n2\nnull\n3\n2",
                    "explanation": "Stack [1,2,3]: middle is 2. After pushing 4, stack [1,2,3,4]: deleted middle is 3. Stack [1,2,4]: middle is 2."
                  },
            {
                    "input": "3\nfindMiddle\ndeleteMiddle\npop",
                    "output": "-1\n-1\n-1",
                    "explanation": "Empty stack: all three print -1."
                  },
            {
                    "input": "5\npush 10\npush 20\ndeleteMiddle\nfindMiddle\npop",
                    "output": "null\nnull\n20\n10\n10",
                    "explanation": "Stack [10,20]: deleted middle is 20, remaining middle is 10, pop returns 10."
                  }
          ],
      "constraints": [
            "1 <= operations <= 100",
            "1 <= x <= 10^4"
          ],
      "io": "string-array",
      "testCases": [
            {
                    "input": "7\npush 1\npush 2\npush 3\nfindMiddle\npush 4\ndeleteMiddle\nfindMiddle",
                    "expectedOutput": "null\nnull\nnull\n2\nnull\n3\n2"
                  },
            {
                    "input": "3\nfindMiddle\ndeleteMiddle\npop",
                    "expectedOutput": "-1\n-1\n-1"
                  },
            {
                    "input": "5\npush 10\npush 20\ndeleteMiddle\nfindMiddle\npop",
                    "expectedOutput": "null\nnull\n20\n10\n10"
                  },
            {
                    "input": "6\npush 75\npush 67\nfindMiddle\nfindMiddle\ndeleteMiddle\npush 84",
                    "expectedOutput": "null\nnull\n67\n67\n67\nnull"
                  },
            {
                    "input": "3\npush 88\npush 80\npop",
                    "expectedOutput": "null\nnull\n80"
                  },
            {
                    "input": "4\ndeleteMiddle\nfindMiddle\npop\nfindMiddle",
                    "expectedOutput": "-1\n-1\n-1\n-1"
                  },
            {
                    "input": "7\npush 10\nfindMiddle\nfindMiddle\nfindMiddle\ndeleteMiddle\ndeleteMiddle\npush 59",
                    "expectedOutput": "null\n10\n10\n10\n10\n-1\nnull"
                  },
            {
                    "input": "9\nfindMiddle\npop\npop\npop\nfindMiddle\npush 84\ndeleteMiddle\npush 60\npush 35",
                    "expectedOutput": "-1\n-1\n-1\n-1\n-1\nnull\n84\nnull\nnull"
                  },
            {
                    "input": "9\npush 75\npush 77\ndeleteMiddle\ndeleteMiddle\npop\npush 58\npop\npush 30\npush 34",
                    "expectedOutput": "null\nnull\n77\n75\n-1\nnull\n58\nnull\nnull"
                  },
            {
                    "input": "3\npop\ndeleteMiddle\ndeleteMiddle",
                    "expectedOutput": "-1\n-1\n-1"
                  },
            {
                    "input": "3\npop\npop\npush 44",
                    "expectedOutput": "-1\n-1\nnull"
                  },
            {
                    "input": "4\npush 12\npush 58\npush 26\ndeleteMiddle",
                    "expectedOutput": "null\nnull\nnull\n58"
                  }
          ]
    },
  {
      "id": "special-stack",
    "hints": ["The trick is tracking the minimum at every stack depth, not just globally.","Maintain an auxiliary min-stack in parallel: push the current minimum onto it with every push, and pop it with every pop."],
      "returns": "string",
      "title": "Design and Implement Special Stack",
      "difficulty": "easy",
      "topic": "stack",
      "companies": [
            "Amazon",
            "Microsoft"
          ],
      "description": "Design a stack that supports push, pop and getMin, where getMin returns the minimum element in O(1) time. Input: line 1 = number of following lines, then one operation per line: 'push x' (prints null), 'pop' (prints the popped value or -1 if empty), 'getMin' (prints the current minimum or -1 if empty). Print each result on its own line.",
      "examples": [
            {
                    "input": "7\npush 3\npush 5\ngetMin\npush 2\ngetMin\npop\ngetMin",
                    "output": "null\nnull\n3\nnull\n2\n2\n3",
                    "explanation": "Minima: 3, then 3, then 2; pop removes 2 and the minimum becomes 3 again."
                  },
            {
                    "input": "4\npush 8\ngetMin\npop\ngetMin",
                    "output": "null\n8\n8\n-1",
                    "explanation": "getMin -> 8, pop -> 8, then empty so getMin -> -1."
                  },
            {
                    "input": "5\npush 5\npush 1\npush 4\ngetMin\npop",
                    "output": "null\nnull\nnull\n1\n4",
                    "explanation": "getMin -> 1, pop -> 4."
                  }
          ],
      "constraints": [
            "1 <= operations <= 100",
            "-10^4 <= x <= 10^4"
          ],
      "io": "string-array",
      "testCases": [
            {
                    "input": "7\npush 3\npush 5\ngetMin\npush 2\ngetMin\npop\ngetMin",
                    "expectedOutput": "null\nnull\n3\nnull\n2\n2\n3"
                  },
            {
                    "input": "4\npush 8\ngetMin\npop\ngetMin",
                    "expectedOutput": "null\n8\n8\n-1"
                  },
            {
                    "input": "5\npush 5\npush 1\npush 4\ngetMin\npop",
                    "expectedOutput": "null\nnull\nnull\n1\n4"
                  },
            {
                    "input": "9\npush 94\npop\ngetMin\ngetMin\npop\npush 8\npop\ngetMin\npop",
                    "expectedOutput": "null\n94\n-1\n-1\n-1\nnull\n8\n-1\n-1"
                  },
            {
                    "input": "10\ngetMin\npush 57\ngetMin\ngetMin\npop\ngetMin\ngetMin\npop\ngetMin\ngetMin",
                    "expectedOutput": "-1\nnull\n57\n57\n57\n-1\n-1\n-1\n-1\n-1"
                  },
            {
                    "input": "8\ngetMin\ngetMin\npop\npop\npush 66\npop\npop\npop",
                    "expectedOutput": "-1\n-1\n-1\n-1\nnull\n66\n-1\n-1"
                  },
            {
                    "input": "10\npop\npush 19\npush 14\npop\npop\npop\npop\ngetMin\ngetMin\ngetMin",
                    "expectedOutput": "-1\nnull\nnull\n14\n19\n-1\n-1\n-1\n-1\n-1"
                  },
            {
                    "input": "7\npop\npush 72\ngetMin\ngetMin\npush 62\ngetMin\npop",
                    "expectedOutput": "-1\nnull\n72\n72\nnull\n62\n62"
                  },
            {
                    "input": "10\ngetMin\npush 70\npush 32\npush 27\npush 13\npop\npop\npop\ngetMin\npop",
                    "expectedOutput": "-1\nnull\nnull\nnull\nnull\n13\n27\n32\n70\n70"
                  },
            {
                    "input": "4\npop\ngetMin\ngetMin\npush 77",
                    "expectedOutput": "-1\n-1\n-1\nnull"
                  },
            {
                    "input": "5\ngetMin\npop\npop\npop\ngetMin",
                    "expectedOutput": "-1\n-1\n-1\n-1\n-1"
                  },
            {
                    "input": "10\npush 68\npop\npush 55\npush 26\npush 84\npop\npush 34\ngetMin\ngetMin\npop",
                    "expectedOutput": "null\n68\nnull\nnull\nnull\n84\nnull\n26\n26\n34"
                  }
          ]
    },
  {
      "id": "stack-permutation-check",
    "hints": ["Simulate the actual process: push input elements and pop whenever the top matches the next needed target element.","Walk through the input pushing each element, then greedily pop while the stack top equals the next target; success means every target element was matched."],
      "returns": "bool",
      "title": "Stack Permutations Check",
      "difficulty": "medium",
      "topic": "stack",
      "companies": [
            "Amazon",
            "Adobe"
          ],
      "description": "Given an input sequence and a target sequence, check whether the target is a stack permutation of the input: elements of the input are pushed onto a stack in order, and may be popped at any time; the popped order must equal the target sequence. Input: line 1 = '2 L'; row 0 = input sequence, row 1 = target sequence. Return true if the target is achievable, otherwise false.",
      "examples": [
            {
                    "input": "2 3\n1 2 3\n2 1 3",
                    "output": "true",
                    "explanation": "Push 1, push 2, pop 2, pop 1, push 3, pop 3 gives 2 1 3."
                  },
            {
                    "input": "2 3\n1 2 3\n3 1 2",
                    "output": "false",
                    "explanation": "3 1 2 cannot be produced by a stack from 1 2 3."
                  },
            {
                    "input": "2 4\n1 2 3 4\n2 3 4 1",
                    "output": "true",
                    "explanation": "Pop each element right after the next one is pushed, leaving 1 for last."
                  }
          ],
      "constraints": [
            "1 <= L <= 100",
            "0 <= value <= 10^4"
          ],
      "io": "matrix",
      "testCases": [
            {
                    "input": "2 3\n1 2 3\n2 1 3",
                    "expectedOutput": "true"
                  },
            {
                    "input": "2 3\n1 2 3\n3 1 2",
                    "expectedOutput": "false"
                  },
            {
                    "input": "2 4\n1 2 3 4\n2 3 4 1",
                    "expectedOutput": "true"
                  },
            {
                    "input": "2 6\n53 59 11 19 32 50\n11 59 19 50 32 53",
                    "expectedOutput": "true"
                  },
            {
                    "input": "2 5\n7 30 38 8 32\n7 30 38 32 8",
                    "expectedOutput": "true"
                  },
            {
                    "input": "2 4\n5 27 15 3\n27 5 3 15",
                    "expectedOutput": "true"
                  },
            {
                    "input": "2 5\n17 32 45 34 21\n45 17 34 21 32",
                    "expectedOutput": "false"
                  },
            {
                    "input": "2 5\n54 8 6 59 50\n59 50 6 54 8",
                    "expectedOutput": "false"
                  },
            {
                    "input": "2 4\n16 26 58 50\n50 16 58 26",
                    "expectedOutput": "false"
                  },
            {
                    "input": "2 3\n9 16 8\n16 9 8",
                    "expectedOutput": "true"
                  },
            {
                    "input": "2 4\n18 34 14 9\n9 34 14 18",
                    "expectedOutput": "false"
                  },
            {
                    "input": "2 5\n21 47 29 41 16\n21 41 29 16 47",
                    "expectedOutput": "true"
                  }
          ]
    },
  {
      "id": "count-natural-numbers-permutation-greater",
    "hints": ["A number qualifies only if some rearrangement of its digits exceeds the number itself.","A number has a greater permutation exactly when its digits are not in non-increasing order from left to right; count numbers from 1 to n that fail this check."],
      "returns": "int",
      "title": "Count Natural Numbers Whose Permutation Is Greater",
      "difficulty": "medium",
      "topic": "stack",
      "companies": [
            "Amazon",
            "Adobe"
          ],
      "description": "Count the natural numbers from 1 to n (inclusive) that have at least one permutation of their digits strictly greater than the number itself. For example 12 qualifies because 21 > 12, but 21 does not qualify because its permutations are 21 and 12, neither greater than 21.",
      "examples": [
            {
                    "input": "10",
                    "output": "0",
                    "explanation": "No number from 1 to 10 has a greater digit permutation."
                  },
            {
                    "input": "13",
                    "output": "2",
                    "explanation": "12 and 13 qualify (21 > 12, 31 > 13)."
                  },
            {
                    "input": "20",
                    "output": "8",
                    "explanation": "The numbers 12 through 19 qualify: 8 numbers."
                  }
          ],
      "constraints": [
            "1 <= n <= 10^4",
            "A permutation with leading zeros is read as the shorter number (e.g. 102 -> 012 = 12)"
          ],
      "io": "int",
      "testCases": [
            {
                    "input": "10",
                    "expectedOutput": "0"
                  },
            {
                    "input": "13",
                    "expectedOutput": "2"
                  },
            {
                    "input": "20",
                    "expectedOutput": "8"
                  },
            {
                    "input": "253",
                    "expectedOutput": "181"
                  },
            {
                    "input": "69",
                    "expectedOutput": "33"
                  },
            {
                    "input": "323",
                    "expectedOutput": "245"
                  },
            {
                    "input": "163",
                    "expectedOutput": "97"
                  },
            {
                    "input": "87",
                    "expectedOutput": "35"
                  },
            {
                    "input": "71",
                    "expectedOutput": "33"
                  },
            {
                    "input": "253",
                    "expectedOutput": "181"
                  },
            {
                    "input": "413",
                    "expectedOutput": "328"
                  },
            {
                    "input": "232",
                    "expectedOutput": "160"
                  }
          ]
    },
  {
      "id": "the-celebrity-problem",
    "hints": ["The celebrity is known by everyone and knows nobody, which lets you eliminate candidates quickly.","Use the two-pointer elimination: compare candidates pairwise and discard the one that knows the other, then verify the single survivor against everyone."],
      "returns": "int",
      "title": "The Celebrity Problem",
      "difficulty": "medium",
      "topic": "stack",
      "companies": [
            "Amazon",
            "Microsoft",
            "Flipkart"
          ],
      "description": "In a party of n people, the celebrity is known by everyone but knows nobody. Input: an n x n matrix where matrix[i][j] = 1 means person i knows person j and 0 means not. Return the 0-based index of the celebrity, or -1 if no such person exists.",
      "examples": [
            {
                    "input": "3 3\n0 1 0\n0 0 0\n0 1 0",
                    "output": "1",
                    "explanation": "Everyone knows person 1 and person 1 knows nobody."
                  },
            {
                    "input": "2 2\n0 1\n1 0",
                    "output": "-1",
                    "explanation": "Each person knows the other, so there is no celebrity."
                  },
            {
                    "input": "1 1\n0",
                    "output": "0",
                    "explanation": "The only person is trivially the celebrity."
                  }
          ],
      "constraints": [
            "1 <= n <= 100",
            "matrix[i][j] is 0 or 1"
          ],
      "io": "matrix",
      "testCases": [
            {
                    "input": "3 3\n0 1 0\n0 0 0\n0 1 0",
                    "expectedOutput": "1"
                  },
            {
                    "input": "2 2\n0 1\n1 0",
                    "expectedOutput": "-1"
                  },
            {
                    "input": "1 1\n0",
                    "expectedOutput": "0"
                  },
            {
                    "input": "3 3\n0 0 1\n0 0 1\n0 0 0",
                    "expectedOutput": "2"
                  },
            {
                    "input": "5 5\n0 0 1 1 1\n1 0 0 1 1\n0 0 0 1 1\n1 1 1 0 1\n1 0 0 1 0",
                    "expectedOutput": "-1"
                  },
            {
                    "input": "1 1\n0",
                    "expectedOutput": "0"
                  },
            {
                    "input": "1 1\n0",
                    "expectedOutput": "0"
                  },
            {
                    "input": "2 2\n0 1\n0 0",
                    "expectedOutput": "1"
                  },
            {
                    "input": "5 5\n0 1 1 0 1\n0 0 0 0 0\n1 1 0 0 1\n0 1 0 0 0\n1 1 0 0 0",
                    "expectedOutput": "1"
                  },
            {
                    "input": "2 2\n0 1\n0 0",
                    "expectedOutput": "1"
                  },
            {
                    "input": "3 3\n0 1 1\n0 0 1\n0 0 0",
                    "expectedOutput": "2"
                  },
            {
                    "input": "4 4\n0 1 1 0\n1 0 1 0\n0 1 0 0\n1 1 1 0",
                    "expectedOutput": "-1"
                  }
          ]
    },
  {
      "id": "distance-of-nearest-cell",
    "hints": ["This is a shortest-path problem on a grid where every edge has the same cost.","Run multi-source BFS starting from all cells containing 1 simultaneously; the distance at which each cell is first visited is its answer."],
      "returns": "intMat",
      "title": "Distance of Nearest Cell Having 1",
      "difficulty": "medium",
      "topic": "queue",
      "companies": [
            "Amazon",
            "Google"
          ],
      "description": "Given a binary matrix, compute for every cell the shortest 4-directional distance to a cell containing 1. A cell that cannot reach any 1 gets distance -1. Return the distance matrix with the same dimensions.",
      "examples": [
            {
                    "input": "3 3\n0 0 0\n0 1 0\n1 0 0",
                    "output": "2 1 2\n1 0 1\n0 1 2",
                    "explanation": "Distances spread outward from the two 1 cells."
                  },
            {
                    "input": "1 1\n1",
                    "output": "0",
                    "explanation": "The single cell is already 1, so its distance is 0."
                  },
            {
                    "input": "2 2\n0 1\n1 1",
                    "output": "1 0\n0 0",
                    "explanation": "Each 0 cell is adjacent to a 1."
                  }
          ],
      "constraints": [
            "1 <= rows, cols <= 100",
            "matrix[i][j] is 0 or 1"
          ],
      "io": "matrix",
      "testCases": [
            {
                    "input": "3 3\n0 0 0\n0 1 0\n1 0 0",
                    "expectedOutput": "2 1 2\n1 0 1\n0 1 2"
                  },
            {
                    "input": "1 1\n1",
                    "expectedOutput": "0"
                  },
            {
                    "input": "2 2\n0 1\n1 1",
                    "expectedOutput": "1 0\n0 0"
                  },
            {
                    "input": "2 4\n1 1 1 0\n1 1 1 0",
                    "expectedOutput": "0 0 0 1\n0 0 0 1"
                  },
            {
                    "input": "3 4\n1 1 0 1\n0 1 1 1\n0 0 0 1",
                    "expectedOutput": "0 0 1 0\n1 0 0 0\n2 1 1 0"
                  },
            {
                    "input": "3 3\n0 1 1\n1 0 1\n0 0 1",
                    "expectedOutput": "1 0 0\n0 1 0\n1 1 0"
                  },
            {
                    "input": "1 3\n0 0 1",
                    "expectedOutput": "2 1 0"
                  },
            {
                    "input": "3 4\n0 0 1 1\n1 1 1 1\n0 0 1 0",
                    "expectedOutput": "1 1 0 0\n0 0 0 0\n1 1 0 1"
                  },
            {
                    "input": "3 4\n1 1 1 1\n1 1 0 1\n0 0 0 0",
                    "expectedOutput": "0 0 0 0\n0 0 1 0\n1 1 2 1"
                  },
            {
                    "input": "1 3\n1 0 0",
                    "expectedOutput": "0 1 2"
                  },
            {
                    "input": "3 4\n1 1 1 0\n0 0 1 1\n1 1 1 0",
                    "expectedOutput": "0 0 0 1\n1 1 0 0\n0 0 0 1"
                  },
            {
                    "input": "4 2\n0 1\n1 0\n1 0\n1 0",
                    "expectedOutput": "1 0\n0 1\n0 1\n0 1"
                  }
          ]
    },
  {
      "id": "rotten-oranges",
    "hints": ["Think of rot spreading in waves, one layer per minute, from all initially rotten oranges.","Use multi-source BFS from all rotten oranges, tracking minutes elapsed; if any fresh orange remains unvisited, return -1."],
      "returns": "int",
      "title": "Rotten Oranges",
      "difficulty": "medium",
      "topic": "queue",
      "companies": [
            "Amazon",
            "Microsoft"
          ],
      "description": "In a grid, 0 = empty cell, 1 = fresh orange, 2 = rotten orange. Every minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten. Return the minimum number of minutes until no fresh orange remains, or -1 if that is impossible.",
      "examples": [
            {
                    "input": "3 3\n0 1 2\n0 1 2\n2 1 1",
                    "output": "1",
                    "explanation": "All fresh oranges rot within 1 minute."
                  },
            {
                    "input": "3 3\n2 1 1\n1 1 0\n0 1 1",
                    "output": "4",
                    "explanation": "It takes 4 minutes for the rot to reach every orange."
                  },
            {
                    "input": "3 3\n2 1 1\n0 1 1\n1 0 1",
                    "output": "-1",
                    "explanation": "The bottom-left fresh orange can never rot, so the answer is -1."
                  }
          ],
      "constraints": [
            "1 <= rows, cols <= 50",
            "matrix[i][j] is 0, 1 or 2"
          ],
      "io": "matrix",
      "testCases": [
            {
                    "input": "3 3\n0 1 2\n0 1 2\n2 1 1",
                    "expectedOutput": "1"
                  },
            {
                    "input": "3 3\n2 1 1\n1 1 0\n0 1 1",
                    "expectedOutput": "4"
                  },
            {
                    "input": "3 3\n2 1 1\n0 1 1\n1 0 1",
                    "expectedOutput": "-1"
                  },
            {
                    "input": "4 3\n1 0 2\n2 0 0\n1 1 0\n1 1 1",
                    "expectedOutput": "4"
                  },
            {
                    "input": "1 4\n1 2 1 2",
                    "expectedOutput": "1"
                  },
            {
                    "input": "4 3\n0 2 2\n1 0 2\n0 2 1\n0 1 1",
                    "expectedOutput": "-1"
                  },
            {
                    "input": "4 2\n2 1\n0 1\n1 1\n1 1",
                    "expectedOutput": "5"
                  },
            {
                    "input": "3 3\n1 1 1\n0 1 0\n1 1 0",
                    "expectedOutput": "-1"
                  },
            {
                    "input": "1 1\n1",
                    "expectedOutput": "-1"
                  },
            {
                    "input": "2 2\n0 0\n2 2",
                    "expectedOutput": "0"
                  },
            {
                    "input": "3 3\n1 2 1\n2 1 1\n1 2 1",
                    "expectedOutput": "2"
                  },
            {
                    "input": "1 4\n1 0 1 2",
                    "expectedOutput": "-1"
                  }
          ]
    },
  {
      "id": "circular-tour",
    "hints": ["A brute-force try of every start is too slow; think about what a failed attempt tells you.","Use the greedy gas-station approach: track total surplus and current surplus; when current surplus goes negative, reset the start to the next pump."],
      "returns": "int",
      "title": "Circular Tour",
      "difficulty": "medium",
      "topic": "queue",
      "companies": [
            "Amazon",
            "Microsoft"
          ],
      "description": "There are n petrol pumps arranged in a circle. Each input row is [petrol_i, distance_i]: petrol_i units available at pump i and distance_i units needed to reach pump i+1. A truck with an empty tank and unlimited capacity starts at some pump. Return the 0-based index of a starting pump from which the truck can complete the full circle, or -1 if impossible. This also covers the sheet row 'Find a tour that visits all stations'.",
      "examples": [
            {
                    "input": "4 2\n4 6\n6 5\n7 3\n4 5",
                    "output": "1",
                    "explanation": "Starting at pump 1, the truck completes the circle."
                  },
            {
                    "input": "3 2\n6 4\n3 6\n7 3",
                    "output": "2",
                    "explanation": "Starting at pump 2, the truck completes the circle."
                  },
            {
                    "input": "2 2\n1 2\n2 1",
                    "output": "1",
                    "explanation": "Starting at pump 1 works: tank goes 1 then 0, never negative."
                  }
          ],
      "constraints": [
            "1 <= n <= 100",
            "0 <= petrol_i, distance_i <= 10^3"
          ],
      "io": "matrix",
      "testCases": [
            {
                    "input": "4 2\n4 6\n6 5\n7 3\n4 5",
                    "expectedOutput": "1"
                  },
            {
                    "input": "3 2\n6 4\n3 6\n7 3",
                    "expectedOutput": "2"
                  },
            {
                    "input": "2 2\n1 2\n2 1",
                    "expectedOutput": "1"
                  },
            {
                    "input": "5 2\n14 8\n1 9\n17 8\n19 7\n15 12",
                    "expectedOutput": "2"
                  },
            {
                    "input": "3 2\n9 17\n16 1\n18 16",
                    "expectedOutput": "1"
                  },
            {
                    "input": "2 2\n19 1\n2 3",
                    "expectedOutput": "0"
                  },
            {
                    "input": "3 2\n17 1\n12 18\n11 8",
                    "expectedOutput": "0"
                  },
            {
                    "input": "4 2\n20 8\n6 16\n18 12\n17 1",
                    "expectedOutput": "0"
                  },
            {
                    "input": "4 2\n11 17\n16 16\n3 5\n13 10",
                    "expectedOutput": "-1"
                  },
            {
                    "input": "2 2\n2 17\n20 2",
                    "expectedOutput": "1"
                  },
            {
                    "input": "1 2\n19 17",
                    "expectedOutput": "0"
                  },
            {
                    "input": "5 2\n14 11\n15 4\n17 6\n0 9\n8 7",
                    "expectedOutput": "0"
                  }
          ]
    },
  {
      "id": "k-stacks-in-single-array",
    "hints": ["You need to reuse freed slots across all stacks efficiently rather than partitioning the array.","Maintain a free list with next-array chaining: each push takes the head of the free list, each pop returns its slot to the free list."],
      "returns": "string",
      "title": "Efficiently Implement k Stacks in a Single Array",
      "difficulty": "hard",
      "topic": "stack",
      "companies": [
            "Amazon",
            "Microsoft"
          ],
      "description": "Implement k stacks inside one array of fixed size using O(1) extra space per operation (free-slot chaining). Input: line 1 = number of following lines, line 2 = 'k size' (k stacks, array size), then one operation per line: 'push s x' pushes x onto stack s (0-indexed; prints null on success, -1 when the array is full), 'pop s' pops stack s (prints the value or -1 if that stack is empty). Print each result on its own line.",
      "examples": [
            {
                    "input": "7\n2 5\npush 0 10\npush 1 20\npush 0 30\npop 0\npop 1\npop 0",
                    "output": "null\nnull\nnull\n30\n20\n10",
                    "explanation": "pushes print null; pop 0 -> 30, pop 1 -> 20, pop 0 -> 10."
                  },
            {
                    "input": "5\n1 2\npush 0 1\npush 0 2\npush 0 3\npop 0",
                    "output": "null\nnull\n-1\n2",
                    "explanation": "The third push finds the array full and prints -1; pop 0 -> 2."
                  },
            {
                    "input": "4\n2 4\npop 0\npop 1\npush 1 9",
                    "output": "-1\n-1\nnull",
                    "explanation": "Both pops hit empty stacks (-1); the push prints null."
                  }
          ],
      "constraints": [
            "1 <= k <= 10",
            "1 <= size <= 100",
            "1 <= operations <= 100"
          ],
      "io": "string-array",
      "testCases": [
            {
                    "input": "7\n2 5\npush 0 10\npush 1 20\npush 0 30\npop 0\npop 1\npop 0",
                    "expectedOutput": "null\nnull\nnull\n30\n20\n10"
                  },
            {
                    "input": "5\n1 2\npush 0 1\npush 0 2\npush 0 3\npop 0",
                    "expectedOutput": "null\nnull\n-1\n2"
                  },
            {
                    "input": "4\n2 4\npop 0\npop 1\npush 1 9",
                    "expectedOutput": "-1\n-1\nnull"
                  },
            {
                    "input": "6\n1 4\npop 0\npop 0\npush 0 90\npush 0 33\npush 0 67",
                    "expectedOutput": "-1\n-1\nnull\nnull\nnull"
                  },
            {
                    "input": "10\n1 5\npop 0\npop 0\npush 0 88\npop 0\npop 0\npop 0\npush 0 79\npop 0\npop 0",
                    "expectedOutput": "-1\n-1\nnull\n88\n-1\n-1\nnull\n79\n-1"
                  },
            {
                    "input": "8\n2 3\npush 0 16\npop 1\npush 1 66\npush 0 12\npop 0\npush 1 56\npush 1 75",
                    "expectedOutput": "null\n-1\nnull\nnull\n12\nnull\n-1"
                  },
            {
                    "input": "6\n2 4\npush 0 68\npop 0\npop 0\npush 1 60\npop 1",
                    "expectedOutput": "null\n68\n-1\nnull\n60"
                  },
            {
                    "input": "11\n2 6\npush 1 38\npop 1\npush 0 99\npush 0 76\npush 1 45\npush 1 46\npush 0 14\npop 1\npush 1 75\npop 0",
                    "expectedOutput": "null\n38\nnull\nnull\nnull\nnull\nnull\n46\nnull\n14"
                  },
            {
                    "input": "5\n3 8\npop 0\npop 1\npush 2 76\npop 0",
                    "expectedOutput": "-1\n-1\nnull\n-1"
                  },
            {
                    "input": "11\n1 8\npush 0 69\npop 0\npop 0\npop 0\npop 0\npush 0 79\npop 0\npop 0\npop 0\npop 0",
                    "expectedOutput": "null\n69\n-1\n-1\n-1\nnull\n79\n-1\n-1\n-1"
                  },
            {
                    "input": "10\n2 7\npush 1 9\npush 1 68\npop 0\npop 0\npop 1\npop 0\npop 1\npop 0\npush 0 70",
                    "expectedOutput": "null\nnull\n-1\n-1\n68\n-1\n9\n-1\nnull"
                  },
            {
                    "input": "7\n1 3\npush 0 37\npush 0 90\npop 0\npush 0 63\npop 0\npop 0",
                    "expectedOutput": "null\nnull\n90\nnull\n63\n37"
                  }
          ]
    },
  {
      "id": "iterative-tower-of-hanoi",
    "hints": ["The recursive solution has a pattern that can be simulated with explicit stacks for the rods.","Model the three rods as stacks and simulate the recursive moves iteratively, or use the known pattern of smallest-disk moves cycling in a fixed direction."],
      "returns": "string",
      "title": "Iterative Tower of Hanoi",
      "difficulty": "medium",
      "topic": "stack",
      "companies": [
            "Amazon",
            "Adobe"
          ],
      "description": "Solve the Tower of Hanoi for n disks iteratively using three rods named A, B and C: move the whole stack from rod A to rod C following the classic rules (move one disk at a time, never place a larger disk on a smaller one). Print each move as 'Move disk D from X to Y', one move per line, in the exact order performed.",
      "examples": [
            {
                    "input": "1",
                    "output": "Move disk 1 from A to C",
                    "explanation": "Only one move is needed."
                  },
            {
                    "input": "2",
                    "output": "Move disk 1 from A to B\nMove disk 2 from A to C\nMove disk 1 from B to C",
                    "explanation": "Three moves transfer both disks from A to C via B."
                  },
            {
                    "input": "3",
                    "output": "Move disk 1 from A to C\nMove disk 2 from A to B\nMove disk 1 from C to B\nMove disk 3 from A to C\nMove disk 1 from B to A\nMove disk 2 from B to C\nMove disk 1 from A to C",
                    "explanation": "Seven moves transfer all three disks."
                  }
          ],
      "constraints": [
            "1 <= n <= 10",
            "There are exactly 2^n - 1 moves"
          ],
      "io": "int",
      "testCases": [
            {
                    "input": "1",
                    "expectedOutput": "Move disk 1 from A to C"
                  },
            {
                    "input": "2",
                    "expectedOutput": "Move disk 1 from A to B\nMove disk 2 from A to C\nMove disk 1 from B to C"
                  },
            {
                    "input": "3",
                    "expectedOutput": "Move disk 1 from A to C\nMove disk 2 from A to B\nMove disk 1 from C to B\nMove disk 3 from A to C\nMove disk 1 from B to A\nMove disk 2 from B to C\nMove disk 1 from A to C"
                  },
            {
                    "input": "4",
                    "expectedOutput": "Move disk 1 from A to B\nMove disk 2 from A to C\nMove disk 1 from B to C\nMove disk 3 from A to B\nMove disk 1 from C to A\nMove disk 2 from C to B\nMove disk 1 from A to B\nMove disk 4 from A to C\nMove disk 1 from B to C\nMove disk 2 from B to A\nMove disk 1 from C to A\nMove disk 3 from B to C\nMove disk 1 from A to B\nMove disk 2 from A to C\nMove disk 1 from B to C"
                  },
            {
                    "input": "3",
                    "expectedOutput": "Move disk 1 from A to C\nMove disk 2 from A to B\nMove disk 1 from C to B\nMove disk 3 from A to C\nMove disk 1 from B to A\nMove disk 2 from B to C\nMove disk 1 from A to C"
                  },
            {
                    "input": "2",
                    "expectedOutput": "Move disk 1 from A to B\nMove disk 2 from A to C\nMove disk 1 from B to C"
                  },
            {
                    "input": "5",
                    "expectedOutput": "Move disk 1 from A to C\nMove disk 2 from A to B\nMove disk 1 from C to B\nMove disk 3 from A to C\nMove disk 1 from B to A\nMove disk 2 from B to C\nMove disk 1 from A to C\nMove disk 4 from A to B\nMove disk 1 from C to B\nMove disk 2 from C to A\nMove disk 1 from B to A\nMove disk 3 from C to B\nMove disk 1 from A to C\nMove disk 2 from A to B\nMove disk 1 from C to B\nMove disk 5 from A to C\nMove disk 1 from B to A\nMove disk 2 from B to C\nMove disk 1 from A to C\nMove disk 3 from B to A\nMove disk 1 from C to B\nMove disk 2 from C to A\nMove disk 1 from B to A\nMove disk 4 from B to C\nMove disk 1 from A to C\nMove disk 2 from A to B\nMove disk 1 from C to B\nMove disk 3 from A to C\nMove disk 1 from B to A\nMove disk 2 from B to C\nMove disk 1 from A to C"
                  },
            {
                    "input": "6",
                    "expectedOutput": "Move disk 1 from A to B\nMove disk 2 from A to C\nMove disk 1 from B to C\nMove disk 3 from A to B\nMove disk 1 from C to A\nMove disk 2 from C to B\nMove disk 1 from A to B\nMove disk 4 from A to C\nMove disk 1 from B to C\nMove disk 2 from B to A\nMove disk 1 from C to A\nMove disk 3 from B to C\nMove disk 1 from A to B\nMove disk 2 from A to C\nMove disk 1 from B to C\nMove disk 5 from A to B\nMove disk 1 from C to A\nMove disk 2 from C to B\nMove disk 1 from A to B\nMove disk 3 from C to A\nMove disk 1 from B to C\nMove disk 2 from B to A\nMove disk 1 from C to A\nMove disk 4 from C to B\nMove disk 1 from A to B\nMove disk 2 from A to C\nMove disk 1 from B to C\nMove disk 3 from A to B\nMove disk 1 from C to A\nMove disk 2 from C to B\nMove disk 1 from A to B\nMove disk 6 from A to C\nMove disk 1 from B to C\nMove disk 2 from B to A\nMove disk 1 from C to A\nMove disk 3 from B to C\nMove disk 1 from A to B\nMove disk 2 from A to C\nMove disk 1 from B to C\nMove disk 4 from B to A\nMove disk 1 from C to A\nMove disk 2 from C to B\nMove disk 1 from A to B\nMove disk 3 from C to A\nMove disk 1 from B to C\nMove disk 2 from B to A\nMove disk 1 from C to A\nMove disk 5 from B to C\nMove disk 1 from A to B\nMove disk 2 from A to C\nMove disk 1 from B to C\nMove disk 3 from A to B\nMove disk 1 from C to A\nMove disk 2 from C to B\nMove disk 1 from A to B\nMove disk 4 from A to C\nMove disk 1 from B to C\nMove disk 2 from B to A\nMove disk 1 from C to A\nMove disk 3 from B to C\nMove disk 1 from A to B\nMove disk 2 from A to C\nMove disk 1 from B to C"
                  },
            {
                    "input": "6",
                    "expectedOutput": "Move disk 1 from A to B\nMove disk 2 from A to C\nMove disk 1 from B to C\nMove disk 3 from A to B\nMove disk 1 from C to A\nMove disk 2 from C to B\nMove disk 1 from A to B\nMove disk 4 from A to C\nMove disk 1 from B to C\nMove disk 2 from B to A\nMove disk 1 from C to A\nMove disk 3 from B to C\nMove disk 1 from A to B\nMove disk 2 from A to C\nMove disk 1 from B to C\nMove disk 5 from A to B\nMove disk 1 from C to A\nMove disk 2 from C to B\nMove disk 1 from A to B\nMove disk 3 from C to A\nMove disk 1 from B to C\nMove disk 2 from B to A\nMove disk 1 from C to A\nMove disk 4 from C to B\nMove disk 1 from A to B\nMove disk 2 from A to C\nMove disk 1 from B to C\nMove disk 3 from A to B\nMove disk 1 from C to A\nMove disk 2 from C to B\nMove disk 1 from A to B\nMove disk 6 from A to C\nMove disk 1 from B to C\nMove disk 2 from B to A\nMove disk 1 from C to A\nMove disk 3 from B to C\nMove disk 1 from A to B\nMove disk 2 from A to C\nMove disk 1 from B to C\nMove disk 4 from B to A\nMove disk 1 from C to A\nMove disk 2 from C to B\nMove disk 1 from A to B\nMove disk 3 from C to A\nMove disk 1 from B to C\nMove disk 2 from B to A\nMove disk 1 from C to A\nMove disk 5 from B to C\nMove disk 1 from A to B\nMove disk 2 from A to C\nMove disk 1 from B to C\nMove disk 3 from A to B\nMove disk 1 from C to A\nMove disk 2 from C to B\nMove disk 1 from A to B\nMove disk 4 from A to C\nMove disk 1 from B to C\nMove disk 2 from B to A\nMove disk 1 from C to A\nMove disk 3 from B to C\nMove disk 1 from A to B\nMove disk 2 from A to C\nMove disk 1 from B to C"
                  },
            {
                    "input": "2",
                    "expectedOutput": "Move disk 1 from A to B\nMove disk 2 from A to C\nMove disk 1 from B to C"
                  },
            {
                    "input": "2",
                    "expectedOutput": "Move disk 1 from A to B\nMove disk 2 from A to C\nMove disk 1 from B to C"
                  },
            {
                    "input": "6",
                    "expectedOutput": "Move disk 1 from A to B\nMove disk 2 from A to C\nMove disk 1 from B to C\nMove disk 3 from A to B\nMove disk 1 from C to A\nMove disk 2 from C to B\nMove disk 1 from A to B\nMove disk 4 from A to C\nMove disk 1 from B to C\nMove disk 2 from B to A\nMove disk 1 from C to A\nMove disk 3 from B to C\nMove disk 1 from A to B\nMove disk 2 from A to C\nMove disk 1 from B to C\nMove disk 5 from A to B\nMove disk 1 from C to A\nMove disk 2 from C to B\nMove disk 1 from A to B\nMove disk 3 from C to A\nMove disk 1 from B to C\nMove disk 2 from B to A\nMove disk 1 from C to A\nMove disk 4 from C to B\nMove disk 1 from A to B\nMove disk 2 from A to C\nMove disk 1 from B to C\nMove disk 3 from A to B\nMove disk 1 from C to A\nMove disk 2 from C to B\nMove disk 1 from A to B\nMove disk 6 from A to C\nMove disk 1 from B to C\nMove disk 2 from B to A\nMove disk 1 from C to A\nMove disk 3 from B to C\nMove disk 1 from A to B\nMove disk 2 from A to C\nMove disk 1 from B to C\nMove disk 4 from B to A\nMove disk 1 from C to A\nMove disk 2 from C to B\nMove disk 1 from A to B\nMove disk 3 from C to A\nMove disk 1 from B to C\nMove disk 2 from B to A\nMove disk 1 from C to A\nMove disk 5 from B to C\nMove disk 1 from A to B\nMove disk 2 from A to C\nMove disk 1 from B to C\nMove disk 3 from A to B\nMove disk 1 from C to A\nMove disk 2 from C to B\nMove disk 1 from A to B\nMove disk 4 from A to C\nMove disk 1 from B to C\nMove disk 2 from B to A\nMove disk 1 from C to A\nMove disk 3 from B to C\nMove disk 1 from A to B\nMove disk 2 from A to C\nMove disk 1 from B to C"
                  }
          ]
    },
  {
      "id": "lru-cache-implementation",
    "hints": ["The cache needs O(1) lookup by key and O(1) tracking of usage order.","Combine a hash map for key-to-node lookup with a doubly linked list for recency order: move accessed nodes to the front and evict from the back."],
      "returns": "string",
      "title": "LRU Cache Implementation",
      "difficulty": "hard",
      "topic": "queue",
      "companies": [
            "Amazon",
            "Microsoft",
            "Google"
          ],
      "description": "Implement an LRU (Least Recently Used) cache. Input: line 1 = number of following lines, line 2 = capacity, then one operation per line: 'put k v' inserts or updates key k with value v (prints null), 'get k' returns the value for key k and marks it recently used, or -1 if the key is missing. When the cache exceeds capacity, the least recently used key is evicted. Print each result on its own line.",
      "examples": [
            {
                    "input": "10\n2\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2\nput 4 4\nget 1\nget 3\nget 4",
                    "output": "null\nnull\n1\nnull\n-1\nnull\n-1\n3\n4",
                    "explanation": "Classic example: get 1 -> 1, then key 2 is evicted so get 2 -> -1, then key 1 is evicted so get 1 -> -1, get 3 -> 3, get 4 -> 4."
                  },
            {
                    "input": "5\n1\nput 5 5\nget 5\nput 6 6\nget 5",
                    "output": "null\n5\nnull\n-1",
                    "explanation": "Capacity 1: put 6 evicts key 5, so get 5 -> -1."
                  },
            {
                    "input": "4\n2\nget 1\nput 1 10\nget 1",
                    "output": "-1\nnull\n10",
                    "explanation": "get 1 -> -1 before insertion, then put -> null, get 1 -> 10."
                  }
          ],
      "constraints": [
            "1 <= capacity <= 100",
            "1 <= operations <= 100",
            "0 <= k, v <= 10^4"
          ],
      "io": "string-array",
      "testCases": [
            {
                    "input": "10\n2\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2\nput 4 4\nget 1\nget 3\nget 4",
                    "expectedOutput": "null\nnull\n1\nnull\n-1\nnull\n-1\n3\n4"
                  },
            {
                    "input": "5\n1\nput 5 5\nget 5\nput 6 6\nget 5",
                    "expectedOutput": "null\n5\nnull\n-1"
                  },
            {
                    "input": "4\n2\nget 1\nput 1 10\nget 1",
                    "expectedOutput": "-1\nnull\n10"
                  },
            {
                    "input": "9\n3\nget 2\nput 3 61\nput 3 38\nget 1\nput 5 73\nget 3\nget 4\nput 6 32",
                    "expectedOutput": "-1\nnull\nnull\n-1\nnull\n38\n-1\nnull"
                  },
            {
                    "input": "9\n4\nput 5 44\nput 2 20\nput 2 65\nput 5 9\nget 5\nget 1\nput 2 55\nput 5 41",
                    "expectedOutput": "null\nnull\nnull\nnull\n9\n-1\nnull\nnull"
                  },
            {
                    "input": "6\n3\nget 6\nget 5\nget 6\nget 3\nput 3 7",
                    "expectedOutput": "-1\n-1\n-1\n-1\nnull"
                  },
            {
                    "input": "9\n2\nget 3\nget 2\nget 3\nput 3 52\nput 6 7\nput 5 67\nget 5\nget 1",
                    "expectedOutput": "-1\n-1\n-1\nnull\nnull\nnull\n67\n-1"
                  },
            {
                    "input": "10\n1\nput 1 67\nput 6 21\nput 3 65\nget 6\nput 2 47\nput 1 69\nget 6\nget 4\nget 2",
                    "expectedOutput": "null\nnull\nnull\n-1\nnull\nnull\n-1\n-1\n-1"
                  },
            {
                    "input": "9\n4\nput 2 76\nput 4 15\nput 6 14\nget 6\nput 5 7\nget 5\nput 5 54\nget 2",
                    "expectedOutput": "null\nnull\nnull\n14\nnull\n7\nnull\n76"
                  },
            {
                    "input": "5\n2\nput 3 20\nput 3 20\nput 6 49\nget 2",
                    "expectedOutput": "null\nnull\nnull\n-1"
                  },
            {
                    "input": "6\n1\nget 4\nget 2\nget 4\nget 6\nget 5",
                    "expectedOutput": "-1\n-1\n-1\n-1\n-1"
                  },
            {
                    "input": "11\n2\nput 5 99\nput 4 82\nget 3\nput 3 77\nget 3\nget 4\nget 2\nget 4\nput 3 43\nput 6 42",
                    "expectedOutput": "null\nnull\n-1\nnull\n77\n82\n-1\n82\nnull\nnull"
                  }
          ]
    },
{
    "id": "arithmetic-expressions",
    "hints": ["Split the expression at every operator, recursively compute all possible values of the left and right parts, then combine them.","Use divide and conquer over operator positions and collect results in a set so only distinct values are counted."],
    "returns": "int",
    "title": "Arithmetic Expressions",
    "difficulty": "medium",
    "topic": "backtracking",
    "companies": [
      "Flipkart",
      "Amazon"
    ],
    "description": "Given an arithmetic expression string consisting of single-digit numbers (0-9) and the operators +, - and *, consider every possible way of fully parenthesizing the expression. Each parenthesization evaluates to some integer value. Return the number of DISTINCT values obtainable across all parenthesizations. The input is the expression string on a single line.",
    "examples": [
      {
        "input": "2-1-1",
        "output": "2",
        "explanation": "Parenthesizations give (2-1)-1 = 0 and 2-(1-1) = 2, so the distinct values are {0, 2}: count 2."
      },
      {
        "input": "2*3-4*5",
        "output": "4",
        "explanation": "The five parenthesizations yield -34, -14, -10, -10 and 10, so the distinct values are {-34, -14, -10, 10}: count 4."
      },
      {
        "input": "1+2+3+4",
        "output": "1",
        "explanation": "Addition is associative, so every parenthesization evaluates to 10: only one distinct value."
      }
    ],
    "constraints": [
      "The expression contains only digits 0-9 and the operators +, -, *.",
      "The expression length is in the range [1, 15].",
      "The expression is always valid (digit-operator-digit-operator ... digit)."
    ],
    "io": "string",
    "testCases": [
      {
        "input": "2-1-1",
        "expectedOutput": "2"
      },
      {
        "input": "2*3-4*5",
        "expectedOutput": "4"
      },
      {
        "input": "1+2+3+4",
        "expectedOutput": "1"
      },
      {
        "input": "2*3",
        "expectedOutput": "1"
      },
      {
        "input": "5-3-2",
        "expectedOutput": "2"
      },
      {
        "input": "9-5*2",
        "expectedOutput": "2"
      },
      {
        "input": "1+1+1+1+1",
        "expectedOutput": "1"
      },
      {
        "input": "3*3*3",
        "expectedOutput": "1"
      },
      {
        "input": "4-2-1-1",
        "expectedOutput": "3"
      },
      {
        "input": "2+3*4-5",
        "expectedOutput": "4"
      },
      {
        "input": "7-7-7",
        "expectedOutput": "2"
      },
      {
        "input": "1*2-3*4+5",
        "expectedOutput": "5"
      }
    ]
  },
  {
    "id": "paper-cut-min-squares",
    "hints": ["Notice that repeatedly taking the largest possible square is forced here: any optimal cutting must include it.","This is the Euclidean algorithm in disguise: take floor(n/m) squares of side m at each step, then recurse on the remaining m by n mod m rectangle."],
    "returns": "int",
    "title": "Paper Cut into Minimum Number of Squares",
    "difficulty": "easy",
    "topic": "greedy",
    "companies": [
      "Google",
      "Amazon"
    ],
    "description": "You are given a rectangular paper of size n x m. Repeatedly cut off the largest possible square (of side min(n, m)) from the remaining rectangle until nothing is left. Return the total number of squares obtained by this greedy cutting. The input has three lines: the first line is 1, the second line holds n, the third line holds m.",
    "examples": [
      {
        "input": "1\n13\n11",
        "output": "8",
        "explanation": "13x11: cut one 11x11, then five 2x2 from the 11x2 strip, then two 1x1 squares: 1 + 5 + 2 = 8."
      },
      {
        "input": "1\n5\n5",
        "output": "1",
        "explanation": "The paper is already a square, so a single cut gives 1."
      },
      {
        "input": "1\n4\n6",
        "output": "3",
        "explanation": "6x4: cut one 4x4, then two 2x2 squares from the remaining 2x4: 3 in total."
      }
    ],
    "constraints": [
      "1 <= n, m <= 10^9.",
      "The greedy strategy of always cutting the largest possible square is optimal here."
    ],
    "io": "array-k",
    "testCases": [
      {
        "input": "1\n13\n11",
        "expectedOutput": "8"
      },
      {
        "input": "1\n5\n5",
        "expectedOutput": "1"
      },
      {
        "input": "1\n4\n6",
        "expectedOutput": "3"
      },
      {
        "input": "1\n1\n7",
        "expectedOutput": "7"
      },
      {
        "input": "1\n8\n12",
        "expectedOutput": "3"
      },
      {
        "input": "1\n3\n5",
        "expectedOutput": "4"
      },
      {
        "input": "1\n2\n2",
        "expectedOutput": "1"
      },
      {
        "input": "1\n10\n1",
        "expectedOutput": "10"
      },
      {
        "input": "1\n7\n3",
        "expectedOutput": "5"
      },
      {
        "input": "1\n9\n6",
        "expectedOutput": "3"
      },
      {
        "input": "1\n11\n13",
        "expectedOutput": "8"
      },
      {
        "input": "1\n100\n30",
        "expectedOutput": "6"
      }
    ]
  },
  {
    "id": "min-edges-to-reverse",
    "hints": ["Think of reversals as edge costs: traveling an edge forward costs 0, traveling it backward costs 1 reversal.","Build a graph where every original edge has weight 0 and every reverse edge has weight 1, then find the shortest path from 0 to N-1 with 0-1 BFS or Dijkstra."],
    "returns": "int",
    "title": "Minimum Edges to Reverse for Source to Destination",
    "difficulty": "hard",
    "topic": "greedy",
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "description": "You are given a directed graph with nodes numbered 0 to N-1 as a list of m directed edges. Each input line after the first is a directed edge 'u v' from u to v, and N is one more than the largest node index appearing in the edges. Find the minimum number of edges to reverse so that a directed path exists from node 0 (source) to node N-1 (destination). Return -1 if no sequence of reversals can create such a path. Hint: give every given edge cost 0 forward and cost 1 backward, then find the shortest path.",
    "examples": [
      {
        "input": "3\n0 1\n1 2\n2 3",
        "output": "0",
        "explanation": "Edges already form the directed path 0 -> 1 -> 2 -> 3, so 0 reversals are needed."
      },
      {
        "input": "3\n1 0\n2 1\n3 2",
        "output": "3",
        "explanation": "Every edge points backwards; reversing all three gives the path 0 -> 1 -> 2 -> 3."
      },
      {
        "input": "4\n0 1\n0 2\n1 3\n2 3",
        "output": "0",
        "explanation": "The path 0 -> 1 -> 3 (or 0 -> 2 -> 3) already exists with 0 reversals."
      }
    ],
    "constraints": [
      "1 <= m <= 10000.",
      "Node indices fit in a 32-bit signed integer.",
      "The source is fixed as node 0 and the destination as node N-1."
    ],
    "io": "intervals",
    "testCases": [
      {
        "input": "3\n0 1\n1 2\n2 3",
        "expectedOutput": "0"
      },
      {
        "input": "3\n1 0\n2 1\n3 2",
        "expectedOutput": "3"
      },
      {
        "input": "4\n0 1\n0 2\n1 3\n2 3",
        "expectedOutput": "0"
      },
      {
        "input": "2\n0 1\n2 3",
        "expectedOutput": "-1"
      },
      {
        "input": "1\n0 1",
        "expectedOutput": "0"
      },
      {
        "input": "1\n1 0",
        "expectedOutput": "1"
      },
      {
        "input": "5\n0 2\n2 1\n1 3\n4 3\n0 4",
        "expectedOutput": "0"
      },
      {
        "input": "4\n1 0\n0 2\n3 2\n1 3",
        "expectedOutput": "1"
      },
      {
        "input": "6\n0 1\n1 2\n2 0\n3 4\n4 5\n5 3",
        "expectedOutput": "-1"
      },
      {
        "input": "4\n1 0\n2 1\n3 2\n4 3",
        "expectedOutput": "4"
      },
      {
        "input": "7\n0 1\n1 2\n3 2\n3 4\n4 5\n6 5\n0 6",
        "expectedOutput": "0"
      },
      {
        "input": "4\n1 0\n2 0\n3 1\n3 2",
        "expectedOutput": "2"
      }
    ]
  },
  {
    "id": "zigzag-tree-traversal",
    "hints": ["This is level order with the direction flipped on alternate levels.","Do BFS level by level and reverse the node order for every second level, or use a deque pushing to opposite ends per level."],
    "returns": "intArr",
    "title": "ZigZag Tree Traversal",
    "difficulty": "medium",
    "topic": "trees",
    "companies": [
      "Amazon",
      "Microsoft",
      "Flipkart"
    ],
    "description": "Given the root of a binary tree, return its zigzag level order traversal: visit nodes level by level, alternating the direction at each level - the first level left to right, the second right to left, the third left to right, and so on. Return the values as a space-separated list. Input format: the first line is n (token count), the second line holds n level-order tokens with 'null' for missing nodes.",
    "examples": [
      {
        "input": "7\n3 9 20 null null 15 7",
        "output": "3 20 9 15 7",
        "explanation": "Level 1: [3] left to right. Level 2: [9, 20] becomes [20, 9]. Level 3: [15, 7] stays [15, 7]."
      },
      {
        "input": "3\n1 2 3",
        "output": "1 3 2",
        "explanation": "Level 1: [1]. Level 2: [2, 3] reversed to [3, 2]."
      },
      {
        "input": "1\n1",
        "output": "1",
        "explanation": "A single node forms one level: [1]."
      }
    ],
    "constraints": [
      "The number of nodes is in the range [0, 10000].",
      "-1000 <= Node.val <= 1000."
    ],
    "io": "tree",
    "testCases": [
      {
        "input": "7\n3 9 20 null null 15 7",
        "expectedOutput": "3 20 9 15 7"
      },
      {
        "input": "3\n1 2 3",
        "expectedOutput": "1 3 2"
      },
      {
        "input": "1\n1",
        "expectedOutput": "1"
      },
      {
        "input": "7\n1 2 3 4 5 6 7",
        "expectedOutput": "1 3 2 4 5 6 7"
      },
      {
        "input": "5\n1 2 null 3 null 4",
        "expectedOutput": "1 2 3 4"
      },
      {
        "input": "6\n1 2 3 4 null null 5",
        "expectedOutput": "1 3 2 4 5"
      },
      {
        "input": "9\n8 3 10 1 6 null 14 null null 4 7 13",
        "expectedOutput": "8 10 3 1 6 14 13 7 4"
      },
      {
        "input": "2\n2 1",
        "expectedOutput": "2 1"
      },
      {
        "input": "4\n1 null 2 null 3",
        "expectedOutput": "1 2 3"
      },
      {
        "input": "11\n5 3 8 2 4 7 9 null null null null 6 null null 10",
        "expectedOutput": "5 8 3 2 4 7 9 10 6"
      },
      {
        "input": "3\n1 null 2",
        "expectedOutput": "1 2"
      },
      {
        "input": "10\n1 2 3 4 5 null 6 7 null null null 8",
        "expectedOutput": "1 3 2 4 5 6 8 7"
      }
    ]
  },
  {
    "id": "construct-binary-tree-from-preorder-inorder",
    "hints": ["The first preorder element is always the root, and inorder tells you which elements belong left vs right of it.","Recursively build: root = preorder[0], split inorder at the root's position into left/right subtrees, and recurse with matching preorder ranges."],
    "returns": "string",
    "title": "Construct Binary Tree from Preorder and Inorder Traversal",
    "difficulty": "medium",
    "topic": "trees",
    "companies": [
      "Accolite",
      "Amazon",
      "Microsoft"
    ],
    "description": "Given the preorder and inorder traversals of a binary tree whose node values are all distinct, reconstruct the tree. The first input line holds the preorder traversal as space-separated integers and the second line holds the inorder traversal as space-separated integers. Output the level-order serialization of the reconstructed tree: breadth-first values with 'null' for missing children and trailing nulls removed, joined by single spaces.",
    "examples": [
      {
        "input": "3 9 20 15 7\n9 3 15 20 7",
        "output": "3 9 20 null null 15 7",
        "explanation": "Preorder root 3 splits inorder into left [9] and right [15, 20, 7]; the rebuilt tree serialized in level order is '3 9 20 null null 15 7'."
      },
      {
        "input": "1 2 3\n2 1 3",
        "output": "1 2 3",
        "explanation": "Root 1 with left child 2 and right child 3 serializes as '1 2 3'."
      },
      {
        "input": "-1\n-1",
        "output": "-1",
        "explanation": "A single node tree serializes as just '-1'."
      }
    ],
    "constraints": [
      "Both traversals contain the same n distinct values, 1 <= n <= 3000.",
      "-3000 <= Node.val <= 3000."
    ],
    "io": "two-strings",
    "testCases": [
      {
        "input": "3 9 20 15 7\n9 3 15 20 7",
        "expectedOutput": "3 9 20 null null 15 7"
      },
      {
        "input": "1 2 3\n2 1 3",
        "expectedOutput": "1 2 3"
      },
      {
        "input": "-1\n-1",
        "expectedOutput": "-1"
      },
      {
        "input": "1 2 4 5 3 6\n4 2 5 1 6 3",
        "expectedOutput": "1 2 3 4 5 6"
      },
      {
        "input": "5 3 2 4 8 7\n2 3 4 5 7 8",
        "expectedOutput": "5 3 8 2 4 7"
      },
      {
        "input": "1 2\n2 1",
        "expectedOutput": "1 2"
      },
      {
        "input": "1 2\n1 2",
        "expectedOutput": "1 null 2"
      },
      {
        "input": "4 2 1 3 6 5 7\n1 2 3 4 5 6 7",
        "expectedOutput": "4 2 6 1 3 5 7"
      },
      {
        "input": "10 5 15\n5 10 15",
        "expectedOutput": "10 5 15"
      },
      {
        "input": "1 2 3 4\n4 3 2 1",
        "expectedOutput": "1 2 null 3 null 4"
      },
      {
        "input": "1 2 3 4\n1 2 3 4",
        "expectedOutput": "1 null 2 null 3 null 4"
      },
      {
        "input": "8 3 1 6 4 7 10 14 13\n1 3 4 6 7 8 10 13 14",
        "expectedOutput": "8 3 10 1 6 null 14 null null 4 7 13"
      }
    ]
  },
  {
    "id": "duplicate-subtree-in-binary-tree",
    "hints": ["Two subtrees are duplicates if their serialized forms are identical.","Serialize each subtree (structure plus values) during a post-order traversal and use a map to count occurrences; any serialization seen twice with size >= 2 is a duplicate."],
    "returns": "bool",
    "title": "Duplicate Subtree in Binary Tree",
    "difficulty": "medium",
    "topic": "trees",
    "companies": [
      "Google",
      "Amazon"
    ],
    "description": "Given the root of a binary tree, return true if the tree contains a duplicate subtree of size 2 or more - that is, two different subtrees with identical structure and identical node values, each having at least 2 nodes. Return false otherwise. Input format: the first line is n (token count), the second line holds n level-order tokens with 'null' for missing nodes.",
    "examples": [
      {
        "input": "10\n1 2 3 4 null 2 4 null null 4",
        "output": "true",
        "explanation": "The subtree rooted at the left child (2 with left child 4) is identical to the subtree rooted at the right child (2 with left child 4): duplicate of size 2."
      },
      {
        "input": "3\n1 2 3",
        "output": "false",
        "explanation": "Every subtree is unique, so there is no duplicate."
      },
      {
        "input": "7\n2 2 2 3 null 3 null",
        "output": "true",
        "explanation": "Both children of the root are the subtree '2 with left child 3', a duplicate of size 2."
      }
    ],
    "constraints": [
      "The number of nodes is in the range [1, 10000].",
      "1 <= Node.val <= 10000.",
      "Only subtrees with at least 2 nodes count; repeated single leaves do not."
    ],
    "io": "tree",
    "testCases": [
      {
        "input": "10\n1 2 3 4 null 2 4 null null 4",
        "expectedOutput": "true"
      },
      {
        "input": "3\n1 2 3",
        "expectedOutput": "false"
      },
      {
        "input": "7\n2 2 2 3 null 3 null",
        "expectedOutput": "true"
      },
      {
        "input": "1\n5",
        "expectedOutput": "false"
      },
      {
        "input": "7\n1 2 2 3 4 4 3",
        "expectedOutput": "false"
      },
      {
        "input": "5\n1 2 3 4 5",
        "expectedOutput": "false"
      },
      {
        "input": "7\n1 2 3 4 5 4 5",
        "expectedOutput": "false"
      },
      {
        "input": "9\n5 2 2 3 4 3 4",
        "expectedOutput": "true"
      },
      {
        "input": "5\n2 1 1 null null null null",
        "expectedOutput": "false"
      },
      {
        "input": "11\n1 2 3 4 5 6 7 8 null null null null null null null",
        "expectedOutput": "false"
      },
      {
        "input": "6\n3 2 2 1 null 1 null",
        "expectedOutput": "true"
      },
      {
        "input": "8\n7 3 7 2 5 2 5",
        "expectedOutput": "false"
      }
    ]
  },
  {
    "id": "check-if-graph-is-tree",
    "hints": ["A tree with n nodes has exactly n - 1 edges and is connected.","First check the edge count equals n - 1, then verify connectivity with BFS or DFS from node 0 reaching all nodes."],
    "returns": "bool",
    "title": "Check if a Given Graph is Tree or Not",
    "difficulty": "easy",
    "topic": "trees",
    "companies": [
      "Microsoft",
      "Amazon"
    ],
    "description": "Given an undirected graph with n nodes numbered 0 to n-1 and m edges, determine whether it is a tree. A tree is a connected graph with exactly n - 1 edges. The first input line holds 'n m' and the next m lines each hold an edge 'u v'. Return true if the graph is a tree and false otherwise.",
    "examples": [
      {
        "input": "4 3\n0 1\n1 2\n2 3",
        "output": "true",
        "explanation": "4 nodes, 3 edges and all nodes reachable from 0: a tree."
      },
      {
        "input": "4 4\n0 1\n1 2\n2 3\n3 0",
        "output": "false",
        "explanation": "4 edges on 4 nodes contains the cycle 0-1-2-3-0: not a tree."
      },
      {
        "input": "4 2\n0 1\n2 3",
        "output": "false",
        "explanation": "Only 2 edges on 4 nodes and the graph is disconnected: not a tree."
      }
    ],
    "constraints": [
      "1 <= n <= 10000.",
      "0 <= m <= 20000.",
      "0 <= u, v < n."
    ],
    "io": "graph",
    "testCases": [
      {
        "input": "4 3\n0 1\n1 2\n2 3",
        "expectedOutput": "true"
      },
      {
        "input": "4 4\n0 1\n1 2\n2 3\n3 0",
        "expectedOutput": "false"
      },
      {
        "input": "4 2\n0 1\n2 3",
        "expectedOutput": "false"
      },
      {
        "input": "1 0",
        "expectedOutput": "true"
      },
      {
        "input": "5 4\n0 1\n0 2\n0 3\n0 4",
        "expectedOutput": "true"
      },
      {
        "input": "2 1\n0 1",
        "expectedOutput": "true"
      },
      {
        "input": "6 5\n0 1\n1 2\n2 3\n3 4\n4 5",
        "expectedOutput": "true"
      },
      {
        "input": "5 5\n0 1\n1 2\n2 0\n3 4\n0 3",
        "expectedOutput": "false"
      },
      {
        "input": "3 3\n0 1\n1 2\n0 2",
        "expectedOutput": "false"
      },
      {
        "input": "7 6\n0 1\n0 2\n1 3\n1 4\n2 5\n2 6",
        "expectedOutput": "true"
      },
      {
        "input": "3 1\n0 1",
        "expectedOutput": "false"
      },
      {
        "input": "8 7\n0 1\n1 2\n2 3\n4 5\n5 6\n6 7\n3 4",
        "expectedOutput": "true"
      }
    ]
  },
  {
    "id": "bfs-of-graph",
    "hints": ["Breadth-first traversal visits nodes level by level, so the order in which neighbors are discovered directly determines the output sequence.","Use a queue seeded with the start node and a visited set marked at enqueue time, appending neighbors in adjacency-list order as you dequeue."],
    "returns": "intArr",
    "title": "BFS of Graph",
    "difficulty": "easy",
    "topic": "graphs",
    "companies": [
      "Samsung",
      "Delhivery",
      "SAP Labs"
    ],
    "description": "Given an undirected graph with n nodes numbered 0 to n-1 and a start node, return the breadth-first traversal order starting from the start node. Visit neighbours in the order they appear in the adjacency list (the order in which the edges were given). Only nodes reachable from the start node are visited. The first input line holds 'n m', the next m lines hold edges 'u v', and the last line holds the start node. Output the visited nodes as space-separated integers.",
    "examples": [
      {
        "input": "5 4\n0 1\n0 2\n1 3\n2 4\n0",
        "output": "0 1 2 3 4",
        "explanation": "From 0 visit neighbours 1, 2, then from 1 visit 3, then from 2 visit 4: 0 1 2 3 4."
      },
      {
        "input": "4 3\n0 1\n1 2\n2 3\n2",
        "output": "2 1 3 0",
        "explanation": "From 2: neighbours 1 and 3 (edge order 1-2 then 2-3 gives adjacency [1, 3]), then from 1 visit 0: 2 1 3 0."
      },
      {
        "input": "6 5\n0 1\n0 2\n1 3\n1 4\n2 5\n0",
        "output": "0 1 2 3 4 5",
        "explanation": "Level by level from 0: 0, then 1 2, then 3 4 5."
      }
    ],
    "constraints": [
      "1 <= n <= 10000.",
      "0 <= m <= 20000.",
      "0 <= start < n."
    ],
    "io": "graph-start",
    "testCases": [
      {
        "input": "5 4\n0 1\n0 2\n1 3\n2 4\n0",
        "expectedOutput": "0 1 2 3 4"
      },
      {
        "input": "4 3\n0 1\n1 2\n2 3\n2",
        "expectedOutput": "2 1 3 0"
      },
      {
        "input": "6 5\n0 1\n0 2\n1 3\n1 4\n2 5\n0",
        "expectedOutput": "0 1 2 3 4 5"
      },
      {
        "input": "1 0\n0",
        "expectedOutput": "0"
      },
      {
        "input": "5 2\n0 1\n3 4\n0",
        "expectedOutput": "0 1"
      },
      {
        "input": "7 6\n0 1\n0 2\n0 3\n1 4\n2 5\n3 6\n0",
        "expectedOutput": "0 1 2 3 4 5 6"
      },
      {
        "input": "4 3\n0 2\n0 1\n1 3\n0",
        "expectedOutput": "0 2 1 3"
      },
      {
        "input": "6 6\n0 1\n1 2\n2 0\n2 3\n3 4\n4 5\n0",
        "expectedOutput": "0 1 2 3 4 5"
      },
      {
        "input": "5 4\n4 3\n3 2\n2 1\n1 0\n4",
        "expectedOutput": "4 3 2 1 0"
      },
      {
        "input": "8 7\n0 1\n0 2\n1 3\n1 4\n2 5\n2 6\n4 7\n0",
        "expectedOutput": "0 1 2 3 4 5 6 7"
      },
      {
        "input": "3 2\n0 1\n1 2\n1",
        "expectedOutput": "1 0 2"
      },
      {
        "input": "6 5\n5 4\n4 3\n3 2\n2 1\n1 0\n5",
        "expectedOutput": "5 4 3 2 1 0"
      }
    ]
  },
  {
    "id": "dfs-of-graph",
    "hints": ["Depth-first traversal goes as deep as possible along the first neighbor before backtracking, and the adjacency order decides which branch is explored first.","Implement recursive DFS (or an explicit stack) from the start node with a visited set, iterating each node's adjacency list in the given edge order."],
    "returns": "intArr",
    "title": "DFS of Graph",
    "difficulty": "easy",
    "topic": "graphs",
    "companies": [
      "Samsung",
      "Intuit",
      "Goldman Sachs"
    ],
    "description": "Given an undirected graph with n nodes numbered 0 to n-1 and a start node, return the depth-first traversal order starting from the start node, using the standard recursive DFS. Visit neighbours in the order they appear in the adjacency list (the order in which the edges were given). Only nodes reachable from the start node are visited. The first input line holds 'n m', the next m lines hold edges 'u v', and the last line holds the start node. Output the visited nodes as space-separated integers.",
    "examples": [
      {
        "input": "5 4\n0 1\n0 2\n1 3\n2 4\n0",
        "output": "0 1 3 2 4",
        "explanation": "From 0 go deep via 1 to 3, backtrack, then via 2 to 4: 0 1 3 2 4."
      },
      {
        "input": "4 3\n0 1\n1 2\n2 3\n2",
        "output": "2 1 0 3",
        "explanation": "From 2 go to 1 then 0, backtrack to 2 then to 3: 2 1 0 3."
      },
      {
        "input": "6 5\n0 1\n0 2\n1 3\n1 4\n2 5\n0",
        "output": "0 1 3 4 2 5",
        "explanation": "From 0: 1, then deep to 3 and 4, backtrack, then 2 and deep to 5: 0 1 3 4 2 5."
      }
    ],
    "constraints": [
      "1 <= n <= 10000.",
      "0 <= m <= 20000.",
      "0 <= start < n."
    ],
    "io": "graph-start",
    "testCases": [
      {
        "input": "5 4\n0 1\n0 2\n1 3\n2 4\n0",
        "expectedOutput": "0 1 3 2 4"
      },
      {
        "input": "4 3\n0 1\n1 2\n2 3\n2",
        "expectedOutput": "2 1 0 3"
      },
      {
        "input": "6 5\n0 1\n0 2\n1 3\n1 4\n2 5\n0",
        "expectedOutput": "0 1 3 4 2 5"
      },
      {
        "input": "1 0\n0",
        "expectedOutput": "0"
      },
      {
        "input": "5 2\n0 1\n3 4\n0",
        "expectedOutput": "0 1"
      },
      {
        "input": "7 6\n0 1\n0 2\n0 3\n1 4\n2 5\n3 6\n0",
        "expectedOutput": "0 1 4 2 5 3 6"
      },
      {
        "input": "4 3\n0 2\n0 1\n1 3\n0",
        "expectedOutput": "0 2 1 3"
      },
      {
        "input": "6 6\n0 1\n1 2\n2 0\n2 3\n3 4\n4 5\n0",
        "expectedOutput": "0 1 2 3 4 5"
      },
      {
        "input": "5 4\n4 3\n3 2\n2 1\n1 0\n4",
        "expectedOutput": "4 3 2 1 0"
      },
      {
        "input": "8 7\n0 1\n0 2\n1 3\n1 4\n2 5\n2 6\n4 7\n0",
        "expectedOutput": "0 1 3 4 7 2 5 6"
      },
      {
        "input": "3 2\n0 1\n1 2\n1",
        "expectedOutput": "1 0 2"
      },
      {
        "input": "6 5\n5 4\n4 3\n3 2\n2 1\n1 0\n5",
        "expectedOutput": "5 4 3 2 1 0"
      }
    ]
  },
  {
    "id": "steps-by-knight",
    "hints": ["A knight's move has a fixed set of 8 possible jumps, so the board becomes an unweighted graph where each square connects to its legal jumps — and unweighted means shortest path equals fewest moves.","Run BFS from (sx, sy) over board coordinates with a visited set, generating the 8 knight moves per square; the first time the target is dequeued (or generated) gives the minimum moves."],
    "returns": "int",
    "title": "Steps by Knight",
    "difficulty": "medium",
    "topic": "graphs",
    "companies": [
      "Samsung",
      "Amazon"
    ],
    "description": "Given an N x N chessboard, a knight starts at position (sx, sy) and must reach the target position (tx, ty). Positions are 1-indexed: rows and columns both run from 1 to N. Return the minimum number of knight moves needed, or -1 if the target is unreachable. The input is a single line: 'N sx sy tx ty'.",
    "examples": [
      {
        "input": "6 1 1 6 6",
        "output": "4",
        "explanation": "On a 6x6 board the knight needs 4 moves to go from (1,1) to (6,6)."
      },
      {
        "input": "4 1 1 4 4",
        "output": "2",
        "explanation": "From (1,1) the knight jumps to (2,3) and then to (4,4): 2 moves."
      },
      {
        "input": "1 1 1 1 1",
        "output": "0",
        "explanation": "Start and target are the same square, so 0 moves are needed."
      }
    ],
    "constraints": [
      "1 <= N <= 30.",
      "1 <= sx, sy, tx, ty <= N."
    ],
    "io": "string",
    "testCases": [
      {
        "input": "6 1 1 6 6",
        "expectedOutput": "4"
      },
      {
        "input": "4 1 1 4 4",
        "expectedOutput": "2"
      },
      {
        "input": "1 1 1 1 1",
        "expectedOutput": "0"
      },
      {
        "input": "8 1 1 8 8",
        "expectedOutput": "6"
      },
      {
        "input": "2 1 1 2 2",
        "expectedOutput": "-1"
      },
      {
        "input": "3 1 1 3 3",
        "expectedOutput": "4"
      },
      {
        "input": "5 1 1 5 5",
        "expectedOutput": "4"
      },
      {
        "input": "7 2 3 6 5",
        "expectedOutput": "2"
      },
      {
        "input": "30 1 1 30 30",
        "expectedOutput": "20"
      },
      {
        "input": "4 2 1 3 3",
        "expectedOutput": "1"
      },
      {
        "input": "5 3 3 3 3",
        "expectedOutput": "0"
      },
      {
        "input": "10 1 5 10 5",
        "expectedOutput": "5"
      }
    ]
  },
  {
    "id": "longest-increasing-subsequence",
    "hints": ["The longest increasing subsequence ending at each position extends the longest such subsequence ending at any earlier smaller element.","One-dimensional O(n^2) DP over end positions, or the O(n log n) patience-sorting method that maintains candidate tails with binary search."],
    "returns": "int",
    "title": "Longest Increasing Subsequence",
    "difficulty": "medium",
    "topic": "dp",
    "companies": [
      "Amazon",
      "Google",
      "Facebook"
    ],
    "description": "Given an integer array, return the length of the longest strictly increasing subsequence. A subsequence keeps the original order but need not be contiguous. The first input line holds n and the second line holds the n array elements.",
    "examples": [
      {
        "input": "8\n10 9 2 5 3 7 101 18",
        "output": "4",
        "explanation": "One longest strictly increasing subsequence is [2, 3, 7, 101] (or [2, 5, 7, 101]), of length 4."
      },
      {
        "input": "6\n0 1 0 3 2 3",
        "output": "4",
        "explanation": "[0, 1, 2, 3] is a longest strictly increasing subsequence, of length 4."
      },
      {
        "input": "7\n7 7 7 7 7 7 7",
        "output": "1",
        "explanation": "All elements are equal, so no two can form a strictly increasing pair: length 1."
      }
    ],
    "constraints": [
      "1 <= n <= 2500.",
      "-10^4 <= arr[i] <= 10^4."
    ],
    "io": "array",
    "testCases": [
      {
        "input": "8\n10 9 2 5 3 7 101 18",
        "expectedOutput": "4"
      },
      {
        "input": "6\n0 1 0 3 2 3",
        "expectedOutput": "4"
      },
      {
        "input": "7\n7 7 7 7 7 7 7",
        "expectedOutput": "1"
      },
      {
        "input": "5\n1 2 3 4 5",
        "expectedOutput": "5"
      },
      {
        "input": "5\n5 4 3 2 1",
        "expectedOutput": "1"
      },
      {
        "input": "1\n42",
        "expectedOutput": "1"
      },
      {
        "input": "9\n3 1 4 1 5 9 2 6 5",
        "expectedOutput": "4"
      },
      {
        "input": "10\n10 22 9 33 21 50 41 60 80 1",
        "expectedOutput": "6"
      },
      {
        "input": "12\n0 8 4 12 2 10 6 14 1 9 5 13",
        "expectedOutput": "5"
      },
      {
        "input": "6\n3 10 2 1 20 4",
        "expectedOutput": "3"
      },
      {
        "input": "15\n5 1 4 2 3 8 6 7 9 0 11 10 12 14 13",
        "expectedOutput": "9"
      },
      {
        "input": "4\n2 2 2 2",
        "expectedOutput": "1"
      }
    ]
  },
  {
    "id": "ncr",
    "hints": ["Each binomial coefficient is the sum of the two coefficients directly above it, so building Pascal's triangle row by row reaches C(n, r).","Fill the table using Pascal's rule with base cases of 1 along the edges, or keep just the current row to use linear space."],
    "returns": "int",
    "title": "nCr - Binomial Coefficient",
    "difficulty": "easy",
    "topic": "dp",
    "companies": [
      "Google",
      "Amazon"
    ],
    "description": "Given integers n and r, compute the binomial coefficient C(n, r) - the number of ways to choose r items from n distinct items - using dynamic programming (Pascal's rule: C(n, r) = C(n-1, r-1) + C(n-1, r)). The input has three lines: the first line is 1, the second line holds n (as a single-element array), and the third line holds r. Return the exact value.",
    "examples": [
      {
        "input": "1\n5\n2",
        "output": "10",
        "explanation": "C(5, 2) = 10."
      },
      {
        "input": "1\n10\n3",
        "output": "120",
        "explanation": "C(10, 3) = 120."
      },
      {
        "input": "1\n0\n0",
        "output": "1",
        "explanation": "C(0, 0) = 1: there is exactly one way to choose nothing."
      }
    ],
    "constraints": [
      "0 <= r <= n <= 30.",
      "The exact value always fits in a 32-bit signed integer."
    ],
    "io": "array-k",
    "testCases": [
      {
        "input": "1\n5\n2",
        "expectedOutput": "10"
      },
      {
        "input": "1\n10\n3",
        "expectedOutput": "120"
      },
      {
        "input": "1\n0\n0",
        "expectedOutput": "1"
      },
      {
        "input": "1\n30\n15",
        "expectedOutput": "155117520"
      },
      {
        "input": "1\n20\n10",
        "expectedOutput": "184756"
      },
      {
        "input": "1\n7\n0",
        "expectedOutput": "1"
      },
      {
        "input": "1\n7\n7",
        "expectedOutput": "1"
      },
      {
        "input": "1\n12\n5",
        "expectedOutput": "792"
      },
      {
        "input": "1\n25\n12",
        "expectedOutput": "5200300"
      },
      {
        "input": "1\n1\n1",
        "expectedOutput": "1"
      },
      {
        "input": "1\n15\n2",
        "expectedOutput": "105"
      },
      {
        "input": "1\n30\n0",
        "expectedOutput": "1"
      }
    ]
  }
];
const getDsaQuestion = (id) => DSA_QUESTION_BANK.find((q) => q.id === id);
export { DSA_QUESTION_BANK, getDsaQuestion };
export default DSA_QUESTION_BANK;