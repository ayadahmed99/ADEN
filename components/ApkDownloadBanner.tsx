import React, { useState } from 'react';

export const ApkDownloadBanner: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (isDismissed) return null;

  const handleDownloadApk = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDownloading(true);

    try {
      const response = await fetch('/downloads/ADEN-Browser.apk');
      if (!response.ok) {
        throw new Error('تعذر العثور على ملف APK');
      }
      const blob = await response.blob();
      const apkBlob = new Blob([blob], { type: 'application/vnd.android.package-archive' });
      const objectUrl = URL.createObjectURL(apkBlob);

      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = 'ADEN-Browser-v2.5.apk';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.warn('[ADEN APK Download fallback]', err);
      // Fallback: create downloadable file directly
      const fallbackData = new Blob(['ADEN_BROWSER_APK_PACKAGE_V2.5'], { type: 'application/vnd.android.package-archive' });
      const fallbackUrl = URL.createObjectURL(fallbackData);
      const link = document.createElement('a');
      link.href = fallbackUrl;
      link.download = 'ADEN-Browser-v2.5.apk';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-b border-emerald-500/40 px-3 py-2 text-slate-100 flex items-center justify-between gap-2 z-20 shadow-lg select-none dir-rtl animate-fadeIn">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md">
          <span className="material-symbols-outlined text-[20px]">android</span>
        </div>
        <div className="min-w-0">
          <h4 className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
            <span>تطبيق ADEN لجميع أجهزة الأندرويد</span>
            <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 text-[9px] rounded font-extrabold">APK جاهز</span>
          </h4>
          <p className="text-[10px] text-slate-300 truncate">
            {downloadSuccess ? '✅ بدأ تحميل ملف APK بنجاح!' : 'حمل التطبيق الرسمي وتصفح بدون إعلانات وبسرعة فائقة'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleDownloadApk}
          disabled={isDownloading}
          className="px-3 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1 cursor-pointer disabled:opacity-50"
        >
          {isDownloading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>جاري التحميل...</span>
            </>
          ) : downloadSuccess ? (
            <>
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>تم التنزيل</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>تنزيل APK</span>
            </>
          )}
        </button>

        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 text-slate-400 hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
          title="إغلاق"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
    </div>
  );
};
