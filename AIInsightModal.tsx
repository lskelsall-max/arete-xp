import React from 'react';
import ModalWrapper from './ModalWrapper';
import { Bot, Database, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { VectorDocument } from '../../services/supabaseClient';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  query: string;
  answer: string | null;
  sources: VectorDocument[];
  error: string | null;
}

const AIInsightModal: React.FC<Props> = ({ isOpen, onClose, loading, query, answer, sources, error }) => {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Jaguar Insight">
      <div className="flex flex-col gap-4">
        {/* Query Context */}
        <div className="bg-white/5 border-l-2 border-komorebi-gold p-3 rounded-r text-xs text-gray-400 italic mb-2">
            "{query}"
        </div>

        {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4 text-komorebi-mint animate-pulse">
                <Bot size={48} />
                <div className="text-sm font-bold tracking-widest uppercase">Consulting the Spirits...</div>
            </div>
        ) : (
            <>
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-komorebi-mint/20 to-komorebi-bg border border-komorebi-mint/30 rounded-xl text-komorebi-mint shrink-0 shadow-inner">
                        <Sparkles size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                         <div className="prose prose-invert prose-sm max-w-none leading-relaxed text-gray-200">
                             {error ? (
                                 <p className="text-red-400">{error}</p>
                             ) : (
                                 <ReactMarkdown>{answer || ''}</ReactMarkdown>
                             )}
                         </div>
                    </div>
                </div>

                {sources.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-wider mb-3">
                            <Database size={12} />
                            <span>Knowledge Base Sources</span>
                        </div>
                        <div className="grid gap-2">
                            {sources.map((doc, i) => (
                                <div key={i} className="text-xs bg-black/20 p-3 rounded border border-white/5 text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-all">
                                    <div className="font-bold text-komorebi-gold mb-1">{doc.metadata?.title || 'Document'}</div>
                                    <div className="line-clamp-2">{doc.content}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </>
        )}
      </div>
    </ModalWrapper>
  );
};

export default AIInsightModal;