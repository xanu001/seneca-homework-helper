import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { Github, LucideChrome } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { signInWithGoogle, signInWithGithub, isLoading } = useAuth();

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
    onClose();
  };

  const handleGithubSignIn = async () => {
    await signInWithGithub();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Sign In Required</DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            Please sign in to access the Sparx Helper and manage your account.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg text-sm text-blue-700">
            <p>Sign in to:</p>
            <ul className="mt-2 ml-5 list-disc">
              <li>Use the Sparx Homework Helper</li>
              <li>Save your progress and settings</li>
              <li>Access premium features</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={handleGoogleSignIn} 
              disabled={isLoading}
              className="w-full bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 py-5 flex items-center justify-center gap-2"
              variant="outline"
            >
              <LucideChrome className="h-5 w-5 text-blue-600" />
              <span>Continue with Google</span>
            </Button>
            
            <Button 
              onClick={handleGithubSignIn} 
              disabled={isLoading}
              className="w-full bg-gray-900 text-white hover:bg-gray-800 py-5 flex items-center justify-center gap-2"
            >
              <Github className="h-5 w-5" />
              <span>Continue with GitHub</span>
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 text-center mt-4">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal; 