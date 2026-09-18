// Curated behavioral/HR practice question bank — used ONLY by Practice Mode
// (single-question, free, unlimited practice), separate from the adaptive
// question generation used in a full mock interview. Each question carries a
// short `guidance` hint that's sent to the AI grader for context on what a
// strong answer looks like — it is never shown to the candidate.

const PRACTICE_HR_BANK = [
  {
    id: "tell-me-about-yourself",
    question: "Tell me about yourself.",
    category: "introduction",
    difficulty: "easy",
    guidance:
      "Strong answers give a brief, structured walk-through (background → key experience → what they're looking for now), not a full resume readout.",
  },
  {
    id: "greatest-strength",
    question: "What would you say is your greatest strength?",
    category: "introduction",
    difficulty: "easy",
    guidance:
      "Look for one specific strength backed by a concrete example, not a generic list of adjectives.",
  },
  {
    id: "greatest-weakness",
    question: "What's a weakness you're actively working on?",
    category: "introduction",
    difficulty: "easy",
    guidance:
      "Look for genuine self-awareness and a concrete step taken to improve — not a disguised strength like 'I work too hard'.",
  },
  {
    id: "why-this-role",
    question: "Why are you interested in this kind of role?",
    category: "introduction",
    difficulty: "easy",
    guidance:
      "Look for a specific, personal reason tied to their skills or goals — not a generic 'I love technology' answer.",
  },
  {
    id: "conflict-teammate",
    question:
      "Tell me about a time you disagreed with a teammate. How did you handle it?",
    category: "teamwork",
    difficulty: "medium",
    guidance:
      "Strong answers use a STAR structure, focus on how they communicated and resolved it professionally, and show a concrete outcome.",
  },
  {
    id: "difficult-team-member",
    question: "Describe a time you had to work with someone difficult.",
    category: "teamwork",
    difficulty: "medium",
    guidance:
      "Look for empathy and professionalism rather than blame, and a specific action they took to improve the working relationship.",
  },
  {
    id: "helped-teammate",
    question: "Tell me about a time you helped a struggling teammate.",
    category: "teamwork",
    difficulty: "easy",
    guidance:
      "Look for a specific, concrete example of mentorship or support, and what the measurable outcome was.",
  },
  {
    id: "led-without-authority",
    question:
      "Describe a situation where you had to lead or influence others without formal authority.",
    category: "leadership",
    difficulty: "medium",
    guidance:
      "Look for concrete persuasion/communication tactics used, and a real outcome — not just 'I took charge'.",
  },
  {
    id: "took-initiative",
    question: "Tell me about a time you took initiative beyond your assigned role.",
    category: "leadership",
    difficulty: "medium",
    guidance:
      "Look for a specific, self-driven action with measurable impact, not something that was assigned to them.",
  },
  {
    id: "delegated-task",
    question: "Describe a time you had to delegate work to someone else.",
    category: "leadership",
    difficulty: "medium",
    guidance:
      "Look for how they decided what to delegate, how they communicated expectations, and the result.",
  },
  {
    id: "tight-deadline",
    question:
      "Tell me about a time you had to deliver something under a tight deadline.",
    category: "problem-solving",
    difficulty: "medium",
    guidance:
      "Look for how they prioritized, what trade-offs they made, and whether they hit the deadline with acceptable quality.",
  },
  {
    id: "failure-story",
    question: "Tell me about a time you failed at something. What did you learn?",
    category: "problem-solving",
    difficulty: "hard",
    guidance:
      "Look for genuine ownership of the failure (not blaming others) and a specific, applied lesson learned since.",
  },
  {
    id: "toughest-bug",
    question:
      "Walk me through the toughest technical problem you've had to debug or solve.",
    category: "problem-solving",
    difficulty: "hard",
    guidance:
      "Look for a clear problem-solving process: how they diagnosed it, what they tried, and how they eventually solved it.",
  },
  {
    id: "handled-pressure",
    question: "Describe a high-pressure situation and how you stayed effective.",
    category: "problem-solving",
    difficulty: "medium",
    guidance:
      "Look for concrete coping/prioritization strategies, not just 'I stayed calm'.",
  },
  {
    id: "explain-technical-concept",
    question:
      "Explain a technical concept you know well to someone with no technical background.",
    category: "communication",
    difficulty: "medium",
    guidance:
      "Look for genuine simplification (analogies, plain language) rather than just using fewer jargon words.",
  },
  {
    id: "gave-difficult-feedback",
    question: "Tell me about a time you had to give someone difficult feedback.",
    category: "communication",
    difficulty: "medium",
    guidance:
      "Look for a respectful, specific approach to the feedback conversation and a concrete outcome.",
  },
  {
    id: "persuaded-someone",
    question:
      "Describe a time you had to convince someone to see things your way.",
    category: "communication",
    difficulty: "medium",
    guidance:
      "Look for the actual reasoning/evidence they used to persuade, and whether it worked.",
  },
  {
    id: "where-in-5-years",
    question: "Where do you see yourself in five years?",
    category: "career-goals",
    difficulty: "easy",
    guidance:
      "Look for realistic, self-aware goals connected to the kind of role they're applying for.",
  },
  {
    id: "why-leaving-current",
    question:
      "What's motivating you to look for a new opportunity right now?",
    category: "career-goals",
    difficulty: "easy",
    guidance:
      "Look for a forward-looking, professional reason rather than only complaints about a past employer.",
  },
  {
    id: "proudest-achievement",
    question:
      "What's an achievement you're most proud of in your career so far?",
    category: "career-goals",
    difficulty: "easy",
    guidance:
      "Look for a specific accomplishment with measurable impact, explained with genuine enthusiasm and detail.",
  },
];

export default PRACTICE_HR_BANK;