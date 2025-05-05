
import React, { useState } from "react";
import Header from "@/components/Header";
import SenecaHelper from "@/components/SenecaHelper";
import ResultsDisplay from "@/components/ResultsDisplay";
import { SenecaResults } from "@/utils/senecaScraper";

const Reader = () => {
  const [results, setResults] = useState<SenecaResults | null>(null);

  const handleResults = (data: SenecaResults) => {
    setResults(data);
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
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

        <SenecaHelper onResultsReceived={handleResults} />
        <ResultsDisplay results={results} />
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
