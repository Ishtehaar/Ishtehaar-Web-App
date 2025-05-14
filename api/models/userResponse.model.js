import mongoose from "mongoose"

const UserResponseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  survey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey',
    required: true
  },
  responses: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    answer: {
      type: mongoose.Schema.Schema.Types.Mixed, // Could be String, Number, or Array depending on question type
      required: true
    },
    score: {
      type: Number,
      default: 0
    }
  }],
  totalScore: {
    type: Number,
    default: 0
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

const UserResponse = mongoose.model('UserResponse', UserResponseSchema);

export default UserResponse;