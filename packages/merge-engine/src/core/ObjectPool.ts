export type PoolFactory<TItem> = () => TItem;
export type PoolReset<TItem> = (item: TItem) => void;

export class ObjectPool<TItem> {
  private readonly available: TItem[] = [];

  constructor(
    private readonly factory: PoolFactory<TItem>,
    private readonly reset?: PoolReset<TItem>,
  ) {}

  acquire(): TItem {
    return this.available.pop() ?? this.factory();
  }

  release(item: TItem): void {
    this.reset?.(item);
    this.available.push(item);
  }

  size(): number {
    return this.available.length;
  }
}
