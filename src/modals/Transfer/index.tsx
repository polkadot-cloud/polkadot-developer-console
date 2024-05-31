// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { unitToPlanck } from '@w3ux/utils';
import { useAccounts } from 'contexts/Accounts';
import { useImportedAccounts } from 'contexts/ImportedAccounts';
import { useTxMeta } from 'contexts/TxMeta';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { AccountId32 } from 'library/Inputs/AccountId32';
import { Textbox } from 'library/Inputs/Textbox';
import { Title } from 'library/Modal/Title';
import { useOverlay } from 'library/Overlay/Provider';
import { ModalPadding } from 'library/Overlay/structure/ModalPadding';
import { SubmitTx } from 'library/SubmitTx';
import { useEffect, useRef, useState } from 'react';

export const Transfer = () => {
  const { getTxFee } = useTxMeta();
  const {
    address,
    instanceId,
    unit,
    units,
    api,
    chainId,
    ss58Prefix,
    existentialDeposit,
  } = useOverlay().modal.config.options;
  const { getNotEnoughFunds } = useAccounts();
  const { setModalStatus, setModalResize } = useOverlay().modal;
  const { getAccounts: getImportedAccounts } = useImportedAccounts();

  // Store the `from` address to transfer funds from.
  const [fromAddress, setFromAddress] = useState<string>(address);

  // Store the `to` address to transfer funds to.
  const [toAddress, setToAddress] = useState<string | null>(null);

  // Store the amount to transfer.
  const [amount, setAmount] = useState<string>('0');

  // A ref for the modal content container that is used for determining select dropdown height.
  const heightRef = useRef<HTMLDivElement>(null);

  // Get all imported accounts to populate account dropdowns.
  const accounts = getImportedAccounts(chainId, ss58Prefix);

  // Determine transaction fee and validity of submitting.
  const txFee = getTxFee(instanceId);
  const notEnoughFunds = getNotEnoughFunds(
    instanceId,
    fromAddress,
    txFee,
    existentialDeposit
  );
  const valid = notEnoughFunds === false;

  // Format the transaction to submit, or return `null` if invalid.
  const getTx = () => {
    let tx = null;

    if (!api) {
      return tx;
    }

    try {
      tx = api.tx.balances.transferKeepAlive(
        {
          id: toAddress,
        },
        unitToPlanck(amount, units).toString()
      );
      return tx;
    } catch (e) {
      return null;
    }
  };

  // Prepare the extrinsic.
  const submitExtrinsic = useSubmitExtrinsic({
    instanceId,
    api,
    chainId,
    ss58Prefix,
    tx: getTx(),
    from: fromAddress,
    shouldSubmit: true,
    callbackSubmit: () => {
      setModalStatus('closing');
    },
  });

  // Resize modal on element changes that effect modal height.
  useEffect(() => setModalResize(), [notEnoughFunds]);

  // Hard value on minimum modal height.
  const MIN_HEIGHT = 200;

  return (
    <div ref={heightRef}>
      <Title title="Transfer Funds" />
      <ModalPadding
        className="footer-padding"
        style={{ minHeight: MIN_HEIGHT }}
      >
        <div>
          <h4 style={{ marginBottom: '0.22rem' }}>From</h4>
          {/* TODO: Allow default account value, allow disabled. */}
          <AccountId32
            accounts={accounts}
            onChange={(val) => setFromAddress(val)}
            heightRef={heightRef}
          />

          <h4 style={{ marginBottom: '0.22rem', marginTop: '1.25rem' }}>
            Recipient
          </h4>
          <AccountId32
            accounts={accounts}
            onChange={(val) => setToAddress(val)}
            heightRef={heightRef}
          />

          <h4 style={{ marginBottom: '0.22rem', marginTop: '1.25rem' }}>
            Amount
          </h4>
          <Textbox
            defaultValue={amount}
            onChange={(val) => setAmount(val)}
            numeric
          />
        </div>
      </ModalPadding>
      <SubmitTx
        {...submitExtrinsic}
        valid={valid}
        instanceId={instanceId}
        chainId={chainId}
        ss58Prefix={ss58Prefix}
        units={units}
        unit={unit}
        existentialDeposit={existentialDeposit}
      />
    </div>
  );
};
