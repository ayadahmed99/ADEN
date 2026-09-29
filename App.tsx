import React, { useState, useEffect, useRef } from 'react';
import { Tab, Bookmark, HistoryItem, DownloadTask, ShieldSettings, BrowserSettings } from './types';
import { BookmarkService } from './services/bookmarkService';
import { HistoryService } from './services/historyService';
import { DirectDownloadService } from './services/directDownloadService';
import { AdBlockService } from './services/adBlocker';
import { NativeBrowserService } from './services/nativeBrowser';

import { AddressBar } from './components/AddressBar';
import { BottomBar } from './components/BottomBar';
import { TurboNotification } from './components/TurboNotification';
import { ApkDownloadBanner } from './components/ApkDownloadBanner';
import { AdenAiModal } from './components/AdenAiModal';
import { TabManager } from './components/TabManager';
import { MenuSheet } from './components/MenuSheet';
import { ShieldModal } from './components/ShieldModal';
import { HistoryModal } from './components/HistoryModal';
import { BookmarksModal } from './components/BookmarksModal';
import { DownloadsModal } from './components/DownloadsModal';
import { DirectDownloadModal } from './components/DirectDownloadModal';
import { ReaderMode } from './components/ReaderMode';
import { SettingsModal } from './components/SettingsModal';
import { NewTab } from './components/NewTab';

export const App: React.FC = () => {
  // --- Tabs State ---
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: 'tab-initial',
      url: 'aden://newtab',
      title: 'تبويب جديد',
      isIncognito: false,
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      history: ['aden://newtab'],
      historyIndex: 0
    }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-initial');

  // --- Settings & Protection State ---
  const [isTurboActive, setIsTurboActive] = useState<boolean>(true);
  const [isDesktopMode, setIsDesktopMode] = useState<boolean>(false);
  const [shieldSettings, setShieldSettings] = useState<ShieldSettings>({
    adBlockEnabled: true,
    adultContentBlocked: true,
    antiTracking: true,
    forceHttps: true,
    dataSaver: true,
    blockedAdsCount: 142,
    blockedTrackersCount: 89
  });

  const [browserSettings, setBrowserSettings] = useState<BrowserSettings>({
    searchEngine: 'google',
    homepage: 'aden://newtab',
    desktopMode: false,
    readerAutoClean: true,
    clearHistoryOnExit: false,
    defaultDownloadQuality: 'high',
    theme: 'dark'
  });

  // --- Modals State ---
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isTabManagerOpen, setIsTabManagerOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShieldOpen, setIsShieldOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isDownloadsOpen, setIsDownloadsOpen] = useState(false);
  const [isDirectDownloadOpen, setIsDirectDownloadOpen] = useState(false);
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [adultWarningUrl, setAdultWarningUrl] = useState<string | null>(null);

  // --- Persistent Storage State ---
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => BookmarkService.getAll());
  const [history, setHistory] = useState<HistoryItem[]>(() => HistoryService.getAll());
  const [downloads, setDownloads] = useState<DownloadTask[]>([
    {
      id: 'dl-sample-1',
      filename: 'ADEN-Browser-v2.5.apk',
      url: '/downloads/ADEN-release.apk',
      totalBytes: 25165824,
      downloadedBytes: 25165824,
      progress: 100,
      speed: '4.2 MB/s',
      status: 'completed',
      mimeType: 'application/vnd.android.package-archive',
      createdAt: Date.now() - 3600000
    }
  ]);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  // Helper to format search vs URL
  const formatUrlOrSearch = (input: string): string => {
    const trimmed = input.trim();
    if (!trimmed || trimmed === 'aden://newtab') return 'aden://newtab';
    
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('aden://')) {
      return trimmed;
    }

    if (trimmed.includes('.') && !trimmed.includes(' ')) {
      return `https://${trimmed}`;
    }

    const engines = {
      google: 'https://www.google.com/search?q=',
      duckduckgo: 'https://duckduckgo.com/?q=',
      bing: 'https://www.bing.com/search?q=',
      brave: 'https://search.brave.com/search?q='
    };
    const baseUrl = engines[browserSettings.searchEngine] || engines.google;
    return `${baseUrl}${encodeURIComponent(trimmed)}`;
  };

  // Perform Navigation
  const handleNavigate = (inputUrl: string) => {
    const targetUrl = formatUrlOrSearch(inputUrl);

    // Check Adult Content Protection (+18)
    if (shieldSettings.adultContentBlocked && AdBlockService.isAdultContent(targetUrl)) {
      setAdultWarningUrl(targetUrl);
      return;
    }

    // Direct Native Android WebView browsing
    if (NativeBrowserService.isNative() && targetUrl !== 'aden://newtab') {
      NativeBrowserService.openUrl(targetUrl, activeTabId, activeTab.isIncognito, isDesktopMode);
    }

    setTabs(prev => prev.map(tab => {
      if (tab.id === activeTabId) {
        const newHistory = [...tab.history.slice(0, tab.historyIndex + 1), targetUrl];
        return {
          ...tab,
          url: targetUrl,
          title: getCleanTitleFromUrl(targetUrl),
          isLoading: true,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          canGoBack: newHistory.length > 1,
          canGoForward: false
        };
      }
      return tab;
    }));

    // Record History if not incognito
    if (!activeTab.isIncognito && !targetUrl.startsWith('aden://')) {
      HistoryService.add({
        title: getCleanTitleFromUrl(targetUrl),
        url: targetUrl,
        isIncognito: false
      });
      setHistory(HistoryService.getAll());
    }

    // Increment Ad Block stats
    if (shieldSettings.adBlockEnabled) {
      setShieldSettings(s => ({
        ...s,
        blockedAdsCount: s.blockedAdsCount + Math.floor(Math.random() * 3) + 1,
        blockedTrackersCount: s.blockedTrackersCount + Math.floor(Math.random() * 2) + 1
      }));
    }

    // Simulate load completion
    setTimeout(() => {
      setTabs(prev => prev.map(tab => tab.id === activeTabId ? { ...tab, isLoading: false } : tab));
    }, 800);
  };

  const getCleanTitleFromUrl = (url: string) => {
    if (url === 'aden://newtab') return 'تبويب جديد';
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  // Tab Operations
  const handleNewTab = (isIncognito: boolean = false) => {
    const newId = `tab-${Date.now()}`;
    const newTabObj: Tab = {
      id: newId,
      url: 'aden://newtab',
      title: isIncognito ? 'تصفح متخفٍ' : 'تبويب جديد',
      isIncognito,
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      history: ['aden://newtab'],
      historyIndex: 0
    };
    setTabs(prev => [...prev, newTabObj]);
    setActiveTabId(newId);
  };

  const handleCloseTab = (id: string) => {
    if (tabs.length === 1) {
      // Keep at least one tab
      handleNewTab(false);
      setTabs(prev => prev.filter(t => t.id !== id));
      return;
    }
    const remaining = tabs.filter(t => t.id !== id);
    setTabs(remaining);
    if (activeTabId === id) {
      setActiveTabId(remaining[remaining.length - 1].id);
    }
  };

  const handleCloseAllTabs = () => {
    const newId = `tab-${Date.now()}`;
    setTabs([{
      id: newId,
      url: 'aden://newtab',
      title: 'تبويب جديد',
      isIncognito: false,
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      history: ['aden://newtab'],
      historyIndex: 0
    }]);
    setActiveTabId(newId);
  };

  const handleGoBack = () => {
    if (NativeBrowserService.isNative()) {
      NativeBrowserService.goBack(activeTabId);
    }
    if (activeTab.historyIndex > 0) {
      const prevIdx = activeTab.historyIndex - 1;
      const prevUrl = activeTab.history[prevIdx];
      setTabs(prev => prev.map(tab => {
        if (tab.id === activeTabId) {
          return {
            ...tab,
            url: prevUrl,
            historyIndex: prevIdx,
            canGoBack: prevIdx > 0,
            canGoForward: true
          };
        }
        return tab;
      }));
    }
  };

  const handleGoForward = () => {
    if (NativeBrowserService.isNative()) {
      NativeBrowserService.goForward(activeTabId);
    }
    if (activeTab.historyIndex < activeTab.history.length - 1) {
      const nextIdx = activeTab.historyIndex + 1;
      const nextUrl = activeTab.history[nextIdx];
      setTabs(prev => prev.map(tab => {
        if (tab.id === activeTabId) {
          return {
            ...tab,
            url: nextUrl,
            historyIndex: nextIdx,
            canGoBack: true,
            canGoForward: nextIdx < activeTab.history.length - 1
          };
        }
        return tab;
      }));
    }
  };

  // Direct Download Trigger
  const handleStartDownloadTask = (task: { filename: string; url: string; totalBytes: number; mimeType: string }) => {
    const newDl = DirectDownloadService.createTask(task.filename, task.url, task.totalBytes, task.mimeType);
    setDownloads(prev => [newDl, ...prev]);
    setIsDownloadsOpen(true);

    // Simulate download progress
    let current = 0;
    const interval = setInterval(() => {
      current += 15;
      if (current >= 100) {
        clearInterval(interval);
        setDownloads(prev => prev.map(d => d.id === newDl.id ? { ...d, progress: 100, status: 'completed', downloadedBytes: task.totalBytes, speed: 'مكتمل' } : d));
      } else {
        setDownloads(prev => prev.map(d => d.id === newDl.id ? { ...d, progress: current, downloadedBytes: Math.floor((task.totalBytes * current) / 100), speed: '5.4 MB/s' } : d));
      }
    }, 400);
  };

  // Bookmark Toggle
  const isCurrentBookmarked = BookmarkService.isBookmarked(activeTab.url);

  const handleToggleBookmark = () => {
    if (isCurrentBookmarked) {
      const list = BookmarkService.getAll().filter(b => b.url.toLowerCase() !== activeTab.url.toLowerCase());
      localStorage.setItem('aden_bookmarks', JSON.stringify(list));
      setBookmarks(list);
    } else {
      BookmarkService.add({
        title: activeTab.title || activeTab.url,
        url: activeTab.url,
        icon: 'star',
        category: 'مواقعي'
      });
      setBookmarks(BookmarkService.getAll());
    }
  };

  return (
    <div className="w-screen h-screen bg-[#060a12] flex flex-col overflow-hidden select-none font-sans">
      {/* Top Banners */}
      <TurboNotification
        isTurboActive={isTurboActive}
        onToggleTurbo={() => setIsTurboActive(!isTurboActive)}
      />
      <ApkDownloadBanner />

      {/* Top Address Navigation Bar */}
      <AddressBar
        currentUrl={activeTab.url}
        isLoading={activeTab.isLoading}
        isIncognito={activeTab.isIncognito}
        isTurboActive={isTurboActive}
        tabCount={tabs.length}
        onNavigate={handleNavigate}
        onRefresh={() => handleNavigate(activeTab.url)}
        onOpenShield={() => setIsShieldOpen(true)}
        onOpenAi={() => setIsAiOpen(true)}
        onOpenTabs={() => setIsTabManagerOpen(true)}
        onOpenReader={() => setIsReaderOpen(true)}
        onOpenDirectDownload={() => setIsDirectDownloadOpen(true)}
        isBookmarked={isCurrentBookmarked}
        onToggleBookmark={handleToggleBookmark}
      />

      {/* Main Web Viewport Frame */}
      <div className="flex-1 relative bg-[#060a12] overflow-hidden">
        {activeTab.url === 'aden://newtab' ? (
          <NewTab
            onNavigate={handleNavigate}
            onOpenDirectDownload={() => setIsDirectDownloadOpen(true)}
            onOpenAi={() => setIsAiOpen(true)}
            isTurboActive={isTurboActive}
          />
        ) : (
          <iframe
            key={activeTab.id}
            src={activeTab.url}
            title={activeTab.title}
            className="w-full h-full border-none bg-white"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
          />
        )}

        {/* Adult Content Warning Overlay */}
        {adultWarningUrl && (
          <div className="absolute inset-0 bg-[#090e1a]/95 backdrop-blur-md z-40 flex items-center justify-center p-4 text-center dir-rtl">
            <div className="max-w-md bg-slate-900 border border-rose-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="w-14 h-14 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/30">
                <span className="material-symbols-outlined text-[36px]">block</span>
              </div>
              <h3 className="font-extrabold text-lg text-rose-300">تم حظر هذا الموقع بواسطة الدرع العائلي</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                متصفح ADEN يحميك من المحتوى الإباحي والضار (+18). لقد حاول المتصفح فتح موقع مصنف ضمن الفئات المحظورة.
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setAdultWarningUrl(null);
                    handleNavigate('aden://newtab');
                  }}
                  className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-400 text-slate-950 font-black text-xs rounded-2xl transition-all shadow"
                >
                  العودة للرئيسية الآمنة
                </button>
                <button
                  onClick={() => setIsShieldOpen(true)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 font-bold text-xs rounded-2xl border border-slate-700 hover:bg-slate-700"
                >
                  تعديل الدرع
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar Controls */}
      <BottomBar
        canGoBack={activeTab.canGoBack}
        canGoForward={activeTab.canGoForward}
        onGoBack={handleGoBack}
        onGoForward={handleGoForward}
        onGoHome={() => handleNavigate('aden://newtab')}
        onOpenTabs={() => setIsTabManagerOpen(true)}
        onOpenMenu={() => setIsMenuOpen(true)}
        tabCount={tabs.length}
      />

      {/* Modals & Drawers */}
      <AdenAiModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        contextUrl={activeTab.url}
        contextTitle={activeTab.title}
      />

      <TabManager
        isOpen={isTabManagerOpen}
        onClose={() => setIsTabManagerOpen(false)}
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={setActiveTabId}
        onCloseTab={handleCloseTab}
        onNewTab={handleNewTab}
        onCloseAllTabs={handleCloseAllTabs}
      />

      <MenuSheet
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpenNewTab={() => handleNewTab(false)}
        onOpenNewIncognitoTab={() => handleNewTab(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenDownloads={() => setIsDownloadsOpen(true)}
        onOpenDirectDownload={() => setIsDirectDownloadOpen(true)}
        onOpenShield={() => setIsShieldOpen(true)}
        onOpenAi={() => setIsAiOpen(true)}
        onOpenReader={() => setIsReaderOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isDesktopMode={isDesktopMode}
        onToggleDesktopMode={() => setIsDesktopMode(!isDesktopMode)}
        isTurboActive={isTurboActive}
        onToggleTurbo={() => setIsTurboActive(!isTurboActive)}
        downloadsCount={downloads.length}
      />

      <ShieldModal
        isOpen={isShieldOpen}
        onClose={() => setIsShieldOpen(false)}
        settings={shieldSettings}
        onUpdateSettings={(newS) => setShieldSettings(prev => ({ ...prev, ...newS }))}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onOpenUrl={handleNavigate}
        onClearHistory={() => {
          HistoryService.clear();
          setHistory([]);
        }}
        onRemoveItem={(id) => {
          HistoryService.remove(id);
          setHistory(HistoryService.getAll());
        }}
      />

      <BookmarksModal
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onOpenUrl={handleNavigate}
        onAddBookmark={(title, url) => {
          BookmarkService.add({ title, url });
          setBookmarks(BookmarkService.getAll());
        }}
        onRemoveBookmark={(id) => {
          BookmarkService.remove(id);
          setBookmarks(BookmarkService.getAll());
        }}
        currentUrl={activeTab.url}
        currentTitle={activeTab.title}
      />

      <DownloadsModal
        isOpen={isDownloadsOpen}
        onClose={() => setIsDownloadsOpen(false)}
        downloads={downloads}
        onOpenDirectDownload={() => setIsDirectDownloadOpen(true)}
        onCancelDownload={(id) => setDownloads(prev => prev.filter(d => d.id !== id))}
        onClearCompleted={() => setDownloads(prev => prev.filter(d => d.status !== 'completed'))}
      />

      <DirectDownloadModal
        isOpen={isDirectDownloadOpen}
        onClose={() => setIsDirectDownloadOpen(false)}
        onStartDownloadTask={handleStartDownloadTask}
        defaultUrl={activeTab.url !== 'aden://newtab' ? activeTab.url : ''}
      />

      <ReaderMode
        isOpen={isReaderOpen}
        onClose={() => setIsReaderOpen(false)}
        title={activeTab.title}
        url={activeTab.url}
        content=""
        onOpenAiSummary={() => {
          setIsReaderOpen(false);
          setIsAiOpen(true);
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={browserSettings}
        onUpdateSettings={(newS) => setBrowserSettings(prev => ({ ...prev, ...newS }))}
        onClearData={() => {
          HistoryService.clear();
          setHistory([]);
        }}
      />
    </div>
  );
};
