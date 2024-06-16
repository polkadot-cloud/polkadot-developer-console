// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
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
import { MetadataScraper } from '.';
import type { MetadataVersion } from 'model/Metadata/types';
import type { AnyJson } from '@w3ux/types';

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
    const { pallets } = this.metadata.get();
    this.pallets = pallets || [];
  }

  // ------------------------------------------------------
  // Pallet list.
  // ------------------------------------------------------

  // Gets a sorted list of pallets from metadata.
  getPalletList(filters?: string[]): PalletListItem[] {
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

  // ------------------------------------------------------
  // Get storage items.
  // ------------------------------------------------------

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
        returnType: this.start((type as PalletStoragePlain).plain, options),
      };
    } else {
      const { key, value } = (type as PalleStorageMap).map;

      scrapedType = {
        argTypes: this.start(key, options),
        returnType: this.start(value, options),
      };
    }

    return {
      name,
      docs,
      modifier,
      fallback,
      ...scrapedType,
    };
  }

  // ------------------------------------------------------
  // Get errors.
  // ------------------------------------------------------
  getErrors(palletName: string) {
    const pallet = this.getPallet(palletName);
    if (!pallet) {
      return [];
    }

    const errorType = pallet.errors.type;
    const scraped = this.start(errorType, { maxDepth: 2 })?.variant || [];
    return scraped;
  }

  // ------------------------------------------------------
  // Get events.
  // ------------------------------------------------------
  getEvents(palletName: string) {
    const pallet = this.getPallet(palletName);
    if (!pallet) {
      return [];
    }

    const eventsType = pallet.events.type;
    const scraped = this.start(eventsType, { maxDepth: 2 })?.variant || [];
    return scraped;
  }

  // ------------------------------------------------------
  // Get calls.
  // ------------------------------------------------------

  // Get a pallet's calls list from metadata.
  getCalls(palletName: string): PalletItemScraped[] {
    const pallet = this.getPallet(palletName);
    if (!pallet) {
      return [];
    }

    // NOTE: Checking if calls are defined for this pallet as there may be none defined.
    const callType = pallet.calls?.type;
    if (!callType) {
      return [];
    }

    // Get call variant type without scraping, All call signatures need is to read the `fields`
    // property.
    const callList = this.getPalletCalls(palletName);

    // Format the call list for rendering as select dropdown.
    const formattedCallList = callList.map((item: AnyJson) => {
      const { name, docs, fields } = item;
      return {
        name,
        docs,
        fieldNames: fields
          .map((field: { name: string }) => field.name)
          .join(', '),
      };
    });

    return formattedCallList;
  }

  getPalletCalls(palletName: string) {
    const pallet = this.pallets?.find(
      ({ name }: { name: string }) => name === palletName
    );
    const callType = pallet?.calls?.type;
    if (!callType) {
      return [];
    }
    const lookup = this.lookup.getType(callType);
    return lookup?.type?.def?.variant?.variants || [];
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

    // Get call variant type without scraping, as inner variant type id is needed to start
    // scraping.
    const result = this.getPalletCalls(palletName);
    const item = result.find(({ name }: { name: string }) => name === itemKey);

    if (!item) {
      return null;
    }

    return this.startCallScrape(item);
  }

  // Starts scraping a call.
  startCallScrape(item: AnyJson) {
    const scrapedType = {
      argTypes: item.fields.map(({ type }: { type: number; docs: string[] }) =>
        this.start(type)
      ),
      returnType: '',
    };

    const result = {
      name: item.name,
      docs: item.docs,
      modifier: '',
      ...scrapedType,
    };

    return result;
  }

  // ------------------------------------------------------
  // Get constants.
  // ------------------------------------------------------

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
          value,
          ...scrapedType,
        };
      });
    }

    return result;
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
