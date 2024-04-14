// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ExtensionArrayListItem } from '@w3ux/extension-assets/util';

export interface ConnectInnerProps {
  installed: ExtensionArrayListItem[];
  other: ExtensionArrayListItem[];
}

export interface ExtensionProps {
  extension: ExtensionArrayListItem;
  last: boolean;
}
