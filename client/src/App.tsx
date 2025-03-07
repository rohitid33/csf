import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { AdminAuthProvider } from "@/hooks/use-admin-auth";
import { ThemeProvider } from "@/hooks/use-theme";
import { TicketsProvider } from "@/hooks/use-tickets";
import { NotificationProvider } from "@/hooks/use-notifications";
import { ProtectedRoute } from "@/lib/protected-route";
import AdminProtectedRoute from "@/lib/admin-protected-route";
import Navbar from "@/components/layout/navbar";
import BottomNav from "@/components/layout/bottom-nav";
import Home from "@/pages/home";
import Complaint from "@/pages/complaint";
import Resources from "@/pages/resources";
import NotFound from "@/pages/not-found";
import { Link, useLocation } from "wouter";
import AuthPage from "@/pages/auth";
import AdminLogin from "@/pages/admin-dashboard/admin-login";
import AdminTopNav from "@/pages/admin-dashboard/components/AdminTopNav";
import React, { useState, Suspense, lazy } from "react";
import Footer from "@/components/layout/footer";

function Router() {
  const [location] = useLocation();
  const isAdminDashboard = location.startsWith('/admin-dashboard');
  
  return (
    <div className="flex min-h-screen flex-col pb-16">
      <Suspense fallback={<div>Loading...</div>}>
        {/* Show appropriate navigation based on route */}
        {isAdminDashboard ? <AdminTopNav /> : <Navbar />}
        <main className="flex-1">
          <Switch>
            <Route path="/" component={Home} />
            <ProtectedRoute path="/complaint" component={Complaint} />
            <Route path="/resources" component={Resources} />
            <Route path="/auth" component={AuthPage} />
            <Route path="/services" component={React.lazy(() => import("@/pages/services"))} />
            <Route path="/consult" component={React.lazy(() => import("@/pages/consult"))} />
            <Route path="/tickets" component={React.lazy(() => import("@/pages/tickets"))} />
            <Route path="/ticket/:id" component={React.lazy(() => import("@/pages/ticket/[id]"))} />
            <Route path="/document-vault" component={React.lazy(() => import("@/pages/document-vault"))} />
            <Route path="/gogo" component={React.lazy(() => import("@/pages/gogo"))} />
            <Route path="/about-us" component={React.lazy(() => import("@/pages/more/about-us"))} />
            <Route path="/events" component={React.lazy(() => import("@/pages/more/events"))} />
            <Route path="/products" component={React.lazy(() => import("@/pages/more/products"))} />
            <Route path="/news" component={React.lazy(() => import("@/pages/more/news"))} />
            <Route path="/blog" component={React.lazy(() => import("@/pages/more/blog"))} />
            <Route path="/media" component={React.lazy(() => import("@/pages/more/media"))} />
            <Route path="/careers" component={React.lazy(() => import("@/pages/more/careers"))} />
            <Route path="/refer" component={React.lazy(() => import("@/pages/more/refer"))} />
            <Route path="/partner" component={React.lazy(() => import("@/pages/more/partner"))} />
            <Route path="/talk-to-expert" component={React.lazy(() => import("@/pages/more/talk-to-expert"))} />
            <Route path="/search" component={React.lazy(() => import("@/pages/search"))} />
            <Route path="/services-directory" component={React.lazy(() => import("@/pages/services-directory"))} />
            
            {/* Admin Login Route - Accessible without authentication */}
            <Route path="/admin-dashboard/admin-login" component={AdminLogin} />
            
            {/* Protected Admin Dashboard Routes */}
            <Route path="/admin-dashboard">
              {() => (
                <AdminProtectedRoute>
                  <React.Suspense fallback={<div>Loading...</div>}>
                    {React.createElement(React.lazy(() => import("@/pages/admin-dashboard")))}
                  </React.Suspense>
                </AdminProtectedRoute>
              )}
            </Route>
            <Route path="/admin-dashboard/tickets">
              {() => (
                <AdminProtectedRoute>
                  <React.Suspense fallback={<div>Loading...</div>}>
                    {React.createElement(React.lazy(() => import("@/pages/admin-dashboard/tickets")))}
                  </React.Suspense>
                </AdminProtectedRoute>
              )}
            </Route>
            <Route path="/admin-dashboard/tickets/:id">
              {() => (
                <AdminProtectedRoute>
                  <React.Suspense fallback={<div>Loading...</div>}>
                    {React.createElement(React.lazy(() => import("@/pages/admin-dashboard/tickets/[id]")))}
                  </React.Suspense>
                </AdminProtectedRoute>
              )}
            </Route>
            <Route path="/admin-dashboard/users">
              {() => (
                <AdminProtectedRoute>
                  <React.Suspense fallback={<div>Loading...</div>}>
                    {React.createElement(React.lazy(() => import("@/pages/admin-dashboard/users")))}
                  </React.Suspense>
                </AdminProtectedRoute>
              )}
            </Route>
            
            {/* Dynamic service route - this replaces all individual service pages */}
            <Route path="/service/:id" component={React.lazy(() => import("./pages/service/[id]"))} />
            
            {/* Redirects for legacy routes */}
            <Route path="/health-claim">
              {() => {
                window.location.replace("/service/health-claim");
                return null;
              }}
            </Route>
            <Route path="/motor-claim">
              {() => {
                window.location.replace("/service/motor-claim");
                return null;
              }}
            </Route>
            <Route path="/fire-claim">
              {() => {
                window.location.replace("/service/fire-claim");
                return null;
              }}
            </Route>
            <Route path="/life-claim">
              {() => {
                window.location.replace("/service/life-claim");
                return null;
              }}
            </Route>
            <Route path="/travel-claim">
              {() => {
                window.location.replace("/service/travel-claim");
                return null;
              }}
            </Route>
            <Route path="/property-claim">
              {() => {
                window.location.replace("/service/property-claim");
                return null;
              }}
            </Route>
            <Route path="/marine-claim">
              {() => {
                window.location.replace("/service/marine-claim");
                return null;
              }}
            </Route>
            <Route component={NotFound} />
          </Switch>
        </main>
        {!isAdminDashboard && <Footer />}
        {!isAdminDashboard && <BottomNav />}
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AdminAuthProvider>
          <AuthProvider>
            <TicketsProvider>
              <NotificationProvider>
                <Router />
                <Toaster />
              </NotificationProvider>
            </TicketsProvider>
          </AuthProvider>
        </AdminAuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;