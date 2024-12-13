import mongoose from "mongoose";

const { Schema } = mongoose;

const AnalyticsSchema = new Schema(
  {
    adCampaignId: {
      type: Schema.Types.ObjectId,
      ref: "Advertisment",
      required: true,
    },
    platform: {
      type: String,
      enum: ["Facebook", "Instagram", "Twitter", "LinkedIn"],
      required: true,
    },
    impressions: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true } 
);

const Analytics = mongoose.model("Analytics", AnalyticsSchema);

export default Analytics;
