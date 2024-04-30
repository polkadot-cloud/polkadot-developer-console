// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { defaultApiContext } from './defaults';
import type { ApiContextInterface } from './types';
import { ApiController } from 'controllers/Api';
import { useTabs } from 'contexts/Tabs';
import { useEventListener } from 'usehooks-ts';
import { isCustomEvent } from 'Utils';
import type {
  APIChainSpec,
  APIStatusEventDetail,
  ApiStatus,
  ApiStatusState,
  ChainSpecState,
  ErrDetail,
  OwnerId,
} from 'model/Api/types';
import { useChainUi } from 'contexts/ChainUi';
import { NotificationsController } from 'controllers/Notifications';
import { SubscriptionsController } from 'controllers/Subscriptions';
import { BlockNumber } from 'model/BlockNumber';
import { AccountBalances } from 'model/AccountBalances';
import { setStateWithRef } from '@w3ux/utils';
import { ownerIdToTabId } from 'contexts/Tabs/Utils';

export const Api = createContext<ApiContextInterface>(defaultApiContext);

export const useApi = () => useContext(Api);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const { fetchPalletVersions } = useChainUi();
  const {
    tabs,
    getActiveTab,
    forgetTabChain,
    instantiateApiFromTab,
    setTabForceDisconnect,
  } = useTabs();

  // Store API connection status of each api instance. NOTE: requires ref as it is used in event
  // listener.
  const [apiStatus, setApiStatusState] = useState<ApiStatusState>({});
  const apiStatusRef = useRef(apiStatus);

  // Setter for api status. Updates state and ref.
  const setApiStatus = (newApiStatus: Record<OwnerId, ApiStatus>) => {
    setStateWithRef(newApiStatus, setApiStatusState, apiStatusRef);
  };

  // Store chain spec of each api instance. NOTE: requires ref as it is used in event listener.
  const [chainSpec, setChainSpecState] = useState<ChainSpecState>({});
  const chainSpecRef = useRef(chainSpec);

  // Setter for chain spec. Updates state and ref.
  const setChainSpec = (status: Record<number, APIChainSpec>) => {
    setStateWithRef(status, setChainSpecState, chainSpecRef);
  };

  // Remove api status for an owner.
  const removeApiStatus = (ownerId: OwnerId) => {
    const updated = { ...apiStatusRef.current };
    delete updated[ownerId];
    setApiStatus(updated);
  };

  // Remove tab chain spec.
  const removeChainSpec = (ownerId: OwnerId) => {
    const updated = { ...chainSpecRef.current };
    delete updated[ownerId];
    setChainSpec(updated);
  };

  // Gets an api status, keyed by owner.
  const getApiStatus = (ownerId: OwnerId): ApiStatus => apiStatus[ownerId];

  // Gets whether an api is active (not disconnected or undefined).
  const getApiActive = (ownerId: OwnerId): boolean => {
    const status = getApiStatus(ownerId);
    return (
      status === 'ready' || status === 'connected' || status === 'connecting'
    );
  };

  // Gets a chain spec, keyed by owner.
  const getChainSpec = (ownerId: OwnerId): APIChainSpec => chainSpec[ownerId];

  // Gets the `Api` instance of the active tab, if present.
  const getTabApi = () => {
    const activeTab = getActiveTab();
    if (activeTab?.chain) {
      return ApiController.instances[String(activeTab.id)];
    }
  };

  // Handle a chain disconnect.
  const handleDisconnect = (ownerId: OwnerId, destroy = false) => {
    if (destroy) {
      removeApiStatus(ownerId);
      removeChainSpec(ownerId);
    } else {
      // Update API status to `disconnected`.
      setApiStatus({ ...apiStatusRef.current, [ownerId]: 'disconnected' });
    }
  };

  // Handle a chain error.
  const handleChainError = (ownerId: OwnerId, err?: ErrDetail) => {
    removeApiStatus(ownerId);
    removeChainSpec(ownerId);

    // If the error originated from initialization or bootstrapping of metadata, assume the
    // connection is an invalid chain and forget it. This prevents auto connect on subsequent
    // visits.
    if (err && ['InitializationError', 'ChainSpecError'].includes(err)) {
      // TODO: Test if owner is a tab first. Requires refactoring of `tabIdToOwnerId`.
      forgetTabChain(ownerIdToTabId(ownerId));
      setTabForceDisconnect(ownerIdToTabId(ownerId), true);

      NotificationsController.emit({
        title: 'Error Initializing Chain',
        subtitle: `Failed to initialize the chain.`,
      });
    }
  };

  // Handle incoming api status updates.
  const handleNewApiStatus = (e: Event): void => {
    if (isCustomEvent(e)) {
      const { ownerId, chainId, event, err } = e.detail as APIStatusEventDetail;

      switch (event) {
        case 'ready':
          setApiStatus({
            ...apiStatusRef.current,
            [ownerId]: 'ready',
          });

          // Initialise subscriptions for Overview here. We are currently only subscribing to the
          // block number. NOTE: SubscriptionsController is currently only assuming one `chainId`
          // per tab. This needs to change for parachain setup. TODO: SubscriptionsController to
          // handle multiple chainIds per tab.
          SubscriptionsController.set(
            ownerId,
            'blockNumber',
            new BlockNumber(ownerId, chainId)
          );

          // Initialise account balance subscriptions.
          SubscriptionsController.set(
            ownerId,
            'accountBalances',
            new AccountBalances(ownerId, chainId)
          );

          break;
        case 'connecting':
          setApiStatus({ ...apiStatusRef.current, [ownerId]: 'connecting' });
          break;
        case 'connected':
          setApiStatus({ ...apiStatusRef.current, [ownerId]: 'connected' });
          break;
        case 'disconnected':
          handleDisconnect(ownerId);
          break;
        case 'error':
          handleChainError(ownerId, err);
          break;
        case 'destroyed':
          handleDisconnect(ownerId, true);
          break;
      }
    }
  };

  // Handle incoming chain spec updates.
  const handleNewChainSpec = (e: Event): void => {
    if (isCustomEvent(e)) {
      const { ownerId, spec, consts } = e.detail;

      setChainSpec({
        ...chainSpecRef.current,
        [ownerId]: { ...spec, consts },
      });

      // Fetch pallet versions for ChainUi state.
      fetchPalletVersions(
        ownerId,
        spec.metadata,
        ApiController.instances[ownerId].api
      );
    }
  };

  const documentRef = useRef<Document>(document);

  // Listen for api status updates.
  useEventListener('api-status', handleNewApiStatus, documentRef);

  // Listen for new chain spec updates.
  useEventListener('new-chain-spec', handleNewChainSpec, documentRef);

  // Initialisation of Api.
  useEffect(() => {
    // Instantiate Api instances from tabs.
    tabs.forEach((tab) => {
      if (tab.autoConnect) {
        instantiateApiFromTab(tab.id);
      }
    });
  }, []);

  return (
    <Api.Provider
      value={{
        getApiStatus,
        getApiActive,
        getTabApi,
        getChainSpec,
      }}
    >
      {children}
    </Api.Provider>
  );
};
