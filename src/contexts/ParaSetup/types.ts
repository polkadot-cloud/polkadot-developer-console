// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId, DirectoryId } from 'config/networks/types';
import type { ConnectFrom, TabChainData } from 'contexts/Tabs/types';
import type { IntegrityCheckedParachainContext } from 'routes/ParachainSetup/Provider/types';

export interface ParaSetupContextInterface {
  handleConnectTask: (
    tabId: number,
    chainId: DirectoryId,
    endpoint: string
  ) => Promise<void>;
  getActiveStep: (tabId: number) => SetupStep;
  setActiveStep: (tabId: number, step: SetupStep) => void;
  getSelectedRelayChain: (tabId: number) => DirectoryId | undefined;
  setSelectedRelayChain: (tabId: number, chainId: DirectoryId) => void;
  destroyTabParaSetup: (tabId: number) => void;
  setupParachainIntegrityCheck: (
    tabId: number
  ) => IntegrityCheckedParachainContext | false;
  nextParaId: string | null;
  setNextParaId: (paraId: string | null) => void;
  nextParaIdInitialisedRef: React.MutableRefObject<boolean>;
}

export type SetupStep =
  | 'connect_relay'
  | 'reserve_para_id'
  | 'configure_node'
  | 'register_parathread'
  | 'get_coretime';

export type SetupStepsState = Record<number, SetupStep>;

export type SelectedRelayChains = Record<number, ChainId>;

export interface ParachainSetupTaskData {
  chain: TabChainData | undefined;
  connectFrom: ConnectFrom;
  autoConnect: boolean;
  selectedRelayChain: DirectoryId;
}
