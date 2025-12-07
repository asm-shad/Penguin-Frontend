/* eslint-disable @typescript-eslint/no-explicit-any */
import { loadStripe } from '@stripe/stripe-js';

let stripePromise: Promise<any> | null = null;

export const getStripe = () => {
  const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  
  if (!stripeKey) {
    console.error('Stripe publishable key is not defined');
    return null;
  }

  if (!stripePromise) {
    stripePromise = loadStripe(stripeKey);
  }
  
  return stripePromise;
};

export const redirectToStripeCheckout = async (sessionId: string) => {
  try {
    if (!sessionId) {
      return { 
        success: false, 
        message: "No checkout session ID provided" 
      };
    }

    // Direct URL construction - Stripe deprecated redirectToCheckout()
    const checkoutUrl = `https://checkout.stripe.com/c/pay/${sessionId}`;
    
    // Store for recovery
    localStorage.setItem('stripeSessionId', sessionId);
    localStorage.setItem('stripeRedirectTime', Date.now().toString());
    
    // Redirect to Stripe
    window.location.href = checkoutUrl;
    
    return { success: true };
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return {
      success: false,
      message: error.message || "Failed to process checkout",
    };
  }
};

// Helper to check if we're returning from Stripe
export const isReturningFromStripe = (): boolean => {
  const stripeSessionId = localStorage.getItem('stripeSessionId');
  const stripeRedirectTime = localStorage.getItem('stripeRedirectTime');
  
  if (!stripeSessionId || !stripeRedirectTime) {
    return false;
  }
  
  const timeElapsed = Date.now() - parseInt(stripeRedirectTime);
  const isRecent = timeElapsed < 10 * 60 * 1000; // Within 10 minutes
  
  return isRecent;
};

// Clear Stripe session data
export const clearStripeSession = () => {
  localStorage.removeItem('stripeSessionId');
  localStorage.removeItem('stripeRedirectTime');
};