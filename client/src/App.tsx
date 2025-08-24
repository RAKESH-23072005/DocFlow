import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import LoadingScreen from "@/components/loading-screen";

const Home = lazy(() => import("@/pages/home"));
const Compress = lazy(() => import("@/pages/compress"));
const Download = lazy(() => import("@/pages/download"));
const HelpCenter = lazy(() => import("@/pages/help-center"));
const PrivacyPolicy = lazy(() => import("@/pages/privacy-policy"));
const TermsOfService = lazy(() => import("@/pages/terms-of-service"));
const Contact = lazy(() => import("@/pages/contact"));

function Router() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/compress" component={Compress} />
        <Route path="/download" component={Download} />
        <Route path="/help-center" component={HelpCenter} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms-of-service" component={TermsOfService} />
        <Route path="/contact" component={Contact} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
