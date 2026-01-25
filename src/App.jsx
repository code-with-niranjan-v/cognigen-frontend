import React from "react";
import Home from "./pages/Home/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Home/LandingPage";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/lp" element={<LandingPage/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
