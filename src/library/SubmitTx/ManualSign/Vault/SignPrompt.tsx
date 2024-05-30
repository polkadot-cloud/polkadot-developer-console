// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useTxMeta } from 'contexts/TxMeta';
import { QrDisplayPayload } from 'library/QRCode/DisplayPayload';
import { QrScanSignature } from 'library/QRCode/ScanSignature';
import type { SignerPromptProps } from 'library/SubmitTx/types';
import type { AnyJson } from '@w3ux/utils/types';
import { faChevronRight } from '@fortawesome/pro-duotone-svg-icons';
import {
  faChevronsLeft,
  faChevronsRight,
} from '@fortawesome/pro-solid-svg-icons';
import { QRViewerWrapper } from 'library/QRCode/Wrappers';

export const SignPrompt = ({
  submitAddress,
  instanceId,
}: SignerPromptProps) => {
  const { getTxPayload, setTxSignature } = useTxMeta();
  const payload = getTxPayload(instanceId);
  const payloadU8a = payload?.payload?.toU8a();
  // TODO: implement prompt or an alternative.
  // const { closePrompt } = usePrompt();

  // Whether user is on sign or submit stage.
  const [stage, setStage] = useState<number>(1);

  return (
    <QRViewerWrapper>
      {stage === 1 && <h3 className="title">Scan on Polkadot Vault</h3>}
      {stage === 2 && <h3 className="title">Sign From Polkadot Vault</h3>}

      <div className="progress">
        <span className={stage === 1 ? 'active' : undefined}>Scan</span>
        <FontAwesomeIcon
          icon={faChevronRight}
          transform="shrink-4"
          className="arrow"
        />
        <span className={stage === 2 ? 'active' : undefined}>Sign</span>
      </div>
      {stage === 1 && (
        <div className="viewer withBorder">
          <QrDisplayPayload
            address={submitAddress || ''}
            cmd={2}
            genesisHash={payload?.payload?.genesisHash}
            payload={payloadU8a}
            style={{ width: '100%', maxWidth: 250 }}
          />
        </div>
      )}
      {stage === 2 && (
        <div className="viewer">
          <QrScanSignature
            size={279}
            onScan={({ signature }: AnyJson) => {
              // closePrompt();
              setTxSignature(instanceId, signature);
            }}
          />
        </div>
      )}
      <div className="foot">
        <div>
          {stage === 2 && (
            <button onClick={() => setStage(1)}>
              <FontAwesomeIcon icon={faChevronsLeft} transform="shrink-3" />
              Back to Scan{' '}
            </button>
          )}
          {stage === 1 && (
            <button
              onClick={() => {
                setStage(2);
              }}
            >
              I Have Scanned{' '}
              <FontAwesomeIcon icon={faChevronsRight} transform="shrink-3" />
            </button>
          )}
          <button
            onClick={() => {
              /*closePrompt()*/
            }}
          >
            cancel
          </button>
        </div>
      </div>
    </QRViewerWrapper>
  );
};
