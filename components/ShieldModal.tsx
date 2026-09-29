import React from 'react';
import { ShieldSettings } from '../types';

interface ShieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ShieldSettings;
  onUpdateSettings: (newSettings: Partial<ShieldSettings>) => void;
}

export const ShieldModal: React.FC<ShieldModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 select-none animate-fadeIn dir-rtl">
      <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative w-full max-w-md bg-[#090e1a] border border-slate-800 rounded-3xl p-5 shadow-2xl z-10 text-slate-100 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-emerald-500/20">
              <span className="material-symbols-outlined text-[24px]">shield</span>
            </div>
            <div>
              <h3 className="font-extrabold text-base text-emerald-400">درع الحماية الحصين</h3>
              <p className="text-xs text-slate-400">حجب الإعلانات والتتبع والمحتوى الضار</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black text-emerald-400">{settings.blockedAdsCount}</span>
            <span className="text-[11px] text-slate-400 mt-0.5">إعلانات تم حجبها</span>
          </div>

          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black text-cyan-400">{settings.blockedTrackersCount}</span>
            <span className="text-[11px] text-slate-400 mt-0.5">أدوات تعقب تم إيقافها</span>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3">
          {/* Ad Blocker */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div>
              <h4 className="text-xs font-bold text-slate-200">حجب الإعلانات المزعجة</h4>
              <p className="text-[10px] text-slate-400">منع المنبثقات والإعلانات الصورية</p>
            </div>
            <button
              onClick={() => onUpdateSettings({ adBlockEnabled: !settings.adBlockEnabled })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.adBlockEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform transform ${
                  settings.adBlockEnabled ? '-translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Adult Content Filter +18 */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div>
              <h4 className="text-xs font-bold text-rose-300 flex items-center gap-1">
                <span>حظر المحتوى الإباحي +18</span>
                <span className="px-1 py-0.2 bg-rose-500/20 text-rose-400 text-[9px] rounded font-extrabold">حماية عائلية</span>
              </h4>
              <p className="text-[10px] text-slate-400">منع المواقع والمصطلحات المخصصة للكبار</p>
            </div>
            <button
              onClick={() => onUpdateSettings({ adultContentBlocked: !settings.adultContentBlocked })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.adultContentBlocked ? 'bg-rose-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform transform ${
                  settings.adultContentBlocked ? '-translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Anti Tracking */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div>
              <h4 className="text-xs font-bold text-slate-200">منع تعقب الخصوصية</h4>
              <p className="text-[10px] text-slate-400">إيقاف الكوكيز الضارة وملفات التتبع</p>
            </div>
            <button
              onClick={() => onUpdateSettings({ antiTracking: !settings.antiTracking })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.antiTracking ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform transform ${
                  settings.antiTracking ? '-translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Data Saver Turbo */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div>
              <h4 className="text-xs font-bold text-amber-300">موفّر البيانات ADEN Turbo</h4>
              <p className="text-[10px] text-slate-400">ضغط الصور وتوفير حتى 60% من باقة النت</p>
            </div>
            <button
              onClick={() => onUpdateSettings({ dataSaver: !settings.dataSaver })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.dataSaver ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform transform ${
                  settings.dataSaver ? '-translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Done Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-2xl transition-all shadow-lg active:scale-95 mt-2"
        >
          حفظ وإغلاق
        </button>
      </div>
    </div>
  );
};
