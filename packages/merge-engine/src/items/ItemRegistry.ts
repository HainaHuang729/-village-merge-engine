import type { ItemConfig } from '../types/item';

export class ItemRegistry {
  private readonly configs = new Map<string, ItemConfig>();

  register(config: ItemConfig): void {
    this.configs.set(config.id, config);
  }

  registerMany(configs: ItemConfig[]): void {
    configs.forEach((config) => this.register(config));
  }

  get(id: string): ItemConfig | undefined {
    return this.configs.get(id);
  }

  require(id: string): ItemConfig {
    const config = this.get(id);
    if (!config) {
      throw new Error(`Missing item config: ${id}`);
    }
    return config;
  }

  all(): ItemConfig[] {
    return [...this.configs.values()];
  }
}
