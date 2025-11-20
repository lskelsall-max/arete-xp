import React, { useState } from 'react';
import ModalWrapper from './ModalWrapper';
import { AppConfig, LibraryItem } from '../../types';
import { Trash2, Plus, GripVertical, Save, Wand2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onUpdateConfig: (newConfig: AppConfig) => void;
}

type EditorTab = 'protocols' | 'workouts' | 'library' | 'persona';
type LibraryCategory = 'mentalModels' | 'productivity' | 'quotes' | 'investors';

const EditorModal: React.FC<Props> = ({ isOpen, onClose, config, onUpdateConfig }) => {
  const [activeTab, setActiveTab] = useState<EditorTab>('protocols');
  const [libCategory, setLibCategory] = useState<LibraryCategory>('mentalModels');

  // --- PROTOCOLS ---
  const updateProtocolTitle = (sectionIdx: number, cardIdx: number, val: string) => {
    const newConfig = { ...config };
    newConfig.protocols[sectionIdx].cards[cardIdx].title = val;
    onUpdateConfig(newConfig);
  };

  const updateProtocolMaxXP = (sectionIdx: number, cardIdx: number, val: string) => {
    const newConfig = { ...config };
    newConfig.protocols[sectionIdx].cards[cardIdx].maxXP = parseInt(val) || 0;
    onUpdateConfig(newConfig);
  };

  const updateProtocolItem = (sectionIdx: number, cardIdx: number, itemIdx: number, field: 'label' | 'xp', val: string) => {
    const newConfig = { ...config };
    const item = newConfig.protocols[sectionIdx].cards[cardIdx].items[itemIdx];
    if (field === 'label') item.label = val;
    else item.xp = parseInt(val) || 0;
    onUpdateConfig(newConfig);
  };

  const addProtocolItem = (sectionIdx: number, cardIdx: number) => {
    const newConfig = { ...config };
    newConfig.protocols[sectionIdx].cards[cardIdx].items.push({
        id: `custom_${Date.now()}`,
        label: 'New Habit',
        xp: 100
    });
    onUpdateConfig(newConfig);
  };

  const removeProtocolItem = (sectionIdx: number, cardIdx: number, itemIdx: number) => {
    if (!confirm('Delete item?')) return;
    const newConfig = { ...config };
    newConfig.protocols[sectionIdx].cards[cardIdx].items.splice(itemIdx, 1);
    onUpdateConfig(newConfig);
  };

  // --- WORKOUTS ---
  const updateWorkout = (idx: number, field: 't' | 'd', val: string) => {
    const newConfig = { ...config };
    newConfig.workouts[idx][field] = val;
    onUpdateConfig(newConfig);
  };

  // --- LIBRARY ---
  const updateLibraryItem = (index: number, field: 'name' | 'desc' | 'resource' | 'years' | 'quote', val: string) => {
      const newConfig = { ...config };
      
      if (libCategory === 'quotes') {
          newConfig.library.quotes[index] = val;
      } else {
          const list = newConfig.library[libCategory] as LibraryItem[];
          if (list[index]) {
             (list[index] as any)[field] = val;
          }
      }
      onUpdateConfig(newConfig);
  };

  const addLibraryItem = () => {
      const newConfig = { ...config };
      if (libCategory === 'quotes') {
          newConfig.library.quotes.unshift("New quote...");
      } else if (libCategory === 'investors') {
          newConfig.library.investors.unshift({ name: "Name", resource: "Source", years: "Era" });
      } else {
          (newConfig.library[libCategory] as LibraryItem[]).unshift({ name: "New Item", desc: "Description" });
      }
      onUpdateConfig(newConfig);
  };

  const removeLibraryItem = (index: number) => {
      if(!confirm("Remove this item?")) return;
      const newConfig = { ...config };
      if (libCategory === 'quotes') {
          newConfig.library.quotes.splice(index, 1);
      } else {
          (newConfig.library[libCategory] as any[]).splice(index, 1);
      }
      onUpdateConfig(newConfig);
  };

  // --- PERSONA ---
  const updatePersona = (field: 'anima' | 'archetype' | 'symbol', val: string) => {
    const newConfig = { ...config };
    if (!newConfig.persona) newConfig.persona = { anima: 'Jaguar', archetype: 'Warrior King', symbol: 'Tree' };
    newConfig.persona[field] = val;
    onUpdateConfig(newConfig);
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Customize OS">
      <div className="flex gap-2 mb-6 border-b border-white/10 pb-2 overflow-x-auto no-scrollbar">
        {(['protocols', 'workouts', 'library', 'persona'] as EditorTab[]).map(tab => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors rounded-t-lg whitespace-nowrap ${activeTab === tab ? 'bg-white/10 text-komorebi-mint border-b-2 border-komorebi-mint' : 'text-gray-500 hover:text-white'}`}
            >
                {tab}
            </button>
        ))}
      </div>

      <div className="space-y-8 pb-8">
        {/* PROTOCOLS TAB */}
        {activeTab === 'protocols' && config.protocols.map((section, sIdx) => (
            <div key={sIdx} className="space-y-4">
                <h3 className="text-komorebi-gold font-bold text-xs uppercase tracking-[0.2em]">{section.title}</h3>
                {section.cards.map((card, cIdx) => (
                    <div key={card.id} className="bg-black/20 border border-white/5 rounded-xl p-4">
                        <div className="flex gap-2 mb-4">
                            <div className="flex-1">
                                <label className="text-[10px] text-gray-500 uppercase font-bold">Card Title</label>
                                <input 
                                    className="w-full bg-white/5 border border-white/10 rounded p-2 text-sm text-white"
                                    value={card.title}
                                    onChange={(e) => updateProtocolTitle(sIdx, cIdx, e.target.value)}
                                />
                            </div>
                            <div className="w-24">
                                <label className="text-[10px] text-gray-500 uppercase font-bold">Max XP</label>
                                <input 
                                    type="number"
                                    className="w-full bg-white/5 border border-white/10 rounded p-2 text-sm text-white"
                                    value={card.maxXP}
                                    onChange={(e) => updateProtocolMaxXP(sIdx, cIdx, e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            {card.items.map((item, iIdx) => (
                                <div key={item.id} className="flex items-center gap-2 bg-white/5 p-2 rounded">
                                    <GripVertical size={14} className="text-gray-600" />
                                    <input 
                                        className="flex-1 bg-transparent text-sm text-gray-300 focus:outline-none border-b border-transparent focus:border-komorebi-mint/50"
                                        value={item.label}
                                        onChange={(e) => updateProtocolItem(sIdx, cIdx, iIdx, 'label', e.target.value)}
                                    />
                                    <input 
                                        className="w-16 bg-transparent text-xs text-right text-komorebi-mint focus:outline-none border-b border-transparent focus:border-komorebi-mint/50"
                                        value={item.xp || 0}
                                        type="number"
                                        onChange={(e) => updateProtocolItem(sIdx, cIdx, iIdx, 'xp', e.target.value)}
                                    />
                                    <span className="text-[10px] text-gray-500">XP</span>
                                    <button 
                                        onClick={() => removeProtocolItem(sIdx, cIdx, iIdx)}
                                        className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                            <button 
                                onClick={() => addProtocolItem(sIdx, cIdx)}
                                className="w-full py-2 text-xs text-gray-500 border border-dashed border-white/10 rounded hover:bg-white/5 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={12} /> Add Item
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        ))}

        {/* WORKOUTS TAB */}
        {activeTab === 'workouts' && (
            <div className="space-y-2">
                {config.workouts.map((workout, idx) => (
                    <div key={idx} className="bg-black/20 border border-white/5 rounded-lg p-3 flex gap-3 items-center">
                        <div className="w-24 text-xs font-bold text-gray-500 uppercase">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][idx]}</div>
                        <input 
                            className="flex-1 bg-transparent border-b border-white/5 focus:border-komorebi-gold text-sm text-white py-1"
                            value={workout.t}
                            onChange={(e) => updateWorkout(idx, 't', e.target.value)}
                            placeholder="Workout Title"
                        />
                        <input 
                            className="flex-1 bg-transparent border-b border-white/5 focus:border-komorebi-gold text-sm text-gray-400 py-1"
                            value={workout.d}
                            onChange={(e) => updateWorkout(idx, 'd', e.target.value)}
                            placeholder="Description"
                        />
                    </div>
                ))}
            </div>
        )}

        {/* LIBRARY TAB */}
        {activeTab === 'library' && (
            <div className="flex flex-col h-full">
                 <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
                    {(['mentalModels', 'productivity', 'quotes', 'investors'] as LibraryCategory[]).map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setLibCategory(cat)}
                            className={`px-3 py-1 text-xs rounded-full border ${libCategory === cat ? 'bg-komorebi-mint text-black border-komorebi-mint' : 'bg-transparent text-gray-400 border-white/10'}`}
                        >
                            {cat === 'mentalModels' ? 'Models' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                 </div>
                 
                 <button 
                    onClick={addLibraryItem}
                    className="w-full py-3 bg-komorebi-mint/10 text-komorebi-mint rounded-lg border border-dashed border-komorebi-mint/30 mb-4 hover:bg-komorebi-mint/20 transition-colors text-sm font-bold flex items-center justify-center gap-2"
                 >
                    <Plus size={16} /> Add New {libCategory === 'quotes' ? 'Quote' : 'Item'}
                 </button>

                 <div className="space-y-3">
                    {libCategory === 'quotes' ? (
                        (config.library.quotes || []).map((quote, idx) => (
                            <div key={idx} className="flex gap-2 items-start bg-white/5 p-3 rounded border border-white/5">
                                <textarea
                                    className="flex-1 bg-transparent text-sm text-white focus:outline-none resize-none h-16"
                                    value={quote}
                                    onChange={(e) => updateLibraryItem(idx, 'quote', e.target.value)}
                                />
                                <button onClick={() => removeLibraryItem(idx)} className="text-gray-600 hover:text-red-400"><Trash2 size={14}/></button>
                            </div>
                        ))
                    ) : (
                        (config.library[libCategory] as any[] || []).map((item, idx) => (
                            <div key={idx} className="flex flex-col gap-2 bg-white/5 p-3 rounded border border-white/5">
                                <div className="flex gap-2">
                                    <input 
                                        className="flex-1 bg-transparent font-bold text-komorebi-gold text-sm focus:outline-none"
                                        value={item.name}
                                        placeholder="Title"
                                        onChange={(e) => updateLibraryItem(idx, 'name', e.target.value)}
                                    />
                                    <button onClick={() => removeLibraryItem(idx)} className="text-gray-600 hover:text-red-400"><Trash2 size={14}/></button>
                                </div>
                                {libCategory === 'investors' ? (
                                    <div className="flex gap-2">
                                        <input 
                                            className="flex-1 bg-transparent text-xs text-gray-400 focus:outline-none border-b border-white/5"
                                            value={item.resource}
                                            placeholder="Resource/Book"
                                            onChange={(e) => updateLibraryItem(idx, 'resource', e.target.value)}
                                        />
                                        <input 
                                            className="w-20 bg-transparent text-xs text-gray-500 focus:outline-none border-b border-white/5 text-right"
                                            value={item.years}
                                            placeholder="Years"
                                            onChange={(e) => updateLibraryItem(idx, 'years', e.target.value)}
                                        />
                                    </div>
                                ) : (
                                    <textarea 
                                        className="w-full bg-transparent text-xs text-gray-400 focus:outline-none resize-none h-12 border-t border-white/5 pt-2"
                                        value={item.desc}
                                        placeholder="Description"
                                        onChange={(e) => updateLibraryItem(idx, 'desc', e.target.value)}
                                    />
                                )}
                            </div>
                        ))
                    )}
                 </div>
            </div>
        )}

        {/* PERSONA TAB */}
        {activeTab === 'persona' && (
            <div className="space-y-6">
                <div className="bg-black/20 p-5 rounded-xl border border-white/5 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-6 opacity-10 text-komorebi-gold">
                       <Wand2 size={80} />
                   </div>
                   <h3 className="text-komorebi-gold uppercase tracking-widest text-xs font-bold mb-4 relative z-10">Spirit Tuning</h3>
                   
                   <div className="grid gap-6 relative z-10">
                       {/* Anima */}
                       <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Anima (Spirit Animal)</label>
                           <input 
                               className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-komorebi-mint focus:outline-none"
                               value={config.persona?.anima || 'Jaguar'}
                               onChange={(e) => updatePersona('anima', e.target.value)}
                               placeholder="e.g. Jaguar, Wolf, Lion"
                           />
                           <div className="flex gap-2 mt-2 flex-wrap">
                              {['Jaguar', 'Wolf', 'Eagle', 'Bear', 'Owl', 'Lion'].map(opt => (
                                  <button 
                                    key={opt}
                                    onClick={() => updatePersona('anima', opt)}
                                    className="text-[10px] px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-gray-400 transition-colors"
                                  >
                                      {opt}
                                  </button>
                              ))}
                           </div>
                       </div>
                       
                       {/* Archetype */}
                       <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Archetype (Identity)</label>
                           <input 
                               className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-komorebi-mint focus:outline-none"
                               value={config.persona?.archetype || 'Warrior King'}
                               onChange={(e) => updatePersona('archetype', e.target.value)}
                               placeholder="e.g. Warrior King, Stoic Sage"
                           />
                           <div className="flex gap-2 mt-2 flex-wrap">
                              {['Warrior', 'King', 'Philosopher', 'Magician', 'Creator', 'Sage'].map(opt => (
                                  <button 
                                    key={opt}
                                    onClick={() => updatePersona('archetype', opt)}
                                    className="text-[10px] px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-gray-400 transition-colors"
                                  >
                                      {opt}
                                  </button>
                              ))}
                           </div>
                       </div>

                       {/* Symbol */}
                       <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Sacred Symbol</label>
                           <input 
                               className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-komorebi-mint focus:outline-none"
                               value={config.persona?.symbol || 'Tree'}
                               onChange={(e) => updatePersona('symbol', e.target.value)}
                               placeholder="e.g. Tree, Mountain, Fire"
                           />
                           <div className="flex gap-2 mt-2 flex-wrap">
                              {['Tree', 'Mountain', 'Ocean', 'Fire', 'Sword', 'Book', 'Kettlebell', 'Surfboard'].map(opt => (
                                  <button 
                                    key={opt}
                                    onClick={() => updatePersona('symbol', opt)}
                                    className="text-[10px] px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-gray-400 transition-colors"
                                  >
                                      {opt}
                                  </button>
                              ))}
                           </div>
                       </div>
                   </div>
                </div>
                <p className="text-xs text-gray-500 text-center">The AI will adapt its tone and metaphors to match these settings.</p>
            </div>
        )}
      </div>
    </ModalWrapper>
  );
};

export default EditorModal;