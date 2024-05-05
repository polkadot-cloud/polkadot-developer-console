// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import type { ParaSetupContextInterface, SetupStep } from './types';
import { defaultParaSetupContext } from './defaults';
import { useGlobalChainSpace } from 'contexts/GlobalChainSpace';
import { ApiController } from 'controllers/Api';
import type { ChainId } from 'config/networks';

// TODO: This data needs to be moved to tab ui data.

export const ParaSetupContext = createContext<ParaSetupContextInterface>(
  defaultParaSetupContext
);

export const useParaSetup = () => useContext(ParaSetupContext);

export const ParaSetupProvider = ({ children }: { children: ReactNode }) => {
  const { globalChainSpace } = useGlobalChainSpace();

  // Store the active setup step for a tab.
  const [activeSteps, setActiveSteps] = useState<Record<number, SetupStep>>({});

  // Register the relay chain api instance indexes for a tab.
  const [relayApis, setRelayApis] = useState<Record<number, number>>({});

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
  const registerRelayApi = async (
    tabId: number,
    chainId: ChainId,
    endpoint: string
  ) => {
    if (!globalChainSpace) {
      return;
    }
    // Add api to global chainspace instance and return its instance id.
    const apiInstanceIndex = await globalChainSpace
      .getInstance()
      .addApi(chainId, endpoint);

    setRelayApis((prev) => ({
      ...prev,
      [tabId]: apiInstanceIndex,
    }));
  };

  // Get a registered api instance for a tab id.
  const getRelayApi = (tabId: number) => {
    const instanceIndex = relayApis[tabId];
    return ApiController.instances['global']?.[instanceIndex] || undefined;
  };

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
