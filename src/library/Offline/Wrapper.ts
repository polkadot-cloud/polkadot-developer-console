// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.div`
  background: var(--accent-color-primary);
  border: 0.5px solid var(--border-primary-color);
  /* TODO: make theme variable + dark mode support */
  box-shadow:
    0 2px 3px -1px rgba(0, 0, 0, 0.05),
    0 1px 4px -2px rgba(0, 0, 0, 0.05);
  position: fixed;
  bottom: 0.5rem;
  right: 0.5rem;
  z-index: 999;
  padding: 0.6rem 0.9rem;
  border-radius: 0.6rem;
  display: flex;

  > h3,
  svg {
    color: var(--text-color-invert);
  }

  > svg {
    margin-right: 0.5rem;
  }
`;
