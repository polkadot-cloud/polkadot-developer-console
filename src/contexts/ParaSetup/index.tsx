// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import type {
  ParaSetupContextInterface,
  ParachainSetupTaskData,
  SetupStep,
  SetupStepsState,
} from './types';
import { defaultParaSetupContext } from './defaults';
import type { DirectoryId } from 'config/networks/types';
import { tabIdToOwnerId } from 'contexts/Tabs/Utils';
import { useChainSpaceEnv } from 'contexts/ChainSpaceEnv';
import { useApiIndexer } from 'contexts/ApiIndexer';
import type { IntegrityCheckedParachainContext } from 'routes/ParachainSetup/Provider/types';
import * as localTabs from 'contexts/Tabs/Local';
import { useTabs } from 'contexts/Tabs';
import { useSettings } from 'contexts/Settings';
import { getChainMeta } from 'config/networks/Utils';
import type { ConnectFrom, TabChainData, TabTask } from 'contexts/Tabs/types';

export const ParaSetupContext = createContext<ParaSetupContextInterface>(
  defaultParaSetupContext
);

export const useParaSetup = () => useContext(ParaSetupContext);

export const ParaSetupProvider = ({ children }: { children: ReactNode }) => {
  const { autoTabNaming } = useSettings();
  const { getTabApiIndex } = useApiIndexer();
  const { getChainSpec, handleConnectApi, getApiInstanceById } =
    useChainSpaceEnv();
  const {
    tabs,
    setTabs,
    getAutoTabName,
    getTabTaskData,
    setTabTaskData,
    setTabActiveTask,
  } = useTabs();

  // Store the active setup step for a tab.
  const [activeSteps, setActiveSteps] = useState<SetupStepsState>({});

  // Get the selected relay chain for a tab.
  const getSelectedRelayChain = (tabId: number) => {
    const taskData = getTabTaskData(tabId) as ParachainSetupTaskData;
    return taskData.selectedRelayChain;
  };

  // Set the selected relay chain for a tab.
  const setSelectedRelayChain = (tabId: number, chainId: DirectoryId) => {
    const updated = (getTabTaskData(tabId) as ParachainSetupTaskData) || {};
    updated.selectedRelayChain = chainId;
    setTabTaskData(tabId, updated);
  };

  // Get the active step for a tab id, or 1 otherwise.
  const getActiveStep = (tabId: number) =>
    activeSteps[tabId] || 'connect_relay';

  // Set an active step for a tab id.
  const setActiveStep = (tabId: number, step: SetupStep) => {
    setActiveSteps((prev) => ({
      ...prev,
      [tabId]: step,
    }));
  };

  // Destroy parachain setup state associated with a tab. Currently only being used on tab close.
  const destroyTabParaSetup = (tabId: number) => {
    const updated = { ...activeSteps };
    delete updated[tabId];
    setActiveSteps(updated);
  };

  // Check that the correct state exists for parachain setup task to be active.
  const setupParachainIntegrityCheck = (
    tabId: number
  ): IntegrityCheckedParachainContext | false => {
    const ownerId = tabIdToOwnerId(tabId);
    const taskData = getTabTaskData(tabId);
    const chain = taskData?.chain;

    // Ensure that tab `taskData` contains a `chain` object.
    if (!chain) {
      return false;
    }

    // Ensure that the api indexer has an active index for the `parachainSetup` instance for
    // this tab.
    const instanceId = getTabApiIndex(ownerId, 'parachainSetup')?.instanceId;
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

  // Connects a tab to this task.
  const handleConnectTask = async (
    tabId: number,
    chainId: DirectoryId,
    endpoint: string
  ) => {
    // Reset local active page on connect.
    localTabs.setActivePage(tabId, 'default', 0);

    // Store the selected relay chain to state.
    setSelectedRelayChain(tabId, chainId);

    // Update tab task.
    setTabActiveTask(tabId, 'parachainSetup');

    // Get chain metadata.
    const chainMeta = getChainMeta(chainId as DirectoryId);

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
            name: autoTabNaming
              ? getAutoTabName(tab.id, 'Parachain Setup')
              : tab.name,
            // Chain is now assigned the `chainExplorer` task.
            activeTask: 'parachainSetup' as TabTask,
            taskData: {
              chain: chainData,
              connectFrom: 'directory' as ConnectFrom,
              autoConnect: true,
              selectedRelayChain: chainId,
            },
          }
        : tab
    );

    setTabs(newTabs);

    // Connect to api instance.
    await handleConnectApi(
      tabIdToOwnerId(tabId),
      'parachainSetup',
      chainId,
      endpoint
    );
  };

  return (
    <ParaSetupContext.Provider
      value={{
        handleConnectTask,
        getActiveStep,
        setActiveStep,
        getSelectedRelayChain,
        setSelectedRelayChain,
        destroyTabParaSetup,
        setupParachainIntegrityCheck,
      }}
    >
      {children}
    </ParaSetupContext.Provider>
  );
};
