import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    tagline: {
      type: String,
      required: true,
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
    finalAd: { //URL of final ad after overlaying text on generated image on cloudinary
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Advertisment = mongoose.model("Advertisment", adSchema);

export default Advertisment;
