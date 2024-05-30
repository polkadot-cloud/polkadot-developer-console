// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useTxMeta } from 'contexts/TxMeta';
import type { SubmitProps } from '../types';
import { Vault } from './Vault';
import { useImportedAccounts } from 'contexts/ImportedAccounts';

export const ManualSign = (props: SubmitProps & { buttons?: ReactNode[] }) => {
  const { onSubmit, instanceId, chainId, ss58Prefix } = props;

  const { getAccount } = useImportedAccounts();
  const { getTxSignature, getSender } = useTxMeta();

  const sender = getSender(instanceId);
  const accountMeta = getAccount(sender || '', chainId, ss58Prefix);
  const source = accountMeta?.source;

  // Automatically submit transaction once it is signed.
  useEffect(() => {
    if (getTxSignature(instanceId) !== null) {
      onSubmit();
    }
  }, [getTxSignature(instanceId)]);

  // Determine which signing method to use. NOTE: Falls back to `vault` on all other sources to
  // ensure submit button is displayed.
  switch (source) {
    case 'vault':
      return <Vault {...props} />;
    default:
      return <Vault {...props} />;
  }
};
