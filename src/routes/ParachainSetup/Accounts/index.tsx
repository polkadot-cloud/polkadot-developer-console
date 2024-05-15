// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Accounts as AccountsCommon } from 'routes/Common/Accounts';
import { useParachain } from '../Provider';

export const Accounts = () => {
  const { chain, chainSpec, apiInstanceId } = useParachain();

  return (
    <AccountsCommon
      apiInstanceId={apiInstanceId}
      chain={chain}
      chainSpec={chainSpec}
    />
  );
};
