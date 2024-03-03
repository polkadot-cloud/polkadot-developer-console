// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { motion } from 'framer-motion';
import styled from 'styled-components';

export const Wrapper = styled(motion.div)`
  max-width: 150px;

  > .inner {
    width: 100%;
    background: var(--background-invert);
    color: var(--text-color-invert);
    font-family: InterSemiBold, sans-serif;
    border-radius: 0.35rem;
    display: flex;
    flex-flow: column wrap;
    padding: 0.32rem 0.6rem;
    font-size: 0.68rem;

    /* TODO: make theme variable + dark mode support */
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.07),
      0 2px 4px -2px rgba(0, 0, 0, 0.07);
  }
`;
