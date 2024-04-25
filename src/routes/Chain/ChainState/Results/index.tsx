// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ChainStateResultWrapper } from '../../Wrappers';
import { useChainState } from 'contexts/ChainState';
import { ChainStateResult } from './Result';
import { splitChainStateKey } from 'model/ChainState/util';
import type { StorageType } from 'model/ChainState/types';
import type {
  ChainStateConstants,
  ChainStateSubscriptions,
} from 'contexts/ChainState/types';

export const Results = ({ display }: { display: StorageType }) => {
  const { getChainStateByType, chainStateConstants } = useChainState();

  let chainStateItems: ChainStateSubscriptions | ChainStateConstants = {};
  if (['raw', 'storage'].includes(display)) {
    chainStateItems = getChainStateByType('raw');
  }

  if (display === 'constant') {
    chainStateItems = chainStateConstants;
  }

  return (
    <ChainStateResultWrapper>
      {Object.entries(chainStateItems || {})
        .reverse()
        .map(([key, value]) => {
          const [index, rawKey] = splitChainStateKey(key);
          const { type, result } = value;

          return (
            <ChainStateResult
              key={`${index}-${rawKey}`}
              chainStateKey={key}
              type={type}
              result={result}
            />
          );
        })}
    </ChainStateResultWrapper>
  );
};
