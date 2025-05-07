import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";

// Firebase function base URL
const FUNCTIONS_BASE_URL = 'https://us-central1-sparx-d2635.cloudfunctions.net';

const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { refreshUserProfile, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyCheckout = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!sessionId) {
          setError("Invalid checkout session. Please try again or contact support.");
          setLoading(false);
          return;
        }
        
        // Verify the checkout session with our backend
        const response = await fetch(`${FUNCTIONS_BASE_URL}/verifyCheckout`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = 'Failed to verify payment';
          
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorMessage;
          } catch (e) {
            console.error('Error parsing error response:', e);
          }
          
          throw new Error(errorMessage);
        }
        
        // Refresh the user profile to get updated subscription status
        await refreshUserProfile();
        toast.success("Payment successful! Welcome to premium!");
        
        // Clear any stored pending subscription data
        localStorage.removeItem('pendingSubscriptionUserId');
      } catch (err) {
        console.error("Error verifying payment:", err);
        setError("There was an issue verifying your payment. Your account may still be upgraded. Please refresh or contact support if issues persist.");
      } finally {
        setLoading(false);
      }
    };

    // If we have a session ID, verify the checkout
    if (sessionId) {
      verifyCheckout();
    } else {
      // No session ID, but still need to refresh profile in case webhook updated it
      refreshUserProfile();
      setLoading(false);
    }
  }, [sessionId, refreshUserProfile]);

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Header />
      <main className="flex-1 container py-12 px-4 flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          {loading ? (
            <>
              <div className="h-16 w-16 mx-auto mb-6 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Processing Payment...</h1>
              <p className="text-lg text-gray-600 mb-8">
                Please wait while we confirm your subscription.
              </p>
            </>
          ) : error ? (
            <>
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-red-600 text-2xl">!</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Subscription Error</h1>
              <p className="text-lg text-gray-600 mb-8">
                {error}
              </p>
              <Button 
                onClick={() => navigate("/")}
                className="w-full bg-primary"
                size="lg"
              >
                Return to Dashboard
              </Button>
            </>
          ) : (
            <>
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
              <p className="text-lg text-gray-600 mb-8">
                Thank you for upgrading to premium! You now have unlimited access to all features.
              </p>
              <div className="space-y-4">
                <Button 
                  onClick={() => navigate("/")}
                  className="w-full bg-primary"
                  size="lg"
                >
                  Continue to Dashboard
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Success; 