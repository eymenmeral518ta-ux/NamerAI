export type Language = 'en' | 'tr';

export type Tone = 'modern' | 'professional' | 'creative' | 'playful' | 'minimal';

export type InputMode = 'description' | 'logo' | 'name';

export interface GeneratedName {
  name: string;
  tagline: string;
  description: string;
  domainAvailable?: boolean; // Simulated property for UI
}

export interface Translation {
  title: string;
  subtitle: string;
  toneLabel: string;
  generateButton: string;
  generating: string;
  errorMessage: string;
  resultsTitle: string;
  noResults: string;
  tones: {
    [key in Tone]: string;
  };
  footer: string;
  moreLikeThis: string;
  // Input Form Tabs
  modeDescription: string;
  modeLogo: string;
  modeName: string;
  // Description Source Sub-tabs
  sourceManual: string;
  sourceGithub: string;
  // GitHub Inputs
  githubUsernamePlaceholder: string;
  fetchReposButton: string;
  selectRepoPlaceholder: string;
  loadingRepos: string;
  noReposFound: string;
  repoFetchError: string;
  readmeFetchError: string;
  // Input Placeholders
  placeholderDescription: string;
  placeholderName: string;
  // Image Input
  uploadLabel: string;
  urlLabel: string;
  or: string;
  browse: string;
  imageError: string;
}

export interface LanguageDictionary {
  en: Translation;
  tr: Translation;
}