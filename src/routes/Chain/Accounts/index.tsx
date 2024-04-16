// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FlexWrapper, StatsWrapper } from '../Wrappers';
import { AccountsWrapper } from './Wrappers';
import {
  useExtensionAccounts,
  useVaultAccounts,
} from '@w3ux/react-connect-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDownLong } from '@fortawesome/free-solid-svg-icons';
import { useApi } from 'contexts/Api';
import { useActiveTabId } from 'contexts/ActiveTab';
import { Account } from './Account';

export const Accounts = () => {
  const { getChainSpec } = useApi();
  const activeTabId = useActiveTabId();
  const { getVaultAccounts } = useVaultAccounts();
  const { getExtensionAccounts } = useExtensionAccounts();

  const chainSpec = getChainSpec(activeTabId);

  const accounts =
    chainSpec && chainSpec.chain
      ? getExtensionAccounts(chainSpec.ss58Prefix).concat(
          getVaultAccounts(chainSpec.chain)
        )
      : [];

  return (
    <FlexWrapper>
      <StatsWrapper>
        <div className="active">
          <FontAwesomeIcon
            icon={faArrowDownLong}
            transform={'shrink-2'}
            className="icon"
          />{' '}
          {accounts.length || 'No'}{' '}
          {accounts.length === 1 ? 'Account' : 'Accounts'} Imported
        </div>
      </StatsWrapper>
      <AccountsWrapper>
        {accounts.map((account, i) => (
          <Account account={account} key={`imported_account_${i}`} />
        ))}
      </AccountsWrapper>
    </FlexWrapper>
  );
};
