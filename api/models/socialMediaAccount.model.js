import mongoose from "mongoose";

const { Schema } = mongoose;

const SocialMediaAccountSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    platform: {
      type: String,
      enum: ["Facebook", "Instagram", "Twitter", "LinkedIn"],
      required: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String, // Used for API authentication and access
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const SocialMediaAccount = mongoose.model(
  "SocialMediaAccount",
  SocialMediaAccountSchema
);

export default SocialMediaAccount;
