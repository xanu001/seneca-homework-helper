import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Check, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { auth, db } from "@/lib/firebase";
import { getDoc, doc, updateDoc, Timestamp } from "firebase/firestore";
import { handleCheckoutSuccess } from "@/lib/stripe";

// Firebase function base URL
const FUNCTIONS_BASE_URL = 'https://us-central1-sparx-d2635.cloudfunctions.net';

const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { refreshUserProfile, user, userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationAttempts, setVerificationAttempts] = useState(0);

  // Check if user is already premium to show success
  const isAlreadyPremium = userProfile?.plan === "premium";

  const manuallyUpdateUser = async () => {
    if (!user) return false;
    
    try {
      setVerifying(true);
      
      // Get userId from localStorage, or use current user
      const pendingUserId = localStorage.getItem('pendingSubscriptionUserId') || user.uid;
      
      // Update the user document directly
      await handleCheckoutSuccess(pendingUserId);
      
      // Refresh user profile to update UI
      await refreshUserProfile();
      
      // Show success toast
      toast.success("Account upgraded to premium!");
      setError(null);
      setVerifying(false);
      return true;
    } catch (error) {
      console.error("Error manually updating user:", error);
      toast.error("Failed to update subscription status");
      setVerifying(false);
      return false;
    }
  };

  useEffect(() => {
    const verifyCheckout = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // If the user is already premium, no need to verify
        if (isAlreadyPremium) {
          console.log("User is already premium, skipping verification");
          setLoading(false);
          return;
        }
        
        if (!sessionId) {
          // No session ID but user is here - try to upgrade them directly
          const pendingUserId = localStorage.getItem('pendingSubscriptionUserId');
          if (pendingUserId && user) {
            console.log("No session ID but found pendingSubscriptionUserId:", pendingUserId);
            const success = await manuallyUpdateUser();
            if (success) {
              return;
            }
          }
          
          setError("Invalid checkout session. Please try again or contact support.");
          setLoading(false);
          return;
        }
        
        console.log(`Verifying checkout session: ${sessionId}`);
        console.log(`Sending verification request to: ${FUNCTIONS_BASE_URL}/verifyCheckout`);
        
        setVerificationAttempts(prev => prev + 1);
        
        // Verify the checkout session with our backend
        const response = await fetch(`${FUNCTIONS_BASE_URL}/verifyCheckout`, {
          method: 'POST',
          mode: 'cors',
          credentials: 'omit', // Don't send cookies
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        });
        
        if (!response.ok) {
          console.error(`Verification error: ${response.status} ${response.statusText}`);
          const errorText = await response.text();
          console.error(`Error body: ${errorText}`);
          
          let errorMessage = 'Failed to verify payment';
          
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorMessage;
          } catch (e) {
            console.error('Error parsing error response:', e);
          }
          
          throw new Error(errorMessage);
        }
        
        const data = await response.json();
        console.log('Payment successfully verified with response:', data);
        
        // Refresh the user profile to get updated subscription status
        await refreshUserProfile();
        toast.success("Payment successful! Welcome to premium!");
        
        // Clear any stored pending subscription data
        localStorage.removeItem('pendingSubscriptionUserId');
      } catch (err) {
        console.error("Error verifying payment:", err);
        setError("There was an issue verifying your payment. Your account may still be upgraded. Please try the manual verification below or contact support if issues persist.");
        
        // Try to refresh user profile anyway - the webhook might have already processed it
        try {
          await refreshUserProfile();
          // If user is premium despite verification error, show success anyway
          if (user) {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const userData = userDoc.data();
            if (userData && userData.plan === "premium") {
              toast.success("Your account has been upgraded to premium!");
              setError(null);
            }
          }
        } catch (profileErr) {
          console.error("Error checking profile after verification failure:", profileErr);
        }
      } finally {
        setLoading(false);
      }
    };

    // If we have a session ID or user is premium, verify the checkout
    if (sessionId || isAlreadyPremium) {
      verifyCheckout();
    } else {
      // No session ID, but still need to refresh profile in case webhook updated it
      refreshUserProfile();
      setLoading(false);
    }
  }, [sessionId, refreshUserProfile, isAlreadyPremium]);

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
              <div className="h-16 w-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-amber-600 text-2xl">!</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Verification Issue</h1>
              <p className="text-lg text-gray-600 mb-8">
                {error}
              </p>
              
              <div className="space-y-4">
                <Button
                  onClick={manuallyUpdateUser}
                  className="w-full bg-amber-600 hover:bg-amber-700"
                  size="lg"
                  disabled={verifying}
                >
                  {verifying ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Manual Verification
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={() => navigate("/")}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  Return to Dashboard
                </Button>
              </div>
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