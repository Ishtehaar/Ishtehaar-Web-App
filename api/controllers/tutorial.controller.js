import Tutorial from "../models/tutorial.model.js";

export const getTutorials = async (req, res) => {
  try {
    const tutorials = await Tutorial.find().sort({ order: 1 });
    res.json(tutorials);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export const createTutorial = async (req, res) => {
  try {
    const { title, description, steps, order } = req.body;

    const newTutorial = new Tutorial({
      title,
      description,
      steps,
      order,
    });

    const tutorial = await newTutorial.save();
    res.json(tutorial);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
