const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GEMINI_MODEL, buildPlannerPrompts } = require('./planner-gemini-prompt.cjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Security & Optimization Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));

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

const VISION_GEMINI_MODEL = process.env.GEMINI_VISION_MODEL || 'gemini-2.0-flash';

function buildVisionVideoPrompt(profile, commandLog, reflexData) {
    return `You are the ZEPHYR Biomechanical AI Coach. Analyze this LIVE RECORDED boxing training video.

FIGHTER PROFILE:
${JSON.stringify(profile || {}, null, 2)}

VOICE COMMANDS (issued at timestamps in milliseconds):
${JSON.stringify(commandLog || [], null, 2)}

CLIENT REFLEX TRACKING (milliseconds, from pose heuristics):
${JSON.stringify(reflexData || [], null, 2)}

INSTRUCTIONS:
1. Watch the full video. Score POWER (hip rotation, punch extension, snap), STANCE (balance, guard, foot position), and REFLEX (response delay after each command).
2. Scores 0-100 for power_score, stance_score, reflex_score. overall_score = weighted average.
3. posture_score 1-10 for guard and chin discipline.
4. One drill_data entry per command in the log with reflex_time_ms and velocity_rating.
5. Be specific in form_notes and primary_technical_flaw.

Return ONLY valid JSON (no markdown):
{
  "session_summary": {
    "overall_rating": "Elite|Amateur|Novice",
    "overall_score": 75,
    "power_score": 80,
    "stance_score": 70,
    "reflex_score": 72,
    "posture_score": 7,
    "primary_technical_flaw": "specific observation",
    "calibration_status": "Passed|Failed"
  },
  "drill_data": [
    {
      "command": "Jab",
      "command_timestamp_ms": 2000,
      "reflex_time_ms": 280,
      "extension_speed_ms": 95,
      "velocity_rating": "Explosive|Snappy|Slow",
      "form_notes": "observation"
    }
  ],
  "coach_advice": "Motivational coaching paragraph."
}`;
}

/**
 * Multimodal vision analysis — recorded drill video → Gemini report.
 */
app.post('/api/analyze-vision-video', express.json({ limit: '32mb' }), async (req, res) => {
    const { base64Video, mimeType, commandLog, profile, reflex_data } = req.body;

    if (!base64Video) {
        return res.status(400).json({ error: 'Video data is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({ error: 'GEMINI_API_KEY not configured on server.' });
    }

    try {
        const model = genAI.getGenerativeModel({
            model: VISION_GEMINI_MODEL,
            generationConfig: {
                temperature: 0.35,
                maxOutputTokens: 4096,
                responseMimeType: 'application/json',
            },
        });

        const prompt = buildVisionVideoPrompt(profile, commandLog, reflex_data);
        const result = await model.generateContent([
            {
                inlineData: {
                    mimeType: mimeType || 'video/webm',
                    data: base64Video,
                },
            },
            { text: prompt },
        ]);

        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No JSON in Gemini vision response.');
        }

        const analysis = JSON.parse(jsonMatch[0]);
        res.json({ status: 'success', source: 'gemini', analysis });
    } catch (error) {
        console.error('Gemini Vision Analysis Error:', error);
        res.status(500).json({
            error: 'Gemini video analysis failed.',
            message: error.message,
        });
    }
});

/**
 * Endpoint for Weekly Planner
 * Accepts user onboarding data and generates a structured 7-day roadmap using Gemini.
 */
app.post('/api/generate-plan', async (req, res) => {
    const { userData } = req.body;

    if (!userData) {
        return res.status(400).json({ error: 'User onboarding data is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({
            error: 'GEMINI_API_KEY is not set on the server. Add it to .env and run npm start.',
        });
    }

    try {
        const { systemPrompt, userPrompt } = buildPlannerPrompts(userData);
        const model = genAI.getGenerativeModel({
            model: GEMINI_MODEL,
            generationConfig: {
                temperature: 0.75,
                responseMimeType: 'application/json',
            },
        });

        const result = await model.generateContent(systemPrompt + '\n\n' + userPrompt);
        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No valid JSON found in Gemini response.');
        }
        const plan = JSON.parse(jsonMatch[0]);

        res.json({
            status: 'success',
            source: 'gemini',
            plan,
        });
    } catch (error) {
        console.error('Gemini Plan Generation Error:', error);
        res.status(500).json({
            error: 'Gemini plan generation failed.',
            message: error.message,
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => res.send('ZEPHYR Backend Live'));

app.listen(PORT, () => {
    console.log(`🥊 ZEPHYR Performance Backend running on port ${PORT}`);
    console.log(`🚀 Optimized for 500+ Daily Active Users`);
});
