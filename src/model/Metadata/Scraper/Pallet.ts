// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type {
  PalleStorageMap,
  Pallet,
  PalletListItem,
  PalletItemScraped,
  PalletStoragePlain,
  ScraperConfig,
} from './types';
import { MetadataScraper } from './Base';
import type { MetadataVersion } from 'model/Metadata/types';

export class PalletScraper extends MetadataScraper {
  // The pallet metadata in JSON format.
  pallets: Pallet[];

  // Initialize the class with pallet.
  constructor(
    metadata: MetadataVersion,
    config: ScraperConfig = {
      maxDepth: 7,
    }
  ) {
    super(metadata, config);
    const { pallets } = this.metadata.getMetadataJson();
    this.pallets = pallets || [];
  }

  // Gets a sorted list of pallets from metadata.
  getList(filters?: string[]): PalletListItem[] {
    let filtered = this.pallets;

    // Filter the pallets with no calls.
    if (filters?.includes('calls')) {
      filtered = filtered.filter((pallet) => !!pallet.calls?.type);
    }

    // Filter pallets with no storage items.
    if (filters?.includes('storage')) {
      filtered = filtered.filter((pallet) => !!pallet.storage?.items);
    }

    // Filter pallets with no constants.
    if (filters?.includes('constants')) {
      filtered = filtered.filter((pallet) => !!pallet.constants.length);
    }

    // Narrow down the pallets to just the index and name, and sort alphabitically by name.
    const filteredList = (
      filtered.map(({ index, name }: PalletListItem) => ({
        index,
        name,
      })) || []
    ).sort(
      ({ name: aName }: { name: string }, { name: bName }: { name: string }) =>
        aName < bName ? -1 : aName > bName ? 1 : 0
    );
    return filteredList;
  }

  // Get a pallet's storage items from metadata.
  getStorage(palletName: string) {
    const pallet = this.getPallet(palletName);
    if (!pallet) {
      return [];
    }

    let result: PalletItemScraped[] = [];
    // Defensive: Check if storage items are defined for this pallet.
    const items = pallet.storage?.items;

    if (items) {
      result = items.map((item) => {
        const { name, docs, type, modifier, fallback } = item;
        const typeKey = Object.keys(type)[0];

        let scrapedType;
        if (typeKey === 'plain') {
          scrapedType = {
            argTypes: undefined,
            returnType: this.start((type as PalletStoragePlain).plain),
          };
        } else {
          const { key, value } = (type as PalleStorageMap).map;
          scrapedType = {
            argTypes: this.start(key),
            returnType: this.start(value),
          };
        }

        return {
          name,
          docs,
          modifier,
          fallback,
          type: scrapedType,
        };
      });
    }

    return result;
  }

  // Get a pallet's constants from metadata.
  getConstants(palletName: string) {
    const pallet = this.getPallet(palletName);
    if (!pallet) {
      return [];
    }

    let result: PalletItemScraped[] = [];
    // Defensive: Check if storage items are defined for this pallet.
    const items = pallet.constants;

    if (items) {
      result = items.map((item) => {
        const { name, docs, type, value } = item;

        const scrapedType = {
          argTypes: undefined,
          returnType: this.start(type),
        };

        return {
          name,
          docs,
          modifier: '', // NOTE: This could be `null`.
          type: scrapedType,
          value,
        };
      });
    }

    return result;
  }

  // Get a pallet's calls list from metadata.
  getCalls(palletName: string) {
    const pallet = this.getPallet(palletName);
    if (!pallet) {
      return;
    }

    // Defensive: Check if calls are defined for this pallet.
    const callType = pallet.calls?.type;
    if (callType) {
      const result = this.start(pallet.calls.type);
      return result;
    } else {
      return null;
    }
  }

  // ------------------------------------------------------
  // Class helpers
  // ------------------------------------------------------

  // Get a pallet from metadata.
  getPallet(palletName: string) {
    const pallet = this.pallets.find(
      ({ name }: { name: string }) => name === palletName
    );
    return pallet;
  }
}
