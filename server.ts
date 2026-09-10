import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "2mb" }));

  // Helper to initialize GenAI client with either user provided key or server key
  function getGenAIClient(userApiKey?: string) {
    const apiKey = userApiKey && userApiKey.trim().length > 5 
      ? userApiKey.trim() 
      : process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return null;
    }

    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      hasServerKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // API Endpoint: Generate Kvashchev Problem Card & VCI Words
  app.post("/api/gemini/generate", async (req, res) => {
    try {
      const { domain, difficulty, apiKey } = req.body;
      const ai = getGenAIClient(apiKey);

      if (!ai) {
        return res.status(400).json({
          error: "No Gemini API Key available. Please provide a BYOK key or set process.env.GEMINI_API_KEY.",
        });
      }

      const prompt = `You are an expert Psychometrician and Cognitive Science Game Designer.
Generate a high-level Kvashchev divergent problem-solving scenario and 3 target VCI (Verbal Comprehension Index) vocabulary words.

Target Domain: ${domain} (e.g., physical constraints, social/hierarchical conflicts, resource scarcity, or technical/abstract systems).
Target Difficulty: ${difficulty} (beginner, intermediate, advanced).

Requirements for the Scenario:
1. Scenario: Exactly 3 to 4 dense, highly structured sentences outlining a complex, paradoxical problem situation.
2. Core Constraint: An explicit, uncompromising statement of the exact boundary/goal.
3. Obvious Traps: Exactly 2 to 3 "obvious but won't work" approaches that block typical heuristic shortcuts.
4. Title: A concise, technical or evocative title (3-6 words).
5. VCI Target Words: Exactly 3 sophisticated, high-VCI vocabulary words (e.g., vicissitude, recalcitrant, obfuscate, equanimity, ephemeral, etc.) with definitions, part of speech, and example sentences relevant to problem solving.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              problem: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  scenario: { type: Type.STRING },
                  coreConstraint: { type: Type.STRING },
                  obviousTraps: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ["title", "scenario", "coreConstraint", "obviousTraps"],
              },
              vciWords: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    word: { type: Type.STRING },
                    definition: { type: Type.STRING },
                    partOfSpeech: { type: Type.STRING },
                    exampleUsage: { type: Type.STRING },
                  },
                  required: ["word", "definition", "partOfSpeech", "exampleUsage"],
                },
              },
            },
            required: ["problem", "vciWords"],
          },
        },
      });

      const jsonText = response.text ? response.text.trim() : "";
      const parsed = JSON.parse(jsonText);
      res.json(parsed);
    } catch (err: any) {
      console.error("Gemini Generate Error:", err);
      res.status(500).json({ error: err.message || "Failed to generate problem card via Gemini API." });
    }
  });

  // API Endpoint: Evaluate 5 User Solutions across Kvashchev and VCI dimensions
  app.post("/api/gemini/evaluate", async (req, res) => {
    try {
      const { problem, vciWords, solutions, apiKey } = req.body;
      const ai = getGenAIClient(apiKey);

      if (!ai) {
        return res.status(400).json({
          error: "No Gemini API Key available for evaluation.",
        });
      }

      const wordsList = vciWords.map((w: any) => w.word).join(", ");
      const prompt = `You are a Psychometric Evaluator specializing in Divergent Thinking (Kvashchev Method) and Verbal Precision (VCI - Verbal Comprehension Index).

Problem Context:
Title: ${problem.title}
Domain: ${problem.domain}
Difficulty: ${problem.difficulty}
Scenario: ${problem.scenario}
Core Constraint: ${problem.coreConstraint}
Obvious Traps: ${problem.obviousTraps.join("; ")}

Mandatory VCI Target Words: ${wordsList}

User's 5 Divergent Solutions:
1. ${solutions[0]}
2. ${solutions[1]}
3. ${solutions[2]}
4. ${solutions[3]}
5. ${solutions[4]}

Evaluation Instructions:
1. For each of the 5 solutions:
   - Assign Creativity Score (1-100) based on divergence, novelty, and avoidance of the obvious traps.
   - Assign Feasibility Score (1-100) based on physical/logical plausibility within the domain constraints.
   - Identify 1 to 2 Abstract Cognitive Principles utilized (e.g., "Remote Concept Combination", "Spatialization", "Inversion", "Subsystem Decoupling", "Asymmetry", "Phase Shift", "Redundancy Stripping").
   - Check if it satisfies the formal transitive conditional structure ("If [Mechanism A] undergoes [Transform X], then [Constraint B] is bypassed because...").
   - Assign VCI Accuracy Score (1-100) and brief feedback regarding vocabulary precision and contextual fit.

2. Generate 2 Alternative Unconventional Solutions that the user missed (title, mechanism, abstractPrinciple).

3. VCI Precision Audit:
   - Audit the 3 target words (${wordsList}): evaluate whether each word was used accurately in context and provide constructive feedback.
   - Identify any semantic ambiguity or imprecise phrasing across the solutions.
   - Rate overall Phrasing Strength (1-100).

4. Overall Scores: Calculate overallCreativity, overallFeasibility, overallVCIScore (1-100 each), and provide a concise 2-sentence evaluator summary.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallCreativity: { type: Type.NUMBER },
              overallFeasibility: { type: Type.NUMBER },
              overallVCIScore: { type: Type.NUMBER },
              evaluatorSummary: { type: Type.STRING },
              solutions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    index: { type: Type.NUMBER },
                    creativityScore: { type: Type.NUMBER },
                    feasibilityScore: { type: Type.NUMBER },
                    abstractPrinciples: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    vciAccuracyScore: { type: Type.NUMBER },
                    vciFeedback: { type: Type.STRING },
                    hasTransitiveConditional: { type: Type.BOOLEAN },
                  },
                  required: [
                    "index",
                    "creativityScore",
                    "feasibilityScore",
                    "abstractPrinciples",
                    "vciAccuracyScore",
                    "vciFeedback",
                    "hasTransitiveConditional",
                  ],
                },
              },
              alternativeSolutions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    mechanism: { type: Type.STRING },
                    abstractPrinciple: { type: Type.STRING },
                  },
                  required: ["title", "mechanism", "abstractPrinciple"],
                },
              },
              vciAudit: {
                type: Type.OBJECT,
                properties: {
                  wordsEvaluation: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        word: { type: Type.STRING },
                        accurate: { type: Type.BOOLEAN },
                        feedback: { type: Type.STRING },
                      },
                      required: ["word", "accurate", "feedback"],
                    },
                  },
                  semanticAmbiguityAlerts: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  phrasingStrengthScore: { type: Type.NUMBER },
                },
                required: ["wordsEvaluation", "semanticAmbiguityAlerts", "phrasingStrengthScore"],
              },
            },
            required: [
              "overallCreativity",
              "overallFeasibility",
              "overallVCIScore",
              "evaluatorSummary",
              "solutions",
              "alternativeSolutions",
              "vciAudit",
            ],
          },
        },
      });

      const jsonText = response.text ? response.text.trim() : "";
      const parsed = JSON.parse(jsonText);
      
      // Merge original solution text back into the evaluation objects
      const enrichedSolutions = parsed.solutions.map((s: any, idx: number) => ({
        ...s,
        index: idx + 1,
        solutionText: solutions[idx] || "",
      }));

      res.json({
        ...parsed,
        solutions: enrichedSolutions,
      });
    } catch (err: any) {
      console.error("Gemini Evaluate Error:", err);
      res.status(500).json({ error: err.message || "Failed to evaluate solutions via Gemini API." });
    }
  });

  // Vite middleware for dev or static serving for prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
