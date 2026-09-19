import axios from "axios";

const MAX_RETRIES = 3;
const REQUEST_TIMEOUT_MS = 45000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// worth retrying: OpenRouter rate limit / "couldn't verify credits in time"
// (429), provider hiccups (5xx), and plain network drops. Anything else
// (bad request, bad key, no credits left) fails immediately.
const isRetryable = (error) => {
  const status = error.response?.status;
  if (status === 429 || (status >= 500 && status <= 599)) return true;
  if (!error.response) {
    return ["ECONNRESET", "ETIMEDOUT", "ECONNABORTED", "EAI_AGAIN", "ENOTFOUND"].includes(
      error.code,
    );
  }
  return false;
};

// honour the server's Retry-After when it sends one, otherwise back off
// 1s, 2s, 4s (plus a little jitter so parallel requests don't retry in lockstep)
const retryDelayMs = (error, attempt) => {
  const base = Number(process.env.AI_RETRY_BASE_MS) || 1000;
  const retryAfter = Number(error.response?.headers?.["retry-after"]);
  if (Number.isFinite(retryAfter) && retryAfter > 0) {
    return Math.min(retryAfter * 1000, 8000);
  }
  return base * 2 ** attempt + Math.floor(Math.random() * base * 0.25);
};

export const askAi = async (messages) => {
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    console.error("open router error", "Message array is empty.");
    throw new Error("OpenRouter API Error");
  }

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openai/gpt-4o-mini",
          messages: messages,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.ROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: REQUEST_TIMEOUT_MS,
        },
      );

      const content = response?.data?.choices?.[0]?.message?.content;

      if (!content || !content.trim()) {
        throw new Error("AI returned empty response");
      }
      return content;
    } catch (error) {
      if (attempt < MAX_RETRIES && isRetryable(error)) {
        const wait = retryDelayMs(error, attempt);
        console.warn(
          `open router busy (${error.response?.status ?? error.code}), retrying in ${Math.round(wait)}ms (${attempt + 1}/${MAX_RETRIES})`,
        );
        await sleep(wait);
        continue;
      }

      console.error("open router error", error.response?.data || error.message);
      throw new Error("OpenRouter API Error");
    }
  }
};