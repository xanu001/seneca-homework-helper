import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from "firebase/auth";
import { 
  auth, 
  db, 
  googleProvider, 
  githubProvider,
  initializeUserData,
  isAdmin,
  UserPlan,
  logEvent,
  getRemainingQuestions
} from "@/lib/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  remainingQuestions: number;
}

interface UserProfile {
  uid: string;
  displayName: string;
  email: string | null;
  plan: UserPlan;
  isAdmin: boolean;
  questionsUsedThisWeek: number;
  weekStartedAt: Date | null;
  createdAt: Date | null;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  stripeCurrentPeriodEnd?: Date | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [remainingQuestions, setRemainingQuestions] = useState<number>(0);

  // Fetch user profile from Firestore
  const fetchUserProfile = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserProfile({
          uid,
          displayName: userData.displayName || "User",
          email: userData.email,
          plan: userData.plan || "free",
          isAdmin: userData.isAdmin || false,
          questionsUsedThisWeek: userData.questionsUsedThisWeek || 0,
          weekStartedAt: userData.weekStartedAt?.toDate() || null,
          createdAt: userData.createdAt?.toDate() || null,
          stripeCustomerId: userData.stripeCustomerId,
          stripeSubscriptionId: userData.stripeSubscriptionId,
          stripePriceId: userData.stripePriceId,
          stripeCurrentPeriodEnd: userData.stripeCurrentPeriodEnd?.toDate() || null
        });

        // Get remaining questions
        const remaining = await getRemainingQuestions(uid);
        setRemainingQuestions(remaining);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const refreshUserProfile = async () => {
    if (user) {
      await fetchUserProfile(user.uid);
    }
  };

  // Handle sign in with Google
  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Initialize or update user data
      await initializeUserData(user.uid, user.email, user.displayName);
      
      // Log signin event
      logEvent("login", { method: "google" });
      
      toast.success("Successfully signed in!");
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error("Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sign in with GitHub
  const signInWithGithub = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      
      // Initialize or update user data
      await initializeUserData(user.uid, user.email, user.displayName);
      
      // Log signin event
      logEvent("login", { method: "github" });
      
      toast.success("Successfully signed in!");
    } catch (error) {
      console.error("Error signing in with GitHub:", error);
      toast.error("Failed to sign in with GitHub");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      
      // Log logout event
      logEvent("logout");
      
      toast.success("Successfully logged out");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);
      
      if (authUser) {
        // User is signed in
        await fetchUserProfile(authUser.uid);
      } else {
        // User is signed out
        setUserProfile(null);
        setRemainingQuestions(0);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to user profile changes
  useEffect(() => {
    if (!user) return;
    
    // Set up a real-time listener for the user document
    const userDocRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userDocRef, async (snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.data();
        // Update user profile when data changes
        setUserProfile({
          uid: user.uid,
          displayName: userData.displayName || "User",
          email: userData.email,
          plan: userData.plan || "free",
          isAdmin: userData.isAdmin || false,
          questionsUsedThisWeek: userData.questionsUsedThisWeek || 0,
          weekStartedAt: userData.weekStartedAt?.toDate() || null,
          createdAt: userData.createdAt?.toDate() || null,
          stripeCustomerId: userData.stripeCustomerId,
          stripeSubscriptionId: userData.stripeSubscriptionId,
          stripePriceId: userData.stripePriceId,
          stripeCurrentPeriodEnd: userData.stripeCurrentPeriodEnd?.toDate() || null
        });

        // Get remaining questions
        const remaining = await getRemainingQuestions(user.uid);
        setRemainingQuestions(remaining);
        
        // Log subscription change if plan changed
        if (userData.plan === "premium" && userProfile?.plan === "free") {
          toast.success("Your subscription has been activated!");
          logEvent("subscription_activated");
        } else if (userData.plan === "free" && userProfile?.plan === "premium") {
          toast.info("Your subscription has ended.");
          logEvent("subscription_ended");
        }
      }
    });
    
    return () => unsubscribe();
  }, [user, userProfile?.plan]);

  // Auto-refresh token periodically
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      user.getIdToken(true)
        .then(() => console.log("Token refreshed"))
        .catch(err => console.error("Failed to refresh token:", err));
    }, 50 * 60 * 1000); // Refresh every 50 minutes
    
    return () => clearInterval(interval);
  }, [user]);

  const value = {
    user,
    userProfile,
    isLoading,
    signInWithGoogle,
    signInWithGithub,
    logout,
    refreshUserProfile,
    remainingQuestions
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}; 