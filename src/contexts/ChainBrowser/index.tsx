// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect } from 'react';
import type { ChainBrowserContextInterface } from './types';
import {
  defaultChainBrowserContext,
  defaultCustomEndpointChainMeta,
} from './defaults';
import { useTabs } from 'contexts/Tabs';
import type { ChainId } from 'config/networks';
import { NetworkDirectory } from 'config/networks';
import { isDirectoryId } from 'config/networks/Utils';
import type { ChainMeta, ConnectFrom, TabTask } from 'contexts/Tabs/types';
import { useSettings } from 'contexts/Settings';
import * as local from 'contexts/Tabs/Local';
import { useChainSpaceEnv } from 'contexts/ChainSpaceEnv';
import { tabIdToOwnerId } from 'contexts/Tabs/Utils';

export const ChainBrowser = createContext<ChainBrowserContextInterface>(
  defaultChainBrowserContext
);

export const useChainBrowser = () => useContext(ChainBrowser);

export const ChainBrowserProvider = ({ children }: { children: ReactNode }) => {
  const { autoTabNaming } = useSettings();
  const { handleConnectApi } = useChainSpaceEnv();
  const {
    tabs,
    tabsRef,
    getTab,
    setTabs,
    getTabTaskData,
    setTabTaskData,
    getAutoTabName,
  } = useTabs();

  // Connect tab to an Api instance and update its chain data.
  const connectChainBrowser = (
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
      const system = NetworkDirectory[chainId].system;
      chainMeta = {
        ss58: system.ss58,
        units: system.units,
        unit: system.unit,
      };
    } else {
      const localChain = local.getTabs()?.find(({ id }) => id === tabId)
        ?.taskData?.chain;
      chainMeta = localChain || defaultCustomEndpointChainMeta;
    }

    const chainData = {
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

  // Instantiate an Api instance from tab chain data.
  const instantiateApiFromTab = async (tabId: number) => {
    const tab = getTab(tabId);
    const taskData = getTabTaskData(tabId);

    if (
      tab?.activeTask === 'chainExplorer' &&
      taskData?.chain &&
      taskData?.autoConnect
    ) {
      handleConnectApi(
        tabIdToOwnerId(tabId),
        'chainExplorer',
        taskData.chain.id,
        taskData.chain.endpoint
      );
    }
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

  // Initialisation of Apis.
  useEffect(() => {
    // Instantiate Api instances from tabs.
    tabs.forEach((tab) => {
      if (tab.taskData?.autoConnect) {
        instantiateApiFromTab(tab.id);
      }
    });
  }, []);

  return (
    <ChainBrowser.Provider
      value={{
        getStoredChain,
        updateSs58,
        updateUnits,
        updateUnit,
        connectChainBrowser,
        instantiateApiFromTab,
        forgetTabChain,
      }}
    >
      {children}
    </ChainBrowser.Provider>
  );
};
