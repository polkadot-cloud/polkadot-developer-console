// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';
import type { LookupItem } from '../Lookup/types';
import type { MetadataScraper } from '..';
import type { TrailParam } from '../types';

// Primitive
export type PrimitiveType = string;

// Array
export interface IArrayType {
  len: number;
  type: AnyJson;
}

// Bit Sequence
export interface BitSequenceType {
  bitStoreType: AnyJson;
  bitOrderType: AnyJson;
}

// Compact
export interface CompactType {
  type: AnyJson;
}

// Composite
export interface CompositeType {
  fields: CompositeField[];
}

export interface CompositeField {
  docs: string[];
  name: string;
  type: AnyJson;
  typeName: string;
}

// Sequence
export interface SequenceType {
  type: AnyJson;
}

// Tuple
export type TupleType = number[];

// Variant
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

// Metadata type required interface.
export abstract class MetadataType {
  // All metadata type classes must hold their lookup data.
  abstract lookup: LookupItem;

  // All metadata type classes must implement a `scrape` method, that converts type ids to actual
  // type metadata.
  abstract scrape(scraper: MetadataScraper, trailParam: TrailParam): AnyJson;
}