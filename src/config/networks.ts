// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// NOTE: This file is temporary until the @polkadot-cloud/network-directory package is ready to be
// used.

export type NetworkDirectoryName =
  | 'polkadot-relay'
  | 'kusama-relay'
  | 'westend-relay';

export interface NetworkDirectoryItem {
  unit: string;
}

export type NetworkDirectory = Record<
  NetworkDirectoryName,
  NetworkDirectoryItem
>;

// The currently supported networks.
export const NetworkDirectory: NetworkDirectory = {
  'polkadot-relay': {
    unit: 'DOT',
  },
  'kusama-relay': {
    unit: 'KSM',
  },
  'westend-relay': {
    unit: 'WND',
  },
};
