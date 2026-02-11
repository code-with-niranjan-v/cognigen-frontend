// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Home from "./pages/Home/Home";           // ← sidebar + dashboard wrapper
import LandingPage from "./pages/Home/LandingPage";
import LearningResources from "./pages/Learning/LearningResources";     // ← new
import LearningPathDetail from "./pages/Learning/LearningPathDetail";  // ← new (we'll fill later)

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes – everything under /home or /learning-resources requires login */}
        <Route element={<ProtectedRoute />}>
          {/* Home & dashboard */}
          <Route path="/home" element={<Home />} />

          {/* Learning section – can be under /home or top-level */}
          <Route path="/learning-resources" element={<LearningResources />} />
          <Route path="/learning-resources/:pathId" element={<LearningPathDetail />} />

          {/* Optional future nested structure if you prefer */}
          {/* 
          <Route path="/home/learning" element={<LearningResources />} />
          <Route path="/home/learning/:pathId" element={<LearningPathDetail />} />
          */}
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;