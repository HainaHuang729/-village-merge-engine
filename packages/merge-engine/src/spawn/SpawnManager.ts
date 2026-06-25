import { EngineEvent } from '../types/events';
import { createId } from '../utils/ids';
import type { EventBus } from '../core/EventBus';
import type { EngineEventMap } from '../types/events';
import type { ItemInstance } from '../types/item';

export class SpawnManager {
  constructor(private readonly eventBus: EventBus<EngineEventMap>) {}

  create(configId: string): ItemInstance {
    const item = { id: createId(configId), configId };
    this.eventBus.emit(EngineEvent.ItemCreated, { item });
    return item;
  }
}
