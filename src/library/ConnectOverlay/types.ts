// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ExtensionArrayListItem } from '@w3ux/extension-assets/util';
import type { AnyJson } from '@w3ux/utils/types';
import type { DirectoryId } from 'config/networks';

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
  defaultDirectoryId: DirectoryId;
}

export interface ManageHardwareProps {
  getMotionProps: (item: string, active?: boolean) => AnyJson;
}
