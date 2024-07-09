// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';
import type { LookupItem } from '../Lookup/types';
import type { MetadataScraper } from '..';
import type { TrailId, TypeParams, TrailParentId } from '../types';

/*
NOTES: 
- These types are prefixed with `I` as to not get confused with type classes.
- Type classes are suffixed with `Type`, as to not get confused with UI components.
*/

// Primitive
export type IPrimitiveType = string;

// Array
export interface IArrayType {
  len: number;
  type: AnyJson;
}

// Bit Sequence
export interface IBitSequenceType {
  bitStoreType: AnyJson;
  bitOrderType: AnyJson;
}

// Compact
export interface ICompactType {
  type: AnyJson;
}

// Composite
export interface ICompositeType {
  fields: ICompositeField[];
}

export interface ICompositeField {
  docs: string[];
  name: string;
  type: AnyJson;
  typeName: string;
}

// Sequence
export interface ISequenceType {
  type: AnyJson;
}

// Tuple
export type ITupleType = number[];

// Variant
export interface IVariantType {
  variants: IVariantItem[];
}
export interface IVariantItem {
  name: string | null;
  fields: IVariantField[];
  index: number;
  docs: string[];
}

export interface IVariantField {
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
  abstract label: string;

  // All metadata type classes must return their input types.
  abstract input(): string | null;

  // All metadata type classes must implement a `scrape` method, that converts type ids to actual
  // type metadata.
  abstract scrape(scraper: MetadataScraper, params: TypeParams): AnyJson;
}
