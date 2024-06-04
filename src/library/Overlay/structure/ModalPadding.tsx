// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ForwardedRef } from 'react';
import { forwardRef } from 'react';
import type { ModalPaddingProps } from '../types';
import { appendOrEmpty } from '@w3ux/utils';

/**
 * @name ModalPadding
 * @summary Generic wrapper for modal padding.
 */
export const ModalPadding = forwardRef(
  (
    {
      children,
      style,
      className,
      verticalOnly,
      horizontalOnly,
    }: ModalPaddingProps,
    ref?: ForwardedRef<HTMLDivElement>
  ) => (
    <div
      ref={ref}
      className={`modal-padding${className ? ` ${className}` : ``}${appendOrEmpty(
        verticalOnly,
        'vertical-only'
      )}${appendOrEmpty(horizontalOnly, 'horizontal-only')}`}
      style={style}
    >
      {children}
    </div>
  )
);
ModalPadding.displayName = 'ModalPadding';
