// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { DirectoryId, NetworkDirectoryItem } from './types';

// Chain directory.
//
// NOTE: Data is based on Subwallet ChainInfo data, at:
// `https://github.com/Koniverse/SubWallet-ChainList/blob/master/packages/chain-list/src/data/ChainInfo.json`.

export const NetworkDirectory: Record<DirectoryId, NetworkDirectoryItem> = {
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
    smoldot: {
      relayChain: 'polkadot',
    },
  },
  statemint: {
    system: {
      chain: 'Statemint',
      ss58: 0,
      units: 10,
      unit: 'DOT',
    },
    name: 'Polkadot Asset Hub',
    initial: 'A',
    color: '#552bbf',
    providers: {
      'Dwellir Tunisia': 'wss://statemint-rpc-tn.dwellir.com',
      'IBP-GeoDNS1': 'wss://sys.ibp.network/statemint',
      'IBP-GeoDNS2': 'wss://sys.dotters.network/statemint',
      StakeWorld: 'wss://dot-rpc.stakeworld.io/assethub',
    },
    relayChain: 'polkadot',
  },
  'bridge-hub-polkadot': {
    system: {
      chain: 'Polkadot BridgeHub',
      ss58: 0,
      units: 10,
      unit: 'DOT',
    },
    name: 'Polkadot Bridge Hub',
    initial: 'B',
    color: '#552bbf',
    providers: {
      Parity: 'wss://polkadot-bridge-hub-rpc.polkadot.io',
      Stakeworld: 'wss://dot-rpc.stakeworld.io/bridgehub',
    },
    relayChain: 'polkadot',
  },
  collectives: {
    system: {
      chain: 'Polkadot Collectives',
      ss58: 0,
      units: 10,
      unit: 'DOT',
    },
    name: 'Polkadot Collectives',
    initial: 'C',
    color: '#552bbf',
    providers: {
      Parity: 'wss://polkadot-collectives-rpc.polkadot.io',
    },
    relayChain: 'polkadot',
  },
  'people-polkadot': {
    system: {
      chain: 'Polkadot People',
      ss58: 0,
      units: 10,
      unit: 'DOT',
    },
    name: 'Polkadot People Chain',
    initial: 'P',
    color: '#552bbf',
    providers: {
      Parity: 'wss://polkadot-people-rpc.polkadot.io',
    },
    relayChain: 'polkadot',
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
    smoldot: {
      relayChain: 'ksmcc3',
    },
  },
  'coretime-kusama': {
    system: {
      chain: 'Kusama Coretime',
      ss58: 0,
      units: 12,
      unit: 'KSM',
    },
    name: 'Kusama Coretime Chain',
    initial: 'C',
    color: '#552bbf',
    providers: {
      Dwellir: 'wss://coretime-kusama-rpc.dwellir.com',
      'IBP-GeoDNS1': 'wss://sys.ibp.network/coretime-kusama',
      'IBP-GeoDNS2': 'wss://sys.dotters.network%2Fcoretime-kusama',
      LuckyFriday: 'wss://rpc-coretime-kusama.luckyfriday.io',
      Parity: 'wss://kusama-coretime-rpc.polkadot.io',
      Stakeworld: 'wss://ksm-rpc.stakeworld.io/coretime',
    },
    relayChain: 'kusama',
  },
  'people-kusama': {
    system: {
      chain: 'Kusama People',
      ss58: 0,
      units: 12,
      unit: 'KSM',
    },
    name: 'Kusama People Chain',
    initial: 'P',
    color: '#552bbf',
    providers: {
      Parity: 'wss://kusama-people-rpc.polkadot.io',
    },
    relayChain: 'kusama',
  },
  rococo: {
    system: {
      chain: 'Rococo',
      ss58: 42,
      units: 12,
      unit: 'ROC',
    },
    name: 'Rococo Relay Chain',
    color: '#552bbf',
    providers: {
      Parity: 'wss://rococo-rpc.polkadot.io',
    },
    isRelayChain: true,
    smoldot: {
      relayChain: 'rococo_v2_2',
    },
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
    smoldot: {
      relayChain: 'westend2',
    },
  },
  'people-westend': {
    system: {
      chain: 'Westend People',
      ss58: 0,
      units: 12,
      unit: 'WND',
    },
    name: 'Westend People Chain',
    initial: 'P',
    color: '#552bbf',
    providers: {
      Parity: 'wss://westend-people-rpc.polkadot.io',
    },
    relayChain: 'westend',
  },
};
