// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { useTxMeta } from 'contexts/TxMeta';
import { EstimatedTxFee } from 'library/Tx/EstimatedTxFee';
import type { SubmitProps } from '../../types';
import { appendOrEmpty } from '@w3ux/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePen } from '@fortawesome/pro-duotone-svg-icons';
import { useImportedAccounts } from 'contexts/ImportedAccounts';

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

  if (getTxSignature(instanceId) !== null || submitting) {
    buttonText = submitText || '';
    buttonOnClick = onSubmit;
    buttonDisabled = disabled;
  } else {
    buttonText = promptStatus === 0 ? 'Sign' : 'Signing';
    buttonOnClick = async () => {
      console.log('open prompt to sign tx');
      // TODO: handle open prompt.
      // openPromptWith(<SignPrompt submitAddress={submitAddress} />, 'small');
    };
    buttonDisabled = disabled || promptStatus !== 0;
  }

  return (
    <div className={`inner${appendOrEmpty(displayFor === 'card', 'col')}`}>
      <div>
        <EstimatedTxFee instanceId={instanceId} units={units} unit={unit} />
        {valid ? <p>Submit Transaction</p> : <p>...</p>}
      </div>
      <div>
        {buttons}
        {displayFor !== 'card' ? (
          <button disabled={buttonDisabled} onClick={() => buttonOnClick()}>
            <FontAwesomeIcon icon={faSquarePen} />
            {buttonText}
          </button>
        ) : (
          <button disabled={disabled} onClick={buttonOnClick}>
            <FontAwesomeIcon icon={faSquarePen} />
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};
