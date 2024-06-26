// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

// Wrapper than contains the footer content for navigating setup steps.
export const FooterWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  margin-top: 1rem;

  > div:first-child {
    flex-grow: 1;
  }

  > div:last-child {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    > div {
      margin-left: 0.7rem;
    }
  }
`;

// Footer button wrapper.
export const FooterButtonWrapper = styled.div`
  > .inner {
    border: 1px solid var(--border-secondary-color);
    background-color: var(--background-primary);
    box-shadow: var(--shadow-input);
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    display: flex;
    align-items: center;
    overflow: hidden;
    width: 100%;
    transition:
      border-color 0.2s,
      background-color 0.2s;

    > button {
      color: var(--text-color-primary);
      font-family: InterBold, sans-serif;
      font-size: 0.95rem;
      flex-grow: 1;
      padding: 0.5rem 0.75rem;
      width: 100%;
      transition: color 0.1s;

      &:focus {
        color: var(--text-color-primary);
      }

      > .iconLeft {
        margin-right: 0.5rem;
      }

      > .iconRight {
        margin-left: 0.5rem;
      }
    }

    &:hover {
      border-color: var(--accent-color-primary);
      background-color: var(--button-primary-background);

      > button {
        color: var(--accent-color-primary);
      }
    }

    &.inactive {
      opacity: 0.3;

      &:hover {
        border-color: var(--border-secondary-color);
        background-color: var(--background-primary);

        > button {
          color: var(--text-color-primary);
          cursor: default;
        }
      }
    }
  }
`;

// Note displayed at the bottom of a setup step, often used to show succesful completion.
export const SetupNote = styled.h4`
  color: var(--text-color-tertiary);
  font-family: InterSemiBold, sans-serif;
  transition: color 0.15s;
  margin: 1.5rem 0 0.5rem 0;

  > svg {
    margin-right: 0.35rem;
  }
`;
