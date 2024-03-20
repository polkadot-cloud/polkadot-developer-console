// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';
import type { MetadataVersion } from 'model/Metadata/types';
import { Format } from './Format';

// Base metadata scraper class that accesses and recursively scrapes the metadata lookup.

export class MetadataScraper {
  // The metadata class instance.
  metadata: MetadataVersion;

  // The metadata lookup.
  lookup: AnyJson = {};

  // Maximum recursion depth for scraping types.
  #maxDepth = 10;

  // Initialize the class with metadata.
  // TODO: pass a debug flag in an `options` arg to enable console logs.
  constructor(metadata: MetadataVersion) {
    this.metadata = metadata;

    const { lookup } = this.metadata.getMetadataJson();
    this.lookup = lookup;
  }

  // ------------------------------------------------------
  // Scrape types.
  // ------------------------------------------------------

  // Start scraping a type from metadata. Entry should be made from here.
  startScrape(typeId: number) {
    this.getType(typeId, 0);
  }

  // Get a lookup type from metadata. Possible recursion when scraping type ids.
  getType(typeId: number, depth: number) {
    const lookup = this.lookup.types.find(
      ({ id }: { id: number }) => id === typeId
    );

    depth++;

    if (!lookup) {
      // console.warn('no lookup provided');
      return {
        unknown: true,
      };
    }

    if (depth >= this.#maxDepth) {
      // console.warn('max depth reached');
      return {
        unknown: true,
      };
    }

    const { def, path, params }: AnyJson = lookup.type;
    const [type, value] = Object.entries(def).flat();

    const result: AnyJson = {
      type,
      path,
      params,
    };

    switch (type) {
      case 'array':
        result.array = {
          len: (value as AnyJson).len,
          type: this.getType((value as AnyJson).type, depth),
        };
        break;

      case 'bitSequence':
        result.label = {
          long: Format.typeToString(path, params),
          short: path[path.length - 1],
        };
        result.bitsequence = {
          bitOrderType: this.getType((value as AnyJson).bitOrderType, depth),
          bitStoreType: this.getType((value as AnyJson).bitStoreType, depth),
        };
        break;

      case 'compact':
        result.compact = this.getType((value as AnyJson).type, depth);
        break;

      case 'composite':
        result.label = {
          long: Format.typeToString(path, params),
          short: path[path.length - 1],
        };
        result.composite = this.scrapeComposite(value, depth);
        break;

      case 'primitive':
        result.label = (value as string).toLowerCase();
        result.primitive = value;
        break;

      case 'sequence':
        result.sequence = this.getType((value as AnyJson).type, depth);
        break;

      case 'tuple':
        result.tuple = (value as number[]).map((id: number) =>
          this.getType(id, depth)
        );
        break;

      case 'variant':
        result.label = {
          long: Format.typeToString(path, params),
          short: path[path.length - 1],
        };
        result.variant = this.scrapeVariant(value, depth) || 'U128';
        break;

      default:
        result.unknown = true;
        console.warn('Unknown type scraped: ', type, value);
        break;
    }
    return result;
  }

  // Scrapes a variant type.
  scrapeVariant(input: AnyJson, depth: number) {
    const variants = input.variants.map(
      ({ docs: variantDocs, fields, name: variantName }: AnyJson) => ({
        name: variantName,
        docs: variantDocs,
        fields: fields.map(({ docs, name, type, typeName }: AnyJson) => ({
          docs,
          name,
          typeName,
          type: this.getType(type, depth),
        })),
      })
    );
    return variants;
  }

  // Scrapes a composite type.
  scrapeComposite(input: AnyJson, depth: number) {
    const composite = input.fields.map(
      ({ docs, name, type, typeName }: AnyJson) => ({
        docs,
        name,
        typeName,
        type: this.getType(type, depth),
      })
    );
    return composite;
  }
}
