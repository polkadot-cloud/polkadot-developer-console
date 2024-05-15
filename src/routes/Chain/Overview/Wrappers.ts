// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const CardsWrapper = styled.div`
  flex: 1;
  margin-top: 1.25rem;
  display: flex;
  flex-flow: row wrap;

  > section {
    flex-basis: 50%;

    &:nth-child(n) {
      padding-right: 0.5rem;
    }
    &:nth-child(2n) {
      padding-left: 0.5rem;
    }

    @media (max-width: 600px) {
      flex-basis: 100%;
    }

    > .inner {
      border: 1px solid var(--border-primary-color);
      background-color: var(--background-default);
      box-shadow: var(--shadow-dropdown);
      border-radius: 0.5rem;
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

export const Subheading = styled.h4`
  font-family: InterSemiBold, sans-serif;
  flex: 1;
  display: flex;
  align-items: center;
  margin-top: 1.35rem;
  margin-bottom: 0.6rem;
  padding: 0 0.25rem;

  > svg {
    color: var(--text-color-tertiary);
    margin-right: 0.25rem;
    opacity: 0.6;
  }
`;
