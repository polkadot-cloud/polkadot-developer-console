// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { useTxMeta } from 'contexts/TxMeta';
import { EstimatedTxFee } from 'library/Tx/EstimatedTxFee';
import type { SubmitProps } from '../../types';
import { appendOrEmpty } from '@w3ux/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useImportedAccounts } from 'contexts/ImportedAccounts';
import { ButtonText } from 'library/Buttons/ButtonText';
import { faSquarePen } from '@fortawesome/free-solid-svg-icons';

export const Vault = ({
  instanceId,
  chainId,
  ss58Prefix,
  units,
  unit,
  onSubmit,
  submitting,
  valid,
  submitText,
  buttons,
  submitAddress,
  displayFor,
}: SubmitProps & { buttons?: ReactNode[] }) => {
  const { accountHasSigner } = useImportedAccounts();
  const { txFeeValid, getTxSignature } = useTxMeta();
  // const { openPromptWith, status: promptStatus } = usePrompt();
  // TODO: Implement prompt or alternative to it.
  const promptStatus = 0;

  // The state under which submission is disabled.
  const disabled =
    submitting ||
    !valid ||
    !accountHasSigner(submitAddress || '', chainId, ss58Prefix) ||
    !txFeeValid(instanceId);

  // Format submit button based on whether signature currently exists or submission is ongoing.
  let buttonText: string;
  let buttonOnClick: () => void;
  let buttonDisabled: boolean;

  if (getTxSignature(instanceId) !== undefined || submitting) {
    buttonText = submitText || '';
    buttonOnClick = onSubmit;
    buttonDisabled = disabled;
  } else {
    buttonText = promptStatus === 0 ? 'Sign' : 'Signing';
    buttonOnClick = async () => {
      // TODO: handle open prompt.
      // openPromptWith(<SignPrompt submitAddress={submitAddress} />, 'small');
    };
    buttonDisabled = disabled || promptStatus !== 0;
  }

  return (
    <div className={`inner${appendOrEmpty(displayFor === 'card', 'col')}`}>
      <div>
        <EstimatedTxFee instanceId={instanceId} units={units} unit={unit} />
        {valid ? <p>Ready to Submit Transaction</p> : <p>...</p>}
      </div>
      <div>
        {buttons}
        {displayFor !== 'card' ? (
          <ButtonText onClick={() => buttonOnClick()} disabled={buttonDisabled}>
            {buttonText}
            <FontAwesomeIcon icon={faSquarePen} className="iconRight" />
          </ButtonText>
        ) : (
          <ButtonText onClick={() => buttonOnClick()} disabled={buttonDisabled}>
            {buttonText}
            <FontAwesomeIcon icon={faSquarePen} className="iconRight" />
          </ButtonText>
        )}
      </div>
    </div>
  );
};
