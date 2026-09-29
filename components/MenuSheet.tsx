import React from 'react';

interface MenuSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenNewTab: () => void;
  onOpenNewIncognitoTab: () => void;
  onOpenBookmarks: () => void;
  onOpenHistory: () => void;
  onOpenDownloads: () => void;
  onOpenDirectDownload: () => void;
  onOpenShield: () => void;
  onOpenAi: () => void;
  onOpenReader: () => void;
  onOpenSettings: () => void;
  isDesktopMode: boolean;
  onToggleDesktopMode: () => void;
  isTurboActive: boolean;
  onToggleTurbo: () => void;
  downloadsCount: number;
}

export const MenuSheet: React.FC<MenuSheetProps> = ({
  isOpen,
  onClose,
  onOpenNewTab,
  onOpenNewIncognitoTab,
  onOpenBookmarks,
  onOpenHistory,
  onOpenDownloads,
  onOpenDirectDownload,
  onOpenShield,
  onOpenAi,
  onOpenReader,
  onOpenSettings,
  isDesktopMode,
  onToggleDesktopMode,
  isTurboActive,
  onToggleTurbo,
  downloadsCount,
}) => {
  if (!isOpen) return null;

  const menuItems = [
    {
      icon: 'add_circle',
      label: 'تبويب جديد',
      color: 'text-cyan-400',
      action: () => { onOpenNewTab(); onClose(); }
    },
    {
      icon: 'incognito',
      label: 'تبويب متخفٍ جديد',
      color: 'text-purple-400',
      action: () => { onOpenNewIncognitoTab(); onClose(); }
    },
    {
      icon: 'download_for_offline',
      label: 'تنزيل مباشر سريع',
      badge: 'جديد',
      color: 'text-emerald-400',
      action: () => { onOpenDirectDownload(); onClose(); }
    },
    {
      icon: 'download',
      label: 'مدير التحميلات',
      badge: downloadsCount > 0 ? `${downloadsCount}` : undefined,
      color: 'text-blue-400',
      action: () => { onOpenDownloads(); onClose(); }
    },
    {
      icon: 'star',
      label: 'المفضلة والمعلامات',
      color: 'text-amber-400',
      action: () => { onOpenBookmarks(); onClose(); }
    },
    {
      icon: 'history',
      label: 'سجل التصفح',
      color: 'text-indigo-400',
      action: () => { onOpenHistory(); onClose(); }
    },
    {
      icon: 'security',
      label: 'درع الحماية وحجب الإعلانات',
      color: 'text-emerald-400',
      action: () => { onOpenShield(); onClose(); }
    },
    {
      icon: 'auto_awesome',
      label: 'مساعد ADEN الذكي',
      badge: 'AI',
      color: 'text-cyan-300',
      action: () => { onOpenAi(); onClose(); }
    },
    {
      icon: 'chrome_reader_mode',
      label: 'وضع القراءة النقي',
      color: 'text-orange-400',
      action: () => { onOpenReader(); onClose(); }
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center select-none animate-fadeIn dir-rtl">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Sheet Container */}
      <div className="relative w-full max-w-lg bg-[#090e1a] border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl p-4 shadow-2xl z-10 text-slate-100 max-h-[85vh] flex flex-col">
        {/* Handle */}
        <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-3 shrink-0" />

        {/* Browser Header Badge */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md">
              <span className="material-symbols-outlined text-[20px]">explore</span>
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5">
                <span>متصفح ADEN</span>
                <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 text-[10px] rounded font-bold">إصدار 2.5</span>
              </h3>
              <p className="text-[11px] text-slate-400">تصفح فائق السرعة وبدون إعلانات</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Quick Toggles Row */}
        <div className="grid grid-cols-2 gap-2 my-3 shrink-0">
          {/* Turbo 120 Toggle */}
          <button
            onClick={onToggleTurbo}
            className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
              isTurboActive 
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' 
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-amber-400">bolt</span>
              <span className="text-xs font-bold">تسريع Turbo</span>
            </div>
            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${isTurboActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-800'}`}>
              {isTurboActive ? 'مفعّل' : 'معطّل'}
            </span>
          </button>

          {/* Desktop Mode Toggle */}
          <button
            onClick={onToggleDesktopMode}
            className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
              isDesktopMode 
                ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300' 
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-cyan-400">desktop_windows</span>
              <span className="text-xs font-bold">عرض الكمبيوتر</span>
            </div>
            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${isDesktopMode ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800'}`}>
              {isDesktopMode ? 'مفعّل' : 'إيقاف'}
            </span>
          </button>
        </div>

        {/* Menu Items List */}
        <div className="flex-1 overflow-y-auto space-y-1 my-1 pr-1">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={item.action}
              className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-800/80 transition-all text-right group active:scale-98"
            >
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-[22px] ${item.color}`}>
                  {item.icon}
                </span>
                <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                  {item.label}
                </span>
              </div>

              {item.badge && (
                <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 font-extrabold text-[10px] rounded-lg border border-cyan-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Footer Settings Button */}
        <div className="pt-3 border-t border-slate-800 shrink-0 flex gap-2">
          <button
            onClick={() => { onOpenSettings(); onClose(); }}
            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
            <span>إعدادات المتصفح</span>
          </button>
        </div>
      </div>
    </div>
  );
};
