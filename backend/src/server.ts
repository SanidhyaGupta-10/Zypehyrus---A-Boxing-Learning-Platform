import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Proxy Route for Gemini AI
app.post('/api/analyze-session', async (req: Request, res: Response) => {
    try {
        const { metrics } = req.body;

        if (!metrics) {
            return res.status(400).json({ error: 'Metrics are required' });
        }

        // Rule 2: Backend only digests summarized metrics, never raw video.
        // In production, this would call the Google Gemini API using process.env.GEMINI_API_KEY
        console.log('Forwarding metrics to Gemini AI:', metrics);

        // Mock response for now
        const mockAnalysis = {
            feedback: "Great session! Your punch velocity is increasing. Keep your chin down during the hook.",
            tip: "Work on hip rotation for more power.",
            score: 85
        };

        res.json({ analysis: mockAnalysis });
    } catch (error) {
        console.error('Gemini Proxy Error:', error);
        res.status(500).json({ error: 'Internal AI processing error' });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

app.listen(PORT, () => {
    console.log(`ZEPHYR Backend Proxy running on port ${PORT}`);
});
