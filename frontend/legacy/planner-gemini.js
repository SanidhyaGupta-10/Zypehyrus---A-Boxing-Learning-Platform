/**
 * Gemini planner generation — shared prompt + API client (browser).
 */
(function () {
    const GEMINI_MODEL = 'gemini-2.0-flash';

    function buildPlannerPrompts(userData) {
        const preferred = userData?.planner_config?.preferred_time || '07:30';
        const peak = userData?.planner_config?.peak_window || 'MORNING';
        const goal = userData?.primary_goal || 'All-Rounder';

        const systemPrompt = `You are the Synthetic Combat Intelligence for an AI boxing training app.
Generate a complete 7-day BODYWEIGHT-ONLY weekly training roadmap as JSON.
RETURN ONLY ONE VALID JSON OBJECT. NO MARKDOWN. NO CODE FENCES. NO COMMENTS.
NO EQUIPMENT (no bags, weights, bands, machines).

JSON STRUCTURE:
{
  "week_range": "MAR 26 - APR 1",
  "intensity_score": 84,
  "days": [
    {
      "day_name": "MON",
      "date": "26",
      "day_type": "PUSH DAY",
      "intensity": 65,
      "protocol": [
        {
          "time": "7:30 AM",
          "duration": "5 MIN",
          "title": "PUSH DAY: WARM-UP",
          "impact": "PUSH DAY",
          "day_type": "PUSH DAY",
          "exercises": ["Push-Ups", "Shoulder Circles"]
        }
      ],
      "recovery": "Mobility notes"
    }
  ]
}

MANDATORY RULES:
1. Exactly 7 days (MON through SUN) starting from today's real date.
2. Weekly split: MON=PUSH DAY, TUE=PULL DAY, WED=LEG DAY, THU=ENDURANCE DAY, FRI=STRENGTH DAY, SAT=PUSH DAY, SUN=ACTIVE RECOVERY.
3. Each day has exactly 5 protocol blocks: WARM-UP, PRIMARY BLOCK, SECONDARY BLOCK, CONDITIONING, COOLDOWN.
4. Each protocol block has exactly 2 exercises (bodyweight only) matching that day's day_type.
5. User preferred session start: "${preferred}" (24h HH:mm). First block each day MUST start at this time in 12-hour format.
   Stagger later blocks at +8, +22, +34, +44 minutes from that start.
6. User peak window: "${peak}" — align session energy to this window.
7. User primary goal: "${goal}" — reflect in intensity and exercise selection.
8. Title format: "{day_type}: {BLOCK NAME}".
9. "impact" and "day_type" on each protocol must match that day's day_type label.
10. Use realistic durations (5-15 MIN per block).`;

        const currentDateStr = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        const userPrompt = `Generate the full 7-day roadmap for this athlete profile:
${JSON.stringify(userData, null, 2)}

Today is ${currentDateStr}. The "date" field on each day must be the calendar day of month (e.g. "26") starting from today.`;

        return { systemPrompt, userPrompt };
    }

    function parsePlanFromGeminiText(text) {
        if (!text) throw new Error('Empty response from Gemini.');
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No valid JSON in Gemini response.');
        return JSON.parse(jsonMatch[0]);
    }

    function parseGeminiApiResponse(payload) {
        const parts = payload?.candidates?.[0]?.content?.parts;
        if (!parts?.length) {
            const block = payload?.promptFeedback?.blockReason;
            throw new Error(block ? `Gemini blocked: ${block}` : 'No content from Gemini.');
        }
        const text = parts.map((p) => p.text || '').join('');
        return parsePlanFromGeminiText(text);
    }

    async function generatePlanViaGemini(apiKey, userData) {
        if (!apiKey) throw new Error('Gemini API key is missing.');

        const { systemPrompt, userPrompt } = buildPlannerPrompts(userData);
        const url =
            `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=` +
            encodeURIComponent(apiKey);

        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt + '\n\n' + userPrompt }] }],
                generationConfig: {
                    temperature: 0.75,
                    responseMimeType: 'application/json',
                },
            }),
        });

        if (res.status === 429) {
            throw new Error('Neural Capacity Reached. Please wait and try again.');
        }

        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Gemini API error ${res.status}: ${errText.slice(0, 200)}`);
        }

        const data = await res.json();
        return parseGeminiApiResponse(data);
    }

    window.PlannerGemini = {
        GEMINI_MODEL,
        buildPlannerPrompts,
        parsePlanFromGeminiText,
        parseGeminiApiResponse,
        generatePlanViaGemini,
    };
})();
