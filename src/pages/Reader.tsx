
import React, { useState } from "react";
import Header from "@/components/Header";
import SenecaHelper from "@/components/SenecaHelper";
import ResultsDisplay from "@/components/ResultsDisplay";
import { SenecaResults } from "@/utils/senecaScraper";

const Reader = () => {
  const [results, setResults] = useState<SenecaResults | null>(null);
  const [loading, setLoading] = useState(false);

  const handleResults = (data: SenecaResults) => {
    setResults(data);
    setLoading(false);
  };

  const handleLoading = (isLoading: boolean) => {
    setLoading(isLoading);
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary/20">
      <Header />
      <main className="flex-1 container py-8 px-4 flex flex-col">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            <span className="text-primary logo-text">SPARX</span> Reader
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Enter your Seneca URL below to get instant answers to your homework.
          </p>
        </div>

        <SenecaHelper onResultsReceived={handleResults} onLoadingChange={handleLoading} />
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ResultsDisplay results={results} />
        )}
      </main>
      
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} SPARX365. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Reader;
