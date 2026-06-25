export interface SaveEnvelope<TData = unknown> {
  version: number;
  engineVersion: string;
  data: TData;
  savedAt: number;
}

export interface SaveSerializer<TData = unknown> {
  serialize(data: TData): SaveEnvelope<TData>;
  deserialize(snapshot: SaveEnvelope<TData>): TData;
}
