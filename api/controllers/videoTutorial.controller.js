import VideoTutorial from "../models/videoTutorial.model.js";
export const getVideoTutorials = async (req, res) => {
  try {
    const videoTutorials = await VideoTutorial.find();
    res.json(videoTutorials);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export const createVideoTutorial = async (req, res) => {
  try {
    const { title, description, thumbnail, videoUrl, duration } = req.body;

    const newVideoTutorial = new VideoTutorial({
      title,
      description,
      thumbnail,
      videoUrl,
      duration,
    });

    const videoTutorial = await newVideoTutorial.save();
    res.json(videoTutorial);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
