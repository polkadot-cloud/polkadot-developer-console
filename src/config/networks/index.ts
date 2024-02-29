// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// NOTE: This file is temporary until the @polkadot-cloud/network-directory package is ready to be
// used.

export type ChainId =
  | 'polkadot-relay-chain'
  | 'kusama-relay-chain'
  | 'westend-relay-chain';

export interface NetworkDirectoryItem {
  name: string;
  unit: string;
}

export type NetworkDirectory = Record<ChainId, NetworkDirectoryItem>;

// The currently supported networks.
export const NetworkDirectory: NetworkDirectory = {
  'polkadot-relay-chain': {
    name: 'Polkadot Relay Chain',
    unit: 'DOT',
  },
  'kusama-relay-chain': {
    name: 'Kusama Relay Chain',
    unit: 'KSM',
  },
  'westend-relay-chain': {
    name: 'Westend Relay Chain',
    unit: 'WND',
  },
};
