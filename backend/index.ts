import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('[database]: MongoDB connected successfully.');
    } catch (error) {
        console.error('[database]: MongoDB connection failed:', error);
        process.exit(1);
    }
};

connectDB();

app.use(cors());
app.use(express.json());

// Routes
import authRoutes from './routes/auth';
import mediaRoutes from './routes/media';
import userRoutes from './routes/user';

app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('9watch API is running...');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
}); 