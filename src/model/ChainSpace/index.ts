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

  // Get an api instance associated with this chain space.
  getApi(index: number) {
    return ApiController.getInstanceApi(this.#id, index);
  }

  // Destroy an api instance associated with this chain space.
  async destroyApi(index: number) {
    await ApiController.destroy(this.#id, index);
  }

  // ------------------------------------------------------
  // Disconnect.
  // ------------------------------------------------------

  // Disconnect gracefully from all API instances owned by this chain space. Called when this chain
  // space is being destroyed.
  async destroy() {
    // Destroy all api instances for this chainspace id.
    await ApiController.destroyAll(this.#id);
  }
}
