import React, { useState } from 'react';
import { TeamBuilder } from './components/TeamBuilder';
import { AnalysisPanel } from './components/AnalysisPanel';
import { Character, TeamAnalysis } from './types';
import { analyzeTeamSynergy, generateTeamFromInput, generateFullTeamFromCategory } from './services/geminiService';
import { Zap, Trash2, Github, Users, Wand2, ArrowRight, Search, LayoutGrid, PenTool } from 'lucide-react';

const TEAM_SIZE = 7;

// Popular Categories for Quick Select
const POPULAR_CATEGORIES = [
  "Pure Saiyans",
  "Movie Heroes",
  "Future Saga",
  "Power of Wishes",
  "Realm of Gods",
  "Majin Buu Saga",
  "Tournament of Power",
  "Super Heroes",
  "Movie Bosses",
  "Terrifying Conquerors"
];

export default function App() {
  // State
  const [activeTab, setActiveTab] = useState<'manual' | 'auto'>('manual');
  const [team, setTeam] = useState<(Character | null)[]>(Array(TEAM_SIZE).fill(null));
  
  // Manual Inputs
  const [teamInput, setTeamInput] = useState('');
  
  // Auto Inputs
  const [selectedCategory, setSelectedCategory] = useState(POPULAR_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [useCustomCategory, setUseCustomCategory] = useState(false);

  // Status & Data
  const [sources, setSources] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<TeamAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Handlers
  const handleRemoveFromTeam = (index: number) => {
    const newTeam = [...team];
    newTeam[index] = null;
    setTeam(newTeam);
    setAnalysis(null);
  };

  const handleClearTeam = () => {
    setTeam(Array(TEAM_SIZE).fill(null));
    setAnalysis(null);
    setTeamInput('');
    setSources([]);
  }

  // MANUAL MODE: Add specific characters
  const handleGenerateTeam = async () => {
    if (!teamInput.trim()) return;

    if (team.every(slot => slot !== null)) {
        alert("El equipo está lleno. Elimina algún personaje antes de añadir más.");
        return;
    }

    setIsGenerating(true);
    setAnalysis(null);
    setSources([]); 
    
    try {
      const { characters, sources: newSources } = await generateTeamFromInput(teamInput);
      setSources(newSources);

      if (characters.length === 0) {
        alert("No se pudieron encontrar personajes. Intenta ser más específico.");
        return;
      }
      
      setTeam(prevTeam => {
          const newTeam = [...prevTeam];
          let charIndex = 0;
          for (let i = 0; i < TEAM_SIZE; i++) {
              if (newTeam[i] === null && charIndex < characters.length) {
                  newTeam[i] = characters[charIndex];
                  charIndex++;
              }
          }
          return newTeam;
      });
      setTeamInput('');

    } catch (error) {
      console.error("Error generating team:", error);
      alert("Error al generar personajes.");
    } finally {
      setIsGenerating(false);
    }
  };

  // AUTO MODE: Generate full team from category
  const handleAutoGenerateTeam = async () => {
    const categoryToSearch = useCustomCategory ? customCategory : selectedCategory;
    if (!categoryToSearch.trim()) return;

    setIsGenerating(true);
    setAnalysis(null);
    setSources([]);

    try {
      const { characters, sources: newSources } = await generateFullTeamFromCategory(categoryToSearch);
      setSources(newSources);

      if (characters.length === 0) {
        alert("No se pudo generar un equipo para esa categoría.");
        return;
      }

      // In auto mode, we overwrite the team to ensure synergy
      // Pad with nulls if fewer than 7 returned (unlikely)
      const newTeam = Array(TEAM_SIZE).fill(null);
      characters.slice(0, TEAM_SIZE).forEach((char, idx) => {
        newTeam[idx] = char;
      });
      
      setTeam(newTeam);

    } catch (error) {
      console.error("Error auto generating team:", error);
      alert("Error al generar el equipo automático.");
    } finally {
      setIsGenerating(false);
    }
  }

  const handleAnalyze = async () => {
    if (team.every(slot => slot === null)) {
        alert("Genera un equipo antes de analizar.");
        return;
    }
    setIsAnalyzing(true);
    const result = await analyzeTeamSynergy(team);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-blue-500 selection:text-white pb-20">
      {/* Header */}
      <header className="bg-[#1e293b] border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center font-bold text-lg shadow-lg animate-pulse">
              Z
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Dokkan Tactician
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github size={20} />
             </a>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm">
           <div className="max-w-5xl mx-auto px-4 w-full flex gap-6">
              <button 
                onClick={() => setActiveTab('manual')}
                className={`flex items-center gap-2 py-3 px-2 border-b-2 transition-all font-medium text-sm md:text-base ${activeTab === 'manual' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
              >
                <PenTool size={16} /> Constructor Manual
              </button>
              <button 
                onClick={() => setActiveTab('auto')}
                className={`flex items-center gap-2 py-3 px-2 border-b-2 transition-all font-medium text-sm md:text-base ${activeTab === 'auto' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
              >
                <LayoutGrid size={16} /> Generador Automático
              </button>
           </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        
        {/* Input Section - Swaps based on Tab */}
        <section className="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-xl relative overflow-hidden transition-all">
           <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              {activeTab === 'manual' ? <Wand2 size={120} /> : <LayoutGrid size={120} />}
           </div>
           
           <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${activeTab === 'manual' ? 'text-blue-400' : 'text-purple-400'}`}>
             {activeTab === 'manual' ? <Wand2 size={24} /> : <LayoutGrid size={24} />}
             {activeTab === 'manual' ? 'Añadir Personajes' : 'Generador de Equipos Meta'}
           </h2>
           
           {activeTab === 'manual' ? (
             <>
               <p className="text-gray-400 mb-4">
                 Escribe nombres (ej: "Beast Gohan, Orange Piccolo") para <strong>añadirlos</strong> a los huecos libres.
               </p>
               <div className="flex flex-col md:flex-row gap-4 mb-4">
                 <div className="flex-1">
                   <textarea
                     value={teamInput}
                     onChange={(e) => setTeamInput(e.target.value)}
                     onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleGenerateTeam();
                        }
                     }}
                     placeholder="Ej: Beast Gohan, 10th Anniversary Vegito (Pulsa Enter para añadir)"
                     className="w-full h-24 bg-gray-900 border border-gray-600 rounded-lg p-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none placeholder-gray-600"
                   />
                 </div>
                 <button
                    onClick={handleGenerateTeam}
                    disabled={isGenerating || !teamInput.trim()}
                    className="md:w-48 bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg flex flex-col items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
                 >
                    {isGenerating ? (
                       <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                    ) : (
                       <div className="flex flex-col items-center">
                          <Search size={20} className="mb-1 opacity-70" />
                          <ArrowRight size={24} />
                       </div>
                    )}
                    <span>{isGenerating ? 'Buscando...' : 'Buscar y Añadir'}</span>
                 </button>
               </div>
             </>
           ) : (
             <>
                <p className="text-gray-400 mb-4">
                 Selecciona una categoría y la IA <strong>creará el mejor equipo posible</strong> buscando en internet las unidades más recientes.
               </p>
               
               <div className="flex flex-col md:flex-row gap-4 mb-4 items-start md:items-center">
                  <div className="flex-1 w-full space-y-3">
                     {!useCustomCategory ? (
                        <select 
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                        >
                           {POPULAR_CATEGORIES.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                           ))}
                        </select>
                     ) : (
                        <input 
                           type="text"
                           value={customCategory}
                           onChange={(e) => setCustomCategory(e.target.value)}
                           placeholder="Escribe el nombre de la categoría (ej: Crossover)"
                           className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                     )}
                     
                     <div className="flex items-center gap-2">
                        <input 
                           type="checkbox" 
                           id="customCat" 
                           checked={useCustomCategory}
                           onChange={(e) => setUseCustomCategory(e.target.checked)}
                           className="w-4 h-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-gray-900"
                        />
                        <label htmlFor="customCat" className="text-sm text-gray-400 cursor-pointer select-none">
                           Escribir categoría manualmente
                        </label>
                     </div>
                  </div>

                  <button
                    onClick={handleAutoGenerateTeam}
                    disabled={isGenerating || (useCustomCategory && !customCategory.trim())}
                    className="w-full md:w-48 h-12 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
                 >
                    {isGenerating ? (
                       <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                    ) : (
                       <Wand2 size={20} />
                    )}
                    <span>{isGenerating ? 'Generando...' : 'Crear Equipo'}</span>
                 </button>
               </div>
             </>
           )}
           
           {/* Sources Display */}
           {sources.length > 0 && (
             <div className="mt-4 pt-4 border-t border-gray-700 animate-in fade-in slide-in-from-top-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2">
                   <Search size={12} /> Fuentes Verificadas
                </h4>
                <div className="flex flex-wrap gap-2">
                   {sources.map((src, idx) => (
                      <a 
                        key={idx} 
                        href={src} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs bg-gray-900 text-blue-400 hover:text-blue-300 px-2 py-1 rounded border border-gray-700 truncate max-w-[200px] transition-colors"
                      >
                         {new URL(src).hostname.replace('www.', '')}
                      </a>
                   ))}
                </div>
             </div>
           )}
        </section>

        {/* Team Display Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
             <h2 className="text-xl font-bold flex items-center gap-2 text-gray-200">
                <Users size={20} /> Tu Formación
             </h2>
             <div className="flex gap-2">
                <button 
                  onClick={handleClearTeam}
                  className="px-3 py-1.5 text-sm bg-red-900/50 text-red-200 border border-red-800 rounded-lg hover:bg-red-900 transition-colors flex items-center gap-1"
                >
                    <Trash2 size={14} /> Limpiar
                </button>
                <button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || team.every(t => t === null)}
                    className="px-4 py-1.5 text-sm bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 border border-gray-600"
                >
                    {isAnalyzing ? (
                        <span className="animate-spin">⌛</span>
                    ) : (
                        <Zap size={16} className="text-yellow-400" />
                    )}
                    {isAnalyzing ? 'Analizando...' : 'Analizar Sinergia'}
                </button>
             </div>
          </div>
          
          <TeamBuilder team={team} onRemove={handleRemoveFromTeam} />
          
          <AnalysisPanel analysis={analysis} loading={isAnalyzing} />
        </div>

      </main>
    </div>
  );
}