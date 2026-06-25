import { EngineEvent } from '../types/events';
import { createId } from '../utils/ids';
import type { EventBus } from '../core/EventBus';
import type { EngineEventMap } from '../types/events';
import type { ItemInstance, ItemStoreSnapshot } from '../types/item';

export class ItemStore {
  private readonly items = new Map<string, ItemInstance>();

  constructor(private readonly eventBus?: EventBus<EngineEventMap>) {}

  create(configId: string, state?: Record<string, unknown>): ItemInstance {
    const item = { id: createId(configId), configId, state };
    this.add(item);
    return item;
  }

  add(item: ItemInstance, emit = true): void {
    this.items.set(item.id, item);
    if (emit) {
      this.eventBus?.emit(EngineEvent.ItemCreated, { item });
    }
  }

  get(id: string): ItemInstance | undefined {
    return this.items.get(id);
  }

  require(id: string): ItemInstance {
    const item = this.get(id);
    if (!item) {
      throw new Error(`Missing item instance: ${id}`);
    }
    return item;
  }

  remove(id: string): ItemInstance | undefined {
    const item = this.items.get(id);
    if (!item) {
      return undefined;
    }
    this.items.delete(id);
    this.eventBus?.emit(EngineEvent.ItemRemoved, { itemId: id });
    return item;
  }

  all(): ItemInstance[] {
    return [...this.items.values()];
  }

  serialize(): ItemStoreSnapshot {
    return {
      items: this.all().map((item) => ({ ...item, state: item.state ? { ...item.state } : undefined })),
    };
  }

  loadSnapshot(snapshot: ItemStoreSnapshot): void {
    this.items.clear();
    snapshot.items.forEach((item) => this.add(item, false));
  }

  static deserialize(snapshot: ItemStoreSnapshot, eventBus?: EventBus<EngineEventMap>): ItemStore {
    const store = new ItemStore(eventBus);
    store.loadSnapshot(snapshot);
    return store;
  }
}
