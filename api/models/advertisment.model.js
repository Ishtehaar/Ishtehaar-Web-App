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
    finalAd: {
      //URL of final ad after overlaying text on generated image on cloudinary
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    logo: {
      type: String,
    },
    website: {
      type: String,
    },
    location: {
      type: String,
    },
    date: {
      type: String,
    },
    time: {
      type: String,
    },
    instagram: {
      type: String,
    },
    facebook: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    twitter: {
      type: String,
    },
  },
  { timestamps: true }
);

const Advertisment = mongoose.model("Advertisment", adSchema);

export default Advertisment;
