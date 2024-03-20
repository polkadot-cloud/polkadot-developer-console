// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';
import type { PalletListItem } from './types';
import { MetadataScraper } from './Base';
import type { MetadataVersion } from 'model/Metadata/types';

export class PalletScraper extends MetadataScraper {
  // The pallet metadata in JSON format.
  pallets: AnyJson;

  // Initialize the class with pallet.
  constructor(metadata: MetadataVersion) {
    super(metadata);
    const { pallets } = this.metadata.getMetadataJson();

    this.pallets = pallets || [];
  }

  // Gets a sorted list of pallets from metadata.
  getList(filters?: string[]): PalletListItem[] {
    let filtered = this.pallets;

    // Filter the pallets with no calls.
    if (filters?.includes('calls')) {
      filtered = filtered.filter((pallet: AnyJson) => !!pallet.calls?.type);
    }

    // Filter pallets with no storage items.
    if (filters?.includes('storage')) {
      filtered = filtered.filter((pallet: AnyJson) => !!pallet.storage?.items);
    }

    // Narrow down the pallets to just the index and name.
    filtered =
      filtered.map(({ index, name }: PalletListItem) => ({
        index,
        name,
      })) || [];

    // Sort the pallets by name.
    filtered = filtered.sort(
      ({ name: aName }: { name: string }, { name: bName }: { name: string }) =>
        aName < bName ? -1 : aName > bName ? 1 : 0
    );
    return filtered;
  }

  // Get a pallet's storage items from metadata.
  getStorage(palletName: string): AnyJson[] {
    const pallet = this.getPallet(palletName);
    if (!pallet) {
      return [];
    }

    let result: AnyJson[] = [];
    // Defensive: Check if storage items are defined for this pallet.
    const items = pallet.storage?.items;

    if (items) {
      result = items.map((item: AnyJson) => {
        const { name, docs, type, modifier, fallback } = item;
        const typeKey = Object.keys(type)[0];

        let scrapedType;
        if (typeKey === 'plain') {
          scrapedType = {
            argTypes: undefined,
            returnType: this.startScrape(type.plain),
          };
        } else {
          const { key, value } = type.map;
          scrapedType = {
            argTypes: this.startScrape(key),
            returnType: this.startScrape(value),
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

  // Get a pallet's calls list from metadata.
  getCalls(palletName: string) {
    const pallet = this.getPallet(palletName);
    if (!pallet) {
      return;
    }

    // Defensive: Check if calls are defined for this pallet.
    const callType = pallet.calls?.type;
    if (callType) {
      const result = this.startScrape(pallet.calls.type);
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
