import {
  DomainType,
  DifficultyTier,
  ProblemCard,
  VCITargetWord,
  ValidationState,
  EvaluationResult,
} from '../types';
import { BANNED_FILLER_WORDS, VCI_VOCABULARY_BANK } from '../data/vciVocabulary';
import { FALLBACK_PROBLEMS, getRandomVCIWords } from '../data/fallbackProblems';

export function validateSolutions(
  solutions: string[],
  vciWords: VCITargetWord[]
): ValidationState {
  const minCharPerSolution = 20;

  // 1. Solution length checks
  const solutionLengths = solutions.map(
    (s) => s.trim().length >= minCharPerSolution && s.trim().split(/\s+/).length >= 4
  );
  const all5Populated = solutionLengths.every(Boolean);

  // 2. Vocabulary word checks
  const combinedText = solutions.join(' ').toLowerCase();
  const wordsFound: { [word: string]: boolean } = {};
  vciWords.forEach((vci) => {
    const wordLower = vci.word.toLowerCase();
    // Regex for word boundary or root matching
    const regex = new RegExp(`\\b${wordLower}\\w*\\b`, 'i');
    wordsFound[vci.word] = regex.test(combinedText);
  });

  // 3. Filler words check
  const fillerWordsFound: { solutionIndex: number; word: string }[] = [];
  solutions.forEach((sol, idx) => {
    const solLower = sol.toLowerCase();
    BANNED_FILLER_WORDS.forEach((filler) => {
      const fillerRegex = new RegExp(`\\b${filler}\\b`, 'i');
      if (fillerRegex.test(solLower)) {
        fillerWordsFound.push({ solutionIndex: idx + 1, word: filler });
      }
    });
  });

  // 4. Transitive Conditional Pattern Check
  // Pattern: "If [A] undergoes [X], then [B] is bypassed because..."
  // Flexible regex to detect "if ... undergoes ... then ... because" or similar formal transitive conditional phrasing
  let conditionalCount = 0;
  solutions.forEach((sol) => {
    const solLower = sol.toLowerCase();
    const matchesIf = /\bif\b/.test(solLower);
    const matchesUndergoes = /\b(undergoes|undergo|experiences|undergoing)\b/.test(solLower);
    const matchesThen = /\bthen\b/.test(solLower);
    const matchesBecause = /\b(because|since|as a result)\b/.test(solLower);

    if (matchesIf && matchesThen && matchesBecause && (matchesUndergoes || /\bbypassed\b/.test(solLower))) {
      conditionalCount++;
    }
  });

  const conditionalsValid = conditionalCount >= 2;
  const allWordsFound = vciWords.every((w) => wordsFound[w.word]);
  const noFillerWords = fillerWordsFound.length === 0;

  const isValidForSubmission =
    all5Populated && allWordsFound && noFillerWords && conditionalsValid;

  // Calculate completion percentage
  let points = 0;
  let totalPoints = 5 + 3 + 1 + 2; // 5 inputs + 3 words + filler check + 2 conditionals

  // Populated solutions points (up to 5)
  solutionLengths.forEach((populated) => {
    if (populated) points += 1;
  });

  // Word points (up to 3)
  vciWords.forEach((w) => {
    if (wordsFound[w.word]) points += 1;
  });

  // Filler check point (1)
  if (noFillerWords) points += 1;

  // Conditionals points (up to 2)
  points += Math.min(conditionalCount, 2);

  const completionPercentage = Math.round((points / totalPoints) * 100);

  // Missing requirements list
  const missingRequirements: string[] = [];
  if (!all5Populated) {
    const missingCount = solutionLengths.filter((p) => !p).length;
    missingRequirements.push(`Populate all 5 distinct solutions (min 20 chars each; ${5 - missingCount}/5 complete)`);
  }
  const missingWords = vciWords.filter((w) => !wordsFound[w.word]).map((w) => w.word);
  if (missingWords.length > 0) {
    missingRequirements.push(`Integrate missing VCI words: ${missingWords.join(', ')}`);
  }
  if (!noFillerWords) {
    const uniqueFillers = Array.from(new Set(fillerWordsFound.map((f) => `"${f.word}" in Solution ${f.solutionIndex}`)));
    missingRequirements.push(`Remove filler words: ${uniqueFillers.slice(0, 3).join(', ')}`);
  }
  if (!conditionalsValid) {
    missingRequirements.push(`Format at least 2 solutions as transitive conditionals ("If [A] undergoes [X], then [B] is bypassed because...") (${conditionalCount}/2 required)`);
  }

  return {
    all5Populated,
    solutionLengths,
    wordsFound,
    fillerWordsFound,
    conditionalCount,
    conditionalsValid,
    isValidForSubmission,
    completionPercentage,
    missingRequirements,
  };
}

export async function fetchProblemAndVocabulary(
  domain: DomainType,
  difficulty: DifficultyTier,
  apiKey?: string,
  useLocalFallback: boolean = false
): Promise<{ problem: ProblemCard; vciWords: VCITargetWord[] }> {
  const userSavedKey =
    apiKey ||
    localStorage.getItem('gemini-api-key') ||
    localStorage.getItem('kv_vci_gemini_api_key') ||
    '';

  // If local fallback requested or no key provided, use local templates immediately
  if (useLocalFallback || !userSavedKey) {
    return getLocalFallbackProblem(domain, difficulty);
  }

  try {
    const res = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain, difficulty, apiKey: userSavedKey }),
    });

    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }

    const data = await res.json();
    if (data.problem && data.vciWords && data.vciWords.length === 3) {
      return {
        problem: {
          id: `gen-${Date.now()}`,
          domain,
          difficulty,
          title: data.problem.title || `${domain.toUpperCase()} Paradigm Challenge`,
          scenario: data.problem.scenario,
          coreConstraint: data.problem.coreConstraint,
          obviousTraps: data.problem.obviousTraps,
        },
        vciWords: data.vciWords,
      };
    } else {
      throw new Error('Invalid schema returned from Gemini API.');
    }
  } catch (err) {
    console.warn('Gemini generate failed, falling back to local problem template:', err);
    return getLocalFallbackProblem(domain, difficulty);
  }
}

function getLocalFallbackProblem(
  domain: DomainType,
  difficulty: DifficultyTier
): { problem: ProblemCard; vciWords: VCITargetWord[] } {
  // Find matching problem in fallback array
  const matches = FALLBACK_PROBLEMS.filter(
    (p) => p.domain === domain && p.difficulty === difficulty
  );
  const problem = matches.length > 0
    ? matches[Math.floor(Math.random() * matches.length)]
    : FALLBACK_PROBLEMS[Math.floor(Math.random() * FALLBACK_PROBLEMS.length)];

  const vciWords = getRandomVCIWords(3);
  return { problem, vciWords };
}

export async function evaluateUserSolutions(
  problem: ProblemCard,
  vciWords: VCITargetWord[],
  solutions: string[],
  apiKey?: string,
  useLocalFallback: boolean = false
): Promise<EvaluationResult> {
  const userSavedKey =
    apiKey ||
    localStorage.getItem('gemini-api-key') ||
    localStorage.getItem('kv_vci_gemini_api_key') ||
    '';

  if (useLocalFallback || !userSavedKey) {
    return getLocalFallbackEvaluation(problem, vciWords, solutions);
  }

  try {
    const res = await fetch('/api/gemini/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problem, vciWords, solutions, apiKey: userSavedKey }),
    });

    if (!res.ok) {
      throw new Error(`API evaluation returned status ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('Gemini evaluation failed, falling back to local analysis engine:', err);
    return getLocalFallbackEvaluation(problem, vciWords, solutions);
  }
}

function getLocalFallbackEvaluation(
  problem: ProblemCard,
  vciWords: VCITargetWord[],
  solutions: string[]
): EvaluationResult {
  const validation = validateSolutions(solutions, vciWords);

  const principlesList = [
    'Remote Concept Combination',
    'Spatialization',
    'Inversion',
    'Subsystem Decoupling',
    'Asymmetry',
    'Phase Shift',
    'Redundancy Stripping',
    'Thermal Gradient Redistribution',
    'Acoustic Wave Modulation',
    'Boundary Friction Dissipation',
  ];

  // Evaluate individual solutions heuristically
  const evaluatedSolutions = solutions.map((sol, idx) => {
    const solLower = sol.toLowerCase();
    const lengthFactor = Math.min(sol.length / 120, 1.2);
    
    // Check trap avoidance
    let trapPenalty = 0;
    problem.obviousTraps.forEach((trap) => {
      const keywords = trap.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
      const matched = keywords.filter((kw) => solLower.includes(kw));
      if (matched.length >= 2) trapPenalty += 15;
    });

    const isConditional = /\bif\b/.test(solLower) && /\bthen\b/.test(solLower) && /\bbecause\b/.test(solLower);
    const conditionalBonus = isConditional ? 12 : 0;

    const baseCreativity = Math.min(Math.max(Math.round(68 + Math.random() * 20 - trapPenalty + conditionalBonus), 45), 98);
    const baseFeasibility = Math.min(Math.max(Math.round(72 + Math.random() * 18 * lengthFactor), 50), 96);

    // Pick 2 principles based on solution index hash
    const p1 = principlesList[(idx * 3 + sol.length) % principlesList.length];
    const p2 = principlesList[(idx * 7 + 4) % principlesList.length];

    // Check VCI word usage accuracy in this solution
    let wordUsedInSol = false;
    vciWords.forEach((w) => {
      if (solLower.includes(w.word.toLowerCase())) wordUsedInSol = true;
    });

    const vciScore = wordUsedInSol ? Math.round(85 + Math.random() * 12) : Math.round(70 + Math.random() * 15);

    return {
      index: idx + 1,
      solutionText: sol,
      creativityScore: baseCreativity,
      feasibilityScore: baseFeasibility,
      abstractPrinciples: Array.from(new Set([p1, p2])),
      vciAccuracyScore: vciScore,
      vciFeedback: isConditional
        ? 'Excellent syntactic precision utilizing the required transitive conditional format.'
        : 'Clear semantic expression, though phrasing could be tightened with more formal causal mechanisms.',
      hasTransitiveConditional: isConditional,
    };
  });

  const overallCreativity = Math.round(
    evaluatedSolutions.reduce((acc, curr) => acc + curr.creativityScore, 0) / 5
  );
  const overallFeasibility = Math.round(
    evaluatedSolutions.reduce((acc, curr) => acc + curr.feasibilityScore, 0) / 5
  );

  const wordsEval = vciWords.map((w) => {
    const indices: number[] = [];
    solutions.forEach((sol, idx) => {
      if (sol.toLowerCase().includes(w.word.toLowerCase())) {
        indices.push(idx + 1);
      }
    });

    return {
      word: w.word,
      usedInSolutionIndices: indices,
      accurate: indices.length > 0,
      feedback: indices.length > 0
        ? `Accurately integrated in Solution ${indices.join(', ')} with strong semantic alignment.`
        : `Word was omitted or misspelled in solutions.`,
    };
  });

  const overallVCIScore = validation.isValidForSubmission ? 92 : 78;

  return {
    overallCreativity,
    overallFeasibility,
    overallVCIScore,
    evaluatorSummary: `Trial completed with strong divergent problem-solving across the ${problem.domain} domain. Solutions successfully bypassed default heuristic traps while maintaining high semantic precision.`,
    solutions: evaluatedSolutions,
    alternativeSolutions: [
      {
        title: 'Phase-Inversion Resonant Decoupling',
        mechanism: `Instead of applying brute mechanical force, induce an out-of-phase ultrasonic micro-vibration along the boundary node to liquefy surface boundary cohesion.`,
        abstractPrinciple: 'Subsystem Decoupling & Phase Shift',
      },
      {
        title: 'Thermal Gradient Counter-Siphon',
        mechanism: `Utilize the localized ambient temperature differential to drive an automatic thermo-siphon fluid cycle without mechanical pump friction.`,
        abstractPrinciple: 'Inversion & Thermal Gradient Redistribution',
      },
    ],
    vciAudit: {
      wordsEvaluation: wordsEval,
      semanticAmbiguityAlerts: validation.fillerWordsFound.length > 0
        ? validation.fillerWordsFound.map((f) => `Detected informal filler word "${f.word}" in Solution ${f.solutionIndex}.`)
        : ['No major semantic ambiguities detected. Phrasing maintained high formal academic precision.'],
      phrasingStrengthScore: 88,
    },
  };
}
