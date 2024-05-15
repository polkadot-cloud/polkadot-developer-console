// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DirectoryId } from './types';
import { NetworkDirectory } from '.';

// Determines if a given string is a valid directory id.
export const isDirectoryId = (id: DirectoryId | string): id is DirectoryId =>
  NetworkDirectory[id as DirectoryId] !== undefined;

// Get the icon for a given directory id.
export const getDirectoryIcon = (id: DirectoryId) => NetworkDirectory[id].icon;

// Get the associated relay chain given a directory id.
export const getRelayChain = (id: DirectoryId): DirectoryId | undefined => {
  const chain = NetworkDirectory[id];
  return chain?.relayChain;
};

// Get the first letter of the chain name.
export const getChainInitial = (id: DirectoryId) => {
  const entry = NetworkDirectory[id];
  return entry?.initial || entry.system.chain.charAt(0).toUpperCase();
};

// Get system metadata of a chain.
export const getChainMeta = (id: DirectoryId) => {
  const system = NetworkDirectory[id].system;
  return {
    ss58: system.ss58,
    units: system.units,
    unit: system.unit,
  };
};
