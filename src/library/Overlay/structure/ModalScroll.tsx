// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { appendOrEmpty } from '@w3ux/utils';
import type { ForwardedRef } from 'react';
import { forwardRef } from 'react';
import type { ModalScrollProps } from '../types';

/**
 * @name ModalScroll
 * @summary Used for modal window height.
 */
export const ModalScroll = forwardRef(
  (
    { size, children, style }: ModalScrollProps,
    ref?: ForwardedRef<HTMLDivElement>
  ) => (
    <div
      ref={ref}
      className={`modal-scroll${appendOrEmpty(size === 'xl', 'xl')}${appendOrEmpty(
        size === 'lg',
        'lg'
      )}`}
      style={style}
    >
      {children}
    </div>
  )
);
ModalScroll.displayName = 'ModalScroll';
