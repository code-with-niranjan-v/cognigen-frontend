// src/components/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
        <p className="ml-4 text-lg font-medium text-indigo-700">
          Checking session...
        </p>
      </div>
    );
  }

  // ─── Key fix ───────────────────────────────────────────────
  // Never redirect if current path is login/signup
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  if (!user && !isAuthPage) {
    // Redirect to login, but remember where they came from
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If user exists OR we are on auth page → show content
  return <Outlet />;
}
