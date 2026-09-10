import React, { useState } from 'react';
import { TrialSession, VocabularyMasteryItem } from '../types';
import {
  BarChart3,
  Download,
  Upload,
  Trash2,
  Calendar,
  Brain,
  Zap,
  BookCheck,
  Layers,
  Search,
  ExternalLink,
  ChevronRight,
  X,
  Clock,
  Sparkles,
} from 'lucide-react';

interface DashboardViewProps {
  sessions: TrialSession[];
  vocabularyMastery: { [word: string]: VocabularyMasteryItem };
  onClearData: () => void;
  onImportData: (importedSessions: TrialSession[]) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  sessions,
  vocabularyMastery,
  onClearData,
  onImportData,
}) => {
  const [selectedSession, setSelectedSession] = useState<TrialSession | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate high-level analytics
  const totalTrials = sessions.length;
  const avgCreativity =
    totalTrials > 0
      ? Math.round(
          sessions.reduce((acc, s) => acc + s.evaluation.overallCreativity, 0) / totalTrials
        )
      : 0;
  const avgFeasibility =
    totalTrials > 0
      ? Math.round(
          sessions.reduce((acc, s) => acc + s.evaluation.overallFeasibility, 0) / totalTrials
        )
      : 0;
  const avgVCI =
    totalTrials > 0
      ? Math.round(
          sessions.reduce((acc, s) => acc + s.evaluation.overallVCIScore, 0) / totalTrials
        )
      : 0;

  // Domain breakdown
  const domainCounts = {
    physical: sessions.filter((s) => s.domain === 'physical').length,
    social: sessions.filter((s) => s.domain === 'social').length,
    resource: sessions.filter((s) => s.domain === 'resource').length,
    technical: sessions.filter((s) => s.domain === 'technical').length,
  };

  // Export JSON summary download
  const handleExportJSON = () => {
    const exportData = {
      app: 'Kvashchev-VCI Fusion Trainer',
      exportedAt: new Date().toISOString(),
      metrics: {
        totalTrials,
        avgCreativity,
        avgFeasibility,
        avgVCI,
        domainCounts,
      },
      sessions,
      vocabularyMastery,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kvashchev-vci-session-logs-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import JSON file handler
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.sessions && Array.isArray(parsed.sessions)) {
          onImportData(parsed.sessions);
          alert(`Successfully imported ${parsed.sessions.length} trial sessions!`);
        } else {
          alert('Invalid JSON schema. Could not locate "sessions" array.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const filteredSessions = sessions.filter(
    (s) =>
      s.problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.vciWords.some((w) => w.word.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 font-mono">
      {/* Top Bar with Export / Import / Actions */}
      <div className="bg-[#09090b] border border-zinc-800 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <span>Cognitive Analytics & Session Logs</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Historical tracking of divergent creativity, feasibility, and VCI vocabulary precision.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Import Button */}
          <label className="px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-zinc-600 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Import .json</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>

          {/* Export JSON Button */}
          <button
            onClick={handleExportJSON}
            disabled={sessions.length === 0}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-950/50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Logs (.json)</span>
          </button>

          {/* Clear Data */}
          {sessions.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear all stored trial sessions?')) {
                  onClearData();
                }
              }}
              className="p-2 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-400 hover:bg-rose-900/60 transition-colors"
              title="Clear Session History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* OVERVIEW STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#09090b] border border-zinc-800 space-y-1">
          <span className="text-[11px] font-bold text-zinc-500 uppercase">Total Completed Trials</span>
          <div className="text-2xl font-extrabold text-white">{totalTrials}</div>
          <span className="text-[10px] text-zinc-400">Recorded in localStorage</span>
        </div>

        <div className="p-4 rounded-xl bg-[#09090b] border border-emerald-500/30 space-y-1 glow-emerald">
          <span className="text-[11px] font-bold text-emerald-400 uppercase">Avg Creativity Score</span>
          <div className="text-2xl font-extrabold text-emerald-400">{avgCreativity}/100</div>
          <span className="text-[10px] text-zinc-400">Kvashchev Divergence</span>
        </div>

        <div className="p-4 rounded-xl bg-[#09090b] border border-cyan-500/30 space-y-1 glow-cyan">
          <span className="text-[11px] font-bold text-cyan-400 uppercase">Avg Feasibility Score</span>
          <div className="text-2xl font-extrabold text-cyan-400">{avgFeasibility}/100</div>
          <span className="text-[10px] text-zinc-400">Logical Plausibility</span>
        </div>

        <div className="p-4 rounded-xl bg-[#09090b] border border-purple-500/30 space-y-1">
          <span className="text-[11px] font-bold text-purple-400 uppercase">Avg VCI Precision Score</span>
          <div className="text-2xl font-extrabold text-purple-400">{avgVCI}/100</div>
          <span className="text-[10px] text-zinc-400">Verbal Precision</span>
        </div>
      </div>

      {/* DOMAIN COVERAGE BREAKDOWN */}
      <div className="bg-[#09090b] border border-zinc-800 rounded-xl p-5 space-y-3">
        <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
          Domain Coverage Distribution
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between">
            <span className="text-zinc-400 font-semibold">Physical</span>
            <span className="font-bold text-emerald-400">{domainCounts.physical} trials</span>
          </div>
          <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between">
            <span className="text-zinc-400 font-semibold">Social</span>
            <span className="font-bold text-cyan-400">{domainCounts.social} trials</span>
          </div>
          <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between">
            <span className="text-zinc-400 font-semibold">Resource</span>
            <span className="font-bold text-amber-400">{domainCounts.resource} trials</span>
          </div>
          <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between">
            <span className="text-zinc-400 font-semibold">Technical</span>
            <span className="font-bold text-purple-400">{domainCounts.technical} trials</span>
          </div>
        </div>
      </div>

      {/* HISTORICAL TIMELINE */}
      <div className="bg-[#09090b] border border-zinc-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            Trial Timeline ({filteredSessions.length})
          </h3>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, domain, or vocabulary..."
              className="pl-8 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 w-full sm:w-64"
            />
          </div>
        </div>

        {filteredSessions.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-xs border border-dashed border-zinc-800 rounded-lg">
            No completed trial sessions found. Complete your first exercise loop to record analytics logs!
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSessions.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedSession(s)}
                className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {s.problem.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 uppercase">
                      {s.domain} • {s.difficulty}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-1">
                    {s.problem.scenario}
                  </p>
                  <div className="flex items-center gap-1.5 pt-1">
                    {s.vciWords.map((w) => (
                      <span
                        key={w.word}
                        className="text-[10px] text-purple-300 bg-purple-950/40 border border-purple-500/30 px-1.5 py-0.2 rounded"
                      >
                        {w.word}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono shrink-0 justify-between md:justify-end border-t md:border-t-0 border-zinc-800 pt-2 md:pt-0">
                  <div className="text-right">
                    <div className="text-[10px] text-zinc-500">Creativity</div>
                    <div className="font-bold text-emerald-400">
                      {s.evaluation.overallCreativity}/100
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-zinc-500">Feasibility</div>
                    <div className="font-bold text-cyan-400">
                      {s.evaluation.overallFeasibility}/100
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-zinc-500">VCI Score</div>
                    <div className="font-bold text-purple-400">
                      {s.evaluation.overallVCIScore}/100
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SESSION DETAIL MODAL */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c0c0e] border border-zinc-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setSelectedSession(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-zinc-800 pb-3 space-y-1">
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                {selectedSession.domain} • {selectedSession.difficulty}
              </span>
              <h3 className="text-base font-bold text-white font-mono">
                {selectedSession.problem.title}
              </h3>
              <p className="text-xs text-zinc-400">
                Logged on {new Date(selectedSession.timestamp).toLocaleString()}
              </p>
            </div>

            {/* Trial Scores */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-zinc-950 border border-emerald-500/30 rounded-lg">
                <span className="text-[10px] text-zinc-400 uppercase block">Creativity</span>
                <span className="text-xl font-bold text-emerald-400">
                  {selectedSession.evaluation.overallCreativity}
                </span>
              </div>
              <div className="p-3 bg-zinc-950 border border-cyan-500/30 rounded-lg">
                <span className="text-[10px] text-zinc-400 uppercase block">Feasibility</span>
                <span className="text-xl font-bold text-cyan-400">
                  {selectedSession.evaluation.overallFeasibility}
                </span>
              </div>
              <div className="p-3 bg-zinc-950 border border-purple-500/30 rounded-lg">
                <span className="text-[10px] text-zinc-400 uppercase block">VCI Score</span>
                <span className="text-xl font-bold text-purple-400">
                  {selectedSession.evaluation.overallVCIScore}
                </span>
              </div>
            </div>

            {/* Solutions List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-zinc-300 uppercase">
                Recorded Solutions (5)
              </h4>
              {selectedSession.solutions.map((sol, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs space-y-1">
                  <span className="font-bold text-emerald-400">Solution {idx + 1}:</span>
                  <p className="text-zinc-200 leading-relaxed">{sol}</p>
                </div>
              ))}
            </div>

            {/* Reflection Notes */}
            <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
              <span className="font-bold text-amber-400 uppercase block">Metacognitive Reflections</span>
              <p className="text-zinc-300">
                <strong className="text-zinc-400">Largest Shift:</strong> {selectedSession.reflection.largestShift}
              </p>
              <p className="text-zinc-300">
                <strong className="text-zinc-400">VCI Impact:</strong> {selectedSession.reflection.vciImpact}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
