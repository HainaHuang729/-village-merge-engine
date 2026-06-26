import { getWechatApi } from './wechat';

type Listener = (event: unknown) => void;
type AnimationFrameCallback = (time: number) => void;

interface MiniRect {
  bottom: number;
  height: number;
  left: number;
  right: number;
  toJSON: () => Record<string, never>;
  top: number;
  width: number;
  x: number;
  y: number;
}

interface WechatTouch {
  clientX?: number;
  clientY?: number;
  identifier?: number;
  pageX?: number;
  pageY?: number;
  x?: number;
  y?: number;
}

interface WechatTouchEvent {
  changedTouches?: WechatTouch[];
  touches?: WechatTouch[];
  timeStamp?: number;
}

interface WechatCanvasLike {
  height?: number;
  style?: Record<string, unknown>;
  width?: number;
  addEventListener?: (type: string, listener: Listener) => void;
  dispatchEvent?: (event: unknown) => boolean;
  getBoundingClientRect?: () => MiniRect;
  getContext?: (type: string, options?: unknown) => unknown;
  removeEventListener?: (type: string, listener: Listener) => void;
}

interface WechatImageLike {
  height?: number;
  onerror?: ((event: unknown) => void) | null;
  onload?: ((event: unknown) => void) | null;
  src?: string;
  width?: number;
}

interface WechatRuntimeApi {
  cancelAnimationFrame?: (id: number) => void;
  createCanvas?: () => WechatCanvasLike;
  createImage?: () => WechatImageLike;
  createInnerAudioContext?: () => unknown;
  getSystemInfoSync?: () => {
    pixelRatio?: number;
    windowHeight?: number;
    windowWidth?: number;
  };
  offTouchCancel?: (listener: Listener) => void;
  offTouchEnd?: (listener: Listener) => void;
  offTouchMove?: (listener: Listener) => void;
  offTouchStart?: (listener: Listener) => void;
  onTouchCancel?: (listener: Listener) => void;
  onTouchEnd?: (listener: Listener) => void;
  onTouchMove?: (listener: Listener) => void;
  onTouchStart?: (listener: Listener) => void;
  requestAnimationFrame?: (listener: AnimationFrameCallback) => number;
}

class MiniEventTarget {
  private readonly listeners = new Map<string, Set<Listener>>();

  addEventListener(type: string, listener: Listener): void {
    let listeners = this.listeners.get(type);
    if (!listeners) {
      listeners = new Set<Listener>();
      this.listeners.set(type, listeners);
    }
    listeners.add(listener);
  }

  removeEventListener(type: string, listener: Listener): void {
    this.listeners.get(type)?.delete(listener);
  }

  dispatchEvent(event: unknown): boolean {
    const typedEvent = event as { type?: string };
    if (!typedEvent.type) {
      return true;
    }
    this.listeners.get(typedEvent.type)?.forEach((listener) => listener(event));
    return true;
  }
}

class MiniElement extends MiniEventTarget {
  readonly children: unknown[] = [];
  readonly classList = {
    add: (): void => undefined,
    contains: (): boolean => false,
    remove: (): void => undefined,
  };
  readonly relList = {
    supports: (): boolean => false,
  };
  readonly style: Record<string, unknown> = {};
  clientHeight = 0;
  clientWidth = 0;
  height = 0;
  innerHTML = '';
  parentNode?: MiniElement;
  tagName: string;
  textContent = '';
  width = 0;

  constructor(tagName: string) {
    super();
    this.tagName = tagName.toUpperCase();
  }

  appendChild<T>(child: T): T {
    this.children.push(child);
    if (child && typeof child === 'object') {
      (child as { parentNode?: MiniElement }).parentNode = this;
    }
    return child;
  }

  blur(): void {
    return undefined;
  }

  click(): void {
    this.dispatchEvent({ type: 'click' });
  }

  focus(): void {
    return undefined;
  }

  getAttribute(): string | null {
    return null;
  }

  getBoundingClientRect(): MiniRect {
    return createRect(0, 0, this.clientWidth || this.width, this.clientHeight || this.height);
  }

  removeChild<T>(child: T): T {
    const index = this.children.indexOf(child);
    if (index >= 0) {
      this.children.splice(index, 1);
    }
    return child;
  }

  setAttribute(): void {
    return undefined;
  }
}

export function installWechatAdapter(): void {
  const wx = getWechatApi() as (WechatRuntimeApi & ReturnType<typeof getWechatApi>) | undefined;
  const scope = globalThis as unknown as Record<string, unknown>;
  if (!wx || scope.document) {
    return;
  }

  const info = wx.getSystemInfoSync?.() ?? {};
  const width = info.windowWidth ?? 390;
  const height = info.windowHeight ?? 720;
  const pixelRatio = info.pixelRatio ?? 1;
  const eventTarget = new MiniEventTarget();
  const body = new MiniElement('body');
  body.clientWidth = width;
  body.clientHeight = height;
  const documentElement = new MiniElement('html');
  documentElement.clientWidth = width;
  documentElement.clientHeight = height;
  const head = new MiniElement('head');

  const mainCanvas = patchCanvas(wx.createCanvas?.() ?? new MiniElement('canvas'), width, height);

  const documentShim = {
    body,
    createElement: (tagName: string) => createElement(tagName, wx, width, height, mainCanvas),
    createElementNS: (_namespace: string, tagName: string) =>
      createElement(tagName, wx, width, height, mainCanvas),
    createTextNode: (text: string) => ({ textContent: text }),
    documentElement,
    getElementsByTagName: (): unknown[] => [],
    getElementById: (): MiniElement => body,
    head,
    hidden: false,
    querySelector: (): null => null,
    querySelectorAll: (): unknown[] => [],
    visibilityState: 'visible',
    addEventListener: eventTarget.addEventListener.bind(eventTarget),
    dispatchEvent: eventTarget.dispatchEvent.bind(eventTarget),
    removeEventListener: eventTarget.removeEventListener.bind(eventTarget),
  };

  defineGlobal(scope, 'window', scope);
  defineGlobal(scope, 'self', scope);
  defineGlobal(scope, 'global', scope);
  defineGlobal(scope, 'document', documentShim);
  defineGlobal(scope, 'navigator', {
    maxTouchPoints: 5,
    onLine: true,
    platform: 'wechat',
    userAgent: 'Mozilla/5.0 (WeChatMiniGame)',
  });
  defineGlobal(scope, 'location', { href: '', protocol: 'https:' });
  defineGlobal(scope, 'devicePixelRatio', pixelRatio);
  defineGlobal(scope, 'innerWidth', width);
  defineGlobal(scope, 'innerHeight', height);
  defineGlobal(scope, 'outerWidth', width);
  defineGlobal(scope, 'outerHeight', height);
  defineGlobal(scope, 'screen', { width, height, availWidth: width, availHeight: height });
  defineGlobal(scope, 'Image', function Image(): WechatImageLike {
    return wx.createImage?.() ?? {};
  });
  defineGlobal(scope, 'HTMLCanvasElement', function HTMLCanvasElement(): void {
    return undefined;
  });
  defineGlobal(scope, 'HTMLImageElement', function HTMLImageElement(): void {
    return undefined;
  });
  defineGlobal(scope, 'Audio', function Audio(): unknown {
    return wx.createInnerAudioContext?.() ?? {};
  });
  defineGlobal(scope, 'Event', function Event(
    type: string,
    options?: Record<string, unknown>,
  ): Record<string, unknown> {
    return { ...options, type };
  });
  defineGlobal(scope, 'CustomEvent', function CustomEvent(
    type: string,
    options?: { detail?: unknown },
  ): Record<string, unknown> {
    return { detail: options?.detail, type };
  });
  defineGlobal(scope, 'performance', scope.performance ?? { now: () => Date.now() });
  defineGlobal(scope, 'requestAnimationFrame',
    wx.requestAnimationFrame?.bind(wx) ??
    ((callback: AnimationFrameCallback): number =>
      Number(globalThis.setTimeout(() => callback(Date.now()), 16))),
  );
  defineGlobal(scope, 'cancelAnimationFrame',
    wx.cancelAnimationFrame?.bind(wx) ??
    ((id: number): void => {
      globalThis.clearTimeout(id);
    }),
  );
  defineGlobal(scope, 'addEventListener', eventTarget.addEventListener.bind(eventTarget));
  defineGlobal(scope, 'removeEventListener', eventTarget.removeEventListener.bind(eventTarget));
  defineGlobal(scope, 'dispatchEvent', eventTarget.dispatchEvent.bind(eventTarget));
  installTouchForwarding(wx, [eventTarget, documentShim, mainCanvas]);
}

function defineGlobal(scope: Record<string, unknown>, key: string, value: unknown): void {
  Object.defineProperty(scope, key, {
    configurable: true,
    enumerable: true,
    value,
    writable: true,
  });
}

function createElement(
  tagName: string,
  wx: WechatRuntimeApi,
  width: number,
  height: number,
  mainCanvas: WechatCanvasLike,
): unknown {
  const normalized = tagName.toLowerCase();
  if (normalized === 'canvas') {
    return mainCanvas;
  }
  if (normalized === 'img' || normalized === 'image') {
    return wx.createImage?.() ?? new MiniElement('img');
  }
  const element = new MiniElement(normalized);
  element.clientWidth = width;
  element.clientHeight = height;
  return element;
}

function patchCanvas(canvas: WechatCanvasLike | MiniElement, width: number, height: number): WechatCanvasLike {
  const target = canvas as WechatCanvasLike & MiniElement & Record<string, unknown>;
  target.width = target.width ?? width;
  target.height = target.height ?? height;
  target.style = target.style ?? {};
  target.clientWidth = width;
  target.clientHeight = height;
  target.tagName = 'CANVAS';
  const events = new MiniEventTarget();
  target.addEventListener = events.addEventListener.bind(events);
  target.removeEventListener = events.removeEventListener.bind(events);
  target.dispatchEvent = events.dispatchEvent.bind(events);
  target.getBoundingClientRect = () => createRect(0, 0, width, height);
  target.setAttribute = (): void => undefined;
  target.getAttribute = (): null => null;
  target.focus = (): void => undefined;
  target.blur = (): void => undefined;
  return target;
}

function installTouchForwarding(
  wx: WechatRuntimeApi,
  targets: Array<{ dispatchEvent?: (event: unknown) => boolean }>,
): void {
  const forward = (type: string) => (event: unknown): void => {
    const normalized = normalizeTouchEvent(type, event as WechatTouchEvent);
    targets.forEach((target) => target.dispatchEvent?.(normalized));
  };

  wx.onTouchStart?.(forward('touchstart'));
  wx.onTouchMove?.(forward('touchmove'));
  wx.onTouchEnd?.(forward('touchend'));
  wx.onTouchCancel?.(forward('touchcancel'));
}

function normalizeTouchEvent(type: string, event: WechatTouchEvent): Record<string, unknown> {
  return {
    ...event,
    changedTouches: event.changedTouches?.map(normalizeTouch) ?? [],
    preventDefault: (): void => undefined,
    stopPropagation: (): void => undefined,
    target: globalThis.document,
    timeStamp: event.timeStamp ?? Date.now(),
    touches: event.touches?.map(normalizeTouch) ?? [],
    type,
  };
}

function normalizeTouch(touch: WechatTouch): Record<string, number> {
  const x = touch.clientX ?? touch.pageX ?? touch.x ?? 0;
  const y = touch.clientY ?? touch.pageY ?? touch.y ?? 0;
  return {
    clientX: x,
    clientY: y,
    identifier: touch.identifier ?? 0,
    pageX: touch.pageX ?? x,
    pageY: touch.pageY ?? y,
    screenX: x,
    screenY: y,
  };
}

function createRect(x: number, y: number, width: number, height: number): MiniRect {
  return {
    bottom: y + height,
    height,
    left: x,
    right: x + width,
    toJSON: () => ({}),
    top: y,
    width,
    x,
    y,
  };
}
