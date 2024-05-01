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
  static instances: Record<OwnerId, Api[]> = {};

  // ------------------------------------------------------
  // Api instance methods.
  // ------------------------------------------------------

  // Instantiate a new `Api` instance with the supplied owner, chainId and endpoint.
  static async instantiate(
    ownerId: OwnerId,
    instanceId: number,
    chainId: ChainId,
    endpoint: string
  ) {
    // NOTE: This method should only be called to connect to a new instance. We therefore assume we
    // want to disconnect from existing instances for this tab. The following condition will only be
    // met if there is an existing stale instance in class state, or if this method is used
    // incorrectly.
    if (this.instances?.[ownerId]?.[instanceId]) {
      await this.destroy(ownerId, instanceId);
    }

    // Initialise array of instances for this ownerId if it doesn't exist.
    if (!this.instances[ownerId]) {
      this.instances[ownerId] = [];
    }

    this.instances[ownerId][instanceId] = new Api(ownerId, chainId, endpoint);
    await this.instances[ownerId][instanceId].initialize();
  }

  // Gracefully disconnect and then destroy an api instance.
  static async destroy(ownerId: OwnerId, instanceId: number) {
    const api = this.instances[ownerId][instanceId];
    if (api) {
      await api.disconnect(true);
      delete this.instances[ownerId];
    }
  }
}
