// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// Destructure subscription key into index key.
export const splitSubscriptionKey = (
  subscriptionKey: string
): [string, string] => {
  const result = subscriptionKey.split('_');
  return [result[0] || '', result[1] || ''];
};

// Destructure subscription key into index key.
export const splitConstantKey = (
  constantKey: string
): [string, string, string] => {
  const result = constantKey.split('_');
  return [result[0] || '', result[1] || '', result[2] || ''];
};
