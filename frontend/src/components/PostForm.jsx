import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function PostForm({ onPostCreated }) {
  const [content, setContent] = useState("");
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:9000/api/posts",
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContent("");
      onPostCreated(); // trigger re-fetch
    } catch (err) {
      console.error("Post creation failed:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded shadow-md p-4 mb-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full border rounded p-2 mb-2 resize-none"
        rows={3}
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
      >
        Post
      </button>
    </form>
  );
}
