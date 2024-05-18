// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { capitalizeFirstLetter, removeHexPrefix } from '@w3ux/utils';
import { EncodedWrapper } from '../Wrappers';
import type { EncodedDetailsProps } from './types';
import { xxhashAsHex } from '@polkadot/util-crypto';
import { ButtonCopy } from 'library/Buttons/ButtonCopy';

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
              <span>
                <ButtonCopy
                  copyText={activePalletHash}
                  tooltipText="Copied!"
                  id="copy_pallet_hash"
                  transform="shrink-3"
                />
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
                <ButtonCopy
                  copyText={activeItemHash}
                  tooltipText="Copied!"
                  id="copy_call_hash"
                  transform="shrink-3"
                />
              </span>
            </h4>
          </div>
        </section>
      </div>
    </EncodedWrapper>
  );
};
