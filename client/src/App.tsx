import { Switch, Route } from "wouter";
import { Layout } from "@/components/Layout";
import Dashboard from "@/pages/dashboard";
import Activity from "@/pages/activity";
import NotFound from "@/pages/not-found";
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/activity" component={Activity} />
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </Layout>
    </QueryClientProvider>
  );
}

export default App;
