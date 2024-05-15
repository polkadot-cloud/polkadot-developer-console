// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';
import type { InputNamespace } from 'contexts/ChainUi/types';

export interface CallListProps {
  items: AnyJson;
  activeItem: string | null;
  inputNamespace: InputNamespace;
}
export interface CallListItem {
  name: string;
  docs: string[];
  fieldNames: string | undefined;
}
