
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { extractSenecaContent, SenecaResults } from "@/utils/senecaScraper";

interface SenecaHelperProps {
  onResultsReceived: (results: SenecaResults) => void;
}

const SenecaHelper: React.FC<SenecaHelperProps> = ({ onResultsReceived }) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }
    
    if (!url.includes("senecalearning.com")) {
      toast.error("Please enter a valid Seneca Learning URL");
      return;
    }
    
    // Check if the URL contains both course and section IDs
    if (!url.includes("course/") || !url.includes("section/")) {
      toast.error("Invalid URL format. Please make sure it includes course and section IDs");
      return;
    }
    
    setLoading(true);
    
    try {
      const results = await extractSenecaContent(url);
      onResultsReceived(results);
      toast.success("Homework loaded successfully!");
    } catch (error) {
      console.error("Error fetching homework:", error);
      toast.error(error instanceof Error ? error.message : "Failed to load homework. Please try again.");
    } finally {
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
              placeholder="https://app.senecalearning.com/classroom/course/[courseId]/section/[sectionId]/..."
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
            Paste your full Seneca URL to see all available answers for your homework.
            <br />
            Example format: https://app.senecalearning.com/classroom/course/419cd464-5c51-4d08-b49c-d5325d6121c8/section/9b5fa6b6-c98b-44e4-a889-cf3c36ba8f10/session
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SenecaHelper;
