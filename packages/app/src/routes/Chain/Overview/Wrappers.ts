// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

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
        display: flex;
        align-items: center;

        > .icon {
          margin-right: 0.2rem;
        }

        &.syncing {
          opacity: 0.6;
        }

        > button {
          margin-right: 1rem;
          display: flex;
          align-items: center;
          > .icon {
            margin-right: 0.2rem;
          }
        }
      }
    }
  }
`;

export const Subheading = styled.h4`
  font-family: InterSemiBold, sans-serif;
  color: var(--text-color-tertiary);
  border-bottom: 1px solid transparent;
  flex: 1;
  display: flex;
  align-items: center;
  margin-top: 2rem;
  margin-bottom: 0.28rem;
  padding: 0 0.2rem 0.1rem 0.2rem;

  &.underlined {
    border-bottom: 1px solid var(--border-primary-color);
    padding-bottom: 0.2rem;
    margin-bottom: 0.25rem;
  }

  > svg {
    color: var(--text-color-tertiary);
    margin-right: 0.3rem;
    opacity: 0.6;
  }
`;
