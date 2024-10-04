// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { useState, type ReactNode } from 'react';
import { useTxMeta } from 'contexts/TxMeta';
import { EstimatedTxFee } from 'library/Tx/EstimatedTxFee';
import type { SubmitProps } from '../../types';
import { appendOrEmpty } from '@w3ux/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useImportedAccounts } from 'contexts/ImportedAccounts';
import { ButtonText } from 'library/Buttons/ButtonText';
import { faSquarePen } from '@fortawesome/free-solid-svg-icons';
import { useExtrinsicData } from 'library/SubmitTx/ExtrinsicDataProvider';
import { useChainSpaceEnv } from 'contexts/ChainSpaceEnv';
import { useWalletConnect } from 'contexts/WalletConnect';

export const WalletConnect = ({
  onSubmit,
  submitting,
  submitText,
  buttons,
  submitAddress,
  displayFor,
}: SubmitProps & { buttons?: ReactNode[] }) => {
  const {
    getSender,
    txFeeValid,
    setTxSignature,
    getTxSignature,
    getTxPayloadValue,
  } = useTxMeta();
  const { signWcTx } = useWalletConnect();
  const { getChainIdCaip } = useChainSpaceEnv();
  const { accountHasSigner } = useImportedAccounts();
  const { instanceId, chainId, ss58Prefix, valid } = useExtrinsicData();

  // Store whether the user is currently signing a transaction.
  const [isSgning, setIsSigning] = useState<boolean>(false);

  // The state under which submission is disabled.
  const disabled =
    submitting ||
    !valid ||
    !accountHasSigner(submitAddress || '', chainId, ss58Prefix) ||
    !txFeeValid(instanceId);

  // Format submit button based on whether signature currently exists or submission is ongoing.
  let buttonOnClick: () => void;
  let buttonDisabled: boolean;

  const alreadySubmitted =
    getTxSignature(instanceId) !== undefined || submitting;

  if (alreadySubmitted) {
    buttonOnClick = onSubmit;
    buttonDisabled = disabled;
  } else {
    buttonOnClick = async () => {
      const from = getSender(instanceId);
      const caip = getChainIdCaip(chainId);

      const payload = getTxPayloadValue(instanceId);
      if (!from || !payload) {
        return;
      }
      setIsSigning(true);

      try {
        const signature = await signWcTx(caip, payload, from);
        if (signature) {
          setTxSignature(instanceId, signature);
        }
      } catch (e) {
        // Silent Error.
      }
      setIsSigning(false);
    };
    buttonDisabled = disabled;
  }

  const buttonText = alreadySubmitted
    ? submitText || ''
    : isSgning
      ? 'Signing...'
      : 'Sign';

  return (
    <div className={`inner${appendOrEmpty(displayFor === 'card', 'col')}`}>
      <div>
        <EstimatedTxFee />
        {valid ? <p>Ready to Submit Transaction.</p> : <p>Form Incomplete.</p>}
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
