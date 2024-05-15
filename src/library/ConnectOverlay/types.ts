// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ExtensionArrayListItem } from '@w3ux/extension-assets/util';
import type { AnyJson } from '@w3ux/utils/types';
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
