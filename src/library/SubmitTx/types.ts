// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import type { MaybeAddress } from '@w3ux/react-connect-kit/types';
import type BigNumber from 'bignumber.js';
import type { ChainId } from 'config/networks/types';
import type { ApiInstanceId } from 'model/Api/types';
import type { ReactNode } from 'react';
import type { DisplayFor } from 'types';

export type SubmitTxProps = SubmitProps & {
  buttons?: ReactNode[];
  submitAddress?: MaybeAddress;
  noMargin?: boolean;
  existentialDeposit: BigNumber;
};

export interface SubmitProps {
  instanceId: ApiInstanceId;
  chainId: ChainId;
  ss58Prefix: number;
  units: number;
  unit: string;
  uid?: number;
  onSubmit: () => void;
  submitting: boolean;
  valid: boolean;
  submitText?: string;
  submitAddress: MaybeAddress;
  displayFor?: DisplayFor;
}

export interface SignerPromptProps {
  instanceId: ApiInstanceId;
  submitAddress: MaybeAddress;
}

export interface LedgerSubmitProps {
  onSubmit: () => void;
  submitting: boolean;
  displayFor?: DisplayFor;
  disabled: boolean;
  submitText?: string;
}

export interface ButtonSubmitLargeProps {
  disabled: boolean;
  onSubmit: () => void;
  submitText: string;
  icon?: IconProp;
  iconTransform?: string;
  pulse: boolean;
}
