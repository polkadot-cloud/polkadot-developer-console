// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { ReactNode } from 'react';
import { useTxMeta } from 'contexts/TxMeta';
import type { SubmitProps } from './types';
import { ButtonSubmitLarge } from './ButtonSubmitLarge';
import { appendOrEmpty } from '@w3ux/utils';
import { EstimatedTxFee } from 'library/Tx/EstimatedTxFee';
import { iconArrowAltCircleUp } from '@polkadot-cloud/icons/duotone';
import { useImportedAccounts } from 'contexts/ImportedAccounts';
import { ButtonText } from 'library/Buttons/ButtonText';
import { useExtrinsicData } from './ExtrinsicDataProvider';
import { CloudIcon } from '@polkadot-cloud/icons';
import { faArrowAltCircleUp } from '@fortawesome/free-solid-svg-icons';

export const Default = ({
  onSubmit,
  submitting,
  submitText,
  buttons,
  submitAddress,
  displayFor,
}: SubmitProps & { buttons?: ReactNode[] }) => {
  const { txFeeValid } = useTxMeta();
  const { accountHasSigner } = useImportedAccounts();
  const { instanceId, chainId, ss58Prefix, valid } = useExtrinsicData();

  const disabled =
    submitting ||
    !valid ||
    !accountHasSigner(submitAddress || '', chainId, ss58Prefix) ||
    !txFeeValid(instanceId);

  return (
    <>
      <div className={`inner${appendOrEmpty(displayFor === 'card', 'col')}`}>
        <div>
          <EstimatedTxFee />
        </div>
        <div>
          {buttons}
          {displayFor !== 'card' && (
            <ButtonText onClick={() => onSubmit()} disabled={disabled}>
              {submitText || ''}
              <CloudIcon
                icon={iconArrowAltCircleUp}
                transform="grow-2"
                className="iconRight"
              />
            </ButtonText>
          )}
        </div>
      </div>
      {/* NOTE: Styling here needs to be revised. */}
      {displayFor === 'card' && (
        <ButtonSubmitLarge
          disabled={disabled}
          onSubmit={onSubmit}
          submitText={submitText || ''}
          icon={faArrowAltCircleUp}
          pulse={!disabled}
        />
      )}
    </>
  );
};
