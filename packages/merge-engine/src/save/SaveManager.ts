import type { SaveEnvelope, SaveSerializer } from '../types/save';

export class SaveManager<TData = unknown> implements SaveSerializer<TData> {
  constructor(private readonly engineVersion: string) {}

  serialize(data: TData): SaveEnvelope<TData> {
    return {
      version: 1,
      engineVersion: this.engineVersion,
      data,
      savedAt: Date.now(),
    };
  }

  deserialize(snapshot: SaveEnvelope<TData>): TData {
    return snapshot.data;
  }
}
