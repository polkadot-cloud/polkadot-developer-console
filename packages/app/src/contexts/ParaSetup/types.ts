// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { ChainId, DirectoryId } from 'config/networks/types';
import type { BaseTaskData } from 'contexts/Tabs/types';
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
  destroyStateParaSetup: (tabId: number) => void;
  setupParachainIntegrityCheck: (
    tabId: number
  ) => IntegrityCheckedParachainContext | false;
}

export type SetupStep =
  | 'connect_relay'
  | 'reserve_para_id'
  | 'register_parathread'
  | 'get_coretime';

export type SetupStepsState = Record<number, SetupStep>;

export type SelectedRelayChains = Record<number, ChainId>;

export type ParachainSetupTaskData = BaseTaskData & {
  selectedRelayChain: DirectoryId;
};
