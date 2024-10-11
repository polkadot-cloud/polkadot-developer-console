// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { ModalNotesProps } from '../types';
import { appendOrEmpty } from '@w3ux/utils';

/**
 * @name ModalNotes
 * @summary Note styling.
 */
export const ModalNotes = ({
  children,
  style,
  withPadding,
}: ModalNotesProps) => (
  <div
    className={`modal-notes${appendOrEmpty(withPadding, 'with-padding')}`}
    style={style}
  >
    {children}
  </div>
);
