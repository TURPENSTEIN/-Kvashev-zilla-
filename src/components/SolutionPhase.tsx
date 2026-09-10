import React from 'react';
import { ProblemCard, VCITargetWord, ValidationState } from '../types';
import {
  Brain,
  Check,
  X,
  AlertTriangle,
  Send,
  Lock,
  BookOpen,
  Sparkles,
  HelpCircle,
  CheckCircle,
  Lightbulb,
} from 'lucide-react';

interface SolutionPhaseProps {
  problem: ProblemCard;
  vciWords: VCITargetWord[];
  solutions: string[];
  setSolutions: (s: string[]) => void;
  validation: ValidationState;
  onSubmit: () => void;
  isEvaluating: boolean;
  onBackToPhase1: () => void;
}

export const SolutionPhase: React.FC<SolutionPhaseProps> = ({
  problem,
  vciWords,
  solutions,
  setSolutions,
  validation,
  onSubmit,
  isEvaluating,
  onBackToPhase1,
}) => {
  const handleSolutionChange = (index: number, value: string) => {
    const updated = [...solutions];
    updated[index] = value;
    setSolutions(updated);
  };

  const insertConditionalTemplate = (index: number) => {
    const template = `If [Mechanism A] undergoes [Transform X], then [Constraint B] is bypassed because `;
    const updated = [...solutions];
    if (!updated[index].trim()) {
      updated[index] = template;
    } else {
      updated[index] = updated[index] + ' ' + template;
    }
    setSolutions(updated);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Top Problem Reference Header (Collapsible Summary) */}
      <div className="bg-[#09090b] border border-zinc-800 rounded-xl p-4 md:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              PHASE 2
            </span>
            <h2 className="text-sm md:text-base font-bold text-white tracking-tight">
              Solution Generation (5 Divergent Solutions)
            </h2>
          </div>
          <button
            onClick={onBackToPhase1}
            className="text-xs text-zinc-400 hover:text-zinc-200 underline font-mono"
          >
            Edit Problem / Settings
          </button>
        </div>

        {/* Problem Card Quick Reference */}
        <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
            <span>{problem.title}</span>
            <span className="text-[10px] text-zinc-400">{problem.domain.toUpperCase()}</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">{problem.scenario}</p>
          <div className="pt-2 border-t border-zinc-800 flex flex-wrap gap-2 text-[11px]">
            <span className="text-emerald-400 font-semibold">Constraint: {problem.coreConstraint}</span>
          </div>
        </div>
      </div>

      {/* REAL-TIME VCI VALIDATOR HUD */}
      <div className="bg-[#08080a] border border-cyan-500/40 rounded-xl p-4 md:p-5 space-y-4 glow-cyan sticky top-16 z-30 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
              REAL-TIME VCI VALIDATOR HUD
            </span>
          </div>
          {/* Completion Progress Bar */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400 font-bold">
              Requirements: {validation.completionPercentage}%
            </span>
            <div className="w-28 md:w-40 h-2 rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${validation.completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Real-time Checklist Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* 1. Populated Solutions Indicator */}
          <div
            className={`p-2.5 rounded-lg border flex items-center justify-between ${
              validation.all5Populated
                ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400'
            }`}
          >
            <span className="font-semibold">5 Solutions Populated</span>
            {validation.all5Populated ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <span className="text-[10px] text-zinc-500 font-mono">
                {validation.solutionLengths.filter(Boolean).length}/5
              </span>
            )}
          </div>

          {/* 2. Mandatory VCI Words Integrated */}
          <div
            className={`p-2.5 rounded-lg border space-y-1 ${
              vciWords.every((w) => validation.wordsFound[w.word])
                ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">VCI Words (3/3)</span>
              {vciWords.every((w) => validation.wordsFound[w.word]) && (
                <Check className="w-4 h-4 text-emerald-400" />
              )}
            </div>
            <div className="flex flex-wrap gap-1 pt-0.5">
              {vciWords.map((w) => {
                const found = validation.wordsFound[w.word];
                return (
                  <span
                    key={w.word}
                    className={`text-[10px] px-1.5 py-0.2 rounded border font-mono ${
                      found
                        ? 'bg-emerald-900/80 border-emerald-400 text-emerald-200'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-500'
                    }`}
                  >
                    {w.word}
                  </span>
                );
              })}
            </div>
          </div>

          {/* 3. Transitive Conditionals Count */}
          <div
            className={`p-2.5 rounded-lg border flex items-center justify-between ${
              validation.conditionalsValid
                ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400'
            }`}
          >
            <div>
              <span className="font-semibold block">Formal Conditionals</span>
              <span className="text-[10px] text-zinc-400">Target: ≥ 2 solutions</span>
            </div>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded border ${
                validation.conditionalsValid
                  ? 'bg-emerald-900/60 border-emerald-400 text-emerald-200'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-400'
              }`}
            >
              {validation.conditionalCount}/2
            </span>
          </div>

          {/* 4. Filler Words Status */}
          <div
            className={`p-2.5 rounded-lg border flex items-center justify-between ${
              validation.fillerWordsFound.length === 0
                ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/60 text-rose-300'
            }`}
          >
            <div>
              <span className="font-semibold block">Zero Filler Words</span>
              {validation.fillerWordsFound.length > 0 && (
                <span className="text-[10px] text-rose-400 block font-bold">
                  Found: {validation.fillerWordsFound[0].word}
                </span>
              )}
            </div>
            {validation.fillerWordsFound.length === 0 ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            )}
          </div>
        </div>
      </div>

      {/* 5 SOLUTION INPUT FIELDS */}
      <div className="space-y-4">
        {solutions.map((sol, index) => {
          const isPopulated = validation.solutionLengths[index];
          const hasFillerInThis = validation.fillerWordsFound.some(
            (f) => f.solutionIndex === index + 1
          );

          // Check if this solution uses any VCI word
          const usedVCIWords = vciWords.filter((w) =>
            sol.toLowerCase().includes(w.word.toLowerCase())
          );

          // Check if this solution is a conditional
          const solLower = sol.toLowerCase();
          const isConditional =
            /\bif\b/.test(solLower) &&
            /\bthen\b/.test(solLower) &&
            /\bbecause\b/.test(solLower);

          return (
            <div
              key={index}
              className={`bg-[#09090b] border rounded-xl p-4 space-y-2 transition-all ${
                hasFillerInThis
                  ? 'border-rose-500/60 shadow-md shadow-rose-950/30'
                  : isPopulated
                  ? 'border-zinc-700/80'
                  : 'border-zinc-800/80'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <label className="text-xs font-bold text-white uppercase tracking-wider">
                    Solution {index + 1}
                  </label>
                  {isConditional && (
                    <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-500/40 px-2 py-0.5 rounded">
                      Transitive Conditional Satisfied
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  {/* Template Insert Helper */}
                  <button
                    onClick={() => insertConditionalTemplate(index)}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 bg-cyan-950/20 px-2 py-0.5 rounded flex items-center gap-1 transition-colors"
                    title="Insert Transitive Conditional Phrase Template"
                  >
                    <Lightbulb className="w-3 h-3" />
                    + Insert Conditional Pattern
                  </button>
                  <span className="text-[11px] text-zinc-500">
                    {sol.trim().length} chars
                  </span>
                </div>
              </div>

              {/* Textarea Input */}
              <textarea
                value={sol}
                onChange={(e) => handleSolutionChange(index, e.target.value)}
                placeholder={`Describe Solution ${index + 1} here... (Must be divergent, non-obvious, and adhere to VCI semantic rules)`}
                rows={3}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/80 transition-colors resize-y font-mono"
              />

              {/* Solution Footer Indicators */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  {usedVCIWords.length > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-zinc-500">VCI Words:</span>
                      {usedVCIWords.map((w) => (
                        <span
                          key={w.word}
                          className="text-[10px] text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-1.5 py-0.2 rounded"
                        >
                          {w.word}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {hasFillerInThis && (
                  <span className="text-[10px] font-bold text-rose-400 bg-rose-950/60 border border-rose-500/40 px-2 py-0.5 rounded flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Filler word detected!
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* SUBMISSION & EVALUATION TRIGGER PANEL */}
      <div className="bg-[#09090b] border border-zinc-800 rounded-xl p-5 space-y-4">
        {/* Missing Requirements Guidance */}
        {!validation.isValidForSubmission && (
          <div className="p-4 rounded-lg bg-amber-950/20 border border-amber-500/40 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <Lock className="w-4 h-4" />
              <span>SUBMISSION LOCKED — COMPLETE VCI & KVASHCHEV CONSTRAINTS</span>
            </div>
            <ul className="space-y-1 text-xs text-amber-200/80 list-disc list-inside">
              {validation.missingRequirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-zinc-400 leading-relaxed">
            Upon submission, the dual-engine evaluator will audit creativity, feasibility, abstract principles, and vocabulary contextual fit.
          </div>

          <button
            onClick={onSubmit}
            disabled={!validation.isValidForSubmission || isEvaluating}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-xl font-mono ${
              validation.isValidForSubmission && !isEvaluating
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black shadow-emerald-950/60 hover:scale-[1.02] cursor-pointer'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-60 border border-zinc-700'
            }`}
          >
            {isEvaluating ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Evaluating Cognition & Semantics...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit for Evaluation (Phase 3)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
