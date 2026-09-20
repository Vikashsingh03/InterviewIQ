import interviewModel from "../models/interview.model.js";

// DELETE /api/interview/coach/:id
// Clears the AI Coach conversation for one of the logged-in user's
// interviews. Only the chat is removed: the report, scores and per-question
// coaching are untouched. The next GET /coach/:id starts a fresh conversation
// (it writes a new opening message when the chat is empty).
//
// Ownership is enforced in the query itself (userId), so nobody can clear
// someone else's chat by guessing an interview id.
const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

export const clearCoachChat = async (req, res) => {
  try {
    const { id } = req.params;

    if (!OBJECT_ID_REGEX.test(id)) {
      return res.status(400).json({ message: "Invalid interview." });
    }

    const result = await interviewModel.updateOne(
      { _id: id, userId: req.userId },
      { $set: { coachMessages: [] } },
    );

    if (!result.matchedCount) {
      return res.status(404).json({ message: "Interview not found." });
    }

    return res.status(200).json({ message: "Chat cleared." });
  } catch (error) {
    console.error("coach chat clear error:", error?.message || error);
    return res
      .status(500)
      .json({ message: "Couldn't clear the chat. Please try again." });
  }
};