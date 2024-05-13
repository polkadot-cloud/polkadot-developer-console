// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ellipsisFn, planckToUnit, remToUnit } from '@w3ux/utils';
import type { AccountProps } from './types';
import { Polkicon } from '@w3ux/react-polkicon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCopy } from '@fortawesome/free-solid-svg-icons';
import { useMenu } from 'contexts/Menu';
import { AccountContextMenu } from './AccountMenu';
import { useActiveTab } from 'contexts/ActiveTab';
import { useAccounts } from 'contexts/Accounts';
import BigNumber from 'bignumber.js';
import { useChain } from '../Provider';

export const Account = ({
  account,
  chainId,
  existentialDeposit,
}: AccountProps) => {
  const { openMenu } = useMenu();
  const { tab } = useActiveTab();
  const { apiInstanceId } = useChain();
  const { getBalance, getLocks } = useAccounts();

  const { name, address } = account;

  const balance = getBalance(apiInstanceId, address);
  const { maxLock } = getLocks(apiInstanceId, address);

  // Calculate a forced amount of free balance that needs to be reserved to keep the account alive.
  // Deducts `locks` from free balance reserve needed.
  const edReserved = BigNumber.max(existentialDeposit.minus(maxLock), 0);

  // Free balance with locks and reserves not deducted.
  const balanceFree = balance.free || new BigNumber(0);

  // Free balance with locks and reserves deducted.
  const freePlanck = BigNumber.max(
    0,
    balanceFree.minus(edReserved).minus(maxLock)
  );

  // NOTE: assuming tab and chain definitely exist here.
  const unit = tab!.taskData!.chain!.unit;
  const units = tab!.taskData!.chain!.units;

  return (
    <section>
      <div className="inner">
        <div className="icon">
          <Polkicon address={address} size={remToUnit('1.7rem')} />
        </div>
        <div className="content">
          {/* NOTE: Currently hiding menu on custom endpoint connections as there is no guarantee Subscan will have the connected chain supported. Once menu contains more links, this check can happen inside the menu. */}
          {chainId && tab?.taskData?.connectFrom !== 'customEndpoint' && (
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
              {planckToUnit(freePlanck, units).decimalPlaces(3).toFormat()}{' '}
              {unit}
            </h5>
          </div>
        </div>
      </div>
    </section>
  );
};
