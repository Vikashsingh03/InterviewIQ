
const COMPANY_INTERVIEW_STYLES = {
  google:
    "Google interviews lean heavily on data structures, algorithms, and structured problem-solving from first principles, plus a strong emphasis on 'Googleyness' — collaboration, intellectual humility, and comfort with ambiguity. Behavioral questions often probe how the candidate handled ambiguous, large-scale problems.",
  amazon:
    "Amazon interviews are built around their Leadership Principles (Customer Obsession, Ownership, Bias for Action, Deliver Results, Dive Deep, etc.). Expect STAR-format behavioral questions that explicitly probe which leadership principle a past experience demonstrates, alongside solid technical depth for engineering roles.",
  microsoft:
    "Microsoft interviews emphasize collaborative problem-solving, clearly communicating your thought process, and practical engineering judgment over pure algorithmic trickery. They also value a growth mindset and cross-team collaboration stories.",
  meta: "Meta (Facebook) interviews prioritize speed of execution, impact-driven storytelling, and comfort with fast-changing, ambiguous environments. Behavioral questions often focus on moving fast, handling disagreement, and shipping measurable impact.",
  apple:
    "Apple interviews focus heavily on attention to detail, product craftsmanship, and cross-functional collaboration. Expect deep dives into specific past projects and how design/engineering decisions affected the end user.",
  netflix:
    "Netflix interviews have a strong culture-fit component around their 'Freedom & Responsibility' culture — expect direct questions about independent judgment, candor, and handling high-autonomy, high-accountability situations.",
  flipkart:
    "Flipkart interviews for tech roles blend DSA/system-design rigor (similar to top product companies) with a strong emphasis on ownership and customer-centric thinking, reflecting the scale challenges of India's largest e-commerce platform.",
  tcs: "TCS interviews (especially for freshers/service roles) tend to be foundational — core CS fundamentals, communication skills, and adaptability, since consultants are staffed across diverse client projects.",
  infosys:
    "Infosys interviews focus on strong fundamentals, logical reasoning, and communication — typical of large Indian IT services firms, with emphasis on client-facing soft skills and adaptability.",
  wipro:
    "Wipro interviews emphasize core fundamentals, problem-solving aptitude, and communication skills, typical of large IT services firms staffing diverse client engagements.",
  accenture:
    "Accenture interviews blend technical fundamentals with strong emphasis on communication, client-facing readiness, and adaptability across different technology stacks and industries.",
  startup:
    "Startup interviews tend to be less structured and more conversational, probing for scrappiness, ownership across ambiguous scope, and genuine passion for the problem space, with less rigid behavioral frameworks.",
};


export const getCompanyStyleGuidance = (companyName) => {
  if (!companyName || !companyName.trim()) return null;

  const normalized = companyName.trim().toLowerCase();
  const known = COMPANY_INTERVIEW_STYLES[normalized];

  if (known) {
    return `The candidate is targeting a role at ${companyName.trim()}. ${known}`;
  }

  return `The candidate is targeting a role at ${companyName.trim()}. Draw on what you know about this company's typical interview style and culture (technical depth, behavioral framework, values) and tailor your questions accordingly. If you don't have specific knowledge of this company, use general best-practice interview technique instead.`;
};

export default COMPANY_INTERVIEW_STYLES;