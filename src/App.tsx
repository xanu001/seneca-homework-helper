
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AnimatePresence } from "framer-motion";
import NotFound from "./pages/NotFound";
import Reader from "./pages/Reader";
import Seneca from "./pages/seneca";
import Landing from "./pages/Landing";
import Success from "./pages/Success";
import Canceled from "./pages/Canceled";
import { AuthProvider } from "./contexts/AuthContext";
import StripeProvider from "./components/StripeProvider";
import PageTransition from "./components/PageTransition";

const queryClient = new QueryClient();

// AnimatedRoutes component to handle route transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/reader" element={<PageTransition><Reader /></PageTransition>} />
        <Route path="/seneca" element={<PageTransition><Seneca /></PageTransition>} />
        <Route path="/success" element={<PageTransition><Success /></PageTransition>} />
        <Route path="/canceled" element={<PageTransition><Canceled /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="sparx365-theme">
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StripeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AnimatedRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </StripeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
