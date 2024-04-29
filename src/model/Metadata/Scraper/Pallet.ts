// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type {
  PalleStorageMap,
  Pallet,
  PalletListItem,
  PalletItemScraped,
  PalletStoragePlain,
  ScraperConfig,
  MetadataPalletStorageItem,
  ScraperOptions,
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
  getStorage(
    palletName: string,
    options?: ScraperOptions
  ): PalletItemScraped[] {
    const pallet = this.getPallet(palletName);
    if (!pallet) {
      return [];
    }

    // NOTE: Check if storage items are defined for this pallet as there may be none defined.
    const items = pallet.storage?.items;
    return items
      ? items.map((item) => this.startStorageScrape(item, options))
      : [];
  }

  // Get a pallet storage item from metadata.
  getStorageItem(
    palletName: string,
    itemKey: string,
    options?: ScraperOptions
  ) {
    const pallet = this.getPallet(palletName);
    if (!pallet) {
      return null;
    }

    // Defensive: Check if storage items are defined for this pallet.
    const items = pallet.storage?.items;
    if (!items) {
      return null;
    }

    const item = items.find(({ name }) => name === itemKey);
    if (!item) {
      return null;
    }

    return this.startStorageScrape(item, options);
  }

  // Starts scraping a storage item.
  startStorageScrape(
    item: MetadataPalletStorageItem,
    options?: ScraperOptions
  ) {
    const { name, docs, type, modifier, fallback } = item;
    const typeKey = Object.keys(type)[0];

    let scrapedType;
    if (typeKey === 'plain') {
      scrapedType = {
        argTypes: undefined,
        returnType: this.start(
          (type as PalletStoragePlain).plain,
          null,
          options
        ),
      };
    } else {
      const { key, value } = (type as PalleStorageMap).map;

      scrapedType = {
        argTypes: this.start(key, null, options),
        returnType: this.start(value, null, options),
      };
    }

    return {
      name,
      docs,
      modifier,
      fallback,
      type: scrapedType,
    };
  }

  // Get a pallet call item from metadata.
  getCallItem(palletName: string, itemKey: string) {
    const pallet = this.getPallet(palletName);
    if (!pallet) {
      return null;
    }

    // Defensive: Check if storage items are defined for this pallet.
    const items = pallet.calls;
    if (!items) {
      return null;
    }
    console.log(itemKey);

    // TODO: Get variant type without scraping, as the call type will come from the inner variant.
    // const result = this.start(pallet.calls.type, null, { maxDepth: 2 });

    // const item = result?.variant?.find(
    //   ({ name }: { name: string }) => name === itemKey
    // );

    // if (!item) {
    //   return null;
    // }
    return this.startCallScrape();
  }

  // Starts scraping a call.
  startCallScrape() {
    return null;
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
          returnType: this.start(type, null),
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
  getCalls(palletName: string, options?: ScraperOptions): PalletItemScraped[] {
    const pallet = this.getPallet(palletName);
    if (!pallet) {
      return [];
    }

    // NOTE: Checking if calls are defined for this pallet as there may be none defined.
    const callType = pallet.calls?.type;
    if (!callType) {
      return [];
    }

    // TODO: Get variant type without scraping, as the calls will come from the inner variant.
    const result = this.start(pallet.calls.type, null, options);
    return result?.variant || [];
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
