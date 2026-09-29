import React, { useState } from 'react';
import { DownloadTask } from '../types';

interface DownloadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  downloads: DownloadTask[];
  onOpenDirectDownload: () => void;
  onCancelDownload: (id: string) => void;
  onClearCompleted: () => void;
}

export const DownloadsModal: React.FC<DownloadsModalProps> = ({
  isOpen,
  onClose,
  downloads,
  onOpenDirectDownload,
  onCancelDownload,
  onClearCompleted,
}) => {
  const [filter, setFilter] = useState<'all' | 'video' | 'audio' | 'document'>('all');

  if (!isOpen) return null;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleSaveToDevice = async (task: DownloadTask) => {
    try {
      let downloadUrl = task.url;
      if (task.url.startsWith('/downloads/')) {
        const response = await fetch(task.url);
        if (response.ok) {
          const blob = await response.blob();
          downloadUrl = URL.createObjectURL(blob);
        }
      }
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = task.filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.warn('Save file error:', err);
    }
  };

  const filtered = downloads.filter((d) => {
    if (filter === 'video') return d.mimeType.includes('video') || d.filename.match(/\.(mp4|mkv|webm|avi|mov)$/i);
    if (filter === 'audio') return d.mimeType.includes('audio') || d.filename.match(/\.(mp3|wav|m4a|aac)$/i);
    if (filter === 'document') return d.mimeType.includes('pdf') || d.filename.match(/\.(pdf|doc|docx|apk|zip)$/i);
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 select-none animate-fadeIn dir-rtl">
      <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative w-full max-w-lg bg-[#090e1a] border border-slate-800 rounded-3xl p-4 shadow-2xl z-10 text-slate-100 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/30 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <span className="material-symbols-outlined text-[24px]">download</span>
            </div>
            <div>
              <h3 className="font-extrabold text-base text-blue-300">مدير التحميلات السريع</h3>
              <p className="text-xs text-slate-400">تنزيل الفيديوهات والملفات بأقصى سرعة</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenDirectDownload();
              }}
              className="text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 px-3 py-1.5 rounded-xl transition-all shadow active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              تنزيل جديد
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 my-3 shrink-0 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'video', label: 'فيديوهات' },
            { id: 'audio', label: 'صوتيات' },
            { id: 'document', label: 'ملفات وتطبيقات' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id as any)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === item.id
                  ? 'bg-blue-500 text-slate-950 shadow'
                  : 'bg-slate-900 border border-slate-800 text-slate-400'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Downloads List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-[40px] text-slate-600">folder_off</span>
              <span>لا توجد تحميلات قائمة في هذا القسم</span>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="material-symbols-outlined text-blue-400 text-[20px] shrink-0">
                      {item.mimeType.includes('video') ? 'movie' : item.mimeType.includes('audio') ? 'music_note' : 'description'}
                    </span>
                    <span className="font-bold text-xs text-slate-200 truncate">{item.filename}</span>
                  </div>

                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg shrink-0 mr-2 ${
                    item.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' :
                    item.status === 'downloading' ? 'bg-blue-500/20 text-blue-300' :
                    item.status === 'failed' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.status === 'completed' ? 'مكتمل' :
                     item.status === 'downloading' ? 'جاري التنزيل' :
                     item.status === 'failed' ? 'فشل' : 'معلّق'}
                  </span>
                </div>

                {/* Progress Bar */}
                {item.status === 'downloading' && (
                  <div className="space-y-1">
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 dir-ltr">
                      <span>{item.speed}</span>
                      <span>{formatBytes(item.downloadedBytes)} / {formatBytes(item.totalBytes)} ({item.progress}%)</span>
                    </div>
                  </div>
                )}

                {item.status === 'completed' && (
                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                    <span className="dir-ltr">{formatBytes(item.totalBytes)}</span>
                    <button
                      onClick={() => handleSaveToDevice(item)}
                      className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-[10px] font-extrabold flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">save_alt</span>
                      <span>حفظ / تنزيل الملف</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
