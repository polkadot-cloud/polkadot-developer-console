// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { OwnerId } from 'types';
import { ChainSpace } from 'model/ChainSpace';

export class ChainSpaceController {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // The currently instantiated ChainSpace instances, keyed by ownerId.
  static #instances: Record<OwnerId, Record<number, ChainSpace>> = {};

  // ------------------------------------------------------
  // Instance methods.
  // ------------------------------------------------------

  // Instantiate a new `ChainSpace` instance with the supplied owner.
  static instantiate(ownerId: OwnerId) {
    let instanceIndex = 0;
    // Initialise empty record for this ownerId if it doesn't exist.
    if (!this.#instances[ownerId]) {
      this.#instances[ownerId] = {};
    } else {
      // If #instances already exist for this owner, get largest instanceIndex and increment it.
      instanceIndex =
        Object.keys(this.#instances[ownerId] || {}).reduce(
          (acc, id) => Math.max(acc, parseInt(id, acc)),
          0
        ) + 1;
    }

    // Instantiate instance.
    this.#instances[ownerId][instanceIndex] = new ChainSpace(
      ownerId,
      instanceIndex
    );

    // Return the instance index.
    return instanceIndex;
  }

  // Gracefully disconnect and then destroy a chain space instance.
  static async destroyInstance(ownerId: OwnerId, instanceIndex: number) {
    const instance = this.#instances[ownerId][instanceIndex];
    if (instance) {
      await instance.destroy();
      delete this.#instances[ownerId][instanceIndex];
    }
  }

  // ------------------------------------------------------
  // Getters.
  // ------------------------------------------------------

  static get instances() {
    return this.#instances;
  }
}
