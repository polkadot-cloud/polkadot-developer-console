// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { defaultChainStateContext } from './defaults';
import type {
  ChainStateContextInterface,
  ChainStateSubscriptions,
} from './types';
import type { AnyJson } from '@w3ux/utils/types';
import { useEventListener } from 'usehooks-ts';
import { isCustomEvent } from 'Utils';
import { useTabs } from 'contexts/Tabs';
import { ChainStateController } from 'controllers/ChainState';
import { setStateWithRef } from '@w3ux/utils';
import type { StorageSubscriptionType } from 'model/ChainState/types';

export const ChainState = createContext<ChainStateContextInterface>(
  defaultChainStateContext
);

export const useChainState = () => useContext(ChainState);

export const ChainStateProvider = ({ children }: { children: ReactNode }) => {
  const { selectedTabId } = useTabs();

  // The results of current chain state subscriptions.
  const [chainStateSubscriptions, setChainStateSubscriptions] =
    useState<ChainStateSubscriptions>(
      ChainStateController.instances?.[selectedTabId]?.results || {}
    );
  const chainStateSubscriptionsRef = useRef(chainStateSubscriptions);

  // Get a chain state subscription by key.
  const getChainStateItem = (key: string) =>
    chainStateSubscriptions?.[key] || null;

  // Set a chain state subscription by key.
  const setChainStateItem = (
    type: StorageSubscriptionType,
    subscriptionKey: string,
    result: AnyJson
  ) => {
    setChainStateSubscriptions({
      ...chainStateSubscriptionsRef.current,
      [subscriptionKey]: { type, result },
    });
  };

  // Store chain state subscription results as they are received.
  const handleNewChainState = (e: Event) => {
    if (isCustomEvent(e)) {
      const { tabId, type, subscriptionKey, result } = e.detail;

      if (tabId === selectedTabId) {
        setChainStateItem(type, subscriptionKey, result);
      }
    }
  };

  // Get chain state by type.
  const getChainStateByType = (type: StorageSubscriptionType) => {
    const filteredEntries = Object.entries(chainStateSubscriptions).filter(
      ([, subscription]) => subscription.type === type
    );
    return Object.fromEntries(filteredEntries);
  };

  const documentRef = useRef(document);
  useEventListener(
    'callback-new-chain-state',
    handleNewChainState,
    documentRef
  );

  // Get chain state on mount and selected tab change.
  useEffect(() => {
    const tabChainState =
      ChainStateController.instances?.[selectedTabId]?.results || {};

    setStateWithRef(
      tabChainState,
      setChainStateSubscriptions,
      chainStateSubscriptionsRef
    );
  }, [selectedTabId]);

  return (
    <ChainState.Provider
      value={{
        getChainStateByType,
        getChainStateItem,
      }}
    >
      {children}
    </ChainState.Provider>
  );
};
