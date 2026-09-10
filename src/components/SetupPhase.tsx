import React, { useState } from 'react';
import { DomainType, DifficultyTier, ProblemCard, VCITargetWord, TrialSession } from '../types';
import {
  Zap,
  Target,
  ShieldAlert,
  Sparkles,
  BookMarked,
  Cpu,
  Users,
  Box,
  Layers,
  ArrowRight,
  RefreshCw,
  Info,
  CheckCircle2,
  Brain,
  BarChart3,
  ChevronRight,
  Calendar,
} from 'lucide-react';

interface SetupPhaseProps {
  domain: DomainType;
  setDomain: (d: DomainType) => void;
  difficulty: DifficultyTier;
  setDifficulty: (d: DifficultyTier) => void;
  problem: ProblemCard | null;
  vciWords: VCITargetWord[];
  isLoading: boolean;
  onGenerate: () => void;
  onProceedToPhase2: () => void;
  useLocalFallback: boolean;
  setUseLocalFallback: (fallback: boolean) => void;
  byokKey: string;
  sessions: TrialSession[];
}

export const SetupPhase: React.FC<SetupPhaseProps> = ({
  domain,
  setDomain,
  difficulty,
  setDifficulty,
  problem,
  vciWords,
  isLoading,
  onGenerate,
  onProceedToPhase2,
  useLocalFallback,
  setUseLocalFallback,
  byokKey,
  sessions,
}) => {
  const domains: { id: DomainType; name: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'physical',
      name: 'Physical Constraints',
      icon: <Box className="w-4 h-4 text-emerald-400" />,
      desc: 'Material, hydrostatic, space-vacuum, or thermal paradoxes.',
    },
    {
      id: 'social',
      name: 'Social / Hierarchical',
      icon: <Users className="w-4 h-4 text-cyan-400" />,
      desc: 'Veto paradoxes, audit deadlocks, and sovereign treaty conflicts.',
    },
    {
      id: 'resource',
      name: 'Resource Scarcity',
      icon: <Layers className="w-4 h-4 text-amber-400" />,
      desc: 'Zero-power, limited water, or closed-loop agricultural bottlenecks.',
    },
    {
      id: 'technical',
      name: 'Technical / Abstract',
      icon: <Cpu className="w-4 h-4 text-purple-400" />,
      desc: 'Thread deadlocks, quantum dispersion, or micro-node cascades.',
    },
  ];

  const difficulties: { id: DifficultyTier; name: string; badgeColor: string }[] = [
    { id: 'beginner', name: 'Beginner', badgeColor: 'border-emerald-500/50 text-emerald-400 bg-emerald-950/20' },
    { id: 'intermediate', name: 'Intermediate', badgeColor: 'border-cyan-500/50 text-cyan-400 bg-cyan-950/20' },
    { id: 'advanced', name: 'Advanced', badgeColor: 'border-purple-500/50 text-purple-400 bg-purple-950/20' },
  ];

  return (
    <div className="space-y-6 font-mono max-w-5xl mx-auto">
      {/* CENTERED HERO LANDING VIEW */}
      <div className="flex flex-col items-center justify-center text-center py-8 md:py-10 bg-[#09090b] border border-zinc-800 rounded-2xl p-6 md:p-10 relative overflow-hidden space-y-5 shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/50 flex items-center justify-center glow-emerald shadow-2xl relative z-10">
          <Brain className="w-8 h-8 md:w-10 md:h-10 text-emerald-400" />
        </div>

        <div className="space-y-2 max-w-2xl relative z-10">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight uppercase font-mono">
            KVASHCHEV-VCI <span className="text-emerald-400">FUSION</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 font-mono leading-relaxed">
            Creative Problem-Solving & Verbal Precision Trainer.
            <br />
            Merging Kvashchev divergent scenarios with Verbal Comprehension Index (VCI) constraints.
          </p>
        </div>

        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-extrabold text-xs md:text-sm uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-emerald-950/80 transition-all hover:scale-105 cursor-pointer font-mono relative z-10 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-black" />
              <span>INITIALIZING TRIAL...</span>
            </>
          ) : (
            <>
              <span>INITIALIZE TRIAL &gt;</span>
              <Zap className="w-4 h-4 fill-black" />
            </>
          )}
        </button>
      </div>

      {/* SESSION ARCHIVES CARD */}
      <div className="bg-[#09090b] border border-zinc-800 rounded-xl p-5 space-y-3 font-mono">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
              SESSION ARCHIVES
            </h3>
          </div>
          <span className="text-[10px] text-zinc-500 font-semibold">
            {sessions.length} Recorded Trials
          </span>
        </div>

        {sessions.length === 0 ? (
          <div className="p-6 text-center text-zinc-500 text-xs border border-dashed border-zinc-800 rounded-lg font-mono">
            No trials recorded in local storage.
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.slice(0, 3).map((s) => (
              <div
                key={s.id}
                className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{s.problem.title}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-400 uppercase">
                      {s.domain}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-1">{s.problem.scenario}</p>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono shrink-0">
                  <span className="text-emerald-400 font-bold">
                    C: {s.evaluation.overallCreativity}
                  </span>
                  <span className="text-cyan-400 font-bold">
                    F: {s.evaluation.overallFeasibility}
                  </span>
                  <span className="text-purple-400 font-bold">
                    VCI: {s.evaluation.overallVCIScore}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EXERCISE CONFIGURATION PANEL */}
      <div className="bg-[#09090b] border border-zinc-800 rounded-xl p-5 md:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                PHASE 1
              </span>
              <h2 className="text-base font-bold text-white tracking-tight">
                Problem & Constraint Configuration
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Select cognitive domain and difficulty tier to initialize dual-engine mechanics.
            </p>
          </div>

          {/* Quick Mode Indicator */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-500">Engine Mode:</span>
            <span
              className={`px-2 py-1 rounded border text-xs font-bold ${
                byokKey && !useLocalFallback
                  ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                  : 'bg-cyan-950/50 border-cyan-500/40 text-cyan-300'
              }`}
            >
              {byokKey && !useLocalFallback ? 'Gemini AI Dynamic' : 'Local Fallback'}
            </span>
          </div>
        </div>

        {/* Domain Selection Grid */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
            Select Problem Domain (Engine A)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {domains.map((d) => {
              const isSelected = domain === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setDomain(d.id)}
                  className={`p-3.5 rounded-lg border text-left transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-zinc-900 border-emerald-500/70 shadow-lg glow-emerald'
                      : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 font-semibold text-xs text-white">
                      {d.icon}
                      <span>{d.name}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">{d.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
              Difficulty Tier
            </label>
            <div className="flex items-center gap-2">
              {difficulties.map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => setDifficulty(diff.id)}
                  className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-all ${
                    difficulty === diff.id
                      ? `${diff.badgeColor} font-bold shadow-md`
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {diff.name}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onGenerate}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 border border-emerald-400/30 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-200" />
                <span>Synthesizing Scenario...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-emerald-200" />
                <span>Generate Problem & VCI Constraints</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* RENDER PROBLEM CARD & VCI CONSTRAINTS */}
      {problem && (
        <div className="space-y-6">
          {/* Engine A: Kvashchev Problem Card */}
          <div className="bg-[#09090b] border border-emerald-500/40 rounded-xl p-5 md:p-6 space-y-4 relative overflow-hidden glow-emerald">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <Brain className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">
                  Engine A // Kvashchev Divergent Scenario
                </span>
              </div>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-emerald-500/30 text-emerald-300 bg-emerald-950/40">
                {problem.domain.toUpperCase()} • {problem.difficulty.toUpperCase()}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white tracking-tight">
              {problem.title}
            </h3>

            {/* Scenario Description */}
            <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 text-xs leading-relaxed text-zinc-200">
              <p>{problem.scenario}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Core Constraint */}
              <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <Target className="w-4 h-4" />
                  <span>THE CORE CONSTRAINT</span>
                </div>
                <p className="text-xs text-emerald-200/90 leading-relaxed font-semibold">
                  {problem.coreConstraint}
                </p>
              </div>

              {/* Obvious Traps */}
              <div className="p-4 rounded-lg bg-rose-950/20 border border-rose-500/30 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
                  <ShieldAlert className="w-4 h-4" />
                  <span>THE OBVIOUS TRAPS (WON'T WORK)</span>
                </div>
                <ul className="space-y-1 text-xs text-rose-200/80 list-disc list-inside">
                  {problem.obviousTraps.map((trap, i) => (
                    <li key={i}>{trap}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Engine B: VCI Constraint Engine */}
          <div className="bg-[#09090b] border border-cyan-500/40 rounded-xl p-5 md:p-6 space-y-4 glow-cyan">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <BookMarked className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase">
                  Engine B // VCI Linguistic Constraints
                </span>
              </div>
              <span className="text-[11px] text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
                3 Mandatory Vocabulary Target Words
              </span>
            </div>

            {/* Mandatory Vocabulary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {vciWords.map((vci, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-zinc-950 border border-cyan-500/30 space-y-1.5 hover:border-cyan-400 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-cyan-300 font-mono">
                      {vci.word}
                    </span>
                    <span className="text-[10px] uppercase text-cyan-500/80 font-bold px-1.5 py-0.2 rounded bg-cyan-950">
                      {vci.partOfSpeech}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-normal">
                    {vci.definition}
                  </p>
                  <p className="text-[10px] text-zinc-500 italic border-t border-zinc-800/80 pt-1">
                    "{vci.exampleUsage}"
                  </p>
                </div>
              ))}
            </div>

            {/* Phrasing & Formatting Rules */}
            <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800/80 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                <Info className="w-4 h-4" />
                <span>STRUCTURAL PHRASING REQUIREMENT</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                At least <strong className="text-cyan-300">2 of your 5 solutions</strong> must be structured as formal transitive conditionals:
              </p>
              <div className="p-2.5 rounded bg-zinc-900 border border-cyan-500/20 font-mono text-xs text-cyan-300 font-semibold">
                "If [Mechanism A] undergoes [Transform X], then [Constraint B] is bypassed because..."
              </div>
              <p className="text-[11px] text-zinc-400">
                Avoid filler words (<span className="text-rose-400">thing, stuff, basically, like</span>).
              </p>
            </div>
          </div>

          {/* Action Button: Proceed to Solution Generation */}
          <div className="flex justify-end pt-2">
            <button
              onClick={onProceedToPhase2}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-emerald-950/40 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Begin Solution Generation (Phase 2)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

