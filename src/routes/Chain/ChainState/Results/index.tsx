// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ChainStateResultWrapper } from '../../Wrappers';
import { useChainState } from 'contexts/ChainState';
import { ChainStateResult } from './Result';
import { splitSubscriptionKey } from 'model/ChainState/util';

export const Results = () => {
  const { getChainStateByType } = useChainState();

  const chainStateItems = getChainStateByType('raw');

  return (
    <ChainStateResultWrapper>
      {Object.entries(chainStateItems || {}).map(([subscriptionKey, value]) => {
        const { type, result } = value;
        const [index, rawKey] = splitSubscriptionKey(subscriptionKey);

        return (
          <ChainStateResult
            key={`${index}-${rawKey}`}
            subscriptionKey={subscriptionKey}
            type={type}
            result={result}
          />
        );
      })}
    </ChainStateResultWrapper>
  );
};
