import React, { useState } from 'react';
import { ActiveTab } from '../types';
import {
  Brain,
  MessageSquare,
  Key,
  BarChart3,
  BookOpen,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Flame,
  Check,
  X,
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  byokKey: string;
  setByokKey: (key: string) => void;
  useLocalFallback: boolean;
  setUseLocalFallback: (fallback: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  byokKey,
  setByokKey,
  useLocalFallback,
  setUseLocalFallback,
}) => {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKeyInput, setTempKeyInput] = useState(byokKey);

  const handleSaveKey = () => {
    const trimmed = tempKeyInput.trim();
    setByokKey(trimmed);
    localStorage.setItem('gemini-api-key', trimmed);
    localStorage.setItem('kv_vci_gemini_api_key', trimmed);
    setShowKeyModal(false);
  };

  const handleClearKey = () => {
    setByokKey('');
    setTempKeyInput('');
    localStorage.removeItem('gemini-api-key');
    localStorage.removeItem('kv_vci_gemini_api_key');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-md border-b border-zinc-800/80 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Brand & App Title */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('exercise')}>
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center glow-emerald">
                <Brain className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-white text-base tracking-tight leading-none font-mono">
                    KVASHCHEV-VCI <span className="text-emerald-400">FUSION</span>
                  </h1>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 border border-emerald-500/30">
                    v1.2.0-FUSION
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                  Creative Problem-Solving & Verbal Precision Trainer
                </p>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 md:hidden">
              <a
                href="https://discord.gg/cognition"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-md bg-indigo-950/40 border border-indigo-500/30 text-indigo-400 hover:text-indigo-300 hover:border-indigo-500 transition-all text-xs flex items-center gap-1"
                title="Join Discord Community"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <button
                onClick={() => setShowKeyModal(true)}
                className={`p-2 rounded-md text-xs border flex items-center gap-1 font-mono transition-all ${
                  byokKey
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-300'
                }`}
              >
                <Key className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Bar Tabs */}
          <nav className="flex items-center gap-1.5 bg-zinc-950/80 p-1 rounded-lg border border-zinc-800/80 w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('exercise')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'exercise'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              Exercise Loop
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Analytics & Logs
            </button>

            <button
              onClick={() => setActiveTab('vocabulary')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'vocabulary'
                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Vocabulary Bank
            </button>

            <button
              onClick={() => setActiveTab('methodology')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'methodology'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Methodology
            </button>
          </nav>

          {/* Right Header Controls (Desktop) */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Join Discord Link */}
            <a
              href="https://discord.gg/brain"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-md bg-indigo-950/40 border border-indigo-500/40 text-indigo-300 hover:text-white hover:border-indigo-400 transition-all text-xs font-mono flex items-center gap-1.5 group"
            >
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span>Join Discord</span>
              <ExternalLink className="w-3 h-3 text-indigo-400/70" />
            </a>

            {/* BYOK Settings Trigger */}
            <button
              onClick={() => {
                setTempKeyInput(byokKey);
                setShowKeyModal(true);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-mono border flex items-center gap-2 transition-all ${
                byokKey
                  ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-400 hover:bg-emerald-900/40'
                  : useLocalFallback
                  ? 'bg-cyan-950/30 border-cyan-500/50 text-cyan-400 hover:bg-cyan-900/40'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-600'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>
                {byokKey
                  ? 'BYOK Active'
                  : useLocalFallback
                  ? 'Local Mode'
                  : 'API Key Config'}
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  byokKey ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* BYOK / Key Settings Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c0c0e] border border-zinc-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setShowKeyModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-mono">
                  Gemini API Key (BYOK)
                </h3>
                <p className="text-xs text-zinc-400 font-mono">
                  Bring Your Own Key for dynamic AI generation & evaluation
                </p>
              </div>
            </div>

            <div className="space-y-3 font-mono">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Gemini API Key
                </label>
                <input
                  type="password"
                  value={tempKeyInput}
                  onChange={(e) => setTempKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  Key is saved locally in your browser storage (`localStorage`).
                </p>
              </div>

              {/* Mode Selection */}
              <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-300">
                    Manual / Local Fallback Mode
                  </span>
                  <input
                    type="checkbox"
                    checked={useLocalFallback}
                    onChange={(e) => setUseLocalFallback(e.target.checked)}
                    className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  When enabled, uses high-quality pre-built problem templates and local cognitive evaluation heuristics without sending requests to external APIs.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-800 font-mono">
              {byokKey ? (
                <button
                  onClick={handleClearKey}
                  className="px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 border border-rose-500/30 rounded-md bg-rose-950/20 hover:bg-rose-950/40 transition-colors"
                >
                  Remove Key
                </button>
              ) : (
                <span className="text-[11px] text-zinc-500">No key saved</span>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowKeyModal(false)}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveKey}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-950/50 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save & Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
