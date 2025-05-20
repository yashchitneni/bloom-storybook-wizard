
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { WizardProvider } from "@/contexts/WizardContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import WizardPage from "./pages/WizardPage";
import AccountPage from "./pages/AccountPage";
import StoryDetailPage from "./pages/StoryDetailPage";
import ExamplePage from "./pages/ExamplePage";
import SignupPage from "./pages/SignupPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <WizardProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/wizard" element={<WizardPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/story/:id" element={<StoryDetailPage />} />
              <Route path="/example" element={<ExamplePage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </WizardProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
