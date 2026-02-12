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
import NotebookPage from "./pages/Learning/NotebookPage";
import Assessment from "./components/assesment/Assesment";

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
          <Route
            path="/learning-resources/:pathId/notebook/:topicId"
            element={<NotebookPage />}
          />
        </Route>
        <Route path="/assesment" element={<Assessment/>}/>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
