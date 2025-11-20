import React, { useMemo } from 'react';
import { AppConfig } from '../types';
import { Sparkles, BookOpen, Quote, TrendingUp, MousePointerClick } from 'lucide-react';

interface Props {
  config: AppConfig;
  dateSeed: string;
  onExplore: (prompt: string) => void;
}

// Simple seeded random
const seededRandom = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const DailyInspiration: React.FC<Props> = ({ config, dateSeed, onExplore }) => {
  
  const dailyContent = useMemo(() => {
    const seedVal = seededRandom(dateSeed);
    
    const modelIdx = seedVal % config.library.mentalModels.length;
    const prodIdx = (seedVal * 2) % config.library.productivity.length;
    const quoteIdx = (seedVal * 3) % config.library.quotes.length;
    
    // Investor of week based on week number
    const date = new Date(dateSeed);
    const oneJan = new Date(date.getFullYear(), 0, 1);
    const weekNum = Math.ceil((((date.getTime() - oneJan.getTime()) / 86400000) + oneJan.getDay() + 1) / 7);
    const invIdx = weekNum % config.library.investors.length;

    return {
      model: config.library.mentalModels[modelIdx],
      prod: config.library.productivity[prodIdx],
      quote: config.library.quotes[quoteIdx],
      investor: config.library.investors[invIdx]
    };
  }, [config, dateSeed]);

  return (
    <section className="mb-6">
      <h2 className="text-xs font-bold text-komorebi-mint uppercase tracking-[0.2em] mb-3 ml-1 opacity-60 flex items-center gap-2">
        Daily Alignment <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400 tracking-normal normal-case">Click cards to explore</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Mental Model */}
        <div 
            onClick={() => onExplore(`Explain the mental model "${dailyContent.model?.name}" in depth. How can I apply it to solve difficult problems today? Provide a concrete example.`)}
            className="bg-komorebi-card border border-white/5 rounded-xl p-4 relative overflow-hidden group hover:border-komorebi-mint/30 hover:bg-white/5 cursor-pointer transition-all hover:scale-[1.01]"
        >
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Sparkles size={40} />
          </div>
          <div className="flex items-center gap-2 mb-2 text-komorebi-mint">
            <Sparkles size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Mental Model</span>
          </div>
          <h3 className="text-white font-bold text-lg mb-1 group-hover:text-komorebi-mint transition-colors">{dailyContent.model?.name}</h3>
          <p className="text-sm text-gray-400 leading-relaxed">{dailyContent.model?.desc}</p>
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-komorebi-mint">
            <MousePointerClick size={16} />
          </div>
        </div>

        {/* Productivity */}
        <div 
            onClick={() => onExplore(`How do I effectively implement the "${dailyContent.prod?.name}" productivity technique? Give me a step-by-step guide or checklist.`)}
            className="bg-komorebi-card border border-white/5 rounded-xl p-4 relative overflow-hidden group hover:border-komorebi-mint/30 hover:bg-white/5 cursor-pointer transition-all hover:scale-[1.01]"
        >
           <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={40} />
          </div>
          <div className="flex items-center gap-2 mb-2 text-komorebi-mint">
            <TrendingUp size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Productivity</span>
          </div>
          <h3 className="text-white font-bold text-lg mb-1 group-hover:text-komorebi-mint transition-colors">{dailyContent.prod?.name}</h3>
          <p className="text-sm text-gray-400 leading-relaxed">{dailyContent.prod?.desc}</p>
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-komorebi-mint">
            <MousePointerClick size={16} />
          </div>
        </div>

        {/* Quote */}
        <div 
            onClick={() => onExplore(`Analyze this quote: "${dailyContent.quote}". Who said it, what is the historical context, and how does it relate to Stoicism or high performance? Provide a complementary quote.`)}
            className="bg-komorebi-card border border-white/5 rounded-xl p-4 relative overflow-hidden group hover:border-komorebi-mint/30 hover:bg-white/5 cursor-pointer transition-all hover:scale-[1.01]"
        >
           <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Quote size={40} />
          </div>
          <div className="flex items-center gap-2 mb-2 text-komorebi-mint">
             <Quote size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Wisdom</span>
          </div>
          <p className="text-white/90 italic font-serif text-lg leading-relaxed group-hover:text-white transition-colors">
            {dailyContent.quote}
          </p>
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-komorebi-mint">
            <MousePointerClick size={16} />
          </div>
        </div>

        {/* Investor */}
        <div 
            onClick={() => onExplore(`Tell me about the investment philosophy of ${dailyContent.investor?.name}. What are their key principles found in "${dailyContent.investor?.resource}"? How can I apply this mindset?`)}
            className="bg-komorebi-card border border-komorebi-gold/20 rounded-xl p-4 relative overflow-hidden group hover:border-komorebi-gold/50 hover:bg-komorebi-gold/5 cursor-pointer transition-all hover:scale-[1.01]"
        >
           <div className="absolute top-0 right-0 p-3 opacity-10 text-komorebi-gold group-hover:opacity-20 transition-opacity">
            <BookOpen size={40} />
          </div>
          <div className="flex items-center justify-between mb-2 text-komorebi-gold">
            <div className="flex items-center gap-2">
               <BookOpen size={16} />
               <span className="text-xs font-bold uppercase tracking-wider">Investor of the Week</span>
            </div>
            <span className="text-[10px] bg-komorebi-gold/10 px-2 py-0.5 rounded text-komorebi-gold font-bold">WEEKLY</span>
          </div>
          <h3 className="text-komorebi-gold font-bold text-lg mb-1">{dailyContent.investor?.name}</h3>
          <p className="text-sm text-gray-400 italic mb-2">{dailyContent.investor?.resource}</p>
          <span className="inline-block text-[10px] font-mono bg-white/10 text-komorebi-gold px-2 py-1 rounded">
            {dailyContent.investor?.years}
          </span>
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-komorebi-gold">
            <MousePointerClick size={16} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DailyInspiration;