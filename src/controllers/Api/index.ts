// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId } from 'config/networks/types';
import { ChainStateController } from 'controllers/ChainState';
import { Api } from 'model/Api';
import type { ChainSpaceId, OwnerId } from 'types';

export class ApiController {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // The currently instantiated API instances, keyed by ownerId.
  static #instances: Record<OwnerId, Record<number, Api>> = {};

  // ------------------------------------------------------
  // Getters.
  // ------------------------------------------------------

  static get instances() {
    return this.#instances;
  }

  // ------------------------------------------------------
  // Instance methods.
  // ------------------------------------------------------

  // Instantiate a new `Api` instance with the supplied owner, chainId and endpoint.
  static async instantiate(
    chainSpaceId: ChainSpaceId,
    ownerId: OwnerId,
    chainId: ChainId,
    endpoint: string
  ) {
    // Initialise empty record for this ownerId if it doesn't exist.
    let instanceIndex = 0;
    if (!this.#instances[ownerId]) {
      this.#instances[ownerId] = {};
    } else {
      instanceIndex = this.getNextIndex(ownerId);
    }

    this.#instances[ownerId][instanceIndex] = new Api(
      chainSpaceId,
      ownerId,
      instanceIndex,
      chainId,
      endpoint
    );
    await this.#instances[ownerId][instanceIndex].initialize();

    // Once the api instance is initialized, we can instantiate the chain state controller.
    ChainStateController.instantiate(ownerId, `${ownerId}_${instanceIndex}`);

    return instanceIndex;
  }

  // Get the next instance index for an ownerId.
  static getNextIndex(ownerId: OwnerId) {
    let instanceIndex = 0;

    // Initialise empty record for this ownerId if it doesn't exist.
    if (Object.keys(this.#instances[ownerId] || {}).length > 0) {
      // If #instances already exist for this owner, get largest instanceIndex and increment it.
      instanceIndex =
        Object.keys(this.#instances[ownerId] || {}).reduce(
          (acc, id) => Math.max(acc, parseInt(id, acc)),
          0
        ) + 1;
    }

    return instanceIndex;
  }

  // Get an instance `api` by ownerId and instanceIndex.
  static getInstanceApi(ownerId: OwnerId, instanceIndex: number) {
    return this.#instances[ownerId][instanceIndex].api;
  }

  // ------------------------------------------------------
  // Disconnect and destroy.
  // ------------------------------------------------------

  // Gracefully disconnect and then destroy an api instance.
  static async destroy(ownerId: OwnerId, instanceIndex: number) {
    const instance = this.#instances[ownerId]?.[instanceIndex];

    if (instance) {
      ChainStateController.destroy(`${ownerId}_${instanceIndex}`);

      // NOTE: This is async, but not currently waiting for it to disconnect before state is
      // deleted.
      instance.disconnect(true);
      delete this.#instances[ownerId][instanceIndex];
    }
  }

  // Destroy all api instances associated with an owner.
  static async destroyAll(ownerId: OwnerId) {
    const instances = this.#instances[ownerId];

    if (instances) {
      await Promise.all(
        Object.keys(instances).map((instanceIndex) =>
          this.destroy(ownerId, parseInt(instanceIndex))
        )
      );
    }
    delete this.#instances[ownerId];
  }
}
