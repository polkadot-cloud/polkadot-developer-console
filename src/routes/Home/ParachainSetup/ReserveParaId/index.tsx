// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { AccountId32 } from 'library/Inputs/AccountId32';
import { FormWrapper } from '../Wrappers';
import type { StepProps } from '../types';
import { useImportedAccounts } from 'contexts/ImportedAccounts';

export const ReserveParaId = ({ relayInstance }: StepProps) => {
  const { getAccounts } = useImportedAccounts();

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
