// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FlexWrapper, StatsWrapper } from '../Wrappers';
import { AccountsWrapper } from './Wrappers';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDownLong } from '@fortawesome/free-solid-svg-icons';
import { useApi } from 'contexts/Api';
import { useActiveTab } from 'contexts/ActiveTab';
import { Account } from './Account';
import BigNumber from 'bignumber.js';
import { useAccounts } from 'contexts/Accounts';

export const Accounts = () => {
  const { getChainSpec } = useApi();
  const { accounts } = useAccounts();
  const { tab, ownerId } = useActiveTab();

  const chainSpec = getChainSpec(ownerId);

  const existentialDeposit =
    chainSpec?.consts?.existentialDeposit || new BigNumber(0);

  return (
    <FlexWrapper>
      <StatsWrapper>
        <div className="active">
          <FontAwesomeIcon
            icon={faArrowDownLong}
            transform={'shrink-2'}
            className="icon"
          />
          {accounts.length || 'No'}{' '}
          {accounts.length === 1 ? 'Account' : 'Accounts'} Imported
        </div>
      </StatsWrapper>
      <AccountsWrapper>
        {accounts.map((account, i) => (
          <Account
            existentialDeposit={existentialDeposit}
            account={account}
            chainId={tab?.chain?.id}
            key={`imported_account_${i}`}
          />
        ))}
      </AccountsWrapper>
    </FlexWrapper>
  );
};
