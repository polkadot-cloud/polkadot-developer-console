// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { motion } from 'framer-motion';
import styled from 'styled-components';

export const Wrapper = styled(motion.div)`
  width: 100%;
  max-width: 500px;

  > .inner {
    box-shadow: var(--shadow-floating-menu);
    border: 1px solid var(--border-secondary-color);
    background: var(--background-default);
    border-radius: 0.4rem;
    display: flex;
    flex-flow: column wrap;
    padding: 0.75rem;
    overflow-y: scroll;
    overflow-x: hidden;
    width: 100%;
  }
`;
