// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ApiPromise } from '@polkadot/api';
import type { VoidFn } from '@polkadot/api/types';
import { WsProvider } from '@polkadot/rpc-provider';
import type { ChainId } from 'config/networks';
import type {
  APIChainState,
  APIStatusEventDetail,
  ApiChainStateVersion,
  EventStatus,
} from './types';

export class Api {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // The associated tab id for this api instance.
  #tabId: number;

  // The supplied chain id.
  #chainId: ChainId;

  // API provider.
  #provider: WsProvider;

  // API provider unsubs.
  #providerUnsubs: VoidFn[] = [];

  // API instance.
  #api: ApiPromise;

  // The current RPC endpoint.
  #rpcEndpoint: string;

  // The current chain spec.
  chainSpec: APIChainState;

  // ------------------------------------------------------
  // Getters.
  // ------------------------------------------------------

  get tabId() {
    return this.#tabId;
  }

  get chainId() {
    return this.#chainId;
  }

  get provider() {
    return this.#provider;
  }

  get api() {
    return this.#api;
  }

  get rpcEndpoint() {
    return this.#rpcEndpoint;
  }

  // ------------------------------------------------------
  // Constructor
  // ------------------------------------------------------

  constructor(tabId: number, chainId: ChainId, endpoint: string) {
    this.#tabId = tabId;
    this.#chainId = chainId;
    this.#rpcEndpoint = endpoint;
  }

  // ------------------------------------------------------
  // Initialization
  // ------------------------------------------------------

  // Initialize the API.
  async initialize() {
    // Initialize provider.
    this.#provider = new WsProvider(this.#rpcEndpoint);

    // Tell UI api is connecting.
    this.dispatchEvent(this.ensureEventStatus('connecting'));

    // Initialise provider events.
    this.initProviderEvents();

    // Initialise api.
    this.#api = await ApiPromise.create({ provider: this.provider });

    // Fetch chain spec.
    await this.fetchChainSpec();

    // Tell UI api is ready.
    this.dispatchEvent(this.ensureEventStatus('ready'));
  }

  async fetchChainSpec() {
    const newChainSpec = await Promise.all([
      this.api.rpc.system.chain(),
      this.api.consts.system.version,
      this.api.consts.system.ss58Prefix,
    ]);

    // Check that chain values have been fetched before committing to state.
    if (newChainSpec.every((c) => !!c?.toHuman())) {
      const chain = newChainSpec[0].toString();
      const version =
        newChainSpec[1].toJSON() as unknown as ApiChainStateVersion;
      const ss58Prefix = Number(newChainSpec[2].toString());

      if (version) {
        this.chainSpec = { chain, version, ss58Prefix };
      }
    }
  }

  // ------------------------------------------------------
  // Event handling.
  // ------------------------------------------------------

  // Set up API event listeners. Relays information to `document` for the UI to handle.
  async initProviderEvents() {
    this.#providerUnsubs.push(
      this.#provider.on('connected', () => {
        this.dispatchEvent(this.ensureEventStatus('connected'));
      })
    );

    this.#providerUnsubs.push(
      this.#provider.on('disconnected', () => {
        this.dispatchEvent(this.ensureEventStatus('disconnected'));
      })
    );
    this.#providerUnsubs.push(
      this.#provider.on('error', (err: string) => {
        this.dispatchEvent(this.ensureEventStatus('error'), { err });
      })
    );
  }

  // Handler for dispatching events.
  dispatchEvent(
    event: EventStatus,
    options?: {
      err?: string;
    }
  ) {
    const detail: APIStatusEventDetail = {
      event,
      tabId: this.tabId,
      chainId: this.chainId,
    };
    if (options?.err) {
      detail['err'] = options.err;
    }
    document.dispatchEvent(new CustomEvent('api-status', { detail }));
  }

  // ------------------------------------------------------
  // Class helpers.
  // ------------------------------------------------------

  // Ensures the provided status is a valid `EventStatus` being passed, or falls back to `error`.
  ensureEventStatus = (status: string | EventStatus): EventStatus => {
    const eventStatus: string[] = [
      'connecting',
      'connected',
      'disconnected',
      'ready',
      'error',
      'destroyed',
    ];
    if (eventStatus.includes(status)) {
      return status as EventStatus;
    }
    return 'error' as EventStatus;
  };

  // ------------------------------------------------------
  // Disconnect
  // ------------------------------------------------------

  // Remove API event listeners if they exist.
  unsubscribeProvider() {
    this.#providerUnsubs.forEach((unsub) => {
      unsub();
    });
  }

  // Disconnect gracefully from API and provider.
  async disconnect() {
    this.unsubscribeProvider();
    this.provider?.disconnect();
    await this.api?.disconnect();
    this.dispatchEvent(this.ensureEventStatus('destroyed'));
  }
}
