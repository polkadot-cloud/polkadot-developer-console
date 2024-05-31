// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faSquarePen } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { LedgerAccount } from '@w3ux/react-connect-kit/types';
import { useImportedAccounts } from 'contexts/ImportedAccounts';
import { useLedgerHardware } from 'contexts/LedgerHardware';
import { getLedgerApp } from 'contexts/LedgerHardware/Utils';
import { useTxMeta } from 'contexts/TxMeta';
import { ButtonText } from 'library/Buttons/ButtonText';
import { ButtonSubmitLarge } from 'library/SubmitTx/ButtonSubmitLarge';
import { useExtrinsicData } from 'library/SubmitTx/ExtrinsicDataProvider';
import type { LedgerSubmitProps } from 'library/SubmitTx/types';

export const Submit = ({
  displayFor,
  submitting,
  submitText,
  onSubmit,
  disabled,
  submitAddress,
}: LedgerSubmitProps) => {
  const {
    handleSignTx,
    getIsExecuting,
    integrityChecked,
    checkRuntimeVersion,
  } = useLedgerHardware();
  const { getTxSignature } = useTxMeta();
  const { getAccount } = useImportedAccounts();
  const { getTxPayload, getTxPayloadUid } = useTxMeta();
  const { instanceId, transactionVersion, chainId, ss58Prefix } =
    useExtrinsicData();

  const { appName } = getLedgerApp(chainId);

  const getAddressIndex = () =>
    (getAccount(submitAddress || '', chainId, ss58Prefix) as LedgerAccount)
      ?.index || 0;

  // Handle transaction submission
  const handleTxSubmit = async () => {
    const uid = getTxPayloadUid(instanceId);
    const accountIndex = getAddressIndex();
    const payload = await getTxPayload(instanceId);
    await handleSignTx(appName, uid, accountIndex, payload);
  };

  // Check device runtime version.
  const handleCheckRuntimeVersion = async () => {
    await checkRuntimeVersion(appName, transactionVersion);
  };

  // Is the transaction ready to be submitted?
  const txReady =
    (getTxSignature(instanceId) !== null && integrityChecked) || submitting;

  // Button `onClick` handler depends whether integrityChecked and whether tx has been submitted.
  const handleOnClick = !integrityChecked
    ? handleCheckRuntimeVersion
    : txReady
      ? onSubmit
      : handleTxSubmit;

  // Determine button text.
  const text = !integrityChecked
    ? 'Confirm'
    : txReady
      ? submitText || ''
      : getIsExecuting()
        ? 'Signing'
        : 'Sign';

  // Button icon.
  const icon = !integrityChecked ? faCheckCircle : faSquarePen;

  return displayFor !== 'card' ? (
    <ButtonText onClick={handleOnClick} disabled={disabled}>
      <FontAwesomeIcon
        icon={icon}
        transform="grow-2"
        style={{ marginRight: '0.4rem' }}
      />
      {text}
    </ButtonText>
  ) : (
    <ButtonSubmitLarge
      disabled={disabled}
      onSubmit={handleOnClick}
      submitText={text}
      icon={icon}
      pulse={!disabled}
    />
  );
};
