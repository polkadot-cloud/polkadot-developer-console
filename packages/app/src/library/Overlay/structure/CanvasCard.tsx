// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { ComponentBaseWithClassName } from '@w3ux/types';

/**
 * @name CanvasCard
 * @summary Modal canvas card wrapper.
 */
export const CanvasCard = ({
  children,
  style,
  className,
}: ComponentBaseWithClassName) => (
  <div
    className={`modal-canvas-card${className ? ` ${className}` : ''}`}
    style={style}
  >
    {children}
  </div>
);
