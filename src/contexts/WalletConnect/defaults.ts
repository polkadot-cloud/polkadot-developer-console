// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { WalletConnectContextInterface } from './types';

// The supported networks and the corresponding CAIP.
// TODO: Fetch blockhash from network to determine CAIP and deprecate this.
export const WalletConnectChains = [
  {
    network: 'polkadot',
    caip: '91b171bb158e2d3848fa23a9f1c25182',
  },
  {
    network: 'kusama',
    caip: 'b0a8d493285c2df73290dfb7e61f870f',
  },
];

export const defaultWalletConnect: WalletConnectContextInterface = {
  wcProvider: null,
  wcModal: null,
  wcMeta: null,
};
