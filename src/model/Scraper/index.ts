// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';
import type { MetadataVersion } from 'model/Metadata/types';
import type { ScraperConfig, ScraperOptions, TypeParams } from './types';
import type { MetadataLookup } from './Lookup/types';
import { Lookup } from './Lookup';
import { Variant } from './Types/Variant';
import type {
  VariantType,
  SequenceType,
  IArrayType,
  BitSequenceType,
  CompactType,
  TupleType,
  CompositeType,
  MetadataType,
} from './Types/types';
import { Sequence } from './Types/Sequence';
import { ArrayType } from './Types/Array';
import { BitSequence } from './Types/BitSequence';
import { Compact } from './Types/Compact';
import { Primitive } from './Types/Primitive';
import { Tuple } from './Types/Tuple';
import { Composite } from './Types/Composite';
import { Trails } from './Trails';

// Base metadata scraper class that accesses and recursively scrapes the metadata lookup.

export class MetadataScraper extends Trails {
  // The metadata class instance.
  metadata: MetadataVersion;

  // The metadata lookup.
  lookup: Lookup;

  // Maximum recursion depth for scraping types.
  #maxDepth: number | '*';

  // Map index keys to scraped type class.
  classIndex: Record<string, AnyJson> = {};

  // Initialize the class with metadata.
  constructor(metadata: MetadataVersion, config: ScraperConfig) {
    super();
    this.metadata = metadata;
    this.#maxDepth = config.maxDepth;

    // Assign a new lookup instnace.
    this.lookup = new Lookup(this.metadata.get().lookup as MetadataLookup);
  }

  // ------------------------------------------------------
  // Scrape.
  // ------------------------------------------------------

  // Start scraping a type from metadata. Entry should be made from here for any new trail.
  start(typeId: number, options?: ScraperOptions) {
    // Get the parent trail id, or set to null if no parent trail is provided. No parent trail
    // assumes the start of a new scrape.
    const parentTrailId = options?.parentTrailId || null;

    // Get an index prefix if provided. Prefixes should be used when the scraper is indexing
    // multiple items, such as a list of constants, storage items or extrinsics. This ensures that
    // keys stay unique and do not overwrite each other between scraped items.
    const indexPrefix = options?.indexPrefix || '';

    // Get the index key, or set to '0' if no index key is provided. No index key assumes the start
    // of a new scrape. Index keys are used to keep track of a recursive index of a type.
    const indexKey = `${indexPrefix ? `${indexPrefix}_` : ``}${options?.indexKey || 0}`;

    // Defining this new trail.
    const trail = {
      trailId: this.newTrailId(parentTrailId),
      parent: parentTrailId,
    };

    // Define definite params from options.
    const params: TypeParams = {
      ...trail,
      indexKey,
      labelsOnly: !!options?.labelsOnly,
      maxDepth: options?.maxDepth || this.#maxDepth,
    };

    return this.getType(typeId, params);
  }

  // Get a lookup type from metadata. Possible recursion when scraping type ids.
  getType(typeId: number, params: TypeParams) {
    const { trailId, indexKey, labelsOnly, maxDepth, parent } = params;

    const lookup = this.lookup.getType(typeId);
    const depth = this.trailDepth(trailId);

    // Exit if type is cyclic.
    if (this.isTrailCyclic(trailId, typeId)) {
      return null;
    }

    // Exit if lookup not found.
    if (!lookup) {
      return null;
    }

    // Exit if the depth of the trail surpasses the maximum depth.
    if (maxDepth !== '*' && depth >= maxDepth) {
      return null;
    }

    // Add current type id to trails record.
    this.appendTrail(trailId, typeId);

    // Parameters for Base metadata type classes.
    const baseParams = {
      lookup,
      depth,
      trail: { trailId, parent },
      indexKey,
    };

    const { def }: AnyJson = lookup.type;
    const [type, value] = Object.entries(def).flat();

    // Scrape the type.
    const result: AnyJson = {};

    // Scrape the type class.
    let typeClass: MetadataType;

    switch (type) {
      case 'array':
        typeClass = new ArrayType(value as IArrayType, baseParams);
        result.array = typeClass.scrape(this, params);
        break;

      case 'bitSequence':
        typeClass = new BitSequence(value as BitSequenceType, baseParams);
        if (!labelsOnly) {
          result.bitSequence = typeClass.scrape(this, params);
        }
        break;

      case 'compact':
        typeClass = new Compact(value as CompactType, baseParams);
        result.compact = typeClass.scrape(this, params);
        break;

      case 'composite':
        typeClass = new Composite(value as CompositeType, baseParams);
        result.composite = typeClass.scrape(this, params);
        break;

      case 'primitive':
        typeClass = new Primitive(value as string, baseParams);
        result.primitive = typeClass.scrape(this, params);
        break;

      case 'sequence':
        typeClass = new Sequence(value as SequenceType, baseParams);
        result.sequence = typeClass.scrape(this, params);
        break;

      case 'tuple':
        typeClass = new Tuple(value as TupleType, baseParams);
        result.tuple = typeClass.scrape(this, params);
        break;

      case 'variant':
        typeClass = new Variant((value as VariantType).variants, baseParams);
        if (!labelsOnly) {
          result.variant = typeClass.scrape(this, params);
        }
        break;

      default:
        return null;
    }

    // Attached scraped type class to result. TODO: remove.
    result.class = typeClass;

    // Attach index key to result.
    result.indexKey = indexKey;

    // Index resulting type class by its index key. Makes class accessible at the input arg level.
    this.classIndex[indexKey] = typeClass;

    return result;
  }

  // Get a scraped type class from its index key.
  getClass(indexKey: string): MetadataType {
    return this.classIndex[indexKey];
  }
}
