import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CheckoutForm from './CheckoutForm';
import { Star } from 'lucide-react';

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onCheckout?: (options: { promoCode?: string, paymentMethod: string }) => Promise<boolean>;
}

const CheckoutDialog: React.FC<CheckoutDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onCheckout
}) => {
  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  const handleCheckout = async (options: { promoCode?: string, paymentMethod: string }) => {
    if (onCheckout) {
      const success = await onCheckout(options);
      if (success) {
        // If the checkout was redirected to Stripe, we don't need to do anything else
        // as the user will be redirected away from the app
        return true;
      }
    }
    return false;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            Upgrade to Premium
          </DialogTitle>
          <DialogDescription>
            Unlock unlimited questions and premium features for just $5.99/month
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <div className="mb-6 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-xs">✓</span>
              </div>
              <span className="text-sm">Unlimited questions per week</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-xs">✓</span>
              </div>
              <span className="text-sm">Priority support</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-xs">✓</span>
              </div>
              <span className="text-sm">Cancel anytime</span>
            </div>
          </div>

          <CheckoutForm 
            onSuccess={handleSuccess} 
            onCancel={onClose} 
            onCheckout={handleCheckout}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog; 