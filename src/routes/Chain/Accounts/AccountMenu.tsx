// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ImportedAccount } from '@w3ux/react-connect-kit/types';
import type { ChainId } from 'config/networks';
import { ListWrapper, SelectListWrapper } from 'library/ContextMenu/Wrappers';

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
            <div className="none">
              {/* NOTE: Subscan SVG can be placed here when available. */}
              {/* <FontAwesomeIcon icon={faBarsProgress} transform="shrink-2" /> */}
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
