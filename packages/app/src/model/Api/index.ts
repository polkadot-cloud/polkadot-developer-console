// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { ApiPromise } from '@polkadot/api';
import { WsProvider } from '@polkadot/rpc-provider';
import type { ChainId } from 'config/networks/types';
import type {
  APIChainSpec,
  APIStatusEventDetail,
  EventStatus,
  ErrDetail,
  ApiInstanceId,
  APIChainSpecEventDetail,
  PapiObservableClient,
  PapiDynamicBuilder,
} from './types';
import { SubscriptionsController } from 'controllers/Subscriptions';
import type { AnyJson } from '@w3ux/types';
import type { ChainSpaceId, OwnerId } from 'types';
import type { JsonRpcProvider } from '@polkadot-api/ws-provider/web';
import { getWsProvider } from '@polkadot-api/ws-provider/web';
import { createClient as createRawClient } from '@polkadot-api/substrate-client';
import { getObservableClient } from '@polkadot-api/observable-client';
import { ChainSpec } from 'model/Observables/ChainSpec';

import { getDataFromObservable } from 'model/Observables/util';
import { Metadata } from 'model/Observables/Metadata';
import { MetadataV15 } from 'model/Metadata/MetadataV15';
import { PalletScraper } from 'model/Scraper/Pallet';
import {
  getLookupFn,
  getDynamicBuilder,
} from '@polkadot-api/metadata-builders';
import { formatChainSpecName } from './util';
import { MetadataController } from 'controllers/Metadata';
import BigNumber from 'bignumber.js';

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

  // Polkadot JS API provider.
  #provider: WsProvider;

  // Polkadot JS API instance.
  #api: ApiPromise;

  // PAPI Provider.
  #papiProvider: JsonRpcProvider;

  // PAPI Instance.
  #papiClient: PapiObservableClient;

  // PAPI Dynamic Builder.
  #papiBuilder: PapiDynamicBuilder;

  // The current RPC endpoint.
  #rpcEndpoint: string;

  // The current chain spec.
  chainSpec: APIChainSpec;

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

  get papiProvider() {
    return this.#papiProvider;
  }

  get papiClient() {
    return this.#papiClient;
  }

  get papiBuilder() {
    return this.#papiBuilder;
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
      // Initialize Polkadot JS API provider.
      this.#provider = new WsProvider(this.#rpcEndpoint);

      // Initialize PAPI provider.
      this.#papiProvider = getWsProvider(this.#rpcEndpoint);

      // Tell UI api is connecting.
      this.dispatchEvent(this.ensureEventStatus('connecting'));

      // Initialise Polkadot JS API.
      this.#api = new ApiPromise({ provider: this.provider });

      // Initialize PAPI Client.
      this.#papiClient = getObservableClient(
        createRawClient(this.#papiProvider)
      );

      // NOTE: Unlike Polkadot JS API, observable client does not have an asynchronous
      // initialization stage that leads to `isReady`. If using observable client, we can
      // immediately attempt to fetch the chainSpec via the client.

      // Initialise Polkadot JS API events and wait until ready.
      this.initPolkadotJsApiEvents();
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
    try {
      const [resultChainSpec, resultMetadata] = await Promise.all([
        // Get chain spec via observable.
        getDataFromObservable(
          this.#instanceId,
          'chainSpec',
          new ChainSpec(this.#ownerId, this.#instanceId)
        ),
        // Get metadata via observable.
        getDataFromObservable(
          this.#instanceId,
          'metadata',
          new Metadata(this.#ownerId, this.#instanceId)
        ),
      ]);

      if (!resultChainSpec || !resultMetadata) {
        throw new Error();
      }

      console.log('papi: ', resultMetadata);

      // Now metadata has been retrieved, create a dynamic builder for the metadata and persist it
      // to this class.
      this.#papiBuilder = getDynamicBuilder(getLookupFn(resultMetadata));

      // Format a human-readable chain name based on spec name.
      const chainName = formatChainSpecName(resultChainSpec.specName);

      // Prepare metadata class and scraper to retrieve constants.
      const resultMetadataV15 = new MetadataV15(resultMetadata);
      const scraper = new PalletScraper(resultMetadataV15);

      // Get SS58 Prefix via metadata - defaults to 0.
      const ss58Prefix = this.#papiBuilder
        .buildConstant('System', 'SS58Prefix')
        .dec(String(scraper.getConstantValue('System', 'SS58Prefix') || '0x'));

      const metadataPJs = this.api.runtimeMetadata;
      const metadataPJsJson = metadataPJs.asV15.toJSON();

      console.log('pjs api: ', metadataPJsJson);

      // Format resulting class chain spec and persist to class.
      this.chainSpec = {
        chain: chainName,
        version: resultChainSpec.specVersion,
        ss58Prefix: Number(ss58Prefix),
        // TODO: Replace with Papi / runtime api fetched metadata.
        metadata: MetadataController.instantiate(metadataPJsJson),
        consts: {},
      };
    } catch (e) {
      // Flag an error if there are any issues bootstrapping chain spec.
      this.dispatchEvent(this.ensureEventStatus('error'), {
        err: 'ChainSpecError',
      });
    }
  }

  async handleFetchChainData() {
    // NOTE: This is a one-time fetch. It's currently not possible to update the chain spec without
    // a refresh.
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
    const metadata = this.chainSpec.metadata;
    const newConsts: Record<string, AnyJson> = {};

    try {
      const scraper = new PalletScraper(metadata);
      const hasBalancesPallet = metadata.palletExists('Balances');

      // Attempt to fetch existential deposit if Balances pallet exists.
      if (hasBalancesPallet) {
        const existentialDeposit = this.#papiBuilder
          .buildConstant('Balances', 'ExistentialDeposit')
          .dec(
            String(
              scraper.getConstantValue('Balances', 'ExistentialDeposit') || '0x'
            )
          );

        newConsts['existentialDeposit'] = new BigNumber(existentialDeposit);
      }
      this.consts = newConsts;
    } catch (e) {
      this.consts = {};
    }
  };

  // ------------------------------------------------------
  // Event handling.
  // ------------------------------------------------------

  // Set up Polkadot JS API event listeners. Relays information to `document` for the UI to handle.
  async initPolkadotJsApiEvents() {
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
