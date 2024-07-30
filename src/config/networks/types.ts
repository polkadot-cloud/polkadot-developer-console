// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

export type DirectoryId =
  | 'polkadot'
  | 'kusama'
  | 'rococo'
  | 'westend'
  | 'statemint'
  | 'bridge-hub-polkadot'
  | 'people-polkadot'
  | 'collectives';

export type ChainId = DirectoryId | 'custom';

export interface NetworkDirectoryItem {
  system: NetworkDirectoryItemSystem;
  name: string;
  initial?: string;
  color: string;
  providers: Record<string, string>;
  isRelayChain?: boolean;
  smoldot?: {
    relayChain: string;
  };
  relayChain?: DirectoryId;
}

export interface NetworkDirectoryItemSystem {
  chain: string;
  ss58: number;
  units: number;
  unit: string;
}
