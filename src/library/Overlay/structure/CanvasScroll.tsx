// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { motion } from 'framer-motion';
import { appendOrEmpty } from '@w3ux/utils';
import type { CanvasScrollProps } from '../types';

/**
 * @name CanvasScroll
 * @summary Canvas scrollable container.
 */
export const CanvasScroll = ({
  children,
  size,
  scroll = true,
  ...rest
}: CanvasScrollProps) => (
  <motion.div
    className={`canvas-scroll${appendOrEmpty(size === 'xl', 'xl')}${appendOrEmpty(
      scroll,
      'scroll'
    )}`}
    {...rest}
  >
    {children}
  </motion.div>
);
