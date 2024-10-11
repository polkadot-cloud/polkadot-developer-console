// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { useState } from 'react';
import { useTxMeta } from 'contexts/TxMeta';
import { QrDisplayPayload } from 'library/QRCode/DisplayPayload';
import { QrScanSignature } from 'library/QRCode/ScanSignature';
import type { SignerPromptProps } from 'library/SubmitTx/types';
import type { AnyJson } from '@w3ux/types';
import { iconChevronRight } from '@polkadot-cloud/icons/duotone';
import {
  iconChevronsLeft,
  iconChevronsRight,
} from '@polkadot-cloud/icons/solid';
import { QRViewerWrapper } from 'library/QRCode/Wrappers';
import { usePrompt } from 'contexts/Prompt';
import { ButtonText } from 'library/Buttons/ButtonText';
import { CloudIcon } from '@polkadot-cloud/icons';

export const SignPrompt = ({
  submitAddress,
  instanceId,
}: SignerPromptProps) => {
  const { closePrompt } = usePrompt();
  const { getTxPayload, setTxSignature } = useTxMeta();

  const payload = getTxPayload(instanceId);
  const payloadU8a = payload?.toU8a();

  // Whether user is on sign or submit stage.
  const [stage, setStage] = useState<number>(1);

  return (
    <QRViewerWrapper>
      {stage === 1 && <h3 className="title">Scan on Polkadot Vault</h3>}
      {stage === 2 && <h3 className="title">Sign From Polkadot Vault</h3>}

      <div className="progress">
        <span className={stage === 1 ? 'active' : undefined}>Scan</span>
        <CloudIcon
          icon={iconChevronRight}
          transform="shrink-4"
          className="arrow"
        />
        <span className={stage === 2 ? 'active' : undefined}>Sign</span>
      </div>
      {stage === 1 && (
        <div className="viewer">
          <QrDisplayPayload
            address={submitAddress || ''}
            cmd={2}
            genesisHash={payload?.genesisHash}
            payload={payloadU8a}
            style={{ width: '100%', maxWidth: 250 }}
          />
        </div>
      )}
      {stage === 2 && (
        <div className="viewer scan">
          <QrScanSignature
            size={300}
            onScan={({ signature }: AnyJson) => {
              closePrompt();
              setTxSignature(instanceId, signature);
            }}
          />
        </div>
      )}
      <div className="foot">
        <div>
          {stage === 2 && (
            <ButtonText onClick={() => setStage(1)}>
              <CloudIcon icon={iconChevronsRight} transform="shrink-3" />
              Back to Scan
            </ButtonText>
          )}
          {stage === 1 && (
            <ButtonText
              onClick={() => {
                setStage(2);
              }}
            >
              I Have Scanned
              <CloudIcon icon={iconChevronsLeft} transform="shrink-3" />
            </ButtonText>
          )}
          <button type="button" onClick={() => closePrompt()}>
            Cancel
          </button>
        </div>
      </div>
    </QRViewerWrapper>
  );
};
