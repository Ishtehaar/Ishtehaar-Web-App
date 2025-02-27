import User from "../models/user.model.js";

export const checkUsageLimit = async (req, res, next) => {
  const userId = req.user.id; // Assuming user is authenticated
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!user.hasSubscription && user.freePromptsUsed >= 5) {
    return res.status(403).json({ message: "Free limit reached. Purchase a plan to continue." });
  }

  next();
};

