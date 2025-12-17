import React from 'react';
import { TeamAnalysis } from '../types';
import { Activity, ShieldAlert, CheckCircle, RotateCw } from 'lucide-react';

interface AnalysisPanelProps {
  analysis: TeamAnalysis | null;
  loading: boolean;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysis, loading }) => {
  if (loading) {
    return (
      <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-700 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-700 bg-gray-900/50 flex justify-between items-center">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Activity className="text-blue-400" />
          Análisis Táctico
        </h3>
        <div className={`px-3 py-1 rounded-full font-bold text-lg ${analysis.rating >= 8 ? 'bg-green-600' : analysis.rating >= 5 ? 'bg-yellow-600' : 'bg-red-600'}`}>
          {analysis.rating}/10
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        <p className="text-gray-300 text-sm leading-relaxed italic">
          "{analysis.summary}"
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs uppercase font-bold text-green-400 mb-2 flex items-center gap-1">
              <CheckCircle size={14} /> Fortalezas
            </h4>
            <ul className="text-sm space-y-1">
              {analysis.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-300">
                  <span className="block w-1 h-1 mt-1.5 rounded-full bg-green-500 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
             <h4 className="text-xs uppercase font-bold text-red-400 mb-2 flex items-center gap-1">
              <ShieldAlert size={14} /> Debilidades
            </h4>
            <ul className="text-sm space-y-1">
              {analysis.weaknesses.map((w, i) => (
                 <li key={i} className="flex items-start gap-2 text-gray-300">
                  <span className="block w-1 h-1 mt-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {analysis.rotations.length > 0 && (
          <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
             <h4 className="text-xs uppercase font-bold text-purple-400 mb-2 flex items-center gap-1">
              <RotateCw size={14} /> Rotaciones Recomendadas
            </h4>
            <ul className="text-sm space-y-1 text-gray-300">
              {analysis.rotations.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
