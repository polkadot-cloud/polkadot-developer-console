// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { ReactElement } from 'react';
import { memo, useCallback } from 'react';
import { QrScan } from './Scan.js';
import type { ScanSignatureProps } from './types.js';

const ScanSignature = ({
  className,
  onError,
  onScan,
  size,
  style,
}: ScanSignatureProps): ReactElement<ScanSignatureProps> => {
  const onScanCallback = useCallback(
    (signature: string | null) =>
      signature && onScan({ signature: `0x${signature}` }),
    [onScan]
  );

  return (
    <QrScan
      className={className}
      onError={onError}
      onScan={onScanCallback}
      size={size}
      style={style}
    />
  );
};

export const QrScanSignature = memo(ScanSignature);
