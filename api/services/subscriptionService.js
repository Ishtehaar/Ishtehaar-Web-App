import User from "../models/user.model.js";

// services/subscriptionService.js
export const updateUserSubscription = async (userId) => {   // from free to premium
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');
      
      user.subscription = 'paid';
      user.adCreditsRemaining = Infinity; // Unlimited for paid users
      // Set subscription end date to 1 month from now
      user.subscriptionEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      
      await user.save();
      return user;
    } catch (error) {
      console.error('Error updating user subscription:', error);
      throw error;
    }
  }