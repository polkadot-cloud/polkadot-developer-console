// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const AutoConnectWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 0.45rem;
  padding: 0 0.2rem;
  max-width: 750px;
  width: 100%;

  > h4 {
    color: var(--text-color-tertiary);
    margin-right: 0.5rem;
    transition: color 0.25s;
  }
`;

export const SearchChainWrapper = styled.div`
  max-width: 750px;
  width: 100%;
`;

export const ChainListWrapper = styled.div`
  --chain-list-item-border-radius: 0.9rem;

  display: flex;
  flex-direction: column;
  margin-top: 0.5rem;
  max-width: 750px;
  width: 100%;

  > h4 {
    color: var(--text-color-secondary);
    margin-top: 0.75rem;
  }
`;

export const Separator = styled.div`
  flex: 1;
  border-top: 1px solid var(--border-primary-color);
`;

export const TagControlsWrapper = styled.div`
  margin-top: 0.85rem;
  display: flex;
  flex-direction: column;

  > div {
    display: flex;
    align-items: center;
    margin-left: 0.25rem;

    &.controls {
      margin-bottom: 0.25rem;
      > h5 {
        padding-right: 0.65rem;
      }
    }

    &.applied {
      margin-top: 0.5rem;
    }
    > button {
      margin-right: 0.6rem;
    }
  }
`;

export const ChainListItemWrapper = styled.div`
  border: 1px solid var(--border-primary-color);
  background-color: var(--background-primary);
  border-radius: var(--chain-list-item-border-radius);
  margin-top: 0.45rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;

  > div {
    display: flex;
    align-items: center;
    flex-direction: row;
    width: 100%;

    &.header {
      border-bottom: 1px solid var(--border-primary-color);
      border-top-left-radius: var(--chain-list-item-border-radius);
      border-top-right-radius: var(--chain-list-item-border-radius);
      padding: 0.7rem 0.75rem 0.7rem 0.75rem;

      > section {
        display: flex;
        align-items: center;

        /* Header network name and icon display */
        &:first-child {
          flex-grow: 1;

          h3 {
            color: var(--text-color-secondary);
            font-family: InterBold, sans-serif;
            transition: color 0.25s;
          }

          > .icon {
            width: 1.25rem;
            height: 1.25rem;
            margin-right: 0.55rem;
          }
        }

        /* Header connect button display */
        &:last-child {
          flex-shrink: 1;
          padding: 0 0.15rem 0 0.5rem;

          > button {
            color: var(--text-color-tertiary);
            font-family: InterSemiBold, sans-serif;
            display: flex;
            align-items: center;
            font-size: 0.8rem;

            > svg {
              margin-left: 0.4rem;
            }
          }
        }
      }

      &:hover {
        > section {
          &:first-child {
            > h3 {
              color: var(--text-color-primary);
            }
          }
          &:last-child {
            > button {
              color: var(--text-color-primary);
              &:hover {
                color: var(--accent-color-secondary);
              }
            }
          }
        }
      }
    }

    /* Chain metadata display. */
    &.body {
      padding: 0.4rem 0.75rem 0rem 0.75rem;
      > h5 {
        margin-top: 0.15rem;
      }
    }

    /* Chain tags and config controls. */
    &.footer {
      padding: 0.3rem 0.75em 0.6rem 0.75rem;
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      > .tags {
        display: flex;
        margin-top: 0.4rem;

        > div {
          margin-right: 0.45rem;

          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }
  &:hover {
    transform: scale(1.008);
  }
`;