// Copyright 2024 @polkadot-cloud/developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import type { ChainExplorerContextInterface } from './types';
import {
  defaultChainExplorerContext,
  defaultCustomEndpointChainMeta,
} from './defaults';
import { useTabs } from 'contexts/Tabs';
import type { ChainId } from 'config/networks/types';
import { NetworkDirectory } from 'config/networks';
import { getChainMeta, isDirectoryId } from 'config/networks/Utils';
import type {
  ChainMeta,
  ConnectFrom,
  TabChainData,
  TabTask,
} from 'contexts/Tabs/types';
import { useSettings } from 'contexts/Settings';
import * as local from 'contexts/Tabs/Local';
import { useChainSpaceEnv } from 'contexts/ChainSpaceEnv';
import { tabIdToOwnerId } from 'contexts/Tabs/Utils';
import { useApiIndexer } from 'contexts/ApiIndexer';
import type { IntegrityCheckedChainContext } from 'routes/Chain/Provider/types';
import { useChainUi } from 'contexts/ChainUi';
import { useChainState } from 'contexts/ChainState';

export const ChainExplorer = createContext<ChainExplorerContextInterface>(
  defaultChainExplorerContext
);

export const useChainExplorer = () => useContext(ChainExplorer);

export const ChainExplorerProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const {
    tabs,
    tabsRef,
    setTabs,
    getTabTaskData,
    setTabTaskData,
    getAutoTabName,
  } = useTabs();
  const { autoTabNaming } = useSettings();
  const { destroyTabChainUi } = useChainUi();
  const { getTabApiIndex } = useApiIndexer();
  const { destroyTabChainState } = useChainState();
  const { handleConnectApi, getChainSpec, getApiInstanceById } =
    useChainSpaceEnv();

  // Connect tab to an Api instance and update its chain data.
  const connectChainExplorer = (
    tabId: number,
    chainId: ChainId,
    endpoint: string
  ) => {
    // Reset local active page on connect.
    local.setActivePage(tabId, 'default', 0);

    const isDirectory = isDirectoryId(chainId);

    // Inject chain meta from network directory or custom endpoint.
    let chainMeta: ChainMeta;
    if (isDirectory) {
      chainMeta = getChainMeta(chainId);
    } else {
      const localChain = local.getTabs()?.find(({ id }) => id === tabId)
        ?.taskData?.chain;
      chainMeta = localChain || defaultCustomEndpointChainMeta;
    }

    const chainData: TabChainData = {
      ...chainMeta,
      id: chainId,
      endpoint,
      api: { instanceIndex: 0 },
    };

    const newTabs = [...tabs].map((tab) =>
      tab.id === tabId
        ? {
            ...tab,
            // Auto rename the tab here if the setting is turned on.
            name:
              autoTabNaming && isDirectory
                ? getAutoTabName(tab.id, NetworkDirectory[chainId].name)
                : tab.name,
            // Chain is now assigned the `chainExplorer` task.
            activeTask: 'chainExplorer' as TabTask,
            taskData: {
              chain: chainData,
              connectFrom: isDirectory
                ? 'directory'
                : ('customEndpoint' as ConnectFrom),
              autoConnect: tab.ui.autoConnect,
            },
          }
        : tab
    );
    setTabs(newTabs);

    // Instantiate API instance.
    handleConnectApi(
      tabIdToOwnerId(tabId),
      'chainExplorer',
      chainData.id,
      chainData.endpoint
    );
  };

  // Gets the previously connected to chain from network directory, if present.
  const getStoredChain = (tabId: number) => {
    const taskData = getTabTaskData(tabId);
    const chainId = taskData?.chain?.id;

    if (!chainId || !isDirectoryId(chainId)) {
      return undefined;
    }
    return { id: chainId, chain: NetworkDirectory[chainId] };
  };

  // Update the chain's ss58 prefix in tab's taskData.
  const updateSs58 = (tabId: number, ss58: number) => {
    const taskData = getTabTaskData(tabId);
    if (taskData?.chain) {
      taskData.chain.ss58 = ss58;
      setTabTaskData(tabId, taskData);
    }
  };

  // Update the chain's units in tab's taskData.
  const updateUnits = (tabId: number, units: number) => {
    const taskData = getTabTaskData(tabId);
    if (taskData?.chain) {
      taskData.chain.units = units;
      setTabTaskData(tabId, taskData);
    }
  };

  // Update the chain's unit in tab's taskData.
  const updateUnit = (tabId: number, unit: string) => {
    const taskData = getTabTaskData(tabId);
    if (taskData?.chain) {
      taskData.chain.unit = unit;
      setTabTaskData(tabId, taskData);
    }
  };

  // Forget a tab's chain. NOTE: This function is called within event listeners, so tabsRef is used
  // to ensure the latest tabs config is used.
  const forgetTabChain = (tabId: number) => {
    // Update tab state.
    const newTabs = tabsRef.map((tab) => {
      if (tab.id === tabId) {
        const updated = { ...tab };

        if (updated.taskData) {
          updated.taskData.chain = undefined;
        }
        return updated;
      } else {
        return tab;
      }
    });
    setTabs(newTabs);
  };

  // Check that the correct state exists for chain explorer task to be active.
  const chainExplorerIntegrityCheck = (
    tabId: number
  ): IntegrityCheckedChainContext | false => {
    const ownerId = tabIdToOwnerId(tabId);
    const taskData = getTabTaskData(tabId);
    const chain = taskData?.chain;

    // Ensure that tab `taskData` contains a `chain` object.
    if (!chain) {
      return false;
    }

    // Ensure that the api indexer has an active index for the `chainExplorer` task for this tab.
    const instanceId = getTabApiIndex(ownerId, 'chainExplorer')?.instanceId;
    if (!instanceId) {
      return false;
    }

    // Ensure that there is a chainSpec for the chain.
    const chainSpec = getChainSpec(instanceId);
    if (!chainSpec) {
      return false;
    }

    // Ensure that there is an active `ApiPromise` for the instance id.
    const api = getApiInstanceById(instanceId)?.api;
    if (!api) {
      return false;
    }

    return {
      chain,
      chainSpec,
      instanceId,
      api,
    };
  };

  // Remove task related state on disconnect.
  const removeChainExplorerTaskState = (tabId: number) => {
    destroyTabChainUi(tabId);
    destroyTabChainState();
  };

  return (
    <ChainExplorer.Provider
      value={{
        getStoredChain,
        updateSs58,
        updateUnits,
        updateUnit,
        forgetTabChain,
        connectChainExplorer,
        chainExplorerIntegrityCheck,
        removeChainExplorerTaskState,
      }}
    >
      {children}
    </ChainExplorer.Provider>
  );
};
