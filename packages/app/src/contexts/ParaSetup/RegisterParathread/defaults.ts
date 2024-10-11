// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { RegisterParathreadContextInterface } from './types';

export const defaultRegisterParathreadContext: RegisterParathreadContextInterface =
  {
    getRuntimeValue: (tabId) => undefined,
    setRuntimeValue: (tabId, value) => {},
    getGenesisState: (tabId) => undefined,
    setGenesisState: (tabId, value) => {},
    removeTabParathreadData: (tabId) => {},
  };
