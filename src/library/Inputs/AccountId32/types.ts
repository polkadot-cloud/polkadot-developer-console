// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { ImportedAccount } from '@w3ux/react-connect-kit/types';
import type { InputCallbackProps } from '../types';
import type { RefObject } from 'react';

export type AccountId32Props = InputCallbackProps & {
  inputId: string;
  accounts: ImportedAccount[];
  defaultAddress: string | undefined;
  heightRef?: RefObject<HTMLDivElement>;
  disabled?: boolean;
  disabledText?: string;
};

export interface AccountId32ReadOnlyProps {
  defaultAddress: string | undefined;
  accounts: ImportedAccount[];
  emptyText?: string;
}
