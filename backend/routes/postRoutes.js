import express from 'express';
import { createPost, getAllPosts, deletePost, editPost, addComment, getComments, likePost, unlikePost , deleteComment} from '../controllers/postController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadImage.js';

const router = express.Router();

// Posts
router.post('/', authMiddleware, upload.single('image'), createPost);
router.delete('/:postId', authMiddleware, deletePost);
router.put('/:postId', authMiddleware, editPost);
router.get('/', getAllPosts);

// Comments
router.post('/:postId/comments', authMiddleware, addComment);
router.get('/:postId/comments', getComments);
router.delete('/:postId/comments/:commentId', authMiddleware, deleteComment);

// Likes
router.post('/:postId/like', authMiddleware, likePost);
router.post('/:postId/unlike', authMiddleware, unlikePost);

export default router;
