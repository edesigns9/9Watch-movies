import { Router } from 'express';
import { getBrowseMedia, getMediaById, getHomepageCollections } from '../controllers/mediaController';

const router = Router();

// @route   GET /api/media/homepage
// @desc    Get curated collections for the homepage
// @access  Public
router.get('/homepage', getHomepageCollections);

// @route   GET /api/media/browse
// @desc    Get all media with filtering, sorting, and pagination
// @access  Public
router.get('/browse', getBrowseMedia);

// @route   GET /api/media/:id
// @desc    Get a single media item by its ID
// @access  Public
router.get('/:id', getMediaById);

export default router; 