import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
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
  }
};

export const sendWelcomeEmail = async (email, username, next) => {
  const recipent = [{ email }];

  try {
   const response =  await mailtrapClient.send({
      from: sender,
      to: recipent,
      template_uuid: "1e5f5cb6-da44-42a5-b600-00fe372421ca",
      template_variables: {
        name: username,
      },
    });

    console.log("Welcome email sent successfully", response)
  } catch (error) {
    next(error)
  }
};
