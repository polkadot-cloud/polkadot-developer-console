// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';
import type { MetadataVersion } from 'model/Metadata/types';
import type {
  ScraperConfig,
  ScraperOptions,
  TrailId,
  TypeParams,
  TrailParentId,
} from './types';
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
} from './Types/types';
import { Sequence } from './Types/Sequence';
import { ArrayType } from './Types/Array';
import { BitSequence } from './Types/BitSequence';
import { Compact } from './Types/Compact';
import { Primitive } from './Types/Primitive';
import { Tuple } from './Types/Tuple';
import { Composite } from './Types/Composite';

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
  start(typeId: number, options?: ScraperOptions) {
    // Get the parent trail id, or set to null if no parent trail is provided. No parent trail
    // assumes the start of a new scrape.
    const parentTrailId = options?.parentTrailId || null;

    // Get the input key, or set to '0' if no input key is provided. No input key assumes the start
    // of a new scrape. Input keys are used to keep track of a recursive index of a type.
    const inputKey = options?.inputKey || '0';

    // Defining this new trail.
    const trail = {
      trailId: this.newTrailId(parentTrailId),
      parent: parentTrailId,
    };

    // Define definite params from options.
    const params = {
      ...trail,
      inputKey,
      labelsOnly: !!options?.labelsOnly,
      maxDepth: options?.maxDepth || this.#maxDepth,
    };

    return this.getType(typeId, params);
  }

  // Get a lookup type from metadata. Possible recursion when scraping type ids.
  getType(typeId: number, params: TypeParams) {
    const { trailId, inputKey, labelsOnly, maxDepth, parent } = params;

    const lookup = this.lookup.getType(typeId);
    const depth = this.trailDepth(trailId);

    // Exit if type is cyclic.
    const cyclic = this.isTrailCyclic(trailId, typeId);
    if (cyclic) {
      return {
        cyclic: true,
        typeId,
      };
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
    const baseParams = { lookup, depth, trail: { trailId, parent }, inputKey };

    const { def }: AnyJson = lookup.type;
    const [type, value] = Object.entries(def).flat();

    // Scrape the type.
    const result: AnyJson = {};

    switch (type) {
      case 'array':
        result.class = new ArrayType(value as IArrayType, baseParams);
        result.array = result.class.scrape(this, params);
        break;

      case 'bitSequence':
        result.class = new BitSequence(value as BitSequenceType, baseParams);
        if (!labelsOnly) {
          result.bitsequence = result.class.scrape(this, params);
        }
        break;

      case 'compact':
        result.class = new Compact(value as CompactType, baseParams);
        result.compact = result.class.scrape(this, params);
        break;

      case 'composite':
        result.class = new Composite(value as CompositeType, baseParams);
        result.composite = result.class.scrape(this, params);
        break;

      case 'primitive':
        result.class = new Primitive(value as string, baseParams);
        result.primitive = result.class.scrape();
        break;

      case 'sequence':
        result.class = new Sequence(value as SequenceType, baseParams);
        result.sequence = result.class.scrape(this, params);
        break;

      case 'tuple':
        result.class = new Tuple(value as TupleType, baseParams);
        result.tuple = result.class.scrape(this, params);
        break;

      case 'variant':
        result.class = new Variant((value as VariantType).variants, baseParams);
        if (!labelsOnly) {
          result.variant = result.class.scrape(this, params);
        }
        break;

      default:
        return null;
    }

    return result;
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
  getTrail(trailId: TrailId): TrailId[] {
    const trail = this.#trails[trailId].trail;
    const parent = this.#trails[trailId].parent;

    if (parent) {
      return this.getTrail(parent).concat(trail);
    }
    return trail;
  }

  // Calculate whether a trail has become cyclic.
  isTrailCyclic(trailId: TrailId, typeId: number): boolean {
    return this.getTrail(trailId).includes(typeId);
  }

  // Append a typeId to a #trails.trail record.
  appendTrail(trailId: TrailId, typeId: number) {
    this.#trails[trailId].trail.push(typeId);
  }
}
