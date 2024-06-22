// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { InputFormContextInterface } from './types';

export const defaultInputFormContext: InputFormContextInterface = {
  namespace: 'storage',
  inputMetaRef: { current: {} },
  handleSubmit: () => ({}),
};
