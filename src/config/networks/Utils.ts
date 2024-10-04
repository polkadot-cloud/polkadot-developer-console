// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { DirectoryId } from './types';
import { NetworkDirectory } from '.';

// Determines if a given string is a valid directory id.
export const isDirectoryId = (id: DirectoryId | string): id is DirectoryId =>
  NetworkDirectory[id as DirectoryId] !== undefined;

// Get the associated relay chain given a directory id.
export const getRelayChain = (id: DirectoryId): DirectoryId | undefined => {
  const chain = NetworkDirectory[id];
  return chain?.relayChain;
};

// Get the first letter of the chain name.
export const getChainInitial = (id: DirectoryId): string | undefined => {
  const entry = NetworkDirectory[id];
  return entry?.initial;
};

// Get system metadata of a chain.
export const getChainMeta = (id: DirectoryId) => {
  const system = NetworkDirectory[id].system;
  return {
    chain: system.chain,
    ss58: system.ss58,
    units: system.units,
    unit: system.unit,
  };
};

// Gets the correct icon filename for a given chain.
export const getIconFilename = (id: DirectoryId): string => {
  const entry = NetworkDirectory[id];
  if (entry?.relayChain) {
    return entry.relayChain;
  }
  return id;
};
