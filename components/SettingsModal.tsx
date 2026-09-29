import React from 'react';
import { BrowserSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: BrowserSettings;
  onUpdateSettings: (newSettings: Partial<BrowserSettings>) => void;
  onClearData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onClearData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 select-none animate-fadeIn dir-rtl">
      <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative w-full max-w-md bg-[#090e1a] border border-slate-800 rounded-3xl p-5 shadow-2xl z-10 text-slate-100 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 text-cyan-400 flex items-center justify-center border border-slate-700">
              <span className="material-symbols-outlined text-[24px]">settings</span>
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-100">إعدادات المتصفح</h3>
              <p className="text-xs text-slate-400">تخصيص محرك البحث الخيارات المتقدمة</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {/* Search Engine */}
          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1.5">
            <label className="text-xs font-bold text-slate-200 block">محرك البحث الافتراضي:</label>
            <select
              value={settings.searchEngine}
              onChange={(e) => onUpdateSettings({ searchEngine: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-100 outline-none"
            >
              <option value="google">Google (جوجل - الأسرع)</option>
              <option value="duckduckgo">DuckDuckGo (دك دك جو - خصوصية تامة)</option>
              <option value="bing">Microsoft Bing (بينج)</option>
              <option value="brave">Brave Search (بريف)</option>
            </select>
          </div>

          {/* Desktop Mode Default */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div>
              <h4 className="text-xs font-bold text-slate-200">وضع الكمبيوتر افتراضياً</h4>
              <p className="text-[10px] text-slate-400">فتح كل المواقع بصفة سطح المكتب</p>
            </div>
            <button
              onClick={() => onUpdateSettings({ desktopMode: !settings.desktopMode })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.desktopMode ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform transform ${
                  settings.desktopMode ? '-translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Clear History on Exit */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div>
              <h4 className="text-xs font-bold text-slate-200">مسح التصفح تلقائياً</h4>
              <p className="text-[10px] text-slate-400">تنظيف السجل والتخزين عند الخروج</p>
            </div>
            <button
              onClick={() => onUpdateSettings({ clearHistoryOnExit: !settings.clearHistoryOnExit })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.clearHistoryOnExit ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform transform ${
                  settings.clearHistoryOnExit ? '-translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Clear Data Manual Button */}
          <button
            onClick={() => {
              if (confirm('هل أنت تأكد من مسح جميع بيانات التصفح وذاكرة التخزين المؤقت؟')) {
                onClearData();
                alert('تم تنظيف ذاكرة المتصفح والسجل بنجاح.');
              }
            }}
            className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs rounded-2xl border border-rose-500/30 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
            <span>مسح جميع بيانات التصفح الآن</span>
          </button>
        </div>

        {/* Save Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-2xl transition-all shadow-lg active:scale-95"
        >
          حفظ التغييرات
        </button>
      </div>
    </div>
  );
};
