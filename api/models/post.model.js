import mongoose from "mongoose";

const { Schema } = mongoose;

const ScheduledPostSchema = new Schema(
  {
    adCampaignId: {
      type: Schema.Types.ObjectId,
      ref: "AdCampaign",
      required: true,
    },
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
    scheduledDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "posted", "failed"],
      default: "pending",
    },
    error: {
      type: String, // Stores error messages if posting fails
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const ScheduledPost = mongoose.model("ScheduledPost", ScheduledPostSchema);

export default ScheduledPost;
