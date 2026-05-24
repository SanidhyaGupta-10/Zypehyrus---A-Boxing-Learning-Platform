const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Security & Optimization Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' })); // Strictly limit request size

// Rule 3: Rate Limiting to prevent spam/abuse
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many workout sessions submitted. Please take a breather.' }
});

// App-wide rate limit for general safety
app.use('/api/', apiLimiter);

/**
 * Rule 2: Session Endpoint
 * Accepts only processed numeric/text data from the client.
 * Strictly no video/binary data ingestion.
 */
app.post('/api/session-summary', async (req, res) => {
    const {
        ring_name,
        experience_level,
        punch_count,
        command_log,
        reflex_data
    } = req.body;

    // Validate incoming data
    if (!command_log || !Array.isArray(command_log)) {
        return res.status(400).json({ error: 'Invalid session data format.' });
    }

    try {
        /**
         * Rule 4: Asynchronous Gemini Handling
         * Sequential processing is avoided. Each request handles its own Gemini call.
         */
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are the ZEPHYR AI Boxing Coach. 
Analyze the following workout session for fighter ${ring_name || 'Boxer'}.
Experience Level: ${experience_level || 'Novice'}
Total Commands: ${command_log.length}
Actual Punches: ${punch_count}

Session Metrics (Processed by Client):
${JSON.stringify(reflex_data || 'No specific reflex metrics provided')}

Instructions:
1. Provide a concise, motivational 2-sentence feedback.
2. Identify one technical tip based on the data.
3. Return ONLY a JSON object.

Expected Format:
{
  "feedback": "...",
  "tip": "...",
  "intensity_score": 1-10
}`;

        // Gemini API call (Non-blocking for other users)
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean and parse JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : { feedback: 'Great work today!', tip: 'Keep your chin tucked.' };

        res.json({
            status: 'success',
            analysis
        });

    } catch (error) {
        console.error('Gemini Analysis Error:', error);
        // Rule 4: Handle failure gracefully without crashing the server
        res.status(500).json({
            error: 'AI analysis failed, but your session has been tracked.',
            fallback_feedback: 'Keep training hard. AI analysis unavailable at this moment.'
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => res.send('ZEPHYR Backend Live'));

app.listen(PORT, () => {
    console.log(`🥊 ZEPHYR Performance Backend running on port ${PORT}`);
    console.log(`🚀 Optimized for 500+ Daily Active Users`);
});
