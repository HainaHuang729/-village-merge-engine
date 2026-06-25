import { getWechatApi } from '../platform/wechat';
import type { SaveEnvelope } from '@merge-engine/core';

interface WebStorageLike {
  getItem: (key: string) => string | null;
  removeItem: (key: string) => void;
  setItem: (key: string, value: string) => void;
}

export class LocalSaveStore<TData> {
  constructor(private readonly key: string) {}

  load(): SaveEnvelope<TData> | undefined {
    try {
      const wx = getWechatApi();
      const webStorage = this.getWebStorage();
      const value = wx?.getStorageSync?.(this.key) ?? webStorage?.getItem(this.key);
      if (!value) {
        return undefined;
      }
      return typeof value === 'string'
        ? (JSON.parse(value) as SaveEnvelope<TData>)
        : (value as SaveEnvelope<TData>);
    } catch {
      return undefined;
    }
  }

  save(envelope: SaveEnvelope<TData>): void {
    try {
      const wx = getWechatApi();
      if (wx?.setStorageSync) {
        wx.setStorageSync(this.key, envelope);
        return;
      }
      this.getWebStorage()?.setItem(this.key, JSON.stringify(envelope));
    } catch {
      // Storage failure should not interrupt a short play session.
    }
  }

  clear(): void {
    try {
      const wx = getWechatApi();
      if (wx?.removeStorageSync) {
        wx.removeStorageSync(this.key);
        return;
      }
      this.getWebStorage()?.removeItem(this.key);
    } catch {
      // Ignore unavailable storage in restricted runtimes.
    }
  }

  private getWebStorage(): WebStorageLike | undefined {
    const scope = globalThis as typeof globalThis & { localStorage?: WebStorageLike };
    return scope.localStorage;
  }
}
