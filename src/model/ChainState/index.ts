import type { VoidFn } from '@polkadot/api/types';
import { ApiController } from 'controllers/Api';
import type { SubscriptionConfig } from './types';

export class ChainState {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // The associated tab id for this chain state instance.
  #tabId: number;

  // Unsubscribe objects, keyed by subscription key.
  #unsubs: Record<string, VoidFn>;

  // ------------------------------------------------------
  // Constructor.
  // ------------------------------------------------------

  constructor(tabId: number) {
    this.#tabId = tabId;
  }

  // ------------------------------------------------------
  // Subscription.
  // ------------------------------------------------------

  // Subscribe to chain state query.
  subscribe = async (
    type: 'strorage' | 'raw',
    config: SubscriptionConfig
  ): Promise<void> => {
    const api = ApiController.instances[this.#tabId].api;

    if (api) {
      console.log(api, type, config);

      // TODO: Implement.
      // await api.rpc.state.subscribeStorage(
      //   ['0xf0c365c3cf59d671eb72da0e7a4113c49f1f0515f462cdcf84e0f1d6045dfcbb'],
      //   ([result]: AnyJson) => {
      //     const unwrapped = result.unwrapOr(null);
      //     if (unwrapped) {
      //       console.log('Storage key test result:', unwrapped.toHex());
      //
      //       // Send result to UI in `new-chain-state-result` event.
      //     }
      //   }
      // );
    }
  };

  // Unsubscribe from one class subscription.
  unsubscribeOne = (key: string): void => {
    const unsub = this.#unsubs[key];
    if (typeof unsub === 'function') {
      unsub();
    }
    delete this.#unsubs[key];
  };

  // Unsubscribe from all class subscriptions.
  unsubscribeAll = (): void => {
    for (const key in Object.keys(this.#unsubs)) {
      this.unsubscribeOne(key);
    }
  };
}
