// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { StatsWrapper } from '../Wrappers';
import { AccountsWrapper } from './Wrappers';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDownLong } from '@fortawesome/free-solid-svg-icons';
import { useActiveTab } from 'contexts/ActiveTab';
import { Account } from './Account';
import BigNumber from 'bignumber.js';
import { useTabAccounts } from 'contexts/TabAccounts';
import { FlexWrapper } from 'routes/Common/Wrappers';
import { useChainSpaceEnv } from 'contexts/ChainSpaceEnv';

export const Accounts = () => {
  const { accounts } = useTabAccounts();
  const { getChainSpec } = useChainSpaceEnv();
  const { tab, apiInstanceId } = useActiveTab();

  const chainSpec = getChainSpec(apiInstanceId);

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
            chainId={tab?.taskData?.chain?.id}
            key={`imported_account_${i}`}
          />
        ))}
      </AccountsWrapper>
    </FlexWrapper>
  );
};
