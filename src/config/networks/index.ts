// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DirectoryId, NetworkDirectoryItem } from './types';

// The currently supported networks.
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
  },
  statemint: {
    system: {
      chain: 'Statemint',
      ss58: 0,
      units: 10,
      unit: 'DOT',
    },
    name: 'Polkadot Asset Hub',
    color: '#552bbf',
    providers: {
      'Dwellir Tunisia': 'wss://statemint-rpc-tn.dwellir.com',
      'IBP-GeoDNS1': 'wss://sys.ibp.network/statemint',
      'IBP-GeoDNS2': 'wss://sys.dotters.network/statemint',
      StakeWorld: 'wss://dot-rpc.stakeworld.io/assethub',
    },
  },
  bridgeHubPolkadot: {
    system: {
      chain: 'Polkadot BridgeHub',
      ss58: 0,
      units: 10,
      unit: 'DOT',
    },
    name: 'Polkadot Bridge Hub',
    color: '#552bbf',
    providers: {
      Parity: 'wss://polkadot-bridge-hub-rpc.polkadot.io',
      Stakeworld: 'wss://dot-rpc.stakeworld.io/bridgehub',
    },
  },
  collectives: {
    system: {
      chain: 'Polkadot Collectives',
      ss58: 0,
      units: 10,
      unit: 'DOT',
    },
    name: 'Polkadot Collectives',
    color: '#552bbf',
    providers: {
      Parity: 'wss://polkadot-collectives-rpc.polkadot.io',
    },
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
