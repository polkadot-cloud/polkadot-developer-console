// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useTabs } from 'contexts/Tabs';
import { useEventListener } from 'usehooks-ts';
import { isCustomEvent } from 'Utils';
import type {
  APIStatusEventDetail,
  ApiInstanceId,
  ApiStatusState,
} from 'model/Api/types';
import { NotificationsController } from 'controllers/Notifications';
import { SubscriptionsController } from 'controllers/Subscriptions';
import { BlockNumber } from 'model/BlockNumber';
import { AccountBalances } from 'model/AccountBalances';
import { setStateWithRef } from '@w3ux/utils';
import { ownerIdToTabId } from 'contexts/Tabs/Utils';
import type { OwnerId } from 'types';
import { useChainBrowser } from 'contexts/ChainBrowser';
import type { AnyJson } from '@w3ux/utils/types';

export const Api = createContext<AnyJson>({});

export const useApi = () => useContext(Api);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const { tabs } = useTabs();
  const { instantiateApiFromTab, forgetTabChain } = useChainBrowser();

  // Store API connection status of each api instance. NOTE: requires ref as it is used in event
  // listener.
  const [apiStatus, setApiStatusState] = useState<ApiStatusState>({});
  const apiStatusRef = useRef(apiStatus);

  // Setter for api status. Updates state and ref.
  const setApiStatus = (newApiStatus: ApiStatusState) => {
    setStateWithRef(newApiStatus, setApiStatusState, apiStatusRef);
  };

  // Remove api status for an instance.
  const removeApiStatus = (instanceId: ApiInstanceId) => {
    const updated = { ...apiStatusRef.current };
    delete updated[instanceId];
    setApiStatus(updated);
  };

  // Handle a chain error.
  const handleChainError = (ownerId: OwnerId, instanceId: ApiInstanceId) => {
    removeApiStatus(instanceId);

    // If the error originated from initialization or bootstrapping of metadata, assume the
    // connection is an invalid chain and forget it. This prevents auto connect on subsequent
    // visits.

    // If this owner is a tab, disconnect and forget the chain.
    if (ownerId.startsWith('tab_')) {
      // NOTE: this will no longer destroy the api instance.
      forgetTabChain(ownerIdToTabId(ownerId));
    }
    NotificationsController.emit({
      title: 'Error Initializing Chain',
      subtitle: `Failed to initialize the chain.`,
    });
  };

  // Handle incoming api status updates.
  const handleNewApiStatus = (e: Event): void => {
    if (isCustomEvent(e)) {
      const { ownerId, instanceId, chainId, event } =
        e.detail as APIStatusEventDetail;

      switch (event) {
        case 'ready':
          setApiStatus({
            ...apiStatusRef.current,
            [instanceId]: 'ready',
          });

          // Initialise subscriptions for Overview here. We are currently only subscribing to the
          // block number.
          SubscriptionsController.set(
            instanceId,
            'blockNumber',
            new BlockNumber(ownerId, instanceId, chainId)
          );

          // Initialise account balance subscriptions.
          SubscriptionsController.set(
            instanceId,
            'accountBalances',
            new AccountBalances(ownerId, instanceId, chainId)
          );

          break;
        case 'connecting':
          setApiStatus({ ...apiStatusRef.current, [instanceId]: 'connecting' });
          break;
        case 'connected':
          setApiStatus({ ...apiStatusRef.current, [instanceId]: 'connected' });
          break;
        case 'error':
          handleChainError(ownerId, instanceId);
          break;
      }
    }
  };

  const documentRef = useRef<Document>(document);

  // Listen for api status updates.
  useEventListener('api-status', handleNewApiStatus, documentRef);

  // Initialisation of Api.
  useEffect(() => {
    // Instantiate Api instances from tabs.
    tabs.forEach((tab) => {
      if (tab.taskData?.autoConnect) {
        instantiateApiFromTab(tab.id);
      }
    });
  }, []);

  return <Api.Provider value={{}}>{children}</Api.Provider>;
};
