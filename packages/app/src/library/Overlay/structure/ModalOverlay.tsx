// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { motion } from 'framer-motion';
import type { ModalOverlayProps } from '../types';

/**
 * @name ModalOverlay
 * @summary Modal overlay wrapper, providing a transparent background to overlaying content.
 */
export const ModalOverlay = ({
  children,
  blur,
  ...rest
}: ModalOverlayProps) => (
  <motion.div
    style={blur ? { backdropFilter: `blur(${blur})` } : undefined}
    className="modal-overlay"
    {...rest}
  >
    {children}
  </motion.div>
);
