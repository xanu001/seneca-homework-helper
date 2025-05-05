
import React, { useState } from "react";
import Header from "@/components/Header";
import SenecaHelper from "@/components/SenecaHelper";
import ResultsDisplay from "@/components/ResultsDisplay";

const Index = () => {
  const [results, setResults] = useState<any | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Header />
      <main className="flex-1 container py-8 px-4 flex flex-col">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Welcome to <span className="text-primary logo-text">SPARX365</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Get instant answers to your homework questions. Start with Seneca below.
          </p>
        </div>

        <div className="space-y-6 max-w-3xl mx-auto w-full">
          <SenecaHelper onResultsReceived={setResults} />
          <ResultsDisplay results={results} />
        </div>
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

export default Index;
