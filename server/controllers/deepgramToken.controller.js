import { mintDeepgramToken } from "../services/deepgram.service.js";

// GET /api/deepgram/token — called by the browser right before it needs to
// start listening. Returns a short-lived token, never the real API key.
export const getDeepgramToken = async (req, res) => {
  try {
    const { accessToken, expiresIn } = await mintDeepgramToken();
    return res.status(200).json({ accessToken, expiresIn });
  } catch (error) {
    console.error("Deepgram token error:", error.message);
    return res.status(500).json({
      message: "Couldn't set up voice recognition right now.",
    });
  }
};