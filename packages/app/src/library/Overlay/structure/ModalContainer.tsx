// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { motion } from 'framer-motion';
import type { ModalAnimationProps } from '../types';

/**
 * @name ModalContainer
 * @summary Modal container wrapper.
 */
export const ModalContainer = ({ children, ...rest }: ModalAnimationProps) => (
  <motion.div className="modal-container" {...rest}>
    {children}
  </motion.div>
);
