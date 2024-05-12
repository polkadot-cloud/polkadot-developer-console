// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainSpaceId, OwnerId } from 'types';
import { ApiController } from 'controllers/Api';
import type { ChainId } from 'config/networks';

export class ChainSpace {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // The associated owner for this instance.
  #id: ChainSpaceId;

  get id() {
    return this.#id;
  }

  // ------------------------------------------------------
  // Constructor.
  // ------------------------------------------------------

  constructor(id: ChainSpaceId) {
    this.#id = id;
  }

  // ------------------------------------------------------
  // Manage Api instances.
  // ------------------------------------------------------

  // Instantiate an api instance for this chain space.
  async addApi(ownerId: OwnerId, chainId: ChainId, endpoint: string) {
    const instanceId = await ApiController.instantiate(
      this.#id,
      ownerId,
      chainId,
      endpoint
    );

    return instanceId;
  }
}
