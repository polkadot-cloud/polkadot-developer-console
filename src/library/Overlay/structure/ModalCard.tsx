// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { ForwardedRef } from 'react';
import { forwardRef } from 'react';
import type { ComponentBaseWithClassName } from '@w3ux/types';

/**
 * @name ModalCard
 * @summary Modal card wrapper.
 */
export const ModalCard = forwardRef(
  (
    { children, style, className }: ComponentBaseWithClassName,
    ref?: ForwardedRef<HTMLDivElement>
  ) => (
    <div
      ref={ref}
      className={`modal-card${className ? ` ${className}` : ''}`}
      style={style}
    >
      {children}
    </div>
  )
);
ModalCard.displayName = 'ModalCard';
