import React from 'react';
import { EvaluationResult, ProblemCard, VCITargetWord } from '../types';
import {
  Brain,
  CheckCircle2,
  Award,
  BarChart,
  Lightbulb,
  BookCheck,
  AlertCircle,
  ArrowRight,
  Zap,
  Layers,
  Sparkles,
} from 'lucide-react';

interface EvaluationPhaseProps {
  problem: ProblemCard;
  vciWords: VCITargetWord[];
  solutions: string[];
  evaluation: EvaluationResult;
  onProceedToPhase4: () => void;
}

export const EvaluationPhase: React.FC<EvaluationPhaseProps> = ({
  problem,
  vciWords,
  solutions,
  evaluation,
  onProceedToPhase4,
}) => {
  return (
    <div className="space-y-6 font-mono">
      {/* Header & Overall Metric Highlights */}
      <div className="bg-[#09090b] border border-zinc-800 rounded-xl p-5 md:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                PHASE 3
              </span>
              <h2 className="text-base font-bold text-white tracking-tight">
                Dual-Engine Cognitive & Semantic Audit
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Analysis of Kvashchev divergent creativity and VCI verbal precision.
            </p>
          </div>
        </div>

        {/* Evaluator Executive Summary Banner */}
        <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/40 text-xs text-emerald-200 leading-relaxed">
          <span className="font-bold text-emerald-400 uppercase tracking-wider block mb-1">
            EVALUATOR SYNTHESIS:
          </span>
          {evaluation.evaluatorSummary}
        </div>

        {/* 3 Main Score Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 1. Overall Creativity */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-emerald-500/40 space-y-2 glow-emerald">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 uppercase">
                Kvashchev Creativity
              </span>
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-400">
                {evaluation.overallCreativity}
              </span>
              <span className="text-xs text-zinc-500">/ 100</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden">
              <div
                className="h-full bg-emerald-400"
                style={{ width: `${evaluation.overallCreativity}%` }}
              />
            </div>
          </div>

          {/* 2. Overall Feasibility */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-cyan-500/40 space-y-2 glow-cyan">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 uppercase">
                Feasibility & Plausibility
              </span>
              <BarChart className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-cyan-400">
                {evaluation.overallFeasibility}
              </span>
              <span className="text-xs text-zinc-500">/ 100</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden">
              <div
                className="h-full bg-cyan-400"
                style={{ width: `${evaluation.overallFeasibility}%` }}
              />
            </div>
          </div>

          {/* 3. Overall VCI Score */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-purple-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 uppercase">
                VCI Semantic Precision
              </span>
              <BookCheck className="w-4 h-4 text-purple-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-purple-400">
                {evaluation.overallVCIScore}
              </span>
              <span className="text-xs text-zinc-500">/ 100</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden">
              <div
                className="h-full bg-purple-400"
                style={{ width: `${evaluation.overallVCIScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* INDIVIDUAL SOLUTIONS AUDIT */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <Brain className="w-4 h-4 text-emerald-400" />
          <span>Individual Solutions Breakdown & Abstract Principles</span>
        </h3>

        {evaluation.solutions.map((sol, idx) => (
          <div
            key={idx}
            className="bg-[#09090b] border border-zinc-800 rounded-xl p-4 md:p-5 space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-center">
                  {sol.index}
                </span>
                <span className="text-xs font-bold text-white uppercase">
                  Solution {sol.index} Audit
                </span>
                {sol.hasTransitiveConditional && (
                  <span className="text-[10px] text-cyan-400 bg-cyan-950/50 border border-cyan-500/30 px-1.5 py-0.2 rounded font-bold">
                    Conditional Formatted
                  </span>
                )}
              </div>

              {/* Individual Scores */}
              <div className="flex items-center gap-3 text-xs">
                <span className="text-emerald-400 font-bold">
                  Creativity: {sol.creativityScore}/100
                </span>
                <span className="text-cyan-400 font-bold">
                  Feasibility: {sol.feasibilityScore}/100
                </span>
                <span className="text-purple-400 font-bold">
                  VCI Fit: {sol.vciAccuracyScore}/100
                </span>
              </div>
            </div>

            {/* Solution Text */}
            <p className="text-xs text-zinc-200 p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 leading-relaxed font-mono">
              "{sol.solutionText}"
            </p>

            {/* Abstract Principles & VCI Feedback */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  ABSTRACT PRINCIPLES IDENTIFIED:
                </span>
                <div className="flex flex-wrap gap-1">
                  {sol.abstractPrinciples.map((principle, pIdx) => (
                    <span
                      key={pIdx}
                      className="text-[11px] px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-semibold"
                    >
                      {principle}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
                  VCI SEMANTIC FEEDBACK:
                </span>
                <p className="text-[11px] text-zinc-300 leading-snug">
                  {sol.vciFeedback}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ALTERNATIVE UNCONVENTIONAL SOLUTIONS (AI Generated) */}
      <div className="bg-[#09090b] border border-cyan-500/40 rounded-xl p-5 space-y-4 glow-cyan">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <Lightbulb className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Alternative Unconventional Approaches (Missed Angles)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evaluation.alternativeSolutions.map((alt, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-zinc-950 border border-cyan-500/30 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300">
                  Alternative {idx + 1}: {alt.title}
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {alt.mechanism}
              </p>
              <div className="pt-1">
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-400 font-semibold">
                  Principle: {alt.abstractPrinciple}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VCI VOCABULARY AUDIT DETAILS */}
      <div className="bg-[#09090b] border border-zinc-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <BookCheck className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            VCI Precision Vocabulary Audit
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {evaluation.vciAudit.wordsEvaluation.map((we, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 font-mono">
                  {we.word}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                    we.accurate
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                      : 'bg-rose-950 text-rose-400 border-rose-500/40'
                  }`}
                >
                  {we.accurate ? 'Accurate' : 'Inaccurate / Omitted'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-snug">
                {we.feedback}
              </p>
            </div>
          ))}
        </div>

        {/* Ambiguity Alerts */}
        {evaluation.vciAudit.semanticAmbiguityAlerts.length > 0 && (
          <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
              SEMANTIC AMBIGUITY ALERTS:
            </span>
            <ul className="space-y-1 text-xs text-zinc-300 list-disc list-inside">
              {evaluation.vciAudit.semanticAmbiguityAlerts.map((alert, idx) => (
                <li key={idx}>{alert}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action Button: Proceed to Phase 4 */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onProceedToPhase4}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-emerald-950/40 transition-all hover:scale-[1.02]"
        >
          <span>Proceed to Metacognition & Reflection (Phase 4)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
