import { useState, useEffect } from 'react';
import { Problem, VciConstraints, OverallEvaluation, SessionData, SolutionEvaluation } from './types';
import { DOMAINS, DIFFICULTIES, BANNED_FILLER_WORDS, getRandomVciWords, getFallbackProblem } from './data';
import { checkConstraints } from './utils';
import { Brain, Settings, Play, ChevronRight, Check, FileJson, RefreshCw, X, AlertTriangle, ShieldAlert, Cpu, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type AppPhase = 'DASHBOARD' | 'SETUP' | 'GENERATION' | 'EVALUATION' | 'METACOGNITION' | 'SUMMARY';

export default function App() {
  const [phase, setPhase] = useState<AppPhase>('DASHBOARD');
  const [engineMode, setEngineMode] = useState<'LOCAL' | 'AI'>('AI');
  const [domain, setDomain] = useState(DOMAINS[0]);
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[0]);
  
  const [problem, setProblem] = useState<Problem | null>(null);
  const [vciConstraints, setVciConstraints] = useState<VciConstraints | null>(null);
  const [solutions, setSolutions] = useState<string[]>(['', '', '', '', '']);
  
  const [evaluation, setEvaluation] = useState<OverallEvaluation | null>(null);
  const [metaQ1, setMetaQ1] = useState('');
  const [metaQ2, setMetaQ2] = useState('');
  
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('kvashchev-sessions');
    if (saved) setSessions(JSON.parse(saved));
  }, []);

  const saveSession = (session: SessionData) => {
    const updated = [session, ...sessions];
    setSessions(updated);
    localStorage.setItem('kvashchev-sessions', JSON.stringify(updated));
  };

  const handleStartSetup = () => {
    setPhase('SETUP');
    setProblem(null);
    setVciConstraints(null);
    setSolutions(['', '', '', '', '']);
    setEvaluation(null);
    setMetaQ1('');
    setMetaQ2('');
    setError(null);
  };

  const handleGenerateProblem = async () => {
    setLoading(true);
    setError(null);
    try {
      let nextProblem: Problem;
      if (engineMode === 'AI') {
        const res = await fetch('/api/generate-problem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain, difficulty })
        });
        if (!res.ok) throw new Error('API failed to generate problem.');
        nextProblem = await res.json();
      } else {
        nextProblem = getFallbackProblem(domain, difficulty);
      }
      
      setProblem(nextProblem);
      setVciConstraints({
        mandatoryWords: getRandomVciWords(3),
        bannedWords: BANNED_FILLER_WORDS
      });
      setPhase('GENERATION');
    } catch (err: any) {
      setError(err.message || 'Failed to generate problem.');
    } finally {
      setLoading(false);
    }
  };

  const hudStatus = vciConstraints ? checkConstraints(solutions, vciConstraints) : null;

  const handleSubmitSolutions = async () => {
    if (!hudStatus?.ready) return;
    setLoading(true);
    setError(null);
    
    try {
      if (engineMode === 'AI') {
        const res = await fetch('/api/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ problem, solutions, vciConstraints })
        });
        if (!res.ok) throw new Error('API failed to evaluate solutions.');
        const data = await res.json();
        setEvaluation(data);
      } else {
        // Mock Evaluation
        setEvaluation({
          solutionEvals: solutions.map(() => ({
            creativity: { score: Math.floor(Math.random() * 40 + 60), feedback: 'Local mock feedback: creative approach.' },
            feasibility: { score: Math.floor(Math.random() * 40 + 60), feedback: 'Local mock feedback: logically viable.' },
            abstractPrinciples: ['Remote Concept Combination']
          })),
          missedUnconventionalSolutions: ['Mock unconventional solution 1', 'Mock unconventional solution 2'],
          vciPrecisionScore: Math.floor(Math.random() * 20 + 80),
          vciFeedback: 'Local mock feedback: Excellent use of mandatory vocabulary with strict adherence to conditional structuring.'
        });
      }
      setPhase('EVALUATION');
    } catch (err: any) {
      setError(err.message || 'Failed to evaluate solutions.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinishSession = () => {
    if (!problem || !vciConstraints || !evaluation) return;
    const sessionData: SessionData = {
      id: 'sess-' + Date.now(),
      date: new Date().toISOString(),
      domain,
      difficulty,
      problem,
      vciConstraints,
      solutions,
      evaluation,
      metacognition: { q1: metaQ1, q2: metaQ2 }
    };
    saveSession(sessionData);
    setPhase('SUMMARY');
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sessions, null, 2));
    const a = document.createElement('a');
    a.setAttribute("href", dataStr);
    a.setAttribute("download", "kvashchev-sessions.json");
    a.click();
  };

  const renderDashboard = () => (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-white mb-4 tracking-tight uppercase flex items-center justify-center gap-3">
          <Brain className="w-10 h-10 text-emerald-500" />
          Kvashchev-VCI Fusion
        </h1>
        <p className="text-gray-400 font-mono text-lg max-w-2xl mx-auto">
          Creative Problem-Solving & Verbal Precision Trainer. 
          Merge divergent ideation with extreme semantic constraints.
        </p>
      </div>
      
      <div className="flex justify-center mb-16">
        <button 
          onClick={handleStartSetup}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-sm font-bold tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center gap-2"
        >
          Initialize Trial <Play className="w-5 h-5" />
        </button>
      </div>

      <div className="border border-emerald-900/50 bg-[#0a0a0a] rounded-sm p-6">
        <div className="flex justify-between items-center border-b border-emerald-900/50 pb-4 mb-4">
          <h2 className="text-xl text-emerald-400 font-bold uppercase tracking-wider">Session Archives</h2>
          {sessions.length > 0 && (
            <button onClick={exportData} className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-2">
              <Download className="w-4 h-4" /> Export JSON
            </button>
          )}
        </div>
        
        {sessions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No trials recorded in local storage.</p>
        ) : (
          <div className="space-y-4">
            {sessions.map(s => (
              <div key={s.id} className="p-4 bg-[#121212] border border-gray-800 flex justify-between items-center group hover:border-emerald-900 transition-colors">
                <div>
                  <div className="text-white font-bold">{s.domain} <span className="text-gray-500 text-sm font-normal">({s.difficulty})</span></div>
                  <div className="text-sm text-gray-400 mt-1">{new Date(s.date).toLocaleDateString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-cyan-400 text-sm">VCI: {s.evaluation?.vciPrecisionScore}</div>
                  <div className="text-emerald-400 text-sm">
                    Avg Creative: {Math.round(s.evaluation?.solutionEvals.reduce((a,b)=>a+b.creativity.score,0)! / 5)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderSetup = () => (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <div className="flex items-center gap-4 mb-10 border-b border-gray-800 pb-6">
        <Settings className="w-8 h-8 text-cyan-500" />
        <h2 className="text-2xl font-bold uppercase tracking-widest text-white">Configure Engine</h2>
      </div>

      <div className="space-y-8">
        <div>
          <label className="block text-emerald-400 text-sm font-bold uppercase tracking-wider mb-3">Operating Mode</label>
          <div className="flex gap-4">
            <button 
              onClick={() => setEngineMode('AI')}
              className={`flex-1 py-4 border ${engineMode === 'AI' ? 'border-cyan-500 bg-cyan-900/20 text-cyan-400' : 'border-gray-800 text-gray-500 hover:border-gray-600'} transition-all`}
            >
              Gemini AI Engine
            </button>
            <button 
              onClick={() => setEngineMode('LOCAL')}
              className={`flex-1 py-4 border ${engineMode === 'LOCAL' ? 'border-emerald-500 bg-emerald-900/20 text-emerald-400' : 'border-gray-800 text-gray-500 hover:border-gray-600'} transition-all`}
            >
              Local Fallback Templates
            </button>
          </div>
          {engineMode === 'AI' && <p className="text-xs text-gray-500 mt-2">Requires server-side GEMINI_API_KEY to be configured.</p>}
        </div>

        <div>
          <label className="block text-emerald-400 text-sm font-bold uppercase tracking-wider mb-3">Domain Constraint</label>
          <div className="grid grid-cols-2 gap-3">
            {DOMAINS.map(d => (
              <button
                key={d}
                onClick={() => setDomain(d)}
                className={`py-3 px-4 text-sm border ${domain === d ? 'border-emerald-500 text-emerald-400' : 'border-gray-800 text-gray-400'} transition-all text-left`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-emerald-400 text-sm font-bold uppercase tracking-wider mb-3">Cognitive Difficulty</label>
          <div className="flex gap-3">
            {DIFFICULTIES.map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`flex-1 py-3 text-sm border ${difficulty === d ? 'border-emerald-500 text-emerald-400' : 'border-gray-800 text-gray-400'} transition-all`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/50 text-red-400 text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <button 
          onClick={handleGenerateProblem}
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-6 py-4 font-bold tracking-widest uppercase transition-all flex justify-center items-center gap-3"
        >
          {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Cpu className="w-5 h-5" />}
          Generate Protocol
        </button>
      </div>
    </div>
  );

  const renderGeneration = () => {
    if (!problem || !vciConstraints || !hudStatus) return null;

    return (
      <div className="max-w-6xl mx-auto py-8 px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Problem Card & VCI Rules */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0a0a0a] border border-emerald-900/50 p-6">
            <div className="text-xs text-emerald-500 font-bold uppercase tracking-widest mb-4">Target Scenario</div>
            <p className="text-gray-200 text-sm leading-relaxed mb-6">{problem.scenario}</p>
            
            <div className="bg-red-900/10 border-l-2 border-red-500 p-4 mb-6">
              <div className="text-xs text-red-500 font-bold uppercase tracking-widest mb-1">Core Constraint</div>
              <p className="text-red-200 text-sm">{problem.coreConstraint}</p>
            </div>
            
            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-3">Obvious Traps (Avoid)</div>
            <ul className="space-y-2">
              {problem.obviousTraps.map((trap, i) => (
                <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                  <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> {trap}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#0a0a0a] border border-cyan-900/50 p-6 sticky top-8">
            <div className="text-xs text-cyan-500 font-bold uppercase tracking-widest mb-4 flex justify-between">
              <span>VCI Semantic Constraints</span>
              <span>Live HUD</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">5 Distinct Solutions populated</span>
                {hudStatus.allPopulated ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-gray-600" />}
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-300">Mandatory Vocabulary Used</span>
                  {hudStatus.allMandatoryWordsUsed ? <Check className="w-4 h-4 text-emerald-500" /> : <span className="text-xs text-gray-500">{hudStatus.usedMandatoryWords.length}/3</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {vciConstraints.mandatoryWords.map(w => {
                    const used = hudStatus.usedMandatoryWords.includes(w);
                    return (
                      <span key={w} className={`text-xs px-2 py-1 border ${used ? 'border-cyan-500 text-cyan-400 bg-cyan-900/20' : 'border-gray-800 text-gray-500'}`}>
                        {w}
                      </span>
                    )
                  })}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Zero Filler Words</span>
                {hudStatus.noFillerWords ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-red-500" />}
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Formal Conditionals ("If... then... because...")</span>
                <span className="text-xs text-gray-500">{hudStatus.conditionalCount}/2</span>
              </div>
            </div>

            <button 
              onClick={handleSubmitSolutions}
              disabled={!hudStatus.ready || loading}
              className={`w-full mt-8 py-4 font-bold tracking-widest uppercase transition-all flex justify-center items-center gap-3 ${
                hudStatus.ready 
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ShieldAlert className="w-5 h-5" />}
              Submit for Evaluation
            </button>
            {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
          </div>
        </div>

        {/* Right Column: 5 Solutions */}
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-4">Solution Generation Matrix</div>
          {solutions.map((sol, i) => (
            <div key={i} className="group relative">
              <div className="absolute top-0 left-0 w-8 h-full bg-[#121212] border-r border-gray-800 flex items-center justify-center text-gray-600 font-bold font-mono">
                0{i+1}
              </div>
              <textarea
                value={sol}
                onChange={e => {
                  const newSols = [...solutions];
                  newSols[i] = e.target.value;
                  setSolutions(newSols);
                }}
                placeholder={`Draft solution ${i+1}...`}
                className="w-full bg-[#0a0a0a] border border-gray-800 pl-12 pr-4 py-4 text-gray-300 text-sm min-h-[100px] focus:outline-none focus:border-emerald-500 focus:bg-[#0d1411] transition-all"
              />
            </div>
          ))}
        </div>

      </div>
    );
  };

  const renderEvaluation = () => {
    if (!evaluation || !problem) return null;

    return (
      <div className="max-w-5xl mx-auto py-12 px-6 space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2 uppercase tracking-widest">Cognitive Audit Complete</h2>
          <p className="text-emerald-400 font-mono">Creativity x Semantic Precision</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[#0a0a0a] border border-cyan-900/50 p-6 flex flex-col justify-center items-center text-center">
            <div className="text-5xl font-bold text-cyan-400 mb-2">{evaluation.vciPrecisionScore}</div>
            <div className="text-xs text-cyan-600 font-bold uppercase tracking-widest">VCI Precision Score</div>
          </div>
          <div className="col-span-2 bg-[#0a0a0a] border border-gray-800 p-6">
            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-3">VCI Semantic Feedback</div>
            <p className="text-gray-300 text-sm leading-relaxed">{evaluation.vciFeedback}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-lg font-bold text-emerald-500 uppercase tracking-widest border-b border-gray-800 pb-2">Kvashchev Divergent Matrix</div>
          {evaluation.solutionEvals.map((ev, i) => (
            <div key={i} className="bg-[#121212] border border-gray-800 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="font-bold text-gray-400">Solution 0{i+1}</div>
                <div className="flex gap-4 text-sm font-mono">
                  <div className="text-emerald-400">C:{ev.creativity.score}</div>
                  <div className="text-cyan-400">F:{ev.feasibility.score}</div>
                </div>
              </div>
              <p className="text-gray-300 text-sm italic mb-4">"{solutions[i]}"</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-xs text-gray-500 mb-1">Creativity Critique</span>
                  <span className="text-gray-400">{ev.creativity.feedback}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 mb-1">Feasibility Critique</span>
                  <span className="text-gray-400">{ev.feasibility.feedback}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-800">
                <span className="text-xs text-gray-500 uppercase">Abstract Principles Detected: </span>
                <span className="text-emerald-500 text-sm">{ev.abstractPrinciples.join(' • ')}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#0a0a0a] border border-emerald-900/50 p-6">
          <div className="text-xs text-emerald-500 font-bold uppercase tracking-widest mb-4">Missed Unconventional Solutions</div>
          <ul className="space-y-3">
            {evaluation.missedUnconventionalSolutions.map((sol, i) => (
              <li key={i} className="text-sm text-gray-300 pl-4 border-l-2 border-emerald-500">{sol}</li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end">
          <button 
            onClick={() => setPhase('METACOGNITION')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 font-bold tracking-widest uppercase transition-all flex items-center gap-2"
          >
            Proceed to Metacognition <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  const renderMetacognition = () => (
    <div className="max-w-3xl mx-auto py-16 px-6 space-y-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2 uppercase tracking-widest">Metacognitive Reflection</h2>
        <p className="text-gray-400 text-sm">Analyze your cognitive flow and constraints.</p>
      </div>

      <div className="space-y-4">
        <label className="block text-emerald-400 text-sm font-bold uppercase tracking-wider">
          1. Which solution required the largest shift away from your default thinking pattern?
        </label>
        <textarea
          value={metaQ1}
          onChange={e => setMetaQ1(e.target.value)}
          className="w-full bg-[#0a0a0a] border border-gray-800 p-4 text-gray-300 text-sm min-h-[120px] focus:outline-none focus:border-emerald-500 transition-all"
        />
      </div>

      <div className="space-y-4">
        <label className="block text-cyan-400 text-sm font-bold uppercase tracking-wider">
          2. How did the VCI constraints alter your initial problem-solving flow?
        </label>
        <textarea
          value={metaQ2}
          onChange={e => setMetaQ2(e.target.value)}
          className="w-full bg-[#0a0a0a] border border-gray-800 p-4 text-gray-300 text-sm min-h-[120px] focus:outline-none focus:border-cyan-500 transition-all"
        />
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleFinishSession}
          disabled={metaQ1.length < 10 || metaQ2.length < 10}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-8 py-4 font-bold tracking-widest uppercase transition-all flex items-center gap-2"
        >
          Finalize Trial <Check className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="max-w-2xl mx-auto py-24 px-6 text-center space-y-8">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-900/20 border border-emerald-500 rounded-full mb-4">
        <Check className="w-10 h-10 text-emerald-400" />
      </div>
      <h2 className="text-3xl font-bold text-white uppercase tracking-widest">Trial Recorded</h2>
      <p className="text-gray-400">Your performance matrix and cognitive data have been logged.</p>
      
      <div className="flex justify-center mt-8">
        <button 
          onClick={() => setPhase('DASHBOARD')}
          className="border border-gray-700 hover:border-gray-500 text-gray-300 px-8 py-4 font-bold tracking-widest uppercase transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-mono selection:bg-emerald-900 selection:text-white pb-20">
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {phase === 'DASHBOARD' && renderDashboard()}
          {phase === 'SETUP' && renderSetup()}
          {phase === 'GENERATION' && renderGeneration()}
          {phase === 'EVALUATION' && renderEvaluation()}
          {phase === 'METACOGNITION' && renderMetacognition()}
          {phase === 'SUMMARY' && renderSummary()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
