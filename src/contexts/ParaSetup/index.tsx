// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import type {
  ChainSpaceApiIndexes,
  ParaSetupContextInterface,
  SelectedRelayChains,
  SetupStep,
  SetupStepsState,
} from './types';
import { defaultParaSetupContext } from './defaults';
import type { ChainId } from 'config/networks';

// TODO: This data needs to be moved to tab ui data.

export const ParaSetupContext = createContext<ParaSetupContextInterface>(
  defaultParaSetupContext
);

export const useParaSetup = () => useContext(ParaSetupContext);

export const ParaSetupProvider = ({ children }: { children: ReactNode }) => {
  // Store the active setup step for a tab.
  const [activeSteps, setActiveSteps] = useState<SetupStepsState>({});

  // Store the currently selected relay chain, keyed by tab.
  const [selectedRelayChains, setSelectedRelayChains] =
    useState<SelectedRelayChains>({});

  // Store  confirmed relay chains, keyed by tab.
  const [confirmedRelayChains, setConfirmedRelayChains] =
    useState<SelectedRelayChains>({});

  // Store the index at which to access the relay chain api from the global chain space environment,
  // for each tab.
  const [chainSpaceApiIndexes, setChainSpaceApiIndexes] =
    useState<ChainSpaceApiIndexes>({});

  // Get the selected relay chain for a tab.
  const getSelectedRelayChain = (tabId: number) =>
    selectedRelayChains[tabId] || 'polkadot';

  // Set the selected relay chain for a tab.
  const setSelectedRelayChain = (tabId: number, chainId: ChainId) => {
    setSelectedRelayChains({
      ...selectedRelayChains,
      [tabId]: chainId,
    });
  };

  // Get the confirmed relay chain for a tab.
  const getConfirmedRelayChain = (tabId: number) => confirmedRelayChains[tabId];

  // Set the confirmed relay chain for a tab.
  const setConfirmedRelayChain = (tabId: number, chainId: ChainId) => {
    setConfirmedRelayChains({
      ...confirmedRelayChains,
      [tabId]: chainId,
    });
  };

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

  // Destroy state associated with a tab. Should only be used on tab close.
  const destroyTabParaSetup = (tabId: number) => {
    const updated = { ...activeSteps };
    delete updated[tabId];
    setActiveSteps(updated);

    const updatedSelectedRelayChains = { ...selectedRelayChains };
    delete updatedSelectedRelayChains[tabId];
    setSelectedRelayChains(updatedSelectedRelayChains);

    const updatedConfirmedRelayChains = { ...confirmedRelayChains };
    delete updatedConfirmedRelayChains[tabId];
    setSelectedRelayChains(updatedConfirmedRelayChains);

    const updatedIndexes = { ...chainSpaceApiIndexes };
    delete updatedIndexes[tabId];
    setChainSpaceApiIndexes(updatedIndexes);
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
        getConfirmedRelayChain,
        setConfirmedRelayChain,
        removeChainSpaceApiIndex,
        destroyTabParaSetup,
      }}
    >
      {children}
    </ParaSetupContext.Provider>
  );
};
