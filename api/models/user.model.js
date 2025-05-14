import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    subscription: {
      type: String,
      enum: ["free", "paid"],
      default: "free",
    },
    adCreditsRemaining: {
      type: Number,
      default: 5, // Free users start with 5 credits
    },
    subscriptionEndDate: {
      type: Date,
      default: null,
    },
    adsCreated: {
      type: Number,
      default: 0,
    },
    SEOKeywordsCreated: {
      type: Number,
      default: 0,
    },
    websiteAuditsCreated: {
      type: Number,
      default: 0,
    },
    socialCampaignsCreated: {
      type: Number,
      default: 0,
    },
    businessDomain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessDomain",
    },
    expertiseLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "expert"],
      default: "beginner",
    },
    marketingKnowledge: {
      type: Number,
      default: 0, // Score from 0-100 based on assessment
    },
    assessmentCompleted: {
      type: Boolean,
      default: false,
    },
    domainKnowledge: {
      type: Number,
      default: 0, // Score from 0-100 based on assessment
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
