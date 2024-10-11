// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { motion } from 'framer-motion';
import type { ModalContentProps } from '../types';
import { appendOrEmpty } from '@w3ux/utils';

/**
 * @name ModalContent
 * @summary Modal content wrapper for `ModalContainer` and `CanvasContainer`.
 */
export const ModalContent = ({
  children,
  canvas,
  ...rest
}: ModalContentProps) => (
  <motion.div
    className={`modal-content${appendOrEmpty(canvas, 'canvas')}`}
    {...rest}
  >
    {children}
  </motion.div>
);
