import type { EnginePlugin } from '../types/plugin';

export class MergeEnginePlugin {
  private readonly plugins = new Map<string, EnginePlugin>();

  install(plugin: EnginePlugin): void {
    plugin.install();
    this.plugins.set(plugin.id, plugin);
  }

  uninstall(id: string): void {
    const plugin = this.plugins.get(id);
    plugin?.uninstall?.();
    this.plugins.delete(id);
  }

  get(id: string): EnginePlugin | undefined {
    return this.plugins.get(id);
  }
}
