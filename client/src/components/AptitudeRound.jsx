import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";
import { ServerUrl } from "../App";
import {
  BsClockHistory, BsFlag, BsFlagFill, BsArrowLeft, BsArrowRight, BsCheckLg, BsX,
  BsTrophy, BsBoxArrowRight, BsCalculator, BsGrid3X3GapFill, BsChevronDown,
  BsArrowCounterclockwise, BsPatchCheckFill, BsExclamationTriangle, BsLightningChargeFill
} from "react-icons/bs";

const APTITUDE_SECTIONS = [
  {
    id: "quants",
    label: "Quantitative Aptitude",
    short: "QUANTS",
    minutes: 30,
    questions: [
      { tag: "TCS NQT", q: "What is the unit digit of 3^200?", options: ["1", "3", "7", "9"], answer: 0, steps: ["Unit digits of powers of 3 repeat every 4: 3, 9, 7, 1.", "200 / 4 = 50 with remainder 0, so the cycle completes exactly.", "Remainder 0 means we take the 4th value of the cycle."], explain: "Answer: 1" },
      { tag: "Wipro", q: "Which of the following numbers is divisible by 11?", options: ["2728", "2738", "2729", "2719"], answer: 0, steps: ["Test: (sum of digits in odd positions) - (sum of digits in even positions) must be 0 or a multiple of 11.", "For 2728: (2 + 2) - (7 + 8) = 4 - 15 = -11.", "-11 is a multiple of 11. The other options fail this test."], explain: "Answer: 2728" },
      { tag: "TCS NQT", q: "The HCF of two numbers is 12 and their LCM is 180. If one number is 36, the other number is:", options: ["48", "54", "60", "72"], answer: 2, steps: ["Rule: first number x second number = HCF x LCM.", "Other number = (12 x 180) / 36.", "2160 / 36 = 60."], explain: "Answer: 60" },
      { tag: "TCS NQT", q: "A factory's production (in tonnes): 2019 - 120, 2020 - 150, 2021 - 180, 2022 - 135, 2023 - 210. In which year was the percentage increase over the previous year the highest?", options: ["2020", "2021", "2022", "2023"], answer: 3, steps: ["2020: (150 - 120) / 120 = 25%.", "2021: (180 - 150) / 150 = 20%.", "2022: production fell, so no increase.", "2023: (210 - 135) / 135 = 55.6% - the highest."], explain: "Answer: 2023" },
      { tag: "Infosys", q: "A pie chart shows monthly expenses: Food 30%, Rent 25%, Education 20%, Savings 15%, Others 10%. If total income is Rs. 60000, how much goes to Education?", options: ["Rs. 10000", "Rs. 12000", "Rs. 15000", "Rs. 18000"], answer: 1, steps: ["Education share = 20% of total income.", "20% x 60000 = 12000."], explain: "Answer: Rs. 12000" },
      { tag: "TCS NQT", q: "If the price of sugar rises by 20%, by what percent must a household reduce its consumption to keep the expenditure unchanged?", options: ["15%", "16.67%", "18%", "20%"], answer: 1, steps: ["Let old price = 100 and old consumption = 100 units, so expense = 10000.", "New price = 120. To keep expense 10000, new consumption = 10000 / 120 = 83.33.", "Reduction = 100 - 83.33 = 16.67%.", "Shortcut: reduction % = (rise / (100 + rise)) x 100 = 20/120 x 100."], explain: "Answer: 16.67%" },
      { tag: "Wipro", q: "A shopkeeper sells an article at 25% profit. If he had bought it 10% cheaper and sold it for Rs. 45 less, he would still gain 25%. Find the cost price.", options: ["Rs. 320", "Rs. 340", "Rs. 360", "Rs. 400"], answer: 2, steps: ["Let CP = x. Original SP = 1.25x.", "New CP = 0.9x and new SP = 1.25x - 45, with profit still 25%.", "(1.25x - 45 - 0.9x) / 0.9x = 0.25.", "0.35x - 45 = 0.225x gives 0.125x = 45, so x = 360."], explain: "Answer: Rs. 360" },
      { tag: "HCL", q: "A shopkeeper offers a 20% discount on the marked price and still gains 20%. If the marked price is Rs. 600, find the cost price.", options: ["Rs. 380", "Rs. 400", "Rs. 420", "Rs. 440"], answer: 1, steps: ["SP after 20% discount = 600 x 0.80 = Rs. 480.", "This SP carries a 20% profit, so CP = 480 / 1.20.", "CP = Rs. 400."], explain: "Answer: Rs. 400" },
      { tag: "TCS NQT", q: "Find the simple interest on Rs. 5000 at 8% per annum for 3 years.", options: ["Rs. 1000", "Rs. 1100", "Rs. 1200", "Rs. 1400"], answer: 2, steps: ["SI = P x R x T / 100.", "= 5000 x 8 x 3 / 100.", "= 1200."], explain: "Answer: Rs. 1200" },
      { tag: "Infosys", q: "Rs. 10000 is invested at 10% per annum compound interest for 2 years. Find the amount.", options: ["Rs. 12000", "Rs. 12100", "Rs. 12200", "Rs. 12500"], answer: 1, steps: ["Amount = P(1 + r/100)^n.", "= 10000 x (1.10)^2 = 10000 x 1.21.", "= Rs. 12100."], explain: "Answer: Rs. 12100" },
      { tag: "TCS NQT", q: "The difference between compound interest and simple interest on Rs. 8000 for 2 years at 5% per annum is:", options: ["Rs. 15", "Rs. 20", "Rs. 25", "Rs. 30"], answer: 1, steps: ["For 2 years: difference = P x (r/100)^2.", "= 8000 x (0.05)^2 = 8000 x 0.0025.", "= Rs. 20."], explain: "Answer: Rs. 20" },
      { tag: "Cognizant", q: "If A:B = 2:3 and B:C = 4:5, find A:C.", options: ["8:15", "2:5", "8:12", "4:15"], answer: 0, steps: ["Make B common: A:B = 2:3 = 8:12 (multiply by 4).", "B:C = 4:5 = 12:15 (multiply by 3).", "So A:B:C = 8:12:15 and A:C = 8:15."], explain: "Answer: 8:15" },
      { tag: "Accenture", q: "The ratio of the present ages of A and B is 5:7. Eight years ago, the ratio was 3:5. What is B's present age?", options: ["24 years", "26 years", "28 years", "32 years"], answer: 2, steps: ["Let present ages be 5x and 7x.", "(5x - 8) / (7x - 8) = 3/5.", "25x - 40 = 21x - 24 gives 4x = 16, so x = 4.", "B = 7 x 4 = 28 years."], explain: "Answer: 28 years" },
      { tag: "Wipro", q: "The average of 9 numbers is 32. If one number is excluded, the average becomes 30. Find the excluded number.", options: ["42", "46", "48", "52"], answer: 2, steps: ["Sum of all 9 numbers = 9 x 32 = 288.", "Sum of remaining 8 numbers = 8 x 30 = 240.", "Excluded number = 288 - 240 = 48."], explain: "Answer: 48" },
      { tag: "Tech Mahindra", q: "A invests Rs. 10000 for 9 months and B invests Rs. 12000 for 6 months. If the total profit is Rs. 18000, what is B's share?", options: ["Rs. 7000", "Rs. 8000", "Rs. 9000", "Rs. 10000"], answer: 1, steps: ["Effective capital: A = 10000 x 9 = 90000; B = 12000 x 6 = 72000.", "Ratio = 90000:72000 = 5:4.", "B's share = 18000 x 4/9 = Rs. 8000."], explain: "Answer: Rs. 8000" },
      { tag: "Infosys", q: "A can do a piece of work in 12 days and B in 15 days. They work together for 4 days, then A leaves. In how many more days will B finish the remaining work?", options: ["4 days", "5 days", "6 days", "8 days"], answer: 2, steps: ["Total work = LCM(12, 15) = 60 units.", "A = 5 units/day, B = 4 units/day.", "4 days together = 4 x 9 = 36 units done.", "Remaining 24 units / B's 4 per day = 6 days."], explain: "Answer: 6 days" },
      { tag: "HCL", q: "A and B together can do a piece of work in 8 days. A alone can do it in 12 days. In how many days can B alone do it?", options: ["20 days", "22 days", "24 days", "28 days"], answer: 2, steps: ["B's one-day work = combined work - A's work.", "= 1/8 - 1/12 = (3 - 2)/24 = 1/24.", "So B alone takes 24 days."], explain: "Answer: 24 days" },
      { tag: "Cognizant", q: "Pipe A fills a tank in 6 hours, pipe B in 8 hours, while pipe C empties it in 12 hours. If all three are opened together, in how much time will the tank be filled?", options: ["4 hrs", "4 hrs 30 min", "4 hrs 48 min", "5 hrs"], answer: 2, steps: ["Net filling rate = 1/6 + 1/8 - 1/12.", "= (4 + 3 - 2)/24 = 5/24 of the tank per hour.", "Time = 24/5 hours = 4 hours 48 minutes."], explain: "Answer: 4 hrs 48 min" },
      { tag: "Infosys", q: "Walking at 4 km/h, a man reaches his office 15 minutes late; walking at 6 km/h, he reaches 10 minutes early. Find the distance to his office.", options: ["4 km", "5 km", "6 km", "7 km"], answer: 1, steps: ["Time difference between the two trips = 15 + 10 = 25 minutes = 25/60 hour.", "d/4 - d/6 = 25/60.", "d/12 = 5/12, so d = 5 km."], explain: "Answer: 5 km" },
      { tag: "TCS NQT", q: "A 270 m long train running at 54 km/h crosses a man standing on the platform in:", options: ["15 s", "18 s", "20 s", "24 s"], answer: 1, steps: ["Convert speed: 54 km/h = 54 x 5/18 = 15 m/s.", "Time = distance / speed = 270 / 15.", "= 18 seconds."], explain: "Answer: 18 s" },
      { tag: "HCL", q: "Two trains 140 m and 160 m long run at 60 km/h and 40 km/h in opposite directions. In what time do they cross each other?", options: ["9 s", "10 s", "10.8 s", "12 s"], answer: 2, steps: ["Opposite directions: relative speed = 60 + 40 = 100 km/h.", "100 km/h = 100 x 5/18 = 250/9 m/s.", "Total distance = 140 + 160 = 300 m.", "Time = 300 / (250/9) = 10.8 s."], explain: "Answer: 10.8 s" },
      { tag: "TCS NQT", q: "A boat goes 24 km upstream and 28 km downstream in 6 hours. It goes 30 km upstream and 21 km downstream in 6.5 hours. Find the speed of the stream.", options: ["3 km/h", "4 km/h", "5 km/h", "6 km/h"], answer: 1, steps: ["Let upstream speed = u, downstream = v.", "24/u + 28/v = 6 and 30/u + 21/v = 6.5.", "Solving: u = 6 km/h, v = 14 km/h.", "Stream speed = (v - u)/2 = (14 - 6)/2 = 4 km/h."], explain: "Answer: 4 km/h" },
      { tag: "Infosys", q: "A vessel contains 40 litres of milk. 8 litres are drawn and replaced with water, and this is done once more. How much milk remains in the vessel?", options: ["24 litres", "25.6 litres", "26.4 litres", "28 litres"], answer: 1, steps: ["After each draw, milk fraction remaining = 32/40 = 4/5.", "After 2 replacements: 40 x (4/5)^2.", "= 40 x 16/25 = 25.6 litres."], explain: "Answer: 25.6 litres" },
      { tag: "Wipro", q: "In what ratio must rice at Rs. 30/kg and rice at Rs. 45/kg be mixed to get a mixture worth Rs. 36/kg?", options: ["3:2", "2:3", "1:2", "2:1"], answer: 0, steps: ["Rule of allegation: cheaper = 30, dearer = 45, mean = 36.", "Ratio = (45 - 36) : (36 - 30) = 9:6.", "= 3:2."], explain: "Answer: 3:2" },
      { tag: "Accenture", q: "The length of a rectangle is increased by 20% and its breadth is decreased by 20%. What is the change in its area?", options: ["4% increase", "4% decrease", "No change", "8% decrease"], answer: 1, steps: ["New area = 1.20 x 0.80 = 0.96 of the original.", "Change = 1 - 0.96 = 0.04 = 4% decrease.", "Shortcut: net % = +20 - 20 - (20x20)/100 = -4%."], explain: "Answer: 4% decrease" },
      { tag: "HCL", q: "Find the total surface area of a sphere of radius 7 cm.", options: ["512 cm^2", "616 cm^2", "706 cm^2", "814 cm^2"], answer: 1, steps: ["Surface area of a sphere = 4 x pi x r^2.", "= 4 x (22/7) x 7 x 7.", "= 616 cm^2."], explain: "Answer: 616 cm^2" },
      { tag: "TCS NQT", q: "In how many ways can 5 boys and 4 girls be seated in a row such that no two girls sit together?", options: ["21600", "43200", "86400", "14400"], answer: 1, steps: ["Seat the 5 boys first: 5! = 120 ways.", "This creates 6 gaps; choose 4 for the girls and arrange them: 6P4 = 6x5x4x3 = 360.", "Total = 120 x 360 = 43200."], explain: "Answer: 43200" },
      { tag: "Cognizant", q: "How many 3-digit numbers can be formed from the digits 1, 2, 3, 4, 5 without repetition?", options: ["50", "60", "75", "125"], answer: 1, steps: ["Hundreds place: 5 choices.", "Tens place: 4 remaining choices.", "Ones place: 3 remaining choices.", "Total = 5 x 4 x 3 = 60."], explain: "Answer: 60" },
      { tag: "Infosys", q: "Two dice are thrown simultaneously. What is the probability that the sum of the numbers shown is 9?", options: ["1/6", "1/9", "5/36", "1/12"], answer: 1, steps: ["Total outcomes = 6 x 6 = 36.", "Favourable: (3,6), (4,5), (5,4), (6,3) = 4 outcomes.", "Probability = 4/36 = 1/9."], explain: "Answer: 1/9" },
      { tag: "Wipro", q: "A bag contains 4 red and 5 blue balls. Two balls are drawn at random. What is the probability that both are red?", options: ["1/6", "2/9", "1/9", "5/18"], answer: 0, steps: ["Total ways to draw 2 from 9 balls: C(9,2) = 36.", "Ways to draw 2 red from 4: C(4,2) = 6.", "Probability = 6/36 = 1/6."], explain: "Answer: 1/6" }
    ]
  },
  {
    id: "logical",
    label: "Logical Reasoning",
    short: "LOGICAL",
    minutes: 30,
    questions: [
      { tag: "TCS NQT", q: "Find the next number in the series: 2, 6, 12, 20, 30, ?", options: ["36", "40", "42", "48"], answer: 2, steps: ["Write each term as n(n+1): 1x2, 2x3, 3x4, 4x5, 5x6.", "The next term is 6x7.", "= 42."], explain: "Answer: 42" },
      { tag: "Infosys", q: "Find the next number in the series: 3, 5, 9, 17, 33, ?", options: ["49", "57", "65", "66"], answer: 2, steps: ["3x2-1 = 5, 5x2-1 = 9, 9x2-1 = 17, 17x2-1 = 33.", "Pattern: multiply by 2, subtract 1.", "Next: 33x2-1 = 65."], explain: "Answer: 65" },
      { tag: "Wipro", q: "Find the next number in the series: 1, 8, 27, 64, ?", options: ["100", "121", "125", "144"], answer: 2, steps: ["1 = 1^3, 8 = 2^3, 27 = 3^3, 64 = 4^3.", "These are perfect cubes.", "Next: 5^3 = 125."], explain: "Answer: 125" },
      { tag: "Wipro", q: "Find the next letter in the series: B, E, H, K, N, ?", options: ["P", "Q", "R", "S"], answer: 1, steps: ["B to E = +3, E to H = +3, H to K = +3, K to N = +3.", "Constant jump of 3 positions.", "N + 3 = Q."], explain: "Answer: Q" },
      { tag: "HCL", q: "Find the next term in the series: A1, C4, F9, J16, ?", options: ["O25", "M25", "O36", "N25"], answer: 0, steps: ["Letters: A to C (+2), C to F (+3), F to J (+4) - jumps increase by 1.", "Next jump is +5: J to O.", "Numbers: 1, 4, 9, 16 are 1^2, 2^2, 3^2, 4^2 - next is 5^2 = 25.", "Term = O25."], explain: "Answer: O25" },
      { tag: "TCS NQT", q: "If APPLE is coded as BQQMF, how is MANGO coded in the same language?", options: ["NBOHP", "NCPHQ", "MBNOQ", "NBOHQ"], answer: 0, steps: ["Compare: A->B, P->Q, P->Q, L->M, E->F - every letter shifts +1.", "Apply +1 to MANGO: M->N, A->B, N->O, G->H, O->P.", "= NBOHP."], explain: "Answer: NBOHP" },
      { tag: "TCS NQT", q: "If CAT is coded as 3120, how is DOG coded in the same language?", options: ["4157", "4715", "1547", "4175"], answer: 0, steps: ["The code joins alphabet positions: C = 3, A = 1, T = 20, giving 3120.", "For DOG: D = 4, O = 15, G = 7.", "Joined: 4157."], explain: "Answer: 4157" },
      { tag: "Accenture", q: "If blue is called red, red is called green, and green is called black, what is the colour of grass?", options: ["Red", "Green", "Black", "Blue"], answer: 2, steps: ["Grass is naturally green.", "In this code language, 'green' is called 'black'.", "So the answer is black."], explain: "Answer: Black" },
      { tag: "Accenture", q: "A is B's sister. C is B's mother. D is C's father. E is D's mother. How is A related to D?", options: ["Granddaughter", "Daughter", "Niece", "Grandmother"], answer: 0, steps: ["C is B's mother and A is B's sister, so A is C's daughter.", "D is C's father, so D is A's grandfather.", "Therefore A is D's granddaughter."], explain: "Answer: Granddaughter" },
      { tag: "Infosys", q: "Pointing to a photograph, Ravi said, 'She is the daughter of my grandfather's only son.' How is she related to Ravi?", options: ["Sister", "Mother", "Aunt", "Cousin"], answer: 0, steps: ["Grandfather's only son = Ravi's father.", "Father's daughter = Ravi's sister."], explain: "Answer: Sister" },
      { tag: "TCS NQT", q: "A man walks 5 km north, turns right and walks 3 km, then turns right and walks 5 km. How far is he from his starting point?", options: ["2 km", "3 km", "5 km", "8 km"], answer: 1, steps: ["Path: 5 km north, 3 km east, 5 km south.", "The north and south legs cancel each other.", "He ends 3 km east of the start, so distance = 3 km."], explain: "Answer: 3 km" },
      { tag: "Infosys", q: "Find the missing number in the matrix: Row 1: 3, 5, 7 | Row 2: 2, 4, 6 | Row 3: 5, 9, ?", options: ["11", "12", "13", "14"], answer: 2, steps: ["Look column-wise: column 1 gives 3 + 2 = 5.", "Column 2: 5 + 4 = 9.", "Column 3: 7 + 6 = 13."], explain: "Answer: 13" },
      { tag: "Infosys", q: "Six friends A, B, C, D, E, F sit in a row facing north. A sits third to the left of D. B sits at one extreme end. C is the immediate neighbour of both A and F. Who sits at the other extreme end?", options: ["A", "C", "E", "F"], answer: 2, steps: ["A third to the left of D: place A = 2, D = 5.", "C neighbours both A and F: C = 3, F = 4.", "B at one extreme: B = 6, leaving E = 1.", "Row: E A C F D B. The other extreme end is E."], explain: "Answer: E" },
      { tag: "Wipro", q: "A, B, C, D, E, F sit around a circle facing the centre. A is opposite D. B sits between A and C. Who sits opposite B?", options: ["D", "E", "F", "A"], answer: 1, steps: ["Place A at position 1; D opposite at position 4.", "B between A and C: B = 2, C = 3.", "E and F take positions 5 and 6.", "Opposite B (position 2) is position 5 = E."], explain: "Answer: E" },
      { tag: "TCS NQT", q: "Statements: All pens are books. All books are tables. Conclusions: I. All pens are tables. II. Some tables are pens.", options: ["Only I follows", "Only II follows", "Both I and II follow", "Neither follows"], answer: 2, steps: ["Draw nested sets: pens inside books, books inside tables.", "Every pen is inside tables, so I follows.", "Since all pens are tables, it must be true that some tables are pens, so II follows."], explain: "Answer: Both I and II follow" },
      { tag: "Cognizant", q: "Statements: Some cats are dogs. All dogs are animals. No animal is a bird. Conclusions: I. Some cats are animals. II. No dog is a bird.", options: ["Only I follows", "Only II follows", "Both follow", "Neither follows"], answer: 2, steps: ["Some cats are dogs, and every dog is an animal: the overlapping cats are animals, so I follows.", "Every dog is an animal, and no animal is a bird: no dog can be a bird, so II follows."], explain: "Answer: Both follow" },
      { tag: "Wipro", q: "Statement: All students who passed the exam received a scholarship. Conclusions: I. Some students received a scholarship. II. All students received a scholarship.", options: ["Only I follows", "Only II follows", "Both follow", "Neither follows"], answer: 0, steps: ["Only the students who passed received a scholarship, so at least some students did: I follows.", "'All students received' claims every student passed, which is not given: II does not follow."], explain: "Answer: Only I follows" },
      { tag: "HCL", q: "Statement: 'Buy our laptop - the fastest in its class.' Which assumption is implicit? I. Customers value speed in a laptop. II. The company's claim is scientifically proven.", options: ["Only I is implicit", "Only II is implicit", "Both are implicit", "Neither is implicit"], answer: 0, steps: ["Advertising speed as the selling point only makes sense if buyers care about speed: I is implicit.", "The statement assumes nothing about proof or testing: II is not implicit."], explain: "Answer: Only I is implicit" },
      { tag: "Infosys", q: "What is the value of x? Statement I: 2x + 3 = 11. Statement II: x is a prime number.", options: ["Statement I alone is sufficient", "Statement II alone is sufficient", "Both statements together are needed", "Neither statement is sufficient"], answer: 0, steps: ["From I: 2x = 8, so x = 4. Sufficient alone.", "From II: x could be 2, 3, 5, 7... undetermined. Not sufficient."], explain: "Answer: Statement I alone is sufficient" },
      { tag: "TCS NQT", q: "Is N divisible by 6? Statement I: N is divisible by 2. Statement II: N is divisible by 3.", options: ["I alone is sufficient", "II alone is sufficient", "Both together are needed", "Neither is sufficient"], answer: 2, steps: ["Divisibility by 6 requires divisibility by both 2 and 3.", "Neither statement alone guarantees the other factor.", "Together they are sufficient."], explain: "Answer: Both together are needed" },
      { tag: "Infosys", q: "In the classic puzzle SEND + MORE = MONEY, each letter is a unique digit with S=9, E=5, N=6, D=7, M=1, O=0, R=8, Y=2. What is the value of MONEY?", options: ["10652", "10562", "10625", "16502"], answer: 0, steps: ["Substitute: SEND = 9567, MORE = 1085.", "Add: 9567 + 1085 = 10652.", "So MONEY = 10652."], explain: "Answer: 10652" },
      { tag: "TCS NQT", q: "At what time between 4 and 5 o'clock are the two hands of a clock together?", options: ["4:20", "4:21 9/11", "4:22", "4:25"], answer: 1, steps: ["The hands coincide every 65 5/11 minutes.", "After 4:00, they meet (12/11) x 4 hours later.", "= 48/11 minutes = 4 minutes 21 9/11 seconds past 4."], explain: "Answer: 4:21 9/11" },
      { tag: "Accenture", q: "How many times do the hands of a clock coincide in 12 hours?", options: ["10", "11", "12", "13"], answer: 1, steps: ["The hands meet once every 65 5/11 minutes.", "In 12 hours: (12 x 60) / 65.45 = 11 meetings.", "It is 11, not 12, because the 12th meeting is the start of the next 12-hour cycle."], explain: "Answer: 11" },
      { tag: "Wipro", q: "If 1st January 2026 is a Thursday, what day of the week is 1st January 2027?", options: ["Thursday", "Friday", "Saturday", "Sunday"], answer: 1, steps: ["2026 is not a leap year: 365 days = 52 weeks + 1 extra day.", "So the weekday shifts forward by exactly one day.", "Thursday + 1 = Friday."], explain: "Answer: Friday" },
      { tag: "Accenture", q: "A cube is painted red on all faces and cut into 64 smaller equal cubes. How many small cubes have exactly two faces painted?", options: ["8", "16", "24", "32"], answer: 2, steps: ["64 = 4^3, so there are 4 small cubes along each edge.", "Cubes with exactly two painted faces sit on the edges, excluding corners.", "12 edges x (4 - 2) = 24."], explain: "Answer: 24" },
      { tag: "HCL", q: "On a standard dice, 3 is on the top face and 1 faces north. Which number faces south?", options: ["2", "5", "6", "4"], answer: 2, steps: ["On a standard dice, opposite faces add to 7.", "1 is opposite 6.", "1 faces north, so 6 faces south."], explain: "Answer: 6" },
      { tag: "TCS NQT", q: "In a row of 40 students, Ravi is 12th from the left end. What is his position from the right end?", options: ["27th", "28th", "29th", "30th"], answer: 2, steps: ["Position from the right = total - position from the left + 1.", "= 40 - 12 + 1 = 29."], explain: "Answer: 29th" },
      { tag: "Wipro", q: "Doctor : Hospital :: Teacher : ?", options: ["Student", "School", "Book", "Class"], answer: 1, steps: ["The relation is worker : workplace.", "A doctor works in a hospital.", "A teacher works in a school."], explain: "Answer: School" },
      { tag: "Cognizant", q: "8 : 64 :: 12 : ?", options: ["124", "132", "144", "156"], answer: 2, steps: ["8 : 64 follows 8^2 = 64.", "Apply the same: 12^2 = 144."], explain: "Answer: 144" },
      { tag: "Tech Mahindra", q: "Find the odd one out: 121, 144, 169, 180", options: ["121", "144", "169", "180"], answer: 3, steps: ["121 = 11^2, 144 = 12^2, 169 = 13^2: all perfect squares.", "180 is not a perfect square.", "So 180 is the odd one out."], explain: "Answer: 180" }
    ]
  }
,
  {
    id: "verbal",
    label: "Verbal Ability",
    short: "VERBAL",
    minutes: 30,
    questions: [
      { tag: "TCS NQT", q: "Read the passage and answer: 'The modern workplace has undergone a radical transformation. Remote work, once considered a temporary arrangement, has become a permanent feature for many organisations. While this shift offers flexibility, it also demands a new kind of discipline from employees. Companies are learning to measure productivity not by hours spent at a desk, but by outcomes delivered. However, the absence of face-to-face interaction can weaken team cohesion if not actively managed. Leaders who thrive in this environment are those who combine clear communication with genuine empathy. For employees, the challenge lies in maintaining work-life boundaries when the office is always just a room away. Junior employees, in particular, often miss the informal mentoring that happens naturally in physical offices. The future of work is not about where we work, but how we work - with intentionality, flexibility, and trust.' Question: According to the passage, companies now measure productivity by:", options: ["Hours spent at the desk", "Outcomes delivered", "Number of meetings attended", "Employee attendance records"], answer: 1, steps: ["The passage says companies are 'learning to measure it by outcomes delivered'.", "'Hours spent at a desk' is described as the old measure."], explain: "Answer: Outcomes delivered" },
      { tag: "TCS NQT", q: "Same passage as Q01. Who, according to the passage, misses informal mentoring the most?", options: ["Senior managers", "Junior employees", "Remote leaders", "HR professionals"], answer: 1, steps: ["The passage states: 'Junior employees, in particular, often miss the informal mentoring...'.", "This is directly stated in the text."], explain: "Answer: Junior employees" },
      { tag: "Infosys", q: "Same passage as Q01. What does the passage suggest about the future of work?", options: ["Everyone will return to offices", "Flexibility must be paired with accountability", "Remote work will be banned", "Empathy is no longer needed"], answer: 1, steps: ["The closing line: the future is about 'how we work - with intentionality, flexibility, and trust'.", "Flexibility appears alongside discipline and trust, i.e. paired with accountability."], explain: "Answer: Flexibility must be paired with accountability" },
      { tag: "Wipro", q: "Read the passage and answer: 'Artificial intelligence is reshaping industries at a pace that few predicted. From healthcare diagnostics to financial forecasting, machine learning models are performing tasks that once required years of human training. Yet this rapid advancement brings significant challenges. The ethical implications of automated decision-making are still being debated, particularly when algorithms influence hiring, lending, and law enforcement. Critics argue that without proper regulation, AI could deepen existing social inequalities. Supporters counter that the technology, if guided well, will free humans from repetitive labour and allow them to focus on creative and strategic work. The truth likely lies somewhere in between. What is clear is that AI literacy - understanding how these systems work and where they fail - is becoming as essential as reading and arithmetic were a century ago.' Question: According to supporters, AI will:", options: ["Replace all human workers", "Free people for creative and strategic work", "Make regulation unnecessary", "End social inequality"], answer: 1, steps: ["Supporters 'argue this will free people for creative and strategic work'.", "Directly stated in the passage."], explain: "Answer: Free people for creative and strategic work" },
      { tag: "Wipro", q: "Same passage as Q04. What is the main concern about AI regulation?", options: ["AI is too expensive", "Rules struggle to keep up with technology", "AI cannot learn", "Companies dislike AI"], answer: 1, steps: ["The passage says 'the technology evolves faster than legislation'.", "That means rule-making cannot keep pace with the technology."], explain: "Answer: Rules struggle to keep up with technology" },
      { tag: "HCL", q: "Same passage as Q04. AI literacy is compared to:", options: ["Learning a new language", "Reading and arithmetic", "Playing a sport", "Studying history"], answer: 1, steps: ["The passage: AI literacy is 'becoming as essential as reading and arithmetic were a century ago'.", "Direct comparison in the text."], explain: "Answer: Reading and arithmetic" },
      { tag: "TCS NQT", q: "Choose the word closest in meaning to CANDID:", options: ["Rude", "Frank", "Shy", "Clever"], answer: 1, steps: ["Candid means saying what you truly think, openly and honestly.", "Closest match: frank."], explain: "Answer: Frank" },
      { tag: "Infosys", q: "Choose the word closest in meaning to ABANDON:", options: ["Keep", "Forsake", "Join", "Build"], answer: 1, steps: ["Abandon means to give up completely.", "Closest match: forsake."], explain: "Answer: Forsake" },
      { tag: "Accenture", q: "Choose the correct indirect speech: He said, 'I am busy today.'", options: ["He said that he is busy today.", "He said that he was busy that day.", "He says that he was busy today.", "He said that I was busy today."], answer: 1, steps: ["The reporting verb 'said' is in the past, so the reported clause shifts to past: 'am' becomes 'was'.", "'Today' becomes 'that day'.", "Correct: 'He said that he was busy that day.'"], explain: "Answer: He said that he was busy that day." },
      { tag: "Wipro", q: "Choose the word OPPOSITE in meaning to TRANSPARENT:", options: ["Clear", "Opaque", "Obvious", "Bright"], answer: 1, steps: ["Transparent means clear, see-through.", "Opposite: opaque."], explain: "Answer: Opaque" },
      { tag: "HCL", q: "Choose the word OPPOSITE in meaning to VICTORY:", options: ["Success", "Defeat", "Triumph", "Glory"], answer: 1, steps: ["Victory means winning.", "Opposite: defeat."], explain: "Answer: Defeat" },
      { tag: "TCS NQT", q: "Choose the word OPPOSITE in meaning to ANCIENT:", options: ["Old", "Modern", "Antique", "Aged"], answer: 1, steps: ["Ancient means very old.", "Opposite: modern."], explain: "Answer: Modern" },
      { tag: "Cognizant", q: "Choose the word OPPOSITE in meaning to EXPAND:", options: ["Extend", "Contract", "Enlarge", "Stretch"], answer: 1, steps: ["Expand means to grow larger.", "Opposite: contract."], explain: "Answer: Contract" },
      { tag: "Infosys", q: "Spot the error: (A) Neither of the two candidates (B) have submitted (C) their application yet.", options: ["A", "B", "C", "No error"], answer: 1, steps: ["'Neither' is singular.", "So the verb must be singular: 'has submitted', not 'have submitted'.", "The error is in part B."], explain: "Answer: B" },
      { tag: "Wipro", q: "Spot the error: (A) The list of items (B) are lying (C) on the table.", options: ["A", "B", "C", "No error"], answer: 1, steps: ["The subject is 'list' (singular); 'of items' is just a phrase.", "The verb must agree with 'list': 'is lying', not 'are lying'.", "The error is in part B."], explain: "Answer: B" },
      { tag: "TCS NQT", q: "Spot the error: (A) He is junior (B) than me (C) in experience.", options: ["A", "B", "C", "No error"], answer: 1, steps: ["'Junior', 'senior', 'inferior', 'superior' take 'to', not 'than'.", "Correct: 'junior to me'.", "The error is in part B."], explain: "Answer: B" },
      { tag: "Accenture", q: "Spot the error: (A) One of my friends (B) have gone (C) to Mumbai.", options: ["A", "B", "C", "No error"], answer: 1, steps: ["In 'one of my friends', the subject is 'one' (singular).", "The verb must be singular: 'has gone', not 'have gone'.", "The error is in part B."], explain: "Answer: B" },
      { tag: "HCL", q: "Choose the correct word: The match continued _____ despite the heavy rain.", options: ["unabated", "unabashed", "unaware", "unwary"], answer: 0, steps: ["Unabated means without weakening, at full force.", "The match continued at full intensity despite the rain.", "The other words do not fit the context."], explain: "Answer: unabated" },
      { tag: "Infosys", q: "Fill in the blank: She _____ the report before the meeting started.", options: ["has reviewed", "had reviewed", "reviews", "will review"], answer: 1, steps: ["Two past actions: reviewing the report happened first, the meeting started second.", "The earlier action takes the past perfect tense.", "Correct: 'had reviewed'."], explain: "Answer: had reviewed" },
      { tag: "Cognizant", q: "Choose the one-word substitution: A decision made by all members without opposition.", options: ["Unanimous", "Anonymous", "Ambiguous", "Uniform"], answer: 0, steps: ["No member opposed the decision, so everyone agreed.", "One word for full agreement: unanimous."], explain: "Answer: unanimous" },
      { tag: "TCS NQT", q: "Arrange in a logical sequence: P. The first computers filled entire rooms. Q. They consumed enormous amounts of electricity. R. Over decades, they shrank to fit on desks. S. Today, more power sits in our phones.", options: ["PQRS", "PRQS", "QPRS", "SPRQ"], answer: 0, steps: ["P introduces the first computers.", "Q describes them (rooms, electricity).", "R moves forward in time (shrinking to desks).", "S ends in the present (phones).", "Order: P -> Q -> R -> S."], explain: "Answer: PQRS" },
      { tag: "Wipro", q: "Arrange in a logical sequence: P. She opened the old diary. Q. Dust rose from its pages. R. Inside, she found letters from her grandmother. S. Reading them, she wept quietly.", options: ["PQRS", "PRQS", "QPSR", "RPQS"], answer: 0, steps: ["P: she opens the diary.", "Q: dust rises as it opens.", "R: she finds the letters inside.", "S: she reads them and weeps.", "Order: P -> Q -> R -> S."], explain: "Answer: PQRS" },
      { tag: "Infosys", q: "Fill in the blank: He has been working here _____ 2019.", options: ["for", "since", "from", "by"], answer: 1, steps: ["'Since' is used with a point of time (2019).", "'For' is used with a duration (e.g. five years).", "2019 is a point of time, so 'since' is correct."], explain: "Answer: since" },
      { tag: "Accenture", q: "Choose the correct sentence:", options: ["You will fail unless you work hard.", "You will fail until you work hard.", "You will fail lest you work hard.", "You will fail except you work hard."], answer: 0, steps: ["'Unless' means 'except if' or 'if not'.", "'You will fail unless you work hard' = you will fail if you do not work hard.", "The other options are ungrammatical in this context."], explain: "Answer: unless" },
      { tag: "HCL", q: "Choose the one-word substitution: A person who speaks many languages.", options: ["Linguist", "Polyglot", "Orator", "Bilingual"], answer: 1, steps: ["Poly = many, glot = tongue or language.", "A speaker of many languages: polyglot.", "Bilingual is only two; a linguist studies languages."], explain: "Answer: Polyglot" },
      { tag: "TCS NQT", q: "Choose the one-word substitution: One who can use both hands equally well.", options: ["Versatile", "Ambidextrous", "Dexterous", "Skilful"], answer: 1, steps: ["Ambi = both, dextrous = skilled with hands.", "One word: ambidextrous."], explain: "Answer: Ambidextrous" },
      { tag: "Wipro", q: "Choose the correct meaning of the idiom 'to bite the dust':", options: ["To eat quickly", "To be defeated", "To work hard", "To hide"], answer: 1, steps: ["The literal image is falling face-down in defeat.", "Idiom meaning: to fail or be defeated."], explain: "Answer: To be defeated" },
      { tag: "Infosys", q: "Choose the correct meaning of the idiom 'to let the cat out of the bag':", options: ["To free an animal", "To reveal a secret", "To start a fight", "To waste time"], answer: 1, steps: ["Letting the cat out reveals what was hidden in the bag.", "Idiom meaning: to reveal a secret, usually accidentally."], explain: "Answer: To reveal a secret" },
      { tag: "Accenture", q: "Choose the correct passive voice: She wrote a letter.", options: ["A letter was written by her.", "A letter is written by her.", "A letter has been written by her.", "She was written a letter."], answer: 0, steps: ["Active: She (subject) wrote (past tense) a letter (object).", "Passive: the object becomes the subject + was/were + past participle.", "Correct: 'A letter was written by her.'"], explain: "Answer: A letter was written by her." },
      { tag: "TCS NQT", q: "Choose the correct active voice: The work was completed by them.", options: ["They completed the work.", "They have completed the work.", "The work completed them.", "They complete the work."], answer: 0, steps: ["Passive: 'The work was completed by them.'", "The agent 'them' becomes the subject 'They'; 'was completed' becomes past 'completed'.", "Correct: 'They completed the work.'"], explain: "Answer: They completed the work." }
    ]
  }

];

const APTITUDE_META = {
  totalQuestions: 90,
  totalMinutes: 90,
  marksPerQuestion: 1,
  negativeMarking: 0
};
function aptitudeVerdict(pct) {
  if (pct >= 80) return { title: "Outstanding", note: "Placement-ready. This score clears almost every company's aptitude cutoff." };
  if (pct >= 60) return { title: "Strong", note: "Above most cutoffs. A little polish on weak sections and you're set." };
  if (pct >= 40) return { title: "Fair", note: "Around the cutoff zone. Speed and accuracy both need work." };
  return { title: "Needs Practice", note: "Below typical cutoffs. Drill one section daily and retake." };
}

function fmt(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return String(m).padStart(2, "0") + ":" + String(sec).padStart(2, "0");
}

function fmtLong(totalSec) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return m + "m " + String(s).padStart(2, "0") + "s";
}

function useCountUp(target, duration, start) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return val;
}

function TimerRing({ seconds, total }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const frac = total > 0 ? seconds / total : 0;
  const urgent = seconds <= 60;
  return (
    <div className="relative w-16 h-16 shrink-0">
      <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" strokeWidth="5" className="stroke-[#E8E6E1] dark:stroke-[#232830]" />
        <circle cx="32" cy="32" r={r} fill="none" strokeWidth="5" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - frac)}
          className={urgent ? "stroke-[#C0392B] dark:stroke-[#E05A4B]" : "stroke-[#9A7B24] dark:stroke-[#E8A94C]"}
          style={{ transition: "stroke-dashoffset 1s linear" }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`font-mono-studio text-[11px] font-semibold tracking-tight ${urgent ? "text-[#C0392B] dark:text-[#E05A4B] animate-pulse" : "text-[#14171B] dark:text-[#EDEEF0]"}`}>
          {fmt(seconds)}
        </span>
      </div>
    </div>
  );
}

function ScoreRing({ pct, start }) {
  const shown = useCountUp(pct, 1400, start);
  const r = 84;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative w-52 h-52">
      <svg viewBox="0 0 200 200" className="w-52 h-52 -rotate-90">
        <circle cx="100" cy="100" r={r} fill="none" strokeWidth="12" className="stroke-[#E8E6E1] dark:stroke-[#232830]" />
        <circle cx="100" cy="100" r={r} fill="none" strokeWidth="12" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - shown / 100)}
          className="stroke-[#9A7B24] dark:stroke-[#E8A94C]"
          style={{ transition: "stroke-dashoffset 0.1s linear", filter: "drop-shadow(0 0 10px rgba(232,169,76,0.45))" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif-display text-6xl text-[#14171B] dark:text-[#EDEEF0] leading-none">{shown}<span className="text-2xl align-top">%</span></span>
        <span className="font-mono-studio text-[9px] tracking-[0.28em] text-[#8A929C] dark:text-[#565D68] mt-2">SCORE</span>
      </div>
    </div>
  );
}

const LETTERS = ["A", "B", "C", "D"];

function PaletteGrid({ section, offset, answers, marked, qIdx, onJump }) {
  const n = section.questions.length;
  return (
    <div className="grid grid-cols-5 gap-2">
      {Array.from({ length: n }, (_, i) => {
        const g = offset + i;
        const ans = answers[g] !== undefined;
        const mk = marked.has(g);
        const cur = i === qIdx;
        const base = "relative aspect-square rounded-xl font-mono-studio text-[12px] font-semibold flex items-center justify-center transition-all duration-200 cursor-pointer";
        const tone = ans && mk
          ? "bg-[#7C5CBF] dark:bg-[#9D7BE8] text-white shadow-[0_6px_16px_-6px_rgba(124,92,191,0.7)]"
          : mk
            ? "bg-[#E8A94C] text-[#14171B] shadow-[0_6px_16px_-6px_rgba(232,169,76,0.7)]"
            : ans
              ? "bg-[#2E7D4F] dark:bg-[#3FA46A] text-white shadow-[0_6px_16px_-6px_rgba(46,125,79,0.7)]"
              : "bg-[#F1F0EB] dark:bg-[#181B20] text-[#8A929C] dark:text-[#565D68] hover:bg-[#E8E6E1] dark:hover:bg-[#232830]";
        return (
          <motion.button key={g} type="button" whileTap={{ scale: 0.9 }} onClick={() => onJump(i)}
            className={`${base} ${tone} ${cur ? "ring-2 ring-[#14171B] dark:ring-[#EDEEF0] ring-offset-2 ring-offset-transparent" : ""}`}>
            {i + 1}
            {mk && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#14171B] dark:bg-[#EDEEF0] flex items-center justify-center"><BsFlagFill size={7} className="text-[#E8A94C] dark:text-[#9A7B24]" /></span>}
          </motion.button>
        );
      })}
    </div>
  );
}

function Legend() {
  const items = [
    ["Answered", "bg-[#2E7D4F] dark:bg-[#3FA46A]"],
    ["Not answered", "bg-[#F1F0EB] dark:bg-[#181B20] border border-[#E8E6E1] dark:border-[#232830]"],
    ["Marked", "bg-[#E8A94C]"],
    ["Ans. & marked", "bg-[#7C5CBF] dark:bg-[#9D7BE8]"],
  ];
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-2">
      {items.map(([label, cls]) => (
        <span key={label} className="flex items-center gap-2">
          <span className={`w-4 h-4 rounded-md ${cls}`} />
          <span className="text-[10px] font-medium text-[#5B636E] dark:text-[#8B92A0]">{label}</span>
        </span>
      ))}
    </div>
  );
}

function ExamBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -top-40 -left-40 w-136 h-136 rounded-full bg-[#E8A94C]/12 dark:bg-[#E8A94C]/8 blur-[120px] animate-pulse" style={{ animationDuration: "7s" }} />
      <div className="absolute top-1/3 -right-48 w-152 h-152 rounded-full bg-[#7C5CBF]/10 dark:bg-[#7C5CBF]/8 blur-[130px] animate-pulse" style={{ animationDuration: "9s" }} />
      <div className="absolute -bottom-52 left-1/4 w-120 h-120 rounded-full bg-[#2E7D4F]/8 dark:bg-[#2E7D4F]/6 blur-[110px]" />
      <div className="absolute inset-0 opacity-[0.35] dark:opacity-[0.16]" style={{ backgroundImage: "linear-gradient(rgba(120,120,120,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(120,120,120,0.14) 1px, transparent 1px)", backgroundSize: "44px 44px", maskImage: "radial-gradient(ellipse 90% 70% at 50% 20%, black 30%, transparent 75%)", WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 20%, black 30%, transparent 75%)" }} />
    </div>
  );
}

function AptitudeRound({ onExit, onLiveChange }) {
  const [phase, setPhase] = useState("brief");
  const [secIdx, setSecIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState(() => new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [showSubmit, setShowSubmit] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [sectionScores, setSectionScores] = useState([]);
  const [finalResult, setFinalResult] = useState(null);
  const [openSol, setOpenSol] = useState(null);
  const examStartRef = useRef({ t: 0 });

  const section = APTITUDE_SECTIONS[secIdx];
  const offsets = useMemo(() => {
    const arr = [];
    let acc = 0;
    for (const s of APTITUDE_SECTIONS) { arr.push(acc); acc += s.questions.length; }
    return arr;
  }, []);
  const offset = offsets[secIdx];
  const total = section.minutes * 60;
  const gIdx = offset + qIdx;
  const question = section.questions[qIdx];
  const answeredCount = section.questions.filter((_, i) => answers[offset + i] !== undefined).length;
  const markedCount = section.questions.filter((_, i) => marked.has(offset + i)).length;

  useEffect(() => {
    if (onLiveChange) onLiveChange(phase === "exam");
  }, [phase, onLiveChange]);

  useEffect(() => {
    if (phase !== "exam") return;
    if (timeLeft <= 0) {
      submitSection(true);
      return;
    }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  });

  const beginSection = () => {
    if (secIdx === 0 && sectionScores.length === 0) examStartRef.t = Date.now();
    setTimeLeft(section.minutes * 60);
    setQIdx(0);
    setShowSubmit(false);
    setPhase("exam");
  };

  const submitSection = (auto) => {
    let correct = 0;
    section.questions.forEach((q, i) => {
      if (answers[offset + i] === q.answer) correct += 1;
    });
    const entry = { id: section.id, label: section.label, short: section.short, correct, totalQ: section.questions.length, auto };
    const next = [...sectionScores, entry];
    setSectionScores(next);
    setShowSubmit(false);
    if (secIdx + 1 >= APTITUDE_SECTIONS.length) {
      const totalCorrect = next.reduce((a, s) => a + s.correct, 0);
      const totalQ = next.reduce((a, s) => a + s.totalQ, 0);
      const attempted = Object.keys(answers).length;
      const elapsed = Math.max(1, Math.round((Date.now() - examStartRef.t) / 1000));
      setFinalResult({ correct: totalCorrect, totalQ, attempted, elapsed, answers, sections: next, pct: Math.round((totalCorrect / totalQ) * 100) });
      setPhase("results");
    } else {
      setSecIdx(secIdx + 1);
      setPhase("intro");
    }
  };

  const retake = () => {
    setSecIdx(0); setQIdx(0); setAnswers({}); setMarked(new Set());
    setSectionScores([]); setFinalResult(null); setOpenSol(null);
    setShowSubmit(false); setShowPalette(false);
    setPhase("brief");
  };

  const selectOption = (oi) => setAnswers(p => ({ ...p, [gIdx]: oi }));
  const clearResponse = () => setAnswers(p => {
    const n = { ...p };
    delete n[gIdx];
    return n;
  });
  const toggleMark = () => setMarked(p => {
    const n = new Set(p);
    if (n.has(gIdx)) n.delete(gIdx); else n.add(gIdx);
    return n;
  });

  const goNext = () => { if (qIdx + 1 < section.questions.length) setQIdx(qIdx + 1); };
  const goPrev = () => { if (qIdx > 0) setQIdx(qIdx - 1); };
  const saveAndNext = () => { if (qIdx + 1 < section.questions.length) setQIdx(qIdx + 1); else setShowSubmit(true); };
  const markAndNext = () => { toggleMark(); if (qIdx + 1 < section.questions.length) setQIdx(qIdx + 1); };

  const shell = "relative min-h-screen bg-[#FAFAF9] dark:bg-[#0A0B0D] text-[#14171B] dark:text-[#EDEEF0] transition-colors duration-300 overflow-hidden";

  return (
    <div className={shell}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .font-serif-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .font-mono-studio { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      <AnimatePresence mode="wait">
        {phase === "brief" && (
          <motion.div key="brief" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="relative min-h-screen flex items-center justify-center px-4 py-14">
            <ExamBackdrop />
            <div className="relative w-full max-w-3xl">
              <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: "easeOut" }}
                className="rounded-4xl border border-[#E8E6E1] dark:border-[#232830] bg-white/85 dark:bg-[#0C0E11]/85 backdrop-blur-2xl shadow-[0_40px_90px_-30px_rgba(0,0,0,0.35)] overflow-hidden">
                <div className="h-1.5 bg-linear-to-r from-[#9A7B24] via-[#E8A94C] to-[#9A7B24]" />
                <div className="p-8 sm:p-12">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-studio text-[10px] tracking-[0.3em] text-[#9A7B24] dark:text-[#E8A94C]">PLACEMENT · ROUND 1</span>
                    <button type="button" onClick={onExit} className="flex items-center gap-2 font-mono-studio text-[10px] tracking-[0.2em] text-[#8A929C] dark:text-[#565D68] hover:text-[#14171B] dark:hover:text-[#EDEEF0] transition-colors cursor-pointer">
                      <BsBoxArrowRight size={13} /> EXIT
                    </button>
                  </div>
                  <h1 className="font-serif-display text-5xl sm:text-6xl mt-5 tracking-tight">Aptitude <span className="italic text-[#9A7B24] dark:text-[#E8A94C]">Round</span></h1>
                  <p className="text-[14px] text-[#5B636E] dark:text-[#8B92A0] mt-3 leading-relaxed max-w-xl">
                    The real first gate of service-company placements — timed exactly like TCS NQT.
                    No AI interviewer, no credits. Just you, the clock, and 90 questions.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-6">
                    {[APTITUDE_META.totalQuestions + " QUESTIONS", APTITUDE_META.totalMinutes + " MINUTES", "+1 · NO NEGATIVE"].map(chip => (
                      <span key={chip} className="font-mono-studio text-[10px] tracking-[0.18em] px-3.5 py-2 rounded-full border border-[#9A7B24]/40 dark:border-[#E8A94C]/40 bg-[#C99E41]/8 dark:bg-[#E8A94C]/8 text-[#9A7B24] dark:text-[#E8A94C]">{chip}</span>
                    ))}
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3 mt-8">
                    {APTITUDE_SECTIONS.map((s, i) => (
                      <motion.div key={s.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.1, duration: 0.45 }}
                        className="relative rounded-2xl border border-[#E8E6E1] dark:border-[#232830] bg-[#FAFAF9] dark:bg-[#111318] p-5 overflow-hidden group">
                        <span className="font-serif-display italic text-5xl text-[#E8E6E1] dark:text-[#1D2127] absolute -top-1 right-3 select-none">0{i + 1}</span>
                        <BsCalculator size={18} className="text-[#9A7B24] dark:text-[#E8A94C]" />
                        <p className="font-semibold text-[14px] mt-4 leading-snug">{s.label}</p>
                        <p className="font-mono-studio text-[10px] tracking-[0.16em] text-[#8A929C] dark:text-[#565D68] mt-2">{s.questions.length} Q · {s.minutes} MIN</p>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-8 rounded-2xl bg-[#F5F4F1] dark:bg-[#14171C] border border-[#E8E6E1] dark:border-[#232830] p-5">
                    <p className="font-mono-studio text-[9px] tracking-[0.28em] text-[#8A929C] dark:text-[#565D68] mb-3">EXAM RULES</p>
                    <ul className="space-y-2 text-[13px] text-[#3E4650] dark:text-[#9AA1AC]">
                      {["Each section has its own countdown — when it hits zero, the section auto-submits.", "Sections run in order. A submitted section cannot be reopened.", "Mark doubtful questions for review and come back within the section.", "Every correct answer scores +1. There is no negative marking."].map(rule => (
                        <li key={rule} className="flex items-start gap-2.5">
                          <BsCheckLg size={13} className="text-[#2E7D4F] dark:text-[#3FA46A] mt-0.5 shrink-0" />
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <motion.button type="button" whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }} onClick={beginSection}
                    className="mt-8 w-full py-4 rounded-full bg-[#C99E41] dark:bg-[#E8A94C] text-[#14171B] dark:text-[#0A0B0D] text-[15px] font-bold tracking-wide shadow-[0_18px_44px_-14px_rgba(154,123,36,0.7)] hover:opacity-90 transition flex items-center justify-center gap-2.5 cursor-pointer">
                    <BsLightningChargeFill size={16} /> ENTER THE EXAM HALL
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {phase === "intro" && (
          <motion.div key={"intro-" + secIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="relative min-h-screen flex items-center justify-center px-4 py-14">
            <ExamBackdrop />
            <span className="pointer-events-none select-none absolute font-serif-display italic text-[26rem] leading-none text-[#E8E6E1]/60 dark:text-[#14171C]/70 hidden md:block" aria-hidden="true">0{secIdx + 1}</span>
            <div className="relative w-full max-w-xl text-center">
              <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}
                className="rounded-4xl border border-[#E8E6E1] dark:border-[#232830] bg-white/85 dark:bg-[#0C0E11]/85 backdrop-blur-2xl shadow-[0_40px_90px_-30px_rgba(0,0,0,0.35)] p-10 sm:p-12">
                {sectionScores.length > 0 && (
                  <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-[#2E7D4F]/10 dark:bg-[#3FA46A]/10 border border-[#2E7D4F]/30 dark:border-[#3FA46A]/30">
                    <BsPatchCheckFill size={13} className="text-[#2E7D4F] dark:text-[#3FA46A]" />
                    <span className="font-mono-studio text-[10px] tracking-[0.18em] text-[#2E7D4F] dark:text-[#3FA46A]">
                      {sectionScores[sectionScores.length - 1].short} DONE · {sectionScores[sectionScores.length - 1].correct}/{sectionScores[sectionScores.length - 1].totalQ}
                    </span>
                  </div>
                )}
                <p className="font-mono-studio text-[10px] tracking-[0.3em] text-[#9A7B24] dark:text-[#E8A94C]">SECTION 0{secIdx + 1} OF 03</p>
                <h2 className="font-serif-display text-4xl sm:text-5xl mt-4 tracking-tight">{section.label}</h2>
                <div className="flex items-center justify-center gap-6 mt-6">
                  <span className="flex items-center gap-2 text-[13px] text-[#5B636E] dark:text-[#8B92A0]"><BsGrid3X3GapFill size={13} className="text-[#9A7B24] dark:text-[#E8A94C]" /> {section.questions.length} questions</span>
                  <span className="w-px h-5 bg-[#E8E6E1] dark:bg-[#232830]" />
                  <span className="flex items-center gap-2 text-[13px] text-[#5B636E] dark:text-[#8B92A0]"><BsClockHistory size={13} className="text-[#9A7B24] dark:text-[#E8A94C]" /> {section.minutes}:00 minutes</span>
                </div>
                <p className="text-[12px] text-[#8A929C] dark:text-[#565D68] mt-5 leading-relaxed">The clock starts the moment you begin. Answer, mark, review — then it is gone.</p>
                <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={beginSection}
                  className="mt-8 px-10 py-4 rounded-full bg-[#C99E41] dark:bg-[#E8A94C] text-[#14171B] dark:text-[#0A0B0D] text-[15px] font-bold tracking-wide shadow-[0_18px_44px_-14px_rgba(154,123,36,0.7)] hover:opacity-90 transition cursor-pointer">
                  BEGIN SECTION
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {phase === "exam" && (
          <motion.div key={"exam-" + secIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="relative min-h-screen flex flex-col">
            <ExamBackdrop />
            <header className="relative z-10 border-b border-[#E8E6E1] dark:border-[#232830] bg-white/80 dark:bg-[#0C0E11]/80 backdrop-blur-xl">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3 sm:gap-5">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 rounded-xl bg-[#C99E41]/15 dark:bg-[#E8A94C]/15 border border-[#9A7B24]/30 dark:border-[#E8A94C]/30 flex items-center justify-center shrink-0">
                    <BsCalculator size={15} className="text-[#9A7B24] dark:text-[#E8A94C]" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono-studio text-[9px] tracking-[0.24em] text-[#9A7B24] dark:text-[#E8A94C] truncate">SECTION 0{secIdx + 1} · {section.short}</p>
                    <p className="text-[14px] font-bold truncate">{section.label}</p>
                  </div>
                </div>
                <div className="flex-1 hidden sm:block">
                  <div className="h-1 rounded-full bg-[#E8E6E1] dark:bg-[#232830] overflow-hidden">
                    <motion.div className="h-full bg-linear-to-r from-[#9A7B24] to-[#E8A94C]" animate={{ width: (answeredCount / section.questions.length) * 100 + "%" }} transition={{ duration: 0.4 }} />
                  </div>
                  <p className="font-mono-studio text-[9px] tracking-[0.18em] text-[#8A929C] dark:text-[#565D68] mt-1.5">{answeredCount}/{section.questions.length} ANSWERED</p>
                </div>
                <div className="ml-auto flex items-center gap-2 sm:gap-3">
                  <button type="button" onClick={() => setShowPalette(true)} className="lg:hidden w-10 h-10 rounded-full border border-[#E8E6E1] dark:border-[#232830] flex items-center justify-center text-[#5B636E] dark:text-[#8B92A0] cursor-pointer" title="Question palette">
                    <BsGrid3X3GapFill size={15} />
                  </button>
                  <TimerRing seconds={timeLeft} total={total} />
                </div>
              </div>
            </header>

            <div className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 grid lg:grid-cols-[1fr_300px] gap-6 items-start">
              <AnimatePresence mode="wait">
                <motion.div key={gIdx} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.28, ease: "easeOut" }}
                  className="rounded-[1.75rem] border border-[#E8E6E1] dark:border-[#232830] bg-white/85 dark:bg-[#0C0E11]/85 backdrop-blur-2xl shadow-[0_30px_70px_-30px_rgba(0,0,0,0.35)] overflow-hidden">
                  <div className="flex items-center justify-between px-6 sm:px-8 pt-6">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono-studio text-[10px] tracking-[0.26em] text-[#9A7B24] dark:text-[#E8A94C]">QUESTION {String(qIdx + 1).padStart(2, "0")} / {section.questions.length}</span>
                      {question.tag && (
                        <span className="font-mono-studio text-[8px] tracking-[0.18em] px-2.5 py-1 rounded-full bg-[#7C5CBF]/12 dark:bg-[#9D7BE8]/15 text-[#6A4FC7] dark:text-[#B79DF5] border border-[#7C5CBF]/30 dark:border-[#9D7BE8]/30">{question.tag.toUpperCase()} PATTERN</span>
                      )}
                    </div>
                    <span className="flex items-center gap-1.5 font-mono-studio text-[10px] tracking-[0.18em] text-[#8A929C] dark:text-[#565D68]"><BsTrophy size={11} className="text-[#9A7B24] dark:text-[#E8A94C]" /> +1 MARK</span>
                  </div>
                  <h3 className="px-6 sm:px-8 mt-4 text-[19px] sm:text-[22px] font-semibold leading-relaxed tracking-tight">{question.q}</h3>
                  <div className="px-6 sm:px-8 mt-6 space-y-3">
                    {question.options.map((opt, oi) => {
                      const sel = answers[gIdx] === oi;
                      return (
                        <motion.button key={oi} type="button" whileTap={{ scale: 0.99 }} onClick={() => selectOption(oi)}
                          className={`w-full flex items-center gap-4 text-left px-5 py-4 rounded-2xl border transition-all duration-200 cursor-pointer ${sel
                            ? "border-[#9A7B24] dark:border-[#E8A94C] bg-[#C99E41]/10 dark:bg-[#E8A94C]/10 shadow-[0_12px_30px_-14px_rgba(154,123,36,0.6)]"
                            : "border-[#E8E6E1] dark:border-[#232830] bg-[#FAFAF9] dark:bg-[#111318] hover:border-[#9A7B24]/50 dark:hover:border-[#E8A94C]/50"}`}>
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center font-mono-studio text-[12px] font-bold shrink-0 transition-all duration-200 ${sel ? "bg-[#C99E41] dark:bg-[#E8A94C] text-[#14171B] dark:text-[#0A0B0D]" : "bg-[#F1F0EB] dark:bg-[#1A1D22] text-[#8A929C] dark:text-[#565D68]"}`}>{LETTERS[oi]}</span>
                          <span className={`text-[14.5px] leading-relaxed ${sel ? "font-semibold text-[#14171B] dark:text-[#EDEEF0]" : "text-[#3E4650] dark:text-[#9AA1AC]"}`}>{opt}</span>
                          {sel && <BsCheckLg size={15} className="ml-auto text-[#9A7B24] dark:text-[#E8A94C] shrink-0" />}
                        </motion.button>
                      );
                    })}
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5 px-6 sm:px-8 py-6 mt-2">
                    <button type="button" onClick={goPrev} disabled={qIdx === 0}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#E8E6E1] dark:border-[#232830] text-[13px] font-semibold text-[#5B636E] dark:text-[#8B92A0] hover:border-[#9A7B24]/50 dark:hover:border-[#E8A94C]/50 disabled:opacity-35 transition cursor-pointer">
                      <BsArrowLeft size={13} /> Prev
                    </button>
                    <button type="button" onClick={clearResponse}
                      className="px-4 py-2.5 rounded-full border border-[#E8E6E1] dark:border-[#232830] text-[13px] font-semibold text-[#8A929C] dark:text-[#565D68] hover:text-[#C0392B] dark:hover:text-[#E05A4B] hover:border-[#C0392B]/40 transition cursor-pointer">
                      Clear
                    </button>
                    <div className="flex-1" />
                    <button type="button" onClick={markAndNext}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-[13px] font-semibold transition cursor-pointer ${marked.has(gIdx)
                        ? "border-[#E8A94C] bg-[#E8A94C]/15 text-[#9A7B24] dark:text-[#E8A94C]"
                        : "border-[#E8E6E1] dark:border-[#232830] text-[#5B636E] dark:text-[#8B92A0] hover:border-[#E8A94C]/60"}`}>
                      {marked.has(gIdx) ? <BsFlagFill size={13} /> : <BsFlag size={13} />} Mark for review
                    </button>
                    <button type="button" onClick={saveAndNext}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#14171B] dark:bg-[#EDEEF0] text-[#FAFAF9] dark:text-[#0A0B0D] text-[13px] font-bold hover:opacity-90 transition cursor-pointer">
                      {qIdx + 1 === section.questions.length ? "Review" : "Save & Next"} <BsArrowRight size={13} />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>

              <aside className="hidden lg:block rounded-[1.75rem] border border-[#E8E6E1] dark:border-[#232830] bg-white/85 dark:bg-[#0C0E11]/85 backdrop-blur-2xl p-5 sticky top-6">
                <p className="font-mono-studio text-[9px] tracking-[0.26em] text-[#8A929C] dark:text-[#565D68] mb-4">QUESTION PALETTE</p>
                <PaletteGrid section={section} offset={offset} answers={answers} marked={marked} qIdx={qIdx} onJump={setQIdx} />
                <div className="mt-5 pt-5 border-t border-[#E8E6E1] dark:border-[#232830]">
                  <Legend />
                </div>
                <button type="button" onClick={() => setShowSubmit(true)}
                  className="mt-5 w-full py-3.5 rounded-full bg-[#C99E41] dark:bg-[#E8A94C] text-[#14171B] dark:text-[#0A0B0D] text-[14px] font-bold tracking-wide hover:opacity-90 transition shadow-[0_14px_34px_-14px_rgba(154,123,36,0.7)] cursor-pointer">
                  {secIdx + 1 === APTITUDE_SECTIONS.length ? "FINISH TEST" : "SUBMIT SECTION"}
                </button>
              </aside>
            </div>

            <div className="lg:hidden relative z-10 px-4 pb-6">
              <button type="button" onClick={() => setShowSubmit(true)}
                className="w-full py-4 rounded-full bg-[#C99E41] dark:bg-[#E8A94C] text-[#14171B] dark:text-[#0A0B0D] text-[14px] font-bold tracking-wide shadow-[0_14px_34px_-14px_rgba(154,123,36,0.7)] cursor-pointer">
                {secIdx + 1 === APTITUDE_SECTIONS.length ? "FINISH TEST" : "SUBMIT SECTION"}
              </button>
            </div>
          </motion.div>
        )}

        {phase === "results" && finalResult && (
          <ResultsView result={finalResult} openSol={openSol} setOpenSol={setOpenSol} onRetake={retake} onExit={onExit} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPalette && phase === "exam" && (
          <motion.div key="palette-sheet" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={() => setShowPalette(false)} />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="absolute bottom-0 inset-x-0 rounded-t-[1.75rem] bg-white dark:bg-[#0C0E11] border-t border-[#E8E6E1] dark:border-[#232830] p-6 max-h-[75vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <p className="font-mono-studio text-[10px] tracking-[0.26em] text-[#8A929C] dark:text-[#565D68]">QUESTION PALETTE</p>
                <button type="button" onClick={() => setShowPalette(false)} className="w-9 h-9 rounded-full bg-[#F1F0EB] dark:bg-[#181B20] flex items-center justify-center cursor-pointer"><BsX size={16} /></button>
              </div>
              <PaletteGrid section={section} offset={offset} answers={answers} marked={marked} qIdx={qIdx} onJump={(i) => { setQIdx(i); setShowPalette(false); }} />
              <div className="mt-5"><Legend /></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSubmit && phase === "exam" && (
          <motion.div key="submit-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSubmit(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.94, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 16 }} transition={{ duration: 0.25 }}
              className="relative w-full max-w-md rounded-[1.75rem] bg-white dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#232830] shadow-2xl p-7">
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-2xl bg-[#C99E41]/15 dark:bg-[#E8A94C]/15 border border-[#9A7B24]/30 dark:border-[#E8A94C]/30 flex items-center justify-center">
                  <BsExclamationTriangle size={18} className="text-[#9A7B24] dark:text-[#E8A94C]" />
                </span>
                <div>
                  <h3 className="font-serif-display text-2xl">{secIdx + 1 === APTITUDE_SECTIONS.length ? "Finish the test?" : "Submit this section?"}</h3>
                  <p className="text-[12px] text-[#8A929C] dark:text-[#565D68] mt-0.5">A submitted section cannot be reopened.</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2.5 mt-6">
                {[
                  [answeredCount, "Answered", "text-[#2E7D4F] dark:text-[#3FA46A]"],
                  [markedCount, "Marked", "text-[#9A7B24] dark:text-[#E8A94C]"],
                  [section.questions.length - answeredCount, "Unanswered", "text-[#8A929C] dark:text-[#565D68]"],
                ].map(([n, label, cls]) => (
                  <div key={label} className="rounded-2xl bg-[#F5F4F1] dark:bg-[#14171C] border border-[#E8E6E1] dark:border-[#232830] py-4 text-center">
                    <p className={`font-serif-display text-3xl ${cls}`}>{n}</p>
                    <p className="font-mono-studio text-[8px] tracking-[0.2em] text-[#8A929C] dark:text-[#565D68] mt-1">{label.toUpperCase()}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2.5 mt-6">
                <button type="button" onClick={() => setShowSubmit(false)} className="flex-1 py-3.5 rounded-full border border-[#E8E6E1] dark:border-[#232830] text-[14px] font-bold hover:border-[#9A7B24]/50 dark:hover:border-[#E8A94C]/50 transition cursor-pointer">Keep solving</button>
                <button type="button" onClick={() => submitSection(false)} className="flex-1 py-3.5 rounded-full bg-[#C99E41] dark:bg-[#E8A94C] text-[#14171B] dark:text-[#0A0B0D] text-[14px] font-bold hover:opacity-90 transition cursor-pointer">Submit</button>
              </div>
              <button type="button" onClick={onExit} className="w-full mt-3 py-2 font-mono-studio text-[10px] tracking-[0.2em] text-[#8A929C] dark:text-[#565D68] hover:text-[#C0392B] dark:hover:text-[#E05A4B] transition cursor-pointer">QUIT TEST WITHOUT SAVING</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResultsView({ result, openSol, setOpenSol, onRetake, onExit }) {
  const v = aptitudeVerdict(result.pct);
  const [show, setShow] = useState(false);
  const [solTab, setSolTab] = useState("quants");
  const [aiSol, setAiSol] = useState({});
  const [aiLoading, setAiLoading] = useState({});
  const [aiFailed, setAiFailed] = useState({});
  useEffect(() => { const id = setTimeout(() => setShow(true), 250); return () => clearTimeout(id); }, []);
  const answers = result.answers || {};
  const offsets = [];
  let run = 0;
  APTITUDE_SECTIONS.forEach((s) => { offsets.push(run); run += s.questions.length; });
  const tabIdx = Math.max(0, APTITUDE_SECTIONS.findIndex((s) => s.id === solTab));
  const tabSection = APTITUDE_SECTIONS[tabIdx];
  const tabOff = offsets[tabIdx];
  const tabCorrect = tabSection.questions.filter((q, i) => answers[tabOff + i] === q.answer).length;
  const statusOf = (q, gi) => {
    const ua = answers[gi];
    if (ua === undefined) return "skipped";
    return ua === q.answer ? "correct" : "wrong";
  };
  const fetchAiSolution = async (key, q) => {
    if (aiSol[key] || aiLoading[key] || aiFailed[key]) return;
    setAiLoading((p) => ({ ...p, [key]: true }));
    try {
      const res = await axios.post(ServerUrl + "/api/interview/aptitude-solution", {
        question: q.q,
        options: q.options,
        answerIndex: q.answer,
        sectionLabel: tabSection.label,
      }, { withCredentials: true, timeout: 60000 });
      const d = res.data || {};
      if (d.steps && d.steps.length) setAiSol((p) => ({ ...p, [key]: { steps: d.steps, answer: d.answer || "" } }));
      else setAiFailed((p) => ({ ...p, [key]: true }));
    } catch (e) {
      setAiFailed((p) => ({ ...p, [key]: true }));
    } finally {
      setAiLoading((p) => { const n = { ...p }; delete n[key]; return n; });
    }
  };
  const solutionBody = (key, q) => {
    const ai = aiSol[key];
    if (ai) {
      return (
        <div className="pt-4 px-1">
          <span className="inline-flex items-center gap-1.5 font-mono-studio text-[8px] tracking-[0.2em] font-bold px-2.5 py-1 rounded-full bg-[#C99E41]/15 dark:bg-[#E8A94C]/15 text-[#9A7B24] dark:text-[#E8A94C] mb-3"><BsLightningChargeFill size={9} /> AI GENERATED</span>
          <ol className="space-y-2.5">
            {ai.steps.map((stp, si2) => (
              <li key={si2} className="flex gap-3.5">
                <span className="font-mono-studio text-[11px] text-[#9A7B24] dark:text-[#E8A94C] shrink-0 mt-0.5 w-6">{String(si2 + 1).padStart(2, "0")}</span>
                <span className="text-[13.5px] leading-relaxed text-[#3E4650] dark:text-[#A6ADB8]">{stp}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 px-4 py-3 rounded-2xl bg-[#C99E41]/10 dark:bg-[#E8A94C]/10 border border-[#9A7B24]/25 dark:border-[#E8A94C]/25 text-[13.5px] font-bold text-[#7A5F1C] dark:text-[#E8A94C]">{ai.answer}</p>
        </div>
      );
    }
    if (aiLoading[key]) {
      return (
        <div className="pt-4 px-1">
          <p className="font-mono-studio text-[9px] tracking-[0.24em] text-[#9A7B24] dark:text-[#E8A94C] animate-pulse mb-3">AI GENERATING SOLUTION...</p>
          <div className="space-y-2.5">
            {[92, 80, 68].map((w, i) => (
              <div key={i} className="h-4 rounded-lg bg-[#E8E6E1]/60 dark:bg-[#232830]/60 animate-pulse" style={{ width: w + "%" }} />
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className="pt-4 px-1">
        <ol className="space-y-2.5">
          {q.steps.map((stp, si2) => (
            <li key={si2} className="flex gap-3.5">
              <span className="font-mono-studio text-[11px] text-[#9A7B24] dark:text-[#E8A94C] shrink-0 mt-0.5 w-6">{String(si2 + 1).padStart(2, "0")}</span>
              <span className="text-[13.5px] leading-relaxed text-[#3E4650] dark:text-[#A6ADB8]">{stp}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 px-4 py-3 rounded-2xl bg-[#C99E41]/10 dark:bg-[#E8A94C]/10 border border-[#9A7B24]/25 dark:border-[#E8A94C]/25 text-[13.5px] font-bold text-[#7A5F1C] dark:text-[#E8A94C]">{q.explain}</p>
      </div>
    );
  };
  return (
    <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="relative min-h-screen px-4 pt-4 pb-12">
      <ExamBackdrop />
      <div className="relative max-w-4xl mx-auto">
        <div className="sticky top-3 z-40 mb-6">
          <div className="flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-2xl border border-[#E8E6E1] dark:border-[#232830] bg-white/90 dark:bg-[#0C0E11]/90 backdrop-blur-2xl shadow-[0_18px_45px_-18px_rgba(0,0,0,0.4)]">
            <span className="font-mono-studio text-[9px] tracking-[0.26em] text-[#9A7B24] dark:text-[#E8A94C] hidden md:block">APTITUDE RESULTS</span>
            <span className="font-mono-studio text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#C99E41]/12 dark:bg-[#E8A94C]/12 text-[#9A7B24] dark:text-[#E8A94C]">{result.pct}%</span>
            <span className="font-mono-studio text-[10px] text-[#8A929C] dark:text-[#565D68] hidden sm:block">{result.correct}/{result.totalQ} CORRECT</span>
            <div className="ml-auto flex items-center gap-2">
              <button type="button" onClick={onRetake} className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-[#E8E6E1] dark:border-[#232830] text-[11px] font-bold hover:border-[#9A7B24]/60 dark:hover:border-[#E8A94C]/60 transition cursor-pointer">
                <BsArrowCounterclockwise size={12} /> <span className="hidden sm:inline">RETAKE</span>
              </button>
              <button type="button" onClick={onExit} className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#C99E41] dark:bg-[#E8A94C] text-[#14171B] dark:text-[#0A0B0D] text-[11px] font-bold hover:opacity-90 transition cursor-pointer">
                <BsBoxArrowRight size={12} /> HOME
              </button>
            </div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}
          className="rounded-4xl border border-[#E8E6E1] dark:border-[#232830] bg-white/85 dark:bg-[#0C0E11]/85 backdrop-blur-2xl shadow-[0_40px_90px_-30px_rgba(0,0,0,0.35)] overflow-hidden">
          <div className="h-1.5 bg-linear-to-r from-[#9A7B24] via-[#E8A94C] to-[#9A7B24]" />
          <div className="p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-12">
              <ScoreRing pct={result.pct} start={show} />
              <div className="text-center sm:text-left flex-1">
                <p className="font-mono-studio text-[10px] tracking-[0.3em] text-[#9A7B24] dark:text-[#E8A94C]">APTITUDE ROUND · COMPLETE</p>
                <h2 className="font-serif-display text-4xl sm:text-5xl mt-3 tracking-tight">{v.title}</h2>
                <p className="text-[13.5px] text-[#5B636E] dark:text-[#8B92A0] mt-3 leading-relaxed">{v.note}</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2.5 mt-6">
                  {[
                    [result.correct + "/" + result.totalQ, "CORRECT"],
                    [result.attempted + "/" + result.totalQ, "ATTEMPTED"],
                    [fmtLong(result.elapsed), "TIME TAKEN"],
                  ].map(([val, label]) => (
                    <div key={label} className="px-5 py-3 rounded-2xl bg-[#F5F4F1] dark:bg-[#14171C] border border-[#E8E6E1] dark:border-[#232830]">
                      <p className="font-serif-display text-2xl">{val}</p>
                      <p className="font-mono-studio text-[8px] tracking-[0.22em] text-[#8A929C] dark:text-[#565D68] mt-1">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10">
              <p className="font-mono-studio text-[9px] tracking-[0.28em] text-[#8A929C] dark:text-[#565D68] mb-4">SECTION BREAKDOWN</p>
              <div className="space-y-3">
                {result.sections.map((s, i) => {
                  const pct = Math.round((s.correct / s.totalQ) * 100);
                  return (
                    <div key={s.id} className="rounded-2xl border border-[#E8E6E1] dark:border-[#232830] bg-[#FAFAF9] dark:bg-[#111318] p-4 sm:p-5">
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-[13.5px] font-bold">{s.label}</span>
                        <span className="font-mono-studio text-[11px] text-[#5B636E] dark:text-[#8B92A0]">{s.correct}/{s.totalQ} · {pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-[#E8E6E1] dark:bg-[#232830] overflow-hidden">
                        <motion.div className="h-full rounded-full bg-linear-to-r from-[#9A7B24] to-[#E8A94C]"
                          initial={{ width: 0 }} animate={show ? { width: pct + "%" } : {}} transition={{ delay: 0.5 + i * 0.15, duration: 0.8, ease: "easeOut" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-10">
              <p className="font-mono-studio text-[9px] tracking-[0.28em] text-[#8A929C] dark:text-[#565D68] mb-4">SOLUTIONS · STEP-BY-STEP</p>
              <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
                {APTITUDE_SECTIONS.map((s, si) => {
                  const off = offsets[si];
                  const c = s.questions.filter((q, i) => answers[off + i] === q.answer).length;
                  const active = solTab === s.id;
                  return (
                    <button key={s.id} type="button" onClick={() => { setSolTab(s.id); setOpenSol(null); }}
                      className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full border text-[11px] font-bold tracking-[0.08em] whitespace-nowrap transition cursor-pointer ${active ? "bg-[#C99E41] dark:bg-[#E8A94C] text-[#14171B] dark:text-[#0A0B0D] border-transparent shadow-[0_10px_25px_-10px_rgba(201,158,65,0.7)]" : "border-[#E8E6E1] dark:border-[#232830] text-[#5B636E] dark:text-[#8B92A0] hover:border-[#9A7B24]/50 dark:hover:border-[#E8A94C]/50"}`}>
                      <span className="font-mono-studio">{s.short}</span>
                      <span className={`font-mono-studio text-[10px] px-2 py-0.5 rounded-full ${active ? "bg-black/15 dark:bg-black/20" : "bg-[#F5F4F1] dark:bg-[#14171C]"}`}>{c}/{s.questions.length}</span>
                    </button>
                  );
                })}
              </div>
              <div className="space-y-4">
                {tabSection.questions.map((q, i) => {
                  const gi = tabOff + i;
                  const key = tabSection.id + "-" + i;
                  const open = openSol === key;
                  const st = statusOf(q, gi);
                  const ua = answers[gi];
                  return (
                    <div key={key} className="rounded-3xl border border-[#E8E6E1] dark:border-[#232830] bg-[#FAFAF9] dark:bg-[#111318] overflow-hidden">
                      <div className="px-5 sm:px-6 pt-5 flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono-studio text-[10px] tracking-[0.18em] text-[#8A929C] dark:text-[#565D68]">Q{String(gi + 1).padStart(2, "0")}</span>
                        {q.tag && <span className="font-mono-studio text-[8px] tracking-[0.14em] px-2 py-0.5 rounded-full bg-[#7C5CBF]/10 dark:bg-[#9D7BE8]/12 text-[#6A4FC7] dark:text-[#B79DF5]">{q.tag.toUpperCase()}</span>}
                        <span className={`ml-auto font-mono-studio text-[8.5px] tracking-[0.16em] px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 ${st === "correct" ? "bg-[#2E7D4F]/12 dark:bg-[#3FA46A]/12 text-[#2E7D4F] dark:text-[#3FA46A]" : st === "wrong" ? "bg-[#C0392B]/10 dark:bg-[#C0392B]/12 text-[#C0392B] dark:text-[#E0685A]" : "bg-[#8A929C]/12 dark:bg-[#565D68]/15 text-[#8A929C] dark:text-[#8B92A0]"}`}>
                          {st === "correct" && <BsCheckLg size={10} />}
                          {st === "wrong" && <BsX size={11} />}
                          {st === "correct" ? "CORRECT" : st === "wrong" ? "WRONG" : "SKIPPED"}
                        </span>
                      </div>
                      <p className="px-5 sm:px-6 mt-3 text-[15.5px] font-semibold leading-relaxed">{q.q}</p>
                      <div className="px-5 sm:px-6 mt-4 grid sm:grid-cols-2 gap-2.5">
                        {q.options.map((opt, oi) => {
                          const isAns = oi === q.answer;
                          const isUser = ua === oi;
                          const cls = isAns
                            ? "border-[#2E7D4F]/50 dark:border-[#3FA46A]/50 bg-[#2E7D4F]/8 dark:bg-[#3FA46A]/8"
                            : isUser
                            ? "border-[#C0392B]/45 dark:border-[#C0392B]/50 bg-[#C0392B]/8 dark:bg-[#C0392B]/8"
                            : "border-[#E8E6E1] dark:border-[#232830]";
                          return (
                            <div key={oi} className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-[13.5px] ${cls}`}>
                              <span className="font-mono-studio text-[11px] w-5 shrink-0 text-[#8A929C] dark:text-[#565D68]">{LETTERS[oi]}</span>
                              <span className={`flex-1 leading-snug ${isAns ? "font-bold text-[#2E7D4F] dark:text-[#3FA46A]" : isUser ? "font-semibold text-[#C0392B] dark:text-[#E0685A]" : "text-[#5B636E] dark:text-[#8B92A0]"}`}>{opt}</span>
                              {isAns && <span className="flex items-center gap-1 font-mono-studio text-[8px] tracking-[0.12em] text-[#2E7D4F] dark:text-[#3FA46A] shrink-0"><BsCheckLg size={12} />{isUser ? "YOUR PICK" : "ANSWER"}</span>}
                              {!isAns && isUser && <span className="flex items-center gap-1 font-mono-studio text-[8px] tracking-[0.12em] text-[#C0392B] dark:text-[#E0685A] shrink-0"><BsX size={13} />YOUR PICK</span>}
                            </div>
                          );
                        })}
                      </div>
                      <div className="px-5 sm:px-6 pb-5 mt-4">
                        <button type="button" onClick={() => { const willOpen = openSol !== key; setOpenSol(willOpen ? key : null); if (willOpen) fetchAiSolution(key, q); }}
                          className="w-full flex items-center justify-between gap-3 px-5 py-3.5 rounded-2xl bg-white dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#232830] hover:border-[#9A7B24]/50 dark:hover:border-[#E8A94C]/50 transition cursor-pointer">
                          <span className="font-mono-studio text-[9px] tracking-[0.24em] text-[#9A7B24] dark:text-[#E8A94C]">STEP-BY-STEP SOLUTION</span>
                          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}><BsChevronDown size={14} className="text-[#8A929C] dark:text-[#565D68]" /></motion.span>
                        </button>
                        <AnimatePresence initial={false}>
                          {open && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                              {solutionBody(key, q)}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-10">
              <button type="button" onClick={onRetake} className="flex-1 py-4 rounded-full border border-[#E8E6E1] dark:border-[#232830] text-[14px] font-bold flex items-center justify-center gap-2 hover:border-[#9A7B24]/60 dark:hover:border-[#E8A94C]/60 transition cursor-pointer">
                <BsArrowCounterclockwise size={15} /> RETAKE TEST
              </button>
              <button type="button" onClick={onExit} className="flex-1 py-4 rounded-full bg-[#C99E41] dark:bg-[#E8A94C] text-[#14171B] dark:text-[#0A0B0D] text-[14px] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition cursor-pointer">
                <BsBoxArrowRight size={15} /> BACK TO HOME
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default AptitudeRound;
