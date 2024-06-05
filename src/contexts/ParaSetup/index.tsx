// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import type {
  ParaSetupContextInterface,
  ParachainSetupTaskData,
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
import { useEventListener } from 'usehooks-ts';
import { isCustomEvent } from 'Utils';
import { useActiveTab } from 'contexts/ActiveTab';

export const ParaSetupContext = createContext<ParaSetupContextInterface>(
  defaultParaSetupContext
);

export const useParaSetup = () => useContext(ParaSetupContext);

export const ParaSetupProvider = ({ children }: { children: ReactNode }) => {
  const {
    tabs,
    setTabs,
    getAutoTabName,
    getTabTaskData,
    setTabTaskData,
    setTabActiveTask,
  } = useTabs();
  const { tab } = useActiveTab();
  const { autoTabNaming } = useSettings();
  const { getTabApiIndex } = useApiIndexer();
  const { getChainSpec, handleConnectApi, getApiInstanceById } =
    useChainSpaceEnv();

  // Store the active setup step for a tab.
  const [activeSteps, setActiveSteps] = useState<SetupStepsState>({});

  // Store the next free para id, keyed by chain. Once a subscription has been initialised, all tabs
  // can use an existing value for the chain in question. NOTE: Requires a ref as state updates are
  // used in event callbacks.
  const [nextParaId, setNextParaIdState] = useState<
    Partial<Record<ChainId, string>>
  >({});
  const nextParaIdRef = useRef(nextParaId);

  // Get a para id for a chain.
  const getNextParaId = (chainId: ChainId) => nextParaId[chainId];

  // Set a para id for a chain.
  const setNextParaId = (chainId: ChainId, paraId: string) => {
    if (!chainId) {
      return;
    }
    const updated = { ...nextParaIdRef.current };
    updated[chainId] = paraId;

    nextParaIdRef.current = updated;
    setNextParaIdState(updated);
  };

  // Remove a para id for a chain.
  const removeNextParaId = (chainId: ChainId) => {
    const updated = { ...nextParaIdRef.current };
    delete updated[chainId];

    nextParaIdRef.current = updated;
    setNextParaIdState(updated);
  };

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

    const chainId = tab?.taskData?.chain?.id;
    if (chainId) {
      removeNextParaId(chainId);
    }
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

    const newTabs = [...tabs].map((item) =>
      item.id === tabId
        ? {
            ...item,
            // Auto rename the tab here if the setting is turned on.
            name: autoTabNaming
              ? getAutoTabName(item.id, 'Parachain Setup')
              : item.name,
            // Chain is now assigned the `chainExplorer` task.
            activeTask: 'parachainSetup' as TabTask,
            taskData: {
              chain: chainData,
              connectFrom: 'directory' as ConnectFrom,
              autoConnect: true,
              selectedRelayChain: chainId,
            },
          }
        : item
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

  // Handle new next para id callback.
  const newNextParaIdCallback = (e: Event) => {
    if (isCustomEvent(e)) {
      const { chainId, nextFreeParaId } = e.detail;
      setNextParaId(chainId, nextFreeParaId);
    }
  };

  const ref = useRef<Document>(document);
  useEventListener('callback-next-free-para-id', newNextParaIdCallback, ref);

  return (
    <ParaSetupContext.Provider
      value={{
        handleConnectTask,

        getActiveStep,
        setActiveStep,

        getSelectedRelayChain,
        setSelectedRelayChain,

        getNextParaId,
        setNextParaId,
        removeNextParaId,

        destroyTabParaSetup,
        setupParachainIntegrityCheck,
      }}
    >
      {children}
    </ParaSetupContext.Provider>
  );
};
