import mongoose from "mongoose";


const SurveySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  surveyType: {
    type: String,
    enum: ['domain', 'marketing', 'general'],
    required: true
  },
  targetBusinessDomain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusinessDomain',
    // If null, this survey is for all domains
  },
  active: {
    type: Boolean,
    default: true
  },
  questions: [{
    questionText: {
      type: String,
      required: true
    },
    questionType: {
      type: String,
      enum: ['multiple-choice', 'likert-scale', 'open-ended'],
      required: true
    },
    options: [{
      text: String,
      value: Number // Score value for assessment
    }],
    // For open-ended questions, we'll analyze the response separately
    weight: {
      type: Number,
      default: 1 // For weighted scoring in the assessment
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Survey = mongoose.model('Survey', SurveySchema);
export default Survey;