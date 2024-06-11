import type { AnyJson } from '@w3ux/types';

export interface VariantType {
  variants: VariantItem[];
}
export interface VariantItem {
  name: string | null;
  fields: VariantField[];
  index: number;
  docs: string[];
}

export interface VariantField {
  docs: string[];
  name: string;
  type: AnyJson;
  typeName: string;
}
