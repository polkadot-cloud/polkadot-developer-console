// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import type { ParaSetupContextInterface, SetupStep } from './types';
import { defaultParaSetupContext } from './defaults';
import type { ChainId } from 'config/networks';

// TODO: This data needs to be moved to tab ui data.

export const ParaSetupContext = createContext<ParaSetupContextInterface>(
  defaultParaSetupContext
);

export const useParaSetup = () => useContext(ParaSetupContext);

export const ParaSetupProvider = ({ children }: { children: ReactNode }) => {
  // Store the active setup step for a tab.
  const [activeSteps, setActiveSteps] = useState<Record<number, SetupStep>>({});

  // Store the currently selected relay chain, keyed by tab.
  const [selectedRelayChains, setSelectedRelayChains] = useState<
    Record<number, ChainId>
  >({});

  const getSelectedRelayChain = (tabId: number) =>
    selectedRelayChains[tabId] || 'polkadot';

  const setSelectedRelayChain = (tabId: number, chainId: ChainId) => {
    setSelectedRelayChains({
      ...selectedRelayChains,
      [tabId]: chainId,
    });
  };
  // Store the index at which to access the relay chain api from the global chain space environment,
  // for each tab.
  const [chainSpaceApiIndexes, setChainSpaceApiIndexes] = useState<
    Record<number, number | undefined>
  >({});

  // Get a chain space api index for a tab.
  const getChainSpaceApiIndex = (tabId: number) => chainSpaceApiIndexes[tabId];

  // Set a chain space api index for a tab.
  const setChainSpaceApiIndex = (tabId: number, index: number) => {
    setChainSpaceApiIndexes({
      ...chainSpaceApiIndexes,
      [tabId]: index,
    });
  };

  // Remove a chain space api index for a tab.
  const removeChainSpaceApiIndex = (tabId: number) => {
    const updated = { ...chainSpaceApiIndexes };
    delete updated[tabId];
    setChainSpaceApiIndexes(updated);
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

  return (
    <ParaSetupContext.Provider
      value={{
        getActiveStep,
        setActiveStep,
        getChainSpaceApiIndex,
        setChainSpaceApiIndex,
        getSelectedRelayChain,
        setSelectedRelayChain,
        removeChainSpaceApiIndex,
      }}
    >
      {children}
    </ParaSetupContext.Provider>
  );
};
