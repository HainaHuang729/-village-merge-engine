export interface ItemConfig {
  id: string;
  name: string;
  icon: string;
  level?: number;
  mergeTo?: string;
  tags?: string[];
  category?: string;
  animation?: string;
  data?: Record<string, unknown>;
}

export interface ItemInstance {
  id: string;
  configId: string;
  state?: Record<string, unknown>;
}

export interface ItemStoreSnapshot {
  items: ItemInstance[];
}
