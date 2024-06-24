// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { OwnerId } from 'types';

export interface DisconnectTabContextInterface {
  disconnectTab: (ownerId: OwnerId, destroyIndex?: number) => void;
}

export interface DisconnectTabProps {
  children: React.ReactNode;
}
