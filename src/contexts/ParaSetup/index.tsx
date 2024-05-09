// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import type { ParaSetupContextInterface, SetupStep } from './types';
import { defaultParaSetupContext } from './defaults';
import { ApiController } from 'controllers/Api';
import type { ChainId } from 'config/networks';

// TODO: This data needs to be moved to tab ui data.

export const ParaSetupContext = createContext<ParaSetupContextInterface>(
  defaultParaSetupContext
);

export const useParaSetup = () => useContext(ParaSetupContext);

export const ParaSetupProvider = ({ children }: { children: ReactNode }) => {
  // Store the active setup step for a tab.
  const [activeSteps, setActiveSteps] = useState<Record<number, SetupStep>>({});

  // Store the currently selected relay chain.
  const [selectedRelayChain, setSelectedRelayChain] =
    useState<ChainId>('polkadot');

  // Register the relay chain api instance indexes for a tab.
  //
  // TODO: Abstract to `chainSpaceApis` and pass into ChainSpaceEnv to bootstrap existing relay
  // instances.
  const [relayApis] = useState<Record<number, number>>({});

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

  // Get a registered instance index for a tab id.
  //
  // TODO: abstract to getChainSpaceInstanceIndex.
  const getRelayInstanceIndex = (tabId: number) => relayApis[tabId];

  // Get a registered api instance for a tab id.
  //
  // TODO: abstract to getChainSpaceInstance and move to ChainSpaceEnv.
  const getRelayApi = (tabId: number) => {
    const instanceIndex = relayApis[tabId];
    return ApiController.instances['global']?.[instanceIndex] || undefined;
  };

  return (
    <ParaSetupContext.Provider
      value={{
        getActiveStep,
        setActiveStep,
        getRelayApi,
        getRelayInstanceIndex,
        selectedRelayChain,
        setSelectedRelayChain,
      }}
    >
      {children}
    </ParaSetupContext.Provider>
  );
};
