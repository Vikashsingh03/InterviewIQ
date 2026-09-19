import axios from "axios";

// Hands the browser a SHORT-LIVED Deepgram token so it can stream the
// candidate's microphone straight to Deepgram. The real API key never
// leaves the server.
//
// If DEEPGRAM_API_KEY isn't set (or Deepgram is unreachable) this answers
// { provider: "browser" } and the client quietly keeps using the browser's
// built-in speech recognition, so nothing ever breaks.
//
// .env (server):
//   DEEPGRAM_API_KEY=...          key with at least "Member" permission
//   DEEPGRAM_MODEL=nova-3         optional (default nova-3)
//   DEEPGRAM_LANGUAGE=en          optional, e.g. en-IN if your model supports it
const TOKEN_TTL_SECONDS = 60;

export const getSttToken = async (req, res) => {
  const apiKey = process.env.DEEPGRAM_API_KEY;

  if (!apiKey) {
    console.warn(
      "[stt] DEEPGRAM_API_KEY is not set (or the server wasn't restarted after adding it). Using browser speech recognition.",
    );
    return res.json({ provider: "browser" });
  }

  try {
    const { data } = await axios.post(
      "https://api.deepgram.com/v1/auth/grant",
      { ttl_seconds: TOKEN_TTL_SECONDS },
      {
        headers: {
          Authorization: `Token ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 8000,
      },
    );

    if (!data?.access_token) {
      return res.json({ provider: "browser" });
    }

    return res.json({
      provider: "deepgram",
      token: data.access_token,
      expiresIn: data.expires_in || TOKEN_TTL_SECONDS,
      model: process.env.DEEPGRAM_MODEL || "nova-3",
      language: process.env.DEEPGRAM_LANGUAGE || "en",
    });
  } catch (error) {
    const status = error?.response?.status;
    const hint =
      status === 401
        ? "the key is wrong or was deleted"
        : status === 403
          ? "the key needs at least Member permission (create it under Advanced -> Member)"
          : "could not reach Deepgram";
    console.error(
      `[stt] Deepgram token request failed (${status ?? "no response"}): ${hint}.`,
      error?.response?.data || error.message,
    );
    return res.json({ provider: "browser" });
  }
};