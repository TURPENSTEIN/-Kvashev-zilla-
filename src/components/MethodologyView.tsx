import React from 'react';
import { Brain, Sparkles, Target, BookMarked, Cpu, Zap, ShieldCheck } from 'lucide-react';

export const MethodologyView: React.FC = () => {
  return (
    <div className="space-y-6 font-mono max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-[#09090b] border border-zinc-800 rounded-xl p-5 md:p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold text-white tracking-tight">
            Cognitive Science Methodology: Kvashchev + VCI Fusion
          </h2>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          Understanding the psychometric principles behind merging divergent problem-solving with linguistic precision constraints.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Engine A Methodology */}
        <div className="bg-[#09090b] border border-emerald-500/30 rounded-xl p-5 space-y-4 glow-emerald">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Brain className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
              Engine A: Kvashchev Divergent Method
            </h3>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed">
            In psychological testing, divergent thinking measures the ability to generate multiple, non-obvious solutions to an open problem. Kvashchev's method specifically introduces:
          </p>

          <ul className="space-y-2 text-xs text-zinc-300 list-disc list-inside">
            <li>
              <strong className="text-white">Paradoxical Scenarios:</strong> Problems where standard physical or social actions cause immediate failure.
            </li>
            <li>
              <strong className="text-white">Explicit Trap Blocking:</strong> Pre-identifying obvious "trap" approaches forces the mind off default heuristic tracks.
            </li>
            <li>
              <strong className="text-white">Abstract Principle Categorization:</strong> Mapping solutions to fundamental principles (Inversion, Spatialization, Subsystem Decoupling).
            </li>
          </ul>
        </div>

        {/* Engine B Methodology */}
        <div className="bg-[#09090b] border border-cyan-500/30 rounded-xl p-5 space-y-4 glow-cyan">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <BookMarked className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">
              Engine B: VCI Semantic Constraints
            </h3>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed">
            The Verbal Comprehension Index (VCI) measures verbal reasoning, vocabulary depth, and semantic precision. To prevent vague "hand-waving" answers, the trainer enforces:
          </p>

          <ul className="space-y-2 text-xs text-zinc-300 list-disc list-inside">
            <li>
              <strong className="text-white">Mandatory High-VCI Vocabulary:</strong> Injecting targeted words forces working memory to synthesize abstract mechanisms.
            </li>
            <li>
              <strong className="text-white">Zero Filler Words:</strong> Eliminating vague qualifiers ("stuff", "basically", "like") sharpens clarity.
            </li>
            <li>
              <strong className="text-white">Formal Transitive Conditionals:</strong> Structuring solutions as <em className="text-cyan-300">"If [A] undergoes [X], then [B] is bypassed because..."</em> enforces rigorous causal reasoning.
            </li>
          </ul>
        </div>
      </div>

      {/* Gameplay Loop Flowcard */}
      <div className="bg-[#09090b] border border-zinc-800 rounded-xl p-5 space-y-4">
        <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
          The 4-Phase Cognitive Training Loop
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
            <span className="font-bold text-emerald-400 block">Phase 1: Reveal</span>
            <p className="text-zinc-400 text-[11px]">
              Review paradoxical problem card, core constraint, traps, and VCI target vocabulary.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
            <span className="font-bold text-cyan-400 block">Phase 2: Generate</span>
            <p className="text-zinc-400 text-[11px]">
              Formulate 5 distinct solutions guided by the real-time VCI Validator HUD.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
            <span className="font-bold text-purple-400 block">Phase 3: Evaluate</span>
            <p className="text-zinc-400 text-[11px]">
              Audit creativity, feasibility, abstract principles, and vocabulary context accuracy.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
            <span className="font-bold text-amber-400 block">Phase 4: Reflect</span>
            <p className="text-zinc-400 text-[11px]">
              Engage metacognitive analysis and persist trial logs to local analytics storage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
