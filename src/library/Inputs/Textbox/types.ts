// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { InputCallbackProps } from '../types';

export type TextboxProps = InputCallbackProps & {
  label?: { short?: string; long?: string } | string | number;
  defaultValue: string;
  numeric?: boolean;
};