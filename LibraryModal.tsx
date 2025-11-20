import React, { useState } from 'react';
import ModalWrapper from './ModalWrapper';
import { AppConfig, TabType, LibraryItem } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
}

const LibraryModal: React.FC<Props> = ({ isOpen, onClose, config }) => {
  const [activeTab, setActiveTab] = useState<TabType>('mentalModels');
  const [search, setSearch] = useState('');

  const tabs: {id: TabType; label: string}[] = [
    { id: 'mentalModels', label: 'Models' },
    { id: 'productivity', label: 'Productivity' },
    { id: 'investors', label: 'Investors' },
    { id: 'quotes', label: 'Quotes' },
  ];

  const getData = () => {
    let data: any[] = config.library[activeTab as keyof typeof config.library] || [];
    if (activeTab === 'quotes') {
        data = (data as string[]).map(q => ({ name: "Quote", desc: q }));
    }
    return data as LibraryItem[];
  };

  const filteredData = getData().filter(item => {
    const s = search.toLowerCase();
    return item.name.toLowerCase().includes(s) || item.desc?.toLowerCase().includes(s) || item.resource?.toLowerCase().includes(s);
  });

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Knowledge Base">
      <div className="flex flex-col h-full">
        <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-komorebi-mint text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                >
                    {tab.label}
                </button>
            ))}
        </div>

        <input 
            type="text"
            placeholder="Search wisdom..."
            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white mb-4 focus:outline-none focus:border-komorebi-mint/50"
            value={search}
            onChange={e => setSearch(e.target.value)}
        />

        <div className="space-y-3">
            {filteredData.map((item, idx) => (
                <div key={idx} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors border border-transparent hover:border-white/5">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-komorebi-mint text-sm">{item.name}</h3>
                        {item.years && <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-komorebi-gold">{item.years}</span>}
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc || item.resource}</p>
                </div>
            ))}
            {filteredData.length === 0 && <div className="text-center text-gray-500 py-8">No results found.</div>}
        </div>
      </div>
    </ModalWrapper>
  );
};

export default LibraryModal;
