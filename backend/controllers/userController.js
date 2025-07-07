import User from '../models/User.js';

// Get user profile by ID (with populated followers/following)
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('followers', 'username _id')
      .populate('following', 'username _id');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update bio or username
export const updateProfile = async (req, res) => {
  try {
    const { bio, username } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { bio, username } },
      { new: true }
    ).select('-password');

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Follow another user
export const followUser = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user.id);

    if (!targetUser || !currentUser) return res.status(404).json({ message: 'User not found' });
    if (targetUser._id.equals(currentUser._id)) return res.status(400).json({ message: "You can't follow yourself" });

    if (!targetUser.followers.includes(currentUser._id)) {
      targetUser.followers.push(currentUser._id);
      currentUser.following.push(targetUser._id);
      await targetUser.save();
      await currentUser.save();
    }

    res.json({ message: 'Followed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Unfollow a user
export const unfollowUser = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user.id);

    if (!targetUser || !currentUser) return res.status(404).json({ message: 'User not found' });
    if (targetUser._id.equals(currentUser._id)) return res.status(400).json({ message: "You can't unfollow yourself" });

    targetUser.followers = targetUser.followers.filter(f => !f.equals(currentUser._id));
    currentUser.following = currentUser.following.filter(f => !f.equals(targetUser._id));

    await targetUser.save();
    await currentUser.save();

    res.json({ message: 'Unfollowed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Search users by username
export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.json([]);

    const users = await User.find({
      username: { $regex: query, $options: 'i' }
    }).select('username _id');

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};
