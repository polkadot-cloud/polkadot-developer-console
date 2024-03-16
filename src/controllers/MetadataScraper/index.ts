// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';
import type { MetadataVersion } from 'model/Metadata/types';

// A class to scrape metadata and format it in various ways.

export class MetadataScraper {
  // The metadata class instance. Used to access and scrape metadata.
  metadata: MetadataVersion;

  // The metadata lookup.
  lookup: AnyJson = {};

  // The cursor of the current type being scraped.
  cursor: AnyJson = {};

  constructor(metadata: MetadataVersion) {
    this.metadata = metadata;
    this.lookup = this.metadata.getMetadataJson().lookup;
  }

  // ------------------------------------------------------
  // Accessors.
  // ------------------------------------------------------

  // Get a pallet's calls list from metadata.
  getPalletCalls(palletName: string) {
    const json = this.metadata.getMetadataJson();
    const pallet = json.pallets.find(
      ({ name }: { name: string }) => name === palletName
    );

    if (!pallet) {
      return;
    }

    const callTypeId = pallet.calls.type;

    // Get the type from lookup.
    const result = this.getType(callTypeId);
    console.log(result);
    return result;
  }

  // NOTE: reading of the types should be handled in another class as this will likely not change
  // through metadata versions. switch type and handle them correctly.

  // ------------------------------------------------------
  // Start scraping.
  // ------------------------------------------------------

  // Get a lookup type from metadata. Possible recursion when scraping type ids.
  getType(typeId: number) {
    const lookup = this.lookup.types.find(
      ({ id }: { id: number }) => id === typeId
    );

    if (!lookup) {
      return undefined;
    }

    // `path`, `docs`, `params` can be accessed here. May need to be referenced in the future when
    // accumulating the type data into one object.
    const { def, path, params }: AnyJson = lookup.type;

    const paramsFormatted = this.paramsToString(params);
    const pathFormatted = this.pathToString(path);
    const label = `${pathFormatted}${paramsFormatted}`;
    const [type, value] = Object.entries(def).flat();

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

  // Scrape variant type.
  scrapeVariant(variant: AnyJson) {
    const variants = variant.variants.reduce(
      (acc: AnyJson, { docs, fields, name }: AnyJson) => ({
        ...acc,
        [name]: {
          docs,
          fields: Object.fromEntries(
            fields.map((field: AnyJson) =>
              // console.log(field);
              [field.name, field.typeName]
            )
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

  paramsToString(params: AnyJson) {
    const paramsFormatted: string = params.reduce(
      (formatted: string, { name }: { name: string }, index: number) => {
        let str;
        if (index === 0) {
          str = `<${name}`;
        } else {
          str = `, ${name}`;
        }

        if (index === params.length - 1) {
          str += `>`;
        }

        return (formatted += str);
      },
      ''
    );
    return paramsFormatted;
  }

  pathToString(path: string[]) {
    const pathFormatted = path.reduce(
      (formatted: string, item: string, index: number) => {
        if (index === 0) {
          return item;
        }
        return `${formatted}::${item}`;
      },
      ''
    );

    return pathFormatted;
  }
}
