import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  getUserProfile,
  updateProfile,
  followUser,
  unfollowUser,
  searchUsers
} from '../controllers/userController.js';

const router = express.Router();
        
router.put('/update', authMiddleware, updateProfile); 
router.put('/:userId/follow', authMiddleware, followUser);
router.put('/:userId/unfollow', authMiddleware, unfollowUser);
router.get('/search', authMiddleware, searchUsers);
router.get('/:userId', getUserProfile);

export default router;
