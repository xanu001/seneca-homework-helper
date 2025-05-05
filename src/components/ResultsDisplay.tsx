
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { SenecaResults, SenecaQuestion } from "@/utils/senecaScraper";
import { BookOpen, Info, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

interface ResultsDisplayProps {
  results: SenecaResults | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const [wordBankOpen, setWordBankOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  if (!results) return null;

  // Helper function to get wordbank items
  const getWordBankItems = () => {
    if (!results.questions) return [];
    
    // Extract unique terms from the questions
    const terms = new Set<string>();
    results.questions.forEach(item => {
      // Add the question itself as it might contain important terms
      if (item.question) terms.add(item.question);
      
      // Extract key terms from the answer
      if (item.answer) {
        // Simple heuristic: look for capitalized words that might be terms
        const matches = item.answer.match(/\b[A-Z][a-z]+(\s[A-Z][a-z]+)*\b/g);
        if (matches) {
          matches.forEach(match => terms.add(match));
        }
      }
    });
    
    return Array.from(terms).slice(0, 10); // Limit to 10 terms
  };

  // Request explanation for a term
  const requestExplanation = (term: string) => {
    // In a real implementation, this would call an AI API
    // For now, we'll just show a toast message
    toast.info(`Getting explanation for "${term}"...`, {
      description: "This feature requires authentication. Please sign in to use AI explanations."
    });
    setSelectedWord(term);
  };

  const wordBankItems = getWordBankItems();

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto mt-6">
      {/* Word Bank Section */}
      <Collapsible 
        open={wordBankOpen} 
        onOpenChange={setWordBankOpen}
        className="w-full rounded-lg border shadow-sm"
      >
        <div className="flex items-center justify-between p-4 bg-primary/10">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Word Bank</h3>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {wordBankOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              <span className="sr-only">Toggle Word Bank</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="p-4">
          {wordBankItems.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {wordBankItems.map((term, i) => (
                <HoverCard key={i}>
                  <HoverCardTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => requestExplanation(term)}
                    >
                      {term}
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="flex justify-between space-x-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">{term}</h4>
                        <p className="text-sm text-muted-foreground">
                          Sign in to see AI-powered explanations of this term.
                        </p>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No key terms identified for this homework.</p>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Results Card */}
      <Card className="w-full">
        <CardHeader className="bg-primary/10">
          <CardTitle className="text-2xl">{results.title || "Homework Results"}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {results.questions && results.questions.length > 0 ? (
            <div className="space-y-6">
              {results.questions.map((item: SenecaQuestion, index: number) => (
                <div key={index} className="border rounded-lg p-4 bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-primary text-white text-xs font-medium px-2.5 py-1 rounded-full">Q{index + 1}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div 
                              className="text-sm font-medium hover:text-primary cursor-pointer flex items-center gap-1"
                              onClick={() => requestExplanation(item.question)}
                            >
                              {item.question}
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Sign in to see AI explanations</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="mt-2 pt-2 border-t border-dashed">
                      <div className="text-xs font-medium text-primary mb-1">Answer:</div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div 
                              className="text-base whitespace-pre-line hover:text-primary cursor-pointer"
                              onClick={() => requestExplanation(item.answer)}
                            >
                              {item.answer}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Sign in for detailed explanations</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No questions found in the provided homework URL. Please try a different URL.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
