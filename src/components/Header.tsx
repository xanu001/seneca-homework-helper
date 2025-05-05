
import React from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <span className="bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm">
              <span className="logo-number">36S</span>
            </span>
          </div>
          <Link to="/" className="flex items-center space-x-2">
            <span className="logo-text text-xl text-primary">SPARX365</span>
          </Link>
        </div>
        
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link to="/" className={cn("text-sm font-medium transition-colors hover:text-primary", 
            location.pathname === "/" ? "text-primary" : "text-muted-foreground"
          )}>
            Seneca
          </Link>
          <Link to="/sparx" className={cn("text-sm font-medium transition-colors hover:text-primary", 
            location.pathname === "/sparx" ? "text-primary" : "text-muted-foreground"
          )}>
            Sparx
          </Link>
          <Link to="/reader" className={cn("text-sm font-medium transition-colors hover:text-primary", 
            location.pathname === "/reader" ? "text-primary" : "text-muted-foreground"
          )}>
            Sparx Reader
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
