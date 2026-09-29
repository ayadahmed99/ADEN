import { HistoryItem } from '../types';

export const HistoryService = {
  getAll(): HistoryItem[] {
    try {
      const data = localStorage.getItem('aden_history');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  add(item: { title: string; url: string; isIncognito: boolean }): void {
    if (item.isIncognito) return;
    const list = this.getAll();
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      title: item.title || item.url,
      url: item.url,
      timestamp: Date.now(),
      isIncognito: false
    };
    if (list.length > 0 && list[0].url === item.url) {
      list[0].timestamp = Date.now();
    } else {
      list.unshift(newItem);
    }
    localStorage.setItem('aden_history', JSON.stringify(list.slice(0, 200)));
  },

  clear(): void {
    localStorage.removeItem('aden_history');
  },

  remove(id: string): void {
    const list = this.getAll().filter(h => h.id !== id);
    localStorage.setItem('aden_history', JSON.stringify(list));
  }
};
