// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const TabsWrapper = styled.div`
  border-top: 1px solid var(--border-secondary-color);
  border-bottom: 1px solid var(--border-secondary-color);
  display: flex;
  margin-bottom: 1rem;
  width: 100%;

  > div {
    color: var(--text-color-secondary);
    border-right: 1px solid var(--border-secondary-color);
    display: flex;
    align-items: center;

    &:last-child {
      border-right: none;
    }
  }
`;

export const TabWrapper = styled.div`
  font-size: 0.8rem;
  padding: 0.65rem 0.85rem;
  display: flex;
  align-items: center;

  &:hover {
    color: var(--text-color-primary);
    background-color: var(--button-tab-background);
    cursor: pointer;
    transition: all 0.1s;
  }

  &.active {
    color: var(--accent-color-primary);
    background-color: var(--button-tab-background);
  }

  .icon {
    margin-right: 0.25rem;
  }
`;
