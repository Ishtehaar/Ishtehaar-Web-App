import User from "../models/user.model.js";




export const checkAdLimits = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (user.subscription === "free") {
      if (user.adCreditsRemaining <= 0) {
        return res.status(403).json({
          success: false,
          message:
            "You have reached the limit for ad generation on the free plan. Please upgrade to continue.",
        });
      }

      // Reduce credits for free users
      user.adCreditsRemaining -= 1;
      await user.save();
    }

    // If paid or free with remaining credits, proceed
    next();
  } catch (error) {
    console.error("Error checking ad limits:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
