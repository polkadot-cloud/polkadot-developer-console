// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import * as defaults from './defaults';
import type { TxMetaContextInterface, TxPayload } from './types';
import type { AnyJson } from '@w3ux/utils/types';
import type { ApiInstanceId } from 'model/Api/types';

export const TxMetaContext = createContext<TxMetaContextInterface>(
  defaults.defaultTxMeta
);

export const useTxMeta = () => useContext(TxMetaContext);

export const TxMetaProvider = ({ children }: { children: ReactNode }) => {
  // Store the senders of transactions, keyed by api instance id.
  //
  // NOTE: Only one transaction is currently supported for each api instance - could be expanded to
  // support multiple in the future.
  const [senders, setSenders] = useState<Record<ApiInstanceId, string>>({});

  // Gets a sender for a given api instance, or undefined if none exist.
  const getSender = (instanceId: ApiInstanceId) => senders[instanceId];

  // Set a sender for an api instance.
  const setSender = (instanceId: ApiInstanceId, address: string) => {
    setSenders({
      ...senders,
      [instanceId]: address,
    });
  };

  // Remove a sender for a given api instance.
  const removeSender = (instanceId: ApiInstanceId) => {
    const updated = { ...senders };
    delete updated[instanceId];
    setSenders(updated);
  };

  // Store the fees of transactions, keyed by api instance id.
  const [txFees, setTxFees] = useState<Record<ApiInstanceId, BigNumber>>({});

  // Get the transaction fee for a given api instance.
  const getTxFee = (instanceId: ApiInstanceId) =>
    txFees[instanceId] || new BigNumber(0);

  // Set the transaction fee for a given api instance.
  const setTxFee = (instanceId: ApiInstanceId, fee: BigNumber) => {
    setTxFees({
      ...txFees,
      [instanceId]: fee,
    });
  };

  // Remove the transaction fee for a given api instance.
  const removeTxFee = (instanceId: ApiInstanceId) => {
    const updated = { ...txFees };
    delete updated[instanceId];
    setTxFees(updated);
  };

  // Checks whether transaction fee is valid for a given api instance.
  const txFeeValid = (instanceId: ApiInstanceId) =>
    !getTxFee(instanceId).isZero();

  // Store the payloads of transactions if extrinsics require manual signing (e.g. Ledger). payloads
  // are calculated asynchronously and extrinsic associated with them may be cancelled. For this
  // reason we give every payload a uid, and check whether this uid matches the active extrinsic
  // before submitting it.
  //
  // NOTE: tx payloads are accessed in callbacks, so refs are also used here.
  const [txPayloads, setTxPayloadsState] = useState<
    Record<ApiInstanceId, TxPayload>
  >({});
  const txPayloadsRef = useRef(txPayloads);

  // Get a payload for a given api instance.
  const getTxPayload = (instanceId: ApiInstanceId) =>
    txPayloadsRef.current[instanceId]?.payload;

  // Increment a payload uid given an api instance.
  const incrementTxPayloadUid = (instanceId: ApiInstanceId) =>
    (txPayloadsRef.current[instanceId]?.uid || 0) + 1;

  // Set a transaction payload and uid for a given api instance. Overwrites any existing payload.
  const setTxPayload = (
    instanceId: ApiInstanceId,
    payload: AnyJson,
    uid: number
  ) => {
    setStateWithRef(
      {
        ...txPayloadsRef.current,
        [instanceId]: {
          payload,
          uid,
        },
      },
      setTxPayloadsState,
      txPayloadsRef
    );
  };

  // Removes a transaction payload for a given api instance.
  const removeTxPayload = (instanceId: ApiInstanceId) => {
    const updated = { ...txPayloadsRef.current };
    delete updated[instanceId];
    setStateWithRef(updated, setTxPayloadsState, txPayloadsRef);
  };

  // Store a transaction signature if extrinsics require manual signing (e.g. Ledger, Vault).
  const [txSignatures, setTxSignaturesState] = useState<
    Record<ApiInstanceId, AnyJson>
  >({});
  const txSignaturesRef = useRef(txSignatures);

  // Gets a transaction signature for a given api instance.
  const getTxSignature = (instanceId: ApiInstanceId) =>
    txSignaturesRef.current[instanceId];

  // Set a transaction signature given an api instance id. Overwrites any existing signature.
  const setTxSignature = (instanceId: ApiInstanceId, signature: AnyJson) => {
    setStateWithRef(
      {
        ...txSignaturesRef.current,
        [instanceId]: signature,
      },
      setTxSignaturesState,
      txSignaturesRef
    );
  };

  // Removes a transaction signature for a given api instance.
  const removeTxSignature = (instanceId: ApiInstanceId) => {
    const updated = { ...txSignaturesRef.current };
    delete updated[instanceId];
    setStateWithRef(updated, setTxSignaturesState, txSignaturesRef);
  };

  // Store the pending nonces of transactions. Multiple nonces can be pending in the event one
  // transaction is submitted after another and the previous one is not yet finalised. NOTE: Ref is
  // required as `pendingNonces` is read in callbacks.
  const [pendingNonces, setPendingNonces] = useState<
    Record<ApiInstanceId, string[]>
  >({});
  const pendingNoncesRef = useRef(pendingNonces);

  // Gets pending nonces for a given api instance id.
  const getPendingNonces = (instanceId: ApiInstanceId) =>
    pendingNoncesRef.current[instanceId] || [];

  // Adds a pending nonce to the list of pending nonces for an api instance id.
  const addPendingNonce = (instanceId: ApiInstanceId, nonce: string) => {
    setStateWithRef(
      {
        ...pendingNoncesRef.current,
        [instanceId]:
          pendingNoncesRef.current[instanceId] === undefined
            ? [nonce]
            : pendingNoncesRef.current[instanceId].concat(nonce),
      },
      setPendingNonces,
      pendingNoncesRef
    );
  };

  // Removes a pending nonce from the list of pending nonces.
  const removePendingNonce = (instanceId: ApiInstanceId, nonce: string) => {
    const updated = { ...pendingNoncesRef.current };
    if (!updated[instanceId]) {
      return;
    }
    updated[instanceId] = updated[instanceId].filter((n) => n !== nonce);

    if (updated[instanceId].length === 0) {
      delete updated[instanceId];
    }
    setStateWithRef(updated, setPendingNonces, pendingNoncesRef);
  };

  // Destroy tx meta for an api instance.
  const destroyInstanceTxMeta = (instanceId: ApiInstanceId) => {
    removeSender(instanceId);
    removeTxFee(instanceId);
    removeTxPayload(instanceId);
    removeTxSignature(instanceId);
  };

  return (
    <TxMetaContext.Provider
      value={{
        // Manage tx senders.
        senders,
        getSender,
        setSender,
        removeSender,

        // Manage tx fees.
        getTxFee,
        setTxFee,
        removeTxFee,
        txFeeValid,

        // Manage payloads.
        getTxPayload,
        setTxPayload,
        removeTxPayload,
        incrementTxPayloadUid,

        // Manage transaction signatures.
        getTxSignature,
        setTxSignature,
        removeTxSignature,

        // Manage pending nonces.
        getPendingNonces,
        addPendingNonce,
        removePendingNonce,

        // Destroy tx meta for an api instance.
        destroyInstanceTxMeta,
      }}
    >
      {children}
    </TxMetaContext.Provider>
  );
};
