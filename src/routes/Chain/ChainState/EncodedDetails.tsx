// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { capitalizeFirstLetter, removeHexPrefix } from '@w3ux/utils';
import { EncodedWrapper } from '../Wrappers';
import type { EncodedDetailsProps } from './types';
import { xxhashAsHex } from '@polkadot/util-crypto';
import { faClone } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useOneShotTooltip } from 'contexts/OneShotTooltip';
import { useRef } from 'react';

export const EncodedDetails = ({
  activePallet,
  activeItem,
}: EncodedDetailsProps) => {
  const { openTooltip } = useOneShotTooltip();

  const activePalletHash = removeHexPrefix(
    xxhashAsHex(capitalizeFirstLetter(activePallet), 128)
  );

  const activeItemHash = removeHexPrefix(
    xxhashAsHex(capitalizeFirstLetter(activeItem), 128)
  );

  // Copy button refs.
  const palletCopyRef = useRef<HTMLButtonElement>(null);
  const callCopyRef = useRef<HTMLButtonElement>(null);

  return (
    <EncodedWrapper>
      <div className="module">
        <section>
          <div>
            <h5>Pallet</h5>
          </div>

          <div>
            <h4>
              {activePalletHash}
              <span>
                <button
                  ref={palletCopyRef}
                  onClick={() => {
                    navigator.clipboard.writeText(activePalletHash);
                    openTooltip('Copied!', palletCopyRef);
                  }}
                >
                  <FontAwesomeIcon icon={faClone} transform="shrink-2" />
                </button>
              </span>
            </h4>
          </div>
        </section>
        <section>
          <div>
            <h5>Call</h5>
          </div>

          <div>
            <h4>
              {activeItemHash}
              <span>
                <button
                  ref={callCopyRef}
                  onClick={() => {
                    navigator.clipboard.writeText(activeItemHash);
                    openTooltip('Copied!', callCopyRef);
                  }}
                >
                  <FontAwesomeIcon icon={faClone} transform="shrink-2" />
                </button>
              </span>
            </h4>
          </div>
        </section>
      </div>
    </EncodedWrapper>
  );
};
