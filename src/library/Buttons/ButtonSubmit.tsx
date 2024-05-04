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

  > svg {
    margin-left: 0.4rem;
  }

  &.lg {
    color: var(--text-color-secondary);
    font-size: 0.9rem;
    border: 1px solid var(--border-secondary-color);
    padding: 0.5rem 0.6rem;
    border-radius: 0.35rem;

    &:hover {
      color: var(--accent-color-primary);
    }

    > svg {
      margin-left: 0.55rem;
    }
  }
`;
