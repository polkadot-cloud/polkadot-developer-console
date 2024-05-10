// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const ConnectHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
  padding-bottom: 0.9rem;
  border-bottom: 1px solid var(--border-primary-color);
`;
export const ChainInputWrapper = styled.div`
  width: 100%;

  /* Footer is used for local node. */
  .footer {
    display: flex;
    justify-content: flex-end;
    margin: 0.75rem 0;
    padding: 0 0.25rem;
  }
`;

export const ChainListWrapper = styled.div`
  --chain-list-item-border-radius: 0.75rem;

  display: flex;
  flex-direction: column;
  margin-top: 0.5rem;
  width: 100%;

  > h4 {
    color: var(--text-color-secondary);
    margin-top: 0.75rem;
    display: flex;
    align-items: center;
    padding-left: 0.25rem;

    > span {
      flex-grow: 1;
      text-align: right;
      padding-right: 0.5rem;

      > button {
        color: var(--text-color-tertiary);
        font-size: 0.75rem;

        &:hover {
          color: var(--accent-color-primary);
        }
        > svg {
          margin-right: 0.25rem;
        }
      }
    }
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
      margin-top: 0.65rem;
      margin-bottom: 0.4rem;
    }
    > button {
      margin-right: 0.5rem;
    }
  }
`;

export const SelectOptionWrapper = styled.div`
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
      padding: 0.65rem 0.75rem 0.65rem 0.75rem;

      > section {
        display: flex;
        align-items: center;

        /* Header network name and icon display */
        &:first-child {
          flex-grow: 1;

          h3 {
            color: var(--text-color-primary);
            font-family: InterSemiBold, sans-serif;
            transition: color 0.25s;
          }

          > .icon {
            width: 1.05rem;
            height: 1.05rem;
            margin-right: 0.45rem;

            > svg {
              width: 100%;
              height: 100%;
            }
          }
        }

        /* Header connect button display */
        &:last-child {
          flex-shrink: 1;
          padding: 0 0 0 0.5rem;

          > button {
            color: var(--text-color-secondary);

            .fa-secondary {
              opacity: 0.2;
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
                color: var(--accent-color-primary);
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

        > svg {
          margin-right: 0.15rem;
        }
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
