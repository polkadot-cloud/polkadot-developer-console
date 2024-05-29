// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ApiPromise } from '@polkadot/api';
import { WsProvider } from '@polkadot/rpc-provider';
import type { ChainId } from 'config/networks/types';
import type {
  APIChainSpec,
  APIStatusEventDetail,
  APIChainSpecVersion,
  EventStatus,
  ErrDetail,
  ApiInstanceId,
  APIChainSpecEventDetail,
} from './types';
import { MetadataController } from 'controllers/Metadata';
import { SubscriptionsController } from 'controllers/Subscriptions';
import type { AnyJson } from '@w3ux/utils/types';
import BigNumber from 'bignumber.js';
import type { ChainSpaceId, OwnerId } from 'types';

export class Api {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // The associated chain space for this api instance.
  #chainSpaceId: ChainSpaceId;

  // The associated owner for this api instance.
  #ownerId: OwnerId;

  // The instance id for this api instance.
  #instanceId: ApiInstanceId;

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

  // Chain constants.
  consts: Record<string, AnyJson> = {};

  // Whether the api has been initialised.
  #initialized = false;

  // The last reported api status.
  status: EventStatus = 'disconnected';

  // ------------------------------------------------------
  // Getters.
  // ------------------------------------------------------

  get chainSpaceId() {
    return this.#chainSpaceId;
  }

  get ownerId() {
    return this.#ownerId;
  }

  get instanceId() {
    return this.#instanceId;
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

  constructor(
    chainSpaceId: ChainSpaceId,
    ownerId: OwnerId,
    instanceIndex: number,
    chainId: ChainId,
    endpoint: string
  ) {
    this.#chainSpaceId = chainSpaceId;
    this.#ownerId = ownerId;
    this.#instanceId = `${ownerId}_${instanceIndex}`;
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

      // Set initialized flag.
      this.#initialized = true;
    } catch (e) {
      this.dispatchEvent(this.ensureEventStatus('error'), {
        err: 'InitializationError',
      });
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
    if (newChainSpec.every((c) => c?.toHuman() !== undefined)) {
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
        const magicNumber = metadataJson.magicNumber;

        this.chainSpec = {
          chain,
          version: specVersion,
          ss58Prefix,
          magicNumber: magicNumber as number,
          metadata: MetadataController.instantiate(
            metadataVersion,
            metadataPJs
          ),
          consts: {},
        };
      } else {
        this.dispatchEvent(this.ensureEventStatus('error'), {
          err: 'ChainSpecError',
        });
      }
    }
  }

  async handleFetchChainData() {
    // Fetch chain spec. NOTE: This is a one-time fetch. It's currently not possible to update the
    // chain spec without a refresh.
    if (!this.chainSpec) {
      // Fetch chain spec.
      await this.fetchChainSpec();
      // Fetch chain constants.
      this.fetchConsts();
    }
    const detail: APIChainSpecEventDetail = {
      chainSpaceId: this.chainSpaceId,
      ownerId: this.ownerId,
      instanceId: this.instanceId,
      spec: this.chainSpec,
      consts: this.consts,
    };

    document.dispatchEvent(
      new CustomEvent('new-chain-spec', {
        detail,
      })
    );
  }

  // Fetch chain consts. Must be called after chain spec is fetched.
  fetchConsts = () => {
    const metadata = this.chainSpec?.metadata;

    try {
      if (metadata) {
        const hasBalancesPallet = metadata.palletExists('Balances');
        const existentialDeposit = hasBalancesPallet
          ? new BigNumber(
              this.api.consts.balances.existentialDeposit.toString()
            )
          : null;

        this.consts = {
          existentialDeposit,
        };
      }
    } catch (e) {
      this.consts = {};
    }
  };

  // ------------------------------------------------------
  // Event handling.
  // ------------------------------------------------------

  // Set up API event listeners. Relays information to `document` for the UI to handle.
  async initApiEvents() {
    this.#api.on('ready', async () => {
      this.dispatchEvent(this.ensureEventStatus('ready'));
      this.handleFetchChainData();
    });

    this.#api.on('connected', () => {
      this.dispatchEvent(this.ensureEventStatus('connected'));

      // If this chain has already been initialized, sync chain data. May have been lost due to a
      // disconnect and automatic reconnect.
      if (this.#initialized) {
        this.dispatchEvent(this.ensureEventStatus('ready'));
        this.handleFetchChainData();
      }
    });

    this.#api.on('disconnected', () => {
      this.dispatchEvent(this.ensureEventStatus('disconnected'));
    });

    this.#api.on('error', (err: ErrDetail) => {
      this.dispatchEvent(this.ensureEventStatus('error'), { err });
    });
  }

  // Handler for dispatching events.
  dispatchEvent(
    event: EventStatus,
    options?: {
      err?: ErrDetail;
    }
  ) {
    const detail: APIStatusEventDetail = {
      event,
      chainSpaceId: this.chainSpaceId,
      ownerId: this.ownerId,
      instanceId: this.instanceId,
      chainId: this.chainId,
    };
    if (options?.err) {
      detail['err'] = options.err;
    }

    // Update class status.
    this.status = event;

    // Dispatch status event to UI.
    document.dispatchEvent(new CustomEvent('api-status', { detail }));
  }

  // ------------------------------------------------------
  // Subscriptions.
  // ------------------------------------------------------
  //

  // Unsubscribe from all active subscriptions associated with this API instance.
  unsubscribe = () => {
    const subs = SubscriptionsController.getAll(this.instanceId);

    if (subs) {
      Object.entries(subs).forEach(([subscriptionId, subscription]) => {
        subscription.unsubscribe();
        // Remove subscription from controller.
        SubscriptionsController.remove(this.instanceId, subscriptionId);
      });
    }
  };

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
    // Unsubscribe from all active subscriptions.
    this.unsubscribe();

    // Disconnect provider and api.
    this.provider?.disconnect();
    await this.api?.disconnect();

    // Tell UI api is destroyed.
    if (destroy) {
      this.dispatchEvent(this.ensureEventStatus('destroyed'));
    }
  }
}
