// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ApiStatus } from 'model/Api/types';

export interface StepProps {
  relayChain: string;
  setRelayChain: (value: string) => void;
  relayApiStatus: ApiStatus;
  relayInstanceIndex: number | undefined;
  handleConnectApi: () => void;
}
