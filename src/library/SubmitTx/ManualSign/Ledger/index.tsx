// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffectIgnoreInitial } from '@w3ux/hooks';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useLedgerHardware } from 'contexts/LedgerHardware';
import type { LedgerResponse } from 'contexts/LedgerHardware/types';
import { useTxMeta } from 'contexts/TxMeta';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { getLedgerApp } from 'contexts/LedgerHardware/Utils';
import type { SubmitProps } from '../../types';
import { Submit } from './Submit';
import { appendOrEmpty } from '@w3ux/utils';
import { useExtrinsicData } from 'library/SubmitTx/ExtrinsicDataProvider';
import { useImportedAccounts } from 'contexts/ImportedAccounts';
import { EstimatedTxFee } from 'library/Tx/EstimatedTxFee';
import { useOverlay } from 'library/Overlay/Provider';

export const Ledger = ({
  uid,
  onSubmit,
  submitting,
  submitText,
  buttons,
  submitAddress,
  displayFor,
}: SubmitProps & { buttons?: ReactNode[] }) => {
  const {
    setFeedback,
    getFeedback,
    integrityChecked,
    handleUnmount,
    getIsExecuting,
    getStatusCode,
    resetStatusCode,
    runtimesInconsistent,
    transportResponse,
    setStatusCode,
  } = useLedgerHardware();
  const { setModalResize } = useOverlay().modal;
  const { setTxSignature, txFeeValid } = useTxMeta();
  const { accountHasSigner } = useImportedAccounts();
  const { instanceId, chainId, ss58Prefix, valid } = useExtrinsicData();

  const txFeesValid = txFeeValid(instanceId);
  const { appName } = getLedgerApp(chainId);

  // Handle new Ledger status report.
  const handleLedgerStatusResponse = (response: LedgerResponse) => {
    if (!response) {
      return;
    }
    const { ack, statusCode, body } = response;

    if (statusCode === 'SignedPayload') {
      if (uid !== body.uid) {
        // UIDs do not match, so this is not the transaction we are waiting for.
        setFeedback(
          'Wrong transaction, please sign again.',
          'Wrong Transaction'
        );
        setTxSignature(instanceId, null);
      } else {
        // Important: only set the signature (and therefore trigger the transaction submission) if
        // UIDs match.
        setStatusCode(ack, statusCode);
        setTxSignature(instanceId, body.sig);
      }
      // Reset state pertaining to this transaction.
      resetStatusCode();
    } else {
      setStatusCode(ack, statusCode);
    }
  };

  // Get the latest Ledger loop feedback.
  const feedback = getFeedback();

  // The state under which submission is disabled.
  const disabled =
    !accountHasSigner(submitAddress || '', chainId, ss58Prefix) ||
    !valid ||
    submitting ||
    !txFeesValid ||
    getIsExecuting();

  // Resize modal on content change.
  useEffect(() => {
    setModalResize();
  }, [
    integrityChecked,
    valid,
    submitting,
    txFeesValid,
    getStatusCode(),
    getIsExecuting(),
  ]);

  // Listen for new Ledger status reports.
  useEffectIgnoreInitial(() => {
    handleLedgerStatusResponse(transportResponse);
  }, [transportResponse]);

  // Tidy up context state when this component is no longer mounted.
  useEffect(
    () => () => {
      handleUnmount();
    },
    []
  );

  return (
    <>
      <div>
        <EstimatedTxFee />
      </div>

      {runtimesInconsistent && (
        <div className="inner warning">
          <div>
            <p className="prompt">{`Your ${appName} Ledger app is not configured to the latest runtime version`}</p>
          </div>
        </div>
      )}

      <div
        className={`inner msg${appendOrEmpty(displayFor === 'card', 'col')}`}
      >
        <div>
          {valid ? (
            <p className="prompt">
              <FontAwesomeIcon icon={faCircleExclamation} className="icon" />
              {feedback?.message
                ? feedback.message
                : !integrityChecked
                  ? 'Connect your Ledger device and confirm it is connected.'
                  : 'Device verified. Ready to submit transaction'}
            </p>
          ) : null}
        </div>
        <div>
          {buttons}
          <Submit
            displayFor={displayFor}
            submitting={submitting}
            submitText={submitText}
            onSubmit={onSubmit}
            disabled={disabled}
            submitAddress={submitAddress}
          />
        </div>
      </div>
    </>
  );
};
