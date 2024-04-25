// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SubscriptionResultsWrapper } from '../../Wrappers';
import { useChainState } from 'contexts/ChainState';
import { SubscriptionResult } from './Result';

export const SubscriptionResults = () => {
  const { getChainStateByType } = useChainState();
  const chainStateItems = getChainStateByType('raw');

  // Test raw storage key for timestamp.now():
  // 0xf0c365c3cf59d671eb72da0e7a4113c49f1f0515f462cdcf84e0f1d6045dfcbb

  return (
    <SubscriptionResultsWrapper>
      {Object.entries(chainStateItems || {}).map(
        ([subscriptionKey, value], i) => {
          const { type, result } = value;
          return (
            <SubscriptionResult
              key={`${subscriptionKey}-${i}`}
              subscriptionKey={subscriptionKey}
              type={type}
              result={result}
            />
          );
        }
      )}
    </SubscriptionResultsWrapper>
  );
};
