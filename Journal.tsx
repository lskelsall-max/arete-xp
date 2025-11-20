import React from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

const Journal: React.FC<Props> = ({ value, onChange }) => {
  return (
    <section className="mb-20">
        <h2 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-3 ml-1">
            Daily Journal
        </h2>
        <div className="bg-komorebi-card border border-white/10 rounded-xl p-4">
            <textarea 
                className="w-full h-32 bg-black/20 border border-white/5 rounded-lg p-3 text-sm text-gray-200 focus:outline-none focus:border-komorebi-mint/50 transition-colors resize-none leading-relaxed"
                placeholder="Reflect on your wins, lessons, and thoughts..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    </section>
  );
};

export default Journal;
