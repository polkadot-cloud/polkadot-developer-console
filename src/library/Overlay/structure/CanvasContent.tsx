// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { ComponentBaseWithClassName } from '@w3ux/types';

/**
 * @name CanvasContent
 * @summary Modal canvas content wrapper.
 */
export const CanvasContent = ({
  children,
  style,
  className,
}: ComponentBaseWithClassName) => (
  <div
    className={`modal-canvas-content${className ? ` ${className}` : ''}`}
    style={style}
  >
    {children}
  </div>
);
