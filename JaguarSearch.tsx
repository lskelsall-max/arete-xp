import React, { useState } from 'react';
import { Search, Send, Bot, Database } from 'lucide-react';
import { generateJaguarResponse } from '../services/geminiService';
import { AppConfig } from '../types';
import ReactMarkdown from 'react-markdown';
import { VectorDocument } from '../services/supabaseClient';

interface Props {
  config: AppConfig;
  hasApiKey: boolean;
}

const JaguarSearch: React.FC<Props> = ({ config, hasApiKey }) => {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [sources, setSources] = useState<VectorDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (!hasApiKey) {
        setAnswer("Please configure your Gemini API Key in Settings (⚙️) to consult the AI.");
        setIsOpen(true);
        return;
    }

    setLoading(true);
    setIsOpen(true);
    setAnswer(null);
    setSources([]);
    setError(null);

    try {
        // Filter local library items that match keywords for additional context
        const keywords = query.toLowerCase().split(' ').filter(w => w.length > 3);
        
        const relevantModels = config.library.mentalModels.filter(i => 
            keywords.some(k => i.name.toLowerCase().includes(k) || i.desc?.toLowerCase().includes(k))
        );
        const relevantProd = config.library.productivity.filter(i => 
            keywords.some(k => i.name.toLowerCase().includes(k) || i.desc?.toLowerCase().includes(k))
        );
        const relevantQuotes = config.library.quotes.filter(q => 
            keywords.some(k => q.toLowerCase().includes(k))
        );
        
        const contextItems = [...relevantModels, ...relevantProd];

        // Pass config.persona to the service
        const response = await generateJaguarResponse(query, contextItems, relevantQuotes, config.persona);
        setAnswer(response.answer);
        setSources(response.sources);
    } catch (err: any) {
        setError("The connection to the spirit realm was interrupted.");
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="mb-6 relative z-20">
      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-komorebi-gold transition-colors">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Ask the ${config.persona?.anima || 'Jaguar'}...`}
          className="w-full bg-komorebi-cardSoft/80 border border-white/10 text-white text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-komorebi-gold focus:ring-1 focus:ring-komorebi-gold/50 transition-all placeholder:text-gray-500 backdrop-blur-sm shadow-lg"
        />
        <button 
            type="submit"
            disabled={loading || !query}
            className="absolute inset-y-0 right-2 my-auto h-8 w-8 flex items-center justify-center rounded-lg bg-komorebi-gold text-komorebi-bg font-bold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
           {loading ? <div className="w-4 h-4 border-2 border-komorebi-bg border-t-transparent rounded-full animate-spin"/> : <Send size={16} />}
        </button>
      </form>

      {isOpen && (
        <div className="mt-4 p-5 bg-komorebi-card/95 border border-komorebi-mint/20 rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-2 relative backdrop-blur-xl">
           <button 
             onClick={() => setIsOpen(false)}
             className="absolute top-2 right-2 text-gray-500 hover:text-white transition-colors"
           >
             ✕
           </button>
           <div className="flex items-start gap-4">
             <div className="p-3 bg-gradient-to-br from-komorebi-mint/20 to-komorebi-bg border border-komorebi-mint/30 rounded-xl text-komorebi-mint shrink-0 shadow-inner">
               <Bot size={28} />
             </div>
             <div className="flex-1 min-w-0">
                <div className="prose prose-invert prose-sm max-w-none leading-relaxed text-gray-200">
                    {loading ? (
                        <p className="animate-pulse text-komorebi-gold italic">Consulting the spirits...</p>
                    ) : error ? (
                        <p className="text-red-400">{error}</p>
                    ) : (
                        <ReactMarkdown>{answer || ''}</ReactMarkdown>
                    )}
                </div>
                
                {!loading && sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/10">
                        <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">
                            <Database size={12} />
                            <span>Brain Sources</span>
                        </div>
                        <div className="grid gap-2">
                            {sources.map((doc, i) => (
                                <div key={i} className="text-xs bg-white/5 p-2 rounded border border-white/5 text-gray-300 truncate hover:whitespace-normal hover:bg-white/10 transition-all">
                                    {doc.metadata?.title || `Document ${doc.id}`}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default JaguarSearch;