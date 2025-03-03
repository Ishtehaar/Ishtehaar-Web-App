import Stripe from "stripe";
import { updateUserSubscription } from "../services/subscriptionService.js";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const webHook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body, // Ensure `rawBody` is used, not `req.body`
      sig,
      process.env.STRIPE_WEBHOOK
    );
    console.log("✅ Webhook received:", event.type);
  } catch (err) {
    console.error("❌ Webhook verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId; // Ensure metadata is included in Stripe session

    if (!userId) {
      console.error("❌ User ID not found in session metadata");
      return res.status(400).send("User ID missing in session metadata");
    }

    console.log("🎉 Payment successful for user:", userId);

    try {
      const updatedUser = await updateUserSubscription(userId);
      console.log("✅ Subscription updated:", updatedUser);
    } catch (error) {
      console.error("❌ Error updating subscription:", error);
      return res.status(500).send("Internal server error");
    }
  }

  res.json({ received: true });
};
export const createCheckoutSession = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1QyDQCGzdZg8pcErnXqeuvWr",  // Using existing price ID
          quantity: 1,
        },
      ],
      mode: "subscription",
      metadata: {
        userId: req.user.userId, // Include user ID for webhook processing
      },
      success_url: "http://localhost:5173/dashboard",
      cancel_url: "http://localhost:5173/dashboard",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: error.message });
  }
};
