// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// NOTE: This file is temporary until the @polkadot-cloud/network-directory package is ready to be
// used.

export type DirectoryId = 'polkadot' | 'kusama' | 'rococo' | 'westend';

export type ChainId = DirectoryId | 'custom';

export interface NetworkDirectoryItem {
  system: {
    chain: string;
    ss58: number;
    units: number;
    unit: string;
  };
  name: string;
  color: string;
  providers: Record<string, string>;
  isRelayChain: boolean;
}

export type NetworkDirectory = Record<DirectoryId, NetworkDirectoryItem>;

// The currently supported networks.
export const NetworkDirectory: NetworkDirectory = {
  polkadot: {
    system: {
      chain: 'Polkadot',
      ss58: 0,
      units: 10,
      unit: 'DOT',
    },
    name: 'Polkadot Relay Chain',
    color: '#c10e7d',
    providers: {
      'Automata 1RPC': 'wss://1rpc.io/dot',
      Dwellir: 'wss://polkadot-rpc.dwellir.com',
      'Dwellir Tunisia': 'wss://polkadot-rpc-tn.dwellir.com',
      'IBP-GeoDNS1': 'wss://rpc.ibp.network/polkadot',
      'IBP-GeoDNS2': 'wss://rpc.dotters.network/polkadot',
      LuckyFriday: 'wss://rpc-polkadot.luckyfriday.io',
      RadiumBlock: 'wss://polkadot.public.curie.radiumblock.co/ws',
      Stakeworld: 'wss://dot-rpc.stakeworld.io',
    },
    isRelayChain: true,
  },
  kusama: {
    system: {
      chain: 'Kusama',
      ss58: 2,
      units: 12,
      unit: 'KSM',
    },
    name: 'Kusama Relay Chain',
    color: '#000',
    providers: {
      'Automata 1RPC': 'wss://1rpc.io/ksm',
      Dwellir: 'wss://kusama-rpc.dwellir.com',
      'Dwellir Tunisia': 'wss://kusama-rpc-tn.dwellir.com',
      'IBP-GeoDNS1': 'wss://rpc.ibp.network/kusama',
      'IBP-GeoDNS2': 'wss://rpc.dotters.network/kusama',
      LuckyFriday: 'wss://rpc-kusama.luckyfriday.io',
      RadiumBlock: 'wss://kusama.public.curie.radiumblock.co/ws',
      Stakeworld: 'wss://ksm-rpc.stakeworld.io',
    },
    isRelayChain: true,
  },
  rococo: {
    system: {
      chain: 'Rococo',
      ss58: 0,
      units: 12,
      unit: 'ROC',
    },
    name: 'Rococo Relay Chain',
    color: '#552bbf',
    providers: {
      Parity: 'wss://rococo-rpc.polkadot.io',
    },
    isRelayChain: true,
  },
  westend: {
    system: {
      chain: 'Westend',
      ss58: 42,
      units: 12,
      unit: 'WND',
    },
    name: 'Westend Relay Chain',
    color: '#c63860',
    providers: {
      Dwellir: 'wss://westend-rpc.dwellir.com',
      'Dwellir Tunisia': 'wss://westend-rpc-tn.dwellir.com',
      'IBP-GeoDNS1': 'wss://rpc.ibp.network/westend',
      'IBP-GeoDNS2': 'wss://rpc.dotters.network/westend',
      LuckyFriday: 'wss://rpc-westend.luckyfriday.io',
      RadiumBlock: 'wss://westend.public.curie.radiumblock.co/ws',
      Stakeworld: 'wss://wnd-rpc.stakeworld.io',
    },
    isRelayChain: true,
  },
};
