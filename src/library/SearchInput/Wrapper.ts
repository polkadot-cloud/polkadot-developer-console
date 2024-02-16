// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;

  > h5 {
    color: var(--text-color-tertiary);
    margin-bottom: 0.3rem;

    &.focus {
      color: var(--accent-color-secondary);
    }
  }

  > .inner {
    border: 1px solid var(--border-secondary-color);
    background-color: var(--background-primary);
    border-radius: 0.75rem;
    padding: 0rem 0.8rem;
    display: flex;
    align-items: center;
    /* TODO: make theme variable + dark mode support */
    box-shadow: 0 2px 4px 1px rgba(0, 0, 0, 0.03);
    display: flex;
    align-items: center;
    width: 100%;

    &.focus {
      border-color: var(--accent-color-secondary);
    }

    > .icon {
      color: var(--text-color-tertiary);
      opacity: 0.75;
      margin-right: 0.6rem;
    }

    > input {
      color: var(--text-color-secondary);
      font-family: InterSemiBold, sans-serif;
      font-size: 0.95rem;
      flex-grow: 1;
      padding: 0.75rem 0;
      width: 100%;
    }
  }
`;
