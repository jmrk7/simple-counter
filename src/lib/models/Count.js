import mongoose from 'mongoose';

const CountSchema = new mongoose.Schema({
  profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
  date: { type: Date, required: true },
  value: { type: Number, default: 0 },
}, { timestamps: true });

CountSchema.index({ profile: 1, date: 1 }, { unique: true });

export default mongoose.models.Count || mongoose.model('Count', CountSchema); 