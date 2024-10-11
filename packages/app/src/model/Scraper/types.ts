// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { AnyJson } from '@w3ux/types';

// All supported metadata types.
export type MetadataType =
  | 'primitive'
  | 'composite'
  | 'variant'
  | 'sequence'
  | 'bitSequence'
  | 'array'
  | 'tuple'
  | 'compact';

export interface Pallet {
  name: string;
  index: number;
  calls: {
    type: number;
  };
  storage: {
    items: MetadataPalletStorageItem[];
    prefix: string;
  };
  constants: MetadataPalletConstantItem[];
  events: {
    type: number;
  };
  errors: {
    type: number;
  };
}

export interface MetadataPalletStorageItem {
  docs: string[];
  modifier: string;
  name: string;
  fallback: string;
  type: PalletStoragePlain | PalleStorageMap;
}

export interface MetadataPalletConstantItem {
  docs: string[];
  name: string;
  type: number;
  value: string;
}

export interface PalletItemScraped {
  name: string;
  docs: string[];
  modifier: string;
  fallback?: string;
  value?: string;
  argTypes: AnyJson;
  returnType: AnyJson;
}

export interface PalletItemScrapedWithSig extends PalletItemScraped {
  callSig: string;
}

export interface PalletStoragePlain {
  plain: number;
}

export interface PalleStorageMap {
  map: {
    hashers: string[];
    key: number;
    value: number;
  };
}

export interface PalletListItem {
  name: string;
  index: number;
}

export interface ScraperConfig {
  maxDepth: number | '*';
  labelsOnly: boolean;
}

export interface ScraperOptions {
  maxDepth?: number | '*';
  parentTrailId?: TrailParentId;
  indexPrefix?: string;
  indexKey?: string;
}

export type TrailId = number;

export type TrailParentId = number | null;

export interface TypeParams {
  trailId: TrailId;
  parent: TrailParentId;
  indexKey: string;
  maxDepth: number | '*';
}

// A scraped result item that could be of any metadata type.
export type ScrapedItem = { [key in MetadataType]?: AnyJson } & {
  indexKey: string;
};

// A scraped field item result item that could be of any metadata type.
export type ScrapedFieldItem = ScrapedItem & {
  name: string;
  typeName: string;
};
