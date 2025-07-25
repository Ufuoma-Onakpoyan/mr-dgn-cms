import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import BlogList from "./pages/BlogList";
import BlogEdit from "./pages/BlogEdit";
import PortfolioList from "./pages/PortfolioList";
import PortfolioEdit from "./pages/PortfolioEdit";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/blog" element={
              <ProtectedRoute>
                <Layout>
                  <BlogList />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/blog/new" element={
              <ProtectedRoute>
                <Layout>
                  <BlogEdit />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/blog/edit/:id" element={
              <ProtectedRoute>
                <Layout>
                  <BlogEdit />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/portfolio" element={
              <ProtectedRoute>
                <Layout>
                  <PortfolioList />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/portfolio/new" element={
              <ProtectedRoute>
                <Layout>
                  <PortfolioEdit />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/portfolio/edit/:id" element={
              <ProtectedRoute>
                <Layout>
                  <PortfolioEdit />
                </Layout>
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
