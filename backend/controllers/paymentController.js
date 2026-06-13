import Stripe from 'stripe';

const getStripeInstance = () => {
  if (process.env.STRIPE_SECRET_KEY) {
    return new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return null;
};

// @desc    Process payments (Create Stripe Payment Intent)
// @route   POST /api/payment/process
// @access  Private
export const processPayment = async (req, res) => {
  const { amount } = req.body;
  const stripe = getStripeInstance();

  if (stripe) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // in cents
        currency: 'usd',
        metadata: { integration_check: 'accept_a_payment' },
      });

      return res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error('Stripe Error:', error);
      // Fall through to mock if stripe API fails
    }
  }

  // Fallback / Mock Payment Intent for offline or dev environments
  console.log("ℹ️ Standard Stripe secret missing or invalid. Returning simulated mock payment details.");
  res.status(200).json({
    success: true,
    client_secret: `mock_secret_intent_${Date.now()}`,
    isMock: true
  });
};

// @desc    Send Stripe API Key to Frontend
// @route   GET /api/payment/stripeapi
// @access  Private
export const sendStripeApiKey = async (req, res) => {
  res.status(200).json({
    stripeApiKey: process.env.STRIPE_API_KEY || 'pk_test_mock_stripe_api_key_51ABCDEF'
  });
};
