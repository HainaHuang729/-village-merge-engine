import type { BoardPosition } from './board';
import type { ItemInstance } from './item';

export interface MergeRule {
  id: string;
  from: string[];
  to: string;
  minCount?: number;
  delayMs?: number;
  animation?: string;
  tags?: string[];
}

export interface MergeRuleManifest {
  rules: MergeRule[];
}

export interface MergeRequest {
  source: ItemInstance;
  target: ItemInstance;
  sourcePosition?: BoardPosition;
  targetPosition?: BoardPosition;
}

export interface MergeResult {
  rule: MergeRule;
  consumed: ItemInstance[];
  created: ItemInstance;
  position?: BoardPosition;
}

export interface MergeFailure {
  reason: string;
  request: MergeRequest;
}
