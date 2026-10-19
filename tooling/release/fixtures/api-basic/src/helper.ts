export function helper(count: number, label?: string): number {
  return count + (label?.length ?? 0);
}
