// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainIdOrCustom } from 'config/networks';
import { Api } from 'model/Api';

export class ApiController {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // The currently instantiated API instances, keyed by tab id.
  static instances: Record<string, Api> = {};

  // ------------------------------------------------------
  // Api instance methods.
  // ------------------------------------------------------

  // Instantiate a new `Api` instance with the supplied chain id and endpoint.
  static async instantiate(
    tabId: number,
    chainId: ChainIdOrCustom,
    endpoint: string
  ) {
    if (!this.instances[tabId]) {
      this.instances[tabId] = new Api(tabId, chainId, endpoint);
      await this.instances[tabId].initialize();
    }
  }

  // Gracefully disconnect and then destroy an api instance.
  static async destroy(tabId: number) {
    const api = this.instances[tabId];
    if (api) {
      await api.disconnect(true);
      delete this.instances[tabId];
    }
  }
}
