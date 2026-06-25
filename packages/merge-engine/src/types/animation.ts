export type AnimationType = 'merge' | 'fly' | 'scale' | 'bounce' | 'shake';

export interface AnimationRequest {
  id: string;
  type: AnimationType;
  targetId?: string;
  durationMs?: number;
  data?: Record<string, unknown>;
}
