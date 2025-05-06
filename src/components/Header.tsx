import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { User, Star, LogIn, Settings, LogOut } from "lucide-react";
import UserSettingsDialog from "./UserSettingsDialog";
import LoginModal from "./LoginModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isUserSettingsOpen, setIsUserSettingsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, userProfile, isLoading, logout } = useAuth();

  const handleOpenSettings = () => {
    setIsUserSettingsOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

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
        
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link 
            to="/seneca" 
            className={cn("text-sm font-medium transition-colors hover:text-primary", 
              location.pathname === "/seneca" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Seneca
          </Link>
          <Link 
            to="/reader" 
            className={cn("text-sm font-medium transition-colors hover:text-primary", 
              location.pathname === "/reader" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Sparx Reader
          </Link>
          
          {/* User Profile Button with Dropdown */}
          {isLoading ? (
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin ml-2"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 flex items-center gap-2 rounded-full hover:bg-secondary relative"
                >
                  <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">
                      {userProfile?.displayName?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  {userProfile?.plan === "premium" && (
                    <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 absolute -top-0.5 -right-0.5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <span>{userProfile?.displayName || "User"}</span>
                  {userProfile?.plan === "premium" && (
                    <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleOpenSettings} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 flex items-center gap-2"
              onClick={() => setIsLoginModalOpen(true)}
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Sign In</span>
            </Button>
          )}
        </nav>
      </div>
      
      {/* User Settings Dialog */}
      <UserSettingsDialog 
        isOpen={isUserSettingsOpen}
        onClose={() => setIsUserSettingsOpen(false)}
      />
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </header>
  );
};

export default Header;
