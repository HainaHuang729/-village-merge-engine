import { describe, expect, it } from 'vitest';
import { SaveManager } from '../src/save/SaveManager';

describe('SaveManager', () => {
  it('wraps and unwraps game-owned save data', () => {
    const saveManager = new SaveManager<{ progress: number }>('test-engine');
    const envelope = saveManager.serialize({ progress: 3 });

    expect(envelope.version).toBe(1);
    expect(envelope.engineVersion).toBe('test-engine');
    expect(envelope.data).toEqual({ progress: 3 });
    expect(typeof envelope.savedAt).toBe('number');
    expect(saveManager.deserialize(envelope)).toEqual({ progress: 3 });
  });
});
