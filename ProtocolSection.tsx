import React from 'react';
import { ProtocolSection as IProtocolSection, ProtocolCard, DayData } from '../types';
import { Check, ChevronDown, ChevronRight } from 'lucide-react';

interface Props {
  section: IProtocolSection;
  dayData: DayData;
  onToggle: (itemId: string, xp: number, maxXP: number, cardId: string) => void;
}

const ProtocolSection: React.FC<Props> = ({ section, dayData, onToggle }) => {
  
  const calculateCardXP = (card: ProtocolCard) => {
    let xp = 0;
    const checkedCount = card.items.filter(i => dayData.checkedItems[i.id]).length;
    
    if (card.scoringType === 'count_multiplier') {
        if (checkedCount === card.items.length) xp = card.maxXP;
        else xp = checkedCount * (card.perItemXP || 0);
    } else {
        card.items.forEach(i => {
            if (dayData.checkedItems[i.id]) {
                xp += (i.xp || 0);
            }
        });
    }
    return Math.min(xp, card.maxXP);
  };

  // Map columns to Tailwind classes to avoid invalid inline styles with media queries
  const gridColsClass = section.columns === 3 ? 'md:grid-cols-3' : section.columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-1';

  return (
    <div className="mb-8">
      <h2 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-3 ml-1">
        {section.title}
      </h2>
      <div className={`grid gap-4 grid-cols-1 ${gridColsClass}`}>
        {section.cards.map(card => {
          const currentXP = calculateCardXP(card);
          const progress = (currentXP / card.maxXP) * 100;
          const isMaxed = currentXP >= card.maxXP;

          return (
            <div key={card.id} className="bg-komorebi-card border border-white/10 rounded-xl flex flex-col relative overflow-hidden shadow-lg group">
              {/* Progress Bar Background */}
              <div className="absolute bottom-0 left-0 h-1 w-full bg-black/40">
                <div 
                    className={`h-full transition-all duration-500 ease-out ${isMaxed ? 'bg-komorebi-gold' : 'bg-komorebi-mint'}`} 
                    style={{ width: `${progress}%` }}
                />
              </div>

              <div className="p-4 flex flex-col gap-3 h-full z-10">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-white tracking-wide text-sm">{card.title}</h3>
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded ${isMaxed ? 'bg-komorebi-gold/20 text-komorebi-gold' : 'bg-komorebi-mint/10 text-komorebi-mint'}`}>
                    {Math.round(currentXP)} / {card.maxXP} XP
                  </div>
                </div>

                <div className="space-y-2 flex-1">
                  {card.items.map(item => {
                    const isChecked = !!dayData.checkedItems[item.id];
                    return (
                      <label 
                        key={item.id} 
                        className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-all hover:bg-white/5 ${isChecked ? 'text-white' : 'text-gray-400'}`}
                      >
                        <div className="relative flex items-center">
                          <input 
                            type="checkbox" 
                            className="peer appearance-none w-5 h-5 border-2 border-gray-600 rounded bg-transparent checked:bg-komorebi-mint checked:border-komorebi-mint transition-colors cursor-pointer"
                            checked={isChecked}
                            onChange={() => onToggle(item.id, item.xp || 0, card.maxXP, card.id)}
                          />
                          <Check size={12} className="absolute inset-0 m-auto text-black pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                        </div>
                        <span className="text-sm leading-tight select-none pt-0.5">{item.label}</span>
                      </label>
                    );
                  })}
                </div>
                
                {card.details && card.details.length > 0 && (
                   <details className="group/details text-xs text-gray-500 mt-2 ml-2">
                     <summary className="cursor-pointer list-none flex items-center gap-1 hover:text-komorebi-mint transition-colors">
                        <span className="group-open/details:hidden"><ChevronRight size={12}/></span>
                        <span className="hidden group-open/details:inline"><ChevronDown size={12}/></span>
                        Details
                     </summary>
                     <ul className="mt-2 pl-4 border-l border-white/10 space-y-1">
                        {card.details.map((d, i) => <li key={i}>{d}</li>)}
                     </ul>
                   </details>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProtocolSection;