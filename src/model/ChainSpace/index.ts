// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { OwnerId } from 'types';
import type { ChainSpaceInstanceId } from './types';
import { ApiController } from 'controllers/Api';
import type { ChainId } from 'config/networks';

export class ChainSpace {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // The associated owner for this instance.
  #ownerId: OwnerId;

  // The chain space id for this instance.
  #chainSpaceId: ChainSpaceInstanceId;

  get ownerId() {
    return this.#ownerId;
  }

  get chainSpaceId() {
    return this.#chainSpaceId;
  }

  // ------------------------------------------------------
  // Constructor.
  // ------------------------------------------------------

  constructor(ownerId: OwnerId, instanceIndex: number) {
    this.#ownerId = ownerId;
    this.#chainSpaceId = `${ownerId}_${instanceIndex}`;
  }

  // ------------------------------------------------------
  // Manage Api instances.
  // ------------------------------------------------------

  // Instantiate an api instance for this chain space.
  async addApi(chainId: ChainId, endpoint: string) {
    ApiController.instantiate(this.#ownerId, chainId, endpoint);
  }

  // Get an api instance associated with this chain space.
  getApi(index: number) {
    return ApiController.getInstanceApi(this.#chainSpaceId, index);
  }

  // Destroy an api instance associated with this chain space.
  async destroyApi(index: number) {
    await ApiController.destroy(this.#chainSpaceId, index);
  }

  // ------------------------------------------------------
  // Disconnect.
  // ------------------------------------------------------

  // Disconnect gracefully from all API instances owned by this chain space. Called when this chain
  // space is being destroyed.
  async destroy() {
    // Destroy all api instances for this owner.
    await ApiController.destroyAll(this.#chainSpaceId);
  }
}
