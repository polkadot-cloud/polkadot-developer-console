// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { ChainStateResultWrapper, FilterWrapper } from '../../Wrappers';
import { useChainState } from 'contexts/ChainState';
import { ChainStateResult } from './Result';
import { splitSubscriptionKey } from 'model/ChainState/util';
import type {
  StorageSubscriptionType,
  StorageType,
} from 'model/ChainState/types';
import type {
  ChainStateConstants,
  ChainStateSubscriptions,
} from 'contexts/ChainState/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDiagramSubtask,
  faFilterList,
} from '@fortawesome/pro-duotone-svg-icons';
import { useChainUi } from 'contexts/ChainUi';
import { useActiveTab } from 'contexts/ActiveTab';
import { useTabs } from 'contexts/Tabs';

export const Results = ({
  storageType,
  withSpacer = true,
}: {
  storageType?: StorageType;
  withSpacer?: boolean;
}) => {
  const { tabId } = useActiveTab();
  const { setTabActivePage } = useTabs();
  const { getStorageItemFilter, setStorageItemFilter } = useChainUi();
  const { getChainStateByType, chainStateConstants, getTotalChainStateItems } =
    useChainState();

  const filtered = storageType
    ? getStorageItemFilter(tabId, storageType)
    : false;

  let chainStateItems: ChainStateSubscriptions | ChainStateConstants = {};

  // Include raw and storage results if display allows.
  if (['raw', 'storage', undefined].includes(storageType) || !filtered) {
    chainStateItems = getChainStateByType(
      filtered === true ? (storageType as StorageSubscriptionType) : undefined
    );
  }

  // Include constant results if display allows.
  if (['constant', undefined].includes(storageType) || !filtered) {
    chainStateItems = {
      ...chainStateItems,
      ...chainStateConstants,
    };
  }

  // If no storageType is given, filter out items that are not pinned.
  const filteredChainStateItems =
    storageType === undefined
      ? Object.fromEntries(
          Object.entries(chainStateItems).filter(([, val]) => val.pinned)
        )
      : chainStateItems;

  // Sort items based on timestamp.
  const sortedChainStateItems: ChainStateSubscriptions | ChainStateConstants =
    Object.fromEntries(
      Object.entries(filteredChainStateItems).sort(([, itemA], [, itemB]) =>
        itemA.timestamp < itemB.timestamp
          ? -1
          : itemA.timestamp > itemB.timestamp
            ? 1
            : 0
      )
    );

  // Gets label associated with storage type.
  const getStorageTypeLabel = () => {
    switch (storageType) {
      case 'constant':
        return 'Constants';
      case 'raw':
        return 'Raw';
      case 'storage':
        return 'Storage';
    }
  };

  // Entries of sorted chain state items.
  const chainStateItemEntries = Object.entries(sortedChainStateItems);

  return (
    <>
      <FilterWrapper className={withSpacer ? 'withSpacer' : undefined}>
        {getTotalChainStateItems() > 0 && !!storageType && (
          <button
            className={filtered ? 'active' : ''}
            onClick={() => {
              setStorageItemFilter(tabId, storageType, !filtered);
            }}
          >
            {filtered ? `${getStorageTypeLabel()} Only` : 'Filter'}
            <FontAwesomeIcon icon={faFilterList} />
          </button>
        )}
      </FilterWrapper>

      <ChainStateResultWrapper>
        {!chainStateItemEntries.length ? (
          storageType === undefined ? (
            <h4>
              No pinned chain state. Visit{' '}
              <button
                type="button"
                onClick={() => setTabActivePage(tabId, 'default', 1)}
              >
                <FontAwesomeIcon icon={faDiagramSubtask} transform="shrink-2" />
                Chain State
              </button>{' '}
              to query and pin chain state items.
            </h4>
          ) : null
        ) : (
          Object.entries(sortedChainStateItems)
            .reverse()
            .map(([key, value]) => {
              const [index, rawKey] = splitSubscriptionKey(key);
              const { type, result, pinned } = value;

              return (
                <ChainStateResult
                  key={`${index}-${rawKey}`}
                  chainStateKey={key}
                  type={type}
                  result={result}
                  pinned={pinned}
                />
              );
            })
        )}
      </ChainStateResultWrapper>
    </>
  );
};
