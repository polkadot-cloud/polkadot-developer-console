// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { capitalizeFirstLetter, removeHexPrefix } from '@w3ux/utils';
import { EncodedWrapper } from '../Wrappers';
import type { EncodedDetailsProps } from './types';
import { xxhashAsHex } from '@polkadot/util-crypto';
import { faClone } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const EncodedDetails = ({
  activePallet,
  activeItem,
}: EncodedDetailsProps) => {
  const activePalletHash = removeHexPrefix(
    xxhashAsHex(capitalizeFirstLetter(activePallet), 128)
  );

  const activeItemHash = removeHexPrefix(
    xxhashAsHex(capitalizeFirstLetter(activeItem), 128)
  );

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
              <button
                onClick={() => {
                  navigator.clipboard.writeText(activePalletHash);
                }}
              >
                <FontAwesomeIcon icon={faClone} transform="shrink-2" />
              </button>
            </h4>
          </div>
        </section>
        <section>
          <div>
            <h5>Method</h5>
          </div>

          <div>
            <h4>
              {activeItemHash}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(activeItemHash);
                }}
              >
                <FontAwesomeIcon icon={faClone} transform="shrink-2" />
              </button>
            </h4>
          </div>
        </section>
      </div>
    </EncodedWrapper>
  );
};
