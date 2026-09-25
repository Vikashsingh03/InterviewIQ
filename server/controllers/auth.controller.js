import { getAuth } from "firebase-admin/auth";
import genToken from "../config/token.js";
import userModel from "../models/user.model.js";
import initFirebaseAdmin from "../config/firebaseAdmin.js";

const firebaseAdminReady = initFirebaseAdmin();

export const googleAuth = async (req, res) => {
  try {
    if (!firebaseAdminReady) {
      return res.status(500).json({
        message: "Google sign-in isn't configured on the server yet.",
      });
    }

    const { idToken } = req.body;

    if (!idToken || typeof idToken !== "string") {
      return res.status(400).json({ message: "Missing sign-in token." });
    }

    let decodedToken;
    try {
      decodedToken = await getAuth().verifyIdToken(idToken);
    } catch (verifyError) {
      console.error("Google ID token verification failed:", verifyError.message);
      return res.status(401).json({
        message: "Invalid or expired sign-in token. Please sign in again.",
      });
    }

    const email = decodedToken.email;
    if (!email) {
      return res.status(401).json({ message: "Google account has no verified email." });
    }

    const name = decodedToken.name || email.split("@")[0];

    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({ name, email });
    }

    const token = await genToken(user._id);
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Google auth error ${error}` });
  }
};

export const logOut = async (req, res) => {
  try {
    const isProd = process.env.NODE_ENV === "production";
    await res.clearCookie("token", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
    });
    return res.status(200).json({ message: "Logout successfully " });
  } catch (error) {
    return res.status(500).json({ message: `logout error ${error}` });
  }
};