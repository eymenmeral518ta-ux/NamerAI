import React, { useState, useRef } from 'react';
import { Language, Tone, InputMode } from '../types';
import { UI_TEXT } from '../constants';
import { SparklesIcon, PhotoIcon, DocumentTextIcon, TagIcon, GithubIcon } from './Icons';

interface InputFormProps {
  language: Language;
  onGenerate: (input: any, tone: Tone) => void;
  isLoading: boolean;
}

interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  default_branch: string;
  owner: {
    login: string;
  };
}

export const InputForm: React.FC<InputFormProps> = ({ language, onGenerate, isLoading }) => {
  const [mode, setMode] = useState<InputMode>('description');
  const [tone, setTone] = useState<Tone>('modern');
  
  // Description Mode Sub-state
  const [descriptionSource, setDescriptionSource] = useState<'manual' | 'github'>('manual');
  const [githubUsername, setGithubUsername] = useState('');
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [repoError, setRepoError] = useState<string | null>(null);

  // Inputs
  const [description, setDescription] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = UI_TEXT[language];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImageUrl(''); // Clear URL if file selected
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    if (url) {
      setSelectedFile(null);
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const fetchRepos = async () => {
    if (!githubUsername.trim()) return;
    setIsLoadingRepos(true);
    setRepoError(null);
    setRepos([]);
    
    try {
      const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=50`);
      if (!response.ok) throw new Error(t.repoFetchError);
      const data = await response.json();
      if (Array.isArray(data)) {
        setRepos(data);
      } else {
        setRepos([]);
      }
    } catch (err) {
      setRepoError(t.repoFetchError);
    } finally {
      setIsLoadingRepos(false);
    }
  };

  const handleRepoSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const repoName = e.target.value;
    if (!repoName) return;

    // Find selected repo object
    const repo = repos.find(r => r.name === repoName);
    if (!repo) return;

    setIsLoadingRepos(true);
    setRepoError(null);

    try {
      // Fetch README using GitHub API to get content (returns base64)
      const response = await fetch(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/readme`);
      
      if (!response.ok) {
         // Try lowercasing readme.md or other variants if needed, but API usually handles this.
         // If 404, it means no readme.
         throw new Error(t.readmeFetchError);
      }
      
      const data = await response.json();
      // Decode base64 content
      // content is in data.content, encoding is 'base64'
      if (data.content && data.encoding === 'base64') {
        // Using atob for browser base64 decode, handle unicode properly
        const binaryString = window.atob(data.content.replace(/\s/g, ''));
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const decodedContent = new TextDecoder().decode(bytes);
        
        setDescription(decodedContent);
        // Optional: Switch back to manual view to show the text
        // setDescriptionSource('manual'); 
      } else {
        throw new Error(t.readmeFetchError);
      }
    } catch (err) {
      setRepoError(t.readmeFetchError);
    } finally {
      setIsLoadingRepos(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let payload: any = null;

    if (mode === 'description') {
      if (!description.trim()) return;
      payload = { type: 'text', content: description };
    } else if (mode === 'name') {
      if (!nameInput.trim()) return;
      payload = { type: 'similar', content: nameInput };
    } else if (mode === 'logo') {
      if (!imagePreview) return;
      
      let finalBase64 = imagePreview;
      let mimeType = 'image/png'; // default

      if (imageUrl) {
        try {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          mimeType = blob.type;
          
          const reader = new FileReader();
          finalBase64 = await new Promise((resolve) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
        } catch (err) {
          alert(t.imageError);
          return;
        }
      } else if (selectedFile) {
         mimeType = selectedFile.type;
      }

      const base64Data = (finalBase64 as string).split(',')[1];
      
      payload = { 
        type: 'image', 
        content: base64Data,
        mimeType: mimeType
      };
    }

    if (payload) {
      onGenerate(payload, tone);
    }
  };

  return (
    <div className="glass-panel rounded-2xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-slate-700 bg-dark-900/50">
        <button
          onClick={() => setMode('description')}
          className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
            mode === 'description' ? 'text-brand-400 bg-white/5 border-b-2 border-brand-500' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <DocumentTextIcon className="w-4 h-4" />
          {t.modeDescription}
        </button>
        <button
          onClick={() => setMode('logo')}
          className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
            mode === 'logo' ? 'text-brand-400 bg-white/5 border-b-2 border-brand-500' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <PhotoIcon className="w-4 h-4" />
          {t.modeLogo}
        </button>
        <button
          onClick={() => setMode('name')}
          className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
            mode === 'name' ? 'text-brand-400 bg-white/5 border-b-2 border-brand-500' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <TagIcon className="w-4 h-4" />
          {t.modeName}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Input Area Based on Mode */}
        <div className="min-h-[200px]">
          {mode === 'description' && (
            <div className="animate-fade-in flex flex-col h-full">
               {/* Description Source Toggles */}
               <div className="flex p-1 bg-dark-800 rounded-lg mb-4 w-fit">
                  <button
                    type="button"
                    onClick={() => setDescriptionSource('manual')}
                    className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                      descriptionSource === 'manual' 
                        ? 'bg-slate-600 text-white shadow-md' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.sourceManual}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDescriptionSource('github')}
                    className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                      descriptionSource === 'github' 
                        ? 'bg-brand-700 text-white shadow-md' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <GithubIcon className="w-3 h-3" />
                    {t.sourceGithub}
                  </button>
               </div>

               {descriptionSource === 'github' && (
                 <div className="mb-4 p-4 rounded-xl bg-dark-800/50 border border-slate-700 space-y-3 animate-fade-in">
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={githubUsername}
                        onChange={(e) => setGithubUsername(e.target.value)}
                        placeholder={t.githubUsernamePlaceholder}
                        className="flex-1 bg-dark-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-brand-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={fetchRepos}
                        disabled={isLoadingRepos || !githubUsername}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        {isLoadingRepos ? t.loadingRepos : t.fetchReposButton}
                      </button>
                    </div>

                    {repoError && <p className="text-red-400 text-xs">{repoError}</p>}

                    {repos.length > 0 && (
                      <select
                        onChange={handleRepoSelect}
                        className="w-full bg-dark-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer"
                        defaultValue=""
                      >
                        <option value="" disabled>{t.selectRepoPlaceholder}</option>
                        {repos.map(repo => (
                          <option key={repo.id} value={repo.name}>{repo.name}</option>
                        ))}
                      </select>
                    )}
                    
                    {repos.length === 0 && !isLoadingRepos && !repoError && githubUsername && (
                       // Placeholder or empty state helper could go here
                       null
                    )}
                 </div>
               )}

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.placeholderDescription}
                className="w-full flex-grow min-h-[12rem] bg-dark-800/50 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-y outline-none"
                required={mode === 'description'}
              />
            </div>
          )}

          {mode === 'name' && (
            <div className="animate-fade-in flex items-center justify-center h-48">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder={t.placeholderName}
                className="w-full bg-dark-800/50 border border-slate-700 rounded-xl p-4 text-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none text-center"
                required={mode === 'name'}
              />
            </div>
          )}

          {mode === 'logo' && (
            <div className="animate-fade-in space-y-4">
              {/* Image Preview Area */}
              {imagePreview ? (
                <div className="relative w-full h-48 bg-dark-900/50 rounded-xl border border-slate-700 flex items-center justify-center overflow-hidden group">
                  <img src={imagePreview} alt="Preview" className="h-full object-contain" />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setSelectedFile(null);
                        setImageUrl('');
                      }}
                      className="bg-red-500/80 hover:bg-red-500 text-white px-3 py-1 rounded-full text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 border-2 border-dashed border-slate-700 hover:border-brand-500 hover:bg-brand-500/5 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all group"
                >
                  <PhotoIcon className="w-8 h-8 text-slate-500 group-hover:text-brand-500 mb-2" />
                  <span className="text-slate-400 text-sm font-medium group-hover:text-brand-400">{t.uploadLabel}</span>
                </div>
              )}
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-900 px-2 text-slate-500">{t.or}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <input 
                  type="url" 
                  value={imageUrl}
                  onChange={handleUrlChange}
                  placeholder={t.urlLabel}
                  className="flex-1 bg-dark-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Tone Selector */}
        <div>
          <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
            {t.toneLabel}
          </label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(t.tones) as Tone[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setTone(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                  tone === key
                    ? 'bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-500/20'
                    : 'bg-dark-800/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
                }`}
              >
                {t.tones[key]}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || (mode === 'description' && !description) || (mode === 'name' && !nameInput) || (mode === 'logo' && !imagePreview)}
          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
            isLoading || (mode === 'description' && !description) || (mode === 'name' && !nameInput) || (mode === 'logo' && !imagePreview)
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white shadow-lg shadow-brand-500/25 transform hover:-translate-y-0.5'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t.generating}
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              {t.generateButton}
            </>
          )}
        </button>
      </form>
    </div>
  );
};