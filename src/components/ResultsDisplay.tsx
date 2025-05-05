
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SenecaResults, SenecaQuestion } from "@/utils/senecaScraper";

interface ResultsDisplayProps {
  results: SenecaResults | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  if (!results) return null;

  return (
    <Card className="w-full max-w-3xl mx-auto mt-6">
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
                    <div className="text-sm font-medium">{item.question}</div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-dashed">
                    <div className="text-xs font-medium text-primary mb-1">Answer:</div>
                    <div className="text-base whitespace-pre-line">{item.answer}</div>
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
  );
};

export default ResultsDisplay;
