import type { BoardSnapshot, ItemStoreSnapshot } from '@merge-engine/core';
import type { TruckSnapshot } from '../systems/TruckSystem';
import type { VillageSnapshot } from '../systems/VillageState';

export interface VillageMergeSaveData {
  board: BoardSnapshot;
  items: ItemStoreSnapshot;
  truck: TruckSnapshot;
  village: VillageSnapshot;
}
