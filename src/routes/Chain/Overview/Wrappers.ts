// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.div`
  flex: 1;

  > .stats {
    font-family: InterSemiBold, sans-serif;
    color: var(--text-color-secondary);
    display: flex;
    margin-top: 0.6rem;
    flex: 1;

    > div {
      margin-right: 1rem;
      display: flex;
      align-items: center;
      font-size: 0.8rem;

      &.active {
        color: var(--accent-color-secondary);
      }

      > .icon {
        fill: var(--accent-color-secondary);
        margin-right: 0.25rem;
        width: 0.7rem;
        height: 0.7rem;
      }

      > span {
        color: var(--text-color-tertiary);
        font-size: 0.7rem;
        margin-right: 0.3rem;
      }
    }
  }
`;

export const CardsWrapper = styled.div`
  flex: 1;
  margin-top: 1.25rem;
  display: flex;
  flex-flow: row wrap;

  > section {
    padding: 0.25rem;
    flex-basis: 50%;

    @media (max-width: 600px) {
      flex-basis: 100%;
    }

    > .inner {
      border: 1px solid var(--border-primary-color);
      background-color: var(--button-tertiary-background);
      border-radius: 0.4rem;
      padding: 0.6rem 0.8rem;

      > h4 {
        color: var(--text-color-secondary);
        display: flex;
        align-items: center;
        margin-bottom: 0.3rem;

        > svg {
          margin-right: 0.3rem;
        }
      }

      > h3 {
        color: var(--text-color-primary);
        font-family: InterBold, sans-serif;
        font-size: 1rem;
        margin-bottom: 0.2rem;

        &.syncing {
          opacity: 0.6;
        }
      }
    }
  }
`;
