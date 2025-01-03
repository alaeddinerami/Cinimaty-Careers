import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    contractType: { type: String, required: true },
    company: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Job || mongoose.model('Job', JobSchema);
