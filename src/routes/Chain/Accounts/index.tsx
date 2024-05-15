// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useChain } from '../Provider';
import { Accounts as AccountsCommon } from 'routes/Common/Accounts';

export const Accounts = () => {
  const { chain, chainSpec, apiInstanceId } = useChain();

  return (
    <AccountsCommon
      apiInstanceId={apiInstanceId}
      chain={chain}
      chainSpec={chainSpec}
    />
  );
};
