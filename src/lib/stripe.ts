import { getAuth } from 'firebase/auth';
import { getFirestore, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { loadStripe } from '@stripe/stripe-js';

// Your Stripe publishable key (live mode key)
const STRIPE_PUBLISHABLE_KEY = 'pk_live_51RLqCIElUl0NyuA0yyXbonpthP9EGIzZCqb7Glc1O8QDr7NaVBq7ULizuQgswvs5NvmF4RdVat5LVqn0UKcOawUg001zvMLzWh';

// Premium price ID - this should be created in your Stripe dashboard
const PREMIUM_PRICE_ID = 'price_1RLqGtElUl0NyuA0sSKOZOk2';

// Initialize Stripe with publishable key
export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// Firebase function base URL
const FUNCTIONS_BASE_URL = 'https://us-central1-sparx-d2635.cloudfunctions.net';

interface CheckoutOptions {
  promoCode?: string;
  paymentMethod?: string;
}

/**
 * Create a Stripe Checkout Session with server-side request
 */
export async function createCheckoutSession(userId: string, options: {
  promoCode?: string;
  paymentMethod?: string;
} = {}) {
  try {
    // Store user ID for post-payment verification
    localStorage.setItem('pendingSubscriptionUserId', userId);
    
    console.log(`Creating checkout session for user: ${userId}`);
    console.log(`Sending request to: ${FUNCTIONS_BASE_URL}/createCheckoutSession`);
    
    // Create checkout session via server endpoint
    const response = await fetch(`${FUNCTIONS_BASE_URL}/createCheckoutSession`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'omit', // Don't send cookies
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        promoCode: options.promoCode || '',
        paymentMethod: options.paymentMethod || 'card',
        returnUrl: window.location.origin
      }),
    });

    // Handle non-OK responses
    if (!response.ok) {
      console.error(`Checkout error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`Error body: ${errorText}`);
      
      let errorMessage = 'Failed to create checkout session';
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        console.error('Error parsing error response:', e);
      }
      
      throw new Error(errorMessage);
    }

    // Parse response
    const data = await response.json();
    
    if (!data.sessionId) {
      console.error('No sessionId returned from server:', data);
      throw new Error('Invalid response from server: missing sessionId');
    }
    
    console.log(`Session created, redirecting to Stripe: ${data.sessionId}`);
    
    // Redirect to checkout using Stripe.js
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Failed to load Stripe');
    
    const { error } = await stripe.redirectToCheckout({ 
      sessionId: data.sessionId 
    });
    
    if (error) {
      console.error('Stripe redirect error:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

/**
 * Create a Stripe Customer Portal session for managing subscriptions
 */
export async function createPortalSession(userId: string) {
  try {
    const response = await fetch(`${FUNCTIONS_BASE_URL}/createPortalSession`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        userId,
        returnUrl: window.location.origin
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create portal session');
    }
    
    const data = await response.json();
    
    if (!data.url) {
      throw new Error('Invalid response from server: missing URL');
    }
    
    window.location.href = data.url;
    return true;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
}

// Update user account after successful payment
// This is a fallback method - the webhook will usually handle this automatically
export const updateUserSubscription = async (userId: string) => {
  try {
    const db = getFirestore();
    const userRef = doc(db, 'users', userId);
    
    // Subscription end date (30 days from now)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);
    
    console.log(`Updating user ${userId} to premium with end date ${endDate.toISOString()}`);
    
    // Update user subscription details with more complete information
    await updateDoc(userRef, {
      plan: 'premium',
      stripeCustomerId: `cus_manual_${Date.now()}`, // Generate a placeholder customer ID
      stripeSubscriptionId: `sub_manual_${Date.now()}`, // Generate a placeholder subscription ID
      stripePriceId: PREMIUM_PRICE_ID,
      stripeCurrentPeriodEnd: endDate, // 30 days from now
      updatedAt: Timestamp.now()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating subscription:', error);
    return false;
  }
};

// Handle successful checkout
export const handleCheckoutSuccess = async (userId: string) => {
  try {
    if (!userId) {
      console.error('No user ID provided for checkout success');
      return false;
    }
    
    console.log(`Processing successful checkout for user ${userId}`);
    const result = await updateUserSubscription(userId);
    
    if (result) {
      console.log(`Successfully updated subscription for user ${userId}`);
    } else {
      console.error(`Failed to update subscription for user ${userId}`);
    }
    
    return result;
  } catch (error) {
    console.error('Error handling checkout success:', error);
    return false;
  }
}; 