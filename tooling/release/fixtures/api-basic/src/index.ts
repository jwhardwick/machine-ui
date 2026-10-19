// A tiny package used to test the API report.
export interface WidgetProps {
  /** Required label. */
  label: string;
  size?: 'sm' | 'md';
}

export function Widget(props: WidgetProps): string {
  return props.label + (props.size ?? 'md');
}

export const VERSION = '1.0.0';

export type Tone = 'calm' | 'loud';

export { helper as renamedHelper } from './helper.ts';
