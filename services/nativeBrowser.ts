import { Capacitor, registerPlugin } from '@capacitor/core';

export interface AdenNativeBrowserPlugin {
  openUrl(options: { url: string; tabId?: string; isIncognito?: boolean; isDesktop?: boolean }): Promise<{ success: boolean; url: string }>;
  openCustomTab(options: { url: string }): Promise<{ success: boolean }>;
  goBack(options?: { tabId?: string }): Promise<void>;
  goForward(options?: { tabId?: string }): Promise<void>;
  reload(options?: { tabId?: string }): Promise<void>;
  setDesktopMode(options: { tabId?: string; enabled: boolean }): Promise<void>;
  clearBrowsingData(): Promise<void>;
  addListener(eventName: string, listenerFunc: (info: any) => void): Promise<any>;
}

const AdenNativeBrowser = registerPlugin<AdenNativeBrowserPlugin>('AdenNativeBrowser');

export class NativeBrowserService {
  static isNative(): boolean {
    return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
  }

  static async openUrl(url: string, tabId: string, isIncognito: boolean = false, isDesktop: boolean = false): Promise<boolean> {
    if (this.isNative()) {
      try {
        await AdenNativeBrowser.openUrl({ url, tabId, isIncognito, isDesktop });
        return true;
      } catch (err) {
        console.warn('[NativeBrowserService] Failed to open in native webview, trying custom tab:', err);
        try {
          await AdenNativeBrowser.openCustomTab({ url });
          return true;
        } catch {
          return false;
        }
      }
    }
    return false;
  }

  static async goBack(tabId?: string): Promise<void> {
    if (this.isNative()) {
      try {
        await AdenNativeBrowser.goBack({ tabId });
      } catch (e) {
        console.warn(e);
      }
    }
  }

  static async goForward(tabId?: string): Promise<void> {
    if (this.isNative()) {
      try {
        await AdenNativeBrowser.goForward({ tabId });
      } catch (e) {
        console.warn(e);
      }
    }
  }

  static async reload(tabId?: string): Promise<void> {
    if (this.isNative()) {
      try {
        await AdenNativeBrowser.reload({ tabId });
      } catch (e) {
        console.warn(e);
      }
    }
  }

  static async setDesktopMode(enabled: boolean, tabId?: string): Promise<void> {
    if (this.isNative()) {
      try {
        await AdenNativeBrowser.setDesktopMode({ tabId, enabled });
      } catch (e) {
        console.warn(e);
      }
    }
  }

  static async clearBrowsingData(): Promise<void> {
    if (this.isNative()) {
      try {
        await AdenNativeBrowser.clearBrowsingData();
      } catch (e) {
        console.warn(e);
      }
    }
  }
}
