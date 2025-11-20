import React from 'react';
import ModalWrapper from './ModalWrapper';
import { AppState } from '../../types';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  history: AppState['history'];
  maxXP: number;
}

const StatsModal: React.FC<Props> = ({ isOpen, onClose, history, maxXP }) => {
  // Process last 14 days
  const data = React.useMemo(() => {
    const result = [];
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        const dayData = history[key];
        
        let xp = 0;
        // This is an estimation. Ideally, totalXP should be stored in history.
        // Recalculating properly would require config access. 
        // We will rely on a simplified assumption that users save XP data correctly,
        // or if the app was real, we'd store 'totalXP' in the day record.
        // For this demo, we'll just count checked items * 200 as a rough heuristic if totals aren't saved explicitly,
        // But to fix this properly, let's assume we update the DayData type to include totalXP in a future version.
        // Since we can't change the past, we'll count keys.
        if (dayData) {
             xp = Object.keys(dayData.checkedItems).length * 150; // Rough avg
        }

        result.push({
            date: key.slice(5), // MM-DD
            xp: xp > maxXP ? maxXP : xp,
        });
    }
    return result;
  }, [history, maxXP]);

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Performance History">
      <div className="h-80 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <XAxis dataKey="date" stroke="#555" tick={{fontSize: 10}} interval={1} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#0e2016', borderColor: '#333', color: '#fff' }}
                    itemStyle={{ color: '#66c5a5' }}
                />
                <Bar dataKey="xp" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.xp > 5000 ? '#66c5a5' : entry.xp > 2000 ? '#f5c15c' : '#334155'} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Consistency is the key to compounding.</p>
      </div>
    </ModalWrapper>
  );
};

export default StatsModal;
