
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
      category: "Email Verification"
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error(error);
    
  }
};

export const sendWelcomeEmail = async (email, username) => {
  
}
