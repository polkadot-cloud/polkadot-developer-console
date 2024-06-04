// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { InputCallbackProps } from '../types';

export type SelectProps = InputCallbackProps & {
  values: string[];
  icons?: string[];
  label?: string | number;
  value: string;
  disabled?: boolean;
};
