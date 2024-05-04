// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import type { ParaSetupContextInterface, SetupStep } from './types';
import { defaultParaSetupContext } from './defaults';
import { useGlobalChainSpace } from 'contexts/GlobalChainSpace';

// TODO: This data needs to be moved to tab ui data.

export const ParaSetupContext = createContext<ParaSetupContextInterface>(
  defaultParaSetupContext
);

export const useParaSetup = () => useContext(ParaSetupContext);

export const ParaSetupProvider = ({ children }: { children: ReactNode }) => {
  const { globalChainSpace } = useGlobalChainSpace();

  // Store the active setup step for a tab.
  const [activeSteps, setActiveSteps] = useState<Record<number, SetupStep>>({});

  // Register the relay chain api instances for a tab.
  const [relayApis, setRelayApis] = useState<Record<number, string>>({});

  // Get the active step for a tab id, or 1 otherwise.
  const getActiveStep = (tabId: number) =>
    activeSteps[tabId] || 'reserve_para_id';

  // Set an active step for a tab id.
  const setActiveStep = (tabId: number, step: SetupStep) => {
    setActiveSteps((prev) => ({
      ...prev,
      [tabId]: step,
    }));
  };

  // Register a new relay chain instance with the glboal chain space for parachain setup.
  const registerRelayApi = (tabId: number) => {
    if (!globalChainSpace) {
      return;
    }

    // TODO: call addApi on global chainspace instance and return its instance id.
    console.log(globalChainSpace.getInstance());

    setRelayApis((prev) => ({
      ...prev,
      [tabId]: 'relay_chain_instance',
    }));
  };

  // Get a registered api instance for a tab id.
  const getRelayApi = (tabId: number) => relayApis[tabId];

  return (
    <ParaSetupContext.Provider
      value={{
        getActiveStep,
        setActiveStep,
        registerRelayApi,
        getRelayApi,
      }}
    >
      {children}
    </ParaSetupContext.Provider>
  );
};
