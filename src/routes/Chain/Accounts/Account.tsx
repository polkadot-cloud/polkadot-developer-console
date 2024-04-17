// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ellipsisFn, planckToUnit, remToUnit } from '@w3ux/utils';
import type { AccountProps } from './types';
import { Polkicon } from '@w3ux/react-polkicon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCopy } from '@fortawesome/free-solid-svg-icons';
import { useMenu } from 'contexts/Menu';
import { AccountContextMenu } from './AccountMenu';
import { useTabs } from 'contexts/Tabs';
import { useActiveTabId } from 'contexts/ActiveTab';
import { useAccounts } from 'contexts/Accounts';
import BigNumber from 'bignumber.js';
import type { DirectoryId } from 'config/networks';
import { NetworkDirectory } from 'config/networks';

export const Account = ({ account, chainId }: AccountProps) => {
  const { getTab } = useTabs();
  const { openMenu } = useMenu();
  const activeTabId = useActiveTabId();
  const { getAccountBalance } = useAccounts();

  const { name, address } = account;
  const tab = getTab(activeTabId);
  const balances = getAccountBalance(address);

  // TODO: Deduct account locks.
  const freePlanck = balances?.balance?.free || new BigNumber(0);

  // NOTE: assuming chain definitely exists here.
  // TODO: Move chain unit and ss58 prefix to tab settings and assign for customEndpoint also.
  const unit = chainId ? NetworkDirectory[chainId as DirectoryId].unit : 'UNIT';

  return (
    <section>
      <div className="inner">
        <div className="icon">
          <Polkicon address={address} size={remToUnit('1.7rem')} />
        </div>
        <div className="content">
          {/* NOTE: Currently hiding menu on custom endpoint connections as there is no guarantee Subscan will have the connected chain supported. Once menu contains more links, this check can happen inside the menu. */}
          {chainId && tab?.connectFrom !== 'customEndpoint' && (
            <div className="menu">
              <button
                onClick={(ev) => {
                  openMenu(
                    ev,
                    <AccountContextMenu account={account} chainId={chainId} />
                  );
                }}
              >
                <FontAwesomeIcon icon={faBars} transform="shrink-6" />
              </button>
            </div>
          )}
          <div className="name">
            <h3>{name}</h3>
          </div>
          <div className="address">
            <h5>
              {ellipsisFn(address, 7)}
              <button
                className="copy"
                onClick={() => navigator.clipboard.writeText(address)}
              >
                <FontAwesomeIcon icon={faCopy} transform="shrink-4" />
              </button>
            </h5>
          </div>
          <div className="free">
            <h5>
              <span>Free:</span>{' '}
              {planckToUnit(freePlanck, 10).decimalPlaces(3).toFormat()} {unit}
            </h5>
          </div>
        </div>
      </div>
    </section>
  );
};
