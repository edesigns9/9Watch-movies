import { Router } from 'express';
import { getProfile, updateWatchHistory } from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = Router();

// @route   GET /api/users/profile
// @desc    Get current user's profile
// @access  Private
router.get('/profile', protect, getProfile);

// @route   POST /api/users/history
// @desc    Add or update an item in the user's watch history
// @access  Private
router.post('/history', protect, updateWatchHistory);

export default router; 