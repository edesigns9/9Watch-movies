import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  avatarUrl?: string;
  watchHistory: {
    mediaId: mongoose.Schema.Types.ObjectId;
    progress: number;
    lastWatched: Date;
  }[];
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  passwordHash: { type: String, required: true },
  avatarUrl: { type: String },
  watchHistory: [
    {
      mediaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Media' },
      progress: { type: Number, default: 0 },
      lastWatched: { type: Date },
    },
  ],
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema); 