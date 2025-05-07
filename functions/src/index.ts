import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';
import cors from 'cors';

// Get CORS configuration from Firebase config
const corsOrigin = functions.config().cors?.origin || 'https://sparx-d2635.web.app';
const corsHandler = cors({ 
  origin: true, // Allow requests from any origin
  methods: ['POST', 'OPTIONS', 'GET'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  maxAge: 3600
});

// Initialize Firebase
admin.initializeApp();

// Initialize Stripe with API key from config
const stripeSecretKey = functions.config().stripe?.secret_key || process.env.STRIPE_SECRET_KEY;
const webhookSecret = functions.config().stripe?.webhook_secret || process.env.STRIPE_WEBHOOK_SECRET;

// Verify that we have a Stripe key
if (!stripeSecretKey) {
  console.error('Missing Stripe secret key. Set using firebase functions:config:set stripe.secret_key="your_key"');
}

// Initialize Stripe
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
});

// Constants for plans
const PREMIUM_PRICE_ID = 'price_1RLqGtElUl0NyuA0sSKOZOk2'; // Price ID for $2.59/month

/**
 * Create a Stripe Checkout Session
 * https://docs.stripe.com/payments/accept-a-payment
 */
export const createCheckoutSession = functions.https.onRequest((req, res) => {
  // Set CORS headers for all responses
  res.set('Access-Control-Allow-Origin', 'https://sparx-d2635.web.app');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.set('Access-Control-Max-Age', '3600');
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  
  // Handle actual request
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  (async () => {
    try {
      console.log('Received checkout request:', JSON.stringify(req.body));
      const { userId, promoCode, paymentMethod, returnUrl } = req.body;
      
      if (!userId || !returnUrl) {
        console.error('Missing required params:', { userId, returnUrl });
        res.status(400).json({ error: 'Missing userId or returnUrl' });
        return;
      }

      // Get user from Firestore
      const userDoc = await admin.firestore().collection('users').doc(userId).get();
      if (!userDoc.exists) {
        console.error(`User not found: ${userId}`);
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const userData = userDoc.data();
      const userEmail = userData?.email;
      console.log(`Creating checkout for user: ${userId}, email: ${userEmail}`);

      // Set up payment method types
      const paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] = ['card'];
      if (paymentMethod === 'link') {
        paymentMethodTypes.push('link' as Stripe.Checkout.SessionCreateParams.PaymentMethodType);
      }

      // Create checkout session with updated price
      const session = await stripe.checkout.sessions.create({
        payment_method_types: paymentMethodTypes,
        line_items: [{
          price: PREMIUM_PRICE_ID, // This should be your $2.59 price ID
          quantity: 1,
        }],
        mode: 'subscription',
        customer_email: userEmail,
        client_reference_id: userId,
        success_url: `${returnUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${returnUrl}/canceled`,
        allow_promotion_codes: true, // Enable coupon code input
      });

      console.log(`Checkout session created: ${session.id}`);
      res.status(200).json({ sessionId: session.id });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: 'Failed to create checkout session' });
    }
  })();
});

/**
 * Create a portal session for subscription management
 * https://docs.stripe.com/customer-management/create-customer-portal-session
 */
export const createPortalSession = functions.https.onRequest((req, res) => {
  // Set CORS headers for all responses
  res.set('Access-Control-Allow-Origin', 'https://sparx-d2635.web.app');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.set('Access-Control-Max-Age', '3600');
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  
  // Handle actual request
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  (async () => {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        res.status(400).json({ error: 'Missing userId' });
        return;
      }

      // Get user's Stripe customer ID from Firestore
      const userDoc = await admin.firestore().collection('users').doc(userId).get();
      if (!userDoc.exists) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const userData = userDoc.data();
      const stripeCustomerId = userData?.stripeCustomerId;

      if (!stripeCustomerId) {
        res.status(400).json({ error: 'User does not have a Stripe customer ID' });
        return;
      }

      // Create portal session
      const session = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: req.body.returnUrl || 'https://sparx-d2635.web.app',
      });

      res.status(200).json({ url: session.url });
    } catch (error) {
      console.error('Error creating portal session:', error);
      res.status(500).json({ error: 'Failed to create portal session' });
    }
  })();
});

/**
 * Verify a checkout session 
 * Used by the success page to confirm payment completion
 */
export const verifyCheckout = functions.https.onRequest((req, res) => {
  // Set CORS headers for all responses
  res.set('Access-Control-Allow-Origin', 'https://sparx-d2635.web.app');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.set('Access-Control-Max-Age', '3600');
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  
  console.log("verifyCheckout request received. Method:", req.method, "Headers:", JSON.stringify(req.headers));
  
  // Handle actual request
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  (async () => {
    try {
      console.log('Received verification request. Body:', JSON.stringify(req.body));
      const { sessionId } = req.body;
      
      if (!sessionId) {
        console.error('Missing session ID in verification request');
        res.status(400).json({ error: 'Missing sessionId' });
        return;
      }

      // Retrieve the session from Stripe
      console.log(`Retrieving Stripe session: ${sessionId}`);
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      if (!session) {
        console.error(`Session not found: ${sessionId}`);
        res.status(404).json({ error: 'Session not found' });
        return;
      }

      console.log(`Session status: ${session.payment_status}`);
      // Check session status
      if (session.payment_status !== 'paid') {
        console.error(`Payment not completed: ${sessionId}`);
        res.status(400).json({ error: 'Payment not completed' });
        return;
      }

      // Get the user ID from the session
      const userId = session.client_reference_id;
      
      if (!userId) {
        console.error(`No user ID in session: ${sessionId}`);
        res.status(400).json({ error: 'No user associated with this session' });
        return;
      }

      console.log(`Verified payment for user: ${userId}`);

      // If the webhook hasn't processed this yet, let's update the user ourselves
      const userDoc = await admin.firestore().collection('users').doc(userId).get();
      
      if (userDoc.exists) {
        const userData = userDoc.data();
        
        // Only update if not already premium
        if (userData.plan !== 'premium') {
          console.log(`Updating user ${userId} to premium plan`);
          await handleCheckoutSessionCompleted(session);
        } else {
          console.log(`User ${userId} is already premium`);
        }
      }

      res.status(200).json({ 
        success: true, 
        user_id: userId 
      });
    } catch (error) {
      console.error('Error verifying checkout:', error);
      res.status(500).json({ error: 'Failed to verify checkout session' });
    }
  })();
});

/**
 * Webhook handler for Stripe events
 * https://docs.stripe.com/webhooks
 */
export const webhook = functions.https.onRequest((req, res) => {
  // Set CORS headers for all responses
  res.set('Access-Control-Allow-Origin', 'https://sparx-d2635.web.app');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, stripe-signature');
  res.set('Access-Control-Max-Age', '3600');
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  
  // Handle actual request
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  (async () => {
    try {
      const signature = req.headers['stripe-signature'];
      if (!signature || !webhookSecret) {
        res.status(400).send('Missing signature or webhook secret');
        return;
      }

      // Verify the event
      let event;
      try {
        event = stripe.webhooks.constructEvent(
          req.rawBody,
          signature as string,
          webhookSecret
        );
      } catch (err) {
        console.log(`Webhook signature verification failed: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      // Handle the event
      switch (event.type) {
        case 'checkout.session.completed':
          await handleCheckoutSessionCompleted(event.data.object);
          break;
        case 'customer.subscription.updated':
          await handleSubscriptionUpdated(event.data.object);
          break;
        case 'customer.subscription.deleted':
          await handleSubscriptionDeleted(event.data.object);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Error handling webhook:', error);
      res.status(500).send('Internal Server Error');
    }
  })();
});

/**
 * Handle successful checkout completion
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.client_reference_id;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!userId) {
    console.error('No user ID in session metadata');
    return;
  }

  try {
    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const priceId = subscription.items.data[0].price.id;

    // Update user in Firestore
    await admin.firestore().collection('users').doc(userId).update({
      plan: 'premium',
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: priceId,
      stripeCurrentPeriodEnd: admin.firestore.Timestamp.fromMillis(
        subscription.current_period_end * 1000
      ),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`Updated subscription for user ${userId}`);
  } catch (error) {
    console.error(`Error updating user after checkout: ${error}`);
  }
}

/**
 * Handle subscription updates
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    // Find user with this subscription ID
    const usersSnapshot = await admin.firestore()
      .collection('users')
      .where('stripeSubscriptionId', '==', subscription.id)
      .get();

    if (usersSnapshot.empty) {
      console.log(`No user found for subscription ${subscription.id}`);
      return;
    }

    for (const doc of usersSnapshot.docs) {
      await doc.ref.update({
        stripeCurrentPeriodEnd: admin.firestore.Timestamp.fromMillis(
          subscription.current_period_end * 1000
        ),
        stripePriceId: subscription.items.data[0].price.id,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`Updated subscription period for user ${doc.id}`);
    }
  } catch (error) {
    console.error(`Error updating subscription: ${error}`);
  }
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    // Find user with this subscription ID
    const usersSnapshot = await admin.firestore()
      .collection('users')
      .where('stripeSubscriptionId', '==', subscription.id)
      .get();

    if (usersSnapshot.empty) {
      console.log(`No user found for subscription ${subscription.id}`);
      return;
    }

    for (const doc of usersSnapshot.docs) {
      await doc.ref.update({
        plan: 'free',
        stripeCurrentPeriodEnd: null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`Marked subscription as canceled for user ${doc.id}`);
    }
  } catch (error) {
    console.error(`Error processing subscription cancellation: ${error}`);
  }
} 