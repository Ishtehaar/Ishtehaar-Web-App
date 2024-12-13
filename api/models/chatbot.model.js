import mongoose from "mongoose";

const { Schema } = mongoose;

const ChatbotInteractionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    query: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ChatbotInteraction = mongoose.model(
"ChatbotInteraction",
  ChatbotInteractionSchema
);

export default ChatbotInteraction;
