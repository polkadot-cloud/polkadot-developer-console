// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { appendOrEmpty } from '@w3ux/utils';
import type { ModalSectionProps } from '../types';

/**
 * @name  ModalSection
 * @summary Section wrapper.
 */
export const ModalSection = ({ children, style, type }: ModalSectionProps) => (
  <div
    className={`${appendOrEmpty(type === 'carousel', 'modal-carousel')}${appendOrEmpty(
      type === 'tab',
      'modal-tabs'
    )}`}
    style={style}
  >
    {children}
  </div>
);
