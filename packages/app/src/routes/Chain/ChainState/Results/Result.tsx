// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { iconThumbtack, iconXMark } from '@polkadot-cloud/icons/duotone';
import { capitalizeFirstLetter } from '@w3ux/utils';
import type { ChainStateResultProps } from '../types';
import { splitConstantKey, splitSubscriptionKey } from 'model/ChainState/util';
import { useChainState } from 'contexts/ChainState';
import { ButtonIcon } from 'library/Buttons/ButtonIcon';
import { formatJSON } from './Utils';
import { CloudIcon } from '@polkadot-cloud/icons';

export const ChainStateResult = ({
  chainStateKey,
  type,
  result,
  pinned,
}: ChainStateResultProps) => {
  const rawKey = ['raw', 'storage'].includes(type)
    ? splitSubscriptionKey(chainStateKey)[1]
    : `${splitConstantKey(chainStateKey)[1]}.${splitConstantKey(chainStateKey)[2]}`;

  const { removeChainStateItem, setItemPinned } = useChainState();

  // Convert the result into JSON.
  const resultJson = result?.toJSON();

  // Determine whether the result is empty.
  const isEmpty =
    [null, ''].includes(resultJson) ||
    (Array.isArray(resultJson) && resultJson.length === 0);

  // Format the JSON for display if it is not empty.
  const display =
    result === undefined ? '...' : !isEmpty ? formatJSON(resultJson) : 'None';

  return (
    <section>
      <div className="inner">
        <div className="header">
          <h5>
            {capitalizeFirstLetter(type)}: {rawKey}
          </h5>
        </div>
        <div className="value">
          <div>
            <h4>{display}</h4>
          </div>
          <div>
            <ButtonIcon
              tooltipText="Copied!"
              id={`result_${type}_${rawKey}`}
              transform="shrink-3"
              onClick={() => {
                navigator.clipboard.writeText(display);
              }}
            />
          </div>
        </div>
      </div>
      <div className="dismiss">
        <button
          className="close"
          onClick={() => removeChainStateItem(type, chainStateKey)}
        >
          <CloudIcon icon={iconXMark} />
        </button>
        <button
          className={pinned ? 'active' : undefined}
          onClick={() => {
            setItemPinned(type, chainStateKey, !pinned);
          }}
        >
          <CloudIcon icon={iconThumbtack} transform="shrink-2" />
        </button>
      </div>
    </section>
  );
};
