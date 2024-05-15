// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
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

export const Results = ({ display }: { display: StorageType | 'all' }) => {
  const { getChainStateByType, chainStateConstants } = useChainState();

  let chainStateItems: ChainStateSubscriptions | ChainStateConstants = {};

  // Include raw and storage results if display allows.
  if (['raw', 'storage', 'all'].includes(display)) {
    chainStateItems = getChainStateByType('raw');
  }

  // Include constant results if display allows.
  if (['constant', 'all'].includes(display)) {
    chainStateItems = { ...getChainStateByType('raw'), ...chainStateConstants };
  }

  // Sort items based on timestamp.
  const sortedChainStateItems: ChainStateSubscriptions | ChainStateConstants =
    Object.fromEntries(
      Object.entries(chainStateItems).sort(([, itemA], [, itemB]) =>
        itemA.timestamp < itemB.timestamp
          ? -1
          : itemA.timestamp > itemB.timestamp
            ? 1
            : 0
      )
    );

  return (
    <ChainStateResultWrapper>
      {Object.entries(sortedChainStateItems)
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
