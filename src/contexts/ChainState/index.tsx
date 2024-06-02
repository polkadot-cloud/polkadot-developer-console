// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { defaultChainStateContext } from './defaults';
import type {
  ChainStateConstants,
  ChainStateContextInterface,
  ChainStateSubscriptionEventDetail,
  ChainStateSubscriptions,
} from './types';
import { useEventListener } from 'usehooks-ts';
import { isCustomEvent } from 'Utils';
import { ChainStateController } from 'controllers/ChainState';
import { setStateWithRef } from '@w3ux/utils';
import type {
  ChainStateConstantEventDetail,
  ChainStateEventDetail,
  ConstantEntry,
  StorageSubscriptionType,
  StorageType,
} from 'model/ChainState/types';
import { useActiveTab } from 'contexts/ActiveTab';
import { useEffectIgnoreInitial } from '@w3ux/hooks';
import * as local from './Local';
import { useApiIndexer } from 'contexts/ApiIndexer';
import { checkLocalChainState } from 'IntegrityChecks/Local';

checkLocalChainState();

export const ChainState = createContext<ChainStateContextInterface>(
  defaultChainStateContext
);

export const useChainState = () => useContext(ChainState);

export const ChainStateProvider = ({ children }: { children: ReactNode }) => {
  const { tabId, ownerId } = useActiveTab();
  const { getTabApiIndex } = useApiIndexer();

  const tabApiIndex = getTabApiIndex(ownerId, 'chainExplorer');
  const instanceId = tabApiIndex?.instanceId;

  // The results of current chain state subscriptions, keyed by subscription key.
  const [chainStateSubscriptions, setChainStateSubscriptionsState] =
    useState<ChainStateSubscriptions>({});
  const chainStateSubscriptionsRef = useRef(chainStateSubscriptions);

  // Sets chain state subscriptions to state, ref and local storage.
  const setChainStateSubscriptions = (value: ChainStateSubscriptions) => {
    local.setChainStateSubscriptions(ownerId, value);
    setStateWithRef(
      value,
      setChainStateSubscriptionsState,
      chainStateSubscriptionsRef
    );
  };

  // The results of current chain state constants, keyed by subscription key.
  const [chainStateConstants, setChainStateConstantsState] =
    useState<ChainStateConstants>({});
  const chainStateConstantsRef = useRef(chainStateConstants);

  // Sets constants to state and local storage.
  const setChainStateConstants = (value: ChainStateConstants) => {
    local.setChainStateConstants(ownerId, value);
    setStateWithRef(value, setChainStateConstantsState, chainStateConstantsRef);
  };

  // Get a chain state subscription by key.
  const getChainStateItem = (key: string) =>
    chainStateSubscriptions?.[key] || null;

  // Set a chain state subscription by key.
  const setChainStateItem = (item: ChainStateSubscriptionEventDetail) => {
    const { key, ...rest } = item;
    const current = chainStateSubscriptionsRef.current[key];

    setChainStateSubscriptions({
      ...chainStateSubscriptionsRef.current,
      [key]: { ...rest, pinned: current?.pinned || item?.pinned || false },
    });
  };

  // Set a new constant for a tab and key.
  const setConstant = (key: string, value: ConstantEntry) => {
    const updated = { ...chainStateConstantsRef.current };
    const current = updated[key];

    const pinned = value?.pinned || current?.pinned || false;

    updated[key] = { ...value, pinned };
    setChainStateConstants(updated);
  };

  // Get chain state by type.
  const getChainStateByType = (type: StorageSubscriptionType | undefined) => {
    // Note that undefined results are also being removed, which could be present as a result of a
    // temporary invalid subscription.
    const filteredEntries = Object.entries(chainStateSubscriptions).filter(
      ([, subscription]) => {
        if (subscription.result === undefined) {
          return false;
        }

        if (type === undefined) {
          return true;
        }

        return subscription.type === type;
      }
    );

    return Object.fromEntries(filteredEntries);
  };

  // Remove a subscription from chain state.
  const removeChainStateItem = (type: StorageType, key: string) => {
    if (!instanceId) {
      return;
    }

    // Handle removal of chain state subscription.
    if (['storage', 'raw'].includes(type)) {
      // Remove key and unsubscribe from controller.
      ChainStateController.instances?.[instanceId]?.unsubscribeOne(key);
      // Remove key from context chain state.
      const updatedChainState = { ...chainStateSubscriptions };
      delete updatedChainState[key];

      setChainStateSubscriptions(updatedChainState);
    }

    // Handle removal of chain state constant.
    if (type === 'constant') {
      const updated = { ...chainStateConstants };
      delete updated[key];
      setChainStateConstants(updated);
      ChainStateController.instances?.[instanceId].removeConstant(key);
    }
  };

  // Get total result items.
  const getTotalChainStateItems = () =>
    Object.keys(chainStateSubscriptions).length +
    Object.keys(chainStateConstants).length;

  // Get total items that are pinned.
  const getTotalPinnedItems = () =>
    Object.values(chainStateSubscriptions).filter(({ pinned }) => pinned)
      .length +
    Object.values(chainStateConstants).filter(({ pinned }) => pinned).length;

  // Store chain state subscription results as they are received.
  const handleNewChainState = (e: Event) => {
    if (isCustomEvent(e)) {
      const {
        ownerId: detailOwnerId,
        instanceId: detailInstanceId,
        ...rest
      }: ChainStateEventDetail = e.detail;

      if (ownerId === detailOwnerId && instanceId === detailInstanceId) {
        setChainStateItem(rest);
      }
    }
  };

  // Store chain state constant as they are received. Used for initialising constants from local
  // storage.
  const handleNewConstant = (e: Event) => {
    if (isCustomEvent(e)) {
      const {
        ownerId: detailOwnerId,
        instanceId: detailInstanceId,
        key,
        ...rest
      }: ChainStateConstantEventDetail = e.detail;

      if (ownerId === detailOwnerId && instanceId === detailInstanceId) {
        setConstant(key, rest);
      }
    }
  };

  const documentRef = useRef(document);
  useEventListener(
    'callback-new-chain-state-subscription',
    handleNewChainState,
    documentRef
  );

  useEventListener(
    'callback-new-chain-state-constant',
    handleNewConstant,
    documentRef
  );

  // Set pinned for a chain state item.
  const setItemPinned = (
    type: StorageType,
    subscriptionKey: string,
    pinned: boolean
  ) => {
    const entries =
      type === 'constant'
        ? { ...chainStateConstants }
        : { ...chainStateSubscriptions };

    const updated = Object.fromEntries(
      Object.entries(entries).map(([key, value]) =>
        subscriptionKey === key
          ? [
              key,
              {
                ...value,
                pinned,
              },
            ]
          : [key, value]
      )
    );

    if (type === 'constant') {
      setChainStateConstants(updated as ChainStateConstants);
    } else {
      setChainStateSubscriptions(updated as ChainStateSubscriptions);
    }
  };

  // Reset state for a tab.
  const destroyTabChainState = () => {
    if (!instanceId) {
      return;
    }
    // Destroy API instance.
    ChainStateController.destroy(instanceId);

    // Reset state.
    setChainStateSubscriptions({});
    setChainStateConstants({});
  };

  // Get chain state on tab change.
  useEffectIgnoreInitial(() => {
    if (!instanceId) {
      return;
    }

    setChainStateSubscriptions(
      ChainStateController.getSubscriptions(instanceId)
    );
    setChainStateConstants(ChainStateController.getConstants(instanceId));
  }, [tabId]);

  return (
    <ChainState.Provider
      value={{
        getChainStateByType,
        getChainStateItem,
        removeChainStateItem,
        chainStateConstants,
        getTotalChainStateItems,
        setConstant,
        setItemPinned,
        getTotalPinnedItems,
        destroyTabChainState,
      }}
    >
      {children}
    </ChainState.Provider>
  );
};
