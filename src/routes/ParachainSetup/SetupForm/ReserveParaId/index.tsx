// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { AccountId32 } from 'library/Inputs/AccountId32';
import { useImportedAccounts } from 'contexts/ImportedAccounts';
import { FormWrapper } from 'routes/Home/Wrappers';
import { useParachain } from 'routes/ParachainSetup/Provider';

export const ReserveParaId = () => {
  const { chainSpec } = useParachain();
  const { getAccounts } = useImportedAccounts();

  const accounts =
    chainSpec && chainSpec.chain
      ? getAccounts(chainSpec.chain, chainSpec.ss58Prefix)
      : [];

  return (
    <FormWrapper>
      <h3>Reserve a Para ID or select an existing one from your accounts.</h3>

      <section>
        <AccountId32 accounts={accounts} />
      </section>
    </FormWrapper>
  );
};
