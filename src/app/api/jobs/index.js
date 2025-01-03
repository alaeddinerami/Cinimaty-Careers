import connectToDatabase from '../../../lib/mongodb';
import Job from '../../../models/Job';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            await connectToDatabase();

            const { page = 1, size = 10 } = req.query;
            const jobs = await Job.find()
                .skip((page - 1) * size)
                .limit(parseInt(size));

            const totalJobs = await Job.countDocuments();

            res.status(200).json({
                jobs,
                total: totalJobs,
                page: parseInt(page),
                size: parseInt(size),
            });
        } catch (error) {
            res.status(500).json({ message: 'Erreur serveur', error });
        }
    } else {
        res.status(405).json({ message: 'Méthode non autorisée' });
    }
}
