export interface Tab {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  isIncognito: boolean;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  history: string[];
  historyIndex: number;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  icon?: string;
  category?: string;
  createdAt: number;
}

export interface HistoryItem {
  id: string;
  title: string;
  url: string;
  timestamp: number;
  isIncognito: boolean;
}

export interface DownloadTask {
  id: string;
  filename: string;
  url: string;
  totalBytes: number;
  downloadedBytes: number;
  progress: number;
  speed: string;
  status: 'pending' | 'downloading' | 'completed' | 'failed' | 'cancelled';
  mimeType: string;
  createdAt: number;
  errorMessage?: string;
  localPath?: string;
}

export interface ShieldSettings {
  adBlockEnabled: boolean;
  adultContentBlocked: boolean;
  antiTracking: boolean;
  forceHttps: boolean;
  dataSaver: boolean;
  blockedAdsCount: number;
  blockedTrackersCount: number;
}

export interface BrowserSettings {
  searchEngine: 'google' | 'duckduckgo' | 'bing' | 'brave';
  homepage: string;
  desktopMode: boolean;
  readerAutoClean: boolean;
  clearHistoryOnExit: boolean;
  defaultDownloadQuality: 'high' | 'medium' | 'fast';
  theme: 'dark' | 'midnight' | 'amoled';
}

export interface AiMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  isError?: boolean;
  canRetry?: boolean;
}
