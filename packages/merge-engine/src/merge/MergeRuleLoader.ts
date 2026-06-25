import type { MergeRule, MergeRuleManifest } from '../types/merge';

type RawMergeRuleManifest = MergeRule[] | MergeRuleManifest;

export class MergeRuleLoader {
  load(input: string | RawMergeRuleManifest): MergeRule[] {
    const parsed = typeof input === 'string' ? this.parseJson(input) : input;
    const rules = Array.isArray(parsed) ? parsed : parsed.rules;
    if (!Array.isArray(rules)) {
      throw new Error('Merge rule manifest must contain a rules array.');
    }
    return rules.map((rule, index) => this.validateRule(rule, index));
  }

  private parseJson(input: string): RawMergeRuleManifest {
    try {
      return JSON.parse(input) as RawMergeRuleManifest;
    } catch {
      throw new Error('Invalid merge rule JSON.');
    }
  }

  private validateRule(rule: MergeRule, index: number): MergeRule {
    if (!rule || typeof rule !== 'object') {
      throw new Error(`Invalid merge rule at index ${index}.`);
    }
    if (typeof rule.id !== 'string' || rule.id.length === 0) {
      throw new Error(`Merge rule at index ${index} requires a non-empty id.`);
    }
    if (!Array.isArray(rule.from) || rule.from.length < 2) {
      throw new Error(`Merge rule "${rule.id}" requires at least two source ids.`);
    }
    if (!rule.from.every((sourceId) => typeof sourceId === 'string' && sourceId.length > 0)) {
      throw new Error(`Merge rule "${rule.id}" has invalid source ids.`);
    }
    if (typeof rule.to !== 'string' || rule.to.length === 0) {
      throw new Error(`Merge rule "${rule.id}" requires a non-empty target id.`);
    }

    return {
      ...rule,
      from: [...rule.from],
      tags: rule.tags ? [...rule.tags] : undefined,
    };
  }
}

export const mergeRuleLoader = new MergeRuleLoader();
