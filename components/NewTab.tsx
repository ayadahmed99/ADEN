import React, { useState } from 'react';

interface NewTabProps {
  onNavigate: (url: string) => void;
  onOpenDirectDownload: () => void;
  onOpenAi: () => void;
  isTurboActive: boolean;
}

export const NewTab: React.FC<NewTabProps> = ({
  onNavigate,
  onOpenDirectDownload,
  onOpenAi,
  isTurboActive,
}) => {
  const [query, setQuery] = useState('');

  const topSites = [
    { title: 'جوجل', url: 'https://www.google.com', icon: 'search', color: 'from-blue-500 to-red-500' },
    { title: 'يوتيوب', url: 'https://www.youtube.com', icon: 'smart_display', color: 'from-red-600 to-rose-700' },
    { title: 'ويكيبيديا', url: 'https://ar.wikipedia.org', icon: 'menu_book', color: 'from-slate-600 to-slate-800' },
    { title: 'الجزيرة نت', url: 'https://www.aljazeera.net', icon: 'newspaper', color: 'from-amber-500 to-orange-600' },
    { title: 'فيس بوك', url: 'https://www.facebook.com', icon: 'groups', color: 'from-blue-600 to-indigo-700' },
    { title: 'تويتر (X)', url: 'https://x.com', icon: 'tag', color: 'from-slate-800 to-slate-950' },
    { title: 'طقس العرب', url: 'https://weather.com', icon: 'cloud', color: 'from-cyan-500 to-blue-600' },
    { title: 'جيت هب', url: 'https://github.com', icon: 'code', color: 'from-purple-600 to-indigo-900' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onNavigate(query.trim());
    }
  };

  return (
    <div className="w-full h-full bg-[#060a12] text-slate-100 flex flex-col items-center justify-between p-4 overflow-y-auto select-none dir-rtl">
      {/* Top Header Badge */}
      <div className="w-full max-w-xl flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-slate-950 flex items-center justify-center font-black shadow-md">
            <span className="material-symbols-outlined text-[18px]">explore</span>
          </div>
          <span className="font-extrabold text-sm text-slate-200 tracking-wide">ADEN BROWSER</span>
        </div>

        {isTurboActive && (
          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2.5 py-1 rounded-xl text-[10px] font-extrabold animate-pulse">
            <span className="material-symbols-outlined text-[14px]">bolt</span>
            <span>Turbo 120 Mhz</span>
          </div>
        )}
      </div>

      {/* Main Logo & Search */}
      <div className="w-full max-w-xl my-auto py-8 flex flex-col items-center gap-6">
        {/* Animated ADEN Logo */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-amber-500 text-slate-950 flex items-center justify-center font-black shadow-2xl shadow-cyan-500/20 transform hover:scale-105 transition-all">
            <span className="material-symbols-outlined text-[44px]">radar</span>
          </div>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-slate-100 to-amber-300">
            متصفح عدن الذكي
          </h1>
          <p className="text-xs text-slate-400 max-w-xs">
            تصفح فائق السرعة • حجب الإعلانات • تنزيل مباشر • ذكاء اصطناعي
          </p>
        </div>

        {/* Big Search Input */}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="relative flex items-center bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 focus-within:border-cyan-500 rounded-2xl p-2 shadow-2xl transition-all">
            <span className="material-symbols-outlined text-slate-400 text-[22px] ml-3 shrink-0">search</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث في جوجل أو أدخل عنوان موقع..."
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none font-medium py-1"
            />
            <button
              type="submit"
              className="p-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-bold transition-all shadow shrink-0"
              title="بحث"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
        </form>

        {/* Quick Action Feature Cards */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <button
            onClick={onOpenDirectDownload}
            className="p-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center gap-3 transition-all active:scale-95 text-right"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">download_for_offline</span>
            </div>
            <div>
              <h3 className="font-extrabold text-xs text-emerald-300">التنزيل المباشر</h3>
              <p className="text-[10px] text-slate-400">حمل أي فيديو برابط مباشر</p>
            </div>
          </button>

          <button
            onClick={onOpenAi}
            className="p-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-2xl flex items-center gap-3 transition-all active:scale-95 text-right"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
            </div>
            <div>
              <h3 className="font-extrabold text-xs text-cyan-300">مساعد الذكاء الاصطناعي</h3>
              <p className="text-[10px] text-slate-400">تحليل وتلخيص وترجمة</p>
            </div>
          </button>
        </div>

        {/* Speed Dials Grid */}
        <div className="w-full space-y-3 pt-2">
          <span className="text-xs font-extrabold text-slate-400 block">المواقع الأكثر زيارة:</span>
          <div className="grid grid-cols-4 gap-3">
            {topSites.map((site, index) => (
              <button
                key={index}
                onClick={() => onNavigate(site.url)}
                className="flex flex-col items-center gap-2 p-2 rounded-2xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 hover:border-cyan-500/30 transition-all active:scale-95 group"
              >
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${site.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined text-[22px]">{site.icon}</span>
                </div>
                <span className="text-[11px] font-bold text-slate-300 truncate w-full text-center">
                  {site.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="w-full max-w-xl text-center pb-2 shrink-0">
        <span className="text-[11px] text-slate-500">
          ADEN Browser Engine v2.5 • مجهّز بالكامل ومحمي بواسطة الدرع الذكي
        </span>
      </div>
    </div>
  );
};
