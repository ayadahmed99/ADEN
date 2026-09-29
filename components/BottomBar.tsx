import React from 'react';

interface BottomBarProps {
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  onGoHome: () => void;
  onOpenTabs: () => void;
  onOpenMenu: () => void;
  tabCount: number;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
  onGoHome,
  onOpenTabs,
  onOpenMenu,
  tabCount,
}) => {
  return (
    <div className="w-full bg-[#080d19]/95 backdrop-blur-md border-t border-slate-800 px-4 py-2 pb-safe flex items-center justify-between text-slate-400 z-30 select-none shadow-2xl">
      {/* Back */}
      <button
        onClick={onGoBack}
        disabled={!canGoBack}
        className="p-2 hover:text-cyan-400 rounded-xl transition-colors disabled:opacity-30 disabled:hover:text-slate-400 active:scale-90"
        title="رجوع"
      >
        <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
      </button>

      {/* Forward */}
      <button
        onClick={onGoForward}
        disabled={!canGoForward}
        className="p-2 hover:text-cyan-400 rounded-xl transition-colors disabled:opacity-30 disabled:hover:text-slate-400 active:scale-90"
        title="تقدم"
      >
        <span className="material-symbols-outlined text-[24px]">arrow_back</span>
      </button>

      {/* Home */}
      <button
        onClick={onGoHome}
        className="p-2.5 bg-gradient-to-tr from-cyan-600 to-blue-600 text-white rounded-2xl shadow-lg shadow-cyan-500/20 active:scale-90 transition-all"
        title="الصفحة الرئيسية"
      >
        <span className="material-symbols-outlined text-[22px]">home</span>
      </button>

      {/* Tabs Switcher */}
      <button
        onClick={onOpenTabs}
        className="p-2 hover:text-cyan-400 rounded-xl transition-colors relative active:scale-90"
        title="التبويبات"
      >
        <span className="material-symbols-outlined text-[24px]">filter_none</span>
        <span className="absolute top-1 right-1 bg-cyan-500 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-slate-900">
          {tabCount}
        </span>
      </button>

      {/* Menu Drawer Toggle */}
      <button
        onClick={onOpenMenu}
        className="p-2 hover:text-cyan-400 rounded-xl transition-colors active:scale-90"
        title="القائمة القائمة الرئيسية"
      >
        <span className="material-symbols-outlined text-[24px]">menu</span>
      </button>
    </div>
  );
};
