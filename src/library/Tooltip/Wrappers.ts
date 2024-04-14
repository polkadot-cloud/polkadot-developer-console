// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { motion } from 'framer-motion';
import styled from 'styled-components';

export const Wrapper = styled(motion.div)`
  max-width: 150px;

  > .inner {
    box-shadow: var(--shadow-floating-menu);
    background: var(--background-tooltip);
    color: var(--text-color-invert);
    font-family: InterSemiBold, sans-serif;
    border-radius: 0.35rem;
    display: flex;
    flex-flow: column wrap;
    padding: 0.32rem 0.6rem;
    font-size: 0.68rem;
    width: 100%;
  }
`;
