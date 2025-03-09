import mongoose from "mongoose";

const { Schema } = mongoose;

const SubscriptionSchema = new Schema(
  {
    planName: {
      type: String,
      required: true,
    },
    planPrice: {
      type: Number,
      required: true,
    },
    features: [
      {
        type: String,
        required: true,
      },
    ],
    isRecommended: {
      type: Boolean,
      default: false,
    },
    buttonText: {
      type: String,
      required: true,
    },
    buttonUrl: {
      type: String,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Subscription = mongoose.model("Subscription", SubscriptionSchema);

export default Subscription;
