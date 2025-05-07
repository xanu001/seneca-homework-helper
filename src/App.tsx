
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import NotFound from "./pages/NotFound";
import Reader from "./pages/Reader";
import Seneca from "./pages/seneca";
import Landing from "./pages/Landing";
import Success from "./pages/Success";
import Canceled from "./pages/Canceled";
import { AuthProvider } from "./contexts/AuthContext";
import StripeProvider from "./components/StripeProvider";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="sparx365-theme">
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StripeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/reader" element={<Reader />} />
                <Route path="/seneca" element={<Seneca />} />
                <Route path="/success" element={<Success />} />
                <Route path="/canceled" element={<Canceled />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </StripeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
