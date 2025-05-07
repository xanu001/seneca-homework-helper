import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, CreditCard, Tag } from 'lucide-react';

interface CheckoutFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  onCheckout?: (options: { promoCode?: string, paymentMethod: string }) => Promise<boolean>;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSuccess, onCancel, onCheckout }) => {
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user) {
      setError('You must be logged in to checkout');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Check if we have an onCheckout handler
      if (onCheckout) {
        await onCheckout({
          paymentMethod: 'card'
        });
        // No need to call onSuccess as we're redirecting to Stripe
      } else {
        setError('Checkout handler not provided');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="p-4 border rounded-md bg-white text-center">
          <p className="text-sm text-gray-600">
            You'll be redirected to Stripe's secure checkout page to complete your payment.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <strong>Premium Plan:</strong> $2.59/month
          </p>
          <div className="mt-3 flex items-center justify-center gap-1 text-xs text-blue-600">
            <Tag className="h-3 w-3" />
            <span>Promo codes can be applied on the checkout page</span>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
      
      <div className="flex flex-col gap-3">
        <Button
          type="submit"
          disabled={processing}
          className="w-full"
        >
          {processing ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </span>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Subscribe Now - $2.59/month
            </>
          )}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={processing}
          className="w-full"
        >
          Cancel
        </Button>
      </div>
      
      <div className="text-xs text-gray-500 text-center">
        <p>Secured by Stripe</p>
        <p>You can cancel your subscription at any time</p>
      </div>
    </form>
  );
};

export default CheckoutForm; 