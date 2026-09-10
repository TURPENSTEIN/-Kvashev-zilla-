import React, { useState, useEffect, useMemo } from 'react';
import {
  ActiveTab,
  GamePhase,
  DomainType,
  DifficultyTier,
  ProblemCard,
  VCITargetWord,
  EvaluationResult,
  TrialSession,
  VocabularyMasteryItem,
} from './types';
import { Header } from './components/Header';
import { SetupPhase } from './components/SetupPhase';
import { SolutionPhase } from './components/SolutionPhase';
import { EvaluationPhase } from './components/EvaluationPhase';
import { ReflectionPhase } from './components/ReflectionPhase';
import { DashboardView } from './components/DashboardView';
import { VocabularyBankView } from './components/VocabularyBankView';
import { MethodologyView } from './components/MethodologyView';
import {
  fetchProblemAndVocabulary,
  evaluateUserSolutions,
  validateSolutions,
} from './services/geminiService';

export default function App() {
  // Navigation & BYOK state
  const [activeTab, setActiveTab] = useState<ActiveTab>('exercise');
  const [byokKey, setByokKey] = useState<string>(() => {
    return localStorage.getItem('gemini-api-key') || localStorage.getItem('kv_vci_gemini_api_key') || '';
  });
  const [useLocalFallback, setUseLocalFallback] = useState<boolean>(false);

  // Gameplay state
  const [gamePhase, setGamePhase] = useState<GamePhase>(1);
  const [domain, setDomain] = useState<DomainType>('physical');
  const [difficulty, setDifficulty] = useState<DifficultyTier>('intermediate');

  const [problem, setProblem] = useState<ProblemCard | null>(null);
  const [vciWords, setVciWords] = useState<VCITargetWord[]>([]);
  const [solutions, setSolutions] = useState<string[]>(['', '', '', '', '']);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  // Persistence state
  const [sessions, setSessions] = useState<TrialSession[]>(() => {
    try {
      const saved = localStorage.getItem('kv_vci_sessions');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [vocabularyMastery, setVocabularyMastery] = useState<{
    [word: string]: VocabularyMasteryItem;
  }>(() => {
    try {
      const saved = localStorage.getItem('kv_vci_vocab_mastery');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Calculate live validation status
  const validation = useMemo(() => {
    return validateSolutions(solutions, vciWords);
  }, [solutions, vciWords]);

  // Initial problem generation on mount
  useEffect(() => {
    handleGenerateProblem();
  }, []);

  // Save sessions to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem('kv_vci_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Save vocabulary mastery to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem('kv_vci_vocab_mastery', JSON.stringify(vocabularyMastery));
  }, [vocabularyMastery]);

  const handleGenerateProblem = async () => {
    setIsLoading(true);
    try {
      const { problem: newProb, vciWords: newWords } =
        await fetchProblemAndVocabulary(domain, difficulty, byokKey, useLocalFallback);
      setProblem(newProb);
      setVciWords(newWords);
      setSolutions(['', '', '', '', '']);
      setEvaluation(null);
      setGamePhase(1);
    } catch (err) {
      console.error('Failed to generate problem:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEvaluateSolutions = async () => {
    if (!problem || !validation.isValidForSubmission) return;

    setIsEvaluating(true);
    try {
      const evalResult = await evaluateUserSolutions(
        problem,
        vciWords,
        solutions,
        byokKey,
        useLocalFallback
      );
      setEvaluation(evalResult);
      setGamePhase(3);
    } catch (err) {
      console.error('Failed to evaluate solutions:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleCompleteSession = (reflection: {
    largestShift: string;
    vciImpact: string;
  }) => {
    if (!problem || !evaluation) return;

    const newSession: TrialSession = {
      id: `session-${Date.now()}`,
      timestamp: Date.now(),
      domain,
      difficulty,
      problem,
      vciWords,
      solutions,
      evaluation,
      reflection,
    };

    setSessions((prev) => [newSession, ...prev]);

    // Update vocabulary mastery records
    setVocabularyMastery((prev) => {
      const updated = { ...prev };
      vciWords.forEach((vci) => {
        const wordKey = vci.word;
        const existing = updated[wordKey] || {
          word: vci.word,
          definition: vci.definition,
          partOfSpeech: vci.partOfSpeech,
          exampleUsage: vci.exampleUsage,
          timesUsed: 0,
          accurateCount: 0,
          lastUsedTimestamp: Date.now(),
        };

        const wordEval = evaluation.vciAudit.wordsEvaluation.find(
          (we) => we.word.toLowerCase() === vci.word.toLowerCase()
        );

        updated[wordKey] = {
          ...existing,
          timesUsed: existing.timesUsed + 1,
          accurateCount: wordEval?.accurate
            ? existing.accurateCount + 1
            : existing.accurateCount,
          lastUsedTimestamp: Date.now(),
        };
      });
      return updated;
    });

    // Reset loop back to Phase 1 and prepare next exercise
    handleGenerateProblem();
    setActiveTab('dashboard');
  };

  const handleClearAllData = () => {
    setSessions([]);
    setVocabularyMastery({});
    localStorage.removeItem('kv_vci_sessions');
    localStorage.removeItem('kv_vci_vocab_mastery');
  };

  const handleImportSessions = (imported: TrialSession[]) => {
    setSessions((prev) => [...imported, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 flex flex-col font-mono selection:bg-emerald-500/30 selection:text-emerald-300">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        byokKey={byokKey}
        setByokKey={setByokKey}
        useLocalFallback={useLocalFallback}
        setUseLocalFallback={setUseLocalFallback}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        {/* TAB 1: EXERCISE LOOP */}
        {activeTab === 'exercise' && (
          <div className="space-y-6">
            {/* Phase Stepper Bar */}
            <div className="bg-[#09090b] border border-zinc-800 rounded-xl p-3 flex items-center justify-between text-xs font-mono overflow-x-auto">
              {[
                { phase: 1, title: '1. Problem Reveal' },
                { phase: 2, title: '2. Solution Generation' },
                { phase: 3, title: '3. Dual-Engine Audit' },
                { phase: 4, title: '4. Metacognition' },
              ].map((step) => {
                const isActive = gamePhase === step.phase;
                const isPassed = gamePhase > step.phase;
                return (
                  <div
                    key={step.phase}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 font-bold'
                        : isPassed
                        ? 'text-cyan-400 font-semibold'
                        : 'text-zinc-500'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                        isActive
                          ? 'bg-emerald-500 text-black'
                          : isPassed
                          ? 'bg-cyan-900 text-cyan-300'
                          : 'bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      {step.phase}
                    </span>
                    <span>{step.title}</span>
                  </div>
                );
              })}
            </div>

            {/* PHASE 1: REVEAL */}
            {gamePhase === 1 && (
              <SetupPhase
                domain={domain}
                setDomain={setDomain}
                difficulty={difficulty}
                setDifficulty={setDifficulty}
                problem={problem}
                vciWords={vciWords}
                isLoading={isLoading}
                onGenerate={handleGenerateProblem}
                onProceedToPhase2={() => setGamePhase(2)}
                useLocalFallback={useLocalFallback}
                setUseLocalFallback={setUseLocalFallback}
                byokKey={byokKey}
                sessions={sessions}
              />
            )}

            {/* PHASE 2: SOLUTION GENERATION */}
            {gamePhase === 2 && problem && (
              <SolutionPhase
                problem={problem}
                vciWords={vciWords}
                solutions={solutions}
                setSolutions={setSolutions}
                validation={validation}
                onSubmit={handleEvaluateSolutions}
                isEvaluating={isEvaluating}
                onBackToPhase1={() => setGamePhase(1)}
              />
            )}

            {/* PHASE 3: EVALUATION & AUDIT */}
            {gamePhase === 3 && problem && evaluation && (
              <EvaluationPhase
                problem={problem}
                vciWords={vciWords}
                solutions={solutions}
                evaluation={evaluation}
                onProceedToPhase4={() => setGamePhase(4)}
              />
            )}

            {/* PHASE 4: METACOGNITION & REFLECTION */}
            {gamePhase === 4 && problem && evaluation && (
              <ReflectionPhase
                problem={problem}
                vciWords={vciWords}
                solutions={solutions}
                evaluation={evaluation}
                onCompleteSession={handleCompleteSession}
              />
            )}
          </div>
        )}

        {/* TAB 2: DASHBOARD & ANALYTICS */}
        {activeTab === 'dashboard' && (
          <DashboardView
            sessions={sessions}
            vocabularyMastery={vocabularyMastery}
            onClearData={handleClearAllData}
            onImportData={handleImportSessions}
          />
        )}

        {/* TAB 3: VOCABULARY BANK */}
        {activeTab === 'vocabulary' && (
          <VocabularyBankView vocabularyMastery={vocabularyMastery} />
        )}

        {/* TAB 4: METHODOLOGY */}
        {activeTab === 'methodology' && <MethodologyView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-[#050505] py-4 text-center text-xs text-zinc-500 font-mono">
        <p>
          Kvashchev-VCI Fusion • Creative Problem-Solving & Verbal Precision Trainer
        </p>
      </footer>
    </div>
  );
}
