// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { StatsWrapper } from '../Wrappers';
import { AccountsWrapper } from './Wrappers';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDownLong } from '@fortawesome/free-solid-svg-icons';
import { Account } from './Account';
import { useAccounts } from 'contexts/Accounts';
import { FlexWrapper } from 'routes/Common/Wrappers';
import { useChain } from '../Provider';

export const Accounts = () => {
  const { getAccounts } = useAccounts();
  const { chain, chainSpec } = useChain();

  const accounts = getAccounts(chainSpec);
  const existentialDeposit = chainSpec.consts.existentialDeposit;

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
            chainId={chain?.id}
            key={`imported_account_${i}`}
          />
        ))}
      </AccountsWrapper>
    </FlexWrapper>
  );
};
