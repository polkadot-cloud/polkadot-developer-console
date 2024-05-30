// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { unitToPlanck } from '@w3ux/utils';
import { useAccounts } from 'contexts/Accounts';
import { useTxMeta } from 'contexts/TxMeta';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { Title } from 'library/Modal/Title';
import { useOverlay } from 'library/Overlay/Provider';
import { ModalPadding } from 'library/Overlay/structure/ModalPadding';
import { SubmitTx } from 'library/SubmitTx';
import { useEffect } from 'react';

export const Transfer = () => {
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
  const { getTxFee } = useTxMeta();
  const { setModalStatus, setModalResize } = useOverlay().modal;

  const valid = true;
  const txFee = getTxFee(instanceId);
  const notEnoughFunds = getNotEnoughFunds(
    instanceId,
    address,
    txFee,
    existentialDeposit
  );

  // Tx to submit.
  const getTx = () => {
    let tx = null;

    if (!api) {
      return tx;
    }

    try {
      tx = api.tx.balances.transferKeepAlive(
        {
          id: '14QT4ARbMcniv7vAPNhQEmhqcu5C5nZnQe3EecrJ7W9Sfno7', // NOTE: to address is hardcoded for testing.
        },
        unitToPlanck('0.1', units).toString()
      );
      return tx;
    } catch (e) {
      return null;
    }
  };

  const submitExtrinsic = useSubmitExtrinsic({
    instanceId,
    api,
    chainId,
    ss58Prefix,
    tx: getTx(),
    from: address,
    shouldSubmit: true,
    callbackSubmit: () => {
      setModalStatus('closing');
    },
  });

  useEffect(() => setModalResize(), [notEnoughFunds]);

  return (
    <>
      <Title title="Transfer" />
      <ModalPadding className="footer-padding">
        <div>
          <h3>Testing Transfer Extrinsic.</h3>
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
    </>
  );
};
