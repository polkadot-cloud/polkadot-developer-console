// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect } from 'react';
import { useTxMeta } from 'contexts/TxMeta';
import { Default } from './Default';
import type { SubmitTxProps } from './types';
import { Tx } from 'library/Tx';
import { ManualSign } from './ManualSign';
import { useAccounts } from 'contexts/Accounts';
import { useImportedAccounts } from 'contexts/ImportedAccounts';
import { useOverlay } from 'library/Overlay/Provider';
import { ExtrinsicDataProvider } from './ExtrinsicDataProvider';

export const SubmitTx = ({
  instanceId,
  chainId,
  ss58Prefix,
  units,
  unit,
  uid,
  existentialDeposit,
  onSubmit,
  submitText,
  buttons = [],
  submitAddress,
  valid = false,
  noMargin = false,
  submitting = false,
  displayFor = 'default',
}: SubmitTxProps) => {
  const { getNotEnoughFunds } = useAccounts();
  const { setModalResize } = useOverlay().modal;
  const { getSender, removeTxSignature, getTxFee } = useTxMeta();
  const { getAccount, requiresManualSign } = useImportedAccounts();

  const sender = getSender(instanceId) || '';
  const txFee = getTxFee(instanceId);
  const notEnoughFunds = getNotEnoughFunds(
    instanceId,
    sender,
    txFee,
    existentialDeposit
  );

  // Default to active account
  const signingOpts = {
    label: 'Signer',
    who: getAccount(sender, chainId, ss58Prefix),
  };

  submitText = submitText || `${submitting ? 'Submitting' : 'Submit'}`;

  // Set resize on not enough funds.
  useEffect(() => {
    setModalResize();
  }, [notEnoughFunds]);

  // Reset tx metadata on unmount.
  useEffect(
    () => () => {
      removeTxSignature(instanceId);
    },
    []
  );

  // Format props to pass into extrinsic data context. This context will make the data available to
  // child signer components.
  const extrinsicDataProps = {
    instanceId,
    chainId,
    ss58Prefix,
    units,
    unit,
  };

  return (
    <ExtrinsicDataProvider {...extrinsicDataProps}>
      <Tx
        displayFor={displayFor}
        margin={!noMargin}
        label={signingOpts.label}
        name={signingOpts.who?.name || ''}
        notEnoughFunds={notEnoughFunds}
        dangerMessage={`Not Enough ${unit}`}
        SignerComponent={
          requiresManualSign(sender, chainId, ss58Prefix) ? (
            <ManualSign
              uid={uid}
              onSubmit={onSubmit}
              submitting={submitting}
              valid={valid}
              submitText={submitText}
              buttons={buttons}
              submitAddress={submitAddress}
              displayFor={displayFor}
            />
          ) : (
            <Default
              onSubmit={onSubmit}
              submitting={submitting}
              valid={valid}
              submitText={submitText}
              buttons={buttons}
              submitAddress={submitAddress}
              displayFor={displayFor}
            />
          )
        }
      />
    </ExtrinsicDataProvider>
  );
};
