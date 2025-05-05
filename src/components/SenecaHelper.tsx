
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface SenecaHelperProps {
  onResultsReceived: (results: any) => void;
}

const SenecaHelper: React.FC<SenecaHelperProps> = ({ onResultsReceived }) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error("Please enter a valid Seneca URL");
      return;
    }
    
    if (!url.includes("senecalearning.com")) {
      toast.error("Please enter a valid Seneca Learning URL");
      return;
    }
    
    setLoading(true);
    
    try {
      // This is a placeholder for the actual implementation
      // In a real implementation, we would make an API call to fetch the homework data
      setTimeout(() => {
        const mockResults = {
          title: "Seneca Homework",
          questions: [
            {
              question: "What is the capital of France?",
              answer: "Paris"
            },
            {
              question: "What is the chemical symbol for water?",
              answer: "H₂O"
            }
          ]
        };
        
        onResultsReceived(mockResults);
        toast.success("Homework loaded successfully!");
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error fetching homework:", error);
      toast.error("Failed to load homework. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Seneca Homework Helper</CardTitle>
        <CardDescription>
          Enter your Seneca homework URL to get answers instantly
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="url"
              placeholder="https://app.senecalearning.com/classroom/course/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
              disabled={loading}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Get Answers"}
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Paste your full Seneca URL to see all available answers for your homework
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SenecaHelper;
