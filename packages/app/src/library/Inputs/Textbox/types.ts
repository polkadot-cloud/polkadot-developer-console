// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { InputCallbackProps } from '../types';

export type TextboxProps = InputCallbackProps & {
  label?: string | number;
  value: string;
  numeric?: boolean;
  placeholder?: string;
  shrinkPlaceholder?: boolean;
};
