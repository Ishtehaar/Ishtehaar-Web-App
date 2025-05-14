import BusinessDomain from "../models/businessDomain.model.js";
import { errorHandler } from "../utils/error.js";

export const getBusinessDomains = async (req, res) => {
  try {
    const domains = await BusinessDomain.find().sort({ order: 1 });
    res.json(domains);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export const getBusinessDomainById = async (req, res) => {
  try {
    const domain = await BusinessDomain.findById(req.params.id);

    if (!domain) {
      res.status(404);
      throw new Error("Business domain not found");
    }

    res.json(domain);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}

export const createBusinessDomain = async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    const domainExists = await BusinessDomain.findOne({ name });

    if (domainExists) {
      res.status(400);
      throw new Error("Business domain already exists");
    }

    const domain = new BusinessDomain({
      name,
      description,
      icon,
    });

    if (domain) {
      res.status(201).json(domain);
    } else {
      res.status(400);
      errorHandler(400, "Invalid business domain data");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export const updateBusinessDomain = async (req, res, next) => {
  try {
    const { businessDomainId } = req.body;
    
    if (!businessDomainId) {
      return res.status(400).json({ message: "Business domain ID is required" });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.businessDomain = businessDomainId;
    // Reset assessment when business domain changes
    user.assessmentCompleted = false;
    user.marketingKnowledge = 0;
    user.domainKnowledge = 0;
    user.expertiseLevel = 0;

    const updatedUser = await user.save();

    res.status(200).json({
      businessDomain: updatedUser.businessDomain,
      assessmentCompleted: updatedUser.assessmentCompleted
    });
  } catch (err) {
    next(err);
  }
};
