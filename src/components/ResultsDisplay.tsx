
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
    <Card className="w-full max-w-2xl mx-auto mt-6">
      <CardHeader>
        <CardTitle className="text-xl">{results.title || "Homework Results"}</CardTitle>
      </CardHeader>
      <CardContent>
        {results.questions && results.questions.length > 0 ? (
          <div className="space-y-4">
            {results.questions.map((item: SenecaQuestion, index: number) => (
              <div key={index} className="border rounded-lg p-4 bg-secondary/50">
                <div className="flex flex-col space-y-2">
                  <div className="text-sm font-medium">Question {index + 1}:</div>
                  <div className="text-base">{item.question}</div>
                  <div className="mt-2 pt-2 border-t">
                    <div className="text-sm font-medium text-primary">Answer:</div>
                    <div className="text-base font-medium">{item.answer}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No questions found in the provided homework URL. Please try a different URL.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultsDisplay;
