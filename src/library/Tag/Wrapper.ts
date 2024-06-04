// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const TagWrapper = styled.div`
  background-color: var(--button-tertiary-background);
  color: var(--text-color-secondary);
  font-family: InterSemiBold, sans-serif;
  font-size: 0.68rem;
  padding: 0.35rem 0.45rem;
  border-radius: 0.35rem;

  &.large {
    font-size: 0.75rem;
    padding: 0.45rem 0.6rem;
  }
`;
