// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;

  > h5 {
    margin-bottom: 0.25rem;

    &.focus {
      color: var(--accent-color-primary);
    }
  }

  > .inner {
    border: 1px solid var(--border-secondary-color);
    border-radius: 0.6rem;
    padding: 0rem 0.75rem;
    display: flex;
    align-items: center;
    transition:
      background-color 0.15s,
      border 0.15s;
    width: 100%;

    > input {
      color: var(--text-color-secondary);
      font-family: InterSemiBold, sans-serif;
      font-size: 0.85rem;
      flex-grow: 1;
      padding: 0.65rem 0;
      width: 100%;

      &:focus {
        color: var(--text-color-primary);
      }
    }

    .controls {
      flex-shrink: 1;
      display: flex;
      align-items: center;

      > button {
        color: var(--text-color-tertiary);
        font-family: InterSemiBold, sans-serif;
        font-size: 0.75rem;
        transition: color 0.15s;

        &:hover {
          color: var(--accent-color-primary);
        }

        &:disabled {
          color: var(--text-color-tertiary);
          opacity: 0.5;
        }
      }
    }

    &.focus {
      border-color: var(--accent-color-primary);

      > .controls > button {
        color: var(--accent-color-primary);
        &:disabled {
          color: var(--text-color-tertiary);
        }
      }
    }
  }
`;
