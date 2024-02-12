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
    &:last-child {
      border-right-color: var(--background-default);
    }
  }
`;

export const TabWrapper = styled.div`
  border-right: 1px solid var(--border-secondary-color);
  color: var(--text-color-secondary);
  font-size: 0.8rem;
  padding: 0.5rem 0.85rem;
  display: flex;
  position: relative;
  align-items: center;
  margin-right: 0.1rem;
  cursor: pointer;
  transition:
    background-color 0.15s,
    border 0.2s;
  min-width: 8.5rem;

  &:hover {
    background-color: var(--button-tab-background);
    border-right-color: var(--background-default);
    color: var(--text-color-primary);
    border-radius: 0.35rem;
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
    min-width: auto;
  }

  .icon {
    margin-right: 0.25rem;
  }

  > .name {
    color: inherit;
    text-align: left;
    width: 100%;
  }

  > .close {
    background-color: var(--button-tab-background);
    color: var(--text-color-secondary);
    position: absolute;
    right: 0.5rem;
    height: inherit;
    padding: 0 0 0 0.5rem;
    opacity: 0;
    transition: opacity 0.2s;
  }

  &:hover,
  &.active {
    .close {
      opacity: 1;
    }
  }
`;
