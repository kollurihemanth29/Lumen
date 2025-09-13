import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AIAssistant from "./components/AIAssistant";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import CreateUserPage from "./pages/CreateUserPage";
import ManageUsersPage from "./pages/ManageUsersPage";
import UserDashboard from "./pages/UserDashboard";
import SubscriptionManagement from "./pages/SubscriptionManagement";
import UserSubscriptionPage from "./pages/MySubscription";

import PlansManagement from "./pages/PlansManagement";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import DiscountsManagement from "./pages/DiscountsManagement";
import UsageTracking from "./pages/UsageTracking";
import ManagerDashboard from "./pages/ManagerDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import OAuthSuccess from "./pages/OAuthSuccess";
import NotAuthorized from "./pages/NotAuthorized";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./components/AIAssistant.css";
import "./App.css";

// Bootstrap JS for dropdowns and other interactive components
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5>Loading Lumen Quest...</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate
                to={user.role === "admin" ? "/admin" : "/dashboard"}
                replace
              />
            ) : (
              <Login />
            )
          }
        />
        <Route path="/oauth/success" element={<OAuthSuccess />} />
        <Route path="/not-authorized" element={<NotAuthorized />} />

        {/* Profile Route - Available to all authenticated users */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Protected Role-Based Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/create-user"
          element={
            <ProtectedRoute requiredRole="admin">
              <CreateUserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-users"
          element={
            <ProtectedRoute requiredRole="admin">
              <ManageUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="end-user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscriptions"
          element={
            <ProtectedRoute requiredRole="end-user">
              <UserSubscriptionPage />
            </ProtectedRoute>
            // <UserSubscriptionPage />
          }
        />
        <Route
          path="/usage"
          element={
            <ProtectedRoute requiredRole="end-user">
              <UsageTracking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/plans"
          element={
            <ProtectedRoute requiredRole="admin">
              <PlansManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute requiredRole="admin">
              <AnalyticsDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/discounts"
          element={
            <ProtectedRoute requiredRole="admin">
              <DiscountsManagement />
            </ProtectedRoute>
          }
        />

        {/* Legacy routes for backward compatibility */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute requiredRole="manager">
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff"
          element={
            <ProtectedRoute requiredRole="staff">
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        {/* Landing Page Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Home redirect for authenticated users */}
        <Route
          path="/home"
          element={
            user ? (
              <Navigate
                to={user.role === "admin" ? "/admin" : "/dashboard"}
                replace
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Catch all route */}
        {/* <Route
          path="*"
          element={
            user ? (
              <Navigate
                to={user.role === "admin" ? "/admin" : "/dashboard"}
                replace
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        /> */}
      </Routes>

      {/* Global Floating AI Assistant - only show when user is logged in */}
      {user && <AIAssistant />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_relativeSplatPath: true }}>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
