import React from 'react';
import { Character } from '../types';
import { CharacterCard } from './CharacterCard';
import { Crown, User, Users } from 'lucide-react';

interface TeamBuilderProps {
  team: (Character | null)[];
  onRemove: (index: number) => void;
}

export const TeamBuilder: React.FC<TeamBuilderProps> = ({ team, onRemove }) => {
  return (
    <div className="w-full bg-gray-900/50 p-4 rounded-xl border border-gray-700 backdrop-blur-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Leader Slot */}
        <div className="relative">
          <div className="absolute -top-3 left-3 z-10 bg-yellow-600 text-white text-xs font-bold px-2 py-0.5 rounded shadow-lg flex items-center gap-1">
            <Crown size={12} /> LÍDER
          </div>
          {team[0] ? (
            <CharacterCard character={team[0]} onAction={() => onRemove(0)} actionType="remove" />
          ) : (
            <EmptySlot index={0} label="Líder" />
          )}
        </div>

        {/* Sub Slots 1-4 */}
        {team.slice(1, 6).map((char, idx) => (
           <div key={idx + 1} className="relative">
              <div className="absolute -top-3 left-3 z-10 bg-gray-700 text-gray-300 text-xs font-bold px-2 py-0.5 rounded shadow-lg flex items-center gap-1">
                <User size={12} /> SUB {idx + 1}
              </div>
             {char ? (
               <CharacterCard character={char} onAction={() => onRemove(idx + 1)} actionType="remove" />
             ) : (
               <EmptySlot index={idx + 1} label={`Sub ${idx + 1}`} />
             )}
           </div>
        ))}

        {/* Friend Slot */}
         <div className="relative">
          <div className="absolute -top-3 left-3 z-10 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded shadow-lg flex items-center gap-1">
            <Users size={12} /> AMIGO
          </div>
          {team[6] ? (
            <CharacterCard character={team[6]} onAction={() => onRemove(6)} actionType="remove" />
          ) : (
            <EmptySlot index={6} label="Amigo" />
          )}
        </div>
      </div>
    </div>
  );
};

const EmptySlot = ({ index, label }: { index: number; label: string }) => (
  <div className="h-32 w-full border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-500 bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mb-2">
      <span className="text-xl font-bold">{index === 6 ? 'F' : index + 1}</span>
    </div>
    <span className="text-sm font-medium">{label}</span>
  </div>
);
