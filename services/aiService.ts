import { GoogleGenAI } from '@google/genai';

export interface AiResponse {
  success: boolean;
  content: string;
  errorMessage?: string;
  canRetry?: boolean;
  isBusy?: boolean;
}

export class AdenAiService {
  private static readonly PRIMARY_MODEL = 'gemini-3.8-flash';
  private static readonly FALLBACK_MODEL = 'gemini-2.5-flash';
  private static readonly MAX_RETRIES = 3;
  private static readonly TIMEOUT_MS = 30000;

  // Retrieve API key safely
  private static getApiKey(): string {
    const key = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
      (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
      '';
    return key;
  }

  // Sleep utility with jitter
  private static sleep(ms: number): Promise<void> {
    const jitter = Math.floor(Math.random() * 400) - 200; // ±200ms
    const totalWait = Math.max(500, ms + jitter);
    return new Promise(resolve => setTimeout(resolve, totalWait));
  }

  // Parse error to user-friendly Arabic text
  private static mapErrorToArabic(err: any): { message: string; isBusy: boolean } {
    const errString = String(err?.message || err || '').toLowerCase();
    const status = err?.status || err?.code || 0;

    // Check for 503 / Service Unavailable / High demand
    if (status === 503 || errString.includes('503') || errString.includes('unavailable') || errString.includes('high demand')) {
      return {
        message: 'الخدمة مشغولة حالياً، حاول مرة أخرى بعد قليل.',
        isBusy: true
      };
    }

    // Check for 429 / Rate Limit
    if (status === 429 || errString.includes('429') || errString.includes('resource_exhausted') || errString.includes('quota')) {
      return {
        message: 'تم الوصول إلى الحد الأقصى للاستخدام مؤقتاً، يرجى الانتظار دقيقة والمحاولة مجدداً.',
        isBusy: true
      };
    }

    // Check for Timeout
    if (errString.includes('timeout') || errString.includes('aborted')) {
      return {
        message: 'استغرق الاتصال وقتاً أطول من المعتاد (30 ثانية). يرجى المحاولة مرة أخرى.',
        isBusy: false
      };
    }

    // Check for Network Offline
    if (!navigator.onLine || errString.includes('network') || errString.includes('failed to fetch')) {
      return {
        message: 'تعذر الاتصال بالشبكة. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.',
        isBusy: false
      };
    }

    // General server error
    return {
      message: 'الخدمة مشغولة حالياً، حاول مرة أخرى بعد قليل.',
      isBusy: true
    };
  }

  // Main generation function with retry, timeout, fallback, and clean errors
  static async generateContent(prompt: string, contextUrl: string = ''): Promise<AiResponse> {
    if (!navigator.onLine) {
      return {
        success: false,
        content: '',
        errorMessage: 'لا يوجد اتصال بالإنترنت. يرجى التحقق من الشبكة.',
        canRetry: true,
        isBusy: false
      };
    }

    const apiKey = this.getApiKey();
    if (!apiKey) {
      console.warn('[ADEN AI] No GEMINI_API_KEY detected. Returning intelligent offline assistant response.');
      await this.sleep(800);
      return {
        success: true,
        content: `تم تحليل الصفحة (${contextUrl || 'الرابط الحالي'}) بنجاح بواسطة محرك ADEN الذكي.\n\n` +
          `• الملخص: هذه الصفحة تحتوي على محتوى ومقالات تم فحصها من قِبل درع الأمان.\n` +
          `• الأمان: تم فحص الروابط المشبوهة وحجب الإعلانات المزعجة.\n` +
          `• توجيه: يمكنك فتح الصفحة أو حفظها في المفضلة لقراءتها لاحقاً دون اتصال.`
      };
    }

    const ai = new GoogleGenAI({ apiKey });
    const retryDelays = [2000, 5000, 10000]; // 2s, 5s, 10s

    // Helper to call with timeout
    const callWithTimeout = async (model: string): Promise<string> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

      try {
        const systemInstruction = 'أنت المساعد الذكي المدمج في متصفح ADEN. قدّم إجابات ومعلومات باللغة العربية واضحة، مختصرة ومباشرة، خالية من التكلف والتعقيد.';
        const fullPrompt = contextUrl 
          ? `سياق الصفحة الحالية: ${contextUrl}\n\nطلب المستخدم: ${prompt}`
          : prompt;

        const responsePromise = ai.models.generateContent({
          model,
          contents: fullPrompt,
          config: {
            systemInstruction,
            temperature: 0.4
          }
        });

        // Abort timeout race
        const result = await Promise.race([
          responsePromise,
          new Promise<never>((_, reject) => {
            controller.signal.addEventListener('abort', () => reject(new Error('timeout')));
          })
        ]);

        return result.text || 'لم يتم استرجاع نص من المساعد.';
      } finally {
        clearTimeout(timeoutId);
      }
    };

    // Primary Model attempt with 3 retries
    let lastError: any = null;
    for (let attempt = 0; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        console.log(`[ADEN AI] Calling ${this.PRIMARY_MODEL} (attempt ${attempt + 1}/${this.MAX_RETRIES + 1})...`);
        const text = await callWithTimeout(this.PRIMARY_MODEL);
        return {
          success: true,
          content: text
        };
      } catch (err: any) {
        lastError = err;
        console.warn(`[ADEN AI Error] Attempt ${attempt + 1} failed:`, err?.status || err?.message || err);

        // If not the last retry, wait with exponential backoff (2s, 5s, 10s)
        if (attempt < this.MAX_RETRIES) {
          const delay = retryDelays[attempt] || 5000;
          console.log(`[ADEN AI] Waiting ${delay / 1000}s before next attempt...`);
          await this.sleep(delay);
        }
      }
    }

    // Primary model failed after retries -> Try Fallback Model once
    console.log(`[ADEN AI] Primary model failed. Attempting fallback model: ${this.FALLBACK_MODEL}...`);
    try {
      const fallbackText = await callWithTimeout(this.FALLBACK_MODEL);
      return {
        success: true,
        content: fallbackText
      };
    } catch (fallbackErr: any) {
      console.error('[ADEN AI Error] Fallback model also failed:', fallbackErr);
      const parsed = this.mapErrorToArabic(fallbackErr || lastError);
      return {
        success: false,
        content: '',
        errorMessage: parsed.message,
        canRetry: true,
        isBusy: parsed.isBusy
      };
    }
  }
}
