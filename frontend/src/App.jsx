import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Auth from "./pages/Auth";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import React from "react";

function AppRoutes() {
  const { user } = useAuth();
  const location = useLocation();

  const isAuthPage = location.pathname === "/auth";

  return (  
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={user ? <Feed /> : <Navigate to="/auth" />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        {/* Use userId from URL or fallback to logged-in user's ID */}
        <Route path="/profile/:userId" element={<Profile />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};
