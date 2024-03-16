// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';
import type { MetadataVersion } from 'model/Metadata/types';
import type { PalletListItem } from './types';

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
      (
        { name: aName }: { name: string },
        { name: bName }: { name: string }
      ) => {
        if (aName < bName) {
          return -1;
        }
        if (aName > bName) {
          return 1;
        }
        return 0;
      }
    );
  }

  // Get a pallet's calls list from metadata.
  getPalletCalls(palletName: string) {
    const json = this.metadata.getMetadataJson();
    const pallet = json.pallets.find(
      ({ name }: { name: string }) => name === palletName
    );

    if (!pallet) {
      return;
    }

    // Scrape pallet call types.
    const result = this.getType(pallet.calls.type);
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
    const label = this.typeToString(path, params);

    const result: AnyJson = {
      type,
      label,
    };

    switch (type) {
      case 'variant':
        result.variant = this.scrapeVariant(value);
        break;

      default:
        result.unknown;
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
  // Class helpers.
  // ------------------------------------------------------

  // Format a string representation of the type using its path and params.
  typeToString(path: string[], params: string[]): string {
    const paramsStr = this.paramsToString(params);
    const pathStr = this.pathToString(path);

    let label = `${pathStr}`;
    if (paramsStr) {
      label += `${paramsStr}`;
    }

    return label;
  }

  // Format a type's params into a string.
  paramsToString(params: AnyJson): string {
    return params.reduce(
      (formatted: string, { name }: { name: string }, index: number) => {
        let str = index === 0 ? `<${name}` : `, ${name}`;
        if (index === params.length - 1) {
          str += `>`;
        }
        return (formatted += str);
      },
      ''
    );
  }

  // Format a type's path into a string.
  pathToString(path: string[]): string {
    return path.reduce((formatted: string, item: string, index: number) => {
      if (index === 0) {
        return item;
      }
      return index === 0 ? item : `${formatted}::${item}`;
    }, '');
  }
}
