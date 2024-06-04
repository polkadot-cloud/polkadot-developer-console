// Copyright 2024 @polkadot-cloud/developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ellipsisFn, planckToUnit, remToUnit } from '@w3ux/utils';
import type { AccountProps } from './types';
import { Polkicon } from '@w3ux/react-polkicon';
import { useMenu } from 'contexts/Menu';
import { AccountContextMenu } from './AccountMenu';
import { useActiveTab } from 'contexts/ActiveTab';
import { useAccounts } from 'contexts/Accounts';
import BigNumber from 'bignumber.js';
import { ButtonIcon } from 'library/Buttons/ButtonIcon';
import { AccountWrapper } from './Wrappers';
import { ButtonIconCircle } from 'library/Buttons/ButtonIconCircle';
import { faBars, faPaperPlane } from '@fortawesome/pro-solid-svg-icons';
import { useOverlay } from 'library/Overlay/Provider';
import { useChainSpaceEnv } from 'contexts/ChainSpaceEnv';
import { useChain } from 'routes/Chain/Provider';

export const Account = ({
  instanceId,
  account,
  chain,
  chainId,
  existentialDeposit,
}: AccountProps) => {
  const { tab } = useActiveTab();
  const { openMenu } = useMenu();
  const { api: apiInstance } = useChain();
  const { openModal } = useOverlay().modal;
  const { getChainSpec } = useChainSpaceEnv();
  const { getBalance, getLocks } = useAccounts();

  const chainSpec = getChainSpec(instanceId);
  const { name, address } = account;
  const unit = chain.unit;
  const units = chain.units;
  const ss58Prefix = chain.ss58;

  const balance = getBalance(instanceId, address);
  const { maxLock } = getLocks(instanceId, address);

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

  return (
    <AccountWrapper>
      <div className="inner">
        <div className="icon">
          <Polkicon address={address} size={remToUnit('1.9rem')} />
        </div>
        <div className="content">
          {/* NOTE: Currently hiding menu on custom endpoint connections as there is no guarantee Subscan will have the connected chain supported. Once menu contains more links, this check can happen inside the menu. */}
          {chainId && tab?.taskData?.connectFrom !== 'customEndpoint' && (
            <div className="menu">
              <ButtonIconCircle
                id={`account_transfer_${address}`}
                icon={faPaperPlane}
                transform="shrink-4"
                tooltipText="Transfer Funds"
                onClick={() => {
                  openModal({
                    key: 'Transfer',
                    options: {
                      address,
                      instanceId,
                      chainId,
                      unit,
                      units,
                      api: apiInstance,
                      ss58Prefix,
                      existentialDeposit,
                      transactionVersion: chainSpec?.version.transactionVersion,
                    },
                  });
                }}
              />
              <ButtonIconCircle
                id={`account_menu_${address}`}
                icon={faBars}
                transform="shrink-5"
                tooltipText="More Options"
                onClick={(ev) => {
                  openMenu(
                    ev,
                    <AccountContextMenu account={account} chainId={chainId} />
                  );
                }}
              />
            </div>
          )}
          <div className="name">
            <h3>{name}</h3>
          </div>
          <div className="address">
            <h5>
              {ellipsisFn(address, 7)}
              <ButtonIcon
                tooltipText="Copied!"
                id={`account_copy_${address}`}
                transform="shrink-4"
                onClick={() => {
                  navigator.clipboard.writeText(address);
                }}
              />
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
    </AccountWrapper>
  );
};
