import React, { useState } from 'react';
import { Bookmark } from '../types';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: Bookmark[];
  onOpenUrl: (url: string) => void;
  onAddBookmark: (title: string, url: string) => void;
  onRemoveBookmark: (id: string) => void;
  currentUrl: string;
  currentTitle: string;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onOpenUrl,
  onAddBookmark,
  onRemoveBookmark,
  currentUrl,
  currentTitle,
}) => {
  const [newTitle, setNewTitle] = useState(currentTitle || '');
  const [newUrl, setNewUrl] = useState(currentUrl || '');

  if (!isOpen) return null;

  const handleAddCurrent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUrl.trim()) {
      onAddBookmark(newTitle.trim() || newUrl.trim(), newUrl.trim());
      setNewTitle('');
      setNewUrl('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 select-none animate-fadeIn dir-rtl">
      <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative w-full max-w-lg bg-[#090e1a] border border-slate-800 rounded-3xl p-4 shadow-2xl z-10 text-slate-100 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <span className="material-symbols-outlined text-[24px]">bookmark</span>
            </div>
            <div>
              <h3 className="font-extrabold text-base text-amber-300">المفضلة والمعلامات</h3>
              <p className="text-xs text-slate-400">مواقعك المفضلة للوصول السريع</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Add Current Page Form */}
        <form onSubmit={handleAddCurrent} className="my-3 p-3 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2 shrink-0">
          <span className="text-[11px] font-bold text-amber-400">إضافة إشارة مرجعية جديدة:</span>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="اسم الموقع..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 outline-none"
          />
          <input
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="رابط الموقع (URL)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 outline-none dir-ltr text-right"
          />
          <button
            type="submit"
            className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow active:scale-95"
          >
            إضافة إلى المفضلة
          </button>
        </form>

        {/* Bookmarks List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {bookmarks.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              لا توجد إشارات مرجعية محفوظة
            </div>
          ) : (
            bookmarks.map((bm) => (
              <div
                key={bm.id}
                onClick={() => {
                  onOpenUrl(bm.url);
                  onClose();
                }}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="material-symbols-outlined text-amber-400 text-[22px] shrink-0">
                    {bm.icon || 'star'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs text-slate-200 truncate group-hover:text-amber-300 transition-colors">
                      {bm.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 truncate dir-ltr text-right">
                      {bm.url}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveBookmark(bm.id);
                  }}
                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition-colors mr-2 shrink-0"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
