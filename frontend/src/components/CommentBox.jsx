import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function CommentBox({ postId }) {
  const { token, user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const fetchComments = async () => {
    const res = await axios.get(`http://localhost:9000/api/posts/${postId}/comments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setComments(res.data);
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await axios.post(
      `http://localhost:9000/api/posts/${postId}/comments`,
      { text },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setText("");
    fetchComments(); // or push new comment locally
  };

  const handleDelete = async (commentId) => {
    await axios.delete(
      `http://localhost:9000/api/posts/${postId}/comments/${commentId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setComments(prev => prev.filter(c => c._id !== commentId));
  };

  return (
    <div className="mt-6 space-y-4">
      {/* Comment Input */}
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Post
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-2">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="flex justify-between items-start bg-[#2a2e3f] px-4 py-3 rounded shadow-sm"
          >
            <div className="text-sm text-gray-200">
              <span className="font-semibold">@{comment.userId?.username || "Unknown User"}</span>: {comment.content}
            </div>
            {comment.userId?._id === user._id && (
              <button
                onClick={() => handleDelete(comment._id)}
                className="text-red-500 text-sm ml-4 hover:underline"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
