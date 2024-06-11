import type { AnyJson } from '@w3ux/types';

export interface VariantItem {
  name: string | null;
  fields: AnyJson[];
  index: number;
  docs: string[];
}
