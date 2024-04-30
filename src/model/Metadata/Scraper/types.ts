// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';

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
  type: AnyJson;
  value?: string;
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
}

export interface ScraperOptions {
  labelsOnly?: boolean;
  maxDepth?: number | '*';
}

export type TrailId = number;

export type TrailParentId = number | null;

export interface TrailParam {
  trailId: TrailId;
  parent: TrailParentId;
  labelsOnly: boolean;
  maxDepth: number | '*';
}
