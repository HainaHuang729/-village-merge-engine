import { EngineEvent } from '../types/events';
import { createId } from '../utils/ids';
import type { EventBus } from '../core/EventBus';
import type { EngineEventMap } from '../types/events';
import type { MergeRequest, MergeResult, MergeRule } from '../types/merge';

export class MergeManager {
  private readonly rules = new Map<string, MergeRule>();

  constructor(private readonly eventBus: EventBus<EngineEventMap>) {}

  setRules(rules: MergeRule[]): void {
    this.rules.clear();
    rules.forEach((rule) => this.rules.set(rule.id, rule));
  }

  registerRule(rule: MergeRule): void {
    this.rules.set(rule.id, rule);
  }

  registerRules(rules: MergeRule[]): void {
    rules.forEach((rule) => this.registerRule(rule));
  }

  getRules(): MergeRule[] {
    return [...this.rules.values()];
  }

  canMerge(request: MergeRequest): boolean {
    return Boolean(this.findRule(request));
  }

  merge(request: MergeRequest): MergeResult | undefined {
    const rule = this.findRule(request);
    if (!rule) {
      this.eventBus.emit(EngineEvent.MergeFailed, {
        reason: 'NO_MATCHING_RULE',
        source: request.sourcePosition,
        target: request.targetPosition,
      });
      return undefined;
    }

    const result: MergeResult = {
      rule,
      consumed: [request.source, request.target],
      created: { id: createId(rule.to), configId: rule.to },
      position: request.targetPosition,
    };
    this.eventBus.emit(EngineEvent.MergeSuccess, { result });
    return result;
  }

  findRule(request: MergeRequest): MergeRule | undefined {
    const requested = [request.source.configId, request.target.configId].sort().join('|');
    return [...this.rules.values()].find((rule) => rule.from.slice().sort().join('|') === requested);
  }
}
