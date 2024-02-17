// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { TagsContextInterface } from './types';

export const defaultTagsConfig = {
  'Relay Chain': [
    'polkadot-relay-chain',
    'kusama-relay-chain',
    'westend-relay-chain',
  ],
  'Test Network': ['westend-relay-chain'],
};

export const defaultTagsContext: TagsContextInterface = {
  tagsConfig: defaultTagsConfig,
  setTagsConfig: (newTagsConfig) => {},
  getTagsForChain: (chain) => [],
};
