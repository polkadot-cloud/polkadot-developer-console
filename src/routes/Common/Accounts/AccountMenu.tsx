// Copyright 2024 @polkadot-cloud/developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ImportedAccount } from '@w3ux/react-connect-kit/types';
import type { ChainId } from 'config/networks/types';
import { ListWrapper, SelectListWrapper } from 'library/ContextMenu/Wrappers';
import SubscanIconGrayscaleSVG from 'svg/SubscanIconGrayscale.svg?react';

export const AccountContextMenu = ({
  chainId,
  account,
}: {
  chainId: ChainId;
  account: ImportedAccount;
}) => {
  const { address } = account;

  return (
    <SelectListWrapper>
      <ListWrapper>
        <li>
          <button
            onClick={() => {
              // NOTE: Attempts to go to Subscan with the currently connected chain and address.
              // Assumes that `chainId` matches the chain name on Subscan.
              open(`https://${chainId}.subscan.io/account/${address}`);
            }}
          ></button>
          <div className="inner">
            <div>
              <SubscanIconGrayscaleSVG className="svg" />
            </div>
            <div>
              <h3>View on Subscan</h3>
            </div>
            <div>
              <FontAwesomeIcon icon={faExternalLinkAlt} transform="shrink-4" />
            </div>
          </div>
        </li>
      </ListWrapper>
    </SelectListWrapper>
  );
};
