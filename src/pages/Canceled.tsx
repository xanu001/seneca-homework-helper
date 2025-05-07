import React from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const Canceled = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Header />
      <main className="flex-1 container py-12 px-4 flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="h-8 w-8 text-red-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Canceled</h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Your payment was canceled. No charges were made. You can try again whenever you're ready.
          </p>

          <div className="space-y-4">
            <Button 
              onClick={() => navigate("/")}
              className="w-full bg-primary"
              size="lg"
            >
              Return to Dashboard
            </Button>
            
            <Button 
              onClick={() => navigate("/")}
              variant="outline"
              className="w-full"
            >
              Try Again
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Canceled; 