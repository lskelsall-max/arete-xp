import React from 'react';
import { Award, Save, Database, Book, BarChart2, Sliders, Cloud } from 'lucide-react';

interface Props {
  totalXP: number;
  levelLimits: { elite: number; strong: number; survival: number };
  onSave: () => void;
  onOpenLibrary: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  onOpenEditor: () => void;
  isSaved?: boolean;
}

const Summary: React.FC<Props> = ({ 
  totalXP, 
  levelLimits, 
  onSave, 
  onOpenLibrary, 
  onOpenStats, 
  onOpenSettings, 
  onOpenEditor,
  isSaved 
}) => {
  
  let level = { label: "Red Zone", color: "text-komorebi-danger border-komorebi-danger bg-komorebi-danger/10" };
  if (totalXP >= levelLimits.elite) level = { label: "ELITE", color: "text-komorebi-mint border-komorebi-mint bg-komorebi-mint/10" };
  else if (totalXP >= levelLimits.strong) level = { label: "STRONG", color: "text-blue-400 border-blue-400 bg-blue-400/10" };
  else if (totalXP >= levelLimits.survival) level = { label: "SURVIVAL", color: "text-yellow-400 border-yellow-400 bg-yellow-400/10" };

  return (
    <div className="sticky bottom-4 z-40 w-full">
      <div className="glass-panel rounded-2xl p-3 flex justify-between items-center shadow-2xl mx-auto max-w-6xl">
        
        <div className="flex items-center gap-4 pl-2">
            <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Daily XP</span>
                <span className="text-xl font-black text-white leading-none">{Math.round(totalXP)}</span>
            </div>
            <div className={`px-3 py-1 rounded-lg border text-xs font-bold tracking-widest uppercase ${level.color}`}>
                {level.label}
            </div>
        </div>

        <div className="flex items-center gap-2">
             <button 
                onClick={onSave} 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${isSaved ? 'bg-green-500/20 text-green-400' : 'bg-komorebi-gold text-black hover:bg-white'}`}
            >
                <Save size={16} />
                <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
            </button>
            
            <div className="h-8 w-px bg-white/10 mx-1 hidden sm:block"></div>

            <button onClick={onOpenLibrary} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors" title="Library">
                <Book size={20} />
            </button>
             <button onClick={onOpenStats} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors" title="Stats">
                <BarChart2 size={20} />
            </button>
            <button onClick={onOpenEditor} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors" title="Customize">
                <Sliders size={20} />
            </button>
            <button onClick={onOpenSettings} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors" title="Settings">
                <Database size={20} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default Summary;