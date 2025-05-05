import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, MoreHorizontal, BookOpen, Wand2, Home, Book, Calculator } from "lucide-react";
import { askGemini } from "@/utils/gemini";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";

const Reader = () => {
  const [passage, setPassage] = useState("");
  const [question1, setQuestion1] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answer1, setAnswer1] = useState("");
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!passage || !question1) return;
    
    setIsSubmitting(true);
    setError("");
    setAnswer1("");

    try {
      const response = await askGemini(passage, question1);
      
      if (response.error) {
        setError(response.error);
      } else {
        setAnswer1(response.answer);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze');
    } finally {
      setIsSubmitting(false);
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
                            Google Chrome browser
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                            Active Sparx homework
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                            Bookmarks bar enabled
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
            <Card className="bg-white shadow-xl border-0 rounded-xl overflow-hidden">
              <CardContent className="p-8 space-y-6">
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
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-end">
                  <Button
                    onClick={handleAnalyze}
                    disabled={!passage || !question1 || isSubmitting}
                    className={`px-8 py-6 text-base font-medium rounded-lg transition-all duration-200 ease-in-out ${
                      isSubmitting 
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
          </TabsContent>
        </Tabs>

        <p className="text-center text-sm text-gray-500 mt-8">
          &copy; {new Date().getFullYear()} SPARX365. All rights reserved.
        </p>
      </main>
    </div>
  );
};

export default Reader;
