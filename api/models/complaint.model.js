import mongoose from "mongoose";

const { Schema } = mongoose;

const ComplaintSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved"],
      default: "open",
    },
    resolvedAt: {
      type: Date,
    },
  },
  { timestamps: true } 
);

const Complaint = mongoose.model("Complaint", ComplaintSchema);

export default Complaint;
