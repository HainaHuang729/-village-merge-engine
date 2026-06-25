import { describe, expect, it } from 'vitest';
import { ItemStore } from '../src/items/ItemStore';

describe('ItemStore', () => {
  it('creates, retrieves, removes, and snapshots items', () => {
    const store = new ItemStore();
    const item = store.create('item-a', { durability: 1 });

    expect(store.get(item.id)).toEqual(item);
    expect(store.all()).toHaveLength(1);

    const snapshot = store.serialize();
    const restored = ItemStore.deserialize(snapshot);

    expect(restored.get(item.id)).toEqual(item);
    expect(restored.remove(item.id)).toEqual(item);
    expect(restored.get(item.id)).toBeUndefined();
  });
});
