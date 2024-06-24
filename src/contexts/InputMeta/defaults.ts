// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { InputMetaContextInterface } from './types';

export const defaultInputMetaContext: InputMetaContextInterface = {
  getInputMetaValue: (tabId, inputId) => undefined,
  setInputMetaValue: (tabId, inputId, value) => {},
  removeInputMetaValue: (tabId, inputId) => {},
  destroyInputMeta: (tabId) => {},
};
