// Copyright 2024 @polkadot-cloud/developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FlexWrapper } from '../Wrappers';
import { AccountsWrapper } from './Wrappers';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDownLong } from '@fortawesome/free-solid-svg-icons';
import { Account } from './Account';
import { useAccounts } from 'contexts/Accounts';
import { StatsWrapper } from 'routes/Chain/Wrappers';
import type { AccountsProps } from './types';

export const Accounts = ({ instanceId, chain, chainSpec }: AccountsProps) => {
  const { getAccounts } = useAccounts();
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
            key={`imported_account_${i}`}
            instanceId={instanceId}
            existentialDeposit={existentialDeposit}
            account={account}
            chain={chain}
            chainId={chain?.id}
          />
        ))}
      </AccountsWrapper>
    </FlexWrapper>
  );
};
