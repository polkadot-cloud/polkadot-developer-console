// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ApiPromise } from '@polkadot/api';
import type { AnyJson } from '@w3ux/types';
import type { ApiInstanceId } from 'model/Api/types';

export interface UseBuildPayloadProps {
  api: ApiPromise;
  instanceId: ApiInstanceId;
  nonce: number;
  setPayload: (
    instanceId: ApiInstanceId,
    payload: AnyJson,
    uid: number
  ) => void;
}
