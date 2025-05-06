import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, MoreHorizontal, BookOpen, Wand2, Home, Book, Calculator, ClipboardPaste, Star, User, AlertTriangle } from "lucide-react";
import { askGemini } from "@/utils/gemini";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import LoginModal from "@/components/LoginModal";
import UserSettingsDialog from "@/components/UserSettingsDialog";
import { recordQuestionUsage } from "@/lib/firebase";

const Reader = () => {
  const [passage, setPassage] = useState("");
  const [question1, setQuestion1] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answer1, setAnswer1] = useState("");
  const [error, setError] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserSettingsOpen, setIsUserSettingsOpen] = useState(false);
  
  const { user, userProfile, isLoading, remainingQuestions, refreshUserProfile } = useAuth();

  // Check if user is logged in and has access
  const canAskQuestion = !!user && 
    (userProfile?.isAdmin || userProfile?.plan === "premium" || remainingQuestions > 0);

  const handleAnalyze = async () => {
    if (!passage || !question1) return;
    
    // Check authentication
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    
    // Check usage limits
    if (!canAskQuestion) {
      setError("You've reached your weekly question limit. Please upgrade to premium for unlimited access.");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    setAnswer1("");

    try {
      // Record question usage
      if (user) {
        const allowed = await recordQuestionUsage(user.uid);
        
        if (!allowed) {
          setError("You've reached your weekly question limit. Please upgrade to premium for unlimited access.");
          setIsSubmitting(false);
          return;
        }
      }
      
      const response = await askGemini(passage, question1);
      
      if (response.error) {
        setError(response.error);
      } else {
        setAnswer1(response.answer);
      }
      
      // Refresh user profile to update remaining questions count
      refreshUserProfile();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setQuestion1("");
    setAnswer1("");
    setError("");
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setQuestion1(text);
    } catch (err) {
      toast.error("Failed to paste from clipboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Header />
      <main className="flex-1 container py-8 px-4 flex flex-col">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Sparx Homework Helper</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get instant answers to your Sparx homework questions with our AI-powered assistant
          </p>
          
          {/* User account section */}
          <div className="flex justify-center mt-4">
            {isLoading ? (
              <div className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : user ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => setIsUserSettingsOpen(true)}
                >
                  <span className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-700">
                      {userProfile?.displayName?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </span>
                  <span>{userProfile?.displayName || "User"}</span>
                  {userProfile?.plan === "premium" && (
                    <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                  )}
                </Button>
                
                {!userProfile?.isAdmin && userProfile?.plan !== "premium" && (
                  <div className="text-xs text-gray-500 bg-gray-100 py-1 px-2 rounded-full flex items-center">
                    <span>{remainingQuestions} questions left</span>
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setIsLoginModalOpen(true)}
              >
                <User className="h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="instructions" className="w-full mt-8">
          <TabsList className="w-full flex space-x-4 mb-8 bg-transparent border-b">
            <TabsTrigger 
              value="instructions" 
              className="flex-1 py-4 text-base data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none transition-all duration-200 ease-in-out flex items-center justify-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Setup Guide
            </TabsTrigger>
            <TabsTrigger 
              value="helper" 
              className="flex-1 py-4 text-base data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none transition-all duration-200 ease-in-out flex items-center justify-center gap-2"
            >
              <Wand2 className="h-4 w-4" />
              Helper
            </TabsTrigger>
          </TabsList>

          <TabsContent value="instructions" className="focus-visible:outline-none">
            <Card className="bg-white shadow-xl border-0 rounded-xl overflow-hidden">
              <CardContent className="p-8">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Complete Setup Guide</h2>
                    <div className="grid gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-50/30 p-6 rounded-xl border border-blue-100">
                        <h4 className="font-medium text-blue-700 text-lg mb-4">What You Need</h4>
                        <ul className="mt-2 space-y-3 text-blue-600">
                          <li className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                            Google Chrome
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                            Active Sparx homework
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                            Bookmarks bar enabled
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                            An account (free or premium)
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <span className="flex-none w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full text-base font-medium shadow-md">1</span>
                          <div>
                            <h3 className="text-lg font-medium text-gray-800">Enable Bookmarks Bar</h3>
                            <div className="mt-3 bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
                              <p className="text-sm text-gray-600 flex items-center gap-2">
                                <span className="font-medium">a.</span> Click the three dots <MoreHorizontal className="h-4 w-4 inline" /> in Chrome
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">b.</span> Go to Bookmarks → Show bookmarks bar
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <span className="flex-none w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full text-base font-medium shadow-md">2</span>
                          <div>
                            <h3 className="text-lg font-medium text-gray-800">Add Helper Bookmark</h3>
                            <p className="text-gray-600 mt-2 mb-4">Drag this button to your bookmarks bar:</p>
                            <a 
                              href="javascript:(function(){function%20allowTextSelection(){window.console&&console.log('allowTextSelection');var%20style=document.createElement('style');style.type='text/css';style.innerHTML='*,p,div{user-select:text%20!important;-moz-user-select:text%20!important;-webkit-user-select:text%20!important;}';document.head.appendChild(style);var%20elArray=document.body.getElementsByTagName('*');for(var%20i=0;i<elArray.length;i++){var%20el=elArray[i];el.onselectstart=el.ondragstart=el.ondrag=el.oncontextmenu=el.onmousedown=el.onmouseup=function(){return%20true};if(el%20instanceof%20HTMLInputElement&&['text','password','email','number','tel','url'].indexOf(el.type.toLowerCase())>-1){el.removeAttribute('disabled');el.onkeydown=el.onkeyup=function(){return%20true};}}}allowTextSelection();})();"
                              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 ease-in-out w-fit cursor-move shadow-md hover:shadow-xl active:scale-95"
                              draggable="true"
                            >
                              📚 Allow Text Selection
                            </a>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <span className="flex-none w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full text-base font-medium shadow-md">3</span>
                          <div>
                            <h3 className="text-lg font-medium text-gray-800">Open Your Homework</h3>
                            <p className="text-gray-600 mt-2">Go to your Sparx homework and find the passage you want to analyze</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <span className="flex-none w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full text-base font-medium shadow-md">4</span>
                          <div>
                            <h3 className="text-lg font-medium text-gray-800">Enable Text Selection</h3>
                            <p className="text-gray-600 mt-2">Click the "Allow Text Selection" bookmark we just created</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <span className="flex-none w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full text-base font-medium shadow-md">5</span>
                          <div>
                            <h3 className="text-lg font-medium text-gray-800">Use the Helper</h3>
                            <p className="text-gray-600 mt-2">Copy your passage, switch to the Helper tab, and get your answers!</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 p-6 rounded-r-xl">
                    <h4 className="text-lg font-medium text-yellow-800">Important Note</h4>
                    <p className="text-yellow-700 mt-2">
                      This helper is a study aid. Always complete your homework properly and show all working in your book.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="helper" className="focus-visible:outline-none">
            {!user ? (
              <Card className="bg-white shadow-xl border-0 rounded-xl overflow-hidden">
                <CardContent className="p-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                      <User className="h-8 w-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Sign In Required</h2>
                    <p className="text-gray-600 max-w-md mb-8">
                      Please sign in to use the Sparx Helper. Free accounts can ask up to 8 questions per week, or upgrade to premium for unlimited access.
                    </p>
                    <Button 
                      onClick={() => setIsLoginModalOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700 px-8 py-6 text-lg"
                    >
                      Sign In to Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white shadow-xl border-0 rounded-xl overflow-hidden">
                <CardContent className="p-8 space-y-6">
                  {/* Premium banner for free users */}
                  {userProfile?.plan !== "premium" && !userProfile?.isAdmin && (
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <Star className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-indigo-900 mb-1">Upgrade to Premium</h3>
                          <p className="text-sm text-indigo-700">
                            {remainingQuestions > 0 
                              ? `You have ${remainingQuestions} questions remaining this week` 
                              : "You've reached your weekly question limit"}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="secondary"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        onClick={() => setIsUserSettingsOpen(true)}
                      >
                        Upgrade
                      </Button>
                    </div>
                  )}
                  
                  {/* Main form */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Passage Text
                    </label>
                    <Textarea
                      placeholder="Paste your passage text here..."
                      className="min-h-[200px] text-base p-4 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                      value={passage}
                      onChange={(e) => setPassage(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question
                    </label>
                    <Textarea
                      placeholder="Enter your question here..."
                      className="min-h-[100px] text-base p-4 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                      value={question1}
                      onChange={(e) => setQuestion1(e.target.value)}
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive" className="text-base animate-in fade-in slide-in-from-top-1">
                      <AlertDescription className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        <span>{error}</span>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Usage limit warning for free users */}
                  {userProfile?.plan !== "premium" && !userProfile?.isAdmin && remainingQuestions <= 3 && remainingQuestions > 0 && (
                    <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800 animate-in fade-in">
                      <AlertDescription className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        <span>You have only {remainingQuestions} questions remaining this week. Consider upgrading to premium for unlimited access.</span>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-end gap-3">
                    <Button
                      onClick={handlePaste}
                      variant="outline"
                      className="px-4 py-6 text-base font-medium rounded-lg transition-all duration-200 ease-in-out hover:bg-gray-50 border-gray-200"
                      title="Paste from clipboard"
                    >
                      <ClipboardPaste className="h-5 w-5 text-gray-600" />
                    </Button>
                    <Button
                      onClick={handleClear}
                      variant="secondary"
                      disabled={isSubmitting || (!question1 && !answer1)}
                      className="px-8 py-6 text-base font-medium rounded-lg transition-all duration-200 ease-in-out hover:shadow-lg active:scale-95"
                    >
                      Clear
                    </Button>
                    <Button
                      onClick={handleAnalyze}
                      disabled={!passage || !question1 || isSubmitting || !canAskQuestion}
                      className={`px-8 py-6 text-base font-medium rounded-lg transition-all duration-200 ease-in-out ${
                        isSubmitting || !canAskQuestion
                          ? 'bg-blue-400 cursor-not-allowed' 
                          : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-95'
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Analyzing...
                        </div>
                      ) : (
                        "Get Answer"
                      )}
                    </Button>
                  </div>

                  {answer1 && (
                    <div className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-lg p-6 animate-in fade-in slide-in-from-bottom-2">
                      <h4 className="text-base font-semibold text-green-800 mb-3">Answer:</h4>
                      <p className="text-green-700 text-lg leading-relaxed">{answer1}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <p className="text-center text-sm text-gray-500 mt-8">
          &copy; {new Date().getFullYear()} SPARX365. All rights reserved.
        </p>
      </main>
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
      
      {/* User Settings Dialog */}
      <UserSettingsDialog 
        isOpen={isUserSettingsOpen}
        onClose={() => setIsUserSettingsOpen(false)}
      />
    </div>
  );
};

export default Reader;
