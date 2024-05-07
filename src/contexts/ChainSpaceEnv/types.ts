// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId } from 'config/networks';
import type { ActiveBalancesInterface } from 'hooks/useActiveBalances/types';
import type { Api } from 'model/Api';
import type { ApiStatus } from 'model/Api/types';

export interface ChainSpaceEnvContextInterface {
  activeBalances: ActiveBalancesInterface;
  relayChain: ChainId;
  relayInstance: Api | undefined;
  setRelayChain: (value: ChainId) => void;
  relayApiStatus: ApiStatus;
  relayInstanceIndex: number | undefined;
  handleConnectApi: (provider: string) => void;
}
