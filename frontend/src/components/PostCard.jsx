import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CommentBox from "./CommentBox";
import axios from "axios";

export default function PostCard({ post, className='' }) {
  const { user, token } = useAuth();
  const [likes, setLikes] = useState(post.likes || []);
  const hasLiked = likes.includes(user?.id);

  const handleLike = async () => {
    try {
      const url = `http://localhost:9000/api/posts/${post._id}/${hasLiked ? "unlike" : "like"}`;
      await axios.post(url, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLikes((prev) =>
        hasLiked ? prev.filter((id) => id !== user.id) : [...prev, user.id]
      );
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  return (
    <div className={`bg-[#1c1f2a] p-6 rounded-xl shadow-md border border-gray-700 p-4 md:p-6 max-w-xl mx-auto w-full ${className}`}>
      <div className="flex items-center mb-3">
        <img
          src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${post.userId.username}`}
          alt="avatar"
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <p className="font-semibold text-sm">@{post.userId.username}</p>
          <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString("en-GB")}</p>
        </div>
      </div>

      <p className="text-gray-200 text-sm mb-3 whitespace-pre-line">{post.content}</p>

      {post.imageUrl && (
        <img
          src={`http://localhost:9000${post.imageUrl}`}
          alt="post"
          className="w-full rounded-lg object-cover max-h-80 mb-2"
        />
      )}

      {/* Like Button */}
      <div className="flex items-center justify-start text-sm mb-3">
        <button
          onClick={handleLike}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
            hasLiked
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-700 text-gray-200 hover:bg-gray-600"
          }`}
        >
          {hasLiked ? "Liked" : "Like"} ({likes.length})
        </button>
      </div>

      <CommentBox postId={post._id} />
    </div>
  );
}
