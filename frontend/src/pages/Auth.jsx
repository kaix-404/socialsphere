import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { login, register, token, user } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (token && user) navigate("/");
  }, [token, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(username, email, password);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-950 flex items-center justify-center px-4 py-8 overflow-hidden">
      {/* Background Text */}
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-center text-gray-300 px-4 w-full max-w-lg">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight tracking-wide drop-shadow-md">
          {isLogin ? "Welcome back to SocialSphere!" : "Welcome to SocialSphere!"}
        </h1>
        <p className="text-sm sm:text-base md:text-lg mt-2 text-gray-400">
          {isLogin ? "Please sign in to continue" : "Create a new account to get started"}
        </p>
      </div>

      {/* Background Art */}
      <div className="absolute inset-0 z-0">
        <svg
          className="w-full h-full opacity-40 blur-[80px]"
          viewBox="0 0 800 800"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="grad" cx="50%" cy="50%" r="50%">
              <stop offset="40%" stopColor="#f97316" /> {/* orange-500 */}
              <stop offset="100%" stopColor="#9333ea" /> {/* purple-600 */}
            </radialGradient>
          </defs>
          <circle cx="400" cy="400" r="400" fill="url(#grad)" />
        </svg>
      </div>

      {/* Auth Container */}
      <div className="relative z-10 w-full max-w-4xl bg-gray-900 rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Form Side */}
        <div className="w-full md:w-1/2 p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
            {isLogin ? "Login" : "Register"}
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {isLogin ? "Login" : "Register"}
            </button>
          </form>
        </div>

        {/* Toggle Side */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-indigo-800 text-white">
          <h3 className="text-xl sm:text-2xl font-semibold mb-4">
            {isLogin ? "New here?" : "Already have an account?"}
          </h3>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="px-6 py-2 border border-white hover:bg-white hover:text-black rounded transition duration-300"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
