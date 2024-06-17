// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { TrailId, TrailParentId } from './types';

// A class that keeps track of type trails that have happened for a given scrape. Allows for
// checking cyclic types.
export class Trails {
  #trails: Record<string, { parent: TrailParentId; trail: TrailId[] }> = {};

  get trails() {
    return this.#trails;
  }

  // Generates a new trail Id for a new scrape.
  newTrailId(parent: TrailParentId): number {
    // Get the largest trail record key, and increment it by one.
    const trailKeys = Object.keys(this.trails);
    const trailKeysOrDefault = Object.keys(this.trails).length
      ? trailKeys
      : [0];
    const trailId = Math.max(...trailKeysOrDefault.map((k) => Number(k))) + 1;

    // Add new trail id to trails record.
    this.trails[trailId] = {
      parent,
      trail: [],
    };
    return trailId;
  }

  // Calculate the depth of a trail.
  trailDepth(trailId: TrailId): number {
    const length = this.trails[trailId].trail.length;
    // As long as a parent exists, recursively calculate its length and add it to the current
    // length.
    const parent = this.trails[trailId].parent;
    if (parent) {
      return length + this.trailDepth(parent);
    }
    return length;
  }

  // Calculate an entire trail, taking parents.
  getTrail(trailId: TrailId): TrailId[] {
    const trail = this.trails[trailId].trail;
    const parent = this.trails[trailId].parent;

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
    this.trails[trailId].trail.push(typeId);
  }
}
