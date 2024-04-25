// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ChainState } from 'model/ChainState';

export class ChainStateController {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------
  // The currently instantiated chain state instances, keyed by tab id.
  static instances: Record<string, ChainState> = {};

  // ------------------------------------------------------
  // Chain state instance methods.
  // ------------------------------------------------------

  // Instantiate a new `ChainState` instance with the supplied tabId.
  static async instantiate(tabId: number) {
    if (this.instances[tabId]) {
      this.destroy(tabId);
    }

    this.instances[tabId] = new ChainState(tabId);
  }

  // Gracefully disconnect and then destroy an api instance.
  static destroy(tabId: number) {
    const instance = this.instances[tabId];
    if (instance) {
      instance.unsubscribeAll();
      delete this.instances[tabId];
    }
  }
}
