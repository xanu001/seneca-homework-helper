import React, { useMemo } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';
import { StripeElementsOptions } from '@stripe/stripe-js';

interface StripeProviderProps {
  children: React.ReactNode;
}

const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
  const options = useMemo<StripeElementsOptions>(() => ({
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#4f46e5', // Indigo primary color
        colorBackground: '#ffffff',
        colorText: '#1f2937',
      },
    },
    loader: 'auto',
  }), []);

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
};

export default StripeProvider; 