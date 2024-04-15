// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { QrScanSignature } from 'library/QRCode/ScanSignature';
import { ImportQRWrapper } from './Wrappers';
import type { QrReaderProps } from './types';
import { useEffect, useState } from 'react';
import type { AnyJson } from '@w3ux/utils/types';
import { isValidAddress } from '@w3ux/utils';
import { formatAccountSs58 } from './Utils';

export const QrReader = ({ importActive, activeChain }: QrReaderProps) => {
  // const { addVaultAccount, vaultAccountExists, vaultAccounts } =
  //   useVaultAccounts();

  // Store data from QR Code scanner.
  const [qrData, setQrData] = useState<AnyJson>(undefined);

  const ss58 = activeChain?.system.ss58 || 0;

  // Handle a newly received QR signature.
  const handleQrData = (signature: string) => {
    setQrData(signature.split(':')?.[1] || '');
  };
  // const valid =
  //   isValidAddress(qrData) &&
  //   !vaultAccountExists(qrData) &&
  //   !formatAccountSs58(qrData, ss58);

  useEffect(() => {
    // Add account and close overlay if valid.
    // if (valid) {
    //   const account = addVaultAccount(qrData, vaultAccounts.length);
    //   if (account) {
    //     addOtherAccounts([account]);
    //   }
    //   // TODO: close import.
    // }
  });

  // const vaultAccountExists = vaultAccountExists(qrData);
  const vaultAccountExists = false;

  // Display feedback.
  const feedback =
    qrData === undefined
      ? 'Waiting for QR Code'
      : isValidAddress(qrData)
        ? formatAccountSs58(qrData, ss58)
          ? 'Different Network Address'
          : vaultAccountExists
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
