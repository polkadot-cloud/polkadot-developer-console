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
import type { ChainId } from 'config/networks';

export const ParaSetupContext = createContext<ParaSetupContextInterface>(
  defaultParaSetupContext
);

export const useParaSetup = () => useContext(ParaSetupContext);

export const ParaSetupProvider = ({ children }: { children: ReactNode }) => {
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

  return (
    <ParaSetupContext.Provider
      value={{
        getActiveStep,
        setActiveStep,
        getSelectedRelayChain,
        setSelectedRelayChain,
        destroyTabParaSetup,
      }}
    >
      {children}
    </ParaSetupContext.Provider>
  );
};
