import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail
} from "../mailtrap/email.js";
import { log } from "console";

//SIGNUP
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    if (
      !username ||
      !email ||
      !password ||
      username === "" ||
      email === "" ||
      password === ""
    ) {
      next(errorHandler(400, "All fields are required"));
    }
    if (password.length < 8) {
      return next(errorHandler(400, "Password must be at least 8 characters"));
    }
    if (username.includes(" ")) {
      return next(errorHandler(400, "Username cannot contain spaces"));
    }
    if (username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, "Username must be lowercase"));
    }
    if (!username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Username can only contain letters and numbers")
      );
    }
    if (email.includes(" ")) {
      return next(errorHandler(400, "Email cannot contain spaces"));
    }
    const userAlreadyExists =
      (await User.findOne({ email })) || (await User.findOne({ username }));
    if (userAlreadyExists) {
      next(errorHandler(400, "User already exists"));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const verificationToken = generateVerificationToken();

    const user = new User({
      username: username,
      email: email,
      password: hashedPassword,
      verificationToken: verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24hrs
    });

    await user.save();

    generateTokenAndSetCookie(res, user._id, user.isAdmin);
    await sendVerificationEmail(user.email, verificationToken);

    const { password: pass, ...rest } = user._doc;
    res
      .status(201)
      .json({ success: true, message: "SignUp Successfull", user: rest });
  } catch (error) {
    errorHandler(400, "Error in signup")
    next(error);
  }
};

//VERIFY EMAIL
export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      errorHandler(400, "Invalid or expired verification code");
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();

    await sendWelcomeEmail(user.email, user.username);

    const { password: pass, ...rest } = user._doc;

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: rest,
    });
  } catch (error) {
    console.log("Error in verifying email", error);

    errorHandler(400, "Error in verify email");
  }
};

//SIGNIN
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All fields are required"));
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }

    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();

    const { password: pass, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    console.log("Error in signin", error);
    errorHandler(400, "Error in signin")
    next(error);
  }
};

//GOOGLE SIGNIN
export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = newUser._doc;
      const expiryDate = new Date(Date.now() + 3600000);
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          expires: expiryDate,
        })
        .json(rest);
    }
  } catch (error) {
    errorHandler(400, "Error in google signin")
    next(error);
  }
};

//SIGNOUT USER
export const signout = async (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "Signout successful" });
  } catch (error) {
    errorHandler(400, "Error in signout")
    next(error);
  }
};

//FORGOT PASSWORD
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      errorHandler(404, "User not found");
    }

    //generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    //send email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res
      .status(200)
      .json({
        success: true,
        message: "Password reset link send to your email",
      });
  } catch (error) {
    errorHandler(400, "Error in forgotPassword")
    next(error);
  }
};

//RESET PASSWORD
export const resetPassword = async(req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
  
    if(!user){
      errorHandler(404, "Invalid token or expired token");
    }

    //update password
    const hashedPassword = bcryptjs.hashSync(password, 10);
    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    sendResetSuccessEmail(user.email);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });

  } catch (error) {
    errorHandler(400, "Error in resetPassword")
    next(error)
  }
}
