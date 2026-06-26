import { afterEach, describe, expect, it } from 'vitest';
import { installWechatAdapter } from '../src/platform/wechat-adapter';

const globalRecord = globalThis as unknown as Record<string, unknown>;

describe('wechat adapter bootstrap', () => {
  afterEach(() => {
    delete globalRecord.wx;
    delete globalRecord.document;
    delete globalRecord.window;
    delete globalRecord.self;
    delete globalRecord.navigator;
    delete globalRecord.location;
    delete globalRecord.Image;
    delete globalRecord.Audio;
    delete globalRecord.Event;
    delete globalRecord.CustomEvent;
  });

  it('installs browser-like globals when wx exists', () => {
    const touchStartHandlers: Array<(event: unknown) => void> = [];
    globalRecord.wx = {
      createCanvas: () => ({
        getContext: () => ({}),
      }),
      createImage: () => ({}),
      getSystemInfoSync: () => ({
        pixelRatio: 2,
        windowHeight: 720,
        windowWidth: 390,
      }),
      onTouchStart: (handler: (event: unknown) => void) => touchStartHandlers.push(handler),
    };

    installWechatAdapter();

    expect(globalRecord.window).toBe(globalRecord);
    expect(globalRecord.document).toBeTruthy();
    expect(globalRecord.navigator).toMatchObject({
      maxTouchPoints: 5,
      platform: 'wechat',
    });
    expect(globalRecord.innerWidth).toBe(390);
    expect(globalRecord.innerHeight).toBe(720);
    expect(touchStartHandlers).toHaveLength(1);

    const documentShim = globalRecord.document as {
      createElement: (tagName: string) => {
        addEventListener: (type: string, handler: (event: unknown) => void) => void;
        getBoundingClientRect: () => { height: number; width: number };
      };
    };
    const canvas = documentShim.createElement('canvas');
    const receivedEvents: unknown[] = [];
    canvas.addEventListener('touchstart', (event) => receivedEvents.push(event));
    touchStartHandlers[0]?.({
      touches: [{ identifier: 7, x: 12, y: 34 }],
    });

    expect(canvas.getBoundingClientRect()).toMatchObject({ height: 720, width: 390 });
    expect(receivedEvents).toHaveLength(1);
    expect(receivedEvents[0]).toMatchObject({
      touches: [{ clientX: 12, clientY: 34, identifier: 7 }],
      type: 'touchstart',
    });
  });

  it('does nothing outside a wx runtime', () => {
    installWechatAdapter();

    expect(globalRecord.document).toBeUndefined();
  });
});
