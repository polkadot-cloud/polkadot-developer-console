// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';
import type { MetadataVersion } from 'model/Metadata/types';
import { Format } from './Format';
import type {
  ScraperConfig,
  ScraperOptions,
  TrailId,
  TrailParam,
  TrailParentId,
} from './types';
import type { MetadataLookup } from './Lookup/types';
import { Lookup } from './Lookup';
import { Variant } from './Variant';
import type { VariantType } from './Variant/types';
import { Composite } from './Composite';
import type { CompositeType } from './Composite/types';

// Base metadata scraper class that accesses and recursively scrapes the metadata lookup.

export class MetadataScraper {
  // The metadata class instance.
  metadata: MetadataVersion;

  // The metadata lookup.
  lookup: Lookup;

  // Maximum recursion depth for scraping types.
  #maxDepth: number | '*';

  // Keep track of type trails that have happened for a given scrape. Allows for checking cyclic
  // types.
  #trails: Record<string, { parent: TrailParentId; trail: TrailId[] }> = {};

  get trails() {
    return this.#trails;
  }

  // Initialize the class with metadata.
  constructor(metadata: MetadataVersion, config: ScraperConfig) {
    this.metadata = metadata;
    this.#maxDepth = config.maxDepth;

    // Assign a new lookup instnace.
    this.lookup = new Lookup(this.metadata.get().lookup as MetadataLookup);
  }

  // ------------------------------------------------------
  // Scrape.
  // ------------------------------------------------------

  // Start scraping a type from metadata. Entry should be made from here for any new trail.
  start(typeId: number, parent: TrailParentId, options?: ScraperOptions) {
    // Defining a new tail.
    const trail = {
      trailId: this.newTrailId(parent),
      parent,
    };

    const params = {
      ...trail,
      labelsOnly: !!options?.labelsOnly,
      maxDepth: options?.maxDepth || this.#maxDepth,
    };
    return this.getType(typeId, params);
  }

  // Get a lookup type from metadata. Possible recursion when scraping type ids.
  getType(typeId: number, trailParam: TrailParam) {
    const { trailId, labelsOnly, maxDepth } = trailParam;

    const lookup = this.lookup.getType(typeId);

    const cyclic = this.trailCyclic(trailId, typeId);
    if (cyclic) {
      return {
        cyclic: true,
        typeId,
      };
    }

    // Add current type id to trails record.
    this.appendTrail(trailId, typeId);

    // Exit if lookup not found.
    if (!lookup) {
      console.debug('Metadata Scraper: Type lookup not found for id: ', typeId);
      return {
        unknown: true,
      };
    }

    // Exit if the depth of the trail surpasses the maximum depth.
    const depth = this.trailDepth(trailId);
    if (maxDepth !== '*' && depth >= maxDepth) {
      console.debug(
        'Metadata Scraper: Maximum depth reached at type id: ',
        typeId
      );
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

        if (labelsOnly) {
          break;
        }

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
        result.composite = new Composite(value as CompositeType, lookup).scrape(
          this,
          trailId
        );
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

        if (labelsOnly) {
          break;
        }

        result.variant = new Variant(
          (value as VariantType).variants,
          lookup
        ).scrape(this, trailId);

        break;

      default:
        result.unknown = true;
        console.warn('Unknown type scraped: ', type, value);
        break;
    }
    return result;
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
  // Class helpers.
  // ------------------------------------------------------

  // Generates a new trail Id for a new scrape.
  newTrailId(parent: TrailParentId): number {
    // Get the largest trail record key, and increment it by one.
    const trailKeys = Object.keys(this.#trails);
    const trailKeysOrDefault = Object.keys(this.#trails).length
      ? trailKeys
      : [0];
    const trailId = Math.max(...trailKeysOrDefault.map((k) => Number(k))) + 1;

    // Add new trail id to trails record.
    this.#trails[trailId] = {
      parent,
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
    if (parent) {
      return length + this.trailDepth(parent);
    }
    return length;
  }

  // Calculate an entire trail, taking parents.
  trail(trailId: TrailId): TrailId[] {
    const trail = this.#trails[trailId].trail;
    const parent = this.#trails[trailId].parent;

    if (parent) {
      return this.trail(parent).concat(trail);
    }
    return trail;
  }

  // Calculate whether a trail has become cyclic.
  trailCyclic(trailId: TrailId, typeId: number): boolean {
    return this.trail(trailId).includes(typeId);
  }

  // Append a typeId to a #trails.trail record.
  appendTrail(trailId: TrailId, typeId: number) {
    this.#trails[trailId].trail.push(typeId);
  }
}
