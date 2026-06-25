export interface WechatGameApi {
  getStorageSync?: (key: string) => unknown;
  setStorageSync?: (key: string, value: unknown) => void;
  removeStorageSync?: (key: string) => void;
  getSystemInfoSync?: () => {
    windowWidth?: number;
    windowHeight?: number;
    pixelRatio?: number;
    safeArea?: {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
      width?: number;
      height?: number;
    };
  };
  setKeepScreenOn?: (options: { keepScreenOn: boolean }) => void;
}

export interface RuntimeInfo {
  platform: 'web' | 'wechat';
  width: number;
  height: number;
  pixelRatio: number;
  safeAreaTop: number;
  safeAreaBottom: number;
}

export function getWechatApi(): WechatGameApi | undefined {
  const scope = globalThis as typeof globalThis & { wx?: WechatGameApi };
  return scope.wx;
}

export function getRuntimeInfo(): RuntimeInfo {
  const wx = getWechatApi();
  const info = wx?.getSystemInfoSync?.();
  if (info) {
    return {
      platform: 'wechat',
      width: info.windowWidth ?? 390,
      height: info.windowHeight ?? 720,
      pixelRatio: info.pixelRatio ?? 1,
      safeAreaTop: info.safeArea?.top ?? 0,
      safeAreaBottom: info.safeArea?.bottom ?? info.windowHeight ?? 720,
    };
  }

  const scope = globalThis as typeof globalThis & {
    devicePixelRatio?: number;
    innerHeight?: number;
    innerWidth?: number;
  };
  const width = scope.innerWidth ?? 390;
  const height = scope.innerHeight ?? 720;
  return {
    platform: 'web',
    width,
    height,
    pixelRatio: scope.devicePixelRatio ?? 1,
    safeAreaTop: 0,
    safeAreaBottom: height,
  };
}
