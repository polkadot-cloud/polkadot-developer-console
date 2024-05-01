// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId } from 'config/networks';
import { Api } from 'model/Api';
import type { OwnerId } from 'model/Api/types';

export class ApiController {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // The currently instantiated API instances, keyed by ownerId.
  static #instances: Record<OwnerId, Record<number, Api>> = {};

  // Get an instance `api` by ownerId and instanceId.
  static getInstance(ownerId: OwnerId, instanceId: number) {
    return this.#instances[ownerId][instanceId].api;
  }

  // ------------------------------------------------------
  // Api instance methods.
  // ------------------------------------------------------

  // Instantiate a new `Api` instance with the supplied owner, chainId and endpoint.
  static async instantiate(
    ownerId: OwnerId,
    chainId: ChainId,
    endpoint: string
  ) {
    let instanceId = 0;
    // Initialise array of instances for this ownerId if it doesn't exist.
    if (!this.#instances[ownerId]) {
      this.#instances[ownerId] = {};
    } else {
      // If #instances already exist for this owner, get largest instanceId and increment it.
      instanceId =
        Object.keys(this.#instances[ownerId] || {}).reduce(
          (acc, id) => Math.max(acc, parseInt(id, acc)),
          0
        ) + 1;
    }

    this.#instances[ownerId][instanceId] = new Api(ownerId, chainId, endpoint);
    await this.#instances[ownerId][instanceId].initialize();
  }

  // Gracefully disconnect and then destroy an api instance.
  static async destroy(ownerId: OwnerId, instanceId: number) {
    const api = this.#instances[ownerId][instanceId];
    if (api) {
      await api.disconnect(true);
      delete this.#instances[ownerId];
    }
  }
}
