// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { Wrapper } from './Wrapper';
import { appendOrEmpty } from '@w3ux/utils';
import type { TxProps } from './types';
import { Signer } from './Signer';

/**
 * @name Tx
 * @summary A wrapper to handle transaction submission.
 */
export const Tx = ({
  margin,
  label,
  name,
  notEnoughFunds,
  dangerMessage,
  SignerComponent,
  displayFor = 'default',
  style,
}: TxProps) => (
  <Wrapper
    className={`${style?.noBorder ? `noBorder` : ``} ${margin ? 'margin' : undefined}`}
  >
    <div
      className={`inner${appendOrEmpty(['canvas', 'card'].includes(displayFor), displayFor)}`}
    >
      <Signer
        dangerMessage={dangerMessage}
        notEnoughFunds={notEnoughFunds}
        name={name}
        label={label}
      />
      <section>{SignerComponent}</section>
    </div>
  </Wrapper>
);
