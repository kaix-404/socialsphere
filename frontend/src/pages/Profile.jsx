import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import { Dialog } from "@headlessui/react";

export default function Profile() {
  const { userId: paramUserId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [profileUser, setProfileUser] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  const userId = paramUserId || user?._id;
  const fetchProfile = async () => {
    if (!userId || !token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await axios.get(`http://localhost:9000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API Response:", res.data);
      setProfileUser(res.data);
      
      if (user?._id && res.data.followers) {
        setIsFollowing(res.data.followers?.some(f =>
          typeof f === "string" ? f === user._id : f._id === user._id
        ));
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      console.error("Error details:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post) => {
    setEditingPostId(post._id);
    setEditedContent(post.content);
  };

  const saveEdit = async (postId) => {
    try {
      const res = await axios.put(
        `http://localhost:9000/api/posts/${postId}`,
        { content: editedContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserPosts((prev) => prev.map((p) => (p._id === postId ? res.data : p)));
      setEditingPostId(null);
    } catch (err) {
      console.error("Post update failed", err);
    }
  };

  const handleDelete = async (postId) => {
    console.log("Deleting post with ID:", postId);
    try {
      await axios.delete(`http://localhost:9000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.error("Post delete failed", err);
    }
  };

  const fetchUserPosts = async () => {
    if (!userId || !token) return;
    
    try {
      const res = await axios.get("http://localhost:9000/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filtered = res.data.filter((post) => post.userId?._id === userId);
      setUserPosts(filtered.reverse()); // Show latest first
    } catch (err) {
      console.error("Failed to fetch user posts:", err);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, [userId]);

  const handleFollowToggle = async () => {
    try {
      const action = isFollowing ? "unfollow" : "follow";
      await axios.put(
        `http://localhost:9000/api/users/${userId}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProfile();
    } catch (err) {
      console.error("Follow/unfollow failed:", err);
    }
  };

  const handlePostCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("content", content);
      if (image) formData.append("image", image);

      const res = await axios.post("http://localhost:9000/api/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setContent("");
      setImage(null);
      setUserPosts((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error("Post creation failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  // Check if this is the current user's profile
  const isOwnProfile = user?._id && profileUser._id && String(user._id) === String(profileUser._id);

  if (loading) {
    return (
      <div className="px-4 sm:px-6 md:px-8 py-6 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded shadow text-center">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 md:px-8 py-6 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded shadow text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button 
            onClick={fetchProfile}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profileUser._id) {
    return (
      <div className="px-4 sm:px-6 md:px-8 py-6 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded shadow text-center">
          <p className="text-gray-500">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0e16] text-white bg-[radial-gradient(circle_at_center,_#42275a_0%,_transparent_60%)]">
      <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-6 md:px-8">
        {/* Profile Info */}
        <div className="bg-transparent p-6 sm:p-8 rounded-2xl text-center space-y-4">
          <h2 className="text-5xl font-extrabold text-gray-400">@{profileUser.username || 'Unknown User'}</h2>
          <div className="flex justify-center gap-6 text-gray-400 text-sm font-medium">
            <button onClick={() => setShowFollowers(true)} className="hover:underline">
              <span className="font-semibold">{profileUser.followers?.length || 0}</span> Followers
            </button>
            <button onClick={() => setShowFollowing(true)} className="hover:underline">
              <span className="font-semibold">{profileUser.following?.length || 0}</span> Following
            </button>
            <button className="hover:underline cursor-default">
              <span className="font-semibold">{userPosts.length}</span> {userPosts.length === 1 ? "Post" : "Posts"}
            </button>
          </div>

          {/* Action Button - Follow/Unfollow or Create Post */}
          {user?._id && profileUser._id && (
            <div className="mt-4">
              {!isOwnProfile ? (
                // Show Follow/Unfollow button for other users
                <button
                  onClick={handleFollowToggle}
                  className={`px-5 py-2 text-sm rounded font-semibold transition ${
                    isFollowing
                      ? "bg-gray-300 text-black hover:bg-gray-400"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              ) : (
                // Show Create Post form for own profile
                <div className="bg-[#14161e] p-6 rounded-xl shadow-md border border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">Create New Post</h3>
                  <form onSubmit={handlePostCreate} className="space-y-3">
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="What's on your mind?"
                      className="bg-[#1c1f2a] w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none text-sm"
                      rows={3}
                      required
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Posting..." : "Post"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Followers Modal */}
          <Dialog open={showFollowers} onClose={() => setShowFollowers(false)} className="relative z-50">
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6 shadow-lg">
                <Dialog.Title className="text-lg font-bold mb-4">Followers</Dialog.Title>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {profileUser.followers?.length ? (
                    profileUser.followers.map((follower, index) => (
                      <div
                        key={follower._id || index}
                        onClick={() => {
                          if (follower._id) {
                            navigate(`/profile/${follower._id}`);
                            setShowFollowers(false);
                          }
                        }}
                        className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                      >
                        @{follower.username || 'Unknown'}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No followers yet</p>
                  )}
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>

          {/* Following Modal */}
          <Dialog open={showFollowing} onClose={() => setShowFollowing(false)} className="relative z-50">
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6 shadow-lg">
                <Dialog.Title className="text-lg font-bold mb-4">Following</Dialog.Title>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {profileUser.following?.length ? (
                    profileUser.following.map((followee, index) => (
                      <div
                        key={followee._id || index}
                        onClick={() => {
                          if (followee._id) {
                            navigate(`/profile/${followee._id}`);
                            setShowFollowing(false);
                          }
                        }}
                        className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                      >
                        @{followee.username || 'Unknown'}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Not following anyone yet</p>
                  )}
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        </div>

        {/* User Posts */}
        <div className="bg-transparent p-6 sm:p-8 max-w-xl w-full mx-auto space-y-5 rounded-2xl">
          <h3 className="text-3xl font-bold text-gray-400 mb-6 text-center">- Posts -</h3>

          {userPosts.length > 0 ? (
            <div className="space-y-6">
              {userPosts.map((post) => (
                <div
                  key={post._id}
                  className="bg-[#14161e] p-6 rounded-xl shadow-md border border-gray-700"
                >
                  {editingPostId === post._id ? (
                    <>
                      <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full p-3 text-sm border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                        rows={3}
                      />
                      <div className="flex justify-start gap-3">
                        <button
                          onClick={() => saveEdit(post._id)}
                          className="px-4 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingPostId(null)}
                          className="px-4 py-1.5 text-sm bg-gray-300 hover:bg-gray-400 text-black rounded-md shadow-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <PostCard className="shadow-none" post={post} />

                      {isOwnProfile && (
                        <div className="flex justify-center gap-2 pt-2 mt-2">
                          <button
                            onClick={() => handleEdit(post)}
                            className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(post._id)}
                            className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No posts yet.</p>
          )}
        </div>

      </div>
    </div>
  );
}