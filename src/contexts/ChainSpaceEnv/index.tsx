// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@w3ux/utils';
import { isCustomEvent } from 'Utils';
import { useActiveTab } from 'contexts/ActiveTab';
import { useImportedAccounts } from 'contexts/ImportedAccounts';
import { useMenu } from 'contexts/Menu';
import { useParaSetup } from 'contexts/ParaSetup';
import { SubscriptionsController } from 'controllers/Subscriptions';
import { useActiveBalances } from 'hooks/useActiveBalances';
import { AccountBalances } from 'model/AccountBalances';
import type { APIStatusEventDetail, ApiStatus } from 'model/Api/types';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useEventListener } from 'usehooks-ts';
import type {
  ChainSpaceChainSpecs,
  ChainSpaceEnvContextInterface,
  ChainSpaceEnvProps,
} from './types';
import { defaultChainSpaceEnvContext } from './defaults';
import { useGlobalChainSpace } from 'contexts/GlobalChainSpace';
import type { ChainId } from 'config/networks';

export const ChainSpaceEnv = createContext<ChainSpaceEnvContextInterface>(
  defaultChainSpaceEnvContext
);

export const useChainSpaceEnv = () => useContext(ChainSpaceEnv);

export const ChainSpaceEnvProvider = ({ children }: ChainSpaceEnvProps) => {
  const { closeMenu } = useMenu();
  const { tabId } = useActiveTab();
  const { getAccounts } = useImportedAccounts();
  // TODO: provide a chain space instead of always using global.
  const { globalChainSpace } = useGlobalChainSpace();
  const { getRelayApi, getRelayInstanceIndex } = useParaSetup();

  // // The initial api statuses for the provided chains, if any.
  // const initialApiStatuses: ChainSpaceApiStatuses = {};
  // Object.values(chains || {}).forEach(
  //   (chainId) => (initialApiStatuses[chainId] = 'disconnected')
  // );

  // The api instances associated with this chainspace.
  const [apiInstances, setApiInstances] = useState<Record<number, number>>({});

  // Gets a chain id at an index.
  const getApiInstanceIndex = (index: number) => apiInstances[index];

  // Sets a chain id at an index.
  const setApiInstanceIndex = (index: number, instanceId: number) => {
    setApiInstances((prev) => ({
      ...prev,
      [index]: instanceId,
    }));
  };

  // Store chain spec of each api instance. NOTE: requires ref as it is used in event listener.
  const [chainSpecs, setChainSpecsState] = useState<ChainSpaceChainSpecs>({});
  const chainSpecsRef = useRef(chainSpecs);

  // Setter for chain spec. Updates state and ref.
  const setChainSpecs = (newChainSpec: ChainSpaceChainSpecs) => {
    setStateWithRef(newChainSpec, setChainSpecsState, chainSpecsRef);
  };

  // TODO: abstract this out.
  const relayChainSpec = Object.values(chainSpecs)?.[0];

  // The API status of the relay chain.
  const [relayApiStatus, setRelayApiStatus] =
    useState<ApiStatus>('disconnected');

  // Handle connecting to an api instance.
  const handleConnectApi = async (
    index: number,
    chainId: ChainId,
    provider: string
  ) => {
    closeMenu();

    if (!globalChainSpace) {
      return;
    }
    // If chain already exists, exit early.
    if (!apiInstances[index]) {
      return;
    }

    // Add api to chain space instance and return its instance id.
    const apiInstanceIndex = await globalChainSpace
      .getInstance()
      .addApi(chainId, provider);

    // Record this api instance.
    setApiInstanceIndex(index, apiInstanceIndex);
    setRelayApiStatus('connecting');
  };

  // Get relay api instance and its identifiers.
  const relayInstance = getRelayApi(tabId);
  const relayInstanceId = relayInstance?.instanceId;
  const relayInstanceIndex = getRelayInstanceIndex(tabId);

  // Get available imported accounts.
  const accounts =
    relayChainSpec && relayChainSpec.chain
      ? getAccounts(relayChainSpec.chain, relayChainSpec.ss58Prefix)
      : [];

  // Get tab account balances from `useActiveBalances`.
  const activeBalanceInstances = relayInstanceId
    ? {
        [relayInstanceId]: {
          accounts: accounts.map(({ address }) => address),
          apiStatus: relayApiStatus,
        },
      }
    : {};

  const activeBalances = useActiveBalances(activeBalanceInstances);

  // Handle incoming api status updates.
  const handleNewApiStatus = (e: Event): void => {
    if (isCustomEvent(e)) {
      const { ownerId, instanceId, chainId, event } =
        e.detail as APIStatusEventDetail;

      // Ensure we are handling the correct api instance here.
      if (ownerId === 'global' && instanceId === relayInstanceId) {
        switch (event) {
          case 'ready':
            setRelayApiStatus('ready');

            // Initialise account balance subscriptions.
            SubscriptionsController.set(
              instanceId,
              'accountBalances',
              new AccountBalances(ownerId, instanceId, chainId)
            );
            break;
          case 'connecting':
            setRelayApiStatus('connecting');
            break;
          case 'connected':
            setRelayApiStatus('connected');
            break;
          case 'disconnected':
            handleDisconnect();
            break;
          case 'error':
            handleDisconnect();
            break;
          case 'destroyed':
            handleDisconnect();
            break;
        }
      }
    }
  };

  // Handle incoming chain spec updates.
  const handleNewChainSpec = (e: Event): void => {
    if (isCustomEvent(e)) {
      const { instanceId, spec, consts } = e.detail;
      if (instanceId === relayInstanceId) {
        const updated = { ...chainSpecsRef.current };
        updated[instanceId] = { ...spec, consts };

        setChainSpecs(updated);
      }
    }
  };

  // Handle a chain disconnect.
  const handleDisconnect = () => {
    // Update API status to `disconnected`.
    setRelayApiStatus('disconnected');
    setChainSpecs({});
  };

  const documentRef = useRef<Document>(document);

  // Listen for api status updates.
  useEventListener('api-status', handleNewApiStatus, documentRef);

  // Listen for new chain spec updates.
  useEventListener('new-chain-spec', handleNewChainSpec, documentRef);

  // Update connection status when relay api instance is received.
  useEffect(() => {
    const status = relayInstance?.status || 'disconnected';
    setRelayApiStatus(status as ApiStatus);
  }, [relayInstanceId]);

  return (
    <ChainSpaceEnv.Provider
      value={{
        activeBalances,
        relayInstance,
        relayInstanceIndex,
        getApiInstanceIndex,
        setApiInstanceIndex,
        relayApiStatus,
        handleConnectApi,
      }}
    >
      {children}
    </ChainSpaceEnv.Provider>
  );
};
