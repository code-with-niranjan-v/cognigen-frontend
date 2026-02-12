// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Home from "./pages/Home/Home";
import LandingPage from "./pages/Landing/LandingPage";
import LearningResources from "./pages/Learning/LearningResources";
import LearningPathDetail from "./pages/Learning/LearningPathDetail";
import Assessment from "./components/assesment/Assesment";
import MockInterviewLanguageSelection from "./components/mockInterview/MockInterviewLanguageSelection";
import MockInterviewSession from "./components/mockInterview/MockInterviewSession"
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
          <Route
            path="/learning-resources/:pathId"
            element={<LearningPathDetail />}
          />
          <Route path="/mock-interview" element={<MockInterviewLanguageSelection />} />
          <Route path="/mock-interview/session" element={<MockInterviewSession />}/>

        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
