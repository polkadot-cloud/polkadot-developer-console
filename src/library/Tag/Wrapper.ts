// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const TagWrapper = styled.button`
  background-color: var(--button-tertiary-background);
  color: var(--text-color-secondary);
  font-family: InterSemiBold, sans-serif;
  font-size: 0.68rem;
  padding: 0.35rem 0.45rem;
  border-radius: 0.35rem;
  margin-right: 0.5rem;

  &:hover {
    background-color: var(--button-hover-background);
  }
`;
