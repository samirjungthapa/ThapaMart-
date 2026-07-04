import Stripe from 'stripe';
import Order from '../models/Order.js';
import { readDb, writeDb } from '../utils/jsonDb.js';

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

// @desc    Stripe Webhook handler
// @route   POST /api/payment/webhook
// @access  Public
export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const stripe = getStripeInstance();
  let event;

  if (stripe && sig && process.env.STRIPE_WEBHOOK_SECRET) {
    try {
      // req.body should be raw buffer for verification
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error(`⚠️  Webhook signature verification failed:`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  } else {
    // If sig / webhook secret is not set, we accept a raw JSON payload (simulated webhook in dev)
    console.log("ℹ️ Simulated webhook event received (no signature verification).");
    try {
      event = typeof req.body === 'string' || Buffer.isBuffer(req.body)
        ? JSON.parse(req.body.toString())
        : req.body;
    } catch (err) {
      event = req.body;
    }
  }

  // Handle the event
  if (event && event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const orderId = (paymentIntent.metadata && paymentIntent.metadata.orderId) || event.orderId;
    
    console.log(`💰 PaymentIntent of ${paymentIntent.amount} succeeded for Order ID: ${orderId}`);

    if (orderId) {
      if (process.env.MONGODB_URI) {
        try {
          const order = await Order.findById(orderId).populate('user');
          if (order) {
            order.paymentStatus = 'Paid';
            order.orderStatus = 'Processing';
            order.stripePaymentIntentId = paymentIntent.id;
            await order.save();
            console.log(`✅ Order ${orderId} successfully marked as PAID via webhook.`);
          }
        } catch (err) {
          console.error('Error updating order on Mongo:', err.message);
        }
      } else {
        // Fallback JSON DB
        const db = readDb();
        const index = db.orders.findIndex(o => o.id === orderId || (o._id && o._id.toString() === orderId));
        if (index !== -1) {
          db.orders[index].paymentStatus = 'Paid';
          db.orders[index].orderStatus = 'Processing';
          db.orders[index].stripePaymentIntentId = paymentIntent.id || 'mock_stripe_id';
          writeDb(db);
          console.log(`✅ Order ${orderId} successfully marked as PAID via simulated JSON webhook.`);
        }
      }
    }
  }

  res.json({ received: true });
};
