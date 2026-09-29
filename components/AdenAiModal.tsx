import React, { useState, useRef, useEffect } from 'react';
import { AdenAiService, AiResponse } from '../services/aiService';
import { AiMessage } from '../types';

interface AdenAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextUrl: string;
  contextTitle: string;
}

export const AdenAiModal: React.FC<AdenAiModalProps> = ({
  isOpen,
  onClose,
  contextUrl,
  contextTitle
}) => {
  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'مرحباً بك! أنا المساعد الذكي لمتصفح ADEN. يمكنني تلخيص الصفحة الحالية، شرح محتواها، ترجمتها، أو الإجابة عن أي استفسار حولها.',
      timestamp: Date.now()
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('جاري الاتصال بخدمة الذكاء الاصطناعي...');
  const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputVal).trim();
    if (!textToSend || isLoading) return;

    setInputVal('');
    setLastFailedPrompt(null);
    setIsLoading(true);
    setLoadingText('جاري الاتصال بخدمة الذكاء الاصطناعي...');

    const userMsg: AiMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      const response: AiResponse = await AdenAiService.generateContent(textToSend, contextUrl);

      if (response.success) {
        const assistantMsg: AiMessage = {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: response.content,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        setLastFailedPrompt(textToSend);
        const errorMsg: AiMessage = {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: response.errorMessage || 'الخدمة مشغولة حالياً، حاول مرة أخرى بعد قليل.',
          timestamp: Date.now(),
          isError: true,
          canRetry: response.canRetry ?? true
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    } catch (unexpected) {
      console.error('[ADEN AI Unexpected Catch]', unexpected);
      setLastFailedPrompt(textToSend);
      const errorMsg: AiMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'الخدمة مشغولة حالياً، حاول مرة أخرى بعد قليل.',
        timestamp: Date.now(),
        isError: true,
        canRetry: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastFailedPrompt && !isLoading) {
      handleSend(lastFailedPrompt);
    }
  };

  const quickPrompts = [
    'لخّص محتوى هذه الصفحة',
    'ترجم الصفحة إلى العربية',
    'استخرج الأفكار الرئيسية',
    'ما هو الغرض الأساسي من الموقع؟'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 select-none animate-fadeIn" dir="rtl">
      <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative w-full max-w-lg bg-[#090e1a] border border-cyan-500/30 rounded-3xl p-4 shadow-2xl z-10 text-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
            </div>
            <div>
              <h3 className="font-extrabold text-base text-cyan-300 flex items-center gap-1.5">
                <span>مساعد ADEN الذكي</span>
                <span className="px-1.5 py-0.2 bg-cyan-500/20 text-cyan-400 text-[9px] rounded font-bold">متصل بالسياق</span>
              </h3>
              <p className="text-xs text-slate-400 truncate max-w-[240px]">
                {contextTitle || contextUrl || 'الصفحة الحالية'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex gap-2 overflow-x-auto py-2.5 px-0.5 no-scrollbar shrink-0">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              className="whitespace-nowrap px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-xs text-slate-300 hover:text-cyan-300 font-medium transition-all active:scale-95 disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto space-y-3 p-2 rounded-2xl bg-slate-950/70 border border-slate-850 my-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-cyan-600 text-slate-950 font-semibold shadow-md rounded-br-xs'
                    : msg.isError
                      ? 'bg-rose-950/60 border border-rose-500/40 text-rose-200 rounded-bl-xs'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {msg.isError && msg.canRetry && (
                  <div className="mt-2.5 pt-2 border-t border-rose-500/30 flex items-center justify-between">
                    <span className="text-[10px] text-rose-300">يمكنك المحاولة ثانية الآن:</span>
                    <button
                      onClick={handleRetry}
                      disabled={isLoading}
                      className="flex items-center gap-1 px-3 py-1 bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold rounded-lg transition-all active:scale-95 disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[14px]">refresh</span>
                      <span>إعادة المحاولة</span>
                    </button>
                  </div>
                )}
              </div>
              <span className="text-[9px] text-slate-500 mt-1 px-1">
                {new Date(msg.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900/80 border border-cyan-500/30 max-w-[85%]">
              <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs text-cyan-300 animate-pulse">{loadingText}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 pt-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isLoading}
            placeholder={isLoading ? 'جاري تنفيذ الطلب...' : 'اكتب سؤالك أو اطلب تحليلاً للصفحة...'}
            className="flex-1 bg-slate-900/90 border border-slate-800 focus:border-cyan-500/60 rounded-2xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputVal.trim()}
            className="w-10 h-10 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center justify-center transition-all shadow-md shadow-cyan-500/20 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            title="إرسال"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
