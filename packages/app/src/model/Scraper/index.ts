// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { AnyJson } from '@w3ux/types';
import type { MetadataVersion } from 'model/Metadata/types';
import type { ScraperConfig, ScraperOptions, TypeParams } from './types';
import type { MetadataLookup } from './Lookup/types';
import { Lookup } from './Lookup';
import { VariantType } from './Types/Variant';
import type {
  IVariantType,
  IArrayType,
  IBitSequenceType,
  ICompactType,
  ITupleType,
  ICompositeType,
  MetadataType,
  BaseParams,
} from './Types/types';
import { SequenceType } from './Types/Sequence';
import { ArrayType } from './Types/Array';
import { CompactType } from './Types/Compact';
import { PrimitiveType } from './Types/Primitive';
import { TupleType } from './Types/Tuple';
import { CompositeType } from './Types/Composite';
import { Trails } from './Trails';
import { BitSequenceType } from './Types/BitSequence';

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

  // Whether this scraper is for formatting labels only.
  #labelsOnly = false;

  // Initialize the class with metadata.
  constructor(metadata: MetadataVersion, config: ScraperConfig) {
    super();
    this.metadata = metadata;
    this.#labelsOnly = config.labelsOnly;
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
    // multiple items, such as arg types and return types, lists of constants, storage items or
    // extrinsics. This ensures that keys stay unique and do not overwrite each other between
    // scraped items.
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
      maxDepth: options?.maxDepth || this.#maxDepth,
    };

    return this.getType(typeId, params);
  }

  // Get a lookup type from metadata. Possible recursion when scraping type ids.
  getType(typeId: number, params: TypeParams) {
    const { trailId, indexKey, maxDepth, parent } = params;

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
    const baseParams: BaseParams = {
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
        typeClass = new BitSequenceType(value as IBitSequenceType, baseParams);
        if (!this.#labelsOnly) {
          result.bitSequence = typeClass.scrape(this, params);
        }
        break;

      case 'compact':
        typeClass = new CompactType(value as ICompactType, baseParams);
        result.compact = typeClass.scrape(this, params);
        break;

      case 'composite':
        typeClass = new CompositeType(value as ICompositeType, baseParams);
        result.composite = typeClass.scrape(this, params);
        break;

      case 'primitive':
        typeClass = new PrimitiveType(value as string, baseParams);
        result.primitive = typeClass.scrape(this, params);
        break;

      case 'sequence':
        typeClass = new SequenceType(value as SequenceType, baseParams);
        result.sequence = typeClass.scrape(this, params);
        break;

      case 'tuple':
        typeClass = new TupleType(value as ITupleType, baseParams);
        result.tuple = typeClass.scrape(this, params);
        break;

      case 'variant':
        typeClass = new VariantType(
          (value as IVariantType).variants,
          baseParams
        );
        if (!this.#labelsOnly) {
          result.variant = typeClass.scrape(this, params);
        }
        break;

      default:
        return null;
    }

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
