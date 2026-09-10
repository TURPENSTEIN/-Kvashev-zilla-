import React, { useState } from 'react';
import { TrialSession, ProblemCard, VCITargetWord, EvaluationResult } from '../types';
import {
  Sparkles,
  HelpCircle,
  Save,
  CheckCircle,
  Brain,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';

interface ReflectionPhaseProps {
  problem: ProblemCard;
  vciWords: VCITargetWord[];
  solutions: string[];
  evaluation: EvaluationResult;
  onCompleteSession: (reflection: { largestShift: string; vciImpact: string }) => void;
}

export const ReflectionPhase: React.FC<ReflectionPhaseProps> = ({
  problem,
  vciWords,
  solutions,
  evaluation,
  onCompleteSession,
}) => {
  const [largestShift, setLargestShift] = useState('');
  const [vciImpact, setVciImpact] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCompleteSession({
      largestShift: largestShift.trim() || 'No explicit largest shift noted.',
      vciImpact: vciImpact.trim() || 'VCI constraints enforced higher verbal rigor.',
    });
  };

  return (
    <div className="space-y-6 font-mono max-w-4xl mx-auto">
      <div className="bg-[#09090b] border border-zinc-800 rounded-xl p-5 md:p-6 space-y-5">
        <div className="flex items-center gap-2 pb-4 border-b border-zinc-800/80">
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            PHASE 4
          </span>
          <h2 className="text-base font-bold text-white tracking-tight">
            Metacognition & Reflective Synthesis
          </h2>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed">
          Metacognitive reflection consolidates divergent cognitive patterns and reinforces vocabulary integration into long-term working memory schema.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Question 1 */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
            <label className="text-xs font-bold text-emerald-400 block flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span>
                1. Which solution required the largest shift away from your default thinking pattern?
              </span>
            </label>
            <textarea
              value={largestShift}
              onChange={(e) => setLargestShift(e.target.value)}
              placeholder="Reflect on which mechanism or concept required unlearning standard heuristic assumptions..."
              rows={3}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
            />
          </div>

          {/* Question 2 */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
            <label className="text-xs font-bold text-cyan-400 block flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>
                2. How did the VCI constraints alter your initial problem-solving flow?
              </span>
            </label>
            <textarea
              value={vciImpact}
              onChange={(e) => setVciImpact(e.target.value)}
              placeholder="Describe how incorporating mandatory target vocabulary and transitive conditional syntax influenced your conceptualization..."
              rows={3}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
            />
          </div>

          {/* Action Submit */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-emerald-950/40 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Complete Trial & Save to Analytics</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
