// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import * as defaults from './defaults';
import type { TxMetaContextInterface } from './types';
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
  const setSender = (address: string, instanceId: ApiInstanceId) => {
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

  // Refactor needed from here. -------------------------------------------------------------

  // Store the payloads of transactions if extrinsics require manual signing (e.g. Ledger). payloads
  // are calculated asynchronously and extrinsic associated with them may be cancelled. For this
  // reason we give every payload a uid, and check whether this uid matches the active extrinsic
  // before submitting it.
  const [txPayload, setTxPayloadState] = useState<{
    payload: AnyJson;
    uid: number;
  } | null>(null);
  const txPayloadRef = useRef(txPayload);
  const getPayloadUid = () => txPayloadRef.current?.uid || 1;
  const getTxPayload = () => txPayloadRef.current?.payload || null;

  // Store an optional signed transaction if extrinsics require manual signing (e.g. Ledger).
  const [txSignature, setTxSignatureState] = useState<AnyJson>(null);
  const txSignatureRef = useRef(txSignature);
  const getTxSignature = () => txSignatureRef.current;

  // Set the transaction signature. Overwrites any existing signature.
  const setTxSignature = (s: AnyJson) => {
    setStateWithRef(s, setTxSignatureState, txSignatureRef);
  };

  // Store the pending nonces of transactions. NOTE: Ref is required as `pendingNonces` is read in
  // callbacks.
  const [pendingNonces, setPendingNonces] = useState<string[]>([]);
  const pendingNoncesRef = useRef(pendingNonces);

  // Set the transaction payload and uid. Overwrites any existing payload.
  const setTxPayload = (p: AnyJson, uid: number) => {
    setStateWithRef(
      {
        payload: p,
        uid,
      },
      setTxPayloadState,
      txPayloadRef
    );
  };

  // Removes the transaction payload and uid from state.
  const resetTxPayload = () => {
    setStateWithRef(null, setTxPayloadState, txPayloadRef);
  };

  // Adds a pending nonce to the list of pending nonces.
  const addPendingNonce = (nonce: string) => {
    setStateWithRef(
      [...pendingNoncesRef.current].concat(nonce),
      setPendingNonces,
      pendingNoncesRef
    );
  };

  // Removes a pending nonce from the list of pending nonces.
  const removePendingNonce = (nonce: string) => {
    setStateWithRef(
      pendingNoncesRef.current.filter((n) => n !== nonce),
      setPendingNonces,
      pendingNoncesRef
    );
  };

  // Utility to increment payload uid to maintain unique ids for payloads.
  const incrementPayloadUid = () => (txPayloadRef.current?.uid || 0) + 1;

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

        getPayloadUid,
        getTxPayload,
        setTxPayload,
        incrementPayloadUid,
        resetTxPayload,
        getTxSignature,
        setTxSignature,
        pendingNonces,
        addPendingNonce,
        removePendingNonce,
      }}
    >
      {children}
    </TxMetaContext.Provider>
  );
};
