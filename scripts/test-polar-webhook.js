const crypto = require("crypto");

// Test webhook payload - simulates a successful checkout
const testPayload = {
  type: "checkout.completed",
  data: {
    id: "test_checkout_123",
    customer_id: "test_customer_123",
    customer_email: "test@example.com",
    customer_name: "Test User",
    amount: 1200, // $12.00 in cents
    currency: "USD",
    metadata: {
      fullName: "Test User",
      marketingConsent: "true",
    },
  },
};

// Generate webhook signature
function generateWebhookSignature(payload, secret) {
  const payloadString = JSON.stringify(payload);
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payloadString, "utf8")
    .digest("hex");

  return `sha256=${signature}`;
}

// Test the webhook endpoint
async function testWebhook() {
  const webhookSecret =
    process.env.POLAR_WEBHOOK_SECRET || "test_webhook_secret";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const payloadString = JSON.stringify(testPayload);
  const signature = generateWebhookSignature(testPayload, webhookSecret);

  console.log("Testing webhook with payload:", testPayload);
  console.log("Generated signature:", signature);

  try {
    const response = await fetch(`${baseUrl}/api/subscription/webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "polar-signature": signature,
      },
      body: payloadString,
    });

    const result = await response.text();
    console.log("Webhook response status:", response.status);
    console.log("Webhook response:", result);

    if (response.ok) {
      console.log("✅ Webhook test successful!");
    } else {
      console.log("❌ Webhook test failed!");
    }
  } catch (error) {
    console.error("Error testing webhook:", error);
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testWebhook();
}

module.exports = { testWebhook, generateWebhookSignature };
