// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';
import type { MetadataVersion } from 'model/Metadata/types';
import { Format } from './Format';

// Base metadata scraper class that accesses and recursively scrapes the metadata lookup.

type TrailId = number;

type TrailParentId = number | null;

interface TrailParam {
  trailId: TrailId;
  parent: TrailParentId;
}

export class MetadataScraper {
  // The metadata class instance.
  metadata: MetadataVersion;

  // The metadata lookup.
  lookup: AnyJson = {};

  // Maximum recursion depth for scraping types.
  #maxDepth = 5;

  // Keep track of trails that have happened for a given scrape
  #trails: Record<string, { parent: TrailParentId; trail: TrailId[] }> = {};

  get trails() {
    return this.#trails;
  }

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

  // Start scraping a type from metadata. Entry should be made from here for any new trail.
  start(typeId: number, parent?: number) {
    const params = {
      trailId: this.newTrailId(parent),
      parent: parent === undefined ? null : parent,
    };
    return this.getType(typeId, params);
  }

  // Get a lookup type from metadata. Possible recursion when scraping type ids.
  getType(typeId: number, trailParam: TrailParam) {
    const { trailId } = trailParam;

    const lookup = this.lookup.types.find(
      ({ id }: { id: number }) => id === typeId
    );

    // Add current type id to trails record.
    this.appendTrail(trailId, typeId);

    const depth = this.trailDepth(trailId);

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
          type: this.getType((value as AnyJson).type, trailParam),
        };
        break;

      case 'bitSequence':
        result.label = {
          long: Format.typeToString(path, params),
          short: path[path.length - 1],
        };
        result.bitsequence = {
          bitOrderType: this.start((value as AnyJson).bitOrderType, trailId),
          bitStoreType: this.start((value as AnyJson).bitStoreType, trailId),
        };
        break;

      case 'compact':
        result.compact = this.getType((value as AnyJson).type, trailParam);
        break;

      case 'composite':
        result.label = {
          long: Format.typeToString(path, params),
          short: path[path.length - 1],
        };
        result.composite = this.scrapeComposite(value, trailParam);
        break;

      case 'primitive':
        result.label = (value as string).toLowerCase();
        result.primitive = value;
        break;

      case 'sequence':
        result.sequence = this.getType((value as AnyJson).type, trailParam);
        break;

      case 'tuple':
        result.tuple = (value as number[]).map((id: number) =>
          this.start(id, trailId)
        );
        break;

      case 'variant':
        result.label = {
          long: Format.typeToString(path, params),
          short: path[path.length - 1],
        };
        result.variant = this.scrapeVariant(value, trailParam) || 'U128';
        break;

      default:
        result.unknown = true;
        console.warn('Unknown type scraped: ', type, value);
        break;
    }
    return result;
  }

  // Scrapes a variant type.
  scrapeVariant(input: AnyJson, { trailId }: TrailParam) {
    const variants = input.variants.map(
      ({ docs: variantDocs, fields, name: variantName }: AnyJson) => ({
        name: variantName,
        docs: variantDocs,
        fields: fields.map(({ docs, name, type, typeName }: AnyJson) => ({
          docs,
          name,
          typeName,
          type: this.start(type, trailId),
        })),
      })
    );
    return variants;
  }

  // Scrapes a composite type.
  scrapeComposite(input: AnyJson, { trailId }: TrailParam) {
    const composite = input.fields.map(
      ({ docs, name, type, typeName }: AnyJson) => ({
        docs,
        name,
        typeName,
        type: this.start(type, trailId),
      })
    );
    return composite;
  }

  // ------------------------------------------------------
  // Class helpers
  // ------------------------------------------------------

  // Generates a new trail Id for a new scrape.
  newTrailId(parent?: number): number {
    // Get the largest trail record key, and increment it by one.
    const trailKeys = Object.keys(this.#trails);
    const trailKeysOrDefault = Object.keys(this.#trails).length
      ? trailKeys
      : [0];
    const trailId = Math.max(...trailKeysOrDefault.map((k) => Number(k))) + 1;

    // Add new trail id to trails record.
    this.#trails[trailId] = {
      parent: parent === undefined ? null : parent,
      trail: [],
    };
    return trailId;
  }

  // Calculate the depth of a trail.
  trailDepth(trailId: TrailId): number {
    const length = this.#trails[trailId].trail.length;
    // As long as a parent exists, recursively calculate its length and add it to the current
    // length.
    const parent = this.#trails[trailId].parent;
    if (parent && length < this.#maxDepth) {
      return length + this.trailDepth(parent);
    } else {
      return length;
    }
  }

  // Append a typeId to a #trails.trail record.
  appendTrail(trailId: TrailId, typeId: number) {
    this.#trails[trailId].trail.push(typeId);
  }
}
