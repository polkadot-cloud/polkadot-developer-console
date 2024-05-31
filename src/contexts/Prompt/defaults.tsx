// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { PromptContextInterface } from './types';

export const defaultPromptContext: PromptContextInterface = {
  setOnClosePrompt: (value) => {},
  openPromptWith: (Prompt, size) => {},
  closePrompt: () => {},
  setStatus: (status) => {},
  setPrompt: (Prompt) => {},
  size: 'small',
  status: 0,
  Prompt: null,
};
