// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import type { ChainBrowserContextInterface } from './types';
import {
  defaultChainBrowserContext,
  defaultCustomEndpointChainMeta,
} from './defaults';
import { useTabs } from 'contexts/Tabs';
import type { ChainId, DirectoryId } from 'config/networks';
import { NetworkDirectory } from 'config/networks';
import { isDirectoryId } from 'config/networks/Utils';
import type {
  ChainMeta,
  ConnectFrom,
  TabChainData,
  TabTask,
} from 'contexts/Tabs/types';
import { useSettings } from 'contexts/Settings';
import * as local from 'contexts/Tabs/Local';
import { tabIdToOwnerId } from 'contexts/Tabs/Utils';
import { ApiController } from 'controllers/Api';

export const ChainBrowser = createContext<ChainBrowserContextInterface>(
  defaultChainBrowserContext
);

export const useChainBrowser = () => useContext(ChainBrowser);

export const ChainBrowserProvider = ({ children }: { children: ReactNode }) => {
  const { autoTabNaming } = useSettings();
  const { tabs, tabsRef, getTab, setTabs } = useTabs();

  // Gets the previously connected to chain from network directory, if present.
  const getStoredChain = (tabId: number) => {
    const tab = getTab(tabId);
    const chainId = tab?.taskData?.chain?.id;

    if (!chainId || !isDirectoryId(chainId)) {
      return undefined;
    }

    return { id: chainId, chain: NetworkDirectory[chainId] };
  };

  // Update the chain's `activeConnectFrom` in tab's taskData.
  const setTabConnectFrom = (id: number, connectFrom: ConnectFrom) => {
    const newTabs = tabs.map((tab) => {
      if (tab.id === id) {
        const updated = { ...tab };
        updated.ui.activeConnectFrom = connectFrom;
        return updated;
      } else {
        return tab;
      }
    });
    setTabs(newTabs);
  };

  // Connect tab to an Api instance and update its chain data.
  const connectTab = (tabId: number, chainId: ChainId, endpoint: string) => {
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
              autoTabNaming && isDirectory ? getAutoTabName(chainId) : tab.name,
            // Chain is now assigned the `chainBrowser` task.
            activeTask: 'chainBrowser' as TabTask,
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
    instantiateControllers(tabId, chainData);
  };

  // Instantiate an Api instance from tab chain data.
  const instantiateApiFromTab = async (tabId: number) => {
    const tab = getTab(tabId);
    if (
      tab?.activeTask === 'chainBrowser' &&
      tab?.taskData?.chain &&
      tab?.taskData?.autoConnect
    ) {
      // This api instance is about to be reconnected to, so the active task here needs to be
      // persisted.
      instantiateControllers(tab.id, tab?.taskData?.chain);
    }
  };

  // Instantiate controllers for a new tab.
  const instantiateControllers = async (tabId: number, chain: TabChainData) => {
    if (!chain) {
      return;
    }
    const ownerId = tabIdToOwnerId(tabId);
    const { id, endpoint } = chain;
    await ApiController.instantiate(ownerId, id, endpoint);
  };

  // Update the chain's ss58 prefix in tab's taskData.
  const updateSs58 = (id: number, ss58: number) => {
    const newTabs = tabs.map((tab) => {
      if (tab.id !== id) {
        const updated = { ...tab };
        if (updated.taskData?.chain) {
          updated.taskData.chain.ss58 = ss58;
        }
        return updated;
      }
      return tab;
    });
    setTabs(newTabs);
  };

  // Update the chain's units in tab's taskData.
  const updateUnits = (id: number, units: number) => {
    const newTabs = tabs.map((tab) => {
      if (tab.id !== id) {
        const updated = { ...tab };
        if (updated.taskData?.chain) {
          updated.taskData.chain.units = units;
        }
        return updated;
      }
      return tab;
    });
    setTabs(newTabs);
  };

  // Update the chain's unit in tab's taskData.
  const updateUnit = (id: number, unit: string) => {
    const newTabs = tabs.map((tab) => {
      if (tab.id !== id) {
        const updated = { ...tab };
        if (updated.taskData?.chain) {
          updated.taskData.chain.unit = unit;
        }
        return updated;
      }
      return tab;
    });
    setTabs(newTabs);
  };

  // Gets the amount of tab names starting with the provided string.
  const getTabNameCount = (name: string) =>
    tabs.filter((tab) => tab.name.startsWith(name)).length;

  // Generate tab name for chain.
  const getAutoTabName = (chainId: DirectoryId) => {
    const chainName = NetworkDirectory[chainId].name;
    const existingNames = getTabNameCount(chainName);
    const tabName =
      existingNames === 0 ? chainName : `${chainName} ${existingNames + 1}`;

    return tabName;
  };

  // Forget a tab's chain. NOTE: This function is called within event listeners, so tabsRef is used
  // to ensure the latest tabs config is used.
  const forgetTabChain = (tabId: number) => {
    // Disconnect from Api instance if present.
    if (getTab(tabId)?.taskData?.chain) {
      destroyControllers(tabId);
    }
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

  // Destroy controller instances for a tab.
  const destroyControllers = (tabId: number) => {
    const ownerId = tabIdToOwnerId(tabId);
    const tab = getTab(tabId);

    if (tab && tab.taskData?.chain) {
      ApiController.destroyAll(ownerId);
    }
  };

  return (
    <ChainBrowser.Provider
      value={{
        getStoredChain,
        updateSs58,
        updateUnits,
        updateUnit,
        setTabConnectFrom,
        connectTab,
        instantiateApiFromTab,
        forgetTabChain,
        destroyControllers,
      }}
    >
      {children}
    </ChainBrowser.Provider>
  );
};
