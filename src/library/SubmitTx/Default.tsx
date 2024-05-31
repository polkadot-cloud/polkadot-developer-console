// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { useTxMeta } from 'contexts/TxMeta';
import type { SubmitProps } from './types';
import { ButtonSubmitLarge } from './ButtonSubmitLarge';
import { appendOrEmpty } from '@w3ux/utils';
import { EstimatedTxFee } from 'library/Tx/EstimatedTxFee';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleUp } from '@fortawesome/pro-duotone-svg-icons';
import { useImportedAccounts } from 'contexts/ImportedAccounts';
import { ButtonText } from 'library/Buttons/ButtonText';
import { useExtrinsicData } from './ExtrinsicDataProvider';

export const Default = ({
  onSubmit,
  submitting,
  valid,
  submitText,
  buttons,
  submitAddress,
  displayFor,
}: SubmitProps & { buttons?: ReactNode[] }) => {
  const { txFeeValid } = useTxMeta();
  const { accountHasSigner } = useImportedAccounts();
  const { instanceId, chainId, ss58Prefix, units, unit } = useExtrinsicData();

  const disabled =
    submitting ||
    !valid ||
    !accountHasSigner(submitAddress || '', chainId, ss58Prefix) ||
    !txFeeValid(instanceId);

  return (
    <>
      <div className={`inner${appendOrEmpty(displayFor === 'card', 'col')}`}>
        <div>
          <EstimatedTxFee instanceId={instanceId} units={units} unit={unit} />
        </div>
        <div>
          {buttons}
          {displayFor !== 'card' && (
            <ButtonText onClick={() => onSubmit()} disabled={disabled}>
              {submitText || ''}
              <FontAwesomeIcon
                icon={faArrowAltCircleUp}
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
