import mongoose from "mongoose";

const { Schema } = mongoose;

const SubscriptionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      type: String,
      enum: ["basic", "premium", "enterprise"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active",
    },
    paymentDetails: {
      transactionId: {
        type: String, // Unique identifier for the payment transaction
      },
      amount: {
        type: Number, // Amount paid for the subscription
      },
      method: {
        type: String, // Payment method used (e.g., credit card, PayPal)
      },
      date: {
        type: Date, // Date of the payment
      },
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Subscription = mongoose.model("Subscription", SubscriptionSchema);

export default Subscription;
