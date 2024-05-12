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
import { useApiIndexer } from 'contexts/ApiIndexer';

export const Accounts = () => {
  const { tab, ownerId } = useActiveTab();
  const { getAccounts } = useTabAccounts();
  const { getTabApiIndex } = useApiIndexer();
  const { getChainSpec } = useChainSpaceEnv();

  const apiInstanceId = getTabApiIndex(ownerId, 'chainBrowser')?.instanceId;
  const chainSpec = getChainSpec(apiInstanceId);

  const existentialDeposit =
    chainSpec?.consts?.existentialDeposit || new BigNumber(0);

  const accounts = getAccounts(chainSpec);

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
