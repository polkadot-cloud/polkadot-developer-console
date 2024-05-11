// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { OwnerId } from 'types';
import { ApiController } from 'controllers/Api';
import type { ChainId } from 'config/networks';

export class ChainSpace {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // The associated owner for this instance.
  #ownerId: OwnerId;

  get ownerId() {
    return this.#ownerId;
  }

  // ------------------------------------------------------
  // Constructor.
  // ------------------------------------------------------

  constructor(ownerId: OwnerId) {
    this.#ownerId = ownerId;
  }

  // ------------------------------------------------------
  // Manage Api instances.
  // ------------------------------------------------------

  // Instantiate an api instance for this chain space.
  async addApi(chainId: ChainId, endpoint: string) {
    const instanceId = await ApiController.instantiate(
      this.#ownerId,
      chainId,
      endpoint
    );

    return instanceId;
  }

  // Get an api instance associated with this chain space.
  getApi(index: number) {
    return ApiController.getInstanceApi(this.#ownerId, index);
  }

  // Destroy an api instance associated with this chain space.
  async destroyApi(index: number) {
    await ApiController.destroy(this.#ownerId, index);
  }

  // ------------------------------------------------------
  // Disconnect.
  // ------------------------------------------------------

  // Disconnect gracefully from all API instances owned by this chain space. Called when this chain
  // space is being destroyed.
  async destroy() {
    // Destroy all api instances for this owner.
    await ApiController.destroyAll(this.#ownerId);
  }
}
