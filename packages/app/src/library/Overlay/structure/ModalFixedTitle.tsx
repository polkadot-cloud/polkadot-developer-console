// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { ForwardedRef } from 'react';
import { forwardRef } from 'react';
import type { ModalFixedTitleProps } from '../types';
import { appendOrEmpty } from '@w3ux/utils';

/**
 * @name ModalFixedTitle
 * @summary Fixed the title.
 */
export const ModalFixedTitle = forwardRef(
  (
    { children, style, withStyle }: ModalFixedTitleProps,
    ref?: ForwardedRef<HTMLDivElement>
  ) => (
    <div
      ref={ref}
      className={`modal-fixed-title${appendOrEmpty(withStyle, 'with-style')}`}
      style={style}
    >
      {children}
    </div>
  )
);
ModalFixedTitle.displayName = 'ModalFixedTitle';
