// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { motion } from 'framer-motion';
import type { ModalAnimationProps } from '../types';

/**
 * @name CanvasContainer
 * @summary Modal background wrapper with a thick blurred backround, suitable for text content to
 * overlay it.
 */
export const CanvasContainer = ({ children, ...rest }: ModalAnimationProps) => (
  <motion.div className="modal-canvas" {...rest}>
    {children}
  </motion.div>
);
