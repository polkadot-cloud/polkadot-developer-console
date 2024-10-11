// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { ExtensionArrayListItem } from '@w3ux/extension-assets/util';
import type { AnyJson } from '@w3ux/types';
import type { DirectoryId, NetworkDirectoryItem } from 'config/networks/types';
import type { Dispatch, SetStateAction } from 'react';

export interface ConnectInnerProps {
  installed: ExtensionArrayListItem[];
  other: ExtensionArrayListItem[];
}

export interface ExtensionProps {
  extension: ExtensionArrayListItem;
  last: boolean;
}

export interface ChainSearchInputProps {
  onSearchFocused: () => void;
  onSearchBlurred: () => void;
  directoryId: DirectoryId;
  setDirectoryId: Dispatch<SetStateAction<DirectoryId>>;
  activeChain: NetworkDirectoryItem | undefined;
  supportedChains?: DirectoryId[];
}

export interface ManageHardwareProps {
  getMotionProps: (item: string, active?: boolean) => AnyJson;
  selectedConnectItem: string | undefined;
}

export interface QrReaderProps {
  directoryId: DirectoryId;
  importActive: boolean;
  activeChain: NetworkDirectoryItem | undefined;
  onSuccess: () => void;
}
