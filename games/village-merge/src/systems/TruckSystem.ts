import type { TruckConfig } from '../config/content';

export interface TruckSnapshot {
  cargo: number;
  deliveredTotal: number;
  lastRestockedAt: number;
}

export class TruckSystem {
  private cargoCount: number;
  private deliveredTotal: number;
  private lastRestockedAt: number;

  constructor(
    private readonly config: TruckConfig,
    snapshot?: TruckSnapshot,
    now = Date.now(),
  ) {
    this.cargoCount = snapshot?.cargo ?? config.initialCargo;
    this.deliveredTotal = snapshot?.deliveredTotal ?? this.cargoCount;
    this.lastRestockedAt = snapshot?.lastRestockedAt ?? now;
    this.clampCargo();
    this.update(now);
  }

  get cargo(): number {
    return this.cargoCount;
  }

  get capacity(): number {
    return this.config.capacity;
  }

  get spawnItemId(): string {
    return this.config.spawnItemId;
  }

  update(now = Date.now()): number {
    if (this.cargoCount >= this.config.capacity) {
      this.lastRestockedAt = now;
      return 0;
    }

    const elapsed = now - this.lastRestockedAt;
    if (elapsed < this.config.replenishIntervalMs) {
      return 0;
    }

    const intervals = Math.floor(elapsed / this.config.replenishIntervalMs);
    const space = this.config.capacity - this.cargoCount;
    const added = Math.min(space, intervals);
    this.cargoCount += added;
    this.deliveredTotal += added;
    this.lastRestockedAt =
      added < intervals ? now : this.lastRestockedAt + added * this.config.replenishIntervalMs;
    return added;
  }

  unloadOne(): string | undefined {
    if (this.cargoCount <= 0) {
      return undefined;
    }
    this.cargoCount -= 1;
    return this.config.spawnItemId;
  }

  timeToNextMs(now = Date.now()): number {
    if (this.cargoCount >= this.config.capacity) {
      return 0;
    }
    const elapsed = now - this.lastRestockedAt;
    return Math.max(0, this.config.replenishIntervalMs - elapsed);
  }

  serialize(): TruckSnapshot {
    return {
      cargo: this.cargoCount,
      deliveredTotal: this.deliveredTotal,
      lastRestockedAt: this.lastRestockedAt,
    };
  }

  private clampCargo(): void {
    this.cargoCount = Math.max(0, Math.min(this.cargoCount, this.config.capacity));
  }
}
