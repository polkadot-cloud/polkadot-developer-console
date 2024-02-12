// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const TabsWrapper = styled.div`
  border-top: 1px solid var(--border-secondary-color);
  border-bottom: 1px solid var(--border-secondary-color);
  display: flex;
  margin-bottom: 1rem;
  padding: 0.2rem 0.3rem;
  width: 100%;

  > div {
    color: var(--text-color-secondary);
    display: flex;
    align-items: center;

    &:last-child {
      border-right-color: var(--background-default);
    }
  }
`;

export const TabWrapper = styled.div`
  border-right: 1px solid var(--border-secondary-color);
  font-size: 0.8rem;
  padding: 0.5rem 0.85rem;
  display: flex;
  align-items: center;
  transition:
    background-color 0.15s,
    border 0.2s;
  min-width: 7rem;

  &:hover {
    background-color: var(--button-tab-background);
    border-right-color: var(--background-default);
    color: var(--text-color-primary);
    border-radius: 0.35rem;
    cursor: pointer;
  }

  &.active {
    border-right-color: var(--background-default);
    background-color: var(--button-tab-background);
    color: var(--accent-color-primary);
    border-radius: 0.35rem;
  }

  &.pre-active {
    border-right-color: var(--background-default);
  }

  &.new {
    margin-left: 0.35rem;
  }

  .icon {
    margin-right: 0.25rem;
  }
`;
