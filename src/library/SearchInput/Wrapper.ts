// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;

  > h5 {
    margin-bottom: 0.35rem;

    &.focus {
      color: var(--accent-color-primary);
    }
  }

  > .inner {
    border: 1px solid var(--border-secondary-color);
    background-color: var(--background-primary);
    box-shadow: var(--shadow-input);
    border-radius: 0.85rem;
    padding: 0rem 0.8rem;
    display: flex;
    align-items: center;
    display: flex;
    align-items: center;
    width: 100%;

    &.focus {
      border-color: var(--accent-color-primary);
    }

    > .icon {
      color: var(--text-color-tertiary);
      opacity: 0.75;
      margin-right: 0.6rem;
    }

    > input {
      color: var(--text-color-primary);
      font-family: InterBold, sans-serif;
      font-size: 0.95rem;
      flex-grow: 1;
      padding: 0.85rem 0;
      width: 100%;

      &:focus {
        color: var(--text-color-primary);
      }
    }
  }
`;
