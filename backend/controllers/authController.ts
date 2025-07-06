import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';

export const registerUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        user = new User({
            username,
            email,
            passwordHash,
            avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`,
        });

        await user.save();

        // In a real app, you'd generate a JWT here
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}; 