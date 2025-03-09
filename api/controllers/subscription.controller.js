import Subscription from "../models/subscription.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const createSubscription = async (req, res, next) => {
  const currentUser = await User.findById(req.user.userId);
  if (!currentUser.isAdmin) {
    return next(
      errorHandler(403, "You are not allowed to create subscription plan")
    );
  }

  const {
    planName,
    planPrice,
    features,
    isRecommended,
    buttonText,
    buttonUrl,
  } = req.body;

  //   console.log(req.body);
  if (
    !planName ||
    planPrice === undefined ||
    isRecommended === undefined ||
    !buttonText ||
    !buttonUrl
  ) {
    return next(errorHandler(400, "All fields are required"));
  }
  const existingPlan = await Subscription.findOne({ planName });
  if (existingPlan) {
    return next(errorHandler(400, "Plan already exists"));
  }
  const newPlan = new Subscription({
    planName,
    planPrice,
    features,
    isRecommended,
    buttonText,
    buttonUrl,
  });
  try {
    const savedPlan = await newPlan.save();
    res
      .status(201)
      .json({ message: "Subscription plan created successfully", savedPlan });
  } catch (error) {
    next(errorHandler(500, "Failed to create plan"));
  }
};

export const getSubscriptions = async (req, res, next) => {
  const currentUser = await User.findById(req.user.userId);
  if (!currentUser.isAdmin) {
    return next(
      errorHandler(403, "You are not allowed to create subscription plan")
    );
  }
  try {
    const subscriptions = await Subscription.find({}).sort({ planPrice: 1 });
    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions,
    });
  } catch (error) {
    next(errorHandler(500, "Failed to get subscriptions"));
  }
};

export const getSubscription = async (req, res, next) => {
  const currentUser = await User.findById(req.user.userId);
  if (!currentUser.isAdmin) {
    return next(
      errorHandler(403, "You are not allowed to create subscription plan")
    );
  }
  try {
    const subscription = await Subscription.findById(req.params.subscriptionId);
    if (!subscription) {
      return next(errorHandler(404, "Subscription plan not found"));
    }
    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(errorHandler(500, "Failed to get subscription"));
  }
};

export const updateSubscription = async (req, res, next) => {
  const {
    planName,
    planPrice,
    features,
    isRecommended,
    buttonText,
    buttonUrl,
  } = req.body;

  const currentUser = await User.findById(req.user.userId);
  //   console.log(currentUser);
  if (!currentUser.isAdmin) {
    return next(
      errorHandler(403, "You are not allowed to update subscription plan")
    );
  }
  try {
    // Find the subscription plan
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      req.params.subscriptionId,
      {
        $set: {
          planName: planName,
          planPrice: planPrice,
          features: features,
          isRecommended: isRecommended,
          buttonText: buttonText,
          buttonUrl: buttonUrl,
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedSubscription,
      message: "Subscription plan updated successfully",
    });
  } catch (error) {
    next(errorHandler(500, "Failed to update subscription"));
  }
};

export const deleteSubscription = async (req, res, next) => {
  const currentUser = await User.findById(req.user.userId);
  if (!currentUser.isAdmin) {
    return next(
      errorHandler(403, "You are not allowed to delete subscription plan")
    );
  }
  try {
    const subscription = await Subscription.findById(req.params.subscriptionId);
    if (!subscription) {
      return next(errorHandler(404, "Subscription plan not found"));
    }
    await subscription.deleteOne({ _id: req.params.id });
    res.status(200).json({
      success: true,
      message: "Subscription plan deleted successfully",
    });
  } catch (error) {
    next(errorHandler(500, "Failed to delete subscription"));
  }
};
