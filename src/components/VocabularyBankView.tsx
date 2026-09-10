import React, { useState } from 'react';
import { VCITargetWord, VocabularyMasteryItem } from '../types';
import { VCI_VOCABULARY_BANK, BANNED_FILLER_WORDS } from '../data/vciVocabulary';
import { BookOpen, Search, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';

interface VocabularyBankViewProps {
  vocabularyMastery: { [word: string]: VocabularyMasteryItem };
}

export const VocabularyBankView: React.FC<VocabularyBankViewProps> = ({
  vocabularyMastery,
}) => {
  const [search, setSearch] = useState('');

  const filteredWords = VCI_VOCABULARY_BANK.filter(
    (item) =>
      item.word.toLowerCase().includes(search.toLowerCase()) ||
      item.definition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="bg-[#09090b] border border-zinc-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <span>VCI Target Vocabulary Bank & Mastery</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            High-VCI target vocabulary words designed to enforce verbal precision and semantic clarity.
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search words & definitions..."
            className="pl-8 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-purple-500 w-full"
          />
        </div>
      </div>

      {/* Vocabulary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWords.map((vci) => {
          const mastery = vocabularyMastery[vci.word];
          const timesUsed = mastery ? mastery.timesUsed : 0;

          return (
            <div
              key={vci.word}
              className={`p-4 rounded-xl bg-[#09090b] border transition-all space-y-2.5 ${
                timesUsed > 0
                  ? 'border-purple-500/50 shadow-md shadow-purple-950/20'
                  : 'border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-purple-300 font-mono">
                    {vci.word}
                  </span>
                  <span className="text-[10px] uppercase text-zinc-500 font-bold px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800">
                    {vci.partOfSpeech}
                  </span>
                </div>

                {timesUsed > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 border border-purple-500/40 text-purple-300 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-purple-400" />
                    Mastered ({timesUsed}x)
                  </span>
                )}
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                {vci.definition}
              </p>

              <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 italic">
                "{vci.exampleUsage}"
              </div>
            </div>
          );
        })}
      </div>

      {/* Banned Filler Words Reference */}
      <div className="bg-[#09090b] border border-rose-500/30 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider">
            Forbidden Filler Words (Semantic Precision Gate)
          </h3>
        </div>
        <p className="text-xs text-zinc-300">
          The following informal filler words trigger real-time submission locks during the exercise loop:
        </p>
        <div className="flex flex-wrap gap-2">
          {BANNED_FILLER_WORDS.map((filler) => (
            <span
              key={filler}
              className="text-xs px-2.5 py-1 rounded bg-rose-950/40 border border-rose-500/40 text-rose-300 font-mono font-semibold"
            >
              "{filler}"
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
