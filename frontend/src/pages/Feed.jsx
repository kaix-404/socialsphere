import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";

export default function Feed() {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get("http://localhost:9000/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    };
    fetchPosts();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#0c0e16] text-white bg-[radial-gradient(circle_at_center,_#42275a_0%,_transparent_60%)]">
      <br></br>
      <h2 className="text-3xl font-bold text-gray-400 mb-6 text-center">- Feed -</h2>
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}
