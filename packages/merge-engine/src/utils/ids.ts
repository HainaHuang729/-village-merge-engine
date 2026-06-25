let nextId = 0;

export function createId(prefix = 'id'): string {
  nextId += 1;
  return `${prefix}-${nextId}`;
}
