// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId } from 'config/networks';
import { Api } from 'model/Api';

export class ApiController {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // The currently instantiated API instances.
  static instances: Record<string, Api> = {};

  // ------------------------------------------------------
  // Api instance methods.
  // ------------------------------------------------------

  // Instantiate a new Api instance with the supplied chain id and endpoint.
  static async instantiate(chainId: ChainId, endpoint: string) {
    if (!ApiController.instances[chainId]) {
      ApiController.instances[chainId] = new Api(chainId, endpoint);
      await ApiController.instances[chainId].initialize();
    }
  }

  // Gracefully disconnect and then destroy an api instance.
  static async destroy(chainId: ChainId) {
    const api = ApiController.instances[chainId];

    if (api) {
      await api.disconnect();
      delete ApiController.instances[chainId];
    }
  }
}
