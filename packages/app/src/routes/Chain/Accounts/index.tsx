// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { useChain } from '../Provider';
import { Accounts as AccountsCommon } from 'routes/Common/Accounts';

export const Accounts = () => {
  const { chain, chainSpec, instanceId } = useChain();

  return (
    <AccountsCommon
      instanceId={instanceId}
      chain={chain}
      chainSpec={chainSpec}
    />
  );
};
