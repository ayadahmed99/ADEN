import React, { useState } from 'react';

interface TurboNotificationProps {
  onToggleTurbo?: () => void;
  isTurboActive?: boolean;
}

export const TurboNotification: React.FC<TurboNotificationProps> = ({
  onToggleTurbo,
  isTurboActive = true
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('aden_turbo_banner_dismissed') !== 'true';
    } catch {
      return true;
    }
  });

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      sessionStorage.setItem('aden_turbo_banner_dismissed', 'true');
    } catch {}
  };

  if (!isVisible) return null;

  return (
    <div 
      dir="rtl"
      className="w-full bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/90 border-b border-amber-500/40 px-3 py-1.5 text-slate-100 flex items-center justify-between gap-2 z-20 shadow-md select-none animate-fadeIn"
    >
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/40">
          <span className="material-symbols-outlined text-[16px]">bolt</span>
        </div>
        <div className="min-w-0 flex items-center gap-2">
          <span className="text-xs font-black text-amber-300 shrink-0">ADEN TURBO 120</span>
          <span className="text-[11px] text-slate-300 truncate hidden xs:inline sm:inline">
            تسريع تحميل الصفحات وتوفير استهلاك البيانات بنسبة تصل إلى 60%
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {onToggleTurbo && (
          <button
            onClick={onToggleTurbo}
            className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all ${
              isTurboActive 
                ? 'bg-amber-500 text-slate-950 shadow-sm' 
                : 'bg-slate-800 text-amber-300 border border-amber-500/30'
            }`}
          >
            {isTurboActive ? 'مفعّل' : 'تفعيل'}
          </button>
        )}
        <button
          onClick={handleDismiss}
          className="p-1 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
          title="إغلاق التنبيه"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
    </div>
  );
};
