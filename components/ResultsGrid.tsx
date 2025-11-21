import React from 'react';
import { GeneratedName, Language } from '../types';
import { UI_TEXT } from '../constants';
import { WandIcon } from './Icons';

interface ResultsGridProps {
  results: GeneratedName[];
  isLoading: boolean;
  language: Language;
  onMoreLikeThis: (item: GeneratedName) => void;
}

export const ResultsGrid: React.FC<ResultsGridProps> = ({ results, isLoading, language, onMoreLikeThis }) => {
  if (isLoading) {
    // Skeleton loading state
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="glass-panel h-48 rounded-xl p-6 animate-pulse flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-6 w-1/2 bg-slate-700/50 rounded"></div>
              <div className="h-4 w-3/4 bg-slate-700/30 rounded"></div>
            </div>
            <div className="h-12 w-full bg-slate-700/20 rounded mt-4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 opacity-50">
        <div className="w-16 h-16 border-2 border-slate-600 rounded-full flex items-center justify-center mb-4">
           <span className="text-2xl">?</span>
        </div>
        <p>{UI_TEXT[language].noResults}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
       <div className="flex items-center justify-between border-b border-slate-800 pb-4">
         <h3 className="text-2xl font-bold text-white">{UI_TEXT[language].resultsTitle}</h3>
       </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((item, index) => (
          <div 
            key={index} 
            className="glass-panel rounded-xl p-6 group hover:bg-slate-800/80 transition-all duration-300 border-l-4 border-l-brand-500 hover:border-l-brand-400 relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-l from-slate-900/90 to-transparent pl-8">
                <button
                  onClick={() => onMoreLikeThis(item)}
                  className="flex items-center gap-1 text-xs bg-brand-600 hover:bg-brand-500 text-white px-2 py-1 rounded shadow shadow-black/50 transition-colors"
                  title={UI_TEXT[language].moreLikeThis}
                >
                  <WandIcon className="w-3 h-3" />
                  {UI_TEXT[language].moreLikeThis}
                </button>
                <button 
                  onClick={() => navigator.clipboard.writeText(item.name)}
                  className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-2 py-1 rounded shadow shadow-black/50"
                  title="Copy"
                >
                  Copy
                </button>
             </div>

            <h4 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 mb-1">
              {item.name}
            </h4>
            <p className="text-brand-400 text-sm font-medium mb-4 uppercase tracking-wide">
              {item.tagline}
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              {item.description}
            </p>
            
            <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
              <div className="text-xs px-2 py-1 rounded bg-dark-900 text-slate-500">
                .com
              </div>
               <div className="text-xs px-2 py-1 rounded bg-dark-900 text-slate-500">
                .io
              </div>
               <div className="text-xs px-2 py-1 rounded bg-dark-900 text-slate-500">
                .app
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
