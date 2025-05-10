import Complaint from "../models/complaint.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

// Register a new complaint (existing function)
export const registerComplaint = async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming userId is obtained from the request
    const { subject, description } = req.body;

    // Validate required fields
    if (!userId || !subject || !description) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create a new complaint
    const newComplaint = new Complaint({
      userId,
      subject,
      description,
      status: "pending", // Default status
    });

    await newComplaint.save();

    res.status(201).json({
      message: "Complaint registered successfully.",
      complaint: newComplaint,
    });
  } catch (error) {
    console.error("Complaint registration failed:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Get all complaints (existing function - modified)
export const getComplaints = async (req, res, next) => {
  const currentUser = await User.findById(req.user.userId);
  console.log(currentUser);

  if (!currentUser.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see complaints"));
  }
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 }); // Fetch all, newest first
    res.status(200).json(complaints);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
};

// Get complaints by status (new)
export const getComplaintsByStatus = async (req, res, next) => {
  const currentUser = await User.findById(req.user.userId);
  console.log(currentUser);

  if (!currentUser.isAdmin) {
    return next(errorHandler(403, "You are not authorized!"));
  }
  try {
    const { status } = req.params;
    const validStatuses = ["pending", "in-progress", "resolved", "rejected"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status parameter" });
    }

    const complaints = await Complaint.find({ status }).sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    console.error("Error fetching complaints by status:", error);
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
};

// Get a specific complaint by ID (new)
export const getComplaintById = async (req, res, next) => {
  const currentUser = await User.findById(req.user.userId);
  console.log(currentUser);

  if (!currentUser.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see complaints"));
  }
  try {
    const { id } = req.params;

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json(complaint);
  } catch (error) {
    console.error("Error fetching complaint:", error);
    res.status(500).json({ message: "Failed to fetch complaint details" });
  }
};

// Get complaints for a specific user (new)
export const getUserComplaints = async (req, res, next) => {
  const currentUser = await User.findById(req.user.userId);
  console.log(currentUser);

  if (!currentUser.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see complaints"));
  }
  try {
    const userId = req.user.userId;

    const complaints = await Complaint.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    console.error("Error fetching user complaints:", error);
    res.status(500).json({ message: "Failed to fetch user complaints" });
  }
};

// Update complaint status (new)
export const updateComplaintStatus = async (req, res, next) => {
  const currentUser = await User.findById(req.user.userId);
  console.log(currentUser);

  if (!currentUser.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see complaints"));
  }
  try {
    const { id } = req.params;
    const { status, adminComment } = req.body;
    const adminId = req.user.userId; // Assuming the admin ID is in the request

    // Validate status
    const validStatuses = ["pending", "in-progress", "resolved", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Update the complaint
    complaint.status = status;
    complaint.adminComment = adminComment || complaint.adminComment;
    complaint.adminId = adminId;
    complaint.resolvedAt =
      status === "resolved" ? new Date() : complaint.resolvedAt;

    await complaint.save();

    res.status(200).json({
      message: `Complaint ${
        status === "resolved" ? "resolved" : "updated"
      } successfully`,
      complaint,
    });
  } catch (error) {
    console.error("Error updating complaint:", error);
    res.status(500).json({ message: "Failed to update complaint" });
  }
};

// Resolve a complaint (new)
export const resolveComplaint = async (req, res, next) => {
  const currentUser = await User.findById(req.user.userId);
  console.log(currentUser);

  if (!currentUser.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see complaints"));
  }
  try {
    const { id } = req.params;
    const { adminComment } = req.body;
    const adminId = req.user.userId; // Assuming the admin ID is in the request

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Update the complaint to resolved status
    complaint.status = "resolved";
    complaint.adminComment = adminComment || complaint.adminComment;
    complaint.adminId = adminId;
    complaint.resolvedAt = new Date();

    await complaint.save();

    res.status(200).json({
      message: "Complaint resolved successfully",
      complaint,
    });
  } catch (error) {
    console.error("Error resolving complaint:", error);
    res.status(500).json({ message: "Failed to resolve complaint" });
  }
};

// Admin dashboard stats (new)
export const getComplaintStats = async (req, res, next) => {
  const currentUser = await User.findById(req.user.userId);
  console.log(currentUser);

  if (!currentUser.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see complaints"));
  }
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({
      status: "pending",
    });
    const inProgressComplaints = await Complaint.countDocuments({
      status: "in-progress",
    });
    const resolvedComplaints = await Complaint.countDocuments({
      status: "resolved",
    });
    const rejectedComplaints = await Complaint.countDocuments({
      status: "rejected",
    });

    res.status(200).json({
      total: totalComplaints,
      pending: pendingComplaints,
      inProgress: inProgressComplaints,
      resolved: resolvedComplaints,
      rejected: rejectedComplaints,
    });
  } catch (error) {
    console.error("Error fetching complaint statistics:", error);
    res.status(500).json({ message: "Failed to fetch complaint statistics" });
  }
};


// Get complaints by a specific userId (Admin-only)
export const getComplaintsByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const complaints = await Complaint.find({ userId }).sort({ createdAt: -1 });

    if (!complaints.length) {
      return res.status(404).json({ message: "No complaints found for this user" });
    }

    res.status(200).json(complaints);
  } catch (error) {
    console.error("Error fetching complaints by userId:", error);
    res.status(500).json({ message: "Failed to fetch user complaints" });
  }
};
