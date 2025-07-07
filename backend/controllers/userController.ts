import { Request, Response } from 'express';
import User from '../models/User';
import Media from '../models/Media';
import mongoose from 'mongoose';

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

// Controller to get a user's profile
export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = await User.findById(req.user?.id)
            .select('-passwordHash')
            .populate('watchHistory.mediaId', 'title posterUrl type');
            
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Controller to update watch history
export const updateWatchHistory = async (req: AuthenticatedRequest, res: Response) => {
    const { mediaId, progress } = req.body;

    if (!mediaId || progress === undefined) {
        return res.status(400).json({ message: 'Media ID and progress are required' });
    }

    try {
        const user = await User.findById(req.user?.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const media = await Media.findById(mediaId);
        if (!media) {
            return res.status(404).json({ message: 'Media not found' });
        }

        const historyIndex = user.watchHistory.findIndex(item => item.mediaId.toString() === mediaId);

        if (historyIndex > -1) {
            user.watchHistory[historyIndex].progress = progress;
            user.watchHistory[historyIndex].lastWatched = new Date();
        } else {
            user.watchHistory.unshift({
                mediaId: new mongoose.Types.ObjectId(mediaId),
                progress,
                lastWatched: new Date(),
            });
        }
        
        await user.save();
        res.json(user.watchHistory);

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}; 