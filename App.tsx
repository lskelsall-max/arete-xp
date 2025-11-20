import React, { useState, useEffect, useCallback } from 'react';
import { AppConfig, DayData, AppState } from './types';
import { DEFAULT_CONFIG } from './constants';
import { initGemini, generateJaguarResponse } from './services/geminiService';
import { VectorDocument } from './services/supabaseClient';
import { useScheduledReminders } from './hooks/useScheduledReminders';

import DailyInspiration from './components/DailyInspiration';
import ProtocolSection from './components/ProtocolSection';
import Summary from './components/Summary';
import Journal from './components/Journal';
import JaguarSearch from './components/JaguarSearch';

import LibraryModal from './components/Modals/LibraryModal';
import SettingsModal from './components/Modals/SettingsModal';
import StatsModal from './components/Modals/StatsModal';
import EditorModal from './components/Modals/EditorModal';
import AIInsightModal from './components/Modals/AIInsightModal';
import ReminderModal from './components/Modals/ReminderModal';
import { MousePointerClick } from 'lucide-react';

// Local Storage Keys
const LS_CONFIG_KEY = 'komorebi_config_v1';
const LS_API_KEY = 'komorebi_gemini_key';
const getDayKey = (date: string) => `komorebi_day_${date}`;

const App: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  
  // State
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [dayData, setDayData] = useState<DayData>({ date, checkedItems: {}, note: '' });
  const [history, setHistory] = useState<AppState['history']>({});
  const [apiKey, setApiKey] = useState<string>('');

  // Modals
  const [showLibrary, setShowLibrary] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  
  // AI Insight Modal State
  const [insightOpen, setInsightOpen] = useState(false);
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightQuery, setInsightQuery] = useState('');
  const [insightAnswer, setInsightAnswer] = useState<string | null>(null);
  const [insightSources, setInsightSources] = useState<VectorDocument[]>([]);
  const [insightError, setInsightError] = useState<string | null>(null);

  // Scheduled Reminders
  const { reminderType, dismissReminder } = useScheduledReminders();

  // Load Initial Data
  useEffect(() => {
    // Config
    const savedConfig = localStorage.getItem(LS_CONFIG_KEY);
    if (savedConfig) {
        try { 
            const parsed = JSON.parse(savedConfig);
            // Spread default config first to ensure new fields (like persona) exist if missing in saved
            setConfig({ ...DEFAULT_CONFIG, ...parsed });
        } catch(e) { 
            console.error("Config parse error", e); 
        }
    }
    
    // API Key
    const savedKey = localStorage.getItem(LS_API_KEY);
    if (savedKey) {
        setApiKey(savedKey);
        initGemini(savedKey);
    }

    // History Index (Scanning LS)
    const hist: AppState['history'] = {};
    for (let i=0; i<localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('komorebi_day_')) {
             try {
                 const d = JSON.parse(localStorage.getItem(k) || '');
                 hist[k.replace('komorebi_day_', '')] = d;
             } catch(e) {}
        }
    }
    setHistory(hist);

    setLoaded(true);
  }, []);

  // Load Day Data when Date changes
  useEffect(() => {
    const key = getDayKey(date);
    const saved = localStorage.getItem(key);
    if (saved) {
        try {
            setDayData(JSON.parse(saved));
        } catch (e) {
            setDayData({ date, checkedItems: {}, note: '' });
        }
    } else {
        setDayData({ date, checkedItems: {}, note: '' });
    }
  }, [date]);

  const handleSaveDay = useCallback(() => {
    const key = getDayKey(date);
    localStorage.setItem(key, JSON.stringify(dayData));
    
    // Update history
    setHistory(prev => ({ ...prev, [date]: dayData }));
  }, [date, dayData]);

  const handleSaveApiKey = (key: string) => {
      setApiKey(key);
      localStorage.setItem(LS_API_KEY, key);
      initGemini(key);
      alert("API Key Saved.");
  };

  const handleImportData = (jsonStr: string) => {
      const data = JSON.parse(jsonStr);
      Object.keys(data).forEach(k => {
          localStorage.setItem(k, typeof data[k] === 'string' ? data[k] : JSON.stringify(data[k]));
      });
  };

  const handleUpdateConfig = (newConfig: AppConfig) => {
      setConfig(newConfig);
      localStorage.setItem(LS_CONFIG_KEY, JSON.stringify(newConfig));
  };

  const handleToggleItem = (itemId: string, xp: number, maxXP: number, cardId: string) => {
      setDayData(prev => {
          const newChecked = { ...prev.checkedItems };
          if (newChecked[itemId]) delete newChecked[itemId];
          else newChecked[itemId] = true;
          return { ...prev, checkedItems: newChecked };
      });
  };

  // --- AI EXPLORATION LOGIC ---
  const triggerInsight = async (prompt: string) => {
      if (!apiKey) {
          alert("Please set your API Key in Settings first.");
          setShowSettings(true);
          return;
      }
      
      setInsightOpen(true);
      setInsightLoading(true);
      setInsightQuery(prompt);
      setInsightAnswer(null);
      setInsightSources([]);
      setInsightError(null);

      try {
        // Prepare simplified context for the RAG call
        const contextItems = [...config.library.mentalModels, ...config.library.productivity];
        const contextQuotes = config.library.quotes;

        // Pass config.persona to generateJaguarResponse
        const response = await generateJaguarResponse(prompt, contextItems, contextQuotes, config.persona);
        
        setInsightAnswer(response.answer);
        setInsightSources(response.sources);
      } catch (err: any) {
        console.error(err);
        setInsightError("Connection interrupted. Please check your API key or try again.");
      } finally {
        setInsightLoading(false);
      }
  };

  // Calculate Total XP
  const calculateTotalXP = () => {
      let total = 0;
      config.protocols.forEach(section => {
          section.cards.forEach(card => {
             let cardXP = 0;
             const checkedCount = card.items.filter(i => dayData.checkedItems[i.id]).length;
             
             if (card.scoringType === 'count_multiplier') {
                if (checkedCount === card.items.length) cardXP = card.maxXP;
                else cardXP = checkedCount * (card.perItemXP || 0);
             } else {
                card.items.forEach(i => {
                    if(dayData.checkedItems[i.id]) cardXP += (i.xp || 0);
                });
             }
             total += Math.min(cardXP, card.maxXP);
          });
      });
      return total;
  };

  const currentXP = calculateTotalXP();
  
  // Workout of the day logic
  const dayOfWeekIndex = new Date(date).getDay(); 
  const todayWorkout = config.workouts[dayOfWeekIndex] || {t: "Rest", d: "Recovery"};

  if (!loaded) return <div className="min-h-screen flex items-center justify-center text-komorebi-mint">Initializing Komorebi OS...</div>;

  return (
    <div className="min-h-screen pb-20 relative selection:bg-komorebi-mint selection:text-black">
      
      {/* Header */}
      <header className="pt-8 pb-6 px-4 md:px-8 max-w-6xl mx-auto flex justify-between items-start">
        <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">
                Komorebi <span className="text-komorebi-mint">OS</span>
            </h1>
            <p className="text-xs text-gray-500 font-bold tracking-[0.3em] uppercase mt-1">Master Protocol</p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
            <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-white/5 border border-white/10 rounded px-3 py-1 text-sm font-mono text-white focus:outline-none focus:border-komorebi-mint"
            />
            <div className="text-xs text-gray-500">{todayWorkout.t}</div>
        </div>
      </header>

      <main className="px-4 md:px-8 max-w-6xl mx-auto">
        
        <JaguarSearch config={config} hasApiKey={!!apiKey} />

        {/* Pass the AI trigger handler to DailyInspiration */}
        <DailyInspiration config={config} dateSeed={date} onExplore={triggerInsight} />
        
        {/* Workout Card - Now Clickable */}
        <section className="mb-8">
             <h2 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-3 ml-1 flex gap-2 items-center">
                 Physical Training <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400 tracking-normal normal-case">Click for Routine</span>
             </h2>
             <div 
                onClick={() => triggerInsight(`Generate a specific, high-intensity ${todayWorkout.t} workout routine based on this description: "${todayWorkout.d}". I am an advanced athlete. Include warmup, main sets, and cooldown.`)}
                className="bg-komorebi-cardSoft border border-white/10 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 hover:border-komorebi-mint/30 hover:scale-[1.005] transition-all group relative overflow-hidden"
             >
                <div className="z-10">
                    <h3 className="text-komorebi-mint font-bold group-hover:text-white transition-colors">{todayWorkout.t}</h3>
                    <p className="text-gray-300 text-sm">{todayWorkout.d}</p>
                </div>
                <div className="text-3xl opacity-20 group-hover:opacity-40 transition-opacity">💪</div>
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-komorebi-mint">
                    <MousePointerClick size={16} />
                </div>
             </div>
        </section>

        <div className="grid grid-cols-1 gap-8">
            {config.protocols.map((section, idx) => (
                <ProtocolSection 
                    key={idx} 
                    section={section} 
                    dayData={dayData} 
                    onToggle={handleToggleItem} 
                />
            ))}
        </div>

        <Journal value={dayData.note} onChange={(val) => setDayData(prev => ({ ...prev, note: val }))} />

      </main>

      <Summary 
        totalXP={currentXP} 
        levelLimits={config.levels}
        onSave={handleSaveDay}
        onOpenLibrary={() => setShowLibrary(true)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenStats={() => setShowStats(true)}
        onOpenEditor={() => setShowEditor(true)}
        isSaved={false} 
      />

      <LibraryModal isOpen={showLibrary} onClose={() => setShowLibrary(false)} config={config} />
      <StatsModal isOpen={showStats} onClose={() => setShowStats(false)} history={history} maxXP={config.maxXP} />
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        onImport={handleImportData} 
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />
      <EditorModal 
        isOpen={showEditor} 
        onClose={() => setShowEditor(false)} 
        config={config}
        onUpdateConfig={handleUpdateConfig}
      />
      
      {/* AI Insight Modal */}
      <AIInsightModal 
        isOpen={insightOpen} 
        onClose={() => setInsightOpen(false)}
        loading={insightLoading}
        query={insightQuery}
        answer={insightAnswer}
        sources={insightSources}
        error={insightError}
      />

      {/* Scheduled Reminder Modal */}
      <ReminderModal 
        type={reminderType}
        onClose={dismissReminder}
      />

    </div>
  );
};

export default App;