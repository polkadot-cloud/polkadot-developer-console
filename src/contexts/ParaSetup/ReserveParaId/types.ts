// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId } from 'config/networks/types';

export interface ReserveParaIdContextInterface {
  getNextParaId: (chainId: ChainId) => string | undefined;
  setNextParaId: (chainId: ChainId, paraId: string) => void;
  removeNextParaId: (chainId: ChainId) => void;
  nextParaIdChainExists: (chainId: ChainId) => boolean;
  addNextParaIdChain: (chainId: ChainId) => void;
  removeNextParaIdChain: (chainId: ChainId) => void;
}
