import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    // Try to load user from localStorage or initial value
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  }); 
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:9000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data); // should contain _id, username, etc.
        localStorage.setItem("user", JSON.stringify(res.data)); // <-- Always save user to localStorage
      } catch (err) {
        console.error("Failed to fetch user profile", err);
        setUser(null);
        localStorage.removeItem("user");
      }
    };

    if (token) {
      localStorage.setItem("token", token);
      fetchUser();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user"); // <-- Remove user from localStorage on logout
      setUser(null);
    }
  }, [token]);


  const login = async (email, password) => {
    const res = await axios.post("http://localhost:9000/api/auth/login", { email, password });
    console.log("Login response:", res.data);
    setToken(res.data.token);
  };

  const register = async (username, email, password) => {
    await axios.post("http://localhost:9000/api/auth/register", { username, email, password });
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
