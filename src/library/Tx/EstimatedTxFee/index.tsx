// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@w3ux/utils';
import { useTxMeta } from 'contexts/TxMeta';
import { Wrapper } from './Wrapper';
import type { EstimatedTxFeeProps } from './types';
import { useExtrinsicData } from 'library/SubmitTx/ExtrinsicDataProvider';

export const EstimatedTxFee = ({ format }: EstimatedTxFeeProps) => {
  const { getTxFee } = useTxMeta();
  const { instanceId, units, unit } = useExtrinsicData();

  const txFee = getTxFee(instanceId);

  const txFeesUnit = planckToUnit(txFee, units).toFormat();

  return format === 'table' ? (
    <>
      <div>Estimated Fee:</div>
      <div>{txFee.isZero() ? `...` : `${txFeesUnit} ${unit}`}</div>
    </>
  ) : (
    <Wrapper>
      <p>
        <span>Estimated Fee:</span>
        {txFee.isZero() ? `...` : `${txFeesUnit} ${unit}`}
      </p>
    </Wrapper>
  );
};
