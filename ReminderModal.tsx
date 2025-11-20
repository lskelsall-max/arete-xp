
import React from 'react';
import ModalWrapper from './ModalWrapper';
import { Sunrise, Moon, ArrowRight } from 'lucide-react';

interface Props {
  type: 'morning' | 'evening' | null;
  onClose: () => void;
}

const ReminderModal: React.FC<Props> = ({ type, onClose }) => {
  if (!type) return null;

  const isMorning = type === 'morning';

  return (
    <ModalWrapper isOpen={!!type} onClose={onClose} title={isMorning ? "Morning Protocol" : "Evening Review"}>
      <div className="flex flex-col items-center text-center p-4">
        <div className={`p-4 rounded-full mb-4 ${isMorning ? 'bg-komorebi-gold/20 text-komorebi-gold' : 'bg-komorebi-mint/20 text-komorebi-mint'}`}>
          {isMorning ? <Sunrise size={48} /> : <Moon size={48} />}
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">
          {isMorning ? "The Sun Rises" : "The Day Closes"}
        </h3>
        
        <p className="text-gray-400 mb-6 leading-relaxed max-w-sm">
          {isMorning 
            ? "Set your intention. Review your mental models. Prepare the body and mind for the war of art."
            : "Measure your discipline. Log your protocols. Reflect on what was done and what was left undone."
          }
        </p>

        <button 
          onClick={onClose}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-black transition-all hover:scale-105 ${isMorning ? 'bg-komorebi-gold hover:bg-white' : 'bg-komorebi-mint hover:bg-white'}`}
        >
          <span>{isMorning ? "Begin Alignment" : "Start Review"}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </ModalWrapper>
  );
};

export default ReminderModal;
