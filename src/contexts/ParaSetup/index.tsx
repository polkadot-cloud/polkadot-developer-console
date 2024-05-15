// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import type {
  ParaSetupContextInterface,
  SelectedRelayChains,
  SetupStep,
  SetupStepsState,
} from './types';
import { defaultParaSetupContext } from './defaults';
import type { ChainId, DirectoryId } from 'config/networks/types';
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
  const { getChainSpec, handleConnectApi } = useChainSpaceEnv();
  const { tabs, setTabs, setTabActiveTask, getAutoTabName, getTabTaskData } =
    useTabs();

  // Store the active setup step for a tab.
  const [activeSteps, setActiveSteps] = useState<SetupStepsState>({});

  // Store selected relay chains, keyed by tab.
  const [selectedRelayChains, setSelectedRelayChains] =
    useState<SelectedRelayChains>({});

  // Get the selected relay chain for a tab.
  const getSelectedRelayChain = (tabId: number) => selectedRelayChains[tabId];

  // Set the selected relay chain for a tab.
  const setSelectedRelayChain = (tabId: number, chainId: ChainId) => {
    setSelectedRelayChains({
      ...selectedRelayChains,
      [tabId]: chainId,
    });
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

    const updatedChains = { ...selectedRelayChains };
    delete updatedChains[tabId];
    setSelectedRelayChains(updatedChains);
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

    // Ensure that the api indexer has an active index for the `parachainSetup:relay` instance for
    // this tab.
    const apiInstanceId = getTabApiIndex(
      ownerId,
      'parachainSetup:relay'
    )?.instanceId;
    if (!apiInstanceId) {
      return false;
    }

    // Ensure that there is a chainSpec for the chain.
    const chainSpec = getChainSpec(apiInstanceId);
    if (!chainSpec) {
      return false;
    }

    return {
      chainSpec,
      apiInstanceId,
    };
  };

  // Connects a tab to this task.
  const handleConnectTask = async (
    tabId: number,
    chainId: ChainId,
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
              autoConnect: tab.ui.autoConnect,
            },
          }
        : tab
    );

    setTabs(newTabs);

    // Connect to api instance.
    await handleConnectApi(
      tabIdToOwnerId(tabId),
      'parachainSetup:relay',
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
