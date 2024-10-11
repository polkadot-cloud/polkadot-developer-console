// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { VoidFn } from '@polkadot/api/types';
import type { ChainId } from 'config/networks/types';
import { ApiController } from 'controllers/Api';
import type { Unsubscribable } from 'controllers/Subscriptions/types';
import type { ApiInstanceId } from 'model/Api/types';
import { getIndexFromInstanceId } from 'model/Api/util';
import type { OwnerId } from 'types';

export class NextFreeParaId implements Unsubscribable {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // The associated owner for this instance.
  #ownerId: OwnerId;

  // The associated api instance for this instance.
  #instanceId: ApiInstanceId;

  // The supplied chain id.
  #chainId: ChainId;

  // The current next free para id.
  nextFreeParaId = '0';

  // Unsubscribe object.
  #unsub: VoidFn;

  // ------------------------------------------------------
  // Constructor.
  // ------------------------------------------------------

  constructor(ownerId: OwnerId, instanceId: ApiInstanceId, chainId: ChainId) {
    this.#ownerId = ownerId;
    this.#instanceId = instanceId;
    this.#chainId = chainId;

    // Subscribe immediately.
    this.subscribe();
  }

  // ------------------------------------------------------
  // Subscription.
  // ------------------------------------------------------

  // Subscribe to next free para id.
  subscribe = async (): Promise<void> => {
    try {
      const api = ApiController.getInstanceApi(
        this.#ownerId,
        getIndexFromInstanceId(this.#instanceId)
      );

      if (api && this.#unsub === undefined) {
        const unsub = await api.query.registrar.nextFreeParaId(
          (num: number) => {
            // Update class next free para id.
            this.nextFreeParaId = num.toString();

            // Send to UI.
            document.dispatchEvent(
              new CustomEvent('callback-next-free-para-id', {
                detail: {
                  ownerId: this.#ownerId,
                  instanceId: this.#instanceId,
                  chainId: this.#chainId,
                  nextFreeParaId: num.toString(),
                },
              })
            );
          }
        );

        // Subscription now initialised. Store unsub.
        this.#unsub = unsub as unknown as VoidFn;
      }
    } catch (e) {
      // Subscription failed.
    }
  };

  // ------------------------------------------------------
  // Unsubscribe handler.
  // ------------------------------------------------------

  // Unsubscribe from class subscription.
  unsubscribe = (): void => {
    if (typeof this.#unsub === 'function') {
      this.#unsub();
    }
  };
}
