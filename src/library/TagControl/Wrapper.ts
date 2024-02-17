// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const TagControlWrapper = styled.button`
  background-color: var(--button-tertiary-background);
  color: var(--text-color-secondary);
  font-family: InterSemiBold, sans-serif;
  font-size: 0.75rem;
  padding: 0.35rem 0.45rem;
  border-radius: 0.35rem;

  &.large {
    color: var(--text-color-primary);
    font-size: 0.8rem;
    padding: 0.45rem 0.65rem;
    border-radius: 0.45rem;
  }

  > .icon {
    margin-right: 0.4rem;
  }

  &:hover {
    background-color: var(--button-hover-background);
  }
`;
