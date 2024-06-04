// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export type DirectoryId =
  | 'polkadot'
  | 'kusama'
  | 'rococo'
  | 'westend'
  | 'statemint'
  | 'bridge-hub-polkadot'
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
  icon: DirectoryId;
  initial?: string;
  color: string;
  providers: Record<string, string>;
  isRelayChain?: boolean;
  relayChain?: DirectoryId;
}
