// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// Destructure subscription key into index key.
export const splitChainStateKey = (
  subscriptionKey: string
): [string, string] => {
  const result = subscriptionKey.split(/_(.*)/s);
  return [result[0] || '', result[1] || ''];
};
