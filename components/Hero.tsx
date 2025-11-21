import React from 'react';
import { Language } from '../types';
import { UI_TEXT } from '../constants';

interface HeroProps {
  language: Language;
}

export const Hero: React.FC<HeroProps> = ({ language }) => {
  return (
    <div className="text-center space-y-4 mt-8">
      <div className="inline-block px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-sm font-medium mb-2">
        AI Powered Naming
      </div>
      <h2 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-brand-200 pb-2">
        {language === 'en' ? 'Name Your Creation' : 'Eserinize İsim Verin'}
      </h2>
      <p className="text-slate-400 text-lg max-w-2xl mx-auto">
        {UI_TEXT[language].subtitle}
      </p>
    </div>
  );
};