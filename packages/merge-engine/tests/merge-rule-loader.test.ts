import { describe, expect, it } from 'vitest';
import { MergeRuleLoader } from '../src/merge/MergeRuleLoader';

describe('MergeRuleLoader', () => {
  it('loads rules from JSON manifest', () => {
    const loader = new MergeRuleLoader();
    const rules = loader.load(
      JSON.stringify({
        rules: [{ id: 'a-a-to-b', from: ['a', 'a'], to: 'b', tags: ['basic'] }],
      }),
    );

    expect(rules).toEqual([{ id: 'a-a-to-b', from: ['a', 'a'], to: 'b', tags: ['basic'] }]);
  });

  it('loads rules from array config', () => {
    const loader = new MergeRuleLoader();
    const rules = loader.load([{ id: 'a-a-to-b', from: ['a', 'a'], to: 'b' }]);

    expect(rules).toEqual([{ id: 'a-a-to-b', from: ['a', 'a'], to: 'b', tags: undefined }]);
  });

  it('rejects invalid JSON', () => {
    const loader = new MergeRuleLoader();

    expect(() => loader.load('{')).toThrow('Invalid merge rule JSON.');
  });

  it('rejects invalid rule shape', () => {
    const loader = new MergeRuleLoader();

    expect(() => loader.load({ rules: [{ id: 'bad', from: ['a'], to: 'b' }] })).toThrow(
      'requires at least two source ids',
    );
  });
});
