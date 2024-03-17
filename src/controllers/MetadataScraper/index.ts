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
  getPallets(): PalletListItem[] {
    const json = this.metadata.getMetadataJson();

    return (
      json.pallets.map(({ index, name }: PalletListItem) => ({
        index,
        name,
      })) || []
    ).sort(
      ({ name: aName }: { name: string }, { name: bName }: { name: string }) =>
        aName < bName ? -1 : aName > bName ? 1 : 0
    );
  }

  // Get a pallet's calls list from metadata.
  getPalletCalls(palletName: string) {
    const pallet = this.getPallet(palletName);
    if (!pallet) {
      return;
    }
    const result = this.getType(pallet.calls.type);
    return result;
  }

  // Get a pallet's storage items from metadata.
  getPalletStorage(palletName: string) {
    const pallet = this.getPallet(palletName);
    if (!pallet) {
      return;
    }
    const { items } = pallet.storage;
    const types: AnyJson = [];
    const result = items.map((item: AnyJson) => {
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

      types.push({
        name,
        docs,
        type: scrapedType,
      });
    });

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
    const label = Formatter.typeToString(path, params);

    const result: AnyJson = {
      type,
      label,
    };

    switch (type) {
      case 'variant':
        result.variant = this.scrapeVariant(value);
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
