// Copyright 2024 @polkadot-cloud/developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ApiPromise } from '@polkadot/api';
import type { MaybeAddress } from '@w3ux/react-connect-kit/types';
import type { AnyJson } from '@w3ux/utils/types';
import type { ChainId } from 'config/networks/types';
import type { ApiInstanceId } from 'model/Api/types';

export interface UseSubmitExtrinsicProps {
  instanceId: ApiInstanceId;
  api: ApiPromise;
  chainId: ChainId;
  ss58Prefix: number;
  tx: AnyJson;
  from: MaybeAddress;
  shouldSubmit: boolean;
  callbackSubmit?: () => void;
  callbackInBlock?: () => void;
}

export interface UseSubmitExtrinsic {
  uid: number;
  onSubmit: () => void;
  submitting: boolean;
  proxySupported: boolean;
  submitAddress: MaybeAddress;
}
