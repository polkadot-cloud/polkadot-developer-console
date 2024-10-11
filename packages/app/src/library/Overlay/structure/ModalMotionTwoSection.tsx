// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { motion } from 'framer-motion';
import type { ModalAnimationProps } from '../types';

/**
 * @name ModalMotionTwoSection
 * @summary Two section wrapper with motion animation.
 */
export const ModalMotionTwoSection = ({
  children,
  ...rest
}: ModalAnimationProps) => (
  <motion.div className="modal-motion-two-sections" {...rest}>
    {children}
  </motion.div>
);
