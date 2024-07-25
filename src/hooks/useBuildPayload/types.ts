// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { ApiPromise } from '@polkadot/api';
import type { AnyJson } from '@w3ux/types';
import type { ChainId } from 'config/networks/types';
import type { ApiInstanceId } from 'model/Api/types';

export interface UseBuildPayloadProps {
  api: ApiPromise;
  instanceId: ApiInstanceId;
  chainId: ChainId;
  unit: string;
  ss58Prefix: number;
  nonce: number;
  setPayload: (
    instanceId: ApiInstanceId,
    payload: AnyJson,
    payloadValue: AnyJson,
    uid: number
  ) => void;
}
