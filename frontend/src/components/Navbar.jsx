import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React, { useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";

export default function Navbar() {
  const { user, logout, token } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const handleSearch = async (e) => {
    if (!query.trim()) return;
    try {
      const res = await axios.get(`http://localhost:9000/api/users/search?q=${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="w-full bg-gradient-to-r from-gray-500 to-gray-900 px-6 py-4 shadow-lg flex items-center justify-between">
      <div className="text-2xl font-bold text-white">SocialSphere</div>
      <div className="flex items-center space-x-4">
        {user && (
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}  
                onKeyUp={handleSearch} 
                className="pl-10 pr-4 py-1.5 rounded bg-gray-600 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
              {results.length > 0 && (
                <div className="absolute top-12 left-0 w-full bg-gray-900 text-white border border-gray-700 rounded shadow-lg z-10 max-h-64 overflow-y-auto">
                  {results.map((u) => (
                    <div
                      key={u._id}
                      onClick={() => {
                        navigate(`/profile/${u._id}`);
                        setQuery("");
                        setResults([]);
                      }}
                      className="px-3 py-2 hover:bg-gray-700 cursor-pointer"
                    >
                      @{u.username}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        <Link to="/">
          <button className="relative text-white text-lg px-4 py-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[3px] after:w-0 after:bg-blue-500 after:rounded-full after:transition-all hover:after:w-full">
            Home
          </button>
        </Link>
        <Link to={"/profile/"}>
          <button className="relative text-white text-lg px-4 py-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[3px] after:w-0 after:bg-blue-500 after:rounded-full after:transition-all hover:after:w-full">
            Profile
          </button>
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
