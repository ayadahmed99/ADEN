import React, { useState } from 'react';
import { DirectDownloadService, ParsedVideoFormat } from '../services/directDownloadService';

interface DirectDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartDownloadTask: (task: { filename: string; url: string; totalBytes: number; mimeType: string }) => void;
  defaultUrl?: string;
}

export const DirectDownloadModal: React.FC<DirectDownloadModalProps> = ({
  isOpen,
  onClose,
  onStartDownloadTask,
  defaultUrl = '',
}) => {
  const [urlInput, setUrlInput] = useState(defaultUrl);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedFormats, setAnalyzedFormats] = useState<ParsedVideoFormat[] | null>(null);
  const [detectedTitle, setDetectedTitle] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsAnalyzing(true);
    setErrorMsg('');
    setAnalyzedFormats(null);

    try {
      const result = await DirectDownloadService.analyzeUrl(urlInput.trim());
      if (result.success && result.formats) {
        setAnalyzedFormats(result.formats);
        setDetectedTitle(result.title || 'فيديو محمل من ADEN');
      } else {
        setErrorMsg(result.error || 'عذراً، لم نتمكن من تحليل هذا الرابط بشكل مباشر.');
      }
    } catch {
      setErrorMsg('حدث خطأ غير متوقع أثناء التحليل.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectQuality = (format: ParsedVideoFormat) => {
    onStartDownloadTask({
      filename: `${detectedTitle || 'video'}.${format.extension}`,
      url: format.url || urlInput,
      totalBytes: format.sizeBytes || 15728640,
      mimeType: format.mimeType || 'video/mp4'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 select-none animate-fadeIn dir-rtl">
      <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative w-full max-w-lg bg-[#090e1a] border border-slate-800 rounded-3xl p-4 shadow-2xl z-10 text-slate-100 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-emerald-500/20">
              <span className="material-symbols-outlined text-[24px]">download_for_offline</span>
            </div>
            <div>
              <h3 className="font-extrabold text-base text-emerald-300">أداة التنزيل المباشر السريعة</h3>
              <p className="text-xs text-slate-400">الصق رابط فيديو أو ملف لتحميله مباشرة بالجودة العالية</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleAnalyze} className="my-3 space-y-2 shrink-0">
          <label className="text-xs font-bold text-slate-300 block">رابط الفيديو أو الملف:</label>
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-2xl px-3 py-1.5 focus-within:border-emerald-500/60 transition-all">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/video..."
              className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 outline-none dir-ltr text-right py-1"
            />
            {urlInput && (
              <button
                type="button"
                onClick={() => setUrlInput('')}
                className="p-1 text-slate-500 hover:text-slate-300"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isAnalyzing || !urlInput.trim()}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>جاري تحليل الرابط واستخراج الجودات...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">search</span>
                <span>تحليل واستخراج روابط التنزيل</span>
              </>
            )}
          </button>
        </form>

        {errorMsg && (
          <div className="p-3 bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs rounded-2xl shrink-0 my-1">
            {errorMsg}
          </div>
        )}

        {/* Formats Selection */}
        {analyzedFormats && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 my-2">
            <div className="p-2.5 bg-slate-900/90 rounded-2xl border border-slate-800">
              <h4 className="font-bold text-xs text-emerald-300 truncate">{detectedTitle}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">اختر الجودة المناسبة للبدء في التحميل الفورى:</p>
            </div>

            <div className="space-y-2">
              {analyzedFormats.map((fmt, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectQuality(fmt)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/70 hover:bg-emerald-950/30 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all active:scale-98 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                      {fmt.extension.toUpperCase()}
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-200 group-hover:text-emerald-300 transition-colors">
                        جودة {fmt.quality}
                      </h5>
                      <span className="text-[10px] text-slate-400">
                        {fmt.sizeText || 'حجم تقريبي ~15 MB'}
                      </span>
                    </div>
                  </div>

                  <button className="px-3 py-1 bg-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl shadow group-hover:bg-emerald-400">
                    تنزيل
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
