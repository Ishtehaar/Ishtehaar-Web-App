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
    caption: {
      type: String,
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
    fontSize: {
      type: Number,
      default: 20,
    },
    taglineFontSize: {
      type: Number,
      default: 36,
    },
    textColor: {
      type: String,
      default: "#FFFFFF",
    },
    fontStyle: {
      type: String,
      default: "normal",
    },
    fontWeight: {
      type: String,
      default: "normal",
    },
    fontFamily: {
      type: String,
      default: "Arial",
    },
  },

  { timestamps: true }
);

const Advertisment = mongoose.model("Advertisment", adSchema);

export default Advertisment;
