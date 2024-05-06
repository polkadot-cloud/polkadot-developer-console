// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

// Outer page wrapper that contains all page content.
export const Wrapper = styled.div`
  flex: 1;
  padding: 0 1rem;

  h3 {
    color: var(--text-color-secondary);
    font-size: 0.98rem;
    margin-top: 0.75rem;
    margin-bottom: 1.5rem;
  }
`;

// Wrapper for the progress bar that shows the current step in the setup process.
export const ProgressWrapper = styled.div`
  --progress-vertical-padding: 1rem;

  @media (max-width: 850px) {
    --progress-vertical-padding: 0.5rem;
  }

  flex: 1;
  margin-top: 0.5rem;
  display: flex;

  > section {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem var(--progress-vertical-padding) 0.5rem 0;
    align-items: center;

    &:first-child {
      padding-left: 0;
    }

    &:last-child,
    &.last {
      padding-right: 0;
    }

    &.spacer {
      padding-left: 0.5rem;
      flex-grow: 1;
    }

    > h4 {
      color: var(--text-color-tertiary);
      font-family: InterSemiBold, sans-serif;

      > svg {
        margin-right: 0.25rem;
      }
    }

    > .connector {
      border-top: 1px solid var(--border-secondary-color);
      width: 100%;
      height: 1px;
    }

    &.active {
      h4 {
        color: var(--accent-color-primary);
      }
    }

    @media (max-width: 850px) {
      &.inactive {
        display: none;
      }
      &.smallOnly {
        display: flex;
        padding-left: 1rem;
      }
    }

    @media (min-width: 851px) {
      &.smallOnly {
        display: none;
      }
    }
  }
`;

// Setup step form wrapper.
export const FormWrapper = styled.div`
  flex: 1;

  > section {
    flex: 1;
    max-width: 650px;
    margin-bottom: 1rem;
  }
`;

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
