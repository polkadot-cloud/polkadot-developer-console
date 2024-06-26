// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

// Wrapper for para id reservation option selection.
export const ParaIdOptionsWrapper = styled.div`
  flex: 1;
  margin: 1.25rem 0;
  display: flex;
  flex-wrap: wrap;

  > section {
    flex-basis: 50%;
    height: 8rem;

    &:nth-child(odd) {
      padding-right: 0.5rem;
    }
    &:nth-child(even) {
      padding-left: 0.5rem;
    }

    @media (max-width: 550px) {
      flex-basis: 100%;
      flex-shrink: 0;
      margin-bottom: 1rem;

      &:nth-child(odd) {
        padding-right: 0;
      }
      &:nth-child(even) {
        padding-left: 0;
      }
    }

    > .inner {
      border: 1px solid var(--border-secondary-color);
      background-color: var(--background-default);
      border-radius: 0.4rem;
      position: relative;
      padding: 0.5rem 0.75rem;
      padding-bottom: 2rem;
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      transition: border-color 0.2s;

      &:hover {
        border-color: var(--text-color-tertiary);
      }

      h1 {
        color: var(--text-color-primary);
        text-align: left;
        margin-top: 0.5rem;

        &.standalone {
          margin-top: 2.5rem;
          padding-left: 0.2rem;
        }
      }

      > .input {
        background-color: var(--background-default);
        margin: 0;

        > input {
          color: var(--text-color-primary);
          padding: 0 0.5rem;
          font-size: 1.6rem;
        }
      }

      > h3 {
        color: var(--text-color-secondary);
        margin-bottom: 0.75rem;
      }

      > .foot {
        border-top: 1px solid var(--border-primary-color);
        background-color: var(--background-primary);
        display: flex;
        position: absolute;
        align-items: center;
        bottom: 0;
        left: 0;
        padding: 0.25rem;
        padding-left: 0.5rem;
        width: 100%;
        transition: background-color 0.1s;

        > span {
          color: var(--text-color-tertiary);
          opacity: 0.75;
          display: flex;
          align-items: center;

          &:last-child {
            flex-grow: 1;
            justify-content: flex-end;
            padding-right: 0.5rem;
          }
        }

        &:hover {
          > span > h4 {
            color: var(--text-color-primary);
          }
        }
      }

      &.selected {
        border-color: var(--accent-color-secondary);

        > .foot {
          border-top: 1px solid var(--accent-color-secondary);
          > span {
            opacity: 1;
            > h4,
            > svg {
              color: var(--accent-color-secondary);
            }
          }
        }
      }
    }
  }
`;
