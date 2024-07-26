// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { ChainSpaceId } from 'types';
import { ChainSpace } from 'model/ChainSpace';

export class ChainSpaceController {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // The currently instantiated ChainSpace instances.
  static #instances: Record<ChainSpaceId, ChainSpace> = {};

  // ------------------------------------------------------
  // Instance methods.
  // ------------------------------------------------------

  // Instantiate a new `ChainSpace` instance with the supplied owner.
  static instantiate(id: ChainSpaceId) {
    // Exit if instance already exists.
    if (this.#instances[id]) {
      return;
    }
    // Instantiate instance.
    this.#instances[id] = new ChainSpace(id);
  }

  // Get a chain space instance by owner and index.
  static getInstance(id: ChainSpaceId) {
    return this.#instances[id];
  }

  // ------------------------------------------------------
  // Getters.
  // ------------------------------------------------------

  static get instances() {
    return this.#instances;
  }
}
