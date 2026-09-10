import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  app.use(express.json());

  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  app.post('/api/generate-problem', async (req, res) => {
    if (!ai) return res.status(500).json({ error: 'Gemini API not configured.' });
    try {
      const { domain, difficulty } = req.body;
      
      const prompt = `You are the Kvashchev Problem Generator. 
Generate a problem scenario requiring unconventional, non-obvious problem-solving.
Domain: ${domain}
Difficulty: ${difficulty}

Return ONLY valid JSON in this exact structure, do not wrap in markdown tags:
{
  "scenario": "3-4 dense sentences outlining the problem",
  "coreConstraint": "Explicit statement of the exact boundary/goal",
  "obviousTraps": ["trap 1", "trap 2", "trap 3"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      if (!response.text) throw new Error('No response');
      const data = JSON.parse(response.text);
      res.json({
        id: 'gen-' + Date.now(),
        domain,
        difficulty,
        ...data
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to generate problem' });
    }
  });

  app.post('/api/evaluate', async (req, res) => {
    if (!ai) return res.status(500).json({ error: 'Gemini API not configured.' });
    try {
      const { problem, solutions, vciConstraints } = req.body;

      const prompt = `You are evaluating a user's solutions to a cognitive exercise.
Problem:
Scenario: ${problem.scenario}
Core Constraint: ${problem.coreConstraint}
Obvious Traps: ${problem.obviousTraps.join(', ')}

User's 5 Solutions:
${solutions.map((s: string, i: number) => `Solution ${i+1}: ${s}`).join('\n')}

VCI Constraints applied: 
Mandatory words: ${vciConstraints.mandatoryWords.join(', ')}

Provide a strict, highly analytical evaluation. Return ONLY valid JSON in this exact structure, do not wrap in markdown tags:
{
  "solutionEvals": [
    {
      "creativity": { "score": 85, "feedback": "string" },
      "feasibility": { "score": 90, "feedback": "string" },
      "abstractPrinciples": ["principle1", "principle2"]
    }
  ],
  "missedUnconventionalSolutions": ["solution A", "solution B"],
  "vciPrecisionScore": 92,
  "vciFeedback": "Detailed feedback on the user's semantic precision and vocabulary usage."
}

Ensure solutionEvals has exactly 5 elements matching the 5 solutions.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      if (!response.text) throw new Error('No response');
      const data = JSON.parse(response.text);
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to evaluate solutions' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
