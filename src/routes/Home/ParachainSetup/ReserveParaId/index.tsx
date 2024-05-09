// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { AccountId32 } from 'library/Inputs/AccountId32';
import { useImportedAccounts } from 'contexts/ImportedAccounts';
import { FormWrapper } from 'routes/Home/Wrappers';
import { useChainSpaceEnv } from 'contexts/ChainSpaceEnv';

export const ReserveParaId = () => {
  const { getChainApi } = useChainSpaceEnv();
  const { getAccounts } = useImportedAccounts();

  const relayInstance = getChainApi(0);
  const chainSpec = relayInstance?.chainSpec;

  const accounts =
    chainSpec && chainSpec.chain
      ? getAccounts(chainSpec.chain, chainSpec.ss58Prefix)
      : [];

  return (
    <FormWrapper>
      <h3>Reserve a Para ID or select an existing one from your accounts.</h3>

      <section>
        <h4>Para ID Owner</h4>
        <AccountId32 accounts={accounts} />
      </section>
    </FormWrapper>
  );
};
