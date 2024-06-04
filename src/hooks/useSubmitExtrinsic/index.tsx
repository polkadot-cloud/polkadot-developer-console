// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import { useEffect, useRef, useState } from 'react';
import { DappName } from 'consts';
import { useTxMeta } from 'contexts/TxMeta';
import { useImportedAccounts } from 'contexts/ImportedAccounts';
import type { UseSubmitExtrinsic, UseSubmitExtrinsicProps } from './types';
import { NotificationsController } from 'controllers/Notifications/index';
import { useExtensions } from '@w3ux/react-connect-kit';
import { useBuildPayload } from 'hooks/useBuildPayload';
import { useAccounts } from 'contexts/Accounts';
import type { AnyJson } from '@w3ux/utils/types';
import type { ExtensionAccount } from '@w3ux/react-connect-kit/types';
import { useLedgerHardware } from 'contexts/LedgerHardware';

export const useSubmitExtrinsic = ({
  instanceId,
  chainId,
  ss58Prefix,
  api,
  tx,
  from,
  shouldSubmit,
  callbackSubmit,
  callbackInBlock,
}: UseSubmitExtrinsicProps): UseSubmitExtrinsic => {
  const {
    getTxFee,
    setTxFee,
    setSender,
    getTxPayload,
    setTxPayload,
    getTxSignature,
    removeTxPayload,
    removeTxSignature,
    incrementTxPayloadUid,
  } = useTxMeta();
  const { getNonce } = useAccounts();
  const { extensionsStatus } = useExtensions();
  const { addPendingNonce, removePendingNonce } = useTxMeta();
  const { getAccount, requiresManualSign } = useImportedAccounts();
  const { handleResetLedgerTask } = useLedgerHardware();

  const txFees = getTxFee(instanceId);
  const nonce = getNonce(instanceId, from);

  const { buildPayload } = useBuildPayload({
    instanceId,
    api,
    nonce,
    setPayload: setTxPayload,
  });

  // Store given tx as a ref.
  const txRef = useRef<AnyJson>(tx);

  // Store given submit address as a ref.
  const fromRef = useRef<string>(from || '');

  // Store whether the transaction is in progress.
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Store the uid of the extrinsic.
  const [uid] = useState<number>(incrementTxPayloadUid(instanceId));

  // Track for one-shot transaction reset after submission.
  const didTxReset = useRef<boolean>(false);

  // Get imported account of the sender.
  const account = getAccount(fromRef.current, chainId, ss58Prefix);

  // Calculate the estimated tx fee of the transaction.
  const calculateEstimatedFee = async () => {
    if (txRef.current === null) {
      return;
    }
    // get payment info
    const { partialFee } = await txRef.current.paymentInfo(fromRef.current);
    const partialFeeBn = new BigNumber(partialFee.toString());

    // give tx fees to global useTxMeta context
    if (partialFeeBn.toString() !== txFees.toString()) {
      setTxFee(instanceId, partialFeeBn);
    }
  };

  // Check if account source has a manual signer.
  const isManualSigner = (accountSource: string) =>
    ['vault', 'ledger'].includes(accountSource);

  // Extrinsic submission handler.
  const onSubmit = async () => {
    if (
      account === undefined ||
      submitting ||
      !shouldSubmit ||
      !api ||
      (requiresManualSign(fromRef.current, chainId, ss58Prefix) &&
        !getTxSignature(instanceId))
    ) {
      return;
    }

    const { source } = account;

    // if `activeAccount` is imported from an extension, ensure it is enabled.
    if (!isManualSigner(source)) {
      const isInstalled = Object.entries(extensionsStatus).find(
        ([id, status]) => id === source && status === 'connected'
      );

      if (!isInstalled) {
        throw new Error('wallet not found');
      }

      if (!window?.injectedWeb3?.[source]) {
        throw new Error('wallet not found');
      }

      // summons extension popup if not already connected.
      window.injectedWeb3[source].enable(DappName);
    }

    const onReady = () => {
      addPendingNonce(instanceId, String(nonce));
      NotificationsController.emit({
        title: 'Pending',
        subtitle: 'Transaction was initiated',
      });
      if (callbackSubmit && typeof callbackSubmit === 'function') {
        callbackSubmit();
      }
    };

    const onInBlock = () => {
      setSubmitting(false);
      removePendingNonce(instanceId, String(nonce));
      NotificationsController.emit({
        title: 'In Block',
        subtitle: 'Transaction in block',
      });
      if (callbackInBlock && typeof callbackInBlock === 'function') {
        callbackInBlock();
      }
    };

    const onFinalizedEvent = (method: string) => {
      if (method === 'ExtrinsicSuccess') {
        NotificationsController.emit({
          title: 'Finalized',
          subtitle: '"Transaction successful"',
        });
      } else if (method === 'ExtrinsicFailed') {
        NotificationsController.emit({
          title: 'Failed',
          subtitle: 'Error with transaction',
        });
        setSubmitting(false);
        removePendingNonce(instanceId, String(nonce));
      }
    };

    const resetTx = () => {
      removeTxPayload(instanceId);
      removeTxSignature(instanceId);
      setSubmitting(false);
    };

    const resetManualTx = () => {
      resetTx();
      handleResetLedgerTask();
    };

    const onError = (type?: string) => {
      resetTx();
      if (type === 'ledger') {
        handleResetLedgerTask();
      }
      removePendingNonce(instanceId, String(nonce));
      NotificationsController.emit({
        title: 'Cancelled',
        subtitle: 'Transaction was cancelled',
      });
    };

    const handleStatus = (status: AnyJson) => {
      if (status.isReady) {
        onReady();
      }
      if (status.isInBlock) {
        onInBlock();
      }
    };

    const unsubEvents = ['ExtrinsicSuccess', 'ExtrinsicFailed'];

    // pre-submission state update
    setSubmitting(true);

    const txPayload = getTxPayload(instanceId);
    const txSignature = getTxSignature(instanceId);

    // handle signed transaction.
    if (getTxSignature(instanceId)) {
      try {
        txRef.current.addSignature(fromRef.current, txSignature, txPayload);

        const unsub = await txRef.current.send(
          ({ status, events = [] }: { status: AnyJson; events: AnyJson[] }) => {
            if (!didTxReset.current) {
              didTxReset.current = true;
              resetManualTx();
            }

            handleStatus(status);
            if (status.isFinalized) {
              events.forEach(({ event: { method } }: AnyJson) => {
                onFinalizedEvent(method);
                if (unsubEvents?.includes(method)) {
                  unsub();
                }
              });
            }
          }
        );
      } catch (e) {
        onError(isManualSigner(source) ? source : 'default');
      }
    } else {
      // handle unsigned transaction.
      const { signer } = account as ExtensionAccount;
      try {
        const unsub = await txRef.current.signAndSend(
          fromRef.current,
          { signer },
          ({ status, events = [] }: AnyJson) => {
            if (!didTxReset.current) {
              didTxReset.current = true;
              resetTx();
            }

            handleStatus(status);
            if (status.isFinalized) {
              events.forEach(
                ({ event: { method } }: { event: { method: string } }) => {
                  onFinalizedEvent(method);
                  if (unsubEvents?.includes(method)) {
                    unsub();
                  }
                }
              );
            }
          }
        );
      } catch (e) {
        onError('default');
      }
    }
  };

  // Refresh state upon `tx` updates.
  useEffect(() => {
    // Update txRef to latest tx.
    txRef.current = tx;

    // Update submit address to latest from.
    fromRef.current = from || '';

    // Ensure sender is up to date.
    setSender(instanceId, fromRef.current);

    // Re-calculate estimated tx fee.
    calculateEstimatedFee();

    // Rebuild tx payload.
    buildPayload(txRef.current, fromRef.current, uid);
  }, [tx?.toString(), tx?.method?.args?.calls?.toString(), from]);

  return {
    uid,
    onSubmit,
    submitting,
    submitAddress: fromRef.current,
    proxySupported: false,
  };
};
