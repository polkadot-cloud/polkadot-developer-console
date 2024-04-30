// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ChainState } from 'model/ChainState';

export class ChainStateController {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------
  // The currently instantiated chain state instances, keyed by ownerId.
  static instances: Record<string, ChainState> = {};

  // ------------------------------------------------------
  // Chain state instance methods.
  // ------------------------------------------------------

  // Instantiate a new `ChainState` instance with the supplied ownerId.
  static async instantiate(ownerId: number) {
    if (this.instances[ownerId]) {
      this.destroy(ownerId);
    }

    this.instances[ownerId] = new ChainState(ownerId);
  }

  // Gracefully disconnect and then destroy an api instance.
  static destroy(ownerId: number) {
    const instance = this.instances[ownerId];
    if (instance) {
      instance.unsubscribeAll();
      delete this.instances[ownerId];
    }
  }
}
