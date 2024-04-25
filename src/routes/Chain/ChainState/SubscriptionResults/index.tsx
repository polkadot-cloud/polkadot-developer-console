// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SubscriptionResultsWrapper } from '../../Wrappers';
import { useChainState } from 'contexts/ChainState';
import { SubscriptionResult } from './Result';
import { splitSubscriptionKey } from 'model/ChainState/util';

export const SubscriptionResults = () => {
  const { getChainStateByType } = useChainState();

  const chainStateItems = getChainStateByType('raw');

  return (
    <SubscriptionResultsWrapper>
      {Object.entries(chainStateItems || {}).map(([subscriptionKey, value]) => {
        const { type, result } = value;
        const [index, rawKey] = splitSubscriptionKey(subscriptionKey);

        return (
          <SubscriptionResult
            key={`${index}-${rawKey}`}
            subscriptionKey={subscriptionKey}
            type={type}
            result={result}
          />
        );
      })}
    </SubscriptionResultsWrapper>
  );
};
