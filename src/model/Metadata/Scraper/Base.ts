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

  // Initialize the class with metadata.
  constructor(metadata: MetadataVersion) {
    this.metadata = metadata;

    const { lookup } = this.metadata.getMetadataJson();
    this.lookup = lookup;
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
      case 'array':
        result.array = {
          len: (value as AnyJson).len,
          type: this.getType((value as AnyJson).type),
        };
        break;

      case 'bitSequence':
        result.label = Format.typeToString(path, params);
        result.bitsequence = {
          bitOrderType: this.getType((value as AnyJson).bitOrderType),
          bitStoreType: this.getType((value as AnyJson).bitStoreType),
        };
        break;

      case 'compact':
        result.compact = this.getType((value as AnyJson).type);
        break;

      case 'composite':
        result.label = Format.typeToString(path, params);
        result.composite = this.scrapeComposite(value);
        break;

      case 'primitive':
        result.label = (value as string).toLowerCase();
        result.primitive = value;
        break;

      case 'sequence':
        result.sequence = this.getType((value as AnyJson).type);
        break;

      case 'tuple':
        result.tuple = (value as number[]).map((id: number) =>
          this.getType(id)
        );
        break;

      case 'variant':
        result.label = Format.typeToString(path, params);
        result.variant = this.scrapeVariant(value);
        break;

      default:
        result.unknown = true;
        console.warn('Unknown type scraped: ', type, value);
        break;
    }
    return result;
  }

  // Scrapes a variant type.
  scrapeVariant(input: AnyJson) {
    const variants = input.variants.reduce(
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

  // Scrapes a composite type.
  scrapeComposite(input: AnyJson) {
    const composite = input.fields.map(
      ({ docs, name, type, typeName }: AnyJson) => ({
        docs,
        name,
        typeName,
        type: this.getType(type),
      })
    );
    return composite;
  }
}
