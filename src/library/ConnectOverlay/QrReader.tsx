// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { QrScanSignature } from 'library/QRCode/ScanSignature';
import { ImportQRWrapper } from './Wrappers';
import type { QrReaderProps } from './types';
import { useEffect, useState } from 'react';
import type { AnyJson } from '@w3ux/utils/types';
import { isValidAddress, formatAccountSs58 } from '@w3ux/utils';
import { useVaultAccounts } from '@w3ux/react-connect-kit';

export const QrReader = ({
  directoryId,
  importActive,
  activeChain,
  onSuccess,
}: QrReaderProps) => {
  const { addVaultAccount, vaultAccountExists, vaultAccounts } =
    useVaultAccounts();

  // Store data from QR Code scanner.
  const [qrData, setQrData] = useState<AnyJson>(undefined);

  const ss58 = activeChain?.system.ss58 || 0;

  // Handle a newly received QR signature.
  const handleQrData = (signature: string) => {
    setQrData(signature.split(':')?.[1] || '');
  };

  const valid =
    isValidAddress(qrData) &&
    !vaultAccountExists(directoryId, qrData) &&
    !formatAccountSs58(qrData, ss58);

  useEffect(() => {
    // Add account and close overlay if valid.
    if (valid) {
      const account = addVaultAccount(
        directoryId,
        qrData,
        vaultAccounts.length
      );
      if (account) {
        onSuccess();
      }
    }
  });

  const exists = vaultAccountExists(directoryId, qrData);

  // Display feedback.
  const feedback =
    qrData === undefined
      ? 'Waiting for QR Code'
      : isValidAddress(qrData)
        ? formatAccountSs58(qrData, ss58)
          ? 'Different Network Address'
          : exists
            ? 'Account Already Imported'
            : 'Address Received'
        : 'Invalid Address';

  return (
    <ImportQRWrapper>
      {importActive && (
        <>
          <div className="qrRegion">
            <QrScanSignature
              size={250}
              onScan={({ signature }) => handleQrData(signature)}
            />
          </div>
          <h4>{feedback}</h4>
        </>
      )}
    </ImportQRWrapper>
  );
};
