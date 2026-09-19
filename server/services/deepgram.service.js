// Mints short-lived Deepgram access tokens for the browser, using
// POST https://api.deepgram.com/v1/auth/grant.
// The real DEEPGRAM_API_KEY lives ONLY on the server (env var) — the
// browser only ever sees the token this returns, which expires in a
// few minutes and can't be used for anything but opening a /listen
// WebSocket connection.

const DEEPGRAM_GRANT_URL = "https://api.deepgram.com/v1/auth/grant";

// Keep this short — the token only needs to survive long enough for the
// browser to open its WebSocket connection to Deepgram, not the whole
// interview. 120s comfortably covers slow connections/page loads.
const TOKEN_TTL_SECONDS = 120;

export const mintDeepgramToken = async () => {
  const apiKey = process.env.DEEPGRAM_API_KEY;

  if (!apiKey) {
    throw new Error(
      "DEEPGRAM_API_KEY is not set on the server — add it to your .env file.",
    );
  }

  const res = await fetch(DEEPGRAM_GRANT_URL, {
    method: "POST",
    headers: {
      // NOTE: this is intentionally "Token", not "Bearer" — that's what
      // Deepgram's /auth/grant endpoint itself expects for the real API key
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ttl_seconds: TOKEN_TTL_SECONDS }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Deepgram token request failed (${res.status}): ${text}`);
  }

  const data = await res.json();

  // response shape: { access_token, expires_in }
  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
  };
};