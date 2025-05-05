
import React from "react";
import Header from "@/components/Header";

const Sparx = () => {
  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Header />
      <main className="flex-1 container py-8 px-4 flex flex-col">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            <span className="text-primary logo-text">SPARX</span> Homework Helper
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Coming soon! This section will help with your Sparx homework.
          </p>
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

export default Sparx;
