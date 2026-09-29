import { Bookmark } from '../types';

const INITIAL_BOOKMARKS: Bookmark[] = [
  { id: '1', title: 'جوجل', url: 'https://www.google.com', icon: 'search', category: 'بحث', createdAt: Date.now() },
  { id: '2', title: 'ويكيبيديا العربية', url: 'https://ar.wikipedia.org', icon: 'menu_book', category: 'معرفة', createdAt: Date.now() },
  { id: '3', title: 'الجزيرة نت', url: 'https://www.aljazeera.net', icon: 'newspaper', category: 'أخبار', createdAt: Date.now() },
  { id: '4', title: 'يوتيوب', url: 'https://www.youtube.com', icon: 'smart_display', category: 'فيديو', createdAt: Date.now() },
  { id: '5', title: 'حاسبة الطقس', url: 'https://weather.com', icon: 'cloud', category: 'أدوات', createdAt: Date.now() },
  { id: '6', title: 'جيت هب', url: 'https://github.com', icon: 'code', category: 'تطوير', createdAt: Date.now() }
];

export const BookmarkService = {
  getAll(): Bookmark[] {
    try {
      const data = localStorage.getItem('aden_bookmarks');
      return data ? JSON.parse(data) : INITIAL_BOOKMARKS;
    } catch {
      return INITIAL_BOOKMARKS;
    }
  },

  add(item: Omit<Bookmark, 'id' | 'createdAt'>): Bookmark {
    const list = this.getAll();
    const newBookmark: Bookmark = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: Date.now()
    };
    list.unshift(newBookmark);
    localStorage.setItem('aden_bookmarks', JSON.stringify(list));
    return newBookmark;
  },

  remove(id: string): void {
    const list = this.getAll().filter(b => b.id !== id);
    localStorage.setItem('aden_bookmarks', JSON.stringify(list));
  },

  isBookmarked(url: string): boolean {
    const list = this.getAll();
    return list.some(b => b.url.toLowerCase() === url.toLowerCase());
  }
};
