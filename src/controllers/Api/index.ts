// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId } from 'config/networks';
import { ChainStateController } from 'controllers/ChainState';
import { Api } from 'model/Api';
import type { OwnerId } from 'types';

export class ApiController {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // The currently instantiated API instances, keyed by ownerId.
  static #instances: Record<OwnerId, Record<number, Api>> = {};

  // Get an instance `api` by ownerId and instanceIndex.
  static getInstance(ownerId: OwnerId, instanceIndex: number) {
    return this.#instances[ownerId][instanceIndex].api;
  }

  static get instances() {
    return this.#instances;
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
    let instanceIndex = 0;
    // Initialise array of instances for this ownerId if it doesn't exist.
    if (!this.#instances[ownerId]) {
      this.#instances[ownerId] = {};
    } else {
      // If #instances already exist for this owner, get largest instanceIndex and increment it.
      instanceIndex =
        Object.keys(this.#instances[ownerId] || {}).reduce(
          (acc, id) => Math.max(acc, parseInt(id, acc)),
          0
        ) + 1;
    }

    this.#instances[ownerId][instanceIndex] = new Api(
      ownerId,
      instanceIndex,
      chainId,
      endpoint
    );
    await this.#instances[ownerId][instanceIndex].initialize();

    // Once the api instance is initialized, we can instantiate the chain state controller.
    ChainStateController.instantiate(ownerId, `${ownerId}_${instanceIndex}`);
  }

  // Gracefully disconnect and then destroy an api instance.
  static async destroy(ownerId: OwnerId, instanceIndex: number) {
    const instance = this.#instances[ownerId][instanceIndex];
    if (instance) {
      ChainStateController.destroy(`${ownerId}_${instanceIndex}`);

      await instance.disconnect(true);
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
