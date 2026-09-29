import React, { useState, useEffect } from 'react';

interface AddressBarProps {
  currentUrl: string;
  isLoading: boolean;
  isIncognito: boolean;
  isTurboActive: boolean;
  tabCount: number;
  onNavigate: (url: string) => void;
  onRefresh: () => void;
  onOpenShield: () => void;
  onOpenAi: () => void;
  onOpenTabs: () => void;
  onOpenReader: () => void;
  onOpenDirectDownload: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const AddressBar: React.FC<AddressBarProps> = ({
  currentUrl,
  isLoading,
  isIncognito,
  isTurboActive,
  tabCount,
  onNavigate,
  onRefresh,
  onOpenShield,
  onOpenAi,
  onOpenTabs,
  onOpenReader,
  onOpenDirectDownload,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [inputValue, setInputValue] = useState(currentUrl);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setInputValue(currentUrl);
  }, [currentUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onNavigate(inputValue.trim());
      (e.target as HTMLElement).querySelector('input')?.blur();
    }
  };

  const getCleanDisplayUrl = (url: string) => {
    if (!url || url === 'about:blank' || url.startsWith('aden://')) return 'ابحث أو أدخل عنوان URL';
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <div className="w-full bg-[#080d19] border-b border-slate-800 px-2 py-1.5 flex items-center gap-1.5 z-30 select-none shadow-lg">
      {/* Shield Protection Icon */}
      <button
        onClick={onOpenShield}
        className="relative p-1.5 text-cyan-400 hover:text-cyan-300 rounded-xl hover:bg-slate-800/60 transition-colors shrink-0"
        title="درع الحماية وحجب الإعلانات"
      >
        <span className="material-symbols-outlined text-[20px]">security</span>
        {isTurboActive && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
        )}
      </button>

      {/* URL / Search Bar */}
      <form onSubmit={handleSubmit} className="flex-1 flex items-center bg-slate-900/90 border border-slate-800 focus-within:border-cyan-500/60 rounded-2xl px-2.5 py-1 transition-all">
        {isIncognito ? (
          <span className="material-symbols-outlined text-purple-400 text-[18px] ml-1.5 shrink-0">incognito</span>
        ) : (
          <span className="material-symbols-outlined text-slate-400 text-[18px] ml-1.5 shrink-0">
            {currentUrl.startsWith('https://') ? 'lock' : 'search'}
          </span>
        )}

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="ابحث أو أدخل موقع..."
          className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-xs font-medium outline-none py-1 dir-ltr text-right"
          dir="ltr"
        />

        {inputValue && (
          <button
            type="button"
            onClick={() => setInputValue('')}
            className="p-1 text-slate-400 hover:text-slate-200"
          >
            <span className="material-symbols-outlined text-[16px]">cancel</span>
          </button>
        )}

        {/* Reload / Stop */}
        <button
          type="button"
          onClick={onRefresh}
          className="p-1 text-slate-400 hover:text-cyan-400 transition-colors shrink-0 mr-1"
          title={isLoading ? 'إيقاف' : 'تحديث'}
        >
          <span className="material-symbols-outlined text-[18px]">
            {isLoading ? 'close' : 'refresh'}
          </span>
        </button>
      </form>

      {/* AI Assistant Button */}
      <button
        onClick={onOpenAi}
        className="p-1.5 bg-gradient-to-tr from-cyan-600/30 to-blue-600/30 text-cyan-300 hover:text-white rounded-xl border border-cyan-500/30 transition-all active:scale-95 shrink-0"
        title="مساعد ADEN الذكي"
      >
        <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
      </button>

      {/* Direct Video/File Downloader Quick Button */}
      <button
        onClick={onOpenDirectDownload}
        className="p-1.5 bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 rounded-xl border border-emerald-500/30 transition-all active:scale-95 shrink-0"
        title="تنزيل مباشر للفيديوهات والملفات"
      >
        <span className="material-symbols-outlined text-[20px]">download_for_offline</span>
      </button>

      {/* Reader Mode Toggle */}
      <button
        onClick={onOpenReader}
        className="p-1.5 text-slate-400 hover:text-amber-300 rounded-xl hover:bg-slate-800/60 transition-colors shrink-0"
        title="وضع القارئ الذكي"
      >
        <span className="material-symbols-outlined text-[20px]">chrome_reader_mode</span>
      </button>

      {/* Bookmarks Toggle Button */}
      <button
        onClick={onToggleBookmark}
        className={`p-1.5 transition-colors rounded-xl hover:bg-slate-800/60 shrink-0 ${
          isBookmarked ? 'text-amber-400' : 'text-slate-400 hover:text-amber-300'
        }`}
        title={isBookmarked ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
      >
        <span className="material-symbols-outlined text-[20px]">
          {isBookmarked ? 'star' : 'star_outline'}
        </span>
      </button>

      {/* Tabs Counter Button */}
      <button
        onClick={onOpenTabs}
        className="relative w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 hover:border-cyan-500/50 flex items-center justify-center font-bold text-xs text-slate-200 transition-all active:scale-95 shrink-0"
        title="إدارة التبويبات"
      >
        <span>{tabCount}</span>
      </button>
    </div>
  );
};
