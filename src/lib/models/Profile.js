import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
}, { timestamps: true });

export default mongoose.models.Profile || mongoose.model('Profile', ProfileSchema); 