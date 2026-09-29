import React from 'react';
import { Tab } from '../types';

interface TabManagerProps {
  isOpen: boolean;
  onClose: () => void;
  tabs: Tab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onNewTab: (isIncognito?: boolean) => void;
  onCloseAllTabs: () => void;
}

export const TabManager: React.FC<TabManagerProps> = ({
  isOpen,
  onClose,
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  onCloseAllTabs,
}) => {
  if (!isOpen) return null;

  const normalTabs = tabs.filter(t => !t.isIncognito);
  const incognitoTabs = tabs.filter(t => t.isIncognito);

  return (
    <div className="fixed inset-0 z-50 bg-[#060a12] text-slate-100 flex flex-col dir-rtl animate-fadeIn">
      {/* Header Bar */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#080d19]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-cyan-400 text-[24px]">layers</span>
          <h2 className="font-extrabold text-base text-slate-100">
            التبويبات المفتوحة ({tabs.length})
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCloseAllTabs}
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all"
          >
            إغلاق الكل
          </button>

          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-2xl text-slate-300 transition-colors"
            title="إغلاق"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      </div>

      {/* Tabs List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Normal Tabs */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              تبويبات عادية ({normalTabs.length})
            </span>
            <button
              onClick={() => onNewTab(false)}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/30 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              تبويب جديد
            </button>
          </div>

          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 gap-3">
            {normalTabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => {
                  onSelectTab(tab.id);
                  onClose();
                }}
                className={`relative group rounded-2xl border p-3 flex flex-col justify-between h-36 cursor-pointer transition-all ${
                  tab.id === activeTabId
                    ? 'bg-slate-800/90 border-cyan-500 ring-2 ring-cyan-500/30 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-[18px] text-cyan-400 shrink-0">public</span>
                    <span className="font-bold text-xs text-slate-200 truncate">{tab.title || 'تبويب جديد'}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseTab(tab.id);
                    }}
                    className="p-1 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>

                <div className="text-[10px] text-slate-500 truncate dir-ltr text-right mt-2">
                  {tab.url || 'aden://newtab'}
                </div>

                <div className="mt-auto pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{tab.id === activeTabId ? 'نشط الآن' : 'انقر للفتح'}</span>
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incognito Tabs */}
        {incognitoTabs.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3 pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">incognito</span>
                تبويبات المتخفي ({incognitoTabs.length})
              </span>
              <button
                onClick={() => onNewTab(true)}
                className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/30 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                تبويب متخفٍ
              </button>
            </div>

            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 gap-3">
              {incognitoTabs.map((tab) => (
                <div
                  key={tab.id}
                  onClick={() => {
                    onSelectTab(tab.id);
                    onClose();
                  }}
                  className={`relative group rounded-2xl border p-3 flex flex-col justify-between h-36 cursor-pointer transition-all ${
                    tab.id === activeTabId
                      ? 'bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/30'
                      : 'bg-slate-900/60 border-purple-900/40 hover:border-purple-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="material-symbols-outlined text-[18px] text-purple-400 shrink-0">incognito</span>
                      <span className="font-bold text-xs text-purple-200 truncate">{tab.title || 'تصفح متخفٍ'}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloseTab(tab.id);
                      }}
                      className="p-1 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>

                  <div className="text-[10px] text-purple-400/70 truncate dir-ltr text-right mt-2">
                    {tab.url || 'أوضاع خاصة لا تحفظ السجل'}
                  </div>

                  <div className="mt-auto pt-2 border-t border-purple-900/40 flex items-center justify-between text-[10px] text-purple-300">
                    <span>حماية متخفية</span>
                    <span className="material-symbols-outlined text-[14px]">lock</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Floating Bar for New Tab */}
      <div className="p-4 border-t border-slate-800 bg-[#080d19] flex gap-3">
        <button
          onClick={() => {
            onNewTab(false);
            onClose();
          }}
          className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-black text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>تبويب جديد</span>
        </button>

        <button
          onClick={() => {
            onNewTab(true);
            onClose();
          }}
          className="px-4 py-3 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 border border-purple-500/40 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">incognito</span>
          <span>متخفٍ</span>
        </button>
      </div>
    </div>
  );
};
