// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { appendOrEmpty } from '@w3ux/utils';
import type { ModalConnectItemProps } from '../types';

/**
 * @name  ModalConnectItem
 * @summary Wrapper for a modal connect item.
 */
export const ModalConnectItem = ({
  children,
  style,
  canConnect,
}: ModalConnectItemProps) => (
  <div
    className={`modal-connect-item${appendOrEmpty(canConnect, 'can-connect')}`}
    style={style}
  >
    {children}
  </div>
);
