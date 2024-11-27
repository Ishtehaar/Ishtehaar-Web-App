import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
    },
    textPrompt: {
      type: String,
      required: true,
    },
    imagePrompt: {
      type: String,
      required: true,
    },
    backgroundImage: {
      //URL of generated image on cloudinary
      type: String,
      required: true,
    },
    overlayText: {
      type: String,
      required: true,
    },
    // platform: {
    //   type: [String],
    //   enum: ["Facebook", "Instagram", "Twitter", "LinkedIn"],
    // },
    // status: {
    //   type: [],
    //   enum: ["draft", "scheduled", "posted"],
    //   default: "draft",
    // },
    // scheduledPostDate: {
    //   type: Date,
    // },
  },
  { timestamps: true }
);

const Advertisment = mongoose.model("Advertisment", adSchema);

export default Advertisment;
