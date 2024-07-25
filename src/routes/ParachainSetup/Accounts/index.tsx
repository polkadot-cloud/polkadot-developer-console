// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

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
