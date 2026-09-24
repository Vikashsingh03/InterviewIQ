export const APTITUDE_SECTIONS = [
  {
    id: "quants",
    label: "Quantitative Aptitude",
    short: "QUANTS",
    minutes: 15,
    questions: [
      { q: "A 240 m long train running at 72 km/h crosses a pole in:", options: ["10 s", "12 s", "15 s", "18 s"], answer: 1, explain: "72 km/h = 20 m/s. Time = 240 ÷ 20 = 12 s." },
      { q: "Simple interest on ₹8,000 at 6% p.a. for 3 years is:", options: ["₹1,240", "₹1,440", "₹1,600", "₹1,800"], answer: 1, explain: "SI = 8000 × 6 × 3 ÷ 100 = ₹1,440." },
      { q: "The average of the first 10 even numbers is:", options: ["10", "11", "12", "20"], answer: 1, explain: "First 10 evens are 2 to 20. Average = (2 + 20) ÷ 2 = 11." },
      { q: "35% of 640 is:", options: ["214", "224", "234", "244"], answer: 1, explain: "640 × 0.35 = 224." },
      { q: "If A:B = 3:4 and A + B = 84, then A =", options: ["32", "36", "40", "48"], answer: 1, explain: "A = 84 × 3 ÷ 7 = 36." },
      { q: "A can do a job in 12 days, B in 15 days. Working together they finish in:", options: ["6 days", "6⅔ days", "7 days", "7½ days"], answer: 1, explain: "1/12 + 1/15 = 9/60, so time = 60 ÷ 9 = 6⅔ days." },
      { q: "The HCF of 24, 36 and 48 is:", options: ["6", "8", "12", "24"], answer: 2, explain: "24 = 2³×3, 36 = 2²×3², 48 = 2⁴×3. Common part = 2²×3 = 12." },
      { q: "An article bought for ₹500 is sold for ₹650. The profit % is:", options: ["25%", "28%", "30%", "32%"], answer: 2, explain: "Profit = 150 on 500 → 150 ÷ 500 × 100 = 30%." },
      { q: "A car travels 150 km in 2.5 hours. Its speed is:", options: ["55 km/h", "60 km/h", "65 km/h", "70 km/h"], answer: 1, explain: "Speed = 150 ÷ 2.5 = 60 km/h." },
      { q: "A father's age is 3 times his son's age. The sum of their ages is 48. The son's age is:", options: ["12", "14", "16", "18"], answer: 0, explain: "3x + x = 48 → x = 12." },
      { q: "Compound interest on ₹10,000 at 10% p.a. for 2 years is:", options: ["₹2,000", "₹2,100", "₹2,200", "₹2,400"], answer: 1, explain: "10000 × 1.1² − 10000 = 12100 − 10000 = ₹2,100." },
      { q: "The probability of getting an even number when a die is rolled is:", options: ["1/3", "1/2", "2/3", "1/6"], answer: 1, explain: "Favourable outcomes 2, 4, 6 → 3 out of 6 = 1/2." },
      { q: "One pipe fills a tank in 6 hrs, another empties it in 8 hrs. With both open, the tank fills in:", options: ["24 hrs", "14 hrs", "12 hrs", "48 hrs"], answer: 0, explain: "Net rate = 1/6 − 1/8 = 1/24 → 24 hrs." },
      { q: "40 L of mixture has milk:water = 3:1. After adding 10 L of water, the new ratio is:", options: ["3:2", "2:1", "1:1", "4:3"], answer: 0, explain: "Milk = 30 L, water = 10 + 10 = 20 L → 30:20 = 3:2." },
      { q: "(45 × 12) ÷ 18 =", options: ["24", "28", "30", "36"], answer: 2, explain: "540 ÷ 18 = 30." }
    ]
  },
  {
    id: "logical",
    label: "Logical Reasoning",
    short: "LOGICAL",
    minutes: 15,
    questions: [
      { q: "Find the next number: 2, 6, 12, 20, 30, ?", options: ["36", "40", "42", "44"], answer: 2, explain: "Differences are 4, 6, 8, 10 → next difference 12 → 30 + 12 = 42." },
      { q: "Odd one out: Apple, Mango, Banana, Potato", options: ["Apple", "Mango", "Banana", "Potato"], answer: 3, explain: "Potato is a vegetable; the rest are fruits." },
      { q: "If CAT = 24 (C=3, A=1, T=20), then DOG =", options: ["24", "26", "28", "30"], answer: 1, explain: "D(4) + O(15) + G(7) = 26." },
      { q: "\"The brother of my mother's son\" is my:", options: ["Uncle", "Brother", "Cousin", "Nephew"], answer: 1, explain: "Your mother's son is your brother, and his brother is also your brother." },
      { q: "Facing north, you turn right, then turn right again. You now face:", options: ["North", "South", "East", "West"], answer: 1, explain: "North → right → East → right → South." },
      { q: "All pens are books. All books are chairs. Which conclusion follows?", options: ["All chairs are pens", "All pens are chairs", "Some pens are not chairs", "No conclusion follows"], answer: 1, explain: "Pens ⊆ Books ⊆ Chairs, so every pen is a chair." },
      { q: "Find the next number: 3, 9, 27, 81, ?", options: ["162", "243", "324", "729"], answer: 1, explain: "Each term is ×3 → 81 × 3 = 243." },
      { q: "Book : Pages :: Wall : ?", options: ["Cement", "Bricks", "Paint", "Roof"], answer: 1, explain: "A wall is built from bricks, just as a book is built from pages." },
      { q: "If yesterday was Friday, the day after tomorrow is:", options: ["Sunday", "Monday", "Saturday", "Tuesday"], answer: 1, explain: "Yesterday Friday → today Saturday → day after tomorrow Monday." },
      { q: "With A=1, B=2 … Z=26, the value of BAD is:", options: ["7", "9", "11", "13"], answer: 0, explain: "B(2) + A(1) + D(4) = 7." },
      { q: "Find the next number: 5, 11, 23, 47, ?", options: ["93", "95", "96", "101"], answer: 1, explain: "Pattern is ×2 + 1 → 47 × 2 + 1 = 95." },
      { q: "Odd one out: 121, 144, 169, 190", options: ["121", "144", "169", "190"], answer: 3, explain: "121 = 11², 144 = 12², 169 = 13². 190 is not a perfect square." },
      { q: "You walk 5 km east, then 3 km north. Your distance from the start is:", options: ["8 km", "√34 km", "4 km", "6 km"], answer: 1, explain: "By Pythagoras: √(5² + 3²) = √34 km." },
      { q: "\"All cats are animals. Some animals are black.\" Which follows?", options: ["Some cats are black", "All black things are cats", "No cats are black", "None follows"], answer: 3, explain: "The middle term 'animals' is undistributed in both premises, so no valid conclusion follows." },
      { q: "The angle between the clock hands at 3:15 is:", options: ["0°", "7.5°", "15°", "30°"], answer: 1, explain: "Minute hand at 90°, hour hand at 97.5° → difference 7.5°." }
    ]
  },
  {
    id: "verbal",
    label: "Verbal Ability",
    short: "VERBAL",
    minutes: 10,
    questions: [
      { q: "Choose the synonym of ABANDON:", options: ["Keep", "Leave", "Hold", "Cherish"], answer: 1, explain: "Abandon means to give up completely." },
      { q: "Choose the antonym of TRANSPARENT:", options: ["Clear", "Obvious", "Opaque", "Fragile"], answer: 2, explain: "Opaque means not letting light pass through." },
      { q: "\"To break the ice\" means:", options: ["To shatter ice", "To start a conversation", "To end a fight", "To feel cold"], answer: 1, explain: "It means to initiate conversation in a social setting." },
      { q: "One who can use both hands equally well is called:", options: ["Versatile", "Ambidextrous", "Dexterous", "Skilful"], answer: 1, explain: "Ambi = both, dextrous = right-handed/skilled." },
      { q: "Fill in the blank: She has lived here ___ 2019.", options: ["from", "for", "since", "by"], answer: 2, explain: "'Since' is used with a point in time; 'for' with a duration." },
      { q: "Spot the error: \"He don't like mangoes.\"", options: ["He", "don't", "like", "mangoes"], answer: 1, explain: "With he/she/it, 'don't' must be 'doesn't'." },
      { q: "Choose the synonym of CANDID:", options: ["Rude", "Frank", "Shy", "Clever"], answer: 1, explain: "Candid means truthful and straightforward." },
      { q: "Choose the antonym of BRAVE:", options: ["Bold", "Heroic", "Cowardly", "Strong"], answer: 2, explain: "Cowardly is the direct opposite of brave." },
      { q: "\"To bite the dust\" means:", options: ["To eat quickly", "To fail", "To work hard", "To travel far"], answer: 1, explain: "It means to suffer defeat or failure." },
      { q: "One who speaks many languages is called a:", options: ["Linguist", "Polyglot", "Orator", "Bilingual"], answer: 1, explain: "Poly = many, glot = tongue/language." },
      { q: "Fill in the blank: ___ you ever been to Delhi?", options: ["Have", "Has", "Did", "Are"], answer: 0, explain: "Present perfect with 'you' takes 'have'." },
      { q: "Choose the passive form of \"She wrote a letter.\":", options: ["A letter is written by her", "A letter was written by her", "A letter has written by her", "She was written a letter"], answer: 1, explain: "Past simple active becomes was/were + past participle." },
      { q: "Choose the synonym of ENORMOUS:", options: ["Tiny", "Huge", "Narrow", "Brief"], answer: 1, explain: "Enormous means extremely large." },
      { q: "Choose the antonym of ANCIENT:", options: ["Old", "Modern", "Antique", "Classic"], answer: 1, explain: "Modern is the opposite of ancient." },
      { q: "The fear of heights is called:", options: ["Claustrophobia", "Acrophobia", "Hydrophobia", "Nyctophobia"], answer: 1, explain: "Acro = height, phobia = fear." }
    ]
  }
];

export const APTITUDE_META = {
  marksPerQuestion: 1,
  negativeMarking: 0
};

export function aptitudeVerdict(pct) {
  if (pct >= 80) return { title: "Outstanding", note: "Placement-ready. This score clears almost every company's aptitude cutoff." };
  if (pct >= 60) return { title: "Strong", note: "Above most cutoffs. A little polish on weak sections and you're set." };
  if (pct >= 40) return { title: "Fair", note: "Around the cutoff zone. Speed and accuracy both need work." };
  return { title: "Needs Practice", note: "Below typical cutoffs. Drill one section daily and retake." };
}
