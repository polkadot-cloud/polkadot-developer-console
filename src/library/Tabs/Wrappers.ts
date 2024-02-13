// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const TabsWrapper = styled.div`
  background-color: var(--background-list-item);
  border-top: 1px solid var(--border-secondary-color);
  border-bottom: 1px solid var(--border-secondary-color);
  border-image: linear-gradient(45deg, #c3c3c3, #e6e6e6) 50;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-style: solid;
  display: flex;
  margin-bottom: 1rem;
  padding: 0.25rem 0.3rem;
  width: 100%;

  > div {
    &:last-child {
      border-right-color: var(--background-default);
    }
  }
`;

export const TabWrapper = styled.div`
  --tab-height: 2rem;
  --tab-border-radius: 0.35rem;

  border-right: 1px solid var(--border-secondary-color);
  color: var(--text-color-tertiary);
  height: var(--tab-height);
  font-size: 0.8rem;
  padding: 0rem 0.85rem;
  display: flex;
  position: relative;
  align-items: center;
  margin-right: 0.1rem;
  cursor: pointer;
  transition:
    background-color 0.15s,
    border 0.2s;
  min-width: 8.5rem;

  &:hover,
  &.active {
    background-color: var(--button-tab-background);
    border-right-color: var(--background-default);
    border-radius: var(--tab-border-radius);
    color: var(--text-color-primary);
  }

  &.hide-border {
    border-right-color: var(--background-default);
  }

  &.new {
    color: var(--text-color-primary);
    margin-left: 0.2rem;
    min-width: auto;
  }

  > .icon {
    margin-right: 0.25rem;
  }

  > .name {
    height: var(--tab-height);
    color: inherit;
    text-align: left;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 0 0.75rem;
    /* Handle text overflow */
    text-overflow: clip;
    white-space: nowrap;
    overflow: hidden;
  }

  > .fade {
    /* TODO: abstract these gradients into theme variable. */
    background: linear-gradient(
      90deg,
      rgba(239, 238, 238, 0) 0%,
      rgba(239, 238, 238, 1) 25%,
      rgba(239, 238, 238, 1) 100%
    );
    border-top-right-radius: var(--tab-border-radius);
    border-bottom-right-radius: var(--tab-border-radius);
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 1.85rem;
    z-index: 3;
  }

  &:hover,
  &.active {
    > .fade {
      background: linear-gradient(
        90deg,
        rgba(228, 226, 226, 0) 0%,
        rgba(228, 226, 226, 1) 25%,
        rgba(228, 226, 226, 1) 100%
      );
    }
  }

  > .close {
    color: var(--text-color-secondary);
    position: absolute;
    right: 0rem;
    height: inherit;
    padding: 0 0.5rem 0 0.5rem;
    opacity: 0;
    z-index: 4;
  }

  &:hover,
  &.active {
    .close {
      opacity: 1;
    }
  }
`;
