// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';

export interface CallListProps {
  items: AnyJson;
  activeItem: string | null;
}
export interface CallListItem {
  name: string;
  docs: string[];
  fieldNames: string | undefined;
}

export interface SubmitProps {
  activePallet: string | null;
  activeItem: string | null;
}
