import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp,
  increment,
  enableIndexedDbPersistence
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCr2ObN5wYU9XD6etNF0-hU8xPGgdFDYhQ",
  authDomain: "sparx-d2635.firebaseapp.com",
  projectId: "sparx-d2635",
  storageBucket: "sparx-d2635.firebasestorage.app",
  messagingSenderId: "518578448556",
  appId: "1:518578448556:web:fea020d7d5acaa28f4d709",
  measurementId: "G-YD4XFR45M3"
};

// Initialize Firebase
let app;
let analytics;
let auth;
let db;

try {
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  auth = getAuth(app);
  db = getFirestore(app);
  
  // Enable offline persistence
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support persistence.');
    }
  });
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

// Auth providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Define user plan types
export type UserPlan = "free" | "premium";

// Admin emails
const ADMIN_EMAILS = [
  "tom.business.purposes@gmail.com"
];

// Weekly question limit for free users
const FREE_PLAN_WEEKLY_LIMIT = 8;

// Check if user is admin
export const isAdmin = (email: string | null): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email);
};

// Initialize or update user in firestore
export const initializeUserData = async (userId: string, email: string | null, displayName: string | null) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    // First time user - create record
    await setDoc(userRef, {
      email,
      displayName: displayName || "User",
      plan: "free",
      questionsUsedThisWeek: 0,
      weekStartedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      isAdmin: isAdmin(email)
    });
  } else {
    // Existing user - update last login
    await updateDoc(userRef, {
      lastLoginAt: serverTimestamp()
    });
  }
};

// Record question usage
export const recordQuestionUsage = async (userId: string) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) return false;
  
  const userData = userSnap.data();
  const isUserAdmin = userData.isAdmin;
  const userPlan = userData.plan;
  
  // Admin users don't consume questions
  if (isUserAdmin) return true;
  
  // Premium users don't have limits
  if (userPlan === "premium") {
    await updateDoc(userRef, {
      questionsUsedTotal: increment(1)
    });
    return true;
  }
  
  // Check if we need to reset the week counter
  const weekStartedAt = userData.weekStartedAt?.toDate();
  const now = new Date();
  const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
  
  if (weekStartedAt && (now.getTime() - weekStartedAt.getTime() > oneWeekInMs)) {
    // Reset the counter for a new week
    await updateDoc(userRef, {
      questionsUsedThisWeek: 1,
      weekStartedAt: serverTimestamp(),
      questionsUsedTotal: increment(1)
    });
    return true;
  } else {
    // Check against weekly limit
    const questionsUsedThisWeek = userData.questionsUsedThisWeek || 0;
    
    if (questionsUsedThisWeek < FREE_PLAN_WEEKLY_LIMIT) {
      // Increment the counter
      await updateDoc(userRef, {
        questionsUsedThisWeek: increment(1),
        questionsUsedTotal: increment(1)
      });
      return true;
    } else {
      // Limit exceeded
      return false;
    }
  }
};

// Get remaining questions for free tier users
export const getRemainingQuestions = async (userId: string): Promise<number> => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) return 0;
  
  const userData = userSnap.data();
  const isUserAdmin = userData.isAdmin;
  const userPlan = userData.plan;
  
  // Admin or premium users have unlimited questions
  if (isUserAdmin || userPlan === "premium") return Infinity;
  
  // Check if we need to reset the week counter
  const weekStartedAt = userData.weekStartedAt?.toDate();
  const now = new Date();
  const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
  
  if (weekStartedAt && (now.getTime() - weekStartedAt.getTime() > oneWeekInMs)) {
    // New week - reset counter
    await updateDoc(userRef, {
      questionsUsedThisWeek: 0,
      weekStartedAt: serverTimestamp()
    });
    return FREE_PLAN_WEEKLY_LIMIT;
  } else {
    // Return remaining questions
    const questionsUsedThisWeek = userData.questionsUsedThisWeek || 0;
    return Math.max(0, FREE_PLAN_WEEKLY_LIMIT - questionsUsedThisWeek);
  }
};

// Log analytics event
export const logEvent = (eventName: string, params?: Record<string, any>) => {
  try {
    // @ts-ignore - using Firebase Analytics type
    analytics.logEvent(eventName, params);
  } catch (error) {
    console.error("Failed to log analytics event:", error);
  }
};

// Export initialized services
export { app, analytics, auth, db, googleProvider, githubProvider }; 