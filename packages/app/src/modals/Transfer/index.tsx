// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { unitToPlanck } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import { useAccounts } from 'contexts/Accounts';
import { useActiveTab } from 'contexts/ActiveTab';
import { useImportedAccounts } from 'contexts/ImportedAccounts';
import { useInputMeta } from 'contexts/InputMeta';
import { useTxMeta } from 'contexts/TxMeta';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { AccountId32 } from 'library/Inputs/AccountId32';
import { Label } from 'library/Inputs/Label';
import { Textbox } from 'library/Inputs/Textbox';
import { Title } from 'library/Modal/Title';
import { useOverlay } from 'library/Overlay/Provider';
import { ModalPadding } from 'library/Overlay/structure/ModalPadding';
import { SubmitTx } from 'library/SubmitTx';
import { useEffect, useRef, useState } from 'react';

export const Transfer = () => {
  const { getTxFee } = useTxMeta();
  const { tabId, metaKey } = useActiveTab();
  const {
    address,
    instanceId,
    unit,
    units,
    api,
    chainId,
    ss58Prefix,
    existentialDeposit,
    transactionVersion,
  } = useOverlay().modal.config.options;
  const { getNotEnoughFunds } = useAccounts();
  const { removeInputMetaValue } = useInputMeta();
  const { setModalStatus, setModalResize } = useOverlay().modal;
  const { getAccounts: getImportedAccounts } = useImportedAccounts();

  // Get all imported accounts to populate account dropdowns and default values.
  const accounts = getImportedAccounts(chainId, ss58Prefix);

  // Store the `from` address to transfer funds from.
  const [fromAddress, setFromAddress] = useState<string>(address);

  // Store the `to` address to transfer funds to.
  const [toAddress, setToAddress] = useState<string | undefined>(
    accounts?.[0]?.address || undefined
  );

  // Store the amount to transfer.
  const [amount, setAmount] = useState<string>('0');

  // A ref for the modal content container that is used for determining select dropdown height.
  const heightRef = useRef<HTMLDivElement>(null);

  // Determine transaction fee and validity of submitting.
  const txFee = getTxFee(instanceId);
  const notEnoughFunds = getNotEnoughFunds(
    instanceId,
    fromAddress,
    txFee,
    existentialDeposit
  );
  const valid =
    notEnoughFunds === false &&
    new BigNumber(amount).isGreaterThan(0) &&
    !!fromAddress &&
    !!toAddress;

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
    api,
    instanceId,
    chainId,
    ss58Prefix,
    unit,
    tx: getTx(),
    from: fromAddress,
    shouldSubmit: true,
    callbackSubmit: () => {
      setModalStatus('closing');
    },
  });

  // Define the input ids for the `from` and `to` address inputs.
  const fromInputId = `${metaKey}_transferFromAddress`;
  const toInputId = `${metaKey}_transferRecipientAddress`;

  // Resize modal on element changes that effect modal height.
  useEffect(() => setModalResize(), [notEnoughFunds]);

  // On modal close, reset input meta values.
  useEffect(
    () => () => {
      removeInputMetaValue(tabId, fromInputId);
      removeInputMetaValue(tabId, toInputId);
    },
    []
  );

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
          <Label value="From" />
          <AccountId32
            inputId={`${metaKey}_transferFromAddress`}
            defaultAddress={fromAddress}
            accounts={accounts}
            onChange={(val) => setFromAddress(val)}
            heightRef={heightRef}
          />

          <Label value="Recipient" marginTop />
          <AccountId32
            inputId={`${metaKey}_transferRecipientAddress`}
            defaultAddress={toAddress}
            accounts={accounts}
            onChange={(val) => setToAddress(val)}
            heightRef={heightRef}
          />

          <Label value="Amount" marginTop />
          <Textbox value={amount} onChange={(val) => setAmount(val)} numeric />
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
        transactionVersion={transactionVersion}
      />
    </div>
  );
};
