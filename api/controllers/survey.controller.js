import Survey from "../models/survey.model.js";
import User from "../models/user.model.js";

export const getSurveys = async (req, res) => {
  const user = await User.findById(req.user.userId);

  // Get surveys for the user's business domain or general surveys
  const surveys = await Survey.find({
    $or: [
      { targetBusinessDomain: user.businessDomain },
      { targetBusinessDomain: null },
      { surveyType: "general" },
    ],  
    active: true,
  });

  res.json(surveys);
};

export const getSurveyById = async (req, res) => {
  const survey = await Survey.findById(req.params.id);

  if (survey) {
    res.json(survey);
  } else {
    res.status(404);
    throw new Error("Survey not found");
  }
};

export const submitSurvey = async (req, res) => {
  const { responses } = req.body;
  const surveyId = req.params.id;

  const survey = await Survey.findById(surveyId);

  if (!survey) {
    res.status(404);
    throw new Error("Survey not found");
  }

  // Calculate scores based on responses and question weights
  let totalScore = 0;
  const scoredResponses = responses.map((response) => {
    const question = survey.questions.id(response.question);
    let score = 0;

    if (question.questionType === "multiple-choice") {
      // Find the selected option and get its value
      const selectedOption = question.options.find(
        (option) => option._id.toString() === response.answer
      );
      score = selectedOption ? selectedOption.value * question.weight : 0;
    } else if (question.questionType === "likert-scale") {
      // For Likert scale, the answer is already a number
      score = response.answer * question.weight;
    }
    // For open-ended questions, scoring would be done separately or manually

    totalScore += score;

    return {
      ...response,
      score,
    };
  }); // ✅ Fixed: closed .map()

  // Optionally: Save responses or score to DB here if required

  res.status(200).json({
    message: "Survey submitted successfully",
    totalScore,
    scoredResponses,
  });
};
