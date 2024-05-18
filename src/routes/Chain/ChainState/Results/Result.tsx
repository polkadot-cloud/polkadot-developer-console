// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faThumbtack, faXmark } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { capitalizeFirstLetter } from '@w3ux/utils';
import type { ChainStateResultProps } from '../types';
import { splitConstantKey, splitSubscriptionKey } from 'model/ChainState/util';
import { useChainState } from 'contexts/ChainState';
import { ButtonCopy } from 'library/Buttons/ButtonCopy';

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

  // Readable display of the result.
  const display = result?.toHuman();

  // Should not happen, but just in case result is undefined or `toHuman()` fails on a result, don't
  // display it.
  if (display === undefined) {
    return null;
  }

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
            <ButtonCopy
              copyText={display}
              tooltipText="Copied!"
              id={`result_${type}_${rawKey}`}
              transform="shrink-3"
            />
          </div>
        </div>
      </div>
      <div className="dismiss">
        <button
          className="close"
          onClick={() => removeChainStateItem(type, chainStateKey)}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <button
          className={pinned ? 'active' : undefined}
          onClick={() => {
            setItemPinned(type, chainStateKey, !pinned);
          }}
        >
          <FontAwesomeIcon icon={faThumbtack} transform="shrink-2" />
        </button>
      </div>
    </section>
  );
};
