import SuccessStory from "../models/successStory.model.js";

export const getSuccessStories = async (req, res) => {
  try {
    const successStories = await SuccessStory.find();
    res.json(successStories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export const createSuccessStory = async (req, res) => {
  try {
    const { client, industry, result, quote, image, fullCaseStudyUrl } =
      req.body;

    const newSuccessStory = new SuccessStory({
      client,
      industry,
      result,
      quote,
      image,
      fullCaseStudyUrl,
    });

    const successStory = await newSuccessStory.save();
    res.json(successStory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
