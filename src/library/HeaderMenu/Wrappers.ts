// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const HeaderMenuWrapper = styled.div`
  --chain-menu-button-height: 1.65rem;
  --chain-menu-button-border-radius: 0.35rem;

  background-color: var(--background-primary);
  border-bottom: 1px solid var(--border-primary-color);
  display: flex;
  width: 100%;

  > .menu {
    display: flex;
    flex-grow: 1;

    > section {
      color: var(--text-color-tertiary);
      display: flex;
      align-items: center;

      &.main {
        flex-grow: 1;
      }

      &.other {
        border-left: 1px solid var(--border-primary-color);
        padding-right: 0.25rem;
        justify-content: flex-end;
      }

      > .label {
        border-right: 1px solid var(--border-primary-color);
        padding-right: 1rem;
      }

      > div,
      button {
        padding: 0.7rem 0.5rem 0.7rem 1.1rem;
        font-size: 0.8rem;
        display: flex;
        align-items: center;
      }

      > button {
        color: var(--text-color-secondary);

        > .icon {
          margin-right: 0.4rem;
          opacity: 0.6;
          transition: opacity 0.2s;
        }

        &:hover {
          color: var(--accent-color-secondary);
        }

        &.active {
          color: var(--accent-color-secondary);

          > .icon {
            opacity: 1;
          }
        }
      }
    }
  }

  > .config {
    display: flex;
    align-items: center;
    flex-shrink: 1;
    justify-content: flex-end;
    padding-right: 0.5rem;

    .icon {
      color: var(--text-color-secondary);
    }
  }
`;

export const ButtonWrapper = styled.button`
  border-radius: var(--chain-menu-button-border-radius);
  height: var(--chain-menu-button-height);
  color: var(--text-color-secondary);
  font-family: InterSemiBold, sans-serif;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: 0.2rem;
  padding: 0 0.68rem;
  transition: background-color 0.15s;

  &.button {
    color: var(--text-color-primary);
    background-color: var(--button-secondary-background);

    &:hover {
      color: var(--accent-color-secondary);
    }

    > svg {
      margin-right: 0.55rem;
    }
  }

  &.active {
    > svg {
      color: var(--accent-color-secondary);
    }
  }

  &:hover {
    background-color: var(--button-hover-background);
    color: var(--text-color-primary);
  }

  &:disabled {
    opacity: 0.5;

    &:hover {
      background-color: transparent;
    }
  }
`;
