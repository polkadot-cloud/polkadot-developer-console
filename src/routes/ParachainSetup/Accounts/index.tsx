// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Accounts as AccountsCommon } from 'routes/Common/Accounts';
import { useParachain } from '../Provider';

export const Accounts = () => {
  const { chain, chainSpec, instanceId } = useParachain();

  return (
    <AccountsCommon
      instanceId={instanceId}
      chain={chain}
      chainSpec={chainSpec}
    />
  );
};
