// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const TagControlWrapper = styled.button`
  border: 1px solid var(--border-secondary-color);
  color: var(--text-color-secondary);
  font-family: InterSemiBold, sans-serif;
  font-size: 0.75rem;
  padding: 0.32rem 0.45rem;
  border-radius: 0.35rem;

  &:hover {
    color: var(--text-color-primary);
    border-color: var(--text-color-tertiary);
  }

  &.large {
    background-color: var(--button-tertiary-background);
    border: none;
    color: var(--text-color-primary);
    font-size: 0.8rem;
    padding: 0.45rem 0.65rem;
    border-radius: 0.45rem;

    > .icon {
      opacity: 0.3;
    }

    &:hover {
      background-color: var(--button-hover-background);

      > .icon {
        opacity: 0.6;
      }
    }
  }

  > .icon {
    margin-right: 0.4rem;
  }

  &.light {
    border: 1px solid var(--border-primary-color);
    color: var(--text-color-tertiary);
    font-size: 0.7rem;

    &:hover {
      border: 1px solid var(--border-secondary-color);
      color: var(--text-color-secondary);
    }
  }
`;
