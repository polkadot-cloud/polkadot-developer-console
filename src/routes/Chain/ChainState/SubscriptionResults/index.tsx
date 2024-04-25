// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SubscriptionResultsWrapper } from '../../Wrappers';
import { useChainState } from 'contexts/ChainState';
import { SubscriptionResult } from './Result';

export const SubscriptionResults = () => {
  const { getChainStateByType } = useChainState();
  const chainStateItems = getChainStateByType('raw');

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
