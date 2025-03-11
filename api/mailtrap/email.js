import { errorHandler } from "../utils/error.js";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  SUBSCRIPTION_UPDATE_SUCCESS_EMAIL,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipent = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipent,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });

    console.log("Verification email sent successfully");
  } catch (error) {
    console.error(error);
    errorHandler(500, "Server Error", error);
  }
};

export const sendWelcomeEmail = async (email, username) => {
  const recipent = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipent,
      template_uuid: "1e5f5cb6-da44-42a5-b600-00fe372421ca",
      template_variables: {
        name: username,
      },
    });

    console.log("Welcome email sent successfully", response);
  } catch (error) {
    errorHandler(500, "Server Error", error);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });

    console.log("Password reset email sent successfully", response);
  } catch (error) {
    errorHandler(500, "Error sending password reset email", error);
  }
};

export const sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset Successful",
      },
    );

    console.log("Password reset success email sent successfully", response);
  } catch (error) {
    errorHandler(500, "Error sending password reset success email", error);
  }
}


export const sendSubscriptionUpdateEmail = async (email, expiryDate) => {
  const dashboardURL = "http://localhost:5173/dashboard";
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Subscription Upgraded Successfully",
      html: SUBSCRIPTION_UPDATE_SUCCESS_EMAIL
        .replace("{dashboardURL}", dashboardURL)
        .replace("{expiryDate}", expiryDate),
      category: "Subscription Upgraded",
    });

    console.log("Subscription Upgarde email sent successfully", response);
  } catch (error) {
    errorHandler(500, "Error sending Subscription upgrade email", error);
  }
}
