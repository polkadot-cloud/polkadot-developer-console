// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@w3ux/utils';
import { useTxMeta } from 'contexts/TxMeta';
import { Wrapper } from './Wrapper';
import type { EstimatedTxFeeProps } from './types';

export const EstimatedTxFee = ({
  instanceId,
  format,
  unit,
  units,
}: EstimatedTxFeeProps) => {
  const { getTxFee } = useTxMeta();
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