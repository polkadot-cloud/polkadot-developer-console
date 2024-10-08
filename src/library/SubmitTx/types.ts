// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { MaybeAddress } from '@w3ux/react-connect-kit/types';
import type BigNumber from 'bignumber.js';
import type { ChainId } from 'config/networks/types';
import type { ApiInstanceId } from 'model/Api/types';
import type { FC, ReactNode } from 'react';
import type { DisplayFor } from '@w3ux/types';
import type { IconProps } from '@polkadot-cloud/icons';

export type SubmitTxProps = SubmitProps & {
  instanceId: ApiInstanceId;
  chainId: ChainId;
  ss58Prefix: number;
  units: number;
  unit: string;
  buttons?: ReactNode[];
  submitAddress?: MaybeAddress;
  noMargin?: boolean;
  valid?: boolean;
  existentialDeposit: BigNumber;
  transactionVersion: string;
  style?: SubmitTxStyleProps;
};

export interface SubmitTxStyleProps {
  noBorder?: boolean;
}

export interface SubmitProps {
  uid?: number;
  onSubmit: () => void;
  submitting: boolean;
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
  submitAddress: MaybeAddress;
}

export interface ButtonSubmitLargeProps {
  disabled: boolean;
  onSubmit: () => void;
  submitText: string;
  icon?: FC<IconProps>;
  iconTransform?: string;
  pulse: boolean;
}
