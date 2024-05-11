// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { OwnerId } from 'types';
import { ChainSpace } from 'model/ChainSpace';

export class ChainSpaceController {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // The currently instantiated ChainSpace instances, keyed by ownerId.
  static #instances: Record<OwnerId, ChainSpace> = {};

  // ------------------------------------------------------
  // Instance methods.
  // ------------------------------------------------------

  // Instantiate a new `ChainSpace` instance with the supplied owner.
  static instantiate(ownerId: OwnerId) {
    // Exit if instance already exists.
    if (this.#instances[ownerId]) {
      return;
    }
    // Instantiate instance.
    this.#instances[ownerId] = new ChainSpace(ownerId);
  }

  // Get a chain space instance by owner and index.
  static getInstance(ownerId: OwnerId) {
    return this.#instances[ownerId];
  }

  // Gracefully disconnect and then destroy a chain space instance.
  static async destroyInstance(ownerId: OwnerId) {
    const instance = this.#instances[ownerId];
    if (instance) {
      await instance.destroy();
      delete this.#instances[ownerId];
    }
  }

  // ------------------------------------------------------
  // Getters.
  // ------------------------------------------------------

  static get instances() {
    return this.#instances;
  }
}
