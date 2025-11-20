import React, { useState, useEffect } from 'react';
import ModalWrapper from './ModalWrapper';
import { ExternalLink } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImport: (json: string) => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

const SettingsModal: React.FC<Props> = ({ isOpen, onClose, onImport, apiKey, onSaveApiKey }) => {
  const [keyInput, setKeyInput] = useState(apiKey);
  const [exportData, setExportData] = useState('');

  useEffect(() => {
    if (isOpen) {
        setKeyInput(apiKey);
        // Gather all local storage data for export
        const data: Record<string, any> = {};
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith('komorebi')) {
                try {
                    data[k] = JSON.parse(localStorage.getItem(k) || '');
                } catch (e) {
                    data[k] = localStorage.getItem(k);
                }
            }
        }
        setExportData(JSON.stringify(data, null, 2));
    }
  }, [isOpen, apiKey]);

  const handleImport = () => {
    try {
        onImport(exportData);
        alert("Data imported successfully. The app will reload.");
        window.location.reload();
    } catch (e) {
        alert("Invalid JSON data.");
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Settings">
      <div className="space-y-6">
        
        <section>
            <div className="flex justify-between items-baseline mb-2">
                <h3 className="text-komorebi-mint font-bold text-sm uppercase tracking-wider">Google Gemini API Key</h3>
                <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[10px] text-komorebi-gold hover:underline flex items-center gap-1"
                >
                    Get Key <ExternalLink size={10} />
                </a>
            </div>
            <p className="text-xs text-gray-400 mb-2">Required for the Jaguar AI (Chat & Search). Free tier available.</p>
            <input 
                type="password" 
                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-komorebi-gold"
                placeholder="AIzaSy..."
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
            />
            <button 
                onClick={() => onSaveApiKey(keyInput)}
                className="mt-2 bg-white/5 hover:bg-white/10 text-gray-300 px-4 py-2 rounded text-sm transition-colors border border-white/5"
            >
                Save Key
            </button>
        </section>

        <hr className="border-white/5" />

        <section>
            <h3 className="text-komorebi-mint font-bold text-sm uppercase tracking-wider mb-2">Data Management</h3>
            <p className="text-xs text-gray-400 mb-2">Backup or Restore your Komorebi data (Local Storage).</p>
            <textarea 
                className="w-full h-40 bg-black/20 border border-white/10 rounded-lg p-3 text-xs font-mono text-gray-400 focus:outline-none"
                value={exportData}
                onChange={(e) => setExportData(e.target.value)}
            />
            <div className="flex gap-2 mt-2">
                <button 
                    onClick={() => {navigator.clipboard.writeText(exportData); alert("Copied to clipboard!");}}
                    className="bg-komorebi-gold text-black px-4 py-2 rounded text-sm font-bold hover:bg-white transition-colors"
                >
                    Copy Backup
                </button>
                <button 
                    onClick={handleImport}
                    className="bg-white/5 hover:bg-komorebi-danger/20 hover:text-komorebi-danger hover:border-komorebi-danger/50 text-gray-300 px-4 py-2 rounded text-sm transition-colors border border-white/5"
                >
                    Restore from Text
                </button>
            </div>
        </section>
      </div>
    </ModalWrapper>
  );
};

export default SettingsModal;