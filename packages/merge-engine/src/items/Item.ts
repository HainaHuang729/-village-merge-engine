import type { ItemConfig, ItemInstance } from '../types/item';

export class Item implements ItemInstance {
  readonly id: string;
  readonly configId: string;
  state?: Record<string, unknown>;

  constructor(instance: ItemInstance) {
    this.id = instance.id;
    this.configId = instance.configId;
    this.state = instance.state;
  }
}

export function createItemFromConfig(config: ItemConfig, id: string): Item {
  return new Item({ id, configId: config.id });
}
