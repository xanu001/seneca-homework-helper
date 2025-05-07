
import React, { useState } from "react";
import Header from "@/components/Header";
import SenecaHelper from "@/components/SenecaHelper";
import ResultsDisplay from "@/components/ResultsDisplay";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="space-y-6 w-full">
            <SenecaHelper onResultsReceived={setResults} />
          </div>
          
          <div className="flex flex-col justify-center items-center">
            <Card className="w-full overflow-hidden shadow-lg animate-fade-in">
              <AspectRatio ratio={16/9} className="bg-muted">
                <img 
                  src="/lovable-uploads/b0f8d749-db3d-4f57-9cc3-e42079d7c4b9.png" 
                  alt="Seneca result example" 
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
            </Card>
          </div>
        </div>

        <div className="w-full">
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
