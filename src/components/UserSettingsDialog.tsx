import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Check, 
  CreditCard, 
  LogOut, 
  Star, 
  User, 
  Shield, 
  BarChart,
  ExternalLink,
  Bell,
  Settings
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createCheckoutSession, createPortalSession } from '@/lib/stripe';
import { toast } from 'sonner';
import CheckoutDialog from "./CheckoutDialog";

interface UserSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserSettingsDialog: React.FC<UserSettingsDialogProps> = ({ isOpen, onClose }) => {
  const { userProfile, logout, remainingQuestions, refreshUserProfile } = useAuth();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  if (!userProfile) return null;
  
  const handleLogout = async () => {
    await logout();
    onClose();
  };
  
  const handleUpgrade = async () => {
    if (!userProfile.uid) return;
    
    try {
      setIsCheckoutOpen(true);
    } catch (error) {
      console.error('Error starting checkout:', error);
      toast.error('Failed to start checkout process. Please try again.');
    }
  };
  
  const handleCheckoutSuccess = async () => {
    toast.success("Payment successful! Welcome to premium!");
    await refreshUserProfile();
  };
  
  const handleCheckoutWithOptions = async (options: { promoCode?: string, paymentMethod: string }) => {
    if (!userProfile.uid) return false;
    
    try {
      toast.info("Preparing checkout...");
      await createCheckoutSession(userProfile.uid, options);
      return true;
    } catch (error) {
      console.error('Error starting checkout:', error);
      toast.error('Failed to start checkout process. Please try again.');
      return false;
    }
  };
  
  const handleManageSubscription = async () => {
    if (!userProfile.uid) return;
    
    try {
      toast.info("Opening customer portal...");
      await createPortalSession(userProfile.uid);
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error('Failed to open subscription management. Please try again.');
    }
  };
  
  // Format subscription end date if available
  const formatSubscriptionEndDate = () => {
    if (userProfile.stripeCurrentPeriodEnd) {
      return format(userProfile.stripeCurrentPeriodEnd, 'MMMM d, yyyy');
    }
    return "N/A";
  };
  
  const weeklyQuestion = userProfile.plan === "free" ? FREE_PLAN_WEEKLY_LIMIT : "∞";
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              User Settings
              {userProfile.plan === "premium" && (
                <span className="inline-flex items-center ml-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                </span>
              )}
              {userProfile.isAdmin && (
                <span className="ml-2 text-xs font-semibold px-2 py-0.5 bg-red-100 text-red-800 rounded-full">
                  Admin
                </span>
              )}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Manage your account, subscription, and preferences
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="account" className="mt-4">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="account" className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                <span>Account</span>
              </TabsTrigger>
              <TabsTrigger value="subscription" className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5" />
                <span>Subscription</span>
              </TabsTrigger>
              <TabsTrigger value="usage" className="flex items-center gap-1.5">
                <BarChart className="h-3.5 w-3.5" />
                <span>Usage</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="account" className="p-1 space-y-6">
              <div className="bg-primary/5 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-lg">
                      {userProfile.displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground text-lg">
                      {userProfile.displayName}
                    </h3>
                    <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                    <div className="flex gap-2 mt-1.5">
                      {userProfile.isAdmin && (
                        <span className="text-xs font-semibold px-2 py-0.5 bg-red-100 text-red-800 rounded-full flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          Admin
                        </span>
                      )}
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1
                        ${userProfile.plan === "premium" 
                          ? "bg-yellow-100 text-yellow-800" 
                          : "bg-blue-100 text-blue-800"}`}
                      >
                        {userProfile.plan === "premium" ? (
                          <>
                            <Star className="h-3 w-3 fill-yellow-500" />
                            Premium
                          </>
                        ) : (
                          <>Free Plan</>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">Account Details</h4>
                
                <div className="grid gap-2">
                  <div className="flex justify-between items-center py-2 border-b border-border/40">
                    <span className="text-sm text-muted-foreground">Member since</span>
                    <span className="text-sm font-medium">
                      {userProfile.createdAt 
                        ? formatDistanceToNow(userProfile.createdAt, { addSuffix: true }) 
                        : "Unknown"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-border/40">
                    <span className="text-sm text-muted-foreground">Account type</span>
                    <span className="text-sm font-medium flex items-center">
                      {userProfile.plan === "premium" ? (
                        <>
                          Premium
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 ml-1" />
                        </>
                      ) : "Free"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-border/40">
                    <span className="text-sm text-muted-foreground">Weekly questions limit</span>
                    <span className="text-sm font-medium">
                      {userProfile.plan === "premium" || userProfile.isAdmin ? "∞" : FREE_PLAN_WEEKLY_LIMIT}
                    </span>
                  </div>
                  
                  {userProfile.plan === "free" && !userProfile.isAdmin && (
                    <div className="flex justify-between items-center py-2 border-b border-border/40">
                      <span className="text-sm text-muted-foreground">Questions remaining this week</span>
                      <span className="text-sm font-medium">
                        {remainingQuestions === Infinity ? "∞" : remainingQuestions}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-muted-foreground">Preferences</h4>
                </div>
                
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications" className="text-sm">Email notifications</Label>
                      <p className="text-xs text-muted-foreground">Receive email updates about your account</p>
                    </div>
                    <Switch id="email-notifications" />
                  </div>

                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing-emails" className="text-sm">Marketing emails</Label>
                      <p className="text-xs text-muted-foreground">Receive emails about new features and offers</p>
                    </div>
                    <Switch id="marketing-emails" />
                  </div>
                </div>
              </div>
              
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </TabsContent>
            
            <TabsContent value="subscription" className="p-1 space-y-6">
              <div className="bg-primary/5 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-lg flex items-center">
                      {userProfile.plan === "premium" ? (
                        <>
                          Premium Plan
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 ml-1" />
                        </>
                      ) : "Free Plan"}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {userProfile.plan === "premium" 
                        ? "Unlimited access to all features" 
                        : `Limited to ${FREE_PLAN_WEEKLY_LIMIT} questions per week`}
                    </p>
                  </div>
                  {userProfile.plan === "premium" && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                      Active
                    </span>
                  )}
                </div>
              </div>
              
              {userProfile.plan === "free" ? (
                <Card>
                  <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
                    <CardTitle>Upgrade to Premium</CardTitle>
                    <CardDescription className="text-indigo-100">
                      Get unlimited access to all features
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <p className="text-3xl font-bold">
                        $5.99 <span className="text-sm font-normal text-muted-foreground">/ month</span>
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                          <span>Unlimited questions</span>
                        </div>
                        <div className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                          <span>Priority support</span>
                        </div>
                        <div className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                          <span>Enhanced features</span>
                        </div>
                        <div className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                          <span>No weekly limits</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                      onClick={handleUpgrade}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Upgrade Now
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-green-900">You're on Premium!</h3>
                      <p className="text-sm text-green-700">
                        Enjoy unlimited access to all features
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <h4 className="text-sm font-medium text-green-900 mb-2">Subscription details</h4>
                    <div className="grid gap-1">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-green-800">Billing period</span>
                        <span className="font-medium text-green-900">Monthly</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-green-800">Next billing date</span>
                        <span className="font-medium text-green-900">{formatSubscriptionEndDate()}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-green-800">Amount</span>
                        <span className="font-medium text-green-900">$5.99 USD</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs border-green-300 text-green-800 hover:bg-green-50"
                        onClick={handleManageSubscription}
                      >
                        Manage Subscription
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {userProfile.isAdmin && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                      <Shield className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-red-900">Admin Access</h3>
                      <p className="text-sm text-red-700">
                        You have administrator privileges with unlimited access
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="usage" className="p-1 space-y-6">
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-medium text-lg flex items-center">
                  Usage Statistics
                  <BarChart className="h-4 w-4 ml-2 text-muted-foreground" />
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Track your question usage and activity
                </p>
              </div>
              
              <div className="grid gap-4">
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="text-sm font-medium mb-4">Weekly Usage</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Questions used this week</span>
                        <span className="font-medium">{userProfile.questionsUsedThisWeek || 0}</span>
                      </div>
                      <div className="h-2 bg-muted rounded overflow-hidden">
                        <div 
                          className={`h-full ${userProfile.plan === "premium" ? "bg-yellow-500" : "bg-blue-600"}`}
                          style={{ 
                            width: `${userProfile.plan === "premium" 
                              ? Math.min(100, (userProfile.questionsUsedThisWeek || 0) * 5) 
                              : Math.min(100, ((userProfile.questionsUsedThisWeek || 0) / FREE_PLAN_WEEKLY_LIMIT) * 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    {userProfile.plan === "free" && !userProfile.isAdmin && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Weekly limit</span>
                          <span className="font-medium">{remainingQuestions} / {FREE_PLAN_WEEKLY_LIMIT} remaining</span>
                        </div>
                        <div className="h-2 bg-muted rounded overflow-hidden">
                          <div 
                            className="h-full bg-blue-600"
                            style={{ width: `${(remainingQuestions / FREE_PLAN_WEEKLY_LIMIT) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {userProfile.plan === "free" && !userProfile.isAdmin && remainingQuestions < 3 && (
                    <div className="mt-4 flex items-center gap-2 text-sm p-2 bg-amber-50 text-amber-800 rounded border border-amber-200">
                      <Bell className="h-4 w-4 text-amber-600" />
                      <span>
                        You have only <strong>{remainingQuestions}</strong> questions remaining this week. 
                        Consider <button 
                          className="text-blue-600 underline hover:text-blue-800 font-medium" 
                          onClick={() => {
                            const subscriptionTab = document.querySelector('[data-state="inactive"][value="subscription"]');
                            if (subscriptionTab instanceof HTMLElement) {
                              subscriptionTab.click();
                            }
                          }}
                        >
                          upgrading to Premium
                        </button>.
                      </span>
                    </div>
                  )}
                  
                  {userProfile.weekStartedAt && (
                    <p className="text-xs text-muted-foreground mt-4">
                      Week started {formatDistanceToNow(userProfile.weekStartedAt, { addSuffix: true })}
                    </p>
                  )}
                </div>
                
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="text-sm font-medium mb-3">All-time Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Total Questions</p>
                      <p className="text-2xl font-semibold">124</p>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Days Active</p>
                      <p className="text-2xl font-semibold">18</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      <CheckoutDialog 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handleCheckoutSuccess}
        onCheckout={handleCheckoutWithOptions}
      />
    </>
  );
};

// Constants
const FREE_PLAN_WEEKLY_LIMIT = 8;

export default UserSettingsDialog; 