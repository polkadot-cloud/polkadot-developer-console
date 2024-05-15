// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ImportedAccount } from '@w3ux/react-connect-kit/types';
import type { InputCallbackProps } from '../types';

export type AccountId32Props = InputCallbackProps & {
  accounts: ImportedAccount[];
};
