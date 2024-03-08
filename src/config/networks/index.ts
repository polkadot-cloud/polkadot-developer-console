// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// NOTE: This file is temporary until the @polkadot-cloud/network-directory package is ready to be
// used.

export type ChainId = 'polkadot' | 'kusama' | 'rococo' | 'westend';

export type ChainIdOrCustom = ChainId | 'custom';

export interface NetworkDirectoryItem {
  system: {
    chain: string;
  };
  name: string;
  unit: string;
  providers: Record<string, string>;
}

export type NetworkDirectory = Record<ChainId, NetworkDirectoryItem>;

// The currently supported networks.
export const NetworkDirectory: NetworkDirectory = {
  polkadot: {
    system: {
      chain: 'Polkadot',
    },
    name: 'Polkadot Relay Chain',
    unit: 'DOT',
    providers: {
      'Automata 1RPC': 'wss://1rpc.io/dot',
      Dwellir: 'wss://polkadot-rpc.dwellir.com',
      'Dwellir Tunisia': 'wss://polkadot-rpc-tn.dwellir.com',
      'IBP-GeoDNS1': 'wss://rpc.ibp.network/polkadot',
      'IBP-GeoDNS2': 'wss://rpc.dotters.network/polkadot',
      LuckyFriday: 'wss://rpc-polkadot.luckyfriday.io',
      RadiumBlock: 'wss://polkadot.public.curie.radiumblock.co/ws',
      Stakeworld: 'wss://dot-rpc.stakeworld.io',
      Parity: 'wss://apps-rpc.polkadot.io',
    },
  },
  kusama: {
    system: {
      chain: 'Kusama',
    },
    name: 'Kusama Relay Chain',
    unit: 'KSM',
    providers: {
      'Automata 1RPC': 'wss://1rpc.io/ksm',
      Dwellir: 'wss://kusama-rpc.dwellir.com',
      'Dwellir Tunisia': 'wss://kusama-rpc-tn.dwellir.com',
      'IBP-GeoDNS1': 'wss://rpc.ibp.network/kusama',
      'IBP-GeoDNS2': 'wss://rpc.dotters.network/kusama',
      LuckyFriday: 'wss://rpc-kusama.luckyfriday.io',
      RadiumBlock: 'wss://kusama.public.curie.radiumblock.co/ws',
      Stakeworld: 'wss://ksm-rpc.stakeworld.io',
      Parity: 'wss://kusama-rpc.polkadot.io',
    },
  },
  rococo: {
    system: {
      chain: 'Rococo',
    },
    name: 'Rococo Relay Chain',
    unit: 'ROC',
    providers: {
      Parity: 'wss://rococo-rpc.polkadot.io',
    },
  },
  westend: {
    system: {
      chain: 'Westend',
    },
    name: 'Westend Relay Chain',
    unit: 'WND',
    providers: {
      Dwellir: 'wss://westend-rpc.dwellir.com',
      'Dwellir Tunisia': 'wss://westend-rpc-tn.dwellir.com',
      'IBP-GeoDNS1': 'wss://rpc.ibp.network/westend',
      'IBP-GeoDNS2': 'wss://rpc.dotters.network/westend',
      LuckyFriday: 'wss://rpc-westend.luckyfriday.io',
      RadiumBlock: 'wss://westend.public.curie.radiumblock.co/ws',
      Stakeworld: 'wss://wnd-rpc.stakeworld.io',
      Parity: 'wss://westend-rpc.polkadot.io',
    },
  },
};
