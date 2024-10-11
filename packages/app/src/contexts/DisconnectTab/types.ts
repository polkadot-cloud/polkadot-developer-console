// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { OwnerId } from 'types';

export interface DisconnectTabContextInterface {
  disconnectTab: (ownerId: OwnerId, destroyIndex?: number) => void;
}

export interface DisconnectTabProps {
  children: React.ReactNode;
}
