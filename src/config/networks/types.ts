// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export type DirectoryId =
  | 'polkadot'
  | 'kusama'
  | 'rococo'
  | 'westend'
  | 'statemint'
  | 'bridgeHubPolkadot'
  | 'collectives';

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
  isRelayChain?: boolean;
}
