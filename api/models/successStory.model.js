import mongoose from "mongoose";

const SuccessStorySchema = new mongoose.Schema({
  client: {
    type: String,
    required: true,
    trim: true
  },
  industry: {
    type: String,
    required: true
  },
  result: {
    type: String,
    required: true
  },
  quote: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  fullCaseStudyUrl: {
    type: String,
    default: '#'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const SuccessStory = mongoose.model('SuccessStory', SuccessStorySchema);
export default SuccessStory;