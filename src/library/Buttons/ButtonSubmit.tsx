// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const ButtonSubmit = styled.button`
  color: var(--text-color-tertiary);
  font-family: InterSemiBold, sans-serif;
  display: flex;
  align-items: center;
  font-size: 0.8rem;

  &:hover {
    color: var(--accent-color-secondary);
  }

  > .iconLeft {
    margin-right: 0.4rem;
  }

  > .iconRight {
    margin-left: 0.4rem;
  }

  &.lg {
    color: var(--text-color-secondary);
    background-color: var(--background-default);
    border: 1px solid var(--border-secondary-color);
    font-size: 0.9rem;
    padding: 0.53rem 0.75rem;
    border-radius: 0.4rem;

    &:hover {
      color: var(--accent-color-primary);
    }

    > .iconLeft {
      margin-right: 0.4rem;
    }

    > .iconRight {
      margin-left: 0.55rem;
    }
  }
`;
