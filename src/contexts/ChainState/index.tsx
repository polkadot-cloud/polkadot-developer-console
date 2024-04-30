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
  ChainStateConstants,
  ChainStateContextInterface,
  ChainStateSubscriptions,
} from './types';
import type { AnyJson } from '@w3ux/utils/types';
import { useEventListener } from 'usehooks-ts';
import { isCustomEvent } from 'Utils';
import { useTabs } from 'contexts/Tabs';
import { ChainStateController } from 'controllers/ChainState';
import { setStateWithRef } from '@w3ux/utils';
import type {
  StorageSubscriptionType,
  StorageType,
} from 'model/ChainState/types';
import { tabIdToOwnerId } from 'contexts/Tabs/Utils';

export const ChainState = createContext<ChainStateContextInterface>(
  defaultChainStateContext
);

export const useChainState = () => useContext(ChainState);

export const ChainStateProvider = ({ children }: { children: ReactNode }) => {
  const { selectedTabId } = useTabs();

  // The results of current chain state subscriptions.
  const [chainStateSubscriptions, setChainStateSubscriptions] =
    useState<ChainStateSubscriptions>(
      ChainStateController.instances?.[tabIdToOwnerId(selectedTabId)]
        ?.subscriptions || {}
    );
  const chainStateSubscriptionsRef = useRef(chainStateSubscriptions);

  // The results of current chain state constants.
  const [chainStateConstants, setChainStateConstants] =
    useState<ChainStateConstants>(
      ChainStateController.instances?.[tabIdToOwnerId(selectedTabId)]
        ?.constants || {}
    );

  // Get a chain state subscription by key.
  const getChainStateItem = (key: string) =>
    chainStateSubscriptions?.[key] || null;

  // Set a chain state subscription by key.
  const setChainStateItem = (
    type: StorageSubscriptionType,
    subscriptionKey: string,
    result: AnyJson
  ) => {
    setStateWithRef(
      {
        ...chainStateSubscriptionsRef.current,
        [subscriptionKey]: { type, result },
      },
      setChainStateSubscriptions,
      chainStateSubscriptionsRef
    );
  };

  // Store chain state subscription results as they are received.
  const handleNewChainState = (e: Event) => {
    if (isCustomEvent(e)) {
      const { ownerId, type, subscriptionKey, result } = e.detail;

      if (ownerId === tabIdToOwnerId(selectedTabId)) {
        setChainStateItem(type, subscriptionKey, result);
      }
    }
  };

  // Get chain state by type.
  const getChainStateByType = (type: StorageSubscriptionType) => {
    // Note that undefined results are also being removed, which could be present as a result of a
    // temporary invalid subscription.
    const filteredEntries = Object.entries(chainStateSubscriptions).filter(
      ([, subscription]) =>
        subscription.type === type && subscription.result !== undefined
    );
    return Object.fromEntries(filteredEntries);
  };

  // Remove a subscription from chain state.
  const removeChainStateItem = (type: StorageType, key: string) => {
    // Handle removal of chain state subscription.
    if (['storage', 'raw'].includes(type)) {
      // Remove key and unsubscribe from controller.
      ChainStateController.instances?.[
        tabIdToOwnerId(selectedTabId)
      ].unsubscribeOne(key);
      // Remove key from context chain state.
      const updatedChainState = { ...chainStateSubscriptions };
      delete updatedChainState[key];

      setStateWithRef(
        updatedChainState,
        setChainStateSubscriptions,
        chainStateSubscriptionsRef
      );
    }

    // Handle removal of chain state constant.
    if (type === 'constant') {
      const updated = { ...chainStateConstants };
      delete updated[key];
      setChainStateConstants(updated);
      ChainStateController.instances?.[
        tabIdToOwnerId(selectedTabId)
      ].removeConstant(key);
    }
  };

  // Set a new constant for a tab and key.
  const setConstant = (key: string, value: AnyJson) => {
    const updated = { ...chainStateConstants };
    updated[key] = value;
    setChainStateConstants(updated);
  };

  const documentRef = useRef(document);
  useEventListener(
    'callback-new-chain-state',
    handleNewChainState,
    documentRef
  );

  // Get chain state on mount and selected tab change.
  useEffect(() => {
    setStateWithRef(
      ChainStateController.instances?.[tabIdToOwnerId(selectedTabId)]
        ?.subscriptions || {},
      setChainStateSubscriptions,
      chainStateSubscriptionsRef
    );
    setChainStateConstants(
      ChainStateController.instances?.[tabIdToOwnerId(selectedTabId)]
        ?.constants || {}
    );
  }, [selectedTabId]);

  return (
    <ChainState.Provider
      value={{
        getChainStateByType,
        getChainStateItem,
        removeChainStateItem,
        chainStateConstants,
        setConstant,
      }}
    >
      {children}
    </ChainState.Provider>
  );
};
