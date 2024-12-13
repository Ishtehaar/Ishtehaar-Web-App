import mongoose from "mongoose";

const { Schema } = mongoose;

const CourseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    contentUrl: {
      type: String, // Video or document URL
      required: true,
    },
    tags: {
      type: [String],
    },
  },
  { timestamps: true } 
);

const Course = mongoose.model("Course", CourseSchema);

export default Course;
