export interface VillageSnapshot {
  buildings: string[];
  completedAt: Record<string, number>;
}

export class VillageState {
  private readonly buildings = new Set<string>();
  private readonly completedAt = new Map<string, number>();

  constructor(snapshot?: VillageSnapshot) {
    snapshot?.buildings.forEach((buildingId) => this.buildings.add(buildingId));
    Object.entries(snapshot?.completedAt ?? {}).forEach(([buildingId, timestamp]) => {
      this.completedAt.set(buildingId, timestamp);
    });
  }

  build(buildingId: string, now = Date.now()): boolean {
    if (this.buildings.has(buildingId)) {
      return false;
    }
    this.buildings.add(buildingId);
    this.completedAt.set(buildingId, now);
    return true;
  }

  has(buildingId: string): boolean {
    return this.buildings.has(buildingId);
  }

  all(): string[] {
    return [...this.buildings.values()];
  }

  serialize(): VillageSnapshot {
    return {
      buildings: this.all(),
      completedAt: Object.fromEntries(this.completedAt),
    };
  }
}
