// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { camelize } from '@w3ux/utils';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { SubmitTx } from 'library/SubmitTx';
import { useInputForm } from '../InputForm/provider';
import { useChain } from '../Provider';
import { useChainState } from 'contexts/ChainState';
import { useActiveTab } from 'contexts/ActiveTab';
import type { SubmitProps } from './types';

export const Submit = ({ activePallet, activeItem }: SubmitProps) => {
  const { tabId } = useActiveTab();
  const { handleSubmit } = useInputForm();
  const { getFromAddress } = useChainState();
  const { instanceId, api, chain, chainSpec } = useChain();

  const {
    ss58Prefix,
    consts: { existentialDeposit },
  } = chainSpec;
  const { unit, units, id: chainId } = chain;
  const { transactionVersion } = chainSpec.version;

  // Get the sender address.
  const fromAddress = getFromAddress(tabId) || '';

  // Transaction is submittable once from address has been defined.
  const submittable = fromAddress !== '';

  // Format the transaction to submit, or return `null` if invalid.
  const getTx = () => {
    let tx = null;

    if (!api || !submittable || !activePallet || !activeItem) {
      return tx;
    }

    // Get transaction args from input form.
    let resultInput = handleSubmit();

    // Wrap resulting args into an array if it is not already.
    if (!Array.isArray(resultInput) && resultInput !== undefined) {
      resultInput = [resultInput];
    }

    try {
      // Construct transaction.
      tx = api.tx[camelize(activePallet)][camelize(activeItem)](
        ...Object.values(resultInput || [undefined])
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
      /* Do nothing. */
    },
  });

  return (
    <SubmitTx
      {...submitExtrinsic}
      valid={submittable}
      instanceId={instanceId}
      chainId={chainId}
      ss58Prefix={ss58Prefix}
      units={units}
      unit={unit}
      existentialDeposit={existentialDeposit}
      transactionVersion={String(transactionVersion)}
    />
  );
};
