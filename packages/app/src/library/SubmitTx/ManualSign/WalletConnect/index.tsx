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
import type { ChainId } from 'config/networks/types';

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
  const { getChainIdCaip } = useChainSpaceEnv();
  const { accountHasSigner } = useImportedAccounts();
  const { instanceId, chainId, ss58Prefix, valid } = useExtrinsicData();
  const { signWcTx, wcSessionActive, fetchAccounts, connectProvider } =
    useWalletConnect();

  const from = getSender(instanceId);

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
      setIsSigning(true);

      // If Wallet Connect session is not active, re-connect.
      if (!wcSessionActive) {
        await connectProvider();
      }

      const caip = getChainIdCaip(chainId);
      const wcAccounts = await fetchAccounts(chainId as ChainId);

      // Re-fetch accounts here to ensure that the signer address still exists.
      const accountExists = from && wcAccounts.includes(from);

      const payload = getTxPayloadValue(instanceId);
      if (!from || !payload || !accountExists) {
        setIsSigning(false);
        return;
      }

      try {
        const signature = await signWcTx(caip, payload, from);
        if (signature) {
          setTxSignature(instanceId, signature);
        }
      } catch (e) {
        setIsSigning(false);
      }
      setIsSigning(false);
    };
    buttonDisabled = disabled;
  }

  // Update text to reflect if session is not active or if account does not exist anymore in
  // session.
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
