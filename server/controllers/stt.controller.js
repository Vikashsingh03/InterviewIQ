import axios from "axios";
import { sanitizeSttLanguage } from "../utils/language.js";
const TOKEN_TTL_SECONDS = 60;
export const getSttToken = async (req, res) => {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    console.warn("[stt] DEEPGRAM_API_KEY is not set (or the server wasn't restarted after adding it). Using browser speech recognition.");
    return res.json({
      provider: "browser"
    });
  }
  try {
    const {
      data
    } = await axios.post("https://api.deepgram.com/v1/auth/grant", {
      ttl_seconds: TOKEN_TTL_SECONDS
    }, {
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json"
      },
      timeout: 8000
    });
    if (!data?.access_token) {
      return res.json({
        provider: "browser"
      });
    }
    const requestedLanguage = sanitizeSttLanguage(req.query.language, process.env.DEEPGRAM_LANGUAGE || "en");
    return res.json({
      provider: "deepgram",
      token: data.access_token,
      expiresIn: data.expires_in || TOKEN_TTL_SECONDS,
      model: process.env.DEEPGRAM_MODEL || "nova-3",
      language: requestedLanguage
    });
  } catch (error) {
    const status = error?.response?.status;
    const hint = status === 401 ? "the key is wrong or was deleted" : status === 403 ? "the key needs at least Member permission (create it under Advanced -> Member)" : "could not reach Deepgram";
    console.error(`[stt] Deepgram token request failed (${status ?? "no response"}): ${hint}.`, error?.response?.data || error.message);
    return res.json({
      provider: "browser"
    });
  }
};
