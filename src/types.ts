export interface Problem {
  id: string;
  domain: string;
  difficulty: string;
  scenario: string;
  coreConstraint: string;
  obviousTraps: string[];
}

export interface VciConstraints {
  mandatoryWords: string[];
  bannedWords: string[];
}

export interface Solution {
  text: string;
}

export interface EvaluationAxis {
  score: number; // 0-100
  feedback: string;
}

export interface SolutionEvaluation {
  creativity: EvaluationAxis;
  feasibility: EvaluationAxis;
  abstractPrinciples: string[];
}

export interface OverallEvaluation {
  solutionEvals: SolutionEvaluation[];
  missedUnconventionalSolutions: string[];
  vciPrecisionScore: number;
  vciFeedback: string;
}

export interface SessionData {
  id: string;
  date: string;
  domain: string;
  difficulty: string;
  problem: Problem;
  vciConstraints: VciConstraints;
  solutions: string[];
  evaluation: OverallEvaluation | null;
  metacognition: {
    q1: string;
    q2: string;
  };
}
