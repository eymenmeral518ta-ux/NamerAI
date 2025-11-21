import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { InputForm } from './components/InputForm';
import { ResultsGrid } from './components/ResultsGrid';
import { Footer } from './components/Footer';
import { generateProgramNames, generateRelatedNames, GenerationInput } from './services/geminiService';
import { GeneratedName, Language, Tone } from './types';
import { UI_TEXT } from './constants';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [results, setResults] = useState<GeneratedName[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Store last request to provide context for "More like this" feature
  // content is now generic, but for "More like this" we usually need a text description.
  // If generated from image or simple name, we might need to rely on the new name as the only context.
  const [lastContext, setLastContext] = useState<{description?: string, tone: Tone} | null>(null);

  const handleGenerate = async (input: GenerationInput, tone: Tone) => {
    setIsLoading(true);
    setError(null);
    setResults([]);
    
    // If it's text, we save it as description context.
    // If it's image or similar name, we might not have a full description for later re-use in the same way,
    // but generateRelatedNames can adapt.
    if (input.type === 'text') {
      setLastContext({ description: input.content, tone });
    } else {
      setLastContext({ tone }); // No text description available
    }
    
    try {
      const names = await generateProgramNames(input, tone, language);
      setResults(names);
    } catch (err) {
      console.error(err);
      setError(UI_TEXT[language].errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoreLikeThis = async (item: GeneratedName) => {
    setIsLoading(true);
    setError(null);
    setResults([]); 

    try {
      // If we have a previous description, use it. Otherwise just use the name itself as context implies.
      const descriptionContext = lastContext?.description || `A program named ${item.name}: ${item.description}`;
      const toneContext = lastContext?.tone || 'modern';

      const names = await generateRelatedNames(
        item.name, 
        descriptionContext, 
        toneContext, 
        language
      );
      setResults(names);
    } catch (err) {
      console.error(err);
      setError(UI_TEXT[language].errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-dark-950 via-dark-900 to-brand-900 text-white font-sans selection:bg-brand-500 selection:text-white">
      <Header language={language} setLanguage={setLanguage} />
      
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center gap-12">
        <Hero language={language} />
        
        <div className="w-full max-w-2xl z-10">
          <InputForm 
            language={language} 
            onGenerate={handleGenerate} 
            isLoading={isLoading}
          />
        </div>

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 animate-fade-in">
            {error}
          </div>
        )}

        <div className="w-full max-w-6xl">
          <ResultsGrid 
            results={results} 
            isLoading={isLoading} 
            language={language}
            onMoreLikeThis={handleMoreLikeThis}
          />
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
};

export default App;