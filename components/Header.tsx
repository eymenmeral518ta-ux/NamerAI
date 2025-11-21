import React from 'react';
import { Language } from '../types';
import { UI_TEXT } from '../constants';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({ language, setLanguage }) => {
  return (
    <header className="w-full py-6 px-8 flex justify-between items-center border-b border-white/5 backdrop-blur-sm sticky top-0 z-50 bg-dark-950/80">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-brand-500/20">
          N
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">
          {UI_TEXT[language].title}
        </h1>
      </div>

      <div className="glass-panel rounded-full p-1 flex items-center relative">
        {/* Sliding background pill */}
        <div 
          className={`absolute top-1 bottom-1 w-[40px] bg-brand-600 rounded-full transition-all duration-300 ease-out ${
            language === 'en' ? 'left-1' : 'left-[45px]'
          }`}
        />
        
        <button
          onClick={() => setLanguage('en')}
          className={`relative z-10 px-3 py-1 text-xs font-medium rounded-full transition-colors ${
            language === 'en' ? 'text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setLanguage('tr')}
          className={`relative z-10 px-3 py-1 text-xs font-medium rounded-full transition-colors ${
            language === 'tr' ? 'text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          TR
        </button>
      </div>
    </header>
  );
};