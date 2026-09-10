export type DomainType = 'physical' | 'social' | 'resource' | 'technical';

export type DifficultyTier = 'beginner' | 'intermediate' | 'advanced';

export type ActiveTab = 'exercise' | 'dashboard' | 'vocabulary' | 'methodology';

export type GamePhase = 1 | 2 | 3 | 4;

export interface ProblemCard {
  id: string;
  domain: DomainType;
  difficulty: DifficultyTier;
  title: string;
  scenario: string;
  coreConstraint: string;
  obviousTraps: string[];
}

export interface VCITargetWord {
  word: string;
  definition: string;
  partOfSpeech: string;
  exampleUsage: string;
}

export interface ValidationState {
  all5Populated: boolean;
  solutionLengths: boolean[]; // minimum character/word check per solution
  wordsFound: { [word: string]: boolean };
  fillerWordsFound: { solutionIndex: number; word: string }[];
  conditionalCount: number; // how many match "If [A] undergoes [X], then [B] is bypassed because..."
  conditionalsValid: boolean; // at least 2
  isValidForSubmission: boolean;
  completionPercentage: number;
  missingRequirements: string[];
}

export interface SolutionEvaluation {
  index: number;
  solutionText: string;
  creativityScore: number; // 1-100
  feasibilityScore: number; // 1-100
  abstractPrinciples: string[];
  vciAccuracyScore: number; // 1-100
  vciFeedback: string;
  hasTransitiveConditional: boolean;
}

export interface AlternativeSolution {
  title: string;
  mechanism: string;
  abstractPrinciple: string;
}

export interface VCIAudit {
  wordsEvaluation: {
    word: string;
    usedInSolutionIndices: number[];
    accurate: boolean;
    feedback: string;
  }[];
  semanticAmbiguityAlerts: string[];
  phrasingStrengthScore: number;
}

export interface EvaluationResult {
  overallCreativity: number;
  overallFeasibility: number;
  overallVCIScore: number;
  solutions: SolutionEvaluation[];
  alternativeSolutions: AlternativeSolution[];
  vciAudit: VCIAudit;
  evaluatorSummary: string;
}

export interface TrialSession {
  id: string;
  timestamp: number;
  domain: DomainType;
  difficulty: DifficultyTier;
  problem: ProblemCard;
  vciWords: VCITargetWord[];
  solutions: string[];
  evaluation: EvaluationResult;
  reflection: {
    largestShift: string;
    vciImpact: string;
  };
}

export interface VocabularyMasteryItem {
  word: string;
  definition: string;
  partOfSpeech: string;
  exampleUsage: string;
  timesUsed: number;
  accurateCount: number;
  lastUsedTimestamp: number;
}
