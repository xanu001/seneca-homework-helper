
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-200",
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <div className="flex items-center">
              <span className="bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm mr-2">
                <span className="logo-number">36S</span>
              </span>
              <span className="font-bold text-xl text-primary logo-text">SPARX365</span>
            </div>
          </Link>
        </div>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/">
                <NavigationMenuLink className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600">
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-sm font-medium text-gray-700 hover:text-indigo-600">Features</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-indigo-50 to-indigo-100 p-6 no-underline outline-none focus:shadow-md"
                        href="#"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium text-indigo-900">
                          AI Learning Assistant
                        </div>
                        <p className="text-sm leading-tight text-indigo-800">
                          Revolutionize your educational journey with our advanced AI learning tools
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        href="#"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-indigo-50 focus:bg-indigo-50"
                      >
                        <div className="text-sm font-medium leading-none text-indigo-800">
                          Smart Learning
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-600">
                          Get personalized learning paths based on your progress
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        href="#"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-indigo-50 focus:bg-indigo-50"
                      >
                        <div className="text-sm font-medium leading-none text-indigo-800">
                          Comprehensive Resources
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-600">
                          Access extensive study materials and practice exercises
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        href="#"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-indigo-50 focus:bg-indigo-50"
                      >
                        <div className="text-sm font-medium leading-none text-indigo-800">
                          Progress Tracking
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-600">
                          Monitor your learning with detailed analytics
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="#">
                <NavigationMenuLink className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600">
                  Pricing
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/seneca">
                <NavigationMenuLink className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600">
                  Seneca Helper
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-4">
          <Link to="/seneca">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              Sign In
            </Button>
          </Link>
          <Link to="/seneca">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 hidden md:flex">
              Get Started
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
