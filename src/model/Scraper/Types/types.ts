// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';
import type { LookupItem } from '../Lookup/types';
import type { MetadataScraper } from '..';
import type { TrailId, TypeParams, TrailParentId } from '../types';

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

// Base.
export interface BaseParams {
  lookup: LookupItem;
  depth: number;
  trail: {
    trailId: TrailId;
    parent: TrailParentId;
  };
  indexKey: string;
}

// Metadata type required interface.
export abstract class MetadataType {
  // All metadata type classes must hold their type.
  abstract type: string;

  // All metadata type classes must hold their lookup data.
  abstract lookup: LookupItem;

  // All metadata type classes must hold their depth.
  abstract depth: number;

  // All metadata type classes must return a label.
  abstract label(): string;

  // All metadata type classes must return their input types.
  abstract input(): string | null;

  // All metadata type classes must implement a `scrape` method, that converts type ids to actual
  // type metadata.
  abstract scrape(scraper: MetadataScraper, params: TypeParams): AnyJson;
}
