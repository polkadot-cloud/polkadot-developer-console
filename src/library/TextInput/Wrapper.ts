// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.div`
  border: 1px solid var(--border-secondary-color);
  border-radius: 0.6rem;
  padding: 0rem 0.75rem;
  display: flex;
  align-items: center;
  transition:
    background-color 0.15s,
    border 0.15s;
  max-width: 500px;
  width: 100%;

  > input {
    color: var(--text-color-secondary);
    font-family: InterSemiBold, sans-serif;
    font-size: 1rem;
    flex-grow: 1;
    width: 100%;
  }

  .controls {
    flex-shrink: 1;
    display: flex;
    align-items: center;

    > button {
      color: var(--text-color-tertiary);
      font-family: InterSemiBold, sans-serif;
      font-size: 0.85rem;
      transition: color 0.15s;

      &:hover {
        color: var(--accent-color-secondary);
      }

      &:disabled {
        color: var(--text-color-tertiary);
      }
    }
  }

  &.focus {
    border-color: var(--accent-color-secondary);

    > .controls > button {
      color: var(--accent-color-secondary);
      &:disabled {
        color: var(--text-color-tertiary);
      }
    }
  }
`;
