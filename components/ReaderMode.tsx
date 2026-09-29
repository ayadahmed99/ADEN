import React, { useState } from 'react';

interface ReaderModeProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
  content: string;
  onOpenAiSummary: () => void;
}

export const ReaderMode: React.FC<ReaderModeProps> = ({
  isOpen,
  onClose,
  title,
  url,
  content,
  onOpenAiSummary,
}) => {
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [theme, setTheme] = useState<'dark' | 'sepia' | 'light'>('dark');

  if (!isOpen) return null;

  const fontClasses = {
    sm: 'text-xs leading-relaxed',
    md: 'text-sm leading-relaxed',
    lg: 'text-base leading-loose',
    xl: 'text-lg leading-loose',
  };

  const themeClasses = {
    dark: 'bg-[#0b0f19] text-slate-200',
    sepia: 'bg-[#fbf0d9] text-[#433422]',
    light: 'bg-white text-slate-900',
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col dir-rtl animate-fadeIn ${themeClasses[theme]}`}>
      {/* Header Controls */}
      <div className="p-3 border-b border-slate-700/30 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-black/10 transition-colors"
            title="إغلاق وضع القارئ"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_forward</span>
          </button>
          <span className="font-extrabold text-xs">وضع القارئ النقي</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Font Size Selector */}
          <div className="flex items-center gap-1 bg-black/10 p-1 rounded-xl">
            <button
              onClick={() => setFontSize('sm')}
              className={`px-2 py-0.5 rounded text-xs font-bold ${fontSize === 'sm' ? 'bg-amber-500 text-slate-950' : ''}`}
            >
              أ
            </button>
            <button
              onClick={() => setFontSize('md')}
              className={`px-2 py-0.5 rounded text-sm font-bold ${fontSize === 'md' ? 'bg-amber-500 text-slate-950' : ''}`}
            >
              أ
            </button>
            <button
              onClick={() => setFontSize('lg')}
              className={`px-2 py-0.5 rounded text-base font-bold ${fontSize === 'lg' ? 'bg-amber-500 text-slate-950' : ''}`}
            >
              أ
            </button>
          </div>

          {/* Theme Toggles */}
          <div className="flex items-center gap-1 bg-black/10 p-1 rounded-xl">
            <button
              onClick={() => setTheme('dark')}
              className="w-5 h-5 rounded-full bg-[#0b0f19] border border-slate-600"
              title="داكن"
            />
            <button
              onClick={() => setTheme('sepia')}
              className="w-5 h-5 rounded-full bg-[#fbf0d9] border border-amber-700/40"
              title="دافئ / سيپيا"
            />
            <button
              onClick={() => setTheme('light')}
              className="w-5 h-5 rounded-full bg-white border border-slate-400"
              title="فاتح"
            />
          </div>

          {/* AI Summary Button */}
          <button
            onClick={onOpenAiSummary}
            className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-1 shadow"
          >
            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
            <span>تلخيص بالذكاء الاصطناعي</span>
          </button>
        </div>
      </div>

      {/* Article Body */}
      <div className="flex-1 overflow-y-auto max-w-2xl mx-auto w-full p-6 space-y-4">
        <h1 className="text-xl sm:text-2xl font-black">{title || 'عنوان المقال'}</h1>
        <p className="text-xs opacity-60 dir-ltr text-right">{url}</p>

        <div className={`mt-6 space-y-4 font-sans ${fontClasses[fontSize]}`}>
          {content ? (
            content.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))
          ) : (
            <p>
              قام متصفح ADEN بفلترة وتنظيف هذه الصفحة من جميع الإعلانات، السكربتات المزعجة، والقوائم العشوائية ليوفر لك تجربة قراءة سلسة ومريحة للعين.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
