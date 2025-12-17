import React from 'react';
import { Character } from '../types';
import { TYPE_COLORS } from '../constants';
import { Plus, X, ExternalLink, Heart, RefreshCw, Users } from 'lucide-react';

interface CharacterCardProps {
  character: Character;
  onAction?: (char: Character) => void;
  actionType?: 'add' | 'remove';
  compact?: boolean;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ 
  character, 
  onAction, 
  actionType = 'add',
  compact = false 
}) => {
  const typeStyle = TYPE_COLORS[character.type] || 'bg-gray-600 border-gray-400 text-gray-100';
  const bgClass = typeStyle.split(' ')[0]; // Extract background class (e.g., bg-blue-600)
  
  // URL to search for the character on Dokkan Wiki
  const wikiUrl = `https://dokkan.wiki/cards?q=${encodeURIComponent(character.name)}`;

  // Safe access to categories default to empty array if undefined
  const categories = Array.isArray(character.categories) ? character.categories : [];

  // Mechanics Detection Logic
  const getMechanics = () => {
    const mechs = [];
    // Combine text to search keywords
    const text = (character.passiveSkill + ' ' + (character.links || []).join(' ')).toLowerCase();
    
    // Revival: Look for "reviv" (covers revive, revival, reviving) or "ko" context usually implies survival/revival
    if (text.includes('reviv')) { 
       mechs.push({ label: 'Revival', icon: Heart, className: 'bg-pink-900/60 text-pink-200 border-pink-700' });
    }
    
    // Transformation: Look for "transform" or specific link
    if (text.includes('transform') || (character.links || []).includes('Transform')) {
       mechs.push({ label: 'Transf.', icon: RefreshCw, className: 'bg-green-900/60 text-green-200 border-green-700' });
    }
    
    // Fusion (Action): Look for "fuse", "fusion" or "potara" in context of mechanics (less strict to ensure visibility)
    // Note: This might flag Fusion characters themselves, but that's often acceptable in this context
    if (text.includes('fuse') || text.includes('fusion') || text.includes('merg')) {
       mechs.push({ label: 'Fusión', icon: Users, className: 'bg-orange-900/60 text-orange-200 border-orange-700' });
    }
    
    return mechs;
  };

  const mechanics = getMechanics();

  if (compact) {
    return (
      <div 
        className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden transition-all hover:scale-105 h-32 flex flex-col items-center justify-center p-2 text-center ${typeStyle.replace('text-', 'text-white ')}`}
        onClick={() => onAction && onAction(character)}
      >
        {/* Wiki Link (Small corner icon) */}
        <a 
          href={wikiUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="absolute top-1 right-1 z-30 p-1 rounded-full bg-black/20 hover:bg-black/40 text-white/70 hover:text-white transition-colors"
          title="Ver en Dokkan Wiki"
        >
          <ExternalLink size={12} />
        </a>
        
        <div className="flex flex-col items-center gap-1 z-10">
           <span className="text-3xl font-bold opacity-40 select-none">{character.rarity}</span>
           <p className="text-sm font-bold leading-tight line-clamp-2 drop-shadow-md z-20">{character.name}</p>
           {/* Compact Mechanics Indicators */}
           <div className="flex gap-1 mt-1">
             {mechanics.map((m, i) => (
               <div key={i} title={m.label} className={`p-0.5 rounded-full border ${m.className}`}>
                 <m.icon size={8} />
               </div>
             ))}
           </div>
           <div className="mt-1 text-[10px] uppercase tracking-wider opacity-90 font-semibold border border-white/30 px-2 rounded-full bg-black/20">
             {character.type}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col border-l-4 rounded-r-lg bg-gray-800 shadow-lg overflow-hidden transition-transform hover:-translate-y-1 ${typeStyle.replace('bg-', 'border-')}`}>
      <div className="flex h-full">
        {/* Visual Section (Replaces Image) */}
        <div className={`w-24 flex-shrink-0 flex flex-col items-center justify-center ${bgClass} text-white`}>
          <span className="text-3xl font-bold drop-shadow-sm select-none">{character.rarity}</span>
          <span className="text-xs font-semibold mt-1 uppercase opacity-90">{character.class}</span>
        </div>

        {/* Info Section */}
        <div className="flex-1 p-3 flex flex-col justify-between min-h-[110px]">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="text-xs sm:text-sm text-gray-400 italic leading-none mb-1 line-clamp-1">{character.subtitle}</h3>
              <a 
                href={wikiUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-gray-500 hover:text-blue-400 transition-colors p-1"
                title="Ver en Dokkan Wiki"
              >
                <ExternalLink size={14} />
              </a>
            </div>
            
            <h2 className="font-bold text-base sm:text-lg leading-tight text-white mb-2">{character.name}</h2>
            
            {/* Mechanics Badges */}
            {mechanics.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {mechanics.map((mech, idx) => (
                  <span key={idx} className={`text-[10px] px-1.5 py-0.5 rounded border flex items-center gap-1 font-semibold uppercase tracking-wider ${mech.className}`}>
                    <mech.icon size={10} />
                    {mech.label}
                  </span>
                ))}
              </div>
            )}

            {/* Categories */}
            <div className="flex flex-wrap gap-1 mb-2">
              <span className={`text-xs px-2 py-0.5 rounded font-bold border ${typeStyle.replace('bg-', 'border-').replace('text-', 'text-')}`}>
                {character.type}
              </span>
              {categories.slice(0, 2).map((cat, idx) => (
                <span key={idx} className="text-xs bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded border border-gray-600 whitespace-nowrap">
                  {cat}
                </span>
              ))}
               {categories.length > 2 && (
                <span className="text-xs text-gray-500 px-1 py-0.5">+{categories.length - 2}</span>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-end mt-1">
             <div className="text-xs text-gray-500 font-mono">
                HP:{character.stats?.hp ?? '???'} ATK:{character.stats?.atk ?? '???'}
             </div>
             {onAction && (
              <button 
                onClick={(e) => { e.stopPropagation(); onAction(character); }}
                className={`p-1.5 rounded-full transition-colors ${actionType === 'add' ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-red-600 hover:bg-red-500 text-white'}`}
              >
                {actionType === 'add' ? <Plus size={16} /> : <X size={16} />}
              </button>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};