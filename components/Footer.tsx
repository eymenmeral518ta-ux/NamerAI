import React from 'react';
import { Language } from '../types';
import { UI_TEXT } from '../constants';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  return (
    <footer className="w-full py-6 text-center text-slate-600 text-sm border-t border-white/5 mt-8">
      <p>{UI_TEXT[language].footer}</p>
    </footer>
  );
};