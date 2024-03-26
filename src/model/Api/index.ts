// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ApiPromise } from '@polkadot/api';
import { WsProvider } from '@polkadot/rpc-provider';
import type { ChainId } from 'config/networks';
import type {
  APIChainSpec,
  APIStatusEventDetail,
  APIChainSpecVersion,
  EventStatus,
} from './types';
import { MetadataController } from 'controllers/Metadata';

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

  // API instance.
  #api: ApiPromise;

  // The current RPC endpoint.
  #rpcEndpoint: string;

  // The current chain spec.
  chainSpec: APIChainSpec | undefined;

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
  // Constructor.
  // ------------------------------------------------------

  constructor(tabId: number, chainId: ChainId, endpoint: string) {
    this.#tabId = tabId;
    this.#chainId = chainId;
    this.#rpcEndpoint = endpoint;
  }

  // ------------------------------------------------------
  // Initialization.
  // ------------------------------------------------------

  // Initialize the API.
  async initialize() {
    try {
      // Initialize provider.
      this.#provider = new WsProvider(this.#rpcEndpoint);

      // Tell UI api is connecting.
      this.dispatchEvent(this.ensureEventStatus('connecting'));

      // Initialise api.
      this.#api = new ApiPromise({ provider: this.provider });

      // Initialise api events.
      this.initApiEvents();

      await this.#api.isReady;
    } catch (e) {
      this.dispatchEvent(this.ensureEventStatus('error'));
    }
  }

  async fetchChainSpec() {
    // Fetch chain specs.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newChainSpec = await Promise.all<any>([
      this.api.rpc.system.chain(),
      this.api.consts.system.version,
      this.api.consts.system.ss58Prefix,
    ]);

    // Check that chain values have been fetched before committing to state.
    if (newChainSpec.every((c) => !!c?.toHuman())) {
      const chain = newChainSpec[0].toString();
      const specVersion =
        newChainSpec[1].toJSON() as unknown as APIChainSpecVersion;
      const ss58Prefix = Number(newChainSpec[2].toString());

      // Also retreive the JSON formatted metadata here for the UI to construct from.
      const metadataPJs = this.api.runtimeMetadata;
      const metadataJson = metadataPJs.toJSON();

      // Set chainspec and metadata, or dispatch an error and disconnect otherwise.
      if (specVersion && metadataJson) {
        const metadataVersion = Object.keys(metadataJson?.metadata || {})[0];
        const magicNumber = Object.values(metadataJson?.metadata || {})[0]
          .magicNumber;

        this.chainSpec = {
          chain,
          version: specVersion,
          ss58Prefix,
          magicNumber: magicNumber as number,
          metadata: MetadataController.instantiate(
            metadataVersion,
            metadataPJs
          ),
        };
      } else {
        this.dispatchEvent(this.ensureEventStatus('error'));
      }
    }
  }

  // ------------------------------------------------------
  // Event handling.
  // ------------------------------------------------------

  // Set up API event listeners. Relays information to `document` for the UI to handle.
  async initApiEvents() {
    this.#api.on('ready', async () => {
      this.dispatchEvent(this.ensureEventStatus('ready'));

      // Fetch chain spec. NOTE: This is a one-time fetch. It's currently not possible to update the
      // chain spec without a refresh.
      if (!this.chainSpec) {
        await this.fetchChainSpec();

        document.dispatchEvent(
          new CustomEvent('new-chain-spec', {
            detail: {
              spec: this.chainSpec,
              tabId: this.tabId,
            },
          })
        );
      }
    });

    this.#api.on('connected', () => {
      this.dispatchEvent(this.ensureEventStatus('connected'));
    });

    this.#api.on('disconnected', () => {
      this.dispatchEvent(this.ensureEventStatus('disconnected'));
    });

    this.#api.on('error', (err: string) => {
      this.dispatchEvent(this.ensureEventStatus('error'), { err });
    });
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
  // Disconnect.
  // ------------------------------------------------------

  // Disconnect gracefully from API and provider.
  async disconnect(destroy = false) {
    // Disconnect provider and api.
    this.provider?.disconnect();
    await this.api?.disconnect();

    // Tell UI api is destroyed.
    if (destroy) {
      this.dispatchEvent(this.ensureEventStatus('destroyed'));
    }
  }
}
