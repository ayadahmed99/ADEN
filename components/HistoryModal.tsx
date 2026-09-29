import React, { useState } from 'react';
import { HistoryItem } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onOpenUrl: (url: string) => void;
  onClearHistory: () => void;
  onRemoveItem: (id: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onOpenUrl,
  onClearHistory,
  onRemoveItem,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filtered = history.filter(
    (h) =>
      h.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 select-none animate-fadeIn dir-rtl">
      <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative w-full max-w-lg bg-[#090e1a] border border-slate-800 rounded-3xl p-4 shadow-2xl z-10 text-slate-100 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <span className="material-symbols-outlined text-[24px]">history</span>
            </div>
            <div>
              <h3 className="font-extrabold text-base text-indigo-300">سجل التصفح</h3>
              <p className="text-xs text-slate-400">المواقع والصفحات التي قمت بزيارتها مؤخراً</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-2.5 py-1.5 rounded-xl border border-rose-500/30 transition-all"
              >
                مسح السجل
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="my-3 shrink-0">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-2xl px-3 py-2">
            <span className="material-symbols-outlined text-slate-500 text-[18px] ml-2">search</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث في السجل..."
              className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 outline-none"
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              لا يوجد سجل تصفح مطابق
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onOpenUrl(item.url);
                  onClose();
                }}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="material-symbols-outlined text-indigo-400 text-[20px] shrink-0">language</span>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs text-slate-200 truncate group-hover:text-indigo-300 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 truncate dir-ltr text-right">
                      {item.url}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 mr-2">
                  <span className="text-[9px] text-slate-500">
                    {new Date(item.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveItem(item.id);
                    }}
                    className="p-1 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
