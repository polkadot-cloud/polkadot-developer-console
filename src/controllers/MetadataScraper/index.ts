// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';
import type { MetadataVersion } from 'model/Metadata/types';
import type { PalletListItem } from './types';
import { Formatter } from './Formatter';

// A class to scrape metadata and format it in various ways.

export class MetadataScraper {
  // The metadata class instance.
  metadata: MetadataVersion;

  // The metadata lookup.
  lookup: AnyJson = {};

  // Initialize the class with metadata.
  constructor(metadata: MetadataVersion) {
    this.metadata = metadata;
    this.lookup = this.metadata.getMetadataJson().lookup;
  }

  // ------------------------------------------------------
  // Top level scrape methods.
  // ------------------------------------------------------

  // Gets a sorted list of pallets from metadata.
  getPallets(filters?: string[]): PalletListItem[] {
    const json = this.metadata.getMetadataJson();
    let pallets = json.pallets || [];

    // Filter the pallets with no calls.
    if (filters?.includes('calls')) {
      pallets = pallets.filter((pallet: AnyJson) => !!pallet.calls?.type);
    }

    // Filter pallets with no storage items.
    if (filters?.includes('storage')) {
      pallets = pallets.filter((pallet: AnyJson) => !!pallet.storage?.items);
    }

    // Narrow down the pallets to just the index and name.
    pallets =
      pallets.map(({ index, name }: PalletListItem) => ({
        index,
        name,
      })) || [];

    // Sort the pallets by name.
    pallets = pallets.sort(
      ({ name: aName }: { name: string }, { name: bName }: { name: string }) =>
        aName < bName ? -1 : aName > bName ? 1 : 0
    );

    return pallets;
  }

  // Get a pallet's calls list from metadata.
  getPalletCalls(palletName: string) {
    const pallet = this.getPallet(palletName);
    if (!pallet) {
      return;
    }

    // Defensive: Check if calls are defined for this pallet.
    const callType = pallet.calls?.type;
    if (callType) {
      const result = this.getType(pallet.calls.type);
      return result;
    } else {
      return null;
    }
  }

  // Get a pallet's storage items from metadata.
  getPalletStorage(palletName: string) {
    const pallet = this.getPallet(palletName);
    if (!pallet) {
      return;
    }

    let result = [];
    // Defensive: Check if storage items are defined for this pallet.
    const items = pallet.storage?.items;

    if (items) {
      result = items.map((item: AnyJson) => {
        const { name, docs, type } = item;

        const typeKey = Object.keys(type)[0];

        let scrapedType;
        if (typeKey === 'plain') {
          scrapedType = {
            argTypes: undefined,
            returnType: this.getType(type.plain),
          };
        } else {
          scrapedType = undefined;
          const { key, value } = type.map;
          scrapedType = {
            argTypes: this.getType(key),
            returnType: this.getType(value),
          };
        }

        return {
          name,
          docs,
          type: scrapedType,
        };
      });
    }

    return result;
  }

  // ------------------------------------------------------
  // Scrape types.
  // ------------------------------------------------------

  // Get a lookup type from metadata. Possible recursion when scraping type ids.
  getType(typeId: number) {
    const lookup = this.lookup.types.find(
      ({ id }: { id: number }) => id === typeId
    );

    if (!lookup) {
      return undefined;
    }

    const { def, path, params }: AnyJson = lookup.type;
    const [type, value] = Object.entries(def).flat();

    const result: AnyJson = {
      type,
    };

    switch (type) {
      case 'variant':
        result.variant = this.scrapeVariant(value);
        result.label = Formatter.typeToString(path, params);
        break;

      case 'tuple':
        result.tuple = (value as number[]).map((id: number) =>
          this.getType(id)
        );
        break;

      case 'array':
        result.array = {
          len: (value as AnyJson).len,
          type: this.getType((value as AnyJson).type),
        };
        break;

      case 'primitive':
        result.primitive = value;
        result.label = (value as string).toLowerCase();
        break;

      default:
        result.unknown = true;
        break;
    }

    return result;
  }

  // Scrapes a variant type.
  scrapeVariant(variant: AnyJson) {
    const variants = variant.variants.reduce(
      (acc: AnyJson, { docs, fields, name }: AnyJson) => ({
        ...acc,
        [name]: {
          docs,
          fields: Object.fromEntries(
            fields.map((field: AnyJson) => [field.name, field.typeName])
          ),
        },
      }),
      {}
    );
    return variants;
  }

  // ------------------------------------------------------
  // Class helpers
  // ------------------------------------------------------

  getPallet(palletName: string) {
    const json = this.metadata.getMetadataJson();
    const pallet = json.pallets.find(
      ({ name }: { name: string }) => name === palletName
    );
    return pallet;
  }
}
