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

// Endpoint to generate Training Roadmap/Plan
app.post('/api/generate-plan', async (req: Request, res: Response) => {
    try {
        const { userData } = req.body;

        if (!userData) {
            return res.status(400).json({ error: 'User onboarding data is required.' });
        }

        console.log('Generating plan for user:', userData);

        // Mock response to act as a proper backend proxy fallback
        const start = new Date();
        const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
        const preferred = userData.planner_config?.preferred_time || '07:30';
        const goal = userData.primary_goal || 'Aerial';

        const mockPlan = {
            week_range: `${start.toLocaleString('en-US', { month: 'short' }).toUpperCase()} ${start.getDate()} - ${start.getDate() + 6}`,
            intensity_score: 82,
            days: dayNames.map((day_name, i) => {
                const d = new Date(start);
                d.setDate(start.getDate() + i);
                return {
                    day_name,
                    date: String(d.getDate()),
                    intensity: 60 + i * 3,
                    protocol: [
                        {
                            time: preferred,
                            duration: '45 MIN',
                            title: `${goal.toUpperCase()} FOCUS DRILLS`,
                            impact: `${goal}: POWER`,
                        },
                        {
                            time: '05:00 PM',
                            duration: '30 MIN',
                            title: 'SHADOWBOXING SPEED',
                            impact: 'Speed/Reflexes',
                        }
                    ],
                    recovery: 'Active mobility & foam roll',
                };
            }),
        };

        res.json({
            status: 'success',
            plan: mockPlan
        });
    } catch (error) {
        console.error('Gemini Plan Generation Proxy Error:', error);
        res.status(500).json({ error: 'Internal AI processing error' });
    }
});

app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'healthy' });
});

app.listen(PORT, () => {
    console.log(`ZEPHYR Backend Proxy running on port ${PORT}`);
});
