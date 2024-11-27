import bcryptjs from "bcryptjs";

import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";

//TEST
export const test = async (req, res, next) => {
  res.send("Hello from test");
};

//UPDATE USER
export const updateUser = async (req, res, next) => {
  const { username, email, password } = req.body;

  console.log("req "+req.user.userId);
  console.log("params "+req.params.userId);

  if (req.user.userId !== req.params.userId) {
    errorHandler(403, "You are not allowed to update this user");
  }

  if (username === "") {
    return next(errorHandler(400, "Username cannot be empty"));
  }
  if (email === "") {
    return next(errorHandler(400, "Email cannot be empty"));
  }
  if (password === "") {
    return next(errorHandler(400, "Password cannot be empty"));
  }

  if (req.body.password) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(req.body.password)) {
      return next(
        errorHandler(
          400,
          "Password must be at least 8 characters long, include one uppercase letter, one number, and one symbol."
        )
      );
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.trim().length === 0) {
      return next(errorHandler(400, "Username cannot be an empty string"));
    }
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        errorHandler(400, "Username must be between 7 and 20 characters")
      );
    }
    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "Username cannot contain spaces"));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, "Username must be lowercase"));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Username can only contain letters and numbers")
      );
    }
  }
  if (req.body.email) {
    if (req.body.email.includes(" ")) {
      return next(errorHandler(400, "Email cannot contain spaces"));
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

//DELETE USER
export const deleteUser = async (req, res, next) => {
  console.log("req "+req.user.userId);
  console.log("params "+req.params.userId);

  if (req.user.userId !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this user"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
};
