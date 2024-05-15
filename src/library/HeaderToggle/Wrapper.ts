// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const HeaderToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;

  h5 {
    margin-right: 0.7rem;
  }

  > button {
    border: 1px solid var(--border-primary-color);
    color: var(--text-color-tertiary);
    font-family: InterSemiBold, sans-serif;
    border-radius: 0.4rem;
    font-size: 0.75rem;
    margin-right: 0.5rem;
    padding: 0.3rem 0.65rem;

    &.active {
      border: 1px solid var(--button-tab-background);
      background-color: var(--button-tab-background);
      color: var(--text-color-secondary);
    }

    &:hover {
      color: var(--text-color-secondary);
    }
  }
`;
