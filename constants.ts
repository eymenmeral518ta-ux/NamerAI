import { LanguageDictionary } from './types';

export const UI_TEXT: LanguageDictionary = {
  en: {
    title: "NamerAI",
    subtitle: "Discover the perfect name for your next software project.",
    toneLabel: "Select Tone",
    generateButton: "Generate Names",
    generating: "Dreaming up names...",
    errorMessage: "Something went wrong while communicating with the AI. Please try again.",
    resultsTitle: "Generated Ideas",
    noResults: "Enter a description, upload a logo, or provide a reference name to get started.",
    tones: {
      modern: "Modern & Techy",
      professional: "Professional",
      creative: "Creative & Abstract",
      playful: "Playful & Fun",
      minimal: "Minimalist",
    },
    footer: "Powered by Google Gemini 2.5",
    moreLikeThis: "More like this",
    
    modeDescription: "README / Description",
    modeLogo: "Logo / Visual",
    modeName: "Similar Name",

    sourceManual: "Normal",
    sourceGithub: "GitHub Repo",
    
    githubUsernamePlaceholder: "GitHub Username",
    fetchReposButton: "Find Repos",
    selectRepoPlaceholder: "Select a Repository...",
    loadingRepos: "Loading...",
    noReposFound: "No public repositories found.",
    repoFetchError: "Could not fetch repositories. Check username.",
    readmeFetchError: "Could not fetch README.md for this repository.",
    
    placeholderDescription: "Describe your program (e.g., A fast code editor for Python developers...)",
    placeholderName: "Enter a name you like (e.g., 'Spotify', 'Slack')...",
    
    uploadLabel: "Upload Logo",
    urlLabel: "Or paste Image URL",
    or: "or",
    browse: "Browse Files",
    imageError: "Could not load image. Please check the URL (CORS restrictions) or try uploading a file."
  },
  tr: {
    title: "NamerAI",
    subtitle: "Bir sonraki yazılım projeniz için mükemmel ismi keşfedin.",
    toneLabel: "Ton Seçimi",
    generateButton: "İsim Oluştur",
    generating: "İsimler düşünülüyor...",
    errorMessage: "Yapay zeka ile iletişim kurulurken bir hata oluştu. Lütfen tekrar deneyin.",
    resultsTitle: "Oluşturulan Fikirler",
    noResults: "Başlamak için bir açıklama girin, logo yükleyin veya benzer bir isim yazın.",
    tones: {
      modern: "Modern & Teknolojik",
      professional: "Profesyonel",
      creative: "Yaratıcı & Soyut",
      playful: "Eğlenceli & Neşeli",
      minimal: "Minimalist",
    },
    footer: "Google Gemini 2.5 tarafından desteklenmektedir",
    moreLikeThis: "Buna benzer üret",
    
    modeDescription: "README / Açıklama",
    modeLogo: "Logo / Görsel",
    modeName: "Benzer İsim",

    sourceManual: "Normal",
    sourceGithub: "GitHub Deposu",
    
    githubUsernamePlaceholder: "GitHub Kullanıcı Adı",
    fetchReposButton: "Depoları Bul",
    selectRepoPlaceholder: "Bir Depo Seçin...",
    loadingRepos: "Yükleniyor...",
    noReposFound: "Herkese açık depo bulunamadı.",
    repoFetchError: "Depolar getirilemedi. Kullanıcı adını kontrol edin.",
    readmeFetchError: "Bu depo için README.md getirilemedi.",
    
    placeholderDescription: "Programınızı tarif edin (örneğin: Python geliştiricileri için hızlı bir kod editörü...)",
    placeholderName: "Beğendiğiniz bir ismi girin (örn: 'Spotify')...",
    
    uploadLabel: "Logo Yükle",
    urlLabel: "Veya Resim URL'si yapıştır",
    or: "veya",
    browse: "Dosya Seç",
    imageError: "Resim yüklenemedi. URL'yi kontrol edin (CORS kısıtlaması olabilir) veya dosya yüklemeyi deneyin."
  }
};